import React from "react";
import "./RecipeIntelligencePanel.css";

function uniqueStrings(values = []) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.trim()))];
}

export default function RecipeIntelligencePanel({
  recipe,
  rfisPlatform,
  hasNutritionRecord = false,
}) {
  if (!recipe) return null;

  const roleSummary =
    rfisPlatform?.recommendations?.recipeRoleSummary?.(recipe.id) || {
      dinnerCount: 0,
      entreeCount: 0,
      sideCount: 0,
      relationships: [],
    };
  const attributes = uniqueStrings(recipe.attributes || []);
  const collections = uniqueStrings(recipe.collections || []);
  const methods = uniqueStrings(recipe.cookingMethods || []);
  const classificationCount = attributes.length + collections.length + methods.length;
  const profileStatus = classificationCount > 0 ? "Classified" : "Needs classification";

  return (
    <section className="recipeIntelligencePanel" aria-label={`RFIS intelligence profile for ${recipe.title}`}>
      <div className="recipeIntelligencePanelHeader">
        <div>
          <span>RFIS PROFILE</span>
          <h3>Recipe Intelligence</h3>
        </div>
        <small className={classificationCount > 0 ? "isReady" : "needsReview"}>{profileStatus}</small>
      </div>

      <div className="recipeIntelligenceMetrics">
        <article>
          <span>Category</span>
          <strong>{recipe.primaryCategory || recipe.category || "Not assigned"}</strong>
        </article>
        <article>
          <span>Complete Dinners</span>
          <strong>{roleSummary.dinnerCount}</strong>
          <small>{roleSummary.entreeCount} entrée · {roleSummary.sideCount} side</small>
        </article>
        <article>
          <span>Nutrition Record</span>
          <strong>{hasNutritionRecord ? "Available" : "Not available"}</strong>
        </article>
        <article>
          <span>RFIS Tags</span>
          <strong>{classificationCount}</strong>
          <small>attributes, collections, methods</small>
        </article>
      </div>

      <div className="recipeIntelligenceGroups">
        <div>
          <strong>Attributes</strong>
          <div className="recipeIntelligenceChips">
            {attributes.length ? attributes.map((item) => <span key={`attribute-${item}`}>{item}</span>) : <em>Not assigned</em>}
          </div>
        </div>
        <div>
          <strong>Cooking Methods</strong>
          <div className="recipeIntelligenceChips">
            {methods.length ? methods.map((item) => <span key={`method-${item}`}>{item}</span>) : <em>Not assigned</em>}
          </div>
        </div>
        <div>
          <strong>Collections</strong>
          <div className="recipeIntelligenceChips">
            {collections.length ? collections.map((item) => <span key={`collection-${item}`}>{item}</span>) : <em>Not assigned</em>}
          </div>
        </div>
      </div>

      {classificationCount === 0 && (
        <p className="recipeIntelligenceNotice">
          This recipe can still be used normally, but RFIS search and recommendation quality will improve after its classification profile is completed.
        </p>
      )}
    </section>
  );
}
