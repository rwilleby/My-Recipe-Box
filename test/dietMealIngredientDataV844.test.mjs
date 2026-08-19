import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";

const byId = Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe]));
const expectedCounts = {
  "DM-031": 11,
  "DM-032": 11,
  "DM-033": 11,
  "DM-034": 10,
  "DM-035": 10,
  "DM-036": 10,
  "DM-037": 10,
  "DM-038": 11,
  "DM-039": 10,
  "DM-040": 11,
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

assert.equal(ingredient("DM-031", "Water")?.qty, 0.5);
assert.equal(ingredient("DM-032", "Gochujang")?.qty, 2);
assert.equal(ingredient("DM-033", "Turmeric")?.qty, 0.25);
assert.equal(ingredient("DM-034", "Lean sirloin, thinly sliced")?.qty, 10);
assert.equal(ingredient("DM-035", "Pineapple juice")?.qty, 0.5);
assert.equal(ingredient("DM-036", "Light coconut milk")?.qty, 13.5);
assert.equal(ingredient("DM-038", "Unsalted cashews")?.qty, 1 / 3);
assert.equal(ingredient("DM-039", "Low-sodium chicken broth")?.qty, 0.75);
assert.equal(ingredient("DM-040", "Smoked paprika")?.qty, 0.5);
assert.equal(byId["DM-041"].ingredients.length, 4, "DM-041 begins the next unverified batch");

assert.equal(
  Object.values(expectedCounts).reduce((sum, count) => sum + count, 0),
  105,
  "v84.4 adds 105 verified ingredient records",
);

console.log("v84.4 DM-031 through DM-040 detailed ingredient data contracts passed.");
