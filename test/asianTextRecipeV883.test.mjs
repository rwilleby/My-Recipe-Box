import assert from "node:assert/strict";
import { recipes } from "../src/data/recipes.js";
import { ASIAN_DIRECTIONS_V882 } from "../src/data/asianDirectionsV882.js";

const asian = recipes.filter((recipe) => recipe.id.startsWith("AS-") && !recipe.originalRecipeId);
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

const hasIngredient = (id, pattern) => byId[id].ingredients.some((item) => pattern.test(item.name));

for (const id of ["AS-001", "AS-002", "AS-011", "AS-014", "AS-015", "AS-016"]) {
  assert.match(byId[id].directions.join(" "), /cornstarch/i, `${id} directions mention cornstarch`);
  assert.ok(!hasIngredient(id, /cornstarch/i), `${id} must preserve the printed ingredient-panel omission`);
}

assert.ok(hasIngredient("AS-004", /^cornstarch$/i), "AS-004 must include the card's 2 tbsp cornstarch");
assert.ok(hasIngredient("AS-013", /^cornstarch$/i), "AS-013 must include the card's 2 tbsp cornstarch");
assert.ok(hasIngredient("AS-013", /^garlic/i), "AS-013 must include the card's garlic");
assert.ok(hasIngredient("AS-013", /^fresh ginger/i), "AS-013 must include the card's fresh ginger");
assert.match(byId["AS-015"].directions.join(" "), /heat oil/i);
assert.ok(!hasIngredient("AS-015", /oil/i), "AS-015 must preserve the printed oil omission");
assert.match(byId["AS-015"].directions.join(" "), /green onions/i);
assert.ok(!hasIngredient("AS-015", /green onions/i), "AS-015 must preserve the printed green-onion omission");
assert.match(byId["AS-018"].directions.join(" "), /optional chicken or ham/i);
assert.ok(!hasIngredient("AS-018", /chicken|ham/i), "AS-018 must preserve the printed optional-protein omission");
assert.match(byId["AS-023"].directions.join(" "), /herbs/i);
assert.ok(!hasIngredient("AS-023", /herb/i), "AS-023 must preserve the printed herb omission");
assert.match(byId["AS-024"].directions.join(" "), /sweet\s*&\s*sour sauce/i);
assert.ok(!hasIngredient("AS-024", /sweet.*sour sauce/i), "AS-024 must preserve the printed ingredient-panel omission");
assert.equal(byId["AS-021"].directions.length, 6);
assert.equal(byId["AS-024"].directions.length, 5);

console.log("Asian selectable Text Recipe contracts passed.");
