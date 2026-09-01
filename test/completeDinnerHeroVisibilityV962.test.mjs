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

const catalogHeroes = completeDinners.filter((meal) =>
  heroFiles.has(`meal-${String(meal.number).padStart(3, "0")}.webp`),
);

assert.equal(catalogHeroes.length, 122, "Expected all 122 deployed Complete Dinner heroes to map to catalog meals");
assert.match(
  app,
  /legacyHero[\s\S]*images\/dinner-combinations\/meal-\$\{String\(mealNumber\)\.padStart\(3, "0"\)\}\.webp/,
  "Complete Dinner cards must try the deployed numbered hero even when an old status field is stale",
);
assert.match(
  css,
  /\.compactDinnerCardMedia img\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*object-fit:\s*contain;[^}]*object-position:\s*center top;/,
  "Compact Complete Dinner heroes must remain fully visible, full-width, and top-aligned",
);

console.log(`v96.2 Complete Dinner hero visibility contracts passed for ${catalogHeroes.length} images.`);
