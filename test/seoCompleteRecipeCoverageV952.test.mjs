import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { recipes } from "../src/data/recipes.js";
import { seoForRecipe } from "../src/routing/seoRoutes.js";

assert.equal(recipes.length, 762, "the authoritative recipe catalog must contain 762 recipes");
assert.equal(new Set(recipes.map(({ id }) => id)).size, 762, "recipe codes must be unique");

for (const recipe of recipes) {
  const seo = seoForRecipe(recipe);
  assert.equal(seo.structuredData["@type"], "Recipe");
  assert.equal(seo.structuredData.identifier, recipe.id);
  assert.ok(seo.structuredData.name && seo.structuredData.url && seo.structuredData.image.length);
  if (recipe.ingredients?.length) assert.equal(seo.structuredData.recipeIngredient.length, recipe.ingredients.length);
  else assert.ok(!("recipeIngredient" in seo.structuredData));
  if (recipe.directions?.length) assert.equal(seo.structuredData.recipeInstructions.length, recipe.directions.length);
  else assert.ok(!("recipeInstructions" in seo.structuredData));
  const output = new URL(`../dist${seo.path}index.html`, import.meta.url);
  await stat(output);
  const html = await readFile(output, "utf8");
  assert.match(html, /<script type="application\/ld\+json">/);
  assert.match(html, new RegExp(`"identifier":"${recipe.id}"`));
  assert.match(html, new RegExp(`<link rel="canonical" href="${seo.structuredData.url}"`));
}

const sitemap = await readFile(new URL("../dist/sitemap.xml", import.meta.url), "utf8");
const recipeUrls = [...sitemap.matchAll(/<loc>https:\/\/www\.roberts-recipe-box\.com\/recipes\/[^<]+<\/loc>/g)];
assert.equal(recipeUrls.length, 762, "sitemap must contain every recipe exactly once");
assert.doesNotMatch(sitemap, /<lastmod>/, "sitemap must not publish a fabricated last-modified date");

console.log("SEO complete recipe coverage v95.2 contracts passed.");
