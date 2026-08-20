import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, styles] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

assert.match(app, /items: items\.sort\(\(a, b\) => String\(a\.code\)\.localeCompare\(String\(b\.code\)[\s\S]*numeric: true/);
assert.match(app, /function pantryProductType\(/);
assert.match(app, /return "Broths & Stocks"/);
assert.match(app, /return "Soups"/);
assert.match(app, /return "Vegetables"/);
assert.match(app, /return "Sauces"/);
assert.match(app, /function pantryProductTypeColumns\(/);
assert.match(app, /const columns = \[\[\], \[\]\]/);
assert.match(app, /String\(a\.type\)\.localeCompare\(String\(b\.type\)/);
assert.match(app, /String\(a\.name\)\.localeCompare\(String\(b\.name\)/);
assert.match(app, /pantryProductTypeColumns\(group\.items, group\.group\)\.map/);
assert.match(app, /className="pantryAccordionColumn"/);
assert.match(app, /className="pantryTypeGroup"/);
assert.match(app, /<em>L\{item\.level\}<\/em>/);

const releaseStyles = styles.slice(styles.indexOf("v84.30 — PANTRY TYPE GROUPS AND COLUMN-FIRST ORDER"));
assert.match(releaseStyles, /\.pantryAccordionColumn \{[\s\S]*display: grid !important;[\s\S]*align-content: start !important;/);
assert.match(releaseStyles, /\.pantryTypeGroup h3 \{[\s\S]*text-transform: uppercase !important;/);

console.log("v84.30 Pantry grouping and Freezer code-order contracts passed.");
