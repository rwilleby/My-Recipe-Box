export const ONLINE_GROCERY_STORES = Object.freeze({
  walmart: { label: "Walmart", storeBrand: "Great Value", homeUrl: "https://www.walmart.com/", searchUrl: (query) => `https://www.walmart.com/search?q=${encodeURIComponent(query)}` },
  kroger: { label: "Kroger", storeBrand: "Kroger", homeUrl: "https://www.kroger.com/", searchUrl: (query) => `https://www.kroger.com/search?query=${encodeURIComponent(query)}` },
  heb: { label: "H-E-B", storeBrand: "H-E-B", homeUrl: "https://www.heb.com/", searchUrl: (query) => `https://www.heb.com/search?q=${encodeURIComponent(query)}` },
  randalls: { label: "Randall's", storeBrand: "Signature Select", homeUrl: "https://www.randalls.com/", searchUrl: (query) => `https://www.randalls.com/shop/search-results.html?q=${encodeURIComponent(query)}` },
});

export const PREFERRED_GROCERY_STORE_KEY = "rrb_preferredGroceryStore";
export const ONLINE_SHOPPING_WINDOW_NAME = "rrbOnlineShopping";
let onlineGroceryWindow = null;

function groceryWindowBounds(browserWindow = window) {
  const screen = browserWindow.screen || {};
  const availableWidth = Math.max(720, Number(screen.availWidth) || 1440);
  const availableHeight = Math.max(640, Number(screen.availHeight) || 900);
  const availableLeft = Number(screen.availLeft) || 0;
  const availableTop = Number(screen.availTop) || 0;
  const popupWidth = availableWidth >= 1100 ? Math.floor(availableWidth * 0.44) : Math.min(760, availableWidth);
  return {
    width: Math.max(520, popupWidth),
    height: Math.max(640, availableHeight),
    left: availableLeft + Math.max(0, availableWidth - Math.max(520, popupWidth)),
    top: availableTop,
  };
}

export function focusOnlineGroceryWindow() {
  if (!onlineGroceryWindow || onlineGroceryWindow.closed) return false;
  onlineGroceryWindow.focus();
  return true;
}

export function restoreOnlineGroceryWindow(browserWindow = window) {
  if (!onlineGroceryWindow || onlineGroceryWindow.closed) return false;
  const bounds = groceryWindowBounds(browserWindow);
  onlineGroceryWindow.moveTo(bounds.left, bounds.top);
  onlineGroceryWindow.resizeTo(bounds.width, bounds.height);
  onlineGroceryWindow.focus();
  return true;
}

export function openOnlineGroceryWindow(storeId, itemName = "", browserWindow = window) {
  const store = ONLINE_GROCERY_STORES[storeId] || ONLINE_GROCERY_STORES.walmart;
  const cleanItemName = String(itemName || "").trim();
  const storeBrandSearch = cleanItemName ? `${store.storeBrand} ${cleanItemName}` : "";
  const url = storeBrandSearch ? store.searchUrl(storeBrandSearch) : store.homeUrl;
  const bounds = groceryWindowBounds(browserWindow);
  onlineGroceryWindow = browserWindow.open(url, ONLINE_SHOPPING_WINDOW_NAME, `popup=yes,width=${bounds.width},height=${bounds.height},left=${bounds.left},top=${bounds.top},resizable=yes,scrollbars=yes`);
  if (onlineGroceryWindow) {
    onlineGroceryWindow.moveTo?.(bounds.left, bounds.top);
    onlineGroceryWindow.resizeTo?.(bounds.width, bounds.height);
    onlineGroceryWindow.focus();
  }
  return onlineGroceryWindow;
}
