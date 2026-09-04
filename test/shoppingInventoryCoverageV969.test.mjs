import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

for (const contract of [
  "function masterInventoryCoverage(",
  "function buildMasterInventoryCoverageIndex(",
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

assert.match(app, /splitShoppingListByPantry\(list, getShoppingCoverage\)/);
assert.match(app, /shoppingInventoryCoverage\(item, pantry, masterCoverageIndex\)/);
assert.match(app, /const masterCoverageIndex = useMemo\(/);
assert.match(app, /const inventoryCoverageCache = useMemo\(\(\) => new Map\(\)/);
assert.match(app, /const getShoppingCoverage = useCallback\(/);
assert.equal((app.match(/buildMasterKitchenInventoryCatalog\(recipes, safe\.customItems\)/g) || []).length, 2,
  "Shopping coverage must build the catalog once per inventory change, not once per shopping item");
assert.match(app, /Number\(record\.have \|\| 0\) <= 0/);
assert.match(app, /record\.stockStatus === "out"/);
assert.match(app, /const uniqueRestockItems = new Map\(\)/);
assert.match(app, /normalizePantryText\(canonicalShoppingName\(item\.name\)\)/);
assert.match(app, /if \(!uniqueRestockItems\.has\(identity\)\) uniqueRestockItems\.set\(identity, item\)/);
assert.doesNotMatch(app, />In pantry</i);

console.log("v96.9 quantity-aware shopping and unified inventory coverage contracts passed.");
