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
assert.match(component, /mealBuilderWorkspaceGrid/);
assert.match(component, /mealBuilderPreviewColumn/);
assert.match(component, /mealBuilderDishSelectors/);
assert.match(component, /mealBuilderSelectorColumns/);
assert.match(component, /Estimated Meal Calories/);
assert.match(styles, /mealBuilderChoiceColumn/);
assert.match(styles, /\.mealBuilderSelectorColumns[^}]*grid-template-columns: repeat\(3,minmax\(0,1fr\)\)/);
assert.match(assets, /export function recipeHeroImageCandidates/);
assert.doesNotMatch(assets.match(/export function recipeHeroImageCandidates[\s\S]*?\n}/)?.[0] || "", /thumbs\/recipes/);

console.log("Meal Builder vertical selector columns and hero-only image contracts passed");
