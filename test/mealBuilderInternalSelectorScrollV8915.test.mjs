import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");
const jsx = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");

assert.match(css, /\.mealBuilderWorkspaceGrid\s*\{[^}]*grid-template-columns:\s*repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css, /\.mealBuilderWorkspaceGrid\s*\{[^}]*--meal-builder-selector-depth:[^;]*calc\(\(var\(--meal-builder-card-depth\) \* 2\) \+ 9px\)[^}]*align-items:\s*stretch/);
assert.match(css, /\.mealBuilderSelectorColumns\s*\{[^}]*grid-template-columns:\s*repeat\(3,minmax\(0,1fr\)\)/);
assert.match(css, /\.mealBuilderChoiceRail\s*\{[^}]*overflow-y:\s*auto[^}]*flex-direction:\s*column[^}]*overscroll-behavior-y:\s*contain[^}]*scroll-snap-type:\s*y mandatory/);
assert.match(css, /\.mealBuilderChoiceRail\s*\{[^}]*height:\s*var\(--meal-builder-selector-depth\)[^}]*max-height:\s*var\(--meal-builder-selector-depth\)/);
assert.match(css, /\.mealBuilderChoiceCard\s*\{[^}]*flex:\s*0 0 var\(--meal-builder-card-depth\)[^}]*height:\s*var\(--meal-builder-card-depth\)/);
assert.match(css, /\.mealBuilderMealSummaryCard\s*\{[^}]*overflow:\s*hidden[^}]*min-height:\s*96px/);
assert.match(css, /\.mealBuilderChoiceRail::-webkit-scrollbar-thumb/);
assert.match(jsx, /if \(a\.id === selectedId\) return -1;/);
assert.match(jsx, /scrollTo\(\{ top: 0, behavior: "smooth" \}\)/);
assert.match(jsx, /scrollBy\(\{ top: direction \* Math\.max/);
assert.doesNotMatch(jsx, />Dish Selectors</);
assert.doesNotMatch(jsx, /mealBuilderSelectorsHeading/);
assert.match(jsx, /mealBuilderWorkspaceGrid[\s\S]*mealBuilderPreviewColumn[\s\S]*mealBuilderDishSelectors/);
assert.doesNotMatch(jsx, />Calorie Overview</);
assert.doesNotMatch(jsx, /MealNutritionLine/);
assert.match(jsx, /placeholder="FILTER"/);
assert.match(jsx, /<span>Portion<\/span>/);
assert.match(jsx, />PRINT MEAL LABELS</);
assert.match(jsx, />CLEAR &amp; START OVER</);
assert.match(css, /\.mealBuilderTray\s*\{[^}]*aspect-ratio:\s*16\/9/);
assert.match(css, /\.mealBuilderChoiceLead input\[type="search"\][^}]*text-align:\s*center/);
assert.match(css, /\.mealBuilderPortionGrid label > span,[\s\S]*?text-align:\s*center/);
assert.doesNotMatch(jsx, /Sort by Cuisine/);
assert.doesNotMatch(jsx, /categoryCode\(recipe\) === category/);
assert.match(css, /\.buildYourOwnMealIntro p \+ p\s*\{[^}]*margin-top:\s*0/);
assert.doesNotMatch(css, /\.mealBuilderWorkspaceGrid\s*\{[^}]*grid-template-columns:\s*1fr\s*;/);

console.log("Meal Builder two-column vertical selector-reel contract passed");
