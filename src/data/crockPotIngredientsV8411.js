function aisleFor(name, unit = "") {
  const value = `${name} ${unit}`.toLowerCase();
  if (/chicken|turkey|beef|steak|pork|ham|sausage|bacon|meatball|corned beef|ribs/.test(value)) return "Meat & Seafood";
  if (/cream cheese|sour cream|heavy cream|half-and-half|milk|butter|cheddar|mozzarella|parmesan|provolone|gruy.re|ricotta|egg/.test(value)) return "Dairy";
  if (/onion|garlic|pepper|carrot|celery|potato|broccoli|cabbage|mushroom|apple|lime|lemon|spinach|kale|collard|green bean|corn|cilantro|parsley|chive|scallion|zucchini|eggplant/.test(value)) return "Produce";
  if (/broth|soup|tomato|bean|chile|salsa|sauce|ketchup|mustard|vinegar|worcestershire|soy|marinara|gravy|pineapple|pumpkin/.test(value)) return "Canned Goods & Condiments";
  if (/flour|cornstarch|sugar|cake mix|cornbread mix|breadcrumb|cocoa|chocolate|vanilla|cinnamon|spice|seasoning|salt|thyme|oregano|cumin|paprika|bay leaf/.test(value)) return "Baking & Spices";
  if (/rice|pasta|noodle|macaroni|tortellini|ravioli|lasagna|oat|lentil|split pea|dried/.test(value)) return "Rice, Pasta & Dry Goods";
  if (/tortilla|bread|biscuit|roll|bun|baguette|brioche|stuffing/.test(value)) return "Bread & Bakery";
  if (/frozen/.test(value)) return "Frozen Foods";
  return "Grocery List";
}

function quantity(value) {
  if (!value) return 1;
  if (/^\d+ \d+\/\d+$/.test(value)) {
    const [whole, fraction] = value.split(" ");
    const [numerator, denominator] = fraction.split("/").map(Number);
    return Number(whole) + numerator / denominator;
  }
  if (/^\d+\/\d+$/.test(value)) {
    const [numerator, denominator] = value.split("/").map(Number);
    return numerator / denominator;
  }
  return Number(value);
}

function parseIngredient(line) {
  line = line.trim().replace(/\s+/g, " ");
  const range = line.match(/^(\d+[–-]\d+)\s+(lb|oz|Tbsp|tbsp|tsp|cups?)\s+(.+)$/);
  if (range) {
    const [, amount, measure, name] = range;
    return { name, qty: 1, unit: `${amount} ${measure}`, aisle: aisleFor(name, measure), cost: 0 };
  }
  const match = line.match(/^(\d+(?: \d+\/\d+|\/\d+)?)\s+(.+)$/);
  if (!match) return { name: line, qty: 1, unit: "amount not specified", aisle: aisleFor(line), cost: 0 };
  const qty = quantity(match[1]);
  let rest = match[2];
  const unitMatch = rest.match(/^(lb|oz|cups?|Tbsp|tbsp|tsp|cans?|packets?|packages?|pkg|box(?:es)?|bags?|cloves?|slices?|stalks?|ears?|racks?|loaf(?:ves)?|head|eggs?|each)\b\s*(.*)$/i);
  if (unitMatch) {
    let unit = unitMatch[1];
    let name = unitMatch[2].trim();
    if (/^eggs?$/i.test(unit)) { name = name || "Eggs"; unit = "each"; }
    if (!name) name = unit;
    return { name, qty, unit, aisle: aisleFor(name, unit), cost: 0 };
  }
  return { name: rest, qty, unit: "each", aisle: aisleFor(rest, "each"), cost: 0 };
}

function cards(source) {
  return Object.fromEntries(Object.entries(source).map(([id, lines]) => [id, lines.map(parseIngredient)]));
}

