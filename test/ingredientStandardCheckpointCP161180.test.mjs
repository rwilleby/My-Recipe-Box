import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";

const audited = recipes.filter((recipe) => /^CP-(?:16[1-9]|17\d|180)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.equal(rows.length, 139);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 51);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-package-size").length, 11);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-source-quantity").length, 35);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "dependent-package-instructions").length, 2);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-total-weight").length, 2);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "unspecified-product-form").length, 1);

assert.equal(get("CP-167", "onion, chopped").cookingQuantity, 1);
assert.equal(get("CP-170", "bell pepper, diced").cookingQuantity, 1);
assert.equal(get("CP-171", "apples, sliced").cookingQuantity, 8);
assert.equal(get("CP-161", "cheese").shoppingQuantity, 8);
assert.equal(get("CP-166", "butter").shoppingQuantity, 0.6666666667);
assert.equal(get("CP-179", "butter").shoppingQuantity, 0.5);
assert.deepEqual(get("CP-169", "water or broth").acceptableAlternatives, ["Water", "Broth"]);
assert.equal(get("CP-175", "eggs, oil and water as directed").resolutionType, "dependent-package-instructions");
assert.equal(get("CP-167", "smoked turkey leg").resolutionType, "missing-total-weight");
assert.equal(get("CP-180", "cream cheese glaze").resolutionType, "unspecified-product-form");
assert.equal(get("CP-178", "walnuts optional").includeInShopping, false);

console.log("CP-161 through CP-180 ingredient checkpoint passed with 51 retained review flags; CP-001 through CP-180 are complete.");
