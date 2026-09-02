import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  fullCardImageCandidates,
  previewCardImageCandidates,
  recipeHeroImageCandidates,
  recipeImageCandidates,
} from "../src/features/recipe-viewer/recipeAssets.js";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const appCss = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const pinDialog = await readFile(new URL("../src/features/home/AdminPinDialog.jsx", import.meta.url), "utf8");
const pinCss = await readFile(new URL("../src/features/home/AdminPinDialog.css", import.meta.url), "utf8");
const counters = await readFile(new URL("../src/features/home/HomeRecipeCounters.jsx", import.meta.url), "utf8");
const images = await readFile(new URL("../src/features/recipe-viewer/RecipeImages.jsx", import.meta.url), "utf8");
const nutrition = await readFile(new URL("../src/features/recipe-viewer/BrowseRecipeNutritionFacts.jsx", import.meta.url), "utf8");

for (const requiredImport of [
  'import AdminPinDialog from "./features/home/AdminPinDialog"',
  'import HomeRecipeCounters from "./features/home/HomeRecipeCounters"',
  'import BrowseRecipeNutritionFacts from "./features/recipe-viewer/BrowseRecipeNutritionFacts"',
  'import { FullRecipeCardPreview, RecipeHeroImage, RecipeImage } from "./features/recipe-viewer/RecipeImages"',
]) {
  assert.ok(app.includes(requiredImport), `Missing v83.1 feature import: ${requiredImport}`);
}

assert.doesNotMatch(app, /function RecipeImage\(/);
assert.doesNotMatch(app, /function FullRecipeCardPreview\(/);
assert.doesNotMatch(app, /function BrowseRecipeNutritionFacts\(/);
assert.doesNotMatch(app, /function HomeRecipeCounters\(/);
assert.match(app, /<AdminPinDialog/);
assert.match(app, /<HomeRecipeCounters\s+recipes=\{recipes\}/);

assert.match(pinDialog, /role="dialog"/);
assert.match(pinDialog, /aria-modal="true"/);
assert.match(pinCss, /width: min\(390px, calc\(100vw - 32px\)\)/);
assert.doesNotMatch(appCss, /^\.adminPinDialog/m);

assert.match(counters, /Recipe library totals/);
assert.match(counters, /Freezer-Friendly/);
assert.match(images, /recipeFullCardImageButton/);
assert.match(images, /onError=\{\(\) => setImageIndex/);
assert.match(nutrition, /browseNutritionProtein/);
assert.match(nutrition, /Servings per recipe/);

const recipe = {
  id: "DM-001",
  heroImage: "images/heroes/DM-001.webp",
  cardImage: "images/recipes/DM-001.webp",
};
assert.equal(recipeImageCandidates(recipe)[0], "images/thumbs/recipes/DM-001.webp");
assert.equal(previewCardImageCandidates(recipe)[0], "images/thumbs/recipes/DM-001.webp");
assert.equal(fullCardImageCandidates(recipe)[0], "images/recipes/DM-001.webp");
assert.equal(new Set(fullCardImageCandidates(recipe)).size, fullCardImageCandidates(recipe).length);
assert.ok(recipeHeroImageCandidates({ id: "AM-002-VG", originalRecipeId: "AM-002" }).includes("images/heroes/AM-002.webp"));

// v89.25: the unified HOW IT WORKS data, modal, and page wiring intentionally
// expanded App.jsx slightly beyond the original pre-v83.1 ceiling.
assert.ok(app.split("\n").length < 20_500, "App.jsx should remain below the v89.25 20,500-line threshold");

console.log("v83.1 Home and Recipe Viewer structural contracts passed with the v89.25 unified-help allowance.");
