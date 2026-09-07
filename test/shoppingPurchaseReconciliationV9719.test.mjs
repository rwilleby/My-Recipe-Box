import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, panel, styles] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/features/shopping/PurchaseReconciliationPanel.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

assert.match(app, /shoppingEfficiencySummary/);
assert.match(app, /Total Items/);
assert.match(app, /In Inventory/);
assert.match(app, /To Buy/);
assert.match(app, /purchasedUnreconciledItems/);
assert.match(app, /applyPurchasedItemsToInventory/);
assert.match(panel, /Confirm what you bought before updating your Kitchen Inventory/);
assert.match(panel, /Add to existing/);
assert.match(panel, /Replace existing/);
assert.match(panel, /Update My Inventory/);
assert.match(styles, /purchaseReconciliationBackdrop/);

console.log("v97.19 shopping progress and purchase reconciliation contracts passed.");
