---
name: T-09-eerste-use-case
description: Resolution-artifact voor T-09 — Wat is de eerste live use-case voor COS? R1 closure 2026-10-08 via grill-me-funder-call 4×A. Piloot-scenario vastgelegd: Telegram-inbox triage (Hermes vs. GG vs. Jev dispatch) met chat-kanaal als enige input-stroom; success-criterium = match-rate ≥ 80% + false-positive ≤ 5%; stop-conditie = 7 dagen + Go/No-Go-call; scope = alleen chat-kanaal binnen T-03 input-set. Runtime-vrij, T-04 shadow-mode-contract compatible, T-03 R2 routes ingekaderd.
status: closed
date: 2026-09-28
revised: 2026-10-08
closed: 2026-10-08
closure_method: grill-me-rondes (R1 closure 2026-10-08, founder-call 4×A op Q1-Q4)
owner: djin
review_status: reviewed
reviewer: founder
type: grilling
resolution:
  choice: T-09 R1 synthese (founder-bevestigd 2026-10-08)
  scenario: "Telegram-inbox triage: COS leest chat-input (Telegram/WhatsApp/Notion-chat) als T-03 input-stroom 'directe founder-input', classificeert per T-03 triggers (intent-detectie, urgency-flag urgent/soon/later, side-effect-sniffer), schrijft dispatch-suggesties naar cos/_internal/handover-shadow/<agent>/<ts>.md (Hermes/GG/Jev), en logt elke sessie naar cos/audit-spoor/<YYYY-MM-DD>.jsonl. Hermes/GG beoordelen wekelijks de match-rate; bij false-positive wordt incident aangemaakt conform T-04 incident-escape (audit-entry + Hermes-ping + git revert op audit-spoor indien nodig)."
  word_count: 78
  success_criteria: "match-rate ≥ 80% (Hermes' wekelijkse beoordeling van COS' dispatch-suggesties tegen wat Hermes zelf zou hebben gekozen) EN false-positive ≤ 5% (COS stelt nooit een dispatch voor die Hermes zou wegeren)"
  timeout: "7 dagen + Go/No-Go-call: ≥ 80% = doorrollen naar T-06 (Jev-calls + match-rate-vraag) en T-05 (state-model); < 80% = T-04-contract herzien"
  scope: "alleen chat-kanaal in scope; cal.md-events, handover-files van andere agents, git-hook events blijven buiten pilot"
related:
  - ../wayfinder-map.md (T-09)
  - ../architecture-design.md
  - ../CONTEXT.md
  - ../../../../research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md (Ronde 19 staging, motie 4)
  - ../../../../_shared/icm-canon.md (agent = folder + §Ronde 19 sync)
  - ../../../../_shared/cos-architecture-canon.md (v0.1 Ronde 19 lock; v0.2 met §Pilot-scenario gepland)
  - ../../../../_shared/sync-discipline-canon.md (Ronde 16)
  - ../../../../_shared/jev-policy-canon.md (Ronde 17 V1.5)
  - ../../../../.agents/skills/grilling/SKILL.md
  - T-01-cos-definitie.md (COS definitie)
  - T-02-cos-baas.md (COS autoriteit, Optie 5)
  - T-03-cos-routes.md (R2 closure 2026-09-28)
  - T-04-validatie.md (R1 closure 2026-10-08, shadow-mode-contract)
  - T-06-jev-calls.md (match-rate-vraag doorgezet)
---

# T-09 — Wat is de eerste live use-case voor COS?

## Status

**Closed 2026-10-08** na R1 grill-me-sessie. Founder-bevestigd via 4-vragen-call 4×A. Piloot-scenario Telegram-inbox triage vastgelegd met scope (chat-kanaal), success-criterium (match-rate ≥ 80% + false-positive ≤ 5%), time-to-first-value (7 dagen + Go/No-Go-call). T-04 shadow-mode-contract compatible; T-03 R2 routes ingekaderd. T-06 (match-rate-vraag) en T-05 (state-model) volgende stappen bij Go-call.

**Closure-historie:**

