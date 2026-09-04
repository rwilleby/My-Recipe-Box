import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";
import { formatTextRecipeIngredient } from "../src/utils/textRecipe.js";

const audited = recipes.filter((recipe) => /^AM-(?:00[1-9]|01\d|020)$/.test(recipe.id));
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));

assert.equal(audited.length, 20);
for (const field of ["canonicalKey", "canonicalName", "recipeName", "cookingQuantity", "cookingUnit", "preparation", "shoppingEquivalent", "acceptableAlternatives", "reviewStatus", "standardVersion"]) {
  assert.ok(rows.every(({ ingredient }) => Object.prototype.hasOwnProperty.call(ingredient, field)), `${field} exists on every audited row`);
}
assert.ok(rows.every(({ ingredient }) => ["approved", "needs-review"].includes(ingredient.reviewStatus)));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.equal(rows.filter(({ ingredient }) => ingredient.resolutionType !== "source-specific").length, 15);

const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId)
  .ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.deepEqual(
  (({ name, qty, unit, preparation, shoppingEquivalent }) => ({ name, qty, unit, preparation, shoppingEquivalent }))(get("AM-001", "Small onion, sliced")),
  { name: "Onion", qty: 0.5, unit: "cup", preparation: "sliced", shoppingEquivalent: "About 1 small onion" },
);
assert.equal(get("AM-002", "Medium onion, sliced").qty, 1);
assert.equal(get("AM-004", "Medium onions, sliced").qty, 2);
assert.equal(get("AM-011", "Large onion, sliced").qty, 1.5);
assert.equal(get("AM-008", "Tomato sauce").qty, 15);
assert.equal(get("AM-008", "Tomato sauce").unit, "ounce");
assert.equal(get("AM-008", "Tomato sauce").shoppingEquivalent, "1 × 15-ounce can");
assert.equal(get("AM-001", "Chopped parsley").cookingQuantity, null);
assert.equal(get("AM-001", "Chopped parsley").includeInShopping, false);
assert.equal(get("AM-003", "Cube steaks").shoppingQuantity, 2);
assert.equal(get("AM-003", "Cube steaks").shoppingUnit, "pound");
assert.equal(get("AM-014", "Onion, cut in chunks").cookingQuantity, 1);
assert.equal(get("AM-014", "Onion, cut in chunks").cookingUnit, "cup");
assert.equal(get("AM-019", "Potato, diced and cooked").recipeName, "Russet potato");
assert.equal(get("AM-019", "Potato, diced and cooked").shoppingEquivalent, "About 1 medium russet potato");
assert.equal(get("AM-013", "Cooked ham, 3–4 lb").cookingQuantity, 3.5);
assert.match(formatTextRecipeIngredient(get("AM-013", "Cooked ham, 3–4 lb")), /^3–4 pound Ham, cooked$/);
assert.equal(get("AM-003", "Salt").reviewStatus, "approved");
assert.match(formatTextRecipeIngredient(get("AM-001", "Small onion, sliced")), /^½ cup Onion, sliced$/);

const choices = get("AM-002", "Beef stew meat or sirloin tips");
assert.equal(choices.acceptableAlternatives.length, 2);
assert.ok(choices.substitutionGroup);

const broth = get("AM-001", "Beef broth");
const duplicateBroth = { ...broth, name: "beef Broth", qty: 1, quantity: 1, cookingQuantity: 1, shoppingQuantity: 1 };
const consolidated = consolidateShoppingItems([broth, duplicateBroth]);
assert.equal(consolidated.length, 1);
assert.equal(consolidated[0].qty, 3);
assert.equal(consolidateShoppingItems([get("AM-001", "Chopped parsley")]).length, 0);

console.log("AM-001 through AM-020 ingredient checkpoint passed.");
