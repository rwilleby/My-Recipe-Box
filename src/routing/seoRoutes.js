export const SITE_ORIGIN = "https://www.roberts-recipe-box.com";
export const SITE_NAME = "Robert's Recipe Box";
export const DEFAULT_SOCIAL_IMAGE = "/images/ui/rrb-recipe-box-mark.webp";

const PAGE_ROUTE_OVERRIDES = {
  Home: "/",
  "How It Works": "/how-it-works/",
  Recipes: "/recipes/",
  "Dinner Combinations": "/complete-dinners/",
  "Complete Dinners": "/collections/complete-dinners/",
  Favorites: "/favorites/",
  "Meal Planner": "/meal-planner/",
  "Build Your Own Meal": "/build-your-own-meal/",
  "Shopping Lists": "/shopping-list/",
  "Master Kitchen Inventory": "/kitchen-inventory/",
  "User Backup": "/backup-and-restore/",
  "Your Data & Security": "/your-data-and-security/",
  "Products I Use": "/cooking-tools-storage-and-organization/",
  "Safe Cooking Rules": "/food-safety/",
  "Grocery Picks": "/healthy-substitutions/",
  "Slow Cooker Favorites": "/slow-cooker-meals/",
  "Freezer-Friendly Meals": "/quick-and-easy-freezer-meals/",
  "MealBalance Guide": "/understanding-mealbalance/",
};

export const ROUTABLE_PAGE_IDS = [
  "Home", "About", "About Recipe Box Hidden", "About Recipes", "About Smoking",
  "Admin Combo-Meal Builder", "Admin Nutrition Database", "Admin Recipe Editor",
  "Admin Recipes", "Affiliate Marketing", "Air Fryer Recipes", "Bread Tips",
  "Build Your Own Meal", "Collections", "Comfort Foods", "Complete Dinners", "Contact Me", "Cooking Methods",
  "Crockpot Recipes", "Dinner Builder", "Dinner Combination Hero Audit",
  "Dinner Combinations", "Disclaimers", "Easy 30-Minute Meals", "Favorites",
  "Free To Use", "Freezer Inventory Management", "Freezer Tips",
  "Freezer-Friendly Meals", "GLP-1 Nutrition", "Gas Grill Recipes", "Griddle Recipes",
  "Grilling Tips", "Grocery Picks", "Healthy Dinners", "How It Works",
  "Kitchen Freezer", "Kitchen Refrigerator", "Make-Ahead Meals", "Meal Planner",
  "Master Kitchen Inventory", "MealBalance Guide", "Meals for Two", "Microwave Recipes", "My Goals",
  "Nutrition Standards", "Other Interests", "Oven Recipes", "Packaging Options",
  "Pantry Organization", "Pantry Staples", "Prepared Freezer Inventory",
  "Products I Use", "RFIS Project Dashboard", "RFIS Search", "Recipes",
  "Recommendations", "Reference Guides", "Safe Cooking Rules", "Salad Jars",
  "Shopping Lists", "Slow Cooker Favorites", "Smart Grocery Picks", "Smoker Recipes",
  "Storage Organization", "Submit Recipes", "Suggested Meal Plans", "Summer Cookouts",
  "Sunday Meals", "Under Construction", "User Backup", "Video Library",
  "Weekend Bulk Meal Planner", "Weekly Meal Planner Prototype", "Who Is Robert",
  "Your Data & Security",
];

const PRIVATE_PAGE_IDS = new Set([
  "About Recipe Box Hidden", "Admin Combo-Meal Builder", "Admin Nutrition Database",
  "Admin Recipe Editor", "Admin Recipes", "Dinner Combination Hero Audit", "Favorites",
  "Build Your Own Meal", "Freezer Inventory Management", "Kitchen Freezer", "Kitchen Refrigerator", "Master Kitchen Inventory", "Meal Planner",
  "My Goals", "Pantry Organization", "Pantry Staples", "Prepared Freezer Inventory",
  "RFIS Project Dashboard", "Shopping Lists", "Submit Recipes", "Under Construction",
  "User Backup", "Weekend Bulk Meal Planner", "Weekly Meal Planner Prototype",
]);

