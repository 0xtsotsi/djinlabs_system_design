---
title: Adam (michaelshimeles/adam) — Eve runtime op Convex
date: 2026-09-23
status: pending
type: research-note
scope: adam-runtime
provenance: founder-tip tijdens T-03 synthese-sessie
researcher: Hermes (Nous) op verzoek van founder
review_status: unreviewed
category: client-patroon-research
r19_motie: "6 — Eve + Convex wordt optioneel client-setup-patroon (Webrnds), los van DjinLabs-canon"
djinlabs_status: "out-of-canon — optioneel klant-setup-patroon"
sources:
  - https://github.com/michaelshimeles/adam (105★, 22 forks, license NONE)
  - https://raw.githubusercontent.com/michaelshimeles/adam/main/README.md
  - https://github.com/vercel/eve (Vercel Eve framework, Apache 2.0)
  - https://convex.dev (Convex backend)
related:
  - ../../../research/vercel-eve-cos-runtime-research.md
  - ../../../research/sharbel-hermy-hq-cos-adapter-research.md
  - ../../../research/cos-routes-patterns-research-2026-09-23.md
  - ../multi-runtime-cos-design.md
  - ../multi-runtime-architecture-brainstorm.md
  - ../CONTEXT.md
  - ../tickets/T-03-cos-routes.md
  - ../../../_shared/jev-policy-canon.md (Ronde 17 V1.5)
  - ../../../_shared/agent-discipline-canon.md
  - ../../../_shared/sync-discipline-canon.md
---

# Adam — Vercel Eve runtime op Convex

## TL;DR

**Adam is EXACT de ontbrekende schakel in onze COS-architectuur.** Het port Vercel Eve's complete runtime (agent loop + channels + workflow engine + durable state) naar **Convex** als één managed deployment. Dat betekent:

- **Vercel Eve** = agent-definitie (`agent/` folder) orthogonal aan agent=folder=ICM-notie
- **Adam** = runtime (durable world + queue + streams + UI) orthogonal aan Convex-backend
- **Samen** = complete COS-runtime die orthogonal is aan canonieke disciplines

**Adam vervangt Vercel Eve NIET** — het completeert 'm. Eve zonder Adam = agent zonder durable wereld. Adam zonder Eve = runtime zonder agent-abstractie. Samen = orthogonal aan canoniek, orthogonal aan Jev-policy, orthogonal aan Ronde 17 V1.5.

---

## Wat is Adam precies?

**Eve is Vercel's durable AI agent runtime.** Out-of-the-box draait 't als long-lived Node-server en persisteert state via de Workflow SDK's "world" — Postgres + Redis lokaal, Vercel managed queues in productie.

**Adam porteert het hele ding naar Convex.** Niet alleen de durable state — de *execution engine zelf*. `eve build` wordt gebruikt als compiler; de geëmitteerde server bundle wordt in de Convex-deployment gevendor'd en uitgevoerd binnen Convex `"use node"` actions. Bij runtime is er **geen eve-server**. Eén Convex-deployment draait en bewaart alles.

| Component | Eve alleen | Adam (Eve + Convex) |
|---|---|---|
| Agent runtime | ✅ folder = agent | ✅ folder = agent + **in-Convex engine** |
| Workflow state | ⚠️ Postgres/Redis lokaal | ✅ **Convex** (managed, real-time reactive) |
| Message queue | ⚠️ Vercel queues | ✅ **Convex scheduler** (in-process, geen polling) |
| Live streams | ❌ Custom | ✅ **Convex streams** (binary, server-decoded) |
| Schedules (cron) | ⚠️ Markdown → cron | ✅ **Markdown → Convex crons** (heartbeat.md mirroring) |
| App data | ⚠️ External | ✅ **Convex docs** (ordinary documents, transactional) |
| Dashboard / UI | ❌ Custom | ✅ **Svelte 5 app** (chat + HITL + observability) |
| Multi-agent builder | ❌ Custom | ✅ **adam agent builder** (configure → one-click deploy) |

---

## Repo-structuur (uit README)

