import assert from "node:assert/strict";
import fs from "node:fs";

const styles = fs.readFileSync(new URL("../src/App.css", import.meta.url), "utf8");
const finalStyles = styles.slice(styles.lastIndexOf("v84.35 — UNIFIED CENTERED PANTRY LEVEL SUMMARIES"));

assert.match(finalStyles, /\.pantryLevelSummary-1,[\s\S]*\.pantryLevelSummary-2,[\s\S]*\.pantryLevelSummary-3 \{[\s\S]*flex-direction: column !important;[\s\S]*align-items: center !important;[\s\S]*gap: 4px !important;/);
assert.match(finalStyles, /\.pantryLevelSummary > span \{[\s\S]*margin-top: 0 !important;[\s\S]*line-height: 1\.15 !important;/);
assert.match(finalStyles, /\.pantryLevelSummary > div p,[\s\S]*\.pantryLevelSummary > span \{[\s\S]*text-align: center !important;/);

console.log("v84.35 Pantry summary alignment contracts passed.");
