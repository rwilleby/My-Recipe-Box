import { useEffect, useMemo, useRef, useState } from "react";
import { HERO_IMAGE_MANIFEST, COMBO_IMAGE_MANIFEST, HERO_IMAGE_SOURCE_COUNTS } from "./heroImageManifest.js";
import "./DinnerCombinationHeroAudit.css";

const STORAGE_KEY = "rrb_dinnerComboHeroAssignment_v3_am_reset";
const PANEL_ROLES = ["combo", "main", "side1", "side2"];
const ROLE_LABELS = { combo: "COMBO", main: "MAIN", side1: "SIDE 1", side2: "SIDE 2" };

function safeText(value) { return String(value ?? "").trim(); }
function codeOf(recipe) { return safeText(recipe?.id ?? recipe?.code ?? recipe?.recipeCode).toUpperCase(); }
function nameOf(recipe) { return safeText(recipe?.title ?? recipe?.name ?? recipe?.recipeName); }
function assetUrl(path) {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, "")}`;
}
function recipeImagePath(recipe) {
  if (!recipe) return "";
  return safeText(recipe.auditHeroImage ?? recipe.heroImage ?? recipe.image ?? (recipe.id ? `images/heroes/${recipe.id}.webp` : ""));
}
function comboImagePath(meal) {
  if (!meal) return "";
  const number = String(meal.number ?? meal.mealNumber ?? "").padStart(3, "0");
  return safeText(meal.auditHeroImage ?? meal.heroImage ?? meal.image ?? (number ? `images/dinner-combinations/meal-${number}.webp` : ""));
}
function findRecipe(id, recipes) { return recipes.find((r) => codeOf(r) === safeText(id).toUpperCase()) ?? null; }
function componentRecipe(meal, role, recipes) {
  if (role === "main") return findRecipe(meal.mainRecipeId ?? meal.mainDishCode, recipes);
  const sideIndex = role === "side1" ? 0 : 1;
  const side = Array.isArray(meal.sides) ? meal.sides[sideIndex] : null;
  return findRecipe(side?.recipeId ?? side?.recipeCode, recipes);
}
function loadState() {
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); return value && typeof value === "object" ? value : {}; }
  catch { return {}; }
}
function csvCell(value) { return `"${String(value ?? "").replace(/"/g, '""')}"`; }
function downloadText(filename, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove();
  URL.revokeObjectURL(url);
}

