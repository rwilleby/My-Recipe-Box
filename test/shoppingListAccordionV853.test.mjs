import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

const shoppingStart = app.indexOf("function ShoppingListPage(");
const shoppingEnd = app.indexOf("function FavoritesPage(", shoppingStart);
const shopping = app.slice(shoppingStart, shoppingEnd);

assert.ok(shoppingStart >= 0 && shoppingEnd > shoppingStart, "Shopping List page not found");
assert.ok(!shopping.includes('<KosPlanningStatusBand kosUi={kosUi} mode="shopping" compact />'), "Shopping counters must be hidden");

for (const token of [
  'className="shoppingAccordion shoppingNeedGroupAccordion"',
  'className="shoppingAccordion preparedOnHandSection"',
  'className="shoppingAccordion preparedMissingSection"',
  'className="shoppingAccordion preparedBatchSection"',
  'className="shoppingAccordion shoppingNeededItemsAccordion"',
  'className="shoppingAccordion pantryListSection"',
  'className="shoppingAccordionArrow"',
  'className="shoppingAccordionBody"',
]) {
  assert.ok(shopping.includes(token), `Missing Shopping List accordion behavior: ${token}`);
}

for (const token of [
  "v85.3 — SHOPPING LIST: FULL COMMAND STRIP + INVENTORY ACCORDIONS",
  "grid-template-columns: minmax(300px, 2.2fr) repeat(6, minmax(0, 1fr))",
  ".shoppingListIntroActions .shoppingCommandCounters",
  ".shoppingAccordion > summary",
  ".shoppingAccordion[open] > summary .shoppingAccordionArrow",
  ".shoppingAccordionBody",
]) {
  assert.ok(css.includes(token), `Missing Shopping List v85.3 style: ${token}`);
}

console.log("v85.3 Shopping List full-width controls and accordion layout passed");
