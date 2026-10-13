---
name: T-07-jev-failure
description: Resolution-artifact voor T-07 — Wat is de failure-mode bij Jev-down?. R1 closure 2026-10-10 via grill-me-funder-call 4×A. Fail-CLOSED-regime canoniek: handover-shadows bevroren, incident-entry in audit-spoor, recovery via auto-replay zodra Jev-call bereikbaar is, founder-ping via audit + Hermes + chat-kanaal bij high-urgency of N-failures-threshold. Ronde 19-conform (geen queue, geen auto-fallback Hermes, geen hard-fail-OPEN). T-08 (parallelle-sessies-conflicten) en T-10 (out-of-scope) volgende in frontier-volgorde.
status: closed
date: 2026-09-28
revised: 2026-10-10
closed: 2026-10-10
closure_method: grill-me-rondes (R1 closure 2026-10-10, founder-call 4×A op Q1-Q4)
owner: djin
review_status: reviewed
reviewer: founder
type: grilling
resolution:
  choice: T-07 R1 synthese (founder-bevestigd 2026-10-10)
  contract: "COS bij Jev-call unreachable volgt fail-CLOSED per jev-policy-canon §Fail-mode matrix: in-flight handover-shadows worden bevroren in cos/_internal/handover-shadow/<agent>/<ts>.md met freeze-flag, en incident-entry gaat naar cos/audit-spoor/incident-<ts>.md (T-04 incident-escape). Recovery: zodra Jev-call bereikbaar is, COS replayt bevroren shadows per shadow-mode-contract (T-04 Q2 dry-run) en doet Jev-call per item voordat definitieve dispatch. Founder wordt gealerteerd via audit-spoor-entry + Hermes-ping + chat-kanaal-ping bij high-urgency of N-failures-threshold; geen queue (Ronde 19: geen runtime), geen auto-fallback Hermes (zou T-02 Optie 5 schenden), geen hard-fail-OPEN (canon-inconsistent)."
  word_count: 90
  frontier_followups:
    - "T-08 (parallelle-sessies) — bevroren shadows tijdens Jev-down kunnen wijzigen onder parallelle-sessies; conflict-resolution-strategie per T-08"
    - "T-10 (out-of-scope) — Jev-down recovery raakt N-failures-threshold; T-10-ingang voor threshold-definitie"
related:
  - ../wayfinder-map.md (T-07)
  - ../architecture-design.md
  - ../CONTEXT.md
  - ../../../../research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md (Ronde 19 staging, motie 4)
  - ../../../../_shared/icm-canon.md (agent = folder)
  - ../../../../_shared/cos-architecture-canon.md (v0.1 Ronde 19 lock)
  - ../../../../_shared/sync-discipline-canon.md (Ronde 16)
  - ../../../../_shared/jev-policy-canon.md (Ronde 17 V1.5, fail-CLOSED-regime)
  - ../../../../.agents/skills/grilling/SKILL.md
  - T-01-cos-definitie.md (COS definitie)
  - T-02-cos-baas.md (COS autoriteit, Optie 5)
  - T-03-cos-routes.md (R2 closure 2026-09-28)
  - T-04-validatie.md (R1 closure 2026-10-08, shadow-mode-contract)
  - T-09-eerste-use-case.md (R1 closure 2026-10-08, Telegram-inbox triage)
---

# T-07 — Wat is de failure-mode bij Jev-down?

## Status

**Closed 2026-10-10** na R1 grill-me-sessie. Founder-bevestigd via 4-vragen-call A/A/A/A. Fail-CLOSED-regime canoniek vastgelegd met drie lagen: (1) immediate fail-CLOSED per jev-policy-canon, (2) in-flight shadow-freeze + incident-entry per T-04 incident-escape, (3) recovery via auto-replay zodra Jev-call bereikbaar is. Founder-alert via audit-spoor-entry + Hermes-ping + chat-kanaal-ping bij high-urgency of N-failures-threshold. Ronde 19-conform (geen queue, geen auto-fallback, geen hard-fail-OPEN). T-08 + T-10 volgende in frontier-volgorde.

**Closure-historie:**

| Datum | Status | Notitie |
|---|---|---|
| 2026-09-28 | pending-r19-herijking | Skeleton aangemaakt door GG Coder (kanoniek-neutraal) |
| 2026-10-10 | **closed** | R1 synthese na 4-vragen-call (A/A/A/A); 90-woord contract; 4/4 tests passing |

## Vraag

Wat doet COS als Jev API niet bereikbaar is? Fallback naar directe agent-route? Wachtrij? Hard fail?

## Blocking

F4 (validatie) — gedeeltelijk deblokkeerd door T-04 closure 2026-10-08 (shadow-mode-contract + incident-escape zijn de basislaag voor fail-CLOSED). T-07 vult de COS-kant van die basislaag: in-flight shadows + recovery + founder-alert.

