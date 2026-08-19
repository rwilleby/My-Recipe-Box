import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [app, css] = await Promise.all([
  readFile(new URL("../src/App.jsx", import.meta.url), "utf8"),
  readFile(new URL("../src/App.css", import.meta.url), "utf8"),
]);

const recipesPage = app.slice(
  app.indexOf("function RecipesPage("),
  app.indexOf("function MealPlanPage("),
);

assert.match(recipesPage, /setActivePage,/);
assert.match(recipesPage, /id: "FAVORITES"[\s\S]*displayName: "Favorites"[\s\S]*images\/category-icons\/favorites\.webp/);
assert.ok(
  recipesPage.indexOf('id: "FAVORITES"') < recipesPage.indexOf("HOME_CATEGORY_CODES.slice(0, 13)"),
  "Favorites should be the first Browse Recipe Library category",
);
assert.match(recipesPage, /category\?\.id === "FAVORITES"[\s\S]*setActivePage\("Favorites"\)/);

const ipadHeroQuery = /@media \(min-width: 721px\) and \(max-width: 1100px\) and \(hover: none\) and \(pointer: coarse\)/;
assert.match(css, ipadHeroQuery);
assert.doesNotMatch(
  css.slice(css.indexOf("v83.3 — CROCK POT NUTRITION")),
  /@media \(min-width: 721px\) and \(max-width: 1100px\) \{[\s\S]{0,900}font-size: clamp\(9\.5px, 1\.22vw, 12px\)/,
  "the smaller iPad hero text must not apply to desktop pointers",
);

const finalCentering = css.slice(
  css.lastIndexOf("v83.8 — FINAL HORIZONTAL CENTERING FOR CATEGORY ICON ROWS"),
);
assert.match(finalCentering, /\.browseCategoryQuickFilterRow > :nth-child\(11\) \{[\s\S]*grid-column: 4 !important/);

console.log("v83.9 desktop hero and Browse Recipe Library category contracts passed.");
