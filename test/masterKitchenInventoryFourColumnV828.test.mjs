import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.doesNotMatch(page, /const INVENTORY_COLUMNS = \[/);
assert.doesNotMatch(page, /familyGroup\.columns\.map/);
assert.doesNotMatch(page, /masterInventoryFourColumns/);
assert.match(page, /masterInventoryLedger/);
assert.match(page, /splitStorageForm/);
assert.match(styles, /masterInventoryLedgerFamily/);
assert.match(styles, /masterInventoryLedgerQuantity input/);
assert.match(styles, /@media \(max-width: 1020px\)/);

console.log("Master Kitchen Inventory v82.8 data compatibility tests passed after the v82.9 ledger upgrade.");
