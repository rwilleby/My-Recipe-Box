import assert from "node:assert/strict";import fs from "node:fs";
const c=fs.readFileSync("src/App.css","utf8"),a=fs.readFileSync("src/App.jsx","utf8");
assert.equal((a.match(/homeHeroModeControls/g)||[]).length,1);
const m="/* v73.3 — HOME ONLY: force Easy/Detailed to exact PREV/NEXT dimensions */";
const i=c.lastIndexOf(m);assert.ok(i>=0);const f=c.slice(i);
for(const t of["width: 58px !important;","height: 28px !important;",".pageSequencePrev",".pageSequenceNext","object-fit: fill !important;"])assert.ok(f.includes(t),t);
console.log("v73.3 exact Home control sizing passed");