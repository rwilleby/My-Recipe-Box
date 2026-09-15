import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/App.css", import.meta.url), "utf8");
const discovery = readFileSync(new URL("../src/features/recipe-library/RecipeLibraryDiscovery.jsx", import.meta.url), "utf8");

for (const label of ["AMERICAN", "ASIAN", "ITALIAN", "MEXICAN", "SEAFOOD", "DIET MEALS", "VEGAN"]) assert.ok(app.includes(`"${label}"`), `${label} must be available`);
assert.match(app, /<option value="all">By Protein\.\.\.<\/option>/);
for (const protein of ["beef", "chicken", "pork", "salads", "seafood", "vegetarian"]) assert.ok(app.includes(`"${protein}"`));
assert.match(discovery, /<option value="">More\.\.\.<\/option>/);
assert.match(app, /showFeaturedRecipes=\{false\}/);
assert.match(app, /const visibleRecipes = filteredRecipes\.slice\(0, safePage \* perPage\)/);
assert.match(app, /Show More Recipes/);
assert.match(app, /found · showing \{visibleRecipes\.length\}/);
assert.match(app, /browseCompactRecipeGrid favoritesRecipeGrid/);
assert.match(app, /holidayMenuDishes browseCompactRecipeGrid/);
assert.match(app, /<CompactBrowseRecipeCard key=\{`\$\{selectedMenu\.occasion\}-\$\{dish\.role\}`\}/);
assert.match(css, /minmax\(54px,\.5fr\)/);
assert.match(css, /main\.veganRecipeLibraryPage[\s\S]*repeat\(3, minmax\(0, 1fr\)\)/);
assert.match(css, /\.favoritesRecipeGrid,[\s\S]*\.holidayMenuDishes\.browseCompactRecipeGrid/);

console.log("v99.17 unified control strips, cards, counts, and Show More contracts passed");
