---
title: "_shared/AGENTS.md — cross-references naar cos-architecture-canon + state-formats-canon"
entry_id: 2026-10-12-_shared-AGENTS
date: 2026-10-12
actor: COS (lock-actie per Ronde 19 commit 89958d9)
scope: tracked-file-modification
modified_path: _shared/AGENTS.md
modification_commit: 89958d9 (Ronde 19 lock)
review_status: pending-founder-review
linked_artifacts:
  - _shared/cos-architecture-canon.md (v0.1, Ronde 19 lock)
  - _shared/state-formats-canon.md (Ronde 15 + observatie-logs hint)
  - _shared/icm-canon.md (Ronde 19 sync — ook aangeraakt in 89958d9)
  - AGENTS.md (top-level, ook aangeraakt in 89958d9)
created: 2026-10-12
---

# Audit-entry — `_shared/AGENTS.md`

## Wat veranderde

Toegevoegd: twee nieuwe bullets in de "Wat zit er"-lijst, direct
na de bestaande `icm-canon.md`-bullet. Beide verwijzen naar pas
in Ronde 19 gelockte / gesyncte canon-bestanden, met een korte
inhouds-aanduiding zodat een lezer niet eerst het hele bestand
hoeft te openen om te weten of het relevant is.

**Diff (commit 89958d9, _shared/AGENTS.md, @@−7,6 +7,8):**

```diff
 - `icm-canon.md` — wat is een Record library, wat is Umbrella, de
   walk-test. Pointer naar de ICM-canon
   (`workflow-package-builder/references/icm-design-rules.md`) in de
   community-workflow-kit.
+- `cos-architecture-canon.md` — folder-canon voor COS (Chief of
+   Staff), Ronde 19 lock. Definieert wat COS is als folder-agent,
+   autoriteit (folder-auteur + Jev als gate), en routes bij eerste
+   launch. Runtime-vrij; runtime-vragen leven in
+   `djinlabs/_internal/experimenten/cos/wayfinder-map.md`.
+- `state-formats-canon.md` — Markdown = knowledge, JSON = state
+   (Ronde 15 + §Observatie-logs hint 2026-10-08). Bepaalt welke
+   file-soort in welke rol thuishoort; kent een nieuwe toelating voor
+   kanoniek-neutrale observatie-logs (bv.
+   `cos/audit-spoor/dispatch-<date>.md`).
```

Vier regels per bullet; in totaal +8 regels, geen verwijderingen.
De `_shared/AGENTS.md` header en de overige secties ("Wat NIET hier
zit", "Onderhoud") zijn ongewijzigd.

## Waarom het ertoe doet

Dit is een **canonieke bron in `_shared/`** — één van de files die
volgens `_shared/AGENTS.md` §Onderhoud alleen gewijzigd mag worden
als een beslissing in `decisions.md` daarom vraagt. De wijziging is
daarom geen opfrissing maar een formele canon-cross-reference.

Drie redenen dat juist deze twee regels hier moesten komen:

- **canoniek-neutraal sync-pad voor COS-architectuur.**
  `cos-architecture-canon.md` was in Ronde 19 verplicht (`v0.1`
  lock), maar zonder vermelding in deze router kon een agent die
  alleen `_shared/` inleest de COS-architectuur missen. De bullet
  geeft het bestaansrecht + pointer naar de runtime-vrij-clausule
  ("runtime-vragen leven in `wayfinder-map.md`") — zodat niemand
  _shared alsnog probeert te gebruiken voor runtime-zaken.
- **Hint open canonieke vraag voor state-formats.**
  De state-formats-canon is door T-05/T-04 Ronde 19 closure
  uitgebreid met een observatie-logs-bucket. De bullet legt deze
  status vast zodat lezers van `_shared/AGENTS.md` zien dat de
  observatie-logs (incl. `cos/audit-spoor/dispatch-<date>.md`
  patroon) canon-conform zijn — geen latere herinterpretatie
  van bestaande entries die "Markdown = knowledge" niet zouden
  respecteren.
- **Ronde 19 sync-discipline intact.** De sync-discipline canon
  (Ronde 16 §3) vereist dat een lock van een nieuwe canon-bron
  meteen via de canonieke-index-bron (`_shared/AGENTS.md`)
  zichtbaar wordt — anders ontstaat drift tussen de canon zelf
  en de lijst die ernaar verwijst. Deze edit is die sync.

## Link terug

- **Modified path:** `_shared/AGENTS.md`
- **Canonieke bronnen die nu via deze router bereikbaar zijn:**
  `_shared/cos-architecture-canon.md` (Ronde 19 lock),
  `_shared/state-formats-canon.md` (Ronde 15 + 2026-10-08 hint)
- **Andere in 89958d9 aangepaste canon-source:**
  `_shared/icm-canon.md` (§Agent-as-Blob + §Agent-as-folder +
  "DjinLabs zonder runtimes")
- **Top-level router die naar dezelfde bronnen verwijst:**
  `AGENTS.md` (zie andere entry in dezelfde set)
- **Commit:** `89958d9` — Ronde 19 lock: canonieke files +
  AGENTS.md-routers (sync-discipline R16 §3)
- **Inventory-context:** `audit-spoor/cleanup-2026-10-10-r19-inventory.md`
  §F punt 1 ("founder-actie" voor `_shared/AGENTS.md`; door
  89958d9 gesloten)
