import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";

const audited = recipes.filter((recipe) => /^VG-(?:02\d|030)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 11);
assert.equal(rows.length, 99);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 27);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-package-size").length, 8);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "unresolved-composite-seasoning").length, 11);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "unspecified-cooking-state").length, 4);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "unspecified-product-form").length, 3);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "unresolved-prepared-component").length, 1);

assert.equal(get("VG-020", "Red beans").resolutionType, "missing-package-size");
assert.equal(get("VG-020", "Salt, pepper and dried herbs").cookingQuantity, null);
assert.equal(get("VG-020", "Salt, pepper and dried herbs").cookingUnit, "");
assert.equal(get("VG-022", "BBQ sauce verified vegan").recipeName, "Vegan BBQ sauce");
assert.equal(get("VG-022", "Cabbage slaw").resolutionType, "unresolved-prepared-component");
assert.equal(get("VG-025", "Cooked rice").shoppingQuantity, 0.5);
assert.equal(get("VG-027", "Roasted red pepper").resolutionType, "unspecified-product-form");
assert.equal(get("VG-028", "Chickpeas").resolutionType, "unspecified-product-form");
assert.equal(get("VG-030", "Quinoa").resolutionType, "unspecified-cooking-state");
assert.equal(get("VG-030", "Corn").resolutionType, "unspecified-product-form");

const activeRecipes = recipes.filter((recipe) => !recipe.originalRecipeId);
const activeRows = activeRecipes.flatMap((recipe) => recipe.ingredients || []);
assert.equal(activeRecipes.length, 773);
assert.equal(activeRows.length, 7703);
assert.ok(activeRows.every((ingredient) => ingredient.standardVersion === "1.37"));

console.log("VG-020 through VG-030 ingredient checkpoint passed with 27 retained review flags; active catalog complete.");
