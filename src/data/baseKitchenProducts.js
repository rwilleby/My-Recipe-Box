// Curated, generic products used by the "Choose Products" inventory workflow.
// Retailer, brand, package size, price and dates belong to the user's record,
// not this shared product vocabulary.
const p = (categoryId, family, variation, unit, storage, aliases = []) => Object.freeze({
  id: `base-${categoryId}-${family}-${variation}`.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  categoryId, family, variation, unit, storage, aliases: Object.freeze(aliases),
});

const LEGACY_BASE_KITCHEN_PRODUCTS = Object.freeze([
  // Meat & Seafood
  p("meat-poultry", "Bacon", "Sliced", "packages", "Refrigerator", ["bacon strips"]),
  p("meat-poultry", "Beef", "Brisket", "lb", "Refrigerator", ["beef brisket"]),
  p("meat-poultry", "Beef", "Chuck Roast", "lb", "Refrigerator", ["pot roast"]),
  p("meat-poultry", "Beef", "Stew Meat", "lb", "Refrigerator", ["beef cubes"]),
  p("meat-poultry", "Beef", "Sirloin Steak", "lb", "Refrigerator", ["sirloin"]),
  p("meat-poultry", "Beef", "Ribeye Steak", "lb", "Refrigerator", ["rib eye"]),
  p("meat-poultry", "Ground Beef", "80/20", "lb", "Refrigerator", ["hamburger", "80 20 beef"]),
  p("meat-poultry", "Ground Beef", "90/10", "lb", "Refrigerator", ["lean ground beef", "90 10 beef"]),
  p("meat-poultry", "Ground Beef", "93/7", "lb", "Refrigerator", ["93 percent lean beef"]),
  p("meat-poultry", "Ground Beef", "97/3", "lb", "Refrigerator", ["extra lean ground beef"]),
  p("meat-poultry", "Chicken", "Boneless Skinless Breasts", "lb", "Refrigerator", ["chicken breast"]),
  p("meat-poultry", "Chicken", "Boneless Skinless Thighs", "lb", "Refrigerator", ["chicken thighs"]),
  p("meat-poultry", "Chicken", "Bone-In Thighs", "lb", "Refrigerator"),
  p("meat-poultry", "Chicken", "Drumsticks", "lb", "Refrigerator", ["chicken legs"]),
  p("meat-poultry", "Chicken", "Tenderloins", "lb", "Refrigerator", ["chicken tenders"]),
  p("meat-poultry", "Chicken", "Whole", "each", "Refrigerator", ["whole chicken"]),
  p("meat-poultry", "Chicken", "Wings", "lb", "Refrigerator"),
  p("meat-poultry", "Ground Chicken", "Lean", "lb", "Refrigerator"),
  p("meat-poultry", "Ham", "Diced", "packages", "Refrigerator"),
  p("meat-poultry", "Ham", "Steak", "each", "Refrigerator"),
  p("meat-poultry", "Ham", "Whole", "lb", "Refrigerator"),
  p("meat-poultry", "Pork", "Baby Back Ribs", "racks", "Refrigerator"),
  p("meat-poultry", "Pork", "Bone-In Chops", "lb", "Refrigerator"),
  p("meat-poultry", "Pork", "Boneless Chops", "lb", "Refrigerator"),
  p("meat-poultry", "Pork", "Shoulder", "lb", "Refrigerator", ["pork butt", "boston butt"]),
  p("meat-poultry", "Pork", "Tenderloin", "lb", "Refrigerator"),
  p("meat-poultry", "Ground Pork", "Regular", "lb", "Refrigerator"),
  p("meat-poultry", "Sausages", "Breakfast Links", "packages", "Refrigerator"),
  p("meat-poultry", "Sausages", "Breakfast Patties", "packages", "Refrigerator"),
  p("meat-poultry", "Sausages", "Italian Mild", "packages", "Refrigerator"),
  p("meat-poultry", "Sausages", "Italian Hot", "packages", "Refrigerator"),
  p("meat-poultry", "Sausages", "Smoked", "packages", "Refrigerator", ["kielbasa"]),
  p("meat-poultry", "Turkey", "Breast", "lb", "Refrigerator"),
  p("meat-poultry", "Turkey", "Whole", "each", "Refrigerator"),
  p("meat-poultry", "Ground Turkey", "Lean", "lb", "Refrigerator"),
  p("meat-poultry", "Deli Meats", "Sliced Ham", "packages", "Refrigerator"),
  p("meat-poultry", "Deli Meats", "Sliced Turkey", "packages", "Refrigerator"),
  p("meat-poultry", "Deli Meats", "Sliced Chicken", "packages", "Refrigerator"),
  p("meat-poultry", "Hot Dogs & Bratwurst", "Beef Hot Dogs", "packages", "Refrigerator"),
  p("meat-poultry", "Hot Dogs & Bratwurst", "Bratwurst", "packages", "Refrigerator"),
  p("meat-poultry", "Meatballs", "Fresh", "packages", "Refrigerator"),
  p("seafood", "Fish", "Catfish Fillets", "lb", "Refrigerator"),
  p("seafood", "Fish", "Cod Fillets", "lb", "Refrigerator"),
  p("seafood", "Fish", "Tilapia Fillets", "lb", "Refrigerator"),
  p("seafood", "Salmon", "Fillets", "lb", "Refrigerator"),
  p("seafood", "Tuna", "Steaks", "lb", "Refrigerator"),
  p("seafood", "Shrimp", "Raw Peeled & Deveined", "lb", "Refrigerator", ["raw shrimp"]),
  p("seafood", "Shrimp", "Cooked Peeled", "lb", "Refrigerator", ["cooked shrimp"]),
  p("seafood", "Crab", "Lump Meat", "lb", "Refrigerator", ["crabmeat"]),
  p("seafood", "Scallops", "Sea", "lb", "Refrigerator"),

  // Dairy & Eggs
  p("dairy-eggs", "Butter", "Salted", "sticks", "Refrigerator"),
  p("dairy-eggs", "Butter", "Unsalted", "sticks", "Refrigerator"),
  p("dairy-eggs", "Buttermilk", "Cultured", "cartons", "Refrigerator"),
  p("dairy-eggs", "Cheese", "Block Cheddar", "packages", "Refrigerator"),
  p("dairy-eggs", "Cheese", "Cream", "packages", "Refrigerator", ["cream cheese"]),
  p("dairy-eggs", "Cheese", "Grated Parmesan", "containers", "Refrigerator", ["parmesan cheese"]),
  p("dairy-eggs", "Cheese", "Shredded Cheddar", "bags", "Refrigerator"),
  p("dairy-eggs", "Cheese", "Shredded Mexican Blend", "bags", "Refrigerator"),
  p("dairy-eggs", "Cheese", "Shredded Mozzarella", "bags", "Refrigerator"),
  p("dairy-eggs", "Cheese", "Sliced American", "packages", "Refrigerator"),
  p("dairy-eggs", "Cheese", "Sliced Provolone", "packages", "Refrigerator"),
  p("dairy-eggs", "Cheese", "Swiss", "packages", "Refrigerator"),
  p("dairy-eggs", "Cottage Cheese", "Regular", "containers", "Refrigerator"),
  p("dairy-eggs", "Cream", "Heavy Whipping", "cartons", "Refrigerator"),
  p("dairy-eggs", "Eggs", "Large", "each", "Refrigerator", ["large eggs", "shell eggs"]),
  p("dairy-eggs", "Egg Substitutes", "Liquid Egg Whites", "cartons", "Refrigerator"),
  p("dairy-eggs", "Half-and-Half", "Regular", "cartons", "Refrigerator"),
  p("dairy-eggs", "Milk", "Whole", "gallons", "Refrigerator"),
  p("dairy-eggs", "Milk", "2%", "gallons", "Refrigerator", ["two percent milk", "reduced fat milk"]),
  p("dairy-eggs", "Milk", "Skim", "gallons", "Refrigerator", ["fat free milk"]),
  p("dairy-eggs", "Milk", "Lactose-Free 2%", "cartons", "Refrigerator"),
  p("dairy-eggs", "Plant-Based Milk", "Unsweetened Almond", "cartons", "Refrigerator"),
  p("dairy-eggs", "Plant-Based Milk", "Unsweetened Oat", "cartons", "Refrigerator"),
  p("dairy-eggs", "Sour Cream", "Regular", "containers", "Refrigerator"),
  p("dairy-eggs", "Yogurt", "Greek Plain", "containers", "Refrigerator"),
  p("dairy-eggs", "Yogurt", "Greek Vanilla", "containers", "Refrigerator"),

  // Produce
  p("vegetables", "Asparagus", "Fresh Spears", "bunches", "Refrigerator"),
  p("vegetables", "Avocados", "Fresh", "each", "Counter"),
  p("vegetables", "Broccoli", "Fresh Crowns", "each", "Refrigerator"),
  p("vegetables", "Brussels Sprouts", "Fresh", "lb", "Refrigerator"),
  p("vegetables", "Cabbage", "Green", "each", "Refrigerator"),
  p("vegetables", "Carrots", "Baby", "bags", "Refrigerator"),
  p("vegetables", "Carrots", "Whole", "lb", "Refrigerator"),
  p("vegetables", "Cauliflower", "Fresh Head", "each", "Refrigerator"),
  p("vegetables", "Celery", "Fresh Bunch", "each", "Refrigerator"),
  p("vegetables", "Corn", "Fresh Ears", "ears", "Refrigerator"),
  p("vegetables", "Cucumbers", "Fresh", "each", "Refrigerator"),
  p("vegetables", "Garlic", "Fresh Bulbs", "each", "Pantry"),
  p("vegetables", "Leafy Greens", "Fresh Spinach", "bags", "Refrigerator"),
  p("vegetables", "Lettuce", "Romaine Hearts", "packages", "Refrigerator"),
  p("vegetables", "Mushrooms", "Fresh Sliced", "packages", "Refrigerator"),
  p("vegetables", "Onions", "Yellow", "each", "Pantry"),
  p("vegetables", "Onions", "White", "each", "Pantry"),
  p("vegetables", "Onions", "Red", "each", "Pantry"),
  p("vegetables", "Peppers", "Green Bell", "each", "Refrigerator"),
  p("vegetables", "Peppers", "Jalapeño", "each", "Refrigerator"),
  p("vegetables", "Potatoes", "Gold", "lb", "Pantry"),
  p("vegetables", "Potatoes", "Red", "lb", "Pantry"),
  p("vegetables", "Potatoes", "Russet", "lb", "Pantry"),
  p("vegetables", "Sweet Potatoes", "Fresh", "lb", "Pantry"),
  p("vegetables", "Tomatoes", "Cherry", "containers", "Counter"),
  p("vegetables", "Tomatoes", "Roma", "each", "Counter"),
  p("vegetables", "Zucchini", "Fresh", "each", "Refrigerator"),
  p("fruit", "Apples", "Fresh", "each", "Refrigerator"),
  p("fruit", "Bananas", "Fresh", "each", "Counter"),
  p("fruit", "Blueberries", "Fresh", "containers", "Refrigerator"),
  p("fruit", "Grapes", "Seedless", "bags", "Refrigerator"),
  p("fruit", "Lemons", "Fresh", "each", "Refrigerator"),
  p("fruit", "Limes", "Fresh", "each", "Refrigerator"),
  p("fruit", "Oranges", "Fresh", "each", "Refrigerator"),
  p("fruit", "Strawberries", "Fresh", "containers", "Refrigerator"),

  // Canned & Jarred Foods
  p("canned-jarred", "Beans", "Black", "cans", "Pantry", ["canned black beans"]),
  p("canned-jarred", "Beans", "Kidney", "cans", "Pantry"),
  p("canned-jarred", "Beans", "Pinto", "cans", "Pantry"),
  p("canned-jarred", "Broth & Stock", "Beef Low Sodium", "cartons", "Pantry", ["low sodium beef broth"]),
  p("canned-jarred", "Broth & Stock", "Chicken Low Sodium", "cartons", "Pantry", ["low sodium chicken broth"]),
  p("canned-jarred", "Canned Fruit", "Peaches", "cans", "Pantry"),
  p("canned-jarred", "Canned Fruit", "Pineapple", "cans", "Pantry"),
  p("canned-jarred", "Canned Poultry", "Chicken Breast", "cans", "Pantry"),
  p("canned-jarred", "Canned Seafood", "Tuna In Water", "cans", "Pantry"),
  p("canned-jarred", "Canned Tomatoes", "Crushed", "cans", "Pantry"),
  p("canned-jarred", "Canned Tomatoes", "Diced", "cans", "Pantry"),
  p("canned-jarred", "Canned Tomatoes", "Diced No Salt Added", "cans", "Pantry"),
  p("canned-jarred", "Canned Tomatoes", "Fire-Roasted Diced", "cans", "Pantry"),
  p("canned-jarred", "Canned Vegetables", "Corn", "cans", "Pantry"),
  p("canned-jarred", "Canned Vegetables", "Green Beans", "cans", "Pantry"),
  p("canned-jarred", "Condensed Soups", "Cream Of Chicken", "cans", "Pantry"),
  p("canned-jarred", "Condensed Soups", "Cream Of Mushroom", "cans", "Pantry"),
  p("canned-jarred", "Refried Beans", "Traditional", "cans", "Pantry"),
  p("canned-jarred", "Tomato Paste", "Regular", "cans", "Pantry"),
  p("canned-jarred", "Tomato Sauce", "Regular", "cans", "Pantry"),

  // Pantry Staples (kept in the site's existing practical categories)
  p("beverages", "Coffee", "Ground Medium Roast", "containers", "Pantry", ["ground coffee", "medium roast coffee"]),
  p("beverages", "Coffee", "Pods Medium Roast", "boxes", "Pantry", ["coffee pods", "k cups", "k-cups"]),
  p("beverages", "Tea", "Black Bags", "boxes", "Pantry"),
  p("bread-bakery", "Sandwich Bread", "White", "loaves", "Pantry"),
  p("bread-bakery", "Sandwich Bread", "Whole Wheat", "loaves", "Pantry"),
  p("bread-bakery", "Hamburger Buns", "Regular", "packages", "Pantry"),
  p("bread-bakery", "Hot Dog Buns", "Regular", "packages", "Pantry"),
  p("bread-bakery", "Tortillas", "Flour", "packages", "Pantry"),
  p("bread-bakery", "Tortillas", "Corn", "packages", "Pantry"),
  p("bread-bakery", "Tortillas", "Low-Carb Flour", "packages", "Pantry"),
  p("rice-pasta-grains", "Oats", "Old-Fashioned Rolled", "containers", "Pantry"),
  p("rice-pasta-grains", "Pasta", "Elbow Macaroni", "boxes", "Pantry"),
  p("rice-pasta-grains", "Pasta", "Penne", "boxes", "Pantry"),
  p("rice-pasta-grains", "Pasta", "Spaghetti", "boxes", "Pantry"),
  p("rice-pasta-grains", "Rice", "Brown", "bags", "Pantry"),
  p("rice-pasta-grains", "Rice", "Long-Grain White", "bags", "Pantry"),
  p("rice-pasta-grains", "Rice", "Jasmine", "bags", "Pantry"),
  p("sauces-condiments", "Barbecue Sauce", "Regular", "bottles", "Pantry", ["bbq sauce"]),
  p("sauces-condiments", "Ketchup", "Regular", "bottles", "Pantry"),
  p("sauces-condiments", "Mayonnaise", "Regular", "jars", "Refrigerator", ["mayo"]),
  p("sauces-condiments", "Mustard", "Yellow", "bottles", "Refrigerator"),
  p("sauces-condiments", "Pasta Sauce", "Marinara", "jars", "Pantry"),
  p("sauces-condiments", "Salad Dressing", "Ranch", "bottles", "Refrigerator"),
  p("sauces-condiments", "Salsa", "Red", "jars", "Refrigerator"),
  p("sauces-condiments", "Soy Sauce", "Lower Sodium", "bottles", "Pantry"),
  p("sauces-condiments", "Vinegar", "Apple Cider", "bottles", "Pantry"),
  p("sauces-condiments", "Vinegar", "White", "bottles", "Pantry"),
  p("sauces-condiments", "Flour", "All-Purpose", "bags", "Pantry"),
  p("sauces-condiments", "Baking Powder", "Regular", "containers", "Pantry"),
  p("sauces-condiments", "Baking Soda", "Regular", "boxes", "Pantry"),
  p("sauces-condiments", "Sugar & Sweeteners", "Granulated Sugar", "bags", "Pantry"),
  p("sauces-condiments", "Sugar & Sweeteners", "Brown Sugar", "bags", "Pantry"),
  p("sauces-condiments", "Yeast", "Active Dry", "packets", "Pantry"),
  p("sauces-condiments", "Salt", "Kosher", "containers", "Pantry"),
  p("sauces-condiments", "Pepper", "Ground Black", "containers", "Pantry"),

  // Frozen Foods
  p("frozen-foods", "Frozen Fruit", "Mixed Berries", "bags", "Freezer"),
  p("frozen-foods", "Frozen Fruit", "Strawberries", "bags", "Freezer"),
  p("frozen-foods", "Frozen Meat", "Ground Beef", "packages", "Freezer"),
  p("frozen-foods", "Frozen Poultry", "Chicken Breasts", "packages", "Freezer"),
  p("frozen-foods", "Frozen Potatoes", "French Fries", "bags", "Freezer"),
  p("frozen-foods", "Frozen Potatoes", "Hash Browns", "bags", "Freezer"),
  p("frozen-foods", "Frozen Seafood", "Raw Shrimp", "bags", "Freezer"),
  p("frozen-foods", "Frozen Vegetables", "Broccoli Florets", "bags", "Freezer"),
  p("frozen-foods", "Frozen Vegetables", "Corn", "bags", "Freezer"),
  p("frozen-foods", "Frozen Vegetables", "Green Beans", "bags", "Freezer"),
  p("frozen-foods", "Frozen Vegetables", "Mixed Vegetables", "bags", "Freezer"),
  p("frozen-foods", "Frozen Vegetables", "Peas", "bags", "Freezer"),
  p("frozen-foods", "Frozen Pizza", "Regular", "each", "Freezer"),
  p("frozen-foods", "Ice Cream & Frozen Treats", "Ice Cream", "containers", "Freezer"),
]);

