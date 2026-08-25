import { useEffect, useMemo, useState } from "react";
import {
  MAIN_CATEGORIES,
  MEAL_BUILDER_MAIN_IDS,
  MEAL_BUILDER_MAIN_LAYOUTS,
  MEAL_BUILDER_SIDE_IDS,
  MealBuilderTrayPreview,
} from "./BuildYourOwnMealPage.jsx";
import "./AdminMealBuilderImageAudit.css";

const STORAGE_KEY = "rrb_mealBuilderImageAudit_v1";
const PAGE_SIZE = 24;

function loadReviews() {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function recipeTitle(recipe) {
  return recipe?.title || recipe?.name || recipe?.recipeName || "Recipe record unavailable";
}

function categoryCode(id = "") {
  return String(id).split("-")[0] || "";
}

function assetPath(kind, id) {
  const folder = kind === "main" ? "main" : kind === "side-one" ? "side-1-middle" : "side-2-right";
  return `images/build-your-own/${folder}/${id}.webp`;
}

function downloadFile(name, contents, type) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function AssetProbe({ src, onResult }) {
  useEffect(() => {
    let active = true;
    const image = new Image();
    image.onload = () => active && onResult({ loaded: true, width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => active && onResult({ loaded: false, width: 0, height: 0 });
    image.src = src;
    return () => { active = false; };
  }, [src, onResult]);
  return null;
}

function AuditCard({ item, review, onReview }) {
  const [assetInfo, setAssetInfo] = useState(null);
  const layout = item.kind === "main" ? item.layout : "standard";
  const previewProps = item.kind === "main"
    ? { mainRecipe: item.recipe, sideOneRecipe: null, sideTwoRecipe: null }
    : item.kind === "side-one"
      ? { mainRecipe: null, sideOneRecipe: item.recipe, sideTwoRecipe: null }
      : { mainRecipe: null, sideOneRecipe: null, sideTwoRecipe: item.recipe };
  const src = `${import.meta.env.BASE_URL}${assetPath(item.kind, item.id)}`;
  const stateClass = review?.status ? ` is-${review.status}` : "";

  return (
    <article className={`mealBuilderAuditCard${stateClass}`}>
      <AssetProbe src={src} onResult={setAssetInfo} />
      <div className="mealBuilderAuditTray">
        <MealBuilderTrayPreview {...previewProps} mainTrayLayout={layout} />
      </div>
      <header>
        <div><strong>{item.id}</strong><span>{recipeTitle(item.recipe)}</span></div>
        <em>{item.kind === "main" ? layout.replace("-", " ") : item.kind === "side-one" ? "middle" : "right"}</em>
      </header>
      <div className={`mealBuilderAuditTechnical${assetInfo?.loaded === false ? " is-error" : ""}`}>
        <span>{assetInfo === null ? "Checking image…" : assetInfo.loaded ? `${assetInfo.width} × ${assetInfo.height} WebP` : "IMAGE FAILED TO LOAD"}</span>
        <span>{assetInfo?.loaded ? "Loaded" : assetInfo === null ? "Pending" : "Missing/invalid"}</span>
      </div>
      <label className="mealBuilderAuditNote">
        <span>Correction note</span>
        <input
          value={review?.note || ""}
          onChange={(event) => onReview(item.key, { status: review?.status || "needs-fix", note: event.target.value })}
          placeholder="Example: food too small or wrong compartment"
        />
      </label>
      <div className="mealBuilderAuditDecisions" aria-label={`Review ${item.id}`}>
        <button type="button" className="pass" aria-pressed={review?.status === "pass"} onClick={() => onReview(item.key, { status: "pass", note: review?.note || "" })}>Pass</button>
        <button type="button" className="fix" aria-pressed={review?.status === "needs-fix"} onClick={() => onReview(item.key, { status: "needs-fix", note: review?.note || "" })}>Needs Correction</button>
        <button type="button" className="clear" disabled={!review} onClick={() => onReview(item.key, null)} aria-label={`Clear review for ${item.id}`}>Clear</button>
      </div>
    </article>
  );
}

export default function AdminMealBuilderImageAudit({ recipes = [], onClose }) {
  const [kind, setKind] = useState("main");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [layout, setLayout] = useState("ALL");
  const [reviewFilter, setReviewFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState(loadReviews);
  const unlocked = (() => {
    try { return window.sessionStorage.getItem("rrb-admin-unlocked") === "true"; }
    catch { return false; }
  })();

  const recipeMap = useMemo(() => new Map(recipes.map((recipe) => [recipe.id, recipe])), [recipes]);
  const items = useMemo(() => {
    const ids = kind === "main" ? [...MEAL_BUILDER_MAIN_IDS] : [...MEAL_BUILDER_SIDE_IDS];
    return ids.map((id) => ({
      id,
      key: `${kind}:${id}`,
      kind,
      recipe: recipeMap.get(id) || { id, title: "Recipe record unavailable" },
      layout: kind === "main" ? MEAL_BUILDER_MAIN_LAYOUTS.get(id) || "standard" : "standard",
    }));
  }, [kind, recipeMap]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category !== "ALL" && categoryCode(item.id) !== category) return false;
      if (layout !== "ALL" && item.layout !== layout) return false;
      const reviewStatus = reviews[item.key]?.status || "unreviewed";
      if (reviewFilter !== "ALL" && reviewStatus !== reviewFilter) return false;
      return !term || `${item.id} ${recipeTitle(item.recipe)}`.toLowerCase().includes(term);
    });
  }, [items, category, layout, query, reviewFilter, reviews]);

  const counts = useMemo(() => items.reduce((result, item) => {
    const status = reviews[item.key]?.status || "unreviewed";
    result[status] += 1;
    return result;
  }, { pass: 0, "needs-fix": 0, unreviewed: 0 }), [items, reviews]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [kind, query, category, layout, reviewFilter]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews)); }
    catch { /* Review remains available for this session. */ }
  }, [reviews]);

  function updateReview(key, value) {
    setReviews((current) => {
      const next = { ...current };
      if (value) next[key] = { ...value, reviewedAt: new Date().toISOString() };
      else delete next[key];
      return next;
    });
  }

  function exportCorrections() {
    const rows = Object.entries(reviews)
      .filter(([, review]) => review.status === "needs-fix")
      .map(([key, review]) => {
        const [assetKind, id] = key.split(":");
        const recipe = recipeMap.get(id);
        return [assetKind, id, recipeTitle(recipe), assetPath(assetKind, id), review.note || "", review.reviewedAt || ""];
      });
    const escape = (value) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [["Position", "Recipe Code", "Recipe Name", "Asset Path", "Correction Needed", "Reviewed At"], ...rows]
      .map((row) => row.map(escape).join(",")).join("\n");
    downloadFile("build-a-meal-image-corrections.csv", csv, "text/csv;charset=utf-8");
  }

  if (!unlocked) {
    return <main className="mealBuilderAuditPage is-locked"><h1>Build-A-Meal Image Audit</h1><p>This administrative page is locked. Return to Home and unlock the Admin controls first.</p><button type="button" onClick={onClose}>Return Home</button></main>;
  }

  return (
    <main className="mealBuilderAuditPage">
      <header className="mealBuilderAuditHeader">
        <div><span>ADMIN QUALITY CONTROL</span><h1>Build-A-Meal Image Audit</h1><p>Review every main and directional side image inside the same tray construction used on the public Build-A-Meal page.</p></div>
        <div><button type="button" onClick={exportCorrections}>Export Correction List</button><button type="button" className="secondary" onClick={onClose}>Close Audit</button></div>
      </header>

      <nav className="mealBuilderAuditTabs" aria-label="Asset position">
        {[["main", "Main Dishes"], ["side-one", "Side 1 — Middle"], ["side-two", "Side 2 — Right"]].map(([value, label]) => <button type="button" key={value} className={kind === value ? "active" : ""} onClick={() => setKind(value)}>{label}</button>)}
      </nav>

      <section className="mealBuilderAuditSummary" aria-label="Audit progress">
        <div><strong>{items.length}</strong><span>Total</span></div><div className="pass"><strong>{counts.pass}</strong><span>Passed</span></div><div className="fix"><strong>{counts["needs-fix"]}</strong><span>Needs Correction</span></div><div><strong>{counts.unreviewed}</strong><span>Unreviewed</span></div>
      </section>

      <section className="mealBuilderAuditFilters" aria-label="Audit filters">
        <label><span>Search</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Recipe code or name" /></label>
        <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="ALL">All Categories</option>{(kind === "main" ? MAIN_CATEGORIES : [["SD", "Side Dishes"]]).map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
        {kind === "main" && <label><span>Tray Layout</span><select value={layout} onChange={(event) => setLayout(event.target.value)}><option value="ALL">All Layouts</option><option value="standard">1/3 Main</option><option value="two-thirds">2/3 Main</option><option value="full-tray">Full Tray Main</option></select></label>}
        <label><span>Review Status</span><select value={reviewFilter} onChange={(event) => setReviewFilter(event.target.value)}><option value="ALL">All Statuses</option><option value="unreviewed">Unreviewed</option><option value="pass">Passed</option><option value="needs-fix">Needs Correction</option></select></label>
      </section>

      <div className="mealBuilderAuditResultLine"><strong>{filtered.length}</strong> matching image{filtered.length === 1 ? "" : "s"}<span>Page {page} of {pageCount}</span></div>
      <section className="mealBuilderAuditGrid">
        {visibleItems.map((item) => <AuditCard key={item.key} item={item} review={reviews[item.key]} onReview={updateReview} />)}
        {!visibleItems.length && <p className="mealBuilderAuditEmpty">No images match the current filters.</p>}
      </section>
      <nav className="mealBuilderAuditPagination" aria-label="Audit pages"><button type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button><span>Page {page} of {pageCount}</span><button type="button" disabled={page === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next</button></nav>
    </main>
  );
}
