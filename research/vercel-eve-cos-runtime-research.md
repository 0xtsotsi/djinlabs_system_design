---
title: Vercel Eve — agent=directory framework voor COS-runtime
date: 2026-09-23
status: pending
type: research-note
scope: eve-framework + cos-architectuur
provenance: founder-tip tijdens Sharbel-traject ("vercel.com/eve")
researcher: Hermes (Nous) op verzoek van founder
review_status: unreviewed
category: client-patroon-research
r19_motie: "6 — Eve + Convex wordt optioneel client-setup-patroon (Webrnds), los van DjinLabs-canon"
djinlabs_status: "out-of-canon — optioneel klant-setup-patroon"
supersedes: sharbel-hermy-hq-cos-adapter-research.md (gedeeltelijk — Sharbel-trail wordt niet actief opgepakt)
related:
  - ../djinlabs/_internal/experimenten/cos/CONTEXT.md
  - ../djinlabs/_internal/experimenten/cos/wayfinder-map.md
  - ../djinlabs/_internal/experimenten/cos/architecture-design.md
  - ../djinlabs/_internal/experimenten/cos/research/2026-09-22-agent-is-folder-icm-notion.md
  - ../djinlabs/_internal/experimenten/cos/sharbel-hermy-hq-adapter-design.md (wordt geüpdatet)
  - ../djinlabs/_internal/experimenten/cos/tickets/T-01-cos-definitie.md
  - ../djinlabs/_internal/experimenten/cos/tickets/T-02-cos-baas.md
  - ../../../_shared/jev-policy-canon.md (Ronde 17 V1.5)
sources:
  - https://vercel.com/eve (gelezen 2026-09-23)
  - https://vercel.com/docs/eve (gelezen 2026-09-23)
  - https://vercel.com/docs/eve/concepts (gelezen 2026-09-23)
  - https://github.com/vercel/eve (gelezen 2026-09-23)
  - https://github.com/vercel/eve/blob/main/docs/reference/project-layout.md (gelezen 2026-09-23)
---

# Vercel Eve — agent=directory framework voor COS-runtime

## TL;DR

**Vercel Eve's kern-abstractie is EXACT onze canonieke notie "agent = folder = ICM"**. Dat is geen toeval — het is een breed-gedeelde insight die Vercel in productie heeft gebracht.

**Gevolg voor COS:** Vercel Eve vervangt Sharbel's Hermy HQ als runtime-substraat. Geen adapter meer nodig. Sharbel's Hermy HQ-traject wordt **niet actief opgepakt** — te veel nadelen (NONE license, bus factor, geen Jev-integratie) versus Vercel Eve's voordelen (Vercel-ondersteuning, open source, native folder-notie, native subagents).

## Wat is Vercel Eve?

Vercel omschrijft Eve als: **"Like Next.js for web apps, but for agents."**

| Aspect | Vercel Eve |
|---|---|
| **Core notie** | "**An agent is a directory**" |
| **Authoring** | Markdown voor instructions/skills, TypeScript voor tools |
| **Runtime** | Node.js lokaal, Vercel Functions in productie |
| **Durability** | Vercel Workflows (state persistence, resume na cold start/crash) |
| **Subagents** | Eerste-klas — `agent/subagents/<name>/` is eigen agent met eigen folder, eigen skills, eigen tools, eigen sandbox |
| **Skills** | Eerste-kas — `agent/skills/<name>/SKILL.md` net als Hermes |
| **Channels** | Slack, Discord, Teams, HTTP, web — allemaal via `channels/` folder |
| **Connections** | GitHub, Stripe, Linear via `connections/` folder + Vercel Connect (geen token-management) |
| **Sandbox** | Geïsoleerde VM per agent, file system + bash |
| **Schedules** | Cron-style `schedules/` folder |
| **License** | Open source (`vercel/eve` op GitHub) |
| **Model** | AI Gateway — `openai/gpt-5.4-mini`, `spacexai/grok-4.5`, etc., geen API-key management via OIDC |
| **Observability** | Vercel dashboard + OpenTelemetry support |

## Authoring-conventie

Een minimale Eve-agent is **twee files**:

```
my-agent/
├── package.json
├── tsconfig.json
└── agent/
    ├── agent.ts             # Model + runtime config
    └── instructions.md      # System prompt (required)
```

Een complete agent heeft deze structuur:

