import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.doesNotMatch(page, /className="masterInventoryLedger" role="table"/);
for (const heading of ["Cut / Variety", "Preparation / Form", "Brand", "Unit", "Buy", "Notes"]) assert.doesNotMatch(page, new RegExp(`role="columnheader">${heading}`));
assert.match(page, /className="currentInventoryFlatList"/);
assert.match(page, /className="currentInventoryRow"/);
assert.match(page, /setQuantity/);
assert.match(page, /setZeroQuantityChoice/);
assert.match(page, />\{onShoppingList \? "On List" : "Buy"\}<\/button>/);
assert.doesNotMatch(page, /masterInventoryFourColumns/);
assert.match(styles, /\.currentInventoryRow/);
assert.match(styles, /\.currentInventoryQuantityValue/);
assert.match(styles, /@media \(max-width: 700px\)[\s\S]*\.currentInventoryRow/s);

console.log("Master Kitchen Inventory ledger retirement and glanceable-list compatibility tests passed.");
