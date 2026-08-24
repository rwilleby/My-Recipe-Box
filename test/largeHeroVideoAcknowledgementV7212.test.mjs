import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");

for (const token of [
  'const HERO_VIDEO_AUTOPLAY_DISABLED_KEY = "rrb-hero-video-autoplay-disabled";',
  "function isHeroVideoAutoplayDisabled()",
  "if (!isHeroVideoAutoplayDisabled())",
  'window.localStorage.setItem(HERO_VIDEO_AUTOPLAY_DISABLED_KEY, "true")',
  "function disableHeroVideoAutoplay()",
  "function turnOffAutoPlay()",
  "Turn Off Auto Play",
  "onClick={closeWindow}",
  "window.setTimeout(() => {",
  "}, 800);",
]) {
  assert.ok(app.includes(token), `Missing hero-video auto-play preference token: ${token}`);
}

assert.ok(
  !app.includes("acknowledgeVideo"),
  "Closing or finishing a video must not disable future auto-play"
);

assert.ok(
  !app.includes("LARGE_HERO_VIDEO_ACKNOWLEDGED_PREFIX"),
  "The old per-page acknowledgement model must be removed"
);

console.log("Hero-video persistent auto-play preference contracts passed");
