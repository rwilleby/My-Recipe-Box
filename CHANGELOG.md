# v82.11 — Repeated Food-Line Inventory Headers

- Removed the single column-header row from the top of each inventory category.
- Repeated the column meanings beside every food-family name so they remain visible while scrolling: RAW/COOKED, TYPE, UNIT, HAVE, BUY, and NOTES.
- Changed the food name and repeated labels to the site’s olive green.
- Increased the ledger text by approximately 25%, including 15px food names and 10px inventory values.
- Changed the Notes placeholder to “YOUR NOTES…” and matched its 15px type size to the food name.
- Widened TYPE, narrowed UNIT and NOTES, and moved HAVE and BUY closer together.
- Preserved saved inventory records, automatic saving, printing, custom items, purchasing actions, responsive iPad behavior, and Backup & Restore.

# v82.10 — Seven-Column Uppercase Inventory Ledger

- Split the combined Form / Package field into two distinct columns: FORM and PACKAGE.
- Established seven clearly aligned information zones: FOOD, STORAGE, FORM, PACKAGE, HAVE, BUY, and NOTES.
- Changed all ledger labels and values to uppercase sans-serif type.
- Increased FOOD names for quick scanning while reducing the remaining ledger type slightly.
- Widened FOOD and NOTES, kept HAVE and BUY compact, and used shared grid tracks to hold every heading and value in exact alignment.
- Preserved the compact rows, responsive iPad behavior, all existing inventory data, automatic saving, printing, custom items, purchasing actions, and Backup & Restore.

# v82.9 — Compact Master Inventory Ledger

- Replaced the four-column family bands with the approved Option B ledger: Food, Storage, Form / Package, Have, Buy, and Notes.
- Displays each food-family name once while keeping every fresh, frozen, canned, refrigerated, instant, jarred, dry, or prepared form on its own narrow row.
- Added one shared, single-line Notes field for each food family.
- Reduced the quantity-control type and row depth while retaining practical touch targets and numeric entry on iPad.
- Added a responsive small-screen layout that keeps Storage, Form / Package, Have, and Buy aligned and moves Notes beneath each family.
- Preserved existing saved inventory records, automatic saving, purchase recording, printing, custom items, search, accordions, and Backup & Restore compatibility.

# v82.8 — Four-Column Master Inventory Bands

- Reformatted every food family as one shallow horizontal band with four equal columns: Fresh, Frozen, Canned, and Instant/Jar.
- Added HAVE | BUY directly to the header of each inventory-type column.
- Kept product form and counting unit on the same compact line.
- Reduced counter text to 8px, counter height to 19px, and product rows to 21px.
- Kept Notes as one short line beneath the inventory columns.
- Added responsive two-column behavior for iPad-width screens and single-column behavior for narrow phones.

# v82.7 — Master Inventory Density Refinement

- Reduced the food-family name size.
- Shifted the first product-form column left by narrowing the Fresh, Frozen, Canned, and other storage-label column.
- Kept product forms and counting units together on one thin line.
- Reduced the height of inventory rows and Have | Buy number counters.
- Balanced the two product-form halves and added a subtle center division.
- Reduced family Notes to one compact line.
- Added HAVE and BUY headings above the counter boxes in both halves of every food-family section.

# v82.6 — Compact Master Inventory Matrix

- Reformatted each Master Kitchen Inventory category to match the supplied compact matrix example.
- Displays each food family once with Fresh, Frozen, Canned, Instant, and other applicable storage forms grouped beneath it.
- Arranges product variations in two balanced columns, with a compact Have | Buy quantity pair for every form.
- Replaced repeated item notes with one shared Notes field for the complete food family.
- Expanded Beans, Carrots, Peas, and Potatoes to include the additional forms shown in the supplied example while preserving the five Corn forms.
- Preserved the category accordions, alphabetized families, iPad editing, searching, recorded purchases, custom items, printing, and Backup & Restore.

# v82.5 — Master Kitchen Inventory

- Added one long Master Kitchen Inventory page under Your Kitchen with accordion categories and alphabetized product families.
- Added separate product-form records for fresh, frozen, canned, packaged, and prepared variations, including all five requested corn forms.
- Added every named ingredient currently represented in the recipe library when it is not already covered by the curated catalog.
- Added iPad-friendly Have, Buy, and notes fields with automatic on-device saving.
- Added Record Purchases to move Buy quantities into Have and then clear the Buy quantities.
- Added custom inventory products, catalog search, expand/collapse controls, summary counts, and a printable initial-count worksheet.
- Added Master Kitchen Inventory to full-site Backup & Restore for transfer between an iPad and laptop.
- Established the safety rule that automatic deductions require an exact product form and compatible unit; ambiguous recipe alternatives are not deducted by guesswork.

# v82.4 — Manual and Digital Stock-Check Worksheets

- Added a printable Pantry Staples worksheet covering every staple across all three pantry levels.
- Added a printable Freezer Inventory worksheet covering all default and custom freezer items, with fields for stock, quantity, package, location, and use-by date.
- Added a printable Master Shopping List worksheet covering the current combined shopping list and prepared components selected to buy.
- Added blank paper checkboxes and writing fields so kitchen inventory can be completed manually and then transferred into the matching system pages.
- Preserved the existing current-inventory and shopping-list printouts as separate options.
- Added an iPad-friendly Digital Stock Check mode to Pantry Staples, Freezer Inventory, and the Master Shopping List.
- Connected live pantry checks, freezer checks and quantities, and shopping-list checks to their existing system records immediately.
- Saved digital worksheet quantities and notes locally under the Recipe Box backup namespace so they are included in Backup & Restore.
- Supported moving a completed stock check between an iPad and laptop with the existing manual backup-file export and restore workflow; no cloud account or automatic sync is required.

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
