import assert from "node:assert/strict";
import fs from "node:fs";
import {
  FULLY_STOCKED_PANTRY_ITEMS,
  FULLY_STOCKED_PANTRY_SECTIONS,
} from "../src/data/fullyStockedPantry.js";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

assert.equal(FULLY_STOCKED_PANTRY_SECTIONS.length, 12, "Level 3 must have 12 master sections");
assert.equal(FULLY_STOCKED_PANTRY_ITEMS.length, 565, "Level 3 item count changed unexpectedly");
assert.equal(new Set(FULLY_STOCKED_PANTRY_ITEMS.map((item) => item.id)).size, FULLY_STOCKED_PANTRY_ITEMS.length, "Every Level 3 item needs a stable unique ID");
assert.ok(FULLY_STOCKED_PANTRY_ITEMS.every((item) => item.level === 3 && item.type && item.recordContext), "Every Level 3 record needs level, type, and context metadata");
assert.deepEqual(
  FULLY_STOCKED_PANTRY_SECTIONS.map((section) => section.group),
  [
    "1. BAKING & COOKING BASICS",
    "2. HERBS, SPICES & SEASONINGS",
    "3. OILS, VINEGARS & COOKING LIQUIDS",
    "4. SAUCES & CONDIMENTS",
    "5. CANNED & JARRED FOODS",
    "6. RICE, PASTA, GRAINS & BEANS",
    "7. BOXED & PACKAGED FOODS",
    "8. BREAKFAST & SNACKS",
    "9. REFRIGERATOR STAPLES",
    "10. FREEZER STAPLES",
    "11. BREAD & BAKERY",
    "12. FOOD-STORAGE SUPPLIES",
  ],
);

assert.match(app, /if \(Number\(level\) === 3\) return FULLY_STOCKED_PANTRY_SECTIONS;/, "Only Level 3 should use the expanded catalog");
assert.match(app, /PANTRY_LEVEL_1_2_GROUPS/, "Levels 1 and 2 must retain their existing catalog");
assert.match(app, /className="pantryTypeGroupButton"[\s\S]*togglePantryType\(typeKey\)/, "Types must be independently collapsible");
assert.match(app, /function expandAllPantry\(\)[\s\S]*setExpandedPantryGroups[\s\S]*setExpandedPantryTypes/, "Expand must open both hierarchy levels");
assert.match(app, /function collapseAllPantry\(\)[\s\S]*setExpandedPantryGroups\(new Set\(\)\)[\s\S]*setExpandedPantryTypes\(new Set\(\)\)/, "Collapse must close both hierarchy levels");

const controls = ["Manual Inventory", "Expand", "Collapse", "Add Item", "Purchase", "Clear"];
let previous = -1;
for (const label of controls) {
  const index = app.indexOf(`>${label}</button>`, previous + 1);
  assert.ok(index > previous, `${label} is missing or out of order`);
  previous = index;
}

assert.match(app, /clearPantry\(\)[\s\S]*pantryInventoryMeta\(current\)[\s\S]*statuses: \{\}/, "Clear must preserve Pantry metadata and manual items");
assert.match(app, /FULLY_STOCKED_PANTRY_MATCHERS/, "Shopping-list Pantry matching must include expanded Level 3 products");
assert.match(css, /pantryActions\.inventoryControlStrip[\s\S]*grid-template-columns: repeat\(6, minmax\(0, 1fr\)\)/, "The six Pantry controls must stay on one row");
assert.match(css, /\.pantryTypeGroupButton[\s\S]*background: #e5ded2/, "Nested type headings must use the beige design system");

console.log("v84.37 expanded Fully Stocked Pantry contracts passed.");
