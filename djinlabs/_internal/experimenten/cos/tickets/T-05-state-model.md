---
name: T-05-state-model
description: Resolution-artifact voor T-05 — Wat is COS' state-model? R1 closure 2026-10-08 via grill-me-funder-call 5-vragen-call (4×A + Q1-aanvulling). Per-call observatie = Markdown-tabel in cos/audit-spoor/dispatch-<date>.md (founder-voorkeur, sluit aan op state-formats-canon). Geen sessie-aggregaat door COS (Hermes doet wekelijks). Tickets MD, audit-spoor MD (canon-discipline). Retention operationeel (30 dagen default); incident-files krijgen retention: canoniek via frontmatter-override. State-formats-canon hint toegevoegd (canoniek-uitbreiding-light); derde bucket is open canonieke vraag voor latere Ronde.
status: closed
date: 2026-09-28
revised: 2026-10-08
closed: 2026-10-08
closure_method: grill-me-rondes (R1 closure 2026-10-08, founder-call 5-vragen-A/Q1-Markdown-aanvulling)
owner: djin
review_status: reviewed
reviewer: founder
type: grilling + domain-modeling
resolution:
  choice: T-05 R1 synthese (founder-bevestigd 2026-10-08)
  per_call_state:
    format: Markdown-tabel
    location: cos/audit-spoor/dispatch-<date>.md
    schema_columns: [date, dispatch_id, intent, urgency, side_effect, match_rate, agent_route, false_positive_flag, incident_id]
    rationale: "Markdown = knowledge per state-formats-canon; dispatch-log is leesbaar-door-founder (week-1-evaluatie), JSONL uitgesteld naar T-08+ waar agents state-machines krijgen"
  session_aggregate: none (Hermes doet wekelijkse aggregatie)
  markdown_json_split: "tickets = Markdown (kanoniek-neutraal staging); audit-spoor = Markdown-detail (observatie-logs); geen JSONL-runtime-state in pilot-fase"
  retention:

# T-05 — Wat is COS' state-model?

## Status

**Closed 2026-10-08** na R1 grill-me-sessie. Founder-bevestigd via 5-vragen-call (4×A + Q1-aanvulling). State-schema vastgelegd: per-call observatie = Markdown-tabel in `cos/audit-spoor/dispatch-<date>.md` met 9-koloms-schema. Geen sessie-aggregaat door COS; Hermes doet wekelijks. Tickets + audit-spoor beide Markdown; geen JSONL in pilot-fase. Retention `operationeel` default; `canoniek` voor incident-files via frontmatter-override. `_shared/state-formats-canon.md` hint toegevoegd (canoniek-uitbreiding-light, pre-generator hand-edit per sync-discipline R16 §3). Derde bucket (observatie / kanoniek-neutraal staging) blijft canonieke vraag voor latere Ronde. T-07 + T-08 volgende stappen (T-08 mogelijk wanneer JSONL-state-machines relevant worden).

**Closure-historie:**

| Datum | Status | Notitie |
|---|---|---|
| 2026-09-28 | pending-r19-herijking | Skeleton aangemaakt door GG Coder (kanoniek-neutraal) |
| 2026-10-08 | **closed** | R1 synthese na 5-vragen-call (Q1=Markdown-aanvulling + Q2/Q3/Q4=A + Q5=B); 96-woord resolutie; canonieke hint toegevoegd |

## Resolutie (canoniek-niveau, founder-bevestigd 2026-10-08)

