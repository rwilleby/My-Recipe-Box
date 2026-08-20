import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");

test("GLP-1 privacy note uses centered white type on dark beige", () => {
  const marker = "/* v85.4 minor edit — dark beige privacy panel. */";
  const rules = css.slice(css.lastIndexOf(marker));

  assert.match(rules, /\.glp1EducationPrivacyNote\s*\{[^}]*background:\s*var\(--rrb-inventory-beige,\s*#a59e99\)\s*!important;[^}]*color:\s*#ffffff\s*!important;[^}]*text-align:\s*center\s*!important;/s);
  assert.match(rules, /\.glp1EducationPrivacyNote strong,[\s\S]*\.glp1EducationPrivacyNote p\s*\{[^}]*color:\s*#ffffff\s*!important;[^}]*text-align:\s*center\s*!important;/s);
});
