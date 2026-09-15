import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, discovery] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/features/recipe-library/RecipeLibraryDiscovery.jsx", import.meta.url), "utf8"),
]);

const recipesPage = app.slice(
  app.indexOf("function RecipesPage("),
  app.indexOf("function dinnerMealImageCandidates("),
);

assert.match(discovery, /title: "Browse Our Recipe Library"/);
assert.match(discovery, /<nav className="libraryCategorySelectorRow"/);
assert.match(recipesPage, /showFeaturedRecipes=\{veganOnly\}/);
assert.match(recipesPage, /useState\("library-default"\)/);
assert.match(recipesPage, /<option value="library-default">Favorites, Cuisine, A–Z<\/option>/);
assert.match(recipesPage, /Number\(favorites\.includes\(b\.id\)\) - Number\(favorites\.includes\(a\.id\)\)/);
assert.match(recipesPage, /String\(a\.category \|\| a\.categoryCode \|\| ""\)/);
assert.match(recipesPage, /String\(a\.title \|\| ""\)\.localeCompare/);

console.log("v99.8 Recipe Library icon navigation, static top, and default ordering contracts passed.");
