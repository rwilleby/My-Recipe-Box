import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const actions = app.slice(app.indexOf('<div className="shoppingListIntroActions">'), app.indexOf("{showShoppingCompanion &&", app.indexOf('<div className="shoppingListIntroActions">')));
const orderedItems = ["Consolidated Shopping List", "Shopping List By Meal Component", "Print Your List", "Clear Meals &amp; Start Over"];
let previousIndex = -1;
for (const item of orderedItems) { const index = actions.indexOf(item); assert.ok(index > previousIndex, `${item} must remain in the approved left-to-right order`); previousIndex = index; }
assert.equal((actions.match(/<button/g) || []).length, 4);
assert.ok(!actions.includes('mode="shopping" compact'), "Shopping List counters must remain hidden");
console.log("Current full-width Shopping List controls and hidden-counter contracts passed.");
