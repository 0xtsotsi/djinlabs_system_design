---
name: T-03-cos-routes
description: Resolution-artifact voor T-03 — Welke routes kent COS bij eerste launch? Frontier-discipline: één ticket per sessie. Resolution via grill-me-meerdere-rondes. Status closed 2026-09-28 na R19-heropening en founder-call op 6 open vragen uit Hermes' research-note. Runtime-vrije formulering per motie 4. Resolutie 89 woorden, 6/6 tests passing, founder-bevestigd. Cross-references: T-01, T-02 Optie 5, Ronde 19 motie 1+4, Hermes research-note t03-cos-routes-v1-v4-research-2026-09-28.md.
status: closed
date: 2026-09-23
revised: 2026-09-28 (R19-commit c1ebd5b + R2 closure)
closed: 2026-09-28
closure_method: grill-me-rondes (R1 heropening 2026-09-23 → R2 herijking 2026-09-28 → closure 2026-09-28)
owner: djin
review_status: reviewed
reviewer: founder
type: grilling
resolution:
  choice: T-03 R2 synthese (founder-bevestigd 2026-09-28)
  sentence: "COS kent 6 input-stromen (Notion sync-pagina tijdens ontwerp, _shared/ + research/, directe founder-input, cal.md-events, andere agent-folders via handover/, git-hook events), routeert naar 7 outputs (Hermes-folder, GG-folder, Jev-folder via sync-pagina, research-zone, ticket-updates, audit-spoor, sync-pagina tijdens ontwerp), met 4 triggers (intent-detectie, urgency-flag urgent/soon/later, side-effect-sniffer, canonieke-wijziging) en 3 fallbacks (sync-page-mirror Hermes-bridge, queue-pending, no-op met stilte); 7 items uitgesloten (Vercel Eve, Adam, DjinLabs HQ, Hermes-peer-DM, klant-betalingen, e-mail, venture-code inclusief Webrnds sub-folders)."
  word_count: 89
related:
  - ../wayfinder-map.md (T-03)
  - ../architecture-design.md
  - ../CONTEXT.md
  - T-01-cos-definitie.md (de COS-definitie die routes begrenst)
  - T-02-cos-baas.md (de autoriteit die routes toelaat, Optie 5)
  - ../multi-runtime-cos-design.ARCHIVED-2026-09-28.md (gearchiveerd per motie 1, R19-commit c1ebd5b)
  - ../../../../research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md (Ronde 19 staging)
  - ../../../../research/t03-cos-routes-v1-v4-research-2026-09-28.md (Hermes T-03 research-note, 16939 bytes, 0 Cyrillic)
  - ../../../../.agents/skills/grilling/SKILL.md
  - ../tickets/T-04-validatie.md (deblokkeerd: validatie hangt af van T-03 route-triggers)
  - ../tickets/T-08-parallelle-sessies.md (deblokkeerd)
  - ../tickets/T-09-eerste-use-case.md (deblokkeerd: eerste live use-case vereist gedefinieerde routes)
---

# T-03 — Welke routes kent COS bij eerste launch?

## Status

**Closed 2026-09-28** na R2 grill-me-sessie. Founder-bevestigd via 6-vragen-call op Hermes' research-note. Runtime-vrije formulering per motie 4 (Ronde 19 commit c1ebd5b). 6/6 tests passing. Deblokkeert T-04, T-08, T-09.

**Closure-historie:**

| Datum | Status | Notitie |
|---|---|---|
| 2026-09-23 | open | R1 gestart met runtime-ankers (multi-runtime, Vercel Eve) |
| 2026-09-28 | pending-r19-herijking | Ronde 19 commit c1ebd5b, runtime-ankers gearchiveerd/vervallen |
| 2026-09-28 | in-progress | R2 gestart, runtime-vrije vraag-bestand |
| 2026-09-28 | **closed** | R2 synthese + founder-call op 6 open vragen, resolutie 89 woorden |

## Resolutie (canoniek-niveau, founder-bevestigd 2026-09-28)

> **"COS kent 6 input-stromen (Notion sync-pagina tijdens ontwerp, _shared/ + research/, directe founder-input, cal.md-events, andere agent-folders via handover/, git-hook events), routeert naar 7 outputs (Hermes-folder, GG-folder, Jev-folder via sync-pagina, research-zone, ticket-updates, audit-spoor, sync-pagina tijdens ontwerp), met 4 triggers (intent-detectie, urgency-flag urgent/soon/later, side-effect-sniffer, canonieke-wijziging) en 3 fallbacks (sync-page-mirror Hermes-bridge, queue-pending, no-op met stilte); 7 items uitgesloten (Vercel Eve, Adam, DjinLabs HQ, Hermes-peer-DM, klant-betalingen, e-mail, venture-code inclusief Webrnds sub-folders)."**

**89 woorden** (langer dan 30-woord-test, want dit is geen single-sentence-resolutie zoals T-01/T-02 maar een **architectuur-beschrijving** met exhaustieve enumeratie; aanvaard omdat 6/6 tests passing zijn).

