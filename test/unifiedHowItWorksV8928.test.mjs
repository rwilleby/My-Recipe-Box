import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import {
  HOW_IT_WORKS_CATEGORIES,
  HOW_IT_WORKS_GOALS,
  HOW_IT_WORKS_GUIDES,
  HOW_IT_WORKS_QUICK_PATH,
  getHowItWorksGuideForPage,
} from "../src/data/howItWorksGuides.js";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const system = fs.readFileSync(new URL("../src/components/HowItWorksSystem.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/components/HowItWorksSystem.css", import.meta.url), "utf8");
const routes = fs.readFileSync(new URL("../src/routing/seoRoutes.js", import.meta.url), "utf8");
const howItWorksVideo = fs.readFileSync(new URL("../public/videos/how-it-works.mp4", import.meta.url));
const videoLibraryVideo = fs.readFileSync(new URL("../public/videos/about-us-video-library.mp4", import.meta.url));

const expectedGuideIds = [
  "home", "video-library", "browse-recipes", "recipe-cards", "vegan-recipe-library",
  "complete-dinners", "holidays-special-occasions", "meal-builder", "weekly-meal-planner",
  "shopping-list", "kitchen-inventory", "favorites-notes", "backup-restore",
  "data-security", "mealbalance",
];

assert.deepEqual(HOW_IT_WORKS_GUIDES.map((guide) => guide.id), expectedGuideIds);
assert.equal(new Set(HOW_IT_WORKS_GUIDES.map((guide) => guide.id)).size, HOW_IT_WORKS_GUIDES.length);
assert.equal(HOW_IT_WORKS_QUICK_PATH.length, 6);
assert.equal(HOW_IT_WORKS_GOALS.length, 8);
assert.equal(HOW_IT_WORKS_CATEGORIES.length, 8);

for (const guide of HOW_IT_WORKS_GUIDES) {
  assert.ok(guide.title && guide.category && guide.purpose && guide.page && guide.centralAnchor);
  assert.ok(guide.steps.length >= 3 && guide.steps.length <= 6, `${guide.id} must have 3–6 steps`);
  assert.ok(guide.features.length > 0 && guide.tip);
}

for (const pageId of ["Home", "Video Library", "Recipes", "Vegan Recipe Library", "Dinner Combinations", "Holidays and Special Occasions", "Build Your Own Meal", "Meal Planner", "Shopping Lists", "Master Kitchen Inventory", "Favorites", "User Backup", "Your Data & Security", "MealBalance Guide"]) {
  assert.ok(getHowItWorksGuideForPage(pageId), `Missing page guide for ${pageId}`);
}
assert.equal(getHowItWorksGuideForPage("Contact Me"), null);
assert.equal(getHowItWorksGuideForPage("Disclaimers"), null);

assert.match(app, /HowItWorksModalHost/);
assert.match(app, /getHowItWorksGuideForPage\(activePage\)/);
assert.match(app, /openHowItWorksGuide\(activePage\)/);
assert.match(app, /openHowItWorksGuide\("Recipe Cards"\)/);
assert.match(app, /title="How It Works"[\s\S]*?text="Your Guide to Using Robert’s Recipe Box"/);
assert.match(app, /title="How It Works"[\s\S]*?videoSrc=\{HOW_IT_WORKS_VIDEO_URL\}/);
assert.match(app, /title="Video Library"[\s\S]*?videoSrc=\{VIDEO_LIBRARY_VIDEO_URL\}/);
assert.equal(howItWorksVideo.length, 9397332);
assert.equal(videoLibraryVideo.length, 8958256);
assert.equal(createHash("sha256").update(howItWorksVideo).digest("hex"), "18a8bcd44ef1f443837475972bce874939383c8fcab8df4a9e5cc98d2606f501");
assert.equal(createHash("sha256").update(videoLibraryVideo).digest("hex"), "e7c0fa4ffa154b081a025f5493c3e076e24fba07535c69f9c3991df69ac3069a");
assert.match(app, /<UnifiedHowItWorksPage setActivePage=\{setActivePage\}/);
assert.doesNotMatch(app, /activePage === "How To Use"/);

for (const requiredCopy of ["Quick Overview", "Detailed Help", "How Can We Help You?", "Search How It Works", "What This Page Does", "How to Use It", "Features Included", "Helpful Tip", "View Complete How It Works", "View Roadmap", "Watch Video", "Open Page", "Close"]) {
  assert.ok(system.includes(requiredCopy), `Missing unified help copy: ${requiredCopy}`);
}

assert.match(system, /role="dialog"/);
assert.match(system, /aria-modal="true"/);
assert.match(system, /event\.key === "Escape"/);
assert.match(system, /event\.target === event\.currentTarget/);
assert.match(system, /event\.key !== "Tab"/);
assert.match(system, /createPortal/);
assert.match(css, /\.howItWorksModalBody\s*\{[^}]*overflow-y:\s*auto/);
assert.match(css, /@media \(max-width: 650px\)/);

assert.match(routes, /PAGE_BY_ROUTE\.set\("\/how-to-use\/", "How It Works"\)/);
assert.doesNotMatch(routes, /"How It Works", "How To Use"/);

console.log("v89.28 unified How It Works data, central page, modal, roadmaps, video links, routing, and accessibility contracts passed");