> "COS houdt per-call observatie bij als Markdown-tabel in cos/audit-spoor/dispatch-<date>.md met kolommen (date, dispatch_id, intent, urgency, side_effect, match_rate, agent_route, false_positive_flag, incident_id) — sluit aan op state-formats-canon (Markdown = knowledge), is leesbaar voor founder tijdens week-1-evaluatie, en stelt JSONL uit naar T-08+ waar agents state-machines krijgen. Geen sessie-aggregaat door COS (Hermes doet wekelijkse review per T-04 Q2). Tickets (Markdown, kanoniek-neutraal staging) en audit-spoor (Markdown-detail, observatie-logs) volgens canon-discipline. Retention-default operationeel (30 dagen, parameter per retention-policy-canon); incident-files krijgen retention: canoniek via frontmatter-override. _shared/state-formats-canon hint toegevoegd (kanoniek-uitbreiding-light); derde bucket is open canonieke vraag voor latere Ronde."

**96 woorden** (past bij T-04 R1 + T-06 R1 + T-09 R1-stijl; runtime-vrij; canon-discipline).

## Per-call observatie-schema (9 kolommen)

| # | Kolom | Type | Bron | Toelichting |
|---|---|---|---|---|
| 1 | `date` | ISO-date | bestandsnaam | `<date>` segment in `dispatch-<date>.md` |
| 2 | `dispatch_id` | UUID-short | T-06 cos_dispatch_classify output | uniek per dispatch-call |
| 3 | `intent` | enum | T-03 V3 intent-detectie | doel-agent (Hermes/GG/Jev) |
| 4 | `urgency` | 0-1 score | T-06 cos_dispatch_classify | high/mid/low-band; T-04 Q2 |
| 5 | `side_effect` | bool | T-06 cos_dispatch_classify noul | raakt het een canonieke zone? |
| 6 | `match_rate` | 0-1 score | T-06 cos_hermes_match_rate_score | wekelijks; leeg in dispatch-tekst we latere vulling |
| 7 | `agent_route` | enum | T-03 outputs handover-shadow | Hermes/GG/Jev/GG-default |
| 8 | `false_positive_flag` | bool | T-06 cos_false_positive_detect | T-04 Q4 incident-trigger |
| 9 | `incident_id` | slug | T-04 Q4 | alleen gevuld als false_positive_flag=true |

**Voorbeeld-rij:** `2026-10-08 | abc123 | Hermes | 0.85 | false | (wekelijks) | Hermes | false | —`

## Markdown-vs-runtime onderscheid (canon-discipline)

| File-soort | Locatie | Formaat | Rol |
|---|---|---|---|
| Tickets | `cos/tickets/T-NN-*.md` | Markdown | kanoniek-neutraal staging; kennis-over-de-beslissing |
| Audit-spoor detail | `cos/audit-spoor/dispatch-<date>.md` | Markdown-tabel | observatie-log; kanoniek-neutraal staging-audit-trail |
| Audit-spoor incident | `cos/audit-spoor/incident-<ts>.md` | Markdown | observatie-log + frontmatter `retention: canoniek` (override) |
| (geen JSONL in pilot-fase) | — | — | uitgesteld naar T-08+ waar state-machines relevant worden |

**Waarom geen JSONL nu:** per `_shared/state-formats-canon` is JSON = state, niet knowledge. Een dispatch-log is geen knowledge in de stricte zin (geen canon-beslissing) en geen runtime-state in de stricte zin (geen process-tooling input). Markdown-tabel = leesbaar-door-founder = past bij pilot-fase. JSONL komt zodra agents state-machines krijgen (T-08+).

## Retention-regime

| Scenario | Retention | Bron |
|---|---|---|
| Standaard dispatch-rij | `operationeel` (30 dagen) | `_shared/retention-policy-canon.md` default |
| Incident-file | `canoniek` | frontmatter-override per retention-policy-canon regel 144 |
| Pilot-week-summary (door Hermes) | `operationeel` (30 dagen) | Hermes-zijdig; geen COS-state |

## Pilot-implementatie note

