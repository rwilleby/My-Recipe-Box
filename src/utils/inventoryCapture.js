import { classifyInventoryProduct } from '../data/masterKitchenInventoryTaxonomy.js';
export const TRANSFER_TYPE = 'roberts-recipe-box-inventory-transfer';
export const TRANSFER_VERSION = 1;
export const CAPTURE_DRAFT_KEY = 'rrb_inventoryCaptureDraft_v1';
export function newItem(name = '', destination = 'pantry') {
  return { id: globalThis.crypto?.randomUUID?.() || `capture-${Date.now()}-${Math.random().toString(36).slice(2)}`, name, destination, quantity: '1', unit: 'item', notes: '', barcode: '', action: 'replace' };
}
export function cleanTransferItems(value) {
  if (!Array.isArray(value) || value.length > 200) throw new Error('A transfer may contain up to 200 items.');
  const ids = new Set();
  return value.map(item => {
    if (!item || typeof item !== 'object') throw new Error('Invalid inventory item.');
    const name = String(item.name || '').trim().slice(0, 160);
    const quantity = String(item.quantity ?? '1');
    if (!name || !Number.isFinite(Number(quantity)) || Number(quantity) <= 0) throw new Error('Each item needs a name and a quantity greater than zero.');
    const id = String(item.id || newItem().id).slice(0, 100);
    if (ids.has(id)) throw new Error('The transfer contains repeated item IDs.');
    ids.add(id);
    return { id, name, quantity, destination: ['pantry', 'freezer', 'refrigerator'].includes(item.destination) ? item.destination : 'pantry', unit: String(item.unit || 'item').trim().slice(0, 30) || 'item', notes: String(item.notes || '').slice(0, 500), barcode: /^\d{8,14}$/.test(String(item.barcode || '')) ? String(item.barcode) : '', action: item.action === 'add' ? 'add' : 'replace' };
  });
}
export function readTransfer(payload) {
  if (payload?.type !== TRANSFER_TYPE || Number(payload.version) !== TRANSFER_VERSION) throw new Error('That is not a supported RRB inventory transfer.');
  return cleanTransferItems(payload.items);
}
export const storageFor = item => ({ pantry: 'Pantry', freezer: 'Kitchen freezer', refrigerator: 'Refrigerator' }[item.destination]);
const normalized = value => String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
export function findCaptureMatch(item, inventory, catalog = []) {
  return catalog.find(candidate => {
    const record = inventory?.records?.[candidate.id] || {};
    const sameProduct = item.barcode && (record.barcode || candidate.barcode) === item.barcode || normalized(record.productName || candidate.productName || candidate.variation) === normalized(item.name);
    return sameProduct && normalized(record.storage || 'Pantry') === normalized(storageFor(item)) && normalized(record.unit || candidate.unit || 'item') === normalized(item.unit);
  });
}
export function mergeCaptureInventory(current, items, catalog = []) {
  const next = { ...current, records: { ...current?.records }, customItems: [...(current?.customItems || [])], captureItemIds: [...(current?.captureItemIds || [])] };
  for (const item of cleanTransferItems(items)) {
    if (next.captureItemIds.includes(item.id)) continue;
    const match = findCaptureMatch(item, next, [...catalog, ...next.customItems]);
    const id = match?.id || `custom-capture-${item.id}`;
    const classification = classifyInventoryProduct(item.name, item.destination === 'freezer' ? 'Frozen' : '');
    if (!match) next.customItems.push({ id, categoryId: classification.categoryId, family: classification.productType, variation: item.name, productName: item.name, unit: item.unit, barcode: item.barcode, custom: true });
    const previous = next.records[id] || {};
    const count = item.action === 'add' ? Number(previous.have || 0) + Number(item.quantity) : Number(item.quantity);
    next.records[id] = { ...previous, productName: item.name, have: String(count), unit: item.unit, storage: storageFor(item), notes: item.notes || previous.notes || '', barcode: item.barcode || previous.barcode || '', stockStatus: Number(previous.lowStockLevel || 0) > 0 && count <= Number(previous.lowStockLevel) ? 'low' : 'in-stock', updatedAt: new Date().toISOString() };
    next.captureItemIds.push(item.id);
  }
  return next;
}
let ocrLibrary;
async function loadOCR() {
  if (globalThis.Tesseract) return globalThis.Tesseract;
  if (!ocrLibrary) ocrLibrary = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/vendor/inventory-ocr/tesseract.min.js';
    script.onload = () => resolve(globalThis.Tesseract);
    script.onerror = () => { script.remove(); ocrLibrary = null; reject(new Error('Photo reading could not load. Check your connection and try again.')); };
    document.head.appendChild(script);
  });
  return ocrLibrary;
}
export async function readPhotoText(file, onProgress = () => {}) {
  if (file.size > 12 * 1024 * 1024) throw new Error('Please choose a photo smaller than 12 MB.');
  const library = await loadOCR();
  let worker;
  try {
    worker = await library.createWorker('eng', 1, { workerPath: '/vendor/inventory-ocr/worker.min.js', corePath: '/vendor/inventory-ocr/tesseract-core-lstm.wasm.js', langPath: '/vendor/inventory-ocr', gzip: false, logger: event => onProgress(`${event.status}: ${Math.round((event.progress || 0) * 100)}%`) });
    const result = await worker.recognize(file);
    if (!result.data.text.trim()) throw new Error('No text was readable. Try a closer photo or type the item.');
    return result.data.text.trim();
  } finally { await worker?.terminate(); }
}
export async function readBarcodePhoto(file) {
  if (file.size > 12 * 1024 * 1024) throw new Error('Please choose a barcode photo smaller than 12 MB.');
  const { BrowserMultiFormatReader } = await import('@zxing/browser');
  const url = URL.createObjectURL(file);
  try { return (await new BrowserMultiFormatReader().decodeFromImageUrl(url)).getText(); }
  catch { throw new Error('The barcode could not be read. Photograph it straight on, closer, with the whole barcode visible, or type its number.'); }
  finally { URL.revokeObjectURL(url); }
}
