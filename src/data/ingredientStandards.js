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
  "AM-021|Mashed potatoes": Object.freeze({ type: "mashed-potato-shopping-equivalent", shoppingQuantity: 3, shoppingUnit: "pound", shoppingEquivalent: "About 3 pounds potatoes or prepared mashed potatoes", approximate: true }),
  "AM-021|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-023|Chopped green onions": Object.freeze({ type: "optional-garnish" }),
  "AM-025|Chopped fresh parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-026|Chopped fresh parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-027|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-028|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-028|Mashed potatoes": Object.freeze({ type: "unmeasured-serving-suggestion" }),
  "AM-028|Green beans": Object.freeze({ type: "unmeasured-serving-suggestion" }),
  "AM-029|Chopped fresh parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-030|Cooked chicken, diced": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1, shoppingUnit: "pound", shoppingEquivalent: "About 1 pound raw boneless chicken", approximate: true }),
  "AM-031|Cooked chicken, diced": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1, shoppingUnit: "pound", shoppingEquivalent: "About 1 pound raw boneless chicken", approximate: true }),
  "AM-032|Cooked chicken, shredded": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1, shoppingUnit: "pound", shoppingEquivalent: "About 1 pound raw boneless chicken", approximate: true }),
  "AM-033|Cooked chicken, shredded": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1, shoppingUnit: "pound", shoppingEquivalent: "About 1 pound raw boneless chicken", approximate: true }),
  "AM-034|Cooked chicken, shredded": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1, shoppingUnit: "pound", shoppingEquivalent: "About 1 pound raw boneless chicken", approximate: true }),
  "AM-035|Chopped fresh parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-035|Cooked chicken, shredded": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1, shoppingUnit: "pound", shoppingEquivalent: "About 1 pound raw boneless chicken", approximate: true }),
  "AM-035|Bacon, cooked and crumbled": Object.freeze({ type: "cooked-bacon-yield", shoppingQuantity: 6, shoppingUnit: "ounce", shoppingEquivalent: "About 6 ounces raw bacon", approximate: true }),
  "AM-035|Cream cheese, softened": Object.freeze({ type: "soft-cheese-weight", quantity: 8, unit: "ounce", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "One 8-ounce package" }),
  "AM-036|Cream cheese, softened": Object.freeze({ type: "soft-cheese-weight", quantity: 8, unit: "ounce", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "One 8-ounce package" }),
  "AM-036|Cooked chicken, shredded": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1.5, shoppingUnit: "pound", shoppingEquivalent: "About 1.5 pounds raw boneless chicken", approximate: true }),
  "AM-036|Cooked bacon, crumbled": Object.freeze({ type: "cooked-bacon-yield", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces raw bacon", approximate: true }),
  "AM-037|Boneless skinless chicken breasts": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 2, shoppingUnit: "pound", shoppingEquivalent: "About 2 pounds" }),
  "AM-037|Cooking spray or olive oil, for pan": Object.freeze({ type: "unmeasured-cooking-supply" }),
  "AM-038|Cooking spray": Object.freeze({ type: "unmeasured-cooking-supply" }),
  "AM-038|Bone-in skin-on chicken pieces, thighs, drumsticks, or breasts": Object.freeze({ type: "mixed-bone-in-piece-weight", shoppingQuantity: 3, shoppingUnit: "pound", shoppingEquivalent: "About 3 pounds bone-in chicken pieces", approximate: true }),
  "AM-039|Cooking oil": Object.freeze({ type: "unmeasured-cooking-supply" }),
});

export const AM_021_040_REVIEW_FLAGS = Object.freeze({});

