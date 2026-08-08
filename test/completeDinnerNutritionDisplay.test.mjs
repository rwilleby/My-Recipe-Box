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
  css.includes("font-size: clamp(7px, .55vw, 9px) !important;"),
  "Green Complete Dinner nutrition values must use the reduced v70.4 size"
);

const percentBlock = css.match(
  /\.dinnerCombinationNutritionExpanded em \{[\s\S]*?\n\}/
)?.[0] || "";
assert.ok(
  percentBlock.includes("font-size: clamp(8px, .72vw, 10px) !important;"),
  "%DV must match the nutrient-label font size"
);
assert.ok(
  percentBlock.includes("font-weight: 400 !important;"),
  "%DV must use regular font weight"
);

const noteBlock = css.match(
  /\.dinnerCombinationDailyValueNote \{[\s\S]*?\n\}/
)?.[0] || "";
assert.ok(
  noteBlock.includes("font-size: clamp(8px, .72vw, 10px) !important;"),
  "Daily Value footnote must match the nutrient-label font size"
);
assert.ok(
  noteBlock.includes("font-weight: 400 !important;"),
  "Daily Value footnote must use regular font weight"
);
assert.ok(
  noteBlock.includes("font-style: normal !important;"),
  "Daily Value footnote must use regular style"
);
assert.ok(
  noteBlock.includes("text-align: center !important;"),
  "Daily Value footnote must be centered"
);

console.log("Complete Dinner v70.4 nutrition typography contracts passed");
