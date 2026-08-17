import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { recipes } from "../src/data/recipes.js";
import { buildMasterKitchenInventoryCatalog } from "../src/data/masterKitchenInventoryCatalog.js";

const catalog = buildMasterKitchenInventoryCatalog(recipes, []);
const vegetables = catalog.find((category) => category.id === "vegetables");
const family = (name) => vegetables.items.filter((item) => item.family === name).map((item) => item.variation);

assert.deepEqual(new Set(family("Corn")), new Set([
  "Fresh ears",
  "Frozen ears",
  "Frozen whole kernel",
  "Canned whole kernel",
  "Canned creamed",
]));
assert.ok(family("Beans").includes("Canned black"));
assert.ok(family("Beans").includes("Canned pinto"));
assert.ok(family("Beans").includes("Canned baked"));
assert.ok(family("Carrots").includes("Fresh baby"));
assert.ok(family("Peas").includes("Frozen black-eyed"));
assert.ok(family("Potatoes").includes("Frozen hash browns"));
assert.ok(family("Potatoes").includes("Frozen waffle fries"));
assert.ok(family("Potatoes").includes("Instant mashed"));

const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");

assert.match(page, /groupItemsByFamily/);
assert.match(page, /STORAGE_FORM_ORDER/);
assert.match(page, /HAVE <i>\|<\/i> BUY/);
assert.match(page, /masterInventoryFamilyBlock/);
assert.match(page, /masterInventoryFourColumns/);
assert.match(page, /masterInventoryQuantityPair/);
assert.match(page, /family-note-/);
assert.match(page, /masterInventoryFamilyNotes/);
assert.match(styles, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
assert.match(styles, /grid-template-columns: 25px 4px 25px/);
assert.match(styles, /@media \(max-width: 700px\)/);

console.log("Master Kitchen Inventory compact matrix v82.6 tests passed.");
