import assert from "node:assert/strict";
import { createKosPlatform, createMemoryStorage } from "../src/kos/index.js";

const storage = createMemoryStorage();
const fixedDate = new Date("2026-08-05T18:00:00.000Z");
const kos = createKosPlatform({ storage, clock: () => fixedDate });

// 1. Crock Pot stew: eat 2, freeze 6 finished meals.
const stew = kos.production.quickRecord({
  title: "Crock Pot Beef Stew",
  recipeId: "CP-001",
  method: "slow-cooker",
  totalYield: 8,
  eatenNow: 2,
  savedQuantity: 6,
  savedAs: "finished-meal",
});
assert.equal(stew.session.unallocated, 0);
assert.equal(stew.outputLots[0].quantityAvailable, 6);

// 2. Mac & cheese: eat 2, retain 10 side servings as a component.
const mac = kos.production.quickRecord({
  title: "Crock Pot Mac & Cheese",
  recipeId: "SD-020",
  method: "slow-cooker",
  totalYield: 12,
  eatenNow: 2,
  savedQuantity: 10,
  savedAs: "component",
});
assert.equal(mac.outputLots[0].itemType, "component");

// 3. Smoked/grilled proteins become component lots.
const brisket = kos.production.quickRecord({ title: "Smoked Brisket", method: "smoker", totalYield: 12, savedQuantity: 12, savedAs: "component" });
const chicken = kos.production.quickRecord({ title: "Grilled Chicken Breast", method: "grill", totalYield: 8, savedQuantity: 8, savedAs: "component" });
assert.equal(kos.inventory.summary().byType.component, 30);

// 4. Assemble brisket + mac into six meals.
assert.equal(kos.assembly.capacity([
  { lotId: brisket.outputLots[0].id, quantityPerMeal: 1 },
  { lotId: mac.outputLots[0].id, quantityPerMeal: 1 },
]), 10);
const brisketMeals = kos.assembly.assemble({
  title: "Brisket with Mac & Cheese",
  completeDinnerId: "MEAL-103",
  quantity: 6,
  components: [
    { lotId: brisket.outputLots[0].id, quantityPerMeal: 1 },
    { lotId: mac.outputLots[0].id, quantityPerMeal: 1 },
  ],
  packageType: "meal-prep container",
});
assert.equal(brisketMeals.outputLots[0].quantityAvailable, 6);
assert.equal(kos.inventory.get(brisket.outputLots[0].id).quantityAvailable, 6);
assert.equal(kos.inventory.get(mac.outputLots[0].id).quantityAvailable, 4);

// 5. Transform grilled burger patties into patties with onion gravy.
const burgers = kos.production.quickRecord({ title: "Grilled Hamburger Patties", method: "grill", totalYield: 6, savedQuantity: 6, savedAs: "component", unit: "patties" });
const transformed = kos.production.record({
  sessionType: "transform",
  title: "Beef Patties with Onion Gravy",
  method: "slow-cooker",
  totalYield: 4,
  sourceLotUses: [{ lotId: burgers.outputLots[0].id, quantity: 4 }],
  outputs: [{ name: "Beef Patties with Onion Gravy", itemType: "component", quantity: 4, unit: "servings", storageLocation: "refrigerator" }],
});
assert.equal(kos.inventory.get(burgers.outputLots[0].id).quantityAvailable, 2);
assert.equal(kos.lineage.ancestors(transformed.outputLots[0].id)[0].name, "Grilled Hamburger Patties");

// 6. Recover older bread into bread pudding desserts.
const bread = kos.production.quickRecord({ title: "Older Homemade Bread", method: "baking", totalYield: 8, savedQuantity: 8, savedAs: "component" });
const pudding = kos.production.record({
  sessionType: "recover",
  title: "Bread Pudding",
  method: "oven",
  totalYield: 10,
  sourceLotUses: [{ lotId: bread.outputLots[0].id, quantity: 8 }],
  outputs: [{ name: "Bread Pudding", itemType: "dessert", quantity: 10, unit: "1-cup portions", storageLocation: "freezer" }],
});
kos.packaging.record({ lotId: pudding.outputLots[0].id, packageType: "1-cup deli container", packageCount: 10, portionSize: 1, unit: "dessert portions", label: "Bread Pudding" });
assert.equal(kos.packaging.forLot(pudding.outputLots[0].id)[0].packageCount, 10);

// 7. Quantity safeguard.
assert.throws(() => kos.inventory.consume(burgers.outputLots[0].id, 3), /only 2 available/);
assert.throws(() => kos.production.quickRecord({ title: "Impossible Batch", totalYield: 6, eatenNow: 2, savedQuantity: 5 }), /cannot exceed total yield/);

// 8. Backup and restore.
const backup = kos.repository.exportJson();
const restored = createKosPlatform({ storage: createMemoryStorage(), clock: () => fixedDate });
restored.repository.importJson(backup);
assert.equal(restored.inventory.summary().lotCount, kos.inventory.summary().lotCount);

console.log("KOS-100 Data Foundation contracts passed");
