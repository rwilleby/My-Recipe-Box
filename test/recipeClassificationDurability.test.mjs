import assert from "node:assert/strict";
import fs from "node:fs";
import {
  DEFAULT_RECIPE_CLASSIFICATIONS,
  mergeRecipeClassificationImport,
  validateRecipeClassificationImport,
} from "../src/data/recipeClassifications.js";
import { recipes } from "../src/data/recipes.js";

assert.equal(Object.keys(DEFAULT_RECIPE_CLASSIFICATIONS).length, 105);

const valid = validateRecipeClassificationImport(
  {
    "AM-001": {
      primaryCategory: "American Cuisine",
      collections: ["Slow Cooker Favorites"],
      attributes: ["Beef"],
      cookingMethods: ["Slow Cooker"],
    },
  },
  recipes
);
assert.equal(valid.ok, true);

const invalid = validateRecipeClassificationImport(
  {
    "AM-001": {
      collections: ["Made Up Collection"],
      attributes: [],
      cookingMethods: [],
    },
  },
  recipes
);
assert.equal(invalid.ok, false);

const merged = mergeRecipeClassificationImport(
  DEFAULT_RECIPE_CLASSIFICATIONS,
  valid.accepted,
  recipes
);
assert.equal(merged.ok, true);
assert.ok(merged.merged["AM-001"]);

const classifier = fs.readFileSync(
  "src/components/AdminRecipeClassifier.jsx",
  "utf8"
);
assert.ok(classifier.includes("Import JSON"));
assert.ok(classifier.includes("mergeRecipeClassificationImport"));

const app = fs.readFileSync("src/App.jsx", "utf8");
assert.ok(app.includes("Array.isArray(related.reasons)"));
assert.ok(!app.includes("related.sharedRecipeNames.length"));

console.log("Cumulative v70 classification durability contracts passed");
