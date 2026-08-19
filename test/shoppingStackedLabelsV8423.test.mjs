import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

const finalStart = styles.lastIndexOf(
  "v84.23 — FINAL TWO-LINE LABELS FOR A NARROWER ONE-ROW STRIP",
);
const priorStrip = styles.lastIndexOf(
  "v84.22 — FINAL ONE-ROW SHOPPING STRIP WITH COMPACT COUNTERS",
);
assert.ok(finalStart > priorStrip);

const finalStyles = styles.slice(finalStart);
assert.match(finalStyles, /minmax\(170px, 1\.35fr\)/);
assert.match(finalStyles, /minmax\(240px, 1\.7fr\) !important/);
assert.match(finalStyles, /gap: 4px !important/);
assert.match(finalStyles, /overflow-x: hidden !important/);
assert.match(finalStyles, /\.shoppingListIntroActions > button > span,[\s\S]*display: block !important[\s\S]*white-space: nowrap !important/);
assert.match(finalStyles, /\.shoppingListIntroActions > button,[\s\S]*\.shoppingViewToggle \{[\s\S]*height: 46px !important/);
assert.match(finalStyles, /\.shoppingCommandCounters\.preparedInventorySummary \{[\s\S]*min-width: 240px !important/);
assert.match(finalStyles, /grid-template-columns: repeat\(4, minmax\(54px, 1fr\)\) !important/);
assert.match(finalStyles, /@media \(max-width: 900px\)[\s\S]*min-width: 790px !important[\s\S]*overflow-x: auto !important/);

const actionsStart = app.indexOf('<div className="shoppingListIntroActions">');
const actionsEnd = app.indexOf("{showDigitalStockCheck && (", actionsStart);
const actions = app.slice(actionsStart, actionsEnd);
for (const label of [
  "<span>Consolidated</span><span>List</span>",
  "<span>By Meal /</span><span>Component</span>",
  "<span>Print</span><span>List</span>",
  "<span>Stock</span><span>Check</span>",
  "<span>Digital</span><span>Check</span>",
  "<span>Grocery</span><span>Picks</span>",
  "<span>Clear &amp;</span><span>Start Over</span>",
]) {
  assert.ok(actions.includes(label), `${label} must use the two-line label structure`);
}
assert.match(actions, /shoppingPreviewButton[\s\S]*Preview/);
assert.match(actions, /<KosPlanningStatusBand kosUi=\{kosUi\} mode="shopping" compact \/>/);

console.log("v84.23 stacked Shopping List command-label contracts passed.");
