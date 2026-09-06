export const ONLINE_GROCERY_STORES = Object.freeze({
  walmart: { label: "Walmart", homeUrl: "https://www.walmart.com/", searchUrl: (query) => `https://www.walmart.com/search?q=${encodeURIComponent(query)}` },
  kroger: { label: "Kroger", homeUrl: "https://www.kroger.com/", searchUrl: (query) => `https://www.kroger.com/search?query=${encodeURIComponent(query)}` },
  heb: { label: "H-E-B", homeUrl: "https://www.heb.com/", searchUrl: (query) => `https://www.heb.com/search?q=${encodeURIComponent(query)}` },
  randalls: { label: "Randall's", homeUrl: "https://www.randalls.com/", searchUrl: (query) => `https://www.randalls.com/shop/search-results.html?q=${encodeURIComponent(query)}` },
});

export const PREFERRED_GROCERY_STORE_KEY = "rrb_preferredGroceryStore";
export const ONLINE_SHOPPING_WINDOW_NAME = "rrbOnlineShopping";

export function openOnlineGroceryWindow(storeId, itemName = "", browserWindow = window) {
  const store = ONLINE_GROCERY_STORES[storeId] || ONLINE_GROCERY_STORES.walmart;
  const cleanItemName = String(itemName || "").trim();
  const url = cleanItemName ? store.searchUrl(cleanItemName) : store.homeUrl;
  const availableWidth = Math.max(720, Number(browserWindow.screen?.availWidth) || 1440);
  const availableHeight = Math.max(640, Number(browserWindow.screen?.availHeight) || 900);
  const popupWidth = Math.min(760, Math.max(520, Math.floor(availableWidth * 0.48)));
  const popupHeight = Math.min(availableHeight, Math.max(640, availableHeight - 60));
  const popupLeft = Math.max(0, availableWidth - popupWidth);
  const shoppingWindow = browserWindow.open(url, ONLINE_SHOPPING_WINDOW_NAME, `popup=yes,width=${popupWidth},height=${popupHeight},left=${popupLeft},top=0,resizable=yes,scrollbars=yes`);
  if (shoppingWindow) shoppingWindow.focus();
  return shoppingWindow;
}
