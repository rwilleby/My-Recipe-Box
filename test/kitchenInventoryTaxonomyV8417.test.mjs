import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";
import { MEAT_POULTRY_FAMILY_ORDER, buildMasterKitchenInventoryCatalog } from "../src/data/masterKitchenInventoryCatalog.js";

const styles = fs.readFileSync("src/components/MasterKitchenInventoryPage.css", "utf8");
const catalog = buildMasterKitchenInventoryCatalog(recipes, []);
const meat = catalog.find((category) => category.id === "meat-poultry");
const families = [...new Set(meat.items.map((item) => item.family))];

assert.deepEqual(families, [...MEAT_POULTRY_FAMILY_ORDER], "Meat & Poultry uses the fixed master-family order");

const productKeys = catalog.flatMap((category) => category.items.map((item) =>
  `${category.id}|${item.family}|${item.variation}|${item.unit}`.toLowerCase()
));
assert.equal(new Set(productKeys).size, productKeys.length, "catalog has no duplicate master product forms");
assert.ok(meat.items.every((item) => MEAT_POULTRY_FAMILY_ORDER.includes(item.family)), "all meat products have a master family");

const chicken = meat.items.filter((item) => item.family === "Chicken");
assert.deepEqual(chicken.map((item) => item.variation), [
  "Raw Breast", "Raw Thigh", "Raw Bone-In Thigh", "Raw Drumstick", "Raw Wing", "Raw Leg Quarter",
  "Raw Whole Chicken", "Cooked Whole Breasts", "Cooked Diced Breast", "Cooked Sliced Breast", "Cooked Shredded Breast",
]);
assert.ok(chicken.every((item) => /^(Raw|Cooked) /.test(item.variation)), "form is canonical and parseable");
assert.ok(chicken.filter((item) => item.variation.startsWith("Cooked")).every((item) => item.unit === "cups"));
assert.equal(chicken.find((item) => item.variation === "Raw Breast").id, "catalog-meat-poultry-chicken-raw-boneless-skinless-breasts", "saved v84.16 breast quantities keep their record ID");
assert.equal(chicken.find((item) => item.variation === "Cooked Diced Breast").id, "catalog-meat-poultry-chicken-cooked-chicken-breast-diced", "saved v84.16 cooked quantities keep their record ID");
assert.ok(chicken.find((item) => item.variation === "Cooked Diced Breast").legacyIds.includes("recipe-chicken-cooked-chicken-breast-diced-cups"), "v84.16 recipe-derived row IDs remain migration aliases");

assert.match(styles, /\.masterInventoryLedger \{[^}]*minmax\(128px, 1fr\)/s, "desktop Unit column is widened");
assert.match(styles, /\.masterInventoryPackage \{[^}]*overflow-wrap: anywhere[^}]*white-space: normal/s, "long unit labels wrap instead of being cut off");
assert.match(styles, /@media \(max-width: 1020px\)[\s\S]*grid-template-columns: 132px 84px minmax\(150px, 1fr\) 110px/s, "tablet Unit column remains usable");

console.log("v84.17 Kitchen Inventory taxonomy and Unit-column contracts passed.");
