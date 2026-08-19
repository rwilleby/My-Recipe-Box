function aisleFor(name, unit = "") {
  const value = `${name} ${unit}`.toLowerCase();
  if (/refrigerated biscuit/.test(value)) return "Refrigerated Dough";
  if (/broth|soup mix/.test(value)) return "Soups, Broths & Stocks";
  if (/\bcan\b|canned|baked beans|pork and beans|cream of/.test(value)) return "Canned Goods";
  if (/worcestershire|soy sauce|ketchup|mustard|mayonnaise|marinara|tomato sauce|tomato paste|bbq sauce|gravy|ranch dressing|vinegar|oyster sauce/.test(value)) return "Sauces & Condiments";
  if (/prepared mashed potatoes|mashed potatoes|prepared stuffing/.test(value)) return "Prepared Sides";
  if (/ground beef|beef |beef$|steak|roast|chicken|turkey|pork|ham|bacon|sausage|hot dog/.test(value)) return "Meat";
  if (/tuna/.test(value)) return "Canned Goods";
  if (/milk|cream|cheese|butter|\begg|yogurt/.test(value)) return "Dairy";
  if (/frozen|hash brown|tater tot/.test(value)) return "Frozen Foods";
  if (/onion|garlic|carrot|potato|celery|bell pepper|parsley|broccoli|tomato|lettuce|romaine|green bean|lemon|mushroom|peas|coleslaw|pineapple|pickle/.test(value)) return "Produce";
  if (/salt|pepper|seasoning|powder|paprika|cumin|oregano|thyme|sage|rosemary|bay leaf|cinnamon|cloves|cayenne/.test(value)) return "Spices & Seasonings";
  if (/flour|breadcrumb|panko|cornstarch|sugar|cornmeal|baking powder|baking soda/.test(value)) return "Baking";
  if (/oil|cooking spray/.test(value)) return "Oils & Vinegars";
  if (/rice|pasta|spaghetti|macaroni|noodle/.test(value)) return "Rice, Pasta & Grains";
  if (/bread|bun|roll|biscuit|pie crust|stuffing|cracker|fritos|corn chips/.test(value)) return "Bakery & Bread";
  if (/water/.test(value)) return "Kitchen Staple";
  return "Grocery List";
}

function cards(source) {
  return Object.fromEntries(Object.entries(source).map(([id, text]) => [
    id,
    text.trim().split("\n").filter(Boolean).map((line) => {
      const [qty, unit, ...nameParts] = line.split("|");
      const name = nameParts.join("|").trim();
      return { name, qty: Number(qty), unit: unit.trim(), aisle: aisleFor(name, unit), cost: 0 };
    }),
  ]));
}

