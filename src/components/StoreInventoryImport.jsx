import { useEffect, useRef, useState } from "react";
import { MASTER_INVENTORY_CATEGORIES, MASTER_KITCHEN_INVENTORY_TAXONOMY } from "../data/masterKitchenInventoryCatalog.js";
import { createInventoryThumbnail, parseStoreProductUrl } from "../utils/storeProductImport.js";
import { loadInventoryProductThumbnail } from "../utils/inventoryProductImages.js";

export function InventoryProductThumbnail({ imageKey, alt = "" }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let active = true;
    let objectUrl = "";
    if (imageKey) loadInventoryProductThumbnail(imageKey).then((blob) => {
      if (!active || !blob) return;
      objectUrl = URL.createObjectURL(blob);
      setSrc(objectUrl);
    }).catch(() => {});
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [imageKey]);
  return src ? <img className="storeInventorySavedThumbnail" src={src} alt={alt} /> : null;
}

const EMPTY_DRAFT = {
  productName: "", brand: "", variety: "", packageSize: "", packageCount: "", quantityOwned: "1",
  unit: "packages", categoryId: "prepared-packaged", family: "Other Packaged Foods", storage: "Pantry",
  expirationDate: "", lowStockLevel: "1", retailer: "", cleanUrl: "", price: "", priceRecordedAt: "", retailerItemId: "",
};

