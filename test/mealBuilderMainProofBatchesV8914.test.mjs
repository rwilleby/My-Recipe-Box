import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "src/components/BuildYourOwnMealPage.jsx"), "utf8");
const registryStart = source.indexOf("const MEAL_BUILDER_MAIN_IDS");
const registryEnd = source.indexOf("const MEAL_BUILDER_LABEL_SHEETS");
assert.ok(registryStart >= 0 && registryEnd > registryStart, "Meal Builder main registry must be present");

const registrySource = source.slice(registryStart, registryEnd).replaceAll("export ", "");
const registry = vm.runInNewContext(`(() => { ${registrySource}; return {
  mainIds: [...MEAL_BUILDER_MAIN_IDS],
  fullCanvasMainIds: [...MEAL_BUILDER_FULL_CANVAS_MAIN_IDS],
  layouts: [...MEAL_BUILDER_MAIN_LAYOUTS],
}; })()`);

const mainIds = new Set(registry.mainIds);
const fullCanvasMainIds = new Set(registry.fullCanvasMainIds);
const layouts = new Map(registry.layouts);
const expectedStandardIds = new Set([
  "AS-022", "AS-023", "AS-024",
  ...Array.from({ length: 21 }, (_, index) => `AS-${String(index + 1).padStart(3, "0")}`),
  ...Array.from({ length: 180 }, (_, index) => `CP-${String(index + 1).padStart(3, "0")}`),
  ...Array.from({ length: 60 }, (_, index) => `IT-${String(index + 1).padStart(3, "0")}`),
  ...Array.from({ length: 20 }, (_, index) => `SF-${String(index + 1).padStart(3, "0")}`),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 21, 22, 23, 24, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]
    .map((number) => `MX-${String(number).padStart(3, "0")}`),
]);
const expectedFullTrayIds = new Set(
  Array.from({ length: 6 }, (_, index) => `MX-${String(index + 25).padStart(3, "0")}`),
);
const expectedTwoThirdIds = new Set(
  [...mainIds].filter((id) => !expectedStandardIds.has(id) && !expectedFullTrayIds.has(id)),
);

assert.equal(mainIds.size, 405, "The BAM main registry must contain 405 recipes");
assert.equal(expectedStandardIds.size, 313, "Exactly 313 BAM mains use the standard three-compartment tray");
assert.equal(expectedTwoThirdIds.size, 86, "Exactly 86 BAM mains use the two-thirds tray");
assert.equal(expectedFullTrayIds.size, 6, "Exactly six BAM mains use the full tray");

for (const id of expectedStandardIds) {
  assert.equal(layouts.get(id) || "standard", "standard", `${id} must use the standard three-compartment tray`);
  if (!["AS-022", "AS-023", "AS-024"].includes(id)) assert.ok(fullCanvasMainIds.has(id), `${id} must use full-canvas artwork`);
}

for (const id of expectedTwoThirdIds) {
  assert.equal(layouts.get(id), "two-thirds", `${id} must use the two-thirds tray`);
  assert.ok(fullCanvasMainIds.has(id), `${id} must use full-canvas artwork`);
}

for (const id of expectedFullTrayIds) {
  assert.equal(layouts.get(id), "full-tray", `${id} must use the full tray`);
  assert.ok(fullCanvasMainIds.has(id), `${id} must use full-canvas artwork`);
}

assert.equal(layouts.size, 92, "Only two-thirds and full-tray BAM mains need explicit layout entries");

console.log("BAM main sizing passed: 313 standard, 86 two-thirds, and 6 full-tray mains");
