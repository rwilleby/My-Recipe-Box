// Approved Holidays and Special Occasions menu order and recipe connections.
const HOLIDAY_OCCASION_IMAGE_FILES = [
  "new-years-day.webp", "valentines-day.webp", "mardi-gras.webp", "st-patricks-day.webp",
  "passover.webp", "easter.webp", "cinco-de-mayo.webp", "mothers-day.webp",
  "memorial-day.webp", "fathers-day.webp", "independence-day.webp", "labor-day.webp",
  "rosh-hashanah.webp", "halloween.webp", "thanksgiving.webp", "hanukkah.webp",
  "christmas-eve.webp", "christmas-day.webp", "new-years-eve.webp",
];

export const HOLIDAY_OCCASION_MENUS = Object.freeze([
  { occasion: "New Year’s Day", dishes: [["Main Dish", "Smothered Pork Chops", "AM-048"], ["Side 1", "Black-Eyed Peas", "CP-170"], ["Side 2", "Southern Collard Greens", "CP-167"]] },
  { occasion: "Valentine’s Day", dishes: [["Main Dish", "Filet Mignon with Garlic-Herb Butter", "HS-001"], ["Side 1", "Creamy Mashed Potatoes", "SD-003"], ["Side 2", "Roasted Asparagus", "SD-030"]] },
  { occasion: "Mardi Gras", dishes: [["Main Dish", "Chicken and Sausage Jambalaya", "HS-002"], ["Side 1", "Creole Green Beans", "HS-003"], ["Side 2", "Jalapeño Cheddar Cornbread", "HS-004"]] },
  { occasion: "St. Patrick’s Day", dishes: [["Main Dish", "Corned Beef and Cabbage", "CP-042"], ["Side 1", "Colcannon Potatoes", "HS-005"], ["Side 2", "Irish Soda Bread", "HS-006"]] },
  { occasion: "Passover", dishes: [["Main Dish", "Braised Beef Brisket", "HS-007"], ["Side 1", "Roasted Carrots and Parsnips", "HS-008"], ["Side 2", "Potato Kugel", "HS-009"]] },
  { occasion: "Easter", dishes: [["Main Dish", "Brown Sugar–Glazed Ham", "AM-013"], ["Side 1", "Scalloped Potatoes", "SD-017"], ["Side 2", "Honey-Glazed Carrots", "SD-025"]] },
  { occasion: "Cinco de Mayo", dishes: [["Main Dish", "Chicken Enchiladas", "MX-007"], ["Side 1", "Mexican Rice", "MX-013"], ["Side 2", "Seasoned Black Beans", "MX-015"]] },
  { occasion: "Mother’s Day", dishes: [["Main Dish", "Ham and Cheese Quiche", "QP-003"], ["Side 1", "Breakfast Potatoes", "HS-010"], ["Side 2", "Fresh Berry Salad", "HS-011"]] },
  { occasion: "Memorial Day", dishes: [["Main Dish", "Barbecue Pulled Pork", "AM-050"], ["Side 1", "Classic Potato Salad", "HS-012"], ["Side 2", "Creamy Coleslaw", "SD-022"]] },
  { occasion: "Father’s Day", dishes: [["Main Dish", "Smoked Baby Back Ribs", "SG-012"], ["Side 1", "Loaded Baked Potato Casserole", "HS-013"], ["Side 2", "Grilled Corn on the Cob", "SD-026"]] },
  { occasion: "Independence Day", dishes: [["Main Dish", "All-American Cheeseburgers", "HB-016"], ["Side 1", "Mustard Potato Salad", "SD-023"], ["Side 2", "Baked Beans", "SD-001"]] },
  { occasion: "Labor Day", dishes: [["Main Dish", "Grilled Barbecue Chicken", "AM-041"], ["Side 1", "Macaroni Salad", "HS-014"], ["Side 2", "Grilled Summer Vegetables", "HS-015"]] },
  { occasion: "Rosh Hashanah", dishes: [["Main Dish", "Honey-Garlic Roasted Chicken", "AS-012"], ["Side 1", "Sweet Carrot Tzimmes", "HS-016"], ["Side 2", "Apple and Cranberry Kugel", "HS-017"]] },
  { occasion: "Halloween", dishes: [["Main Dish", "Hearty Beef and Bean Chili", "CP-055"], ["Side 1", "Skillet Cornbread", "HS-018"], ["Side 2", "Roasted Pumpkin Wedges", "HS-019"]] },
  { occasion: "Thanksgiving", dishes: [["Main Dish", "Herb-Roasted Turkey", "HS-020"], ["Side 1", "Traditional Cornbread Dressing", "CP-164"], ["Side 2", "Green Bean Casserole", "CP-162"]] },
  { occasion: "Hanukkah", dishes: [["Main Dish", "Slow-Braised Beef Brisket", "HS-021"], ["Side 1", "Potato Latkes", "HS-022"], ["Side 2", "Roasted Green Beans", "HS-023"]] },
  { occasion: "Christmas Eve", dishes: [["Main Dish", "Garlic-Butter Baked Cod", "HS-024"], ["Side 1", "Parmesan Risotto", "HS-025"], ["Side 2", "Roasted Broccolini", "HS-026"]] },
  { occasion: "Christmas Day", dishes: [["Main Dish", "Garlic-Herb Prime Rib", "HS-027"], ["Side 1", "Creamy Mashed Potatoes", "SD-003"], ["Side 2", "Green Beans Almondine", "HS-028"]] },
  { occasion: "New Year’s Eve", dishes: [["Main Dish", "Beef Wellington", "HS-029"], ["Side 1", "Duchess Potatoes", "HS-030"], ["Side 2", "Roasted Asparagus", "SD-030"]] },
].map((menu, index) => Object.freeze({
  occasion: menu.occasion,
  image: `images/holiday-occasions/${HOLIDAY_OCCASION_IMAGE_FILES[index]}`,
  dishes: Object.freeze(menu.dishes.map(([role, name, recipeId]) => Object.freeze({ role, name, recipeId }))),
})));
