import assert from "node:assert/strict";
import fs from "node:fs";

const jsx = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");

assert.match(jsx, /"8163":\s*\{[\s\S]*?labelsPerSheet:\s*10[\s\S]*?includesPhoto:\s*true/);
assert.match(jsx, /"5160":\s*\{[\s\S]*?labelsPerSheet:\s*30[\s\S]*?includesPhoto:\s*false/);
assert.match(jsx, /Avery 8163 — Photo \+ Text/);
assert.match(jsx, /Avery 5160 — Text Only/);
assert.match(jsx, /activeLabelSheet\.includesPhoto && <MealBuilderTrayPreview/);
assert.match(jsx, /mealLabelDetails = `\$\{totalCalories[\s\S]*?calories[\s\S]*?· MB \$\{combinedMealBalance[\s\S]*?· Printed \$\{formatMealBuilderPrintDate/);
assert.match(jsx, /mealBuilderPrintableLabelCopy/);
assert.match(jsx, /unavailable8163/);
assert.match(jsx, /unavailable5160/);

assert.match(css, /is-avery-8163 \.mealBuilderLabelPage[^}]*repeat\(2,4in\)[^}]*repeat\(5,2in\)/);
assert.match(css, /is-avery-5160 \.mealBuilderLabelPage[^}]*repeat\(3,2\.625in\)[^}]*repeat\(10,1in\)/);
assert.match(css, /is-avery-5160 \.mealBuilderPrintableLabel[^}]*width:\s*2\.625in!important[^}]*height:\s*1in!important/);
assert.match(css, /is-avery-5160 \.mealBuilderPrintableLabelCopy strong/);
assert.match(css, /is-avery-5160 \.mealBuilderPrintableLabelCopy span/);

console.log("v89.13 Avery 8163 photo and Avery 5160 text-only label contracts passed");
