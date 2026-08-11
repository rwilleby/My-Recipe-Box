import assert from "node:assert/strict";
import fs from "node:fs";
const css=fs.readFileSync("src/App.css","utf8");
const marker="/* v72.11 — supplemental framing + unassigned hero test pattern */";
const i=css.lastIndexOf(marker); assert.ok(i>=0);
const f=css.slice(i);
for(const t of[
"height: auto !important;",
"transform: scaleX(1.08) !important;",
'content: "VIDEO NOT YET ASSIGNED" !important;',
'content: "TEST PATTERN" !important;',
".largeHeroVideoStage.isUnassigned"
]) assert.ok(f.includes(t),t);
assert.ok(!f.includes("transform: scale(1.08) !important;"));
console.log("v72.11 framing/test-pattern contracts passed");
