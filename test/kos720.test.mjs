import assert from "node:assert/strict";
import {
  createKosPlatform,
  createMemoryStorage,
  createKosUiController,
} from "../src/kos/index.js";

const storage = createMemoryStorage();
const kos = createKosPlatform({
  storage,
  clock: () => new Date("2026-08-08T12:00:00.000Z"),
});

const ui = createKosUiController(kos);

assert.equal(ui.snapshot().health.ok, true);
assert.equal(ui.viewIntent("dinner").contract.id, "dinner");

let emissions = 0;
const unsubscribe = ui.subscribe((state) => {
  emissions += 1;
  assert.equal(state.health.ok, true);
});

ui.command("production.start", {
  title: "Mac & Cheese",
  method: "slow cooker",
  totalYield: 10,
});
assert.equal(kos.productionCenter.active().title, "Mac & Cheese");
assert.equal(emissions, 1);

ui.command("production.finish", {
  eatenNow: 2,
  savedQuantity: 8,
  savedAs: "component",
  storageLocation: "refrigerator",
});
assert.equal(kos.productionCenter.active(), null);
assert.equal(emissions, 2);

ui.command("planner.start", {
  weekOf: "2026-08-10",
});
ui.command("planner.assign", {
  day: "monday",
  meal: {
    title: "Chicken Dinner",
    cuisine: "American",
  },
});
assert.equal(ui.snapshot().planner.analysis.plannedCount, 1);

ui.command("shopping.add", {
  name: "Milk",
  quantity: 1,
  unit: "gallon",
});
assert.equal(ui.snapshot().shopping.summary.totalItems, 1);

ui.command("pantry.add", {
  name: "Milk",
  quantity: 1,
  unit: "gallon",
  location: "refrigerator",
});
assert.equal(ui.snapshot().pantry.summary.itemCount, 1);

unsubscribe();

console.log("KOS-720 UI Controller contracts passed");
