import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");
const rotations = fs.readFileSync(
  new URL("../src/features/home/HomeMealRotations.jsx", import.meta.url),
  "utf8"
);

const canonicalStart = css.lastIndexOf("v88 — CANONICAL HOMEPAGE MEAL-HERO FRAME");
assert.ok(canonicalStart >= 0, "v88 canonical homepage meal-hero frame is present");

const canonicalCss = css.slice(canonicalStart);
assert.match(canonicalCss, /aspect-ratio:\s*4\s*\/\s*3\s*!important/);
assert.match(canonicalCss, /object-fit:\s*cover\s*!important/);
assert.match(canonicalCss, /object-position:\s*center center\s*!important/);
assert.match(canonicalCss, /transform:\s*none\s*!important/);
assert.doesNotMatch(canonicalCss, /scale(?:X|Y)?\s*\(/);

assert.match(rotations, /homeComboMealCalories/);
assert.match(rotations, /homeDietMealMeta/);
assert.match(rotations, /Math\.round\(calories\).*calories/);

console.log("v88 homepage meal-card image frame and calorie contracts passed.");
