import { useMemo, useState } from "react";
import { MASTER_INVENTORY_CATEGORIES, MASTER_KITCHEN_INVENTORY_TAXONOMY, buildMasterKitchenInventoryCatalog } from "../data/masterKitchenInventoryCatalog.js";
import { printManualInventoryWorksheet } from "../utils/manualInventoryWorksheets.js";
import StoreInventoryImport from "./StoreInventoryImport.jsx";
import { deleteInventoryProductThumbnail, loadInventoryProductThumbnail, saveInventoryProductThumbnail } from "../utils/inventoryProductImages.js";
import { createInventoryThumbnail } from "../utils/storeProductImport.js";
import InventoryItemEditor from "./InventoryItemEditor.jsx";
import "./MasterKitchenInventoryPage.css";

function normalizeState(value) {
  return value && typeof value === "object"
    ? { ...value, records: value.records || {}, customItems: Array.isArray(value.customItems) ? value.customItems : [], receiptAliases: value.receiptAliases || {}, receiptFingerprints: Array.isArray(value.receiptFingerprints) ? value.receiptFingerprints : [], receiptPreferences: value.receiptPreferences || {} }
    : { records: {}, customItems: [], receiptAliases: {}, receiptFingerprints: [], receiptPreferences: {} };
}

function numberValue(value) {
  return value === 0 ? "0" : value || "";
}

const STORAGE_OPTIONS = ["Refrigerator", "Freezer", "Pantry", "Counter", "Other"];
const SORTED_INVENTORY_CATEGORIES = [...MASTER_INVENTORY_CATEGORIES].sort((a, b) =>
  String(a.title).localeCompare(String(b.title), undefined, { sensitivity: "base", numeric: true }),
);
const STORAGE_FORM_ORDER = ["Raw", "Fresh", "Frozen", "Canned", "Jarred", "Refrigerated", "Instant", "Dry", "Cooked", "Homemade", "Commercial", "Prepared"];
function splitStorageForm(variation = "") {
  const form = STORAGE_FORM_ORDER.find((label) => variation.toLowerCase().startsWith(`${label.toLowerCase()} `));
  if (!form) return { form: "", name: variation };
  return { form, name: variation.slice(form.length).trim() || "Standard" };
}

function defaultStorageForItem(item, categoryId) {
  const variation = item.variation.toLowerCase();
  if (/frozen/.test(variation) || categoryId === "frozen-foods") return "Freezer";
  if (/canned|jarred|instant|dry|dried|boxed|bagged|shelf-stable|pouch/.test(variation)) return "Pantry";
  if (/fresh|refrigerated|cooked|homemade/.test(variation)) return "Refrigerator";
  if (["meat-poultry", "seafood", "dairy-eggs"].includes(categoryId)) return "Refrigerator";
  return "Pantry";
}

function defaultFormForItem(item, categoryId) {
  const variation = item.variation.toLowerCase();
  if (/cooked|pulled|deli|smoked/.test(variation)) return "Cooked";
  if (["meat-poultry", "seafood"].includes(categoryId)) return "Raw";
  if (categoryId === "frozen-foods") return "Frozen";
  if (categoryId === "canned-jarred") return "Canned";
  if (["bread-bakery", "rice-pasta-grains"].includes(categoryId)) return "Dry";
  if (categoryId === "sauces-condiments") return /flour|powder|soda|mix|chips|cocoa|cornstarch|nuts|sugar|sweetener|yeast|salt|pepper|herbs|spices|seasoning|rubs/i.test(item.family) ? "Dry" : "Prepared";
  if (categoryId === "prepared-packaged") return "Prepared";
  if (categoryId === "dairy-eggs") return "Fresh";
  return item.recipeDerived ? "Ingredient" : "Fresh";
}

function inventoryDetails(item, categoryId) {
  const split = splitStorageForm(item.variation);
  const variety = item.cut || (/^(refrigerated|frozen)$/i.test(split.name) ? "Prepared" : split.name);
  return {
    storage: defaultStorageForItem(item, categoryId),
    form: item.form || split.form || defaultFormForItem(item, categoryId),
    variety,
  };
}

