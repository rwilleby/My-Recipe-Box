export const categories = [
  { id: "AM", name: "American Cuisine", count: 0, icon: "🍽️", iconImage: "images/categories/AM.png" },
  { id: "AS", name: "Asian Cuisine", count: 0, icon: "🍜", iconImage: "images/categories/AS.png" },
  { id: "CC", name: "Cheesecakes", count: 0, icon: "🍰", iconImage: "images/categories/CC.png" },
  { id: "CO", name: "Cobblers", count: 0, icon: "🥧", iconImage: "images/categories/CO.png" },
  { id: "CR", name: "Cinnamon Rolls", count: 0, icon: "🌀", iconImage: "images/categories/CR.png" },
  { id: "DN", name: "Donuts", count: 0, icon: "🍩", iconImage: "images/categories/DN.png" },
  { id: "DS", name: "Desserts", count: 0, icon: "🍰", iconImage: "images/categories/DS.png" },
  { id: "HB", name: "Hamburgers", count: 0, icon: "🍔", iconImage: "images/categories/HB.png" },
  { id: "HBP", name: "Hamburger Patties", count: 0, icon: "🍔", iconImage: "images/categories/HBP.png" },
  { id: "IT", name: "Italian Cuisine", count: 0, icon: "🍝", iconImage: "images/categories/IT.png" },
  { id: "JJ", name: "Jams & Jellies", count: 0, icon: "🍓", iconImage: "images/categories/JJ.png" },
  { id: "KR", name: "Kolaches", count: 0, icon: "🥐", iconImage: "images/categories/KR.png" },
  { id: "LF", name: "Loafs & Rolls", count: 0, icon: "🍞", iconImage: "images/categories/LF.png" },
  { id: "MR", name: "Marinades", count: 0, icon: "🫙", iconImage: "images/categories/MR.png" },
  { id: "MX", name: "Mexican Cuisine", count: 0, icon: "🌮", iconImage: "images/categories/MX.png" },
  { id: "PM", name: "Protein Muffins", count: 0, icon: "🧁", iconImage: "images/categories/PM.png" },
  { id: "QP", name: "Quiche & Pies", count: 0, icon: "🥧", iconImage: "images/categories/QP.png" },
  { id: "RS", name: "Rubs & Seasonings", count: 0, icon: "🧂", iconImage: "images/categories/RS.png" },
  { id: "SB", name: "Salads & Bowls", count: 0, icon: "🥗", iconImage: "images/categories/SB.png" },
  { id: "SD", name: "Side Dishes", count: 0, icon: "🍲", iconImage: "images/categories/SD.png" },
  { id: "SF", name: "Seafood Dishes", count: 0, icon: "🐟", iconImage: "images/categories/SF.png" },
  { id: "SG", name: "Smoked & Grilled Meats", count: 0, icon: "🔥", iconImage: "images/categories/SG.png" },
  { id: "SW", name: "Sandwiches", count: 0, icon: "🥪", iconImage: "images/categories/SW.png" },
];

const CATEGORY_INFO = Object.fromEntries(categories.map((category) => [category.id, category]));