function ImageChooser({
  open,
  role,
  title,
  currentPath,
  selectedPath,
  mealReference,
  onChoose,
  onClose,
}) {
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState(role === "combo" ? "Combo Hero" : "Dedicated Hero");
  const chooserBodyRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSourceFilter(role === "combo" ? "Combo Hero" : "Dedicated Hero");
    window.requestAnimationFrame(() => {
      if (chooserBodyRef.current) chooserBodyRef.current.scrollTop = 0;
    });
  }, [open, role]);

  if (!open) return null;

  const source = role === "combo" ? COMBO_IMAGE_MANIFEST : HERO_IMAGE_MANIFEST;
  const availableSources = role === "combo"
    ? ["Combo Hero"]
    : ["Dedicated Hero", "Hero Thumbnail", "Recipe Card Thumbnail", "Full Recipe Card"];
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = source.filter((item) => {
    const matchesSource = sourceFilter === "All Sources" || item.source === sourceFilter;
    const matchesQuery = !normalizedQuery || `${item.code} ${item.name} ${item.source}`.toLowerCase().includes(normalizedQuery);
    return matchesSource && matchesQuery;
  });

  return (
    <div className="dcChooserOverlay" onMouseDown={onClose}>
      <section
        className="dcChooser"
        role="dialog"
        aria-modal="true"
        aria-label={`Choose ${ROLE_LABELS[role]} image`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="dcChooserHeader">
          <div>
            <small>{ROLE_LABELS[role]}</small>
            <h2>{title}</h2>
            {mealReference && (
              <div className="dcChooserMealReference" aria-label="Dinner combination reference">
                <span><strong>Meal:</strong> #{mealReference.number} — {mealReference.title}</span>
                <span><strong>Main:</strong> {mealReference.main}</span>
                <span><strong>Side 1:</strong> {mealReference.side1}</span>
                <span><strong>Side 2:</strong> {mealReference.side2}</span>
              </div>
            )}
          </div>
          <button type="button" onClick={onClose} aria-label="Close image chooser">×</button>
        </header>

        <div className="dcChooserTopActions">
          <button type="button" onClick={() => onChoose("")}>Keep Current Image</button>
          <button type="button" className="primary" onClick={onClose}>Done</button>
        </div>

        <div className="dcChooserBody" ref={chooserBodyRef}>
          <div className="dcChooserCurrent">
            <article>
              <span>Current</span>
              {currentPath ? <img src={assetUrl(currentPath)} alt="Current hero" /> : <div>No current image</div>}
              <code>{currentPath || "None"}</code>
            </article>
            <article>
              <span>Selected</span>
              {selectedPath ? <img src={assetUrl(selectedPath)} alt="Selected hero" /> : <div>No replacement selected</div>}
              <code>{selectedPath || "Current image remains"}</code>
            </article>
          </div>

          <div className="dcChooserFilters">
            <label className="dcChooserSearch">
              <span>Search filename or recipe code</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={role === "combo" ? "meal-001.webp" : "MX-010"}
              />
            </label>
            <label className="dcChooserSourceFilter">
              <span>Image source</span>
              <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
                <option value="All Sources">All Sources</option>
                {availableSources.map((sourceName) => (
                  <option key={sourceName} value={sourceName}>
                    {sourceName}{role !== "combo" && HERO_IMAGE_SOURCE_COUNTS[sourceName] ? ` (${HERO_IMAGE_SOURCE_COUNTS[sourceName]})` : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {role !== "combo" && (
            <p className="dcChooserSourceNotice">
              <strong>Dedicated Hero</strong> files are the actual food heroes. Thumbnail and recipe-card sources are included so every recipe code can be found and compared, but they should only be selected when that is intentionally the website image you want recorded.
            </p>
          )}

          <div className="dcChooserCount">{filtered.length} images shown</div>
          <div className="dcChooserGrid">
            {filtered.map((item) => (
              <button
                type="button"
                className={selectedPath === item.path ? "selected" : ""}
                key={item.path}
                onClick={() => onChoose(item.path)}
              >
                <img src={assetUrl(item.path)} alt={`${item.code} ${item.source}`} loading="lazy" />
                <span>{item.displayName || item.name}</span>
                <small>{item.source}</small>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="dcChooserNoResults">No image files match this search and source.</div>
          )}
        </div>

        <footer>
          <button type="button" onClick={() => onChoose("")}>Keep Current Image</button>
          <button type="button" className="primary" onClick={onClose}>Done</button>
        </footer>
      </section>
    </div>
  );
}

function AuditPanel({ role, title, code, currentPath, record, onChange, onOpenChooser, onOpenRecipe, recipe }) {
  const approvedPath = record?.selectedPath || currentPath;
  const status = record?.status || "unreviewed";
  return (
    <article className={`dcAssignPanel status-${status}`}>
      <button type="button" className="dcAssignImageButton" onClick={onOpenChooser} title={`Choose ${ROLE_LABELS[role]} hero image`}>
        {approvedPath ? <img src={assetUrl(approvedPath)} alt={`${ROLE_LABELS[role]} ${title}`} loading="lazy" /> : <div className="dcAssignMissing">Missing image</div>}
        <span>Click image to choose hero</span>
      </button>
      <div className="dcAssignPanelText"><small>{ROLE_LABELS[role]}</small><strong>{title || "Unlinked recipe"}</strong>{code && <code>{code}</code>}<em>{approvedPath ? approvedPath.split("/").pop() : "No image"}</em></div>
      <div className="dcAssignReviewChoices">
        <label><input type="radio" name={`${role}-${code}-${title}`} checked={status === "correct"} onChange={() => onChange({ status: "correct", selectedPath: "" })} /> Correct</label>
        <label><input type="radio" name={`${role}-${code}-${title}`} checked={status === "wrong" || status === "replacement"} onChange={() => onChange({ status: record?.selectedPath ? "replacement" : "wrong" })} /> Wrong</label>
      </div>
      {record?.selectedPath && <div className="dcAssignReplacement">Replacement selected</div>}
      <div className="dcAssignPanelActions"><button type="button" onClick={onOpenChooser}>Choose Image</button>{recipe && onOpenRecipe && <button type="button" onClick={() => onOpenRecipe(recipe)}>View Recipe</button>}</div>
    </article>
  );
}

export default function DinnerCombinationHeroAudit({ dinnerCombinations = [], recipes = [], onOpenRecipe, onBack }) {
  const [state, setState] = useState(loadState);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [chooser, setChooser] = useState(null);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} }, [state]);

  const rows = useMemo(() => dinnerCombinations.map((meal) => {
    const main = componentRecipe(meal, "main", recipes);
    const side1 = componentRecipe(meal, "side1", recipes);
    const side2 = componentRecipe(meal, "side2", recipes);
    const key = safeText(meal.id || `meal-${meal.number}`);
    return { key, meal, main, side1, side2 };
  }), [dinnerCombinations, recipes]);

  const visible = useMemo(() => rows.filter((row) => {
    const audit = state[row.key] || {};
    const text = [row.meal.number,row.meal.title,codeOf(row.main),nameOf(row.main),codeOf(row.side1),nameOf(row.side1),codeOf(row.side2),nameOf(row.side2)].join(" ").toLowerCase();
    if (search.trim() && !text.includes(search.trim().toLowerCase())) return false;
    const statuses = PANEL_ROLES.map((role) => audit.panels?.[role]?.status || "unreviewed");
    if (filter === "checked" && !audit.checked) return false;
    if (filter === "unchecked" && audit.checked) return false;
    if (filter === "wrong" && !statuses.some((s) => s === "wrong" || s === "replacement")) return false;
    if (filter === "unreviewed" && !statuses.some((s) => s === "unreviewed")) return false;
    return true;
  }), [rows, state, search, filter]);

  function patchPanel(rowKey, role, patch) {
    setState((current) => {
      const row = current[rowKey] || { panels: {}, notes: "", checked: false };
      const panel = row.panels?.[role] || { status: "unreviewed", selectedPath: "" };
      const nextPanel = { ...panel, ...patch };
      if (patch.selectedPath !== undefined && patch.selectedPath) nextPanel.status = "replacement";
      return { ...current, [rowKey]: { ...row, checked: false, panels: { ...(row.panels || {}), [role]: nextPanel } } };
    });
  }
  function patchRow(rowKey, patch) { setState((current) => ({ ...current, [rowKey]: { panels: {}, notes: "", checked: false, ...(current[rowKey] || {}), ...patch } })); }
  function canCheck(rowKey) { const panels = state[rowKey]?.panels || {}; return PANEL_ROLES.every((role) => ["correct","replacement"].includes(panels[role]?.status)); }

  function exportRows() {
    const output=[];
    rows.forEach((row) => {
      const saved=state[row.key] || {};
      if (!saved.checked) return;
      const defs={
        combo:{recipe:null,code:"",title:row.meal.title,current:comboImagePath(row.meal)},
        main:{recipe:row.main,code:codeOf(row.main),title:nameOf(row.main),current:recipeImagePath(row.main)},
        side1:{recipe:row.side1,code:codeOf(row.side1),title:nameOf(row.side1),current:recipeImagePath(row.side1)},
        side2:{recipe:row.side2,code:codeOf(row.side2),title:nameOf(row.side2),current:recipeImagePath(row.side2)},
      };
      PANEL_ROLES.forEach((role) => {
        const rec=saved.panels?.[role] || {};
        const d=defs[role];
        output.push({mealNumber:row.meal.number,mealId:row.key,mealTitle:row.meal.title,imageRole:ROLE_LABELS[role],recipeCode:d.code,recipeName:d.title,originalHero:d.current,approvedHero:rec.selectedPath || d.current,status:rec.status || "unreviewed",mealChecked:saved.checked ? "Yes" : "No",checkedDate:saved.checkedDate || "",notes:saved.notes || ""});
      });
    });
    return output;
  }
  function exportCsv() {
    const output=exportRows();
    const headers=["Meal Number","Meal ID","Meal Title","Image Role","Recipe Code","Recipe Name","Original Hero","Approved Hero","Status","Meal Checked","Checked Date","Notes"];
    const keys=["mealNumber","mealId","mealTitle","imageRole","recipeCode","recipeName","originalHero","approvedHero","status","mealChecked","checkedDate","notes"];
    const csv=[headers.map(csvCell).join(","),...output.map((r)=>keys.map((k)=>csvCell(r[k])).join(","))].join("\r\n");
    downloadText(`hero-audit-corrections-${new Date().toISOString().slice(0,10)}.csv`,csv,"text/csv;charset=utf-8");
  }
  function exportJson() { downloadText(`hero-audit-corrections-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(exportRows(),null,2),"application/json"); }

  return (
    <main className="pageShell dcAssignmentPage">
      <header className="dcAssignmentHeader"><div><small>ADMIN IMAGE ASSIGNMENT TOOL</small><h1>Dinner Combination Hero Audit</h1><p>Click any Combo, Main, Side 1, or Side 2 image to select the correct hero. Review all four panels, mark the meal checked, then export the approved assignments for the master spreadsheet.</p></div>{onBack && <button type="button" onClick={onBack}>Back</button>}</header>
      <section className="dcAssignmentToolbar">
        <label><span>Search</span><input type="search" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Meal, recipe name, or code" /></label>
        <label><span>Show</span><select value={filter} onChange={(e)=>setFilter(e.target.value)}><option value="all">All meals</option><option value="unchecked">Unchecked</option><option value="checked">Checked</option><option value="wrong">Wrong / replacement</option><option value="unreviewed">Unreviewed images</option></select></label>
        <button type="button" onClick={exportCsv}>Export Checked CSV</button><button type="button" onClick={exportJson}>Export Checked JSON</button>
      </section>
      <div className="dcAssignmentCount">{visible.length} of {rows.length} meals shown · {rows.filter((r)=>state[r.key]?.checked).length} checked</div>
      <section className="dcAssignmentRows">
        {visible.map((row) => {
          const saved=state[row.key] || { panels:{},notes:"",checked:false };
          const defs={
            combo:{title:row.meal.title,code:`Meal #${String(row.meal.number).padStart(3,"0")}`,current:comboImagePath(row.meal),recipe:null},
            main:{title:nameOf(row.main) || row.meal.mainDish,code:codeOf(row.main),current:recipeImagePath(row.main),recipe:row.main},
            side1:{title:nameOf(row.side1) || row.meal.sides?.[0]?.name,code:codeOf(row.side1),current:recipeImagePath(row.side1),recipe:row.side1},
            side2:{title:nameOf(row.side2) || row.meal.sides?.[1]?.name,code:codeOf(row.side2),current:recipeImagePath(row.side2),recipe:row.side2},
          };
          return <article className={saved.checked ? "dcAssignmentRow checked" : "dcAssignmentRow"} key={row.key}>
            <header><div className="dcMealHeaderCopy"><small>MEAL #{row.meal.number}</small><h2>{row.meal.title}</h2><div className="dcMealDishReference"><span><strong>Main:</strong> {defs.main.title || "Not linked"}</span><span><strong>Side 1:</strong> {defs.side1.title || "Not linked"}</span><span><strong>Side 2:</strong> {defs.side2.title || "Not linked"}</span></div></div><label className="dcMealChecked"><input type="checkbox" checked={Boolean(saved.checked)} disabled={!canCheck(row.key)} onChange={(e)=>patchRow(row.key,{checked:e.target.checked,checkedDate:e.target.checked ? new Date().toISOString() : ""})}/><span>{canCheck(row.key) ? "Meal checked" : "Review all 4 images first"}</span></label></header>
            <div className="dcAssignmentGrid">{PANEL_ROLES.map((role) => { const d=defs[role]; return <AuditPanel key={role} role={role} title={d.title} code={d.code} currentPath={d.current} record={saved.panels?.[role]} onChange={(patch)=>patchPanel(row.key,role,patch)} onOpenChooser={()=>setChooser({rowKey:row.key,role,title:d.title,currentPath:d.current,selectedPath:saved.panels?.[role]?.selectedPath || "",mealReference:{number:row.meal.number,title:row.meal.title,main:defs.main.title || "Not linked",side1:defs.side1.title || "Not linked",side2:defs.side2.title || "Not linked"}})} onOpenRecipe={onOpenRecipe} recipe={d.recipe}/>; })}</div>
            <label className="dcAssignmentNotes"><span>Notes</span><textarea rows="2" value={saved.notes || ""} onChange={(e)=>patchRow(row.key,{notes:e.target.value,checked:false})} placeholder="Reason for replacement or anything needed when updating the master spreadsheet" /></label>
          </article>;
        })}
      </section>
      <ImageChooser open={Boolean(chooser)} role={chooser?.role} title={chooser?.title || ""} currentPath={chooser?.currentPath || ""} selectedPath={chooser?.selectedPath || ""} mealReference={chooser?.mealReference} onChoose={(path)=>{ if(!chooser)return; patchPanel(chooser.rowKey,chooser.role,{selectedPath:path,status:path ? "replacement" : "correct"}); setChooser((c)=>({...c,selectedPath:path})); }} onClose={()=>setChooser(null)} />
    </main>
  );
}
