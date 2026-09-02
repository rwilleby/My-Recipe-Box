export const AUTO_IMAGE_PREFIXES = new Set([
  "AM", "AS", "CC", "CO", "CP", "CR", "DM", "DN", "DS", "HB", "HBP", "IT", "JJ", "KR", "LF",
  "MR", "MX", "PM", "QP", "CS", "RS", "SB", "SD", "SF", "SG", "SW", "VG", "HS",
]);

export function recipeCodePrefix(recipeId = "") {
  const match = recipeId.match(/^[A-Z]+/);
  return match ? match[0] : "";
}

export function recipeImageCandidates(recipe) {
  if (!recipe) return [];
  const candidates = [];
  const prefix = recipeCodePrefix(recipe.id);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/thumbs/recipes/${recipe.id}.webp`);
    candidates.push(`images/thumbs/recipes/${recipe.id} .webp`);
    candidates.push(`images/heroes/${recipe.id}.webp`);
    candidates.push(`images/heroes/${recipe.id} .webp`);
  }

  if (recipe.heroImage) candidates.push(recipe.heroImage);
  if (recipe.image) candidates.push(recipe.image);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/heroes/${recipe.id}.webp`);
    candidates.push(`images/heroes/${recipe.id} .webp`);
    candidates.push(`images/recipes/${recipe.id}.webp`);
    candidates.push(`images/recipes/${recipe.id} .webp`);
  }

  return [...new Set(candidates)];
}

export function recipeHeroImageCandidates(recipe) {
  if (!recipe) return [];
  const candidates = [];
  const prefix = recipeCodePrefix(recipe.id);

  if (recipe.heroImage) candidates.push(recipe.heroImage);
  if (recipe.image && /(^|\/)heroes\//i.test(recipe.image)) candidates.push(recipe.image);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/heroes/${recipe.id}.webp`);
    candidates.push(`images/heroes/${recipe.id} .webp`);
  }

  const originalPrefix = recipeCodePrefix(recipe.originalRecipeId);
  if (recipe.originalRecipeId && AUTO_IMAGE_PREFIXES.has(originalPrefix)) {
    candidates.push(`images/heroes/${recipe.originalRecipeId}.webp`);
    candidates.push(`images/heroes/${recipe.originalRecipeId} .webp`);
  }

  return [...new Set(candidates)];
}

export function previewCardImageCandidates(recipe) {
  const candidates = [];
  const prefix = recipeCodePrefix(recipe.id);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/thumbs/recipes/${recipe.id}.webp`);
    candidates.push(`images/thumbs/recipes/${recipe.id} .webp`);
  }

  if (recipe.cardImage) candidates.push(recipe.cardImage);
  if (recipe.image) candidates.push(recipe.image);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/recipes/${recipe.id}.webp`);
    candidates.push(`images/recipes/${recipe.id} .webp`);
  }

  if (recipe.heroImage) candidates.push(recipe.heroImage);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/heroes/${recipe.id}.webp`);
    candidates.push(`images/heroes/${recipe.id} .webp`);
  }

  return [...new Set(candidates)];
}

export function fullCardImageCandidates(recipe) {
  const candidates = [];
  const prefix = recipeCodePrefix(recipe.id);

  if (recipe.cardImage) candidates.push(recipe.cardImage);
  if (recipe.image) candidates.push(recipe.image);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/recipes/${recipe.id}.webp`);
    candidates.push(`images/recipes/${recipe.id} .webp`);
    candidates.push(`images/thumbs/recipes/${recipe.id}.webp`);
    candidates.push(`images/thumbs/recipes/${recipe.id} .webp`);
  }

  if (recipe.heroImage) candidates.push(recipe.heroImage);

  if (recipe.id && AUTO_IMAGE_PREFIXES.has(prefix)) {
    candidates.push(`images/heroes/${recipe.id}.webp`);
    candidates.push(`images/heroes/${recipe.id} .webp`);
  }

  return [...new Set(candidates)];
}
