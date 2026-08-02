import { useMemo, useState } from "react";
import { sortRecipesByCode } from "../utils/recipeSorting";
import {
  exportRecipeOverrides,
  loadCombinedRecipeOverrides,
  saveBrowserRecipeOverrides,
} from "../utils/recipeOverrides";
import "./AdminRecipeEditor.css";

function cleanPath(value = "") {
  return String(value).trim().replace(/^\//, "");
}

function imageUrl(path = "") {
  if (/^(data:|blob:|https?:)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${cleanPath(path)}`;
}

function makeDraft(recipe, override = {}) {
  return {
    title: override.title ?? recipe.title ?? "",
    detail: override.detail ?? recipe.detail ?? "",
    category: override.category ?? recipe.category ?? "",
    categoryCode: override.categoryCode ?? recipe.categoryCode ?? "",
    time: override.time ?? recipe.time ?? "",
    servings: override.servings ?? recipe.servings ?? "",
    heroImage: override.heroImage ?? recipe.heroImage ?? `images/heroes/${recipe.id}.webp`,
    image: override.image ?? recipe.image ?? `images/recipes/${recipe.id}.webp`,
    cardImage: override.cardImage ?? recipe.cardImage ?? `images/recipes/${recipe.id}.webp`,
  };
}

export default function AdminRecipeEditor({ recipes = [], onOpenRecipe, onClose }) {
  const orderedRecipes = useMemo(() => sortRecipesByCode(recipes), [recipes]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(orderedRecipes[0]?.id || "");
  const [overrides, setOverrides] = useState(loadCombinedRecipeOverrides);
  const selectedRecipe = orderedRecipes.find((recipe) => recipe.id === selectedId) || orderedRecipes[0];
  const [draft, setDraft] = useState(() => selectedRecipe ? makeDraft(selectedRecipe, overrides[selectedRecipe.id]) : {});
  const [heroCode, setHeroCode] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const visibleRecipes = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return orderedRecipes;
    return orderedRecipes.filter((recipe) => `${recipe.id} ${recipe.title} ${recipe.category}`.toLowerCase().includes(needle));
  }, [orderedRecipes, query]);

  function selectRecipe(recipe) {
    setSelectedId(recipe.id);
    setDraft(makeDraft(recipe, overrides[recipe.id]));
    setHeroCode("");
    setSavedMessage("");
  }

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
    setSavedMessage("");
  }

  function saveChanges() {
    if (!selectedRecipe) return;
    const nextOverride = {
      title: String(draft.title || "").trim() || selectedRecipe.title,
      detail: String(draft.detail || "").trim(),
      category: String(draft.category || "").trim() || selectedRecipe.category,
      categoryCode: String(draft.categoryCode || "").trim().toUpperCase() || selectedRecipe.categoryCode,
      time: Math.max(0, Number(draft.time) || 0),
      servings: Math.max(1, Number(draft.servings) || 1),
      heroImage: cleanPath(draft.heroImage),
      image: cleanPath(draft.image),
      cardImage: cleanPath(draft.cardImage),
    };
    const next = { ...overrides, [selectedRecipe.id]: nextOverride };
    saveBrowserRecipeOverrides(next);
    setOverrides(next);
    setSavedMessage("Saved. Reload the website to use this correction everywhere.");
  }

  function removeCorrection() {
    if (!selectedRecipe || !window.confirm(`Remove the saved correction for ${selectedRecipe.id}?`)) return;
    const next = { ...overrides };
    delete next[selectedRecipe.id];
    saveBrowserRecipeOverrides(next);
    setOverrides(next);
    setDraft(makeDraft(selectedRecipe));
    setSavedMessage("Correction removed. Reload the website to restore the original record everywhere.");
  }

  function useHeroCode() {
    const normalized = heroCode.trim().toUpperCase();
    if (!normalized) return;
    update("heroImage", `images/heroes/${normalized}.webp`);
  }

  if (!selectedRecipe) return null;

  return (
    <main className="adminRecipeEditor pageShell">
      <header className="adminRecipeEditorHeader">
        <div><span className="aiBadge">ADMIN</span><h1>Recipe Library Editor</h1><p>Check an individual recipe, correct its visible text or assigned images, save the change in this browser, and export the complete correction file for the website.</p></div>
        <button type="button" className="secondary" onClick={onClose}>Return Home</button>
      </header>

      <div className="adminRecipeEditorLayout">
        <aside className="adminRecipeEditorList">
          <label><span>Find recipe by code or name</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="SD-003 or Mashed Potatoes" /></label>
          <small>{visibleRecipes.length} recipes shown · code order</small>
          <div>
            {visibleRecipes.map((recipe) => (
              <button type="button" key={recipe.id} className={recipe.id === selectedRecipe.id ? "active" : ""} onClick={() => selectRecipe(recipe)}>
                <strong>{recipe.id}</strong><span>{recipe.title}</span>{overrides[recipe.id] && <em>Edited</em>}
              </button>
            ))}
          </div>
        </aside>

        <section className="adminRecipeEditorForm">
          <div className="adminRecipeEditorTitleRow"><div><span>{selectedRecipe.id}</span><h2>{draft.title}</h2></div>{overrides[selectedRecipe.id] && <b>Saved correction</b>}</div>

          <div className="adminRecipeEditorPreviews">
            <figure><img src={imageUrl(draft.heroImage)} alt={`${draft.title} hero preview`} /><figcaption>Hero image</figcaption></figure>
            <figure><img src={imageUrl(draft.cardImage)} alt={`${draft.title} recipe-card preview`} /><figcaption>Recipe card</figcaption></figure>
          </div>

          <div className="adminRecipeEditorFields">
            <label className="wide"><span>Recipe title</span><input value={draft.title} onChange={(event) => update("title", event.target.value)} /></label>
            <label><span>Category code</span><input value={draft.categoryCode} onChange={(event) => update("categoryCode", event.target.value)} /></label>
            <label><span>Category name</span><input value={draft.category} onChange={(event) => update("category", event.target.value)} /></label>
            <label><span>Time in minutes</span><input type="number" min="0" value={draft.time} onChange={(event) => update("time", event.target.value)} /></label>
            <label><span>Servings</span><input type="number" min="1" value={draft.servings} onChange={(event) => update("servings", event.target.value)} /></label>
            <label className="full"><span>Short description / display text</span><textarea value={draft.detail} onChange={(event) => update("detail", event.target.value)} placeholder="Optional recipe description or planning note" /></label>
            <label className="full"><span>Hero image path</span><input value={draft.heroImage} onChange={(event) => update("heroImage", event.target.value)} /></label>
            <div className="adminRecipeHeroShortcut full"><label><span>Use another recipe's hero</span><input value={heroCode} onChange={(event) => setHeroCode(event.target.value)} placeholder="Example: SD-004" /></label><button type="button" onClick={useHeroCode}>Use Hero</button><button type="button" className="secondary" onClick={() => update("heroImage", `images/heroes/${selectedRecipe.id}.webp`)}>Use Dedicated Hero</button><button type="button" className="secondary" onClick={() => update("heroImage", draft.image)}>Use Recipe Image</button></div>
            <label className="full"><span>Recipe image path</span><input value={draft.image} onChange={(event) => update("image", event.target.value)} /></label>
            <label className="full"><span>Recipe-card image path</span><input value={draft.cardImage} onChange={(event) => update("cardImage", event.target.value)} /></label>
          </div>

          <div className="adminRecipeEditorActions">
            <button type="button" onClick={saveChanges}>Save Changes</button>
            <button type="button" className="secondary" onClick={() => window.location.reload()}>Reload & Apply</button>
            <button type="button" className="secondary" onClick={() => onOpenRecipe?.(selectedRecipe)}>View Recipe Card</button>
            <button type="button" className="secondary" onClick={() => exportRecipeOverrides(overrides)}>Export Updated Recipe File</button>
            <button type="button" className="danger" onClick={removeCorrection}>Remove Correction</button>
          </div>
          {savedMessage && <p className="adminRecipeEditorSaved" role="status">{savedMessage}</p>}
        </section>
      </div>
    </main>
  );
}
