import { useMemo, useState } from "react";

function shoppingItemKey(item) {
  return `${item.name}-${item.unit}-${item.aisle}`;
}

export default function ShoppingCompanionPanel({ items, checked, orderQuantities = {}, comments = {}, storeLabel, formatQuantity, onToggle, onSearch, onClose }) {
  const [selectedKey, setSelectedKey] = useState("");
  const [skippedKeys, setSkippedKeys] = useState(() => new Set());
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => String(a.name).localeCompare(String(b.name))),
    [items]
  );
  const purchasedCount = sortedItems.filter((item) => !!checked[shoppingItemKey(item)]).length;
  const pendingItems = sortedItems.filter((item) => !checked[shoppingItemKey(item)] && !skippedKeys.has(shoppingItemKey(item)));
  const selectedItem = sortedItems.find((item) => shoppingItemKey(item) === selectedKey);
  const currentItem = selectedItem || pendingItems[0] || sortedItems.find((item) => skippedKeys.has(shoppingItemKey(item))) || null;
  const currentKey = currentItem ? shoppingItemKey(currentItem) : "";

  function findNextItem(excludedKeys = skippedKeys) {
    if (!currentItem) return pendingItems[0] || null;
    const currentIndex = sortedItems.findIndex((item) => shoppingItemKey(item) === currentKey);
    return [...sortedItems.slice(currentIndex + 1), ...sortedItems.slice(0, currentIndex)]
      .find((item) => shoppingItemKey(item) !== currentKey && !checked[shoppingItemKey(item)] && !excludedKeys.has(shoppingItemKey(item))) || null;
  }

  function advanceFromCurrent(markPurchased) {
    if (!currentItem) return;
    const nextSkipped = new Set(skippedKeys);
    if (markPurchased) {
      if (!checked[currentKey]) onToggle(currentKey, false);
      nextSkipped.delete(currentKey);
    } else {
      nextSkipped.add(currentKey);
    }
    setSkippedKeys(nextSkipped);
    const nextItem = findNextItem(nextSkipped);
    setSelectedKey(nextItem ? shoppingItemKey(nextItem) : "");
    if (nextItem) onSearch(nextItem.name);
  }

  function showPreviousItem() {
    if (!currentItem || sortedItems.length < 2) return;
    const currentIndex = sortedItems.findIndex((item) => shoppingItemKey(item) === currentKey);
    const previousItem = sortedItems[(currentIndex - 1 + sortedItems.length) % sortedItems.length];
    setSelectedKey(shoppingItemKey(previousItem));
  }

  return (
    <aside className="shoppingCompanion shoppingGuidedMode" aria-label="Online shopping companion">
      <header>
        <div><strong>Online Shopping</strong><span>{purchasedCount} of {sortedItems.length} added · {storeLabel}</span></div>
        <button type="button" onClick={onClose} aria-label="Close shopping companion">×</button>
      </header>
      <div className="shoppingCompanionProgress" aria-label={`${purchasedCount} of ${sortedItems.length} items added`}><span style={{ width: `${sortedItems.length ? (purchasedCount / sortedItems.length) * 100 : 100}%` }} /></div>
      <div className="shoppingCompanionBody">
        {currentItem ? (
          <section className="shoppingCurrentItem">
            <small>Current Item</small>
            <h1>{currentItem.name}</h1>
            <div className="shoppingCurrentQuantities"><span><small>Qty Needed</small><strong>{formatQuantity(currentItem.qty)} {currentItem.unit || "item(s)"}</strong></span><span><small>Qty to Order</small><strong>{orderQuantities[currentKey] || "Not entered"}</strong></span></div>
            {comments[currentKey] && <p><strong>Note:</strong> {comments[currentKey]}</p>}
            <button type="button" className="shoppingSearchCurrent" onClick={() => onSearch(currentItem.name)}>Search {storeLabel}</button>
            <button type="button" className="shoppingAddedNext" onClick={() => advanceFromCurrent(true)}>Added to Cart &amp; Next</button>
            <div className="shoppingCurrentSecondary"><button type="button" onClick={showPreviousItem}>Previous</button><button type="button" onClick={() => advanceFromCurrent(false)}>Skip for Now</button></div>
          </section>
        ) : (
          <section className="shoppingCompleteState"><strong>Shopping Complete</strong><p>Every item has been added to your cart.</p></section>
        )}
        <section className="shoppingCompanionQueue">
          <header><strong>My Shopping List</strong><span>{pendingItems.length} remaining · {skippedKeys.size} skipped</span></header>
          {sortedItems.length ? sortedItems.map((item) => {
            const key = shoppingItemKey(item);
            const purchased = !!checked[key];
            const skipped = skippedKeys.has(key);
            return (
              <div className={`shoppingCompanionItem${purchased ? " isPurchased" : ""}${skipped ? " isSkipped" : ""}${key === currentKey ? " isCurrent" : ""}`} key={key}>
                <label><input type="checkbox" checked={purchased} onChange={() => onToggle(key, false)} aria-label={`Mark ${item.name} as purchased`} /><span><strong>{item.name}</strong><small>{formatQuantity(item.qty)} {item.unit || "item(s)"}</small></span></label>
                <button type="button" onClick={() => setSelectedKey(key)} aria-label={`Select ${item.name}`}>{skipped ? "Review" : "Select"}</button>
              </div>
            );
          }) : <p>Everything on this list is covered.</p>}
        </section>
      </div>
    </aside>
  );
}