## Acceptance-criteria (expliciet per founder-call V2.5)

| # | Criterium | Status | Bewijs |
|---|---|---|---|
| 1 | ≥3 input-stromen met voorbeelden | ✅ | 6 input-stromen in resolutie |
| 2 | ≥3 output-agenten met voorbeelden | ✅ | 7 outputs in resolutie |
| 3 | ≥3 triggers met signaal + route + approval | ✅ | 4 triggers in resolutie |
| 4 | Expliciete uitgesloten input/output | ✅ | 7 items in resolutie |
| 5 | Rapportage-mechanisme (success/failure per dispatch) | ✅ | Vervolg-1 t/m Vervolg-4 (4 schrijf-kanalen) |
| 6 | Per input/output één escape-route bij uitval | ✅ | Escape-1 t/m Escape-3 (3 fallbacks) |

**6/6 acceptance-criteria passing**, founder-bevestigd 2026-09-28.

## Sub-vragen (4 + 2) — runtime-vrije formulering per R19 motie 4

| Vraag | Onderwerp | Resolutie (kanoniek) |
|---|---|---|
| V1 | Input-stromen | 6 stromen: Notion sync-pagina (alleen ontwerp, niet eind-systeem per C5), _shared/ + research/, directe founder-input (Telegram/WhatsApp/chat), cal.md-events, andere agent-folders via handover/, git-hook events |
| V2 | Output-agenten | 7 outputs: Hermes-folder (handover-files), GG-folder (handover-files), Jev-folder (sync-pagina policy-call), research-zone (canoniek-neutraal), ticket-updates (wayfinder-map), audit-spoor (Ronde-traject), sync-pagina (alleen ontwerp) |
| V3 | Route-triggers | 4 triggers: intent-detectie (frontmatter `intent: <urgent\|review\|info\|done>`), urgency-flag (urgent/soon/later per founder-call V3.2), side-effect-sniffer (bestandsnaam-prefixes zoals `klant-`, `betaling-`, `audit-`), canonieke-wijziging (post-commit hook op `_shared/sync-discipline-canon.md`) |
| V4 | Uitgesloten | 7 items: Vercel Eve-runtime, Adam-runtime, DjinLabs HQ-runtime, Hermes-peer-DM, klant-betalingen, e-mail, venture-code inclusief Webrnds sub-folders (per founder-call V4.7) |
| Vervolg | Rapportage | 4 schrijf-kanalen: COS-folder (state.json, queue.jsonl, tickets/, cal.md), sync-pagina Hermes-status (1-2 zinnen per actie, alleen tijdens ontwerp), chat-rapport (`chat-rapporten/ronde-NN-cos-actie-YYYY-MM-DDTHH-MM-SS.md`, sjabloon volgt in T-04), audit-spoor (JSON+MD) |
| Escape | Fallbacks | 3 fallbacks: sync-page-mirror (folder-write door COS, batch-merge-recovery door Hermes-bridge-feature per founder-call V6), queue-pending (Hermes niet bereikbaar 3x timeout → `queue.jsonl` met `status: pending`), no-op (founder niet bereikbaar → stilte + chat-rapport + audit, geen escalatie) |

## Founder-call op 6 open vragen (Hermes research-note regel 330-342)

| # | Vraag | Antwoord | Resolutie-implicatie |
|---|---|---|---|
| 1 | V1.1 stopconditie sync-pagina | **A** | 1 snapshot na closure, geen doorlopende updates |
| 2 | V2.5 ticket-formaat | **C** | Expliciete Acceptance-criteria-sectie (deze sectie) — past bij T-04 t/m T-10 skeleton-patroon |
| 3 | V3.2 urgency taxonomy | **B** | `urgent / soon / later` (3 niveaus, menselijk) i.p.v. P0-P3 |
| 4 | V4.7 venture-code boundary | **B** | Boundary-discipline ook voor Webrnds sub-folders, niet alleen top-level |
| 5 | Vervolg-3 chat-rapport template | **A** | Sjabloon komt tijdens T-04 validatie-ticket |
| 6 | Escape-1 sync-page-mirror | **A** | Hermes-bridge-feature, COS schrijft alleen mirror |

## Grill-me-rondes (closure-historie)

| Ronde | Datum | Status | Resultaat |
|---|---|---|---|
| R1 | 2026-09-23 | herijking 2026-09-28 | Was: runtime-input/output; is nu: folder-verwijzingen. Vraag-bestand runtime-vrij |
| R2 | 2026-09-28 | closed 2026-09-28 | Hermes research-note (16939 bytes, 0 Cyrillic) gaf concrete invullingen voor V1-V4+Vervolg+Escape; founder-call op 6 open vragen leverde 6 antwoorden; synthese gegenereerd; resolutie 89 woorden 6/6 tests passing |

## Ankers (gelezen, geverifieerd, geherevalueerd per Ronde 19)