export const AM_041_060_APPROVED_RESOLUTIONS = Object.freeze({
  "AM-041|Bone-in skin-on chicken thighs": Object.freeze({ type: "bone-in-chicken-piece-weight", shoppingQuantity: 3, shoppingUnit: "pound", shoppingEquivalent: "About 3 pounds bone-in chicken thighs", approximate: true }),
  "AM-041|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-042|Boneless skinless chicken breasts": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 2, shoppingUnit: "pound", shoppingEquivalent: "About 2 pounds" }),
  "AM-042|Cooked spaghetti": Object.freeze({ type: "unmeasured-serving-suggestion" }),
  "AM-042|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-043|Cooked chicken, cubed": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 2, shoppingUnit: "pound", shoppingEquivalent: "About 2 pounds raw boneless chicken", approximate: true }),
  "AM-045|Meaty ham hock or 2 cups diced ham": Object.freeze({
    type: "alternative-shopping-equivalent",
    shoppingQuantity: 1,
    shoppingUnit: "each",
    shoppingEquivalent: "One meaty ham hock (about 1.5 pounds) or about 12 ounces diced ham",
    approximate: true,
    acceptableAlternatives: Object.freeze([
      Object.freeze({ canonicalKey: "pork.ham.hock", canonicalName: "Ham Hock", recipeName: "Meaty ham hock", masterItemId: "", matchStatus: "approved-alternative" }),
      Object.freeze({ canonicalKey: "pork.ham.diced", canonicalName: "Diced Ham", recipeName: "Diced ham", masterItemId: "", matchStatus: "approved-alternative" }),
    ]),
  }),
  "AM-045|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-046|Cooking spray or butter, for dish": Object.freeze({ type: "unmeasured-cooking-supply" }),
  "AM-047|Boneless pork chops": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 2, shoppingUnit: "pound", shoppingEquivalent: "About 2 pounds", approximate: true }),
  "AM-047|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-048|Bone-in pork chops": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 3, shoppingUnit: "pound", shoppingEquivalent: "About 3 pounds", approximate: true }),
  "AM-048|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-049|Bone-in pork chops": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 3, shoppingUnit: "pound", shoppingEquivalent: "About 3 pounds", approximate: true }),
  "AM-049|Vegetable oil": Object.freeze({ type: "unmeasured-cooking-supply" }),
  "AM-050|Coleslaw": Object.freeze({ type: "unmeasured-serving-suggestion" }),
  "AM-052|Chopped fresh parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-053|Ham steaks, 1/2-inch thick": Object.freeze({ type: "piece-count-with-shopping-weight", recipeName: "Ham steaks", canonicalName: "Ham Steaks", canonicalKey: "pork.ham.steak", preparation: "1/2-inch thick", shoppingQuantity: 3, shoppingUnit: "pound", shoppingEquivalent: "About 3 pounds", approximate: true }),
  "AM-054|Pork shoulder roast, 3–4 lb": Object.freeze({ type: "display-range", quantity: 3.5, unit: "pound", recipeQuantityText: "3–4", shoppingQuantity: 3.5, shoppingUnit: "pound", shoppingEquivalent: "One 3–4-pound pork shoulder roast" }),
  "AM-054|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-056|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-057|Cooked chicken, diced": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1.5, shoppingUnit: "pound", shoppingEquivalent: "About 1.5 pounds raw boneless chicken", approximate: true }),
  "AM-058|Butter or lettuce": Object.freeze({ type: "unmeasured-optional-ingredient" }),
  "AM-060|Fresh basil, chopped": Object.freeze({ type: "optional-garnish" }),
});

export const AM_041_060_REVIEW_FLAGS = Object.freeze({});

export const AM_061_078_APPROVED_RESOLUTIONS = Object.freeze({
  "AM-061|Diced onion": Object.freeze({ type: "unmeasured-optional-ingredient" }),
  "AM-061|Yellow mustard|optional": Object.freeze({ type: "unmeasured-optional-ingredient" }),
  "AM-062|Vegetable oil|for frying": Object.freeze({ type: "unmeasured-cooking-supply" }),
  "AM-062|Yellow mustard": Object.freeze({ type: "unmeasured-serving-suggestion" }),
  "AM-062|Ketchup": Object.freeze({ type: "unmeasured-serving-suggestion" }),
  "AM-064|Cooked bacon, crispy": Object.freeze({ type: "cooked-bacon-yield", shoppingQuantity: 6, shoppingUnit: "ounce", shoppingEquivalent: "About 6 ounces raw bacon", approximate: true }),
  "AM-064|Small red onion, thinly sliced": Object.freeze({ type: "sized-colored-onion", quantity: 0.25, unit: "cup", recipeName: "Red onion", canonicalName: "Red Onion", canonicalKey: "produce.onion.red", shoppingEquivalent: "About 1/2 small red onion" }),
  "AM-064|Dill pickle spears": Object.freeze({ type: "unmeasured-serving-suggestion" }),
  "AM-065|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-065|Sliced cooked turkey": Object.freeze({ type: "cooked-turkey-yield", shoppingQuantity: 1, shoppingUnit: "pound", shoppingEquivalent: "About 1 pound raw boneless turkey or 12 ounces prepared cooked turkey", approximate: true }),
  "AM-066|Prepared mashed potatoes": Object.freeze({ type: "mashed-potato-shopping-equivalent", shoppingQuantity: 2, shoppingUnit: "pound", shoppingEquivalent: "About 2 pounds potatoes or prepared mashed potatoes", approximate: true }),
  "AM-067|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-069|Cooked bacon, crumbled": Object.freeze({ type: "cooked-bacon-yield", shoppingQuantity: 16, shoppingUnit: "ounce", shoppingEquivalent: "About 16 ounces raw bacon", approximate: true }),
  "AM-070|Sliced pickles": Object.freeze({ type: "optional-garnish" }),
  "AM-070|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-071|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-072|Chopped parsley": Object.freeze({ type: "optional-garnish" }),
  "AM-073|Cooked chicken, diced": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1.5, shoppingUnit: "pound", shoppingEquivalent: "About 1.5 pounds raw boneless chicken", approximate: true }),
  "AM-074|Cooked chicken, diced": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1.5, shoppingUnit: "pound", shoppingEquivalent: "About 1.5 pounds raw boneless chicken", approximate: true }),
  "AM-074|Cooked ham, diced": Object.freeze({ type: "cooked-ham-yield", shoppingQuantity: 12, shoppingUnit: "ounce", shoppingEquivalent: "About 12 ounces diced ham", approximate: true }),
  "AM-077|Cooked chicken, shredded": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1.5, shoppingUnit: "pound", shoppingEquivalent: "About 1.5 pounds raw boneless chicken", approximate: true }),
  "AM-077|Cooked bacon, crumbled": Object.freeze({ type: "cooked-bacon-yield", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces raw bacon", approximate: true }),
  "AM-078|Cooked ham, diced": Object.freeze({ type: "cooked-ham-yield", shoppingQuantity: 12, shoppingUnit: "ounce", shoppingEquivalent: "About 12 ounces diced ham", approximate: true }),
});

