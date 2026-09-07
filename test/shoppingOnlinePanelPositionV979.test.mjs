import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const shoppingPage = app.slice(app.indexOf("function ShoppingListPage"), app.indexOf("function CollectionsPage"));
const intro = shoppingPage.indexOf('className="shoppingListSectionIntro"');
const onlinePanel = shoppingPage.indexOf('className="shoppingStoreChooser"');
const controls = shoppingPage.indexOf('className="shoppingListIntroActions"');

assert.ok(intro >= 0 && onlinePanel > intro, "Shop Online panel should follow the Shopping List introduction");
assert.ok(controls > onlinePanel, "Shop Online panel should appear before the Shopping List controls");
assert.equal(shoppingPage.indexOf('className="shoppingStoreChooser"', onlinePanel + 1), -1, "Shop Online panel should render only once");
console.log("v97.9 Shop Online panel placement contract passed.");
