import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";
import { DEFAULT_RECIPE_CLASSIFICATIONS } from "../src/data/recipeClassifications.js";
import {
  applyAutoClassification,
  classifyRecipe,
  classifyRecipeLibrary,
} from "../src/data/recipeAutoClassifier.js";

const chicken = recipes.find((recipe) => recipe.id === "AM-004");
const chickenResult = classifyRecipe(
  chicken,
  DEFAULT_RECIPE_CLASSIFICATIONS[chicken.id]
);
assert.ok(
  chickenResult.proposed.attributes.some(
    (item) => item.value === "Chicken" && item.confidence === "high"
  )
);
assert.ok(
  chickenResult.proposed.attributes.some((item) => item.value === "Dinner")
);

const side = recipes.find((recipe) => recipe.id === "SD-001");
assert.ok(
  classifyRecipe(side).proposed.attributes.some(
    (item) => item.value === "Side Dish"
  )
);

const grill = recipes.find((recipe) => recipe.id === "SG-001");
assert.ok(
  classifyRecipe(grill).proposed.cookingMethods.some(
    (item) => item.value === "Gas Grill"
  )
);

const existing = {
  primaryCategory: "American Cuisine",
  collections: ["Sunday Meals"],
  attributes: ["Family Favorite"],
  cookingMethods: [],
};
const applied = applyAutoClassification(
  chicken,
  existing,
  chickenResult
);
assert.ok(applied.collections.includes("Sunday Meals"));
assert.ok(applied.attributes.includes("Family Favorite"));
assert.ok(applied.attributes.includes("Chicken"));

const library = classifyRecipeLibrary(
  recipes,
  DEFAULT_RECIPE_CLASSIFICATIONS
);
assert.equal(library.results.length, recipes.length);
assert.ok(library.highConfidence.length > 0);
assert.ok(library.needsReview.length > 0);

const classifierUi = fs.readFileSync(
  "src/components/AdminRecipeClassifier.jsx",
  "utf8"
);
assert.ok(classifierUi.includes("Auto-Classify Recipes"));
assert.ok(classifierUi.includes("Approve All High Confidence"));
assert.ok(classifierUi.includes("Review Manually"));

console.log(
  JSON.stringify({
    total: library.results.length,
    highConfidence: library.highConfidence.length,
    needsReview: library.needsReview.length,
  })
);
console.log("Recipe Auto-Classifier contracts passed");
