import assert from "node:assert/strict";
import {
  createKosPlatform,
  createKosUiController,
  createMemoryStorage,
} from "../src/kos/index.js";

const kos = createKosPlatform({
  storage: createMemoryStorage(),
  clock: () => new Date("2026-08-08T12:00:00.000Z"),
});

const ids = [
  "dinner",
  "plan-week",
  "cook",
  "freezer-meals",
  "available",
  "shopping",
  "recipes",
  "learn",
];

for (const id of ids) {
  const model = kos.screenModels.screen(id);
  assert.ok(model);
  assert.equal(model.id, id);
  assert.equal(model.slots.length, 6);
  assert.deepEqual(
    model.slots.map((slot) => slot.key),
    [
      "start",
      "workspace",
      "assistant",
      "suggestions",
      "progress",
      "wisdom",
    ]
  );
}

assert.equal(kos.screenModels.all().length, 8);

const ui = createKosUiController(kos);
assert.equal(ui.screenModel("dinner").id, "dinner");
assert.equal(ui.screenModel("cook").slots.length, 6);

kos.actions.cook({
  title: "Beef Stew",
  totalYield: 8,
  eatenNow: 2,
  savedQuantity: 6,
  savedAs: "finished-meal",
  storageLocation: "freezer",
});

const availableModel = ui.screenModel("available");
const readySlot = availableModel.slots.find(
  (slot) => slot.key === "workspace"
);
assert.equal(readySlot.data.length, 1);
assert.equal(readySlot.data[0].name, "Beef Stew");

console.log("KOS-730 Intent Screen Model contracts passed");
