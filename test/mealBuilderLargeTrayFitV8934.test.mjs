import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const styles = fs.readFileSync(path.join(root, "src/components/BuildYourOwnMealPage.css"), "utf8");

assert.match(styles, /\.mealBuilderTray\s*\{[^}]*--meal-builder-large-tray-fit:\s*1\.055/);
assert.match(styles, /\.mealBuilderTray:not\(\.mealBuilderLabelTray\)\s*>\s*\.mealBuilderTrayBase[\s\S]*?\.mealBuilderTray:not\(\.mealBuilderLabelTray\)\s*>\s*\.mealBuilderTrayInterior\s*\{[^}]*transform:\s*scale\(var\(--meal-builder-large-tray-fit\)\)/);
assert.match(styles, /transform-origin:\s*center/);
assert.doesNotMatch(styles, /\.mealBuilderLabelTray\s*\{[^}]*--meal-builder-large-tray-fit/);

console.log("v89.34 Meal Builder uses the approved 84–85% large-tray display fit");
