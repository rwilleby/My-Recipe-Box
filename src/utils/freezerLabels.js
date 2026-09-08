export const FREEZER_LABEL_STORAGE_KEY = "rrb_freezerLabelMaker_v1";

export const FREEZER_LABEL_LAYOUTS = Object.freeze({
  compact: { id: "compact", name: "Compact · 12 per page", columns: 3, rows: 4 },
  standard: { id: "standard", name: "Standard · 8 per page", columns: 2, rows: 4 },
  large: { id: "large", name: "Large · 6 per page", columns: 2, rows: 3 },
});

export function localFreezerLabelDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addFreezerMonths(value, months = 3) {
  const parts = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!parts) return "";
  const date = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
  date.setMonth(date.getMonth() + Number(months || 0));
  return localFreezerLabelDate(date);
}

export function formatFreezerLabelDate(value) {
  const parts = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return parts ? `${Number(parts[2])}/${Number(parts[3])}/${parts[1]}` : "—";
}

export function normalizeFreezerLabelState(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    layout: FREEZER_LABEL_LAYOUTS[source.layout] ? source.layout : "standard",
    queue: Array.isArray(source.queue) ? source.queue.filter((item) => item?.id && item?.name).slice(0, 120) : [],
    history: Array.isArray(source.history) ? source.history.filter((item) => item?.id && item?.name).slice(0, 100) : [],
  };
}

export function expandFreezerLabelQueue(queue = []) {
  return queue.flatMap((label) => Array.from(
    { length: Math.min(30, Math.max(1, Math.floor(Number(label.copies) || 1))) },
    (_, index) => ({ ...label, printKey: `${label.id}-${index}` }),
  ));
}

export function paginateFreezerLabels(labels = [], layoutId = "standard") {
  const layout = FREEZER_LABEL_LAYOUTS[layoutId] || FREEZER_LABEL_LAYOUTS.standard;
  const pageSize = layout.columns * layout.rows;
  return Array.from({ length: Math.ceil(labels.length / pageSize) }, (_, page) =>
    labels.slice(page * pageSize, (page + 1) * pageSize)
  );
}

