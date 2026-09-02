import { useEffect, useRef, useState } from "react";
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

export default function StoreInventoryImport({ mode, setMode, draft, setDraft, previewUrl, onImage, onConfirm, onCancel, isEditing }) {
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInput = useRef(null);

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

  return <section className="storeInventoryPanel" aria-labelledby="storeInventoryTitle">
    <h2 id="storeInventoryTitle">ADD TO MY KITCHEN</h2>
    <div className="storeInventorySegments" role="tablist" aria-label="Choose how to add an inventory item">
      <button type="button" role="tab" aria-selected={mode === "products"} aria-controls="inventory-products-panel" onClick={() => setMode("products")}>Choose Products</button>
      <button type="button" role="tab" aria-selected={mode === "store"} aria-controls="inventory-store-panel" onClick={() => setMode("store")}>Add From Store</button>
      <button type="button" role="tab" aria-selected={mode === "manual"} aria-controls="inventory-manual-panel" onClick={() => setMode("manual")}>Enter Manually</button>
    </div>
    {mode === "products" && <p id="inventory-products-panel" role="tabpanel" className="storeInventoryModeNote">Choose a category and item below, add the quantity you have, then save it to your current inventory.</p>}
    {mode === "manual" && <p id="inventory-manual-panel" role="tabpanel" className="storeInventoryModeNote">Enter a product name or variety below and save it to your current inventory.</p>}
    {mode === "store" && <div id="inventory-store-panel" role="tabpanel">
      <div className="storeInventoryImportGrid">
        <div className="storeInventoryDropTarget" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
          <strong>Drag a product image or product link here</strong>
          <span>You can also paste a Walmart, H‑E‑B, Kroger or Amazon product link below.</span>
          <div className="storeInventoryLinkRow"><input type="url" value={link} onChange={(event) => setLink(event.target.value)} onPaste={(event) => { const value = event.clipboardData.getData("text"); if (/^https?:\/\//i.test(value.trim())) { event.preventDefault(); setLink(value.trim()); importLink(value.trim()); } }} placeholder="Paste product-page link" aria-label="Product link" /><div className="storeInventoryLinkActions"><button type="button" className="primary" onClick={() => importLink()}>Import Product</button><button type="button" className={`primary storeInventoryConfirm${draft ? "" : " is-waiting"}`} disabled={!draft} aria-hidden={!draft} onClick={onConfirm}>{isEditing ? "Confirm Update" : "Confirm & Add to Inventory"}</button></div></div>
          <input ref={fileInput} className="visuallyHidden" type="file" accept="image/*" onChange={(event) => acceptImage(event.target.files?.[0])} />
          <button type="button" className="secondary" onClick={() => fileInput.current?.click()}>Upload Product Image</button>
        </div>
        {previewUrl && <div className="storeInventoryImagePreview"><img src={previewUrl} alt="Product preview" /></div>}
      </div>
      <p className="storeInventoryPrivacy">Inventory information stays on this device. Store links are never used to request login information.</p>
      <div className="storeInventoryFeedbackSlot">{error ? <p className="storeInventoryFeedback is-error" role="alert">{error}</p> : message ? <p className="storeInventoryFeedback" role="status">{message}</p> : null}</div>
    </div>}
  </section>;
}
