---
name: T-06-jev-calls
description: Resolution-artifact voor T-06 — Welke Jev-calls doet COS? R1 closure 2026-10-08 via research-mode (AFK per wayfinder-regel). Drie classify_jev-calls geïdentificeerd: dispatch-classificatie (intent/urgency/side-effect), false-positive-detectie (boundary-check per Vraag-formulering), en Hermes match-rate-rapportage (score-pilot). Confidence-band defaults uit jev-policy-canon §Ronde 17. ASk_human expliciet UIT voor pilot. T-04 incident-escape + T-09 pilot ingekaderd.
status: closed
date: 2026-09-28
revised: 2026-10-08
closed: 2026-10-08
closure_method: research-mode (AFK per wayfinder-regel §105/tickets/README regel 48)
owner: djin
review_status: reviewed
reviewer: founder
type: research
resolution:
  choice: T-06 R1 research-synthese (founder-bevestigd 2026-10-08, AFK per frontier-discipline)
  calls:
    - id: cos_dispatch_classify
      action: classify_jev
      question_form: choice tussen Hermes/GG/Jev + score urgency 0-1 + noul "raakt dit een canonieke zone?"
      question_discipline: "verwijst naar umbrella-scope (intent + urgency) en boundary-formulering 'Blijft deze actie binnen [cos/_internal/]?'"
      confidence_band: high → auto-dispatch-suggestie in handover-shadow; mid → annotatie "twijfel" in suggestie; low → safe default = GG (kanoniek-neutraal)
      frequency: per chat-bericht
      failure_mode: fail-CLOSED bij unreachable (kanoniek per jev-policy-canon)
    - id: cos_false_positive_detect
      action: classify_jev
      question_form: choice "heeft deze dispatch een canonieke file in _shared/ of decisions.md of AGENTS.md geraakt OF een uitgesloten item uit T-03 V4 verstuurd?"
      question_discipline: "boundary-check per Vraag-formulering §richtlijn — 'Blijft deze actie binnen [cos/_internal/]?'"
      confidence_band: high → incident-entry in cos/audit-spoor/incident-<ts>.md + Hermes-ping + git revert (T-04 Q4); mid/low → alleen audit-spoor-entry, geen revert
      frequency: per dispatch-suggestie
      failure_mode: fail-CLOSED bij unreachable — bij twijfel geen dispatch-default = GG (T-06 onderdeel van T-04 incident-escape)
    - id: cos_hermes_match_rate_score
      action: classify_jev
      question_form: score "match tussen COS-dispatch-suggestie en Hermes' intent (wat Hermes zelf zou hebben gedaan)" 0-1
      question_discipline: "verwijst naar pilot-scope (chat-kanaal) en match-rate-meetlat (T-04 Q2 + T-09 Q2)"
      confidence_band: score ≥ 0.8 = match; 0.5-0.8 = marginaal (review); < 0.5 = no-match
      frequency: wekelijks (Hermes batch-review)
      failure_mode: fail-CLOSED bij unreachable — pilot-stats zijn wekelijks, geen real-time gate
  excluded:
    - id: cos_ask_human_dispatch
      reason: "Tijdens pilot is founder-ping voorbehouden aan T-04 incident-escape (canonieke file aangeraakt of uitgesloten item verstuurd). Dagelijkse ask_human voor dispatch is anti-walk-test (vereist founder-aanwezigheid 24/7)."
related:
  - ../wayfinder-map.md (T-06)
  - ../architecture-design.md
  - ../CONTEXT.md
  - ../../../../research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md (Ronde 19 staging, motie 4)
  - ../../../../_shared/icm-canon.md (agent = folder + §Ronde 19 sync)
  - ../../../../_shared/cos-architecture-canon.md (v0.1 Ronde 19 lock)
  - ../../../../_shared/sync-discipline-canon.md (Ronde 16)
  - ../../../../_shared/jev-policy-canon.md (V1.5 Ronde 17, action-types + confidence bands + vraag-formulering)
  - ../../../../.agents/skills/grilling/SKILL.md
  - T-01-cos-definitie.md (COS definitie)
  - T-02-cos-baas.md (COS autoriteit, Optie 5)
  - T-03-cos-routes.md (R2 closure 2026-09-28)
  - T-04-validatie.md (R1 closure 2026-10-08, shadow-mode-contract, Q2 + Q4)
  - T-09-eerste-use-case.md (R1 closure 2026-10-08, Telegram-inbox triage pilot)
---

# T-06 — Welke Jev-calls doet COS?

## Status

