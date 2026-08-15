# Robert's Recipe Box — v78.2 Responsive & Component Audit

## Purpose

This audit identifies the next safe consolidation targets without changing the current appearance.

## Current responsive inventory

- Total `@media` blocks: **552**
- Unique media conditions: **62**

### Most repeated media conditions

- `(max-width: 700px)` — 69 blocks
- `(max-width: 760px)` — 63 blocks
- `(max-width: 640px)` — 54 blocks
- `(max-width: 1100px)` — 47 blocks
- `(max-width: 720px)` — 44 blocks
- `(max-width: 900px)` — 31 blocks
- `(max-width: 1000px)` — 27 blocks
- `(max-width: 560px)` — 22 blocks
- `(max-width: 980px)` — 21 blocks
- `(max-width: 1050px)` — 18 blocks
- `(max-width: 1180px)` — 13 blocks
- `(prefers-reduced-motion: reduce)` — 13 blocks
- `(max-width: 620px)` — 10 blocks
- `(max-width: 820px)` — 10 blocks
- `(max-width: 1250px)` — 8 blocks
- `(min-width: 1001px)` — 7 blocks
- `(max-width: 1120px)` — 6 blocks
- `(max-width: 860px)` — 6 blocks
- `print` — 5 blocks
- `(max-width: 1080px)` — 5 blocks

## Most repeated selectors across scopes

- `.homeRolodexCard img` — 37 occurrences
- `.homeRolodexHolderArt` — 31 occurrences
- `.homeRolodexCard` — 27 occurrences
- `.homeRolodexStage` — 26 occurrences
- `.homeShowcaseLeftColumn` — 24 occurrences
- `.heroInfoButtons` — 20 occurrences
- `.heroInfoButton` — 19 occurrences
- `.homeMealJourneyToggle` — 19 occurrences
- `.pageHeroTextOverlay h1` — 18 occurrences
- `.homeCategoryGrid` — 17 occurrences
- `.homeShowcaseRolodexColumn .homeRolodex` — 16 occurrences
- `.homeFeatureCard.featuredSelectionCard, .homeFeatureCard.productsIUseCard` — 16 occurrences
- `.pageTopHeroImage` — 16 occurrences
- `.pageHeroTextOverlay p` — 16 occurrences
- `.homeMealJourneyToggleText small` — 16 occurrences
- `.cardViewerHeader` — 15 occurrences
- `.homeMiniSectionHeader h2` — 15 occurrences
- `.homeCollectionButtonGrid` — 15 occurrences
- `.productsIUsePageCard` — 15 occurrences
- `.pageHeroTextOverlay` — 15 occurrences
- `.homeMealJourneyToggleText strong` — 15 occurrences
- `.cardViewerQuickNutritionItem` — 14 occurrences
- `:root` — 13 occurrences
- `.cardViewer` — 13 occurrences
- `.pageHeroEyebrow` — 13 occurrences
- `.dinnerCombinationHeating` — 13 occurrences
- `.weeklyCalendarPlannerPage` — 13 occurrences
- `.homeRolodexNav` — 12 occurrences
- `.navDropdownButton` — 12 occurrences
- `.homeCategoryGrid, .categoryGrid.homeCategoryGrid` — 12 occurrences

## Interpretation

Repeated selectors are not automatically duplicates. Many occur in different responsive scopes or later override blocks, so v78.2 intentionally leaves them in place unless they are adjacent and can be merged without changing cascade order.

The next higher-risk consolidation pass should be component-by-component, starting with components that have the largest number of repeated selectors. Each component should be visually checked after migration.

## Recommended component migration order

1. Homepage category / Quick Links grid
2. Large page hero + hero text overlay
3. Recipe listing cards
4. Weekly Meal Planner
5. Complete Dinner cards and finder
6. Slow Cooker finder
7. Inventory page headers and controls
8. Video panels / popups
9. General buttons and segmented controls

Do not globally merge scattered media blocks merely because their conditions are identical; moving them can change cascade order.
