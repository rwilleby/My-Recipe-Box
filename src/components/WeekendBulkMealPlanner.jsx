import { useEffect, useMemo, useState } from "react";
import "./WeekendBulkMealPlanner.css";
import "./WeekendBulkMealPlanner.v51.css";

const STORAGE_KEY = "rrb_weekendBulkMealPlanner_v1";

const PLAN_TYPES = [
  { key: "ALL", label: "All Recipes", icon: "images/icons/AL.png" },
  { key: "FAVORITES", label: "Your Favorites", icon: "images/icons/favorites.webp" },
  { key: "SG", label: "Smoked & Grilled Meats", icon: "images/icons/SG.webp" },
  { key: "CP", label: "Crock Pot Meals", icon: "images/icons/CP-bulk.png" },
  { key: "CS", label: "Casseroles", icon: "images/icons/CS.webp" },
  { key: "SD", label: "Side Dishes", icon: "images/icons/SD.webp" },
  { key: "DS", label: "Desserts", icon: "images/icons/DS.webp" },
];

const ALLOWED_RECIPE_CODES = new Set(["SG", "CP", "CS", "SD", "DS"]);

const BULK_BASES = [
  { id: "BASE-001", title: "Cooked Ground Beef", detail: "Freeze flat in meal-size portions for tacos, pasta, chili, or casseroles.", defaultPortions: 8 },
  { id: "BASE-002", title: "Shredded Chicken", detail: "Use in salads, sandwiches, soups, enchiladas, and quick casseroles.", defaultPortions: 8 },
  { id: "BASE-003", title: "Pulled Pork", detail: "Package plain or lightly seasoned for sandwiches, bowls, tacos, and pizza.", defaultPortions: 8 },
  { id: "BASE-004", title: "Cooked Rice", detail: "Cool quickly and freeze in one- or two-meal portions.", defaultPortions: 10 },
  { id: "BASE-005", title: "Cooked Pasta", detail: "Cook just shy of tender and portion for quick skillets, soups, or baked meals.", defaultPortions: 8 },
  { id: "BASE-006", title: "Seasoned Beans", detail: "Portion for bowls, side dishes, chili, soups, and Mexican meals.", defaultPortions: 8 },
  { id: "BASE-007", title: "Roasted Vegetables", detail: "Prepare a flexible mix for bowls, omelets, side dishes, and pasta.", defaultPortions: 8 },
  { id: "BASE-008", title: "Mashed Potatoes", detail: "Freeze in individual or dinner-size portions for fast side dishes.", defaultPortions: 8 },
  { id: "BASE-009", title: "Soup or Sauce Starter", detail: "Freeze concentrated bases in measured portions for later meals.", defaultPortions: 6 },
  { id: "BASE-010", title: "Breakfast Egg Portions", detail: "Bake and portion for quick breakfasts, sandwiches, or bowls.", defaultPortions: 8 },
];

const PACKAGE_OPTIONS = [
  "Quart freezer bag",
  "Gallon freezer bag",
  "Vacuum-seal bag",
  "8oz deli container",
  "16oz deli container",
  "32oz deli container",
  "5.5oz mini foil pans",
  "24oz foil freezer pan",
  "29oz craft freezer box",
  "Silicone freezer block",
  "Other (see notes)",
];

const DESTINATIONS = [
  { value: "freezer", label: "Freezer" },
  { value: "refrigerator", label: "Refrigerator" },
  { value: "both", label: "Both" },
];

function safeLoadPlan() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === "object") {
      return {
        weekendName: saved.weekendName || "This Weekend",
        prepDay: saved.prepDay || "Saturday",
        notes: saved.notes || "",
        items: Array.isArray(saved.items) ? saved.items.map((item) => {
          const legacyPackages = {
            "1-cup deli container": "8oz deli container",
            "2-cup deli container": "16oz deli container",
            "3-cup meal container": "24oz foil freezer pan",
            "5-cup family container": "32oz deli container",
            "Foil freezer pan": "24oz foil freezer pan",
            "Glass refrigerator container": "Other (see notes)",
          };
          return { ...item, finish: item.finish || "Whole", package: legacyPackages[item.package] || item.package || "Quart freezer bag" };
        }) : [],
      };
    }
  } catch {
    // Use the clean starter plan when saved browser data cannot be read.
  }
  return { weekendName: "This Weekend", prepDay: "Saturday", notes: "", items: [] };
}

