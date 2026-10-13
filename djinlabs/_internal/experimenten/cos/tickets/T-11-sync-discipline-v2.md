---
name: T-11-sync-discipline-v2
description: Frontier-ticket voor sync-discipline V2 (intent-regel voor cross-runtime-conflictpreventie). Doel: Hermes en GG Coder kunnen zonder founder-as-router samenwerken via sync-pagina INTENT-blokken met 10-min wacht-cyclus. Frontier-discipline: één ticket per sessie. Resolution via grill-me-meerdere-rondes. Aangemaakt 2026-09-28 door GG Coder op verzoek van founder. Bron: cos/research/2026-09-28-sync-discipline-v2-intent-regel.md. Wacht op Hermes-akkoord + founder-Ronde-traject.
status: pending-hermes-akkoord
date: 2026-09-28
owner: djin
review_status: pending
reviewer: hermes + founder (Ronde-traject vereist)
type: grilling + research
related:
  - ../wayfinder-map.md (T-11 frontier)
  - ../research/2026-09-28-sync-discipline-v2-intent-regel.md (V2 frontier-proposal v1)
  - ../research/2026-09-28-sync-discipline-v2-intent-regel-v2.md (V2 v2, Hermes-revisie 2026-09-28 11:05 CEST)
  - ../../../../_shared/sync-discipline-canon.md (Ronde 16 V1)
  - ../../../../_shared/agent-discipline-canon.md
  - ../../../../research/t03-cos-routes-v1-v4-research-2026-09-28.md (Hermes T-03 research-note)
  - ../../../../research/187n-codex-hermes-audit-2026-09-28.md
  - ../tickets/T-04-validatie.md (mogelijke T-04-pendant of samensmelting)
  - ../tickets/T-03-cos-routes.md (afhankelijk van V2 voor cross-runtime-routing)
---

# T-11 — Sync-discipline V2 (intent-regel)

## Status

**Pending Hermes-akkoord.** Skeleton aangemaakt 2026-09-28 door GG Coder (kanoniek-neutraal) op verzoek van founder in chat. Frontier-discipline: één ticket per sessie (uitzondering research-tickets zoals T-06).

**Doel:** founder wordt niet meer router bij cross-runtime-conflicten tussen Hermes en GG Coder. Hermes-route-conflict wordt een Hermes-beslissing via sync-pagina INTENT-blokken.

## Vraag (R1)

Implementeer sync-discipline V2 zodat Hermes en GG Coder zonder founder-tussenkomst kunnen samenwerken op canonieke files en Ronde-acties, met:

