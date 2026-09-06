import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^BR-(?:00[1-3]|00[5-9]|01[01])$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 10);
assert.equal(rows.length, 91);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.36"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);
assert.equal(recipes.find((recipe) => recipe.id === "BR-004"), undefined);

assert.equal(get("BR-001", "Bread flour").recipeQuantityText, "4 cups (480g)");
assert.equal(get("BR-001", "Warm water").preparation, "warm");
assert.equal(get("BR-005", "Unsalted butter, softened").shoppingEquivalent, "1/2 stick unsalted butter");
assert.equal(get("BR-006", "Bread machine yeast").shoppingEquivalent, "1 packet bread machine yeast");
assert.equal(get("BR-008", "Lemon juice or white vinegar, for tangy flavor").acceptableAlternatives.length, 2);
assert.equal(get("BR-011", "White vinegar or lemon juice").acceptableAlternatives.length, 2);

for (const id of ["BR-009", "BR-010", "BR-011"]) {
  const butter = get(id, "Butter for brushing after baking");
  assert.equal(butter.cookingQuantity, null);
  assert.equal(butter.includeInShopping, false);
  assert.equal(consolidateShoppingItems([butter]).length, 0);
}
for (const [id, name] of [["BR-006", "Pretzel salt for topping"], ["BR-009", "Egg yolk"], ["BR-010", "Sesame seeds"]]) {
  assert.equal(get(id, name).includeInShopping, false);
}

console.log("BR-001–BR-003 and BR-005–BR-011 ingredient checkpoint passed with zero review flags.");
