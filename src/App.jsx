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
};

const CATEGORY_ICON_IMAGES = {
  AS: "images/icons/icon-asian.png",
  AM: "images/icons/icon-american.png",
  IT: "images/icons/icon-italian.png",
  MX: "images/icons/icon-mexican.png",
  SB: "images/icons/icon-salads-bowls.png",
  SF: "images/icons/icon-seafood.png",
  SG: "images/icons/icon-smoked-grilled.png",
  SD: "images/icons/icon-side-dishes.png",
};

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
  const nav = [
    "Recipes",
    "Collections",
    "Meal Planner",
    "Shopping Lists",
    "Cost Estimator",
    "Favorites",
    "About",
  ];

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

      <nav className="navLinks">
        {nav.map((item) => (
          <button
            key={item}
            className={activePage === item ? "active" : ""}
            onClick={() => setActivePage(item)}
          >
            {item}
          </button>
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
  function openCategory(categoryName) {
    setFilter(categoryName);
    setActivePage("Recipes");
  }

  return (
    <section className="section">
      <div className="sectionTitle">
        <h2>Browse by Category</h2>
        <button onClick={() => setActivePage("Recipes")}>
          View all categories ›
        </button>
      </div>

      <div className="categoryGrid">
        {categories.map((cat) => {
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
                />
              ) : (
                <span className="categoryIcon">{cat.icon}</span>
              )}

              <strong>{cat.name}</strong>
              <small>{cat.count} recipes</small>
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

function FullRecipeCardPreview({ recipe }) {
  const candidates = fullCardImageCandidates(recipe);
  const [imageIndex, setImageIndex] = useState(0);
  const imagePath = candidates[imageIndex];

  useEffect(() => {
    setImageIndex(0);
  }, [recipe.id]);

  if (imagePath) {
    return (
      <div className="recipeImage recipeFullCardImage">
        <img
          src={`${import.meta.env.BASE_URL}${imagePath}`}
          alt={`${recipe.id} ${recipe.title} recipe card`}
          onError={() => setImageIndex((current) => current + 1)}
        />
      </div>
    );
  }

  return <RecipeImage recipe={recipe} />;
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
  return (
    <article className={displayMode === "card" ? "recipeCard recipeCardFullImage" : "recipeCard"}>
      {displayMode === "card" ? (
        <FullRecipeCardPreview recipe={recipe} />
      ) : (
        <RecipeImage recipe={recipe} />
      )}

      <button
        className={`heart ${favorites.includes(recipe.id) ? "saved" : ""}`}
        onClick={() => toggleFavorite(recipe.id)}
        aria-label="Save favorite"
      >
        ♡
      </button>

      <div className="recipeBody">
        <span className={`tag tag-${recipe.categoryCode}`}>
          {recipe.category}
        </span>

        <h3>{recipe.title}</h3>

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
      </div>
    </article>
  );
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

        <div className="cardViewerFooter">
          <span>
            {currentIndex + 1} of {viewerIds.length}
          </span>
          <a
            href={`${import.meta.env.BASE_URL}images/recipes/${recipe.id}.png`}
            target="_blank"
            rel="noreferrer"
          >
            Open full image
          </a>
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
      <FeatureStrip />
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
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedCookingMethod, setSelectedCookingMethod] = useState("");
  const [selectedServingSize, setSelectedServingSize] = useState("");
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
      const matchesCuisine = !selectedCuisine || recipe.category === selectedCuisine;

      let matchesServings = true;
      if (selectedServingSize === '2-4') matchesServings = Number(recipe.servings) <= 4;
      if (selectedServingSize === '4-6') matchesServings = Number(recipe.servings) >= 4 && Number(recipe.servings) <= 6;
      if (selectedServingSize === '6+') matchesServings = Number(recipe.servings) >= 6;

      return matchesQuery && matchesCategory && matchesCuisine && matchesServings;
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
  }, [query, selectedCategory, selectedCuisine, selectedCookingMethod, selectedServingSize, selectedMealType, selectedDietaryNeed, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [query, selectedCategory, selectedCuisine, selectedCookingMethod, selectedServingSize, selectedMealType, selectedDietaryNeed, sortBy]);

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

          <select value={selectedCuisine} onChange={(e) => setSelectedCuisine(e.target.value)}>
            <option value="">All Cuisines</option>
            {categories.map((category) => (
              <option key={`cuisine-${category.id}`} value={category.name}>
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

          <select value={selectedServingSize} onChange={(e) => setSelectedServingSize(e.target.value)}>
            <option value="">All Serving Sizes</option>
            <option value="2-4">2–4 servings</option>
            <option value="4-6">4–6 servings</option>
            <option value="6+">6+ servings</option>
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

function ShoppingListPage({ plan, checked, setChecked, servings }) {
  const list = useMemo(
    () => buildShoppingList(plan, recipes, servings),
    [plan, servings]
  );

  const grouped = list.reduce((acc, item) => {
    return {
      ...acc,
      [item.aisle]: [...(acc[item.aisle] || []), item],
    };
  }, {});

  const total = list.reduce((sum, item) => sum + item.cost, 0);

  function toggleItem(key) {
    setChecked((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  return (
    <main className="pageShell">
      <div className="pageHeader">
        <div>
          <div className="aiBadge">SMART SHOPPING LIST</div>
          <h1>Shopping list</h1>
          <p>
            Auto-generated from your weekly dinner plan and selected serving
            size.
          </p>
        </div>

        <div className="totalBox">
          <small>Estimated Total</small>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title="Your shopping list is empty"
          text="Add recipes to your weekly planner to generate a grocery list."
        />
      ) : (
        <div className="shoppingGrid">
          {Object.entries(grouped).map(([aisle, items]) => (
            <section className="shoppingGroup" key={aisle}>
              <h2>{aisle}</h2>

              {items.map((item) => {
                const key = `${item.name}-${item.unit}-${item.aisle}`;

                return (
                  <label
                    key={key}
                    className={
                      checked[key] ? "checked shoppingItem" : "shoppingItem"
                    }
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
              })}
            </section>
          ))}
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
  const [filter, setFilter] = useState("");
  const [cardViewer, setCardViewer] = useState(null);

  useEffect(() => saveJSON(STORAGE_KEYS.favorites, favorites), [favorites]);
  useEffect(() => saveJSON(STORAGE_KEYS.plan, plan), [plan]);
  useEffect(() => saveJSON(STORAGE_KEYS.servings, servings), [servings]);
  useEffect(() => saveJSON(STORAGE_KEYS.checked, checked), [checked]);

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
  };

  return (
    <div className="app">
      <Header activePage={activePage} setActivePage={setActivePage} />

      {activePage === "Home" && <Home {...pageProps} />}
      {activePage === "Recipes" && <RecipesPage {...pageProps} />}
      {activePage === "Collections" && <CollectionsPage />}
      {activePage === "Meal Planner" && <PlannerPage {...pageProps} />}
      {activePage === "Shopping Lists" && <ShoppingListPage {...pageProps} />}
      {activePage === "Cost Estimator" && <CostEstimatorPage {...pageProps} />}
      {activePage === "Favorites" && <FavoritesPage {...pageProps} />}
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
