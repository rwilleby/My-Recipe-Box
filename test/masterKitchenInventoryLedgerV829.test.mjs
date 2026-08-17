import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

for (const heading of ["Food", "Storage", "Form / Package", "Have", "Buy", "Notes"]) {
  assert.match(page, new RegExp(`role="columnheader">${heading.replace(" / ", " \/ ")}`));
}
assert.match(page, /className="masterInventoryLedger" role="table"/);
assert.match(page, /className="masterInventoryLedgerFamily"/);
assert.match(page, /className="masterInventoryLedgerRow"/);
assert.match(page, /familyGroup\.items\.map/);
assert.match(page, /family-note-/);
assert.match(page, /updateRecord\(item\.id, \{ have:/);
assert.match(page, /updateRecord\(item\.id, \{ buy:/);
assert.doesNotMatch(page, /masterInventoryFourColumns/);
assert.match(styles, /grid-template-columns: 105px 82px minmax\(180px, 1fr\) 50px 50px minmax\(150px, \.55fr\) 18px/);
assert.match(styles, /min-height: 27px/);
assert.match(styles, /font-size: 9px; font-weight: 600; text-align: center/);
assert.match(styles, /@media \(max-width: 700px\)[\s\S]*\.masterInventoryLedgerHead \{ display: none; \}/);

console.log("Master Kitchen Inventory Option B ledger v82.9 tests passed.");
