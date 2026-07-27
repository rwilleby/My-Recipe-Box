import { useEffect, useMemo, useState } from "react";
import "./DinnerCombinationHeroAudit.css";

const STORAGE_KEY = "rrb_dinnerComboHeroAudit_v1";

const REVIEW_OPTIONS = [
  "Not Reviewed",
  "Images Match",
  "Possible Mismatch",
  "Hero Update Needed",
  "Component Image Update Needed",
];

function safeText(value) {
  return String(value ?? "").trim();
}

function normalizeCode(value) {
  return safeText(value).toUpperCase();
}

function getRecipeCode(recipe) {
  return normalizeCode(
    recipe?.code ??
      recipe?.recipeCode ??
      recipe?.id ??
      recipe?.recipeId
  );
}

function getRecipeName(recipe) {
  return safeText(recipe?.title ?? recipe?.name ?? recipe?.recipeName);
}

function getRecipeImage(recipe) {
  return safeText(
    recipe?.heroImage ??
      recipe?.image ??
      recipe?.imageUrl ??
      recipe?.hero ??
      recipe?.photo
  );
}

function getComboImage(combo) {
  return safeText(
    combo?.heroImage ??
      combo?.image ??
      combo?.imageUrl ??
      combo?.hero ??
      combo?.photo
  );
}

function getMealNumber(combo, index) {
  return safeText(
    combo?.mealNumber ??
      combo?.number ??
      combo?.mealNo ??
      combo?.id ??
      index + 1
  );
}

function getComboTitle(combo) {
  return safeText(combo?.title ?? combo?.name ?? combo?.mealName);
}

function getMealBalance(combo) {
  const score = combo?.mealBalance?.score ?? combo?.mealBalanceScore;
  const label = combo?.mealBalance?.label ?? combo?.mealBalanceLabel;
  if (score == null && !label) return "Not Yet Rated";
  return [score, label].filter(Boolean).join(" ");
}

function componentReference(combo, role) {
  const aliases = {
    main: [
      combo?.mainDish,
      combo?.main,
      combo?.mainRecipe,
      combo?.mainDishRecipe,
      combo?.mainDishCode,
      combo?.mainRecipeCode,
    ],
    side1: [
      combo?.side1,
      combo?.sideOne,
      combo?.firstSide,
      combo?.side1Recipe,
      combo?.side1Code,
      combo?.sideOneCode,
    ],
    side2: [
      combo?.side2,
      combo?.sideTwo,
      combo?.secondSide,
      combo?.side2Recipe,
      combo?.side2Code,
      combo?.sideTwoCode,
    ],
  };

  return aliases[role].find((value) => value != null && value !== "") ?? null;
}

function findRecipe(reference, recipeMap, recipes) {
  if (!reference) return null;

  if (typeof reference === "object") {
    const code = getRecipeCode(reference);
    if (code && recipeMap.has(code)) return recipeMap.get(code);
    const name = getRecipeName(reference).toLowerCase();
    if (name) {
      return (
        recipes.find((recipe) => getRecipeName(recipe).toLowerCase() === name) ??
        reference
      );
    }
    return reference;
  }

  const value = safeText(reference);
  const normalized = normalizeCode(value);
  return (
    recipeMap.get(normalized) ??
    recipes.find(
      (recipe) => getRecipeName(recipe).toLowerCase() === value.toLowerCase()
    ) ??
    null
  );
}

function loadAuditState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function ImagePanel({
  label,
  image,
  title,
  code,
  onOpenRecipe,
  recipe,
  missing,
  onImageError,
}) {
  return (
    <section className={`dcAuditImagePanel${missing ? " isMissing" : ""}`}>
      <div className="dcAuditPanelLabel">{label}</div>

      <div className="dcAuditImageFrame">
        {image ? (
          <img
            src={image}
            alt={`${label}: ${title || "image"}`}
            loading="lazy"
            onError={onImageError}
          />
        ) : (
          <div className="dcAuditMissingImage">No image assigned</div>
        )}
      </div>

      <div className="dcAuditPanelInfo">
        <strong>{title || "Missing linked recipe"}</strong>
        {code && <span>{code}</span>}
      </div>

      <div className="dcAuditPanelLinks">
        {recipe && onOpenRecipe && (
          <button type="button" onClick={() => onOpenRecipe(recipe)}>
            View Recipe
          </button>
        )}
        {image && (
          <a href={image} target="_blank" rel="noreferrer">
            View Full Image
          </a>
        )}
      </div>
    </section>
  );
}

