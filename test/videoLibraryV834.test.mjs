import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appSource = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const pagePath = path.join(root, "src/features/video-library/VideoLibraryPage.jsx");
const pageSource = fs.readFileSync(pagePath, "utf8");
const cssSource = fs.readFileSync(
  path.join(root, "src/features/video-library/VideoLibraryPage.css"),
  "utf8"
);

const navWelcomeIndex = appSource.indexOf('{ label: "WELCOME TO OUR SITE", page: "About" }');
const navLibraryIndex = appSource.indexOf('{ label: "VIDEO LIBRARY", page: "Video Library" }');
const navSecurityIndex = appSource.indexOf('{ label: "YOUR DATA & SECURITY", page: "Your Data & Security" }');

assert.ok(navWelcomeIndex >= 0, "About menu should retain Welcome to Our Site");
assert.ok(navLibraryIndex > navWelcomeIndex, "Video Library should follow Welcome to Our Site");
assert.ok(navSecurityIndex > navLibraryIndex, "Video Library should precede Your Data & Security");
assert.match(appSource, /activePage === "Video Library"/);
assert.match(appSource, /<VideoLibraryPage setActivePage=\{setActivePage\} \/>/);

const videoPaths = [...pageSource.matchAll(/video: "([^"]+\.mp4)"/g)].map((match) => match[1]);
assert.equal(videoPaths.length, 16, "Video Library should list all 16 site videos");
assert.equal(new Set(videoPaths).size, 16, "Each video should be listed once");

const expectedOrder = [
  "videos/welcome-video.mp4",
  "videos/easy-or-detailed.mp4",
  "videos/dinner-ideas.mp4",
  "videos/diet-meals.mp4",
  "videos/choose-your-level.mp4",
  "videos/browse-our-quick-links.mp4",
  "videos/welcome-to-our-site.mp4",
  "videos/your-data-and-security.mp4",
  "videos/about-our-recipes.mp4",
  "videos/nutrition-standards.mp4",
  "videos/understanding-mealbalance.mp4",
  "videos/affiliate-marketing.mp4",
  "videos/backup-and-restore.mp4",
  "videos/browse-our-recipe-library.mp4",
  "videos/salad-jars.mp4",
  "videos/crock-pot-meals.mp4",
];
assert.deepEqual(videoPaths, expectedOrder, "Videos should follow their first site appearance");

for (const videoPath of videoPaths) {
  assert.ok(fs.existsSync(path.join(root, "public", videoPath)), `Missing ${videoPath}`);
}

assert.match(pageSource, /controls/);
assert.match(pageSource, /preload="metadata"/);
assert.doesNotMatch(pageSource, /autoPlay/);
assert.match(pageSource, /if \(player && index !== activeIndex && !player\.paused\) player\.pause\(\)/);
assert.match(cssSource, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(cssSource, /@media \(max-width: 760px\)/);

console.log("v83.4 Video Library contracts passed.");
