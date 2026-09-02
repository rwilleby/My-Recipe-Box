const INDIVIDUAL_MEAL_STEPS = [
  { image: "01-select-and-portion.webp", title: "SELECT & PORTION", copy: "Choose the meal components and place the portioned main dish into the container.", alt: "A portion of glazed meatloaf being placed into a freezer-meal container beside brown rice and corn." },
  { image: "02-add-meal-pieces.webp", title: "ADD THE MEAL PIECES", copy: "Add the remaining meal components, keeping each portion neatly arranged.", alt: "Brown rice being spooned into a meal container with meatloaf and corn." },
  { image: "03-secure-the-lid.webp", title: "SECURE THE LID", copy: "Attach the clear lid and press around the entire rim to make sure it is secure.", alt: "Hands pressing a clear lid securely onto a prepared meal container." },
  { image: "04-apply-the-label.webp", title: "LABEL THE MEAL", copy: "Apply a printed label showing the meal name, contents, and freezing information.", alt: "A printed meatloaf dinner label being applied to the clear container lid." },
  { image: "05-vacuum-seal.webp", title: "VACUUM SEAL", copy: "Place the entire closed container inside a vacuum-sealer bag and seal it securely.", alt: "A labeled meal container inside a bag being positioned in a vacuum sealer." },
  { image: "06-store-in-freezer.webp", title: "STORE IN THE FREEZER", copy: "Arrange the sealed meals neatly in the freezer so the labels remain easy to see.", alt: "Six labeled and vacuum-sealed meal containers arranged neatly inside a freezer drawer." },
];

const DINNER_FOR_TWO_STEPS = [
  { title: "PLAN FOUR SERVINGS", copy: "Prepare enough for dinner tonight and one complete two-serving dinner for the freezer." },
  { title: "SERVE TONIGHT’S MEAL", copy: "Plate the first two servings before portioning the food intended for the freezer." },
  { title: "COOL THE EXTRA DINNER", copy: "Cool the main dish and sides promptly so steam does not become excess freezer ice." },
  { title: "PACK BOTH SERVINGS", copy: "Arrange two complete servings together in a container sized for one future dinner." },
  { title: "LABEL FOR TWO", copy: "Record the dinner name, two-serving quantity, freeze date, and reheating directions." },
  { title: "FREEZE & ROTATE", copy: "Freeze promptly and place the newest dinner behind older meals so earlier packages are used first." },
];

const MEAL_COMPONENT_STEPS = [
  { title: "COOL EACH COMPONENT", copy: "Cool cooked meats, sauces, grains, vegetables, and other meal parts separately." },
  { title: "PORTION BY FUTURE USE", copy: "Package practical amounts for one recipe, one dinner, or two individual servings." },
  { title: "CHOOSE THE CONTAINER", copy: "Use freezer bags for flat items and rigid containers for foods that need protection." },
  { title: "REMOVE AIR & SEAL", copy: "Press out excess air or vacuum seal when appropriate to limit freezer burn." },
  { title: "LABEL THE CONTENTS", copy: "Write the component name, amount, preparation state, freeze date, and best use." },
  { title: "LOG & STORE TOGETHER", copy: "Add the component to freezer inventory and group similar items for easy meal assembly." },
];

export const FREEZER_PACKAGING_ACCORDIONS = Object.freeze([
  { id: "individual-meals", title: "How I Package My Individual Freezer Meals", summary: "See the complete process—from portioning one prepared meal to storing it in the freezer.", intro: "Prepare, package, label, and protect each individual meal before placing it in the freezer.", steps: INDIVIDUAL_MEAL_STEPS, illustrated: true },
  { id: "dinners-for-two", title: "How I Package My Freezer Dinners For Two", summary: "Turn planned leftovers into one complete future dinner sized for two people.", intro: "Package the main dish and sides as one clearly labeled two-serving dinner that is ready to thaw and reheat together.", steps: DINNER_FOR_TWO_STEPS },
  { id: "meal-components", title: "How I Package My Freezer Meal Components", summary: "Store mains, sides, sauces, grains, and other prepared foods separately for flexible meal building.", intro: "Freeze prepared components in useful portions so they can be mixed, matched, and added to future meals without waste.", steps: MEAL_COMPONENT_STEPS },
]);
