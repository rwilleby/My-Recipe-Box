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

assert.equal(deployedCatalogHeroes.length, 122, "Expected 122 legacy or current Complete Dinner hero files");
assert.equal(approvedCatalogHeroes.length, 35, "Expected 35 recipe-to-image verified Complete Dinner heroes");
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

console.log(`v96.3 Complete Dinner hero verification passed: ${approvedCatalogHeroes.length} current heroes; ${deployedCatalogHeroes.length - approvedCatalogHeroes.length} legacy files withheld.`);
