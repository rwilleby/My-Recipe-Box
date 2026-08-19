import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { recipes } from "../src/data/recipes.js";
import { buildMasterKitchenInventoryCatalog } from "../src/data/masterKitchenInventoryCatalog.js";

const catalog = buildMasterKitchenInventoryCatalog(recipes, []);
const vegetables = catalog.find((category) => category.id === "vegetables");
const family = (name) => vegetables.items.filter((item) => item.family === name).map((item) => item.variation);

for (const variation of ["Fresh ears", "Frozen ears", "Frozen whole kernel", "Canned whole kernel", "Canned creamed"]) {
  assert.ok(family("Corn").includes(variation));
}
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
assert.match(page, /masterInventoryLedger/);
assert.match(page, /masterInventoryLedgerFamily/);
assert.match(page, /masterInventoryLedgerQuantity/);
assert.match(page, /family-note-/);
assert.match(page, /masterInventoryLedgerNotes/);
assert.match(styles, /masterInventoryFamilyColumnLabel/);
assert.match(styles, /masterInventoryLedgerRow/);
assert.match(styles, /@media \(max-width: 700px\)/);

console.log("Master Kitchen Inventory compact matrix v82.6 tests passed.");
