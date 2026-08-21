import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";
import { AMERICAN_DIRECTIONS_V881 } from "../src/data/americanDirectionsV881.js";

const american = recipes.filter((recipe) => recipe.id.startsWith("AM-"));
const byId = Object.fromEntries(american.map((recipe) => [recipe.id, recipe]));
const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

assert.equal(american.length, 77, "all active American cards must remain present");
assert.equal(Object.keys(AMERICAN_DIRECTIONS_V881).length, 77, "every active American card needs reviewed directions");
assert.equal(AMERICAN_DIRECTIONS_V881["AM-063"], undefined, "reserved AM-063 must not receive invented directions");

for (const recipe of american) {
  assert.ok(recipe.ingredients.length > 0, `${recipe.id} needs selectable ingredients`);
  assert.ok(recipe.directions.length >= 5, `${recipe.id} needs all printed directions`);
  for (const direction of recipe.directions) {
    assert.ok(direction.trim().length >= 4, `${recipe.id} direction text must be meaningful`);
    assert.doesNotMatch(direction, /\b(?:ina|toa|Thsp|BBO|potabes)\b|;0up|[|¥]/i, `${recipe.id} must not contain OCR debris`);
  }
}

assert.equal(byId["AM-001"].directions.length, 8);
assert.match(byId["AM-025"].directions[7], /Garnish with parsley and serve hot\.$/);
assert.match(byId["AM-054"].directions[5], /2 1\/2-3 hours/);
assert.equal(byId["AM-078"].directions.length, 6);

assert.match(app, /openPanel === "textRecipe"/);
assert.match(app, />\s*Text Recipe\s*</);
assert.match(app, /viewerTextRecipeGrid/);
assert.match(app, /textRecipeIngredients\.map/);
assert.match(app, /textRecipeDirections\.map/);
assert.match(css, /\.viewerTextRecipeSheet \{user-select: text;/);

console.log("v88.2 American selectable Text Recipe contracts passed.");