const PAGE_TITLES = {
  Home: "Recipes, Meal Planning & Kitchen Tools",
  About: "Welcome to Robert's Recipe Box",
  "How It Works": "How It Works",
  "About Recipes": "About Our Recipes",
  "Affiliate Marketing": "Affiliate Marketing & Product Links",
  "Your Data & Security": "Your Data & Security",
  "Nutrition Standards": "Our Nutrition Standards",
  "MealBalance Guide": "Understanding MealBalance",
  "User Backup": "Backup & Restore",
  Recipes: "Browse Our Recipe Library",
  "Dinner Combinations": "Dinner Combinations",
  "Healthy Dinners": "Healthy Dinners",
  "Salad Jars": "Salad Jar Lunches",
  "Slow Cooker Favorites": "Slow Cooker Meals",
  "Freezer-Friendly Meals": "Quick & Easy Freezer Meals",
  "Meal Planner": "Your Weekly Meal Planner",
  "Build Your Own Meal": "Build Your Own Meal",
  "Weekend Bulk Meal Planner": "Weekend Bulk Meal Planner",
  "Grocery Picks": "Healthy Substitutions",
  "Shopping Lists": "Your Grocery List",
  "Products I Use": "Cooking Tools, Storage & Organization",
  "Safe Cooking Rules": "Food Safety",
  "GLP-1 Nutrition": "Eating Well with GLP-1 Medications",
  "Air Fryer Recipes": "Tips: Air Fryers",
  "Microwave Recipes": "Tips: Microwave Ovens",
  "Oven Recipes": "Tips: Gas & Electric Ovens",
  "Griddle Recipes": "Tips: Gas & Electric Griddles",
  "Gas Grill Recipes": "Tips: Gas Grills",
  "Smoker Recipes": "Tips: Pellet Smokers",
};

const PAGE_DESCRIPTIONS = {
  Home: "Free recipes, complete dinner ideas, meal planning, grocery lists, freezer guidance, kitchen organization, and practical cooking tools for smaller households.",
  About: "Meet Robert and learn how Robert's Recipe Box brings recipes, weekly planning, shopping, cooking, freezing, and storage together in one practical website.",
  "How It Works": "Your guide to using Robert's Recipe Box, with a quick overview, searchable instructions, page-specific help, roadmaps, and connected videos.",
  "About Recipes": "Learn how recipes in Robert's Recipe Box are developed, organized, reviewed, portioned, and presented for practical home cooking.",
  "Nutrition Standards": "Review the nutrition assumptions, serving standards, estimates, and practical guidance used throughout Robert's Recipe Box.",
  "MealBalance Guide": "Understand the Robert's Recipe Box MealBalance scale for comparing lighter, balanced, moderate, rich, and indulgent meals.",
  "Affiliate Marketing": "Learn how Amazon and other affiliate product links support Robert's Recipe Box without subscriptions, display ads, or added affiliate fees.",
  "Contact Me": "Contact Robert's Recipe Box with recipe questions, corrections, privacy concerns, website feedback, and affiliate inquiries.",
  Disclaimers: "Read the website, recipe, nutrition, food-safety, privacy, affiliate, and legal disclaimers for Robert's Recipe Box.",
  Recipes: "Browse recipe cards by cuisine, collection, cooking method, meal type, nutrition needs, and practical household goals.",
  "Dinner Combinations": "Browse complete dinner combinations pairing approved main dishes with practical sides, nutrition estimates, planning tools, and freezer guidance.",
  "Healthy Dinners": "Compare lighter Diet Meals by protein, cuisine, calories, and MealBalance, with complete recipe cards and estimated nutrition.",
  "Salad Jars": "Find layered salad jar lunches designed for make-ahead convenience, fresh ingredients, and practical grab-and-go meals.",
  "Slow Cooker Favorites": "Browse dependable Crock Pot and slow cooker meals for easy preparation, relaxed cooking, leftovers, and freezer planning.",
  "Freezer-Friendly Meals": "Plan quick and easy freezer meals with make-ahead recipes, safe cooling, packaging, labeling, thawing, and reheating guidance.",
  "Summer Cookouts": "Find grilled mains, cookout sides, salads, and make-ahead ideas for relaxed outdoor meals and summer gatherings.",
  "Comfort Foods": "Browse familiar casseroles, creamy dishes, slow-cooked favorites, and dependable homestyle comfort-food recipes.",
  "Easy 30-Minute Meals": "Find straightforward skillet, pasta, air-fryer, grilled, and casserole recipes designed for easier weeknight dinners.",
  "Master Kitchen Inventory": "Manage kitchen, freezer, refrigerator, and pantry supplies from one organized browser-based inventory page.",
  "Freezer Tips": "Review practical freezing, packaging, labeling, thawing, storage, and reheating guidance for prepared meals and ingredients.",
  "Meal Planner": "Organize two weeks of dinners, serving counts, planned leftovers, freezer meals, and weekly grocery preparation in your browser.",
  "Build Your Own Meal": "Mix and match a main dish and two sides, preview the assembled meal, and divide portions between eating now, refrigerating, and freezing for later.",
  "Weekend Bulk Meal Planner": "Build a practical weekend cooking plan for preparing, portioning, refrigerating, freezing, labeling, and storing multiple meals.",
  "Grocery Picks": "Review healthier, lower-carb, freezer-friendly, and small-household substitutions before shopping or swapping grocery-list items.",
  "Shopping Lists": "Create and manage a consolidated grocery list from recipes, dinner plans, pantry supplies, and checked inventory items.",
  "Products I Use": "Browse practical cooking tools, cookware, food-storage products, and kitchen-organization ideas grouped by category.",
  "Safe Cooking Rules": "Review practical food-safety guidance for clean preparation, cross-contamination prevention, safe temperatures, cooling, and storage.",
  "Reference Guides": "Use quick kitchen reference guides for measurements, temperatures, conversions, pan sizes, storage, portions, substitutions, smoking, and grilling.",
  "GLP-1 Nutrition": "Review practical protein, fiber, fluid, and nutrient-dense food guidance for people using GLP-1 medications with professional medical support.",
  "Air Fryer Recipes": "Review practical air-fryer cooking, care, timing, temperature, safety, and cleanup tips for dependable results.",
  "Microwave Recipes": "Review microwave cooking, reheating, container, timing, stirring, standing-time, and food-safety guidance.",
  "Oven Recipes": "Review practical gas and electric oven use, temperature, rack placement, preheating, cookware, cleaning, and safety guidance.",
  "Griddle Recipes": "Review practical gas and electric griddle setup, temperature control, cooking zones, cleaning, storage, and safety guidance.",
  "Gas Grill Recipes": "Review practical gas-grill setup, heat zones, temperatures, flare-up control, cleaning, storage, and food-safety guidance.",
  "Smoker Recipes": "Review practical pellet-smoker setup, temperatures, smoke, wrapping, resting, slicing, cleaning, and safety guidance.",
  "Video Library": "Watch Robert's Recipe Box guides for browsing recipes, meal planning, shopping lists, inventory, nutrition, and kitchen workflows.",
  "Your Data & Security": "Learn how favorites, notes, plans, lists, inventory, and preferences remain private in your browser and can be backed up locally.",
};

