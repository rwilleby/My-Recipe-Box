import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, panel, css] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/features/shopping/ShoppingCompanionPanel.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

assert.match(app, /Start Online Shopping/);
assert.match(app, /setShowShoppingCompanion\(true\); openOnlineShoppingWindow\(\)/);
assert.match(panel, /Current Item/);
assert.match(panel, /Added to Cart &amp; Next/);
assert.match(panel, /Skip for Now/);
assert.match(panel, /Previous/);
assert.match(panel, /Shopping Complete/);
assert.match(panel, /orderQuantities\[currentKey\]/);
assert.match(panel, /comments\[currentKey\]/);
assert.match(panel, /purchasedCount} of \{sortedItems.length} added/);
assert.match(css, /\.shoppingCompanionProgress/);
assert.match(css, /\.shoppingAddedNext/);
assert.match(css, /\.shoppingCompanionItem\.isCurrent/);

console.log("v97.5 guided Online Shopping Mode contracts passed.");
