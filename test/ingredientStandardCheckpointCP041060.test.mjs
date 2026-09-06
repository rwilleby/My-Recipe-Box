import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^CP-(?:04[1-9]|05\d|060)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.equal(rows.length, 173);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 22);
assert.ok(reviewRows.every(({ ingredient }) => ingredient.resolutionType === "missing-package-size"));
assert.ok(reviewRows.every(({ ingredient }) => /size(?:s)? not specified/.test(ingredient.shoppingEquivalent)));

assert.equal(get("CP-042", "corned beef brisket").cookingQuantity, 3.5);
assert.equal(get("CP-042", "corned beef brisket").recipeQuantityText, "3–4");
assert.equal(get("CP-042", "seasoning packet").includeInShopping, false);
assert.equal(get("CP-044", "Eggs").cookingQuantity, 1);
assert.equal(get("CP-045", "cream of mushroom soup").reviewStatus, "needs-review");
assert.equal(get("CP-046", "diced potatoes").cookingQuantity, 3);
assert.equal(get("CP-047", "bell peppers, diced").cookingQuantity, 2);
assert.equal(get("CP-056", "bacon, cooked and chopped").shoppingQuantity, 6);
assert.equal(get("CP-059", "root beer").shoppingEquivalent, "One 12-ounce can or bottle root beer");

for (const id of ["CP-047", "CP-048"]) assert.equal(get(id, "cooked rice").shoppingQuantity, 0.3333333333);
for (const [id, name] of [["CP-052", "Spaghetti, for serving"], ["CP-057", "Sandwich buns, for serving"], ["CP-058", "Sandwich buns, for serving"], ["CP-059", "Sandwich buns, for serving"]]) {
  const item = get(id, name);
  assert.equal(item.cookingQuantity, null);
  assert.equal(item.includeInShopping, false);
  assert.equal(consolidateShoppingItems([item]).length, 0);
}

console.log("CP-041 through CP-060 ingredient checkpoint passed with 22 retained missing-package-size review flags.");
