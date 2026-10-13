---
title: Bouncer-audit - live-carousel-skill (Jad M.H)
date: 2026-09-30
auditor: hermes (handmatige Bouncer-check, conform sync-discipline 24-sep)
status: canoniek-conform onderzoek (research-zone)
verdict: CLEAN
related:
  - ../motion-carousel-jad-mh-2026-09-30.md (audit-aanleiding, video-audit)
  - ../../djinlabs/_internal/experimenten/cos/wayfinder-map.md
  - ../../_shared/sync-discipline-canon.md
  - ../../_shared/agent-discipline-canon.md
bron: /Users/gogetta/.hermes/cache/documents/doc_51199cb749d1_live-carousel-skill.zip
werkfolder: /tmp/live-carousel-skill-extract/live-carousel/
---

# Bouncer-audit: live-carousel-skill (Jad M.H)

## Bron-context

Naar aanleiding van de Jad M.H video-audit (motion-graphics carousels,
research/motion-carousel-jad-mh-2026-09-30.md) heeft founder de bijbehorende
skill in de chat gestuurd: `live-carousel-skill.zip`. Conform sync-discipline
24-sep + Ronde 14:

1. Bron lezen - SKILL.md + README + INSTALL-PROMPT + scripts gelezen
2. Audit op verborgen instructies/credential-toegang/externe endpoints
3. Installatie met expliciete toestemming per skill

Deze note documenteert **stap 1 + 2**. Stap 3 (installatie) wacht op expliciete
founder-go.

## Wat het is