export const CROCK_POT_INGREDIENTS_V8411 = cards({
  "CP-001": [
    "2 lb boneless skinless chicken breasts",
    "1 packet ranch seasoning",
    "1 can cream of chicken soup",
    "8 oz cream cheese, cubed",
    "1/2 cup chicken broth",
    "1/2 tsp garlic powder",
    "1/4 tsp black pepper"
  ],
  "CP-002": [
    "2 lb boneless skinless chicken breasts",
    "2 packets chicken gravy mix",
    "1 can cream of chicken soup",
    "1 1/2 cups chicken broth",
    "1/2 tsp onion powder",
    "1/2 tsp garlic powder",
    "1/4 tsp black pepper"
  ],
  "CP-003": [
    "2 lb boneless skinless chicken breasts",
    "1 can cream of chicken soup",
    "4 cups chicken broth",
    "1 cups diced onion",
    "1 cups sliced carrots",
    "1 cups sliced celery",
    "1 tsp poultry seasoning",
    "1 can refrigerated biscuits"
  ],
  "CP-004": [
    "2 lb boneless skinless chicken breasts",
    "1 can cream of chicken soup",
    "2 cups chicken broth",
    "1 cups diced carrots",
    "1 cups diced celery",
    "1 cups diced onion",
    "1 tsp poultry seasoning",
    "1 cups frozen peas",
    "1/2 cup heavy cream"
  ],
  "CP-005": [
    "2 lb boneless skinless chicken breasts",
    "8 cups chicken broth",
    "1 1/2 cups sliced carrots",
    "1 1/2 cups sliced celery",
    "1 cups diced onion",
    "2 cloves garlic, minced",
    "1 tsp dried thyme",
    "1 bay leaf",
    "8 oz egg noodles"
  ],
  "CP-006": [
    "2 lb boneless skinless chicken breasts",
    "1 can black beans, drained",
    "1 can corn, drained",
    "1 can diced tomatoes",
    "1 can enchilada sauce",
    "6 cups chicken broth",
    "1 diced onion",
    "1 tsp cumin",
    "1 tsp chili powder"
  ],
  "CP-007": [
    "2 lb boneless skinless chicken breasts",
    "2 cans white beans, drained",
    "1 can diced green chiles",
    "1 diced onion",
    "4 cups chicken broth",
    "1 tsp cumin",
    "1 tsp oregano",
    "4 oz cream cheese",
    "1 cups frozen corn"
  ],
  "CP-008": [
    "2 lb boneless skinless chicken breasts",
    "2 cups salsa verde",
    "1 can diced green chiles",
    "1 diced onion",
    "2 cloves garlic, minced",
    "1 tsp cumin",
    "1/2 tsp oregano",
    "1/2 cup chicken broth",
    "1 lime"
  ],
  "CP-009": [
    "2 lb boneless skinless chicken breasts",
    "2 cups red enchilada sauce",
    "12 corn tortillas",
    "2 cups shredded Mexican cheese",
    "1 can black beans, drained",
    "1 can corn, drained",
    "1 diced onion",
    "1 tsp cumin"
  ],
  "CP-010": [
    "2 lb boneless skinless chicken breasts",
    "1 cups chunky salsa",
    "1 can black beans, drained",
    "1 can corn, drained",
    "1 can diced tomatoes",
    "1 packet taco seasoning",
    "1/2 cup chicken broth",
    "Cooked rice, for serving"
  ],
  "CP-011": [
    "2 lb boneless skinless chicken breasts",
    "1 cups chunky salsa",
    "1 can black beans, drained",
    "1 can corn, drained",
    "1 can diced tomatoes",
    "1 packet taco seasoning",
    "1/2 cup chicken broth",
    "Cooked rice, for serving"
  ],
  "CP-012": [
    "2 lb boneless skinless chicken breasts",
    "1 packet Italian dressing seasoning",
    "1 can cream of chicken soup",
    "8 ozcream cheese, cubed",
    "1/2 cup chicken broth",
    "2 cloves garlic, minced",
    "1/4 tsp black pepper"
  ],
  "CP-013": [
    "2 lb boneless skinless chicken thighs",
    "1 1/2 lb baby potatoes, halved",
    "4 cloves garlic, minced",
    "1/2 cup chicken broth",
    "2 Tbsp melted butter",
    "1 tsp Italian seasoning",
    "1/2 tsp black pepper",
    "1/2 cup grated Parmesan"
  ],
  "CP-014": [
    "2 lb boneless skinless chicken thighs",
    "1/3 cup honey",
    "1/3 cup low-sodium soy sauce",
    "1/4 cup ketchup",
    "4 cloves garlic, minced",
    "1 tsp grated ginger",
    "1 Tbsp rice vinegar",
    "1 Tbsp cornstarch",
    "2 Tbsp water"
  ],
  "CP-015": [
    "2 lb boneless skinless chicken thighs",
    "1/2 cup low-sodium soy sauce",
    "1/3 cup brown sugar",
    "1/4 cup honey",
    "3 cloves garlic, minced",
    "1 tsp grated ginger",
    "2 Tbsp rice vinegar",
    "1 Tbsp cornstarch",
    "2 Tbsp water"
  ],
  "CP-016": [
    "2 lb boneless skinless chicken thighs",
    "1 cups orange marmalade",
    "1/3 cup low-sodium soy sauce",
    "1/4 cup orange juice",
    "2 cloves garlic, minced",
    "1 tsp grated ginger",
    "1 Tbsp rice vinegar",
    "1 Tbsp cornstarch",
    "2 Tbsp water"
  ],
  "CP-017": [
    "2 lb boneless skinless chicken thighs",
    "1 can crushed tomatoes",
    "1 diced onion",
    "3 cloves garlic, minced",
    "1 Tbsp grated ginger",
    "2 Tbsp garam masala",
    "1 tsp cumin",
    "1 tsp paprika",
    "1/2 cup heavy cream"
  ],
  "CP-018": [
    "2 lb boneless skinless chicken thighs",
    "1 can tomato sauce",
    "1 diced onion",
    "3 cloves garlic, minced",
    "1 Tbsp grated ginger",
    "1 Tbsp garam masala",
    "1 tsp cumin",
    "4 Tbsp butter",
    "1/2 cup heavy cream"
  ],
  "CP-019": [
    "2 lb boneless skinless chicken thighs",
    "1 can crushed tomatoes",
    "1 sliced bell pepper",
    "1 sliced onion",
    "8 oz sliced mushrooms",
    "3 cloves garlic, minced",
    "1 tsp Italian seasoning",
    "1/2 cup chicken broth",
    "2 Tbsp tomato paste"
  ],
  "CP-020": [
    "1 1/2 lb boneless chicken thighs",
    "12 oz smoked sausage, sliced",
    "1 diced onion",
    "1 diced bell pepper",
    "2 celery stalks, diced",
    "1 can diced tomatoes",
    "3 cups chicken broth",
    "1 tsp Cajun seasoning",
    "1 1/2 cups long-grain rice"
  ],
  "CP-021": [
    "3-4 lb turkey wing sections",
    "1 large onion, sliced",
    "2 cups turkey or chicken broth",
    "1 can cream of chicken soup",
    "1 packet poultry gravy mix",
    "1 tsp poultry seasoning",
    "1/2 tsp garlic powder",
    "1/2 tsp black pepper"
  ],
  "CP-022": [
    "3 lb boneless turkey breast",
    "1 diced onion",
    "2 cups turkey or chicken broth",
    "1 packet turkey gravy mix",
    "2 Tbsp butter",
    "1 tsp poultry seasoning",
    "1/2 tsp garlic powder",
    "1/2 tsp black pepper"
  ],
  "CP-023": [
    "3-4 lb beef chuck roast",
    "1 1/2 lb baby potatoes",
    "4 carrots, cut in chunks",
    "1 large onion, cut in wedges",
    "3 cloves garlic, minced",
    "2 cups beef broth",
    "2 Tbsp Worcestershire sauce",
    "1 tsp thyme",
    "1 tsp black pepper"
  ],
  "CP-024": [
    "3-4 lb beef chuck roast",
    "1 packet ranch seasoning",
    "1 packet au jus gravy mix",
    "6 pepperoncini peppers",
    "1/4 cup pepperoncini juice",
    "6 Tbsp butter",
    "1/2 tsp black pepper"
  ],
  "CP-025": [
    "2 lb beef stew meat",
    "8 oz sliced mushrooms",
    "1 diced onion",
    "2 cups beef broth",
    "1 packet brown gravy mix",
    "1 Tbsp Worcestershire sauce",
    "1 tsp garlic powder",
    "1/2 tsp black pepper",
    "2 Tbsp cornstarch",
    "2 Tbsp water"
  ],
  "CP-026": [
    "2 lb beef stew meat",
    "8 oz sliced mushrooms",
    "1 diced onion",
    "2 cups beef broth",
    "1 Tbsp Worcestershire sauce",
    "1 tsp garlic powder",
    "1/2 tsp black pepper",
    "1/2 cup sour cream",
    "8 oz egg noodles"
  ],
  "CP-027": [
    "2 lb beef stew meat",
    "1 lb baby potatoes, halved",
    "4 carrots, cut in chunks",
    "3 celery stalks, sliced",
    "1 diced onion",
    "3 cups beef broth",
    "2 Tbsp tomato paste",
    "1 tsp thyme",
    "2 Tbsp cornstarch",
    "2 Tbsp water"
  ],
  "CP-028": [
    "1 1/2 lb beef stew meat",
    "1 diced onion",
    "3 sliced carrots",
    "2 diced potatoes",
    "1 can diced tomatoes",
    "1 can green beans, drained",
    "1 cup frozen corn",
    "6 cups beef broth",
    "1 tsp Italian seasoning"
  ],
  "CP-029": [
    "2 lb beef chuck, cubed",
    "3 large onions, sliced, sliced",
    "2 cups beef broth",
    "1 can French onion soup",
    "1 Tbsp Worcestershire sauce",
    "1 tsp thyme",
    "1/2 tsp garlic powder",
    "1/2 tsp black pepper",
    "1 cups shredded provolone"
  ],
  "CP-030": [
    "3-4 lb beef chuck roast",
    "2 cups beef broth",
    "1 packet Italian dressing seasoning",
    "1 tsp Italian seasoning",
    "6 pepperoncini peppers",
    "1/4 cup pepperoncini juice",
    "1 sliced onion",
    "8 sandwich rolls",
    "8 slices provolone"
  ],
  "CP-031": [
    "3-4 lb beef chuck roast",
    "2 cups beef broth",
    "2 packets brown gravy mix",
    "1 sliced onion",
    "1 Tbsp Worcestershire sauce",
    "1 tsp garlic powder",
    "1/2 tsp black pepper",
    "8 sandwich rolls"
  ],
  "CP-032": [
    "3 lb beef chuck roast",
    "3 chipotle peppers in adobo",
    "1 diced onion",
    "4 cloves garlic, minced",
    "1/4 cup lime juice",
    "1 cups beef broth",
    "1 Tbsp cumin",
    "1 tsp oregano",
    "2 bay leaves"
  ],
  "CP-033": [
    "3 lb beef chuck roast",
    "1 diced onion",
    "1 cups beef broth",
    "1 cups red salsa",
    "3 cloves garlic, minced",
    "1 Tbsp chili powder",
    "2 tsp cumin",
    "1 tsp oregano",
    "1 lime"
  ],
  "CP-034": [
    "3 lb beef chuck roast",
    "2 cups red enchilada sauce",
    "1 diced onion",
    "1 cups beef broth",
    "3 cloves garlic, minced",
    "1 Tbsp chili powder",
    "1 tsp cumin",
    "1/2 tsp oregano"
  ],
  "CP-035": [
    "3 lb beef chuck roast",
    "1/2 cup low-sodium soy sauce",
    "1/3 cup brown sugar",
    "1/4 cup beef broth",
    "4 cloves garlic, minced",
    "1 Tbsp grated ginger",
    "1 Tbsp rice vinegar",
    "1 tsp sesame oil",
    "1 sliced pear"
  ],
  "CP-036": [
    "2 lb beef chuck, thinly sliced",
    "1/2 cup low-sodium soy sauce",
    "1/3 cup brown sugar",
    "1 cups beef broth",
    "4 cloves garlic, minced",
    "1 Tbsp grated ginger",
    "2 Tbsp hoisin sauce",
    "2 Tbsp cornstarch",
    "3 Tbsp water"
  ],
  "CP-037": [
    "2 lb beef chuck, sliced",
    "1 green bell pepper, sliced",
    "1 red bell pepper, sliced",
    "1 sliced onion",
    "2 cups beef broth",
    "1/3 cup low-sodium soy sauce",
    "1 can diced tomatoes",
    "2 cloves garlic, minced",
    "2 Tbsp cornstarch",
    "3 Tbsp water"
  ],
  "CP-038": [
    "2 lb round steak",
    "1 sliced onion",
    "1 sliced bell pepper",
    "1 can diced tomatoes",
    "1 can tomato sauce",
    "1 cups beef broth",
    "2 cloves garlic, minced",
    "1 tsp paprika",
    "1/2 tsp black pepper"
  ],
  "CP-039": [
    "2 lb 90/10 ground beef",
    "1 eggs",
    "1/2 cup breadcrumbs",
    "1 Tbsp Worcestershire sauce",
    "1 sliced onion",
    "8 oz sliced mushrooms",
    "2 cups beef broth",
    "1 packet brown gravy mix",
    "2 Tbsp cornstarch",
    "2 Tbsp water"
  ],
  "CP-040": [
    "2 lb beef chuck, sliced",
    "1 cups beef broth",
    "1/2 cup low-sodium soy sauce",
    "1/3 cup brown sugar",
    "3 cloves garlic, minced",
    "1 Tbsp grated ginger",
    "2 Tbsp cornstarch",
    "3 Tbsp water",
    "4 cups broccoli florets"
  ],
  "CP-041": [
    "4 lb bone-in beef short ribs",
    "1 sliced onion",
    "3 sliced carrots",
    "3 cloves garlic, minced",
    "2 cups beef broth",
    "1 cups red cooking wine",
    "2 Tbsp tomato paste",
    "1 tsp thyme",
    "1/2 tsp black pepper"
  ],
  "CP-042": [
    "3-4 lb corned beef brisket",
    "1 seasoning packet",
    "1 1/2 lb baby potatoes",
    "4 carrots, cut in chunks",
    "1 large onion, cut in wedges",
    "3 cups water",
    "1 small cabbage, cut in wedges"
  ],
  "CP-043": [
    "2 lb 90/10 ground beef",
    "2 eggs",
    "1 cups breadcrumbs",
    "1 diced onion",
    "1/2 cup milk",
    "2 Tbsp Worcestershire sauce",
    "1 tsp garlic powder",
    "1/2 tsp black pepper",
    "1/2 cup ketchup",
    "2 Tbsp brown sugar"
  ],
  "CP-044": [
    "2 lb 90/10 ground beef",
    "1 eggs",
    "1/2 cup breadcrumbs",
    "1 Tbsp Worcestershire sauce",
    "2 large onions, sliced",
    "2 cups beef broth",
    "1 packet brown gravy mix",
    "1/2 tsp garlic powder",
    "2 Tbsp cornstarch",
    "2 Tbsp water"
  ],
  "CP-045": [
    "2 lb 90/10 ground beef, browned",
    "2 lb potatoes, thinly sliced",
    "1 sliced onion",
    "1 cancream of mushroom soup",
    "1 cups milk",
    "1 tsp garlic powder",
    "1/2 tsp black pepper",
    "2 cups shredded cheddar"
  ],
  "CP-046": [
    "2 lb 90/10 ground beef, browned",
    "1 diced onion",
    "3 diced potatoes",
    "2 sliced carrots",
    "4 cups beef broth",
    "1 tsp garlic powder",
    "2 cups shredded cheddar",
    "1 cups milk",
    "1/2 cup sour cream"
  ],
  "CP-047": [
    "2 lb 90/10 ground beef, browned",
    "1 diced onion",
    "2 bell peppers, diced",
    "2 cans diced tomatoes",
    "1 can tomato sauce",
    "4 cups beef broth",
    "1 tsp Italian seasoning",
    "1 cups cooked rice"
  ],
  "CP-048": [
    "2 lb 90/10 ground beef, browned",
    "1 diced onion",
    "6 cups chopped cabbage",
    "2 cans diced tomatoes",
    "1 can tomato sauce",
    "4 cups beef broth",
    "1 tsp paprika",
    "1 tsp garlic powder",
    "1 cups cooked rice"
  ],
  "CP-049": [
    "2 lb 90/10 ground beef, browned",
    "1 diced onion",
    "1 can black beans, drained",
    "1 can pinto beans, drained",
    "1 can corn, drained",
    "2 cans diced tomatoes",
    "1 packet taco seasoning",
    "4 cups beef broth"
  ],
  "CP-050": [
    "2 lb 90/10 ground beef, browned",
    "1 diced onion",
    "2 cans diced tomatoes",
    "1 can tomato sauce",
    "1 can kidney beans, drained",
    "3 cups beef broth",
    "2 Tbsp chili powder",
    "2 cups elbow macaroni",
    "2 cups shredded cheddar"
  ],
  "CP-051": [
    "2 lb 90/10 ground beef, browned",
    "1 diced onion",
    "1 diced bell pepper",
    "1 1/2 cups ketchup",
    "2 Tbsp tomato paste",
    "2 Tbsp brown sugar",
    "1 Tbsp Worcestershire sauce",
    "1 tsp mustard",
    "8 sandwich buns"
  ],
  "CP-052": [
    "2 lb 90/10 ground beef, browned",
    "1 diced onion",
    "4 cloves garlic, minced",
    "2 cans crushed tomatoes",
    "1 can tomato sauce",
    "2 Tbsp tomato paste",
    "1 Tbsp Italian seasoning",
    "1 tsp sugar",
    "Spaghetti, for serving"
  ],
  "CP-053": [
    "1 1/2 lb 90/10 ground beef, browned",
    "1 diced onion",
    "4 cups marinara sauce",
    "9 lasagna noodles, uncooked",
    "15 oz ricotta cheese",
    "2 cups shredded mozzarella",
    "1/2 cup grated Parmesan",
    "1 tsp Italian seasoning"
  ],
  "CP-054": [
    "1 lb 90/10 ground beef, browned",
    "1 diced onion",
    "4 cups marinara sauce",
    "25 oz frozen cheese ravioli",
    "2 cups shredded mozzarella",
    "1/2 cup grated Parmesan",
    "1 tsp Italian seasoning"
  ],
  "CP-055": [
    "2 lb 90/10 ground beef, browned",
    "1 diced onion",
    "2 cans kidney beans, drained",
    "2 cans diced tomatoes",
    "1 can tomato sauce",
    "2 cups beef broth",
    "3 Tbsp chili powder",
    "2 tsp cumin",
    "1 tsp garlic powder"
  ],
  "CP-056": [
    "2 lb 90/10 ground beef, browned",
    "6 slices bacon, cooked and chopped",
    "1 diced onion",
    "2 cans baked beans",
    "1 can kidney beans, drained, drained",
    "1 can pinto beans, drained",
    "1 cups barbecue sauce",
    "1/3 cup brown sugar",
    "2 Tbsp mustard"
  ],
  "CP-057": [
    "4 lb boneless pork shoulder",
    "1 sliced onion",
    "1 cups chicken broth",
    "1 cups barbecue sauce",
    "2 Tbsp brown sugar",
    "1 Tbsp paprika",
    "1 tsp garlic powder",
    "1 tsp black pepper",
    "Sandwich buns, for serving"
  ],
  "CP-058": [
    "4 lb boneless pork shoulder",
    "1 sliced onion",
    "1 cups apple cider vinegar",
    "1/2 cup chicken broth",
    "2 Tbsp brown sugar",
    "1 Tbsp yellow mustard",
    "1 tsp red pepper flakes",
    "1 tsp black pepper",
    "Sandwich buns, for serving"
  ],
  "CP-059": [
    "4 lb boneless pork shoulder",
    "1 sliced onion",
    "12 oz root beer",
    "1 1/2 cups barbecue sauce",
    "1 Tbsp Worcestershire sauce",
    "1 tsp garlic powder",
    "1 tsp smoked paprika",
    "Sandwich buns, for serving"
  ],
  "CP-060": [
    "4 lb boneless pork shoulder",
    "1 diced onion",
    "4 cloves garlic, minced",
    "1 cups orange juice",
    "1/4 cup lime juice",
    "1 Tbsp cumin",
    "2 tsp oregano",
    "1 tsp chili powder",
    "2 bay leaves"
  ],
  "CP-061": [
    "2 pork tenderloins, about 2 1/2 lb",
    "1 sliced onion",
    "2 cups chicken broth",
    "1 packet pork gravy mix",
    "1 Tbsp Worcestershire sauce",
    "1 tsp garlic powder",
    "1/2 tsp thyme",
    "1/2 tsp black pepper",
    "2 Tbsp cornstarch",
    "2 Tbsp water"
  ],
  "CP-062": [
    "6 thick boneless pork chops",
    "1 sliced onion",
    "1 can cream of mushroom soup",
    "1 1/2 cups chicken broth",
    "1 packet pork gravy mix",
    "1 tsp garlic powder",
    "1/2 tsp black pepper"
  ],
  "CP-063": [
    "6 thick boneless pork chops",
    "3 apples, sliced",
    "2 onions, sliced",
    "1 cups chicken broth",
    "2 Tbsp brown sugar",
    "1 tsp thyme",
    "1/2 tsp cinnamon",
    "1/2 tsp black pepper"
  ],
  "CP-064": [
    "6 thick pork chops",
    "1 sliced onion",
    "8 oz sliced mushrooms",
    "1 can cream of mushroom soup",
    "1 1/2 cups chicken broth",
    "1 Tbsp Worcestershire sauce",
    "1 tsp garlic powder",
    "1/2 tsp black pepper"
  ],
  "CP-065": [
    "3-4 lb pork shoulder roast",
    "1 1/2 lb baby potatoes",
    "4 carrots, cut in chunks",
    "1 large onion, cut in wedges",
    "3 cloves garlic, minced",
    "2 cups chicken broth",
    "1 tsp thyme",
    "1 tsp rosemary",
    "1/2 tsp black pepper"
  ],
  "CP-066": [
    "3-4 lb pork roast",
    "2 lb sauerkraut, drained",
    "1 onion, sliced",
    "2 apples, sliced",
    "1 cups apple juice",
    "2 Tbsp brown sugar",
    "1 tsp caraway",
    "salt & pepper"
  ],
  "CP-067": [
    "3-4 lb country-style pork ribs",
    "1 onion, sliced",
    "1 cups barbecue sauce",
    "1/2 cup apple juice",
    "2 Tbsp brown sugar",
    "1 Tbsp Worcestershire",
    "1 tsp smoked paprika"
  ],
  "CP-068": [
    "2 racks baby back ribs",
    "2 tsp smoked paprika",
    "1 tsp garlic powder",
    "1 tsp salt",
    "1/2 tsp pepper",
    "1 1/2 cups barbecue sauce",
    "1/4 cup apple juice"
  ],
  "CP-069": [
    "1 fully cooked spiral ham, 7-8 lb",
    "1 cups brown sugar",
    "1/2 cup pineapple juice",
    "1/4 cup honey",
    "2 tsp Dijon mustard",
    "1/2 tsp cinnamon"
  ],
  "CP-070": [
    "1 lb dried navy beans, soaked",
    "1 meaty ham bone",
    "2 cups diced ham",
    "1 onion, diced",
    "2 carrots, chopped",
    "2 celery stalks",
    "6 cups chicken broth",
    "1 bay leaf",
    "pepper"
  ],
  "CP-071": [
    "1 lb dried navy beans, soaked",
    "1 ham hock",
    "1 1/2 cups diced ham",
    "1 onion, diced",
    "2 celery stalks",
    "1 large potato, diced",
    "6 cups broth",
    "1 bay leaf",
    "salt & pepper"
  ],
  "CP-072": [
    "1 lb dried split peas, rinsed",
    "2 cups diced ham",
    "1 ham bone",
    "1 onion, diced",
    "2 carrots",
    "2 celery stalks",
    "6 cups broth",
    "1 bay leaf",
    "1 tsp thyme"
  ],
  "CP-073": [
    "3 lb Yukon Gold potatoes, thinly sliced",
    "3 cups diced ham",
    "1 onion, sliced",
    "2 cups shredded cheddar",
    "2 cups milk",
    "1 can cream of mushroom soup",
    "1 tsp garlic powder",
    "pepper"
  ],
  "CP-074": [
    "1 1/2 lb smoked sausage, sliced",
    "2 lb baby potatoes, halved",
    "1 lb green beans, trimmed",
    "1 onion, sliced",
    "1 cups chicken broth",
    "2 Tbsp butter",
    "1 tsp garlic powder",
    "pepper"
  ],
  "CP-075": [
    "2 lb Italian sausage links",
    "3 bell peppers, sliced",
    "2 onions, sliced",
    "3 cloves garlic",
    "1 can crushed tomatoes, 15 oz",
    "1 tsp Italian seasoning",
    "salt & pepper"
  ],
  "CP-076": [
    "2 lb Italian sausage",
    "24 oz marinara",
    "1 onion, sliced",
    "3 cloves garlic",
    "1 tsp Italian seasoning",
    "1/2 tsp red pepper flakes"
  ],
  "CP-077": [
    "1 1/2 lb Italian sausage, browned",
    "2 cans cannellini beans",
    "1 onion",
    "2 carrots",
    "2 celery stalks",
    "4 cups broth",
    "1 can diced tomatoes",
    "2 cups kale",
    "Italian seasoning"
  ],
  "CP-078": [
    "1 lb dried red beans, soaked",
    "1 1/2 lb andouille, sliced",
    "onion",
    "2 celery stalks",
    "4 cloves garlic",
    "6 cups broth",
    "2 tsp Cajun seasoning",
    "1 bay leaf",
    "1 bell pepper"
  ],
  "CP-079": [
    "1 lb Italian sausage, browned",
    "1 1/2 cups brown lentils",
    "1 onion",
    "2 carrots",
    "2 celery stalks",
    "1 can diced tomatoes",
    "6 cups broth",
    "1 tsp Italian seasoning",
    "spinach"
  ],
  "CP-080": [
    "1 1/2 lb smoked sausage, sliced",
    "1 small cabbage, chopped",
    "1 onion, sliced",
    "3 carrots",
    "1 lb baby potatoes",
    "1 cups broth",
    "2 Tbsp butter",
    "garlic powder",
    "pepper"
  ],
  "CP-081": [
    "1 1/2 lb smoked sausage, sliced",
    "2 lb baby potatoes",
    "4 ears corn, cut",
    "1 onion",
    "1 cups broth",
    "3 Tbsp butter",
    "2 tsp Cajun seasoning"
  ],
  "CP-082": [
    "1 lb breakfast sausage, browned",
    "30 oz frozen hash browns",
    "10 eggs",
    "1 cups milk",
    "2 cups cheddar",
    "1 bell pepper",
    "1/2 onion",
    "salt & pepper"
  ],
  "CP-083": [
    "1 1/2 lb chicken breasts",
    "1 onion",
    "3 carrots",
    "3 celery stalks",
    "8 cups broth",
    "1 tsp thyme",
    "1 bay leaf",
    "1 cups long-grain rice",
    "parsley"
  ],
  "CP-084": [
    "6 cups broccoli florets",
    "1 onion, diced",
    "2 carrots, shredded",
    "4 cups broth",
    "1 tsp garlic powder",
    "2 cups half-and-half",
    "3 cups cheddar",
    "1/4 cup cornstarch"
  ],
  "CP-085": [
    "3 lb russet potatoes, diced",
    "1 onion, diced",
    "4 cups chicken broth",
    "1 tsp garlic powder",
    "8 oz cream cheese",
    "1 cups milk",
    "2 cups shredded cheddar cheese",
    "6 slices cooked bacon, crumbled",
    "1/4 cup chopped chives"
  ],
  "CP-086": [
    "2 cans crushed tomatoes",
    "1 onion",
    "3 cloves garlic",
    "4 cups broth",
    "2 Tbsp tomato paste",
    "1 tsp oregano",
    "1 cups cream",
    "1/2 cup basil",
    "Parmesan"
  ],
  "CP-087": [
    "1 onion",
    "2 carrots",
    "2 celery stalks",
    "2 cans diced tomatoes",
    "1 can kidney beans",
    "1 can cannellini beans",
    "6 cups broth",
    "green beans",
    "zucchini",
    "1 cups small pasta"
  ],
  "CP-088": [
    "1 lb ground beef, browned",
    "1 onion",
    "2 carrots",
    "2 celery stalks",
    "1 can diced tomatoes",
    "2 cans beans",
    "6 cups broth",
    "Italian seasoning",
    "1 cups ditalini r N"
  ],
  "CP-089": [
    "1 lb Italian sausage, browned, browned",
    "1 onion",
    "2 lb potatoes, sliced",
    "6 cups broth",
    "1 tsp Italian seasoning",
    "3 cups kale",
    "1 cups cream"
  ],
  "CP-090": [
    "4 lb yellow onions, sliced",
    "4 Tbsp butter",
    "1 tsp sugar",
    "2 cloves garlic, minced",
    "6 cups beef broth",
    "1 Tbsp Worcestershire sauce",
    "1 tsp dried thyme",
    "1 bay leaf",
    "1 French baguette, sliced",
    "1 1/2 cups shredded Gruyére cheese"
  ],
  "CP-091": [
    "1 cups wild-rice blend",
    "1 onion",
    "3 carrots",
    "3 celery stalks",
    "8 oz mushrooms",
    "6 cups broth",
    "thyme",
    "bay leaf",
    "1 cups cream",
    "3 Tbsp flour",
    "3 Tbsp butter"
  ],
  "CP-092": [
    "5 cups corn",
    "2 lb potatoes, diced",
    "1 onion",
    "2 celery stalks",
    "4 cups broth",
    "1 tsp thyme",
    "1 cups cream",
    "2 Tbsp cornstarch",
    "bacon and chives"
  ],
  "CP-093": [
    "1 1/2 lb chicken breasts",
    "4 cups corn",
    "1 1/2 lb potatoes",
    "1 onion",
    "1 bell pepper",
    "5 cups broth",
    "thyme",
    "1 cups cream",
    "cheddar"
  ],
  "CP-094": [
    "2 lb chicken thighs",
    "1 lb pulled pork",
    "1 onion",
    "2 cans diced tomatoes",
    "2 cups corn",
    "2 cups lima beans",
    "2 cups barbecue sauce",
    "4 cups broth",
    "Worcestershire"
  ],
  "CP-095": [
    "3 lb pulled pork",
    "1 onion",
    "2 cans crushed tomatoes",
    "2 cups corn",
    "2 cups lima beans",
    "2 cups barbecue sauce",
    "4 cups broth",
    "Worcestershire",
    "hot sauce"
  ],
  "CP-096": [
    "3 lb beef chuck, cubed",
    "1 onion",
    "4 cloves garlic",
    "3 Tbsp chili powder",
    "1 Tbsp cumin",
    "1 tsp smoked paprika",
    "2 cups beef broth",
    "1 can crushed tomatoes",
    "salt"
  ],
  "CP-097": [
    "2 lb ground beef, browned",
    "1 onion",
    "2 cans tomato sauce",
    "2 cups broth",
    "2 Tbsp chili powder",
    "1 tsp cinnamon",
    "1/4 tsp cloves",
    "1 Tbsp cocoa",
    "Worcestershire"
  ],
  "CP-098": [
    "2 lb chicken breasts",
    "3 cans white beans",
    "1 onion",
    "2 cans green chiles",
    "4 cups broth",
    "1 tsp cumin",
    "1 tsp oregano",
    "3 cloves garlic, minced",
    "8 oz cream cheese",
    "1 lime"
  ],
  "CP-099": [
    "3 lb pork shoulder, cubed",
    "1 onion",
    "4 cloves garlic",
    "2 lb potatoes",
    "2 cans green chiles",
    "2 cups salsa verde",
    "4 cups broth",
    "cumin",
    "oregano"
  ],
  "CP-100": [
    "1 lb dried black beans, soaked",
    "1 onion",
    "1 bell pepper",
    "3 cloves garlic",
    "6 cups broth",
    "1 cans diced tomatoes",
    "cumin",
    "oregano",
    "bay leaf",
    "lime"
  ],
  "CP-101": [
    "2 lb chicken breasts",
    "3 bell peppers, sliced",
    "2 onions, sliced",
    "1 can diced tomatoes",
    "2 Tbsp fajita seasoning",
    "1/2 cup broth",
    "lime"
  ],
  "CP-102": [
    "2 1/2 lb flank steak",
    "3 bell peppers",
    "2 onions",
    "1 can diced tomatoes",
    "2 Tbsp fajita seasoning",
    "1/2 cup broth",
    "lime"
  ],
  "CP-103": [
    "2 lb chicken thighs",
    "1 onion, sliced",
    "1 can crushed tomatoes",
    "2 chipotles in adobo",
    "3 cloves garlic",
    "1 tsp oregano",
    "1 tsp cumin",
    "1/2 cup broth"
  ],
  "CP-104": [
    "3 lb pork shoulder, cubed",
    "2 cups salsa verde",
    "2 cans green chiles",
    "1 onion",
    "4 cloves garlic",
    "1 cups broth",
    "cumin",
    "oregano",
    "lime"
  ],
  "CP-105": [
    "3 lb beef chuck",
    "4 chipotles in adobo",
    "4 cloves garlic",
    "1 onion",
    "1 cups broth",
    "1/4 cup lime juice",
    "2 Tbsp vinegar",
    "1 Tbsp cumin",
    "1 tsp oregano",
    "2 bay leaves"
  ],
  "CP-106": [
    "3 lb beef chuck",
    "3 dried guajillo chiles",
    "1 onion",
    "4 cloves garlic",
    "1 can diced tomatoes",
    "2 cups broth",
    "2 Tbsp vinegar",
    "cumin",
    "oregano",
    "cinnamon",
    "bay leaf"
  ],
  "CP-107": [
    "3 lb ground beef",
    "1 onion, diced",
    "3 Tbsp chili powder",
    "1 Tbsp cumin",
    "2 tsp paprika",
    "1 tsp garlic powder",
    "1 cups salsa",
    "1/2 cup broth",
    "salt"
  ],
  "CP-108": [
    "2 lb chicken breasts",
    "2 cans enchilada sauce",
    "1 can black beans",
    "1 can corn",
    "1 can diced tomatoes",
    "1 onion",
    "4 cups broth",
    "cumin",
    "chili powder",
    "cream cheese"
  ],
  "CP-109": [
    "2 lb ground beef, browned",
    "20 oz enchilada sauce",
    "12 corn tortillas, cut",
    "2 cups cheddar",
    "1 can black beans",
    "1 can corn",
    "onion",
    "taco seasoning"
  ],
  "CP-110": [
    "2 lb ground beef, browned",
    "1 onion, diced",
    "1 can corn, drained",
    "1 can black beans, drained and rinsed",
    "1 can diced tomatoes",
    "1 pkg taco seasoning",
    "2 boxes cornbread mix",
    "1 cups shredded cheddar cheese",
    "Eggs and milk per mix instructions"
  ],
  "CP-111": [
    "2 lb chicken thighs",
    "1 1/2 cups long-grain rice",
    "1 can diced tomatoes",
    "1 can corn",
    "1 can black beans",
    "1 onion",
    "3 cups broth",
    "taco seasoning",
    "cheddar"
  ],
  "CP-112": [
    "2 lb ground beef, browned",
    "1 cups cooked rice",
    "1 can black beans",
    "1 can corn",
    "1 can diced tomatoes",
    "onion",
    "taco seasoning",
    "2 cups cheese",
    "1 bell peppers for serving"
  ],
  "CP-113": [
    "2 lb dried pinto beans, rinsed, rinsed",
    "1 onion, quartered",
    "4 cloves garlic",
    "1 jalapeño",
    "8 cups broth",
    "2 tsp cumin",
    "1 tsp oregano",
    "salt",
    "3 Tbsp butter"
  ],
  "CP-114": [
    "2 lb dried pinto beans, soaked",
    "8 oz bacon, chopped",
    "1 onion",
    "2 jalapeños",
    "4 cloves garlic",
    "2 cans diced tomatoes",
    "8 cups broth",
    "cumin",
    "oregano",
    "cilantro"
  ],
  "CP-115": [
    "3-4 lb chuck roast",
    "1 onion",
    "4 carrots",
    "1 lb potatoes",
    "4 cloves garlic",
    "1 can crushed tomatoes",
    "1 cups beef broth",
    "Italian seasoning",
    "balsamic vinegar"
  ],
  "CP-116": [
    "2 lb ground chicken",
    "1 cups breadcrumbs",
    "1/2 cup Parmesan",
    "2 eggs",
    "garlic",
    "Italian seasoning",
    "32 oz marinara",
    "2 cups mozzarella"
  ],
  "CP-117": [
    "2 lb ground beef",
    "1/2 lb Italian sausage",
    "1 cups breadcrumbs",
    "2 eggs",
    "1/2 cup Parmesan",
    "garlic",
    "parsley",
    "32 oz marinara sauce"
  ],
  "CP-118": [
    "2 lb frozen meatballs",
    "2 cups beef broth",
    "1 can cream of mushroom soup",
    "1 Tbsp Worcestershire",
    "garlic powder",
    "pepper",
    "1 cups sour cream",
    "12 oz egg noodles"
  ],
  "CP-119": [
    "2 lb Italian sausage, browned",
    "24 oz marinara",
    "1 cans diced tomatoes",
    "1 onion, diced",
    "3 cloves garlic, minced",
    "1 Tbsp Italian seasoning",
    "20 oz refrigerated cheese tortellini",
    "2 cups spinach",
    "1 cups shredded mozzarella"
  ],
  "CP-120": [
    "2 lb chicken breasts",
    "2 cups chicken broth",
    "4 cloves garlic",
    "1 Italian seasoning",
    "2 cups heavy cream",
    "8 oz cream cheese",
    "1 cups Parmesan",
    "16 oz fettuccine"
  ],
  "CP-121": [
    "2 lb chicken breasts",
    "1 cups broth",
    "garlic",
    "Italian seasoning",
    "1 cups sun-dried tomatoes",
    "8 oz cream cheese",
    "1 cups cream",
    "1 cups Parmesan",
    "3 cups spinach"
  ],
  "CP-122": [
    "2 lb ground beef, browned",
    "1 lb Italian sausage",
    "1 onion",
    "2 carrots",
    "2 celery stalks",
    "garlic",
    "2 cans crushed tomatoes",
    "tomato paste",
    "Italian seasoning",
    "milk"
  ],
  "CP-123": [
    "1 lb Italian sausage, browned, browned",
    "32 oz marinara",
    "16 oz ziti, cooked al dente, cooked al dente",
    "15 oz ricotta",
    "3 cups mozzarella",
    "1 cups Parmesan",
    "Italian seasoning"
  ],
  "CP-124": [
    "24 jumbo shells, cooked",
    "15 oz ricotta",
    "2 cups mozzarella",
    "1 cups Parmesan",
    "1 eggs",
    "spinach",
    "Italian seasoning",
    "32 oz marinara"
  ],
  "CP-125": [
    "salt",
    "2 cups breadcrumbs",
    "1 cups Parmesan",
    "2 eggs",
    "32 oz marinara",
    "3 cups mozzarella",
    "Italian seasoning"
  ],
  "CP-126": [
    "1 1/2 lb mini Italian meatballs",
    "onion",
    "3 carrots",
    "3 celery stalks",
    "8 cups broth",
    "Italian seasoning",
    "1 cups acini di pepe",
    "4 cups spinach",
    "Parmesan"
  ],
  "CP-127": [
    "2 lb chicken thighs, cubed",
    "1/2 cup soy sauce",
    "1/3 cup brown sugar",
    "1/4 cup rice vinegar",
    "3 Tbsp hoisin",
    "4 cloves garlic, minced",
    "1 Tbsp ginger, minced",
    "1/2 tsp red pepper flakes",
    "2 Tbsp cornstarch",
    "2 cups broccoli florets"
  ],
  "CP-128": [
    "2 lb chicken breasts, cubed",
    "1 bell pepper",
    "1 onion",
    "1 can pineapple chunks",
    "3/4 cup sweet-and-sour sauce",
    "2 Tbsp soy sauce",
    "garlic",
    "cornstarch"
  ],
  "CP-129": [
    "2 lb chicken thighs, cubed",
    "1/2 cup soy sauce",
    "1/3 cup honey",
    "1/4 cup ketchup",
    "2 Tbsp rice vinegar",
    "3 cloves garlic, minced",
    "1 Tbsp fresh ginger, grated",
    "1 tsp sesame oil",
    "2 Tbsp cornstarch",
    "1 Tbsp sesame seeds"
  ],
  "CP-130": [
    "2 lb chicken breasts",
    "1 bell pepper",
    "1 onion",
    "1 cups coconut milk",
    "1/2 cup peanut butter",
    "1/4 cup soy sauce",
    "2 Tbsp lime juice",
    "ginger",
    "red curry paste",
    "garlic"
  ],
  "CP-131": [
    "2 lb chicken thighs",
    "onion",
    "3 potatoes",
    "2 carrots",
    "1 can diced tomatoes",
    "1 can coconut milk",
    "2 Tbsp curry powder",
    "garlic",
    "ginger",
    "salt"
  ],
  "CP-132": [
    "2 1/2 lb beef chuck, cubed",
    "1 onion",
    "3 potatoes",
    "3 carrots",
    "4 cups beef broth",
    "1 apple, grated",
    "1 package Japanese curry roux",
    "soy sauce"
  ],
  "CP-133": [
    "2 lb ground pork, browned",
    "1 onion",
    "8 oz mushrooms",
    "1 can water chestnuts",
    "1/3 cup hoisin",
    "1/4 cup soy sauce",
    "garlic",
    "ginger",
    "rice vinegar",
    "sesame oil"
  ],
  "CP-134": [
    "2 pork tenderloins",
    "1/2 cup soy sauce",
    "1/3 cup honey",
    "1/4 cup rice vinegar",
    "4 cloves garlic, minced",
    "1 Tbsp fresh ginger, grated",
    "1 Tbsp sesame oil",
    "1 Tbsp cornstarch",
    "2 scallions, sliced",
    "1 Tbsp sesame seeds"
  ],
  "CP-135": [
    "2 lb frozen meatballs",
    "1 cups teriyaki sauce",
    "1/2 cup pineapple juice",
    "1 bell pepper",
    "1 can pineapple chunks",
    "garlic",
    "ginger",
    "cornstarch",
    "sesame seeds"
  ],
  "CP-136": [
    "2 lb frozen meatballs",
    "1/2 cup honey",
    "1/3 cup soy sauce",
    "1/3 cup ketchup",
    "4 garlic cloves",
    "1 Tbsp cornstarch"
  ],
  "CP-137": [
    "2 lb chicken breasts",
    "1 box stuffing mix",
    "1 can cream of chicken soup",
    "1/2 cup sour cream",
    "3/4 cup broth",
    "salt and pepper"
  ],
  "CP-138": [
    "2 lb chicken breasts",
    "1 1/2 lb baby potatoes",
    "1 lb green beans",
    "1/3 cup broth",
    "3 Tbsp butter",
    "garlic",
    "Italian seasoning"
  ],
  "CP-139": [
    "2 lb chicken thighs",
    "1 cups wild rice blend",
    "4 cups broth",
    "onion",
    "carrots",
    "celery",
    "garlic",
    "thyme",
    "1/2 cup cream"
  ],
  "CP-140": [
    "2 lb chicken breasts",
    "1 cups long-grain rice",
    "3 cups broth",
    "1 can cream soup",
    "onion",
    "garlic",
    "1 cups peas",
    "cheese optional"
  ],
  "CP-141": [
    "3 lb chuck roast chunks",
    "1 1/2 lb potatoes",
    "4 carrots",
    "onion",
    "2 cups beef broth",
    "Worcestershire",
    "garlic",
    "thyme"
  ],
  "CP-142": [
    "6 thick pork chops",
    "1 1/2 lb potatoes",
    "1 lb green beans",
    "onion",
    "1 cups broth",
    "garlic",
    "paprika",
    "thyme"
  ],
  "CP-143": [
    "2 lb kielbasa",
    "1 1/2 lb potatoes",
    "1 lb sauerkraut",
    "onion",
    "1/2 cup broth",
    "Dijon mustard",
    "caraway (optional)"
  ],
  "CP-144": [
    "1 1/2 lb smoked sausage",
    "1 cups rice",
    "1 can diced tomatoes",
    "2 1/2 cups broth",
    "bell pepper",
    "onion",
    "garlic",
    "paprika"
  ],
  "CP-145": [
    "1 1/2 lb chicken thighs",
    "1 lb andouille",
    "1 cups rice",
    "1 can tomatoes",
    "3 cups broth",
    "peppers",
    "onion",
    "Cajun seasoning"
  ],
  "CP-146": [
    "2 lb ground beef browned",
    "1 head cabbage chopped",
    "1 cups rice",
    "2 cans tomatoes",
    "onion",
    "garlic",
    "2 cups broth",
    "paprika"
  ],
  "CP-147": [
    "2 lb ground beef browned",
    "4 potatoes sliced",
    "3 carrots",
    "onion",
    "1 can kidney beans",
    "1 can tomatoes",
    "1 cups broth",
    "seasoning"
  ],
  "CP-148": [
    "2 cups steel-cut oats",
    "7 cups water or milk",
    "3 apples diced",
    "1/3 cup brown sugar",
    "2 tsp cinnamon",
    "vanilla",
    "pinch salt"
  ],
  "CP-149": [
    "2 lb ground beef browned",
    "1 bag hash browns",
    "1 can beans",
    "1 cups corn",
    "1 can cream soup",
    "1 cups cheese",
    "onion",
    "taco seasoning"
  ],
  "CP-150": [
    "2 cups steel-cut oats",
    "7 cups water or milk",
    "1/3 cup maple syrup",
    "1/4 cup brown sugar",
    "cinnamon",
    "vanilla",
    "salt"
  ],
  "CP-151": [
    "1 lb breakfast sausage browned",
    "1 bag hash browns",
    "10 eggs",
    "1 cups milk",
    "2 cups cheese",
    "bell pepper",
    "onion",
    "salt and pepper"
  ],
  "CP-152": [
    "2 cups diced ham",
    "1 bag hash browns",
    "10 eggs",
    "1 cups milk",
    "2 cups cheddar",
    "onion",
    "mustard",
    "salt and pepper"
  ],
  "CP-153": [
    "1 loaf brioche, cubed",
    "8 eggs",
    "2 cups milk",
    "1/3 cup maple syrup",
    "brown sugar",
    "cinnamon",
    "vanilla",
    "butter"
  ],
  "CP-154": [
    "1 lb breakfast sausage",
    "2 cans biscuits quartered",
    "3 Tbsp flour",
    "3 cups milk",
    "butter",
    "black pepper",
    "salt"
  ],
  "CP-155": [
    "10 tortillas",
    "1 lb sausage browned",
    "8 eggs",
    "1 cups milk",
    "2 cups cheese",
    "green chiles",
    "enchilada sauce"
  ],
  "CP-156": [
    "2 cans cinnamon rolls quartered",
    "4 eggs",
    "1/2 cup cream",
    "2 tsp cinnamon",
    "1 tsp vanilla",
    "maple syrup",
    "included icing"
  ],
  "CP-157": [
    "1 lb elbow macaroni par-cooked",
    "4 cups cheddar",
    "2 cups milk",
    "1 can evaporated milk",
    "4 Tbsp butter",
    "mustard powder",
    "salt and pepper"
  ],
  "CP-158": [
    "2 lb frozen diced potatoes",
    "2 cups cheddar",
    "1 can cream soup",
    "1 cups sour cream",
    "onion",
    "4 Tbsp butter",
    "salt and pepper"
  ],
  "CP-159": [
    "4 lb potatoes peeled and cubed",
    "1 cups broth",
    "1 cups sour cream",
    "1/2 cup butter",
    "2 cups cheddar",
    "salt",
    "bacon",
    "scallions"
  ],
  "CP-160": [
    "4 lb potatoes cubed",
    "8 garlic cloves",
    "1 cups broth",
    "1 cups warm milk",
    "1/2 cup butter",
    "salt and pepper",
    "parsley"
  ],
  "CP-161": [
    "4 lb russet potatoes thinly sliced",
    "2 cups cream",
    "1 cups milk",
    "2 cups cheese",
    "onion",
    "garlic",
    "thyme",
    "salt and pepper"
  ],
  "CP-162": [
    "2 lb green beans",
    "2 cans cream mushroom soup",
    "1 cups milk",
    "soy sauce",
    "black pepper",
    "2 cups fried onions"
  ],
  "CP-163": [
    "3 lb frozen corn",
    "8 oz cream cheese",
    "1/2 cup butter",
    "1/2 cup milk",
    "2 Tbsp sugar",
    "salt and pepper"
  ],
  "CP-164": [
    "8 cups crumbled cornbread",
    "4 cups broth",
    "2 eggs",
    "onion",
    "celery",
    "butter",
    "sage",
    "thyme",
    "salt and pepper"
  ],
  "CP-165": [
    "3 lb green beans",
    "8 slices bacon cooked",
    "onion",
    "3 cups broth",
    "garlic",
    "1 tsp sugar",
    "salt and pepper il La"
  ],
  "CP-166": [
    "3 lb baby carrots",
    "1/2 cup brown sugar",
    "1/3 cup butter",
    "1 tsp cinnamon",
    "pinch salt",
    "1 Tbsp cornstarch",
    "parsley"
  ],
  "CP-167": [
    "3 lb collard greens chopped",
    "1 smoked turkey leg",
    "1 onion, chopped",
    "4 cups broth",
    "4 cloves garlic, minced",
    "2 Tbsp apple cider vinegar",
    "1 tsp red pepper flakes",
    "1 tsp salt"
  ],
  "CP-168": [
    "4 cans baked beans",
    "1 lb bacon, cooked and chopped",
    "1 onion, diced",
    "1/2 cup brown sugar",
    "1/3 cup barbecue sauce",
    "2 Tbsp mustard",
    "1 Tbsp Worcestershire"
  ],
  "CP-169": [
    "2 lb dried pinto beans, soaked soaked",
    "8 cups water or broth",
    "onion",
    "garlic",
    "cumin",
    "chili powder",
    "salt after cooking",
    "bay leaves"
  ],
  "CP-170": [
    "2 lb dried black-eyed peas soaked",
    "1 ham hock",
    "1 onion, diced",
    "1 bell pepper, diced",
    "7 cups chicken broth",
    "3 cloves garlic, minced",
    "1 tsp dried thyme",
    "1/4 tsp cayenne pepper"
  ],
  "CP-171": [
    "8 apples sliced",
    "1/2 cup sugar",
    "2 tsp cinnamon",
    "lemon juice",
    "1 cups oats",
    "3/4 cup flour",
    "3/4 cup brown sugar",
    "1/2 cup butter"
  ],
  "CP-172": [
    "6 cups sliced peaches",
    "1/2 cup sugar",
    "cinnamon",
    "lemon juice",
    "1 box yellow cake mix",
    "1/2 cup butter"
  ],
  "CP-173": [
    "2 cans cherry pie filling",
    "almond extract",
    "1 box yellow cake mix",
    "1/2 cup butter",
    "cinnamon optional"
  ],
  "CP-174": [
    "6 cups blueberries",
    "1/2 cup sugar",
    "lemon zest",
    "2 Tbsp cornstarch",
    "1 box cake mix",
    "1/2 cup butter"
  ],
  "CP-175": [
    "1 box chocolate cake mix",
    "eggs, oil and water as directed",
    "1 box chocolate pudding mix",
    "2 cups milk",
    "2 cups chocolate chips"
  ],
  "CP-176": [
    "1 box chocolate cake mix",
    "eggs, oil and water as directed",
    "1 cups brown sugar",
    "1/3 cup cocoa",
    "2 cups hot water",
    "chocolate chips"
  ],
  "CP-177": [
    "1 loaf day-old bread cubed",
    "6 eggs",
    "3 cups milk",
    "1 cups sugar",
    "1/2 cup butter",
    "vanilla",
    "cinnamon",
    "1 cups raisins"
  ],
  "CP-178": [
    "1 loaf brioche cubed",
    "4 ripe bananas",
    "6 eggs",
    "3 cups milk",
    "3/4 cup brown sugar",
    "vanilla",
    "cinnamon",
    "walnuts optional"
  ],
  "CP-179": [
    "8 apples sliced",
    "1/2 cup brown sugar",
    "2 tsp cinnamon",
    "1/4 cup butter",
    "1 Tbsp lemon juice",
    "1 Tbsp cornstarch",
    "pinch salt"
  ],
  "CP-180": [
    "1 box spice cake mix",
    "1 can pumpkin puree",
    "3 eggs",
    "1/2 cup oil",
    "1 tsp pumpkin spice",
    "1 cups cream cheese glaze"
  ]
});
