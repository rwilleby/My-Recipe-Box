# v82.3 — Reminder Ribbon Palette Refinement

- Changed the Reminder Ribbon background to the site’s original light-beige page color (`#fbfaf7`).
- Changed the sentence and inline action text to a complementary dark beige (`#6f6252`).
- Preserved the quarter-inch height, hero-width alignment, centered italic text, weight-600 inline action, and fade transition.

# v82.2 — Kitchen Reminder Ribbon

- Added a calm, site-wide reminder ribbon directly beneath the main navigation, using a subtle beige treatment slightly darker than the header.
- Added prioritized reminders for due backups, refrigerator food due within three days, frozen inventory due within 30 days, unfinished weekend bulk-cooking batches, empty meal plans, and shopping-list review.
- Added each direct action as clickable text at the end of its reminder sentence.
- Kept the ribbon to one centered italic line at a fixed quarter-inch height, including on smaller screens.
- Matched the ribbon width to the large hero image, reduced inline action text to visually match the sentence, and added a soft fade-out/fade-in transition.
- Preserved the calm nine-second reminder rotation without visible buttons, counters, or rotation controls; rotation pauses on hover, keyboard focus, and reduced-motion preference.
- Connected Weekend Bulk Meal Planner saves to same-tab reminder updates.
- Added responsive and print-safe ribbon styling plus a focused regression test.

# v82.1 — Quick Dinner Hero-Only Rotation

- Limited the “Looking for Quick Dinner Ideas?” rotation to Complete Dinners with an approved, available hero image.
- Prevented text placeholders and dinners without a published hero from entering the homepage rotation.
- Preserved the six-card layout, cuisine-slot preference, one-minute rotation, crossfade behavior, and no-duplicate selection.
- Added safe hero-only fallback selection when a preferred cuisine does not yet have an available dinner hero.

# v82.0 — Compact Admin Recipe Categorization Layout

- Moved the single-recipe selector into a full-width horizontal strip above the editor.
- Added a selected-recipe identity bar with the recipe hero, code, name, category, and assignment count.
- Preserved full hero visibility with an uncropped `object-fit: contain` preview and safe image fallbacks.
- Grouped Primary Category, Collections, Recipe Attributes, and Cooking Methods into one compact categorization section.
- Arranged the three category groups side by side on wide screens with responsive two-column and single-column fallbacks.
- Preserved group editing, Auto-Classify, GLP-1 review, browser storage, JSON import/export, and all public recipe pages.

# v81b / 81.1.0 — Safe Repository and Media Optimization

- Re-encoded Complete Dinner and supporting images at their original pixel dimensions, accepting only valid smaller outputs.
- Converted the oversized All Recipes, Crock Pot, and Desserts PNG icons to WebP and consolidated the duplicate Crock Pot image path.
- Preserved every full-size recipe card and locked full-size hero image byte-for-byte.
- Preserved the previously optimized thumbnails and videos.
- Removed the unused `src/public` asset tree and unreferenced legacy CSS files.
- Removed macOS metadata and added repository exclusions for generated and packaging-only files.
- Repaired malformed v73.18 Weekly Planner CSS selectors and media-query tokens.
- Restored KOS test/runtime clock propagation to repository backup timestamps.
- Restored the omitted Weekend Bulk Production v81 release-contract test file.
- Updated package version labels to 81.1.0.

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
