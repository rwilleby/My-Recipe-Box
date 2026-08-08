# v70a Healthier Default Nutrition Integration

## What changed
- Added `src/data/nutrition/healthier-default-v9.json` as the authoritative website nutrition source.
- Updated `src/data/recipeNutritionProfiles.js` so website lookups prefer the Healthier Default record.
- Healthier Default is exposed as the single active default nutrition variant to keep FIC values consistent.
- Existing legacy FIC non-nutrition fields are retained from the old default profile where available.
- `AM-063` remains retired/excluded.
- `AS-003`, `AS-004`, `AS-005`, and `AS-009` remain Not Ready and cannot generate a Food Intelligence Card.
- Admin product-selection wording now states that healthier nutritional suitability comes before retailer priority.
- Added a data-contract test at `test/healthierDefaultNutrition.test.mjs`.

## Data counts
- Active recipes: 469
- Estimated/Card-usable: 465
- Not Ready: 4

## Browser rule
Stored nutrition values only. Nutrition is not recalculated or invented in the browser.

## Verification
- `node test/healthierDefaultNutrition.test.mjs` — PASS
- `npm run build` could not be executed in the sandbox because the configured npm package mirror returned 404 for `yallist@3.1.1` during `npm ci`. This is an environment/dependency-download limitation, not a source-code test failure.
