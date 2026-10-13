---
title: Sharbel's Hermy HQ + Hermes Bot Mode als COS runtime — design-doc (adapter)
date: 2026-09-23
status: draft
type: design-doc
scope: cos-architectuur + sharbel-stack
provenance: vervolg op research-note `research/sharbel-hermy-hq-cos-adapter-research.md`
researcher: Hermes (Nous) op verzoek van founder
review_status: unreviewed
related:
  - ../CONTEXT.md
  - ../wayfinder-map.md
  - ../architecture-design.md
  - ../research/2026-09-22-agent-is-folder-icm-notion.md
  - ../tickets/T-01-cos-definitie.md
  - ../tickets/T-02-cos-baas.md
  - ../../../research/sharbel-hermy-hq-cos-adapter-research.md
  - ../../../_shared/jev-policy-canon.md (Ronde 17 V1.5)
  - ../../../_shared/agent-discipline-canon.md
  - ../../../_shared/sync-discipline-canon.md
sources:
  - Sharbel's ONBOARDING.md (geverifieerd)
  - Sharbel's bridge.mjs (geverifieerd)
  - Hermes CLI v0.20.5 subcommands (geverifieerd via hermes --help)
---

# Sharbel's Hermy HQ + Hermes Bot Mode als COS runtime — design-doc

## Doel

Ontwerp een **agent=folder adapter** die:

1. **Sharbel's runtime-infrastructuur** (Hermy HQ dashboard + Hermes Bot Mode + Postgres message bus) gebruikt als COS runtime-substraat
2. **Sharbel's sales-bot-filosofie** toepast (tight tools, approval-gated, soul file, group rooms met turn cap)
3. **Onze canonieke disciplines** respecteert (agent = folder = ICM, Jev policy-oracle, Ronde-traject via `decisions.md`)
4. **Hermes' ingebouwde features** (profiles, kanban, approvals, peer DMs) gebruikt in plaats van Sharbel's eigen implementatie

**Niet** het doel:

- Sharbel's sales-bot **kopiëren** (geen code van Sharbel overnemen)
- Sharbel's productspecifieke config **gebruiken** (geen soul file van Sharbel)
- Canonieke files aanraken (alleen experimenten-zone)
- Jev-policy-canon.md wijzigen (Ronde 17 V1.5 locked)

## Architectuur-overzicht

```
┌─────────────────────────────────────────────────────────────┐
│                     Webrnds / Djin / blobbies                │
│                  (ventures die COS aanstuurt)                │
└───────────────────────────┬─────────────────────────────────┘
                            │ folder-input
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  COS (orchestrator-folder)                   │
│              djinlabs/_internal/experimenten/cos/            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  CONTEXT.md (definitie)                             │    │
│  │  wayfinder-map.md (frontier)                        │    │
│  │  architecture-design.md (orchestratie)              │    │
│  │  tickets/ (grill-me-spoor)                          │    │
│  │  research/ (agent=folder notie)                     │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │ adapter (deze design-doc)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Hermes Profile: "cos" (runtime-uiting)          │
│  - Model: afhankelijk van taak (cheap worker / strong coor) │
│  - Tools: hermes kanban, hermes peer, hermes approvals      │
│  - Soul file: gegenereerd vanuit cos/CONTEXT.md             │
│  - Memory: ~/.hermes/wiki/cos/ (synced vanuit cos-folder)   │
│  - Peer DMs: naar Djin, blobbies, Webrnds profiles          │
└───────────────────────────┬─────────────────────────────────┘
                            │ Bot Mode + Kanban + Postgres
                            ↓
┌─────────────────────────────────────────────────────────────┐
│           Hermes Bot Mode (cross-profile orchestrator)       │
│  - Group rooms: COS + Djin + blobbies + Webrnds             │
│  - Turn cap: 5 (Sharbel's lesson: anders infinite loop)     │
│  - Approval inbox: side-effecting acts gated                │
│  - Kanban: taken vanuit ventures, dispatched naar agents     │
└───────────────────────────┬─────────────────────────────────┘
                            │ Postgres message bus (optioneel)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│            Hermy HQ dashboard (Sharbel's Next.js)            │
│  - Mission control view (UI voor COS-folder-state)          │
│  - Approval inbox UI (menselijke gate)                      │
│  - Chief-of-Staff brief (auto-generated)                    │
│  - Cron + health mirror                                     │
│  - ⚠️ License: NONE (zie open vraag)                        │
└─────────────────────────────────────────────────────────────┘
```

