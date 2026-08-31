import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const app = read("src/App.jsx");
const homeRotations = read("src/features/home/HomeMealRotations.jsx");
const popupCopy = read("src/data/pagePopupCopy.js");
const routes = read("src/routing/seoRoutes.js");

assert.match(app, /title="Complete Dinners"[\s\S]*Complete Dinners are ready-made pairings/);
assert.match(app, /title="Recipes for Complete Dinners"[\s\S]*individual recipe cards/);
assert.match(app, /Favorite Complete Dinners/);
assert.doesNotMatch(app, />Combo-Meals</);
assert.match(homeRotations, /Ready-made Complete Dinners pair a main dish with practical sides/);
assert.match(popupCopy, /"Dinner Combinations": \{[\s\S]*title: "Complete Dinners"/);
assert.match(routes, /"Dinner Combinations": "Complete Dinners"/);
assert.match(routes, /"Complete Dinners": "\/collections\/recipes-for-complete-dinners\/"/);

console.log("v95.9 customer-facing terminology and route clarity contracts passed");
