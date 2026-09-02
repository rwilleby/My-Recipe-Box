export const MASTER_KITCHEN_INVENTORY_TAXONOMY = Object.freeze([
  { id: "meat-poultry", title: "Meat & Poultry", products: [
    "Bacon", "Beef", "Ground Beef", "Chicken", "Ground Chicken", "Corned Beef", "Duck", "Ham", "Lamb", "Ground Lamb", "Pork", "Ground Pork", "Sausages", "Smoking Meats", "Turkey", "Ground Turkey", "Deli Meats", "Hot Dogs & Bratwurst", "Meatballs", "Specialty & Game Meats",
  ] },
  { id: "seafood", title: "Seafood", products: [
    "Fish", "Salmon", "Tuna", "Shrimp", "Crab", "Lobster", "Crawfish", "Scallops", "Clams", "Mussels", "Oysters", "Calamari", "Smoked Seafood", "Imitation Seafood", "Other Shellfish",
  ] },
  { id: "vegetables", title: "Vegetables", products: [
    "Artichokes", "Asparagus", "Avocados", "Beans", "Beets", "Broccoli", "Brussels Sprouts", "Cabbage", "Carrots", "Cauliflower", "Celery", "Corn", "Cucumbers", "Eggplant", "Garlic", "Leafy Greens", "Lettuce", "Mushrooms", "Okra", "Onions", "Peas", "Peppers", "Potatoes", "Radishes", "Squash", "Sweet Potatoes", "Tomatoes", "Zucchini", "Fresh Herbs", "Mixed Vegetables", "Other Vegetables",
  ] },
  { id: "fruit", title: "Fruits", products: [
    "Apples", "Apricots", "Bananas", "Blackberries", "Blueberries", "Cherries", "Cranberries", "Grapefruit", "Grapes", "Kiwi", "Lemons", "Limes", "Mangoes", "Melons", "Oranges", "Peaches", "Pears", "Pineapple", "Plums", "Raspberries", "Strawberries", "Tropical Fruit", "Dried Fruit", "Mixed Fruit", "Other Fruit",
  ] },
  { id: "dairy-eggs", title: "Dairy & Eggs", products: [
    "Butter", "Buttermilk", "Cheese", "Cottage Cheese", "Cream", "Cream Cheese", "Eggs", "Egg Substitutes", "Half-and-Half", "Milk", "Plant-Based Milk", "Sour Cream", "Whipped Toppings", "Yogurt", "Refrigerated Dough", "Other Dairy Products",
  ] },
  { id: "bread-bakery", title: "Bread & Bakery", products: [
    "Bagels", "Biscuits", "Buns & Rolls", "Cornbread", "Croissants", "English Muffins", "Flatbreads", "French Bread", "Garlic Bread", "Hamburger Buns", "Hot Dog Buns", "Muffins", "Pita Bread", "Sandwich Bread", "Specialty Bread", "Tortillas", "Wraps", "Bakery Desserts", "Breadcrumbs", "Croutons",
  ] },
  { id: "rice-pasta-grains", title: "Rice, Pasta & Grains", products: [
    "Rice", "Pasta", "Noodles", "Macaroni & Cheese", "Couscous", "Quinoa", "Barley", "Bulgur", "Farro", "Oats", "Grits", "Cornmeal", "Polenta", "Cereal", "Granola", "Grain Blends", "Other Grains",
  ] },
  { id: "beverages", title: "Beverages", products: [
    "Coffee", "Tea", "Cocoa", "Drink Mixes", "Other Beverages",
  ] },
  { id: "canned-jarred", title: "Canned & Jarred Foods", products: [
    "Beans", "Broth & Stock", "Canned Fruit", "Canned Meat", "Canned Poultry", "Canned Seafood", "Canned Tomatoes", "Canned Vegetables", "Chili", "Condensed Soups", "Pasta Meals", "Pie Filling", "Pizza Sauce", "Prepared Soups", "Refried Beans", "Roasted Peppers", "Sauerkraut", "Tomato Paste", "Tomato Sauce", "Jarred Specialty Foods",
  ] },
  { id: "sauces-condiments", title: "Sauces, Condiments & Baking", groups: {
    Sauces: ["Barbecue Sauce", "Hot Sauce", "Pasta Sauce", "Pizza Sauce", "Steak Sauce", "Stir-Fry Sauce", "Taco & Enchilada Sauce", "Teriyaki Sauce", "Wing Sauce", "Worcestershire Sauce", "Cooking Sauces"],
    Condiments: ["Ketchup", "Mayonnaise", "Mustard", "Pickles", "Relish", "Salad Dressing", "Salsa", "Soy Sauce", "Vinegar", "Dips & Spreads", "Jams, Jellies & Preserves", "Nut Butters", "Syrups"],
    Baking: ["Baking Chocolate", "Baking Powder", "Baking Soda", "Cake & Brownie Mixes", "Chocolate Chips", "Cocoa Powder", "Cornstarch", "Flour", "Frosting", "Gelatin & Pudding Mixes", "Molasses", "Nuts", "Shortening", "Sugar & Sweeteners", "Vanilla & Extracts", "Yeast", "Baking Decorations"],
    Seasonings: ["Salt", "Pepper", "Herbs", "Spices", "Seasoning Blends", "Rubs", "Marinades", "Gravy Mixes", "Sauce Mixes"],
  } },
  { id: "frozen-foods", title: "Frozen Foods", products: [
    "Frozen Bread & Dough", "Frozen Breakfast Foods", "Frozen Desserts", "Frozen Dinners", "Frozen Fruit", "Frozen Meat", "Frozen Pasta", "Frozen Pizza", "Frozen Poultry", "Frozen Potatoes", "Frozen Seafood", "Frozen Side Dishes", "Frozen Snacks & Appetizers", "Frozen Vegetables", "Ice Cream & Frozen Treats",
  ] },
  { id: "prepared-packaged", title: "Prepared & Packaged Foods", products: [
    "Breakfast Foods", "Boxed Meals", "Chips & Crackers", "Deli Salads", "Dips & Spreads", "Meal Kits", "Packaged Side Dishes", "Prepared Entrées", "Prepared Sandwiches & Wraps", "Protein & Snack Bars", "Ready-to-Eat Meals", "Refrigerated Pasta", "Refrigerated Side Dishes", "Snack Foods", "Soup & Meal Mixes", "Stuffing Mixes", "Instant Potatoes", "Shelf-Stable Meals", "Other Packaged Foods",
  ] },
].map((category) => Object.freeze({
  ...category,
  products: Object.freeze(category.products || Object.values(category.groups || {}).flat()),
  groups: category.groups ? Object.freeze(category.groups) : undefined,
})));

