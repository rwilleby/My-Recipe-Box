import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { addFreezerMonths, expandFreezerLabelQueue, normalizeFreezerLabelState, paginateFreezerLabels } from "../src/utils/freezerLabels.js";

assert.equal(addFreezerMonths("2026-09-08", 3), "2026-12-08");
assert.equal(addFreezerMonths("2026-11-30", 3), "2027-03-02");
assert.equal(normalizeFreezerLabelState({ layout: "bad", queue: "bad" }).layout, "standard");
const expanded = expandFreezerLabelQueue([{ id: "one", name: "Soup", copies: 3 }]);
assert.equal(expanded.length, 3);
assert.equal(paginateFreezerLabels(Array(9).fill({}), "standard").length, 2);
const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
assert.match(app, /FREEZER LABEL MAKER/);
assert.match(app, /activePage === "Freezer Label Maker"/);
console.log("Freezer Label Maker v98.2 tests passed.");
