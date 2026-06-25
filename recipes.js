// Add your real PNG cards here. Put files in /cards/category-folder/.
// Example front/back pair:
// { code: "AM-001", title: "BBQ Pulled Chicken", front: "cards/american/AM-001.png", back: "cards/american/AM-001-back.png" }

const CATEGORIES = [
  { id: "american", name: "American Cuisine", emoji: "🍔", color: "#1E5AA8", recipes: [
    { code: "AM-001", title: "Sample American Card", front: "sample-card.svg", back: "sample-card-back.svg" }
  ]},
  { id: "mexican", name: "Mexican Cuisine", emoji: "🌮", color: "#9E2A2B", recipes: [] },
  { id: "italian", name: "Italian Cuisine", emoji: "🍝", color: "#3FA35B", recipes: [] },
  { id: "asian", name: "Asian Cuisine", emoji: "🥢", color: "#F4B183", recipes: [] },
  { id: "side-dishes", name: "Side Dishes", emoji: "🥔", color: "#2E2E2E", recipes: [] },
  { id: "breads-rolls", name: "Breads & Rolls", emoji: "🍞", color: "#D9A441", recipes: [] },
  { id: "smoked-meats", name: "Smoked Meats", emoji: "🥩", color: "#6E1E2E", recipes: [] },
  { id: "desserts", name: "Desserts", emoji: "🥧", color: "#B9D7EA", recipes: [] }
];
