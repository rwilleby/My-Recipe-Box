import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { recipes } from "../src/data/recipes.js";

const expectedCounts = { IT: 65, MX: 46, SF: 22, DM: 60, CP: 181, QP: 30, SB: 20, SD: 52 };

for (const [categoryCode, expectedCount] of Object.entries(expectedCounts)) {
  const categoryRecipes = recipes.filter((recipe) => recipe.categoryCode === categoryCode);
  assert.equal(categoryRecipes.length, expectedCount, `${categoryCode} recipe inventory changed unexpectedly`);
  for (const recipe of categoryRecipes) {
    assert.ok(Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0, `${recipe.id} needs selectable ingredients`);
    assert.ok(Array.isArray(recipe.directions) && recipe.directions.length > 0, `${recipe.id} needs selectable directions`);
    assert.ok(recipe.directions.every((step) => typeof step === "string" && step.trim().length >= 8), `${recipe.id} contains an invalid direction step`);
    assert.ok(!recipe.directions.some((step) => /OCR_ERROR|undefined|null/i.test(step)), `${recipe.id} contains extraction residue`);
    assert.ok(existsSync(new URL(`../public/${recipe.cardImage}`, import.meta.url)), `${recipe.id} illustrated card is missing`);
  }
}

console.log("v96 requested-category selectable Text Recipe contracts passed for 476 active recipes.");