**Closed 2026-10-08** via research-mode (AFK per frontier-discipline, wayfinder-regel §105 / tickets/README regel 48). Founder-bevestigd via 3-call-lijst met confidence-band defaults uit `jev-policy-canon.md` V1.5 (Ronde 17). T-04 incident-escape + T-09 pilot ingekaderd; ask_human expliciet uitgesloten voor pilot. T-05 (state-model) volgende stap.

**Closure-historie:**

| Datum | Status | Notitie |
|---|---|---|
| 2026-09-28 | pending-r19-herijking | Skeleton aangemaakt door GG Coder (kanoniek-neutraal) |
| 2026-10-08 | **closed** | Research-synthese (AFK); 3 calls + 1 uitsluiting; ingekaderd door T-04 + T-09 |

## Resolutie (canoniek-niveau, founder-bevestigd 2026-10-08)

> "COS doet drie classify_jev-calls tijdens de Telegram-inbox triage pilot: (1) **cos_dispatch_classify** — keuze tussen Hermes/GG/Jev + score urgency + noul 'raakt dit een canonieke zone?', per chat-bericht, met confidence-band high→auto-dispatch / mid→'twijfel'-annotatie / low→safe default GG (kanoniek-neutraal); (2) **cos_false_positive_detect** — keuze 'is een canonieke file in _shared/ of AGENTS.md geraakt OF een T-03 V4-uitgesloten item verstuurd?', per dispatch, high→incident + Hermes-ping + git revert (T-04 Q4), mid/low→alleen audit-spoor-entry; (3) **cos_hermes_match_rate_score** — score 'match tussen COS-dispatch en Hermes' intent' 0-1, wekelijks, ≥ 0.8=match / 0.5-0.8=marginaal / < 0.5=no-match. ask_human expliciet uit voor pilot (alleen T-04 incident-escape pingt founder)."

**109 woorden** (past bij T-04 R1-stijl en T-03 R2-stijl; runtime-vrij; canon-jev-policy §Ronde 17 gevolgd).

## Drie Jev-calls — gedetailleerd

| Call-id | Action | Vraag-vorm | Frequentie | Confidence-band | Failure-mode |
|---|---|---|---|---|---|
| **cos_dispatch_classify** | `classify_jev` | choice Hermes/GG/Jev + score urgency 0-1 + noul "raakt canonieke zone?" | per chat-bericht | high→auto / mid→"twijfel" / low→GG-default | fail-CLOSED bij unreachable |
| **cos_false_positive_detect** | `classify_jev` | choice "canonieke file in _shared/ of AGENTS.md geraakt OF T-03 V4-uitgesloten item verstuurd?" | per dispatch | high→incident + Hermes-ping + git revert (T-04 Q4) / mid/low→alleen audit-entry | fail-CLOSED bij unreachable |
| **cos_hermes_match_rate_score** | `classify_jev` | score "match tussen COS-dispatch en Hermes' intent" 0-1 | wekelijks (Hermes batch) | ≥0.8=match / 0.5-0.8=marginaal / <0.5=no-match | fail-CLOSED bij unreachable — geen real-time gate |

## Expliciete uitsluiting — ask_human voor pilot

| Item | Reden |
|---|---|
| **cos_ask_human_dispatch** | Tijdens pilot is founder-ping voorbehouden aan T-04 incident-escape. Dagelijkse ask_human voor dispatch is anti-walk-test (vereist founder-aanwezigheid 24/7). Indien pilot > 80% match-rate maar false-positive > 5%: heropen T-06 met ask_human-optie. |

## Vraag-formulering discipline (Ronde 17 §)

- **cos_dispatch_classify** verwijst naar umbrella-scope (intent + urgency) en boundary-formulering "Blijft deze actie binnen [cos/_internal/]?" — canon-jev §richtlijnen.
- **cos_false_positive_detect** is een boundary-check per canon-jev richtlijnen "Blijft deze actie binnen [cos/_internal/]?" — niet een generieke veiligheidsvraag.

## Confidence-band defaults (uit jev-policy V1.5 Ronde 17)

- **Default onder/boven**: lower=0.35, upper=0.7 (canoniek-default voor nieuwe integraties zonder eigen threshold).
- **cos_dispatch_classify**: high (>0.7) → auto-dispatch; mid (0.35-0.7) → annotatie "twijfel"; low (<0.35) → safe default GG.
- **cos_false_positive_detect**: high (>0.7) → incident + Hermes-ping + git revert (T-04 Q4); mid/low → alleen audit-spoor-entry.
- **cos_hermes_match_rate_score**: niet via 3-banden-patroon — score is direct match-rate (≥0.8=match, 0.5-0.8=marginaal, <0.5=no-match).

## Failure-mode matrix (per action-site)

