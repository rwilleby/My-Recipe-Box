# RFIS Complete Dinners Data Layer

This release adds the canonical 151-record Complete Dinners catalog without replacing the currently displayed legacy dinner-combination page.

## Added

- `src/data/completeDinners.js` — canonical RFIS records using stable `CD-####` IDs and legacy `meal-###` IDs.
- `src/data/completeDinnerCollections.js` — collection-to-dinner relationships.
- `src/utils/completeDinnerValidation.js` — validates recipe references, IDs, side counts, and hero layouts.

## Deliberately not activated yet

The legacy `dinnerCombinations.js` remains connected to the current UI until nutrition aggregation and the UI adapter are completed. This avoids publishing incomplete or inaccurate nutrition totals during migration.

## Override reset

Built-in recipe overrides are empty and the browser storage key has advanced to `rrb_recipe_overrides_v2`, so earlier browser corrections no longer load. The Recipe Editor remains available for future use.
