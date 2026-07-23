const APPLICATION_NAME = "Roberts Recipe Box";
const BACKUP_VERSION = 1;
const MAX_BACKUP_BYTES = 5 * 1024 * 1024;

export const USER_DATA_STORAGE_MAP = Object.freeze({
  favorites: "rrb_favorites",
  mealPlans: "rrb_weeklyPlan",
  servingSize: "rrb_servingSize",
  checkedShoppingItems: "rrb_checkedShoppingItems",
  pantry: "rrb_pantryStaples",
  refrigerator: "rrb_refrigeratorInventory",
  freezer: "rrb_freezerInventory",
  recipeClassifications: "rrb_recipeClassifications",
  notes: "rrb_recipeNotes",
  groceryLists: "rrb_groceryLists",
  savedCollections: "rrb_savedCollections",
  recentlyViewed: "rrb_recentlyViewed",
  cookedRecipes: "rrb_cookedRecipes",
  personalRatings: "rrb_personalRatings",
  preferences: "rrb_preferences",
  accessibilityPreferences: "rrb_accessibilityPreferences",
});

const KNOWN_CATEGORIES = Object.keys(USER_DATA_STORAGE_MAP);

function safeParse(rawValue) {
  if (rawValue === null || rawValue === undefined || rawValue === "") return undefined;
  try {
    return JSON.parse(rawValue);
  } catch {
    return rawValue;
  }
}

function cloneData(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function sanitizeString(value) {
  return value
    .replace(/\u0000/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .slice(0, 100000);
}

function sanitizeImportedValue(value, depth = 0) {
  if (depth > 30) throw new Error("Backup nesting is too deep.");
  if (typeof value === "string") return sanitizeString(value);
  if (typeof value === "number" || typeof value === "boolean" || value === null) return value;
  if (Array.isArray(value)) return value.slice(0, 50000).map((item) => sanitizeImportedValue(item, depth + 1));
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .slice(0, 50000)
        .map(([key, item]) => [sanitizeString(String(key)).slice(0, 200), sanitizeImportedValue(item, depth + 1)])
    );
  }
  return undefined;
}

function mergeValues(existing, incoming) {
  if (incoming === undefined) return cloneData(existing);
  if (existing === undefined) return cloneData(incoming);

  if (Array.isArray(existing) && Array.isArray(incoming)) {
    const seen = new Set();
    return [...existing, ...incoming].filter((item) => {
      const identity = typeof item === "object" ? JSON.stringify(item) : `${typeof item}:${String(item)}`;
      if (seen.has(identity)) return false;
      seen.add(identity);
      return true;
    });
  }

  if (isPlainObject(existing) && isPlainObject(incoming)) {
    const merged = { ...cloneData(existing) };
    Object.entries(incoming).forEach(([key, value]) => {
      merged[key] = key in merged ? mergeValues(merged[key], value) : cloneData(value);
    });
    return merged;
  }

  return cloneData(incoming);
}

function getStorage(storage) {
  if (storage) return storage;
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("Browser storage is not available.");
  }
  return window.localStorage;
}

export function collectUserData(storage) {
  const localStorageRef = getStorage(storage);
  const data = {};

  Object.entries(USER_DATA_STORAGE_MAP).forEach(([category, key]) => {
    const rawValue = localStorageRef.getItem(key);
    if (rawValue !== null) data[category] = safeParse(rawValue);
  });

  return data;
}

export function createBackupDocument(storage, now = new Date()) {
  return {
    application: APPLICATION_NAME,
    backupVersion: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    data: collectUserData(storage),
  };
}

export function downloadBackup(storage) {
  const backup = createBackupDocument(storage);
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const date = backup.exportedAt.slice(0, 10);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `Roberts-Recipe-Box-Backup-${date}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  return backup;
}

export async function readBackupFile(file) {
  if (!file) throw new Error("No backup file was selected.");
  if (file.size <= 0 || file.size > MAX_BACKUP_BYTES) {
    throw new Error("Backup file size is not supported.");
  }
  if (!/\.json$/i.test(file.name) && file.type !== "application/json") {
    throw new Error("Please select a JSON backup file.");
  }

  let parsed;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }

  return validateBackupDocument(parsed);
}

export function validateBackupDocument(document) {
  if (!isPlainObject(document)) throw new Error("Invalid backup structure.");
  if (document.application !== APPLICATION_NAME) throw new Error("This is not a Robert's Recipe Box backup.");
  if (!Number.isInteger(document.backupVersion) || document.backupVersion < 1 || document.backupVersion > BACKUP_VERSION) {
    throw new Error("This backup version is not supported.");
  }
  if (typeof document.exportedAt !== "string" || Number.isNaN(Date.parse(document.exportedAt))) {
    throw new Error("The backup export date is invalid.");
  }
  if (!isPlainObject(document.data)) throw new Error("The backup does not contain a valid data section.");

  const data = {};
  KNOWN_CATEGORIES.forEach((category) => {
    if (Object.prototype.hasOwnProperty.call(document.data, category)) {
      data[category] = sanitizeImportedValue(document.data[category]);
    }
  });

  return { ...document, data };
}

export function restoreBackupDocument(document, mode = "merge", storage) {
  if (!["merge", "replace"].includes(mode)) throw new Error("Unknown restore mode.");
  const localStorageRef = getStorage(storage);
  const validated = validateBackupDocument(document);
  const restoredCategories = [];

  Object.entries(USER_DATA_STORAGE_MAP).forEach(([category, key]) => {
    if (!Object.prototype.hasOwnProperty.call(validated.data, category)) {
      if (mode === "replace") localStorageRef.removeItem(key);
      return;
    }

    const incoming = validated.data[category];
    const existing = safeParse(localStorageRef.getItem(key));
    const nextValue = mode === "merge" ? mergeValues(existing, incoming) : incoming;
    localStorageRef.setItem(key, JSON.stringify(nextValue));
    restoredCategories.push(category);
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("rrb:user-data-restored", {
      detail: { mode, restoredCategories, backupVersion: validated.backupVersion },
    }));
    window.dispatchEvent(new Event("storage"));
  }

  return { mode, restoredCategories };
}

export const backupServiceConstants = {
  applicationName: APPLICATION_NAME,
  backupVersion: BACKUP_VERSION,
  maxBackupBytes: MAX_BACKUP_BYTES,
};
