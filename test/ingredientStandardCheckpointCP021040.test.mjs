import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^CP-(?:02[1-9]|03\d|040)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.equal(rows.length, 178);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.36"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 15);
assert.ok(reviewRows.every(({ ingredient }) => ingredient.resolutionType === "missing-package-size"));
assert.ok(reviewRows.every(({ ingredient }) => /size(?:s)? not specified/.test(ingredient.shoppingEquivalent)));

for (const [id, name] of [["CP-021", "turkey wing sections"], ["CP-023", "beef chuck roast"], ["CP-024", "beef chuck roast"], ["CP-030", "beef chuck roast"], ["CP-031", "beef chuck roast"]]) {
  assert.equal(get(id, name).cookingQuantity, 3.5);
  assert.equal(get(id, name).recipeQuantityText, "3–4");
}
assert.equal(get("CP-029", "large onions, sliced").cookingQuantity, 4.5);
assert.equal(get("CP-029", "large onions, sliced").shoppingQuantity, 3);
assert.equal(get("CP-039", "Eggs").cookingUnit, "each");
assert.equal(get("CP-023", "carrots, cut in chunks").cookingQuantity, 2);
assert.equal(get("CP-027", "celery stalks, sliced").cookingQuantity, 1.5);
assert.equal(get("CP-028", "diced potatoes").shoppingEquivalent, "About 2 medium potatoes");
assert.equal(get("CP-035", "sliced pear").cookingUnit, "cup");
assert.equal(get("CP-021", "turkey or chicken broth").acceptableAlternatives.length, 2);

for (const id of ["CP-024", "CP-030"]) {
  const peppers = get(id, "pepperoncini peppers");
  const juice = get(id, "pepperoncini juice");
  assert.equal(peppers.shoppingUnit, "jar");
  assert.equal(juice.includeInShopping, false);
  assert.equal(consolidateShoppingItems([juice]).length, 0);
}

console.log("CP-021 through CP-040 ingredient checkpoint passed with 15 retained missing-package-size review flags.");
