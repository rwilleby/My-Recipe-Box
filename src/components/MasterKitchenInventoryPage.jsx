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

const STORAGE_OPTIONS = ["Refrigerator", "Freezer", "Pantry", "Counter", "Other"];
const STORAGE_FORM_ORDER = ["Raw", "Fresh", "Frozen", "Canned", "Jarred", "Refrigerated", "Instant", "Dry", "Cooked", "Homemade", "Commercial", "Prepared"];
function splitStorageForm(variation = "") {
  const form = STORAGE_FORM_ORDER.find((label) => variation.toLowerCase().startsWith(`${label.toLowerCase()} `));
  if (!form) return { form: "", name: variation };
  return { form, name: variation.slice(form.length).trim() || "Standard" };
}

function defaultStorageForItem(item, categoryId) {
  const variation = item.variation.toLowerCase();
  if (/frozen/.test(variation) || categoryId === "frozen-foods") return "Freezer";
  if (/canned|jarred|instant|dry|dried|boxed|bagged|shelf-stable|pouch/.test(variation)) return "Pantry";
  if (/fresh|refrigerated|cooked|homemade/.test(variation)) return "Refrigerator";
  if (["meat-poultry", "seafood", "dairy-eggs"].includes(categoryId)) return "Refrigerator";
  return "Pantry";
}

function defaultFormForItem(item, categoryId) {
  const variation = item.variation.toLowerCase();
  if (/cooked|pulled|deli|smoked/.test(variation)) return "Cooked";
  if (["meat-poultry", "seafood"].includes(categoryId)) return "Raw";
  if (categoryId === "frozen-foods") return "Frozen";
  if (categoryId === "canned-jarred") return "Canned";
  if (["bread-bakery", "rice-pasta-grains", "spices-baking"].includes(categoryId)) return "Dry";
  if (categoryId === "prepared-packaged") return "Prepared";
  if (categoryId === "dairy-eggs") return "Fresh";
  return item.recipeDerived ? "Ingredient" : "Fresh";
}

function inventoryDetails(item, categoryId) {
  const split = splitStorageForm(item.variation);
  const variety = /^(refrigerated|frozen)$/i.test(split.name) ? "Prepared" : split.name;
  return {
    storage: defaultStorageForItem(item, categoryId),
    form: split.form || defaultFormForItem(item, categoryId),
    variety,
  };
}

