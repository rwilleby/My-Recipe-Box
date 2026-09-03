import assert from "node:assert/strict";
import fs from "node:fs";

const planner = fs.readFileSync(new URL("../src/components/WeekendBulkMealPlanner.jsx", import.meta.url), "utf8");
const plannerCss = fs.readFileSync(new URL("../src/components/WeekendBulkMealPlanner.v51.css", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const appCss = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");
const recipeData = fs.readFileSync(new URL("../src/data/recipes.js", import.meta.url), "utf8");

const individualPosition = planner.indexOf("Individual Recipes");
const completePosition = planner.indexOf("Complete Meals", individualPosition);
const dietPosition = planner.indexOf("Diet Meals", completePosition);
assert.ok(individualPosition >= 0 && completePosition > individualPosition && dietPosition > completePosition, "Weekend Bulk Plan source tabs must be Individual Recipes, Complete Meals, Diet Meals");
assert.match(planner, /catalogMode === "diet-meals"/);
assert.match(planner, /recipeCode\(recipe\) === "DM"/);
assert.match(planner, /Search Diet Meals by recipe name or code/);
assert.match(plannerCss, /grid-template-columns:repeat\(3,minmax\(150px,1fr\)\)/);

assert.match(app, /<span>Consolidated<\/span><span>List<\/span>/);
assert.match(app, /<span>By Meal \/<\/span><span>Component<\/span>/);
assert.match(app, /useState\("consolidated"\)/);
assert.match(app, /Items by Meal or Component/);
assert.match(app, /function clearShoppingListAndStartOver\(\)/);
assert.match(app, /setPlan\(emptyTwoWeekPlan\(\)\)/);
assert.match(app, /setChecked\(\{\}\)/);
assert.match(app, /setShoppingComments\(\{\}\)/);
assert.match(app, /setComponentDecisions\(\{\}\)/);
assert.match(app, /Pantry, refrigerator, and freezer inventory will not be deleted/);
assert.match(app, /Refrigerator Restock/);
assert.match(app, /Freezer Restock/);
assert.match(appCss, /\.shoppingNeedGroups/);
assert.match(appCss, /\.shoppingClearButton/);

for (const ingredient of [
  "Small corn tortillas",
  "Mild green enchilada sauce",
  "Plain nonfat Greek yogurt",
  "Shredded part-skim mozzarella",
  "Diced green chiles",
  "Fresh cilantro, chopped",
]) {
  assert.ok(recipeData.includes(ingredient), `DM-007 must include ${ingredient}`);
}
assert.match(recipeData, /DETAILED_RECIPE_INGREDIENTS\[id\] \|\| defaultIngredients/);

console.log("v83.11 Weekend Bulk Diet Meals and Shopping List regression contract passed.");
