import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";

const byId = Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe]));
const expectedCounts = {
  "DM-011": 10,
  "DM-012": 10,
  "DM-013": 10,
  "DM-014": 11,
  "DM-015": 11,
  "DM-016": 11,
  "DM-017": 10,
  "DM-018": 11,
  "DM-019": 10,
  "DM-020": 11,
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
  { qty: ingredient("DM-011", "Red potatoes, cut into 1-inch pieces")?.qty, unit: ingredient("DM-011", "Red potatoes, cut into 1-inch pieces")?.unit },
  { qty: 1, unit: "lb" },
);
assert.deepEqual(
  { qty: ingredient("DM-012", "Prepared reduced-sodium stuffing")?.qty, unit: ingredient("DM-012", "Prepared reduced-sodium stuffing")?.unit },
  { qty: 4 / 3, unit: "cups" },
);
assert.equal(ingredient("DM-014", "Prepared light macaroni and cheese")?.qty, 2);
assert.equal(ingredient("DM-016", "Reduced-sodium beef broth")?.qty, 1.5);
assert.equal(ingredient("DM-018", "Paprika")?.qty, 0.25);
assert.equal(ingredient("DM-020", "Minced garlic")?.qty, 1);
assert.equal(byId["DM-021"].ingredients.length, 4, "DM-021 begins the next unverified batch");

assert.equal(
  Object.values(expectedCounts).reduce((sum, count) => sum + count, 0),
  105,
  "v84.2 adds 105 verified ingredient records",
);

console.log("v84.2 DM-011 through DM-020 detailed ingredient data contracts passed.");
