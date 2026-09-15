# My Recipe Box v100.1 — Performance Cleanup

This release uses v100 as its authoritative baseline and preserves the approved layout and customer behavior.

## Visitor-facing improvements

- Replaced the eager preload of all seven rotating homepage heroes with a one-image-ahead preload.
- Removed the site-wide preload of every supporting-page hero; each page now loads its own hero when visited.
- Changed the off-screen Favorites quick-link icon from eager to lazy loading.
- Removed the obsolete supporting-hero registry, preload cache, and preload helper.
- Reduced the primary production JavaScript chunk from approximately 1,319.3 KB to 1,317.0 KB before compression.
- Avoids about 488 KB of unnecessary rotating-hero downloads on the initial homepage visit, plus the supporting-page hero preload batch.

## Source-package cleanup

- Added Git exclusions for dependencies, build output, logs, and macOS metadata.
- Removed `.DS_Store` and AppleDouble metadata from the working release.
- Excluded duplicate top-level staging copies of videos, cards, and heroes from the optimized full package. The live assets remain intact under `public/`.

## Verification

- Production build succeeded.
- SEO generation succeeded for 81 pages, 794 recipes, and 151 Complete Dinners.
- All 157 current regression test files passed.
