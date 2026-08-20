import assert from "node:assert/strict";
import {
  createRecipeBoxBackup,
  restoreRecipeBoxBackup,
  validateRecipeBoxBackup,
} from "../src/utils/recipeBoxBackup.js";

class MemoryStorage {
  constructor(seed = {}) { this.map = new Map(Object.entries(seed)); }
  get length() { return this.map.size; }
  key(index) { return [...this.map.keys()][index] ?? null; }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

const source = new MemoryStorage({
  rrb_favorites: JSON.stringify(["DM-001"]),
  rrb_weeklyPlan: JSON.stringify({ "week1-Mon": ["DM-001"] }),
  "rrb-recipe-note-DM-001": "Use less salt",
  "rrb-weekly-planner-notes": JSON.stringify({ "week1-Mon": "Thaw chicken" }),
  "rrb-weekly-planner-week-start": "2026-08-16",
  "kos.mealPlanner.week.v1": JSON.stringify({
    id: "current-week",
    weekOf: "2026-08-16",
    days: {
      monday: { title: "Chicken Parmesan", recipeId: "DM-005" },
    },
  }),
  "rrb-kos-v1": JSON.stringify({ inventory: { portions: 6 } }),
  rrb_weekendBulkMealPlanner_v1: JSON.stringify({ rows: [{ recipeId: "SG-002" }] }),
  unrelated_application_key: "do not export",
});

const backup = createRecipeBoxBackup(source, new Date("2026-08-18T12:00:00.000Z"));
assert.equal(backup.backupVersion, 3);
assert.equal(backup.data.storage["rrb-recipe-note-DM-001"], "Use less salt");
assert.deepEqual(backup.data.storage["rrb-kos-v1"], { inventory: { portions: 6 } });
assert.equal(backup.data.storage["rrb-weekly-planner-week-start"], "2026-08-16");
assert.equal(
  backup.data.storage["kos.mealPlanner.week.v1"].days.monday.recipeId,
  "DM-005"
);
assert.equal(backup.data.storage.unrelated_application_key, undefined);
validateRecipeBoxBackup(backup);

const restored = new MemoryStorage();
restoreRecipeBoxBackup(backup, "replace", restored);
assert.equal(restored.getItem("rrb-recipe-note-DM-001"), JSON.stringify("Use less salt"));
assert.deepEqual(JSON.parse(restored.getItem("rrb-weekly-planner-notes")), { "week1-Mon": "Thaw chicken" });
assert.equal(JSON.parse(restored.getItem("rrb-weekly-planner-week-start")), "2026-08-16");
assert.equal(
  JSON.parse(restored.getItem("kos.mealPlanner.week.v1")).days.monday.recipeId,
  "DM-005"
);
assert.deepEqual(JSON.parse(restored.getItem("rrb-kos-v1")), { inventory: { portions: 6 } });

const legacy = {
  application: "Roberts Recipe Box",
  backupVersion: 1,
  exportedAt: "2026-07-23T12:00:00.000Z",
  data: {
    favorites: ["AM-001"],
    mealPlans: { "week1-Mon": ["AM-001"] },
  },
};
const legacyTarget = new MemoryStorage();
restoreRecipeBoxBackup(legacy, "replace", legacyTarget);
assert.deepEqual(JSON.parse(legacyTarget.getItem("rrb_favorites")), ["AM-001"]);
assert.deepEqual(JSON.parse(legacyTarget.getItem("rrb_weeklyPlan")), { "week1-Mon": ["AM-001"] });

console.log("v83.0 comprehensive backup coverage and legacy restore tests passed.");
