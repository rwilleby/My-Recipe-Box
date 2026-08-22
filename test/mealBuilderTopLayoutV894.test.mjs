import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const component = await readFile(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");

assert.match(component, /mealBuilderTopGrid[\s\S]*mealBuilderTray[\s\S]*mealBuilderPlanColumn[\s\S]*mealBuilderSelectorStack/);
assert.match(component, /MealChoiceStats recipe=\{recipe\}/);
assert.match(component, /mealBuilderChoiceCalories/);
assert.match(component, /mealBuilderChoiceMb/);
assert.match(styles, /\.mealBuilderTopGrid[^}]*grid-template-columns: minmax\(0,46fr\) minmax\(0,54fr\)/);
assert.match(styles, /\.buildYourOwnMealPage[^}]*width: min\(100%,calc\(100vw - 11vw\)\)[^}]*max-width: none/);
assert.match(styles, /\.mealBuilderFinishRow[^}]*grid-template-rows: minmax\(138px,1fr\) minmax\(0,2fr\)/);
assert.match(component, /Plan the Portions/);
assert.doesNotMatch(component, />Step 2</);
assert.match(component, /<span>Portions<\/span>/);
assert.match(component, /<span>Freeze<\/span><strong>\{freezeLater\}<\/strong>/);
assert.match(component, /MealNutritionLine label="Meal"/);
assert.match(component, /MealNutritionLine label="Side 1"/);
assert.match(component, /MealNutritionLine label="Side 2"/);
assert.match(component, /type="search"/);
assert.match(styles, /\.mealBuilderTray[^}]*width: 100%[^}]*margin: 0/);
assert.match(styles, /\.mealBuilderSelectorStack[^}]*width: 100%/);
assert.match(styles, /\.mealBuilderChoiceStats/);
assert.match(styles, /\.mealBuilderChoiceMb[^}]*border-radius: 50%/);
assert.match(styles, /grid-template-columns: 40% 30% 30%/);

console.log("v89.4 meal-builder two-column top layout and selector nutrition footers passed");
