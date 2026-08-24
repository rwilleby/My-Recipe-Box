import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const start = app.indexOf("function RecipesPage(");
const end = app.indexOf("function FavoritesPage(", start);
const recipesPage = app.slice(start, end > start ? end : undefined);

assert.match(recipesPage, /const \[sortBy, setSortBy\] = useState\("az"\)/);
assert.match(recipesPage, /function applyQuickCategory\(category\)[\s\S]*?setSelectedCategory\(nextCategory\)[\s\S]*?setSortBy\("az"\)/);
assert.match(recipesPage, /useEffect\(\(\) => \{[\s\S]*?setSelectedCategory\(filter && filter !== "All" \? filter : ""\)[\s\S]*?setSortBy\("az"\)/);
assert.match(recipesPage, /case 'az':[\s\S]*?String\(a\.title \|\| ""\)\.localeCompare\([\s\S]*?sensitivity: "base", numeric: true/);
assert.match(recipesPage, /<option value="az">A–Z<\/option>/);

console.log("Browse Our Recipes defaults All and category-filter views to alphabetical order");
