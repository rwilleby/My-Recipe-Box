import assert from "node:assert/strict";
import fs from "node:fs";
import { recipes } from "../src/data/recipes.js";
import {
  canonicalShoppingName,
  consolidateShoppingItems,
} from "../src/utils/ingredientNormalization.js";
import { buildShoppingList, formatQty } from "../src/utils/planning.js";

const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

const consolidated = consolidateShoppingItems([
  { name: "Boneless skinless chicken breast, cubed", qty: 12, unit: "oz", aisle: "Meat" },
  { name: "Boneless skinless chicken breasts", qty: 1.5, unit: "lb", aisle: "Meat" },
  { name: "Boneless skinless chicken breast, 4 thin cutlets", qty: 12, unit: "oz", aisle: "Meat" },
  { name: "Cooked chicken breast, diced", qty: 8, unit: "oz", aisle: "Meat" },
  { name: "Cooked chicken breast, sliced", qty: 12, unit: "oz", aisle: "Meat" },
  { name: "Cooked chicken breast, shredded", qty: 4, unit: "oz", aisle: "Meat" },
  { name: "Reduced-fat milk", qty: 1.25, unit: "cups", aisle: "Dairy" },
  { name: "Low-fat milk", qty: 2, unit: "tbsp", aisle: "Dairy" },
  { name: "Evaporated skim milk", qty: 1, unit: "cup", aisle: "Dairy" },
  { name: "Cooked mashed potatoes", qty: 1.5, unit: "cups", aisle: "Prepared Sides" },
  { name: "Prepared mashed potatoes", qty: 2, unit: "cups", aisle: "Prepared Sides" },
  { name: "Grated Parmesan", qty: 0.25, unit: "cup", aisle: "Dairy" },
  { name: "Grated Parmesan cheese", qty: 2, unit: "tbsp", aisle: "Dairy" },
  { name: "Large egg white", qty: 1, unit: "each", aisle: "Dairy" },
  { name: "Large egg white, beaten", qty: 2, unit: "each", aisle: "Dairy" },
]);

function item(name) {
  return consolidated.find((entry) => entry.name === name);
}

assert.equal(item("Boneless skinless chicken breasts (raw)")?.qty, 3);
assert.equal(item("Boneless skinless chicken breasts (raw)")?.unit, "lb");
assert.deepEqual(item("Boneless skinless chicken breasts (raw)")?.preparationNotes, ["cubed", "4 thin cutlets"]);
assert.equal(item("Cooked chicken breast")?.qty, 24);
assert.equal(item("Cooked chicken breast")?.unit, "oz");
assert.deepEqual(item("Cooked chicken breast")?.preparationNotes, ["diced", "sliced", "shredded"]);
assert.equal(item("Low-fat milk")?.qty, 1.375);
assert.equal(item("Low-fat milk")?.unit, "cups");
assert.equal(formatQty(item("Low-fat milk")?.qty), "1⅜");
assert.equal(item("Prepared mashed potatoes")?.qty, 3.5);
assert.equal(item("Grated Parmesan")?.qty, 0.375);
assert.equal(item("Grated Parmesan")?.unit, "cups");
assert.equal(formatQty(item("Grated Parmesan")?.qty), "⅜");
assert.equal(item("Large egg white")?.qty, 3);
assert.ok(item("Evaporated skim milk"), "evaporated milk must remain a separate product");
assert.equal(consolidated.length, 7);

assert.equal(canonicalShoppingName("Reduced-fat milk"), "Low-fat milk");
assert.equal(canonicalShoppingName("Cooked chicken breast, sliced"), "Cooked chicken breast");
assert.equal(canonicalShoppingName("Chicken breast, cut into 1-inch pieces"), "Boneless skinless chicken breasts (raw)");
assert.equal(canonicalShoppingName("Chicken breast, thinly sliced, or 1 lb shrimp, peeled and deveined"), "Chicken breast, thinly sliced, or 1 lb shrimp, peeled and deveined");
assert.equal(canonicalShoppingName("Grated Parmesan cheese"), "Grated Parmesan");
assert.equal(canonicalShoppingName("Large egg white, beaten"), "Large egg white");
assert.equal(canonicalShoppingName("Light coconut milk"), "Light coconut milk");

const sampleRecipes = [
  {
    id: "TEST-1",
    servings: 4,
    ingredients: [
      { name: "Cooked chicken breast, diced", qty: 8, unit: "oz", aisle: "Meat", cost: 0 },
      { name: "Reduced-fat milk", qty: 1, unit: "cup", aisle: "Dairy", cost: 0 },
    ],
  },
  {
    id: "TEST-2",
    servings: 4,
    ingredients: [
      { name: "Cooked chicken breast, sliced", qty: 12, unit: "oz", aisle: "Meat", cost: 0 },
      { name: "Low-fat milk", qty: 4, unit: "tbsp", aisle: "Dairy", cost: 0 },
    ],
  },
];
const built = buildShoppingList({ slot: ["TEST-1", "TEST-2"] }, sampleRecipes, 4);
assert.equal(built.find((entry) => entry.name === "Cooked chicken breast")?.qty, 20);
assert.equal(built.find((entry) => entry.name === "Low-fat milk")?.qty, 1.25);

const dm023 = recipes.find((recipe) => recipe.id === "DM-023");
assert.ok(dm023.ingredients.some((entry) => entry.name === "Cooked chicken breast, diced"));
assert.match(app, /items: \(recipe\.ingredients \|\| \[\]\)\.map/);
assert.match(app, /return consolidateShoppingItems\(items\)/);
assert.match(app, /canonicalShoppingName\(itemName\)/);

console.log("v84.7 shopping-list normalization contracts passed.");
