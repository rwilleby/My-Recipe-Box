import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const kitchen = fs.readFileSync(new URL("../src/components/MasterKitchenInventoryPage.jsx", import.meta.url), "utf8");
const styles = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");
const finalStyles = styles.slice(styles.lastIndexOf("v84.34 — BEIGE PANTRY/KITCHEN CONTROLS"));

for (const label of ["Manual Inventory", "Expand", "Collapse", "Add Item", "Purchase", "Clear"]) {
  assert.ok(kitchen.includes(`>${label}</button>`), `Missing Kitchen command: ${label}`);
}
assert.match(app, /pantryLevelSummary pantryLevelSummary-\$\{selectedPantryLevel\}/);
assert.match(finalStyles, /\.pantryLevelSummary-3 \{[\s\S]*align-items: center !important;[\s\S]*text-align: center !important;/);
assert.match(finalStyles, /\.masterInventorySummary,[\s\S]*\.masterInventoryCategoryButton em \{[\s\S]*display: none !important;/);
assert.match(finalStyles, /\.masterInventoryToolbar \{[\s\S]*grid-template-columns: repeat\(6, minmax\(0, 1fr\)\) !important;/);
assert.match(finalStyles, /--rrb-inventory-beige-light: #f5f1ea;/);

console.log("v84.34 beige Pantry and Kitchen control contracts passed.");
