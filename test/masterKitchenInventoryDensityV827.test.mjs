import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /masterInventoryCounterHeader/);
assert.equal((page.match(/<strong>HAVE<\/strong>/g) || []).length, 1);
assert.equal((page.match(/<strong>BUY<\/strong>/g) || []).length, 1);
assert.match(page, /\["left", "right"\]/);
assert.match(page, /className="masterInventoryFamilyNotes"><span>Notes:<\/span><input type="text"/);
assert.doesNotMatch(page, /<textarea/);
assert.match(styles, /font-size: 12px !important/);
assert.match(styles, /grid-template-columns: 48px minmax\(0, 1fr\)/);
assert.match(styles, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(styles, /height: 24px/);
assert.match(styles, /min-height: 26px/);
assert.match(styles, /white-space: nowrap/);
assert.match(styles, /height: 26px/);
assert.match(styles, /border-left: 1px solid #e6e0d7/);

console.log("Master Kitchen Inventory density refinements v82.7 tests passed.");
