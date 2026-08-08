import assert from "node:assert/strict";
import {
  createShoppingIntelligenceService,
  createMemoryStorage,
} from "../src/kos/index.js";

const storage = createMemoryStorage();
const clock = () => new Date("2026-08-08T12:00:00.000Z");

const shopping = createShoppingIntelligenceService({
  storage,
  clock,
});

shopping.upsert({
  name: "Chicken Broth",
  quantity: 1,
  unit: "carton",
  source: "manual",
});

shopping.upsert({
  name: "Chicken Broth",
  quantity: 2,
  unit: "carton",
  source: "recipe",
  sourceIds: ["AM-001"],
});

shopping.upsert({
  name: "Onion",
  quantity: 2,
  unit: "each",
  source: "recipe",
  sourceIds: ["AM-001"],
});

let rows = shopping.all();
assert.equal(rows.length, 2);

const broth = rows.find((item) => item.name === "Chicken Broth");
assert.equal(broth.quantity, 3);
assert.equal(shopping.overlaps().length, 1);

shopping.check(broth.id, true);
assert.equal(shopping.summary().checkedItems, 1);
assert.equal(shopping.summary().remainingItems, 1);

shopping.clearChecked();
assert.equal(shopping.all().length, 1);

shopping.remove(shopping.all()[0].id);
assert.equal(shopping.all().length, 0);

shopping.upsert({
  name: "Milk",
  quantity: 1,
  unit: "gallon",
});
shopping.check(shopping.all()[0].id, true);
assert.equal(shopping.summary().complete, true);

const second = createShoppingIntelligenceService({
  storage,
  clock,
});
assert.equal(second.all().length, 1);
assert.equal(second.all()[0].checked, true);

console.log("KOS-500 Shopping Intelligence contracts passed");
