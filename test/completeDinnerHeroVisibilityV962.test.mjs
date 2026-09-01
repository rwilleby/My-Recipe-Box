import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { completeDinners } from "../src/data/completeDinners.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/App.css"), "utf8");
const heroDirectory = path.join(root, "public/images/dinner-combinations");
const heroFiles = new Set(fs.readdirSync(heroDirectory));

const deployedCatalogHeroes = completeDinners.filter((meal) =>
  heroFiles.has(`meal-${String(meal.number).padStart(3, "0")}.webp`),
);
const approvedCatalogHeroes = completeDinners.filter((meal) =>
  ["approved", "published"].includes(String(meal.hero?.status || "").toLowerCase()),
);

assert.equal(deployedCatalogHeroes.length, 131, "Expected 131 deployed Complete Dinner hero files");
assert.equal(approvedCatalogHeroes.length, 122, "Expected 122 recipe-to-image verified Complete Dinner heroes");

const expectedHiddenMeals = new Set([
  ...Array.from({ length: 9 }, (_, index) => index + 103),
  ...Array.from({ length: 20 }, (_, index) => index + 132),
]);
const hiddenCatalogHeroes = completeDinners.filter((meal) =>
  !["approved", "published"].includes(String(meal.hero?.status || "").toLowerCase()),
);

assert.deepEqual(
  hiddenCatalogHeroes.map((meal) => meal.number),
  [...expectedHiddenMeals],
  "Only the 29 unaudited Complete Dinner heroes may remain hidden",
);

for (const meal of approvedCatalogHeroes) {
  assert.ok(
    heroFiles.has(`meal-${String(meal.number).padStart(3, "0")}.webp`),
    `Approved Complete Dinner Meal ${meal.number} must have a deployed hero file`,
  );
}
assert.match(
  app,
  /RFIS approval is the recipe-to-image verification gate[\s\S]*return rfisPlatform\.heroes\.candidates\(meal, \{ variant \}\);/,
  "Complete Dinner cards must not attach legacy numbered images to unrelated current recipes",
);
assert.match(
  css,
  /\.compactDinnerCardMedia img\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*object-fit:\s*contain;[^}]*object-position:\s*center top;/,
  "Compact Complete Dinner heroes must remain fully visible, full-width, and top-aligned",
);
assert.match(
  css,
  /\.dinnerRecipePopupItem > button \.dinnerRecipeTileMbCircle\s*\{color:\s*#fff\s*!important;\}/,
  "Recipe-card MealBalance circle numbers must stay white inside recipe buttons",
);

console.log(`v96.3 Complete Dinner hero verification passed: ${approvedCatalogHeroes.length} approved heroes; ${hiddenCatalogHeroes.length} unaudited meals hidden.`);
