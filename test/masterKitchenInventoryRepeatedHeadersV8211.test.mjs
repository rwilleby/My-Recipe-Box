import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.doesNotMatch(page, /masterInventoryLedgerHead/);
assert.match(page, /<h3 role="columnheader">\{familyGroup\.family\}<\/h3>/);
for (const heading of ["Storage", "Form", "Cut / Variety", "Unit", "Have", "Buy", "Notes"]) {
  assert.match(page, new RegExp(`masterInventoryFamilyColumnLabel[^>]*" role="columnheader">${heading}`));
}
assert.match(page, /placeholder="Your Notes\.\.\."/);
assert.match(styles, /\.masterInventoryLedgerFamily h3 \{[^}]*grid-column: 1 \/ -1[^}]*color: #30362b[^}]*font-size: 15px !important[^}]*white-space: nowrap/s);
assert.match(styles, /\.masterInventoryFamilyColumnLabel \{[^}]*color: #647142[^}]*font-size: 10px/s);
assert.match(styles, /\.masterInventoryLedgerNotes input \{[^}]*font-size: 15px/s);
assert.match(styles, /\.masterInventoryLedger \{[^}]*1\.3fr[^}]*\.85fr[^}]*2fr[^}]*58px[^}]*48px[^}]*48px[^}]*1\.2fr/s);
assert.match(styles, /column-gap: 7px/);

console.log("Master Kitchen Inventory repeated food-line headers v82.11 tests passed.");
