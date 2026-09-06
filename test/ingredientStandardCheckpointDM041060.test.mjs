import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";

const audited = recipes.filter((recipe) => /^DM-(?:04[1-9]|05\d|060)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.equal(rows.length, 201);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 14);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-source-quantity").length, 4);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "unresolved-composite-proportions").length, 4);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "uncertain-produce-yield").length, 3);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "product-dependent-package-yield").length, 1);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "uncertain-prepared-yield").length, 1);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "product-dependent-cooked-yield").length, 1);

assert.equal(get("DM-044", "Red bell pepper, chopped").cookingQuantity, 1);
assert.equal(get("DM-047", "Zucchini, chopped").resolutionType, "uncertain-produce-yield");
assert.equal(get("DM-043", "Bell peppers and onions").resolutionType, "unresolved-composite-proportions");
assert.equal(get("DM-041", "Cooked brown rice").shoppingQuantity, 0.6666666667);
assert.equal(get("DM-047", "Cooked brown rice").shoppingQuantity, 1);
assert.equal(get("DM-058", "Cooked jasmine rice").shoppingQuantity, 0.6666666667);
assert.equal(get("DM-052", "Grated Parmesan").shoppingQuantity, 1);
assert.equal(get("DM-053", "Grated Parmesan").shoppingQuantity, 6);
assert.equal(get("DM-051", "Cod or tilapia fillets").shoppingQuantity, 1);
assert.equal(get("DM-051", "Cod or tilapia fillets").shoppingUnit, "pound");
assert.equal(get("DM-051", "Cod or tilapia fillets").acceptableAlternatives.length, 2);

console.log("DM-041 through DM-060 ingredient checkpoint passed with 14 retained review flags.");