## De adapter (kern van deze design-doc)

### Adapter-component 1: Folder → Profile synchronisatie

**Probleem:** Sharbel's Hermes profiles zijn **runtime-entiteiten** met configuratie (model, tools, memory-path). Onze notie zegt **agent = folder = ICM**. De adapter moet de folder-inhoud vertalen naar profile-configuratie.

**Oplossing:**

1. **COS-folder wordt single source of truth** voor COS' runtime-state
2. **Adapter leest periodiek** `cos/CONTEXT.md`, `cos/wayfinder-map.md`, `cos/architecture-design.md`, `cos/tickets/`, `cos/research/`
3. **Adapter genereert Hermes profile config** (yaml of TOML):
   ```yaml
   name: cos
   description: "Chief of Staff — leest inbox + dispatcht naar agents"
   model: claude-opus-4-1  # of goedkoper afhankelijk van taak
   tools:
     - hermes.kanban
     - hermes.peer
     - hermes.approvals
     - hermes.cron
   memory:
     path: ~/.hermes/wiki/cos
   peer_dms:
     - djin
     - blobbies
     - webrnds
   group_rooms:
     - name: dispatch-room
       members: [cos, djin, blobbies, webrnds]
       turn_cap: 5
   ```
4. **Adapter schrijft naar** `~/.hermes/profiles/cos/config.yaml`
5. **Hermes herlaadt profile** bij volgende sessie (of hot-reload)

**Sync-discipline:**
- Adapter draait **alleen** bij expliciete sync-trigger (geen hot-reload tijdens sessie)
- Sync-trigger: `decisions.md` Ronde-sluiting, of handmatig `cos sync`
- Geen automatische file-write naar Hermes profiles tijdens Hermes-sessie (boundary-discipline)

### Adapter-component 2: Jev-integratie als policy-oracle

**Probleem:** Sharbel's Hermes kent Jev niet. Onze `_shared/jev-policy-canon.md` Ronde 17 V1.5 zegt Jev = policy-oracle met verdict-autoriteit op elke dispatch.

**Oplossing:**

1. **Jev-call als Hermes skill** (`~/.hermes/skills/jev-oracle/`)
2. **Adapter injecteert Jev-call** in COS profile's tool-list
3. **Voor elke dispatch** naar Djin/blobbies/Webrnds: COS roept Jev aan met:
   - Intent (wat moet gebeuren)
   - Source (waar komt het verzoek vandaan)
   - Confidence (hoe zeker is COS dat dit klopt)
4. **Jev verdict** = `allow` / `reject` / `ask_human` / `research_capped`
5. **Bij `ask_human`** → COS plaatst in approval inbox (Hermes heeft dit al)
6. **Bij `allow`** → COS dispatcht naar peer (Djin/blobbies/Webrnds)
7. **Bij `reject`** → COS logt + escaleert niet (of naar founder)
8. **Bij `research_capped`** → COS doet extra research met cap=5 bronnen

**Sync-discipline:**
- Jev-blokkades worden **nooit** genegeerd door COS
- Bij Jev-API-failure: COS escaleert naar founder via Telegram (out-of-band)
- Jev-call-resultaten worden gelogd in `cos/audit/jev-decisions.jsonl` (kanoniek-neutraal)

