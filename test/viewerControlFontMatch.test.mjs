import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync("src/App.css", "utf8");
const marker =
  "/* v71.8 — match viewer control typography to BUILD IT component size */";
const index = css.lastIndexOf(marker);

assert.ok(index >= 0, "v71.8 font-match CSS missing");

const finalCss = css.slice(index);

for (const token of [
  "--rrb-viewer-control-font-size: 17px;",
  ".cardViewerQuickNutritionItem span",
  ".cardViewerQuickNutritionItem strong",
  "font-size: var(--rrb-viewer-control-font-size) !important;",
  ".cardViewerUnifiedFooter button",
  ".viewerActionButton",
  "flex-wrap: nowrap !important;",
]) {
  assert.ok(finalCss.includes(token), `Missing font-match token: ${token}`);
}

console.log("Viewer nutrition pills and footer buttons match component font size");
