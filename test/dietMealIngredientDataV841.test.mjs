import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { formatQty } from "../src/utils/planning.js";

const byId = Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe]));
const expectedCounts = {
  "DM-001": 13,
  "DM-002": 8,
  "DM-003": 10,
  "DM-004": 12,
  "DM-005": 11,
  "DM-006": 12,
  "DM-007": 11,
  "DM-008": 11,
  "DM-009": 12,
  "DM-010": 12,
};

for (const [recipeId, expectedCount] of Object.entries(expectedCounts)) {
  const recipe = byId[recipeId];
  assert.ok(recipe, `${recipeId} must exist`);
  assert.equal(recipe.ingredients.length, expectedCount, `${recipeId} must include every verified card ingredient`);
  for (const ingredient of recipe.ingredients) {
    assert.ok(ingredient.name, `${recipeId} ingredients need names`);
    assert.ok(Number(ingredient.qty) > 0, `${recipeId} ${ingredient.name} needs a positive quantity`);
    assert.ok(ingredient.unit, `${recipeId} ${ingredient.name} needs a unit`);
    assert.ok(ingredient.aisle, `${recipeId} ${ingredient.name} needs a shopping aisle`);
  }
}

function ingredient(recipeId, name) {
  return byId[recipeId].ingredients.find((item) => item.name === name);
}

assert.deepEqual(
  { qty: ingredient("DM-001", "Baby potatoes, halved")?.qty, unit: ingredient("DM-001", "Baby potatoes, halved")?.unit },
  { qty: 12, unit: "oz" },
);
assert.deepEqual(
  { qty: ingredient("DM-002", "Prepared reduced-sodium stuffing")?.qty, unit: ingredient("DM-002", "Prepared reduced-sodium stuffing")?.unit },
  { qty: 4 / 3, unit: "cups" },
);
assert.deepEqual(
  { qty: ingredient("DM-005", "Lower-sodium marinara sauce")?.qty, unit: ingredient("DM-005", "Lower-sodium marinara sauce")?.unit },
  { qty: 1.5, unit: "cups" },
);
assert.equal(ingredient("DM-007", "Small corn tortillas")?.qty, 4);
assert.equal(ingredient("DM-010", "Smoked paprika")?.qty, 0.25);
assert.ok(byId["DM-011"].ingredients.length >= 8, "later verified batches may replace the DM-011 fallback");
assert.equal(formatQty(4 / 3), "1⅓");
assert.equal(formatQty(1 / 3), "⅓");

console.log("v84.1 DM-001 through DM-010 detailed ingredient data contracts passed.");
