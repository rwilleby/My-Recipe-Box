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
const posterPaths = [...pageSource.matchAll(/poster: "([^"]+\.webp)"/g)].map((match) => match[1]);
assert.equal(videoPaths.length, 16, "Video Library should list all 16 site videos");
assert.equal(new Set(videoPaths).size, 16, "Each video should be listed once");
assert.equal(posterPaths.length, 16, "Every library video should have a dedicated poster");
assert.equal(new Set(posterPaths).size, 16, "Every library poster should be unique");

const expectedOrder = [
  "videos/welcome-video.mp4",
  "videos/welcome-to-our-site.mp4",
  "videos/easy-or-detailed.mp4",
  "videos/choose-your-level.mp4",
  "videos/browse-our-quick-links.mp4",
  "videos/browse-our-recipe-library.mp4",
  "videos/dinner-ideas.mp4",
  "videos/diet-meals.mp4",
  "videos/salad-jars.mp4",
  "videos/crock-pot-meals.mp4",
  "videos/about-our-recipes.mp4",
  "videos/nutrition-standards.mp4",
  "videos/understanding-mealbalance.mp4",
  "videos/your-data-and-security.mp4",
  "videos/backup-and-restore.mp4",
  "videos/affiliate-marketing.mp4",
];
assert.deepEqual(videoPaths, expectedOrder, "Videos should follow the approved story timeline");

for (const videoPath of videoPaths) {
  assert.ok(fs.existsSync(path.join(root, "public", videoPath)), `Missing ${videoPath}`);
}

for (const posterPath of posterPaths) {
  const fullPosterPath = path.join(root, "public", posterPath);
  assert.ok(fs.existsSync(fullPosterPath), `Missing ${posterPath}`);
  assert.ok(fs.statSync(fullPosterPath).size > 10_000, `${posterPath} should contain a usable poster frame`);
  assert.match(posterPath, /^images\/video-posters\/library\//);
}

assert.match(pageSource, /controls/);
assert.match(pageSource, /preload="metadata"/);
assert.doesNotMatch(pageSource, /autoPlay/);
assert.match(pageSource, /if \(player && index !== activeIndex && !player\.paused\) player\.pause\(\)/);
assert.match(cssSource, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
assert.match(cssSource, /object-fit: cover/);
assert.match(cssSource, /@media \(max-width: 760px\)/);

console.log("v83.5 Video Library timeline and poster contracts passed.");
