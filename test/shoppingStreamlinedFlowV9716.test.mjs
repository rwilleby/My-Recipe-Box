import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, css] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

assert.match(app, /<h2>Items to Buy<\/h2>/);
assert.doesNotMatch(app, /<h2>Needed Items<\/h2>/);
for (const label of ["Plan Meals", "Review Items to Buy", "Start Online Shopping", "Continue Online Shopping", "Put Purchases Away"]) {
  assert.match(app, new RegExp(label));
}
assert.match(app, /shoppingPrimaryState/);
assert.match(app, /handleShoppingPrimaryAction/);
assert.match(app, /id="items-to-buy"/);
assert.match(app, /isEmptyShoppingSummary/);
assert.match(css, /\.preparedShoppingSections \.isEmptyShoppingSummary \.shoppingFlatGroupHeader/);
assert.match(css, /min-height:\s*48px/);

console.log("v97.16 streamlined Shopping List flow contracts passed.");
