import { formatQty } from "./planning.js";

export function formatTextRecipeIngredient(ingredient) {
  if (typeof ingredient === "string" || typeof ingredient === "number") {
    return String(ingredient).trim();
  }
  if (!ingredient || typeof ingredient !== "object") return "";

  const quantity = ingredient.amount ?? ingredient.qty ?? ingredient.quantity;
  const quantityText = quantity === null || quantity === undefined || quantity === ""
    ? ""
    : String(formatQty(quantity)).trim();
  const unit = String(ingredient.unit || "").trim();
  const name = String(
    ingredient.item || ingredient.name || ingredient.ingredient || ingredient.label || "",
  ).trim();

  return [quantityText, unit, name].filter(Boolean).join(" ");
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
