import { useEffect, useRef, useState } from "react";
import "./PhotoInventoryTransfer.css";

import { newItem, cleanTransferItems, readTransfer, TRANSFER_TYPE, TRANSFER_VERSION, CAPTURE_DRAFT_KEY, readPhotoText, readBarcodePhoto, mergeCaptureInventory, findCaptureMatch } from "../utils/inventoryCapture.js";
import { buildMasterKitchenInventoryCatalog } from "../data/masterKitchenInventoryCatalog.js";

export default function PhotoInventoryTransfer({ masterInventory, setMasterInventory, recipes = [], onClose }) {
  const [photos, setPhotos] = useState([]);
  const [entryText, setEntryText] = useState("");
  const [destination, setDestination] = useState("pantry");
  const [items, setItems] = useState(() => { try { const draft = JSON.parse(localStorage.getItem(CAPTURE_DRAFT_KEY) || "[]"); return Array.isArray(draft) ? draft.slice(0, 200) : []; } catch { return []; } });
  const [busy, setBusy] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [draftWarning, setDraftWarning] = useState("");
  const catalog = buildMasterKitchenInventoryCatalog(recipes, masterInventory?.customItems || []).flatMap(category => category.items);
  useEffect(() => { try { localStorage.setItem(CAPTURE_DRAFT_KEY, JSON.stringify(items)); setDraftWarning(""); } catch { setDraftWarning("This review list could not be saved on this device. Download a transfer file before closing."); } }, [items]);
  const [message, setMessage] = useState("");
  const importRef = useRef(null);
  const photoUrls = useRef(new Set());

  useEffect(() => () => photoUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  function capturePhotos(event) {
    const files = [...(event.target.files || [])].filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;
    const additions = files.map((file) => { const url = URL.createObjectURL(file); photoUrls.current.add(url); return { id: `${file.name}-${file.lastModified}-${Math.random()}`, name: file.name, file, url }; });
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
    let payload;
    try { payload = transferPayload(); } catch (error) { setMessage(error.message); return; }
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
    if (file.size > 1024 * 1024) { setMessage("Choose a transfer file smaller than 1 MB."); event.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result || "{}"));
        const imported = readTransfer(payload);
        setItems(current => [...current, ...imported.filter(item => !current.some(existing => existing.id === item.id))]);
        setMessage(`${imported.length} transferred item${imported.length === 1 ? "" : "s"} loaded for review.`);
      } catch {
        window.alert("That is not a valid Robert’s Recipe Box inventory transfer file.");
      }
      event.target.value = "";
    };
    reader.readAsText(file);
  }

  function addToInventories() {
    try {
      const reviewed = cleanTransferItems(items);
      if (!reviewed.length) return;
      const alreadySaved = masterInventory?.captureItemIds || [];
      const fresh = reviewed.filter(item => !alreadySaved.includes(item.id));
      const merged = mergeCaptureInventory(masterInventory, reviewed, catalog);
      localStorage.setItem("rrb_masterKitchenInventory_v1", JSON.stringify(merged));
      setMasterInventory(merged);
      setItems([]);
      setMessage(`${fresh.length} reviewed item${fresh.length === 1 ? "" : "s"} saved to Kitchen Inventory. ${reviewed.length - fresh.length} previously imported items skipped.`);
    } catch (error) { setMessage(error.message); }
  }
  async function readPhoto(photo) {
    setBusy(true);
    try { const text = await readPhotoText(photo.file, setMessage); setEntryText(text); setMessage("Photo text is ready below. Remove label details that are not products, then add your items to the review list."); }
    catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }
  function addBarcode(code) {
    if (!/^\d{8,14}$/.test(code)) { setMessage("Enter an 8–14 digit product barcode."); return; }
    const known = catalog.find(item => (masterInventory?.records?.[item.id]?.barcode || item.barcode) === code);
    const record = known ? masterInventory?.records?.[known.id] : null;
    setItems(current => [...current, { ...newItem(known ? record?.productName || known.productName || known.variation : "", destination), barcode: code }]);
    setBarcode("");
    setMessage(known ? "Saved product found. Review the quantity before saving." : "Barcode captured. Enter the product name below; RRB will remember it after you save.");
  }
  async function scanBarcode(event) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    setBusy(true);
    try { addBarcode(await readBarcodePhoto(file)); }
    catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }

  return <main className="photoInventoryPage">
    <header className="photoInventoryHeader"><div><p>RRB POCKET PANTRY</p><h2>Enter. Photograph. Scan.</h2><span>Capture products on your iPhone, review the details, then save here or transfer them to RRB on another device. Photos are processed on this device and are not transferred.</span></div><button type="button" onClick={onClose}>Back to Inventory</button></header>

    <section className="photoInventoryStep"><div className="photoInventoryStepNumber">1</div><div><h3>Photograph a Product or Receipt</h3><p>For readable text, take a close, straight photo of one label or receipt. Shelf photos can also be used as references.</p><label className="photoInventoryCameraButton">Take or Choose Photos<input type="file" accept="image/*" capture="environment" multiple onChange={capturePhotos} /></label></div></section>
    {photos.length > 0 && <div className="photoInventoryPhotos">{photos.map((photo) => <figure key={photo.id}><img src={photo.url} alt={`Inventory reference ${photo.name}`} /><button type="button" className="photoReadButton" disabled={busy} onClick={() => readPhoto(photo)}>Read Text</button><button type="button" onClick={() => removePhoto(photo.id)} aria-label={`Remove ${photo.name}`}>×</button></figure>)}</div>}

    <section className="photoInventoryStep"><div className="photoInventoryStepNumber">2</div><div className="photoInventoryEntry"><h3>Enter or Correct Product Names</h3><p>Type or use Apple dictation. Enter one item per line; you can correct details before anything is saved.</p><div className="photoInventoryDestination" role="group" aria-label="Default inventory destination"><button type="button" className={destination === "pantry" ? "active" : ""} onClick={() => setDestination("pantry")}>Pantry</button><button type="button" className={destination === "freezer" ? "active" : ""} onClick={() => setDestination("freezer")}>Freezer</button><button type="button" className={destination === "refrigerator" ? "active" : ""} onClick={() => setDestination("refrigerator")}>Refrigerator</button></div><textarea aria-label="Product names or text read from photo" rows="5" value={entryText} onChange={(event) => setEntryText(event.target.value)} placeholder={'Canned tomatoes\nChicken broth\nFrozen chicken breasts'} /><button type="button" className="primary" onClick={addTypedItems}>Add to Review List</button></div></section>

    <section className="photoInventoryStep"><div className="photoInventoryStepNumber">3</div><div><h3>Scan a Product Barcode</h3><p>Take a close photo of the entire barcode. First-time products need a name; saved products can be recognized on this device.</p><label className="photoInventoryCameraButton">Photograph Barcode<input type="file" accept="image/*" capture="environment" disabled={busy} onChange={scanBarcode} /></label><div className="photoBarcodeEntry"><input aria-label="Product barcode number" inputMode="numeric" value={barcode} onChange={event => setBarcode(event.target.value)} placeholder="Or type the barcode number" /><button type="button" onClick={() => addBarcode(barcode)}>Add Barcode</button></div></div></section>
    <section className="photoInventoryStep"><div className="photoInventoryStepNumber">4</div><div><h3>Review the Transfer List</h3><p>Edit names, quantities, and destinations before adding or transferring.</p></div></section>
    <div className="photoInventoryList">{items.map((item, index) => <fieldset key={item.id}><legend>Item {index + 1}</legend><label><span>Item name</span><input value={item.name} onChange={(event) => updateItem(item.id, { name: event.target.value })} /></label><label><span>Inventory</span><select value={item.destination} onChange={(event) => updateItem(item.id, { destination: event.target.value })}><option value="pantry">Pantry</option><option value="freezer">Freezer</option><option value="refrigerator">Refrigerator</option></select></label><label><span>Quantity</span><input type="number" min="0.01" step="any" inputMode="decimal" value={item.quantity} onChange={(event) => updateItem(item.id, { quantity: event.target.value })} /></label><label><span>Unit</span><input value={item.unit} onChange={(event) => updateItem(item.id, { unit: event.target.value })} placeholder="item, can, bag..." /></label><label><span>Quantity action</span><select value={item.action || "replace"} onChange={event => updateItem(item.id, { action: event.target.value })}><option value="replace">Set counted quantity</option><option value="add">Add purchased quantity</option></select></label><p className="photoMatchStatus">{item.barcode ? `Barcode: ${item.barcode}. ` : ""}{findCaptureMatch(item, masterInventory, catalog) ? "Matches a saved product." : "Will create a new product."}</p><label className="photoInventoryNotes"><span>Notes</span><input value={item.notes} onChange={(event) => updateItem(item.id, { notes: event.target.value })} /></label><button type="button" className="photoInventoryRemove" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}>Remove</button></fieldset>)}{!items.length && <p className="photoInventoryEmpty">No items are waiting for review.</p>}</div>

    {draftWarning && <p role="alert">{draftWarning}</p>}
    {message && <p className="photoInventoryMessage" role="status">{message}</p>}
    <details className="photoInventoryHelp"><summary>Use on your iPhone and transfer to your Mac</summary><p>In Safari, open the Pocket Pantry link below. Tap Share → Add to Home Screen. Your review list is saved on this device.</p><p><a href="/pantry-capture.html">Open Pocket Pantry for your Home Screen</a></p><p>Tap Share or Download Transfer File and use AirDrop or Save to Files. On your Mac, open the same Photo List screen, choose Open Transfer File, review it, then tap Add Reviewed Items to Inventory. This imports only inventory items; it does not replace your recipe-box backup.</p></details>
    <footer className="photoInventoryActions"><button type="button" className="primary" disabled={!items.length || busy} onClick={addToInventories}>Add Reviewed Items to Inventory</button><button type="button" className="secondary" disabled={!items.length || busy} onClick={exportTransfer}>Share or Download Transfer File</button><button type="button" className="secondary" onClick={() => importRef.current?.click()}>Open Transfer File</button><input ref={importRef} className="photoInventoryHiddenInput" type="file" accept="application/json,.json" onChange={importTransfer} /></footer>
  </main>;
}
