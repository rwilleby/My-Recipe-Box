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

test("the welcome video auto-opens, attempts sound, falls back safely, and closes when finished", () => {
  assert.match(app, /title="Robert’s Recipe Box welcome video"[\s\S]*?autoPlay/);
  assert.match(app, /if \(!isHeroVideoAutoplayDisabled\(\)\) \{[\s\S]*?setIsVisible\(true\)/);
  assert.match(app, /player\.muted = false;[\s\S]*?player\.play\(\)\.catch\(\(\) => \{[\s\S]*?player\.muted = true;/);
  assert.match(app, /onEnded=\{handleEnded\}/);
  assert.match(app, /closeTimerRef\.current = window\.setTimeout\(\(\) => \{[\s\S]*?closeWindow\(\)/);
});

test("the welcome accordion uses its previous setting and cuisine links use two rows of seven", () => {
  assert.match(css, /\.homeMealJourneyToggle \{min-height: 38px !important; padding: 4px 46px 4px 16px !important;/);
  assert.match(css, /\.homeMealJourneyToggleText strong,[\s\S]*?\.homeMealJourneyToggleText small \{font-size: 15px !important;/);
  assert.match(css, /grid-template-columns: repeat\(7, minmax\(82px, 1fr\)\) !important;/);
  assert.match(css, /width: 58px !important;/);
  assert.match(css, /font-size: 11\.25px !important;/);
});

test("complete-dinner and diet-meal card titles are enlarged by twenty-five percent", () => {
  assert.match(css, /\.homeComboMealText strong,[\s\S]*?\.homeDietMealText strong[\s\S]*?18\.75px/);
});
