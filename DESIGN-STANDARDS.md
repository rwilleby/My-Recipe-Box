# Robert's Recipe Box — Design Standards Foundation

This file records approved standards that should gradually replace page-specific CSS overrides.

## SECTION INTRO

### Headline
- Typeface: Georgia
- Size: 28 px
- Weight: 700 / Bold
- Style: Normal
- Color: #111827
- Alignment: Centered for standalone section intros
- Line height: 1.1

### Supporting sentence
- Typeface: Inter
- Size: 16 px
- Weight: 600 / Semi-Bold
- Style: Normal
- Color: #667085
- Alignment: Centered for standalone section intros
- Line height: 1.3

### Inline CTA
- Typeface: Inter
- Size: 16 px
- Weight: 700 / Bold
- Color: #245C37
- Decoration: Underline

### Video icon
- Gray supplemental video icon
- Inline with headline
- Vertically centered
- Small gap from headline text

## Site Typography Baseline

Existing project baseline remains:
- Georgia for headings
- Inter for body/interface copy

This standards file is descriptive in v78.1. Migration of existing components to these standards should happen only in later controlled passes after the CSS consolidation baseline is visually verified.


## v78.3 Implementation Status

The SECTION INTRO standard is now implemented through one reusable class:

- `rrbSectionIntro`
- `rrbSectionIntroCentered` for standalone centered intros
- `rrbSectionIntroSplit` for page headers that retain right-side controls/counters

The shared implementation is applied to:
- Cuisine Quick Links
- Find a Complete Dinner
- Find a Crock Pot Recipe
- Let's Plan This Weeks Meals
- Favorites
- Refrigerator Inventory
- Prepared Freezer Inventory
- Pantry Staples
- Smart Grocery Picks
- Freezer Meals & Storage
- Shopping List
- Nutrition Guidance for Smaller Meals

The purpose of this migration is to replace page-specific typography overrides with a single reusable site standard.


## v78.4 Structural Standard

SECTION INTRO is now implemented as a real reusable React component named `SectionIntro`.

All migrated instances use the same DOM structure:
- eyebrow (optional)
- shared title row
- title
- video trigger (optional)
- supporting sentence
- actions/counter area (optional)

Variants:
- centered: standalone section introductions
- split: left intro copy with right-side controls or counters

This structural standard replaces attempts to make unrelated legacy markup behave identically through CSS alone.


## v78.7 SECTION INTRO Master Foundation

The approved Refrigerator Inventory example is now the master visual reference.

All SECTION INTRO design values are centralized in CSS root variables:

- `--rrb-section-intro-title-font`
- `--rrb-section-intro-title-size`
- `--rrb-section-intro-title-weight`
- `--rrb-section-intro-title-line-height`
- `--rrb-section-intro-title-color`
- `--rrb-section-intro-copy-font`
- `--rrb-section-intro-copy-size`
- `--rrb-section-intro-copy-weight`
- `--rrb-section-intro-copy-line-height`
- `--rrb-section-intro-copy-color`
- `--rrb-section-intro-title-copy-gap`
- `--rrb-section-intro-bottom-gap`
- `--rrb-section-intro-max-copy-width`
- `--rrb-section-intro-video-gap`
- mobile title/copy sizes

Future global SECTION INTRO changes should modify these tokens only.

Current locked master:
- Initial Caps
- centered for standard section intros
- Georgia 28 px / Bold 700 / #111827 / 1.1
- Inter 16 px / Semi-Bold 600 / #667085 / 1.3
- 10 px title-to-copy gap
- 18 px intro-to-next-section gap
- 980 px max supporting-copy width
- 7 px title-to-video gap


## v79.1 Weekly Meal Planner Controls — Approved Reference

The Weekly Meal Planner is the reference implementation for the ACTION CONTROL ROW standard.

Master outer height:
- 44 px (`--rrb-control-row-height`)

All controls in the row share the same outer height:
- Calendar
- Servings
- Week 1 / Week 2 / 2-Week View
- Copy Week
- View
- Print
- Clear

