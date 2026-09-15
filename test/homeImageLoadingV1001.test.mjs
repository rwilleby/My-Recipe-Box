import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");
const categories = readFileSync(new URL("../src/features/home/HomeCategoryGrid.jsx", import.meta.url), "utf8");

assert.doesNotMatch(app, /SUPPORTING_PAGE_HERO_IMAGES|preloadAllSupportingHeroes/);
assert.doesNotMatch(app, /HERO_IMAGES\.forEach\(\(imagePath\)/);
assert.match(app, /HERO_IMAGES\[\(heroIndex \+ 1\) % HERO_IMAGES\.length\]/);
assert.match(app, /nextImage\.fetchPriority = "low"/);
assert.match(categories, /homeFavoritesCategoryIcon[\s\S]*loading="lazy"/);

console.log("v100.1 deferred image-loading performance contracts passed");
