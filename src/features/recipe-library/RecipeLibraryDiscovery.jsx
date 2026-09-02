import { useEffect, useMemo, useRef, useState } from "react";
import { recipeHeroImageCandidates } from "../recipe-viewer/recipeAssets.js";
import "./RecipeLibraryDiscovery.css";

const FEATURED_RECIPE_COUNT = 6;
const ROTATION_INTERVAL_MS = 9000;

const CATEGORY_COPY = {
  ALL: {
    title: "Discover Something New",
    text: "Browse a changing selection from across the recipe library, or choose a cuisine or recipe group to focus the ideas.",
  },
  FAVORITES: {
    title: "Your Favorite Recipes",
    text: "Rediscover recipes you have saved and open any card when you are ready to cook, plan, or review it.",
  },
  AM: { title: "American Favorites", text: "Comforting classics, familiar family meals, and practical dishes for everyday home cooking." },
  AS: { title: "Asian-Inspired Recipes", text: "Explore savory stir-fries, noodle dishes, rice bowls, and other flavorful Asian-inspired favorites." },
  IT: { title: "Italian Favorites", text: "Find pasta, sauces, baked dishes, and satisfying Italian-inspired meals for the table." },
  MX: { title: "Mexican-Inspired Recipes", text: "Browse tacos, enchiladas, seasoned meats, and bright, flavorful Mexican-inspired meals." },
  SF: { title: "Seafood Recipes", text: "Choose from fish, shrimp, and other seafood recipes suited to weeknights or special dinners." },
  DM: { title: "Diet Meals", text: "Compare lighter, portion-conscious meals with complete recipe cards and estimated nutrition." },
  QP: { title: "Quiche Recipes", text: "Explore savory quiches and versatile baked dishes for breakfast, lunch, or dinner." },
  CS: { title: "Casseroles", text: "Find dependable oven-ready meals designed for easy serving, sharing, and make-ahead convenience." },
  CP: { title: "Crock Pot Recipes", text: "Discover low-effort slow-cooked meals with tender results and practical make-ahead appeal." },
  SB: { title: "Salads & Bowls", text: "Browse fresh salads, composed bowls, and practical make-ahead choices for lighter meals." },
  SG: { title: "Meats", text: "Explore grilled, smoked, roasted, and skillet-cooked meats for complete meals and meal prep." },
  SD: { title: "Side Dishes", text: "Find vegetables, grains, potatoes, and other practical sides to complete the meal." },
  DS: { title: "Desserts", text: "Browse cakes, pies, fruit desserts, and other sweet finishes for everyday or special occasions." },
};

function shuffledSample(items, count) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

function categoryCodeForRecipe(recipe) {
  return String(recipe?.categoryCode || recipe?.id || "")
    .split("-")[0]
    .toUpperCase();
}

function recipeMatchesChoice(recipe, choice, favorites) {
  if (!choice || choice.id === "ALL") return true;
  if (choice.id === "FAVORITES") return favorites.includes(recipe.id);
  return categoryCodeForRecipe(recipe) === choice.id;
}

function displayTitleParts(title) {
  const match = String(title || "").match(/^(.*?)\s+(with\b.*)$/i);
  return {
    title: match?.[1] || title,
    subtitle: match?.[2] ? match[2].replace(/^with/i, "With") : "",
  };
}

function LibraryRecipeHero({ recipe }) {
  const candidates = recipeHeroImageCandidates(recipe);
  const [imageIndex, setImageIndex] = useState(0);
  const imagePath = candidates[imageIndex];

  useEffect(() => {
    setImageIndex(0);
  }, [recipe.id]);

  if (!imagePath) return null;

  return (
    <img
      className="libraryDiscoveryHeroImage"
      src={`${import.meta.env.BASE_URL}${imagePath}`}
      alt={recipe.title}
      loading="eager"
      decoding="async"
      onError={() => setImageIndex((current) => current + 1)}
    />
  );
}

function FeaturedRecipeCard({
  recipe,
  favorites,
  toggleFavorite,
  openRecipeCard,
  cardList,
  getCalories,
  getMealBalanceScore,
  cardContextLabel = "Browse Our Recipe Library",
}) {
  const isFavorite = favorites.includes(recipe.id);
  const calories = getCalories(recipe);
  const mealBalance = getMealBalanceScore(recipe);
  const titleParts = displayTitleParts(recipe.title);

  return (
    <article className="libraryDiscoveryRecipeCard">
      <button
        type="button"
        className="libraryDiscoveryRecipeOpen"
        onClick={() => openRecipeCard(recipe.id, cardList, cardContextLabel)}
        aria-label={`Open ${recipe.title}`}
      >
        <span className="libraryDiscoveryRecipeHero">
          <LibraryRecipeHero recipe={recipe} />
        </span>
        <span className="libraryDiscoveryRecipeText">
          <strong>{titleParts.title}</strong>
          <small className="libraryDiscoveryRecipeMeta">
            {Number.isFinite(calories) && calories > 0
              ? `${Math.round(calories)} calories`
              : recipe.time
                ? `${recipe.time} minutes`
                : "Calories pending"}
          </small>
          <span
            className={`libraryDiscoveryMealBalance${mealBalance === null ? " unrated" : ""}`}
            title={mealBalance === null ? "MealBalance not yet rated" : `MealBalance ${mealBalance}`}
            aria-label={mealBalance === null ? "MealBalance not yet rated" : `MealBalance ${mealBalance}`}
          >
            {mealBalance === null ? "—" : mealBalance}
          </span>
        </span>
      </button>
      <button
        type="button"
        className={`libraryDiscoveryFavorite${isFavorite ? " saved" : ""}`}
        onClick={() => toggleFavorite(recipe.id)}
        aria-label={isFavorite ? `Remove ${recipe.title} from favorites` : `Add ${recipe.title} to favorites`}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <span aria-hidden="true">♥</span>
      </button>
    </article>
  );
}

