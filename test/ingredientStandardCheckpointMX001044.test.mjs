import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^MX-(?:00[1-9]|0[1-3]\d|04[0-4])$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 44);
assert.equal(rows.length, 502);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.14"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.equal(get("MX-001", "Small onion, diced").qty, 0.5);
assert.equal(get("MX-004", "Large onion, sliced").qty, 1.5);
assert.equal(get("MX-004", "Bell peppers, sliced").qty, 2);
assert.equal(get("MX-010", "Small bell pepper, diced").qty, 0.5);
assert.equal(get("MX-012", "Cornbread mix").qty, 8.5);
assert.equal(get("MX-012", "Cornbread mix").unit, "ounce");
assert.equal(get("MX-002", "Cooked shredded chicken").shoppingQuantity, 1.5);
assert.equal(get("MX-028", "Cooked chicken, diced").shoppingQuantity, 1.5);
assert.equal(get("MX-004", "Flank or skirt steak, thinly sliced").acceptableAlternatives.length, 2);
assert.equal(get("MX-010", "Green onions, sliced").qty, 0.25);
assert.equal(get("MX-010", "Green onions, sliced").shoppingQuantity, 2);
assert.equal(get("MX-009", "Cooked Mexican rice").shoppingQuantity, 0.3333333333);
assert.equal(get("MX-025", "Cooked rice").shoppingQuantity, 0.6666666667);
assert.equal(get("MX-037", "Cooked shredded chicken or beef").shoppingQuantity, 1.5);
assert.equal(get("MX-037", "Cooked shredded chicken or beef").acceptableAlternatives.length, 2);
assert.equal(get("MX-011", "Tortilla chips").qty, 10);
assert.equal(get("MX-011", "Tortilla chips").unit, "ounce");
for (const [recipeId, name] of [["MX-003", "Chopped cilantro"], ["MX-025", "Lime wedges"], ["MX-039", "Cooking spray or oil"]]) {
  const ingredient = get(recipeId, name);
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}
console.log("MX-001 through MX-044 ingredient checkpoint passed with zero review flags.");
