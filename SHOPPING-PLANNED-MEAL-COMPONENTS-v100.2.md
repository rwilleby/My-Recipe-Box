# Shopping Planned-Meal Components — v100.2

## Change

The **My Planned Meals** cards in Shopping Overview now include a condensed component list beneath each meal title:

- `M` — Main dish
- `S1` — Side 1
- `S2` — Side 2
- `S3` — Side 3, when present

Unused side rows are not displayed.

## Meal support

- Complete Dinners use their saved Main and Side definitions.
- Diet Meals use their structured component definitions.
- Saved Build-A-Meals and individually assembled planner meals use the recipes saved in their planner slots.
- Individual recipes display as the Main component.

## Verification

- 158 current regression test files passed.
- Production build passed.
- SEO generation passed for 81 pages, 794 recipes, and 151 Complete Dinners.
