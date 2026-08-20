import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");
const finalStart = css.lastIndexOf("v85.4 minor edit — align Crock Pot finder spacing and result count with Diet Meals.");
const finalStyles = css.slice(finalStart);

assert.ok(finalStart >= 0, "Missing v85.4 Crock Pot alignment styles");
assert.match(finalStyles, /\.slowCookerRecipesPage \{[\s\S]*padding-top: 0 !important/);
assert.match(finalStyles, /\.slowCookerResultCount \{[\s\S]*gap: 6px !important[\s\S]*margin: 4px 0 14px !important[\s\S]*font-size: 13px !important/);
assert.match(finalStyles, /\.slowCookerResultCount strong \{[\s\S]*color: #2f8747 !important[\s\S]*font-size: 15px !important/);
assert.match(app, /<strong>\{filteredRecipes\.length\}<\/strong>\s*<span>Crock Pot recipes shown<\/span>/);

console.log("v85.4 Crock Pot spacing and Diet Meals count-style alignment passed");
