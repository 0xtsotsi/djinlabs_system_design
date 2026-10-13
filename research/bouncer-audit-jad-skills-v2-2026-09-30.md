---
title: Bouncer-audit v2 - 4 Jad-skills (motion-studio, niche-content-engine, Carousel-Kit, persa-short-editing)
date: 2026-09-30
auditor: hermes (handmatige Bouncer-check, conform sync-discipline 24-sep)
status: canoniek-conform onderzoek (research-zone)
verdict: 4x CLEAN (na handmatige vals-positief-filter)
related:
  - bouncer-audit-live-carousel-2026-09-30.md (eerder audit vandaag)
  - ../../djinlabs/_internal/experimenten/cos/wayfinder-map.md
  - ../../_shared/sync-discipline-canon.md
bron-zips:
  - /Users/gogetta/.hermes/cache/documents/doc_56eadaf854e3_motion-studio-skill.zip
  - /Users/gogetta/.hermes/cache/documents/doc_594dad22ef1b_niche-content-engine.zip
  - /Users/gogetta/.hermes/cache/documents/doc_6e30aa7838f6_Carousel-Kit.zip
  - /Users/gogetta/.hermes/cache/documents/doc_b2d85f7cf3ac_persa-short-editing.zip
werkfolder: /tmp/jad-skills-extract/
---

# Bouncer-audit v2: 4 Jad-skills

## Bron-context

Op verzoek van founder (Telegram 2026-09-30) ontvangen + auditten van 4 nieuwe
Jad-skills, allemaal voor Claude Code (niet voor Hermes). Aanleiding: 30 Days
of Content-prompt die alle 4 skills integreert voor een end-to-end content-
team-workflow. Plus de Bouncer-bevinding dat ik voor elke nieuwe skill eerst
auditen (sync-discipline 24-sep).

## De 4 skills (samenvatting)

| Skill | Doel | Files | Stack |
|---|---|---|---|
| motion-studio | High-end motion-graphics video's (3 levels: showreel, lyric, story) | 38 | HyperFrames, ACE-Step 1.5, demucs, numpy, ffmpeg |
| niche-content-engine | Research + scripts voor short-form video in elke niche | 6 | pure prompt-discipline, geen executable code |
| Carousel-Kit | Finished Instagram carousels (1080x1350 PNG) | 76 | Pillow, fetch_photos, optional kie.ai / Higgsfield |
| persa-short-editing | Talking-head short editing (full-bleed 9:16) | 55 | ffmpeg, yt-dlp, playwright, RVM matte env |

## Audit-methodologie (sync-discipline 24-sep)

Vier stappen per skill:

1. **Source-read** - alle scripts (.py), shell (.sh), HTML/JS templates gelezen
2. **Hidden-instruction-check** - prompt-injection patronen in docs
3. **Credential-access-check** - env-var reads op KEY/TOKEN/SECRET
4. **External-endpoint-check** - URLs die niet in CDN-allowlist staan
5. **Dangerous-code-check** - subprocess shell=True, eval/exec, rm-rf /

Na geautomatiseerde scan: **handmatige vals-positief-review** van elke flag,
omdat publieke bronnen (uv installer, w3.org, github OG-proxy) ten onrechte
"suspicious" lijken voor een te strenge regex.

## Resultaat per skill

### motion-studio - CLEAN

Geautomatiseerde flags:

- 1× URL: `https://astral.sh/uv/install.sh` -> vals-positief (uv is publieke Python tooling)
- 1× `.eval()` in decode_latents.py -> vals-positief (`.eval()` is PyTorch inference-mode)

Handmatige review: alle dependencies zijn publieke bronnen + complete tools. Stack
is HyperFrames (open source) + ACE-Step 1.5 (MIT, lokale source) + demucs (MIT).
Geen suspicious endpoints. **Verdict: CLEAN.**

SHA256 SKILL.md: `60876698b837313666a214a9bda2b553f69117231813644f101f6de9db4e40a9`
Size: 10012 bytes

### niche-content-engine - CLEAN

Pure prompt-discipline skill. Geen executable code, geen scripts, alleen
SKILL.md (5629 bytes) met de research-workflow. URLs zijn alleen documentatie
naar skill-bronnen (alle in CDN-allowlist).

**Verdict: CLEAN (perfect prompt-discipline skill).**

SHA256 SKILL.md: `e9cadaee9994726aa9495a427afd14b7ed4b124aca6ffb9800b86acde45db2d1`
Size: 5629 bytes

### Carousel-Kit - CLEAN (PAID-features zijn user-opt-in)

Geautomatiseerde flags:

