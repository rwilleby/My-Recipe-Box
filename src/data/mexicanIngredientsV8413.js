function aisleFor(name, unit = "") {
  const value = `${name} ${unit}`.toLowerCase();
  if (/beef|steak|chicken|pork/.test(value)) return "Meat & Seafood";
  if (/cheese|cheddar|monterey jack|sour cream|cream cheese|milk|heavy cream|egg|cotija/.test(value)) return "Dairy";
  if (/onion|garlic|pepper|jalape|cilantro|tomato|lettuce|avocado|lime|celery/.test(value)) return "Produce";
  if (/tortilla|taco shell|tortilla chip|cornbread mix/.test(value)) return "Bread, Tortillas & Chips";
  if (/rice|bean|corn/.test(value)) return "Rice, Beans & Canned Goods";
  if (/enchilada sauce|salsa|tomato sauce|tomato paste|green chile|broth|soup/.test(value)) return "Canned Goods & Condiments";
  if (/oil|dripping|butter/.test(value)) return "Oils & Fats";
  if (/seasoning|chili powder|cumin|paprika|oregano|salt|pepper|garlic powder|onion powder|masa harina|cornstarch/.test(value)) return "Baking & Spices";
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

export const MEXICAN_INGREDIENTS_V8413 = cards({
  "MX-001": `
1|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
8|each|Corn tortillas, cut into strips
1|10 oz can|Red enchilada sauce
1|10 oz can|Diced tomatoes with green chiles, drained
1|15 oz can|Black beans, drained
2|cups|Shredded Mexican-blend cheese
1|tsp|Chili powder
0.5|tsp|Ground cumin
1|to taste|Salt
1|to taste|Black pepper
1|amount not specified for topping|Chopped cilantro or green onions
`,
  "MX-002": `
2|cups|Cooked shredded chicken
1|each|Small onion, diced
2|cloves|Garlic, minced
8|each|Corn tortillas, cut into strips
1|10 oz can|Red enchilada sauce
1|10 oz can|Diced tomatoes with green chiles, drained
1|15 oz can|Black beans, drained
2|cups|Shredded Mexican-blend cheese
0.5|cup|Sour cream
1|tsp|Chili powder
0.5|tsp|Ground cumin
1|to taste|Salt
1|to taste|Black pepper
1|amount not specified for topping|Chopped cilantro or green onions
`,
  "MX-003": `
1.5|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
1|tbsp|Chili powder
2|tsp|Ground cumin
1|tsp|Paprika
1|tsp|Dried oregano
0.5|tsp|Salt
0.25|tsp|Black pepper
1|cup|Tomato sauce
0.25|cup|Water
2|cups|Shredded cheddar or Mexican-blend cheese
1|amount not specified for garnish|Chopped cilantro
`,
  "MX-004": `
1.5|lb|Flank or skirt steak, thinly sliced
2|each|Bell peppers, sliced
1|each|Large onion, sliced
2|tbsp|Olive oil
2|tbsp|Lime juice
2|tsp|Chili powder
1|tsp|Ground cumin
1|tsp|Garlic powder
0.5|tsp|Paprika
0.5|tsp|Salt
0.25|tsp|Black pepper
8|each|Flour tortillas
1|amount not specified for garnish|Chopped cilantro
`,
  "MX-005": `
1.5|lb|Boneless skinless chicken breasts, sliced
2|each|Bell peppers, sliced
1|each|Large onion, sliced
2|tbsp|Olive oil
2|tbsp|Lime juice
2|tsp|Chili powder
1|tsp|Ground cumin
1|tsp|Garlic powder
0.5|tsp|Paprika
0.5|tsp|Salt
0.25|tsp|Black pepper
8|each|Flour tortillas
1|amount not specified for garnish|Chopped cilantro
`,
  "MX-006": `
1|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
1|tsp|Chili powder
0.5|tsp|Ground cumin
0.5|tsp|Salt
0.25|tsp|Black pepper
8|each|Flour tortillas
2|cups, divided|Red enchilada sauce
2|cups, divided|Shredded cheddar or Mexican-blend cheese
1|4 oz can|Diced green chiles
1|amount not specified for garnish|Chopped cilantro
`,
  "MX-007": `
2|cups|Cooked shredded chicken
1|each|Small onion, diced
2|cloves|Garlic, minced
8|each|Flour tortillas
2|cups, divided|Red enchilada sauce
2|cups, divided|Shredded cheddar or Mexican-blend cheese
0.5|cup|Sour cream
1|4 oz can|Diced green chiles
1|tsp|Chili powder
0.5|tsp|Ground cumin
1|to taste|Salt
1|to taste|Black pepper
1|amount not specified for garnish|Chopped cilantro
`,
  "MX-008": `
1|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
1|tbsp|Chili powder
2|tsp|Ground cumin
0.5|tsp|Paprika
0.5|tsp|Salt
0.25|tsp|Black pepper
8|each|Taco shells
1|cup|Shredded lettuce
1|cup|Diced tomatoes
1|cup|Shredded cheddar cheese
1|amount not specified for serving|Salsa or sour cream
`,
  "MX-009": `
1|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
1|cup|Salsa
1|cup|Refried beans
1|cup|Cooked Mexican rice
1|cup|Shredded cheddar or Mexican-blend cheese
1|tsp|Chili powder
0.5|tsp|Ground cumin
6|each|Large flour tortillas
1|amount not specified for serving|Sour cream or cilantro
`,
  "MX-010": `
2|cups|Cooked shredded chicken
1.5|cups|Shredded cheddar or Monterey Jack cheese
1|each|Small bell pepper, diced
2|each|Green onions, sliced
0.5|tsp|Chili powder
0.5|tsp|Ground cumin
0.25|tsp|Salt
8|each|Flour tortillas
2|tbsp|Butter or oil
1|amount not specified for serving|Salsa or sour cream
`,
  "MX-011": `
1|bag|Tortilla chips
1|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
1|tbsp|Chili powder
1|tsp|Ground cumin
0.5|tsp|Salt
0.25|tsp|Black pepper
1|15 oz can|Black beans, drained
2|cups|Shredded Mexican-blend cheese
1|each|Jalapeño, sliced
1|cup|Diced tomatoes
1|amount not specified for serving|Sour cream
1|amount not specified for serving|Green onions
`,
  "MX-012": `
1|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
1|tbsp|Chili powder
1|tsp|Ground cumin
0.5|tsp|Salt
0.25|tsp|Black pepper
1|10 oz can|Red enchilada sauce
1|10 oz can|Diced tomatoes with green chiles
1|cup|Corn kernels
1|15 oz can|Black beans, drained
1|8.5 oz box|Cornbread mix
1|each|Egg
0.3333333333|cup|Milk
1.5|cups, divided|Shredded cheddar cheese
1|amount not specified for garnish|Chopped green onions
`,
  "MX-013": `
2|tbsp|Oil
1.5|cups|Long-grain white rice
0.5|each|Small onion, finely diced
2|cloves|Garlic, minced
0.5|cup|Tomato sauce
2.75|cups|Chicken broth
1|tsp|Chili powder
0.5|tsp|Ground cumin
0.5|tsp|Salt
0.25|tsp|Black pepper
0.5|cup|Frozen peas and carrots
2|tbsp|Chopped cilantro
`,
  "MX-014": `
2|tbsp|Bacon drippings or oil
0.5|each|Small onion, diced
2|cloves|Garlic, minced
2|15 oz cans|Pinto beans, drained
0.5|cup|Chicken broth
1|tsp|Ground cumin
0.5|tsp|Chili powder
0.5|tsp|Salt
0.25|tsp|Black pepper
1|tbsp|Lime juice
1|optional amount not specified|Crumbled cotija or cilantro
`,
  "MX-015": `
1|tbsp|Olive oil
0.5|each|Small onion, diced
2|cloves|Garlic, minced
2|15 oz cans|Black beans, drained
0.5|cup|Chicken broth
1|tsp|Ground cumin
0.5|tsp|Oregano
0.5|tsp|Chili powder
0.5|tsp|Salt
1|tbsp|Lime juice
2|tbsp|Chopped cilantro
`,
  "MX-016": `
1|tbsp|Bacon drippings or oil
0.5|each|Small onion, diced
2|cloves|Garlic, minced
2|15 oz cans|Pinto beans, drained
0.75|cup|Chicken broth
1|tsp|Chili powder
0.5|tsp|Ground cumin
0.5|tsp|Salt
0.25|tsp|Black pepper
1|each|Small jalapeño, diced
2|tbsp|Chopped cilantro
`,
  "MX-017": `
2|tbsp|Butter
0.5|each|Small onion, diced
0.5|each|Bell pepper, diced
1|stalk|Celery, diced
2|cloves|Garlic, minced
4|cups|Corn kernels
0.3333333333|cup|Heavy cream
0.5|tsp|Salt
0.25|tsp|Black pepper
0.25|tsp|Paprika
2|each|Green onions, sliced
`,
  "MX-018": `
3|each|Ripe avocados
2|tbsp|Lime juice
1|each|Roma tomato, diced
0.25|cup|Red onion, finely diced
2|tbsp|Chopped cilantro
1|each|Small jalapeño, minced
0.5|tsp|Salt
0.25|tsp|Garlic powder
1|bag|Tortilla chips
`,
  "MX-019": `
16|oz|Processed cheese, cubed
1|10 oz can|Diced tomatoes with green chiles
0.5|cup|Milk
1|each|Small jalapeño, minced
0.5|tsp|Ground cumin
0.25|tsp|Chili powder
1|bag|Tortilla chips
1|optional amount not specified|Chopped cilantro
`,
  "MX-020": `
8|oz|White American cheese, cubed
8|oz|Monterey Jack cheese, shredded
0.75|cup|Milk
1|4 oz can|Diced green chiles
1|tbsp|Pickled jalapeño brine
1|each|Small jalapeño, minced
1.25|tsp|Ground cumin
1|bag|Tortilla chips
1|optional amount not specified|Chopped cilantro
`,
  "MX-021": `
1|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
1|tsp|Chili powder
0.5|tsp|Ground cumin
0.5|tsp|Salt
0.25|tsp|Black pepper
10|each|Corn tortillas, torn into pieces
1|10 oz can|Red enchilada sauce
1|10 oz can|Diced tomatoes with green chiles
1|15 oz can|Black beans, drained
2|cups, divided|Shredded Mexican-blend cheese
0.5|cup|Sour cream
1|amount not specified for topping|Chopped cilantro or green onions
`,
  "MX-022": `
1|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
1|tbsp|Taco seasoning
0.5|tsp|Salt
0.25|tsp|Black pepper
1|cup|Salsa
1|15 oz can|Black beans, drained
1|cup|Corn kernels
8|each|Corn tortillas, torn into pieces
2|cups, divided|Shredded cheddar or Mexican-blend cheese
1|cup|Sour cream
2|each|Green onions, sliced
`,
  "MX-023": `
1|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
1|tbsp|Chili powder
0.5|tsp|Ground cumin
0.5|tsp|Salt
0.25|tsp|Black pepper
1|10 oz can|Red enchilada sauce
1|15 oz can|Black beans, drained
1|cup|Corn kernels
9|each|Flour tortillas
2|cups|Shredded Mexican-blend cheese
1|cup|Sour cream
1|cup|Salsa
1|amount not specified for garnish|Chopped cilantro
`,
  "MX-024": `
1|lb|Ground beef
1|each|Small onion, diced
2|cloves|Garlic, minced
1|tbsp|Chili powder
0.5|tsp|Ground cumin
0.5|tsp|Salt
0.25|tsp|Black pepper
1|10 oz can|Red enchilada sauce
1|10 oz can|Diced tomatoes with green chiles
1|15 oz can|Black beans, drained
1|8.5 oz box|Cornbread mix
1|each|Egg
0.3333333333|cup|Milk
1.5|cups, divided|Shredded cheddar cheese
2|each|Green onions, sliced
`,
  "MX-025": `
1|lb|Flank steak, sliced thin
1|tbsp|Olive oil
1|each|Red bell pepper, sliced
1|each|Green bell pepper, sliced
1|each|Small onion, sliced
1|tsp|Chili powder
1|tsp|Cumin
0.5|tsp|Garlic powder
1|15 oz can|Black beans, drained and rinsed
1|cup|Corn kernels
2|cups|Cooked rice
1|cup|Pico de gallo
1|each|Avocado, diced
1|amount not specified for serving|Lime wedges
`,
  "MX-026": `
1|lb|Ground beef
1|packet|Taco seasoning
0.6666666667|cup|Water
1|15 oz can|Black beans, drained and rinsed
2|cups|Cooked rice
1|cup|Shredded lettuce
1|cup|Diced tomatoes
1|cup|Shredded cheddar cheese
0.25|cup|Sour cream
1|amount not specified for serving|Salsa
`,
  "MX-027": `
1|lb|Pork shoulder
1|tsp|Salt
0.5|tsp|Black pepper
1|tsp|Cumin
0.5|tsp|Oregano
0.25|cup|Orange juice
2|tbsp|Lime juice
1|15 oz can|Black beans, drained and rinsed
2|cups|Cooked rice
1|cup|Pico de gallo
1|each|Avocado, diced
1|amount not specified for garnish|Fresh cilantro
1|amount not specified for serving|Lime wedges
`,
  "MX-028": `
1|lb|Cooked chicken, diced
1|tbsp|Olive oil
1|tsp|Chili powder
0.5|tsp|Cumin
2|cups|Cooked rice
1|15 oz can|Black beans, drained and rinsed
1|cup|Corn kernels
1|cup|Pico de gallo
1|cup|Shredded lettuce
0.5|cup|Shredded cheese
0.5|cup|Guacamole
0.25|cup|Sour cream
`,
  "MX-029": `
2|cups|Cooked shredded chicken
1|15 oz can|Green enchilada sauce
2|cups|Cooked rice
1|15 oz can|Black beans, drained and rinsed
0.5|cup|Sour cream
1|cup|Shredded Monterey Jack cheese
0.5|cup|Diced onions
1|each|Avocado, sliced
1|amount not specified for garnish|Fresh cilantro
`,
  "MX-030": `
1|lb|Chicken breast, sliced
1|tbsp|Olive oil
1|tsp|Chili powder
0.5|tsp|Cumin
1|each|Red bell pepper, sliced
1|each|Green bell pepper, sliced
1|each|Small onion, sliced
1|15 oz can|Black beans, drained and rinsed
1|cup|Corn kernels
2|cups|Cooked rice
0.5|cup|Guacamole
1|amount not specified for serving|Lime wedges
`,
  "MX-031": `
2|cups|Cooked shredded chicken
1|tbsp|Olive oil
1|tsp|Chili powder
0.5|tsp|Cumin
0.5|tsp|Garlic powder
1|cup|Shredded cheese
4|each|Large flour tortillas
0.25|cup|Diced onions
0.25|cup|Diced bell peppers
1|amount not specified for serving|Sour cream
1|amount not specified for serving|Salsa
`,
  "MX-032": `
1|lb|Chicken thighs
1|tbsp|Olive oil
1|tsp|Chili powder
0.5|tsp|Cumin
0.5|tsp|Garlic powder
1|each|Juice of 1 lime
12|each|Small corn tortillas
0.5|cup|Diced onions
0.25|cup|Chopped cilantro
1|amount not specified for serving|Lime wedges
1|amount not specified for serving|Salsa
`,
  "MX-033": `
2|cups|Cooked shredded chicken
1|15 oz can|Red enchilada sauce
1|15 oz can|Green enchilada sauce
1|cup|Sour cream
1|4 oz can|Diced green chiles
2|cups|Shredded cheese
1|8.5 oz box|Cornbread mix
1|each|Egg
0.3333333333|cup|Milk
`,
  "MX-034": `
2|cups|Cooked shredded chicken
1|tbsp|Olive oil
1|each|Onion, diced
2|cloves|Garlic, minced
1|tsp|Chili powder
0.5|tsp|Cumin
1|14.5 oz can|Diced tomatoes
4|cups|Chicken broth
1|15 oz can|Black beans, drained and rinsed
1|cup|Corn kernels
1|amount not specified for serving|Tortilla strips
1|amount not specified for serving|Avocado
1|amount not specified for serving|Cilantro
1|amount not specified for serving|Lime
`,
  "MX-035": `
2|lb|Beef stew meat, cubed
1|tbsp|Oil
1|each|Small onion, chopped
3|cloves|Garlic, minced
2|tbsp|Chili powder
1|tsp|Ground cumin
1|tsp|Oregano
0.25|tsp|Salt
0.25|tsp|Black pepper
2|cups|Beef broth
1|14.5 oz can|Diced tomatoes
1|tbsp|Tomato paste
`,
  "MX-036": `
2|lb|Pork shoulder, cubed
1|tbsp|Oil
1|each|Small onion, chopped
3|cloves|Garlic, minced
1|tsp|Ground cumin
0.5|tsp|Oregano
0.5|tsp|Salt
0.25|tsp|Black pepper
1|16 oz jar|Salsa verde
1|4 oz can|Diced green chiles
0.5|cup|Chicken broth
1|tbsp|Lime juice
`,
  "MX-037": `
2|cups|Cooked shredded chicken or beef
1|cup|Refried beans
1|cup|Shredded cheese
0.5|cup|Salsa
6|each|Large flour tortillas
2|tbsp|Oil or cooking spray
1|amount not specified for serving|Sour cream
1|amount not specified for serving|Guacamole
`,
  "MX-038": `
1|lb|Flank steak or chicken, sliced
1|tbsp|Oil
1|each|Bell pepper, sliced
1|each|Small onion, sliced
1|tsp|Fajita seasoning
4|each|Large flour tortillas
2|cups|Shredded cheese
1|amount not specified for serving|Salsa
1|amount not specified for serving|Sour cream
`,
  "MX-039": `
2|cups|Cooked shredded chicken
1|tsp|Taco seasoning
0.5|cup|Shredded cheese
12|each|Small corn tortillas
1|amount not specified|Cooking spray or oil
1|amount not specified for serving|Shredded lettuce
1|amount not specified for serving|Salsa
1|amount not specified for serving|Crema or sour cream
`,
  "MX-040": `
2|cups|Cooked shredded chicken
1|10.5 oz can|Cream of chicken soup
1|10 oz can|Diced tomatoes with green chiles
0.5|cup|Sour cream
0.5|cup|Chopped onion
8|each|Corn tortillas, cut into strips
2|cups|Shredded cheddar or Mexican-blend cheese
1|tsp|Chili powder
1|to taste|Salt
1|to taste|Black pepper
`,
  "MX-041": `
1|lb|Chicken breast, diced
1|tbsp|Oil
1|each|Small onion, chopped
1|each|Bell pepper, chopped
2|cloves|Garlic, minced
1|cup|Long-grain rice
2|cups|Chicken broth
1|10 oz can|Diced tomatoes with green chiles
1|tsp|Chili powder
0.5|tsp|Cumin
1|to taste|Salt
1|to taste|Black pepper
`,
  "MX-042": `
1|lb|Ground beef
1|each|Small onion, chopped
1|packet|Taco seasoning
1|14.5 oz can|Diced tomatoes
1|15 oz can|Black beans, drained and rinsed
1|15 oz can|Corn, drained
4|cups|Beef broth
0.5|cup|Salsa
1|amount not specified for serving|Avocado, tortilla strips, or sour cream
`,
  "MX-043": `
1|lb|Ground beef
0.75|cup|Water
1|tbsp|Chili powder
1|tsp|Paprika
1|tsp|Cumin
0.5|tsp|Onion powder
0.5|tsp|Garlic powder
1|tbsp|Masa harina or cornstarch
0.5|tsp|Salt
`,
  "MX-044": `
2|lb|Boneless skinless chicken breasts
1|cup|Chicken broth
1|tsp|Taco seasoning
0.5|tsp|Salt
`,
});
