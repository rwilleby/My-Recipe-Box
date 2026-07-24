const APPLICATION = "Roberts Recipe Box";
const BACKUP_VERSION = 2;
const MIN_SUPPORTED_BACKUP_VERSION = 1;
const STORAGE_PREFIX = "rrb_";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BACKUP_REMINDER_KEY = "rrb_backupReminderSettings";
const DEFAULT_REMINDER_DAYS = 30;
const SNOOZE_DAYS = 3;
const VALID_REMINDER_DAYS = Object.freeze([0, 7, 14, 30, 60, 90]);
const SESSION_DISMISSAL_KEY = "rrb_backupReminderDismissedForSession";

const CATEGORY_DEFINITIONS = Object.freeze([
  { key: "rrb_favorites", label: "Favorites", type: "count" },
  { key: "rrb_recipeNotes", label: "Personal Notes", type: "count" },
  { key: "rrb_groceryLists", label: "Grocery Lists", type: "count" },
  { key: "rrb_weeklyPlan", label: "Meal Plans", type: "filledObject" },
  { key: "rrb_pantryStaples", label: "Pantry Items", type: "truthyObject" },
  { key: "rrb_refrigeratorInventory", label: "Refrigerator Items", type: "count" },
  { key: "rrb_freezerInventory", label: "Freezer Items", type: "count" },
  { key: "rrb_preparedComponentInventory", label: "Prepared Freezer Items", type: "records" },
  { key: "rrb_savedCollections", label: "Saved Collections", type: "count" },
  { key: "rrb_recentlyViewed", label: "Recently Viewed", type: "count" },
  { key: "rrb_cookedRecipes", label: "Cooked Recipes", type: "count" },
  { key: "rrb_personalRatings", label: "Personal Ratings", type: "count" },
  { key: "rrb_checkedShoppingItems", label: "Checked Grocery Items", type: "truthyObject" },
  { key: "rrb_shoppingItemComments", label: "Shopping Comments", type: "count" },
  { key: "rrb_productCategoryAssignments", label: "Product Assignments", type: "count" },
  { key: "rrb_preparedComponentReservations", label: "Prepared Item Reservations", type: "count" },
  { key: "rrb_preparedComponentDecisions", label: "Prepared Item Decisions", type: "count" },
  { key: "rrb_recipeClassifications", label: "Recipe Classifications", type: "count" },
  { key: "rrb_servingSize", label: "Serving Preference", type: "included" },
  { key: "rrb_preferences", label: "Display Preferences", type: "included" },
  { key: "rrb_accessibilityPreferences", label: "Accessibility Preferences", type: "included" },
  { key: BACKUP_REMINDER_KEY, label: "Backup Reminder Preference", type: "included" },
]);

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

function getLocalStorage(storage) {
  if (storage) return storage;
  if (typeof window === "undefined" || !window.localStorage) throw new Error("Browser storage is unavailable.");
  return window.localStorage;
}

