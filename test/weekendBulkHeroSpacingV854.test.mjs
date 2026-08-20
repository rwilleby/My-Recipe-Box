import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/components/WeekendBulkMealPlanner.v51.css", import.meta.url), "utf8");
const component = fs.readFileSync(new URL("../src/components/WeekendBulkMealPlanner.jsx", import.meta.url), "utf8");

test("Weekend Bulk Plan hides operations counters and begins beneath the hero", () => {
  const route = app.slice(
    app.indexOf('{activePage === "Weekend Bulk Meal Planner"'),
    app.indexOf('{activePage === "Contact Me"')
  );

  assert.doesNotMatch(route, /KosKitchenStatusBand/);
  assert.doesNotMatch(route, /KosCompanionStatusBand/);
  assert.doesNotMatch(route, /data-kos-ui="production-center"/);
  assert.match(route, /<WeekendBulkMealPlanner/);

  const marker = "/* v85.4 minor edit: align the Weekend Bulk Plan directly beneath its hero. */";
  const finalRules = css.slice(css.lastIndexOf(marker));
  assert.match(finalRules, /\.weekendBulkPage\s*\{[^}]*padding-top:\s*0\s*!important;/s);
  assert.match(finalRules, /\.weekendBulkIntro\s*\{[^}]*margin-top:\s*0\s*!important;/s);

  assert.match(component, /weekendBulkSectionIntro rrbSectionIntroComponent isCentered/);
  assert.match(component, /<h2>Plan, shop &amp; cook once\. Relax &amp; save for weeks\.<\/h2>/);
  assert.match(component, /className="weekendBulkSetupPanel"/);
  assert.doesNotMatch(component, /WEEKEND PRODUCTION PLAN/);
  assert.match(css, /v85\.0 baseline refinement: standard centered intro above plan settings/);
});