function groupItemsByFamily(items = []) {
  const families = new Map();
  items.forEach((item) => {
    if (!families.has(item.family)) families.set(item.family, []);
    families.get(item.family).push(item);
  });
  return [...families.entries()]
    .map(([family, familyItems]) => ({
      family,
      items: familyItems.sort((a, b) => String(a.variation).localeCompare(String(b.variation), undefined, { sensitivity: "base", numeric: true })),
    }))
    .sort((a, b) => String(a.family).localeCompare(String(b.family), undefined, { sensitivity: "base", numeric: true }));
}

function inventoryIdsForItem(item) {
  return [item.id, ...(item.legacyIds || [])];
}

function productNameForItem(item, record = {}) {
  if (record.productName || item.productName) return record.productName || item.productName;
  const variation = String(record.variation || item.variation || "").trim();
  if (!variation || /^(standard|custom item)$/i.test(variation)) return item.family;
  return variation.toLowerCase().includes(String(item.family).toLowerCase()) ? variation : `${variation} ${item.family}`;
}

function initialCaps(value = "") {
  return String(value).toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
    .replace(/\bBbq\b/g, "BBQ").replace(/\bH-e-b\b/g, "H-E-B");
}

function expirationState(record, now = new Date()) {
  if (!record.expirationDate) return "";
  const days = (new Date(`${record.expirationDate}T12:00:00`) - now) / 86400000;
  if (days < 0) return "expired";
  if (days <= 14) return "expiring";
  return "";
}

function isLowStock(record = {}) {
  return record.stockStatus === "low" || record.stockStatus === "out" || (record.lowStockLevel !== undefined && Number(record.have || 0) <= Number(record.lowStockLevel || 0));
}