export const MASTER_INVENTORY_CATEGORIES = Object.freeze(MASTER_KITCHEN_INVENTORY_TAXONOMY.map(({ id, title }) => ({ id, title })));

const PRODUCT_RULES = [
  ["beverages", "Coffee", /\b(coffee|coffee pods?|k-?cups?)\b/i],
  ["beverages", "Tea", /\btea\b/i],
  ["beverages", "Cocoa", /\b(hot cocoa|drinking chocolate)\b/i],
  ["beverages", "Drink Mixes", /\b(drink|beverage) mix\b/i],
  ["prepared-packaged", "Instant Potatoes", /\binstant (mashed )?potatoes\b/i],
  ["prepared-packaged", "Refrigerated Pasta", /\brefrigerated (pasta|ravioli|tortellini)\b/i],
  ["prepared-packaged", "Refrigerated Side Dishes", /\brefrigerated (side|mashed potatoes|macaroni|pasta salad)\b/i],
  ["bread-bakery", "Hot Dog Buns", /\bhot dog buns?\b/i],
  ["bread-bakery", "Hamburger Buns", /\bhamburger buns?\b/i],
  ["bread-bakery", "Tortillas", /\b(corn|flour|low-carb)? ?tortillas?\b/i],
  ["bread-bakery", "Wraps", /\b(corn|flour|low-carb)? ?wraps?\b/i],
  ["frozen-foods", "Ice Cream & Frozen Treats", /\b(ice cream|frozen yogurt|popsicles?|ice pops?|sherbet|sorbet)\b/i],
  ["frozen-foods", "Frozen Pizza", /\bfrozen pizza\b/i],
  ["frozen-foods", "Frozen Potatoes", /\bfrozen (diced |shredded |sliced |mashed )?(hash browns?|fries|french fries|potatoes|tater tots?)\b/i],
  ["frozen-foods", "Frozen Seafood", /\bfrozen (fish|salmon|tuna|shrimp|crab|lobster|crawfish|scallops?|clams?|mussels?|oysters?|calamari|seafood)\b/i],
  ["frozen-foods", "Frozen Poultry", /\bfrozen (chicken|turkey|duck|poultry)\b/i],
  ["frozen-foods", "Frozen Meat", /\bfrozen (beef|pork|ham|bacon|sausage|meatballs?|meat)\b/i],
  ["frozen-foods", "Frozen Fruit", /\bfrozen (fruit|berries|strawberries|blueberries|blackberries|raspberries|peaches|mango|pineapple|cherries)\b/i],
  ["frozen-foods", "Frozen Vegetables", /\bfrozen (vegetables?|broccoli|cauliflower|corn|peas|beans|spinach|okra|carrots|mixed vegetables)\b/i],
  ["frozen-foods", "Frozen Bread & Dough", /\bfrozen (bread|rolls?|biscuits?|dough|pie crusts?)\b/i],
  ["frozen-foods", "Frozen Breakfast Foods", /\bfrozen (waffles?|pancakes?|breakfast|biscuits and gravy)\b/i],
  ["frozen-foods", "Frozen Pasta", /\bfrozen (pasta|ravioli|lasagna|tortellini)\b/i],
  ["frozen-foods", "Frozen Desserts", /\bfrozen (dessert|pie|cake|cheesecake)\b/i],
  ["frozen-foods", "Frozen Side Dishes", /\bfrozen (side dish|macaroni|mashed potatoes|casserole)\b/i],
  ["frozen-foods", "Frozen Snacks & Appetizers", /\bfrozen (snacks?|appetizers?|egg rolls?|pizza rolls?|mozzarella sticks?)\b/i],
  ["frozen-foods", "Frozen Dinners", /\bfrozen (dinners?|meals?|entr[eé]es?)\b/i],

  ["canned-jarred", "Tomato Paste", /\btomato paste\b/i],
  ["canned-jarred", "Tomato Sauce", /\b(canned )?tomato sauce\b/i],
  ["canned-jarred", "Canned Tomatoes", /\b(canned|can of) (diced |crushed |whole |stewed )?tomatoes?\b/i],
  ["canned-jarred", "Refried Beans", /\brefried beans?\b/i],
  ["canned-jarred", "Beans", /\b(canned|can of) (black|pinto|kidney|navy|white|chili|garbanzo|cannellini)? ?beans?\b/i],
  ["canned-jarred", "Canned Seafood", /\b(canned|can of|pouch of) (tuna|salmon|crab|shrimp|seafood)\b/i],
  ["canned-jarred", "Canned Poultry", /\b(canned|can of) (chicken|turkey|poultry)\b/i],
  ["canned-jarred", "Canned Meat", /\b(canned|can of) (beef|ham|pork|meat)\b/i],
  ["canned-jarred", "Canned Fruit", /\b(canned|can of) (fruit|peaches|pears|pineapple|cherries|oranges|apples)\b/i],
  ["canned-jarred", "Canned Vegetables", /\b(canned|can of) (vegetables?|corn|peas|green beans|carrots|potatoes|spinach|mushrooms)\b/i],
  ["canned-jarred", "Broth & Stock", /\b(broth|stock|bouillon)\b/i],
  ["canned-jarred", "Condensed Soups", /\bcondensed (cream of |tomato |cheddar )?soup\b|\bcream of (chicken|mushroom|celery) soup\b/i],
  ["canned-jarred", "Prepared Soups", /\b(canned|jarred|prepared) soup\b/i],
  ["canned-jarred", "Chili", /\b(canned|prepared) chili\b/i],
  ["canned-jarred", "Pasta Meals", /\b(canned|prepared) (pasta|ravioli|spaghetti)\b/i],
  ["canned-jarred", "Pie Filling", /\bpie filling\b/i],
  ["canned-jarred", "Pizza Sauce", /\b(canned|jarred) pizza sauce\b/i],
  ["canned-jarred", "Roasted Peppers", /\b(roasted|jarred) peppers?\b/i],
  ["canned-jarred", "Sauerkraut", /\bsauerkraut\b/i],
  ["canned-jarred", "Jarred Specialty Foods", /\b(jarred|in a jar)\b/i],

  ["meat-poultry", "Hot Dogs & Bratwurst", /\b(hot dogs?|bratwurst|brats)\b/i],
  ["meat-poultry", "Deli Meats", /\b(deli|lunch meat|salami|capicola|pepperoni|prosciutto|bologna|pastrami)\b/i],
  ["meat-poultry", "Meatballs", /\bmeatballs?\b/i],
  ["meat-poultry", "Corned Beef", /\bcorned beef\b/i],
  ["meat-poultry", "Ground Beef", /\bground beef\b/i],
  ["meat-poultry", "Ground Chicken", /\bground chicken\b/i],
  ["meat-poultry", "Ground Lamb", /\bground lamb\b/i],
  ["meat-poultry", "Ground Pork", /\bground pork\b/i],
  ["meat-poultry", "Ground Turkey", /\bground turkey\b/i],
  ["meat-poultry", "Smoking Meats", /\b(brisket|pork butt|boston butt|baby back ribs?|beef ribs?|pork ribs?|pulled pork|smoking meat)\b/i],
  ["meat-poultry", "Bacon", /\bbacon\b/i],
  ["meat-poultry", "Chicken", /\b(chicken|poultry)\b/i],
  ["meat-poultry", "Duck", /\bduck\b/i],
  ["meat-poultry", "Ham", /\bham\b/i],
  ["meat-poultry", "Lamb", /\blamb\b/i],
  ["meat-poultry", "Pork", /\bpork\b/i],
  ["meat-poultry", "Sausages", /\b(sausages?|kielbasa|chorizo)\b/i],
  ["meat-poultry", "Turkey", /\bturkey\b/i],
  ["meat-poultry", "Beef", /\b(beef|steaks?|roast|stew meat|beef tips?)\b/i],
  ["meat-poultry", "Specialty & Game Meats", /\b(venison|bison|buffalo|rabbit|goat|elk|game meat)\b/i],

  ["seafood", "Smoked Seafood", /\bsmoked (fish|salmon|trout|seafood|oysters?)\b/i],
  ["seafood", "Imitation Seafood", /\bimitation (crab|lobster|seafood)\b/i],
  ["seafood", "Salmon", /\bsalmon\b/i], ["seafood", "Tuna", /\btuna\b/i], ["seafood", "Shrimp", /\bshrimp\b/i],
  ["seafood", "Crab", /\bcrab(meat)?\b/i], ["seafood", "Lobster", /\blobster\b/i], ["seafood", "Crawfish", /\b(crawfish|crayfish)\b/i],
  ["seafood", "Scallops", /\bscallops?\b/i], ["seafood", "Clams", /\bclams?\b/i], ["seafood", "Mussels", /\bmussels?\b/i],
  ["seafood", "Oysters", /\boysters?\b/i], ["seafood", "Calamari", /\b(calamari|squid)\b/i],
  ["seafood", "Other Shellfish", /\b(shellfish|prawns?)\b/i],
  ["seafood", "Fish", /\b(fish|catfish|tilapia|cod|haddock|trout|halibut|mahi|flounder|snapper|bass)\b/i],

  ["fruit", "Dried Fruit", /\b(dried fruit|raisins?|dates?|prunes?)\b/i], ["fruit", "Mixed Fruit", /\b(mixed fruit|fruit cocktail)\b/i],
  ["fruit", "Apples", /\bapples?\b/i], ["fruit", "Apricots", /\bapricots?\b/i], ["fruit", "Bananas", /\bbananas?\b/i],
  ["fruit", "Blackberries", /\bblackberries?\b/i], ["fruit", "Blueberries", /\bblueberries?\b/i], ["fruit", "Cherries", /\bcherries\b/i],
  ["fruit", "Cranberries", /\bcranberries\b/i], ["fruit", "Grapefruit", /\bgrapefruits?\b/i], ["fruit", "Grapes", /\bgrapes?\b/i],
  ["fruit", "Kiwi", /\bkiwi\b/i], ["fruit", "Lemons", /\blemons?\b/i], ["fruit", "Limes", /\blimes?\b/i], ["fruit", "Mangoes", /\bmango(es)?\b/i],
  ["fruit", "Melons", /\b(melon|watermelon|cantaloupe|honeydew)\b/i], ["fruit", "Oranges", /\boranges?\b/i], ["fruit", "Peaches", /\bpeaches\b/i],
  ["fruit", "Pears", /\bpears?\b/i], ["fruit", "Pineapple", /\bpineapple\b/i], ["fruit", "Plums", /\bplums?\b/i],
  ["fruit", "Raspberries", /\braspberries\b/i], ["fruit", "Strawberries", /\bstrawberries\b/i], ["fruit", "Tropical Fruit", /\b(papaya|guava|passion fruit|dragon fruit|coconut)\b/i],

  ["vegetables", "Sweet Potatoes", /\b(sweet potatoes?|yams?)\b/i], ["vegetables", "Fresh Herbs", /\b(fresh herbs?|cilantro|parsley|basil|rosemary|thyme|dill|chives|mint)\b/i],
  ["vegetables", "Leafy Greens", /\b(spinach|kale|collard greens?|mustard greens?|turnip greens?|leafy greens?)\b/i], ["vegetables", "Mixed Vegetables", /\bmixed vegetables?\b/i],
  ["vegetables", "Artichokes", /\bartichokes?\b/i], ["vegetables", "Asparagus", /\basparagus\b/i], ["vegetables", "Avocados", /\bavocados?\b/i],
  ["vegetables", "Beans", /\b(green beans?|wax beans?|fresh beans?)\b/i], ["vegetables", "Beets", /\bbeets?\b/i], ["vegetables", "Broccoli", /\bbroccoli\b/i],
  ["vegetables", "Brussels Sprouts", /\bbrussels? sprouts?\b/i], ["vegetables", "Cabbage", /\b(cabbage|coleslaw mix)\b/i], ["vegetables", "Carrots", /\bcarrots?\b/i],
  ["vegetables", "Cauliflower", /\bcauliflower\b/i], ["vegetables", "Celery", /\bcelery\b/i], ["vegetables", "Corn", /\bcorn\b/i],
  ["vegetables", "Cucumbers", /\bcucumbers?\b/i], ["vegetables", "Eggplant", /\beggplants?\b/i], ["vegetables", "Garlic", /\bgarlic\b/i],
  ["vegetables", "Lettuce", /\b(lettuce|romaine)\b/i], ["vegetables", "Mushrooms", /\bmushrooms?\b/i], ["vegetables", "Okra", /\bokra\b/i],
  ["vegetables", "Onions", /\b(onions?|shallots?|scallions?|green onions?)\b/i], ["vegetables", "Peas", /\bpeas?\b/i], ["vegetables", "Peppers", /\b(peppers?|jalape[nñ]os?|chiles?)\b/i],
  ["vegetables", "Potatoes", /\bpotatoes?\b/i], ["vegetables", "Radishes", /\bradishes\b/i], ["vegetables", "Squash", /\b(squash|pumpkin)\b/i],
  ["vegetables", "Tomatoes", /\btomatoes?\b/i], ["vegetables", "Zucchini", /\bzucchini\b/i],

  ["dairy-eggs", "Plant-Based Milk", /\b(almond|soy|oat|coconut|cashew) milk\b/i], ["dairy-eggs", "Buttermilk", /\bbuttermilk\b/i],
  ["dairy-eggs", "Cottage Cheese", /\bcottage cheese\b/i], ["dairy-eggs", "Cream Cheese", /\bcream cheese\b/i], ["dairy-eggs", "Half-and-Half", /\bhalf[- ]and[- ]half\b/i],
  ["dairy-eggs", "Egg Substitutes", /\b(egg substitute|liquid eggs?)\b/i], ["dairy-eggs", "Eggs", /\b(eggs?|egg whites?|egg yolks?)\b/i],
  ["dairy-eggs", "Whipped Toppings", /\b(whipped topping|cool whip|whipped cream)\b/i], ["dairy-eggs", "Sour Cream", /\bsour cream\b/i],
  ["dairy-eggs", "Yogurt", /\byogurt\b/i], ["dairy-eggs", "Butter", /\bbutter\b/i], ["dairy-eggs", "Cream", /\b(heavy cream|whipping cream|table cream|cream)\b/i],
  ["dairy-eggs", "Cheese", /\b(cheddar|mozzarella|parmesan|provolone|swiss|american cheese|feta|ricotta|cheese)\b/i], ["dairy-eggs", "Milk", /\bmilk\b/i],
  ["dairy-eggs", "Refrigerated Dough", /\b(refrigerated|crescent|cookie|biscuit|pizza) dough\b/i],

  ["bread-bakery", "Breadcrumbs", /\b(breadcrumbs?|bread crumbs?|panko)\b/i], ["bread-bakery", "Croutons", /\bcroutons?\b/i],
  ["bread-bakery", "Hamburger Buns", /\bhamburger buns?\b/i], ["bread-bakery", "Hot Dog Buns", /\bhot dog buns?\b/i], ["bread-bakery", "Buns & Rolls", /\b(buns?|dinner rolls?|slider rolls?)\b/i],
  ["bread-bakery", "Bagels", /\bbagels?\b/i], ["bread-bakery", "Biscuits", /\bbiscuits?\b/i], ["bread-bakery", "Cornbread", /\bcornbread\b/i],
  ["bread-bakery", "Croissants", /\bcroissants?\b/i], ["bread-bakery", "English Muffins", /\benglish muffins?\b/i], ["bread-bakery", "Flatbreads", /\bflatbreads?\b/i],
  ["bread-bakery", "French Bread", /\bfrench bread\b/i], ["bread-bakery", "Garlic Bread", /\bgarlic bread\b/i], ["bread-bakery", "Muffins", /\bmuffins?\b/i],
  ["bread-bakery", "Pita Bread", /\bpita\b/i], ["bread-bakery", "Sandwich Bread", /\b(sandwich bread|white bread|wheat bread|bread loaf|loaf of bread)\b/i],
  ["bread-bakery", "Tortillas", /\btortillas?\b/i], ["bread-bakery", "Wraps", /\bwraps?\b/i], ["bread-bakery", "Bakery Desserts", /\b(bakery cake|bakery pie|bakery dessert|donuts?)\b/i],

  ["rice-pasta-grains", "Macaroni & Cheese", /\b(mac(aroni)? and cheese|mac(aroni)? & cheese)\b/i], ["rice-pasta-grains", "Couscous", /\bcouscous\b/i],
  ["rice-pasta-grains", "Quinoa", /\bquinoa\b/i], ["rice-pasta-grains", "Barley", /\bbarley\b/i], ["rice-pasta-grains", "Bulgur", /\bbulgur\b/i], ["rice-pasta-grains", "Farro", /\bfarro\b/i],
  ["rice-pasta-grains", "Oats", /\b(oats?|oatmeal)\b/i], ["rice-pasta-grains", "Grits", /\bgrits?\b/i], ["rice-pasta-grains", "Cornmeal", /\bcornmeal\b/i], ["rice-pasta-grains", "Polenta", /\bpolenta\b/i],
  ["rice-pasta-grains", "Granola", /\bgranola\b/i], ["rice-pasta-grains", "Cereal", /\bcereal\b/i], ["rice-pasta-grains", "Noodles", /\b(noodles?|ramen)\b/i],
  ["rice-pasta-grains", "Pasta", /\b(pasta|spaghetti|macaroni|penne|rotini|lasagna|ravioli|tortellini|linguine|fettuccine)\b/i], ["rice-pasta-grains", "Rice", /\brice\b/i],
  ["rice-pasta-grains", "Grain Blends", /\bgrain blend\b/i],

  ["sauces-condiments", "Barbecue Sauce", /\b(barbecue|bbq) sauce\b/i], ["sauces-condiments", "Hot Sauce", /\bhot sauce\b/i],
  ["sauces-condiments", "Pizza Sauce", /\bpizza sauce\b/i], ["sauces-condiments", "Pasta Sauce", /\b(pasta|marinara|alfredo|spaghetti) sauce\b/i],
  ["sauces-condiments", "Steak Sauce", /\bsteak sauce\b/i], ["sauces-condiments", "Stir-Fry Sauce", /\bstir[- ]fry sauce\b/i],
  ["sauces-condiments", "Taco & Enchilada Sauce", /\b(taco|enchilada) sauce\b/i], ["sauces-condiments", "Teriyaki Sauce", /\bteriyaki sauce\b/i],
  ["sauces-condiments", "Wing Sauce", /\bwing sauce\b/i], ["sauces-condiments", "Worcestershire Sauce", /\bworcestershire\b/i],
  ["sauces-condiments", "Soy Sauce", /\bsoy sauce\b/i], ["sauces-condiments", "Salad Dressing", /\b(dressing|vinaigrette)\b/i], ["sauces-condiments", "Salsa", /\bsalsa\b/i],
  ["sauces-condiments", "Ketchup", /\bketchup\b/i], ["sauces-condiments", "Mayonnaise", /\b(mayonnaise|mayo)\b/i], ["sauces-condiments", "Mustard", /\bmustard\b/i],
  ["sauces-condiments", "Pickles", /\bpickles?\b/i], ["sauces-condiments", "Relish", /\brelish\b/i], ["sauces-condiments", "Vinegar", /\bvinegar\b/i],
  ["sauces-condiments", "Jams, Jellies & Preserves", /\b(jam|jelly|preserves|marmalade)\b/i], ["sauces-condiments", "Nut Butters", /\b(peanut|almond|cashew|nut) butter\b/i],
  ["sauces-condiments", "Syrups", /\b(maple|pancake|corn|simple) syrup\b/i], ["sauces-condiments", "Dips & Spreads", /\b(dip|spread|hummus)\b/i],
  ["sauces-condiments", "Baking Powder", /\bbaking powder\b/i], ["sauces-condiments", "Baking Soda", /\bbaking soda\b/i], ["sauces-condiments", "Baking Chocolate", /\bbaking chocolate\b/i],
  ["sauces-condiments", "Chocolate Chips", /\bchocolate chips?\b/i], ["sauces-condiments", "Cocoa Powder", /\bcocoa powder\b/i], ["sauces-condiments", "Cornstarch", /\bcornstarch\b/i],
  ["sauces-condiments", "Cake & Brownie Mixes", /\b(cake|brownie) mix\b/i], ["sauces-condiments", "Frosting", /\b(frosting|icing)\b/i],
  ["sauces-condiments", "Gelatin & Pudding Mixes", /\b(gelatin|jell-o|pudding mix)\b/i], ["sauces-condiments", "Molasses", /\bmolasses\b/i], ["sauces-condiments", "Nuts", /\b(pecans?|walnuts?|almonds?|peanuts?|cashews?|nuts?)\b/i],
  ["sauces-condiments", "Shortening", /\bshortening\b/i], ["sauces-condiments", "Sugar & Sweeteners", /\b(sugar|sweetener|stevia|splenda|honey)\b/i],
  ["sauces-condiments", "Vanilla & Extracts", /\b(vanilla|extract|flavoring)\b/i], ["sauces-condiments", "Yeast", /\byeast\b/i], ["sauces-condiments", "Flour", /\bflour\b/i],
  ["sauces-condiments", "Baking Decorations", /\b(sprinkles|decorating sugar|food coloring)\b/i], ["sauces-condiments", "Salt", /\bsalt\b/i],
  ["sauces-condiments", "Pepper", /\b(black|white|ground|cracked)? ?pepper\b/i], ["sauces-condiments", "Rubs", /\brub\b/i], ["sauces-condiments", "Marinades", /\bmarinade\b/i],
  ["sauces-condiments", "Gravy Mixes", /\bgravy (mix|packet)\b/i], ["sauces-condiments", "Sauce Mixes", /\bsauce (mix|packet)\b/i],
  ["sauces-condiments", "Seasoning Blends", /\b(seasoning|seasoned salt|taco seasoning|italian seasoning|seasoning blend)\b/i],
  ["sauces-condiments", "Herbs", /\b(dried herbs?|oregano|thyme|rosemary|basil|parsley|dill|sage)\b/i], ["sauces-condiments", "Spices", /\b(paprika|cumin|cinnamon|nutmeg|cloves|turmeric|cayenne|chili powder|spice)\b/i],

  ["prepared-packaged", "Stuffing Mixes", /\bstuffing (mix|box|package)\b/i], ["prepared-packaged", "Instant Potatoes", /\binstant (mashed )?potatoes\b/i],
  ["prepared-packaged", "Chips & Crackers", /\b(chips|crackers|pretzels)\b/i], ["prepared-packaged", "Protein & Snack Bars", /\b(protein|snack|granola) bars?\b/i],
  ["prepared-packaged", "Soup & Meal Mixes", /\b(soup|meal) mix\b/i], ["prepared-packaged", "Boxed Meals", /\bboxed (meal|dinner)\b/i],
  ["prepared-packaged", "Deli Salads", /\b(deli|prepared) (potato|pasta|chicken|tuna|egg) salad\b/i], ["prepared-packaged", "Meal Kits", /\bmeal kits?\b/i],
  ["prepared-packaged", "Prepared Sandwiches & Wraps", /\bprepared (sandwich|wrap)\b/i], ["prepared-packaged", "Refrigerated Pasta", /\brefrigerated (pasta|ravioli|tortellini)\b/i],
  ["prepared-packaged", "Refrigerated Side Dishes", /\brefrigerated (side|mashed potatoes|macaroni|pasta salad)\b/i], ["prepared-packaged", "Packaged Side Dishes", /\bpackaged (side|rice|pasta|potatoes)\b/i],
  ["prepared-packaged", "Breakfast Foods", /\b(breakfast food|pancake mix|waffle mix)\b/i], ["prepared-packaged", "Prepared Entrées", /\bprepared entr[eé]e\b/i],
  ["prepared-packaged", "Ready-to-Eat Meals", /\bready[- ]to[- ]eat (meal|dinner|entr[eé]e)\b/i], ["prepared-packaged", "Shelf-Stable Meals", /\bshelf[- ]stable (meal|dinner)\b/i],
  ["prepared-packaged", "Snack Foods", /\b(snack mix|popcorn|snacks?)\b/i],
];

