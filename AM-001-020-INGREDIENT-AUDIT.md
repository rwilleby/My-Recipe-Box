# AM-001–AM-020 Ingredient Audit

Finalized September 4, 2026 using My-Recipe-Box-v96.11 as the authoritative base.

## Applied

- Added separate canonical identity, recipe-facing name, cooking amount, preparation, alternatives, and shopping-equivalent fields.
- Converted small, medium, and large prepared onions using the approved 1/2-, 1-, and 1 1/2-cup standards.
- Separated can and jar package sizes from cooking units.
- Normalized cooking units to singular names.
- Preserved recipe-approved `or` choices as one requirement with separate acceptable identities.
- Updated Shopping List consolidation to prefer canonical identity.
- Updated inventory coverage to consider canonical names and recipe-approved alternatives.

## Approved missing-detail resolutions

| Recipes | Ingredient issue | Approved resolution |
| --- | --- | --- |
| AM-001, AM-002, AM-005, AM-006, AM-011, AM-020 | Optional herb garnish without quantity | Keep visible in recipe; exclude from automatic Shopping List. |
| AM-003 | 6 cube steaks without total weight | Retain 6 pieces; use about 2 pounds for inventory and shopping. |
| AM-010, AM-011 | 6 chicken breasts/cutlets without total weight | Retain 6 pieces; use about 2 pounds for inventory and shopping. |
| AM-014, AM-015, AM-016, AM-020 | Prepared onion without size | Use 1 cup; shop for about 1 medium onion. |
| AM-013 | Cooked ham listed as 3–4 pounds | Display 3–4 pounds; use 3 1/2 pounds for calculations. |
| AM-019 | Diced potato without size | Use 1 cup; shop for about 1 medium russet potato. |

All 15 previously flagged entries are resolved. There are no outstanding
conversion questions in AM-001–AM-020. Original source quantities and wording
remain available in `originalName` and `originalUnit`. Recipe IDs, images,
directions, designs, and unrelated features were not changed.
