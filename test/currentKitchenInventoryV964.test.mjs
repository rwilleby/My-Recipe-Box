import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const storePanel = fs.readFileSync(new URL("../src/components/StoreInventoryImport.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /itemHasSavedRecord/);
assert.match(page, /items: category\.items\.filter\(\(item\) =>\s*itemHasSavedRecord\(item\)/s);
assert.match(page, /MY CURRENT INVENTORY/);
assert.match(page, /See what you have, how much remains, where it is stored, and which items need attention/);
for (const label of ["All Items", "Low Stock", "Expiring Soon", "All Locations", "Refrigerator", "Freezer", "Pantry"]) assert.match(page, new RegExp(label));
assert.match(page, /Search My Inventory/);
assert.match(page, /entryMode === "manual"/);
for (const label of ["Category", "Item", "Product name or variety", "Quantity", "Tracking unit", "Storage", "Low-stock level", "Add to Inventory"]) assert.match(page, new RegExp(label));
assert.match(storePanel, /Choose a category and item below/);
assert.match(css, /\.currentInventoryFilterRow/);
assert.match(css, /\.currentInventoryFilters button\.is-active \{ background: #77716b; color: #fff; \}/);
assert.match(css, /\.currentInventoryLocationSelect \{[^}]*min-width: 108px/s);
assert.match(css, /30px 108px 46px 58px 58px/, "Low is narrower and Buy/Edit use equal widths");
assert.match(page, /Product Name<\/span><span>Notes<\/span><span>Category/);

console.log("v96.4 current-only Kitchen Inventory and guided item-entry contracts passed.");
