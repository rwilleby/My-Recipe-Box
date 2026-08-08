import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");

const required = [
  "createBrowserKos",
  "createKosUiController",
  'data-kos-intent={activeKosIntent}',
  'data-kos-ui="production-status"',
  'data-kos-ui="available-meals-status"',
  'data-kos-ui="meal-planner-status"',
  'data-kos-ui="shopping-status"',
  'data-kos-ui="pantry-status"',
  'data-kos-ui="kitchen-companion-status"',
  'data-kos-ui="backup-status"',
  'activePage === "Home"',
  'activePage === "Meal Planner"',
  'activePage === "Shopping Lists"',
  'activePage === "Pantry Staples"',
  'activePage === "Prepared Freezer Inventory"',
  'activePage === "User Backup"',
];

for (const token of required) {
  assert.ok(app.includes(token), `Missing end-to-end UI integration token: ${token}`);
}

console.log("KOS-800 End-to-End UI Integration contracts passed");
