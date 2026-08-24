import assert from "node:assert/strict";
import fs from "node:fs";

const app=fs.readFileSync("src/App.jsx","utf8");
const css=fs.readFileSync("src/App.css","utf8");

for (const token of [
  'const LARGE_HERO_VIDEO_OPEN_EVENT = "rrb:open-large-hero-video";',
  'const HERO_VIDEO_AUTOPLAY_DISABLED_KEY = "rrb-hero-video-autoplay-disabled";',
  "function LargeHeroVideoPanel",
  "isHeroVideoAutoplayDisabled()",
  "disableHeroVideoAutoplay()",
  "function openHeroVideo()",
  "new CustomEvent(LARGE_HERO_VIDEO_OPEN_EVENT",
  "Play Now",
  "Close Window",
  "Turn Off Auto Play",
  "closeTimerRef.current = window.setTimeout(() => {",
]) {
  assert.ok(app.includes(token), `Missing v72.9 app token: ${token}`);
}

assert.match(app, /<LargeHeroVideoPanel\s+pageTitle=\{title\}/);

assert.ok(
  !app.includes("Maybe Later"),
  "Maybe Later must be removed from video footers"
);
assert.ok(
  !app.includes("Hide This"),
  "Hide This must be removed from video footers"
);

const f=css;

for (const token of [
  "top: 12px !important;",
  "right: 12px !important;",
  "grid-template-columns: repeat(3, minmax(0, 1fr)) !important;",
  ".largeHeroVideoStage.isUnassigned",
  ".videoStandardActionBar",
  ".pageHelpStrip .homeWelcomeTourIconButton",
  "width: 37px !important;",
]) {
  assert.ok(f.includes(token), `Missing v72.9 CSS token: ${token}`);
}

console.log("Large Hero video standard v72.9 contracts passed");
