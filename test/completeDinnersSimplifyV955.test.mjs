import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

assert.match(app, /const COMPLETE_DINNER_BATCH_SIZE = 12;/, "Complete Dinners should use a compact 12-item batch");
assert.match(app, /const visibleMeals = filteredMeals\.slice\(0, visibleDinnerCount\);/, "Only the visible compact batch should render");
assert.match(app, /const selectedDinner = filteredMeals\.find/, "Full details should be selection-based");
assert.match(app, /selectedDinner && \(/, "The expanded dinner must render conditionally");
assert.match(app, /Show More Dinners/, "A Show More control should reveal the next batch");
assert.doesNotMatch(app, /\{filteredMeals\.map\(\(meal\) => \(\s*<DinnerCombinationCard/, "The page must not fully expand every filtered dinner");
assert.match(css, /\.compactDinnerGrid\s*\{/, "Compact dinner grid styling should exist");
assert.match(css, /\.selectedCompleteDinnerDetail\s*\{/, "Selected detail styling should exist");
assert.match(css, /@media \(max-width: 720px\)/, "Compact cards should include responsive behavior");

console.log("v95.5 Complete Dinners compact selection and Show More contracts passed");
