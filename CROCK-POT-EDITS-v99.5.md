# Crock Pot Meals — v99.5

## What changed

- Rebuilt the Crock Pot Meals listing to follow the approved Complete Dinner card format.
- Replaced the separate filter panel with one compact strip:
  - Search
  - Chicken / Turkey
  - Beef
  - Pork / Ham
  - Sausage
  - Soups / Stews
  - More (Breakfast, Sides, and Desserts)
- The default view includes all Crock Pot recipes, with favorites first and the remaining recipes alphabetical.
- Category results use the same favorites-first, then alphabetical ordering.
- Added five or six defining ingredients to each card when the recipe contains that many meaningful ingredients. Pantry basics are omitted; CP-002 accurately shows its four available defining ingredients.
- Added card facts for calories, protein, Meal Balance (MB), and FF only when the recipe is explicitly freezer friendly.
- Limited the first view to 12 recipes and added progressive “Show More Crock Pot Recipes” loading.
- Added responsive control-strip and ingredient-preview styling.

## Verification

- 156 current regression test files passed.
- Production Vite build passed.
- SEO generation passed: 81 pages, 794 recipes, and 151 Complete Dinners.

## Changed files

- `src/App.jsx`
- `src/App.css`
- `src/utils/crockPotIngredientPreview.js`
- `test/crockPotStandardV995.test.mjs`
- `test/crockPotSpacingCountV854.test.mjs`
- `scripts/run-current-tests.mjs`
