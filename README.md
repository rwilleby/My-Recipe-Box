# Robert's Recipe Box — Browser-Based V1

This is the first easy browser-based version of Robert's Recipe Box.

## What it includes

- Modern landing page based on the approved clean recipe-library style
- AI transparency wording
- Recipe/category browsing
- Favorites saved in the browser with `localStorage`
- Weekly dinner planner saved in the browser
- Shopping list generated from the weekly plan
- Cost estimator for servings of 2, 4, and 6
- No login, no database, no account system

## Local storage keys

- `rrb_favorites`
- `rrb_weeklyPlan`
- `rrb_shoppingList`
- `rrb_servingSize`

## How to run

```bash
npm install
npm run dev
```

## How to use in your existing `my-recipe-box` repo

Option A: copy the whole folder into a new clean Vite project.

Option B: copy these files into your current project:

```text
src/App.jsx
src/App.css
src/main.jsx
src/data/recipes.js
src/utils/storage.js
src/utils/planning.js
```

Then run:

```bash
npm run dev
```

## Future phases

This version intentionally avoids login/accounts and cloud sync. Later, the same interface can be connected to Supabase, Firebase, or another backend so users can sync favorites and plans across devices.
