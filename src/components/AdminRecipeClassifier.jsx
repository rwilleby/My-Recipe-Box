// src/components/AdminRecipeClassifier.jsx
import { useEffect, useMemo, useState } from "react";
import {
  COOKING_METHODS,
  RECIPE_ATTRIBUTES,
  RECIPE_COLLECTIONS,
  emptyRecipeClassification,
  normalizeRecipeClassification,
  saveRecipeClassifications,
} from "../data/recipeClassifications";
import "./AdminRecipeClassifier.css";

function CheckboxGroup({ title, options, selected, onToggle }) {
  return (
    <fieldset className="adminClassifierGroup">
      <legend>{title}</legend>
      <div className="adminClassifierChecks">
        {options.map((option) => (
          <label className="adminClassifierCheck" key={option}>
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function AdminRecipeClassifier({
  recipes,
  categories,
  classifications,
  setClassifications,
  onClose,
}) {
  const [query, setQuery] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(
    recipes[0]?.id || ""
  );
  const [status, setStatus] = useState("");

  const filteredRecipes = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return recipes;

    return recipes.filter((recipe) =>
      `${recipe.id} ${recipe.title} ${recipe.category}`
        .toLowerCase()
        .includes(search)
    );
  }, [query, recipes]);

  useEffect(() => {
    if (
      filteredRecipes.length &&
      !filteredRecipes.some((recipe) => recipe.id === selectedRecipeId)
    ) {
      setSelectedRecipeId(filteredRecipes[0].id);
    }
  }, [filteredRecipes, selectedRecipeId]);

  const recipe =
    recipes.find((item) => item.id === selectedRecipeId) || recipes[0];

  if (!recipe) {
    return (
      <main className="pageShell adminClassifierPage">
        <p>No recipes are available.</p>
      </main>
    );
  }

  const current = normalizeRecipeClassification(
    recipe,
    classifications[recipe.id]
  );

  function updateCurrent(patch) {
    setClassifications((existing) => ({
      ...existing,
      [recipe.id]: {
        ...current,
        ...patch,
      },
    }));
    setStatus("Unsaved changes");
  }

  function toggleListValue(field, value) {
    const selected = current[field] || [];
    updateCurrent({
      [field]: selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    });
  }

  function saveChanges() {
    saveRecipeClassifications(classifications);
    setStatus("Saved in this browser");
  }

  function resetCurrent() {
    setClassifications((existing) => {
      const next = { ...existing };
      delete next[recipe.id];
      return next;
    });
    setStatus("Recipe classifications reset");
  }

  function exportClassifications() {
    const blob = new Blob(
      [JSON.stringify(classifications, null, 2)],
      { type: "application/json" }
    );
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "recipe-classifications.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
    setStatus("Classification file downloaded");
  }

  function copySuggestedRecipeObject() {
    const output = {
      id: recipe.id,
      primaryCategory: current.primaryCategory,
      collections: current.collections,
      attributes: current.attributes,
      cookingMethods: current.cookingMethods,
    };

    navigator.clipboard
      ?.writeText(JSON.stringify(output, null, 2))
      .then(() => setStatus("Recipe classification copied"))
      .catch(() => setStatus("Copy was blocked; use Export JSON instead"));
  }

  return (
    <main className="pageShell adminClassifierPage">
      <header className="adminClassifierHeader">
        <div>
          <div className="aiBadge">ADMIN RECIPE CLASSIFICATION</div>
          <h1>Assign Recipes to Categories & Collections</h1>
          <p>
            Keep one primary recipe category, then check every collection,
            attribute, and cooking method where this recipe belongs.
          </p>
        </div>

        <div className="adminClassifierHeaderButtons">
          <button className="secondary" type="button" onClick={exportClassifications}>
            Export JSON
          </button>
          <button className="secondary" type="button" onClick={onClose}>
            Close Admin
          </button>
        </div>
      </header>

      <div className="adminClassifierLayout">
        <aside className="adminRecipePicker">
          <label htmlFor="admin-recipe-search">Find a recipe</label>
          <input
            id="admin-recipe-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Recipe code or name"
          />

          <div className="adminRecipeList">
            {filteredRecipes.map((item) => (
              <button
                type="button"
                key={item.id}
                className={item.id === recipe.id ? "active" : ""}
                onClick={() => {
                  setSelectedRecipeId(item.id);
                  setStatus("");
                }}
              >
                <strong>{item.id}</strong>
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="adminClassifierEditor">
          <div className="adminSelectedRecipe">
            <div>
              <span>{recipe.id}</span>
              <h2>{recipe.title}</h2>
              <small>Current category: {recipe.category}</small>
            </div>
            <span className="adminAssignmentCount">
              {current.collections.length +
                current.attributes.length +
                current.cookingMethods.length}{" "}
              assignments
            </span>
          </div>

          <label className="adminPrimaryCategory">
            <span>Primary Recipe Category</span>
            <select
              value={current.primaryCategory}
              onChange={(event) =>
                updateCurrent({ primaryCategory: event.target.value })
              }
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <CheckboxGroup
            title="Collections"
            options={RECIPE_COLLECTIONS}
            selected={current.collections}
            onToggle={(value) => toggleListValue("collections", value)}
          />

          <CheckboxGroup
            title="Recipe Attributes"
            options={RECIPE_ATTRIBUTES}
            selected={current.attributes}
            onToggle={(value) => toggleListValue("attributes", value)}
          />

          <CheckboxGroup
            title="Cooking Methods"
            options={COOKING_METHODS}
            selected={current.cookingMethods}
            onToggle={(value) => toggleListValue("cookingMethods", value)}
          />

          <div className="adminClassifierActions">
            <button className="primary" type="button" onClick={saveChanges}>
              Save Classifications
            </button>
            <button className="secondary" type="button" onClick={copySuggestedRecipeObject}>
              Copy This Recipe
            </button>
            <button className="secondary" type="button" onClick={resetCurrent}>
              Reset Recipe
            </button>
            <span role="status" aria-live="polite">{status}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