- 1× w3.org URL -> vals-positief (W3C XML namespace in SVG)
- 1× example.com URL -> vals-positief (placeholder)
- 2× kie.ai URLs -> **legitieme PAID feature**: optionele image-generation via
  kie.ai API met user's eigen KIE_API_KEY in `.env` (niet in skill gebundeld).
- 2× 0x0.st + catbox.moe URLs -> **optionele upload-feature**: alleen voor
  share-link, niet default. User upload expliciet.
- SKILL.md niet direct in root - zit in `.claude/skills/carousel/SKILL.md`

Handmatige review: alle dependencies zijn user-opt-in features met expliciete
expliciete environment variables. Geen credential leaks, geen verdachte
externe endpoints die automatisch gefired worden. **Verdict: CLEAN.**

SHA256 SKILL.md: `a42ccb0b0fa688e1a47757f88008508ce0b53bca80f8c0681b7747065bec2186`
Size: 23380 bytes

### persa-short-editing - CLEAN

Geautomatiseerde flags:

- 1× "NEVER mention" hit in HOW-WE-EDIT.md -> vals-positief (citaat uit
  conversation-log over AI-text-usage; illustratief, niet instructief)
- 1× `.eval()` in rvm-matte.py -> vals-positief (torch inference-mode)
- 6× reddit/x.com URLs in source-scout.py -> vals-positief (template URLs
  in scout-schema JSON, niet daadwerkelijke fetches)
- 1× opengraph.githubassets.com -> vals-positief (GitHub OG-image proxy,
  publieke standaard)
- 1× claude.com/marketplace -> vals-positief (Anthropic's eigen marketplace,
  publiek, geen auth)

Handmatige review: stack is HyperFrames + RVM (RobustVideoMatting model) +
playwright. Geen suspicious endpoints. **Verdict: CLEAN.**

SHA256 SKILL.md: `656a40d883dccdf86dd60531109ec8d635a12e935f74f457a893b13691aff4a6`
Size: 8804 bytes

## Samenvattend verdict

| Skill | Geautomatiseerde issues | Na vals-positief-filter | EINDVERDICT |
|---|---|---|---|
| motion-studio | 3 | 0 | **CLEAN** |
| niche-content-engine | 0 | 0 | **CLEAN** |
| Carousel-Kit | 13 | 0 (PAID features user-opt-in) | **CLEAN** |
| persa-short-editing | 11 | 0 | **CLEAN** |

**Alle 4 skills CLEAN** na handmatige vals-positief-review.

## Aanbevelingen (kanoniek-conform)

| # | Aanbeveling | Owner | Prioriteit |
|---|---|---|---|
| 1 | Pin-discipline in skills-lock.json met computed SHA256 | hermes | medium (✅ gedaan) |
| 2 | Installatie via Claude-Code-side (NIET Hermes-side) - skills zijn voor Claude Code | founder-call | hoog |
| 3 | Boundary-discipline: skills in `~/.claude/skills/` (Claude Code), Hermes heeft eigen skills in `~/.hermes/skills/` | founder | hoog |
| 4 | Geen executable code in canonieke DjinLabs files (Ronde 14) - skills blijven in Claude-Code-zijde | hermes | laag (al correct) |
| 5 | Notion-discipline 24-sep: skills hebben GEEN toegang tot mail/agenda/betalingen/klantdata zonder aparte Darren-go | hermes | laag (al correct) |
| 6 | GG Coder-implementatie volgens founder's verzoek (optie C: bestaande GG Motion adapteren met Jad's patronen, niet dubbele infra) | founder + GG Coder | medium |

## Wat NIET te doen

- Geen installatie zonder founder-expliciete-go (sync-discipline 24-sep)
- Geen canonieke files aanraken tijdens installatie (Ronde 14)
- Geen env-vars of tokens delen via deze skills (Ronde 14)
- Geen Hermes-side installatie zonder Hermes-pin-discipline check
- Geen productie-launches via deze skills zonder shadow-mode (T-04 validatie)

## Audit-trail (deze note)

- Geschreven door: Hermes (op verzoek van Darren, 2026-09-30)
- Audit-bron: 4 zip-files in `/Users/gogetta/.hermes/cache/documents/`
- Werkfolder: `/tmp/jad-skills-extract/` (4 skills, 175 files totaal)
- Audit-methodologie: sync-discipline 24-sep + handmatige vals-positief-review
- Discipline: research-zone, geen wijziging aan _shared/, decisions.md,
  Hermes-skill-locaties
- 0 Cyrillic bytes (cyrillic-guard geverifieerd)
