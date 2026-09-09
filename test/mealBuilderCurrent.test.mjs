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
assert.match(source, /import "\.\/BuildYourOwnMealPage\.css";/, "Build a Meal must load its dedicated stylesheet");

function assertWebp(filePath) {
  const bytes = fs.readFileSync(filePath);
  assert.ok(bytes.length > 12, `${path.basename(filePath)} must not be empty`);
  assert.equal(bytes.subarray(0, 4).toString("ascii"), "RIFF", `${path.basename(filePath)} must use RIFF`);
  assert.equal(bytes.subarray(8, 12).toString("ascii"), "WEBP", `${path.basename(filePath)} must be WebP`);
}

const registryStart = source.indexOf("export const MEAL_BUILDER_HAMBURGER_PATTY_IDS");
const registryEnd = source.indexOf("const MEAL_BUILDER_LABEL_SHEETS");
assert.ok(registryStart >= 0 && registryEnd > registryStart, "Current Meal Builder registry must be present");
const registrySource = source.slice(registryStart, registryEnd).replaceAll("export ", "");
const registry = vm.runInNewContext(`(() => { ${registrySource}; return {
  mainIds: [...MEAL_BUILDER_MAIN_IDS],
  sideIds: [...MEAL_BUILDER_SIDE_IDS],
  sideTwoIds: [...MEAL_BUILDER_SIDE_TWO_IDS],
  fullCanvasMainIds: [...MEAL_BUILDER_FULL_CANVAS_MAIN_IDS],
  layouts: [...MEAL_BUILDER_MAIN_LAYOUTS],
}; })()`);
const mainIds = new Set(registry.mainIds);
const sideIds = new Set(registry.sideIds);
const sideTwoIds = new Set(registry.sideTwoIds);
const fullCanvasIds = new Set(registry.fullCanvasMainIds);
const layouts = new Map(registry.layouts);

assert.equal(mainIds.size, 465, "BAM must expose exactly 465 active main dishes");
assert.equal(sideIds.size, 51, "BAM sides must exclude the two loaded-potato mains");
assert.equal(sideTwoIds.size, 54, "Side 2 must include 51 sides plus three protein toppings");
assert.equal([...layouts.values()].filter((layout) => layout === "two-thirds").length, 203, "Exactly 203 owner-approved mains use two-thirds trays");
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
assert.equal(sideOneFiles.length, 53, "Side 1 retains the two legacy potato files outside the active selector");
assert.equal(sideTwoFiles.length, 56, "Side 2 retains the two legacy potato files outside the active selector");
for (const id of sideIds) {
  assertWebp(path.join(sideOneDir, `${id}.webp`));
  assertWebp(path.join(sideTwoDir, `${id}.webp`));
}
for (const id of sideTwoIds) assertWebp(path.join(sideTwoDir, `${id}.webp`));
assertWebp(trayBasePath);

assert.match(source, /alt="Empty white three-compartment meal-prep tray"/);
assert.match(source, /mainTrayLayout === "standard" && <MealBuilderFoodImage recipe=\{sideOneRecipe\}/);
assert.match(source, /mainTrayLayout !== "full-tray" && <MealBuilderFoodImage recipe=\{sideTwoRecipe\}/);
assert.match(source, /<MealChoiceStrip label="Side 1"[\s\S]*?disabled=\{sideOneDisabled\}/);
assert.match(source, /<MealChoiceStrip label="Side 2"[\s\S]*?disabled=\{sideTwoDisabled\}/);
assert.match(source, /nextLayout === "two-thirds" \|\| nextLayout === "full-tray"\) setSideOneId\(""\)/);
assert.match(source, /nextLayout === "full-tray"\) setSideTwoId\(""\)/);
assert.equal(layouts.get("AM-070"), "two-thirds", "AM-070 Cheeseburger Casserole must disable Side 1");
assert.equal(layouts.get("SD-027"), "two-thirds", "Loaded Baked Potato must be a two-thirds main");
assert.equal(layouts.get("SD-028"), "two-thirds", "Loaded Baked Sweet Potato must be a two-thirds main");
assert.ok(!sideIds.has("SD-027") && !sideIds.has("SD-028"), "Loaded potatoes must not appear in either standard side list");
for (const id of ["SG-008", "SG-010", "SG-011"]) assert.ok(sideTwoIds.has(id), `${id} must be available as a Side 2 protein topping`);
const approvedTwoThirdsIds = [
  ...[2, 8, 9, 14, 15, 19, 20, 21, 22, 23, 24, 25, 26, 27, 29, 30, 31, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 44, 45, 46, 50, 51, 52, 55, 56, 57, 58, 59, 60, 61, 62, 64, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78].map((number) => `AM-${String(number).padStart(3, "0")}`),
  ...Array.from({ length: 21 }, (_, index) => `AS-${String(index + 1).padStart(3, "0")}`),
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 25, 26, 27, 28, 29, 30, 31, 41, 42, 45, 46, 47, 48, 49, 50, 70, 71, 72, 73, 79, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 100, 108, 109, 110, 123, 125, 126, 140, 147, 148, 151, 152, 153, 154, 155, 156, 162].map((number) => `CP-${String(number).padStart(3, "0")}`),
  ...Array.from({ length: 10 }, (_, index) => `IT-${String(index + 51).padStart(3, "0")}`),
  ...[14, 15, 16, 17, 20, 21, 22, 23, 24, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44].map((number) => `MX-${String(number).padStart(3, "0")}`),
  ...Array.from({ length: 20 }, (_, index) => `SF-${String(index + 1).padStart(3, "0")}`),
];
for (const id of approvedTwoThirdsIds)
  assert.equal(layouts.get(id), "two-thirds", `${id} must use a two-thirds tray`);
assert.match(styles, /\.mealBuilderTrayFood-side-one\.is-empty[^}]*left:\s*48\.5%[^}]*width:\s*14\.5%/);
assert.match(styles, /\.mealBuilderTrayFood-side-two\.is-empty[^}]*left:\s*64%[^}]*width:\s*14\.5%/);
assert.match(styles, /\.mealBuilderTrayInterior\.is-standard \.mealBuilderTrayFood-main\.is-empty[^}]*left:\s*21\.5%[^}]*width:\s*23\.9497%/);
assert.match(styles, /\.mealBuilderTrayFood\.is-empty[^}]*top:\s*22\.5%[^}]*height:\s*52\.5%/);
assert.doesNotMatch(styles, /\.mealBuilderTrayInterior\.is-two-thirds \.mealBuilderTrayFood-side-two\.is-empty/);
assert.match(styles, /\.mealBuilderTrayFood\.is-empty span[^}]*width:\s*100%[^}]*margin:\s*0 auto[^}]*text-align:\s*center/);
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

console.log(`Current Meal Builder contract passed: ${mainFiles.length} main files, 51 active Side 1 choices, and 54 active Side 2 choices`);
