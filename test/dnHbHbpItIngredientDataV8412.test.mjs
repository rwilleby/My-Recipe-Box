import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";

const expected = {
  DN: [13,13,14,14,12,15,14],
  HB: [12,11,12,12,12,12,11,10,11,10,11,10,9,9,10,12,11,12,11,10,11,12,9,10,10,10,9,10,9,9,20],
  HBP: [5,5,5,6,6,6,6,6,6,6,6,13],
  IT: [12,12,12,12,12,13,11,12,12,12,10,9,10,11,12,11,10,9,9,10,10,11,11,11,8,9,9,10,9,10,11,11,11,11,11,11,11,11,11,11,10,10,10,10,10,10,10,10,10,10,11,12,12,12,11,12,11,12,12,12],
};

const expectedRecipeCounts = { DN: 7, HB: 31, HBP: 12, IT: 60 };
const expectedIngredientTotals = { DN: 95, HB: 337, HBP: 76, IT: 646 };
const byId = Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe]));

for (const prefix of Object.keys(expected)) {
  const categoryRecipes = recipes.filter((recipe) => recipe.id.startsWith(`${prefix}-`));
  assert.equal(categoryRecipes.length, expectedRecipeCounts[prefix], `${prefix} recipe count`);
  assert.deepEqual(categoryRecipes.map((recipe) => recipe.ingredients.length), expected[prefix], `${prefix} card counts`);
  assert.equal(categoryRecipes.reduce((sum, recipe) => sum + recipe.ingredients.length, 0), expectedIngredientTotals[prefix], `${prefix} ingredient total`);
  categoryRecipes.forEach((recipe) => recipe.ingredients.forEach((ingredient) => {
    assert.ok(ingredient.name, `${recipe.id} ingredient needs a name`);
    assert.ok(Number(ingredient.qty) > 0, `${recipe.id} ${ingredient.name} needs a positive quantity`);
    assert.ok(ingredient.unit, `${recipe.id} ${ingredient.name} needs a unit`);
    assert.ok(ingredient.aisle, `${recipe.id} ${ingredient.name} needs an aisle`);
  }));
}

assert.equal(Object.values(expectedIngredientTotals).reduce((sum, count) => sum + count, 0), 1154);

for (const prefix of Object.keys(expected)) {
  const rows = JSON.parse(fs.readFileSync(new URL(`../src/data/nutrition/${prefix}.json`, import.meta.url)));
  rows.forEach((row) => assert.equal(byId[row.recipeCode].title, row.title, `${row.recipeCode} title alignment`));
}

assert.ok(byId["DN-001"].ingredients.some((item) => item.name === "Vegetable oil for frying" && item.unit === "amount not specified"));
assert.ok(byId["DN-007"].ingredients.some((item) => item.name.startsWith("Fresh blueberries") && item.qty === 1));
assert.ok(byId["HB-025"].ingredients.some((item) => item.name === "Ground beef, 80/20" && item.qty === 1.25));
assert.ok(byId["HB-031"].ingredients.some((item) => item.name === "Soft hamburger bun" && item.unit === "each per burger"));
assert.ok(!byId["HB-031"].ingredients.some((item) => item.name === "Thin griddled patty"), "derived patties must not double-count patty ingredients");
assert.ok(!byId["HB-031"].ingredients.some((item) => item.name === "Chili sauce"), "derived chili sauce must not double-count chili ingredients");
assert.ok(byId["HBP-012"].ingredients.some((item) => item.name === "Ground beef" && item.qty === 2));
assert.ok(byId["IT-032"].ingredients.some((item) => item.name === "Bay scallops" && item.qty === 0.5 && item.unit === "lb"));
assert.ok(byId["IT-037"].ingredients.some((item) => item.name === "Red pepper flakes" && item.qty === 0.5));
assert.ok(!byId["IT-015"].ingredients.some((item) => /parmesan|parsley/i.test(item.name)), "directions-only garnish must not be invented as a measured ingredient");
assert.ok(!byId["IT-056"].ingredients.some((item) => item.name === "Black pepper"), "IT-056 must follow the printed ingredient list");

console.log("v84.12 DN, HB, HBP, and IT ingredient-data contracts passed.");