function validIsoDate(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function normalizeReminderDays(value) {
  const numeric = Number(value);
  return VALID_REMINDER_DAYS.includes(numeric) ? numeric : DEFAULT_REMINDER_DAYS;
}

function addDays(dateValue, days) {
  const date = new Date(dateValue);
  date.setDate(date.getDate() + days);
  return date;
}

function countCategory(value, type) {
  if (type === "included") return null;
  if (type === "records") return Array.isArray(value?.records) ? value.records.length : 0;
  if (type === "filledObject") {
    if (!isPlainObject(value)) return 0;
    return Object.values(value).filter((entry) => Array.isArray(entry) ? entry.length > 0 : Boolean(entry)).length;
  }
  if (type === "truthyObject") {
    if (!isPlainObject(value)) return 0;
    return Object.values(value).filter(Boolean).length;
  }
  if (Array.isArray(value)) return value.length;
  if (isPlainObject(value)) return Object.keys(value).length;
  return value === undefined || value === null || value === "" ? 0 : 1;
}

export function listRecipeBoxStorageKeys(storage) {
  const localStorageRef = getLocalStorage(storage);
  return Array.from({ length: localStorageRef.length }, (_, index) => localStorageRef.key(index))
    .filter((key) => typeof key === "string" && key.startsWith(STORAGE_PREFIX))
    .sort();
}

export function getBackupReminderSettings(storage) {
  const localStorageRef = getLocalStorage(storage);
  const saved = parseStoredValue(localStorageRef.getItem(BACKUP_REMINDER_KEY));
  const safe = isPlainObject(saved) ? saved : {};
  const reminderStartedAt = validIsoDate(safe.reminderStartedAt) ? safe.reminderStartedAt : new Date().toISOString();

  const normalized = {
    reminderIntervalDays: normalizeReminderDays(safe.reminderIntervalDays),
    reminderStartedAt,
    lastSuccessfulBackupAt: validIsoDate(safe.lastSuccessfulBackupAt) ? safe.lastSuccessfulBackupAt : null,
    reminderSnoozedUntil: validIsoDate(safe.reminderSnoozedUntil) ? safe.reminderSnoozedUntil : null,
    lastRestoredBackupExportedAt: validIsoDate(safe.lastRestoredBackupExportedAt)
      ? safe.lastRestoredBackupExportedAt
      : null,
  };

  if (!isPlainObject(saved) || !validIsoDate(safe.reminderStartedAt)) {
    localStorageRef.setItem(BACKUP_REMINDER_KEY, JSON.stringify(normalized));
  }
  return normalized;
}

export function saveBackupReminderSettings(settings, storage) {
  const localStorageRef = getLocalStorage(storage);
  const normalized = {
    reminderIntervalDays: normalizeReminderDays(settings?.reminderIntervalDays),
    reminderStartedAt: validIsoDate(settings?.reminderStartedAt) ? settings.reminderStartedAt : new Date().toISOString(),
    lastSuccessfulBackupAt: validIsoDate(settings?.lastSuccessfulBackupAt) ? settings.lastSuccessfulBackupAt : null,
    reminderSnoozedUntil: validIsoDate(settings?.reminderSnoozedUntil) ? settings.reminderSnoozedUntil : null,
    lastRestoredBackupExportedAt: validIsoDate(settings?.lastRestoredBackupExportedAt)
      ? settings.lastRestoredBackupExportedAt
      : null,
  };
  localStorageRef.setItem(BACKUP_REMINDER_KEY, JSON.stringify(normalized));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("rrb:backup-status-changed", { detail: normalized }));
  }
  return normalized;
}

export function updateBackupReminderInterval(days, storage) {
  const settings = getBackupReminderSettings(storage);
  return saveBackupReminderSettings({
    ...settings,
    reminderIntervalDays: normalizeReminderDays(days),
    reminderSnoozedUntil: null,
  }, storage);
}

export function snoozeBackupReminder(days = SNOOZE_DAYS, storage) {
  const settings = getBackupReminderSettings(storage);
  return saveBackupReminderSettings({
    ...settings,
    reminderSnoozedUntil: addDays(new Date(), days).toISOString(),
  }, storage);
}

export function dismissBackupReminderForSession() {
  try {
    window.sessionStorage?.setItem(SESSION_DISMISSAL_KEY, "true");
  } catch {
    // Same-session dismissal is helpful but not required for core backup operation.
  }
}

export function isBackupReminderDismissedForSession() {
  try {
    return window.sessionStorage?.getItem(SESSION_DISMISSAL_KEY) === "true";
  } catch {
    return false;
  }
}

export function getBackupStatus(now = new Date(), storage) {
  const settings = getBackupReminderSettings(storage);
  const interval = settings.reminderIntervalDays;
  const remindersEnabled = interval > 0;
  let nextReminderAt = null;

  if (remindersEnabled) {
    const baseline = settings.lastSuccessfulBackupAt
      ? new Date(settings.lastSuccessfulBackupAt)
      : new Date(settings.reminderStartedAt);
    nextReminderAt = addDays(baseline, interval);
    if (settings.reminderSnoozedUntil) {
      const snoozed = new Date(settings.reminderSnoozedUntil);
      if (snoozed > nextReminderAt) nextReminderAt = snoozed;
    }
  }

  const due = remindersEnabled && nextReminderAt && now >= nextReminderAt;
  let statusText = "Your backup is current.";
  if (!remindersEnabled) statusText = "Backup reminders are turned off.";
  else if (!settings.lastSuccessfulBackupAt) statusText = "You have not created a backup yet.";
  else if (due) statusText = "A new backup is recommended.";

  return {
    ...settings,
    remindersEnabled,
    nextReminderAt: nextReminderAt ? nextReminderAt.toISOString() : null,
    due: Boolean(due),
    statusText,
  };
}

