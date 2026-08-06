# KOS-130 — RFIS Bridge

## Purpose

KOS references the existing RFIS catalog instead of copying recipe or Complete Dinner data.

## Capabilities

- Resolve RFIS recipes for KOS
- Resolve verified Complete Dinners
- Record production directly from an RFIS recipe
- Preserve recipe IDs in KOS inventory lots
- Calculate whether a Complete Dinner can be assembled
- Build an RFIS Complete Dinner from matching component lots
- Reject unrelated components
- Report available quantities for any RFIS recipe

## Ownership rule

RFIS remains authoritative for recipes and Complete Dinner composition.

KOS remains authoritative for what was cooked, stored, assembled, packaged, and consumed.
