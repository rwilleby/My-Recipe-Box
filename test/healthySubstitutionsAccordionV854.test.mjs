import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

test("Healthy Substitutions uses a full-width top and 90% accordions", () => {
  const page = app.slice(app.indexOf("function GroceryPicksPage"), app.indexOf("function FreezerTipsPage"));

  assert.match(page, /title="Healthy Substitutions"/);
  assert.match(page, /<details className="groceryReferenceAccordion"/);
  assert.match(page, /<summary>/);
  assert.match(page, /groceryReferenceAccordionArrow/);

  const marker = "/* v85.4 minor edit — Healthy Substitutions full-width header and 90% accordions. */";
  const rules = css.slice(css.lastIndexOf(marker));
  assert.match(rules, /\.groceryPicksPage\s*\{[^}]*width:\s*100%\s*!important;/s);
  assert.match(rules, /\.groceryPicksPage \.groceryReferenceGrid\s*\{[^}]*width:\s*90%\s*!important;/s);
});
