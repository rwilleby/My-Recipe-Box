import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { ASIAN_DIRECTIONS_V882 } from "../src/data/asianDirectionsV882.js";

const asian = recipes.filter((recipe) => recipe.id.startsWith("AS-"));
const byId = Object.fromEntries(asian.map((recipe) => [recipe.id, recipe]));

assert.equal(asian.length, 24, "all 24 Asian recipe cards must remain active");
assert.equal(Object.keys(ASIAN_DIRECTIONS_V882).length, 24, "every Asian card needs reviewed directions");

for (const recipe of asian) {
  assert.ok(recipe.ingredients.length > 0, `${recipe.id} needs selectable ingredients`);
  assert.ok(recipe.directions.length >= 5, `${recipe.id} needs all printed directions`);
  for (const direction of recipe.directions) {
    assert.ok(direction.trim().length >= 4, `${recipe.id} direction text must be meaningful`);
    assert.doesNotMatch(direction, /\b(?:BBO|ina|toa)\b|NETWT|SAUCE OPTION|[|¥]/i, `${recipe.id} must not contain OCR or package-art debris`);
  }
}

assert.match(byId["AS-004"].directions[0], /cornstarch/i);
assert.ok(!byId["AS-004"].ingredients.some((item) => /cornstarch/i.test(item.name)), "AS-004 must preserve the printed ingredient omission");
assert.match(byId["AS-013"].directions[2], /garlic/i);
assert.ok(!byId["AS-013"].ingredients.some((item) => /^garlic/i.test(item.name)), "AS-013 must preserve the printed ingredient omission");
assert.equal(byId["AS-021"].directions.length, 6);
assert.equal(byId["AS-024"].directions.length, 5);

console.log("Asian selectable Text Recipe contracts passed.");
