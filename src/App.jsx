import { useMemo, useState, useEffect } from "react";
import { categories, recipes } from "./data/recipes";
import { loadJSON, saveJSON } from "./utils/storage";
import {
  buildShoppingList,
  planCost,
  scaleCost,
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
  AM: "images/icons/icon-american.png",
  AS: "images/icons/icon-asian.png",
  CC: "images/icons/icon-cheesecakes.png",
  CO: "images/icons/icon-cobblers.png",
  CR: "images/icons/icon-cinnamon-rolls.png",
  DN: "images/icons/icon-donuts.png",
  DS: "images/icons/icon-desserts.png",
  HB: "images/icons/icon-hamburgers.png",
  HBP: "images/icons/icon-hamburger-patties.png",
  IT: "images/icons/icon-italian.png",
  JJ: "images/icons/icon-jams-jellies.png",
  KR: "images/icons/icon-kolaches.png",
  LF: "images/icons/icon-loafs-rolls.png",
  MR: "images/icons/icon-marinades.png",
  MX: "images/icons/icon-mexican.png",
  PM: "images/icons/icon-protein-muffins.png",
  QP: "images/icons/icon-quiche-pies.png",
  RS: "images/icons/icon-rubs-seasonings.png",
  SB: "images/icons/icon-salads-bowls.png",
  SD: "images/icons/icon-side-dishes.png",
  SF: "images/icons/icon-seafood.png",
  SG: "images/icons/icon-smoked-grilled.png",
  SW: "images/icons/icon-sandwiches.png",
};

const HOME_CATEGORY_CODES = [
  "AM",
  "AS",
  "CC",
  "CO",
  "CR",
  "DN",
  "DS",
  "HB",
  "IT",
  "JJ",
  "KR",
  "LF",
  "MX",
  "PM",
  "QP",
  "SB",
  "SD",
  "SF",
  "SG",
  "SW",
];

const HOME_CATEGORY_FALLBACKS = {
  AM: { id: "AM", name: "American Cuisine", count: 0, icon: "🇺🇸" },
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
  SB: { id: "SB", name: "Salads & Bowls", count: 0, icon: "🥗" },
  SD: { id: "SD", name: "Side Dishes", count: 0, icon: "🍲" },
  SF: { id: "SF", name: "Seafood Dishes", count: 0, icon: "🐟" },
  SG: { id: "SG", name: "Smoked & Grilled Meats", count: 0, icon: "🔥" },
  SW: { id: "SW", name: "Sandwiches", count: 0, icon: "🥪" },
};

