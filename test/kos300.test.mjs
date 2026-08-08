import assert from "node:assert/strict";
import {
  createKosPlatform,
  createMemoryStorage,
} from "../src/kos/index.js";

let now = new Date("2026-08-08T12:00:00.000Z");
const clock = () => new Date(now);

const kos = createKosPlatform({
  storage: createMemoryStorage(),
  clock,
});

kos.actions.cook({
  title: "Beef Stew",
  totalYield: 8,
  eatenNow: 2,
  savedQuantity: 6,
  savedAs: "finished-meal",
  storageLocation: "freezer",
});

kos.actions.cook({
  title: "Mac & Cheese",
  totalYield: 12,
  eatenNow: 2,
  savedQuantity: 10,
  savedAs: "component",
  storageLocation: "refrigerator",
});

const dashboard = kos.inventoryIntelligence.dashboard();
assert.equal(dashboard.summary.readyMealUnits, 6);
assert.equal(dashboard.summary.componentUnits, 10);
assert.equal(dashboard.freezer.length, 1);
assert.equal(dashboard.refrigerator.length, 1);
assert.equal(dashboard.readyToEat[0].name, "Beef Stew");
assert.equal(dashboard.components[0].name, "Mac & Cheese");

const useNext = kos.inventoryIntelligence.useNext();
assert.equal(useNext[0].name, "Mac & Cheese");
assert.equal(useNext[0].reason, "Use refrigerated food first");

const stew = dashboard.readyToEat[0];
kos.inventoryActions.consume({
  lotId: stew.id,
  quantity: 1,
});
assert.equal(
  kos.inventoryIntelligence.dashboard().summary.readyMealUnits,
  5
);

assert.throws(
  () =>
    kos.inventoryActions.consume({
      lotId: stew.id,
      quantity: 10,
    }),
  /only 5 available/
);

const companionAvailable = kos.companion.available();
assert.equal(companionAvailable.summary.readyMealUnits, 5);

console.log("KOS-300 Inventory Intelligence contracts passed");
