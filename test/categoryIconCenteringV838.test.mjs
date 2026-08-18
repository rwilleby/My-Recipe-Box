import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const styles = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
const finalCenteringStart = styles.lastIndexOf("v83.8 — FINAL HORIZONTAL CENTERING FOR CATEGORY ICON ROWS");
const olderFinalCascade = styles.lastIndexOf("v82.23 final cascade");

assert.ok(finalCenteringStart > olderFinalCascade, "v83.8 centering must follow older final-cascade overrides");
const centering = styles.slice(finalCenteringStart);

assert.match(centering, /\.homeCategoryGrid,[\s\S]*grid-template-columns: repeat\(10, minmax\(50px, 70px\)\) !important/);
assert.match(centering, /\.homeCategoryGrid > :nth-child\(11\),[\s\S]*grid-column: 4 !important/);
assert.match(centering, /\.browseCategoryQuickFilterRow \{[\s\S]*grid-template-columns: repeat\(10, minmax\(50px, 70px\)\) !important/);
assert.match(centering, /\.browseCategoryQuickFilterRow > :nth-child\(11\) \{[\s\S]*grid-column: 4 !important/);
assert.equal((centering.match(/justify-content: center !important/g) || []).length, 2);
assert.equal((centering.match(/margin-left: auto !important/g) || []).length, 2);
assert.equal((centering.match(/margin-right: auto !important/g) || []).length, 2);

console.log("v83.8 category-icon horizontal-centering contracts passed.");
