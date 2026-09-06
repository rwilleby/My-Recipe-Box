// Site-wide ingredient data rules. Recipe-card source text remains preserved in
// originalName/originalUnit while audited recipe rows expose normalized fields.

export const STANDARD_COOKING_UNITS = Object.freeze([
  "pound", "ounce", "cup", "tablespoon", "teaspoon", "each", "clove",
  "slice", "stalk", "sprig", "leaf", "pinch", "ear", "head", "rib", "quart", "can", "jar", "box", "package", "packet", "sleeve", "container",
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

const PM_VANILLA_PROTEIN_RECIPES = ["PM-001", "PM-002", "PM-003", "PM-005", "PM-006", "PM-007", "PM-008", "PM-009", "PM-010", "PM-011", "PM-012", "PM-013", "PM-014"];
const PM_GREEK_YOGURT_RECIPES = ["PM-005", "PM-006", "PM-007", "PM-008"];
const PM_PLAIN_GREEK_YOGURT_RECIPES = ["PM-010", "PM-013"];
const PM_PLAIN_OR_VANILLA_YOGURT_RECIPES = ["PM-011", "PM-012", "PM-014"];

const PM_GREEK_YOGURT_FLAVORS = Object.freeze([
  Object.freeze({ canonicalKey: "dairy.yogurt.greek.plain", canonicalName: "Greek Yogurt — Plain", recipeName: "Plain Greek yogurt", masterItemId: "", matchStatus: "approved-alternative" }),
  Object.freeze({ canonicalKey: "dairy.yogurt.greek.vanilla", canonicalName: "Greek Yogurt — Vanilla", recipeName: "Vanilla Greek yogurt", masterItemId: "", matchStatus: "approved-alternative" }),
]);

export const PM_001_014_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(PM_VANILLA_PROTEIN_RECIPES.map((recipeId) => [`${recipeId}|Vanilla protein powder`, Object.freeze({ type: "protein-powder-flavor", recipeName: "Vanilla protein powder", canonicalName: "Protein Powder — Vanilla", canonicalKey: "pantry.protein-powder.vanilla" })])),
  "PM-004|Chocolate protein powder": Object.freeze({ type: "protein-powder-flavor", recipeName: "Chocolate protein powder", canonicalName: "Protein Powder — Chocolate", canonicalKey: "pantry.protein-powder.chocolate" }),
  "PM-001|Rolled oats": Object.freeze({ type: "oat-equivalence", canonicalName: "Oats — Rolled/Old-Fashioned", canonicalKey: "grain.oats.rolled" }),
  ...Object.fromEntries(Array.from({ length: 10 }, (_, index) => `PM-${String(index + 2).padStart(3, "0")}`).concat(["PM-013", "PM-014"]).map((recipeId) => [`${recipeId}|Rolled oats`, Object.freeze({ type: "oat-equivalence", canonicalName: "Oats — Rolled/Old-Fashioned", canonicalKey: "grain.oats.rolled" })])),
  "PM-012|Old-fashioned oats": Object.freeze({ type: "oat-equivalence", canonicalName: "Oats — Rolled/Old-Fashioned", canonicalKey: "grain.oats.rolled" }),
  "PM-001|Finely diced apple (about 1 medium apple)": Object.freeze({ type: "prepared-produce-volume", recipeName: "Apple", canonicalName: "Apple", canonicalKey: "produce.apple", preparation: "finely diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium apple" }),
  "PM-013|Finely diced apple": Object.freeze({ type: "prepared-produce-volume", recipeName: "Apple", canonicalName: "Apple", canonicalKey: "produce.apple", preparation: "finely diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium apple" }),
  "PM-014|Finely shredded carrots": Object.freeze({ type: "prepared-produce-volume", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "finely shredded", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 medium carrots", approximate: true }),
  "PM-002|Fresh or frozen blueberries": Object.freeze({ type: "fresh-or-frozen-fruit", recipeName: "Fresh or frozen blueberries", canonicalName: "Blueberries", canonicalKey: "fruit.blueberry", shoppingName: "Blueberries", shoppingEquivalent: "1 cup fresh or frozen blueberries", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "produce.blueberry.fresh", canonicalName: "Fresh Blueberries", recipeName: "Fresh blueberries", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "frozen.blueberry", canonicalName: "Frozen Blueberries", recipeName: "Frozen blueberries", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "PM-008|Fresh or frozen raspberries": Object.freeze({ type: "fresh-or-frozen-fruit", recipeName: "Fresh or frozen raspberries", canonicalName: "Raspberries", canonicalKey: "fruit.raspberry", shoppingName: "Raspberries", shoppingEquivalent: "1 cup fresh or frozen raspberries", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "produce.raspberry.fresh", canonicalName: "Fresh Raspberries", recipeName: "Fresh raspberries", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "frozen.raspberry", canonicalName: "Frozen Raspberries", recipeName: "Frozen raspberries", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "PM-009|Dried cranberries or fresh cranberries": Object.freeze({ type: "dried-or-fresh-fruit", recipeName: "Dried or fresh cranberries", canonicalName: "Cranberries", canonicalKey: "choice.cranberry.dried-fresh", shoppingName: "Cranberries", shoppingEquivalent: "3/4 cup dried or fresh cranberries", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "pantry.cranberry.dried", canonicalName: "Dried Cranberries", recipeName: "Dried cranberries", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "produce.cranberry.fresh", canonicalName: "Fresh Cranberries", recipeName: "Fresh cranberries", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "PM-005|Lemon zest": Object.freeze({ type: "whole-fruit-zest", quantity: 2, unit: "each", recipeQuantityText: "Zest of 2 lemons", recipeQuantityIncludesUnit: true, recipeName: "Lemon zest", canonicalName: "Lemon", canonicalKey: "produce.lemon", preparation: "zested", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "2 lemons" }),
  "PM-009|Orange zest": Object.freeze({ type: "whole-fruit-zest", quantity: 1, unit: "each", recipeQuantityText: "Zest of 1 orange", recipeQuantityIncludesUnit: true, recipeName: "Orange zest", canonicalName: "Orange", canonicalKey: "produce.orange", preparation: "zested", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "1 orange", inventoryCategory: "Fresh Produce", inventorySubcategory: "Fruits", inventoryKind: "Orange" }),
  ...Object.fromEntries(PM_GREEK_YOGURT_RECIPES.map((recipeId) => [`${recipeId}|Greek yogurt`, Object.freeze({ type: "greek-yogurt-equivalence", canonicalName: "Greek Yogurt", canonicalKey: "dairy.yogurt.greek" })])),
  ...Object.fromEntries(PM_PLAIN_GREEK_YOGURT_RECIPES.map((recipeId) => [`${recipeId}|Plain Greek yogurt`, Object.freeze({ type: "greek-yogurt-equivalence", canonicalName: "Greek Yogurt", canonicalKey: "dairy.yogurt.greek", preparation: "plain" })])),
  ...Object.fromEntries(PM_PLAIN_OR_VANILLA_YOGURT_RECIPES.map((recipeId) => [`${recipeId}|Plain or vanilla Greek yogurt`, Object.freeze({ type: "greek-yogurt-flavor-choice", recipeName: "Plain or vanilla Greek yogurt", canonicalName: "Greek Yogurt", canonicalKey: "dairy.yogurt.greek", shoppingName: "Greek Yogurt", acceptableAlternatives: PM_GREEK_YOGURT_FLAVORS })])),
  ...Object.fromEntries(["PM-002", "PM-003", "PM-004"].map((recipeId) => [`${recipeId}|Greek yogurt, plain or vanilla`, Object.freeze({ type: "greek-yogurt-flavor-choice", recipeName: "Plain or vanilla Greek yogurt", canonicalName: "Greek Yogurt", canonicalKey: "dairy.yogurt.greek", shoppingName: "Greek Yogurt", acceptableAlternatives: PM_GREEK_YOGURT_FLAVORS })])),
  "PM-006|Milk": Object.freeze({ type: "optional-ingredient", quantity: 2, unit: "tablespoon", preparation: "if needed" }),
  "PM-012|Milk of choice": Object.freeze({ type: "ingredient-choice", recipeName: "Milk of choice", canonicalName: "Milk", canonicalKey: "dairy.milk" }),
});

export const PM_001_014_REVIEW_FLAGS = Object.freeze({});

const KR_RECIPE_IDS = Array.from({ length: 7 }, (_, index) => `KR-${String(index + 1).padStart(3, "0")}`);

export const KR_001_007_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(KR_RECIPE_IDS.map((recipeId) => [`${recipeId}|Refrigerated crescent roll dough`, Object.freeze({
    type: "package-count-with-size",
    quantity: 2,
    unit: "can",
    recipeName: "Refrigerated crescent roll dough",
    canonicalName: "Crescent Roll Dough",
    canonicalKey: "bread.refrigerated-dough.crescent-roll",
    shoppingQuantity: 2,
    shoppingUnit: "can",
    shoppingEquivalent: "Two 8-ounce cans refrigerated crescent roll dough",
  })])),
  ...Object.fromEntries(KR_RECIPE_IDS.map((recipeId) => [`${recipeId}|All-purpose flour`, Object.freeze({
    type: "purpose-specific",
    recipeName: "All-purpose flour",
    canonicalName: "All-Purpose Flour",
    canonicalKey: "pantry.flour.all-purpose",
    preparation: "for rolling",
  })])),
  ...Object.fromEntries(["KR-001", "KR-004"].map((recipeId) => [`${recipeId}|Breakfast sausage`, Object.freeze({
    type: "sausage-weight",
    recipeName: "Breakfast sausage",
    canonicalName: "Sausage - Breakfast",
    canonicalKey: "meat.sausage.breakfast",
  })])),
  "KR-002|Diced cooked ham": Object.freeze({ type: "approved-source-volume", recipeName: "Ham", canonicalName: "Pork - Ham - Diced", canonicalKey: "meat.pork.ham.diced", preparation: "diced and cooked", shoppingEquivalent: "1 cup diced cooked ham; weight varies by cut and dice", approximate: true }),
  "KR-003|Bacon, cooked crisp and crumbled": Object.freeze({ type: "approved-source-slice-count", quantity: 6, unit: "slice", recipeName: "Bacon", canonicalName: "Pork - Bacon - Sliced", canonicalKey: "meat.pork.bacon", preparation: "cooked crisp and crumbled", shoppingQuantity: 6, shoppingUnit: "slice", shoppingEquivalent: "6 slices bacon; package weight varies", approximate: true }),
  ...Object.fromEntries(["KR-003", "KR-004"].map((recipeId) => [`${recipeId}|Large eggs`, Object.freeze({ type: "whole-item", recipeName: "Large eggs", canonicalName: "Eggs - Large", canonicalKey: "dairy.eggs.large" })])),
  "KR-005|Boudin, casing removed": Object.freeze({ type: "sausage-weight", recipeName: "Boudin", canonicalName: "Sausage - Boudin", canonicalKey: "meat.sausage.boudin", preparation: "casing removed" }),
  "KR-005|Cooked rice": Object.freeze({ type: "prepared-grain-volume", recipeName: "Rice", canonicalName: "Rice", canonicalKey: "grain.rice", preparation: "cooked" }),
  "KR-005|Chopped green onions": Object.freeze({ type: "prepared-produce-volume", recipeName: "Green onions", canonicalName: "Green Onion", canonicalKey: "produce.onion.green", preparation: "chopped" }),
  "KR-006|Frozen chicken nuggets, fully cooked": Object.freeze({ type: "display-range", quantity: 13.5, unit: "each", recipeQuantityText: "12–15", recipeName: "Frozen chicken nuggets", canonicalName: "Chicken - Nuggets - Frozen", canonicalKey: "frozen.chicken.nuggets", preparation: "fully cooked", shoppingQuantity: 13.5, shoppingUnit: "each", shoppingEquivalent: "12–15 frozen chicken nuggets; bag size varies", approximate: true }),
  "KR-006|Honey mustard or favorite sauce": Object.freeze({ type: "optional-ingredient", recipeName: "Honey mustard or favorite dipping sauce", canonicalName: "Dipping Sauce", canonicalKey: "condiment.dipping-sauce", shoppingName: "Dipping Sauce", shoppingEquivalent: "1/4 cup honey mustard or favorite dipping sauce", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "condiment.mustard.honey", canonicalName: "Honey Mustard", recipeName: "Honey mustard", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "condiment.dipping-sauce.choice", canonicalName: "Favorite Dipping Sauce", recipeName: "Favorite dipping sauce", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "KR-007|Mini smoked sausages (cocktail wieners)": Object.freeze({ type: "whole-item", recipeName: "Mini smoked sausages (cocktail wieners)", canonicalName: "Sausage - Cocktail", canonicalKey: "meat.sausage.cocktail" }),
  ...Object.fromEntries(["KR-003", "KR-004"].flatMap((recipeId) => ["Salt", "Black pepper"].map((name) => [`${recipeId}|${name}`, Object.freeze({ type: "unmeasured-cooking-supply", quantity: null, unit: "", preparation: "to taste" })]))),
});

export const KR_001_007_REVIEW_FLAGS = Object.freeze({});

const CC_RECIPE_IDS = Array.from({ length: 6 }, (_, index) => `CC-${String(index + 1).padStart(3, "0")}`);

export const CC_001_006_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(["CC-001", "CC-002", "CC-004", "CC-006"].map((recipeId) => [`${recipeId}|Graham crackers`, Object.freeze({ type: "whole-item", quantity: 12, unit: "each", recipeName: "Graham cracker squares", canonicalName: "Graham Crackers", canonicalKey: "snack.cracker.graham", preparation: ["CC-001", "CC-002"].includes(recipeId) ? "finely crushed" : "" })])),
  ...Object.fromEntries(CC_RECIPE_IDS.map((recipeId) => [`${recipeId}|Large eggs`, Object.freeze({ type: "whole-item", recipeName: "Large eggs", canonicalName: "Eggs - Large", canonicalKey: "dairy.eggs.large" })])),
  ...Object.fromEntries(CC_RECIPE_IDS.map((recipeId) => [`${recipeId}|Cream cheese, softened`, Object.freeze({ type: "soft-cheese-weight", recipeName: "Cream cheese", canonicalName: "Cheese - Cream", canonicalKey: "dairy.cheese.cream", preparation: "softened", shoppingQuantity: recipeId === "CC-001" || recipeId === "CC-002" ? 16 : 16, shoppingUnit: "ounce", shoppingEquivalent: recipeId === "CC-001" || recipeId === "CC-002" ? "Two 8-ounce packages" : "Two 8-ounce packages; 4 ounces remain" })])),
  ...Object.fromEntries(CC_RECIPE_IDS.map((recipeId) => [`${recipeId}|Butter, melted`, Object.freeze({ type: "preparation-separated", recipeName: "Butter", canonicalName: "Butter", canonicalKey: "dairy.butter", preparation: "melted" })])),
  ...Object.fromEntries(["CC-003", "CC-004", "CC-005", "CC-006"].map((recipeId) => [`${recipeId}|Melted butter`, Object.freeze({ type: "preparation-separated", recipeName: "Butter", canonicalName: "Butter", canonicalKey: "dairy.butter", preparation: "melted" })])),
  "CC-003|Oreo cookies, crushed": Object.freeze({ type: "whole-item", recipeName: "Oreo cookies", canonicalName: "Oreo Cookies", canonicalKey: "snack.cookie.oreo", preparation: "crushed" }),
  "CC-003|Finely chopped Oreo cookies": Object.freeze({ type: "prepared-cookie-volume", recipeName: "Oreo cookies", canonicalName: "Oreo Cookies", canonicalKey: "snack.cookie.oreo", preparation: "finely chopped for filling" }),
  "CC-005|Chocolate wafer cookies, crushed": Object.freeze({ type: "whole-item", recipeName: "Chocolate wafer cookies", canonicalName: "Chocolate Wafer Cookies", canonicalKey: "snack.cookie.chocolate-wafer", preparation: "crushed" }),
  "CC-002|Salted caramel sauce, divided": Object.freeze({ type: "purpose-specific", recipeName: "Salted caramel sauce", canonicalName: "Salted Caramel Sauce", canonicalKey: "condiment.sauce.salted-caramel", preparation: "divided between filling and topping" }),
  "CC-004|Strawberry jam": Object.freeze({ type: "purpose-specific", preparation: "for swirl" }),
  "CC-005|Semisweet chocolate chips": Object.freeze({ type: "purpose-specific", preparation: "for chocolate swirl" }),
  "CC-005|Heavy cream": Object.freeze({ type: "purpose-specific", preparation: "for chocolate swirl" }),
  "CC-006|Blueberry pie filling": Object.freeze({ type: "purpose-specific", preparation: "for topping" }),
  "CC-006|Lemon juice": Object.freeze({ type: "purpose-specific", preparation: "for topping" }),
});

export const CC_001_006_REVIEW_FLAGS = Object.freeze({});

const CO_RECIPE_IDS = Array.from({ length: 6 }, (_, index) => `CO-${String(index + 1).padStart(3, "0")}`);
const CO_COMPONENT_RESOLUTIONS = Object.freeze({
  "Granulated sugar for filling": Object.freeze({ type: "purpose-specific", recipeName: "Granulated sugar", canonicalName: "Granulated Sugar", canonicalKey: "pantry.sugar.granulated", preparation: "for filling" }),
  "Granulated sugar for batter/topping": Object.freeze({ type: "purpose-specific", recipeName: "Granulated sugar", canonicalName: "Granulated Sugar", canonicalKey: "pantry.sugar.granulated", preparation: "for batter/topping" }),
  "All-purpose flour for filling": Object.freeze({ type: "purpose-specific", recipeName: "All-purpose flour", canonicalName: "All-Purpose Flour", canonicalKey: "pantry.flour.all-purpose", preparation: "for filling" }),
  "All-purpose flour for batter/topping": Object.freeze({ type: "purpose-specific", recipeName: "All-purpose flour", canonicalName: "All-Purpose Flour", canonicalKey: "pantry.flour.all-purpose", preparation: "for batter/topping" }),
});

export const CO_001_006_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(CO_RECIPE_IDS.flatMap((recipeId) => Object.entries(CO_COMPONENT_RESOLUTIONS).map(([name, resolution]) => [`${recipeId}|${name}`, resolution]))),
  ...Object.fromEntries(CO_RECIPE_IDS.map((recipeId) => [`${recipeId}|Brown sugar`, Object.freeze({ type: "preparation-separated", recipeName: "Brown sugar", canonicalName: "Brown Sugar", canonicalKey: "pantry.sugar.brown", preparation: "packed" })])),
  ...Object.fromEntries(CO_RECIPE_IDS.map((recipeId) => [`${recipeId}|Unsalted butter, melted`, Object.freeze({ type: "volume-with-shopping-equivalent", quantity: 0.5, unit: "cup", recipeQuantityText: "1/2 cup (1 stick)", recipeQuantityIncludesUnit: true, recipeName: "Unsalted butter", canonicalName: "Butter - Unsalted", canonicalKey: "dairy.butter.unsalted", preparation: "melted", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "1 stick unsalted butter" })])),
  "CO-001|Peeled, sliced apples": Object.freeze({ type: "prepared-fruit-volume", recipeName: "Apples", canonicalName: "Apple", canonicalKey: "produce.apple", preparation: "peeled and sliced", shoppingQuantity: 6, shoppingUnit: "each", shoppingEquivalent: "About 6 medium apples", approximate: true }),
  "CO-002|Fresh or frozen blackberries": Object.freeze({ type: "fresh-or-frozen-fruit", recipeName: "Fresh or frozen blackberries", canonicalName: "Blackberries", canonicalKey: "fruit.blackberry", shoppingEquivalent: "About three pint containers fresh, or enough frozen for 6 cups", approximate: true }),
  "CO-003|Fresh or frozen blueberries": Object.freeze({ type: "fresh-or-frozen-fruit", recipeName: "Fresh or frozen blueberries", canonicalName: "Blueberries", canonicalKey: "fruit.blueberry", shoppingEquivalent: "About three pint containers fresh, or enough frozen for 6 cups", approximate: true }),
  "CO-004|Pitted cherries, fresh or frozen": Object.freeze({ type: "fresh-or-frozen-fruit", recipeName: "Fresh or frozen cherries", canonicalName: "Cherries", canonicalKey: "fruit.cherry", preparation: "pitted", shoppingQuantity: 2, shoppingUnit: "pound", shoppingEquivalent: "About 2 pounds pitted cherries", approximate: true }),
  "CO-005|Sliced strawberries, fresh or frozen": Object.freeze({ type: "fresh-or-frozen-fruit", recipeName: "Fresh or frozen strawberries", canonicalName: "Strawberries", canonicalKey: "fruit.strawberry", preparation: "sliced", shoppingQuantity: 2.25, shoppingUnit: "pound", shoppingEquivalent: "About 2 1/4 pounds strawberries", approximate: true }),
  "CO-006|Sliced peaches, fresh or frozen": Object.freeze({ type: "fresh-or-frozen-fruit", recipeName: "Fresh or frozen peaches", canonicalName: "Peaches", canonicalKey: "fruit.peach", preparation: "sliced", shoppingQuantity: 6, shoppingUnit: "each", shoppingEquivalent: "About 6 medium peaches", approximate: true }),
});

export const CO_001_006_REVIEW_FLAGS = Object.freeze({});

const CR_FULL_DOUGH_IDS = ["CR-001", "CR-002", "CR-003", "CR-004"];

export const CR_001_005_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(CR_FULL_DOUGH_IDS.map((recipeId) => [`${recipeId}|Active dry yeast`, Object.freeze({ type: "packet-equivalent", quantity: 2.25, unit: "teaspoon", recipeQuantityText: "2 1/4 teaspoons (1 packet)", recipeQuantityIncludesUnit: true, shoppingQuantity: 1, shoppingUnit: "packet", shoppingEquivalent: "1 packet active dry yeast" })])),
  ...Object.fromEntries(CR_FULL_DOUGH_IDS.map((recipeId) => [`${recipeId}|Warm milk, 110°F`, Object.freeze({ type: "temperature-separated", recipeName: "Whole milk", canonicalName: "Milk - Whole", canonicalKey: "dairy.milk.whole", preparation: "warmed to 110°F for dough" })])),
  ...Object.fromEntries(CR_FULL_DOUGH_IDS.map((recipeId) => [`${recipeId}|Large eggs`, Object.freeze({ type: "whole-item", recipeName: "Large eggs", canonicalName: "Eggs - Large", canonicalKey: "dairy.eggs.large", preparation: "for dough" })])),
  ...Object.fromEntries(CR_FULL_DOUGH_IDS.map((recipeId) => [`${recipeId}|Unsalted butter, melted`, Object.freeze({ type: "volume-with-shopping-equivalent", recipeName: "Unsalted butter", canonicalName: "Butter - Unsalted", canonicalKey: "dairy.butter.unsalted", preparation: "melted for dough", shoppingEquivalent: "About 2/3 stick unsalted butter" })])),
  ...Object.fromEntries(CR_FULL_DOUGH_IDS.map((recipeId) => [`${recipeId}|Unsalted butter, softened`, Object.freeze({ type: "volume-with-shopping-equivalent", recipeName: "Unsalted butter", canonicalName: "Butter - Unsalted", canonicalKey: "dairy.butter.unsalted", preparation: "softened for filling", shoppingEquivalent: "About 2/3 stick unsalted butter" })])),
  ...Object.fromEntries(["CR-001", "CR-002", "CR-003", "CR-004", "CR-005"].map((recipeId) => [`${recipeId}|Brown sugar`, Object.freeze({ type: "preparation-separated", recipeName: "Brown sugar", canonicalName: "Brown Sugar", canonicalKey: "pantry.sugar.brown", preparation: "packed for filling" })])),
  ...Object.fromEntries(CR_FULL_DOUGH_IDS.map((recipeId) => [`${recipeId}|Powdered sugar`, Object.freeze({ type: "purpose-specific", preparation: "for glaze" })])),
  ...Object.fromEntries(CR_FULL_DOUGH_IDS.map((recipeId) => [`${recipeId}|Milk`, Object.freeze({ type: "display-range", quantity: 2.5, unit: "tablespoon", recipeQuantityText: "2–3", recipeName: "Milk", canonicalName: "Milk", canonicalKey: "dairy.milk", preparation: "as needed for glaze", shoppingQuantity: 2.5, shoppingUnit: "tablespoon", shoppingEquivalent: "2–3 tablespoons milk" })])),
  ...Object.fromEntries(CR_FULL_DOUGH_IDS.map((recipeId) => [`${recipeId}|Vanilla extract`, Object.freeze({ type: "purpose-specific", preparation: "for glaze" })])),
  "CR-002|Unsweetened cocoa powder for dough": Object.freeze({ type: "purpose-specific", recipeName: "Unsweetened cocoa powder", canonicalName: "Unsweetened Cocoa Powder", canonicalKey: "pantry.cocoa.unsweetened", preparation: "for dough" }),
  "CR-002|Unsweetened cocoa powder for filling": Object.freeze({ type: "purpose-specific", recipeName: "Unsweetened cocoa powder", canonicalName: "Unsweetened Cocoa Powder", canonicalKey: "pantry.cocoa.unsweetened", preparation: "for filling" }),
  "CR-002|Unsweetened cocoa powder for glaze": Object.freeze({ type: "purpose-specific", recipeName: "Unsweetened cocoa powder", canonicalName: "Unsweetened Cocoa Powder", canonicalKey: "pantry.cocoa.unsweetened", preparation: "for glaze" }),
  "CR-003|Peeled and diced apples, small dice": Object.freeze({ type: "prepared-fruit-volume", recipeName: "Apples", canonicalName: "Apple", canonicalKey: "produce.apple", preparation: "peeled and small-diced for filling", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 medium apples", approximate: true }),
  "CR-004|Chopped pecans": Object.freeze({ type: "preparation-separated", recipeName: "Pecans", canonicalName: "Pecans", canonicalKey: "pantry.nut.pecan", preparation: "chopped for filling" }),
  "CR-004|Raisins": Object.freeze({ type: "purpose-specific", preparation: "for filling" }),
  "CR-005|Refrigerated crescent roll dough": Object.freeze({ type: "package-count-with-size", quantity: 1, unit: "can", recipeName: "Refrigerated crescent roll dough", canonicalName: "Crescent Roll Dough", canonicalKey: "bread.refrigerated-dough.crescent-roll", shoppingQuantity: 1, shoppingUnit: "can", shoppingEquivalent: "One 8-ounce can refrigerated crescent roll dough" }),
  "CR-005|Unsalted butter, melted": Object.freeze({ type: "volume-with-shopping-equivalent", recipeName: "Unsalted butter", canonicalName: "Butter - Unsalted", canonicalKey: "dairy.butter.unsalted", preparation: "melted for filling", shoppingEquivalent: "1/2 stick unsalted butter" }),
  "CR-005|Powdered sugar": Object.freeze({ type: "purpose-specific", preparation: "for glaze" }),
  "CR-005|Milk": Object.freeze({ type: "display-range", quantity: 1.5, unit: "tablespoon", recipeQuantityText: "1–2", recipeName: "Milk", canonicalName: "Milk", canonicalKey: "dairy.milk", preparation: "as needed for glaze", shoppingQuantity: 1.5, shoppingUnit: "tablespoon", shoppingEquivalent: "1–2 tablespoons milk" }),
  "CR-005|Vanilla extract": Object.freeze({ type: "purpose-specific", preparation: "for glaze" }),
});

export const CR_001_005_REVIEW_FLAGS = Object.freeze({});

const DN_RECIPE_IDS = Array.from({ length: 7 }, (_, index) => `DN-${String(index + 1).padStart(3, "0")}`);

export const DN_001_007_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(DN_RECIPE_IDS.map((recipeId) => [`${recipeId}|Large eggs`, Object.freeze({ type: "whole-item", recipeName: "Large eggs", canonicalName: "Eggs - Large", canonicalKey: "dairy.eggs.large" })])),
  ...Object.fromEntries(["DN-001", "DN-005"].map((recipeId) => [`${recipeId}|Active dry yeast`, Object.freeze({ type: "packet-equivalent", quantity: 2.25, unit: "teaspoon", recipeQuantityText: "2 1/4 teaspoons (1 packet)", recipeQuantityIncludesUnit: true, shoppingQuantity: 1, shoppingUnit: "packet", shoppingEquivalent: "1 packet active dry yeast" })])),
  ...Object.fromEntries(["DN-001", "DN-005"].map((recipeId) => [`${recipeId}|Warm milk (110°F)`, Object.freeze({ type: "temperature-separated", recipeName: "Whole milk", canonicalName: "Milk - Whole", canonicalKey: "dairy.milk.whole", preparation: "warmed to 110°F for dough" })])),
  ...Object.fromEntries(DN_RECIPE_IDS.map((recipeId) => [`${recipeId}|Vegetable oil for frying`, Object.freeze({ type: "unmeasured-cooking-supply", quantity: null, unit: "", recipeName: "Vegetable oil", canonicalName: "Vegetable Oil", canonicalKey: "pantry.oil.vegetable", preparation: "as needed for frying" })])),
  "DN-002|Milk": Object.freeze({ type: "display-range", quantity: 3.5, unit: "tablespoon", recipeQuantityText: "3–4", preparation: "as needed for glaze", shoppingEquivalent: "3–4 tablespoons milk" }),
  "DN-007|Milk": Object.freeze({ type: "display-range", quantity: 2.5, unit: "tablespoon", recipeQuantityText: "2–3", preparation: "as needed for glaze", shoppingEquivalent: "2–3 tablespoons milk" }),
  "DN-003|Unsweetened cocoa powder": Object.freeze({ type: "shared-component-identity", canonicalName: "Unsweetened Cocoa Powder", canonicalKey: "pantry.cocoa.unsweetened" }),
  "DN-004|Buttermilk": Object.freeze({ type: "shared-component-identity", canonicalName: "Buttermilk - Cultured", canonicalKey: "dairy.milk.buttermilk" }),
  "DN-006|Peeled and diced apples (small dice)": Object.freeze({ type: "prepared-fruit-volume", recipeName: "Apples", canonicalName: "Apple", canonicalKey: "produce.apple", preparation: "peeled and small-diced", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 medium apples", approximate: true }),
  "DN-007|Fresh blueberries (or frozen, thawed)": Object.freeze({ type: "fresh-or-frozen-fruit", recipeName: "Fresh or frozen blueberries", canonicalName: "Blueberries", canonicalKey: "fruit.blueberry", preparation: "thaw if frozen", shoppingQuantity: 6, shoppingUnit: "ounce", shoppingEquivalent: "One 6-ounce fresh container or enough frozen for 1 cup", approximate: true }),
  "DN-005|Pastry cream or vanilla pudding": Object.freeze({ type: "optional-ingredient", recipeName: "Pastry cream or vanilla pudding", canonicalName: "Donut Filling", canonicalKey: "choice.donut-filling", preparation: "choose one filling" }),
  "DN-005|Strawberry or raspberry jam": Object.freeze({ type: "optional-ingredient", recipeName: "Strawberry or raspberry jam", canonicalName: "Donut Filling", canonicalKey: "choice.donut-filling", preparation: "choose one filling" }),
  "DN-005|Chocolate hazelnut spread": Object.freeze({ type: "optional-ingredient", recipeName: "Chocolate-hazelnut spread", canonicalName: "Donut Filling", canonicalKey: "choice.donut-filling", preparation: "choose one filling" }),
});

export const DN_001_007_REVIEW_FLAGS = Object.freeze({});

const JJ_RECIPE_IDS = Array.from({ length: 25 }, (_, index) => `JJ-${String(index + 1).padStart(3, "0")}`);
const JJ_LOW_NO_SUGAR_IDS = ["JJ-002", "JJ-003", "JJ-004", "JJ-005", "JJ-014", "JJ-015", "JJ-016", "JJ-017", "JJ-018", "JJ-019", "JJ-020", "JJ-021", "JJ-022", "JJ-023", "JJ-024", "JJ-025"];
const JJ_QUARTER_TEASPOON_BUTTER_IDS = ["JJ-002", "JJ-003", "JJ-004", "JJ-005", "JJ-014", "JJ-015", "JJ-016", "JJ-017", "JJ-018", "JJ-019", "JJ-020", "JJ-021", "JJ-022", "JJ-023", "JJ-024", "JJ-025"];
const JJ_HALF_TEASPOON_BUTTER_IDS = ["JJ-001", "JJ-009", "JJ-011", "JJ-012"];

const JJ_SUGAR_OR_MONK_FRUIT = Object.freeze({
  type: "approved-alternatives",
  recipeName: "Granulated sugar or monk-fruit blend",
  canonicalName: "Granulated Sugar or Monk-Fruit Blend",
  canonicalKey: "choice.sweetener.sugar-or-monk-fruit",
  shoppingName: "Granulated sugar or monk-fruit blend",
  preparation: "choose one cup-for-cup sweetener",
  acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "pantry.sugar.granulated", canonicalName: "Granulated Sugar", recipeName: "Granulated sugar", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "pantry.sweetener.monk-fruit-blend", canonicalName: "Monk-Fruit Sweetener Blend", recipeName: "Monk-fruit blend", masterItemId: "", matchStatus: "approved-alternative" }),
  ]),
});

