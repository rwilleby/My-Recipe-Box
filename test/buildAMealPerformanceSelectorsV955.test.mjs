import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const component = await readFile(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");

assert.match(component, /const PAGE_SIZE = 12/);
assert.match(component, /visibleRecipes\.slice\(currentPage \* PAGE_SIZE/);
assert.match(component, /\{pagedRecipes\.map\(\(recipe\) =>/);
assert.doesNotMatch(component, /\{visibleRecipes\.map\(\(recipe\) =>/);
assert.match(component, /loading="lazy" decoding="async"/);
assert.match(component, /setPage\(0\)[\s\S]*categoryFilter, excludeId, searchQuery/);
assert.match(component, /Previous \$\{label\} recipes page/);
assert.match(component, /Next \$\{label\} recipes page/);
assert.match(component, /mealBuilderChoicePageStatus/);
assert.match(styles, /\.mealBuilderSlideButton:disabled/);
assert.match(styles, /\.mealBuilderChoicePageStatus/);

console.log("v95.5 Build-A-Meal paginated selectors and lazy image contracts passed");
