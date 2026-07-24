import {
  createBackupDocument,
  validateBackupDocument,
  restoreBackupDocument,
} from "./utils/backupService.js";

class MemoryStorage {
  constructor(seed = {}) { this.map = new Map(Object.entries(seed)); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

const storage = new MemoryStorage({
  rrb_favorites: JSON.stringify(["AM-001"]),
  rrb_weeklyPlan: JSON.stringify({ "week1-Mon": ["AM-001"] }),
});

const backup = createBackupDocument(storage, new Date("2026-07-23T12:00:00.000Z"));
validateBackupDocument(backup);

const target = new MemoryStorage({
  rrb_favorites: JSON.stringify(["AS-001"]),
});

restoreBackupDocument(backup, "merge", target);

const favorites = JSON.parse(target.getItem("rrb_favorites"));
if (!favorites.includes("AM-001") || !favorites.includes("AS-001")) {
  throw new Error("Merge restore test failed.");
}

console.log("backupService tests passed");
