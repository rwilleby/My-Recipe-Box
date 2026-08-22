import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const component = await readFile(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");
const assets = await readFile(new URL("../src/features/recipe-viewer/recipeAssets.js", import.meta.url), "utf8");

assert.match(component, /recipeHeroImageCandidates/);
assert.doesNotMatch(component, /recipeImageCandidates/);
assert.match(component, /label="Main Dish"/);
assert.match(component, /label="Side 1"/);
assert.match(component, /label="Side 2"/);
assert.match(component, /mealBuilderChoiceSlider/);
assert.match(component, /mealBuilderFinishRow/);
assert.match(component, /Estimated Meal Calories/);
assert.match(styles, /mealBuilderChoiceStrip/);
assert.match(styles, /grid-template-columns: 205px minmax\(0,1fr\)/);
assert.match(assets, /export function recipeHeroImageCandidates/);
assert.doesNotMatch(assets.match(/export function recipeHeroImageCandidates[\s\S]*?\n}/)?.[0] || "", /thumbs\/recipes/);

console.log("v89.2 meal-builder selector strips and hero-only image contracts passed");
