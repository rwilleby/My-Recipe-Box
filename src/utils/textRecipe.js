import { formatQty } from "./planning.js";

export function formatTextRecipeIngredient(ingredient) {
  if (typeof ingredient === "string" || typeof ingredient === "number") {
    return String(ingredient).trim();
  }
  if (!ingredient || typeof ingredient !== "object") return "";

  const quantity = Object.prototype.hasOwnProperty.call(ingredient, "cookingQuantity")
    ? ingredient.cookingQuantity
    : (ingredient.amount ?? ingredient.qty ?? ingredient.quantity);
  const quantityText = ingredient.recipeQuantityText || (quantity === null || quantity === undefined || quantity === ""
    ? ""
    : String(formatQty(quantity)).trim());
  const unit = String(Object.prototype.hasOwnProperty.call(ingredient, "cookingUnit")
    ? ingredient.cookingUnit
    : (ingredient.unit || "")).trim();
  const name = String(
    ingredient.item || ingredient.name || ingredient.ingredient || ingredient.label || "",
  ).trim();

  const preparation = ingredient.displayPreparationSeparately
    ? String(ingredient.preparation || "").trim()
    : "";
  const optional = ingredient.displayPreparationSeparately && ingredient.optional && !/\boptional\b/i.test(preparation) ? "optional" : "";
  const detail = [preparation, optional].filter(Boolean).join(", ");
  return `${[quantityText, unit, name].filter(Boolean).join(" ")}${detail ? `, ${detail}` : ""}`;
}

export function getTextRecipeContent(recipe) {
  const ingredients = Array.isArray(recipe?.ingredients)
    ? recipe.ingredients.map(formatTextRecipeIngredient).filter(Boolean)
    : [];
  const directions = Array.isArray(recipe?.directions)
    ? recipe.directions.map((direction) => String(direction || "").trim()).filter(Boolean)
    : [];

  return {
    ingredients,
    directions,
    available: ingredients.length > 0 && directions.length > 0,
  };
}
