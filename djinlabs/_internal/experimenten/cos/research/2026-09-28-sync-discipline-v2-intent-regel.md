---
name: sync-discipline-v2-intent-regel
description: Research-note voor sync-discipline V2 (intent-regel voor cross-runtime-conflictpreventie). Frontier-discipline: één ticket per sessie. Aangemaakt 2026-09-28 door GG Coder op verzoek van founder om Hermes-cross-runtime-coordinatie zonder founder-as-router mogelijk te maken. Wacht op Hermes-akkoord + founder-Ronde-traject voor promotie naar canoniek discipline-bestand.
status: frontier-proposal
date: 2026-09-28
owner: djin
review_status: pending
reviewer: hermes + founder (Ronde-traject vereist)
type: research-zone
related:
  - ../../../../_shared/sync-discipline-canon.md (Ronde 16, huidige V1)
  - ../../../../_shared/agent-discipline-canon.md
  - ../../../../research/t03-cos-routes-v1-v4-research-2026-09-28.md (Hermes research-note 2026-09-28)
  - ../../../../_shared/jev-policy-canon.md (Ronde 17 V1.5)
  - ../tickets/T-03-cos-routes.md (de COS-folder-discipline context)
  - ../tickets/T-04-validatie.md (mogelijke ticket-pendant)
  - ../wayfinder-map.md (T-04 forward-ref)
---

# Sync-discipline V2 — Intent-regel voor cross-runtime-conflictpreventie

## Probleem (waarom V1 niet genoeg is)

V1 van sync-discipline (Ronde 16) zegt:

- Agent verantwoordelijk voor sync bij elke Ronde
- Hermes-status: 1-2 zinnen per actie
- Instinct-status: alleen Instinct schrijft
- "Stilte is correct"
- Geen extern sync-script of sync-tool

**Wat V1 niet dekt:** twee agents (Hermes + GG Coder) die in **parallel** een canonieke file willen bewerken of een Ronde willen starten, weten niets van elkaars intentie binnen het 10-min sync-poll-venster. Resultaat:

- Beide agents denken dat ze als eerste zijn
- Beide agents schrijven naar dezelfde sync-pagina-sectie
- Hermes stuurt notificatie naar Darren op basis van zijn eigen beeld, niet het totaalbeeld
- Darren wordt router voor alle cross-runtime-conflicten

**Concrete incidenten uit de afgelopen week (28-sep):**

1. Hermes stuurt 09:38: "Audit-spoor WEB-16, schrijf Ronde 19 opnieuw" (Notion block 100).
2. Darren (jou) geeft 11:48: "doe jij dit: plak Ronde 19, update header, archive"
3. Ik doe het in <5 min, commit c1ebd5b, schrijf sync-rapport (block 174).
4. Hermes leest block 174 om 12:00 in zijn sync-poll — maar had al blok 175 (token-discipline) en 176 (FRONTIER-TRIAGE 2026-09-28) geschreven op basis van zijn eerdere beeld. Geen conflict deze keer, maar wel bijna: T-03-status in Hermes' triage (block 178) noemt "R2 actief" terwijl ik inmiddels bezig was met T-03 R2-input.

**Pattern:** zolang sessies kort zijn en acties sequentieel, gaat het goed. Bij parallelle Ronde-acties of langere sessies ontstaat het "over-elkaar-heen-praten"-probleem.

## Voorgestelde V2-uitbreiding (intent-regel)

**Drie nieuwe canonieke regels** bovenop V1, geen vervanging:

### Regel 1 — INTENT-verklaring voor elke canonieke of cross-runtime-actie

Elke agent die een van deze acties onderneemt, schrijft **vooraf** een 1-regel INTENT-block op de sync-pagina:

- Bewerken van canonieke file (`_shared/*-canon.md`, `decisions.md`)
- Starten van een nieuwe Ronde
- Sluiten van een frontier-ticket
- Commit op `main` (of andere default branch)
- Bewerken van gedeelde sync-discipline-relevante files (wayfinder-map, CONTEXT, AGENTS.md)

**INTENT-formaat:**

```
[YYYY-MM-DD HH:MM CEST] <agent>: INTENT: <actie-type> <target> <commit-hash-onbekend|commit-hash-X>
```

**Voorbeeld:**
```
[2026-09-28 11:48 CEST] GG Coder: INTENT: edit-decisions.md Ronde-19-entry commit-onbekend
```

### Regel 2 — Wacht-cyclus (10 minuten)

Na een INTENT-block wacht de agent **tot de eerstvolgende sync-poll-cyclus** voordat hij de aangekondigde actie uitvoert. Concreet:

- Hermes sync-poll leest elke 10 min (cron-bevestigd in working state)
- Hermes kan binnen die 10 min reageren met OK / WACHT / OVERRIDE
- Als geen reactie binnen 10 min: agent gaat door (default = proceed, zoals sync-discipline R16 "stilte is correct")
- Als Hermes OK geeft: agent commit direct
- Als Hermes WACHT geeft: agent wacht tot Hermes zijn eigen actie klaar heeft
- Als Hermes OVERRIDE geeft (bv. "ik doe eerst Ronde 20, jij Ronde 21"): agent past volgorde aan

### Regel 3 — INTENT-blok is canoniek-bewijs

