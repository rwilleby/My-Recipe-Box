import assert from "node:assert/strict";
import fs from "node:fs";
import { BASE_KITCHEN_PRODUCTS, baseProductName } from "../src/data/baseKitchenProducts.js";
import { MASTER_KITCHEN_INVENTORY_TAXONOMY } from "../src/data/masterKitchenInventoryTaxonomy.js";

const page = fs.readFileSync("src/components/MasterKitchenInventoryPage.jsx", "utf8");
const approved = new Map(MASTER_KITCHEN_INVENTORY_TAXONOMY.map((category) => [category.id, new Set(category.products)]));

assert.ok(BASE_KITCHEN_PRODUCTS.length >= 175, "the first curated release has broad household coverage");
assert.equal(new Set(BASE_KITCHEN_PRODUCTS.map((item) => item.id)).size, BASE_KITCHEN_PRODUCTS.length, "base product IDs are stable and unique");
assert.ok(BASE_KITCHEN_PRODUCTS.every((item) => approved.get(item.categoryId)?.has(item.family)), "every base product uses the approved taxonomy");
assert.ok(BASE_KITCHEN_PRODUCTS.every((item) => item.family && item.variation && item.unit && item.storage), "base products provide the fields needed for quick entry");

for (const name of [
  "Cheese — Grated Parmesan",
  "Cheese — Sliced American",
  "Cheese — Shredded Cheddar",
  "Milk — Whole",
  "Milk — 2%",
  "Eggs — Large",
  "Coffee — Ground Medium Roast",
]) assert.ok(BASE_KITCHEN_PRODUCTS.some((item) => baseProductName(item) === name), `${name} is selectable`);

assert.ok(BASE_KITCHEN_PRODUCTS.some((item) => item.aliases.includes("hamburger")), "search aliases support common names");
assert.ok(BASE_KITCHEN_PRODUCTS.some((item) => item.aliases.includes("k cups")), "search aliases support store and receipt wording");
assert.doesNotMatch(fs.readFileSync("src/data/baseKitchenProducts.js", "utf8"), /Walmart|Great Value|H-E-B|Kroger/i, "brands and retailers remain outside the generic catalog");

assert.match(page, /BASE_KITCHEN_PRODUCTS/);
assert.match(page, /baseProductName/);
assert.match(page, /Product Family/);
assert.match(page, /Product name or variety/);
assert.match(page, /customItems: safe\.customItems\.some/);
assert.match(page, /item\.aliases/);

console.log("v96.7 curated base Kitchen Product List contracts passed.");
