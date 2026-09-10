import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const component = readFileSync(new URL("../src/components/PhotoInventoryTransfer.jsx", import.meta.url), "utf8");
const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/components/PhotoInventoryTransfer.css", import.meta.url), "utf8");
const appCss = readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

assert.match(component, /accept="image\/\*" capture="environment" multiple/);
assert.match(component, /roberts-recipe-box-inventory-transfer/);
assert.match(component, /navigator\.share/);
assert.match(component, /Add Reviewed Items to Inventory/);
assert.match(component, /payload\.type !== TRANSFER_TYPE/);
assert.match(component, /setPantry/);
assert.match(component, /setFreezer/);
assert.doesNotMatch(component, /JSON\.stringify\([^)]*photos/);
assert.match(app, /PhotoInventoryTransfer/);
assert.match(app, /Photo<\/span><span>List/);
assert.match(css, /@media\(max-width:820px\)/);
assert.match(css, /@media\(max-width:480px\)/);
assert.match(appCss, /repeat\(5, minmax\(0, 1fr\)\)/);

console.log("Photo Inventory Transfer tests passed.");
