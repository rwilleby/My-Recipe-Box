import { clone, isoNow, KOS_SCHEMA_VERSION } from "./kosCore.js";

const EMPTY_STATE = Object.freeze({
  schemaVersion: KOS_SCHEMA_VERSION,
  sessions: [],
  inventoryLots: [],
  inventoryEvents: [],
  packages: [],
  consumptionEvents: [],
  templates: [],
});

function checksum(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function createMemoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem(key) { return map.has(key) ? map.get(key) : null; },
    setItem(key, value) { map.set(key, String(value)); },
    removeItem(key) { map.delete(key); },
    clear() { map.clear(); },
    keys() { return [...map.keys()]; },
  };
}

export function createKosRepository({
  storage = globalThis.localStorage,
  storageKey = "rrb-kos-v1",
  clock = () => new Date(),
  recoveryLimit = 20,
} = {}) {
  if (!storage) throw new Error("KOS repository requires a storage adapter");

  const recoveryIndexKey = `${storageKey}:recovery:index`;
  const externalBackupKey = `${storageKey}:external-backup:last`;

  function migrate(state) {
    const source = state && typeof state === "object" ? state : {};
    return {
      schemaVersion: KOS_SCHEMA_VERSION,
      sessions: Array.isArray(source.sessions) ? source.sessions : [],
      inventoryLots: Array.isArray(source.inventoryLots) ? source.inventoryLots : [],
      inventoryEvents: Array.isArray(source.inventoryEvents) ? source.inventoryEvents : [],
      packages: Array.isArray(source.packages) ? source.packages : [],
      consumptionEvents: Array.isArray(source.consumptionEvents) ? source.consumptionEvents : [],
      templates: Array.isArray(source.templates) ? source.templates : [],
    };
  }

  function recoveryKey(id) {
    return `${storageKey}:recovery:${id}`;
  }

  function loadRecoveryIndex() {
    try {
      const parsed = JSON.parse(storage.getItem(recoveryIndexKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveRecoveryIndex(index) {
    storage.setItem(recoveryIndexKey, JSON.stringify(index));
  }

  function readRecoveryPoint(entry) {
    try {
      const raw = storage.getItem(recoveryKey(entry.id));
      if (!raw || checksum(raw) !== entry.checksum) return null;
      return migrate(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  function listRecoveryPoints() {
    return loadRecoveryIndex()
      .filter((entry) => readRecoveryPoint(entry))
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .map((entry) => clone(entry));
  }

  function createRecoveryPoint(reason = "automatic", state = null) {
    const snapshot = migrate(state || load({ recover: false }));
    const raw = JSON.stringify(snapshot);
    const createdAt = isoNow(clock);
    const id = `${createdAt.replace(/[-:.TZ]/g, "")}-${checksum(raw)}`;
    const entry = {
      id,
      createdAt,
      reason,
      checksum: checksum(raw),
      schemaVersion: snapshot.schemaVersion,
    };

    storage.setItem(recoveryKey(id), raw);
    const index = [entry, ...loadRecoveryIndex().filter((item) => item.id !== id)];
    const retained = index.slice(0, Math.max(1, recoveryLimit));
    const removed = index.slice(retained.length);
    for (const item of removed) storage.removeItem(recoveryKey(item.id));
    saveRecoveryIndex(retained);
    return clone(entry);
  }

  function newestValidRecovery() {
    for (const entry of listRecoveryPoints()) {
      const state = readRecoveryPoint(entry);
      if (state) return { entry, state };
    }
    return null;
  }

  function load({ recover = true } = {}) {
    const raw = storage.getItem(storageKey);
    if (!raw) return clone(EMPTY_STATE);
    try {
      return migrate(JSON.parse(raw));
    } catch {
      if (recover) {
        const fallback = newestValidRecovery();
        if (fallback) {
          storage.setItem(storageKey, JSON.stringify(fallback.state));
          return clone(fallback.state);
        }
      }
      return clone(EMPTY_STATE);
    }
  }

  function save(state, { snapshotReason = "automatic" } = {}) {
    const migrated = migrate(state);
    const raw = JSON.stringify(migrated);
    storage.setItem(storageKey, raw);
    createRecoveryPoint(snapshotReason, migrated);
    return clone(migrated);
  }

  function update(mutator, { snapshotReason = "transaction" } = {}) {
    const state = load();
    const next = mutator(state) || state;
    return save(next, { snapshotReason });
  }

  function restoreRecoveryPoint(id) {
    const entry = loadRecoveryIndex().find((item) => item.id === id);
    if (!entry) throw new Error(`Recovery point not found: ${id}`);
    const recovered = readRecoveryPoint(entry);
    if (!recovered) throw new Error(`Recovery point is damaged: ${id}`);
    createRecoveryPoint("before-recovery-restore");
    return save(recovered, { snapshotReason: "recovery-restored" });
  }

  function exportJson() {
    return JSON.stringify(load(), null, 2);
  }

  function importJson(json) {
    createRecoveryPoint("before-import");
    const parsed = typeof json === "string" ? JSON.parse(json) : json;
    return save(parsed, { snapshotReason: "imported" });
  }

  function exportBackup() {
    const state = load();
    const payload = JSON.stringify(state);
    const createdAt = isoNow(clock);
    const envelope = {
      format: "roberts-recipe-box-backup",
      backupVersion: 1,
      createdAt,
      schemaVersion: state.schemaVersion,
      checksum: checksum(payload),
      data: state,
    };
    storage.setItem(externalBackupKey, createdAt);
    return JSON.stringify(envelope, null, 2);
  }

  function verifyBackup(backup) {
    try {
      const envelope = typeof backup === "string" ? JSON.parse(backup) : backup;
      if (envelope?.format !== "roberts-recipe-box-backup") {
        return { ok: false, reason: "Unknown backup format" };
      }
      const payload = JSON.stringify(envelope.data);
      if (checksum(payload) !== envelope.checksum) {
        return { ok: false, reason: "Backup integrity check failed" };
      }
      return {
        ok: true,
        createdAt: envelope.createdAt,
        schemaVersion: envelope.schemaVersion,
      };
    } catch {
      return { ok: false, reason: "Backup is not valid JSON" };
    }
  }

  function importBackup(backup) {
    const verification = verifyBackup(backup);
    if (!verification.ok) throw new Error(verification.reason);
    const envelope = typeof backup === "string" ? JSON.parse(backup) : backup;
    createRecoveryPoint("before-external-restore");
    return save(envelope.data, { snapshotReason: "external-backup-restored" });
  }

  function lastExternalBackupAt() {
    return storage.getItem(externalBackupKey) || null;
  }

  function reset() {
    createRecoveryPoint("before-reset");
    storage.removeItem(storageKey);
    return load();
  }

  return Object.freeze({
    load,
    save,
    update,
    exportJson,
    importJson,
    exportBackup,
    importBackup,
    verifyBackup,
    lastExternalBackupAt,
    createRecoveryPoint,
    listRecoveryPoints,
    restoreRecoveryPoint,
    reset,
    storageKey,
    storage,
  });
}

export default createKosRepository;
