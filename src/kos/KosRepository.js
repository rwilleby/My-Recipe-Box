import { clone, KOS_SCHEMA_VERSION } from "./kosCore.js";

const EMPTY_STATE = Object.freeze({
  schemaVersion: KOS_SCHEMA_VERSION,
  sessions: [],
  inventoryLots: [],
  inventoryEvents: [],
  packages: [],
  consumptionEvents: [],
});

export function createMemoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem(key) { return map.has(key) ? map.get(key) : null; },
    setItem(key, value) { map.set(key, String(value)); },
    removeItem(key) { map.delete(key); },
    clear() { map.clear(); },
  };
}

export function createKosRepository({
  storage = globalThis.localStorage,
  storageKey = "rrb-kos-v1",
} = {}) {
  if (!storage) throw new Error("KOS repository requires a storage adapter");

  function migrate(state) {
    const source = state && typeof state === "object" ? state : {};
    return {
      schemaVersion: KOS_SCHEMA_VERSION,
      sessions: Array.isArray(source.sessions) ? source.sessions : [],
      inventoryLots: Array.isArray(source.inventoryLots) ? source.inventoryLots : [],
      inventoryEvents: Array.isArray(source.inventoryEvents) ? source.inventoryEvents : [],
      packages: Array.isArray(source.packages) ? source.packages : [],
      consumptionEvents: Array.isArray(source.consumptionEvents) ? source.consumptionEvents : [],
    };
  }

  function load() {
    const raw = storage.getItem(storageKey);
    if (!raw) return clone(EMPTY_STATE);
    try {
      return migrate(JSON.parse(raw));
    } catch {
      return clone(EMPTY_STATE);
    }
  }

  function save(state) {
    const migrated = migrate(state);
    storage.setItem(storageKey, JSON.stringify(migrated));
    return clone(migrated);
  }

  function update(mutator) {
    const state = load();
    const next = mutator(state) || state;
    return save(next);
  }

  function exportJson() {
    return JSON.stringify(load(), null, 2);
  }

  function importJson(json) {
    const parsed = typeof json === "string" ? JSON.parse(json) : json;
    return save(parsed);
  }

  function reset() {
    storage.removeItem(storageKey);
    return load();
  }

  return Object.freeze({ load, save, update, exportJson, importJson, reset, storageKey });
}

export default createKosRepository;
