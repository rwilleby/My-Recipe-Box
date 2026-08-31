import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";
import { BREAD_MACHINE_DIRECTIONS_V9510 } from "../src/data/breadMachineDirectionsV9510.js";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const breadMachine = recipes.filter((recipe) => recipe.id.startsWith("BR-"));

assert.match(app, /className="cardViewer cardViewerBottomActions"\s+role="dialog"\s+aria-modal="true"/);
assert.match(app, /aria-labelledby=\{`\$\{recipe\.id\}-viewer-title`\}/);
assert.match(app, /viewerCloseRef\.current\?\.focus/);
assert.match(app, /returnFocusTarget\?\.focus/);
assert.match(app, /event\.key === "Escape"/);
assert.match(app, /event\.key !== "Tab"/);
assert.match(app, /document\.activeElement === first/);
assert.match(app, /document\.activeElement === last/);
assert.match(app, /zoomDialogRef/);

assert.equal(breadMachine.length, 10, "all active Bread Machine cards must remain present");
assert.equal(Object.keys(BREAD_MACHINE_DIRECTIONS_V9510).length, 10, "every active Bread Machine card needs reviewed directions");
for (const recipe of breadMachine) {
  assert.ok(recipe.ingredients.length > 0, `${recipe.id} needs selectable ingredients`);
  assert.ok(recipe.directions.length >= 5, `${recipe.id} needs all printed directions`);
  for (const direction of recipe.directions) {
    assert.ok(direction.trim().length >= 4, `${recipe.id} direction text must be meaningful`);
    assert.doesNotMatch(direction, /[|¥]|\b(?:ina|toa|BBO)\b/i, `${recipe.id} must not contain OCR debris`);
  }
}

assert.match(recipes.find((recipe) => recipe.id === "BR-009").directions.join(" "), /350°F for 18–22 minutes/);
assert.match(recipes.find((recipe) => recipe.id === "BR-011").directions.join(" "), /8 large pieces or 10 smaller pieces/);

console.log("v95.10 recipe viewer accessibility and Bread Machine selectable Text Recipe contracts passed.");
