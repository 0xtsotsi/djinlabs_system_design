---
name: cos-tickets-router
description: Router voor per-ticket resolution-artifacts binnen de COS wayfinder-map. Tickets heten T-01 t/m T-10. Frontier-discipline: één ticket per sessie (uitzondering: research-tickets mogen AFK). Resolution-artifacts krijgen slug `T-NN-slug.md` en YAML-frontmatter.
status: draft
created: 2026-09-21
revised: 2026-09-28
revision_note: "Ronde 19 staging gehonoreerd. T-01 + T-02 + T-03 closed (T-02 herzien naar Optie 5 op 2026-09-28, T-03 R2 closure op 2026-09-28 runtime-vrij met 6/6 tests passing). T-04 t/m T-10 in status pending-r19-herijking per motie 4 (DjinLabs zonder runtimes), behalve T-04 en T-09 die door T-03 closure zijn deblokkeerd. Skeleton-files voor T-04 t/m T-10 aangemaakt 2026-09-28."
review_status: pending
reviewer: founder
owner: djin
canonieke-discipline: orthogonal aan canon; per-ticket artifacts volgen `_shared/naming-conventions.md` + `_shared/icm-canon.md`.
related:
  - ../wayfinder-map.md
  - ../architecture-design.md
  - ../CONTEXT.md
  - ../../../../.agents/skills/wayfinder/SKILL.md
  - ../../../../research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md (Ronde 19 staging)
---

# `cos/tickets/` — per-ticket resolution-artifacts

## Wat hier woont

**Één job:** per-ticket resolution-artifacts voor de COS wayfinder-map. Elk ticket-resolution krijgt een eigen file.

## Routing (walk-test)

Een verse AI die hier binnenkomt:

1. Leest deze `README.md` (deze file).
2. Leest `../wayfinder-map.md` voor de frontier-context.
3. Leest de ticket-resolution-file die relevant is (bijv. `T-01-cos-definitie.md`).

## Naming-conventie per ticket

| Onderdeel | Formaat |
|---|---|
| Ticket-naam (verwijzing) | `T-NN — <slug>` (in wayfinder-map) |
| Ticket-file | `T-NN-slug.md` |
| Frontmatter | `name`, `description`, `status` (open/closed), `date`, `owner`, `review_status` |

## Status-flow per ticket

```
open → in-progress (claimed) → resolved (closed + resolution-comment in wayfinder-map)
```

## Frontier-discipline

- **Eén ticket per sessie** (wayfinder-regel §105)
- **Uitzondering:** research-tickets (T-06) mogen AFK worden opgelost
- **Bij resolution:** post het antwoord als comment op `../wayfinder-map.md`, sluit het ticket, append aan "Decisions so far" in de wayfinder-map

## Tickets-overzicht

| Ticket | Onderwerp | Status | Type | Resolution-file |
|---|---|---|---|---|
| T-01 | Wat is COS in één zin? | **closed** (2026-09-21) | grilling | `T-01-cos-definitie.md` |
| T-02 | Wie is COS' "baas"? | **closed** (2026-09-23, herzien 2026-09-28 → Optie 5) | grilling | `T-02-cos-baas.md` |
| T-03 | Welke routes bij eerste launch? | **closed** (2026-09-28, R2 closure, runtime-vrij) | grilling | `T-03-cos-routes.md` |
| T-04 | Hoe valideren zonder canon te raken? | **closed** (2026-10-08 R1, 4×A, 91-woord shadow-mode-contract) | grilling | `T-04-validatie.md` |
| T-05 | State-model (canon vs runtime) | **closed** (2026-10-08 R1, 5-vragen-call, Markdown-tabel in cos/audit-spoor/dispatch-<date>.md, 9-koloms-schema) | grilling + domain-modeling | `T-05-state-model.md` |
| T-06 | Welke Jev-calls doet COS? | **closed** (2026-10-08 R1, research-mode AFK, 3 calls + 1 uitsluiting) | research | `T-06-jev-calls.md` |
| T-07 | Failure-mode bij Jev-down | **pending-r19-herijking** (skeleton 2026-09-28) | grilling | `T-07-jev-failure.md` |
| T-08 | Orchestratie van parallelle sessies | **pending-r19-herijking** (skeleton 2026-09-28) | grilling | `T-08-parallelle-sessies.md` |
| T-09 | Eerste live use-case | **closed** (2026-10-08 R1, 4×A, 78-woord Telegram-inbox triage scenario) | grilling | `T-09-eerste-use-case.md` |
| T-10 | Wat doet COS NIET bij eerste launch? | **pending-r19-herijking** (skeleton 2026-09-28) | grilling | `T-10-niet-doen.md` |

## Ronde 19 implicaties (2026-09-28)

**Bron:** `cos/research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md` (Notion sync-pagina audit-spoor WEB-16).

**Status-snapshot:**

- **T-01 + T-02:** closed; geen actie nodig. T-02 is op 2026-09-28 herzien naar Optie 5 (folder-auteur = baas, Jev = externe gate); in lijn met Ronde 19 motie 3 (COS = folder-agent).
- **T-03:** **closed** (2026-09-28, R2 closure, runtime-vrij, 6/6 tests passing, founder-bevestigd). Resolutie 89 woorden, 6 input-stromen / 7 outputs / 4 triggers / 3 fallbacks / 7 uitgesloten items. Bron: Hermes research-note t03-cos-routes-v1-v4-research-2026-09-28.md. Runtime-ankers C en D definitief gearchiveerd/vervallen. 1 sync-pagina-snapshot per V1.1 geplaatst.
- **T-04 t/m T-10:** skeleton-files aangemaakt 2026-09-28. **T-04 closed (2026-10-08 R1, 91-woord shadow-mode-contract, 4/4 tests passing).** **T-09 closed (2026-10-08 R1, 78-woord Telegram-inbox triage scenario, 4/4 tests passing).** **T-06 closed (2026-10-08 R1, research-mode AFK, 3 classify_jev-calls + ask_human-uitsluiting, 4/4 tests passing).** **T-05 closed (2026-10-08 R1, 5-vragen-call, Markdown-tabel in cos/audit-spoor/dispatch-<date>.md met 9-koloms-schema, 5/5 tests passing).** T-07 + T-08 + T-10 wachten op frontier-progressie.
- **Tickets-volgorde na T-05 closure (2026-10-08):** T-07 (failure-mode) → T-08 (parallelle sessies + lock-discipline + eventueel JSONL-pas) → T-10. Of anders, afhankelijk van founder-call per sessie. T-01 + T-02 + T-03 + T-04 + T-09 + T-06 + T-05 zijn afgesloten.

**Cyrillic-guard:** alle ticket-files en deze README zijn na aanmaak geverifieerd op 0 Cyrillic homoglyphs via `cos/tools/cyrillic-guard.sh`. Trigger-woord "orthogonal" bekend maar niet aanwezig in deze tekens.

## Verwijzingen

- `../wayfinder-map.md` — frontier-overzicht
- `../CONTEXT.md` — product-context
- `_internal/experimenten/CONTEXT.md` — factory-context
- `.agents/skills/wayfinder/SKILL.md` — wayfinder-discipline canoniek
- `_shared/naming-conventions.md` — frontmatter-discipline
- `_shared/icm-canon.md` — ICM-discipline
