# Context — Webrnds (één scherm)

```
                   ┌──────────────────────────────────────────┐
                   │  Context/  (runtime-truth + deze map)    │
                   │  Webrnds: uitvoerende onderneming,       │
                   │  Codavo-shape, KVK-ingeschreven          │
                   └────────────────────┬─────────────────────┘
                                        │
                                        ▼
                  ┌───────────────────────────────────────┐
                  │  AGENTS.md  start.md  state.md        │
                  │  _rules.local.md  README.md           │
                  └────────────────┬──────────────────────┘
                                   │
        ┌──────────────┬────────────┼────────────┬──────────────┐
        ▼              ▼            ▼            ▼              ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │01-research│  │02-offer │  │03-market │  │04-close  │  │05-produce│  06-na-livegang
  │ markt,   │  │ dienst-  │  │ outreach│  │ intake,  │  │ bouw,    │  │ onderhoud,
  │ ICP,     │  │ palet,   │  │ leads,  │  │ contract,│  │ agent-   │  │ retentie,
  │ niches   │  │ prijzen  │  │ kanalen │  │ kickoff  │  │ wrappers │  │ groei
  │          │  │          │  │         │  │          │  │          │  │
  │CONTEXT.md│  │CONTEXT.md│  │CONTEXT.md│  │CONTEXT.md│  │CONTEXT.md│  │CONTEXT.md
  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
        │              │            │            │              │
        └──────────────┴─────┬──────┴────────────┴──────────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   clients/       │
                    │   <slug>/        │
                    │   klantreis-<id> │
                    │     _archive/    │
                    └──────────────────┘
                             │
                             ▼  (factory)
                    ┌──────────────────┐
                    │  _internal/      │ R&D + leer + experimenten
                    │  _templates/     │ fase-template, klantreis-template
                    │  skills/         │ klant-spec wrapper-templates
                    │  _archive/       │ regels voor archivering
                    │  _rules.local.md │ cap, services, naming
                    └──────────────────┘
```

## Flow-regels (Webrnds)

- **Agent landt in Webrnds** → lees mono-repo `Context/context.md` → deze file → `webrnds/Context/context.md` → `webrnds/AGENTS.md` → fase-`CONTEXT.md` waar je aan werkt.
- **Nieuwe klant** → start in `04-close/`, spawnt `clients/<slug>/klantreis-<id>/`. Cap = 3 actieve reizen per klant (`_rules.local.md`).
- **Klant door pipeline** → artifacts in de relevante fase-folder. Klant-spec wrappers in `skills/`.
- **Klant afgerond** → verhuizen naar `clients/<slug>/_archive/`. Telt niet meer voor cap.
- **Dienst-palet wijzigen** → nieuw agent-wrapper in `skills/`, geen folder-wijziging (Codavo-les, Ronde 1/Q2).
- **Sync-discipline** → per `_shared/sync-discipline-canon.md`: elke wijziging in Webrnds checkt of AGENTS.md + start.md + state.md + deze Context mee moeten.

## Bestands-disciplines (kort)

- **Markdown = kennis** (canoniek, lang-cyclisch, mens-leesbaar).
- **JSON = state** (kort-cyclisch, tooling-leesbaar, niet canoniek).
- **Frontmatter op per-run artifacts:** `review_status: pending|reviewed|paused`.
- **Numbered folders = sequence** (pipeline). Unnumbered = topics.
- **Klant-slugs:** lowercase-hyphenated bedrijfsnaam, geen PII (U3).
- **Klantreis-IDs:** stable na aanmaken, nooit wijzigen.
- **Walk-test** voor élke agent of substantiële wijziging: verse AI + max 2 reads.
