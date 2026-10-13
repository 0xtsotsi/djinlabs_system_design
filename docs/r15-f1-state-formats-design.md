# Ronde 15 frontier #1 — Markdown = knowledge, JSON = state

> **Samenvatting.** Ronde 15 opent met een canoniek-principe-vraag die op drie plekken in de
> umbrella half-uitgesproken leeft: (1) Ronde 14/Q14.5 zegt "canonieke bron ≠ runtime-bron"
> maar beperkt dat tot skills; (2) `_shared/jev-policy-canon.md` noemt `routines.json` en
> `runs.json` naast `handover-*.md`-files; (3) `research/djinlabs-blombies-fit-research.md`
> §3 rij "State files" identificeert expliciet "Gap: geen state.md met YAML-frontmatter".
> Dit design-document locked de canonieke claim (breed, niet skills-only) en kiest de
> fysieke plek waar het principe wordt vastgelegd.
>
> **Visual.** Geen `visual.html` voor deze sessie — een eerdere archify-deliver-poging
> faalde op een strakkere label-clearance check dan `validate` afdekt. Het design-doc
> bevat de matrix die een visual zou tonen (zie §Locked decisions).

## Terms

### canonieke bron

De Markdown-file in `_shared/` of per-tenant die de regels vastlegt. Git-tracked,
mens-leesbaar, lang-cyclisch.

_Avoid_: bron-van-waarheid, spec

### runtime-state

JSON of YAML die een proces tijdens executie leest en schrijft. Kort-cyclisch,
tooling-leesbaar, niet canoniek.

_Avoid_: config, state-met-een-sterretje

### canoniek principe

Een regel die in `_shared/` landt en door alle lagen (canon, venture, klant, infra)
als waarheid wordt behandeld. Vraagt een Ronde in `decisions.md`.

_Avoid_: guideline, conventie

### showcase-pas

De strengere acceptatie-check die `archify deliver` hanteert boven op
`validate --quality showcase`. Omvat 9 artifact-checks waarvan validate er 4 dekt.

_Avoid_: validatie-fase, uitgebreide check

### geometry-clearance

De minimum-vrije-ruimte tussen een relationship-label en de nearest maskerende edge
of node. archify vereist ≥6px label-clearance op viewBox 1600.

_Avoid_: label-gap, edge-spacing

### deliver-fail

Een candidate die validate passeert maar deliver weigert. Komt voor wanneer validate
niet alle 9 artifact-checks dekt. In Ronde 15 vastgesteld door een 100-iteratie-loop
op een architecture-diagram voor deze frontier.

_Avoid_: validatie-fout, build-error

## Why

Het probleem in jouw woorden: zonder canoniek principe dat zegt "Markdown = knowledge,
JSON = state" moet élke nieuwe infra- of venture-toevoeging (Tinfoil-provider,
Webrnds-Sunday-audit, Blobbies-host, mogelijke toekomstige tenants) opnieuw
beslissen waar de grens tussen canonieke kennis en runtime-state ligt. Ronde 14/Q14.5
heeft dit ad-hoc opgelost voor skills, en dat is de canonieke-geur die frontier #1
in `decisions.md` heeft gemarkeerd. De consequentie van *geen* canoniek principe is
drie tot vijf herhalingen van dezelfde discussie in elke volgende Ronde, plus
implementaties die onderling inconsistente keuzes maken.

## Locked decisions

### Q1 — Is "Markdown = knowledge, JSON = state" een canoniek principe?

**Besluit: A — Ja, lock als canoniek principe in deze Ronde.**

Het principe wordt breed (canon, venture, klant, infra), niet beperkt tot skills/Blob-state
zoals Ronde 14/Q14.5 deed. Reden: drie plekken in de codebase vragen om eenheid
(Ronde 14/Q14.5 zelf, jev-policy-canon.md's vermelding van `routines.json`/`runs.json`,
en blobbies-fit-research §3 rij "State files").

**Afgewezen opties:**

- **B — Nee, houd per-project vrijheid.** Verloren omdat het canoniek-principe-vraagstuk
  blijft rondzingen in elke volgende Ronde die infra of venture toevoegt. Ad-hoc vrijheid
  is hier geen keuze maar een uitstel.
- **C — Lock het als canoniek principe, maar dan smal (alleen voor skills/Blob-state).**
  Verloren omdat dit het half-werk van Ronde 14/Q14.5 reproduceert. De volgende
  infra-toevoeging (Tinfoil-provider, Webrnds-Sunday-audit) loopt er weer tegenaan.

### Q2 — Waar landt het principe?

**Besluit: B — Nieuwe `_shared/state-formats-canon.md`.**

