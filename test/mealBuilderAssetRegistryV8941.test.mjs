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
const sideRoot = path.join(root, "public/images/build-your-own/sides");

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
  assert.equal(bytes.toString("ascii", 12, 16), "VP8X", `${file} must use the extended WebP container`);
  return {
    hasAlpha: Boolean(bytes[20] & 0x10),
    width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16),
    height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16),
  };
}

const diskMainIds = assetIds(mainRoot);
const diskSideIds = assetIds(sideRoot);
assert.equal(diskMainIds.length, 225, "The approved Build Your Own Meal main collection should contain 225 assets");
assert.equal(diskSideIds.length, 53, "The portable side collection should contain 53 assets");
assert.deepEqual([...mainIds].sort(), diskMainIds, "Every main asset must be tagged for Meal Builder use");
assert.deepEqual([...sideIds].sort(), diskSideIds, "Every portable side asset must be tagged for Meal Builder use");

const expectedLayoutByWidth = new Map([
  [340, "standard"], [471, "standard"],
  [600, "two-thirds"], [750, "two-thirds"],
  [858, "full-tray"], [1038, "full-tray"],
]);

for (const id of diskMainIds) {
  assert.ok(recipeIds.has(id), `${id} must have a matching recipe record`);
  const info = webpInfo(path.join(mainRoot, `${id}.webp`));
  assert.ok(info.hasAlpha, `${id} must retain genuine transparency`);
  assert.ok([610, 626].includes(info.height), `${id} has an unsupported Meal Builder height`);
  const expectedLayout = expectedLayoutByWidth.get(info.width);
  assert.ok(expectedLayout, `${id} has an unsupported Meal Builder width: ${info.width}`);
  assert.equal(layouts.get(id) || "standard", expectedLayout, `${id} must be tagged ${expectedLayout}`);
}

for (const id of diskSideIds) {
  const info = webpInfo(path.join(sideRoot, `${id}.webp`));
  assert.deepEqual({ width: info.width, height: info.height }, { width: 278, height: 626 }, `${id} must use the portable side canvas`);
  assert.ok(info.hasAlpha, `${id} must retain genuine transparency`);
}

assert.deepEqual(diskSideIds.filter((id) => !recipeIds.has(id)), ["SD-053"], "Only the known duplicate/orphan SD-053 asset may lack a recipe record");
assert.match(source, /images\/build-your-own\/\$\{folder\}\/\$\{recipe\.id\}\.webp/, "Tray overlays must load the approved Build Your Own Meal assets");

console.log("v89.4.1 Build Your Own Meal asset tags, layouts, paths, transparency, and recipe links passed");
