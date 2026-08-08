import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync("src/App.css", "utf8");

const strongRules =
  css.match(/\.dinnerCombinationNutritionExpanded strong\s*\{[\s\S]*?\n\}/g) || [];

assert.equal(
  strongRules.length,
  1,
  "Complete Dinner nutrition must have one authoritative green-value rule"
);
assert.ok(strongRules[0].includes("font-size: 18px !important;"));
assert.ok(strongRules[0].includes("font-weight: 700 !important;"));

const percentRule =
  (css.match(/\.dinnerCombinationNutritionExpanded em\s*\{[\s\S]*?\n\}/) || [""])[0];
assert.ok(percentRule.includes("font-size: 16px !important;"));
assert.ok(percentRule.includes("font-weight: 400 !important;"));

const noteRule =
  (css.match(/\.dinnerCombinationDailyValueNote\s*\{[\s\S]*?\n\}/) || [""])[0];
assert.ok(noteRule.includes("font-size: 16px !important;"));
assert.ok(noteRule.includes("font-weight: 400 !important;"));
assert.ok(noteRule.includes("text-align: center !important;"));

const controlRule =
  (css.match(/\.browseRecipeGrid \.recipeCardFullImage \.browseRecipeReorderedControls\s*\{[\s\S]*?\n\}/) || [""])[0];
assert.ok(controlRule.includes("padding-top: 12px !important;"));

console.log("v70b nutrition CSS consolidation and recipe-card divider layout passed");