> Dispatch-log wordt canoniek-neutraal behandeld: `cos/audit-spoor/dispatch-<date>.md` is een observatie-log (zie `_shared/state-formats-canon.md` §Observatie-logs), geen canonieke bron en geen runtime-state. Of `state-formats-canon` uitgebreid moet worden met een derde bucket (bv. `observatie` of `kanoniek-neutraal staging`) is een **open canonieke vraag voor latere Ronde**. Tot die Ronde leven ze onder de §Observatie-logs-hint + retention-regime hierboven.

## Acceptance-criteria (uit skeleton + Q1-Q5)

| # | Criterium | Status | Bewijs |
|---|---|---|---|
| 1 | Per-call state-velden expliciet | ✅ | 9-koloms-schema (date, dispatch_id, intent, urgency, side_effect, match_rate, agent_route, false_positive_flag, incident_id) |
| 2 | Sessie-aggregaat-regime | ✅ | Geen aggregaat door COS; Hermes doet wekelijks |
| 3 | Canon-vs-runtime onderscheid | ✅ | Tickets MD, audit-spoor MD, geen JSONL; sluit aan op state-formats-canon |
| 4 | Retention-regime | ✅ | operationeel default; canoniek override voor incident-files |
| 5 | State-schema conform state-formats-canon | ✅ | Hint toegevoegd (canoniek-uitbreiding-light); derde bucket als open canonieke vraag |

**5/5 acceptance-criteria passing**, founder-bevestigd 2026-10-08.

## Sub-vragen (5) en antwoorden

| # | Vraag | Onderwerp | Antwoord |
|---|---|---|---|
| Q1 | Per-call state | Welke velden per dispatch | **A. 4-velden baseline** met founder-aanvulling: **Markdown-tabel** in `cos/audit-spoor/dispatch-<date>.md` i.p.v. JSONL — sluit aan op state-formats-canon (Markdown = knowledge), leesbaar voor founder, JSONL uitgesteld naar T-08+ |
| Q2 | Sessie-aggregaat | Wat op sessie-niveau | **A. Geen aggregaat door COS** — Hermes doet wekelijkse review (scheiding van verantwoordelijkheid) |
| Q3 | Markdown-vs-JSON verdeling | Welke rol in welk formaat | **A. Tickets MD + audit-spoor MD-detail** — canon-discipline letterlijk toegepast; geen JSONL in pilot-fase |
| Q4 | Retention-class | Welke retention voor `cos/audit-spoor/dispatch-<date>.md` | **A. `operationeel`** (30 dagen default, parameter); incident-files krijgen `retention: canoniek` via frontmatter-override |
| Q5 | Observatie-categorie-relatie tot state-formats-canon | Hoe relateren we aan canon | **B. Praktisch: dispatch-log is "kennis over wat COS heeft gedaan"** — geen canon-uitbreiding in T-05 zelf; hint toegevoegd; derde bucket is open canonieke vraag voor latere Ronde |

## Ankers (gelezen, geverifieerd)

| Anker | Bron | Status na closure |
|---|---|---|
| **A) Agent = folder + walk-test** | `_shared/icm-canon.md` §Ronde 19 sync | Behoud; dispatch-log is folder-state |
| **B) Markdown = knowledge, JSON = state** | `_shared/state-formats-canon.md` Ronde 15 + §Observatie-logs hint 2026-10-08 | Behoud; dispatch-log behandeld als observatie-log (kanoniek-neutraal staging) |
| **C) Retention hierarchie** | `_shared/retention-policy-canon.md` | Behoud; operationeel + canoniek-override voor incident |
| **D) Sync-discipline R16 §3 pre-generator hand-edit** | `_shared/sync-discipline-canon.md` | Behoud; hint toegevoegd als pre-generator hand-edit |
| **E) T-02 Optie 5 (folder-auteur = baas, Jev = gate)** | `T-02-cos-baas.md` herzien 2026-09-28 | Behoud; dispatch-log is in eigen zone `cos/audit-spoor/` |
| **F) T-04 Q3 eigen zones** | `T-04-validatie.md` R1 closure | Behoud; dispatch-log in `cos/audit-spoor/` past binnen Q3-regime |
| **G) T-06 3 Jev-calls → schema-kolommen** | `T-06-jev-calls.md` R1 closure | Behoud; intent/urgency/side_effect/match_rate/false_positive_flag komen rechtstreeks uit T-06-calls |

