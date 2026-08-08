import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const classifier = fs.readFileSync("src/components/AdminRecipeClassifier.jsx", "utf8");

assert.ok(
  !app.includes('className="recipeIntelligenceDisclosure"'),
  "Recipe Intelligence must no longer occupy inline recipe-viewer space"
);
assert.ok(
  app.includes('openPanel === "dinners"'),
  "RFIS / Complete Dinner information must open from the Dinners popup"
);
assert.ok(
  app.includes('<RecipeIntelligencePanel'),
  "Recipe Intelligence remains available inside the Dinners popup"
);
assert.ok(
  app.includes('>\n              Dinners\n            </button>'),
  "Dinners footer control must be present"
);

assert.ok(
  classifier.includes('aria-label={`Select ${result.recipeId} for review`}'),
  "Auto-Classify checkbox must use an accessible aria label"
);
assert.ok(
  !classifier.includes('className="srOnly">Select {result.recipeId} for review'),
  "Auto-Classify checkbox must not render overlapping Select text"
);

console.log("Recipe viewer and Auto-Classify UI refinements passed");
