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

const milk = kos.pantry.upsert({
  name: "Milk",
  quantity: 1,
  unit: "gallon",
  location: "refrigerator",
  expiresAt: "2026-08-10T12:00:00.000Z",
});

const onions = kos.pantry.upsert({
  name: "Onion",
  quantity: 3,
  unit: "each",
  location: "pantry",
});

assert.equal(kos.pantry.summary().itemCount, 2);
assert.equal(kos.pantry.expiring({ withinDays: 3 }).length, 1);
assert.equal(kos.pantry.get(milk.id).name, "Milk");

kos.pantry.consume(onions.id, 1);
assert.equal(kos.pantry.get(onions.id).quantity, 2);

assert.throws(
  () => kos.pantry.consume(onions.id, 10),
  /only 2 available/
);

kos.shopping.upsert({
  name: "Milk",
  quantity: 1,
  unit: "gallon",
});
kos.shopping.upsert({
  name: "Onion",
  quantity: 4,
  unit: "each",
});
kos.shopping.upsert({
  name: "Bread",
  quantity: 1,
  unit: "loaf",
});

const reconciled = kos.shoppingReconciliation.reconcile();
const milkRow = reconciled.find((item) => item.name === "Milk");
const onionRow = reconciled.find((item) => item.name === "Onion");
const breadRow = reconciled.find((item) => item.name === "Bread");

assert.equal(milkRow.alreadyHaveEnough, true);
assert.equal(onionRow.quantityStillNeeded, 2);
assert.equal(breadRow.quantityStillNeeded, 1);
assert.equal(kos.shoppingReconciliation.summary().alreadyHaveEnough, 1);

console.log("KOS-600 Pantry and Use-What-I-Have contracts passed");
