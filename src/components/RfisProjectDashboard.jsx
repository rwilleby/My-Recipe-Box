import { useMemo } from "react";
import { COMPLETE_DINNER_META } from "../data/completeDinners.js";
import { recipes } from "../data/recipes.js";
import { hasRecipeNutritionRecord } from "../data/recipeNutritionProfiles.js";
import { RFIS_PROJECT_STATUS } from "../data/rfisProjectStatus.js";
import "./RfisProjectDashboard.css";

const normalize = (value) => String(value ?? "").trim().toLowerCase();

function MetricCard({ label, value, detail, tone = "neutral" }) {
  return (
    <article className={`rfisMetricCard rfisTone-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </article>
  );
}

function ProgressBar({ value, max, label }) {
  const percent = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;
  return (
    <div className="rfisProgress" aria-label={`${label}: ${value} of ${max}`}>
      <div className="rfisProgressTrack"><span style={{ width: `${percent}%` }} /></div>
      <b>{percent}%</b>
    </div>
  );
}

function StatusPill({ children, tone = "neutral" }) {
  return <span className={`rfisStatusPill rfisTone-${tone}`}>{children}</span>;
}

export default function RfisProjectDashboard({ rfisPlatform, onClose }) {
  const report = useMemo(() => {
    const validation = rfisPlatform.validation.all();
    const completeDinners = rfisPlatform.completeDinners.all();
    const recipeIds = new Set(rfisPlatform.recipes.all().map((recipe) => recipe.id));
    const nutritionCount = recipes.filter((recipe) => hasRecipeNutritionRecord(recipe.id)).length;
    const approvedHeroes = completeDinners.filter((dinner) => ["approved", "published"].includes(normalize(dinner.hero?.status))).length;
    const missingHeroes = completeDinners.length - approvedHeroes;

    const duplicateMap = new Map();
    for (const dinner of completeDinners) {
      const key = [dinner.entreeRecipeId, ...(dinner.sideRecipeIds || []).slice().sort()].join("|");
      duplicateMap.set(key, (duplicateMap.get(key) || 0) + 1);
    }
    const duplicateCompositions = [...duplicateMap.values()].filter((count) => count > 1).length;

    const missingRecipeRefs = [];
    for (const dinner of completeDinners) {
      for (const recipeId of [dinner.entreeRecipeId, ...(dinner.sideRecipeIds || [])]) {
        if (!recipeIds.has(recipeId)) missingRecipeRefs.push(`${dinner.legacyId}: ${recipeId}`);
      }
    }

    const sideUsage = new Map();
    for (const dinner of completeDinners) {
      for (const sideId of dinner.sideRecipeIds || []) sideUsage.set(sideId, (sideUsage.get(sideId) || 0) + 1);
    }
    const topSide = [...sideUsage.entries()].sort((a, b) => b[1] - a[1])[0] || ["—", 0];

    const relationshipCount = completeDinners.reduce((sum, dinner) => sum + 1 + (dinner.sideRecipeIds?.length || 0) + (dinner.collections?.length || 0), 0);
    const collectionRows = rfisPlatform.collections.list()
      .map(({ name, count }) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    const nextWork = [
      ...RFIS_PROJECT_STATUS.blockedSourceHeroes.slice(0, 5).map((code) => `Correct ${code} recipe hero`),
      ...RFIS_PROJECT_STATUS.compositionReviews.map((item) => `Resolve ${item.mealId} composition`),
      "Re-run Batch 1 visual reconciliation",
      "Issue replacement Batch 1 production tracker",
    ];

    return {
      validation: {
        ok: validation.ok,
        count: completeDinners.length,
        errors: [
          ...(validation.results?.references?.errors || []).map((item) => `${item.legacyId || item.dinnerId}: missing ${item.missingRecipeIds.join(", ")}`),
          ...(validation.results?.duplicateCompositions?.duplicates || []).map((item) => `Duplicate composition: ${item.dinnerIds.join(", ")}`),
          ...(validation.results?.sideCounts?.dinnerIds || []).map((id) => `${id}: invalid side count`),
          ...(validation.results?.collections?.missing || []).map((item) => `${item.collection}: missing ${item.dinnerId}`),
        ],
      },
      nutritionCount,
      approvedHeroes,
      missingHeroes,
      duplicateCompositions,
      missingRecipeRefs,
      relationshipCount,
      collectionRows,
      topSide,
      nextWork,
    };
  }, [rfisPlatform]);

  const releaseChecks = [
    { label: "Complete Dinner references valid", ok: report.validation.ok },
    { label: "Duplicate dinner compositions removed", ok: report.duplicateCompositions === 0 },
    { label: "All Complete Dinner heroes approved", ok: report.missingHeroes === 0 },
    { label: "All recipe nutrition records present", ok: report.nutritionCount === recipes.length },
    { label: "Batch 1 source corrections complete", ok: RFIS_PROJECT_STATUS.blockedSourceHeroes.length === 0 },
  ];

  return (
    <main className="rfisDashboardPage">
      <header className="rfisDashboardHeader">
        <div>
          <span className="rfisEyebrow">ADMIN · RFIS-001</span>
          <h1>RFIS Project Dashboard</h1>
          <p>Live project-health reporting from the recipe catalog, Complete Dinner data, validation rules, and hero-production status.</p>
        </div>
        <button type="button" className="secondary" onClick={onClose}>Back to Home</button>
      </header>

      <section className="rfisVersionStrip" aria-label="Project versions">
        <div><span>Website baseline</span><b>{RFIS_PROJECT_STATUS.websiteBaseline}</b></div>
        <div><span>RFIS</span><b>{RFIS_PROJECT_STATUS.rfisVersion}</b></div>
        <div><span>Dinner catalog</span><b>v{COMPLETE_DINNER_META.catalogVersion}</b></div>
        <div><span>Documentation</span><b>v{RFIS_PROJECT_STATUS.documentationVersion}</b></div>
      </section>

      <section className="rfisMetricGrid">
        <MetricCard label="Recipes" value={recipes.length} detail={`${report.nutritionCount} nutrition records`} tone="green" />
        <MetricCard label="Complete Dinners" value={completeDinners.length} detail={`${report.validation.count} catalog records validated`} tone="green" />
        <MetricCard label="Approved Dinner Heroes" value={`${report.approvedHeroes}/${completeDinners.length}`} detail={`${report.missingHeroes} still unavailable`} tone={report.missingHeroes ? "amber" : "green"} />
        <MetricCard label="Broken References" value={report.missingRecipeRefs.length} detail={report.validation.ok ? "Catalog validation passes" : "Review required"} tone={report.missingRecipeRefs.length ? "red" : "green"} />
        <MetricCard label="Duplicate Compositions" value={report.duplicateCompositions} detail="Exact entrée + side matches" tone={report.duplicateCompositions ? "red" : "green"} />
        <MetricCard label="RFIS Relationships" value={report.relationshipCount.toLocaleString()} detail={`${(report.relationshipCount / recipes.length).toFixed(1)} per recipe`} />
      </section>

      <div className="rfisDashboardColumns">
        <section className="rfisPanel">
          <div className="rfisPanelHeading"><h2>Hero Production</h2><StatusPill tone="amber">Active</StatusPill></div>
          <div className="rfisHeroTotals">
            <b>{report.approvedHeroes} approved</b>
            <span>{report.missingHeroes} pending</span>
          </div>
          <ProgressBar value={report.approvedHeroes} max={completeDinners.length} label="Complete Dinner heroes" />
          <div className="rfisBatchList">
            {RFIS_PROJECT_STATUS.heroBatches.map((batch) => (
              <article key={batch.id}>
                <div><b>{batch.label}</b><span>{batch.range}</span></div>
                <div className="rfisBatchCounts">
                  <span>{batch.approved} approved</span>
                  {batch.ready ? <span>{batch.ready} ready</span> : null}
                  {batch.blocked ? <span className="rfisTextRed">{batch.blocked} blocked</span> : null}
                  {batch.review ? <span className="rfisTextAmber">{batch.review} review</span> : null}
                  {batch.status === "not-audited" ? <span>not audited</span> : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rfisPanel">
          <div className="rfisPanelHeading"><h2>Validation & Risk</h2><StatusPill tone={report.validation.ok ? "green" : "red"}>{report.validation.ok ? "PASS" : "REVIEW"}</StatusPill></div>
          <ul className="rfisCheckList">
            <li><b>{report.validation.ok ? "✓" : "!"}</b><span>Complete Dinner catalog validation</span></li>
            <li><b>{report.duplicateCompositions === 0 ? "✓" : "!"}</b><span>{report.duplicateCompositions} duplicate compositions</span></li>
            <li><b>{report.missingRecipeRefs.length === 0 ? "✓" : "!"}</b><span>{report.missingRecipeRefs.length} missing recipe references</span></li>
            <li><b>!</b><span>{RFIS_PROJECT_STATUS.blockedSourceHeroes.length} blocked Batch 1 source heroes</span></li>
            <li><b>i</b><span>Most-used side: {report.topSide[0]} ({report.topSide[1]} dinners)</span></li>
          </ul>
          {report.validation.errors.length ? (
            <details className="rfisErrorDetails"><summary>Validation details</summary><ul>{report.validation.errors.map((error) => <li key={error}>{error}</li>)}</ul></details>
          ) : null}
        </section>
      </div>

      <div className="rfisDashboardColumns">
        <section className="rfisPanel">
          <div className="rfisPanelHeading"><h2>Collection Health</h2><StatusPill>{report.collectionRows.length} collections</StatusPill></div>
          <div className="rfisCollectionTable">
            {report.collectionRows.map((collection) => (
              <div key={collection.name}><span>{collection.name}</span><b>{collection.count}</b></div>
            ))}
          </div>
        </section>

        <section className="rfisPanel">
          <div className="rfisPanelHeading"><h2>Recommended Next Work</h2><StatusPill tone="amber">Priority order</StatusPill></div>
          <ol className="rfisNextWork">
            {report.nextWork.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </section>
      </div>

      <div className="rfisDashboardColumns">
        <section className="rfisPanel">
          <div className="rfisPanelHeading"><h2>Documentation</h2><StatusPill tone="green">Current</StatusPill></div>
          <div className="rfisDocumentList">
            {RFIS_PROJECT_STATUS.documentation.map((doc) => (
              <div key={doc.name}><span>{doc.name}</span><StatusPill tone={doc.status === "current" ? "green" : "amber"}>v{doc.version}</StatusPill></div>
            ))}
          </div>
        </section>

        <section className="rfisPanel">
          <div className="rfisPanelHeading"><h2>Release Readiness</h2><StatusPill tone={releaseChecks.every((item) => item.ok) ? "green" : "amber"}>Not ready</StatusPill></div>
          <ul className="rfisReleaseList">
            {releaseChecks.map((item) => <li key={item.label} className={item.ok ? "isReady" : "isOpen"}><b>{item.ok ? "✓" : "○"}</b><span>{item.label}</span></li>)}
          </ul>
        </section>
      </div>
    </main>
  );
}
