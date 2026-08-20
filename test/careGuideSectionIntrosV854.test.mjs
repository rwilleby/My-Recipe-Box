import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

test("six care guides use standard introductions outside their content boxes", () => {
  const careGuideTitles = [
    "Taking Care of and Cooking With Your Air Fryer",
    "Taking Care of and Cooking in a Gas or Electric Oven",
    "Taking Care of and Cooking in Your Microwave Oven",
    "Taking Care of and Cooking on a Gas or Electric Griddle",
    "Taking Care of and Cooking on a Gas Grill",
    "Taking Care of and Cooking on a Pellet Smoker",
  ];

  for (const title of careGuideTitles) {
    assert.match(app, new RegExp(`<SectionIntro\\s+title="${title.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}"`));
  }

  const careGuideArea = app.slice(
    app.indexOf('{activePage === "Air Fryer Recipes"'),
    app.indexOf('{activePage === "Cooking Methods"')
  );
  assert.doesNotMatch(careGuideArea, /className="gasGrillGuideKicker"/);
  assert.doesNotMatch(careGuideArea, /<header className="gasGrillGuideHeader">/);

  const marker = "/* v85.4 minor edit — move care-guide introductions outside their content boxes. */";
  const rules = css.slice(css.lastIndexOf(marker));
  assert.match(rules, /\.careGuideSectionIntro \+ \.gasGrillGuide\s*\{[^}]*margin-top:\s*0\s*!important;/s);
});
