import { useRef, useState } from "react";
import { createReceiptFingerprint, matchReceiptItems, parseWalmartReceiptText, readWalmartReceiptPdf } from "../utils/walmartReceiptImport.js";

const STATUS_LABELS = { matched: "Matched", review: "Needs Review", new: "New Item", ignored: "Ignored" };

export default function ReceiptInventoryImport({ catalog, inventory, onComplete, onCancel }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [items, setItems] = useState([]);
  const [fingerprint, setFingerprint] = useState("");
  const choices = catalog.flatMap((category) => category.items.map((item) => ({ ...item, categoryId: category.id, categoryTitle: category.title })));

  function acceptFile(nextFile) {
    setError(""); setStatus(""); setItems([]); setFingerprint("");
    if (!nextFile || (!/\.pdf$/i.test(nextFile.name || "") && nextFile.type !== "application/pdf")) { setFile(null); setError("Please choose a Walmart receipt PDF."); return; }
    setFile(nextFile);
  }

  async function readReceipt() {
    if (!file) return setError("Choose a Walmart receipt PDF first.");
    setError(""); setStatus("Reading receipt on this device…");
    try {
      const parsed = parseWalmartReceiptText(await readWalmartReceiptPdf(file));
      const nextFingerprint = await createReceiptFingerprint(parsed.purchaseDate, parsed.items);
      setPurchaseDate(parsed.purchaseDate);
      setFingerprint(nextFingerprint);
      setItems(matchReceiptItems(parsed.items, catalog, inventory.receiptAliases || {}));
      setStatus((inventory.receiptFingerprints || []).includes(nextFingerprint)
        ? "This receipt appears to have been imported before. Review carefully before importing it again."
        : "Receipt ready. Review every item before adding it to inventory.");
    } catch (reason) { setStatus(""); setError(reason.message); }
  }

  function updateItem(index, patch) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }

  function selectMatch(index, matchedItemId) {
    const match = choices.find((choice) => choice.id === matchedItemId);
    updateItem(index, match ? { matchedItemId, categoryId: match.categoryId, family: match.family, unit: match.unit || "items", status: "matched", selected: true } : { matchedItemId: "", status: "new", selected: false });
  }

  const selectedCount = items.filter((item) => item.selected && item.status !== "ignored").length;
  return <div id="inventory-receipt-panel" role="tabpanel" className="receiptInventoryPanel">
    {!items.length && <>
      <div className="receiptInventoryDrop" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); acceptFile([...(event.dataTransfer.files || [])][0]); }}>
        <strong>Drag a Walmart receipt PDF here</strong>
        <span>or choose a PDF saved from your Walmart order or receipt page.</span>
        <input ref={inputRef} className="visuallyHidden" type="file" accept="application/pdf,.pdf" onChange={(event) => acceptFile(event.target.files?.[0])} />
        <button type="button" className="secondary" onClick={() => inputRef.current?.click()}>Upload Receipt PDF</button>
      </div>
      {file && <div className="receiptInventoryFile"><span><strong>{file.name}</strong><small>{(file.size / 1024).toFixed(1)} KB</small></span><button type="button" className="primary" onClick={readReceipt}>Read Receipt</button><button type="button" className="secondary" onClick={() => { setFile(null); onCancel?.(); }}>Cancel</button></div>}
    </>}
    {error && <p className="receiptInventoryFeedback is-error" role="alert">{error}</p>}
    {status && <p className="receiptInventoryFeedback" role="status">{status}</p>}
    {items.length > 0 && <section className="receiptReview" aria-labelledby="receiptReviewTitle">
      <header><div><h3 id="receiptReviewTitle">Review Receipt Items</h3><p>Check matched products, correct uncertain lines, and choose how existing inventory should be updated.</p></div><label><span>Purchase date</span><input type="text" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} /></label></header>
      <div className="receiptReviewRows">{items.map((item, index) => <article className={`receiptReviewRow is-${item.status}`} key={item.id}>
        <label className="receiptSelect"><input type="checkbox" checked={Boolean(item.selected)} disabled={item.status === "ignored"} onChange={(event) => updateItem(index, { selected: event.target.checked })} /><span className="visuallyHidden">Select {item.description}</span></label>
        <label className="receiptDescription"><span>Receipt description</span><input value={item.description} onChange={(event) => updateItem(index, { description: event.target.value })} /></label>
        <label><span>Matched product</span><select value={item.matchedItemId} onChange={(event) => selectMatch(index, event.target.value)}><option value="">Create as custom item</option>{choices.map((choice) => <option key={choice.id} value={choice.id}>{choice.categoryTitle} · {choice.family} · {choice.variation}</option>)}</select></label>
        <label className="receiptQty"><span>Qty</span><input type="number" min="0" step="any" value={item.quantity} onChange={(event) => updateItem(index, { quantity: event.target.value })} /></label>
        <label><span>Unit</span><input value={item.unit} onChange={(event) => updateItem(index, { unit: event.target.value })} /></label>
        <label><span>Storage</span><select value={item.storage || "Pantry"} onChange={(event) => updateItem(index, { storage: event.target.value })}>{["Refrigerator", "Freezer", "Pantry", "Counter", "Other"].map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>Existing item</span><select value={item.restockMode || "add"} onChange={(event) => updateItem(index, { restockMode: event.target.value })}><option value="add">Add to existing quantity</option><option value="replace">Replace current quantity</option><option value="separate">Create separate entry</option><option value="skip">Skip this item</option></select></label>
        <span className="receiptStatus">{STATUS_LABELS[item.status]}</span>
        <button type="button" className="receiptIgnore" onClick={() => updateItem(index, item.status === "ignored" ? { status: item.matchedItemId ? "matched" : "new", selected: false } : { status: "ignored", selected: false })}>{item.status === "ignored" ? "Restore" : "Ignore"}</button>
      </article>)}</div>
      <footer><span>{selectedCount} of {items.length} items selected</span><button type="button" className="primary" disabled={!selectedCount} onClick={() => { onComplete({ items, fingerprint, purchaseDate }); setItems([]); setFile(null); setStatus(""); }}>Add Selected Items</button><button type="button" className="secondary" onClick={() => { setItems([]); setFile(null); setStatus(""); onCancel?.(); }}>Cancel</button></footer>
    </section>}
    <p className="receiptInventoryPrivacy">Your receipt is read locally in this browser. The PDF, receipt text, payment details, and account information are not saved.</p>
  </div>;
}
