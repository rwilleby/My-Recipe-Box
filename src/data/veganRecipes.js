const pantry = (name, qty = 1, unit = "item") => ({ name, qty, unit, aisle: "Pantry", cost: 2 });
const produce = (name, qty = 1, unit = "item") => ({ name, qty, unit, aisle: "Produce", cost: 3 });
const chilled = (name, qty = 1, unit = "pkg") => ({ name, qty, unit, aisle: "Refrigerated", cost: 4 });

const BASE = [produce("Yellow onion", 1, "each"), produce("Garlic", 3, "cloves"), pantry("Olive oil", 1, "tbsp"), pantry("Vegan vegetable broth", 2, "cups"), pantry("Salt, pepper and dried herbs", 1, "set")];

const SPECIALTY = {
  "VG-001": [pantry("Brown lentils", 1.5, "cups"), produce("Mushrooms", 8, "oz"), pantry("Rolled oats", 1, "cup"), pantry("Ground flaxseed", 2, "tbsp")],
  "VG-002": [pantry("Brown lentils", 1.5, "cups"), produce("Mushrooms", 10, "oz"), pantry("Rolled oats", 0.75, "cup"), pantry("Vegan Worcestershire sauce", 1, "tbsp")],
  "VG-003": [pantry("Chickpeas", 2, "cans"), produce("Carrot", 1, "each"), produce("Zucchini", 1, "each"), pantry("Chickpea flour", 0.5, "cup")],
  "VG-004": [pantry("Black beans", 2, "cans"), pantry("Corn", 1.5, "cups"), pantry("Vegan corn tortillas", 12, "each"), pantry("Enchilada sauce verified vegan", 2, "cups")],
  "VG-005": [pantry("Brown lentils", 1.5, "cups"), pantry("Walnuts", 1, "cup"), pantry("Vegan corn tortillas", 12, "each"), pantry("Taco seasoning verified vegan", 1, "set")],
  "VG-006": [pantry("Kidney beans", 1, "can"), pantry("Black beans", 1, "can"), pantry("Pinto beans", 1, "can"), pantry("Crushed tomatoes", 28, "oz")],
  "VG-007": [produce("Bell peppers", 4, "each"), pantry("Brown lentils", 1.5, "cups"), pantry("Cooked brown rice", 2, "cups"), pantry("Diced tomatoes", 1, "can")],
  "VG-008": [pantry("Chickpeas", 2, "cans"), produce("Mixed vegetables", 4, "cups"), pantry("Coconut milk", 1, "can"), pantry("Curry powder", 2, "tbsp")],
  "VG-009": [chilled("Extra-firm tofu", 14, "oz"), produce("Stir-fry vegetables", 4, "cups"), pantry("Teriyaki sauce verified vegan", 0.75, "cup"), pantry("Rice", 2, "cups")],
  "VG-010": [produce("Cauliflower", 1, "large head"), pantry("Orange juice", 1, "cup"), pantry("Soy sauce", 0.25, "cup"), pantry("Cornstarch", 0.5, "cup")],
  "VG-011": [chilled("Extra-firm tofu", 14, "oz"), produce("Bell peppers", 2, "each"), pantry("Pineapple chunks", 1, "can"), pantry("Sweet-and-sour sauce verified vegan", 1, "cup")],
  "VG-012": [chilled("Extra-firm tofu", 14, "oz"), pantry("Egg-free lo mein noodles", 12, "oz"), produce("Stir-fry vegetables", 4, "cups"), pantry("Vegan stir-fry sauce", 0.75, "cup")],
  "VG-013": [pantry("Brown lentils", 1.5, "cups"), produce("Mushrooms", 8, "oz"), pantry("Rolled oats", 0.75, "cup"), pantry("Marinara sauce verified vegan", 3, "cups")],
  "VG-014": [pantry("Brown lentils", 1.5, "cups"), pantry("Crushed tomatoes", 28, "oz"), produce("Carrot", 1, "each"), pantry("Egg-free pasta", 12, "oz")],
  "VG-015": [produce("Eggplant", 2, "each"), pantry("Marinara sauce verified vegan", 3, "cups"), pantry("Vegan breadcrumbs", 1, "cup"), chilled("Plant-based mozzarella", 1.5, "cups")],
  "VG-016": [pantry("Egg-free jumbo pasta shells", 20, "each"), chilled("Extra-firm tofu", 14, "oz"), chilled("Plant-based mozzarella", 1, "cup"), pantry("Marinara sauce verified vegan", 3, "cups")],
  "VG-017": [produce("Mushrooms", 16, "oz"), pantry("Egg-free noodles", 12, "oz"), pantry("Cashew cream", 1.5, "cups"), pantry("Vegan Worcestershire sauce", 1, "tbsp")],
  "VG-018": [pantry("Brown lentils", 1.5, "cups"), produce("Mixed vegetables", 3, "cups"), produce("Potatoes", 2, "lb"), chilled("Unsweetened plant milk", 0.75, "cup")],
  "VG-019": [pantry("Chickpeas", 2, "cans"), produce("Mixed vegetables", 3, "cups"), pantry("Vegan vegetable gravy", 2, "cups"), chilled("Vegan pie crust", 2, "each")],
  "VG-020": [pantry("Red beans", 2, "cans"), pantry("Rice", 2, "cups"), produce("Celery", 2, "stalks"), produce("Bell pepper", 1, "each")],
  "VG-021": [pantry("Chickpeas", 2, "cans"), produce("Bell pepper", 1, "each"), pantry("Vegan breadcrumbs", 0.75, "cup"), pantry("Cajun seasoning", 1, "tbsp")],
  "VG-022": [pantry("Young green jackfruit", 2, "cans"), pantry("BBQ sauce verified vegan", 1.5, "cups"), pantry("Vegan sandwich buns", 6, "each"), produce("Cabbage slaw", 3, "cups")],
  "VG-023": [pantry("Brown lentils", 1.5, "cups"), pantry("Rolled oats", 1, "cup"), pantry("BBQ sauce verified vegan", 1, "cup"), pantry("Ground flaxseed", 2, "tbsp")],
  "VG-024": [pantry("Black beans", 2, "cans"), pantry("Rolled oats", 1, "cup"), pantry("Ground flaxseed", 2, "tbsp"), pantry("Vegan burger buns", 6, "each")],
  "VG-025": [produce("Green cabbage", 1, "large head"), pantry("Brown lentils", 1.5, "cups"), pantry("Cooked rice", 1.5, "cups"), pantry("Tomato sauce", 3, "cups")],
  "VG-026": [produce("Okra", 2, "cups"), pantry("Kidney beans", 2, "cans"), produce("Bell pepper", 1, "each"), pantry("Filé powder", 1, "tsp")],
  "VG-027": [pantry("Chickpeas", 2, "cans"), produce("Spinach", 2, "cups"), produce("Roasted red pepper", 1, "each"), pantry("Vegan breadcrumbs", 0.75, "cup")],
  "VG-028": [pantry("Chickpeas", 2, "cups"), produce("Fresh parsley", 1, "cup"), pantry("Tahini", 0.75, "cup"), pantry("Vegan pita bread", 6, "each")],
  "VG-029": [produce("Large tomatoes", 6, "each"), pantry("Cannellini beans", 2, "cans"), produce("Fresh basil", 0.5, "cup"), pantry("Vegan breadcrumbs", 0.75, "cup")],
  "VG-030": [pantry("Quinoa", 1.5, "cups"), pantry("Black beans", 2, "cans"), pantry("Corn", 1.5, "cups"), produce("Avocado", 2, "each")],
};

