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
assert.match(app, /const days = \["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"\]/, "Shopping meal cards must remain ordered Sunday through Saturday");
assert.match(app, /shoppingPlannedWeeks\.map/, "Both planner weeks must render as separate rows");
assert.match(css, /\.shoppingPlannedWeekGrid\{[^}]*grid-template-columns:repeat\(7/, "Desktop must show seven daily meal cards per week");
assert.match(css, /\.shoppingWeeklyMealCard \.shoppingRecipeActionsSingle\{[^}]*grid-template-columns:1fr/, "View and Print controls must remain vertically stacked");
assert.match(app, /className="shoppingPlannedMbCircle"/, "Each rated meal must show its MealBalance circle");
assert.match(app, /viewLabel="View Recipe"/, "Planned-meal action must use the compact View Recipe label");
assert.match(css, /\.shoppingPlannedMbCircle\{[^}]*background:var\(--rrb-default-green\)/, "MealBalance must use the approved site green");
assert.match(css, /\.shoppingWeeklyMealCard h4\{[^}]*font-size:11px[^}]*-webkit-line-clamp:4/, "Meal names must use the compact four-line treatment");

console.log("v98.4.1 planner priority and Shopping Overview meal-image contracts passed.");
