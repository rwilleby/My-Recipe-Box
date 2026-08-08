import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");

for (const token of [
  "function KosKitchenStatusBand",
  'data-kos-ui="production-status"',
  'data-kos-ui="available-meals-status"',
  '<KosKitchenStatusBand kosUi={kosUi} mode="production" />',
  '<KosKitchenStatusBand kosUi={kosUi} mode="available" />',
  "readyMealUnits",
  "componentUnits",
]) {
  assert.ok(app.includes(token), `Missing visible KOS integration: ${token}`);
}

console.log("KOS-770 Production/Available UI wiring contracts passed");
