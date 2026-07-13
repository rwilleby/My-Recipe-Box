import { useMemo, useState, useEffect } from "react";
import { categories, recipes } from "./data/recipes";
import { loadJSON, saveJSON } from "./utils/storage";
import {
  buildShoppingList,
  formatQty,
} from "./utils/planning";
import "./App.css";

const STORAGE_KEYS = {
  favorites: "rrb_favorites",
  plan: "rrb_weeklyPlan",
  servings: "rrb_servingSize",
  checked: "rrb_checkedShoppingItems",
  pantry: "rrb_pantryStaples",
};

const CATEGORY_ICON_IMAGES = {
  AM: "images/categories/AM.png",
  AS: "images/categories/AS.png",
  CC: "images/categories/CC.png",
  CO: "images/categories/CO.png",
  CR: "images/categories/CR.png",
  DN: "images/categories/DN.png",
  DS: "images/categories/DS.png",
  HB: "images/categories/HB.png",
  IT: "images/categories/IT.png",
  JJ: "images/categories/JJ.png",
  KR: "images/categories/KR.png",
  LF: "images/categories/LF.png",
  MX: "images/categories/MX.png",
  PM: "images/categories/PM.png",
  QP: "images/categories/QP.png",
  CS: "images/categories/CS.png",
  SB: "images/categories/SB.png",
  SD: "images/categories/SD.png",
  SF: "images/categories/SF.png",
  SG: "images/categories/SG.png",
  SW: "images/categories/SW.png",
};

const HOME_CATEGORY_CODES = [
  "AM",
  "AS",
  "IT",
  "MX",
  "SF",
  "QP",
  "CS",
  "SB",
  "SG",
  "SD",
  "HB",
  "SW",
  "LF",
  "PM",
  "KR",
  "CC",
  "CO",
  "CR",
  "DN",
  "JJ",
];

const HOME_CATEGORY_LABELS = {
  AM: "American",
  AS: "Asian",
  CC: "Cheesecakes",
  CO: "Cobblers",
  CR: "Cinnamon Rolls",
  DN: "Donuts",
  DS: "Desserts",
  HB: "Hamburgers",
  IT: "Italian",
  JJ: "Jams & Jellies",
  KR: "Kolaches",
  LF: "Loafs & Rolls",
  MX: "Mexican",
  PM: "Protein Muffins",
  QP: "Quiche & Pies",
  CS: "Casseroles",
  SB: "Salads & Bowls",
  SD: "Side Dishes",
  SF: "Seafood",
  SG: "Smoked/Grilled",
  SW: "Sandwiches",
};

const HOME_CATEGORY_FALLBACKS = {
  AM: { id: "AM", name: "American Cuisine", count: 0, icon: "🍽️" },
  AS: { id: "AS", name: "Asian Cuisine", count: 0, icon: "🍜" },
  CC: { id: "CC", name: "Cheesecakes", count: 0, icon: "🍰" },
  CO: { id: "CO", name: "Cobblers", count: 0, icon: "🥧" },
  CR: { id: "CR", name: "Cinnamon Rolls", count: 0, icon: "🌀" },
  DN: { id: "DN", name: "Donuts", count: 0, icon: "🍩" },
  DS: { id: "DS", name: "Desserts", count: 0, icon: "🍰" },
  HB: { id: "HB", name: "Hamburgers", count: 0, icon: "🍔" },
  IT: { id: "IT", name: "Italian Cuisine", count: 0, icon: "🍝" },
  JJ: { id: "JJ", name: "Jams & Jellies", count: 0, icon: "🍓" },
  KR: { id: "KR", name: "Kolaches", count: 0, icon: "🥐" },
  LF: { id: "LF", name: "Loafs & Rolls", count: 0, icon: "🍞" },
  MX: { id: "MX", name: "Mexican Cuisine", count: 0, icon: "🌮" },
  PM: { id: "PM", name: "Protein Muffins", count: 0, icon: "🧁" },
  QP: { id: "QP", name: "Quiche & Pies", count: 0, icon: "🥧" },
  CS: { id: "CS", name: "Casseroles", count: 0, icon: "🥘" },
  SB: { id: "SB", name: "Salads & Bowls", count: 0, icon: "🥗" },
  SD: { id: "SD", name: "Side Dishes", count: 0, icon: "🍲" },
  SF: { id: "SF", name: "Seafood Dishes", count: 0, icon: "🐟" },
  SG: { id: "SG", name: "Smoked & Grilled Meats", count: 0, icon: "🔥" },
  SW: { id: "SW", name: "Sandwiches", count: 0, icon: "🥪" },
};

const PANTRY_LEVELS = [
  {
    id: 1,
    label: "Minimum Pantry",
    shortLabel: "Minimum",
    description: "Core shelf-stable basics for simple meals and shopping-list matching.",
  },
  {
    id: 2,
    label: "Medium Pantry",
    shortLabel: "Medium",
    description: "Adds more sauces, grains, canned goods, and baking basics for flexible weekly cooking.",
  },
  {
    id: 3,
    label: "Fully Stocked Pantry",
    shortLabel: "Fully Stocked",
    description: "A deeper shelf-stable pantry for meal prep, freezer meals, baking, and lower-carb swaps.",
  },
];

const PANTRY_STAPLES = [
  {
    group: "Spices & Seasonings",
    items: [
      { name: "Salt", level: 1 },
      { name: "Black pepper", level: 1 },
      { name: "Garlic powder", level: 1 },
      { name: "Onion powder", level: 1 },
      { name: "Paprika", level: 1 },
      { name: "Chili powder", level: 1 },
      { name: "Italian seasoning", level: 1 },
      { name: "Dried oregano", level: 2 },
      { name: "Ground cumin", level: 2 },
      { name: "Cinnamon", level: 2 },
      { name: "Taco seasoning", level: 2 },
      { name: "Cajun seasoning", level: 3 },
      { name: "Lemon pepper", level: 3 },
      { name: "Smoked paprika", level: 3 },
      { name: "Red pepper flakes", level: 3 },
    ],
  },
  {
    group: "Oils, Vinegars & Cooking Basics",
    items: [
      { name: "Olive oil", level: 1 },
      { name: "Vegetable oil", level: 1 },
      { name: "Cooking spray", level: 1 },
      { name: "White vinegar", level: 1 },
      { name: "Flour", level: 1 },
      { name: "Sugar", level: 1 },
      { name: "Cornstarch", level: 2 },
      { name: "Brown sugar", level: 2 },
      { name: "Apple cider vinegar", level: 2 },
      { name: "Baking powder", level: 2 },
      { name: "Baking soda", level: 2 },
      { name: "Powdered milk", level: 3 },
      { name: "Shelf-stable milk", level: 3 },
      { name: "Powdered buttermilk", level: 3 },
      { name: "Shelf-stable ghee", level: 3 },
    ],
  },
  {
    group: "Sauces & Condiments",
    items: [
      { name: "Soy sauce", level: 1 },
      { name: "Ketchup", level: 1 },
      { name: "Mustard", level: 1 },
      { name: "BBQ sauce", level: 1 },
      { name: "Salsa", level: 1 },
      { name: "Hot sauce", level: 2 },
      { name: "Worcestershire sauce", level: 2 },
      { name: "Honey", level: 2 },
      { name: "Maple syrup", level: 2 },
      { name: "No-sugar-added BBQ sauce", level: 3 },
      { name: "No-sugar-added ketchup", level: 3 },
      { name: "Lower-sodium soy sauce", level: 3 },
      { name: "Teriyaki sauce", level: 3 },
      { name: "Buffalo sauce", level: 3 },
    ],
  },
  {
    group: "Rice, Pasta & Grains",
    items: [
      { name: "White rice", level: 1 },
      { name: "Pasta", level: 1 },
      { name: "Egg noodles", level: 1 },
      { name: "Breadcrumbs", level: 1 },
      { name: "Rolled oats", level: 2 },
      { name: "Brown rice", level: 2 },
      { name: "Jasmine rice", level: 2 },
      { name: "Tortillas", level: 2 },
      { name: "Crackers", level: 2 },
      { name: "Microwave rice cups", level: 3 },
      { name: "Higher-protein pasta", level: 3 },
      { name: "Low-carb tortillas", level: 3 },
      { name: "Shelf-stable cauliflower rice", level: 3 },
    ],
  },
  {
    group: "Canned & Jarred Goods",
    items: [
      { name: "Chicken broth", level: 1 },
      { name: "Beef broth", level: 1 },
      { name: "Cream of chicken soup", level: 1 },
      { name: "Cream of mushroom soup", level: 1 },
      { name: "Diced tomatoes", level: 1 },
      { name: "Tomato sauce", level: 1 },
      { name: "Tomato paste", level: 2 },
      { name: "Black beans", level: 2 },
      { name: "Pinto beans", level: 2 },
      { name: "Corn", level: 2 },
      { name: "Green beans", level: 2 },
      { name: "Tuna packets or cans", level: 3 },
      { name: "Chicken packets or cans", level: 3 },
      { name: "No-sugar-added marinara", level: 3 },
      { name: "Enchilada sauce", level: 3 },
      { name: "Diced green chiles", level: 3 },
    ],
  },
  {
    group: "Shelf-Stable Baking & Breakfast",
    items: [
      { name: "Pancake mix", level: 2 },
      { name: "Muffin mix", level: 2 },
      { name: "Cake mix", level: 2 },
      { name: "Vanilla extract", level: 2 },
      { name: "Protein powder", level: 3 },
      { name: "Almond flour", level: 3 },
      { name: "Sugar-free pudding mix", level: 3 },
      { name: "No-sugar-added pie filling", level: 3 },
      { name: "Shelf-stable applesauce cups", level: 3 },
    ],
  },
  {
    group: "Freezer Meal & Storage Supplies",
    items: [
      { name: "Quart freezer bags", level: 1 },
      { name: "Gallon freezer bags", level: 1 },
      { name: "Permanent marker", level: 1 },
      { name: "Painter's tape", level: 2 },
      { name: "Foil pans", level: 2 },
      { name: "Heavy-duty foil", level: 2 },
      { name: "Parchment paper", level: 2 },
      { name: "Vacuum sealer bags", level: 3 },
      { name: "Freezer labels", level: 3 },
      { name: "Disposable soup containers", level: 3 },
      { name: "Meal-prep containers", level: 3 },
    ],
  },
];

const PANTRY_MATCHERS = [
  { pantry: "Salt", terms: ["salt"] },
  { pantry: "Black pepper", terms: ["pepper", "black pepper"] },
  { pantry: "Garlic powder", terms: ["garlic powder"] },
  { pantry: "Onion powder", terms: ["onion powder"] },
  { pantry: "Paprika", terms: ["paprika"] },
  { pantry: "Chili powder", terms: ["chili powder"] },
  { pantry: "Italian seasoning", terms: ["italian seasoning"] },
  { pantry: "Dried oregano", terms: ["oregano"] },
  { pantry: "Ground cumin", terms: ["cumin"] },
  { pantry: "Cinnamon", terms: ["cinnamon"] },
  { pantry: "Taco seasoning", terms: ["taco seasoning"] },
  { pantry: "Cajun seasoning", terms: ["cajun seasoning"] },
  { pantry: "Lemon pepper", terms: ["lemon pepper"] },
  { pantry: "Smoked paprika", terms: ["smoked paprika"] },
  { pantry: "Red pepper flakes", terms: ["red pepper flakes"] },
  { pantry: "Olive oil", terms: ["olive oil"] },
  { pantry: "Vegetable oil", terms: ["vegetable oil", "oil"] },
  { pantry: "Cooking spray", terms: ["cooking spray"] },
  { pantry: "White vinegar", terms: ["white vinegar", "vinegar"] },
  { pantry: "Apple cider vinegar", terms: ["apple cider vinegar"] },
  { pantry: "Flour", terms: ["flour"] },
  { pantry: "Cornstarch", terms: ["cornstarch"] },
  { pantry: "Sugar", terms: ["sugar"] },
  { pantry: "Brown sugar", terms: ["brown sugar"] },
  { pantry: "Baking powder", terms: ["baking powder"] },
  { pantry: "Baking soda", terms: ["baking soda"] },
  { pantry: "Powdered milk", terms: ["powdered milk"] },
  { pantry: "Shelf-stable milk", terms: ["shelf stable milk", "shelf-stable milk"] },
  { pantry: "Powdered buttermilk", terms: ["powdered buttermilk"] },
  { pantry: "Shelf-stable ghee", terms: ["ghee", "shelf-stable ghee"] },
  { pantry: "Soy sauce", terms: ["soy sauce"] },
  { pantry: "Lower-sodium soy sauce", terms: ["lower-sodium soy sauce", "lower sodium soy sauce"] },
  { pantry: "Worcestershire sauce", terms: ["worcestershire"] },
  { pantry: "Ketchup", terms: ["ketchup"] },
  { pantry: "No-sugar-added ketchup", terms: ["no-sugar-added ketchup", "no sugar added ketchup"] },
  { pantry: "Mustard", terms: ["mustard"] },
  { pantry: "BBQ sauce", terms: ["bbq sauce", "barbecue sauce"] },
  { pantry: "No-sugar-added BBQ sauce", terms: ["no-sugar-added bbq sauce", "no sugar added bbq sauce", "lower-sugar bbq sauce", "lower sugar bbq sauce"] },
  { pantry: "Hot sauce", terms: ["hot sauce"] },
  { pantry: "Salsa", terms: ["salsa"] },
  { pantry: "Teriyaki sauce", terms: ["teriyaki sauce"] },
  { pantry: "Buffalo sauce", terms: ["buffalo sauce"] },
  { pantry: "Honey", terms: ["honey"] },
  { pantry: "Maple syrup", terms: ["maple syrup"] },
  { pantry: "White rice", terms: ["white rice", "rice"] },
  { pantry: "Brown rice", terms: ["brown rice"] },
  { pantry: "Jasmine rice", terms: ["jasmine rice"] },
  { pantry: "Microwave rice cups", terms: ["microwave rice cups", "rice cups", "ready rice"] },
  { pantry: "Pasta", terms: ["pasta", "spaghetti", "penne", "fettuccine"] },
  { pantry: "Higher-protein pasta", terms: ["higher-protein pasta", "high protein pasta", "protein pasta"] },
  { pantry: "Egg noodles", terms: ["egg noodles"] },
  { pantry: "Breadcrumbs", terms: ["breadcrumbs", "bread crumbs"] },
  { pantry: "Rolled oats", terms: ["oats", "rolled oats"] },
  { pantry: "Tortillas", terms: ["tortilla", "tortillas"] },
  { pantry: "Low-carb tortillas", terms: ["low-carb tortilla", "low carb tortilla", "low-carb flour tortillas"] },
  { pantry: "Crackers", terms: ["crackers"] },
  { pantry: "Chicken broth", terms: ["chicken broth"] },
  { pantry: "Beef broth", terms: ["beef broth"] },
  { pantry: "Cream of chicken soup", terms: ["cream of chicken"] },
  { pantry: "Cream of mushroom soup", terms: ["cream of mushroom"] },
  { pantry: "Diced tomatoes", terms: ["diced tomatoes"] },
  { pantry: "Tomato sauce", terms: ["tomato sauce"] },
  { pantry: "Tomato paste", terms: ["tomato paste"] },
  { pantry: "Black beans", terms: ["black beans"] },
  { pantry: "Pinto beans", terms: ["pinto beans"] },
  { pantry: "Corn", terms: ["corn"] },
  { pantry: "Green beans", terms: ["green beans"] },
  { pantry: "Tuna packets or cans", terms: ["tuna", "tuna packets", "tuna cans"] },
  { pantry: "Chicken packets or cans", terms: ["canned chicken", "chicken packets"] },
  { pantry: "No-sugar-added marinara", terms: ["no-sugar-added marinara", "no sugar added marinara", "marinara"] },
  { pantry: "Enchilada sauce", terms: ["enchilada sauce"] },
  { pantry: "Diced green chiles", terms: ["diced green chiles", "green chiles"] },
  { pantry: "Protein powder", terms: ["protein powder"] },
  { pantry: "Almond flour", terms: ["almond flour"] },
  { pantry: "Quart freezer bags", terms: ["quart freezer bags", "freezer bags"] },
  { pantry: "Gallon freezer bags", terms: ["gallon freezer bags"] },
  { pantry: "Vacuum sealer bags", terms: ["vacuum sealer bags", "vacuum seal bags"] },
  { pantry: "Freezer labels", terms: ["freezer labels", "labels"] },
  { pantry: "Painter's tape", terms: ["painter's tape", "painters tape"] },
  { pantry: "Meal-prep containers", terms: ["meal prep containers", "storage containers"] },
];


