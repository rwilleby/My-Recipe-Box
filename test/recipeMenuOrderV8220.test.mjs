import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const recipesStart = app.indexOf('label: "OUR RECIPES"');
const collectionsStart = app.indexOf('label: "COLLECTIONS"', recipesStart);
const kitchenStart = app.indexOf('label: "YOUR KITCHEN"', collectionsStart);

assert.ok(recipesStart >= 0 && collectionsStart > recipesStart && kitchenStart > collectionsStart);

const recipeMenu = app.slice(recipesStart, collectionsStart);
const collectionsMenu = app.slice(collectionsStart, kitchenStart);
const expectedOrder = [
  "VEGAN RECIPE LIBRARY",
  "DINNER COMBINATIONS",
  "HEALTHY DINNERS",
  "SALAD JAR LUNCHES",
  "SLOW COOKER MEALS",
  "HOLIDAYS AND SPECIAL OCCASIONS",
];

let previousIndex = -1;
for (const label of expectedOrder) {
  const index = recipeMenu.indexOf(`label: "${label}"`);
  assert.ok(index > previousIndex, `${label} must follow ${expectedOrder[Math.max(0, expectedOrder.indexOf(label) - 1)]}`);
  previousIndex = index;
}

for (const label of expectedOrder.slice(1)) {
  assert.match(
    recipeMenu,
    new RegExp(`\\{ label: "${label}", page: "[^"]+" \\}`),
    `${label} must be a non-indented top-level menu item`,
  );
  assert.ok(!collectionsMenu.includes(`label: "${label}"`), `${label} must be removed from Collections`);
  assert.equal(app.split(`label: "${label}"`).length - 1, 1, `${label} must appear once in NAV_GROUPS`);
}

console.log("Recipe menu top-level order v82.20 tests passed.");
