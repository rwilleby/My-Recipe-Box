import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";

const audited = recipes.filter((recipe) => /^HS-(?:02[1-9]|030)$/.test(recipe.id));
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, sourceText) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.sourceText === sourceText);

assert.equal(audited.length, 10);
assert.equal(rows.length, 77);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.ok(rows.every(({ ingredient }) => ingredient.sourceText));
assert.equal(rows.filter(({ ingredient }) => ingredient.cookingQuantity === null).length, 1);
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 2);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "uncertain-produce-yield").length, 1);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "unmeasured-cooking-supply").length, 1);

assert.equal(get("HS-021", "3 onions, sliced").shoppingQuantity, 3);
assert.equal(get("HS-022", "1/4 cup matzo meal or flour").acceptableAlternatives.length, 2);
assert.equal(get("HS-022", "Vegetable oil, for frying").cookingQuantity, null);
assert.equal(get("HS-022", "Vegetable oil, for frying").recipeQuantityText, "As needed");
assert.equal(get("HS-024", "4 cod fillets (6 oz each)").shoppingQuantity, 24);
assert.equal(get("HS-025", "3/4 cup grated Parmesan").shoppingQuantity, 6);
assert.equal(get("HS-026", "2 bunches broccolini, trimmed").shoppingEquivalent, "2 bunches broccolini");
assert.equal(get("HS-027", "1 bone-in prime rib roast (5–6 lb)").recipeQuantityText, "5–6");
assert.equal(get("HS-029", "8 slices prosciutto").cookingUnit, "slice");
assert.equal(get("HS-029", "1 sheet puff pastry").shoppingEquivalent, "1 sheet puff pastry");
assert.equal(get("HS-030", "1/2 cup grated Parmesan").shoppingQuantity, 4);

const allHolidayRows = recipes.filter((recipe) => /^HS-\d{3}$/.test(recipe.id)).flatMap((recipe) => recipe.ingredients);
assert.equal(allHolidayRows.length, 240);
assert.ok(allHolidayRows.every((ingredient) => ingredient.standardVersion === "1.37"));

console.log("HS-021 through HS-030 ingredient checkpoint passed with 2 retained review flags; Holiday Specials complete.");
