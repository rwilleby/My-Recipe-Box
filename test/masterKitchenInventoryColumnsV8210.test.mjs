import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /<h3 role="columnheader">\{familyGroup\.family\}<\/h3>/);
for (const heading of ["Cut / Variety", "Preparation / Form", "Brand", "Storage", "Unit", "Have", "Buy", "Notes"]) assert.match(page, new RegExp(`role="columnheader">${heading.replace(" / ", " \/ ")}`));
assert.doesNotMatch(page, /Form \/ Package/);
assert.match(page, /className="masterInventoryForm"/);
assert.match(page, /className="masterInventoryPackage"/);
assert.match(page, /className="masterInventoryNotesSpacer"/);
assert.match(page, /<span className="masterInventoryPackage" role="cell">\{item\.unit\}<\/span>/);
assert.match(styles, /\.masterInventoryLedger \{[^}]*grid-template-columns:[^}]*minmax\(185px, 1\.5fr\)[^}]*minmax\(125px, 1fr\)[^}]*minmax\(120px, 1fr\)[^}]*minmax\(150px, 1\.2fr\)[^}]*minmax\(110px, \.85fr\)[^}]*48px[^}]*48px[^}]*minmax\(140px, 1\.1fr\)[^}]*72px/s);
assert.match(styles, /text-transform: uppercase/);
assert.match(styles, /\.masterInventoryLedgerFamily h3 \{[^}]*font-family: Inter, Arial, sans-serif !important;[^}]*font-size: 15px !important/s);
assert.match(styles, /\.masterInventoryStorage, \.masterInventoryStorageSelect \{[^}]*font-size: 10px/s);
assert.match(styles, /\.masterInventoryForm, \.masterInventoryVariety \{[^}]*font-size: 10px/s);
assert.match(styles, /\.masterInventoryPackage \{[^}]*font-size: 10px[^}]*white-space: normal/s);
assert.match(styles, /\.masterInventoryLedgerNotes \{[^}]*grid-column: 8/s);

console.log("Master Kitchen Inventory seven-column uppercase layout v82.10 tests passed.");
