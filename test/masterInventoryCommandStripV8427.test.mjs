import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles, kitchenPage] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
  readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8"),
]);

assert.match(app, /label: "MASTER KITCHEN INVENTORY", page: "Master Kitchen Inventory"/);
assert.match(app, /title="Master Kitchen Inventory"/);
assert.match(kitchenPage, /<h1>Master Kitchen Inventory<\/h1>/);

const stripStart = app.indexOf('<section className="inventoryHubControlStrip"');
const stripEnd = app.indexOf("</section>", stripStart);
const strip = app.slice(stripStart, stripEnd);
assert.ok(stripStart >= 0 && stripEnd > stripStart);
assert.match(strip, /\["kitchen", "freezer", "pantry"\]\.map/);
assert.match(strip, /Quick[\s\S]*Add/);
assert.match(strip, /Move[\s\S]*Item/);
assert.match(strip, />Print<\/button>/);
assert.match(strip, /inventoryHubClearButton[\s\S]*clearCurrentInventory[\s\S]*>Clear<\/button>/);
assert.doesNotMatch(strip, /Search|Restock|Backup/);

assert.match(app, /function clearCurrentInventory\(\)/);
assert.match(app, /window\.confirm\(`Clear all saved items from \$\{sectionName\}\? This cannot be undone\.`\)/);
assert.match(app, /setMasterInventory\(\{ records: \{\}, customItems: \[\] \}\)/);
assert.match(app, /managedItems: \[\]/);
assert.match(app, /setFreezer\(\{ items: \{\}, customItems: \[\], customLocations: \[\] \}\)/);
assert.match(app, /setPantry\(\{\}\)/);

const v8427Styles = styles.slice(styles.indexOf("v84.27 — CENTERED MASTER INVENTORY COMMAND STRIP"));
assert.match(v8427Styles, /\.inventoryHubControlStrip \{[\s\S]*width: fit-content !important;[\s\S]*margin-left: auto !important;[\s\S]*margin-right: auto !important;/);
assert.match(v8427Styles, /grid-template-columns: minmax\(360px, 480px\) repeat\(4, minmax\(88px, 108px\)\) !important;/);
assert.match(v8427Styles, /\.inventoryHubClearButton \{[\s\S]*color: #a3312d !important;/);

console.log("v84.27 master inventory command strip contracts passed.");