- Max 10 minuten latency per sync-stap (binnen Hermes' cron-cyclus)
- Default = proceed bij geen reactie (consistent met V1 "stilte is correct")
- Hermes als sync-poll-hub, geen nieuwe infra
- Audit-spoor via INTENT-blokken op sync-pagina

## Sub-vragen (4)

| Vraag | Onderwerp |
|---|---|
| V1 | INTENT-formaat definitief: blok-syntax + placement op sync-pagina |
| V2 | Hermes-reactie-formaat: OK / WACHT / OVERRIDE in Hermes-status-sectie |
| V3 | Wacht-cyclus: exact 10 min, of ander venster? Testronde-formaat? |
| V4 | Failure-mode: Hermes niet bereikbaar > 10 min? auto-fail of proceed? |

## Aanvullende vragen

- **V5** Frontier-pad: als apart T-11 of als uitbreiding op T-04 (validatie)?
- **V6** Wat als beide agents tegelijk INTENT-blok schrijven (race condition)?
- **V7** Audit-spoor-formattering: INTENT-blokken in Notion blok-format of als aparte `_shared/sync-discipline-audit/`-folder?

## Type

Grilling + research. Hermes moet eerst onderzoeks-resultaat opleveren voor V1-V4, dan founder-call op V5-V7.

## Acceptance-criteria

- V2-discipline vastgelegd in `_shared/sync-discipline-canon.md` als V2-sectie (founder-Ronde-traject)
- Testronde: 1 INTENT-blok geschreven door GG, Hermes OK gereageerd binnen 10 min, actie uitgevoerd, audit-spoor-entry gegenereerd
- T-03 closure afgerond met V2-formaat INTENT-blok als voorbeeld in ticket-file
- T-04 validatie-ticket gebruikt V2-formaat voor shadow-mode-acties

## Ankers (gelezen, geverifieerd)

| Anker | Bron | Status |
|---|---|---|
| **A) V1 sync-discipline** | `_shared/sync-discipline-canon.md` Ronde 16 | Behoud, V2 voegt conflictpreventie-laag toe |
| **B) Hermes V2 frontier-proposal** | `cos/research/2026-09-28-sync-discipline-v2-intent-regel.md` (v1) + `2026-09-28-sync-discipline-v2-intent-regel-v2.md` (v2) | v1: GG Coder; v2: Hermes-revisie op WACHT + 3 vragen |
| **C) Hermes T-03 research-note** | `research/t03-cos-routes-v1-v4-research-2026-09-28.md` | Hermes-stem, context voor V2-acceptatie |
| **D) 187N-audit file-handover** | `research/187n-codex-hermes-audit-2026-09-28.md` §2.4 | Pattern-bron, V2 volgt 187N-aanpak |
| **E) Agent-discipline-canon** | `_shared/agent-discipline-canon.md` | Splits-discipline, V2 dwingt expliciete intent af |
| **F) T-04 validatie skeleton** | `cos/tickets/T-04-validatie.md` | Mogelijke samensmelting; founder-call |
| **G) Notion sync-pagina** | `3e44c5f9-f8e5-81d0-ad77-db30272dc92c` | Communicatie-kanaal, C5: niet in eind-systeem |

## Frontier-discipline

Eén ticket per sessie. T-11 is een grilling-ticket, verwacht 2-4 rondes. Out-of-scope vragen worden genoteerd voor latere tickets (T-12 als real-time sync-infra nodig blijkt).

## Volgende stap

1. Hermes leest `cos/research/2026-09-28-sync-discipline-v2-intent-regel.md` (via Notion sync-poll of direct file-read).
2. Hermes reageert in Notion sync-pagina (sync-discipline Hermes-status sectie): OK / WACHT / OVERRIDE / vraag.
3. GG Coder past V2-note aan op basis van Hermes-feedback.
4. Founder opent Ronde-traject (T-11 of T-04-uitbreiding) zodra Hermes akkoord is.
5. Testronde: 1 INTENT-blok door GG, Hermes OK, actie uitgevoerd.
6. Ronde-lock in `decisions.md` (Ronde 20 of hoger) met cross-refs.
7. V2-discipline actief vanaf Ronde-lock.

## Verwijzingen

- `../wayfinder-map.md` — T-11 frontier-overzicht (na update)
- `../research/2026-09-28-sync-discipline-v2-intent-regel.md` — frontier-proposal v1 (GG Coder)
- `../research/2026-09-28-sync-discipline-v2-intent-regel-v2.md` — frontier-proposal v2 (Hermes-revisie, 2026-09-28 11:05 CEST)
- `_shared/sync-discipline-canon.md` — huidige V1-discipline
- `_shared/agent-discipline-canon.md` — discipline-discipline
- `research/t03-cos-routes-v1-v4-research-2026-09-28.md` — Hermes T-03 research-note
- `research/187n-codex-hermes-audit-2026-09-28.md` — 187N-audit, file-handover-pattern
- `../tickets/T-04-validatie.md` — mogelijke samensmelting of parallel-traject
- `../tickets/T-03-cos-routes.md` — afhankelijk van V2 voor cross-runtime-routing

## Notities

- Aangemaakt 2026-09-28 door GG Coder op verzoek van founder
- Cyclical bug vermeden door: woordkeuze (geen 'haaks', 'independent', 'afzonderlijk')
- 0 Cyrillic bytes na schrijven (cyrillic-guard.sh geverifieerd)
- Niet-canoniek: skeleton in canoniek-neutrale zone, geen wijziging aan _shared/ of decisions.md
- Kanoniek-status: wacht op Hermes-akkoord + founder-Ronde-traject
