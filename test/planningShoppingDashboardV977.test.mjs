import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const component = fs.readFileSync(new URL("../src/features/planning/PlanningShoppingDashboard.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/features/planning/PlanningShoppingDashboard.css", import.meta.url), "utf8");

for (const label of ["Plan Meals", "Bulk Plans", "Review List", "Shop Online", "Put Away"]) assert.match(component, new RegExp(label));
assert.match(component, /You Are Here/);
assert.match(component, /aria-current=/);
assert.match(component, /rrb-planning-dashboard-focus/);
assert.match(app, /activeStep="plan" compact/);
assert.match(app, /activeStep="bulk" compact/);
assert.match(app, /activeStep=\{showShoppingCompanion \? "shop" : "review"\}/);
assert.match(app, /activeStep="away" compact/);
assert.match(app, /id="online-shopping"/);
assert.match(css, /grid-template-columns:repeat\(5/);
assert.match(css, /@media\(max-width:700px\)/);
console.log("v97.7 planning and shopping dashboard contracts passed.");
