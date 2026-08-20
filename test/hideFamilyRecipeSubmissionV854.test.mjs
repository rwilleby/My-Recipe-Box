import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "src/App.jsx"), "utf8");

const navStart = source.indexOf("const NAV_GROUPS");
const navEnd = source.indexOf("const ", navStart + 10);
const navigation = source.slice(navStart, navEnd);

assert.ok(navStart >= 0, "Navigation configuration should exist");
assert.doesNotMatch(navigation, /SUBMIT YOUR FAMILY RECIPES/);
assert.doesNotMatch(navigation, /page: "Submit Recipes"/);
assert.match(source, /activePage === "Submit Recipes"/, "The hidden page should remain available in source for later restoration");

console.log("Submit Your Family Recipes is hidden from public navigation but preserved in source.");
