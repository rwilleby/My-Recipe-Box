import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/App.css"), "utf8");
const discovery = fs.readFileSync(path.join(root, "src/features/recipe-library/RecipeLibraryDiscovery.jsx"), "utf8");

const headerStart = app.indexOf("const headerGroups = [");
const headerEnd = app.indexOf("const visibleHeaderGroups", headerStart);
const header = app.slice(headerStart, headerEnd > headerStart ? headerEnd : headerStart + 9000);

for (const hiddenLabel of [
  "QUICK & EASY FREEZER MEALS",
  "SUMMER COOKOUTS",
  "COMFORT FOODS",
  "EASY 30-MINUTE MEALS",
]) {
  assert.equal(header.includes(`label: "${hiddenLabel}"`), false, `${hiddenLabel} must be hidden from the public header`);
}

assert.match(header, /label: "YOUR KITCHEN"/);
assert.match(header, /label: "YOUR KITCHEN INVENTORY", page: "Master Kitchen Inventory"/);
assert.match(app, /VEGAN_LIBRARY_DISCOVERY_COPY/);
assert.match(app, /rotationRecipes=\{veganOnly \? libraryRecipes\.filter\(\(recipe\) => recipe\.originalRecipeId\) : undefined\}/);
assert.match(app, /rotateAcrossAll=\{veganOnly\}/);
assert.match(discovery, /const rotationChoiceId = rotateAcrossAll \? "ALL"/);
assert.match(discovery, /recipeHeroImageCandidates\(recipe\)/);
assert.doesNotMatch(discovery, /RECIPE_HERO_BY_CODE/);
assert.match(css, /\.veganRecipeLibraryPage \.libraryCategorySelectorRow[\s\S]*repeat\(9/);
for (const label of ["All Recipes", "Plant Mains", "Bakes", "Pastas", "Bowls", "Sandwiches", "Asian", "Mexican", "Soups"]) {
  assert.match(app, new RegExp(`displayName: "${label}"`), `Vegan category label ${label} must be present`);
}
assert.match(app, /browse the changing six-recipe selection for fresh inspiration/);
assert.match(app, /className="holidayMenuDishHero"/);
assert.match(app, /images\/holiday-recipe-heroes\/\$\{dish\.recipeId\}\.webp/);
assert.match(css, /\.holidayMenuDishHero[\s\S]*aspect-ratio: 1 \/ 1/);
assert.match(css, /\.holidayMenuDishHero img[\s\S]*object-fit: contain/);
assert.doesNotMatch(app, /<small>\{quickCategoryRecipeCount\(choice\)\}<\/small>/);
assert.match(app, /\["all", "ALL"\]/);
assert.match(css, /\.completeDinnerCategorySegmented[\s\S]*repeat\(8/);

console.log("v96.3 navigation, Vegan discovery, and Complete Dinner ALL contracts passed.");
