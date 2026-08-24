import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const videoUrl = new URL("../public/videos/diet-meals.mp4", import.meta.url);
const videoStats = await stat(videoUrl);
const videoHeader = await readFile(videoUrl);

assert.ok(videoStats.size > 1_000_000, "Diet Meals video must contain the supplied optimized MP4");
assert.equal(videoStats.size, 5_235_878, "Diet Meals video bytes must match the supplied optimized file");
assert.equal(videoHeader.subarray(4, 8).toString("ascii"), "ftyp", "Diet Meals asset must be an MP4");

assert.match(app, /const HEALTHY_DINNERS_VIDEO_URL = "videos\/diet-meals\.mp4";/);
assert.match(
  app,
  /const HEALTHY_DINNERS_VIDEO_POSTER = "images\/heroes\/hero-page-healthy-dinners\.webp";/,
);
assert.match(app, /videoSrc=\{HEALTHY_DINNERS_VIDEO_URL\}/);
assert.match(app, /videoPoster=\{HEALTHY_DINNERS_VIDEO_POSTER\}/);

const noVideoStart = app.indexOf("const NO_INTRO_VIDEO_PAGES = new Set([");
const noVideoEnd = app.indexOf("]);", noVideoStart);
assert.ok(noVideoStart >= 0 && noVideoEnd > noVideoStart);
assert.ok(
  !app.slice(noVideoStart, noVideoEnd).includes('"Healthy Dinners"'),
  "Healthy Dinners must enable the standard menu indicator and large-hero video controls",
);

for (const token of [
  "function LargeHeroVideoPanel(",
  "Play Now",
  "Close Window",
  "Turn Off Auto Play",
  "HERO_VIDEO_AUTOPLAY_DISABLED_KEY",
  "onEnded={handleEnded}",
  "<PageHelpButtonStrip pageTitle={title}",
]) {
  assert.ok(app.includes(token), `Missing standard large-hero video component: ${token}`);
}

console.log("Healthy Dinners large-hero Diet Meals video v82.21 tests passed.");