export const AM_061_078_REVIEW_FLAGS = Object.freeze({});

export const AS_001_024_APPROVED_RESOLUTIONS = Object.freeze({
  "AS-004|Onion, sliced": Object.freeze({ type: "default-medium-onion", quantity: 0.5, unit: "cup", shoppingEquivalent: "About 1/2 medium onion" }),
  "AS-005|Onion, sliced": Object.freeze({ type: "default-medium-onion", quantity: 0.5, unit: "cup", shoppingEquivalent: "About 1/2 medium onion" }),
  "AS-006|Sesame seeds": Object.freeze({ type: "optional-garnish" }),
  "AS-007|Sesame seeds": Object.freeze({ type: "optional-garnish" }),
  "AS-012|Sesame seeds": Object.freeze({ type: "optional-garnish" }),
  "AS-014|Onion, cut into 1-inch pieces": Object.freeze({ type: "default-medium-onion", quantity: 0.5, unit: "cup", shoppingEquivalent: "About 1/2 medium onion" }),
  "AS-015|Onion, cut into 1-inch pieces": Object.freeze({ type: "default-medium-onion", quantity: 0.5, unit: "cup", shoppingEquivalent: "About 1/2 medium onion" }),
  "AS-016|Onion, cut into 1-inch pieces": Object.freeze({ type: "default-medium-onion", quantity: 0.5, unit: "cup", shoppingEquivalent: "About 1/2 medium onion" }),
  "AS-017|Onion, cut into 1-inch pieces": Object.freeze({ type: "default-medium-onion", quantity: 0.5, unit: "cup", shoppingEquivalent: "About 1/2 medium onion" }),
  "AS-021|Chicken breast, thinly sliced, or 1 lb shrimp, peeled and deveined": Object.freeze({
    type: "equal-weight-protein-alternatives",
    recipeName: "Chicken breast or shrimp",
    canonicalName: "Chicken Breast or Shrimp",
    canonicalKey: "choice.chicken-breast.shrimp",
    preparation: "chicken thinly sliced; shrimp peeled and deveined",
    shoppingQuantity: 1,
    shoppingUnit: "pound",
    shoppingEquivalent: "1 pound chicken breast or 1 pound shrimp",
    acceptableAlternatives: Object.freeze([
      Object.freeze({ canonicalKey: "meat.chicken.breast", canonicalName: "Chicken Breast", recipeName: "Chicken breast", masterItemId: "", matchStatus: "approved-alternative" }),
      Object.freeze({ canonicalKey: "seafood.shrimp", canonicalName: "Shrimp", recipeName: "Shrimp", masterItemId: "", matchStatus: "approved-alternative" }),
    ]),
  }),
});

export const AS_001_024_REVIEW_FLAGS = Object.freeze({
  "AS-019|Cooked chicken or beef strips": "One cooked cup needs approved raw shopping weights for both the chicken and beef alternatives.",
  "AS-020|Cooked chicken or pork strips": "One cooked cup needs approved raw shopping weights for both the chicken and pork alternatives.",
  "AS-023|Cooked shrimp, peeled, or shredded chicken": "One-half pound cooked shrimp or shredded chicken needs approved raw or prepared shopping equivalents for both alternatives.",
});

export const INGREDIENT_STANDARD_VERSION = "1.5";
