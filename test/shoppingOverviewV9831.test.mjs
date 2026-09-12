import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/App.css", import.meta.url), "utf8");
const page = app.slice(app.indexOf("function ShoppingListPage"), app.indexOf("function FavoritesPage"));

assert.match(page, /title="Shopping Overview"/);
assert.match(page, /Review what you’re planning to make, confirm what you already have, and shop only for what you still need\./);
for (const label of ["My Planned Meals", "Items in Stock", "My Shopping List"]) assert.match(page, new RegExp(label));
assert.match(page, /role="tablist" aria-label="Shopping overview"/);
assert.match(page, /role="tabpanel"/);
assert.match(page, /setShoppingOverviewView\("stock"\)/);
assert.match(page, /setShoppingOverviewView\("list"\)/);
assert.match(page, /Open Guided Stock Check/);
assert.match(page, /shoppingOverviewListPanel/);
assert.match(css, /\.shoppingOverviewControlStrip/);
assert.match(css, /\.shoppingOverviewPanel/);

console.log("Shopping Overview v98.3.1 contracts passed.");