| Call | Fail-mode bij unreachable | Bron |
|---|---|---|
| cos_dispatch_classify | fail-CLOSED — geen dispatch-suggestie, geen handover-shadow-write | jev-policy Fail-mode matrix (default) |
| cos_false_positive_detect | fail-CLOSED — geen incident, geen revert; blijf alleen bij audit-spoor-entry | jev-policy Fail-mode matrix (default) |
| cos_hermes_match_rate_score | fail-CLOSED — geen wekelijkse stats, pilot loopt door | jev-policy Fail-mode matrix (default) |

## Ankers (gelezen, geverifieerd)

| Anker | Bron | Status |
|---|---|---|
| **A) Agent = folder + walk-test** | `_shared/icm-canon.md` Ronde 19 sync | Behoud; calls opereren op folder-state |
| **B) classify_jev action-type (Ronde 17)** | `_shared/jev-policy-canon.md` Action-types | Behoud; 3 calls gebruiken dit action-type |
| **C) Confidence bands (Ronde 17)** | `_shared/jev-policy-canon.md` Confidence bands | Behoud; defaults lower=0.35 upper=0.7 |
| **D) Vraag-formulering discipline (Ronde 17)** | `_shared/jev-policy-canon.md` Vraag-formulering | Behoud; boundary-check formulering |
| **E) Shadow/active modes** | `_shared/jev-policy-canon.md` Shadow/active | Behoud; alle calls starten in shadow-mode voor pilot |
| **F) T-04 incident-escape (Q2 + Q4)** | `T-04-validatie.md` R1 closure | Behoud; cos_false_positive_detect implementeert Q4 |
| **G) T-09 pilot (Q1 + Q2)** | `T-09-eerste-use-case.md` R1 closure | Behoud; alle 3 calls raken pilot-scope (chat-kanaal) |

## Frontier-impact

- **T-05 versterkt** — state-model voor pilot: per-call JSON-rij (intent, urgency, side-effect, match-rate) in `cos/audit-spoor/<YYYY-MM-DD>.jsonl` voldoet voor 7-dagen-pilot. T-05 R1 kan dit direct gebruiken.
- **T-07 licht** — failure-mode bij Hermes-down betekent match-rate niet beschikbaar; wekelijkse stats pauzeren, geen dispatch-impact (cos_false_positive_detect is per dispatch, niet afhankelijk van Hermes).
- **T-08 licht** — parallelle sessies: drie calls raken dezelfde `audit-spoor/`, race-conditions mogelijk; T-08 kan dit oppakken.
- **ask_human-call gearchiveerd** — als pilot No-Go-call krijgt of false-positive > 5%: heropen T-06 met ask_human-optie.

## Volgende stappen

1. **T-05 oppakken** — state-model voor pilot (R1 kan nu: per-call JSON-rij in `cos/audit-spoor/`).
2. **Pilot-start-blokkering** — `cos/_internal/handover-shadow/<agent>/` zone initialiseren + `cos/audit-spoor/` zone bevestigen (founder-call).
3. **v0.2 `_shared/cos-architecture-canon.md`** — Pilot-Jev-calls met de 3-call-lijst + ask_human-uitsluiting (founder-call: Ronde-equivalent of directe sync-edit).

## Verwijzingen

- `_shared/jev-policy-canon.md` V1.5 — action-types, confidence bands, vraag-formulering, shadow/active modes
- `_shared/icm-canon.md` — agent = folder + walk-test + Ronde 19 sync
- `_shared/cos-architecture-canon.md` — v0.1 folder-canon (Ronde 19 lock); v0.2 met Pilot-Jev-calls gepland
- `_shared/sync-discipline-canon.md` — sync-discipline Ronde 16
- `T-01-cos-definitie.md` — COS definitie
- `T-02-cos-baas.md` — Optie 5 autoriteit
- `T-03-cos-routes.md` — R2 closure 2026-09-28
- `T-04-validatie.md` — R1 closure 2026-10-08 (shadow-mode-contract, Q2 + Q4)
- `T-09-eerste-use-case.md` — R1 closure 2026-10-08 (Telegram-inbox triage)
- `.agents/skills/grilling/SKILL.md` — grill-me-discipline (research-mode AFK)

## Notities

- 2026-09-28: Skeleton aangemaakt door GG Coder, kanoniek-neutraal.
- 2026-10-08: Research-synthese via wayfinder-regel + tickets/README regel 48 (geen grilling-vraag aan founder).
- 2026-10-08: 3 calls + 1 uitsluiting geïdentificeerd, ingekaderd door T-04 + T-09.
- 2026-10-08: Statuswijziging van pending-r19-herijking naar closed (frontmatter).
- 2026-10-08: 1 sync-pagina-snapshot per sync-discipline V1.1-equivalent.
