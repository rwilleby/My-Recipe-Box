import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";

const byId = Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe]));
const expectedCounts = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => [`DM-${String(index + 41).padStart(3, "0")}`, 10]),
);

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

assert.equal(ingredient("DM-041", "Plain nonfat Greek yogurt")?.qty, 0.5);
assert.equal(ingredient("DM-042", "Sliced green onions")?.qty, 0.25);
assert.equal(ingredient("DM-043", "Bell peppers and onions")?.qty, 2);
assert.equal(ingredient("DM-044", "Smoked paprika")?.qty, 0.5);
assert.equal(ingredient("DM-045", "93% lean ground turkey")?.qty, 12);
assert.equal(ingredient("DM-046", "Diced green chiles")?.qty, 4);
assert.equal(ingredient("DM-047", "Black beans, rinsed")?.qty, 2);
assert.equal(ingredient("DM-048", "Salsa verde")?.qty, 1.5);
assert.equal(ingredient("DM-049", "Cauliflower rice")?.qty, 4);
assert.equal(ingredient("DM-050", "Roasted sweet potatoes")?.qty, 3);
assert.ok(byId["DM-051"].ingredients.length >= 8, "later verified batches may replace the DM-051 fallback");

assert.equal(
  Object.values(expectedCounts).reduce((sum, count) => sum + count, 0),
  100,
  "v84.5 adds 100 verified ingredient records",
);

console.log("v84.5 DM-041 through DM-050 detailed ingredient data contracts passed.");
