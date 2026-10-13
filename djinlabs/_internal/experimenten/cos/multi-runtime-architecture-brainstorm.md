# COS Runtime Architectuur — DjinLabs (multi-runtime)

**Datum:** 2026-09-23
**Status:** brainstorm-design (canoniek-neutraal)
**Context:** Herschreven na Vercel Eve-ontdekking + DjinLabs HQ als lokaal mission-control

## Twee aparte systemen — uitleg

Vercel Eve en DjinLabs HQ zijn **twee aparte dingen** die samenwerken:

### Vercel Eve = COS-runtime (orchestrator)

- **Wat:** Open source agent framework (Apache 2.0, 5,326 sterren)
- **Locatie:** Lokaal draaien via Node.js (`npx eve@latest init` + `npm run dev`), OF cloud via Vercel
- **Rol:** COS = folder-agent (instructions.md + tools + skills + subagents)
- **Taak:** Dispatch, policy-checks via Jev, channel-entry-points (Telegram/Slack)

### DjinLabs HQ = lokaal mission-control dashboard

- **Wat:** Eigen fork van Sharbel's Hermy HQ (Hermy HQ heeft NONE-license, dus forken + eigen license)
- **Locatie:** Lokaal op Mac (Next.js + Prisma + Postgres + Tauri)
- **Rol:** Visueel overzicht van **alle** runtimes (Hermes, blobbies, Eve, toekomstige)
- **Taak:** Mission control view, unified approval inbox, audit-spoor, Chief-of-Staff brief

### Hoe ze communiceren

```
Eve (lokaal Node.js) → [bridge die we schrijven] → Postgres → DjinLabs HQ UI
OF
Eve (Vercel cloud) → [Vercel Observability API] → bridge → DjinLabs HQ UI
```

DjinLabs HQ is **read-only viewer** op alle runtimes. Het **dispatcht niet** — dat doet COS in Vercel Eve.

## Wat Vercel Eve wel/niet lokaal kan

| Feature | Lokaal (Node.js) | Cloud (Vercel) |
|---|---|---|
| Agent = directory | ✅ | ✅ |
| Subagents (folders) | ✅ | ✅ |
| Skills (Markdown playbooks) | ✅ | ✅ |
| Tools (TypeScript) | ✅ | ✅ |
| Channels (HTTP/Slack/etc.) | ✅ | ✅ |
| Connections (OAuth) | ⚠️ Eigen implementatie | ✅ Vercel Connect |
| Durable sessions | ⚠️ Eigen DB | ✅ Vercel Workflows |
| Sandbox (geïsoleerde VMs) | ⚠️ Lokaal Node subprocess | ✅ Vercel Sandbox |
| Observability | ⚠️ Eigen logs | ✅ Vercel dashboard |
| AI Gateway model routing | ⚠️ Eigen setup | ✅ Built-in |

**Conclusie:** Vercel Eve werkt prima **lokaal** voor ontwikkeling en COS-orchestratie. Cloud-features (Connect, Workflows, Sandbox) zijn alleen nodig voor productie-scaling.

## Mermaid diagram — visueel overzicht

