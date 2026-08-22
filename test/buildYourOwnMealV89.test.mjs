import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const component = await readFile(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");
const routes = await readFile(new URL("../src/routing/seoRoutes.js", import.meta.url), "utf8");

assert.match(app, /label: "BUILD YOUR OWN MEAL", page: "Build Your Own Meal"/);
assert.match(app, /activePage === "Build Your Own Meal"/);
assert.match(app, /<BuildYourOwnMealPage/);
assert.match(routes, /"Build Your Own Meal": "\/build-your-own-meal\/"/);
assert.match(component, /mealBuilderTrayInterior/);
assert.match(component, /MealBuilderFoodImage recipe=\{mainRecipe\} position="main"/);
assert.match(component, /MealBuilderFoodImage recipe=\{sideOneRecipe\} position="side-one"/);
assert.match(component, /MealBuilderFoodImage recipe=\{sideTwoRecipe\} position="side-two"/);
assert.match(component, /<span>Freeze<\/span>/);
assert.match(styles, /grid-template-columns: 40% 30% 30%/);
assert.match(styles, /mealBuilderTrayRim/);

await access(new URL("../public/images/meal-builder/meal-builder-tray-base.webp", import.meta.url));

console.log("v89 Build Your Own Meal visual prototype contracts passed");
