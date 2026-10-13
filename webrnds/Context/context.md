# Context — Webrnds (venture-level)

> Runtime-truth voor de Webrnds-venture. Venture-niveau = boven de
> per-fase `CONTEXT.md`'s. Elke agent die hier landt leest dit eerst
> (na de mono-repo `Context/context.md`). Eigenaar reviewed wijzigingen.

## Wat is Webrnds

Webrnds is de **uitvoerende onderneming** onder het DjinLabs-template.
KVK-ingeschreven. Levert Codavo-shape diensten aan Nederlands MKB
(techniek, logistiek, SaaS, klinieken, etc.):
websites, webapps, klantportalen, API-koppelingen, AI-integraties,
GEO/AI-vindbaarheid, SaaS MVP.

Naam: **W**eb + **r**esearch **a**nd **D**evelopment **S**ervice
(Ronde 1/Q5). "rnds" is afkorting, niet uitgesproken.

## Venture-state

- **Sub-router:** `webrnds/AGENTS.md`.
- **Status:** skeleton-only (Ronde 19 lock).
- **Pipeline:** 6 fasen (zie beneden).
- **Instance rules:** `_rules.local.md`.
- **Revenue model:** hybrid (platform-licentie DjinLabs-template + Codavo-shape bouwdiensten). DjinLabs-kosten zitten als interne kostenpost op Webrnds' boeken — geen inter-company factuur (DjinLabs heeft geen KVK, Ronde 1/Q3).
- **Done-definitie** (uit `start.md`):
  1. ≥1 klant succesvol door alle 6 fasen zonder ad-hoc-workarounds.
  2. Cap van 3 actieve reizen per klant afgedwongen zonder bypass.
  3. Folder-shape-hook reproduceerbaar (niet één keer handmatig).

## Architectuur — de 6-fasen pipeline

| # | Fase | Map | Doel |
|---|---|---|---|
| 1 | Research | `01-research/` | Marktonderzoek, niches, ICP-refinement. Geen klant-dossiers. |
| 2 | Offer | `02-offer/` | Dienst-paletaanpassing, prijspunten, pitch-decks. |
| 3 | Market | `03-market/` | Outreach, lead-generatie, marktkanalen. |
| 4 | Close | `04-close/` | Intake, contract, kickoff. Klant-folder start hier. |
| 5 | Produce | `05-produce/` | Bouw, agent-instantiation per klant, levering. |
| 6 | Na-livegang | `06-na-livegang/` | Onderhoud, retentie, groei-spots. |

Numbered = sequence. Per-fase `CONTEXT.md` beschrijft het canonieke
proces (zie `01-research/CONTEXT.md` als voorbeeld-template).

## Wat hoort waar (factory/product split)

- **Stable (factory):** `AGENTS.md`, `start.md`, `state.md`, dit bestand,
  `Context/`, `_rules.local.md`, `_internal/`, `_templates/`, `skills/`.
- **Per-instance (per klant):** `clients/<slug>/klantreis-<id>/`.
  Klant-slugs: lowercase-hyphenated bedrijfsnaam, geen PII (U3).
- **Per-run:** artifacts in de relevante fase-folder met
  `review_status: pending|reviewed|paused` in frontmatter (Ronde 16+).
- **Archief:** `clients/<slug>/_archive/` voor afgeronde reizen.

## Decision rules (Webrnds-niveau)

| Actie | Eigenaar | Agent | Notitie |
|---|---|---|---|
| Bestand schrijven in `webrnds/`, `01..06/`, `_internal/`, `_templates/`, `skills/` | ✅ | ✅ (COS) | default-machtiging |
| Bestand schrijven in `clients/<slug>/` | ✅ | ✅ draft | klant-PII valt onder U3 |
| Offerte / contract / geld-flow | ✅ | ❌ | founder-only |
| `clients/<slug>/klantreis-<id>/` aanmaken | ✅ | ✅ via folder-shape-hook | cap van 3 (zie `_rules.local.md`) |
| Mail versturen naar klant | ✅ | ❌ (draft only) | approval needed |
| Bestand schrijven in mono-repo `Context/`, `_shared/`, `decisions.md` | ✅ | ❌ | Ronde-proces voor `_shared/`, founder voor `decisions.md` |
| Bestand schrijven in `/djinlabs/` | ✅ | ✅ draft | experimenten, nooit klantdata (Q12.1a) |

