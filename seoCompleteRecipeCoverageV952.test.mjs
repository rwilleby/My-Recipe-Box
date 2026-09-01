import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { recipes } from "../src/data/recipes.js";
import { seoForRecipe } from "../src/routing/seoRoutes.js";

assert.equal(recipes.length, 783, "the authoritative recipe catalog must include all approved Vegan sister recipes");
assert.equal(new Set(recipes.map(({ id }) => id)).size, 783, "recipe codes must be unique");

for (const recipe of recipes) {
  const seo = seoForRecipe(recipe);
  assert.equal(seo.structuredData["@type"], "Recipe");
  assert.equal(seo.structuredData.identifier, recipe.id);
  assert.ok(seo.structuredData.name && seo.structuredData.url && seo.structuredData.image.length);
  if (recipe.ingredients?.length) assert.equal(seo.structuredData.recipeIngredient.length, recipe.ingredients.length);
  else assert.ok(!("recipeIngredient" in seo.structuredData));
  if (recipe.directions?.length) assert.equal(seo.structuredData.recipeInstructions.length, recipe.directions.length);
  else assert.ok(!("recipeInstructions" in seo.structuredData));
}

// The release gate runs tests before `npm run build`, so this contract must not
// depend on a pre-existing dist directory. Verify the build generator directly;
// the following build step then executes it and fails naturally on generation errors.
const generator = await readFile(new URL("../scripts/generate-seo.mjs", import.meta.url), "utf8");
assert.match(generator, /import \{ recipes \} from "\.\.\/src\/data\/recipes\.js"/);
assert.match(generator, /for \(const recipe of recipes\)/);
assert.match(generator, /seoForRecipe\(recipe\)/);
assert.match(generator, /\.\.\.recipes\.map\(\(recipe\) => routeForRecipe\(recipe\.id\)\)/);
assert.match(generator, /type="application\/ld\+json"/);
assert.doesNotMatch(generator, /<lastmod>/, "sitemap must not publish a fabricated last-modified date");

console.log("SEO complete recipe coverage v95.2 contracts passed.");