const TAXONOMY_BY_ID = new Map(MASTER_KITCHEN_INVENTORY_TAXONOMY.map((category) => [category.id, category]));

export function taxonomyProductOrder(categoryId, productType) {
  const index = TAXONOMY_BY_ID.get(categoryId)?.products.indexOf(productType) ?? -1;
  return index < 0 ? Number.MAX_SAFE_INTEGER : index;
}

export function defaultInventoryUnit(categoryId, productType = "") {
  if (categoryId === "meat-poultry" || categoryId === "seafood") return /Deli|Hot Dogs|Sausages|Bacon|Imitation/.test(productType) ? "packages" : "lb";
  if (categoryId === "vegetables" || categoryId === "fruit") return "each";
  if (categoryId === "dairy-eggs") return productType === "Eggs" ? "each" : productType.includes("Milk") ? "gallons" : "containers";
  if (categoryId === "bread-bakery") return "packages";
  if (categoryId === "rice-pasta-grains") return "packages";
  if (categoryId === "canned-jarred") return /Jarred|Sauerkraut|Roasted|Pizza Sauce/.test(productType) ? "jars" : "cans";
  if (categoryId === "sauces-condiments") return /Flour|Sugar|Nuts/.test(productType) ? "bags" : /Mixes|Yeast/.test(productType) ? "packets" : "containers";
  return "packages";
}

