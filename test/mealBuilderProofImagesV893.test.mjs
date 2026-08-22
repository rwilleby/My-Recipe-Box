import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const component = await readFile(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");

const mainIds = ["AM-001", "AM-008", "AM-010", "AM-018", "AM-020", "AM-037", "AM-041", "AM-053"];
const sideIds = ["SD-001", "SD-004", "SD-005", "SD-007", "SD-008", "SD-009", "SD-012", "SD-025"];

assert.match(component, /MEAL_BUILDER_MAIN_IDS/);
assert.match(component, /MEAL_BUILDER_SIDE_IDS/);
assert.match(component, /images\/meal-builder\/\$\{folder\}\/\$\{recipe\.id\}\.webp/);
assert.match(component, /Meal image coming soon/);
assert.doesNotMatch(styles, /mealBuilderTrayFood img[^}]*transform:/);

for (const id of mainIds) await access(new URL(`../public/images/meal-builder/main/${id}.webp`, import.meta.url));
for (const id of sideIds) await access(new URL(`../public/images/meal-builder/sides/${id}.webp`, import.meta.url));

console.log("v89.3 dedicated Meal Builder proof-image contracts passed");
