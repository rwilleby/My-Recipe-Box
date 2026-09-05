import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^IT-(?:00[1-9]|0[1-5]\d|060)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 60);
assert.equal(rows.length, 646);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.14"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.equal(get("IT-012", "Small onion, diced").qty, 0.5);
assert.equal(get("IT-008", "Onion, sliced").qty, 1);
assert.equal(get("IT-057", "Cheese tortellini").qty, 20);
assert.equal(get("IT-057", "Cheese tortellini").unit, "ounce");
assert.equal(get("IT-001", "Chicken breasts, sliced").shoppingQuantity, 1);
assert.equal(get("IT-002", "Boneless chicken cutlets").shoppingQuantity, 2);
assert.equal(get("IT-008", "Chicken thighs").shoppingQuantity, 2);
assert.equal(get("IT-035", "Cod fillets").shoppingQuantity, 1.5);
assert.equal(get("IT-036", "Salmon fillets").shoppingQuantity, 1.5);
assert.equal(get("IT-046", "Cooked Italian sausage").shoppingQuantity, 5);
assert.equal(get("IT-047", "Frozen or homemade meatballs, cooked").shoppingQuantity, 1);
assert.equal(get("IT-008", "Bell pepper, sliced").qty, 1);
assert.equal(get("IT-015", "Carrot, diced").qty, 0.5);
assert.equal(get("IT-023", "Zucchini, sliced").qty, 1.5);
assert.equal(get("IT-030", "Medium eggplants, sliced").qty, 8);
assert.equal(get("IT-041", "Roma tomatoes, sliced").qty, 1);
for (const [recipeId, name] of [["IT-001", "Chopped parsley"], ["IT-002", "Chopped basil"], ["IT-004", "Lemon slices"]]) {
  const ingredient = get(recipeId, name);
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}
assert.equal(get("IT-056", "Cooked chicken, chopped").shoppingQuantity, 1.5);
console.log("IT-001 through IT-060 ingredient checkpoint passed with zero review flags.");
