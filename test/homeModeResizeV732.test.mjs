import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync("src/App.css","utf8");
const app = fs.readFileSync("src/App.jsx","utf8");

assert.equal((app.match(/homeHeroModeControls/g) || []).length, 1);
const marker = "/* v73.2 — HOME splash Easy/Detailed resize to match PREV/NEXT */";
const i = css.lastIndexOf(marker);
assert.ok(i >= 0);
const finalCss = css.slice(i);

for (const token of [
  ".hero .homeHeroModeButton",
  "height: 37px !important;",
  ".pageSequencePrev",
  ".pageSequenceNext",
  "object-fit: contain !important;",
]) {
  assert.ok(finalCss.includes(token), token);
}

console.log("v73.2 Home mode resize contracts passed");
