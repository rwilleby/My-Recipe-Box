import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  WEEKEND_LABEL_SHEET,
  createWeekendLabelEntries,
  createWeekendLabelPages,
  formatCompactLabelDate,
} from "../src/utils/weekendBulkLabels.js";

assert.equal(WEEKEND_LABEL_SHEET.labelsPerSheet, 30);
assert.equal(WEEKEND_LABEL_SHEET.columns, 3);
assert.equal(WEEKEND_LABEL_SHEET.rows, 10);
assert.equal(WEEKEND_LABEL_SHEET.labelWidth, 2.625);
assert.equal(WEEKEND_LABEL_SHEET.labelHeight, 1);

const sampleItem = {
  uid: "sample-1",
  id: "CP-101",
  title: "Slow Cooker Chicken",
  finish: "Shredded",
  package: "16oz deli container",
  labelQuantity: 4,
  createdDate: "2026-08-15",
  refrigeratorUseBy: "2026-08-19",
  freezeUseBy: "2026-11-15",
};
const entries = createWeekendLabelEntries([sampleItem]);
assert.equal(entries.length, 4);
assert.deepEqual(
  [entries[0].title, entries[0].code, entries[0].finish, entries[0].package],
  ["Slow Cooker Chicken", "CP-101", "Shredded", "16oz deli container"],
);
assert.equal(formatCompactLabelDate("2026-08-15"), "8/15/26");
assert.equal(formatCompactLabelDate(""), "—");

const partiallyUsed = createWeekendLabelPages(entries, [1, 2, 3, 5]);
assert.equal(partiallyUsed.length, 1);
assert.equal(partiallyUsed[0][0], null);
assert.equal(partiallyUsed[0][3]?.code, "CP-101");
assert.equal(partiallyUsed[0][4], null);
assert.equal(partiallyUsed[0][5]?.code, "CP-101");

const overflowEntries = Array.from({ length: 32 }, (_, index) => ({ key: `label-${index}` }));
const overflowPages = createWeekendLabelPages(overflowEntries, [1, 2]);
assert.equal(overflowPages.length, 2);
assert.equal(overflowPages[0].filter(Boolean).length, 28);
assert.equal(overflowPages[1].filter(Boolean).length, 4);

const fullUsedSheet = createWeekendLabelPages(entries, Array.from({ length: 30 }, (_, index) => index + 1));
assert.equal(fullUsedSheet.length, 1);
assert.equal(fullUsedSheet[0].filter(Boolean).length, 4);

const component = readFileSync(new URL("../src/components/WeekendBulkMealPlanner.jsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/components/WeekendBulkMealPlanner.v51.css", import.meta.url), "utf8");
for (const required of [
  "Start at label",
  "Date created",
  "Refrigerator use by",
  "Freeze use by",
  "Made {formatCompactLabelDate(entry.createdDate)} | Fridge {formatCompactLabelDate(entry.refrigeratorUseBy)} | Freeze {formatCompactLabelDate(entry.freezeUseBy)}",
]) assert.ok(component.includes(required), `Missing label UI contract: ${required}`);
for (const required of ["grid-template-columns:repeat(3,2.625in)", "grid-template-rows:repeat(10,1in)", "column-gap:.12in", "top:calc(-.05in + var(--label-offset-y))"])
  assert.ok(css.includes(required), `Missing print layout contract: ${required}`);

console.log("Weekend Bulk Plan L LIKED label tests passed.");
