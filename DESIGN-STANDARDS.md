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
