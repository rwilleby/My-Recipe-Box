import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { getCrockPotNutritionEstimate } from "../src/utils/crockPotNutritionEstimate.js";
import { applyStoredRecipeOverrides } from "../src/utils/recipeOverrides.js";
import { buildShoppingList } from "../src/utils/planning.js";

const crockPotRecipes = recipes.filter((recipe) => String(recipe.id).startsWith("CP-"));
assert.ok(crockPotRecipes.length >= 180, "the Crock Pot collection should remain complete");
assert.ok(crockPotRecipes.every((recipe) => recipe.servings === 6), "every CP recipe should yield six servings per pot");

for (const recipe of crockPotRecipes) {
  assert.equal(getCrockPotNutritionEstimate(recipe)?.servingsPerRecipe, 6, `${recipe.id} nutrition should use six servings per pot`);
}

const originalWindow = globalThis.window;
globalThis.window = {
  localStorage: {
    getItem: () => JSON.stringify({ "CP-001": { servings: 2 } }),
  },
};
const overridden = applyStoredRecipeOverrides([crockPotRecipes.find((recipe) => recipe.id === "CP-001")]);
assert.equal(overridden[0].servings, 6, "a stale browser override must not change the Crock Pot six-serving standard");
if (originalWindow === undefined) delete globalThis.window;
else globalThis.window = originalWindow;

const sample = crockPotRecipes.find((recipe) => recipe.id === "CP-001");
const plan = { "week1-Mon": [sample.id] };
const fullPot = buildShoppingList(plan, [sample], 6);
const halfPot = buildShoppingList(plan, [sample], 3);
assert.equal(fullPot.length, halfPot.length, "shopping-list scaling should retain the same ingredients");
for (let index = 0; index < fullPot.length; index += 1) {
  assert.ok(Math.abs(halfPot[index].qty - fullPot[index].qty / 2) < 0.0001, "three portions should use half of the six-serving pot quantity");
}

console.log("v99.6 Crock Pot six-servings-per-pot standard passed");
