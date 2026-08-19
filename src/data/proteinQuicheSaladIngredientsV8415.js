function aisleFor(name, unit = "") {
  const value = `${name} ${unit}`.toLowerCase();
  if (/shrimp|crab|salmon|tuna|chicken|turkey|ham|bacon|sausage|ground beef|salami|capicola/.test(value)) return "Meat & Seafood";
  if (/egg|milk|cream|yogurt|cheese|cheddar|swiss|parmesan|mozzarella|feta|butter|whipped topping/.test(value)) return "Dairy";
  if (/apple|blueberr|strawberr|raspberr|cranberr|orange|lemon|lime|banana|pumpkin|carrot|celery|cucumber|tomato|lettuce|romaine|cabbage|onion|pepper|avocado|greens|kale|radish/.test(value)) return "Produce";
  if (/pie shell|pie crust|cookie crust|graham cracker|crouton|wonton|tortilla strip|bun/.test(value)) return "Bread & Bakery";
  if (/pie filling|pudding mix|gelatin|lemonade drink mix|condensed milk|black olive|chickpea|edamame|pickle|banana pepper/.test(value)) return "Canned & Packaged Goods";
  if (/dressing|mayonnaise|mustard|vinegar|soy sauce|buffalo sauce|burger sauce|maple syrup|honey|lemon juice|lime juice|oil/.test(value)) return "Condiments & Oils";
  if (/oat|protein powder|flour|sugar|splenda|sweetener|baking|cocoa|coconut|chocolate|pectin|cornstarch|spice|cinnamon|nutmeg|salt|pepper|garlic powder|onion powder|paprika|oregano|dill|old bay|vanilla|streusel|sunflower|almond|walnut|raisin|poppy/.test(value)) return "Baking & Spices";
  if (/pasta|rotini/.test(value)) return "Pasta & Grains";
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

export const PROTEIN_QUICHE_SALAD_INGREDIENTS_V8415 = cards({
  "PM-001": `
1.5|cups|Rolled oats
1|cup|Vanilla protein powder
1|tsp|Baking powder
1|tsp|Baking soda
1.5|tsp|Ground cinnamon
0.25|tsp|Salt
0.5|cup|Unsweetened applesauce
0.3333333333|cup|Maple syrup
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
1|cup|Finely diced apple (about 1 medium apple)
`,
  "PM-002": `
1|cup|Rolled oats
1|cup|Vanilla protein powder
1|tsp|Baking powder
1|tsp|Baking soda
0.5|tsp|Ground cinnamon
0.25|tsp|Salt
0.5|cup|Unsweetened applesauce
0.3333333333|cup|Honey or maple syrup
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
1|cup|Greek yogurt, plain or vanilla
1|cup|Fresh or frozen blueberries
`,
  "PM-003": `
1|cup|Rolled oats
1|cup|Vanilla protein powder
1|tsp|Baking powder
1|tsp|Baking soda
0.25|tsp|Salt
0.5|cup|Unsweetened applesauce
0.3333333333|cup|Maple syrup or honey
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
1|cup|Greek yogurt, plain or vanilla
0.75|cup|Mini chocolate chips
`,
  "PM-004": `
1|cup|Rolled oats
1|cup|Chocolate protein powder
0.5|cup|Unsweetened cocoa powder
1|tsp|Baking powder
1|tsp|Baking soda
0.25|tsp|Salt
0.5|cup|Unsweetened applesauce
0.3333333333|cup|Maple syrup or honey
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
1|cup|Greek yogurt, plain or vanilla
0.75|cup|Mini chocolate chips
`,
  "PM-005": `
1|cup|Rolled oats
1|cup|Vanilla protein powder
1|tbsp|Poppy seeds
1|tsp|Baking powder
0.5|tsp|Baking soda
0.25|tsp|Salt
1|zest of 2 lemons|Lemon zest
0.5|cup|Unsweetened applesauce
0.3333333333|cup|Honey or maple syrup
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
1|cup|Greek yogurt
2|tbsp|Fresh lemon juice
`,
  "PM-006": `
1|cup|Rolled oats
1|cup|Vanilla protein powder
0.5|cup|Pumpkin puree
1|tsp|Baking powder
1|tsp|Baking soda
1.5|tsp|Pumpkin pie spice
0.25|tsp|Salt
0.5|cup|Unsweetened applesauce
0.3333333333|cup|Maple syrup or honey
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
1|cup|Greek yogurt
2|tbsp, if needed|Milk
`,
  "PM-007": `
1|cup|Rolled oats
1|cup|Vanilla protein powder
1|tsp|Baking powder
1|tsp|Baking soda
0.5|tsp|Ground cinnamon
0.25|tsp|Salt
2|each|Ripe bananas, mashed
0.3333333333|cup|Honey or maple syrup
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
1|cup|Greek yogurt
0.5|cup|Chopped walnuts
`,
  "PM-008": `
1|cup|Rolled oats
1|cup|Vanilla protein powder
1|tsp|Baking powder
1|tsp|Baking soda
0.25|tsp|Salt
0.5|cup|Unsweetened applesauce
0.3333333333|cup|Honey or maple syrup
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
1|cup|Greek yogurt
1|cup|Fresh or frozen raspberries
`,
  "PM-009": `
1|cup|Rolled oats
1|cup|Vanilla protein powder
1|tsp|Baking powder
1|tsp|Baking soda
0.25|tsp|Salt
1|tsp|Ground cinnamon
0.25|tsp|Ground nutmeg
0.5|cup|Unsweetened applesauce
0.3333333333|cup|Honey or maple syrup
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
1|zest of 1 orange|Orange zest
0.25|cup|Fresh orange juice
0.75|cup|Dried cranberries or fresh cranberries
`,
  "PM-010": `
1|cup|Rolled oats
1|cup|Vanilla protein powder
1|tsp|Baking powder
1|tsp|Baking soda
1|tsp|Ground cinnamon
0.25|tsp|Salt
0.5|cup|Unsweetened applesauce
0.3333333333|cup|Maple syrup or honey
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
0.25|cup|Plain Greek yogurt
0.3333333333|cup, optional|Mini chocolate chips
`,
  "PM-011": `
1|cup|Rolled oats
1|cup|Vanilla protein powder
1|tsp|Baking powder
1|tsp|Baking soda
0.25|tsp|Salt
0.5|cup|Unsweetened applesauce
0.3333333333|cup|Maple syrup or honey
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
0.5|cup|Plain or vanilla Greek yogurt
0.5|cup|Diced fresh strawberries
0.25|cup, optional|White chocolate chips
2|oz|Cream cheese, softened and cut into small cubes
`,
  "PM-012": `
1|cup|Old-fashioned oats
1|cup|Vanilla protein powder
1|tsp|Baking powder
1|tsp|Baking soda
0.5|tsp|Salt
1|tsp|Ground cinnamon
0.25|tsp|Ground nutmeg
0.5|cup|Unsweetened applesauce
0.3333333333|cup, packed|Brown sugar
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
0.5|cup|Plain or vanilla Greek yogurt
0.25|cup|Milk of choice
`,
  "PM-013": `
1|cup|Rolled oats
1|cup|Vanilla protein powder
1|tsp|Baking powder
1|tsp|Baking soda
1|tsp|Ground cinnamon
0.25|tsp|Salt
0.5|cup|Unsweetened applesauce
0.3333333333|cup|Maple syrup or honey
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
0.5|cup|Plain Greek yogurt
1|cup|Finely diced apple
0.25|cup|Streusel topping
`,
  "PM-014": `
1|cup|Rolled oats
1|cup|Vanilla protein powder
1|tsp|Baking powder
1|tsp|Baking soda
1.5|tsp|Ground cinnamon
0.25|tsp|Ground nutmeg
0.25|tsp|Salt
0.5|cup|Unsweetened applesauce
0.3333333333|cup|Maple syrup or honey
0.25|cup|Melted coconut oil or butter
2|each|Large eggs
1|tsp|Vanilla extract
0.5|cup|Plain Greek yogurt
1|cup|Finely shredded carrots
0.25|cup|Chopped walnuts
2|tbsp, optional|Raisins
`,
  "QP-001": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
0.125|tsp|Onion powder
1|cup|Shredded reduced-fat sharp cheddar cheese
0.5|cup|Shredded reduced-fat Swiss cheese
1|tbsp, optional|Chopped chives
1|pinch|Paprika
`,
  "QP-002": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Nutmeg
6|slices, cooked and crumbled|Bacon
0.25|cup|Finely chopped onion
1|cup|Shredded reduced-fat Swiss cheese
0.125|tsp|Onion powder
0.125|tsp|Garlic powder
1|pinch|Paprika
1|tbsp, optional|Chopped chives
`,
  "QP-003": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
1|cup|Diced cooked ham
1|cup|Shredded reduced-fat cheddar cheese
0.5|cup|Shredded reduced-fat Swiss cheese
1|tbsp, optional|Chopped chives
1|pinch|Paprika
`,
  "QP-004": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
1|cup, squeezed dry|Chopped fresh spinach
1|cup|Shredded reduced-fat Swiss cheese
0.25|cup|Chopped onion
0.25|cup|Diced red bell pepper
1|tbsp, optional|Chopped chives
1|pinch|Paprika
`,
  "QP-005": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
1|cup, steamed and well drained|Chopped broccoli
1|cup|Shredded reduced-fat cheddar cheese
0.25|cup|Chopped onion
1|tbsp, optional|Chopped chives
1|pinch|Paprika
`,
  "QP-006": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
1|cup, drained|Cooked ground breakfast sausage
0.5|cup|Diced bell pepper
0.25|cup|Diced onion
0.5|cup|Shredded cheddar cheese
0.25|cup|Shredded Monterey Jack cheese
1|pinch|Paprika
`,
  "QP-007": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
1|cup|Shredded sharp cheddar cheese
6|slices, cooked and crumbled|Bacon
0.25|cup|Chopped onion
1|tbsp, optional|Chopped chives
1|pinch|Paprika
`,
  "QP-008": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
0.5|cup|Diced ham
0.25|cup|Diced green bell pepper
0.25|cup|Diced red bell pepper
0.25|cup|Diced onion
0.5|cup|Shredded cheddar cheese
1|tbsp, optional|Chopped chives
1|pinch|Paprika
`,
  "QP-009": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
0.5|cup|Diced cooked ham
0.25|cup|Chopped onion
1|tbsp, optional|Chopped chives
1|cup|Shredded Swiss cheese
1|pinch|Paprika
`,
  "QP-010": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
0.5|cup, crumbled|Cooked breakfast sausage
0.25|cup|Chopped onion
1|cup|Shredded cheddar cheese
1|tbsp, optional|Chopped chives
1|pinch|Paprika
`,
  "QP-011": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
6|oz, drained and picked over|Lump crab meat
0.25|cup|Diced red bell pepper
0.25|cup|Chopped onion
0.25|cup|Shredded Monterey Jack cheese
1|tbsp, optional|Chopped chives
1|pinch|Paprika
`,
  "QP-012": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
0.5|lb, cooked and drained|Ground beef
0.25|cup|Diced onion
0.25|cup|Diced tomato
0.25|cup|Diced bell pepper
1|cup|Shredded cheddar cheese
1|tbsp, optional|Chopped chives
1|pinch|Paprika
`,
  "QP-013": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
1|cup, drained|Diced tomatoes
0.25|cup|Chopped onion
0.25|cup|Shredded mozzarella cheese
0.25|cup|Shredded Parmesan cheese
0.25|cup, or 1 tbsp dried|Chopped fresh basil
1|pinch|Paprika
`,
  "QP-014": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
1|pinch, optional|Ground nutmeg
2|each, thinly sliced|Large onions
1|tbsp|Olive oil
1|tbsp|Unsalted butter
1|cup|Shredded Gruyère or Swiss cheese
1|tbsp, optional|Chopped chives
1|pinch|Paprika
`,
  "QP-015": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
1|pinch, optional|Cayenne pepper
1|cup, drained|Cooked crawfish tails
0.25|cup|Diced red bell pepper
0.25|cup|Diced green bell pepper
0.25|cup|Chopped onion
0.5|cup|Shredded Swiss cheese
1|tbsp, optional|Chopped chives
1|pinch|Paprika
`,
  "QP-016": `
4|5-inch shells, baked|Mini pie shells
4|each|Large eggs
1|cup|2% milk
0.5|cup|Heavy cream
0.25|tsp|Salt
0.25|tsp|Black pepper
0.125|tsp|Garlic powder
0.5|lb, cooked and drained|Ground beef
0.25|cup|Diced onion
0.25|cup|Diced dill pickles
0.25|cup|Diced tomato
1|cup|Shredded cheddar cheese
1|tbsp|Ketchup
1|tbsp|Yellow mustard
1|tbsp, optional|Chopped chives
1|pinch|Paprika
`,
  "QP-017": `
4|5-inch shells, baked|Mini pie shells
2|cups, diced or shredded|Cooked chicken
0.5|cup|Frozen peas
0.5|cup|Diced carrots
0.25|cup|Diced celery
0.25|cup|Diced onion
0.25|cup|Unsalted butter
0.25|cup|All-purpose flour
1|cup|Chicken broth
0.5|cup|2% milk
0.5|cup|Heavy cream
0.5|tsp|Salt
0.25|tsp|Black pepper
0.25|tsp|Garlic powder
0.5|tsp|Dried thyme
1|tbsp, optional|Chopped parsley
1|pinch|Paprika
`,
  "QP-018": `
4|5-inch shells, baked|Mini pie shells
1|lb|Ground beef
0.5|cup|Diced onion
0.5|cup|Diced carrots
0.5|cup|Green peas, frozen or fresh
0.25|cup|Unsalted butter
0.25|cup|All-purpose flour
1|cup|Beef broth
0.5|cup|2% milk
0.5|cup|Heavy cream
0.5|tsp|Salt
0.25|tsp|Black pepper
0.25|tsp|Garlic powder
0.5|tsp|Dried thyme
1|tbsp|Worcestershire sauce
1|pinch|Paprika
`,
  "QP-019": `
4|5-inch shells, baked|Mini pie shells
1|21 oz can|Lucky Leaf Premium Apple Pie Filling
0.5|tsp|Ground cinnamon
0.125|tsp|Ground nutmeg
0.5|tsp|Lemon juice
1|tbsp|All-purpose flour
2|tbsp|Brown sugar
0.5|tsp|Vanilla extract
1|tbsp|Unsalted butter, cut into small pieces
0.5|cup|Crumb topping
1|pinch|Salt
`,
  "QP-020": `
4|5-inch shells, baked|Mini pie shells
1|21 oz can|Lucky Leaf Premium Cherry Pie Filling
1|tbsp|Cornstarch
1|tbsp|Lemon juice
0.5|tsp|Vanilla extract
0.25|tsp, optional|Almond extract
1|tbsp|Unsalted butter, cut into small pieces
0.5|cup|Crumb topping
1|tbsp, optional|Coarse sugar
1|pinch|Salt
`,
  "QP-021": `
4|5-inch shells, baked|Mini pie shells
1|21 oz can|Lucky Leaf Premium Peach Pie Filling
1|tbsp|Cornstarch
1|tbsp|Lemon juice
0.5|tsp|Vanilla extract
0.25|tsp|Ground cinnamon
1|tbsp|Unsalted butter, cut into small pieces
0.5|cup|Crumb topping
1|tbsp, optional|Coarse sugar
1|pinch|Salt
`,
  "QP-022": `
4|5-inch shells, baked|Mini pie shells
1|21 oz can|Lucky Leaf Premium Blueberry Pie Filling
1|tbsp|Cornstarch
1|tbsp|Lemon juice
0.5|tsp|Vanilla extract
0.25|tsp, optional|Almond extract
1|tbsp|Unsalted butter, cut into small pieces
0.5|cup|Crumb topping
1|tbsp, optional|Coarse sugar
1|pinch|Salt
`,
  "QP-023": `
4|5-inch shells, baked|Mini pie shells
1|21 oz can|Lucky Leaf Premium Blackberry Pie Filling
1|tbsp|Cornstarch
1|tbsp|Lemon juice
0.5|tsp|Vanilla extract
0.25|tsp, optional|Almond extract
1|tbsp|Unsalted butter, cut into small pieces
0.5|cup|Crumb topping
1|tbsp, optional|Coarse sugar
1|pinch|Salt
`,
  "QP-024": `
4|5-inch shells, baked|Mini pie shells
1|21 oz can|Lucky Leaf Premium Strawberry Rhubarb Pie Filling
1|tbsp|Cornstarch
1|tbsp|Lemon juice
0.5|tsp|Vanilla extract
0.25|tsp, optional|Almond extract
1|tbsp|Unsalted butter, cut into small pieces
0.5|cup|Crumb topping
1|tbsp, optional|Coarse sugar
1|pinch|Salt
`,
  "QP-025": `
4|5-inch shells, baked|Mini pie shells
1|cup|Light corn syrup
0.5|cup, packed|Brown sugar
2|each|Large eggs
2|tbsp, melted|Unsalted butter
1|tsp|Vanilla extract
0.25|tsp|Salt
1.5|cups, halves or pieces|Pecans
1|tbsp, optional|All-purpose flour
`,
  "QP-026": `
4|5-inch shells, baked|Mini pie shells
0.5|cup|Sugar
0.25|cup|All-purpose flour
0.25|tsp|Salt
3|each|Large eggs
1|14 oz can|Sweetened condensed milk
1|cup|Whole milk
1|tsp|Vanilla extract
1|tsp, optional|Coconut extract
1|cup, divided|Sweetened shredded coconut
1|tbsp, melted and optional|Unsalted butter
`,
  "QP-027": `
1|9-inch crust|Oreo cookie crust or homemade crust
1|3.4 oz package|Instant chocolate pudding mix
1|cup|Cold milk
8|oz, softened|Cream cheese
1|cup|Powdered sugar
1|tsp|Vanilla extract
1|8 oz container, thawed and divided|Frozen whipped topping
0.5|cup, melted and cooled|Semi-sweet chocolate chips
1|amount not specified, optional for garnish|Chocolate shavings or curls
`,
  "QP-028": `
1|9-inch crust|Graham cracker pie crust, store-bought
1|3 oz package|Pink lemonade drink mix
8|oz, softened|Cream cheese
1|cup|Powdered sugar
1|cup|Cold milk
1|tsp|Vanilla extract
1|8 oz container, thawed and divided|Frozen whipped topping
1|amount not specified, optional|Pink food coloring
1|amount not specified, optional for garnish|Lemon slices or zest
`,
  "QP-029": `
1|9-inch crust|Graham cracker pie crust, store-bought
1|14 oz can|Sweetened condensed milk
0.5|cup, about 6-8 key limes|Key lime juice
1|tsp|Key lime zest
0.5|cup|Sour cream
0.5|tsp|Vanilla extract
1|8 oz container, thawed and divided|Frozen whipped topping
1|amount not specified, optional for garnish|Additional key lime zest or lime slices
`,
  "QP-030": `
1|9-inch crust|Graham cracker pie crust, store-bought
1|3 oz package|Strawberry Jell-O gelatin
1|14 oz can|Sweetened condensed milk
1|cup|Cold milk
1|8 oz container, thawed and divided|Frozen whipped topping
1|tsp|Vanilla extract
1|cup, optional for garnish|Fresh strawberries, hulled and sliced
1|amount not specified, optional for garnish|Strawberry slices
`,
  "SB-001": `
2|tbsp|Sesame ginger dressing
1|tbsp|Rice vinegar
0.5|cup|Shredded carrots
0.5|cup|Shelled edamame
0.5|cup|Diced cucumber
0.5|cup|Cooked shredded chicken
1|cup|Shredded napa cabbage
1|cup|Chopped romaine
0.25|cup|Shredded red cabbage
2|tbsp|Sliced green onions
2|tbsp|Crispy wonton strips
1|tbsp|Sliced almonds
`,
  "SB-002": `
2|tbsp|Ranch dressing
1|tbsp|Mayonnaise
0.5|cup|Halved cherry tomatoes
0.5|cup|Diced cucumber
0.5|cup|Cooked chopped chicken
2|slices, cooked and crumbled|Bacon
1|cup|Chopped romaine
1|cup|Chopped iceberg lettuce
0.25|cup|Shredded cheddar cheese
2|tbsp|Sliced green onions
1|tbsp|Sunflower seeds
0.25|cup|Croutons
`,
  "SB-003": `
2|tbsp|Ranch dressing
1|tbsp|Buffalo sauce
0.5|cup|Diced celery
0.5|cup|Shredded carrots
0.5|cup|Cooked chopped chicken
0.25|cup|Buffalo chicken pieces
1|cup|Chopped romaine
1|cup|Chopped iceberg lettuce
0.25|cup|Shredded cheddar cheese
2|tbsp|Sliced green onions
2|tbsp|Blue cheese crumbles
0.25|cup|Tortilla strips
`,
  "SB-004": `
2|tbsp|Burger sauce
0.25|cup|Diced pickles
0.5|cup|Halved cherry tomatoes
0.5|cup|Cooked lean ground beef
0.25|cup|Shredded cheddar cheese
1.5|cups|Chopped romaine
0.25|cup|Chopped iceberg lettuce
2|tbsp|Sliced red onion
1|tbsp|Crumbled cooked bacon
0.25|cup|Bun croutons
`,
  "SB-005": `
2|tbsp|Light ranch dressing
1|tbsp|Plain Greek yogurt
0.5|cup|Diced cucumber
0.5|cup|Halved cherry tomatoes
0.5|cup|Cooked chopped chicken breast
2|slices, chopped|Deli turkey
2|oz, chopped|Deli ham
1|each, chopped|Hard-boiled egg
0.25|cup|Shredded cheddar cheese
1|cup|Chopped romaine
0.5|cup|Chopped iceberg lettuce
2|tbsp|Sliced red onion
`,
  "SB-006": `
2|tbsp|Light Caesar dressing
1|tbsp|Plain Greek yogurt
0.5|cup|Diced cucumber
0.5|cup|Cooked chopped chicken breast
1|each, chopped|Hard-boiled egg
1|tbsp|Lemon juice
0.25|cup|Caesar croutons
2|tbsp|Shredded Parmesan cheese
1|cup|Chopped romaine
0.5|cup|Chopped iceberg lettuce
2|tbsp|Sliced red onion
1|pinch|Black pepper
`,
  "SB-007": `
2|tbsp|Light ranch dressing
1|tbsp|Plain Greek yogurt
0.5|cup|Diced cucumber
0.5|cup|Halved cherry tomatoes
0.5|cup|Cooked chopped chicken breast
1|each, chopped|Hard-boiled egg
2|slices, cooked and crumbled|Bacon
2|tbsp|Blue cheese crumbles
0.25|cup|Diced avocado
1|cup|Chopped romaine
0.5|cup|Chopped iceberg lettuce
1|tbsp|Lemon juice
`,
  "SB-008": `
2|tbsp|Light ranch dressing
1|tbsp|Plain Greek yogurt
0.5|cup|Diced celery
0.5|cup|Diced cucumber
0.5|cup|Cooked chopped chicken breast
0.5|cup|Halved cherry tomatoes
1|each, chopped|Hard-boiled egg
0.25|cup|Shredded cheddar cheese
1|cup|Chopped romaine
0.5|cup|Chopped iceberg lettuce
2|tbsp|Sliced green onion
1|tsp|Dijon mustard
`,
  "SB-009": `
2|tbsp|Ranch dressing
1|cup, chopped|Romaine lettuce
0.5|cup, diced|Cucumber
0.5|cup, halved|Cherry tomatoes
0.25|cup|Shredded carrots
0.5|cup|Cottage cheese
1|each, chopped|Hard-boiled egg
2|tbsp|Shredded cheddar cheese
1|tbsp|Sunflower seeds or chopped almonds
1|pinch|Salt
1|pinch|Black pepper
0.5|cup, optional|Diced ham, bacon, or pre-cooked chicken or turkey
`,
  "SB-010": `
2|tbsp|Light ranch dressing
1|tbsp|Plain Greek yogurt
0.5|cup|Diced cucumber
0.5|cup|Halved cherry tomatoes
0.5|cup|Lump crab meat
1|each, chopped|Hard-boiled egg
2|tbsp|Shredded cheddar cheese
1|cup|Chopped romaine
0.5|cup|Chopped iceberg lettuce
2|tbsp|Sliced green onion
1|tsp|Lemon juice
0.25|tsp|Old Bay seasoning
`,
  "SB-011": `
2|each, chopped|Large hard-boiled eggs
0.25|cup|Low-fat cottage cheese
1|tbsp|Mayonnaise or light mayonnaise
1|tsp|Dijon mustard
1|tsp|Lemon juice
0.25|tsp|Garlic powder
1|to taste|Salt
1|to taste|Black pepper
2|cups|Chopped romaine lettuce
0.5|cup|Diced cucumber
0.5|cup, halved|Cherry tomatoes
0.25|cup|Diced red onion
1|tbsp|Chopped chives
1|amount not specified, optional|Sliced radishes
1|amount not specified, optional|Shredded carrots
1|amount not specified, optional|Sunflower seeds
`,
  "SB-012": `
2|tbsp|Light Greek dressing
1|tbsp|Plain Greek yogurt
0.5|cup|Diced cucumber
0.5|cup|Halved cherry tomatoes
0.5|cup|Cooked chopped chicken breast
1|tbsp|Lemon juice
2|tbsp|Crumbled feta cheese
1|cup|Chopped romaine
0.5|cup|Chopped iceberg lettuce
2|tbsp|Sliced red onion
2|tbsp|Sliced black olives
0.5|tsp|Dried oregano
`,
  "SB-013": `
2|tbsp|Italian dressing
1.5|cups|Mixed greens
0.25|cup, cooked and cooled|Rotini pasta
0.25|cup, diced|Cucumber
0.5|cup, halved|Cherry tomatoes
0.5|cup|Cooked chicken
2|tbsp|Sliced black olives
2|tbsp|Diced red onion
2|tbsp, sliced|Roasted red peppers
2|tbsp|Shredded mozzarella cheese
1|tbsp|Grated Parmesan cheese
`,
  "SB-014": `
2|tbsp|Light Greek dressing
1|tbsp|Plain Greek yogurt
0.5|cup|Diced cucumber
0.5|cup|Halved cherry tomatoes
0.5|cup|Chickpeas
1|tbsp|Lemon juice
2|tbsp|Crumbled feta cheese
1|cup|Chopped romaine
0.5|cup|Chopped iceberg lettuce
2|tbsp|Sliced red onion
2|tbsp|Sliced black olives
0.25|tsp|Dried oregano
`,
  "SB-015": `
2|tbsp|Greek yogurt
1|tbsp|Mayonnaise or light mayonnaise
1|tsp|Dijon mustard
0.5|tsp|Lemon juice
0.25|tsp|Garlic powder
1|to taste|Salt
1|to taste|Black pepper
2|cups|Chopped romaine lettuce
0.5|cup, halved|Cherry tomatoes
0.5|cup, rinsed and drained|Chickpeas
0.5|cup|Pimento chicken salad
2|tbsp|Chopped green onions
1|tbsp|Shredded cheddar cheese
1|amount not specified, optional|Sliced olives
1|amount not specified, optional|Pickled red onion
1|amount not specified, optional|Avocado
`,
  "SB-016": `
2|tbsp|Light dill dressing
1|tbsp|Plain Greek yogurt
0.5|cup|Diced cucumber
0.5|cup|Halved cherry tomatoes
0.5|cup, flaked|Cooked salmon
1|each, chopped|Hard-boiled egg
1|tbsp|Lemon juice
1|cup|Chopped romaine
0.5|cup|Chopped iceberg lettuce
2|tbsp|Sliced red onion
1|tbsp, drained|Capers
0.5|tsp|Dried dill
`,
  "SB-017": `
2|tbsp|Light ranch dressing
1|tbsp|Plain Greek yogurt
0.5|cup|Diced cucumber
0.5|cup|Halved cherry tomatoes
0.5|cup, chopped|Cooked shrimp
1|each, chopped|Hard-boiled egg
1|slice, cooked and crumbled|Bacon
1|tbsp|Blue cheese crumbles
0.25|cup|Diced avocado
1|cup|Chopped romaine
0.5|cup|Chopped iceberg lettuce
1|tsp|Lemon juice
`,
  "SB-018": `
2|tbsp|Light ranch dressing
1|tbsp|Plain Greek yogurt
0.5|cup|Diced cucumber
0.5|cup|Halved cherry tomatoes
0.5|cup, drained|Tuna
1|each, chopped|Hard-boiled egg
1|tbsp|Lemon juice
1|cup|Chopped romaine
0.5|cup|Chopped iceberg lettuce
2|tbsp|Sliced green onion
1|tsp|Dijon mustard
0.25|tsp|Dried dill
`,
  "SB-019": `
2|cups|Shredded iceberg lettuce
3|slices, chopped|Provolone cheese
3|slices, chopped|Ham
3|slices, chopped|Salami
3|slices, chopped|Capicola
0.25|cup, halved|Cherry tomatoes
2|tbsp, diced|Red onion
2|tbsp, sliced|Banana peppers or pepperoncini
1|tbsp|Olive oil
1|tbsp|Red wine vinegar
1|tsp|Dried oregano
0.25|tsp|Garlic powder
1|to taste|Salt
1|to taste|Black pepper
1|amount not specified, optional|Cucumbers
1|amount not specified, optional|Shredded carrots
1|amount not specified, optional|Black olives
1|amount not specified, optional|Jalapeños
`,
  "SB-020": `
2|cups, shredded|Green cabbage
1.5|cups, chopped|Green leaf lettuce
1|cup, finely chopped|Kale
0.5|cup, shredded|Red cabbage
0.5|cup, shredded|Carrots
2|tbsp, sliced|Green onions
1|amount not specified, optional|Roasted sunflower seeds
1|amount not specified, optional|Real bacon bits
1|amount not specified, optional|Shredded cheese
1|amount not specified, optional|Crispy onions
1|amount not specified, optional|Dried cranberries
1|amount not specified, stored separately|Favorite dressing
`,
});
