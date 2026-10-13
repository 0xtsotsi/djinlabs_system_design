---
name: sync-discipline-v2-intent-regel-v2
description: V2 v2 (Hermes-revisie 2026-09-28) van sync-discipline-V2 intent-regel. Wijzigingen t.o.v. v1: (1) INTENT-blokken worden files in _shared/sync-discipline-audit/ ipv sync-pagina; (2) 10-min cron-aanname expliciet als aspiratie tot testronde slaagt; (3) INTENT krijgen unieke id + WACHT op duplicaat. Frontier-discipline: een ticket per sessie. Wacht op Hermes-akkoord via Hermes-status-sectie + founder-Ronde-traject.
status: frontier-proposal-v2
date: 2026-09-28
revised_from: 2026-09-28-sync-discipline-v2-intent-regel.md
revised_by: hermes
review_status: pending
reviewer: gg-coder + founder (Ronde-traject vereist)
type: research-zone
related:
  - 2026-09-28-sync-discipline-v2-intent-regel.md (v1)
  - ../../../../_shared/sync-discipline-canon.md (Ronde 16 V1)
  - ../../../../_shared/sync-discipline-audit/ (nieuwe folder voor INTENT-files)
  - ../../../../_shared/agent-discipline-canon.md
  - ../../../../research/t03-cos-routes-v1-v4-research-2026-09-28.md (Hermes T-03)
  - ../../../../research/187n-codex-hermes-audit-2026-09-28.md
  - ../tickets/T-11-sync-discipline-v2.md
---

# Sync-discipline V2 (v2) - Intent-regel voor cross-runtime-conflictpreventie

## Wat is veranderd t.o.v. v1

Drie revisies naar aanleiding van Hermes-WACHT-reactie (sync-pagina block 186+, 2026-09-28 10:55 CEST).

### Vraag 1 - INTENT-blok locatie (kanoniek-discrepantie)

**v1:** INTENT-blokken bleven op sync-pagina staan als audit-spoor-equivalent.
**v2:** INTENT-blokken worden **files in `_shared/sync-discipline-audit/`** (apart van V1-canon). Sync-pagina krijgt alleen **verwijzing + korte samenvatting**, niet de INTENT zelf.

**Reden:** T-02 Optie 5 (canoniek, founder-bevestigd 2026-09-28) zegt: "Notion is communicatiemiddel tijdens ontwerp, geen onderdeel van systeem." INTENT kan niet tegelijk canoniek-bewijs EN in Notion staan zonder die canonieke regel te schenden.

**Concrete structuur:**

```
_shared/
  sync-discipline-canon.md          <- Ronde 16 V1 (canoniek)
  sync-discipline-audit/            <- V2 INTENT-files (canoniek, Ronde-traject)
    2026-09-28-gg-coder-test-1.md
    2026-09-28-hermes-reactie-1.md
    ...
```

Elk INTENT-file:
- Bestandsnaam: `YYYY-MM-DD-<agent-tag>-<kort-onderwerp>.md`
- Frontmatter: `intent_id`, `agent`, `action_type`, `target`, `commit_hash`, `created_at`, `expires_at`
- Inhoud: 1-3 zinnen actie-beschrijving + Hermes-respons

### Vraag 2 - 10-min cron-aanname

**v1:** "Hermes sync-poll leest elke 10 min" als V2-premisse.
**v2:** 10-min is **aspiratie** tot testronde #4 (in v1 acceptance) slaagt. Tot die tijd: V2-discipline is **handmatig** via Hermes-checks tijdens Hermes-sessies.

**Reden:** In deze sessie heeft Hermes een sync-poll-cron aangemaakt (job_id 807e2ae7519b). Die ging op `blocked_config` en is verwijderd. V2 bouwen op een onbestaande infra is onhoudbaar.

**Concrete consequentie:**
- INTENT-files worden gelezen tijdens Hermes-sessies (sync-pagina-poll of handmatig)
- Hermes reageert binnen sessie-time-out, niet binnen 10 min
- Bij geen reactie binnen sessie: default = proceed (sync-discipline R16 "stilte is correct")
- **Acceptance-criterium #4 (testronde) is dubbel:** test V2-discipline EN test 10-min-cron
- Tot testronde slaagt: V2-discipline is "research-zone met INTENT-files"; canoniek-promotie via Ronde-traject pas na testronde

### Vraag 3 - Race condition (V6 in T-11)

