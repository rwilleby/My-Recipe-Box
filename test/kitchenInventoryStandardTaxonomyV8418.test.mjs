import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";
import {
  MASTER_KITCHEN_INVENTORY_TAXONOMY,
  buildMasterKitchenInventoryCatalog,
} from "../src/data/masterKitchenInventoryCatalog.js";
import { classifyInventoryProduct, isApprovedInventoryProduct } from "../src/data/masterKitchenInventoryTaxonomy.js";

const page = fs.readFileSync("src/components/MasterKitchenInventoryPage.jsx", "utf8");
const styles = fs.readFileSync("src/components/MasterKitchenInventoryPage.css", "utf8");
const catalog = buildMasterKitchenInventoryCatalog(recipes, []);

assert.deepEqual(catalog.map((category) => category.title), [
  "Meat & Poultry", "Seafood", "Vegetables", "Fruits", "Dairy & Eggs", "Bread & Bakery",
  "Rice, Pasta & Grains", "Beverages", "Canned & Jarred Foods", "Sauces, Condiments & Baking", "Frozen Foods", "Prepared & Packaged Foods",
]);
assert.equal(MASTER_KITCHEN_INVENTORY_TAXONOMY.reduce((sum, category) => sum + category.products.length, 0), 253);
assert.deepEqual(MASTER_KITCHEN_INVENTORY_TAXONOMY.find((category) => category.id === "meat-poultry").products, [
  "Bacon", "Beef", "Ground Beef", "Chicken", "Ground Chicken", "Corned Beef", "Duck", "Ham", "Lamb", "Ground Lamb",
  "Pork", "Ground Pork", "Sausages", "Smoking Meats", "Turkey", "Ground Turkey", "Deli Meats", "Hot Dogs & Bratwurst",
  "Meatballs", "Specialty & Game Meats",
]);

for (const category of catalog) {
  for (const item of category.items) {
    assert.ok(isApprovedInventoryProduct(category.id, item.family), `${category.title} / ${item.family} must be approved`);
    assert.equal(typeof item.cut, "string");
    assert.equal(typeof item.form, "string");
    assert.equal(typeof item.brand, "string");
  }
}

const identityKeys = catalog.flatMap((category) => category.items.map((item) =>
  `${category.id}|${item.family}|${item.cut}|${item.form}`.toLowerCase()
));
assert.equal(new Set(identityKeys).size, identityKeys.length, "each standardized product identity appears once");

const meat = catalog.find((category) => category.id === "meat-poultry");
assert.deepEqual([...new Set(meat.items.map((item) => item.family))], MASTER_KITCHEN_INVENTORY_TAXONOMY[0].products);
const chicken = meat.items.filter((item) => item.family === "Chicken");
assert.ok(chicken.some((item) => item.cut === "Breast" && item.form === "Diced, Raw"));
assert.ok(chicken.some((item) => item.cut === "Breast" && item.form === "Diced, Cooked"));
assert.ok(chicken.some((item) => item.cut === "Breast" && item.form === "Sliced, Cooked"));
assert.ok(chicken.some((item) => item.cut === "Breast" && item.form === "Shredded, Cooked"));
assert.ok(chicken.some((item) => item.cut === "Breast" && item.form === "Whole, Cooked"));
assert.ok(chicken.flatMap((item) => item.legacyIds || []).some((id) => id.startsWith("recipe-chicken-")), "prior generated inventory IDs remain aliases");

assert.deepEqual(classifyInventoryProduct("corn tortillas", "Bread, Tortillas & Chips"), { categoryId: "bread-bakery", productType: "Tortillas", matchedText: "corn tortillas" });
assert.equal(classifyInventoryProduct("canned diced tomatoes", "Canned Goods").productType, "Canned Tomatoes");
assert.equal(classifyInventoryProduct("frozen diced potatoes", "Frozen Foods").productType, "Frozen Potatoes");
assert.equal(classifyInventoryProduct("deli turkey", "Meat & Seafood").productType, "Deli Meats");

assert.match(page, /productNameForItem/);
assert.match(page, /currentInventoryIdentity/);
assert.match(page, /InventoryItemEditor/);
assert.match(page, /MASTER_KITCHEN_INVENTORY_TAXONOMY\.find/);
assert.match(styles, /\.currentInventoryIdentity strong \{[^}]*white-space: nowrap/s, "full names remain readable on one line");
assert.match(styles, /\.currentInventoryRow \{[^}]*grid-template-columns/s);

console.log("v84.18 standardized Kitchen Inventory taxonomy contracts passed.");
