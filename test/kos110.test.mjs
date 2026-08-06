import assert from "node:assert/strict";
import {
  createKosPlatform,
  createMemoryStorage,
} from "../src/kos/index.js";

const fixedDate = new Date("2026-08-05T18:00:00.000Z");
const kos = createKosPlatform({
  storage: createMemoryStorage(),
  clock: () => fixedDate,
});

assert.equal(kos.workflow.dashboard().counts.totalUnits, 0);
assert.equal(kos.workflow.suggestedActions()[0].id, "start-cooking");

kos.production.quickRecord({
  title: "Crock Pot Beef Stew",
  totalYield: 8,
  eatenNow: 2,
  savedQuantity: 6,
  savedAs: "finished-meal",
});

kos.production.quickRecord({
  title: "Crock Pot Mac & Cheese",
  totalYield: 12,
  eatenNow: 2,
  savedQuantity: 10,
  savedAs: "component",
});

const dashboard = kos.workflow.dashboard();
assert.equal(dashboard.counts.readyMeals, 6);
assert.equal(dashboard.counts.components, 10);
assert.equal(dashboard.counts.totalUnits, 16);

assert.ok(
  dashboard.suggestedActions.some(
    (action) => action.id === "assemble-components"
  )
);
assert.ok(
  dashboard.suggestedActions.some(
    (action) => action.id === "choose-ready-meal"
  )
);

const availableMeals = kos.workflow.available({
  type: "finished-meal",
});
assert.equal(availableMeals.length, 1);
assert.equal(availableMeals[0].name, "Crock Pot Beef Stew");
assert.equal(availableMeals[0].readyToEat, true);

const components = kos.workflow.available({
  type: "component",
});
assert.equal(components.length, 1);
assert.equal(components[0].name, "Crock Pot Mac & Cheese");

assert.equal(kos.workflow.quickStartOptions().length, 4);
assert.equal(kos.workflow.quickStartOptions()[0].id, "cook");
assert.ok(kos.workflow.recentActivity().length >= 2);

console.log("KOS-110 Workflow Service contracts passed");
