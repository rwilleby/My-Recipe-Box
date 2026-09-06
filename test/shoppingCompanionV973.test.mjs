import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, component, css] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/features/shopping/ShoppingCompanionPanel.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

assert.match(app, /setShowShoppingCompanion\(true\)/);
assert.match(app, /<ShoppingCompanionPanel items=\{needed\}/);
assert.match(component, /Shopping Companion/);
assert.match(component, /onToggle\(key, false\)/);
assert.match(component, /onSearch\(item\.name\)/);
assert.match(component, /isCollapsed/);
assert.match(component, /aria-label="Floating shopping companion"/);
assert.match(css, /\.shoppingCompanion \{[\s\S]*position: fixed/);
assert.match(css, /@media \(max-width: 720px\)[\s\S]*\.shoppingCompanion/);

console.log("v97.3 compact floating Shopping Companion contracts passed.");
