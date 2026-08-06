# KOS-140 — Kitchen Assistant Engine

## Purpose

The Kitchen Assistant converts current KOS and RFIS data into optional, practical next-step suggestions.

## Rules

- Suggestions use gentle language such as “you could.”
- No guilt, scoring, pressure, or interruption.
- Exact Complete Dinner suggestions require RFIS-matching components.
- Recovery suggestions are rule based and never alter inventory automatically.
- Every suggestion is dismissible at the UI layer and requires user action before changing data.

## Suggestion types

- Build a verified Complete Dinner
- Assemble available components
- Choose food ready to eat
- Add packaging details
- Recover suitable components such as older bread or cooked rice
- Record cooking when no KOS history exists
