function aisleFor(name, unit = "") {
  const v = `${name} ${unit}`.toLowerCase();
  if (/shrimp|crab|crawfish|salmon|tilapia|chicken|beef|pork|bacon|sausage|hot dog|steak|brisket|ribs/.test(v)) return "Meat & Seafood";
  if (/egg|milk|cream|cheese|cheddar|parmesan|butter|sour cream|buttermilk/.test(v)) return "Dairy";
  if (/potato|bean|broccoli|corn|pea|carrot|celery|cabbage|onion|pepper|garlic|tomato|zucchini|squash|asparagus|okra|greens|lettuce|cucumber|mushroom|lemon|lime|cilantro|parsley|chive|radish/.test(v)) return "Produce";
  if (/bun|cornbread|crouton/.test(v)) return "Bread & Bakery";
  if (/oil|mustard|vinegar|soy sauce|worcestershire|ketchup|mayonnaise|dressing|relish|bbq sauce|honey/.test(v)) return "Condiments & Oils";
  if (/rice|pasta|spaghetti|macaroni|noodle|grits|orzo|vermicelli|panko|breadcrumb|flour|cornmeal|sugar|salt|pepper|seasoning|paprika|cumin|thyme|rosemary|oregano|cayenne|chili|baking powder/.test(v)) return "Baking, Grains & Spices";
  if (/broth|stock|soup|tomato paste|pork & beans/.test(v)) return "Canned & Packaged Goods";
  if (/frozen|fries|tater tots|hash browns/.test(v)) return "Frozen Foods";
  return "Grocery List";
}

function cards(source) {
  return Object.fromEntries(Object.entries(source).map(([id, lines]) => [id, lines.map((line) => {
    const [qty, unit, ...rest] = line.split("|");
    const name = rest.join("|");
    return { name, qty: Number(qty), unit, aisle: aisleFor(name, unit), cost: 0 };
  })]));
}

