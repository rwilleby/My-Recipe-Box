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
const icon = path.join(root, "public/images/categories/FZ.webp");

assert.equal(FREEZER_FRIENDLY_COMPLETE_DINNER_NUMBERS.length, 43);
assert.equal(new Set(FREEZER_FRIENDLY_COMPLETE_DINNER_NUMBERS).size, 43);
assert.equal(isFreezerFriendlyCompleteDinner({ number: 71 }), true);
assert.equal(isFreezerFriendlyCompleteDinner({ number: 73 }), false);
assert.match(app, /isFreezerFriendlyCompleteDinner\(meal\)/);
assert.match(app, /isFreezerFriendly && <span title="Freezer Friendly">FF<\/span>/);
assert.doesNotMatch(app, /className="compactDinnerFreezerFriendly"/);
assert.match(app, /compactDinnerCardActionRow/);
assert.equal(fs.existsSync(icon), true, "FZ.webp must be deployed with the site");

console.log("v99.1 Complete Dinner freezer-friendly text contract passed.");
