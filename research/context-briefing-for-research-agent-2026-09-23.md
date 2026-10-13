# Context-briefing voor research-agent — DjinLabs/Webrnds/Jev patronen

**Datum:** 2026-09-23
**Auteur:** Hermes (Nous) op verzoek van founder Darren Schreuder
**Doel:** Andere agent in staat stellen om research te doen naar patronen in dit project, zonder context te missen

---

## 1. Project-overzicht

**DjinLabs** is de umbrella-organisatie (template-onderhoud, R&D, leer-artefacten). **Webrnds** is een venture onder die umbrella (klantreis-platform). **COS** (Chief of Staff) is een folder-agent die COS-architectuur ontwerpt maar nog niet in productie is.

```
DjinLabs (umbrella)
├── Webrnds (venture, klantreis)
├── Djin-agents (universeel, scaffold-only)
├── _shared/ (canonieke bronnen, alle ventures includen deze)
├── djinlabs/_internal/experimenten/ (R&D + experimenten-zone)
├── research/ (audits, blueprints, patronen — kanoniek-neutraal)
└── decisions.md (Ronde-traject-log, canoniek)
```

**Stack:** statisch (markdown-only, geen `package.json` etc. gecommit).

**Boundary-discipline (Ronde 14, canoniek):**
- Djin schrijft niet in Webrnds-folder
- Webrnds schrijft niet in Djin-folder
- Cross-boundary handovers via `/_shared/handovers/` met menselijke act en expliciete frontmatter

---

## 2. Wat de agent EERST moet lezen (canonieke bronnen)

Deze files zijn **LOCKED** en mogen niet zonder Ronde-traject gewijzigd worden:

| File | Wat | Ronde |
|---|---|---|
| `AGENTS.md` (umbrella router) | Brief routing voor coding agents | vast |
| `CONTEXT.md` | Glossary (4K) | vast |
| `_shared/jev-policy-canon.md` | Jev = policy-oracle, V1.5 | Ronde 17 |
| `_shared/state-formats-canon.md` | Markdown = kennis, JSON = state | Ronde 15 |
| `_shared/sync-discipline-canon.md` | Bij elke Ronde: alle gerelateerde files syncen | Ronde 16 |
| `_shared/agent-discipline-canon.md` | agent = folder + ICM (basis) | vast |
| `_shared/icm-canon.md` | ICM-discipline (run artifacts, umbrella) | vast |
| `_shared/naming-conventions.md` | Bestandsnaam-conventies | vast |
| `_shared/retention-policy-canon.md` | Bewaartermijnen | vast |
| `_shared/hard-rules.md` | Hard rules (sync, boundary) | vast |
| `_shared/AGENTS.md` (sub-router) | Brief routing voor _shared | vast |
| `decisions.md` | Ronde-traject-log (481 regels) | Ronde 14-18 |

**Belangrijk:** De agent moet `decisions.md` lezen om de huidige staat van canonieke beslissingen te begrijpen. Ronde 18 is de laatste LOCKED entry (Blombies → blobbies spelling-fix).

---

## 3. Wat de agent moet lezen voor project-context

| File | Wat |
|---|---|
| `djinlabs/AGENTS.md` | Sub-router voor Djin-werk |
| `djinlabs/start.md` | Djin state |
| `djinlabs/state.md` | Djin run-state |
| `webrnds/AGENTS.md` | Sub-router voor Webrnds-werk |
| `webrnds/start.md` | Webrnds state |
| `webrnds/state.md` | Webrnds run-state |
| `webrnds/01-research/2026-09-21-icm-origins-research-note.md` | ICM origins (82 regels) |
| `djinlabs/_internal/experimenten/CONTEXT.md` | Experimenten-context |
| `djinlabs/_internal/experimenten/cos/CONTEXT.md` | COS context |

---

## 4. Research-files (alle kanoniek-neutraal, behalve sommige `reviewed`)

### 4.1 Webrnds-specifiek
- `research/codavo-competitive-brief.md` — concurrent-onderzoek (10K + delta)
- `research/webrnds-profile.md` — Webrnds profiel (279 regels)

### 4.2 Jev-specifiek (agent framework research)
- `research/0xcodila-jev-engineering-playbook-audit.md` (30K, 544 regels)
- `research/0xcodila-jev-engineering-roadmap-audit.md` (26K, 490 regels)
- `research/ai-jason-jev-treg-automation-audit.md` (24K, 480 regels)
- `research/sam-witteveen-jev-router-audit.md` (23K, 482 regels)
- `research/everestchris6-jev-native-agency-architecture.md` (30K, 589 regels)
- `research/matt-typesafe-coding-agent-audit.md` (23K, 434 regels)

