# Vegan Sister Recipe System — Stage 1

## Audit result

Recipes are centralized in `src/data/recipes.js`; the card viewer, routes, favorites, notes, grocery building, meal planner, search, Vegan Library, and backup/restore all use the permanent recipe ID. This makes a separate `-VG` record the safest design: every existing ID-scoped feature remains independent without migrations or changes to original recipe content.

## Permanent record contract

- Original: `veganAlternativeId: "AM-007-VG"`
- Vegan sister: `originalRecipeId: "AM-007"`
- Vegan sister: unique ingredients, directions, card image, nutrition, time, servings, MealBalance, freezer/storage guidance, and `/recipes/am-007-vg/` route.
- `excludeFromRegularLibrary: true` prevents duplicate listing in the regular library while Vegan Library filtering still includes it.
- A reciprocal link is rendered only when the linked record actually exists, so missing links never produce a placeholder or broken control.

## Stage 1 sample

`AM-007 Meatloaf` ↔ `AM-007-VG Lentil Mushroom Loaf`. The original record is unchanged except for its reciprocal link field. The Vegan sister uses its own approved-format card image.

## Files involved

Data: `src/data/recipes.js`, `src/data/veganRecipes.js`. Viewer and navigation: `src/App.jsx`, `src/App.css`. Nutrition fallback: `src/features/recipe-viewer/BrowseRecipeNutritionFacts.jsx`. Card asset: `public/images/recipes/AM-007-VG.webp`. Regression coverage: `test/veganSisterRecipeSystem.test.mjs`, `scripts/run-current-tests.mjs`.

## Repeatable Stage 3 workflow

1. Create and test the Vegan recipe and approved Vegan card independently.
2. Add a `-VG` row to `VEGAN_SISTER_RECIPE_ROWS` with `originalRecipeId`, `excludeFromRegularLibrary`, all independent recipe fields, and exact asset paths.
3. Add the reciprocal original-to-Vegan ID to `SISTER_LINKS`.
4. Add the `public/images/recipes/ORIGINAL-CODE-VG.webp` card.
5. Run `npm run release:gate`; no viewer, routing, favorites, notes, planner, grocery, search, or backup code should need to change.
