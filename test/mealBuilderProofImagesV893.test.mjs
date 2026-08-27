import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const component = await readFile(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");

const mainIds = ["AM-001", "AM-007", "AM-008", "AM-010", "AM-018", "AM-020", "AM-037", "AM-041", "AM-053"];
const sideIds = ["SD-001", "SD-004", "SD-005", "SD-007", "SD-008", "SD-009", "SD-010", "SD-012", "SD-025"];

assert.match(component, /MEAL_BUILDER_MAIN_IDS/);
assert.match(component, /MEAL_BUILDER_SIDE_IDS/);
assert.match(component, /MEAL_BUILDER_DIVIDED_TRAY_SIDE_IDS/);
assert.doesNotMatch(component, /mealBuilderTrayPartitions/);
assert.match(component, /Choose<br \/>Main/);
assert.match(component, /className="mealBuilderSelectedDish has-selection" onClick=\{\(\) => onSelect\(""\)\}/);
assert.match(component, /aria-label=\{`Deselect \$\{normalizeRecipeTitle\(selectedRecipe\)\}`\}/);
assert.match(component, /categoryLabel="Sort by Cuisine"/);
assert.match(component, /categoryLabel="Sort by Type"/);
assert.match(component, /categoryDifference \|\| normalizeRecipeTitle\(a\)\.localeCompare\(normalizeRecipeTitle\(b\)\)/);
assert.match(component, /images\/build-your-own\/\$\{folder\}\/\$\{recipe\.id\}\.webp/);
assert.match(component, /position === "side-one"[\s\S]*?"side-1-middle"[\s\S]*?"side-2-right"/);
assert.match(component, /recipeHeroImageCandidates\(recipe\)/);
assert.match(component, /Meal image coming soon/);
assert.doesNotMatch(styles, /mealBuilderTrayFood img[^}]*transform:/);
assert.match(styles, /mealBuilderTrayFood-side-one\.is-divided-tray-layer/);
assert.match(styles, /mealBuilderTrayFood-side-two\.is-divided-tray-layer/);
assert.match(styles, /mealBuilderTrayFood-side-one\.is-divided-tray-layer[^}]*clip-path:\s*inset\(24\.6374% 40\.1368% 24\.7989% 39\.3368% round 2\.1%\)/);
assert.match(styles, /mealBuilderTrayFood-side-two\.is-divided-tray-layer[^}]*clip-path:\s*inset\(24\.6374% 14\.5781% 24\.7989% 62\.8781% round 2\.1%\)/);
assert.match(styles, /mealBuilderTrayFood-side-one\.is-divided-tray-layer[^}]*transform:\s*scale\(1\.14\)[^}]*transform-origin:\s*49\.6% 50%/);
assert.match(styles, /mealBuilderTrayFood-side-two\.is-divided-tray-layer[^}]*transform:\s*scale\(1\.14\)[^}]*transform-origin:\s*74\.15% 50%/);
assert.doesNotMatch(styles, /mealBuilderTrayPartition/);
assert.match(styles, /mealBuilderTrayFood-main\.is-empty[^}]*width:\s*23\.9497%/);
assert.match(styles, /mealBuilderTrayFood-side-one\.is-empty[^}]*left:\s*37\.9%/);
assert.match(styles, /mealBuilderTrayFood-side-two\.is-empty[^}]*left:\s*61\.3%/);
assert.match(styles, /mealBuilderTrayFood\.is-empty[^}]*top:\s*21\.0866%[^}]*height:\s*57\.6427%/);
assert.match(styles, /mealBuilderTrayPrimary[^}]*aspect-ratio:\s*1448\/1086/);
assert.match(styles, /mealBuilderTray\.mealBuilderTrayPrimary > \.mealBuilderTrayBase,[\s\S]*inset:\s*0[^}]*height:\s*100%[^}]*transform:\s*none/);

for (const id of mainIds) await access(new URL(`../public/images/build-your-own/main/${id}.webp`, import.meta.url));
for (const id of sideIds) {
  await access(new URL(`../public/images/build-your-own/side-1-middle/${id}.webp`, import.meta.url));
  await access(new URL(`../public/images/build-your-own/side-2-right/${id}.webp`, import.meta.url));
}

console.log("v89.3 dedicated Meal Builder proof-image contracts passed");
