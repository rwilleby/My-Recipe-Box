import assert from "node:assert/strict";
import fs from "node:fs";

const app = fs.readFileSync("src/App.jsx", "utf8");
const classifier = fs.readFileSync(
  "src/components/AdminRecipeClassifier.jsx",
  "utf8"
);

assert.ok(
  app.includes("const [showRecipeIntelligence, setShowRecipeIntelligence] = useState(false)"),
  "Recipe Intelligence must be collapsed by default"
);
assert.ok(
  app.includes('aria-expanded={showRecipeIntelligence}'),
  "Recipe Intelligence disclosure must expose expanded state"
);
assert.ok(
  app.includes('{showRecipeIntelligence && ('),
  "Recipe Intelligence panel must render only when expanded"
);
assert.ok(
  app.includes('setShowRecipeIntelligence(false);'),
  "Recipe Intelligence must collapse again when switching recipes"
);
assert.ok(
  app.includes('"RFIS Info"'),
  "Compact RFIS Info control must be present"
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