const CATEGORY_DEFAULTS = {
  AM: { time: 35, servings: 4, price: "$$", emoji: "🍽️" },
  AS: { time: 30, servings: 4, price: "$$", emoji: "🍜" },
  CC: { time: 70, servings: 8, price: "$$", emoji: "🍰" },
  CO: { time: 55, servings: 8, price: "$$", emoji: "🥧" },
  CR: { time: 90, servings: 8, price: "$$", emoji: "🌀" },
  DN: { time: 60, servings: 8, price: "$$", emoji: "🍩" },
  DS: { time: 45, servings: 8, price: "$$", emoji: "🍰" },
  HB: { time: 25, servings: 4, price: "$$", emoji: "🍔" },
  HBP: { time: 20, servings: 4, price: "$$", emoji: "🍔" },
  IT: { time: 40, servings: 4, price: "$$", emoji: "🍝" },
  JJ: { time: 50, servings: 8, price: "$", emoji: "🍓" },
  KR: { time: 90, servings: 8, price: "$$", emoji: "🥐" },
  LF: { time: 90, servings: 8, price: "$$", emoji: "🍞" },
  MR: { time: 10, servings: 4, price: "$", emoji: "🫙" },
  MX: { time: 35, servings: 4, price: "$$", emoji: "🌮" },
  PM: { time: 35, servings: 6, price: "$$", emoji: "🧁" },
  QP: { time: 55, servings: 6, price: "$$", emoji: "🥧" },
  RS: { time: 10, servings: 8, price: "$", emoji: "🧂" },
  SB: { time: 20, servings: 4, price: "$$", emoji: "🥗" },
  SD: { time: 25, servings: 4, price: "$", emoji: "🍲" },
  SF: { time: 30, servings: 4, price: "$$$", emoji: "🐟" },
  SG: { time: 60, servings: 4, price: "$$", emoji: "🔥" },
  SW: { time: 20, servings: 4, price: "$$", emoji: "🥪" },
};

const CATEGORY_INGREDIENTS = {
  AM: [
    { name: "Protein", qty: 1, unit: "lb", aisle: "Meat", cost: 7 },
    { name: "Vegetables", qty: 2, unit: "cups", aisle: "Produce", cost: 3 },
    { name: "Pantry staples", qty: 1, unit: "set", aisle: "Pantry", cost: 3 },
  ],
  AS: [
    { name: "Protein", qty: 1, unit: "lb", aisle: "Meat", cost: 7 },
    { name: "Vegetables", qty: 2, unit: "cups", aisle: "Produce", cost: 3 },
    { name: "Soy sauce", qty: 1, unit: "bottle", aisle: "Pantry", cost: 3 },
    { name: "Rice", qty: 1, unit: "pkg", aisle: "Pantry", cost: 3 },
  ],
  IT: [
    { name: "Protein", qty: 1, unit: "lb", aisle: "Meat", cost: 7 },
    { name: "Pasta", qty: 1, unit: "box", aisle: "Pantry", cost: 2 },
    { name: "Tomato sauce", qty: 1, unit: "jar", aisle: "Pantry", cost: 3 },
    { name: "Parmesan cheese", qty: 1, unit: "pkg", aisle: "Dairy", cost: 4 },
  ],
  MX: [
    { name: "Protein", qty: 1, unit: "lb", aisle: "Meat", cost: 7 },
    { name: "Tortillas", qty: 1, unit: "pkg", aisle: "Bakery", cost: 3 },
    { name: "Salsa", qty: 1, unit: "jar", aisle: "Pantry", cost: 3 },
    { name: "Shredded cheese", qty: 1, unit: "pkg", aisle: "Dairy", cost: 4 },
  ],
  SB: [
    { name: "Greens", qty: 1, unit: "pkg", aisle: "Produce", cost: 4 },
    { name: "Protein", qty: 1, unit: "lb", aisle: "Meat", cost: 7 },
    { name: "Vegetables", qty: 2, unit: "cups", aisle: "Produce", cost: 4 },
    { name: "Dressing", qty: 1, unit: "bottle", aisle: "Pantry", cost: 3 },
  ],
  SD: [
    { name: "Vegetables or starch", qty: 1, unit: "pkg", aisle: "Produce", cost: 4 },
    { name: "Butter", qty: 1, unit: "stick", aisle: "Dairy", cost: 2 },
    { name: "Pantry staples", qty: 1, unit: "set", aisle: "Pantry", cost: 2 },
  ],
  SF: [
    { name: "Seafood", qty: 1, unit: "lb", aisle: "Seafood", cost: 12 },
    { name: "Lemon", qty: 1, unit: "each", aisle: "Produce", cost: 1 },
    { name: "Butter", qty: 1, unit: "stick", aisle: "Dairy", cost: 2 },
    { name: "Pantry staples", qty: 1, unit: "set", aisle: "Pantry", cost: 2 },
  ],
};

