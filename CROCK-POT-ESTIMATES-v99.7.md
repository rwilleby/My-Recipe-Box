# Crock Pot Estimated Nutrition — v99.7

## What changed

- Crock Pot listing cards now show midpoint estimates instead of blank nutrition values.
- Estimated values are clearly marked with a tilde:
  - `~400 cal`
  - `~36g protein`
  - `MB ~6`
- Calories use the midpoint of the existing recipe-type range, rounded to the nearest five.
- Protein uses the midpoint, rounded to the nearest whole gram.
- Estimated MealBalance uses the midpoint calories and total fat with the existing MealBalance nutrition rules.
- All estimates remain based on six servings per Crock Pot batch.
- When verified nutrition becomes available, it takes priority and the tilde is removed automatically.

## Verification

- Added coverage for every Crock Pot recipe and the exact-versus-estimated display behavior.
- The complete regression suite and production build were run before packaging.