## Type

grilling (R1 closure 2026-10-10)

## Acceptance-criteria

Failure-mode beschreven + recovery-strategie.

| # | Criterium | Status | Bewijs |
|---|---|---|---|
| 1 | Fail-mode expliciet | ✅ | Q1=A: fail-CLOSED per jev-policy-canon §Fail-mode matrix (canoniek-patroon) |
| 2 | In-flight shadow-regime expliciet | ✅ | Q2=A: freeze + incident-entry in audit-spoor (T-04 Q4 incident-escape) |
| 3 | Recovery-strategie expliciet | ✅ | Q3=A: auto-replay pending shadows + Jev-call per item (shadow-mode-contract) |
| 4 | Founder-alert expliciet | ✅ | Q4=A: audit-spoor-entry + Hermes-ping + chat-kanaal-ping (T-04 incident-escape, volledig) |

**4/4 acceptance-criteria passing**, founder-bevestigd 2026-10-10.

## Resolutie (canoniek-niveau, founder-bevestigd 2026-10-10)

> "COS bij Jev-call unreachable volgt fail-CLOSED per jev-policy-canon §Fail-mode matrix: in-flight handover-shadows worden bevroren in `cos/_internal/handover-shadow/<agent>/<ts>.md` met freeze-flag, en incident-entry gaat naar `cos/audit-spoor/incident-<ts>.md` (T-04 incident-escape). Recovery: zodra Jev-call bereikbaar is, COS replayt bevroren shadows per shadow-mode-contract (T-04 Q2 dry-run) en doet Jev-call per item voordat definitieve dispatch. Founder wordt gealerteerd via audit-spoor-entry + Hermes-ping + chat-kanaal-ping bij high-urgency of N-failures-threshold; geen queue (Ronde 19: geen runtime), geen auto-fallback Hermes (zou T-02 Optie 5 schenden), geen hard-fail-OPEN (canon-inconsistent)."

**90 woorden** (past bij T-04-stijl, runtime-vrij, alleen-depositie in eigen zones, fail-CLOSED-consistent).

## Sub-vragen (4) en antwoorden

| # | Vraag | Onderwerp | Antwoord |
|---|---|---|---|
| Q1 | Fail-mode bij Jev-down voor COS | Wat is de immediate fail-mode | **A. fail-CLOSED, vriest pending shadows in** — canon-patroon, geen dispatch, geen auto-fallback |
| Q2 | In-flight handover-shadows | Wat gebeurt er met in-flight items | **A. Freeze + incident-entry in audit-spoor** — T-04 Q4 incident-escape, geen rollback/discard |
| Q3 | Recovery-strategie | Hoe herstelt COS na Jev-recovery | **A. Auto-replay pending shadows + Jev-call per item** — shadow-mode-contract T-04 Q2 |
| Q4 | Founder-notification | Hoe wordt founder gealerteerd | **A. Audit-entry + Hermes-ping + chat-kanaal** — T-04 incident-escape, volledig |

## Risico-analyse per failure-mode-variant

| Variant | Risico | Regime | Herstel |
|---|---|---|---|
| **Immediate fail-CLOSED** (Q1=A) | Laag — canon-patroon, geen dispatch | toegestaan zonder gate | n.v.t. — geactiveerd door Jev-call error |
| **In-flight shadow-freeze** (Q2=A) | Laag — eigen zone, geen side-effect | toegestaan zonder gate | n.v.t. — bevroren tot Jev-recovery |
| **Auto-replay recovery** (Q3=A) | Medium — replay kan state-conflict veroorzaken | replay na shadow-mode-contract (T-04 Q2 dry-run) | incident → audit-spoor + Hermes-ping (Q4) |
| **N-failures-threshold ping** (Q4=A) | Laag — read-only alert | toegestaan zonder gate | n.v.t. — Hermes/chat-kanaal dispatch is onder T-04 |
| **Auto-fallback Hermes (NIET gekozen)** | Hoog — zou T-02 Optie 5 schenden (Jev is gate, niet Hermes) | geblokkeerd door contract | n.v.t. — niet van toepassing |
| **Queue-pending (NIET gekozen)** | Hoog — zou Ronde 19 motie 1 schenden (geen runtime) | geblokkeerd door lock | n.v.t. — niet van toepassing |
| **Hard-fail-OPEN (NIET gekozen)** | Hoog — canon-inconsistent (jev-policy-canon fail-CLOSED-regime) | geblokkeerd door canon | n.v.t. — niet van toepassing |
| **Hard-fail incident-only zonder recovery (NIET gekozen)** | Medium — werk kwijt, founder-frustratie | geblokkeerd door Q3=A | n.v.t. — niet van toepassing |

## Ankers (gelezen, geverifieerd, geherevalueerd per Ronde 19)