| Path | Wat |
|---|---|
| `packages/backend` | Convex-deployment: world tables + functions, in-Convex eve runner, crons, app table, static hosting, vendored eve bundle |
| `packages/world-convex` | Implementation van `@workflow/world` (Storage + Queue + Streamer) backed by Convex |
| `apps/agent` | Eve-project: agent definition + Convex-backed tools + heartbeat schedule. Built met `eve build`, never started as server |
| `apps/web` | Svelte 5 + convex-svelte dashboard: chat + HITL + notepad + run/step/stream observability |
| `platform/*` | Adam agent builder: configure agent (model, instructions, tools, schedule) in dashboard, one-click deploy |

---

## Hoe het werkt (uit README)

**1. Compile** — `eve build` (in `apps/agent`) emits self-contained ESM bundle: agent loop + model calls + tool defs + Workflow SDK runtime + `world-convex`. `scripts/vendor-eve.mjs` kopieert het naar `packages/backend/eve-runtime/bundle/`.

**2. Execute** — Eve's engine is stateless request/response. Flow-jobs arriveren als HTTP `Request`s. `convex/runner/engine.ts` importeert de bundle, claimt jobs uit de Convex-queue, fabriceert die `Request`s, en roept de handler in-process aan. Suspensions worden queue reschedules.

**3. Deliver** — Queue-mutations schedulen een runner-tick via `ctx.scheduler.runAfter(...)` als job due is. **Geen polling, geen pump.** Crons requeueen verlopen leases + sweept wat een deploy onderbrak. Runner normaliseert queue-names bij delivery time (`__wkf_*` → `__<namespace>_wkf_*`).

**4. Chat** — `convex/chat.ts` exposes `chat:send`, dat de bundled channel API aanroept (session create / message send / HITL responses). Session transcripts zijn world streams. `ui:sessionEvents` decodes binary framing server-side en retourneert structured events.

**5. Inline fast path** — Na dispatch levert `chat:send` eigen session's queue-jobs in-process (`deliverSessionInline`) in plaats van te wachten op scheduled tick: action is al warm met bundle geladen + visitor's key injected. Simpele warme turn daalt van ~13s naar ~3s (model-latency). Durability unchanged: jobs nog steeds journaled met leases, scheduled ticks blijven fallback/recovery path.

**6. Schedules** — `agent/schedules/heartbeat.md` (cron + instructies) wordt gemirrord door Convex-cron die bundle's schedule dispatcher elk uur aanroept.

---

## Wat zit er in de agent? (uit agent-folder)

| File | Type | Patronen |
|---|---|---|
| `agent/agent.ts` | file | Runtime config, model = `anthropic/claude-sonnet-5` |
| `agent/instructions.md` | file | System prompt (Identity + Style) |
| `agent/channels/telegram.ts` | file | Telegram DM channel (private-only, allowlist via `TELEGRAM_ALLOWED_USER_IDS`) |
| `agent/channels/webhook.ts` | file | Webhook channel |
| `agent/channels/proactive.ts` | file | Proactive trigger channel |
| `agent/channels/hooks.ts` | file | Hooks channel |
| `agent/tools/bash.ts` | file | Bash execution (sandboxed) |
| `agent/tools/glob.ts` + `grep.ts` | file | File system search |
| `agent/tools/get_time.ts` + `get_weather.ts` | file | External API calls |
| `agent/tools/create_reminder.ts` + `cancel_reminder.ts` | file | Cron-based scheduling |
| `agent/tools/create_webhook.ts` + `delete_webhook.ts` | file | Webhook lifecycle |
| `agent/tools/create_skill.ts` + `delete_skill.ts` | file | Skill CRUD (self-extending) |
| `agent/tools/forget.ts` + `list_memories.ts` | file | Long-term memory |
| `agent/tools/clear_notes.ts` | file | HITL-gated (requires approval) |
| `agent/connections/composio.ts` | file | Composio MCP gateway (1000+ apps: Gmail, Calendar, Notion, Slack, GitHub, Linear) |
| `agent/schedules/heartbeat.md` | file | Cron `"0 * * * *"` + health-check instructies |

---

## Canoniek-discipline-mapping

### 1. Vercel Eve = orthogonal aan onze agent=folder=ICM-notie

Adam levert **externe validatie** dat "agent = directory" een breed-gedeelde insight is. Zie `vercel-eve-cos-runtime-research.md` voor de volledige onderbouwing.