export default function StoreInventoryImport({ mode, setMode, draft, setDraft, previewUrl, onImage, onConfirm, onCancel, isEditing, receiptPanel }) {
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInput = useRef(null);
  const selectedCategory = MASTER_KITCHEN_INVENTORY_TAXONOMY.find((category) => category.id === draft?.categoryId);

  function importLink(value = link) {
    try {
      const imported = parseStoreProductUrl(value);
      setDraft(imported);
      setLink(imported.cleanUrl);
      setError("");
      setMessage("We found the product link. Please confirm the product details below.");
    } catch (reason) { setMessage(""); setError(reason.message); }
  }

  async function acceptImage(file) {
    if (!file) return;
    try {
      const thumbnail = await createInventoryThumbnail(file);
      onImage(file, thumbnail);
      setDraft((current) => current || { ...EMPTY_DRAFT });
      setError("");
      setMessage("Image ready. Please confirm the product details below.");
    } catch (reason) { setError(reason.message); }
  }

  function handleDrop(event) {
    event.preventDefault();
    const file = [...(event.dataTransfer.files || [])].find((entry) => String(entry.type).startsWith("image/"));
    if (file) return acceptImage(file);
    const value = event.dataTransfer.getData("text/uri-list") || event.dataTransfer.getData("text/plain");
    setLink(value);
    importLink(value);
  }

  const field = (key, label, options = {}) => (
    <label className={options.wide ? "is-wide" : ""}><span>{label}</span><input type={options.type || "text"} min={options.min} step={options.step} value={draft?.[key] || ""} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} /></label>
  );

  return <section className="storeInventoryPanel" aria-labelledby="storeInventoryTitle">
    <h2 id="storeInventoryTitle">ADD TO MY KITCHEN</h2>
    <div className="storeInventorySegments" role="tablist" aria-label="Choose how to add an inventory item">
      <button type="button" role="tab" aria-selected={mode === "products"} aria-controls="inventory-products-panel" onClick={() => setMode("products")}>Choose Products</button>
      <button type="button" role="tab" aria-selected={mode === "store"} aria-controls="inventory-store-panel" onClick={() => setMode("store")}>Add From Store</button>
      <button type="button" role="tab" aria-selected={mode === "receipt"} aria-controls="inventory-receipt-panel" onClick={() => setMode("receipt")}>Import Receipt or List</button>
      <button type="button" role="tab" aria-selected={mode === "manual"} aria-controls="inventory-manual-panel" onClick={() => setMode("manual")}>Enter Manually</button>
    </div>
    {mode === "products" && <p id="inventory-products-panel" role="tabpanel" className="storeInventoryModeNote">Choose a category and item below, add the quantity you have, then save it to your current inventory.</p>}
    {mode === "manual" && <p id="inventory-manual-panel" role="tabpanel" className="storeInventoryModeNote">Enter a product name or variety below and save it to your current inventory.</p>}
    {mode === "receipt" && receiptPanel}
    {mode === "store" && <div id="inventory-store-panel" role="tabpanel">
      <div className="storeInventoryImportGrid">
        <div className="storeInventoryDropTarget" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
          <strong>Drag a product image or product link here</strong>
          <span>You can also paste a Walmart, H‑E‑B, Kroger or Amazon product link below.</span>
          <div className="storeInventoryLinkRow"><input type="url" value={link} onChange={(event) => setLink(event.target.value)} onPaste={(event) => { const value = event.clipboardData.getData("text"); if (/^https?:\/\//i.test(value.trim())) { event.preventDefault(); setLink(value.trim()); importLink(value.trim()); } }} placeholder="Paste product-page link" aria-label="Product link" /><button type="button" className="primary" onClick={() => importLink()}>Import Product</button></div>
          <input ref={fileInput} className="visuallyHidden" type="file" accept="image/*" onChange={(event) => acceptImage(event.target.files?.[0])} />
          <button type="button" className="secondary" onClick={() => fileInput.current?.click()}>Upload Product Image</button>
        </div>
        {previewUrl && <div className="storeInventoryImagePreview"><img src={previewUrl} alt="Product preview" /></div>}
      </div>
      <p className="storeInventoryPrivacy">Inventory information stays on this device. Store links are never used to request login information.</p>
      {error && <p className="storeInventoryFeedback is-error" role="alert">{error}</p>}
      {message && <p className="storeInventoryFeedback" role="status">{message}</p>}
      {draft && <form className="storeInventoryConfirmation" onSubmit={(event) => { event.preventDefault(); onConfirm(); }}>
        <h3>Confirm Product Details</h3>
        {field("productName", "Product name", { wide: true })}
        {field("brand", "Brand")}{field("variety", "Variety or description")}{field("packageSize", "Package size")}
        {field("packageCount", "Package count", { type: "number", min: "0" })}{field("quantityOwned", "Quantity owned", { type: "number", min: "0", step: "any" })}{field("unit", "Unit being tracked")}
        <label><span>Category</span><select value={draft.categoryId} onChange={(event) => {
          const categoryId = event.target.value;
          const family = MASTER_KITCHEN_INVENTORY_TAXONOMY.find((entry) => entry.id === categoryId)?.products[0] || "";
          setDraft((current) => ({ ...current, categoryId, family }));
        }}>{MASTER_INVENTORY_CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}</select></label>
        <label><span>Product type</span><select value={draft.family} onChange={(event) => setDraft((current) => ({ ...current, family: event.target.value }))}>{(selectedCategory?.products || []).map((family) => <option key={family}>{family}</option>)}</select></label>
        <label><span>Storage location</span><select value={draft.storage} onChange={(event) => setDraft((current) => ({ ...current, storage: event.target.value }))}>{["Refrigerator", "Freezer", "Pantry", "Counter", "Other"].map((value) => <option key={value}>{value}</option>)}</select></label>
        {field("expirationDate", "Expiration or best-by date", { type: "date" })}{field("lowStockLevel", "Low-stock level", { type: "number", min: "0", step: "any" })}
        {field("retailer", "Retailer")}{field("cleanUrl", "Clean product-page link", { wide: true, type: "url" })}{field("retailerItemId", "Retailer item ID")}
        {field("price", "Optional price when added", { type: "number", min: "0", step: ".01" })}{field("priceRecordedAt", "Date price was recorded", { type: "date" })}
        <div className="storeInventoryConfirmationActions"><button type="submit" className="primary">{isEditing ? "Update Inventory" : "Add to Inventory"}</button><button type="button" className="secondary" onClick={onCancel}>Cancel</button></div>
      </form>}
    </div>}
  </section>;
}