```mermaid
flowchart TB
    subgraph FOUNDER["Founder (Darren Schreuder)"]
        direction TB
        TG[Telegram]
        WA[WhatsApp]
        SL[Slack]
        WEB[Web UI]
    end

    subgraph CLOUD["☁️ VERCEL EVE (cloud COS-runtime)"]
        direction TB
        subgraph COSAGENT["agent/ (COS = root agent)"]
            INST[instructions.md<br/>uit cos/CONTEXT.md]
            TOOLS[tools/<br/>jev_oracle · dispatch · kanban]
            SKILLS[skills/<br/>chief-of-staff · inbox-triage · ronde-audit]
            CHANNELS[channels/<br/>telegram · slack]
            CONN[connections/<br/>notion · linear · github]
            SCHED[schedules/<br/>daily Chief-of-Staff brief]
            subgraph SUBAGENTS["subagents/"]
                DJIN_SA[djin/]
                BLOBBIES_SA[blobbies/]
                WEBRNDS_SA[webrnds/]
            end
        end
        VER[(Vercel Functions<br/>+ Workflows<br/>+ Sandbox<br/>+ Connect<br/>+ Observability)]
    end

    subgraph LOCAL["💻 LOKAAL (Mac mini)"]
        direction TB
        subgraph HERMES_LOCAL["Hermes CLI (Nous v0.20.5)"]
            H_PROF[profiles/<br/>djin · blobbies · webrnds · sales]
            H_KANBAN[kanban<br/>SQLite-backed]
            H_APPR[approvals<br/>side-effecting gated]
            H_PEER[peer<br/>cross-machine DMs]
            H_CLAW[claw<br/>OpenClaw migratie]
        end

        subgraph BLOBBIES_LOCAL["blobbies (Tauri app)"]
            B_TAURI[Tauri 2.11.5]
            B_Q3[Q3 dispatch]
            B_TINFOIL[Tinfoil-CSP]
            B_OLLAMA[Ollama-loopback]
            B_SANDBOX[shell-sandbox]
        end

        subgraph FUTURE["Toekomstige runtimes"]
            R_A[Runtime A<br/>bv. research-bot]
            R_B[Runtime B<br/>bv. content-bot]
            R_C[Runtime C<br/>...]
        end
    end

    subgraph DJINHQ["🖥️ DJINLABS HQ (lokaal mission-control dashboard)"]
        direction TB
        DJIN_WEB[Next.js 16 + React 19 + Tailwind v4]
        DJIN_PRISMA[(Prisma + Postgres<br/>message bus)]
        DJIN_TAURI[Tauri desktop wrapper]
        DJIN_BRIDGE[hermes-bridge<br/>poller + state mirror]

        subgraph DJIN_VIEWS["Views (per runtime)"]
            V_HERMES[Hermes activity feed]
            V_BLOBBIES[blobbies status panel]
            V_FUTURE[Toekomstige runtime panels]
            V_APPR[Approval inbox (unified)]
            V_BRIEF[Chief-of-Staff brief]
            V_KANBAN[Kanban view (cross-runtime)]
            V_AUDIT[Audit-spoor (unified logs)]
        end
    end

    subgraph CANON["📜 CANONIEKE BRONNEN (Markdown in git)"]
        COS_DIR[djinlabs/_internal/experimenten/cos/<br/>CONTEXT.md · wayfinder-map.md<br/>architecture-design.md · tickets/ · research/]
        SHARED[_shared/<br/>jev-policy-canon.md V1.5<br/>sync-discipline-canon.md<br/>agent-discipline-canon.md<br/>...]
        DECISIONS[decisions.md<br/>Ronde 14 t/m 18 LOCKED<br/>Ronde 19+ incoming]
        WEBRNDS_RES[research/<br/>webrnds-profile · codavo · jev-* · blobbies-*]
    end

    subgraph JEV["🧠 JEV (TypeSafe AI policy-oracle)"]
        JEV_API[api.typesafe.ai<br/>policy-verdict API]
        JEV_KEY[(jev-test.env<br/>mode 0600)]
    end

    %% Founder → Eve
    TG -->|messages| CHANNELS
    WA -.->|future| CHANNELS
    SL -->|future| CHANNELS
    WEB -->|future| CHANNELS

    %% Eve intern
    INST --> TOOLS
    INST --> SKILLS
    INST --> SUBAGENTS
    INST --> CHANNELS
    INST --> CONN
    INST --> SCHED
    SUBAGENTS -->|delegate via dispatch| TOOLS

    %% Eve runtime
    COSAGENT --> VER

    %% Eve → Hermes (via dispatch tool)
    TOOLS -->|hermes peer DM<br/>kanban assign| HERMES_LOCAL
    DJIN_SA -->|delegate| HERMES_LOCAL
    WEBRNDS_SA -->|delegate| HERMES_LOCAL

    %% Eve → blobbies
    TOOLS -.->|future: peer DM| BLOBBIES_LOCAL
    BLOBBIES_SA -.->|future: peer DM| BLOBBIES_LOCAL

    %% Eve → Jev
    TOOLS -->|policy verdict<br/>before dispatch| JEV_API
    JEV_API --> JEV_KEY

    %% Hermes intern
    H_PROF --> H_KANBAN
    H_PROF --> H_APPR
    H_PROF --> H_PEER
    H_PROF --> H_CLAW

    %% Hermes → blobbies (future)
    H_PEER -.->|future| BLOBBIES_LOCAL

    %% Hermes → toekomstige runtimes
    H_PEER -.->|future| R_A
    H_PEER -.->|future| R_B
    H_PEER -.->|future| R_C

    %% All runtimes → DjinLabs HQ (state mirror)
    HERMES_LOCAL -->|bridge poller<br/>kanban + cron + health| DJIN_BRIDGE
    BLOBBIES_LOCAL -.->|future: state mirror| DJIN_BRIDGE
    R_A -.->|future| DJIN_BRIDGE
    R_B -.->|future| DJIN_BRIDGE
    R_C -.->|future| DJIN_BRIDGE

    %% DjinLabs HQ intern
    DJIN_BRIDGE --> DJIN_PRISMA
    DJIN_WEB --> DJIN_PRISMA
    DJIN_WEB --> DJIN_TAURI
    DJIN_PRISMA --> DJIN_VIEWS

    %% DjinLabs HQ → Eve (unified approval)
    DJIN_VIEWS -->|approval gate| COSAGENT

    %% Canonieke bronnen → Eve
    COS_DIR -.->|read-only<br/>bij agent startup| INST
    SHARED -.->|read-only| INST
    DECISIONS -.->|read-only| INST
    WEBRNDS_RES -.->|read-only| INST

    %% Canonieke bronnen → DjinLabs HQ
    COS_DIR -.->|read-only<br/>mission control context| DJIN_WEB
    DECISIONS -.->|read-only| DJIN_WEB

    %% Styling
    classDef cloud fill:#e1f5ff,stroke:#0277bd,stroke-width:2px,color:#000
    classDef local fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef canon fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px,color:#000
    classDef jev fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#000
    classDef djinhq fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#000
    classDef founder fill:#fff9c4,stroke:#f57f17,stroke-width:2px,color:#000

    class CLOUD,COSAGENT,VER cloud
    class LOCAL,HERMES_LOCAL,BLOBBIES_LOCAL,FUTURE local
    class CANON,COS_DIR,SHARED,DECISIONS,WEBRNDS_RES canon
    class JEV,JEV_API,JEV_KEY jev
    class DJINHQ,DJIN_WEB,DJIN_PRISMA,DJIN_TAURI,DJIN_BRIDGE,DJIN_VIEWS djinhq
    class FOUNDER,TG,WA,SL,WEB founder
```

