import assert from "node:assert/strict";
import fs from "node:fs";
import {
  hasQuickDinnerHero,
  selectVariedHomeComboMeals,
} from "../src/utils/homeQuickDinnerRotation.js";

const rotations = fs.readFileSync("src/features/home/HomeMealRotations.jsx", "utf8");

assert.ok(
  rotations.includes('from "../../utils/homeQuickDinnerRotation.js"')
);
assert.ok(
  rotations.includes(
    "uniqueRecordsByPermanentId(dinnerCombinations).filter(hasQuickDinnerHero)"
  )
);

const eligibleMeals = [
  ["meal-001", 1, "AM-001"],
  ["meal-002", 2, "AM-002"],
  ["meal-003", 3, "AS-001"],
  ["meal-004", 4, "HB-001"],
  ["meal-005", 5, "IT-001"],
  ["meal-006", 6, "MX-001"],
  ["meal-007", 7, "SG-001"],
  ["meal-008", 8, "SF-001"],
].map(([id, number, mainRecipeId]) => ({
  id,
  number,
  mainRecipeId,
  title: id,
  heroAvailable: true,
  image: `images/dinner-combinations/${id}.webp`,
}));

const missingHero = {
  id: "meal-009",
  number: 9,
  mainRecipeId: "AM-009",
  heroAvailable: false,
  image: "",
};
const blankImage = {
  id: "meal-010",
  number: 10,
  mainRecipeId: "AM-010",
  heroAvailable: true,
  image: "",
};

assert.equal(hasQuickDinnerHero(eligibleMeals[0]), true);
assert.equal(hasQuickDinnerHero(missingHero), false);
assert.equal(hasQuickDinnerHero(blankImage), false);

const selected = selectVariedHomeComboMeals([
  missingHero,
  ...eligibleMeals,
  blankImage,
]);

assert.equal(selected.length, 6);
assert.ok(selected.every(hasQuickDinnerHero));
assert.equal(new Set(selected.map((meal) => meal.id)).size, selected.length);
assert.ok(!selected.some((meal) => meal.id === missingHero.id));
assert.ok(!selected.some((meal) => meal.id === blankImage.id));
assert.deepEqual(selectVariedHomeComboMeals([missingHero, blankImage]), []);

console.log("V82.1 Quick Dinner hero-only rotation contracts passed");
