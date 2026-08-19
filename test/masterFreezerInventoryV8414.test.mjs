import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const styles = fs.readFileSync("src/App.css", "utf8");
const freezerData = fs.readFileSync("src/data/freezerInventory.js", "utf8");
const bulkPlanner = fs.readFileSync("src/components/WeekendBulkMealPlanner.jsx", "utf8");

const navStart = app.indexOf("const NAV_GROUPS = [");
const inventoryStart = app.indexOf('label: "KITCHEN INVENTORY"', navStart);
const recipesStart = app.indexOf('label: "OUR RECIPES"', inventoryStart);
const inventoryMenu = app.slice(inventoryStart, recipesStart);

assert.match(inventoryMenu, /label: "MASTER KITCHEN INVENTORY", page: "Master Kitchen Inventory"/);
assert.match(inventoryMenu, /label: "MASTER FREEZER INVENTORY", page: "Freezer Inventory Management", detailedOnly: true/);
assert.match(inventoryMenu, /label: "PANTRY INVENTORY", page: "Pantry Staples"/);
for (const hiddenLabel of ["REFRIGERATOR INVENTORY", "PREPARED FREEZER INVENTORY", "FREEZER INVENTORY MANAGEMENT", "FREEZER INVENTORY"]) {
  assert.ok(!inventoryMenu.includes(`label: "${hiddenLabel}"`), `${hiddenLabel} must be hidden from the menu`);
}

assert.match(app, /title="Master Freezer Inventory"/);
assert.match(app, /title="Master Freezer Inventory"[\s\S]*Complete Meals, Individual Recipes, and Component Items/);
assert.match(app, /className=\{activeKind === "completeMeal" \? "isActive" : ""\}[\s\S]*Complete Meals/);
assert.match(app, /className=\{activeKind === "mainCourse" \? "isActive" : ""\}[\s\S]*Individual Recipes/);
assert.match(app, /className=\{activeKind === "componentItem" \? "isActive" : ""\}[\s\S]*Component Items/);
assert.match(app, /activeKind === "componentItem" \? \([\s\S]*<FreezerInventoryPage[\s\S]*freezer=\{freezer\}[\s\S]*setFreezer=\{setFreezer\}[\s\S]*embedded/);
assert.match(app, /<small>Component Items<\/small><strong>\{totalComponents\}<\/strong>/);
assert.match(app, /function FreezerInventoryPage\(\{ freezer, setFreezer, setActivePage, embedded = false \}\)/);
assert.match(app, /freezerInventoryEmbedded/);

assert.match(styles, /\.freezerManagementKindTabs[\s\S]*grid-template-columns: repeat\(3, 1fr\) !important/);
assert.match(styles, /\.freezerInventoryEmbedded[\s\S]*max-width: none !important[\s\S]*padding: 0 !important/);

for (const category of ["Meat & Poultry", "Frozen Vegetables", "Bread & Bakery", "Prepared Meals", "Soups, Sauces & Cooking Bases", "Convenience Foods"]) {
  assert.ok(freezerData.includes(category), `Component Items needs ${category}`);
}
for (const item of ["Chicken breasts", "Cooked shredded chicken", "Mixed vegetables", "Spaghetti sauce", "Silicone freezer trays"]) {
  assert.ok(freezerData.includes(item), `Component Items needs ${item}`);
}
assert.match(app, /Add Custom Item/);
assert.match(app, /Print Stock-Check Worksheet/);
assert.match(app, /Export Inventory/);
assert.match(app, /Import Inventory/);
assert.match(app, /Clear Inventory/);
assert.ok(!bulkPlanner.includes("from Freezer Inventory Management"));
assert.match(bulkPlanner, /from Master Freezer Inventory/);

console.log("v84.14 Master Freezer Inventory contracts passed.");
