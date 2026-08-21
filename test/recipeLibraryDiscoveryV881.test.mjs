import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, appCss, homeCategories, component, css] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
  readFile(new URL("../src/features/home/HomeCategoryGrid.jsx", import.meta.url), "utf8"),
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
assert.match(component, /import \{ HERO_IMAGE_MANIFEST \} from "\.\.\/\.\.\/heroImageManifest\.js"/);
assert.match(component, /RECIPE_HERO_BY_CODE\.has\(String\(recipe\.id \|\| ""\)\.toUpperCase\(\)\)/);
assert.match(component, /recipeNumber <= 60/);
assert.match(component, /`images\/heroes\/\$\{code\}\.webp`/);
assert.doesNotMatch(component, /images\/thumbs\/recipes/);
assert.match(component, /className=\{`libraryCategorySelectorItem/);
assert.doesNotMatch(component, /libraryDiscoveryRecipeSubtitle/);
assert.match(component, /openRecipeCard\(recipe\.id, cardList, "Browse Our Recipe Library"\)/);
assert.match(component, /"Calories pending"/);
assert.match(component, /mealBalance === null \? "—" : mealBalance/);
assert.match(app, /\{activePage === "Home" && <HomeMealJourneyAccordion setActivePage=\{setActivePage\} \/>\}/);

assert.match(css, /\.recipeLibraryDiscoveryIntro[\s\S]*text-align: center/);
assert.match(css, /\.libraryCategorySelectorRow[\s\S]*grid-template-columns: repeat\(15, 1fr\)/);
assert.match(css, /\.libraryCategorySelectorRow[\s\S]*gap: 0/);
assert.match(css, /\.libraryCategorySelectorItem img,[\s\S]*width: min\(48px, 100%\)/);
assert.match(css, /\.libraryCategorySelectorItem\.category-cp img[\s\S]*object-fit: cover/);
assert.match(css, /text-transform: uppercase/);
assert.match(css, /\.recipeLibraryDiscoveryGrid[\s\S]*grid-template-columns: repeat\(6, minmax\(0, 1fr\)\)/);
assert.doesNotMatch(css, /overflow-x: auto/);
assert.match(css, /\.libraryDiscoveryRecipeText[\s\S]*height: clamp\(88px, 7\.4vw, 104px\)/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(homeCategories, /code === "QP"[\s\S]*\? "Quiche"[\s\S]*code === "SD"[\s\S]*\? "Sides"/);
assert.match(homeCategories, /className="categoryGrid homeCategoryGrid libraryCategorySelectorRow homeCuisineSelectorRow"/);
assert.match(homeCategories, /homeFavoritesCategoryTile libraryCategorySelectorItem/);
assert.match(homeCategories, /libraryCategorySelectorItem\$\{category\.id === "CP" \? " category-cp" : ""\}/);
assert.doesNotMatch(homeCategories, /libraryCategorySelectorAll/);
assert.match(appCss, /compact homepage cuisine selector[\s\S]*grid-template-columns: repeat\(14, 1fr\)/);
assert.match(appCss, /compact homepage cuisine selector[\s\S]*gap: 0 !important/);
assert.match(appCss, /\.homeCategoryGrid \.crockPotCategoryIcon[\s\S]*object-fit: cover/);
assert.match(appCss, /\.homeCategoryGrid \.categoryTile strong,[\s\S]*text-transform: uppercase/);

console.log("v88.1 Recipe Library discovery selector and rotating-card contracts passed.");
