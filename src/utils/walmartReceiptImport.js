const RECEIPT_LIMIT = 12 * 1024 * 1024;
const IGNORE_LINE = /^(subtotal|total|tax|change|cash|credit|debit|visa|mastercard|amex|discover|approval|account|card|tender|balance|discount|coupon|savings|return|refund)\b/i;
const NON_FOOD = /\b(shampoo|soap|detergent|paper towels?|toilet paper|battery|batteries|medicine|vitamin|cosmetic|clothing|shirt|sock|toy|electronics?)\b/i;

function decodePdfString(value = "") {
  return value.replace(/\\([0-7]{1,3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)))
    .replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t")
    .replace(/\\([()\\])/g, "$1");
}

function extractTextOperators(source = "") {
  const blocks = source.match(/BT[\s\S]*?ET/g) || [];
  const lines = [];
  blocks.forEach((block) => {
    for (const operation of block.matchAll(/(\[(?:\\.|[^\]])*\]|\((?:\\.|[^\\)])*\)|<[0-9A-Fa-f\s]+>)\s*(?:Tj|TJ|'|")/g)) {
      const parts = [];
      for (const match of operation[1].matchAll(/\((?:\\.|[^\\)])*\)|<([0-9A-Fa-f\s]+)>/g)) {
        if (match[0][0] === "(") parts.push(decodePdfString(match[0].slice(1, -1)));
        else {
          const hex = (match[1] || "").replace(/\s/g, "");
          let text = "";
          for (let i = 0; i + 1 < hex.length; i += 2) text += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
          parts.push(text.replace(/^\u0000+/, "").replace(/\u0000/g, ""));
        }
      }
      const text = parts.join(" ").replace(/\s+/g, " ").trim();
      if (text) lines.push(text);
    }
  });
  return lines.join("\n");
}

async function inflatePdfStreams(bytes, source) {
  if (typeof DecompressionStream === "undefined") return [];
  const decoder = new TextDecoder("latin1");
  const texts = [];
  for (const match of source.matchAll(/<<(?:.|\n|\r)*?\/FlateDecode(?:.|\n|\r)*?>>\s*stream\r?\n/g)) {
    const start = match.index + match[0].length;
    const endMarker = source.indexOf("endstream", start);
    if (endMarker < 0) continue;
    let end = endMarker;
    while (end > start && (bytes[end - 1] === 10 || bytes[end - 1] === 13)) end -= 1;
    try {
      const stream = new Blob([bytes.slice(start, end)]).stream().pipeThrough(new DecompressionStream("deflate"));
      texts.push(decoder.decode(await new Response(stream).arrayBuffer()));
    } catch { /* A damaged stream should not block other readable pages. */ }
  }
  return texts;
}

export async function extractPdfTextFromBuffer(buffer) {
  const bytes = new Uint8Array(buffer);
  if (bytes.byteLength < 8 || new TextDecoder("latin1").decode(bytes.slice(0, 8)).indexOf("%PDF-") !== 0) throw new Error("That file is not a valid PDF receipt.");
  if (bytes.byteLength > RECEIPT_LIMIT) throw new Error("That PDF is too large. Please use a receipt PDF smaller than 12 MB.");
  const source = new TextDecoder("latin1").decode(bytes);
  if (/\/Encrypt\b/.test(source)) throw new Error("This PDF is password protected. Please upload an unlocked Walmart receipt PDF.");
  const streamSources = await inflatePdfStreams(bytes, source);
  return [extractTextOperators(source), ...streamSources.map(extractTextOperators)].filter(Boolean).join("\n").trim();
}

export async function readWalmartReceiptPdf(file) {
  if (!file || (!/\.pdf$/i.test(file.name || "") && file.type !== "application/pdf")) throw new Error("Please choose a Walmart receipt PDF.");
  const text = await extractPdfTextFromBuffer(await file.arrayBuffer());
  if (!text) throw new Error("This receipt appears to be a scan. Try a clearer PDF or add the items manually.");
  return text;
}

