import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /masterInventoryInventoryColumn/);
assert.match(page, /HAVE <i>\|<\/i> BUY/);
assert.match(page, /className="masterInventoryFamilyNotes"><span>Notes:<\/span><input type="text"/);
assert.doesNotMatch(page, /<textarea/);
assert.match(styles, /font-size: 11px !important/);
assert.match(styles, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
assert.match(styles, /height: 19px/);
assert.match(styles, /min-height: 21px/);
assert.match(styles, /white-space: nowrap/);
assert.match(styles, /height: 20px/);

console.log("Master Kitchen Inventory density refinements v82.7 tests passed.");
