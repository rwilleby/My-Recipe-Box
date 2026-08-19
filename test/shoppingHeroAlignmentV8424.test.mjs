import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const styles = await readFile(new URL("../src/App.css", import.meta.url), "utf8");

const finalStart = styles.lastIndexOf(
  "v84.24 — HERO-ALIGNED SHOPPING COMMAND STRIP",
);
const priorStart = styles.lastIndexOf(
  "v84.23 — FINAL TWO-LINE LABELS FOR A NARROWER ONE-ROW STRIP",
);
assert.ok(finalStart > priorStart);

const finalStyles = styles.slice(finalStart);
assert.match(
  finalStyles,
  /\.shoppingListIntroActions \{[\s\S]*width: 90% !important;[\s\S]*max-width: 90% !important;/,
);
assert.match(finalStyles, /margin: 0 auto 18px !important/);
assert.match(finalStyles, /minmax\(160px, 1\.32fr\)/);
assert.match(finalStyles, /minmax\(226px, 1\.65fr\) !important/);
assert.match(
  finalStyles,
  /\.shoppingCommandCounters\.preparedInventorySummary \{[\s\S]*min-width: 226px !important;[\s\S]*repeat\(4, minmax\(51px, 1fr\)\)/,
);
assert.match(
  finalStyles,
  /@media \(max-width: 900px\)[\s\S]*width: 96% !important;[\s\S]*min-width: 760px !important;/,
);

console.log("v84.24 Shopping List hero-alignment contracts passed.");
