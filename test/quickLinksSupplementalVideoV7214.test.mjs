import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");

for (const token of [
  'const QUICK_LINKS_VIDEO_URL = "videos/browse-our-quick-links.mp4";',
  'const QUICK_LINKS_VIDEO_POSTER = "images/video-posters/browse-our-quick-links-poster.webp";',
  "Cuisine Quick Links",
  "src={QUICK_LINKS_VIDEO_URL}",
  "poster={QUICK_LINKS_VIDEO_POSTER}",
  'title="Browse Our Quick Links overview video"',
  'className="homeQuickLinksVideoTrigger"',
  '<VideoIcon role="supplemental" alt="" className="supplementalVideoIconGray" />',
  '<VideoIcon role="main" alt="" className="supplementalVideoIconRed" />',
]) {
  assert.ok(app.includes(token), `Missing Quick Links token: ${token}`);
}

console.log("v72.14 Cuisine Quick Links supplemental video contracts passed");