## Hoe de lijnen lopen (uitleg per stroom)

### 1. Founder → COS (primaire interactie)

```
founder (Telegram) → Vercel Eve (COS) channels/telegram.ts → agent/instructions.md dispatcht
```

**Founder praat alleen met COS.** Andere agents worden door COS aangestuurd, niet direct door founder benaderd (T-01 definitie canon).

### 2. COS → Jev (policy-check voor elke dispatch)

```
COS dispatch tool → Jev API (api.typesafe.ai) → verdict (allow/reject/ask_human/research_capped)
```

**Voor ELKE dispatch** naar een agent: COS checkt eerst Jev. Ronde 17 V1.5 canoniek.

### 3. COS → Hermes (lokale uitvoering)

```
COS dispatch → Hermes CLI (hermes peer dm + hermes kanban assign) → profile uitvoert
```

**Hermes CLI** is de lokale runtime. Hermes profiles = `djin`, `blobbies`, `webrnds`, `sales`. Hermes heeft Bot Mode (group rooms), kanban (taakverdeling), approvals (side-effecting gated), peer DMs (cross-machine).

### 4. COS → blobbies (toekomstig)

```
COS dispatch → blobbies (Tauri app) → lokale uitvoering via Q3 + Tinfoil-CSP + Ollama
```

