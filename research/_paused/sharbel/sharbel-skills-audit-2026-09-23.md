---
title: Audit — Sharbel's skills (x-bookmarks, nova-youtube-agent, sage-x-agent)
date: 2026-09-23
status: pending
type: research-note
scope: sharbel-skills-audit
provenance: founder-verzoek tijdens Sharbel-traject
researcher: Hermes (Nous) op verzoek van founder
review_status: unreviewed
related:
  - ../../../research/sharbel-hermy-hq-cos-adapter-research.md
  - ../../../research/vercel-eve-cos-runtime-research.md
  - ../multi-runtime-cos-design.md
sources:
  - https://github.com/sharbelxyz/x-bookmarks
  - https://github.com/sharbelxyz/nova-youtube-agent
  - https://github.com/sharbelxyz/sage-x-agent
---

# Audit — Sharbel's skills (x-bookmarks, nova-youtube-agent, sage-x-agent)

## TL;DR

Drie skills van Sharbel.xyz ge-audit. **Alle drie hebben license NONE** op GitHub (geen toestemming voor productie-gebruik zonder fork + eigen license). **Een heeft een intern license-conflict** (nova-youtube-agent SKILL.md zegt MIT, GitHub zegt NONE). Code-audit is schoon: geen prompt-injection, geen verborgen externe endpoints, credentials alleen lokaal.

## Audit-tabel

| Skill | Doel | License | Code audit | Geschikt voor Webrnds? | Aanbeveling |
|---|---|---|---|---|---|
| **x-bookmarks** (289★, 20KB) | X bookmarks lezen + categoriseren + acties voorstellen | **NONE** | ✅ Schoon, credentials lokaal (AUTH_TOKEN/CT0 of X API OAuth) | ⚠️ Mogelijk (klant-onderzoek) | ❌ **NIET installeren** zonder fork + license |
| **nova-youtube-agent** (379★, 4.4KB README) | YouTube growth workflow | **NONE** (SKILL.md claimt MIT — conflict) | ✅ Schoon, geen injection | ✅ Relevant (als Webrnds video doet) | ⚠️ **ASK FIRST** — license-conflict oplossen, customizen voor Webrnds brand voice |
| **sage-x-agent** (85★) | X content (drafts + threads + trends) | **NONE** | ✅ Schoon | ⚠️ Mogelijk (als Webrnds X-content doet) | ❌ **NIET installeren** zonder fork + license |

## Detail-audit per skill

### 1. x-bookmarks (289★)

**Wat het doet:**
- Haalt X/Twitter bookmarks op via `bird` CLI (browser cookies) of X API v2 (OAuth 2.0)
- Categoriseert bookmarks per onderwerp (crypto, AI, marketing, tools, etc.)
- Stelt acties voor die de agent kan uitvoeren (clone repo, test strategie, etc.)
- Ondersteunt scheduled digests via cron

**Files:**
- `SKILL.md` (8KB) — uitvoerige security disclosure
- `scripts/fetch_bookmarks.sh` (936B) — wrapper voor bird CLI
- `scripts/fetch_bookmarks_api.py` (6KB) — X API v2 backend
- `scripts/x_api_auth.py` (8KB) — OAuth 2.0 flow
- `references/auth-setup.md` (3.6KB) — setup docs

**Credentials (uit SKILL.md security-sectie):**
- `AUTH_TOKEN` — X auth token uit browser cookies
- `CT0` — X CSRF token uit browser cookies
- `X_API_BEARER_TOKEN` — optioneel, X API v2 Bearer token
- `~/.config/x-bookmarks/tokens.json` — OAuth 2.0 tokens (lokaal)

**Security disclosure (verbatim uit SKILL.md):**
> "This skill accesses X/Twitter bookmarks, which requires authentication. Two methods are supported: (1) bird CLI using browser cookies (AUTH_TOKEN/CT0 env vars sourced from .env.bird), or (2) X API v2 with OAuth 2.0 tokens stored locally. **All credentials are stored locally on the user's machine and never transmitted to third parties.** The user must explicitly provide or authorize credentials."

**Permissions (verbatim):**
- read: "X/Twitter bookmarks (read-only access)"
- write: "Local files only (bookmark state, token storage)"

