import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

for (const token of [
  "dailyValuePercent(meal.calories, 2000)",
  "dailyValuePercent(meal.protein, 50)",
  "dailyValuePercent(meal.carbs, 275)",
  "dailyValuePercent(meal.fat, 78)",
  "dailyValuePercent(meal.fiber, 28)",
  "dailyValuePercent(meal.sodium, 2300)",
  "dailyValuePercent(meal.saturatedFat, 20)",
  "dailyValuePercent(meal.addedSugars, 50)",
  "dailyValuePercent(meal.cholesterol, 300)",
  'aria-label="No established Daily Value"',
  "% Daily Value based on a 2,000 calorie diet.",
]) {
  assert.ok(app.includes(token), `Missing Complete Dinner nutrition token: ${token}`);
}

assert.ok(
  css.includes("font-size: clamp(10px, .82vw, 13px) !important;"),
  "Complete Dinner green nutrition values should be reduced by about one-third"
);
assert.ok(css.includes(".dinnerCombinationNutritionExpanded em"));
assert.ok(css.includes(".dinnerCombinationDailyValueNote"));

console.log("Complete Dinner Option 1 nutrition display contracts passed");
