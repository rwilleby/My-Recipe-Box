import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");

for (const token of [
  'const CHOOSE_YOUR_LEVEL_VIDEO_URL = "videos/choose-your-level.mp4";',
  'const CHOOSE_YOUR_LEVEL_VIDEO_POSTER = "images/video-posters/choose-your-level-poster.webp";',
  "What do you want to do today?",
  "src={CHOOSE_YOUR_LEVEL_VIDEO_URL}",
  "poster={CHOOSE_YOUR_LEVEL_VIDEO_POSTER}",
  'title="Choose Your Level overview video"',
  'className="homeChooseYourLevelVideoTrigger"',
]) {
  assert.ok(app.includes(token), `Missing Choose Your Level token: ${token}`);
}

console.log("v72.13 Choose Your Level supplemental video contracts passed");
