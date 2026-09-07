import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const [app, styles] = await Promise.all([readFile(new URL("../src/App.jsx", import.meta.url), "utf8"), readFile(new URL("../src/App.css", import.meta.url), "utf8")]);
const actions = app.slice(app.indexOf('<div className="shoppingListIntroActions">'), app.indexOf("{showShoppingCompanion &&", app.indexOf('<div className="shoppingListIntroActions">')));
assert.doesNotMatch(actions, /<span>/, "Approved Shopping List controls use one-line labels");
for (const retired of ["shoppingPreviewButton", "shoppingWorksheetButton", "shoppingDigitalCheckButton", "shoppingGroceryPicksButton"]) assert.doesNotMatch(actions, new RegExp(retired));
assert.match(styles.slice(styles.lastIndexOf("v97.11 — full-width four-action Shopping List control strip")), /white-space: nowrap !important/);
console.log("Current one-line Shopping List control-label contracts passed.");
