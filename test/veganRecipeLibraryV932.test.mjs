import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { recipes } from "../src/data/recipes.js";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const routes = await readFile(new URL("../src/routing/seoRoutes.js", import.meta.url), "utf8");
const veganData = await readFile(new URL("../src/data/veganRecipes.js", import.meta.url), "utf8");
const guides = await readFile(new URL("../src/data/howItWorksGuides.js", import.meta.url), "utf8");

assert.match(app, /BROWSE OUR RECIPE LIBRARY[\s\S]*VEGAN RECIPE LIBRARY[\s\S]*YOUR FAVORITE RECIPES/);
assert.match(app, /title="Vegan Recipe Library"/);
assert.match(app, /Every recipe shown here is prepared without meat, seafood, dairy, eggs or other animal-derived ingredients/);
assert.match(app, /src="images\/heroes\/vegan-recipe-library-hero-1440x464\.webp"/);
assert.match(guides, /\["Vegan Recipe Library", "vegan-recipe-library"\]/);
assert.match(app, /recipe\.isVegan === true && recipe\.veganStatus === "verified"/);
assert.match(app, /No vegan recipes match your current selections\./);
assert.match(app, /code === "VG" \? "images\/categories\/VG\.webp"/);
assert.match(routes, /"Vegan Recipe Library": "\/vegan-recipes\/"/);

const veganRecipes = recipes.filter((recipe) => recipe.isVegan === true && recipe.veganStatus === "verified");
assert.equal(veganRecipes.length, 31);
assert.deepEqual(veganRecipes.filter((recipe) => recipe.categoryCode === "VG").map((recipe) => recipe.id), Array.from({ length: 30 }, (_, index) => `VG-${String(index + 1).padStart(3, "0")}`));
assert.ok(veganRecipes.some((recipe) => recipe.id === "AM-007-VG" && recipe.originalRecipeId === "AM-007"));
assert.ok(veganRecipes.every((recipe) => recipe.dietaryTags.includes("vegan")));

const prohibitedUnqualified = /(^|\b)(beef|chicken|pork|turkey|fish sauce|oyster sauce|shrimp paste|gelatin|lard|honey|egg|eggs|butter|cheese|mayonnaise)(\b|$)/i;
for (const recipe of veganRecipes) {
  assert.ok(recipe.ingredients.length >= 8, `${recipe.id} needs complete vegan ingredient data`);
  for (const ingredient of recipe.ingredients) {
    const name = String(ingredient.name || "");
    if (/plant-based|plant milk|vegan|egg-free/i.test(name)) continue;
    assert.doesNotMatch(name, prohibitedUnqualified, `${recipe.id} has an unqualified animal-derived ingredient: ${name}`);
  }
}

for (let index = 1; index <= 30; index += 1) {
  const code = `VG-${String(index).padStart(3, "0")}`;
  const asset = new URL(`../public/images/recipes/${code}.webp`, import.meta.url);
  await access(asset);
  assert.ok((await stat(asset)).size > 0, `${code}.webp must not be empty`);
  assert.match(veganData, new RegExp(`"${code}"`));
}

const veganIcon = new URL("../public/images/categories/VG.webp", import.meta.url);
await access(veganIcon);
assert.ok((await stat(veganIcon)).size > 0, "VG.webp must not be empty");

console.log("Vegan Recipe Library v93.2 tests passed.");