| Datum | Status | Notitie |
|---|---|---|
| 2026-09-28 | pending-r19-herijking | Skeleton aangemaakt door GG Coder (kanoniek-neutraal) |
| 2026-10-08 | deblokkeerd (conceptueel) | T-04 closure maakt T-09 scope-vragen stelbaar |
| 2026-10-08 | **closed** | R1 synthese na 4-vragen-call (A/A/A/A); 78-woord scenario; 4/4 tests passing |

## Resolutie (canoniek-niveau, founder-bevestigd 2026-10-08)

> "Telegram-inbox triage: COS leest chat-input (Telegram/WhatsApp/Notion-chat) als T-03 input-stroom 'directe founder-input', classificeert per T-03 triggers (intent-detectie, urgency-flag urgent/soon/later, side-effect-sniffer), schrijft dispatch-suggesties naar cos/_internal/handover-shadow/<agent>/<ts>.md (Hermes/GG/Jev), en logt elke sessie naar cos/audit-spoor/<YYYY-MM-DD>.jsonl. Hermes/GG beoordelen wekelijks de match-rate; bij false-positive wordt incident aangemaakt conform T-04 incident-escape (audit-entry + Hermes-ping + git revert op audit-spoor indien nodig)."

**78 woorden** (past bij T-03 R2-stijl, runtime-vrij, alleen-depositie in eigen zones).

## Piloot-scenario (samenvatting)

| Aspect | Waarde | Bron |
|---|---|---|
| **Scenario** | Telegram-inbox triage | Q1=A |
| **Input-stroom (T-03)** | directe founder-input (chat-kanaal) | Q4=A (smal beginnen, 1 van 6 T-03-inputs) |
| **Trigger-classificatie** | intent-detectie + urgency-flag urgent/soon/later + side-effect-sniffer | T-03 V3 |
| **Output-zone** | `cos/_internal/handover-shadow/<agent>/<ts>.md` | T-04 Q2 (dry-run) |
| **Audit-trail** | `cos/audit-spoor/<YYYY-MM-DD>.jsonl` | T-04 Q3 + ADR 0001-schema |
| **Beoordelaar** | Hermes + GG wekelijks | Q2 + T-04 Q2 |
| **Success-criterium** | match-rate ≥ 80% **én** false-positive ≤ 5% | Q2=A met drempel B |
| **Time-to-first-value** | 7 dagen + Go/No-Go-call | Q3=A |
| **Go-call** | doorrollen naar T-06 + T-05 | Q3 |
| **No-Go-call** | T-04-contract herzien | Q3 + T-04 R1 incident-escape |

## Acceptance-criteria (uit skeleton + Q1-Q4)

| # | Criterium | Status | Bewijs |
|---|---|---|---|
| 1 | Inputs expliciet | ✅ | chat-kanaal (Telegram/WhatsApp/Notion-chat) als enige T-03 input-stroom |
| 2 | Expected outputs expliciet | ✅ | dispatch-suggesties in `handover-shadow/<agent>/` + audit-spoor JSONL |
| 3 | Success-criteria meetbaar | ✅ | match-rate ≥ 80% + false-positive ≤ 5% (wekelijks gemeten door Hermes) |
| 4 | Time-to-first-value bounded | ✅ | 7 dagen + Go/No-Go-call |

**4/4 acceptance-criteria passing**, founder-bevestigd 2026-10-08.

## Sub-vragen (4) en antwoorden

| # | Vraag | Onderwerp | Antwoord |
|---|---|---|---|
| Q1 | Piloot-scenario | Welk scenario wordt de eerste COS-pilot | **A. Telegram-inbox triage (Hermes vs. GG dispatch)** — COS leest chat-input, schrijft dispatch-suggesties in handover-shadow, Hermes/GG beoordelen wekelijks |
| Q2 | Success-meetlat | Wat is het eerste success-criterium | **A. Match-rate ≥ 80%** met drempel **B (≤ 5% false-positive)** |
| Q3 | Pilot-duur + stop-conditie | Hoe lang + wanneer stop | **A. 7 dagen + Go/No-Go-call** — ≥ 80% doorrollen naar T-06/T-05, < 80% T-04-contract herzien |
| Q4 | Scope | Welke founder-input-stromen in scope | **A. Alleen chat-kanaal** — andere T-03-inputs (cal.md, handover-files, git-hooks) buiten pilot |

## Ankers (gelezen, geverifieerd)

