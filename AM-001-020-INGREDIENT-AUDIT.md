# AM-001–AM-020 Ingredient Audit

Checkpoint completed September 4, 2026 using My-Recipe-Box-v96.11 as the authoritative base.

## Applied

- Added separate canonical identity, recipe-facing name, cooking amount, preparation, alternatives, and shopping-equivalent fields.
- Converted small, medium, and large prepared onions using the approved 1/2-, 1-, and 1 1/2-cup standards.
- Separated can and jar package sizes from cooking units.
- Normalized cooking units to singular names.
- Preserved recipe-approved `or` choices as one requirement with separate acceptable identities.
- Updated Shopping List consolidation to prefer canonical identity.
- Updated inventory coverage to consider canonical names and recipe-approved alternatives.

## Needs review — preserved without guessing

| Recipe | Ingredient | Reason |
| --- | --- | --- |
| AM-001 | Chopped parsley | Optional garnish has no quantity. |
| AM-002 | Chopped parsley | Optional garnish has no quantity. |
| AM-003 | 6 cube steaks | Total weight is not stated. |
| AM-005 | Parsley | Optional garnish has no quantity. |
| AM-006 | Fresh parsley or basil | Optional garnish has no quantity. |
| AM-010 | 6 thin chicken breasts or cutlets | Total weight is not stated. |
| AM-011 | 6 chicken breasts or cutlets | Total weight is not stated. |
| AM-011 | Parsley | Optional garnish has no quantity. |
| AM-013 | Cooked ham, 3–4 lb | Source provides a weight range rather than one required amount. |
| AM-014 | Onion, cut in chunks | Onion size is not stated. |
| AM-015 | Onion, chopped | Onion size is not stated. |
| AM-016 | Onion, sliced | Onion size is not stated. |
| AM-019 | Potato, diced and cooked | Potato size is not stated. |
| AM-020 | Onion, sliced | Onion size is not stated. |
| AM-020 | Parsley | Optional garnish has no quantity. |

All listed source quantities and wording remain available in `originalName` and
`originalUnit`. Recipe IDs, images, directions, designs, and unrelated features
were not changed.
