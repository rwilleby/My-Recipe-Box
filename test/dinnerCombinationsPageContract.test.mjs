import assert from "node:assert/strict";
import fs from "node:fs";
import { createRfisPlatform } from "../src/services/createRfisPlatform.js";
import { recipes } from "../src/data/recipes.js";
import { dinnerCombinations } from "../src/data/dinnerCombinations.js";

const app = fs.readFileSync("src/App.jsx", "utf8");
assert.ok(
  !app.includes("related.sharedRecipeNames.length"),
  "Dinner Combinations UI must not assume sharedRecipeNames exists"
);
assert.ok(
  app.includes("Array.isArray(related.reasons)"),
  "Dinner Combinations UI should use RFIS recommendation reasons"
);

const platform = createRfisPlatform({ recipes });
for (const meal of dinnerCombinations) {
  const recommendations =
    platform.recommendations.relatedDinnerCards(meal.id, { limit: 4 });

  for (const related of recommendations) {
    assert.ok(
      Array.isArray(related.reasons),
      `${meal.id}: related dinner ${related.id} must expose reasons`
    );
  }
}

console.log("Dinner Combinations page contract passed");
