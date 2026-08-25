import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

test("Recipe Adjustments and Food Storage use responsive supporting-page accordions", () => {
  const page = app.slice(app.indexOf("function GroceryPicksPage"), app.indexOf("function FreezerTipsPage"));

  assert.match(page, /title="Recipe Adjustments & Substitutions"/);
  assert.match(page, /function FoodStorageGuidePage/);
  assert.match(page, /title="Food Storage & Shelf-Life Guide"/);
  assert.match(page, /<details className="supportGuideAccordion"/);
  assert.match(page, /<summary>/);
  assert.match(page, /supportGuideAccordionArrow/);
  assert.match(page, /Lower-Sodium Adjustments/);
  assert.match(page, /Vegan and Plant-Based Adjustments/);
  assert.match(page, /Cooking-Method Adjustments/);
  assert.match(page, /Nutrition and Medical Note/);
  assert.match(page, /Quick Storage Reference/);
  assert.match(page, /Safe Thawing Methods/);
  assert.match(page, /Never thaw on the counter/);
  assert.match(page, /When in doubt/);
  assert.match(page, /USDA and FoodSafety\.gov/);

  const marker = "/* v94 supporting guides: warm, compact, responsive card accordions. */";
  const rules = css.slice(css.lastIndexOf(marker));
  assert.match(rules, /\.supportGuideAccordion\s*\{/);
  assert.match(rules, /grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(rules, /@media \(max-width: 900px\)/);
  assert.match(rules, /@media \(max-width: 620px\)/);
});
