import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

for (const token of [
  'const DINNER_IDEAS_VIDEO_URL = "videos/dinner-ideas.mp4";',
  "function SupplementalHoverVideo",
  "onMouseEnter={openVideo}",
  "onFocus={openVideo}",
  "onEnded={handleEnded}",
  "setTimeout(() => closeVideo(), 800)",
  'title="Quick Dinner Ideas overview video"',
  'className="homeDinnerIdeasVideoTrigger"',
]) {
  assert.ok(app.includes(token), token);
}

for (const token of [
  "/* v72.7 — Dinner Ideas supplemental hover video */",
  ".supplementalHoverVideoPopover",
  "object-fit: contain !important;",
]) {
  assert.ok(css.includes(token), token);
}

console.log("Dinner Ideas supplemental hover video contracts passed");
