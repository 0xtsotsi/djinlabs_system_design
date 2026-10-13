# Plan — Ronde 16 frontier #9: sync-discipline (v1)

## Solution approach

Eén canonieke file in `_shared/` schrijven die de discipline vastlegt (who/when/how),
parallel aan de andere v1-canons. Geen sync-script bouwen; de discipline zit in de
agent-flow, niet in een tool. De feitelijke *preventie* van drift komt pas in Ronde
17 via een generator die design-doc + AGENTS.md-routers volledig uit canonieke bronnen
genereert. In deze Ronde leggen we alleen het principe vast; de inhaal van bestaande
drift volgt in Ronde 17.

## Steps

1. **Schrijf `_shared/sync-discipline-canon.md`** — nieuwe canonieke file met:
   - Vocabulary (drift, sync-discipline, lei) met Avoid-lijsten.
   - Eén canonieke claim: agent verantwoordelijk voor sync bij elke Ronde (Q1=A).
   - Trigger: elke Ronde done = gesynced (Q2=A).
   - Einddoel: generator-only — design-doc + AGENTS.md-routers zijn generator-output (Q3=C).
   - Geen implementatie-spec (de generator is Ronde 17+).

2. **Update `_shared/AGENTS.md` index** — voeg `sync-discipline-canon.md` toe aan de
   lijst van canonieke bronnen, naast de andere v1-canons.

3. **Update `_shared/jev-policy-canon.md` cross-references** — voeg
   `sync-discipline-canon.md` toe aan de bron-van-waarheid-lijst, met expliciete
   vermelding dat Jev-canon discipline volgt van sync-discipline-canon (omgekeerde
   richting dan Ronde 14).

4. **Drift-detectie trigger** — documenteer in sync-discipline-canon dat de matrix
   uit Ronde 15 (canonieke-bron ↔ runtime-state-spiegels) bij elke Ronde op
   ontbrekende cellen gecontroleerd moet worden. Dit is geen enforcement, alleen
   een trigger die de agent dwingt even te kijken.

5. **Update `CONTEXT.md`** — voeg drie nieuwe termen (`drift`, `sync-discipline`,
   `lei`) toe aan de glossary, met Avoid-lijsten, zoals voor de Ronde 15 termen
   gebeurde. Capability 9-nazending.

6. **Update `decisions.md`** — sluit frontier-item #9 met:
   - Status: CLOSED.
   - Locked decision: sync-discipline-canon in `_shared/`.
   - Cross-reference naar design-doc en ADR (stap 7).
   - Open blijven: generator-implementatie (Ronde 17+), drift inlopen (design-doc
     is drie Rondes achter), cross-boom sync-discipline.

7. **Schrijf `docs/adr/0002-sync-discipline.md`** — ADR met Context, Decision
   (incl. ADR-bar-toetsing: hard to reverse + surprising + real trade-off),
   Consequences. Volgt patroon van ADR 0001 (state-formats-canon).

8. **Update AGENTS.md-routers** — voeg in elke van de vier routers
   (`AGENTS.md`, `djinlabs/AGENTS.md`, `webrnds/AGENTS.md`, `_shared/AGENTS.md`)
   een cross-reference naar `_shared/sync-discipline-canon.md`. Geen nieuwe tekst,
   alleen een lijst-item (zelfde patroon als Ronde 15 voor state-formats-canon).

9. **Sync inhaal design-doc** — niet in deze Ronde (zie plan §Risks). Noteer in
   `decisions.md` Ronde 16-sectie dat dit een open thread is voor Ronde 17, samen
   met de generator-implementatie.

## Verification per step

1. `cat _shared/sync-discipline-canon.md` toont alle 4 secties (vocabulary, claim,
   trigger, einddoel). Geen `[REDACTED]`-placeholders. Lengte ≤ 150 regels.

2. `grep "sync-discipline-canon" _shared/AGENTS.md` geeft 1 match.

3. `grep "sync-discipline-canon" _shared/jev-policy-canon.md` geeft 1 nieuwe match.

4. `grep "matrix" _shared/sync-discipline-canon.md` verwijst naar
   `_shared/state-formats-canon.md#matrix`.

5. `grep -E "^## (drift|sync-discipline|lei)$" CONTEXT.md` geeft 3 matches (naast
   de 6 bestaande).

6. `grep -n "Ronde 16" decisions.md` toont de nieuwe entry, en frontier-item #9 is
   CLOSED.

7. `ls docs/adr/0002-sync-discipline.md` bestaat, ≥ 30 regels, bevat
   `## Context`, `## Decision`, `## Consequences`. ADR-bar-toetsing expliciet in
   Decision-sectie.

8. Voor elke van de 4 AGENTS.md: `grep "sync-discipline-canon"` ≥ 1 match.

9. Geen file-edits aan `docs/djinlabs-1-folder-fundamentelen-design.md`. Noteer in
   `decisions.md` Ronde 16-sectie dat drift-inhaal is uitgesteld.

## Risks

- **Generator implementatie is Ronde 17-werk.** Deze Ronde legt alleen het
  principe vast; de feitelijke preventie blijft tot Ronde 17+.
- **Drift inlopen voor design-doc is uitgesteld** (stap 9). Onder de nieuwe
  discipline hoort dat bij de Ronde die de drift veroorzaakte (Ronde 12-14),
  niet in deze Ronde. Wordt een open thread.
- **Cross-boom drift** (`system/design/jev-policy-canon.md` zegt nog
  "skills-only") is een canoniek gat dat niet door deze Ronde wordt gedekt.
  Generator-only werkt canoniek-praktisch alleen binnen één boom. Vereist een
  aparte cross-boom-sync-discipline (niet in scope).
- **Capability 9 nazending** is geen canonieke patroon — kanonieke discipline
  (Capability 9) hoort tijdens het interview te draaien, niet erna. Ronde 16 is
  een drift-geval geworden: een sync-discipline-sessie die zelf drift veroorzaakt
  door Capability 9 niet tijdens het interview te draaien. Ironisch maar
  niet kritisch.
