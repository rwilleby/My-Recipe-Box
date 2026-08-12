import assert from "node:assert/strict";
import fs from "node:fs";

const app=fs.readFileSync("src/App.jsx","utf8");
const css=fs.readFileSync("src/App.css","utf8");

for(const token of[
  'siteMode = "detailed"',
  '(siteMode === "easy" ? homeComboMeals.slice(0, 4) : homeComboMeals).map',
  'data-site-mode={siteMode}',
  'siteMode={siteMode}'
]) assert.ok(app.includes(token),token);

assert.ok(!app.includes('<KosCompanionStatusBand kosUi={kosUi} />'));

const marker="/* v73.10 — Complete Dinner count by mode + remove status band */";
const i=css.lastIndexOf(marker);
assert.ok(i>=0);
const f=css.slice(i);
assert.ok(f.includes('[data-site-mode="detailed"]'));
assert.ok(f.includes('[data-site-mode="easy"]'));
assert.ok(f.includes("grid-column: 2 !important;"));

console.log("v73.10 Easy/Detailed refinements passed");
