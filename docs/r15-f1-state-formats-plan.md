# Plan — Ronde 15 frontier #1: state-formats-canon (v1)

## Solution approach

Eén nieuwe canonieke file schrijven in `_shared/` (`_shared/state-formats-canon.md`),
parallel aan de andere v1-canons. Geen fork of overschrijf van bestaande canon-files;
de nieuwe canon verwijst naar de relevante bestaande passages waar het principe al
half-leeft (Ronde 14/Q14.5 skills-only, jev-policy-canon.md noemt routines.json/runs.json,
blobbies-fit-research §3). Daarna een drift-detectie: welke bestaande canon-files
verwijzen nog naar "skills-only"-formulering en moeten worden bijgewerkt? Een optionele
ADR als de claim de ADR-bar haalt (hard to reverse + surprising + real trade-off).

## Ordered steps

1. **Schrijf `_shared/state-formats-canon.md`** — nieuwe canonieke file met:
   - Vocabulary mapping met termen (canonieke bron, runtime-state, canoniek principe) en
     hun `Avoid`-lijsten.
   - Eén canonieke claim: "Markdown = knowledge, JSON = state".
   - Verwijzingen naar de drie plekken waar het principe al half-leeft.
   - Geen implementatie-spec (geen wire-formaten, geen concrete bestandsnamen behalve
     waar ze al in canon staan).
   - Bewijs-pad: deze file zelf, plus cross-references in `decisions.md` Ronde 15.

2. **Update `_shared/AGENTS.md` index** — voeg `state-formats-canon.md` toe aan de lijst
   van canonieke bronnen in `_shared/`. Geen nieuwe tekst, alleen een lijst-item.

3. **Drift-detectie op bestaande canon-files** — lees:
   - `_shared/jev-policy-canon.md` regel 19, 20, 74, 132 voor plekken waar runtime-state
     files worden genoemd zonder canonieke claim te citeren.
   - `_shared/agent-discipline-canon.md` voor verwijzingen naar "canonieke bron ≠
     runtime-bron" zonodig.
   - `skills-lock.json` of `djinlabs/skills/` voor skills-hosting-verwijzingen.

   Voor elk van die plekken: voeg een cross-reference toe naar
   `_shared/state-formats-canon.md`. Herschrijf geen bestaande formuleringen — alleen
   een cross-reference regel toevoegen.

4. **Decide ADR of niet** — pas de ADR-bar toe (hard to reverse + surprising + real
   trade-off, alle drie tegelijk). Mijn inschatting vooraf: **ja**, want (a) de claim
   "Markdown = knowledge, JSON = state" is canoniek-breed toepasbaar en daardoor
   moeilijk terug te draaien zonder precedent-werking te schenden; (b) zonder deze
   canon lijkt het voor nieuwe infra-medewerkers alsof JSON canoniek mag zijn (niet
   verrassend? wel — want agent-runs.json wordt in jev-policy-canon.md genoemd alsof
   het canoniek zou zijn); (c) er is een echte trade-off (breed vs smal canoniek
   principe, locked in Q1). Maak `docs/adr/0001-state-formats-canon.md` met secties
   Context, Decision, Consequences.

5. **Update `decisions.md`** — voeg een nieuwe Ronde 15 entry toe die locked:
   - Frontiert-item #1 closed.
   - Locked decision: canoniek principe "Markdown = knowledge, JSON = state".
   - Locked decision: fysieke plek is `_shared/state-formats-canon.md`.
   - Verwijzing naar het design-doc en de ADR.
   - Open blijven: drift-detectie op skills-only-formuleringen in bestaande canon-files,
     calibratie-ownership van de matrix.

6. **Sync design-doc + AGENTS.md-routers** — sync-discipline A1 van
   `docs/djinlabs-1-folder-fundamentelen-design.md` zegt: "design-doc is de lei,
   grill-session is de bron". `docs/r15-f1-state-formats-design.md` is al geschreven;
   controlleer dat `AGENTS.md` (umbrella-root + `_shared/` + `djinlabs/`) niets zegt
   dat in tegenspraak is met de nieuwe canon.

7. **Visual-reconciliatie als apart spoor** — registreer in dit plan dat de visual-levering
   een openstaand skill-tool-probleem is (`Users-gogetta-Projects-grill-with-ui/20260921-151220`
   was afgesloten zonder oplossing voor archify validate-vs-deliver divergentie). Deze Ronde
   15 maakt geen nieuwe visual-poging — wacht op een fix in de archify skill.

## Verification per step

1. **Na stap 1**: `node $SKILL/server.mjs` niet relevant hier; in plaats daarvan:
   `cat _shared/state-formats-canon.md` toont alle 4 secties (vocabulary, claim,
   cross-refs, geen-implementatie). Geen `[REDACTED]`-placeholders. Lengte ≤ 150 regels
   (1 onderwerp = 1 file, compact).

2. **Na stap 2**: `grep "state-formats-canon" _shared/AGENTS.md` geeft 1 match.

3. **Na stap 3**: voor elk van de drie bestaande canon-files, `grep
   "state-formats-canon"` geeft ≥ 1 nieuwe match. Geen bestaande regels verwijderd.

4. **Na stap 4**: `ls docs/adr/0001-state-formats-canon.md` bestaat, ≥ 30 regels,
   bevat `## Context`, `## Decision`, `## Consequences`. ADR-bar toegepast in de
   Decision-sectie (drie argumenten).

5. **Na stap 5**: `grep -n "Ronde 15" decisions.md` toont de nieuwe entry.

6. **Na stap 6**: voor elke AGENTS.md, `grep "state-formats-canon"` ≥ 1 of een
   expliciete "geen tegenstrijdige claim" notitie. Voer `git diff` op design-doc om te
   zien dat er geen onverwachte wijzigingen zijn.

7. **Na stap 7**: een regel in `decisions.md` of deze plan file noteert dat de
   visual-levering is uitgesteld.

## Risks

- **Drift tussen deze canon en bestaande code/system/design-files.** Twee verschillende
  bomen (`djinlabs_system_design/` canoniek, `system/design/` werkdir) hebben hun
  eigen `jev-policy-canon.md`. Beide moeten de nieuwe canon noemen, anders blijft
  system/design op "skills-only" staan. Zie design-doc §Risks.
- **Geen visual-levering.** Een eerdere sessie heeft aangetoond dat archify validate
  ≠ archify deliver divergent is. De design-documenteert dat; deze Ronde wacht op een fix.
- **Sync-discipline.** Frontier #9 (sync-discipline herstellen) was al open in Ronde 14.
  Deze Ronde voegt nog een file toe, dus het probleem wordt groter. Niet in scope hier;
  volgt in Ronde 16+.
- **Calibratie-ownership onduidelijk.** Wie onderhoudt de matrix canonieke-bron ↔
  runtime-state-spiegels als die verandert? Niet in scope hier.