export const AMERICAN_INGREDIENTS_V849 = cards({
  "AM-011": `
6|each|Boneless skinless chicken breasts or cutlets
1|cup|Flour
1|tsp|Salt
0.5|tsp|Black pepper
1|tsp|Garlic powder
1|tsp|Onion powder
2|tbsp|Oil
1|tbsp|Butter
1|each|Large onion, sliced
2|cloves|Garlic, minced
2|tbsp|Flour
2|cups|Chicken broth
1|tsp|Worcestershire sauce
0.5|cup|Milk or cream
1|optional|Parsley
`,
  "AM-012": `
2|lb|Ham steak
2|tbsp|Butter
2|tbsp|Brown sugar
1|tbsp|Dijon mustard
1|tbsp|Worcestershire sauce
0.5|tsp|Garlic powder
0.25|tsp|Black pepper
0.25|cup|Chicken broth
1|tbsp, optional|Chopped parsley
`,
  "AM-013": `
1|each|Cooked ham, 3–4 lb
0.5|cup|Brown sugar
2|tbsp|Dijon mustard
2|tbsp|Honey
1|tbsp|Apple cider vinegar
0.5|tsp|Cinnamon
0.25|tsp|Cloves
0.25|cup|Pineapple juice or water
`,
  "AM-014": `
3|lb|Chuck roast
1|tsp|Salt
0.5|tsp|Black pepper
2|tbsp|Oil
1|each|Onion, cut in chunks
4|each|Carrots, cut in chunks
4|each|Potatoes, cut in chunks
3|cloves|Garlic, minced
2|cups|Beef broth
1|tbsp|Worcestershire sauce
1|tsp|Dried thyme
2|tbsp|Cornstarch
2|tbsp|Cold water
`,
  "AM-015": `
2|lb|Stew meat
0.25|cup|Flour
1|tsp|Salt
0.5|tsp|Black pepper
2|tbsp|Oil
1|each|Onion, chopped
3|each|Carrots, sliced
3|each|Potatoes, cubed
2|stalks|Celery, sliced
2|cloves|Garlic, minced
4|cups|Beef broth
1|tbsp|Worcestershire sauce
1|tsp|Dried thyme
1|cup|Frozen peas
`,
  "AM-016": `
2|lb|Round steak
0.5|cup|Flour
1|tsp|Salt
0.5|tsp|Black pepper
1|tsp|Garlic powder
2|tbsp|Oil
1|each|Onion, sliced
1|each|Green bell pepper, sliced
1|14.5 oz can|Diced tomatoes
1|cup|Beef broth
1|tbsp|Worcestershire sauce
1|tsp|Italian seasoning
`,
  "AM-017": `
1.5|lb|Ground beef
1|cup|Breadcrumbs
2|each|Eggs
0.5|cup|Milk
1|each|Small onion, finely chopped
1|tbsp|Worcestershire sauce
1|tsp|Garlic powder
1|tsp|Salt
0.5|tsp|Black pepper
2|tbsp|Butter
2|tbsp|Flour
2|cups|Beef broth
`,
  "AM-018": `
1.5|lb|Ground beef
1|cup|Breadcrumbs
2|each|Eggs
0.5|cup|Milk
1|each|Small onion, finely chopped
1|tbsp|Worcestershire sauce
1|tsp|Garlic powder
1|tsp|Salt
0.5|tsp|Black pepper
0.5|cup|Ketchup, divided
2|tbsp|Brown sugar
1|tsp|Yellow mustard
`,
  "AM-019": `
2|cups|Cooked beef, diced
1|cup|Carrots, diced
1|cup|Peas
1|each|Potato, diced and cooked
1|each|Small onion, chopped
2|tbsp|Butter
2|tbsp|Flour
2|cups|Beef broth
0.5|cup|Milk
1|tsp|Worcestershire sauce
0.5|tsp|Salt
0.25|tsp|Black pepper
2|each|Refrigerated pie crusts
`,
  "AM-020": `
1.5|lb|Beef sirloin, sliced thin
1|tsp|Salt
0.5|tsp|Black pepper
2|tbsp|Oil
1|each|Onion, sliced
8|oz|Mushrooms, sliced
2|cloves|Garlic, minced
2|tbsp|Flour
2|cups|Beef broth
1|tbsp|Worcestershire sauce
1|tsp|Dijon mustard
0.75|cup|Sour cream
12|oz|Egg noodles, cooked
1|optional|Parsley
`,
  "AM-021": `
1.5|lb|Ground beef
1|each|Medium onion, finely diced
2|tbsp|Butter
2|tbsp|All-purpose flour
2|cups|Beef broth
1|cup|Milk
1|tsp|Worcestershire sauce
1|tsp|Soy sauce
0.5|tsp|Garlic powder
0.5|tsp|Onion powder
0.5|tsp|Salt
0.25|tsp|Black pepper
6|cups|Mashed potatoes
1|optional|Chopped parsley
`,
  "AM-022": `
1.5|lb|Ground beef
1|each|Small onion, finely diced
1|each|Small green bell pepper, diced
2|cloves|Garlic, minced
1|tbsp|Olive oil
0.5|cup|Ketchup
0.25|cup|Brown sugar, packed
1|tbsp|Yellow mustard
1|tbsp|Worcestershire sauce
1|tsp|Apple cider vinegar
1|tsp|Chili powder
0.5|tsp|Smoked paprika
0.5|tsp|Salt
0.25|tsp|Black pepper
6|each|Hamburger buns
`,
  "AM-023": `
1|lb|Ground beef
1|each|Medium onion, diced
2|cloves|Garlic, minced
1|15 oz can|Tomato sauce
1|15 oz can|Diced tomatoes with juice
1|15 oz can|Kidney beans, drained and rinsed
2|tbsp|Chili powder
1|tsp|Ground cumin
1|tsp|Paprika
0.5|tsp|Salt
0.5|tsp|Black pepper
2|cups|Elbow macaroni, uncooked
2|cups|Shredded cheddar cheese
2|tbsp|Olive oil
1|optional|Chopped green onions
`,
  "AM-024": `
1|lb|Ground beef
1|each|Medium onion, diced
2|cloves|Garlic, minced
1|each|Green bell pepper, diced
2|tbsp|Olive oil
1|15 oz can|Tomato sauce
1|14.5 oz can|Diced tomatoes
2|tbsp|Tomato paste
1|tsp|Worcestershire sauce
1|tsp|Italian seasoning
1|tsp|Paprika
0.5|tsp|Salt
0.5|tsp|Black pepper
2.5|cups|Elbow macaroni, uncooked
2|cups|Shredded cheddar cheese
`,
  "AM-025": `
1|lb|Ground beef
1|cup|Uncooked white rice
1|each|Medium onion, diced
2|cloves|Garlic, minced
1|14.5 oz can|Diced tomatoes
1|8 oz can|Tomato sauce
1|tbsp|Tomato paste
1|tsp|Italian seasoning
1|tsp|Worcestershire sauce
1|tsp|Salt
0.5|tsp|Black pepper
0.5|tsp|Paprika
6|each|Large bell peppers
1|cup|Shredded mozzarella cheese
0.25|cup|Grated Parmesan cheese
2|tbsp, optional|Chopped fresh parsley
`,
  "AM-026": `
1.5|lb|Beef sirloin, sliced thin
1|tsp|Salt
0.5|tsp|Black pepper
2|tbsp|All-purpose flour
2|tbsp|Olive oil
1|each|Large onion, sliced
2|cloves|Garlic, minced
8|oz|Cremini mushrooms, sliced
2|cups|Beef broth
1|cup|Ketchup
1|tbsp|Worcestershire sauce
2|tsp|Soy sauce
1|tsp|Dried thyme
12|oz|Wide egg noodles, uncooked
2|tbsp, optional|Chopped fresh parsley
`,
  "AM-027": `
1.5|lb|Deli-style roast beef, thinly sliced
6|slices|Sturdy white or wheat bread
2|cups|Low-sodium beef gravy, divided
2|tbsp|Unsalted butter
1|cup|Low-sodium beef broth
1|tbsp|Worcestershire sauce
1|tsp|Garlic powder
0.5|tsp|Onion powder
1|to taste|Salt
1|to taste|Black pepper
1|tbsp|Cornstarch
1|tbsp|Cold water
1|optional|Chopped parsley
`,
  "AM-028": `
1.5|lb|Deli-style roast beef, thinly sliced
6|each|Sandwich rolls or Texas toast slices
3|tbsp|Unsalted butter
3|tbsp|All-purpose flour
4|cups|Beef broth
1|cup|Water
1|tbsp|Worcestershire sauce
1|tsp|Soy sauce
1|tsp|Garlic powder
0.5|tsp|Onion powder
0.5|tsp|Black pepper
0.5|tsp|Salt
1|tbsp|Olive oil
1|for serving|Mashed potatoes
1|for serving|Green beans
1|optional|Chopped parsley
`,
  "AM-029": `
1|lb|Boneless skinless chicken breasts, diced
1|tbsp|Olive oil
1|each|Small onion, chopped
2|cloves|Garlic, minced
1|cup|Uncooked long-grain white rice
2|10.5 oz cans|Cream of chicken soup
1.5|cups|Chicken broth
1|cup|Milk
1|cup|Sour cream
1|cup|Frozen peas and carrots, thawed
1|tsp|Garlic powder
0.5|tsp|Onion powder
0.5|tsp|Black pepper
1|cup|Shredded cheddar cheese
2|tbsp, optional|Chopped fresh parsley
`,
  "AM-030": `
2|tbsp|Unsalted butter
1|each|Small yellow onion, diced
2|stalks|Celery, diced
2|each|Carrots, diced
2|cloves|Garlic, minced
0.3333333333|cup|All-purpose flour
2.5|cups|Chicken broth
1|cup|Whole milk
0.5|cup|Heavy cream
1|tsp|Salt
0.5|tsp|Black pepper
1|tsp|Dried thyme
2|cups|Cooked chicken, diced
1|cup|Frozen peas
1|each|Refrigerated pie crust, 9-inch
1|each|Egg, beaten for egg wash
`,
  "AM-031": `
2|cups|Cooked chicken, diced
2|cups|Broccoli florets, chopped
1|cup|Long-grain white rice, uncooked
1|each|Small onion, diced
2|cloves|Garlic, minced
2|tbsp|Olive oil
2|tbsp|All-purpose flour
2|cups|Chicken broth
1|cup|Milk
1|cup|Sour cream
1.5|cups|Shredded cheddar cheese
1|tsp|Salt
0.5|tsp|Black pepper
0.5|tsp|Italian seasoning
0.5|cup|Breadcrumbs
`,
  "AM-032": `
2|cups|Cooked chicken, shredded
1|10.5 oz can|Cream of chicken soup
0.5|cup|Sour cream
0.5|cup|Milk
0.5|cup|Chicken broth
0.5|cup|Frozen peas and carrots
0.3333333333|cup|Finely chopped onion
2|stalks|Celery, diced
1|tsp|Garlic powder
0.5|tsp|Onion powder
0.5|tsp|Dried thyme
0.5|tsp|Salt
0.25|tsp|Black pepper
4|cups|Seasoned stuffing mix
0.25|cup|Melted butter
`,
  "AM-033": `
12|oz|Egg noodles
2|cups|Cooked chicken, shredded
2|tbsp|Unsalted butter
1|each|Medium onion, diced
2|cloves|Garlic, minced
2|cups|Frozen peas and carrots
2|10.5 oz cans|Cream of chicken soup
1|cup|Sour cream
1|cup|Whole milk
1|tsp|Dried thyme
1|tsp|Garlic powder
0.5|tsp|Black pepper
1.5|cups|Shredded cheddar cheese
1|cup|Panko breadcrumbs
2|tbsp|Chopped fresh parsley
`,
  "AM-034": `
12|oz|Spaghetti
2|cups|Cooked chicken, shredded
1|tbsp|Olive oil
1|each|Small onion, diced
2|cloves|Garlic, minced
1|each|Red bell pepper, diced
1|10.5 oz can|Cream of chicken soup
1|cup|Chicken broth
1|cup|Sour cream
1|cup|Milk
1|cup|Shredded cheddar cheese
0.5|cup|Grated Parmesan cheese
1|tsp|Italian seasoning
0.5|tsp|Salt
0.5|tsp|Black pepper
`,
  "AM-035": `
2|cups|Cooked chicken, shredded
8|oz|Penne pasta, uncooked
6|slices|Bacon, cooked and crumbled
1|cup|Ranch dressing
1|cup|Sour cream
1|cup|Cream cheese, softened
1.5|cups|Shredded cheddar cheese
0.5|cup|Grated Parmesan cheese
1|cup|Milk
1|tsp|Garlic powder
1|tsp|Onion powder
0.5|tsp|Salt
0.5|tsp|Black pepper
2|each|Green onions, sliced
1|tbsp, optional|Chopped fresh parsley
`,
  "AM-036": `
3|cups|Cooked chicken, shredded
6|cups|Frozen hash brown potatoes, thawed
1|cup|Sour cream
1|cup|Cream cheese, softened
0.5|cup|Whole milk
1.5|cups|Shredded sharp cheddar cheese, divided
0.5|cup|Shredded Monterey Jack cheese
0.25|cup|Chopped green onions
0.5|cup|Cooked bacon, crumbled
1|tsp|Garlic powder
1|tsp|Onion powder
0.5|tsp|Salt
0.5|tsp|Black pepper
0.5|tsp|Paprika
`,
  "AM-037": `
6|each|Boneless skinless chicken breasts
2|tbsp|Olive oil
1|tsp|Garlic powder
1|tsp|Onion powder
1|tsp|Paprika
1|tsp|Dried Italian seasoning
0.5|tsp|Salt
0.5|tsp|Black pepper
0.5|tsp|Dried thyme
1|tbsp|Lemon juice
2|tbsp|Grated Parmesan cheese
1|tbsp|Chopped fresh parsley
1|as needed|Cooking spray or olive oil, for pan
`,
  "AM-038": `
6|each|Bone-in skin-on chicken pieces, thighs, drumsticks, or breasts
1|cup|All-purpose flour
1|cup|Panko breadcrumbs
0.5|cup|Grated Parmesan cheese
1|tsp|Paprika
1|tsp|Garlic powder
1|tsp|Onion powder
1|tsp|Dried thyme
0.5|tsp|Salt
0.5|tsp|Black pepper
0.5|tsp|Cayenne pepper
2|each|Large eggs
0.5|cup|Buttermilk
2|tbsp|Olive oil or melted butter
1|as needed|Cooking spray
`,
  "AM-039": `
2|lb|Chicken tenderloins
1|cup|Buttermilk
1|each|Large egg
1|cup|All-purpose flour
1|cup|Panko breadcrumbs
0.5|cup|Grated Parmesan cheese
2|tsp|Garlic powder
1|tsp|Onion powder
1|tsp|Paprika
1|tsp|Salt
0.5|tsp|Black pepper
0.5|tsp|Dried oregano
0.25|tsp|Cayenne pepper
1|for frying|Cooking oil
1|to taste|Salt
`,
  "AM-040": `
2|cups|Cooked white rice, chilled
1|lb|Boneless skinless chicken breast, cut into 1/2-inch cubes
2|tbsp|Vegetable oil, divided
3|cloves|Garlic, minced
1|each|Small onion, diced
1|cup|Carrots, diced
0.75|cup|Frozen peas
2|each|Large eggs, lightly beaten
3|tbsp|Low-sodium soy sauce
1|tbsp|Oyster sauce
1|tbsp|Sesame oil
1|tsp|Black pepper
2|each|Green onions, sliced
0.5|tsp, or to taste|Salt
`,
  "AM-041": `
6|each|Bone-in skin-on chicken thighs
1|tbsp|Olive oil
1|tsp|Garlic powder
1|tsp|Onion powder
1|tsp|Smoked paprika
0.5|tsp|Black pepper
0.5|tsp|Salt
1|cup|BBQ sauce
2|tbsp|Brown sugar
1|tbsp|Worcestershire sauce
1|tsp|Yellow mustard
1|tsp|Apple cider vinegar
1|tbsp, optional|Chopped parsley
`,
  "AM-042": `
6|each|Boneless skinless chicken breasts
1|cup|All-purpose flour
2|each|Large eggs
1.5|cups|Italian breadcrumbs
0.5|cup|Grated Parmesan cheese
1|tsp|Garlic powder
1|tsp|Italian seasoning
1|tsp|Salt
0.5|tsp|Black pepper
2|tbsp|Olive oil
2|cups|Marinara sauce
1.5|cups|Shredded mozzarella cheese
0.25|cup|Grated Parmesan cheese
1|for serving|Cooked spaghetti
1|optional|Chopped parsley
`,
  "AM-043": `
4|cups|Cooked chicken, cubed
4|cups|Broccoli florets
1|10.5 oz can|Cream of chicken soup
0.5|cup|Mayonnaise
0.5|cup|Sour cream
1|tsp|Lemon juice
0.5|tsp|Curry powder
0.5|tsp|Garlic powder
0.5|tsp|Onion powder
1|cup|Shredded cheddar cheese
0.5|cup|Grated Parmesan cheese
0.5|cup|Breadcrumbs
2|tbsp|Melted butter
1|to taste|Salt
1|to taste|Black pepper
`,
  "AM-044": `
1|lb|Ground pork or pork sausage
1|each|Small onion, diced
1|each|Green bell pepper, diced
2|cloves|Garlic, minced
2|15 oz cans|Pork and beans
0.5|cup|Ketchup
0.25|cup|Brown sugar
1|tbsp|Yellow mustard
1|tbsp|Worcestershire sauce
1|tsp|Smoked paprika
0.5|tsp|Black pepper
1|tbsp|Olive oil
`,
  "AM-045": `
1|lb|Dried great northern beans
1|each|Meaty ham hock or 2 cups diced ham
1|each|Small onion, diced
2|stalks|Celery, diced
2|each|Carrots, diced
2|cloves|Garlic, minced
6|cups|Chicken broth or water
1|each|Bay leaf
1|tsp|Black pepper
0.5|tsp|Thyme
1|tbsp|Olive oil
1|to taste|Salt
1|optional|Chopped parsley
`,
  "AM-046": `
2|lb|Russet potatoes, peeled and thinly sliced
2|cups|Diced cooked ham
1|each|Small onion, thinly sliced
3|tbsp|Butter
3|tbsp|All-purpose flour
2.5|cups|Milk
1|cup|Shredded cheddar cheese
0.5|cup|Grated Parmesan cheese
1|tsp|Salt
0.5|tsp|Black pepper
0.5|tsp|Garlic powder
0.5|tsp|Thyme
1|as needed|Cooking spray or butter, for dish
`,
  "AM-047": `
6|each|Boneless pork chops
1|tsp|Salt
0.5|tsp|Black pepper
0.5|tsp|Garlic powder
2|tbsp|Olive oil
2|tbsp|Butter
1|each|Small onion, sliced
2|tbsp|All-purpose flour
2|cups|Chicken broth
1|tbsp|Worcestershire sauce
0.5|tsp|Onion powder
0.5|tsp|Thyme
1|optional|Chopped parsley
`,
  "AM-048": `
6|each|Bone-in pork chops
1|tsp|Salt
0.5|tsp|Black pepper
0.5|tsp|Garlic powder
0.5|cup|All-purpose flour
2|tbsp|Olive oil
2|tbsp|Butter
1|each|Large onion, sliced
2|cups|Chicken broth
0.5|cup|Milk
1|tsp|Worcestershire sauce
0.5|tsp|Thyme
1|optional|Chopped parsley
`,
  "AM-049": `
6|each|Bone-in pork chops
1|cup|All-purpose flour
1|tsp|Salt
1|tsp|Black pepper
1|tsp|Garlic powder
1|tsp|Paprika
0.5|tsp|Onion powder
2|each|Eggs
0.5|cup|Milk
0.5|cup|Panko breadcrumbs
0.25|cup|Grated Parmesan cheese
1|for frying|Vegetable oil
`,
  "AM-050": `
3|lb|Pork shoulder or pork butt
1|tsp|Salt
1|tsp|Black pepper
1|tsp|Garlic powder
1|tsp|Onion powder
1|tsp|Smoked paprika
0.5|tsp|Cayenne pepper
1|cup|BBQ sauce
0.5|cup|Chicken broth
1|tbsp|Worcestershire sauce
1|tbsp|Brown sugar
1|tbsp|Yellow mustard
6|each|Sandwich buns
1|optional|Coleslaw
`,
  "AM-051": `
1|lb|Breakfast sausage
0.25|cup|All-purpose flour
4|cups|Whole milk
0.5|tsp|Salt
0.5|tsp|Black pepper
0.25|tsp|Garlic powder
0.25|tsp|Onion powder
0.25|tsp, optional|Crushed red pepper
1|16.3 oz can, 8 biscuits|Refrigerated biscuits
`,
  "AM-052": `
14|oz|Smoked sausage, sliced 1/2-inch thick
1.5|lb|Baby potatoes, quartered
1|each|Large onion, sliced
1|each|Red bell pepper, chopped
2|tbsp|Olive oil
3|cloves|Garlic, minced
1|tsp|Smoked paprika
1|tsp|Dried thyme
0.5|tsp|Salt
0.25|tsp|Black pepper
2|tbsp, optional|Chopped fresh parsley
`,
  "AM-053": `
6|each|Ham steaks, 1/2-inch thick
0.25|cup|Brown sugar
0.25|cup|Dijon mustard
0.25|cup|Apple cider vinegar
0.25|cup|Pineapple juice
1|tbsp|Worcestershire sauce
1|tbsp|Soy sauce
1|tsp|Garlic powder
0.5|tsp|Black pepper
1|20 oz can|Pineapple rings in juice, drained
2|tbsp|Unsalted butter
`,
  "AM-054": `
1|each|Pork shoulder roast, 3–4 lb
2|tbsp|Olive oil
1|tsp|Salt
0.5|tsp|Black pepper
1|each|Large onion, chopped
4|cloves|Garlic, minced
2|cups|Low-sodium chicken broth
1|cup|Water
0.25|cup|All-purpose flour
2|tbsp|Worcestershire sauce
1|tbsp|Dijon mustard
1|tsp|Dried thyme
1|tsp|Dried rosemary
2|each|Bay leaves
1|optional|Chopped parsley
`,
  "AM-055": `
12|oz|Elbow macaroni
4|tbsp|Unsalted butter
0.25|cup|All-purpose flour
3|cups|Whole milk
1|cup|Heavy cream
1|tsp|Dijon mustard
0.5|tsp|Garlic powder
0.5|tsp|Onion powder
0.25|tsp|Black pepper
2|cups|Shredded sharp cheddar cheese
1|cup|Shredded mozzarella cheese
0.5|cup|Grated Parmesan cheese
0.5|cup, optional|Panko breadcrumbs
1|tbsp, optional|Olive oil or melted butter
`,
  "AM-056": `
12|oz|Egg noodles
2|5 oz cans|Tuna in water, drained
2|tbsp|Butter
1|each|Small onion, diced
2|cloves|Garlic, minced
2|tbsp|All-purpose flour
2|cups|Milk
1|cup|Chicken broth
1|tsp|Dijon mustard
1|tsp|Worcestershire sauce
0.5|tsp|Salt
0.25|tsp|Black pepper
1.5|cups|Frozen peas
0.5|cup|Shredded cheddar cheese
0.5|cup|Breadcrumbs
2|tbsp|Grated Parmesan cheese
2|tbsp, optional|Chopped parsley
`,
  "AM-057": `
3|cups|Cooked chicken, diced
0.5|cup|Mayonnaise
0.25|cup|Plain Greek yogurt
1|stalk|Celery, finely diced
0.25|cup|Red onion, finely diced
1|tbsp|Dijon mustard
1|tbsp|Lemon juice
1|tsp|Garlic powder
0.5|tsp|Salt
0.25|tsp|Black pepper
6|each|Lettuce leaves
12|slices|Bread
`,
  "AM-058": `
6|each|Large eggs
0.3333333333|cup|Mayonnaise
1|tbsp|Dijon mustard
1|tsp|Yellow mustard
1|tsp|Lemon juice
0.125|tsp|Garlic powder
0.125|tsp|Onion powder
0.25|tsp|Salt
0.25|tsp|Black pepper
2|tbsp|Finely chopped celery
2|tbsp|Finely chopped green onion
12|slices|Sandwich bread
1|optional|Butter or lettuce
`,
  "AM-059": `
12|slices|Bacon
12|slices|Sandwich bread
0.5|cup|Mayonnaise
2|tbsp|Dijon mustard
0.25|tsp|Black pepper
1|large head|Romaine lettuce, washed and dried
3|each|Large tomatoes, sliced
1|tbsp, optional|Unsalted butter, softened
`,
  "AM-060": `
2|tbsp|Olive oil
1|each|Medium onion, chopped
2|cloves|Garlic, minced
2|28 oz cans|Crushed tomatoes
2|cups|Tomato sauce
2|cups|Vegetable broth
1|tsp|Sugar
1|tsp|Dried basil
1|tsp|Dried oregano
0.5|tsp|Salt
0.25|tsp|Black pepper
12|slices|Bread
6|tbsp|Butter, softened
12|slices|Sharp cheddar cheese
1|optional|Fresh basil, chopped
`,
  "AM-061": `
8|each|Beef hot dogs
1|tbsp|Olive oil
1|each|Small onion, chopped
2|cloves|Garlic, minced
2|15 oz cans|Baked beans
0.3333333333|cup|Ketchup
2|tbsp|Brown sugar
1|tbsp|Yellow mustard
1|tsp|Worcestershire sauce
0.5|tsp|Smoked paprika
0.25|tsp|Black pepper
0.25|cup|Water
8|each|Hot dog buns
1|optional|Diced onion
1|optional|Yellow mustard
`,
  "AM-062": `
6|each|Beef hot dogs
6|each|Wooden skewers or sticks
1|cup|All-purpose flour
1|cup|Yellow cornmeal
0.25|cup|Granulated sugar
1|tbsp|Baking powder
0.5|tsp|Salt
0.25|tsp|Baking soda
1|each|Large egg
0.75|cup|Milk
1|tbsp|Vegetable oil
1|for frying|Vegetable oil
1|for serving|Yellow mustard
1|for serving|Ketchup
`,
  "AM-064": `
12|slices|White or wheat sandwich bread
0.5|cup|Mayonnaise
1|tbsp|Dijon mustard
1|lb|Sliced roasted turkey
6|slices|Cooked bacon, crispy
4|leaves|Green leaf lettuce
2|each|Large tomatoes, sliced
0.5|each|Small red onion, thinly sliced
1|to taste|Salt
1|to taste|Black pepper
1|tbsp|Unsalted butter, softened
4|each|Toothpicks or sandwich picks
1|for serving|Dill pickle spears
`,
  "AM-065": `
1|lb|Day-old bread, cubed
2|tbsp|Unsalted butter
1|each|Medium onion, diced
2|stalks|Celery, diced
2|cloves|Garlic, minced
1|tsp|Dried sage
1|tsp|Dried thyme
1|tsp|Poultry seasoning
0.5|tsp|Salt
0.5|tsp|Black pepper
2.5|cups|Low-sodium chicken broth
2|each|Large eggs, beaten
2|tbsp, optional|Chopped parsley
2|cups|Sliced cooked turkey
3|cups|Turkey gravy, warmed
`,
  "AM-066": `
1.5|lb|Boneless turkey breast
1|tsp|Salt
0.5|tsp|Black pepper
1|tsp|Garlic powder
1|tsp|Onion powder
2|tbsp|Olive oil
2|cups|Chicken broth
2|tbsp|Unsalted butter
0.25|cup|All-purpose flour
4|cups|Prepared mashed potatoes
1|cup|Turkey gravy
1.5|cups|Prepared stuffing
2|cups|Green beans
1|tbsp|Butter
0.25|tsp|Salt
0.25|tsp|Black pepper
0.5|cup|Cranberry sauce
`,
  "AM-067": `
1.5|lb|Ground beef
1|each|Medium onion, diced
2|cloves|Garlic, minced
1|cup|Diced carrots
1|cup|Frozen peas
1|tbsp|Tomato paste
1|cup|Beef broth
1|tbsp|Worcestershire sauce
1|tsp|Salt
0.5|tsp|Black pepper
1|tsp|Dried thyme
2|tbsp|All-purpose flour
2|tbsp|Olive oil
2|lb|Russet potatoes
0.25|cup|Milk
4|tbsp|Unsalted butter
0.5|cup|Shredded cheddar cheese
1|optional|Chopped parsley
`,
  "AM-068": `
1|lb|Ground beef
1|each|Medium onion, diced
2|cloves|Garlic, minced
1|15 oz can|Kidney beans, drained and rinsed
1|15 oz can|Pinto beans, drained and rinsed
1|15 oz can|Diced tomatoes
1|8 oz can|Tomato sauce
2|tbsp|Chili powder
1|tsp|Ground cumin
1|tsp|Paprika
0.5|tsp|Salt
0.25|tsp|Black pepper
3|cups|Fritos corn chips
2|cups|Shredded cheddar cheese
0.5|cup|Diced white onion
0.25|cup|Sliced green onions
`,
  "AM-069": `
4|each|Large russet potatoes
2|tbsp|Olive oil
1|tsp|Salt
0.5|tsp|Black pepper
4|tbsp|Unsalted butter
0.25|cup|Sour cream
1|cup|Shredded cheddar cheese
1|cup|Cooked bacon, crumbled
2|each|Green onions, sliced
1|cup|Steamed broccoli
1|tbsp|Olive oil
0.25|tsp|Salt
0.25|tsp|Black pepper
`,
  "AM-070": `
1|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
1|tsp|Salt
0.5|tsp|Black pepper
1|tsp|Worcestershire sauce
1|tbsp|Ketchup
1|cup|Diced tomatoes, drained
1|cup|Shredded cheddar cheese
0.5|cup|Milk
1|10.5 oz can|Cream of mushroom soup
3|cups|Cooked elbow macaroni
0.5|cup|Breadcrumbs
1|tbsp|Butter, melted
1|for garnish|Sliced pickles
1|optional|Chopped parsley
`,
  "AM-071": `
1|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
1|tsp|Salt
0.5|tsp|Black pepper
1|tsp|Worcestershire sauce
1|10.5 oz can|Cream of mushroom soup
0.5|cup|Sour cream
2|tbsp|Milk
1|cup|Frozen mixed vegetables
1|cup|Shredded cheddar cheese
1|32 oz bag|Frozen tater tots
1|optional|Chopped parsley
`,
  "AM-072": `
1|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Medium russet potatoes, thinly sliced
1|10.5 oz can|Cream of mushroom soup
1|cup|Milk
1|tsp|Paprika
1|cup|Shredded cheddar cheese
2|tbsp|Butter
1|optional|Chopped parsley
`,
  "AM-073": `
3|cups|Cooked chicken, diced
2|14.5 oz cans|Cut green beans, drained
1|10.5 oz can|Cream of chicken soup
0.5|cup|Sour cream
0.5|cup|Milk
1|tsp|Garlic powder
0.5|tsp|Salt
0.5|tsp|Black pepper
1|cup|Shredded cheddar cheese
1|cup|Crispy fried onions
`,
  "AM-074": `
3|cups|Cooked chicken, diced
2|cups|Cooked ham, diced
1|10.5 oz can|Cream of chicken soup
1|cup|Milk
1|tsp|Dijon mustard
0.5|tsp|Garlic powder
0.25|tsp|Black pepper
2|cups|Shredded Swiss cheese
1|sleeve|Buttery crackers, crushed
3|tbsp|Butter, melted
`,
  "AM-075": `
1|lb|Ground beef
1|each|Green bell pepper, sliced
1|each|Small onion, sliced
8|oz|Mushrooms, sliced
2|cloves|Garlic, minced
1|tsp|Salt
0.5|tsp|Black pepper
1|tsp|Worcestershire sauce
8|oz|Penne pasta, cooked
1|cup|Beef broth
4|oz|Cream cheese
1.5|cups|Shredded provolone or mozzarella cheese
0.5|cup|Shredded mozzarella cheese, for topping
`,
  "AM-076": `
1|lb|Ground beef
1|each|Small onion, diced
2|each|Bell peppers, chopped
2|cloves|Garlic, minced
1|cup|Uncooked long-grain rice
1|15 oz can|Tomato sauce
1|14.5 oz can|Diced tomatoes
2|cups|Beef broth
1|tsp|Italian seasoning
1|tsp|Salt
0.5|tsp|Black pepper
1.5|cups|Shredded mozzarella or cheddar cheese
`,
  "AM-077": `
3|cups|Cooked chicken, shredded
2|15 oz cans|Baked beans
0.5|cup|BBQ sauce
1|each|Small onion, diced
1|each|Bell pepper, diced
1|tsp|Garlic powder
0.5|tsp|Black pepper
1|cup|Shredded cheddar cheese
0.5|cup, optional|Cooked bacon, crumbled
1|cup|Crispy fried onions
`,
  "AM-078": `
12|oz|Pasta
2|cups|Cooked ham, diced
2|tbsp|Butter
2|tbsp|All-purpose flour
2|cups|Milk
1|tsp|Dijon mustard
0.5|tsp|Garlic powder
0.25|tsp|Black pepper
2|cups|Shredded cheddar cheese
1|cup|Shredded Swiss or mozzarella cheese
0.5|cup|Breadcrumbs
1|tbsp|Butter, melted
`,
});
