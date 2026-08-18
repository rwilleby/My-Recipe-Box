import assert from "node:assert/strict";
import fs from "node:fs";

const app=fs.readFileSync("src/App.jsx","utf8");
const css=fs.readFileSync("src/App.css","utf8");

const noVideoPages=[
  "Submit Recipes",
  "Contact Me",
  "Disclaimers",
  "RFIS Search",
  "Dinner Combinations",
  "Freezer-Friendly Meals",
  "Slow Cooker Favorites",
  "Summer Cookouts",
  "Comfort Foods",
  "Easy 30-Minute Meals",
  "Grocery Picks",
  "Products I Use",
  "Safe Cooking Rules",
  "GLP-1 Nutrition",
  "Air Fryer Recipes",
  "Microwave Recipes",
  "Oven Recipes",
  "Griddle Recipes",
  "Gas Grill Recipes",
  "Smoker Recipes",
];

assert.ok(app.includes("const NO_INTRO_VIDEO_PAGES = new Set(["));
assert.ok(app.includes("function pageHasIntroVideo(pageId"));
for(const page of noVideoPages){
  assert.ok(app.includes(`"${page}"`),`Missing no-video page: ${page}`);
}

for(const token of[
  "pageHasIntroVideo(item.page)",
  'className="simpleHeaderVideoIndicator"',
  'title="Intro video available"',
  "const hasIntroVideo = pageHasIntroVideo(activePage);",
  "{hasIntroVideo && (",
  "{title && hasIntroVideo && (",
]){
  assert.ok(app.includes(token),token);
}

for(const token of[
  ".simpleHeaderVideoIndicator",
  "opacity: .62 !important;",
  "animation: none !important;",
]){
  assert.ok(css.includes(token),token);
}

console.log("v72.16 intro-video availability contracts passed");
