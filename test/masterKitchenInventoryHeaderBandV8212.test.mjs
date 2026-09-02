import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.doesNotMatch(page.slice(page.indexOf("MY CURRENT INVENTORY")), /className="masterInventoryCategoryButton"/);
assert.match(page, /className="currentInventoryFlatList"/);
assert.match(styles, /\.currentInventoryFlatList/);
assert.match(styles, /\.currentInventoryRow/);

console.log("Master Kitchen Inventory continuous-list header retirement tests passed.");
