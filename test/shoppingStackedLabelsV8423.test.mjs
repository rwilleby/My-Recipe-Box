import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

const finalStart = styles.lastIndexOf(
  "v85.3 final authority — keep Shopping List aligned to the approved inventory standard.",
);
const priorStrip = styles.lastIndexOf(
  "v84.23 — FINAL TWO-LINE LABELS FOR A NARROWER ONE-ROW STRIP",
);
assert.ok(finalStart > priorStrip);

const finalStyles = styles.slice(finalStart);
assert.match(finalStyles, /minmax\(300px, 2\.2fr\) repeat\(6, minmax\(0, 1fr\)\) !important/);
assert.match(finalStyles, /gap: 10px !important/);
assert.match(finalStyles, /overflow: visible !important/);
assert.match(finalStyles, /\.shoppingListIntroActions > button,[\s\S]*\.shoppingViewToggle \{[\s\S]*height: 60px !important/);
assert.match(finalStyles, /\.shoppingListIntroActions > button \{[\s\S]*font-size: clamp\(13px, 1\.05vw, 17px\) !important/);

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
assert.doesNotMatch(actions, /<KosPlanningStatusBand kosUi=\{kosUi\} mode="shopping" compact \/>/);

console.log("v85.3 enlarged Shopping List command-label contracts passed.");
