import { useEffect, useState } from "react";

const STORAGE_LOCATIONS = ["Pantry", "Refrigerator", "Freezer", "Other Storage"];

export function buildPurchaseReconciliationItems({ items, orderQuantities, coverageIndex, catalogItems, inventoryRecords, nameMatches }) {
  return items.map((item) => {
    const key = `${item.name}-${item.unit}-${item.aisle}`;
    const existingMatch = coverageIndex.find(({ names }) => names.some((name) => nameMatches(item.name, name)));
    const catalogMatch = existingMatch?.catalogItem || catalogItems.find((catalogItem) =>
      [catalogItem.productName, catalogItem.family, `${catalogItem.family} ${catalogItem.variation || ""}`, ...(catalogItem.aliases || [])]
        .filter(Boolean).some((name) => nameMatches(item.name, name)));
    const matchingIds = new Set([catalogMatch?.id, ...(catalogMatch?.legacyIds || [])].filter(Boolean));
    const matchedRecordId = existingMatch?.recordId || Object.entries(inventoryRecords || {}).find(([recordId, record]) => matchingIds.has(recordId) || matchingIds.has(record?.sourceItemId))?.[0] || "";
    return { ...item, key, orderQuantity: orderQuantities[key], suggestedStorage: /frozen/i.test(item.aisle || "") ? "Freezer" : /dairy|refrigerator|produce|meat|seafood/i.test(item.aisle || "") ? "Refrigerator" : "Pantry", matchedRecordId, matchedCatalogItem: catalogMatch || null, matchedName: catalogMatch ? [catalogMatch.family, catalogMatch.variation].filter(Boolean).join(" — ") : "" };
  });
}

export function applyPurchasedItemsToInventory(current, rows) {
  const safe = current && typeof current === "object" ? current : { records: {}, customItems: [] };
  const nextRecords = { ...(safe.records || {}) };
  const nextCustomItems = [...(safe.customItems || [])];
  const now = new Date().toISOString();
  rows.forEach((row, index) => {
    const quantity = Number(row.purchasedQuantity);
    if (!(quantity > 0)) return;
    let recordId = row.matchedRecordId;
    let catalogItem = row.matchedCatalogItem;
    if (!recordId) {
      recordId = `custom-master-purchase-${Date.now()}-${index}`;
      const categoryId = /frozen/i.test(row.aisle || "") ? "frozen-foods" : /meat|poultry/i.test(row.aisle || "") ? "meat-poultry" : /seafood/i.test(row.aisle || "") ? "seafood" : /produce|vegetable/i.test(row.aisle || "") ? "vegetables" : /fruit/i.test(row.aisle || "") ? "fruit" : "prepared-packaged";
      const fallbackFamilies = { "frozen-foods": "Frozen Dinners", "meat-poultry": "Specialty & Game Meats", seafood: "Other Shellfish", vegetables: "Other Vegetables", fruit: "Other Fruit", "prepared-packaged": "Other Packaged Foods" };
      catalogItem = { id: recordId, categoryId, family: fallbackFamilies[categoryId], variation: row.name, unit: row.purchasedUnit || row.unit || "each" };
      nextCustomItems.push(catalogItem);
    }
    const previous = nextRecords[recordId] || {};
    nextRecords[recordId] = { ...previous, sourceItemId: catalogItem?.id || previous.sourceItemId || recordId, productName: previous.productName || row.name, categoryId: catalogItem?.categoryId || previous.categoryId || "prepared-packaged", family: catalogItem?.family || previous.family || "Other Packaged Foods", have: String(row.quantityAction === "replace" ? quantity : Number(previous.have || 0) + quantity), unit: row.purchasedUnit || previous.unit || row.unit || "each", storage: row.storage, stockStatus: "in-stock", updatedAt: now };
  });
  return { ...safe, records: nextRecords, customItems: nextCustomItems };
}

export default function PurchaseReconciliationPanel({ items, onClose, onConfirm }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(items.map((item) => ({
      ...item,
      purchasedQuantity: String(item.orderQuantity || item.qty || 1),
      purchasedUnit: item.unit || "each",
      storage: item.suggestedStorage || "Pantry",
      quantityAction: "add",
    })));
  }, [items]);

  function updateRow(key, patch) {
    setRows((current) => current.map((row) => row.key === key ? { ...row, ...patch } : row));
  }

  return (
    <div className="purchaseReconciliationBackdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="purchaseReconciliationPanel" role="dialog" aria-modal="true" aria-labelledby="purchase-reconciliation-title">
        <header>
          <div>
            <h2 id="purchase-reconciliation-title">Put Purchases Away</h2>
            <p>Confirm what you bought before updating your Kitchen Inventory.</p>
          </div>
          <button type="button" className="purchaseReconciliationClose" onClick={onClose} aria-label="Close Put Purchases Away">×</button>
        </header>

        <div className="purchaseReconciliationSummary"><strong>{rows.length}</strong> purchased {rows.length === 1 ? "item" : "items"} ready to put away</div>
        <div className="purchaseReconciliationRows">
          {rows.map((row) => (
            <fieldset key={row.key} className="purchaseReconciliationRow">
              <legend>{row.name}</legend>
              <label>Quantity bought<input type="number" min="0" step="any" value={row.purchasedQuantity} onChange={(event) => updateRow(row.key, { purchasedQuantity: event.target.value })} /></label>
              <label>Unit<input type="text" value={row.purchasedUnit} onChange={(event) => updateRow(row.key, { purchasedUnit: event.target.value })} /></label>
              <label>Store in<select value={row.storage} onChange={(event) => updateRow(row.key, { storage: event.target.value })}>{STORAGE_LOCATIONS.map((location) => <option key={location}>{location}</option>)}</select></label>
              <label>Inventory quantity<select value={row.quantityAction} onChange={(event) => updateRow(row.key, { quantityAction: event.target.value })}><option value="add">Add to existing</option><option value="replace">Replace existing</option></select></label>
              <p>{row.matchedName ? <>Matches: <strong>{row.matchedName}</strong></> : <>A new Kitchen Inventory item will be created.</>}</p>
            </fieldset>
          ))}
        </div>
        <footer>
          <button type="button" className="secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="primary" disabled={!rows.length || rows.some((row) => !(Number(row.purchasedQuantity) > 0))} onClick={() => onConfirm(rows)}>Update My Inventory</button>
        </footer>
      </section>
    </div>
  );
}
