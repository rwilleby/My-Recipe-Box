import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /className="masterInventoryFamilyHeader" role="row"/);
assert.match(page, /role="columnheader">Storage<\/span>/);
assert.doesNotMatch(page, /role="columnheader">Raw\/Cooked<\/span>/);
assert.match(styles, /\.masterInventoryFamilyHeader \{[^}]*background: #e5ded2/s);
assert.match(styles, /\.masterInventoryHaveLabel, \.masterInventoryBuyLabel \{[^}]*justify-content: center/s);
assert.match(styles, /\.masterInventoryLedgerQuantity \{ display: grid; place-items: center; \}/);

console.log("Master Kitchen Inventory beige family header band v82.12 tests passed.");