export default function MasterKitchenInventoryPage({ recipes, inventory, setInventory, externalSearch = "", embedded = false }) {
  const safeInventory = normalizeState(inventory);
  const [search, setSearch] = useState("");
  const [inventoryFilter, setInventoryFilter] = useState("all");
  const [expanded, setExpanded] = useState(() => new Set());
  const [customForm, setCustomForm] = useState({ categoryId: "vegetables", family: "Artichokes", variation: "", brand: "", unit: "each", quantity: "1", storage: "Pantry", lowStockLevel: "1" });
  const [entryMode, setEntryMode] = useState("products");
  const [storeDraft, setStoreDraft] = useState(null);
  const [storeThumbnail, setStoreThumbnail] = useState(null);
  const [storePreviewUrl, setStorePreviewUrl] = useState("");
  const [editingStoreItemId, setEditingStoreItemId] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [editThumbnail, setEditThumbnail] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [zeroQuantityChoice, setZeroQuantityChoice] = useState(null);
  const catalog = useMemo(
    () => buildMasterKitchenInventoryCatalog(recipes, safeInventory.customItems),
    [recipes, safeInventory.customItems],
  );
  const recordForItem = (item) => inventoryIdsForItem(item).map((id) => safeInventory.records[id]).find(Boolean) || {};
  const savedRowsForItem = (item) => {
    const mainRowId = inventoryIdsForItem(item).find((id) => Object.prototype.hasOwnProperty.call(safeInventory.records, id));
    const rows = mainRowId ? [{ rowId: mainRowId, additional: false, record: safeInventory.records[mainRowId] || {} }] : [];
    Object.entries(safeInventory.records).forEach(([rowId, record]) => {
      if (inventoryIdsForItem(item).includes(record?.sourceItemId)) rows.push({ rowId, additional: true, record });
    });
    return rows;
  };
  const itemHasSavedRecord = (item) => inventoryIdsForItem(item).some((id) => Object.prototype.hasOwnProperty.call(safeInventory.records, id))
    || Object.values(safeInventory.records).some((record) => inventoryIdsForItem(item).includes(record?.sourceItemId));
  const recordMatchesFilter = (record) => {
    if (inventoryFilter === "all") return true;
    if (inventoryFilter === "low") return isLowStock(record);
    if (inventoryFilter === "expiring") return ["expiring", "expired"].includes(expirationState(record));
    return true;
  };
  const normalizedSearch = (externalSearch.trim() || search.trim()).toLowerCase();
  const visibleRowsForItem = (item, category) => savedRowsForItem(item).filter(({ record }) =>
    recordMatchesFilter(record)
    && (locationFilter === "all" || record.storage === locationFilter)
    && (!normalizedSearch || `${productNameForItem(item, record)} ${record.brand || item.brand || ""} ${record.variety || item.variety || ""} ${category.title} ${item.family}`.toLowerCase().includes(normalizedSearch))
  );
  const visibleCatalog = catalog
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => itemHasSavedRecord(item) && visibleRowsForItem(item, category).length),
    }))
    .filter((category) => category.items.length)
    .sort((a, b) => String(a.title).localeCompare(String(b.title), undefined, { sensitivity: "base", numeric: true }));
  const allItems = catalog.flatMap((category) => category.items).filter(itemHasSavedRecord);
  const additionalLocationRecords = Object.values(safeInventory.records).filter((record) => record?.sourceItemId);
  const withStock = allItems.filter((item) => Number(recordForItem(item).have) > 0).length
    + additionalLocationRecords.filter((record) => Number(record.have) > 0).length;
  const toBuy = allItems.filter((item) => Number(recordForItem(item).buy) > 0).length
    + additionalLocationRecords.filter((record) => Number(record.buy) > 0).length;

  function updateRecord(itemId, patch) {
    setInventory((current) => {
      const safe = normalizeState(current);
      return {
        ...safe,
        records: {
          ...safe.records,
          [itemId]: { ...(safe.records[itemId] || {}), ...patch, updatedAt: new Date().toISOString() },
        },
      };
    });
  }

  function updateRowCategory(item, rowId, categoryId) {
    setInventory((current) => {
      const safe = normalizeState(current);
      return {
        ...safe,
        customItems: safe.customItems.map((entry) => entry.id === item.id ? { ...entry, categoryId } : entry),
        records: {
          ...safe.records,
          [rowId]: { ...(safe.records[rowId] || {}), categoryId, updatedAt: new Date().toISOString() },
        },
      };
    });
  }

  function updateStockStatus(itemId, record, status, additional, sourceItemId) {
    const patch = { stockStatus: status, ...(additional ? { sourceItemId } : {}) };
    if (status === "out") patch.have = "";
    if ((status === "low" || status === "out") && Number(record.buy || 0) <= 0) patch.buy = "1";
    updateRecord(itemId, patch);
  }

  function toggleCategory(categoryId) {
    setExpanded((current) => {
      const next = new Set(current);
      next.has(categoryId) ? next.delete(categoryId) : next.add(categoryId);
      return next;
    });
  }

  function addCustomItem(event) {
    event.preventDefault();
    if (!customForm.family.trim()) return;
    const id = `custom-master-${Date.now()}`;
    setInventory((current) => {
      const safe = normalizeState(current);
      return {
        ...safe,
        customItems: [...safe.customItems, { categoryId: customForm.categoryId, family: customForm.family.trim(), variation: customForm.variation.trim() || customForm.family.trim(), brand: customForm.brand.trim(), unit: customForm.unit.trim() || "each", id }],
        records: { ...safe.records, [id]: { have: customForm.quantity, buy: "", brand: customForm.brand.trim(), storage: customForm.storage, lowStockLevel: customForm.lowStockLevel, stockStatus: Number(customForm.quantity) <= Number(customForm.lowStockLevel || 0) ? "low" : "in-stock", updatedAt: new Date().toISOString() } },
      };
    });
    setExpanded((current) => { const next = new Set(current); next.delete(customForm.categoryId); return next; });
    setCustomForm({ categoryId: customForm.categoryId, family: customForm.family, variation: "", brand: "", unit: customForm.unit, quantity: "1", storage: customForm.storage, lowStockLevel: customForm.lowStockLevel });
  }

  function removeCustomItem(item) {
    if (!window.confirm(`Remove ${item.family} — ${item.variation} from the master list?`)) return;
    setInventory((current) => {
      const safe = normalizeState(current);
      const records = { ...safe.records };
      delete records[item.id];
      Object.entries(records).forEach(([id, record]) => { if (record?.sourceItemId === item.id) delete records[id]; });
      return { ...safe, records, customItems: safe.customItems.filter((entry) => entry.id !== item.id) };
    });
    if (item.imageKey) deleteInventoryProductThumbnail(item.imageKey).catch(() => {});
  }

  function resetStoreImport() {
    if (storePreviewUrl) URL.revokeObjectURL(storePreviewUrl);
    setStoreDraft(null);
    setStoreThumbnail(null);
    setStorePreviewUrl("");
    setEditingStoreItemId("");
  }

  function acceptStoreImage(file, thumbnail) {
    if (storePreviewUrl) URL.revokeObjectURL(storePreviewUrl);
    setStorePreviewUrl(URL.createObjectURL(file));
    setStoreThumbnail(thumbnail);
  }

  async function editStoreItem(item) {
    const record = recordForItem(item);
    setEntryMode("store");
    setEditingStoreItemId(item.id);
    setStoreDraft({
      productName: item.productName || item.variation || "", brand: record.brand ?? item.brand ?? "", variety: item.variety || "",
      packageSize: item.packageSize || "", packageCount: item.packageCount || "", quantityOwned: numberValue(record.have) || "1",
      unit: item.unit || "packages", categoryId: item.categoryId, family: item.family, storage: record.storage || "Pantry",
      expirationDate: record.expirationDate || "", lowStockLevel: numberValue(record.lowStockLevel) || "1", retailer: item.retailer || record.retailer || "",
      cleanUrl: item.productUrl || record.productUrl || "", price: numberValue(record.price), priceRecordedAt: record.priceRecordedAt || "",
      retailerItemId: item.retailerItemId || record.retailerItemId || "",
    });
    if (item.imageKey) {
      const blob = await loadInventoryProductThumbnail(item.imageKey).catch(() => null);
      if (blob) setStorePreviewUrl(URL.createObjectURL(blob));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function openItemEditor(item, rowId = item.id, record = recordForItem(item)) {
    const details = inventoryDetails(item, item.categoryId);
    setEditItem({ item, rowId });
    setEditDraft({
      productName: productNameForItem(item, record), brand: record.brand ?? item.brand ?? "", variety: record.variety ?? item.variety ?? details.variety,
      form: record.form ?? item.form ?? details.form, packageSize: record.packageSize ?? item.packageSize ?? "", packageCount: record.packageCount ?? item.packageCount ?? "",
      quantity: numberValue(record.have), unit: record.unit || item.unit || "each", categoryId: item.categoryId, family: item.family,
      storage: record.storage || details.storage, expirationDate: record.expirationDate || "", lowStockLevel: numberValue(record.lowStockLevel), notes: record.notes || "",
      retailer: record.retailer || item.retailer || "", productUrl: record.productUrl || item.productUrl || "", price: numberValue(record.price), priceRecordedAt: record.priceRecordedAt || "",
    });
    const imageKey = record.imageKey || item.imageKey;
    if (imageKey) {
      const blob = await loadInventoryProductThumbnail(imageKey).catch(() => null);
      if (blob) setEditImageUrl(URL.createObjectURL(blob));
    }
  }

  function closeItemEditor() {
    if (editImageUrl) URL.revokeObjectURL(editImageUrl);
    setEditItem(null); setEditDraft(null); setEditThumbnail(null); setEditImageUrl("");
  }

  async function acceptEditImage(file) {
    if (!file) return;
    const thumbnail = await createInventoryThumbnail(file).catch(() => null);
    if (!thumbnail) return;
    if (editImageUrl) URL.revokeObjectURL(editImageUrl);
    setEditThumbnail(thumbnail);
    setEditImageUrl(URL.createObjectURL(file));
  }

  async function saveEditedItem() {
    if (!editItem || !editDraft?.productName.trim()) return;
    const { item, rowId } = editItem;
    let imageKey = recordForItem(item).imageKey || item.imageKey || "";
    if (editThumbnail) {
      imageKey = item.id;
      await saveInventoryProductThumbnail(imageKey, editThumbnail).catch(() => { imageKey = ""; });
    }
    setInventory((current) => {
      const safe = normalizeState(current);
      const customItems = safe.customItems.map((entry) => entry.id === item.id ? { ...entry, productName: editDraft.productName.trim(), variation: editDraft.productName.trim(), brand: editDraft.brand, variety: editDraft.variety, form: editDraft.form, packageSize: editDraft.packageSize, packageCount: editDraft.packageCount, unit: editDraft.unit, categoryId: editDraft.categoryId, family: editDraft.family, retailer: editDraft.retailer, productUrl: editDraft.productUrl, imageKey } : entry);
      const stockStatus = Number(editDraft.quantity) <= Number(editDraft.lowStockLevel || 0) ? "low" : "in-stock";
      return { ...safe, customItems, records: { ...safe.records, [rowId]: { ...(safe.records[rowId] || {}), productName: editDraft.productName.trim(), brand: editDraft.brand, variety: editDraft.variety, form: editDraft.form, packageSize: editDraft.packageSize, packageCount: editDraft.packageCount, have: editDraft.quantity, unit: editDraft.unit, categoryId: editDraft.categoryId, family: editDraft.family, storage: editDraft.storage, expirationDate: editDraft.expirationDate, lowStockLevel: editDraft.lowStockLevel, notes: editDraft.notes, retailer: editDraft.retailer, productUrl: editDraft.productUrl, price: editDraft.price, priceRecordedAt: editDraft.priceRecordedAt, stockStatus, imageKey, updatedAt: new Date().toISOString() } } };
    });
    closeItemEditor();
  }

  function deleteEditedItem() {
    if (!editItem || !window.confirm(`Delete ${editDraft.productName} from Kitchen Inventory?`)) return;
    const { item, rowId } = editItem;
    setInventory((current) => {
      const safe = normalizeState(current); const records = { ...safe.records }; delete records[rowId];
      return { ...safe, records, customItems: item.custom ? safe.customItems.filter((entry) => entry.id !== item.id) : safe.customItems };
    });
    if (item.imageKey) deleteInventoryProductThumbnail(item.imageKey).catch(() => {});
    closeItemEditor();
  }

  function setQuantity(item, rowId, record, nextQuantity) {
    const next = Math.max(0, nextQuantity);
    if (next === 0 && Number(record.have || 0) > 0) return setZeroQuantityChoice({ item, rowId, record });
    updateRecord(rowId, { have: String(next), stockStatus: next <= Number(record.lowStockLevel || 0) ? "low" : "in-stock", ...(record.sourceItemId ? { sourceItemId: record.sourceItemId } : {}) });
  }

  function removeZeroItem() {
    const { rowId } = zeroQuantityChoice;
    setInventory((current) => { const safe = normalizeState(current); const records = { ...safe.records }; delete records[rowId]; return { ...safe, records }; });
    setZeroQuantityChoice(null);
  }

  function keepZeroAndShop() {
    const { rowId, record } = zeroQuantityChoice;
    updateRecord(rowId, { have: "0", buy: Number(record.buy || 0) > 0 ? record.buy : "1", stockStatus: "out", ...(record.sourceItemId ? { sourceItemId: record.sourceItemId } : {}) });
    setZeroQuantityChoice(null);
  }

  async function saveStoreProduct() {
    if (!storeDraft?.productName.trim() || !storeDraft.family) return;
    const id = editingStoreItemId || `custom-store-${Date.now()}`;
    let imageKey = safeInventory.customItems.find((item) => item.id === id)?.imageKey || "";
    if (storeThumbnail) {
      try { await saveInventoryProductThumbnail(id, storeThumbnail); imageKey = id; } catch { imageKey = ""; }
    }
    const item = {
      id, categoryId: storeDraft.categoryId, family: storeDraft.family, variation: storeDraft.productName.trim(),
      productName: storeDraft.productName.trim(), brand: storeDraft.brand.trim(), variety: storeDraft.variety.trim(),
      packageSize: storeDraft.packageSize.trim(), packageCount: storeDraft.packageCount, unit: storeDraft.unit.trim() || "packages",
      retailer: storeDraft.retailer.trim(), productUrl: storeDraft.cleanUrl.trim(), retailerItemId: storeDraft.retailerItemId.trim(),
      imageKey, importedFromStore: true,
    };
    const quantity = storeDraft.quantityOwned;
    const lowLevel = storeDraft.lowStockLevel;
    const stockStatus = Number(quantity) <= 0 ? "out" : Number(quantity) <= Number(lowLevel || 0) ? "low" : "in-stock";
    setInventory((current) => {
      const safe = normalizeState(current);
      const customItems = editingStoreItemId
        ? safe.customItems.map((entry) => entry.id === id ? item : entry)
        : [...safe.customItems, item];
      return { ...safe, customItems, records: { ...safe.records, [id]: {
        ...(safe.records[id] || {}), have: quantity, buy: safe.records[id]?.buy || "", brand: storeDraft.brand.trim(),
        storage: storeDraft.storage, stockStatus, lowStockLevel: lowLevel, expirationDate: storeDraft.expirationDate,
        retailer: storeDraft.retailer.trim(), productUrl: storeDraft.cleanUrl.trim(), retailerItemId: storeDraft.retailerItemId.trim(),
        price: storeDraft.price, priceRecordedAt: storeDraft.priceRecordedAt, imageKey, updatedAt: new Date().toISOString(),
      } } };
    });
    setExpanded((current) => { const next = new Set(current); next.delete(storeDraft.categoryId); return next; });
    resetStoreImport();
  }

  function addStorageLocation(item, categoryId) {
    const details = inventoryDetails(item, categoryId);
    const existingLocations = new Set([
      safeInventory.records[item.id]?.storage || details.storage,
      ...Object.values(safeInventory.records)
        .filter((record) => inventoryIdsForItem(item).includes(record?.sourceItemId))
        .map((record) => record.storage),
    ]);
    const storage = STORAGE_OPTIONS.find((option) => !existingLocations.has(option)) || "Other";
    const rowId = `${item.id}--storage-${Date.now()}`;
    setInventory((current) => {
      const safe = normalizeState(current);
      return {
        ...safe,
        records: {
          ...safe.records,
          [rowId]: { sourceItemId: item.id, storage, have: "", buy: "", updatedAt: new Date().toISOString() },
        },
      };
    });
  }

  function removeStorageLocation(rowId) {
    if (!window.confirm("Remove this additional storage-location row?")) return;
    setInventory((current) => {
      const safe = normalizeState(current);
      const records = { ...safe.records };
      delete records[rowId];
      return { ...safe, records };
    });
  }

  function clearBuyQuantities() {
    if (!window.confirm("Clear every Buy quantity on the Kitchen Inventory? Have quantities will not change.")) return;
    setInventory((current) => {
      const safe = normalizeState(current);
      return {
        ...safe,
        records: Object.fromEntries(Object.entries(safe.records).map(([id, record]) => [id, { ...record, buy: "" }])),
      };
    });
  }

  function recordPurchases() {
    if (!window.confirm("Add every Buy quantity to Have and clear the Buy boxes?")) return;
    setInventory((current) => {
      const safe = normalizeState(current);
      return {
        ...safe,
        records: Object.fromEntries(Object.entries(safe.records).map(([id, record]) => {
          const purchased = Number(record.buy) || 0;
          const currentHave = Number(record.have) || 0;
          return [id, { ...record, have: purchased ? String(currentHave + purchased) : record.have || "", buy: "", updatedAt: new Date().toISOString() }];
        })),
      };
    });
  }

  function printCountWorksheet() {
    printManualInventoryWorksheet({
      title: "Kitchen Inventory Count Worksheet",
      instructions: "Review the products currently saved in Your Kitchen Inventory and record any quantity changes.",
      groups: catalog.filter((category) => category.items.some(itemHasSavedRecord)).map((category) => ({
        title: category.title,
        items: category.items.filter(itemHasSavedRecord).map((item) => ({ name: item.family, detail: `${item.variation} · ${item.unit}` })),
      })),
      columns: [
        { label: "Have", kind: "line" },
        { label: "Buy", kind: "line" },
        { label: "Checked", kind: "checkbox" },
        { label: "Notes", kind: "line" },
      ],
    });
  }

  return (
    <main className="pageShell masterKitchenInventoryPage">
      {!embedded && <section className="inventoryPageHeading">
        <h1>Your Kitchen Inventory</h1>
        <p>Count foods used throughout the recipe library, then keep each fresh, frozen, canned, packaged, and prepared variation current.</p>
      </section>}

      <section className="masterInventorySummary" aria-label="Kitchen inventory summary">
        <div><span>Current Products</span><strong>{allItems.length}</strong></div>
        <div><span>Items On Hand</span><strong>{withStock}</strong></div>
        <div><span>Items To Buy</span><strong>{toBuy}</strong></div>
      </section>

      <StoreInventoryImport mode={entryMode} setMode={setEntryMode} draft={storeDraft} setDraft={setStoreDraft} previewUrl={storePreviewUrl} onImage={acceptStoreImage} onConfirm={saveStoreProduct} onCancel={resetStoreImport} isEditing={Boolean(editingStoreItemId)} />

      {(entryMode === "products" || entryMode === "manual") && (
        <form className="masterInventoryCustomForm" onSubmit={addCustomItem}>
          <label><span>Category</span><select value={customForm.categoryId} onChange={(event) => {
            const categoryId = event.target.value;
            const family = MASTER_KITCHEN_INVENTORY_TAXONOMY.find((category) => category.id === categoryId)?.products[0] || "";
            setCustomForm((current) => ({ ...current, categoryId, family }));
          }}>{MASTER_INVENTORY_CATEGORIES.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}</select></label>
          <label><span>Item</span><select required value={customForm.family} onChange={(event) => setCustomForm((current) => ({ ...current, family: event.target.value }))}>{(MASTER_KITCHEN_INVENTORY_TAXONOMY.find((category) => category.id === customForm.categoryId)?.products || []).map((product) => <option key={product} value={product}>{product}</option>)}</select></label>
          <label><span>Product name or variety</span><input value={customForm.variation} onChange={(event) => setCustomForm((current) => ({ ...current, variation: event.target.value }))} placeholder={`Example: ${customForm.family}`} /></label>
          <label><span>Brand</span><input value={customForm.brand} onChange={(event) => setCustomForm((current) => ({ ...current, brand: event.target.value }))} placeholder="Example: Tyson" /></label>
          <label><span>Quantity</span><input type="number" min="0" step="any" value={customForm.quantity} onChange={(event) => setCustomForm((current) => ({ ...current, quantity: event.target.value }))} /></label>
          <label><span>Tracking unit</span><input value={customForm.unit} onChange={(event) => setCustomForm((current) => ({ ...current, unit: event.target.value }))} placeholder="bags" /></label>
          <label><span>Storage</span><select value={customForm.storage} onChange={(event) => setCustomForm((current) => ({ ...current, storage: event.target.value }))}>{STORAGE_OPTIONS.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label><span>Low-stock level</span><input type="number" min="0" step="any" value={customForm.lowStockLevel} onChange={(event) => setCustomForm((current) => ({ ...current, lowStockLevel: event.target.value }))} /></label>
          <button type="submit" className="primary">Add to Inventory</button>
        </form>
      )}

      <p className="masterInventoryBackupNote"><strong>Saved automatically on this device.</strong> Kitchen Inventory is included in the full Recipe Box Backup &amp; Restore file for transfer between your iPad and laptop.</p>

      <section className="currentInventoryHeading"><h2>MY CURRENT INVENTORY</h2><p>See what you have, how much remains, where it is stored, and which items need attention.</p></section>
      <section className="currentInventoryFilterRow" aria-label="Filter current inventory">
        <label className="currentInventorySearch"><span>Search My Inventory</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products, brands or categories" /></label>
        <div className="currentInventoryFilters">{[["all", "All Items"], ["low", "Low Stock"], ["expiring", "Expiring Soon"]].map(([value, label]) => <button type="button" key={value} className={inventoryFilter === value ? "is-active" : ""} aria-pressed={inventoryFilter === value} onClick={() => setInventoryFilter(value)}>{label}</button>)}</div>
        <label className="currentInventoryLocation"><span>Location</span><select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}><option value="all">All Locations</option><option>Refrigerator</option><option>Freezer</option><option>Pantry</option></select></label>
        <button type="button" className="secondary currentInventoryPrint" onClick={printCountWorksheet}>Print</button>
      </section>

      <div className="currentInventoryFlatList" aria-label="Current inventory items">
        <div className="currentInventoryColumnHeader" aria-hidden="true"><span>Product Name</span><span>Category</span><span>Qty</span><span>+</span><span>−</span><span>Location</span><span>Low</span><span>Buy</span><span>Edit</span></div>
        {visibleCatalog.flatMap((category) => category.items.flatMap((item) =>
          visibleRowsForItem(item, category).map(({ rowId, additional, record }) => ({ category, item, rowId, additional, record }))
        )).sort((a, b) => {
          const aCategory = SORTED_INVENTORY_CATEGORIES.find((entry) => entry.id === (a.record.categoryId || a.item.categoryId || a.category.id))?.title || a.category.title;
          const bCategory = SORTED_INVENTORY_CATEGORIES.find((entry) => entry.id === (b.record.categoryId || b.item.categoryId || b.category.id))?.title || b.category.title;
          return `${aCategory}|${productNameForItem(a.item, a.record)}`.localeCompare(`${bCategory}|${productNameForItem(b.item, b.record)}`, undefined, { sensitivity: "base", numeric: true });
        }).map(({ category, item, rowId, additional, record }) => {
          const productName = productNameForItem(item, record);
          const description = [record.brand || item.brand, record.variety || item.variety, record.packageSize || item.packageSize, (record.packageCount || item.packageCount) ? `${record.packageCount || item.packageCount}-count` : ""].filter(Boolean).join(" · ");
          const quantity = Number(record.have || 0);
          const unit = record.unit || item.unit || "items";
          const expiry = expirationState(record);
          const low = isLowStock(record);
          const onShoppingList = Number(record.buy || 0) > 0 || ["low", "out"].includes(record.stockStatus);
          return (
            <article className="currentInventoryRow" key={rowId}>
              <button type="button" className="currentInventoryIdentity" onClick={() => openItemEditor(item, rowId, record)}><strong>{initialCaps(productName)}</strong>{description && <small>{description}</small>}</button>
              <select className="currentInventoryCategorySelect" aria-label={`Category for ${productName}`} value={record.categoryId || item.categoryId || category.id} onChange={(event) => updateRowCategory(item, rowId, event.target.value)}>
                {SORTED_INVENTORY_CATEGORIES.map((entry) => <option key={entry.id} value={entry.id}>{entry.title}</option>)}
              </select>
              <strong className="currentInventoryQuantityValue" aria-label={`${quantity} ${unit}`}>{quantity}</strong>
              <button type="button" className="currentInventoryQuantityButton is-plus" onClick={() => setQuantity(item, rowId, record, quantity + 1)} aria-label={`Increase ${productName} quantity`}>+</button>
              <button type="button" className="currentInventoryQuantityButton is-minus" onClick={() => setQuantity(item, rowId, record, quantity - 1)} aria-label={`Decrease ${productName} quantity`}>−</button>
              <select className="currentInventoryLocationSelect" aria-label={`Storage location for ${productName}`} value={record.storage || inventoryDetails(item, category.id).storage} onChange={(event) => updateRecord(rowId, { storage: event.target.value, ...(additional ? { sourceItemId: item.id } : {}) })}>
                {STORAGE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
              <div className="currentInventoryBadges">{low && <span className="is-low">LOW</span>}{expiry === "expiring" && <span className="is-expiring">SOON</span>}{expiry === "expired" && <span className="is-expired">EXPIRED</span>}</div>
              <button type="button" className={`currentInventoryBuy${onShoppingList ? " is-on-list" : ""}`} onClick={() => updateRecord(rowId, { buy: onShoppingList ? "" : "1", ...(additional ? { sourceItemId: item.id } : {}) })}>{onShoppingList ? "On List" : "Buy"}</button>
              <button type="button" className="currentInventoryEdit" onClick={() => openItemEditor(item, rowId, record)}>Edit</button>
            </article>
          );
        })}
      </div>

      {visibleCatalog.length === 0 && <div className="masterInventoryEmpty"><strong>{allItems.length ? "No inventory items match this view." : "Your Kitchen Inventory is empty."}</strong>{!allItems.length && <><p>Add products manually, choose them from the product list, or import them from a store.</p><button type="button" className="primary" onClick={() => { setEntryMode("manual"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Add an Item</button></>}</div>}
      <InventoryItemEditor draft={editDraft} setDraft={setEditDraft} imageUrl={editImageUrl} onImage={acceptEditImage} onSave={saveEditedItem} onDelete={deleteEditedItem} onClose={closeItemEditor} />
      {zeroQuantityChoice && <div className="inventoryZeroBackdrop" role="presentation"><section className="inventoryZeroDialog" role="dialog" aria-modal="true" aria-labelledby="zeroQuantityTitle"><h2 id="zeroQuantityTitle">Quantity Reached Zero</h2><p>What would you like to do with {productNameForItem(zeroQuantityChoice.item, zeroQuantityChoice.record)}?</p><button type="button" className="danger" onClick={removeZeroItem}>Remove from Current Inventory</button><button type="button" className="primary" onClick={keepZeroAndShop}>Keep at Zero and Add to Shopping List</button><button type="button" className="secondary" onClick={() => setZeroQuantityChoice(null)}>Cancel</button></section></div>}
      <p className="masterInventoryAutomationNote"><strong>Inventory-counting rule:</strong> the system should deduct an item automatically only when a recipe identifies the exact product form and compatible unit. Alternative ingredients remain unchanged until the form actually used is selected.</p>
    </main>
  );
}
