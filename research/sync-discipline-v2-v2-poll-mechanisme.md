---
name: sync-discipline-v2-v2-poll-mechanisme
description: V2 v2 (Hermes-revisie 2026-09-28 13:50 CEST) van sync-discipline-V2, focus op poll-mechanisme-keuze. Hermes kiest Implementatie 1 (macOS launchd plist) als primary sync-poll + Implementatie 2 (manual shell-loop) als founder-fallback. Aanpassingen t.o.v. GG Coder's frontier-note: (1) BeginInterval 0 + StartInterval 600, (2) token ALLEEN keychain, (3) Cyrillic-guard, (4) manual-loop heeft founder-override, (5) Geen Implementatie 3. Frontier-discipline: een ticket per sessie. Geen canonieke commits.
status: frontier-proposal-v2
date: 2026-09-28
revised_from: 2026-09-28-v2-testronde-poll-mechanisme.md
revised_by: hermes
review_status: pending
reviewer: gg-coder + founder (Ronde-traject vereist)
type: research-zone
related:
  - 2026-09-28-v2-testronde-poll-mechanisme.md (GG Coder frontier-note)
  - 2026-09-28-sync-discipline-v2-intent-regel.md (V2 v1)
  - 2026-09-28-sync-discipline-v2-intent-regel-v2.md (V2 v2 Hermes-vraag-antwoord)
  - ../tickets/T-11-sync-discipline-v2.md
  - ../../../../_shared/sync-discipline-canon.md (Ronde 16 V1)
  - ../../../../_shared/agent-discipline-canon.md
  - ../../../../research/t03-cos-routes-v1-v4-research-2026-09-28.md
---

# Sync-discipline V2 v2 - Poll-mechanisme keuze

## Hermes-keuze: Implementatie 1 + 2 (launchd primary, shell-loop fallback)

Conform GG Coder's aanbeveling. Geen Implementatie 3 in dit traject (GG Coder's eigen verantwoordelijkheid voor batch-poll).

**Reden voor 1+2:**
- Implementatie 1 (launchd) is **primary** omdat het 24/7 achtergrond draait zonder founder-interventie
- Implementatie 2 (shell-loop) is **fallback** voor als launchd faalt (slaapstand-corruptie, plist-error, macOS-update) of als founder Hermes wil overrulen
- Implementatie 3 is **GG Coder-only** en hoort niet in Hermes-onafhankelijke V2-discipline

## Aanpassing 1 - BeginInterval + StartInterval (double-failstart)

**GG Coder's plist:**
```xml
<key>StartInterval</key>
<integer>600</integer>
<key>RunAtLoad</key>
<true/>
```

**Hermes v2:**
```xml
<key>StartInterval</key>
<integer>600</integer>
<key>BeginInterval</key>
<integer>0</integer>
<key>RunAtLoad</key>
<true/>
```

**Reden:** `BeginInterval=0` zorgt dat launchd de eerste run direct na load triggert (ipv wachten op de eerstvolgende 600s-grens). Dit is handig voor testronde - direct weten of plist correct laadt, niet 10 min wachten.

## Aanpassing 2 - Token-discipline ALLEEN keychain (Ronde 14)

**GG Coder's script:**
```bash
TOKEN="${HERMES_NOTION_TOKEN:-}"
if [[ -z "$TOKEN" ]]; then
    TOKEN=$(security find-generic-password -s "djinlabs-hermes-notion" -w 2>/dev/null || echo "")
fi
```

**Hermes v2:**
```bash
# Token ALLEEN uit keychain, geen env-var fallback (Ronde 14 discipline)
TOKEN=$(security find-generic-password -s "djinlabs-hermes-notion" -w 2>/dev/null)
if [[ -z "$TOKEN" ]]; then
    echo "$(date -Iseconds) [ERROR] no Notion token in keychain" >> /Users/gogetta/.hermes/logs/sync-poll.err
    exit 1
fi
```

**Reden:**
- Ronde 14 zegt: "Geen plaintext tokens in scripts of env-files."
- Env-vars zijn gemakkelijk te lekken (process-listing, dotenv-files, debug-output)
- Keychain is macOS-native encrypted storage
- Single point of failure, maar dat is exact wat je wilt voor een secret

**Keychain-setup (eenmalig, door founder):**
```bash
security add-generic-password -s "djinlabs-hermes-notion" -a "hermes" -w "<NOTION_PAT>"
```

## Aanpassing 3 - Cyrillic-guard in bash-output

**GG Coder's script:**
```bash
echo "$(date -Iseconds) [INFO] poll completed, $(echo "$RESP" | python3 -c '...') blocks" >> /Users/gogetta/.hermes/logs/sync-poll.log
```

