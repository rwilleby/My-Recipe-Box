import { useEffect, useMemo, useState } from "react";
import FoodIntelligenceCard from "./FoodIntelligenceCard";
import {
  getRecipeNutritionRecord,
  getRecipeNutritionVariant,
} from "../data/recipeNutritionProfiles";

const AUDIT_STORAGE_KEY = "rrb_nutritionAuditStatuses";
const SETTINGS_STORAGE_KEY = "rrb_nutritionInspectorSettings";

function loadJson(key, fallback) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "null");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeValue(value) {
  return value === undefined || value === null || value === "" ? "—" : value;
}

function numericNutritionAvailable(profile) {
  const facts = profile?.nutritionFacts || {};
  return [facts.calories, facts.protein, facts.totalCarbohydrate, facts.totalFat, facts.sodium]
    .some((value) => typeof value === "number" || /\d/.test(String(value || "")));
}

function profileCompleteness(profile) {
  if (!profile) return false;
  const facts = profile.nutritionFacts || {};
  return Boolean(
    facts.servingSize &&
    facts.servingsPerRecipe &&
    numericNutritionAvailable(profile)
  );
}

function deriveStatus(record, profile) {
  if (!record || !profile) return { level: "red", label: "Not Ready" };
  if (!profileCompleteness(profile)) return { level: "red", label: "Not Ready" };
  if (record.status === "verified") return { level: "green", label: "Card Ready" };
  return { level: "yellow", label: "Estimated — Usable" };
}

function factsSummary(profile) {
  const facts = profile?.nutritionFacts || {};
  return {
    calories: normalizeValue(facts.calories),
    protein: normalizeValue(facts.protein),
    carbs: normalizeValue(facts.totalCarbohydrate),
    fat: normalizeValue(facts.totalFat),
    fiber: normalizeValue(facts.dietaryFiber),
    sodium: normalizeValue(facts.sodium),
  };
}

function StatusBadge({ status }) {
  return <span className={`nutritionAdminStatus ${status.level}`}>{status.label}</span>;
}

function NutritionFactsTable({ profile }) {
  const facts = profile?.nutritionFacts || {};
  const rows = [
    ["Serving description", facts.servingSize],
    ["Serving grams", facts.servingGrams],
    ["Servings per recipe", facts.servingsPerRecipe],
    ["Calories", facts.calories],
    ["Protein", facts.protein],
    ["Carbohydrates", facts.totalCarbohydrate],
    ["Fat", facts.totalFat],
    ["Saturated fat", facts.saturatedFat],
    ["Fiber", facts.dietaryFiber],
    ["Total sugar", facts.totalSugars],
    ["Added sugar", facts.addedSugars],
    ["Sodium", facts.sodium],
    ["Potassium", facts.potassium],
  ];
  return <dl className="nutritionAdminFacts">{rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{normalizeValue(value)}</dd></div>)}</dl>;
}

function rawRecord(recipeCode, record, recipe) {
  if (!record) return { recipeCode, recipeName: recipe?.title || "Unknown", status: "not-available", message: "Nutrition record not available. No values were invented." };
  return record;
}