**Vereist blobbies Hermes-koppeling.** Nu nog niet, maar Q3 + Tinfoil-CSP boundary maakt het mogelijk.

### 5. Hermes → DjinLabs HQ (state mirror)

```
Hermes (kanban/cron/health/memory) → hermes-bridge poller → Postgres → DjinLabs HQ UI
```

**DjinLabs HQ is read-only view** op Hermes. Hermes is bron van waarheid; DjinLabs HQ spiegelt.

### 6. Alle runtimes → DjinLabs HQ (toekomstig)

```
Hermes + blobbies + Runtime A/B/C → bridge → Postgres → DjinLabs HQ unified view
```

**DjinLabs HQ is mission-control over alle runtimes**, niet alleen Hermes. Daarom is de fork van Sharbel's Hermy HQ de moeite waard — Sharbel's "Hermes-agnostic bridge" kan uitgebreid worden naar andere runtimes.

### 7. DjinLabs HQ → COS (approval gate unified)

```
DjinLabs HQ approval inbox → COS (chat continuation) → founder approves → COS dispatch
```

**Approval-gated acts** worden unificatie via DjinLabs HQ getoond, maar COS blijft de dispatcher. Founder kan via Telegram of via DjinLabs HQ approven.

### 8. Canonieke bronnen (read-only)

```
cos/ folder, _shared/, decisions.md, research/ → read-only bij agent startup
```

**Canonieke files zijn ALLEEN leesbaar**, nooit schrijfbaar door agents. Schrijven alleen via Ronde-traject in `decisions.md` (Ronde 16 sync-discipline).

## Wat deze architectuur bereikt

| Eigenschap | Hoe |
|---|---|
| **Agent = folder = ICM** | Vercel Eve native (`agent/` = folder, subagents = folders) |
| **Multi-runtime visibility** | DjinLabs HQ brug over Hermes + blobbies + toekomstige runtimes |
| **Canonieke discipline** | Read-only toegang tot canonieke files, schrijven alleen via `decisions.md` |
| **Jev-integratie** | Custom tool in Vercel Eve + via Hermes peer DM |
| **Sharbel's UX-patronen behouden** | DjinLabs HQ = fork van Hermy HQ, dus alle Hermy UX (mission control, approval inbox, brief) |
| **Toekomstige runtimes** | DjinLabs HQ panels toevoegen voor nieuwe agents, net zoals Hermy HQ Hermes panels heeft |

## Open vragen / volgende stappen

1. **DjinLabs HQ fork-discipline** — Hoe ver gaan we met Sharbel's Hermy HQ upstreamen? Eigen release-cadans?
2. **Hermes ↔ Eve brug** — Heeft Eve native Hermes-koppeling of moeten we die schrijven?
3. **blobbies ↔ Hermes koppeling** — Wanneer? Vereist Tauri-app-uitbreiding.
4. **Ronde 19+ canoniek-traject** — Vercel Eve als COS-runtime kanoniek vastleggen? Of alleen DjinLabs HQ?

## Bestanden

- `research/vercel-eve-cos-runtime-research.md` — research-note over Vercel Eve
- `research/sharbel-hermy-hq-cos-adapter-research.md` — research-note over Sharbel's stack (pauzeren, niet actief)
- `sharbel-hermy-hq-adapter-design.md` — design-doc (wordt geüpdatet naar multi-runtime-aanpak)
- `architecture-design.md` — bestaande COS-architectuur (design-only)

## Bron-traceerbaarheid

- Vercel Eve: https://vercel.com/eve (gelezen 2026-09-23)
- Sharbel's Hermy HQ: https://github.com/sharbelxyz/hermes-agent-mission-control (gelezen 2026-09-23)
- Hermes CLI: `hermes --help` lokaal (geverifieerd 2026-09-23)
- blobbies: `djinlabs/system/design/notes/grill-me-blobbies-2026-09-20.md` (gelezen)
- Jev: `_shared/jev-policy-canon.md` (Ronde 17 V1.5)
- T-01 + T-02: `cos/tickets/` (gesloten)
