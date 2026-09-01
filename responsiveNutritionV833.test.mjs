import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { recipes } from "../src/data/recipes.js";
import { getCrockPotNutritionEstimate } from "../src/utils/crockPotNutritionEstimate.js";

const [app, css, nutritionFacts] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
  readFile(
    new URL("../src/features/recipe-viewer/BrowseRecipeNutritionFacts.jsx", import.meta.url),
    "utf8",
  ),
]);

const crockPotRecipes = recipes.filter((recipe) => String(recipe.id).startsWith("CP-") && !recipe.originalRecipeId);
assert.equal(crockPotRecipes.length, 180, "all 180 Crock Pot recipes should be covered");

for (const recipe of crockPotRecipes) {
  const estimate = getCrockPotNutritionEstimate(recipe);
  assert.ok(estimate, `missing nutrition estimate for ${recipe.id}`);
  assert.match(String(estimate.calories), /\d/);
  assert.match(String(estimate.protein), /g/);
  assert.match(String(estimate.sodium), /mg/);
  assert.equal(estimate.estimatedRange, true);
  assert.ok(estimate.estimateNote.includes("Estimated range"));
}

assert.equal(getCrockPotNutritionEstimate({ id: "AM-001" }), null);
assert.match(nutritionFacts, /getCrockPotNutritionEstimate\(recipe\)/);
assert.match(nutritionFacts, /className="browseNutritionEstimateNote"/);
assert.match(app, /getCrockPotNutritionEstimate\(recipe\)/);

const finalCascade = css.slice(css.indexOf("v83.3 — CROCK POT NUTRITION"));
for (const contract of [
  /\.browseNutritionEstimateNote/,
  /@media \(min-width: 721px\)/,
  /grid-template-columns: minmax\(0, 1fr\) !important/,
  /\.simpleHeaderNav[\s\S]*width: 100% !important/,
  /@media \(min-width: 721px\) and \(max-width: 1100px\)/,
  /font-size: clamp\(9\.5px, 1\.22vw, 12px\) !important/,
  /grid-template-columns: repeat\(10, minmax\(50px, 70px\)\) !important/,
  /\.homeCategorySection \.homeCuisineSelectorRow[\s\S]*grid-template-columns: repeat\(14, minmax\(0, 1fr\)\) !important/,
  /browseCategoryQuickFilterRow > :nth-child\(11\)[\s\S]*grid-column: 4 !important/,
]) {
  assert.match(finalCascade, contract);
}

assert.doesNotMatch(
  finalCascade,
  /(?:\.homeCategoryGrid|\.categoryGrid\.homeCategoryGrid) > :nth-child\(11\)[\s\S]*?grid-column: 4 !important/,
  "the homepage selector must not force icon 11 onto a second row",
);

console.log("v83.3 Crock Pot nutrition and responsive layout contracts passed.");
