import { useMemo, useState } from "react";
import { BASE_KITCHEN_CATEGORIES, BASE_KITCHEN_PRODUCTS, baseProductName } from "../data/baseKitchenProducts.js";
import { classifyInventoryProduct } from "../data/masterKitchenInventoryTaxonomy.js";

const UNITS = ["Each", "Cans", "Cartons", "Containers", "Packages", "Bags", "Boxes", "Bottles", "Jars", "Pounds", "Ounces", "Gallons", "Dozen", "Rolls", "Pods", "Servings", "Cases", "Bunches", "Loaves", "Racks", "Sticks", "Packets", "Cups", "Ears", "Tubs"];
const LOCATIONS = ["Refrigerator", "Freezer", "Pantry", "Counter", "Other"];
const unitLabel = (value = "each") => ({ lb: "Pounds", each: "Each" }[String(value).toLowerCase()] || `${String(value).charAt(0).toUpperCase()}${String(value).slice(1).toLowerCase()}`);
const unitValue = (label) => ({ Pounds: "lb", Each: "each" }[label] || label.toLowerCase());

function existingRecord(product, inventory) {
  if (inventory.records?.[product.id]) return { rowId: product.id, record: inventory.records[product.id] };
  const custom = (inventory.customItems || []).find((item) => item.id === product.id || String(item.productName || "").toLowerCase() === baseProductName(product).toLowerCase());
  return custom && inventory.records?.[custom.id] ? { rowId: custom.id, record: inventory.records[custom.id] } : null;
}

