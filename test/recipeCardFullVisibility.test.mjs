import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync("src/App.css", "utf8");

const marker = "/* v71.3 — show the entire recipe-card front inside the viewer */";
const markerIndex = css.lastIndexOf(marker);
assert.ok(markerIndex >= 0, "v71.3 full-card visibility override is missing");

const finalCss = css.slice(markerIndex);
for (const token of [
  ".cardViewerStage",
  "flex: 1 1 0 !important;",
  ".recipeFlipFront img",
  "max-height: calc(100% - 8px) !important;",
  "object-fit: contain !important;",
  "object-position: center center !important;",
  ".cardViewerUnifiedFooter",
  "flex: 0 0 auto !important;",
]) {
  assert.ok(finalCss.includes(token), `Missing full-card visibility token: ${token}`);
}

console.log("Recipe-card full visibility contracts passed");
