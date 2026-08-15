export const WEEKEND_LABEL_SHEET = Object.freeze({
  id: "l-liked-ltr-12",
  name: "L LIKED Dissolvable 30-up",
  sheetWidth: 8.5,
  sheetHeight: 11,
  columns: 3,
  rows: 10,
  labelsPerSheet: 30,
  labelWidth: 2.625,
  labelHeight: 1,
  topMargin: 0.45,
  leftMargin: 0.15,
  horizontalGap: 0.12,
  verticalGap: 0,
});

export function localDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatCompactLabelDate(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "—";
  return `${Number(match[2])}/${Number(match[3])}/${match[1].slice(-2)}`;
}

export function createWeekendLabelEntries(items = []) {
  return items.flatMap((item) => {
    const quantity = Math.max(0, Math.floor(Number(item.labelQuantity ?? 1)));
    return Array.from({ length: quantity }, (_, labelIndex) => ({
      key: `${item.uid}-${labelIndex}`,
      title: item.title || "Untitled recipe",
      code: item.id || "",
      finish: item.finish || "Whole",
      package: item.package || "",
      createdDate: item.createdDate || "",
      refrigeratorUseBy: item.refrigeratorUseBy || "",
      freezeUseBy: item.freezeUseBy || "",
    }));
  });
}

export function createWeekendLabelPages(entries = [], unavailablePositions = []) {
  if (!entries.length) return [];
  const unavailable = new Set(
    unavailablePositions
      .map(Number)
      .filter((position) => position >= 1 && position <= WEEKEND_LABEL_SHEET.labelsPerSheet),
  );
  const pages = [];
  let entryIndex = 0;
  let pageNumber = 0;

  while (entryIndex < entries.length) {
    const page = Array(WEEKEND_LABEL_SHEET.labelsPerSheet).fill(null);
    for (let slot = 1; slot <= WEEKEND_LABEL_SHEET.labelsPerSheet && entryIndex < entries.length; slot += 1) {
      if (pageNumber === 0 && unavailable.has(slot)) continue;
      page[slot - 1] = entries[entryIndex];
      entryIndex += 1;
    }
    if (pageNumber === 0 && page.every((entry) => entry === null)) {
      pageNumber += 1;
      continue;
    }
    pages.push(page);
    pageNumber += 1;
  }

  return pages;
}
