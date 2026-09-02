import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles, kitchenPage, kitchenStyles] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
  readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8"),
]);

const navStart = app.indexOf('label: "YOUR KITCHEN"');
const navEnd = app.indexOf('label: "OUR RECIPES"', navStart);
const kitchenMenu = app.slice(navStart, navEnd);
assert.match(kitchenMenu, /label: "YOUR KITCHEN INVENTORY", page: "Master Kitchen Inventory"/);
assert.doesNotMatch(kitchenMenu, /label: "FREEZER INVENTORY"/);
assert.doesNotMatch(kitchenMenu, /label: "PANTRY INVENTORY"/);

assert.match(app, /function InventoryHubPage\(/);
assert.match(app, /\["Master Kitchen Inventory", "Freezer Inventory Management", "Pantry Staples"\]\.includes\(activePage\)/);
assert.match(app, /\["kitchen", "freezer", "pantry"\]\.map/);
assert.match(app, /KITCHEN[\s\S]*FREEZER[\s\S]*PANTRY|tab\.toUpperCase\(\)/);
assert.match(app, /inventoryHubView: "rrb_inventoryHubView_v1"/);
assert.match(app, /Quick[\s\S]*Add/);
assert.match(app, /Move[\s\S]*Item/);
assert.match(app, /className="inventoryHubClearButton" onClick=\{clearCurrentInventory\}>Clear/);
assert.match(app, /buildMasterInventoryShoppingItems/);
assert.match(app, /buildPantryRestockItems/);
assert.match(app, /Kitchen Restock/);
assert.match(app, /Pantry Restock/);
assert.match(app, /<option value="in-stock">In Stock<\/option>[\s\S]*<option value="low">Low<\/option>[\s\S]*<option value="out">Out<\/option>/);
assert.match(app, /externalSearch=\{currentSearch\} embedded/);

assert.match(kitchenPage, /externalSearch = "", embedded = false/);
assert.match(kitchenPage, /useState\(\(\) => new Set\(\)\)/);
assert.match(kitchenPage, /className="currentInventoryBadges"/);
assert.match(kitchenPage, />\{onShoppingList \? "On List" : "Buy"\}<\/button>/);
assert.match(kitchenPage, /updateRecord\(rowId, \{ buy:/);
assert.match(kitchenStyles, /\.currentInventoryRow/);

const hubStyles = styles.slice(styles.lastIndexOf("v84.25 — UNIFIED KITCHEN / FREEZER / PANTRY INVENTORY HUB"));
assert.match(hubStyles, /\.inventoryHubControlStrip \{[\s\S]*width: 90%/);
assert.match(hubStyles, /\.inventoryHubTabs \{[\s\S]*grid-template-columns: repeat\(3/);
assert.match(hubStyles, /\.inventoryHubTabs button\.isActive \{ background: #9d9792; color: #fff; \}/);
assert.match(hubStyles, /@media \(max-width: 700px\)[\s\S]*width: 96%/);

console.log("v84.25 unified inventory hub contracts passed.");
