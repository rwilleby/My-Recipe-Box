// src/components/AdminRecipeClassifier.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  COOKING_METHODS,
  RECIPE_ATTRIBUTES,
  RECIPE_COLLECTIONS,
  mergeRecipeClassificationImport,
  normalizeRecipeClassification,
  saveRecipeClassifications,
} from "../data/recipeClassifications";
import {
  GLP1_LEVELS,
  GLP1_RATINGS,
  GLP1_REVIEW_STATUSES,
  normalizeGLP1Classification,
} from "../data/glp1Nutrition";
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

function BulkAssignmentGroup({ title, options, changes, onChange }) {
  function setAction(option, action) {
    onChange((current) => {
      const next = { ...current };
      if (action === "keep") delete next[option];
      else next[option] = action;
      return next;
    });
  }

  return (
    <fieldset className="adminClassifierGroup adminBulkAssignmentGroup">
      <legend>{title}</legend>
      <p className="adminBulkHelp">
        Choose Add or Remove. Items left as Keep Existing will not be changed.
      </p>
      <div className="adminBulkAssignmentList">
        {options.map((option) => (
          <div className="adminBulkAssignmentRow" key={option}>
            <strong>{option}</strong>
            <div className="adminBulkChoiceButtons" aria-label={`${option} bulk action`}>
              {[
                ["keep", "Keep Existing"],
                ["add", "Add"],
                ["remove", "Remove"],
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={(changes[option] || "keep") === value ? "active" : ""}
                  onClick={() => setAction(option, value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

function applyListChanges(existingValues = [], changes = {}) {
  const next = new Set(existingValues);
  Object.entries(changes).forEach(([value, action]) => {
    if (action === "add") next.add(value);
    if (action === "remove") next.delete(value);
  });
  return [...next];
}


const GLP1_BOOLEAN_FIELDS = Object.freeze([
  ["glp1Friendly", "GLP-1 Friendly"],
  ["smallPortionFriendly", "Small-Portion Friendly"],
  ["easyDigestion", "Easy Digestion"],
  ["proteinFirst", "Protein First"],
  ["doseIncreaseFriendly", "Dose-Increase Friendly"],
  ["hydrationSupport", "Hydration Support"],
  ["nutrientDense", "Nutrient Dense"],
]);

function optionalNumberInput(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : "";
}

function optionalBooleanSelectValue(value) {
  if (value === true) return "true";
  if (value === false) return "false";
  return "";
}

function parseOptionalBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function parseOptionalNumber(value) {
  if (value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function verifiedSourceLooksProvisional(value = "") {
  return /\b(estimate|estimated|calculated|provisional|approximate|unverified)\b/i.test(
    String(value)
  );
}

function validateGLP1AdminRecord(record) {
  const errors = [];
  const warnings = [];
  const reviewed =
    record.glp1ReviewStatus === "Provisional" ||
    record.glp1ReviewStatus === "Verified";

  if (reviewed && !record.glp1Rating) {
    warnings.push("Choose a GLP-1 rating or leave the recipe Not Reviewed.");
  }

  if (
    record.glp1Score !== undefined &&
    (record.glp1Score < 0 || record.glp1Score > 10)
  ) {
    errors.push("GLP-1 score must be between 0 and 10.");
  }

  if (record.glp1ReviewStatus === "Verified") {
    if (!record.glp1ReviewedDate) {
      errors.push("Verified records require a review date.");
    }
    if (!record.glp1DataSource) {
      errors.push("Verified records require a data source.");
    } else if (verifiedSourceLooksProvisional(record.glp1DataSource)) {
      errors.push(
        "Calculated, estimated, provisional, approximate, or unverified nutrition cannot be labeled Verified."
      );
    }
  }

  if (
    record.suggestedGlp1ServingSize &&
    record.smallerServingProteinGrams === undefined &&
    record.smallerServingFiberGrams === undefined &&
    record.smallerServingCalories === undefined
  ) {
    warnings.push(
      "A smaller serving is listed without smaller-serving nutrition values."
    );
  }

  return { errors, warnings };
}

function GLP1ReviewPanel({ recipe, current, onChange }) {
  const validation = validateGLP1AdminRecord(current);
  const reviewed =
    current.glp1ReviewStatus === "Provisional" ||
    current.glp1ReviewStatus === "Verified";

  function changeField(field, value) {
    onChange({ [field]: value });
  }

  function changeOptionalNumber(field, value) {
    changeField(field, parseOptionalNumber(value));
  }

  function changeOptionalBoolean(field, value) {
    changeField(field, parseOptionalBoolean(value));
  }

  return (
    <fieldset className="adminClassifierGroup adminGlp1ReviewPanel">
      <legend>GLP-1 Nutrition Review</legend>

      <div className="adminGlp1Intro">
        <div>
          <strong>Optional recipe-by-recipe review</strong>
          <p>
            Do not assign a rating, score, or medical claim without supporting
            nutrition information. Recipes remain Not Reviewed until you choose
            Provisional or Verified.
          </p>
        </div>
        <span className={`adminGlp1Status status-${String(current.glp1ReviewStatus || "Not Reviewed").toLowerCase().replace(/\s+/g, "-")}`}>
          {current.glp1ReviewStatus || "Not Reviewed"}
        </span>
      </div>

      <div className="adminGlp1PrimaryGrid">
        <label>
          <span>Review Status</span>
          <select
            value={current.glp1ReviewStatus || "Not Reviewed"}
            onChange={(event) => changeField("glp1ReviewStatus", event.target.value)}
          >
            {GLP1_REVIEW_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>

        <label>
          <span>GLP-1 Rating</span>
          <select
            value={current.glp1Rating || ""}
            onChange={(event) => changeField("glp1Rating", event.target.value || undefined)}
            disabled={!reviewed}
          >
            <option value="">Not Assigned</option>
            {GLP1_RATINGS.map((rating) => (
              <option key={rating} value={rating}>{rating}</option>
            ))}
          </select>
        </label>

        <label>
          <span>GLP-1 Score</span>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={optionalNumberInput(current.glp1Score)}
            onChange={(event) => changeOptionalNumber("glp1Score", event.target.value)}
            placeholder="0–10"
            disabled={!reviewed}
          />
        </label>

        <label>
          <span>Review Date</span>
          <input
            type="date"
            value={current.glp1ReviewedDate || ""}
            onChange={(event) => changeField("glp1ReviewedDate", event.target.value || undefined)}
            disabled={!reviewed}
          />
        </label>
      </div>

      <div className="adminGlp1LevelGrid">
        <label>
          <span>Protein Level</span>
          <select
            value={current.proteinLevel || ""}
            onChange={(event) => changeField("proteinLevel", event.target.value || undefined)}
          >
            <option value="">Not Reviewed</option>
            {GLP1_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
          </select>
        </label>

        <label>
          <span>Fiber Level</span>
          <select
            value={current.fiberLevel || ""}
            onChange={(event) => changeField("fiberLevel", event.target.value || undefined)}
          >
            <option value="">Not Reviewed</option>
            {GLP1_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
          </select>
        </label>

        <label>
          <span>Satiety Level</span>
          <select
            value={current.satietyLevel || ""}
            onChange={(event) => changeField("satietyLevel", event.target.value || undefined)}
          >
            <option value="">Not Reviewed</option>
            {GLP1_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
          </select>
        </label>

        <label>
          <span>Added Sugar Level</span>
          <select
            value={current.addedSugarLevel || ""}
            onChange={(event) => changeField("addedSugarLevel", event.target.value || undefined)}
          >
            <option value="">Not Reviewed</option>
            {GLP1_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
          </select>
        </label>
      </div>

      <div className="adminGlp1BooleanGrid">
        {GLP1_BOOLEAN_FIELDS.map(([field, label]) => (
          <label key={field}>
            <span>{label}</span>
            <select
              value={optionalBooleanSelectValue(current[field])}
              onChange={(event) => changeOptionalBoolean(field, event.target.value)}
            >
              <option value="">Not Reviewed</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
        ))}
      </div>

      <div className="adminGlp1ServingSection">
        <h3>Suggested Smaller Serving</h3>
        <p>
          Enter only a recipe-specific serving that has been reviewed. Do not
          automatically divide every standard serving in half.
        </p>

        <div className="adminGlp1ServingGrid">
          <label className="adminGlp1WideField">
            <span>Suggested GLP-1 Serving Size</span>
            <input
              type="text"
              value={current.suggestedGlp1ServingSize || ""}
              onChange={(event) => changeField("suggestedGlp1ServingSize", event.target.value || undefined)}
              placeholder="Example: ¾ cup"
            />
          </label>

          <label>
            <span>Protein in Smaller Serving (g)</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={optionalNumberInput(current.smallerServingProteinGrams)}
              onChange={(event) => changeOptionalNumber("smallerServingProteinGrams", event.target.value)}
            />
          </label>

          <label>
            <span>Fiber in Smaller Serving (g)</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={optionalNumberInput(current.smallerServingFiberGrams)}
              onChange={(event) => changeOptionalNumber("smallerServingFiberGrams", event.target.value)}
            />
          </label>

          <label>
            <span>Calories in Smaller Serving</span>
            <input
              type="number"
              min="0"
              step="1"
              value={optionalNumberInput(current.smallerServingCalories)}
              onChange={(event) => changeOptionalNumber("smallerServingCalories", event.target.value)}
            />
          </label>
        </div>
      </div>

      <label className="adminGlp1FullField">
        <span>GLP-1 Notes</span>
        <textarea
          rows="4"
          value={current.glp1Notes || ""}
          onChange={(event) => changeField("glp1Notes", event.target.value || undefined)}
          placeholder="Recipe-specific notes only. Avoid medication or treatment advice."
        />
      </label>

      <label className="adminGlp1FullField">
        <span>Data Source</span>
        <input
          type="text"
          value={current.glp1DataSource || ""}
          onChange={(event) => changeField("glp1DataSource", event.target.value || undefined)}
          placeholder="USDA-based calculation, manufacturer label, registered dietitian review, etc."
          disabled={!reviewed}
        />
        <small>
          Clearly identify calculated, manufacturer-provided, USDA-based,
          provisional, or verified information. Estimated nutrition cannot be
          marked Verified.
        </small>
      </label>

      {(validation.errors.length > 0 || validation.warnings.length > 0) && (
        <div className="adminGlp1Validation" aria-live="polite">
          {validation.errors.map((message) => (
            <p className="error" key={message}><strong>Required:</strong> {message}</p>
          ))}
          {validation.warnings.map((message) => (
            <p className="warning" key={message}><strong>Review:</strong> {message}</p>
          ))}
        </div>
      )}

      <div className="adminGlp1Preview">
        <strong>Display preview</strong>
        <span>
          {reviewed
            ? `${recipe.id} · ${current.glp1Rating ? `GLP-1 ${current.glp1Rating}` : "Reviewed"}${current.glp1Score !== undefined ? ` · ${current.glp1Score}/10` : ""}`
            : `${recipe.id} · Not Yet Reviewed`}
        </span>
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
  const [mode, setMode] = useState("single");
  const [query, setQuery] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(recipes[0]?.id || "");
  const [selectedRecipeIds, setSelectedRecipeIds] = useState([]);
  const [bulkPrimaryCategory, setBulkPrimaryCategory] = useState("");
  const [bulkCollections, setBulkCollections] = useState({});
  const [bulkAttributes, setBulkAttributes] = useState({});
  const [bulkCookingMethods, setBulkCookingMethods] = useState({});
  const [status, setStatus] = useState("");
  const importInputRef = useRef(null);

  const filteredRecipes = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return recipes;

    return recipes.filter((recipe) =>
      `${recipe.id} ${recipe.title} ${recipe.category}`.toLowerCase().includes(search)
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

  const recipe = recipes.find((item) => item.id === selectedRecipeId) || recipes[0];

  if (!recipe) {
    return (
      <main className="pageShell adminClassifierPage">
        <p>No recipes are available.</p>
      </main>
    );
  }

  const current = normalizeRecipeClassification(recipe, classifications[recipe.id]);
  const selectedCount = selectedRecipeIds.length;

  function updateCurrent(patch) {
    setClassifications((existing) => {
      const candidate = {
        ...current,
        ...patch,
      };

      Object.keys(candidate).forEach((key) => {
        if (candidate[key] === undefined || candidate[key] === "") {
          delete candidate[key];
        }
      });

      return {
        ...existing,
        [recipe.id]: normalizeRecipeClassification(recipe, candidate),
      };
    });
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

  function toggleBulkRecipe(recipeId) {
    setSelectedRecipeIds((existing) =>
      existing.includes(recipeId)
        ? existing.filter((id) => id !== recipeId)
        : [...existing, recipeId]
    );
    setStatus("");
  }

  function selectAllFiltered() {
    const filteredIds = filteredRecipes.map((item) => item.id);
    setSelectedRecipeIds((existing) => [...new Set([...existing, ...filteredIds])]);
    setStatus(`${filteredIds.length} visible recipes selected`);
  }

  function clearBulkSelection() {
    setSelectedRecipeIds([]);
    setStatus("Group selection cleared");
  }

  function resetBulkChanges() {
    setBulkPrimaryCategory("");
    setBulkCollections({});
    setBulkAttributes({});
    setBulkCookingMethods({});
    setStatus("Group assignment choices reset");
  }

  function applyBulkChanges() {
    if (!selectedCount) {
      setStatus("Select at least one recipe first");
      return;
    }

    setClassifications((existing) => {
      const next = { ...existing };

      selectedRecipeIds.forEach((recipeId) => {
        const selectedRecipe = recipes.find((item) => item.id === recipeId);
        if (!selectedRecipe) return;

        const normalized = normalizeRecipeClassification(
          selectedRecipe,
          existing[recipeId]
        );

        next[recipeId] = {
          ...normalized,
          primaryCategory: bulkPrimaryCategory || normalized.primaryCategory,
          collections: applyListChanges(normalized.collections, bulkCollections),
          attributes: applyListChanges(normalized.attributes, bulkAttributes),
          cookingMethods: applyListChanges(
            normalized.cookingMethods,
            bulkCookingMethods
          ),
        };
      });

      return next;
    });

    setStatus(`Group changes applied to ${selectedCount} recipes — save when ready`);
  }

  function saveChanges() {
    const selectedSaved = normalizeRecipeClassification(
      recipe,
      classifications[recipe.id]
    );
    const validation = validateGLP1AdminRecord(selectedSaved);

    if (validation.errors.length) {
      setStatus(`Cannot save: ${validation.errors.join(" ")}`);
      return;
    }

    saveRecipeClassifications(classifications);
    setStatus(
      validation.warnings.length
        ? `Saved in this browser with review note: ${validation.warnings.join(" ")}`
        : "Saved in this browser"
    );
  }

  function resetCurrent() {
    setClassifications((existing) => {
      const next = { ...existing };
      delete next[recipe.id];
      return next;
    });
    setStatus("Recipe classifications reset");
  }

  async function importClassifications(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const imported = JSON.parse(await file.text());
      const result = mergeRecipeClassificationImport(
        classifications,
        imported,
        recipes
      );

      if (!result.ok) {
        setStatus(`Import stopped: ${result.errors.slice(0, 3).join(" ")}`);
        return;
      }

      setClassifications(result.merged);
      saveRecipeClassifications(result.merged);

      const importedCount = Object.keys(result.accepted).length;
      const warningText = result.warnings.length
        ? ` ${result.warnings.length} warning(s) were found.`
        : "";

      setStatus(
        `Imported and saved ${importedCount} recipe classification record${
          importedCount === 1 ? "" : "s"
        }.${warningText}`
      );
    } catch {
      setStatus("Import stopped: the selected file is not valid JSON.");
    }
  }

  function exportClassifications() {
    const blob = new Blob([JSON.stringify(classifications, null, 2)], {
      type: "application/json",
    });
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
      ...normalizeGLP1Classification(current),
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
          <h1>Assign Recipes, Collections & GLP-1 Reviews</h1>
          <p>
            Edit one recipe at a time, or select a group of recipes and add or
            remove shared categories, collections, attributes, and cooking methods. The single-recipe editor also includes the optional GLP-1 review panel.
          </p>
        </div>

        <div className="adminClassifierHeaderButtons">
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            onChange={importClassifications}
            hidden
          />
          <button
            className="secondary"
            type="button"
            onClick={() => importInputRef.current?.click()}
          >
            Import JSON
          </button>
          <button className="secondary" type="button" onClick={exportClassifications}>
            Export JSON
          </button>
          <button className="secondary" type="button" onClick={onClose}>
            Close Admin
          </button>
        </div>
      </header>

      <div className="adminClassifierModeTabs" role="tablist" aria-label="Classification mode">
        <button
          type="button"
          className={mode === "single" ? "active" : ""}
          onClick={() => {
            setMode("single");
            setStatus("");
          }}
        >
          One Recipe
        </button>
        <button
          type="button"
          className={mode === "group" ? "active" : ""}
          onClick={() => {
            setMode("group");
            setStatus("");
          }}
        >
          Recipe Group
          {selectedCount > 0 && <span>{selectedCount}</span>}
        </button>
      </div>

      <div className="adminClassifierLayout">
        <aside className="adminRecipePicker">
          <label htmlFor="admin-recipe-search">
            {mode === "group" ? "Find and select recipes" : "Find a recipe"}
          </label>
          <input
            id="admin-recipe-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Recipe code, name, or category"
          />

          {mode === "group" && (
            <div className="adminBulkPickerActions">
              <button type="button" onClick={selectAllFiltered}>
                Select Visible
              </button>
              <button type="button" onClick={clearBulkSelection} disabled={!selectedCount}>
                Clear Selection
              </button>
            </div>
          )}

          <div className={mode === "group" ? "adminRecipeList groupMode" : "adminRecipeList"}>
            {filteredRecipes.map((item) => {
              if (mode === "group") {
                const checked = selectedRecipeIds.includes(item.id);
                return (
                  <label className={checked ? "adminBulkRecipeRow selected" : "adminBulkRecipeRow"} key={item.id}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleBulkRecipe(item.id)}
                    />
                    <strong>{item.id}</strong>
                    <span>{item.title}</span>
                  </label>
                );
              }

              return (
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
              );
            })}
          </div>
        </aside>

        {mode === "single" ? (
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

            <GLP1ReviewPanel
              recipe={recipe}
              current={current}
              onChange={updateCurrent}
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
        ) : (
          <section className="adminClassifierEditor adminBulkEditor">
            <div className="adminSelectedRecipe adminBulkSelectedHeader">
              <div>
                <span>GROUP EDITOR</span>
                <h2>{selectedCount} Recipes Selected</h2>
                <small>
                  Search by code, name, or category, then check every recipe that
                  should receive the same assignment changes.
                </small>
              </div>
              <span className="adminAssignmentCount">{selectedCount} selected</span>
            </div>

            <div className="adminBulkNotice">
              Existing classifications are preserved unless you explicitly choose
              Add, Remove, or a new primary category.
            </div>

            <label className="adminPrimaryCategory">
              <span>Primary Recipe Category</span>
              <select
                value={bulkPrimaryCategory}
                onChange={(event) => setBulkPrimaryCategory(event.target.value)}
              >
                <option value="">Keep each recipe’s existing category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    Change all selected recipes to {category.name}
                  </option>
                ))}
              </select>
            </label>

            <BulkAssignmentGroup
              title="Collections"
              options={RECIPE_COLLECTIONS}
              changes={bulkCollections}
              onChange={setBulkCollections}
            />

            <BulkAssignmentGroup
              title="Recipe Attributes"
              options={RECIPE_ATTRIBUTES}
              changes={bulkAttributes}
              onChange={setBulkAttributes}
            />

            <BulkAssignmentGroup
              title="Cooking Methods"
              options={COOKING_METHODS}
              changes={bulkCookingMethods}
              onChange={setBulkCookingMethods}
            />

            <div className="adminClassifierActions adminBulkActions">
              <button
                className="primary"
                type="button"
                onClick={applyBulkChanges}
                disabled={!selectedCount}
              >
                Apply to {selectedCount || 0} Selected Recipes
              </button>
              <button className="secondary" type="button" onClick={saveChanges}>
                Save Classifications
              </button>
              <button className="secondary" type="button" onClick={resetBulkChanges}>
                Reset Group Choices
              </button>
              <span role="status" aria-live="polite">{status}</span>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
