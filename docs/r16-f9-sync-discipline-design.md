# Ronde 16 frontier #9 — sync-discipline design-doc + AGENTS.md-routers

> **Samenvatting.** Frontier #9 (sync-discipline herstellen) is door Ronde 15 groter
> geworden: vier AGENTS.md-routers en één design-doc liepen al drift; Ronde 15
> voegde één nieuwe canon toe zonder canoniek sync-mechanisme. Dit design-document
> locked drie orthogonale assen: wie synct, wanneer, hoe maken we drift structureel
> onmogelijk.
>
> **Visual.** `docs/r16-f9-sync-discipline-visual.html` toont de sync-discipline-pipeline
> als architecture-diagram (6 nodes, NL-labels kort gehouden om clearance-bug te vermijden).

## Terms

### drift

Verschil tussen twee canonieke bronnen over dezelfde claim. Voorbeeld: design-doc zegt
"Ronde 1-11 locked", decisions.md zit op Ronde 14 — drie Rondes achter.

_Avoid_: lag, out-of-date

### sync-discipline

Canonieke afspraak over wie een file bijwerkt, wanneer, en hoe drift wordt voorkomen.
Vraagt een canonieke bron én een trigger (bij elke Ronde, bij pre-commit, etc.).

_Avoid_: sync-strategie, sync-discipline light

### lei

De leesbare vertaling van een canonieke bron. design-doc is de lei (zie
`docs/djinlabs-1-folder-fundamentelen-design.md` regel 3). Niet de bron — de vertaling.

_Avoid_: documentatie, manual

## Why

Het probleem in jouw woorden: design-doc loopt drie Rondes achter op `decisions.md`;
de vier AGENTS.md-routers zijn verouderd zonder canonieke detectie; Ronde 11 had
al een sync-stap voorzien (Q12) maar die is nooit geïmplementeerd. Telkens als de
agent een nieuwe canonieke bron of Ronde-lock toevoegt, moeten meerdere files apart
worden bijgewerkt — en dat gebeurt niet altijd. Ronde 15 self-test: ik schreef
`_shared/state-formats-canon.md` en moest daarna op **vier plekken** (umbrella,
djinlabs, webrnds, _shared AGENTS.md) handmatig cross-references toevoegen. Die
hand-edit is precies de drift-trap.

## Locked decisions

### Q1 — Wie is verantwoordelijk voor de sync?

**Besluit: A — Agent verantwoordelijk: Ronde N is alleen done na sync van alle
gerelateerde files.**

De agent die een Ronde afsluit is verantwoordelijk voor sync. Niet een apart
processtap of sync-script. Past bij Ronde 15 self-test en bij de canonieke claim
"Markdown = knowledge" (de discipline hoort in de agent-flow, niet in een canonieke
tool).

**Afgewezen optie:**

- **B — Processtap verantwoordelijk: sync-script draait onafhankelijk van de agent.**
  Verloren omdat (i) een sync-script een nieuwe canonieke tool met eigen onderhoud is,
  (ii) het script de agent-feedback niet kan vervangen, en (iii) twee dragers van
  canonieke waarheid (agent-flow + sync-script) is een anti-patroon.

### Q2 — Wanneer wordt er gesynct?

**Besluit: A — Bij elke Ronde, automatisch (sluit aan op Q1=A).**

Sync gebeurt bij elke Ronde, automatisch. Sluit aan op Q1=A: de discipline zit in
de Ronde-flow zelf, niet in een externe trigger.

**Afgewezen opties:**

- **B — Bij pre-commit: detectie zonder forcering.** Verloren omdat detectie
  zonder actie betekent dat je drift weet maar niet repareert.
- **C — Bij Sunday-audit: wekelijkse scan.** Verloren omdat tegen de tijd dat de
  audit draait de drift al drie Rondes oud is (zoals nu).

### Q3 — Hoe maken we drift structureel onmogelijk?

**Besluit: C — Generator-only: design-doc + AGENTS.md uit `_shared/` en `decisions.md`.**

Design-doc en AGENTS.md-routers worden volledig gegenereerd uit canonieke bronnen.
Geen hand-edits aan die files, alleen generator-output. Maximaal canoniek: er is
geen file meer om uit sync te raken.

**Afgewezen opties:**

