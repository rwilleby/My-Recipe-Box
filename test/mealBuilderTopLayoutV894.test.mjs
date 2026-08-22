import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const component = await readFile(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");

assert.match(component, /mealBuilderTopGrid[\s\S]*mealBuilderTray[\s\S]*mealBuilderPlanColumn[\s\S]*mealBuilderSelectorStack/);
assert.match(component, /MealChoiceStats recipe=\{recipe\}/);
assert.match(component, /mealBuilderChoiceCalories/);
assert.match(component, /mealBuilderChoiceMb/);
assert.match(styles, /\.mealBuilderTopGrid[^}]*grid-template-columns: minmax\(0,2fr\) minmax\(0,3fr\)/);
assert.match(styles, /\.mealBuilderTray[^}]*width: 100%[^}]*margin: 0/);
assert.match(styles, /\.mealBuilderSelectorStack[^}]*width: 100%/);
assert.match(styles, /\.mealBuilderChoiceStats/);
assert.match(styles, /\.mealBuilderChoiceMb[^}]*border-radius: 50%/);
assert.match(styles, /grid-template-columns: 40% 30% 30%/);

console.log("v89.4 meal-builder two-column top layout and selector nutrition footers passed");
