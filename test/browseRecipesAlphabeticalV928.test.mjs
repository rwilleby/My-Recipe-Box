import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const start = app.indexOf("function RecipesPage(");
const end = app.indexOf("function FavoritesPage(", start);
const recipesPage = app.slice(start, end > start ? end : undefined);

assert.match(recipesPage, /const \[sortBy, setSortBy\] = useState\("library-default"\)/);
assert.match(recipesPage, /function applyQuickCategory\(category\)[\s\S]*?setSelectedCategory\(nextCategory\)[\s\S]*?setSortBy\("library-default"\)/);
assert.match(recipesPage, /useEffect\(\(\) => \{[\s\S]*?setSelectedCategory\(filter && filter !== "All" \? filter : ""\)[\s\S]*?setSortBy\("library-default"\)/);
assert.match(recipesPage, /case 'library-default':[\s\S]*?favoriteOrder[\s\S]*?cuisineOrder[\s\S]*?String\(a\.title \|\| ""\)\.localeCompare/);
assert.match(recipesPage, /case 'az':[\s\S]*?String\(a\.title \|\| ""\)\.localeCompare\([\s\S]*?sensitivity: "base", numeric: true/);
assert.match(recipesPage, /<option value="library-default">Favorites, Cuisine, A–Z<\/option>/);
assert.match(recipesPage, /<option value="az">A–Z<\/option>/);

console.log("Browse Our Recipes defaults to favorites, then cuisine, then alphabetical order");
