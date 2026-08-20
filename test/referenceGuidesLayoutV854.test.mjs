import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

test("Reference Guides has an intro, larger controls, and centered topic copy", () => {
  const page = app.slice(app.indexOf("function ReferenceGuidesPage"), app.indexOf("const DISCLAIMER_ACCORDION_SECTIONS"));

  assert.match(page, /<SectionIntro/);
  assert.match(page, /title="Reference Guides"/);
  assert.match(page, /text="Choose a topic for quick kitchen measurements/);

  const marker = "/* v85.4 minor edit — Reference Guides title, larger controls, centered topics. */";
  const rules = css.slice(css.lastIndexOf(marker));
  assert.match(rules, /\.referenceGuideTopButton\s*\{[^}]*font-size:\s*clamp\(16px,\s*1\.2vw,\s*19px\)\s*!important;/s);
  assert.match(rules, /\.referenceGuidePanelHeader h2\s*\{[^}]*justify-content:\s*center\s*!important;[^}]*text-align:\s*center\s*!important;/s);
  assert.match(rules, /\.referenceGuidePanelHeader p\s*\{[^}]*text-align:\s*center\s*!important;/s);
});
