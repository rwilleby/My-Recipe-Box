import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

for (const token of [
  "const [isVideoPlaying, setIsVideoPlaying] = useState(false);",
  "const videoRef = useRef(null);",
  "onEnded={handleVideoEnded}",
  "}, 900);",
  "homeWelcomeTourVideoPlayButton",
  "onClick={toggleVideoPlayback}",
]) {
  assert.ok(app.includes(token), `Missing Welcome video behavior: ${token}`);
}

assert.ok(
  !app.includes("<video\n                src={`${import.meta.env.BASE_URL}${WELCOME_TOUR_VIDEO_URL}`}\n                title=\"Robert’s Recipe Box welcome video\"\n                controls"),
  "Native browser controls should be removed"
);

const marker = "/* v72.2 — Welcome video UI refinement */";
const index = css.lastIndexOf(marker);
assert.ok(index >= 0);
const finalCss = css.slice(index);

for (const token of [
  "top: 12px !important;",
  "right: 12px !important;",
  "object-fit: contain !important;",
  "object-position: center top !important;",
  "grid-template-columns: repeat(3, minmax(0, 1fr)) !important;",
  "min-height: 23px !important;",
  "background: #8A817C !important;",
  "background: #C62828 !important;",
  "background: #A91F1F !important;",
]) {
  assert.ok(finalCss.includes(token), `Missing Welcome video UI token: ${token}`);
}

console.log("Welcome video UI refinement contracts passed");
