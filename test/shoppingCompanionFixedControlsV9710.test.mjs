import assert from "node:assert/strict";
import fs from "node:fs";

const panel = fs.readFileSync(new URL("../src/features/shopping/ShoppingCompanionPanel.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

assert.match(panel, /className="shoppingCompanionQueueList"/);
assert.match(css, /\.shoppingCompanionBody \{[^}]*display: flex;[^}]*overflow: hidden;/);
assert.match(css, /\.shoppingCurrentItem \{[^}]*flex: 0 0 auto;/);
assert.match(css, /\.shoppingCompanionQueue \{[^}]*min-height: 0;[^}]*flex: 1;/);
assert.match(css, /\.shoppingCompanionQueueList \{[^}]*overflow-y: auto;/);
assert.match(css, /\.shoppingCompanionWindowBody \.shoppingCompanion \{[^}]*height: 100vh;/);
console.log("v97.10 Online Shopping fixed controls and scrolling-list contracts passed.");
