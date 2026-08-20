import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appSource = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const pageSource = fs.readFileSync(
  path.join(root, "src/features/video-library/VideoLibraryPage.jsx"),
  "utf8"
);
const cssSource = fs.readFileSync(
  path.join(root, "src/features/video-library/VideoLibraryPage.css"),
  "utf8"
);
const dataModule = await import(
  pathToFileURL(path.join(root, "src/features/video-library/videoLibraryItems.js"))
);
const { VIDEO_LIBRARY_ITEMS, VIDEO_LIBRARY_PLACEHOLDER_POSTER } = dataModule;

const navWelcomeIndex = appSource.indexOf('{ label: "WELCOME TO OUR SITE", page: "About" }');
const navLibraryIndex = appSource.indexOf('{ label: "VIDEO LIBRARY", page: "Video Library" }');
const navSecurityIndex = appSource.indexOf('{ label: "YOUR DATA & SECURITY", page: "Your Data & Security" }');
assert.ok(navWelcomeIndex >= 0 && navLibraryIndex > navWelcomeIndex && navSecurityIndex > navLibraryIndex);
assert.match(appSource, /activePage === "Video Library"/);
assert.match(appSource, /<VideoLibraryPage setActivePage=\{setActivePage\} \/>/);

const expectedTitles = [
  "Welcome to Robert’s Recipe Box",
  "Starting Fast or Slow",
  "Easy or Detailed",
  "Welcome to Our Site",
  "View Our Video Library",
  "Your Data & Security",
  "About Our Recipes",
  "Our Nutritional Standards",
  "Understanding MealBalance",
  "Affiliate Marketing",
  "Backup & Restore",
  "Quick Dinner Ideas",
  "Diet Meals",
  "Salad Jar Lunches",
  "Choose Your Level",
  "Browse Our Quick Links",
  "Master Kitchen Inventory",
  "Refrigerator Inventory",
  "Prepared Freezer Inventory",
  "Freezer Inventory",
  "Pantry Inventory",
  "Browse Our Recipes",
  "Your Favorite Recipes",
  "Dinner Combinations",
  "Healthy Dinners",
  "Salad Jar Lunches",
  "Slow Cooker Meals",
  "Your Weekly Meal Planner",
  "Weekend Bulk Meal Planner",
  "Freezing & Reheating",
  "Your Grocery List",
  "Recommended Products",
  "Food Safety",
  "Cooking Resource",
];

assert.equal(VIDEO_LIBRARY_ITEMS.length, 34, "Video Library should contain all 34 requested positions");
assert.deepEqual(VIDEO_LIBRARY_ITEMS.map((item) => item.title), expectedTitles);
assert.equal(new Set(VIDEO_LIBRARY_ITEMS.map((item) => item.id)).size, 34, "Every position needs a unique stable id");

const availableItems = VIDEO_LIBRARY_ITEMS.filter((item) => item.video);
const plannedItems = VIDEO_LIBRARY_ITEMS.filter((item) => !item.video);
assert.equal(availableItems.length, 21, "21 listed positions should use finished videos");
assert.equal(plannedItems.length, 13, "13 listed positions should show color-bar placeholders");

for (const item of availableItems) {
  assert.ok(fs.existsSync(path.join(root, "public", item.video)), `Missing ${item.video}`);
  assert.ok(fs.existsSync(path.join(root, "public", item.poster)), `Missing ${item.poster}`);
}

const placeholderPath = path.join(root, "public", VIDEO_LIBRARY_PLACEHOLDER_POSTER);
assert.ok(fs.existsSync(placeholderPath), "Color-bar placeholder image should exist");
assert.ok(fs.statSync(placeholderPath).size > 1_000, "Color-bar placeholder image should contain image data");
for (const item of plannedItems) {
  assert.equal(item.poster, VIDEO_LIBRARY_PLACEHOLDER_POSTER);
}

assert.match(pageSource, /item\.video \? \(/);
assert.match(pageSource, /VIDEO NOT YET ASSIGNED/);
assert.match(pageSource, /TEST PATTERN/);
assert.match(pageSource, /controls/);
assert.match(pageSource, /preload="metadata"/);
assert.match(pageSource, /autoPlay/);
assert.match(pageSource, /videoLibraryPosterButton/);
assert.match(pageSource, /videoLibraryPlayIcon/);
assert.doesNotMatch(pageSource, /WATCH & LEARN/);
assert.match(pageSource, /key=\{item\.id\}/);
assert.match(cssSource, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
assert.match(cssSource, /\.videoLibraryPlaceholder/);
assert.match(cssSource, /\.videoLibraryPosterButton img/);
assert.match(cssSource, /filter: none/);
assert.match(cssSource, /var\(--rrb-inventory-beige, #a59e99\)/);
assert.match(cssSource, /object-fit: cover/);

console.log("v83.7 ordered Video Library and placeholder contracts passed.");
