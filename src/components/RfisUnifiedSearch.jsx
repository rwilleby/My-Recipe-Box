import { useMemo, useState } from "react";

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
  const results = useMemo(
    () =>
      platform.search.search(trimmedQuery, {
        recipeLimit: 30,
        dinnerLimit: 30,
        collectionLimit: 30,
      }),
    [platform, trimmedQuery]
  );
  const suggestions = platform.search.suggestions();

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
              Search examples:{" "}
              {suggestions.map((item, index) => (
                <span key={item}>
                  {index > 0 ? ", " : ""}
                  <button
                    type="button"
                    className="rfisUnifiedSearchExample"
                    onClick={() => setQuery(item)}
                  >
                    {item}
                  </button>
                </span>
              ))}
              .
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
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveType("all");
            }}
            placeholder="Recipe, meal, code, cuisine, side, collection…"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveType("all");
              }}
            >
              Clear
            </button>
          )}
        </label>

        {trimmedQuery && (
          <div
            className="rfisUnifiedSearchTabs"
            role="tablist"
            aria-label="Search result type"
          >
            {results.tabs.map((tab) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeType === tab.key}
                className={
                  activeType === tab.key ? "is-active" : ""
                }
                key={tab.key}
                onClick={() => setActiveType(tab.key)}
              >
                {tab.label} <span>{tab.count}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {!trimmedQuery ? (
        <section className="rfisUnifiedSearchEmpty">
          <h3>Search the connected Recipe Box</h3>
          <p>
            Results are generated from one shared RFIS Search
            Service. No separate recipe, dinner, or collection
            result lists are maintained by this page.
          </p>
        </section>
      ) : results.total === 0 ? (
        <section className="rfisUnifiedSearchEmpty">
          <h3>No RFIS results found</h3>
          <p>
            Try a recipe name, code, side dish, cuisine, or
            collection.
          </p>
        </section>
      ) : (
        <div className="rfisUnifiedSearchResults">
          {isVisible("recipes") &&
            results.recipes.length > 0 && (
              <section className="rfisUnifiedSearchGroup">
                <div className="rfisUnifiedSearchGroupHeading">
                  <div>
                    <span>RECIPE LIBRARY</span>
                    <h3>Recipes</h3>
                  </div>
                  <strong>{results.counts.recipes}</strong>
                </div>
                <div className="rfisUnifiedSearchGrid">
                  {results.recipes.map((recipe) => (
                    <article key={recipe.id}>
                      <div>
                        <span>{recipe.code}</span>
                        <h4>{recipe.title}</h4>
                        <p>{recipe.category}</p>
                        <small>
                          {recipe.dinnerCount} Complete Dinner
                          {recipe.dinnerCount === 1 ? "" : "s"}
                        </small>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenRecipe?.(recipe.id)
                        }
                      >
                        View Recipe
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}

          {isVisible("dinners") &&
            results.dinners.length > 0 && (
              <section className="rfisUnifiedSearchGroup">
                <div className="rfisUnifiedSearchGroupHeading">
                  <div>
                    <span>VERIFIED MEALS</span>
                    <h3>Complete Dinners</h3>
                  </div>
                  <strong>{results.counts.dinners}</strong>
                </div>
                <div className="rfisUnifiedSearchGrid">
                  {results.dinners.map((dinner) => (
                    <article key={dinner.id}>
                      <div>
                        <span>{dinner.code}</span>
                        <h4>{dinner.title}</h4>
                        <p>
                          <strong>{dinner.entreeName}</strong>
                          {dinner.sideNames.length
                            ? ` • ${dinner.sideNames.join(
                                " + "
                              )}`
                            : ""}
                        </p>
                        <small>
                          {dinner.collections.join(" • ")}
                        </small>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenDinner?.(dinner.legacyId)
                        }
                      >
                        Open Dinner
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}

          {isVisible("collections") &&
            results.collections.length > 0 && (
              <section className="rfisUnifiedSearchGroup">
                <div className="rfisUnifiedSearchGroupHeading">
                  <div>
                    <span>CURATED GROUPS</span>
                    <h3>Collections</h3>
                  </div>
                  <strong>
                    {results.counts.collections}
                  </strong>
                </div>
                <div className="rfisUnifiedSearchGrid collections">
                  {results.collections.map((collection) => (
                    <article key={collection.id}>
                      <div>
                        <span>RFIS COLLECTION</span>
                        <h4>{collection.title}</h4>
                        <p>
                          {collection.count} verified Complete
                          Dinners
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenCollection?.(
                            collection.name
                          )
                        }
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
