import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

assert.doesNotMatch(app, /pageSequencePrev/);
assert.doesNotMatch(app, /pageSequenceNext/);
assert.doesNotMatch(app, /showSequenceButtons/);
assert.doesNotMatch(app, /Go to previous menu page/);
assert.doesNotMatch(app, /Go to next menu page/);
assert.match(app, /className="pageSequenceButton homeWelcomeTourIconButton"/);

console.log("v88.1 PREV/NEXT removal contract passed.");
