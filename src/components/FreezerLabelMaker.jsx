import { useEffect, useMemo, useState } from "react";
import {
  FREEZER_LABEL_LAYOUTS,
  FREEZER_LABEL_STORAGE_KEY,
  addFreezerMonths,
  expandFreezerLabelQueue,
  formatFreezerLabelDate,
  localFreezerLabelDate,
  normalizeFreezerLabelState,
  paginateFreezerLabels,
} from "../utils/freezerLabels.js";
import "./FreezerLabelMaker.css";

const EMPTY_FORM = () => {
  const frozenDate = localFreezerLabelDate();
  return {
    kind: "portion",
    sourceId: "",
    name: "",
    frozenDate,
    useByDate: addFreezerMonths(frozenDate, 3),
    amount: "2 servings",
    instructions: "Thaw overnight in the refrigerator. Reheat until hot throughout.",
    notes: "",
    copies: 1,
  };
};

function loadState() {
  try {
    return normalizeFreezerLabelState(JSON.parse(window.localStorage.getItem(FREEZER_LABEL_STORAGE_KEY) || "{}"));
  } catch {
    return normalizeFreezerLabelState({});
  }
}

function sourceTitle(meal, recipeById) {
  if (meal.title) return meal.title;
  const main = recipeById.get(String(meal.mainRecipeId || meal.mainId || "").toLowerCase());
  return main?.title ? `${main.title} Complete Dinner` : (meal.rfisId || meal.id || "Complete Dinner");
}

function PrintableLabel({ label }) {
  return (
    <article className="freezerPrintableLabel">
      <div className="freezerLabelBrand">ROBERT'S RECIPE BOX <span>❄</span></div>
      <h3>{label.name}</h3>
      <div className="freezerLabelFacts">
        <span><small>FROZEN</small><strong>{formatFreezerLabelDate(label.frozenDate)}</strong></span>
        <span><small>USE BY</small><strong>{formatFreezerLabelDate(label.useByDate)}</strong></span>
        <span><small>AMOUNT</small><strong>{label.amount || "—"}</strong></span>
      </div>
      {label.instructions && <p><strong>TO SERVE:</strong> {label.instructions}</p>}
      {label.notes && <p className="freezerLabelNotes"><strong>NOTE:</strong> {label.notes}</p>}
    </article>
  );
}

