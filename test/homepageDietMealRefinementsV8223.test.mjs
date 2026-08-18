import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const app = fs.readFileSync("src/App.jsx", "utf8");
const rotations = fs.readFileSync("src/features/home/HomeMealRotations.jsx", "utf8");
const css = fs.readFileSync("src/App.css", "utf8");

const dietCardStart = rotations.indexOf("function HomeDietMealCardButton");
const dietCardEnd = rotations.indexOf("function HomeDietMealCrossfadeCard");
const dietCard = rotations.slice(dietCardStart, dietCardEnd);

assert.ok(dietCard.includes("images/heroes/${recipe.id}.webp"), "Diet Meal cards must use full TRAY heroes");
assert.ok(dietCard.includes('className="homeDietMealTrayImage"'), "Diet Meal tray-image hook is missing");
assert.ok(!dietCard.includes("<RecipeImage"), "Diet Meal cards must not use recipe-card thumbnails");

for (let recipeNumber = 1; recipeNumber <= 60; recipeNumber += 1) {
  const code = `DM-${String(recipeNumber).padStart(3, "0")}`;
  assert.ok(
    fs.existsSync(path.join("public/images/heroes", `${code}.webp`)),
    `Missing TRAY hero for ${code}`
  );
}

for (const token of [
  "v82.23 — HOMEPAGE DIET MEAL CARDS, GUTTERS, AND QUICK LINKS",
  ".homeDietMealImage .homeDietMealTrayImage",
  "padding-top: 18px !important;",
  ".homeDietMealText strong",
  "-webkit-line-clamp: 3 !important;",
  "height: clamp(78px, 7vw, 96px) !important;",
]) {
  assert.ok(css.includes(token), `Missing v82.23 Diet Meal style: ${token}`);
}

const dietStripBlocks = [...css.matchAll(/\.homeDietMealStrip\s*\{([^}]*)\}/g)].map((match) => match[1]);
assert.ok(dietStripBlocks.length >= 1, "Diet Meal strip styles are missing");
assert.ok(
  dietStripBlocks.every((block) => !/margin-top:\s*clamp\(/.test(block)),
  "Diet Meal strip must not retain the oversized margin"
);
assert.ok(
  dietStripBlocks.some((block) => /margin-top:\s*0\s*!important/.test(block)),
  "Diet Meal strip must use the equalized zero margin"
);

const finalCascade = css.slice(css.lastIndexOf("v82.23 final cascade"));
for (const token of [
  ".homeCategorySection",
  ".homeCategoryGrid",
  "grid-auto-flow: row !important;",
  "overflow-x: hidden !important;",
  "scrollbar-width: none !important;",
  ".homeCategoryGrid::-webkit-scrollbar",
  "display: none !important;",
]) {
  assert.ok(finalCascade.includes(token), `Quick Links slider-removal contract missing: ${token}`);
}

console.log("Homepage Diet Meal refinements v82.23 tests passed");
