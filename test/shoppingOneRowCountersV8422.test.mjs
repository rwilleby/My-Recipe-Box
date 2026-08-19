import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

const finalStart = styles.lastIndexOf(
  "v84.22 — FINAL ONE-ROW SHOPPING STRIP WITH COMPACT COUNTERS",
);
const priorStrip = styles.lastIndexOf("v84.21 — FINAL SHOPPING LIST COMMAND STRIP");
assert.ok(finalStart > priorStrip);

const finalStyles = styles.slice(finalStart);
assert.match(finalStyles, /\.shoppingListIntroActions \{[\s\S]*grid-template-columns:[\s\S]*minmax\(320px, 1\.9fr\) !important/);
assert.match(finalStyles, /grid-auto-flow: column !important/);
assert.match(finalStyles, /overflow-x: auto !important/);
assert.match(finalStyles, /\.shoppingListIntroActions > button[\s\S]*font-size: 10\.5px !important[\s\S]*white-space: nowrap !important/);
assert.match(finalStyles, /\.shoppingCommandCounters\.preparedInventorySummary \{[\s\S]*grid-template-columns: repeat\(4, minmax\(70px, 1fr\)\) !important/);
assert.match(finalStyles, /\.shoppingCommandCounters\.preparedInventorySummary > div \{[\s\S]*height: 40px !important/);
assert.match(finalStyles, /@media \(max-width: 1180px\)[\s\S]*min-width: 1040px !important/);

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
  '<KosPlanningStatusBand kosUi={kosUi} mode="shopping" compact />',
];
let previousIndex = -1;
for (const item of orderedItems) {
  const index = actions.indexOf(item);
  assert.ok(index > previousIndex, `${item} must remain in the requested left-to-right order`);
  previousIndex = index;
}

assert.equal(
  app.match(/<KosPlanningStatusBand kosUi=\{kosUi\} mode="shopping"/g)?.length,
  1,
  "shopping counters should render only once, inside the command strip",
);

console.log("v84.22 one-row Shopping List controls and compact-counter contracts passed.");