export default function FreezerLabelMaker({ recipes = [], completeMeals = [] }) {
  const [saved, setSaved] = useState(loadState);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const recipeById = useMemo(() => new Map(recipes.map((recipe) => [String(recipe.id).toLowerCase(), recipe])), [recipes]);
  const sources = useMemo(() => {
    if (form.kind === "portion") return recipes.map((recipe) => ({ id: recipe.id, name: `${recipe.id} · ${recipe.title}`, title: recipe.title, amount: `${recipe.servings || 2} servings` }));
    if (form.kind === "dinner") return completeMeals.map((meal) => ({ id: meal.rfisId || meal.id, name: `${meal.rfisId || meal.id} · ${sourceTitle(meal, recipeById)}`, title: sourceTitle(meal, recipeById), amount: `${meal.servings || 2} servings` }));
    return [];
  }, [completeMeals, form.kind, recipeById, recipes]);
  const filteredSources = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? sources.filter((item) => `${item.id} ${item.name}`.toLowerCase().includes(term)).slice(0, 80) : sources.slice(0, 80);
  }, [search, sources]);
  const labels = useMemo(() => expandFreezerLabelQueue(saved.queue), [saved.queue]);
  const pages = useMemo(() => paginateFreezerLabels(labels, saved.layout), [labels, saved.layout]);

  useEffect(() => {
    window.localStorage.setItem(FREEZER_LABEL_STORAGE_KEY, JSON.stringify(saved));
    window.localStorage.setItem("rrb_has_custom_user_information", "true");
    window.dispatchEvent(new CustomEvent("rrb:user-data-changed"));
  }, [saved]);

  function changeKind(kind) {
    setSearch("");
    setForm((current) => ({ ...current, kind, sourceId: "", name: "", amount: kind === "ingredient" ? "1 package" : "2 servings" }));
  }

  function chooseSource(sourceId) {
    const source = sources.find((item) => String(item.id) === sourceId);
    setForm((current) => ({ ...current, sourceId, name: source?.title || current.name, amount: source?.amount || current.amount }));
  }

  function addLabel(event) {
    event.preventDefault();
    if (!form.name.trim()) return;
    const item = { ...form, id: `freezer-label-${Date.now()}`, name: form.name.trim(), copies: Math.min(30, Math.max(1, Number(form.copies) || 1)), createdAt: new Date().toISOString() };
    setSaved((current) => ({ ...current, queue: [...current.queue, item] }));
    setForm(EMPTY_FORM());
    setSearch("");
  }

  function removeLabel(id) {
    setSaved((current) => ({ ...current, queue: current.queue.filter((item) => item.id !== id) }));
  }

  function reuseLabel(item) {
    setForm({ kind: item.kind, sourceId: item.sourceId || "", name: item.name, frozenDate: localFreezerLabelDate(), useByDate: addFreezerMonths(localFreezerLabelDate(), 3), amount: item.amount, instructions: item.instructions, notes: item.notes, copies: 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function printLabels() {
    if (!labels.length) return;
    setSaved((current) => ({ ...current, history: [...current.queue.map((item) => ({ ...item, printedAt: new Date().toISOString() })), ...current.history].slice(0, 100) }));
    document.body.classList.add("printingFreezerLabels");
    window.setTimeout(() => window.print(), 50);
  }

  useEffect(() => {
    const cleanup = () => document.body.classList.remove("printingFreezerLabels");
    window.addEventListener("afterprint", cleanup);
    return () => { cleanup(); window.removeEventListener("afterprint", cleanup); };
  }, []);

  return (
    <main className="pageShell freezerLabelMakerPage">
      <section className="freezerLabelIntro">
        <h2>Create Freezer Labels</h2>
        <p>Make clear labels for individual portions, Complete Dinners, and bulk-prepared ingredients. Print them on plain paper, cut along the borders, and attach them with freezer-safe tape.</p>
      </section>

      <div className="freezerLabelWorkspace">
        <form className="freezerLabelForm" onSubmit={addLabel}>
          <h3>1. Label Details</h3>
          <div className="freezerLabelKindTabs" role="tablist" aria-label="Label type">
            {[['portion','Individual Portion'],['dinner','Complete Dinner'],['ingredient','Bulk Ingredient']].map(([id,label]) => <button type="button" role="tab" aria-selected={form.kind === id} className={form.kind === id ? "active" : ""} onClick={() => changeKind(id)} key={id}>{label}</button>)}
          </div>

          {form.kind !== "ingredient" && <div className="freezerLabelSourcePicker">
            <label><span>Find {form.kind === "dinner" ? "a Complete Dinner" : "a recipe"}</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or code" /></label>
            <label><span>Select</span><select value={form.sourceId} onChange={(event) => chooseSource(event.target.value)}><option value="">Choose from the list…</option>{filteredSources.map((source) => <option value={source.id} key={source.id}>{source.name}</option>)}</select></label>
          </div>}

          <label className="freezerLabelWide"><span>Food or meal name *</span><input required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder={form.kind === "ingredient" ? "Example: Cooked shredded chicken" : "Name printed on the label"} /></label>
          <div className="freezerLabelFieldGrid">
            <label><span>Date frozen</span><input type="date" value={form.frozenDate} onChange={(event) => setForm((current) => ({ ...current, frozenDate: event.target.value }))} /></label>
            <label><span>Use by</span><input type="date" value={form.useByDate} onChange={(event) => setForm((current) => ({ ...current, useByDate: event.target.value }))} /></label>
            <label><span>Servings or quantity</span><input value={form.amount} onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))} placeholder="2 servings or 1 cup" /></label>
            <label><span>Number of copies</span><input type="number" min="1" max="30" value={form.copies} onChange={(event) => setForm((current) => ({ ...current, copies: event.target.value }))} /></label>
          </div>
          <label className="freezerLabelWide"><span>Thawing, reheating, or preparation instructions</span><textarea rows="3" value={form.instructions} onChange={(event) => setForm((current) => ({ ...current, instructions: event.target.value }))} /></label>
          <label className="freezerLabelWide"><span>Optional note</span><input value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Example: Add fresh parsley after reheating" /></label>
          <button className="primary freezerLabelAddButton" type="submit">Add Label to Print Page</button>
        </form>

        <aside className="freezerLabelLivePreview" aria-label="Current label preview">
          <h3>Label Preview</h3>
          <PrintableLabel label={{ ...form, name: form.name || "Your Freezer Item" }} />
          <p>The printed label uses black ink and a white background for easy reading and economical printing.</p>
        </aside>
      </div>

      <section className="freezerLabelQueue">
        <div className="freezerLabelQueueHeader"><div><h3>2. Print Page</h3><p>{labels.length} label{labels.length === 1 ? "" : "s"} ready</p></div><label><span>Plain-paper layout</span><select value={saved.layout} onChange={(event) => setSaved((current) => ({ ...current, layout: event.target.value }))}>{Object.values(FREEZER_LABEL_LAYOUTS).map((layout) => <option value={layout.id} key={layout.id}>{layout.name}</option>)}</select></label></div>
        {saved.queue.length ? <div className="freezerLabelQueueList">{saved.queue.map((item) => <article key={item.id}><div><strong>{item.name}</strong><span>{item.amount} · Frozen {formatFreezerLabelDate(item.frozenDate)} · {item.copies} cop{item.copies === 1 ? "y" : "ies"}</span></div><button type="button" onClick={() => reuseLabel(item)}>Edit a Copy</button><button type="button" className="danger" onClick={() => removeLabel(item.id)}>Remove</button></article>)}</div> : <div className="freezerLabelEmpty">Add a label above to begin building your printable page.</div>}
        <div className="freezerLabelActions"><button type="button" className="primary" disabled={!labels.length} onClick={() => setShowPreview(true)}>Preview Print Page</button><button type="button" className="secondary" disabled={!labels.length} onClick={printLabels}>Print Labels</button><button type="button" className="secondary" disabled={!saved.queue.length} onClick={() => setSaved((current) => ({ ...current, queue: [] }))}>Clear Page</button></div>
      </section>

      {saved.history.length > 0 && <section className="freezerLabelHistory"><div className="freezerLabelQueueHeader"><div><h3>Recent Labels</h3><p>Saved only in this browser and included in Backup & Restore.</p></div><button type="button" className="secondary" onClick={() => setSaved((current) => ({ ...current, history: [] }))}>Clear History</button></div><div className="freezerLabelHistoryGrid">{saved.history.slice(0, 12).map((item, index) => <button type="button" onClick={() => reuseLabel(item)} key={`${item.id}-${index}`}><strong>{item.name}</strong><span>{item.amount} · {formatFreezerLabelDate(item.frozenDate)}</span></button>)}</div></section>}

      {showPreview && <div className="freezerLabelPreviewBackdrop" role="dialog" aria-modal="true" aria-labelledby="freezer-print-preview-title"><section className="freezerLabelPreviewModal"><header><div><h2 id="freezer-print-preview-title">Print Preview</h2><p>Use portrait orientation and 100% scale. Cut around each outlined label.</p></div><button type="button" onClick={() => setShowPreview(false)} aria-label="Close preview">×</button></header><div className="freezerLabelPreviewPages">{pages.map((page, pageIndex) => <div className={`freezerLabelPage layout-${saved.layout}`} key={pageIndex}>{page.map((label) => <PrintableLabel label={label} key={label.printKey} />)}</div>)}</div><footer><button type="button" className="primary" onClick={printLabels}>Print These Labels</button><button type="button" className="secondary" onClick={() => setShowPreview(false)}>Close</button></footer></section></div>}

      <div className="freezerLabelPrintRoot" aria-hidden="true">{pages.map((page, pageIndex) => <div className={`freezerLabelPage layout-${saved.layout}`} key={pageIndex}>{page.map((label) => <PrintableLabel label={label} key={label.printKey} />)}</div>)}</div>
    </main>
  );
}