export const BASE_KITCHEN_CATEGORIES = Object.freeze([
  ["meat-seafood", "Meat/Seafood"], ["dairy-eggs", "Dairy/Eggs"], ["breads", "Breads"],
  ["produce", "Fresh Produce"], ["deli", "Deli"], ["pantry-canned", "Pantry/Canned"],
  ["grains-pasta", "Grains/Pasta"], ["cereal-breakfast", "Cereal/Breakfast"],
  ["condiments", "Condiments"], ["chips-snacks", "Chips/Snacks"], ["frozen-foods", "Frozen Foods"],
  ["beverages", "Beverages"], ["household-cleaning", "Household/Cleaning"], ["pet-care", "Pet Care"],
].map(([id, title]) => Object.freeze({ id, title })));

const DISPLAY_CATEGORY = {
  "meat-poultry": "meat-seafood", seafood: "meat-seafood", "dairy-eggs": "dairy-eggs",
  "bread-bakery": "breads", vegetables: "produce", fruit: "produce", "canned-jarred": "pantry-canned",
  "rice-pasta-grains": "grains-pasta", "sauces-condiments": "condiments", "frozen-foods": "frozen-foods",
  beverages: "beverages", "prepared-packaged": "chips-snacks",
};

// Compact source rows keep the shipped catalog reviewable while expanding into
// distinct, practical products. Format: Family|comma-separated varieties|unit|location.
const EXPANSION_GROUPS = {
  "meat-seafood": [
    "Beef|Filet Mignon,Flank Steak,Flat Iron Steak,New York Strip,Short Ribs,Top Round Roast,Bottom Round Roast,Cubed Steak,Ground 85/15,Ground 90/10|lb|Refrigerator",
    "Chicken|Bone-In Breasts,Split Breasts,Leg Quarters,Thin-Sliced Breasts,Ground,Whole Fryer|lb|Refrigerator",
    "Pork|Country-Style Ribs,Loin Roast,Spareribs,Ground,Sirloin Chops,Center-Cut Chops|lb|Refrigerator",
    "Seafood|Fish - Cod Fillets,Fish - Haddock Fillets,Fish - Halibut Fillets,Fish - Mahi-Mahi Fillets,Fish - Red Snapper Fillets,Fish - Trout Fillets,Fish - Catfish Fillets,Fish - Tilapia Fillets|lb|Refrigerator",
    "Seafood|Shellfish - Clams,Crab - Legs,Shellfish - Crawfish,Shellfish - Lobster Tails,Shellfish - Mussels,Shellfish - Oysters,Scallops - Fresh|lb|Refrigerator",
    "Sausage|Andouille,Bratwurst,Chorizo,Italian Hot,Italian Mild,Polish,Smoked,Turkey|packages|Refrigerator",
    "Turkey|Cutlets,Drumsticks,Ground 85/15,Ground 93/7,Thighs,Wings|lb|Refrigerator",
  ],
  "dairy-eggs": [
    "Cheese|Crumbled Blue,Crumbled Feta,Fresh Mozzarella,Shredded Colby Jack,Shredded Monterey Jack,Sliced Cheddar,Sliced Pepper Jack,Whole-Milk Ricotta,Part-Skim Ricotta|packages|Refrigerator",
    "Milk|1%,2%,Chocolate,Evaporated,Lactose-Free Whole,Skim,Whole|cartons|Refrigerator",
    "Yogurt|Greek Strawberry,Greek Vanilla,Plain Whole-Milk,Plain Low-Fat,Vanilla,Strawberry|containers|Refrigerator",
    "Eggs|Large,Extra Large,Jumbo,Brown Large,Pasture-Raised Large|dozen|Refrigerator",
    "Cream|Heavy Whipping,Light,Table,Whipping|cartons|Refrigerator",
    "Butter|Margarine,Salted,Unsalted,European-Style,Spreadable|packages|Refrigerator",
    "Dairy|Cottage Cheese,Half-And-Half,Sour Cream,Whipped Cream,Buttermilk,Kefir|containers|Refrigerator",
  ],
  breads: [
    "Bread|Bagels,English Muffins,White Sandwich,Whole Wheat,Multigrain,Sourdough,Rye,Italian,French,Texas Toast,Cinnamon Raisin,Low-Carb,Gluten-Free|loaves|Pantry",
    "Rolls|Dinner,Hawaiian,Slider,Hoagie,Kaiser,Ciabatta|packages|Pantry",
    "Buns|Hamburger,Brioche Hamburger,Hot Dog,Brioche Hot Dog|packages|Pantry",
    "Bakery|Croissants,Biscuits,Cornbread,Muffins,Pita,Flatbread,Naan|packages|Pantry",
    "Tortillas|Corn,Flour,Low-Carb Flour|packages|Pantry",
  ],
  produce: [
    "Apples|Fuji,Gala,Granny Smith,Honeycrisp,Red Delicious|each|Refrigerator",
    "Berries|Blackberries,Blueberries,Raspberries,Strawberries|containers|Refrigerator",
    "Citrus|Grapefruit,Lemons,Limes,Mandarins,Navel Oranges|each|Refrigerator",
    "Fruit|Bananas,Cherries,Grapes Green,Grapes Red,Kiwi,Mangoes,Nectarines,Peaches,Pears,Pineapple,Plums,Watermelon,Cantaloupe|each|Counter",
    "Greens|Arugula,Baby Spinach,Collard Greens,Kale,Romaine Hearts,Spring Mix|packages|Refrigerator",
    "Vegetables|Artichokes,Asparagus,Avocados,Beets,Broccoli,Brussels Sprouts,Cabbage,Carrots,Cauliflower,Celery,Corn,Cucumbers,Eggplant,Green Beans,Mushrooms,Okra,Radishes,Snap Peas,Zucchini|each|Refrigerator",
    "Peppers|Green Bell,Red Bell,Yellow Bell,Jalapeño,Poblano,Serrano|each|Refrigerator",
    "Potatoes|Gold,Red,Russet,Sweet|lb|Pantry",
    "Fresh Herbs|Basil,Cilantro,Dill,Mint,Parsley,Rosemary,Thyme|bunches|Refrigerator",
  ],
  deli: [
    "Deli Meat|Black Forest Ham,Honey Ham,Oven-Roasted Turkey,Smoked Turkey,Roast Beef,Chicken Breast,Bologna,Salami,Pastrami,Prosciutto,Capicola,Pepperoni|packages|Refrigerator",
    "Deli Cheese|American,Cheddar,Provolone,Swiss,Pepper Jack|packages|Refrigerator",
    "Deli Salad|Chicken,Egg,Macaroni,Pasta,Potato,Tuna,Coleslaw|containers|Refrigerator",
    "Prepared Deli|Hummus,Guacamole,Pimento Cheese,Rotisserie Chicken,Fresh Salsa,Olives|containers|Refrigerator",
  ],
  "pantry-canned": [
    "Beans|Black,Cannellini,Charro,Garbanzo,Kidney,Navy,Pinto,Refried,Red|cans|Pantry",
    "Broth|Beef,Beef Low Sodium,Chicken,Chicken Low Sodium,Vegetable,Vegetable Low Sodium|cartons|Pantry",
    "Tomato|Crushed,Diced,Diced No Salt Added,Fire-Roasted Diced,Stewed,Whole Peeled|cans|Pantry",
    "Soup|Cream Of Celery,Cream Of Chicken,Cream Of Mushroom,Tomato,Chicken Noodle,Vegetable|cans|Pantry",
    "Canned Vegetables|Carrots,Corn,Green Beans,Peas,Potatoes,Spinach,Mushrooms|cans|Pantry",
    "Canned Fruit|Applesauce,Fruit Cocktail,Mandarin Oranges,Peaches,Pears,Pineapple|cans|Pantry",
    "Canned Protein|Chicken,Roast Beef,Salmon,Tuna In Oil,Tuna In Water,Vienna Sausage|cans|Pantry",
    "Pantry Staple|Bread Crumbs,Cornmeal,Cornstarch,Flour All-Purpose,Flour Bread,Flour Self-Rising,Sugar Brown,Sugar Granulated,Sugar Powdered,Yeast Active Dry|bags|Pantry",
    "Baking|Cake Mix,Frosting,Brownie Mix,Chocolate Chips,Cocoa Powder,Vanilla Extract,Baking Powder,Baking Soda|boxes|Pantry",
  ],
  "grains-pasta": [
    "Rice|Arborio,Basmati,Brown,Jasmine,Long-Grain White,Wild Blend,Parboiled|bags|Pantry",
    "Pasta|Angel Hair,Elbow Macaroni,Fettuccine,Lasagna,Linguine,Penne,Rigatoni,Rotini,Shells,Spaghetti,Ziti|boxes|Pantry",
    "Grain|Barley,Bulgur,Couscous,Farro,Millet,Quinoa,Polenta|bags|Pantry",
    "Noodles|Egg,Ramen,Rice,Soba,Udon|packages|Pantry",
  ],
  "cereal-breakfast": [
    "Cereal|Bran Flakes,Corn Flakes,Crispy Rice,Frosted Flakes,Granola,Honey Oat Rings,Raisin Bran,Shredded Wheat|boxes|Pantry",
    "Oatmeal|Old-Fashioned,Quick,Steel-Cut,Instant Original,Instant Maple Brown Sugar|containers|Pantry",
    "Breakfast|Pancake Mix,Waffle Mix,Grits,Cream Of Wheat,Granola Bars,Protein Bars,Toaster Pastries|boxes|Pantry",
    "Syrup|Maple,Pancake,Sugar-Free|bottles|Pantry",
  ],
  condiments: [
    "Sauce|Barbecue,Buffalo,Hot,Marinara,Pizza,Steak,Teriyaki,Wing,Worcestershire,Enchilada Red,Enchilada Green|bottles|Pantry",
    "Dressing|Balsamic Vinaigrette,Blue Cheese,Caesar,Honey Mustard,Italian,Ranch,Thousand Island|bottles|Refrigerator",
    "Mustard|Dijon,Honey,Spicy Brown,Yellow|bottles|Refrigerator",
    "Mayonnaise|Regular,Light,Olive Oil|jars|Refrigerator",
    "Vinegar|Apple Cider,Balsamic,Red Wine,Rice,White,White Wine|bottles|Pantry",
    "Condiment|Ketchup,Pickle Relish,Dill Pickles,Sweet Pickles,Salsa Red,Salsa Verde,Soy Sauce,Tartar Sauce|jars|Refrigerator",
    "Spread|Almond Butter,Peanut Butter,Cookie Butter,Hazelnut Spread,Strawberry Jam,Grape Jelly,Orange Marmalade|jars|Pantry",
  ],
  "chips-snacks": [
    "Chips|Barbecue Potato,Corn Tortilla,Kettle Potato,Plain Potato,Ranch Tortilla,Salt And Vinegar|bags|Pantry",
    "Crackers|Butter,Cheese,Graham,Multigrain,Oyster,Saltine,Wheat|boxes|Pantry",
    "Nuts|Almonds,Cashews,Peanuts,Pecans,Pistachios,Walnuts,Mixed|containers|Pantry",
    "Snack|Beef Jerky,Cheese Puffs,Popcorn,Pretzels,Rice Cakes,Trail Mix,Fruit Snacks,Snack Mix|bags|Pantry",
    "Cookies|Chocolate Chip,Oatmeal,Rice Crispy,Sandwich,Shortbread|packages|Pantry",
  ],
  "frozen-foods": [
    "Frozen Vegetables|Broccoli,Cauliflower,Corn,Green Beans,Mixed Vegetables,Peas,Spinach,Stir-Fry Blend|bags|Freezer",
    "Frozen Fruit|Blueberries,Mango,Mixed Berries,Peaches,Pineapple,Strawberries|bags|Freezer",
    "Frozen Potatoes|Crinkle Fries,French Fries,Hash Browns,Tater Tots,Waffle Fries|bags|Freezer",
    "Frozen Meal|Burritos,Lasagna,Macaroni And Cheese,Pot Pie,Ravioli,Vegetable Stir-Fry|packages|Freezer",
    "Frozen Pizza|Pizza|packages|Freezer",
    "Frozen Breakfast|Biscuits,Breakfast Sandwiches,Pancakes,Sausage Patties,Waffles|packages|Freezer",
    "Frozen Dessert|Ice Cream,Fruit Bars,Sorbet,Cheesecake,Pie|containers|Freezer",
  ],
  beverages: [
    "Coffee|Ground Dark Roast,Ground Medium Roast,Ground Light Roast,Instant,Pods Dark Roast,Pods Medium Roast,Pods Decaf,Whole Bean Dark Roast,Whole Bean Medium Roast|containers|Pantry",
    "Tea|Black Bags,Green Bags,Herbal Bags,Sweet Bottled,Unsweet Bottled|boxes|Pantry",
    "Water|Bottled,Sparkling,Flavored,Distilled|cases|Pantry",
    "Juice|Apple,Cranberry,Grape,Orange,Pineapple,Tomato|bottles|Refrigerator",
    "Soft Drink|Cola,Diet Cola,Lemon-Lime,Root Beer,Ginger Ale|cases|Pantry",
    "Drink|Sports Drink,Energy Drink,Drink Mix,Hot Cocoa,Lemonade Mix|containers|Pantry",
  ],
  "household-cleaning": [
    "Paper Towels|Regular,Select-A-Size|rolls|Other",
    "Toilet Paper|Regular,Mega Roll|rolls|Other",
    "Trash Bags|Kitchen Tall,Lawn And Leaf,Small|boxes|Other",
    "Dish Care|Liquid Soap,Dishwasher Pods,Rinse Aid,Sponges,Scrub Pads|packages|Other",
    "Laundry|Liquid Detergent,Detergent Pods,Fabric Softener,Dryer Sheets,Stain Remover,Bleach|containers|Other",
    "Cleaner|All-Purpose,Bathroom,Glass,Floor,Disinfecting Spray,Disinfecting Wipes,Oven Cleaner|containers|Other",
    "Kitchen Supply|Aluminum Foil,Plastic Wrap,Parchment Paper,Food Storage Bags,Disposable Plates,Disposable Cups,Napkins|packages|Other",
  ],
  "pet-care": [
    "Dog Food|Dry,Wet,Refrigerated|bags|Other",
    "Dog Treats|Biscuits,Dental Chews,Training Treats|bags|Other",
    "Cat Food|Dry,Wet|bags|Other",
    "Cat Care|Litter,Deodorizer,Treats|bags|Other",
    "Pet Care|Waste Bags,Flea Treatment,Shampoo,Training Pads|packages|Other",
  ],
};

