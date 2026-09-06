import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";

const audited = recipes.filter((recipe) => /^HS-(?:00[1-9]|01\d|020)$/.test(recipe.id));
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, sourceText) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.sourceText === sourceText);

assert.equal(audited.length, 20);
assert.equal(rows.length, 163);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.ok(rows.every(({ ingredient }) => ingredient.sourceText));
assert.ok(rows.every(({ ingredient }) => Number.isFinite(ingredient.cookingQuantity)));
assert.ok(rows.every(({ ingredient }) => ingredient.cookingUnit));
assert.deepEqual(rows.filter(({ ingredient }) => !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 10);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "uncertain-produce-yield").length, 9);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-package-size").length, 1);

assert.equal(get("HS-001", "4 filet mignon steaks (6 oz each)").shoppingQuantity, 24);
assert.equal(get("HS-001", "4 filet mignon steaks (6 oz each)").shoppingUnit, "ounce");
assert.equal(get("HS-002", "1 can diced tomatoes (14.5 oz)").cookingQuantity, 14.5);
assert.equal(get("HS-003", "1 small onion, chopped").cookingQuantity, 0.5);
assert.equal(get("HS-010", "1 red bell pepper, diced").cookingQuantity, 1);
assert.equal(get("HS-004", "1–2 jalapeños, seeded and chopped").recipeQuantityText, "1–2");
assert.equal(get("HS-013", "2 cups shredded cheddar, divided").shoppingQuantity, 16);
assert.equal(get("HS-016", "2 Tbsp butter or olive oil").acceptableAlternatives.length, 2);
assert.equal(get("HS-019", "1 tsp maple syrup, optional").includeInShopping, false);
assert.equal(get("HS-020", "1 whole turkey (12–14 lb), thawed").recipeQuantityText, "12–14");
assert.equal(get("HS-020", "1 whole turkey (12–14 lb), thawed").shoppingQuantity, 13);

console.log("HS-001 through HS-020 ingredient checkpoint passed with 10 retained review flags.");
