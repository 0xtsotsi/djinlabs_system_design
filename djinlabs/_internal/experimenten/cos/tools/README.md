---
name: cos-tools-readme
description: RUN-BOOK voor cos/tools/. Debugging-helpers onder djinlabs/_internal/experimenten/cos/tools/. Canoniek-neutraal; geen sync-discipline-implicaties.
status: active
date: 2026-09-28
type: run-book
related:
  - cyrillic-guard.sh
  - ../tickets/T-02-cos-baas.md (Cyrillic-bug context)
  - ../../../../research/187n-codex-hermes-audit-2026-09-28.md (anker G, bug-context)
---

# cos/tools/ — RUN-BOOK

Debugging-helpers voor het DjinLabs-COS-onderzoek. Canoniek-neutraal: niet opgenomen in `_shared/`, geen Ronde-traject-lock, geen sync-discipline-implicaties. Promotie naar `_shared/tools/` of `.githooks/pre-commit` vereist Ronde-traject in `decisions.md`.

## Tools

### `cyrillic-guard.sh`

Detecteert en optioneel vervangt Cyrillic-homoglyf-substitutie in canonieke files. De bug: model-output (chat-rendering, file-write via patch/write) bevat soms Cyrillische tekens waar Latijnse bedoeld waren. Symptoom gemeld 2026-09-21, 22, 23, 28; oorzaak onbekend. Working state Hermes 2026-09-28 §4 documenteert de workaround-context.

**Wat het doet:**

- Scant canonieke folders (`_shared/`, `djinlabs/`, `webrnds/`, `.agents/`, `decisions.md`) op Cyrillische karakters die Latin-lookalike zijn (10 lowercase + 11 uppercase homoglyf-paren, zie `cyrillic-guard.sh` voor de exacte lijst).
- Rapporteert per file: aantal hits, context (40 chars rond elke hit), Unicode codepoint.
- Optioneel `--fix`: vervangt homoglyf door Latin lookalike, schrijft file terug.
- Fallback decode naar latin-1 voor niet-UTF8 files (geen false-positive op hoge bytes).
- Permissions-fouten bij `--fix` worden gerapporteerd + exit 1.

**Gebruik:**

```bash
# Default: scan canonieke files alleen (exit 0 = schoon, exit 1 = hits)
bash djinlabs/_internal/experimenten/cos/tools/cyrillic-guard.sh

# Scan inclusief research/ (kan letterlijke Cyrillic-citaten bevatten)
bash djinlabs/_internal/experimenten/cos/tools/cyrillic-guard.sh --allow-research

# Scan één specifiek bestand
bash djinlabs/_internal/experimenten/cos/tools/cyrillic-guard.sh path/to/file.md

# Auto-replace Cyrillic met Latin lookalikes
bash djinlabs/_internal/experimenten/cos/tools/cyrillic-guard.sh path/to/file.md --fix

# Help
bash djinlabs/_internal/experimenten/cos/tools/cyrillic-guard.sh --help
```

**Wanneer draaien:**

| Moment | Mode | Waarom |
|---|---|---|
| Voor elke canonieke schrijfactie | default scan | Voorkomt dat Cyrillic-chars per ongeluk in canonieke files landen |
| Na elke file-write in `cos/tickets/` | specifiek-file scan | Bewust-criterium: T-02-baas-vraag.txt had 10 chars voordat fix; guard vangt dit |
| Bij vermoeden van bug-trigger in eigen output | scan + `--fix` | Zelf-corrigerend; past trigger-woord aan voordat commit |
| In CI (toekomstig, vereist Ronde-traject) | default scan, exit-code als gate | Pre-commit-equivalent zonder `.githooks/`-promotie |

**Wat het NIET doet:**

- Voorkomt de bug niet aan de bron (output-stap). Detecteert alleen het resultaat.
- Past geen non-Cyrillic chars aan (geen Chinese homoglyf-detectie, geen andere scripts).
- Schrijft niet naar canonieke files in `--fix`-mode zonder bevestiging (alleen specifiek-bestand mode).
- Maakt geen backup. Run met `--fix` is destructief; verifieer met `git diff` daarna.

**Bekende beperkingen:**

- False-negative voor UTF-16 encoded Cyrillic (canoniek is altijd UTF-8; geen actie nodig).
- False-negative voor Cyrillic in binary files (geen actie nodig; geen canonieke binaries).
- `research/codavo-competitive-brief.md` bevat 15 chars als letterlijk bug-bewijs; alleen zichtbaar met `--allow-research`, nooit aangeraakt door default run.

**Verificatie:**

End-to-end getest op 2026-09-28 met de volgende scenario's:

- Default run canoniek (178 files, 0 hits) — exit 0
- `--allow-research` (205 files, 15 hits in codavo) — exit 1
- Specifiek bestand met Cyrillic (10 hits in test file) — exit 1, correct context-output
- Pad met spatie — correct verwerkt (JSON-array passing)
- Niet-bestaand pad — skip-message, exit 0
- Readonly file + `--fix` — PermissionError, fix_failures=1, exit 1
- Latin-1 hoge bytes zonder Cyrillic — fallback decode, geen false-positive
- UTF-16 encoded Cyrillic — false-negative geaccepteerd (kanoniek is UTF-8)
- Hoofdletters-extensie (.MD) — correct herkend
- `--help` — usage info correct
- Eigen Cyrillic-voorbeelden in bash comments — niet getriggerd (Unicode-escapes)
- `--fix` op test file met 10 chars — correct vervangen, re-run = 0 hits

## Conventie

Bij elke schrijfactie van `cos/tickets/*.md` of `cos/architecture-design.md`:

1. Run `cyrillic-guard.sh <bestand>` om te verifiëren dat er geen Cyrillic-chars in de output zaten.
2. Als hits gevonden: run met `--fix` of corrigeer handmatig.
3. Re-run zonder `--fix` om te bevestigen dat alles schoon is (exit 0).

Niet-canoniek: dit is een werksessie-conventie, geen canonieke discipline. Ronde-traject nodig als dit als verplichte pre-commit wil gelden.
