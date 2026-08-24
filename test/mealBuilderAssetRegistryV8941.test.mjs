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
  assert.equal(bytes.toString("ascii", 12, 16), "VP8X", `${file} must use the extended WebP container`);
  return {
    hasAlpha: Boolean(bytes[20] & 0x10),
    width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16),
    height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16),
  };
}

const diskMainIds = assetIds(mainRoot);
const diskSideOneIds = assetIds(sideOneRoot);
const diskSideTwoIds = assetIds(sideTwoRoot);
assert.equal(diskMainIds.length, 225, "The approved Build Your Own Meal main collection should contain 225 assets");
assert.equal(diskSideOneIds.length, 53, "The Side 1 middle collection should contain 53 assets");
assert.equal(diskSideTwoIds.length, 53, "The Side 2 right collection should contain 53 assets");
assert.deepEqual([...mainIds].sort(), diskMainIds, "Every main asset must be tagged for Meal Builder use");
assert.deepEqual([...sideIds].sort(), diskSideOneIds, "Every side must have a Side 1 middle asset");
assert.deepEqual([...sideIds].sort(), diskSideTwoIds, "Every side must have a Side 2 right asset");
assert.deepEqual(diskSideOneIds, diskSideTwoIds, "Directional side collections must use matching recipe codes");

const expectedLayoutByWidth = new Map([
  [340, "standard"], [471, "standard"],
  [359, "standard"],
  [600, "two-thirds"], [750, "two-thirds"],
  [628, "two-thirds"],
  [858, "full-tray"], [1038, "full-tray"],
  [886, "full-tray"],
]);

for (const id of diskMainIds) {
  assert.ok(recipeIds.has(id), `${id} must have a matching recipe record`);
  const info = webpInfo(path.join(mainRoot, `${id}.webp`));
  assert.ok(info.hasAlpha, `${id} must retain genuine transparency`);
  assert.ok([610, 626, 627].includes(info.height), `${id} has an unsupported Meal Builder height`);
  const expectedLayout = expectedLayoutByWidth.get(info.width);
  assert.ok(expectedLayout, `${id} has an unsupported Meal Builder width: ${info.width}`);
  assert.equal(layouts.get(id) || "standard", expectedLayout, `${id} must be tagged ${expectedLayout}`);
}

for (const id of diskSideOneIds) {
  const sideOneInfo = webpInfo(path.join(sideOneRoot, `${id}.webp`));
  const sideTwoInfo = webpInfo(path.join(sideTwoRoot, `${id}.webp`));
  assert.deepEqual({ width: sideOneInfo.width, height: sideOneInfo.height }, { width: 268, height: 627 }, `${id} must use the Side 1 middle canvas`);
  assert.deepEqual({ width: sideTwoInfo.width, height: sideTwoInfo.height }, { width: 257, height: 627 }, `${id} must use the Side 2 right canvas`);
  assert.ok(sideOneInfo.hasAlpha && sideTwoInfo.hasAlpha, `${id} directional assets must retain genuine transparency`);
}

assert.deepEqual(diskSideOneIds.filter((id) => !recipeIds.has(id)), ["SD-053"], "Only the known duplicate/orphan SD-053 asset may lack a recipe record");
assert.match(source, /images\/build-your-own\/\$\{folder\}\/\$\{recipe\.id\}\.webp/, "Tray overlays must load the approved Build Your Own Meal assets");
assert.match(source, /position === "side-one"[\s\S]*?"side-1-middle"[\s\S]*?"side-2-right"/, "Tray overlays must choose the directional side folder by position");
assert.match(source, /recipeHeroImageCandidates\(recipe\)/, "Recipe-card and selector heroes must retain their standard hero-image loader");

console.log("v89.4.1 Build Your Own Meal asset tags, layouts, paths, transparency, and recipe links passed");
