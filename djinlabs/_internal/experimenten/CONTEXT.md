---
name: djinlabs-internal-experimenten
description: Factory-context voor orthogonal experimenten onder DjinLabs umbrella. Bevat tijdelijke R&D-tools, design-documenten, leer-artefacten die nog niet canoniek zijn. Een verse AI start hier en wordt in max 2 reads naar het juiste experiment-subpad geleid.
status: draft
created: 2026-09-21
review_status: pending
reviewer: founder
owner: djin
canonieke-discipline: volgt `_shared/icm-canon.md` (vormen op repeating unit; één job per folder; factory/product-split; status in frontmatter; walk-test).
---

# `_internal/experimenten/` — factory-context

## Wat hier woont

**Één job:** tijdelijke R&D-tools en design-documenten die orthogonal zijn aan ventures (Djin, Webrnds) en aan canon (`_shared/`, `decisions.md`).

Niet:
- ❌ Canonieke files — die horen in `_shared/`.
- ❌ Venture-specifieke R&D — die hoort in `<venture>/_internal/`.
- ❌ Per-run artifacts — die horen in de venture die ze gemaakt heeft.
- ❌ Klant-data — die hoort in `/webrnds/clients/`.

## Routing (walk-test)

Een verse AI die hier binnenkomt:

1. Leest deze `CONTEXT.md` (deze file).
2. Leest de `CONTEXT.md` van het experiment-subpad dat relevant is.
3. Start het werk.

**Geen 3e read nodig.** Dat is de walk-test uit `icm-canon.md` regel 14.

## Experimenten (factory/product)

| Product | Job | Walk-test-anchor |
|---|---|---|
| `cos/` | Chief of Staff orkestratie-architectuur | `cos/CONTEXT.md` |
| `rondasync/` | Ronde-flow sync-verificatie tool | `rondasync/CONTEXT.md` |

## Factory/product-split

Volgt `icm-canon.md` regel 11:
- **Factory-patterns** (herbruikbaar over experimenten heen): blijven in deze factory-context.
- **Product-specifieke kennis** (per experiment): hoort in het product-subpad.

## Naming-conventie (per `_shared/naming-conventions.md`)

- Elke file in een product-subpad heeft YAML-frontmatter met minimaal: `name`, `description`, `status`, `version`, `date`, `owner`, plus `review_status: pending|reviewed` als het een per-run artifact is.
- Geen nesting > 3 zonder `CONTEXT.md` op elk niveau.
- Geen `Final`, `Misc`, `Stuff`, `Random` — anti-pattern-detectie in Sunday-audit.

## Wat NIET hier zit

- Canonieke files → `_shared/`
- Venture-R&D → `<venture>/_internal/`
- Klant-data → `webrnds/clients/`
- Runtime-state (JSON) → process-memory of `audit-spoor/` (Ronde 15)

## Onderhoud

Files hier zijn **drafts** totdat ze via `decisions.md` worden gecanoniseerd. Geen ad-hoc-promotie.

## Verwijzingen

- `_shared/icm-canon.md` — ICM-discipline canoniek
- `_shared/naming-conventions.md` — slug-format + frontmatter
- `_shared/sync-discipline-canon.md` — Ronde 16 sync-discipline
- `_shared/jev-policy-canon.md` — Ronde 17 Jev-decision-gate
- `djinlabs/AGENTS.md` — sub-router
- `AGENTS.md` (umbrella) — top-router