const PANTRY_STAPLES = [
  {
    group: "Spices & Seasonings",
    items: [
      "Salt",
      "Black pepper",
      "Garlic powder",
      "Onion powder",
      "Paprika",
      "Chili powder",
      "Italian seasoning",
      "Dried oregano",
      "Cinnamon",
      "Taco seasoning",
    ],
  },
  {
    group: "Oils, Vinegars & Cooking Basics",
    items: [
      "Olive oil",
      "Vegetable oil",
      "Cooking spray",
      "Butter",
      "White vinegar",
      "Apple cider vinegar",
      "Flour",
      "Cornstarch",
      "Sugar",
      "Brown sugar",
    ],
  },
  {
    group: "Sauces & Condiments",
    items: [
      "Soy sauce",
      "Worcestershire sauce",
      "Ketchup",
      "Mustard",
      "Mayonnaise",
      "BBQ sauce",
      "Hot sauce",
      "Salsa",
      "Honey",
      "Maple syrup",
    ],
  },
  {
    group: "Rice, Pasta & Grains",
    items: [
      "White rice",
      "Brown rice",
      "Pasta",
      "Egg noodles",
      "Breadcrumbs",
      "Rolled oats",
      "Tortillas",
      "Crackers",
    ],
  },
  {
    group: "Canned & Jarred Goods",
    items: [
      "Chicken broth",
      "Beef broth",
      "Cream of chicken soup",
      "Cream of mushroom soup",
      "Diced tomatoes",
      "Tomato sauce",
      "Tomato paste",
      "Black beans",
      "Pinto beans",
      "Corn",
    ],
  },
  {
    group: "Freezer & Refrigerator Basics",
    items: [
      "Frozen vegetables",
      "Frozen broccoli",
      "Frozen corn",
      "Shredded cheese",
      "Eggs",
      "Milk",
      "Sour cream",
      "Cream cheese",
      "Parmesan cheese",
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
  { pantry: "Cinnamon", terms: ["cinnamon"] },
  { pantry: "Taco seasoning", terms: ["taco seasoning"] },
  { pantry: "Olive oil", terms: ["olive oil"] },
  { pantry: "Vegetable oil", terms: ["vegetable oil", "oil"] },
  { pantry: "Cooking spray", terms: ["cooking spray"] },
  { pantry: "Butter", terms: ["butter"] },
  { pantry: "White vinegar", terms: ["white vinegar", "vinegar"] },
  { pantry: "Apple cider vinegar", terms: ["apple cider vinegar"] },
  { pantry: "Flour", terms: ["flour"] },
  { pantry: "Cornstarch", terms: ["cornstarch"] },
  { pantry: "Sugar", terms: ["sugar"] },
  { pantry: "Brown sugar", terms: ["brown sugar"] },
  { pantry: "Soy sauce", terms: ["soy sauce"] },
  { pantry: "Worcestershire sauce", terms: ["worcestershire"] },
  { pantry: "Ketchup", terms: ["ketchup"] },
  { pantry: "Mustard", terms: ["mustard"] },
  { pantry: "Mayonnaise", terms: ["mayonnaise", "mayo"] },
  { pantry: "BBQ sauce", terms: ["bbq sauce", "barbecue sauce"] },
  { pantry: "Hot sauce", terms: ["hot sauce"] },
  { pantry: "Salsa", terms: ["salsa"] },
  { pantry: "Honey", terms: ["honey"] },
  { pantry: "Maple syrup", terms: ["maple syrup"] },
  { pantry: "White rice", terms: ["white rice", "rice"] },
  { pantry: "Brown rice", terms: ["brown rice"] },
  { pantry: "Pasta", terms: ["pasta", "spaghetti", "penne", "fettuccine"] },
  { pantry: "Egg noodles", terms: ["egg noodles"] },
  { pantry: "Breadcrumbs", terms: ["breadcrumbs", "bread crumbs"] },
  { pantry: "Rolled oats", terms: ["oats", "rolled oats"] },
  { pantry: "Tortillas", terms: ["tortilla", "tortillas"] },
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
  { pantry: "Frozen vegetables", terms: ["frozen vegetables", "mixed vegetables"] },
  { pantry: "Frozen broccoli", terms: ["frozen broccoli"] },
  { pantry: "Frozen corn", terms: ["frozen corn"] },
  { pantry: "Shredded cheese", terms: ["shredded cheese", "cheese"] },
  { pantry: "Eggs", terms: ["eggs"] },
  { pantry: "Milk", terms: ["milk"] },
  { pantry: "Sour cream", terms: ["sour cream"] },
  { pantry: "Cream cheese", terms: ["cream cheese"] },
  { pantry: "Parmesan cheese", terms: ["parmesan"] },
];

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

const AUTO_IMAGE_PREFIXES = new Set(["AS", "CC", "CO", "CR", "DN", "HB", "HBP", "IT"]);

const HERO_IMAGES = [
  "images/heroes/hero-grill-wide.png",
  "images/heroes/hero-pasta-wide.png",
  "images/heroes/hero-salad-wide.png",
  "images/heroes/hero-brisket-wide.png",
  "images/heroes/hero-cake-wide.png",
  "images/heroes/hero-shrimp-wide.png",
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

  if (recipe.heroImage) {
    candidates.push(recipe.heroImage);
  }

  if (recipe.image) {
    candidates.push(recipe.image);
  }

  const prefix = recipeCodePrefix(recipe.id);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/heroes/${recipe.id}.png`);
    candidates.push(`images/recipes/${recipe.id}.png`);
  }

  return [...new Set(candidates)];
}

function fullCardImageCandidates(recipe) {
  const candidates = [];

  if (recipe.cardImage) {
    candidates.push(recipe.cardImage);
  }

  if (recipe.image) {
    candidates.push(recipe.image);
  }

  const prefix = recipeCodePrefix(recipe.id);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/recipes/${recipe.id}.png`);
  }

  if (recipe.heroImage) {
    candidates.push(recipe.heroImage);
  }

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/heroes/${recipe.id}.png`);
  }

  return [...new Set(candidates)];
}

function Header({ activePage, setActivePage }) {
  const navGroups = [
    {
      label: "About",
      items: [
        { label: "About the Project", page: "About" },
      ],
    },
    {
      label: "Recipes",
      items: [
        { label: "Browse Recipes", page: "Recipes" },
        { label: "Collections", page: "Collections" },
        { label: "Two-Week Meal Planner", page: "Meal Planner" },
      ],
    },
    {
      label: "Shopping",
      items: [
        { label: "Shopping Lists", page: "Shopping Lists" },
        { label: "Pantry Staples", page: "Pantry Staples" },
        { label: "Cost Estimator", page: "Cost Estimator" },
      ],
    },
    {
      label: "Favorites",
      items: [
        { label: "Saved Recipes", page: "Favorites" },
      ],
    },
    {
      label: "Recommendations",
      items: [
        { label: "Kitchen Tools & Products", page: "Recommendations" },
        { label: "Helpful Videos & Channels", page: "Recommendations" },
        { label: "Storage & Organization", page: "Recommendations" },
        { label: "Social Pages I Follow", page: "Recommendations" },
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
              {group.items.map((item) => (
                <button
                  key={item.page}
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
        <span>♡</span>
        <span className="avatar">◉ Robert⌄</span>
      </div>
    </header>
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
          and estimate food costs.
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
        </div>
      </div>

      <div className="heroPhoto">
        <div className="statsCard">
          <div>
            <span>👨‍🍳</span>
            <strong>400+</strong>
            <small>AI Recipes</small>
          </div>
          <div>
            <span>♡</span>
            <strong>50+</strong>
            <small>Favorites</small>
          </div>
          <div>
            <span>▣</span>
            <strong>AI Meal</strong>
            <small>Planner</small>
          </div>
          <div>
            <span>🛒</span>
            <strong>Smart Lists</strong>
            <small>& Cost Estimator</small>
          </div>
        </div>
      </div>
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
  const homeCategories = HOME_CATEGORY_CODES.map((code) => ({
    ...HOME_CATEGORY_FALLBACKS[code],
    ...(categoryLookup.get(code) || {}),
  }));

  function openCategory(categoryName) {
    setFilter(categoryName);
    setActivePage("Recipes");
  }

  return (
    <section className="section homeCategorySection">
      <div className="sectionTitle homeCategoryTitle">
        <h2>Browse by Category</h2>
        <button onClick={() => setActivePage("Recipes")}>
          View all categories ›
        </button>
      </div>

      <div className="categoryGrid homeCategoryGrid">
        {homeCategories.map((cat) => {
          const iconPath = cat.iconImage || CATEGORY_ICON_IMAGES[cat.id];

          return (
            <button
              key={cat.id}
              className="categoryTile"
              onClick={() => openCategory(cat.name)}
              aria-label={`View ${cat.name} recipes`}
            >
              {iconPath ? (
                <img
                  className="categoryIconImage"
                  src={`${import.meta.env.BASE_URL}${iconPath}`}
                  alt={`${cat.name} icon`}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                    const fallback = event.currentTarget.nextElementSibling;
                    if (fallback) fallback.style.display = "grid";
                  }}
                />
              ) : null}

              <span className="categoryIcon categoryIconFallback">{cat.icon}</span>

              <strong>{cat.id}</strong>
              <small>{cat.name}</small>
            </button>
          );
        })}
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
  const candidates = fullCardImageCandidates(recipe);
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

function RecipeCard({
  recipe,
  favorites,
  toggleFavorite,
  addToPlan,
  openRecipeCard,
  cardList = recipes,
  showPlannerButton = true,
  viewButtonText = "View Recipe Card",
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

function RecipeCardViewer({ viewer, onClose, setViewer, favorites, toggleFavorite }) {
  const [imageIndex, setImageIndex] = useState(0);

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
  }, [recipe?.id]);

  if (!viewer || !recipe) return null;

  const isFavorite = favorites.includes(recipe.id);
  const imageCandidates = fullCardImageCandidates(recipe);
  const imagePath = imageCandidates[imageIndex];
  const hasMultiple = viewerIds.length > 1;

  function goToOffset(offset) {
    if (!hasMultiple) return;

    const nextIndex =
      (currentIndex + offset + viewerIds.length) % viewerIds.length;

    setViewer({
      recipeId: viewerIds[nextIndex],
      recipeIds: viewerIds,
    });
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
      <div className="cardViewer" onClick={(event) => event.stopPropagation()}>
        <div className="cardViewerHeader">
          <div>
            <span className="cardViewerCode">{recipe.id}</span>
            <h2>{recipe.title}</h2>
          </div>

          <div className="cardViewerHeaderActions">
            <button
              className={isFavorite ? "cardViewerFavorite saved" : "cardViewerFavorite"}
              onClick={() => toggleFavorite(recipe.id)}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              ♥
            </button>

            <button className="cardViewerClose" onClick={onClose}>
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

        <div className="cardViewerFooter">
          <span>
            {currentIndex + 1} of {viewerIds.length}
          </span>

          <div className="cardViewerFooterActions">
            <button
              className="cardViewerPrint"
              onClick={printCurrentCard}
              disabled={!imagePath}
            >
              Print this card
            </button>

            <button
              className="cardViewerDownload"
              onClick={downloadCurrentCard}
              disabled={!imagePath}
            >
              Download this card
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
    const filteredRecipes =
      selectedCategory === "MASTER_RANDOM"
        ? recipes
        : recipes.filter((recipe) => recipe.category === selectedCategory);

    return getRandomRecipes(filteredRecipes, 12);
  }, [selectedCategory]);

  const activeRecipe = rolodexRecipes[activeIndex] || rolodexRecipes[0];
  const imageCandidates = activeRecipe ? fullCardImageCandidates(activeRecipe) : [];
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

      const matchesCategory = !selectedCategory || recipe.category === selectedCategory;
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

function PlannerPage({ plan, setPlan, servings, setServings, favorites, toggleFavorite, openRecipeCard }) {
  const normalizedPlan = useMemo(() => normalizeTwoWeekPlan(plan), [plan]);
  const [selectedSlot, setSelectedSlot] = useState("week1-Mon");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPlannerRecipes = useMemo(() => {
    if (selectedCategory === "All") return recipes;

    return recipes.filter((recipe) => {
      return (
        recipe.category === selectedCategory ||
        recipe.categoryCode === selectedCategory ||
        recipe.id?.startsWith(`${selectedCategory}-`)
      );
    });
  }, [selectedCategory]);

  const totalMeals = plannedMealCount(normalizedPlan);
  const estimatedTotal = planCost(normalizedPlan, recipes, servings);

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
            Plan dinners for two weeks, build one combined shopping list, and estimate your total grocery cost.
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
                                  <small>
                                    Est. ${scaleCost(recipe, servings).toFixed(2)}
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

          <section className="plannerSideCard plannerStatCard">
            <h2>Estimated Cost</h2>
            <small>For both weeks</small>
            <strong>${estimatedTotal.toFixed(2)}</strong>
            <span>{servings} servings per meal</span>
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
  const totalStaples = PANTRY_STAPLES.reduce(
    (sum, group) => sum + group.items.length,
    0
  );
  const checkedCount = Object.values(pantry).filter(Boolean).length;

  function togglePantryItem(item) {
    setPantry((current) => ({
      ...current,
      [item]: !current[item],
    }));
  }

  function clearPantry() {
    setPantry({});
  }

  function checkCommonStaples() {
    const commonStaples = [
      "Salt",
      "Black pepper",
      "Garlic powder",
      "Onion powder",
      "Olive oil",
      "Vegetable oil",
      "Butter",
      "Flour",
      "Sugar",
      "Soy sauce",
      "Ketchup",
      "Mustard",
      "White rice",
      "Pasta",
      "Chicken broth",
      "Eggs",
      "Milk",
    ];

    setPantry((current) => {
      const next = { ...current };
      commonStaples.forEach((item) => {
        next[item] = true;
      });
      return next;
    });
  }

  return (
    <main className="pageShell pantryPage">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">SMART SHOPPING LIST SETUP</div>
          <h1>PANTRY STAPLES</h1>
          <p>
            Check off the staples you already keep in stock. Matching items will
            show as already in pantry on your shopping list and will not be added
            to your grocery total.
          </p>
        </div>

        <div className="totalBox">
          <small>Marked In Stock</small>
          <strong>
            {checkedCount}/{totalStaples}
          </strong>
        </div>
      </div>

      <div className="pantryActions">
        <button className="primary" onClick={checkCommonStaples}>
          Check common staples
        </button>
        <button className="secondary" onClick={clearPantry}>
          Clear pantry checks
        </button>
      </div>

      <div className="pantryGrid">
        {PANTRY_STAPLES.map((group) => (
          <section className="pantryGroup" key={group.group}>
            <h2>{group.group}</h2>

            {group.items.map((item) => (
              <label
                key={item}
                className={pantry[item] ? "pantryItem checked" : "pantryItem"}
              >
                <input
                  type="checkbox"
                  checked={!!pantry[item]}
                  onChange={() => togglePantryItem(item)}
                />
                <span>{item}</span>
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

  const total = needed.reduce((sum, item) => sum + item.cost, 0);

  function toggleItem(key) {
    setChecked((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function renderNeededItem(item) {
    const key = `${item.name}-${item.unit}-${item.aisle}`;

    return (
      <label
        key={key}
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
        <em>${item.cost.toFixed(2)}</em>
      </label>
    );
  }

  function renderPantryItem(item) {
    const key = `${item.name}-${item.unit}-${item.aisle}-pantry`;

    return (
      <div key={key} className="shoppingItem pantryShoppingItem">
        <span className="pantryFilledBox" aria-hidden="true" />
        <span>{item.name}</span>
        <small>
          {formatQty(item.qty)} {item.unit}
        </small>
        <em>In pantry</em>
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
            are filled in black and are not included in the grocery total.
          </p>
        </div>

        <div className="totalBox">
          <small>Needed Items Total</small>
          <strong>${total.toFixed(2)}</strong>
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
                <p>Open boxes are added to your grocery shopping list.</p>
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
                <p>Filled black boxes are pantry staples and are not added to the grocery total.</p>
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

function CostEstimatorPage({ plan, servings, setServings }) {
  const selected = Object.entries(plan)
    .flatMap(([day, ids]) =>
      ids.map((id) => ({
        day,
        recipe: recipes.find((r) => r.id === id),
      }))
    )
    .filter((x) => x.recipe);

  const totals = [2, 4, 6].map((n) => ({
    servings: n,
    total: planCost(plan, recipes, n),
  }));

  return (
    <main className="pageShell">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">TWO-WEEK COST ESTIMATOR</div>
          <h1>Estimated food costs</h1>
          <p>
            Compare approximate two-week totals for servings of 2, 4, and 6. Actual
            grocery prices may vary.
          </p>
        </div>

        <ServingSelector servings={servings} setServings={setServings} />
      </div>

      <div className="costCards">
        {totals.map((t) => (
          <div
            className={
              servings === t.servings ? "costCard selected" : "costCard"
            }
            key={t.servings}
          >
            <small>{t.servings} servings</small>
            <strong>${t.total.toFixed(2)}</strong>
            <span>{selected.length || 0} planned meals</span>
          </div>
        ))}
      </div>

      <section className="costTable">
        <h2>Meal cost details</h2>

        {selected.length === 0 ? (
          <EmptyState
            title="No meals selected"
            text="Add recipes to your meal planner to estimate costs."
          />
        ) : (
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Recipe</th>
                <th>2 servings</th>
                <th>4 servings</th>
                <th>6 servings</th>
              </tr>
            </thead>

            <tbody>
              {selected.map(({ day, recipe }, i) => (
                <tr key={`${day}-${recipe.id}-${i}`}>
                  <td>{plannerSlotLabel(day)}</td>
                  <td>{recipe.title}</td>
                  <td>${scaleCost(recipe, 2).toFixed(2)}</td>
                  <td>${scaleCost(recipe, 4).toFixed(2)}</td>
                  <td>${scaleCost(recipe, 6).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
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

function RecommendationsPage() {
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
            <button type="button">Coming soon</button>
          </article>
        ))}
      </div>

    </main>
  );
}

function AboutPage() {
  return (
    <main className="pageShell">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">ABOUT THE PROJECT</div>
          <h1>AI-generated planning tools, not private recipes</h1>
          <p>
            Robert’s Recipe Box is a practical recipe planning library. Recipes
            and collections are AI-generated to help users browse ideas, plan
            meals, build shopping lists, and estimate costs.
          </p>
        </div>
      </div>

      <div className="aboutCard">
        <h2>Browser-based first version</h2>
        <p>
          Favorites, weekly plans, shopping list checks, and serving size are
          saved using your browser’s local storage. They stay on this browser
          and are not synced across devices.
        </p>
        <p>
          This keeps the first GitHub Pages version simple, fast, and easy to
          maintain. A login-based version can be added later.
        </p>
      </div>
    </main>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="emptyState">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
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
      title: "Grocery Store List",
      text: "Estimate your grocery costs from your weekly menu.",
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
      {activePage === "Cost Estimator" && <CostEstimatorPage {...pageProps} />}
      {activePage === "Favorites" && <FavoritesPage {...pageProps} />}
      {activePage === "Recommendations" && <RecommendationsPage />}
      {activePage === "About" && <AboutPage />}

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
