import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/App.css"), "utf8");

const start = source.indexOf("function DisclaimersPage");
const end = source.indexOf("const GLP1_EDUCATION_SECTIONS", start);
const page = source.slice(start, end);

assert.ok(start >= 0, "Disclaimers page should exist");
assert.match(page, /<SectionIntro/);
assert.match(page, /className="disclaimersSectionIntro"/);
assert.match(page, /title="Disclaimers"/);
assert.doesNotMatch(page, /POLICIES, DISCLAIMERS & LEGAL INFORMATION/);
assert.match(page, /className="disclaimerAccordionList"/);
assert.match(css, /\.disclaimerAccordionList \{[\s\S]*?width: 90% !important/);
assert.match(css, /\.disclaimerAccordionSection \{[\s\S]*?background: #f4efe5 !important/);
assert.match(css, /\.disclaimerExplanationBlock\.simple p::before \{[\s\S]*?color: #7a9a3d !important/);
assert.match(css, /\.disclaimerExplanationBlock\.formal p::before \{[\s\S]*?color: #c8b99f !important/);

console.log("Disclaimers uses the centered intro, beige accordion, and two-level heart bullets.");
