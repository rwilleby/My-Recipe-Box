import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

test("Food Safety uses the titled 90% accordion with heart bullets", () => {
  const page = app.slice(
    app.indexOf('{activePage === "Safe Cooking Rules"'),
    app.indexOf('{activePage === "Your Data & Security"')
  );

  assert.match(page, /title="Food Safety Guide"/);
  assert.match(page, /text="Open a topic below for practical guidance/);
  assert.match(page, /className="foodSafetyAccordionItem"/);
  assert.doesNotMatch(page, /Click the title to select your guide/);

  const marker = "/* v85.4 minor edit — established Food Safety accordion and heart bullets. */";
  const rules = css.slice(css.lastIndexOf(marker));
  assert.match(rules, /\.foodSafetyAccordion\s*\{[^}]*width:\s*90%\s*!important;/s);
  assert.match(rules, /\.foodSafetyAccordionContent > p::before[\s\S]*color:\s*#7a9a3d\s*!important;/);
  assert.match(rules, /\.foodSafetyAccordionContent h4 \+ p::before,[\s\S]*color:\s*#c8b99f\s*!important;/);
});
