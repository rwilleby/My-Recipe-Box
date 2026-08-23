import assert from "node:assert/strict";
import fs from "node:fs";

const component = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

assert.match(app, /savedCustomMeals:\s*"rrb_savedCustomMeals_v1"/);
assert.match(app, /normalizeSavedCustomMeals\(loadJSON\(STORAGE_KEYS\.savedCustomMeals, \[\]\)\)/);
assert.match(app, /saveJSON\(STORAGE_KEYS\.savedCustomMeals, savedCustomMeals\)/);
assert.match(app, /function saveCustomMeal\(savedMeal\)/);
assert.match(app, /function toggleSavedCustomMealFavorite\(id\)/);
assert.match(app, /function openSavedCustomMeal\(id\)[\s\S]*?setActivePage\("Build Your Own Meal"\)/);
assert.match(app, /Favorite Build Your Own Meals/);
assert.match(app, /<MealBuilderTrayPreview[\s\S]*?favoriteBuiltMealPreview/);
assert.match(app, /savedCustomMeals=\{savedCustomMeals\}/);

assert.match(component, /function saveCurrentMeal\(\)/);
assert.match(component, /mainTrayLayout,[\s\S]*?sideOneId:[\s\S]*?sideTwoId:[\s\S]*?servings,[\s\S]*?eatNow,[\s\S]*?refrigerate,/);
assert.match(component, /function loadSavedMeal\(savedMeal\)/);
assert.match(component, /Saved Meals/);
assert.match(component, /ADD TO FAVORITES/);
assert.match(component, /SAVE MEAL/);
assert.match(component, /DELETE SAVED MEAL/);
assert.match(css, /\.mealBuilderSavedMealsBar/);
assert.match(css, /\.favoriteBuiltMealGrid/);

console.log("v89.23 saved Build Your Own Meals can be reopened and independently favorited");
