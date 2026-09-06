import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { STANDARD_COOKING_UNITS } from "../src/data/ingredientStandards.js";

const audited = recipes.filter((recipe) => /^CP-(?:08[1-9]|09\d|100)$/.test(recipe.id) && !recipe.originalRecipeId);
const rows = audited.flatMap((recipe) => recipe.ingredients.map((ingredient) => ({ recipeId: recipe.id, ingredient })));
const get = (recipeId, originalName) => recipes.find((recipe) => recipe.id === recipeId).ingredients.find((ingredient) => ingredient.originalName === originalName);

assert.equal(audited.length, 20);
assert.equal(rows.length, 180);
assert.ok(rows.every(({ ingredient }) => ingredient.standardVersion === "1.37"));
assert.deepEqual(rows.filter(({ ingredient }) => ingredient.cookingUnit && !STANDARD_COOKING_UNITS.includes(ingredient.cookingUnit)), []);

const reviewRows = rows.filter(({ ingredient }) => ingredient.reviewStatus === "needs-review");
assert.equal(reviewRows.length, 36);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-package-size").length, 14);
assert.equal(reviewRows.filter(({ ingredient }) => ingredient.resolutionType === "missing-source-quantity").length, 22);

assert.equal(get("CP-081", "corn, cut").cookingQuantity, 4);
assert.equal(get("CP-082", "Eggs").cookingQuantity, 10);
assert.equal(get("CP-082", "cheddar").shoppingQuantity, 8);
assert.equal(get("CP-083", "carrots").cookingQuantity, 1.5);
assert.equal(get("CP-083", "long-grain rice").preparation, "cook separately; reserve until finishing");
assert.equal(get("CP-084", "carrots, shredded").cookingQuantity, 1);
assert.equal(get("CP-084", "cheddar").shoppingQuantity, 12);
assert.equal(get("CP-085", "cooked bacon, crumbled").shoppingQuantity, 6);
assert.equal(get("CP-088", "ditalini").shoppingEquivalent, "1 cup dry ditalini");
assert.equal(get("CP-088", "beans").canonicalName, "Beans");
assert.equal(get("CP-090", "shredded Gruyére cheese").recipeName, "Gruyère cheese");
assert.equal(get("CP-094", "Worcestershire").cookingQuantity, null);
assert.equal(get("CP-094", "Worcestershire").includeInShopping, false);

for (const [id, name] of [["CP-081", "broth"], ["CP-082", "milk"], ["CP-083", "long-grain rice"], ["CP-085", "milk"], ["CP-086", "cream"], ["CP-087", "small pasta"], ["CP-088", "ditalini"], ["CP-089", "cream"], ["CP-091", "wild-rice blend"], ["CP-091", "cream"], ["CP-092", "cream"], ["CP-093", "cream"]]) {
  assert.equal(get(id, name).originalUnit, "cup");
}
assert.equal(get("CP-100", "diced tomatoes").originalUnit, "can");
assert.equal(get("CP-089", "Italian sausage, browned").preparation, "browned");

console.log("CP-081 through CP-100 ingredient checkpoint passed with 36 retained review flags.");
