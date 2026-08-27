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
const expectedOneThirdIds = new Set(["AS-022", "AS-023", "AS-024"]);
const expectedFullTrayIds = new Set(
  Array.from({ length: 6 }, (_, index) => `MX-${String(index + 25).padStart(3, "0")}`),
);
const expectedTwoThirdIds = new Set(
  [...mainIds].filter((id) => !expectedOneThirdIds.has(id) && !expectedFullTrayIds.has(id)),
);

assert.equal(mainIds.size, 326, "The BAM main registry must contain 326 recipes");
assert.equal(expectedOneThirdIds.size, 3, "Only three BAM mains use one-third overlays");
assert.equal(expectedTwoThirdIds.size, 317, "Exactly 317 BAM mains use the two-thirds tray");
assert.equal(expectedFullTrayIds.size, 6, "Exactly six BAM mains use the full tray");

for (const id of expectedOneThirdIds) {
  assert.equal(layouts.get(id) || "standard", "standard", `${id} must remain a one-third overlay`);
  assert.ok(!fullCanvasMainIds.has(id), `${id} must not be registered as full-canvas artwork`);
}

for (const id of expectedTwoThirdIds) {
  assert.equal(layouts.get(id), "two-thirds", `${id} must use the two-thirds tray`);
  assert.ok(fullCanvasMainIds.has(id), `${id} must use full-canvas artwork`);
}

for (const id of expectedFullTrayIds) {
  assert.equal(layouts.get(id), "full-tray", `${id} must use the full tray`);
  assert.ok(fullCanvasMainIds.has(id), `${id} must use full-canvas artwork`);
}

assert.equal(layouts.size, 323, "Every full-canvas BAM main must have an explicit normalized layout");

console.log("BAM main sizing normalized: 317 two-thirds, 3 one-third, and 6 full-tray mains passed");