function recipeCode(recipe) {
  return String(recipe?.categoryCode || recipe?.id || "").split("-")[0].toUpperCase();
}

function recipeSearchText(recipe) {
  return [
    recipe?.id,
    recipe?.title,
    recipe?.category,
    recipe?.categoryCode,
    recipe?.cookingMethod,
    recipe?.method,
    ...(Array.isArray(recipe?.collections) ? recipe.collections : []),
    ...(Array.isArray(recipe?.tags) ? recipe.tags : []),
  ].filter(Boolean).join(" ").toLowerCase();
}

function imageCandidates(item) {
  if (item.sourceType === "base") return ["images/recipes/AM-000.webp"];
  return [
    `images/thumbs/heroes/${item.id}.webp`,
    `images/heroes/${item.id}.webp`,
    `images/thumbs/recipes/${item.id}.webp`,
    `images/recipes/${item.id}.webp`,
    "images/recipes/AM-000.webp",
  ];
}

function PlannerImage({ item }) {
  const candidates = useMemo(() => imageCandidates(item), [item.id, item.sourceType]);
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [item.id]);
  return (
    <img
      src={`${import.meta.env.BASE_URL}${candidates[index]}`}
      alt=""
      onError={() => setIndex((current) => Math.min(current + 1, candidates.length - 1))}
    />
  );
}

