import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");
const simpleList = fs.readFileSync(new URL("../src/features/shopping/SimpleShoppingListPanel.jsx", import.meta.url), "utf8");

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
assert.match(css, /\.shoppingWeeklyMealCard h4\{[^}]*font-size:11px!important[^}]*-webkit-line-clamp:4!important/, "Meal names must use the enforced compact four-line treatment");
assert.match(css, /\.shoppingStockReviewList\{[^}]*column-count:2/, "Stock review must flow down column one before continuing in column two");
assert.match(app, /statusRank: manuallyUnchecked \? 0 : isCovered \? 2 : 1/, "Stock review must order Unchecked, Need To Buy, then In Inventory");
assert.match(app, /a\.kind\.localeCompare\(b\.kind\).*a\.displayName/, "Stock items must sort by kind and then alphabetically");
assert.match(app, /function shoppingProductName\(value\)/, "Stored product URLs must be converted to readable product names");
assert.match(simpleList, /Everything below still needs to be purchased for your planned meals/, "The simple list must explain its purchase-only scope");
assert.match(simpleList, /Preferred Store[\s\S]*Start Online Shopping[\s\S]*Print List/, "The simple list must expose only the three primary controls");
assert.match(simpleList, /entries\.filter\(\(entry\) => !entry\.isCovered\)/, "Covered inventory must not appear in the purchase list");
assert.match(simpleList, /shoppingPurchasedDetails/, "Purchased items must move to a separate collapsed section");
assert.match(app, /aria-expanded=\{showMoreShoppingOptions\}/, "More Options must use an accessible disclosure control");
assert.match(css, /\.shoppingSimpleGroups\{[^}]*grid-template-columns:repeat\(2/, "The purchase list must use two columns on larger screens");
assert.match(css, /@media\(max-width:900px\)\{\.shoppingSimpleGroups\{grid-template-columns:1fr/, "The purchase list must collapse to one column on smaller screens");

console.log("v98.4.1 planner priority and Shopping Overview meal-image contracts passed.");
