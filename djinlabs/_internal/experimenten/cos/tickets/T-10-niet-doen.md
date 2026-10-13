---
name: T-10-niet-doen
description: Resolution-artifact voor T-10 — Wat doet COS NIET bij eerste launch?. Frontier-discipline: één ticket per sessie. Resolution via grill-me-meerdere-rondes. Status closed: gefinaliseerd 2026-10-10 R1 met COS full-auto mandate D/D/D/D. Runtime-vrij per Ronde 19 motie 1.
status: closed
date: 2026-09-28 (skeleton) / 2026-10-10 (closed)
owner: djin
review_status: reviewed (COS full-auto mandate acknowledged)
type: grilling
related:
  - ../wayfinder-map.md (T-10)
  - ../architecture-design.md
  - ../CONTEXT.md
  - ../../../../research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md (Ronde 19 staging, motie 4)
  - ../../../../_shared/icm-canon.md (agent = folder)
  - ../../../../_shared/sync-discipline-canon.md (Ronde 16)
  - ../../../../.agents/skills/grilling/SKILL.md
  - T-01-cos-definitie.md
  - T-02-cos-baas.md (Optie 5, founder = baas)
  - T-03-cos-routes.md (input/output-agenten)
---

# T-10 — Wat doet COS NIET bij eerste launch?

## Status

**Closed 2026-10-10 R1** met COS full-auto mandate. 4-vragen grill, 4/4 criteria passing, 73-woord out-of-scope-contract, runtime-vrij per Ronde 19 motie 1. T-10 is het eerste ticket dat via "COS full-auto mandate" is gesloten i.p.v. per-vraag founder-call — precedent voor toekomstige operationele tickets waar founder-call niet materieel is.

**Closed door:** COS (agent) op full-auto mandate (Commander 2026-10-10). **Aanbeveling:** D/D/D/D (defense-in-depth, alle-uitgesloten, Ronde 19-conform).

## Vraag

Wat is expliciet out-of-scope voor COS v0.1?

## Resolutie (73 woorden)

COS v0.1 doet expliciet NIET: (1) canon-promotie, agent-roster, klantuitvoer (founder-werk); (2) queue, database, dashboard, eigen runtime (Ronde 19 motie 1); (3) onbekende agent-classes, agents zonder agentId, Hermes-equivalenten (geen onveilige delegatie); (4) bij out-of-scope: defense-in-depth — founder-call voor high-impact, error-response voor low-impact, audit-entry+skip voor spam. Geen auto-promotie, geen eigen runtime, geen agent-zonder-id, geen onveilige escalatie.

## Blocking

geen (afgesloten via COS full-auto mandate)

## Type

grilling

## Acceptance-criteria

- Uitgesloten bewerkingen. ✅ (canon-promotie + agent-roster + klantuitvoer, zie §Resolutie anker 1)
- Uitgesloten runtime-onderdelen. ✅ (queue + database + dashboard, zie §Resolutie anker 2)
- Uitgesloten agent-typen. ✅ (onbekende + zonder agentId + Hermes-equivalenten, zie §Resolutie anker 3)
- Escalatie-paden bij OOS. ✅ (defense-in-depth, zie §Resolutie anker 4)

**4/4 criteria passing.**

## Ankers (gevolgd, geverifieerd)

| Anker | Bron | Status |
|---|---|---|
| **A) Agent = folder** | `_shared/icm-canon.md` | ✅ Gevolgd — agents zonder agentId zijn geen agent |
| **B) T-02 Optie 5 (folder-auteur = baas, Jev = gate)** | `cos/tickets/T-02-cos-baas.md` | ✅ Gevolgd — canon-promotie + agent-roster + klantuitvoer = founder-werk |
| **C) Ronde 19 moties DjinLabs zonder runtimes** | `cos/research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md` | ✅ Gevolgd — geen queue, geen database, geen dashboard, geen eigen runtime |
| **D) Sync-discipline Ronde 16** | `_shared/sync-discipline-canon.md` | ✅ Gevolgd — geen auto-escalatie (founder = baas, audit-entry voor stil-learnings) |

## Frontier-discipline

Eén ticket per sessie (wayfinder-regel §105). Uitzondering: research-tickets (T-06) mogen AFK worden opgelost per `tickets/README.md` regel 48.

## Volgende stap

1. ✅ T-10 closed 2026-10-10.
2. **Open vragen (zie hieronder):**
   - Post-launch evaluatie bij 3 maanden live (Ronde 22+).
   - High-impact vs low-impact classificatie via praktijk-casus.
3. **Canon-promotie naar v0.2 §Out-of-scope** (Ronde 20+): anker D + T-10 resolutie worden onderdeel van `_shared/cos-architecture-canon.md`.

## Open vragen
- [ ] Post-launch evaluatie: welke OOS-keuzes bleken te strak of te los? — Eerste check bij 3 maanden live (Ronde 22+).
- [ ] Hoe wordt "high-impact" vs "low-impact" requests geclassificeerd? — Praktijk-casus per aanvraag, geen rigide regels (Ronde 19: COS = folder, geen classifier-runtime).

## Decisions so far
| # | Datum | Beslissing | Bron |
|---|---|---|---|
| 1 | 2026-09-28 | Skeleton aangemaakt | this file |
| 2 | 2026-10-10 | D/D/D/D: alle-bewerkingen + alle-runtime + alle-agent-typen + defense-in-depth escalatie | full-auto mandate (Commander) |

## Verwijzingen

- `../wayfinder-map.md` — frontier-overzicht (T-10 closed)
- `../CONTEXT.md` — product-context
- `../architecture-design.md` — COS-werkflow
- `T-01-cos-definitie.md` — T-01 canon-resolutie
- `T-02-cos-baas.md` — T-02 Optie 5 (founder = baas)
- `T-03-cos-routes.md` — T-03 R2 closure
- `../../../../research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md` — Ronde 19 staging
- `_shared/icm-canon.md` — agent = folder + walk-test
- `_shared/sync-discipline-canon.md` — sync-discipline Ronde 16
- `.agents/skills/grilling/SKILL.md` — grill-me-discipline
