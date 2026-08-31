# Robert's Recipe Box

Robert's Recipe Box is a local-first React and Vite recipe, meal-planning, inventory, nutrition, and kitchen-operations website deployed through GitHub Pages.

## Requirements

- Node.js 20.19.5 or a compatible current Node 20 release
- npm using the committed `package-lock.json`

## Local development

```bash
npm ci
npm run dev
```

## Release verification

`release.json` is the authoritative version source. `package.json`,
`package-lock.json`, and `src/package.json` are compatibility mirrors. After
changing a release, run `npm run version:sync`; the release gate rejects drift.

Run the same test-and-build command used by GitHub Pages:

```bash
npm run check
```

`npm run check` runs the active contract suite and then creates the production Vite build. Do not publish a release when either phase fails.

## Deployment

Push the verified project to the `main` branch. `.github/workflows/main.yml` installs exact dependencies with `npm ci`, runs `npm run check`, and deploys `dist` to GitHub Pages.

## User data

Visitor information stays in browser storage. The public Backup and Restore page exports Recipe Box-owned local-storage keys beginning with `rrb_` or `rrb-`. Version 3 backups include favorites, recipe notes, plans, shopping information, inventories, weekend bulk plans, preferences, administrative corrections, and KOS records. Version 1 and later Recipe Box backups remain accepted by the restore validator.

Before changing a storage key or adding a new user-data feature:

1. Use an application-owned `rrb_` or `rrb-` key.
2. Add or update a backup test.
3. Verify merge and replace restore behavior.
4. Increment the backup format only when its document structure changes.

## Media standards

- Recipe cards: WebP, 1725 × 1125
- Recipe-card thumbnails: WebP, 720 × 470
- Recipe TRAY heroes: WebP, 1448 × 1086
- Preserve exact recipe IDs and filenames.
- Do not stretch older artwork merely to satisfy dimensions; replace it with a correctly produced source asset.

## Release hygiene

- Update `release.json` and `CHANGELOG.md`, then run `npm run version:sync`.
- Do not commit `node_modules`, `dist`, `.DS_Store`, `._*`, or `__MACOSX` content.
- Use the committed npm lockfile; do not deploy with an unlocked dependency install.
