# Robert's Recipe Box v83.0 Stabilization Report

## Release result

v83.0 is a non-visual stabilization release based on the uploaded v83 archive. It preserves the v82.23 interface and content while correcting data protection, versioning, deployment, testing, and packaging issues.

## Completed

- Unified Backup and Restore on the comprehensive version 3 format.
- Included Recipe Box local-storage keys beginning with `rrb_` and `rrb-`.
- Added coverage for individual recipe notes, weekly-planner notes, weekend bulk plans, master inventory, recipe corrections, and KOS records.
- Preserved migration from older version 1 category-based backups.
- Added backup regression coverage to the active release test suite.
- Updated root, lockfile, and retained source-package versions to 83.0.0.
- Changed GitHub Pages to `npm ci` and `npm run check`.
- Added `.gitignore` protections.
- Removed the unused 819 KB duplicate Diet Meals icon while retaining the optimized production icon.
- Excluded macOS metadata from the release archive.

## Verification

- Active release contract suite: passed.
- New v83.0 backup coverage and legacy migration test: passed.
- Production Vite build: passed.
- Production output at verification:
  - JavaScript: approximately 3.86 MB minified / 499 KB gzip.
  - CSS: approximately 1.04 MB / 144 KB gzip.

## Next recommended release

Use v83.1 for an appearance-preserving structural split, beginning with the Home page and Recipe Viewer. Introduce route or feature-level code splitting, move their CSS into feature-owned files, and add desktop/iPad visual regression captures. Do not combine that refactor with new visible features.
