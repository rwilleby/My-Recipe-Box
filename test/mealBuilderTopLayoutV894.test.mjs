import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const component = await readFile(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");

assert.match(component, /mealBuilderWorkspaceGrid[\s\S]*mealBuilderPreviewColumn[\s\S]*mealBuilderTray[\s\S]*mealBuilderDishSelectors[\s\S]*mealBuilderSelectorColumns/);
assert.match(component, /MealChoiceStats recipe=\{recipe\}/);
assert.match(component, /mealBuilderChoiceCalories/);
assert.match(component, /mealBuilderChoiceMb/);
assert.match(styles, /\.mealBuilderWorkspaceGrid[^}]*grid-template-columns: repeat\(2,minmax\(0,1fr\)\)/);
assert.match(styles, /\.pageShell\.buildYourOwnMealPage[^}]*width: calc\(100vw - 11vw\)[^}]*max-width: none[^}]*padding:[^;]* 0 60px/);
assert.match(styles, /\.mealBuilderPreviewColumn[^}]*grid-template-rows: auto var\(--meal-builder-selector-depth\)/);
assert.match(component, />Calorie Overview<\/div>/);
assert.match(component, />Portion Plan<\/h2>/);
assert.doesNotMatch(component, /Plan the Portions/);
assert.doesNotMatch(component, />Step 2</);
assert.match(component, /<span>Portions<\/span>/);
assert.match(component, /<span>Freeze<\/span><strong>\{freezeLater\}<\/strong>/);
assert.match(component, /MealNutritionLine label="Meal"/);
assert.match(component, /MealNutritionLine label="Side 1"/);
assert.match(component, /MealNutritionLine label="Side 2"/);
assert.match(component, /type="search"/);
assert.match(component, /<span>Search by Name<\/span>[\s\S]*type="search"/);
assert.doesNotMatch(component, /Sort by Cuisine/);
assert.doesNotMatch(component, /categoryCode\(recipe\) === category/);
assert.match(component, /Recipe Box\.<\/p>[\s\S]*<p>Then decide/);
assert.match(styles, /\.buildYourOwnMealIntro p \+ p[^}]*margin-top: 0/);
assert.doesNotMatch(styles, /@media \(max-width: 900px\)[\s\S]*?\.mealBuilderTopGrid \{ grid-template-columns: 1fr; \}/);
assert.match(styles, /\.mealBuilderTray[^}]*width: 100%[^}]*margin: 0/);
assert.match(styles, /\.mealBuilderSelectorColumns[^}]*grid-template-columns: repeat\(3,minmax\(0,1fr\)\)/);
assert.match(styles, /\.mealBuilderWorkspaceGrid[^}]*grid-template-areas: "heading \." "preview selectors"/);
assert.match(styles, /\.mealBuilderChoiceRail[^}]*height: var\(--meal-builder-selector-depth\)[^}]*overflow-y: auto/);
assert.match(styles, /\.mealBuilderMealSummaryCard[^}]*height: var\(--meal-builder-selector-depth\)/);
assert.match(styles, /\.mealBuilderChoiceStats/);
assert.match(styles, /\.mealBuilderChoiceMb[^}]*border-radius: 50%/);
assert.match(styles, /grid-template-columns: 40% 30% 30%/);

console.log("Meal Builder two-column workspace, vertical selectors, and nutrition footers passed");
