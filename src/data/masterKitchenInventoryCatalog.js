export const MASTER_INVENTORY_CATEGORIES = Object.freeze([
  { id: "meat-poultry", title: "Meat & Poultry" },
  { id: "seafood", title: "Seafood" },
  { id: "vegetables", title: "Vegetables" },
  { id: "fruit", title: "Fruit" },
  { id: "dairy-eggs", title: "Dairy & Eggs" },
  { id: "bread-bakery", title: "Bread & Bakery" },
  { id: "rice-pasta-grains", title: "Rice, Pasta & Grains" },
  { id: "canned-jarred", title: "Canned & Jarred Foods" },
  { id: "sauces-condiments", title: "Sauces, Condiments & Dressings" },
  { id: "spices-baking", title: "Spices, Seasonings & Baking" },
  { id: "frozen-foods", title: "Frozen Foods" },
  { id: "prepared-packaged", title: "Prepared & Packaged Foods" },
  { id: "other", title: "Other Recipe Ingredients" },
]);

const CURATED_FAMILIES = [
  ["meat-poultry", "Bacon", [["Raw package", "packages"], ["Cooked portions", "portions"]]],
  ["meat-poultry", "Beef", [["Ground 90/10", "lb"], ["Steaks", "each"], ["Roast", "lb"], ["Stew meat", "lb"], ["Beef tips", "lb"], ["Brisket", "lb"]]],
  ["meat-poultry", "Chicken", [["Boneless skinless breasts", "lb"], ["Boneless skinless thighs", "lb"], ["Bone-in thighs", "lb"], ["Drumsticks", "lb"], ["Wings", "lb"], ["Whole chicken", "each"], ["Cooked sliced", "portions"], ["Cooked diced", "portions"], ["Cooked shredded", "portions"]]],
  ["meat-poultry", "Ham", [["Whole or half ham", "lb"], ["Ham steak", "each"], ["Diced ham", "packages"], ["Deli slices", "packages"]]],
  ["meat-poultry", "Pork", [["Chops", "lb"], ["Tenderloin", "lb"], ["Pork roast", "lb"], ["Ribs", "racks"], ["Pulled pork", "portions"]]],
  ["meat-poultry", "Sausage", [["Breakfast links or patties", "packages"], ["Italian sausage", "lb"], ["Smoked sausage", "packages"], ["Ground sausage", "lb"]]],
  ["meat-poultry", "Turkey", [["Ground turkey", "lb"], ["Turkey breast", "lb"], ["Whole turkey", "each"], ["Deli slices", "packages"]]],

  ["seafood", "Catfish", [["Fresh fillets", "lb"], ["Frozen fillets", "lb"]]],
  ["seafood", "Crab", [["Fresh meat", "lb"], ["Canned meat", "cans"], ["Imitation crab", "packages"]]],
  ["seafood", "Salmon", [["Fresh fillets", "lb"], ["Frozen fillets", "lb"], ["Canned", "cans"]]],
  ["seafood", "Shrimp", [["Fresh raw", "lb"], ["Frozen raw", "lb"], ["Frozen cooked", "lb"]]],
  ["seafood", "Tilapia", [["Fresh fillets", "lb"], ["Frozen fillets", "lb"]]],
  ["seafood", "Tuna", [["Fresh steaks", "lb"], ["Canned in water", "cans"], ["Pouches", "pouches"]]],

  ["vegetables", "Asparagus", [["Fresh", "bunches"], ["Frozen", "bags"], ["Canned", "cans"]]],
  ["vegetables", "Beans", [["Fresh green", "lb"], ["Fresh baby lima", "lb"], ["Frozen green", "bags"], ["Frozen baby lima", "bags"], ["Canned green", "cans"], ["Canned black", "cans"], ["Canned pinto", "cans"], ["Canned baked", "cans"], ["Dry assorted", "bags"]]],
  ["vegetables", "Broccoli", [["Fresh crowns", "each"], ["Fresh florets", "bags"], ["Frozen florets", "bags"]]],
  ["vegetables", "Cabbage", [["Fresh head", "each"], ["Bagged coleslaw mix", "bags"]]],
  ["vegetables", "Carrots", [["Fresh whole", "lb"], ["Fresh baby", "bags"], ["Frozen sliced", "bags"], ["Frozen cubed", "bags"], ["Canned sliced", "cans"]]],
  ["vegetables", "Cauliflower", [["Fresh head", "each"], ["Fresh florets", "bags"], ["Frozen florets", "bags"], ["Frozen riced", "bags"]]],
  ["vegetables", "Corn", [["Fresh ears", "ears"], ["Frozen ears", "ears"], ["Frozen whole kernel", "bags"], ["Canned whole kernel", "cans"], ["Canned creamed", "cans"]]],
  ["vegetables", "Mushrooms", [["Fresh sliced", "packages"], ["Fresh whole", "packages"], ["Canned sliced", "cans"]]],
  ["vegetables", "Onions", [["Fresh yellow", "each"], ["Fresh white", "each"], ["Fresh red", "each"], ["Frozen diced", "bags"], ["Dried minced", "containers"]]],
  ["vegetables", "Peas", [["Fresh black-eyed", "lb"], ["Fresh green", "lb"], ["Frozen black-eyed", "bags"], ["Frozen green", "bags"], ["Canned black-eyed", "cans"], ["Canned green", "cans"]]],
  ["vegetables", "Peppers", [["Fresh bell peppers", "each"], ["Fresh jalapeños", "each"], ["Frozen pepper blend", "bags"], ["Canned green chiles", "cans"], ["Jarred roasted peppers", "jars"]]],
  ["vegetables", "Potatoes", [["Fresh gold", "lb"], ["Fresh red", "lb"], ["Fresh russet", "lb"], ["Fresh sweet", "lb"], ["Frozen diced", "bags"], ["Frozen hash browns", "bags"], ["Frozen thin fries", "bags"], ["Frozen waffle fries", "bags"], ["Frozen steak fries", "bags"], ["Frozen sweet potato fries", "bags"], ["Instant mashed", "packages"]]],
  ["vegetables", "Spinach", [["Fresh", "bags"], ["Frozen chopped", "bags"], ["Canned", "cans"]]],
  ["vegetables", "Tomatoes", [["Fresh slicing", "each"], ["Fresh cherry or grape", "containers"], ["Canned diced", "cans"], ["Canned crushed", "cans"], ["Canned whole", "cans"], ["Tomato paste", "cans"], ["Tomato sauce", "cans"]]],

  ["fruit", "Apples", [["Fresh", "each"], ["Canned pie filling", "cans"], ["Applesauce", "jars"]]],
  ["fruit", "Berries", [["Fresh strawberries", "containers"], ["Fresh blueberries", "containers"], ["Frozen mixed berries", "bags"]]],
  ["fruit", "Lemons", [["Fresh", "each"], ["Bottled juice", "bottles"]]],
  ["fruit", "Limes", [["Fresh", "each"], ["Bottled juice", "bottles"]]],
  ["fruit", "Peaches", [["Fresh", "each"], ["Frozen sliced", "bags"], ["Canned sliced", "cans"], ["Canned pie filling", "cans"]]],

  ["dairy-eggs", "Butter", [["Salted sticks", "sticks"], ["Unsalted sticks", "sticks"], ["Spreadable tub", "tubs"]]],
  ["dairy-eggs", "Cheese", [["Cheddar block", "packages"], ["Cheddar shredded", "bags"], ["Mexican blend shredded", "bags"], ["Mozzarella shredded", "bags"], ["Parmesan grated", "containers"], ["American slices", "packages"], ["Cream cheese", "packages"]]],
  ["dairy-eggs", "Eggs", [["Large shell eggs", "each"], ["Carton egg whites", "cartons"]]],
  ["dairy-eggs", "Milk", [["Whole", "gallons"], ["2 percent", "gallons"], ["Fat-free", "gallons"], ["Evaporated", "cans"], ["Shelf-stable", "cartons"]]],
  ["dairy-eggs", "Sour Cream", [["Regular", "containers"], ["Light", "containers"]]],
  ["dairy-eggs", "Yogurt", [["Plain Greek", "containers"], ["Vanilla Greek", "containers"], ["Individual cups", "cups"]]],

  ["bread-bakery", "Bread", [["White loaf", "loaves"], ["Wheat loaf", "loaves"], ["Low-carb loaf", "loaves"], ["French bread", "loaves"]]],
  ["bread-bakery", "Buns", [["Hamburger", "packages"], ["Hot dog", "packages"], ["Slider", "packages"]]],
  ["bread-bakery", "Tortillas", [["Flour", "packages"], ["Corn", "packages"], ["Low-carb flour", "packages"]]],

  ["rice-pasta-grains", "Noodles", [["Egg noodles", "bags"], ["Ramen", "packages"], ["Rice noodles", "packages"]]],
  ["rice-pasta-grains", "Pasta", [["Spaghetti", "boxes"], ["Elbow macaroni", "boxes"], ["Penne", "boxes"], ["Rotini", "boxes"], ["Lasagna", "boxes"], ["Higher-protein or lower-carb", "boxes"]]],
  ["rice-pasta-grains", "Rice", [["White dry", "bags"], ["Brown dry", "bags"], ["Microwave cups", "packages"], ["Cooked refrigerated", "containers"], ["Cooked frozen", "containers"]]],

  ["canned-jarred", "Broth", [["Chicken carton", "cartons"], ["Beef carton", "cartons"], ["Chicken cans", "cans"], ["Beef cans", "cans"]]],
  ["canned-jarred", "Soup", [["Cream of chicken", "cans"], ["Cream of mushroom", "cans"], ["Tomato", "cans"], ["Cheddar cheese", "cans"]]],

  ["sauces-condiments", "BBQ Sauce", [["Regular", "bottles"], ["No-sugar-added", "bottles"], ["Homemade frozen cubes", "cubes"]]],
  ["sauces-condiments", "Gravy", [["Jarred", "jars"], ["Canned", "cans"], ["Dry packets", "packets"], ["Homemade frozen cubes", "cubes"]]],
  ["sauces-condiments", "Salad Dressing", [["Ranch", "bottles"], ["Italian", "bottles"], ["Vinaigrette", "bottles"]]],
  ["sauces-condiments", "Salsa", [["Red jarred", "jars"], ["Salsa verde", "jars"], ["Fresh refrigerated", "containers"]]],
  ["sauces-condiments", "Soy Sauce", [["Regular", "bottles"], ["Lower-sodium", "bottles"]]],
  ["sauces-condiments", "Tomato Pasta Sauce", [["Marinara", "jars"], ["Meat sauce", "jars"], ["Alfredo", "jars"]]],

  ["spices-baking", "Flour", [["All-purpose", "bags"], ["Bread flour", "bags"], ["Self-rising", "bags"]]],
  ["spices-baking", "Leavening", [["Baking powder", "containers"], ["Baking soda", "boxes"], ["Yeast packets", "packets"]]],
  ["spices-baking", "Seasonings", [["Salt", "containers"], ["Black pepper", "containers"], ["Garlic powder", "containers"], ["Onion powder", "containers"], ["Paprika", "containers"], ["Smoked paprika", "containers"], ["Chili powder", "containers"], ["Ground cumin", "containers"], ["Italian seasoning", "containers"], ["Taco seasoning", "packets"]]],
  ["spices-baking", "Sugar", [["Granulated", "bags"], ["Brown", "bags"], ["Powdered", "bags"], ["Sugar substitute", "bags"]]],

  ["frozen-foods", "Frozen Vegetables", [["Mixed vegetables", "bags"], ["Stir-fry blend", "bags"], ["California blend", "bags"]]],
  ["frozen-foods", "Pie Crust", [["Refrigerated rolled", "packages"], ["Frozen shells", "packages"]]],
  ["frozen-foods", "Complete Meals", [["Homemade individual meals", "meals"], ["Commercial frozen entrées", "meals"]]],

  ["prepared-packaged", "Macaroni & Cheese", [["Boxed", "boxes"], ["Refrigerated prepared", "containers"], ["Frozen prepared", "containers"]]],
  ["prepared-packaged", "Mashed Potatoes", [["Instant packets", "packets"], ["Refrigerated prepared", "containers"], ["Frozen homemade", "containers"]]],
  ["prepared-packaged", "Stuffing", [["Boxed", "boxes"], ["Bagged", "bags"], ["Frozen homemade", "containers"]]],
];

