# Agent = Folder = ICM — research note

> **Status.** Pending (research-note, canoniek-neutraal).
> **Datum.** 2026-09-22.
> **Source.** Grill-me-sessie met founder, in context van COS design-traject + ICM-restructure.
> **Doel.** Een canonieke notie onderzoeken: *een agent wordt gedefinieerd door de instructies in zijn folder*. Past bij ICM-canon (`_shared/icm-canon.md`) en bij de canonieke notie "agents zijn folder-state" (`_shared/state-formats-canon.md` regel 75).

---

## TL;DR

In het Djinlabs-COS-traject ontstaat een canonieke notie die verder gaat dan "agents zijn folder-state": **een agent is een folder, en de folder-inhoud definieert de agent**. Dit betekent:

- Een agent heeft geen externe runtime-config los van zijn folder; alles zit in de folder.
- Een verse AI-agent die de folder opent, kan de agent zijn door de instructies te lezen — geen aparte "agent-builder" nodig.
- De folder-naam = agent-naam. De folder-hiërarchie = agent-grenzen.
- Boundary-discipline wordt folder-discipline: niemand schrijft buiten zijn eigen folder.

---

## Wat de notie zegt

### Claim 1 — Folder = Agent

Elke agent in het Djinlabs-systeem is een folder. Niet "heeft een folder" (zoals state), maar **is** een folder. De agent-runtime leest de folder en gedraagt zich ernaar.

Voorbeelden uit onze scope:

| Folder | Agent-rol |
|---|---|
| `djin/` | Djin-agent (general-purpose dev agent) |
| `webrnds/` | Webrnds-agent (UI / web layer) |
| `cos/` (experimenten) | COS-agent (Chief of Staff, dispatcht andere agents) |
| `rondasync/` (experimenten) | Rondasync-agent (Ronde-sync-discipline) |
| `~/.blobbies/` (runtime) | blobbies-agent (infra, Tauri tray-app) |

### Claim 2 — Inhoud = Instructie

De folder bevat alle informatie die de agent nodig heeft om zijn rol te spelen. Geen externe runtime-config, geen "agent-builder" die velden invult. De folder is **self-describing**.

Verwacht patroon in elke agent-folder:

```
<agent>/
├── CONTEXT.md           ← wat is deze agent, wat doet hij, wat niet
├── AGENTS.md            ← router voor sub-agents die hier werken
├── start.md             ← eerste-taak-patroon (U1 onderneming-als-bedrijf)
├── state.md             ← huidige fase van het werk
├── _internal/           ← stable regels en templates (factory)
├── _templates/          ← per-run artifacts (product)
└── 01-research/ etc.    ← sequence-stappen als sequence telt
```

Dit is precies ICM-discipline toegepast op agents.

### Claim 3 — Folder-naam = Agent-naam

De folder-naam identificeert de agent. Geen aliases, geen tags, geen "kind: agent" in frontmatter. De folder-naam IS de agent-naam.

Concreet: in role-registry van COS (zie hun `cos/architecture-2026-09-22.md` §4) zou `to: djin` letterlijk de folder `djin/` betekenen, niet een apart role-id dat in een registry-tabel zit.

### Claim 4 — Boundary-discipline = Folder-discipline

Boundary-discipline Ronde 14 zegt: agent X schrijft niet buiten zijn eigen boundary. Met de folder-notie wordt dit:

- Djin schrijft niet buiten `~/Documents/projects/slack/` en andere Djin-owned folders.
- Webrnds schrijft niet buiten Webrnds-owned folders.
- COS dispatcht maar schrijft niet (zie T-01 + hun §8).
- blobbies schrijft niet buiten `~/.blobbies/`.

De boundary **is** de folder. Cross-boundary handovers lopen via `/_shared/handovers/` met menselijke act.

---

## Hoe dit past bij bestaande canon

### ICM-canon (`_shared/icm-canon.md`)

ICM zegt: "Ordinary folders + readable files die een AI de juiste context geven per stap." De agent-is-folder-notie is **de sterke vorm** van ICM: niet alleen "geef context via folders", maar "de agent IS de folder".

### State-formats-canon (`_shared/state-formats-canon.md`)

Regel 75 zegt: "agents zijn folder-state". Dit is een zwakkere notie — het zegt alleen **waar de state zit**, niet **wat de agent is**. De agent-is-folder-notie gaat verder: agent = folder, niet agent heeft folder-state.

### Agent-discipline-canon (`_shared/agent-discipline-canon.md`)

De 3 basisregels (splits, UI-vraag, flow-positie) zijn **gedragsregels voor agent-sessies**. Ze passen bij folder-discipline maar zijn niet dezelfde claim. De agent-is-folder-notie is een **aanvulling**, niet vervanging.

### Naming-conventions (`_shared/naming-conventions.md`)

Slug-format, datestamps, status-frontmatter — allemaal folder-niveau. Past naadloos bij agent-is-folder-notie.

### Jev-policy-canon (`_shared/jev-policy-canon.md`)

De jev-policy-canon heeft het over "Blob" (uit blobbies) als agent-instance met UUID. Dat is **runtime**, niet canoniek. Een Blob is een instantie van de agent-folder `~/.blobbies/`. De agent-is-folder-notie zegt dat **de canonieke agent-vorm** de folder is, niet de Blob.

---

## Wat dit verandert aan COS-architectuur

Hun `cos-architecture-2026-09-22.md` §4 (role registry) heeft:

