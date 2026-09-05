import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^SB-(?:00[1-9]|01\d|020)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);
const allowedUnits = new Set(STANDARD_COOKING_UNITS);

assert.equal(audited.length, 20);
assert.equal(rows.length, 251);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.14"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !allowedUnits.has(ingredient.cookingUnit)), []);
assert.equal(get("SB-001", "Cooked shredded chicken").shoppingQuantity, 4);
assert.equal(get("SB-004", "Cooked lean ground beef").shoppingQuantity, 5);
assert.equal(get("SB-010", "Lump crab meat").shoppingQuantity, 4);
assert.equal(get("SB-016", "Cooked salmon").shoppingQuantity, 5);
assert.equal(get("SB-017", "Cooked shrimp").shoppingQuantity, 5);
assert.equal(get("SB-018", "Tuna").shoppingQuantity, 5);
assert.equal(get("SB-005", "Deli turkey").unit, "slice");
assert.equal(get("SB-019", "Ham").unit, "slice");
assert.equal(get("SB-009", "Diced ham, bacon, or pre-cooked chicken or turkey").acceptableAlternatives.length, 4);
for (const [recipeId, name] of [["SB-009", "Diced ham, bacon, or pre-cooked chicken or turkey"], ["SB-011", "Sliced radishes"], ["SB-019", "Cucumbers"], ["SB-020", "Favorite dressing"]]) {
  const ingredient = get(recipeId, name);
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}
console.log("SB-001 through SB-020 ingredient checkpoint passed with zero review flags.");
