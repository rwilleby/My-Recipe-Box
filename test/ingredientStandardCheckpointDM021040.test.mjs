import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";

const audited = recipes.filter((recipe) => /^DM-(?:02[1-9]|03\d|040)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.equal(rows.length, 198);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.36"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 14);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-source-quantity").length, 6);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "unresolved-composite-proportions").length, 6);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "uncertain-produce-yield").length, 1);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "unspecified-product-form").length, 1);

assert.equal(get("DM-025", "Red bell pepper, chopped").cookingQuantity, 1);
assert.equal(get("DM-025", "Zucchini, chopped").resolutionType, "uncertain-produce-yield");
assert.equal(get("DM-028", "Sun-dried tomatoes, chopped").resolutionType, "unspecified-product-form");
assert.equal(get("DM-032", "Cooked brown rice").shoppingQuantity, 0.6666666667);
assert.equal(get("DM-036", "Cooked jasmine rice").shoppingQuantity, 0.6666666667);
assert.equal(get("DM-028", "Grated Parmesan").shoppingQuantity, 4);
assert.equal(get("DM-027", "Reduced-fat cheddar").shoppingQuantity, 6);
assert.equal(get("DM-034", "Snow peas and carrots").resolutionType, "unresolved-composite-proportions");

console.log("DM-021 through DM-040 ingredient checkpoint passed with 14 retained review flags.");
