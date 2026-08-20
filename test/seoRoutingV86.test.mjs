import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  INDEXABLE_PAGE_IDS,
  parseRoute,
  routeForCompleteDinner,
  routeForPage,
  routeForRecipe,
} from "../src/routing/seoRoutes.js";

assert.equal(routeForPage("Safe Cooking Rules"), "/food-safety/");
assert.equal(routeForPage("Dinner Combinations"), "/complete-dinners/");
assert.equal(routeForRecipe("AM-001"), "/recipes/am-001/");
assert.equal(routeForCompleteDinner("CD-0001"), "/complete-dinners/cd-0001/");
assert.deepEqual(parseRoute("/recipes/am-001/"), {
  type: "recipe", pageId: "Recipes", code: "AM-001", path: "/recipes/am-001/",
});
assert.deepEqual(parseRoute("/complete-dinners/cd-0001/"), {
  type: "completeDinner", pageId: "Dinner Combinations", code: "CD-0001", path: "/complete-dinners/cd-0001/",
});
assert.ok(INDEXABLE_PAGE_IDS.includes("Recipes"));
assert.ok(!INDEXABLE_PAGE_IDS.includes("Favorites"));

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
assert.match(app, /window\.addEventListener\("popstate"/);
assert.match(app, /routeForRecipe\(recipe\.id\)/);
assert.match(app, /routeForCompleteDinner/);
assert.match(app, /applySeoMetadata/);
assert.match(app, /STORAGE_KEYS\.favorites/);
assert.match(app, /UserDataBackupSection/);

const fallback = await readFile(new URL("../public/404.html", import.meta.url), "utf8");
assert.match(fallback, /\?route=/);
assert.match(fallback, /window\.location\.pathname/);

console.log("SEO routing v86 contracts passed.");
