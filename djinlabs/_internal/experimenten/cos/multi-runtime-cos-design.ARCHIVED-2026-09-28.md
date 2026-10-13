---
title: Multi-runtime COS-architectuur — Vercel Eve + DjinLabs HQ + Hermes + blobbies
archived: 2026-09-28 per Ronde 19 motie 1 (DjinLabs zonder runtimes). Zie `decisions.md` Ronde 19.
date: 2026-09-23
status: draft
type: design-doc
scope: cos-architectuur + multi-runtime
provenance: vervolg op brainstorm `multi-runtime-architecture-brainstorm.md` (2026-09-23)
supersedes: sharbel-hermy-hq-adapter-design.md (gedeeltelijk — Sharbel-trail pauzeren)
researcher: Hermes (Nous) op verzoek van founder
review_status: unreviewed
related:
  - multi-runtime-architecture-brainstorm.md
  - ../CONTEXT.md
  - ../wayfinder-map.md
  - ../architecture-design.md
  - ../research/2026-09-22-agent-is-folder-icm-notion.md
  - ../tickets/T-01-cos-definitie.md
  - ../tickets/T-02-cos-baas.md
  - ../../../research/vercel-eve-cos-runtime-research.md
  - ../../../research/sharbel-hermy-hq-cos-adapter-research.md (pauzeren)
  - ../../../_shared/jev-policy-canon.md (Ronde 17 V1.5)
  - ../../../_shared/agent-discipline-canon.md
  - ../../../_shared/sync-discipline-canon.md
sources:
  - Vercel Eve: https://vercel.com/eve, https://github.com/vercel/eve (Apache 2.0, 5326★)
  - Sharbel's Hermy HQ: https://github.com/sharbelxyz/hermes-agent-mission-control (NONE license — forken)
  - Hermes CLI v0.20.5 (lokaal)
  - blobbies Tauri 2.11.5 (lokaal)
---

# Multi-runtime COS-architectuur — Design-doc

## Doel

Ontwerp een **multi-runtime COS-architectuur** die:

