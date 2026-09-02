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
assert.match(app, /rotationRecipes=\{veganOnly \? libraryRecipes : undefined\}/);
assert.match(app, /rotateAcrossAll=\{veganOnly\}/);
assert.match(discovery, /rotateAcrossAll \|\| recipeMatchesChoice/);
assert.match(css, /\.veganRecipeLibraryPage \.libraryCategorySelectorRow[\s\S]*repeat\(9/);
assert.doesNotMatch(app, /<small>\{quickCategoryRecipeCount\(choice\)\}<\/small>/);
assert.match(app, /\["all", "ALL"\]/);
assert.match(css, /\.completeDinnerCategorySegmented[\s\S]*repeat\(8/);

console.log("v96.3 navigation, Vegan discovery, and Complete Dinner ALL contracts passed.");