Een nieuwe canonieke file, naast de andere v1-canons (`jev-policy-canon.md`,
`retention-policy-canon.md`, `agent-discipline-canon.md`, `icm-canon.md`). Volgt het
canonieke patroon "één onderwerp = één file".

**Afgewezen opties:**

- **A — Uitbreiding op `_shared/icm-canon.md`.** Verloren omdat `icm-canon.md` een
  pointer is naar een externe bron (`community-workflow-kit`), en de Markdown/JSON-grens
  eigen leer is — niet iets wat thuishoort in een pointer-file.
- **C — Sectie in `_shared/jev-policy-canon.md`.** Verloren omdat jev-policy-canon
  scope-specifiek is (alleen Jev-gates); het Markdown/JSON-principe is breder dan Jev.

## Routine choices

Geen — alle vragen in deze sessie waren `durable: true` (Lockable decisions), geen
routine-choices.

## Verified facts

- **Archify deliver vs validate divergentie:** validate accepteert een candidate met
  0 errors op `--quality showcase`, maar deliver weigert dezelfde candidate met een
  label-clearance check (`showcase-pas`). Een 100-iteratie-loop op een architecture-diagram
  voor deze frontier bevestigde dit. Dit is een skill-tool-bug die in een aparte sessie
  (`Users-gogetta-Projects-grill-with-ui/20260921-151220`) is afgesloten zonder oplossing.
  Implicatie voor dit design-doc: geen visual is geëxporteerd; de matrix die het zou tonen
  staat hieronder in matrix-vorm.

- **Matrix canonieke-bron ↔ runtime-state-spiegels (zoals die in de visual zou staan):**

  | Canonieke bron (Markdown, git) | Runtime-state-spiegel (JSON, proces) |
  |---|---|
  | `_shared/jev-policy-canon.md` | `~/.blobbies/blobs/<uuid>/routines.json`, `runs.json` |
  | `_shared/retention-policy-canon.md` | (impliciet — manifests van opslag, geen canonieke file per runtime-state) |
  | `_shared/agent-discipline-canon.md` | (geen directe spiegel; agents zijn folder-state) |
  | `skills/<slug>/SKILL.md` | `~/.blobbies/skills/<slug>/SKILL.md` (Ronde 11 seed_bundled) |
  | `_shared/handovers/handover-*.md` | (geen JSON-spiegel; audit-spoor is de file zelf) |

## Risks

- **Drift tussen deze claim en bestaande code.** De claim "Markdown = knowledge, JSON = state"
  wordt breed canoniek, maar `system/design/jev-policy-canon.md` zegt nog "canonieke bron ≠
  runtime-bron (skills-only)" (regel 232). Die file moet bij de volgende edit-sync mee of
  de umbrella heeft twee canonieke bronnen die elkaar tegenspreken.
- **`_shared/jev-policy-canon.md` noemt `routines.json` en `runs.json` zonder te zeggen dat
  dit JSON is.** De nieuwe `_shared/state-formats-canon.md` moet expliciet maken dat dit
  runtime-state-files zijn, niet canonieke bronnen.
- **blobbies host eigen JSON-config** (`settings.json`, `acp.json`). Onder dit principe is
  dat prima — het is runtime-state. Maar `research/djinlabs-blombies-fit-research.md` §3
  zegt: "Gap: geen state.md met YAML-frontmatter". Dat gap is géén canoniek gat; het is een
  Blobbies-implementatie-keuze. De canon zegt niet dat runtime-state frontmatter moet
  hebben, alleen dat canonieke bronnen Markdown zijn.
- **Tooling-pad niet canoniek.** Als een runtime-tool YAML moet lezen in plaats van JSON
  voor een canonieke bron, breekt dat deze claim. YAML is geen Markdown; staat niet in scope.

## Deferred

Geen uitgestelde vragen in deze sessie.

## Open threads

Discussie-punten die eindigden zonder beslissing:

- **Hoe wordt de matrix uit "Verified facts" onderhouden?** Wordt dit een verplichte sectie
  in elke nieuwe canon-file, of een aparte `_shared/state-formats-canon.md`-appendix? Niet
  in deze Ronde beslist — kan in Ronde 16+ terugkomen.
- **Calibratie-ownership (van de vorige notule §5 vraag 7).** Wie onderhoudt de
  matrix als nieuwe canonieke bronnen of runtime-state-files bijkomen? Niet
  in scope voor deze Ronde.
- **Visual-levering na de archify-bug.** Het design-doc heeft geen `*-visual.html`. Dat is
  een skill-tool-probleem, geen design-beslissing. Volgt in een aparte sessie.

## Visual

Geen `docs/r15-f1-state-formats-visual.html` voor deze sessie. De matrix die een visual
zou tonen staat in §Verified facts.
