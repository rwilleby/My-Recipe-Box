function aisleFor(name, unit = "") {
  const value = `${name} ${unit}`.toLowerCase();
  if (/chicken|beef|sausage|meatball|pepperoni|ham|salami|shrimp|scallop|clam|cod|salmon|tuna|crab/.test(value)) return "Meat & Seafood";
  if (/butter|cream|milk|half-and-half|parmesan|mozzarella|ricotta|provolone|egg/.test(value)) return "Dairy";
  if (/onion|garlic|carrot|celery|mushroom|pepper|spinach|kale|potato|zucchini|squash|broccoli|tomato|eggplant|parsley|basil|chive|lemon|arugula/.test(value)) return "Produce";
  if (/pasta|spaghetti|fettuccine|linguine|penne|ziti|lasagna|shell|manicotti|ravioli|tortellini|pappardelle|gnocchi|ditalini|acini|lentil/.test(value)) return "Pasta, Rice & Dry Goods";
  if (/bread|bun|roll|flatbread|pizza dough|pizza crust/.test(value)) return "Bread & Bakery";
  if (/flour|breadcrumb|salt|seasoning|paprika|nutmeg|pepper flake|black pepper|garlic powder|sugar/.test(value)) return "Baking & Spices";
  if (/oil|vinegar|vodka|marsala/.test(value)) return "Oils, Vinegars & Wine";
  if (/marinara|pizza sauce|pesto|tomato paste|broth|crushed tomatoes|diced tomatoes|beans|capers|pepperoncini|balsamic glaze/.test(value)) return "Canned Goods & Condiments";
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

export const ITALIAN_INGREDIENTS_V8412 = cards({
  "IT-001": `
1|lb|Fettuccine
2|each|Chicken breasts, sliced
1|tsp|Salt, divided
0.5|tsp|Black pepper
1|tsp|Garlic powder
2|tbsp|Olive oil
3|tbsp|Butter
3|cloves|Garlic, minced
1.5|cups|Heavy cream
1|cup|Whole milk
1.5|cups|Grated Parmesan
2|tbsp|Chopped parsley
`,
  "IT-002": `
4|each|Boneless chicken cutlets
1|tsp|Salt
0.5|tsp|Black pepper
0.5|cup|Flour
2|each|Eggs, beaten
1|cup|Italian breadcrumbs
0.5|cup|Grated Parmesan
3|tbsp|Olive oil
2|cups|Marinara sauce
1.5|cups|Shredded mozzarella
8|oz|Spaghetti, cooked
2|tbsp|Chopped basil
`,
  "IT-003": `
4|each|Chicken cutlets
1|tsp|Salt
0.5|tsp|Black pepper
0.5|cup|Flour
2|tbsp|Olive oil
2|tbsp|Butter
8|oz|Mushrooms, sliced
2|cloves|Garlic, minced
0.75|cup|Marsala wine
0.75|cup|Chicken broth
0.3333333333|cup|Heavy cream
2|tbsp|Chopped parsley
`,
  "IT-004": `
4|each|Chicken cutlets
1|tsp|Salt
0.5|tsp|Black pepper
0.5|cup|Flour
2|tbsp|Olive oil
3|tbsp|Butter, divided
0.5|cup|Chicken broth
0.3333333333|cup|Fresh lemon juice
2|tbsp|Capers, drained
0.25|cup|Heavy cream
2|tbsp|Chopped parsley
1|optional amount not specified|Lemon slices
`,
  "IT-005": `
4|each|Chicken breasts
1|tsp|Salt
0.5|tsp|Black pepper
1|tsp|Italian seasoning
2|tbsp|Olive oil
3|cloves|Garlic, minced
1|cup|Chicken broth
0.75|cup|Heavy cream
0.5|cup|Grated Parmesan
1|cup|Baby spinach
0.5|cup|Sun-dried tomatoes, chopped
2|tbsp|Chopped basil
`,
  "IT-006": `
12|oz|Penne pasta
2|each|Chicken breasts, cubed
1|tsp|Salt
0.5|tsp|Black pepper
1|tsp|Paprika
2|tbsp|Olive oil
2|tbsp|Butter
4|cloves|Garlic, minced
1.5|cups|Heavy cream
1|cup|Chicken broth
1|cup|Grated Parmesan
2|cups|Spinach
2|tbsp|Parsley
`,
  "IT-007": `
4|each|Chicken breasts
1|tsp|Salt
0.5|tsp|Black pepper
1|tsp|Garlic powder
1|tsp|Italian seasoning
2|tbsp|Olive oil
1|cup|Marinara sauce
1|cup|Shredded mozzarella
0.25|cup|Grated Parmesan
1|cup|Cherry tomatoes, halved
2|tbsp|Chopped basil
`,
  "IT-008": `
4|each|Chicken thighs
1|tsp|Salt
0.5|tsp|Black pepper
2|tbsp|Olive oil
1|each|Onion, sliced
1|each|Bell pepper, sliced
8|oz|Mushrooms, sliced
3|cloves|Garlic, minced
1|14 oz can|Crushed tomatoes
0.5|cup|Chicken broth
1|tsp|Italian seasoning
2|tbsp|Chopped parsley
`,
  "IT-009": `
4|each|Chicken cutlets
1|tsp|Salt
0.5|tsp|Black pepper
0.5|tsp|Garlic powder
2|tbsp|Olive oil
2|tbsp|Butter
3|cloves|Garlic, minced
0.75|cup|Chicken broth
0.75|cup|Heavy cream
0.5|cup|Grated Parmesan
3|cups|Baby spinach
2|tbsp|Chopped parsley
`,
  "IT-010": `
12|oz|Angel hair pasta
1|lb|Chicken tenderloins
1|tsp|Salt, divided
0.5|tsp|Black pepper
2|tbsp|Olive oil
3|tbsp|Butter
4|cloves|Garlic, minced
0.5|cup|Chicken broth
0.25|cup|Lemon juice
0.25|tsp|Red pepper flakes
0.25|cup|Grated Parmesan
2|tbsp|Chopped parsley
`,
  "IT-011": `
1|lb|Spaghetti
1|lb|Italian meatballs, cooked
2|tbsp|Olive oil
3|cloves|Garlic, minced
1|24 oz jar|Marinara sauce
0.5|cup|Water
1|tsp|Italian seasoning
0.25|tsp|Red pepper flakes
0.5|cup|Grated Parmesan
2|tbsp|Chopped parsley
`,
  "IT-012": `
12|oz|Ziti
1|lb|Italian sausage
1|each|Small onion, diced
3|cloves|Garlic, minced
1|24 oz jar|Marinara sauce
1|cup|Ricotta cheese
2|cups|Shredded mozzarella
0.5|cup|Grated Parmesan
2|tbsp|Chopped basil
`,
  "IT-013": `
9|each|Lasagna noodles
1|lb|Ground beef
1|each|Small onion, diced
3|cloves|Garlic, minced
1|24 oz jar|Marinara sauce
15|oz|Ricotta cheese
1|each|Egg
2|cups|Shredded mozzarella
0.5|cup|Grated Parmesan
2|tbsp|Chopped parsley
`,
  "IT-014": `
1.5|lb|Ground beef
1|cup|Italian breadcrumbs
2|each|Eggs
0.5|cup|Milk
0.5|cup|Grated Parmesan
1|each|Small onion, diced
2|cloves|Garlic, minced
1|tsp|Italian seasoning
1|cup|Marinara sauce, divided
1|cup|Shredded mozzarella
2|tbsp|Chopped parsley
`,
  "IT-015": `
2|lb|Beef chuck
1|tsp|Salt
0.5|tsp|Black pepper
2|tbsp|Olive oil
1|each|Small onion, diced
1|each|Carrot, diced
2|stalks|Celery, diced
3|cloves|Garlic, minced
2|tbsp|Tomato paste
1|28 oz can|Crushed tomatoes
1|cup|Beef broth
12|oz|Pappardelle
`,
  "IT-016": `
3|lb|Chuck roast
1|tsp|Salt
0.5|tsp|Black pepper
2|tbsp|Olive oil
1|each|Small onion, sliced
3|cloves|Garlic, minced
1|cup|Beef broth
1|cup|Pepperoncini rings with juice
1|tsp|Italian seasoning
6|each|Hoagie rolls
6|slices|Provolone cheese
`,
  "IT-017": `
1.5|lb|Italian sausage links
2|tsp|Olive oil
1|each|Red bell pepper, sliced
1|each|Green bell pepper, sliced
1|each|Yellow onion, sliced
3|cloves|Garlic, minced
1|14 oz can|Diced tomatoes
1|tsp|Italian seasoning
6|each, optional|Hoagie rolls
2|tbsp|Chopped parsley
`,
  "IT-018": `
20|each|Jumbo shells
1|lb|Ground beef
1|24 oz jar|Marinara sauce
15|oz|Ricotta cheese
1|each|Egg
1.5|cups|Shredded mozzarella, divided
0.5|cup|Grated Parmesan
2|tbsp|Chopped parsley
1|tsp|Italian seasoning
`,
  "IT-019": `
8|each|Manicotti shells
1|lb|Ground beef
1|24 oz jar|Marinara sauce
15|oz|Ricotta cheese
1|each|Egg
1.5|cups|Shredded mozzarella, divided
0.5|cup|Grated Parmesan
2|tbsp|Chopped parsley
1|tsp|Italian seasoning
`,
  "IT-020": `
1|lb|Ground beef
0.5|lb|Italian sausage
1|cup|Italian breadcrumbs
2|each|Eggs
0.5|cup|Milk
0.5|cup|Grated Parmesan
3|cloves|Garlic, minced
2|tbsp|Chopped parsley
1|tsp|Italian seasoning
2|cups|Marinara sauce
`,
  "IT-021": `
12|oz|Fettuccine
4|tbsp|Butter
3|cloves|Garlic, minced
1.5|cups|Heavy cream
1|cup|Whole milk
1.5|cups|Grated Parmesan
0.5|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Nutmeg
2|tbsp|Chopped parsley
`,
  "IT-022": `
12|oz|Spaghetti
1|lb|Ground beef
1|each|Small onion, diced
3|cloves|Garlic, minced
1|24 oz jar|Marinara sauce
8|oz|Ricotta cheese
1|each|Egg
2|cups|Shredded mozzarella
0.5|cup|Grated Parmesan
1|tsp|Italian seasoning
2|tbsp|Chopped parsley
`,
  "IT-023": `
12|oz|Pasta
2|tbsp|Olive oil
1|each|Zucchini, sliced
1|each|Yellow squash, sliced
1|each|Red bell pepper, sliced
2|cups|Broccoli florets
3|cloves|Garlic, minced
1|cup|Cherry tomatoes
0.75|cup|Heavy cream
0.5|cup|Grated Parmesan
2|tbsp|Chopped basil
`,
  "IT-024": `
12|oz|Penne
2|tbsp|Olive oil
1|each|Small onion, diced
3|cloves|Garlic, minced
2|tbsp|Tomato paste
1|14 oz can|Crushed tomatoes
0.25|cup|Vodka
1|cup|Heavy cream
0.5|cup|Grated Parmesan
0.5|tsp|Red pepper flakes
2|tbsp|Chopped basil
`,
  "IT-025": `
25|oz|Cheese ravioli
1|24 oz jar|Marinara sauce
1|cup|Ricotta cheese
2|cups|Shredded mozzarella
0.5|cup|Grated Parmesan
1|tsp|Italian seasoning
2|tbsp|Chopped parsley
1|tbsp|Olive oil
`,
  "IT-026": `
20|oz|Cheese tortellini
3|tbsp|Butter
3|cloves|Garlic, minced
1.25|cups|Heavy cream
0.75|cup|Whole milk
1|cup|Grated Parmesan
0.5|tsp|Salt
0.25|tsp|Black pepper
2|tbsp|Chopped parsley
`,
  "IT-027": `
12|oz|Pasta
0.5|cup|Basil pesto
2|tbsp|Olive oil
1|cup|Cherry tomatoes, halved
0.5|cup|Grated Parmesan
2|cloves|Garlic, minced
0.25|cup|Pasta water
2|tbsp|Chopped basil
0.25|tsp|Black pepper
`,
  "IT-028": `
12|oz|Penne
2|tbsp|Olive oil
1|each|Small onion, diced
3|cloves|Garlic, minced
1|14 oz can|Crushed tomatoes
0.75|cup|Heavy cream
0.5|cup|Grated Parmesan
1|tsp|Italian seasoning
0.25|tsp|Red pepper flakes
2|tbsp|Chopped basil
`,
  "IT-029": `
20|each|Jumbo shells
15|oz|Ricotta cheese
1|each|Egg
1.5|cups|Shredded mozzarella, divided
0.5|cup|Grated Parmesan
2|cups|Chopped spinach
1|24 oz jar|Marinara sauce
1|tsp|Italian seasoning
2|tbsp|Chopped parsley
`,
  "IT-030": `
2|each|Medium eggplants, sliced
1|tsp|Salt
0.5|cup|Flour
2|each|Eggs, beaten
1.5|cups|Italian breadcrumbs
3|tbsp|Olive oil
1|24 oz jar|Marinara sauce
2|cups|Shredded mozzarella
0.5|cup|Grated Parmesan
2|tbsp|Chopped basil
`,
  "IT-031": `
12|oz|Linguine
1|lb|Large shrimp, peeled and deveined
3|tbsp|Butter
2|tbsp|Olive oil
4|cloves|Garlic, minced
0.25|tsp|Red pepper flakes
0.5|cup|Chicken broth
1|each|Juice of 1 lemon
0.25|cup|Chopped parsley
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-032": `
12|oz|Fettuccine
0.5|lb|Shrimp, peeled and deveined
0.5|lb|Bay scallops
2|tbsp|Butter
2|cloves|Garlic, minced
1.25|cups|Heavy cream
0.75|cup|Whole milk
1|cup|Grated Parmesan
0.5|tsp|Salt
0.25|tsp|Black pepper
2|tbsp|Chopped parsley
`,
  "IT-033": `
12|oz|Linguine
2|tbsp|Olive oil
3|cloves|Garlic, minced
0.25|tsp|Red pepper flakes
2|10 oz cans|Chopped clams, with juice
0.5|cup|Chicken broth
1|each|Juice of 1/2 lemon
2|tbsp|Butter
0.25|cup|Chopped parsley
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-034": `
12|oz|Spaghetti
1|lb|Shrimp, peeled and deveined
2|tbsp|Olive oil
2|tbsp|Butter
4|cloves|Garlic, minced
1|each|Zest and juice of 1 lemon
0.5|cup|Chicken broth
0.25|cup|Grated Parmesan
2|tbsp|Chopped parsley
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-035": `
4|each|Cod fillets
2|tbsp|Olive oil
2|cloves|Garlic, minced
1|cup|Cherry tomatoes, halved
0.5|cup|Italian breadcrumbs
0.25|cup|Grated Parmesan
1|tsp|Italian seasoning
1|each|Juice of 1/2 lemon
2|tbsp|Chopped parsley
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-036": `
4|each|Salmon fillets
1|tbsp|Olive oil
2|tbsp|Butter
2|cloves|Garlic, minced
3|cups|Baby spinach
0.75|cup|Heavy cream
0.25|cup|Grated Parmesan
0.5|tsp|Italian seasoning
0.5|tsp|Salt
0.25|tsp|Black pepper
1|tbsp|Lemon juice
`,
  "IT-037": `
12|oz|Linguine
1|lb|Shrimp, peeled and deveined
2|tbsp|Olive oil
4|cloves|Garlic, minced
0.5|tsp|Red pepper flakes
1|24 oz jar|Marinara sauce
1|cup|Crushed tomatoes
1|tsp|Italian seasoning
2|tbsp|Chopped parsley
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-038": `
20|oz|Crab ravioli
2|tbsp|Butter
2|cloves|Garlic, minced
0.75|cup|Heavy cream
0.5|cup|Whole milk
0.5|cup|Grated Parmesan
0.5|cup|Lump crab meat
1|tbsp|Lemon juice
2|tbsp|Chopped chives
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-039": `
12|oz|Linguine
1|lb|Sea scallops
2|tbsp|Olive oil
2|tbsp|Butter
3|cloves|Garlic, minced
0.5|cup|Chicken broth
1|each|Juice of 1/2 lemon
0.25|cup|Grated Parmesan
2|tbsp|Chopped parsley
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-040": `
12|oz|Penne
2|5 oz cans|Tuna, drained
1|tbsp|Olive oil
1|each|Small onion, diced
2|cloves|Garlic, minced
1|14 oz can|Crushed tomatoes
0.5|cup|Heavy cream
1.5|cups|Shredded mozzarella
0.25|cup|Grated Parmesan
1|tsp|Italian seasoning
2|tbsp|Chopped parsley
`,
  "IT-041": `
1|each|Pizza dough
0.5|cup|Pizza sauce
8|oz|Fresh mozzarella, sliced
2|each|Roma tomatoes, sliced
2|tbsp|Olive oil
0.25|cup|Fresh basil leaves
2|tbsp|Grated Parmesan
0.5|tsp|Italian seasoning
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-042": `
1|each|Pizza dough
0.5|cup|Pizza sauce
2|cups|Shredded mozzarella
24|slices|Pepperoni
2|tbsp|Grated Parmesan
1|tbsp|Olive oil
0.5|tsp|Italian seasoning
0.5|tsp|Garlic powder
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-043": `
1|each|Pizza dough
0.5|cup|Pizza sauce
2|cups|Shredded mozzarella
8|oz|Italian sausage, cooked and crumbled
0.25|cup|Sliced bell pepper
2|tbsp|Grated Parmesan
1|tbsp|Olive oil
0.5|tsp|Italian seasoning
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-044": `
1|loaf|Garlic bread, halved
0.5|cup|Pizza sauce
2|cups|Shredded mozzarella
16|slices|Pepperoni
2|tbsp|Grated Parmesan
1|tsp|Italian seasoning
1|tbsp|Chopped parsley
0.5|tsp|Garlic powder
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-045": `
1|each|Pizza dough
0.5|cup|Pizza sauce
1.5|cups|Shredded mozzarella
0.5|cup|Sliced pepperoni
0.5|cup|Sliced ham
0.25|cup|Sautéed bell peppers
2|tbsp|Grated Parmesan
1|each|Egg, beaten
1|tsp|Italian seasoning
0.5|tsp|Garlic powder
`,
  "IT-046": `
1|each|Pizza dough
1|cup|Ricotta cheese
1|cup|Shredded mozzarella
0.25|cup|Grated Parmesan
0.5|cup|Cooked Italian sausage
0.25|cup|Chopped spinach
1|each|Egg, beaten
1|tsp|Italian seasoning
0.5|tsp|Garlic powder
0.5|cup|Marinara sauce, for serving
`,
  "IT-047": `
4|each|Hoagie rolls
16|each|Frozen or homemade meatballs, cooked
1.5|cups|Marinara sauce
1.5|cups|Shredded mozzarella
0.25|cup|Grated Parmesan
2|tbsp|Butter, melted
1|tsp|Garlic powder
1|tsp|Italian seasoning
1|tbsp|Chopped parsley
0.25|tsp|Black pepper
`,
  "IT-048": `
4|each|Breaded chicken cutlets
4|each|Hoagie rolls
1.5|cups|Marinara sauce
1.5|cups|Shredded mozzarella
0.25|cup|Grated Parmesan
2|tbsp|Butter, melted
1|tsp|Garlic powder
1|tsp|Italian seasoning
1|tbsp|Chopped parsley
0.25|tsp|Black pepper
`,
  "IT-049": `
12|each|Slider rolls
0.5|lb|Sliced ham
0.5|lb|Sliced salami
8|slices|Provolone cheese
0.5|cup|Pepperoncini, sliced
2|tbsp|Butter, melted
1|tsp|Italian seasoning
0.5|tsp|Garlic powder
1|tbsp|Grated Parmesan
1|tbsp|Chopped parsley
`,
  "IT-050": `
1|each|Flatbread crust
0.3333333333|cup|Pesto
8|oz|Fresh mozzarella, sliced
2|each|Roma tomatoes, sliced
1|tbsp|Olive oil
2|tbsp|Balsamic glaze
0.25|cup|Fresh basil leaves
2|tbsp|Grated Parmesan
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-051": `
1|lb|Italian sausage
4|slices|Bacon, chopped
1|each|Small onion, diced
3|cloves|Garlic, minced
4|cups|Chicken broth
3|cups|Russet potatoes, sliced
2|cups|Chopped kale
1|cup|Heavy cream
1|tsp|Italian seasoning
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-052": `
1|lb|Ground beef
1|each|Small onion, diced
2|each|Carrots, sliced
2|stalks|Celery, sliced
3|cloves|Garlic, minced
1|28 oz can|Crushed tomatoes
4|cups|Beef broth
1|15 oz can|Cannellini beans, drained
1|cup|Ditalini pasta
1|tsp|Italian seasoning
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-053": `
1|lb|Mini meatballs
1|tbsp|Olive oil
1|each|Small onion, diced
2|each|Carrots, sliced
2|stalks|Celery, sliced
3|cloves|Garlic, minced
8|cups|Chicken broth
1|cup|Acini di pepe pasta
3|cups|Baby spinach
1|tsp|Italian seasoning
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-054": `
1|tbsp|Olive oil
1|each|Small onion, diced
2|each|Carrots, sliced
2|stalks|Celery, sliced
3|cloves|Garlic, minced
1|each|Zucchini, diced
1|28 oz can|Crushed tomatoes
4|cups|Vegetable broth
1|15 oz can|Kidney beans, drained
1|cup|Ditalini pasta
1|tsp|Italian seasoning
2|cups|Chopped spinach
`,
  "IT-055": `
2|tbsp|Olive oil
1|each|Small onion, diced
3|cloves|Garlic, minced
2|14 oz cans|Crushed tomatoes
2|cups|Chicken broth
2|tbsp|Tomato paste
1|tsp|Sugar
0.5|cup|Fresh basil, chopped
0.75|cup|Heavy cream
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-056": `
2|tbsp|Butter
1|each|Small onion, diced
2|each|Carrots, shredded
2|stalks|Celery, diced
3|cloves|Garlic, minced
4|cups|Chicken broth
2|cups|Cooked chicken, chopped
1|lb|Potato gnocchi
1|cup|Half-and-half
2|cups|Baby spinach
1|tsp|Italian seasoning
0.5|tsp|Salt
`,
  "IT-057": `
1|lb|Italian sausage
1|each|Small onion, diced
3|cloves|Garlic, minced
4|cups|Chicken broth
1|14 oz can|Crushed tomatoes
1|20 oz package|Cheese tortellini
1|cup|Heavy cream
2|cups|Baby spinach
1|tsp|Italian seasoning
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-058": `
2|tbsp|Olive oil
1|each|Small onion, diced
2|each|Carrots, diced
2|stalks|Celery, diced
3|cloves|Garlic, minced
2|15 oz cans|Cannellini beans, drained
1|14 oz can|Crushed tomatoes
4|cups|Vegetable broth
3|cups|Chopped kale
3|cups|Cubed day-old bread
1|tsp|Italian seasoning
0.5|tsp|Salt
`,
  "IT-059": `
1|tbsp|Olive oil
1|each|Small onion, diced
2|each|Carrots, diced
2|stalks|Celery, diced
3|cloves|Garlic, minced
1.5|cups|Brown lentils, rinsed
1|14 oz can|Crushed tomatoes
5|cups|Vegetable broth
1|tsp|Italian seasoning
2|cups|Chopped spinach
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
  "IT-060": `
2|tbsp|Butter
1|each|Small onion, diced
3|cloves|Garlic, minced
4|cups|Chicken broth
2|cups|Russet potatoes, diced
1|cup|Carrots, diced
1|cup|Heavy cream
1|cup|Grated Parmesan
1|tsp|Italian seasoning
2|cups|Baby spinach
0.5|tsp|Salt
0.25|tsp|Black pepper
`,
});
