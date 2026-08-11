import assert from "node:assert/strict";
import fs from "node:fs";

const app=fs.readFileSync("src/App.jsx","utf8");
const css=fs.readFileSync("src/App.css","utf8");

for (const token of [
  'const LARGE_HERO_VIDEO_OPEN_EVENT = "rrb:open-large-hero-video";',
  'const LARGE_HERO_VIDEO_SEEN_PREFIX = "rrb-large-hero-video-seen:";',
  "function LargeHeroVideoPanel",
  "window.localStorage.getItem(seenKey)",
  "window.localStorage.setItem(seenKey, \"true\")",
  '<LargeHeroVideoPanel pageTitle={title} />',
  "function openHeroVideo()",
  "new CustomEvent(LARGE_HERO_VIDEO_OPEN_EVENT",
  "Play Now",
  "Close Window",
  "window.setTimeout(closeWindow, 800)",
]) {
  assert.ok(app.includes(token), `Missing v72.9 app token: ${token}`);
}

assert.ok(
  !app.includes("Maybe Later"),
  "Maybe Later must be removed from video footers"
);
assert.ok(
  !app.includes("Hide This"),
  "Hide This must be removed from video footers"
);

const marker="/* v72.9 — Large Hero video window standard */";
const i=css.lastIndexOf(marker);
assert.ok(i>=0,"v72.9 CSS marker missing");
const f=css.slice(i);

for (const token of [
  "top: 12px !important;",
  "right: 12px !important;",
  "grid-template-columns: repeat(2, minmax(0, 1fr)) !important;",
  ".largeHeroVideoStage.isUnassigned",
  ".videoStandardActionBar",
  ".pageHelpStrip .homeWelcomeTourIconButton",
  "width: 37px !important;",
]) {
  assert.ok(f.includes(token), `Missing v72.9 CSS token: ${token}`);
}

console.log("Large Hero video standard v72.9 contracts passed");
