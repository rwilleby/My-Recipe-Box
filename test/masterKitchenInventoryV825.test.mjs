import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { recipes } from "../src/data/recipes.js";
import { buildMasterKitchenInventoryCatalog } from "../src/data/masterKitchenInventoryCatalog.js";

const catalog = buildMasterKitchenInventoryCatalog(recipes, []);
const items = catalog.flatMap((category) => category.items);
const corn = items.filter((item) => item.family === "Corn");

for (const variation of ["Canned creamed", "Canned whole kernel", "Fresh ears", "Frozen ears", "Frozen whole kernel"]) {
  assert.ok(corn.some((item) => item.variation === variation));
}
assert.equal(new Set(corn.map((item) => item.id)).size, corn.length);
assert.ok(catalog.length >= 10);
assert.ok(items.length >= 100);
assert.ok(items.every((item) => item.id && item.categoryId && item.family && item.variation && item.unit));

assert.ok(items.some((item) => item.recipeDerived), "recipe ingredients should still feed the grouped inventory catalog");
assert.ok(items.some((item) => item.family === "Ground Beef" && item.variation === "Raw 90/10"));
assert.ok(items.some((item) => item.family === "Chicken" && item.variation === "Cooked Diced Breast" && item.unit === "cups"));

const customCatalog = buildMasterKitchenInventoryCatalog(recipes, [{
  id: "custom-test",
  categoryId: "vegetables",
  family: "Corn",
  variation: "Frozen steam bag",
  unit: "bags",
}]);
assert.ok(customCatalog.flatMap((category) => category.items).some((item) => item.id === "custom-test" && item.custom));

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const page = await readFile(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/MasterKitchenInventoryPage.css", import.meta.url), "utf8");
const backup = await readFile(new URL("../src/utils/recipeBoxBackup.js", import.meta.url), "utf8");

assert.match(app, /label: "KITCHEN INVENTORY", page: "Master Kitchen Inventory"/);
assert.match(app, /activePage === "Master Kitchen Inventory"/);
assert.match(app, /rrb_masterKitchenInventory_v1/);
assert.match(page, /Print Initial Count/);
assert.match(page, /Record Purchases/);
assert.match(page, /Clear Buy Qty/);
assert.match(page, /inputMode="decimal"/);
assert.match(page, /included in the full Recipe Box Backup &amp; Restore file/);
assert.match(page, /deduct an item automatically only when a recipe identifies the exact product form/);
assert.match(styles, /@media \(max-width: 700px\)/);
assert.match(backup, /label: "Kitchen Inventory"/);

console.log("Master Kitchen Inventory v82.5 tests passed.");