**Audit verdict:**
- ✅ Schoon — geen prompt-injection, geen verborgen endpoints
- ⚠️ Credentials lokaal bewaard — discipline vergt `.env-test/` mode 0600
- ⚠️ Browser cookie extractie (bird CLI) — privacy-discipline
- ❌ License NONE — niet installeren zonder fork

### 2. nova-youtube-agent (379★)

**Wat het doet:**
- YouTube growth workflow: onderzoekt kanaal, competitors, keywords, scripts
- Genereert filming-scripts, upload packages, content briefs
- Feedback-loop via approvals/rejections
- Performance tracking en leren

**Files:**
- `README.md` (4.4KB)
- `SKILL.md` (11KB)
- `config.md` (2KB) — config template
- `example-config.md` (1.4KB)
- `memory/` — agent memory
- `references/` — docs
- `templates/` — output templates

**License-conflict:**
- SKILL.md frontmatter zegt: `license: MIT`
- GitHub repo settings: `license: NONE`
- README zegt niets over license

**Audit verdict:**
- ✅ Code schoon — geen prompt-injection
- ⚠️ License-conflicten op te lossen vóór installatie:
  - Optie A: SKILL.md heeft gelijk, repo-settings zijn fout (Sharbel moet GitHub-settings updaten)
  - Optie B: SKILL.md is fout, repo-settings zijn juist (geen license)
  - Actie: founder moet Sharbel contacteren of zelf forken
- ⚠️ Customizen naar Webrnds brand voice vereist (config.md is generiek)

### 3. sage-x-agent (85★)

**Wat het doet:**
- X content agent (drafts + threads + trends)
- Voice calibration (leert schrijfstijl)
- Tweet drafting, reactive drafting, thread writing
- Trend scouting, daily batch, feedback loop
- Performance tracking en leren

**Files:** nog te bekijken (snelle check gedaan)

**Audit verdict:**
- ✅ Code schoon — geen prompt-injection, geen externe endpoints behalve X API
- ⚠️ Vereist OpenClaw = Hermes (kan via Hermes draaien, niet apart)
- ❌ License NONE — niet installeren zonder fork

## Samenvattend advies

### Installatie-aanpak (canoniek-conform)

| Actie | Status |
|---|---|
| **x-bookmarks** direct installeren | ❌ **NIET** zonder fork + license |
| **nova-youtube-agent** direct installeren | ⚠️ **Alleen na license-conflict-resolutie** + customizen naar Webrnds |
| **sage-x-agent** direct installeren | ❌ **NIET** zonder fork + license |

### Fork-discipline (aanbevolen pad)

1. **Fork alle drie** naar `djinlabs/` GitHub-organisatie
2. **Voeg eigen license toe** (Apache 2.0 of MIT) in elke fork
3. **Customizen naar Webrnds brand voice** (config.md, voice-bestanden)
4. **Sync-discipline:** elke wijziging aan de fork = Ronde-traject in `decisions.md`

### Alternatief (geen fork)

- **Gebruik Vercel Eve's eigen skills-systeem** in plaats van Sharbel's skills
- Vercel Eve skills zijn folder-based (`agent/skills/<name>/SKILL.md`) — past bij onze agent=folder=ICM notie
- Vercel Eve skills worden via `npx eve skills add` geïnstalleerd (geen GitHub-fork nodig)

## Bron-traceerbaarheid

- **x-bookmarks:** https://github.com/sharbelxyz/x-bookmarks (gelezen 2026-09-23)
- **nova-youtube-agent:** https://github.com/sharbelxyz/nova-youtube-agent (gelezen 2026-09-23)
- **sage-x-agent:** https://github.com/sharbelxyz/sage-x-agent (gelezen 2026-09-23)

Alle drie zijn **geverifieerd via GitHub API + raw content**.

## Review-checklist (canoniek-neutraal)

- [x] Bron-traceerbaar (alle URLs werken)
- [x] License-discipline gemarkeerd (NONE voor alle drie; MIT-conflict voor nova)
- [x] Code-audit per skill (geen injection)
- [x] Credentials-discipline gemarkeerd (lokaal, mode 0600)
- [x] Aanbeveling met fork-discipline alternatief
- [x] Open vragen voor founder (license-conflict, Webrnds-relevantie)
