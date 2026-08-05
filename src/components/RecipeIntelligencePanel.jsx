import React from "react";
import "./RecipeIntelligencePanel.css";

export default function RecipeIntelligencePanel({
  recipe,
  rfisPlatform,
}) {
  if (!recipe) return null;

  const roleSummary =
    rfisPlatform?.recommendations?.recipeRoleSummary?.(recipe.id) || {
      dinnerCount: 0,
      entreeCount: 0,
      sideCount: 0,
      relationships: [],
    };
  const profile = rfisPlatform?.recipes?.profile?.(recipe.id) || {
    category: "Not assigned",
    attributes: [],
    collections: [],
    cookingMethods: [],
    classificationCount: 0,
    classificationStatus: "Needs classification",
    hasNutritionRecord: false,
  };

  return (
    <section className="recipeIntelligencePanel" aria-label={`RFIS intelligence profile for ${recipe.title}`}>
      <div className="recipeIntelligencePanelHeader">
        <div>
          <span>RFIS PROFILE</span>
          <h3>Recipe Intelligence</h3>
        </div>
        <small className={profile.classificationCount > 0 ? "isReady" : "needsReview"}>{profile.classificationStatus}</small>
      </div>

      <div className="recipeIntelligenceMetrics">
        <article>
          <span>Category</span>
          <strong>{profile.category}</strong>
        </article>
        <article>
          <span>Complete Dinners</span>
          <strong>{roleSummary.dinnerCount}</strong>
          <small>{roleSummary.entreeCount} entrée · {roleSummary.sideCount} side</small>
        </article>
        <article>
          <span>Nutrition Record</span>
          <strong>{profile.hasNutritionRecord ? "Available" : "Not available"}</strong>
        </article>
        <article>
          <span>RFIS Tags</span>
          <strong>{profile.classificationCount}</strong>
          <small>attributes, collections, methods</small>
        </article>
      </div>

      <div className="recipeIntelligenceGroups">
        <div>
          <strong>Attributes</strong>
          <div className="recipeIntelligenceChips">
            {profile.attributes.length ? profile.attributes.map((item) => <span key={`attribute-${item}`}>{item}</span>) : <em>Not assigned</em>}
          </div>
        </div>
        <div>
          <strong>Cooking Methods</strong>
          <div className="recipeIntelligenceChips">
            {profile.cookingMethods.length ? profile.cookingMethods.map((item) => <span key={`method-${item}`}>{item}</span>) : <em>Not assigned</em>}
          </div>
        </div>
        <div>
          <strong>Collections</strong>
          <div className="recipeIntelligenceChips">
            {profile.collections.length ? profile.collections.map((item) => <span key={`collection-${item}`}>{item}</span>) : <em>Not assigned</em>}
          </div>
        </div>
      </div>

      {profile.classificationCount === 0 && (
        <p className="recipeIntelligenceNotice">
          This recipe can still be used normally, but RFIS search and recommendation quality will improve after its classification profile is completed.
        </p>
      )}
    </section>
  );
}
