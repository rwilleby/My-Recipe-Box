import { BASE_KITCHEN_CATEGORIES, BASE_KITCHEN_PRODUCTS, baseProductName } from "../data/baseKitchenProducts.js";

const CATEGORY_BY_AISLE = [
  ["Meat/Seafood", /meat|seafood/],
  ["Dairy/Eggs", /dairy/],
  ["Breads", /bread|bakery|refrigerated dough/],
  ["Fresh Produce", /produce/],
  ["Deli", /deli/],
  ["Grains/Pasta", /rice|pasta|grain/],
  ["Cereal/Breakfast", /cereal|breakfast/],
  ["Condiments", /sauce|condiment|spice|seasoning|oil|vinegar/],
  ["Chips/Snacks", /chip|snack/],
  ["Frozen Foods", /frozen/],
  ["Beverages", /beverage/],
];

export const APPROVED_INVENTORY_SUBCATEGORIES = Object.freeze({
  "Meat/Seafood": Object.freeze(["Beef", "Chicken", "Pork", "Turkey", "Seafood", "Sausage"]),
  "Dairy/Eggs": Object.freeze(["Butter", "Cheese", "Eggs", "Milk", "Cream", "Yogurt"]),
  Breads: Object.freeze(["Buns", "Bread", "Rolls", "Bakery", "Tortillas"]),
  "Fresh Produce": Object.freeze([]), // Produce kinds are the subcategories and may expand as recipes are audited.
  Deli: Object.freeze(["Deli Meat", "Deli Cheese", "Deli Salad", "Deli Prepared"]),
  "Pantry/Canned": Object.freeze(["Beans", "Broth", "Fruit", "Tomato", "Vegetables", "Soups", "Poultry", "Seafood", "Meats", "Baking", "Staples"]),
  "Grains/Pasta": Object.freeze(["Oats", "Pasta", "Rice", "Grain", "Noodles", "Potatoes"]),
  "Cereal/Breakfast": Object.freeze(["Cereal", "Oatmeal", "Hot Cereals", "Mixes", "Bars", "Syrups", "Jams/Jellies"]),
  Condiments: Object.freeze(["Condiment", "Pasta", "Salad Dressing", "Salsa", "Sauce", "Vinegar", "Mustard"]),
  "Chips/Snacks": Object.freeze(["Chips", "Crackers", "Nuts", "Sweet Snacks", "Salty Snacks", "Cookies", "Cakes"]),
  "Frozen Foods": Object.freeze(["Fruit", "Beef", "Poultry", "Seafood", "Vegetables", "Pizza", "Breads", "Ice Cream", "Potatoes", "Meals", "Breakfast"]),
  Beverages: Object.freeze(["Coffee", "Tea", "Water", "Juices", "Soft Drinks"]),
  "Household/Cleaning": Object.freeze(["Paper", "Trash", "Dish", "Laundry", "Cleaners", "Supplies"]),
  "Pet Care": Object.freeze(["Dog", "Cat"]),
});

const FRESH_PRODUCE_KINDS = [
  ["Apple", /\bapples?\b/i], ["Asparagus", /\basparagus\b/i], ["Avocado", /\bavocados?\b/i],
  ["Banana", /\bbananas?\b/i], ["Bean", /\b(green|wax) beans?\b/i], ["Beet", /\bbeets?\b/i],
  ["Broccoli", /\bbroccoli\b/i], ["Brussels Sprout", /\bbrussels? sprouts?\b/i], ["Cabbage", /\b(cabbage|coleslaw mix)\b/i],
  ["Carrot", /\bcarrots?\b/i], ["Cauliflower", /\bcauliflower\b/i], ["Celery", /\bcelery\b/i],
  ["Corn", /\b(corn|ears?)\b/i], ["Cucumber", /\bcucumbers?\b/i], ["Garlic", /\bgarlic\b/i],
  ["Lemon", /\blemons?\b/i], ["Lettuce", /\b(lettuce|romaine)\b/i], ["Lime", /\blimes?\b/i],
  ["Mushroom", /\bmushrooms?\b/i], ["Onion", /\b(onions?|shallots?|scallions?|green onions?)\b/i],
  ["Pea", /\bpeas?\b/i], ["Pepper", /\b(peppers?|jalape[nñ]os?|chiles?)\b/i], ["Potato", /\bpotato(?:es)?\b/i],
  ["Spinach", /\bspinach\b/i], ["Sweet Potato", /\b(sweet potatoes?|yams?)\b/i],
  ["Tomato", /\btomatoes?\b/i], ["Zucchini", /\bzucchini\b/i],
  ["Herbs", /\b(parsley|cilantro|basil|rosemary|thyme|dill|chives|mint)\b/i],
];

