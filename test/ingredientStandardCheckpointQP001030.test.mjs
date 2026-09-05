import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^QP-(?:00[1-9]|0[12]\d|030)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);
const allowedUnits = new Set(STANDARD_COOKING_UNITS);

assert.equal(audited.length, 30);
assert.equal(rows.length, 359);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.14"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !allowedUnits.has(ingredient.cookingUnit)), []);
assert.equal(get("QP-001", "Mini pie shells").unit, "each");
assert.equal(get("QP-002", "Bacon").shoppingQuantity, 6);
assert.equal(get("QP-003", "Diced cooked ham").shoppingQuantity, 8);
assert.equal(get("QP-006", "Cooked ground breakfast sausage").shoppingQuantity, 10);
assert.equal(get("QP-012", "Ground beef").shoppingQuantity, 10);
assert.equal(get("QP-014", "Large onions").qty, 3);
assert.equal(get("QP-015", "Cooked crawfish tails").shoppingQuantity, 8);
assert.equal(get("QP-017", "Cooked chicken").shoppingQuantity, 1.5);
assert.equal(get("QP-027", "Frozen whipped topping").unit, "ounce");
assert.equal(get("QP-029", "Key lime juice").shoppingQuantity, 7);
assert.equal(get("QP-013", "Chopped fresh basil").acceptableAlternatives.length, 2);
for (const [recipeId, name] of [["QP-001", "Chopped chives"], ["QP-014", "Ground nutmeg"], ["QP-025", "All-purpose flour"], ["QP-030", "Fresh strawberries, hulled and sliced"]]) {
  const ingredient = get(recipeId, name);
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}
assert.equal(get("QP-030", "Fresh strawberries, hulled and sliced").cookingQuantity, 1);
assert.equal(get("QP-030", "Fresh strawberries, hulled and sliced").cookingUnit, "cup");
console.log("QP-001 through QP-030 ingredient checkpoint passed with zero review flags.");
