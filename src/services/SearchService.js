import { normalize, scoreSearch, tokenize } from "./rfisCore.js";

function freezeList(values = []) {
  return Object.freeze([...values]);
}

export function createSearchService({
  recipeService,
  completeDinnerService,
  collectionService,
  recommendationService,
} = {}) {
  if (
    !recipeService ||
    !completeDinnerService ||
    !collectionService ||
    !recommendationService
  ) {
    throw new Error(
      "SearchService requires recipe, dinner, collection, and recommendation services"
    );
  }

  const dinnerIndex = new Map(
    completeDinnerService.all().map((dinner) => {
      const view = completeDinnerService.present(dinner);
      return [
        dinner.id,
        normalize(
          [
            dinner.id,
            dinner.legacyId,
            dinner.number,
            dinner.title,
            dinner.cuisine,
            dinner.freshCompanion,
            dinner.optionalBread,
            dinner.garnish,
            ...(dinner.collections || []),
            dinner.entreeRecipeId,
            ...(dinner.sideRecipeIds || []),
            view?.entreeName,
            ...(view?.sideNames || []),
          ]
            .filter(Boolean)
            .join(" ")
        ),
      ];
    })
  );

  function dinnerMatches(query, filterOptions = {}) {
    const tokens = tokenize(query);

    return completeDinnerService
      .filter(filterOptions)
      .map((dinner) => ({
        dinner,
        score: scoreSearch(
          dinnerIndex.get(dinner.id) || "",
          tokens
        ),
      }))
      .filter((item) => item.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          Number(a.dinner.number) - Number(b.dinner.number)
      );
  }

  function recipes(query, { limit = 20, category } = {}) {
    return recipeService
      .search(query, { limit, category })
      .map((recipe) => {
        const view = recipeService.present(recipe.id);
        const roleSummary =
          recommendationService.recipeRoleSummary(recipe.id);

        return Object.freeze({
          type: "recipe",
          id: recipe.id,
          code: recipe.id,
          title: view?.name || recipeService.name(recipe.id),
          category: view?.category || "Recipe",
          hasNutritionRecord: Boolean(
            view?.hasNutritionRecord
          ),
          classificationStatus:
            view?.classificationStatus ||
            "Needs classification",
          dinnerCount: roleSummary.dinnerCount,
          entreeCount: roleSummary.entreeCount,
          sideCount: roleSummary.sideCount,
          recipe,
        });
      });
  }

  function dinners(
    query,
    { limit = 20, filters = {} } = {}
  ) {
    return dinnerMatches(query, filters)
      .slice(0, Math.max(0, limit))
      .map(({ dinner, score }) => {
        const view = completeDinnerService.present(dinner);

        return Object.freeze({
          type: "dinner",
          id: dinner.id,
          legacyId: dinner.legacyId,
          code: dinner.legacyId?.toUpperCase() || dinner.id,
          number: dinner.number,
          title: dinner.title,
          cuisine: dinner.cuisine || "",
          collections: freezeList(
            dinner.collections || []
          ),
          entreeName:
            view?.entreeName || dinner.entreeRecipeId,
          sideNames: freezeList(view?.sideNames || []),
          freshCompanion:
            view?.freshCompanion || "",
          optionalBread:
            view?.optionalBread || "",
          garnish: view?.garnish || "",
          referencesValid:
            view?.referencesValid ?? false,
          score,
          dinner,
        });
      });
  }

  function collections(query, { limit = 20 } = {}) {
    return collectionService
      .search(query, { sampleLimit: 3 })
      .slice(0, Math.max(0, limit))
      .map((collection) =>
        Object.freeze({
          type: "collection",
          id: collection.name,
          name: collection.name,
          title: collection.name,
          count: collection.count,
          score: collection.score,
          sampleDinners: freezeList(
            collection.sampleDinners || []
          ),
        })
      );
  }

  function search(
    query,
    {
      recipeLimit = 20,
      dinnerLimit = 20,
      collectionLimit = 20,
      dinnerFilters = {},
    } = {}
  ) {
    const normalizedQuery = String(query ?? "").trim();

    if (!normalizedQuery) {
      return Object.freeze({
        query: "",
        total: 0,
        counts: Object.freeze({
          recipes: 0,
          dinners: 0,
          collections: 0,
        }),
        tabs: freezeList([
          Object.freeze({
            key: "all",
            label: "All",
            count: 0,
          }),
          Object.freeze({
            key: "recipes",
            label: "Recipes",
            count: 0,
          }),
          Object.freeze({
            key: "dinners",
            label: "Complete Dinners",
            count: 0,
          }),
          Object.freeze({
            key: "collections",
            label: "Collections",
            count: 0,
          }),
        ]),
        recipes: freezeList([]),
        dinners: freezeList([]),
        collections: freezeList([]),
      });
    }

    const recipeResults = recipes(normalizedQuery, {
      limit: recipeLimit,
    });
    const dinnerResults = dinners(normalizedQuery, {
      limit: dinnerLimit,
      filters: dinnerFilters,
    });
    const collectionResults = collections(
      normalizedQuery,
      { limit: collectionLimit }
    );

    const counts = Object.freeze({
      recipes: recipeResults.length,
      dinners: dinnerResults.length,
      collections: collectionResults.length,
    });
    const total =
      counts.recipes +
      counts.dinners +
      counts.collections;

    return Object.freeze({
      query: normalizedQuery,
      total,
      counts,
      tabs: freezeList([
        Object.freeze({
          key: "all",
          label: "All",
          count: total,
        }),
        Object.freeze({
          key: "recipes",
          label: "Recipes",
          count: counts.recipes,
        }),
        Object.freeze({
          key: "dinners",
          label: "Complete Dinners",
          count: counts.dinners,
        }),
        Object.freeze({
          key: "collections",
          label: "Collections",
          count: counts.collections,
        }),
      ]),
      recipes: freezeList(recipeResults),
      dinners: freezeList(dinnerResults),
      collections: freezeList(collectionResults),
    });
  }

  function suggestions() {
    return freezeList([
      "Chicken Parmesan",
      "MEAL-049",
      "SD-005",
      "Broccoli",
      "Italian",
      "Light & Healthy",
    ]);
  }

  return Object.freeze({
    recipes,
    dinners,
    collections,
    search,
    all: search,
    suggestions,
  });
}

export default createSearchService;
