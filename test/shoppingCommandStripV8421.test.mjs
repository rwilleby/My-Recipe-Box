import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

const finalStart = styles.lastIndexOf("v84.21 — FINAL SHOPPING LIST COMMAND STRIP");
const originalShoppingControls = styles.lastIndexOf(
  "v83.11 — resettable shopping list and meal/component needs view",
);
assert.ok(finalStart > originalShoppingControls);

const commandStrip = styles.slice(finalStart);
assert.match(commandStrip, /\.shoppingListIntroActions \{[\s\S]*display: grid !important/);
assert.match(commandStrip, /minmax\(300px, 1\.8fr\)/);
assert.match(commandStrip, /--rrb-control-row-height, 44px/);
assert.match(commandStrip, /--rrb-control-radius, 18px/);
assert.match(commandStrip, /\.shoppingViewToggle button\[aria-selected="true"\][\s\S]*background: #9d9792 !important/);
assert.match(commandStrip, /\.shoppingListIntroActions > \.shoppingPrintButton[\s\S]*--rrb-control-primary-bg/);
assert.match(commandStrip, /\.shoppingListIntroActions > \.shoppingClearButton[\s\S]*--rrb-control-danger/);
assert.match(commandStrip, /@media \(max-width: 1240px\)[\s\S]*repeat\(3, minmax\(0, 1fr\)\)/);
assert.match(commandStrip, /@media \(max-width: 720px\)[\s\S]*repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(commandStrip, /@media \(max-width: 480px\)[\s\S]*grid-template-columns: 1fr !important/);

const actionsStart = app.indexOf('<div className="shoppingListIntroActions">');
const actionsEnd = app.indexOf("{showDigitalStockCheck && (", actionsStart);
const actions = app.slice(actionsStart, actionsEnd);
for (const contract of [
  /Consolidated List/,
  /By Meal \/ Component/,
  /shoppingPreviewButton/,
  /shoppingPrintButton/,
  /shoppingWorksheetButton/,
  /shoppingDigitalCheckButton/,
  /shoppingGroceryPicksButton/,
  /shoppingClearButton/,
  /onClick=\{previewShoppingList\}/,
  /onClick=\{printShoppingList\}/,
  /onClick=\{printMasterShoppingStockWorksheet\}/,
  /onClick=\{clearShoppingListAndStartOver\}/,
]) {
  assert.match(actions, contract);
}

console.log("v84.21 Shopping List command-strip contracts passed.");
