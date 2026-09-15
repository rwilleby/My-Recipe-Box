import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, css] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

const compactCard = app.slice(
  app.indexOf("function CompactBrowseRecipeCard("),
  app.indexOf("function RecipeHeroCard(", app.indexOf("function CompactBrowseRecipeCard(")),
);
const recipesPage = app.slice(
  app.indexOf("function RecipesPage("),
  app.indexOf("function dinnerMealImageCandidates("),
);

assert.match(compactCard, /compactDinnerCard compactBrowseRecipeCard/);
assert.match(compactCard, /<DinnerRecipeHero recipe=\{recipe\}/);
assert.match(compactCard, /compactDinnerCardNumber">\{recipe\.id\}/);
assert.match(compactCard, /\{recipe\.category \|\| "Recipe"\}/);
assert.match(compactCard, /\{calories \?\? "—"\} cal/);
assert.match(compactCard, /\{protein \?\? "—"\}g protein/);
assert.match(compactCard, /MB \{mealBalance \?\? "—"\}/);
assert.match(compactCard, /View Recipe Details/);
assert.match(compactCard, /compactDinnerFavorite/);
assert.match(recipesPage, /browseRecipeGrid browseCompactRecipeGrid/);
assert.match(recipesPage, /<CompactBrowseRecipeCard/);
assert.doesNotMatch(recipesPage, /<RecipeCard[\s\S]*displayMode="card"/);
assert.match(css, /\.browseCompactRecipeGrid[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
assert.doesNotMatch(css, /@media \(max-width: (?:860|1150)px\) \{\s*\.browseCompactRecipeGrid/);

console.log("v99.9 Browse Recipe Library compact dinner-style cards passed.");
