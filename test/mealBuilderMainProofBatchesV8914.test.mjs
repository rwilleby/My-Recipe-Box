import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "src/components/BuildYourOwnMealPage.jsx"), "utf8");
const imageRoot = path.join(root, "public/images/build-your-own/main");
const approvedOverlaySizes = new Set([
  "340x610", "359x627", "471x626", "628x627",
  "750x626", "858x610", "886x627", "1038x626",
]);

const fullTrayIds = ["AM-073", "AM-074", "AM-075", "AM-076", "AM-077", "AM-078", "AS-018", "AS-019"];
const twoThirdIds = Array.from({ length: 17 }, (_, index) => `AS-${String(index + 1).padStart(3, "0")}`);
const oneThirdNumbers = [
  17, 19,
  ...Array.from({ length: 16 }, (_, index) => index + 21),
  38, 39, 40, 42, 43, 44, 45,
  ...Array.from({ length: 7 }, (_, index) => index + 46),
  ...Array.from({ length: 9 }, (_, index) => index + 54),
  ...Array.from({ length: 9 }, (_, index) => index + 64),
];
const oneThirdIds = oneThirdNumbers.map((number) => `AM-${String(number).padStart(3, "0")}`);
const batchIds = [...oneThirdIds, ...twoThirdIds, ...fullTrayIds];

assert.equal(batchIds.length, 75, "Batches 4–6 should contain 75 unique main-dish images");
assert.equal(oneThirdIds.length, 50, "Batches 4–5 should contain 50 one-third American mains");
assert.equal(new Set(batchIds).size, 75, "Batch validation IDs must not contain duplicates");

function webpDimensions(file) {
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  const chunk = bytes.toString("ascii", 12, 16);
  if (chunk === "VP8 ") return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff, hasAlpha: false };
  assert.equal(chunk, "VP8X");
  return {
    width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16),
    height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16),
    hasAlpha: Boolean(bytes[20] & 0x10),
  };
}

for (const id of batchIds) {
  assert.match(source, new RegExp(`"${id}"`), `${id} must be registered as a Meal Builder image`);
  const dimensions = webpDimensions(path.join(imageRoot, `${id}.webp`));
  assert.ok(approvedOverlaySizes.has(`${dimensions.width}x${dimensions.height}`), `${id} must use an approved live overlay canvas`);
  assert.ok(dimensions.hasAlpha, `${id} must retain transparency`);
}

for (const id of fullTrayIds) assert.match(source, new RegExp(`\\["${id}", "full-tray"\\]`));
for (const id of twoThirdIds) assert.match(source, new RegExp(`\\["${id}", "two-thirds"\\]`));

console.log("v89.14 Meal Builder main-image Batches 4–6 and tray-layout contracts passed");