export function createRecipeBoxBackup(storage, now = new Date()) {
  const localStorageRef = getLocalStorage(storage);
  const storageData = {};
  listRecipeBoxStorageKeys(localStorageRef).forEach((key) => {
    storageData[key] = parseStoredValue(localStorageRef.getItem(key));
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

export function estimateRecipeBoxBackupSize(storage) {
  const backup = createRecipeBoxBackup(storage);
  return new Blob([JSON.stringify(backup, null, 2)]).size;
}

export function formatByteEstimate(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "Unavailable";
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getRecipeBoxBackupSummary(storage) {
  const localStorageRef = getLocalStorage(storage);
  const known = CATEGORY_DEFINITIONS.map((definition) => {
    const value = parseStoredValue(localStorageRef.getItem(definition.key));
    return {
      key: definition.key,
      label: definition.label,
      count: countCategory(value, definition.type),
      present: value !== undefined,
    };
  });

  const knownKeys = new Set(CATEGORY_DEFINITIONS.map((item) => item.key));
  const additionalCount = listRecipeBoxStorageKeys(localStorageRef)
    .filter((key) => !knownKeys.has(key))
    .length;

  return { categories: known, additionalCount };
}

export function downloadRecipeBoxBackup(storage) {
  const localStorageRef = getLocalStorage(storage);
  const backup = createRecipeBoxBackup(localStorageRef);
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Roberts-Recipe-Box-Backup-${backup.exportedAt.slice(0, 10)}.json`;
  document.body.appendChild(link);

  try {
    link.click();
    const settings = getBackupReminderSettings(localStorageRef);
    saveBackupReminderSettings({
      ...settings,
      lastSuccessfulBackupAt: backup.exportedAt,
      reminderSnoozedUntil: null,
    }, localStorageRef);
    dismissBackupReminderForSession();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("rrb:backup-completed", { detail: { exportedAt: backup.exportedAt } }));
    }
  } finally {
    link.remove();
    URL.revokeObjectURL(url);
  }

  return backup;
}

export function validateRecipeBoxBackup(document) {
  if (!isPlainObject(document)) throw new Error("Invalid backup structure.");
  if (document.application !== APPLICATION) throw new Error("This is not a Robert's Recipe Box backup.");
  if (
    !Number.isInteger(document.backupVersion) ||
    document.backupVersion < MIN_SUPPORTED_BACKUP_VERSION ||
    document.backupVersion > BACKUP_VERSION
  ) {
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

export function restoreRecipeBoxBackup(document, mode = "merge", storage) {
  const localStorageRef = getLocalStorage(storage);
  if (!new Set(["merge", "replace"]).has(mode)) throw new Error("Unknown restore mode.");
  const validated = validateRecipeBoxBackup(document);
  const incoming = validated.data.storage;

  if (mode === "replace") {
    listRecipeBoxStorageKeys(localStorageRef).forEach((key) => localStorageRef.removeItem(key));
  }

  Object.entries(incoming).forEach(([key, value]) => {
    const existing = parseStoredValue(localStorageRef.getItem(key));
    const next = mode === "merge" ? mergeValues(existing, value) : value;
    localStorageRef.setItem(key, JSON.stringify(next));
  });

  const restoredSettings = getBackupReminderSettings(localStorageRef);
  saveBackupReminderSettings({
    ...restoredSettings,
    lastRestoredBackupExportedAt: validated.exportedAt,
  }, localStorageRef);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("rrb:user-data-restored", {
      detail: {
        mode,
        keys: Object.keys(incoming),
        backupVersion: validated.backupVersion,
        restoredBackupExportedAt: validated.exportedAt,
      },
    }));
  }

  return { mode, keys: Object.keys(incoming), restoredBackupExportedAt: validated.exportedAt };
}

export const recipeBoxBackupInfo = Object.freeze({
  application: APPLICATION,
  backupVersion: BACKUP_VERSION,
  minimumSupportedBackupVersion: MIN_SUPPORTED_BACKUP_VERSION,
  storagePrefix: STORAGE_PREFIX,
  maxFileSize: MAX_FILE_SIZE,
  backupReminderKey: BACKUP_REMINDER_KEY,
  defaultReminderDays: DEFAULT_REMINDER_DAYS,
  snoozeDays: SNOOZE_DAYS,
  validReminderDays: VALID_REMINDER_DAYS,
});
