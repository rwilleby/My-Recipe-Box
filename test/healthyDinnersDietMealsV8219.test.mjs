import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { recipes } from "../src/data/recipes.js";
import { normalizeRecipeClassification } from "../src/data/recipeClassifications.js";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/App.css", import.meta.url), "utf8");

const dietMeals = recipes.filter((recipe) => recipe.categoryCode === "DM");
assert.equal(dietMeals.length, 60, "Healthy Dinners must receive all 60 Diet Meals");

for (const recipe of dietMeals) {
  const normalized = normalizeRecipeClassification(recipe, {
    primaryCategory: "Diet Meals",
    collections: [],
    attributes: [],
    cookingMethods: [],
  });
  assert.ok(
    normalized.collections.includes("Healthy Dinners"),
    `${recipe.id} must be permanently tagged Healthy Dinners`,
  );
}

assert.match(app, /function HealthyDinnersPage\(/);
assert.match(app, /title="Find a Healthy Dinner"/);
assert.match(app, /aria-label="Healthy Dinner categories"/);
assert.match(app, /placeholder="Search Diet Meals\.\.\."/);
assert.match(app, /<span>Main Protein<\/span>/);
assert.match(app, /<span>Cuisine<\/span>/);
assert.match(app, /<span>Calorie Range<\/span>/);
assert.match(app, /<span>MB<\/span>/);
assert.match(app, /viewerContext="Healthy Dinners"/);
assert.match(app, /<BrowseRecipeNutritionFacts recipe=\{recipe\} \/>/);
assert.match(app, /<HealthyDinnersPage\s+recipes=\{classifiedRecipes\}/);
assert.doesNotMatch(
  app,
  /<CollectionDetailPage\s+title="Healthy Dinners"/,
  "Healthy Dinners must no longer use the generic collection placeholder",
);

assert.match(css, /v82\.19 — HEALTHY DINNERS \/ DIET MEALS COLLECTION/);
assert.match(css, /\.healthyDinnerSegmented\s*\{[\s\S]*repeat\(7, minmax\(0, 1fr\)\)/);

console.log("Healthy Dinners automatic Diet Meals collection v82.19 tests passed.");
