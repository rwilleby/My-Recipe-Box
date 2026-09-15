import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const recipesPage = app.slice(
  app.indexOf("function RecipesPage("),
  app.indexOf("function dinnerMealImageCandidates("),
);

assert.match(recipesPage, /const perPage = 12/);
assert.match(recipesPage, /const visibleRecipes = veganOnly[\s\S]*?filteredRecipes\.slice\(0, safePage \* perPage\)/);
assert.match(recipesPage, /const remainingRecipeCount = Math\.max\(0, filteredRecipes\.length - visibleRecipes\.length\)/);
assert.match(recipesPage, /\{veganOnly && totalPages > 1 && \(/);
assert.match(recipesPage, /\{!veganOnly && remainingRecipeCount > 0 && \(/);
assert.match(recipesPage, /completeDinnerShowMore browseRecipeShowMore/);
assert.match(recipesPage, /Show More Recipes/);
assert.match(recipesPage, /\{remainingRecipeCount\} remaining/);

console.log("v99.13 Recipe Library uses the approved Show More pattern in batches of 12.");
