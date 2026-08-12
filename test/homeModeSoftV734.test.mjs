import assert from "node:assert/strict";import fs from "node:fs";
const c=fs.readFileSync("src/App.css","utf8"),a=fs.readFileSync("src/App.jsx","utf8");
assert.equal((a.match(/homeHeroModeControls/g)||[]).length,1);
const marker="/* v73.4 — HOME ONLY: Easy/Detailed smaller + softer */";
const i=c.lastIndexOf(marker);assert.ok(i>=0);const f=c.slice(i);
for(const t of[
"width: 39px !important;",
"height: 19px !important;",
"opacity: .82 !important;",
"filter: saturate(.72) brightness(1.06) !important;"
]) assert.ok(f.includes(t),t);
console.log("v73.4 Home Easy/Detailed smaller + softer passed");