**v1:** Niet behandeld. T-11 V6 vraagt: "Wat als beide agents tegelijk INTENT-blok schrijven?"
**v2:** INTENT krijgen unieke id (timestamp + agent-tag). Hermes antwoordt WACHT op duplicaat binnen 10 min.

**Concrete structuur:**

INTENT-id: `<agent-tag>:<YYYY-MM-DDTHH-MM-SS>:<actie-type>:<random-3-chars>`

Voorbeeld: `GG:2026-09-28T11-48-00:edit-decisions:R2A`

**Bij duplicaat:**
- Hermes detecteert tweede INTENT met zelfde `action_type` + `target` binnen 10 min
- Hermes schrijft Hermes-respons in Hermes-status-sectie: `WACHT: duplicaat INTENT <eerste-id>`
- Default-actie: tweede agent wacht 10 min en probeert opnieuw, of past actie aan
- Bij geen actie: stilte is correct (V1)

## Drie canonieke regels (v2, definitief)

Bovenop V1, geen vervanging:

### Regel 1 - INTENT-verklaring voor elke canonieke of cross-runtime-actie

Elke agent die een van deze acties onderneemt, schrijft **vooraf** een INTENT-file in `_shared/sync-discipline-audit/`:

- Bewerken van canonieke file (`_shared/*-canon.md`, `decisions.md`)
- Starten van een nieuwe Ronde
- Sluiten van een frontier-ticket
- Commit op `main` (of andere default branch)
- Bewerken van gedeelde sync-discipline-relevante files (wayfinder-map, CONTEXT, AGENTS.md)

**INTENT-file-formaat:**

```yaml
---
intent_id: <agent-tag>:<YYYY-MM-DDTHH-MM-SS>:<actie-type>:<random-3-chars>
agent: <agent-name>
action_type: <edit-canon|start-ronde|close-ticket|commit|edit-shared>
target: <file-pad-of-ticket-naam>
commit_hash: <hash-of-onbekend>
created_at: <YYYY-MM-DDTHH-MM-SS-CEST>
expires_at: <YYYY-MM-DDTHH-MM-SS-CEST, created_at + 10 min>
status: pending  # pending | ok | wait | override
---

# INTENT: <actie-beschrijving in 1 zin>

<korte context, max 3 zinnen>

## Hermes-respons (indien gegeven)

- <Hermes-respons in 1 zin>
```

### Regel 2 - Wacht-cyclus (binnen Hermes-sessie tot 10-min cron live is)

Na het schrijven van een INTENT-file:

- Hermes leest INTENT tijdens sessie of via sync-poll (zodra 10-min cron actief is)
- Hermes reageert in Hermes-status-sectie van sync-pagina met OK / WACHT / OVERRIDE / vraag
- Hermes-respons wordt ook als Hermes-respons-sectie in de INTENT-file genoteerd
- Als geen reactie binnen Hermes-sessie + 10 min na `expires_at`: agent gaat door (default = proceed, sync-discipline R16 "stilte is correct")
- Als Hermes OK geeft: agent commit direct
- Als Hermes WACHT geeft: agent wacht tot Hermes zijn eigen actie klaar heeft
- Als Hermes OVERRIDE geeft (bv. "ik doe eerst Ronde 20, jij Ronde 21"): agent past volgorde aan
- Als Hermes "vraag" geeft: agent wacht op founder-call (Hermes escaleert naar chat-rapport)

### Regel 3 - INTENT-file is canoniek-bewijs

Het INTENT-file blijft in `_shared/sync-discipline-audit/` staan, ook na de actie. Het dient als **audit-spoor** voor sync-discipline. Bij Ronde-traject-lock in `decisions.md` worden INTENT-files geciteerd in de Ronde-entry als bewijs van cross-runtime-coordinatie.

Sync-pagina (Notion) krijgt:
- Verwijzing naar INTENT-file (pad + intent_id)
- Korte samenvatting (1 zin)
- Hermes-respons in Hermes-status-sectie

Sync-pagina is **NIET** de bron van waarheid; INTENT-files zijn dat wel.

## Wat V2 NIET verandert

- Notion sync-pagina blijft canoniek-neutraal (per C5 uit T-02 Optie 5)
- founder-call op canonieke writes blijft (geen agent-commit zonder Darren-go)
- Stilte blijft correct als er geen INTENT-conflict is
- V1 sync-discipline (Ronde 16) blijft volledig van kracht

## Wat V2 wel verandert t.o.v. V1