function makePlanItem(item, type, prepDay) {
  return {
    uid: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    id: item.id,
    title: item.title,
    type,
    sourceType: item.sourceType || "recipe",
    batches: 1,
    portions: Number(item.defaultPortions || item.servings || 4),
    destination: "both",
    refrigeratorPortions: 2,
    package: type === "DS" ? "8oz deli container" : "Quart freezer bag",
    day: prepDay,
    finish: "Whole",
    labelNote: "",
    completed: false,
  };
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export default function WeekendBulkMealPlanner({ recipes = [], favorites = [], openRecipeCard }) {
  const [plan, setPlan] = useState(safeLoadPlan);
  const [activeType, setActiveType] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  }, [plan]);

  const catalog = useMemo(() => {
    return recipes
      .filter((recipe) => ALLOWED_RECIPE_CODES.has(recipeCode(recipe)))
      .filter((recipe) => activeType === "ALL" || (activeType === "FAVORITES" ? favorites.includes(recipe.id) : recipeCode(recipe) === activeType))
      .map((recipe) => ({ ...recipe, sourceType: "recipe" }));
  }, [activeType, favorites, recipes]);

  const filteredCatalog = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return catalog.slice(0, 120);
    const searchableCatalog = term
      ? recipes.map((recipe) => ({ ...recipe, sourceType: "recipe" }))
      : catalog;
    return searchableCatalog.filter((item) => `${item.id} ${item.title} ${item.detail || ""}`.toLowerCase().includes(term)).slice(0, 120);
  }, [catalog, recipes, search]);

  const summary = useMemo(() => {
    const totalBatches = plan.items.reduce((sum, item) => sum + Number(item.batches || 0), 0);
    const totalPortions = plan.items.reduce((sum, item) => sum + Number(item.portions || 0) * Number(item.batches || 1), 0);
    const refrigerator = plan.items.reduce((sum, item) => {
      if (item.destination === "refrigerator") return sum + Number(item.portions || 0) * Number(item.batches || 1);
      if (item.destination === "both") return sum + Math.min(Number(item.refrigeratorPortions || 0), Number(item.portions || 0) * Number(item.batches || 1));
      return sum;
    }, 0);
    return { totalBatches, totalPortions, refrigerator, freezer: Math.max(0, totalPortions - refrigerator) };
  }, [plan.items]);

  function updatePlan(patch) {
    setPlan((current) => ({ ...current, ...patch }));
  }

  function addItem(item) {
    setPlan((current) => ({
      ...current,
      items: [...current.items, makePlanItem(item, activeType, current.prepDay)],
    }));
  }

  function updateItem(uid, patch) {
    setPlan((current) => ({
      ...current,
      items: current.items.map((item) => item.uid === uid ? { ...item, ...patch } : item),
    }));
  }

  function removeItem(uid) {
    setPlan((current) => ({ ...current, items: current.items.filter((item) => item.uid !== uid) }));
  }

  function clearPlan() {
    if (!window.confirm("Clear every item from this weekend bulk plan?")) return;
    setPlan((current) => ({ ...current, items: [], notes: "" }));
  }

  function downloadPlan() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), ...plan }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "weekend-bulk-meal-plan.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function downloadLabels() {
    const rows = [["Food", "Destination", "Portions", "Package", "Prep day", "Label note"]];
    plan.items.forEach((item) => rows.push([
      item.title,
      item.destination,
      Number(item.portions || 0) * Number(item.batches || 1),
      item.package,
      item.day,
      item.labelNote,
    ]));
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "weekend-bulk-meal-labels.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function printLabels() {
    if (!plan.items.length) {
      window.alert("Add at least one food to My Cooking Plan before printing labels.");
      return;
    }
    document.body.classList.add("printingWeekendLabels");
    window.setTimeout(() => window.print(), 50);
  }

  function printCookingOverview() {
    if (!plan.items.length) {
      window.alert("Add at least one food to My Cooking Plan before printing the overview.");
      return;
    }
    document.body.classList.add("printingWeekendOverview");
    window.setTimeout(() => window.print(), 50);
  }

  useEffect(() => {
    const cleanup = () => {
      document.body.classList.remove("printingWeekendLabels");
      document.body.classList.remove("printingWeekendOverview");
    };
    window.addEventListener("afterprint", cleanup);
    return () => window.removeEventListener("afterprint", cleanup);
  }, []);

  return (
    <main className="weekendBulkPage pageShell">
      <section className="weekendBulkIntro">
        <div className="weekendBulkIntroCopy">
          <span className="aiBadge">WEEKEND PRODUCTION PLAN</span>
          <h2>Cook once. Portion for several meals.</h2>
          <p>Build a plan that fits your equipment, available time, household size, and freezer space. Your selections and packaging notes stay in this browser so you can return to the plan while you shop, cook, cool, label, and store everything.</p>
        </div>
        <div className="weekendBulkPlanName">
          <label>
            <span>Plan name</span>
            <input value={plan.weekendName} onChange={(event) => updatePlan({ weekendName: event.target.value })} />
          </label>
          <label>
            <span>Main prep day</span>
            <select value={plan.prepDay} onChange={(event) => updatePlan({ prepDay: event.target.value })}>
              <option>Saturday</option>
              <option>Sunday</option>
              <option>Both days</option>
            </select>
          </label>
          <div className="weekendBulkCounterRow">
            <div className="weekendBulkMiniStat"><strong>{plan.items.length}</strong><span>Foods selected</span></div>
            <div className="weekendBulkMiniStat"><strong>{summary.totalBatches}</strong><span>Total batches</span></div>
            <div className="weekendBulkMiniStat"><strong>{summary.refrigerator}</strong><span>Refrigerator portions</span></div>
            <div className="weekendBulkMiniStat"><strong>{summary.freezer}</strong><span>Freezer portions</span></div>
          </div>
        </div>
      </section>

      <section className="weekendBulkTypeTabs" role="tablist" aria-label="Bulk cooking groups">
        {PLAN_TYPES.map((type) => (
          <button
            key={type.key}
            type="button"
            role="tab"
            aria-selected={activeType === type.key}
            className={activeType === type.key ? "active" : ""}
            onClick={() => { setActiveType(type.key); setSearch(""); }}
          >
            <span className="weekendBulkTypeIcon"><img src={`${import.meta.env.BASE_URL}${type.icon}`} alt="" /></span>
            <strong>{type.label}</strong>
          </button>
        ))}
      </section>

      <section className="weekendBulkTray" aria-label="Food selection tray">
          <div className="weekendBulkSearchRow">
            <label className="weekendBulkSearch">
              <span>Search all recipes</span>
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Recipe name or code" />
            </label>
            <div className="weekendBulkCatalogCount">{filteredCatalog.length} choices shown · scroll right to see more</div>
          </div>

          <div className="weekendBulkCatalog">
            {filteredCatalog.map((item) => (
              <article className="weekendBulkCatalogCard" key={item.id}>
                <PlannerImage item={item} />
                <div className="weekendBulkCatalogBody">
                  <small>{item.id}</small>
                  <strong>{item.title}</strong>
                  <div className="weekendBulkCatalogActions">
                    {item.sourceType === "recipe" && openRecipeCard && (
                      <button type="button" className="ghost" onClick={() => openRecipeCard(item.id, recipes, "Weekend Bulk Meal Planner")}>VIEW</button>
                    )}
                    <button type="button" onClick={() => addItem(item)}>ADD</button>
                  </div>
                </div>
              </article>
            ))}
            {!filteredCatalog.length && (
              <div className="weekendBulkEmpty">No matching choices were found in this group.</div>
            )}
          </div>
      </section>

      <section className="weekendBulkPlan" aria-label="Weekend bulk meal plan">
          <div className="weekendBulkPlanHeader">
            <div>
              <span className="aiBadge">MY COOKING PLAN</span>
              <h2>My Cooking Plan</h2>
            </div>
            <div className="weekendBulkHeaderActions">
              <button type="button" onClick={() => window.print()}>Print</button>
              <button type="button" onClick={printCookingOverview}>Print Cooking Overview</button>
              <button type="button" onClick={printLabels}>Print Labels</button>
              <button type="button" onClick={downloadLabels}>Labels CSV</button>
              <button type="button" onClick={downloadPlan}>Save Copy</button>
              <button type="button" className="danger" onClick={clearPlan}>Clear</button>
            </div>
          </div>

          {!plan.items.length ? (
            <div className="weekendBulkEmptyPlan">
              <span>▦</span>
              <h3>Your weekend plan is empty.</h3>
              <p>Choose a cooking group on the left and add recipes or base foods.</p>
            </div>
          ) : (
            <div className="weekendBulkPlanList">
              {plan.items.map((item, index) => (
                <article className={item.completed ? "weekendBulkPlanCard completed" : "weekendBulkPlanCard"} key={item.uid}>
                  <div className="weekendBulkPlanCardTop">
                    <label className="weekendBulkComplete">
                      <input type="checkbox" checked={item.completed} onChange={(event) => updateItem(item.uid, { completed: event.target.checked })} />
                      <span>Done</span>
                    </label>
                    <div className="weekendBulkPlanThumb"><PlannerImage item={item} /></div>
                    <div className="weekendBulkPlanIdentity">
                      <span>#{index + 1}</span>
                      <h3>{item.title}</h3>
                      <small>{item.id}</small>
                    </div>
                    <div className="weekendBulkHeaderFields">
                      <label><span>Batches</span><input type="number" min="1" max="20" value={item.batches} onChange={(event) => updateItem(item.uid, { batches: Math.max(1, Number(event.target.value) || 1) })} /></label>
                      <label><span>Portions</span><input type="number" min="1" max="50" value={item.portions} onChange={(event) => updateItem(item.uid, { portions: Math.max(1, Number(event.target.value) || 1) })} /></label>
                      <label><span>Store</span><select value={item.destination} onChange={(event) => updateItem(item.uid, { destination: event.target.value })}>{DESTINATIONS.map((destination) => <option key={destination.value} value={destination.value}>{destination.label}</option>)}</select></label>
                      <label><span>Refrigerator</span><input type="number" min="0" max="50" disabled={item.destination !== "both"} value={item.destination === "both" ? item.refrigeratorPortions : item.destination === "refrigerator" ? item.portions : 0} onChange={(event) => updateItem(item.uid, { refrigeratorPortions: Math.max(0, Number(event.target.value) || 0) })} /></label>
                    </div>
                    <button type="button" className="weekendBulkRemove" onClick={() => removeItem(item.uid)} aria-label={`Remove ${item.title}`}>×</button>
                  </div>

                  <div className="weekendBulkFields">
                    <label><span>Finish</span><select value={item.finish || "Whole"} onChange={(event) => updateItem(item.uid, { finish: event.target.value })}><option>Whole</option><option>Sliced</option><option>Cubed</option><option>Shredded</option></select></label>
                    <label><span>Package in</span><select value={item.package} onChange={(event) => updateItem(item.uid, { package: event.target.value })}>{PACKAGE_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></label>
                    <label><span>Prep day</span><select value={item.day} onChange={(event) => updateItem(item.uid, { day: event.target.value })}><option>Saturday</option><option>Sunday</option></select></label>
                    <label><span>Label / finishing note</span><input value={item.labelNote} onChange={(event) => updateItem(item.uid, { labelNote: event.target.value })} placeholder="Thaw overnight; add sauce" /></label>
                  </div>
                </article>
              ))}
            </div>
          )}

      </section>

      <section className="weekendBulkChecklist">
            <h3>Packaging & Safety Checklist</h3>
            <ul>
              <li>Cool cooked food promptly before sealing and refrigerating or freezing.</li>
              <li>Label each package with the food, portions, freeze date, and reheating instructions.</li>
              <li>Freeze bags flat when practical, then stand them upright to save space.</li>
              <li>Reserve the refrigerator portions you expect to eat first; freeze the rest promptly.</li>
            </ul>
      </section>
      <section className="weekendBulkNotes">
        <label>
          <span>Weekend notes</span>
          <textarea value={plan.notes} onChange={(event) => updatePlan({ notes: event.target.value })} placeholder="Shopping reminders, thawing notes, equipment order, or prep assignments..." />
        </label>
      </section>

      <section className="weekendBulkLabelSheet" aria-hidden="true">
        {plan.items.flatMap((item) => Array.from({ length: Math.max(1, Number(item.batches || 1)) }, (_, batchIndex) => (
          <article className="weekendBulkPrintableLabel" key={`${item.uid}-${batchIndex}`}>
            <strong>{item.title}</strong>
            <span>{item.id} · {item.finish || "Whole"} · {item.package}</span>
            <span>Prep: {item.day} · Store: {item.destination}</span>
            {item.labelNote && <small>{item.labelNote}</small>}
          </article>
        )))}
      </section>

      <section className="weekendBulkOverviewSheet" aria-hidden="true">
        <header>
          <p>ROBERT'S RECIPE BOX · WEEKEND BULK COOKING</p>
          <h1>{plan.weekendName || "My Weekend Bulk Plan"}</h1>
          <div><strong>Main prep day:</strong> {plan.prepDay} <span>•</span> <strong>{plan.items.length}</strong> foods <span>•</span> <strong>{summary.totalBatches}</strong> batches <span>•</span> <strong>{summary.totalPortions}</strong> portions</div>
        </header>
        <section className="weekendBulkOverviewSummary">
          <div><strong>{summary.refrigerator}</strong><span>Refrigerator portions</span></div>
          <div><strong>{summary.freezer}</strong><span>Freezer portions</span></div>
          <div><strong>{plan.items.filter((item) => item.completed).length}</strong><span>Marked complete</span></div>
        </section>
        <h2>Cooking & Packaging Overview</h2>
        <table>
          <thead><tr><th>#</th><th>Meal / Item</th><th>Qty.</th><th>Finish</th><th>Storage</th><th>Package / Label Note</th></tr></thead>
          <tbody>{plan.items.map((item, index) => (
            <tr key={item.uid}><td>{item.completed ? "✓" : index + 1}</td><td><strong>{item.title}</strong><small>{item.id} · {item.day}</small></td><td>{item.batches} batch{Number(item.batches) === 1 ? "" : "es"}<small>{Number(item.portions) * Number(item.batches)} portions</small></td><td>{item.finish || "Whole"}</td><td>{item.destination}{item.destination === "both" ? ` (${item.refrigeratorPortions} refrigerated)` : ""}</td><td>{item.package}<small>{item.labelNote || "Label with food, portions, and freeze date."}</small></td></tr>
          ))}</tbody>
        </table>
        <div className="weekendBulkOverviewColumns">
          <section><h2>Items to Have Ready</h2><ul><li>Chosen bags or containers for every batch</li><li>Permanent or dissolvable labels and marker</li><li>Sheet pans or shallow pans for prompt cooling</li><li>Freezer space cleared before cooking begins</li><li>Thermometer, timers, and clean prep tools</li></ul></section>
          <section><h2>Successful Cook Hints</h2><ul><li>Start the longest-cooking foods first and prep cold items while they cook.</li><li>Keep raw-meat tools separate from ready-to-eat food.</li><li>Cool cooked food promptly in shallow portions before sealing.</li><li>Reserve near-term refrigerator portions; freeze the rest promptly.</li><li>Freeze bags flat, then stand upright once solid.</li></ul></section>
        </div>
        {plan.notes && <section className="weekendBulkOverviewNotes"><h2>Weekend Notes</h2><p>{plan.notes}</p></section>}
      </section>
    </main>
  );
}
