import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /const STORAGE_OPTIONS = \["Refrigerator", "Freezer", "Pantry", "Counter", "Other"\]/);
assert.match(page, /function defaultStorageForItem/);
assert.match(page, /function defaultFormForItem/);
assert.match(page, /function inventoryDetails/);
assert.match(page, /role="columnheader">Form<\/span>/);
assert.match(page, /role="columnheader">Cut \/ Variety<\/span>/);
assert.match(page, /className="masterInventoryStorageSelect"/);
assert.match(page, /STORAGE_OPTIONS\.map/);
assert.match(page, /function addStorageLocation/);
assert.match(page, /sourceItemId: item\.id/);
assert.match(page, />\+ Storage<\/button>/);
assert.match(page, /function removeStorageLocation/);
assert.match(styles, /\.masterInventoryStorageSelect \{[^}]*text-transform: uppercase/s);
assert.match(styles, /\.masterInventoryLedger \{[^}]*minmax\(140px, 1\.2fr\)[^}]*minmax\(220px, 2fr\)[^}]*58px/s);
assert.match(styles, /\.masterInventoryLedgerNotes \{[^}]*grid-column: 8/s);

console.log("Master Kitchen Inventory storage-location and cut/variety layout v82.13 tests passed.");