1. **Vercel Eve** als COS-runtime gebruikt (folder = agent, native)
2. **DjinLabs HQ** (fork van Sharbel's Hermy HQ) als lokaal mission-control dashboard opzet
3. **Hermes CLI** als uitvoeringslaag voor COS-dispatches (lokale profiles)
4. **blobbies** als aparte runtime (Tauri-app, Q3 + Tinfoil-CSP + Ollama-loopback)
5. **Toekomstige runtimes** plugbaar maakt zonder architectuur-wijziging
6. **Jev** integreert als policy-oracle (Ronde 17 V1.5 canoniek)
7. **Canonieke disciplines** respecteert (agent = folder = ICM, Ronde-traject via `decisions.md`)

**Niet** het doel:

- Sharbel's sales-bot kopiëren
- Canonieke files aanraken
- Andere agenten (Djin, blobbies, Webrnds) op COS-niveau code schrijven
- Jev-policy-canon.md wijzigen (Ronde 17 V1.5 locked)

## Architectuur-overzicht (samengevat)

Vier lagen die samenwerken:

```
┌──────────────────────────────────────────────────────────────┐
│ Layer 4: COS-RUNTIME (Vercel Eve, lokaal of cloud)          │
│   agent/ = folder = COS                                      │
│   - instructions.md ← cos/CONTEXT.md                         │
│   - tools/jev_oracle.ts                                      │
│   - tools/dispatch.ts                                        │
│   - skills/ = chief-of-staff, inbox-triage, ronde-audit      │
│   - channels/telegram.ts, slack.ts                           │
│   - connections/notion.ts, linear.ts, github.ts              │
│   - subagents/ = djin/, blobbies/, webrnds/                  │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ COS dispatcht via
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ Layer 3: LOKALE RUNTIMES (jouw Mac)                          │
│                                                              │
│   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│   │ Hermes CLI     │  │ blobbies       │  │ Toekomstige    │ │
│   │ (Nous v0.20.5) │  │ (Tauri 2.11.5) │  │ runtime A/B/C  │ │
│   │                │  │                │  │                │ │
│   │ profiles:      │  │ Q3 dispatch    │  │ (later)        │ │
│   │ - djin         │  │ Tinfoil-CSP    │  │                │ │
│   │ - blobbies     │  │ Ollama-loop    │  │                │ │
│   │ - webrnds      │  │ shell-sandbox  │  │                │ │
│   │ - sales        │  │                │  │                │ │
│   │ kanban         │  │                │  │                │ │
│   │ approvals      │  │                │  │                │ │
│   │ peer DMs       │  │                │  │                │ │
│   └────────────────┘  └────────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ state mirror via bridge
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ Layer 2: DJINLABS HQ (lokaal mission-control)               │
│   = fork van Sharbel's Hermy HQ + eigen license             │
│   - Next.js 16 + React 19 + Tailwind v4                      │
│   - Prisma + Postgres message bus                            │
│   - Tauri desktop wrapper                                    │
│   - Hermes-bridge (poller + state mirror)                    │
│   - Panels: Hermes activity, blobbies status, etc.          │
│   - Unified approval inbox                                   │
│   - Chief-of-Staff brief (auto-generated)                    │
└──────────────────────────────────────────────────────────────┘
                              │
                              │ approval gate unified
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ Layer 1: FOUNDER (Darren Schreuder)                         │
│   - Telegram / WhatsApp / Slack (channels naar COS)          │
│   - Web UI voor DjinLabs HQ                                  │
│   - Beslist over side-effecting acts via unified inbox       │
└──────────────────────────────────────────────────────────────┘
```

Plus **één externe laag** (read-only voor COS):

```
┌──────────────────────────────────────────────────────────────┐
│ Layer 0: JEV (TypeSafe AI policy-oracle)                    │
│   - api.typesafe.ai policy-verdict API                       │
│   - COS checkt Jev vóór elke dispatch                       │
│   - Ronde 17 V1.5 canoniek                                   │
└──────────────────────────────────────────────────────────────┘
```

Plus **canonieke bronnen** (read-only voor alle agents):

```
┌──────────────────────────────────────────────────────────────┐
│ Canonieke bronnen (Markdown in git)                          │
│   - cos/ folder (CONTEXT.md, wayfinder-map.md, etc.)         │
│   - _shared/ (jev-policy-canon.md V1.5, etc.)                │
│   - decisions.md (Ronde 14 t/m 18 LOCKED)                    │
│   - research/ (webrnds-profile, codavo, etc.)                 │
│   - Alleen leesbaar door agents                              │
│   - Schrijven alleen via Ronde-traject                       │
└──────────────────────────────────────────────────────────────┘
```

## Component-ontwerp per laag

### Layer 4: Vercel Eve als COS-runtime

**Authoring-conventie** (uit Vercel Eve docs):

```
djinlabs-cos/
├── package.json
├── tsconfig.json
└── agent/
    ├── agent.ts                # Model + runtime config
    ├── instructions.md         # Always-on system prompt (uit cos/CONTEXT.md)
    ├── tools/                  # TypeScript tools (filename = tool name)
    │   ├── jev_oracle.ts       # Jev policy-call
    │   ├── hermes_dispatch.ts  # Hermes peer DM + kanban assign
    │   ├── notion_read.ts      # Notion via Vercel Connect
    │   └── linear_read.ts      # Linear via Vercel Connect
    ├── skills/                 # Markdown playbooks (on-demand)
    │   ├── chief-of-staff/SKILL.md
    │   ├── inbox-triage/SKILL.md
    │   └── ronde-audit/SKILL.md
    ├── channels/               # Message entry points
    │   ├── telegram.ts
    │   └── slack.ts
    ├── connections/            # External services (Vercel Connect)
    │   ├── notion.ts
    │   ├── linear.ts
    │   └── github.ts
    ├── sandbox/                # Geïsoleerde compute
    │   └── sandbox.ts
    ├── schedules/              # Cron-style jobs
    │   └── daily_brief.md
    └── subagents/              # Specialist child agents (elke = folder)
        ├── djin/
        │   ├── agent.ts
        │   ├── instructions.md
        │   └── tools/
        ├── blobbies/
        └── webrnds/
```

**Belangrijk:** Elke file IS een geregistreerde tool/skill/subagent. Identity via path.

**Lokaal draaien:**

```bash
npx eve@latest init djinlabs-cos
cd djinlabs-cos
npm run dev
# → COS agent draait op http://localhost:3000 (default)
```

**Cloud deployen** (later):

```bash
npm i -g vercel
vercel
vercel --prod
# → COS agent draait op Vercel Functions met Workflows + Connect + Sandbox
```

### Layer 3: Lokale runtimes

**Hermes CLI** als uitvoeringslaag:

```bash
hermes profile list
# → djin, blobbies, webrnds, sales (default)

hermes peer add webrnds-local http://localhost:7878
# → cross-machine peer setup
```

COS dispatcht naar Hermes via:

```typescript
// agent/tools/hermes_dispatch.ts
export default defineTool({
  description: "Dispatch task to a Hermes profile",
  inputSchema: z.object({
    profile: z.string(),
    task: z.string(),
    approval_gated: z.boolean().default(true),
  }),
  async execute({ profile, task, approval_gated }) {
    // 1. Jev verdict eerst
    const jevVerdict = await jevOrcacle({ intent: task, profile });
    if (jevVerdict === "reject") return { ok: false, reason: "jev_reject" };
    if (approval_gated || jevVerdict === "ask_human") {
      return await enqueueApproval({ profile, task });
    }
    // 2. Hermes dispatch
    const result = await execFileP("hermes", ["peer", "dm", profile, task]);
    return { ok: true, result };
  },
});
```

**blobbies** integratie (toekomstig, vereist Hermes-koppeling in Tauri):

```typescript
// agent/tools/blobbies_dispatch.ts (toekomstig)
export default defineTool({
  description: "Dispatch task to blobbies Tauri app",
  // ... via Hermes peer DM of direct via Tauri IPC
});
```

### Layer 2: DjinLabs HQ (lokale mission-control)

**Fork-discipline:**

```
sharbelxyz/hermes-agent-mission-control (upstream)
       ↓ fork
djinlabs/djinlabs-hq (eigen repo, Apache 2.0)
       ↓
- Vercel Eve panel (toevoegen, Sharbel heeft niet)
- blobbies panel (toevoegen)
- Multi-runtime log aggregator
- Custom branding (Webrnds brand voice via grill-me-docs)
```

**Bridge-pattern** (van Sharbel's hermes-bridge, uitgebreid):

```
Hermes CLI ──┐
             ├──→ hermes-bridge ──┐
Eve lokaal ──┘                    │
                                  ├──→ Postgres message bus ──→ DjinLabs HQ UI
blobbies ─────────────────────────┤
                                  │
Toekomstige runtimes ──────────────┘
```

**Eve-bridge** (zelf te schrijven, gebaseerd op Sharbel's patroon):

```javascript
// eve-bridge/bridge.mjs
import pg from "pg";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

// PULL: Eve lokaal state → Postgres
// PUSH: Postgres approval-requests → Eve agent runs
```

### Layer 1: Founder-interfaces

**Channels** (vanuit COS):

```typescript
// agent/channels/telegram.ts
export default defineChannel({
  platform: "telegram",
  // ... Telegram Bot API koppeling
});
```

**Web UI** (vanuit DjinLabs HQ):

- Mission control view
- Unified approval inbox
- Chief-of-Staff brief
- Audit-spoor

### Layer 0: Jev-integratie

**Custom tool** in Eve:

```typescript
// agent/tools/jev_oracle.ts
import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Get policy verdict from Jev (TypeSafe AI) before dispatch",
  inputSchema: z.object({
    intent: z.string(),
    source: z.string(),
    confidence: z.number().min(0).max(1),
  }),
  async execute({ intent, source, confidence }) {
    const response = await fetch("https://api.typesafe.ai/v1/systemone", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.JEV_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ intent, source, confidence }),
    });
    return await response.json();
    // Returns: { verdict: "allow" | "reject" | "ask_human" | "research_capped", ... }
  },
});
```

**Gebruik in instructions.md:**

```markdown
# COS Instructions

## Dispatch-flow

Voor ELKE dispatch naar een agent:

1. Lees de intent en source
2. Roep `jev_oracle` aan met intent, source, confidence
3. Op `allow`: dispatch direct
4. Op `reject`: log + escaleer naar founder via Telegram
5. Op `ask_human`: enqueue in DjinLabs HQ approval inbox
6. Op `research_capped`: doe extra research met cap=5 bronnen, dan opnieuw Jev-call

## Hard rules

- Canonieke files zijn read-only (alleen lezen, nooit schrijven)
- Schrijven aan canonieke files alleen via Ronde-traject in `decisions.md`
- Side-effecting acts (mail, betaling, externe calls) MOETEN approval-gated
```

### Canonieke discipline

**Lezen** (bij agent startup):

```bash
# Eve kan lezen uit cos/ folder bij instructies (read-only)
agent/instructions.md ← translate(cos/CONTEXT.md)
agent/skills/ronde-audit/SKILL.md ← translate(_shared/sync-discipline-canon.md)
```

**Schrijven** (alleen via Ronde-traject):

1. COS detecteert canoniek-relevante wijziging
2. COS maakt **Ronde-traject-entry** in `decisions.md` (canoniek!)
3. COS plaatst **approval request** in DjinLabs HQ inbox
4. Bij approval door founder: COS schrijft wijziging + log in `cos/audit/rondes.jsonl`

## Concrete implementatie-stappen

### Fase 0: Onderzoek + design (deze fase)

- [x] Sharbel's Hermy HQ onderzocht (research-note)
- [x] Vercel Eve ontdekt + onderzocht (research-note)
- [x] Multi-runtime brainstorm (brainstorm-doc)
- [x] Herschreven design-doc (deze file)

### Fase 1: Lokale Vercel Eve setup (kanoniek-neutraal)

- [ ] `npx eve@latest init djinlabs-cos`
- [ ] Eerste eve-agent schrijven (instructions.md + tools + skills)
- [ ] Jev-integratie als custom tool
- [ ] Test: agent draait lokaal, Jev-call werkt

### Fase 2: Hermes CLI integratie (kanoniek-neutraal)

- [ ] Hermes profiles aanmaken voor djin, blobbies, webrnds
- [ ] Eve-tool `hermes_dispatch.ts` schrijven
- [ ] Peer setup voor cross-machine DMs
- [ ] Test: Eve dispatcht → Hermes voert uit → result terug

### Fase 3: DjinLabs HQ fork (kanoniek-neutraal, license-traject)

- [ ] Sharbel's Hermy HQ forken
- [ ] Eigen license toevoegen (Apache 2.0 of MIT)
- [ ] Hermes-bridge kopiëren + aanpassen voor multi-runtime
- [ ] Eve-bridge schrijven
- [ ] blobbies-panel toevoegen (toekomstig)
- [ ] Branding (Webrnds brand voice via grill-me-docs)

### Fase 4: Canoniek traject (Ronde 19+)

- [ ] Ronde 19: Vercel Eve als COS-runtime-canoniek
- [ ] Ronde 20: Jev-integratie-traject canoniek
- [ ] Ronde 21: Multi-runtime-adapter canoniek
- [ ] Founder-commit voor canoniek-promotie

### Fase 5: Productie

- [ ] Vercel deploy (Functions + Workflows + Connect + Sandbox)
- [ ] Subagents voor Djin / blobbies / Webrnds in productie
- [ ] Channels (Telegram, Slack) live
- [ ] Schedules (daily Chief-of-Staff brief)

## Wat NIET in deze design-doc zit (out-of-scope)

- **Hermy HQ installatie zonder fork** — wacht op license-beslissing
- **Sharbel's skills** (x-bookmarks, nova-youtube-agent, sage-x-agent) — apart traject na license-review
- **Canonieke files aanraken** — alleen experimenten-zone
- **Jev-policy-canon.md wijzigen** — Ronde 17 V1.5 locked
- **Andere agenten (Djin, blobbies, Webrnds) profile-code** — apart traject na COS v0.1
- **Vercel Connect implementatie** — pas bij productie

## Open vragen voor founder (kanoniek-discipline)

1. **License DjinLabs HQ fork** — Apache 2.0 of MIT? Of contact Sharbel voor officiële license?
2. **Vercel-account** — Heb je een? Kost: gratis tier voor dev, Pro voor productie ($20/maand).
3. **Jev-integratie Ronde 19+** — Nu of later? Vereist canonieke uitbreiding van `_shared/jev-policy-canon.md`.
4. **Webrnds brand voice** — grill-me-docs sessie plannen voor DjinLabs HQ branding?
5. **Eerste subagent** — Welke eerst? djin, blobbies, of webrnds?
6. **Sharbel's skills** (x-bookmarks etc.) — installeren via onze audit-flow?

## Bron-traceerbaarheid

- **Vercel Eve:** https://vercel.com/eve, https://github.com/vercel/eve (Apache 2.0)
- **Sharbel's Hermy HQ:** https://github.com/sharbelxyz/hermes-agent-mission-control (NONE)
- **Hermes CLI:** `hermes --help` lokaal (geverifieerd)
- **Jev:** `_shared/jev-policy-canon.md` (Ronde 17 V1.5)
- **T-01 + T-02:** `cos/tickets/` (gesloten)
- **Agent = folder notie:** `cos/research/2026-09-22-agent-is-folder-icm-notion.md`
- **Multi-runtime brainstorm:** `cos/multi-runtime-architecture-brainstorm.md`

## Review-checklist (canoniek-neutraal)

- [x] Bron-traceerbaar (alle URLs + commando's verifieerbaar)
- [x] License-discipline gemarkeerd (Hermy HQ NONE, fork-discipline)
- [x] Sync-discipline gerespecteerd (geen canonieke files aangeraakt)
- [x] Out-of-scope expliciet
- [x] Aanbeveling met gefaseerde stappen
- [x] Open vragen voor founder
- [x] Cross-references naar canonieke files
- [x] Agent = folder notie expliciet gevalideerd door Vercel Eve
- [x] Sharbel-filosofie vs Sharbel-code onderscheiden (Hermy HQ = bron voor fork, niet COS-adapter)
- [x] Multi-runtime-patroon met DjinLabs HQ als lokale mission-control