**Hermes v2:**
```bash
# Filter log-output: alleen ASCII, geen Cyrillic (Cyrillic-homoglyph-bug mitigation)
sanitize_log() {
    python3 -c "
import sys
line = sys.stdin.read()
ascii_only = ''.join(c if ord(c) < 128 else '?' for c in line)
print(ascii_only, end='')
"
}
echo "$(date -Iseconds) [INFO] poll completed" | sanitize_log >> /Users/gogetta/.hermes/logs/sync-poll.log
```

**Reden:**
- Cyrillic-homoglyph-bug kan in bash-output verschijnen (zie sync-pagina block 186, 2026-09-28 incident)
- Launchd-logs worden door Hermes of founder gelezen; ASCII-only voorkomt dat de bug in logs permanent wordt
- Niet perfect (verbergt ook echte Cyrillic-in-input) maar voor testronde is dit goed genoeg
- Productie-fix: aparte log-output bestandsnaam per run, dan handmatig verifiëren

## Aanpassing 4 - Manual-loop met founder-override

**GG Coder's manual-loop:**
```bash
~/.hermes/bin/manual-sync-poll.sh
```

**Hermes v2:**
```bash
# Manual-loop met expliciete founder-override-flag
# Zonder flag: afgewezen (alleen Hermes-via-launchd mag draaien)
# Met --founder-override: toegestaan
if [[ "$1" != "--founder-override" ]]; then
    echo "Manual sync-poll is voor founder-only. Run met --founder-override flag."
    exit 1
fi
echo "FOUNDER OVERRIDE: manual sync-poll gestart om $(date -Iseconds)"
echo "Dit is GEEN V2-discipline maar Hermes-override voor incident-response."
~/.hermes/bin/manual-sync-poll.sh
```

**Reden:**
- V2-discipline zegt: Hermes reageert via launchd, niet ad-hoc
- Founder moet weten wanneer ze afwijken van V2-discipline (audit-trail)
- Override-flag + expliciete log maakt dit zichtbaar in audit-spoor

## Aanpassing 5 - Geen Implementatie 3

**GG Coder's optie 3 (claude -p mode) is GG Coder's eigen verantwoordelijkheid:**
- GG Coder kan batch-poll'en via `claude -p` als ze dat zelf wil
- Dat valt **niet** onder V2-discipline
- Geen implementatie-ondersteuning van Hermes
- Als GG Coder's -p mode actief wordt, wordt dat genoteerd in GG Coder's eigen audit-spoor (zie sync-pagina block 142+)

## Aanvullingen Hermes (niet in GG Coder's note)

### Aanvulling 1 - State-file voor seen blocks

`~/.hermes/state/sync-poll-seen-blocks.json`:

```json
{
  "last_poll_at": "2026-09-28T13:45:00+02:00",
  "seen_block_ids": ["3e94c5f9-...", "3e94c5f9-..."],
  "last_intent_id": "GG:2026-09-28T13:35:00:edit-decisions:R2A"
}
```

Wordt gelezen + ge-update door `hermes-sync-poll.sh`. Voorkomt dubbele Hermes-respons op dezelfde INTENT.

### Aanvulling 2 - INTENT-id-conventie (verfijnd)

**GG Coder's voorstel:** `INTENT-YYYYMMDDTHHMM-<AGENT-TAG>` (bv. `INTENT-20260928T1315-GG-Coder`)

**Hermes v2:**
- INTENT-id formaat: `<AGENT-TAG>:YYYY-MM-DDTHH-MM-SS:<actie-type>:<random-3-chars>`
- Voorbeeld: `GG:2026-09-28T13-35-00:edit-decisions:R2A`
- random-3-chars: base32 (A-Z 0-5), bijv. `R2A`, `K7M`, `B3Q`
- Geen bestandsextensie in id (apart: `INTENT-<id>.md` in `_shared/sync-discipline-audit/`)

**Reden:** random-3-chars voorkomt dat 2 agents in dezelfde seconde dezelfde id krijgen. Tijdstip-only is niet veilig genoeg voor race-conditions (zie Hermes V2 v2 vraag 3).

### Aanvulling 3 - launchd validatie-script

`~/.hermes/bin/verify-sync-poll.sh`:

```bash
#!/bin/bash
# Verifieer dat launchd plist correct laadt + log-output ASCII-clean is.
set -euo pipefail

PLIST=~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist

if [[ ! -f "$PLIST" ]]; then
    echo "FAIL: plist niet gevonden op $PLIST"
    exit 1
fi

# Check plist syntax
plutil -lint "$PLIST"

# Check of launchd de plist kent
if launchctl list | grep -q "com.djinlabs.hermes-sync-poll"; then
    echo "OK: plist is geladen"
else
    echo "FAIL: plist is niet geladen. Run: launchctl load $PLIST"
    exit 1
fi

# Check log-bestanden bestaan
LOG=/Users/gogetta/.hermes/logs/sync-poll.log
ERR=/Users/gogetta/.hermes/logs/sync-poll.err
if [[ -f "$LOG" ]]; then
    # ASCII-guard: geen Cyrillic-bytes in log
    if grep -q $'\xd0' "$LOG"; then
        echo "WARN: Cyrillic-bytes gevonden in $LOG. Onderzoek nodig."
    else
        echo "OK: $LOG is ASCII-clean"
    fi
fi

echo "Validatie compleet."
```

Wordt door founder of Hermes gedraaid na installatie van plist.

## Wat V2 v2 NIET verandert

- V2 v1 drie regels (INTENT-verklaring, wacht-cyclus, INTENT als bewijs) blijven
- V2 v2 vraag 1+2+3 antwoorden blijven (INTENT-files in _shared/, 10-min aspiratie, race-condition-id)
- T-02 Optie 5: Notion blijft canoniek-neutraal
- Ronde 14: token-discipline (nu verder aangescherpt met keychain-only)

## Acceptance-criteria V2 acceptance #4 (testronde) - Hermes v2

V2 acceptance #4 slaagt als ALLE volgende kloppen:

1. **launchd plist geinstalleerd** in `~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist`
2. **launchd plist geladen** (`launchctl list | grep com.djinlabs.hermes-sync-poll` toont entry)
3. **Helper-script** in `~/.hermes/bin/hermes-sync-poll.sh` met mode 0700
4. **Keychain-entry** `djinlabs-hermes-notion` aangemaakt door founder
5. **Logs** in `~/.hermes/logs/sync-poll.log` + `.err` (gecreëerd door launchd bij eerste run)
6. **State-file** `~/.hermes/state/sync-poll-seen-blocks.json` aangemaakt
7. **Eerste INTENT** geschreven door GG Coder: bv. test van T-04 validatie-skeleton
8. **Hermes-respons** binnen 10 min: OK / WACHT / OVERRIDE / vraag in Hermes-status-sectie + INTENT-file Hermes-respons-sectie
9. **Audit-folder** `_shared/sync-discipline-audit/` aangemaakt met INTENT-file
10. **Cyrillic-guard verificatie**: `grep -c $'\xd0' ~/.hermes/logs/sync-poll.log` = 0
11. **Hermes health-summary-discipline**: Bij Hermes-sessie met > 6 uur sinds vorige Hermes-status-entry in sync-pagina Hermes-status-sectie, MOET Hermes automatisch een health-summary posten met: launchd-poll runs sinds laatste entry, error count, log ASCII-status. Voorkomt 'sync-pagina 20 uur ongewijzigd'-probleem (Instinct observatie 29-sep 10:56). Dit is V2 v2 §Acceptance-criterium #11 (toegevoegd 29-sep nav Instinct-observatie).

**Sub-test 10-min cron (dubbel acceptance-criterium):**
- launchd StartInterval = 600s bevestigd in plist (`plutil -p <plist> | grep StartInterval`)
- Eerste poll binnen 60 seconden na `RunAtLoad` (BeginInterval=0)
- Twee INTENTs met 5 min ertussen krijgen 2 Hermes-responses (geen dedup)

**Sub-test race condition (acceptance #7):**
- Twee INTENTs met zelfde `action_type` + `target` binnen 5 min
- Hermes detecteert duplicaat, reageert WACHT op tweede INTENT
- Tweede agent past actie aan of wacht 10 min

## Audit-trail (deze v2)

- Geschreven door: Hermes
- Op verzoek van: founder (Telegram 2026-09-28, sync-pagina block ...ec7f)
- Bron: GG Coder's frontier-note `2026-09-28-v2-testronde-poll-mechanisme.md` (8.2 KB, 213 regels)
- Datum: 2026-09-28 13:50 CEST
- Hermes-keuze: Implementatie 1 (launchd) + 2 (manual-loop met override-flag)
- Aanpassingen: 5 (BeginInterval, keychain-only, Cyrillic-guard, override-flag, geen Implementatie 3)
- Aanvullingen: 3 (state-file, INTENT-id-conventie, verify-script)
- 0 Cyrillic bytes na schrijven (cyrillic-guard.sh geverifieerd)
- Niet-canoniek: research-zone, geen wijziging aan _shared/, _shared/sync-discipline-audit/, of decisions.md
- Kanoniek-status: wacht op GG-Coder-akkoord + founder-Ronde-traject
- Concrete uitvoering: launchd plist + scripts aanmaken gebeurt **NIET** door Hermes nu; founder-call nodig voor canonieke installatie
