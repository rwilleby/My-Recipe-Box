import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { CP_121_140_RECIPE_REVIEW_FLAGS, STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";

const audited = recipes.filter((recipe) => /^CP-(?:12[1-9]|13\d|140)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.equal(rows.length, 171);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 55);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-package-size").length, 10);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-source-quantity").length, 43);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-total-weight").length, 1);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "unspecified-product-form").length, 1);

assert.equal(get("CP-122", "carrots").cookingQuantity, 1);
assert.equal(get("CP-126", "celery stalks").cookingQuantity, 1.5);
assert.equal(get("CP-132", "apple, grated").shoppingQuantity, 1);
assert.equal(get("CP-134", "scallions, sliced").cookingQuantity, 0.25);
assert.equal(get("CP-123", "mozzarella").shoppingQuantity, 12);
assert.equal(get("CP-124", "Eggs").cookingUnit, "each");
assert.equal(get("CP-126", "acini di pepe").preparation, "dry; cook separately; reserve until finishing");
assert.equal(get("CP-139", "wild rice blend").preparation, "measured dry");
assert.equal(get("CP-134", "pork tenderloins").resolutionType, "missing-total-weight");
assert.equal(get("CP-121", "sun-dried tomatoes").resolutionType, "unspecified-product-form");
assert.equal(get("CP-140", "cheese optional").includeInShopping, false);
assert.match(CP_121_140_RECIPE_REVIEW_FLAGS["CP-125"], /eggplant/i);

console.log("CP-121 through CP-140 ingredient checkpoint passed with 55 retained ingredient-row review flags and 1 recipe-level flag.");
