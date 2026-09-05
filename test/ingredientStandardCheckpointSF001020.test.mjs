import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^SF-(?:00[1-9]|01\d|020)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.equal(rows.length, 196);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.14"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.equal(get("SF-004", "Salmon, drained").qty, 29.5);
assert.equal(get("SF-004", "Salmon, drained").unit, "ounce");
assert.equal(get("SF-003", "Green onions").qty, 0.25);
assert.equal(get("SF-008", "Salmon fillets").shoppingQuantity, 1.5);
assert.equal(get("SF-016", "Onion, chopped").qty, 1);
assert.equal(get("SF-016", "Bell pepper, chopped").qty, 1);
assert.equal(get("SF-020", "Cooked rice").shoppingQuantity, 0.6666666667);
assert.equal(get("SF-010", "Tilapia fillets").shoppingQuantity, 1.5);
assert.equal(get("SF-011", "Lemon wedges").qty, 4);
assert.equal(get("SF-011", "Lemon wedges").shoppingQuantity, 1);
for (const [recipeId, name] of [["SF-001", "Cooking spray"], ["SF-002", "Pasta or rice"], ["SF-019", "Oil for frying"]]) {
  const ingredient = get(recipeId, name);
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}
console.log("SF-001 through SF-020 ingredient checkpoint passed with zero review flags.");