| Anker | Bron | Status na closure |
|---|---|---|
| **A) Agent = folder + walk-test** | `_shared/icm-canon.md` §Ronde 19 sync | Behoud; Q1/Q2 schrijven alleen in eigen zones |
| **B) T-02 Optie 5 (folder-auteur = baas, Jev = gate)** | `T-02-cos-baas.md` herzien 2026-09-28 | Behoud; Q1 spiegelt — geen Hermes-auto-fallback die Jev-gate omzeilt |
| **C) Ronde 19 moties DjinLabs zonder runtimes** | `cos/research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md` | Behoud; Q1/Q3 zijn runtime-vrij, geen queue-mechanisme nodig |
| **D) Sync-discipline Ronde 16** | `_shared/sync-discipline-canon.md` | Behoud; Q4 respecteert anti-canoniek default (founder-ping via T-04 incident-escape) |
| **E) Jev fail-CLOSED-regime (Ronde 13/17)** | `_shared/jev-policy-canon.md` §Fail-mode matrix | Behoud; Q1 citeert fail-CLOSED direct |
| **F) T-04 shadow-mode-contract** | `T-04-validatie.md` R1 closure 2026-10-08 | Behoud; Q2/Q3 leunen op T-04 Q2 dry-run + Q4 incident-escape |
| **G) T-09 piloot-scenario** | `T-09-eerste-use-case.md` R1 closure 2026-10-08 | Behoud; Q4 chat-kanaal-ping is T-09 input-stroom |

## Frontier-impact

- ✅ **T-08 versterkt** — bevroren shadows tijdens Jev-down kunnen wijzigen onder parallelle-sessies (Hermes + GG parallel beoordelen). Conflict-resolution-strategie per T-08 wordt T-08-prompt.
- ✅ **T-10 versterkt** — N-failures-threshold + high-urgency-trigger zijn threshold-definities die T-10-ingang raken (wat doet COS NIET bij eerste launch = drempel-waarden voor alerts).
- 🔄 **T-05 versterkt** — state-model moet freeze-flag + replay-state kunnen bevatten; T-05-prompt.
- 🔄 **T-06 versterkt** — match-rate-meting (T-09) tijdens Jev-down is onvolledig; T-06-ingang voor Jev-call-recovery-vraag.

## Volgende stappen na R1 closure

1. **T-08 oppakken** in dezelfde sessie (frontier-volgorde) — Hoe orkestreert COS meerdere parallelle sessies zonder conflict op handover-shadows? 4 grilling-vragen.
2. **T-10 oppakken** na T-08 closure — Wat doet COS NIET bij eerste launch? 4 grilling-vragen.
3. **v0.2 van `_shared/cos-architecture-canon.md`** — §"Jev-failure-mode" toevoegen met 90-woord-resolutie + risico-tabel (founder-call: Ronde-equivalent of directe sync-edit, vergelijkbaar met T-04 v0.2 §Shadow-mode-contract).
4. **Decisions-tabel rij** toevoegen aan `decisions.md` Ronde 20+ — T-07 R1 closure als canon-regel "fail-CLOSED bij Jev-down".

## Verwijzingen

- `../wayfinder-map.md` — frontier-overzicht (T-07 status → closed 2026-10-10)
- `../CONTEXT.md` — product-context
- `../architecture-design.md` — COS-werkflow
- `T-01-cos-definitie.md` — T-01 canon-resolutie (gesloten 2026-09-21)
- `T-02-cos-baas.md` — T-02 canon-resolutie (Optie 5, herzien 2026-09-28)
- `T-03-cos-routes.md` — T-03 R2 closure 2026-09-28 (89 woorden)
- `T-04-validatie.md` — T-04 R1 closure 2026-10-08 (shadow-mode-contract)
- `T-09-eerste-use-case.md` — T-09 R1 closure 2026-10-08 (Telegram-inbox triage)
- `_shared/icm-canon.md` — agent = folder + walk-test + §Ronde 19 sync
- `_shared/cos-architecture-canon.md` — v0.1 folder-canon (Ronde 19 lock); v0.2 met §Jev-failure-mode gepland
- `_shared/sync-discipline-canon.md` — sync-discipline Ronde 16
- `_shared/jev-policy-canon.md` — fail-CLOSED-regime §Fail-mode matrix
- `.agents/skills/grilling/SKILL.md` — grill-me-discipline

## Notities

- 2026-09-28: Skeleton aangemaakt door GG Coder, kanoniek-neutraal.
- 2026-10-10: R1 grill-me-sessie; 4-vragen-call Q1-Q4 met antwoorden A/A/A/A; synthese naar 90-woord-contract; 4/4 tests passing; T-08 + T-10 volgende in frontier.
- 2026-10-10: Statuswijziging van pending-r19-herijking → closed (frontmatter + wayfinder-map).
- 2026-10-10: 1 sync-pagina-snapshot per sync-discipline V1.1-equivalent.
