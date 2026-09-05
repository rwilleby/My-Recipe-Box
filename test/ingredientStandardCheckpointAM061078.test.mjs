import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^AM-(?:06[1-9]|07[0-8])$/.test(recipe.id) && recipe.id !== "AM-063");
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName, originalUnit = null) => recipes.find((recipe) => recipe.id === recipeId)
  .ingredients.find((ingredient) => ingredient.originalName === originalName && (originalUnit === null || ingredient.originalUnit === originalUnit));

assert.equal(audited.length, 17);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.14"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);

assert.equal(get("AM-061", "Small onion, chopped").qty, 0.5);
assert.equal(get("AM-064", "Small red onion, thinly sliced").qty, 0.25);
assert.equal(get("AM-064", "Small red onion, thinly sliced").canonicalName, "Red Onion");
assert.equal(get("AM-064", "Cooked bacon, crispy").shoppingQuantity, 6);
assert.equal(get("AM-065", "Sliced cooked turkey").shoppingQuantity, 1);
assert.equal(get("AM-065", "Sliced cooked turkey").shoppingUnit, "pound");
assert.equal(get("AM-065", "Sliced cooked turkey").shoppingEquivalent, "About 1 pound raw boneless turkey or 12 ounces prepared cooked turkey");
assert.equal(get("AM-066", "Prepared mashed potatoes").shoppingQuantity, 2);
assert.equal(get("AM-069", "Cooked bacon, crumbled").shoppingQuantity, 16);
assert.equal(get("AM-073", "Cooked chicken, diced").shoppingQuantity, 1.5);
assert.equal(get("AM-074", "Cooked ham, diced").shoppingQuantity, 12);
assert.equal(get("AM-078", "Cooked ham, diced").shoppingQuantity, 12);

const measuredMustard = get("AM-061", "Yellow mustard", "tbsp");
const optionalMustard = get("AM-061", "Yellow mustard", "optional");
assert.equal(measuredMustard.includeInShopping, true);
assert.equal(optionalMustard.includeInShopping, false);
assert.equal(get("AM-062", "Vegetable oil", "tbsp").cookingQuantity, 1);
assert.equal(get("AM-062", "Vegetable oil", "for frying").includeInShopping, false);

for (const [recipeId, name] of [["AM-062", "Ketchup"], ["AM-064", "Dill pickle spears"], ["AM-070", "Sliced pickles"]]) {
  const ingredient = get(recipeId, name);
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}

console.log("AM-061 through AM-078 ingredient checkpoint passed with zero review flags.");