const INTERNAL_CATEGORY = {
  "meat-seafood": "meat-poultry", "dairy-eggs": "dairy-eggs", breads: "bread-bakery", produce: "vegetables",
  deli: "meat-poultry", "pantry-canned": "canned-jarred", "grains-pasta": "rice-pasta-grains",
  "cereal-breakfast": "rice-pasta-grains", condiments: "sauces-condiments", "chips-snacks": "prepared-packaged",
  "frozen-foods": "frozen-foods", beverages: "beverages", "household-cleaning": "prepared-packaged", "pet-care": "prepared-packaged",
};

const expansionProducts = Object.entries(EXPANSION_GROUPS).flatMap(([baseCategoryId, groups]) => groups.flatMap((row) => {
  const [family, varieties, unit, storage] = row.split("|");
  return varieties.split(",").map((variation) => p(INTERNAL_CATEGORY[baseCategoryId], family, variation, unit, storage));
})).map((item) => Object.freeze({ ...item, baseCategoryId: Object.entries(EXPANSION_GROUPS).find(([, groups]) => groups.some((row) => row.startsWith(`${item.family}|`) && row.split("|")[1].split(",").includes(item.variation)))?.[0] || DISPLAY_CATEGORY[item.categoryId] }));

const remappedLegacy = LEGACY_BASE_KITCHEN_PRODUCTS.map((item) => Object.freeze({ ...item,
  baseCategoryId: /Deli Meats/.test(item.family) ? "deli" : DISPLAY_CATEGORY[item.categoryId] || "pantry-canned",
}));

