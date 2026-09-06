import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, windowComponent, css] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/features/shopping/ShoppingCompanionWindow.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

assert.match(app, /Floating Window/);
assert.match(windowComponent, /window\.open\("", COMPANION_WINDOW_NAME/);
assert.match(windowComponent, /popup=yes,width=410/);
assert.match(windowComponent, /resizable=yes,scrollbars=yes/);
assert.match(windowComponent, /createPortal\(<ShoppingCompanionPanel/);
assert.match(windowComponent, /link\[rel="stylesheet"\], style/);
assert.match(windowComponent, /beforeunload/);
assert.match(windowComponent, /Please allow pop-up windows/);
assert.match(css, /\.shoppingCompanionWindowBody \.shoppingCompanion \{ position: relative/);

console.log("v97.4 movable Shopping Companion window contracts passed.");
