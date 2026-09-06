import { useMemo, useState } from "react";

function shoppingItemKey(item) {
  return `${item.name}-${item.unit}-${item.aisle}`;
}

export default function ShoppingCompanionPanel({ items, checked, storeLabel, formatQuantity, onToggle, onSearch, onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => String(a.name).localeCompare(String(b.name))),
    [items]
  );
  const remainingCount = sortedItems.filter((item) => !checked[shoppingItemKey(item)]).length;

  return (
    <aside className={collapsed ? "shoppingCompanion isCollapsed" : "shoppingCompanion"} aria-label="Floating shopping companion">
      <header>
        <div><strong>Shopping Companion</strong><span>{remainingCount} remaining · {storeLabel}</span></div>
        <button type="button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand shopping companion" : "Collapse shopping companion"}>{collapsed ? "▴" : "▾"}</button>
        <button type="button" onClick={onClose} aria-label="Close shopping companion">×</button>
      </header>
      {!collapsed && (
        <div className="shoppingCompanionBody">
          {sortedItems.length ? sortedItems.map((item) => {
            const key = shoppingItemKey(item);
            const purchased = !!checked[key];
            return (
              <div className={purchased ? "shoppingCompanionItem isPurchased" : "shoppingCompanionItem"} key={key}>
                <label><input type="checkbox" checked={purchased} onChange={() => onToggle(key, false)} aria-label={`Mark ${item.name} as purchased`} /><span><strong>{item.name}</strong><small>{formatQuantity(item.qty)} {item.unit || "item(s)"}</small></span></label>
                <button type="button" onClick={() => onSearch(item.name)} aria-label={`Search ${storeLabel} for ${item.name}`}>Search</button>
              </div>
            );
          }) : <p>Everything on this list is covered.</p>}
        </div>
      )}
    </aside>
  );
}
