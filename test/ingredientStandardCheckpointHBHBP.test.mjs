import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^(?:HB-(?:00[1-9]|0[12]\d|03[01])|HBP-(?:00[1-9]|01[0-2]))$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);
const allowedUnits = new Set(STANDARD_COOKING_UNITS);

assert.equal(audited.length, 43);
assert.equal(rows.length, 413);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.14"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !allowedUnits.has(ingredient.cookingUnit)), []);
assert.equal(get("HB-001", "Ground beef, 80/20").canonicalKey, "meat.beef.ground.80-20");
assert.equal(get("HBP-001", "Ground beef, 90/10").canonicalKey, "meat.beef.ground.90-10");
assert.equal(get("HB-015", "Large onions, thinly sliced").qty, 3);
assert.equal(get("HB-031", "Small onion, finely minced for Lipsey-style chili sauce").qty, 0.5);
assert.equal(get("HBP-012", "Small onions, finely minced").qty, 1);
assert.equal(get("HB-007", "Bacon, cooked").cookingUnit, "slice");
assert.equal(get("HB-007", "Bacon, cooked").shoppingUnit, "ounce");
assert.equal(get("HB-031", "Soft hamburger bun").preparation, "per burger");
for (const [recipeId, name] of [["HB-004", "Ketchup"], ["HB-004", "Yellow mustard"], ["HB-004", "Mayonnaise"], ["HB-031", "Yellow mustard"], ["HB-031", "Diced onions"], ["HB-031", "Dill pickle slices"]]) {
  const ingredient = get(recipeId, name);
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}
console.log("HB-001 through HB-031 and HBP-001 through HBP-012 ingredient checkpoint passed with zero review flags.");
