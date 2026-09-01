import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { recipes } from "../src/data/recipes.js";
import { getTextRecipeContent } from "../src/utils/textRecipe.js";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const enabledRecipes = recipes.filter(
  (recipe) => Array.isArray(recipe.ingredients)
    && recipe.ingredients.length > 0
    && Array.isArray(recipe.directions)
    && recipe.directions.length > 0,
);

assert.ok(enabledRecipes.length > 100, "the Text Recipe audit must cover the active recipe catalog");
assert.ok(
  enabledRecipes.some((recipe) => recipe.ingredients.some((ingredient) => typeof ingredient === "object")),
  "the audit must include structured ingredient records",
);

for (const recipe of enabledRecipes) {
  const content = getTextRecipeContent(recipe);
  assert.equal(content.available, true, `${recipe.id} should keep Text Recipe enabled`);
  assert.ok(content.ingredients.length > 0, `${recipe.id} needs formatted ingredients`);
  assert.ok(content.directions.length > 0, `${recipe.id} needs formatted directions`);
  for (const ingredient of content.ingredients) {
    assert.equal(typeof ingredient, "string", `${recipe.id} ingredients must render as text`);
    assert.ok(ingredient.trim(), `${recipe.id} ingredients must not be blank`);
    assert.doesNotMatch(ingredient, /\[object Object\]/, `${recipe.id} must not expose object text`);
  }
}

assert.match(app, /getTextRecipeContent\(recipe\)/);
assert.doesNotMatch(app, /textRecipeIngredients = Array\.isArray\(recipe\.ingredients\)/);

console.log(`v96.1 Text Recipe structured ingredient contracts passed for ${enabledRecipes.length} recipes.`);
