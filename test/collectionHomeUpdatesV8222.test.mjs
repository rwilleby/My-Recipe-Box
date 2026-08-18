import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const rotations = fs.readFileSync("src/features/home/HomeMealRotations.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

for (const token of [
  "function HomeDietMealStrip",
  'title="Looking for Diet Meal Ideas?"',
  'src={HEALTHY_DINNERS_VIDEO_URL}',
  'onClick={() => setActivePage("Healthy Dinners")}',
  'siteMode === "easy" ? dietMeals.slice(0, 4) : dietMeals',
  "HOME_COMBO_ROTATION_MS",
  "HOME_COMBO_CROSSFADE_MS",
  "HomeDietMealCrossfadeCard",
  'className="homeComboMealGrid homeDietMealGrid"',
]) {
  assert.ok(rotations.includes(token), `Missing Diet Meals home-strip contract: ${token}`);
}

for (const token of [
  'const SALAD_JARS_VIDEO_URL = "videos/salad-jars.mp4";',
  'videoSrc={SALAD_JARS_VIDEO_URL}',
  'videoPoster={SALAD_JARS_VIDEO_POSTER}',
  "function SaladJarLunchesPage",
  'title="Find a Salad Jar Lunch"',
  'placeholder="Search Salad Jars..."',
  'viewerContext="Salad Jars"',
  'const NUTRITION_STANDARDS_VIDEO_URL = "videos/nutrition-standards.mp4";',
  'videoSrc={NUTRITION_STANDARDS_VIDEO_URL}',
  'videoPoster={NUTRITION_STANDARDS_VIDEO_POSTER}',
]) {
  assert.ok(app.includes(token), `Missing held-edit contract: ${token}`);
}

const noVideoSet = app.slice(
  app.indexOf("const NO_INTRO_VIDEO_PAGES"),
  app.indexOf("function pageHasIntroVideo")
);
assert.ok(!noVideoSet.includes('"Salad Jars"'), "Salad Jars must advertise its intro video");
assert.ok(!noVideoSet.includes('"Nutrition Standards"'), "Nutrition Standards must advertise its intro video");

for (const token of [
  ".homeDietMealStrip",
  ".homeDietMealImage .recipeImage",
  ".saladJarSegmented",
  ".dinnerCombinationScaleCard .dinnerRecipeMealBalanceBadge",
  "color: #fff !important;",
]) {
  assert.ok(css.includes(token), `Missing v82.22 style contract: ${token}`);
}

const expectedVideos = new Map([
  ["public/videos/diet-meals.mp4", "a5cae104427a89a73a0cc24d289e978d5cc236cca6aec164827eec589500f435"],
  ["public/videos/salad-jars.mp4", "f954027e0778f753ef63d63f536dfb584f92acc7cdbd7b4b358576ef3db5c650"],
  ["public/videos/nutrition-standards.mp4", "3a422f1e31581130748160d6069156623d594cd438f5e22fec4f5e07c8f61028"],
]);

for (const [videoPath, expectedHash] of expectedVideos) {
  assert.ok(fs.existsSync(videoPath), `Missing optimized video: ${videoPath}`);
  const actualHash = crypto.createHash("sha256").update(fs.readFileSync(videoPath)).digest("hex");
  assert.equal(actualHash, expectedHash, `Unexpected video contents: ${videoPath}`);
}

console.log("v82.22 Diet Meals home strip and held collection updates passed");
