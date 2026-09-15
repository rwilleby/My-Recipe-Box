import assert from "node:assert/strict";
import fs from "node:fs";

const actions = fs.readFileSync(new URL("../src/features/shopping/ShoppingRecipeActions.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

assert.doesNotMatch(actions, /links\.length === 1\) return/, "Single recipes must use the same Recipe Cards menu as complete meals");
assert.match(actions, /<summary>Recipe Cards<\/summary>/, "All meal cards must use the standard Recipe Cards button");
assert.match(actions, /links\.length === 1 \? "Print Recipe"/, "Single-recipe menus must use the correct print label");
assert.match(actions, /closest\("details"\)\?\.removeAttribute\("open"\)/, "The menu must close before opening or printing a recipe");
assert.match(css, /\.shoppingWeeklyMealCard \.shoppingRecipeActionsMenu>div\{[^}]*position:fixed[^}]*top:50%[^}]*left:50%/, "Planned-meal menus must open within the viewport");
assert.match(css, /max-height:calc\(100vh - 48px\)[^}]*overflow-y:auto/, "Tall recipe menus must remain accessible inside the viewport");

console.log("v100.3 Shopping Overview recipe-menu viewport and button contracts passed.");
