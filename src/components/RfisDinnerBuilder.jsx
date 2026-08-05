import { useMemo, useState } from "react";

function recipeName(recipe) {
  return recipe?.title || recipe?.name || recipe?.id || "Recipe";
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function formatCompanion(dinner) {
  return [dinner.freshCompanion, dinner.optionalBread, dinner.garnish]
    .filter(Boolean)
    .join(" • ");
}

export default function RfisDinnerBuilder({
  recipes = [],
  rfisPlatform,
  onOpenRecipe,
  onOpenDinner,
  onBack,
}) {
  const [query, setQuery] = useState("");
  const [entreeId, setEntreeId] = useState("");
  const [sideId, setSideId] = useState("");

  const recipeMap = useMemo(
    () => new Map(recipes.map((recipe) => [recipe.id, recipe])),
    [recipes]
  );

  const entreeOptions = useMemo(
    () =>
      rfisPlatform.recommendations.entreeOptions().map((item) => ({
        id: item.recipeId,
        name: item.name,
        count: item.dinnerCount,
      })),
    [rfisPlatform]
  );

  const visibleEntrees = useMemo(() => {
    const term = normalize(query);
    if (!term) return entreeOptions;
    return entreeOptions.filter((item) =>
      normalize(`${item.id} ${item.name}`).includes(term)
    );
  }, [entreeOptions, query]);

  const entreeDinners = useMemo(() => {
    if (!entreeId) return [];
    return rfisPlatform.recommendations.approvedDinnersForEntree(entreeId);
  }, [rfisPlatform, entreeId]);

  const sideRecommendations = useMemo(
    () =>
      entreeId
        ? rfisPlatform.recommendations
            .sidesForEntree(entreeId)
            .map((item) => ({
              id: item.recipeId,
              name: item.name,
              count: item.count,
              dinnerIds: item.dinnerIds,
            }))
        : [],
    [rfisPlatform, entreeId]
  );

  const displayedDinners = useMemo(
    () =>
      entreeId
        ? rfisPlatform.recommendations.approvedDinnersForEntree(
            entreeId,
            { sideRecipeId: sideId || null }
          )
        : [],
    [rfisPlatform, entreeId, sideId]
  );

  const selectedEntree = entreeId ? recipeMap.get(entreeId) : null;

  function selectEntree(id) {
    setEntreeId(id);
    setSideId("");
  }

  return (
    <main className="pageShell rfisDinnerBuilder">
      <header className="rfisDinnerBuilderHeader">
        <div>
          <span className="rfisDinnerBuilderEyebrow">RFIS VERIFIED PAIRINGS</span>
          <h2>Dinner Builder</h2>
          <p>
            Start with an entrée. RFIS will show only approved Complete Dinners
            and sides already connected to that recipe.
          </p>
        </div>
        <button type="button" className="rfisDinnerBuilderBack" onClick={onBack}>
          Back to Complete Dinners
        </button>
      </header>

      <section className="rfisDinnerBuilderPanel" aria-labelledby="builder-entree-title">
        <div className="rfisDinnerBuilderPanelHeading">
          <div>
            <span>Step 1</span>
            <h3 id="builder-entree-title">Choose an entrée</h3>
          </div>
          <label>
            Find an entrée
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or code"
            />
          </label>
        </div>

        <div className="rfisDinnerBuilderEntreeGrid">
          {visibleEntrees.map((item) => (
            <button
              type="button"
              key={item.id}
              className={entreeId === item.id ? "is-selected" : ""}
              aria-pressed={entreeId === item.id}
              onClick={() => selectEntree(item.id)}
            >
              <strong>{item.name}</strong>
              <span>{item.id}</span>
              <small>
                {item.count} verified dinner{item.count === 1 ? "" : "s"}
              </small>
            </button>
          ))}
        </div>
      </section>

      {!entreeId ? (
        <section className="rfisDinnerBuilderEmpty">
          <h3>Select an entrée to begin</h3>
          <p>
            The builder does not create unverified combinations. It recommends
            only dinners already approved in the RFIS catalog.
          </p>
        </section>
      ) : (
        <>
          <section className="rfisDinnerBuilderPanel" aria-labelledby="builder-side-title">
            <div className="rfisDinnerBuilderPanelHeading">
              <div>
                <span>Step 2</span>
                <h3 id="builder-side-title">Refine by a verified side</h3>
                <p>
                  Side rankings reflect how often each side appears with{" "}
                  <strong>{recipeName(selectedEntree)}</strong> in approved
                  Complete Dinners.
                </p>
              </div>
              <button
                type="button"
                className={!sideId ? "is-selected" : ""}
                onClick={() => setSideId("")}
              >
                Show all pairings
              </button>
            </div>

            <div className="rfisDinnerBuilderSideGrid">
              {sideRecommendations.map((side) => (
                <button
                  type="button"
                  key={side.id}
                  className={sideId === side.id ? "is-selected" : ""}
                  aria-pressed={sideId === side.id}
                  onClick={() => setSideId(side.id)}
                >
                  <strong>{side.name}</strong>
                  <span>{side.id}</span>
                  <small>
                    Used in {side.count} approved dinner{side.count === 1 ? "" : "s"}
                  </small>
                </button>
              ))}
            </div>
          </section>

          <section className="rfisDinnerBuilderPanel" aria-labelledby="builder-results-title">
            <div className="rfisDinnerBuilderPanelHeading">
              <div>
                <span>Step 3</span>
                <h3 id="builder-results-title">
                  Verified Complete Dinners ({displayedDinners.length})
                </h3>
              </div>
              <button type="button" onClick={() => onOpenRecipe?.(entreeId)}>
                View entrée recipe
              </button>
            </div>

            {displayedDinners.length ? (
              <div className="rfisDinnerBuilderResults">
                {displayedDinners.map((dinner) => {
                  const dinnerView =
                    rfisPlatform.completeDinners.present(dinner);
                  const sideNames =
                    dinnerView?.sideNames?.join(" + ") || "";
                  const companion = formatCompanion(
                    dinnerView || dinner
                  );
                  return (
                    <article key={dinner.id}>
                      <div>
                        <span>{dinner.legacyId.toUpperCase()}</span>
                        <h4>{dinner.title}</h4>
                        <p>
                          <strong>Freezer sides:</strong> {sideNames}
                        </p>
                        {companion && (
                          <p>
                            <strong>Serve separately:</strong> {companion}
                          </p>
                        )}
                      </div>
                      <div className="rfisDinnerBuilderResultActions">
                        {(dinner.sideRecipeIds || []).map((id) => (
                          <button
                            type="button"
                            key={id}
                            onClick={() => onOpenRecipe?.(id)}
                          >
                            View {recipeName(recipeMap.get(id))}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="primary"
                          onClick={() => onOpenDinner?.(dinner.legacyId)}
                        >
                          Open Complete Dinner
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rfisDinnerBuilderEmpty compact">
                <h4>No approved dinner uses that side yet</h4>
                <p>Choose another verified side or show all pairings.</p>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
