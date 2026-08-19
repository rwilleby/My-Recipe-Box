function aisleFor(name, unit = "") {
  const value = `${name} ${unit}`.toLowerCase();
  if (/bacon|sausage|boudin|ham|chicken nugget/.test(value)) return "Meat & Seafood";
  if (/butter|milk|egg|cheese|cheddar|swiss|mozzarella|parmesan/.test(value)) return "Dairy";
  if (/blackberr|blueberr|strawberr|raspberr|peach|grape|pineapple|tomato|onion|jalape|garlic|mint|green onion|parsley|lime|lemon/.test(value)) return "Produce";
  if (/flour|sugar|splenda|sweetener|pectin|fiber powder|yeast|salt|cinnamon|chili powder|paprika|baking soda/.test(value)) return "Baking & Spices";
  if (/vinegar|maple syrup|honey|bourbon|coffee|juice concentrate/.test(value)) return "Condiments & Beverages";
  if (/crescent roll dough/.test(value)) return "Refrigerated Dough";
  if (/rice/.test(value)) return "Rice & Dry Goods";
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

export const PRESERVES_BREAD_INGREDIENTS_V8413 = {
  ...cards({
    "JJ-001": `
8|cups|Fresh blackberries
5|cups|Granulated sugar
0.25|cup|Lemon juice
1|1.75 oz box|Fruit pectin
0.5|tsp, optional|Butter
`,
    "JJ-002": `
3|cups|Blackberries
0.3333333333|cup|Granulated sugar or monk fruit blend
2|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
0.25|tsp, optional for foam|Butter
`,
    "JJ-003": `
3|cups|Blueberries
0.3333333333|cup|Granulated sugar or monk fruit blend
2|tbsp|Lemon juice
1|tsp, optional|Lemon zest
2|tbsp|Low/no-sugar pectin
0.25|tsp, optional for foam|Butter
`,
    "JJ-004": `
3|cups|Peaches, peeled and finely diced
0.3333333333|cup|Granulated sugar or monk fruit blend
2|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
0.25|tsp, optional|Cinnamon
0.25|tsp, optional for foam|Butter
`,
    "JJ-005": `
3|cups|Strawberries, crushed or finely chopped
0.3333333333|cup|Granulated sugar or monk fruit blend
2|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
0.25|tsp, optional for foam|Butter
`,
    "JJ-006": `
12|oz|Thick-cut bacon, diced
1|cup|Yellow onion, finely diced
0.25|cup|Jalapeño, finely minced
2|tsp|Minced garlic
0.25|cup|Light brown sugar
0.25|cup|Apple cider vinegar
2|tbsp|Maple syrup
0.25|tsp|Chili powder
0.25|tsp|Kosher salt
`,
    "JJ-007": `
12|oz|Thick-cut bacon, diced
1|cup|Yellow onion, finely diced
0.25|cup|Jalapeño, finely minced
2|tsp|Fresh mint, finely chopped
2|tsp|Minced garlic
0.25|cup|Light brown sugar
0.25|cup|Apple cider vinegar
2|tbsp|Maple syrup
1|tbsp|Lime juice
0.25|tsp|Chili powder
0.25|tsp|Kosher salt
`,
    "JJ-008": `
12|oz|Thick-cut bacon, diced
1|cup|Yellow onion, finely diced
2|tsp|Minced garlic
0.25|cup|Maple syrup
0.25|cup|Light brown sugar
0.25|cup|Brewed coffee
2|tbsp|Bourbon
0.25|cup|Apple cider vinegar
0.25|tsp|Kosher salt
`,
    "JJ-009": `
3|cups|Peaches, finely diced
0.25|cup|Jalapeño, finely minced
1|cup|Granulated sugar
2|tbsp|Lemon juice
2|tbsp|Apple cider vinegar
2|tbsp|Water
0.25|tsp|Kosher salt
0.5|tsp, optional for foam|Butter
`,
    "JJ-010": `
0.6666666667|lb|Thick-cut bacon, diced
1|cup|Yellow onion, finely diced
2|cups|Fresh pineapple, finely diced
1.5|tsp|Minced garlic
0.3333333333|cup|Light brown sugar
2|tbsp|Apple cider vinegar
2|tbsp|Maple syrup
0.6666666667|tsp|Chili powder
0.25|tsp|Kosher salt
0.25|tsp, optional|Red pepper flakes
`,
    "JJ-011": `
3|cups|Pineapple, finely diced
0.25|cup|Jalapeño, finely minced
1|cup|Granulated sugar
2|tbsp|Lime juice
2|tbsp|Apple cider vinegar
2|tbsp|Water
0.25|tsp|Kosher salt
0.5|tsp, optional for foam|Butter
`,
    "JJ-012": `
3|cups|Strawberries, finely chopped
2|tbsp|Jalapeño, finely minced
1|cup|Granulated sugar
2|tbsp|Lemon juice
2|tbsp|Water
0.25|tsp|Kosher salt
0.5|tsp, optional for foam|Butter
`,
    "JJ-013": `
12|oz|Thick-cut bacon, diced
2|cups|Tomatoes, finely diced
1|cup|Yellow onion, finely diced
2|tsp|Minced garlic
0.25|cup|Light brown sugar
0.25|cup|Apple cider vinegar
2|tbsp|Brewed coffee
0.25|tsp|Smoked paprika
0.25|tsp|Kosher salt
`,
    "JJ-014": `
3|cups|Strawberries, finely chopped
0.5|cup|Granulated Splenda or equivalent sucralose sweetener
2|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
1|tbsp, optional for Polaner-style texture|Soluble fiber powder
0.25|tsp, optional for foam|Butter
`,
    "JJ-015": `
3|cups|Seedless grapes, halved and lightly crushed
0.5|cup|Granulated Splenda or equivalent sucralose sweetener
1|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
1|tbsp, optional for Polaner-style texture|Soluble fiber powder
0.25|tsp, optional for foam|Butter
`,
    "JJ-016": `
3|cups|Raspberries
0.5|cup|Granulated Splenda or equivalent sucralose sweetener
2|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
1|tbsp, optional for Polaner-style texture|Soluble fiber powder
0.25|tsp, optional for foam|Butter
`,
    "JJ-017": `
3|cups|Blackberries
0.5|cup|Granulated Splenda or equivalent sucralose sweetener
2|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
1|tbsp, optional for Polaner-style texture|Soluble fiber powder
0.25|tsp, optional for foam|Butter
`,
    "JJ-018": `
3|cups|Blueberries
0.5|cup|Granulated Splenda or equivalent sucralose sweetener
2|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
1|tbsp, optional for Polaner-style texture|Soluble fiber powder
0.25|tsp, optional for foam|Butter
`,
    "JJ-019": `
3|cups|Peaches, peeled and finely diced
0.5|cup|Granulated Splenda or equivalent sucralose sweetener
2|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
1|tbsp, optional for Polaner-style texture|Soluble fiber powder
0.25|tsp, optional for foam|Butter
`,
    "JJ-020": `
3|cups|Strawberries, finely chopped
0.5|cup|Thawed white grape juice concentrate
2|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
1|tbsp, optional for Polaner-style texture|Soluble fiber powder
0.25|tsp, optional for foam|Butter
`,
    "JJ-021": `
3|cups|Seedless grapes, halved and lightly crushed
0.3333333333|cup|Thawed white grape juice concentrate
1|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
1|tbsp, optional for Polaner-style texture|Soluble fiber powder
0.25|tsp, optional for foam|Butter
`,
    "JJ-022": `
3|cups|Raspberries
0.5|cup|Thawed white grape juice concentrate
2|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
1|tbsp, optional for Polaner-style texture|Soluble fiber powder
0.25|tsp, optional for foam|Butter
`,
    "JJ-023": `
3|cups|Blackberries
0.5|cup|Thawed white grape juice concentrate
2|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
1|tbsp, optional for Polaner-style texture|Soluble fiber powder
0.25|tsp, optional for foam|Butter
`,
    "JJ-024": `
3|cups|Blueberries
0.5|cup|Thawed white grape juice concentrate
2|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
1|tbsp, optional for Polaner-style texture|Soluble fiber powder
0.25|tsp, optional for foam|Butter
`,
    "JJ-025": `
3|cups|Peaches, peeled and finely diced
0.5|cup|Thawed white grape juice concentrate
2|tbsp|Lemon juice
2|tbsp|Low/no-sugar pectin
1|tbsp, optional for Polaner-style texture|Soluble fiber powder
0.25|tsp, optional for foam|Butter
`,

    "KR-001": `
2|8 oz cans|Refrigerated crescent roll dough
1|tbsp for rolling|All-purpose flour
0.5|lb|Breakfast sausage
0.5|cup|Shredded cheddar cheese
`,
    "KR-002": `
2|8 oz cans|Refrigerated crescent roll dough
1|tbsp for rolling|All-purpose flour
1|cup|Diced cooked ham
1|cup|Shredded Swiss cheese
`,
    "KR-003": `
2|8 oz cans|Refrigerated crescent roll dough
1|tbsp for rolling|All-purpose flour
6|slices|Bacon, cooked crisp and crumbled
6|each|Large eggs
0.25|cup|Milk
0.5|cup|Shredded cheddar cheese
1|to taste|Salt
1|to taste|Black pepper
`,
    "KR-004": `
2|8 oz cans|Refrigerated crescent roll dough
1|tbsp for rolling|All-purpose flour
0.5|lb|Breakfast sausage
6|each|Large eggs
0.25|cup|Milk
0.5|cup|Shredded cheddar cheese
1|to taste|Salt
1|to taste|Black pepper
`,
    "KR-005": `
2|8 oz cans|Refrigerated crescent roll dough
1|tbsp for rolling|All-purpose flour
1|lb|Boudin, casing removed
0.5|cup|Cooked rice
0.25|cup|Chopped green onions
0.25|cup|Shredded cheddar cheese
`,
    "KR-006": `
2|8 oz cans|Refrigerated crescent roll dough
1|tbsp for rolling|All-purpose flour
1|12-15 count range|Frozen chicken nuggets, fully cooked
0.25|cup, optional|Honey mustard or favorite sauce
`,
    "KR-007": `
2|8 oz cans|Refrigerated crescent roll dough
1|tbsp for rolling|All-purpose flour
12|each|Mini smoked sausages (cocktail wieners)
`,

    "LF-001": `
6|cups (720g), plus more for dusting|All-purpose flour
2.25|tsp (1 packet)|Active dry yeast
0.25|cup (50g)|Granulated sugar
2|tsp|Salt
2|cups (480ml)|Warm water (105-110°F)
0.25|cup (60ml)|Unsalted butter, softened
`,
    "LF-002": `
3.5|cups (420g)|All-purpose flour
2|cups (240g)|Whole wheat flour
2.25|tsp (1 packet)|Active dry yeast
0.25|cup (50g)|Honey
2|tsp|Salt
2.5|cups (600ml)|Warm water (105-110°F)
0.25|cup (60ml)|Unsalted butter, softened
`,
    "LF-003": `
3.5|cups (420g)|All-purpose flour
2.25|tsp (1 packet)|Active dry yeast
0.5|cup (100g)|Granulated sugar
2|tsp|Salt
1.25|cups (300ml)|Buttermilk, room temperature
0.25|cup (60ml)|Unsalted butter, softened
`,
    "LF-004": `
2.5|cups (300g)|Whole wheat flour
2.5|cups (300g)|All-purpose flour
2.25|tsp (1 packet)|Active dry yeast
0.25|cup (60g)|Honey or brown sugar
2|tsp|Salt
2.25|cups (540ml)|Warm water (105-110°F)
0.25|cup (60ml)|Unsalted butter, softened
`,
    "LF-005": `
3.5|cups (420g)|All-purpose flour
2.25|tsp (1 packet)|Active dry yeast
0.25|cup (50g)|Granulated sugar
2|tsp|Salt
1.5|cups (360ml)|Warm water (105-110°F)
0.25|cup (60ml)|Unsalted butter, softened
1.5|cups (170g)|Shredded sharp cheddar cheese
`,
    "LF-006": `
3.5|cups (420g)|All-purpose flour
2.25|tsp (1 packet)|Active dry yeast
0.25|cup (50g)|Granulated sugar
2|tsp|Salt
1.5|cups (360ml)|Warm water (105-110°F)
0.25|cup (60ml)|Unsalted butter, softened
1|cup (113g)|Shredded sharp cheddar cheese
1|2-3 count range, seeded and finely diced or to taste|Jalapeños
`,
    "LF-007": `
3.5|cups (420g)|All-purpose flour
2.25|tsp (1 packet)|Active dry yeast
1.5|tsp|Salt
1|tbsp|Granulated sugar
1.5|cups (360ml)|Warm water (105-110°F)
2|tbsp|Olive oil
2|tsp|Italian seasoning
2|cloves, minced or 1 tsp garlic powder|Garlic
0.25|cup (25g)|Grated Parmesan cheese
`,
    "LF-008": `
3.5|cups (420g)|All-purpose flour
2.25|tsp (1 packet)|Active dry yeast
1|tbsp|Granulated sugar
1.5|tsp|Salt
1.5|cups (360ml)|Warm water (105-110°F)
2|tbsp|Olive oil
1|cup (110g)|Finely chopped onions, sautéed until soft and cooled
1|cup (115g)|Sliced black olives, drained and chopped
1|tsp, optional|Dried minced onion
`,
    "LF-009": `
3.5|cups (420g)|All-purpose flour
2.25|tsp (1 packet)|Active dry yeast
1|tbsp|Granulated sugar
1.5|tsp|Salt
1.5|cups (360ml)|Warm water (105-110°F)
2|tbsp|Olive oil
3|tbsp|Unsalted butter, softened
4|cloves|Garlic, minced
0.5|cup (50g)|Grated Parmesan cheese
1|tsp|Italian seasoning
2|tbsp chopped fresh or 1 tsp dried|Parsley
`,
    "LF-010": `
3.5|cups (420g)|All-purpose flour
2.25|tsp (1 packet)|Active dry yeast
0.25|cup (50g)|Granulated sugar
1|tsp|Salt
0.5|cup (120ml)|Crushed pineapple, well drained
1.5|cups (360ml)|Warm water (105-110°F)
0.25|cup (60ml)|Unsalted butter, softened
1|each|Large egg
1|tsp|Vanilla extract
`,
    "LF-011": `
3.5|cups (420g)|All-purpose flour
2.25|tsp (1 packet)|Active dry yeast
1|tbsp|Granulated sugar
1.5|tsp|Salt
1.5|cups (360ml)|Warm water (105-110°F)
2|tbsp|Unsalted butter, softened
2|cups (240g), add as needed|Bread flour
6|cups|Water for boiling
0.25|cup|Baking soda
1|each|Egg yolk
1|tbsp for egg wash|Water
1|amount not specified|Coarse pretzel salt
`,
    "LF-012": `
3.5|cups (420g)|All-purpose flour
2.25|tsp (1 packet)|Active dry yeast
1|tbsp|Granulated sugar
1.5|tsp|Salt
1.5|cups (360ml)|Warm water (105-110°F)
2|tbsp|Unsalted butter, softened
0.25|cup (25g) for dough|Grated Parmesan cheese
4|cloves for dough|Garlic, minced
2|cups (240g), add as needed|Bread flour
0.25|cup (60g)|Unsalted butter, melted
2|cloves for topping|Garlic, minced
1|cup (100g)|Shredded mozzarella cheese
0.25|cup (25g) for topping|Grated Parmesan cheese
2|tbsp, optional|Chopped fresh parsley
`,
    "LF-013": `
3|cups (360g)|Bread flour or all-purpose flour
1.25|cups (300ml)|Water, room temperature
0.5|cup (120g)|Active sourdough starter, fed and bubbly
1.5|tsp|Salt
0.5|tsp, optional|Sugar
`,
    "LF-014": `
3|cups (360g)|Bread flour or all-purpose flour
1.25|cups (300ml)|Water, room temperature
0.5|cup (120g)|Active sourdough starter, fed and bubbly
1.5|tsp|Salt
0.5|tsp, optional|Sugar
`,
    "LF-015": `
3.5|cups (420g)|Bread flour or all-purpose flour
1.5|cups (360ml)|Water, room temperature
0.5|cup (120g)|Active sourdough starter, fed and bubbly
1.75|tsp|Salt
`,
  }),
  "LF-FZ1": [],
  "LF-FZ2": [],
};
