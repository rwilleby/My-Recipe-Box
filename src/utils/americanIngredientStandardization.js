import { BASE_KITCHEN_CATEGORIES, BASE_KITCHEN_PRODUCTS, baseProductName } from "../data/baseKitchenProducts.js";

const CATEGORY_BY_AISLE = [
  ["Meat/Seafood", /meat|seafood/],
  ["Dairy/Eggs", /dairy/],
  ["Breads", /bread|bakery|refrigerated dough/],
  ["Produce", /produce/],
  ["Deli", /deli/],
  ["Grains/Pasta", /rice|pasta|grain/],
  ["Cereal/Breakfast", /cereal|breakfast/],
  ["Condiments", /sauce|condiment|spice|seasoning|oil|vinegar/],
  ["Chips/Snacks", /chip|snack/],
  ["Frozen Foods", /frozen/],
  ["Beverages", /beverage/],
];

const UNIT_ALIASES = Object.freeze({
  cups: "cup", cup: "cup", tbsp: "tablespoon", tsp: "teaspoon", lb: "pound", oz: "ounce",
  cloves: "clove", leaves: "leaf", slices: "slice", stalks: "stalk", stalk: "stalk",
  packet: "packet", sleeve: "sleeve", each: "each", "large head": "head",
});

const PREPARATION_WORDS = /\b(sliced|chopped|diced|minced|cubed|quartered|crumbled|crushed|drained|rinsed|melted|softened|thawed|cooked|uncooked|packed|divided|warmed|washed|dried|peeled|shredded|beaten|thinly|finely|crispy|chilled|for topping|for dish|for pan|for garnish|for serving|for frying|egg wash)\b/i;

export function normalizeIngredientIdentity(value = "") {
  return String(value).toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(?:fresh|cooked|prepared)\b/g, " ")
    .replace(/[^a-z0-9%]+/g, " ")
    .replace(/\s+/g, " ").trim();
}

function productAliases(product) {
  return [
    baseProductName(product),
    `${product.family} ${product.variation}`,
    `${product.variation} ${product.family}`,
    ...(product.aliases || []),
  ];
}

const aliasBuckets = new Map();
BASE_KITCHEN_PRODUCTS.forEach((product) => productAliases(product).forEach((alias) => {
  const key = normalizeIngredientIdentity(alias);
  if (!key) return;
  const bucket = aliasBuckets.get(key) || new Map();
  bucket.set(product.id, product);
  aliasBuckets.set(key, bucket);
}));

const EXACT_MASTER_INDEX = new Map(
  [...aliasBuckets.entries()].filter(([, bucket]) => bucket.size === 1)
    .map(([key, bucket]) => [key, [...bucket.values()][0]]),
);

const MASTER_NAME_OVERRIDES = Object.freeze({
  "large egg": "Eggs — Large",
  "large eggs": "Eggs — Large",
  "cream cheese": "Cheese — Cream",
  "shredded cheddar cheese": "Cheese — Shredded Cheddar",
  "shredded sharp cheddar cheese": "Cheese — Shredded Cheddar",
  "shredded mozzarella cheese": "Cheese — Shredded Mozzarella",
  "grated parmesan cheese": "Cheese — Grated Parmesan",
  "parmesan cheese": "Cheese — Grated Parmesan",
  "boneless skinless chicken breasts": "Chicken — Boneless Skinless Breasts",
  "boneless skinless chicken breast": "Chicken — Boneless Skinless Breasts",
  "boneless skinless chicken thighs": "Chicken — Boneless Skinless Thighs",
  "low sodium chicken broth": "Broth & Stock — Chicken Low Sodium",
  "low sodium beef broth": "Broth & Stock — Beef Low Sodium",
  "diced tomatoes": "Canned Tomatoes — Diced",
  "black beans": "Beans — Black",
  "kidney beans": "Beans — Kidney",
  "pinto beans": "Beans — Pinto",
  "tuna in water": "Canned Seafood — Tuna In Water",
  "long grain white rice": "Rice — Long-Grain White",
  "elbow macaroni": "Pasta — Elbow Macaroni",
  "black pepper": "Pepper — Ground Black",
  "sour cream": "Sour Cream — Regular",
  "buttermilk": "Buttermilk — Cultured",
  "heavy cream": "Cream — Heavy Whipping",
  "ketchup": "Ketchup — Regular",
  "tomato sauce": "Tomato Sauce — Regular",
  "cornstarch": "Pantry Staple — Cornstarch",
  "all purpose flour": "Flour — All-Purpose",
  "brown sugar": "Sugar & Sweeteners — Brown Sugar",
  "sandwich bread": "Sandwich Bread — White",
  "beef hot dogs": "Hot Dogs & Bratwurst — Beef Hot Dogs",
  "bacon": "Bacon — Sliced",
});

