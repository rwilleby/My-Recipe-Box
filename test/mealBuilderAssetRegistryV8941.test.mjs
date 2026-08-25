import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { recipes } from "../src/data/recipes.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "src/components/BuildYourOwnMealPage.jsx"), "utf8");
const registryStart = source.indexOf("const MEAL_BUILDER_MAIN_IDS");
const registryEnd = source.indexOf("const MEAL_BUILDER_LABEL_SHEETS");
assert.ok(registryStart >= 0 && registryEnd > registryStart, "Meal Builder asset registry must be present");

const registrySource = source.slice(registryStart, registryEnd);
const registry = vm.runInNewContext(`(() => { ${registrySource}; return {
  mainIds: [...MEAL_BUILDER_MAIN_IDS],
  sideIds: [...MEAL_BUILDER_SIDE_IDS],
  layouts: [...MEAL_BUILDER_MAIN_LAYOUTS],
}; })()`);

const mainIds = new Set(registry.mainIds);
const sideIds = new Set(registry.sideIds);
const layouts = new Map(registry.layouts);
const recipeIds = new Set(recipes.map((recipe) => recipe.id));
const mainRoot = path.join(root, "public/images/build-your-own/main");
const sideOneRoot = path.join(root, "public/images/build-your-own/side-1-middle");
const sideTwoRoot = path.join(root, "public/images/build-your-own/side-2-right");

function assetIds(directory) {
  return fs.readdirSync(directory)
    .filter((file) => file.endsWith(".webp"))
    .map((file) => file.slice(0, -5))
    .sort();
}

function webpInfo(file) {
  const bytes = fs.readFileSync(file);
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF", `${file} must be a genuine WebP`);
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP", `${file} must be a genuine WebP`);
  const chunk = bytes.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return {
      hasAlpha: false,
      width: bytes.readUInt16LE(26) & 0x3fff,
      height: bytes.readUInt16LE(28) & 0x3fff,
    };
  }
  assert.equal(chunk, "VP8X", `${file} must use a supported WebP container`);
  return {
    hasAlpha: Boolean(bytes[20] & 0x10),
    width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16),
    height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16),
  };
}

const diskMainIds = assetIds(mainRoot);
const diskSideOneIds = assetIds(sideOneRoot);
const diskSideTwoIds = assetIds(sideTwoRoot);
for (const id of mainIds) assert.ok(diskMainIds.includes(id), `${id} must have a Build-A-Meal main asset`);
for (const id of sideIds) {
  assert.ok(diskSideOneIds.includes(id), `${id} must have a Side 1 asset`);
  assert.ok(diskSideTwoIds.includes(id), `${id} must have a Side 2 asset`);
}
const expectedCrockPotIds = Array.from({ length: 101 }, (_, index) => `CP-${String(index + 1).padStart(3, "0")}`);
assert.deepEqual(expectedCrockPotIds.filter((id) => !mainIds.has(id)), [], "CP-001 through CP-101 must all be registered");
assert.deepEqual(expectedCrockPotIds.filter((id) => !diskMainIds.includes(id)), [], "CP-001 through CP-101 assets must all be installed");

const expectedLayoutByWidth = new Map([
  [340, "standard"], [359, "standard"], [471, "standard"],
  [600, "two-thirds"], [628, "two-thirds"], [750, "two-thirds"],
  [858, "full-tray"], [886, "full-tray"], [1038, "full-tray"],
]);

for (const id of mainIds) {
  assert.ok(recipeIds.has(id), `${id} must have a matching recipe record`);
  const info = webpInfo(path.join(mainRoot, `${id}.webp`));
  if (/^CP-(?:00[1-9]|0[1-9]\d|100|101)$/.test(id)) {
    assert.deepEqual({ width: info.width, height: info.height }, { width: 1448, height: 1086 }, `${id} must use the full divided-tray canvas`);
    continue;
  }
  assert.ok(info.hasAlpha, `${id} must retain genuine transparency`);
  assert.ok([610, 626, 627].includes(info.height), `${id} has an unsupported Meal Builder height`);
  const expectedLayout = expectedLayoutByWidth.get(info.width);
  assert.ok(expectedLayout, `${id} has an unsupported Meal Builder width: ${info.width}`);
  assert.equal(layouts.get(id) || "standard", expectedLayout, `${id} must be tagged ${expectedLayout}`);
}

for (const id of sideIds) {
  const sideOneInfo = webpInfo(path.join(sideOneRoot, `${id}.webp`));
  const sideTwoInfo = webpInfo(path.join(sideTwoRoot, `${id}.webp`));
  if (id === "SD-001") {
    assert.deepEqual({ width: sideOneInfo.width, height: sideOneInfo.height }, { width: 268, height: 627 }, "SD-001 Side 1 must retain its approved legacy overlay");
    assert.deepEqual({ width: sideTwoInfo.width, height: sideTwoInfo.height }, { width: 257, height: 627 }, "SD-001 Side 2 must retain its approved legacy overlay");
    assert.ok(sideOneInfo.hasAlpha && sideTwoInfo.hasAlpha, "SD-001 directional overlays must retain transparency");
  } else {
    assert.deepEqual({ width: sideOneInfo.width, height: sideOneInfo.height }, { width: 1448, height: 1086 }, `${id} Side 1 must use the full divided-tray canvas`);
    assert.deepEqual({ width: sideTwoInfo.width, height: sideTwoInfo.height }, { width: 1448, height: 1086 }, `${id} Side 2 must use the full divided-tray canvas`);
  }
}

assert.deepEqual([...sideIds].filter((id) => !recipeIds.has(id)).sort(), ["SD-053"], "Only the known duplicate/orphan SD-053 registered asset may lack a recipe record");
assert.match(source, /images\/build-your-own\/\$\{folder\}\/\$\{recipe\.id\}\.webp/, "Tray overlays must load the approved Build Your Own Meal assets");
assert.match(source, /MEAL_BUILDER_FULL_CANVAS_MAIN_IDS/, "Full-canvas Crock Pot mains must use the divided-tray layer system");

console.log("v89.4.1 Build Your Own Meal asset tags, layouts, paths, transparency, and recipe links passed");
