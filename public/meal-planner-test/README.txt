ROBERT'S RECIPE BOX — DEPLOYABLE MEAL PLANNER TEST

This test page now lives under public/meal-planner-test so Vite copies it into dist.
After GitHub Pages deploys the site, open:

  <your GitHub Pages site>/meal-planner-test/

Repairs included:
- Uses local WEBP recipe thumbnails instead of external placeholder images.
- Uses AM-000 as the image fallback when a thumbnail is unavailable.
- Rejects main dishes in side slots and side dishes in the main slot.
- Normalizes saved browser data so stale or invalid recipe codes do not break rendering.
- Includes a dialog fallback for browsers without showModal support.
- Remains isolated from the main website and uses localStorage only.
