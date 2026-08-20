import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

test("Cooking Tools uses a titled category accordion layout", () => {
  const page = app.slice(app.indexOf("function ProductsIUsePage"), app.indexOf("function RecommendationsPage"));

  assert.match(page, /<SectionIntro/);
  assert.match(page, /title="Cooking Tools, Storage & Organization"/);
  assert.match(page, /text="Browse practical kitchen products organized by category/);
  assert.match(page, /const productGroups = PRODUCT_CATEGORIES/);
  assert.match(page, /<details className="productsCategoryAccordion"/);
  assert.match(page, /group\.products\.map/);
  assert.doesNotMatch(page, /productsCategoryToolbar/);

  const marker = "/* v85.4 minor edit — category accordions for Cooking Tools. */";
  const rules = css.slice(css.lastIndexOf(marker));
  assert.match(rules, /\.productsAccordionList\s*\{[^}]*width:\s*90%\s*!important;/s);
});
