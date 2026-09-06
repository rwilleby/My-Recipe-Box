import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";
import { formatTextRecipeIngredient } from "../src/utils/textRecipe.js";

const audited = recipes.filter((recipe) => /^KR-00[1-7]$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);
const allowedUnits = new Set(STANDARD_COOKING_UNITS);

assert.equal(audited.length, 7);
assert.equal(rows.length, 37);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !allowedUnits.has(ingredient.cookingUnit)), []);
assert.equal(get("KR-001", "Refrigerated crescent roll dough").unit, "can");
assert.equal(get("KR-001", "Refrigerated crescent roll dough").shoppingEquivalent, "Two 8-ounce cans refrigerated crescent roll dough");
assert.equal(get("KR-001", "All-purpose flour").preparation, "for rolling");
assert.equal(get("KR-002", "Diced cooked ham").unit, "cup");
assert.equal(get("KR-002", "Diced cooked ham").preparation, "diced and cooked");
assert.equal(get("KR-003", "Bacon, cooked crisp and crumbled").unit, "slice");
assert.equal(get("KR-003", "Bacon, cooked crisp and crumbled").shoppingUnit, "slice");
assert.equal(get("KR-005", "Boudin, casing removed").unit, "pound");
assert.equal(get("KR-006", "Frozen chicken nuggets, fully cooked").recipeQuantityText, "12–15");
assert.equal(formatTextRecipeIngredient(get("KR-006", "Frozen chicken nuggets, fully cooked")), "12–15 each Frozen chicken nuggets, fully cooked");
assert.equal(get("KR-007", "Mini smoked sausages (cocktail wieners)").unit, "each");
for (const [recipeId, name] of [["KR-003", "Salt"], ["KR-003", "Black pepper"], ["KR-004", "Salt"], ["KR-004", "Black pepper"]]) {
  const ingredient = get(recipeId, name);
  assert.equal(ingredient.cookingQuantity, null);
  assert.equal(ingredient.preparation, "to taste");
  assert.equal(ingredient.includeInShopping, false);
}
const sauce = get("KR-006", "Honey mustard or favorite sauce");
assert.equal(sauce.acceptableAlternatives.length, 2);
assert.equal(sauce.includeInShopping, false);
assert.equal(consolidateShoppingItems([sauce]).length, 0);

console.log("KR-001 through KR-007 ingredient checkpoint passed with zero review flags.");
