import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";

const expectedCounts = {
  "AM-001": 17,
  "AM-002": 15,
  "AM-003": 14,
  "AM-004": 15,
  "AM-005": 15,
  "AM-006": 14,
  "AM-007": 12,
  "AM-008": 15,
  "AM-009": 15,
  "AM-010": 14,
};

const byId = Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe]));

for (const [id, expectedCount] of Object.entries(expectedCounts)) {
  const ingredients = byId[id]?.ingredients;
  assert.ok(ingredients, `${id} must exist`);
  assert.equal(ingredients.length, expectedCount, `${id} ingredient count`);
  ingredients.forEach((ingredient) => {
    assert.ok(ingredient.name, `${id} ingredient needs a name`);
    assert.ok(Number(ingredient.qty) > 0, `${id} ${ingredient.name} needs a positive quantity`);
    assert.ok(ingredient.unit, `${id} ${ingredient.name} needs a unit`);
    assert.ok(ingredient.aisle, `${id} ${ingredient.name} needs an aisle`);
  });
}

assert.equal(Object.values(expectedCounts).reduce((sum, count) => sum + count, 0), 146);
assert.deepEqual(
  byId["AM-001"].ingredients
    .filter((item) => item.originalName === "Worcestershire sauce")
    .map(({ qty, unit }) => ({ qty, unit })),
  [{ qty: 1, unit: "teaspoon" }, { qty: 1, unit: "tablespoon" }],
);
assert.ok(byId["AM-002"].ingredients.some((item) => item.originalName === "Beef stew meat or sirloin tips" && item.qty === 2 && item.unit === "pound"));
assert.ok(byId["AM-003"].ingredients.some((item) => item.originalName === "Cube steaks" && item.qty === 6 && item.unit === "each"));
assert.ok(byId["AM-006"].ingredients.some((item) => item.originalName === "Marinara sauce" && item.unit === "ounce" && item.shoppingEquivalent === "1 × 24-ounce jar"));
assert.ok(byId["AM-008"].ingredients.some((item) => item.originalName === "Diced tomatoes" && item.unit === "ounce" && item.packageSize === "14.5 ounces"));
assert.ok(byId["AM-009"].ingredients.some((item) => item.originalName === "Kidney beans, drained" && item.unit === "ounce" && item.preparation === "drained"));
assert.ok(byId["AM-010"].ingredients.some((item) => item.originalName === "Thin chicken breasts or cutlets" && item.qty === 6 && item.reviewStatus === "needs-review"));
assert.ok(byId["AM-011"].ingredients.length >= 3, "later AM batches may replace the former AM-011 fallback");

console.log("v84.8 American recipe-card ingredient contracts passed.");
