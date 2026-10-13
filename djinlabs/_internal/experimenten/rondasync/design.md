---
name: ronde-flow-sync-assistant
description: Advisory tool dat bij elke Ronde-sluit verifieert of alle _shared/ canon-files gesynced zijn met decisions.md. Gebruikt Jev-classification (Ronde 17 `classify_jev`) voor drift-detectie. Output is advisory-only — geen auto-fix. Past bij sync-discipline-canon.md (Ronde 16) en jev-policy-canon.md §"Confidence bands" (Ronde 17).
status: design-draft
version: 0.1
date: 2026-09-21
owner: djin
tool_type: advisory-only
---

## Doel

Bij elke Ronde-sluit in `decisions.md` automatisch verifiëren of alle `_shared/` canon-files gesynced zijn. Output is **advisory**: een drift-rapport dat de founder kan lezen en manueel kan beslissen welke sync-actie nodig is.

## Niet-doelen

- **Geen auto-edit.** Deze tool schrijft nooit zelf canonieke files. Ronde 16 sync-discipline zegt: agent is verantwoordelijk voor sync, niet voor auto-fix.
- **Geen canon-promotie.** Deze tool maakt geen Ronde. Het helpt alleen de sync-discipline (Ronde 16) uitvoeren.
- **Geen hot-path.** Net als andere Jev-calls: 1 seconde latency, niet voor real-time.

## Architectuur

### Input

1. **`decisions.md`** — laatste Ronde-sectie (regel-blok tussen `## Ronde N` en `---` of volgende `## Ronde`)
2. **`_shared/*.md`** — alle canon-files in `_shared/`
3. **`CONTEXT.md`** — glossary

### Output

Een **drift-rapport** met per-file:

| Veld | Betekenis |
|---|---|
| `file` | relatief pad |
| `ronde_N_mentioned` | bevat het Ronde-nummer expliciet? |
| `sync_discipline_cited` | verwijst naar `sync-discipline-canon.md`? |
| `drift_classification` | Jev-call: synced / partial-drift / stale / unrelated |
| `drift_confidence` | confidence per classificatie |
| `action_band` | auto-sync (high) / review-needed (mid) / default-noop (low) |

### Jev-call structuur

Voor elke `_shared/*.md` file één Jev-call met 3 parallel questions:

```json
{
  "model": "jev-1.13.0",
  "state": "File path: _shared/{filename}.md\nRonde N datum: {ronde_datum}\nRonde N claims: {ronde_claims_extract}\nFile content preview: {first_500_chars}",
  "questions": {
    "drift_status": {
      "type": "choice",
      "instructions": "Is this canon-file synced with the Ronde N decisions?",
      "criteria": {
        "synced": "File mentions Ronde N explicitly OR has been updated for Ronde N changes",
        "partial-drift": "File is canon-related to Ronde N but missing Ronde N reference",
        "stale": "File predates Ronde N and is no longer accurate",
        "unrelated": "File is canon but has no relationship to Ronde N"
      }
    },
    "needs_update": {
      "type": "noul",
      "instructions": "Does this file need a sync-update to reflect Ronde N?"
    },
    "drift_severity": {
      "type": "score",
      "instructions": "How severe is the drift? 0 = trivial, 1 = moderate, 2 = critical (canon-pollution risk)",
      "criteria": [
        "Trivial — missing Ronde reference but content unaffected",
        "Moderate — references outdated canon, needs update",
        "Critical — canon claim contradicts Ronde N, must-fix"
      ]
    }
  }
}
```

### Confidence-band (Ronde 17)

| Vraag | High (>0.7) | Mid (0.35-0.7) | Low (<0.35) |
|---|---|---|---|
| `drift_status` | auto-classify | advisory-needed | default-noop |
| `needs_update` | adviseer-update | advisory-needed | default-noop |
| `drift_severity` | log-as-critical | log-as-moderate | log-as-trivial |

**Default-actie:** log naar audit-spoor, geen edit. Bij `drift_status=stale` EN `needs_update=true` met `drift_severity=2`: **escalate** (push notification of Slack-message).

## Workflow

### Trigger

- **Manueel**: founder draait het script na elke Ronde-sluit
- **Automatisch** (later): CI-hook bij `git push` van `decisions.md`

### Stappen

1. Lees `decisions.md`, vind laatste `## Ronde N` sectie
2. Extract Ronde N claims (samenvatting van wat er besloten is)
3. Voor elke `_shared/*.md`:
   - Lees eerste 500 chars
   - Bouw Jev-call payload
   - Run Jev-call
   - Log resultaat naar `audit-spoor/ronde-{N}-sync-{timestamp}.json`
4. Compileer drift-rapport: `research/ronde-{N}-sync-rapport.md`
5. Bij kritieke drift: escalate naar Slack/Telegram via bestaande channel

### Audit-spoor (per ADR 0001)

`audit-spoor/ronde-{N}-sync-{timestamp}.json` is **runtime-state** (JSON), niet Markdown. Bevat:

