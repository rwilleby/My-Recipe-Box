import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");

for (const token of [
  "createBrowserKos",
  "createKosUiController",
  'tonight: "dinner"',
  'week: "plan-week"',
  'cook: "cook"',
  'freezer: "freezer-meals"',
  'ingredients: "available"',
  "data-kos-intent={activeKosIntent}",
  "kosUi={kosUi}",
]) {
  assert.ok(app.includes(token), `Missing homepage KOS wiring token: ${token}`);
}

console.log("KOS-760 Homepage Intent Wiring contracts passed");