export function slugifyRoute(value = "") {
  return String(value)
    .normalize("NFKD")
    .replace(/[’']/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .toLowerCase();
}

export function routeForPage(pageId = "Home") {
  if (PAGE_ROUTE_OVERRIDES[pageId]) return PAGE_ROUTE_OVERRIDES[pageId];
  return `/${slugifyRoute(pageId)}/`;
}

export function routeForRecipe(recipeId = "") {
  return `/recipes/${slugifyRoute(recipeId)}/`;
}

export function routeForCompleteDinner(dinnerId = "") {
  return `/complete-dinners/${slugifyRoute(dinnerId)}/`;
}

const PAGE_BY_ROUTE = new Map(
  ROUTABLE_PAGE_IDS.map((pageId) => [routeForPage(pageId).toLowerCase(), pageId]),
);
PAGE_BY_ROUTE.set("/how-to-use/", "How It Works");

export function normalizeRoutePath(pathname = "/") {
  const clean = `/${String(pathname).split(/[?#]/)[0].replace(/^\/+|\/+$/g, "")}`;
  return clean === "/" ? "/" : `${clean}/`;
}

export function parseRoute(pathname = "/") {
  const normalizedPath = normalizeRoutePath(pathname).toLowerCase();
  const recipeMatch = normalizedPath.match(/^\/recipes\/([a-z0-9-]+)\/$/);
  if (recipeMatch) {
    return { type: "recipe", pageId: "Recipes", code: recipeMatch[1].toUpperCase(), path: normalizedPath };
  }

  const dinnerMatch = normalizedPath.match(/^\/complete-dinners\/([a-z0-9-]+)\/$/);
  if (dinnerMatch) {
    return { type: "completeDinner", pageId: "Dinner Combinations", code: dinnerMatch[1].toUpperCase(), path: normalizedPath };
  }

  const pageId = PAGE_BY_ROUTE.get(normalizedPath) || "Home";
  return { type: "page", pageId, code: "", path: routeForPage(pageId) };
}

export function isPrivatePage(pageId = "") {
  return PRIVATE_PAGE_IDS.has(pageId);
}

export function pageTitle(pageId = "Home") {
  return PAGE_TITLES[pageId] || pageId;
}

export function pageDescription(pageId = "Home") {
  return PAGE_DESCRIPTIONS[pageId] || `Explore ${pageTitle(pageId)} in Robert's Recipe Box for practical recipes, meal planning, cooking, shopping, and kitchen organization guidance.`;
}

export function absoluteSiteUrl(path = "/") {
  return new URL(path, `${SITE_ORIGIN}/`).href;
}

export const INDEXABLE_PAGE_IDS = ROUTABLE_PAGE_IDS.filter(
  (pageId) => !isPrivatePage(pageId) && pageId !== "Under Construction",
);

function upsertMeta(selector, attributes) {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement("meta");
    document.head.appendChild(node);
  }
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
  return node;
}

export function applySeoMetadata({ title, description, path, image, type = "website", noindex = false, structuredData = null }) {
  if (typeof document === "undefined") return;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = absoluteSiteUrl(path);
  const socialImage = absoluteSiteUrl(image || DEFAULT_SOCIAL_IMAGE);
  document.title = fullTitle;
  upsertMeta('meta[name="description"]', { name: "description", content: description });
  upsertMeta('meta[name="robots"]', { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large" });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: fullTitle });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: socialImage });
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: fullTitle });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: socialImage });
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;
  document.getElementById("rrb-structured-data")?.remove();
  if (structuredData) {
    const script = document.createElement("script");
    script.id = "rrb-structured-data";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
}