const TITLES = [
  "Lentil Mushroom Loaf", "Vegan Salisbury Steak", "Chickpea Vegetable Patties", "Black Bean Corn Enchiladas", "Lentil Walnut Tacos", "Three-Bean Chili", "Lentil Stuffed Peppers", "Vegetable Chickpea Curry", "Teriyaki Tofu Vegetables", "Orange Cauliflower", "Sweet and Sour Tofu", "Vegetable Tofu Lo Mein", "Vegan Meatballs Marinara", "Lentil Bolognese", "Eggplant Marinara Bake", "Tofu Ricotta Stuffed Shells", "Vegan Mushroom Stroganoff", "Vegan Shepherd’s Pie", "Chickpea Pot Pie", "Red Beans and Rice", "Cajun Chickpea Cakes", "BBQ Jackfruit", "BBQ Lentil Patties", "Smoky Black Bean Burgers", "Lentil Stuffed Cabbage Rolls", "Vegan Gumbo", "Mediterranean Chickpea Cakes", "Falafel with Tahini Sauce", "White Bean Stuffed Tomatoes", "Quinoa Black Bean Bowl",
];

export const VEGAN_RECIPE_ROWS = TITLES.map((title, index) => {
  const id = `VG-${String(index + 1).padStart(3, "0")}`;
  return [id, title, {
    categoryCode: "VG", category: "Vegan Main Courses", time: 35 + (index % 4) * 10, servings: 4, price: "$$", emoji: "🌱",
    isVegan: true, veganStatus: "verified", dietaryTags: ["vegan", "plant-based"], ingredients: [...SPECIALTY[id], ...BASE],
    directions: ["Prepare and measure all ingredients, confirming that every packaged product is labeled vegan.", "Cook the vegetables and seasonings until fragrant and tender, then add the principal beans, lentils, tofu, grain, or vegetable component.", "Finish the dish using the cooking method shown on the supplied recipe card and cook until heated through and properly set.", "Taste, adjust the vegan seasonings, and serve hot with the suggested plant-based accompaniments."],
    image: `images/recipes/${id}.webp`, cardImage: `images/recipes/${id}.webp`, heroImage: "",
  }];
});

