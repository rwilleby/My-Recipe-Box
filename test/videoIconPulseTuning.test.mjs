import assert from "node:assert/strict";
import fs from "node:fs";
const css=fs.readFileSync("src/App.css","utf8");
const i=css.lastIndexOf("/* v72.5 — stronger main-video pulse + double supplemental pulse */");
assert.ok(i>=0);
const f=css.slice(i);
for (const t of ["rrbVideoPulseMainStrong","scale(1.14)","rrbVideoRays","rrbVideoPulseSupplementalDouble","4.2s ease-in-out infinite","prefers-reduced-motion"]) assert.ok(f.includes(t),t);
console.log("Video pulse tuning contracts passed");
