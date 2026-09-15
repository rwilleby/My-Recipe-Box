import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const rotations = fs.readFileSync(new URL("../src/features/home/HomeMealRotations.jsx", import.meta.url), "utf8");
const seo = fs.readFileSync(new URL("../src/routing/seoRoutes.js", import.meta.url), "utf8");
const labels = fs.readFileSync(new URL("../src/components/FreezerLabelMaker.jsx", import.meta.url), "utf8");

assert.match(app, /title="Diet Meals"[\s\S]*<HealthyDinnersPage/, "The Diet Meals page hero must use the recipe collection name");
assert.match(app, /title="Find a Diet Meal"/, "The finder heading must use Diet Meal");
assert.match(app, /label: "DIET MEALS", page: "Healthy Dinners"/, "Navigation must show Diet Meals while preserving the compatible internal route");
assert.doesNotMatch(app, /label: "HEALTHY DINNERS"/, "Visible navigation must not use the former collection name");
assert.match(seo, /"Healthy Dinners": "Diet Meals"/, "The compatible route must publish the Diet Meals page title");
assert.match(labels, /\["healthy", "Diet Meals"\]/, "Freezer labels must use the standard public name");

const batches = rotations.match(/const batchTransitions = Object\.fromEntries/g) || [];
assert.equal(batches.length, 2, "Quick Dinners and Diet Meals must each build one coordinated card batch");
assert.doesNotMatch(rotations, /transitionPosition|staggerTimersRef|HOME_COMBO_PAUSE_MS/, "Cards must not rotate one position at a time");
assert.match(rotations, /setHomeComboMeals\(nextMeals\)[\s\S]*setCrossfades\(\{\}\)/, "All six Quick Dinners must settle together");
assert.match(rotations, /setDietMeals\(nextMeals\)[\s\S]*setCrossfades\(\{\}\)/, "All six Diet Meals must settle together");

console.log("v100.6 Diet Meals naming and coordinated homepage rotation contracts passed.");
