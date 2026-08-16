import assert from "node:assert/strict";
import fs from "node:fs";

const component = fs.readFileSync(
  "src/components/AdminRecipeClassifier.jsx",
  "utf8"
);
const styles = fs.readFileSync(
  "src/components/AdminRecipeClassifier.css",
  "utf8"
);

assert.ok(component.includes("function AdminRecipeHero"));
assert.ok(component.includes("images/thumbs/heroes/${recipeId}.webp"));
assert.ok(component.includes('className="adminSelectedRecipeHero"'));
assert.ok(component.includes('className="adminSelectedRecipeIdentity"'));
assert.ok(component.includes('className="adminCompactClassification"'));
assert.ok(component.includes('className="adminCompactCategoryGrid"'));
assert.ok(component.includes('title="Collections"'));
assert.ok(component.includes('title="Recipe Attributes"'));
assert.ok(component.includes('title="Cooking Methods"'));

assert.match(
  styles,
  /\.adminClassifierLayout\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/s
);
assert.match(
  styles,
  /\.adminRecipeList:not\(\.groupMode\)\s*\{[^}]*grid-auto-flow:\s*column/s
);
assert.match(
  styles,
  /\.adminSelectedRecipeHero img\s*\{[^}]*object-fit:\s*contain/s
);
assert.match(
  styles,
  /\.adminCompactCategoryGrid\s*\{[^}]*grid-template-columns:\s*repeat\(3,/s
);

console.log("V82 compact Admin Recipe Classifier layout contracts passed");
