import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";
import { consolidateShoppingItems } from "../src/utils/ingredientNormalization.js";

const audited = recipes.filter((recipe) => /^CP-(?:00[1-9]|01\d|020)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.equal(rows.length, 169);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 30);
assert.ok(reviewRows.every(({ ingredient }) => ingredient.resolutionType === "missing-package-size"));
assert.ok(reviewRows.every(({ ingredient }) => /size(?:s)? not specified/.test(ingredient.shoppingEquivalent)));

assert.equal(get("CP-012", "cream cheese, cubed").cookingQuantity, 8);
assert.equal(get("CP-012", "cream cheese, cubed").cookingUnit, "ounce");
assert.equal(get("CP-012", "cream cheese, cubed").shoppingEquivalent, "One 8-ounce package cream cheese");
assert.equal(get("CP-006", "diced onion").shoppingEquivalent, "About 1 medium onion");
assert.equal(get("CP-019", "sliced bell pepper").cookingUnit, "cup");
assert.equal(get("CP-020", "celery stalks, diced").shoppingQuantity, 2);
assert.match(get("CP-020", "long-grain rice").preparation, /uncooked/);
assert.equal(get("CP-014", "cornstarch").preparation, "for slurry");
assert.equal(get("CP-014", "water").preparation, "for slurry");

for (const id of ["CP-010", "CP-011"]) {
  const rice = get(id, "Cooked rice, for serving");
  assert.equal(rice.cookingQuantity, null);
  assert.equal(rice.includeInShopping, false);
  assert.equal(consolidateShoppingItems([rice]).length, 0);
}

console.log("CP-001 through CP-020 ingredient checkpoint passed with 30 retained missing-package-size review flags.");
