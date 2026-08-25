import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const routes = await readFile(new URL("../src/routing/seoRoutes.js", import.meta.url), "utf8");

const topLabels = ["ABOUT US", "RECIPES & MEALS", "KITCHEN DETAILS", "MEAL PLANNING", "SHOPPING", "RESOURCES"];
const menuSlices = {};
const headerStart = app.indexOf("const headerGroups");
for (let index = 0; index < topLabels.length; index += 1) {
  const start = app.indexOf(`label: "${topLabels[index]}"`, headerStart);
  const end = index + 1 < topLabels.length
    ? app.indexOf(`label: "${topLabels[index + 1]}"`, start)
    : app.indexOf("const favoriteItemCount", start);
  assert.ok(start >= 0 && end > start, `${topLabels[index]} must remain in the established top-level order`);
  menuSlices[topLabels[index]] = app.slice(start, end);
}

function assertLabelOrder(source, labels, menuName) {
  let previousIndex = -1;
  for (const label of labels) {
    const index = source.indexOf(`label: "${label}"`);
    assert.ok(index > previousIndex, `${label} must follow the approved ${menuName} order`);
    previousIndex = index;
  }
}

assertLabelOrder(menuSlices["ABOUT US"], [
  "GETTING STARTED", "WELCOME TO OUR SITE", "HOW IT WORKS", "VIDEO LIBRARY",
  "ABOUT THE RECIPE BOX", "ABOUT OUR RECIPES", "OUR NUTRITION STANDARDS",
  "UNDERSTANDING MEALBALANCE", "AFFILIATE MARKETING", "HELP, DATA & POLICIES",
  "YOUR DATA & SECURITY", "BACKUP & RESTORE", "CONTACT ME", "DISCLAIMERS",
], "ABOUT US");

assertLabelOrder(menuSlices["RECIPES & MEALS"], [
  "RECIPE LIBRARIES", "BROWSE OUR RECIPE LIBRARY", "VEGAN RECIPE LIBRARY",
  "YOUR FAVORITE RECIPES", "COMPLETE MEALS & COLLECTIONS", "COMPLETE DINNERS",
  "HEALTHY DINNERS", "SALAD JAR LUNCHES", "SLOW COOKER MEALS",
  "HOLIDAYS & SPECIAL OCCASIONS", "QUICK & EASY FREEZER MEALS", "SUMMER COOKOUTS",
  "COMFORT FOODS", "EASY 30-MINUTE MEALS",
], "RECIPES & MEALS");
assert.doesNotMatch(menuSlices["RECIPES & MEALS"], /BUILD(?:-| )A(?:-| )MEAL/);
assert.match(menuSlices["RECIPES & MEALS"], /label: "COMPLETE DINNERS", page: "Dinner Combinations"/);

assertLabelOrder(menuSlices["KITCHEN DETAILS"], [
  "MASTER KITCHEN INVENTORY", "FREEZING & REHEATING", "FOOD STORAGE & SHELF-LIFE GUIDE",
], "KITCHEN DETAILS");

assertLabelOrder(menuSlices["MEAL PLANNING"], [
  "CREATE A PLAN", "BUILD-A-MEAL", "YOUR WEEKLY MEAL PLANNER", "WEEKEND BULK MEAL PLANNER",
  "ADJUST YOUR MEALS", "RECIPE ADJUSTMENTS & SUBSTITUTIONS",
], "MEAL PLANNING");
assert.equal((menuSlices["MEAL PLANNING"].match(/page: "Build Your Own Meal"/g) || []).length, 1);

assertLabelOrder(menuSlices.SHOPPING, [
  "YOUR GROCERY LIST", "RECOMMENDED KITCHEN TOOLS & STORAGE",
], "SHOPPING");

assertLabelOrder(menuSlices.RESOURCES, [
  "HEALTH & SAFETY", "FOOD SAFETY", "EATING WELL WITH GLP-1 MEDICATIONS",
  "GUIDES", "REFERENCE GUIDES", "COOKING METHOD TIPS", "AIR FRYERS",
  "MICROWAVE OVENS", "GAS & ELECTRIC OVENS", "GAS & ELECTRIC GRIDDLES",
  "GAS GRILLS", "PELLET SMOKERS",
], "RESOURCES");
assert.doesNotMatch(menuSlices.RESOURCES, /TIPS:|level:\s*1/);

for (const menuClass of ["aboutUsSubmenu", "recipesMealsSubmenu", "mealPlanningSubmenu", "resourcesSubmenu"]) {
  assert.match(app, new RegExp(`menuClass: "${menuClass}"`));
  assert.ok(css.includes(`.${menuClass}`), `${menuClass} must use the shared grouped-dropdown styling`);
}
assert.match(app, /className="recipesMealsMenuHeading"/);
assert.match(app, /role=\{group\.sections \? "group" : undefined\}/);
assert.match(css, /grid-template-columns:\s*minmax\(0, 1fr\) 17px/);

assert.match(app, /function FoodStorageGuidePage/);
assert.match(app, /title="Food Storage & Shelf-Life Guide"/);
assert.match(app, /title="Recipe Adjustments & Substitutions"/);
assert.match(routes, /"Food Storage Guide": "\/food-storage-and-shelf-life-guide\/"/);
assert.match(routes, /"Grocery Picks": "\/healthy-substitutions\/"/);

console.log("Complete grouped navigation and supporting-page contracts passed.");