const GROCERY_REFERENCE_GROUPS = [
  {
    group: "Tortillas & Wraps",
    intro: "Useful for tacos, quesadillas, wraps, enchiladas, and freezer-friendly burrito bowls.",
    items: [
      {
        name: "Low-carb flour tortillas",
        useFor: "Tacos, quesadillas, enchiladas, wraps",
        examples: [
          "Mission Carb Balance",
          "La Banderita Carb Counter",
          "H-E-B Carb Sense",
          "Ole Xtreme Wellness"
        ],
        note: "Look for soft taco size, high-fiber options, and a size that fits your portions.",
        terms: ["tortilla", "tortillas", "wrap", "wraps", "low-carb flour tortillas", "flour tortillas"],
      },
      {
        name: "Lower-carb tortilla chips",
        useFor: "Queso, dips, taco bowls",
        examples: [
          "Quest tortilla-style chips",
          "H-E-B Quest-style protein chips",
          "Baked tortilla chips"
        ],
        note: "Use as an occasional swap; portion into small bags for easier control.",
        terms: ["tortilla chips", "chips"],
      },
    ],
  },
  {
    group: "Proteins",
    intro: "More specific protein choices make the shopping list easier to use and freezer prep easier to plan.",
    items: [
      {
        name: "Boneless skinless chicken breasts",
        useFor: "Chicken casseroles, salads, bowls, fajitas, grilled chicken",
        examples: ["Fresh family pack", "Individually frozen breasts", "Thin-sliced chicken breasts"],
        note: "Good for batch cooking, shredding, grilling, and freezing in two-serving portions.",
        terms: ["chicken breast", "chicken breasts", "boneless skinless chicken breasts"],
      },
      {
        name: "Chicken tenders",
        useFor: "Quick skillet meals, stir-fry, fajitas, nuggets",
        examples: ["Fresh chicken tenderloins", "Frozen chicken tenders"],
        note: "Faster to cook and easy to portion for two-person meals.",
        terms: ["chicken tenders", "chicken tenderloins", "tenders"],
      },
      {
        name: "Boneless skinless chicken thighs",
        useFor: "Slow cooker meals, casseroles, grilled chicken, freezer meals",
        examples: ["Fresh boneless thighs", "Frozen boneless thighs"],
        note: "More forgiving for reheating and freezer meals.",
        terms: ["chicken thighs", "boneless skinless chicken thighs"],
      },
      {
        name: "Lean ground beef",
        useFor: "Tacos, burgers, casseroles, meatballs, pasta sauce",
        examples: ["90/10 ground beef", "93/7 ground beef", "Lean ground sirloin"],
        note: "Brown in bulk, drain well, and freeze flat in meal-sized bags.",
        terms: ["ground beef", "lean ground beef", "hamburger meat"],
      },
      {
        name: "Seafood fillets",
        useFor: "Tilapia, cod, salmon, seafood dinners",
        examples: ["Tilapia fillets", "Cod fillets", "Salmon portions"],
        note: "Individually frozen portions are easy for small households.",
        terms: ["tilapia", "cod", "salmon", "fish fillets", "seafood", "seafood fillets"],
      },
    ],
  },
  {
    group: "Rice, Pasta & Bowl Bases",
    intro: "Use these swaps when you want a lighter or lower-carb base without changing the whole recipe.",
    items: [
      {
        name: "Cauliflower rice",
        useFor: "Rice bowls, Mexican bowls, stir-fry, casseroles",
        examples: ["Frozen cauliflower rice", "Riced cauliflower steam bags"],
        note: "Good lower-carb option; mix half cauliflower rice and half white rice if you want a softer transition.",
        terms: ["cauliflower rice", "riced cauliflower"],
      },
      {
        name: "Higher-protein or lower-carb pasta",
        useFor: "Italian pasta dishes, pasta salads, casseroles",
        examples: ["Barilla Protein+ pasta", "Banza chickpea pasta", "Fiber Gourmet pasta"],
        note: "Start with half regular pasta and half swap pasta if texture is a concern.",
        terms: ["pasta", "spaghetti", "penne", "fettuccine", "macaroni", "noodles"],
      },
      {
        name: "Microwave rice cups or pouches",
        useFor: "Fast two-serving sides and bowls",
        examples: ["Brown rice cups", "Jasmine rice cups", "Ready rice pouches"],
        note: "Helpful for seniors or couples who do not want to cook a full pot of rice.",
        terms: ["rice", "white rice", "brown rice", "jasmine rice", "ready rice"],
      },
    ],
  },
  {
    group: "Breads, Buns & Rolls",
    intro: "Helpful swaps for burgers, sandwiches, freezer sandwiches, and small-household meals.",
    items: [
      {
        name: "Lower-calorie burger buns",
        useFor: "Burgers, pulled pork, sandwiches",
        examples: ["Homemade buns or rolls", "647 sandwich rolls", "Thin sandwich buns", "Whole wheat sandwich thins"],
        note: "Homemade is a good option because you control ingredients; some thin buns work better toasted.",
        terms: ["burger buns", "buns", "sandwich buns", "rolls"],
      },
      {
        name: "Lower-carb sandwich bread",
        useFor: "Sandwiches, toast, freezer breakfast sandwiches",
        examples: ["Homemade sandwich bread", "Nature's Own Keto", "Sola bread", "647 bread"],
        note: "Homemade is a good option because you control ingredients; freeze extra slices to avoid waste.",
        terms: ["bread", "sandwich bread", "toast"],
      },
    ],
  },
  {
    group: "Cheese, Dairy & Creamy Ingredients",
    intro: "These choices help keep casseroles, salads, and bowls familiar while giving lighter options to review.",
    items: [
      {
        name: "Reduced-fat shredded cheese",
        useFor: "Mexican bakes, casseroles, eggs, salads",
        examples: ["Reduced-fat Mexican blend", "Reduced-fat cheddar", "Part-skim mozzarella"],
        note: "For better melt, mix reduced-fat cheese with a smaller amount of regular cheese.",
        terms: ["shredded cheese", "cheese", "cheddar", "mozzarella", "mexican cheese"],
      },
      {
        name: "Plain Greek yogurt",
        useFor: "Sauces, dressings, chicken salad, dips",
        examples: ["Nonfat plain Greek yogurt", "2% plain Greek yogurt"],
        note: "Useful swap for some sour cream or mayo-based recipes.",
        terms: ["greek yogurt", "plain greek yogurt", "yogurt"],
      },
      {
        name: "Light sour cream",
        useFor: "Tacos, bowls, dips, casseroles",
        examples: ["Light sour cream", "Reduced-fat sour cream"],
        note: "Good for toppings; Greek yogurt can work in many cold uses.",
        terms: ["sour cream", "light sour cream"],
      },
    ],
  },
  {
    group: "Sauces, Dressings & Condiments",
    intro: "Sauces can change calories quickly, so this list gives the user products to review before buying.",
    items: [
      {
        name: "Lower-sugar BBQ sauce",
        useFor: "Smoked meats, grilled chicken, pulled pork",
        examples: ["G Hughes sugar free BBQ sauce", "Stubb's lower sugar options"],
        note: "Taste varies a lot; keep one favorite regular sauce and one lower-sugar sauce if needed.",
        terms: ["bbq sauce", "barbecue sauce"],
      },
      {
        name: "Light salad dressings",
        useFor: "Salads, bowls, marinades",
        examples: ["Bolthouse Farms yogurt dressings", "Lite vinaigrettes", "Skinnygirl dressings"],
        note: "For meal prep, keep dressing separate until serving.",
        terms: ["dressing", "salad dressing", "vinaigrette"],
      },
      {
        name: "Salsa and taco sauces",
        useFor: "Tacos, bowls, casseroles, eggs",
        examples: ["Fresh salsa", "Restaurant-style salsa", "Green salsa verde"],
        note: "Often adds flavor without needing much extra fat.",
        terms: ["salsa", "taco sauce", "salsa verde", "enchilada sauce"],
      },
    ],
  },
  {
    group: "Freezer & Meal-Prep Supplies",
    intro: "These support the cook-once, eat-once, freeze-once method used throughout the recipe box.",
    items: [
      {
        name: "Freezer bags",
        useFor: "Flat-freezing cooked proteins, sauces, soups, and meal portions",
        examples: ["Quart freezer bags", "Gallon freezer bags", "Vacuum sealer bags"],
        note: "Freeze flat first, then stand bags upright like files.",
        terms: ["freezer bag", "freezer bags", "vacuum seal bags", "vacuum sealer bags"],
      },
      {
        name: "Two-serving freezer containers",
        useFor: "Prepared meals, casseroles, soups, leftovers",
        examples: ["2-cup containers", "3-cup containers", "Freezer-safe meal prep containers"],
        note: "Choose stackable containers with lids that seal tightly.",
        terms: ["freezer containers", "meal prep containers", "storage containers"],
      },
      {
        name: "Freezer labels",
        useFor: "Recipe name, date, servings, reheating notes",
        examples: ["Freezer labels", "Painter's tape and marker", "Dissolvable food labels"],
        note: "Label before freezing so meals are easy to rotate.",
        terms: ["freezer labels", "labels", "painter's tape", "painters tape"],
      },
    ],
  },
];

const GROCERY_REFERENCE_ITEMS = GROCERY_REFERENCE_GROUPS.flatMap((group) =>
  group.items.map((item) => ({ ...item, group: group.group }))
);

function findGroceryReference(itemName = "") {
  const normalizedItem = normalizePantryText(itemName);

  return GROCERY_REFERENCE_ITEMS.find((item) =>
    item.terms.some((term) => {
      const normalizedTerm = normalizePantryText(term);
      return normalizedItem === normalizedTerm || normalizedItem.includes(normalizedTerm);
    })
  );
}


function normalizePantryText(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function findPantryMatch(itemName = "") {
  const normalizedItem = normalizePantryText(itemName);

  return PANTRY_MATCHERS.find((matcher) =>
    matcher.terms.some((term) => {
      const normalizedTerm = normalizePantryText(term);
      return normalizedItem === normalizedTerm || normalizedItem.includes(normalizedTerm);
    })
  );
}

function splitShoppingListByPantry(list, pantry) {
  return list.reduce(
    (groups, item) => {
      const match = findPantryMatch(item.name);
      const inPantry = match && pantry[match.pantry];

      if (inPantry) {
        groups.pantry.push({
          ...item,
          pantryName: match.pantry,
        });
      } else {
        groups.needed.push(item);
      }

      return groups;
    },
    { needed: [], pantry: [] }
  );
}

const AUTO_IMAGE_PREFIXES = new Set([
  "AM", "AS", "CC", "CO", "CR", "DN", "DS", "HB", "HBP", "IT", "JJ", "KR", "LF",
  "MR", "MX", "PM", "QP", "CS", "RS", "SB", "SD", "SF", "SG", "SW"
]);

const HERO_IMAGES = [
  "images/thumbs/heroes/hero-grill-wide.jpg",
  "images/thumbs/heroes/hero-pasta-wide.jpg",
  "images/thumbs/heroes/hero-salad-wide.jpg",
  "images/thumbs/heroes/hero-brisket-wide.jpg",
  "images/thumbs/heroes/hero-cake-wide.jpg",
  "images/thumbs/heroes/hero-shrimp-wide.jpg",
];

const HERO_INFO_BUTTONS = [
  {
    line1: "ALWAYS FREE",
    line2: "TO USE",
    title: "WHY WE WILL ALWAYS BE FREE",
    text: "Robert’s Recipe Box is intended to remain free to use. Optional recommendations and affiliate links may help support the site without requiring a paid subscription.",
  },
  {
    line1: "BROWSE OUR",
    line2: "RECIPES",
    title: "BROWSE OUR RECIPE LIBRARY",
    text: "Browse recipe cards by category, search for meal ideas, and open full recipe cards for viewing, printing, or saving.",
  },
  {
    line1: "SELECT YOUR",
    line2: "FAVORITES",
    title: "SELECT YOUR FAVORITE RECIPES",
    text: "Save recipes you like so they are easier to find again on this device. Favorites are stored in your browser.",
  },
  {
    line1: "PLAN YOUR",
    line2: "WEEKLY MEALS",
    title: "PLAN YOUR CUSTOM WEEKLY MEAL PLANS",
    text: "Build a practical meal plan using recipes designed for smaller households, planned leftovers, and freezer-friendly second meals.",
  },
  {
    line1: "MAKE YOUR",
    line2: "GROCERY LIST",
    title: "PRINT YOUR GROCERY LISTS",
    text: "Use your meal plan to create a practical grocery list, review pantry staples, and print a condensed list before shopping.",
  },
  {
    line1: "TIPS &",
    line2: "SUGGESTIONS",
    title: "VIEW OUR TIPS & TRICKS",
    text: "Find practical tips for freezer meals, storage, lower-carb swaps, lower-calorie options, and easier small-household cooking.",
  },
];


const ABOUT_STORY_PHOTOS = [
  {
    src: "images/about/robert-pete-puppy2.jpg",
    alt: "Robert holding Pete as a small puppy",
  },
  {
    src: "images/about/robert-pete-pool.jpg",
    alt: "Robert in the pool with Pete",
  },
  {
    src: "images/about/robert-pete-puppy.jpg",
    alt: "Robert resting with Pete as a puppy",
  },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PLANNER_WEEKS = [
  { id: "week1", title: "Week 1", subtitle: "First 7 dinners" },
  { id: "week2", title: "Week 2", subtitle: "Second 7 dinners" },
];

const PLANNER_SLOTS = PLANNER_WEEKS.flatMap((week) =>
  WEEK_DAYS.map((day) => ({ key: `${week.id}-${day}`, weekId: week.id, day }))
);

function emptyTwoWeekPlan() {
  return PLANNER_SLOTS.reduce((plan, slot) => {
    plan[slot.key] = [];
    return plan;
  }, {});
}

function normalizeTwoWeekPlan(savedPlan) {
  const normalized = emptyTwoWeekPlan();

  if (!savedPlan || typeof savedPlan !== "object") {
    return normalized;
  }

  PLANNER_SLOTS.forEach((slot) => {
    if (Array.isArray(savedPlan[slot.key])) {
      normalized[slot.key] = savedPlan[slot.key];
    }
  });

  // Preserve older one-week saved plans by moving Mon-Sun into Week 1.
  WEEK_DAYS.forEach((day) => {
    const legacyItems = savedPlan[day];
    if (Array.isArray(legacyItems) && legacyItems.length) {
      normalized[`week1-${day}`] = legacyItems;
    }
  });

  return normalized;
}

function plannerSlotLabel(slotKey = "") {
  const [weekId, day] = slotKey.split("-");
  const week = PLANNER_WEEKS.find((item) => item.id === weekId);
  return week && day ? `${week.title} ${day}` : slotKey;
}

function plannedMealCount(plan) {
  return Object.values(plan || {}).reduce(
    (total, dayRecipes) => total + (Array.isArray(dayRecipes) ? dayRecipes.length : 0),
    0
  );
}


function recipeCodePrefix(recipeId = "") {
  const match = recipeId.match(/^[A-Z]+/);
  return match ? match[0] : "";
}

function recipeImageCandidates(recipe) {
  const candidates = [];
  const prefix = recipeCodePrefix(recipe.id);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/thumbs/recipes/${recipe.id}.jpg`);
    candidates.push(`images/thumbs/recipes/${recipe.id} .jpg`);
    candidates.push(`images/heroes/${recipe.id}.jpg`);
    candidates.push(`images/heroes/${recipe.id} .jpg`);
  }

  if (recipe.heroImage) candidates.push(recipe.heroImage);
  if (recipe.image) candidates.push(recipe.image);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/heroes/${recipe.id}.png`);
    candidates.push(`images/heroes/${recipe.id} .png`);
    candidates.push(`images/recipes/${recipe.id}.png`);
    candidates.push(`images/recipes/${recipe.id} .png`);
  }

  return [...new Set(candidates)];
}

function previewCardImageCandidates(recipe) {
  const candidates = [];
  const prefix = recipeCodePrefix(recipe.id);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/thumbs/recipes/${recipe.id}.jpg`);
    candidates.push(`images/thumbs/recipes/${recipe.id} .jpg`);
  }

  if (recipe.cardImage) candidates.push(recipe.cardImage);
  if (recipe.image) candidates.push(recipe.image);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/recipes/${recipe.id}.png`);
    candidates.push(`images/recipes/${recipe.id} .png`);
  }

  if (recipe.heroImage) candidates.push(recipe.heroImage);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/heroes/${recipe.id}.png`);
    candidates.push(`images/heroes/${recipe.id} .png`);
  }

  return [...new Set(candidates)];
}

function fullCardImageCandidates(recipe) {
  const candidates = [];
  const prefix = recipeCodePrefix(recipe.id);

  if (recipe.cardImage) candidates.push(recipe.cardImage);
  if (recipe.image) candidates.push(recipe.image);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/recipes/${recipe.id}.png`);
    candidates.push(`images/recipes/${recipe.id} .png`);
  }

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/thumbs/recipes/${recipe.id}.jpg`);
    candidates.push(`images/thumbs/recipes/${recipe.id} .jpg`);
  }

  if (recipe.heroImage) candidates.push(recipe.heroImage);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/heroes/${recipe.id}.png`);
    candidates.push(`images/heroes/${recipe.id} .png`);
  }

  return [...new Set(candidates)];
}

