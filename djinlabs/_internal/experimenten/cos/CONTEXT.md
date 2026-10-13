---
name: cos-architecture-product
description: Product-context voor de COS (Chief of Staff) orthogonal orkestratie-architectuur. Design-documenten + wayfinder-map voor de eerste frontier. Een verse AI start hier en wordt in max 2 reads naar architecture-design of wayfinder-map geleid.
status: draft
created: 2026-09-21
review_status: pending
reviewer: founder
owner: djin
canonieke-discipline: volgt `_shared/icm-canon.md` + parent-context `_internal/experimenten/CONTEXT.md`.
---

# `cos/` — product-context

## Wat hier woont

**Één job:** design + wayfinder-mapping voor de COS (Chief of Staff) orkestratie-architectuur. orthogonal aan ventures, orthogonal aan agents, orthogonal aan canon-files.

Niet:
- ❌ Runtime-implementatie van COS (dat is een apart traject, out-of-scope van deze map)
- ❌ Canonieke COS-file (`_shared/cos-architecture-canon.md`) — komt pas na voldoende frontier-resolution met founder-commit
- ❌ Venture-specifieke code — orthogonal-eis
- ❌ UI-rendering — orthogonal-eis

## Routing (walk-test)

Een verse AI die hier binnenkomt:

1. Leest deze `CONTEXT.md` (deze file).
2. Leest één van:
   - `architecture-design.md` — eerste-orde COS-architectuur-schets (185 regels)
   - `wayfinder-map.md` — Matt Pocock wayfinder-discipline met 10 frontier-tickets
3. Start het werk (meestal: een grill-me-vraag op de wayfinder-map).

## Files in deze product

| File | Rol |
|---|---|
| `architecture-design.md` | Design-doc: wat COS is, anti-patterns, frontier-overzicht |
| `wayfinder-map.md` | Wayfinder-map: destination, tickets T-01 t/m T-10, not-yet-specified, out-of-scope |
| `tickets/` | Per-ticket resolution-artifacts (TODO: nog leeg, vult naarmate frontier vordert) |
| `research/` | Research-notes die de COS-notie onderzoeken (canoniek-neutraal, geen auto-include) |

## Factory/product-split voor COS

- **Factory-patterns** (herbruikbaar): walk-test-discipline, confidence-band defaults, audit-trail-schema → blijven in `_shared/` als ze canon-niveau blijken.
- **Product-specifieke kennis** (per COS-onderdeel): hoort in deze `cos/`-folder.

## Naming-conventie

Conform `_shared/naming-conventions.md`:
- Elke file heeft YAML-frontmatter met `name`, `description`, `status`, `version`, `date`, `owner`, `review_status`.
- Tickets heten `T-NN-slug.md`, niet `#1` of issue-nummers.
- Geen nesting > 3 zonder `CONTEXT.md` op elk niveau.

## Wat NIET hier zit

- Andere orthogonal architecturen → eigen product-folder in `_internal/experimenten/`
- Venture-specifieke integratie → in `<venture>/_internal/`
- Runtime-code → in `djinlabs/skills/` of apart traject
- Canonieke files → in `_shared/`

## Status-overzicht (Ronde 18+ candidate)

| Item | Status | Owner |
|---|---|---|
| Architecture-design | draft | djin (founder-review) |
| Wayfinder-map | draft | djin (founder-review) |
| Tickets T-01 t/m T-10 | open | frontier-discipline |
| COS-canon `_shared/cos-architecture-canon.md` | not started | after-frontier |

## Verwijzingen

- `architecture-design.md` — design-doc
- `wayfinder-map.md` — wayfinder-map
- `tickets/README.md` — per-ticket artifacts (wanneer gevuld)
- `_internal/experimenten/CONTEXT.md` — parent-context
- `_shared/icm-canon.md` — ICM-discipline
- `_shared/jev-policy-canon.md` — Jev-decision-gate canoniek (Ronde 17 V1.5)
- `_shared/sync-discipline-canon.md` — sync-discipline (Ronde 16)
- `.agents/skills/wayfinder/SKILL.md` — wayfinder-discipline canoniek in lokale skills
- `.agents/skills/grilling/SKILL.md` — grill-me-discipline
- `.agents/skills/domain-modeling/SKILL.md` — domain-modeling voor glossary