## Frontier-impact

- **T-07 versterkt** — failure-mode bij Jev-down betekent match-rate niet beschikbaar; in dispatch-log blijft `match_rate` leeg voor de week; Hermes-rapport pauzeert, dispatch loopt door (fail-CLOSED per T-06).
- **T-08 versterkt** — parallelle sessies: dispatch-log is append-only Markdown; race-conditions via lock-discipline op te lossen in T-08 R1. JSONL-pas voor state-machines wordt T-08-prompt.
- **T-10 versterkt** — out-of-scope: dispatch-log blijft binnen `cos/audit-spoor/` (T-04 Q3-regime), geen grens-uitbreiding tijdens pilot.
- **v0.2 `_shared/cos-architecture-canon.md`** — T-05-resolutie past in §State-schema (per-call + retention + canon-discipline).

## Volgende stappen na R1 closure

1. **Pilot-start-blokkering opgeheven** — dispatch-log-zone klaar (folder-discipline + retention-regime + schema). Founder-call: kick-off-datum zetten.
2. **T-07 oppakken** — failure-mode bij Jev-down (grilling-call, jij antwoordt).
3. **T-08 oppakken** — parallelle sessies + lock-discipline + eventueel JSONL-pas (grilling-call).
4. **v0.2 `_shared/cos-architecture-canon.md`** — §State-schema met T-05-resolutie + §Pilot-scenario met T-09 + §Shadow-mode-contract met T-04 + §Pilot-Jev-calls met T-06 (founder-call: Ronde-equivalent of directe sync-edit).

## Verwijzingen

- `../wayfinder-map.md` — frontier-overzicht (T-05 status → closed)
- `../CONTEXT.md` — product-context
- `../architecture-design.md` — COS-werkflow
- `T-01-cos-definitie.md` — COS definitie
- `T-02-cos-baas.md` — Optie 5 autoriteit
- `T-03-cos-routes.md` — R2 closure 2026-09-28
- `T-04-validatie.md` — R1 closure 2026-10-08 (shadow-mode-contract, Q3)
- `T-06-jev-calls.md` — R1 closure 2026-10-08 (3 calls → schema-kolommen)
- `T-09-eerste-use-case.md` — R1 closure 2026-10-08 (Telegram-inbox triage)
- `_shared/icm-canon.md` — agent = folder + walk-test + Ronde 19 sync
- `_shared/state-formats-canon.md` — Ronde 15 + §Observatie-logs hint 2026-10-08
- `_shared/retention-policy-canon.md` — hierarchie + frontmatter-override-regel
- `_shared/sync-discipline-canon.md` — Ronde 16 + §3 pre-generator hand-edit
- `_shared/jev-policy-canon.md` — V1.5, retention classes
- `_shared/cos-architecture-canon.md` — v0.1 (Ronde 19 lock); v0.2 met §State-schema gepland
- `.agents/skills/grilling/SKILL.md` — grill-me-discipline

## Notities

- 2026-09-28: Skeleton aangemaakt door GG Coder, kanoniek-neutraal.
- 2026-10-08: R1 grill-me-sessie; 5-vragen-call met Q1-Markdown-aanvulling; synthese naar state-schema; 5/5 tests passing.
- 2026-10-08: `_shared/state-formats-canon.md` §Observatie-logs toegevoegd (canoniek-uitbreiding-light, pre-generator hand-edit per sync-discipline R16 §3).
- 2026-10-08: Statuswijziging van pending-r19-herijking → closed (frontmatter).
- 2026-10-08: 1 sync-pagina-snapshot per sync-discipline V1.1-equivalent.
