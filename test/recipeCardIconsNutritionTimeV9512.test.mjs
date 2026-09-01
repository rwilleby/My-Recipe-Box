import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const [css, nutritionFacts] = await Promise.all([
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
  readFile(
    new URL("../src/features/recipe-viewer/BrowseRecipeNutritionFacts.jsx", import.meta.url),
    "utf8",
  ),
]);

for (const icon of ["AL.webp", "favorites.webp", "all-recipes-v9512.webp", "favorites-v9512.webp"]) {
  const path = new URL(`../public/images/icons/${icon}`, import.meta.url);
  assert.ok((await stat(path)).size > 0, `${icon} must be nonempty`);
  const bytes = await readFile(path);
  assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF", `${icon} must be WebP`);
  assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP", `${icon} must be WebP`);
}

assert.match(nutritionFacts, /browseNutritionEstimateNote">Estimated Range</);
assert.match(css, /v95\.12 — compact Crock Pot estimate label/);
assert.match(css, /\.browseRecipeNutritionFacts \.browseNutritionEstimateNote[\s\S]*white-space: nowrap !important/);
assert.match(css, /\.browseRecipeWideFooterTime strong[\s\S]*font-size: clamp\(9px, 1\.65cqw, 12px\) !important/);
assert.match(css, /recipe-card image establish the grid-row height/);
assert.match(css, /\.browseRecipeNutritionFacts \{[\s\S]*height: auto !important;[\s\S]*min-height: 0 !important;[\s\S]*max-height: none !important;[\s\S]*align-self: stretch !important/);

console.log("v95.12 recipe-card icon, nutrition, and time contracts passed.");
