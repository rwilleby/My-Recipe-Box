import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

const diet = app.indexOf('<option value="diet-meals">Diet Meals</option>');
const complete = app.indexOf('<option value="complete-dinners">Complete Dinners</option>');
const favorites = app.indexOf('<option value="favorites">Favorites</option>');
const all = app.indexOf('<option value="all">All Categories</option>', diet);

assert.ok(diet >= 0 && complete > diet && favorites > complete && all > favorites, "Planner priority choices must remain Diet Meals, Complete Dinners, Favorites, then All Categories");
assert.match(app, /next\[slotKey\(picker\.day, picker\.weekId\)\] = plannerItems/, "A Complete Dinner must populate the full day meal row");
assert.match(app, /heroRecipeId: recipe\.id/);
assert.match(app, /heroMealId: meal\.id/);
assert.match(app, /shoppingPlannedMealImage/);
assert.match(css, /\.shoppingPlannedMealImage\{[^}]*aspect-ratio:4\/3/);

console.log("v98.4.1 planner priority and Shopping Overview meal-image contracts passed.");
