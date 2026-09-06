import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^JJ-(?:00[1-9]|01\d|02[0-5])$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 25);
assert.equal(rows.length, 170);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 1);
assert.equal(reviewRows[0].recipeId, "JJ-010");
assert.equal(reviewRows[0].ingredient.originalName, "Thick-cut bacon, diced");
assert.equal(reviewRows[0].ingredient.cookingQuantity, 10.6666666667);
assert.equal(reviewRows[0].ingredient.cookingUnit, "ounce");

assert.equal(get("JJ-001", "Fruit pectin").cookingQuantity, 1.75);
assert.equal(get("JJ-001", "Fruit pectin").cookingUnit, "ounce");
assert.equal(get("JJ-001", "Fruit pectin").shoppingEquivalent, "One 1.75-ounce box fruit pectin");
assert.equal(get("JJ-006", "Yellow onion, finely diced").shoppingEquivalent, "About 1 medium yellow onion");
assert.equal(get("JJ-013", "Tomatoes, finely diced").shoppingQuantity, 3);
assert.equal(get("JJ-025", "Peaches, peeled and finely diced").shoppingQuantity, 2);
assert.equal(get("JJ-020", "Thawed white grape juice concentrate").preparation, "thawed");

for (const id of ["JJ-002", "JJ-003", "JJ-004", "JJ-005"]) {
  assert.equal(get(id, "Granulated sugar or monk fruit blend").acceptableAlternatives.length, 2);
}
for (const id of ["JJ-014", "JJ-015", "JJ-016", "JJ-017", "JJ-018", "JJ-019"]) {
  assert.equal(get(id, "Granulated Splenda or equivalent sucralose sweetener").acceptableAlternatives.length, 2);
}
for (const { ingredient } of rows.filter(({ ingredient }) => /optional/i.test(ingredient.preparation))) {
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}

console.log("JJ-001 through JJ-025 ingredient checkpoint passed with one retained review flag.");