### Adapter-component 3: Sharbel's sales-bot-filosofie → COS

| Sharbel's sales-bot | COS equivalent | Hoe |
|---|---|---|
| Soul file (persoonlijkheid + regels) | COS soul file uit `cos/CONTEXT.md` + `architecture-design.md` | Adapter genereert soul file vanuit folder-inhoud |
| Tight tools (alleen sales) | Tight tools: hermes.kanban, hermes.peer, hermes.approvals, hermes.cron, jev-oracle | Geen file-write tools, geen shell-access, geen betalingen |
| Approval-gated actions | Hermes approval inbox | Elke dispatch met side-effects via approval inbox |
| Group rooms met turn cap | dispatch-room met turn_cap=5 | Hermes Bot Mode native feature |
| Coordinator (sterk model) | COS = claude-opus-4-1 (sterk model) | Bij dispatch-taken |
| Workers (goedkope modellen) | Djin, blobbies, Webrnds profiles | Hermes profile met cheap model voor specifieke taken |
| "Hand result back to main Hermes" | COS dispatcht → worker doet werk → result terug naar COS → COS rapport aan founder | Hermes peer DM terug-flow |

**Niet kopiëren:**
- Sharbel's sales-bot **specifieke** regels (prijzen, sales-script) — niet relevant voor COS
- Sharbel's specifieke tools (calendar, email) — COS doet **andere** dingen (dispatch, audit, Ronde-traject)
- Sharbel's merk-stem — COS heeft eigen stem (kanoniek-neutraal)

### Adapter-component 4: Ronde-traject-integratie

**Probleem:** Sharbel's stack heeft geen Ronde-traject. Onze canonieke discipline zegt: canonieke files worden alleen gewijzigd via `decisions.md`-entry met founder-commit.

**Oplossing:**

1. **COS detecteert** canoniek-relevante wijzigingen (agent = folder notie zegt dit expliciet)
2. **Voor elke wijziging** aan canonieke files:
   - COS maakt **Ronde-traject-entry** in `decisions.md` (kanoniek!)
   - COS plaatst **approval request** in inbox voor founder
   - Bij approval: COS schrijft wijziging + log in `cos/audit/rondes.jsonl`
3. **Geen directe file-write** aan canonieke files door COS zonder Ronde-traject
4. **Audit-spoor** in `cos/audit/` is canoniek-neutraal (kanonieke-discipline volgt state-formats-canon)

**Sync-discipline:**
- Ronde-traject is **asynchroon** (geen hot-reload tijdens sessie)
- Founder-commit gebeurt **apart** (via Telegram of nieuwe Hermes-sessie)
- Audit-spoor is **leesmateriaal**, geen actie-trigger

## Concrete implementatie-stappen

### Fase 0: Voorbereiding (deze design-doc)

- [x] Research-note geschreven
- [x] Design-doc geschreven
- [ ] License-review voor Hermy HQ (open vraag voor founder)
- [ ] Founder-commit voor scope (canoniek-traject via Ronde 19+)

### Fase 1: Lokale Hermes-uitbreiding (kanoniek-neutraal)

- [ ] Hermes profile `cos` aanmaken met bovenstaande config
- [ ] Adapter-component 1 (folder → profile) bouwen als Hermes skill
- [ ] Test: COS profile kan folder lezen + soul file tonen

### Fase 2: Jev-integratie (kanoniek-neutraal, voorbereidend op Ronde 20+)

- [ ] Hermes skill `jev-oracle` aanmaken (gebruikt bestaande `jev-test.env`)
- [ ] Adapter-component 2 bouwen (Jev-call in COS tool-flow)
- [ ] Test: COS dispatcht via Jev-call + krijgt verdict

### Fase 3: Multi-agent Bot Mode (kanoniek-neutraal)