function cleanDescription(value = "") {
  return value.replace(/^\d{8,14}\s+/, "").replace(/\s+(?:[A-Z])?\$?\d+\.\d{2}\s*$/i, "").replace(/\s+/g, " ").trim();
}

export function parseWalmartReceiptText(text = "") {
  const normalized = String(text).replace(/\r/g, "\n");
  if (!/\bwalmart\b/i.test(normalized)) throw new Error("This does not appear to be a Walmart receipt. Walmart receipt PDFs are supported in this first version.");
  const date = normalized.match(/\b(\d{1,2}[\/-]\d{1,2}[\/-](?:\d{2}|\d{4}))\b/)?.[1] || "";
  const lines = normalized.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const items = [];
  lines.forEach((line, index) => {
    if (line.length < 3 || IGNORE_LINE.test(line) || NON_FOOD.test(line) || /walmart|receipt|store|associate|transaction|tc#|st#|op#|te#/i.test(line)) return;
    if (!/\d+\.\d{2}\b/.test(line) && !/^\d+\s*[xX]\s+/.test(line)) return;
    const quantity = Number(line.match(/^(\d+)\s*[xX]\s+/)?.[1] || lines[index - 1]?.match(/^(\d+)\s*[xX]$/)?.[1] || 1);
    const weight = line.match(/(\d+(?:\.\d+)?)\s*(lb|lbs|oz|kg|g)\b/i);
    const description = cleanDescription(line.replace(/^\d+\s*[xX]\s+/, "").replace(/\b\d+(?:\.\d+)?\s*(?:lb|lbs|oz|kg|g)\b/ig, ""));
    if (description && !/^\d+[.:\/-]*$/.test(description)) items.push({ id: `receipt-${index}-${description.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`, description, quantity, weight: weight ? `${weight[1]} ${weight[2]}` : "", status: "new" });
  });
  const unique = [...new Map(items.map((item) => [`${item.description.toLowerCase()}|${item.quantity}`, item])).values()];
  if (!unique.length) throw new Error("We could not find readable Walmart product lines in this PDF. Try a clearer PDF or add the items manually.");
  return { retailer: "Walmart", purchaseDate: date, items: unique };
}

function words(value = "") { return new Set(value.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((word) => word.length > 2)); }
export function matchReceiptItems(items, catalog, aliases = {}) {
  const choices = catalog.flatMap((category) => category.items.map((item) => ({ ...item, categoryId: category.id, categoryTitle: category.title })));
  return items.map((receiptItem) => {
    const normalized = receiptItem.description.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    const aliasId = aliases[normalized];
    const alias = choices.find((choice) => choice.id === aliasId);
    if (alias) return { ...receiptItem, matchedItemId: alias.id, categoryId: alias.categoryId, family: alias.family, unit: alias.unit || "items", status: "matched", selected: true };
    const receiptWords = words(receiptItem.description);
    const ranked = choices.map((choice) => {
      const candidate = words(`${choice.family} ${choice.variation}`);
      const overlap = [...receiptWords].filter((word) => candidate.has(word)).length;
      return { choice, score: overlap / Math.max(1, Math.min(receiptWords.size, candidate.size)) };
    }).sort((a, b) => b.score - a.score);
    const best = ranked[0];
    if (best?.score >= .66) return { ...receiptItem, matchedItemId: best.choice.id, categoryId: best.choice.categoryId, family: best.choice.family, unit: best.choice.unit || "items", status: "matched", selected: true };
    if (best?.score >= .34) return { ...receiptItem, matchedItemId: best.choice.id, categoryId: best.choice.categoryId, family: best.choice.family, unit: best.choice.unit || "items", status: "review", selected: false };
    return { ...receiptItem, matchedItemId: "", categoryId: "prepared-packaged", family: "Other Packaged Foods", unit: "items", status: "new", selected: false };
  });
}

export async function createReceiptFingerprint(purchaseDate, items) {
  const safe = `${purchaseDate}|${items.map((item) => item.description.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()).sort().join("|")}`;
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(safe));
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  let hash = 2166136261;
  for (const character of safe) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return `local-${(hash >>> 0).toString(16)}`;
}
