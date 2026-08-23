import assert from "node:assert/strict";
import fs from "node:fs";

const component = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

assert.match(component, /BuildYourOwnMealPage\(\{[\s\S]*?recipes = \[\],[\s\S]*?openRecipeCard = \(\) => \{\}/);
assert.doesNotMatch(component, /MealChoiceStrip\(\{[\s\S]*?onOpenRecipeCard/);
assert.match(component, /className=\{`mealBuilderChoiceCard[\s\S]*?onClick=\{\(\) => onSelect\(recipe\.id\)\}/);
assert.match(component, /className="mealBuilderTrayRecipeLinks"[\s\S]*?aria-label="View selected recipe cards"/);
assert.match(component, /disabled=\{!mainRecipe\}[\s\S]*?openRecipeCard\(mainRecipe\.id\)/);
assert.match(component, /disabled=\{!sideOneRecipe \|\| sideOneDisabled\}[\s\S]*?openRecipeCard\(sideOneRecipe\.id\)/);
assert.match(component, /disabled=\{!sideTwoRecipe \|\| sideTwoDisabled\}[\s\S]*?openRecipeCard\(sideTwoRecipe\.id\)/);
assert.match(app, /<BuildYourOwnMealPage[\s\S]*?openRecipeCard=\{\(recipeId\) => openRecipeCard\(recipeId, classifiedRecipes, "Build Your Own Meal"\)\}/);
assert.match(app, /<RecipeCardViewer[\s\S]*?viewer=\{cardViewer\}[\s\S]*?onClose=\{closeRecipeCard\}/);

console.log("Meal Builder selections go directly to the tray and recipe cards open from the tray controls");
