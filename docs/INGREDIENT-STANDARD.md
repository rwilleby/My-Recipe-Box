# Robert's Recipe Box Ingredient Standard

Version 1.0 — approved September 4, 2026

Each audited ingredient separates: canonical inventory identity, recipe-facing
name, cooking quantity and unit, preparation, and practical shopping equivalent.

## Core rules

- Canonical identity describes the food, not capitalization, preparation, package, or measurement.
- Recipe-approved alternatives remain separate identities in one choice group; either may satisfy the recipe.
- Cooking units are singular internally and pluralized only for display.
- Meat, poultry, and seafood primarily use pounds or ounces.
- Chopped, diced, and sliced produce generally use cups; naturally whole produce may use `each`.
- Onion equivalents are: small = 1/2 cup, medium = 1 cup, large = 1 1/2 cups, extra-large = 2 cups.
- Package sizes never live inside the cooking unit. A 15-ounce can is 15 ounces needed plus a one-can shopping equivalent.
- Preparation such as sliced, diced, drained, softened, divided, or optional is stored separately.
- `optional`, `to taste`, and `as needed` are instructions, never units.
- Uncertain conversions are retained from the source and marked `needs-review`; they are never guessed.

## Inventory matching

Inventory reconciliation uses canonical identity first. Exact products satisfy a
requirement automatically. A recipe-approved alternative may also satisfy it and
is labeled as a substitute. Merely related products remain suggestions and do not
automatically clear the Shopping List requirement.

## Shopping consolidation

Shopping requirements consolidate by canonical identity and compatible cooking
unit. Preparation remains visible to the recipe but does not create duplicate
purchases. Practical package suggestions are rounded only on the Shopping List;
recipe quantities are never rounded to store packages.

## Audit checkpoints

Recipes are audited category-by-category. Each checkpoint includes tests, a
production build, an uncertainty report, a complete master ZIP, and a ZIP of only
the files needed for GitHub.
