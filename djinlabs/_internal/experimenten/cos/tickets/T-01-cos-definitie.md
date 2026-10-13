---
name: T-01-cos-definitie
description: Resolution-artifact voor T-01 — Wat is COS in één zin? Frontier-discipline: één ticket per sessie. Resolution via grill-me-meerdere-rondes tot definitie canon-niveau kwaliteit heeft.
status: closed
date: 2026-09-21
owner: djin
review_status: pending
reviewer: founder
type: grilling
related:
  - ../wayfinder-map.md (T-01)
  - ../architecture-design.md
  - ../CONTEXT.md
  - ../../../../.agents/skills/grilling/SKILL.md
  - ../../../../_shared/icm-canon.md
---

# T-01 — Wat is COS in één zin?

## Status

**Closed (resolved 2026-09-21).** Definitie v0.1 canon-niveau bevestigd door founder.

## Vraag (origineel uit wayfinder-map)

> Wat is de **definitie** van COS, in precies één zin, die je aan een nieuwe agent zou geven die "wat doet COS?" vraagt?

## Acceptance-criteria (uit wayfinder-map T-01)

- Eén zin
- ≤30 woorden
- onafhankelijk van venture-naam (COS is geen Webrnds-feature, geen Djin-agent)
- Testbaar door vreemde (een buitenstaander kan verifiëren of de zin past)

## Resolutie

> **"COS is je Chief of Staff — hij leest je inbox en stuurt elk bericht naar de juiste agent."**

(20 woorden)

### Tests (alle 6 passing)

| Test | Resultaat |
|---|---|
| ≤30 woorden | 20 — passing |
| Eén zin | passing |
| Onafhankelijk van venture-naam | passing — geen venture-naam in zin |
| Testbaar door vreemde | passing — "kwam dit bericht bij de juiste agent?" is verifieerbaar |
| Chief of Staff-titel landt | passing — niet-techneuten snappen de functietitel |
| Onderscheid van agent | passing — zin beschrijft actie ("leest", "stuurt"), niet zijn |

## Grill-me-rondes

| Ronde | Vraag | Uitkomst |
|---|---|---|
| R1 | Aftast-vragen (functie, onderscheid, niet-COS, failure, vaders-test) | 4 ankers vastgelegd |
| R2 | Multi-choice V1-V5 | inbox-triage + COS vs agent onderscheid + Chief of Staff-titel bevestigd |
| R3 | Synthese naar 4 ankers | ankers gevalideerd door founder |
| R4 | Kandidaat A vs B | B gekozen door founder |
| R5 | Canon-niveau-check | B bevestigd, T-01 closed |

## 4 Ankers

1. **Inbox-triage is de kern-actie** — berichten komen binnen, COS routeert naar juiste agent
2. **Vervangt handmatig werk** van de founder (geen werk-uit-handen = geen COS)
3. **COS orkestreert agents** — is zelf geen agent
4. **"Chief of Staff" is de juiste functietitel** — landt bij niet-techneuten

## Vervolg

- **T-02 (wie is COS' baas)** — deze definitie zegt "hij leest en stuurt", maar zegt niet **wie** hem aanstuurt. Blocking ticket voor T-02 is nu opgelost.
- **T-09 (eerste live use-case)** — definitie maakt inbox-triage het primaire use-case. Andere use-cases (sync-discipline, frontier-discipline) zijn secundair.

## Open vraag voor toekomstige Ronde

Deze definitie zegt **wat COS doet** (lezen + sturen) maar niet **hoe** (via Jev-classification, audit-trail, confidence-bands). Die "hoe"-vragen horen in latere tickets:
- T-05 (state-model canon vs runtime)
- T-06 (welke Jev-calls doet COS)
- T-04 (hoe valideren zonder canon te raken)

## Domain-modeling aandachtspunten

Bij canon-niveau definitie (per `.agents/skills/domain-modeling/SKILL.md`):
- De term **COS** + **Chief of Staff** moeten in `CONTEXT.md` (umbrella) glossary verschijnen als ze canon-niveau worden
- Boundary-discipline Ronde 14: COS schrijft onafhankelijk — geen canon-promotie vanuit deze ticket
- Definition is **experiment-niveau** (`status: closed`, `review_status: pending`). Wordt pas canoniek na founder-commit.

## Verwijzingen

- `../wayfinder-map.md` — T-01 frontier-overzicht
- `../architecture-design.md` §1 + §4 — wat COS is + anti-patterns (moet geüpdatet worden met deze definitie als T-02 ook resolved is)
- `../../../../_shared/icm-canon.md` — ICM-discipline
- `../../../../_shared/jev-policy-canon.md` Ronde 17 V1.5 — Jev-classification
- `../../../../_shared/sync-discipline-canon.md` Ronde 16 — sync-discipline
- `../../../../_shared/state-formats-canon.md` — Markdown = knowledge, JSON = state
- `.agents/skills/grilling/SKILL.md` — grill-me-discipline
- `.agents/skills/domain-modeling/SKILL.md` — glossary-discipline
