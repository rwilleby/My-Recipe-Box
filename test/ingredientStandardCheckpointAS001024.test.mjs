import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^AS-(?:00[1-9]|01\d|02[0-4])$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId)
  .ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 24);
assert.equal(rows.length, 210);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.14"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);

assert.equal(get("AS-001", "Small onion, sliced").qty, 0.25);
assert.equal(get("AS-001", "Small onion, sliced").canonicalName, "Onion");
assert.equal(get("AS-004", "Onion, sliced").qty, 0.5);
assert.equal(get("AS-014", "Onion, cut into 1-inch pieces").qty, 0.5);
assert.equal(get("AS-008", "Kikkoman Sweet & Sour Sauce").qty, 15);
assert.equal(get("AS-015", "Kikkoman Hunan Sauce for Chicken").qty, 14.5);

for (const [recipeId, name] of [["AS-001", "Cooked rice"], ["AS-006", "Sesame seeds"], ["AS-010", "Orange, sliced"], ["AS-022", "Oil"], ["AS-024", "Oil"]]) {
  const ingredient = get(recipeId, name);
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}

const proteinChoice = get("AS-021", "Chicken breast, thinly sliced, or 1 lb shrimp, peeled and deveined");
assert.equal(proteinChoice.acceptableAlternatives.length, 2);
assert.equal(proteinChoice.shoppingQuantity, 1);
assert.equal(proteinChoice.shoppingUnit, "pound");

assert.equal(get("AS-019", "Cooked chicken or beef strips").shoppingQuantity, 0.5);
assert.equal(get("AS-020", "Cooked chicken or pork strips").shoppingQuantity, 0.5);
assert.equal(get("AS-023", "Cooked shrimp, peeled, or shredded chicken").shoppingQuantity, 0.75);
console.log("AS-001 through AS-024 ingredient checkpoint passed with zero review flags.");
