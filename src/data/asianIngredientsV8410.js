function aisleFor(name, unit = "") {
  const value = `${name} ${unit}`.toLowerCase();
  if (/chicken|beef|steak|shrimp|crab meat/.test(value)) return "Meat & Seafood";
  if (/cream cheese|\begg/.test(value)) return "Dairy";
  if (/broccoli|onion|garlic|ginger|bell pepper|zucchini|pineapple|orange|cabbage|carrot|bean sprout|coleslaw|lettuce|cucumber|lime wedge/.test(value)) return "Produce";
  if (/cornstarch/.test(value)) return "Baking";
  if (/oil/.test(value)) return "Oils & Vinegars";
  if (/sauce|hoisin|teriyaki/.test(value)) return "Asian Sauces & Condiments";
  if (/sesame seed|peanut|cashew|red pepper flake/.test(value)) return "Nuts, Seeds & Spices";
  if (/rice|noodle|vermicelli/.test(value)) return "Rice, Noodles & Grains";
  if (/wrapper|rice paper|skewer/.test(value)) return "International Foods";
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

export const ASIAN_INGREDIENTS_V8410 = cards({
  "AS-001": `
1|lb|Flank steak, thinly sliced
1|tbsp|Vegetable oil
4|cups|Broccoli florets
0.5|each|Small onion, sliced
2|cloves|Garlic, minced
1|tsp|Fresh ginger, minced
0.5|cup|Lee Kum Kee Panda Brand Oyster Sauce
2|each|Green onions, sliced
1|for serving|Cooked rice
`,
  "AS-002": `
1|lb|Flank steak, thinly sliced
1|tbsp|Vegetable oil
1|each|Red bell pepper, sliced
1|each|Green bell pepper, sliced
2|cloves|Garlic, minced
1|tsp|Fresh ginger, minced
0.5|cup|Lee Kum Kee Panda Brand Hoisin Sauce
2|each|Green onions, sliced
1|for serving|Cooked rice
`,
  "AS-003": `
1|lb|Flank steak, thinly sliced
2|tbsp|Cornstarch
1|tbsp|Vegetable oil
0.5|each|Small onion, sliced
2|cloves|Garlic, minced
1|tsp|Fresh ginger, minced
0.5|cup|Kikkoman Mongolian Style Stir-Fry Sauce
2|each|Green onions, sliced
1|for serving|Cooked rice
`,
  "AS-004": `
1|lb|Flank steak, thinly sliced
1|tbsp|Vegetable oil
1|each|Red bell pepper, sliced
1|each|Green bell pepper, sliced
0.5|each|Onion, sliced
2|cloves|Garlic, minced
1|tbsp|Fresh ginger, minced
2|each|Green onions, sliced
0.5|cup|Lee Kum Kee Black Pepper Sauce
1|for serving|Cooked rice
`,
  "AS-005": `
1|lb|Flank steak, thinly sliced
2|tbsp|Cornstarch
1|tbsp|Vegetable oil
1|each|Green bell pepper, sliced
1|each|Red bell pepper, sliced
0.5|each|Onion, sliced
2|each|Green onions, sliced
1|amount not specified|Lee Kum Kee Black Pepper Sauce
1|for serving|Cooked rice
`,
  "AS-006": `
1|lb|Flank steak, thinly sliced
2|tbsp|Cornstarch
1|tbsp|Vegetable oil
2|cloves|Garlic, minced
1|tsp|Fresh ginger, minced
0.5|cup|Bibigo Korean BBQ Sauce
2|each|Green onions, sliced
1|tsp|Sesame seeds
1|for serving|Cooked rice
`,
  "AS-007": `
1|lb|Boneless skinless chicken breast, cut into bite-size pieces
2|tbsp|Cornstarch
1|tbsp|Vegetable oil
2|cloves|Garlic, minced
1|tsp|Fresh ginger, minced
0.5|cup|Kikkoman Teriyaki Baste & Glaze
2|each|Green onions, sliced
1|tsp, optional|Sesame seeds
1|for serving|Cooked rice
`,
  "AS-008": `
1|lb|Chicken breast, cut into 1-inch pieces
0.5|cup|Cornstarch
2|tbsp|Vegetable oil
1|each|Red bell pepper, cut into 1-inch pieces
1|each|Green bell pepper, cut into 1-inch pieces
0.5|cup|Onion chunks
1|can, drained|Pineapple chunks
1|15 oz bottle|Kikkoman Sweet & Sour Sauce
1|for serving|Cooked rice
`,
  "AS-009": `
1|lb|Chicken breast, cut into 1-inch pieces
0.5|cup|Cornstarch
2|tbsp|Vegetable oil
2|cloves|Garlic, minced
1|tbsp|Fresh ginger, minced
0.5|cup|Sesame stir-fry sauce
2|each|Green onions, sliced
1|tbsp|Sesame seeds
1|for serving|Cooked rice
`,
  "AS-010": `
1|lb|Chicken breast, cut into 1-inch pieces
0.5|cup|Cornstarch
2|tbsp|Vegetable oil
2|cloves|Garlic, minced
1|tbsp|Fresh ginger, minced
0.5|cup|Panda Express Orange Sauce
2|each|Green onions, sliced
1|optional garnish|Orange, sliced
1|for serving|Cooked rice
`,
  "AS-011": `
1|lb|Chicken breast, cut into 1-inch pieces
1|each|Red bell pepper, cut into 1-inch pieces
1|each|Green bell pepper, cut into 1-inch pieces
0.5|cup|Zucchini, cut into 1-inch pieces
2|each|Green onions, sliced
0.5|cup|Roasted peanuts
0.5|cup|Lee Kum Kee Kung Pao Stir-Fry Sauce
1|for serving|Cooked rice
`,
  "AS-012": `
1|lb|Boneless skinless chicken breast, cut into 1-inch pieces
2|tbsp|Cornstarch
2|tbsp|Vegetable oil
0.5|cup|Lee Kum Kee Honey Garlic Sauce
2|each|Green onions, sliced
1|tbsp, optional|Sesame seeds
1|for serving|Cooked rice
`,
  "AS-013": `
1|lb|Chicken breast, cut into 1-inch pieces
2|tbsp|Vegetable oil
0.5|cup|Lee Kum Kee General Tso's Sauce
0.5|tsp, optional|Red pepper flakes
2|each|Green onions, sliced
1|for serving|Cooked rice
`,
  "AS-014": `
1|lb|Chicken breast, cut into 1-inch pieces
1|each|Red bell pepper, cut into 1-inch pieces
1|each|Green bell pepper, cut into 1-inch pieces
0.5|each|Onion, cut into 1-inch pieces
0.5|cup|Cashews
1|15 oz bottle|Kikkoman Cashew Sauce for Chicken
2|each|Green onions, sliced
1|for serving|Cooked rice
`,
  "AS-015": `
1|lb|Chicken breast, cut into 1-inch pieces
1|each|Red bell pepper, cut into 1-inch pieces
1|each|Green bell pepper, cut into 1-inch pieces
0.5|each|Onion, cut into 1-inch pieces
3|cloves|Garlic, minced
1|tbsp|Fresh ginger, minced
1|14.5 oz bottle|Kikkoman Hunan Sauce for Chicken
1|for serving|Cooked rice
`,
  "AS-016": `
1|lb|Chicken breast, cut into 1-inch pieces
2|tbsp|Vegetable oil
1|each|Red bell pepper, cut into 1-inch pieces
1|each|Green bell pepper, cut into 1-inch pieces
0.5|each|Onion, cut into 1-inch pieces
3|cloves|Garlic, minced
1|tbsp|Fresh ginger, minced
0.5|cup|Kikkoman Szechuan Sauce for Chicken
2|each|Green onions, sliced
1|for serving|Cooked rice
`,
  "AS-017": `
1|lb|Chicken breast, cut into 1-inch pieces
2|tbsp|Cornstarch
2|tbsp|Vegetable oil
1|each|Green bell pepper, cut into 1-inch pieces
1|each|Red bell pepper, cut into 1-inch pieces
0.5|each|Onion, cut into 1-inch pieces
3|cloves|Garlic, minced
1|tbsp|Fresh ginger, minced
0.5|cup|Kikkoman Black Pepper Sauce for Chicken
2|each|Green onions, sliced
1|for serving|Cooked rice
`,
  "AS-018": `
3|cups|Cooked rice
2|each|Eggs, lightly beaten
1|tbsp|Vegetable oil
1|cup|Mixed peas and carrots
0.5|cup|Diced onion
2|each|Green onions, sliced
0.5|cup|Kikkoman Fried Rice Sauce
1|optional|Sesame seeds
`,
  "AS-019": `
8|oz|Lo mein noodles
1|tbsp|Vegetable oil
1|cup|Cooked chicken or beef strips
1|cup|Shredded cabbage
0.5|cup|Sliced carrots
0.5|cup|Sliced bell pepper
2|each|Green onions, sliced
0.25|cup|Kikkoman Lo Mein Sauce
1|optional|Sesame seeds
`,
  "AS-020": `
8|oz|Chow mein noodles
1|tbsp|Vegetable oil
1|cup|Cooked chicken or pork strips
1|cup|Shredded cabbage
0.5|cup|Sliced carrots
0.5|cup|Sliced onion
0.5|cup|Bean sprouts
0.25|cup|Kikkoman Chow Mein Sauce
2|each|Green onions, sliced
`,
  "AS-021": `
8|oz|Rice vermicelli noodles
1|tbsp|Vegetable oil
1|lb|Chicken breast, thinly sliced, or 1 lb shrimp, peeled and deveined
1|each|Red bell pepper, thinly sliced
1|each|Small onion, thinly sliced
2|cloves|Garlic, minced
0.5|cup|Mae Ploy Yellow Curry Sauce
2|each|Green onions, sliced
1|optional, for serving|Lime wedges
1|optional, for serving|Bean sprouts
`,
  "AS-022": `
1|lb|Ground chicken
2|cups|Coleslaw mix
0.5|cup|Shredded carrots
2|each|Green onions, sliced
2|cloves|Garlic, minced
1|tsp|Fresh ginger, minced
2|tbsp|Soy sauce
1|tsp|Sesame oil
1|package|Egg roll wrappers
1|for frying or air frying|Oil
`,
  "AS-023": `
8|8.5-inch sheets|Rice paper wrappers
4|oz|Rice vermicelli noodles
1|cup|Shredded lettuce
1|cup|Julienned carrots
1|cup|Cucumber, julienned
0.5|lb|Cooked shrimp, peeled, or shredded chicken
`,
  "AS-024": `
8|oz|Cream cheese, softened
8|oz|Imitation crab meat, finely chopped
2|each|Green onions, sliced
24|each|Wonton wrappers
1|for frying or air frying|Oil
`,
});
