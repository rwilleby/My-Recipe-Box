import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const menuStart = app.indexOf('label: "RECIPES & MEALS"');
const kitchenMenuStart = app.indexOf('label: "KITCHEN DETAILS"', menuStart);

assert.ok(menuStart >= 0 && kitchenMenuStart > menuStart);

const recipeMenu = app.slice(menuStart, kitchenMenuStart);
const expectedOrder = [
  "FIND RECIPES",
  "BROWSE OUR RECIPE LIBRARY",
  "VEGAN RECIPE LIBRARY",
  "YOUR FAVORITE RECIPES",
  "BUILD A MEAL",
  "COMPLETE DINNERS",
  "MEAL COLLECTIONS",
  "HEALTHY DINNERS",
  "SALAD JAR LUNCHES",
  "SLOW COOKER MEALS",
  "HOLIDAYS & SPECIAL OCCASIONS",
  "QUICK & EASY FREEZER MEALS",
  "SUMMER COOKOUTS",
  "COMFORT FOODS",
  "EASY 30-MINUTE MEALS",
];

let previousIndex = -1;
for (const label of expectedOrder) {
  const index = recipeMenu.indexOf(`label: "${label}"`);
  assert.ok(index > previousIndex, `${label} must follow ${expectedOrder[Math.max(0, expectedOrder.indexOf(label) - 1)]}`);
  previousIndex = index;
}

assert.match(recipeMenu, /label: "COMPLETE DINNERS", page: "Dinner Combinations"/);
assert.match(recipeMenu, /label: "BUILD A MEAL", page: "Build Your Own Meal"/);
assert.doesNotMatch(recipeMenu, /DINNER COMBINATIONS/);
assert.doesNotMatch(recipeMenu, /level:\s*1/);
assert.match(app, /className="recipesMealsMenuHeading"/);
assert.match(app, /role=\{group\.sections \? "group" : undefined\}/);

console.log("Grouped Recipes & Meals menu tests passed.");
