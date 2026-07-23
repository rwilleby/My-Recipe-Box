const APPLICATION = "Roberts Recipe Box";
const BACKUP_VERSION = 1;
const STORAGE_PREFIX = "rrb_";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseStoredValue(raw) {
  if (raw === null) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function sanitizeString(value) {
  return value
    .replace(/\u0000/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .slice(0, 100000);
}

function sanitizeValue(value, depth = 0) {
  if (depth > 30) throw new Error("Backup data is nested too deeply.");
  if (value === null || typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "string") return sanitizeString(value);
  if (Array.isArray(value)) return value.slice(0, 50000).map((item) => sanitizeValue(item, depth + 1));
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, 50000)
        .map(([key, item]) => [sanitizeString(String(key)).slice(0, 200), sanitizeValue(item, depth + 1)])
    );
  }
  return undefined;
}

function mergeValues(existing, incoming) {
  if (existing === undefined) return incoming;
  if (incoming === undefined) return existing;

  if (Array.isArray(existing) && Array.isArray(incoming)) {
    const seen = new Set();
    return [...existing, ...incoming].filter((item) => {
      const signature = typeof item === "object" ? JSON.stringify(item) : `${typeof item}:${String(item)}`;
      if (seen.has(signature)) return false;
      seen.add(signature);
      return true;
    });
  }

  if (isPlainObject(existing) && isPlainObject(incoming)) {
    const result = { ...existing };
    Object.entries(incoming).forEach(([key, value]) => {
      result[key] = key in result ? mergeValues(result[key], value) : value;
    });
    return result;
  }

  return incoming;
}

export function listRecipeBoxStorageKeys(storage = window.localStorage) {
  return Array.from({ length: storage.length }, (_, index) => storage.key(index))
    .filter((key) => typeof key === "string" && key.startsWith(STORAGE_PREFIX))
    .sort();
}

export function createRecipeBoxBackup(storage = window.localStorage, now = new Date()) {
  const storageData = {};
  listRecipeBoxStorageKeys(storage).forEach((key) => {
    storageData[key] = parseStoredValue(storage.getItem(key));
  });

  return {
    application: APPLICATION,
    backupVersion: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    data: {
      storage: storageData,
    },
  };
}

export function downloadRecipeBoxBackup() {
  const backup = createRecipeBoxBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Roberts-Recipe-Box-Backup-${backup.exportedAt.slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return backup;
}

export function validateRecipeBoxBackup(document) {
  if (!isPlainObject(document)) throw new Error("Invalid backup structure.");
  if (document.application !== APPLICATION) throw new Error("This is not a Robert's Recipe Box backup.");
  if (!Number.isInteger(document.backupVersion) || document.backupVersion < 1 || document.backupVersion > BACKUP_VERSION) {
    throw new Error("Unsupported backup version.");
  }
  if (typeof document.exportedAt !== "string" || Number.isNaN(Date.parse(document.exportedAt))) {
    throw new Error("Invalid export date.");
  }
  if (!isPlainObject(document.data) || !isPlainObject(document.data.storage)) {
    throw new Error("Backup storage data is missing.");
  }

  const storage = {};
  Object.entries(document.data.storage).forEach(([key, value]) => {
    if (typeof key === "string" && key.startsWith(STORAGE_PREFIX)) {
      storage[key] = sanitizeValue(value);
    }
  });

  return { ...document, data: { ...document.data, storage } };
}

export async function readRecipeBoxBackupFile(file) {
  if (!file || file.size <= 0 || file.size > MAX_FILE_SIZE) throw new Error("Unsupported backup file size.");
  if (!/\.json$/i.test(file.name) && file.type !== "application/json") throw new Error("Select a JSON backup file.");

  let parsed;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }
  return validateRecipeBoxBackup(parsed);
}

export function restoreRecipeBoxBackup(document, mode = "merge", storage = window.localStorage) {
  if (!new Set(["merge", "replace"]).has(mode)) throw new Error("Unknown restore mode.");
  const validated = validateRecipeBoxBackup(document);
  const incoming = validated.data.storage;

  if (mode === "replace") {
    listRecipeBoxStorageKeys(storage).forEach((key) => storage.removeItem(key));
  }

  Object.entries(incoming).forEach(([key, value]) => {
    const existing = parseStoredValue(storage.getItem(key));
    const next = mode === "merge" ? mergeValues(existing, value) : value;
    storage.setItem(key, JSON.stringify(next));
  });

  window.dispatchEvent(new CustomEvent("rrb:user-data-restored", {
    detail: { mode, keys: Object.keys(incoming), backupVersion: validated.backupVersion },
  }));

  return { mode, keys: Object.keys(incoming) };
}

export const recipeBoxBackupInfo = Object.freeze({
  application: APPLICATION,
  backupVersion: BACKUP_VERSION,
  storagePrefix: STORAGE_PREFIX,
  maxFileSize: MAX_FILE_SIZE,
});
