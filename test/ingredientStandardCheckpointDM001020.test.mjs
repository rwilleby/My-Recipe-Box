import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";

const audited = recipes.filter((recipe) => /^DM-(?:00[1-9]|01\d|020)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.equal(rows.length, 217);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.36"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 14);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-source-quantity").length, 3);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "unresolved-prepared-component").length, 6);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "unresolved-composite-proportions").length, 4);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "product-dependent-cooked-yield").length, 1);

assert.equal(get("DM-008", "Medium apple, peeled and diced").cookingQuantity, 1);
assert.equal(get("DM-008", "Medium apple, peeled and diced").cookingUnit, "cup");
assert.equal(get("DM-004", "Cooked brown rice").shoppingQuantity, 0.6666666667);
assert.equal(get("DM-005", "Cooked spaghetti").shoppingQuantity, 8);
assert.equal(get("DM-018", "Shredded reduced-fat cheddar").shoppingQuantity, 4);
assert.equal(get("DM-002", "Prepared mashed potatoes").resolutionType, "unresolved-prepared-component");
assert.equal(get("DM-006", "Broccoli, carrots, and red bell pepper").resolutionType, "unresolved-composite-proportions");
assert.equal(get("DM-010", "Cooked brown rice and quinoa blend").resolutionType, "product-dependent-cooked-yield");
assert.equal(get("DM-005", "Nonstick cooking spray").includeInShopping, false);

console.log("DM-001 through DM-020 ingredient checkpoint passed with 14 retained review flags.");
