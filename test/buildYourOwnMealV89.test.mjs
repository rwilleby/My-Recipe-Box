import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const component = await readFile(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");
const routes = await readFile(new URL("../src/routing/seoRoutes.js", import.meta.url), "utf8");

assert.match(app, /label: "BUILD YOUR OWN MEAL", page: "Build Your Own Meal"/);
assert.match(app, /activePage === "Build Your Own Meal"/);
assert.match(app, /<BuildYourOwnMealPage/);
const noVideoStart = app.indexOf("const NO_INTRO_VIDEO_PAGES = new Set([");
const noVideoEnd = app.indexOf("]);", noVideoStart);
assert.doesNotMatch(app.slice(noVideoStart, noVideoEnd), /Build Your Own Meal/);
assert.match(routes, /"Build Your Own Meal": "\/build-your-own-meal\/"/);
assert.match(component, /mealBuilderTrayInterior/);
assert.match(component, /MealBuilderFoodImage recipe=\{mainRecipe\} position="main"/);
assert.match(component, /MealBuilderFoodImage recipe=\{sideOneRecipe\} position="side-one"/);
assert.match(component, /MealBuilderFoodImage recipe=\{sideTwoRecipe\} position="side-two"/);
assert.match(component, /<span>Freeze<\/span>/);
assert.match(styles, /\.mealBuilderTray\s*\{[^}]*aspect-ratio:\s*1448\/1086/);
assert.match(styles, /\.mealBuilderTrayFood\s*\{[^}]*top:\s*21\.0866%[^}]*height:\s*57\.6427%/);
assert.match(styles, /\.mealBuilderTrayInterior\.is-standard \.mealBuilderTrayFood-main\s*\{[^}]*width:\s*32\.5276%/);
assert.match(styles, /\.mealBuilderTrayFood-side-one\s*\{[^}]*left:\s*46\.5470%[^}]*width:\s*19\.1989%/);
assert.match(styles, /\.mealBuilderTrayFood-side-two\s*\{[^}]*left:\s*65\.8150%[^}]*width:\s*19\.8204%/);
assert.match(styles, /\.mealBuilderTrayFood img\s*\{[^}]*object-fit:\s*contain/);
assert.match(styles, /mealBuilderTrayRim/);

await access(new URL("../public/images/meal-builder/meal-builder-tray-base.webp", import.meta.url));

console.log("v89 Build Your Own Meal visual prototype contracts passed");