Role styling:
- Primary action: olive/green fill with white text.
- Secondary action: white background, green border, green text.
- Destructive/Clear: white background, soft-red border, red text.
- Informational capsules: same height/radius family.
- Week selector: segmented control, same outer height.
- Width remains content-driven; height is standardized.

Responsive:
- One row on wide desktop.
- Structured wrapping on medium screens.
- Stacked controls on narrow screens.


## v79.2 Weekly Meal Planner Control Revision

Updated approved reference:
- Master outer height: **38px**
- Controls **must remain on one row**
- No wrapping
- No stacking
- Widths compress proportionally to fit the row
- Width remains function-driven, not equalized
- Font size and horizontal padding may reduce modestly at narrower widths to preserve one-row layout


## v79.4 Segmented Navigation Reference Implementation

The homepage `What Do You Want to Do Today?` selector is the reference implementation of SEGMENTED NAVIGATION.

- One rounded outer container
- 38px overall height
- Five equal-width segments
- No gaps
- Subtle vertical dividers
- Dark bold inactive labels
- Selected segment uses muted taupe/gray fill with white text
- Selected segment has an inset rounded shape
- One row only; no wrapping or stacking
- Width compresses responsively


## v79.5 FILTER CONTROL ROW — Batch Reference

The FILTER CONTROL ROW standard is now applied to:
- Recipe Library: Sort By / Cooking Method / Search / Nutrition & Dietary
- Complete Dinners: Search / Main Protein / Cuisine / Calorie Range / MB / Favorite
- Crock Pot: Search / Protein / Meal Type / Favorite
- Refrigerator Inventory: Search / Filter / View Grocery List
- Freezer Inventory: Search Inventory / Filter / Location / Expand All / Collapse All

Master geometry:
- Labels above controls
- 38px control height
- One aligned baseline
- Shared border/radius/type family
- Function-driven widths
- Search fields, selects, icon toggles, and secondary actions retain appropriate interiors
- One row is preserved by compressing widths/padding rather than stacking


## v79.6 SEGMENTED NAVIGATION — Batch Migration

The locked SEGMENTED NAVIGATION standard is now applied to:
- Complete Dinner categories
- Crock Pot categories
- Reference Guide selector

The homepage `What Do You Want to Do Today?` remains the visual master.

Shared behavior:
- 38px rounded outer container
- one row
- no wrapping or stacking
- subtle vertical dividers
- selected segment uses approved olive/green fill with white text
- inactive segments use light neutral background and dark/green text as appropriate
- equal-width segments within each control
- typography compresses responsively rather than stacking


## v79.7 SEGMENTED NAVIGATION — Default Active Color Revision

Updated locked standard:
- Default selected/active segment = muted gray/taupe
- Active text = white
- Homepage example is the visual master
- Olive/green is NOT the default segmented-navigation selected color
- Olive/green may be used only as an explicitly approved special-case treatment
- All geometry, 38px height, separators, one-row behavior, and responsive compression remain unchanged


## v79.8 Crock Pot Segmented Navigation Width Rule

Correction to SEGMENTED NAVIGATION:
- Equal-width segments remain the default where practical.
- When labels vary significantly in length, content-weighted widths are allowed.
- Crock Pot categories use weighted widths so `BREAKFAST / SIDES / DESSERTS` and other long labels stay on one line without clipping.
- All other segmented-navigation standards remain unchanged: 38px height, gray/taupe active state, white active text, one row, separators, rounded outer container.


## v79.9 SECTION INTRO Typography Revision

Locked master sizes updated:
- SECTION INTRO title: **25px** (was 28px)
- SECTION INTRO supporting copy: **14px** (was 16px)

All other SECTION INTRO standards remain unchanged.


## v79.10 SECTION INTRO Spacing Revision

Master title-to-supporting-copy gap:
- **6px** (was 10px)

Unchanged:
- Title size 25px
- Supporting copy size 14px
- Title line-height 1.1
- Copy line-height 1.3
- All other SECTION INTRO standards