export default function AdminNutritionDatabase({ recipes = [], onClose }) {
  const [mode, setMode] = useState("lookup");
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCode, setSelectedCode] = useState("MX-010");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [preview, setPreview] = useState(false);
  const [inspectorTab, setInspectorTab] = useState("summary");
  const [auditStatuses, setAuditStatuses] = useState(() => loadJson(AUDIT_STORAGE_KEY, {}));

  useEffect(() => {
    const settings = loadJson(SETTINGS_STORAGE_KEY, {});
    if (settings.mode) setMode(settings.mode);
    if (settings.inspectorTab) setInspectorTab(settings.inspectorTab);
  }, []);

  useEffect(() => {
    saveJson(SETTINGS_STORAGE_KEY, { mode, inspectorTab });
  }, [mode, inspectorTab]);

  const seriesOptions = useMemo(() => [...new Set(recipes.map((recipe) => String(recipe.id || "").split("-")[0]).filter(Boolean))].sort(), [recipes]);

  const rows = useMemo(() => recipes
    .filter((recipe) => String(recipe.id).toUpperCase() !== "AM-063")
    .map((recipe) => {
      const code = String(recipe.id || "").toUpperCase();
      const record = getRecipeNutritionRecord(code);
      const selected = record ? getRecipeNutritionVariant(code, record.defaultVariant) : null;
      const profile = selected?.profile || null;
      return {
        code,
        name: recipe.title,
        series: code.split("-")[0],
        recipe,
        record,
        profile,
        status: deriveStatus(record, profile),
        summary: factsSummary(profile),
      };
    }), [recipes]);

  const filteredRows = useMemo(() => {
    const text = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (text && !`${row.code} ${row.name}`.toLowerCase().includes(text)) return false;
      if (series !== "all" && row.series !== series) return false;
      if (statusFilter !== "all" && row.status.level !== statusFilter) return false;
      return true;
    });
  }, [rows, query, series, statusFilter]);

  const selectedRow = rows.find((row) => row.code === selectedCode) || filteredRows[0] || rows[0];
  const record = selectedRow?.record || null;
  const variantKeys = Object.keys(record?.variants || {});
  const effectiveVariant = selectedVariant && record?.variants?.[selectedVariant]
    ? selectedVariant
    : record?.defaultVariant || variantKeys[0] || "";
  const profile = effectiveVariant ? record?.variants?.[effectiveVariant] : null;
  const status = deriveStatus(record, profile);
  const unresolvedIssues = profileCompleteness(profile) ? [] : [{ id: "missing-profile-data", priority: "Critical", category: "Incomplete profile", assumption: "No complete stored nutrition profile is available.", correction: "Add reviewed serving and nutrition values to the local nutrition data record.", impact: "Food Intelligence Card cannot be marked ready.", status: auditStatuses[selectedRow?.code]?.["missing-profile-data"] || "Open" }];

  useEffect(() => {
    setSelectedVariant("");
    setPreview(false);
    setShowDetails(false);
  }, [selectedCode]);

  function updateIssue(issueId, value) {
    const next = { ...auditStatuses, [selectedRow.code]: { ...(auditStatuses[selectedRow.code] || {}), [issueId]: value } };
    setAuditStatuses(next);
    saveJson(AUDIT_STORAGE_KEY, next);
  }

  async function copyJson() {
    const text = JSON.stringify(rawRecord(selectedRow.code, record, selectedRow.recipe), null, 2);
    await navigator.clipboard.writeText(text);
  }

  function downloadJson() {
    const text = JSON.stringify(rawRecord(selectedRow.code, record, selectedRow.recipe), null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedRow.code}-nutrition.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return <main className="nutritionAdminPage">
    <header className="nutritionAdminHeader">
      <div><span>ADMIN ONLY</span><h1>Nutrition Database</h1><p>Search and inspect stored nutrition records. Missing values are never invented or calculated in the browser.</p></div>
      <button type="button" onClick={onClose}>Close Admin</button>
    </header>

    <nav className="nutritionAdminModeTabs" aria-label="Nutrition database tools">
      <button className={mode === "lookup" ? "active" : ""} onClick={() => setMode("lookup")}>Nutrition Database Lookup</button>
      <button className={mode === "inspector" ? "active" : ""} onClick={() => setMode("inspector")}>Nutrition Record Inspector</button>
    </nav>

    <section className="nutritionAdminSearch">
      <label><span>Search by recipe code or name</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="MX-010 or Quesadillas" /></label>
      <label><span>Series</span><select value={series} onChange={(event)=>setSeries(event.target.value)}><option value="all">All series</option>{seriesOptions.map((item)=><option key={item}>{item}</option>)}</select></label>
      <label><span>Status</span><select value={statusFilter} onChange={(event)=>setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="green">Card Ready</option><option value="yellow">Estimated — Usable</option><option value="red">Not Ready</option></select></label>
    </section>

    <div className="nutritionAdminWorkspace">
      <aside className="nutritionAdminResults" aria-label="Nutrition search results">
        <p>{filteredRows.length} recipes</p>
        {filteredRows.slice(0,250).map((row)=><button key={row.code} className={selectedRow?.code===row.code?"selected":""} onClick={()=>setSelectedCode(row.code)}>
          <span><b>{row.code}</b><small>{row.name}</small></span><StatusBadge status={row.status}/>
          <span className="nutritionResultMetrics"><small>{row.summary.calories} cal</small><small>{row.summary.protein} protein</small><small>{row.summary.sodium} sodium</small></span>
        </button>)}
      </aside>

      {selectedRow && <section className="nutritionAdminDetail">
        <header className="nutritionAdminRecipeHeader"><div><span>{selectedRow.series}</span><h2>{selectedRow.code} — {selectedRow.name}</h2></div><StatusBadge status={status}/></header>

        {mode === "lookup" ? <>
          <div className="nutritionAdminSummaryGrid">
            <section><h3>Recipe identity</h3><p><b>Code:</b> {selectedRow.code}</p><p><b>Name:</b> {selectedRow.name}</p><p><b>Category:</b> {selectedRow.recipe.category || selectedRow.series}</p></section>
            <section><h3>Data status</h3><p><b>Confidence:</b> {record?.confidence || "Not assigned"}</p><p><b>Calculation status:</b> {record?.status || "Not available"}</p><p><b>Food Intelligence readiness:</b> {status.label}</p><p><b>Finished-weight status:</b> {profile?.nutritionFacts?.servingGrams ? "Stored" : "Not yet defined"}</p></section>
          </div>
          <section><h3>Default nutrition profile</h3>{profile ? <NutritionFactsTable profile={profile}/> : <p className="nutritionAdminError">Nutrition record not available.<br/>No values were invented.</p>}</section>
          <section className="nutritionAdminIssue"><h3>Most important unresolved issue</h3><p>{unresolvedIssues[0]?.correction || "No critical unresolved issue is stored."}</p>{unresolvedIssues.length>1 && <button onClick={()=>setShowDetails(v=>!v)}>{showDetails?"Hide Details":"Show Details"}</button>}</section>
        </> : <>
          <nav className="nutritionInspectorTabs">{["summary","variants","nutrition","products","issues","json"].map((tab)=><button key={tab} className={inspectorTab===tab?"active":""} onClick={()=>setInspectorTab(tab)}>{({summary:"Summary",variants:"Variants & Methods",nutrition:"Nutrition Record",products:"Products & Sauces",issues:"Audit Issues",json:"Raw JSON"})[tab]}</button>)}</nav>
          {inspectorTab === "summary" && <section><h3>Summary</h3><dl className="nutritionAdminFacts"><div><dt>Recipe code</dt><dd>{selectedRow.code}</dd></div><div><dt>Recipe name</dt><dd>{selectedRow.name}</dd></div><div><dt>Series</dt><dd>{selectedRow.series}</dd></div><div><dt>Active status</dt><dd>{selectedRow.code === "AM-063" ? "Retired" : "Active"}</dd></div><div><dt>Default profile</dt><dd>{record?.defaultVariant || "Not available"}</dd></div><div><dt>Confidence</dt><dd>{record?.confidence || "Not assigned"}</dd></div><div><dt>FIC readiness</dt><dd>{status.label}</dd></div></dl></section>}
          {inspectorTab === "variants" && <section><h3>Variants & Methods</h3>{variantKeys.length ? <><label className="nutritionVariantSelect"><span>Preview profile</span><select value={effectiveVariant} onChange={(event)=>setSelectedVariant(event.target.value)}>{variantKeys.map((key)=><option value={key} key={key}>{record.variants[key].label}{key===record.defaultVariant?" — DEFAULT":""}</option>)}</select></label><NutritionFactsTable profile={profile}/><p><b>Confidence:</b> {profile?.confidence || record?.confidence || "Not assigned"}</p><p><b>Default rule notes:</b> Ground beef defaults must use 90/10; air-fryer profiles use 0 g method oil unless oil is an explicit ingredient.</p></> : <p>Nutrition record not available. No values were invented.</p>}</section>}
          {inspectorTab === "nutrition" && <section><h3>Nutrition Record</h3>{profile ? <NutritionFactsTable profile={profile}/> : <p>Nutrition record not available. No values were invented.</p>}</section>}
          {inspectorTab === "products" && <section><h3>Products & Sauces</h3><p>No product-dependent component records are stored for this recipe.</p><p><b>Retailer priority:</b> Walmart / Great Value, H-E-B, Kroger, generic fallback.</p><p><b>Sauce priority:</b> reduced-sodium, lite/lower-sugar, regular, with mapped MHS alternatives.</p><p>Unavailable options are marked: <b>Not yet defined</b>.</p></section>}
          {inspectorTab === "issues" && <section><h3>Audit Issues</h3>{unresolvedIssues.length ? unresolvedIssues.map((issue)=><details key={issue.id} className="nutritionAuditIssue"><summary>{issue.priority} — {issue.category}</summary><p><b>Current assumption:</b> {issue.assumption}</p><p><b>Correction needed:</b> {issue.correction}</p><p><b>Nutrition impact:</b> {issue.impact}</p><label><span>Status</span><select value={auditStatuses[selectedRow.code]?.[issue.id] || issue.status} onChange={(event)=>updateIssue(issue.id,event.target.value)}><option>Open</option><option>In Progress</option><option>Resolved</option></select></label></details>) : <p>No unresolved issues are stored.</p>}</section>}
          {inspectorTab === "json" && <section><h3>Raw JSON</h3><pre className="nutritionRawJson">{JSON.stringify(rawRecord(selectedRow.code, record, selectedRow.recipe), null, 2)}</pre><div className="nutritionJsonActions"><button onClick={copyJson}>Copy JSON</button><button onClick={downloadJson}>Download Recipe JSON</button></div></section>}
        </>}

        <div className="nutritionAdminPreviewActions"><button disabled={!profileCompleteness(profile)} onClick={()=>setPreview(v=>!v)}>{preview?"Close Food Intelligence Preview":"Preview Food Intelligence Card"}</button>{!profileCompleteness(profile) && <span>This profile is incomplete and cannot generate a Food Intelligence Card.</span>}</div>
        {preview && profileCompleteness(profile) && <div className="nutritionAdminFicPreview"><FoodIntelligenceCard recipeCode={selectedRow.code}/></div>}
      </section>}
    </div>
  </main>;
}
