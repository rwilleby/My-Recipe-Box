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

export const AM_001_020_REVIEW_FLAGS = Object.freeze({
  "AM-001|Chopped parsley": "Optional garnish has no stated cooking quantity.",
  "AM-002|Chopped parsley": "Optional garnish has no stated cooking quantity.",
  "AM-003|Cube steaks": "Six steaks are specified without a total weight; do not guess a pound conversion.",
  "AM-005|Parsley": "Optional garnish has no stated cooking quantity.",
  "AM-006|Fresh parsley or basil": "Optional garnish has no stated cooking quantity.",
  "AM-010|Thin chicken breasts or cutlets": "Six pieces are specified without a total weight; do not guess a pound conversion.",
  "AM-011|Boneless skinless chicken breasts or cutlets": "Six pieces are specified without a total weight; do not guess a pound conversion.",
  "AM-011|Parsley": "Optional garnish has no stated cooking quantity.",
  "AM-013|Cooked ham, 3–4 lb": "The source gives a 3–4 pound range; preserve it until one required weight is approved.",
  "AM-014|Onion, cut in chunks": "Onion size is not stated, so a reliable cup conversion cannot be made.",
  "AM-015|Onion, chopped": "Onion size is not stated, so a reliable cup conversion cannot be made.",
  "AM-016|Onion, sliced": "Onion size is not stated, so a reliable cup conversion cannot be made.",
  "AM-019|Potato, diced and cooked": "Potato size is not stated; retain one whole potato rather than guessing a cup yield.",
  "AM-020|Onion, sliced": "Onion size is not stated, so a reliable cup conversion cannot be made.",
  "AM-020|Parsley": "Optional garnish has no stated cooking quantity.",
});

export const INGREDIENT_STANDARD_VERSION = "1.0";
