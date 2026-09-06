import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";
import { formatTextRecipeIngredient } from "../src/utils/textRecipe.js";

const audited = recipes.filter((recipe) => /^PM-(?:00[1-9]|01[0-4])$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);
const allowedUnits = new Set(STANDARD_COOKING_UNITS);

assert.equal(audited.length, 14);
assert.equal(rows.length, 189);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.36"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !allowedUnits.has(ingredient.cookingUnit)), []);
assert.equal(get("PM-001", "Rolled oats").canonicalKey, "grain.oats.rolled");
assert.equal(get("PM-012", "Old-fashioned oats").canonicalKey, "grain.oats.rolled");
assert.notEqual(get("PM-001", "Vanilla protein powder").canonicalKey, get("PM-004", "Chocolate protein powder").canonicalKey);
assert.equal(get("PM-001", "Finely diced apple (about 1 medium apple)").shoppingUnit, "each");
assert.equal(get("PM-014", "Finely shredded carrots").shoppingQuantity, 2);
assert.equal(formatTextRecipeIngredient(get("PM-005", "Lemon zest")), "Zest of 2 lemons Lemon zest, zested");
assert.equal(get("PM-009", "Orange zest").inventorySubcategory, "Fruits");
assert.equal(get("PM-002", "Fresh or frozen blueberries").acceptableAlternatives.length, 2);
assert.equal(get("PM-009", "Dried cranberries or fresh cranberries").acceptableAlternatives.length, 2);
assert.equal(get("PM-002", "Greek yogurt, plain or vanilla").shoppingName, "Greek Yogurt");
for (const [recipeId, name] of [["PM-006", "Milk"], ["PM-010", "Mini chocolate chips"], ["PM-011", "White chocolate chips"], ["PM-014", "Raisins"]]) {
  const ingredient = get(recipeId, name);
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}
console.log("PM-001 through PM-014 ingredient checkpoint passed with zero review flags.");
