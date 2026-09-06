import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";

const audited = recipes.filter((recipe) => /^CP-(?:14[1-9]|15\d|160)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.equal(rows.length, 151);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.36"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 71);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-package-size").length, 14);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-source-quantity").length, 54);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-total-weight").length, 1);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "uncertain-produce-yield").length, 2);

assert.equal(get("CP-142", "thick pork chops").resolutionType, "missing-total-weight");
assert.equal(get("CP-146", "cabbage, chopped").cookingUnit, "head");
assert.equal(get("CP-147", "potatoes, sliced").cookingUnit, "each");
assert.equal(get("CP-147", "carrots").cookingQuantity, 1.5);
assert.equal(get("CP-148", "apples, diced").cookingQuantity, 3);
assert.equal(get("CP-157", "cheddar").shoppingQuantity, 16);
assert.equal(get("CP-159", "butter").shoppingUnit, "stick");
assert.deepEqual(get("CP-148", "water or milk").acceptableAlternatives, ["Water", "Milk"]);
assert.equal(get("CP-156", "included icing").includeInShopping, false);

console.log("CP-141 through CP-160 ingredient checkpoint passed with 71 retained review flags.");
