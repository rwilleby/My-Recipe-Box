import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";
import { getCrockPotMidpointEstimate } from "../src/utils/crockPotNutritionEstimate.js";

const app = fs.readFileSync("src/App.jsx", "utf8");
const cardStart = app.indexOf("function CompactCrockPotCard");
const cardEnd = app.indexOf("function SlowCookerRecipesPage", cardStart);
const card = app.slice(cardStart, cardEnd);

const chicken = getCrockPotMidpointEstimate({ id: "CP-001", title: "Creamy Ranch Chicken" });
assert.deepEqual(chicken, { calories: 400, protein: 36, mealBalance: 6, servingsPerRecipe: 6, estimated: true });

const beef = getCrockPotMidpointEstimate({ id: "CP-040", title: "Beef & Broccoli" });
assert.deepEqual(beef, { calories: 470, protein: 35, mealBalance: 7, servingsPerRecipe: 6, estimated: true });

const crockPotRecipes = recipes.filter((recipe) => String(recipe.id).startsWith("CP-"));
for (const recipe of crockPotRecipes) {
  const estimate = getCrockPotMidpointEstimate(recipe);
  assert.ok(Number.isFinite(estimate?.calories), `${recipe.id} should have estimated calories`);
  assert.ok(Number.isFinite(estimate?.protein), `${recipe.id} should have estimated protein`);
  assert.ok(Number.isInteger(estimate?.mealBalance), `${recipe.id} should have an estimated MB score`);
  assert.equal(estimate.servingsPerRecipe, 6);
}

assert.match(card, /getCrockPotMidpointEstimate\(recipe\)/);
assert.match(card, /\{hasVerifiedCalories \? "" : "~"\}\{calories/);
assert.match(card, /\{hasVerifiedProtein \? "" : "~"\}\{protein/);
assert.match(card, /MB \{hasVerifiedMealBalance \? "" : "~"\}\{mealBalance/);
assert.match(card, /getRecipeNutritionVariant\(recipe\.id\)/, "verified nutrition should take precedence");

console.log("v99.7 Crock Pot midpoint calorie, protein, and MB estimates passed");
