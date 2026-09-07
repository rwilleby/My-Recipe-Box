import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");
const page = app.slice(app.indexOf("function ShoppingListPage"), app.indexOf("function CollectionsPage"));

for (const label of ["Consolidated Shopping List", "Shopping List By Meal Component", "Print Your List", "Clear Meals &amp; Start Over"]) assert.match(page, new RegExp(label));
for (const retired of ["shoppingPreviewButton", "shoppingWorksheetButton", "shoppingDigitalCheckButton", "shoppingGroceryPicksButton"]) assert.doesNotMatch(page, new RegExp(retired));
assert.match(css, /v97\.11 — full-width four-action Shopping List control strip/);
assert.match(css, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
assert.match(css, /min-height: 40px !important;\s*height: 40px !important;/);
assert.match(css, /white-space: nowrap !important;/);
console.log("v97.11 four-action Shopping List control-strip contracts passed.");
