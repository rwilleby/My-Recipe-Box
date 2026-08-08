import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");

for (const token of [
  "function KosPlanningStatusBand",
  'data-kos-ui="meal-planner-status"',
  'data-kos-ui="shopping-status"',
  'data-kos-ui="pantry-status"',
  '<KosPlanningStatusBand kosUi={kosUi} mode="planner" />',
  '<KosPlanningStatusBand kosUi={kosUi} mode="shopping" />',
  '<KosPlanningStatusBand kosUi={kosUi} mode="pantry" />',
  "plannedCount",
  "remainingItems",
  "expiringSoon",
]) {
  assert.ok(app.includes(token), `Missing planning/shopping/pantry KOS wiring: ${token}`);
}

console.log("KOS-780 Planner/Shopping/Pantry UI wiring contracts passed");
