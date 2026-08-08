import assert from "node:assert/strict";
import {
  createKosPlatform,
  createKosUiController,
  createMemoryStorage,
} from "../src/kos/index.js";

const storage = createMemoryStorage();
const kos = createKosPlatform({
  storage,
  clock: () => new Date("2026-08-08T12:00:00.000Z"),
});
const ui = createKosUiController(kos);

let notifications = 0;
const unsubscribe = ui.subscribe((state) => {
  notifications += 1;
  assert.equal(state.health.ok, true);
});

ui.execute("production.start", {
  title: "Crock Pot Chili",
  method: "slow cooker",
  totalYield: 8,
});
assert.equal(kos.productionCenter.active().title, "Crock Pot Chili");

ui.execute("production.finish", {
  eatenNow: 2,
  savedQuantity: 6,
  savedAs: "finished-meal",
  storageLocation: "freezer",
});
assert.equal(kos.availableMeals.summary().portions, 6);

ui.execute("planner.start", { weekOf: "2026-08-10" });
ui.execute("planner.assign", {
  day: "monday",
  meal: { title: "Crock Pot Chili", freezer: true },
});
assert.equal(kos.mealPlanner.analysis().plannedCount, 1);

ui.execute("shopping.add", {
  name: "Milk",
  quantity: 1,
  unit: "gallon",
});
assert.equal(kos.shopping.summary().totalItems, 1);

ui.execute("pantry.upsert", {
  name: "Milk",
  quantity: 1,
  unit: "gallon",
  location: "refrigerator",
});
assert.equal(kos.pantry.summary().itemCount, 1);

const dinnerView = ui.viewIntent("dinner");
assert.equal(dinnerView.contract.id, "dinner");
assert.equal(dinnerView.data.readyMeals.length, 1);

assert.ok(notifications >= 5);
unsubscribe();

const before = notifications;
ui.execute("shopping.clearChecked", {});
assert.equal(notifications, before);

console.log("KOS UI Controller contracts passed");
