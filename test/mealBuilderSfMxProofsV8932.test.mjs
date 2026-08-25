import assert from "node:assert/strict";
import fs from "node:fs";

const component = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");

const expectedLayouts = new Map();
for (let number = 1; number <= 20; number += 1) {
  const id = `SF-${String(number).padStart(3, "0")}`;
  expectedLayouts.set(id, [2, 3, 18, 20].includes(number) ? "full-tray" : [16, 17].includes(number) ? "two-thirds" : "standard");
}
for (let number = 1; number <= 44; number += 1) {
  const id = `MX-${String(number).padStart(3, "0")}`;
  const fullTray = [1, 2, 11, 12, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 33, 34, 40, 41, 42];
  const twoThirds = [4, 5, 8, 32];
  expectedLayouts.set(id, fullTray.includes(number) ? "full-tray" : twoThirds.includes(number) ? "two-thirds" : "standard");
}

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
}

assert.match(component, /Array\.from\(\{ length: 20 \}[^\n]+`SF-/);
assert.match(component, /Array\.from\(\{ length: 44 \}[^\n]+`MX-/);
assert.match(component, /MEAL_BUILDER_FULL_CANVAS_MAIN_IDS[\s\S]*Array\.from\(\{ length: 44 \}[^\n]+`MX-/, "All MX heroes must use the full-canvas tray layer system");
for (const id of ["SF-016", "SF-017", "MX-004", "MX-005", "MX-008", "MX-032"]) {
  assert.match(component, new RegExp(`"${id}"`), `${id} must be registered as a spanning main`);
}
for (const id of ["SF-002", "SF-003", "SF-018", "SF-020", "MX-001", "MX-002", "MX-011", "MX-012", "MX-021", "MX-022", "MX-023", "MX-024", "MX-025", "MX-026", "MX-027", "MX-028", "MX-029", "MX-030", "MX-033", "MX-034", "MX-040", "MX-041", "MX-042"]) {
  assert.match(component, new RegExp(`"${id}"`), `${id} must be registered as a full-tray main`);
}

console.log("v89.32 SF and MX Meal Builder assets, transparency, dimensions, and tray layouts passed");
