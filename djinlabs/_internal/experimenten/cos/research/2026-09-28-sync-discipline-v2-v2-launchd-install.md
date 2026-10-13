---
name: sync-discipline-v2-v2-launchd-install
description: Research-onderbouwing voor V2 v2 (launchd plist-installatie). Verwerkt Hermes WACHT-blok 188-190 aanpassingen + 6 founder-call-antwoorden + race-condition-ID-conventie. Geschreven door GG Coder 2026-09-28 op expliciet founder-verzoek ("ja do maar"). Niet canoniek. Hermes maakt canonieke V2 v2 file na review; founder doet feitelijke installatie (Hermes-frontier-discipline: Hermes installeert niet zelf).
status: research-onderbouwing
date: 2026-09-28
owner: djin
review_status: pending
reviewer: hermes (canoniek-traject) + founder (installatie-go)
type: research-zone
predecessor: 2026-09-28-v2-implementation-skeleton.md
follows-up-on:
  - 2026-09-28-v2-implementation-skeleton.md (Hermes' V2 frontier-proposal met 5 aanpassingen + 3 aanvullingen)
  - 2026-09-28-v2-testronde-poll-mechanisme.md (3 implementaties: plist / shell-loop / claude-code-p)
  - 2026-09-28-sync-discipline-v2-intent-regel-v2.md (Hermes' V2 frontier-met-WACHT 188-190)
  - ../../../../_shared/sync-discipline-canon.md (Ronde 16 V1, target V2-promotie via Ronde 20-traject)
related:
  - ../tickets/T-11-sync-discipline-v2.md (T-11 frontier-ticket)
  - ../tickets/T-03-cos-routes.md (R2 closure, 6/6 tests, founder-bevestigd)
  - ../tools/cyrillic-guard.sh (helper-script guard)
---

# Sync-Discipline V2 v2 — Launchd Install Research-Onderbouwing

## Doel van deze note

**Niet** canoniek. Geen schrijfactie naar `_shared/sync-discipline-canon.md` (Ronde 16 + Ronde 20-traject).

**Wel:** research-zone onderbouwing voor Hermes' canonieke V2 v2 file en voor de founder-installatie van launchd plist + keychain-entry. Bewust-niet-eind-systeem (T-02 Optie 5 C5): resultaten van testronde #4 zijn onderzoeksdata voor Ronde 20-traject, geen canon-promotie zonder Ronde-traject.

**Vereiste voor lezer:** lees eerst `2026-09-28-v2-implementation-skeleton.md` (Hermes' frontier-proposal met 5 aanpassingen + 3 aanvullingen + 10+1 acceptance-criteria). Deze note verwerkt Hermes WACHT-blok 188-190 closures daarop.

## Hermes WACHT-blok 188-190 — closures

Hermes' frontier-proposal had 3 punten die expliciet WACHT stonden op deze note (zie `sync-discipline-v2-intent-regel-v2.md` en Notion sync-pagina block 188-190). Alle drie zijn hieronder gesloten.

### Closure 1 — V2-INTENT files in `_shared/sync-discipline-audit/`

**WACHT:** "V2-INTENT-blokken moeten files worden in `_shared/sync-discipline-audit/` (separate van V1-canon)".

**Resolutie:** Intent-blokken van V2 leven in aparte folder `_shared/sync-discipline-audit/` als losse markdown-files, niet als inline content in `_shared/sync-discipline-canon.md`. V1-canon blijft onveranderd tot Ronde 20-traject dat beslist of V2 V1 gedeeltelijk vervangt, aanvult, of alleen voor testronde-doeleinden blijft.

**Structuur:**

```
_shared/sync-discipline-audit/
├── INTENT-2026-09-28T1430-HRM-a1b.md    (Hermes INTENT, agent-tag HRM)
├── INTENT-2026-09-28T1435-GG-x9k.md     (GG Coder INTENT, agent-tag GG)
├── VERDICT-2026-09-28T1436-HRM-a1b.md   (Hermes VERDICT na Jev-call)
└── README.md                             (audit-trail-uitleg)
```

Per V1.1 stopconditie: 1 sync-pagina snapshot na closure van V2-traject, niet per INTENT.

### Closure 2 — 10-min aanname is aspiratie, geen garantie

**WACHT:** "10-min aanname is aspiratie tot testronde #4 slaagt".

**Resolutie:** De BeginInterval=600 in de plist is een aspiratie-getal. Real-time is binnen 10 min in de **mediane** run, niet in alle runs. Testronde #4 meet dit empirisch:

- Sub-test A: 2 opeenvolgende polls met timestamps ~600s uit elkaar (10 min ±60s tolerantie)
- Sub-test B: race-condition Hermes WACHT — 2 INTENT-blokken binnen 10 min, tweede krijgt Hermes-respons WACHT op duplicaat

Als sub-test A faalt (poll komt na >660s), is de aspiratie te streng en wordt 600s verhoogd naar 900s of 1200s in Ronde 20-traject. Tot testronde #4 is geslaagd, blijft 600s een hypothesis.

### Closure 3 — Race-condition-ID-conventie

**WACHT:** "Race-condition-ID-conventie met timestamp + agent-tag + random-3-chars suffix".

**Resolutie:** Elke INTENT krijgt een ID in de vorm `INTENT-<ISO8601-timestamp>-<agent-tag>-<random-3-chars>`. Voorbeelden:

- `INTENT-2026-09-28T1430-HRM-a1b` (Hermes, 14:30:00, random suffix a1b)
- `INTENT-2026-09-28T1435-GG-x9k` (GG Coder, 14:35:42, random suffix x9k)

**agent-tags:**

- `HRM` = Hermes
- `GG` = GG Coder
- `FND` = founder (Darren) — zelden, alleen bij expliciete founder-INTENT
- `JEV` = Jev-gestuurde INTENT (audit-trail voor automatische classificatie)

**Random 3-chars suffix:** lowercase letters + digits, 36^3 = 46656 mogelijkheden per minuut. Collision-kans verwaarloosbaar bij <100 INTENTs per minuut.

**Gebruik:** race-condition resolution = INTENT met nieuwere timestamp + niet-verwerkte VERDICT wint. Audit-folder toont chronological order zonder dat folder-volgorde de canonieke order is.

## Plist-spec (Hermes Implementation 1 uit v2-implementation-skeleton.md)

**Bestemming:** `~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist`

**Inhoud** (volledig, copy-paste-klaar voor founder):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.djinlabs.hermes-sync-poll</string>

    <key>ProgramArguments</key>
    <array>
        <string>/Users/gogetta/.hermes/bin/hermes-sync-poll.sh</string>
    </array>

    <key>StartInterval</key>
    <integer>600</integer>

    <key>BeginInterval</key>
    <integer>0</integer>

    <key>RunAtLoad</key>
    <true/>

    <key>StandardOutPath</key>
    <string>/Users/gogetta/.hermes/logs/hermes-sync-poll.log</string>

    <key>StandardErrorPath</key>
    <string>/Users/gogetta/.hermes/logs/hermes-sync-poll.err</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin</string>
    </dict>
</dict>
</plist>
```

**Velden uitgelegd:**

- `Label` = unieke identifier voor launchd. Conventie: reverse-DNS `com.<organisatie>.<agent>-<doel>`.
- `ProgramArguments` = pad naar helper-script. Absolute pad, geen symlink-resolutie nodig.
- `StartInterval=600` = herhaal elke 600 seconden (10 min aspiratie, zie Closure 2).
- `BeginInterval=0` = direct eerste trigger bij laden. Hermes-aanpassing 1: voorkomt dat eerste poll 10 min duurt na `launchctl load`.
- `RunAtLoad=true` = redundant met BeginInterval=0 maar expliciet; Hermes-aanpassing 1 sub-fix.
- `StandardOutPath` + `StandardErrorPath` = aparte log-files. Stdout = success-polls, stderr = fouten.
- `EnvironmentVariables.PATH` = HOMEbrew-pad meenemen voor `curl`, `jq`, etc.

**Geen secrets in plist** (Ronde 14 discipline). Token zit ALLEEN in keychain.

## Keychain-setup spec (founder-actie)

**Pre-conditie:** founder heeft Notion API-token bij de hand (van Notion Integrations-pagina).

**Commando's:**

```bash
# 1. Token opslaan in keychain
security add-generic-password \
    -s "djinlabs-hermes-notion" \
    -a "hermes" \
    -w "<NOTION_API_TOKEN>"

# 2. Verifiëren dat entry bestaat (zonder token te printen)
security find-generic-password -s "djinlabs-hermes-notion" -a "hermes"

# 3. Helper-script schrijven (zie Hermes' v2-implementation-skeleton.md §B)
# Pad: ~/.hermes/bin/hermes-sync-poll.sh, mode 0700

# 4. Helper-script aanwezig?
test -x ~/.hermes/bin/hermes-sync-poll.sh && echo "OK" || echo "MISSING"

# 5. Cyrillic-guard op helper-scripts (acceptance-criterium #11)
bash cos/tools/cyrillic-guard.sh ~/.hermes/bin/hermes-sync-poll.sh
bash cos/tools/cyrillic-guard.sh ~/.hermes/bin/verify-sync-poll.sh

# 6. Logs + state-folders aanmaken
mkdir -p ~/.hermes/logs ~/.hermes/state ~/.hermes/bin
touch ~/.hermes/logs/hermes-sync-poll.log
touch ~/.hermes/logs/hermes-sync-poll.err

# 7. Plist installeren
cp com.djinlabs.hermes-sync-poll.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist

# 8. Verify direct na installatie
~/.hermes/bin/verify-sync-poll.sh
```

**Ronde 14 secret-handling:** keychain is encrypted at rest, toegankelijk voor processen van dezelfde user. Niet blootgesteld in env-vars of plist. Audit-spoor blijft in `~/.hermes/logs/` zonder token-content.

## Race-condition resolution-strategie

**Bij 2 INTENT-blokken binnen 10 min** (Sub-test B):

1. Beide INTENT-files bestaan in `_shared/sync-discipline-audit/` met timestamps.
2. Hermes' helper-script `hermes-sync-poll.sh` ziet beide bij eerstvolgende poll.
3. Hermes verwerkt oudste INTENT eerst (chronological order by timestamp).
4. Hermes schrijft VERDICT voor oudste INTENT.
5. Hermes ziet tweede INTENT, checkt of VERDICT voor ID bestaat: nee → process.
6. Hermes detecteert duplicate response-pad: antwoord op sync-pagina is WACHT op duplicaat totdat beide INTENTs VERDICT hebben.
7. Audit-trail toont: INTENT-a → VERDICT-a → INTENT-b → VERDICT-b.

**Edge case:** als 2 INTENTs exact dezelfde timestamp hebben (milliseconde-niveau), wint de lagere random-suffix in lex-order. Anders wordt Hermes-respons WACHT totdat Jev-classificatie (Ronde 17 V1.5 confidence-band) beslist.

## Verify-script (verify-sync-poll.sh)

**Output:**

```
=== Hermes Sync-Poll Verify ===
Plist: /Users/gogetta/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist
launchctl status: <PID of "not running">
Last stdout log line: <timestamp + status>
Last stderr log line: <timestamp + error or "empty">
Intent-blocks in audit-folder: <count>
VERDICT-blocks in audit-folder: <count>
Keychain entry "djinlabs-hermes-notion": present
Helper-script mode: 0700 (expected) or warning if different
Cyrillic-guard: 0 hits / N/A (no log content yet)
=== End ===
```

**Founder-actie na verify:** als alles OK, post op sync-pagina dat testronde #4 actief is. Als iets faalt, post op sync-pagina welke stap faalde en wacht op Hermes-respons.

## Rollback-plan

**Wanneer:** testronde #4 faalt, of founder wil plist verwijderen voor Ronde 20-uitkomst.

**Commando's:**

```bash
# 1. Plist stoppen
launchctl unload ~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist

# 2. Plist verwijderen
rm ~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist

# 3. Helper-scripts verwijderen (optioneel, behoud voor herinstallatie)
rm ~/.hermes/bin/hermes-sync-poll.sh
rm ~/.hermes/bin/verify-sync-poll.sh

# 4. Keychain-entry wissen (Ronde 14: geen sporen)
security delete-generic-password -s "djinlabs-hermes-notion" -a "hermes"

# 5. Logs + state behouden voor audit (niet wissen)
# ~/.hermes/logs/ en ~/.hermes/state/ blijven voor latere inspectie

# 6. Audit-folder behouden
# _shared/sync-discipline-audit/ blijft voor Ronde 20-traject
```

**Belangrijk:** audit-folder + logs NOOIT wissen zonder founder-expliciete go. Ronde 16 sync-discipline vereist audit-trail voor canonieke writes.

## Testronde-protocol (GG Coder runt dit)

**Tijdens testronde #4 (na founder-installatie):**

1. **Eerste INTENT door GG Coder** (acceptance-criterium #7): post INTENT op sync-pagina binnen 5 min na verify-script OK.
2. **Wacht op Hermes-respons** (acceptance-criterium #8): max 15 min (10-min aspiratie + 5-min slack).
3. **Als Hermes-respons uitblijft:** check `~/.hermes/logs/hermes-sync-poll.err` en post error op sync-pagina.
4. **Race-condition-test** (Sub-test B): post 2 INTENTs binnen 10 min, observeer Hermes-respons-volgorde.
5. **Cyrillic-guard** (acceptance #10): run `cos/tools/cyrillic-guard.sh` op alle log-files na testronde.
6. **Empirical 10-min meting** (Closure 2): log timestamps van 5 opeenvolgende Hermes-responses, bereken gemiddelde + standaard-deviatie. Post resultaat in testronde-rapport.
7. **Testronde-rapport** schrijven in `cos/research/2026-09-28-v2-testronde-4-resultaat.md` met: timestamps, INTENT/VERDICT-paren, race-condition-resolutie, 10-min-empirical-data, aanbevelingen voor Ronde 20-traject.

**Mijn verantwoordelijkheid:** testronde-protocol ontwerpen + meten + rapporteren. Geen canonieke writes naar `_shared/*`. Geen installatie-handelingen.

## Acceptance-criteria (10+1, geërfd van v2-implementation-skeleton.md)

1. Plist in `~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist`
2. `launchctl list | grep hermes-sync-poll` toont plist geladen
3. Helper-script in `~/.hermes/bin/hermes-sync-poll.sh` mode 0700
4. Keychain-entry `djinlabs-hermes-notion` aanwezig
5. Logs in `~/.hermes/logs/` (auto-creëren)
6. State-file in `~/.hermes/state/seen-blocks.json` (auto-creëren)
7. Eerste INTENT door GG Coder na installatie (testronde)
8. Hermes-respons binnen 10 min (testronde)
9. Audit-folder `_shared/sync-discipline-audit/` met INTENT-file (testronde)
10. Cyrillic-guard verificatie: log = 0 Cyrillic bytes
11. Cyrillic-guard verificatie: helper-scripts = 0 Cyrillic bytes (vóór installatie)

Plus 2 sub-tests:

- **Sub-test A:** 10-min cron bevestigd door 2 opeenvolgende polls met timestamps ~600s uit elkaar
- **Sub-test B:** race-condition Hermes WACHT — 2 INTENT-blokken binnen 10 min, tweede krijgt Hermes-respons WACHT op duplicaat

Plus 3 Hermes WACHT-closures (deze note):

- **C1:** V2-INTENT files in `_shared/sync-discipline-audit/`
- **C2:** 10-min aanname expliciet als aspiratie
- **C3:** Race-condition-ID-conventie timestamp + agent-tag + random-3-chars

Plus 6 founder-call-antwoorden op Hermes' V2 v2 research-note open vragen:

- **V1.1=A** (1 snapshot na closure, niet doorlopend)
- **V2.5=C** (expliciete Acceptance-criteria sectie)
- **V3.2=B** (urgent/soon/later urgency taxonomy)
- **V4.7=B** (boundary-discipline incl. Webrnds sub-folders)
- **Vervolg-3=A** (sjabloon in T-04)
- **Escape-1=A** (Hermes-bridge batch-merge-recovery)

## Wat NIET in deze note zit

- **Ronde 20-traject** voor V2-promotie naar `_shared/sync-discipline-canon.md`. Komt pas na succesvolle testronde #4 met founder-go.
- **Hermes' canonieke V2 v2 file** — Hermes schrijft die zelf in `_shared/sync-discipline-audit/V2-v2-canon.md` of equivalent, gebaseerd op deze research-onderbouwing.
- **Implementatie van helper-script** (`hermes-sync-poll.sh` inhoud) — staat in Hermes' `v2-implementation-skeleton.md` §B. Deze note verwijst alleen naar specificatie.
- **Jev-classificatie-details** voor V2 INTENT-classificatie (confidence-band defaults per Ronde 17). Wordt T-06 research-ticket zodra T-04/T-09 deblokkeerd zijn.

## Hermes-frontier-discipline — installatie-rolverdeling

**Hermes installeert niet zelf** (frontier-discipline V1). Hermes levert:

- V2 frontier-proposal (✅ in v2-implementation-skeleton.md)
- V2 v2 frontier-met-WACHT (✅ in sync-discipline-v2-intent-regel-v2.md)
- Canonieke V2 v2 file (na deze note + founder-go)
- Hermes-respons in testronde #4 (via plist)

**Founder doet:**

- Keychain-entry aanmaken (zie Keychain-setup spec)
- Plist installeren (zie Plist-spec + Keychain-setup stappen 6-8)
- Verify-script draaien
- Eerste Hermes-respons WACHT bevestigen op sync-pagina
- Ronde 20-traject openen na succesvolle testronde

**GG Coder doet:**

- Eerste INTENT posten (testronde start)
- Race-condition-test orkestreren
- Empirical 10-min data meten
- Testronde-rapport schrijven
- Cyrillic-guard draaien op logs

## Verwijzingen

- `../research/2026-09-28-v2-implementation-skeleton.md` — Hermes' V2 frontier-proposal
- `../research/2026-09-28-v2-testronde-poll-mechanisme.md` — 3 implementaties
- `../research/2026-09-28-sync-discipline-v2-intent-regel-v2.md` — Hermes WACHT 188-190 bron
- `../research/2026-09-28-sync-discipline-v2-intent-regel.md` — V2 frontier oorspronkelijk
- `../../../../_shared/sync-discipline-canon.md` — Ronde 16 V1 canon (target V2-promotie via Ronde 20)
- `../tickets/T-11-sync-discipline-v2.md` — T-11 frontier-ticket
- `../tickets/T-03-cos-routes.md` — R2 closure precedent (runtime-vrij, 6/6 tests)
- `../tools/cyrillic-guard.sh` — helper-script guard
- Notion sync-pagina (handshake + WACHT-respons + V2-poll-call) — block 49f9, ...ec7f, ...609b

## Audit-trail

- **Geschreven door:** GG Coder MiniMax-M3 sessie 2026-09-28
- **Op verzoek van:** founder ("ja do maar" na Optie B-discussie)
- **Review-status:** pending Hermes (canoniek-traject) + pending founder (installatie-go)
- **Volgende stap:** Hermes reviewt deze note via sync-pagina, schrijft canonieke V2 v2 file, of geeft aanpassingen. Founder leest Hermes-respons en beslist of installatie start.
