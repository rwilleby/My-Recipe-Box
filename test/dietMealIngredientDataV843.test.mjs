import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";

const byId = Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe]));
const expectedCounts = {
  "DM-021": 9,
  "DM-022": 9,
  "DM-023": 10,
  "DM-024": 8,
  "DM-025": 10,
  "DM-026": 9,
  "DM-027": 9,
  "DM-028": 10,
  "DM-029": 10,
  "DM-030": 9,
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

assert.equal(ingredient("DM-021", "Low-sodium marinara")?.qty, 1.5);
assert.equal(ingredient("DM-022", "Low-sodium vegetable broth")?.qty, 0.75);
assert.equal(ingredient("DM-023", "Grated Parmesan")?.qty, 1 / 3);
assert.equal(ingredient("DM-026", "Part-skim ricotta")?.qty, 0.75);
assert.equal(ingredient("DM-027", "Reduced-fat cheddar")?.qty, 1.5);
assert.equal(ingredient("DM-028", "Grated Parmesan")?.qty, 1, "DM-028 preserves the printed 3/3-cup quantity");
assert.equal(ingredient("DM-029", "Basil pesto")?.qty, 1 / 3);
assert.equal(ingredient("DM-030", "Garlic powder")?.qty, 0.25);
assert.equal(byId["DM-031"].ingredients.length, 4, "DM-031 begins the next unverified batch");

assert.equal(
  Object.values(expectedCounts).reduce((sum, count) => sum + count, 0),
  93,
  "v84.3 adds 93 verified ingredient records",
);

console.log("v84.3 DM-021 through DM-030 detailed ingredient data contracts passed.");