export const VEGAN_SISTER_RECIPE_ROWS = [["AM-007-VG", "Lentil Mushroom Loaf", {
  categoryCode: "AM", category: "American Cuisine", time: 75, servings: 6, price: "$$", emoji: "🌱",
  isVegan: true, veganStatus: "verified", originalRecipeId: "AM-007", excludeFromRegularLibrary: true,
  dietaryTags: ["vegan", "plant-based"],
  ingredients: [produce("Cooked brown or green lentils", 2, "cups"), produce("Mushrooms, finely chopped", 8, "oz"), pantry("Olive oil", 1, "tbsp"), produce("Medium onion, finely diced", 1, "each"), produce("Carrot, finely diced", 1, "each"), produce("Celery rib, finely diced", 1, "each"), produce("Garlic, minced", 3, "cloves"), pantry("Old-fashioned rolled oats", 1, "cup"), pantry("Walnuts, finely chopped", 0.5, "cup"), pantry("Ground flaxseed", 2, "tbsp"), pantry("Water", 5, "tbsp"), pantry("Tomato paste", 3, "tbsp"), pantry("Reduced-sodium soy sauce", 1, "tbsp"), pantry("Vegan Worcestershire sauce", 1, "tbsp"), pantry("Ketchup and maple tomato glaze", 1, "batch")],
  directions: ["Mix the flaxseed and water; rest 5–10 minutes.", "Heat the oven to 375°F. Line a 9 × 5-inch loaf pan with parchment.", "Pulse the oats into coarse crumbs and transfer to a large bowl.", "Sauté the onion, carrot, and celery in oil for 6–8 minutes. Add mushrooms; cook until their moisture evaporates, then add garlic and seasonings.", "Pulse half the lentils with the vegetables, tomato paste, soy sauce, vegan Worcestershire, and flax mixture.", "Mix with oats, remaining lentils, and walnuts. Press firmly into the pan.", "Spread two-thirds of the glaze over the loaf and bake 40 minutes. Add the remaining glaze and bake 15 minutes more.", "Rest 10 minutes before lifting out and slicing."],
  nutrition: { servingSize: "1 slice (1/6 recipe)", servingsPerRecipe: 6, calories: 310, totalFat: 12, saturatedFat: 1.5, transFat: 0, cholesterol: 0, sodium: 430, totalCarbohydrate: 39, dietaryFiber: 10, totalSugars: 8, addedSugars: 3, protein: 14, estimatedRange: true },
  mealBalance: { score: 3, label: "Balanced", status: "estimated" },
  freezerGuidance: "Cool completely, wrap individual slices, and freeze up to 3 months.", storageGuidance: "Refrigerate covered up to 4 days; reheat to 165°F.",
  image: "images/recipes/AM-007-VG.webp", cardImage: "images/recipes/AM-007-VG.webp", heroImage: "",
}]];

