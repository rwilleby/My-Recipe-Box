import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /masterInventoryLedgerRow/);
assert.match(page, /role="columnheader">Have/);
assert.match(page, /className="masterInventoryLedgerNotes"><span>Notes<\/span><input type="text"/);
assert.doesNotMatch(page, /<textarea/);
assert.match(styles, /font-size: 11px !important/);
assert.match(styles, /height: 23px/);
assert.match(styles, /min-height: 27px/);
assert.match(styles, /white-space: nowrap/);
assert.match(styles, /height: 24px/);

console.log("Master Kitchen Inventory density refinements v82.7 tests passed.");
