---
name: T-04-validatie
description: Resolution-artifact voor T-04 — Hoe valideer je COS zonder canonieke files aan te raken? R1 closure 2026-10-08 via grill-me-funder-call 4×A. Shadow-mode-contract vastgelegd: research-zone read-only, handover dry-run in eigen zone, canonieke writes alleen in cos/audit-spoor/ + cos/tickets/, incident-escape = audit-entry + Hermes-ping + git revert (fail-OPEN detect, fail-CLOSED fix). Frontier-bijdrage: contract beschreven + risico-analyse per actie-type. T-09 deblokkeerd na T-04 closure; match-rate-vraag naar T-06 (Jev-calls) verplaatst.
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
  choice: T-04 R1 synthese (founder-bevestigd 2026-10-08)
  contract: "In de COS-pilot geldt een shadow-mode-contract met drie actie-types: (1) research-zone writes zijn read-only — COS schrijft niets naar research/, staging-output gaat naar cos/_internal/staging/ of naar chat-rapporten; (2) handover-decisions zijn dry-run — COS doet alsof het routeert naar Hermes/GG/Jev-folders, maar schrijft alleen naar cos/_internal/handover-shadow/<agent>/, Hermes rapporteert wekelijks de match-rate tussen shadow en echte intent; (3) canonieke schrijfacties raken cos/audit-spoor/<YYYY-MM-DD>.jsonl + cos/tickets/T-NN-*.md aan — geen _shared/, geen decisions.md, geen AGENTS.md-routers. Bij incident (canonieke file aangeraakt of uitgesloten item verstuurd): fail-OPEN detectie + audit-spoor-entry in cos/audit-spoor/incident-<ts>.md + directe Hermes-ping + git revert op de canonieke file (fail-CLOSED herstel)."
  word_count: 91
  frontier_followups:
    - "T-06 (Jev-calls) — match-rate-rapportage van Hermes naar COS vereist Jev-classify_jev of Hermes-bridge-feature; niet beslist in T-04"
related:
  - ../wayfinder-map.md (T-04)
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
  - T-03-cos-routes.md (input/output-agenten, R2 closure 2026-09-28 runtime-vrij)
  - T-09-eerste-use-case.md (conceptueel deblokkeerd door T-04 closure)
---

# T-04 — Hoe valideer je COS zonder canonieke files aan te raken?

## Status

**Pending Ronde 19 herijking.** Skeleton aangemaakt 2026-09-28 door GG Coder (kanoniek-neutraal, in `cos/tickets/`). Vraag en acceptance-criteria overgenomen uit `cos/wayfinder-map.md` regels 108-114. Geen runtime-aannames toegevoegd; geen resolutie voorstellen — die zijn aan de founder.

**Ronde 19 context:** deze ticket is onderdeel van de T-04 t/m T-10 reeks die per **motie 4** (DjinLabs zonder runtimes, 24-sep-2026) moet worden geherevalueerd. Wayfinder-formulering is reeds runtime-vrij; runtime-mentions zitten alleen in de Not-yet-specified sectie van wayfinder-map (Sharbel/Hermy HQ, Vercel Eve, COS runtime-stack). Die vallen onder motie 1 (geen runtimes in DjinLabs).

## Vraag

Wat is het shadow-mode-contract voor COS' eerste pilot? Welke acties zijn read-only op research-flow, welke zijn no-op, welke vereisen founder-confirm?

## Blocking

F9 (eerste live use-case) — conceptueel deblokkeerd door T-04 closure.

## Type

grilling (R1 closure 2026-10-08)

## Acceptance-criteria

Contract beschreven + risico-analyse per actie-type.

| # | Criterium | Status | Bewijs |
|---|---|---|---|
| 1 | Research-zone-regime expliciet | ✅ | Q1=A: read-only shadow, staging in `cos/_internal/staging/` of chat |
| 2 | Handover-regime expliciet | ✅ | Q2=A: dry-run in `cos/_internal/handover-shadow/<agent>/` + Hermes match-rate |
| 3 | Canoniek-regime expliciet | ✅ | Q3=A: alleen `cos/audit-spoor/` + `cos/tickets/`, geen canon-zones |
| 4 | Incident-escape expliciet | ✅ | Q4=A: fail-OPEN detect + audit-entry + Hermes-ping + git revert |

**4/4 acceptance-criteria passing**, founder-bevestigd 2026-10-08.

## Resolutie (canoniek-niveau, founder-bevestigd 2026-10-08)

> "In de COS-pilot geldt een shadow-mode-contract met drie actie-types: (1) research-zone writes zijn read-only — COS schrijft niets naar research/, staging-output gaat naar cos/_internal/staging/ of naar chat-rapporten; (2) handover-decisions zijn dry-run — COS doet alsof het routeert naar Hermes/GG/Jev-folders, maar schrijft alleen naar cos/_internal/handover-shadow/<agent>/, Hermes rapporteert wekelijks de match-rate tussen shadow en echte intent; (3) canonieke schrijfacties raken cos/audit-spoor/<YYYY-MM-DD>.jsonl + cos/tickets/T-NN-*.md aan — geen _shared/, geen decisions.md, geen AGENTS.md-routers. Bij incident (canonieke file aangeraakt of uitgesloten item verstuurd): fail-OPEN detectie + audit-spoor-entry in cos/audit-spoor/incident-<ts>.md + directe Hermes-ping + git revert op de canonieke file (fail-CLOSED herstel)."

**91 woorden** (langer dan T-01/T-02 omdat dit drie actie-types + één incident-handler omvat; past bij T-03 R2-stijl en runtime-vrij).

## Sub-vragen (4) en antwoorden

