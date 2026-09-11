import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

assert.match(app, /siteMode === "detailed" && <HomePhotoFeatureSection/);
assert.match(app, /YOUR KITCHEN INVENTORY", page: "Master Kitchen Inventory", detailedOnly: true/);
assert.match(app, /FREEZER LABEL MAKER", page: "Freezer Label Maker", detailedOnly: true/);
assert.match(app, /RECIPE ADJUSTMENTS & SUBSTITUTIONS", page: "Grocery Picks"/);
assert.doesNotMatch(app, /RECIPE ADJUSTMENTS & SUBSTITUTIONS", page: "Grocery Picks", detailedOnly: true/);
assert.match(app, /RECOMMENDED KITCHEN TOOLS & STORAGE", page: "Products I Use"/);
assert.doesNotMatch(app, /RECOMMENDED KITCHEN TOOLS & STORAGE", page: "Products I Use", detailedOnly: true/);

console.log("Easy mode visibility tests passed.");
