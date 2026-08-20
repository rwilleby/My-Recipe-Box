import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

const finalStart = styles.lastIndexOf(
  "v85.3 final authority — keep Shopping List aligned to the approved inventory standard.",
);
const priorStrip = styles.lastIndexOf("v84.22 — FINAL ONE-ROW SHOPPING STRIP WITH COMPACT COUNTERS");
assert.ok(finalStart > priorStrip);

const finalStyles = styles.slice(finalStart);
assert.match(finalStyles, /\.shoppingListIntroActions \{[\s\S]*grid-template-columns: minmax\(300px, 2\.2fr\) repeat\(6, minmax\(0, 1fr\)\) !important/);
assert.match(finalStyles, /grid-auto-flow: column !important/);
assert.match(finalStyles, /overflow: visible !important/);
assert.match(finalStyles, /\.shoppingListIntroActions > button[\s\S]*font-size: clamp\(13px, 1\.05vw, 17px\) !important/);
assert.match(finalStyles, /\.shoppingListIntroActions > button,[\s\S]*\.shoppingViewToggle \{[\s\S]*height: 60px !important/);

assert.match(app, /function KosPlanningStatusBand\(\{ kosUi, mode, compact = false \}\)/);
assert.match(app, /shoppingCommandCounters/);
assert.match(app, /function ShoppingListPage\(\{[^}]*kosUi \}\)/);

const actionsStart = app.indexOf('<div className="shoppingListIntroActions">');
const actionsEnd = app.indexOf("{showDigitalStockCheck && (", actionsStart);
const actions = app.slice(actionsStart, actionsEnd);
const orderedItems = [
  "<span>Consolidated</span><span>List</span>",
  "<span>By Meal /</span><span>Component</span>",
  "Preview",
  "<span>Print</span><span>List</span>",
  "<span>Stock</span><span>Check</span>",
  "<span>Digital</span><span>Check</span>",
  "<span>Grocery</span><span>Picks</span>",
  "<span>Clear &amp;</span><span>Start Over</span>",
];
let previousIndex = -1;
for (const item of orderedItems) {
  const index = actions.indexOf(item);
  assert.ok(index > previousIndex, `${item} must remain in the requested left-to-right order`);
  previousIndex = index;
}

assert.ok(!actions.includes('mode="shopping" compact'), "Shopping List counters must remain hidden");

console.log("v85.3 full-width Shopping List controls and hidden-counter contracts passed.");
