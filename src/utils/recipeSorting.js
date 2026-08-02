export function compareRecipeCodes(a, b) {
  return String(a?.id || a || "").localeCompare(
    String(b?.id || b || ""),
    undefined,
    { numeric: true, sensitivity: "base" },
  );
}

export function sortRecipesByCode(items = []) {
  return [...items].sort(compareRecipeCodes);
}
