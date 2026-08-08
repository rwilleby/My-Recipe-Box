import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");

for (const token of [
  '"Nutrition Data"',
  '"Notes & Tips"',
  '"Dinners"',
  'Est $$',
  'openPanel === "notesTips"',
  'openPanel === "dinners"',
  'viewerUserNote',
  'saveViewerPersonalNote',
  'window.localStorage.setItem(',
  '<RecipeIntelligencePanel',
]) {
  assert.ok(app.includes(token), `Missing viewer control token: ${token}`);
}

assert.ok(!app.includes('className="recipeIntelligenceDisclosure"'), "RFIS profile must not be inline in the recipe viewer");
assert.ok(!app.includes('onClick={() => togglePanel("tips")}'), "Standalone Smart Tips popup must be removed");
assert.ok(!app.includes('onClick={() => togglePanel("notes")}'), "Standalone My Notes popup must be removed");
assert.ok(app.includes('placeholder="Enter your personal notes about this recipe..."'), "Notes & Tips must include editable notes");
assert.ok(app.includes('setViewerUserNote('), "Viewer notes must load and edit saved browser notes");

console.log("v70c.4 recipe viewer control contracts passed");
