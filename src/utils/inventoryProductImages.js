const DB_NAME = "rrbInventoryMedia";
const STORE_NAME = "productThumbnails";

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) return reject(new Error("Image storage is unavailable."));
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function transact(mode, action) {
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, mode);
      const request = action(transaction.objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally { database.close(); }
}

export const saveInventoryProductThumbnail = (key, blob) => transact("readwrite", (store) => store.put(blob, key));
export const loadInventoryProductThumbnail = (key) => transact("readonly", (store) => store.get(key));
export const deleteInventoryProductThumbnail = (key) => transact("readwrite", (store) => store.delete(key));
