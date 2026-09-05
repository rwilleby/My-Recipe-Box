// Site-wide ingredient data rules. Recipe-card source text remains preserved in
// originalName/originalUnit while audited recipe rows expose normalized fields.

export const STANDARD_COOKING_UNITS = Object.freeze([
  "pound", "ounce", "cup", "tablespoon", "teaspoon", "each", "clove",
  "slice", "stalk", "sprig", "leaf", "pinch", "ear", "head", "rib", "quart", "can", "jar", "package", "packet", "sleeve", "container",
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
  "AS-019|Cooked chicken or beef strips": Object.freeze({ type: "cooked-protein-alternative-yield", recipeName: "Chicken or beef strips", canonicalName: "Chicken or Beef Strips", canonicalKey: "choice.chicken.beef-strips", preparation: "cooked", shoppingQuantity: 0.5, shoppingUnit: "pound", shoppingEquivalent: "About 1/2 pound raw boneless chicken or 1/2 pound raw beef", approximate: true, acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "meat.chicken.boneless", canonicalName: "Boneless Chicken", recipeName: "Chicken", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "meat.beef.strips", canonicalName: "Beef Strips", recipeName: "Beef strips", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "AS-020|Cooked chicken or pork strips": Object.freeze({ type: "cooked-protein-alternative-yield", recipeName: "Chicken or pork strips", canonicalName: "Chicken or Pork Strips", canonicalKey: "choice.chicken.pork-strips", preparation: "cooked", shoppingQuantity: 0.5, shoppingUnit: "pound", shoppingEquivalent: "About 1/2 pound raw boneless chicken or 1/2 pound raw pork", approximate: true, acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "meat.chicken.boneless", canonicalName: "Boneless Chicken", recipeName: "Chicken", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "meat.pork.strips", canonicalName: "Pork Strips", recipeName: "Pork strips", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
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
  "AS-023|Cooked shrimp, peeled, or shredded chicken": Object.freeze({ type: "cooked-protein-alternative-yield", recipeName: "Shrimp or chicken", canonicalName: "Shrimp or Chicken", canonicalKey: "choice.shrimp.chicken", preparation: "cooked; shrimp peeled; chicken shredded", shoppingQuantity: 0.75, shoppingUnit: "pound", shoppingEquivalent: "About 3/4 pound raw peeled shrimp or raw boneless chicken; alternatively 8 ounces prepared cooked protein", approximate: true, acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "seafood.shrimp", canonicalName: "Shrimp", recipeName: "Shrimp", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "meat.chicken.boneless", canonicalName: "Boneless Chicken", recipeName: "Chicken", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
});

export const AS_001_024_REVIEW_FLAGS = Object.freeze({});

const IT_OPTIONAL_GARNISHES = [
  ["IT-001", "Chopped parsley"], ["IT-002", "Chopped basil"], ["IT-003", "Chopped parsley"], ["IT-004", "Chopped parsley"], ["IT-005", "Chopped basil"], ["IT-006", "Parsley"], ["IT-007", "Chopped basil"], ["IT-008", "Chopped parsley"], ["IT-009", "Chopped parsley"], ["IT-010", "Chopped parsley"], ["IT-011", "Chopped parsley"], ["IT-012", "Chopped basil"], ["IT-013", "Chopped parsley"], ["IT-014", "Chopped parsley"], ["IT-017", "Chopped parsley"], ["IT-018", "Chopped parsley"], ["IT-019", "Chopped parsley"], ["IT-020", "Chopped parsley"], ["IT-021", "Chopped parsley"], ["IT-022", "Chopped parsley"], ["IT-023", "Chopped basil"], ["IT-024", "Chopped basil"], ["IT-025", "Chopped parsley"], ["IT-026", "Chopped parsley"], ["IT-027", "Chopped basil"], ["IT-028", "Chopped basil"], ["IT-029", "Chopped parsley"], ["IT-030", "Chopped basil"], ["IT-031", "Chopped parsley"], ["IT-032", "Chopped parsley"], ["IT-033", "Chopped parsley"], ["IT-034", "Chopped parsley"], ["IT-035", "Chopped parsley"], ["IT-037", "Chopped parsley"], ["IT-039", "Chopped parsley"], ["IT-040", "Chopped parsley"], ["IT-044", "Chopped parsley"], ["IT-047", "Chopped parsley"], ["IT-048", "Chopped parsley"], ["IT-049", "Chopped parsley"],
];

const IT_SMALL_ONION_RECIPES = ["IT-012", "IT-013", "IT-014", "IT-015", "IT-016", "IT-022", "IT-024", "IT-028", "IT-040", "IT-051", "IT-052", "IT-053", "IT-054", "IT-055", "IT-056", "IT-057", "IT-058", "IT-059", "IT-060"];

const IT_PIECE_WEIGHT_RESOLUTIONS = [
  ["IT-001", "Chicken breasts, sliced", 1, "About 1 pound"], ["IT-002", "Boneless chicken cutlets", 2, "About 2 pounds"], ["IT-003", "Chicken cutlets", 2, "About 2 pounds"], ["IT-004", "Chicken cutlets", 2, "About 2 pounds"], ["IT-005", "Chicken breasts", 2, "About 2 pounds"], ["IT-006", "Chicken breasts, cubed", 1, "About 1 pound"], ["IT-007", "Chicken breasts", 2, "About 2 pounds"], ["IT-009", "Chicken cutlets", 2, "About 2 pounds"], ["IT-035", "Cod fillets", 1.5, "About 1.5 pounds"], ["IT-036", "Salmon fillets", 1.5, "About 1.5 pounds"], ["IT-048", "Breaded chicken cutlets", 2, "About 2 pounds prepared breaded chicken cutlets"],
];

const IT_PRODUCE_VOLUME_RESOLUTIONS = [
  ["IT-008", "Bell pepper, sliced", 1, "Bell pepper", "Bell Pepper", "produce.pepper.bell", "About 1 bell pepper"],
  ["IT-017", "Red bell pepper, sliced", 1, "Red bell pepper", "Red Bell Pepper", "produce.pepper.bell.red", "About 1 red bell pepper"],
  ["IT-017", "Green bell pepper, sliced", 1, "Green bell pepper", "Green Bell Pepper", "produce.pepper.bell.green", "About 1 green bell pepper"],
  ["IT-023", "Red bell pepper, sliced", 1, "Red bell pepper", "Red Bell Pepper", "produce.pepper.bell.red", "About 1 red bell pepper"],
  ["IT-015", "Carrot, diced", 0.5, "Carrot", "Carrot", "produce.carrot", "About 1 carrot"],
  ["IT-052", "Carrots, sliced", 1, "Carrots", "Carrot", "produce.carrot", "About 2 carrots"], ["IT-053", "Carrots, sliced", 1, "Carrots", "Carrot", "produce.carrot", "About 2 carrots"], ["IT-054", "Carrots, sliced", 1, "Carrots", "Carrot", "produce.carrot", "About 2 carrots"], ["IT-056", "Carrots, shredded", 1, "Carrots", "Carrot", "produce.carrot", "About 2 carrots"], ["IT-058", "Carrots, diced", 1, "Carrots", "Carrot", "produce.carrot", "About 2 carrots"], ["IT-059", "Carrots, diced", 1, "Carrots", "Carrot", "produce.carrot", "About 2 carrots"],
  ["IT-023", "Zucchini, sliced", 1.5, "Zucchini", "Zucchini", "produce.zucchini", "About 1 zucchini"], ["IT-023", "Yellow squash, sliced", 1.5, "Yellow squash", "Yellow Squash", "produce.squash.yellow", "About 1 yellow squash"], ["IT-030", "Medium eggplants, sliced", 8, "Eggplant", "Eggplant", "produce.eggplant", "About 2 medium eggplants"], ["IT-041", "Roma tomatoes, sliced", 1, "Roma tomatoes", "Roma Tomato", "produce.tomato.roma", "About 2 Roma tomatoes"], ["IT-050", "Roma tomatoes, sliced", 1, "Roma tomatoes", "Roma Tomato", "produce.tomato.roma", "About 2 Roma tomatoes"], ["IT-054", "Zucchini, diced", 1.5, "Zucchini", "Zucchini", "produce.zucchini", "About 1 zucchini"],
];

export const IT_001_060_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(IT_OPTIONAL_GARNISHES.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "optional-garnish" })])),
  ...Object.fromEntries(IT_SMALL_ONION_RECIPES.map((recipeId) => [`${recipeId}|Small onion, ${recipeId === "IT-016" ? "sliced" : "diced"}`, Object.freeze({ type: "sized-onion-volume", quantity: 0.5, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", shoppingEquivalent: "About 1 small onion" })])),
  ...Object.fromEntries(IT_PIECE_WEIGHT_RESOLUTIONS.map(([recipeId, name, shoppingQuantity, shoppingEquivalent]) => [`${recipeId}|${name}`, Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity, shoppingUnit: "pound", shoppingEquivalent, approximate: true })])),
  ...Object.fromEntries(IT_PRODUCE_VOLUME_RESOLUTIONS.map(([recipeId, name, quantity, recipeName, canonicalName, canonicalKey, shoppingEquivalent]) => [`${recipeId}|${name}`, Object.freeze({ type: "prepared-produce-volume", quantity, unit: "cup", recipeName, canonicalName, canonicalKey, shoppingEquivalent, approximate: true })])),
  "IT-004|Lemon slices": Object.freeze({ type: "optional-garnish" }),
  "IT-008|Onion, sliced": Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", shoppingEquivalent: "About 1 medium onion" }),
  "IT-008|Chicken thighs": Object.freeze({ type: "piece-count-with-shopping-weight", recipeName: "Chicken thighs", canonicalName: "Chicken Thighs", canonicalKey: "meat.chicken.thighs", shoppingQuantity: 2, shoppingUnit: "pound", shoppingEquivalent: "About 2 pounds chicken thighs", approximate: true }),
  "IT-017|Yellow onion, sliced": Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Yellow onion", canonicalName: "Yellow Onion", canonicalKey: "produce.onion.yellow", shoppingEquivalent: "About 1 medium yellow onion" }),
  "IT-044|Garlic bread, halved": Object.freeze({ type: "whole-loaf", quantity: 1, unit: "each", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "One loaf garlic bread" }),
  "IT-046|Cooked Italian sausage": Object.freeze({ type: "cooked-sausage-yield", shoppingQuantity: 5, shoppingUnit: "ounce", shoppingEquivalent: "About 5 ounces raw Italian sausage or 4 ounces prepared cooked sausage", approximate: true }),
  "IT-047|Frozen or homemade meatballs, cooked": Object.freeze({ type: "prepared-meatball-weight", shoppingQuantity: 1, shoppingUnit: "pound", shoppingEquivalent: "About 1 pound prepared meatballs", approximate: true }),
  "IT-056|Cooked chicken, chopped": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1.5, shoppingUnit: "pound", shoppingEquivalent: "About 1.5 pounds raw boneless chicken", approximate: true }),
});

export const IT_001_060_REVIEW_FLAGS = Object.freeze({});

const MX_OPTIONAL_ROWS = [
  ["MX-001", "Salt", "unmeasured-cooking-supply"], ["MX-001", "Black pepper", "unmeasured-cooking-supply"], ["MX-001", "Chopped cilantro or green onions", "optional-garnish"],
  ["MX-002", "Salt", "unmeasured-cooking-supply"], ["MX-002", "Black pepper", "unmeasured-cooking-supply"], ["MX-002", "Chopped cilantro or green onions", "optional-garnish"],
  ["MX-003", "Chopped cilantro", "optional-garnish"], ["MX-004", "Chopped cilantro", "optional-garnish"], ["MX-005", "Chopped cilantro", "optional-garnish"], ["MX-006", "Chopped cilantro", "optional-garnish"],
  ["MX-007", "Salt", "unmeasured-cooking-supply"], ["MX-007", "Black pepper", "unmeasured-cooking-supply"], ["MX-007", "Chopped cilantro", "optional-garnish"],
  ["MX-008", "Salsa or sour cream", "unmeasured-serving-suggestion"], ["MX-009", "Sour cream or cilantro", "unmeasured-serving-suggestion"], ["MX-010", "Salsa or sour cream", "unmeasured-serving-suggestion"],
  ["MX-011", "Sour cream", "unmeasured-serving-suggestion"], ["MX-011", "Green onions", "unmeasured-serving-suggestion"], ["MX-012", "Chopped green onions", "optional-garnish"],
  ["MX-014", "Crumbled cotija or cilantro", "optional-garnish"], ["MX-019", "Chopped cilantro", "optional-garnish"], ["MX-020", "Chopped cilantro", "optional-garnish"],
  ["MX-021", "Chopped cilantro or green onions", "optional-garnish"], ["MX-023", "Chopped cilantro", "optional-garnish"], ["MX-025", "Lime wedges", "unmeasured-serving-suggestion"],
  ["MX-026", "Salsa", "unmeasured-serving-suggestion"], ["MX-027", "Fresh cilantro", "optional-garnish"], ["MX-027", "Lime wedges", "unmeasured-serving-suggestion"],
  ["MX-029", "Fresh cilantro", "optional-garnish"], ["MX-030", "Lime wedges", "unmeasured-serving-suggestion"], ["MX-031", "Sour cream", "unmeasured-serving-suggestion"], ["MX-031", "Salsa", "unmeasured-serving-suggestion"],
  ["MX-032", "Lime wedges", "unmeasured-serving-suggestion"], ["MX-032", "Salsa", "unmeasured-serving-suggestion"], ["MX-034", "Tortilla strips", "unmeasured-serving-suggestion"], ["MX-034", "Avocado", "unmeasured-serving-suggestion"], ["MX-034", "Cilantro", "unmeasured-serving-suggestion"], ["MX-034", "Lime", "unmeasured-serving-suggestion"],
  ["MX-037", "Sour cream", "unmeasured-serving-suggestion"], ["MX-037", "Guacamole", "unmeasured-serving-suggestion"], ["MX-038", "Salsa", "unmeasured-serving-suggestion"], ["MX-038", "Sour cream", "unmeasured-serving-suggestion"],
  ["MX-039", "Cooking spray or oil", "unmeasured-cooking-supply"], ["MX-039", "Shredded lettuce", "unmeasured-serving-suggestion"], ["MX-039", "Salsa", "unmeasured-serving-suggestion"], ["MX-039", "Crema or sour cream", "unmeasured-serving-suggestion"],
  ["MX-040", "Salt", "unmeasured-cooking-supply"], ["MX-040", "Black pepper", "unmeasured-cooking-supply"], ["MX-041", "Salt", "unmeasured-cooking-supply"], ["MX-041", "Black pepper", "unmeasured-cooking-supply"], ["MX-042", "Avocado, tortilla strips, or sour cream", "unmeasured-serving-suggestion"],
];

const MX_COOKED_CHICKEN_RECIPES = ["MX-002", "MX-007", "MX-010", "MX-029", "MX-031", "MX-033", "MX-034", "MX-039", "MX-040"];
const MX_SMALL_ONION_ROWS = [
  ["MX-001", "diced", 1], ["MX-002", "diced", 1], ["MX-003", "diced", 1], ["MX-006", "diced", 1], ["MX-007", "diced", 1], ["MX-008", "diced", 1], ["MX-009", "diced", 1], ["MX-011", "diced", 1], ["MX-012", "diced", 1],
  ["MX-013", "finely diced", 0.5], ["MX-014", "diced", 0.5], ["MX-015", "diced", 0.5], ["MX-016", "diced", 0.5], ["MX-017", "diced", 0.5],
  ["MX-021", "diced", 1], ["MX-022", "diced", 1], ["MX-023", "diced", 1], ["MX-024", "diced", 1], ["MX-025", "sliced", 1], ["MX-030", "sliced", 1], ["MX-035", "chopped", 1], ["MX-036", "chopped", 1], ["MX-038", "sliced", 1], ["MX-041", "chopped", 1], ["MX-042", "chopped", 1],
];

const MX_BELL_PEPPER_ROWS = [
  ["MX-004", "Bell peppers, sliced", 2, "Bell peppers", "Bell Pepper", "produce.pepper.bell", "About 2 bell peppers"], ["MX-005", "Bell peppers, sliced", 2, "Bell peppers", "Bell Pepper", "produce.pepper.bell", "About 2 bell peppers"],
  ["MX-010", "Small bell pepper, diced", 0.5, "Bell pepper", "Bell Pepper", "produce.pepper.bell", "About 1 small bell pepper"], ["MX-017", "Bell pepper, diced", 0.5, "Bell pepper", "Bell Pepper", "produce.pepper.bell", "About 1/2 bell pepper"],
  ["MX-025", "Red bell pepper, sliced", 1, "Red bell pepper", "Red Bell Pepper", "produce.pepper.bell.red", "About 1 red bell pepper"], ["MX-025", "Green bell pepper, sliced", 1, "Green bell pepper", "Green Bell Pepper", "produce.pepper.bell.green", "About 1 green bell pepper"],
  ["MX-030", "Red bell pepper, sliced", 1, "Red bell pepper", "Red Bell Pepper", "produce.pepper.bell.red", "About 1 red bell pepper"], ["MX-030", "Green bell pepper, sliced", 1, "Green bell pepper", "Green Bell Pepper", "produce.pepper.bell.green", "About 1 green bell pepper"],
  ["MX-038", "Bell pepper, sliced", 1, "Bell pepper", "Bell Pepper", "produce.pepper.bell", "About 1 bell pepper"], ["MX-041", "Bell pepper, chopped", 1, "Bell pepper", "Bell Pepper", "produce.pepper.bell", "About 1 bell pepper"],
];

export const MX_001_044_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(MX_OPTIONAL_ROWS.map(([recipeId, name, type]) => [`${recipeId}|${name}`, Object.freeze({ type })])),
  ...Object.fromEntries(MX_COOKED_CHICKEN_RECIPES.map((recipeId) => [`${recipeId}|Cooked shredded chicken`, Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1.5, shoppingUnit: "pound", shoppingEquivalent: "About 1.5 pounds raw boneless chicken", approximate: true })])),
  ...Object.fromEntries(MX_SMALL_ONION_ROWS.map(([recipeId, preparation, count]) => [`${recipeId}|Small onion, ${preparation}`, Object.freeze({ type: "sized-onion-volume", quantity: count * 0.5, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", shoppingEquivalent: `About ${count === 0.5 ? "1/2" : "1"} small onion` })])),
  ...Object.fromEntries(MX_BELL_PEPPER_ROWS.map(([recipeId, name, quantity, recipeName, canonicalName, canonicalKey, shoppingEquivalent]) => [`${recipeId}|${name}`, Object.freeze({ type: "prepared-produce-volume", quantity, unit: "cup", recipeName, canonicalName, canonicalKey, shoppingEquivalent, approximate: true })])),
  "MX-004|Large onion, sliced": Object.freeze({ type: "sized-onion-volume", quantity: 1.5, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", shoppingEquivalent: "About 1 large onion" }),
  "MX-005|Large onion, sliced": Object.freeze({ type: "sized-onion-volume", quantity: 1.5, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", shoppingEquivalent: "About 1 large onion" }),
  "MX-028|Cooked chicken, diced": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1.5, shoppingUnit: "pound", shoppingEquivalent: "About 1.5 pounds raw boneless chicken", approximate: true }),
  "MX-034|Onion, diced": Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", shoppingEquivalent: "About 1 medium onion" }),
  "MX-004|Flank or skirt steak, thinly sliced": Object.freeze({ type: "equal-weight-protein-alternatives", recipeName: "Flank or skirt steak", canonicalName: "Flank or Skirt Steak", canonicalKey: "choice.beef.flank-skirt", preparation: "thinly sliced", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "meat.beef.flank-steak", canonicalName: "Flank Steak", recipeName: "Flank steak", masterItemId: "", matchStatus: "approved-alternative" }), Object.freeze({ canonicalKey: "meat.beef.skirt-steak", canonicalName: "Skirt Steak", recipeName: "Skirt steak", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "MX-038|Flank steak or chicken, sliced": Object.freeze({ type: "equal-weight-protein-alternatives", recipeName: "Flank steak or chicken", canonicalName: "Flank Steak or Chicken", canonicalKey: "choice.beef-flank.chicken", preparation: "sliced", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "meat.beef.flank-steak", canonicalName: "Flank Steak", recipeName: "Flank steak", masterItemId: "", matchStatus: "approved-alternative" }), Object.freeze({ canonicalKey: "meat.chicken.boneless", canonicalName: "Boneless Chicken", recipeName: "Chicken", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  ...Object.fromEntries(["MX-010", "MX-017", "MX-022", "MX-024"].map((recipeId) => [`${recipeId}|Green onions, sliced`, Object.freeze({ type: "prepared-produce-volume", quantity: 0.25, unit: "cup", recipeName: "Green onions", canonicalName: "Green Onion", canonicalKey: "produce.onion.green", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 green onions", approximate: true })])),
  "MX-009|Cooked Mexican rice": Object.freeze({ type: "cooked-rice-yield", shoppingQuantity: 0.3333333333, shoppingUnit: "cup", shoppingEquivalent: "About 1/3 cup dry rice or 1 cup prepared Mexican rice", approximate: true }),
  ...Object.fromEntries(["MX-025", "MX-026", "MX-027", "MX-028", "MX-029", "MX-030"].map((recipeId) => [`${recipeId}|Cooked rice`, Object.freeze({ type: "cooked-rice-yield", shoppingQuantity: 0.6666666667, shoppingUnit: "cup", shoppingEquivalent: "About 2/3 cup dry rice", approximate: true })])),
  "MX-037|Cooked shredded chicken or beef": Object.freeze({ type: "cooked-protein-alternative-yield", recipeName: "Shredded chicken or beef", canonicalName: "Chicken or Beef", canonicalKey: "choice.chicken.beef", preparation: "cooked, shredded", shoppingQuantity: 1.5, shoppingUnit: "pound", shoppingEquivalent: "About 1.5 pounds raw boneless chicken or beef", approximate: true, acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "meat.chicken.boneless", canonicalName: "Boneless Chicken", recipeName: "Chicken", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "meat.beef.boneless", canonicalName: "Boneless Beef", recipeName: "Beef", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  ...Object.fromEntries(["MX-011", "MX-018", "MX-019", "MX-020"].map((recipeId) => [`${recipeId}|Tortilla chips`, Object.freeze({ type: "default-package-size", quantity: 10, unit: "ounce", shoppingQuantity: 10, shoppingUnit: "ounce", shoppingEquivalent: "One 10-ounce bag", approximate: true })])),
});

export const MX_001_044_REVIEW_FLAGS = Object.freeze({});

const SF_GREEN_ONION_RECIPES = ["SF-003", "SF-008", "SF-009"];
const SF_MEDIUM_ONION_RECIPES = ["SF-016", "SF-017", "SF-018", "SF-020"];
const SF_BELL_PEPPER_RECIPES = ["SF-016", "SF-017", "SF-018", "SF-020"];

export const SF_001_020_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(SF_GREEN_ONION_RECIPES.map((recipeId) => [`${recipeId}|Green onions`, Object.freeze({ type: "prepared-produce-volume", quantity: 0.25, unit: "cup", recipeName: "Green onions", canonicalName: "Green Onion", canonicalKey: "produce.onion.green", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 green onions", approximate: true })])),
  ...Object.fromEntries(SF_MEDIUM_ONION_RECIPES.map((recipeId) => [`${recipeId}|Onion, chopped`, Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", shoppingEquivalent: "About 1 medium onion" })])),
  ...Object.fromEntries(SF_BELL_PEPPER_RECIPES.map((recipeId) => [`${recipeId}|Bell pepper, chopped`, Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Bell pepper", canonicalName: "Bell Pepper", canonicalKey: "produce.pepper.bell", shoppingEquivalent: "About 1 bell pepper", approximate: true })])),
  "SF-001|Cooking spray": Object.freeze({ type: "unmeasured-cooking-supply" }),
  "SF-006|Cooking spray": Object.freeze({ type: "unmeasured-cooking-supply" }),
  "SF-008|Salmon fillets": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 1.5, shoppingUnit: "pound", shoppingEquivalent: "About 1.5 pounds salmon fillets", approximate: true }),
  "SF-009|Salmon fillets": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 1.5, shoppingUnit: "pound", shoppingEquivalent: "About 1.5 pounds salmon fillets", approximate: true }),
  "SF-019|Oil for frying": Object.freeze({ type: "unmeasured-cooking-supply" }),
  "SF-020|Cooked rice": Object.freeze({ type: "cooked-rice-yield", shoppingQuantity: 0.6666666667, shoppingUnit: "cup", shoppingEquivalent: "About 2/3 cup dry rice", approximate: true }),
  ...Object.fromEntries(["SF-010", "SF-011", "SF-012", "SF-013", "SF-014"].map((recipeId) => [`${recipeId}|Tilapia fillets`, Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 1.5, shoppingUnit: "pound", shoppingEquivalent: "About 1.5 pounds tilapia fillets", approximate: true })])),
  ...Object.fromEntries(["SF-011", "SF-012"].map((recipeId) => [`${recipeId}|Lemon wedges`, Object.freeze({ type: "piece-count-with-shopping-equivalent", recipeName: "Lemon wedges", canonicalName: "Lemon", canonicalKey: "produce.fruit.lemon", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 whole lemon", approximate: true })])),
});

export const SF_001_020_REVIEW_FLAGS = Object.freeze({});

const QP_MINI_SHELL_RECIPES = Array.from({ length: 26 }, (_, index) => `QP-${String(index + 1).padStart(3, "0")}`);
const QP_OPTIONAL_CHIVE_RECIPES = ["QP-001", "QP-002", "QP-003", "QP-004", "QP-005", "QP-007", "QP-008", "QP-009", "QP-010", "QP-011", "QP-012", "QP-014", "QP-015", "QP-016"];
const QP_OPTIONAL_COARSE_SUGAR_RECIPES = ["QP-020", "QP-021", "QP-022", "QP-023", "QP-024"];
const QP_OPTIONAL_ALMOND_EXTRACT_RECIPES = ["QP-020", "QP-022", "QP-023", "QP-024"];

export const QP_001_030_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(QP_MINI_SHELL_RECIPES.map((recipeId) => [`${recipeId}|Mini pie shells`, Object.freeze({ type: "whole-pastry-shells", quantity: 4, unit: "each", preparation: "baked", shoppingQuantity: 4, shoppingUnit: "each", shoppingEquivalent: "Four 5-inch mini pie shells" })])),
  ...Object.fromEntries(QP_OPTIONAL_CHIVE_RECIPES.map((recipeId) => [`${recipeId}|Chopped chives`, Object.freeze({ type: "optional-ingredient" })])),
  ...Object.fromEntries(QP_OPTIONAL_COARSE_SUGAR_RECIPES.map((recipeId) => [`${recipeId}|Coarse sugar`, Object.freeze({ type: "optional-ingredient" })])),
  ...Object.fromEntries(QP_OPTIONAL_ALMOND_EXTRACT_RECIPES.map((recipeId) => [`${recipeId}|Almond extract`, Object.freeze({ type: "optional-ingredient" })])),
  "QP-002|Bacon": Object.freeze({ type: "cooked-bacon-yield", shoppingQuantity: 6, shoppingUnit: "ounce", shoppingEquivalent: "About 6 ounces raw bacon", approximate: true }),
  "QP-003|Diced cooked ham": Object.freeze({ type: "cooked-ham-yield", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces diced ham", approximate: true }),
  "QP-006|Cooked ground breakfast sausage": Object.freeze({ type: "cooked-sausage-yield", shoppingQuantity: 10, shoppingUnit: "ounce", shoppingEquivalent: "About 10 ounces raw breakfast sausage or 8 ounces prepared cooked sausage", approximate: true }),
  "QP-007|Bacon": Object.freeze({ type: "cooked-bacon-yield", shoppingQuantity: 6, shoppingUnit: "ounce", shoppingEquivalent: "About 6 ounces raw bacon", approximate: true }),
  "QP-009|Diced cooked ham": Object.freeze({ type: "cooked-ham-yield", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About 4 ounces diced ham", approximate: true }),
  "QP-010|Cooked breakfast sausage": Object.freeze({ type: "cooked-sausage-yield", shoppingQuantity: 5, shoppingUnit: "ounce", shoppingEquivalent: "About 5 ounces raw breakfast sausage or 4 ounces prepared cooked sausage", approximate: true }),
  "QP-012|Ground beef": Object.freeze({ type: "cooked-ground-beef-yield", shoppingQuantity: 10, shoppingUnit: "ounce", shoppingEquivalent: "About 10 ounces raw ground beef", approximate: true }),
  "QP-013|Chopped fresh basil": Object.freeze({ type: "fresh-or-dried-herb-alternative", quantity: 0.25, unit: "cup", recipeName: "Basil", canonicalName: "Basil", canonicalKey: "produce.herb.basil", preparation: "chopped if fresh", shoppingEquivalent: "1/4 cup fresh basil or 1 tablespoon dried basil", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "produce.herb.basil", canonicalName: "Fresh Basil", recipeName: "Fresh basil", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "spice.basil.dried", canonicalName: "Dried Basil", recipeName: "Dried basil", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "QP-014|Large onions": Object.freeze({ type: "sized-onion-volume", quantity: 3, unit: "cup", recipeName: "Onions", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "thinly sliced", shoppingEquivalent: "About 2 large onions" }),
  "QP-014|Ground nutmeg": Object.freeze({ type: "optional-ingredient" }),
  "QP-015|Cayenne pepper": Object.freeze({ type: "optional-ingredient" }),
  "QP-015|Cooked crawfish tails": Object.freeze({ type: "prepared-crawfish-weight", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces prepared crawfish tails", approximate: true }),
  "QP-016|Ground beef": Object.freeze({ type: "cooked-ground-beef-yield", shoppingQuantity: 10, shoppingUnit: "ounce", shoppingEquivalent: "About 10 ounces raw ground beef", approximate: true }),
  "QP-017|Cooked chicken": Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 1.5, shoppingUnit: "pound", shoppingEquivalent: "About 1.5 pounds raw boneless chicken", approximate: true }),
  "QP-017|Chopped parsley": Object.freeze({ type: "optional-ingredient" }),
  "QP-020|Almond extract": Object.freeze({ type: "optional-ingredient" }),
  "QP-025|All-purpose flour": Object.freeze({ type: "optional-ingredient" }),
  "QP-026|Coconut extract": Object.freeze({ type: "optional-ingredient" }),
  "QP-026|Unsalted butter": Object.freeze({ type: "optional-ingredient" }),
  "QP-027|Oreo cookie crust or homemade crust": Object.freeze({ type: "whole-pie-crust", quantity: 1, unit: "each", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "One 9-inch Oreo cookie crust or ingredients for one homemade crust" }),
  "QP-027|Frozen whipped topping": Object.freeze({ type: "package-weight", quantity: 8, unit: "ounce", preparation: "thawed, divided", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "One 8-ounce container" }),
  "QP-027|Chocolate shavings or curls": Object.freeze({ type: "optional-garnish" }),
  ...Object.fromEntries(["QP-028", "QP-029", "QP-030"].map((recipeId) => [`${recipeId}|Graham cracker pie crust, store-bought`, Object.freeze({ type: "whole-pie-crust", quantity: 1, unit: "each", recipeName: "Graham cracker pie crust", preparation: "store-bought", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "One 9-inch graham cracker pie crust" })])),
  ...Object.fromEntries(["QP-028", "QP-029", "QP-030"].map((recipeId) => [`${recipeId}|Frozen whipped topping`, Object.freeze({ type: "package-weight", quantity: 8, unit: "ounce", preparation: "thawed, divided", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "One 8-ounce container" })])),
  "QP-028|Pink food coloring": Object.freeze({ type: "unmeasured-optional-ingredient" }),
  "QP-028|Lemon slices or zest": Object.freeze({ type: "optional-garnish" }),
  "QP-029|Additional key lime zest or lime slices": Object.freeze({ type: "optional-garnish" }),
  "QP-029|Key lime juice": Object.freeze({ type: "juice-with-produce-equivalent", quantity: 1, unit: "cup", shoppingQuantity: 7, shoppingUnit: "each", shoppingEquivalent: "About 6–8 key limes", approximate: true }),
  "QP-030|Fresh strawberries, hulled and sliced": Object.freeze({ type: "optional-ingredient" }),
  "QP-030|Strawberry slices": Object.freeze({ type: "optional-garnish" }),
});

export const QP_001_030_REVIEW_FLAGS = Object.freeze({});

const SB_COOKED_CHICKEN_ROWS = [
  ["SB-001", "Cooked shredded chicken"], ["SB-002", "Cooked chopped chicken"], ["SB-003", "Cooked chopped chicken"],
  ["SB-005", "Cooked chopped chicken breast"], ["SB-006", "Cooked chopped chicken breast"], ["SB-007", "Cooked chopped chicken breast"],
  ["SB-008", "Cooked chopped chicken breast"], ["SB-012", "Cooked chopped chicken breast"], ["SB-013", "Cooked chicken"],
];
const SB_UNMEASURED_OPTIONAL_ROWS = [
  ["SB-011", "Sliced radishes"], ["SB-011", "Shredded carrots"], ["SB-011", "Sunflower seeds"],
  ["SB-015", "Sliced olives"], ["SB-015", "Pickled red onion"], ["SB-015", "Avocado"],
  ["SB-019", "Cucumbers"], ["SB-019", "Shredded carrots"], ["SB-019", "Black olives"], ["SB-019", "Jalapeños"],
  ["SB-020", "Roasted sunflower seeds"], ["SB-020", "Real bacon bits"], ["SB-020", "Shredded cheese"], ["SB-020", "Crispy onions"], ["SB-020", "Dried cranberries"],
];

export const SB_001_020_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(SB_COOKED_CHICKEN_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "cooked-chicken-yield", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About 4 ounces raw boneless chicken or 3 ounces prepared cooked chicken", approximate: true })])),
  ...Object.fromEntries(SB_UNMEASURED_OPTIONAL_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "unmeasured-optional-ingredient" })])),
  "SB-002|Bacon": Object.freeze({ type: "cooked-bacon-yield", shoppingQuantity: 2, shoppingUnit: "ounce", shoppingEquivalent: "About 2 ounces raw bacon", approximate: true }),
  "SB-003|Buffalo chicken pieces": Object.freeze({ type: "prepared-chicken-weight", shoppingQuantity: 2, shoppingUnit: "ounce", shoppingEquivalent: "About 2 ounces prepared Buffalo chicken", approximate: true }),
  "SB-004|Cooked lean ground beef": Object.freeze({ type: "cooked-ground-beef-yield", shoppingQuantity: 5, shoppingUnit: "ounce", shoppingEquivalent: "About 5 ounces raw ground beef or 4 ounces cooked", approximate: true }),
  "SB-004|Crumbled cooked bacon": Object.freeze({ type: "cooked-bacon-yield", shoppingQuantity: 1, shoppingUnit: "ounce", shoppingEquivalent: "About 1 ounce raw bacon", approximate: true }),
  "SB-007|Bacon": Object.freeze({ type: "cooked-bacon-yield", shoppingQuantity: 2, shoppingUnit: "ounce", shoppingEquivalent: "About 2 ounces raw bacon", approximate: true }),
  "SB-009|Diced ham, bacon, or pre-cooked chicken or turkey": Object.freeze({ type: "optional-protein-alternatives", recipeName: "Diced ham, bacon, chicken, or turkey", canonicalName: "Ham, Bacon, Chicken, or Turkey", canonicalKey: "choice.ham-bacon-chicken-turkey", preparation: "diced or pre-cooked", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "pork.ham.diced", canonicalName: "Diced Ham", recipeName: "Diced ham", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "meat.pork.bacon", canonicalName: "Bacon", recipeName: "Bacon", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "meat.chicken.cooked", canonicalName: "Cooked Chicken", recipeName: "Cooked chicken", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "meat.turkey.cooked", canonicalName: "Cooked Turkey", recipeName: "Cooked turkey", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "SB-010|Lump crab meat": Object.freeze({ type: "prepared-crab-weight", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About 4 ounces prepared crab meat", approximate: true }),
  "SB-015|Pimento chicken salad": Object.freeze({ type: "prepared-chicken-salad-weight", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About 4 ounces prepared pimento chicken salad", approximate: true }),
  "SB-016|Cooked salmon": Object.freeze({ type: "cooked-fish-yield", shoppingQuantity: 5, shoppingUnit: "ounce", shoppingEquivalent: "About 5 ounces raw salmon or 4 ounces prepared cooked salmon", approximate: true }),
  "SB-017|Cooked shrimp": Object.freeze({ type: "cooked-shrimp-yield", shoppingQuantity: 5, shoppingUnit: "ounce", shoppingEquivalent: "About 5 ounces raw peeled shrimp or 4 ounces prepared cooked shrimp", approximate: true }),
  "SB-017|Bacon": Object.freeze({ type: "cooked-bacon-yield", shoppingQuantity: 1, shoppingUnit: "ounce", shoppingEquivalent: "About 1 ounce raw bacon", approximate: true }),
  "SB-018|Tuna": Object.freeze({ type: "drained-canned-tuna", shoppingQuantity: 5, shoppingUnit: "ounce", shoppingEquivalent: "One approximately 5-ounce can tuna", approximate: true }),
  "SB-020|Favorite dressing": Object.freeze({ type: "unmeasured-serving-suggestion", preparation: "stored separately" }),
});

export const SB_001_020_REVIEW_FLAGS = Object.freeze({});

export const SG_001_027_APPROVED_RESOLUTIONS = Object.freeze({
  "SG-001|Flank steak": Object.freeze({ type: "display-range", quantity: 1.75, unit: "pound", recipeQuantityText: "1 1/2–2", shoppingQuantity: 1.75, shoppingUnit: "pound", shoppingEquivalent: "About 1 1/2–2 pounds flank steak" }),
  "SG-002|Flank steak or sirloin, thinly sliced": Object.freeze({ type: "equal-weight-protein-alternatives", recipeName: "Flank steak or sirloin", canonicalName: "Flank Steak or Sirloin", canonicalKey: "choice.beef.flank-sirloin", preparation: "thinly sliced", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "meat.beef.flank-steak", canonicalName: "Flank Steak", recipeName: "Flank steak", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "meat.beef.sirloin", canonicalName: "Beef Sirloin", recipeName: "Sirloin", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "SG-003|Hot dogs": Object.freeze({ type: "display-range", quantity: 9, unit: "each", recipeQuantityText: "6–12", shoppingQuantity: 9, shoppingUnit: "each", shoppingEquivalent: "6–12 hot dogs" }),
  "SG-003|Hot dog buns": Object.freeze({ type: "display-range", quantity: 9, unit: "each", recipeQuantityText: "6–12", shoppingQuantity: 9, shoppingUnit: "each", shoppingEquivalent: "6–12 hot dog buns" }),
  "SG-003|Favorite toppings and condiments": Object.freeze({ type: "unmeasured-serving-suggestion" }),
  "SG-004|Sausage links": Object.freeze({ type: "display-range", quantity: 1.75, unit: "pound", recipeQuantityText: "1 1/2–2", shoppingQuantity: 1.75, shoppingUnit: "pound", shoppingEquivalent: "About 1 1/2–2 pounds sausage links" }),
  "SG-004|Favorite toppings and condiments": Object.freeze({ type: "unmeasured-serving-suggestion" }),
  "SG-005|Boneless skinless chicken breasts": Object.freeze({ type: "piece-count-with-shopping-weight", quantity: 5, unit: "each", recipeQuantityText: "4–6", shoppingQuantity: 2.5, shoppingUnit: "pound", shoppingEquivalent: "About 2–3 pounds boneless skinless chicken breasts", approximate: true }),
  "SG-008|Whole beef brisket": Object.freeze({ type: "display-range", quantity: 14, unit: "pound", recipeQuantityText: "12–16", shoppingQuantity: 14, shoppingUnit: "pound", shoppingEquivalent: "One 12–16-pound whole beef brisket" }),
  "SG-009|Pork butt": Object.freeze({ type: "display-range", quantity: 7.5, unit: "pound", recipeQuantityText: "7–8", shoppingQuantity: 7.5, shoppingUnit: "pound", shoppingEquivalent: "One 7–8-pound pork butt" }),
  "SG-010|Pork butt": Object.freeze({ type: "display-range", quantity: 7.5, unit: "pound", recipeQuantityText: "7–8", shoppingQuantity: 7.5, shoppingUnit: "pound", shoppingEquivalent: "One 7–8-pound pork butt" }),
  "SG-011|Boneless skinless chicken breasts": Object.freeze({ type: "piece-count-with-shopping-weight", quantity: 5, unit: "each", recipeQuantityText: "4–6", shoppingQuantity: 2.5, shoppingUnit: "pound", shoppingEquivalent: "About 2–3 pounds boneless skinless chicken breasts", approximate: true }),
  "SG-012|Baby back ribs": Object.freeze({ type: "rack-count-with-weight", quantity: 4, unit: "pound", recipeQuantityText: "2 racks, about 4", shoppingQuantity: 4, shoppingUnit: "pound", shoppingEquivalent: "Two racks, about 4 pounds baby back ribs" }),
  "SG-013|Beef plate ribs": Object.freeze({ type: "display-range", quantity: 3.5, unit: "pound", recipeQuantityText: "3–4", shoppingQuantity: 3.5, shoppingUnit: "pound", shoppingEquivalent: "About 3–4 pounds beef plate ribs" }),
  "SG-013|Beef tallow or duck fat, optional": Object.freeze({ type: "unmeasured-optional-ingredient" }),
  "SG-014|Chicken legs": Object.freeze({ type: "piece-count-with-shopping-weight", quantity: 9, unit: "each", recipeQuantityText: "8–10", shoppingQuantity: 3, shoppingUnit: "pound", shoppingEquivalent: "About 3 pounds chicken legs", approximate: true }),
  "SG-015|Chicken wings": Object.freeze({ type: "display-range", quantity: 3.5, unit: "pound", recipeQuantityText: "3–4", shoppingQuantity: 3.5, shoppingUnit: "pound", shoppingEquivalent: "About 3–4 pounds chicken wings" }),
  "SG-016|Chicken quarters": Object.freeze({ type: "piece-count-with-shopping-weight", quantity: 3, unit: "each", shoppingQuantity: 3, shoppingUnit: "pound", shoppingEquivalent: "About 3 pounds chicken leg quarters", approximate: true }),
  ...Object.fromEntries(["SG-017", "SG-018", "SG-019"].map((recipeId) => [`${recipeId}|Boneless skinless chicken thighs`, Object.freeze({ type: "display-range", quantity: 2.75, unit: "pound", recipeQuantityText: "2 1/2–3", shoppingQuantity: 2.75, shoppingUnit: "pound", shoppingEquivalent: "About 2 1/2–3 pounds boneless skinless chicken thighs" })])),
  "SG-020|Beef sirloin or chicken breast": Object.freeze({ type: "equal-weight-protein-alternatives", recipeName: "Beef sirloin or chicken breast", canonicalName: "Beef Sirloin or Chicken Breast", canonicalKey: "choice.beef-sirloin.chicken-breast", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "meat.beef.sirloin", canonicalName: "Beef Sirloin", recipeName: "Beef sirloin", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "meat.chicken.breast", canonicalName: "Chicken Breast", recipeName: "Chicken breast", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "SG-020|Whole mushrooms, optional": Object.freeze({ type: "optional-range", quantity: 13, unit: "each", recipeQuantityText: "12–14" }),
  "SG-021|Chicken legs": Object.freeze({ type: "piece-count-with-shopping-weight", quantity: 7, unit: "each", recipeQuantityText: "6–8", shoppingQuantity: 2.5, shoppingUnit: "pound", shoppingEquivalent: "About 2 1/2 pounds chicken legs", approximate: true }),
  "SG-022|Chicken wings": Object.freeze({ type: "display-range", quantity: 2.75, unit: "pound", recipeQuantityText: "2 1/2–3", shoppingQuantity: 2.75, shoppingUnit: "pound", shoppingEquivalent: "About 2 1/2–3 pounds chicken wings" }),
  "SG-023|Chicken leg quarters": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 4, shoppingUnit: "pound", shoppingEquivalent: "About 4 pounds chicken leg quarters", approximate: true }),
  "SG-024|Boneless skinless chicken breasts": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 2, shoppingUnit: "pound", shoppingEquivalent: "About 2 pounds boneless skinless chicken breasts", approximate: true }),
  "SG-025|Bone-in skin-on chicken thighs (about 2.5 to 3 lb total)": Object.freeze({ type: "piece-count-with-shopping-weight", recipeName: "Bone-in skin-on chicken thighs", canonicalName: "Bone-In Skin-On Chicken Thighs", canonicalKey: "meat.chicken.thighs.bone-in-skin-on", shoppingQuantity: 2.75, shoppingUnit: "pound", shoppingEquivalent: "About 2 1/2–3 pounds bone-in skin-on chicken thighs", approximate: true }),
  "SG-026|Chicken legs": Object.freeze({ type: "piece-count-with-shopping-weight", shoppingQuantity: 3, shoppingUnit: "pound", shoppingEquivalent: "About 3 pounds chicken legs", approximate: true }),
});

export const SG_001_027_REVIEW_FLAGS = Object.freeze({});

const SD_SMALL_ONION_RECIPES = ["SD-004", "SD-010", "SD-013", "SD-014", "SD-015", "SD-016", "SD-018", "SD-019", "SD-021", "SD-038"];

export const SD_001_052_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(SD_SMALL_ONION_RECIPES.map((recipeId) => [`${recipeId}|Onion, chopped`, Object.freeze({ type: "sized-onion-volume", quantity: 0.5, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", shoppingEquivalent: "About 1 small onion" })])),
  "SD-001|Cooked crumbled bacon": Object.freeze({ type: "raw-weight-with-preparation", quantity: 1, unit: "pound", recipeName: "Bacon", canonicalName: "Pork - Bacon - Sliced", canonicalKey: "meat.pork.bacon", preparation: "cooked, crumbled", shoppingQuantity: 1, shoppingUnit: "pound", shoppingEquivalent: "About 1 pound bacon" }),
  "SD-001|Onion, chopped": Object.freeze({ type: "sized-onion-volume", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", shoppingEquivalent: "About 1 medium onion" }),
  "SD-002|Cornbread, baked, cooled, and crumbled": Object.freeze({ type: "prepared-pan", quantity: 1, unit: "each", recipeName: "Cornbread", canonicalName: "Cornbread", canonicalKey: "bread.cornbread", preparation: "baked, cooled, crumbled", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "One prepared 9 × 13-inch pan cornbread or ingredients to make one" }),
  "SD-002|Onion, chopped": Object.freeze({ type: "sized-onion-volume", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", shoppingEquivalent: "About 1 medium onion" }),
  "SD-004|Fresh green beans or 4 cups frozen green beans": Object.freeze({ type: "fresh-or-frozen-produce-alternative", recipeName: "Fresh or frozen green beans", canonicalName: "Green Beans", canonicalKey: "produce.green-beans", shoppingQuantity: 1, shoppingUnit: "pound", shoppingEquivalent: "1 pound fresh green beans or 4 cups frozen green beans", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "produce.green-beans.fresh", canonicalName: "Fresh Green Beans", recipeName: "Fresh green beans", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "frozen.green-beans", canonicalName: "Frozen Green Beans", recipeName: "Frozen green beans", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "SD-005|Fresh broccoli or 1 lb frozen broccoli": Object.freeze({ type: "fresh-or-frozen-produce-alternative", recipeName: "Fresh or frozen broccoli", canonicalName: "Broccoli", canonicalKey: "produce.broccoli", shoppingQuantity: 2, shoppingUnit: "pound", shoppingEquivalent: "2 pounds fresh broccoli or 1 pound frozen broccoli", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "produce.broccoli.fresh", canonicalName: "Fresh Broccoli", recipeName: "Fresh broccoli", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "frozen.broccoli", canonicalName: "Frozen Broccoli", recipeName: "Frozen broccoli", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "SD-008|Frozen corn or 1 lb fresh corn": Object.freeze({ type: "fresh-or-frozen-produce-alternative", recipeName: "Frozen or fresh corn", canonicalName: "Corn", canonicalKey: "produce.corn", shoppingQuantity: 4, shoppingUnit: "cup", shoppingEquivalent: "4 cups frozen corn or 1 pound fresh corn", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "frozen.corn", canonicalName: "Frozen Corn", recipeName: "Frozen corn", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "produce.corn.fresh", canonicalName: "Fresh Corn", recipeName: "Fresh corn", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "SD-009|Red bell pepper, sliced": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Red bell pepper", canonicalName: "Red Bell Pepper", canonicalKey: "produce.pepper.bell.red", shoppingEquivalent: "About 1 red bell pepper" }),
  "SD-010|Green onions, sliced": Object.freeze({ type: "prepared-produce-volume", quantity: 0.25, unit: "cup", recipeName: "Green onions", canonicalName: "Green Onion", canonicalKey: "produce.onion.green", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 green onions" }),
  "SD-016|Green bell pepper, chopped": Object.freeze({ type: "prepared-produce-volume", quantity: 0.5, unit: "cup", recipeName: "Green bell pepper", canonicalName: "Green Bell Pepper", canonicalKey: "produce.pepper.bell.green", shoppingEquivalent: "About 1 small green bell pepper" }),
  "SD-020|Butter or olive oil, optional": Object.freeze({ type: "unmeasured-optional-ingredient" }),
  "SD-021|Red bell pepper, chopped": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Red bell pepper", canonicalName: "Red Bell Pepper", canonicalKey: "produce.pepper.bell.red", shoppingEquivalent: "About 1 red bell pepper" }),
  "SD-021|Green bell pepper, chopped": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Green bell pepper", canonicalName: "Green Bell Pepper", canonicalKey: "produce.pepper.bell.green", shoppingEquivalent: "About 1 green bell pepper" }),
  "SD-021|Zucchini, chopped": Object.freeze({ type: "prepared-produce-volume", quantity: 1.5, unit: "cup", recipeName: "Zucchini", canonicalName: "Zucchini", canonicalKey: "produce.zucchini", shoppingEquivalent: "About 1 zucchini" }),
  "SD-023|Paprika, optional": Object.freeze({ type: "unmeasured-optional-ingredient" }),
  "SD-024|Onion, chopped": Object.freeze({ type: "sized-onion-volume", quantity: 0.25, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", shoppingEquivalent: "About 1/2 small onion" }),
  "SD-026|Corn": Object.freeze({ type: "whole-produce", quantity: 6, unit: "ear", shoppingQuantity: 6, shoppingUnit: "ear", shoppingEquivalent: "Six ears corn" }),
  "SD-026|Water": Object.freeze({ type: "unmeasured-cooking-supply" }),
  "SD-027|Potatoes": Object.freeze({ type: "whole-produce", quantity: 6, unit: "each", shoppingQuantity: 6, shoppingUnit: "each", shoppingEquivalent: "Six medium potatoes" }),
  "SD-028|Sweet potato": Object.freeze({ type: "display-range", quantity: 7, unit: "ounce", recipeQuantityText: "6–8", shoppingQuantity: 7, shoppingUnit: "ounce", shoppingEquivalent: "One 6–8-ounce sweet potato" }),
  "SD-032|Oil for frying": Object.freeze({ type: "unmeasured-cooking-supply" }),
  "SD-033|Cabbage": Object.freeze({ type: "whole-produce", quantity: 1, unit: "head", shoppingQuantity: 1, shoppingUnit: "head", shoppingEquivalent: "One small head cabbage" }),
  "SD-036|Zucchini": Object.freeze({ type: "whole-produce", quantity: 2, unit: "each", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "Two zucchini" }),
  "SD-037|Fresh parsley, optional": Object.freeze({ type: "unmeasured-optional-ingredient" }),
  "SD-038|Carrot, chopped": Object.freeze({ type: "prepared-produce-volume", quantity: 0.5, unit: "cup", recipeName: "Carrot", canonicalName: "Carrot", canonicalKey: "produce.carrot", shoppingEquivalent: "About 1 carrot" }),
  "SD-039|Red bell pepper": Object.freeze({ type: "whole-produce", quantity: 1, unit: "each", shoppingEquivalent: "One red bell pepper" }),
  "SD-039|Zucchini": Object.freeze({ type: "whole-produce", quantity: 1, unit: "each", shoppingEquivalent: "One zucchini" }),
  "SD-039|Red onion": Object.freeze({ type: "whole-produce", quantity: 1, unit: "each", shoppingEquivalent: "One red onion" }),
  "SD-041|Potatoes": Object.freeze({ type: "whole-produce", quantity: 2, unit: "each", shoppingEquivalent: "Two large potatoes" }),
  "SD-042|Frozen crinkle-cut fries": Object.freeze({ type: "display-range", quantity: 30, unit: "ounce", recipeQuantityText: "28–32", shoppingQuantity: 30, shoppingUnit: "ounce", shoppingEquivalent: "One 28–32-ounce bag frozen crinkle-cut fries" }),
  "SD-043|Frozen waffle fries": Object.freeze({ type: "display-range", quantity: 24, unit: "ounce", recipeQuantityText: "20–28", shoppingQuantity: 24, shoppingUnit: "ounce", shoppingEquivalent: "One 20–28-ounce bag frozen waffle fries" }),
  "SD-044|Frozen shoestring fries": Object.freeze({ type: "display-range", quantity: 26, unit: "ounce", recipeQuantityText: "20–32", shoppingQuantity: 26, shoppingUnit: "ounce", shoppingEquivalent: "One 20–32-ounce bag frozen shoestring fries" }),
  "SD-045|Sweet potatoes": Object.freeze({ type: "whole-produce-weight", quantity: 1, unit: "pound", shoppingQuantity: 1, shoppingUnit: "pound", shoppingEquivalent: "About 2 large sweet potatoes" }),
  "SD-046|Frozen tater tots": Object.freeze({ type: "display-range", quantity: 30, unit: "ounce", recipeQuantityText: "28–32", shoppingQuantity: 30, shoppingUnit: "ounce", shoppingEquivalent: "One 28–32-ounce bag frozen tater tots" }),
  "SD-047|Mixed greens or head lettuce": Object.freeze({ type: "display-range", quantity: 7.5, unit: "ounce", recipeQuantityText: "5–10", shoppingQuantity: 7.5, shoppingUnit: "ounce", shoppingEquivalent: "About 5–10 ounces mixed greens or head lettuce" }),
  "SD-047|Dressing of choice": Object.freeze({ type: "unmeasured-serving-suggestion" }),
});

export const SD_001_052_REVIEW_FLAGS = Object.freeze({});

const HB_80_20_RECIPES = Array.from({ length: 30 }, (_, index) => `HB-${String(index + 1).padStart(3, "0")}`);
const HBP_90_10_RECIPES = Array.from({ length: 11 }, (_, index) => `HBP-${String(index + 1).padStart(3, "0")}`);
const HB_EIGHT_SLICE_BACON_RECIPES = ["HB-007", "HB-008", "HB-009", "HB-010", "HB-014", "HB-018", "HB-024", "HB-025", "HB-026", "HB-028"];

export const HB_HBP_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(HB_80_20_RECIPES.map((recipeId) => [`${recipeId}|Ground beef, 80/20`, Object.freeze({ type: "ground-beef-fat-ratio", recipeName: "Ground beef, 80/20", canonicalName: "Beef - Ground 80/20", canonicalKey: "meat.beef.ground.80-20" })])),
  ...Object.fromEntries(HBP_90_10_RECIPES.map((recipeId) => [`${recipeId}|Ground beef, 90/10`, Object.freeze({ type: "ground-beef-fat-ratio", recipeName: "Ground beef, 90/10", canonicalName: "Beef - Ground 90/10", canonicalKey: "meat.beef.ground.90-10" })])),
  ...Object.fromEntries(HB_EIGHT_SLICE_BACON_RECIPES.map((recipeId) => [`${recipeId}|Bacon, cooked`, Object.freeze({ type: "cooked-bacon-slices", quantity: 8, unit: "slice", recipeName: "Bacon", canonicalName: "Pork - Bacon - Sliced", canonicalKey: "meat.pork.bacon", preparation: "cooked", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces raw sliced bacon", approximate: true })])),
  "HB-003|Thin onion slices": Object.freeze({ type: "prepared-produce-volume", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "thinly sliced" }),
  "HB-004|Grilled onions": Object.freeze({ type: "prepared-produce-volume", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "grilled" }),
  "HB-004|Ketchup": Object.freeze({ type: "unmeasured-serving-suggestion" }),
  "HB-004|Yellow mustard": Object.freeze({ type: "unmeasured-serving-suggestion" }),
  "HB-004|Mayonnaise": Object.freeze({ type: "unmeasured-serving-suggestion" }),
  "HB-012|Pepperoni": Object.freeze({ type: "meat-slices-with-shopping-weight", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About one 4-ounce package sliced pepperoni", approximate: true }),
  "HB-013|Crispy bacon bits": Object.freeze({ type: "prepared-bacon-volume", recipeName: "Bacon bits", canonicalName: "Bacon Bits", canonicalKey: "meat.pork.bacon.bits", preparation: "crispy", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About one 4-ounce package prepared bacon bits", approximate: true }),
  "HB-022|Grilled onions": Object.freeze({ type: "prepared-produce-volume", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "grilled" }),
  "HB-031|Ground beef for Lipsey-style chili sauce": Object.freeze({ type: "ground-beef-default-ratio", recipeName: "Ground beef", canonicalName: "Beef - Ground 90/10", canonicalKey: "meat.beef.ground.90-10", preparation: "for Lipsey-style chili sauce" }),
  "HB-031|Small onion, finely minced for Lipsey-style chili sauce": Object.freeze({ type: "sized-onion-volume", quantity: 0.5, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "finely minced for Lipsey-style chili sauce", shoppingEquivalent: "About 1 small onion", inventoryCategory: "Fresh Produce", inventorySubcategory: "Vegetables", inventoryKind: "Onion" }),
  "HB-031|Ground beef, 80/20 for burger patties": Object.freeze({ type: "ground-beef-fat-ratio", recipeName: "Ground beef, 80/20", canonicalName: "Beef - Ground 80/20", canonicalKey: "meat.beef.ground.80-20", preparation: "for burger patties" }),
  "HB-031|Soft hamburger bun": Object.freeze({ type: "per-burger-item", quantity: 1, unit: "each", recipeName: "Soft hamburger bun", canonicalName: "Hamburger Buns", canonicalKey: "bread.buns.hamburger", preparation: "per burger", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "One bun per burger" }),
  "HB-031|Yellow mustard": Object.freeze({ type: "unmeasured-serving-suggestion", preparation: "per burger" }),
  "HB-031|Diced onions": Object.freeze({ type: "unmeasured-serving-suggestion", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "diced, per burger" }),
  "HB-031|Dill pickle slices": Object.freeze({ type: "unmeasured-serving-suggestion", preparation: "per burger" }),
  "HBP-005|Finely minced onion": Object.freeze({ type: "prepared-produce-volume", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "finely minced" }),
  "HBP-007|Bacon, cooked crisp and finely chopped": Object.freeze({ type: "cooked-bacon-slices", recipeName: "Bacon", canonicalName: "Pork - Bacon - Sliced", canonicalKey: "meat.pork.bacon", preparation: "cooked crisp, finely chopped", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About 4 ounces raw sliced bacon", approximate: true }),
  "HBP-008|Finely diced pickled jalapeños, drained": Object.freeze({ type: "prepared-produce-volume", recipeName: "Pickled jalapeños", canonicalName: "Pickled Jalapeños", canonicalKey: "condiment.pepper.jalapeno.pickled", preparation: "finely diced, drained" }),
  "HBP-010|Finely crushed tortilla chips": Object.freeze({ type: "prepared-snack-volume", recipeName: "Tortilla chips", canonicalName: "Tortilla Chips", canonicalKey: "snacks.chips.tortilla", preparation: "finely crushed" }),
  "HBP-012|Ground beef": Object.freeze({ type: "ground-beef-default-ratio", recipeName: "Ground beef", canonicalName: "Beef - Ground 90/10", canonicalKey: "meat.beef.ground.90-10" }),
  "HBP-012|Small onions, finely minced": Object.freeze({ type: "sized-onion-volume", quantity: 1, unit: "cup", recipeName: "Onions", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "finely minced", shoppingEquivalent: "About 2 small onions" }),
});

export const HB_HBP_REVIEW_FLAGS = Object.freeze({});

const LF_YEAST_RECIPES = Array.from({ length: 12 }, (_, index) => `LF-${String(index + 1).padStart(3, "0")}`);
const LF_WARM_WATER_RECIPES = ["LF-001", "LF-002", "LF-004", "LF-005", "LF-006", "LF-007", "LF-008", "LF-009", "LF-010", "LF-011", "LF-012"];
const LF_SOURDOUGH_RECIPES = ["LF-013", "LF-014", "LF-015"];

export const LF_001_015_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(LF_YEAST_RECIPES.map((recipeId) => [`${recipeId}|Active dry yeast`, Object.freeze({ type: "packet-equivalent", shoppingEquivalent: "One packet active dry yeast" })])),
  ...Object.fromEntries(LF_WARM_WATER_RECIPES.map((recipeId) => [`${recipeId}|Warm water (105-110°F)`, Object.freeze({ type: "temperature-separated", recipeName: "Water", canonicalName: "Water", canonicalKey: "beverage.water", preparation: "warm (105–110°F)" })])),
  ...Object.fromEntries(LF_SOURDOUGH_RECIPES.map((recipeId) => [`${recipeId}|Water, room temperature`, Object.freeze({ type: "temperature-separated", recipeName: "Water", canonicalName: "Water", canonicalKey: "beverage.water", preparation: "room temperature" })])),
  ...Object.fromEntries(LF_SOURDOUGH_RECIPES.map((recipeId) => [`${recipeId}|Active sourdough starter, fed and bubbly`, Object.freeze({ type: "preparation-separated", recipeName: "Active sourdough starter", canonicalName: "Sourdough Starter", canonicalKey: "baking.sourdough-starter", preparation: "fed and bubbly" })])),
  "LF-003|Buttermilk, room temperature": Object.freeze({ type: "temperature-separated", recipeName: "Buttermilk", canonicalName: "Buttermilk — Cultured", canonicalKey: "base-dairy-eggs-milk-buttermilk-cultured", preparation: "room temperature" }),
  "LF-006|Jalapeños": Object.freeze({ type: "display-range", quantity: 2.5, unit: "each", recipeQuantityText: "2–3", recipeName: "Jalapeños", canonicalName: "Jalapeño Pepper", canonicalKey: "produce.pepper.jalapeno", preparation: "seeded and finely diced; or to taste", shoppingQuantity: 2.5, shoppingUnit: "each", shoppingEquivalent: "About 2–3 jalapeños", approximate: true }),
  "LF-007|Garlic": Object.freeze({ type: "unequal-measure-alternatives", quantity: 2, unit: "clove", recipeName: "Garlic or garlic powder", canonicalName: "Garlic or Garlic Powder", canonicalKey: "choice.garlic-fresh.garlic-powder", preparation: "fresh garlic minced", shoppingQuantity: 2, shoppingUnit: "clove", shoppingEquivalent: "2 cloves fresh garlic or 1 teaspoon garlic powder", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "produce.garlic", canonicalName: "Garlic", recipeName: "Fresh garlic", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "spice.garlic-powder", canonicalName: "Garlic Powder", recipeName: "Garlic powder", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "LF-008|Finely chopped onions, sautéed until soft and cooled": Object.freeze({ type: "prepared-produce-volume", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "finely chopped, sautéed until soft, cooled", shoppingEquivalent: "About 1 medium onion" }),
  "LF-008|Sliced black olives, drained and chopped": Object.freeze({ type: "prepared-produce-volume", recipeName: "Black olives", canonicalName: "Black Olives", canonicalKey: "pantry.olives.black", preparation: "sliced, drained, chopped" }),
  "LF-008|Dried minced onion": Object.freeze({ type: "optional-ingredient", recipeName: "Dried minced onion", canonicalName: "Dried Minced Onion", canonicalKey: "spice.onion.dried-minced" }),
  "LF-009|Parsley": Object.freeze({ type: "unequal-measure-alternatives", quantity: 2, unit: "tablespoon", recipeName: "Fresh or dried parsley", canonicalName: "Parsley", canonicalKey: "choice.parsley.fresh-dried", preparation: "fresh parsley chopped", shoppingQuantity: 2, shoppingUnit: "tablespoon", shoppingEquivalent: "2 tablespoons fresh parsley or 1 teaspoon dried parsley", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "produce.herb.parsley", canonicalName: "Fresh Parsley", recipeName: "Fresh parsley", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "spice.parsley.dried", canonicalName: "Dried Parsley", recipeName: "Dried parsley", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "LF-011|Water for boiling": Object.freeze({ type: "purpose-specific", recipeName: "Water", canonicalName: "Water", canonicalKey: "beverage.water", preparation: "for boiling" }),
  "LF-011|Water": Object.freeze({ type: "purpose-specific", recipeName: "Water", canonicalName: "Water", canonicalKey: "beverage.water", preparation: "for egg wash" }),
  "LF-011|Coarse pretzel salt": Object.freeze({ type: "unmeasured-cooking-supply", preparation: "for topping", inventoryCategory: "Pantry/Canned", inventorySubcategory: "Staples" }),
});

export const LF_001_015_REVIEW_FLAGS = Object.freeze({});

export const INGREDIENT_STANDARD_VERSION = "1.14";