export default function RecipeLibraryDiscovery({
  choices,
  selectedChoiceId,
  onSelectChoice,
  recipes,
  favorites = [],
  toggleFavorite,
  openRecipeCard,
  getCalories,
  getMealBalanceScore,
  copyByChoice = CATEGORY_COPY,
  rotationRecipes = null,
  rotateAcrossAll = false,
  ariaLabel = "Select a recipe cuisine or category",
  cardContextLabel = "Browse Our Recipe Library",
}) {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [rotatingPosition, setRotatingPosition] = useState(null);
  const [paused, setPaused] = useState(false);
  const rotationPositionRef = useRef(0);
  const favoriteIds = useMemo(() => (Array.isArray(favorites) ? favorites : []), [favorites]);
  const selectedChoice = choices.find((choice) => choice.id === selectedChoiceId) || choices[0];
  const rotationChoiceId = rotateAcrossAll ? "ALL" : selectedChoice?.id;
  const selectedCopy = copyByChoice[selectedChoice?.id] || {
    title: selectedChoice?.displayName || "Browse Recipes",
    text: `Explore recipe ideas from the ${selectedChoice?.displayName || "selected"} collection.`,
  };
  const matchingRecipes = useMemo(
    () => (rotationRecipes || recipes).filter(
      (recipe) => recipeHeroImageCandidates(recipe).length > 0
        && recipeMatchesChoice(recipe, { id: rotationChoiceId }, favoriteIds),
    ),
    [favoriteIds, recipes, rotationChoiceId, rotationRecipes],
  );

  useEffect(() => {
    setFeaturedRecipes(shuffledSample(matchingRecipes, FEATURED_RECIPE_COUNT));
    setRotatingPosition(null);
    rotationPositionRef.current = 0;
  }, [matchingRecipes]);

  useEffect(() => {
    if (paused || matchingRecipes.length <= FEATURED_RECIPE_COUNT) return undefined;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reducedMotion) return undefined;

    const timer = window.setInterval(() => {
      setFeaturedRecipes((current) => {
        if (!current.length) return shuffledSample(matchingRecipes, FEATURED_RECIPE_COUNT);
        const position = rotationPositionRef.current % current.length;
        const currentIds = new Set(current.map((recipe) => recipe.id));
        const candidates = matchingRecipes.filter((recipe) => !currentIds.has(recipe.id));
        if (!candidates.length) return current;
        const replacement = candidates[Math.floor(Math.random() * candidates.length)];
        const updated = [...current];
        updated[position] = replacement;
        rotationPositionRef.current = (position + 1) % current.length;
        setRotatingPosition(position);
        window.setTimeout(() => setRotatingPosition(null), 650);
        return updated;
      });
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [matchingRecipes, paused]);

  return (
    <section
      className="recipeLibraryDiscovery"
      aria-labelledby="recipe-library-discovery-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <header className="recipeLibraryDiscoveryIntro" aria-live="polite">
        <h2 id="recipe-library-discovery-title">{selectedCopy.title}</h2>
        <p>{selectedCopy.text}</p>
      </header>

      <nav className="libraryCategorySelectorRow" aria-label={ariaLabel}>
        {choices.map((choice) => (
          <button
            type="button"
            key={choice.id}
            className={`libraryCategorySelectorItem category-${String(choice.id || "all").toLowerCase()}${choice.id === selectedChoice?.id ? " active" : ""}`}
            onClick={() => onSelectChoice(choice)}
            aria-pressed={choice.id === selectedChoice?.id}
          >
            {choice.iconImage ? (
              <img src={`${import.meta.env.BASE_URL}${choice.iconImage}`} alt="" aria-hidden="true" />
            ) : (
              <span className="libraryCategorySelectorAll" aria-hidden="true">ALL</span>
            )}
            <strong>{String(choice.displayName || "").toUpperCase()}</strong>
          </button>
        ))}
      </nav>

      <div className="recipeLibraryDiscoveryGrid">
        {featuredRecipes.map((recipe, position) => (
          <div
            className={`libraryDiscoveryRecipeSlot${rotatingPosition === position ? " isChanging" : ""}`}
            key={`library-feature-${position}`}
          >
            <FeaturedRecipeCard
              key={recipe.id}
              recipe={recipe}
              favorites={favoriteIds}
              toggleFavorite={toggleFavorite}
              openRecipeCard={openRecipeCard}
              cardList={matchingRecipes}
              getCalories={getCalories}
              getMealBalanceScore={getMealBalanceScore}
              cardContextLabel={cardContextLabel}
            />
          </div>
        ))}

        {!featuredRecipes.length && selectedChoice?.id === "FAVORITES" && (
          <div className="libraryDiscoveryEmpty">
            <strong>No saved recipes yet.</strong>
            <span>Use the heart on a recipe to add it to Favorites.</span>
          </div>
        )}

        {!featuredRecipes.length && selectedChoice?.id !== "FAVORITES" && (
          <div className="libraryDiscoveryEmpty">
            <strong>No recipes are available in this selection yet.</strong>
            <span>Choose another category to keep browsing.</span>
          </div>
        )}
      </div>
    </section>
  );
}