```yaml
roles:
  - id: djin
    label: "Djin — general-purpose dev agent"
    description: "..."
    commands: [read, edit, run, test, commit, search]
    safe: false
    max_runtime_seconds: 600
    owned_paths: ["umbrella-/", "apps/", "infra/"]
```

Met de agent-is-folder-notie wordt dit:

```yaml
roles:
  - id: djin
    folder: "djin/"            # ← de folder IS de agent
    label: "Djin — general-purpose dev agent"
    description: "..."         # ← uit djin/CONTEXT.md
    safe: false                # ← uit djin/CONTEXT.md of AGENTS.md
    max_runtime_seconds: 600   # ← uit djin/AGENTS.md
    owned_paths: ["djin/", ...]   # ← de folder, niet een lijst
```

De role-registry wordt **een discovery-mechanisme dat de folders scant**, niet een hand-edited YAML-tabel. Dat is **canoniek-conform** met "single source of truth".

---

## Wat dit NIET zegt (anti-patterns)

### Niet: "alle agents zijn gelijk"

De folder-discipline zegt niet dat alle agents dezelfde structuur hebben. Een COS-agent heeft geen `01-research/` (sequence telt niet voor hem), een Webrnds-agent heeft wel `01-onboarding/`, `02-research/`, etc. Sequence is niet universeel.

### Niet: "geen runtime-config"

Een agent kan runtime-config hebben (bv. blobbies' `settings.json`). Maar **canonieke bron** is de folder, niet de runtime-config. Ronde 15: Markdown = knowledge, JSON = state.

### Niet: "folders zijn onveranderlijk"

Folders groeien, veranderen, worden hernoemd. De agent **evolueert** met de folder. Ronde 18 (canonieke rename blobbies → blobbies) is een voorbeeld: één rename, één canonieke update, alle referenties volgen.

### Niet: "geen cross-folder dependencies"

Een COS-agent leest Webrnds/CONTEXT.md om te beslissen hoe te dispatchen. Cross-folder **reads** zijn oké. Cross-folder **writes** zijn boundary-violatie (Ronde 14). De agent-folder is **open voor lezen**, **gesloten voor schrijven van buitenaf**.

---

## Bron-bewijs

| Bron | Notie |
|---|---|
| `_shared/icm-canon.md` regel 8 | "Eén werk-folder heeft één job, uitgelegd in zijn eigen CONTEXT.md" |
| `_shared/icm-canon.md` regel 9 | "Factory/product-split" |
| `_shared/icm-canon.md` regel 13 | "Walk-test: kan een verse AI in deze folder starten met router + max 2 reads?" |
| `_shared/state-formats-canon.md` regel 75 | "agents zijn folder-state" |
| `djinlabs/_internal/experimenten/cos/architecture-design.md` | onze eigen COS-architectuur (experiment-zone) |
| `djinlabs/_internal/experimenten/cos/wayfinder-map.md` T-01 | "COS is je Chief of Staff — hij leest je inbox en stuurt elk bericht naar de juiste agent" |
| `djinlabs/system/design/notes/cos-architecture-2026-09-22.md` §4 | role-registry (andere agent, 0.1 research-grade) |
| arxiv 2603.16021v2 (research-note 2026-09-21) | "Interpretable Context Methodology: Folder Structure as Agentic Architecture" |

---

## Open vragen / Frontier

1. **Is "agent = folder" canoniek-verordening, of alleen research-notie?** — vereist Ronde-traject in `decisions.md`.
2. **Hoe verhoudt dit zich tot runtime-state** (Ronde 15: JSON voor state, Markdown voor kennis)? — Een Blob in `~/.blobbies/` is runtime, de canonieke agent is de folder. Twee verschillende lagen.
3. **Hoe past dit bij COS dispatch?** — COS leest de agent-folder om te beslissen of dispatch past. Maar COS schrijft niet in de agent-folder. Dat is precies de rol-discipline die we al hebben.
4. **Wat doet dit met role-registry?** — Hand-edited YAML-tabel wordt discovery-mechanisme dat folders scant. Kanoniek-conform met single-source-of-truth.
5. **Welke agent-folder-structuur is universeel?** — Niet alle agents hebben dezelfde submappen. Wel hebben ze allemaal `CONTEXT.md` + `AGENTS.md` (per ICM walk-test). Welke andere verplichte files?

---

## Review-checklist

- [ ] Past bij ICM-canon walk-test? (verse AI kan starten met router + max 2 reads)
- [ ] Past bij state-formats-canon (Markdown = kennis, JSON = state)?
- [ ] Past bij boundary-discipline Ronde 14?
- [ ] Past bij sync-discipline Ronde 16?
- [ ] Past bij Ronde 18 canonieke spelling-rename?
- [ ] Geen executable code, geen canon-promotie, geen auto-include?
- [ ] Provenance + bron-bewijs aanwezig?
- [ ] Geen Tauri-runtime koppeling, geen `~/.blobbies/` koppeling?

---

## Notitie voor volgende agent

Dit is een research-note, geen canoniek-traject. Als je dit wilt canoniseren:

1. Open een nieuwe Ronde in `decisions.md` met expliciete frontier-items.
2. Update `_shared/agent-discipline-canon.md` of maak een nieuwe `_shared/agent-folder-canon.md`.
3. Update `_shared/icm-canon.md` om de sterke-vorm-claim expliciet te maken.
4. Sync-discipline: update alle AGENTS.md-routers, glossary, design-docs.

Als je dit NIET wilt canoniseren: bewaar dit als research-input voor T-02 t/m T-10 in de wayfinder-map.
