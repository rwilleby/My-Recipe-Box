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

const registrySource = source.slice(registryStart, registryEnd).replaceAll("export ", "");
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
assert.equal(diskMainIds.length, 326, "The approved Build-A-Meal main collection should contain 326 assets");
assert.equal(diskSideOneIds.length, 53, "The Side 1 collection should contain 53 assets");
assert.equal(diskSideTwoIds.length, 53, "The Side 2 collection should contain 53 assets");
assert.deepEqual([...mainIds].sort(), diskMainIds, "Every main asset must be tagged for Meal Builder use");
assert.deepEqual([...sideIds].sort(), diskSideOneIds, "Every Side 1 asset must be tagged for Meal Builder use");
assert.deepEqual(diskSideTwoIds, diskSideOneIds, "Side 1 and Side 2 must provide the same recipe-code collection");

const approvedOverlaySizes = new Set([
  "340x610", "359x627", "471x626", "628x627",
  "750x626", "858x610", "886x627", "1038x626",
]);

for (const id of diskMainIds) {
  assert.ok(recipeIds.has(id), `${id} must have a matching recipe record`);
  const info = webpInfo(path.join(mainRoot, `${id}.webp`));
  if (/^(?:CP-(?:00[1-9]|0[1-9]\d|100|101)|SF-(?:00[1-9]|01\d|020)|MX-(?:00[1-9]|0[1-3]\d|04[0-4]))$/.test(id)) {
    assert.deepEqual({ width: info.width, height: info.height }, { width: 1448, height: 1086 }, `${id} must use the full divided-tray canvas`);
    continue;
  }
  assert.ok(info.hasAlpha, `${id} must retain genuine transparency`);
  assert.ok(approvedOverlaySizes.has(`${info.width}x${info.height}`), `${id} has unsupported Meal Builder dimensions: ${info.width}x${info.height}`);
  assert.ok(["standard", "two-thirds", "full-tray"].includes(layouts.get(id) || "standard"), `${id} must use a supported tray layout`);
}

for (const id of diskSideOneIds) {
  for (const [label, directory] of [["Side 1", sideOneRoot], ["Side 2", sideTwoRoot]]) {
    const info = webpInfo(path.join(directory, `${id}.webp`));
    const usesDividedTrayCanvas = /^SD-(?:00[1-9]|0[1-4]\d|05[0-3])$/.test(id);
    if (usesDividedTrayCanvas) {
      assert.deepEqual({ width: info.width, height: info.height }, { width: 1448, height: 1086 }, `${label} ${id} must use the full divided-tray canvas`);
    } else {
      assert.ok(info.width > 0 && info.height > 0, `${label} ${id} must have valid dimensions`);
      assert.ok(info.hasAlpha, `${label} ${id} must retain genuine transparency`);
    }
  }
}

assert.deepEqual(diskSideOneIds.filter((id) => !recipeIds.has(id)), ["SD-053"], "Only the known duplicate/orphan SD-053 asset may lack a recipe record");
assert.match(source, /images\/build-your-own\/\$\{folder\}\/\$\{recipe\.id\}\.webp/, "Tray overlays must load the approved Build Your Own Meal assets");
assert.match(source, /MEAL_BUILDER_FULL_CANVAS_MAIN_IDS/, "Full-canvas CP, SF, and MX mains must use the divided-tray layer system");
assert.match(fs.readFileSync(path.join(root, "src/components/BuildYourOwnMealPage.css"), "utf8"), /\.mealBuilderTrayInterior \.mealBuilderTrayFood-main\.is-full-canvas-layer\s*\{[^}]*width:\s*100%/, "Full-canvas mains must override the standard compartment width");

console.log("v89.4.1 Build Your Own Meal asset tags, layouts, paths, transparency, and recipe links passed");