function approvedCategoryAndSubcategory(name = "", aisle = "") {
  const value = `${name} ${aisle}`.toLowerCase();
  const has = (pattern) => pattern.test(value);

  if (has(/\bfrozen\b/)) {
    if (has(/fruit|berr|peach|mango|pineapple|cherr/)) return ["Frozen Foods", "Fruit"];
    if (has(/beef|meatball/)) return ["Frozen Foods", "Beef"];
    if (has(/chicken|turkey|poultry/)) return ["Frozen Foods", "Poultry"];
    if (has(/fish|shrimp|salmon|seafood|crab/)) return ["Frozen Foods", "Seafood"];
    if (has(/potato|fries|hash brown|tater tot/)) return ["Frozen Foods", "Potatoes"];
    if (has(/bread|roll|biscuit|dough|pie crust/)) return ["Frozen Foods", "Breads"];
    if (has(/pizza/)) return ["Frozen Foods", "Pizza"];
    if (has(/ice cream|sherbet|sorbet|popsicle/)) return ["Frozen Foods", "Ice Cream"];
    if (has(/breakfast|waffle|pancake/)) return ["Frozen Foods", "Breakfast"];
    if (has(/vegetable|corn|peas|beans|broccoli|spinach|carrot|cauliflower/)) return ["Frozen Foods", "Vegetables"];
    return ["Frozen Foods", "Meals"];
  }

  if (has(/\b(deli|lunch meat|salami|capicola|prosciutto|bologna|pastrami)\b/)) {
    if (has(/cheese/)) return ["Deli", "Deli Cheese"];
    if (has(/salad/)) return ["Deli", "Deli Salad"];
    if (has(/prepared|sandwich|meal/)) return ["Deli", "Deli Prepared"];
    return ["Deli", "Deli Meat"];
  }
  if (has(/\bcoleslaw\b/)) return ["Deli", "Deli Salad"];
  if (has(/\bpickles?\b/)) return ["Condiments", "Condiment"];

  if (has(/\b(canned|can of|condensed|broth|stock|bouillon|tomato paste|tomato sauce|soup)\b/)) {
    if (has(/beans?|refried/)) return ["Pantry/Canned", "Beans"];
    if (has(/broth|stock|bouillon/)) return ["Pantry/Canned", "Broth"];
    if (has(/fruit|peach|pear|pineapple|cherr|apple/)) return ["Pantry/Canned", "Fruit"];
    if (has(/tomato/)) return ["Pantry/Canned", "Tomato"];
    if (has(/soup/)) return ["Pantry/Canned", "Soups"];
    if (has(/chicken|turkey|poultry/)) return ["Pantry/Canned", "Poultry"];
    if (has(/tuna|salmon|crab|shrimp|seafood/)) return ["Pantry/Canned", "Seafood"];
    if (has(/beef|ham|pork|meat/)) return ["Pantry/Canned", "Meats"];
    return ["Pantry/Canned", "Vegetables"];
  }

  if (has(/\b(ground beef|beef|steak|roast|brisket|stew meat|cube steaks?)\b/)) return ["Meat/Seafood", "Beef"];
  if (has(/\b(chicken|poultry)\b/)) return ["Meat/Seafood", "Chicken"];
  if (has(/\b(pork|ham|bacon)\b/)) return ["Meat/Seafood", "Pork"];
  if (has(/\bturkey\b/)) return ["Meat/Seafood", "Turkey"];
  if (has(/\b(sausage|bratwurst|kielbasa|chorizo|hot dogs?)\b/)) return ["Meat/Seafood", "Sausage"];
  if (has(/\b(fish|shrimp|salmon|tuna|crab|seafood|tilapia|cod|catfish|scallops?)\b/)) return ["Meat/Seafood", "Seafood"];

  if (has(/\bbutter\b/) && !has(/peanut|almond|nut butter/)) return ["Dairy/Eggs", "Butter"];
  if (has(/\b(cheese|cheddar|mozzarella|parmesan|provolone|ricotta|feta)\b/)) return ["Dairy/Eggs", "Cheese"];
  if (has(/\b(eggs?|egg whites?|egg yolks?)\b/)) return ["Dairy/Eggs", "Eggs"];
  if (has(/\b(milk|buttermilk)\b/)) return ["Dairy/Eggs", "Milk"];
  if (has(/\b(cream|half-and-half|sour cream)\b/)) return ["Dairy/Eggs", "Cream"];
  if (has(/\byogurt\b/)) return ["Dairy/Eggs", "Yogurt"];

  if (has(/\b(hamburger|hot dog|slider) buns?\b/)) return ["Breads", "Buns"];
  if (has(/\b(dinner|crescent|kaiser) rolls?\b/)) return ["Breads", "Rolls"];
  if (has(/\btortillas?|wraps?\b/)) return ["Breads", "Tortillas"];
  if (has(/\b(bagels?|biscuits?|croissants?|muffins?|pie crusts?|bakery)\b/)) return ["Breads", "Bakery"];
  if (has(/\b(bread|loaf|cornbread|pita|flatbread)\b/)) return ["Breads", "Bread"];

  if (!has(/powder|dried|canned|frozen|juice|sauce|paste/) && /produce/.test(aisle.toLowerCase())) {
    const kind = FRESH_PRODUCE_KINDS.find(([, pattern]) => pattern.test(name))?.[0] || "Other";
    return ["Fresh Produce", kind];
  }

  if (has(/\boats?\b/)) return ["Grains/Pasta", "Oats"];
  if (has(/\b(spaghetti|macaroni|penne|rotini|lasagna|pasta|ravioli|tortellini|linguine|fettuccine)\b/)) return ["Grains/Pasta", "Pasta"];
  if (has(/\brice\b/)) return ["Grains/Pasta", "Rice"];
  if (has(/\bnoodles?|ramen\b/)) return ["Grains/Pasta", "Noodles"];
  if (has(/\b(instant|dehydrated|boxed) (mashed )?potatoes?\b/)) return ["Grains/Pasta", "Potatoes"];
  if (has(/\b(quinoa|barley|farro|couscous|bulgur|polenta|cornmeal)\b/)) return ["Grains/Pasta", "Grain"];

  if (has(/\bcereal\b/)) return ["Cereal/Breakfast", "Cereal"];
  if (has(/\boatmeal\b/)) return ["Cereal/Breakfast", "Oatmeal"];
  if (has(/\b(grits|cream of wheat|hot cereal)\b/)) return ["Cereal/Breakfast", "Hot Cereals"];
  if (has(/\b(pancake|waffle|biscuit) mix\b/)) return ["Cereal/Breakfast", "Mixes"];
  if (has(/\b(granola|breakfast|protein) bars?\b/)) return ["Cereal/Breakfast", "Bars"];
  if (has(/\b(maple|pancake) syrup\b/)) return ["Cereal/Breakfast", "Syrups"];
  if (has(/\b(jam|jelly|preserves|marmalade)\b/)) return ["Cereal/Breakfast", "Jams/Jellies"];

  if (has(/\b(pasta|marinara|alfredo|spaghetti) sauce\b/)) return ["Condiments", "Pasta"];
  if (has(/\b(dressing|vinaigrette)\b/)) return ["Condiments", "Salad Dressing"];
  if (has(/\bsalsa\b/)) return ["Condiments", "Salsa"];
  if (has(/\bvinegar\b/)) return ["Condiments", "Vinegar"];
  if (has(/\bmustard\b/)) return ["Condiments", "Mustard"];
  if (has(/\bsauce\b/)) return ["Condiments", "Sauce"];
  if (has(/\b(ketchup|mayonnaise|mayo|relish|pickles?)\b/)) return ["Condiments", "Condiment"];

  if (has(/\bcrackers?\b/)) return ["Chips/Snacks", "Crackers"];
  if (has(/\bchips?\b/)) return ["Chips/Snacks", "Chips"];
  if (has(/\b(pecans?|walnuts?|almonds?|peanuts?|cashews?|nuts?)\b/)) return ["Chips/Snacks", "Nuts"];
  if (has(/\bcookies?\b/)) return ["Chips/Snacks", "Cookies"];
  if (has(/\bcakes?\b/)) return ["Chips/Snacks", "Cakes"];
  if (has(/\b(pretzels?|popcorn|salty snack)\b/)) return ["Chips/Snacks", "Salty Snacks"];
  if (has(/\b(candy|sweet snack)\b/)) return ["Chips/Snacks", "Sweet Snacks"];

  if (has(/\bcoffee\b/)) return ["Beverages", "Coffee"];
  if (has(/\btea\b/)) return ["Beverages", "Tea"];
  if (has(/\bwater\b/)) return ["Beverages", "Water"];
  if (has(/\bjuice\b/)) return ["Beverages", "Juices"];
  if (has(/\b(soda|soft drink|cola)\b/)) return ["Beverages", "Soft Drinks"];

  if (has(/\b(flour|baking powder|baking soda|yeast|sugar|cornstarch|vanilla|extract|shortening|chocolate chips?|cocoa|cake mix|brownie mix)\b/)) return ["Pantry/Canned", "Baking"];
  return ["Pantry/Canned", "Staples"];
}

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
  "ground beef": "Beef - Ground 90/10",
  "boneless skinless chicken breasts": "Chicken - Boneless Skinless Breasts",
  "boneless skinless chicken breast": "Chicken - Boneless Skinless Breasts",
  "boneless skinless chicken thighs": "Chicken - Boneless Skinless Thighs",
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
  "beef hot dogs": "Sausage - Beef Hot Dogs",
  "bacon": "Pork - Bacon - Sliced",
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
  const legacyCategory = match.masterItemId
    ? BASE_KITCHEN_CATEGORIES.find((item) => item.id === productByDisplayName.get(match.canonicalName)?.baseCategoryId)?.title
    : CATEGORY_BY_AISLE.find(([, pattern]) => pattern.test(String(ingredient.aisle || "").toLowerCase()))?.[0] || "Pantry/Canned";
  const [category, subcategory] = approvedCategoryAndSubcategory(parsedName.matchName, ingredient.aisle);
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
    inventorySubcategory: subcategory,
    legacyInventoryCategory: legacyCategory,
    auditSource: `${recipeId} illustrated recipe card transcription`,
  };
}

export function standardizeAmericanIngredients(recipeId, ingredients = []) {
  if (!/^AM-(?:00[1-9]|0[1-7]\d|078)$/.test(recipeId) || recipeId === "AM-063") return ingredients;
  return ingredients.map((ingredient) => standardizeAmericanIngredient(ingredient, recipeId));
}
