import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, actions, printer, css] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/features/shopping/ShoppingRecipeActions.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/utils/printRecipeCards.js", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);
assert.match(app, /recipeLinks: \[\{ label: "Recipe", recipeId: recipe\.id/);
assert.match(app, /label: "Main Dish", recipeId: meal\.mainRecipeId/);
assert.match(app, /label: `Side \$\{index \+ 1\}`, recipeId: side\.recipeId/);
assert.match(app, /<ShoppingRecipeActions recipeLinks=\{group\.recipeLinks\}/);
assert.match(actions, /View Recipe Card/);
assert.match(actions, /Print Recipe/);
assert.match(actions, /Print All Three Recipes/);
assert.match(printer, /fullCardImageCandidates/);
assert.match(printer, /Promise\.all\(\[\.\.\.document\.images\]/);
assert.match(css, /\.shoppingRecipeActionsMenu > div/);
console.log("v97.6 Shopping List meal recipe-card view and print contracts passed.");
