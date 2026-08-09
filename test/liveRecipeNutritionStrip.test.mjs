import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

assert.ok(
  app.includes("getRecipeNutritionVariant, hasRecipeNutritionRecord"),
  "Recipe viewer must use the same stored nutrition-profile accessor as Nutrition Data"
);
assert.ok(
  app.includes('const liveNutrition = getRecipeNutritionVariant(recipe.id)?.profile?.nutritionFacts || null;')
);

for (const token of [
  '["Calories", liveNutrition?.calories]',
  '["Protein", liveNutrition?.protein]',
  '["Fat", liveNutrition?.totalFat]',
  '["Carbs", liveNutrition?.totalCarbohydrate]',
  '["Sodium", liveNutrition?.sodium]',
]) {
  assert.ok(app.includes(token), `Missing quick nutrition field: ${token}`);
}

assert.ok(app.includes('className={`cardViewerQuickNutrition ${'));
assert.ok(app.includes('aria-label={`${recipe.title} quick nutrition per serving`}'));
assert.ok(css.includes(".cardViewerQuickNutrition"));
assert.ok(css.includes("display: flex;"));
assert.ok(css.includes("border-radius: 999px;"));
assert.ok(css.includes("font-size: 8px;"));
assert.ok(app.includes('className="cardViewerHeaderIdentity"'));

console.log("Live recipe-card nutrition strip contracts passed");