export default function BaseKitchenProductSelector({ inventory, setInventory }) {
  const [openCategory, setOpenCategory] = useState("");
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState({});
  const [message, setMessage] = useState("");
  const [removePrompt, setRemovePrompt] = useState(null);
  const normalized = search.trim().toLowerCase();
  const products = useMemo(() => BASE_KITCHEN_PRODUCTS.map((product) => {
    const saved = existingRecord(product, inventory);
    return { ...product, saved, text: `${product.family} ${product.variation} ${baseProductName(product)} ${(product.aliases || []).join(" ")}`.toLowerCase() };
  }), [inventory]);
  const selectedCount = Object.values(drafts).filter((draft) => draft.checked).length;
  const newCount = Object.values(drafts).filter((draft) => draft.checked && !draft.existing).length;
  const changedCount = Object.values(drafts).filter((draft) => draft.checked && draft.existing && draft.changed).length;

  function productDraft(product) {
    const saved = product.saved;
    return drafts[product.id] || { checked: Boolean(saved), existing: Boolean(saved), changed: false,
      quantity: saved?.record?.have ?? "1", unit: saved?.record?.unit || product.unit, location: saved?.record?.storage || product.storage };
  }
  function updateDraft(product, patch) {
    const current = productDraft(product);
    setDrafts((all) => ({ ...all, [product.id]: { ...current, ...patch, changed: current.existing ? true : current.changed } }));
    setMessage("");
  }
  function toggleProduct(product, checked) {
    if (!checked && product.saved) return setRemovePrompt(product);
    updateDraft(product, { checked });
  }
  function removeExisting() {
    const product = removePrompt;
    const saved = product?.saved;
    if (!saved) return setRemovePrompt(null);
    setInventory((current) => {
      const records = { ...(current.records || {}) }; delete records[saved.rowId];
      return { ...current, records, customItems: (current.customItems || []).filter((item) => item.id !== saved.rowId) };
    });
    setDrafts((all) => ({ ...all, [product.id]: { ...productDraft(product), checked: false, existing: false, changed: false } }));
    setRemovePrompt(null); setMessage(`${baseProductName(product)} removed from Current Inventory.`);
  }
  function saveBatch() {
    const selected = products.filter((product) => productDraft(product).checked && (!productDraft(product).existing || productDraft(product).changed));
    if (!selected.length) return;
    setInventory((current) => {
      const records = { ...(current.records || {}) };
      const customItems = [...(current.customItems || [])];
      selected.forEach((product) => {
        const draft = productDraft(product); const rowId = product.saved?.rowId || product.id;
        const classification = classifyInventoryProduct(baseProductName(product), BASE_KITCHEN_CATEGORIES.find((category) => category.id === product.baseCategoryId)?.title || "");
        if (!customItems.some((item) => item.id === rowId)) customItems.push({ ...product, id: rowId,
          categoryId: classification.categoryId, family: classification.productType,
          productName: baseProductName(product), baseCategoryId: product.baseCategoryId, baseProduct: true, custom: true });
        records[rowId] = { ...(records[rowId] || {}), productName: baseProductName(product), have: String(draft.quantity), unit: draft.unit,
          storage: draft.location, categoryId: classification.categoryId, baseCategoryId: product.baseCategoryId, updatedAt: new Date().toISOString() };
      });
      return { ...current, records, customItems };
    });
    setDrafts((all) => Object.fromEntries(Object.entries(all).map(([id, draft]) => [id, draft.checked ? { ...draft, existing: true, changed: false } : draft])));
    setMessage(`${selected.length} product${selected.length === 1 ? "" : "s"} saved to Current Inventory.`);
  }
  function clearNew() {
    setDrafts((all) => Object.fromEntries(Object.entries(all).filter(([, draft]) => draft.existing)));
  }
  const results = normalized ? products.filter((product) => product.text.includes(normalized)) : [];

  function row(product) {
    const draft = productDraft(product);
    return <div className={`baseProductRow${draft.checked ? " is-selected" : ""}`} key={product.id}>
      <label className="baseProductIdentity"><input type="checkbox" checked={draft.checked} aria-label={`I Have This: ${baseProductName(product)}`} onChange={(event) => toggleProduct(product, event.target.checked)} /><span><strong>{baseProductName(product)}</strong>{product.saved && <small>In Inventory</small>}</span></label>
      {normalized && <span className="baseProductResultCategory">{BASE_KITCHEN_CATEGORIES.find((category) => category.id === product.baseCategoryId)?.title}</span>}
      {draft.checked && <div className="baseProductControls">
        <label><span>How Many?</span><div className="baseProductQuantity"><button type="button" aria-label={`Decrease ${baseProductName(product)}`} onClick={() => updateDraft(product, { quantity: String(Math.max(0, Number(draft.quantity || 0) - 1)) })}>−</button><input type="number" min="0" step="any" value={draft.quantity} onChange={(event) => updateDraft(product, { quantity: event.target.value })} aria-label={`How many ${baseProductName(product)}`} /><button type="button" aria-label={`Increase ${baseProductName(product)}`} onClick={() => updateDraft(product, { quantity: String(Number(draft.quantity || 0) + 1) })}>+</button></div></label>
        <label><span>Counted As</span><select value={unitLabel(draft.unit)} onChange={(event) => updateDraft(product, { unit: unitValue(event.target.value) })}>{UNITS.map((unit) => <option key={unit}>{unit}</option>)}</select></label>
        <label><span>Location</span><select value={draft.location} onChange={(event) => updateDraft(product, { location: event.target.value })}>{LOCATIONS.map((location) => <option key={location}>{location}</option>)}</select></label>
      </div>}
    </div>;
  }

  return <section className="baseProductSelector" id="inventory-products-panel" role="tabpanel" aria-label="Choose Products">
    <label className="baseProductSearch"><span>Search Products</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products and common names" /></label>
    {normalized ? <div className="baseProductSearchResults">{results.length ? results.map(row) : <p>No products match this search.</p>}</div> : <div className="baseProductCategories">
      {BASE_KITCHEN_CATEGORIES.map((category) => {
        const entries = products.filter((product) => product.baseCategoryId === category.id);
        const selected = entries.filter((product) => productDraft(product).checked).length;
        const isOpen = openCategory === category.id;
        return <section key={category.id} className="baseProductCategory"><button type="button" className="baseProductCategoryButton" aria-expanded={isOpen} aria-controls={`base-category-${category.id}`} onClick={() => setOpenCategory(isOpen ? "" : category.id)}><span aria-hidden="true">{isOpen ? "▾" : "▸"}</span><strong>{category.title}</strong><small>{entries.length} Products{selected ? ` · ${selected} Selected` : ""}</small></button>{isOpen && <div id={`base-category-${category.id}`} className="baseProductRows">{entries.map(row)}</div>}</section>;
      })}
    </div>}
    {(selectedCount > 0 || changedCount > 0) && <div className="baseProductActionBar" role="region" aria-label="Selected product actions"><strong>{selectedCount} Product{selectedCount === 1 ? "" : "s"} Selected</strong><div>{newCount > 0 && <button type="button" className="primary" onClick={saveBatch}>Add Selected to Inventory</button>}{changedCount > 0 && newCount === 0 && <button type="button" className="primary" onClick={saveBatch}>Update Inventory</button>}{newCount > 0 && <button type="button" className="secondary" onClick={clearNew}>Clear New Selections</button>}</div></div>}
    {message && <p className="baseProductMessage" role="status">{message}</p>}
    {removePrompt && <div className="inventoryZeroBackdrop" role="presentation"><section className="inventoryZeroDialog" role="dialog" aria-modal="true" aria-labelledby="removeBaseProductTitle"><h2 id="removeBaseProductTitle">Remove this product from Current Inventory?</h2><p>{baseProductName(removePrompt)}</p><button type="button" className="danger" onClick={removeExisting}>Remove Product</button><button type="button" className="secondary" onClick={() => setRemovePrompt(null)}>Keep Product</button></section></div>}
  </section>;
}