## Sync-discipline (per `_shared/sync-discipline-canon.md`)

- Bij elke wijziging in `webrnds/`: check of `AGENTS.md`,
  `start.md`, `state.md`, dit `Context/context.md`, of een fase-
  `CONTEXT.md` mee gesynced moet worden. Drift-detectie: `research/
  r18-f0-design-doc-drift-inventarisatie.md`.
- Webrnds-spec canon: `_rules.local.md` (Ronde 8/Q8.2 cap). Niet in
  `_shared/` — die is universeel, niet venture-spec.

## Per-fase Context/ pattern

Elke fase-map (`01..06/`) heeft een `CONTEXT.md` met dezelfde structuur:

1. **Wat hier woont** — wat hoort hier, wat hoort hier NIET.
2. **Process** — trigger, input, actie, output, human check, volgende stap.
3. **Verboden** — anti-patterns en U-rules die hier extra gelden.

Zie `01-research/CONTEXT.md` als referentie-template. Nieuwe fasen
volgen hetzelfde patroon (bij uitbreiding van het model).

## Templates

- `_templates/fase-template/` — voor nieuwe fase-mappen (bij uitbreiding).
- `_templates/klantreis-template/` — voor nieuwe klantreizen.
- `_internal/CONTEXT.md` — R&D + leer-artefacten + Webrnds-spec
  experimenten.
- `skills/CONTEXT.md` — klant-spec wrapper-templates per fase.
- `_archive/CONTEXT.md` — voor afgeronde klantreizen (regels voor
  archivering).

## Routing binnen Webrnds

| Vraag | Ga naar |
|---|---|
| Wat doet Webrnds, wat is de pipeline? | `start.md` (purpose) + `Context/context.md` (deze file) |
| Hoe zit een specifieke fase in elkaar? | `0X-<fase>/CONTEXT.md` |
| Welke instance-rules gelden? | `_rules.local.md` |
| Welk template past bij dit werk? | `_templates/<template>/` |
| Hoe schrijf ik een agent-wrapper voor klant X? | `skills/CONTEXT.md` |
| Hoe zit het met R&D en leer-artefacten? | `_internal/CONTEXT.md` |
| Wat is er net gebeurd in Webrnds? | `state.md` |
| Hoe zit Webrnds in de mono-repo? | `Context/map.md` + mono-repo `Context/context.md` |

## Open frontier (Webrnds-spec)

| ID | Onderwerp | Wacht op |
|---|---|---|
| W-01 | Eerste echte klant via folder-shape-hook (om skeleton te valideren) | founder-call + concrete klant |
| W-02 | Agent-wrapper-templates in `skills/` | W-01 eerst |
| W-03 | Klantfolder-template invulling in `_templates/klantreis-template/` | W-01 eerst |
| W-04 | Per-fase `CONTEXT.md` voor `02-offer/` t/m `06-na-livegang/` (alleen 01 is ingevuld) | kan parallel, geen blocker |
| W-05 | Eve + Convex als Webrnds client-setup-patroon (Ronde 19 motie 5) | founder-call + W-01 |

## Hoe een agent dit leest

1. Lees mono-repo `Context/context.md` (1 keer, sessie-start).
2. Lees deze file (venture-niveau).
3. Lees `AGENTS.md` voor detail-router binnen Webrnds.
4. Open de fase-`CONTEXT.md` waar je aan werkt.
5. Raadpleeg `_rules.local.md` voor instance-rules.
6. Bij twijfel: stop en vraag. Geen klantdata in `/djinlabs/`,
   geen write buiten Webrnds tenzij expliciet toegestaan.

Wijzigingen aan deze context: edit hier, commit (founder-only).
Niet breken met Ronde-besluit of mono-repo `Context/context.md`.