const SD = {
"SD-001":["4|15-ounce cans|Pork & beans","1|lb|Cooked crumbled bacon","1|medium|Onion, chopped","0.5|cup|Brown sugar","1|cup|Ketchup","2|tbsp|Yellow mustard","1|tbsp|Worcestershire sauce","1|tsp|Black pepper"],
"SD-002":["1|9 x 13-inch pan|Cornbread, baked, cooled, and crumbled","0.5|cup|Butter","1|medium|Onion, chopped","2|stalks|Celery, chopped","2|cloves|Garlic, minced","2|cups|Chicken broth","2|each|Large eggs","1|tsp|Poultry seasoning","0.5|tsp|Dried sage","0.5|tsp|Salt","0.25|tsp|Black pepper","2|tbsp|Fresh parsley, optional"],
"SD-003":["5|lb|Russet potatoes","0.5|cup|Butter","1|cup|Milk","0.5|cup|Sour cream","1.5|tsp|Salt","0.5|tsp|Black pepper","0.25|tsp|Garlic powder, optional","2|tbsp|Chopped chives, optional"],
"SD-004":["1|lb|Fresh green beans or 4 cups frozen green beans","2|tbsp|Butter","1|small|Onion, chopped","2|cloves|Garlic, minced","0.25|tsp|Salt","0.25|tsp|Black pepper","0.25|tsp|Garlic powder, optional","4|slices|Bacon, optional"],
"SD-005":["2|lb|Fresh broccoli or 1 lb frozen broccoli","2|tbsp|Butter","2|cloves|Garlic, minced","0.25|tsp|Salt","0.25|tsp|Black pepper","1|tbsp|Lemon juice, optional","2|tbsp|Grated Parmesan cheese, optional"],
"SD-006":["12|oz|Pasta","3|tbsp|Butter","4|cloves|Garlic, minced","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|tsp|Red pepper flakes, optional","0.5|cup|Grated Parmesan cheese","2|tbsp|Fresh parsley, optional"],
"SD-007":["12|oz|Elbow macaroni","3|tbsp|Butter","3|tbsp|All-purpose flour","2|cups|Milk","1|cup|Shredded cheddar cheese","1|cup|Shredded mozzarella cheese","0.5|cup|Grated Parmesan cheese","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|tsp|Garlic powder, optional","0.25|tsp|Paprika, optional"],
"SD-008":["4|cups|Frozen corn or 1 lb fresh corn","2|tbsp|Butter","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|tsp|Garlic powder, optional","1|tsp|Sugar, optional"],
"SD-009":["2|tbsp|Vegetable oil","2|cloves|Garlic, minced","1|tbsp|Fresh ginger or 0.5 tsp ground ginger","1|16-ounce bag|Coleslaw mix or stir-fry vegetables","1|each|Red bell pepper, sliced","0.5|cup|Snow peas","0.25|cup|Low-sodium soy sauce","1|tbsp|Oyster sauce, optional","1|tsp|Sesame oil","0.5|tsp|Sugar","0.25|tsp|Red pepper flakes, optional","1|tbsp|Sesame seeds, optional"],
"SD-010":["2|tbsp|Vegetable oil","2|each|Large eggs","1|small|Onion, chopped","1|cup|Frozen peas and carrots","3|cups|Cooked cold rice","3|tbsp|Soy sauce","1|tsp|Sesame oil, optional","2|each|Green onions, sliced","1|to taste|Salt","1|to taste|Black pepper"],
"SD-011":["12|oz|Dry egg noodles","2|tbsp|Butter","0.5|tsp|Salt","0.25|tsp|Black pepper, optional","1|tbsp|Fresh parsley, optional"],
"SD-012":["1|16-ounce bag|Frozen peas and carrots","2|tbsp|Butter","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|tsp|Garlic powder, optional","1|tsp|Sugar, optional"],
"SD-013":["1|16-ounce bag|Green beans","4|slices|Bacon","1|small|Onion, chopped","2|cloves|Garlic, minced, optional","0.5|cup|Chicken broth or water","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|tsp|Crushed red pepper, optional","1|tsp|Apple cider vinegar, optional"],
"SD-014":["16|oz|Dried pinto beans","4|slices|Bacon","1|small|Onion, chopped","2|cloves|Garlic, minced, optional","4|cups|Water or broth","0.5|tsp|Salt","0.25|tsp|Black pepper","0.5|tsp|Ground cumin, optional","1|tsp|Vinegar, optional"],
"SD-015":["1|cup|Uncooked rice","2|tbsp|Vegetable oil","1|small|Onion, chopped","1|clove|Garlic, minced, optional","1|14.5-ounce can|Diced tomatoes","2|cups|Chicken broth or water","0.5|tsp|Salt","0.25|tsp|Black pepper","0.5|tsp|Ground cumin, optional","2|tbsp|Fresh cilantro, optional"],
"SD-016":["1|lb|Ground beef or pork sausage","1|small|Onion, chopped","1|small|Green bell pepper, chopped","1|rib|Celery, chopped","1|clove|Garlic, minced, optional","1|cup|Uncooked rice","2|cups|Chicken broth or water","1|10.5-ounce can|Condensed chicken broth","1|tsp|Worcestershire sauce","0.5|tsp|Salt","0.25|tsp|Black pepper","0.5|tsp|Dried thyme, optional","0.5|tsp|Cayenne pepper, optional"],
"SD-017":["2|lb|Potatoes, thinly sliced","3|tbsp|Butter","3|tbsp|All-purpose flour","2|cups|Milk","1|cup|Heavy cream","1.5|cups|Shredded cheddar cheese","0.5|tsp|Salt","0.25|tsp|Black pepper","0.125|tsp|Garlic powder, optional","1|pinch|Ground nutmeg, optional"],
"SD-018":["1|cup|Uncooked rice","2|tbsp|Butter","1|tbsp|Olive oil","1|small|Onion, chopped","2|cloves|Garlic, minced, optional","0.25|cup|Orzo or vermicelli","2.25|cups|Chicken broth or water","0.5|tsp|Salt","0.25|tsp|Black pepper","0.5|tsp|Dried parsley, optional"],
"SD-019":["2|15-ounce cans|Pinto or black beans","1|tbsp|Vegetable oil","1|small|Onion, chopped","2|cloves|Garlic, minced, optional","1|tsp|Ground cumin, optional","0.5|tsp|Chili powder, optional","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|cup|Reserved bean liquid"],
"SD-020":["12|oz|Spaghetti","4|quarts|Water","2|tbsp|Salt","1|tbsp|Olive oil, optional","1|amount not specified|Butter or olive oil, optional"],
"SD-021":["1|tbsp|Olive oil","1|small|Onion, chopped","1|each|Red bell pepper, chopped","1|each|Green bell pepper, chopped","1|each|Zucchini, chopped","1|each|Yellow squash, chopped","1|cup|Green beans","1|14.5-ounce can|Diced tomatoes","1|tsp|Italian seasoning","0.5|tsp|Garlic powder, optional","0.5|tsp|Salt","0.25|tsp|Black pepper"],
"SD-022":["4|cups|Shredded cabbage","1|cup|Shredded carrots","0.25|cup|Onion, optional","0.5|cup|Mayonnaise","2|tbsp|Vinegar","2|tbsp|Sugar","0.25|tsp|Salt","0.125|tsp|Black pepper"],
"SD-023":["2|lb|Potatoes","2|each|Large eggs","0.5|cup|Celery, chopped","0.25|cup|Red onion, chopped","0.75|cup|Mayonnaise","0.25|cup|Yellow mustard","2|tbsp|Sweet pickle relish","1|tbsp|Vinegar","1|tsp|Sugar","0.5|tsp|Salt","0.25|tsp|Black pepper","1|amount not specified|Paprika, optional"],
"SD-024":["2|lb|Red potatoes","4|slices|Bacon","0.5|small|Onion, chopped","0.5|cup|Apple cider vinegar","0.25|cup|Chicken broth","2|tbsp|Sugar","1.5|tsp|Dijon mustard","0.5|tsp|Salt","0.25|tsp|Black pepper","2|tbsp|Fresh parsley, optional"],
"SD-025":["1.5|lb|Carrots","2|tbsp|Butter","2|tbsp|Brown sugar","2|tbsp|Honey","0.25|tsp|Salt","0.25|tsp|Black pepper"],
"SD-026":["6|ears|Corn","1|amount not specified|Water","0.5|tsp|Salt","0.25|tsp|Black pepper"],
"SD-027":["6|medium|Potatoes","2|tbsp|Olive oil","0.5|tsp|Salt","0.25|tsp|Black pepper"],
"SD-028":["1|6-to-8-ounce|Sweet potato","1|tsp|Olive oil","0.5|tsp|Salt","0.25|tsp|Black pepper"],
"SD-029":["1|lb|Mini potatoes","2|tbsp|Olive oil","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|tsp|Garlic powder, optional"],
"SD-030":["1|lb|Asparagus","2|tbsp|Olive oil","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|tsp|Garlic powder, optional"],
"SD-031":["1|lb|Fresh Brussels sprouts","2|tbsp|Olive oil","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|tsp|Garlic powder, optional"],
"SD-032":["1|lb|Fresh okra","0.5|cup|Cornmeal","0.25|cup|All-purpose flour","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|tsp|Garlic powder, optional","1|amount not specified|Oil for frying"],
"SD-033":["1|small head|Cabbage","2|tbsp|Olive oil","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|tsp|Garlic powder, optional"],
"SD-034":["32|oz|Frozen hash browns","1|10.5-ounce can|Condensed cream soup","1|cup|Sour cream","0.5|cup|Butter, melted","1|cup|Shredded cheddar cheese","0.5|cup|Onion, chopped, optional","0.5|tsp|Garlic powder","0.5|tsp|Salt","0.25|tsp|Black pepper"],
"SD-035":["1|cup|Grits","4|cups|Water","1|cup|Milk","1|cup|Shredded cheddar cheese","2|tbsp|Butter","0.5|tsp|Salt","0.25|tsp|Black pepper"],
"SD-036":["2|each|Zucchini","2|tbsp|Olive oil","0.5|tsp|Garlic powder","0.5|tsp|Onion powder","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|tsp|Italian seasoning, optional","1|tbsp|Grated Parmesan cheese, optional"],
"SD-037":["2|lb|Potatoes","3|tbsp|Olive oil","0.5|tsp|Garlic powder","0.5|tsp|Onion powder","1|tsp|Dried rosemary or 1 tbsp fresh rosemary","0.5|tsp|Salt","0.25|tsp|Black pepper","1|tbsp|Grated Parmesan cheese, optional","1|amount not specified|Fresh parsley, optional"],
"SD-038":["1|cup|Wild rice","2|tbsp|Oil or butter","1|small|Onion, chopped","2|stalks|Celery, chopped","1|each|Carrot, chopped","2|cloves|Garlic, minced","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|tsp|Dried thyme","0.25|tsp|Dried parsley","4|cups|Chicken or vegetable broth","1|tbsp|Butter, optional"],
"SD-039":["2|cups|Broccoli florets","1|each|Red bell pepper","1|each|Yellow squash","1|each|Zucchini","1|each|Red onion","2|tbsp|Olive oil","2|cloves|Garlic or 1 tsp garlic powder","1|tsp|Italian seasoning","0.5|tsp|Salt","0.25|tsp|Black pepper"],
"SD-040":["4|cups|Water","1|cup|Grits","0.5|tsp|Salt","2|tbsp|Butter","0.25|cup|Milk, optional","0.25|tsp|Black pepper"],
"SD-041":["2|large|Potatoes","2|tbsp|Olive oil","1|tsp|Garlic powder","1|tsp|Onion powder","1|tsp|Smoked paprika","0.5|tsp|Salt","0.5|tsp|Black pepper"],
"SD-042":["28|to 32 oz|Frozen crinkle-cut fries","2|tbsp|Olive oil","1|tsp|Garlic powder","1|tsp|Onion powder","0.5|tsp|Smoked paprika","0.5|tsp|Salt","0.5|tsp|Black pepper"],
"SD-043":["20|to 28 oz|Frozen waffle fries","2|tbsp|Olive oil","1|tsp|Garlic powder","1|tsp|Onion powder","0.5|tsp|Smoked paprika","0.5|tsp|Salt","0.5|tsp|Black pepper"],
"SD-044":["20|to 32 oz|Frozen shoestring fries","2|tbsp|Vegetable oil","0.5|tsp|Salt","1|pinch|Dextrose or sugar, optional"],
"SD-045":["2|large, about 1 lb|Sweet potatoes","2|tbsp|Olive oil","1|tsp|Garlic powder","1|tsp|Smoked paprika","0.5|tsp|Onion powder","0.5|tsp|Salt","0.25|tsp|Black pepper"],
"SD-046":["28|to 32 oz|Frozen tater tots","2|tbsp|Olive oil","0.5|tsp|Garlic powder","0.5|tsp|Onion powder","0.5|tsp|Paprika","0.5|tsp|Salt","0.25|tsp|Black pepper"],
"SD-047":["5|to 10 oz|Mixed greens or head lettuce","1|cup|Tomatoes","1|each|Cucumber","0.5|each|Red onion","1|cup|Shredded carrots","1|cup|Croutons, optional","0.5|cup|Shredded cheese, optional","1|amount not specified|Dressing of choice"],
"SD-048":["1|cup|Uncooked rice","2|cups|Water","1|tbsp|Butter, optional","0.5|tsp|Salt"],
"SD-049":["1|cup|Uncooked rice","2|cups|Water","1|tbsp|Butter, optional","0.5|tsp|Salt","1|tbsp|Lime juice","1|tsp|Lime zest","0.25|cup|Fresh cilantro"],
"SD-050":["1|cup|Uncooked rice","2|cups|Water","1|tbsp|Butter, optional","0.5|tsp|Salt","1.5|cups|Broccoli florets","0.5|cup|Shredded cheddar cheese","0.25|cup|Grated Parmesan cheese, optional","0.25|tsp|Garlic powder, optional","0.25|tsp|Black pepper"],
"SD-051":["1|cup|Uncooked rice","2|cups|Low-sodium broth or water","1|tbsp|Butter, optional","1|tbsp|Olive oil","1|cup|Sliced mushrooms","0.25|cup|Onion, chopped","2|cloves|Garlic, minced","0.5|cup|Heavy cream","0.25|cup|Grated Parmesan cheese, optional","0.5|tsp|Salt","0.25|tsp|Black pepper","1|tbsp|Fresh parsley, optional"],
"SD-052":["1|cup|Jasmine rice","1.25|cups|Water","1|tbsp|Butter, optional","0.25|tsp|Salt"]
};

