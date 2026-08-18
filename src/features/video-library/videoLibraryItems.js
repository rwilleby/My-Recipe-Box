export const VIDEO_LIBRARY_PLACEHOLDER_POSTER =
  "images/video-posters/library/video-not-assigned-color-bars.webp";

const VIDEO_POSTER_ROOT = "images/video-posters/library";
const VIDEO_ROOT = "videos";

function availableVideo(id, title, description, assetName, page, pageLabel) {
  return {
    id,
    title,
    description,
    video: `${VIDEO_ROOT}/${assetName}.mp4`,
    poster: `${VIDEO_POSTER_ROOT}/${assetName}.webp`,
    page,
    pageLabel,
  };
}

function plannedVideo(id, title, page, pageLabel) {
  return {
    id,
    title,
    description: `A video guide for ${title} is planned and will be added here.`,
    video: null,
    poster: VIDEO_LIBRARY_PLACEHOLDER_POSTER,
    page,
    pageLabel,
  };
}

export const VIDEO_LIBRARY_ITEMS = [
  availableVideo("welcome-recipe-box", "Welcome to Robert’s Recipe Box", "A short introduction to the site and its practical meal-planning tools.", "welcome-video", "Home", "Open Home Page"),
  availableVideo("easy-detailed", "Easy or Detailed", "Choose the simpler Easy experience or the fuller Detailed experience.", "easy-or-detailed", "Home", "Open Home Page"),
  availableVideo("welcome-site", "Welcome to Our Site", "Robert’s welcome and an overview of what visitors can find throughout the site.", "welcome-to-our-site", "About", "Open Welcome Page"),
  plannedVideo("view-video-library", "View Our Video Library", "Video Library", "Open Video Library"),
  availableVideo("data-security", "Your Data & Security", "Learn how favorites, plans, notes, inventories, and preferences stay in your browser.", "your-data-and-security", "Your Data & Security", "Open Data & Security"),
  availableVideo("about-recipes", "About Our Recipes", "See how the AI-assisted recipes are directed, reviewed, and organized.", "about-our-recipes", "About Recipes", "Open About Our Recipes"),
  availableVideo("nutrition-standards", "Our Nutritional Standards", "Review how recipe nutrition is estimated and why actual results can vary.", "nutrition-standards", "Nutrition Standards", "Open Nutrition Standards"),
  availableVideo("mealbalance", "Understanding MealBalance", "Learn how the 1–10 MealBalance guide compares lighter, moderate, rich, and indulgent meals.", "understanding-mealbalance", "MealBalance Guide", "Open MealBalance Guide"),
  availableVideo("affiliate-marketing", "Affiliate Marketing", "See how qualifying product links may help support the free site without changing the shopper’s price.", "affiliate-marketing", "Affiliate Marketing", "Open Affiliate Information"),
  availableVideo("backup-restore", "Backup & Restore", "Learn how to protect locally saved Recipe Box information with a downloadable backup file.", "backup-and-restore", "User Backup", "Open Backup & Restore"),
  availableVideo("quick-dinner-ideas", "Quick Dinner Ideas", "Use the rotating dinner ideas to find a complete meal and open its recipe cards.", "dinner-ideas", "Home", "Open Home Page"),
  availableVideo("diet-meals", "Diet Meals", "Explore the lighter Diet Meals rotation and related Healthy Dinners collection.", "diet-meals", "Healthy Dinners", "Open Healthy Dinners"),
  availableVideo("salad-jars-home", "Salad Jar Lunches", "Explore practical Salad Jar Lunches and their recipe-finding controls.", "salad-jars", "Salad Jars", "Open Salad Jar Lunches"),
  availableVideo("choose-level", "Choose Your Level", "Choose what you want to do and reveal the tools that fit that task.", "choose-your-level", "Home", "Open Home Page"),
  availableVideo("quick-links", "Browse Our Quick Links", "Use the category icons as a quick route into the recipe library.", "browse-our-quick-links", "Home", "Open Home Page"),
  plannedVideo("master-inventory", "Master Kitchen Inventory", "Master Kitchen Inventory", "Open Master Inventory"),
  plannedVideo("refrigerator-inventory", "Refrigerator Inventory", "Kitchen Refrigerator", "Open Refrigerator Inventory"),
  plannedVideo("prepared-freezer-inventory", "Prepared Freezer Inventory", "Prepared Freezer Inventory", "Open Prepared Freezer"),
  plannedVideo("freezer-inventory", "Freezer Inventory", "Kitchen Freezer", "Open Freezer Inventory"),
  plannedVideo("pantry-inventory", "Pantry Inventory", "Pantry Staples", "Open Pantry Inventory"),
  availableVideo("browse-recipes", "Browse Our Recipes", "Search, filter, and open recipes in the main library.", "browse-our-recipe-library", "Recipes", "Open Recipe Library"),
  plannedVideo("favorite-recipes", "Your Favorite Recipes", "Favorites", "Open Favorite Recipes"),
  plannedVideo("dinner-combinations", "Dinner Combinations", "Dinner Combinations", "Open Dinner Combinations"),
  availableVideo("healthy-dinners", "Healthy Dinners", "Explore the Healthy Dinners collection and its lighter Diet Meal choices.", "diet-meals", "Healthy Dinners", "Open Healthy Dinners"),
  availableVideo("salad-jars-collection", "Salad Jar Lunches", "Explore the complete Salad Jar Lunches collection.", "salad-jars", "Salad Jars", "Open Salad Jar Lunches"),
  availableVideo("slow-cooker", "Slow Cooker Meals", "Explore the Crock Pot recipe collection and practical slow-cooker meal ideas.", "crock-pot-meals", "Slow Cooker Favorites", "Open Slow Cooker Meals"),
  plannedVideo("weekly-planner", "Your Weekly Meal Planner", "Meal Planner", "Open Weekly Meal Planner"),
  plannedVideo("bulk-planner", "Weekend Bulk Meal Planner", "Weekend Bulk Meal Planner", "Open Bulk Meal Planner"),
  plannedVideo("freezing-reheating", "Freezing & Reheating", "Freezer Tips", "Open Freezing & Reheating"),
  plannedVideo("grocery-list", "Your Grocery List", "Shopping Lists", "Open Grocery List"),
  plannedVideo("recommended-products", "Recommended Products", "Products I Use", "Open Recommended Products"),
  plannedVideo("food-safety", "Food Safety", "Safe Cooking Rules", "Open Food Safety"),
  plannedVideo("cooking-resource", "Cooking Resource", "Reference Guides", "Open Cooking Resources"),
];
