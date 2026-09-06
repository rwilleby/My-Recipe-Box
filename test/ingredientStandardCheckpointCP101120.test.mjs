import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";

const audited = recipes.filter((recipe) => /^CP-(?:10[1-9]|11\d|120)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.equal(rows.length, 175);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 59);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-package-size").length, 26);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-source-quantity" || ingredient.resolutionType === "dependent-package-instructions").length, 32);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-source-unit").length, 1);

assert.equal(get("CP-101", "bell peppers, sliced").cookingQuantity, 3);
assert.equal(get("CP-101", "onions, sliced").cookingQuantity, 2);
assert.equal(get("CP-110", "shredded cheddar cheese").shoppingQuantity, 4);
assert.equal(get("CP-112", "cooked rice").shoppingQuantity, 0.3333333333);
assert.equal(get("CP-115", "chuck roast").cookingQuantity, 3.5);
assert.equal(get("CP-115", "carrots").cookingQuantity, 2);
assert.equal(get("CP-116", "Parmesan").shoppingQuantity, 2);
assert.equal(get("CP-119", "shredded mozzarella").shoppingQuantity, 4);
assert.equal(get("CP-120", "Italian seasoning").resolutionType, "missing-source-unit");

for (const [id, name] of [["CP-104", "broth"], ["CP-105", "broth"], ["CP-107", "salsa"], ["CP-110", "shredded cheddar cheese"], ["CP-112", "cooked rice"], ["CP-115", "beef broth"], ["CP-116", "breadcrumbs"], ["CP-117", "breadcrumbs"], ["CP-118", "sour cream"], ["CP-119", "shredded mozzarella"], ["CP-120", "Parmesan"]]) assert.equal(get(id, name).originalUnit, "cup");
assert.equal(get("CP-119", "diced tomatoes").originalUnit, "can");
assert.equal(get("CP-113", "dried pinto beans, rinsed").preparation, "rinsed");
assert.equal(get("CP-112", "bell pepper for serving").cookingQuantity, 1);

console.log("CP-101 through CP-120 ingredient checkpoint passed with 59 retained review flags.");
