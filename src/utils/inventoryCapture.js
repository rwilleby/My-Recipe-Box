import { classifyInventoryProduct, isApprovedInventoryProduct } from '../data/masterKitchenInventoryTaxonomy.js';
export const TRANSFER_TYPE = 'roberts-recipe-box-inventory-transfer';
export const TRANSFER_VERSION = 2;
export const CAPTURE_DRAFT_KEY = 'rrb_inventoryCaptureDraft_v1';
export const STORES = ['Walmart', 'Kroger', 'H-E-B', 'Aldi', 'Amazon', 'Costco', "Sam's Club", 'Target', 'Other'];
const uuid = () => globalThis.crypto?.randomUUID?.() || `pocket-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function newItem(name = '', destination = 'pantry') {
  const id = uuid();
  return { id, inventoryId: `custom-pocket-${id}`, name, brand: '', retailer: '', packageSize: '', destination, storage: '', quantity: '1', unit: 'packages', notes: '', photo: '', action: 'add' };
}
export const storageFor = item => item.storage || ({ pantry: 'Pantry', freezer: 'Kitchen freezer', refrigerator: 'Refrigerator' }[item.destination]) || 'Pantry';
const normalized = value => String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
const text = (value, limit) => typeof value === 'string' || typeof value === 'number' ? String(value).trim().slice(0, limit) : '';
export function cleanTransferItems(value) {
  if (!Array.isArray(value) || value.length > 1000) throw new Error('A transfer may contain up to 1,000 products.');
  const ids = new Set();
  return value.map(item => {
    if (!item || typeof item !== 'object') throw new Error('Invalid inventory product.');
    const name = text(item.name, 160);
    const quantity = text(item.quantity ?? '1', 30);
    if (!name || !quantity || !Number.isFinite(Number(quantity)) || Number(quantity) < 0) throw new Error('Each product needs a name and a quantity of zero or more.');
    const id = text(item.id, 100) || uuid();
    if (ids.has(id)) throw new Error('This file contains repeated change IDs.');
    ids.add(id);
    if (['__proto__', 'constructor', 'prototype'].includes(id) || ['__proto__', 'constructor', 'prototype'].includes(item.inventoryId)) throw new Error('Invalid product ID.');
    if (typeof item.photo === 'string' && item.photo.length > 160000) throw new Error('This product photo is too large. Choose a smaller photo.');
    const photo = text(item.photo, 160000);
    if (photo && !/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photo)) throw new Error('A product photo is invalid.');
    return { id, inventoryId: text(item.inventoryId, 160), name, brand: text(item.brand, 100), retailer: text(item.retailer, 100), packageSize: text(item.packageSize, 100), destination: ['pantry', 'freezer', 'refrigerator'].includes(item.destination) ? item.destination : 'pantry', storage: text(item.storage, 100), quantity, unit: text(item.unit, 30) || 'packages', notes: text(item.notes, 500), photo, imageKey: text(item.imageKey, 160), categoryId: text(item.categoryId, 80), family: text(item.family, 100), action: item.action === 'add' ? 'add' : 'replace' };
  });
}
export function readTransfer(payload) {
  if (payload?.type !== TRANSFER_TYPE || ![1, 2].includes(Number(payload.version))) throw new Error('Choose a Pocket Pantry .json file, rather than a full Recipe Box backup.');
  return cleanTransferItems(payload.items);
}
export function findCaptureMatch(item, inventory, catalog = []) {
  const candidates = [...catalog, ...(inventory?.customItems || []), ...Object.keys(inventory?.records || {}).map(id => ({ id }))];
  const explicit = item.inventoryId && candidates.find(candidate => candidate.id === item.inventoryId);
  if (explicit) return explicit;
  return candidates.find(candidate => {
    const record = inventory?.records?.[candidate.id] || {};
    return normalized(record.productName || candidate.productName || candidate.variation) === normalized(item.name)
      && normalized(record.brand ?? candidate.brand) === normalized(item.brand)
      && normalized(record.packageSize ?? candidate.packageSize) === normalized(item.packageSize)
      && normalized(record.retailer ?? candidate.retailer) === normalized(item.retailer)
      && normalized(record.storage || 'Pantry') === normalized(storageFor(item))
      && normalized(record.unit || candidate.unit || 'packages') === normalized(item.unit);
  });
}
export function mergeCaptureInventory(current, items, catalog = []) {
  const next = { ...current, records: { ...current?.records }, customItems: [...(current?.customItems || [])], captureItemIds: [...(current?.captureItemIds || [])] };
  for (const item of cleanTransferItems(items)) {
    if (next.captureItemIds.includes(item.id)) continue;
    const match = findCaptureMatch(item, next, catalog);
    const id = match?.id || item.inventoryId || `custom-capture-${item.id}`;
    const classified = classifyInventoryProduct(item.name, item.destination === 'freezer' ? 'Frozen' : '');
    const classification = isApprovedInventoryProduct(item.categoryId, item.family) ? { categoryId: item.categoryId, productType: item.family } : classified;
    const product = { productName: item.name, variation: item.name, brand: item.brand, packageSize: item.packageSize, retailer: item.retailer, unit: item.unit };
    const imageKey = item.photo ? `pocket-photo-${id}` : '';
    if (!match) next.customItems.push({ id, categoryId: classification.categoryId, family: classification.productType, ...product, ...(imageKey ? { imageKey } : {}), custom: true });
    else next.customItems = next.customItems.map(entry => entry.id === id ? { ...entry, ...product, ...(imageKey ? { imageKey } : {}) } : entry);
    const previous = next.records[id] || {};
    const count = item.action === 'add' ? Number(previous.have || 0) + Number(item.quantity) : Number(item.quantity);
    next.records[id] = { ...previous, ...product, have: String(count), storage: storageFor(item), notes: item.notes, ...(imageKey ? { imageKey } : {}), stockStatus: count === 0 ? 'out' : Number(previous.lowStockLevel || 0) > 0 && count <= Number(previous.lowStockLevel) ? 'low' : 'in-stock', updatedAt: new Date().toISOString() };
    next.captureItemIds.push(item.id);
  }
  return next;
}
export function inventorySnapshot(inventory, catalog = []) {
  const choices = new Map([...catalog, ...(inventory?.customItems || [])].map(item => [item.id, item]));
  return Object.entries(inventory?.records || {}).flatMap(([id, record]) => {
    const product = choices.get(id) || choices.get(record.sourceItemId) || {};
    const name = record.productName || product.productName || product.variation || product.family;
    if (!name || !Number.isFinite(Number(record.have))) return [];
    const storage = record.storage || 'Pantry';
    return [{ ...newItem(name, /freezer|frozen/i.test(storage) ? 'freezer' : /refrigerat/i.test(storage) ? 'refrigerator' : 'pantry'), inventoryId: id, brand: record.brand ?? product.brand ?? '', retailer: record.retailer ?? product.retailer ?? '', packageSize: record.packageSize ?? product.packageSize ?? '', quantity: String(record.have || '0'), unit: record.unit || product.unit || 'packages', notes: record.notes || '', imageKey: record.imageKey || product.imageKey || '', storage, categoryId: record.categoryId || product.categoryId || '', family: record.family || product.family || '', action: 'replace' }];
  });
}
export const transferPayload = (items, mode = 'changes') => ({ type: TRANSFER_TYPE, version: TRANSFER_VERSION, mode, createdAt: new Date().toISOString(), items: cleanTransferItems(items) });
export async function referencePhoto(file) {
  if (!file.type.startsWith('image/') || file.size > 12 * 1024 * 1024) throw new Error('Choose a product photo smaller than 12 MB.');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image(); image.src = url; await image.decode();
    const scale = Math.min(1, 480 / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', .65);
  } catch { throw new Error('This photo could not be opened. Try a JPEG or take another photo.'); }
  finally { URL.revokeObjectURL(url); }
}
