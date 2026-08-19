import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";
import { buildMasterKitchenInventoryCatalog } from "../src/data/masterKitchenInventoryCatalog.js";

const app = fs.readFileSync("src/App.jsx", "utf8");
const page = fs.readFileSync("src/components/MasterKitchenInventoryPage.jsx", "utf8");
const styles = fs.readFileSync("src/components/MasterKitchenInventoryPage.css", "utf8");
const appStyles = fs.readFileSync("src/App.css", "utf8");
const videoItems = fs.readFileSync("src/features/video-library/videoLibraryItems.js", "utf8");
const backup = fs.readFileSync("src/utils/recipeBoxBackup.js", "utf8");

const navStart = app.indexOf("const NAV_GROUPS = [");
const detailsStart = app.indexOf('label: "KITCHEN DETAILS"', navStart);
const recipesStart = app.indexOf('label: "OUR RECIPES"', detailsStart);
const detailsMenu = app.slice(detailsStart, recipesStart);
assert.match(detailsMenu, /label: "KITCHEN INVENTORY", page: "Master Kitchen Inventory"/);
assert.match(detailsMenu, /label: "FREEZER INVENTORY", page: "Freezer Inventory Management", detailedOnly: true/);
assert.match(detailsMenu, /label: "PANTRY INVENTORY", page: "Pantry Staples"/);
assert.doesNotMatch(detailsMenu, /MASTER KITCHEN INVENTORY|MASTER FREEZER INVENTORY/);

const headerStart = app.indexOf("const headerGroups = [");
const headerEnd = app.indexOf("return (", headerStart);
const header = app.slice(headerStart, headerEnd);
assert.ok(header.indexOf('label: "RECIPES & MEALS"') < header.indexOf('label: "KITCHEN DETAILS"'));

assert.match(page, /useState\(\(\) => new Set\(\)\)/, "all category accordions start closed");
assert.match(page, /<h1>Kitchen Inventory<\/h1>/);
assert.match(page, /aria-label="Kitchen inventory summary"/);
assert.match(page, /<h3 role="columnheader">\{familyGroup\.family\}<\/h3>/);
assert.doesNotMatch(page, /item\.recipeDerived \? <small> · Recipe/);
assert.match(styles, /\.masterInventoryFamilyHeader \{[^}]*min-height: 58px[^}]*background: #e5ded2/s);
assert.match(styles, /\.masterInventoryLedgerFamily h3 \{[^}]*grid-column: 1 \/ -1[^}]*white-space: nowrap/s);
assert.match(styles, /\.masterInventoryLedger \{[^}]*minmax\(150px, 1\.25fr\)[^}]*minmax\(128px, 1fr\)/s);

const catalog = buildMasterKitchenInventoryCatalog(recipes, []);
const meat = catalog.find((category) => category.id === "meat-poultry");
const forms = (family) => meat.items.filter((item) => item.family === family);
assert.deepEqual(forms("Ground Beef").map((item) => item.variation), [
  "Raw 80/20", "Raw 90/10", "Raw 93/7", "Raw 97/3", "Raw Lean", "Cooked 90/10", "Cooked Lean",
]);
assert.deepEqual(forms("Chicken").map((item) => item.variation), [
  "Raw Breast", "Raw Thigh", "Raw Bone-In Thigh", "Raw Drumstick", "Raw Wing", "Raw Leg Quarter",
  "Raw Whole Chicken", "Cooked Whole Breasts", "Cooked Diced Breast", "Cooked Sliced Breast", "Cooked Shredded Breast",
]);
for (const cooked of forms("Chicken").filter((item) => item.variation.startsWith("Cooked"))) assert.equal(cooked.unit, "cups");
assert.ok(forms("Ground Beef").some((item) => item.legacyIds?.length), "grouped forms retain legacy recipe-derived record keys");
assert.match(page, /function inventoryIdsForItem/);
assert.match(page, /const recordForItem = \(item\)/);

assert.match(app, /title="Pantry Inventory"/);
assert.match(app, /className="freezerManagementSummary pantryInventorySummary"/);
assert.match(app, /className="pantryLevelTabs freezerManagementKindTabs"/);
assert.match(app, /className="pantryActions inventoryControlStrip"/);
assert.match(appStyles, /\.inventoryControlStrip \{[^}]*border-radius: var\(--rrb-filter-row-radius, 18px\)/s);
assert.match(videoItems, /"Kitchen Inventory", "Kitchen Inventory", "Open Kitchen Inventory"/);
assert.match(backup, /label: "Kitchen Inventory"/);

console.log("v84.16 Kitchen Details and grouped inventory contracts passed.");
