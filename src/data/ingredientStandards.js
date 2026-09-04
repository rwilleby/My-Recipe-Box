// Site-wide ingredient data rules. Recipe-card source text remains preserved in
// originalName/originalUnit while audited recipe rows expose normalized fields.

export const STANDARD_COOKING_UNITS = Object.freeze([
  "pound", "ounce", "cup", "tablespoon", "teaspoon", "each", "clove",
  "slice", "stalk", "sprig", "leaf", "can", "jar", "package", "packet", "sleeve",
]);

export const ONION_VOLUME_EQUIVALENTS = Object.freeze({
  small: Object.freeze({ cups: 0.5, shoppingEquivalent: "About 1 small onion" }),
  medium: Object.freeze({ cups: 1, shoppingEquivalent: "About 1 medium onion" }),
  large: Object.freeze({ cups: 1.5, shoppingEquivalent: "About 1 large onion" }),
  "extra-large": Object.freeze({ cups: 2, shoppingEquivalent: "About 1 extra-large onion" }),
});

export const AM_001_020_APPROVED_RESOLUTIONS = Object.freeze({
  "AM-001|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-002|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-003|Cube steaks": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 2, shoppingUnit: "pound", shoppingEquivalent: "About 2 pounds" }),
  "AM-005|Parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-006|Fresh parsley or basil": Object.freeze({ type: "optional-garnish" }),
  "AM-010|Thin chicken breasts or cutlets": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 2, shoppingUnit: "pound", shoppingEquivalent: "About 2 pounds" }),
  "AM-011|Boneless skinless chicken breasts or cutlets": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 2, shoppingUnit: "pound", shoppingEquivalent: "About 2 pounds" }),
  "AM-011|Parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-013|Cooked ham, 3–4 lb": Object.freeze({ type: "display-range", quantity: 3.5, unit: "pound", recipeQuantityText: "3–4", shoppingQuantity: 3.5, shoppingUnit: "pound", shoppingEquivalent: "One 3–4-pound cooked ham" }),
  "AM-014|Onion, cut in chunks": Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", shoppingEquivalent: "About 1 medium onion" }),
  "AM-015|Onion, chopped": Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", shoppingEquivalent: "About 1 medium onion" }),
  "AM-016|Onion, sliced": Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", shoppingEquivalent: "About 1 medium onion" }),
  "AM-019|Potato, diced and cooked": Object.freeze({ type: "default-medium-russet", quantity: 1, unit: "cup", recipeName: "Russet potato", canonicalName: "Potato — Russet", canonicalKey: "produce.potato.russet", shoppingEquivalent: "About 1 medium russet potato" }),
  "AM-020|Onion, sliced": Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", shoppingEquivalent: "About 1 medium onion" }),
  "AM-020|Parsley": Object.freeze({ type: "optional-garnish" }),
});

export const INGREDIENT_STANDARD_VERSION = "1.1";
