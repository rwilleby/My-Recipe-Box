# Robert's Recipe Box Ingredient Standard

Version 1.5 — Asian recipe category audit checkpoint, September 4, 2026

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

## Approved missing-detail defaults

- Optional garnishes without amounts remain visible in recipes and are excluded from automatic Shopping Lists.
- Six cube steaks or six chicken cutlets without total weight retain the six-piece recipe amount and use about 2 pounds for inventory and shopping.
- An unspecified prepared onion means 1 cup, with about 1 medium onion as the shopping equivalent.
- A displayed 3–4-pound ham range uses 3 1/2 pounds only for consolidation, cost, and inventory calculations.
- An unspecified diced potato in a measured filling means 1 cup, with about 1 medium russet potato as the shopping equivalent.
- Two cups cooked diced or shredded chicken use about 1 pound raw boneless chicken for shopping; 3 cups use about 1 1/2 pounds.
- Six cups mashed potatoes use about 3 pounds potatoes for shopping; prepared mashed potatoes are an accepted alternative.
- Unmeasured serving suggestions remain visible in recipes and are excluded from automatic Shopping Lists.
- Six cooked bacon slices use about 6 ounces raw bacon for shopping; 1/2 cup cooked crumbled bacon uses about 8 ounces raw.
- Six mixed bone-in chicken pieces remain six recipe pieces and use about 3 pounds for shopping.
- The same approved chicken yield extends proportionally: 4 cups cooked chicken use about 2 pounds raw boneless chicken.
- Six bone-in chicken thighs use about 3 pounds for shopping.
- Unmeasured optional accompaniments and optional ingredients remain visible in recipes and are excluded from automatic Shopping Lists.
- Six boneless pork chops use about 2 pounds for shopping; six bone-in pork chops use about 3 pounds.
- Six half-inch ham steaks use about 3 pounds for shopping.
- One meaty ham hock uses about 1 1/2 pounds for shopping; the recipe-approved alternative of 2 cups diced ham uses about 12 ounces.
- Four cups prepared mashed potatoes use about 2 pounds potatoes or prepared mashed potatoes for shopping.
- One cup cooked crumbled bacon uses about 16 ounces raw bacon for shopping.
- Two cups cooked diced ham use about 12 ounces diced ham for shopping.
- Sized red, white, yellow, and sweet onions use the same approved volume equivalents as standard onions while retaining the onion variety.
- Two cups sliced cooked turkey use about 1 pound raw boneless turkey or 12 ounces prepared cooked turkey for shopping.
- Package-size separation applies to bottles and bags as well as cans and jars.
- Ingredient preparation written in the source unit, such as `drained`, is moved into the separate preparation field.
- Repeated ingredients within one recipe may use unit-specific resolutions so a measured ingredient is not confused with an unmeasured frying or serving entry.

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
