import { useMemo, useState } from "react";
import "./DigitalStockCheckPanel.css";

export const MANUAL_STOCK_CHECK_STORAGE_KEY = "rrb_manualStockChecks_v1";

function loadAllWorksheets() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(MANUAL_STOCK_CHECK_STORAGE_KEY));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function itemKey(item) {
  return String(item.id || item.name || "").trim();
}

export default function DigitalStockCheckPanel({
  worksheetId,
  title,
  instructions,
  groups = [],
  onCheckChange,
  onQuantityChange,
  onClose,
}) {
  const [allWorksheets, setAllWorksheets] = useState(loadAllWorksheets);
  const worksheet = allWorksheets[worksheetId] || {};
  const totalItems = useMemo(
    () => groups.reduce((total, group) => total + (group.items?.length || 0), 0),
    [groups],
  );
  const checkedItems = Object.values(worksheet).filter((record) => record?.checked).length;

  function updateRecord(item, patch) {
    const key = itemKey(item);
    if (!key) return;
    setAllWorksheets((current) => {
      const next = {
        ...current,
        [worksheetId]: {
          ...(current[worksheetId] || {}),
          [key]: {
            ...(current[worksheetId]?.[key] || {}),
            ...patch,
            updatedAt: new Date().toISOString(),
          },
        },
      };
      window.localStorage.setItem(MANUAL_STOCK_CHECK_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function resetWorksheet() {
    if (!window.confirm("Clear the saved checks, quantities, and notes for this digital worksheet?")) return;
    setAllWorksheets((current) => {
      const next = { ...current, [worksheetId]: {} };
      window.localStorage.setItem(MANUAL_STOCK_CHECK_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <section className="digitalStockCheckPanel" aria-label={title}>
      <header className="digitalStockCheckHeader">
        <div>
          <span>IPAD-FRIENDLY LIVE WORKSHEET</span>
          <h2>{title}</h2>
          <p>{instructions}</p>
        </div>
        <button type="button" className="digitalStockCheckClose" onClick={onClose} aria-label="Close digital stock check">×</button>
      </header>

      <div className="digitalStockCheckStatus">
        <strong>{checkedItems} saved checks</strong>
        <span>{totalItems} available items</span>
        <em>Saved on this device and included in Backup &amp; Restore</em>
        <button type="button" onClick={resetWorksheet}>Reset This Worksheet</button>
      </div>

      <div className="digitalStockCheckGroups">
        {groups.length === 0 && (
          <p className="digitalStockCheckEmpty">No items are on this list yet. Add meals or inventory items, then reopen the worksheet.</p>
        )}
        {groups.map((group) => (
          <section className="digitalStockCheckGroup" key={group.title}>
            <h3>{group.title}</h3>
            {group.items.map((item) => {
              const key = itemKey(item);
              const record = worksheet[key] || {};
              const checked = record.checked ?? Boolean(item.checked);
              const quantity = record.quantity ?? item.quantity ?? "";
              return (
                <article className={checked ? "digitalStockCheckRow checked" : "digitalStockCheckRow"} key={key}>
                  <label className="digitalStockCheckItem">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        updateRecord(item, { checked: event.target.checked });
                        onCheckChange?.(item, event.target.checked);
                      }}
                    />
                    <span><strong>{item.name}</strong>{item.detail && <small>{item.detail}</small>}</span>
                  </label>
                  <label className="digitalStockCheckQuantity">
                    <span>Qty</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={quantity}
                      onChange={(event) => {
                        updateRecord(item, { quantity: event.target.value });
                        onQuantityChange?.(item, event.target.value);
                      }}
                      placeholder="0"
                      aria-label={`${item.name} quantity`}
                    />
                  </label>
                  <label className="digitalStockCheckNotes">
                    <span>Notes</span>
                    <input
                      type="text"
                      value={record.notes || ""}
                      onChange={(event) => updateRecord(item, { notes: event.target.value })}
                      placeholder="Optional"
                      aria-label={`${item.name} notes`}
                    />
                  </label>
                </article>
              );
            })}
          </section>
        ))}
      </div>
    </section>
  );
}
