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

assert.equal(kos.productionCenter.active(), null);

const started = kos.productionCenter.start({
  title: "Crock Pot Mac & Cheese",
  method: "slow cooker",
  totalYield: 12,
});
assert.equal(started.status, "cooking");
assert.equal(kos.productionCenter.resumeCard().title, "Crock Pot Mac & Cheese");

// A new platform instance using the same browser storage can resume cooking.
const resumedKos = createKosPlatform({
  storage,
  clock: () => new Date("2026-08-08T13:00:00.000Z"),
});
assert.equal(
  resumedKos.productionCenter.active().title,
  "Crock Pot Mac & Cheese"
);

const finished = resumedKos.productionCenter.finish({
  eatenNow: 2,
  savedQuantity: 10,
  savedAs: "component",
  storageLocation: "refrigerator",
});
assert.equal(finished.activeSession.status, "completed");
assert.equal(resumedKos.productionCenter.active(), null);

resumedKos.actions.cook({
  title: "Beef Stew",
  totalYield: 8,
  eatenNow: 2,
  savedQuantity: 6,
  savedAs: "finished-meal",
  storageLocation: "freezer",
});

const ready = resumedKos.availableMeals.list();
assert.equal(ready.length, 1);
assert.equal(ready[0].name, "Beef Stew");
assert.equal(resumedKos.availableMeals.summary().portions, 6);

resumedKos.availableMeals.consume(ready[0].id, 1);
assert.equal(resumedKos.availableMeals.summary().portions, 5);

const companion = resumedKos.companion.home();
assert.equal(companion.readyMeals.portions, 5);
assert.equal(companion.quickActions.length, 8);

const home = resumedKos.productionCenter.home();
assert.ok(Array.isArray(home.suggestions));
assert.ok(Array.isArray(home.opportunities));
assert.ok(Array.isArray(home.recent));

console.log("KOS-200 Production Center contracts passed");