const productByDisplayName = new Map(BASE_KITCHEN_PRODUCTS.map((product) => [baseProductName(product), product]));

function initialCaps(value = "") {
  return String(value).toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
    .replace(/\bBbq\b/g, "BBQ").replace(/\bDijon\b/g, "Dijon");
}

function splitName(rawName = "") {
  const parts = String(rawName).split(",").map((part) => part.trim()).filter(Boolean);
  const nameParts = [parts.shift() || ""];
  const preparation = [];
  let packageSize = "";
  parts.forEach((part) => {
    if (/^\d+(?:[–-]\d+)?\s*(?:lb|oz)$/i.test(part)) packageSize = part.replace(/\blb\b/i, "pounds").replace(/\boz\b/i, "ounces");
    else if (PREPARATION_WORDS.test(part)) preparation.push(part);
    else nameParts.push(part);
  });
  let matchName = nameParts.join(" ");
  const leadingPreparation = matchName.match(/^(chopped|cooked|melted|prepared)\s+(.+)$/i);
  if (leadingPreparation) {
    preparation.unshift(leadingPreparation[1].toLowerCase());
    matchName = leadingPreparation[2];
  }
  return { matchName, preparation: preparation.join(", "), packageSize };
}

function normalizeUnit(rawUnit = "") {
  const value = String(rawUnit).trim();
  const optional = /\boptional\b/i.test(value);
  const instruction = value.match(/\b(?:as needed|to taste|for frying|for garnish|for serving)\b/i)?.[0] || "";
  const packageMatch = value.match(/^(\d+(?:\.\d+)?)\s*oz\s+(can|jar|bag)s?(?:,\s*(\d+)\s+(.+))?$/i);
  if (packageMatch) return {
    unitStandard: packageMatch[2].toLowerCase(),
    packageSize: `${packageMatch[1]} ounces`,
    packageCount: packageMatch[3] ? Number(packageMatch[3]) : null,
    packageContents: packageMatch[4] || "",
    optional,
    instruction,
  };
  const cleaned = value.replace(/,?\s*optional\b/ig, "").replace(/,?\s*or to taste\b/ig, "").trim().toLowerCase();
  return { unitStandard: UNIT_ALIASES[cleaned] || (instruction ? "" : cleaned), packageSize: "", packageCount: null, packageContents: "", optional, instruction };
}

function resolveMasterProduct(name) {
  const key = normalizeIngredientIdentity(name);
  const overrideName = MASTER_NAME_OVERRIDES[key];
  const product = overrideName ? productByDisplayName.get(overrideName) : EXACT_MASTER_INDEX.get(key);
  if (product) return { masterItemId: product.id, canonicalName: baseProductName(product), matchStatus: overrideName ? "approved-equivalence" : "exact" };
  if ((aliasBuckets.get(key)?.size || 0) > 1) return { masterItemId: "", canonicalName: initialCaps(name), matchStatus: "ambiguous" };
  return { masterItemId: "", canonicalName: initialCaps(name), matchStatus: "unmatched" };
}

export function standardizeAmericanIngredient(ingredient, recipeId = "") {
  const original = { ...ingredient };
  const parsedName = splitName(ingredient.name);
  const unit = normalizeUnit(ingredient.unit);
  const match = resolveMasterProduct(parsedName.matchName);
  const category = match.masterItemId
    ? BASE_KITCHEN_CATEGORIES.find((item) => item.id === productByDisplayName.get(match.canonicalName)?.baseCategoryId)?.title
    : CATEGORY_BY_AISLE.find(([, pattern]) => pattern.test(String(ingredient.aisle || "").toLowerCase()))?.[0] || "Pantry/Canned";
  const preparation = [parsedName.preparation, unit.instruction].filter(Boolean).join(", ");
  return {
    ...ingredient,
    originalName: original.name,
    originalUnit: original.unit,
    canonicalName: match.canonicalName,
    quantity: ingredient.qty,
    unitStandard: unit.unitStandard,
    packageSize: parsedName.packageSize || unit.packageSize,
    packageCount: unit.packageCount,
    packageContents: unit.packageContents,
    preparation,
    optional: unit.optional || /\boptional\b/i.test(preparation),
    masterItemId: match.masterItemId,
    matchStatus: match.matchStatus,
    inventoryCategory: category,
    auditSource: `${recipeId} illustrated recipe card transcription`,
  };
}

export function standardizeAmericanIngredients(recipeId, ingredients = []) {
  if (!/^AM-(?:00[1-9]|0[1-7]\d|078)$/.test(recipeId) || recipeId === "AM-063") return ingredients;
  return ingredients.map((ingredient) => standardizeAmericanIngredient(ingredient, recipeId));
}