const JJ_SUCRALOSE_CHOICE = Object.freeze({
  type: "approved-alternatives",
  recipeName: "Granulated Splenda or equivalent sucralose sweetener",
  canonicalName: "Granulated Sucralose Sweetener",
  canonicalKey: "pantry.sweetener.sucralose.granulated",
  shoppingName: "Granulated sucralose sweetener",
  acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "pantry.sweetener.splenda.granulated", canonicalName: "Granulated Splenda", recipeName: "Granulated Splenda", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "pantry.sweetener.sucralose.granulated", canonicalName: "Granulated Sucralose Sweetener", recipeName: "Equivalent sucralose sweetener", masterItemId: "", matchStatus: "approved-alternative" }),
  ]),
});

export const JJ_001_025_APPROVED_RESOLUTIONS = Object.freeze({
  "JJ-001|Fresh blackberries": Object.freeze({ type: "prepared-fruit-volume", recipeName: "Fresh blackberries", canonicalName: "Blackberries", canonicalKey: "produce.blackberry.fresh", shoppingEquivalent: "About four pint containers fresh blackberries", approximate: true }),
  ...Object.fromEntries(["JJ-002", "JJ-017", "JJ-023"].map((recipeId) => [`${recipeId}|Blackberries`, Object.freeze({ type: "prepared-fruit-volume", canonicalName: "Blackberries", canonicalKey: "fruit.blackberry", shoppingEquivalent: "About 1 1/2 pint containers fresh, or enough frozen for 3 cups", approximate: true })])),
  ...Object.fromEntries(["JJ-003", "JJ-018", "JJ-024"].map((recipeId) => [`${recipeId}|Blueberries`, Object.freeze({ type: "prepared-fruit-volume", canonicalName: "Blueberries", canonicalKey: "fruit.blueberry", shoppingEquivalent: "About 1 1/2 pint containers fresh, or enough frozen for 3 cups", approximate: true })])),
  ...Object.fromEntries(["JJ-016", "JJ-022"].map((recipeId) => [`${recipeId}|Raspberries`, Object.freeze({ type: "prepared-fruit-volume", canonicalName: "Raspberries", canonicalKey: "fruit.raspberry", shoppingQuantity: 18, shoppingUnit: "ounce", shoppingEquivalent: "About three 6-ounce containers fresh, or enough frozen for 3 cups", approximate: true })])),
  ...Object.fromEntries(["JJ-005", "JJ-014", "JJ-020"].map((recipeId) => [`${recipeId}|${recipeId === "JJ-005" ? "Strawberries, crushed or finely chopped" : "Strawberries, finely chopped"}`, Object.freeze({ type: "prepared-fruit-volume", recipeName: "Strawberries", canonicalName: "Strawberries", canonicalKey: "fruit.strawberry", preparation: recipeId === "JJ-005" ? "crushed or finely chopped" : "finely chopped", shoppingQuantity: 1.25, shoppingUnit: "pound", shoppingEquivalent: "About 1 1/4 pounds strawberries", approximate: true })])),
  ...Object.fromEntries(["JJ-004", "JJ-019", "JJ-025"].map((recipeId) => [`${recipeId}|Peaches, peeled and finely diced`, Object.freeze({ type: "prepared-fruit-volume", recipeName: "Peaches", canonicalName: "Peaches", canonicalKey: "fruit.peach", preparation: "peeled and finely diced", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 medium peaches", approximate: true })])),
  "JJ-009|Peaches, finely diced": Object.freeze({ type: "prepared-fruit-volume", recipeName: "Peaches", canonicalName: "Peaches", canonicalKey: "fruit.peach", preparation: "finely diced", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 medium peaches", approximate: true }),
  ...Object.fromEntries(["JJ-010", "JJ-011"].map((recipeId) => [`${recipeId}|${recipeId === "JJ-010" ? "Fresh pineapple, finely diced" : "Pineapple, finely diced"}`, Object.freeze({ type: "prepared-fruit-volume", recipeName: "Pineapple", canonicalName: "Pineapple", canonicalKey: "produce.pineapple", preparation: "finely diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: recipeId === "JJ-010" ? "About 2/3 medium pineapple" : "About 1 medium pineapple", approximate: true })])),
  ...Object.fromEntries(["JJ-015", "JJ-021"].map((recipeId) => [`${recipeId}|Seedless grapes, halved and lightly crushed`, Object.freeze({ type: "prepared-fruit-volume", recipeName: "Seedless grapes", canonicalName: "Grapes - Seedless", canonicalKey: "produce.grape.seedless", preparation: "halved and lightly crushed", shoppingQuantity: 1, shoppingUnit: "pound", shoppingEquivalent: "About 1 pound seedless grapes", approximate: true })])),
  "JJ-013|Tomatoes, finely diced": Object.freeze({ type: "prepared-produce-volume", recipeName: "Tomatoes", canonicalName: "Tomato", canonicalKey: "produce.tomato", preparation: "finely diced", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 medium tomatoes", approximate: true }),
  ...Object.fromEntries(["JJ-006", "JJ-007", "JJ-008", "JJ-013"].map((recipeId) => [`${recipeId}|Yellow onion, finely diced`, Object.freeze({ type: "prepared-onion-volume", recipeName: "Yellow onion", canonicalName: "Yellow Onion", canonicalKey: "produce.onion.yellow", preparation: "finely diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium yellow onion" })])),
  ...Object.fromEntries(["JJ-006", "JJ-007", "JJ-009", "JJ-010", "JJ-011"].map((recipeId) => [`${recipeId}|Jalapeño, finely minced`, Object.freeze({ type: "prepared-produce-volume", recipeName: "Jalapeño", canonicalName: "Jalapeño Pepper", canonicalKey: "produce.pepper.jalapeno", preparation: "finely minced", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 medium jalapeños", approximate: true })])),
  "JJ-012|Jalapeño, finely minced": Object.freeze({ type: "prepared-produce-volume", recipeName: "Jalapeño", canonicalName: "Jalapeño Pepper", canonicalKey: "produce.pepper.jalapeno", preparation: "finely minced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium jalapeño", approximate: true }),
  ...Object.fromEntries(["JJ-006", "JJ-007", "JJ-008", "JJ-013"].map((recipeId) => [`${recipeId}|Thick-cut bacon, diced`, Object.freeze({ type: "meat-weight", recipeName: "Thick-cut bacon", canonicalName: "Bacon - Thick-Cut", canonicalKey: "pork.bacon.thick-cut", preparation: "diced", shoppingEquivalent: "12 ounces thick-cut bacon" })])),
  "JJ-010|Thick-cut bacon, diced": Object.freeze({ type: "meat-weight", quantity: 10.6666666667, unit: "ounce", recipeQuantityText: "10 2/3", recipeName: "Thick-cut bacon", canonicalName: "Bacon - Thick-Cut", canonicalKey: "pork.bacon.thick-cut", preparation: "diced", shoppingQuantity: 10.6666666667, shoppingUnit: "ounce", shoppingEquivalent: "10 2/3 ounces thick-cut bacon" }),
  "JJ-001|Fruit pectin": Object.freeze({ type: "package-size-separated", quantity: 1.75, unit: "ounce", recipeQuantityText: "1.75-ounce box", recipeName: "Fruit pectin", canonicalName: "Fruit Pectin", canonicalKey: "pantry.pectin.fruit", shoppingQuantity: 1, shoppingUnit: "box", shoppingEquivalent: "One 1.75-ounce box fruit pectin", recipeQuantityIncludesUnit: true }),
  ...Object.fromEntries(JJ_LOW_NO_SUGAR_IDS.map((recipeId) => [`${recipeId}|Low/no-sugar pectin`, Object.freeze({ type: "shared-ingredient-identity", recipeName: "Low/no-sugar fruit pectin", canonicalName: "Fruit Pectin - Low/No-Sugar", canonicalKey: "pantry.pectin.low-no-sugar", shoppingEquivalent: "2 tablespoons low/no-sugar fruit pectin" })])),
  ...Object.fromEntries(["JJ-002", "JJ-003", "JJ-004", "JJ-005"].map((recipeId) => [`${recipeId}|Granulated sugar or monk fruit blend`, JJ_SUGAR_OR_MONK_FRUIT])),
  ...Object.fromEntries(["JJ-014", "JJ-015", "JJ-016", "JJ-017", "JJ-018", "JJ-019"].map((recipeId) => [`${recipeId}|Granulated Splenda or equivalent sucralose sweetener`, JJ_SUCRALOSE_CHOICE])),
  ...Object.fromEntries(["JJ-020", "JJ-021", "JJ-022", "JJ-023", "JJ-024", "JJ-025"].map((recipeId) => [`${recipeId}|Thawed white grape juice concentrate`, Object.freeze({ type: "preparation-separated", recipeName: "White grape juice concentrate", canonicalName: "White Grape Juice Concentrate", canonicalKey: "beverage.juice-concentrate.white-grape", preparation: "thawed" })])),
  ...Object.fromEntries(JJ_QUARTER_TEASPOON_BUTTER_IDS.map((recipeId) => [`${recipeId}|Butter`, Object.freeze({ type: "optional-ingredient", quantity: 0.25, unit: "teaspoon", recipeName: "Butter", canonicalName: "Butter", canonicalKey: "dairy.butter", preparation: "optional, for foam control" })])),
  ...Object.fromEntries(JJ_HALF_TEASPOON_BUTTER_IDS.map((recipeId) => [`${recipeId}|Butter`, Object.freeze({ type: "optional-ingredient", quantity: 0.5, unit: "teaspoon", recipeName: "Butter", canonicalName: "Butter", canonicalKey: "dairy.butter", preparation: "optional, for foam control" })])),
  "JJ-003|Lemon zest": Object.freeze({ type: "optional-ingredient", recipeName: "Lemon zest", canonicalName: "Lemon", canonicalKey: "produce.lemon", preparation: "zested; optional" }),
  "JJ-004|Cinnamon": Object.freeze({ type: "optional-ingredient", preparation: "optional" }),
  "JJ-010|Red pepper flakes": Object.freeze({ type: "optional-ingredient", preparation: "optional" }),
  ...Object.fromEntries(["JJ-014", "JJ-015", "JJ-016", "JJ-017", "JJ-018", "JJ-019", "JJ-020", "JJ-021", "JJ-022", "JJ-023", "JJ-024", "JJ-025"].map((recipeId) => [`${recipeId}|Soluble fiber powder`, Object.freeze({ type: "optional-ingredient", quantity: 1, unit: "tablespoon", recipeName: "Soluble fiber powder", canonicalName: "Soluble Fiber Powder", canonicalKey: "pantry.fiber.soluble", preparation: "optional, for Polaner-style texture" })])),
});

export const JJ_001_025_REVIEW_FLAGS = Object.freeze({
  "JJ-010|Thick-cut bacon, diced": "Source quantity is exactly 0.6666666667 pound (10 2/3 ounces), an unusually precise kitchen amount retained without rounding pending confirmation.",
});

const BR_RECIPE_IDS = ["BR-001", "BR-002", "BR-003", "BR-005", "BR-006", "BR-007", "BR-008", "BR-009", "BR-010", "BR-011"];
const BR_TWO_AND_HALF_TSP_YEAST_IDS = ["BR-001", "BR-002", "BR-003", "BR-005", "BR-009", "BR-010", "BR-011"];
const BR_BREAD_MACHINE_OR_INSTANT_IDS = ["BR-009", "BR-010", "BR-011"];

const BR_YEAST_ALTERNATIVES = Object.freeze([
  Object.freeze({ canonicalKey: "pantry.yeast.bread-machine", canonicalName: "Bread Machine Yeast", recipeName: "Bread machine yeast", masterItemId: "", matchStatus: "approved-alternative" }),
  Object.freeze({ canonicalKey: "pantry.yeast.instant", canonicalName: "Instant Yeast", recipeName: "Instant yeast", masterItemId: "", matchStatus: "approved-alternative" }),
]);

export const BR_001_011_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(BR_TWO_AND_HALF_TSP_YEAST_IDS.map((recipeId) => [`${recipeId}|${BR_BREAD_MACHINE_OR_INSTANT_IDS.includes(recipeId) ? "Bread machine yeast or instant yeast" : "Bread machine yeast"}`, Object.freeze({ type: BR_BREAD_MACHINE_OR_INSTANT_IDS.includes(recipeId) ? "approved-alternatives" : "packet-equivalent", recipeName: BR_BREAD_MACHINE_OR_INSTANT_IDS.includes(recipeId) ? "Bread machine yeast or instant yeast" : "Bread machine yeast", canonicalName: BR_BREAD_MACHINE_OR_INSTANT_IDS.includes(recipeId) ? "Bread Machine or Instant Yeast" : "Bread Machine Yeast", canonicalKey: BR_BREAD_MACHINE_OR_INSTANT_IDS.includes(recipeId) ? "choice.yeast.bread-machine-or-instant" : "pantry.yeast.bread-machine", shoppingEquivalent: "1 yeast packet plus 1/4 teaspoon, or 2 1/2 teaspoons measured from a jar", acceptableAlternatives: BR_BREAD_MACHINE_OR_INSTANT_IDS.includes(recipeId) ? BR_YEAST_ALTERNATIVES : Object.freeze([]) })])),
  ...Object.fromEntries(["BR-006", "BR-007"].map((recipeId) => [`${recipeId}|Bread machine yeast`, Object.freeze({ type: "packet-equivalent", canonicalName: "Bread Machine Yeast", canonicalKey: "pantry.yeast.bread-machine", shoppingQuantity: 1, shoppingUnit: "packet", shoppingEquivalent: "1 packet bread machine yeast" })])),
  "BR-008|Bread machine yeast": Object.freeze({ type: "measured-from-package", canonicalName: "Bread Machine Yeast", canonicalKey: "pantry.yeast.bread-machine", shoppingEquivalent: "1 1/2 teaspoons bread machine yeast, measured from a jar or packet" }),
  ...Object.fromEntries(BR_RECIPE_IDS.flatMap((recipeId) => [
    [`${recipeId}|Warm water`, Object.freeze({ type: "temperature-separated", recipeName: "Water", canonicalName: "Water", canonicalKey: "pantry.water", preparation: "warm" })],
    [`${recipeId}|Unsalted butter, softened`, Object.freeze({ type: "volume-with-shopping-equivalent", recipeName: "Unsalted butter", canonicalName: "Butter - Unsalted", canonicalKey: "dairy.butter.unsalted", preparation: "softened", shoppingEquivalent: "About 3/8 stick unsalted butter" })],
  ])),
  "BR-001|Milk": Object.freeze({ type: "metric-equivalent-retained", canonicalName: "Milk", canonicalKey: "dairy.milk" }),
  "BR-002|Milk": Object.freeze({ type: "metric-equivalent-retained", canonicalName: "Milk", canonicalKey: "dairy.milk" }),
  "BR-003|Buttermilk": Object.freeze({ type: "metric-equivalent-retained", canonicalName: "Buttermilk - Cultured", canonicalKey: "dairy.milk.buttermilk" }),
  "BR-005|Milk": Object.freeze({ type: "metric-equivalent-retained", canonicalName: "Milk", canonicalKey: "dairy.milk" }),
  "BR-005|Unsalted butter, softened": Object.freeze({ type: "volume-with-shopping-equivalent", recipeName: "Unsalted butter", canonicalName: "Butter - Unsalted", canonicalKey: "dairy.butter.unsalted", preparation: "softened", shoppingEquivalent: "1/2 stick unsalted butter" }),
  "BR-007|Whole milk": Object.freeze({ type: "metric-equivalent-retained", canonicalName: "Milk - Whole", canonicalKey: "dairy.milk.whole" }),
  "BR-008|Lemon juice or white vinegar, for tangy flavor": Object.freeze({ type: "approved-alternatives", recipeName: "Lemon juice or white vinegar", canonicalName: "Lemon Juice or White Vinegar", canonicalKey: "choice.acid.lemon-juice-or-white-vinegar", preparation: "choose one, for tangy flavor", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "produce.juice.lemon", canonicalName: "Lemon Juice", recipeName: "Lemon juice", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "pantry.vinegar.white", canonicalName: "White Vinegar", recipeName: "White vinegar", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "BR-009|Pineapple juice, room temperature": Object.freeze({ type: "temperature-separated", recipeName: "Pineapple juice", canonicalName: "Pineapple Juice", canonicalKey: "beverage.juice.pineapple", preparation: "room temperature" }),
  "BR-009|Warm milk": Object.freeze({ type: "temperature-separated", recipeName: "Milk", canonicalName: "Milk", canonicalKey: "dairy.milk", preparation: "warm" }),
  "BR-009|Butter, softened": Object.freeze({ type: "volume-with-shopping-equivalent", recipeName: "Butter", canonicalName: "Butter", canonicalKey: "dairy.butter", preparation: "softened", shoppingEquivalent: "1/2 stick butter" }),
  "BR-010|Whole milk": Object.freeze({ type: "shared-ingredient-identity", canonicalName: "Milk - Whole", canonicalKey: "dairy.milk.whole" }),
  "BR-011|Warm milk": Object.freeze({ type: "temperature-separated", recipeName: "Milk", canonicalName: "Milk", canonicalKey: "dairy.milk", preparation: "warm" }),
  "BR-011|Butter, melted": Object.freeze({ type: "volume-with-shopping-equivalent", recipeName: "Butter", canonicalName: "Butter", canonicalKey: "dairy.butter", preparation: "melted for dough", shoppingEquivalent: "1/4 stick butter" }),
  "BR-011|White vinegar or lemon juice": Object.freeze({ type: "approved-alternatives", recipeName: "White vinegar or lemon juice", canonicalName: "White Vinegar or Lemon Juice", canonicalKey: "choice.acid.white-vinegar-or-lemon-juice", preparation: "choose one", acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "pantry.vinegar.white", canonicalName: "White Vinegar", recipeName: "White vinegar", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "produce.juice.lemon", canonicalName: "Lemon Juice", recipeName: "Lemon juice", masterItemId: "", matchStatus: "approved-alternative" }),
  ]) }),
  "BR-006|Pretzel salt for topping": Object.freeze({ type: "optional-ingredient", quantity: 1, unit: "tablespoon", recipeName: "Pretzel salt", canonicalName: "Pretzel Salt", canonicalKey: "pantry.salt.pretzel", preparation: "optional topping" }),
  "BR-009|Egg yolk": Object.freeze({ type: "optional-ingredient", quantity: 1, unit: "each", recipeName: "Egg yolk", canonicalName: "Egg Yolk", canonicalKey: "dairy.egg.yolk", preparation: "optional glossy finish" }),
  "BR-009|Milk": Object.freeze({ type: "optional-ingredient", quantity: 1, unit: "tablespoon", recipeName: "Milk", canonicalName: "Milk", canonicalKey: "dairy.milk", preparation: "optional glossy finish" }),
  "BR-009|Honey": Object.freeze({ type: "optional-ingredient", quantity: 1, unit: "teaspoon", recipeName: "Honey", canonicalName: "Honey", canonicalKey: "pantry.honey", preparation: "optional glossy finish" }),
  "BR-010|Egg yolk": Object.freeze({ type: "optional-ingredient", quantity: 1, unit: "each", recipeName: "Egg yolk", canonicalName: "Egg Yolk", canonicalKey: "dairy.egg.yolk", preparation: "optional glossy finish" }),
  "BR-010|Milk": Object.freeze({ type: "optional-ingredient", quantity: 1, unit: "tablespoon", recipeName: "Milk", canonicalName: "Milk", canonicalKey: "dairy.milk", preparation: "optional glossy finish" }),
  "BR-010|Sesame seeds": Object.freeze({ type: "unmeasured-optional-ingredient", quantity: null, unit: "", recipeName: "Sesame seeds", canonicalName: "Sesame Seeds", canonicalKey: "pantry.seed.sesame", preparation: "optional topping" }),
  ...Object.fromEntries(["BR-009", "BR-010", "BR-011"].map((recipeId) => [`${recipeId}|Butter for brushing after baking`, Object.freeze({ type: "unmeasured-cooking-supply", quantity: null, unit: "", recipeName: "Butter", canonicalName: "Butter", canonicalKey: "dairy.butter", preparation: "melted, as needed for brushing after baking" })])),
});

export const BR_001_011_REVIEW_FLAGS = Object.freeze({});

const CP_001_020_PACKAGE_ROWS = Object.freeze([
  ["CP-001", "ranch seasoning", "One packet ranch seasoning—packet size not specified"],
  ["CP-001", "cream of chicken soup", "One can cream of chicken soup—can size not specified"],
  ["CP-002", "chicken gravy mix", "Two packets chicken gravy mix—packet size not specified"],
  ["CP-002", "cream of chicken soup", "One can cream of chicken soup—can size not specified"],
  ["CP-003", "cream of chicken soup", "One can cream of chicken soup—can size not specified"],
  ["CP-003", "refrigerated biscuits", "One can refrigerated biscuits—can size not specified"],
  ["CP-004", "cream of chicken soup", "One can cream of chicken soup—can size not specified"],
  ["CP-006", "black beans, drained", "One can black beans—can size not specified"],
  ["CP-006", "corn, drained", "One can corn—can size not specified"],
  ["CP-006", "diced tomatoes", "One can diced tomatoes—can size not specified"],
  ["CP-006", "enchilada sauce", "One can enchilada sauce—can size not specified"],
  ["CP-007", "white beans, drained", "Two cans white beans—can sizes not specified"],
  ["CP-007", "diced green chiles", "One can diced green chiles—can size not specified"],
  ["CP-008", "diced green chiles", "One can diced green chiles—can size not specified"],
  ["CP-009", "black beans, drained", "One can black beans—can size not specified"],
  ["CP-009", "corn, drained", "One can corn—can size not specified"],
  ["CP-010", "black beans, drained", "One can black beans—can size not specified"],
  ["CP-010", "corn, drained", "One can corn—can size not specified"],
  ["CP-010", "diced tomatoes", "One can diced tomatoes—can size not specified"],
  ["CP-010", "taco seasoning", "One packet taco seasoning—packet size not specified"],
  ["CP-011", "black beans, drained", "One can black beans—can size not specified"],
  ["CP-011", "corn, drained", "One can corn—can size not specified"],
  ["CP-011", "diced tomatoes", "One can diced tomatoes—can size not specified"],
  ["CP-011", "taco seasoning", "One packet taco seasoning—packet size not specified"],
  ["CP-012", "Italian dressing seasoning", "One packet Italian dressing seasoning—packet size not specified"],
  ["CP-012", "cream of chicken soup", "One can cream of chicken soup—can size not specified"],
  ["CP-017", "crushed tomatoes", "One can crushed tomatoes—can size not specified"],
  ["CP-018", "tomato sauce", "One can tomato sauce—can size not specified"],
  ["CP-019", "crushed tomatoes", "One can crushed tomatoes—can size not specified"],
  ["CP-020", "diced tomatoes", "One can diced tomatoes—can size not specified"],
]);

const CP_MEDIUM_DICED_ONION_IDS = ["CP-003", "CP-004", "CP-005", "CP-006", "CP-007", "CP-008", "CP-009", "CP-010", "CP-011", "CP-017", "CP-018", "CP-020"];

export const CP_001_020_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(CP_001_020_PACKAGE_ROWS.map(([recipeId, name, shoppingEquivalent]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-package-size", shoppingEquivalent })])),
  "CP-002|chicken gravy mix": Object.freeze({ type: "missing-package-size", quantity: 2, unit: "packet", shoppingEquivalent: "Two packets chicken gravy mix—packet size not specified" }),
  "CP-007|white beans, drained": Object.freeze({ type: "missing-package-size", quantity: 2, unit: "can", shoppingEquivalent: "Two cans white beans—can sizes not specified" }),
  ...Object.fromEntries(CP_MEDIUM_DICED_ONION_IDS.map((recipeId) => [`${recipeId}|diced onion`, Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" })])),
  "CP-019|sliced onion": Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "sliced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" }),
  "CP-019|sliced bell pepper": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Bell pepper", canonicalName: "Bell Pepper", canonicalKey: "produce.pepper.bell", preparation: "sliced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 bell pepper", approximate: true }),
  "CP-020|diced bell pepper": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Bell pepper", canonicalName: "Bell Pepper", canonicalKey: "produce.pepper.bell", preparation: "diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 bell pepper", approximate: true }),
  "CP-020|celery stalks, diced": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Celery", canonicalName: "Celery", canonicalKey: "produce.celery", preparation: "diced", shoppingQuantity: 2, shoppingUnit: "stalk", shoppingEquivalent: "About 2 celery stalks", approximate: true }),
  "CP-003|sliced carrots": Object.freeze({ type: "preparation-separated", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "sliced" }),
  "CP-003|sliced celery": Object.freeze({ type: "preparation-separated", recipeName: "Celery", canonicalName: "Celery", canonicalKey: "produce.celery", preparation: "sliced" }),
  "CP-004|diced carrots": Object.freeze({ type: "preparation-separated", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "diced" }),
  "CP-004|diced celery": Object.freeze({ type: "preparation-separated", recipeName: "Celery", canonicalName: "Celery", canonicalKey: "produce.celery", preparation: "diced" }),
  "CP-005|sliced carrots": Object.freeze({ type: "preparation-separated", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "sliced" }),
  "CP-005|sliced celery": Object.freeze({ type: "preparation-separated", recipeName: "Celery", canonicalName: "Celery", canonicalKey: "produce.celery", preparation: "sliced" }),
  "CP-012|cream cheese, cubed": Object.freeze({ type: "soft-cheese-weight", quantity: 8, unit: "ounce", recipeName: "Cream cheese", canonicalName: "Cheese - Cream", canonicalKey: "dairy.cheese.cream", preparation: "cubed", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "One 8-ounce package cream cheese" }),
  "CP-001|cream cheese, cubed": Object.freeze({ type: "soft-cheese-weight", recipeName: "Cream cheese", canonicalName: "Cheese - Cream", canonicalKey: "dairy.cheese.cream", preparation: "cubed", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "One 8-ounce package cream cheese" }),
  "CP-007|cream cheese": Object.freeze({ type: "soft-cheese-weight", recipeName: "Cream cheese", canonicalName: "Cheese - Cream", canonicalKey: "dairy.cheese.cream", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "Half of one 8-ounce package cream cheese" }),
  "CP-013|melted butter": Object.freeze({ type: "preparation-separated", recipeName: "Butter", canonicalName: "Butter", canonicalKey: "dairy.butter", preparation: "melted" }),
  "CP-013|grated Parmesan": Object.freeze({ type: "preparation-separated", recipeName: "Parmesan cheese", canonicalName: "Cheese - Parmesan", canonicalKey: "dairy.cheese.parmesan", preparation: "grated" }),
  "CP-009|shredded Mexican cheese": Object.freeze({ type: "preparation-separated", recipeName: "Mexican-blend cheese", canonicalName: "Cheese - Mexican Blend", canonicalKey: "dairy.cheese.mexican-blend", preparation: "shredded" }),
  ...Object.fromEntries(["CP-014", "CP-015", "CP-016", "CP-017", "CP-018"].map((recipeId) => [`${recipeId}|grated ginger`, Object.freeze({ type: "preparation-separated", recipeName: "Ginger", canonicalName: "Ginger", canonicalKey: "produce.ginger", preparation: "grated" })])),
  "CP-018|butter": Object.freeze({ type: "purpose-specific", recipeName: "Butter", canonicalName: "Butter", canonicalKey: "dairy.butter", preparation: "dotted over chicken" }),
  ...Object.fromEntries(["CP-014", "CP-015", "CP-016"].map((recipeId) => [`${recipeId}|cornstarch`, Object.freeze({ type: "purpose-specific", recipeName: "Cornstarch", canonicalName: "Cornstarch", canonicalKey: "pantry.cornstarch", preparation: "for slurry" })])),
  ...Object.fromEntries(["CP-014", "CP-015", "CP-016"].map((recipeId) => [`${recipeId}|water`, Object.freeze({ type: "purpose-specific", recipeName: "Water", canonicalName: "Water", canonicalKey: "pantry.water", preparation: "for slurry" })])),
  "CP-020|long-grain rice": Object.freeze({ type: "preparation-separated", recipeName: "Long-grain rice", canonicalName: "Rice - Long-Grain", canonicalKey: "grain.rice.long-grain", preparation: "uncooked; reserved until finishing step" }),
  "CP-010|Cooked rice, for serving": Object.freeze({ type: "unmeasured-serving-suggestion", quantity: null, unit: "", recipeName: "Cooked rice", canonicalName: "Cooked Rice", canonicalKey: "prepared.rice", preparation: "for serving" }),
  "CP-011|Cooked rice, for serving": Object.freeze({ type: "unmeasured-serving-suggestion", quantity: null, unit: "", recipeName: "Cooked rice", canonicalName: "Cooked Rice", canonicalKey: "prepared.rice", preparation: "for serving" }),
});

export const CP_001_020_REVIEW_FLAGS = Object.freeze(Object.fromEntries(
  CP_001_020_PACKAGE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Source card gives a can or packet count but no package size; count is retained without guessing an ounce equivalent."]),
));

const CP_021_040_PACKAGE_ROWS = Object.freeze([
  ["CP-021", "cream of chicken soup", "One can cream of chicken soup—can size not specified"],
  ["CP-021", "poultry gravy mix", "One packet poultry gravy mix—packet size not specified"],
  ["CP-022", "turkey gravy mix", "One packet turkey gravy mix—packet size not specified"],
  ["CP-024", "ranch seasoning", "One packet ranch seasoning—packet size not specified"],
  ["CP-024", "au jus gravy mix", "One packet au jus gravy mix—packet size not specified"],
  ["CP-025", "brown gravy mix", "One packet brown gravy mix—packet size not specified"],
  ["CP-028", "diced tomatoes", "One can diced tomatoes—can size not specified"],
  ["CP-028", "green beans, drained", "One can green beans—can size not specified"],
  ["CP-029", "French onion soup", "One can French onion soup—can size not specified"],
  ["CP-030", "Italian dressing seasoning", "One packet Italian dressing seasoning—packet size not specified"],
  ["CP-031", "brown gravy mix", "Two packets brown gravy mix—packet size not specified"],
  ["CP-037", "diced tomatoes", "One can diced tomatoes—can size not specified"],
  ["CP-038", "diced tomatoes", "One can diced tomatoes—can size not specified"],
  ["CP-038", "tomato sauce", "One can tomato sauce—can size not specified"],
  ["CP-039", "brown gravy mix", "One packet brown gravy mix—packet size not specified"],
]);

const CP_021_040_MEDIUM_DICED_ONION_IDS = ["CP-022", "CP-025", "CP-026", "CP-027", "CP-028", "CP-032", "CP-033", "CP-034"];
const CP_021_040_MEDIUM_SLICED_ONION_IDS = ["CP-030", "CP-031", "CP-037", "CP-038", "CP-039"];
const CP_021_040_SLURRY_IDS = ["CP-025", "CP-027", "CP-036", "CP-037", "CP-039", "CP-040"];

const CP_TURKEY_OR_CHICKEN_BROTH = Object.freeze({
  type: "approved-alternatives",
  recipeName: "Turkey or chicken broth",
  canonicalName: "Turkey or Chicken Broth",
  canonicalKey: "choice.broth.turkey-or-chicken",
  preparation: "choose one",
  acceptableAlternatives: Object.freeze([
    Object.freeze({ canonicalKey: "pantry.broth.turkey", canonicalName: "Turkey Broth", recipeName: "Turkey broth", masterItemId: "", matchStatus: "approved-alternative" }),
    Object.freeze({ canonicalKey: "pantry.broth.chicken", canonicalName: "Chicken Broth", recipeName: "Chicken broth", masterItemId: "", matchStatus: "approved-alternative" }),
  ]),
});

export const CP_021_040_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(CP_021_040_PACKAGE_ROWS.map(([recipeId, name, shoppingEquivalent]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-package-size", shoppingEquivalent })])),
  "CP-031|brown gravy mix": Object.freeze({ type: "missing-package-size", quantity: 2, unit: "packet", shoppingEquivalent: "Two packets brown gravy mix—packet size not specified" }),
  "CP-021|turkey wing sections": Object.freeze({ type: "display-range", quantity: 3.5, unit: "pound", recipeQuantityText: "3–4", recipeName: "Turkey wing sections", canonicalName: "Turkey Wing Sections", canonicalKey: "meat.turkey.wing-sections", shoppingQuantity: 3.5, shoppingUnit: "pound", shoppingEquivalent: "3–4 pounds turkey wing sections" }),
  ...Object.fromEntries(["CP-023", "CP-024", "CP-030", "CP-031"].map((recipeId) => [`${recipeId}|beef chuck roast`, Object.freeze({ type: "display-range", quantity: 3.5, unit: "pound", recipeQuantityText: "3–4", recipeName: "Beef chuck roast", canonicalName: "Beef - Chuck", canonicalKey: "meat.beef.chuck", shoppingQuantity: 3.5, shoppingUnit: "pound", shoppingEquivalent: "One 3–4-pound beef chuck roast" })])),
  "CP-021|turkey or chicken broth": CP_TURKEY_OR_CHICKEN_BROTH,
  "CP-022|turkey or chicken broth": CP_TURKEY_OR_CHICKEN_BROTH,
  ...Object.fromEntries(CP_021_040_MEDIUM_DICED_ONION_IDS.map((recipeId) => [`${recipeId}|diced onion`, Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" })])),
  ...Object.fromEntries(CP_021_040_MEDIUM_SLICED_ONION_IDS.map((recipeId) => [`${recipeId}|sliced onion`, Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "sliced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" })])),
  "CP-021|large onion, sliced": Object.freeze({ type: "sized-onion", quantity: 1.5, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "sliced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 large onion" }),
  "CP-023|large onion, cut in wedges": Object.freeze({ type: "sized-onion", quantity: 1.5, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "cut in wedges", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 large onion" }),
  "CP-029|large onions, sliced": Object.freeze({ type: "sized-onion", quantity: 4.5, unit: "cup", recipeName: "Onions", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "sliced", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 large onions" }),
  ...Object.fromEntries(["CP-023", "CP-027"].map((recipeId) => [`${recipeId}|carrots, cut in chunks`, Object.freeze({ type: "prepared-produce-volume", quantity: 2, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "cut in chunks", shoppingQuantity: 4, shoppingUnit: "each", shoppingEquivalent: "About 4 carrots", approximate: true })])),
  "CP-028|sliced carrots": Object.freeze({ type: "prepared-produce-volume", quantity: 1.5, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "sliced", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 carrots", approximate: true }),
  "CP-027|celery stalks, sliced": Object.freeze({ type: "prepared-produce-volume", quantity: 1.5, unit: "cup", recipeName: "Celery", canonicalName: "Celery", canonicalKey: "produce.celery", preparation: "sliced", shoppingQuantity: 3, shoppingUnit: "stalk", shoppingEquivalent: "About 3 celery stalks", approximate: true }),
  "CP-028|diced potatoes": Object.freeze({ type: "prepared-produce-volume", quantity: 2, unit: "cup", recipeName: "Potatoes", canonicalName: "Potato", canonicalKey: "produce.potato", preparation: "diced", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 medium potatoes", approximate: true }),
  "CP-037|green bell pepper, sliced": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Green bell pepper", canonicalName: "Bell Pepper - Green", canonicalKey: "produce.pepper.bell.green", preparation: "sliced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 green bell pepper", approximate: true }),
  "CP-037|red bell pepper, sliced": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Red bell pepper", canonicalName: "Bell Pepper - Red", canonicalKey: "produce.pepper.bell.red", preparation: "sliced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 red bell pepper", approximate: true }),
  "CP-038|sliced bell pepper": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Bell pepper", canonicalName: "Bell Pepper", canonicalKey: "produce.pepper.bell", preparation: "sliced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 bell pepper", approximate: true }),
  "CP-035|sliced pear": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Pear", canonicalName: "Pear", canonicalKey: "produce.pear", preparation: "sliced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium pear", approximate: true }),
  ...Object.fromEntries(["CP-035", "CP-036", "CP-040"].map((recipeId) => [`${recipeId}|grated ginger`, Object.freeze({ type: "preparation-separated", recipeName: "Ginger", canonicalName: "Ginger", canonicalKey: "produce.ginger", preparation: "grated" })])),
  ...Object.fromEntries(CP_021_040_SLURRY_IDS.flatMap((recipeId) => [
    [`${recipeId}|cornstarch`, Object.freeze({ type: "purpose-specific", recipeName: "Cornstarch", canonicalName: "Cornstarch", canonicalKey: "pantry.cornstarch", preparation: "for slurry" })],
    [`${recipeId}|water`, Object.freeze({ type: "purpose-specific", recipeName: "Water", canonicalName: "Water", canonicalKey: "pantry.water", preparation: "for slurry" })],
  ])),
  ...Object.fromEntries(["CP-024", "CP-030"].map((recipeId) => [`${recipeId}|pepperoncini peppers`, Object.freeze({ type: "shared-purchase-primary", recipeName: "Pepperoncini peppers", canonicalName: "Pepperoncini", canonicalKey: "condiment.pepperoncini", shoppingQuantity: 1, shoppingUnit: "jar", shoppingEquivalent: "One jar pepperoncini—jar size not specified" })])),
  ...Object.fromEntries(["CP-024", "CP-030"].map((recipeId) => [`${recipeId}|pepperoncini juice`, Object.freeze({ type: "shared-purchase-component", recipeName: "Pepperoncini juice", canonicalName: "Pepperoncini", canonicalKey: "condiment.pepperoncini", preparation: "juice from the same jar as the peppers", excludeFromShopping: true })])),
  "CP-039|Eggs": Object.freeze({ type: "whole-item", quantity: 1, unit: "each", recipeName: "Egg", canonicalName: "Egg", canonicalKey: "dairy.egg" }),
});

export const CP_021_040_REVIEW_FLAGS = Object.freeze(Object.fromEntries(
  CP_021_040_PACKAGE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Source card gives a can or packet count but no package size; count is retained without guessing an ounce equivalent."]),
));

const CP_041_060_PACKAGE_ROWS = Object.freeze([
  ["CP-044", "brown gravy mix", "One packet brown gravy mix—packet size not specified"],
  ["CP-045", "cream of mushroom soup", "One can cream of mushroom soup—can size not specified"],
  ["CP-047", "diced tomatoes", "Two cans diced tomatoes—can sizes not specified"],
  ["CP-047", "tomato sauce", "One can tomato sauce—can size not specified"],
  ["CP-048", "diced tomatoes", "Two cans diced tomatoes—can sizes not specified"],
  ["CP-048", "tomato sauce", "One can tomato sauce—can size not specified"],
  ["CP-049", "black beans, drained", "One can black beans—can size not specified"],
  ["CP-049", "pinto beans, drained", "One can pinto beans—can size not specified"],
  ["CP-049", "corn, drained", "One can corn—can size not specified"],
  ["CP-049", "diced tomatoes", "Two cans diced tomatoes—can sizes not specified"],
  ["CP-049", "taco seasoning", "One packet taco seasoning—packet size not specified"],
  ["CP-050", "diced tomatoes", "Two cans diced tomatoes—can sizes not specified"],
  ["CP-050", "tomato sauce", "One can tomato sauce—can size not specified"],
  ["CP-050", "kidney beans, drained", "One can kidney beans—can size not specified"],
  ["CP-052", "crushed tomatoes", "Two cans crushed tomatoes—can sizes not specified"],
  ["CP-052", "tomato sauce", "One can tomato sauce—can size not specified"],
  ["CP-055", "kidney beans, drained", "Two cans kidney beans—can sizes not specified"],
  ["CP-055", "diced tomatoes", "Two cans diced tomatoes—can sizes not specified"],
  ["CP-055", "tomato sauce", "One can tomato sauce—can size not specified"],
  ["CP-056", "baked beans", "Two cans baked beans—can sizes not specified"],
  ["CP-056", "kidney beans, drained", "One can kidney beans—can size not specified"],
  ["CP-056", "pinto beans, drained", "One can pinto beans—can size not specified"],
]);

const CP_041_060_DICED_ONION_IDS = ["CP-043", "CP-046", "CP-047", "CP-048", "CP-049", "CP-050", "CP-051", "CP-052", "CP-053", "CP-054", "CP-055", "CP-056", "CP-060"];
const CP_041_060_SLICED_ONION_IDS = ["CP-041", "CP-045", "CP-057", "CP-058", "CP-059"];

export const CP_041_060_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(CP_041_060_PACKAGE_ROWS.map(([recipeId, name, shoppingEquivalent]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-package-size", shoppingEquivalent })])),
  ...Object.fromEntries([["CP-047", "diced tomatoes"], ["CP-048", "diced tomatoes"], ["CP-049", "diced tomatoes"], ["CP-050", "diced tomatoes"], ["CP-052", "crushed tomatoes"], ["CP-055", "kidney beans, drained"], ["CP-055", "diced tomatoes"], ["CP-056", "baked beans"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-package-size", quantity: 2, unit: "can", shoppingEquivalent: CP_041_060_PACKAGE_ROWS.find(([id, item]) => id === recipeId && item === name)[2] })])),
  "CP-042|corned beef brisket": Object.freeze({ type: "display-range", quantity: 3.5, unit: "pound", recipeQuantityText: "3–4", recipeName: "Corned beef brisket", canonicalName: "Beef - Corned Beef Brisket", canonicalKey: "meat.beef.corned-brisket", shoppingQuantity: 3.5, shoppingUnit: "pound", shoppingEquivalent: "One 3–4-pound corned beef brisket" }),
  "CP-042|seasoning packet": Object.freeze({ type: "shared-purchase-component", recipeName: "Corned beef seasoning packet", canonicalName: "Corned Beef Seasoning Packet", canonicalKey: "meat.beef.corned-brisket.seasoning", preparation: "packet included with the corned beef", excludeFromShopping: true }),
  ...Object.fromEntries(CP_041_060_DICED_ONION_IDS.map((recipeId) => [`${recipeId}|diced onion`, Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" })])),
  ...Object.fromEntries(CP_041_060_SLICED_ONION_IDS.map((recipeId) => [`${recipeId}|sliced onion`, Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "sliced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" })])),
  "CP-042|large onion, cut in wedges": Object.freeze({ type: "sized-onion", quantity: 1.5, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "cut in wedges", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 large onion" }),
  "CP-044|large onions, sliced": Object.freeze({ type: "sized-onion", quantity: 3, unit: "cup", recipeName: "Onions", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "sliced", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 large onions" }),
  "CP-041|sliced carrots": Object.freeze({ type: "prepared-produce-volume", quantity: 1.5, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "sliced", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 carrots", approximate: true }),
  "CP-042|carrots, cut in chunks": Object.freeze({ type: "prepared-produce-volume", quantity: 2, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "cut in chunks", shoppingQuantity: 4, shoppingUnit: "each", shoppingEquivalent: "About 4 carrots", approximate: true }),
  "CP-046|sliced carrots": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "sliced", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 carrots", approximate: true }),
  "CP-046|diced potatoes": Object.freeze({ type: "prepared-produce-volume", quantity: 3, unit: "cup", recipeName: "Potatoes", canonicalName: "Potato", canonicalKey: "produce.potato", preparation: "diced", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 medium potatoes", approximate: true }),
  "CP-047|bell peppers, diced": Object.freeze({ type: "prepared-produce-volume", quantity: 2, unit: "cup", recipeName: "Bell peppers", canonicalName: "Bell Pepper", canonicalKey: "produce.pepper.bell", preparation: "diced", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 bell peppers", approximate: true }),
  "CP-051|diced bell pepper": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Bell pepper", canonicalName: "Bell Pepper", canonicalKey: "produce.pepper.bell", preparation: "diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 bell pepper", approximate: true }),
  "CP-042|small cabbage, cut in wedges": Object.freeze({ type: "whole-produce", quantity: 1, unit: "each", recipeName: "Small cabbage", canonicalName: "Cabbage", canonicalKey: "produce.cabbage", preparation: "cut in wedges", shoppingQuantity: 1, shoppingUnit: "head", shoppingEquivalent: "One small head cabbage" }),
  "CP-044|Eggs": Object.freeze({ type: "whole-item", quantity: 1, unit: "each", recipeName: "Egg", canonicalName: "Egg", canonicalKey: "dairy.egg" }),
  "CP-047|cooked rice": Object.freeze({ type: "cooked-rice-yield", recipeName: "Cooked rice", canonicalName: "Rice", canonicalKey: "grain.rice", preparation: "cooked; reserved until finishing", shoppingQuantity: 0.3333333333, shoppingUnit: "cup", shoppingEquivalent: "About 1/3 cup dry rice", approximate: true }),
  "CP-048|cooked rice": Object.freeze({ type: "cooked-rice-yield", recipeName: "Cooked rice", canonicalName: "Rice", canonicalKey: "grain.rice", preparation: "cooked; reserved until finishing", shoppingQuantity: 0.3333333333, shoppingUnit: "cup", shoppingEquivalent: "About 1/3 cup dry rice", approximate: true }),
  "CP-050|elbow macaroni": Object.freeze({ type: "preparation-separated", recipeName: "Elbow macaroni", canonicalName: "Pasta - Elbow Macaroni", canonicalKey: "grain.pasta.elbow-macaroni", preparation: "uncooked; reserved until finishing" }),
  "CP-052|Spaghetti, for serving": Object.freeze({ type: "unmeasured-serving-suggestion", quantity: null, unit: "", recipeName: "Spaghetti", canonicalName: "Spaghetti", canonicalKey: "grain.pasta.spaghetti", preparation: "for serving" }),
  ...Object.fromEntries(["CP-057", "CP-058", "CP-059"].map((recipeId) => [`${recipeId}|Sandwich buns, for serving`, Object.freeze({ type: "unmeasured-serving-suggestion", quantity: null, unit: "", recipeName: "Sandwich buns", canonicalName: "Sandwich Buns", canonicalKey: "bread.bun.sandwich", preparation: "for serving" })])),
  "CP-056|bacon, cooked and chopped": Object.freeze({ type: "cooked-bacon-yield", recipeName: "Bacon", canonicalName: "Bacon", canonicalKey: "pork.bacon", preparation: "cooked and chopped", shoppingQuantity: 6, shoppingUnit: "ounce", shoppingEquivalent: "About 6 ounces raw bacon", approximate: true }),
  "CP-059|root beer": Object.freeze({ type: "beverage-package-equivalent", recipeName: "Root beer", canonicalName: "Root Beer", canonicalKey: "beverage.soft-drink.root-beer", shoppingQuantity: 12, shoppingUnit: "ounce", shoppingEquivalent: "One 12-ounce can or bottle root beer" }),
});

export const CP_041_060_REVIEW_FLAGS = Object.freeze(Object.fromEntries(
  CP_041_060_PACKAGE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Source card gives a can or packet count but no package size; count is retained without guessing an ounce equivalent."]),
));

const CP_061_080_PACKAGE_ROWS = Object.freeze([
  ["CP-061", "pork gravy mix", "One packet pork gravy mix—packet size not specified"],
  ["CP-062", "cream of mushroom soup", "One can cream of mushroom soup—can size not specified"],
  ["CP-062", "pork gravy mix", "One packet pork gravy mix—packet size not specified"],
  ["CP-064", "cream of mushroom soup", "One can cream of mushroom soup—can size not specified"],
  ["CP-073", "cream of mushroom soup", "One can cream of mushroom soup—can size not specified"],
  ["CP-077", "cannellini beans", "Two cans cannellini beans—can sizes not specified"],
  ["CP-077", "diced tomatoes", "One can diced tomatoes—can size not specified"],
  ["CP-079", "diced tomatoes", "One can diced tomatoes—can size not specified"],
]);

const CP_061_080_MISSING_QUANTITY_ROWS = Object.freeze([
  ["CP-066", "salt & pepper"], ["CP-070", "pepper"], ["CP-071", "salt & pepper"],
  ["CP-073", "pepper"], ["CP-074", "pepper"], ["CP-075", "salt & pepper"],
  ["CP-077", "Italian seasoning"], ["CP-078", "onion"], ["CP-079", "spinach"],
  ["CP-080", "garlic powder"], ["CP-080", "pepper"],
]);

const CP_061_080_MISSING_WEIGHT_ROWS = Object.freeze([
  ["CP-062", "thick boneless pork chops", "Six thick boneless pork chops—weight not specified"],
  ["CP-063", "thick boneless pork chops", "Six thick boneless pork chops—weight not specified"],
  ["CP-064", "thick pork chops", "Six thick pork chops—weight not specified"],
  ["CP-068", "baby back ribs", "Two racks baby back ribs—weight not specified"],
]);

const CP_061_080_ONE_SLICED_ONION_IDS = ["CP-061", "CP-062", "CP-064", "CP-066", "CP-067", "CP-073", "CP-074", "CP-076", "CP-080"];
const CP_061_080_ONE_DICED_ONION_IDS = ["CP-070", "CP-071", "CP-072"];

export const CP_061_080_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(CP_061_080_PACKAGE_ROWS.map(([recipeId, name, shoppingEquivalent]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-package-size", ...(recipeId === "CP-077" && name === "cannellini beans" ? { quantity: 2, unit: "can" } : {}), shoppingEquivalent })])),
  ...Object.fromEntries(CP_061_080_MISSING_QUANTITY_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-source-quantity", quantity: null, unit: "", shoppingEquivalent: `${name[0].toUpperCase()}${name.slice(1)}—quantity not specified` })])),
  ...Object.fromEntries(CP_061_080_MISSING_WEIGHT_ROWS.map(([recipeId, name, shoppingEquivalent]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-protein-weight", ...(recipeId === "CP-068" ? { quantity: 2, unit: "each", recipeQuantityText: "2 racks", shoppingQuantity: 2, shoppingUnit: "each" } : {}), shoppingEquivalent })])),
  "CP-061|pork tenderloins, about 2 1/2 lb": Object.freeze({ type: "piece-count-with-shopping-weight", quantity: 2.5, unit: "pound", recipeName: "Pork tenderloin", canonicalName: "Pork Tenderloin", canonicalKey: "meat.pork.tenderloin", recipeQuantityText: "2 tenderloins (about 2 1/2 pounds)", shoppingQuantity: 2.5, shoppingUnit: "pound", shoppingEquivalent: "About 2 pork tenderloins totaling 2 1/2 pounds" }),
  "CP-065|pork shoulder roast": Object.freeze({ type: "display-range", quantity: 3.5, unit: "pound", recipeQuantityText: "3–4", recipeName: "Pork shoulder roast", canonicalName: "Pork Shoulder", canonicalKey: "meat.pork.shoulder", shoppingQuantity: 3.5, shoppingUnit: "pound", shoppingEquivalent: "One 3–4-pound pork shoulder roast" }),
  "CP-066|pork roast": Object.freeze({ type: "display-range", quantity: 3.5, unit: "pound", recipeQuantityText: "3–4", recipeName: "Pork roast", canonicalName: "Pork Roast", canonicalKey: "meat.pork.roast", shoppingQuantity: 3.5, shoppingUnit: "pound", shoppingEquivalent: "One 3–4-pound pork roast" }),
  "CP-067|country-style pork ribs": Object.freeze({ type: "display-range", quantity: 3.5, unit: "pound", recipeQuantityText: "3–4", recipeName: "Country-style pork ribs", canonicalName: "Pork Ribs - Country-Style", canonicalKey: "meat.pork.ribs.country-style", shoppingQuantity: 3.5, shoppingUnit: "pound", shoppingEquivalent: "3–4 pounds country-style pork ribs" }),
  "CP-069|fully cooked spiral ham, 7-8 lb": Object.freeze({ type: "display-range", quantity: 7.5, unit: "pound", recipeQuantityText: "7–8", recipeName: "Fully cooked spiral ham, 7-8 lb", canonicalName: "Ham - Spiral", canonicalKey: "meat.pork.ham.spiral", preparation: "fully cooked", shoppingQuantity: 7.5, shoppingUnit: "pound", shoppingEquivalent: "One 7–8-pound fully cooked spiral ham" }),
  ...Object.fromEntries(CP_061_080_ONE_SLICED_ONION_IDS.map((recipeId) => [`${recipeId}|${recipeId === "CP-061" || recipeId === "CP-062" || recipeId === "CP-064" ? "sliced onion" : "onion, sliced"}`, Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "sliced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" })])),
  ...Object.fromEntries(CP_061_080_ONE_DICED_ONION_IDS.map((recipeId) => [`${recipeId}|onion, diced`, Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" })])),
  "CP-063|onions, sliced": Object.freeze({ type: "default-medium-onion", quantity: 2, unit: "cup", recipeName: "Onions", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "sliced", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 medium onions" }),
  "CP-065|large onion, cut in wedges": Object.freeze({ type: "sized-onion", quantity: 1.5, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "cut in wedges", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 large onion" }),
  "CP-075|onions, sliced": Object.freeze({ type: "default-medium-onion", quantity: 2, unit: "cup", recipeName: "Onions", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "sliced", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 medium onions" }),
  "CP-063|apples, sliced": Object.freeze({ type: "prepared-produce-volume", quantity: 3, unit: "cup", recipeName: "Apples", canonicalName: "Apple", canonicalKey: "produce.apple", preparation: "sliced", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 medium apples", approximate: true }),
  "CP-066|apples, sliced": Object.freeze({ type: "prepared-produce-volume", quantity: 2, unit: "cup", recipeName: "Apples", canonicalName: "Apple", canonicalKey: "produce.apple", preparation: "sliced", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 medium apples", approximate: true }),
  "CP-065|carrots, cut in chunks": Object.freeze({ type: "prepared-produce-volume", quantity: 2, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "cut in chunks", shoppingQuantity: 4, shoppingUnit: "each", shoppingEquivalent: "About 4 carrots", approximate: true }),
  ...Object.fromEntries([["CP-070", "carrots, chopped"], ["CP-072", "carrots"], ["CP-077", "carrots"], ["CP-079", "carrots"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: name.includes("chopped") ? "chopped" : "prepared for soup", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 carrots", approximate: true })])),
  "CP-080|carrots": Object.freeze({ type: "prepared-produce-volume", quantity: 1.5, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "prepared for slow cooking", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 carrots", approximate: true }),
  ...Object.fromEntries(["CP-070", "CP-071", "CP-072", "CP-077", "CP-078", "CP-079"].map((recipeId) => [`${recipeId}|celery stalks`, Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Celery", canonicalName: "Celery", canonicalKey: "produce.celery", preparation: "chopped for soup", shoppingQuantity: 2, shoppingUnit: "stalk", shoppingEquivalent: "About 2 celery stalks", approximate: true })])),
  "CP-071|large potato, diced": Object.freeze({ type: "prepared-produce-volume", quantity: 1.5, unit: "cup", recipeName: "Potato", canonicalName: "Potato", canonicalKey: "produce.potato", preparation: "diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 large potato", approximate: true }),
  "CP-075|bell peppers, sliced": Object.freeze({ type: "prepared-produce-volume", quantity: 3, unit: "cup", recipeName: "Bell peppers", canonicalName: "Bell Pepper", canonicalKey: "produce.pepper.bell", preparation: "sliced", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 bell peppers", approximate: true }),
  "CP-080|small cabbage, chopped": Object.freeze({ type: "prepared-produce-volume", quantity: 4, unit: "cup", recipeName: "Cabbage", canonicalName: "Cabbage", canonicalKey: "produce.cabbage", preparation: "chopped", shoppingQuantity: 1, shoppingUnit: "head", shoppingEquivalent: "About 1 small head cabbage", approximate: true }),
  "CP-067|Worcestershire": Object.freeze({ type: "naming-standard", recipeName: "Worcestershire sauce", canonicalName: "Worcestershire Sauce", canonicalKey: "condiment.sauce.worcestershire" }),
  "CP-070|diced ham": Object.freeze({ type: "cooked-ham-yield", shoppingQuantity: 12, shoppingUnit: "ounce", shoppingEquivalent: "About 12 ounces diced ham", approximate: true }),
  "CP-071|diced ham": Object.freeze({ type: "cooked-ham-yield", shoppingQuantity: 9, shoppingUnit: "ounce", shoppingEquivalent: "About 9 ounces diced ham", approximate: true }),
  "CP-072|diced ham": Object.freeze({ type: "cooked-ham-yield", shoppingQuantity: 12, shoppingUnit: "ounce", shoppingEquivalent: "About 12 ounces diced ham", approximate: true }),
  "CP-073|diced ham": Object.freeze({ type: "cooked-ham-yield", shoppingQuantity: 18, shoppingUnit: "ounce", shoppingEquivalent: "About 18 ounces diced ham", approximate: true }),
  "CP-073|shredded cheddar": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Cheddar cheese", canonicalName: "Cheese - Cheddar", canonicalKey: "dairy.cheese.cheddar", preparation: "shredded", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces cheddar cheese", approximate: true }),
});

export const CP_061_080_REVIEW_FLAGS = Object.freeze({
  ...Object.fromEntries(CP_061_080_PACKAGE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Source card gives a can or packet count but no package size; count is retained without guessing an ounce equivalent."])),
  ...Object.fromEntries(CP_061_080_MISSING_QUANTITY_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Source card does not provide a usable quantity; the ingredient remains visible without an invented amount."])),
  ...Object.fromEntries(CP_061_080_MISSING_WEIGHT_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Source card gives a piece or rack count but no meat weight; count is retained without guessing pounds or ounces."])),
});

const CP_081_100_PACKAGE_ROWS = Object.freeze([
  ["CP-086", "crushed tomatoes", 2, "Two cans crushed tomatoes—can sizes not specified"],
  ["CP-087", "diced tomatoes", 2, "Two cans diced tomatoes—can sizes not specified"],
  ["CP-087", "kidney beans", 1, "One can kidney beans—can size not specified"],
  ["CP-087", "cannellini beans", 1, "One can cannellini beans—can size not specified"],
  ["CP-088", "diced tomatoes", 1, "One can diced tomatoes—can size not specified"],
  ["CP-088", "beans", 2, "Two cans beans—bean variety and can sizes not specified"],
  ["CP-094", "diced tomatoes", 2, "Two cans diced tomatoes—can sizes not specified"],
  ["CP-095", "crushed tomatoes", 2, "Two cans crushed tomatoes—can sizes not specified"],
  ["CP-096", "crushed tomatoes", 1, "One can crushed tomatoes—can size not specified"],
  ["CP-097", "tomato sauce", 2, "Two cans tomato sauce—can sizes not specified"],
  ["CP-098", "white beans", 3, "Three cans white beans—can sizes not specified"],
  ["CP-098", "green chiles", 2, "Two cans green chiles—can sizes not specified"],
  ["CP-099", "green chiles", 2, "Two cans green chiles—can sizes not specified"],
  ["CP-100", "diced tomatoes", 1, "One can diced tomatoes—can size not specified"],
]);

const CP_081_100_MISSING_QUANTITY_ROWS = Object.freeze([
  ["CP-082", "salt & pepper"], ["CP-083", "parsley"], ["CP-086", "Parmesan"],
  ["CP-087", "green beans"], ["CP-087", "zucchini"], ["CP-088", "Italian seasoning"],
  ["CP-091", "thyme"], ["CP-091", "bay leaf"], ["CP-092", "bacon and chives"],
  ["CP-093", "thyme"], ["CP-093", "cheddar"], ["CP-094", "Worcestershire"],
  ["CP-095", "Worcestershire"], ["CP-095", "hot sauce"], ["CP-096", "salt"],
  ["CP-097", "Worcestershire"], ["CP-099", "cumin"], ["CP-099", "oregano"],
  ["CP-100", "cumin"], ["CP-100", "oregano"], ["CP-100", "bay leaf"], ["CP-100", "lime"],
]);

export const CP_081_100_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(CP_081_100_PACKAGE_ROWS.map(([recipeId, name, quantity, shoppingEquivalent]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-package-size", quantity, unit: "can", shoppingEquivalent })])),
  ...Object.fromEntries(CP_081_100_MISSING_QUANTITY_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-source-quantity", quantity: null, unit: "", ...(name === "Worcestershire" ? { recipeName: "Worcestershire sauce", canonicalName: "Worcestershire Sauce", canonicalKey: "condiment.sauce.worcestershire" } : {}), shoppingEquivalent: `${name === "Worcestershire" ? "Worcestershire sauce" : name[0].toUpperCase() + name.slice(1)}—quantity not specified` })])),
  "CP-083|chicken breasts": Object.freeze({ type: "recipe-facing-name-preserved", recipeName: "chicken breasts", recipeUnit: "lb", canonicalName: "Chicken Breast", canonicalKey: "meat.chicken.breast" }),
  "CP-084|onion, diced": Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" }),
  "CP-085|onion, diced": Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" }),
  "CP-083|carrots": Object.freeze({ type: "prepared-produce-volume", quantity: 1.5, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "prepared for soup", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 carrots", approximate: true }),
  "CP-084|carrots, shredded": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "shredded", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 carrots", approximate: true }),
  ...Object.fromEntries([["CP-087", "carrots"], ["CP-088", "carrots"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "prepared for soup", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 carrots", approximate: true })])),
  "CP-091|carrots": Object.freeze({ type: "prepared-produce-volume", quantity: 1.5, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "prepared for soup", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 carrots", approximate: true }),
  ...Object.fromEntries([["CP-083", 1.5, 3], ["CP-091", 1.5, 3], ["CP-087", 1, 2], ["CP-088", 1, 2], ["CP-092", 1, 2]].map(([recipeId, quantity, stalks]) => [`${recipeId}|celery stalks`, Object.freeze({ type: "prepared-produce-volume", quantity, unit: "cup", recipeName: "Celery", canonicalName: "Celery", canonicalKey: "produce.celery", preparation: "chopped for soup", shoppingQuantity: stalks, shoppingUnit: "stalk", shoppingEquivalent: `About ${stalks} celery stalks`, approximate: true })])),
  "CP-081|corn, cut": Object.freeze({ type: "whole-produce", quantity: 4, unit: "ear", recipeName: "Corn", canonicalName: "Corn", canonicalKey: "produce.corn", preparation: "ears cut into sections", shoppingQuantity: 4, shoppingUnit: "ear", shoppingEquivalent: "Four ears corn" }),
  "CP-082|Eggs": Object.freeze({ type: "whole-item", quantity: 10, unit: "each", recipeName: "Eggs", canonicalName: "Egg", canonicalKey: "dairy.egg" }),
  "CP-082|cheddar": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Cheddar cheese", canonicalName: "Cheese - Cheddar", canonicalKey: "dairy.cheese.cheddar", preparation: "shredded for casserole", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces cheddar cheese", approximate: true }),
  "CP-084|cheddar": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Cheddar cheese", canonicalName: "Cheese - Cheddar", canonicalKey: "dairy.cheese.cheddar", preparation: "shredded", shoppingQuantity: 12, shoppingUnit: "ounce", shoppingEquivalent: "About 12 ounces cheddar cheese", approximate: true }),
  "CP-085|shredded cheddar cheese": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Cheddar cheese", canonicalName: "Cheese - Cheddar", canonicalKey: "dairy.cheese.cheddar", preparation: "shredded", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces cheddar cheese", approximate: true }),
  "CP-090|shredded Gruyére cheese": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Gruyère cheese", canonicalName: "Cheese - Gruyère", canonicalKey: "dairy.cheese.gruyere", preparation: "shredded", shoppingQuantity: 6, shoppingUnit: "ounce", shoppingEquivalent: "About 6 ounces Gruyère cheese", approximate: true }),
  "CP-085|cooked bacon, crumbled": Object.freeze({ type: "cooked-bacon-yield", recipeName: "Bacon", canonicalName: "Bacon", canonicalKey: "pork.bacon", preparation: "cooked and crumbled", shoppingQuantity: 6, shoppingUnit: "ounce", shoppingEquivalent: "About 6 ounces raw bacon", approximate: true }),
  "CP-083|long-grain rice": Object.freeze({ type: "cook-separately", recipeName: "Long-grain rice", canonicalName: "Rice - Long-Grain", canonicalKey: "grain.rice.long-grain", preparation: "cook separately; reserve until finishing", shoppingQuantity: 1, shoppingUnit: "cup", shoppingEquivalent: "1 cup dry long-grain rice" }),
  "CP-087|small pasta": Object.freeze({ type: "cook-separately", recipeName: "Small pasta", canonicalName: "Pasta - Small", canonicalKey: "grain.pasta.small", preparation: "cook separately; reserve until finishing", shoppingQuantity: 1, shoppingUnit: "cup", shoppingEquivalent: "1 cup dry small pasta" }),
  "CP-088|ditalini": Object.freeze({ type: "cook-separately", recipeName: "Ditalini", canonicalName: "Pasta - Ditalini", canonicalKey: "grain.pasta.ditalini", preparation: "cook separately; reserve until finishing", shoppingQuantity: 1, shoppingUnit: "cup", shoppingEquivalent: "1 cup dry ditalini" }),
  "CP-089|Italian sausage, browned": Object.freeze({ type: "preparation-separated", recipeName: "Italian sausage", canonicalName: "Sausage - Italian", canonicalKey: "meat.sausage.italian", preparation: "browned" }),
});

export const CP_081_100_REVIEW_FLAGS = Object.freeze({
  ...Object.fromEntries(CP_081_100_PACKAGE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, name === "beans" ? "Source card does not specify the bean variety or can sizes; both can count and generic identity are retained without guessing." : "Source card gives a can count but no package size; count is retained without guessing an ounce equivalent."])),
  ...Object.fromEntries(CP_081_100_MISSING_QUANTITY_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Source card does not provide a usable quantity; the ingredient remains visible without an invented amount."])),
});

const CP_101_120_PACKAGE_ROWS = Object.freeze([
  ["CP-101", "diced tomatoes", 1], ["CP-102", "diced tomatoes", 1], ["CP-103", "crushed tomatoes", 1],
  ["CP-104", "green chiles", 2], ["CP-106", "diced tomatoes", 1], ["CP-108", "enchilada sauce", 2],
  ["CP-108", "black beans", 1], ["CP-108", "corn", 1], ["CP-108", "diced tomatoes", 1],
  ["CP-109", "black beans", 1], ["CP-109", "corn", 1], ["CP-110", "corn, drained", 1],
  ["CP-110", "black beans, drained and rinsed", 1], ["CP-110", "diced tomatoes", 1], ["CP-110", "taco seasoning", 1, "package"],
  ["CP-110", "cornbread mix", 2, "box"], ["CP-111", "diced tomatoes", 1], ["CP-111", "corn", 1],
  ["CP-111", "black beans", 1], ["CP-112", "black beans", 1], ["CP-112", "corn", 1],
  ["CP-112", "diced tomatoes", 1], ["CP-114", "diced tomatoes", 2], ["CP-115", "crushed tomatoes", 1],
  ["CP-118", "cream of mushroom soup", 1], ["CP-119", "diced tomatoes", 1],
]);

const CP_101_120_MISSING_QUANTITY_ROWS = Object.freeze([
  ["CP-101", "lime"], ["CP-102", "lime"], ["CP-104", "cumin"], ["CP-104", "oregano"], ["CP-104", "lime"],
  ["CP-106", "cumin"], ["CP-106", "oregano"], ["CP-106", "cinnamon"], ["CP-106", "bay leaf"], ["CP-107", "salt"],
  ["CP-108", "cumin"], ["CP-108", "chili powder"], ["CP-108", "cream cheese"], ["CP-109", "onion"], ["CP-109", "taco seasoning"],
  ["CP-110", "Eggs and milk per mix instructions"], ["CP-111", "taco seasoning"], ["CP-111", "cheddar"],
  ["CP-112", "onion"], ["CP-112", "taco seasoning"], ["CP-113", "salt"], ["CP-114", "cumin"],
  ["CP-114", "oregano"], ["CP-114", "cilantro"], ["CP-115", "Italian seasoning"], ["CP-115", "balsamic vinegar"],
  ["CP-116", "garlic"], ["CP-116", "Italian seasoning"], ["CP-117", "garlic"], ["CP-117", "parsley"],
  ["CP-118", "garlic powder"], ["CP-118", "pepper"],
]);

export const CP_101_120_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(CP_101_120_PACKAGE_ROWS.map(([recipeId, name, quantity, packageUnit = "can"]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-package-size", quantity, unit: packageUnit, shoppingEquivalent: `${quantity === 1 ? "One" : quantity === 2 ? "Two" : quantity} ${quantity === 1 ? packageUnit : `${packageUnit}s`} ${name.replace(/,.*$/, "")}—${packageUnit} size${quantity === 1 ? "" : "s"} not specified` })])),
  "CP-110|cornbread mix": Object.freeze({ type: "missing-package-size", quantity: 2, unit: "box", shoppingEquivalent: "Two boxes cornbread mix—box sizes not specified" }),
  ...Object.fromEntries(CP_101_120_MISSING_QUANTITY_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: name === "Eggs and milk per mix instructions" ? "dependent-package-instructions" : "missing-source-quantity", quantity: null, unit: "", shoppingEquivalent: name === "Eggs and milk per mix instructions" ? "Eggs and milk required by selected cornbread mix—amounts depend on package instructions" : `${name[0].toUpperCase()}${name.slice(1)}—quantity not specified` })])),
  "CP-108|cream cheese": Object.freeze({ type: "missing-source-quantity", quantity: null, unit: "", recipeName: "cream cheese", canonicalName: "Cheese - Cream Cheese", canonicalKey: "dairy.cheese.cream-cheese", shoppingEquivalent: "Cream cheese—quantity not specified" }),
  "CP-120|Italian seasoning": Object.freeze({ type: "missing-source-unit", quantity: 1, unit: "each", recipeName: "Italian seasoning", canonicalName: "Italian Seasoning", canonicalKey: "pantry.seasoning.italian", shoppingEquivalent: "1 Italian seasoning—unit not specified" }),
  "CP-101|bell peppers, sliced": Object.freeze({ type: "prepared-produce-volume", quantity: 3, unit: "cup", recipeName: "Bell peppers", canonicalName: "Bell Pepper", canonicalKey: "produce.pepper.bell", preparation: "sliced", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 bell peppers", approximate: true }),
  "CP-101|onions, sliced": Object.freeze({ type: "default-medium-onion", quantity: 2, unit: "cup", recipeName: "Onions", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "sliced", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 medium onions" }),
  "CP-103|onion, sliced": Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "sliced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" }),
  ...Object.fromEntries([["CP-107", "onion, diced"], ["CP-110", "onion, diced"], ["CP-119", "onion, diced"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" })])),
  "CP-113|onion, quartered": Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "quartered", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" }),
  "CP-115|carrots": Object.freeze({ type: "prepared-produce-volume", quantity: 2, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "prepared for pot roast", shoppingQuantity: 4, shoppingUnit: "each", shoppingEquivalent: "About 4 carrots", approximate: true }),
  "CP-115|chuck roast": Object.freeze({ type: "display-range", quantity: 3.5, unit: "pound", recipeQuantityText: "3–4", recipeName: "Chuck roast", canonicalName: "Beef - Chuck", canonicalKey: "meat.beef.chuck", shoppingQuantity: 3.5, shoppingUnit: "pound", shoppingEquivalent: "One 3–4-pound chuck roast" }),
  "CP-109|cheddar": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Cheddar cheese", canonicalName: "Cheese - Cheddar", canonicalKey: "dairy.cheese.cheddar", preparation: "shredded", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces cheddar cheese", approximate: true }),
  "CP-110|shredded cheddar cheese": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Cheddar cheese", canonicalName: "Cheese - Cheddar", canonicalKey: "dairy.cheese.cheddar", preparation: "shredded", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About 4 ounces cheddar cheese", approximate: true }),
  "CP-112|cheese": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Cheese", canonicalName: "Cheese", canonicalKey: "dairy.cheese", preparation: "shredded", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces cheese—variety not specified", approximate: true }),
  "CP-116|Parmesan": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Parmesan cheese", canonicalName: "Cheese - Parmesan", canonicalKey: "dairy.cheese.parmesan", preparation: "grated", shoppingQuantity: 2, shoppingUnit: "ounce", shoppingEquivalent: "About 2 ounces Parmesan cheese", approximate: true }),
  "CP-117|Parmesan": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Parmesan cheese", canonicalName: "Cheese - Parmesan", canonicalKey: "dairy.cheese.parmesan", preparation: "grated", shoppingQuantity: 2, shoppingUnit: "ounce", shoppingEquivalent: "About 2 ounces Parmesan cheese", approximate: true }),
  "CP-116|mozzarella": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Mozzarella cheese", canonicalName: "Cheese - Mozzarella", canonicalKey: "dairy.cheese.mozzarella", preparation: "shredded", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces mozzarella cheese", approximate: true }),
  "CP-119|shredded mozzarella": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Mozzarella cheese", canonicalName: "Cheese - Mozzarella", canonicalKey: "dairy.cheese.mozzarella", preparation: "shredded", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About 4 ounces mozzarella cheese", approximate: true }),
  "CP-120|Parmesan": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Parmesan cheese", canonicalName: "Cheese - Parmesan", canonicalKey: "dairy.cheese.parmesan", preparation: "grated", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About 4 ounces Parmesan cheese", approximate: true }),
  "CP-112|cooked rice": Object.freeze({ type: "cooked-rice-yield", recipeName: "Cooked rice", canonicalName: "Rice", canonicalKey: "grain.rice", preparation: "cooked", shoppingQuantity: 0.3333333333, shoppingUnit: "cup", shoppingEquivalent: "About 1/3 cup dry rice", approximate: true }),
  "CP-118|egg noodles": Object.freeze({ type: "cook-separately", recipeName: "Egg noodles", canonicalName: "Pasta - Egg Noodles", canonicalKey: "grain.pasta.egg-noodles", preparation: "cook separately for serving" }),
  "CP-119|refrigerated cheese tortellini": Object.freeze({ type: "finish-later", recipeName: "Cheese tortellini", canonicalName: "Pasta - Cheese Tortellini", canonicalKey: "grain.pasta.cheese-tortellini", preparation: "refrigerated; add during finishing" }),
  "CP-120|fettuccine": Object.freeze({ type: "cook-separately", recipeName: "fettuccine", recipeUnit: "oz", canonicalName: "Pasta - Fettuccine", canonicalKey: "grain.pasta.fettuccine", preparation: "cook separately for serving" }),
});

export const CP_101_120_REVIEW_FLAGS = Object.freeze({
  ...Object.fromEntries(CP_101_120_PACKAGE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Source card gives a package count but no package size; count is retained without guessing an ounce equivalent."])),
  ...Object.fromEntries(CP_101_120_MISSING_QUANTITY_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, name === "Eggs and milk per mix instructions" ? "Required amounts depend on the selected cornbread mix package instructions and cannot be calculated from the source card." : "Source card does not provide a usable quantity; the ingredient remains visible without an invented amount."])),
  "CP-120|Italian seasoning": "Source card gives a quantity of 1 but no unit; no teaspoon, tablespoon, packet, or other unit is inferred.",
});

const CP_121_140_PACKAGE_ROWS = Object.freeze([
  ["CP-122", "crushed tomatoes", 2, "can"], ["CP-128", "pineapple chunks", 1, "can"],
  ["CP-131", "diced tomatoes", 1, "can"], ["CP-131", "coconut milk", 1, "can"],
  ["CP-132", "Japanese curry roux", 1, "package"], ["CP-133", "water chestnuts", 1, "can"],
  ["CP-135", "pineapple chunks", 1, "can"], ["CP-137", "stuffing mix", 1, "box"],
  ["CP-137", "cream of chicken soup", 1, "can"], ["CP-140", "cream soup", 1, "can"],
]);

const CP_121_140_MISSING_QUANTITY_ROWS = Object.freeze([
  ["CP-121", "garlic"], ["CP-121", "Italian seasoning"],
  ["CP-122", "garlic"], ["CP-122", "tomato paste"], ["CP-122", "Italian seasoning"], ["CP-122", "milk"],
  ["CP-123", "Italian seasoning"], ["CP-124", "spinach"], ["CP-124", "Italian seasoning"],
  ["CP-125", "salt"], ["CP-125", "Italian seasoning"],
  ["CP-126", "onion"], ["CP-126", "Italian seasoning"], ["CP-126", "Parmesan"],
  ["CP-128", "garlic"], ["CP-128", "cornstarch"],
  ["CP-130", "ginger"], ["CP-130", "red curry paste"], ["CP-130", "garlic"],
  ["CP-131", "onion"], ["CP-131", "garlic"], ["CP-131", "ginger"], ["CP-131", "salt"],
  ["CP-132", "soy sauce"],
  ["CP-133", "garlic"], ["CP-133", "ginger"], ["CP-133", "rice vinegar"], ["CP-133", "sesame oil"],
  ["CP-135", "garlic"], ["CP-135", "ginger"], ["CP-135", "cornstarch"], ["CP-135", "sesame seeds"],
  ["CP-137", "salt and pepper"], ["CP-138", "garlic"], ["CP-138", "Italian seasoning"],
  ["CP-139", "onion"], ["CP-139", "carrots"], ["CP-139", "celery"], ["CP-139", "garlic"], ["CP-139", "thyme"],
  ["CP-140", "onion"], ["CP-140", "garlic"], ["CP-140", "cheese optional"],
]);

export const CP_121_140_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(CP_121_140_PACKAGE_ROWS.map(([recipeId, name, quantity, packageUnit]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-package-size", quantity, unit: packageUnit, shoppingEquivalent: `${quantity === 1 ? "One" : quantity === 2 ? "Two" : quantity} ${quantity === 1 ? packageUnit : `${packageUnit}s`} ${name}—${packageUnit} size${quantity === 1 ? "" : "s"} not specified` })])),
  ...Object.fromEntries(CP_121_140_MISSING_QUANTITY_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-source-quantity", quantity: null, unit: "", shoppingEquivalent: `${name[0].toUpperCase()}${name.slice(1).replace(/ optional$/, "")}—quantity not specified` })])),
  "CP-121|sun-dried tomatoes": Object.freeze({ type: "unspecified-product-form", recipeName: "Sun-dried tomatoes", canonicalName: "Tomato - Sun-Dried", canonicalKey: "produce.tomato.sun-dried", shoppingEquivalent: "1 cup sun-dried tomatoes—dry-packed or oil-packed not specified" }),
  "CP-122|carrots": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "prepared for sauce", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 carrots", approximate: true }),
  "CP-122|celery stalks": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Celery", canonicalName: "Celery", canonicalKey: "produce.celery", preparation: "prepared for sauce", shoppingQuantity: 2, shoppingUnit: "stalk", shoppingEquivalent: "About 2 celery stalks", approximate: true }),
  "CP-126|carrots": Object.freeze({ type: "prepared-produce-volume", quantity: 1.5, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "prepared for soup", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 carrots", approximate: true }),
  "CP-126|celery stalks": Object.freeze({ type: "prepared-produce-volume", quantity: 1.5, unit: "cup", recipeName: "Celery", canonicalName: "Celery", canonicalKey: "produce.celery", preparation: "prepared for soup", shoppingQuantity: 3, shoppingUnit: "stalk", shoppingEquivalent: "About 3 celery stalks", approximate: true }),
  "CP-131|carrots": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "prepared for curry", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 carrots", approximate: true }),
  "CP-132|carrots": Object.freeze({ type: "prepared-produce-volume", quantity: 1.5, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "prepared for curry", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 carrots", approximate: true }),
  "CP-132|apple, grated": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Apple", canonicalName: "Apple", canonicalKey: "produce.fruit.apple", preparation: "grated", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium apple", approximate: true }),
  "CP-134|scallions, sliced": Object.freeze({ type: "prepared-produce-volume", quantity: 0.25, unit: "cup", recipeName: "Scallions", canonicalName: "Green Onion", canonicalKey: "produce.onion.green", preparation: "sliced", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "About 2 scallions", approximate: true }),
  "CP-134|pork tenderloins": Object.freeze({ type: "missing-total-weight", quantity: 2, unit: "each", recipeName: "Pork tenderloins", canonicalName: "Pork Tenderloin", canonicalKey: "meat.pork.tenderloin", shoppingEquivalent: "Two pork tenderloins—total weight not specified" }),
  "CP-123|mozzarella": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Mozzarella cheese", canonicalName: "Cheese - Mozzarella", canonicalKey: "dairy.cheese.mozzarella", preparation: "shredded", shoppingQuantity: 12, shoppingUnit: "ounce", shoppingEquivalent: "About 12 ounces mozzarella cheese", approximate: true }),
  ...Object.fromEntries([["CP-124", "mozzarella", 8], ["CP-125", "mozzarella", 12]].map(([recipeId, name, ounces]) => [`${recipeId}|${name}`, Object.freeze({ type: "shredded-cheese-yield", recipeName: "Mozzarella cheese", canonicalName: "Cheese - Mozzarella", canonicalKey: "dairy.cheese.mozzarella", preparation: "shredded", shoppingQuantity: ounces, shoppingUnit: "ounce", shoppingEquivalent: `About ${ounces} ounces mozzarella cheese`, approximate: true })])),
  ...Object.fromEntries([["CP-121", "Parmesan"], ["CP-123", "Parmesan"], ["CP-124", "Parmesan"], ["CP-125", "Parmesan"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "shredded-cheese-yield", recipeName: "Parmesan cheese", canonicalName: "Cheese - Parmesan", canonicalKey: "dairy.cheese.parmesan", preparation: "grated", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About 4 ounces Parmesan cheese", approximate: true })])),
  "CP-124|Eggs": Object.freeze({ type: "whole-item", quantity: 1, unit: "each", recipeName: "Egg", canonicalName: "Egg", canonicalKey: "dairy.egg", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "One egg" }),
  "CP-126|acini di pepe": Object.freeze({ type: "cook-separately", recipeName: "Acini di pepe", canonicalName: "Pasta - Acini di Pepe", canonicalKey: "grain.pasta.acini-di-pepe", preparation: "dry; cook separately; reserve until finishing", shoppingQuantity: 1, shoppingUnit: "cup", shoppingEquivalent: "1 cup dry acini di pepe" }),
  "CP-124|jumbo shells, cooked": Object.freeze({ type: "whole-item", quantity: 24, unit: "each", recipeName: "Jumbo pasta shells", canonicalName: "Pasta - Jumbo Shells", canonicalKey: "grain.pasta.jumbo-shells", preparation: "cooked", shoppingQuantity: 24, shoppingUnit: "each", shoppingEquivalent: "One package containing at least 24 jumbo shells" }),
  "CP-139|wild rice blend": Object.freeze({ type: "dry-grain-measure", recipeName: "Wild rice blend", canonicalName: "Rice - Wild Rice Blend", canonicalKey: "grain.rice.wild-blend", preparation: "measured dry", shoppingQuantity: 1, shoppingUnit: "cup", shoppingEquivalent: "1 cup dry wild rice blend" }),
  "CP-140|long-grain rice": Object.freeze({ type: "dry-grain-measure", recipeName: "Long-grain rice", canonicalName: "Rice - Long-Grain", canonicalKey: "grain.rice.long-grain", preparation: "measured dry", shoppingQuantity: 1, shoppingUnit: "cup", shoppingEquivalent: "1 cup dry long-grain rice" }),
});

export const CP_121_140_REVIEW_FLAGS = Object.freeze({
  ...Object.fromEntries(CP_121_140_PACKAGE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Source card gives a package count but no package size; count is retained without guessing an ounce equivalent."])),
  ...Object.fromEntries(CP_121_140_MISSING_QUANTITY_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Source card does not provide a usable quantity; the ingredient remains visible without an invented amount."])),
  "CP-121|sun-dried tomatoes": "Source card does not specify dry-packed or oil-packed sun-dried tomatoes; the generic identity and measured cup are retained.",
  "CP-134|pork tenderloins": "Source card gives two pork tenderloins but no total weight; the whole-item count is retained without guessing pounds or ounces.",
});

export const CP_121_140_RECIPE_REVIEW_FLAGS = Object.freeze({
  "CP-125": "Directions require eggplant, but the source ingredient list contains no eggplant or quantity; no ingredient row is invented.",
});

const CP_141_160_PACKAGE_ROWS = Object.freeze([
  ["CP-144", "diced tomatoes", 1, "can"], ["CP-145", "tomatoes", 1, "can"],
  ["CP-146", "tomatoes", 2, "can"], ["CP-147", "kidney beans", 1, "can"],
  ["CP-147", "tomatoes", 1, "can"], ["CP-149", "hash browns", 1, "bag"],
  ["CP-149", "beans", 1, "can"], ["CP-149", "cream soup", 1, "can"],
  ["CP-151", "hash browns", 1, "bag"], ["CP-152", "hash browns", 1, "bag"],
  ["CP-154", "biscuits, quartered", 2, "can"], ["CP-156", "cinnamon rolls, quartered", 2, "can"],
  ["CP-157", "evaporated milk", 1, "can"], ["CP-158", "cream soup", 1, "can"],
]);

const CP_141_160_MISSING_QUANTITY_ROWS = Object.freeze([
  ["CP-141", "onion"], ["CP-141", "Worcestershire"], ["CP-141", "garlic"], ["CP-141", "thyme"],
  ["CP-142", "onion"], ["CP-142", "garlic"], ["CP-142", "paprika"], ["CP-142", "thyme"],
  ["CP-143", "onion"], ["CP-143", "Dijon mustard"], ["CP-143", "caraway (optional)"],
  ["CP-144", "bell pepper"], ["CP-144", "onion"], ["CP-144", "garlic"], ["CP-144", "paprika"],
  ["CP-145", "peppers"], ["CP-145", "onion"], ["CP-145", "Cajun seasoning"],
  ["CP-146", "onion"], ["CP-146", "garlic"], ["CP-146", "paprika"],
  ["CP-147", "onion"], ["CP-147", "seasoning"],
  ["CP-148", "vanilla"], ["CP-149", "onion"], ["CP-149", "taco seasoning"],
  ["CP-150", "cinnamon"], ["CP-150", "vanilla"], ["CP-150", "salt"],
  ["CP-151", "bell pepper"], ["CP-151", "onion"], ["CP-151", "salt and pepper"],
  ["CP-152", "onion"], ["CP-152", "mustard"], ["CP-152", "salt and pepper"],
  ["CP-153", "brown sugar"], ["CP-153", "cinnamon"], ["CP-153", "vanilla"], ["CP-153", "butter"],
  ["CP-154", "butter"], ["CP-154", "black pepper"], ["CP-154", "salt"],
  ["CP-155", "green chiles"], ["CP-155", "enchilada sauce"], ["CP-156", "maple syrup"],
  ["CP-157", "mustard powder"], ["CP-157", "salt and pepper"],
  ["CP-158", "onion"], ["CP-158", "salt and pepper"],
  ["CP-159", "salt"], ["CP-159", "bacon"], ["CP-159", "scallions"],
  ["CP-160", "salt and pepper"], ["CP-160", "parsley"],
]);

export const CP_141_160_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(CP_141_160_PACKAGE_ROWS.map(([recipeId, name, quantity, packageUnit]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-package-size", quantity, unit: packageUnit === "bag" ? "package" : packageUnit, shoppingQuantity: quantity, shoppingUnit: packageUnit, shoppingEquivalent: `${quantity === 1 ? "One" : quantity === 2 ? "Two" : quantity} ${quantity === 1 ? packageUnit : `${packageUnit}s`} ${name.replace(/,.*$/, "")}—${packageUnit} size${quantity === 1 ? "" : "s"} not specified` })])),
  ...Object.fromEntries(CP_141_160_MISSING_QUANTITY_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-source-quantity", quantity: null, unit: "", shoppingEquivalent: `${name.replace(/ \(optional\)$/, "")[0].toUpperCase()}${name.replace(/ \(optional\)$/, "").slice(1)}—quantity not specified` })])),
  "CP-142|thick pork chops": Object.freeze({ type: "missing-total-weight", quantity: 6, unit: "each", recipeName: "Pork chops", canonicalName: "Pork Chop", canonicalKey: "meat.pork.chop", preparation: "thick-cut", shoppingEquivalent: "Six thick pork chops—total weight not specified" }),
  "CP-146|cabbage, chopped": Object.freeze({ type: "uncertain-produce-yield", quantity: 1, unit: "head", recipeName: "Cabbage", canonicalName: "Cabbage", canonicalKey: "produce.cabbage", preparation: "chopped", shoppingQuantity: 1, shoppingUnit: "head", shoppingEquivalent: "One head cabbage—head size and prepared cup yield not specified" }),
  "CP-147|potatoes, sliced": Object.freeze({ type: "uncertain-produce-yield", quantity: 4, unit: "each", recipeName: "Potatoes", canonicalName: "Potato", canonicalKey: "produce.potato", preparation: "sliced", shoppingQuantity: 4, shoppingUnit: "each", shoppingEquivalent: "Four potatoes—potato size and prepared cup yield not specified" }),
  "CP-147|carrots": Object.freeze({ type: "prepared-produce-volume", quantity: 1.5, unit: "cup", recipeName: "Carrots", canonicalName: "Carrot", canonicalKey: "produce.carrot", preparation: "prepared for stew", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 carrots", approximate: true }),
  "CP-148|apples, diced": Object.freeze({ type: "prepared-produce-volume", quantity: 3, unit: "cup", recipeName: "Apples", canonicalName: "Apple", canonicalKey: "produce.fruit.apple", preparation: "diced", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "About 3 medium apples", approximate: true }),
  "CP-148|pinch salt": Object.freeze({ type: "pinch-measure", quantity: 1, unit: "pinch", recipeName: "Salt", canonicalName: "Salt", canonicalKey: "pantry.salt", shoppingQuantity: 1, shoppingUnit: "pinch", shoppingEquivalent: "A pinch of salt" }),
  "CP-153|brioche, cubed": Object.freeze({ type: "whole-item", quantity: 1, unit: "each", recipeName: "Brioche loaf", canonicalName: "Bread - Brioche", canonicalKey: "bread.brioche", preparation: "cubed", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "One loaf brioche" }),
  ...Object.fromEntries([["CP-149", "cheese", 4], ["CP-151", "cheese", 8], ["CP-152", "cheddar", 8], ["CP-155", "cheese", 8], ["CP-157", "cheddar", 16], ["CP-158", "cheddar", 8], ["CP-159", "cheddar", 8]].map(([recipeId, name, ounces]) => [`${recipeId}|${name}`, Object.freeze({ type: "shredded-cheese-yield", recipeName: name === "cheddar" ? "Cheddar cheese" : "Cheese", canonicalName: name === "cheddar" ? "Cheese - Cheddar" : "Cheese", canonicalKey: name === "cheddar" ? "dairy.cheese.cheddar" : "dairy.cheese", preparation: "shredded", shoppingQuantity: ounces, shoppingUnit: "ounce", shoppingEquivalent: `About ${ounces} ounces ${name === "cheddar" ? "cheddar cheese" : "cheese"}`, approximate: true })])),
  ...Object.fromEntries([["CP-151", 10], ["CP-152", 10], ["CP-153", 8], ["CP-155", 8], ["CP-156", 4]].map(([recipeId, quantity]) => [`${recipeId}|Eggs`, Object.freeze({ type: "whole-item", quantity, unit: "each", recipeName: "Eggs", canonicalName: "Egg", canonicalKey: "dairy.egg", shoppingQuantity: quantity, shoppingUnit: "each", shoppingEquivalent: `${quantity} eggs` })])),
  "CP-155|tortillas": Object.freeze({ type: "whole-item", quantity: 10, unit: "each", recipeName: "Tortillas", canonicalName: "Tortilla", canonicalKey: "bread.tortilla", shoppingQuantity: 10, shoppingUnit: "each", shoppingEquivalent: "10 tortillas" }),
  ...Object.fromEntries([["CP-159", "butter"], ["CP-160", "butter"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "butter-stick-equivalent", recipeName: "Butter", canonicalName: "Butter", canonicalKey: "dairy.butter", shoppingQuantity: 1, shoppingUnit: "stick", shoppingEquivalent: "1 stick butter" })])),
  ...Object.fromEntries([["CP-144", "rice"], ["CP-145", "rice"], ["CP-146", "rice"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "dry-grain-measure", recipeName: "Rice", canonicalName: "Rice", canonicalKey: "grain.rice", preparation: "measured dry", shoppingQuantity: 1, shoppingUnit: "cup", shoppingEquivalent: "1 cup dry rice" })])),
  "CP-148|water or milk": Object.freeze({ type: "approved-substitution", recipeName: "Water or milk", canonicalName: "Water or Milk", canonicalKey: "choice.water-or-milk", acceptableAlternatives: ["Water", "Milk"], shoppingEquivalent: "7 cups water or milk—choose one" }),
  "CP-150|water or milk": Object.freeze({ type: "approved-substitution", recipeName: "Water or milk", canonicalName: "Water or Milk", canonicalKey: "choice.water-or-milk", acceptableAlternatives: ["Water", "Milk"], shoppingEquivalent: "7 cups water or milk—choose one" }),
  "CP-156|included icing": Object.freeze({ type: "included-package-component", quantity: null, unit: "", recipeName: "Included icing", canonicalName: "Cinnamon Roll Icing", canonicalKey: "package.cinnamon-roll.icing", preparation: "included with cinnamon rolls", shoppingEquivalent: "Included with the cinnamon-roll packages", excludeFromShopping: true }),
});

export const CP_141_160_REVIEW_FLAGS = Object.freeze({
  ...Object.fromEntries(CP_141_160_PACKAGE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, name === "beans" ? "Source card gives a can count but specifies neither bean variety nor can size; both remain unresolved." : /cream soup/.test(name) ? "Source card gives a can count but specifies neither cream-soup variety nor can size; both remain unresolved." : "Source card gives a package count but no package size; the count is retained without guessing an ounce equivalent."])),
  ...Object.fromEntries(CP_141_160_MISSING_QUANTITY_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, name === "peppers" ? "Source card provides neither a quantity nor a pepper variety; the generic ingredient remains visible without guessing." : name === "seasoning" ? "Source card provides neither a quantity nor a seasoning variety; the generic ingredient remains visible without guessing." : "Source card does not provide a usable quantity; the ingredient remains visible without an invented amount."])),
  "CP-142|thick pork chops": "Source card gives six thick pork chops but no total weight; the whole-item count is retained without guessing pounds or ounces.",
  "CP-146|cabbage, chopped": "Source card gives one chopped cabbage head but no head size; a prepared cup yield is not inferred.",
  "CP-147|potatoes, sliced": "Source card gives four sliced potatoes but no potato size; a prepared cup yield is not inferred.",
});

const CP_161_180_PACKAGE_ROWS = Object.freeze([
  ["CP-162", "cream mushroom soup", 2, "can"], ["CP-168", "baked beans", 4, "can"],
  ["CP-172", "yellow cake mix", 1, "box"], ["CP-173", "cherry pie filling", 2, "can"],
  ["CP-173", "yellow cake mix", 1, "box"], ["CP-174", "cake mix", 1, "box"],
  ["CP-175", "chocolate cake mix", 1, "box"], ["CP-175", "chocolate pudding mix", 1, "box"],
  ["CP-176", "chocolate cake mix", 1, "box"], ["CP-180", "spice cake mix", 1, "box"],
  ["CP-180", "pumpkin puree", 1, "can"],
]);

const CP_161_180_MISSING_QUANTITY_ROWS = Object.freeze([
  ["CP-161", "onion"], ["CP-161", "garlic"], ["CP-161", "thyme"], ["CP-161", "salt and pepper"],
  ["CP-162", "soy sauce"], ["CP-162", "black pepper"], ["CP-163", "salt and pepper"],
  ["CP-164", "onion"], ["CP-164", "celery"], ["CP-164", "butter"], ["CP-164", "sage"], ["CP-164", "thyme"], ["CP-164", "salt and pepper"],
  ["CP-165", "onion"], ["CP-165", "garlic"], ["CP-165", "salt and pepper"], ["CP-166", "parsley"],
  ["CP-169", "onion"], ["CP-169", "garlic"], ["CP-169", "cumin"], ["CP-169", "chili powder"], ["CP-169", "salt after cooking"], ["CP-169", "bay leaves"],
  ["CP-171", "lemon juice"], ["CP-172", "cinnamon"], ["CP-172", "lemon juice"],
  ["CP-173", "almond extract"], ["CP-173", "cinnamon optional"], ["CP-174", "lemon zest"],
  ["CP-176", "chocolate chips"], ["CP-177", "vanilla"], ["CP-177", "cinnamon"],
  ["CP-178", "vanilla"], ["CP-178", "cinnamon"], ["CP-178", "walnuts optional"],
]);

const CP_161_180_DEPENDENT_ROWS = Object.freeze([
  ["CP-175", "eggs, oil and water as directed"], ["CP-176", "eggs, oil and water as directed"],
]);

export const CP_161_180_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries(CP_161_180_PACKAGE_ROWS.map(([recipeId, name, quantity, packageUnit]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-package-size", quantity, unit: packageUnit, shoppingEquivalent: `${quantity === 1 ? "One" : quantity === 2 ? "Two" : quantity} ${quantity === 1 ? packageUnit : `${packageUnit}s`} ${name}—${packageUnit} size${quantity === 1 ? "" : "s"} not specified` })])),
  ...Object.fromEntries(CP_161_180_MISSING_QUANTITY_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-source-quantity", quantity: null, unit: "", shoppingEquivalent: `${name.replace(/ optional$/, "")[0].toUpperCase()}${name.replace(/ optional$/, "").slice(1)}—quantity not specified` })])),
  ...Object.fromEntries(CP_161_180_DEPENDENT_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "dependent-package-instructions", quantity: null, unit: "", recipeName: "Eggs, oil, and water", canonicalName: "Cake Mix Add-Ins", canonicalKey: "package.cake-mix.add-ins", preparation: "amounts as directed on selected cake-mix package", shoppingEquivalent: "Eggs, oil, and water required by selected cake mix—amounts depend on package instructions" })])),
  "CP-167|smoked turkey leg": Object.freeze({ type: "missing-total-weight", quantity: 1, unit: "each", recipeName: "Smoked turkey leg", canonicalName: "Turkey Leg - Smoked", canonicalKey: "meat.turkey.leg.smoked", shoppingEquivalent: "One smoked turkey leg—weight not specified" }),
  "CP-170|ham hock": Object.freeze({ type: "missing-total-weight", quantity: 1, unit: "each", recipeName: "Ham hock", canonicalName: "Ham Hock", canonicalKey: "meat.pork.ham-hock", shoppingEquivalent: "One ham hock—weight not specified" }),
  "CP-180|cream cheese glaze": Object.freeze({ type: "unspecified-product-form", recipeName: "Cream cheese glaze", canonicalName: "Cream Cheese Glaze", canonicalKey: "topping.glaze.cream-cheese", shoppingEquivalent: "1 cup cream cheese glaze—prepared, homemade, or purchased form not specified" }),
  "CP-161|cheese": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Cheese", canonicalName: "Cheese", canonicalKey: "dairy.cheese", preparation: "shredded", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces cheese—variety not specified", approximate: true }),
  ...Object.fromEntries([["CP-167", "onion, chopped", "chopped"], ["CP-168", "onion, diced", "diced"], ["CP-170", "onion, diced", "diced"]].map(([recipeId, name, preparation]) => [`${recipeId}|${name}`, Object.freeze({ type: "default-medium-onion", quantity: 1, unit: "cup", recipeName: "Onion", canonicalName: "Onion", canonicalKey: "produce.onion", preparation, shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium onion" })])),
  "CP-170|bell pepper, diced": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Bell pepper", canonicalName: "Bell Pepper", canonicalKey: "produce.pepper.bell", preparation: "diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 bell pepper", approximate: true }),
  ...Object.fromEntries([["CP-171", "apples, sliced"], ["CP-179", "apples, sliced"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "prepared-produce-volume", quantity: 8, unit: "cup", recipeName: "Apples", canonicalName: "Apple", canonicalKey: "produce.fruit.apple", preparation: "sliced", shoppingQuantity: 8, shoppingUnit: "each", shoppingEquivalent: "About 8 medium apples", approximate: true })])),
  ...Object.fromEntries([["CP-163", "butter"], ["CP-171", "butter"], ["CP-172", "butter"], ["CP-173", "butter"], ["CP-174", "butter"], ["CP-177", "butter"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "butter-stick-equivalent", recipeName: "Butter", canonicalName: "Butter", canonicalKey: "dairy.butter", shoppingQuantity: 1, shoppingUnit: "stick", shoppingEquivalent: "1 stick butter" })])),
  "CP-166|butter": Object.freeze({ type: "butter-stick-equivalent", recipeName: "Butter", canonicalName: "Butter", canonicalKey: "dairy.butter", shoppingQuantity: 0.6666666667, shoppingUnit: "stick", shoppingEquivalent: "About 2/3 stick butter", approximate: true }),
  "CP-179|butter": Object.freeze({ type: "butter-stick-equivalent", recipeName: "Butter", canonicalName: "Butter", canonicalKey: "dairy.butter", shoppingQuantity: 0.5, shoppingUnit: "stick", shoppingEquivalent: "1/2 stick butter" }),
  "CP-166|pinch salt": Object.freeze({ type: "pinch-measure", quantity: 1, unit: "pinch", recipeName: "Salt", canonicalName: "Salt", canonicalKey: "pantry.salt", shoppingQuantity: 1, shoppingUnit: "pinch", shoppingEquivalent: "A pinch of salt" }),
  "CP-179|pinch salt": Object.freeze({ type: "pinch-measure", quantity: 1, unit: "pinch", recipeName: "Salt", canonicalName: "Salt", canonicalKey: "pantry.salt", shoppingQuantity: 1, shoppingUnit: "pinch", shoppingEquivalent: "A pinch of salt" }),
  "CP-169|water or broth": Object.freeze({ type: "approved-substitution", recipeName: "Water or broth", canonicalName: "Water or Broth", canonicalKey: "choice.water-or-broth", acceptableAlternatives: ["Water", "Broth"], shoppingEquivalent: "8 cups water or broth—choose one" }),
  "CP-177|day-old bread, cubed": Object.freeze({ type: "whole-item", quantity: 1, unit: "each", recipeName: "Day-old bread loaf", canonicalName: "Bread", canonicalKey: "bread.loaf", preparation: "day-old and cubed", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "One loaf bread" }),
  "CP-178|brioche, cubed": Object.freeze({ type: "whole-item", quantity: 1, unit: "each", recipeName: "Brioche loaf", canonicalName: "Bread - Brioche", canonicalKey: "bread.brioche", preparation: "cubed", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "One loaf brioche" }),
});

export const CP_161_180_REVIEW_FLAGS = Object.freeze({
  ...Object.fromEntries(CP_161_180_PACKAGE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, name === "cake mix" ? "Source card specifies neither cake-mix flavor nor box size; the generic identity and box count are retained." : "Source card gives a package count but no package size; the count is retained without guessing an ounce equivalent."])),
  ...Object.fromEntries(CP_161_180_MISSING_QUANTITY_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Source card does not provide a usable quantity; the ingredient remains visible without an invented amount."])),
  ...Object.fromEntries(CP_161_180_DEPENDENT_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Required egg, oil, and water amounts depend on the selected cake-mix package instructions and cannot be calculated from the source card."])),
  "CP-167|smoked turkey leg": "Source card gives one smoked turkey leg but no weight; the whole-item count is retained without guessing pounds or ounces.",
  "CP-170|ham hock": "Source card gives one ham hock but no weight; the whole-item count is retained without guessing pounds or ounces.",
  "CP-180|cream cheese glaze": "Source card gives a measured glaze amount but does not specify whether it is prepared, homemade, or purchased; the product form remains unresolved.",
});

const DM_001_020_PREPARED_COMPONENT_ROWS = Object.freeze([
  ["DM-002", "Prepared reduced-sodium stuffing"], ["DM-002", "Prepared mashed potatoes"],
  ["DM-012", "Cooked mashed sweet potatoes"], ["DM-012", "Prepared reduced-sodium stuffing"],
  ["DM-014", "Prepared light macaroni and cheese"], ["DM-015", "Prepared mashed potatoes"],
]);

const DM_001_020_COMPOSITE_PRODUCE_ROWS = Object.freeze([
  ["DM-006", "Broccoli, carrots, and red bell pepper"],
  ["DM-008", "Green beans and sliced carrots"],
  ["DM-009", "Broccoli florets and sliced carrots"],
  ["DM-020", "Broccoli florets and sliced carrots"],
]);

export const DM_001_020_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries([["DM-001", "Black pepper"], ["DM-002", "Black pepper"], ["DM-003", "Black pepper"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-source-quantity", quantity: null, unit: "", preparation: "to taste", shoppingEquivalent: "Black pepper—quantity not specified" })])),
  ...Object.fromEntries(DM_001_020_PREPARED_COMPONENT_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "unresolved-prepared-component", shoppingEquivalent: `${name}—underlying shopping ingredients depend on preparation method or selected product` })])),
  ...Object.fromEntries(DM_001_020_COMPOSITE_PRODUCE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "unresolved-composite-proportions", canonicalName: `Vegetable Blend - ${name}`, canonicalKey: `produce.blend.${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`, shoppingEquivalent: `${name}—individual proportions not specified` })])),
  "DM-010|Cooked brown rice and quinoa blend": Object.freeze({ type: "product-dependent-cooked-yield", canonicalName: "Brown Rice and Quinoa Blend", canonicalKey: "grain.blend.brown-rice-quinoa", preparation: "cooked", shoppingEquivalent: "1 1/2 cups cooked brown rice and quinoa blend—dry quantity and proportions depend on selected blend" }),
  "DM-008|Medium apple, peeled and diced": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Apple", canonicalName: "Apple", canonicalKey: "produce.fruit.apple", preparation: "peeled and diced", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 medium apple", approximate: true }),
  ...Object.fromEntries([["DM-004", "Cooked brown rice"], ["DM-006", "Cooked brown rice"], ["DM-007", "Cooked brown rice"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "cooked-rice-yield", recipeName: "Cooked brown rice", canonicalName: "Rice - Brown", canonicalKey: "grain.rice.brown", preparation: "cooked", shoppingQuantity: 0.6666666667, shoppingUnit: "cup", shoppingEquivalent: "About 2/3 cup dry brown rice", approximate: true })])),
  "DM-005|Cooked spaghetti": Object.freeze({ type: "cooked-pasta-yield", recipeName: "Cooked spaghetti", canonicalName: "Pasta - Spaghetti", canonicalKey: "grain.pasta.spaghetti", preparation: "cooked", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces dry spaghetti", approximate: true }),
  "DM-008|Cooked whole-wheat orzo": Object.freeze({ type: "cooked-pasta-yield", recipeName: "Cooked whole-wheat orzo", canonicalName: "Pasta - Whole-Wheat Orzo", canonicalKey: "grain.pasta.orzo.whole-wheat", preparation: "cooked", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About 4 ounces dry whole-wheat orzo", approximate: true }),
  "DM-009|Cooked Asian-style noodles": Object.freeze({ type: "cooked-pasta-yield", recipeName: "Cooked Asian-style noodles", canonicalName: "Noodles - Asian-Style", canonicalKey: "grain.noodles.asian-style", preparation: "cooked", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About 4 ounces dry Asian-style noodles", approximate: true }),
  "DM-016|Cooked short pasta": Object.freeze({ type: "cooked-pasta-yield", recipeName: "Cooked short pasta", canonicalName: "Pasta - Short", canonicalKey: "grain.pasta.short", preparation: "cooked", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About 4 ounces dry short pasta", approximate: true }),
  ...Object.fromEntries([["DM-003", "Grated Parmesan", 1, "Parmesan"], ["DM-005", "Shredded part-skim mozzarella", 2, "Part-Skim Mozzarella"], ["DM-007", "Shredded part-skim mozzarella", 2, "Part-Skim Mozzarella"], ["DM-017", "Shredded part-skim mozzarella", 2, "Part-Skim Mozzarella"], ["DM-018", "Shredded reduced-fat cheddar", 4, "Reduced-Fat Cheddar"]].map(([recipeId, name, ounces, variety]) => [`${recipeId}|${name}`, Object.freeze({ type: "shredded-cheese-yield", canonicalName: `Cheese - ${variety}`, canonicalKey: `dairy.cheese.${variety.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, shoppingQuantity: ounces, shoppingUnit: "ounce", shoppingEquivalent: `About ${ounces} ${ounces === 1 ? "ounce" : "ounces"} ${variety.toLowerCase()} cheese`, approximate: true })])),
  ...Object.fromEntries(["DM-005", "DM-006", "DM-007", "DM-008", "DM-009", "DM-010", "DM-011", "DM-012", "DM-013", "DM-017", "DM-019"].map((recipeId) => [`${recipeId}|Nonstick cooking spray`, Object.freeze({ type: "unmeasured-cooking-supply", quantity: null, unit: "", preparation: "as needed", shoppingEquivalent: "Nonstick cooking spray—as needed", excludeFromShopping: true })])),
});

export const DM_001_020_REVIEW_FLAGS = Object.freeze({
  ...Object.fromEntries([["DM-001", "Black pepper"], ["DM-002", "Black pepper"], ["DM-003", "Black pepper"]].map(([recipeId, name]) => [`${recipeId}|${name}`, "Source recipe specifies black pepper to taste without a measurable quantity; no amount is invented."])),
  ...Object.fromEntries(DM_001_020_PREPARED_COMPONENT_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Recipe provides a finished prepared amount, but the underlying raw shopping ingredients depend on the preparation method or selected product."])),
  ...Object.fromEntries(DM_001_020_COMPOSITE_PRODUCE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Recipe gives one combined vegetable quantity without individual proportions; the source blend remains intact rather than assigning invented component amounts."])),
  "DM-010|Cooked brown rice and quinoa blend": "Recipe gives a cooked blend quantity, but its dry yield and rice-to-quinoa proportions depend on the selected blend; no dry conversion is guessed.",
});

const DM_021_040_COMPOSITE_PRODUCE_ROWS = Object.freeze([
  ["DM-032", "Broccoli and carrots"], ["DM-034", "Snow peas and carrots"],
  ["DM-035", "Bell peppers and onions"], ["DM-036", "Bell peppers and green beans"],
  ["DM-038", "Bell peppers and snow peas"], ["DM-039", "Carrots and bell peppers"],
]);

export const DM_021_040_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries([["DM-022", "Black pepper"], ["DM-023", "Black pepper"], ["DM-025", "Black pepper"], ["DM-027", "Black pepper"], ["DM-029", "Black pepper"], ["DM-030", "Black pepper"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-source-quantity", quantity: null, unit: "", preparation: "to taste", shoppingEquivalent: "Black pepper—quantity not specified" })])),
  ...Object.fromEntries(DM_021_040_COMPOSITE_PRODUCE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "unresolved-composite-proportions", canonicalName: `Vegetable Blend - ${name}`, canonicalKey: `produce.blend.${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`, shoppingEquivalent: `${name}—individual proportions not specified` })])),
  "DM-025|Zucchini, chopped": Object.freeze({ type: "uncertain-produce-yield", quantity: 1, unit: "each", recipeName: "Zucchini", canonicalName: "Zucchini", canonicalKey: "produce.zucchini", preparation: "chopped", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "One zucchini—size and prepared cup yield not specified" }),
  "DM-025|Red bell pepper, chopped": Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Red bell pepper", canonicalName: "Bell Pepper - Red", canonicalKey: "produce.pepper.bell.red", preparation: "chopped", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 red bell pepper", approximate: true }),
  "DM-028|Sun-dried tomatoes, chopped": Object.freeze({ type: "unspecified-product-form", recipeName: "Sun-dried tomatoes", canonicalName: "Tomato - Sun-Dried", canonicalKey: "produce.tomato.sun-dried", preparation: "chopped", shoppingEquivalent: "1/3 cup sun-dried tomatoes—dry-packed or oil-packed not specified" }),
  ...Object.fromEntries([["DM-032", "Cooked brown rice", "Brown", "brown"], ["DM-033", "Cooked basmati rice", "Basmati", "basmati"], ["DM-035", "Cooked brown rice", "Brown", "brown"], ["DM-036", "Cooked jasmine rice", "Jasmine", "jasmine"], ["DM-037", "Cooked brown rice", "Brown", "brown"], ["DM-038", "Cooked jasmine rice", "Jasmine", "jasmine"], ["DM-040", "Cooked basmati rice", "Basmati", "basmati"]].map(([recipeId, name, label, key]) => [`${recipeId}|${name}`, Object.freeze({ type: "cooked-rice-yield", recipeName: name, canonicalName: `Rice - ${label}`, canonicalKey: `grain.rice.${key}`, preparation: "cooked", shoppingQuantity: 0.6666666667, shoppingUnit: "cup", shoppingEquivalent: `About 2/3 cup dry ${key} rice`, approximate: true })])),
  ...Object.fromEntries([
    ["DM-021", "Part-skim ricotta", 4, "Part-Skim Ricotta"], ["DM-021", "Part-skim mozzarella", 2, "Part-Skim Mozzarella"], ["DM-021", "Grated Parmesan", 0.5, "Parmesan"], ["DM-021", "Shredded provolone", 0.5, "Provolone"], ["DM-021", "Shredded Asiago", 0.5, "Asiago"],
    ["DM-022", "Grated Parmesan", 0.5, "Parmesan"], ["DM-023", "Grated Parmesan", 1.3333333333, "Parmesan"], ["DM-024", "Part-skim mozzarella", 2, "Part-Skim Mozzarella"], ["DM-024", "Grated Parmesan", 0.5, "Parmesan"],
    ["DM-025", "Grated Parmesan", 1.3333333333, "Parmesan"], ["DM-026", "Part-skim ricotta", 6, "Part-Skim Ricotta"], ["DM-026", "Part-skim mozzarella", 3, "Part-Skim Mozzarella"], ["DM-026", "Grated Parmesan", 0.5, "Parmesan"],
    ["DM-027", "Reduced-fat cheddar", 6, "Reduced-Fat Cheddar"], ["DM-028", "Grated Parmesan", 4, "Parmesan"], ["DM-029", "Grated Parmesan", 1, "Parmesan"], ["DM-030", "Grated Parmesan", 1, "Parmesan"],
  ].map(([recipeId, name, ounces, variety]) => [`${recipeId}|${name}`, Object.freeze({ type: "shredded-cheese-yield", canonicalName: `Cheese - ${variety}`, canonicalKey: `dairy.cheese.${variety.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, shoppingQuantity: ounces, shoppingUnit: "ounce", shoppingEquivalent: `About ${ounces === 1.3333333333 ? "1 1/3" : ounces} ${ounces === 1 ? "ounce" : "ounces"} ${variety.toLowerCase()} cheese`, approximate: true })])),
  "DM-023|Center-cut bacon, chopped": Object.freeze({ type: "piece-count-with-shopping-weight", recipeName: "Center-cut bacon", canonicalName: "Bacon - Center-Cut", canonicalKey: "meat.pork.bacon.center-cut", preparation: "chopped", shoppingQuantity: 2, shoppingUnit: "ounce", shoppingEquivalent: "About 2 ounces center-cut bacon", approximate: true }),
});

export const DM_021_040_REVIEW_FLAGS = Object.freeze({
  ...Object.fromEntries([["DM-022", "Black pepper"], ["DM-023", "Black pepper"], ["DM-025", "Black pepper"], ["DM-027", "Black pepper"], ["DM-029", "Black pepper"], ["DM-030", "Black pepper"]].map(([recipeId, name]) => [`${recipeId}|${name}`, "Source recipe specifies black pepper to taste without a measurable quantity; no amount is invented."])),
  ...Object.fromEntries(DM_021_040_COMPOSITE_PRODUCE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Recipe gives one combined vegetable quantity without individual proportions; the source blend remains intact rather than assigning invented component amounts."])),
  "DM-025|Zucchini, chopped": "Recipe gives one chopped zucchini but no size; a prepared cup yield is not inferred.",
  "DM-028|Sun-dried tomatoes, chopped": "Recipe does not specify dry-packed or oil-packed sun-dried tomatoes; the measured cup amount and generic identity are retained.",
});

const DM_041_060_COMPOSITE_PRODUCE_ROWS = Object.freeze([
  ["DM-043", "Bell peppers and onions"], ["DM-052", "Zucchini and bell peppers"],
  ["DM-056", "Bell peppers and zucchini"], ["DM-058", "Broccoli and bell peppers"],
]);

export const DM_041_060_APPROVED_RESOLUTIONS = Object.freeze({
  ...Object.fromEntries([["DM-052", "Black pepper"], ["DM-053", "Black pepper"], ["DM-055", "Black pepper"], ["DM-059", "Black pepper"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "missing-source-quantity", quantity: null, unit: "", preparation: "to taste", shoppingEquivalent: "Black pepper—quantity not specified" })])),
  ...Object.fromEntries(DM_041_060_COMPOSITE_PRODUCE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "unresolved-composite-proportions", canonicalName: `Vegetable Blend - ${name}`, canonicalKey: `produce.blend.${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`, shoppingEquivalent: `${name}—individual proportions not specified` })])),
  ...Object.fromEntries([["DM-047", "Zucchini, chopped", "Zucchini", "produce.zucchini"], ["DM-048", "Zucchini, chopped", "Zucchini", "produce.zucchini"], ["DM-048", "Poblano pepper, chopped", "Poblano pepper", "produce.pepper.poblano"]].map(([recipeId, name, canonicalName, canonicalKey]) => [`${recipeId}|${name}`, Object.freeze({ type: "uncertain-produce-yield", quantity: 1, unit: "each", recipeName: canonicalName, canonicalName, canonicalKey, preparation: "chopped", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: `One ${canonicalName.toLowerCase()}—size and prepared cup yield not specified` })])),
  ...Object.fromEntries([["DM-044", "Red bell pepper, chopped"], ["DM-047", "Red bell pepper, chopped"], ["DM-049", "Red bell pepper, chopped"], ["DM-050", "Red bell pepper, chopped"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName: "Red bell pepper", canonicalName: "Bell Pepper - Red", canonicalKey: "produce.pepper.bell.red", preparation: "chopped", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "About 1 red bell pepper", approximate: true })])),
  "DM-049|Cauliflower rice": Object.freeze({ type: "product-dependent-package-yield", shoppingEquivalent: "4 cups cauliflower rice—package yield varies by product" }),
  "DM-050|Roasted sweet potatoes": Object.freeze({ type: "uncertain-prepared-yield", recipeName: "Sweet potatoes", canonicalName: "Sweet Potato", canonicalKey: "produce.potato.sweet", preparation: "roasted", shoppingEquivalent: "3 cups roasted sweet potatoes—raw weight and potato size not specified" }),
  "DM-057|Cooked whole-wheat couscous": Object.freeze({ type: "product-dependent-cooked-yield", recipeName: "Cooked whole-wheat couscous", canonicalName: "Couscous - Whole-Wheat", canonicalKey: "grain.couscous.whole-wheat", preparation: "cooked", shoppingEquivalent: "2 cups cooked whole-wheat couscous—dry yield varies by product and preparation" }),
  ...Object.fromEntries([
    ["DM-041", "Cooked brown rice", 0.6666666667, "Brown", "brown"], ["DM-042", "Cooked brown rice", 0.6666666667, "Brown", "brown"], ["DM-043", "Cooked brown rice", 0.6666666667, "Brown", "brown"], ["DM-046", "Cooked brown rice", 0.6666666667, "Brown", "brown"], ["DM-047", "Cooked brown rice", 1, "Brown", "brown"], ["DM-048", "Cooked brown rice", 0.6666666667, "Brown", "brown"], ["DM-051", "Cooked brown rice", 0.6666666667, "Brown", "brown"], ["DM-054", "Cooked brown rice", 0.6666666667, "Brown", "brown"], ["DM-056", "Cooked brown rice", 0.6666666667, "Brown", "brown"], ["DM-058", "Cooked jasmine rice", 0.6666666667, "Jasmine", "jasmine"], ["DM-060", "Cooked brown rice", 0.6666666667, "Brown", "brown"],
  ].map(([recipeId, name, shoppingQuantity, label, key]) => [`${recipeId}|${name}`, Object.freeze({ type: "cooked-rice-yield", recipeName: name, canonicalName: `Rice - ${label}`, canonicalKey: `grain.rice.${key}`, preparation: "cooked", shoppingQuantity, shoppingUnit: "cup", shoppingEquivalent: `About ${shoppingQuantity === 1 ? "1 cup" : "2/3 cup"} dry ${key} rice`, approximate: true })])),
  ...Object.fromEntries([
    ["DM-042", "Reduced-fat cheddar", 2, "Reduced-Fat Cheddar"], ["DM-044", "Reduced-fat cheddar", 2, "Reduced-Fat Cheddar"], ["DM-045", "Reduced-fat cheddar", 4, "Reduced-Fat Cheddar"], ["DM-046", "Reduced-fat pepper Jack", 2, "Reduced-Fat Pepper Jack"], ["DM-047", "Reduced-fat cheddar", 4, "Reduced-Fat Cheddar"], ["DM-049", "Reduced-fat cheddar", 2, "Reduced-Fat Cheddar"], ["DM-052", "Grated Parmesan", 1, "Parmesan"], ["DM-053", "Grated Parmesan", 6, "Parmesan"], ["DM-055", "Grated Parmesan", 4, "Parmesan"], ["DM-057", "Crumbled feta", 1.5, "Feta"], ["DM-060", "Grated Parmesan", 2, "Parmesan"],
  ].map(([recipeId, name, ounces, variety]) => [`${recipeId}|${name}`, Object.freeze({ type: "shredded-cheese-yield", canonicalName: `Cheese - ${variety}`, canonicalKey: `dairy.cheese.${variety.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, shoppingQuantity: ounces, shoppingUnit: "ounce", shoppingEquivalent: `About ${ounces} ${ounces === 1 ? "ounce" : "ounces"} ${variety.toLowerCase()} cheese`, approximate: true })])),
  ...Object.fromEntries([["DM-051", "Cod or tilapia fillets"], ["DM-052", "Peeled, deveined shrimp"], ["DM-053", "Cod or tilapia fillets"], ["DM-054", "Salmon fillets"], ["DM-055", "Peeled, deveined shrimp"], ["DM-056", "Peeled, deveined shrimp"], ["DM-057", "Cod or tilapia fillets"], ["DM-058", "Peeled, deveined shrimp"], ["DM-059", "Salmon fillets"], ["DM-060", "Cod or tilapia fillets"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "ounce-to-pound-shopping-equivalent", shoppingQuantity: 1, shoppingUnit: "pound", shoppingEquivalent: `About 1 pound ${name.toLowerCase()}`, approximate: false })])),
});

export const DM_041_060_REVIEW_FLAGS = Object.freeze({
  ...Object.fromEntries([["DM-052", "Black pepper"], ["DM-053", "Black pepper"], ["DM-055", "Black pepper"], ["DM-059", "Black pepper"]].map(([recipeId, name]) => [`${recipeId}|${name}`, "Source recipe specifies black pepper to taste without a measurable quantity; no amount is invented."])),
  ...Object.fromEntries(DM_041_060_COMPOSITE_PRODUCE_ROWS.map(([recipeId, name]) => [`${recipeId}|${name}`, "Recipe gives one combined vegetable quantity without individual proportions; the source blend remains intact rather than assigning invented component amounts."])),
  ...Object.fromEntries([["DM-047", "Zucchini, chopped"], ["DM-048", "Zucchini, chopped"], ["DM-048", "Poblano pepper, chopped"]].map(([recipeId, name]) => [`${recipeId}|${name}`, "Recipe gives one chopped whole vegetable but no size; a prepared cup yield is not inferred."])),
  "DM-049|Cauliflower rice": "Recipe gives a volume but package yield varies by product; no bag size is invented.",
  "DM-050|Roasted sweet potatoes": "Recipe gives a finished roasted volume without a raw weight or potato size; no raw shopping conversion is guessed.",
  "DM-057|Cooked whole-wheat couscous": "Recipe gives a cooked quantity, but dry yield varies by product and preparation; no dry conversion is guessed.",
});

export const HS_001_020_APPROVED_RESOLUTIONS = Object.freeze({
  "HS-001|filet mignon steaks (6 oz each)": Object.freeze({ type: "piece-count-with-shopping-weight", recipeName: "Filet mignon steaks", canonicalName: "Beef - Filet Mignon", canonicalKey: "meat.beef.filet-mignon", shoppingQuantity: 24, shoppingUnit: "ounce", shoppingEquivalent: "4 × 6-ounce filet mignon steaks (24 ounces / 1 1/2 pounds total)", approximate: false, inventoryCategory: "Meat/Seafood", inventorySubcategory: "Beef" }),
  ...Object.fromEntries([["HS-002", "bell pepper, chopped", "Bell pepper", "Bell Pepper", "produce.pepper.bell"], ["HS-010", "red bell pepper, diced", "Red bell pepper", "Bell Pepper - Red", "produce.pepper.bell.red"], ["HS-010", "green bell pepper, diced", "Green bell pepper", "Bell Pepper - Green", "produce.pepper.bell.green"], ["HS-014", "red bell pepper, diced", "Red bell pepper", "Bell Pepper - Red", "produce.pepper.bell.red"]].map(([recipeId, name, recipeName, canonicalName, canonicalKey]) => [`${recipeId}|${name}`, Object.freeze({ type: "prepared-produce-volume", quantity: 1, unit: "cup", recipeName, canonicalName, canonicalKey, preparation: name.includes("diced") ? "diced" : "chopped", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: `About 1 ${recipeName.toLowerCase()}`, approximate: true })])),
  "HS-004|jalapeños, seeded and chopped": Object.freeze({ type: "display-range", quantity: 1.5, unit: "each", recipeQuantityText: "1–2", recipeName: "Jalapeños", canonicalName: "Jalapeño Pepper", canonicalKey: "produce.pepper.jalapeno", preparation: "seeded and chopped", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "1–2 jalapeños" }),
  "HS-020|whole turkey (12–14 lb), thawed": Object.freeze({ type: "display-range", quantity: 13, unit: "pound", recipeQuantityText: "12–14", recipeName: "Whole turkey", canonicalName: "Turkey - Whole", canonicalKey: "meat.turkey.whole", preparation: "thawed", shoppingQuantity: 13, shoppingUnit: "pound", shoppingEquivalent: "One 12–14-pound whole turkey" }),
  "HS-004|shredded cheddar": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Cheddar", canonicalName: "Cheese - Cheddar", canonicalKey: "dairy.cheese.cheddar", preparation: "shredded", shoppingQuantity: 8, shoppingUnit: "ounce", shoppingEquivalent: "About 8 ounces cheddar cheese", approximate: true }),
  "HS-013|shredded cheddar, divided": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Cheddar", canonicalName: "Cheese - Cheddar", canonicalKey: "dairy.cheese.cheddar", preparation: "shredded, divided", shoppingQuantity: 16, shoppingUnit: "ounce", shoppingEquivalent: "About 16 ounces cheddar cheese", approximate: true }),
  "HS-013|Bacon, cooked and crumbled": Object.freeze({ type: "piece-count-with-shopping-weight", recipeName: "Bacon", canonicalName: "Bacon", canonicalKey: "meat.pork.bacon", preparation: "cooked and crumbled", shoppingQuantity: 3, shoppingUnit: "ounce", shoppingEquivalent: "About 3 ounces bacon", approximate: true }),
  ...Object.fromEntries([
    ["HS-001", "unsalted butter, softened", 0.5], ["HS-004", "melted butter", 0.6666666667], ["HS-005", "butter, divided", 0.5], ["HS-006", "melted butter", 0.25], ["HS-013", "butter, melted", 0.375], ["HS-017", "melted butter", 0.375], ["HS-018", "melted butter, divided", 0.625], ["HS-020", "softened butter", 0.75],
  ].map(([recipeId, name, sticks]) => [`${recipeId}|${name}`, Object.freeze({ type: "butter-stick-equivalent", shoppingQuantity: sticks, shoppingUnit: "each", shoppingName: "Butter stick", shoppingEquivalent: `About ${sticks === 0.6666666667 ? "2/3" : sticks} butter stick${sticks === 1 ? "" : "s"}`, approximate: true })])),
  ...Object.fromEntries([["HS-002", "onion, chopped"], ["HS-007", "onions, sliced"], ["HS-012", "Celery, chopped"], ["HS-014", "Celery, diced"], ["HS-014", "carrot, shredded"], ["HS-015", "zucchini, sliced"], ["HS-015", "yellow squash, sliced"], ["HS-015", "bell peppers, chunked"], ["HS-017", "apples, peeled and diced"]].map(([recipeId, name]) => [`${recipeId}|${name}`, Object.freeze({ type: "uncertain-produce-yield", shoppingEquivalent: `${name.replace(/,.*/, "")}—size and prepared cup yield not specified` })])),
  "HS-003|diced tomatoes, drained": Object.freeze({ type: "missing-package-size", recipeName: "Diced tomatoes", canonicalName: "Tomatoes - Diced", canonicalKey: "pantry.tomato.diced", preparation: "drained", shoppingEquivalent: "1 can diced tomatoes—can size not specified" }),
});

export const HS_001_020_REVIEW_FLAGS = Object.freeze({
  ...Object.fromEntries([["HS-002", "onion, chopped"], ["HS-007", "onions, sliced"]].map(([recipeId, name]) => [`${recipeId}|${name}`, "Recipe gives prepared onions without sizes; no cup volume is inferred."])),
  "HS-003|diced tomatoes, drained": "Recipe specifies one can of diced tomatoes but does not provide the can size.",
  ...Object.fromEntries([["HS-012", "Celery, chopped"], ["HS-014", "Celery, diced"], ["HS-014", "carrot, shredded"], ["HS-015", "zucchini, sliced"], ["HS-015", "yellow squash, sliced"], ["HS-015", "bell peppers, chunked"], ["HS-017", "apples, peeled and diced"]].map(([recipeId, name]) => [`${recipeId}|${name}`, "Recipe gives prepared whole produce without a size; no cup yield is inferred."])),
});

export const HS_021_030_APPROVED_RESOLUTIONS = Object.freeze({
  "HS-021|onions, sliced": Object.freeze({ type: "uncertain-produce-yield", recipeName: "Onions", canonicalName: "Onion", canonicalKey: "produce.onion", preparation: "sliced", shoppingQuantity: 3, shoppingUnit: "each", shoppingEquivalent: "3 onions—sizes and prepared cup yield not specified" }),
  "HS-022|Vegetable oil": Object.freeze({ type: "unmeasured-cooking-supply", quantity: null, unit: "", preparation: "for frying", recipeQuantityText: "As needed", recipeQuantityIncludesUnit: true, shoppingEquivalent: "Vegetable oil—as needed for frying" }),
  "HS-024|cod fillets (6 oz each)": Object.freeze({ type: "piece-count-with-shopping-weight", recipeName: "Cod fillets", canonicalName: "Fish - Cod", canonicalKey: "meat.seafood.fish.cod", shoppingQuantity: 24, shoppingUnit: "ounce", shoppingEquivalent: "4 × 6-ounce cod fillets (24 ounces / 1 1/2 pounds total)", approximate: false, inventoryCategory: "Meat/Seafood", inventorySubcategory: "Seafood" }),
  "HS-026|bunches broccolini, trimmed": Object.freeze({ type: "natural-purchase-count", quantity: 2, unit: "each", recipeName: "Broccolini", canonicalName: "Broccolini", canonicalKey: "produce.broccolini", preparation: "trimmed", shoppingQuantity: 2, shoppingUnit: "each", shoppingEquivalent: "2 bunches broccolini" }),
  "HS-027|bone-in prime rib roast (5–6 lb)": Object.freeze({ type: "display-range", quantity: 5.5, unit: "pound", recipeQuantityText: "5–6", recipeName: "Bone-in prime rib roast", canonicalName: "Beef - Prime Rib Roast", canonicalKey: "meat.beef.prime-rib-roast", shoppingQuantity: 5.5, shoppingUnit: "pound", shoppingEquivalent: "One 5–6-pound bone-in prime rib roast", inventoryCategory: "Meat/Seafood", inventorySubcategory: "Beef" }),
  "HS-029|sheet puff pastry": Object.freeze({ type: "natural-purchase-count", quantity: 1, unit: "each", recipeName: "Puff pastry", canonicalName: "Puff Pastry", canonicalKey: "frozen.bread.puff-pastry", shoppingQuantity: 1, shoppingUnit: "each", shoppingEquivalent: "1 sheet puff pastry" }),
  "HS-025|grated Parmesan": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Parmesan", canonicalName: "Cheese - Parmesan", canonicalKey: "dairy.cheese.parmesan", preparation: "grated", shoppingQuantity: 6, shoppingUnit: "ounce", shoppingEquivalent: "About 6 ounces Parmesan cheese", approximate: true }),
  "HS-030|grated Parmesan": Object.freeze({ type: "shredded-cheese-yield", recipeName: "Parmesan", canonicalName: "Cheese - Parmesan", canonicalKey: "dairy.cheese.parmesan", preparation: "grated", shoppingQuantity: 4, shoppingUnit: "ounce", shoppingEquivalent: "About 4 ounces Parmesan cheese", approximate: true }),
  ...Object.fromEntries([
    ["HS-024", "melted butter", 0.375, "3/8"], ["HS-025", "butter, divided", 0.25, "1/4"], ["HS-028", "butter", 0.375, "3/8"], ["HS-030", "butter", 0.625, "5/8"],
  ].map(([recipeId, name, sticks, label]) => [`${recipeId}|${name}`, Object.freeze({ type: "butter-stick-equivalent", shoppingQuantity: sticks, shoppingUnit: "each", shoppingName: "Butter stick", shoppingEquivalent: `About ${label} butter stick`, approximate: true })])),
});

export const HS_021_030_REVIEW_FLAGS = Object.freeze({
  "HS-021|onions, sliced": "Recipe gives three sliced onions without sizes; no cup volume is inferred.",
  "HS-022|Vegetable oil": "Recipe specifies vegetable oil for frying without a measurable quantity; no amount is invented.",
});

export const INGREDIENT_STANDARD_VERSION = "1.36";
