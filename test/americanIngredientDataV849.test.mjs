import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";

const expectedCounts = Object.fromEntries(`
AM-011:15 AM-012:9 AM-013:8 AM-014:13 AM-015:14 AM-016:12 AM-017:12 AM-018:12 AM-019:13 AM-020:14
AM-021:14 AM-022:15 AM-023:15 AM-024:15 AM-025:16 AM-026:15 AM-027:13 AM-028:16 AM-029:15 AM-030:16
AM-031:15 AM-032:15 AM-033:15 AM-034:15 AM-035:15 AM-036:14 AM-037:13 AM-038:15 AM-039:15 AM-040:14
AM-041:13 AM-042:15 AM-043:15 AM-044:12 AM-045:13 AM-046:13 AM-047:13 AM-048:13 AM-049:12 AM-050:14
AM-051:9 AM-052:11 AM-053:11 AM-054:15 AM-055:14 AM-056:17 AM-057:12 AM-058:13 AM-059:8 AM-060:15
AM-061:15 AM-062:14 AM-064:13 AM-065:15 AM-066:17 AM-067:18 AM-068:16 AM-069:13 AM-070:16
AM-071:13 AM-072:12 AM-073:10 AM-074:10 AM-075:13 AM-076:12 AM-077:10 AM-078:12
`.trim().split(/\s+/).map((token) => {
  const [id, count] = token.split(":");
  return [id, Number(count)];
}));

const american = recipes.filter((recipe) => recipe.id.startsWith("AM-") && !recipe.originalRecipeId);
const byId = Object.fromEntries(american.map((recipe) => [recipe.id, recipe]));
const nutritionRows = JSON.parse(fs.readFileSync(new URL("../src/data/nutrition/AM.json", import.meta.url)));
const authoritativeTitles = Object.fromEntries(nutritionRows.map((row) => [row.recipeCode, row.title]));

assert.equal(american.length, 77, "AM-063 is retired, leaving 77 active American recipes");
assert.equal(byId["AM-063"], undefined, "the reserved AM-063 placeholder must not be active");
american.forEach((recipe) => {
  assert.equal(recipe.title, authoritativeTitles[recipe.id], `${recipe.id} title must match the Nutrition Database`);
});

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

assert.equal(Object.keys(expectedCounts).length, 67);
assert.equal(Object.values(expectedCounts).reduce((sum, count) => sum + count, 0), 905);
assert.equal(american.reduce((sum, recipe) => sum + recipe.ingredients.length, 0), 1051);

assert.ok(byId["AM-013"].ingredients.some((item) => item.name === "Cooked ham, 3–4 lb" && item.qty === 1));
assert.ok(byId["AM-030"].ingredients.some((item) => item.name === "All-purpose flour" && Math.abs(item.qty - 1 / 3) < 1e-9));
assert.ok(byId["AM-038"].ingredients.some((item) => item.name.includes("Bone-in skin-on chicken pieces") && item.qty === 6));
assert.ok(byId["AM-051"].ingredients.some((item) => item.name === "Refrigerated biscuits" && item.unit.includes("16.3 oz")));
assert.ok(byId["AM-054"].ingredients.some((item) => item.name === "Pork shoulder roast, 3–4 lb"));
assert.ok(byId["AM-056"].ingredients.some((item) => item.name === "Tuna in water, drained" && item.unit === "5 oz cans"));
assert.ok(byId["AM-061"].ingredients.some((item) => item.name === "Beef hot dogs" && item.qty === 8));
assert.ok(byId["AM-066"].ingredients.some((item) => item.name === "Prepared mashed potatoes" && item.qty === 4));
assert.ok(byId["AM-078"].ingredients.some((item) => item.name === "Cooked ham, diced" && item.qty === 2));

console.log("v84.9 AM-011 through AM-078 ingredient and registry contracts passed.");
