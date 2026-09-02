import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { categories, recipes } from "../src/data/recipes.js";
import { HOLIDAY_SPECIAL_RECIPE_MANIFEST } from "../src/data/holidaySpecialRecipes.js";
import { HOLIDAY_OCCASION_MENUS } from "../src/data/holidayOccasionMenus.js";
import { fullCardImageCandidates, recipeHeroImageCandidates } from "../src/features/recipe-viewer/recipeAssets.js";

const expectedOccasions = [
  "New Year’s Day", "Valentine’s Day", "Mardi Gras", "St. Patrick’s Day", "Passover", "Easter",
  "Cinco de Mayo", "Mother’s Day", "Memorial Day", "Father’s Day", "Independence Day", "Labor Day",
  "Rosh Hashanah", "Halloween", "Thanksgiving", "Hanukkah", "Christmas Eve", "Christmas Day", "New Year’s Eve",
];

assert.equal(HOLIDAY_SPECIAL_RECIPE_MANIFEST.length, 30);
assert.deepEqual(HOLIDAY_SPECIAL_RECIPE_MANIFEST.map(({ code }) => code), Array.from({ length: 30 }, (_, i) => `HS-${String(i + 1).padStart(3, "0")}`));
assert.equal(new Set(HOLIDAY_SPECIAL_RECIPE_MANIFEST.map(({ code }) => code)).size, 30);
assert.equal(categories.find(({ id }) => id === "HS")?.name, "Special Holiday Recipes");
assert.equal(categories.find(({ id }) => id === "HS")?.count, 30);

const preexisting = recipes.filter(({ categoryCode }) => categoryCode !== "HS");
for (const source of HOLIDAY_SPECIAL_RECIPE_MANIFEST) {
  const recipe = recipes.find(({ id }) => id === source.code);
  assert.ok(recipe, `${source.code} must be registered`);
  assert.equal(recipe.title, source.title);
  assert.equal(recipe.category, source.category);
  assert.equal(recipe.occasion, source.occasion);
  assert.equal(recipe.ribbon, source.ribbon);
  assert.equal(recipe.description, source.ribbon);
  assert.equal(recipe.servings, source.servings);
  assert.deepEqual(recipe.ingredients.map(({ sourceText }) => sourceText), source.ingredients);
  assert.deepEqual(recipe.directions, source.directions);
  assert.ok(existsSync(`public/images/recipes/${source.code}.webp`));
  assert.ok(existsSync(`public/images/heroes/${source.code}.webp`));
  assert.equal(fullCardImageCandidates(recipe)[0], `images/recipes/${source.code}.webp`);
  assert.equal(recipeHeroImageCandidates(recipe)[0], `images/heroes/${source.code}.webp`);
  assert.equal(preexisting.some(({ title }) => title === source.title), false, `${source.title} must not duplicate an existing title`);
}

assert.deepEqual(HOLIDAY_OCCASION_MENUS.map(({ occasion }) => occasion), expectedOccasions);
assert.equal(HOLIDAY_OCCASION_MENUS.length, 19);
const allMenuIds = [];
for (const menu of HOLIDAY_OCCASION_MENUS) {
  assert.equal(menu.dishes.length, 3, `${menu.occasion} must have three dishes`);
  assert.deepEqual(menu.dishes.map(({ role }) => role), ["Main Dish", "Side 1", "Side 2"]);
  for (const dish of menu.dishes) {
    allMenuIds.push(dish.recipeId);
    assert.ok(recipes.some(({ id }) => id === dish.recipeId), `${menu.occasion}: ${dish.name} must resolve to ${dish.recipeId}`);
  }
}
for (const code of HOLIDAY_SPECIAL_RECIPE_MANIFEST.map(({ code }) => code)) {
  assert.ok(allMenuIds.includes(code), `${code} must be connected to a holiday menu`);
}
const explicitExistingMappings = {
  "Smothered Pork Chops": "AM-048", "Black-Eyed Peas": "CP-170", "Roasted Asparagus": "SD-030",
  "Corned Beef and Cabbage": "CP-042", "Brown Sugar–Glazed Ham": "AM-013", "Scalloped Potatoes": "SD-017",
  "Chicken Enchiladas": "MX-007", "Mexican Rice": "MX-013", "Mustard Potato Salad": "SD-023",
  "Baked Beans": "SD-001", "Green Bean Casserole": "CP-162",
};
for (const dish of HOLIDAY_OCCASION_MENUS.flatMap(({ dishes }) => dishes)) {
  if (explicitExistingMappings[dish.name]) assert.equal(dish.recipeId, explicitExistingMappings[dish.name]);
}

const app = readFileSync("src/App.jsx", "utf8");
const holidayPage = app.slice(app.indexOf("function HolidaysSpecialOccasionsPage"), app.indexOf("function FreezerTipsPage"));
assert.match(holidayPage, /holidayOccasionTileImage[\s\S]*?<RecipeHeroImage recipe=\{menuMainRecipe\}/);
assert.match(holidayPage, /holidayMenuDishHero[\s\S]*?<RecipeHeroImage recipe=\{dishRecipe\}/);
assert.doesNotMatch(holidayPage, /FullRecipeCardPreview|RecipeImage|images\/recipes\//);
assert.match(holidayPage, /openRecipeCard\(dish\.recipeId, recipes, "Holidays and Special Occasions"\)/);
assert.match(holidayPage, /next\[firstOpenSlot\] = \[\.\.\.availableRecipeIds\]/);
console.log("Holiday Special Recipe registration and menu contracts passed.");

