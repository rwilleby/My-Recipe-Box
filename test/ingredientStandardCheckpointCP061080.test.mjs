import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";

const audited = recipes.filter((recipe) => /^CP-(?:06[1-9]|07\d|080)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.equal(rows.length, 162);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 23);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-package-size").length, 8);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-source-quantity").length, 11);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-protein-weight").length, 4);

assert.equal(get("CP-061", "pork tenderloins, about 2 1/2 lb").cookingQuantity, 2.5);
assert.equal(get("CP-063", "apples, sliced").cookingQuantity, 3);
assert.equal(get("CP-063", "onions, sliced").cookingQuantity, 2);
assert.equal(get("CP-065", "large onion, cut in wedges").cookingQuantity, 1.5);
assert.equal(get("CP-068", "baby back ribs").recipeQuantityText, "2 racks");
assert.equal(get("CP-069", "fully cooked spiral ham, 7-8 lb").cookingQuantity, 7.5);
assert.equal(get("CP-073", "diced ham").shoppingQuantity, 18);
assert.equal(get("CP-075", "bell peppers, sliced").cookingQuantity, 3);
assert.equal(get("CP-080", "small cabbage, chopped").cookingQuantity, 4);
assert.equal(get("CP-078", "onion").cookingQuantity, null);
assert.equal(get("CP-078", "onion").includeInShopping, false);

for (const [id, name] of [["CP-063", "chicken broth"], ["CP-066", "apple juice"], ["CP-067", "barbecue sauce"], ["CP-069", "brown sugar"], ["CP-074", "chicken broth"], ["CP-080", "broth"]]) {
  assert.equal(get(id, name).originalUnit, "cup");
}

console.log("CP-061 through CP-080 ingredient checkpoint passed with 23 retained review flags.");
