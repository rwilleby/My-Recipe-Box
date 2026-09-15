import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

assert.match(app, /recipe\.originalRecipeId \? `images\/thumbs\/heroes\/\$\{recipe\.originalRecipeId\}\.webp`/);
assert.match(app, /recipe\.originalRecipeId \? `images\/heroes\/\$\{recipe\.originalRecipeId\}\.webp`/);
for (const label of ["ALL", "COMPLETE DINNERS", "DIET MEALS", "BUILD-A-MEALS", "VEGAN MEALS"]) assert.ok(app.includes(`"${label}"`));
for (const pair of ['["AM","AMERICAN"]', '["AS","ASIAN"]', '["IT","ITALIAN"]', '["MX","MEXICAN"]', '["SF","SEAFOOD"]']) assert.ok(app.includes(pair));
assert.match(app, /favoriteView === "vegan-meals"/);
assert.match(css, /\.favoritesControlStrip \{grid-template-columns: minmax\(130px,1fr\) minmax\(54px,\.5fr\) repeat\(5/);
assert.match(css, /\.browseResultsRow,[\s\S]*\.dinnerCombinationResultsBar,[\s\S]*\.slowCookerResultCount[\s\S]*font:400 18px/);
assert.match(css, /\.browseResultsRow strong,[\s\S]*font:800 24px/);

console.log("v99.18 plated Vegan heroes, Favorites strip, and unified counts passed");