function normalizeBaseProduct(item) {
  const oldId = item.id;
  let baseCategoryId = item.baseCategoryId;
  let family = item.family;
  let variation = item.variation;
  let variantOptions = item.variantOptions;

  if (baseCategoryId === "dairy-eggs") {
    if (family === "Buttermilk") ({ family, variation } = { family: "Milk", variation: "Buttermilk" });
    else if (family === "Half-and-Half") ({ family, variation } = { family: "Milk", variation: "Half-and-Half" });
    else if (family === "Sour Cream") ({ family, variation } = { family: "Cream", variation: "Sour Cream" });
    else if (family === "Cottage Cheese") ({ family, variation } = { family: "Cheese", variation: "Cottage" });
    else if (family === "Dairy" && /cottage cheese/i.test(variation)) ({ family, variation } = { family: "Cheese", variation: "Cottage" });
    else if (family === "Dairy" && /half-and-half|buttermilk/i.test(variation)) ({ family, variation } = { family: "Milk", variation });
    else if (family === "Dairy" && /sour cream|whipped cream/i.test(variation)) ({ family, variation } = { family: "Cream", variation });
    else if (family === "Egg Substitutes") ({ family, variation } = { family: "Eggs", variation: "Liquid Egg Whites" });
    else if (family === "Plant-Based Milk") ({ family, variation } = { family: "Milk", variation: `Plant-Based - ${variation}` });
  }

  if (baseCategoryId === "breads") {
    if (["Bagels", "English Muffins", "Sandwich Bread"].includes(family)) {
      variation = family === "Sandwich Bread" ? variation : family;
      family = "Bread";
    } else if (family === "Hamburger Buns") ({ family, variation } = { family: "Buns", variation: "Hamburger" });
    else if (family === "Hot Dog Buns") ({ family, variation } = { family: "Buns", variation: "Hot Dog" });
  }

  if (baseCategoryId === "produce") {
    const fruitFamilies = ["Apples", "Apricots", "Bananas", "Blackberries", "Blueberries", "Cherries", "Cranberries", "Grapefruit", "Grapes", "Kiwi", "Lemons", "Limes", "Mangoes", "Melons", "Oranges", "Peaches", "Pears", "Pineapple", "Plums", "Raspberries", "Strawberries", "Berries", "Citrus", "Fruit"];
    const isFruit = fruitFamilies.includes(family);
    const kind = family === "Fruit" || family === "Vegetables" ? "" : family;
    const cleanVariation = /^(fresh|standard)$/i.test(variation) ? "" : variation;
    family = isFruit ? "Fruits" : "Vegetables";
    variation = [kind, cleanVariation].filter(Boolean).join(" - ") || (isFruit ? "Other Fruit" : "Other Vegetable");
  }

  if (baseCategoryId === "grains-pasta" && family === "Oats") {
    baseCategoryId = "cereal-breakfast";
    family = "Oatmeal";
    variation = variation.replace(/Old-Fashioned Rolled/i, "Old-Fashioned");
  }

  if (baseCategoryId === "condiments" && ["Baking Powder", "Baking Soda", "Flour", "Sugar & Sweeteners", "Yeast"].includes(family)) {
    baseCategoryId = "pantry-canned";
    variation = family === "Sugar & Sweeteners" ? variation : [family, variation].filter((value) => value && value !== "Regular").join(" - ");
    family = "Baking";
  } else if (baseCategoryId === "condiments" && ["Salt", "Pepper"].includes(family)) {
    baseCategoryId = "pantry-canned";
    variation = `${family} - ${variation}`;
    family = "Staples";
  } else if (baseCategoryId === "condiments" && /jam|jelly|marmalade|preserves/i.test(`${family} ${variation}`)) {
    baseCategoryId = "cereal-breakfast";
    family = "Jams/Jellies";
  } else if (baseCategoryId === "condiments") {
    if (family === "Pasta Sauce") family = "Pasta";
    else if (family === "Salad Dressing" || family === "Dressing") family = "Salad Dressing";
    else if (family === "Barbecue Sauce" || family === "Soy Sauce") family = "Sauce";
    else if (["Ketchup", "Mayonnaise", "Spread"].includes(family)) family = "Condiment";
  }

  if (baseCategoryId === "pantry-canned") {
    if (family === "Broth & Stock") family = "Broth";
    else if (family === "Refried Beans") ({ family, variation } = { family: "Beans", variation: "Refried" });
    else if (["Condensed Soups", "Prepared Soups"].includes(family)) family = "Soup";
    else if (["Canned Tomatoes", "Tomatoes", "Tomato Paste", "Tomato Sauce"].includes(family)) {
      variation = family === "Tomato Paste" ? "Paste" : family === "Tomato Sauce" ? "Sauce" : variation;
      family = "Tomato";
    } else if (family === "Canned Fruit") family = "Fruit";
    else if (family === "Canned Vegetables") family = "Vegetables";
    else if (family === "Canned Poultry") family = "Poultry";
    else if (family === "Canned Seafood") family = "Seafood";
    else if (family === "Canned Meat") family = "Meats";
    else if (family === "Pantry Staple") family = "Staples";
    else if (family === "Canned Protein") {
      if (/chicken|turkey/i.test(variation)) family = "Poultry";
      else if (/salmon|tuna|shrimp|crab/i.test(variation)) family = "Seafood";
      else family = "Meats";
    }
    if (family === "Staples" && /flour|sugar|yeast|cornstarch|cornmeal/i.test(variation)) family = "Baking";
    if (family === "Baking" && variation === "Cake Mix") variantOptions = ["Chocolate", "White", "Yellow", "German Chocolate", "Spice", "Devil's Food"];
    if (family === "Baking" && variation === "Frosting") variantOptions = ["Chocolate", "White", "Cream Cheese", "German Chocolate", "Vanilla"];
  }

  if (baseCategoryId === "frozen-foods") {
    if (family === "Ice Cream & Frozen Treats") family = "Frozen Dessert";
    if (family === "Frozen Desserts") family = "Frozen Dessert";
    if (family === "Frozen Pizza") {
      family = "Pizza";
      variation = "Select Type";
      variantOptions = ["Thin - Cheese", "Thin - Pepperoni", "Rising Crust - Cheese", "Rising Crust - Pepperoni", "Hand-Tossed - Cheese", "Hand-Tossed - Pepperoni"];
    }
    if (family === "Frozen Breakfast") family = "Breakfast";
    else if (family === "Frozen Bread & Dough") family = "Breads";
    else if (family === "Frozen Fruit") family = "Fruit";
    else if (family === "Frozen Meal" || family === "Frozen Dinners") family = "Meals";
    else if (family === "Frozen Potatoes") family = "Potatoes";
    else if (family === "Frozen Vegetables") family = "Vegetables";
    if (["Frozen Meat", "Frozen Poultry", "Frozen Protein", "Frozen Seafood"].includes(family)) {
      baseCategoryId = "meat-seafood";
      if (/ground beef/i.test(variation)) ({ family, variation } = { family: "Beef", variation: "Ground 90/10 - Frozen" });
      else if (/beef|meatballs?/i.test(variation)) ({ family, variation } = { family: "Beef", variation: `${variation} - Frozen` });
      else if (/chicken/i.test(variation)) ({ family, variation } = { family: "Chicken", variation: `${variation.replace(/Chicken\s*/i, "")} - Frozen` });
      else if (/turkey/i.test(variation)) ({ family, variation } = { family: "Turkey", variation: `${variation.replace(/Turkey\s*/i, "")} - Frozen` });
      else ({ family, variation } = { family: "Seafood", variation: `${variation} - Frozen` });
    }
  }

  if (baseCategoryId === "meat-seafood" && family === "Bacon") ({ family, variation } = { family: "Pork", variation: `Bacon - ${variation}` });
  else if (family === "Ground Beef") ({ family, variation } = { family: "Beef", variation: `Ground ${variation}` });
  else if (family === "Ground Chicken") ({ family, variation } = { family: "Chicken", variation: `Ground ${variation}` });
  else if (family === "Ground Pork") ({ family, variation } = { family: "Pork", variation: `Ground - ${variation}` });
  else if (family === "Ground Turkey") ({ family, variation } = { family: "Turkey", variation: `Ground - ${variation}` });
  else if (family === "Meatballs") ({ family, variation } = { family: "Beef", variation: `Meatballs - ${variation}` });
  else if (family === "Ham") ({ family, variation } = { family: "Pork", variation: `Ham - ${variation}` });
  else if (family === "Hot Dogs & Bratwurst") {
    if (/hot dogs?/i.test(variation)) ({ family, variation } = { family: "Hot Dogs", variation: variation.replace(/\s*hot dogs?\s*/i, "").trim() || "Regular" });
    else ({ family, variation } = { family: "Sausage", variation });
  }
  else if (family === "Sausages") family = "Sausage";
  else if (["Fish", "Salmon", "Tuna", "Shrimp", "Crab", "Scallops"].includes(family)) {
    variation = `${family} - ${variation}`;
    family = "Seafood";
  }

  if (family === "Chicken" && variation === "Ground") variation = "Ground Lean";
  if (family === "Pork" && variation === "Ground") variation = "Ground - Regular";

  if (baseCategoryId === "cereal-breakfast") {
    if (family === "Breakfast") {
      if (/grits|cream of wheat/i.test(variation)) family = "Hot Cereals";
      else if (/mix/i.test(variation)) family = "Mixes";
      else if (/bars?/i.test(variation)) family = "Bars";
      else family = "Cereal";
    }
    if (family === "Syrup") family = "Syrups";
  }

  if (baseCategoryId === "deli" && family === "Prepared Deli") family = "Deli Prepared";

  return Object.freeze({
    ...item,
    baseCategoryId,
    family,
    variation,
    ...(variantOptions ? { variantOptions: Object.freeze(variantOptions) } : {}),
    aliases: Object.freeze([...new Set([...(item.aliases || []), oldId].filter(Boolean))]),
  });
}

