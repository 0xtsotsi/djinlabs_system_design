# ADR 0001 — Markdown = knowledge, JSON = state

> **Status.** Accepted (Ronde 15, frontier #1).
> **Datum.** 2026-09-21.
> **Vervangt.** Ronde 14/Q14.5 "canonieke bron ≠ runtime-bron (skills-only)" — verbreedt naar canoniek-breed.

## Context

In Ronde 14 (Q14.5) is besloten dat canonieke bronnen en runtime-state-bestanden
verschillende dingen zijn en niet door elkaar mogen worden gebruikt. Die beslissing
was beperkt tot skills (skills-bundles vs runtime-cache).

Drie plekken in de codebase vragen om eenheid:

1. Ronde 14/Q14.5 zelf — *skills-only* was te smal geformuleerd.
2. `_shared/jev-policy-canon.md` noemt `routines.json` en `runs.json` als
   runtime-state-spiegels bij de canonieke bron, zonder canonieke claim te citeren.
3. `research/djinlabs-blombies-fit-research.md` §3 identificeert "Gap: geen state.md
   met YAML-frontmatter" — onder een canoniek principe blijkt dat geen canoniek gat
   te zijn maar een Blobbies-implementatie-keuze.

Het probleem: zonder canoniek principe dat zegt "Markdown = knowledge, JSON = state"
moet elke nieuwe infra- of venture-toevoeging (Tinfoil-provider, Webrnds-Sunday-audit,
Blobbies-host, mogelijke toekomstige tenants) opnieuw beslissen waar de grens ligt.

## Decision

**Markdown is voor kennis. JSON is voor state.**

Een bestand dat regels vastlegt voor mensen, op lange termijn, met versiegeschiedenis,
is Markdown. Een bestand dat een proces tijdens executie leest of schrijft om de
werkelijke toestand van een sessie, een device of een audit-spoor bij te houden, is JSON.

Deze beslissing is canoniek-breed (canon, venture, klant, infra), niet skills-only.
De fysieke plek van deze claim is `_shared/state-formats-canon.md`.

**ADR-bar (alle drie tegelijk):**

1. **Hard to reverse.** De claim heeft precedent-werking op alle toekomstige
   infra/venture/klant-folders. Terugdraaien betekent canoniek werk voor elk daarvan.
2. **Surprising without context.** Voor een nieuwe infra-medewerker die `routines.json`
   in jev-policy-canon.md ziet, lijkt het alsof JSON canoniek mag zijn. Zonder deze
   canon is dat verrassend — `routines.json` is runtime-state, niet canoniek.
3. **Real trade-off.** Breed canoniek principe (kanoniek-breed) versus smal canoniek
   principe (skills-only). Beide zijn verdedigbaar; het verschil is precedent-werk
   later. Gekozen voor breed om herhaling in elke volgende Ronde te vermijden.

## Consequences

**Positief:**

- Nieuwe infra/venture-folders hoeven de grens niet opnieuw te beslissen — ze
  citeren `_shared/state-formats-canon.md`.
- Drift-detectie op bestaande canon-files wordt een mechanische vraag: "noemt deze
  file runtime-state zonder state-formats-canon te citeren?"
- Matrix in `state-formats-canon.md` geeft één plek waar canonieke-bron ↔
  runtime-state-spiegel mappings leven.

**Negatief:**

- Een file die *precies* op de grens zit (bv. JSON-configuratie die als bron
  fungeert) moet expliciet als één van beide geclassificeerd worden — geen
  "config met een sterretje".
- De claim verbreedt Ronde 14/Q14.5; bestaande formuleringen in `decisions.md` of
  elders die nog "skills-only" zeggen moeten op den duur bij.
- Een toekomstige YAML-introductie vereist een ADR-uitbreiding (YAML wordt in deze
  codebase nu niet gebruikt).

**Open:**

- Calibratie-ownership van de matrix canonieke-bron ↔ runtime-state-spiegels: wie
  onderhoudt die als bestanden bijkomen? Niet in deze ADR beslist.
- Drift-detectie als canonieke discipline (Frontier #9) was al open in Ronde 14;
  deze ADR voegt geen oplossing, alleen een extra trigger (matrix-cellen die
  ontbreken).
