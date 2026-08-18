const ESTIMATE_TEMPLATES = {
  chicken: {
    calories: "320–480",
    totalFat: "12–24 g",
    saturatedFat: "4–10 g",
    transFat: "0–1 g",
    cholesterol: "80–140 mg",
    sodium: "600–1,000 mg",
    totalCarbohydrate: "12–32 g",
    dietaryFiber: "1–5 g",
    totalSugars: "3–10 g",
    addedSugars: "0–6 g",
    protein: "28–44 g",
  },
  beef: {
    calories: "380–560",
    totalFat: "18–34 g",
    saturatedFat: "7–14 g",
    transFat: "0–2 g",
    cholesterol: "85–150 mg",
    sodium: "650–1,100 mg",
    totalCarbohydrate: "14–38 g",
    dietaryFiber: "2–6 g",
    totalSugars: "4–12 g",
    addedSugars: "0–8 g",
    protein: "28–42 g",
  },
  pork: {
    calories: "350–520",
    totalFat: "16–30 g",
    saturatedFat: "5–12 g",
    transFat: "0–1 g",
    cholesterol: "75–135 mg",
    sodium: "650–1,150 mg",
    totalCarbohydrate: "14–40 g",
    dietaryFiber: "1–5 g",
    totalSugars: "4–16 g",
    addedSugars: "0–12 g",
    protein: "26–40 g",
  },
  soup: {
    calories: "240–420",
    totalFat: "8–22 g",
    saturatedFat: "3–10 g",
    transFat: "0–1 g",
    cholesterol: "35–100 mg",
    sodium: "650–1,200 mg",
    totalCarbohydrate: "22–48 g",
    dietaryFiber: "3–9 g",
    totalSugars: "4–12 g",
    addedSugars: "0–5 g",
    protein: "16–32 g",
  },
  breakfast: {
    calories: "300–480",
    totalFat: "12–28 g",
    saturatedFat: "5–12 g",
    transFat: "0–1 g",
    cholesterol: "90–220 mg",
    sodium: "500–950 mg",
    totalCarbohydrate: "28–58 g",
    dietaryFiber: "2–7 g",
    totalSugars: "5–18 g",
    addedSugars: "0–12 g",
    protein: "14–28 g",
  },
  side: {
    calories: "160–340",
    totalFat: "5–18 g",
    saturatedFat: "2–8 g",
    transFat: "0–1 g",
    cholesterol: "0–55 mg",
    sodium: "300–750 mg",
    totalCarbohydrate: "24–52 g",
    dietaryFiber: "2–8 g",
    totalSugars: "3–14 g",
    addedSugars: "0–8 g",
    protein: "4–14 g",
  },
  dessert: {
    calories: "280–460",
    totalFat: "10–24 g",
    saturatedFat: "4–12 g",
    transFat: "0–1 g",
    cholesterol: "25–90 mg",
    sodium: "180–520 mg",
    totalCarbohydrate: "42–72 g",
    dietaryFiber: "1–5 g",
    totalSugars: "24–48 g",
    addedSugars: "18–40 g",
    protein: "3–9 g",
  },
  general: {
    calories: "300–500",
    totalFat: "12–28 g",
    saturatedFat: "4–12 g",
    transFat: "0–1 g",
    cholesterol: "45–120 mg",
    sodium: "550–1,050 mg",
    totalCarbohydrate: "20–48 g",
    dietaryFiber: "2–7 g",
    totalSugars: "4–16 g",
    addedSugars: "0–10 g",
    protein: "18–36 g",
  },
};

function estimateType(recipe) {
  const title = String(recipe?.title || "").toLowerCase();
  const number = Number(String(recipe?.id || "").match(/^CP-(\d{3})$/)?.[1] || 0);

  if (number >= 171) return "dessert";
  if (number >= 156) return "side";
  if (number >= 146) return "breakfast";
  if (/soup|stew|chili|chowder|gumbo/.test(title)) return "soup";
  if (/chicken|turkey/.test(title)) return "chicken";
  if (/beef|steak|roast|meatloaf|hamburger|barbacoa|birria|corned/.test(title)) return "beef";
  if (/pork|ham|carnitas|rib|sausage|kielbasa/.test(title)) return "pork";
  return "general";
}

export function getCrockPotNutritionEstimate(recipe) {
  if (!String(recipe?.id || "").toUpperCase().startsWith("CP-")) return null;

  return {
    servingSize: "1 serving",
    servingsPerRecipe: recipe?.servings || 6,
    ...ESTIMATE_TEMPLATES[estimateType(recipe)],
    estimatedRange: true,
    estimateNote:
      "Estimated range based on the recipe type. Brands, portions, retained sauce, and optional serving additions can change the totals.",
  };
}
