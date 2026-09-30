import { useEffect, useRef, useState } from 'react';
import { buildMasterKitchenInventoryCatalog } from '../data/masterKitchenInventoryCatalog.js';
import { saveInventoryProductThumbnail, loadInventoryProductThumbnail } from '../utils/inventoryProductImages.js';
import { newItem, readTransfer, cleanTransferItems, transferPayload, CAPTURE_DRAFT_KEY, STORES, mergeCaptureInventory, findCaptureMatch, inventorySnapshot, referencePhoto, storageFor } from '../utils/inventoryCapture.js';
import './PhotoInventoryTransfer.css';
const FORM_KEY = 'rrb_pocketPantryForm_v2';
const OPENED_KEY = 'rrb_pocketPantryOpenedInventory_v2';
const STORE_KEY = 'rrb_pocketPantryStore_v2';
const readSaved = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const savedList = key => { const value = readSaved(key, []); return Array.isArray(value) ? value.filter(item => item && typeof item.name === 'string').slice(0, 1000) : []; };
function freshForm() { const item = newItem(); try { item.retailer = localStorage.getItem(STORE_KEY) || 'Walmart'; } catch {} return item; }

export default function PhotoInventoryTransfer({ masterInventory, setMasterInventory, recipes = [], onClose }) {
  const [items, setItems] = useState(() => savedList(CAPTURE_DRAFT_KEY));
  const [form, setForm] = useState(() => ({ ...freshForm(), ...readSaved(FORM_KEY, {}) }));
  const [openedInventory, setOpenedInventory] = useState(() => savedList(OPENED_KEY));
  const [editingId, setEditingId] = useState('');
  const [view, setView] = useState('add');
  const [message, setMessage] = useState('');
  const [warning, setWarning] = useState('');
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [sent, setSent] = useState(false);
  const importRef = useRef(null);
  const catalog = buildMasterKitchenInventoryCatalog(recipes, masterInventory?.customItems || []).flatMap(category => category.items);
  const sourceInventory = openedInventory.length ? openedInventory : inventorySnapshot(masterInventory, catalog);
  useEffect(() => { try { localStorage.setItem(FORM_KEY, JSON.stringify(form)); setWarning(''); } catch { setWarning('This form could not be saved on your phone. Remove its photo or export your saved products before closing.'); } }, [form]);
  const update = patch => setForm(current => ({ ...current, ...patch }));
  function rememberStore(retailer) { update({ retailer }); try { localStorage.setItem(STORE_KEY, retailer); } catch {} }
  function commitList(next) { localStorage.setItem(CAPTURE_DRAFT_KEY, JSON.stringify(next)); setItems(next); setSent(false); }
  function saveProduct(event) {
    event.preventDefault();
    try {
      const item = cleanTransferItems([{ ...form, id: newItem().id }])[0];
      const next = editingId ? items.map(entry => entry.id === editingId ? item : entry) : [...items.filter(entry => entry.inventoryId !== item.inventoryId), item];
      if (next.length > 1000) throw new Error('Send this batch before adding more products.');
      commitList(next);
      setEditingId(''); setForm(freshForm()); setMessage(`${item.brand ? `${item.brand} ` : ''}${item.name} saved to your transfer list. Add the next product, or choose Review & Transfer.`);
    } catch (error) { setMessage(`Could not save: ${error.message}`); }
  }
  function editProduct(item, queued = false) {
    setForm({ ...newItem(), ...item, action: queued && !(masterInventory?.captureItemIds || []).includes(item.id) ? item.action : 'replace' });
    setEditingId(queued ? item.id : ''); setView('add'); setMessage('Edit the product, then save it to your transfer list.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function attachPhoto(event) {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    setBusy(true);
    try { update({ photo: await referencePhoto(file) }); setMessage('Reference photo attached. Enter the product details below.'); }
    catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }
  async function withPhotos(list) {
    return Promise.all(list.map(async item => {
      if (item.photo || !item.imageKey) return item;
      const blob = await loadInventoryProductThumbnail(item.imageKey).catch(() => null);
      return blob ? { ...item, photo: await referencePhoto(blob) } : item;
    }));
  }
  async function exportFile(mode, share = true) {
    setBusy(true);
    try {
      const list = mode === 'inventory' ? sourceInventory : items;
      if (!list.length) throw new Error('There are no products to export yet.');
      const payload = transferPayload(await withPhotos(list), mode);
      const file = new File([JSON.stringify(payload, null, 2)], `RRB-Pocket-Pantry-${mode}-${new Date().toISOString().slice(0,10)}.json`, { type: 'application/json' });
      if (file.size > 8 * 1024 * 1024) throw new Error('This transfer is too large. Remove some photos or send a smaller batch.');
      if (share && navigator.share && navigator.canShare?.({ files: [file] })) {
        try { await navigator.share({ title: 'RRB Pocket Pantry', files: [file] }); setSent(mode === 'changes'); setMessage('Share completed. Open the file in RRB on your laptop, review it, then click Add to My Inventory.'); return; }
        catch (error) { if (error.name === 'AbortError') return; }
      }
      const url = URL.createObjectURL(file); const link = document.createElement('a'); link.href = url; link.download = file.name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 30000);
      setSent(mode === 'changes'); setMessage(mode === 'inventory' ? 'Inventory file downloaded. Move it to your iPhone and choose Open My Inventory.' : 'Transfer file downloaded. Move it to your laptop and choose Import Pocket Pantry File in RRB.');
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  }
  async function openFile(event) {
    const file = event.target.files?.[0]; event.target.value = ''; if (!file) return;
    try {
      if (file.size > 8 * 1024 * 1024) throw new Error('Choose a Pocket Pantry file smaller than 8 MB.');
      const payload = JSON.parse(await file.text()); const imported = readTransfer(payload);
      if (payload.mode === 'inventory') {
        if (!imported.length) throw new Error('This inventory file has no products.');
        // Opening a list never replaces this device's saved RRB inventory.
        setOpenedInventory(imported);
        try { localStorage.setItem(OPENED_KEY, JSON.stringify(imported)); } catch { setWarning('The opened list is available for this session only. Export your changes before closing.'); }
        setView('inventory'); setMessage(`${imported.length} inventory products opened. Select Edit on products you want to change. Only saved changes are sent back.`);
      } else {
        const existing = new Set(items.map(item => item.id)); const next = [...items, ...imported.filter(item => !existing.has(item.id))];
        if (next.length > 1000) throw new Error('Send or clear the current batch before opening this file.');
        commitList(next); setView('review'); setMessage(`${imported.length} products loaded for review. Check them, then click Add to My Inventory.`);
      }
    } catch (error) { setMessage(`Could not open file: ${error.message}`); }
  }
  async function applyItems() {
    setBusy(true);
    try {
      const reviewed = cleanTransferItems(items);
      const latest = readSaved('rrb_masterKitchenInventory_v1', masterInventory);
      const fresh = reviewed.filter(item => !(latest?.captureItemIds || []).includes(item.id));
      const merged = mergeCaptureInventory(latest, reviewed, catalog);
      for (const item of fresh.filter(entry => entry.photo)) {
        const match = findCaptureMatch(item, merged, catalog); const imageKey = merged.records[match.id].imageKey;
        await saveInventoryProductThumbnail(imageKey, await (await fetch(item.photo)).blob());
      }
      localStorage.setItem('rrb_masterKitchenInventory_v1', JSON.stringify(merged)); setMasterInventory(merged);
      setMessage(`${fresh.length} products saved to this device’s Kitchen Inventory. ${reviewed.length - fresh.length} already imported changes skipped. ${window.location.pathname.includes('pantry-capture') ? 'To put them on your laptop, also use Send Changes to RRB.' : ''}`);
    } catch (error) { setMessage(`Could not import: ${error.message}. Your transfer list has been kept.`); }
    finally { setBusy(false); }
  }
  function removeProduct(id) { try { commitList(items.filter(item => item.id !== id)); } catch { setMessage('Could not save this change. Your product was kept.'); } }
  function clearTransfer() {
    if (!window.confirm('Clear this transfer list? Products already saved in Kitchen Inventory will remain.')) return;
    try { commitList([]); setMessage('Transfer list cleared. Your saved Kitchen Inventory has not changed.'); } catch { setMessage('The transfer list could not be cleared.'); }
  }
  const savedChanges = new Set(items.map(item => item.inventoryId));
  const matching = form.inventoryId && (masterInventory?.records?.[form.inventoryId] || openedInventory.some(item => item.inventoryId === form.inventoryId));
  return <main className="pocketPantryPage">
    <header className="pocketHeader"><div><p>ROBERT’S RECIPE BOX</p><h1>Pocket Pantry</h1><span>Add products on your phone. Send the saved list to RRB on your laptop.</span></div><button type="button" onClick={onClose}>Back to Kitchen Inventory</button></header>
    <nav className="pocketTools" aria-label="Inventory files"><button disabled={busy} onClick={() => importRef.current?.click()}>Open My Inventory / Import File</button><button disabled={busy || !sourceInventory.length} onClick={() => exportFile('inventory', false)}>Export Inventory to My Phone</button></nav>
    <input ref={importRef} className="pocketHidden" type="file" accept="application/json,.json" onChange={openFile} />
    <div className="pocketTabs" role="tablist" aria-label="Pocket Pantry sections">{[['add','Add a Product'],['review',`Review & Transfer (${items.length})`],['inventory',`My Inventory (${sourceInventory.length})`]].map(([id,label]) => <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)}>{label}</button>)}</div>
    {warning && <p className="pocketAlert" role="alert">{warning}</p>}
    {message && <p className="pocketMessage" role="status">{message}</p>}
    {view === 'add' && <form className="pocketPanel pocketForm" onSubmit={saveProduct}>
      <h2>{editingId || matching ? 'Edit a Product' : 'Add a Product'}</h2>
      <label><span>Store</span><select aria-label="Store" value={STORES.includes(form.retailer) ? form.retailer : 'Other'} onChange={event => rememberStore(event.target.value)}>{STORES.map(store => <option key={store}>{store}</option>)}</select></label>
      {(!STORES.includes(form.retailer) || form.retailer === 'Other') && <label><span>Other store name</span><input value={form.retailer === 'Other' ? '' : form.retailer} onChange={event => rememberStore(event.target.value || 'Other')} placeholder="Store name" /></label>}
      <label><span>Brand <small>(optional)</small></span><input value={form.brand || ''} onChange={event => update({brand:event.target.value})} placeholder="Great Value" maxLength="100" /></label>
      <label className="pocketWide"><span>Product name</span><input required value={form.name} onChange={event => update({name:event.target.value})} placeholder="Chicken Broth" maxLength="160" /></label>
      <label><span>Package size</span><input value={form.packageSize || ''} onChange={event => update({packageSize:event.target.value})} placeholder="32 fl oz, 15 oz, or 12 count" maxLength="100" /></label>
      <label><span>Package type</span><select aria-label="Package type" value={form.unit || 'packages'} onChange={event => update({unit:event.target.value})}>{['packages','cartons','cans','bags','bottles','boxes','jars','items','each','lb','oz',...(!['packages','cartons','cans','bags','bottles','boxes','jars','items','each','lb','oz'].includes(form.unit) ? [form.unit] : [])].map(unit => <option key={unit} value={unit}>{unit}</option>)}</select></label>
      <label><span>Quantity</span><div className="pocketQuantity"><button type="button" aria-label="Decrease quantity" onClick={() => update({quantity:String(Math.max(0,Number(form.quantity || 0)-1))})}>−</button><input aria-label="Quantity" type="number" min="0" step="any" required inputMode="decimal" value={form.quantity} onChange={event => update({quantity:event.target.value})} /><button type="button" aria-label="Increase quantity" onClick={() => update({quantity:String(Number(form.quantity || 0)+1)})}>+</button></div></label>
      <label><span>Storage location</span><select aria-label="Storage location" value={form.destination} onChange={event => update({destination:event.target.value,storage:''})}><option value="pantry">Pantry</option><option value="refrigerator">Refrigerator</option><option value="freezer">Freezer</option></select>{form.storage && <small>Current location: {form.storage}</small>}</label>
      <label className="pocketWide"><span>How should RRB use this quantity?</span><select aria-label="Quantity action" value={form.action} onChange={event => update({action:event.target.value})}><option value="add">Add newly purchased quantity</option><option value="replace">Set the quantity I have now</option></select><small>Choose “Set” to correct your inventory. Use quantity 0 to mark it out of stock.</small></label>
      <label className="pocketWide"><span>Notes <small>(optional)</small></span><input value={form.notes || ''} onChange={event => update({notes:event.target.value})} maxLength="500" /></label>
      <details className="pocketWide pocketPhoto"><summary>Optional reference photo</summary><p>Attach a photo to help recognize this product. Enter the product details above; this photo does not fill them automatically.</p><label className="pocketPhotoButton">Take or Choose Photo<input type="file" accept="image/*" capture="environment" disabled={busy} onChange={attachPhoto} /></label>{form.photo && <div><img src={form.photo} alt="Product reference" /><button type="button" onClick={() => update({photo:''})}>Remove Photo</button></div>}</details>
      <div className="pocketWide pocketActions"><button className="pocketPrimary" disabled={busy} type="submit">Save & Add Another</button><button type="button" onClick={() => setView('review')}>Review & Transfer</button>{(editingId || matching) && <button type="button" onClick={() => { setForm(freshForm());setEditingId(''); }}>Cancel Edit</button>}</div>
    </form>}
    {view === 'review' && <section className="pocketPanel"><h2>Review & Transfer</h2><p>These products are saved in your transfer list. They reach the laptop after you send the file and import it there.</p>
      {!items.length && <div className="pocketEmpty"><p>No products are waiting to be sent.</p><button onClick={() => setView('add')}>Add a Product</button></div>}
      <div className="pocketProductList">{items.map(item => { const match = findCaptureMatch(item, masterInventory, catalog); const current = match && masterInventory?.records?.[match.id]; return <article key={item.id}>{item.photo && <img src={item.photo} alt={`${item.name} reference`} />}<div><h3>{item.brand ? `${item.brand} · ` : ''}{item.name || '(enter product name)'}</h3><p>{item.retailer || 'Store not specified'} · {item.packageSize || 'Size not specified'}</p><p><strong>{item.quantity} {item.unit}</strong> · {storageFor(item)}</p><p className="pocketMatch">{(masterInventory?.captureItemIds || []).includes(item.id) ? 'Already imported on this device.' : current ? `Update existing product (${current.have || 0} ${current.unit || item.unit} now).` : 'New product on this device.'} {item.action === 'add' ? 'Add this quantity.' : 'Set this quantity.'}</p>{item.notes && <p>{item.notes}</p>}</div><div className="pocketRowActions"><button onClick={() => editProduct(item,true)}>Edit</button><button onClick={() => removeProduct(item.id)}>Remove</button></div></article>; })}</div>
      <div className="pocketActions"><button className="pocketPrimary" disabled={!items.length || busy} onClick={() => exportFile('changes')}>Send Changes to RRB</button><button disabled={!items.length || busy} onClick={() => exportFile('changes',false)}>Download .json File</button><button disabled={!items.length || busy} onClick={applyItems}>Add to My Inventory on This Device</button></div>
      {items.length > 0 && <button className="pocketClear" disabled={busy} onClick={clearTransfer}>{sent ? 'Clear Sent Transfer List' : 'Clear Transfer List'}</button>}
      <div className="pocketTransferSteps"><h3>Get these products onto your laptop</h3><ol><li>Tap <strong>Send Changes to RRB</strong>. Choose AirDrop for a Mac, or Save to Files for iCloud Drive.</li><li>On the laptop, open RRB → Kitchen Inventory → <strong>Import / Export Inventory</strong>.</li><li>Choose <strong>Open My Inventory / Import File</strong> and select the saved .json file.</li><li>Review the products, then click <strong>Add to My Inventory on This Device</strong>.</li></ol><p>There is no automatic sync. Saving on the phone alone does not update the laptop.</p></div>
    </section>}
    {view === 'inventory' && <section className="pocketPanel"><h2>My Inventory</h2><p>{openedInventory.length ? 'This is the inventory file you opened. Edit a product to put its changes in the transfer list.' : 'Products already saved in Kitchen Inventory on this device. Edit a product to prepare an update.'}</p><label className="pocketSearch"><span>Find a product</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Name, brand, or store" /></label><div className="pocketProductList">{sourceInventory.filter(item => `${item.name} ${item.brand} ${item.retailer}`.toLowerCase().includes(search.toLowerCase())).map(item => <article key={item.inventoryId}><div><h3>{item.brand ? `${item.brand} · ` : ''}{item.name}</h3><p>{item.retailer || 'Store not specified'} · {item.packageSize || 'Size not specified'}</p><p><strong>{item.quantity} {item.unit}</strong> · {storageFor(item)}</p>{savedChanges.has(item.inventoryId) && <small>Changes waiting in Review & Transfer</small>}</div><button onClick={() => editProduct(item)}>Edit</button></article>)}</div>{!sourceInventory.length && <p className="pocketEmpty">Open an inventory .json file from your laptop, or start by adding products.</p>}{openedInventory.length > 0 && <button onClick={() => {setOpenedInventory([]);localStorage.removeItem(OPENED_KEY);}}>Use This Device’s Inventory Instead</button>}</section>}
    <details className="pocketHelp"><summary>Use Pocket Pantry on your iPhone</summary><p><a href="/pantry-capture.html">Open Pocket Pantry</a> in Safari, then choose Share → Add to Home Screen.</p><p>To edit the laptop’s current inventory, use Export Inventory to My Phone on the laptop, move the file to the phone, then choose Open My Inventory / Import File. Edit the products you want to change and send them back.</p><p>Your review list and form stay on this device. Optional small photos travel with the transfer file. Full Recipe Box backups use the separate Backup & Restore page.</p></details>
  </main>;
}
