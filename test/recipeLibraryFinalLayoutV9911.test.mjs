import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, css] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);
const discovery = await readFile(new URL("../src/features/recipe-library/RecipeLibraryDiscovery.jsx", import.meta.url), "utf8");

const recipesPage = app.slice(
  app.indexOf("function RecipesPage("),
  app.indexOf("function dinnerMealImageCandidates("),
);
const finalCss = css.slice(
  css.indexOf("/* v99.11 — final Browse Library column lock"),
  css.indexOf("@media (max-width: 430px)", css.indexOf("/* v99.11 — final Browse Library column lock")),
);

assert.match(recipesPage, /\{veganOnly && <section className="browseInventoryStyleToolbar/);
assert.doesNotMatch(recipesPage, /aria-label=\{veganOnly \? "Vegan recipe library sorting and filters" : "Recipe library sorting and filters"\}/);
assert.match(finalCss, /main\.browseRecipesPage:not\(\.veganRecipeLibraryPage\) \.recipeGrid\.browseRecipeGrid\.browseCompactRecipeGrid/);
assert.match(finalCss, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\) !important/);
assert.doesNotMatch(finalCss, /repeat\(2,/);
assert.match(discovery, /Browse the full recipe collection/);

console.log("v99.11 standard Recipe Library has no search strip and is locked three across above phone width.");