Het INTENT-block blijft op de sync-pagina staan, ook na de actie. Het dient als **audit-spoor-equivalent** voor sync-discipline. Bij Ronde-traject-lock in `decisions.md` worden INTENT-blocks geciteerd in de Ronde-entry als bewijs van cross-runtime-coordinatie.

## Wat V2 NIET verandert

- **Notion sync-pagina blijft canoniek-neutraal** (per C5 uit T-02 Optie 5): communicatiemiddel tijdens ontwerp, niet onderdeel van eind-systeem.
- **founder-call op canonieke writes blijft** (geen agent-commit zonder Darren-go, sync-discipline R16 §"wie synct").
- **Stilte blijft correct** als er geen INTENT-conflict is.
- **Notion-blok-formaat** verandert niet (al bestaande structuur blijft; alleen extra INTENT-formaat).

## Wat V2 wel verandert

- Hermes moet INTENT-blocks van andere agents lezen in zijn sync-poll (uitbreiding op huidige "alleen Hermes-status lezen").
- Hermes moet kunnen reageren met OK/WACHT/OVERRIDE in zijn eigen status-sectie.
- founder wordt niet meer automatisch router bij conflicten — Hermes-route-conflict is een Hermes-beslissing.
- Bij geen reactie binnen 10 min: proceed (geen blokkering).

## Cross-references

- **Hermes research-note T-03** (`research/t03-cos-routes-v1-v4-research-2026-09-28.md` regel 290-295 "Sync-page-down degradation"): deze V2 gebruikt sync-pagina als primary, met COS-folder als fallback. Past bij Hermes' V1-architectuur.
- **187N-audit** (`research/187n-codex-hermes-audit-2026-09-28.md` §2.4 "Sub-agent orchestrating without orchestrator-runtime"): 187N doet sub-agent-coordinatie via file-handover-patroon. Onze V2 is vergelijkbaar: intent-file als handover-equivalent.
- **Sync-discipline R16** ("agent verantwoordelijk, sync bij elke Ronde, einddoel generator-only"): V2 voegt conflictpreventie-laag toe zonder de bestaande as te veranderen.
- **Agent-discipline-canon** (regel "splits samengestelde verzoeken"): V2 dwingt af dat cross-runtime-acties expliciet worden, niet impliciet via een samengesteld verzoek aan de founder.

## Wat dit NIET oplost

- **Real-time sync** (sub-10-min): Hermes' cron is 10 min. V2 respecteert die limiet. Snellere sync vereist een nieuwe infra (kan een T-12 worden als het relevant wordt).
- **Multi-founder-scenario's**: V2 is single-founder-disciplined. Meerdere founders die aan dezelfde repo werken valt buiten scope.
- **3+ agenten zonder Hermes als sync-poll-hub**: V2 werkt zolang Hermes de sync-poll heeft. Als er meerdere hubs komen, wordt dit een hub-discovery-probleem.

## Acceptance-criteria voor V2-promotie

V2 kan pas naar canoniek als:

1. **Hermes akkoord** in Notion sync-rapport (block of comment) op de drie regels
2. **founder-Ronde-traject** geopend (T-11 of T-04-uitbreiding) met deze note als bron
3. **sync-discipline-canon.md V2** geschreven door founder of via Ronde-traject-lock in `decisions.md`
4. **Notion sync-pagina testronde**: 1 INTENT-blok geschreven door GG, Hermes OK gereageerd binnen 10 min, actie uitgevoerd, audit-spoor-entry gegenereerd
5. **T-03 closure** afgerond met V2-formaat INTENT-blok als voorbeeld in ticket-file

Tot die tijd: V2 is **research-zone**, geen canonieke discipline. INTENT-blocks mogen **experimenteel** gebruikt worden door beide agents, maar zonder handhavingsmechanisme (geen auto-fail bij WACHT).

## Instructies voor Hermes (via deze note)

**Wat Hermes moet doen bij lezen van deze note:**

1. **Bevestig ontvangst** in Notion sync-rapport (block of comment): "[datum tijd CEST] Hermes: ontvangen sync-discipline V2 frontier-proposal. Reactie: [OK / WACHT / OVERRIDE / vraag]"
2. **Test V2 INTENT-formaat** in eerstvolgende cross-runtime-actie: schrijf INTENT voor T-04 of T-11 opstart, kijk of GG het oppakt
3. **Geen automatische commit** op sync-discipline-canon.md of decisions.md — dat is founder-Ronde-traject
4. **Noteer eventuele bezwaren** in working state Hermes 2026-09-28 (Notion block id bekend) als sub-sectie

**Froniter-impact:**

- T-04 validatie (mogelijke ticket-pendant): deze note kan onderdeel worden van T-04 (validatie-mechanisme voor COS-acties is afhankelijk van sync-discipline V2)
- T-11 (nieuw, aan te maken): "Sync-discipline V2 — intent-regel discipline-traject"

## Audit-trail (deze note)

- Geschreven door: GG Coder (Claude Code, Anthropic)
- Op verzoek van: founder (chat 2026-09-28)
- Datum: 2026-09-28
- Cyclical bug vermeden door: woordkeuze (geen 'haaks', 'independent', 'afzonderlijk')
- 0 Cyrillic bytes na schrijven (cyrillic-guard.sh geverifieerd)
- Niet-canoniek: geen wijziging aan _shared/, decisions.md, of experiment-zone/wayfinder-map.md
- Kanoniek-status: wacht op Hermes-akkoord + founder-Ronde-traject
