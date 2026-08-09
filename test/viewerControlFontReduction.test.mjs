import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync("src/App.css", "utf8");
const marker =
  "/* v71.9 — reduce v71.8 viewer-control typography by one-third */";
const index = css.lastIndexOf(marker);

assert.ok(index >= 0, "v71.9 font reduction CSS missing");
const finalCss = css.slice(index);

for (const token of [
  "--rrb-viewer-control-font-size: 11.3px;",
  ".cardViewerQuickNutritionItem span",
  ".cardViewerUnifiedFooter button",
  ".viewerActionButton",
  "flex-wrap: nowrap !important;",
]) {
  assert.ok(finalCss.includes(token), `Missing v71.9 token: ${token}`);
}

console.log("Viewer-control font reduction contracts passed");