function slugify(value = "") {
  return String(value).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function categoryForAisle(aisle = "") {
  const value = aisle.toLowerCase();
  if (/meat|poultry/.test(value)) return "meat-poultry";
  if (/seafood/.test(value)) return "seafood";
  if (/produce/.test(value)) return "vegetables";
  if (/dairy/.test(value)) return "dairy-eggs";
  if (/bakery/.test(value)) return "bread-bakery";
  if (/frozen/.test(value)) return "frozen-foods";
  if (/snack/.test(value)) return "prepared-packaged";
  if (/pantry|grocery/.test(value)) return "other";
  return "other";
}

export function buildMasterKitchenInventoryCatalog(recipes = [], customItems = []) {
  const rows = CURATED_FAMILIES.flatMap(([categoryId, family, variations]) =>
    variations.map(([variation, unit]) => ({
      id: `catalog-${slugify(categoryId)}-${slugify(family)}-${slugify(variation)}`,
      categoryId,
      family,
      variation,
      unit,
      custom: false,
    }))
  );

  const knownFamilies = new Set(rows.map((row) => row.family.toLowerCase()));
  recipes.forEach((recipe) => {
    (recipe.ingredients || []).forEach((ingredient) => {
      const family = String(ingredient.name || "").trim();
      if (!family || knownFamilies.has(family.toLowerCase())) return;
      knownFamilies.add(family.toLowerCase());
      rows.push({
        id: `recipe-${slugify(family)}`,
        categoryId: categoryForAisle(ingredient.aisle),
        family,
        variation: "Recipe ingredient",
        unit: ingredient.unit || "packages",
        custom: false,
        recipeDerived: true,
      });
    });
  });

  customItems.forEach((item) => {
    if (!item?.id || !item.family) return;
    rows.push({
      id: item.id,
      categoryId: item.categoryId || "other",
      family: item.family,
      variation: item.variation || "Custom item",
      unit: item.unit || "each",
      custom: true,
    });
  });

  return MASTER_INVENTORY_CATEGORIES.map((category) => ({
    ...category,
    items: rows
      .filter((row) => row.categoryId === category.id)
      .sort((a, b) => a.family.localeCompare(b.family) || a.variation.localeCompare(b.variation)),
  })).filter((category) => category.items.length);
}
