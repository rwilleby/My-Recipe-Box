import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const routes = await readFile(new URL("../src/routing/seoRoutes.js", import.meta.url), "utf8");
const guides = await readFile(new URL("../src/data/howItWorksGuides.js", import.meta.url), "utf8");

assert.match(app, /SLOW COOKER MEALS[\s\S]*HOLIDAYS AND SPECIAL OCCASIONS[\s\S]*QUICK & EASY FREEZER MEALS/);
assert.match(app, /title="Holidays and Special Occasions"/);
assert.match(app, /Make holidays and special occasions easier to plan with complete menus/);
assert.match(app, /src="images\/heroes\/holidays-special-occasions-hero-1440x464\.webp"/);
assert.doesNotMatch(app, /"Holidays and Special Occasions",\s*\n\s*\n\s*"Summer Cookouts"/);
assert.match(guides, /\["Holidays and Special Occasions", "holidays-special-occasions"\]/);

const occasions = [
  "New Year’s Day", "Valentine’s Day", "Mardi Gras", "St. Patrick’s Day", "Passover",
  "Easter", "Cinco de Mayo", "Mother’s Day", "Memorial Day", "Father’s Day",
  "Independence Day", "Labor Day", "Rosh Hashanah", "Halloween", "Thanksgiving",
  "Hanukkah", "Christmas Eve", "Christmas Day", "New Year’s Eve",
];
let prior = -1;
for (const occasion of occasions) {
  const index = app.indexOf(`["${occasion}"`);
  assert.ok(index > prior, `${occasion} must remain in calendar order`);
  prior = index;
}

assert.equal((app.match(/data-recipe-status=/g) || []).length, 1);
assert.match(app, /data-recipe-status=\{dish\.recipeId \? "available" : "awaiting-recipe"\}/);
assert.match(app, /Add Menu to Meal Planner/);
assert.match(app, /Add Menu Ingredients to Grocery List/);
assert.match(app, /window\.scrollTo\(\{ top: 0, left: 0, behavior: "auto" \}\)/);
assert.match(routes, /"Holidays and Special Occasions": "\/holidays-and-special-occasions\/"/);
assert.match(css, /\.holidayMenuDishes[\s\S]*grid-template-columns: repeat\(3/);
assert.match(css, /@media \(max-width: 680px\)[\s\S]*\.holidayMenuDishes[\s\S]*grid-template-columns: 1fr/);

console.log("Holidays and Special Occasions v93.1 tests passed.");
