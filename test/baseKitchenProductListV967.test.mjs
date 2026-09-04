import assert from "node:assert/strict";
import fs from "node:fs";
import { BASE_KITCHEN_CATEGORIES, BASE_KITCHEN_PRODUCTS, baseProductName } from "../src/data/baseKitchenProducts.js";

const selector = fs.readFileSync("src/components/BaseKitchenProductSelector.jsx", "utf8");
const categoryNames = ["Meat/Seafood", "Dairy/Eggs", "Breads", "Fresh Produce", "Deli", "Pantry/Canned", "Grains/Pasta", "Cereal/Breakfast", "Condiments", "Chips/Snacks", "Frozen Foods", "Beverages", "Household/Cleaning", "Pet Care"];
assert.deepEqual(BASE_KITCHEN_CATEGORIES.map((item) => item.title), categoryNames, "the 14 folders use the approved order");
assert.ok(BASE_KITCHEN_PRODUCTS.length >= 500 && BASE_KITCHEN_PRODUCTS.length <= 650, "the base list remains a practical starter catalog");
assert.equal(new Set(BASE_KITCHEN_PRODUCTS.map((item) => item.id)).size, BASE_KITCHEN_PRODUCTS.length, "base product IDs are stable and unique");
assert.ok(BASE_KITCHEN_PRODUCTS.every((item) => BASE_KITCHEN_CATEGORIES.some((category) => category.id === item.baseCategoryId)), "every product belongs to one approved folder");
for (const category of BASE_KITCHEN_CATEGORIES) assert.ok(BASE_KITCHEN_PRODUCTS.some((item) => item.baseCategoryId === category.id), `${category.title} is populated`);
for (const name of ["Cheese — Grated Parmesan", "Cheese — Sliced American", "Milk — Whole", "Eggs — Large", "Coffee — Ground Medium Roast", "Beef - Ground 90/10", "Chicken - Boneless Skinless Breasts", "Broth — Chicken Low Sodium", "Tomatoes - Diced No Salt Added", "Rice — Long-Grain White"]) assert.ok(BASE_KITCHEN_PRODUCTS.some((item) => baseProductName(item) === name), `${name} is selectable`);

const meat = BASE_KITCHEN_PRODUCTS.filter((item) => item.baseCategoryId === "meat-seafood");
assert.deepEqual([...new Set(meat.map((item) => item.family))], ["Beef", "Chicken", "Hot Dogs", "Pork", "Sausage", "Seafood", "Turkey"], "Meat/Seafood uses one alphabetical family list");
for (const name of ["Pork - Bacon - Sliced", "Chicken - Ground Lean", "Hot Dogs - Beef", "Pork - Ground - Regular", "Turkey - Ground - Lean", "Beef - Meatballs - Fresh", "Seafood - Fish - Catfish Fillets"]) assert.equal(meat.filter((item) => baseProductName(item) === name).length, 1, `${name} appears once`);
assert.equal(new Set(meat.map(baseProductName)).size, meat.length, "Meat/Seafood contains no duplicate display entries");
for (const [categoryId, families] of Object.entries({
  "dairy-eggs": ["Butter", "Cheese", "Cream", "Eggs", "Milk", "Yogurt"],
  breads: ["Bakery", "Bread", "Buns", "Rolls", "Tortillas"],
  produce: ["Fruits", "Vegetables"],
  "grains-pasta": ["Grain", "Noodles", "Pasta", "Rice"],
  condiments: ["Condiment", "Mustard", "Pasta", "Salad Dressing", "Salsa", "Sauce", "Vinegar"],
})) assert.deepEqual([...new Set(BASE_KITCHEN_PRODUCTS.filter((item) => item.baseCategoryId === categoryId).map((item) => item.family))], families, `${categoryId} uses the approved alphabetical subcategories`);
for (const name of ["Butter — Margarine", "Milk — Buttermilk", "Milk — Half-and-Half", "Cream — Sour Cream", "Bread — Bagels", "Bread — English Muffins", "Buns — Hamburger", "Buns — Hot Dog", "Fruits - Apples - Gala", "Beans — Charro", "Oatmeal — Old-Fashioned"]) assert.equal(BASE_KITCHEN_PRODUCTS.filter((item) => baseProductName(item) === name).length, 1, `${name} appears once`);
for (const name of ["Baking — Cake Mix", "Baking — Frosting", "Frozen Pizza"]) assert.ok(BASE_KITCHEN_PRODUCTS.find((item) => baseProductName(item) === name)?.variantOptions?.length, `${name} provides its requested dropdown`);
assert.ok(BASE_KITCHEN_PRODUCTS.some((item) => item.aliases.includes("hamburger")));
assert.ok(BASE_KITCHEN_PRODUCTS.some((item) => item.aliases.includes("k cups")));
assert.doesNotMatch(fs.readFileSync("src/data/baseKitchenProducts.js", "utf8"), /Walmart|Great Value|H-E-B|Kroger/i);
for (const text of ["Search Products", "How Many?", "Counted As", "Location", "Add Selected to Inventory", "Clear New Selections", "Update Inventory", "In Inventory", "Remove this product from Current Inventory?"]) assert.ok(selector.includes(text), `${text} is wired`);
for (const text of ["Select Flavor", "Select Type", "Short Notes", "variantOptions"]) assert.ok(selector.includes(text), `${text} is wired`);
assert.match(selector, /aria-expanded=/);
assert.match(selector, /Math\.max\(0/);
assert.match(selector, /baseCategoryId/);
console.log(`v96.7 base Kitchen Product List passed with ${BASE_KITCHEN_PRODUCTS.length} products in 14 folders.`);
