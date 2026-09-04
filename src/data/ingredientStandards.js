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

export const AM_021_040_APPROVED_RESOLUTIONS = Object.freeze({
  "AM-021|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-023|Chopped green onions": Object.freeze({ type: "optional-garnish" }),
  "AM-025|Chopped fresh parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-026|Chopped fresh parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-027|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-028|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-029|Chopped fresh parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-035|Chopped fresh parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-035|Cream cheese, softened": Object.freeze({ type: "soft-cheese-weight", quantity: 8, unit: "ounce", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "One 8-ounce package" }),
  "AM-036|Cream cheese, softened": Object.freeze({ type: "soft-cheese-weight", quantity: 8, unit: "ounce", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "One 8-ounce package" }),
  "AM-037|Boneless skinless chicken breasts": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 2, shoppingUnit: "pound", shoppingEquivalent: "About 2 pounds" }),
  "AM-037|Cooking spray or olive oil, for pan": Object.freeze({ type: "unmeasured-cooking-supply" }),
  "AM-038|Cooking spray": Object.freeze({ type: "unmeasured-cooking-supply" }),
  "AM-039|Cooking oil": Object.freeze({ type: "unmeasured-cooking-supply" }),
});

export const AM_021_040_REVIEW_FLAGS = Object.freeze({
  "AM-021|Mashed potatoes": "Six cups are required, but the source does not say homemade, refrigerated, or instant; the shopping equivalent depends on that choice.",
  "AM-028|Mashed potatoes": "A serving suggestion is listed without a quantity or preferred product form.",
  "AM-028|Green beans": "A serving suggestion is listed without a quantity or preferred fresh, frozen, or canned form.",
  "AM-030|Cooked chicken, diced": "A practical raw or prepared chicken shopping equivalent requires an approved cooked-cup yield standard.",
  "AM-031|Cooked chicken, diced": "A practical raw or prepared chicken shopping equivalent requires an approved cooked-cup yield standard.",
  "AM-032|Cooked chicken, shredded": "A practical raw or prepared chicken shopping equivalent requires an approved cooked-cup yield standard.",
  "AM-033|Cooked chicken, shredded": "A practical raw or prepared chicken shopping equivalent requires an approved cooked-cup yield standard.",
  "AM-034|Cooked chicken, shredded": "A practical raw or prepared chicken shopping equivalent requires an approved cooked-cup yield standard.",
  "AM-035|Cooked chicken, shredded": "A practical raw or prepared chicken shopping equivalent requires an approved cooked-cup yield standard.",
  "AM-036|Cooked chicken, shredded": "A practical raw or prepared chicken shopping equivalent requires an approved cooked-cup yield standard.",
  "AM-035|Bacon, cooked and crumbled": "Six cooked slices vary substantially by thickness; a shopping-weight equivalent needs an approved standard.",
  "AM-036|Cooked bacon, crumbled": "One-half cup cooked crumbled bacon needs an approved raw shopping-weight yield.",
  "AM-038|Bone-in skin-on chicken pieces, thighs, drumsticks, or breasts": "Six mixed bone-in pieces have materially different weights; do not guess one total shopping weight.",
});

export const INGREDIENT_STANDARD_VERSION = "1.1";
