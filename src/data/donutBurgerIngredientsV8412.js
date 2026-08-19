function aisleFor(name, unit = "") {
  const value = `${name} ${unit}`.toLowerCase();
  if (/ground beef|bacon|meatball|chili sauce|chicken/.test(value)) return "Meat & Seafood";
  if (/milk|butter|egg|cheese|mozzarella|parmesan|provolone|swiss|cheddar|blue cheese|pimento|pepper jack|mac & cheese/.test(value)) return "Dairy";
  if (/lettuce|tomato|onion|arugula|avocado|jalape|parsley|apple|blueberr/.test(value)) return "Produce";
  if (/bun|bread|roll/.test(value)) return "Bread & Bakery";
  if (/flour|sugar|yeast|salt|pepper|baking|vanilla|cocoa|cinnamon|nutmeg|paprika/.test(value)) return "Baking & Spices";
  if (/oil/.test(value)) return "Oils & Vinegars";
  if (/pickle|mayo|mayonnaise|mustard|ketchup|relish|worcestershire|barbecue|marinara|steak sauce|lime juice|beef broth|pastry cream|pudding|jam|hazelnut spread/.test(value)) return "Condiments & Sauces";
  if (/hash brown|onion ring|fried onion/.test(value)) return "Frozen & Prepared Foods";
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

export const DONUT_BURGER_INGREDIENTS_V8412 = cards({
  "DN-001": `
4|cups|All-purpose flour
0.3333333333|cup|Granulated sugar
2.25|tsp (1 packet)|Active dry yeast
1|tsp|Salt
1.25|cups|Warm milk (110°F)
0.25|cup|Unsalted butter, melted
2|each|Large eggs
1|tsp|Vanilla extract
1|amount not specified|Vegetable oil for frying
2|cups|Powdered sugar
0.25|cup|Milk
1|tsp|Vanilla extract
1|pinch|Salt
`,
  "DN-002": `
2.5|cups|All-purpose flour
0.75|cup|Granulated sugar
2.5|tsp|Baking powder
0.5|tsp|Baking soda
0.5|tsp|Salt
1|tsp|Ground nutmeg
0.5|cup|Unsalted butter, softened
2|each|Large eggs
1|cup|Whole milk
2|tsp|Vanilla extract
2|cups|Powdered sugar
1|3-4 tbsp range|Milk
1|tsp|Vanilla extract
`,
  "DN-003": `
2|cups|All-purpose flour
0.75|cup|Granulated sugar
0.5|cup|Unsweetened cocoa powder
2|tsp|Baking powder
0.5|tsp|Baking soda
0.5|tsp|Salt
0.5|cup|Unsalted butter, softened
2|each|Large eggs
0.75|cup|Whole milk
1|tsp|Vanilla extract
1.5|cups|Powdered sugar
0.25|cup|Unsweetened cocoa powder
0.25|cup|Milk
1|tsp|Vanilla extract
`,
  "DN-004": `
2.5|cups|All-purpose flour
0.75|cup|Granulated sugar
2|tsp|Baking powder
0.5|tsp|Baking soda
0.5|tsp|Salt
1|tsp|Ground nutmeg
0.5|cup|Unsalted butter, softened
2|each|Large eggs
1|cup|Buttermilk
1|tsp|Vanilla extract
2|cups|Powdered sugar
0.25|cup|Buttermilk
1|tsp|Vanilla extract
1|pinch|Salt
`,
  "DN-005": `
2.5|cups|All-purpose flour
0.3333333333|cup|Granulated sugar
2.25|tsp (1 packet)|Active dry yeast
1|tsp|Salt
1.25|cups|Warm milk (110°F)
0.25|cup|Unsalted butter, melted
2|each|Large eggs
1|tsp|Vanilla extract
1|amount not specified|Vegetable oil for frying
1|cup|Pastry cream or vanilla pudding
1|cup|Strawberry or raspberry jam
1|cup|Chocolate hazelnut spread
`,
  "DN-006": `
2|cups|All-purpose flour
0.3333333333|cup|Granulated sugar
2|tsp|Baking powder
0.5|tsp|Baking soda
0.5|tsp|Salt
1|tsp|Ground cinnamon
0.25|tsp|Ground nutmeg
2|each|Large eggs
0.75|cup|Whole milk
1|tsp|Vanilla extract
2|cups|Peeled and diced apples (small dice)
2|cups|Powdered sugar
0.25|cup|Milk
0.5|tsp|Vanilla extract
1|pinch|Salt
`,
  "DN-007": `
2.5|cups|All-purpose flour
0.75|cup|Granulated sugar
2.5|tsp|Baking powder
0.5|tsp|Baking soda
0.5|tsp|Salt
1|tsp|Ground nutmeg
0.5|cup|Unsalted butter, softened
2|each|Large eggs
0.75|cup|Whole milk
1|tsp|Vanilla extract
1|cup|Fresh blueberries (or frozen, thawed)
1.5|cups|Powdered sugar
1|2-3 tbsp range|Milk
0.5|tsp|Vanilla extract
`,

  "HB-001": `
1|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Sesame seed buns
4|slices|American cheese
1|cup|Shredded lettuce
0.25|cup|Diced onion
16|slices|Dill pickles
0.5|cup|Mayonnaise
2|tbsp|Sweet relish
1|tbsp|Yellow mustard
1|tsp|White vinegar
`,
  "HB-002": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Large burger buns
4|slices|American cheese
0.25|cup|Yellow mustard
0.25|cup|Mayonnaise
1|cup|Shredded lettuce
1|each|Large tomato, sliced
0.25|cup|Diced onion
16|slices|Dill pickles
`,
  "HB-003": `
1|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Potato buns
4|slices|American cheese
1|cup|Shredded lettuce
1|each|Large tomato, sliced
0.25|cup|Thin onion slices
0.3333333333|cup|Mayonnaise
2|tbsp|Ketchup
1|tbsp|Sweet relish
1|tsp|Yellow mustard
`,
  "HB-004": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Sesame buns
8|slices|American cheese
1|cup|Shredded lettuce
1|each|Large tomato, sliced
0.5|cup|Grilled onions
16|slices|Dill pickles
1|amount not specified|Ketchup
1|amount not specified|Yellow mustard
1|amount not specified|Mayonnaise
`,
  "HB-005": `
1|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Brioche buns
4|slices|American cheese
0.25|cup|Mayonnaise
2|tbsp|Ketchup
1|tbsp|Yellow mustard
1|cup|Shredded lettuce
1|each|Large tomato, sliced
16|slices|Pickles
0.25|cup|Diced onion
`,
  "HB-006": `
1|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Potato buns
4|slices|American cheese
1|tbsp|Butter
1|cup|Shredded lettuce
1|each|Large tomato, sliced
0.3333333333|cup|Mayonnaise
1|tbsp|Ketchup
1|tsp|Yellow mustard
1|tsp|Pickle brine
`,
  "HB-007": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Brioche buns
4|slices|Sharp cheddar
8|strips|Bacon, cooked
1|cup|Crispy fried onions
1|cup|Arugula
1|each|Large tomato, sliced
0.25|cup|Mayonnaise
2|tbsp|Steak sauce
`,
  "HB-008": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Brioche buns
4|each|Eggs
4|slices|Cheddar cheese
8|strips|Bacon, cooked
4|tbsp|Mayonnaise
1|cup|Hash browns, crisped
1|tbsp|Butter
`,
  "HB-009": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Brioche buns
4|slices|Pepper jack cheese
8|strips|Bacon, cooked
1|each|Avocado, sliced
1|cup|Shredded lettuce
1|each|Large tomato, sliced
0.25|cup|Mayonnaise
1|tbsp|Lime juice
`,
  "HB-010": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Brioche buns
4|oz|Blue cheese, crumbled
8|strips|Bacon, cooked
1|cup|Arugula
1|each|Large tomato, sliced
0.25|cup|Mayonnaise
1|tbsp|Worcestershire sauce
`,
  "HB-011": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Brioche buns
4|slices|Provolone cheese
3|tbsp|Butter, softened
2|cloves|Garlic, minced
1|tbsp|Chopped parsley
1|cup|Shredded lettuce
1|each|Large tomato, sliced
2|tbsp|Mayonnaise
`,
  "HB-012": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Brioche buns
4|slices|Mozzarella cheese
0.5|cup|Marinara sauce
16|slices|Pepperoni
1|tsp|Italian seasoning
2|tbsp|Grated Parmesan
1|tbsp|Butter
`,
  "HB-013": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Brioche buns
4|slices|Cheddar cheese
2|cups|Prepared mac and cheese
0.5|cup|Crispy bacon bits
2|tbsp|Barbecue sauce
1|tbsp|Butter
`,
  "HB-014": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Burger buns
4|slices|Cheddar cheese
8|strips|Bacon, cooked
1|cup|Onion rings, cooked
0.5|cup|Barbecue sauce
1|tbsp|Mayonnaise
`,
  "HB-015": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Brioche buns
4|slices|Swiss cheese
2|each|Large onions, thinly sliced
2|tbsp|Butter
1|tsp|Worcestershire sauce
0.25|cup|Mayonnaise
1|tbsp|Beef broth
`,
  "HB-016": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Burger buns
4|slices|American cheese
1|cup|Shredded lettuce
1|each|Large tomato, sliced
0.25|cup|Sliced onion
16|slices|Dill pickles
0.25|cup|Ketchup
2|tbsp|Yellow mustard
2|tbsp|Mayonnaise
`,
  "HB-017": `
1.5|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Sesame buns
8|slices|American cheese
0.25|cup|Mayonnaise
2|tbsp|Ketchup
1|tbsp|Yellow mustard
1|cup|Shredded lettuce
0.25|cup|Diced onion
16|slices|Dill pickles
`,
  "HB-018": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Burger buns
4|slices|Cheddar cheese
8|strips|Bacon, cooked
1|cup|Shredded lettuce
1|each|Large tomato, sliced
16|slices|Dill pickles
0.25|cup|Mayonnaise
2|tbsp|Ketchup
1|tbsp|Yellow mustard
`,
  "HB-019": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Brioche buns
4|slices|Swiss cheese
8|oz|Mushrooms, sliced
1|tbsp|Butter
1|tsp|Worcestershire sauce
0.25|cup|Mayonnaise
1|cup|Arugula
1|each|Large tomato, sliced
`,
  "HB-020": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
8|slices|Rye bread
4|slices|Swiss cheese
4|slices|Cheddar cheese
2|each|Large onions, thinly sliced
2|tbsp|Butter
0.25|cup|Mayonnaise
1|tbsp|Ketchup
`,
  "HB-021": `
1|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Potato buns
8|slices|American cheese
0.3333333333|cup|Mayonnaise
1|tbsp|Ketchup
1|tsp|Yellow mustard
1|cup|Shredded lettuce
0.25|cup|Diced onion
16|slices|Dill pickles
`,
  "HB-022": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Soft burger buns
4|slices|American cheese
0.5|cup|Grilled onions
1|cup|Shredded lettuce
1|each|Large tomato, sliced
16|slices|Dill pickles
0.25|cup|Mayonnaise
2|tbsp|Ketchup
1|tbsp|Yellow mustard
`,
  "HB-023": `
1|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
2|each|Large onions, very thinly sliced
4|each|Soft burger buns
4|slices|American cheese
16|slices|Dill pickles
2|tbsp|Yellow mustard
2|tbsp|Mayonnaise
`,
  "HB-024": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Burger buns
4|slices|Cheddar cheese
8|strips|Bacon, cooked
0.5|cup|Barbecue sauce
1|cup|Shredded lettuce
1|each|Large tomato, sliced
0.25|cup|Mayonnaise
`,
  "HB-025": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Brioche buns
4|slices|Smoked cheddar
8|strips|Bacon, cooked
1|cup|Crispy fried onions
0.25|cup|Mayonnaise
2|tbsp|Barbecue sauce
1|tsp|Smoked paprika
`,
  "HB-026": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Burger buns
4|slices|Cheddar cheese
8|strips|Bacon, cooked
0.5|cup|Barbecue sauce
0.25|cup|Pickled jalapeño slices
1|cup|Shredded lettuce
0.25|cup|Mayonnaise
`,
  "HB-027": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Burger buns
4|slices|Cheddar cheese
1.5|cups|Prepared beef chili
0.25|cup|Diced onion
1|tbsp|Yellow mustard
2|tbsp|Mayonnaise
`,
  "HB-028": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Brioche buns
4|slices|Cheddar cheese
8|strips|Bacon, cooked
0.5|cup|Fried onion strings
0.25|cup|Sliced jalapeños
0.3333333333|cup|Barbecue sauce
2|tbsp|Mayonnaise
`,
  "HB-029": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Burger buns
4|slices|Cheddar cheese
1.5|cups|Crispy fried onions
0.25|cup|Mayonnaise
1|tbsp|Yellow mustard
16|slices|Dill pickles
`,
  "HB-030": `
1.25|lb|Ground beef, 80/20
1|tsp|Salt
0.5|tsp|Black pepper
4|each|Burger buns
1|cup|Prepared pimento cheese
1|cup|Shredded lettuce
1|each|Large tomato, sliced
0.25|cup|Mayonnaise
1|tbsp|Butter
`,
  "HB-031": `
1|lb|Ground beef for Lipsey-style chili sauce
1|each|Small onion, finely minced for Lipsey-style chili sauce
2|cups|Water for Lipsey-style chili sauce
2|tbsp|Chili powder for Lipsey-style chili sauce
1|tsp|Paprika for Lipsey-style chili sauce
0.5|tsp|Garlic powder for Lipsey-style chili sauce
0.5|tsp|Onion powder for Lipsey-style chili sauce
0.5|tsp|Black pepper for Lipsey-style chili sauce
1|tsp|Salt for Lipsey-style chili sauce
1|tbsp|Yellow mustard for Lipsey-style chili sauce
1|tbsp|Worcestershire sauce for Lipsey-style chili sauce
2|tbsp|Flour for Lipsey-style chili sauce
2|tbsp|Water for slurry
1.25|lb|Ground beef, 80/20 for burger patties
1|tsp|Salt for burger patties
0.5|tsp|Black pepper for burger patties
1|each per burger|Soft hamburger bun
1|amount not specified per burger|Yellow mustard
1|amount not specified per burger|Diced onions
1|amount not specified per burger|Dill pickle slices
`,

  "HBP-001": `
1|lb|Ground beef, 90/10
1|tsp|Kosher salt
0.5|tsp|Black pepper
0.5|tsp|Garlic powder
1|tbsp|Worcestershire sauce
`,
  "HBP-002": `
1|lb|Ground beef, 90/10
1|tsp|Kosher salt
0.5|tsp|Black pepper
0.5|tsp|Garlic powder
1|tbsp|Worcestershire sauce
`,
  "HBP-003": `
1|lb|Ground beef, 90/10
1|tsp|Kosher salt
0.5|tsp|Black pepper
0.5|tsp|Garlic powder
1|tbsp|Worcestershire sauce
`,
  "HBP-004": `
1|lb|Ground beef, 90/10
1|tsp|Kosher salt
1|tsp|Coarse black pepper
1|tsp|Garlic powder
0.5|tsp|Onion powder
1|tbsp|Worcestershire sauce
`,
  "HBP-005": `
1|lb|Ground beef, 90/10
1|tsp|Kosher salt
0.5|tsp|Black pepper
0.3333333333|cup|Finely minced onion
1|tbsp|Worcestershire sauce
0.5|tsp|Garlic powder
`,
  "HBP-006": `
1|lb|Ground beef, 90/10
1|tsp|Kosher salt
1|tsp|Cracked black pepper
1|tsp|Steak seasoning
1|tsp|Worcestershire sauce
0.5|tsp|Garlic powder
`,
  "HBP-007": `
1|lb|Ground beef, 90/10
1|tsp|Kosher salt
0.5|tsp|Black pepper
4|slices|Bacon, cooked crisp and finely chopped
1|tbsp|Barbecue sauce
0.5|tsp|Smoked paprika
`,
  "HBP-008": `
1|lb|Ground beef, 90/10
1|tsp|Kosher salt
0.5|tsp|Black pepper
0.25|cup|Finely diced pickled jalapeños, drained
0.5|cup|Shredded sharp cheddar cheese
0.5|tsp|Garlic powder
`,
  "HBP-009": `
1|lb|Ground beef, 90/10
1|tsp|Kosher salt
1|tsp|Cajun seasoning
0.5|tsp|Black pepper
0.5|tsp|Garlic powder
0.5|tsp|Onion powder
`,
  "HBP-010": `
1|lb|Ground beef, 90/10
1|tsp|Kosher salt
1|tbsp|Taco seasoning
0.5|tsp|Black pepper
1|tbsp|Finely crushed tortilla chips
1|tsp|Worcestershire sauce
`,
  "HBP-011": `
1|lb|Ground beef, 90/10
1|tsp|Kosher salt
0.5|tsp|Black pepper
1|tsp|Garlic powder
1|tbsp|Melted butter
1|tsp|Chopped parsley
`,
  "HBP-012": `
2|lb|Ground beef
2|each|Small onions, finely minced
4|cups|Water
4|tbsp|Chili powder
2|tsp|Paprika
1|tsp|Garlic powder
1|tsp|Onion powder
1|tsp|Black pepper
2|tsp|Salt
2|tbsp|Yellow mustard
2|tbsp|Worcestershire sauce
4|tbsp|Flour
4|tbsp|Water for slurry
`,
});