### 4.3 Jev live-test
- `research/jev-live-test-rapport.md` (11K, 302 regels)
- `research/jev-icm-file-classification-test.md` (14K, 329 regels)
- `research/rondasync-shadow-mode-r17.md` (12K, 245 regels)
- `research/jev-revenue-streams.md` — Jev monetisatie (muse, niet auditton)

### 4.4 Integratie / blueprints
- `research/djinlabs-blobbies-fit-research.md` — DjinLabs + blobbies (Tauri app)
- `research/jev-treg-blobbies-icm-integration-blueprint.md` (31K, 560 regels)
- `research/djinlabs-vs-5-layers-audit.md` — architecture pattern
- `research/local-ai-agency-workflow.md` — agency workflow

### 4.5 Custom skills / proposals
- `research/matt-pocock-custom-skills-proposal.md` — Matt's skill-aanpak
- `research/hard-rules-inventory.md` — hard-rules candidated draft

### 4.6 Ronde-trajecten
- `research/r18-f0-design-doc-drift-inventarisatie.md` — Ronde 18 input
- `research/r18-design-doc-drift-check.mjs` — Ronde 18 check-script

### 4.7 Nieuw (2026-09-23)
- `research/vercel-eve-cos-runtime-research.md` — Vercel Eve research (16K)
- `research/sharbel-hermy-hq-cos-adapter-research.md` — Sharbel's Hermy HQ research (12K, pauzeren)
- `research/sharbel-skills-audit-2026-09-23.md` — Sharbel's skills audit (7K)

---

## 5. Experimenten-zone (canoniek-neutraal, in `djinlabs/_internal/experimenten/`)

| File | Wat |
|---|---|
| `cos/CONTEXT.md` | COS product-context |
| `cos/architecture-design.md` | COS architecture (eerste versie, wordt geüpdatet) |
| `cos/wayfinder-map.md` | Frontier-tickets + Not-yet-specified + Out-of-scope |
| `cos/multi-runtime-architecture-brainstorm.md` | Multi-runtime brainstorm (12K) |
| `cos/multi-runtime-cos-design.md` | Multi-runtime design-doc (19K) |
| `cos/research/2026-09-22-agent-is-folder-icm-notion.md` | Agent = folder = ICM notie (199 regels) |
| `cos/sharbel-hermy-hq-adapter-design.ARCHIVED-2026-09-23.md` | Gearchiveerd Sharbel-design |
| `cos/tickets/T-01-cos-definitie.md` | Gesloten 2026-09-21 |
| `cos/tickets/T-02-cos-baas.md` | Gesloten 2026-09-23 |
| `cos/tickets/T-03-cos-routes.md` | **In-progress** (R1 wacht op antwoord) |
| `cos/tickets/T-03-routes-vraag.txt` | T-03 R1 vraag-bestand (5.3K) |
| `cos/tickets/T-02-baas-vraag.txt` | T-02 R2 vraag-bestand (al gebruikt) |
| `rondasync/CONTEXT.md` | Rondasync product-context |
| `rondasync/design.md` | Rondasync design |
| `rondasync/rondasync.py` | Rondasync runtime (13K) |

---

## 6. Open frontier (wayfinder-map)

| Ticket | Status | Onderwerp |
|---|---|---|
| T-01 | ✅ closed 2026-09-21 | Wat is COS in één zin? |
| T-02 | ✅ closed 2026-09-23 | Wie is COS' baas? (visibility-lagen) |
| **T-03** | **⏳ in-progress** | **Welke routes kent COS bij eerste launch?** |
| T-04 | open | Hoe valideer je COS zonder canon? |
| T-05 | open | COS' state-model (canon vs runtime) |
| T-06 | open (research) | Welke Jev-calls doet COS? |
| T-07 | open | Failure-mode bij Jev-down |
| T-08 | open | COS + parallelle sessies |
| T-09 | open | Eerste live use-case |
| T-10 | open | Wat doet COS NIET bij eerste launch? |

---

## 7. Architectuur-beslissingen (LOCKED of canoniek-neutraal)

### 7.1 Vercel Eve als COS-runtime (canoniek-neutraal, Ronde 19+ pending)

