import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, css] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

for (const label of [
  "Browse Our Complete Dinners", "Browse Our Diet Meals", "Browse Our Recipe Library",
  "Plan Your Week’s Dinners", "Plan Your Bulk Meals", "Browse Our Crock Pot Library",
  "Browse Your Favorites", "Browse Our Freezer-Friendly Library",
  "Browse Your Refrigerator Dinners", "Browse Your Freezer Meals", "Create Your Own Meal",
]) assert.ok(app.includes(label), `Missing homepage action: ${label}`);

const home = app.slice(app.indexOf("function Home({"), app.indexOf("function RecipesPage"));
assert.ok(home.indexOf("<HomeComboMealStrip") < home.indexOf("<HomeDietMealStrip"));
assert.ok(home.indexOf("<HomeDietMealStrip") < home.indexOf("<HomePhotoFeatureSection"));
const actionSection = app.slice(app.indexOf("function HomePhotoFeatureSection"), app.indexOf("function TransparencyLine"));
assert.doesNotMatch(actionSection, /homePhotoFeatureTile|HomePhotoFeatureModal/);
assert.match(actionSection, /activeAction\.actions\.map/);
assert.match(css, /homeActionButtonRow/);
assert.match(css, /--rrb-segmented-height: 32px/);
assert.match(css, /\.homeActionDestinationButton[\s\S]*?height: var\(--rrb-segmented-height\)/);
assert.match(css, /\.homeActionDestinationButton[\s\S]*?white-space: nowrap/);

console.log("v98.3 homepage task order and matched action-button sizing contracts passed.");
