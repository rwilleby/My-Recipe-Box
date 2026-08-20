import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

test("Weekly Meal Planner hides status counters and starts beneath the hero", () => {
  const plannerRoute = app.slice(
    app.indexOf('{activePage === "Meal Planner"'),
    app.indexOf('{activePage === "Shopping Lists"')
  );

  assert.doesNotMatch(plannerRoute, /KosPlanningStatusBand/);
  assert.doesNotMatch(plannerRoute, /data-kos-ui="meal-planner"/);

  const marker = "/* v85.4 minor edit — remove the planner status gap and align it beneath the hero. */";
  const markerIndex = css.lastIndexOf(marker);
  assert.ok(markerIndex >= 0, "planner spacing override should exist");
  assert.match(css.slice(markerIndex), /\.weeklyCalendarPlannerPage\s*\{[^}]*margin-top:\s*0\s*!important;[^}]*padding-top:\s*0\s*!important;/s);
});
