import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const component = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");

const expectedLayouts = new Map();
for (let number = 1; number <= 20; number += 1) {
  const id = `SF-${String(number).padStart(3, "0")}`;
  expectedLayouts.set(id, "two-thirds");
}
for (let number = 1; number <= 44; number += 1) {
  const id = `MX-${String(number).padStart(3, "0")}`;
  expectedLayouts.set(id, number >= 25 && number <= 30 ? "full-tray" : "two-thirds");
}

const registryStart = component.indexOf("const MEAL_BUILDER_MAIN_IDS");
const registryEnd = component.indexOf("const MEAL_BUILDER_LABEL_SHEETS");
const registrySource = component.slice(registryStart, registryEnd).replaceAll("export ", "");
const actualLayouts = new Map(vm.runInNewContext(`(() => { ${registrySource}; return [...MEAL_BUILDER_MAIN_LAYOUTS]; })()`));

function readVp8xSize(bytes, fileName) {
  assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF", `${fileName} must use a RIFF container`);
  assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP", `${fileName} must be a genuine WebP`);
  const chunk = bytes.subarray(12, 16).toString("ascii");
  if (chunk === "VP8 ") return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff, hasAlpha: false };
  assert.equal(chunk, "VP8X", `${fileName} must use a supported WebP container`);
  return { width: 1 + bytes.readUIntLE(24, 3), height: 1 + bytes.readUIntLE(27, 3), hasAlpha: Boolean(bytes[20] & 0x10) };
}

for (const [id, layout] of expectedLayouts) {
  const fileName = `${id}.webp`;
  const bytes = fs.readFileSync(new URL(`../public/images/build-your-own/main/${fileName}`, import.meta.url));
  const size = readVp8xSize(bytes, fileName);
  assert.deepEqual({ width: size.width, height: size.height }, { width: 1448, height: 1086 }, `${fileName} must use the approved full tray canvas`);
  assert.equal(actualLayouts.get(id), layout, `${id} must use the audited ${layout} layout`);
}

assert.match(component, /Array\.from\(\{ length: 20 \}[^\n]+`SF-/);
assert.match(component, /Array\.from\(\{ length: 44 \}[^\n]+`MX-/);
assert.match(component, /MEAL_BUILDER_FULL_CANVAS_MAIN_IDS[\s\S]*Array\.from\(\{ length: 44 \}[^\n]+`MX-/, "All MX heroes must use the full-canvas tray layer system");
assert.deepEqual(
  [...expectedLayouts].filter(([, layout]) => layout === "full-tray").map(([id]) => id),
  ["MX-025", "MX-026", "MX-027", "MX-028", "MX-029", "MX-030"],
);

console.log("v89.32 SF and MX Meal Builder assets, transparency, dimensions, and tray layouts passed");
