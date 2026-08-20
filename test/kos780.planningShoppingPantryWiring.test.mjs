import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");

for (const token of [
  "function KosPlanningStatusBand",
  'data-kos-ui="meal-planner-status"',
  'data-kos-ui="shopping-status"',
  'data-kos-ui="pantry-status"',
  "const pageProps = {",
  "kosUi,",
  "plannedCount",
  "remainingItems",
  "expiringSoon",
]) {
  assert.ok(app.includes(token), `Missing planning/shopping/pantry KOS wiring: ${token}`);
}

for (const mode of ["planner", "shopping", "pantry"]) {
  assert.ok(
    !app.includes(`<KosPlanningStatusBand kosUi={kosUi} mode="${mode}" />`),
    `The ${mode} status counters should remain hidden`,
  );
}

console.log("KOS-780 Planner/Shopping/Pantry UI wiring contracts passed");
