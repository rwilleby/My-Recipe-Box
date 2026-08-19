import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { categories, recipes } from "../src/data/recipes.js";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const categoryGrid = await readFile(
  new URL("../src/features/home/HomeCategoryGrid.jsx", import.meta.url),
  "utf8",
);
const classifier = await readFile(new URL("../src/data/recipeAutoClassifier.js", import.meta.url), "utf8");
const recipeAssets = await readFile(new URL("../src/features/recipe-viewer/recipeAssets.js", import.meta.url), "utf8");

const dietCategory = categories.find((category) => category.id === "DM");
const dietRecipes = recipes.filter((recipe) => recipe.categoryCode === "DM");

assert.ok(dietCategory, "Diet Meals category must exist");
assert.equal(dietCategory.name, "Diet Meals");
assert.equal(dietCategory.count, 60);
assert.equal(dietRecipes.length, 60);
assert.equal(dietRecipes[0].id, "DM-001");
assert.equal(dietRecipes[0].title, "Herb-Roasted Chicken with Potatoes & Broccoli");
assert.equal(dietRecipes.at(-1).id, "DM-060");
assert.equal(dietRecipes.at(-1).title, "Fish Florentine with Rice");
assert.ok(dietRecipes.every((recipe) => recipe.servings === 4));
assert.ok(dietRecipes.filter((recipe) => Number(recipe.id.slice(3)) > 20).every((recipe) => recipe.ingredients.length === 4));
assert.ok(dietRecipes.filter((recipe) => Number(recipe.id.slice(3)) <= 20).every((recipe) => recipe.ingredients.length >= 8));
assert.equal(new Set(dietRecipes.map((recipe) => recipe.id)).size, 60);

for (let number = 1; number <= 60; number += 1) {
  const code = `DM-${String(number).padStart(3, "0")}`;
  for (const relativePath of [
    `../public/images/recipes/${code}.webp`,
    `../public/images/heroes/${code}.webp`,
    `../public/images/thumbs/recipes/${code}.webp`,
    `../public/images/thumbs/heroes/${code}.webp`,
  ]) {
    const url = new URL(relativePath, import.meta.url);
    await access(url);
    assert.ok((await stat(url)).size > 1_000, `${relativePath} must contain a real WebP asset`);
  }
}

assert.match(categoryGrid, /DM: "images\/categories\/DM\.webp"/);
assert.match(categoryGrid, /"AM",\s*"AS",\s*"IT",\s*"MX",\s*"SF",\s*"DM",\s*"QP"/);
assert.match(recipeAssets, /"CP", "CR", "DM", "DN"/);
assert.match(classifier, /"CS", "DM", "HB"/);

console.log("Diet Meals category and 60 TRAY-based recipe assets v82.15 tests passed.");
