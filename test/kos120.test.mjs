import assert from "node:assert/strict";
import {
  createKosPlatform,
  createMemoryStorage,
} from "../src/kos/index.js";

const fixedDate = new Date("2026-08-06T12:00:00.000Z");
const kos = createKosPlatform({
  storage: createMemoryStorage(),
  clock: () => fixedDate,
});

const intentValidation = kos.intents.validate();
assert.equal(intentValidation.ok, true);
assert.equal(intentValidation.intentCount, 8);
assert.equal(intentValidation.slotCountPerIntent, 6);

const cookIntent = kos.intents.contract("cook");
assert.equal(cookIntent.title, "I'm Cooking Today");
assert.equal(cookIntent.slots.length, 6);
assert.equal(cookIntent.slots[0].key, "start");

const defaultIntent = kos.intents.defaultIntent();
assert.equal(defaultIntent.id, "dinner");

const burgers = kos.actions.cook({
  title: "Grilled Hamburger Patties",
  totalYield: 8,
  eatenNow: 2,
  savedQuantity: 6,
  savedAs: "component",
  storageLocation: "refrigerator",
});
const burgerLot = burgers.outputLots[0];

const transformed = kos.actions.transform({
  title: "Beef Patties with Onion Gravy",
  sourceLotId: burgerLot.id,
  sourceQuantity: 4,
  totalYield: 4,
  outputs: [
    {
      name: "Beef Patties with Onion Gravy",
      itemType: "component",
      quantity: 4,
      unit: "servings",
      storageLocation: "refrigerator",
    },
  ],
});
assert.equal(transformed.session.sessionType, "transform");

const gravyLot = transformed.outputLots[0];
const potatoes = kos.actions.cook({
  title: "Mashed Potatoes",
  totalYield: 6,
  savedQuantity: 6,
  savedAs: "component",
  storageLocation: "refrigerator",
}).outputLots[0];
const corn = kos.actions.cook({
  title: "Canned Corn",
  totalYield: 6,
  savedQuantity: 6,
  savedAs: "component",
  storageLocation: "refrigerator",
}).outputLots[0];

const preview = kos.actions.previewBuild({
  components: [
    { lotId: gravyLot.id, quantityPerMeal: 1 },
    { lotId: potatoes.id, quantityPerMeal: 1 },
    { lotId: corn.id, quantityPerMeal: 1 },
  ],
});
assert.equal(preview.capacity, 4);

const assembled = kos.actions.buildMeals({
  title: "Beef Patties and Gravy Dinner",
  quantity: 4,
  components: [
    { lotId: gravyLot.id, quantityPerMeal: 1 },
    { lotId: potatoes.id, quantityPerMeal: 1 },
    { lotId: corn.id, quantityPerMeal: 1 },
  ],
});
assert.equal(assembled.outputLots[0].quantityAvailable, 4);

const bread = kos.actions.cook({
  title: "Older Bread",
  totalYield: 8,
  savedQuantity: 8,
  savedAs: "component",
  storageLocation: "pantry",
}).outputLots[0];

const recovered = kos.actions.recover({
  title: "Bread Pudding",
  sourceLotId: bread.id,
  sourceQuantity: 8,
  totalYield: 8,
  outputs: [
    {
      name: "Bread Pudding Dessert",
      itemType: "dessert",
      quantity: 8,
      unit: "cups",
      storageLocation: "freezer",
    },
  ],
});
assert.equal(recovered.session.sessionType, "recover");

const dessertLot = recovered.outputLots[0];
const packageRecord = kos.actions.packageFood({
  lotId: dessertLot.id,
  packageType: "1-cup deli container",
  packageCount: 8,
  portionSize: 1,
  unit: "cups",
  label: "Bread Pudding",
});
assert.equal(packageRecord.packageCount, 8);

kos.actions.consume({
  lotId: assembled.outputLots[0].id,
  quantity: 1,
});
assert.equal(
  kos.inventory.get(assembled.outputLots[0].id).quantityAvailable,
  3
);

assert.throws(
  () =>
    kos.actions.consume({
      lotId: assembled.outputLots[0].id,
      quantity: 10,
    }),
  /only 3 available/
);

const status = kos.actions.status();
assert.ok(status.counts.readyMeals > 0);

console.log("KOS-120 Intent and Action Service contracts passed");
