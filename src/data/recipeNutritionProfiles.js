export const recipeNutritionProfiles = {
  "MX-010": {
    recipeCode: "MX-010",
    title: "Quesadillas",
    status: "provisional",
    statusLabel: "Estimated nutritional information",
    defaultVariant: "standard",
    variants: {
      standard: {
        label: "Standard Recipe",
        nutritionFacts: {
          servingSize: "Pending validated database entry",
          servingsPerRecipe: "Pending validated database entry",
          calories: "—",
          totalFat: "—",
          saturatedFat: "—",
          transFat: "—",
          cholesterol: "—",
          sodium: "—",
          totalCarbohydrate: "—",
          dietaryFiber: "—",
          totalSugars: "—",
          addedSugars: "—",
          protein: "—"
        },
        mealBalance: { score: "Not yet assigned", label: "Database review pending" },
        eatingWell: "Profile reserved for the approved standard MX-010 recipe. Validated nutrition values have not yet been entered.",
        storage: "Use the storage and reheating directions printed on the recipe card until a validated Food Intelligence storage record is added.",
        perStandardServing: "Numeric values are intentionally withheld until the precomputed database profile is reviewed.",
        portionInformation: "Standard serving definition is pending database review.",
        recipeDNA: ["Mexican cuisine", "Quesadilla", "Version 1 pilot profile"],
        dietaryProfile: ["Dietary tags pending validated nutrition data"],
        pairsWellWith: ["Pairing recommendations pending editorial review"],
        goodToKnow: "This pilot demonstrates stored-profile rendering only. It does not calculate nutrition in the browser.",
        cooksTip: "Select another stored variant to confirm that the card updates immediately without recalculating ingredients.",
        dataNotes: "Provisional pilot record. No numeric nutrition values are displayed because validated precomputed values have not yet been supplied."
      },
      reducedSodium: {
        label: "Reduced-Sodium Profile",
        nutritionFacts: {
          servingSize: "Pending validated database entry",
          servingsPerRecipe: "Pending validated database entry",
          calories: "—",
          totalFat: "—",
          saturatedFat: "—",
          transFat: "—",
          cholesterol: "—",
          sodium: "—",
          totalCarbohydrate: "—",
          dietaryFiber: "—",
          totalSugars: "—",
          addedSugars: "—",
          protein: "—"
        },
        mealBalance: { score: "Not yet assigned", label: "Reduced-sodium profile pending" },
        eatingWell: "Reserved for a precomputed reduced-sodium MX-010 profile. No reduction claim is displayed until validated values are stored.",
        storage: "Storage guidance remains the same as the approved recipe card until a validated variant record is added.",
        perStandardServing: "Reduced-sodium numeric values are pending validated database entry.",
        portionInformation: "Variant serving definition is pending database review.",
        recipeDNA: ["Mexican cuisine", "Quesadilla", "Reduced-sodium profile placeholder"],
        dietaryProfile: ["No dietary claim published until validation"],
        pairsWellWith: ["Pairing recommendations pending editorial review"],
        goodToKnow: "Selecting this option reads a separate stored profile; the browser performs no ingredient-level calculation.",
        cooksTip: "Use only a reviewed lower-sodium ingredient profile when final values are added.",
        dataNotes: "Provisional variant shell. All numeric fields remain intentionally blank pending precomputed database values."
      },
      higherProtein: {
        label: "Higher-Protein Profile",
        nutritionFacts: {
          servingSize: "Pending validated database entry",
          servingsPerRecipe: "Pending validated database entry",
          calories: "—",
          totalFat: "—",
          saturatedFat: "—",
          transFat: "—",
          cholesterol: "—",
          sodium: "—",
          totalCarbohydrate: "—",
          dietaryFiber: "—",
          totalSugars: "—",
          addedSugars: "—",
          protein: "—"
        },
        mealBalance: { score: "Not yet assigned", label: "Higher-protein profile pending" },
        eatingWell: "Reserved for a precomputed higher-protein MX-010 profile. No protein claim is displayed until validated values are stored.",
        storage: "Storage guidance remains the same as the approved recipe card until a validated variant record is added.",
        perStandardServing: "Higher-protein numeric values are pending validated database entry.",
        portionInformation: "Variant serving definition is pending database review.",
        recipeDNA: ["Mexican cuisine", "Quesadilla", "Higher-protein profile placeholder"],
        dietaryProfile: ["No dietary claim published until validation"],
        pairsWellWith: ["Pairing recommendations pending editorial review"],
        goodToKnow: "This option proves that Food Intelligence content can change instantly between precomputed profiles.",
        cooksTip: "Final protein values must come from the reviewed database profile, not from browser estimation.",
        dataNotes: "Provisional variant shell. All numeric fields remain intentionally blank pending precomputed database values."
      }
    }
  }
};

export function normalizeRecipeCode(recipeCode) {
  return String(recipeCode || "").trim().toUpperCase();
}

export function getRecipeNutritionRecord(recipeCode) {
  return recipeNutritionProfiles[normalizeRecipeCode(recipeCode)] || null;
}

export function hasRecipeNutritionRecord(recipeCode) {
  return Boolean(getRecipeNutritionRecord(recipeCode));
}

export function getRecipeNutritionVariant(recipeCode, variantKey) {
  const record = getRecipeNutritionRecord(recipeCode);
  if (!record) return null;
  const selectedKey = variantKey && record.variants?.[variantKey]
    ? variantKey
    : record.defaultVariant || Object.keys(record.variants || {})[0];
  if (!selectedKey) return null;
  return { key: selectedKey, profile: record.variants[selectedKey], record };
}
