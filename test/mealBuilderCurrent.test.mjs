import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentPath = path.join(root, "src/components/BuildYourOwnMealPage.jsx");
const stylesPath = path.join(root, "src/components/BuildYourOwnMealPage.css");
const mainDir = path.join(root, "public/images/build-your-own/main");
const sideOneDir = path.join(root, "public/images/build-your-own/side-1-middle");
const sideTwoDir = path.join(root, "public/images/build-your-own/side-2-right");
const trayBasePath = path.join(root, "public/images/meal-builder/meal-builder-tray-base.webp");
const source = fs.readFileSync(componentPath, "utf8");
const styles = fs.readFileSync(stylesPath, "utf8");

function assertWebp(filePath) {
  const bytes = fs.readFileSync(filePath);
  assert.ok(bytes.length > 12, `${path.basename(filePath)} must not be empty`);
  assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF", `${path.basename(filePath)} must use RIFF`);
  assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP", `${path.basename(filePath)} must be WebP`);
}

const registryStart = source.indexOf("const MEAL_BUILDER_MAIN_IDS");
const registryEnd = source.indexOf("const MEAL_BUILDER_LABEL_SHEETS");
assert.ok(registryStart >= 0 && registryEnd > registryStart, "Current Meal Builder registry must be present");
const registrySource = source.slice(registryStart, registryEnd).replaceAll("export ", "");
const registry = vm.runInNewContext(`(() => { ${registrySource}; return {
  mainIds: [...MEAL_BUILDER_MAIN_IDS],
  sideIds: [...MEAL_BUILDER_SIDE_IDS],
  fullCanvasMainIds: [...MEAL_BUILDER_FULL_CANVAS_MAIN_IDS],
  layouts: [...MEAL_BUILDER_MAIN_LAYOUTS],
}; })()`);
const mainIds = new Set(registry.mainIds);
const sideIds = new Set(registry.sideIds);
const fullCanvasIds = new Set(registry.fullCanvasMainIds);
const layouts = new Map(registry.layouts);

assert.equal(mainIds.size, 405, "BAM must expose exactly 405 active main dishes");
assert.equal(sideIds.size, 53, "BAM must expose SD-001 through SD-053");
assert.equal([...layouts.values()].filter((layout) => layout === "two-thirds").length, 11, "Exactly 11 mains use two-thirds trays");
assert.equal([...layouts.values()].filter((layout) => layout === "full-tray").length, 6, "Exactly six mains use full trays");
for (const [id, layout] of layouts) {
  assert.ok(mainIds.has(id), `${id} layout must reference an active main`);
  assert.ok(["two-thirds", "full-tray"].includes(layout), `${id} has an invalid layout`);
  assert.ok(fullCanvasIds.has(id), `${id} spanning artwork must use the full-canvas layer`);
}

const mainFiles = fs.readdirSync(mainDir).filter((file) => file.endsWith(".webp"));
const sideOneFiles = fs.readdirSync(sideOneDir).filter((file) => file.endsWith(".webp"));
const sideTwoFiles = fs.readdirSync(sideTwoDir).filter((file) => file.endsWith(".webp"));
for (const id of mainIds) {
  const filePath = path.join(mainDir, `${id}.webp`);
  assert.ok(fs.existsSync(filePath), `${id} main hero is missing`);
  assertWebp(filePath);
}
assert.equal(sideOneFiles.length, 53, "Side 1 must contain exactly 53 WebP heroes");
assert.equal(sideTwoFiles.length, 53, "Side 2 must contain exactly 53 WebP heroes");
for (const id of sideIds) {
  assertWebp(path.join(sideOneDir, `${id}.webp`));
  assertWebp(path.join(sideTwoDir, `${id}.webp`));
}
assertWebp(trayBasePath);

assert.match(source, /alt="Empty white three-compartment meal-prep tray"/);
assert.match(source, /mainTrayLayout === "standard" && <MealBuilderFoodImage recipe=\{sideOneRecipe\}/);
assert.match(source, /mainTrayLayout !== "full-tray" && <MealBuilderFoodImage recipe=\{sideTwoRecipe\}/);
assert.match(source, /<MealChoiceStrip label="Side 1"[\s\S]*?disabled=\{sideOneDisabled\}/);
assert.match(source, /<MealChoiceStrip label="Side 2"[\s\S]*?disabled=\{sideTwoDisabled\}/);
assert.match(source, /nextLayout === "two-thirds" \|\| nextLayout === "full-tray"\) setSideOneId\(""\)/);
assert.match(source, /nextLayout === "full-tray"\) setSideTwoId\(""\)/);
assert.equal(layouts.get("AM-070"), "two-thirds", "AM-070 Cheeseburger Casserole must disable Side 1");
assert.match(styles, /\.mealBuilderTrayFood-side-one\.is-empty[^}]*left:\s*48\.5%[^}]*width:\s*14\.5%/);
assert.match(styles, /\.mealBuilderTrayFood-side-two\.is-empty[^}]*left:\s*64%[^}]*width:\s*14\.5%/);
assert.match(styles, /\.mealBuilderTrayFood\.is-empty[^}]*top:\s*22\.5%[^}]*height:\s*52\.5%/);
assert.match(styles, /\.mealBuilderChoiceColumn\.is-disabled[^}]*background:\s*#f7f5f0/);

assert.match(source, /buildMealBuilderLabelTitle/);
assert.match(source, /"8163":[\s\S]*?labelsPerSheet:\s*10[\s\S]*?includesPhoto:\s*true/);
assert.match(source, /"5160":[\s\S]*?labelsPerSheet:\s*30[\s\S]*?includesPhoto:\s*false/);
assert.match(source, /PRINT MEAL LABELS/);
assert.match(source, /saveCurrentMeal/);
assert.match(source, /loadSavedMeal/);
assert.match(source, /deleteActiveSavedMeal/);
assert.match(source, /openRecipeCard/);
assert.match(source, /CLEAR &amp; START OVER/);
assert.match(styles, /\.mealBuilderTray\s*\{[^}]*aspect-ratio:\s*1448\/1086/);
assert.match(styles, /\.mealBuilderChoiceRail\s*\{[^}]*overflow-y:\s*auto[^}]*scroll-snap-type:\s*y mandatory/);
assert.match(styles, /is-avery-8163 \.mealBuilderLabelPage[^}]*repeat\(2,4in\)[^}]*repeat\(5,2in\)/);
assert.match(styles, /is-avery-5160 \.mealBuilderLabelPage[^}]*repeat\(3,2\.625in\)[^}]*repeat\(10,1in\)/);

console.log(`Current Meal Builder contract passed: ${mainFiles.length} main files, 53 Side 1 files, and 53 Side 2 files`);
