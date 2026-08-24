import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const component = await readFile(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");

const mainIds = ["AM-001", "AM-007", "AM-008", "AM-010", "AM-018", "AM-020", "AM-037", "AM-041", "AM-053"];
const sideIds = ["SD-001", "SD-004", "SD-005", "SD-007", "SD-008", "SD-009", "SD-010", "SD-012", "SD-025"];

assert.match(component, /MEAL_BUILDER_MAIN_IDS/);
assert.match(component, /MEAL_BUILDER_SIDE_IDS/);
assert.match(component, /MEAL_BUILDER_DIVIDED_TRAY_SIDE_IDS/);
assert.match(component, /mealBuilderTrayPartition-left/);
assert.match(component, /mealBuilderTrayPartition-right/);
assert.match(component, /className={`mealBuilderSelectedDish/);
assert.match(component, /categoryLabel="Sort by Cuisine"/);
assert.match(component, /categoryLabel="Sort by Type"/);
assert.match(component, /normalizeRecipeTitle\(a\)\.localeCompare\(normalizeRecipeTitle\(b\)\)/);
assert.match(component, /images\/build-your-own\/\$\{folder\}\/\$\{recipe\.id\}\.webp/);
assert.match(component, /position === "side-one"[\s\S]*?"side-1-middle"[\s\S]*?"side-2-right"/);
assert.match(component, /recipeHeroImageCandidates\(recipe\)/);
assert.match(component, /Meal image coming soon/);
assert.doesNotMatch(styles, /mealBuilderTrayFood img[^}]*transform:/);
assert.match(styles, /mealBuilderTrayFood-side-one\.is-divided-tray-layer/);
assert.match(styles, /mealBuilderTrayFood-side-two\.is-divided-tray-layer/);
assert.match(styles, /mealBuilderTrayInterior\.is-two-thirds \.mealBuilderTrayPartition-left/);
assert.match(styles, /mealBuilderTrayInterior\.is-full-tray \.mealBuilderTrayPartitions/);

for (const id of mainIds) await access(new URL(`../public/images/build-your-own/main/${id}.webp`, import.meta.url));
for (const id of sideIds) {
  await access(new URL(`../public/images/build-your-own/side-1-middle/${id}.webp`, import.meta.url));
  await access(new URL(`../public/images/build-your-own/side-2-right/${id}.webp`, import.meta.url));
}

console.log("v89.3 dedicated Meal Builder proof-image contracts passed");
