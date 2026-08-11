import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

for (const token of [
  'const WELCOME_TOUR_VIDEO_POSTER = "images/video-posters/welcome-video-poster.webp";',
  'const DINNER_IDEAS_VIDEO_POSTER = "images/video-posters/dinner-ideas-poster.webp";',
  'poster={`${import.meta.env.BASE_URL}${WELCOME_TOUR_VIDEO_POSTER}`}',
  'poster={poster ? `${import.meta.env.BASE_URL}${poster}` : undefined}',
  'poster={DINNER_IDEAS_VIDEO_POSTER}',
]) {
  assert.ok(app.includes(token), `Missing poster token: ${token}`);
}

const marker = "/* v72.10 — real holding posters + clean supplemental crop */";
const i = css.lastIndexOf(marker);
assert.ok(i >= 0);
const f = css.slice(i);

for (const token of [
  "object-fit: cover !important;",
  "transform: scale(1.08) !important;",
  ".supplementalHoverVideoPopover .videoStandardActionBar",
  "grid-template-columns: repeat(2, minmax(0, 1fr)) !important;",
]) {
  assert.ok(f.includes(token), `Missing v72.10 CSS token: ${token}`);
}

console.log("v72.10 video poster/crop contracts passed");
