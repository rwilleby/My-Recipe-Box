import { useEffect, useMemo, useRef, useState } from "react";
import VideoIcon from "../../components/VideoIcon";
import { dinnerCombinations } from "../../data/dinnerCombinations.js";
import { sortRecipesByCode } from "../../utils/recipeSorting";
import {
  HOME_COMBO_MEAL_COUNT,
  hasQuickDinnerHero,
  selectVariedHomeComboMeals,
} from "../../utils/homeQuickDinnerRotation.js";
import { uniqueRecordsByPermanentId } from "../../utils/records.js";

const DINNER_IDEAS_VIDEO_URL = "videos/dinner-ideas.mp4";
const DINNER_IDEAS_VIDEO_POSTER = "images/video-posters/dinner-ideas-poster.webp";

export function createHomeMealRotations({
  DinnerCombinationImage,
  getComboMealBalanceScore,
  FeaturedComboMealModal,
  FeaturedComboMealCardModal,
  SectionIntro,
  SupplementalHoverVideo,
  getHealthyDinnerCalories,
  getMealBalanceScore,
  HEALTHY_DINNERS_VIDEO_URL,
  HEALTHY_DINNERS_VIDEO_POSTER,
}) {
const HOME_COMBO_ROTATION_MS = 60 * 1000;
const HOME_COMBO_PAUSE_MS = 650;
const HOME_COMBO_CROSSFADE_MS = 1200;

function HomeComboMealCardButton({ meal, className = "", onOpen, imageLoading = "eager" }) {
  return (
    <button
      type="button"
      className={`homeComboMealCard ${className}`.trim()}
      onClick={() => onOpen(meal)}
      aria-label={`Open combo meal ${meal.number}: ${meal.title}`}
    >
      <div className="homeComboMealImage">
        <DinnerCombinationImage
          meal={meal}
          className="homeComboMealImageAsset"
          loading={imageLoading}
        />
      </div>

      <span className="homeComboMealText">
        <strong>{meal.title}</strong>
        <small>{meal.subtitle}</small>
        <span
          className="homeComboMealBalanceBadge"
          title={`MealBalance ${getComboMealBalanceScore(meal)}`}
          aria-label={`MealBalance ${getComboMealBalanceScore(meal)}`}
        >
          {getComboMealBalanceScore(meal)}
        </span>
      </span>
    </button>
  );
}

function HomeComboMealImageCrossfadeCard({ transition, onOpen }) {
  if (!transition?.from || !transition?.to) return null;

  return (
    <div
      className="homeComboMealFullCrossfadeStage"
      aria-label={`Changing from ${transition.from.title} to ${transition.to.title}`}
    >
      <HomeComboMealCardButton
        meal={transition.from}
        className="homeComboMealFullCardOutgoing"
        onOpen={onOpen}
        imageLoading="eager"
      />
      <HomeComboMealCardButton
        meal={transition.to}
        className="homeComboMealFullCardIncoming"
        onOpen={onOpen}
        imageLoading="eager"
      />
    </div>
  );
}

function HomeComboMealStrip({
  setActivePage,
  openRecipeCard,
  favorites,
  toggleFavorite,
  setPlan,
  siteMode = "detailed",
}) {
  const allHomeComboMeals = useMemo(
    () => uniqueRecordsByPermanentId(dinnerCombinations).filter(hasQuickDinnerHero),
    []
  );
  const [homeComboMeals, setHomeComboMeals] = useState(() =>
    selectVariedHomeComboMeals(allHomeComboMeals)
  );
  const [crossfades, setCrossfades] = useState({});
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedMealCard, setSelectedMealCard] = useState(null);
  const staggerTimersRef = useRef([]);

  useEffect(() => {
    function clearStaggerTimers() {
      staggerTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      staggerTimersRef.current = [];
    }

    function rotateComboMeals() {
      clearStaggerTimers();

      setHomeComboMeals((currentMeals) => {
        const nextMeals = selectVariedHomeComboMeals(allHomeComboMeals, currentMeals);

        function transitionPosition(position) {
          if (position >= nextMeals.length) return;

          const fromMeal = currentMeals[position];
          const nextMeal = nextMeals[position];

          if (!fromMeal || !nextMeal || fromMeal.id === nextMeal.id) {
            const skipTimer = window.setTimeout(
              () => transitionPosition(position + 1),
              HOME_COMBO_PAUSE_MS,
            );
            staggerTimersRef.current.push(skipTimer);
            return;
          }

          setCrossfades((current) => ({
            ...current,
            [position]: { from: fromMeal, to: nextMeal },
          }));

          const finishTimer = window.setTimeout(() => {
            setHomeComboMeals((current) => {
              const updated = [...current];
              updated[position] = nextMeal;
              return updated;
            });

            const settleTimer = window.setTimeout(() => {
              window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                  setCrossfades((current) => {
                    const updated = { ...current };
                    delete updated[position];
                    return updated;
                  });

                  const pauseTimer = window.setTimeout(
                    () => transitionPosition(position + 1),
                    HOME_COMBO_PAUSE_MS,
                  );
                  staggerTimersRef.current.push(pauseTimer);
                });
              });
            }, 120);

            staggerTimersRef.current.push(settleTimer);
          }, HOME_COMBO_CROSSFADE_MS);

          staggerTimersRef.current.push(finishTimer);
        }

        transitionPosition(0);
        return currentMeals;
      });
    }

    const rotationTimer = window.setInterval(rotateComboMeals, HOME_COMBO_ROTATION_MS);

    return () => {
      window.clearInterval(rotationTimer);
      clearStaggerTimers();
    };
  }, [allHomeComboMeals]);

  if (!homeComboMeals.length) return null;

  return (
    <>
      <section className="section homeComboMealStrip" aria-label="Complete meal ideas">
        <SectionIntro
          title="Looking for Quick Dinner Ideas?"
          className="homeComboMealStripHeader quickDinnerSectionIntro"
          video={
            <SupplementalHoverVideo
              src={DINNER_IDEAS_VIDEO_URL}
              poster={DINNER_IDEAS_VIDEO_POSTER}
              title="Quick Dinner Ideas overview video"
              className="homeDinnerIdeasVideoTrigger"
            >
              <span className="supplementalVideoIcon">
                <VideoIcon role="supplemental" alt="" className="supplementalVideoIconGray" />
                <VideoIcon role="main" alt="" className="supplementalVideoIconRed" />
              </span>
            </SupplementalHoverVideo>
          }
          text={
            <>
              Ready-made dinner combinations that pair a main dish with practical sides.{" "}
              <button
                type="button"
                className="homeComboMealMoreIdeas"
                onClick={() => setActivePage("Dinner Combinations")}
              >
                (More ideas)
              </button>
            </>
          }
        />

        <div className="homeComboMealGrid" data-site-mode={siteMode}>
          {(siteMode === "easy" ? homeComboMeals.slice(0, 4) : homeComboMeals).map((meal, position) => {
            const transition = crossfades[position];
            const activeMeal = transition?.to || meal;
            const isFavorite = Array.isArray(favorites) && favorites.includes(activeMeal.id);

            return (
              <div
                className={transition ? "homeComboMealCardWrap isCrossfading" : "homeComboMealCardWrap"}
                key={`home-combo-position-${position}`}
              >
                {transition ? (
                  <HomeComboMealImageCrossfadeCard
                    transition={transition}
                    onOpen={setSelectedMeal}
                  />
                ) : (
                  <HomeComboMealCardButton meal={meal} onOpen={setSelectedMeal} />
                )}

                <button
                  type="button"
                  className={isFavorite ? "homeComboMealFavorite saved" : "homeComboMealFavorite"}
                  onClick={() => toggleFavorite(activeMeal.id)}
                  aria-label={isFavorite ? `Remove ${activeMeal.title} from favorites` : `Add ${activeMeal.title} to favorites`}
                  title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <span aria-hidden="true">♥</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <FeaturedComboMealModal
        meal={selectedMeal}
        onClose={() => setSelectedMeal(null)}
        onViewMeal={setSelectedMealCard}
        openRecipeCard={openRecipeCard}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />

      <FeaturedComboMealCardModal
        meal={selectedMealCard}
        onClose={() => setSelectedMealCard(null)}
        setPlan={setPlan}
        openRecipeCard={openRecipeCard}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
    </>
  );
}

function selectRotatingDietMeals(allMeals, currentMeals = []) {
  if (!allMeals.length) return [];
  if (!currentMeals.length) return allMeals.slice(0, HOME_COMBO_MEAL_COUNT);

  const firstIndex = allMeals.findIndex((recipe) => recipe.id === currentMeals[0]?.id);
  const nextStart = (Math.max(firstIndex, 0) + HOME_COMBO_MEAL_COUNT) % allMeals.length;
  return Array.from(
    { length: Math.min(HOME_COMBO_MEAL_COUNT, allMeals.length) },
    (_, offset) => allMeals[(nextStart + offset) % allMeals.length]
  );
}

function HomeDietMealCardButton({ recipe, className = "", onOpen, imageLoading = "eager" }) {
  const calories = getHealthyDinnerCalories(recipe);
  const mealBalance = getMealBalanceScore(recipe);

  return (
    <button
      type="button"
      className={`homeComboMealCard homeDietMealCard ${className}`.trim()}
      onClick={() => onOpen(recipe)}
      aria-label={`Open Diet Meal ${recipe.id}: ${recipe.title}`}
    >
      <div className="homeComboMealImage homeDietMealImage">
        <img
          className="homeDietMealTrayImage"
          src={`${import.meta.env.BASE_URL}images/heroes/${recipe.id}.webp`}
          alt={`${recipe.title} Diet Meal tray`}
          loading={imageLoading}
          decoding="async"
        />
      </div>

      <span className="homeComboMealText homeDietMealText">
        <strong>{recipe.title}</strong>
        <small>{recipe.id}{calories !== null ? ` • ${Math.round(calories)} calories` : " • Diet Meal"}</small>
        {mealBalance !== null && (
          <span
            className="homeComboMealBalanceBadge"
            title={`MealBalance ${mealBalance}`}
            aria-label={`MealBalance ${mealBalance}`}
          >
            {mealBalance}
          </span>
        )}
      </span>
    </button>
  );
}

function HomeDietMealCrossfadeCard({ transition, onOpen }) {
  if (!transition?.from || !transition?.to) return null;

  return (
    <div
      className="homeComboMealFullCrossfadeStage"
      aria-label={`Changing from ${transition.from.title} to ${transition.to.title}`}
    >
      <HomeDietMealCardButton
        recipe={transition.from}
        className="homeComboMealFullCardOutgoing"
        onOpen={onOpen}
      />
      <HomeDietMealCardButton
        recipe={transition.to}
        className="homeComboMealFullCardIncoming"
        onOpen={onOpen}
      />
    </div>
  );
}

function HomeDietMealStrip({
  setActivePage,
  openRecipeCard,
  favorites,
  toggleFavorite,
  classifiedRecipes = [],
  siteMode = "detailed",
}) {
  const allDietMeals = useMemo(
    () =>
      sortRecipesByCode(
        classifiedRecipes.filter(
          (recipe) =>
            String(recipe?.categoryCode || "").toUpperCase() === "DM" ||
            String(recipe?.id || "").toUpperCase().startsWith("DM-")
        )
      ),
    [classifiedRecipes]
  );
  const [dietMeals, setDietMeals] = useState(() => selectRotatingDietMeals(allDietMeals));
  const [crossfades, setCrossfades] = useState({});
  const staggerTimersRef = useRef([]);

  useEffect(() => {
    setDietMeals((current) => current.length ? current : selectRotatingDietMeals(allDietMeals));
  }, [allDietMeals]);

  useEffect(() => {
    function clearStaggerTimers() {
      staggerTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      staggerTimersRef.current = [];
    }

    function rotateDietMeals() {
      clearStaggerTimers();
      setDietMeals((currentMeals) => {
        const nextMeals = selectRotatingDietMeals(allDietMeals, currentMeals);

        function transitionPosition(position) {
          if (position >= nextMeals.length) return;
          const from = currentMeals[position];
          const to = nextMeals[position];
          if (!from || !to || from.id === to.id) return;

          setCrossfades((current) => ({ ...current, [position]: { from, to } }));
          const finishTimer = window.setTimeout(() => {
            setDietMeals((current) => {
              const updated = [...current];
              updated[position] = to;
              return updated;
            });
            const settleTimer = window.setTimeout(() => {
              setCrossfades((current) => {
                const updated = { ...current };
                delete updated[position];
                return updated;
              });
              const pauseTimer = window.setTimeout(
                () => transitionPosition(position + 1),
                HOME_COMBO_PAUSE_MS
              );
              staggerTimersRef.current.push(pauseTimer);
            }, 120);
            staggerTimersRef.current.push(settleTimer);
          }, HOME_COMBO_CROSSFADE_MS);
          staggerTimersRef.current.push(finishTimer);
        }

        transitionPosition(0);
        return currentMeals;
      });
    }

    const rotationTimer = window.setInterval(rotateDietMeals, HOME_COMBO_ROTATION_MS);
    return () => {
      window.clearInterval(rotationTimer);
      clearStaggerTimers();
    };
  }, [allDietMeals]);

  if (!dietMeals.length) return null;

  function openDietMeal(recipe) {
    openRecipeCard(recipe.id, allDietMeals, "Diet Meals");
  }

  return (
    <section className="section homeComboMealStrip homeDietMealStrip" aria-label="Diet Meal ideas">
      <SectionIntro
        title="Looking for Diet Meal Ideas?"
        className="homeComboMealStripHeader quickDinnerSectionIntro homeDietMealStripHeader"
        video={
          <SupplementalHoverVideo
            src={HEALTHY_DINNERS_VIDEO_URL}
            poster={HEALTHY_DINNERS_VIDEO_POSTER}
            title="Diet Meals overview video"
            className="homeDinnerIdeasVideoTrigger"
          >
            <span className="supplementalVideoIcon">
              <VideoIcon role="supplemental" alt="" className="supplementalVideoIconGray" />
              <VideoIcon role="main" alt="" className="supplementalVideoIconRed" />
            </span>
          </SupplementalHoverVideo>
        }
        text={
          <>
            Lighter, portion-conscious dinners with complete recipe cards and estimated nutrition.{" "}
            <button
              type="button"
              className="homeComboMealMoreIdeas"
              onClick={() => setActivePage("Healthy Dinners")}
            >
              (More ideas)
            </button>
          </>
        }
      />

      <div className="homeComboMealGrid homeDietMealGrid" data-site-mode={siteMode}>
        {(siteMode === "easy" ? dietMeals.slice(0, 4) : dietMeals).map((recipe, position) => {
          const transition = crossfades[position];
          const activeRecipe = transition?.to || recipe;
          const isFavorite = Array.isArray(favorites) && favorites.includes(activeRecipe.id);

          return (
            <div
              className={transition ? "homeComboMealCardWrap isCrossfading" : "homeComboMealCardWrap"}
              key={`home-diet-position-${position}`}
            >
              {transition ? (
                <HomeDietMealCrossfadeCard transition={transition} onOpen={openDietMeal} />
              ) : (
                <HomeDietMealCardButton recipe={recipe} onOpen={openDietMeal} />
              )}
              <button
                type="button"
                className={isFavorite ? "homeComboMealFavorite saved" : "homeComboMealFavorite"}
                onClick={() => toggleFavorite(activeRecipe.id)}
                aria-label={isFavorite ? `Remove ${activeRecipe.title} from favorites` : `Add ${activeRecipe.title} to favorites`}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <span aria-hidden="true">♥</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}



  return { HomeComboMealStrip, HomeDietMealStrip };
}
