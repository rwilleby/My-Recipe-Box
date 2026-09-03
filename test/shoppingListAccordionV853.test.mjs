import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

const shoppingStart = app.indexOf("function ShoppingListPage(");
const shoppingEnd = app.indexOf("function FavoritesPage(", shoppingStart);
const shopping = app.slice(shoppingStart, shoppingEnd);

assert.ok(shoppingStart >= 0 && shoppingEnd > shoppingStart, "Shopping List page not found");
assert.ok(!shopping.includes('<KosPlanningStatusBand kosUi={kosUi} mode="shopping" compact />'), "Shopping counters must be hidden");

assert.ok(!shopping.includes("<details"), "Shopping List must not hide items in accordions");
assert.ok(!shopping.includes("shoppingAccordion"), "Shopping List must use the flat-list pattern");
assert.match(shopping, /shoppingOrderQuantities\[key\] \?\? ""/, "Quantity to order must not copy quantity needed");
assert.match(shopping, /sort\(\(a, b\) => String\(a\.name\)\.localeCompare\(String\(b\.name\)\)\)/, "Items must sort alphabetically within category");
assert.match(shopping, /initialCapsShoppingName\(item\.name\)/, "Shopping item names must display in Initial Caps");

for (const token of [
  'className="shoppingFlatGroup shoppingMealGroup"',
  'className="shoppingFlatGroup preparedOnHandSection"',
  'className="shoppingFlatGroup preparedMissingSection"',
  'className="shoppingFlatGroup preparedBatchSection"',
  'className="shoppingFlatList shoppingNeededItemsList"',
  'className="shoppingFlatList pantryListSection"',
  'className="shoppingListTable"',
  'className="shoppingListColumnHeader"',
  'shoppingListDataRow',
  'className="shoppingListOrderCell"',
  'useState("consolidated")',
]) {
  assert.ok(shopping.includes(token), `Missing Shopping List flat-list behavior: ${token}`);
}

for (const token of [
  "v96.6 — Shopping List: visible, inventory-style list without accordions.",
  "grid-template-columns: minmax(300px, 2.2fr) repeat(6, minmax(0, 1fr))",
  ".shoppingFlatListTitle",
  ".shoppingListColumnHeader",
  ".shoppingListDataRow",
  ".shoppingListOrderCell",
]) {
  assert.ok(css.includes(token), `Missing Shopping List flat-list style: ${token}`);
}

console.log("Shopping List full-width controls and visible flat-list layout passed");
