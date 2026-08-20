import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/App.css"), "utf8");

const start = source.indexOf("function NutritionStandardsPage");
const end = source.indexOf("function ", start + 9);
const page = source.slice(start, end);

assert.ok(start >= 0, "Nutrition Standards page should exist");
assert.match(page, /<SectionIntro/);
assert.match(page, /className="nutritionStandardsIntro"/);
assert.match(page, /title="Practical nutrition information to help you make informed choices\."/);
assert.doesNotMatch(page, /PRACTICAL • CONSISTENT • TRANSPARENT/);
assert.match(css, /--rrb-section-intro-title-size: 25px/);
assert.match(css, /--rrb-section-intro-copy-size: 14px/);
assert.match(css, /\.nutritionStandardsIntro \{margin: 0 auto var\(--rrb-section-intro-bottom-gap, 18px\) !important;\}/);

console.log("Nutrition Standards uses the established centered section-intro style.");