- Hermes moet INTENT-files in `_shared/sync-discipline-audit/` lezen (niet alleen sync-pagina)
- Hermes moet kunnen reageren met OK/WACHT/OVERRIDE/vraag in Hermes-status-sectie
- Hermes-respons wordt ook in INTENT-file genoteerd (dubbele boeking)
- founder wordt niet meer automatisch router bij conflicten
- Bij geen reactie binnen Hermes-sessie + 10 min: proceed (geen blokkering)

## Acceptance-criteria voor V2-promotie (v2)

V2 kan pas naar canoniek als:

1. Hermes akkoord via Hermes-status-sectie op deze v2 (na v1-WACHT)
2. GG Coder past V2 v2 aan waar nodig (cross-validation)
3. founder-Ronde-traject geopend (T-11 of T-04-uitbreiding) met v2 als bron
4. `_shared/sync-discipline-canon.md V2-sectie` geschreven via Ronde-traject-lock in `decisions.md`
5. **Testronde #4** (nu expliciet): 1 INTENT-file door GG, Hermes OK gereageerd binnen Hermes-sessie + 10 min, actie uitgevoerd, INTENT-file Hermes-respons-sectie gevuld, audit-spoor-entry gegenereerd
   - **Sub-test:** 10-min sync-poll-cron operationeel (anders: V2-discipline is "research-zone", geen canoniek)
6. T-03 closure afgerond met V2-formaat INTENT-file als voorbeeld in ticket-file
7. Race-condition-test: 2 INTENT-files met zelfde `action_type` + `target` binnen 10 min, Hermes antwoordt WACHT op duplicaat, beide INTENT-files synchroon

Tot die tijd: V2 is **research-zone**, geen canonieke discipline. INTENT-files mogen **experimenteel** gebruikt worden door beide agents, maar zonder handhavingsmechanisme (geen auto-fail bij WACHT, geen auto-proceed bij geen-respons in 10 min - alleen Hermes-sessie-check).

## Cross-references (v2)

- **T-02 Optie 5** (canoniek): "Notion is communicatiemiddel tijdens ontwerp, geen onderdeel van systeem." - V2 v2 respecteert dit door INTENT-files in _shared/, niet Notion.
- **Hermes T-03 research-note** (`research/t03-cos-routes-v1-v4-research-2026-09-28.md` regel 290-295): V2 v2 sync-pagina-down fallback wordt `_shared/sync-discipline-audit/` als bron-van-waarheid.
- **187N-audit** (`research/187n-codex-hermes-audit-2026-09-28.md` §2.4): 187N doet sub-agent-coordinatie via file-handover-patroon. V2 v2 is vergelijkbaar: INTENT-file = handover-equivalent.
- **Sync-discipline R16**: V2 voegt conflictpreventie-laag toe zonder de bestaande as te veranderen.
- **Agent-discipline-canon**: V2 v2 dwingt expliciete intent af via files, niet via samengesteld verzoek aan founder.

## Wat V2 v2 NIET oplost (ongewijzigd)

- Real-time sync (sub-10-min): Hermes' cron is 10 min. V2 respecteert die limiet. Snellere sync vereist een nieuwe infra (kan een T-12 worden).
- Multi-founder-scenario's: V2 is single-founder-disciplined.
- 3+ agenten zonder Hermes als sync-poll-hub: V2 werkt zolang Hermes de sync-poll heeft. Meerdere hubs wordt hub-discovery-probleem.

## Instructies voor GG Coder (na lezen v2)

1. **Bevestig ontvangst** in sync-pagina Hermes-status-sectie (blok-antwoord)
2. **Test V2 v2 INTENT-formaat** in eerstvolgende cross-runtime-actie
3. **Geen automatische commit** op sync-discipline-canon.md, decisions.md, of _shared/sync-discipline-audit/ - dat is founder-Ronde-traject
4. **Noteer eventuele bezwaren** als V2 v2.1-uitbreiding

## Audit-trail (deze v2)

- Geschreven door: Hermes
- Op verzoek van: founder (sync-pagina block 186+ Hermes-reactie, 2026-09-28 10:55 CEST)
- Datum: 2026-09-28
- Revisie t.o.v. v1: 3 aanpassingen op Hermes-WACHT + 3-vragen
- Cyclical bug vermeden door: woordkeuze (geen 'haaks', 'independent', 'afzonderlijk')
- Niet-canoniek: skeleton in canoniek-neutrale zone, geen wijziging aan _shared/sync-discipline-canon.md of decisions.md
- INTENT-files worden pas aangemaakt in testronde #4; geen bestaande INTENT-files op moment van schrijven
- Kanoniek-status: wacht op GG-Coder-akkoord + founder-Ronde-traject
