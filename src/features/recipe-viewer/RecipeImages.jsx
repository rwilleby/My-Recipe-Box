import { useEffect, useState } from "react";
import {
  previewCardImageCandidates,
  recipeImageCandidates,
} from "./recipeAssets.js";

export function RecipeImage({ recipe }) {
  const candidates = recipeImageCandidates(recipe);
  const [imageIndex, setImageIndex] = useState(0);
  const imagePath = candidates[imageIndex];

  useEffect(() => {
    setImageIndex(0);
  }, [recipe.id]);

  if (imagePath) {
    return (
      <div className="recipeImage recipePhoto">
        <img
          src={`${import.meta.env.BASE_URL}${imagePath}`}
          alt={recipe.title}
          loading="lazy"
          decoding="async"
          onError={() => setImageIndex((current) => current + 1)}
        />
      </div>
    );
  }

  return (
    <div className="recipeImage" style={{ background: recipe.imageStyle }}>
      <span>{recipe.emoji}</span>
    </div>
  );
}

export function FullRecipeCardPreview({ recipe, onOpen }) {
  const candidates = previewCardImageCandidates(recipe);
  const [imageIndex, setImageIndex] = useState(0);
  const imagePath = candidates[imageIndex];

  useEffect(() => {
    setImageIndex(0);
  }, [recipe.id]);

  if (imagePath) {
    return (
      <button
        className="recipeImage recipeFullCardImage recipeFullCardImageButton"
        onClick={onOpen}
        aria-label={`Open ${recipe.title} recipe card`}
      >
        <img
          src={`${import.meta.env.BASE_URL}${imagePath}`}
          alt={`${recipe.id} ${recipe.title} recipe card`}
          loading="lazy"
          decoding="async"
          onError={() => setImageIndex((current) => current + 1)}
        />
      </button>
    );
  }

  return <RecipeImage recipe={recipe} />;
}
