# v81.0 — Weekend Bulk Plan Inventory Handoff

- Added a locked muted-taupe selector for Individual Recipes and Complete Meals.
- Added Serve Today, Refrigerator, and Freezer disposition counts that must equal the cooked yield.
- Complete Meals can now be selected directly from the RFIS Complete Dinner catalog.
- Marking a batch Done records one KOS production session and updates grouped frozen inventory.
- Complete Meals are counted only as Complete Meals; their component recipes are retained as lineage metadata and are not counted separately.
- Individual recipes are counted separately from Complete Meals.
- Refrigerator portions are added to refrigerator inventory; Serve Today portions are recorded as consumed during production.
- Labels default to the number of stored packages and remain adjustable.
- Added a direct Frozen Inventory button from the Bulk Plan.
- Repaired KOS test-clock propagation and inherited malformed weekly-planner CSS tokens.
- Removed macOS packaging debris from the release tree and aligned package version labels to 81.0.0.

# v67.1 — Consolidated Kitchen Operations Engineering

Integrated into the supplied v67 UI baseline:

- KOS foundation and data protection
- Production Center
- Kitchen Companion
- Available Meals and inventory intelligence
- Meal Planning Intelligence
- Shopping Intelligence
- Pantry inventory
- Use What I Have foundation
- Shopping/pantry reconciliation
- Stable `kos.kitchen` UI facade
- Complete KOS regression suite

No UI/design files are included in this update.
