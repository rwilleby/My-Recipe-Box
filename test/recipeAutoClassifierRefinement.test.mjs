import assert from "node:assert/strict";
import fs from "node:fs";
import {
  classifyRecipe,
  applyAutoClassification,
} from "../src/data/recipeAutoClassifier.js";

function recipe(id, title, ingredients = []) {
  return {
    id,
    title,
    category: "American Cuisine",
    categoryCode: "AM",
    time: 35,
    servings: 4,
    ingredients: ingredients.map((name) => ({ name })),
  };
}

// Incidental chicken broth must not turn a beef entrée into Chicken.
const hotBeef = classifyRecipe(
  recipe("AM-028", "Hot Beef Sandwich with Gravy", [
    "Roast beef",
    "Low-sodium chicken broth",
  ])
);
assert.ok(hotBeef.proposed.attributes.some((x) => x.value === "Beef"));
assert.ok(!hotBeef.proposed.attributes.some((x) => x.value === "Chicken"));

// "Scalloped" must not match the seafood word "scallop".
const hamScalloped = classifyRecipe(
  recipe("AM-046", "Ham & Scalloped Potatoes", [
    "Ham",
    "Scalloped potatoes",
  ])
);
assert.ok(hamScalloped.proposed.attributes.some((x) => x.value === "Pork"));
assert.ok(!hamScalloped.proposed.attributes.some((x) => x.value === "Seafood"));

// Pot Roast may be oven, slow cooker, or pressure cooker.
// Oven must remain reviewable unless explicit oven/baked wording exists.
const potRoast = classifyRecipe(recipe("AM-014", "Pot Roast", ["Chuck roast"]));
const potRoastOven = potRoast.proposed.cookingMethods.find((x) => x.value === "Oven");
assert.ok(potRoastOven);
assert.equal(potRoastOven.confidence, "medium");

// An explicit casserole remains a safe oven/casserole classification.
const chickenCasserole = classifyRecipe(
  recipe("AM-029", "Chicken and Rice Casserole", ["Chicken breast", "Rice"])
);
assert.ok(
  chickenCasserole.proposed.attributes.some(
    (x) => x.value === "Chicken" && x.confidence === "high"
  )
);
assert.ok(
  chickenCasserole.proposed.cookingMethods.some(
    (x) => x.value === "Oven" && x.confidence === "high"
  )
);
assert.ok(
  chickenCasserole.proposed.collections.some(
    (x) => x.value === "Casseroles" && x.confidence === "high"
  )
);

// Existing manual work must always survive auto approval.
const existing = {
  primaryCategory: "American Cuisine",
  collections: ["Sunday Meals"],
  attributes: ["Family Favorite"],
  cookingMethods: [],
};
const merged = applyAutoClassification(
  recipe("AM-029", "Chicken and Rice Casserole"),
  existing,
  chickenCasserole
);
assert.ok(merged.collections.includes("Sunday Meals"));
assert.ok(merged.attributes.includes("Family Favorite"));
assert.ok(merged.attributes.includes("Chicken"));

// Review-list UI contract.
const component = fs.readFileSync(
  "src/components/AdminRecipeClassifier.jsx",
  "utf8"
);
for (const token of [
  "autoSelectedRecipeIds",
  "Select All Visible",
  "Review Selected",
  "Clear Selection",
  'type="checkbox"',
  '["selected", "Selected", autoSelectedCount]',
]) {
  assert.ok(component.includes(token), `Missing review-list UI token: ${token}`);
}

console.log("Auto-Classifier refinement and Selected for Review contracts passed");
