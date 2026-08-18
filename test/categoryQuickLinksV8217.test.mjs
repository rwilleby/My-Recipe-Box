import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const nutrition = JSON.parse(
  await readFile(new URL("../src/data/nutrition/DM.json", import.meta.url), "utf8"),
);

assert.match(
  app,
  /"AM",\s*"AS",\s*"IT",\s*"MX",\s*"SF",\s*"DM",\s*"QP",\s*"CS",\s*"CP",\s*"SB",\s*"SG",\s*"SD",\s*"DS"/,
);
assert.match(app, /HOME_CATEGORY_CODES\.slice\(0, 13\)/);
assert.match(app, /const isActive = Boolean\(/);
assert.match(app, /const nextCategory = isActive \? "" : category\?\.name \|\| ""/);
assert.doesNotMatch(app, /className="browseCategoryQuickFilterAll"/);
assert.match(app, /nutrition\?\.servingSize \|\| "1 serving"/);
assert.match(app, /nutrition\?\.servingsPerRecipe \?\? recipe\.servings/);

assert.match(css, /grid-template-columns:\s*repeat\(14, minmax\(0, 1fr\)\) !important/);
assert.match(css, /grid-template-columns:\s*repeat\(13, minmax\(0, 1fr\)\) !important/);
assert.match(css, /column-gap:\s*clamp\(2px, \.3vw, 6px\) !important/);

assert.equal(nutrition.length, 60);
assert.equal(nutrition[0].recipeCode, "DM-001");
assert.equal(nutrition[0].variants["one-meal"].nutritionFacts.calories, 265);
assert.equal(nutrition[0].variants["one-meal"].nutritionFacts.servingsPerRecipe, 4);

console.log("Diet Meals nutrition display and shared category quick links v82.17 tests passed.");
