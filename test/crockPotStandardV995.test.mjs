import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";
import { crockPotIngredientNames, crockPotIngredientPreview } from "../src/utils/crockPotIngredientPreview.js";

const app = fs.readFileSync("src/App.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");
const pageStart = app.indexOf("function SlowCookerRecipesPage");
const pageEnd = app.indexOf("function getHealthyDinnerGroup", pageStart);
const page = app.slice(pageStart, pageEnd);
const cardStart = app.indexOf("function CompactCrockPotCard");
const card = app.slice(cardStart, pageStart);

assert.ok(pageStart > -1 && pageEnd > pageStart, "Crock Pot page should remain present");
assert.match(app, /const SLOW_COOKER_GROUPS = \[\s*\{ id: "chicken", label: "CHICKEN \/ TURKEY" \},\s*\{ id: "beef", label: "BEEF" \},\s*\{ id: "pork", label: "PORK \/ HAM" \},\s*\{ id: "sausage", label: "SAUSAGE" \},\s*\{ id: "soups", label: "SOUPS \/ STEWS" \},\s*\{ id: "more", label: "MORE" \}/);
assert.match(page, /placeholder="Search for\.\.\."/);
assert.doesNotMatch(page, /slowCookerFilterBar/);
assert.match(page, /favoriteDifference[\s\S]*localeCompare/);
assert.match(page, /slice\(0, visibleRecipeCount\)/);
assert.match(page, /Show More Crock Pot Recipes/);
assert.match(card, /compactDinnerCard compactCrockPotCard/);
assert.match(card, /crockPotIngredientPreview\(recipe\)/);
assert.match(card, /cal<\/span>[\s\S]*g protein<\/span>[\s\S]*MB/);
assert.match(card, /isFreezerFriendly && <span title="Freezer Friendly">FF<\/span>/);
assert.match(css, /v99\.5 — CROCK POT MEALS STANDARD LISTING/);
assert.match(css, /grid-template-columns: minmax\(145px, 1\.15fr\) repeat\(6, minmax\(0, 1fr\)\)/);

const crockPotRecipes = recipes.filter((recipe) => String(recipe.id).startsWith("CP-"));
assert.ok(crockPotRecipes.length >= 180, "the complete Crock Pot collection should be available");
for (const recipe of crockPotRecipes) {
  const names = crockPotIngredientNames(recipe);
  const preview = crockPotIngredientPreview(recipe);
  assert.ok(preview, `${recipe.id} should have a meaningful ingredient preview`);
  assert.ok(preview.split(" · ").length <= 6, `${recipe.id} preview should contain no more than six ingredients`);
  if (names.length >= 5) assert.ok(preview.split(" · ").length >= 5, `${recipe.id} should show at least five meaningful ingredients`);
}

console.log("v99.5 Crock Pot standard listing and ingredient previews passed");
