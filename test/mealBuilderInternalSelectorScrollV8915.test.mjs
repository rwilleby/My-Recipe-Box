import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");

assert.match(css, /\.mealBuilderSelectorStack\s*\{[^}]*height:\s*clamp\(360px,42vh,520px\)[^}]*overflow-y:\s*auto[^}]*overscroll-behavior-y:\s*contain[^}]*scroll-snap-type:\s*y proximity/);
assert.match(css, /\.mealBuilderSelectorStack > \.mealBuilderChoiceStrip\s*\{[^}]*scroll-snap-align:\s*start/);
assert.match(css, /\.mealBuilderSelectorStack::-webkit-scrollbar-thumb/);
assert.doesNotMatch(css, /\.mealBuilderSelectorStack\s*\{[^}]*position:\s*sticky/);

console.log("v89.15 Meal Builder internal selector-stack scrolling contract passed");