export default function DinnerCombinationHeroAudit({
  dinnerCombinations = [],
  recipes = [],
  onOpenRecipe,
  onBack,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [missingOnly, setMissingOnly] = useState(false);
  const [mismatchOnly, setMismatchOnly] = useState(false);
  const [auditState, setAuditState] = useState(loadAuditState);
  const [brokenImages, setBrokenImages] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auditState));
    } catch {
      // The audit remains usable even when browser storage is unavailable.
    }
  }, [auditState]);

  const recipeMap = useMemo(() => {
    const map = new Map();
    recipes.forEach((recipe) => {
      const code = getRecipeCode(recipe);
      if (code) map.set(code, recipe);
    });
    return map;
  }, [recipes]);

  const groups = useMemo(
    () =>
      dinnerCombinations.map((combo, index) => {
        const mealNumber = getMealNumber(combo, index);
        const key = safeText(combo?.id || combo?.code || `meal-${mealNumber}`);
        const main = findRecipe(
          componentReference(combo, "main"),
          recipeMap,
          recipes
        );
        const side1 = findRecipe(
          componentReference(combo, "side1"),
          recipeMap,
          recipes
        );
        const side2 = findRecipe(
          componentReference(combo, "side2"),
          recipeMap,
          recipes
        );

        const comboImage = getComboImage(combo);
        const images = [
          comboImage,
          getRecipeImage(main),
          getRecipeImage(side1),
          getRecipeImage(side2),
        ].filter(Boolean);

        const duplicateImages = new Set(images).size !== images.length;
        const missing =
          !comboImage ||
          !main ||
          !side1 ||
          !side2 ||
          !getRecipeImage(main) ||
          !getRecipeImage(side1) ||
          !getRecipeImage(side2);

        return {
          key,
          combo,
          mealNumber,
          title: getComboTitle(combo),
          balance: getMealBalance(combo),
          comboImage,
          main,
          side1,
          side2,
          duplicateImages,
          missing,
        };
      }),
    [dinnerCombinations, recipeMap, recipes]
  );

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();

    return groups.filter((group) => {
      const saved = auditState[group.key] || {};
      const status = saved.status || "Not Reviewed";
      const hasBrokenImage = Object.keys(brokenImages).some((id) =>
        id.startsWith(`${group.key}:`)
      );
      const hasMissing = group.missing || hasBrokenImage;

      if (statusFilter !== "All" && status !== statusFilter) return false;
      if (missingOnly && !hasMissing) return false;
      if (
        mismatchOnly &&
        !["Possible Mismatch", "Hero Update Needed", "Component Image Update Needed"].includes(status)
      ) {
        return false;
      }

      if (!query) return true;

      const haystack = [
        group.mealNumber,
        group.title,
        getRecipeName(group.main),
        getRecipeCode(group.main),
        getRecipeName(group.side1),
        getRecipeCode(group.side1),
        getRecipeName(group.side2),
        getRecipeCode(group.side2),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [
    groups,
    search,
    statusFilter,
    missingOnly,
    mismatchOnly,
    auditState,
    brokenImages,
  ]);

  function updateAudit(key, patch) {
    setAuditState((current) => ({
      ...current,
      [key]: {
        status: "Not Reviewed",
        notes: "",
        ...(current[key] || {}),
        ...patch,
      },
    }));
  }

  function markBroken(groupKey, panel) {
    setBrokenImages((current) => ({
      ...current,
      [`${groupKey}:${panel}`]: true,
    }));
  }

  return (
    <main className="pageShell dcAuditPage">
      <header className="dcAuditHeader">
        <div>
          <div className="dcAuditEyebrow">ADMIN REFERENCE TOOL</div>
          <h1>Dinner Combination Hero Image Audit</h1>
          <p>
            Compare each completed Combo-Meal hero with the current hero images
            from its linked Main Dish, Side 1, and Side 2 recipes.
          </p>
        </div>
        {onBack && (
          <button type="button" className="dcAuditBackButton" onClick={onBack}>
            Back to Admin
          </button>
        )}
      </header>

      <section className="dcAuditFilters" aria-label="Audit filters">
        <label>
          <span>Search</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Meal title, recipe name, or code"
          />
        </label>

        <label>
          <span>Review Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All</option>
            {REVIEW_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="dcAuditCheck">
          <input
            type="checkbox"
            checked={mismatchOnly}
            onChange={(event) => setMismatchOnly(event.target.checked)}
          />
          <span>Possible mismatches only</span>
        </label>

        <label className="dcAuditCheck">
          <input
            type="checkbox"
            checked={missingOnly}
            onChange={(event) => setMissingOnly(event.target.checked)}
          />
          <span>Missing or broken images only</span>
        </label>
      </section>

      <div className="dcAuditCount">
        Showing {filteredGroups.length} of {groups.length} dinner combinations
      </div>

      <section className="dcAuditList">
        {filteredGroups.map((group) => {
          const saved = auditState[group.key] || {
            status: "Not Reviewed",
            notes: "",
          };

          const technicalIssues = [
            !group.comboImage && "Combo-Meal hero missing",
            !group.main && "Main Dish recipe not found",
            group.main && !getRecipeImage(group.main) && "Main Dish image missing",
            !group.side1 && "Side 1 recipe not found",
            group.side1 && !getRecipeImage(group.side1) && "Side 1 image missing",
            !group.side2 && "Side 2 recipe not found",
            group.side2 && !getRecipeImage(group.side2) && "Side 2 image missing",
            group.duplicateImages && "Same image assigned more than once",
            brokenImages[`${group.key}:combo`] && "Combo-Meal image link is broken",
            brokenImages[`${group.key}:main`] && "Main Dish image link is broken",
            brokenImages[`${group.key}:side1`] && "Side 1 image link is broken",
            brokenImages[`${group.key}:side2`] && "Side 2 image link is broken",
          ].filter(Boolean);

          return (
            <article className="dcAuditGroup" key={group.key}>
              <header className="dcAuditGroupHeader">
                <div>
                  <div className="dcAuditMealNumber">
                    MEAL #{group.mealNumber}
                  </div>
                  <h2>{group.title || "Untitled Dinner Combination"}</h2>
                  <p>Combo MealBalance: {group.balance}</p>
                </div>

                {technicalIssues.length > 0 && (
                  <div className="dcAuditIssueSummary">
                    <strong>Technical flags</strong>
                    <ul>
                      {technicalIssues.map((issue) => (
                        <li key={issue}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </header>

              <div className="dcAuditImageGrid">
                <ImagePanel
                  label="COMBO-MEAL HERO"
                  image={group.comboImage}
                  title={`Meal #${group.mealNumber} — ${group.title}`}
                  missing={!group.comboImage}
                  onImageError={() => markBroken(group.key, "combo")}
                />
                <ImagePanel
                  label="MAIN DISH"
                  image={getRecipeImage(group.main)}
                  title={getRecipeName(group.main)}
                  code={getRecipeCode(group.main)}
                  recipe={group.main}
                  onOpenRecipe={onOpenRecipe}
                  missing={!group.main || !getRecipeImage(group.main)}
                  onImageError={() => markBroken(group.key, "main")}
                />
                <ImagePanel
                  label="SIDE 1"
                  image={getRecipeImage(group.side1)}
                  title={getRecipeName(group.side1)}
                  code={getRecipeCode(group.side1)}
                  recipe={group.side1}
                  onOpenRecipe={onOpenRecipe}
                  missing={!group.side1 || !getRecipeImage(group.side1)}
                  onImageError={() => markBroken(group.key, "side1")}
                />
                <ImagePanel
                  label="SIDE 2"
                  image={getRecipeImage(group.side2)}
                  title={getRecipeName(group.side2)}
                  code={getRecipeCode(group.side2)}
                  recipe={group.side2}
                  onOpenRecipe={onOpenRecipe}
                  missing={!group.side2 || !getRecipeImage(group.side2)}
                  onImageError={() => markBroken(group.key, "side2")}
                />
              </div>

              <div className="dcAuditReview">
                <label>
                  <span>Review Status</span>
                  <select
                    value={saved.status || "Not Reviewed"}
                    onChange={(event) =>
                      updateAudit(group.key, { status: event.target.value })
                    }
                  >
                    {REVIEW_OPTIONS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="dcAuditNotes">
                  <span>Browser-Only Notes</span>
                  <textarea
                    value={saved.notes || ""}
                    onChange={(event) =>
                      updateAudit(group.key, { notes: event.target.value })
                    }
                    placeholder="Record plating, image, lighting, or synchronization observations."
                    rows={3}
                  />
                </label>
              </div>
            </article>
          );
        })}
      </section>

      {filteredGroups.length === 0 && (
        <div className="dcAuditEmpty">
          No dinner combinations match the current filters.
        </div>
      )}
    </main>
  );
}
