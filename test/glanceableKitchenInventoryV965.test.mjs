import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const editor = fs.readFileSync(new URL("../src/components/InventoryItemEditor.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /MY CURRENT INVENTORY/);
assert.doesNotMatch(page, /<InventoryProductThumbnail/);
assert.doesNotMatch(page.slice(page.indexOf("MY CURRENT INVENTORY")), /Any Brand/);
assert.match(page, /Search My Inventory/);
for (const label of ["All Items", "Low Stock", "Expiring Soon", "All Locations", "Refrigerator", "Freezer", "Pantry"]) assert.match(page, new RegExp(label));
for (const label of ["LOW STOCK", "EXPIRING SOON", "EXPIRED", "ON SHOPPING LIST"]) assert.match(page, new RegExp(label));
assert.match(page, /Decrease \$\{productName\} quantity/);
assert.match(page, /Increase \$\{productName\} quantity/);
assert.match(page, /Math\.max\(0, nextQuantity\)/);
for (const label of ["Remove from Current Inventory", "Keep at Zero and Add to Shopping List", "Cancel"]) assert.match(page, new RegExp(label));
assert.match(page, /buy: onShoppingList \? "" : "1"/);
assert.match(page, /No inventory items match this view\./);
assert.match(page, /Your Kitchen Inventory is empty\./);
assert.match(page, /Add products manually, choose them from the product list, or import them from a store\./);
for (const label of ["Product name", "Brand", "Cut or variety", "Preparation or form", "Package size", "Package count", "Quantity owned", "Tracking unit", "Category", "Subcategory", "Storage location", "Expiration or best-by date", "Low-stock level", "Notes", "Retailer", "Product-page link", "Optional price", "Delete Item"]) assert.match(editor, new RegExp(label));
assert.match(editor, /aria-modal="true"/);
assert.match(editor, /event\.key === "Escape"/);
assert.doesNotMatch(page.slice(page.indexOf("MY CURRENT INVENTORY")), /type="number"[^>]*className="masterInventory/);
assert.match(css, /\.currentInventoryRow \{[^}]*grid-template-columns:/s);
assert.match(css, /\.masterKitchenInventoryPage \{[^}]*width: 100% !important/s);
assert.match(css, /\.currentInventoryIdentity strong \{[^}]*font: 800 12px/s);
assert.match(page, /className="currentInventoryFlatList"/);
assert.doesNotMatch(page.slice(page.indexOf("MY CURRENT INVENTORY")), /className="currentInventorySubcategory"/);
assert.match(page, /<strong aria-label=\{`\$\{quantity\} \$\{unit\}`\}>\{quantity\}<\/strong>/);
assert.match(css, /\.currentInventoryLocationText \{[^}]*font: 400 12px/s);
assert.match(css, /@media \(max-width: 700px\)[\s\S]*\.currentInventoryRow \{ grid-template-columns: minmax\(0, 1fr\)/);
assert.match(css, /focus-visible/);

console.log("v96.5 glanceable Kitchen Inventory overview, editing, Shopping List and responsive contracts passed.");
