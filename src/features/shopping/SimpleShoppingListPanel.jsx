import { useMemo } from "react";

export default function SimpleShoppingListPanel({ entries, stores, preferredStore, onStoreChange, onStartShopping, onPrint, onToggle, notes, onNotesChange, onShop, formatQuantity }) {
  const needed = entries.filter((entry) => !entry.isCovered);
  const purchased = entries.filter((entry) => !entry.automaticallyCovered && entry.isCovered);
  const groups = useMemo(() => Object.entries(needed.reduce((result, entry) => {
    (result[entry.kind] ||= []).push(entry);
    return result;
  }, {})).sort(([a], [b]) => a.localeCompare(b)), [needed]);

  const renderItem = (entry, isPurchased = false) => (
    <div className={`shoppingSimpleItem${isPurchased ? " isPurchased" : ""}`} key={entry.key}>
      <input type="checkbox" checked={entry.isCovered} onChange={() => onToggle(entry.key, entry.automaticallyCovered)} aria-label={`${entry.isCovered ? "Return" : "Mark"} ${entry.displayName} ${entry.isCovered ? "to shopping list" : "as purchased"}`} />
      <span className="shoppingSimpleItemCopy"><strong>{entry.displayName}</strong><small>{formatQuantity(entry.item.qty)} {entry.item.unit || "item(s)"}</small></span>
      {!isPurchased && <><input className="shoppingSimpleNote" type="text" value={notes[entry.key] || ""} onChange={(event) => onNotesChange(entry.key, event.target.value)} onClick={(event) => event.preventDefault()} placeholder="Optional note" aria-label={`Notes for ${entry.displayName}`} /><button type="button" className="shoppingSimpleShopButton" onClick={(event) => { event.preventDefault(); onShop(entry.displayName); }}>Shop Online</button></>}
    </div>
  );

  return <section className="shoppingSimplePanel" aria-labelledby="simple-shopping-title">
    <header><div><h2 id="simple-shopping-title">My Shopping List</h2><p>Everything below still needs to be purchased for your planned meals.</p></div><strong>{needed.length} {needed.length === 1 ? "item" : "items"}</strong></header>
    <div className="shoppingSimpleActions"><label><span>Preferred Store</span><select value={preferredStore} onChange={(event) => onStoreChange(event.target.value)}>{Object.entries(stores).map(([id, store]) => <option value={id} key={id}>{store.label}</option>)}</select></label><button type="button" className="primary" onClick={onStartShopping}>Start Online Shopping</button><button type="button" className="secondary" onClick={onPrint}>Print List</button></div>
    {groups.length ? <div className="shoppingSimpleGroups">{groups.map(([kind, items]) => <section className="shoppingSimpleGroup" key={kind}><h3>{kind}</h3><div>{items.map((entry) => renderItem(entry))}</div></section>)}</div> : <div className="shoppingSimpleEmpty"><h3>Your shopping list is complete</h3><p>There are no unchecked items to purchase.</p></div>}
    {purchased.length > 0 && <details className="shoppingPurchasedDetails"><summary>Purchased Items <span>{purchased.length}</span></summary><div>{purchased.map((entry) => renderItem(entry, true))}</div></details>}
  </section>;
}
