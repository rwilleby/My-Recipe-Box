import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /className="masterInventoryCategoryButton"/);
assert.match(page, /lowCount/);
assert.match(page, /expiringCount/);
assert.match(page, /className="currentInventorySubcategory"/);
assert.match(styles, /\.masterInventoryCategoryButton/);
assert.match(styles, /\.currentInventorySubcategory > h3 \{[^}]*font: 800 12px/s);

console.log("Master Kitchen Inventory category summary header tests passed.");