export function seoForPage(pageId) {
  return {
    title: pageTitle(pageId),
    description: pageDescription(pageId),
    path: routeForPage(pageId),
    noindex: isPrivatePage(pageId),
  };
}

export function seoForRecipe(recipe) {
  const path = routeForRecipe(recipe.id);
  const description = recipe.description || `${recipe.title} recipe with ingredients, serving information, nutrition estimates, and practical cooking details.`;
  const ingredientRows = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const ingredients = ingredientRows.map((item) => typeof item === "string" ? item : [item.amount ?? item.qty, item.unit, item.item || item.name].filter(Boolean).join(" ")).filter(Boolean);
  const minutes = Number(recipe.time || recipe.totalTime || 0);
  const servings = Number(recipe.servings || 0);
  const image = recipe.heroImage || recipe.image || DEFAULT_SOCIAL_IMAGE;
  const structuredData = ingredients.length >= 2 && servings > 0 ? {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    identifier: recipe.id,
    url: absoluteSiteUrl(path),
    image: [absoluteSiteUrl(image)],
    description,
    author: { "@type": "Person", name: "Robert Willeby" },
    recipeYield: `${servings} servings`,
    ...(minutes > 0 ? { totalTime: `PT${minutes}M` } : {}),
    ...(recipe.category ? { recipeCategory: recipe.category } : {}),
    recipeIngredient: ingredients,
  } : null;
  return { title: `${recipe.title} (${recipe.id})`, description, path, image, type: "article", structuredData };
}

export function seoForCompleteDinner(meal) {
  const code = meal.rfisId || meal.code || meal.id;
  const path = routeForCompleteDinner(code);
  return {
    title: `${meal.title} (${code})`,
    description: meal.subtitle || `${meal.title}, a complete dinner combination with a main dish, practical sides, estimated nutrition, and planning guidance.`,
    path,
    image: meal.heroImage || meal.image || DEFAULT_SOCIAL_IMAGE,
    type: "article",
  };
}

export function resolveInitialBrowserRoute() {
  if (typeof window === "undefined") return parseRoute("/");
  const params = new URLSearchParams(window.location.search);
  const fallbackRoute = params.get("route");
  if (fallbackRoute) {
    const restored = normalizeRoutePath(decodeURIComponent(fallbackRoute));
    window.history.replaceState({ rrbRoute: true }, "", restored);
    return parseRoute(restored);
  }
  return parseRoute(window.location.pathname);
}
