import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync("src/App.css", "utf8");
const app = fs.readFileSync("src/App.jsx", "utf8");

const marker =
  "/* v71.4 — keep Nutrition Data, Notes & Tips, and Dinners/RFIS inside viewer */";
const index = css.lastIndexOf(marker);
assert.ok(index >= 0);

const finalCss = css.slice(index);

for (const token of [
  ".recipeFlipBack > .foodIntelligenceCard",
  "overflow-y: auto !important;",
  ".viewerBottomSheet",
  "max-height: calc(100% - 142px) !important;",
  ".viewerBottomSheetContent",
  ".viewerDinnersSheet",
  ".viewerNotesTipsGrid",
  ".cardViewerUnifiedFooter",
]) {
  assert.ok(finalCss.includes(token), `Missing viewer-fit token: ${token}`);
}

for (const token of [
  'openPanel === "notesTips"',
  'openPanel === "dinners"',
  "showFoodIntelligence",
]) {
  assert.ok(app.includes(token), `Missing viewer feature: ${token}`);
}

console.log("Viewer popup fit contracts passed");
