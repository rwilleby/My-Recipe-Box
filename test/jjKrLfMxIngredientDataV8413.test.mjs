import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";

const expected = {
  JJ: [5,5,6,6,5,9,11,9,8,10,8,7,9,6,6,6,6,6,6,6,6,6,6,6,6],
  KR: [4,4,8,8,6,4,3],
  LF: [6,7,6,7,7,8,9,9,11,9,12,14,5,5,4,0,0],
  MX: [13,14,13,13,13,12,13,13,11,10,14,16,12,11,11,11,11,9,8,9,14,13,15,15,14,10,13,12,9,12,11,11,9,14,12,12,8,9,8,10,12,9,9,4],
};

const expectedRecipeCounts = { JJ: 25, KR: 7, LF: 17, MX: 44 };
const expectedIngredientTotals = { JJ: 170, KR: 37, LF: 119, MX: 502 };
const byId = Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe]));

for (const prefix of Object.keys(expected)) {
  const categoryRecipes = recipes.filter((recipe) => recipe.id.startsWith(`${prefix}-`) && !recipe.originalRecipeId);
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

assert.equal(Object.values(expectedIngredientTotals).reduce((sum, count) => sum + count, 0), 828);

for (const prefix of Object.keys(expected)) {
  const rows = JSON.parse(fs.readFileSync(new URL(`../src/data/nutrition/${prefix}.json`, import.meta.url)));
  rows.forEach((row) => assert.equal(byId[row.recipeCode].title, row.title, `${row.recipeCode} title alignment`));
}

assert.deepEqual(byId["LF-FZ1"].ingredients, [], "LF-FZ1 is an instructional card, not a recipe purchase list");
assert.deepEqual(byId["LF-FZ2"].ingredients, [], "LF-FZ2 is an instructional card, not a recipe purchase list");
assert.ok(byId["JJ-008"].ingredients.some((item) => item.name === "Thick-cut bacon, diced" && item.qty === 12 && item.unit === "oz"));
assert.ok(byId["JJ-014"].ingredients.some((item) => item.name.startsWith("Granulated Splenda") && item.qty === 0.5));
assert.ok(byId["KR-003"].ingredients.some((item) => item.name === "Salt" && item.unit === "to taste"));
assert.ok(byId["KR-003"].ingredients.some((item) => item.name === "Black pepper" && item.unit === "to taste"));
assert.ok(byId["LF-015"].ingredients.some((item) => item.name === "Salt" && item.qty === 1.75 && item.unit === "tsp"));
assert.ok(byId["MX-012"].ingredients.some((item) => item.name === "Milk" && Math.abs(item.qty - 1 / 3) < 1e-9));
assert.ok(!byId["MX-008"].ingredients.some((item) => item.name === "Water"), "directions-only water must not be added");
for (const name of ["Avocado", "Cilantro", "Lime"]) {
  assert.ok(byId["MX-034"].ingredients.some((item) => item.name === name), `MX-034 needs separate ${name}`);
}
assert.ok(byId["MX-035"].ingredients.some((item) => item.name === "Salt" && item.qty === 0.25));

console.log("v84.13 JJ, KR, LF, and MX ingredient-data contracts passed.");