```json
{
  "ronde": 17,
  "ronde_datum": "2026-09-21",
  "ronde_claims": ["Q17.1=A", "Q17.2=B", "Q17.3=A", "Q17.4=A"],
  "timestamp": "2026-09-21T20:50:00Z",
  "results": [
    {
      "file": "_shared/jev-policy-canon.md",
      "drift_status": "synced",
      "needs_update": 0.15,
      "drift_severity": 0.0,
      "drift_confidence": 0.99,
      "action_band": "auto-classify"
    },
    ...
  ]
}
```

Dit bestand is **canoniek voor het audit-spoor**, niet voor de drift-classificatie zelf. De classificatie blijft advisory.

## Eerste test op Ronde 17 sync-state

**Setup:** tool draait eenmalig op de huidige staat om baseline te krijgen.

**Verwachte drift per file (op basis van file-content scan):**

| File | Verwachte drift | Reden |
|---|---|---|
| `_shared/AGENTS.md` | synced | heeft Ronde 17 sync-discipline vermeld |
| `_shared/sync-discipline-canon.md` | synced | is zelf Ronde 16 |
| `_shared/jev-policy-canon.md` | synced | V1.5 met Ronde 17 §§ |
| `_shared/agent-discipline-canon.md` | partial-drift | heeft geen Ronde 17 reference; `classify_jev` raakt agent-discipline |
| `_shared/hard-rules.md` | partial-drift | heeft geen Ronde 17 reference; Ronde 16 sync-discipline hoort hier |
| `_shared/icm-canon.md` | partial-drift | heeft geen Ronde 17 reference; 5-onderdelen-pattern (Gap M) hoort hier |
| `_shared/naming-conventions.md` | partial-drift | heeft geen Ronde 17 reference; `classify_jev` slug-conventie |
| `_shared/retention-policy-canon.md` | partial-drift | heeft geen Ronde 17 reference; selective compaction (Gap L) hoort hier |
| `_shared/state-formats-canon.md` | partial-drift | heeft geen Ronde 17 reference; intake-discipline (Gap Q) hoort hier |
| `CONTEXT.md` | synced | heeft Ronde 17 glossary-termen |

**Tool-output** zou een drift-rapport produceren met 7 partial-drift meldingen. Geen escalatie (geen stale-of-critical), alleen advisory.

## Volgende stappen na tool-design

1. **Bouw het script** (`scripts/rondasync.py`) dat Jev-call per file doet
2. **Run shadow-mode** op Ronde 17 baseline — krijg eerste echte drift-rapport
3. **Vergelijk tool-output met handmatige scan** (die ik net deed) — kalibreer confidence
4. **Documenteer patronen** in research-file zodat toekomstige Rondes dezelfde tool kunnen gebruiken

## Out-of-scope voor v1

- **Auto-fix**. Ronde 16 zegt: agent synct, geen auto-tool. Deze tool detecteert, agent fixeert manueel.
- **Cross-boom sync**. `system/design/jev-policy-canon.md` is een andere boom, valt buiten deze tool.
- **Ronde-N-minus-N drift**. Tool detecteert alleen laatste Ronde, niet historische drift.

## Hard rules

- **Geen auto-edit.** Deze tool schrijft nooit canonieke files. Alleen `audit-spoor/` outputs.
- **Confidence-band (Ronde 17) verplicht.** Geen classificatie zonder band-logica.
- **Audit-spoor altijd.** Elke tool-run produceert timestamped JSON.
- **Shadow-mode default.** Geen escalatie naar Slack/Telegram zonder founder-commit.

## Bron-bewijs

- Ronde 16: sync-discipline-canon.md (agent verantwoordelijk, sync bij elke Ronde)
- Ronde 17: jev-policy-canon.md §"Confidence bands" + §"Action-type `classify_jev`"
- Live tests: research/jev-live-test-rapport.md + research/jev-icm-file-classification-test.md
- Drift-patroon: handmatige scan van _shared/ op Ronde 17 vermeldingen (deze file, sectie hierboven)

## Cross-references

- `_shared/sync-discipline-canon.md` — wie/wanneer/hoe van sync (deze tool is een implementatie)
- `_shared/jev-policy-canon.md` — §"Action-type `classify_jev`" (deze tool gebruikt die action)
- `decisions.md` Ronde 16 + 17 — basis voor tool-vereisten
- `research/jev-live-test-rapport.md` — confidence-band basis
- `research/jev-icm-file-classification-test.md` — file-classificatie patroon

## What is NOT canon in this document

- Dit is een **tool-design**, niet een canonieke Ronde. Ronde-promotie kan via Ronde 18+.
- Concrete Jev-call-formaten — implementatie-detail
- Audit-spoor JSON-schema — kan veranderen
- Drift-classificatie labels — kunnen herzien worden

## Notities voor audit-trail

Dit is **geen canoniek document**. Het is een **tool-design** dat aantoont hoe een Ronde-flow assistent eruit zou zien. Voor canon-promotie:

1. Eerst **shadow-mode** draaien (1 Ronde)
2. Resultaten reviewen met founder
3. Eventueel Ronde 18 met deze tool als canon-implementatie