const SF = {
"SF-001":["1|lb|Large shrimp, peeled and deveined","0.5|cup|All-purpose flour","2|each|Large eggs","1|cup|Panko breadcrumbs","1|cup|Sweetened shredded coconut","1|tsp|Salt","0.5|tsp|Black pepper","1|amount not specified|Cooking spray"],
"SF-002":["1|lb|Large shrimp, peeled and deveined","4|tbsp|Butter","1|tbsp|Olive oil","4|cloves|Garlic, minced","0.25|tsp|Red pepper flakes","0.5|cup|Chicken broth","2|tbsp|Lemon juice","1|tsp|Lemon zest","2|tbsp|Fresh parsley","1|to taste|Salt","1|to taste|Black pepper","1|for serving|Pasta or rice"],
"SF-003":["1|lb|Large shrimp, peeled and deveined","3|slices|Bacon","1|cup|Grits","4|cups|Water","1|cup|Shredded cheddar cheese","2|tbsp|Butter","0.5|tsp|Cajun seasoning","2|each|Green onions","1|to taste|Salt","1|to taste|Black pepper"],
"SF-004":["2|14.75-ounce cans|Salmon, drained","0.5|cup|Breadcrumbs","2|each|Large eggs","0.25|cup|Onion, chopped","0.25|cup|Celery, chopped","1|tbsp|Lemon juice","0.5|tsp|Garlic powder","0.5|tsp|Salt","0.25|tsp|Black pepper","2|tbsp|Vegetable oil"],
"SF-005":["1|lb|Crabmeat","0.5|cup|Breadcrumbs","1|each|Large egg","1|tbsp|Mayonnaise","1|tsp|Dijon mustard","1|tbsp|Lemon juice","1|tsp|Worcestershire sauce","1|tsp|Old Bay seasoning","1|to taste|Salt","1|to taste|Black pepper","2|tbsp|Vegetable oil"],
"SF-006":["1|lb|Large shrimp, peeled and deveined","1|cup|Shredded coconut","0.5|cup|Panko breadcrumbs","2|each|Large eggs","0.5|cup|All-purpose flour","1|tsp|Lime zest","2|tbsp|Lime juice","0.5|tsp|Salt","0.25|tsp|Black pepper","1|amount not specified|Cooking spray"],
"SF-007":["1|lb|Large shrimp, peeled and deveined","2|tbsp|Butter","1|tbsp|Olive oil","1|tbsp|Cajun seasoning","2|cloves|Garlic, minced","0.5|tsp|Smoked paprika","1|tbsp|Lemon juice","2|tbsp|Fresh parsley"],
"SF-008":["4|each|Salmon fillets","0.5|cup|Teriyaki sauce","1|tbsp|Honey","1|tsp|Garlic, minced","0.5|tsp|Sesame oil","2|each|Green onions","1|tsp|Sesame seeds"],
"SF-009":["4|each|Salmon fillets","0.25|cup|Honey","2|tbsp|Soy sauce","3|cloves|Garlic, minced","1|tbsp|Olive oil","0.5|tsp|Black pepper","2|each|Green onions"],
"SF-010":["4|each|Tilapia fillets","0.5|cup|Cornmeal","0.25|cup|All-purpose flour","1|tsp|Garlic powder","1|tsp|Onion powder","0.5|tsp|Paprika","0.5|tsp|Salt","0.25|tsp|Black pepper","2|each|Large eggs","2|tbsp|Milk","2|tbsp|Vegetable oil","1|for serving|Lemon wedges"],
"SF-011":["4|each|Tilapia fillets","2|tbsp|Blackened seasoning","1|tbsp|Olive oil","1|tbsp|Butter","4|each|Lemon wedges"],
"SF-012":["4|each|Tilapia fillets","2|tbsp|Cajun seasoning","1|tbsp|Olive oil","1|tbsp|Butter","4|each|Lemon wedges"],
"SF-013":["4|each|Tilapia fillets","0.25|cup|Grated Parmesan cheese","0.25|cup|Breadcrumbs","1|each|Large egg","1|tsp|Garlic powder","0.5|tsp|Italian seasoning","0.5|tsp|Salt","0.25|tsp|Black pepper","2|tbsp|Vegetable oil"],
"SF-014":["4|each|Tilapia fillets","2|tbsp|Butter","3|cloves|Garlic, minced","2|tbsp|Lemon juice","1|tsp|Lemon zest","1|tbsp|Fresh parsley","0.5|tsp|Salt","0.25|tsp|Black pepper"],
"SF-015":["1|lb|Large shrimp, shell-on","4|cups|Water","1|each|Lemon","1|tbsp|Old Bay seasoning","1|tsp|Salt"],
"SF-016":["0.25|cup|Vegetable oil","0.25|cup|All-purpose flour","1|each|Onion, chopped","1|each|Bell pepper, chopped","2|stalks|Celery, chopped","3|cloves|Garlic, minced","1|14.5-ounce can|Diced tomatoes","4|cups|Seafood or chicken stock","1|lb|Smoked sausage, sliced","1|lb|Shrimp, peeled and deveined","8|oz|Crabmeat","2|tsp|Cajun seasoning","0.5|tsp|Dried thyme","1|to taste|Salt","1|to taste|Black pepper","1|for serving|Cooked rice","1|for serving|Green onions"],
"SF-017":["3|tbsp|Butter","3|tbsp|All-purpose flour","1|each|Onion, chopped","1|each|Bell pepper, chopped","2|stalks|Celery, chopped","3|cloves|Garlic, minced","1|lb|Crawfish tails","3|cups|Seafood stock","1|cup|Heavy cream","1|tsp|Cajun seasoning","0.5|tsp|Paprika","1|to taste|Salt","1|to taste|Black pepper","1|for garnish|Green onions","1|for serving|Cooked rice"],
"SF-018":["4|tbsp|Butter","1|each|Onion, chopped","1|each|Bell pepper, chopped","2|stalks|Celery, chopped","2|cloves|Garlic, minced","2|tbsp|All-purpose flour","2|cups|Seafood stock","1|tbsp|Tomato paste","1|lb|Crawfish tails","2|tsp|Cajun seasoning","0.5|tsp|Paprika","1|to taste|Salt","1|to taste|Black pepper","1|for garnish|Green onions","1|for serving|Cooked rice"],
"SF-019":["1|cup|Cornmeal","0.5|cup|All-purpose flour","1|tbsp|Sugar","1|tsp|Baking powder","0.5|tsp|Salt","0.25|tsp|Black pepper","0.25|cup|Onion, finely chopped","1|each|Large egg","0.75|cup|Buttermilk","1|amount not specified|Oil for frying"],
"SF-020":["0.5|lb|Ground beef","0.5|lb|Smoked sausage","1|each|Onion, chopped","1|each|Bell pepper, chopped","2|stalks|Celery, chopped","2|cloves|Garlic, minced","2|cups|Cooked rice","1|cup|Chicken broth","2|tsp|Cajun seasoning","0.5|tsp|Dried thyme","0.25|tsp|Black pepper","1|for garnish|Green onions"]
};