function fallbackForAisle(aisle = "", sourceName = "") {
  const value = `${aisle} ${sourceName}`.toLowerCase();
  if (/frozen/.test(value)) return ["frozen-foods", "Frozen Dinners"];
  if (/seafood/.test(value)) return ["seafood", "Fish"];
  if (/meat|poultry/.test(value)) return ["meat-poultry", "Specialty & Game Meats"];
  if (/produce/.test(value)) return ["vegetables", "Other Vegetables"];
  if (/dairy|refrigerated dough/.test(value)) return ["dairy-eggs", "Other Dairy Products"];
  if (/bread|bakery/.test(value)) return ["bread-bakery", "Specialty Bread"];
  if (/rice|pasta|grain/.test(value)) return ["rice-pasta-grains", "Other Grains"];
  if (/canned|jarred|broth|stock|soup/.test(value)) return ["canned-jarred", "Jarred Specialty Foods"];
  if (/baking|spice|seasoning|condiment|sauce|oil|vinegar/.test(value)) return ["sauces-condiments", "Cooking Sauces"];
  return ["prepared-packaged", "Other Packaged Foods"];
}

export function classifyInventoryProduct(sourceName = "", aisle = "") {
  const source = String(sourceName).trim();
  const frozenAisle = /frozen/i.test(aisle) && !/\bfrozen\b/i.test(source) ? `Frozen ${source}` : source;
  const rule = PRODUCT_RULES.find(([, , pattern]) => pattern.test(frozenAisle));
  const [categoryId, productType] = rule || fallbackForAisle(aisle, source);
  return { categoryId, productType, matchedText: rule ? (frozenAisle.match(rule[2])?.[0] || "") : "" };
}

export function isApprovedInventoryProduct(categoryId, productType) {
  return TAXONOMY_BY_ID.get(categoryId)?.products.includes(productType) || false;
}