```
agent/
├── agent.ts                # Runtime config (model, options)
├── instructions.md         # Always-on system prompt
├── instrumentation.ts      # Optional OpenTelemetry
├── channels/               # Message entry points (HTTP, Slack, etc.)
├── connections/            # External service integrations
├── hooks/                  # Lifecycle + stream-event subscribers
├── skills/                 # On-demand procedures (Markdown playbooks)
├── lib/                    # Shared authored helper code (import-only)
├── sandbox/                # Isolated compute environment
│   └── sandbox.ts          # Backend keuze + setup
├── tools/                  # Typed executable integrations (one file per tool)
├── schedules/              # Recurring cron jobs (.ts of .md)
└── subagents/              # Specialist child agents (each = own folder)
    └── <name>/
        ├── agent.ts
        ├── instructions.md
        ├── tools/
        ├── skills/
        └── sandbox/
```

**Identity via path:** de filenaam wordt de tool/skill/subagent-naam. Geen centrale registratie nodig — de folder-structuur IS de registratie.

## Waarom dit onze notie exact matcht

Onze research-note (2026-09-22) zegt:

> **Agent wordt gedefinieerd door folder-inhoud.** Sterker dan "agents zijn folder-state" — agent IS de folder.

Vercel Eve zegt letterlijk:

> "An agent is a directory. Define instructions and skills in markdown, tools in TypeScript, and deploy."

**Identieke abstractie.** Dat is geen toeval — het is een breed-gedeelde insight ("LLM Wiki", Karpathy's pattern, Hermes' agent=folder-discipline, en nu Vercel Eve allemaal convergeren op dezelfde notie).

Het verschil: Vercel Eve heeft het **in productie** gebracht, met volledige Vercel-ondersteuning (Functions, Workflows, Sandbox, Connect, Observability).

## Architectuur: COS als Eve-agent

```
┌──────────────────────────────────────────────────────────────┐
│              Webrnds / Djin / blobbies                       │
│              (ventures met eigen eve-subagents)               │
└──────────────────────────┬───────────────────────────────────┘
                           │ Subagent delegation
                           ↓
┌──────────────────────────────────────────────────────────────┐
│              COS (root eve-agent)                             │
│   agent/                                                     │
│   ├── instructions.md   (= cos/CONTEXT.md vertaald)          │
│   ├── agent.ts         (= Hermes profile config)             │
│   ├── tools/                                                │
│   │   ├── jev_oracle.ts (= Jev policy-call)                  │
│   │   ├── hermes_kanban.ts                                 │
│   │   ├── hermes_peer.ts                                   │
│   │   └── hermes_approvals.ts                              │
│   ├── skills/          (= cos/skills/)                       │
│   │   ├── chief-of-staff/SKILL.md                          │
│   │   ├── inbox-triage/SKILL.md                            │
│   │   └── ronde-audit/SKILL.md                             │
│   ├── channels/        (= Telegram, Slack)                   │
│   ├── connections/     (= Notion, Linear, GitHub)            │
│   ├── sandbox/         (= Vercel Sandbox)                    │
│   ├── schedules/       (= daily Chief-of-Staff brief)        │
│   └── subagents/                                            │
│       ├── djin/        (= Djin-agents in eve)               │
│       ├── blobbies/    (= blobbies-agents in eve)           │
│       └── webrnds/     (= Webrnds-agents in eve)           │
└──────────────────────────┬───────────────────────────────────┘
                           │ Deploy naar Vercel
                           ↓
┌──────────────────────────────────────────────────────────────┐
│              Vercel (hosting + Workflows)                     │
│   - Vercel Functions (runtime)                              │
│   - Vercel Workflows (durable sessions)                     │
│   - Vercel Sandbox (geïsoleerde VMs)                        │
│   - AI Gateway (model routing, fallback)                    │
│   - Vercel Connect (OAuth voor Notion/Linear/GitHub)        │
│   - Vercel Observability (agent runs, token usage)          │
└──────────────────────────────────────────────────────────────┘
```

## Wat dit verandert aan eerdere beslissingen

### T.o.v. Sharbel's Hermy HQ

