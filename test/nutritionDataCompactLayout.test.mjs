import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const fic = fs.readFileSync(
  "src/components/FoodIntelligenceCard.jsx",
  "utf8"
);
const css = fs.readFileSync("src/App.css", "utf8");

assert.ok(
  app.includes("servingsPerRecipe={recipe.servings}"),
  "Nutrition Data must receive the recipe's actual serving count"
);
assert.ok(
  !app.includes("<MealBalanceInfo compact />"),
  "MB Info button must be removed from the viewer header"
);

assert.ok(
  fic.includes("servingsPerRecipe = null"),
  "FoodIntelligenceCard must accept servingsPerRecipe"
);
assert.ok(
  fic.includes("servingsPerRecipe ?? facts.servingsPerRecipe ??"),
  "Recipe serving count must take precedence over legacy nutrition data"
);
assert.ok(
  !fic.includes("FOOD INTELLIGENCE CARD"),
  "Food Intelligence Card eyebrow must be removed"
);
assert.ok(
  !fic.includes("Estimated nutritional information"),
  "Status text must not be rendered in the compact Nutrition Data header"
);
assert.ok(
  fic.includes('className="ficHeader ficHeaderCompact"'),
  "Compact single-row Nutrition Data header is required"
);
assert.ok(
  fic.includes('className="ficContentColumns ficContentColumnsTwo"'),
  "Right-side Nutrition Data content must use the two-column layout"
);
assert.ok(
  fic.includes('className="ficDataNotes ficDataNotesWide"'),
  "Data Notes must use the full-width bottom-row class"
);

const marker =
  "/* v71.6 — compact Nutrition Data view: one-line header, two-column details */";
const index = css.lastIndexOf(marker);
assert.ok(index >= 0, "v71.6 Nutrition Data CSS marker missing");
const finalCss = css.slice(index);

for (const token of [
  "grid-template-columns: repeat(2, minmax(0, 1fr)) !important;",
  "grid-column: 1 / -1 !important;",
  "grid-row: 6 !important;",
  "overflow: hidden !important;",
]) {
  assert.ok(finalCss.includes(token), `Missing compact Nutrition Data token: ${token}`);
}

console.log("Compact Nutrition Data layout contracts passed");