function codePrefix(id = "") {
  return id.match(/^[A-Z]+/)?.[0] || "";
}

function defaultIngredients(categoryCode) {
  return CATEGORY_INGREDIENTS[categoryCode] || [
    { name: "Main ingredients", qty: 1, unit: "set", aisle: "Grocery", cost: 8 },
    { name: "Pantry staples", qty: 1, unit: "set", aisle: "Pantry", cost: 3 },
  ];
}

function defaultCost(price = "$$", servings = 4) {
  const base =
    price === "$" ? 10 :
    price === "$$$" ? 28 :
    18;

  return {
    2: Number((base * 0.55).toFixed(2)),
    4: Number(base.toFixed(2)),
    6: Number((base * 1.45).toFixed(2)),
  };
}

function makeRecipe(entry) {
  const [id, title, options = {}] = entry;
  const categoryCode = options.categoryCode || codePrefix(id);
  const category = CATEGORY_INFO[categoryCode];
  const defaults = CATEGORY_DEFAULTS[categoryCode] || CATEGORY_DEFAULTS.AM;
  const servings = options.servings ?? defaults.servings;
  const price = options.price ?? defaults.price;

  return {
    id,
    title,
    category: options.category || category?.name || categoryCode,
    categoryCode,
    time: options.time ?? defaults.time,
    servings,
    price,
    emoji: options.emoji ?? defaults.emoji,
    imageStyle: options.imageStyle || "linear-gradient(135deg, #f8fafc, #e5e7eb)",
    image: options.image || `images/recipes/${id}.png`,
    cardImage: options.cardImage || `images/recipes/${id}.png`,
    heroImage: options.heroImage || `images/heroes/${id}.png`,
    cost: options.cost || defaultCost(price, servings),
    ingredients: options.ingredients || defaultIngredients(categoryCode),
    mediaLinks: options.mediaLinks || undefined,
  };
}

/*
  ADD NEW RECIPES HERE.

  Format:
  ["CODE-###", "Recipe Name"],

  Optional advanced format:
  ["CODE-###", "Recipe Name", { time: 30, servings: 4, price: "$$" }],

  Image files expected:
  public/images/recipes/CODE-###.png
  public/images/heroes/CODE-###.png
*/

const recipeRows = [
  // Asian Cuisine
  ["AS-001", "Beef & Broccoli"],
  ["AS-002", "Beijing Beef"],
  ["AS-003", "Mongolian Beef"],
  ["AS-004", "Pepper Steak"],
  ["AS-005", "Black Pepper Beef"],
  ["AS-006", "Korean Beef"],
  ["AS-007", "Teriyaki Chicken"],
  ["AS-008", "Sweet & Sour Chicken"],
  ["AS-009", "Sesame Chicken"],
  ["AS-010", "Orange Chicken"],
  ["AS-011", "Kung Pao Chicken"],
  ["AS-012", "Honey Garlic Chicken"],
  ["AS-013", "General Tso’s Chicken"],
  ["AS-014", "Cashew Chicken"],
  ["AS-015", "Hunan Chicken"],
  ["AS-016", "Szechuan Chicken"],
  ["AS-017", "Black Pepper Chicken"],
  ["AS-018", "Fried Rice"],
  ["AS-019", "Lo Mein"],
  ["AS-020", "Chow Mein"],
  ["AS-021", "Singapore Noodles"],
  ["AS-022", "Chicken Egg Rolls"],
  ["AS-023", "Spring Rolls"],
  ["AS-024", "Crab Rangoons"],

  // Add your new rows below this line.
];

export const recipes = recipeRows.map(makeRecipe);

export const categoryCounts = recipes.reduce((counts, recipe) => {
  counts[recipe.categoryCode] = (counts[recipe.categoryCode] || 0) + 1;
  return counts;
}, {});

export const categoriesWithCounts = categories.map((category) => ({
  ...category,
  count: categoryCounts[category.id] || category.count || 0,
}));
