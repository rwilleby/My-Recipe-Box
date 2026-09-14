import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { recipes } from "../src/data/recipes.js";
import { saladJarIngredientNames, saladJarIngredientPreview } from "../src/utils/saladJarIngredientPreview.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const saladRecipes = recipes.filter((recipe) => recipe.categoryCode === "SB");

assert.equal(saladRecipes.length, 20);
for (const recipe of saladRecipes) {
  const names = saladJarIngredientNames(recipe);
  const preview = saladJarIngredientPreview(recipe);
  const displayedNames = preview.split(" · ").filter(Boolean);
  assert.ok(displayedNames.length >= 5 && displayedNames.length <= 6, `${recipe.id} must show five or six ingredients`);
  assert.ok(displayedNames.every((name) => names.includes(name)), `${recipe.id} preview must use its own ingredients`);
  assert.ok(!/black pepper|olive oil|cooking spray|garlic powder/i.test(preview), `${recipe.id} must omit pantry basics`);
}
assert.match(app, /import \{ saladJarIngredientPreview \}/);
assert.match(app, /saladJarIngredientPreview\(recipe\)/);
assert.match(app, /Open for complete ingredients/);

console.log("v99.4 Salad Jar five-or-six meaningful ingredient preview contract passed.");
