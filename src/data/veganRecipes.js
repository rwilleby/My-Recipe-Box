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
