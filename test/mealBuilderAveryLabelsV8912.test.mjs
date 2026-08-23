import assert from "node:assert/strict";
import fs from "node:fs";

const jsx = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../src/components/BuildYourOwnMealPage.css", import.meta.url), "utf8");

assert.match(jsx, /name:\s*"Avery 8163"/);
assert.match(jsx, /labelsPerSheet:\s*10/);
assert.match(jsx, /2 columns × 5 rows · 2″ × 4″ labels/);
assert.match(jsx, /buildMealBuilderLabelTitle/);
assert.match(jsx, /`\$\{mainTitle\} with \$\{sideTitles\[0\]\} and \$\{sideTitles\[1\]\}`/);
assert.match(jsx, /Print Meal Labels/);
assert.match(jsx, /Number of labels/);
assert.match(jsx, /Start at label/);
assert.match(jsx, /mealBuilderLabelPositionGrid/);
assert.match(jsx, /printingMealBuilderLabels/);
assert.match(jsx, /MEAL_BUILDER_LABEL_SETTINGS_KEY/);

assert.match(css, /\.mealBuilderTray\s*\{[^}]*aspect-ratio:\s*1448\/1086/);
assert.match(css, /\.mealBuilderTrayFood img\s*\{[^}]*width:\s*100%[^}]*height:\s*100%[^}]*object-fit:\s*contain/);
assert.match(css, /\.mealBuilderTrayFood-side-two img\s*\{[^}]*width:\s*96\.8641%[^}]*transform:\s*translateX\(-50%\)/);
assert.match(css, /mealBuilderLabelPositionGrid[^}]*grid-template-columns:\s*repeat\(2,1fr\)[^}]*grid-template-rows:\s*repeat\(5,44px\)/);
assert.match(css, /mealBuilderLabelPage[^}]*grid-template-columns:\s*repeat\(2,4in\)!important[^}]*grid-template-rows:\s*repeat\(5,2in\)!important[^}]*column-gap:\s*\.125in/);
assert.match(css, /mealBuilderPrintableLabel[^}]*width:\s*4in!important[^}]*height:\s*2in!important/);
assert.match(css, /mealBuilderPrintableLabelCopy strong/);

console.log("v89.12 tighter tray fill and Avery 8163 meal-photo label contracts passed");
