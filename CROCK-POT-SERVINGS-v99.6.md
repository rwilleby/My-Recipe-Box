# Crock Pot Portions — v99.6

## Standard

Every Crock Pot recipe now uses **6 servings per pot**.

## What changed

- Set the Crock Pot category default to six servings.
- Enforced six servings for every recipe whose code begins with `CP-`, including the vegan Crock Pot variant.
- Prevented older saved browser overrides from changing a Crock Pot recipe to a different yield.
- Standardized Crock Pot nutrition panels to show six servings per recipe.
- Shopping-list and cost scaling now use six servings as the base Crock Pot yield.
- Corrected standardized shopping quantities so portion scaling reaches the final consolidated list.

## Verification

- Added regression coverage for all Crock Pot recipes, nutrition display, saved overrides, and shopping-list scaling.
- The complete current test suite and production build were run before packaging.