const SISTER_SOURCE_MAP = [
  ["VG-002", "AM-001-VG", "AM-001", "AM", "American Cuisine", "Vegan Salisbury Steak", 4, 320],
  ["VG-006", "AM-009-VG", "AM-009", "AM", "American Cuisine", "Three-Bean Chili", 3, 300],
  ["VG-007", "AM-025-VG", "AM-025", "AM", "American Cuisine", "Lentil Stuffed Peppers", 3, 290],
  ["VG-009", "AS-007-VG", "AS-007", "AS", "Asian Cuisine", "Teriyaki Tofu Vegetables", 3, 340],
  ["VG-010", "AS-010-VG", "AS-010", "AS", "Asian Cuisine", "Orange Cauliflower", 4, 360],
  ["VG-012", "AS-019-VG", "AS-019", "AS", "Asian Cuisine", "Vegetable Tofu Lo Mein", 4, 390],
  ["VG-013", "IT-020-VG", "IT-020", "IT", "Italian Cuisine", "Vegan Meatballs Marinara", 4, 380],
  ["VG-005", "MX-008-VG", "MX-008", "MX", "Mexican Cuisine", "Lentil Walnut Tacos", 4, 410],
  ["VG-021", "SF-005-VG", "SF-005", "SF", "Seafood Dishes", "Vegan Crab Cakes", 3, 260],
];

for (const [sourceId, id, originalRecipeId, categoryCode, category, title, mealBalanceScore, calories] of SISTER_SOURCE_MAP) {
  const source = VEGAN_RECIPE_ROWS.find(([recipeId]) => recipeId === sourceId)?.[2];
  VEGAN_SISTER_RECIPE_ROWS.push([id, title, {
    ...source,
    categoryCode,
    category,
    originalRecipeId,
    excludeFromRegularLibrary: true,
    image: `images/recipes/${id}.webp`,
    cardImage: `images/recipes/${id}.webp`,
    heroImage: "",
    mealBalance: { score: mealBalanceScore, label: mealBalanceScore <= 4 ? "Balanced" : "Moderate", status: "estimated" },
    nutrition: { servingSize: "1 serving", servingsPerRecipe: 6, calories, totalFat: 11, saturatedFat: 1.5, transFat: 0, cholesterol: 0, sodium: 470, totalCarbohydrate: 48, dietaryFiber: 9, totalSugars: 7, addedSugars: 2, protein: 15, estimatedRange: true },
    freezerGuidance: "Cool completely, package in meal-size portions, and freeze up to 3 months.",
    storageGuidance: "Refrigerate covered up to 4 days and reheat thoroughly before serving.",
  }]);
}

VEGAN_SISTER_RECIPE_ROWS.push(["IT-023-VG", "Vegan Pasta Primavera", {
  categoryCode: "IT", category: "Italian Cuisine", time: 35, servings: 6, price: "$$", emoji: "🌱",
  isVegan: true, veganStatus: "verified", originalRecipeId: "IT-023", excludeFromRegularLibrary: true,
  dietaryTags: ["vegan", "plant-based"],
  ingredients: [pantry("Egg-free pasta", 12, "oz"), pantry("Olive oil", 2, "tbsp"), produce("Zucchini, sliced", 1, "each"), produce("Yellow squash, sliced", 1, "each"), produce("Red bell pepper, sliced", 1, "each"), produce("Broccoli florets", 2, "cups"), produce("Garlic, minced", 3, "cloves"), produce("Cherry tomatoes", 1, "cup"), chilled("Unsweetened plant cream", 0.75, "cup"), chilled("Vegan Parmesan", 0.5, "cup"), produce("Fresh basil, chopped", 2, "tbsp")],
  directions: ["Cook pasta until al dente; drain.", "Sauté zucchini, squash, pepper, and broccoli in olive oil.", "Add garlic and tomatoes; cook 2 minutes.", "Pour in plant cream and warm gently.", "Stir in vegan Parmesan until smooth.", "Toss pasta with the vegetables and sauce.", "Garnish with basil and serve."],
  nutrition: { servingSize: "1 serving", servingsPerRecipe: 6, calories: 360, totalFat: 12, saturatedFat: 2, transFat: 0, cholesterol: 0, sodium: 390, totalCarbohydrate: 54, dietaryFiber: 7, totalSugars: 8, addedSugars: 0, protein: 12, estimatedRange: true },
  mealBalance: { score: 3, label: "Balanced", status: "estimated" },
  freezerGuidance: "Cool completely and freeze in meal-size containers up to 2 months.", storageGuidance: "Refrigerate covered up to 4 days; loosen with a splash of plant milk when reheating.",
  image: "images/recipes/IT-023-VG.webp", cardImage: "images/recipes/IT-023-VG.webp", heroImage: "",
}]);