function Header({ activePage, setActivePage }) {
  const navGroups = [
    {
      label: "OUR MISSION",
      items: [
        { label: "WHY I STARTED THIS PAGE", page: "About" },
        { label: "WHO IS ROBERT", page: "Who Is Robert" },
        { label: "WHAT ARE MY GOALS", page: "My Goals" },
      ],
    },
    {
      label: "COOKING METHODS",
      items: [
        { label: "AIR FRYER RECIPES", page: "Cooking Methods" },
        { label: "OVEN RECIPES", page: "Cooking Methods" },
        { label: "MICROWAVE RECIPES", page: "Cooking Methods" },
        { label: "GAS GRILL RECIPES", page: "Cooking Methods" },
        { label: "SMOKER & PELLET GRILL RECIPES", page: "About Smoking" },
      ],
    },
    {
      label: "OUR RECIPES",
      items: [
        { label: "HOW TO USE THIS SITE", page: "How To Use" },
        { label: "BROWSE ALL RECIPES", page: "Recipes" },
        { label: "SUGGESTED MEAL PLANS", page: "Suggested Meal Plans" },
        { label: "PLAN YOUR MEALS", page: "Meal Planner" },
      ],
    },
    {
      label: "YOUR LISTS",
      items: [
        { label: "YOUR PANTRY", page: "Pantry Staples" },
        { label: "YOUR FAVORITES", page: "Favorites" },
        { label: "YOUR MEAL PLAN", page: "Meal Planner" },
        { label: "YOUR SHOPPING LIST", page: "Shopping Lists" },
      ],
    },
    {
      label: "TIPS & TECHNIQUES",
      items: [
        { label: "BAKING YOUR OWN BREADS", page: "Bread Tips" },
        { label: "SMOKING YOUR OWN MEATS", page: "About Smoking" },
        { label: "FREEZER TECHNIQUES", page: "Freezer Tips" },
        { label: "HEALTHY GROCERY SUBSTITUTIONS", page: "Grocery Picks" },
        { label: "SUBMIT YOUR RECIPES", page: "Submit Recipes" },
        { label: "SAFE COOKING RULES", page: "Safe Cooking Rules" },
        { label: "TOOLS & PRODUCTS", page: "Recommendations" },
        { label: "STORAGE & ORGANIZATION", page: "Storage Organization" },
        { label: "OTHER INTERESTS", page: "Other Interests" },
      ],
    },
  ];

  function openPage(page) {
    setActivePage(page);
  }

  function groupIsActive(group) {
    return group.items.some((item) => activePage === item.page);
  }

  return (
    <header className="topbar">
      <button
        className="brand brandLogoButton"
        onClick={() => setActivePage("Home")}
        aria-label="Go home"
      >
        <img
          className="brandLogoImage"
          src={`${import.meta.env.BASE_URL}images/ui/rrb-logo-wide.png`}
          alt="Robert's Recipe Box"
        />
      </button>

      <nav className="navLinks dropdownNav" aria-label="Main navigation">
        {navGroups.map((group) => (
          <div
            className={groupIsActive(group) ? "navDropdown active" : "navDropdown"}
            key={group.label}
          >
            <button
              className="navDropdownButton"
              type="button"
              onClick={() => openPage(group.items[0].page)}
              aria-haspopup="true"
            >
              {group.label}
              <span aria-hidden="true">⌄</span>
            </button>

            <div className="navDropdownMenu">
              {group.items.map((item, index) => (
                <button
                  key={`${group.label}-${item.label}-${index}`}
                  className={activePage === item.page ? "active" : ""}
                  type="button"
                  onClick={() => openPage(item.page)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="topActions">
        <span>⌕</span>
        <span className="avatar">◉ Robert⌄</span>
      </div>
    </header>
  );
}



function getHeroInfoTargetPage(title) {
  switch (title) {
    case "Always Free To Use":
      return "About";
    case "Browse Our Recipes":
      return "Recipes";
    case "Select Your Favorites":
      return "Favorites";
    case "Plan Your Weekly Meals":
      return "Meal Planner";
    case "Make Your Grocery List":
      return "Shopping Lists";
    case "Tips & Suggestions":
      return "Freezer Tips";
    default:
      return "How To Use";
  }
}

function getHeroInfoMoreInfoLabel(title) {
  return "Read More";
}


function HeroInfoButtons({ setActivePage }) {
  const [openInfo, setOpenInfo] = useState(null);

  return (
    <div className="heroInfoButtons" aria-label="Homepage quick information">
      {HERO_INFO_BUTTONS.map((item, index) => (
        <div className="heroInfoButtonWrap" key={item.title}>
          <button
            type="button"
            className="heroInfoButton"
            onClick={() =>
              setOpenInfo((current) => (current === item.title ? null : item.title))
            }
            aria-expanded={openInfo === item.title}
          >
            <span className="heroInfoStepNumber" aria-hidden="true">{index + 1}</span>
            <span>{item.line1}</span>
            <span>{item.line2}</span>
          </button>

          {openInfo === item.title && (
            <div className="heroInfoPopup">
              <div className="heroInfoPopupHeader">
                <strong>{item.title}</strong>
                <button
                  type="button"
                  onClick={() => setOpenInfo(null)}
                  aria-label={`Close ${item.title} information`}
                >
                  ×
                </button>
              </div>
              <p>{item.text}</p>

              <button
                type="button"
                className="heroInfoMoreButton"
                onClick={() => {
                  setOpenInfo(null);
                  setActivePage(getHeroInfoTargetPage(item.title));
                }}
              >
                {getHeroInfoMoreInfoLabel(item.title)}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Hero({ setActivePage }) {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % HERO_IMAGES.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      <div className="heroRotator" aria-hidden="true">
        {HERO_IMAGES.map((imagePath, index) => (
          <img
            key={imagePath}
            className={index === heroIndex ? "heroRotatorImage active" : "heroRotatorImage"}
            src={`${import.meta.env.BASE_URL}${imagePath}`}
            alt=""
            decoding="async"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ))}
      </div>

      <div className="heroOverlay" aria-hidden="true" />

      <div className="heroCopy">
        <div className="aiBadge">✧ AI-POWERED RECIPE PLANNING ✧</div>

        <h1>
          Helping to organize your cooking, kitchen, & shopping - all in one place...
        </h1>

        <p>
          Browse AI-generated recipes, save your favorites,
          <br />
          build weekly meal plans, create smart shopping lists,
          <br />
          and track pantry staples.
        </p>

        <div className="heroButtons">
          <button className="primary" onClick={() => setActivePage("Recipes")}>
            ▣ Browse Recipes
          </button>
          <button
            className="secondary"
            onClick={() => setActivePage("Meal Planner")}
          >
            ▣ Start Meal Planning
          </button>
          <button
            className="secondary freezerHeroButton"
            onClick={() => setActivePage("Freezer Tips")}
          >
            ▣ Freezer Tips
          </button>
        </div>
      </div>
      <HeroInfoButtons setActivePage={setActivePage} />

    </section>
  );
}

function TransparencyLine() {
  return (
    <div className="transparencyLine">
      <strong>Transparency first:</strong> All recipes & collections in Robert’s Recipe Box are AI-generated planning tools — not private family recipes.
    </div>
  );
}

function CategoryGrid({ setFilter, setActivePage }) {
  const categoryLookup = new Map(categories.map((category) => [category.id, category]));
  const homeCategories = HOME_CATEGORY_CODES.map((code) => {
    const fallback = HOME_CATEGORY_FALLBACKS[code];
    const existing = categoryLookup.get(code);

    return {
      ...fallback,
      ...(existing || {}),
      displayName: HOME_CATEGORY_LABELS[code],
      iconImage: CATEGORY_ICON_IMAGES[code],
    };
  });

  function openCategory(category) {
    const matchingCategory = categories.find((item) => item.id === category.id);
    setFilter(matchingCategory?.name || category.name);
    setActivePage("Recipes");
  }

  return (
    <section className="section homeCategorySection">
      <div className="sectionTitle homeCategoryTitle">
        <h2>Browse by Category</h2>
        <button onClick={() => setActivePage("Recipes")}>View all categories ›</button>
      </div>

      <div className="categoryGrid homeCategoryGrid">
        {homeCategories.map((cat) => (
          <button
            key={cat.id}
            className={HOME_CATEGORY_CODES.indexOf(cat.id) >= 10 ? "categoryTile homeCategoryTile secondRowCategoryTile" : "categoryTile homeCategoryTile"}
            onClick={() => openCategory(cat)}
            aria-label={`View ${cat.displayName} recipes`}
          >
            <img
              className="categoryIconImage"
              src={`${import.meta.env.BASE_URL}${cat.iconImage}`}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              onError={(event) => {
                event.currentTarget.style.display = "none";
                const fallback = event.currentTarget.nextElementSibling;
                if (fallback) fallback.style.display = "grid";
              }}
            />
            <span className="categoryIcon categoryIconFallback" aria-hidden="true">
              {cat.icon}
            </span>
            <strong>{cat.displayName}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}

function RecipeImage({ recipe }) {
  const candidates = recipeImageCandidates(recipe);
  const [imageIndex, setImageIndex] = useState(0);
  const imagePath = candidates[imageIndex];

  useEffect(() => {
    setImageIndex(0);
  }, [recipe.id]);

  if (imagePath) {
    return (
      <div className="recipeImage recipePhoto">
        <img
          src={`${import.meta.env.BASE_URL}${imagePath}`}
          alt={recipe.title}
          loading="lazy"
          decoding="async"
          onError={() => setImageIndex((current) => current + 1)}
        />
      </div>
    );
  }

  return (
    <div className="recipeImage" style={{ background: recipe.imageStyle }}>
      <span>{recipe.emoji}</span>
    </div>
  );
}

function FullRecipeCardPreview({ recipe, onOpen }) {
  const candidates = previewCardImageCandidates(recipe);
  const [imageIndex, setImageIndex] = useState(0);
  const imagePath = candidates[imageIndex];

  useEffect(() => {
    setImageIndex(0);
  }, [recipe.id]);

  if (imagePath) {
    return (
      <button
        className="recipeImage recipeFullCardImage recipeFullCardImageButton"
        onClick={onOpen}
        aria-label={`Open ${recipe.title} recipe card`}
      >
        <img
          src={`${import.meta.env.BASE_URL}${imagePath}`}
          alt={`${recipe.id} ${recipe.title} recipe card`}
          loading="lazy"
          decoding="async"
          onError={() => setImageIndex((current) => current + 1)}
        />
      </button>
    );
  }

  return <RecipeImage recipe={recipe} />;
}

function getRecipeBrowseTags(recipe) {
  const title = recipe.title.toLowerCase();
  const tags = [];

  function addTag(tag) {
    if (tag && !tags.includes(tag)) tags.push(tag);
  }

  if (recipe.category === 'Side Dishes') addTag('Side Dish');
  else if (recipe.category === 'Salads & Bowls') addTag('Salad');
  else addTag(recipe.category);

  if (title.includes('casserole') || title.includes('bake') || title.includes('lasagna') || title.includes('pot pie')) {
    addTag('Casserole');
  }

  if (title.includes('pasta') || title.includes('alfredo') || title.includes('spaghetti') || title.includes('ziti') || title.includes('mac')) {
    addTag('Pasta');
  }

  if (Number(recipe.time) <= 30) {
    addTag('Quick & Easy');
  }

  if (Number(recipe.servings) >= 6 || title.includes('casserole') || title.includes('bake')) {
    addTag('Family Favorite');
  }

  if (title.includes('taco') || title.includes('mac') || title.includes('pizza') || title.includes('cheese')) {
    addTag('Kid Friendly');
  }

  return tags.slice(0, 3);
}


function titleIncludes(recipe, terms) {
  const text = `${recipe.id || ""} ${recipe.title || ""} ${recipe.category || ""}`.toLowerCase();
  return terms.some((term) => text.includes(term));
}

function getRecipeSmartTips(recipe) {
  const category = recipe.categoryCode || "";
  const isDessert = ["CC", "CO", "CR", "DN", "DS", "JJ", "PM"].includes(category);
  const isBread = ["LF", "KR"].includes(category);
  const isSeafood = category === "SF";
  const isMexican = category === "MX";
  const isItalian = category === "IT";
  const isBurger = category === "HB" || category === "HBP";
  const isSalad = category === "SB";
  const isSide = category === "SD";
  const isSmoked = category === "SG";

  const tips = {
    calories: "Use smaller portions, measure sauces and cheese, and add vegetables or salad on the side.",
    carbs: "Reduce bread, pasta, rice, crust, or sugar where possible; use lower-carb swaps when the texture still works.",
    sodium: "Choose reduced-sodium sauces, broths, canned goods, and seasoning blends; taste before adding extra salt.",
    protein: "Add lean protein or use a higher-protein version of the main ingredient when possible.",
  };

  if (isMexican) {
    tips.calories = "Use lean chicken or lean ground beef, go lighter on cheese and sour cream, and bulk up with lettuce, peppers, onions, or salsa.";
    tips.carbs = "Use low-carb tortillas, make it a bowl over cauliflower rice, or serve beans/rice in smaller portions.";
    tips.sodium = "Choose reduced-sodium taco seasoning, salsa, beans, broth, and enchilada sauce.";
    tips.protein = "Add extra grilled chicken, lean taco meat, shrimp, or Greek-yogurt topping instead of extra cheese.";
  }

  if (isItalian) {
    tips.calories = "Use part-skim mozzarella, lighter cream sauces, and add vegetables to stretch the meal without adding much fat.";
    tips.carbs = "Use protein pasta, smaller pasta portions, zucchini noodles, spaghetti squash, or a half pasta / half vegetable base.";
    tips.sodium = "Pick no-salt-added tomatoes, lower-sodium marinara, and go lighter on parmesan and cured meats.";
    tips.protein = "Add grilled chicken, turkey meatballs, shrimp, lean beef, or cottage-cheese/Greek-yogurt blended sauces.";
  }

  if (isBurger) {
    tips.calories = "Use a leaner patty, smaller bun, lighter cheese, and load up with lettuce, tomato, onions, and pickles.";
    tips.carbs = "Use a lettuce wrap, low-carb bun, half bun, or burger bowl instead of a full bun.";
    tips.sodium = "Use lower-sodium seasoning and sauces; go easy on pickles, bacon, processed cheese, and bottled condiments.";
    tips.protein = "Use lean ground beef, turkey, chicken, or a slightly larger patty with fewer high-calorie toppings.";
  }

  if (isSeafood) {
    tips.calories = "Bake, grill, or air fry instead of deep frying; use lemon, herbs, and light butter or olive oil.";
    tips.carbs = "Skip heavy breading or use a light almond-flour/panko mix; serve with vegetables or cauliflower rice.";
    tips.sodium = "Use salt-free seafood seasoning or reduced-sodium Old Bay-style seasoning; avoid heavy bottled sauces.";
    tips.protein = "Increase the seafood portion slightly or pair with Greek-yogurt slaw, cottage cheese, or a high-protein side.";
  }

  if (isSalad) {
    tips.calories = "Keep dressing on the side, measure nuts/cheese/croutons, and use Greek-yogurt-based dressings.";
    tips.carbs = "Limit croutons, tortilla strips, pasta, dried fruit, and sweet dressings.";
    tips.sodium = "Go lighter on deli meats, bacon, cheese, pickles, olives, and bottled dressings.";
    tips.protein = "Add grilled chicken, tuna, salmon, shrimp, eggs, cottage cheese, beans, or Greek-yogurt dressing.";
  }

  if (isSide) {
    tips.calories = "Use light butter, broth, herbs, or Greek yogurt instead of heavy cream or extra cheese.";
    tips.carbs = "Use cauliflower rice, roasted vegetables, smaller potato portions, or half-and-half starch/vegetable blends.";
    tips.sodium = "Use reduced-sodium broth, rinse canned vegetables/beans, and season with herbs before adding salt.";
    tips.protein = "Pair with lean protein, add beans where appropriate, or use Greek yogurt/cottage cheese in creamy sides.";
  }

  if (isSmoked) {
    tips.calories = "Choose leaner cuts when possible, trim visible fat, and measure BBQ sauce.";
    tips.carbs = "Use no-sugar-added BBQ sauce and serve with lower-carb sides like slaw, salad, or green vegetables.";
    tips.sodium = "Use a lower-sodium rub and avoid over-seasoning before smoking or grilling.";
    tips.protein = "Portion meat into two-serving freezer packs so protein is ready for future meals.";
  }

  if (isBread) {
    tips.calories = "Make smaller portions or rolls, freeze extras immediately, and use measured butter or spreads.";
    tips.carbs = "Homemade is a good option because you control ingredients; try smaller slices or partial whole-wheat blends.";
    tips.sodium = "Reduce added salt slightly in homemade dough and avoid salty processed fillings when possible.";
    tips.protein = "Use higher-protein flour blends, add Greek yogurt where appropriate, or pair bread with eggs, lean meats, or cottage cheese.";
  }

  if (isDessert) {
    tips.calories = "Make smaller portions, use mini servings, reduce frosting/toppings, or freeze individual portions.";
    tips.carbs = "Use lower-sugar fruit, sugar substitutes where they work, almond flour blends, or smaller crust portions.";
    tips.sodium = "Use unsalted butter and watch boxed mixes, canned fillings, and salty toppings.";
    tips.protein = "Add Greek yogurt, cottage cheese, protein powder, or serve with a higher-protein meal rather than eating alone.";
  }

  if (titleIncludes(recipe, ["fried", "fries", "fritter", "donut", "hush puppies", "egg rolls", "spring rolls"])) {
    tips.calories = "Air fry or bake instead of deep frying when possible; use a light oil spray and smaller portions.";
    tips.carbs = "Use lighter breading, smaller portions, or pair with a low-carb main dish.";
  }

  if (titleIncludes(recipe, ["rice bowl", "fried rice", "rice", "burrito bowl"])) {
    tips.carbs = "Use cauliflower rice, half cauliflower rice / half regular rice, or a smaller rice base with extra vegetables.";
    tips.protein = "Add extra chicken, shrimp, lean beef, eggs, or beans to make the bowl more filling.";
  }

  if (titleIncludes(recipe, ["pasta", "spaghetti", "ziti", "alfredo", "mac", "noodles", "lo mein", "chow mein"])) {
    tips.carbs = "Use protein pasta, zucchini noodles, hearts-of-palm pasta, spaghetti squash, or half pasta / half vegetables.";
    tips.protein = "Add grilled chicken, shrimp, lean beef, turkey meatballs, or cottage cheese blended into sauce.";
  }

  if (titleIncludes(recipe, ["casserole", "bake", "lasagna", "pot pie"])) {
    tips.calories = "Use lean protein, lighter cheese or sauce, and add vegetables to stretch the casserole.";
    tips.carbs = "Use a thinner crust, smaller pasta/rice layer, cauliflower rice, or extra vegetables.";
    tips.sodium = "Use reduced-sodium soups, broths, sauces, and canned vegetables.";
  }

  return tips;
}


function getRecipeCookingOptions(recipe) {
  const title = `${recipe.title || ""}`.toLowerCase();
  const category = recipe.categoryCode || "";

  const options = [];

  if (category === "SG" || title.includes("smoked") || title.includes("brisket") || title.includes("ribs")) {
    options.push({
      label: "Smoker / Pellet Grill",
      text: "Best for low-and-slow flavor. Cook to temperature, rest the meat when needed, and portion leftovers for sandwiches, bowls, tacos, or freezer meals.",
    });
  }

  if (title.includes("grilled") || title.includes("burger") || title.includes("hot dog") || title.includes("fajita")) {
    options.push({
      label: "Gas Grill",
      text: "Good for quick outdoor cooking. Watch hot spots, use a thermometer for meat, and keep cooked portions covered while resting.",
    });
  }

  if (
    title.includes("baked") ||
    title.includes("casserole") ||
    title.includes("pie") ||
    title.includes("quiche") ||
    title.includes("muffin") ||
    title.includes("bread") ||
    title.includes("roll") ||
    category === "QP" ||
    category === "PM" ||
    category === "LF"
  ) {
    options.push({
      label: "Oven",
      text: "Use the recipe-card temperature as a guide. Ovens vary, so begin checking near the early end of the cooking time.",
    });
  }

  if (
    title.includes("fried") ||
    title.includes("fries") ||
    title.includes("shrimp") ||
    title.includes("nugget") ||
    title.includes("egg roll")
  ) {
    options.push({
      label: "Air Fryer",
      text: "Useful for crisping smaller portions. Cook in a single layer, shake or turn halfway through, and reduce time if portions are small.",
    });
  }

  if (title.includes("soup") || title.includes("rice") || title.includes("reheat") || category === "SD") {
    options.push({
      label: "Microwave",
      text: "Helpful for reheating leftovers or simple sides. Cover loosely, stir when practical, and make sure reheated foods are hot throughout.",
    });
  }

  if (
    title.includes("skillet") ||
    title.includes("stir") ||
    title.includes("alfredo") ||
    title.includes("queso") ||
    title.includes("pasta") ||
    category === "AS" ||
    category === "MX" ||
    category === "IT"
  ) {
    options.push({
      label: "Stovetop",
      text: "Good for sauces, skillets, pasta dishes, and quick reheating. Use medium heat when reheating creamy sauces so they do not separate.",
    });
  }

  if (options.length === 0) {
    options.push({
      label: "Best Method",
      text: "Follow the method shown on the recipe card first. Adjust time, temperature, and equipment based on your kitchen and portion size.",
    });
  }

  return options.slice(0, 4);
}


function SmartTipsButton({ recipe, position = "inline" }) {
  const [open, setOpen] = useState(false);
  const tips = getRecipeSmartTips(recipe);

  const wrapperClass =
    position === "viewerTop"
      ? "smartTipsWrap smartTipsViewerTopWrap"
      : "smartTipsWrap";

  return (
    <div className={wrapperClass}>
      <button
        type="button"
        className="smartTipsButton"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        Smart Tips
      </button>

      {open && (
        <div className="smartTipsBubble">
          <div className="smartTipsBubbleHeader">
            <strong>{recipe.title}</strong>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close smart tips">
              ×
            </button>
          </div>

          <ul>
            <li>
              <strong>Lower calorie:</strong> {tips.calories}
            </li>
            <li>
              <strong>Lower carb:</strong> {tips.carbs}
            </li>
            <li>
              <strong>Lower sodium:</strong> {tips.sodium}
            </li>
            <li>
              <strong>Higher protein:</strong> {tips.protein}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}



function getRecipePersonalNote(recipe) {
  if (recipe.personalNote?.text) {
    return {
      title: recipe.personalNote.title || "My Recipe Notes",
      text: recipe.personalNote.text,
    };
  }

  const category = recipe.categoryCode || "";
  const title = `${recipe.title || ""}`.toLowerCase();

  let text =
    "This is a practical recipe to keep in the rotation. I would think about how it fits a two-person meal plan, what can be saved for later, and whether the extra portion is better refrigerated or frozen.";

  if (category === "MX") {
    text = "For Mexican-style meals, I like making the filling first and then deciding how to serve it. Use tortillas for one meal, then make a bowl or salad with the leftovers. Low-carb tortillas, salsa, and a little less cheese can help keep it lighter.";
  } else if (category === "IT") {
    text = "Italian meals are often good planned-leftover meals. I would keep pasta portions reasonable, add extra protein or vegetables where possible, and freeze extra sauce or baked portions for another week.";
  } else if (category === "SB") {
    text = "For salads and bowls, I would keep the dressing separate until serving. These can be great for lunch the next day, especially when the protein is already cooked and portioned.";
  } else if (category === "SD") {
    text = "Side dishes are a good place to stretch a meal without making dinner complicated. I would make enough for today, then save a small portion to pair with another protein later in the week.";
  } else if (category === "SF") {
    text = "Seafood is usually best fresh, but simple cooked portions can still work for another meal if handled carefully. I would keep sauces light, add lemon or herbs, and avoid overcooking when reheating.";
  } else if (category === "SG") {
    text = "Smoked and grilled meats are perfect for cook-once, eat-twice planning. I would portion the extra meat into two-serving freezer packs so it is ready for sandwiches, bowls, salads, or quick dinners later.";
  } else if (category === "HB" || category === "HBP") {
    text = "Burgers and patties are easy to adapt. I would freeze extra patties between parchment, use a lighter bun or burger bowl when needed, and keep toppings simple so the meal stays practical.";
  } else if (category === "QP") {
    text = "Quiche and pies can work well for planned leftovers. I would cool slices completely, wrap them well, and reheat gently. A salad or vegetable side helps turn one slice into a full meal.";
  } else if (category === "PM") {
    text = "Protein muffins are useful for quick breakfasts or snacks. I would freeze extras individually so they are easy to pull out one at a time instead of leaving a whole batch on the counter.";
  } else if (["CC", "CO", "CR", "DN", "JJ"].includes(category)) {
    text = "For sweets, smaller portions are usually the best plan. I would freeze individual servings when possible so dessert is available without keeping the whole batch out at once.";
  } else if (["LF", "KR"].includes(category)) {
    text = "Homemade bread-style recipes let you control the ingredients. I would freeze extras early, label them clearly, and pull out only what is needed for a meal or two.";
  }

  if (title.includes("queso")) {
    text = "This is best served warm and is more of a treat or sharing recipe. For a lighter version, use a little less processed cheese, add tomatoes or peppers, and serve with baked chips, low-carb tortillas, or fresh vegetables. I would refrigerate leftovers and reheat gently instead of freezing.";
  } else if (title.includes("casserole") || title.includes("bake") || title.includes("lasagna")) {
    text = "This is the kind of recipe that fits the cook-once, eat-once, freeze-once idea. I would portion the extra servings into a two-person freezer container, label it with the date, and save it for a night when cooking from scratch feels like too much.";
  } else if (title.includes("soup") || title.includes("gumbo") || title.includes("bisque")) {
    text = "Soups are great freezer meals. I would cool the extra portion completely, freeze it flat in bags or in two-serving containers, and add fresh toppings only after reheating.";
  } else if (title.includes("fried") || title.includes("fries") || title.includes("fritter")) {
    text = "Fried-style foods are usually best fresh. If I wanted a lighter version, I would try the air fryer or oven, use a light oil spray, and make only the amount needed for the meal.";
  }

  return { title: "My Recipe Notes", text };
}

function MyRecipeNotesButton({ recipe, position = "inline" }) {
  const [open, setOpen] = useState(false);
  const note = getRecipePersonalNote(recipe);

  const wrapperClass =
    position === "viewerTop"
      ? "recipeNotesWrap recipeNotesViewerTopWrap"
      : "recipeNotesWrap";

  return (
    <div className={wrapperClass}>
      <button
        type="button"
        className="recipeNotesButton"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        My Recipe Notes
      </button>

      {open && (
        <div className="recipeNotesBubble">
          <div className="recipeNotesPaper">
            <div className="recipeNotesHeader">
              <strong>{note.title}</strong>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close recipe notes">
                ×
              </button>
            </div>
            <p>{note.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}


function RecipeCard({
  recipe,
  favorites,
  toggleFavorite,
  addToPlan,
  openRecipeCard,
  cardList = recipes,
  showPlannerButton = true,
  viewButtonText = "View Recipe",
  displayMode = "hero",
}) {
  const isBrowseCard = displayMode === "card";
  const browseTags = isBrowseCard ? getRecipeBrowseTags(recipe) : [];
  const isFavorite = favorites.includes(recipe.id);

  return (
    <article className={isBrowseCard ? "recipeCard recipeCardFullImage" : "recipeCard"}>
      {isBrowseCard ? (
        <FullRecipeCardPreview
          recipe={recipe}
          onOpen={() => openRecipeCard(recipe.id, cardList)}
        />
      ) : (
        <RecipeImage recipe={recipe} />
      )}

      {!isBrowseCard && (
        <button
          className={`heart ${isFavorite ? "saved" : ""}`}
          onClick={() => toggleFavorite(recipe.id)}
          aria-label="Save favorite"
        >
          ♡
        </button>
      )}

      <div className="recipeBody">
        <span className={`tag tag-${recipe.categoryCode}`}>
          {recipe.category}
        </span>

        <h3>{recipe.title}</h3>

        {isBrowseCard ? (
          <>
            <div className="recipeActions browseRecipeActions">
              <button
                className="viewCard"
                onClick={() => openRecipeCard(recipe.id, cardList)}
              >
                {viewButtonText}
              </button>
              {showPlannerButton && (
                <button className="addPlan" onClick={() => addToPlan(recipe.id)}>
                  Add to Planner
                </button>
              )}
              <SmartTipsButton recipe={recipe} />
              <MyRecipeNotesButton recipe={recipe} />
            </div>

            <div className="browseRecipeMetaFooter">
              <div className="meta">
                <span>◷ {recipe.time} min</span>
                <span>♙ {recipe.servings} servings</span>
                <span>{recipe.price}</span>
              </div>

              <button
                className={`heart browseCardHeart ${isFavorite ? "saved" : ""}`}
                onClick={() => toggleFavorite(recipe.id)}
                aria-label="Save favorite"
              >
                ♡
              </button>
            </div>

            <div className="browseRecipeTags">
              {browseTags.map((tag) => (
                <span
                  key={`${recipe.id}-${tag}`}
                  className={`browseRecipeTag browseRecipeTag-${recipe.categoryCode}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="meta">
              <span>◷ {recipe.time} min</span>
              <span>♙ {recipe.servings}</span>
              <span>{recipe.price}</span>
            </div>

            <div className="recipeActions">
              <button
                className="viewCard"
                onClick={() => openRecipeCard(recipe.id, cardList)}
              >
                {viewButtonText}
              </button>
              {showPlannerButton && (
                <button className="addPlan" onClick={() => addToPlan(recipe.id)}>
                  Add to planner
                </button>
              )}
              <SmartTipsButton recipe={recipe} />
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function mediaIcon(type = "") {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes("youtube") || normalizedType.includes("video")) return "▶";
  if (normalizedType.includes("instagram")) return "◎";
  if (normalizedType.includes("facebook")) return "f";
  if (normalizedType.includes("tiktok")) return "♪";
  if (normalizedType.includes("product")) return "▣";
  if (normalizedType.includes("freezer")) return "❄";
  if (normalizedType.includes("storage")) return "□";

  return "↗";
}


function getRecipeEstimatedCost(recipe) {
  const title = `${recipe.title || ""}`.toLowerCase();
  const category = recipe.categoryCode || "";
  const servings = Number(recipe.servings || 4) || 4;

  let low = 8;
  let high = 13;
  let pantryLow = 5;
  let pantryHigh = 9;
  let note =
    "This estimate assumes typical store-brand pricing and common pantry staples such as salt, pepper, oil, flour, sugar, and basic seasonings may already be on hand.";

  if (category === "SF" || title.includes("shrimp") || title.includes("salmon") || title.includes("cod") || title.includes("seafood")) {
    low = 13;
    high = 20;
    pantryLow = 10;
    pantryHigh = 16;
    note = "Seafood prices vary widely by store, package size, fresh versus frozen, and local availability.";
  } else if (category === "SG" || title.includes("brisket") || title.includes("ribs") || title.includes("pork butt") || title.includes("smoked")) {
    low = 18;
    high = 32;
    pantryLow = 14;
    pantryHigh = 26;
    note = "Smoked and grilled meats can cost more up front, but larger cuts often provide several meals or freezer portions.";
  } else if (category === "HB" || title.includes("burger") || title.includes("hamburger") || title.includes("patties")) {
    low = 10;
    high = 17;
    pantryLow = 8;
    pantryHigh = 13;
    note = "Burger costs depend heavily on meat choice, buns, cheese, toppings, and whether condiments are already on hand.";
  } else if (category === "PM" || title.includes("muffin")) {
    low = 6;
    high = 11;
    pantryLow = 4;
    pantryHigh = 8;
    note = "Baking recipes are usually lower-cost if flour, sweeteners, spices, and oil are already in the pantry.";
  } else if (category === "QP" || title.includes("quiche") || title.includes("pie")) {
    low = 8;
    high = 15;
    pantryLow = 6;
    pantryHigh = 12;
    note = "Quiche and pie costs depend on cheese, eggs, crust, meat, and whether baking staples are already available.";
  } else if (category === "SD" || title.includes("rice") || title.includes("beans") || title.includes("potatoes") || title.includes("vegetables")) {
    low = 4;
    high = 9;
    pantryLow = 3;
    pantryHigh = 7;
    note = "Side dishes are often budget-friendly, especially when they use pantry staples, frozen vegetables, rice, beans, or potatoes.";
  } else if (category === "MX" || category === "AS" || category === "IT") {
    low = 9;
    high = 16;
    pantryLow = 7;
    pantryHigh = 13;
    note = "Cuisine-style meals vary based on sauces, proteins, cheese, pasta, rice, tortillas, and vegetables already on hand.";
  } else if (category === "CC" || category === "CO" || category === "CR" || category === "DN" || category === "JJ") {
    low = 7;
    high = 14;
    pantryLow = 5;
    pantryHigh = 10;
    note = "Dessert and baking costs depend on dairy, fruit, chocolate, nuts, and how many baking staples are already in the pantry.";
  }

  const perServingLow = low / servings;
  const perServingHigh = high / servings;
  const pantryPerServingLow = pantryLow / servings;
  const pantryPerServingHigh = pantryHigh / servings;

  function money(value) {
    return `$${value.toFixed(2)}`;
  }

  return {
    servings,
    recipeRange: `$${low.toFixed(0)}–$${high.toFixed(0)}`,
    pantryRange: `$${pantryLow.toFixed(0)}–$${pantryHigh.toFixed(0)}`,
    perServingRange: `${money(perServingLow)}–${money(perServingHigh)}`,
    pantryPerServingRange: `${money(pantryPerServingLow)}–${money(pantryPerServingHigh)}`,
    note,
  };
}


function RecipeCardViewer({ viewer, onClose, setViewer, favorites, toggleFavorite }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [openPanel, setOpenPanel] = useState(null);

  const viewerIds = viewer?.recipeIds?.length
    ? viewer.recipeIds
    : recipes.map((recipe) => recipe.id);
  const currentIndex = viewer
    ? Math.max(0, viewerIds.indexOf(viewer.recipeId))
    : 0;
  const currentRecipeId = viewerIds[currentIndex] || viewer?.recipeId;
  const recipe = viewer
    ? recipes.find((item) => item.id === currentRecipeId) ||
      recipes.find((item) => item.id === viewer.recipeId)
    : null;

  useEffect(() => {
    setImageIndex(0);
    setOpenPanel(null);
  }, [recipe?.id]);

  if (!viewer || !recipe) return null;

  const isFavorite = favorites.includes(recipe.id);
  const imageCandidates = fullCardImageCandidates(recipe);
  const imagePath = imageCandidates[imageIndex];
  const hasMultiple = viewerIds.length > 1;
  const tips = getRecipeSmartTips(recipe);
  const note = getRecipePersonalNote(recipe);
  const cookingOptions = getRecipeCookingOptions(recipe);
  const estimatedCost = getRecipeEstimatedCost(recipe);

  function goToOffset(offset) {
    if (!hasMultiple) return;

    const nextIndex =
      (currentIndex + offset + viewerIds.length) % viewerIds.length;

    setViewer({
      recipeId: viewerIds[nextIndex],
      recipeIds: viewerIds,
    });
  }

  function togglePanel(panelName) {
    setOpenPanel((current) => (current === panelName ? null : panelName));
  }

  function printCurrentCard() {
    if (!imagePath) return;

    const imageUrl = `${window.location.origin}${import.meta.env.BASE_URL}${imagePath}`;
    const printWindow = window.open("", "_blank", "width=1000,height=750");

    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${recipe.id} ${recipe.title}</title>
          <style>
            @page {
              size: landscape;
              margin: 0.25in;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              min-height: 100vh;
              display: grid;
              place-items: center;
              background: #ffffff;
              font-family: Arial, sans-serif;
            }

            img {
              width: 100%;
              max-width: 10.5in;
              max-height: 7.5in;
              object-fit: contain;
              display: block;
            }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" alt="${recipe.id} ${recipe.title} recipe card" />
          <script>
            const image = document.querySelector("img");
            image.onload = () => {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  async function downloadCurrentCard() {
    if (!imagePath) return;

    const imageUrl = `${import.meta.env.BASE_URL}${imagePath}`;
    const fileName = `${recipe.id}-${recipe.title}`
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/(^-|-$)/g, "")
      .toLowerCase() + ".png";

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }

  return (
    <div className="cardViewerOverlay" onClick={onClose}>
      <div className="cardViewer cardViewerBottomActions" onClick={(event) => event.stopPropagation()}>
        <div className="cardViewerHeader">
          <div>
            <span className="cardViewerCode">{recipe.id}</span>
            <h2>{recipe.title}</h2>
          </div>

          <div className="cardViewerHeaderActions compact">
            <button className="cardViewerClose" onClick={onClose} aria-label="Close recipe viewer">
              ×
            </button>
          </div>
        </div>

        <div className="cardViewerStage">
          <button
            className="cardViewerNav"
            onClick={() => goToOffset(-1)}
            disabled={!hasMultiple}
            aria-label="Previous recipe card"
          >
            ‹
          </button>

          <div className="cardViewerImageWrap">
            {imagePath ? (
              <img
                src={`${import.meta.env.BASE_URL}${imagePath}`}
                alt={`${recipe.id} ${recipe.title} recipe card`}
                decoding="async"
                onError={() => setImageIndex((current) => current + 1)}
              />
            ) : (
              <div className="cardViewerMissing">
                <strong>Recipe card image not found.</strong>
                <span>
                  Expected: images/recipes/{recipe.id}.png
                </span>
              </div>
            )}
          </div>

          <button
            className="cardViewerNav"
            onClick={() => goToOffset(1)}
            disabled={!hasMultiple}
            aria-label="Next recipe card"
          >
            ›
          </button>
        </div>

        {recipe.mediaLinks?.length > 0 && (
          <div className="cardViewerHelpfulLinks">
            <strong>Helpful links</strong>
            <div>
              {recipe.mediaLinks.map((link, index) => (
                <a
                  key={`${recipe.id}-media-${index}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{mediaIcon(link.type || link.label)}</span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {openPanel && (
          <div className="viewerBottomSheet" role="dialog" aria-label={`${openPanel} information`}>
            <div className="viewerBottomSheetHandle" />
            <div className="viewerBottomSheetHeader">
              <strong>
                {openPanel === "cooking" && "Cooking Options"}
                {openPanel === "tips" && "Smart Tips"}
                {openPanel === "notes" && "My Recipe Notes"}
                {openPanel === "cost" && "Estimated Cost"}
              </strong>
              <button type="button" onClick={() => setOpenPanel(null)} aria-label="Close popup">
                ×
              </button>
            </div>

            {openPanel === "cooking" && (
              <div className="viewerBottomSheetContent">
                <p className="viewerSheetIntro">
                  Practical ways to think about cooking or reheating this recipe.
                </p>
                <div className="viewerCookingOptionList">
                  {cookingOptions.map((option) => (
                    <article key={`${recipe.id}-${option.label}`} className="viewerCookingOption">
                      <h3>{option.label}</h3>
                      <p>{option.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {openPanel === "tips" && (
              <div className="viewerBottomSheetContent">
                <ul className="viewerSmartTipsList">
                  <li>
                    <strong>Lower calorie:</strong> {tips.calories}
                  </li>
                  <li>
                    <strong>Lower carb:</strong> {tips.carbs}
                  </li>
                  <li>
                    <strong>Lower sodium:</strong> {tips.sodium}
                  </li>
                  <li>
                    <strong>Higher protein:</strong> {tips.protein}
                  </li>
                </ul>
              </div>
            )}

            {openPanel === "notes" && (
              <div className="viewerBottomSheetContent viewerNotesSheet">
                <div className="viewerNotesPaper">
                  <h3>{note.title}</h3>
                  <p>{note.text}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="cardViewerFooter cardViewerUnifiedFooter">
          <span className="cardViewerCount">
            {currentIndex + 1} of {viewerIds.length}
          </span>

          <div className="cardViewerFooterActions viewerUnifiedActions">
            <button
              className={openPanel === "cooking" ? "viewerActionButton active" : "viewerActionButton"}
              type="button"
              onClick={() => togglePanel("cooking")}
            >
              Cooking Options
            </button>

            <button
              className={openPanel === "tips" ? "viewerActionButton active" : "viewerActionButton"}
              type="button"
              onClick={() => togglePanel("tips")}
            >
              Smart Tips
            </button>

            <button
              className={openPanel === "notes" ? "viewerActionButton viewerActionNotes active" : "viewerActionButton viewerActionNotes"}
              type="button"
              onClick={() => togglePanel("notes")}
            >
              My Recipe Notes
            </button>


            <button
              className={openPanel === "cost" ? "viewerActionButton viewerActionCost active" : "viewerActionButton viewerActionCost"}
              type="button"
              onClick={() => togglePanel("cost")}
            >
              Estimated Cost
            </button>

            <button
              className={isFavorite ? "viewerActionHeart saved" : "viewerActionHeart"}
              type="button"
              onClick={() => toggleFavorite(recipe.id)}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              ♥
            </button>

            <button
              className="viewerActionButton viewerActionPrint"
              onClick={printCurrentCard}
              disabled={!imagePath}
            >
              Print this recipe
            </button>

            <button
              className="viewerActionButton viewerActionDownload"
              onClick={downloadCurrentCard}
              disabled={!imagePath}
            >
              Download this recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


function CollectionStrip() {
  const collectionCards = [
    {
      title: "Slow Cooker Favorites",
      text: "Set-it-and-forget-it meals for easy crock-pot cooking.",
    },
    {
      title: "Summer Cookouts",
      text: "Grill-friendly meals and warm-weather favorites.",
    },
    {
      title: "Healthy Dinners",
      text: "Balanced meals for lighter weeknight cooking.",
    },
    {
      title: "Comfort Foods",
      text: "Popular classics for familiar family-style meals.",
    },
    {
      title: "Easy 30-Minute Meals",
      text: "Fast 30-minute dinners for those busy nights.",
    },
  ];

  return (
    <section className="section collectionSection">
      <div className="sectionTitle">
        <h2>AI-Generated Collections for Every Plan</h2>
        <button>View all collections ›</button>
      </div>

      <div className="collectionGrid">
        {collectionCards.map((collection) => (
          <button className="collectionTile" key={collection.title}>
            <div className="collectionTileHeader">
              <strong>{collection.title}</strong>
            </div>
            <small>{collection.text}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

function getRandomRecipes(sourceRecipes, maxCount = 12) {
  return [...sourceRecipes]
    .sort(() => Math.random() - 0.5)
    .slice(0, maxCount);
}

function RecipeRolodex({ openRecipeCard }) {
  const [selectedCategory, setSelectedCategory] = useState("MASTER_RANDOM");
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  const rolodexRecipes = useMemo(() => {
    const selectedCategoryObject = categories.find(
      (category) => category.name === selectedCategory || category.id === selectedCategory
    );

    const filteredRecipes =
      selectedCategory === "MASTER_RANDOM"
        ? recipes
        : recipes.filter((recipe) => (
            recipe.category === selectedCategory ||
            recipe.categoryCode === selectedCategoryObject?.id ||
            recipe.id?.startsWith(`${selectedCategoryObject?.id}-`)
          ));

    return getRandomRecipes(filteredRecipes, 12);
  }, [selectedCategory]);

  const activeRecipe = rolodexRecipes[activeIndex] || rolodexRecipes[0];
  const imageCandidates = activeRecipe ? previewCardImageCandidates(activeRecipe) : [];
  const imagePath = imageCandidates[imageIndex];

  useEffect(() => {
    setActiveIndex(0);
    setImageIndex(0);
  }, [selectedCategory]);

  useEffect(() => {
    setImageIndex(0);
  }, [activeRecipe?.id]);

  useEffect(() => {
    if (!rolodexRecipes.length) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % rolodexRecipes.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [rolodexRecipes.length]);

  function goToOffset(offset) {
    if (!rolodexRecipes.length) return;

    setActiveIndex((current) =>
      (current + offset + rolodexRecipes.length) % rolodexRecipes.length
    );
  }

  if (!activeRecipe) {
    return (
      <aside className="homeRolodex" aria-label="Recipe card rolodex">
        <div className="homeRolodexHeader">
          <div>
            <span>Recipe Card Rolodex</span>
            <strong>No cards found</strong>
          </div>

          <select
            className="homeRolodexSelect"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            aria-label="Choose recipe card category"
          >
            <option value="MASTER_RANDOM">Random Variety</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="homeRolodexMissing">
          <strong>No recipe cards found for this category.</strong>
          <span>Try another category.</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="homeRolodex" aria-label="Recipe card rolodex">
      <div className="homeRolodexHeader">
        <div>
          <span>Recipe Card Rolodex</span>
          <strong>{activeRecipe.title}</strong>
        </div>

        <div className="homeRolodexControls">
          <select
            className="homeRolodexSelect"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            aria-label="Choose recipe card category"
          >
            <option value="MASTER_RANDOM">Random Variety</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <small>
            {activeIndex + 1} of {rolodexRecipes.length}
          </small>
        </div>
      </div>

      <div className="homeRolodexStage">
        <img
          className="homeRolodexHolderArt"
          src={`${import.meta.env.BASE_URL}images/ui/hero-rolodex-.png`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />

        <button
          className="homeRolodexNav"
          onClick={() => goToOffset(-1)}
          aria-label="Previous recipe card"
        >
          ‹
        </button>

        <button
          className="homeRolodexCard"
          onClick={() => openRecipeCard(activeRecipe.id, rolodexRecipes)}
          aria-label={`Open ${activeRecipe.title} recipe card`}
        >
          {imagePath ? (
            <img
              src={`${import.meta.env.BASE_URL}${imagePath}`}
              alt={`${activeRecipe.id} ${activeRecipe.title} recipe card`}
              loading="lazy"
              decoding="async"
              onError={() => setImageIndex((current) => current + 1)}
            />
          ) : (
            <div className="homeRolodexMissing">
              <strong>Recipe card image not found.</strong>
              <span>Expected: images/recipes/{activeRecipe.id}.png</span>
            </div>
          )}
        </button>

        <button
          className="homeRolodexNav"
          onClick={() => goToOffset(1)}
          aria-label="Next recipe card"
        >
          ›
        </button>
      </div>

      <div className="homeRolodexDots" aria-hidden="true">
        {rolodexRecipes.map((recipe, index) => (
          <span key={recipe.id} className={index === activeIndex ? "active" : ""} />
        ))}
      </div>
    </aside>
  );
}

function Home({
  favorites,
  toggleFavorite,
  addToPlan,
  openRecipeCard,
  setActivePage,
  setFilter,
}) {
  const recentlyAdded = recipes.slice(0, 4);

  return (
    <>
      <Hero setActivePage={setActivePage} />
      <TransparencyLine />
      <CategoryGrid setFilter={setFilter} setActivePage={setActivePage} />

      <section className="section">
        <div className="sectionTitle">
          <h2>Recently Added</h2>
          <button onClick={() => setActivePage("Recipes")}>
            View all recipes ›
          </button>
        </div>

        <div className="recentlyAddedLayout">
          <div className="recipeRow recentlyAddedCards">
            {recentlyAdded.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                addToPlan={addToPlan}
                openRecipeCard={openRecipeCard}
                cardList={recentlyAdded}
                showPlannerButton={false}
                viewButtonText="View Recipe"
              />
            ))}
          </div>

          <RecipeRolodex openRecipeCard={openRecipeCard} />
        </div>
      </section>

      <FeatureStrip />
      <CollectionStrip />
    </>
  );
}

function RecipesPage({
  favorites,
  toggleFavorite,
  addToPlan,
  openRecipeCard,
  filter,
  setFilter,
}) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(filter || "");
  const [selectedCookingMethod, setSelectedCookingMethod] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("");
  const [selectedDietaryNeed, setSelectedDietaryNeed] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSelectedCategory(filter || "");
  }, [filter]);

  const filteredRecipes = useMemo(() => {
    let list = recipes.filter((recipe) => {
      const matchesQuery = `${recipe.id} ${recipe.title} ${recipe.category}`
        .toLowerCase()
        .includes(query.toLowerCase());

      const selectedCategoryObject = categories.find(
        (category) => category.name === selectedCategory || category.id === selectedCategory
      );
      const matchesCategory =
        !selectedCategory ||
        recipe.category === selectedCategory ||
        recipe.categoryCode === selectedCategoryObject?.id ||
        recipe.id?.startsWith(`${selectedCategoryObject?.id}-`);

      return matchesQuery && matchesCategory;
    });

    const sorted = [...list];
    switch (sortBy) {
      case 'az':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'time-low':
        sorted.sort((a, b) => Number(a.time || 0) - Number(b.time || 0));
        break;
      case 'time-high':
        sorted.sort((a, b) => Number(b.time || 0) - Number(a.time || 0));
        break;
      case 'servings-high':
        sorted.sort((a, b) => Number(b.servings || 0) - Number(a.servings || 0));
        break;
      case 'servings-low':
        sorted.sort((a, b) => Number(a.servings || 0) - Number(b.servings || 0));
        break;
      default:
        break;
    }

    return sorted;
  }, [query, selectedCategory, selectedCookingMethod, selectedMealType, selectedDietaryNeed, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [query, selectedCategory, selectedCookingMethod, selectedMealType, selectedDietaryNeed, sortBy]);

  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredRecipes.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * perPage;
  const visibleRecipes = filteredRecipes.slice(pageStart, pageStart + perPage);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function renderPageButtons() {
    if (totalPages <= 1) return null;

    const buttons = [];
    const visible = new Set([1, 2, 3, totalPages, safePage - 1, safePage, safePage + 1]);
    const pages = [...visible]
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);

    let prev = null;
    for (const p of pages) {
      if (prev && p - prev > 1) {
        buttons.push(
          <span key={`ellipsis-${prev}-${p}`} className="browsePaginationEllipsis">
            …
          </span>
        );
      }
      buttons.push(
        <button
          key={p}
          className={p === safePage ? 'active' : ''}
          onClick={() => setPage(p)}
          aria-label={`Page ${p}`}
        >
          {p}
        </button>
      );
      prev = p;
    }

    return buttons;
  }

  return (
    <main className="pageShell browseRecipesPage">
      <div className="browseHeaderRow">
        <div className="browseIntro">
          <h1>Browse Recipes</h1>
          <p>Explore AI-generated recipes and meal ideas.</p>
        </div>

        <div className="browseSearchWrap">
          <span className="browseSearchIcon">⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes..."
            aria-label="Search recipes"
          />
        </div>
      </div>

      <div className="browseControlsRow">
        <div className="browseFilters">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setFilter(e.target.value);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          <select value={selectedCookingMethod} onChange={(e) => setSelectedCookingMethod(e.target.value)}>
            <option value="">All Cooking Methods</option>
            <option value="quick">Quick & Easy</option>
            <option value="baked">Baked</option>
            <option value="skillet">Skillet</option>
            <option value="slowcooker">Slow Cooker</option>
          </select>

          <select value={selectedMealType} onChange={(e) => setSelectedMealType(e.target.value)}>
            <option value="">All Meal Types</option>
            <option value="dinner">Dinner</option>
            <option value="lunch">Lunch</option>
            <option value="sidedish">Side Dish</option>
            <option value="dessert">Dessert</option>
          </select>

          <select value={selectedDietaryNeed} onChange={(e) => setSelectedDietaryNeed(e.target.value)}>
            <option value="">All Dietary Needs</option>
            <option value="glutenfree">Gluten Free</option>
            <option value="lowcarb">Low Carb</option>
            <option value="lighter">Lighter Options</option>
          </select>
        </div>

        <div className="browseSortWrap">
          <label htmlFor="browse-sort">Sort By:</label>
          <select id="browse-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="az">A–Z</option>
            <option value="time-low">Time: Low to High</option>
            <option value="time-high">Time: High to Low</option>
            <option value="servings-low">Servings: Low to High</option>
            <option value="servings-high">Servings: High to Low</option>
          </select>
        </div>
      </div>

      <div className="browseResultsRow">
        <strong>{filteredRecipes.length} recipes found</strong>
        {totalPages > 1 && (
          <div className="browsePagination">
            <button
              className="browsePaginationArrow"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
            >
              ‹
            </button>
            {renderPageButtons()}
            <button
              className="browsePaginationArrow"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="recipeGrid browseRecipeGrid">
        {visibleRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            addToPlan={addToPlan}
            openRecipeCard={openRecipeCard}
            cardList={filteredRecipes}
            displayMode="card"
          />
        ))}
      </div>
    </main>
  );
}

function PlannerPage({ plan, setPlan, servings, setServings, favorites, toggleFavorite, openRecipeCard, setActivePage }) {
  const normalizedPlan = useMemo(() => normalizeTwoWeekPlan(plan), [plan]);
  const [selectedSlot, setSelectedSlot] = useState("week1-Mon");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPlannerRecipes = useMemo(() => {
    if (selectedCategory === "All") return recipes;

    const selectedCategoryObject = categories.find(
      (category) => category.name === selectedCategory || category.id === selectedCategory
    );

    return recipes.filter((recipe) => {
      return (
        recipe.category === selectedCategory ||
        recipe.categoryCode === selectedCategoryObject?.id ||
        recipe.id?.startsWith(`${selectedCategoryObject?.id}-`)
      );
    });
  }, [selectedCategory]);

  const totalMeals = plannedMealCount(normalizedPlan);

  function addRecipe(recipeId, slotKey = selectedSlot) {
    if (!recipeId || !slotKey) return;

    setPlan((current) => {
      const next = normalizeTwoWeekPlan(current);
      next[slotKey] = [...(next[slotKey] || []), recipeId];
      return next;
    });
  }

  function removeRecipe(slotKey, index) {
    setPlan((current) => {
      const next = normalizeTwoWeekPlan(current);
      next[slotKey] = (next[slotKey] || []).filter((_, i) => i !== index);
      return next;
    });
  }

  function clearPlan() {
    setPlan(emptyTwoWeekPlan());
  }

  function clearWeek(weekId) {
    setPlan((current) => {
      const next = normalizeTwoWeekPlan(current);
      WEEK_DAYS.forEach((day) => {
        next[`${weekId}-${day}`] = [];
      });
      return next;
    });
  }

  function copyWeekOneToWeekTwo() {
    setPlan((current) => {
      const next = normalizeTwoWeekPlan(current);
      WEEK_DAYS.forEach((day) => {
        next[`week2-${day}`] = [...(next[`week1-${day}`] || [])];
      });
      return next;
    });
  }

  function firstEmptySlotForWeek(weekId) {
    return (
      WEEK_DAYS.map((day) => `${weekId}-${day}`).find(
        (slotKey) => (normalizedPlan[slotKey] || []).length === 0
      ) || `${weekId}-Mon`
    );
  }

  return (
    <main className="pageShell plannerDashboard">
      <div className="plannerHeroHeader">
        <div>
          <div className="aiBadge">TWO-WEEK DINNER PLANNER</div>
          <h1>Weekly dinner planner</h1>
          <p>
            Plan dinners for two weeks, build one combined shopping list, and save extra portions for future freezer meals.
          </p>
        </div>

        <div className="plannerTopActions">
          <button className="secondary" onClick={clearPlan}>Clear Planner</button>
          <ServingSelector servings={servings} setServings={setServings} />
        </div>
      </div>

      <div className="plannerAddPanel">
        <select
          value={selectedSlot}
          onChange={(event) => setSelectedSlot(event.target.value)}
          aria-label="Choose planner day"
        >
          {PLANNER_WEEKS.map((week) => (
            <optgroup key={week.id} label={week.title}>
              {WEEK_DAYS.map((day) => (
                <option key={`${week.id}-${day}`} value={`${week.id}-${day}`}>
                  {week.title} — {day}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          aria-label="Filter recipes by category"
        >
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <select onChange={(event) => addRecipe(event.target.value)} value="">
          <option value="">
            Add {selectedCategory === "All" ? "recipe" : selectedCategory} to {plannerSlotLabel(selectedSlot)}
          </option>
          {filteredPlannerRecipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.id} — {recipe.title}
            </option>
          ))}
        </select>
      </div>

      <div className="twoWeekPlannerLayout">
        <div className="plannerWeeksGrid">
          {PLANNER_WEEKS.map((week) => (
            <section className="plannerWeekPanel" key={week.id}>
              <div className="plannerWeekHeader">
                <div>
                  <h2>{week.title}</h2>
                  <span>{week.subtitle}</span>
                </div>
                <button
                  className="weekAddButton"
                  onClick={() => setSelectedSlot(firstEmptySlotForWeek(week.id))}
                >
                  + Add Recipe
                </button>
              </div>

              <div className="plannerDayStack">
                {WEEK_DAYS.map((day) => {
                  const slotKey = `${week.id}-${day}`;
                  const mealIds = normalizedPlan[slotKey] || [];

                  return (
                    <section className="plannerDayRow" key={slotKey}>
                      <div className="plannerDayLabel">
                        <strong>{day}</strong>
                      </div>

                      <div className="plannerMealArea">
                        {mealIds.length === 0 ? (
                          <button
                            className="plannerEmptyMeal"
                            onClick={() => setSelectedSlot(slotKey)}
                          >
                            + Add dinner
                          </button>
                        ) : (
                          mealIds.map((recipeId, index) => {
                            const recipe = recipes.find((item) => item.id === recipeId);
                            if (!recipe) return null;
                            const isSaved = favorites.includes(recipe.id);

                            return (
                              <article className="plannerMealRow" key={`${slotKey}-${recipeId}-${index}`}>
                                <div className="plannerMealThumb">
                                  <RecipeImage recipe={recipe} />
                                </div>

                                <div className="plannerMealInfo">
                                  <strong>{recipe.title}</strong>
                                  <small>
                                    {recipe.id} · {recipe.category} · {recipe.time} min · {servings} servings
                                  </small>
                                </div>

                                <div className="plannerMealActions">
                                  <button
                                    className={isSaved ? "plannerHeart saved" : "plannerHeart"}
                                    onClick={() => toggleFavorite(recipe.id)}
                                    aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
                                  >
                                    ♥
                                  </button>
                                  <button
                                    className="plannerMiniButton"
                                    onClick={() => openRecipeCard(recipe.id, recipes)}
                                  >
                                    View
                                  </button>
                                  <button
                                    className="plannerRemoveButton"
                                    onClick={() => removeRecipe(slotKey, index)}
                                    aria-label="Remove recipe"
                                  >
                                    ×
                                  </button>
                                </div>
                              </article>
                            );
                          })
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <aside className="plannerSidePanel">
          <section className="plannerSideCard">
            <h2>Quick Actions</h2>
            <button onClick={copyWeekOneToWeekTwo}>Copy Week 1 to Week 2</button>
            <button onClick={() => clearWeek("week1")}>Clear Week 1</button>
            <button onClick={() => clearWeek("week2")}>Clear Week 2</button>
          </section>

          <section className="plannerSideCard plannerStatCard">
            <h2>Shopping List</h2>
            <small>Combined for both weeks</small>
            <strong>{totalMeals}</strong>
            <span>planned meals</span>
          </section>

          <section className="plannerSideCard">
            <h2>Planning Tip</h2>
            <p className="plannerSideNote">
              Use your two-week plan to cook once, eat once, and freeze one meal
              for a future week.
            </p>
            <button onClick={() => setActivePage("Freezer Tips")}>Review Freezer Tips</button>
            <button onClick={() => setActivePage("Grocery Picks")}>Review Smart Grocery Picks</button>
          </section>
        </aside>
      </div>
    </main>
  );
}

function ServingSelector({ servings, setServings }) {
  return (
    <div className="servingSelector">
      <span>Servings:</span>
      {[2, 4, 6].map((n) => (
        <button
          key={n}
          className={servings === n ? "selected" : ""}
          onClick={() => setServings(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function PantryStaplesPage({ pantry, setPantry }) {
  const [selectedPantryLevel, setSelectedPantryLevel] = useState(1);
  const selectedLevelInfo =
    PANTRY_LEVELS.find((level) => level.id === selectedPantryLevel) ||
    PANTRY_LEVELS[0];

  const visiblePantryGroups = PANTRY_STAPLES.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.level <= selectedPantryLevel),
  })).filter((group) => group.items.length > 0);

  const totalStaples = visiblePantryGroups.reduce(
    (sum, group) => sum + group.items.length,
    0
  );

  const checkedCount = visiblePantryGroups.reduce(
    (sum, group) =>
      sum + group.items.filter((item) => pantry[item.name]).length,
    0
  );

  function togglePantryItem(item) {
    setPantry((current) => ({
      ...current,
      [item.name]: !current[item.name],
    }));
  }

  function clearPantry() {
    setPantry({});
  }

  function checkLevelStaples(level = selectedPantryLevel) {
    const levelItems = PANTRY_STAPLES.flatMap((group) =>
      group.items.filter((item) => item.level <= level).map((item) => item.name)
    );

    setPantry((current) => {
      const next = { ...current };
      levelItems.forEach((item) => {
        next[item] = true;
      });
      return next;
    });
  }

  return (
    <main className="pageShell pantryPage">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">SHELF-STABLE PANTRY SETUP</div>
          <h1>PANTRY STAPLES</h1>
          <p>
            Choose a pantry level and check off shelf-stable products you already
            keep on hand. Each level builds on the one before it.
          </p>
        </div>

        <div className="totalBox">
          <small>{selectedLevelInfo.shortLabel} Stocked</small>
          <strong>
            {checkedCount}/{totalStaples}
          </strong>
        </div>
      </div>

      <div className="pantryLevelTabs" role="tablist" aria-label="Pantry staple level">
        {PANTRY_LEVELS.map((level) => (
          <button
            key={level.id}
            type="button"
            className={selectedPantryLevel === level.id ? "active" : ""}
            onClick={() => setSelectedPantryLevel(level.id)}
          >
            <span>Level {level.id}</span>
            <strong>{level.shortLabel}</strong>
          </button>
        ))}
      </div>

      <div className="pantryLevelSummary">
        <div>
          <h2>{selectedLevelInfo.label}</h2>
          <p>{selectedLevelInfo.description}</p>
        </div>
        <span>All items shown are shelf-stable.</span>
      </div>

      <div className="pantryActions">
        <button className="primary" onClick={() => checkLevelStaples(selectedPantryLevel)}>
          Check Level {selectedPantryLevel}
        </button>
        <button className="secondary" onClick={() => checkLevelStaples(1)}>
          Check Minimum
        </button>
        <button className="secondary" onClick={clearPantry}>
          Clear pantry checks
        </button>
      </div>

      <div className="pantryGrid">
        {visiblePantryGroups.map((group) => (
          <section className="pantryGroup" key={group.group}>
            <h2>{group.group}</h2>

            {group.items.map((item) => (
              <label
                key={item.name}
                className={pantry[item.name] ? "pantryItem checked" : "pantryItem"}
              >
                <input
                  type="checkbox"
                  checked={!!pantry[item.name]}
                  onChange={() => togglePantryItem(item)}
                />
                <span>{item.name}</span>
                <em>Level {item.level}</em>
              </label>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}


function ShoppingListPage({ plan, checked, setChecked, servings, pantry, setActivePage }) {
  const list = useMemo(
    () => buildShoppingList(plan, recipes, servings),
    [plan, servings]
  );

  const { needed, pantry: pantryItems } = useMemo(
    () => splitShoppingListByPantry(list, pantry),
    [list, pantry]
  );

  const groupedNeeded = needed.reduce((acc, item) => {
    return {
      ...acc,
      [item.aisle]: [...(acc[item.aisle] || []), item],
    };
  }, {});

  const groupedPantry = pantryItems.reduce((acc, item) => {
    return {
      ...acc,
      [item.aisle]: [...(acc[item.aisle] || []), item],
    };
  }, {});

  function toggleItem(key) {
    setChecked((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function printShoppingList() {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    const neededGroups = Object.entries(groupedNeeded);
    const pantryGroups = Object.entries(groupedPantry);

    const neededHtml = neededGroups.length
      ? neededGroups.map(([aisle, items]) => `
          <section>
            <h2>${aisle}</h2>
            ${items.map((item) => `
              <div class="item">
                <span class="box"></span>
                <strong>${item.name}</strong>
                <em>${formatQty(item.qty)} ${item.unit}</em>
              </div>
            `).join("")}
          </section>
        `).join("")
      : `<p>No needed items.</p>`;

    const pantryHtml = pantryGroups.length
      ? pantryGroups.map(([aisle, items]) => `
          <section>
            <h2>${aisle}</h2>
            ${items.map((item) => `
              <div class="item pantry">
                <span class="box filled"></span>
                <strong>${item.name}</strong>
                <em>${formatQty(item.qty)} ${item.unit}</em>
              </div>
            `).join("")}
          </section>
        `).join("")
      : "";

    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Shopping List</title>
          <style>
            @page { size: portrait; margin: 0.35in; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              color: #111;
              font-family: Arial, Helvetica, sans-serif;
              font-size: 10px;
              line-height: 1.15;
            }
            header {
              display: flex;
              justify-content: space-between;
              align-items: end;
              border-bottom: 2px solid #111;
              padding-bottom: 6px;
              margin-bottom: 8px;
            }
            h1 {
              margin: 0;
              font-size: 18px;
              letter-spacing: .04em;
              text-transform: uppercase;
            }
            .date { font-size: 10px; color: #333; }
            .grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              column-gap: 18px;
              row-gap: 8px;
              align-items: start;
            }
            section {
              break-inside: avoid;
              page-break-inside: avoid;
              border: 1px solid #999;
              border-radius: 6px;
              overflow: hidden;
            }
            h2 {
              margin: 0;
              padding: 4px 6px;
              background: #f0f0f0;
              border-bottom: 1px solid #999;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: .04em;
            }
            .item {
              display: grid;
              grid-template-columns: 14px minmax(0, 1fr) auto;
              gap: 5px;
              align-items: center;
              min-height: 20px;
              padding: 3px 6px;
              border-bottom: 1px solid #ddd;
            }
            .item:last-child { border-bottom: 0; }
            .box {
              width: 10px;
              height: 10px;
              border: 1px solid #111;
              display: inline-block;
            }
            .filled { background: #111; }
            strong {
              font-weight: 600;
              min-width: 0;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            em {
              font-style: normal;
              color: #333;
              white-space: nowrap;
            }
            .pantryTitle {
              font-size: 13px;
              margin: 12px 0 6px;
              padding-top: 6px;
              border-top: 1px solid #111;
            }
          </style>
        </head>
        <body>
          <header>
            <h1>Shopping List</h1>
            <div class="date">${new Date().toLocaleDateString()}</div>
          </header>

          <div class="grid">
            ${neededHtml}
          </div>

          ${pantryHtml ? `<h1 class="pantryTitle">Already in Pantry</h1><div class="grid">${pantryHtml}</div>` : ""}

          <script>
            window.onload = () => {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  function renderGroceryReference(item) {
    const reference = findGroceryReference(item.name);
    if (!reference) return null;

    return (
      <div className="shoppingSuggestionNote">
        <strong>Suggested picks: {reference.name}</strong>
        <small>{reference.examples.slice(0, 3).join(" · ")}</small>
        <button type="button" onClick={() => setActivePage("Grocery Picks")}>
          Review
        </button>
      </div>
    );
  }

  function renderNeededItem(item) {
    const key = `${item.name}-${item.unit}-${item.aisle}`;

    return (
      <div key={key} className="shoppingItemWrap">
        <label
          className={checked[key] ? "checked shoppingItem" : "shoppingItem"}
        >
          <input
            type="checkbox"
            checked={!!checked[key]}
            onChange={() => toggleItem(key)}
          />

          <span>{item.name}</span>
          <small>
            {formatQty(item.qty)} {item.unit}
          </small>
        </label>

        {renderGroceryReference(item)}
      </div>
    );
  }

  function renderPantryItem(item) {
    const key = `${item.name}-${item.unit}-${item.aisle}-pantry`;

    return (
      <div key={key} className="shoppingItemWrap">
        <div className="shoppingItem pantryShoppingItem">
          <span className="pantryFilledBox" aria-hidden="true" />
          <span>{item.name}</span>
          <small>
            {formatQty(item.qty)} {item.unit}
          </small>
        </div>

        {renderGroceryReference(item)}
      </div>
    );
  }

  return (
    <main className="pageShell">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">SMART SHOPPING LIST</div>
          <h1>Shopping list</h1>
          <p>
            Needed items stay open for shopping. Pantry staples you already have
            are shown separately.
          </p>
        </div>

        <div className="pageHeaderActions">
          <button className="primary" onClick={printShoppingList}>
            Print List
          </button>
          <button
            className="secondary"
            onClick={() => setActivePage("Grocery Picks")}
          >
            Grocery Picks
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Your shopping list is empty"
          text="Add recipes to your weekly planner to generate a grocery list."
        />
      ) : (
        <div className="shoppingListSections">
          <section className="shoppingListSection">
            <div className="shoppingListSectionHeader">
              <div>
                <h2>NEEDED ITEMS</h2>
                <p>Open boxes are items to buy.</p>
              </div>
              <strong>{needed.length} items</strong>
            </div>

            {needed.length === 0 ? (
              <div className="emptyState compactEmpty">
                <h2>No needed items</h2>
                <p>Everything on this list is currently marked as in your pantry.</p>
              </div>
            ) : (
              <div className="shoppingGrid">
                {Object.entries(groupedNeeded).map(([aisle, items]) => (
                  <section className="shoppingGroup" key={aisle}>
                    <h2>{aisle}</h2>
                    {items.map(renderNeededItem)}
                  </section>
                ))}
              </div>
            )}
          </section>

          <section className="shoppingListSection pantryListSection">
            <div className="shoppingListSectionHeader">
              <div>
                <h2>ALREADY IN PANTRY</h2>
                <p>Filled black boxes are already in your pantry.</p>
              </div>
              <div className="pantryHeaderActions">
                <strong>{pantryItems.length} items</strong>
                <button className="secondary smallSecondary" onClick={() => setActivePage("Pantry Staples")}>
                  Edit Pantry Staples
                </button>
              </div>
            </div>

            {pantryItems.length === 0 ? (
              <div className="emptyState compactEmpty">
                <h2>No pantry matches yet</h2>
                <p>
                  Check items on the Pantry Staples page to move matching shopping
                  list items here.
                </p>
              </div>
            ) : (
              <div className="shoppingGrid">
                {Object.entries(groupedPantry).map(([aisle, items]) => (
                  <section className="shoppingGroup" key={aisle}>
                    <h2>{aisle}</h2>
                    {items.map(renderPantryItem)}
                  </section>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function FavoritesPage({
  favorites,
  toggleFavorite,
  addToPlan,
  openRecipeCard,
}) {
  const saved = recipes.filter((r) => favorites.includes(r.id));

  return (
    <main className="pageShell">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">SAVED IN THIS BROWSER</div>
          <h1>Favorites</h1>
          <p>Recipes you saved on this device. No login or sync required.</p>
        </div>
      </div>

      {saved.length === 0 ? (
        <EmptyState
          title="No favorites yet"
          text="Tap the heart on any recipe card to save it here."
        />
      ) : (
        <div className="recipeGrid">
          {saved.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              addToPlan={addToPlan}
              openRecipeCard={openRecipeCard}
              cardList={saved}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function CollectionsPage() {
  return (
    <main className="pageShell">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">CURATED BY AI</div>
          <h1>Collections</h1>
          <p>
            AI-generated collections designed for real-life planning, shopping,
            and cost estimating.
          </p>
        </div>
      </div>

      <CollectionStrip />
      <FeatureStrip />
    </main>
  );
}

function RecommendationsPage({ setActivePage }) {
  const recommendationCards = [
    {
      title: "Kitchen Tools & Products",
      text: "Helpful kitchen gadgets, small appliances, and practical tools for easier everyday cooking.",
      icon: "▣",
      note: "Future home for affiliate-friendly product recommendations.",
    },
    {
      title: "Helpful Videos & Channels",
      text: "Cooking, freezer meal, meal-prep, and kitchen how-to videos worth saving.",
      icon: "▶",
      note: "Great for visual learners and step-by-step cooking help.",
    },
    {
      title: "Storage & Organization",
      text: "Food storage, pantry setup, freezer containers, labels, and kitchen organizers.",
      icon: "□",
      note: "Supports leftovers, freezer meals, and small-household planning.",
    },
    {
      title: "Freezer Meals & Storage",
      text: "Tips, supplies, labels, and containers for saving a second prepared meal for later.",
      icon: "❄",
      note: "Cook once, eat once, freeze once.",
      page: "Freezer Tips",
    },
    {
      title: "Social Pages I Follow",
      text: "YouTube, Instagram, Facebook, and TikTok pages that share helpful food and kitchen ideas.",
      icon: "◎",
      note: "A curated place for outside resources and inspiration.",
    },
  ];

  return (
    <main className="pageShell recommendationsPage">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">HELPFUL RESOURCES</div>
          <h1>Recommendations</h1>
          <p>
            A curated resource hub for kitchen tools, storage ideas, helpful
            videos, and social pages that support simple cooking for seniors,
            couples, and small households.
          </p>
        </div>
      </div>

      <div className="recommendationsGrid">
        {recommendationCards.map((card) => (
          <article className="recommendationTile" key={card.title}>
            <div className="recommendationIcon">{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
            <small>{card.note}</small>
            <button type="button" onClick={() => card.page ? setActivePage(card.page) : undefined}>{card.page ? "Review tips" : "Coming soon"}</button>
          </article>
        ))}
      </div>

    </main>
  );
}



function GroceryPicksPage({ setActivePage }) {
  return (
    <main className="pageShell groceryPicksPage">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">SMART GROCERY REFERENCE</div>
          <h1>Smart Grocery Picks</h1>
          <p>
            A reference list for lighter, lower-carb, freezer-friendly, and
            small-household grocery choices. Use it before shopping, or when a
            shopping-list item shows a suggested swap.
          </p>
        </div>

        <div className="pageHeaderActions">
          <button className="secondary" onClick={() => setActivePage("Shopping Lists")}>
            Back to Shopping List
          </button>
        </div>
      </div>

      <section className="groceryPicksIntro">
        <h2>How to use this list</h2>
        <p>
          These are not price estimates. They are product types and examples to
          review so the user can choose items that better fit a lower-calorie,
          lower-carb, or easier meal-prep lifestyle.
        </p>
      </section>

      <div className="groceryReferenceGrid">
        {GROCERY_REFERENCE_GROUPS.map((group) => (
          <section className="groceryReferenceGroup" key={group.group}>
            <div className="groceryReferenceGroupHeader">
              <h2>{group.group}</h2>
              <p>{group.intro}</p>
            </div>

            <div className="groceryReferenceItems">
              {group.items.map((item) => (
                <article className="groceryReferenceItem" key={item.name}>
                  <h3>{item.name}</h3>
                  <span>{item.useFor}</span>
                  <p>{item.note}</p>
                  <div>
                    {item.examples.map((example) => (
                      <small key={example}>{example}</small>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}


function FreezerTipsPage({ setActivePage }) {
  const tipCards = [
    {
      title: "Cool before freezing",
      text: "Let hot foods cool before sealing. This helps prevent steam, ice crystals, and soggy reheats.",
    },
    {
      title: "Portion for two",
      text: "Pack the extra meal as a two-serving portion so it is ready for another weeknight dinner.",
    },
    {
      title: "Freeze flat when possible",
      text: "Soups, sauces, shredded meats, and rice bowls stack better when frozen flat in freezer bags.",
    },
    {
      title: "Label every package",
      text: "Write the recipe name, date, serving count, and simple reheating note before freezing.",
    },
  ];

  const supplyCards = [
    "Freezer bags",
    "Vacuum seal bags",
    "Meal-prep containers",
    "Foil pans with lids",
    "Freezer-safe labels",
    "Painter’s tape & marker",
    "Silicone trays for sauces",
    "Freezer bins for rotation",
  ];

  return (
    <main className="pageShell freezerPage">
      <div className="pageHeader freezerHeader">
        <div>
          <div className="aiBadge">COOK ONCE · EAT ONCE · FREEZE ONCE</div>
          <h1>Freezer Meals & Storage</h1>
          <p>
            Many Robert’s Recipe Box meals are intentionally planned for small
            households with enough food for dinner now and a second prepared
            meal to freeze for later.
          </p>
        </div>

        <div className="freezerHeaderActions">
          <button className="primary" onClick={() => setActivePage("Meal Planner")}>
            Start Meal Planning
          </button>
          <button className="secondary" onClick={() => setActivePage("Shopping Lists")}>
            View Shopping List
          </button>
        </div>
      </div>

      <section className="freezerIntroCard">
        <h2>The freezer-meal method</h2>
        <ol>
          <li>Cook the recipe and enjoy tonight’s meal.</li>
          <li>Cool the extra portion safely.</li>
          <li>Pack it as a two-serving freezer meal.</li>
          <li>Label it with name, date, and reheating notes.</li>
          <li>Add it to a future meal plan when you need an easy dinner.</li>
        </ol>
      </section>

      <section className="freezerSectionGrid">
        <div className="freezerPanel">
          <h2>Freezing Tips & Tricks</h2>
          <div className="freezerTipGrid">
            {tipCards.map((tip) => (
              <article className="freezerTipCard" key={tip.title}>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="freezerPanel">
          <h2>Best Foods to Freeze</h2>
          <ul className="freezerList">
            <li>Casseroles and bakes</li>
            <li>Soups, chili, and stews</li>
            <li>Meatballs and cooked shredded meats</li>
            <li>Pasta sauces and Italian meals</li>
            <li>Rice bowls without fresh toppings</li>
            <li>Cooked breads, rolls, and kolaches</li>
          </ul>
        </div>

        <div className="freezerPanel cautionPanel">
          <h2>Foods to Freeze Carefully</h2>
          <ul className="freezerList">
            <li>Lettuce salads and fresh toppings</li>
            <li>Mayonnaise-based salads</li>
            <li>Fried foods that may soften</li>
            <li>Cream sauces that need gentle reheating</li>
            <li>Raw tomatoes or watery vegetables</li>
          </ul>
        </div>
      </section>

      <section className="freezerSuppliesPanel">
        <div className="sectionTitle freezerSuppliesTitle">
          <h2>Freezer Supplies to Review</h2>
          <button onClick={() => setActivePage("Recommendations")}>Back to Recommendations ›</button>
        </div>
        <div className="freezerSupplyGrid">
          {supplyCards.map((supply) => (
            <div className="freezerSupplyCard" key={supply}>{supply}</div>
          ))}
        </div>
      </section>
    </main>
  );
}


function HowToUsePage({ setActivePage }) {
  return (
    <main className="pageShell aboutRecipesPage howToUsePage">
      <section className="aboutRecipesHero">
        <div>
          <div className="aiBadge">HOW TO USE THE SITE</div>
          <h1>How to Use Robert’s Recipe Box</h1>
          <p>
            Robert’s Recipe Box is a free recipe-planning website created for
            seniors, couples, empty nesters, and smaller households who want
            practical meals without expensive meal-delivery subscriptions,
            oversized recipes, or hours of daily cooking.
          </p>
        </div>
      </section>

      <div className="aboutRecipesGrid howToUseGrid">
        <article className="aboutRecipesCard aboutRecipesWideCard">
          <h2>What the site helps you do</h2>
          <p>The site is designed to help you:</p>
          <ul className="aboutCardList">
            <li>Find recipes that fit your tastes and schedule</li>
            <li>Prepare reasonable portions for one or two people</li>
            <li>Plan for useful leftovers</li>
            <li>Freeze extra servings for another day</li>
            <li>Build weekly meal plans</li>
            <li>Create organized grocery lists</li>
            <li>Estimate grocery costs</li>
            <li>Find practical ingredient substitutions</li>
            <li>Make recipes lower in calories, lower in carbohydrates, more budget-friendly, or easier to freeze</li>
          </ul>
          <p>
            The original recipe is always available. Optional suggestions allow
            you to adjust it to better fit your household, dietary goals, budget,
            or cooking routine.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>1. Browse by category</h2>
          <p>
            Start by selecting a recipe category from the home page. Categories
            include American, Asian, Casseroles, Cheesecakes, Cinnamon Rolls,
            Cobblers, Desserts, Donuts, Hamburgers, Italian, Jams & Jellies,
            Kolaches, Loafs & Rolls, Mexican, Protein Muffins, Quiche & Pies,
            Salads & Bowls, Sandwiches, Seafood, Side Dishes, and Smoked or
            Grilled Foods.
          </p>
          <p>
            Selecting a category opens the recipes available in that collection.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>2. Flip through recipe cards</h2>
          <p>
            Use the recipe-card viewer to move forward or backward through the
            collection. Each recipe card is designed to provide the most
            important information in one easy-to-read place.
          </p>
          <ul className="aboutCardList">
            <li>Recipe name</li>
            <li>Ingredients</li>
            <li>Directions</li>
            <li>Number of servings</li>
            <li>Estimated nutrition information</li>
            <li>Helpful preparation or serving notes</li>
          </ul>
        </article>

        <article className="aboutRecipesCard">
          <h2>3. Open the full recipe</h2>
          <p>
            Select a recipe card to view the full recipe page. The full page may
            include detailed preparation instructions, substitutions,
            lower-calorie options, lower-carbohydrate options, budget-friendly
            alternatives, side-dish suggestions, freezer guidance, and product
            recommendations.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>4. Adjust for your household</h2>
          <p>
            Many recipes can be prepared as written, divided into smaller
            portions, or doubled for planned leftovers. For a two-person
            household, a four-serving recipe can often provide dinner for two
            tonight and a second meal for later in the week.
          </p>
          <p>
            You may also freeze the extra two servings for a future meal.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>5. Use optional recipe picks</h2>
          <p>Throughout the site, you may see helpful recommendations such as:</p>
          <ul className="aboutCardList">
            <li><strong>Robert’s Lower-Carb Pick:</strong> a practical ingredient replacement that reduces carbohydrates.</li>
            <li><strong>Robert’s Lower-Calorie Pick:</strong> a lighter ingredient or preparation method.</li>
            <li><strong>Best for Two-Person Meals:</strong> a recipe or product that divides easily into smaller portions.</li>
            <li><strong>Best Freezer-Friendly Product:</strong> an ingredient or storage option for meals prepared in advance.</li>
            <li><strong>Best Budget Substitution:</strong> a lower-cost alternative.</li>
            <li><strong>Use Half-and-Half Swap:</strong> half original ingredient and half lighter alternative.</li>
          </ul>
          <p>These are optional suggestions. Choose the version that works best for you.</p>
        </article>

        <article className="aboutRecipesCard">
          <h2>6. Build a weekly meal plan</h2>
          <p>A practical weekly plan might include:</p>
          <ul className="aboutCardList">
            <li>Two freshly prepared meals</li>
            <li>Two planned-leftover meals</li>
            <li>One freezer meal</li>
            <li>One simple sandwich, salad, or soup night</li>
            <li>One flexible night for dining out or using remaining ingredients</li>
          </ul>
          <p>
            Planning meals before shopping can help reduce duplicate purchases
            and unused food.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>7. Create a grocery list</h2>
          <p>
            After selecting your meals, combine the required ingredients into one
            shopping list. Before shopping, check what you already have, remove
            duplicate items, combine repeated ingredients, note quantities, and
            separate the list by grocery-store section.
          </p>
          <p>
            Common sections include produce, meat and seafood, dairy, frozen
            foods, canned goods, pantry items, bakery, and household supplies.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>8. Compare costs and substitute</h2>
          <p>
            Use estimated prices as a planning guide, but compare them with your
            local grocery store. You can often reduce the weekly grocery bill by
            buying store brands, choosing frozen vegetables, dividing family-size
            meat packages, using planned leftovers, substituting pantry items,
            choosing recipes with shared ingredients, and freezing food before it
            spoils.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>9. Save or print recipes</h2>
          <p>
            Recipes may be saved, printed, or added to your personal recipe
            collection depending on available site features. Printed cards are
            useful for cooking without keeping a phone or tablet near the stove.
          </p>
          <p>
            When printing, review the printer preview and select the recommended
            card size or page layout.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>10. Use freezer and storage instructions</h2>
          <p>
            Allow cooked food to cool before placing it in the refrigerator or
            freezer. Label stored meals with the recipe name, date prepared,
            number of servings, and reheating instructions.
          </p>
          <p>
            Freeze individual or two-person portions whenever possible. Smaller
            packages thaw faster and reduce waste.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>A simple way to get started</h2>
          <ol className="aboutNumberedList">
            <li>Choose three main dishes.</li>
            <li>Select two or three side dishes.</li>
            <li>Plan which meals will provide leftovers.</li>
            <li>Choose one meal to freeze.</li>
            <li>Create one combined shopping list.</li>
            <li>Check your pantry before shopping.</li>
            <li>Prepare ingredients in advance when practical.</li>
          </ol>
          <p>
            Begin with a few recipes and add meal planning, grocery lists,
            substitutions, and freezer meals as you become familiar with the site.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>Important information</h2>
          <p>
            Nutrition values, grocery prices, serving sizes, and cooking times
            are estimates and may vary depending on ingredients, brands,
            equipment, and portion sizes.
          </p>
          <p>
            Recipe suggestions are provided for general informational purposes.
            Anyone with food allergies, dietary restrictions, swallowing
            concerns, kidney disease, diabetes, heart conditions, or other
            medical needs should follow the guidance of their physician or
            registered dietitian.
          </p>
          <p>
            Always verify that meat, poultry, seafood, eggs, and reheated foods
            reach a safe internal temperature.
          </p>
        </article>

        <article className="aboutRecipesCard aboutQuoteCard">
          <h2>Our goal</h2>
          <p>
            <strong>
              The goal of Robert’s Recipe Box is not to make cooking complicated.
              It is to help you prepare enjoyable meals, shop more efficiently,
              reduce waste, save money, spend less time in the kitchen, and keep
              a few good meals ready for the days when you do not feel like
              cooking.
            </strong>
          </p>
        </article>
      </div>

      <div className="aboutRecipesActions">
        <button className="primary" onClick={() => setActivePage("Recipes")}>
          Browse Recipes
        </button>
        <button className="secondary" onClick={() => setActivePage("Meal Planner")}>
          Start Meal Planning
        </button>
        <button className="secondary" onClick={() => setActivePage("Shopping Lists")}>
          View Grocery List
        </button>
      </div>
    </main>
  );
}


function AboutRecipesPage({ setActivePage }) {
  return (
    <main className="pageShell aboutRecipesPage">
      <section className="aboutRecipesHero">
        <div>
          <div className="aiBadge">ABOUT THE RECIPES</div>
          <h1>About the Recipes</h1>
          <p>
            Robert’s Recipe Box is built around practical meals, familiar foods,
            AI-assisted recipe development under my direction, recipe-card
            simplicity, and planned leftovers for smaller households.
          </p>
        </div>
      </section>

      <div className="aboutRecipesGrid">
        <article className="aboutRecipesCard">
          <h2>AI-assisted, directed by me</h2>
          <p>
            The recipes are generated with the assistance of artificial
            intelligence, but they are guided by my choices for the meal idea,
            flavors, servings, cooking method, practical goals, and recipe-card
            format.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>Practical recipe cards</h2>
          <p>
            The recipes are designed to be easy to browse, easy to organize, and
            easy to reference while cooking. The goal is not to scroll through a
            long article just to find the ingredients or directions.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>Built for smaller households</h2>
          <p>
            Many recipes are planned around four servings. For a two-person
            household, that can mean dinner today and another prepared meal for
            lunch, another dinner, or the freezer.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>Copycat and familiar meals</h2>
          <p>
            Some recipes are inspired by restaurant-style, fast-food, family-style,
            or grocery-store favorites. They are homemade interpretations, not
            official restaurant formulas or copied company recipes.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>Adjustable choices</h2>
          <p>
            Recipes may include lower-calorie, lower-carb, lower-sodium,
            higher-protein, freezer-friendly, or budget-friendly ideas. The
            original recipe remains available, while the suggestions help users
            adapt meals to their own needs.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>Freezer-friendly planning</h2>
          <p>
            The site encourages a cook-once, eat-once, freeze-once approach when
            practical. Extra portions can become prepared meals for days when
            cooking from scratch is not realistic.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>Shopping and pantry support</h2>
          <p>
            Meal planning, pantry staples, grocery-list ideas, and smart grocery
            picks are included to make the recipes more useful beyond the recipe
            card itself.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>Review before cooking</h2>
          <p>
            Artificial intelligence is useful, but it can make mistakes. Read the
            complete recipe before beginning, use reasonable cooking judgment,
            check temperatures when needed, and adjust seasonings, timing, and
            ingredients for your kitchen.
          </p>
        </article>

        <article className="aboutRecipesCard aboutQuoteCard">
          <h2>Make it your own</h2>
          <p>
            <strong>
              The best version of any recipe is the one that works for your
              tastes, your budget, your equipment, and the people at your table.
            </strong>
          </p>
        </article>
      </div>

      <div className="aboutRecipesActions">
        <button className="primary" onClick={() => setActivePage("Recipes")}>
          Browse Recipes
        </button>
        <button className="secondary" onClick={() => setActivePage("Meal Planner")}>
          Start Meal Planning
        </button>
        <button className="secondary" onClick={() => setActivePage("How To Use")}>
          How to Use This Site
        </button>
      </div>
    </main>
  );
}



function AboutPage({ setActivePage }) {
  return (
    <main className="pageShell letterPageShell">
      <article className="readerLetterCard">
        <header className="readerLetterHeader">
          <div className="readerLetterLogoBlock">
            <img
              className="readerLetterLogo"
              src={`${import.meta.env.BASE_URL}images/ui/rrb-logo-wide.png`}
              alt="Robert's Recipe Box"
            />
            <div className="readerLetterTagline">Plan. Cook. Eat. Freeze. Save!</div>
          </div>

          <div className="readerLetterMeta">
            <span>Our Mission</span>
            <span>Robert’s Recipe Box</span>
          </div>
        </header>

        <div className="readerLetterRule" />

        <section className="readerLetterBody">
          <div className="readerLetterOrnament" aria-hidden="true">❦</div>
          <h1>Why I Started This Page</h1>

          <p className="readerGreeting">Dear Reader,</p>

          <p>
            I started Robert’s Recipe Box because I know how challenging it can be
            to plan meals that are simple, affordable, and actually
            enjoyable—especially when you are cooking for one, two, or just a few.
          </p>

          <p>
            My wife and I had tried a few subscription meal plans, and I liked the
            basic idea: choose a meal, have the ingredients organized, and follow
            clear instructions. The problem was that we did not always like the
            meals being offered. I found myself thinking that if I was going to
            cook, I wanted to cook something we actually enjoyed.
          </p>

          <p>
            At the same time, eating out was becoming more expensive. Even fast
            food could add up quickly for two people once drinks, tax, delivery
            fees, or tips were included. That made me start comparing the cost of
            buying a meal with the cost of making a similar meal at home.
          </p>

          <p>
            In many cases, we could prepare four servings at home for about the
            same price—or sometimes less—than buying two restaurant or fast-food
            meals. That meant dinner for two today and another meal for later in
            the week or the freezer.
          </p>

          <p>
            I created this site to help seniors, couples, empty nesters, and
            smaller households find an easier, less stressful way to get dinner on
            the table without wasting food or money.
          </p>

          <p>
            Here, you will find practical meal ideas, recipe cards, copycat-style
            meals, grocery-list help, freezer tips, and simple planning tools made
            for the way many of us actually cook and live today.
          </p>

          <p>
            My goal is to help you stretch your budget, make meals you genuinely
            enjoy, prepare enough for dinner and another meal, and build a small
            supply of freezer meals that can save time and bring peace of mind.
          </p>

          <p>
            If this site can make your time in the kitchen simpler, your meals
            more satisfying, and your days a little easier, then Robert’s Recipe
            Box has done exactly what I hoped it would do.
          </p>

          <p>
            Thank you for being here. I am glad you are part of this journey.
          </p>

          <div className="readerSignatureBlock">
            <p>Sincerely,</p>
            <div className="readerSignature">Robert</div>
            <p>
              Robert Willeby<br />
              Robert’s Recipe Box
            </p>
          </div>
        </section>

        <div className="readerLetterRule bottom" />

        <footer className="readerLetterActions">
          <button className="primary" onClick={() => setActivePage("Recipes")}>
            Browse Recipes
          </button>
          <button className="secondary" onClick={() => setActivePage("How To Use")}>
            How to Use This Site
          </button>
          <button className="secondary" onClick={() => setActivePage("About Recipes")}>
            About the Recipes
          </button>
        </footer>
      </article>
    </main>
  );
}



function AboutSmokingPage({ setActivePage }) {
  return (
    <main className="pageShell aboutRecipesPage aboutSmokingUnifiedPage">
      <section className="aboutRecipesHero">
        <div>
          <div className="aiBadge">TIPS & TECHNIQUES</div>
          <h1>Smoking Your Own Meats</h1>
          <p>
            I got started smoking meat after buying a Pit Boss pellet grill and
            learning how practical smoked and grilled foods can be for cook-once,
            eat-twice meals.
          </p>
        </div>
      </section>

      <div className="aboutRecipesGrid">
        <article className="aboutRecipesCard">
          <h2>How I got started</h2>
          <p>
            I am not a professional pitmaster. I started with the basics,
            followed proven methods, paid attention to temperatures, and learned
            from each cook.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>Why it works</h2>
          <p>
            Smoked meats can be portioned, refrigerated, frozen, and reused later
            for sandwiches, bowls, tacos, salads, baked potatoes, or quick
            weeknight dinners.
          </p>
        </article>

        <article className="aboutRecipesCard">
          <h2>Still learning</h2>
          <p>
            The goal is not competition barbecue. The goal is practical,
            flavorful food that home cooks can learn and use.
          </p>
        </article>
      </div>

      <div className="aboutRecipesActions">
        <button className="primary" onClick={() => setActivePage("Recipes")}>
          Browse Recipes
        </button>
        <button className="secondary" onClick={() => setActivePage("About")}>
          Our Mission
        </button>
      </div>
    </main>
  );
}

function PlaceholderInfoPage({ eyebrow, title, text, setActivePage }) {
  return (
    <main className="pageShell aboutRecipesPage placeholderInfoPage">
      <section className="aboutRecipesHero">
        <div>
          <div className="aiBadge">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{text}</p>
        </div>
      </section>

      <div className="aboutRecipesActions">
        <button className="primary" onClick={() => setActivePage("Recipes")}>
          Browse Recipes
        </button>
        <button className="secondary" onClick={() => setActivePage("How To Use")}>
          How to Use This Site
        </button>
      </div>
    </main>
  );
}


function FeatureStrip() {
  const features = [
    {
      title: "AI-Powered Recipes",
      text: "AI recipe ideas inspired by popular internet cuisines.",
    },
    {
      title: "Easy Meal Planning",
      text: "Build your own personal weekly meal plans for 2–6.",
    },
    {
      title: "Smart Shopping List",
      text: "Create custom shopping lists from your private meal plan.",
    },
    {
      title: "Smart Grocery Picks",
      text: "Review lighter, lower-carb grocery swaps before shopping.",
    },
    {
      title: "Recommendations",
      text: "Fun & handy kitchen products to help keep you organized.",
    },
  ];

  return (
    <section className="featureStrip">
      {features.map((feature) => (
        <div className="featureCard" key={feature.title}>
          <div className="featureCardHeader">
            <strong>{feature.title}</strong>
          </div>
          <small>{feature.text}</small>
        </div>
      ))}
    </section>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("Home");
  const [favorites, setFavorites] = useState(() =>
    loadJSON(STORAGE_KEYS.favorites, [])
  );
  const [plan, setPlan] = useState(() =>
    normalizeTwoWeekPlan(loadJSON(STORAGE_KEYS.plan, emptyTwoWeekPlan()))
  );
  const [servings, setServings] = useState(() =>
    loadJSON(STORAGE_KEYS.servings, 4)
  );
  const [checked, setChecked] = useState(() =>
    loadJSON(STORAGE_KEYS.checked, {})
  );
  const [pantry, setPantry] = useState(() =>
    loadJSON(STORAGE_KEYS.pantry, {})
  );
  const [filter, setFilter] = useState("");
  const [cardViewer, setCardViewer] = useState(null);

  useEffect(() => saveJSON(STORAGE_KEYS.favorites, favorites), [favorites]);
  useEffect(() => saveJSON(STORAGE_KEYS.plan, plan), [plan]);
  useEffect(() => saveJSON(STORAGE_KEYS.servings, servings), [servings]);
  useEffect(() => saveJSON(STORAGE_KEYS.checked, checked), [checked]);
  useEffect(() => saveJSON(STORAGE_KEYS.pantry, pantry), [pantry]);

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function addToPlan(recipeId) {
    setPlan((current) => {
      const next = normalizeTwoWeekPlan(current);
      const firstOpenSlot =
        PLANNER_SLOTS.find((slot) => (next[slot.key] || []).length === 0)?.key ||
        "week1-Mon";

      next[firstOpenSlot] = [...(next[firstOpenSlot] || []), recipeId];
      return next;
    });

    setActivePage("Meal Planner");
  }

  function openRecipeCard(recipeId, sourceRecipes = recipes) {
    setCardViewer({
      recipeId,
      recipeIds: sourceRecipes.map((recipe) => recipe.id),
    });
  }

  const pageProps = {
    favorites,
    toggleFavorite,
    addToPlan,
    openRecipeCard,
    setActivePage,
    setFilter,
    filter,
    plan,
    setPlan,
    servings,
    setServings,
    checked,
    setChecked,
    pantry,
    setPantry,
  };

  return (
    <div className="app">
      <Header activePage={activePage} setActivePage={setActivePage} />

      {activePage === "Home" && <Home {...pageProps} />}
      {activePage === "Recipes" && <RecipesPage {...pageProps} />}
      {activePage === "Collections" && <CollectionsPage />}
      {activePage === "Meal Planner" && <PlannerPage {...pageProps} />}
      {activePage === "Shopping Lists" && <ShoppingListPage {...pageProps} />}
      {activePage === "Pantry Staples" && <PantryStaplesPage {...pageProps} />}
      {activePage === "Favorites" && <FavoritesPage {...pageProps} />}
      {activePage === "Recommendations" && <RecommendationsPage {...pageProps} />}
      {activePage === "Grocery Picks" && <GroceryPicksPage {...pageProps} />}
      {activePage === "Smart Grocery Picks" && <GroceryPicksPage {...pageProps} />}
      {activePage === "Freezer Tips" && <FreezerTipsPage {...pageProps} />}
      {activePage === "About" && <AboutPage setActivePage={setActivePage} initialSection="main" />}
      {activePage === "Who Is Robert" && (
        <PlaceholderInfoPage
          eyebrow="OUR MISSION"
          title="Who Is Robert"
          text="This page will introduce Robert, the person behind Robert’s Recipe Box, and explain the practical cooking experience behind the site."
          setActivePage={setActivePage}
        />
      )}
      {activePage === "My Goals" && (
        <PlaceholderInfoPage
          eyebrow="OUR MISSION"
          title="What Are My Goals"
          text="This page will explain the goals of Robert’s Recipe Box: practical meals, smart planning, useful leftovers, freezer meals, and saving money where possible."
          setActivePage={setActivePage}
        />
      )}
      {activePage === "Cooking Methods" && (
        <PlaceholderInfoPage
          eyebrow="COOKING METHODS"
          title="Cooking Methods"
          text="This page will help visitors browse recipes by appliance or method, including air fryer, oven, microwave, gas grill, smoker, stovetop, slow cooker, and other practical cooking options."
          setActivePage={setActivePage}
        />
      )}
      {activePage === "Suggested Meal Plans" && (
        <PlaceholderInfoPage
          eyebrow="OUR RECIPES"
          title="Suggested Meal Plans"
          text="This page will collect practical meal-plan ideas for smaller households, planned leftovers, freezer meals, and easy weekly routines."
          setActivePage={setActivePage}
        />
      )}
      {activePage === "Bread Tips" && (
        <PlaceholderInfoPage
          eyebrow="TIPS & TECHNIQUES"
          title="Baking Your Own Breads"
          text="This page will include practical bread-baking tips, freezer ideas, recipe-card guidance, and simple ways to bake breads and rolls at home."
          setActivePage={setActivePage}
        />
      )}
      {activePage === "Submit Recipes" && (
        <PlaceholderInfoPage
          eyebrow="TIPS & TECHNIQUES"
          title="Submit Your Recipes"
          text="This page will explain how visitors can suggest recipe ideas, family favorites, copycat-style meals, or practical cooking tips for future consideration."
          setActivePage={setActivePage}
        />
      )}
      {activePage === "Safe Cooking Rules" && (
        <PlaceholderInfoPage
          eyebrow="TIPS & TECHNIQUES"
          title="Safe Cooking Rules"
          text="This page will collect basic food-safety reminders for cooking, cooling, freezing, thawing, reheating, and checking safe internal temperatures."
          setActivePage={setActivePage}
        />
      )}
      {activePage === "Storage Organization" && (
        <PlaceholderInfoPage
          eyebrow="TIPS & TECHNIQUES"
          title="Storage & Organization"
          text="This page will include ideas for organizing recipes, pantry staples, freezer meals, storage containers, labels, and kitchen tools."
          setActivePage={setActivePage}
        />
      )}
      {activePage === "Other Interests" && (
        <PlaceholderInfoPage
          eyebrow="TIPS & TECHNIQUES"
          title="Other Interests"
          text="This page will hold additional practical topics, experiments, tools, and ideas that do not fit neatly into the main recipe sections."
          setActivePage={setActivePage}
        />
      )}
      {activePage === "How To Use" && <HowToUsePage setActivePage={setActivePage} />}
      {activePage === "About Recipes" && <AboutRecipesPage setActivePage={setActivePage} />}
      {activePage === "About Smoking" && <AboutSmokingPage setActivePage={setActivePage} />}

      <RecipeCardViewer
        viewer={cardViewer}
        onClose={() => setCardViewer(null)}
        setViewer={setCardViewer}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />

      <footer className="footer">
        Robert’s Recipe Box uses AI-generated recipe collections as practical
        planning tools. Favorites and plans are saved in this browser only.
      </footer>
    </div>
  );
}
