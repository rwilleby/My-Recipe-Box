import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { recipes } from "../src/data/recipes.js";
import { buildMasterKitchenInventoryCatalog } from "../src/data/masterKitchenInventoryCatalog.js";

const catalog = buildMasterKitchenInventoryCatalog(recipes, []);
const family = (categoryId, name) => catalog.find((category) => category.id === categoryId).items.filter((item) => item.family === name).map((item) => item.variation);

assert.ok(family("vegetables", "Corn").includes("Fresh ears"));
assert.ok(family("canned-jarred", "Canned Vegetables").includes("Canned whole kernel"));
assert.ok(family("canned-jarred", "Canned Vegetables").includes("Canned creamed"));
assert.ok(family("canned-jarred", "Beans").includes("Canned black"));
assert.ok(family("canned-jarred", "Beans").includes("Canned pinto"));
assert.ok(family("canned-jarred", "Beans").includes("Canned baked"));
assert.ok(family("vegetables", "Carrots").includes("Fresh baby"));
assert.ok(family("frozen-foods", "Frozen Vegetables").includes("Frozen black-eyed"));
assert.ok(family("frozen-foods", "Frozen Potatoes").includes("Frozen hash browns"));
assert.ok(family("frozen-foods", "Frozen Potatoes").includes("Frozen waffle fries"));
assert.ok(family("prepared-packaged", "Instant Potatoes").includes("Instant mashed"));

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /groupItemsByFamily/);
assert.match(page, /STORAGE_FORM_ORDER/);
assert.match(page, /currentInventoryList/);
assert.match(page, /currentInventoryRow/);
assert.match(page, /currentInventoryQuantity/);
assert.match(page, /InventoryItemEditor/);
assert.match(styles, /masterInventoryCategory/);
assert.match(styles, /currentInventoryRow/);
assert.match(styles, /@media \(max-width: 700px\)/);

console.log("Master Kitchen Inventory compact matrix v82.6 tests passed.");
