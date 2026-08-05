import { useMemo, useState } from "react";

function recipeTitle(recipe) {
  return recipe?.title || recipe?.name || recipe?.id || "Recipe";
}

function resultCount(results) {
  return (
    (results?.recipes?.length || 0) +
    (results?.dinners?.length || 0) +
    (results?.collections?.length || 0)
  );
}

export default function RfisUnifiedSearch({
  platform,
  onOpenRecipe,
  onOpenDinner,
  onOpenCollection,
  onBrowseRecipes,
  onBrowseDinners,
}) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("all");

  const trimmedQuery = query.trim();
  const results = useMemo(() => {
    if (!trimmedQuery) {
      return { recipes: [], dinners: [], collections: [] };
    }
    return platform.search.all(trimmedQuery, {
      recipeLimit: 30,
      dinnerLimit: 30,
    });
  }, [platform, trimmedQuery]);

  const total = resultCount(results);
  const tabs = [
    ["all", "All", total],
    ["recipes", "Recipes", results.recipes.length],
    ["dinners", "Complete Dinners", results.dinners.length],
    ["collections", "Collections", results.collections.length],
  ];

  function isVisible(type) {
    return activeType === "all" || activeType === type;
  }

  return (
    <main className="pageShell rfisUnifiedSearch">
      <section className="rfisUnifiedSearchPanel">
        <div className="rfisUnifiedSearchHeading">
          <div>
            <span>ONE RFIS SEARCH</span>
            <h2>What are you looking for?</h2>
            <p>
              Search examples: <em>chicken parmesan</em>, <em>SD-005</em>,
              <em>MEAL-049</em>, <em>broccoli</em>, <em>Italian</em>, or
              <em>Light &amp; Healthy</em>.
            </p>
          </div>
          <div className="rfisUnifiedSearchQuickLinks">
            <button type="button" onClick={onBrowseRecipes}>
              Browse Recipes
            </button>
            <button type="button" onClick={onBrowseDinners}>
              Browse Complete Dinners
            </button>
          </div>
        </div>

        <label className="rfisUnifiedSearchField">
          <span>Search RFIS</span>
          <input
            type="search"
            value={query}
            autoFocus
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Recipe, meal, code, cuisine, side, collection…"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")}>
              Clear
            </button>
          )}
        </label>

        {trimmedQuery && (
          <div className="rfisUnifiedSearchTabs" role="tablist" aria-label="Search result type">
            {tabs.map(([key, label, count]) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeType === key}
                className={activeType === key ? "is-active" : ""}
                key={key}
                onClick={() => setActiveType(key)}
              >
                {label} <span>{count}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {!trimmedQuery ? (
        <section className="rfisUnifiedSearchEmpty">
          <h3>Search the connected Recipe Box</h3>
          <p>
            Results are generated from the shared Recipe, Complete Dinner, and
            Collection services. No separate search list is maintained.
          </p>
        </section>
      ) : total === 0 ? (
        <section className="rfisUnifiedSearchEmpty">
          <h3>No RFIS results found</h3>
          <p>Try a recipe name, code, side dish, cuisine, or collection.</p>
        </section>
      ) : (
        <div className="rfisUnifiedSearchResults">
          {isVisible("recipes") && results.recipes.length > 0 && (
            <section className="rfisUnifiedSearchGroup">
              <div className="rfisUnifiedSearchGroupHeading">
                <div>
                  <span>RECIPE LIBRARY</span>
                  <h3>Recipes</h3>
                </div>
                <strong>{results.recipes.length}</strong>
              </div>
              <div className="rfisUnifiedSearchGrid">
                {results.recipes.map((recipe) => {
                  const recipeView = platform.recipes.present(recipe.id);
                  const roleSummary = platform.recommendations.recipeRoleSummary(recipe.id);
                  return (
                    <article key={recipe.id}>
                      <div>
                        <span>{recipe.id}</span>
                        <h4>{recipeView?.name || recipeTitle(recipe)}</h4>
                        <p>{recipeView?.category || "Recipe"}</p>
                        <small>
                          {roleSummary.dinnerCount} Complete Dinner
                          {roleSummary.dinnerCount === 1 ? "" : "s"}
                        </small>
                      </div>
                      <button type="button" onClick={() => onOpenRecipe?.(recipe.id)}>
                        View Recipe
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {isVisible("dinners") && results.dinners.length > 0 && (
            <section className="rfisUnifiedSearchGroup">
              <div className="rfisUnifiedSearchGroupHeading">
                <div>
                  <span>VERIFIED MEALS</span>
                  <h3>Complete Dinners</h3>
                </div>
                <strong>{results.dinners.length}</strong>
              </div>
              <div className="rfisUnifiedSearchGrid">
                {results.dinners.map((dinner) => {
                  const resolved = platform.completeDinners.resolve(dinner);
                  const sideNames = resolved.sides
                    .map((side) => recipeTitle(side.recipe) || side.recipeId)
                    .join(" + ");
                  return (
                    <article key={dinner.id}>
                      <div>
                        <span>{dinner.legacyId.toUpperCase()}</span>
                        <h4>{dinner.title}</h4>
                        <p>
                          <strong>{recipeTitle(resolved.entree.recipe)}</strong>
                          {sideNames ? ` • ${sideNames}` : ""}
                        </p>
                        <small>{(dinner.collections || []).join(" • ")}</small>
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenDinner?.(dinner.legacyId)}
                      >
                        Open Dinner
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {isVisible("collections") && results.collections.length > 0 && (
            <section className="rfisUnifiedSearchGroup">
              <div className="rfisUnifiedSearchGroupHeading">
                <div>
                  <span>CURATED GROUPS</span>
                  <h3>Collections</h3>
                </div>
                <strong>{results.collections.length}</strong>
              </div>
              <div className="rfisUnifiedSearchGrid collections">
                {results.collections.map((collection) => (
                  <article key={collection.name}>
                    <div>
                      <span>RFIS COLLECTION</span>
                      <h4>{collection.name}</h4>
                      <p>{collection.count} verified Complete Dinners</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenCollection?.(collection.name)}
                    >
                      View Collection
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
