import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { nutritionMealBalance } from "../src/data/nutritionMealBalance.js";

const dietMeals = recipes.filter((recipe) => recipe.categoryCode === "DM");
assert.equal(dietMeals.length, 60);
assert.ok(dietMeals.every((recipe) => recipe.mealBalance?.status === "nutrition-estimated"));
assert.ok(dietMeals.every((recipe) => recipe.mealBalance.score >= 3 && recipe.mealBalance.score <= 7));
assert.deepEqual(nutritionMealBalance({ calories: 265, totalFat: "10 g" }), { score: 3, label: "Balanced", status: "nutrition-estimated" });
assert.deepEqual(nutritionMealBalance({ calories: 485, totalFat: "16 g" }), { score: 7, label: "Rich", status: "nutrition-estimated" });
console.log("v98.8 Diet Meal nutrition-based MealBalance contracts passed.");
