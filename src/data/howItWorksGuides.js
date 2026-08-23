export const HOW_IT_WORKS_QUICK_PATH = [
  "Choose What You Want to Do",
  "Find or Build a Meal",
  "Review the Recipe",
  "Plan Portions",
  "Cook with Confidence",
  "Save Your Favorites",
];

export const HOW_IT_WORKS_GOALS = [
  ["Find a Recipe", "browse-recipes"],
  ["Build a Complete Dinner", "complete-dinners"],
  ["Plan Meals for the Week", "weekly-meal-planner"],
  ["Prepare Freezer Meals", "meal-builder"],
  ["Make a Shopping List", "shopping-list"],
  ["Use My Kitchen Inventory", "kitchen-inventory"],
  ["Save Favorites and Notes", "favorites-notes"],
  ["Back Up My Recipe Box", "backup-restore"],
];

export const HOW_IT_WORKS_CATEGORIES = [
  "Getting Started",
  "Finding Recipes",
  "Building and Planning Meals",
  "Shopping and Kitchen Inventory",
  "Cooking and Freezer Preparation",
  "Favorites, Notes and Saved Information",
  "Nutrition and MealBalance",
  "Backup, Privacy and Site Settings",
];

export const HOW_IT_WORKS_GUIDES = [
  {
    id: "home",
    title: "Home",
    category: "Getting Started",
    purpose: "Choose the part of Robert’s Recipe Box that is most useful today without completing a setup process or creating an account.",
    steps: [
      "Choose Easy or Detailed mode for the amount of information you want to see.",
      "Use the main choices to browse recipes, plan meals, shop, cook, or organize your kitchen.",
      "Open the red WATCH VIDEO button for a demonstration or the green HOW IT WORKS button for written help.",
    ],
    features: ["Easy and Detailed modes", "Recipe and planning shortcuts", "Backup reminder", "Video and written help"],
    tip: "Start with one task. You can use each feature on its own and add the connected tools later.",
    page: "Home",
    centralAnchor: "guide-home",
    video: { pageTitle: "Home", label: "Welcome Tour" },
    roadmap: ["Choose a Task", "Open a Tool", "Complete Today’s Step", "Return When Ready"],
  },
  {
    id: "browse-recipes",
    title: "Browse Recipes",
    category: "Finding Recipes",
    purpose: "Search and compare recipes by name, category, collection, cooking method, or practical meal need.",
    steps: [
      "Enter a recipe name or ingredient in the search field.",
      "Use the available filters to narrow the recipe library.",
      "Select a recipe result to open its recipe card.",
      "Favorite the recipe or add it to your meal plan when it fits your needs.",
    ],
    features: ["Recipe search", "Category and nutrition filters", "Favorites", "Meal-planner connection"],
    tip: "Begin with a broad search, then add only one filter at a time so useful choices are not hidden.",
    page: "Recipes",
    centralAnchor: "guide-browse-recipes",
    video: { pageTitle: "Browse Our Recipe Library", label: "Browse Recipes" },
  },
  {
    id: "recipe-cards",
    title: "Recipe Cards",
    category: "Finding Recipes",
    purpose: "Review a recipe’s ingredients, directions, servings, nutrition, MealBalance, notes, and planning tools in one place.",
    steps: [
      "Open a recipe from the library, Favorites, Meal Builder, or a Complete Dinner.",
      "Use the arrows to move through other recipes in the same group.",
      "Open the supporting panels for nutrition, Smart Tips, notes, or cooking options.",
      "Print, download, favorite, or add the recipe to your plan.",
    ],
    features: ["Card zoom", "Previous and next recipes", "Personal notes", "Print and download", "Favorites and planning"],
    tip: "Your personal notes stay in this browser, so include them whenever you create a backup.",
    page: "Recipes",
    centralAnchor: "guide-recipe-cards",
    video: { pageTitle: "Browse Our Recipe Library", label: "Recipe Cards" },
  },
  {
    id: "complete-dinners",
    title: "Complete Dinners",
    category: "Building and Planning Meals",
    purpose: "Choose a prepared combination of one main dish and practical sides, then review the whole meal before planning it.",
    steps: [
      "Search or filter the Complete Dinner collection.",
      "Review the main dish, sides, estimated nutrition, and freezer notes.",
      "Open any included recipe card when you need its full instructions.",
      "Add the complete dinner to the Weekly Meal Planner.",
    ],
    features: ["Curated meal combinations", "Whole-meal nutrition", "Recipe-card links", "Planner connection"],
    tip: "Use Complete Dinners when you want a ready-made pairing; use Meal Builder when you want to mix your own.",
    page: "Dinner Combinations",
    centralAnchor: "guide-complete-dinners",
    roadmap: ["Choose Dinner", "Review Components", "Check Nutrition", "Add to Plan"],
  },
  {
    id: "meal-builder",
    title: "Meal Builder",
    category: "Building and Planning Meals",
    purpose: "Mix a main dish with up to two sides, preview the assembled tray, plan portions, save the meal, and print meal labels.",
    steps: [
      "Search the Main, Side 1, and Side 2 columns and select recipes to place them directly in the tray.",
      "Use the VIEW RECIPE controls under the tray whenever you need a full recipe card.",
      "Review estimated calories and MealBalance, then divide portions among Eat Now, Refrigerate, and Freeze.",
      "Save the completed meal, add it to Favorites, or print Avery meal labels.",
    ],
    features: ["Scrollable dish selectors", "Standard, two-thirds, and full-tray mains", "Calorie and MealBalance estimate", "Portion planning", "Saved meals and labels"],
    tip: "Full-tray meals disable both sides; two-thirds meals disable Side 1 and keep Side 2 available.",
    page: "Build Your Own Meal",
    centralAnchor: "guide-meal-builder",
    roadmap: ["Select Main", "Add Available Sides", "Review Tray", "Plan Portions", "Save or Print"],
  },
  {
    id: "weekly-meal-planner",
    title: "Weekly Meal Planner",
    category: "Building and Planning Meals",
    purpose: "Arrange meals across the week, account for servings and leftovers, and connect planned meals to shopping.",
    steps: [
      "Choose the week and the day you want to plan.",
      "Search for a recipe, Complete Dinner, or saved meal.",
      "Add it to the selected day and adjust servings or meal details.",
      "Review the week before building or updating the grocery list.",
    ],
    features: ["Two-week planning", "Recipe and dinner previews", "Serving adjustments", "Shopping-list connection"],
    tip: "Plan leftover and freezer nights first; then fill the remaining days with meals that need fresh cooking.",
    page: "Meal Planner",
    centralAnchor: "guide-weekly-meal-planner",
    video: { pageTitle: "Weekly Dinner Planning", label: "Weekly Meal Planner" },
    roadmap: ["Choose Week", "Place Meals", "Adjust Servings", "Review Leftovers", "Build Shopping List"],
  },
  {
    id: "shopping-list",
    title: "Shopping List",
    category: "Shopping and Kitchen Inventory",
    purpose: "Combine needed ingredients into one organized list while accounting for food already recorded in your kitchen.",
    steps: [
      "Add ingredients from recipes or planned meals.",
      "Compare the list with the Master Kitchen Inventory.",
      "Edit quantities, comments, categories, or checked items as needed.",
      "Use the finished list while shopping or print it for later.",
    ],
    features: ["Consolidated ingredients", "Inventory comparison", "Categories and comments", "Check-off and print tools"],
    tip: "Update your inventory before finalizing the list to reduce duplicate purchases.",
    page: "Shopping Lists",
    centralAnchor: "guide-shopping-list",
    video: { pageTitle: "Your Grocery List", label: "Shopping List" },
    roadmap: ["Planned Meals", "Needed Ingredients", "Subtract Inventory", "Shop", "Update Inventory"],
  },
  {
    id: "kitchen-inventory",
    title: "Kitchen Inventory",
    category: "Shopping and Kitchen Inventory",
    purpose: "Keep a practical record of pantry, refrigerator, freezer, and prepared foods that are already available.",
    steps: [
      "Choose the pantry, refrigerator, freezer, or prepared-food area.",
      "Mark items you have and adjust quantities or locations.",
      "Add a custom item when it is not already listed.",
      "Update the record as food is purchased, cooked, frozen, or used.",
    ],
    features: ["Pantry, refrigerator, and freezer records", "Prepared-food inventory", "Custom items", "Shopping-list awareness"],
    tip: "A quick update after grocery shopping is easier than rebuilding the inventory later.",
    page: "Master Kitchen Inventory",
    centralAnchor: "guide-kitchen-inventory",
    video: { pageTitle: "Master Kitchen Inventory", label: "Kitchen Inventory" },
    roadmap: ["Record What You Have", "Plan Meals", "Identify Missing Items", "Shop", "Update Quantities"],
  },
  {
    id: "favorites-notes",
    title: "Favorites and Notes",
    category: "Favorites, Notes and Saved Information",
    purpose: "Keep dependable recipes, Complete Dinners, custom-built meals, and personal cooking notes easy to find.",
    steps: [
      "Tap a heart to add a recipe, Complete Dinner, or saved custom meal to Favorites.",
      "Open Favorites to review everything saved in this browser.",
      "Open a recipe card to write or update a personal note.",
      "Remove a favorite or revise a note whenever it is no longer useful.",
    ],
    features: ["Recipe favorites", "Complete Dinner favorites", "Favorite custom meals", "Private browser-based notes"],
    tip: "Back up your Recipe Box regularly so favorites and notes can be restored after a browser or device change.",
    page: "Favorites",
    centralAnchor: "guide-favorites-notes",
  },
  {
    id: "backup-restore",
    title: "Backup & Restore",
    category: "Backup, Privacy and Site Settings",
    purpose: "Create a portable backup of the Recipe Box information stored in your browser and restore it when needed.",
    steps: [
      "Open Backup & Restore and choose Backup My Recipe Box.",
      "Save the downloaded JSON file somewhere you can find again.",
      "To recover information, choose Restore My Recipe Box and select a trusted backup file.",
      "Review the restored favorites, notes, plans, lists, and inventory.",
    ],
    features: ["Local JSON backup", "Restore validation", "Backup reminders", "No account or cloud login"],
    tip: "Keep more than one dated backup, especially before changing browsers, clearing browser data, or moving to a new device.",
    page: "User Backup",
    centralAnchor: "guide-backup-restore",
    video: { pageTitle: "Backup & Restore", label: "Backup & Restore" },
    roadmap: ["Create Backup", "Store File Safely", "Select Restore File", "Validate", "Confirm Saved Information"],
  },
  {
    id: "data-security",
    title: "Your Data & Security",
    category: "Backup, Privacy and Site Settings",
    purpose: "Understand what information the site stores, where it stays, and how to protect or remove it.",
    steps: [
      "Review which Recipe Box features save information in the browser.",
      "Create backups of information you do not want to lose.",
      "Use browser controls carefully because clearing site data can remove saved information.",
      "Review the privacy and security explanation whenever your device or browser changes.",
    ],
    features: ["Local browser storage", "No login", "No personal-information collection", "User-controlled backup and removal"],
    tip: "A browser backup protects your saved work; it does not upload or share it with Robert’s Recipe Box.",
    page: "Your Data & Security",
    centralAnchor: "guide-data-security",
    video: { pageTitle: "Your Data & Security", label: "Your Data & Security" },
  },
  {
    id: "mealbalance",
    title: "Understanding MealBalance",
    category: "Nutrition and MealBalance",
    purpose: "Use the 1–10 MealBalance estimate to compare lighter, balanced, moderate, rich, and indulgent choices in context.",
    steps: [
      "Find the MB number on a recipe, Complete Dinner, or custom-built meal.",
      "Use the number to compare choices—not as a grade or medical recommendation.",
      "Consider serving size, sides, and the balance of meals across the day or week.",
      "Open the full MealBalance guide whenever you need the scale explained.",
    ],
    features: ["Consistent 1–10 comparison", "Recipe and whole-meal estimates", "Plain-language scale", "Nutrition context"],
    tip: "MealBalance is a planning guide, not a medical diagnosis, diet prescription, or substitute for professional advice.",
    page: "MealBalance Guide",
    centralAnchor: "guide-mealbalance",
    video: { pageTitle: "Understanding MealBalance", label: "Understanding MealBalance" },
  },
];

const GUIDE_BY_ID = new Map(HOW_IT_WORKS_GUIDES.map((guide) => [guide.id, guide]));

const GUIDE_ID_BY_PAGE = new Map([
  ["Home", "home"],
  ["Recipes", "browse-recipes"],
  ["Recipe Cards", "recipe-cards"],
  ["Dinner Combinations", "complete-dinners"],
  ["Build Your Own Meal", "meal-builder"],
  ["Meal Planner", "weekly-meal-planner"],
  ["Shopping Lists", "shopping-list"],
  ["Master Kitchen Inventory", "kitchen-inventory"],
  ["Favorites", "favorites-notes"],
  ["User Backup", "backup-restore"],
  ["Your Data & Security", "data-security"],
  ["MealBalance Guide", "mealbalance"],
]);

export function getHowItWorksGuide(id) {
  return GUIDE_BY_ID.get(id) || null;
}

export function getHowItWorksGuideForPage(pageId) {
  return getHowItWorksGuide(GUIDE_ID_BY_PAGE.get(pageId));
}

export function howItWorksSearchText(guide) {
  return [guide.title, guide.category, guide.purpose, ...guide.steps, ...guide.features, guide.tip]
    .join(" ")
    .toLocaleLowerCase();
}