const uniqueProducts = new Map();
[...remappedLegacy, ...expansionProducts].map(normalizeBaseProduct).forEach((item) => {
  const baseCategoryId = item.baseCategoryId || DISPLAY_CATEGORY[item.categoryId];
  const key = `${baseCategoryId}|${item.family}|${item.variation}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const commonAliases = [
    /Dog Food.*Dry/i.test(`${item.family} ${item.variation}`) && "dog kibble",
    /Broth.*Chicken/i.test(`${item.family} ${item.variation}`) && "chicken stock",
    /Cheese.*Grated Parmesan/i.test(`${item.family} ${item.variation}`) && "parmesan cheese",
    /Coffee.*Pods/i.test(`${item.family} ${item.variation}`) && "k-cups",
    /^Mayonnaise/i.test(item.family) && "mayo",
  ].filter(Boolean);
  if (!uniqueProducts.has(key)) uniqueProducts.set(key, Object.freeze({ ...item, baseCategoryId,
    id: `base-${baseCategoryId}-${item.family}-${item.variation}`.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    aliases: Object.freeze([...new Set([...(item.aliases || []), ...commonAliases])]),
  }));
});

const CATEGORY_TARGETS = { "meat-seafood": 100, "dairy-eggs": 55, breads: 40, produce: 110, deli: 30,
  "pantry-canned": 75, "grains-pasta": 35, "cereal-breakfast": 30, condiments: 50, "chips-snacks": 35,
  "frozen-foods": 50, beverages: 35, "household-cleaning": 35, "pet-care": 20 };
export const BASE_KITCHEN_PRODUCTS = Object.freeze(BASE_KITCHEN_CATEGORIES.flatMap((category) =>
  [...uniqueProducts.values()]
    .filter((item) => item.baseCategoryId === category.id)
    .slice(0, CATEGORY_TARGETS[category.id])
    .sort((a, b) => `${a.family}|${a.variation}`.localeCompare(`${b.family}|${b.variation}`, undefined, { sensitivity: "base" }))
));

export function baseProductName(product) {
  if (!product?.variation) return product?.family || "";
  if (product.baseCategoryId === "produce") return `${product.family} - ${product.variation}`;
  if (product.baseCategoryId === "pantry-canned" && product.family === "Tomato") return `Tomatoes - ${product.variation}`;
  if (product.baseCategoryId === "frozen-foods" && product.family === "Pizza") return "Frozen Pizza";
  return product.baseCategoryId === "meat-seafood"
    ? `${product.family} - ${product.variation}`
    : `${product.family} — ${product.variation}`;
}