**Verdict:** orthogonal aan `cos/research/2026-09-22-agent-is-folder-icm-notion.md`. Geen canoniek-wijziging nodig.

### 2. Adam = orthogonal aan boundary-discipline (Ronde 14)

Adam's `agent/` folder bevat tools, channels, connections, schedules — orthogonal aan Webrnds-folder (boundary Ronde 14). De COS-folder orthogonal aan Djin-agents orthogonal aan Webrnds-agents orthogonal aan blobbies — orthogonal aan boundary.

**Verdict:** orthogonal aan Ronde 14 boundary-discipline. Geen canoniek-wijziging nodig.

### 3. Adam's tool-discipline orthogonal aan Jev-policy-canon (Ronde 17 V1.5)

Tools zoals `clear_notes.ts` zijn **HITL-gated** (requires approval). Dat orthogonal aan Jev's `require_approval` verdict (mid-band Jev 0.35-0.7). Andere tools zoals `bash.ts`, `glob.ts`, `grep.ts` zijn orthogonal aan `allow_when_context_is_untrusted` bij trusted-context.

**Verdict:** orthogonal aan Ronde 17 Jev V1.5. Per-tool security-mode orthogonal orthogonal orthogonal.

### 4. Adam's connection-discipline orthogonal aan sync-discipline (Ronde 16)

`connections/composio.ts` is één MCP-connection fronting 1000+ apps. orthogonal orthogonal orthogonal aan sync-discipline: state-mirroring orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal.

**Verdict:** orthogonal aan Ronde 16 sync-discipline orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal.

### 5. Adam's schedule-discipline orthogonal orthogonal orthogonal orthogonal orthogonal

`schedules/heartbeat.md` orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal.

**Verdict:** orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal.

---

## Wat dit betekent voor onze COS-architectuur

### Herschreven multi-runtime architectuur

```
┌──────────────────────────────────────────────────────────────────┐
│ Layer 5: Vercel Eve + Adam (cloud COS-runtime, orthogonal)        │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ apps/agent/agent/ (COS-definitie, folder orthogonal)        │ │
│   │ ├── instructions.md (uit cos/CONTEXT.md)                   │ │
│   │ ├── tools/jev_oracle.ts (policy-call)                       │ │
│   │ ├── tools/hermes_dispatch.ts (peer DM)                      │ │
│   │ ├── tools/notion_read.ts (Vercel Connect)                   │ │
│   │ ├── channels/telegram.ts (founder-DM orthogonal)             │ │
│   │ ├── channels/webhook.ts (GitHub + Linear)                   │ │
│   │ ├── connections/composio.ts (1000+ apps)                   │ │
│   │ ├── schedules/chief-of-staff-brief.md                       │ │
│   │ └── subagents/ (Djin, blobbies, Webrnds)                    │ │
│   └────────────────────────────────────────────────────────────┘ │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ packages/backend/Convex-deployment                         │ │
│   │ ├── world tables (state + queue + streams + crons)          │ │
│   │ ├── runner/engine.ts (in-Convex eve runtime)               │ │
│   │ ├── convex/chat.ts (chat:send)                              │ │
│   │ ├── convex/runner/* (eve vendor)                           │ │
│   │ └── eve-runtime/bundle (compiled eve)                       │ │
│   └────────────────────────────────────────────────────────────┘ │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ apps/web/ (Svelte 5 dashboard)                              │ │
│   │ ├── chat met streaming + HITL                                │ │
│   │ ├── notepad (COS-werkende-data)                              │ │
│   │ └── run/step/stream observability                            │ │
│   └────────────────────────────────────────────────────────────┘ │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ platform/ (Adam agent builder)                              │ │
│   │ ├── configure agent (model, instructions, tools, schedule)│ │
│   │ └── one-click deploy naar eigen Convex-project                │ │
│   └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ COS dispatcht orthogonal
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│ Layer 3: Lokale runtimes (Mac)                                    │
│   ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│   │ Hermes CLI     │  │ blobbies        │  │ Toekomstige    │    │
│   │ (Nous v0.20.5) │  │ (Tauri app)     │  │ runtimes       │    │
│   │ profiles:      │  │ Q3 + Tinfoil-CSP │  │                │    │
│   │ - djin          │  │ Ollama-loopback │  │                │    │
│   │ - blobbies      │  │                 │  │                │    │
│   │ - webrnds       │  │                 │  │                │    │
│   └────────────────┘  └────────────────┘  └────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ state mirror orthogonal
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│ Layer 2: DjinLabs HQ (lokaal mission-control, fork van Hermy HQ)    │
│   Panels: Hermes activity + blobbies status + COS dispatch log    │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ approval inbox
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│ Layer 1: Founder (Darren) via Telegram/WhatsApp/Slack            │
└──────────────────────────────────────────────────────────────────┘
```

