import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";
import { formatTextRecipeIngredient } from "../src/utils/textRecipe.js";

const audited = recipes.filter((recipe) => /^LF-(?:00[1-9]|01[0-5])$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);
const allowedUnits = new Set(STANDARD_COOKING_UNITS);

assert.equal(audited.length, 15);
assert.equal(rows.length, 119);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.14"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !allowedUnits.has(ingredient.cookingUnit)), []);
assert.equal(get("LF-001", "Active dry yeast").shoppingEquivalent, "One packet active dry yeast");
assert.equal(formatTextRecipeIngredient(get("LF-001", "All-purpose flour")), "6 cups (720g) All-purpose flour, plus more for dusting");
assert.equal(get("LF-006", "Jalapeños").recipeQuantityText, "2–3");
assert.equal(get("LF-007", "Garlic").acceptableAlternatives.length, 2);
assert.equal(get("LF-009", "Parsley").acceptableAlternatives.length, 2);
assert.equal(get("LF-011", "Water for boiling").preparation, "for boiling");
assert.equal(get("LF-011", "Water").preparation, "for egg wash");
for (const [recipeId, name] of [["LF-008", "Dried minced onion"], ["LF-011", "Coarse pretzel salt"], ["LF-012", "Chopped fresh parsley"], ["LF-013", "Sugar"], ["LF-014", "Sugar"]]) {
  const ingredient = get(recipeId, name);
  assert.equal(ingredient.includeInShopping, false);
  assert.equal(consolidateShoppingItems([ingredient]).length, 0);
}
console.log("LF-001 through LF-015 ingredient checkpoint passed with zero review flags.");
