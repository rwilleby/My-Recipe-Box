import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  FREEZER_FRIENDLY_COMPLETE_DINNER_NUMBERS,
  isFreezerFriendlyCompleteDinner,
} from "../src/data/completeDinnerFreezerRatings.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");
const css = fs.readFileSync(path.join(root, "src/App.css"), "utf8");
const icon = path.join(root, "public/images/categories/FZ.webp");

assert.equal(FREEZER_FRIENDLY_COMPLETE_DINNER_NUMBERS.length, 43);
assert.equal(new Set(FREEZER_FRIENDLY_COMPLETE_DINNER_NUMBERS).size, 43);
assert.equal(isFreezerFriendlyCompleteDinner({ number: 71 }), true);
assert.equal(isFreezerFriendlyCompleteDinner({ number: 73 }), false);
assert.match(app, /isFreezerFriendlyCompleteDinner\(meal\)/);
assert.match(app, /images\/categories\/FZ\.webp/);
assert.match(app, /compactDinnerCardActionRow/);
assert.match(css, /\.compactDinnerFreezerFriendly/);
assert.equal(fs.existsSync(icon), true, "FZ.webp must be deployed with the site");

console.log("v96.3 Complete Dinner freezer-friendly icon contract passed.");
