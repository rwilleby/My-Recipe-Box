import { uniqueRecordsByPermanentId } from "../../utils/records.js";

export default function HomeRecipeCounters({
  recipes = [],
  completeMeals = [],
  collectionNames = [],
  classifiedRecipes = [],
}) {
  const allUniqueRecipes = uniqueRecordsByPermanentId(recipes);
  const allUniqueCompleteMeals = uniqueRecordsByPermanentId(completeMeals);
  const classifiedRecipeLookup = new Map(
    uniqueRecordsByPermanentId(classifiedRecipes).map((recipe) => [
      String(recipe.id || recipe.code).trim(),
      recipe,
    ])
  );
  const freezerFriendlyNames = new Set([
    "freezer-friendly",
    "freezer friendly",
    "freezer-friendly meals",
    "quick & easy freezer meals",
  ]);
  const freezerFriendlyCount = allUniqueRecipes.filter((recipe) => {
    const classifiedRecipe = classifiedRecipeLookup.get(String(recipe.id || recipe.code).trim()) || recipe;
    const collections = Array.isArray(classifiedRecipe.collections) ? classifiedRecipe.collections : [];
    const attributes = Array.isArray(classifiedRecipe.attributes) ? classifiedRecipe.attributes : [];

    return (
      classifiedRecipe.freezerFriendly === true ||
      classifiedRecipe.freezable === true ||
      [...collections, ...attributes].some((name) =>
        freezerFriendlyNames.has(String(name).trim().toLowerCase())
      )
    );
  }).length;
  const counters = [
    { label: "Recipes", value: allUniqueRecipes.length, className: "recipes" },
    { label: "Complete Dinners", value: allUniqueCompleteMeals.length, className: "complete" },
    { label: "Freezer-Friendly", value: freezerFriendlyCount, className: "freezer" },
    {
      label: "Collections",
      value: new Set(collectionNames.map((name) => String(name).trim().toLowerCase()).filter(Boolean)).size,
      className: "collections",
    },
  ];

  return (
    <section className="homeCounterSection" aria-label="Recipe library totals">
      <div className="homeCounterRow">
        {counters.map((counter) => (
          <div className={`homeCounterItem ${counter.className}`} key={counter.label}>
            <span className="homeCounterBadge" aria-hidden="true">
              <span className="homeCounterIcon" />
            </span>
            <span className="homeCounterText">
              <strong>{counter.value}</strong>
              <small>{counter.label}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
