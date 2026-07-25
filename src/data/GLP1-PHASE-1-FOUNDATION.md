# GLP-1 Nutrition Support — Phase 1 Foundation

This phase adds backward-compatible storage and normalization only. It does not display GLP-1 claims, badges, ratings, or scores.

## Safety rules

- Existing recipes remain valid without GLP-1 fields.
- Unreviewed records normalize to `glp1ReviewStatus: "Not Reviewed"`.
- An unreviewed record cannot retain a visible rating, score, or `glp1Friendly` claim.
- The provisional scoring utility returns `null` unless all required nutrition fields exist.
- Calculated values are not considered verified.
- The scoring weights live in `glp1Nutrition.js` so they can be revised centrally.

## Required fields before score calculation

- caloriesPerServing
- proteinGramsPerServing
- fiberGramsPerServing
- addedSugarGramsPerServing
- saturatedFatGramsPerServing

## Sample records

`glp1-sample-classifications.json` contains safe, unreviewed structural examples for:

- SD-025 Glazed Carrots
- AM-001 Salisbury Steak

These examples do not assign nutrition values, medical claims, ratings, or scores.
