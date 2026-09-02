import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /className="currentInventoryRow"/);
assert.match(page, /className="currentInventoryQuantity"/);
assert.match(page, /Decrease .* quantity/);
assert.match(page, /Increase .* quantity/);
assert.doesNotMatch(page, /className="currentInventoryRow"[\s\S]{0,2500}<input type="number"/);
assert.match(styles, /\.currentInventoryQuantity button \{[^}]*width: 32px/s);
assert.match(styles, /\.currentInventoryIdentity strong \{[^}]*font: 800 12px[^}]*white-space: nowrap/s);
assert.match(styles, /@media \(max-width: 700px\)/);

console.log("Master Kitchen Inventory density refinements v82.7 tests passed.");
