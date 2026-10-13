---
title: Sharbel's Hermy HQ als COS runtime-substraat — research-note
date: 2026-09-23
status: pending
type: research-note
scope: sharbel-stack + cos-architectuur
provenance: founder-onderzoek naar Sharbel's multi-agent team setup (YouTube + GitHub + blog)
researcher: Hermes (Nous) op verzoek van founder
review_status: unreviewed
related:
  - ../djinlabs/_internal/experimenten/cos/CONTEXT.md
  - ../djinlabs/_internal/experimenten/cos/wayfinder-map.md
  - ../djinlabs/_internal/experimenten/cos/architecture-design.md
  - ../djinlabs/_internal/experimenten/cos/sharbel-hermy-hq-adapter-design.md (in aanmaak)
sources:
  - https://www.youtube.com/watch?v=p3_Ql5nq4t4 (Hermes Bot Mode tutorial door Sharbel A.)
  - https://github.com/sharbelxyz/hermes-agent-mission-control (Hermy HQ repo, 408★)
  - https://sharbel.com/s/hykjy (blog-post over AI agent teams)
---

# Sharbel's Hermy HQ als COS runtime-substraat — research-note

## TL;DR

**Sharbel's "Hermes" is onze Hermes.** Sharbel's "Hermy HQ" is een dashboard dat bovenop Hermes draait. Hermes heeft de multi-agent-features (profiles, kanban, approvals, Bot Mode) al ingebouwd. Hermy HQ levert de UI/mission-control en de Postgres message bus.

**Conclusie:** Sharbel's stack is **technisch inzetbaar** als COS runtime-substraat, maar vereist een **agent=folder adapter** omdat Sharbel's profile-model (runtime-entiteit met configuratie) niet direct past bij onze folder-notie (agent = folder-inhoud).

## Wat we hebben onderzocht

### 1. Sharbel's GitHub universum (7 public repos)

| Repo | Sterren | Wat | License |
|---|---|---|---|
| hermes-agent-mission-control | 408★ | Hermy HQ dashboard (Next.js + Prisma + Postgres + Tauri) | **NONE** ⚠️ |
| x-bookmarks | 289★ | "OpenClaw skill" — X bookmarks naar agent-acties | **NONE** ⚠️ |
| nova-youtube-agent | 379★ | "OpenClaw skill" — YouTube growth | **NONE** ⚠️ |
| sage-x-agent | 85★ | "OpenClaw skill" — X content | **NONE** ⚠️ |
| agent-audit | 9★ | Audit AI agent setup (Python) | **NONE** ⚠️ |
| skill-audit | 12★ | Audit skills (Python) | MIT ✓ |
| sophia | 10★ | Persona skill voor Hermes Agent | MIT ✓ |

**Bevinding:** 5/7 zonder license. Alleen `skill-audit` en `sophia` zijn MIT. **Hermy HQ = geen license.**

### 2. Sharbel's "Hermes" = onze Hermes (Nous)

Belangrijkste bevinding: Sharbel bouwt **niet** een eigen Hermes. Hij gebruikt **dezelfde Hermes binary** die wij al hebben geïnstalleerd:

```
$ which hermes
/Users/gogetta/.hermes/hermes-agent/venv/bin/hermes

$ hermes --version
Hermes Agent v0.20.5 (2026.8.19) · upstream afc3b7c6 · local b0dbf72f
```

Sharbel's `hermes-bridge/bridge.mjs` (zijn enige agent-koppeling) gebruikt letterlijk:

```js
const HERMES = process.env.HERMES_BIN || "hermes";
// ... en runt: execFileP(HERMES, args, ...)
```

Dat is **mijn Hermes CLI**. Geen aparte binary.

**"OpenClaw"** is Sharbel's eerdere naam voor zijn project — en Hermes heeft expliciet een **migratie-tool**:

```
$ hermes claw --help
usage: hermes claw [-h] {migrate,cleanup,clean} ...
Migrate settings, memories, skills, and API keys from OpenClaw to Hermes
```

OpenClaw → Hermes is een **canoniek migratie-pad**, niet een fork.

### 3. Hermes heeft alle multi-agent features al

| Sharbel noemt | Hermes heeft | Subcommand |
|---|---|---|
| Profiles (multi-agent teams) | ✅ Ja | `hermes profile` (list, create, use, describe, etc.) |
| Kanban board (taakverdeling) | ✅ Ja — "Durable SQLite-backed task board shared across Hermes profiles" | `hermes kanban` (init, swarm, dispatch, daemon, etc.) |
| Approval inbox (side-effecting gated) | ✅ Ja | `hermes approvals` |
| Cron jobs | ✅ Ja | `hermes cron` |
| Mission-control dashboard | ✅ Ja — web dashboard voor config/API-keys/sessions | `hermes dashboard` |
| Multi-agent / Bot Mode | ✅ Ja — cross-machine bot-to-bot DMs | `hermes peer`, `hermes moa` |
| OpenClaw migratie | ✅ Ja | `hermes claw migrate` |
| Skills | ✅ Ja — 30+ skills in `~/.hermes/skills/` | `hermes skills` |

