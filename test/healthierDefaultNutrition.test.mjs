import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const profileSource = await readFile(new URL("../src/data/recipeNutritionProfiles.js", import.meta.url), "utf8");
const json = JSON.parse(await readFile(new URL("../src/data/nutrition/healthier-default-v9.json", import.meta.url), "utf8"));

assert.equal(json.metadata.activeRecipeCount, 469);
assert.equal(json.metadata.usableFoodIntelligenceCount, 465);
assert.equal(json.metadata.notReadyCount, 4);
assert.equal(Boolean(json.recipes["AM-063"]), false);
assert.equal(json.recipes["AS-003"].readiness.status, "not-ready");
assert.ok(json.recipes["AM-008"].nutrition.sodium_mg < 200);
assert.match(profileSource, /healthier-default-v9\.json/);
assert.match(profileSource, /Stored nutrition values only/);
assert.match(profileSource, /HEALTHIER_DEFAULT_VARIANT_KEY/);
console.log("Healthier Default nutrition data contract passed.");
