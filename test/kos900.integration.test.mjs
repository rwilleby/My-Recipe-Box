import assert from "node:assert/strict";
import {
  createKosPlatform,
  createMemoryStorage,
} from "../src/kos/index.js";

const storage = createMemoryStorage();
const kos = createKosPlatform({
  storage,
  clock: () => new Date("2026-08-08T12:00:00.000Z"),
});

assert.equal(kos.kitchen.health().ok, true);

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

kos.pantry.upsert({
  name: "Milk",
  quantity: 1,
  unit: "gallon",
  location: "refrigerator",
});

kos.mealPlanner.start({ weekOf: "2026-08-10" });
kos.mealPlanner.assign("monday", {
  title: "Beef Stew",
  freezer: true,
});

kos.shopping.upsert({
  name: "Milk",
  quantity: 1,
  unit: "gallon",
});

const home = kos.kitchen.home();
assert.equal(home.inventory.summary.readyMealUnits, 6);
assert.equal(home.inventory.summary.componentUnits, 10);
assert.equal(home.planner.analysis.plannedCount, 1);
assert.equal(home.shopping.summary.totalItems, 1);
assert.equal(home.pantry.summary.itemCount, 1);

const dinnerIntent = kos.kitchen.intent("dinner");
assert.equal(dinnerIntent.contract.id, "dinner");
assert.equal(dinnerIntent.data.readyMeals.length, 1);

const cookIntent = kos.kitchen.intent("cook");
assert.equal(cookIntent.contract.id, "cook");

const availableIntent = kos.kitchen.intent("available");
assert.equal(availableIntent.data.summary.readyMealUnits, 6);

const planIntent = kos.kitchen.intent("plan-week");
assert.equal(planIntent.data.analysis.plannedCount, 1);

const shoppingIntent = kos.kitchen.intent("shopping");
assert.equal(
  shoppingIntent.data.reconciliation[0].alreadyHaveEnough,
  true
);

const secondKos = createKosPlatform({
  storage,
});
assert.equal(secondKos.kitchen.health().ok, true);
assert.equal(secondKos.kitchen.home().planner.analysis.plannedCount, 1);
assert.equal(secondKos.kitchen.home().pantry.summary.itemCount, 1);

console.log("KOS consolidated integration contracts passed");
