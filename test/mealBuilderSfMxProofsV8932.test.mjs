import assert from "node:assert/strict";
import fs from "node:fs";

const component = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");

const expectedLayouts = new Map();
for (let number = 1; number <= 20; number += 1) {
  const id = `SF-${String(number).padStart(3, "0")}`;
  expectedLayouts.set(id, number === 20 ? "full-tray" : [2, 3, 16, 17, 18].includes(number) ? "two-thirds" : "standard");
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
  assert.equal(bytes.subarray(12, 16).toString("ascii"), "VP8X", `${fileName} must expose its alpha canvas through VP8X`);
  assert.ok((bytes[20] & 0x10) !== 0, `${fileName} must retain transparency`);
  const width = 1 + bytes.readUIntLE(24, 3);
  const height = 1 + bytes.readUIntLE(27, 3);
  return { width, height };
}

for (const [id, layout] of expectedLayouts) {
  const fileName = `${id}.webp`;
  const bytes = fs.readFileSync(new URL(`../public/images/meal-builder/main/${fileName}`, import.meta.url));
  const size = readVp8xSize(bytes, fileName);
  const expectedWidth = layout === "full-tray" ? 1038 : layout === "two-thirds" ? 750 : 471;
  assert.deepEqual(size, { width: expectedWidth, height: 626 }, `${fileName} must match its ${layout} canvas`);
}

assert.match(component, /Array\.from\(\{ length: 20 \}[^\n]+`SF-/);
assert.match(component, /Array\.from\(\{ length: 44 \}[^\n]+`MX-/);
for (const id of ["SF-002", "SF-003", "SF-016", "SF-017", "SF-018", "MX-004", "MX-005", "MX-008", "MX-032"]) {
  assert.match(component, new RegExp(`"${id}"`), `${id} must be registered as a spanning main`);
}
for (const id of ["SF-020", "MX-001", "MX-002", "MX-011", "MX-012", "MX-021", "MX-022", "MX-023", "MX-024", "MX-025", "MX-026", "MX-027", "MX-028", "MX-029", "MX-030", "MX-033", "MX-034", "MX-040", "MX-041", "MX-042"]) {
  assert.match(component, new RegExp(`"${id}"`), `${id} must be registered as a full-tray main`);
}

console.log("v89.32 SF and MX Meal Builder assets, transparency, dimensions, and tray layouts passed");
