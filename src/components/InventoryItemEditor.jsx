import { useEffect, useRef } from "react";
import { MASTER_INVENTORY_CATEGORIES, MASTER_KITCHEN_INVENTORY_TAXONOMY } from "../data/masterKitchenInventoryCatalog.js";

const STORAGE_OPTIONS = ["Refrigerator", "Freezer", "Pantry", "Counter", "Other"];

export default function InventoryItemEditor({ draft, setDraft, imageUrl, onImage, onSave, onDelete, onClose }) {
  const fileInput = useRef(null);
  const closeButton = useRef(null);
  useEffect(() => {
    if (!draft) return undefined;
    closeButton.current?.focus();
    const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [draft, onClose]);
  if (!draft) return null;
  const category = MASTER_KITCHEN_INVENTORY_TAXONOMY.find((entry) => entry.id === draft.categoryId);
  const field = (key, label, options = {}) => <label className={options.wide ? "is-wide" : ""}><span>{label}</span><input type={options.type || "text"} min={options.min} step={options.step} value={draft[key] ?? ""} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} /></label>;
  return <div className="inventoryEditorBackdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="inventoryEditor" role="dialog" aria-modal="true" aria-labelledby="inventoryEditorTitle">
      <header><div><small>Kitchen Inventory</small><h2 id="inventoryEditorTitle">Edit Item</h2></div><button ref={closeButton} type="button" className="inventoryEditorClose" onClick={onClose} aria-label="Close item editor">×</button></header>
      <form onSubmit={(event) => { event.preventDefault(); onSave(); }}>
        <div className="inventoryEditorImage">
          {imageUrl ? <img src={imageUrl} alt="Product preview" /> : <span>Product image optional</span>}
          <input ref={fileInput} className="visuallyHidden" type="file" accept="image/*" onChange={(event) => onImage(event.target.files?.[0])} />
          <button type="button" className="secondary" onClick={() => fileInput.current?.click()}>Change Product Image</button>
        </div>
        <div className="inventoryEditorFields">
          {field("productName", "Product name", { wide: true })}{field("brand", "Brand")}{field("variety", "Cut or variety")}{field("form", "Preparation or form")}
          {field("packageSize", "Package size")}{field("packageCount", "Package count")}{field("quantity", "Quantity owned", { type: "number", min: "0", step: "any" })}{field("unit", "Tracking unit")}
          <label><span>Category</span><select value={draft.categoryId} onChange={(event) => { const categoryId = event.target.value; const family = MASTER_KITCHEN_INVENTORY_TAXONOMY.find((entry) => entry.id === categoryId)?.products[0] || ""; setDraft((current) => ({ ...current, categoryId, family })); }}>{MASTER_INVENTORY_CATEGORIES.map((entry) => <option value={entry.id} key={entry.id}>{entry.title}</option>)}</select></label>
          <label><span>Subcategory</span><select value={draft.family} onChange={(event) => setDraft((current) => ({ ...current, family: event.target.value }))}>{(category?.products || []).map((family) => <option key={family}>{family}</option>)}</select></label>
          <label><span>Storage location</span><select value={draft.storage} onChange={(event) => setDraft((current) => ({ ...current, storage: event.target.value }))}>{STORAGE_OPTIONS.map((value) => <option key={value}>{value}</option>)}</select></label>
          {field("expirationDate", "Expiration or best-by date", { type: "date" })}{field("lowStockLevel", "Low-stock level", { type: "number", min: "0", step: "any" })}
          <label className="is-wide"><span>Notes</span><textarea value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} /></label>
          {field("retailer", "Retailer")}{field("productUrl", "Product-page link", { wide: true, type: "url" })}{field("price", "Optional price", { type: "number", min: "0", step: ".01" })}{field("priceRecordedAt", "Price recorded date", { type: "date" })}
        </div>
        <footer><button type="submit" className="primary">Save Changes</button><button type="button" className="secondary" onClick={onClose}>Cancel</button><button type="button" className="danger" onClick={onDelete}>Delete Item</button></footer>
      </form>
    </section>
  </div>;
}