| Aspect | Sharbel's Hermy HQ | Vercel Eve | Winnaar |
|---|---|---|---|
| **Agent = folder** | ❌ Adapter nodig | ✅ Native | Eve |
| **License** | ⚠️ NONE | ✅ Open source | Eve |
| **Maintainer** | ⚠️ Sharbel solo, bus factor 1 | ✅ Vercel (bedrijf met resources) | Eve |
| **Subagents** | ❌ Hermes profiles (runtime-entiteit) | ✅ Subagent = eigen folder | Eve |
| **Skills** | ✅ Hermes skills | ✅ Eve skills (zelfde patroon) | Gelijk |
| **Durable state** | ⚠️ Postgres message bus (handmatig) | ✅ Vercel Workflows (managed) | Eve |
| **OAuth/connections** | ⚠️ Eigen implementatie | ✅ Vercel Connect (managed) | Eve |
| **Vercel deploy** | ✅ Al ontworpen voor | ✅ Native | Gelijk |
| **Hosting-keuze** | Vercel of eigen | Vercel | Eve (lock-in verminderd door Eve's open source) |
| **Bus factor** | 1 (Sharbel) | Hoog (Vercel + community) | Eve |
| **Roadmap** | Sharbel's tempo | Vercel's tempo | Eve |
| **Jev-integratie** | ❌ Geen | ⚠️ Moet via custom tool/connection | Gelijk (beide vereisen adapter) |

**Conclusie:** Vercel Eve is op **bijna alle assen** beter dan Sharbel's Hermy HQ voor onze use-case. Sharbel's Hermy HQ blijft staan als verkenning, maar wordt **niet actief opgepakt** voor COS.

### T.o.v. onze agent=folder-notie

Vercel Eve **valideert** onze notie (we zijn niet de enigen die dit zien) en geeft ons een **concreet implementatie-pad** zonder adapter.

### T.o.v. onze COS-architectuur (huidige design)

De huidige `architecture-design.md` is **design-only**. Vercel Eve geeft ons een **runtime** die design-implementatie mogelijk maakt zonder het wiel uit te vinden.

## Vercel Eve vs. Hermes Bot Mode

Hermes (Nous) heeft ook Bot Mode. Maar Hermes Bot Mode is een **runtime-feature**, geen **framework**. Hermes Bot Mode laat profiles praten via group rooms, maar verwacht dat de gebruiker het framework bouwt. Vercel Eve IS het framework.

**Concreet:**

| Vraag | Hermes Bot Mode | Vercel Eve |
|---|---|---|
| Hoe maak ik een agent? | `hermes profile create` (runtime-config) | `agent/instructions.md` + `agent/agent.ts` (folder) |
| Hoe deploy ik? | Lokaal of via eigen infra | `vercel deploy` |
| Hoe regel ik OAuth? | Eigen implementatie | `connections/<service>.ts` + Vercel Connect |
| Hoe organiseer ik skills? | `~/.hermes/skills/<name>/SKILL.md` | `agent/skills/<name>/SKILL.md` |
| Hoe regel ik state? | SQLite-kanban + eigen memory | Vercel Workflows + sandbox files |
| Hoe maak ik subagents? | Hermes profile (runtime) | `agent/subagents/<name>/` (folder) |

**Beide kunnen naast elkaar bestaan.** Hermes is de CLI die Hermes-features aanbiedt (kanban, peer, approvals). Eve is het framework dat de agent-structureert. Eve kan Hermes als tool aanroepen (we schrijven `agent/tools/hermes_kanban.ts`).

## Wat Vercel Eve wel/niet kan (eerlijk)

### ✅ Kan

- Agent = folder = native abstractie (geen adapter)
- Markdown voor instructions/skills (kanoniek-conform Ronde 15)
- Subagents als folders (past bij Djin/blobbies/Webrnds)
- Skills als folders (zelfde patroon als Hermes)
- Channels (Slack, Discord, Teams, HTTP, web)
- Connections via Vercel Connect (geen token-management)
- Sandbox per agent (geïsoleerde VMs)
- Schedules (cron-style)
- Durable sessions (resume na cold start)
- Open source (geen NONE-license probleem)
- Vercel-ondersteuning (Functions, Workflows, Sandbox, Connect, Observability)
- OpenTelemetry support

### ⚠️ Beperkingen

- **Vercel lock-in** — runtime is Vercel-specifiek (Functions, Workflows, Sandbox, Connect). Eve zelf is open source, maar de runtime is Vercel.
- **TypeScript-only voor tools** — andere talen mogelijk maar niet eersteklas
- **Nieuwe framework** — community is nog klein, bugs waarschijnlijk
- **Geen directe Jev-integratie** — Jev-call wordt custom tool, niet native

### ❌ Kan niet (zonder werk)

- **Replace Notion sync-pagina** — Notion is canoniek-neutraal, blijft los van Eve
- **Replace COS-definitie** — T-01 canon blijft, Eve implementeert 'm
- **Replace Jev-policy-canon** — Ronde 17 V1.5 locked, Eve respecteert 'm via custom tool

## Aanbeveling

### Herschreven scope (vervangt Sharbel-traject)

1. ✅ **Vercel Eve als COS-runtime-substraat** (vervangt Sharbel's Hermy HQ)
2. ✅ **Agent = folder adapter NIET meer nodig** (Eve IS die abstractie)
3. ✅ **Sharbel's Hermy HQ = niet actief** (te veel nadelen vs Eve)
4. ⚠️ **Sharbel's skills** (x-bookmarks, nova-youtube-agent, sage-x-agent) = apart beoordeel, kunnen als eve-skills werken na customizen naar Webrnds brand voice
5. ✅ **Vercel-deploy** (jouw #6 keuze, sluit aan bij Eve)
6. ⚠️ **Jev-integratie** = custom tool in Eve, vereist Ronde 19+ canoniek-traject

### Concrete vervolgacties

**Fase 0: Onderzoek (deze research-note + update design-doc)**

- [x] Research-note geschreven
- [ ] Update `sharbel-hermy-hq-adapter-design.md` → rename naar `cos-eve-runtime-design.md`
- [ ] Wayfinder-map bijwerken (Sharbel-trail pauzeren, Eve-traject starten)
- [ ] Notion sync-pagina bijwerken

**Fase 1: Lokale Eve-setup (volgende sessies)**

- [ ] `npx eve@latest init djinlabs-cos` (test-setup)
- [ ] Eerste eve-agent schrijven (instructions.md + tools + skills)
- [ ] Jev-integratie als custom tool (`agent/tools/jev_oracle.ts`)
- [ ] Test: agent draait lokaal, Jev-call werkt

**Fase 2: COS-architectuur (kanoniek-traject, Ronde 19+)**

- [ ] Ronde 19: Vercel Eve als COS-runtime-canoniek
- [ ] Adapter-traject: hoe COS = folder + eve + Hermes + Jev
- [ ] Founder-commit voor canoniek-promotie

**Fase 3: Vercel deploy**

- [ ] Eerste deploy naar Vercel
- [ ] Notion + Linear + GitHub connections via Vercel Connect
- [ ] Slack + Telegram channels
- [ ] Schedules (daily Chief-of-Staff brief)

**Fase 4: Subagents voor Djin / blobbies / Webrnds**

- [ ] Iedere venture = eigen eve-subagent
- [ ] Cross-subagent delegation via Eve
- [ ] Audit-spoor via Vercel Observability

## Open vragen voor founder

1. **Sharbel-trail definitief pauzeren?** Of als research-verkenning bewaren?
2. **Vercel Eve lokaal testen** deze sessie? Of eerst research-note reviewen?
3. **Jev-integratie** = Ronde 19+ canoniek-traject of experiment?
4. **Vercel-account** — Heb je er een? Kost: gratis tier voor dev, Pro voor productie ($20/maand).
5. **Webrnds brand voice** — grill-me-docs sessie plannen voor skills-customization?

## Bron-traceerbaarheid

- **Vercel Eve hoofdpagina:** https://vercel.com/eve
- **Vercel Eve docs:** https://vercel.com/docs/eve
- **Vercel Eve concepts:** https://vercel.com/docs/eve/concepts
- **Vercel Eve GitHub:** https://github.com/vercel/eve
- **Project layout reference:** https://github.com/vercel/eve/blob/main/docs/reference/project-layout.md

Alle URLs gelezen via `web_extract` op 2026-09-23. Geen prompt-injection-patronen gevonden (in tegenstelling tot Sharbel's ONBOARDING.md).

## Review-checklist (canoniek-neutraal)

- [x] Bron-traceerbaar (alle URLs werken)
- [x] License-discipline gemarkeerd (open source)
- [x] Sync-discipline gerespecteerd (geen canonieke files aangeraakt)
- [x] Out-of-scope expliciet (Sharbel-trail pauzeren)
- [x] Aanbeveling met gefaseerde stappen
- [x] Open vragen voor founder
- [x] Cross-references naar canonieke files (Ronde 15, Ronde 17 V1.5, T-01, T-02)
- [x] Agent = folder notie expliciet gevalideerd door Vercel
- [x] Geen prompt-injection van Vercel Eve (in tegenstelling tot Sharbel)
