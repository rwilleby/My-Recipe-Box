import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /const INVENTORY_COLUMNS = \[/);
assert.match(page, /title: "Fresh"/);
assert.match(page, /title: "Frozen"/);
assert.match(page, /title: "Canned"/);
assert.match(page, /title: "Instant\/Jar"/);
assert.match(page, /familyGroup\.columns\.map/);
assert.match(page, /<header><strong>\{column\.title\}<\/strong><span>HAVE <i>\|<\/i> BUY<\/span><\/header>/);
assert.match(page, /columnItemName/);
assert.match(styles, /grid-template-columns: 105px minmax\(0, 1fr\)/);
assert.match(styles, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
assert.match(styles, /font-size: 8px; font-weight: 600; text-align: center/);
assert.match(styles, /min-height: 21px/);
assert.match(styles, /height: 19px/);
assert.match(styles, /width: calc\(25% - 9px\)/);
assert.match(styles, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);

console.log("Master Kitchen Inventory four-column layout v82.8 tests passed.");
