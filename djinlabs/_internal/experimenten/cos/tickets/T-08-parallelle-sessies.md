---
name: T-08-parallelle-sessies
description: Resolution-artifact voor T-08 — Hoe orkestreert COS meerdere parallelle sessies?. Frontier-discipline: één ticket per sessie. Resolution via grill-me-meerdere-rondes. Status closed: gefinaliseerd 2026-10-10 R1 met founder-call A/A/D/C. Runtime-vrij per Ronde 19 motie 1.
status: closed
date: 2026-09-28 (skeleton) / 2026-10-10 (closed)
owner: djin
review_status: reviewed
type: grilling
related:
  - ../wayfinder-map.md (T-08)
  - ../architecture-design.md
  - ../CONTEXT.md
  - ../../../../research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md (Ronde 19 staging, motie 4)
  - ../../../../_shared/icm-canon.md (agent = folder)
  - ../../../../_shared/sync-discipline-canon.md (Ronde 16)
  - ../../../../.agents/skills/grilling/SKILL.md
  - T-01-cos-definitie.md (COS definitie)
  - T-02-cos-baas.md (COS autoriteit, Optie 5)
  - T-03-cos-routes.md (input/output-agenten, in herijking per motie 4)
  - T-09-eerste-use-case.md (T-09 Hermes-als-writer → herijking naar weekly-batch in Ronde 20+)
---

# T-08 — Hoe orkestreert COS meerdere parallelle sessies?

## Status

**Closed 2026-10-10 R1** met founder-call A/A/D/C. 4-vragen grill, 4/4 criteria passing, 88-woord orchestratie-contract, runtime-vrij per Ronde 19 motie 1.

**Closed door:** COS (agent) op full-auto mandate. **Founder-call:** A/A/D/C (zie Decisions so far).

## Vraag

Hoe voorkomt COS dat twee parallelle sessies (Hermes + GG) dezelfde research-file bewerken? Locking-mechanisme? Sequencer? Optimistic concurrency?

## Resolutie (88 woorden)

COS orkestreert parallelle sessies via vier ankerpunten: (1) per-bericht-filenames in handover-shadow voorkomen race-by-design; (2) per-chat-kanaal sequencer (Telegram-FIFO canoniek, geen DjinLabs-runtime); (3) Hermes/GG beoordelen wekelijks in batch (Ronde 19: peer, geen service); (4) dual-version behoud bij onverwachte race, founder arbitreert. Geen file-locks, geen DjinLabs-sequencer (Ronde 19), geen COS-merge (T-02 Optie 5), geen auto-revert (founder = baas). T-09 canon-implicatie: Hermes-als-writer herijkt naar weekly-batch.

## Blocking

~~geen (F8 afgeleid)~~ **deblokkeerd** — F8 (parallelle sessies) resolutie zit in T-08 §Resolutie.

## Type

grilling

## Acceptance-criteria

- Conflict-resolution-strategie met praktijkvoorbeeld. ✅ (per-bericht-filenames, zie §Resolutie anker 1)
- Sequencer-keuze. ✅ (per-chat-kanaal FIFO, zie §Resolutie anker 2)
- Hermes/GG-interactie-model. ✅ (weekly-batch peer, zie §Resolutie anker 3)
- Recovery-strategie. ✅ (dual-version + founder-arbitrage, zie §Resolutie anker 4)

**4/4 criteria passing.**

## Ankers (gevolgd, geverifieerd)

| Anker | Bron | Status |
|---|---|---|
| **A) Agent = folder** | `_shared/icm-canon.md` | ✅ Gevolgd — per-bericht-filenames zijn agent-folder-discipline |
| **B) T-02 Optie 5 (folder-auteur = baas, Jev = gate)** | `cos/tickets/T-02-cos-baas.md` | ✅ Gevolgd — geen COS-merge, geen auto-revert, founder arbitreert |
| **C) Ronde 19 moties DjinLabs zonder runtimes** | `cos/research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md` | ✅ Gevolgd — geen DjinLabs-sequencer, geen file-locks |
| **D) Sync-discipline Ronde 16** | `_shared/sync-discipline-canon.md` | ✅ Gevolgd — sequencer is extern (Telegram-FIFO), geen COS-auto-commit |

## Frontier-discipline

Eén ticket per sessie (wayfinder-regel §105). Uitzondering: research-tickets (T-06) mogen AFK worden opgelost per `tickets/README.md` regel 48.

## Volgende stap

1. ✅ T-08 closed 2026-10-10.
2. **T-09 canon-herijking (Ronde 20+):** Hermes-als-real-time-writer (T-09 resolutie) wordt herijkt naar Hermes-als-weekly-batch (consistent met T-08 anker 3). Founder opent Ronde-traject wanneer ready.
3. **T-11 sync-discipline V2:** optioneel, indien Hermes-akkoord binnenkomt (zie T-11 file). Niet-blokkerend voor T-08 closure.
4. **Canon-promotie naar v0.2 §Parallelle-sessies** (Ronde 20+): anker D + T-08 resolutie worden onderdeel van `_shared/cos-architecture-canon.md`.

## Decisions so far
| # | Datum | Beslissing | Bron |
|---|---|---|---|
| 1 | 2026-09-28 | Skeleton aangemaakt | this file |
| 2 | 2026-10-10 | A/A/D/C: per-bericht-filenames + chat-FIFO + wekelijkse review + dual-version | founder-call |

## Verwijzingen

- `../wayfinder-map.md` — frontier-overzicht (T-08 closed)
- `../CONTEXT.md` — product-context
- `../architecture-design.md` — COS-werkflow
- `T-01-cos-definitie.md` — T-01 canon-resolutie (gesloten 2026-09-21)
- `T-02-cos-baas.md` — T-02 canon-resolutie (Optie 5, herzien 2026-09-28)
- `T-03-cos-routes.md` — T-03 R2 closure (runtime-vrij)
- `T-04-validatie.md` — shadow-mode-contract
- `T-09-eerste-use-case.md` — T-09 (Hermes-als-writer → herijking in Ronde 20+)
- `../../../../research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md` — Ronde 19 staging
- `_shared/icm-canon.md` — agent = folder + walk-test
- `_shared/sync-discipline-canon.md` — sync-discipline Ronde 16
- `.agents/skills/grilling/SKILL.md` — grill-me-discipline
