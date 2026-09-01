import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { recipes } from "../src/data/recipes.js";
import { routeForRecipe, parseRoute } from "../src/routing/seoRoutes.js";
import { buildShoppingList } from "../src/utils/planning.js";

const original = recipes.find((recipe) => recipe.id === "AM-007");
const vegan = recipes.find((recipe) => recipe.id === "AM-007-VG");
assert.ok(original && vegan, "sample pair must contain two permanent records");
assert.equal(original.veganAlternativeId, vegan.id);
assert.equal(vegan.originalRecipeId, original.id);
for (const [originalId, veganId] of [["AM-025", "AM-025-VG"], ["AS-019", "AS-019-VG"], ["IT-023", "IT-023-VG"], ["MX-008", "MX-008-VG"], ["SF-005", "SF-005-VG"]]) {
  const regularRecipe = recipes.find((recipe) => recipe.id === originalId);
  const veganRecipe = recipes.find((recipe) => recipe.id === veganId);
  assert.ok(regularRecipe && veganRecipe, `${originalId} sister pair must contain two permanent records`);
  assert.equal(regularRecipe.veganAlternativeId, veganId);
  assert.equal(veganRecipe.originalRecipeId, originalId);
  assert.equal(veganRecipe.excludeFromRegularLibrary, true);
  assert.ok(veganRecipe.ingredients.length && veganRecipe.directions.length && veganRecipe.nutrition);
  assert.ok(existsSync(`public/images/recipes/${veganId}.webp`), `${veganId} must have its own card asset`);
}
for (const [originalId, veganId] of [["AM-001", "AM-001-VG"], ["AM-009", "AM-009-VG"], ["AS-007", "AS-007-VG"], ["AS-010", "AS-010-VG"], ["IT-020", "IT-020-VG"]]) {
  const regularRecipe = recipes.find((recipe) => recipe.id === originalId);
  const veganRecipe = recipes.find((recipe) => recipe.id === veganId);
  assert.equal(regularRecipe?.veganAlternativeId, veganId);
  assert.equal(veganRecipe?.originalRecipeId, originalId);
  assert.ok(existsSync(`public/images/recipes/${veganId}.webp`));
}
for (const [originalId, veganId] of [["MX-006", "MX-006-VG"], ["AS-008", "AS-008-VG"], ["IT-015", "IT-015-VG"], ["IT-029", "IT-029-VG"], ["AM-020", "AM-020-VG"]]) {
  const regularRecipe = recipes.find((recipe) => recipe.id === originalId);
  const veganRecipe = recipes.find((recipe) => recipe.id === veganId);
  assert.equal(regularRecipe?.veganAlternativeId, veganId);
  assert.equal(veganRecipe?.originalRecipeId, originalId);
  assert.equal(veganRecipe?.excludeFromRegularLibrary, true);
  assert.ok(existsSync(`public/images/recipes/${veganId}.webp`));
}
assert.equal(new Set(recipes.map((recipe) => recipe.id)).size, recipes.length, "recipe IDs must be unique");
assert.equal(parseRoute(routeForRecipe(vegan.id)).code, vegan.id, "Vegan direct URL must round-trip");
assert.ok(vegan.ingredients.length && vegan.directions.length && vegan.nutrition && vegan.mealBalance);
const shopping = buildShoppingList({ "week1-Mon": [vegan.id] }, recipes, vegan.servings);
assert.ok(shopping.some((item) => /lentils/i.test(item.name)), "Vegan sister must supply its own grocery ingredients");
assert.ok(!shopping.some((item) => /ground beef/i.test(item.name)), "Vegan groceries must not come from the original recipe");
assert.equal(vegan.excludeFromRegularLibrary, true);
assert.equal(vegan.isVegan, true);
assert.equal(vegan.veganStatus, "verified");
assert.ok(existsSync("public/images/recipes/AM-007-VG.webp"), "Vegan sister card must have its own asset");

const app = readFileSync("src/App.jsx", "utf8");
const css = readFileSync("src/App.css", "utf8");
assert.doesNotMatch(app, /viewerVeganIcon/);
assert.doesNotMatch(app, /images\/icons\/VGW\.webp/);
assert.match(app, /Vegan Version/);
assert.match(app, /Original Version/);
assert.doesNotMatch(app, /className={`veganSisterSwitch/);
assert.match(app, /setViewer\(\{ \.\.\.viewer, recipeId: sisterRecipe\.id \}, \{ push: true \}\)/);
assert.match(app, /rrbViewerDepth: 0/);
assert.match(app, /historyDepth \+ 1/);
assert.match(app, /window\.history\.go\(-\(historyDepth \+ 1\)\)/, "Close must skip sister history and return to the parent library route");
assert.match(app, /excludeFromRegularLibrary !== true/);
assert.match(app, /`rrb-recipe-note-\$\{recipe\.id\}`/, "notes must remain ID-scoped");
assert.match(app, /toggleFavorite\(recipe\.id\)/, "favorites must remain ID-scoped");
assert.match(app, /addToPlan\(recipe\.id\)/, "planner must receive the selected sister ID");
assert.doesNotMatch(css, /\.viewerVeganIcon/);
assert.match(css, /\.viewerVeganSwitchButton/);

const backup = readFileSync("src/utils/recipeBoxBackup.js", "utf8");
for (const prefix of ['"rrb_"', '"rrb-"']) assert.ok(backup.includes(prefix));
console.log("Vegan sister recipe Stage 1 regression contracts passed.");
