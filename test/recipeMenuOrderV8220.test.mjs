import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const aboutStart = app.indexOf('label: "ABOUT US"');
const menuStart = app.indexOf('label: "RECIPES & MEALS"');
const kitchenMenuStart = app.indexOf('label: "KITCHEN DETAILS"', menuStart);

assert.ok(aboutStart >= 0 && menuStart > aboutStart && kitchenMenuStart > menuStart);

const aboutMenu = app.slice(aboutStart, menuStart);
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

const expectedAboutOrder = [
  "GETTING STARTED",
  "WELCOME TO OUR SITE",
  "HOW IT WORKS",
  "VIDEO LIBRARY",
  "ABOUT THE RECIPE BOX",
  "ABOUT OUR RECIPES",
  "OUR NUTRITION STANDARDS",
  "UNDERSTANDING MEALBALANCE",
  "AFFILIATE MARKETING",
  "HELP, DATA & POLICIES",
  "YOUR DATA & SECURITY",
  "BACKUP & RESTORE",
  "CONTACT ME",
  "DISCLAIMERS",
];

previousIndex = -1;
for (const label of expectedAboutOrder) {
  const index = aboutMenu.indexOf(`label: "${label}"`);
  assert.ok(index > previousIndex, `${label} must follow the approved ABOUT US section order`);
  previousIndex = index;
}

assert.match(aboutMenu, /menuClass: "aboutUsSubmenu"/);
assert.match(aboutMenu, /label: "UNDERSTANDING MEALBALANCE", page: "MealBalance Guide"/);
assert.match(aboutMenu, /label: "BACKUP & RESTORE", page: "User Backup"/);

console.log("Grouped ABOUT US and Recipes & Meals menu tests passed.");
