function aisleFor(name, unit = "") {
  const value = `${name} ${unit}`.toLowerCase();
  if (/milk|butter|cream cheese|sour cream|heavy cream|egg/.test(value)) return "Dairy";
  if (/apple|blackberr|blueberr|cherr|strawberr|peach|pineapple|lemon/.test(value)) return "Produce";
  if (/flour|sugar|yeast|salt|cinnamon|nutmeg|baking powder|vanilla|cocoa|chocolate|oreo|graham|wafer|jam|pie filling|caramel|honey|pretzel/.test(value)) return "Baking";
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

export const SPECIALTY_INGREDIENTS_V8411 = cards({
  "BR-001": `
4|cups (480g)|Bread flour
2.5|tsp|Bread machine yeast
3|tbsp|Granulated sugar
2|tsp|Salt
1.3333333333|cups (320ml)|Warm water
0.3333333333|cup (80ml)|Milk
3|tbsp|Unsalted butter, softened
`,
  "BR-002": `
2|cups|Bread flour
2|cups|Whole wheat flour
2.5|tsp|Bread machine yeast
0.25|cup (85g)|Honey
1|tbsp|Granulated sugar
2|tsp|Salt
1.3333333333|cups (320ml)|Warm water
0.3333333333|cup (80ml)|Milk
3|tbsp|Unsalted butter, softened
`,
  "BR-003": `
4|cups (480g)|Bread flour
2.5|tsp|Bread machine yeast
3|tbsp|Granulated sugar
2|tsp|Salt
1.25|cups (300ml)|Buttermilk
0.25|cup (60ml)|Warm water
3|tbsp|Unsalted butter, softened
`,
  "BR-005": `
4|cups (480g)|Bread flour
2.5|tsp|Bread machine yeast
0.3333333333|cup (65g)|Granulated sugar
1.25|tsp|Salt
0.75|cup (180ml)|Pineapple juice
0.5|cup (120ml)|Milk
1|each|Egg
0.25|cup (60ml)|Unsalted butter, softened
`,
  "BR-006": `
2|cups|Bread flour
2|cups|All-purpose flour
2.25|tsp|Bread machine yeast
1.5|tsp|Salt
2|tbsp|Brown sugar
1.5|cups (360ml)|Warm water
3|tbsp|Unsalted butter, softened
1|tbsp, optional|Pretzel salt for topping
`,
  "BR-007": `
2|cups|Bread flour
2|cups|All-purpose flour
2.25|tsp|Bread machine yeast
1.5|tsp|Salt
0.25|cup (50g)|Granulated sugar
1.5|cups (360ml)|Warm water
0.25|cup (60ml)|Whole milk
3|tbsp|Unsalted butter, softened
`,
  "BR-008": `
2|cups|Bread flour
2|cups|All-purpose flour
1.5|tsp|Bread machine yeast
1.5|tsp|Salt
1|tbsp|Granulated sugar
1.5|cups (360ml)|Warm water
2|tbsp|Sour cream
1.5|tbsp|Lemon juice or white vinegar, for tangy flavor
3|tbsp|Unsalted butter, softened
`,
  "BR-009": `
0.75|cup|Pineapple juice, room temperature
0.5|cup|Warm milk
1|each|Egg
0.25|cup|Butter, softened
0.3333333333|cup|Sugar
1.25|tsp|Salt
4|cups|Bread flour
2.5|tsp|Bread machine yeast or instant yeast
1|each, optional glossy finish|Egg yolk
1|tbsp, optional glossy finish|Milk
1|tsp, optional glossy finish|Honey
`,
  "BR-010": `
1.25|cups|Warm water
0.25|cup|Whole milk
1|each|Egg
3|tbsp|Unsalted butter, softened
0.25|cup|Granulated sugar
1.5|tsp|Salt
2|cups|Bread flour
2|cups|All-purpose flour
2.5|tsp|Bread machine yeast or instant yeast
1|each, optional glossy finish|Egg yolk
1|tbsp, optional glossy finish|Milk
1|optional|Sesame seeds
`,
  "BR-011": `
2|cups|Bread flour
2|cups|All-purpose flour
1.25|cups (300ml)|Warm water
0.5|cup (120ml)|Warm milk
2|tbsp|Butter, melted
2|tbsp|Granulated sugar
1|tbsp|White vinegar or lemon juice
1.5|tsp|Salt
2.5|tsp|Bread machine yeast or instant yeast
`,
  "CC-001": `
12|squares|Graham crackers
3|tbsp|Melted sugar
0.1666666667|cup|Cream cheese, softened
0.5|cup|Granulated sugar
1|tsp|Vanilla extract
12|each|Large eggs
0.5|cup|Sour cream
0.5|tsp|Vanilla extract
0.125|tsp|Salt
12|oz|Cream cheese, softened
`,
  "CC-002": `
12|squares|Graham crackers
3|tbsp|Melted sugar
0.1666666667|cup|Cream cheese, softened
0.5|cup|Granulated sugar
1|tsp|Vanilla extract
12|each|Large eggs
0.5|cup|Sour cream
0.5|tsp|Vanilla extract
0.125|tsp|Salt
12|oz|Cream cheese, softened
0.5|cup|Salted caramel sauce
`,
  "CC-003": `
12|each|Oreo cookies, crushed
3|tbsp|Melted butter
1|tbsp|Granulated sugar
12|oz|Cream cheese, softened
0.5|cup|Granulated sugar
0.5|cup|Sour cream
1|tsp|Vanilla extract
2|each|Large eggs
0.5|cup|Finely chopped Oreo cookies
`,
  "CC-004": `
12|squares|Graham crackers
3|tbsp|Melted butter
2|tbsp|Granulated sugar
12|oz|Cream cheese, softened
0.5|cup|Granulated sugar
0.5|cup|Sour cream
1|tsp|Vanilla extract
2|each|Large eggs
0.5|cup|Strawberry jam
1|tsp|Lemon juice
`,
  "CC-005": `
12|each|Chocolate wafer cookies, crushed
3|tbsp|Melted butter
2|tbsp|Granulated sugar
12|oz|Cream cheese, softened
0.5|cup|Granulated sugar
0.5|cup|Sour cream
1|tsp|Vanilla extract
2|each|Large eggs
0.25|cup|Semisweet chocolate chips
1|tbsp|Heavy cream
`,
  "CC-006": `
12|squares|Graham crackers
3|tbsp|Melted butter
2|tbsp|Granulated sugar
12|oz|Cream cheese, softened
0.5|cup|Granulated sugar
0.5|cup|Sour cream
1|tsp|Vanilla extract
2|each|Large eggs
0.5|cup|Blueberry pie filling
1|tsp|Lemon juice
`,
  "CO-001": `
6|cups|Peeled, sliced apples
0.75|cup|Granulated sugar
0.25|cup, packed|Brown sugar
2|tbsp|All-purpose flour
1|tsp|Ground cinnamon
0.25|tsp|Ground nutmeg
1|tbsp|Lemon juice
1|cup|All-purpose flour
1|cup|Granulated sugar
1.5|tsp|Baking powder
0.25|tsp|Salt
1|cup|Whole milk
0.5|cup (1 stick)|Unsalted butter, melted
`,
  "CO-002": `
6|cups|Fresh or frozen blackberries
0.75|cup|Granulated sugar
0.25|cup, packed|Brown sugar
2|tbsp|All-purpose flour
1|tsp|Lemon juice
0.5|tsp|Vanilla extract
1|cup|All-purpose flour
1|cup|Granulated sugar
1.5|tsp|Baking powder
0.25|tsp|Salt
1|cup|Whole milk
0.5|cup (1 stick)|Unsalted butter, melted
`,
  "CO-003": `
6|cups|Fresh or frozen blueberries
0.75|cup|Granulated sugar
0.25|cup, packed|Brown sugar
2|tbsp|All-purpose flour
1|tbsp|Lemon juice
0.5|tsp|Vanilla extract
1|cup|All-purpose flour
1|cup|Granulated sugar
1.5|tsp|Baking powder
0.25|tsp|Salt
1|cup|Whole milk
0.5|cup (1 stick)|Unsalted butter, melted
`,
  "CO-004": `
6|cups|Pitted cherries, fresh or frozen
0.75|cup|Granulated sugar
0.25|cup, packed|Brown sugar
2|tbsp|All-purpose flour
1|tbsp|Lemon juice
0.5|tsp|Vanilla extract
1|cup|All-purpose flour
1|cup|Granulated sugar
1.5|tsp|Baking powder
0.25|tsp|Salt
1|cup|Whole milk
0.5|cup (1 stick)|Unsalted butter, melted
`,
  "CO-005": `
6|cups|Sliced strawberries, fresh or frozen
0.75|cup|Granulated sugar
0.25|cup, packed|Brown sugar
2|tbsp|All-purpose flour
1|tbsp|Lemon juice
0.5|tsp|Vanilla extract
1|cup|All-purpose flour
1|cup|Granulated sugar
1.5|tsp|Baking powder
0.25|tsp|Salt
1|cup|Whole milk
0.5|cup (1 stick)|Unsalted butter, melted
`,
  "CO-006": `
6|cups|Sliced peaches, fresh or frozen
0.75|cup|Granulated sugar
0.25|cup, packed|Brown sugar
2|tbsp|All-purpose flour
1|tbsp|Lemon juice
0.5|tsp|Vanilla extract
1|cup|All-purpose flour
1|cup|Granulated sugar
1.5|tsp|Baking powder
0.25|tsp|Salt
1|cup|Whole milk
0.5|cup (1 stick)|Unsalted butter, melted
`,
  "CR-001": `
4|cups|All-purpose flour
0.3333333333|cup|Granulated sugar
2.25|tsp (1 packet)|Active dry yeast
1|tsp|Salt
1.25|cups|Warm milk, 110°F
0.3333333333|cup|Unsalted butter, melted
2|each|Large eggs
0.3333333333|cup|Unsalted butter, softened
0.75|cup, packed|Brown sugar
2|tbsp|Ground cinnamon
1|cup|Powdered sugar
1|2-3 tbsp range|Milk
0.5|tsp|Vanilla extract
`,
  "CR-002": `
4|cups|All-purpose flour
0.3333333333|cup|Granulated sugar
2.25|tsp (1 packet)|Active dry yeast
1|tsp|Salt
1.25|cups|Warm milk, 110°F
0.3333333333|cup|Unsalted butter, melted
2|each|Large eggs
2|tbsp|Unsweetened cocoa powder
0.3333333333|cup|Unsalted butter, softened
0.5|cup, packed|Brown sugar
2|tbsp|Unsweetened cocoa powder
1|tbsp|Ground cinnamon
0.5|cup|Semisweet chocolate chips
1|cup|Powdered sugar
1|2-3 tbsp range|Milk
0.5|tsp|Vanilla extract
1|tbsp|Unsweetened cocoa powder
`,
  "CR-003": `
4|cups|All-purpose flour
0.3333333333|cup|Granulated sugar
2.25|tsp (1 packet)|Active dry yeast
1|tsp|Salt
1.25|cups|Warm milk, 110°F
0.3333333333|cup|Unsalted butter, melted
2|each|Large eggs
0.3333333333|cup|Unsalted butter, softened
0.5|cup, packed|Brown sugar
2|tsp|Ground cinnamon
2|cups|Peeled and diced apples, small dice
1|tsp|Lemon juice
1|cup|Powdered sugar
1|2-3 tbsp range|Milk
0.5|tsp|Vanilla extract
`,
  "CR-004": `
4|cups|All-purpose flour
0.3333333333|cup|Granulated sugar
2.25|tsp (1 packet)|Active dry yeast
1|tsp|Salt
1.25|cups|Warm milk, 110°F
0.3333333333|cup|Unsalted butter, melted
2|each|Large eggs
0.3333333333|cup|Unsalted butter, softened
0.5|cup, packed|Brown sugar
2|tsp|Ground cinnamon
0.5|cup|Chopped pecans
0.5|cup|Raisins
1|cup|Powdered sugar
1|2-3 tbsp range|Milk
0.5|tsp|Vanilla extract
`,
  "CR-005": `
1|8 oz can|Refrigerated crescent roll dough
0.25|cup|Unsalted butter, melted
0.3333333333|cup, packed|Brown sugar
1.5|tsp|Ground cinnamon
0.5|cup|Powdered sugar
1|1-2 tbsp range|Milk
0.5|tsp|Vanilla extract
`,
});