- [ ] Hermes profiles voor Djin, blobbies, Webrnds aanmaken
- [ ] Group room `dispatch-room` configureren met turn_cap=5
- [ ] Adapter-component 3 bouwen (sales-bot-filosofie)
- [ ] Test: COS dispatcht → Djin doet werk → result terug

### Fase 4: Mission control (kanoniek-neutraal, license-afhankelijk)

- [ ] **License-beslissing** (founder-commit nodig)
- [ ] Bij JA: Hermy HQ lokaal installeren + bridge naar Hermes Postgres
- [ ] Bij NEE: eigen dashboard bouwen (canoniek-neutraal)

### Fase 5: Ronde-traject-integratie (canoniek!)

- [ ] Adapter-component 4 bouwen (Ronde-traject-flow)
- [ ] Canonieke-traject (Ronde 19+): COS' audit-flow + Ronde-traject in `_shared/cos-architecture-canon.md`
- [ ] Founder-commit voor canoniek-promotie

### Fase 6: Productie (canoniek, lange termijn)

- [ ] COS v1.0 in productie voor Webrnds
- [ ] Eerste echte klantreis via COS
- [ ] Ronde-trajecten voor COS-verbeteringen

## Wat NIET in deze design-doc zit (out-of-scope)

- **Hermy HQ installatie zonder license-review** — wacht op founder-beslissing
- **Sharbel's sales-bot code** kopiëren — niet het doel
- **Sharbel's andere skills** (x-bookmarks, nova-youtube-agent, sage-x-agent) — apart traject na license-review
- **Canonieke files aanraken** — alleen experimenten-zone
- **Jev-policy-canon.md wijzigen** — Ronde 17 V1.5 locked
- **Andere agenten (Djin, blobbies, Webrnds) profile-code** — apart traject na COS v0.1

## Open vragen voor founder (kanoniek-discipline)

1. **License Hermy HQ** — gebruiken we een NONE-license repo? Eigen fork? Contact Sharbel voor MIT?
2. **Sharbel's skills** — installeren we x-bookmarks / nova-youtube-agent / sage-x-agent? (license + audit-flow)
3. **Jev-traject** — Ronde 19+ voor COS-architectuur-canon, of blijft Jev alleen in `_shared/jev-policy-canon.md`?
4. **Sharbel-dependency** — zijn we bereid om canoniek afhankelijk te zijn van Sharbel's onderhoud van Hermy HQ?
5. **Scope v0.1** — alleen COS-orchestratie, of meteen hele Webrnds-klantreis via COS?
6. **Vercel deploy** — eerste release lokaal, of meteen productie-deploy?

## Bron-traceerbaarheid

- **Sharbel's ONBOARDING.md** — geverifieerd via raw GitHub
- **Sharbel's bridge.mjs** — geverifieerd via raw GitHub
- **Hermes CLI subcommands** — geverifieerd via `hermes <cmd> --help`
- **Research-note** — `research/sharbel-hermy-hq-cos-adapter-research.md`
- **Canonieke files** — `_shared/jev-policy-canon.md` (Ronde 17 V1.5), `_shared/agent-discipline-canon.md`, `_shared/sync-discipline-canon.md`
- **T-01 + T-02 tickets** — gesloten 2026-09-21 + 2026-09-23

## Review-checklist (kanoniek-neutraal)

- [x] Bron-traceerbaar (alle URLs + commando's verifieerbaar)
- [x] License-discipline gemarkeerd (Hermy HQ NONE)
- [x] Sync-discipline gerespecteerd (geen canonieke files aangeraakt)
- [x] Out-of-scope expliciet
- [x] Aanbeveling met gefaseerde stappen
- [x] Open vragen voor founder (license, scope, Jev, Sharbel-dependency, deploy)
- [x] Cross-references naar canonieke files (Ronde 17 V1.5, T-01, T-02)
- [x] Agent = folder notie verwerkt (adapter vult kloof)
- [x] Sharbel-filosofie vs Sharbel-code onderscheiden
