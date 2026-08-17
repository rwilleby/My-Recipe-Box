import { useMemo, useState } from "react";
import { MASTER_INVENTORY_CATEGORIES, buildMasterKitchenInventoryCatalog } from "../data/masterKitchenInventoryCatalog.js";
import { printManualInventoryWorksheet } from "../utils/manualInventoryWorksheets.js";
import "./MasterKitchenInventoryPage.css";

function normalizeState(value) {
  return value && typeof value === "object"
    ? { records: value.records || {}, customItems: Array.isArray(value.customItems) ? value.customItems : [] }
    : { records: {}, customItems: [] };
}

function numberValue(value) {
  return value === 0 ? "0" : value || "";
}

export default function MasterKitchenInventoryPage({ recipes, inventory, setInventory }) {
  const safeInventory = normalizeState(inventory);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(() => new Set(["vegetables"]));
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState({ categoryId: "vegetables", family: "", variation: "", unit: "each" });
  const catalog = useMemo(
    () => buildMasterKitchenInventoryCatalog(recipes, safeInventory.customItems),
    [recipes, safeInventory.customItems],
  );
  const normalizedSearch = search.trim().toLowerCase();
  const visibleCatalog = catalog.map((category) => ({
    ...category,
    items: category.items.filter((item) =>
      !normalizedSearch || `${item.family} ${item.variation} ${item.unit}`.toLowerCase().includes(normalizedSearch)
    ),
  })).filter((category) => category.items.length);
  const allItems = catalog.flatMap((category) => category.items);
  const withStock = allItems.filter((item) => Number(safeInventory.records[item.id]?.have) > 0).length;
  const toBuy = allItems.filter((item) => Number(safeInventory.records[item.id]?.buy) > 0).length;

  function updateRecord(itemId, patch) {
    setInventory((current) => {
      const safe = normalizeState(current);
      return {
        ...safe,
        records: {
          ...safe.records,
          [itemId]: { ...(safe.records[itemId] || {}), ...patch, updatedAt: new Date().toISOString() },
        },
      };
    });
  }

  function toggleCategory(categoryId) {
    setExpanded((current) => {
      const next = new Set(current);
      next.has(categoryId) ? next.delete(categoryId) : next.add(categoryId);
      return next;
    });
  }

  function addCustomItem(event) {
    event.preventDefault();
    if (!customForm.family.trim()) return;
    const id = `custom-master-${Date.now()}`;
    setInventory((current) => {
      const safe = normalizeState(current);
      return {
        ...safe,
        customItems: [...safe.customItems, { ...customForm, id, family: customForm.family.trim(), variation: customForm.variation.trim() || "Custom item" }],
      };
    });
    setExpanded((current) => new Set([...current, customForm.categoryId]));
    setCustomForm({ categoryId: customForm.categoryId, family: "", variation: "", unit: "each" });
    setShowCustomForm(false);
  }

  function removeCustomItem(item) {
    if (!window.confirm(`Remove ${item.family} — ${item.variation} from the master list?`)) return;
    setInventory((current) => {
      const safe = normalizeState(current);
      const records = { ...safe.records };
      delete records[item.id];
      return { ...safe, records, customItems: safe.customItems.filter((entry) => entry.id !== item.id) };
    });
  }

  function clearBuyQuantities() {
    if (!window.confirm("Clear every Buy quantity on the Master Kitchen Inventory? Have quantities will not change.")) return;
    setInventory((current) => {
      const safe = normalizeState(current);
      return {
        ...safe,
        records: Object.fromEntries(Object.entries(safe.records).map(([id, record]) => [id, { ...record, buy: "" }])),
      };
    });
  }

  function recordPurchases() {
    if (!window.confirm("Add every Buy quantity to Have and clear the Buy boxes?")) return;
    setInventory((current) => {
      const safe = normalizeState(current);
      return {
        ...safe,
        records: Object.fromEntries(Object.entries(safe.records).map(([id, record]) => {
          const purchased = Number(record.buy) || 0;
          const currentHave = Number(record.have) || 0;
          return [id, { ...record, have: purchased ? String(currentHave + purchased) : record.have || "", buy: "", updatedAt: new Date().toISOString() }];
        })),
      };
    });
  }

  function printCountWorksheet() {
    printManualInventoryWorksheet({
      title: "Master Kitchen Inventory Count Worksheet",
      instructions: "Complete the one-time starting count by recording how many packages, containers, pounds, or individual pieces are currently on hand. Enter the results into Master Kitchen Inventory.",
      groups: catalog.map((category) => ({
        title: category.title,
        items: category.items.map((item) => ({ name: item.family, detail: `${item.variation} · ${item.unit}` })),
      })),
      columns: [
        { label: "Have", kind: "line" },
        { label: "Buy", kind: "line" },
        { label: "Checked", kind: "checkbox" },
        { label: "Notes", kind: "line" },
      ],
    });
  }

  return (
    <main className="pageShell masterKitchenInventoryPage">
      <section className="masterInventoryIntro">
        <div>
          <span>ONE MASTER LIST</span>
          <h1>Count It Once. Keep It Current.</h1>
          <p>Use this page for the initial count of foods that may be needed across the recipe library. Each product form has its own Have and Buy quantity so canned, frozen, fresh, and prepared versions remain separate.</p>
        </div>
        <div className="masterInventorySummary">
          <div><strong>{allItems.length}</strong><span>Product forms</span></div>
          <div><strong>{withStock}</strong><span>On hand</span></div>
          <div><strong>{toBuy}</strong><span>To buy</span></div>
        </div>
      </section>

      <section className="masterInventoryToolbar">
        <label className="masterInventorySearch"><span>Find an item</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search corn, chicken, gravy…" /></label>
        <button type="button" className="primary" onClick={printCountWorksheet}>Print Initial Count</button>
        <button type="button" className="secondary" onClick={() => setExpanded(new Set(catalog.map((category) => category.id)))}>Expand All</button>
        <button type="button" className="secondary" onClick={() => setExpanded(new Set())}>Collapse All</button>
        <button type="button" className="secondary" onClick={() => setShowCustomForm((current) => !current)}>Add Custom Item</button>
        <button type="button" className="primary" onClick={recordPurchases}>Record Purchases</button>
        <button type="button" className="secondary" onClick={clearBuyQuantities}>Clear Buy Qty</button>
      </section>

      {showCustomForm && (
        <form className="masterInventoryCustomForm" onSubmit={addCustomItem}>
          <label><span>Category</span><select value={customForm.categoryId} onChange={(event) => setCustomForm((current) => ({ ...current, categoryId: event.target.value }))}>{MASTER_INVENTORY_CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}</select></label>
          <label><span>Item</span><input required value={customForm.family} onChange={(event) => setCustomForm((current) => ({ ...current, family: event.target.value }))} placeholder="Example: Corn" /></label>
          <label><span>Form / package</span><input value={customForm.variation} onChange={(event) => setCustomForm((current) => ({ ...current, variation: event.target.value }))} placeholder="Example: Frozen steam bag" /></label>
          <label><span>Counting unit</span><input value={customForm.unit} onChange={(event) => setCustomForm((current) => ({ ...current, unit: event.target.value }))} placeholder="bags" /></label>
          <button type="submit" className="primary">Save Item</button>
        </form>
      )}

      <p className="masterInventoryBackupNote"><strong>Saved automatically on this device.</strong> Master Kitchen Inventory is included in the full Recipe Box Backup &amp; Restore file for transfer between your iPad and laptop.</p>

      <div className="masterInventoryAccordions">
        {visibleCatalog.map((category) => {
          const isOpen = normalizedSearch || expanded.has(category.id);
          const stocked = category.items.filter((item) => Number(safeInventory.records[item.id]?.have) > 0).length;
          return (
            <section className="masterInventoryCategory" key={category.id}>
              <button type="button" className="masterInventoryCategoryButton" onClick={() => toggleCategory(category.id)} aria-expanded={Boolean(isOpen)}>
                <span>{isOpen ? "▾" : "▸"}</span><strong>{category.title}</strong><em>{stocked} stocked / {category.items.length} forms</em>
              </button>
              {isOpen && (
                <div className="masterInventoryTable">
                  <div className="masterInventoryTableHead"><span>Item</span><span>Form / Package</span><span>Unit</span><span>Have</span><span>Buy</span><span>Notes</span><span /></div>
                  {category.items.map((item, index) => {
                    const record = safeInventory.records[item.id] || {};
                    const previousFamily = category.items[index - 1]?.family;
                    return (
                      <div className="masterInventoryRow" key={item.id}>
                        <div className="masterInventoryFamily">{previousFamily === item.family ? <span aria-hidden="true">↳</span> : <strong>{item.family}</strong>}</div>
                        <div className="masterInventoryVariation">{item.variation}{item.recipeDerived && <small>From recipe library</small>}</div>
                        <div className="masterInventoryUnit">{item.unit}</div>
                        <label><span>Have</span><input type="number" inputMode="decimal" min="0" step="any" value={numberValue(record.have)} onChange={(event) => updateRecord(item.id, { have: event.target.value })} aria-label={`${item.family} ${item.variation} quantity on hand`} /></label>
                        <label><span>Buy</span><input type="number" inputMode="decimal" min="0" step="any" value={numberValue(record.buy)} onChange={(event) => updateRecord(item.id, { buy: event.target.value })} aria-label={`${item.family} ${item.variation} quantity to buy`} /></label>
                        <label className="masterInventoryNotes"><span>Notes</span><input type="text" value={record.notes || ""} onChange={(event) => updateRecord(item.id, { notes: event.target.value })} placeholder="Optional" /></label>
                        <div>{item.custom && <button type="button" className="masterInventoryRemove" onClick={() => removeCustomItem(item)} aria-label={`Remove ${item.family} ${item.variation}`}>×</button>}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {visibleCatalog.length === 0 && <p className="masterInventoryEmpty">No inventory items match “{search}.”</p>}
      <p className="masterInventoryAutomationNote"><strong>Inventory-counting rule:</strong> the system should deduct an item automatically only when a recipe identifies the exact product form and compatible unit. Alternative ingredients remain unchanged until the form actually used is selected.</p>
    </main>
  );
}