const rub = (meat, count, method = "") => [`${count}|each|${meat}${method}`,"1|tbsp|Olive oil","1|tbsp|Brown sugar","1|tsp|Garlic powder","1|tsp|Onion powder","1|tsp|Paprika","1|tsp|Italian seasoning","0.5|tsp|Salt","0.5|tsp|Black pepper","0.5|tsp|Dried thyme","0.5|tsp|Smoked paprika","0.25|tsp|Crushed red pepper, optional"];
const SG = {
"SG-001":["1.5|to 2 lb|Flank steak","2|tbsp|Olive oil","1.5|tsp|Kosher salt","1|tsp|Coarse black pepper","0.25|cup|Soy sauce","0.25|cup|Olive oil","2|tbsp|Worcestershire sauce","2|tbsp|Lime juice","3|cloves|Garlic, minced","1|tsp|Brown sugar","1|tsp|Smoked paprika","0.25|tsp|Black pepper","0.25|tsp|Red pepper flakes, optional"],
"SG-002":["1.5|lb|Flank steak or sirloin, thinly sliced","1|tbsp|Olive oil","1|tsp|Kosher salt","0.5|tsp|Black pepper","2|tbsp|Olive oil","2|tbsp|Lime juice","2|cloves|Garlic, minced","1|tsp|Ground cumin","1|tsp|Chili powder","0.5|tsp|Onion powder","0.5|tsp|Kosher salt","0.25|tsp|Black pepper","1|each|Red bell pepper, optional","1|each|Green bell pepper, optional","1|each|Onion, optional"],
"SG-003":["6|to 12|Hot dogs","6|to 12|Hot dog buns","1|amount not specified|Favorite toppings and condiments","1|tbsp|Olive oil or melted butter, optional","0.5|tsp|Garlic powder, optional","0.5|tsp|Onion powder, optional","0.5|tsp|Smoked paprika, optional","0.5|tsp|Black pepper, optional"],
"SG-004":["1.5|to 2 lb|Sausage links","1|amount not specified|Favorite toppings and condiments","1|tbsp|Olive oil or melted butter, optional","0.5|tsp|Garlic powder, optional","0.5|tsp|Onion powder, optional","0.5|tsp|Smoked paprika, optional","0.5|tsp|Black pepper, optional"],
"SG-005":["4|to 6|Boneless skinless chicken breasts","1|tbsp|Olive oil, optional","1|tsp|Kosher salt","0.5|tsp|Black pepper","2|tbsp|Olive oil","2|tbsp|Lemon juice or balsamic vinegar","2|cloves|Garlic, minced","1|tsp|Dijon mustard","1|tsp|Italian seasoning","1|tsp|Paprika","1|to taste|Salt","1|to taste|Black pepper"],
"SG-008":["1|12-to-16-lb|Whole beef brisket","2|tbsp|Coarse kosher salt","2|tbsp|Coarse black pepper","1|tbsp|Garlic powder","1|tbsp|Onion powder","2|tbsp|Yellow mustard, optional","1|tbsp|Brown sugar, optional","1|tsp|Smoked paprika, optional","1|tsp|Chili powder, optional","1|tsp|Ground cumin, optional","1|tsp|Coarse black pepper, optional","0.5|tsp|Cayenne pepper, optional","1|to taste|Salt, optional"],
"SG-009":["1|7-to-8-lb|Pork butt","2|tbsp|Yellow mustard","0.25|cup|Apple cider vinegar","3|tbsp|Brown sugar","2|tbsp|Kosher salt","1|tbsp|Black pepper","1|tbsp|Garlic powder","1|tbsp|Onion powder","1|tbsp|Smoked paprika","1|tsp|Ground cumin","2|tbsp|Apple cider vinegar for sauce","1|tbsp|Worcestershire sauce","0.5|cup|Ketchup","1|to taste|Salt","1|to taste|Black pepper"],
"SG-010":["1|7-to-8-lb|Pork butt","3|tbsp|Yellow mustard","0.25|cup|Apple cider vinegar","0.25|cup|Brown sugar","2|tbsp|Kosher salt","2|tbsp|Black pepper","1|tbsp|Onion powder","1|tbsp|Smoked paprika","1|tsp|Ground cumin","1|cup|Ketchup, optional","0.25|cup|Apple cider vinegar, optional","0.25|cup|Brown sugar, optional","1|tbsp|Worcestershire sauce, optional","1|tsp|Garlic powder, optional","1|tsp|Onion powder, optional","1|tsp|Smoked paprika, optional","1|to taste|Salt, optional","1|to taste|Black pepper, optional"],
"SG-011":["4|to 6|Boneless skinless chicken breasts","2|tbsp|Olive oil","1|tsp|Kosher salt","0.5|tsp|Coarse black pepper","1|tbsp|Brown sugar","1|tsp|Garlic powder","1|tsp|Onion powder","1|tsp|Smoked paprika","0.5|tsp|Dried thyme","0.5|tsp|Chili powder","0.5|tsp|Black pepper","0.5|tsp|Kosher salt"],
"SG-012":["2|racks, about 4 lb|Baby back ribs","1|tbsp|Yellow mustard, optional","2|tbsp|Brown sugar","1.5|tbsp|Kosher salt","1|tbsp|Coarse black pepper","1|tbsp|Garlic powder","1|tbsp|Onion powder","1|tbsp|Smoked paprika","1|tsp|Chili powder","0.5|tsp|Ground cumin","0.25|tsp|Cayenne pepper, optional","1.25|cups|BBQ sauce, optional"],
"SG-013":["3|to 4 lb|Beef plate ribs","1|tbsp|Yellow mustard, optional","2|tbsp|Coarse kosher salt","2|tbsp|Coarse black pepper","1|tbsp|Garlic powder","1|tbsp|Onion powder","1|tbsp|Smoked paprika","1|tsp|Brown sugar","1|tsp|Chili powder","1|tsp|Ground cumin","0.5|tsp|Cayenne pepper, optional","1|amount not specified|Beef tallow or duck fat, optional"],
"SG-014":["8|to 10|Chicken legs","1|tbsp|Olive oil, optional","1|tsp|Kosher salt","2|tbsp|Brown sugar","1.5|tbsp|Kosher salt","1|tbsp|Coarse black pepper","1|tbsp|Garlic powder","1|tbsp|Onion powder","1|tsp|Smoked paprika","1|tsp|Chili powder","0.5|tsp|Ground cumin","0.5|tsp|Dried thyme","0.5|tsp|Cayenne pepper, optional","0.75|cup|BBQ sauce, optional"],
"SG-015":["3|to 4 lb|Chicken wings","1|tbsp|Olive oil, optional","1|tsp|Kosher salt","2|tbsp|Brown sugar","1.5|tbsp|Kosher salt","1|tbsp|Coarse black pepper","1|tbsp|Garlic powder","1|tbsp|Onion powder","1|tsp|Smoked paprika","1|tsp|Chili powder","0.5|tsp|Ground cumin","0.5|tsp|Dried thyme","0.5|tsp|Cayenne pepper, optional","0.75|cup|BBQ sauce, optional"],
"SG-016":["3|whole|Chicken quarters","1|tbsp|Olive oil, optional","1|tsp|Kosher salt","2|tbsp|Brown sugar","1.5|tbsp|Kosher salt","1|tbsp|Coarse black pepper","1|tbsp|Garlic powder","1|tbsp|Onion powder","1|tsp|Smoked paprika","1|tsp|Chili powder","0.5|tsp|Ground cumin","0.5|tsp|Dried thyme","0.5|tsp|Cayenne pepper, optional","0.75|cup|BBQ sauce, optional"],
"SG-017":["2.5|to 3 lb|Boneless skinless chicken thighs","1|tbsp|Olive oil","1|tsp|Kosher salt","2|tbsp|Brown sugar","1|tsp|Garlic powder","1|tsp|Onion powder","1|tsp|Smoked paprika","0.5|tsp|Black pepper","0.5|tsp|Chili powder","0.5|tsp|Dried thyme","0.25|tsp|Cayenne pepper, optional","0.75|cup|BBQ sauce, optional"],
"SG-018":["2.5|to 3 lb|Boneless skinless chicken thighs","1|tbsp|Olive oil","1|tsp|Kosher salt","2|tbsp|Brown sugar","1|tsp|Garlic powder","1|tsp|Onion powder","1|tsp|Smoked paprika","0.5|tsp|Black pepper","0.5|tsp|Chili powder","0.5|tsp|Dried thyme","0.25|tsp|Cayenne pepper, optional","0.75|cup|BBQ sauce, optional"],
"SG-019":["2.5|to 3 lb|Boneless skinless chicken thighs","1|tbsp|Olive oil","1|tsp|Salt","2|tbsp|Brown sugar","1|tsp|Garlic powder","1|tsp|Onion powder","1|tsp|Smoked paprika","0.5|tsp|Black pepper","0.5|tsp|Chili powder","0.5|tsp|Dried thyme","0.25|tsp|Cayenne pepper, optional","0.75|cup|BBQ sauce, optional"],
"SG-020":["0.25|cup|Olive oil","0.25|cup|Soy sauce","0.25|cup|Red wine vinegar","2|tbsp|Worcestershire sauce","1|tbsp|Honey","2|cloves|Garlic, minced","1|tsp|Dried oregano","1|tsp|Paprika","0.5|tsp|Black pepper","2|lb|Beef sirloin or chicken breast","1|each|Red bell pepper","1|each|Green bell pepper","1|each|Red onion","12|to 14|Whole mushrooms, optional"],
"SG-021":["6|to 8|Chicken legs","2|tbsp|Olive oil","1|tbsp|Brown sugar","1|tbsp|Paprika","1|tsp|Garlic powder","1|tsp|Onion powder","1|tsp|Salt","0.5|tsp|Black pepper","0.5|tsp|Chili powder","0.5|tsp|Smoked paprika","0.25|tsp|Cayenne pepper, optional"],
"SG-022":["2.5|to 3 lb|Chicken wings","2|tbsp|Brown sugar","1|tbsp|Paprika","1|tsp|Garlic powder","1|tsp|Onion powder","1|tsp|Salt","0.5|tsp|Black pepper","0.5|tsp|Smoked paprika","0.5|tsp|Chili powder","0.25|tsp|Cayenne pepper, optional","0.75|cup|BBQ sauce or wing sauce, optional"],
"SG-023":["4|each|Chicken leg quarters","2|tbsp|Olive oil","1|tbsp|Brown sugar","1|tbsp|Paprika","1|tsp|Garlic powder","1|tsp|Onion powder","1|tsp|Salt","0.5|tsp|Black pepper","0.5|tsp|Smoked paprika","0.5|tsp|Dried thyme","0.5|tsp|Chili powder","0.25|tsp|Cayenne pepper, optional"],
"SG-024":rub("Boneless skinless chicken breasts",4),
"SG-025":rub("Bone-in skin-on chicken thighs",4," (about 2.5 to 3 lb total)"),
"SG-026":rub("Chicken legs",8),
"SG-027":["2|lb|Chicken wings","1|tbsp|Olive oil","1|tbsp|Brown sugar","1|tsp|Garlic powder","1|tsp|Onion powder","1|tsp|Paprika","1|tsp|Baking powder","0.5|tsp|Salt","0.5|tsp|Black pepper","0.5|tsp|Dried thyme","0.25|tsp|Smoked paprika","0.25|tsp|Crushed red pepper, optional"]
};

export const SIDE_SEAFOOD_GRILL_INGREDIENTS_V8415 = cards({ ...SD, ...SF, ...SG });