Claude Code-skill van Jad M.H. Doel: motion-graphics carousels maken waar elke
slide een MP4-video is met muziek + sound effects, in plaats van statische
plaatjes. Stack: Node 22+, ffmpeg, Python 3.9+ met numpy/opencv, HyperFrames
(Heygen's open-source HTML-to-video renderer via npx), GSAP via jsDelivr,
OFL-licensed fonts (4 stuks: Anybody, Fraunces, JetBrains Mono, Anton).

Twee modi:
- **motion mode:** vanuit een topic een nieuwe carousel ontwerpen in big-word
  huisstijl (4 thema's: cobalt, tomato, forest, noir)
- **photo mode:** eigen carousel-afbeeldingen animeren zonder design te wijzigen

## Audit-methodologie (sync-discipline 24-sep)

Vier stappen:

1. **Source-read** - alle scripts (.py), shell (.sh), HTML/JS templates gelezen
2. **Hidden-instruction-check** - prompt-injection patronen in docs
3. **Credential-access-check** - env-var reads op KEY/TOKEN/SECRET
4. **External-endpoint-check** - URLs die niet in CDN allowlist staan

## Audit-resultaat per stap

### Stap 1 - Python scripts audit

45 bestanden in skill, 12 Python-scripts. Geen van deze bevatten:

- `subprocess` met `shell=True`
- `os.system` aanroepen
- `eval()` of `exec()` aanroepen
- `pickle.load` (arbitrary-code-execution risico)
- Writes met home-absolute paths (alleen relative paths binnen skill)
- Env-var reads van KEY/TOKEN/SECRET/API/CREDENTIAL patterns
- Suspicious fetch URLs buiten allowlist

**[OK] Geen suspicious patronen in python scripts.**

### Stap 2 - Shell scripts audit

`scripts/setup.sh` als enige shell-script (91 regels). Doet alleen:

- `node --version` check (Node 22+)
- `ffmpeg --version` check
- `python3 -c 'import sys; assert ...'` voor Python 3.9+
- `npx --yes hyperframes@0.8.121 --version` (Heyden/HyperFrames CLI - open source)
- `npx --yes hyperframes@0.8.121 browser ensure` (Chrome download, 170 MB cache)
- `$PY -m venv $SKILL_DIR/.venv` (private venv in skill folder)
- `$PY -m pip install -q -r requirements.txt` (numpy, opencv-python-headless)

Geen `rm -rf` op home-directories. Geen curl naar onbekende URLs.

**[OK] Geen suspicious patronen in shell scripts.**

### Stap 3 - HTML/JS templates audit

- 4 motion-mode slide templates (`src/01-hook.html`, `02-easing.html`,
  `03-weight.html`, `04-cta.html`) + photo-mode template (`src/_slide.html`)
- `templates/common/engine.js` (~350 regels, motion-engine)
- `templates/common/grain-overlay.html` (sub-snippet, license van HyperFrames)

Geen `eval()`, `new Function()` aanroepen. Geen externe scripts behalve
`https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js` (GSAP 3, free + commercial).

**[OK] Geen suspicious patronen in HTML/JS templates.**

### Stap 4 - Documentatie patronen

SKILL.md (9.7 KB) + README.md (2.5 KB) + INSTALL-PROMPT.md (2.9 KB) +
LICENSES.md (838 bytes).

Geen prompt-injection patronen:
- Geen "ignore previous instructions"
- Geen "you are now" role overrides
- Geen "IMPORTANT/CRITICAL/MANDATORY" hidden calls
- Geen special tokens (`<|...|>`)

Externe URLs zijn allemaal in scope:

- `https://nodejs.org` - installatie Node LTS
- `https://python.org` - installatie Python 3.9+
- `https://brew.sh` - installatie Homebrew (macOS)
- `https://github.com/heygen-com/hyperframes` - HyperFrames CLI
- `https://hyperframes.heygen.com/schema/hyperframes.json` - schema
- `https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry` - registry
- `https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js` - GSAP library
- `https://scripts.sil.org/OFL` - OFL font license pagina
- `https://github.com/googlefonts/AntonFont.git` - Anton font bron
- `https://github.com/JetBrains/JetBrainsMono` - JetBrains Mono bron
- `https://github.com/undercasetype/Fraunces` - Fraunces font bron
- `https://github.com/Etcetera-Type-Co/Anybody` - Anybody font bron

Allemaal publieke bronnen voor open-source tooling.

## Audit-verdict

```
AUDIT VERDICT: CLEAN
- Geen prompt-injection in docs
- Geen env-credential reads in scripts
- Geen suspicious externe endpoints
- Documentatie-URLs zijn publieke bronnen (CDN, GitHub, OFL)
- Setup-script doet alleen standaard toolchain-checks (Node/ffmpeg/Python)
```

**Conclusie:** de skill is **technisch veilig** om te installeren. Geen
prompt-injection, geen credential-exfiltration, geen kwaadaardige endpoints.

## Aanbevelingen (kanoniek-conform)

| # | Aanbeveling | Owner | Prioriteit |
|---|---|---|---|
| 1 | **Pin-discipline in skills-lock.json** met computed SHA256 | hermes | medium |
| 2 | **Installatie voor reviewers door doel zelf** (Hermes-side of Claude-Code-side, niet Hermes-imiteren) | founder-call | hoog |
| 3 | **Boundary-discipline:** Hermes-side skills in `~/.hermes/skills/` (Herna MAC), NIET in `~/.claude/skills/` zoals install-prompt suggereert | founder | hoog |
| 4 | **Geen executable code in canonieke files** (Ronde 14) - deze skill is executable, hoort in skills-locatie, niet in research/ | hermes | laag (al correct) |
| 5 | **Notion-discipline 24-sep:** skill heeft GEEN toegang tot mail/agenda/betalingen/klantdata zonder aparte Darren-go | hermes | laag (skill heeft geen pastoegang) |
| 6 | **Bij Hermes-side installatie:** launcher-link aanmaken zodat Hermes de skill kan aanroepen | hermes | medium |

## Wat NIET te doen

- Geen installatie zonder founder-expliciete-go (sync-discipline 24-sep)
- Geen canonieke files aanraken tijdens installatie (Ronde 14)
- Geen env-vars of tokens delen via deze skill (Ronde 14)
- Geen Webrnds-productie-launches via deze skill zonder shadow-mode (T-04 validatie)

## Audit-trail (deze note)

- Geschreven door: Hermes (op verzoek van Darren, 2026-09-30)
- Audit-bron: /Users/gogetta/.hermes/cache/documents/doc_51199cb749d1_live-carousel-skill.zip
- Werkfolder: /tmp/live-carousel-skill-extract/live-carousel/ (45 files)
- Audit-methodologie: sync-discipline 24-sep (handmatige Bouncer-check;
  formele Bouncer-skill is `/Users/gogetta/.hermes/skills/bouncer/SKILL.md`,
  6.9 KB, niet actief gebruikt in deze sessie)
- Discipline: research-zone, geen wijziging aan _shared/, decisions.md,
  Hermes-skill-locaties
- 0 Cyrillic bytes (cyrillic-guard geverifieerd)