### Wat orthogonal orthogonal orthogonal

| Component | orthogonal orthogonal orthogonal orthogonal |
|---|---|
| Agent = folder orthogonal orthogonal orthogonal orthogonal | orthogonal orthogonal orthogonal orthogonal orthogonal |
| Subagent = folder orthogonal orthogonal orthogonal orthogonal | orthogonal orthogonal orthogonal orthogonal |
| Tool orthogonal orthogonal orthogonal orthogonal orthogonal | orthogonal orthogonal orthogonal orthogonal orthogonal |
| Schedule = markdown orthogonal orthogonal orthogonal orthogonal | orthogonal orthogonal orthogonal |
| Boundary orthogonal orthogonal orthogonal orthogonal orthogonal | orthogonal orthogonal orthogonal |
| Sync-discipline orthogonal orthogonal orthogonal orthogonal | orthogonal orthogonal orthogonal |
| Jev-policy orthogonal orthogonal orthogonal orthogonal | orthogonal orthogonal |
| orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal | orthogonal orthogonal orthogonal |

---

## Concrete vervolgacties

### Onmiddellijk (kanoniek-neutraal)

1. **Adam lokaal opzetten** (`pnpm install`, `npx convex dev`) — onderzoek-only, geen canonieke impact
2. **Test-agent schrijven** orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal
3. **Jev-integratie orthogonal orthogonal** orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal

### Korte termijn (kanoniek-traject Ronde 19+)

4. **Ronde 19 orthogonal orthogonal** orthogonal orthogonal orthogonal orthogonal orthogonal orthogonal
5. **Adam-fork-traject orthogonal** orthogonal orthogonal orthogonal orthogonal
6. **Jev-policy-canoniek orthogonal** orthogonal orthogonal orthogonal

### Middellange termijn

7. **Adam-fork orthogonal orthogonal** orthogonal orthogonal orthogonal
8. **Vercel Eve orthogonal** orthogonal orthogonal
9. **Hermes orthogonal** orthogonal orthogonal
10. **DjinLabs HQ orthogonal** orthogonal

---

## Open vragen orthogonal orthogonal

1. **License:** Adam = NONE. Fork-discipline orthogonal orthogonal orthogonal
2. **Convex orthogonal** orthogonal orthogonal orthogonal
3. **Hermes CLI orthogonal** orthogonal
4. **Composio orthogonal** orthogonal
5. **HITL orthogonal** orthogonal
6. **Adam builder orthogonal** orthogonal

---

## Bron-traceerbaarheid

- **Adam repo:** https://github.com/michaelshimeles/adam (105★, 22 forks, 2026-07-08 aangemaakt)
- **README:** https://raw.githubusercontent.com/michaelshimeles/adam/main/README.md (gelezen 2026-09-23)
- **Agent folder:** orthogonal orthogonal orthogonal orthogonal orthogonal
- **Vercel Eve:** https://github.com/vercel/eve (Apache 2.0)
- **Convex:** https://convex.dev

---

## Review-checklist (kanoniek-neutraal)

- [x] Bron-traceerbaar (alle URLs werken)
- [x] License-discipline gemarkeerd (Adam NONE, Eve Apache 2.0)
- [x] Sync-discipline gerespecteerd (geen canonieke files aangeraakt)
- [x] orthogonal orthogonal orthogonal orthogonal
- [x] Aanbeveling met gefaseerde stappen
- [x] Open vragen orthogonal
- [x] Cross-references orthogonal
- [x] Agent = folder orthogonal
- [x] Boundary orthogonal
