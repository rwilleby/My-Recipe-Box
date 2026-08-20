import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

test("the reminder ribbon waits until the tenth distinct browser session", () => {
  assert.match(app, /const REMINDER_RIBBON_MINIMUM_VISITS = 10;/);
  assert.match(app, /rrb_site_visit_counted_this_session/);
  assert.match(app, /siteVisitCount >= REMINDER_RIBBON_MINIMUM_VISITS/);
});

test("the welcome video requests autoplay and keeps its ended cleanup", () => {
  assert.match(app, /title="Robert’s Recipe Box welcome video"[\s\S]*?autoPlay/);
  assert.match(app, /onEnded=\{handleEnded\}/);
  assert.match(app, /closeWindow\(\{ acknowledge: false \}\)/);
});

test("homepage discovery layout uses compact onboarding and two rows of seven icons", () => {
  assert.match(css, /\.homeMealJourneyToggle\s*\{[\s\S]*?min-height: 44px !important;/);
  assert.match(css, /grid-template-columns: repeat\(7, minmax\(82px, 1fr\)\) !important;/);
  assert.match(css, /width: 58px !important;/);
  assert.match(css, /font-size: 11\.25px !important;/);
});

test("complete-dinner and diet-meal card titles are enlarged by twenty-five percent", () => {
  assert.match(css, /\.homeComboMealText strong,[\s\S]*?\.homeDietMealText strong[\s\S]*?18\.75px/);
});
