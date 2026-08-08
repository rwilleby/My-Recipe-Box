import { createKosPlatform } from "./createKosPlatform.js";

export function createBrowserKos({
  storage = globalThis.localStorage,
  storageKey = "rrb-kos-v1",
  rfisPlatform = null,
  clock,
} = {}) {
  if (!storage) {
    throw new Error("Browser KOS requires a storage adapter");
  }

  return createKosPlatform({
    storage,
    storageKey,
    rfisPlatform,
    clock,
  });
}

export default createBrowserKos;
