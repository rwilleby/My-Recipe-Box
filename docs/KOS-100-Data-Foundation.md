# KOS-100 — Data Foundation v1

## Purpose

KOS records what happens to food after a user cooks. It supports a 30-second path while preserving optional detail for batch cooks.

## Core records

- **Session** — produce, transform, recover, or assemble.
- **Inventory lot** — a quantity of a cooked component or ready-to-eat product.
- **Inventory event** — addition, use, adjustment, transformation, or assembly.
- **Package record** — container type, count, portion size, label, and location.
- **Consumption event** — food eaten from a session or inventory lot.

## Item types

- Component
- Finished meal
- Lunch
- Snack
- Dessert
- Family meal
- Ingredient pack

## Supported first-release workflows

1. Cook a finished meal, eat some, and freeze the rest.
2. Cook a side or protein and retain it as a reusable component.
3. Transform an existing cooked component into another food.
4. Recover food that might otherwise be wasted.
5. Assemble components into Complete Dinners.
6. Package outputs in bowls, deli cups, mini pies, vacuum bags, or other containers.
7. Consume or adjust stored quantities.
8. Export and restore KOS data as JSON.

## Progressive detail

The quick path needs only:

1. What was made?
2. Total yield.
3. Amount eaten now.
4. Amount saved.
5. Saved as a meal or component.

Container, location, label, Complete Dinner code, notes, and lineage are optional.

## Storage and privacy

KOS uses versioned browser local storage. No login, identity, cloud account, or personal profile is required. The repository accepts a storage adapter so tests and future import/export tools do not depend directly on the browser.

## Quantity safety

KOS prevents:

- Saving and eating more than the stated yield.
- Using more of a component than is available.
- Creating an assembly with no components.
- Negative or invalid quantities.

## Food lineage

Outputs retain source lot IDs and source session IDs. This supports histories such as:

Ground beef → grilled patties → patties with onion gravy → Complete Dinner → frozen → consumed.
