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
assert.match(ruleFor(".mealBuilderWorkspaceGrid"), /grid-template-columns\s*:\s*minmax\(0,\.76fr\) minmax\(0,1fr\)/);
assert.match(ruleFor(".mealBuilderWorkspaceGrid"), /column-gap\s*:\s*58px/);
assert.match(ruleFor(".mealBuilderPreviewColumn"), /grid-template-rows\s*:\s*auto 36px auto/);
assert.match(ruleFor(".mealBuilderPreviewColumn .mealBuilderTrayPrimary"), /aspect-ratio\s*:\s*1448\/1086/);
assert.match(ruleFor(".mealBuilderPreviewColumn"), /display\s*:\s*grid/);
assert.match(ruleFor(".mealBuilderTrayRecipeLinks"), /grid-template-columns\s*:\s*repeat\(3/);
assert.match(ruleFor(".mealBuilderSelectorColumns"), /grid-template-columns\s*:\s*repeat\(3/);

assert.match(ruleFor(".mealBuilderTray"), /aspect-ratio\s*:\s*1448\s*\/\s*1086/);
assert.match(ruleFor(".mealBuilderTrayBase"), /object-fit\s*:\s*contain/);
assert.match(ruleFor(".mealBuilderTrayFood"), /top\s*:\s*21\.0866%/);
assert.match(ruleFor(".mealBuilderTrayFood"), /height\s*:\s*57\.6427%/);
assert.match(ruleFor(".mealBuilderTrayFood-main"), /left\s*:\s*13\.9503%/);
assert.match(ruleFor(".mealBuilderTrayInterior.is-standard .mealBuilderTrayFood-main"), /width\s*:\s*32\.5276%/);
assert.match(ruleFor(".mealBuilderTrayInterior.is-two-thirds .mealBuilderTrayFood-main"), /width\s*:\s*51\.7956%/);
assert.match(ruleFor(".mealBuilderTrayInterior.is-full-tray .mealBuilderTrayFood-main"), /width\s*:\s*71\.6851%/);
assert.match(ruleFor(".mealBuilderTrayFood-side-one"), /left\s*:\s*46\.5470%/);
assert.match(ruleFor(".mealBuilderTrayFood-side-one"), /width\s*:\s*19\.1989%/);
assert.match(ruleFor(".mealBuilderTrayFood-side-two"), /left\s*:\s*65\.8150%/);
assert.match(ruleFor(".mealBuilderTrayFood-side-two"), /width\s*:\s*19\.8204%/);
assert.match(ruleFor(".mealBuilderTrayFood img"), /object-fit\s*:\s*contain/);
assert.doesNotMatch(ruleFor(".mealBuilderTrayFood img"), /object-fit\s*:\s*cover/);
assert.match(ruleFor(".mealBuilderTrayFood-side-two img"), /width\s*:\s*96\.8641%/);

const expectedPortableSides = Array.from({ length: 53 }, (_, index) => `SD-${String(index + 1).padStart(3, "0")}.webp`);
const sideDirectory = new URL("../public/images/meal-builder/sides/", import.meta.url);
for (const fileName of expectedPortableSides) {
  const bytes = fs.readFileSync(new URL(fileName, sideDirectory));
  assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF", `${fileName} must be a genuine WebP`);
  assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP", `${fileName} must be a genuine WebP`);
}

assert.match(component, /MealChoiceStrip label="Main Dish"/);
assert.match(component, /MealChoiceStrip label="Side 1"/);
assert.match(component, /MealChoiceStrip label="Side 2"/);

console.log("v89.30 Meal Builder uses the 1448×1086 coordinate system and all 53 portable side assets");
