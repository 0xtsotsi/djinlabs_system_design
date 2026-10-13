# ADR 0002 — Sync-discipline (agent verantwoordelijk, elke Ronde, generator-only)

> **Status.** Accepted (Ronde 16, frontier #9).
> **Datum.** 2026-09-21.
> **Vervangt.** Frontier-item #9 (sync-discipline herstellen) — open sinds Ronde 14+.

## Context

Frontier #9 (uit `decisions.md`) stelde drie orthogonale vragen over sync-discipline:

1. **Wie synct design-doc en AGENTS.md-routers?** Ronde 15 self-test maakte
   duidelijk dat een nieuwe canonieke bron (`_shared/state-formats-canon.md`)
   op vier plekken handmatig een cross-reference vereiste — geen mechanisme
   voorkwam dat ik die hand-edit vergat.
2. **Wanneer wordt er gesynct?** Geen canonieke trigger. Drift werd ad hoc
   ontdekt (design-doc drie Rondes achter op `decisions.md`) of bij toeval
   tijdens een Ronde.
3. **Hoe maken we drift structureel onmogelijk?** Geen canoniek antwoord.
   Ronde 11 had al een sync-stap voorzien (Q12) maar die was nooit als
   canonieke discipline vastgelegd.

Het probleem: zonder canonieke discipline wordt elke nieuwe canonieke bron
een potentiële drift-bron. Elke Ronde kan drift zaaien, en er is geen
afspraak over wie dat detecteert of repareert.

## Decision

Drie orthogonale assen, één locked antwoord per as:

1. **Q1 = A — Agent verantwoordelijk.** De agent die een Ronde afsluit is
   verantwoordelijk voor sync. Niet een apart processtap of sync-script.
   Past bij `_shared/state-formats-canon.md` ("Markdown = knowledge"): de
   discipline hoort in de agent-flow (Markdown), niet in een canonieke tool
   met eigen onderhoud (zou runtime-state zijn).

2. **Q2 = A — Bij elke Ronde.** Sync gebeurt bij elke Ronde, automatisch.
   Geen pre-commit-detectie zonder forcering, geen wekelijkse audit.
   Past bij Q1=A: de discipline zit in de Ronde-flow zelf.

3. **Q3 = C — Generator-only.** Design-doc en AGENTS.md-routers worden
   volledig gegenereerd uit canonieke bronnen. Geen hand-edits aan die
   files, alleen generator-output. Maximaal canoniek: er is geen file
   meer om uit sync te raken.

De fysieke plek van deze claim is `_shared/sync-discipline-canon.md`. De
canonieke bron is deze ADR + de canon + de frontier-sluiting in `decisions.md`
Ronde 16-sectie.

**ADR-bar (alle drie tegelijk):**

1. **Hard to reverse.** De claim heeft precedent-werking op alle toekomstige
   Ronde-flows. Terugdraaien betekent herziening van elke Ronde-sectie in
   `decisions.md`, alle ADR's die erna kwamen, en alle design-doc-sync die
   onder de discipline is gedaan.
2. **Surprising without context.** Voor een agent die een nieuwe canon-source
   schrijft zonder deze discipline te kennen, lijkt het normaal om alleen
   die source te committen. Zonder sync-discipline is het verrassend dat
   design-doc drie Rondes achter kan lopen zonder canonieke detectie.
3. **Real trade-off.** Drie opties (canon met who/when/how, drift-detectie-test,
   generator-only) zijn alle verdedigbaar; het verschil is precedent-werk
   later. Gekozen voor generator-only omdat dat de enige optie is die drift
   structureel onmogelijk maakt — detectie en documentatie laten drift
   bestaan, alleen de generator (indien geïmplementeerd) sluit het gat.

## Consequences

**Positief:**

- Elke Ronde heeft een canonieke check-list: `decisions.md`, frontier-lijst,
  ADR, `CONTEXT.md`, AGENTS.md-routers, design-doc. Agent-flow wordt voorspelbaar.
- Drift op ontbrekende matrix-cellen in `state-formats-canon.md` wordt een
  mechanische vraag die bij elke Ronde gesteld wordt.
- Generator-only is een einddoel dat precedent-werk later vermijdt: één
  generator, één bron van waarheid voor design-doc en AGENTS.md-routers.

**Negatief:**

- Generator-implementatie is Ronde 17+ werk. Tot die generator bestaat, kan
  drift nog steeds optreden — alleen is de *canonieke eis* vastgelegd.
- Tussentijdse hand-edits aan design-doc en AGENTS.md-routers zijn toegestaan
  maar moeten in `decisions.md` Ronde-sectie expliciet vermeld worden als
  "pre-generator hand-edit". Extra boekhouding per Ronde.
- Cross-boom drift (`system/design/jev-policy-canon.md` zegt nog "skills-only")
  is een canoniek gat dat niet door deze ADR wordt gedekt. Generator-only
  werkt canoniek-praktisch alleen binnen één boom. Vereist een aparte
  cross-boom-sync-discipline (niet in scope).

**Open:**

- Generator-code: welke taal, welke triggers, hoe wordt canon-input gelezen?
  Ronde 17+.
- Drift inlopen voor design-doc: design-doc is drie Rondes achter op
  `decisions.md`. Onder de nieuwe discipline hoort dat bij de Ronde die de
  drift veroorzaakte (Ronde 12-14), niet in deze Ronde. Volgt bij de
  generator-implementatie of als losse Ronde 17-item.
- `system/design/jev-policy-canon.md` synchroniseren: cross-boom discipline
  is een canoniek gat. Volgt in een latere Ronde.