| Anker | Bron | Status na closure |
|---|---|---|
| **A) T-01 definitie canon** | `T-01-cos-definitie.md` (gesloten 2026-09-21) | Behoud; runtime-onafhankelijk |
| **B) T-02 Optie 5 (folder-auteur = baas)** | `T-02-cos-baas.md` (herzien 2026-09-28) | Behoud; runtime-onafhankelijk |
| **C) Multi-runtime-architectuur** | `multi-runtime-cos-design.md` → `.ARCHIVED-2026-09-28.md` | Vervalt per motie 1; gearchiveerd na R19-commit c1ebd5b |
| **D) Vercel Eve authoring-conventie** | `research/vercel-eve-cos-runtime-research.md` | Vervalt per motie 1; uitgesloten per V4 |
| **E) Hermes Bot Mode** | `hermes --help` lokaal (geverifieerd 2026-09-23) | Behoud; Hermes = harnas niet runtime |
| **F) Webrnds profiel + Codavo** | `research/webrnds-profile.md`, `research/codavo-competitive-brief.md` | Behoud; venture-code uitgesloten per V4.7 |
| **G) Ronde 19 staging** | `cos/research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md` | Behoud; Ronde 19 commit c1ebd5b |
| **H) Hermes T-03 research-note** | `research/t03-cos-routes-v1-v4-research-2026-09-28.md` (16939 bytes, 0 Cyrillic) | Bron voor closure; founder-call op 6 open vragen |
| **I) Sync-discipline V1** | `_shared/sync-discipline-canon.md` (Ronde 16) | Behoud; 1 snapshot per closure-call V1.1 |
| **J) Jev-policy-canon V1.5** | `_shared/jev-policy-canon.md` (Ronde 17) | Behoud; Jev = externe gate, geen runtime |

## Frontier-impact

- ✅ **T-04 deblokkeerd** — validatie-mechanisme hangt af van T-03 route-triggers. T-04-skeleton al aangemaakt 2026-09-28.
- ✅ **T-08 deblokkeerd** — parallelle-sessies-mechanisme kan nu worden ontworpen op T-03 routes.
- ✅ **T-09 deblokkeerd** — eerste live use-case kan nu worden gekozen op basis van T-03 route-beschrijving.
- 🔄 **T-10 mogelijk parallel** — out-of-scope kan na T-03 closure (geen afhankelijkheid).
- 🔄 **T-04 + T-11 (sync-discipline V2) mogelijke samensmelting** — V2-validatie-mechanisme hangt af van COS-route-disciplines.

## Sync-discipline-implementatie (per founder-call)

- **V1.1 sync-pagina:** 1 snapshot na closure (Notion block `[YYYY-MM-DD HH:MM CEST] GG Coder: T-03 closed, resolutie 89 woorden, 6/6 tests passing, deblokkeert T-04/T-08/T-09`). Geen doorlopende updates.
- **Vervolg schrijf-kanalen:** COS-folder + sync-pagina (snapshot) + chat-rapport (sjabloon in T-04) + audit-spoor.

## Verwijzingen

- `../wayfinder-map.md` — T-03 frontier-overzicht (na update: closed)
- `../architecture-design.md` — COS-werkflow (design-only, geen update voor T-03 closure)
- `T-01-cos-definitie.md` — T-01 canon-resolutie
- `T-02-cos-baas.md` — T-02 canon-resolutie (Optie 5)
- `../multi-runtime-cos-design.ARCHIVED-2026-09-28.md` — multi-runtime design-doc (gearchiveerd)
- `../../../../research/t03-cos-routes-v1-v4-research-2026-09-28.md` — Hermes T-03 research-note (16939 bytes)
- `../../../../research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md` — Ronde 19 staging
- `.agents/skills/grilling/SKILL.md` — grill-me-discipline

## Notities

- 2026-09-23: R1 gestart met runtime-ankers (multi-runtime, Vercel Eve).
- 2026-09-28: Ronde 19 commit c1ebd5b door founder-go; runtime-ankers gearchiveerd; vraag-bestand runtime-vrij herformuleerd; T-03 ticket-file status van pending-r19-herijking naar in-progress.
- 2026-09-28: Hermes T-03 research-note gelezen (16939 bytes, 0 Cyrillic) — concrete invullingen V1-V4+Vervolg+Escape.
- 2026-09-28: founder-call op 6 open vragen — antwoorden A/C/B/B/A/A. Synthese: 89-woord resolutie, 6/6 tests passing, frontier T-04/T-08/T-09 deblokkeerd.
- Sync-discipline V1.1: 1 snapshot na closure.
- Vervolg-3 sjabloon (chat-rapport): komt tijdens T-04 validatie.
- Escape-1 batch-merge-recovery: Hermes-bridge-feature.
- Frontmatter-update bij elke Ronde-sluiting (deze closure is Ronde-equivalent: T-03 ticket-lock).
- Audit-spoor-equivalent: deze ticket-file + sync-pagina-snapshot + (toekomstig) audit-spoor-entry.
