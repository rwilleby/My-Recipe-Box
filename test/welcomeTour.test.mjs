import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

for (const token of [
  'const WELCOME_TOUR_VIDEO_URL = "videos/welcome-video.mp4"',
  'const WELCOME_TOUR_VIDEO_POSTER = "images/video-posters/welcome-video-poster.webp"',
  "LARGE_HERO_VIDEO_ACKNOWLEDGED_PREFIX",
  "Play Now",
  "Close Window",
  'const VIDEO_ICON_MAIN = "images/icons/video-red.webp"',
  "homeWelcomeTourIconButton",
  "rrb:open-welcome-tour",
  "playsInline",
  "onEnded={handleEnded}",
  "WelcomeTour",
]) {
  assert.ok(app.includes(token), `Missing welcome-tour contract token: ${token}`);
}

assert.ok(app.includes("window.localStorage.setItem(acknowledgedKey"), "Welcome-video acknowledgement must persist locally");
assert.ok(!app.includes("app.heygen.com/embeds/"), "The welcome video must use the optimized local asset");
assert.ok(css.includes("aspect-ratio: 16 / 9"), "The video must preserve a 16:9 aspect ratio");
assert.ok(css.includes("scale(1.18)"), "The embedded video must use the approved centered crop");
assert.ok(css.includes("@media (max-width: 760px)"), "The tour must include a tablet/mobile layout");
assert.ok(css.includes("#4e279b"), "The welcome-video controls must use the video icon purple");
assert.ok(css.includes(".homeWelcomeTourIconButton:focus-visible"), "The video icon control must have a visible keyboard focus state");
assert.ok(!app.includes("Watch Welcome Video"), "The old text reopen button must be removed");

console.log("v70g welcome tour icon contracts passed");
