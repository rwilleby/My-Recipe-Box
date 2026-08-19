import {
  MASTER_INVENTORY_CATEGORIES,
  MASTER_KITCHEN_INVENTORY_TAXONOMY,
  classifyInventoryProduct,
  defaultInventoryUnit,
  isApprovedInventoryProduct,
  taxonomyProductOrder,
} from "./masterKitchenInventoryTaxonomy.js";

export { MASTER_INVENTORY_CATEGORIES, MASTER_KITCHEN_INVENTORY_TAXONOMY };

export const MEAT_POULTRY_FAMILY_ORDER = Object.freeze([
  "Bacon", "Beef", "Ground Beef", "Chicken", "Ground Chicken", "Corned Beef", "Duck", "Ham",
  "Lamb", "Ground Lamb", "Pork", "Ground Pork", "Sausages", "Smoking Meats", "Turkey",
  "Ground Turkey", "Deli Meats", "Hot Dogs & Bratwurst", "Meatballs", "Specialty & Game Meats",
]);

const CURATED_FAMILIES = [
  ["meat-poultry", "Bacon", [["Raw Bacon", "packages", "Raw package"], ["Cooked Bacon", "cups", "Cooked portions"]]],
  ["meat-poultry", "Beef", [["Raw Steak", "lb", "Steaks"], ["Raw Roast", "lb", "Roast"], ["Raw Stew Meat", "lb", "Stew meat"], ["Raw Beef Tips", "lb", "Beef tips"]]],
  ["meat-poultry", "Ground Beef", [["Raw 80/20", "lb", "80/20 raw"], ["Raw 90/10", "lb", "90/10 raw"], ["Raw 93/7", "lb"], ["Raw 97/3", "lb", "97/3 raw"], ["Raw Lean", "lb"], ["Cooked 90/10", "cups"], ["Cooked Lean", "cups"]]],
  ["meat-poultry", "Chicken", [["Raw Breast", "lb", "Raw boneless skinless breasts"], ["Raw Thigh", "lb", "Raw boneless skinless thighs"], ["Raw Bone-In Thigh", "lb", "Raw bone-in thighs"], ["Raw Drumstick", "lb", "Raw drumsticks"], ["Raw Wing", "lb", "Raw wings"], ["Raw Leg Quarter", "each"], ["Raw Whole Chicken", "each", "Raw whole chicken"], ["Cooked Whole Breasts", "cups", "Cooked chicken breast, whole"], ["Cooked Diced Breast", "cups", "Cooked chicken breast, diced"], ["Cooked Sliced Breast", "cups", "Cooked chicken breast, sliced"], ["Cooked Shredded Breast", "cups", "Cooked chicken breast, shredded"]]],
  ["meat-poultry", "Ground Chicken", [["Raw Ground Chicken", "lb"], ["Cooked Ground Chicken", "cups"]]],
  ["meat-poultry", "Pork", [["Raw Chop", "lb", "Chops"], ["Raw Tenderloin", "lb", "Tenderloin"], ["Raw Roast", "lb", "Pork roast"]]],
  ["meat-poultry", "Ground Pork", [["Raw Ground Pork", "lb"], ["Cooked Ground Pork", "cups"]]],
  ["meat-poultry", "Turkey", [["Raw Breast", "lb", "Turkey breast"], ["Raw Whole Turkey", "each", "Whole turkey"], ["Cooked Whole Breast", "cups"], ["Cooked Diced Turkey", "cups"], ["Cooked Sliced Turkey", "cups"], ["Cooked Shredded Turkey", "cups"]]],
  ["meat-poultry", "Ground Turkey", [["Raw Ground Turkey", "lb", "Ground turkey", "Turkey"], ["Cooked Ground Turkey", "cups"]]],
  ["meat-poultry", "Ham", [["Cooked Whole Ham", "lb", "Whole or half ham"], ["Cooked Half Ham", "lb"], ["Cooked Ham Steak", "each", "Ham steak"], ["Cooked Diced Ham", "cups", "Diced ham"]]],
  ["meat-poultry", "Sausages", [["Raw Breakfast Links", "packages", "Breakfast links or patties", "Sausage"], ["Raw Breakfast Patties", "packages"], ["Raw Italian Sausage", "lb", "Italian sausage", "Sausage"], ["Cooked Smoked Sausage", "packages", "Smoked sausage", "Sausage"], ["Raw Ground Sausage", "lb", "Ground sausage", "Sausage"], ["Raw Hot Dogs", "packages"]]],
  ["meat-poultry", "Smoking Meats", [["Raw Beef Brisket", "lb", "Brisket", "Beef"], ["Raw Pork Butt", "lb"], ["Raw Baby Back Ribs", "racks"], ["Raw Pork Ribs", "racks", "Ribs", "Pork"], ["Raw Beef Ribs", "racks"], ["Cooked Pulled Pork", "cups", "Pulled pork", "Pork"]]],
  ["meat-poultry", "Deli", [["Cooked Ham", "packages", "Deli slices", "Ham"], ["Cooked Turkey", "packages", "Deli slices", "Turkey"], ["Cooked Chicken", "packages"], ["Cooked Salami", "packages"], ["Cooked Capicola", "packages"], ["Cooked Pepperoni", "packages"]]],

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

const RECIPE_FAMILY_RULES = [
  [/\b(deli|lunch meat|salami|capicola|pepperoni)\b/i, "Deli"],
  [/\bground beef\b/i, "Ground Beef"],
  [/\bground chicken\b/i, "Ground Chicken"],
  [/\bground pork\b/i, "Ground Pork"],
  [/\bground turkey\b/i, "Ground Turkey"],
  [/\b(beef brisket|brisket|pork butt|boston butt|baby back ribs?|beef ribs?|pork ribs?|pulled pork)\b/i, "Smoking Meats"],
  [/\b(chicken breasts?|chicken breast meat|chicken thighs?|chicken legs?|chicken wings?|chicken quarters?|whole chicken|cooked chicken|shredded chicken|diced chicken|sliced chicken)\b/i, "Chicken"],
  [/\b(turkey breast|whole turkey|cooked turkey|shredded turkey|diced turkey|sliced turkey)\b/i, "Turkey"],
  [/\b(bacon)\b/i, "Bacon"],
  [/\b(ham steak|diced ham|whole ham|half ham|ham)\b/i, "Ham"],
  [/\b(pork chops?|pork tenderloin|pork loin|pork roast)\b/i, "Pork"],
  [/\b(sausage|bratwurst|kielbasa|hot dogs?)\b/i, "Sausages"],
  [/\b(beef|steaks?|roast|stew meat|beef tips?)\b/i, "Beef"],
  [/\b(shrimp)\b/i, "Shrimp"],
  [/\b(salmon)\b/i, "Salmon"],
  [/\b(tilapia)\b/i, "Tilapia"],
  [/\b(crabmeat|crab meat|crab)\b/i, "Crab"],
  [/\b(tuna)\b/i, "Tuna"],
  [/\b(large eggs?|egg whites?|eggs?)\b/i, "Eggs"],
  [/\b(whole milk|2% milk|low-fat milk|reduced-fat milk|fat-free milk|milk)\b/i, "Milk"],
  [/\b(butter)\b/i, "Butter"],
  [/\b(cheddar|mozzarella|parmesan|provolone|swiss|american cheese|cream cheese|feta|cheese)\b/i, "Cheese"],
  [/\b(potatoes?|mashed potatoes?)\b/i, "Potatoes"],
  [/\b(onions?)\b/i, "Onions"],
  [/\b(tomatoes?|tomato paste|tomato sauce)\b/i, "Tomatoes"],
  [/\b(bell peppers?|jalapeños?|green chiles?|peppers?)\b/i, "Peppers"],
  [/\b(green beans?|black beans?|pinto beans?|baked beans?|beans?)\b/i, "Beans"],
  [/\b(corn)\b/i, "Corn"],
  [/\b(broccoli)\b/i, "Broccoli"],
  [/\b(carrots?)\b/i, "Carrots"],
  [/\b(rice)\b/i, "Rice"],
  [/\b(spaghetti|macaroni|penne|rotini|lasagna|pasta)\b/i, "Pasta"],
];

const LEGACY_V8416_MEAT_RULES = [
  [/\bground beef\b/i, "Ground Beef"],
  [/\b(chicken breasts?|chicken breast meat|chicken thighs?|chicken legs?|chicken wings?|chicken quarters?|whole chicken|cooked chicken|shredded chicken|diced chicken|sliced chicken)\b/i, "Chicken"],
  [/\bground turkey\b/i, "Ground Turkey"],
  [/\b(turkey breast|whole turkey|deli turkey)\b/i, "Turkey"],
  [/\b(bacon)\b/i, "Bacon"],
  [/\b(ham steak|diced ham|deli ham|ham)\b/i, "Ham"],
  [/\b(pork chops?|pork tenderloin|pork roast|pulled pork|pork ribs?)\b/i, "Pork"],
  [/\b(sausage|bratwurst|kielbasa)\b/i, "Sausage"],
];

function legacyV8416RecipeRowId(sourceName, sourceUnit = "packages") {
  const match = LEGACY_V8416_MEAT_RULES.find(([pattern]) => pattern.test(sourceName));
  if (!match) return null;
  const family = match[1];
  const value = sourceName.toLowerCase();
  let unit = sourceUnit;
  let variation = String(sourceName)
    .replace(match[0], " ")
    .replace(/[(),]/g, " ")
    .replace(/\b(optional|for serving|for garnish)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim() || "Standard";
  if (family === "Ground Beef") {
    const grade = value.match(/\b(80\/?20|90\/?10|93%? lean|97\/?3)\b/i)?.[1] || "Lean";
    variation = /cooked|browned|drained/.test(value) ? `${grade} cooked` : `${grade} raw`;
    unit = "lb";
  } else if (family === "Chicken") {
    const cooked = /cooked|prepared|rotisserie/.test(value);
    const form = /shredded/.test(value) ? "shredded" : /diced|cubed|pieces/.test(value) ? "diced" : /sliced|cutlets?/.test(value) ? "sliced" : "whole";
    if (cooked) ({ variation, unit } = { variation: `Cooked chicken breast, ${form}`, unit: "cups" });
    else if (/wings?/.test(value)) ({ variation, unit } = { variation: "Raw wings", unit: "lb" });
    else if (/quarters?/.test(value)) ({ variation, unit } = { variation: "Raw leg quarters", unit: "each" });
    else if (/drumsticks?|chicken legs?/.test(value)) ({ variation, unit } = { variation: "Raw drumsticks", unit: "lb" });
    else if (/thighs?/.test(value)) ({ variation, unit } = { variation: /bone-in/.test(value) ? "Raw bone-in thighs" : "Raw boneless skinless thighs", unit: "lb" });
    else if (/whole chicken/.test(value)) ({ variation, unit } = { variation: "Raw whole chicken", unit: "each" });
    else ({ variation, unit } = { variation: /bone-in/.test(value) ? "Raw bone-in breasts" : "Raw boneless skinless breasts", unit: "lb" });
  }
  return `recipe-${slugify(family)}-${slugify(variation)}-${slugify(unit)}`;
}

function recipeFamilyForIngredient(name = "") {
  const cleaned = String(name)
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(optional|for serving|for garnish|divided|softened|melted|chopped|diced|sliced|shredded|minced|cooked|prepared)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const match = RECIPE_FAMILY_RULES.find(([pattern]) => pattern.test(name));
  if (!match) return { family: cleaned || String(name).trim(), variation: "Standard" };
  const family = match[1];
  const variation = String(name)
    .replace(match[0], " ")
    .replace(/[(),]/g, " ")
    .replace(/\b(optional|for serving|for garnish)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { family, variation: variation || "Standard" };
}

function normalizedRecipeForm(family, sourceName, sourceUnit = "packages") {
  const value = sourceName.toLowerCase();
  if (family === "Ground Beef") {
    const matchedGrade = value.match(/\b(80\/?20|90\/?10|93%? lean|93\/?7|97\/?3)\b/i)?.[1];
    const grade = /80/.test(matchedGrade || "") ? "80/20"
      : /90/.test(matchedGrade || "") ? "90/10"
        : /93/.test(matchedGrade || "") ? "93/7"
          : /97/.test(matchedGrade || "") ? "97/3" : "Lean";
    return { variation: /cooked|browned|drained/.test(value) ? `Cooked ${grade}` : `Raw ${grade}`, unit: /cooked|browned|drained/.test(value) ? "cups" : "lb" };
  }
  if (family === "Chicken") {
    const cooked = /cooked|prepared|rotisserie/.test(value);
    if (cooked) {
      if (/shredded/.test(value)) return { variation: "Cooked Shredded Breast", unit: "cups" };
      if (/diced|cubed|pieces/.test(value)) return { variation: "Cooked Diced Breast", unit: "cups" };
      if (/sliced|cutlets?/.test(value)) return { variation: "Cooked Sliced Breast", unit: "cups" };
      return { variation: "Cooked Whole Breasts", unit: "cups" };
    }
    if (/shredded/.test(value)) return { variation: "Raw Shredded Breast", unit: "lb" };
    if (/diced|cubed|pieces/.test(value)) return { variation: "Raw Diced Breast", unit: "lb" };
    if (/sliced|cutlets?/.test(value)) return { variation: "Raw Sliced Breast", unit: "lb" };
    if (/wings?/.test(value)) return { variation: "Raw Wing", unit: "lb" };
    if (/quarters?/.test(value)) return { variation: "Raw Leg Quarter", unit: "each" };
    if (/drumsticks?|chicken legs?/.test(value)) return { variation: "Raw Drumstick", unit: "lb" };
    if (/thighs?/.test(value)) return { variation: /bone-in/.test(value) ? "Raw Bone-In Thigh" : "Raw Thigh", unit: "lb" };
    if (/whole chicken/.test(value)) return { variation: "Raw Whole Chicken", unit: "each" };
    return { variation: "Raw Breast", unit: "lb" };
  }
  if (family === "Ground Chicken") return { variation: /cooked|browned|drained/.test(value) ? "Cooked Ground Chicken" : "Raw Ground Chicken", unit: /cooked|browned|drained/.test(value) ? "cups" : "lb" };
  if (family === "Ground Pork") return { variation: /cooked|browned|drained/.test(value) ? "Cooked Ground Pork" : "Raw Ground Pork", unit: /cooked|browned|drained/.test(value) ? "cups" : "lb" };
  if (family === "Ground Turkey") return { variation: /cooked|browned|drained/.test(value) ? "Cooked Ground Turkey" : "Raw Ground Turkey", unit: /cooked|browned|drained/.test(value) ? "cups" : "lb" };
  if (family === "Bacon") return { variation: /cooked|crumbled|bits?/.test(value) ? "Cooked Bacon" : "Raw Bacon", unit: /cooked|crumbled|bits?/.test(value) ? "cups" : "packages" };
  if (family === "Beef") {
    const cut = /stew/.test(value) ? "Stew Meat" : /tips?/.test(value) ? "Beef Tips" : /roast/.test(value) ? "Roast" : "Steak";
    return { variation: `Raw ${cut}`, unit: "lb" };
  }
  if (family === "Pork") return { variation: /tenderloin|loin/.test(value) ? "Raw Tenderloin" : /roast/.test(value) ? "Raw Roast" : "Raw Chop", unit: "lb" };
  if (family === "Turkey") {
    if (/cooked|prepared|rotisserie/.test(value)) {
      if (/shredded/.test(value)) return { variation: "Cooked Shredded Turkey", unit: "cups" };
      if (/diced|cubed|pieces/.test(value)) return { variation: "Cooked Diced Turkey", unit: "cups" };
      if (/sliced/.test(value)) return { variation: "Cooked Sliced Turkey", unit: "cups" };
      return { variation: "Cooked Whole Breast", unit: "cups" };
    }
    return /whole turkey/.test(value) ? { variation: "Raw Whole Turkey", unit: "each" } : { variation: "Raw Breast", unit: "lb" };
  }
  if (family === "Ham") {
    if (/steak/.test(value)) return { variation: "Cooked Ham Steak", unit: "each" };
    if (/diced|cubed/.test(value)) return { variation: "Cooked Diced Ham", unit: "cups" };
    if (/half/.test(value)) return { variation: "Cooked Half Ham", unit: "lb" };
    return { variation: "Cooked Whole Ham", unit: "lb" };
  }
  if (family === "Sausages") {
    if (/hot dogs?/.test(value)) return { variation: "Raw Hot Dogs", unit: "packages" };
    if (/smoked|kielbasa/.test(value)) return { variation: "Cooked Smoked Sausage", unit: "packages" };
    if (/italian/.test(value)) return { variation: "Raw Italian Sausage", unit: "lb" };
    if (/patt/.test(value)) return { variation: "Raw Breakfast Patties", unit: "packages" };
    if (/link|bratwurst/.test(value)) return { variation: "Raw Breakfast Links", unit: "packages" };
    return { variation: "Raw Ground Sausage", unit: "lb" };
  }
  if (family === "Smoking Meats") {
    if (/pulled pork/.test(value)) return { variation: "Cooked Pulled Pork", unit: "cups" };
    if (/brisket/.test(value)) return { variation: "Raw Beef Brisket", unit: "lb" };
    if (/pork butt|boston butt/.test(value)) return { variation: "Raw Pork Butt", unit: "lb" };
    if (/baby back/.test(value)) return { variation: "Raw Baby Back Ribs", unit: "racks" };
    if (/beef ribs?/.test(value)) return { variation: "Raw Beef Ribs", unit: "racks" };
    return { variation: "Raw Pork Ribs", unit: "racks" };
  }
  if (family === "Deli" || family === "Deli Meats") {
    const cut = /salami/.test(value) ? "Salami" : /capicola/.test(value) ? "Capicola" : /pepperoni/.test(value) ? "Pepperoni" : /turkey/.test(value) ? "Turkey" : /chicken/.test(value) ? "Chicken" : "Ham";
    return { variation: `Cooked ${cut}`, unit: "packages" };
  }
  if (family === "Hot Dogs & Bratwurst") return { variation: /brat/.test(value) ? "Raw Bratwurst" : "Raw Hot Dogs", unit: "packages" };
  if (family === "Meatballs") return { variation: /cooked|prepared|frozen/.test(value) ? "Cooked Meatballs" : "Raw Meatballs", unit: "packages" };
  if (family === "Ground Lamb") return { variation: /cooked|browned|drained/.test(value) ? "Cooked Ground Lamb" : "Raw Ground Lamb", unit: /cooked|browned|drained/.test(value) ? "cups" : "lb" };
  if (family === "Corned Beef") return { variation: /cooked|prepared/.test(value) ? "Cooked Brisket" : "Raw Brisket", unit: "lb" };
  if (family === "Duck") return { variation: /breast/.test(value) ? "Raw Breast" : "Raw Whole Duck", unit: /breast/.test(value) ? "lb" : "each" };
  if (family === "Lamb") return { variation: /chop/.test(value) ? "Raw Chop" : /leg/.test(value) ? "Raw Leg" : /roast/.test(value) ? "Raw Roast" : "Raw Lamb", unit: "lb" };
  if (family === "Specialty & Game Meats") return { variation: /cooked|prepared/.test(value) ? "Cooked Specialty Meat" : "Raw Specialty Meat", unit: "lb" };
  if (family === "Milk") {
    if (/evaporated/.test(value)) return { variation: "Evaporated", unit: "cans" };
    if (/fat-free|skim/.test(value)) return { variation: "Fat-free", unit: "gallons" };
    if (/low-fat|reduced-fat|2%/.test(value)) return { variation: "Reduced-fat / 2 percent", unit: "gallons" };
    if (/whole/.test(value)) return { variation: "Whole", unit: "gallons" };
    return { variation: "Standard", unit: "gallons" };
  }
  if (family === "Eggs") {
    return /white/.test(value)
      ? { variation: "Large egg whites", unit: "each" }
      : { variation: "Large shell eggs", unit: "each" };
  }
  if (family === "Potatoes" && /mashed|prepared/.test(value)) {
    return { variation: "Prepared mashed", unit: "cups" };
  }
  const { variation } = recipeFamilyForIngredient(sourceName);
  return { variation, unit: sourceUnit };
}

const CATEGORY_AISLE_HINTS = {
  "meat-poultry": "Meat & Poultry", seafood: "Seafood", vegetables: "Produce", fruit: "Produce Fruit",
  "dairy-eggs": "Dairy", "bread-bakery": "Bread & Bakery", "rice-pasta-grains": "Rice, Pasta & Grains",
  "canned-jarred": "Canned Goods", "sauces-condiments": "Sauces & Condiments", "spices-baking": "Baking & Spices",
  "frozen-foods": "Frozen Foods", "prepared-packaged": "Prepared & Packaged Foods", other: "Grocery List",
};

function canonicalVariation(productType, sourceName, previousVariation = "Standard") {
  if (MEAT_POULTRY_FAMILY_ORDER.includes(productType)) return normalizedRecipeForm(productType, sourceName);
  const { matchedText } = classifyInventoryProduct(sourceName);
  const remainder = String(sourceName)
    .replace(matchedText, " ")
    .replace(/[(),]/g, " ")
    .replace(/\b(optional|for serving|for garnish|divided)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (remainder && remainder.length <= 80) return { variation: remainder, unit: null };
  return { variation: previousVariation || "Standard", unit: null };
}

function splitCanonicalDetails(variation = "Standard") {
  const form = /^(Raw|Cooked|Fresh|Frozen|Canned|Jarred|Refrigerated|Instant|Dry|Prepared)\b/i.exec(variation)?.[1] || "";
  return {
    cut: form ? variation.slice(form.length).trim() || "Standard" : variation,
    form,
  };
}

function canonicalInventoryDetails(family, variation) {
  const details = splitCanonicalDetails(variation);
  if (family === "Chicken" || family === "Turkey") {
    const baseCut = /breasts?/i.test(details.cut) ? "Breast"
      : /thigh/i.test(details.cut) ? "Thigh"
        : /drumstick/i.test(details.cut) ? "Drumstick"
          : /wing/i.test(details.cut) ? "Wing"
            : /leg quarter/i.test(details.cut) ? "Leg Quarter"
              : /whole (chicken|turkey)/i.test(details.cut) ? `Whole ${family}` : details.cut;
    const preparations = [
      /diced/i.test(details.cut) && "Diced", /sliced/i.test(details.cut) && "Sliced",
      /shredded/i.test(details.cut) && "Shredded", /whole breasts?/i.test(details.cut) && "Whole",
      /bone-in/i.test(details.cut) && "Bone-In", details.form,
    ].filter(Boolean);
    return { cut: baseCut.replace(/Bone-In\s*/i, "").trim(), form: preparations.join(", ") };
  }
  if (/^Ground /.test(family)) return { cut: details.cut.replace(/^Ground (Beef|Chicken|Lamb|Pork|Turkey)\s*/i, "").trim() || "Standard", form: details.form };
  return details;
}

export function buildMasterKitchenInventoryCatalog(recipes = [], customItems = []) {
  const rows = [];
  const knownForms = new Map();
  function addOrMerge(row, aliases = []) {
    if (!isApprovedInventoryProduct(row.categoryId, row.family)) throw new Error(`Unapproved inventory product: ${row.categoryId} / ${row.family}`);
    const details = canonicalInventoryDetails(row.family, row.variation);
    const complete = { brand: "", ...details, ...row };
    const formKey = `${complete.categoryId}|${complete.family}|${complete.cut}|${complete.form}`.toLowerCase();
    if (knownForms.has(formKey)) {
      const existing = knownForms.get(formKey);
      existing.legacyIds = [...new Set([...(existing.legacyIds || []), complete.id, ...(complete.legacyIds || []), ...aliases].filter(Boolean))];
      return existing;
    }
    complete.legacyIds = [...new Set([...(complete.legacyIds || []), ...aliases].filter((id) => id && id !== complete.id))];
    rows.push(complete);
    knownForms.set(formKey, complete);
    return complete;
  }

  MASTER_KITCHEN_INVENTORY_TAXONOMY.forEach((category) => category.products.forEach((family) => addOrMerge({
    id: `catalog-${slugify(category.id)}-${slugify(family)}-standard`,
    categoryId: category.id,
    family,
    variation: "Standard",
    unit: defaultInventoryUnit(category.id, family),
    custom: false,
    taxonomyBase: true,
  })));

  CURATED_FAMILIES.forEach(([oldCategoryId, oldFamily, variations]) => variations.forEach(([oldVariation, oldUnit, legacyVariation, legacyFamily]) => {
    const sourceName = `${oldVariation} ${oldFamily}`;
    const storageForm = oldVariation.match(/^(Frozen|Canned|Jarred|Instant|Refrigerated)\b/i)?.[1] || "";
    const classificationName = storageForm ? `${storageForm} ${oldFamily}` : sourceName;
    const classification = classifyInventoryProduct(classificationName, CATEGORY_AISLE_HINTS[oldCategoryId]);
    const normalized = MEAT_POULTRY_FAMILY_ORDER.includes(classification.productType)
      ? canonicalVariation(classification.productType, sourceName, oldVariation)
      : { variation: oldVariation, unit: null };
    const unit = normalized.unit || oldUnit || defaultInventoryUnit(classification.categoryId, classification.productType);
    const oldId = `catalog-${slugify(oldCategoryId)}-${slugify(legacyFamily || oldFamily)}-${slugify(legacyVariation || oldVariation)}`;
    addOrMerge({
      id: oldId,
      categoryId: classification.categoryId,
      family: classification.productType,
      variation: normalized.variation,
      unit,
      custom: false,
    });
  }));

  recipes.forEach((recipe) => {
    (recipe.ingredients || []).forEach((ingredient) => {
      const sourceName = String(ingredient.name || "").trim();
      if (!sourceName) return;
      const previousFamily = recipeFamilyForIngredient(sourceName).family;
      const previousNormalized = normalizedRecipeForm(previousFamily, sourceName, ingredient.unit || "packages");
      const previousV8417RowId = `recipe-${slugify(previousFamily)}-${slugify(previousNormalized.variation)}-${slugify(previousNormalized.unit)}`;
      const classification = classifyInventoryProduct(sourceName, ingredient.aisle);
      const normalized = canonicalVariation(classification.productType, sourceName, previousNormalized.variation);
      const variation = normalized.variation;
      const unit = normalized.unit || defaultInventoryUnit(classification.categoryId, classification.productType);
      const legacyId = `recipe-${slugify(sourceName)}`;
      const previousRowId = legacyV8416RecipeRowId(sourceName, ingredient.unit || "packages");
      const legacyIds = [...new Set([legacyId, previousRowId, previousV8417RowId].filter(Boolean))];
      addOrMerge({
        id: `recipe-${slugify(classification.productType)}-${slugify(variation)}-${slugify(unit)}`,
        categoryId: classification.categoryId,
        family: classification.productType,
        variation,
        unit,
        custom: false,
        recipeDerived: true,
        brand: ingredient.brand || "",
        legacyIds,
      });
    });
  });

  customItems.forEach((item) => {
    if (!item?.id || !item.family) return;
    const classification = isApprovedInventoryProduct(item.categoryId, item.family)
      ? { categoryId: item.categoryId, productType: item.family }
      : classifyInventoryProduct(`${item.variation || ""} ${item.family}`, CATEGORY_AISLE_HINTS[item.categoryId]);
    addOrMerge({
      id: item.id,
      categoryId: classification.categoryId,
      family: classification.productType,
      variation: item.variation || "Custom item",
      unit: item.unit || defaultInventoryUnit(classification.categoryId, classification.productType),
      brand: item.brand || "",
      custom: true,
    });
  });

  const concreteFamilies = new Set(rows.filter((row) => !row.taxonomyBase).map((row) => `${row.categoryId}|${row.family}`));
  const visibleRows = rows.filter((row) => !row.taxonomyBase || !concreteFamilies.has(`${row.categoryId}|${row.family}`));

  return MASTER_INVENTORY_CATEGORIES.map((category) => ({
    ...category,
    items: visibleRows
      .filter((row) => row.categoryId === category.id)
      .sort((a, b) => {
        const familyOrder = taxonomyProductOrder(category.id, a.family) - taxonomyProductOrder(category.id, b.family);
        return familyOrder || a.cut.localeCompare(b.cut) || a.form.localeCompare(b.form) || a.variation.localeCompare(b.variation);
      }),
  }));
}
