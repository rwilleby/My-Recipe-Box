import assert from "node:assert/strict";
import fs from "node:fs";

const component = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

assert.match(component, /BuildYourOwnMealPage\(\{[\s\S]*?recipes = \[\],[\s\S]*?openRecipeCard = \(\) => \{\}/);
assert.match(component, /MealChoiceStrip\(\{[\s\S]*?onOpenRecipeCard/);
assert.match(component, /onClick=\{\(\) => \{\s*onSelect\(recipe\.id\);\s*onOpenRecipeCard\(recipe\.id\);\s*\}\}/);
assert.match(component, /label="Main Dish"[\s\S]*?onOpenRecipeCard=\{openRecipeCard\}/);
assert.match(component, /label="Side 1"[\s\S]*?onOpenRecipeCard=\{openRecipeCard\}/);
assert.match(component, /label="Side 2"[\s\S]*?onOpenRecipeCard=\{openRecipeCard\}/);
assert.match(app, /<BuildYourOwnMealPage[\s\S]*?openRecipeCard=\{\(recipeId\) => openRecipeCard\(recipeId, classifiedRecipes, "Build Your Own Meal"\)\}/);
assert.match(app, /<RecipeCardViewer[\s\S]*?viewer=\{cardViewer\}[\s\S]*?onClose=\{closeRecipeCard\}/);

console.log("Meal Builder recipe selections open the existing recipe-card popup and remain selected");
