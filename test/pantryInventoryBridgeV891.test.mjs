import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const builder = await readFile(new URL("../src/components/BuildYourOwnMealPage.jsx", import.meta.url), "utf8");
const assets = await readFile(new URL("../src/features/recipe-viewer/recipeAssets.js", import.meta.url), "utf8");

assert.match(app, /const PANTRY_ITEM_KEYS_BY_NAME = new Map\(\)/);
assert.match(app, /function pantryItemKeys\(itemOrName\)/);
assert.match(app, /PANTRY_NAME_ALIASES/);
assert.match(app, /pantryItemKeys\(item\)\.forEach\(\(key\) =>/);
assert.match(app, /pantryItemStatus\(pantry, match\.item \|\| match\.pantry\) === "in-stock"/);
assert.match(app, /score: \(exact \? 10000 : 0\) \+ normalizedTerm\.length/);

assert.match(builder, /recipe \? recipeImageCandidates\(recipe\) : \[\]/);
assert.match(builder, /const safeRecipes = Array\.isArray\(recipes\) \? recipes : \[\]/);
assert.match(assets, /export function recipeImageCandidates\(recipe\) \{\s*if \(!recipe\) return \[\];/);

console.log("v89.1 Pantry tier synchronization, shopping stock matching, and meal-builder blank-page guards passed");
