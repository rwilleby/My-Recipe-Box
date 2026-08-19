import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../src/App.css", import.meta.url), "utf8");

const navStart = app.indexOf("const NAV_GROUPS = [");
const navEnd = app.indexOf("const NO_INTRO_VIDEO_PAGES", navStart);
const navSource = app.slice(navStart, navEnd);

const inventoryStart = navSource.indexOf('label: "KITCHEN INVENTORY"');
const recipesStart = navSource.indexOf('label: "OUR RECIPES"', inventoryStart);
const collectionsStart = navSource.indexOf('label: "COLLECTIONS"', recipesStart);
const kitchenStart = navSource.indexOf('label: "YOUR KITCHEN"', collectionsStart);
const shoppingStart = navSource.indexOf('label: "SHOPPING"', kitchenStart);

assert.ok(inventoryStart >= 0 && recipesStart > inventoryStart);
assert.ok(collectionsStart > recipesStart && kitchenStart > collectionsStart && shoppingStart > kitchenStart);

const inventoryMenu = navSource.slice(inventoryStart, recipesStart);
const recipeMenu = navSource.slice(recipesStart, collectionsStart);
const mealPlanningMenu = navSource.slice(kitchenStart, shoppingStart);

const inventoryItems = [
  ["MASTER KITCHEN INVENTORY", "Master Kitchen Inventory"],
  ["REFRIGERATOR INVENTORY", "Kitchen Refrigerator"],
  ["PREPARED FREEZER INVENTORY", "Prepared Freezer Inventory"],
  ["FREEZER INVENTORY MANAGEMENT", "Freezer Inventory Management"],
  ["FREEZER INVENTORY", "Kitchen Freezer"],
  ["PANTRY INVENTORY", "Pantry Staples"],
];

let previousInventoryIndex = -1;
for (const [label, page] of inventoryItems) {
  const itemPattern = new RegExp(`\\{ label: "${label}", page: "${page}"(?:, detailedOnly: true)? \\}`);
  assert.match(inventoryMenu, itemPattern, `${label} should be a non-indented Kitchen Inventory item`);
  const itemIndex = inventoryMenu.indexOf(`label: "${label}"`);
  assert.ok(itemIndex > previousInventoryIndex, `${label} should keep the requested inventory order`);
  previousInventoryIndex = itemIndex;
  assert.ok(!mealPlanningMenu.includes(`page: "${page}"`), `${label} should be removed from Meal Planning`);
}
assert.ok(!inventoryMenu.includes("level:"), "Kitchen Inventory items should not be indented");

const browseIndex = recipeMenu.indexOf('label: "BROWSE OUR RECIPE LIBRARY"');
const favoritesIndex = recipeMenu.indexOf('label: "YOUR FAVORITE RECIPES"');
const dinnerIndex = recipeMenu.indexOf('label: "DINNER COMBINATIONS"');
assert.ok(browseIndex >= 0 && favoritesIndex > browseIndex && dinnerIndex > favoritesIndex);
assert.ok(!mealPlanningMenu.includes('label: "YOUR FAVORITE RECIPES"'));
assert.equal(navSource.split('label: "YOUR FAVORITE RECIPES"').length - 1, 1);

const headerStart = app.indexOf("const headerGroups = [");
const headerEnd = app.indexOf("return (", headerStart);
const headerSource = app.slice(headerStart, headerEnd);
const expectedHeaderOrder = [
  "ABOUT US",
  "RECIPES & MEALS",
  "KITCHEN INVENTORY",
  "MEAL PLANNING",
  "SHOPPING",
  "RESOURCES",
];

let previousHeaderIndex = -1;
for (const label of expectedHeaderOrder) {
  const index = headerSource.indexOf(`label: "${label}"`);
  assert.ok(index > previousHeaderIndex, `${label} should follow the requested main-menu order`);
  previousHeaderIndex = index;
}
assert.ok(!headerSource.includes('label: "RECIPES",'));

assert.match(styles, /v83\.6 — fit the expanded six-section navigation beneath the logo/);
assert.match(styles, /gap: clamp\(10px, 2\.1vw, 32px\) !important/);
assert.match(app, /pageHasIntroVideo\(item\.page\)/, "Existing menu video indicators should remain wired");

console.log("v83.6 main-navigation reorganization contracts passed.");
