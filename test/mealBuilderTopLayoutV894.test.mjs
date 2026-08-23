import assert from "node:assert/strict";
import fs from "node:fs";

const component = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");

function ruleFor(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  assert.ok(match, `Expected ${selector} to have a CSS rule`);
  return match[1];
}

const workspaceStart = component.indexOf('<div className="mealBuilderWorkspaceGrid">');
const trayPosition = component.indexOf("<MealBuilderTrayPreview", workspaceStart);
const recipeLinksPosition = component.indexOf('className="mealBuilderTrayRecipeLinks"', workspaceStart);
const summaryPosition = component.indexOf('className="mealBuilderMealSummaryCard"', workspaceStart);
const selectorsPosition = component.indexOf('className="mealBuilderDishSelectors"', workspaceStart);

assert.ok(workspaceStart >= 0, "Meal Builder workspace must exist");
assert.ok(trayPosition > workspaceStart, "Tray must be inside the Meal Builder workspace");
assert.ok(recipeLinksPosition > trayPosition, "Recipe-card controls must follow the tray");
assert.ok(summaryPosition > recipeLinksPosition, "Calories and portion plan must follow the tray recipe controls");
assert.ok(selectorsPosition > summaryPosition, "Dish selectors must remain the workspace's second column");

assert.match(ruleFor(".mealBuilderWorkspaceGrid"), /display\s*:\s*grid/);
assert.match(ruleFor(".mealBuilderWorkspaceGrid"), /grid-template-columns\s*:\s*repeat\(2/);
assert.match(ruleFor(".mealBuilderPreviewColumn"), /display\s*:\s*grid/);
assert.match(ruleFor(".mealBuilderTrayRecipeLinks"), /grid-template-columns\s*:\s*repeat\(3/);
assert.match(ruleFor(".mealBuilderSelectorColumns"), /grid-template-columns\s*:\s*repeat\(3/);

assert.match(component, /MealChoiceStrip label="Main Dish"/);
assert.match(component, /MealChoiceStrip label="Side 1"/);
assert.match(component, /MealChoiceStrip label="Side 2"/);

console.log("Meal Builder top layout preserves the current structural contract without brittle pixel snapshots");
