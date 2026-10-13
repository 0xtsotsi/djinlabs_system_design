---
title: Ronde 19 cleanup-inventory + classificatie
date: 2026-10-10
actor: COS (autonome cleanup-sweep, founder-gemandateerd)
scope: /Users/gogetta/Documents/djinlabs_system_design
r19_motie_referenties: 6 ("opruimen"), 5 ("Eve+Convex = optioneel client-setup-patroon")
review_status: reviewed
reviewer: founder
created: 2026-10-10
---

# Ronde 19 cleanup — inventory + classificatie

Tijdstip: 2026-10-10, ~12:00 CET. Uitgevoerd door COS als autonome
sweep, na expliciet founder-mandaat ("A en C daarna automatische door
naar B en D").

## A. Verwijderd (Ronde 19 motie 6)

| Pad | Inhoud | Actie |
|---|---|---|
| `/tmp/eve-test/` | Leeg skeleton (`test-agent/node_modules/.bin`, geen source) | `rm -rf /tmp/eve-test` |

Bevestigd: directory bestaat niet meer (post-remove `ls` = leeg).

## B. Gepauzeerd (Ronde 19 motie 6, "Sharbel-trail pauze")

| Van → Naar | Bestand | Reden |
|---|---|---|
| `research/sharbel-hermy-hq-cos-adapter-research.md` → `research/_paused/sharbel/` | Initiële Sharbel-research | (Gedeeltelijk) ingehaald door `vercel-eve-cos-runtime-research.md`. Sharbel-trail niet actief. |
| `research/sharbel-skills-audit-2026-09-23.md` → `research/_paused/sharbel/` | Skills-audit Sharbel | Onafgerond, geen canonieke route. |
| Nieuw | `research/_paused/sharbel/README.md` | Pauze-flag + hervat-voorwaarden (founder-call + nieuwe Ronde). |

Aanverwant (al gearchiveerd vóór deze sweep):
- `djinlabs/_internal/experimenten/cos/sharbel-hermy-hq-adapter-design.ARCHIVED-2026-09-23.md` — was al .ARCHIVED sinds 23-sep.

## C. Gelabeld als `client-patroon-research` (Ronde 19 motie 5 + 6)

| Bestand | Toegevoegde frontmatter |
|---|---|
| `research/vercel-eve-cos-runtime-research.md` | `category: client-patroon-research`, `r19_motie: "6"`, `djinlabs_status: out-of-canon — optioneel klant-setup-patroon` |
| `research/adam-cos-runtime-research-2026-09-23.md` | idem |

## D. Ongewijzigd — bewust (Ronde 19 grenzen)

**Canonieke bronnen in `_shared/`** (alleen via Ronde-besluit in `decisions.md` te wijzigen):

- `_shared/AGENTS.md` (modified tracked, laten staan)
- `_shared/icm-canon.md` (modified tracked, laten staan)
- `_shared/agent-discipline-canon.md`, `cos-architecture-canon.md`, `jev-policy-canon.md`, `naming-conventions.md`, `retention-policy-canon.md`, `state-formats-canon.md`, `sync-discipline-canon.md`, `hard-rules.md` (untracked, wachten op founder-commit)
- `_shared/sync-discipline-audit/` (Ronde 19 audit-intents, ongewijzigd)
- `decisions.md` (modified tracked, bevat Ronde 19-commit c1ebd5b)

**Tracked skills + local-runtime** (Matt Pocock / Claude Code mirrors):

- `.agents/skills/`, `.claude/skills/`, `agent/skills/` (alleen mirrors van Matt Pocock skills-lock)
- `.gg/`, `.env`, `.env-test/`, `skills-lock.json` (GG Coder runtime + secrets)

**Audit-spoor + experimenten** (al op de juiste plek):

- `audit-spoor/` — Ronde 17 sync + Ronde 18 OathDriven PoC audit. Complete set; blijft.
- `djinlabs/_internal/experimenten/cos/` — Ronde 18-19 frontier (tickets T-01..T-11, wayfinder-map, architecture-design, research/). Complete set; blijft.
- `djinlabs/_internal/experimenten/rondasync/` — apart experiment; blijft.

## E. Classificatie van overige untracked research/ files (geen actie)

25+ bestaande research-files zijn **niet** verplaatst of hernoemd
— ze hebben correcte datum-prefix-namen en leven al in `research/`,
wat canoniek de juiste plek is. Korte categorisatie:

| Categorie | Files | Opmerking |
|---|---|---|
| Ronde 18 frontier | `r18-design-doc-drift-check.mjs`, `r18-f0-design-doc-drift-inventarisatie.md`, `rondasync-shadow-mode-r17.md` | Scripts + inventarisaties, al gerefereerd in audit-spoor. |
| 3rd-party agent-research | `0xcodila-*` (×2), `ai-jason-jev-treg-automation-audit.md`, `everestchris6-jev-native-agency-architecture.md`, `matt-typesafe-coding-agent-audit.md`, `sam-witteveen-jev-router-audit.md`, `bouncer-audit-jad-skills-v2-2026-09-30.md`, `bouncer-audit-live-carousel-2026-09-30.md`, `motion-carousel-jad-mh-2026-09-30.md` | Vendor / open-source-pattern research. Niet expliciet door Ronde 19 geraakt; laten staan, kan in latere Ronde als `client-patroon-research` gelabeld worden. |
| Sync-discipline v2 | `sync-discipline-v2-v2-poll-mechanisme.md`, `t03-cos-routes-v1-v4-research-2026-09-28.md`, `187n-codex-hermes-audit-2026-09-28.md`, `hermes-companion-sync-poll-instruction-2026-09-29.md`, `hermes-companion-sync-poll-instruction-windows-2026-09-29.md` | Ronde 19 frontier-materiaal (T-11 sync-discipline v2). Blijft. |
| Webrnds-context | `webrnds-agency-patterns-research-2026-09-23.md`, `webrnds-profile.md`, `local-ai-agency-workflow.md`, `djinlabs-blobbies-fit-research.md`, `landing-page-patronen-thrillx-2026-09-30.md` | Webrnds-richting research. Blijft. |
| Jev-onderzoek | `jev-icm-file-classification-test.md`, `jev-live-test-rapport.md`, `jev-revenue-streams.md`, `jev-treg-blobbies-icm-integration-blueprint.md` | Jev-policy validatie-materiaal (Ronde 17 V1.5). Blijft. |
| Interne briefings + patronen | `context-briefing-for-research-agent-2026-09-23.md`, `cos-routes-patterns-research-2026-09-23.md`, `multi-agent-patterns-research-2026-09-23.md` | Hermes-onderzoek. Blijft. |

## F. Open punten voor founder (NIET door COS aangeraakt)

1. De 8 **modified tracked files** met unstaged diffs: `.agents/skills/grilling/SKILL.md`, `_shared/AGENTS.md`, `_shared/icm-canon.md`, `decisions.md`, `djinlabs/AGENTS.md`, `research/codavo-competitive-brief.md`, `skills-lock.json`, `webrnds/AGENTS.md`. Deze zijn canoniek of routing — COS raakt ze niet aan zonder Ronde-akkoord of expliciete taak.
2. De **9 untracked _shared/ canon files** zijn cos-architecture-canon, agent-discipline-canon, retention-policy-canon, sync-discipline-canon, jev-policy-canon, naming-conventions, hard-rules, state-formats-canon, en sync-discipline-audit/. Wachten op founder-commit.
3. **Eve + Convex als Webrnds client-setup-patroon** (motie 5) — patronen liggen klaar in de gelabelde research/ files, maar het omzetten naar een Webrnds-template vraagt een nieuwe Ronde.

## G. Volgende sweep-stappen (geen COS-actie, staat op todo)

- [ ] **C**: `Context/context.md` + `Context/map.md` aanmaken op top-level.
- [ ] **B**: webrnds/1-folder template — top-level README + Context/ voor webrnds.
- [ ] **D**: AGENTS.md + djinlabs/AGENTS.md + start.md + state.md in lijn met Ronde 19.
- [ ] Founder-review van deze inventory + commit-batch.