- **A — Canonieke sync-discipline-canon met who/when/how.** Verloren omdat
  documenteren niet afdwingt; een canon over discipline zonder enforcement is
  geen discipline.
- **B — Drift-detectie-test bij elke Ronde.** Verloren omdat detectie maar
  repareert niet — de agent moet alsnog zelf syncen.

## Verified facts

- **`--layout-json` voor archify werkt alleen voor architecture en workflow**, niet
  voor lifecycle. Dat was de reden waarom de eerste Ronde 16 visual-poging (lifecycle)
  faalde: de Ronde 15-les was niet toepasbaar. De retry met architecture-schema lukte
  wel in 26 turns.
- **`pending` toont geen `finish`-send meer** na `agent.handled = 11`. Confirmeert
  dat de Finish-flow correct is geactiveerd.
- **`docs/r15-f1-state-formats-plan.md` plan-tasks-generator gaf 20 tasks** voor 7
  hoofdstappen — sub-bullets werden opgeblazen tot eigen items. Generator werkt
  maar is niet "plat genoeg" voor multi-level opsommingen.

## Risks

- **Generator implementatie is Ronde 17-werk.** Dit design-document locked het
  *principe* (generator-only), maar de feitelijke generator-code is niet
  geschreven. Tot die generator bestaat, kan drift nog steeds optreden — alleen
  is de *canonieke eis* nu vastgelegd dat er één moet komen.
- **Tijdens Ronde 14-15 (vóór dit besluit) is er al drift.** Design-doc is
  nog steeds drie Rondes achter op `decisions.md`. Een Ronde 17 moet die drift
  expliciet inlopen — óók volgens de nieuwe discipline (sync hoort bij elke
  Ronde in één stap).
- **Twee bomen (`djinlabs_system_design/` canoniek, `system/design/` werkdir)
  hebben hun eigen canon-files.** Ronde 15 maakte `_shared/state-formats-canon.md`
  in de umbrella, maar `system/design/jev-policy-canon.md` zegt nog "skills-only".
  Onder de nieuwe discipline (Q3=C, generator-only) is dat onmogelijk als beide
  bomen dezelfde generator-source hebben. Dat is niet het geval — beide bomen
  hebben hun eigen files. Generator-only is canoniek-praktisch alleen binnen één
  boom; cross-boom drift blijft een open probleem.
- **`CONTEXT.md` is nog niet bijgewerkt voor Ronde 16.** Capability 9 (Domain-
  modeling bridge) zou de termen `drift`, `sync-discipline`, `lei` tijdens het
  interview naar `CONTEXT.md` moeten schrijven. Dat is niet gebeurd tijdens
  deze Ronde (zoals het hoort). Wordt rechtgezet in deze Finish-flow §Open
  threads.

## Deferred

Geen uitgestelde vragen in deze Ronde.

## Open threads

- **Generator implementatie** — de canonieke eis is vastgelegd, de code niet.
  Volgt in Ronde 17 of later. Tot dan blijft drift-risico bestaan binnen deze
  boom, en cross-boom drift blijft een open probleem.
- **`system/design/jev-policy-canon.md` synchroniseren** met de umbrella-update
  uit Ronde 15. Niet in deze Ronde beslist — vereist een aparte cross-boom-
  sync-discipline (zie Risks).
- **`CONTEXT.md` bijwerken met de drie nieuwe termen** (`drift`, `sync-discipline`,
  `lei`). Wordt rechtgezet in deze Finish-flow §Open threads als
  capability-9-nazending.
- **Drift inlopen voor design-doc** — design-doc is drie Rondes achter op
  `decisions.md`. Onder de nieuwe discipline hoort dat bij de Ronde te gebeuren
  die de drift veroorzaakte (Ronde 12-14), niet in deze Ronde. Volgt bij de
  generator-implementatie of als losse Ronde 17-item.

## Visual

`docs/r16-f9-sync-discipline-visual.html` toont de sync-discipline-pipeline als
architecture-diagram met 6 nodes (`decisions.md`, `_shared/`, `Sync-discipline`,
`Generator`, `design-doc`, `AGENTS.md routers`) en 7 edges (waaronder een dashed
`drift gedetecteerd`-terugloop). Genereerd met archify `--quality showcase`,
`--layout-json` als primary check (Ronde 15+16 les); 9/9 artifact checks groen.
