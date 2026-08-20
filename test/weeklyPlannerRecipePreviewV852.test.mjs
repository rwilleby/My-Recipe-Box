import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

for (const token of [
  "function WeeklyPlannerRecipeCardPreview({ recipe })",
  "const [plannerCardPreview, setPlannerCardPreview] = useState(null)",
  "function openPlannerCell(day, row, weekId = activePlannerWeek)",
  "onClick={() => openPlannerCell(day, row, weekId)}",
  "Open recipe card.",
  "className=\"weeklyPlannerCardPreviewOverlay\"",
  "className=\"weeklyPlannerCardPreviewStage\"",
  "onClick={closePlannerCardPreview}",
  "onClick={changePlannerCardRecipe}",
]) {
  assert.ok(app.includes(token), `Missing planner preview behavior: ${token}`);
}

assert.match(app, />\s*Close\s*</, "Missing Close button label");
assert.match(app, />\s*Change\s*</, "Missing Change button label");

for (const token of [
  ".weeklyPlannerCardPreviewOverlay",
  ".weeklyPlannerCardPreviewStage img",
  ".weeklyPlannerCardPreviewActions",
]) {
  assert.ok(css.includes(token), `Missing planner preview styling: ${token}`);
}

console.log("v85.2 occupied planner recipe-card preview passed");