function groupItemsByFamily(items = []) {
  const families = new Map();
  items.forEach((item) => {
    if (!families.has(item.family)) families.set(item.family, []);
    families.get(item.family).push(item);
  });
  return [...families.entries()].map(([family, familyItems]) => ({ family, items: familyItems }));
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
  const additionalLocationRecords = Object.values(safeInventory.records).filter((record) => record?.sourceItemId);
  const withStock = allItems.filter((item) => Number(safeInventory.records[item.id]?.have) > 0).length
    + additionalLocationRecords.filter((record) => Number(record.have) > 0).length;
  const toBuy = allItems.filter((item) => Number(safeInventory.records[item.id]?.buy) > 0).length
    + additionalLocationRecords.filter((record) => Number(record.buy) > 0).length;

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
      Object.entries(records).forEach(([id, record]) => { if (record?.sourceItemId === item.id) delete records[id]; });
      return { ...safe, records, customItems: safe.customItems.filter((entry) => entry.id !== item.id) };
    });
  }

  function addStorageLocation(item, categoryId) {
    const details = inventoryDetails(item, categoryId);
    const existingLocations = new Set([
      safeInventory.records[item.id]?.storage || details.storage,
      ...Object.values(safeInventory.records)
        .filter((record) => record?.sourceItemId === item.id)
        .map((record) => record.storage),
    ]);
    const storage = STORAGE_OPTIONS.find((option) => !existingLocations.has(option)) || "Other";
    const rowId = `${item.id}--storage-${Date.now()}`;
    setInventory((current) => {
      const safe = normalizeState(current);
      return {
        ...safe,
        records: {
          ...safe.records,
          [rowId]: { sourceItemId: item.id, storage, have: "", buy: "", updatedAt: new Date().toISOString() },
        },
      };
    });
  }

  function removeStorageLocation(rowId) {
    if (!window.confirm("Remove this additional storage-location row?")) return;
    setInventory((current) => {
      const safe = normalizeState(current);
      const records = { ...safe.records };
      delete records[rowId];
      return { ...safe, records };
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
          const categoryItemIds = new Set(category.items.map((item) => item.id));
          const stocked = category.items.filter((item) => Number(safeInventory.records[item.id]?.have) > 0).length
            + Object.values(safeInventory.records).filter((record) => categoryItemIds.has(record?.sourceItemId) && Number(record.have) > 0).length;
          return (
            <section className="masterInventoryCategory" key={category.id}>
              <button type="button" className="masterInventoryCategoryButton" onClick={() => toggleCategory(category.id)} aria-expanded={Boolean(isOpen)}>
                <span>{isOpen ? "▾" : "▸"}</span><strong>{category.title}</strong><em>{stocked} stocked / {category.items.length} forms</em>
              </button>
              {isOpen && (
                <div className="masterInventoryLedger" role="table" aria-label={`${category.title} inventory`}>
                  {groupItemsByFamily(category.items).map((familyGroup) => {
                    const familyNoteId = `family-note-${category.id}-${familyGroup.family.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                    const familyNote = safeInventory.records[familyNoteId]?.notes || "";
                    return (
                      <section className="masterInventoryLedgerFamily" key={familyGroup.family} role="rowgroup">
                        <div className="masterInventoryFamilyHeader" role="row">
                          <h3 role="columnheader">{familyGroup.family}</h3>
                          <span className="masterInventoryFamilyColumnLabel" role="columnheader">Storage</span>
                          <span className="masterInventoryFamilyColumnLabel" role="columnheader">Form</span>
                          <span className="masterInventoryFamilyColumnLabel" role="columnheader">Cut / Variety</span>
                          <span className="masterInventoryFamilyColumnLabel" role="columnheader">Unit</span>
                          <span className="masterInventoryFamilyColumnLabel masterInventoryHaveLabel" role="columnheader">Have</span>
                          <span className="masterInventoryFamilyColumnLabel masterInventoryBuyLabel" role="columnheader">Buy</span>
                          <span className="masterInventoryFamilyColumnLabel" role="columnheader">Notes</span>
                          <span className="masterInventoryFamilyColumnLabel" aria-hidden="true" />
                        </div>
                        <div className="masterInventoryLedgerItems">
                          {familyGroup.items.flatMap((item) => {
                            const additionalRows = Object.entries(safeInventory.records)
                              .filter(([, record]) => record?.sourceItemId === item.id)
                              .map(([rowId]) => ({ rowId, additional: true }));
                            return [{ rowId: item.id, additional: false }, ...additionalRows].map(({ rowId, additional }) => {
                            const record = safeInventory.records[rowId] || {};
                            const details = inventoryDetails(item, category.id);
                            return (
                              <div className="masterInventoryLedgerRow" key={rowId} role="row">
                                <select className="masterInventoryStorageSelect" value={record.storage || details.storage} onChange={(event) => updateRecord(rowId, { storage: event.target.value, ...(additional ? { sourceItemId: item.id } : {}) })} aria-label={`${item.family} ${item.variation} storage location`}>
                                  {STORAGE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                                </select>
                                <span className="masterInventoryForm" role="cell">{details.form}</span>
                                <span className="masterInventoryVariety" role="cell">{details.variety}{item.recipeDerived ? <small> · Recipe</small> : null}</span>
                                <span className="masterInventoryPackage" role="cell">{item.unit}</span>
                                <label className="masterInventoryLedgerQuantity"><span>Have</span><input type="number" inputMode="decimal" min="0" step="any" placeholder="0" value={numberValue(record.have)} onChange={(event) => updateRecord(rowId, { have: event.target.value, ...(additional ? { sourceItemId: item.id } : {}) })} aria-label={`${item.family} ${item.variation} quantity on hand`} /></label>
                                <label className="masterInventoryLedgerQuantity"><span>Buy</span><input type="number" inputMode="decimal" min="0" step="any" placeholder="0" value={numberValue(record.buy)} onChange={(event) => updateRecord(rowId, { buy: event.target.value, ...(additional ? { sourceItemId: item.id } : {}) })} aria-label={`${item.family} ${item.variation} quantity to buy`} /></label>
                                <span className="masterInventoryNotesSpacer" aria-hidden="true" />
                                {additional
                                  ? <button type="button" className="masterInventoryRemove masterInventoryRemoveLocation" onClick={() => removeStorageLocation(rowId)} aria-label={`Remove additional ${item.family} storage location`}>×</button>
                                  : <span className="masterInventoryRowActions"><button type="button" className="masterInventoryAddLocation" onClick={() => addStorageLocation(item, category.id)}>+ Storage</button>{item.custom && <button type="button" className="masterInventoryRemove" onClick={() => removeCustomItem(item)} aria-label={`Remove ${item.family} ${item.variation}`}>×</button>}</span>}
                              </div>
                            );
                            });
                          })}
                        </div>
                        <label className="masterInventoryLedgerNotes"><span>Notes</span><input type="text" value={familyNote} onChange={(event) => updateRecord(familyNoteId, { notes: event.target.value })} placeholder="Your Notes..." /></label>
                      </section>
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
