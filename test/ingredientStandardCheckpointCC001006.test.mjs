import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";

const audited = recipes.filter((recipe) => /^CC-00[1-6]$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);
const allowedUnits = new Set(STANDARD_COOKING_UNITS);

assert.equal(audited.length, 6);
assert.equal(rows.length, 58);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.equal(rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review").length, 0);
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !allowedUnits.has(ingredient.cookingUnit)), []);
assert.equal(get("CC-001", "Butter, melted").preparation, "melted");
assert.equal(get("CC-001", "Large eggs").qty, 2);
assert.equal(get("CC-001", "Cream cheese, softened").qty, 16);
assert.equal(get("CC-001", "Cream cheese, softened").shoppingEquivalent, "Two 8-ounce packages");
assert.equal(get("CC-003", "Cream cheese, softened").shoppingQuantity, 16);
assert.equal(get("CC-003", "Cream cheese, softened").shoppingEquivalent, "Two 8-ounce packages; 4 ounces remain");
assert.equal(get("CC-003", "Oreo cookies, crushed").canonicalKey, get("CC-003", "Finely chopped Oreo cookies").canonicalKey);
assert.equal(get("CC-002", "Salted caramel sauce, divided").preparation, "divided between filling and topping");
assert.equal(get("CC-004", "Strawberry jam").preparation, "for swirl");
assert.equal(get("CC-006", "Blueberry pie filling").preparation, "for topping");

console.log("CC-001 through CC-006 ingredient checkpoint passed with zero review flags.");
