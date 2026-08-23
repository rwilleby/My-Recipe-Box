import assert from "node:assert/strict";
import fs from "node:fs";
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

const expectedGuideIds = [
  "home", "browse-recipes", "recipe-cards", "complete-dinners", "meal-builder",
  "weekly-meal-planner", "shopping-list", "kitchen-inventory", "favorites-notes",
  "backup-restore", "data-security", "mealbalance",
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

for (const pageId of ["Home", "Recipes", "Dinner Combinations", "Build Your Own Meal", "Meal Planner", "Shopping Lists", "Master Kitchen Inventory", "Favorites", "User Backup", "Your Data & Security", "MealBalance Guide"]) {
  assert.ok(getHowItWorksGuideForPage(pageId), `Missing page guide for ${pageId}`);
}
assert.equal(getHowItWorksGuideForPage("Contact Me"), null);
assert.equal(getHowItWorksGuideForPage("Disclaimers"), null);

assert.match(app, /HowItWorksModalHost/);
assert.match(app, /getHowItWorksGuideForPage\(activePage\)/);
assert.match(app, /openHowItWorksGuide\(activePage\)/);
assert.match(app, /openHowItWorksGuide\("Recipe Cards"\)/);
assert.match(app, /title="How It Works"[\s\S]*?text="Your Guide to Using Robert’s Recipe Box"/);
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