**Conclusie:** Vercel Eve (`https://vercel.com/eve`, Apache 2.0, 5326★) is de te volgen runtime voor COS omdat:
- "Agent = directory" = EXACT onze agent=folder=ICM notie
- Open source, Vercel-ondersteuning, native subagents/skills/channels
- Geen adapter nodig (Sharbel's Hermy HQ had die wel nodig)

**Sharbel's Hermy HQ pauzeren:** LICENSE NONE, bus factor 1, te veel nadelen vs Eve.

### 7.2 DjinLabs HQ (fork van Hermy HQ) als lokaal mission-control (kanoniek-neutraal)

**Beslissing:** DjinLabs HQ = fork van `sharbelxyz/hermes-agent-mission-control` met eigen license. **Werkt als lokaal mission-control dashboard**, niet als COS-runtime.

**Geverifieerd 2026-09-23:** Werkt lokaal met dev-mode auth. Bridge-pattern werkt, maar Hermes CLI delegate_task-context blokkeert kanban-mutaties vanuit Hermes-sessies. Bridge moet vanuit aparte Terminal draaien.

### 7.3 Agent = folder = ICM (canoniek-neutraal, Ronde 19+ pending)

**Onderzoek:** `cos/research/2026-09-22-agent-is-folder-icm-notion.md`

**Kern-claim:** Een agent wordt gedefinieerd door de instructies in zijn folder. Sterker dan "agents zijn folder-state". Vercel Eve valideert deze notie extern ("agent is a directory").

### 7.4 Ronde-trajecten (LOCKED Ronde 14-18, Ronde 19+ open)

**Ronde 14:** Boundary-discipline (Djin ≠ Webrnds, geen cross-boundary writes)
**Ronde 15:** Markdown = kennis, JSON = state
**Ronde 16:** Sync-discipline (bij elke Ronde syncen)
**Ronde 17:** Jev-policy V1.5 (canoniek)
**Ronde 18:** Spelling-fix Blombies → blobbies (143 occurrences in 21 files)

---

## 8. Patronen waar research zinvol is

### 8.1 Multi-agent team patterns (Sharbel's "Bot Mode")

Sharbel's YouTube-tutorial en blog beschrijven drie manieren waarop agents praten:
- **One-on-one** — permanent chat met één bot
- **Direct** — bot naar bot zonder user in het midden
- **Group room** — meerdere bots in één thread, met **turn cap** (anders infinite loops)

**Toepasbaar op:** COS' multi-runtime architectuur (Vercel Eve subagents + Hermes profiles + DjinLabs HQ panels).

### 8.2 Skill-discoverability patronen (Bouncer-flow)

We hebben een audit-flow opgezet voor skills installatie:
1. **Bron lezen** (README + SKILL.md + scripts)
2. **Bouncer-audit** (footprint, overlap, injection, cost, staff test)
3. **Installeren met pin** (gepinde versie, geen `main.zip`)

**Onderzoeksvragen:**
- Welke patronen voor skill-discoverability bestaan er nog?
- Hoe detecteer je prompt-injection in skills systematisch?
- Welke license-classificatie is canoniek-conform?

### 8.3 Bridge-pattern (Hermy HQ → Hermes CLI)

Sharbel's `hermes-bridge/bridge.mjs` gebruikt:
- **Pull:** Hermes CLI execFile + DB mirror (kanban/cron/health)
- **Push:** DB rows (`queued` / `approved`) → Hermes CLI execFile
- **Approval-gated:** `awaiting_approval` wordt nooit gerund zonder menselijke act

**Onderzoeksvragen:**
- Hoe integreert Vercel Eve dit native (Connections/Sandbox) versus hoe Sharbel het doet?
- Wat is de canoniek-discipline voor bridge-pattern in onze COS-architectuur?

### 8.4 Sync-discipline patronen (Ronde 16)

Bij elke Ronde moeten alle gerelateerde files gesynced zijn:
- `decisions.md` (Ronde-entry)
- frontier-lijst (wayfinder-map T-XX)
- AGENTS.md-routers (umbrella + sub-routers)
- `CONTEXT.md` glossary
- design-doc

**Onderzoeksvragen:**
- Welke tooling kan sync-discipline afdwingen (lint, pre-commit, CI)?
- Welke patronen passen bij onze agent = folder = ICM notie?

### 8.5 Webrnds business-patronen

- **3 services Jev agency** (relevant voor Webrnds-pakket):
  1. Unpaid invoice chasing
  2. Dispute packets
  3. Bill overcharge detection
- Cost: ~7 cent per actie
- **Webrnds = venture concurrent van Codavo** (Rotterdam, AI-agency)
- Doel: "doe exsact hetzelfde als Codavo" maar dan geautomatiseerd via agents

**Onderzoeksvragen:**
- Welke agency-patronen zijn agent-ready?
- Welke pricing-modellen zijn canoniek-conform (placeholder in bron, canoniek onbekend)?

---

## 9. Hard rules voor de agent

**Boundary-discipline:**
- Lees alle canonieke files, schrijf er niet in
- Schrijven aan canonieke files ALLEEN via Ronde-traject in `decisions.md`
- Sync-discipline: bij elke wijziging syncen (decisions.md + frontier-lijst + AGENTS.md-routers + CONTEXT.md + design-doc)

**Markdown-conventie:**
- Geen executable code schrijven (tenzij expliciet onderzoeksdoel)
- Geen file-writes aan canon-files zonder Ronde-vermelding
- Geen verbinding met `~/.blobbies/` of Tauri-runtime (boundary)
- Geen AI-clichés ("leverage", "synergy", "transform")
- Geen specifieke API-keys — secrets per run, niet canon

**Template-discipline:**
- Bij template-aanmaak: Handoff-sectie verplicht (agent moet er morgen meteen wat aan hebben)

---

## 10. Test-env discipline

| Variable | Locatie |
|---|---|
| `NOTION_API_KEY` (Notion PAT) | `~/.hermes/profile/.env` of `.env-test/notion-test.env` (mode 0600) |
| `JEV_API_KEY` (TypeSafe) | `.env-test/jev-test.env` (mode 0600) |

**Nooit in canonieke files.** Secrets per run, niet canon.

---

## 11. Concrete research-vragen die open staan

1. **Sharbel's skills (x-bookmarks, nova-youtube-agent, sage-x-agent):**
   - LICENSE NONE → fork-discipline of Vercel Eve skills-systeem alternatief?
   - Welke zijn relevant voor Webrnds brand voice?

2. **Vercel Eve skills discovery:**
   - Welke skills zijn er in Vercel Eve's catalog?
   - Hoe verhoudt zich dat tot Hermes skills?

3. **Multi-runtime bridge-patroon:**
   - Hoe mirrort COS state naar DjinLabs HQ (niet Hermes)?
   - Wat is de canoniek-discipline voor bridge-pattern in onze COS-architectuur?

4. **Jev-integratie in Vercel Eve:**
   - Hoe schrijf je Jev-call als custom Eve-tool?
   - Hoe respecteer je Ronde 17 V1.5 confidence-band defaults?

5. **Webrnds brand voice + KVK + propositie:**
   - Grill-me-docs sessie plannen?
   - Welke templates zijn agent-ready?

6. **Ronde 19+ canoniek-traject:**
   - Vercel Eve als COS-runtime canoniseren?
   - Jev-integratie-traject?
   - Multi-runtime-adapter?

---

## 12. Wat de agent NIET moet doen

- Canonieke files aanraken zonder Ronde-vermelding in `decisions.md`
- Sharbel's code forken zonder fork-discipline-traject (LICENSE NONE)
- Hermes-CLI bridge bouwen zonder delegate_task-context-vrij pad
- Brand voice / KVK / propositie Webrnds vastleggen (apart grill-me-docs traject)
- Skills installeren zonder Bouncer-audit
- Andere agent's scope aanraken (boundary)

---

## 13. Bron-traceerbaarheid

Alle files hierboven genoemd bestaan op:
`/Users/gogetta/Documents/djinlabs_system_design/`

Git status: tracked in git (Ronde 14-18 zijn gecommit). Working tree kan niet-gecommitte wijzigingen hebben van T-02 sidenote en Sharbel-onderzoek.

---

## 14. Concrete instructies voor de agent

**Lees in deze volgorde:**

1. `AGENTS.md` (umbrella) — 5 min
2. `CONTEXT.md` (umbrella glossary) — 5 min
3. `_shared/jev-policy-canon.md` (Ronde 17 V1.5) — 15 min
4. `_shared/sync-discipline-canon.md` (Ronde 16) — 10 min
5. `_shared/state-formats-canon.md` (Ronde 15) — 5 min
6. `_shared/agent-discipline-canon.md` — 5 min
7. `_shared/icm-canon.md` — 10 min
8. `decisions.md` (volledig, 481 regels) — 30 min
9. `djinlabs/AGENTS.md` + `webrnds/AGENTS.md` — 5 min
10. `djinlabs/_internal/experimenten/cos/wayfinder-map.md` — 15 min
11. `djinlabs/_internal/experimenten/cos/multi-runtime-cos-design.md` (19K) — 30 min
12. `research/` files relevant voor je onderzoeksvraag — variable
13. `djinlabs/_internal/experimenten/cos/CONTEXT.md` — 5 min

**Totale reading-time:** ~2-3 uur voor volledige context.

**Daarna:** richt je op de specifieke research-vraag uit sectie 11 hierboven.

---

## 15. Contact-info

**Founder:** Darren Schreuder (Darren@..., schreuderdarren@gmail.com in Notion)
**Notion workspace:** "Darren Schreuder's Notion" (id `2894c5f9-f8e5-8186-9759-0003a13154bd`)
**Webrnds parent:** `3e34c5f9-f8e5-8002-a5e2-d7daa4d19b63`

---

**Einde van context-briefing.** Als je specifieke research-vragen hebt, kan de agent sectie 11 als startpunt gebruiken. Voor algemene patronen-onderzoek: sectie 8 + 9.

Sync-discipline: deze briefing is canoniek-neutraal (research-note). Niet gecommit, niet in canonieke files.
