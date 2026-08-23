import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");
const jsx = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");

assert.match(css, /\.mealBuilderWorkspaceGrid\s*\{[^}]*grid-template-columns:\s*repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css, /\.mealBuilderSelectorColumns\s*\{[^}]*grid-template-columns:\s*repeat\(3,minmax\(0,1fr\)\)/);
assert.match(css, /\.mealBuilderChoiceRail\s*\{[^}]*overflow-y:\s*auto[^}]*flex-direction:\s*column[^}]*overscroll-behavior-y:\s*contain[^}]*scroll-snap-type:\s*y mandatory/);
assert.match(css, /\.mealBuilderChoiceRail::-webkit-scrollbar-thumb/);
assert.match(jsx, /if \(a\.id === selectedId\) return -1;/);
assert.match(jsx, /scrollTo\(\{ top: 0, behavior: "smooth" \}\)/);
assert.match(jsx, /scrollBy\(\{ top: direction \* Math\.max/);
assert.match(jsx, />Dish Selectors</);
assert.match(jsx, />Calorie Overview</);
assert.doesNotMatch(css, /\.mealBuilderWorkspaceGrid\s*\{[^}]*grid-template-columns:\s*1fr\s*;/);

console.log("Meal Builder two-column vertical selector-reel contract passed");