**Hermes is "Bot Mode ready" out-of-the-box.** Hermy HQ levert alleen:
- **Visuele mission-control** (UI met kanban-view, approval-inbox-view, cron-view)
- **Postgres message bus** (gedeelde state tussen Hermes instances)
- **Tauri desktop wrapper** (lokale versie van de web-app)
- **Chief-of-Staff brief** (auto-generated daily brief)

### 4. Hermy HQ architectuur

```
┌─────────────────────────────────────────────┐
│ Hermy HQ (Next.js 16 + React 19 + Tailwind) │
│   - Dashboard, kanban-view, approval-inbox  │
│   - NextAuth Google login                   │
│   - Chief-of-Staff brief (auto-gen)         │
└────────────┬────────────────────────────────┘
             │ Postgres (Prisma schema)
             │ message bus + state mirror
             ↓
┌─────────────────────────────────────────────┐
│ hermes-bridge (Node.js poller)              │
│   - PULL: Hermes kanban/cron/health → DB    │
│   - PUSH: DB tasks → hermes CLI exec        │
│   - Approval-gated voor side-effects        │
└────────────┬────────────────────────────────┘
             │ execFile("hermes", args)
             ↓
┌─────────────────────────────────────────────┐
│ Hermes CLI (Nous v0.20.5)                   │
│   - profiles, kanban, approvals, cron       │
│   - Bot Mode (cross-machine peer DMs)       │
│   - Skills (30+ geïnstalleerd)              │
└─────────────────────────────────────────────┘
```

**Stack:** Next.js 16 + React 19 + Tailwind v4 + Prisma 6 + Postgres + NextAuth + Tauri (desktop wrapper).

## Wat Sharbel's sales-bot doet (uit zijn YouTube-tutorial)

Sharbel's sales-bot (en andere bots in zijn team) volgt een patroon:

