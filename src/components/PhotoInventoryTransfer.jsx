import { useEffect, useRef, useState } from "react";
import { FREEZER_CATEGORIES } from "../data/freezerInventory";
import "./PhotoInventoryTransfer.css";

const TRANSFER_TYPE = "roberts-recipe-box-inventory-transfer";
const TRANSFER_VERSION = 1;

function newItem(name = "", destination = "pantry") {
  return { id: `photo-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name, destination, quantity: "1", unit: "item", notes: "" };
}

function cleanTransferItems(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const name = String(item?.name || "").trim();
    if (!name) return [];
    return [{ ...newItem(), ...item, name, destination: item.destination === "freezer" ? "freezer" : "pantry", quantity: String(item.quantity || "1"), unit: String(item.unit || "item"), notes: String(item.notes || "") }];
  });
}

export default function PhotoInventoryTransfer({ pantry, setPantry, freezer, setFreezer, onClose }) {
  const [photos, setPhotos] = useState([]);
  const [entryText, setEntryText] = useState("");
  const [destination, setDestination] = useState("pantry");
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const importRef = useRef(null);
  const photoUrls = useRef(new Set());

  useEffect(() => () => photoUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  function capturePhotos(event) {
    const files = [...(event.target.files || [])].filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    const additions = files.map((file) => { const url = URL.createObjectURL(file); photoUrls.current.add(url); return { id: `${file.name}-${file.lastModified}-${Math.random()}`, name: file.name, url }; });
    setPhotos((current) => [...current, ...additions]);
    event.target.value = "";
  }

  function removePhoto(id) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) { URL.revokeObjectURL(target.url); photoUrls.current.delete(target.url); }
      return current.filter((photo) => photo.id !== id);
    });
  }

  function addTypedItems() {
    const names = entryText.split(/\n|,/).map((name) => name.trim()).filter(Boolean);
    if (!names.length) return;
    setItems((current) => [...current, ...names.map((name) => newItem(name, destination))]);
    setEntryText("");
    setMessage(`${names.length} item${names.length === 1 ? "" : "s"} added for review.`);
  }

  function updateItem(id, patch) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  function transferPayload() {
    return { type: TRANSFER_TYPE, version: TRANSFER_VERSION, createdAt: new Date().toISOString(), items: cleanTransferItems(items) };
  }

  async function exportTransfer() {
    const payload = transferPayload();
    if (!payload.items.length) return;
    const fileName = `roberts-recipe-box-inventory-transfer-${new Date().toISOString().slice(0, 10)}.json`;
    const file = new File([JSON.stringify(payload, null, 2)], fileName, { type: "application/json" });
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      try { await navigator.share({ title: "Recipe Box Inventory Transfer", files: [file] }); return; } catch (error) { if (error?.name === "AbortError") return; }
    }
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function importTransfer(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || "{}"));
        if (payload.type !== TRANSFER_TYPE || Number(payload.version) !== TRANSFER_VERSION) throw new Error("Unsupported transfer file");
        const imported = cleanTransferItems(payload.items);
        setItems(imported);
        setMessage(`${imported.length} transferred item${imported.length === 1 ? "" : "s"} loaded for review.`);
      } catch {
        window.alert("That is not a valid Robert’s Recipe Box inventory transfer file.");
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  }

  function addToInventories() {
    const reviewed = cleanTransferItems(items);
    const pantryItems = reviewed.filter((item) => item.destination === "pantry");
    const freezerItems = reviewed.filter((item) => item.destination === "freezer");
    if (!reviewed.length) return;

    if (pantryItems.length) setPantry((current = {}) => {
      const meta = current.__inventoryHub && typeof current.__inventoryHub === "object" ? current.__inventoryHub : {};
      const customItems = Array.isArray(meta.customItems) ? [...meta.customItems] : [];
      const statuses = meta.statuses && typeof meta.statuses === "object" ? { ...meta.statuses } : {};
      const next = { ...current };
      pantryItems.forEach((item, index) => {
        let existing = customItems.find((candidate) => String(candidate.name).toLowerCase() === item.name.toLowerCase());
        if (!existing) { existing = { id: `custom-pantry-photo-${Date.now()}-${index}`, name: item.name, level: 1, type: "Photo Inventory" }; customItems.push(existing); }
        next[existing.id] = true;
        next[item.name] = true;
        statuses[existing.id] = "in-stock";
        statuses[item.name] = "in-stock";
      });
      next.__inventoryHub = { ...meta, customItems, statuses };
      return next;
    });

    if (freezerItems.length) setFreezer((current = {}) => {
      const safe = { items: current.items && typeof current.items === "object" ? { ...current.items } : {}, customItems: Array.isArray(current.customItems) ? [...current.customItems] : [], customLocations: Array.isArray(current.customLocations) ? current.customLocations : [] };
      freezerItems.forEach((item, index) => {
        let existing = safe.customItems.find((candidate) => String(candidate.name).toLowerCase() === item.name.toLowerCase());
        if (!existing) { const category = FREEZER_CATEGORIES[0] || { id: "meat-poultry", title: "Frozen Foods" }; existing = { id: `custom-freezer-photo-${Date.now()}-${index}`, name: item.name, categoryId: category.id, categoryTitle: category.title, custom: true }; safe.customItems.push(existing); }
        safe.items[existing.id] = { ...(safe.items[existing.id] || {}), onHand: true, quantity: item.quantity, unit: item.unit, location: safe.items[existing.id]?.location || "Kitchen freezer", status: "Plenty on hand", notes: item.notes };
      });
      return safe;
    });

    setMessage(`${reviewed.length} item${reviewed.length === 1 ? "" : "s"} added to inventory.`);
  }

  return <main className="photoInventoryPage">
    <header className="photoInventoryHeader"><div><p>PHOTO INVENTORY TRANSFER</p><h2>Photograph It. Review It. Add It.</h2><span>Use your iPhone or iPad camera while checking shelves or freezers. Photos remain on this device and are not included in the transfer file.</span></div><button type="button" onClick={onClose}>Back to Inventory</button></header>

    <section className="photoInventoryStep"><div className="photoInventoryStepNumber">1</div><div><h3>Take Reference Photos</h3><p>Photograph one shelf, cabinet, or freezer section at a time.</p><label className="photoInventoryCameraButton">Take or Choose Photos<input type="file" accept="image/*" capture="environment" multiple onChange={capturePhotos} /></label></div></section>
    {photos.length > 0 && <div className="photoInventoryPhotos">{photos.map((photo) => <figure key={photo.id}><img src={photo.url} alt={`Inventory reference ${photo.name}`} /><button type="button" onClick={() => removePhoto(photo.id)} aria-label={`Remove ${photo.name}`}>×</button></figure>)}</div>}

    <section className="photoInventoryStep"><div className="photoInventoryStepNumber">2</div><div className="photoInventoryEntry"><h3>List What You See</h3><p>Type or use Apple dictation. Enter one item per line; you can correct details before anything is saved.</p><div className="photoInventoryDestination" role="group" aria-label="Default inventory destination"><button type="button" className={destination === "pantry" ? "active" : ""} onClick={() => setDestination("pantry")}>Pantry</button><button type="button" className={destination === "freezer" ? "active" : ""} onClick={() => setDestination("freezer")}>Frozen Foods</button></div><textarea rows="5" value={entryText} onChange={(event) => setEntryText(event.target.value)} placeholder={'Canned tomatoes\nChicken broth\nFrozen chicken breasts'} /><button type="button" className="primary" onClick={addTypedItems}>Add to Review List</button></div></section>

    <section className="photoInventoryStep"><div className="photoInventoryStepNumber">3</div><div><h3>Review the Transfer List</h3><p>Edit names, quantities, and destinations before adding or transferring.</p></div></section>
    <div className="photoInventoryList">{items.map((item, index) => <fieldset key={item.id}><legend>Item {index + 1}</legend><label><span>Item name</span><input value={item.name} onChange={(event) => updateItem(item.id, { name: event.target.value })} /></label><label><span>Inventory</span><select value={item.destination} onChange={(event) => updateItem(item.id, { destination: event.target.value })}><option value="pantry">Pantry</option><option value="freezer">Frozen Foods</option></select></label><label><span>Quantity</span><input inputMode="decimal" value={item.quantity} onChange={(event) => updateItem(item.id, { quantity: event.target.value })} /></label><label><span>Unit</span><input value={item.unit} onChange={(event) => updateItem(item.id, { unit: event.target.value })} placeholder="item, can, bag..." /></label><label className="photoInventoryNotes"><span>Notes</span><input value={item.notes} onChange={(event) => updateItem(item.id, { notes: event.target.value })} /></label><button type="button" className="photoInventoryRemove" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button></fieldset>)}{!items.length && <p className="photoInventoryEmpty">No items are waiting for review.</p>}</div>

    {message && <p className="photoInventoryMessage" role="status">{message}</p>}
    <footer className="photoInventoryActions"><button type="button" className="primary" disabled={!items.length} onClick={addToInventories}>Add Reviewed Items to Inventory</button><button type="button" className="secondary" disabled={!items.length} onClick={exportTransfer}>Share or Download Transfer File</button><button type="button" className="secondary" onClick={() => importRef.current?.click()}>Open Transfer File</button><input ref={importRef} className="photoInventoryHiddenInput" type="file" accept="application/json,.json" onChange={importTransfer} /></footer>
  </main>;
}
