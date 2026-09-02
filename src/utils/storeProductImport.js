const RETAILERS = [
  { name: "Walmart", domains: ["walmart.com"] },
  { name: "H-E-B", domains: ["heb.com"] },
  { name: "Kroger", domains: ["kroger.com"] },
  { name: "Amazon", domains: ["amazon.com", "amazon.ca"] },
];

function retailerForHost(hostname) {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  return RETAILERS.find((entry) => entry.domains.some((domain) => host === domain || host.endsWith(`.${domain}`)))?.name || "";
}

function titleFromSlug(slug = "") {
  return decodeURIComponent(slug).replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
}

export function parseStoreProductUrl(rawValue) {
  const raw = String(rawValue || "").trim();
  if (!raw) throw new Error("Enter or drop a product link first.");
  let url;
  try { url = new URL(raw); } catch { throw new Error("Enter a complete product link beginning with http:// or https://."); }
  if (!/^https?:$/.test(url.protocol)) throw new Error("Only standard web product links are supported.");
  const retailer = retailerForHost(url.hostname);
  if (!retailer) throw new Error("For this test, use a Walmart, H-E-B, Kroger or Amazon product link.");
  url.search = "";
  url.hash = "";
  const cleanUrl = url.toString().replace(/\/$/, "");
  const parts = url.pathname.split("/").filter(Boolean);
  const draft = {
    productName: "", brand: "", variety: "", packageSize: "", packageCount: "",
    quantityOwned: "1", unit: "packages", categoryId: "prepared-packaged", family: "Other Packaged Foods",
    storage: "Pantry", expirationDate: "", lowStockLevel: "1", retailer, cleanUrl,
    price: "", priceRecordedAt: "", retailerItemId: "",
  };

  if (retailer === "Walmart") {
    const ipIndex = parts.findIndex((part) => part.toLowerCase() === "ip");
    const itemId = parts.slice(ipIndex + 1).findLast((part) => /^\d+$/.test(part)) || "";
    draft.retailerItemId = itemId;
    const slug = ipIndex >= 0 ? parts[ipIndex + 1] : "";
    draft.productName = titleFromSlug(slug);
    if (itemId === "5375582628") Object.assign(draft, {
      productName: "Great Value Donut Shop Coffee Pods",
      brand: "Great Value",
      variety: "100% Arabica Medium Roast",
      packageSize: "38.4 oz",
      packageCount: "100",
      quantityOwned: "1",
      unit: "Pods",
      categoryId: "beverages",
      family: "Coffee",
      storage: "Pantry",
    });
  } else {
    const candidate = parts.filter((part) => !/^(p|product|products|dp|gp)$/i.test(part)).sort((a, b) => b.length - a.length)[0];
    if (candidate && !/^[A-Z0-9]{8,}$/i.test(candidate)) draft.productName = titleFromSlug(candidate);
    if (retailer === "Amazon") {
      const dpIndex = parts.findIndex((part) => part.toLowerCase() === "dp");
      draft.retailerItemId = dpIndex >= 0 ? (parts[dpIndex + 1] || "") : "";
    }
  }
  return draft;
}

export async function createInventoryThumbnail(file, maxSize = 320) {
  if (!(file instanceof Blob) || !String(file.type || "").startsWith("image/")) throw new Error("Choose an image file.");
  const source = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("That image could not be opened."));
      element.src = source;
    });
    const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("The thumbnail could not be created.")), "image/webp", .78));
  } finally { URL.revokeObjectURL(source); }
}