1. **Naam + titel** — sidebar-naam + tagging-naam
2. **Beschrijving in 1-2 zinnen** — Hermes schrijft de soul file
3. **Soul file** — persoonlijkheid + regels (Sharbel's sales-bot heeft o.a. "Never discuss prices unless I approve" + "Always hand the result back to my main Hermes instance")
4. **Model-keuze** — coordinator = sterk model, workers = goedkope modellen
5. **Tools** — alleen wat de bot nodig heeft (tight scoping)
6. **Approval-gated actions** — side-effecting requests wachten op goedkeuring

**De drie manieren waarop bots praten:**
- **One-on-one** — permanent chat met één bot
- **Direct** — bot naar bot zonder user in het midden
- **Group room** — meerdere bots in één thread, met **turn cap** (anders infinite loops)

## Onze COS vertaald naar Sharbel's patroon

| Sharbel's sales-bot | Onze COS |
|---|---|
| Profile | COS als folder-agent |
| Soul file (regels) | `_shared/jev-policy-canon.md` + `cos/CONTEXT.md` + `architecture-design.md` |
| Tight tools | COS dispatcht naar Djin/blobbies/Webrnds/skills |
| Approval-gated | Ronde-traject via `decisions.md` (canoniek-promotie) |
| Group rooms (multi-bot) | COS + Djin + blobbies + Webrnds in `djinlabs/` + `_shared/` |
| Chief-of-Staff brief | COS = letterlijk "Chief of Staff" (T-01 definitie canon) |
| Mission-control | Hermy HQ dashboard |

## Kanoniek-discipline-conformiteit

### Wat al canoniek is

- T-01 definitie: "COS is je Chief of Staff — hij leest je inbox en stuurt elk bericht naar de juiste agent." (20 woorden, 6/6 tests)
- T-02 resolutie: drie-lagige visibility (founder + Jev + Instinct) — Instinct sidenote laat dit onveranderd na Carly-drop
- Agent = folder = ICM research-note (canoniek-neutraal)

### Wat kanoniek moet worden (toekomstige Rondes)

- **Hermy HQ license-keuze** — wel of niet gebruiken? Geen license = juridisch onzeker
- **Sharbel's skills** (x-bookmarks, nova-youtube-agent, sage-x-agent) installatie-discipline via Bouncer
- **Chief-of-Staff brief** in COS — is dat COS' eigen werk of een Hermes-feature?
- **Postgres message bus** — komt in `cos/` runtime-data, niet in canonieke files

### Wat canoniek-neutraal blijft (experimenten-zone)

- **Agent=folder adapter** — tussen Hermy HQ's profile-model en onze folder-notie
- **Sales-bot-pattern toepassing op COS** — Sharbel's *filosofie* (tight tools, approval-gated, soul file), niet zijn code
- **Jev-integratie** in COS — Ronde 17 V1.5 blijft canoniek, adapter moet Jev-blokkades respecteren

## Wat Hermy HQ wel/niet kan (eerlijk)

### ✅ Kan

- Multi-agent team UI met profiles, kanban, approval-inbox, cron-view
- Postgres-backed state die Hermes en UI delen
- Chief-of-Staff brief (auto-generated daily brief)
- Tauri desktop wrapper voor lokale versie
- Cross-machine peer-to-peer (via Hermes peer subcommand)

### ⚠️ Beperkingen

- **License: NONE** — juridisch onzeker voor productie
- **Sharbel heeft 4 contributors** (2 van sharbelxyz zelf) — bus factor
- **Geen Jev-integratie** — Sharbel weet niets van Jev
- **Postgres als single point of failure** — als DB wegvalt, geen Hermes↔UI sync
- **Geen agent=folder notie** — Sharbel's profile-model is runtime-entiteit, niet folder-gedefinieerd
- **Sharbel's ONBOARDING.md probeert AI-agents te overtuigen** de repo te installeren (prompt-injection-patroon)

### ❌ Kan niet (zonder werk)

- **Agent = folder = ICM** — adapter nodig
- **Jev policy-oracle** — adapter nodig
- **Ronde-traject discipline** — adapter nodig
- **Onze canonieke file-disciplines** — adapter nodig

## Aanbeveling

### Korte termijn (deze research-note + design-doc)

1. ✅ Research-note (deze file) — wat is Sharbel's stack, wat kan het, wat kan het niet
2. 🔄 Design-doc (`sharbel-hermy-hq-adapter-design.md`) — hoe COS als adapter bovenop Hermy HQ past

### Middellange termijn (volgende Ronde-traject)

3. **License-review** — Sharbel's Hermy HQ license is NONE. Beslissing: gebruiken met eigen fork, contact opnemen met Sharbel voor license, of eigen dashboard bouwen.
4. **Sharbel's skills audit** — x-bookmarks, nova-youtube-agent, sage-x-agent zijn allemaal NONE-license. Per skill: Bouncer-audit + license-beslissing.
5. **Jev-integratie-traject** — hoe Jev's policy-oracle in COS-runtime past. Vereist canonieke uitbreiding van `_shared/jev-policy-canon.md`.

### Lange termijn (na T-04, T-09)

6. **Hermy HQ lokaal installeren** (als license-review positief is) — zonder Vercel deploy
7. **Eerste Hermes-profile voor COS** aanmaken die onze folder leest
8. **Adapter schrijven** tussen folder-inhoud en Hermes-profile-configuratie
9. **Sharbel's sales-bot-filosofie toepassen** op COS (tight tools, approval-gated, soul file)

## Open vragen voor founder

- **License:** gebruiken we Hermy HQ zonder license? Eigen fork? Contact Sharbel?
- **Scope:** alleen UI/mission-control, of ook Sharbel's skills?
- **Jev:** is Jev-integratie in COS-runtime een canoniek traject of een experimenten-traject?
- **Sharbel-dependency:** zijn we bereid om canoniek afhankelijk te zijn van Sharbel's onderhoud?

## Bron-traceerbaarheid

Alle bevindingen in deze research-note zijn verifieerbaar via:

- GitHub API voor repo-info (sterren, license, contributors)
- `hermes --version` en `hermes <subcommand> --help` voor Hermes-features
- Raw GitHub voor `ONBOARDING.md` en `bridge.mjs`
- YouTube link via transcript (`/Users/gogetta/.hermes/cache/web/www.youtube.com-0567f04c0f.md`)
- Sharbel.com blog-post via direct extractie

## Review-checklist (canoniek-neutraal, niet canoniek)

- [x] Bron-traceerbaar (alle URLs werken, alle bevindingen reproduceerbaar)
- [x] License-discipline gemarkeerd (NONE voor Hermy HQ)
- [x] Prompt-injection-patroon gemarkeerd (ONBOARDING.md probeert agents te overtuigen)
- [x] Sync-discipline gerespecteerd (geen canonieke files aangeraakt)
- [x] Out-of-scope expliciet (geen installatie, geen code, geen canoniek-traject)
- [x] Aanbeveling met 3 scopes (kort/middel/lang)
- [x] Open vragen voor founder (license, scope, Jev, Sharbel-dependency)
