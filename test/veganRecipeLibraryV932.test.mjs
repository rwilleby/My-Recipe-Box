import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { recipes } from "../src/data/recipes.js";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const css = await readFile(new URL("../src/App.css", import.meta.url), "utf8");
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
assert.match(app, /VEGAN_LIBRARY_CATEGORIES/);
assert.match(routes, /"Vegan Recipe Library": "\/vegan-recipes\/"/);

const veganRecipes = recipes.filter((recipe) => recipe.isVegan === true && recipe.veganStatus === "verified");
assert.equal(veganRecipes.length, 51);
assert.deepEqual(veganRecipes.filter((recipe) => recipe.categoryCode === "VG").map((recipe) => recipe.id), Array.from({ length: 30 }, (_, index) => `VG-${String(index + 1).padStart(3, "0")}`));
assert.ok(veganRecipes.some((recipe) => recipe.id === "AM-007-VG" && recipe.originalRecipeId === "AM-007"));
for (const id of ["AM-025-VG", "AS-019-VG", "IT-023-VG", "MX-008-VG", "SF-005-VG"]) {
  assert.ok(veganRecipes.some((recipe) => recipe.id === id), `${id} must appear in the Vegan Recipe Library`);
}
for (const id of ["AM-001-VG", "AM-009-VG", "AS-007-VG", "AS-010-VG", "IT-020-VG"]) {
  assert.ok(veganRecipes.some((recipe) => recipe.id === id), `${id} must appear in the Vegan Recipe Library`);
}
for (const id of ["MX-006-VG", "AS-008-VG", "IT-015-VG", "IT-029-VG", "AM-020-VG"]) {
  assert.ok(veganRecipes.some((recipe) => recipe.id === id), `${id} must appear in the Vegan Recipe Library`);
}
for (const id of ["SF-004-VG", "CP-131-VG", "IT-030-VG", "AM-067-VG", "AM-030-VG"]) {
  assert.ok(veganRecipes.some((recipe) => recipe.id === id), `${id} must appear in the Vegan Recipe Library`);
}
assert.ok(veganRecipes.every((recipe) => recipe.dietaryTags.includes("vegan")));
assert.ok(veganRecipes.every((recipe) => recipe.veganLibraryCategoryId), "every Vegan recipe needs one type category");
assert.deepEqual(
  Object.fromEntries([...new Set(veganRecipes.map((recipe) => recipe.veganLibraryCategoryId))].sort().map((id) => [id, veganRecipes.filter((recipe) => recipe.veganLibraryCategoryId === id).length])),
  { VAF: 10, VBA: 10, VBR: 2, VMF: 4, VPM: 13, VPN: 7, VSB: 2, VSS: 3 },
);
assert.match(app, /Plant-Based Mains[\s\S]*images\/categories\/SG\.webp/);
for (const label of ["Bakes & Casseroles", "Pasta & Noodles", "Bowls & Rice", "Sandwiches & Burgers", "Asian Favorites", "Mexican Favorites", "Soups & Stews"]) {
  assert.ok(app.includes(label), `${label} Vegan category must be available`);
}
assert.match(app, /recipe\.veganLibraryCategoryId === selectedCategory/);
assert.match(app, /veganOnly\s*\?\s*category\?\.id \|\| ""\s*:\s*category\?\.name \|\| ""/);
for (const categoryId of ["VPM", "VBA", "VPN", "VBR", "VSB", "VAF", "VMF", "VSS"]) {
  const matches = veganRecipes.filter((recipe) => recipe.veganLibraryCategoryId === categoryId);
  assert.ok(matches.length > 0, `${categoryId} must return Vegan recipes when selected`);
}
assert.match(css, /\.veganLibraryCategorySelector\s*\{[\s\S]*grid-template-columns:\s*repeat\(9,\s*minmax\(0,\s*1fr\)\)/);
assert.match(css, /\.veganLibraryCategorySelector \.libraryCategorySelectorItem\s*\{[\s\S]*min-width:\s*0/);
assert.doesNotMatch(css, /\.veganLibraryCategorySelector \.libraryCategorySelectorItem\s*\{[^}]*min-width:\s*142px/);

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
