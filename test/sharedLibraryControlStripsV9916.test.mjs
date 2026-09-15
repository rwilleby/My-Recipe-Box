import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/App.css"), "utf8");
const discovery = fs.readFileSync(path.join(root, "src/features/recipe-library/RecipeLibraryDiscovery.jsx"), "utf8");

assert.match(app, /className="dinnerCategorySegmented healthyDinnerSegmented"[\s\S]*\["all", "ALL"\]/);
assert.match(app, /className="slowCookerGroupTabs"[\s\S]*activeGroup === "all"[\s\S]*ALL/);
assert.match(app, /className="dinnerCategorySegmented favoritesControlStrip"/);
for (const label of ["ALL", "RECIPES", "COMPLETE DINNERS", "BUILD-A-MEALS"]) {
  assert.match(app, new RegExp(`\\["[^"]+", "${label}"\\]`));
}
assert.match(discovery, /className="dinnerCategorySegmented libraryControlStrip"/);
assert.match(discovery, /placeholder="Search for\.\.\."/);
assert.match(discovery, /className="completeDinnerProteinFilter libraryMoreCategoryFilter"/);
assert.match(discovery, /<option value="">MORE<\/option>/);
assert.match(css, /\.libraryControlStrip\s*\{[\s\S]*repeat\(9/);
assert.match(css, /\.favoritesControlStrip\s*\{[\s\S]*repeat\(4/);
assert.match(css, /\.healthyDinnerSegmented\s*\{grid-template-columns: repeat\(8/);
assert.match(css, /\.slowCookerGroupTabs\s*\{grid-template-columns: minmax\(145px, 1\.15fr\) repeat\(7/);

console.log("v99.16 shared library control-strip contracts passed.");
