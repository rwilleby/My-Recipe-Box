import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, css, categoryGrid] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
  readFile(new URL("../src/features/home/HomeCategoryGrid.jsx", import.meta.url), "utf8"),
]);

for (const label of [
  "Browse Our Complete Dinners", "Browse Our Diet Meals", "Browse Our Recipe Library",
  "Plan Your Week’s Dinners", "Plan Your Bulk Meals", "Browse Our Crock Pot Library",
  "Browse Your Favorites", "Browse Our Freezer-Friendly Library",
  "Browse Your Refrigerator Dinners", "Browse Your Freezer Meals", "Create Your Own Meal",
]) assert.ok(app.includes(label), `Missing homepage action: ${label}`);

const home = app.slice(app.indexOf("function Home({"), app.indexOf("function RecipesPage"));
assert.ok(home.indexOf("<HomePhotoFeatureSection") < home.indexOf("<HomeComboMealStrip"));
assert.ok(home.indexOf("<HomeComboMealStrip") < home.indexOf("<HomeDietMealStrip"));
const actionSection = app.slice(app.indexOf("function HomePhotoFeatureSection"), app.indexOf("function TransparencyLine"));
assert.doesNotMatch(actionSection, /homePhotoFeatureTile|HomePhotoFeatureModal/);
assert.match(actionSection, /activeAction\.actions\.map/);
assert.match(css, /--rrb-segmented-height: 32px/);
assert.match(actionSection, /href=\{routeForPage\(page\)\}/);
assert.match(actionSection, /event\.preventDefault\(\)/);
assert.match(css, /\.homeActionSupportingText[\s\S]*?font-family: Inter/);
assert.match(css, /\.homeActionSupportingText[\s\S]*?font-style: italic/);
assert.match(css, /\.homeActionSupportingLink[\s\S]*?font-weight: 800/);
assert.match(categoryGrid, /code === "DS"[\s\S]*?id: "VG"[\s\S]*?displayName: "Vegan"/);
assert.match(categoryGrid, /VG: "images\/categories\/VG\.webp"/);
assert.match(categoryGrid, /category\.id === "VG"[\s\S]*?setActivePage\("Vegan Recipe Library"\)/);

console.log("v98.5 homepage order, linked supporting text, and Vegan Quick Link contracts passed.");
