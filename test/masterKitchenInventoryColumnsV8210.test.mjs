import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /<h3 role="columnheader">\{familyGroup\.family\}<\/h3>/);
for (const heading of ["Raw/Cooked", "Type", "Unit", "Have", "Buy", "Notes"]) assert.match(page, new RegExp(`role="columnheader">${heading}`));
assert.doesNotMatch(page, /Form \/ Package/);
assert.match(page, /className="masterInventoryForm"/);
assert.match(page, /className="masterInventoryPackage"/);
assert.match(page, /className="masterInventoryNotesSpacer"/);
assert.match(page, /<span className="masterInventoryPackage" role="cell">\{item\.unit\}<\/span>/);
assert.match(styles, /\.masterInventoryLedger \{[^}]*grid-template-columns:[^}]*1\.65fr[^}]*\.8fr[^}]*2fr[^}]*\.55fr[^}]*\.42fr[^}]*\.42fr[^}]*1\.4fr/s);
assert.match(styles, /text-transform: uppercase/);
assert.match(styles, /\.masterInventoryLedgerFamily h3 \{[^}]*font-family: Inter, Arial, sans-serif !important;[^}]*font-size: 15px !important/s);
assert.match(styles, /\.masterInventoryStorage \{[^}]*font-size: 10px/s);
assert.match(styles, /\.masterInventoryForm, \.masterInventoryPackage \{[^}]*font-size: 10px/s);
assert.match(styles, /\.masterInventoryLedgerNotes \{[^}]*grid-column: 7/s);

console.log("Master Kitchen Inventory seven-column uppercase layout v82.10 tests passed.");
