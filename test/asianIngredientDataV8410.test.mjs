import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";

const expectedCounts = [9, 9, 9, 10, 9, 9, 9, 9, 9, 9, 8, 7, 6, 8, 8, 10, 11, 8, 9, 9, 10, 10, 6, 5];
const asian = recipes.filter((recipe) => recipe.id.startsWith("AS-"));
const byId = Object.fromEntries(asian.map((recipe) => [recipe.id, recipe]));
const nutritionRows = JSON.parse(fs.readFileSync(new URL("../src/data/nutrition/AS.json", import.meta.url)));
const normalizeTitle = (title) => String(title).replace(/[’‘]/g, "'");

assert.equal(asian.length, 24);
asian.forEach((recipe, index) => {
  assert.equal(recipe.ingredients.length, expectedCounts[index], `${recipe.id} ingredient count`);
  recipe.ingredients.forEach((ingredient) => {
    assert.ok(ingredient.name, `${recipe.id} ingredient needs a name`);
    assert.ok(Number(ingredient.qty) > 0, `${recipe.id} ${ingredient.name} needs a positive quantity`);
    assert.ok(ingredient.unit, `${recipe.id} ${ingredient.name} needs a unit`);
    assert.ok(ingredient.aisle, `${recipe.id} ${ingredient.name} needs an aisle`);
  });
});
assert.equal(expectedCounts.reduce((sum, count) => sum + count, 0), 206);

nutritionRows.forEach((row) => assert.equal(normalizeTitle(byId[row.recipeCode].title), normalizeTitle(row.title), `${row.recipeCode} title alignment`));
assert.deepEqual(
  ["AS-003", "AS-004", "AS-005", "AS-009"].map((id) => byId[id].title),
  ["Mongolian Beef", "Pepper Steak", "Black Pepper Beef", "Sesame Chicken"],
);

assert.ok(byId["AS-001"].ingredients.some((item) => item.name === "Lee Kum Kee Panda Brand Oyster Sauce" && item.qty === 0.5));
assert.ok(byId["AS-005"].ingredients.some((item) => item.name === "Lee Kum Kee Black Pepper Sauce" && item.unit === "amount not specified"));
assert.ok(byId["AS-008"].ingredients.some((item) => item.name === "Kikkoman Sweet & Sour Sauce" && item.unit === "15 oz bottle"));
assert.ok(byId["AS-014"].ingredients.some((item) => item.name === "Kikkoman Cashew Sauce for Chicken" && item.unit === "15 oz bottle"));
assert.ok(byId["AS-021"].ingredients.some((item) => item.name.includes("or 1 lb shrimp")));
assert.ok(byId["AS-024"].ingredients.some((item) => item.name === "Wonton wrappers" && item.qty === 24));

console.log("v84.10 complete Asian recipe-card ingredient contracts passed.");