| # | Vraag | Onderwerp | Antwoord |
|---|---|---|---|
| Q1 | Research-zone writes | Risico-klasse voor research-output | **A. Read-only shadow** — COS schrijft niets naar `research/`, staging-output naar `cos/_internal/staging/` of chat-rapporten |
| Q2 | Handover-decisions | Scherpte van routing-gate | **A. Alleen dry-run + Hermes match-rate** — COS doet alsof het routeert naar `cos/_internal/handover-shadow/<agent>/`, raakt geen echte agent-folders, Hermes rapporteert wekelijks de match-rate (naar T-06) |
| Q3 | Canonieke schrijfacties | Regime voor audit-spoor + ticket-updates + sync-pagina-snapshot | **A. Alleen eigen zone** — `cos/audit-spoor/<YYYY-MM-DD>.jsonl` + `cos/tickets/T-NN-*.md`, geen `_shared/`, `decisions.md`, of `AGENTS.md`-routers |
| Q4 | Escape-route | Bij shadow-overschrijding | **A. Stop + audit-entry + Hermes-ping + git revert** — fail-OPEN detectie (incident-entry, ping), fail-CLOSED herstel (revert) |

## Risico-analyse per actie-type

| Actie-type | Risico | Regime | Herstel |
|---|---|---|---|
| **Research-zone reads** | Geen — read-only | toegestaan zonder gate | n.v.t. |
| **Research-zone writes** | Cross-canoniek drift, contaminatie staging met canon | **read-only** (Q1=A) | n.v.t. — geblokkeerd door contract |
| **Handover-shadow writes** | Laag — geen agent-folder aangeraakt | toegestaan zonder gate | n.v.t. — eigen zone |
| **Handover naar echte agent-folder** | Hoog — agent-side-effects | **dry-run** (Q2=A) | incident → git revert (Q4) |
| **Audit-spoor-entry (`cos/audit-spoor/`)** | Laag — eigen zone, reproduceerbaar | toegestaan zonder gate | n.v.t. |
| **Ticket-state-updates (`cos/tickets/`)** | Laag — kanoniek-neutraal staging | toegestaan zonder gate | n.v.t. |
| **Canonieke file in `_shared/`/`decisions.md`/`AGENTS.md`** | Hoog — process-wide drift | **niet vanwege pilot** (Q3=A) | incident → git revert (Q4) |
| **Uitgesloten inputs (Vercel Eve/Adam/HQ/e-mail/...)** | Hoog — T-03 V4 boundary | **niet vanwege pilot** (T-03 V4) | incident → git revert (Q4) |

## Ankers (gelezen, geverifieerd, geherevalueerd per Ronde 19)

| Anker | Bron | Status na closure |
|---|---|---|
| **A) Agent = folder + walk-test** | `_shared/icm-canon.md` §Ronde 19 sync | Behoud; Q1/Q2 schrijven alleen in eigen zone |
| **B) T-02 Optie 5 (folder-auteur = baas, Jev = gate)** | `T-02-cos-baas.md` herzien 2026-09-28 | Behoud; Q3 spiegelt — geen eigen canon-promotie door COS |
| **C) Ronde 19 moties DjinLabs zonder runtimes** | `cos/research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md` | Behoud; Q1/Q2 zijn runtime-vrij |
| **D) Sync-discipline Ronde 16** | `_shared/sync-discipline-canon.md` | Behoud; Q3 respecteert anti-canoniek default |
| **E) Jev fail-CLOSED-regime (Ronde 13/17)** | `_shared/jev-policy-canon.md` | Behoud; Q4 spiegelt fail-CLOSED herstel |
| **F) T-03 R2 routes** | `T-03-cos-routes.md` (R2 closure 2026-09-28) | Behoud; shadow-mode vertaalt T-03 outputs naar drie actie-types |

## Frontier-impact

- ✅ **T-09 conceptueel deblokkeerd** — eerste live use-case kan nu worden gekozen binnen T-04 contract-bandwidth.
- 🔄 **T-06 versterkt** — Hermes match-rate-rapportage vereist Jev-classify_jev of Hermes-bridge-feature; niet beslist in T-04 — T-06-prompt.
- 🔄 **T-08 versterkt** — incident-detectie (parallelle-sessies-context) mogelijk relevant voor T-08.

## Volgende stappen na R1 closure

1. **v0.2 van `_shared/cos-architecture-canon.md`** — §"Shadow-mode-contract" toevoegen met 91-woord-resolutie + risico-tabel (founder-call: vereist dit een aparte Ronde of past het binnen Ronde 19-sync-discipline?).
2. **T-09 oppakken** in een volgende sessie — piloot-scenario kiezen binnen T-04 contract-bandwidth.
3. **T-06 oppakken** (research-ticket, mag AFK) — match-rate-vraag meenemen.

## Verwijzingen

- `../wayfinder-map.md` — frontier-overzicht (T-04 status → closed)
- `../CONTEXT.md` — product-context
- `../architecture-design.md` — COS-werkflow
- `T-01-cos-definitie.md` — T-01 canon-resolutie (gesloten 2026-09-21)
- `T-02-cos-baas.md` — T-02 canon-resolutie (Optie 5, herzien 2026-09-28)
- `T-03-cos-routes.md` — T-03 R2 closure 2026-09-28 (89 woorden, 6/6 tests)
- `_shared/icm-canon.md` — agent = folder + walk-test + §Ronde 19 sync
- `_shared/cos-architecture-canon.md` — v0.1 folder-canon (Ronde 19 lock); v0.2 met §Shadow-mode-contract gepland
- `_shared/sync-discipline-canon.md` — sync-discipline Ronde 16
- `_shared/jev-policy-canon.md` — fail-CLOSED-regime
- `.agents/skills/grilling/SKILL.md` — grill-me-discipline
