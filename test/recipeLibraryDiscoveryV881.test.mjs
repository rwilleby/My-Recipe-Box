import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, component, css] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/features/recipe-library/RecipeLibraryDiscovery.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/features/recipe-library/RecipeLibraryDiscovery.css", import.meta.url), "utf8"),
]);

assert.match(app, /import RecipeLibraryDiscovery from "\.\/features\/recipe-library\/RecipeLibraryDiscovery\.jsx"/);
assert.match(app, /<RecipeLibraryDiscovery[\s\S]*choices=\{browseQuickCategories\}[\s\S]*recipes=\{classifiedRecipes\}/);
assert.match(app, /id: "ALL"[\s\S]*id: "FAVORITES"[\s\S]*HOME_CATEGORY_CODES\.slice\(0, 13\)/);
assert.match(app, /selectedCategory === "FAVORITES" && favorites\.includes\(recipe\.id\)/);
assert.match(app, /<section className="browseInventoryStyleToolbar browseInventoryStyleToolbarSingleRow"/);
assert.match(app, /<div className="recipeGrid browseRecipeGrid">/);

assert.match(component, /const FEATURED_RECIPE_COUNT = 6/);
assert.match(component, /const ROTATION_INTERVAL_MS = 9000/);
assert.match(component, /<nav className="libraryCategorySelectorRow"/);
assert.match(component, /onClick=\{\(\) => onSelectChoice\(choice\)\}/);
assert.match(component, /aria-live="polite"/);
assert.match(component, /prefers-reduced-motion: reduce/);
assert.match(component, /matchingRecipes\.filter\(\(recipe\) => !currentIds\.has\(recipe\.id\)\)/);
assert.match(component, /onMouseEnter=\{\(\) => setPaused\(true\)\}/);
assert.match(component, /onFocusCapture=\{\(\) => setPaused\(true\)\}/);
assert.match(component, /`images\/heroes\/\$\{recipe\.id\}\.webp`/);
assert.match(component, /className=\{`libraryCategorySelectorItem/);
assert.doesNotMatch(component, /libraryDiscoveryRecipeSubtitle/);
assert.match(component, /openRecipeCard\(recipe\.id, cardList, "Browse Our Recipe Library"\)/);

assert.match(css, /\.recipeLibraryDiscoveryIntro[\s\S]*text-align: center/);
assert.match(css, /\.libraryCategorySelectorRow[\s\S]*grid-template-columns: repeat\(15, minmax\(60px, 1fr\)\)/);
assert.match(css, /\.libraryCategorySelectorItem img,[\s\S]*width: 52px;[\s\S]*height: 52px/);
assert.match(css, /\.recipeLibraryDiscoveryGrid[\s\S]*grid-template-columns: repeat\(6, minmax\(150px, 1fr\)\)/);
assert.match(css, /min-width: 960px/);
assert.match(css, /\.libraryDiscoveryRecipeText[\s\S]*height: clamp\(88px, 7\.4vw, 104px\)/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);

console.log("v88.1 Recipe Library discovery selector and rotating-card contracts passed.");
