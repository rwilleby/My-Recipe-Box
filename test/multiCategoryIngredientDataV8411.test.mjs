import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";

const expected = {
  BR: [7, 9, 7, 8, 8, 8, 9, 11, 12, 9],
  CC: [10, 11, 9, 10, 10, 10],
  CO: [13, 12, 12, 12, 12, 12],
  CP: [7,7,8,9,9,9,9,9,8,8,8,7,8,9,9,9,9,9,9,9,8,8,9,7,10,9,10,9,9,9,8,9,9,8,9,9,10,9,10,9,9,7,10,10,8,9,8,9,8,9,9,9,8,7,9,9,9,9,8,9,10,7,8,8,9,8,7,7,6,9,9,9,8,8,7,6,9,9,9,9,7,8,9,8,9,9,10,9,7,10,11,9,9,9,9,9,9,10,9,10,7,7,8,9,10,11,9,10,8,9,9,9,9,10,9,8,8,8,9,8,9,10,7,8,7,9,10,8,10,10,10,8,10,10,9,6,6,7,9,8,8,8,7,8,8,8,8,7,8,7,8,8,8,7,7,7,7,7,8,7,8,6,6,9,7,7,8,7,8,8,8,6,5,6,5,6,8,8,7,6],
  CR: [13, 17, 15, 15, 7],
};

const expectedRecipeCounts = { BR: 10, CC: 6, CO: 6, CP: 180, CR: 5 };
const expectedIngredientTotals = { BR: 88, CC: 60, CO: 73, CP: 1498, CR: 67 };
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

assert.equal(Object.values(expectedIngredientTotals).reduce((sum, count) => sum + count, 0), 1786);
assert.equal(byId["BR-004"], undefined, "missing BR-004 must not be invented");
assert.equal(byId["BR-011a"], undefined, "alternate BR-011a asset must not become a second recipe");

for (const prefix of ["CC", "CO", "CR"]) {
  const rows = JSON.parse(fs.readFileSync(new URL(`../src/data/nutrition/${prefix}.json`, import.meta.url)));
  rows.forEach((row) => assert.equal(byId[row.recipeCode].title, row.title, `${row.recipeCode} title alignment`));
}

assert.ok(byId["BR-009"].ingredients.some((item) => item.name === "Egg yolk" && item.unit.includes("optional glossy finish")));
assert.ok(byId["CC-001"].ingredients.some((item) => item.name === "Large eggs" && item.qty === 12));
assert.ok(byId["CO-001"].ingredients.some((item) => item.name === "Peeled, sliced apples" && item.qty === 6));
assert.ok(byId["CP-069"].ingredients.some((item) => item.name.includes("7-8 lb")));
assert.ok(byId["CP-083"].ingredients.some((item) => item.name === "chicken breasts" && item.qty === 1.5 && item.unit === "lb"));
assert.ok(byId["CP-108"].ingredients.some((item) => item.name === "cream cheese" && item.unit === "amount not specified"));
assert.ok(byId["CP-120"].ingredients.some((item) => item.name === "fettuccine" && item.qty === 16 && item.unit === "oz"));
assert.ok(byId["CR-001"].ingredients.some((item) => item.name === "Milk" && item.unit === "2-3 tbsp range"));

console.log("v84.11 BR, CC, CO, CP, and CR ingredient-data contracts passed.");
