import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^SD-(?:00[1-9]|0[1-4]\d|05[0-2])$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);
const allowedUnits = new Set(STANDARD_COOKING_UNITS);

assert.equal(audited.length, 52);
assert.equal(rows.length, 407);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.14"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !allowedUnits.has(ingredient.cookingUnit)), []);
assert.equal(get("SD-001", "Pork & beans").qty, 60);
assert.equal(get("SD-001", "Onion, chopped").qty, 1);
assert.equal(get("SD-004", "Onion, chopped").qty, 0.5);
assert.equal(get("SD-024", "Onion, chopped").qty, 0.25);
assert.equal(get("SD-009", "Red bell pepper, sliced").qty, 1);
assert.equal(get("SD-021", "Zucchini, chopped").qty, 1.5);
assert.equal(get("SD-028", "Sweet potato").qty, 7);
assert.equal(get("SD-042", "Frozen crinkle-cut fries").qty, 30);
assert.equal(get("SD-047", "Mixed greens or head lettuce").qty, 7.5);
assert.equal(get("SD-004", "Fresh green beans or 4 cups frozen green beans").acceptableAlternatives.length, 2);
for (const [recipeId, name] of [["SD-020", "Butter or olive oil, optional"], ["SD-026", "Water"], ["SD-032", "Oil for frying"], ["SD-047", "Dressing of choice"]]) {
  const ingredient = get(recipeId, name);
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}
console.log("SD-001 through SD-052 ingredient checkpoint passed with zero review flags.");
