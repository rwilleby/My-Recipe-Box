import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import completeDinners from "../src/data/completeDinners.js";

const explicitlyApprovedMeals = Array.from({ length: 151 }, (_, index) => index + 1);
const approvedSet = new Set(explicitlyApprovedMeals);

assert.equal(completeDinners.length, 151, "The Complete Dinner catalog must contain Meals 1–151");

for (const dinner of completeDinners) {
  const shouldBeVisible = approvedSet.has(dinner.number);
  const isVisible = ["approved", "published"].includes(String(dinner.hero?.status || "").toLowerCase());
  assert.equal(isVisible, shouldBeVisible, `Meal ${dinner.number} hero visibility must match explicit user approval`);
  assert.equal(dinner.hero?.image, `images/dinner-combinations/meal-${String(dinner.number).padStart(3, "0")}.webp`);
  assert.ok(
    existsSync(resolve("public", dinner.hero.image)),
    `Approved hero file is missing for Meal ${dinner.number}: ${dinner.hero.image}`,
  );
}

console.log("Complete Dinner hero visibility v96 tests passed.");
