import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

for (const contract of [
  "function masterInventoryCoverage(",
  "function shoppingInventoryCoverage(",
  'status: "In Inventory"',
  'status: "Need to Buy"',
  "Need ${formatQty(required - available)} More",
  'coverage.status',
  'coverage.location',
  'coverage.quantityTracked',
  'effectiveChecked(key, automaticallyCovered)',
  'toggleCoverage(key, automaticallyCovered)',
  'aria-label={`Mark ${item.name} as covered`}',
  "Checked items are covered by your inventory or purchase.",
  "Already in Inventory",
]) {
  assert.ok(app.includes(contract), `Missing shopping inventory coverage contract: ${contract}`);
}

assert.match(app, /splitShoppingListByPantry\(list, pantry, masterInventory, recipes\)/);
assert.match(app, /shoppingInventoryCoverage\(item, pantry, masterInventory, recipes\)/);
assert.match(app, /Number\(record\.have \|\| 0\) <= 0/);
assert.match(app, /record\.stockStatus === "out"/);
assert.doesNotMatch(app, />In pantry</i);

console.log("v96.9 quantity-aware shopping and unified inventory coverage contracts passed.");