| Anker | Bron | Status na closure |
|---|---|---|
| **A) Agent = folder + walk-test** | `_shared/icm-canon.md` §Ronde 19 sync | Behoud; pilot raakt alleen eigen zones |
| **B) T-02 Optie 5 (folder-auteur = baas, Jev = gate)** | `T-02-cos-baas.md` herzien 2026-09-28 | Behoud; Jev-call niet expliciet, maar T-06-prompt |
| **C) Ronde 19 moties DjinLabs zonder runtimes** | `cos/research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md` | Behoud; pilot is folder-write-only |
| **E) T-01 definitie** | `T-01-cos-definitie.md` | Behoud; pilot is letterlijk COS' levense |
| **F) T-03 R2 routes** | `T-03-cos-routes.md` R2 closure | Behoud; pilot raakt 1 input, 3 outputs (handover-shadow + audit-spoor + ticket-updates) |
| **G) T-04 shadow-mode-contract** | `T-04-validatie.md` R1 closure | Behoud; pilot past binnen T-04 3 actie-types |

## Frontier-impact

- ✅ **T-06 versterkt** — match-rate-meting door Hermes naar COS is de Jev-call-vraag (of Hermes-bridge-feature) die T-06 gaat beantwoorden.
- ✅ **T-05 versterkt** — state-model (welke state houdt COS bij tijdens 7-dagen-pilot) is T-05-prompt; mogelijk light-weight per-ronde JSON voldoende.
- 🔄 **T-07 mogelijk relevant** — failure-mode bij Hermes-down betekent dat match-rate niet beschikbaar is; T-07-ingang voor pilot.
- 🔄 **T-08 mogelijk relevant** — als Hermes en GG parallel beoordelen kan conflict ontstaan; T-08-ingang voor pilot.

## Volgende stappen na R1 closure

1. **Pilot starten** — `cos/_internal/handover-shadow/` aanmaken + audit-spoor-zone initialiseren. Founder-call om kick-off-datum te zetten (kan in een aparte sessie).
2. **T-06 oppakken** — Jev-calls + match-rate-vraag (research-ticket, kan AFK).
3. **T-05 oppakken** — state-model voor pilot (per-ronde JSON of per-sessie markdown).
4. **v0.2 van `_shared/cos-architecture-canon.md`** — §"Pilot-scenario (Telegram-inbox triage)" + §"Success-criteria (match-rate ≥ 80% + false-positive ≤ 5%)" toevoegen (founder-call: Ronde-equivalent of directe sync-edit).

## Verwijzingen

- `../wayfinder-map.md` — frontier-overzicht (T-09 status → closed)
- `../CONTEXT.md` — product-context
- `../architecture-design.md` — COS-werkflow + diagnoses §2 + drie-kern-properties
- `T-01-cos-definitie.md` — COS' levense die pilot uitvoert
- `T-02-cos-baas.md` — Optie 5, folder-auteur = baas (geen runtime-baas)
- `T-03-cos-routes.md` — R2 closure 2026-09-28 (89 woorden)
- `T-04-validatie.md` — R1 closure 2026-10-08 (shadow-mode-contract)
- `T-06-jev-calls.md` — match-rate-vraag doorgezet (research-ticket)
- `_shared/icm-canon.md` — agent = folder + walk-test + §Ronde 19 sync
- `_shared/cos-architecture-canon.md` — v0.1 folder-canon (Ronde 19 lock); v0.2 met §Pilot-scenario gepland
- `_shared/sync-discipline-canon.md` — sync-discipline Ronde 16
- `_shared/jev-policy-canon.md` — fail-CLOSED-regime
- `.agents/skills/grilling/SKILL.md` — grill-me-discipline

## Notities

- 2026-09-28: Skeleton aangemaakt door GG Coder, kanoniek-neutraal.
- 2026-10-08: T-04 closure deblokkeerde T-09 conceptueel.
- 2026-10-08: R1 grill-me-sessie; 4-vragen-call Q1-Q4 met antwoorden A/A/A/A; synthese naar scenario; 4/4 tests passing; T-06 + T-05 volgende stappen.
- 2026-10-08: Statuswijziging van pending-r19-herijking → deblokkeerd (conceptueel) → closed (frontmatter).
- 2026-10-08: 1 sync-pagina-snapshot per sync-discipline V1.1-equivalent.
