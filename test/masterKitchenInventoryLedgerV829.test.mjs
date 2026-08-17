import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /<h3 role="columnheader">\{familyGroup\.family\}<\/h3>/);
for (const heading of ["Storage", "Type", "Unit", "Have", "Buy", "Notes"]) assert.match(page, new RegExp(`role="columnheader">${heading}`));
assert.match(page, /className="masterInventoryLedger" role="table"/);
assert.match(page, /className="masterInventoryLedgerFamily"/);
assert.match(page, /className="masterInventoryLedgerRow"/);
assert.match(page, /familyGroup\.items\.map/);
assert.match(page, /family-note-/);
assert.match(page, /updateRecord\(item\.id, \{ have:/);
assert.match(page, /updateRecord\(item\.id, \{ buy:/);
assert.doesNotMatch(page, /masterInventoryFourColumns/);
assert.match(styles, /grid-template-columns: subgrid/);
assert.match(styles, /min-height: 31px/);
assert.match(styles, /font-size: 10px; font-weight: 600; text-align: center/);
assert.match(styles, /@media \(max-width: 700px\)[\s\S]*\.masterInventoryFamilyColumnLabel \{ display: none; \}/);

console.log("Master Kitchen Inventory Option B ledger v82.9 tests passed.");
