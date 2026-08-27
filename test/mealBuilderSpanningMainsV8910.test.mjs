import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const component = await readFile(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");

assert.match(component, /MEAL_BUILDER_MAIN_LAYOUTS/);
assert.match(component, /\.map\(\(id\) => \[id, "two-thirds"\]\)/);
assert.match(component, /"full-tray"/);
assert.match(component, /mainTrayLayout === "standard"/);
assert.match(component, /mainTrayLayout !== "full-tray"/);
assert.match(component, /nextLayout === "two-thirds" \|\| nextLayout === "full-tray"/);
assert.match(component, /nextLayout === "full-tray"\) setSideTwoId\(""\)/);
assert.match(component, /Complete meal — sides included/);
assert.match(component, /Included with selected main dish/);
assert.match(component, /Full Tray/);
assert.match(component, /2\/3 Tray/);
assert.match(styles, /\.mealBuilderTrayInterior\.is-two-thirds \.mealBuilderTrayFood-main\s*\{[^}]*width:\s*51\.7956%/);
assert.match(styles, /\.mealBuilderTrayInterior\.is-full-tray \.mealBuilderTrayFood-main\s*\{[^}]*width:\s*71\.6851%/);
assert.match(styles, /\.mealBuilderChoiceColumn\.is-disabled/);

await access(new URL("../public/images/build-your-own/main/AM-005.webp", import.meta.url));
await access(new URL("../public/images/build-your-own/main/AM-015.webp", import.meta.url));

console.log("Spanning Meal Builder mains and occupied vertical-side controls passed");
