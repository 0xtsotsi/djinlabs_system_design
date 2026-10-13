---
name: rondasync-product
description: Product-context voor de Ronde-flow sync-verificatie tool. Advisory-only tool dat bij elke Ronde-sluit verifieert of alle _shared/ canon-files gesynced zijn met decisions.md. Gebruikt Jev-classification (Ronde 17 classify_jev) voor drift-detectie.
status: design-draft
version: 0.1
date: 2026-09-21
owner: djin
tool_type: advisory-only
review_status: pending
reviewer: founder
canonieke-discipline: volgt `_shared/icm-canon.md` + `_shared/sync-discipline-canon.md` (Ronde 16) + `_shared/jev-policy-canon.md` (Ronde 17).
---

# `rondasync/` — product-context

## Wat hier woont

**Één job:** advisory-tool dat bij elke Ronde-sluit verifieert of alle `_shared/` canon-files gesynced zijn met `decisions.md`. Output is **advisory-only** (geen auto-fix).

## Routing (walk-test)

Een verse AI die hier binnenkomt:

1. Leest deze `CONTEXT.md` (deze file).
2. Leest `design.md` voor de design-doc.
3. Start het werk: `python3 rondasync.py --ronde N [--dry-run]`

## Files in deze product

| File | Rol |
|---|---|
| `design.md` | Design-doc: doel, niet-doelen, architectuur, output-schema |
| `rondasync.py` | Python-implementatie (13K, 376 regels) — argparse + Jev-call + shadow-mode advisory |

## Belangrijkste constraints (canoniek)

- **Geen auto-edit** — advisory-only (Ronde 14 boundary-discipline)
- **Geen canon-promotie** — verifieert, maakt geen Ronde
- **Confidence-bands (Ronde 17)** — auto-classify (>0.7), review-needed (0.35-0.7), default-noop (<0.35)
- **Audit-spoor JSON** — per ADR 0001 in `retention-policy-canon.md`
- **Shadow-mode-first** — verifieert in shadow voordat COS auto-promotie doet

## Live-test resultaten (Ronde 17, 2026-09-21)

8/10 correct (80% accuracy) — twee uitlegbare false-classificaties:
- `icm-canon.md` (Gap M 5-onderdelen-pattern nog niet canoniek)
- `CONTEXT.md` (glossary-term in specifieke sectie, niet file-breed)

Runtime: 9.78s totaal voor 10 Jev-calls, $0.000293 cost.

## Verwijzingen

- `design.md` — design-doc
- `rondasync.py` — implementatie
- `_internal/experimenten/CONTEXT.md` — parent-context
- `_shared/sync-discipline-canon.md` — sync-discipline (Ronde 16)
- `_shared/jev-policy-canon.md` — Jev-decision-gate (Ronde 17)
- `_shared/state-formats-canon.md` — Markdown = knowledge, JSON = state
- `_shared/retention-policy-canon.md` — ADR 0001 audit-trail
- `research/rondasync-shadow-mode-r17.md` — evaluatie-research

## Run-voorbeeld

```bash
cd /Users/gogetta/Documents/djinlabs_system_design
source .env-test/jev-test.env
python3 djinlabs/_internal/experimenten/rondasync/rondasync.py --ronde 17
```

Output: drift-rapport in `audit-spoor/`.
