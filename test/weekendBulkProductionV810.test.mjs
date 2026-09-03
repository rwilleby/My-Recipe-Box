import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  addWeekendBulkFreezerInventory,
  addWeekendBulkRefrigeratorInventory,
  buildWeekendBulkProductionPayload,
  completeMealDisplayTitle,
  migrateWeekendBulkItem,
  weekendBulkDisposition,
} from "../src/utils/weekendBulkProduction.js";
import {
  createKosPlatform,
  createKosUiController,
  createMemoryStorage,
} from "../src/kos/index.js";

const legacy = migrateWeekendBulkItem({
  id: "SG-002",
  title: "Beef Fajitas",
  batches: 1,
  portions: 8,
  destination: "both",
  refrigeratorPortions: 2,
});
assert.deepEqual(
  [legacy.serveTodayPortions, legacy.refrigeratorPortions, legacy.freezerPortions],
  [0, 2, 6],
);

const fajitas = {
  ...legacy,
  uid: "fajita-batch",
  outputType: "individual-recipe",
  sourceType: "recipe",
  serveTodayPortions: 2,
  refrigeratorPortions: 0,
  freezerPortions: 6,
  labelQuantity: 6,
  package: "Vacuum-seal bag",
  finish: "Sliced",
  createdDate: "2026-08-16",
  freezeUseBy: "2026-11-16",
};
assert.equal(weekendBulkDisposition(fajitas).valid, true);
const fajitaPayload = buildWeekendBulkProductionPayload(fajitas);
assert.equal(fajitaPayload.totalYield, 8);
assert.equal(fajitaPayload.eatenNow, 2);
assert.equal(fajitaPayload.outputs.length, 1);
assert.equal(fajitaPayload.outputs[0].quantity, 6);
assert.equal(fajitaPayload.outputs[0].itemType, "component");
assert.equal(fajitaPayload.outputs[0].recipeId, "SG-002");

let managed = addWeekendBulkFreezerInventory({ version: 1, records: [], customComponents: [], managedItems: [] }, fajitas);
assert.equal(managed.managedItems.length, 1);
assert.equal(managed.managedItems[0].kind, "mainCourse");
assert.equal(managed.managedItems[0].packagesAvailable, 6);
managed = addWeekendBulkFreezerInventory(managed, { ...fajitas, freezerPortions: 2, serveTodayPortions: 6 });
assert.equal(managed.managedItems.length, 1);
assert.equal(managed.managedItems[0].packagesAvailable, 8);

const meal029 = {
  uid: "meal-029-batch",
  id: "meal-029",
  rfisId: "CD-0029",
  title: "BBQ Chicken & Macaroni and Cheese",
  outputType: "complete-meal",
  sourceType: "complete-meal",
  componentRecipeIds: ["AM-041", "SD-007"],
  batches: 1,
  portions: 8,
  serveTodayPortions: 0,
  refrigeratorPortions: 0,
  freezerPortions: 8,
  labelQuantity: 8,
  package: "24oz foil freezer pan",
  finish: "Complete meal",
  createdDate: "2026-08-16",
  freezeUseBy: "2026-11-16",
};
const mealPayload = buildWeekendBulkProductionPayload(meal029);
assert.equal(mealPayload.sessionType, "assemble");
assert.equal(mealPayload.outputs[0].itemType, "finished-meal");
assert.equal(mealPayload.outputs[0].completeDinnerId, "CD-0029");
assert.deepEqual(mealPayload.outputs[0].metadata.componentRecipeIds, ["AM-041", "SD-007"]);
assert.equal(mealPayload.outputs.length, 1, "Complete meal components must not be separately added");

const mealInventory = addWeekendBulkFreezerInventory({ managedItems: [] }, meal029);
assert.deepEqual(
  mealInventory.managedItems.map((item) => [item.kind, item.sourceId, item.packagesAvailable]),
  [["completeMeal", "meal-029", 8]],
);

const refrigerator = addWeekendBulkRefrigeratorInventory({}, {
  ...fajitas,
  serveTodayPortions: 2,
  refrigeratorPortions: 2,
  freezerPortions: 4,
  refrigeratorUseBy: "2026-08-20",
});
assert.equal(refrigerator.customItems.length, 1);
assert.equal(Object.values(refrigerator.items)[0].quantity, 2);

assert.equal(
  completeMealDisplayTitle({ title: "BBQ Chicken", sides: [{ name: "Macaroni and Cheese" }] }),
  "BBQ Chicken & Macaroni and Cheese",
);

const kos = createKosPlatform({
  storage: createMemoryStorage(),
  clock: () => new Date("2026-08-16T12:00:00.000Z"),
});
const ui = createKosUiController(kos);
ui.command("production.record", mealPayload);
assert.equal(kos.availableMeals.summary().portions, 8);
assert.equal(kos.inventory.summary().byType["finished-meal"], 8);

const component = readFileSync(new URL("../src/components/WeekendBulkMealPlanner.jsx", import.meta.url), "utf8");
const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/components/WeekendBulkMealPlanner.v51.css", import.meta.url), "utf8");
for (const contract of [
  "Individual Recipes",
  "Complete Meals",
  "Serve Today",
  "Freezer",
  "production.record",
  "addWeekendBulkFreezerInventory",
]) assert.ok(component.includes(contract), `Missing Bulk Plan v81 contract: ${contract}`);
for (const contract of ["completeMeals={dinnerCombinations}", "setPreparedInventory={setPreparedInventory}", "setRefrigerator={setRefrigerator}"])
  assert.ok(app.includes(contract), `Missing App inventory wiring: ${contract}`);
assert.ok(css.includes('button[aria-selected="true"]'));
assert.ok(css.includes("background:#77716b!important"));
assert.match(component, /const nonVeganRecipes = useMemo\(\(\) => recipes\.filter/);
assert.match(component, /!id\.startsWith\("VG-"\) && !id\.endsWith\("-VG"\)/);
assert.match(component, /\? nonVeganRecipes\.map\(\(recipe\) => \(\{ \.\.\.recipe, sourceType: "recipe" \}\)\)/, "typed All Recipes searches must also exclude Vegan recipes");
assert.doesNotMatch(component, /\? recipes\.map\(\(recipe\) => \(\{ \.\.\.recipe, sourceType: "recipe" \}\)\)/, "the bulk planner must not search the unfiltered recipe library");

console.log("Weekend Bulk Plan v81 production and inventory contracts passed.");
