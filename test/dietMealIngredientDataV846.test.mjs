import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";

const byId = Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe]));
const expectedCounts = {
  "DM-051": 10,
  "DM-052": 10,
  "DM-053": 10,
  "DM-054": 11,
  "DM-055": 10,
  "DM-056": 10,
  "DM-057": 10,
  "DM-058": 10,
  "DM-059": 10,
  "DM-060": 10,
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

assert.equal(ingredient("DM-051", "Coarse black pepper")?.qty, 1);
assert.equal(ingredient("DM-052", "Low-sodium vegetable broth")?.qty, 0.75);
assert.equal(ingredient("DM-053", "Baby potatoes, quartered")?.qty, 1.5);
assert.equal(ingredient("DM-054", "Reduced-sodium soy sauce")?.qty, 0.75);
assert.equal(ingredient("DM-055", "Grated Parmesan")?.qty, 0.5);
assert.equal(ingredient("DM-056", "Cajun seasoning")?.qty, 1);
assert.equal(ingredient("DM-057", "Crumbled feta")?.qty, 0.25);
assert.equal(ingredient("DM-058", "Sweet chili sauce")?.qty, 0.5);
assert.equal(ingredient("DM-059", "Baby potatoes, quartered")?.qty, 1.5);
assert.equal(ingredient("DM-060", "Baby spinach")?.qty, 4);

const allDietMeals = recipes.filter((recipe) => recipe.categoryCode === "DM");
assert.equal(allDietMeals.length, 60);
assert.ok(allDietMeals.every((recipe) => recipe.ingredients.length >= 8));
assert.equal(
  allDietMeals.reduce((sum, recipe) => sum + recipe.ingredients.length, 0),
  616,
  "all 60 Diet Meals must total 616 visually verified ingredient records",
);
assert.equal(
  Object.values(expectedCounts).reduce((sum, count) => sum + count, 0),
  101,
  "v84.6 adds 101 verified ingredient records",
);

console.log("v84.6 DM-051 through DM-060 and complete Diet Meal ingredient data contracts passed.");
