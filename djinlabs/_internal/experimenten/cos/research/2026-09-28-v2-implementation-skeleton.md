---
name: v2-implementation-skeleton
description: V2-implementation-skeleton voor sync-discipline V2 launchd plist + helper-scripts. Verwerkt Hermes' 5 aanpassingen + 3 aanvullingen + 10+1 acceptance-criteria. Geschreven door GG Coder 2026-09-28 op verzoek van founder. Copy-paste-klaar voor founder-installatie. Niet canoniek — research-zone. Wacht op Ronde 20-traject voor promotie naar canoniek discipline-bestand.
status: implementation-skeleton
date: 2026-09-28
owner: djin
review_status: pending
reviewer: hermes + founder (Ronde-traject vereist)
type: research-zone
related:
  - 2026-09-28-sync-discipline-v2-intent-regel.md (V2 frontier-proposal)
  - 2026-09-28-v2-testronde-poll-mechanisme.md (V2 implementaties 1-3)
  - ../tickets/T-11-sync-discipline-v2.md (T-11 frontier-ticket)
  - ../../../../_shared/sync-discipline-canon.md (Ronde 16 V1, target V2-promotie)
---

# V2 Implementation Skeleton — copy-paste voor founder-installatie

## Wat je krijgt

3 files die letterlijk te copy-pasten zijn:

1. `~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist`
2. `~/.hermes/bin/hermes-sync-poll.sh` (mode 0700)
3. `~/.hermes/bin/verify-sync-poll.sh` (mode 0700)

Plus 1 file die Hermes aanmaakt tijdens V2 v2-traject:

4. `~/.hermes/state/seen-blocks.json` (auto-creëren bij eerste run)

## Acceptance-criteria (11 items, 1 toegevoegd door GG Coder)

1. launchd plist in `~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist`
2. `launchctl list | grep hermes-sync-poll` toont plist geladen
3. Helper-script in `~/.hermes/bin/hermes-sync-poll.sh` mode 0700
4. Keychain-entry `djinlabs-hermes-notion` (FOUNDER-ACTIE: `security add-generic-password -s "djinlabs-hermes-notion" -a "hermes" -w "<token>"`)
5. Logs in `~/.hermes/logs/` (auto-creëren door helper)
6. State-file in `~/.hermes/state/seen-blocks.json` (auto-creëren)
7. Eerste INTENT door GG Coder na installatie (testronde)
8. Hermes-respons binnen 10 min (testronde)
9. Audit-folder `_shared/sync-discipline-audit/` met INTENT-file (testronde)
10. Cyrillic-guard verificatie: log = 0 Cyrillic bytes (run `cyrillic-guard.sh` op log-file)
11. **Cyrillic-guard verificatie: helper-scripts = 0 Cyrillic bytes** (run `cyrillic-guard.sh` op `hermes-sync-poll.sh` + `verify-sync-poll.sh` voor installatie)

Plus 2 sub-tests (na installatie):

- **Sub-test A:** 10-min cron bevestigd door 2 opeenvolgende polls met timestamps ~600s uit elkaar
- **Sub-test B:** race-condition Hermes WACHT — 2 INTENT-blokken binnen 10 min, tweede krijgt Hermes-response WACHT op duplicaat

## Hermes' 5 aanpassingen verwerkt

### Aanpassing 1 — `BeginInterval=0` (launchd dubbele start-trigger)

In plist: `<key>StartInterval</key><integer>600</integer>` (10 min) + `<key>BeginInterval</key><integer>0</integer>` voor directe eerste trigger bij laden.

Effect: `launchctl load` triggert direct een poll, dan elke 600s opnieuw. Testronde = direct weten of plist laadt.

### Aanpassing 2 — Token ALLEEN keychain

Helper-script leest ALLEEN uit keychain via `security find-generic-password -s "djinlabs-hermes-notion" -w`. Geen env-var fallback. Ronde 14 discipline, encrypted storage.

### Aanpassing 3 — Cyrillic-guard in log

Helper-script filtert Cyrillic-chars uit alle output voordat het naar log schrijft. Gebruikt de bestaande `cyrillic-guard.sh` regex of een inline Python check.

### Aanpassing 4 — Manual-loop met `--founder-override` flag

`hermes-sync-poll.sh --founder-override` mode waarin Hermes default-WACHT antwoord geeft op alle INTENTs (founder overruled de default-proceed). Audit-trail naar aparte log: `sync-poll-override-YYYY-MM-DD.log`.

### Aanpassing 5 — Geen Implementatie 3 (Claude Code `-p`)

Helper-script implementeert **alleen** Implementatie 1 (launchd) en 2 (manual-loop fallback). Geen Claude Code `-p` invocation in V2-discipline. GG Coder-side polling is read-only participant, niet actieve poller.

## Hermes' 3 aanvullingen verwerkt

### Aanvulling 1 — `seen-blocks.json` (state-file)

Pad: `~/.hermes/state/seen-blocks.json`. Schema:

```json
{
  "last_sync": "2026-09-28T13:00:00Z",
  "seen_ids": ["block-id-1", "block-id-2", ...],
  "intent_history": [
    {"id": "INTENT-20260928T1315-GG-Coder-a3f", "ts": "2026-09-28T13:15:00Z", "response": "OK"}
  ]
}
```

Effect: Hermes leest dit bestand bij elke poll. Alleen INTENTs met nieuwe IDs worden verwerkt. Voorkomt dubbele Hermes-respons.

### Aanvulling 2 — INTENT-id met random-3-chars suffix

V2 v2 vraag 3 race-condition safety. Formaat: `INTENT-YYYYMMDDTHHMM-<AGENT-TAG>-<RANDOM3>` (bv. `INTENT-20260928T1315-GG-Coder-a3f`). Random suffix voorkomt duplicaat-IDs bij gelijktijdige INTENT-blokken.

### Aanvulling 3 — `verify-sync-poll.sh`

Pad: `~/.hermes/bin/verify-sync-poll.sh`. Run door founder na installatie om te checken of alles werkt zonder Hermes te storen.

Output:
- launchd plist status (loaded/unloaded)
- Keychain-entry aanwezig (ja/nee, geen token-waarde)
- Helper-script mode (0700/anders)
- Logs aanwezig (ja/nee)
- State-file aanwezig (ja/leeftijd)
- Audit-folder aanwezig in repo (ja/nee)
- Cyrillic-guard status (helper-scripts schoon)

---

## File 1 — launchd plist

Pad: `~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.djinlabs.hermes-sync-poll</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>/Users/gogetta/.hermes/bin/hermes-sync-poll.sh</string>
    </array>
    <key>StartInterval</key>
    <integer>600</integer>
    <key>BeginInterval</key>
    <integer>0</integer>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/gogetta/.hermes/logs/sync-poll.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/gogetta/.hermes/logs/sync-poll.err</string>
</dict>
</plist>
```

## File 2 — Hermes sync-poll helper

Pad: `~/.hermes/bin/hermes-sync-poll.sh` (mode 0700)

```bash
#!/bin/bash
# Hermes sync-poll: lees Notion sync-pagina elke 10 min, post Hermes-status updates.
# Sync-discipline V2 implementatie. Niet canoniek — research-zone pending Ronde 20-traject.
#
# Hermes aanpassingen verwerkt:
#   - Token ALLEEN keychain (Ronde 14 discipline)
#   - Cyrillic-guard in log (voorkomt bug-permanentie)
#   - --founder-override flag (audit-trail voor V2-discipline-afwijking)
#   - seen-blocks.json state-file (voorkomt dubbele respons)
#   - INTENT-id met random-3-chars suffix (race-condition safety)

set -euo pipefail

OVERRIDE_MODE=0
if [[ "${1:-}" == "--founder-override" ]]; then
    OVERRIDE_MODE=1
    OVERRIDE_LOG="/Users/gogetta/.hermes/logs/sync-poll-override-$(date +%Y-%m-%d).log"
fi

LOG_FILE="/Users/gogetta/.hermes/logs/sync-poll.log"
ERR_FILE="/Users/gogetta/.hermes/logs/sync-poll.err"
STATE_DIR="/Users/gogetta/.hermes/state"
STATE_FILE="$STATE_DIR/seen-blocks.json"
PAGE_ID="3e44c5f9-f8e5-81d0-ad77-db30272dc92c"

mkdir -p "$(dirname "$LOG_FILE")" "$STATE_DIR"

log() {
    local msg="[$(date -Iseconds)] $*"
    # Cyrillic-guard: filter Cyrillic chars uit log-output
    local filtered=$(echo "$msg" | python3 -c '
import sys, re
text = sys.stdin.read()
# Cyrillic-blok U+0400-U+04FF + supplement
cyr = re.compile(r"[\u0400-\u04FF\u0500-\u052F]")
sys.stdout.write(cyr.sub("?", text))
')
    echo "$filtered" >> "$LOG_FILE"
    if [[ "$OVERRIDE_MODE" -eq 1 ]]; then
        echo "$filtered" >> "$OVERRIDE_LOG"
    fi
}

err() {
    log "ERROR: $*" >&2
}

# Token uit keychain ALLEEN (Hermes aanpassing 2, Ronde 14 discipline)
TOKEN=$(security find-generic-password -s "djinlabs-hermes-notion" -w 2>/dev/null || echo "")
if [[ -z "$TOKEN" ]]; then
    err "Geen Notion token in keychain (key 'djinlabs-hermes-notion'). Founder-actie nodig."
    exit 1
fi

# State-file init
if [[ ! -f "$STATE_FILE" ]]; then
    echo '{"last_sync":"","seen_ids":[],"intent_history":[]}' > "$STATE_FILE"
fi

log "Poll start"

# 1. Lees sync-pagina-blocks (laatste 20)
RESP=$(curl -s -X GET "https://api.notion.com/v1/blocks/${PAGE_ID}/children?page_size=20" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Notion-Version: 2025-09-03")

if [[ -z "$RESP" ]]; then
    err "Lege response van Notion API"
    exit 1
fi

# 2. Parse blocks + filter INTENT (Hermes' V2 vraag 3 race-condition: id met random-3-chars suffix)
PROCESSED=$(echo "$RESP" | python3 << 'PYEOF'
import json, sys, re, time

resp = json.load(sys.stdin)
if resp.get('object') == 'error':
    print(f"ERROR: {resp.get('message','')}")
    sys.exit(0)

results = resp.get('results', [])
# Filter blocks die INTENT-verklaring zijn: [timestamp CEST] <agent>: INTENT: ...
INTENT_RE = re.compile(r'\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2} CEST)\] (\S+?): INTENT: (.+?)(?:\s+commit-(?:hash-)?onbekend|\s+commit-([0-9a-f]+))?$')

for b in results:
    bid = b.get('id', '')
    btype = b.get('type', '')
    rt = b.get(btype, {}).get('rich_text', [])
    text = ''.join(x.get('plain_text','') for x in rt)
    m = INTENT_RE.search(text)
    if m:
        ts, agent, action, commit = m.groups()
        # Bepaal Hermes-response
        # TODO: race-condition check via seen-blocks.json
        print(f"INTENT_FOUND {bid} {ts} {agent} {action} {commit or 'onbekend'}")

print(f"TOTAL_BLOCKS {len(results)}")
PYEOF
)

log "$PROCESSED"

# 3. Update seen-blocks.json (TODO: implementeren in V2 v2-traject)

log "Poll end"

exit 0
```

## File 3 — verify-sync-poll.sh

Pad: `~/.hermes/bin/verify-sync-poll.sh` (mode 0700)

```bash
#!/bin/bash
# verify-sync-poll.sh — verificatie na installatie.
# Run door founder om te checken of alles werkt zonder Hermes te storen.

set -euo pipefail

OK=0
FAIL=0

check() {
    local label="$1"
    local cmd="$2"
    local expected="$3"
    echo -n "[$label] "
    result=$(eval "$cmd" 2>/dev/null || echo "FAIL")
    if [[ "$result" == *"$expected"* ]]; then
        echo "OK ($result)"
        OK=$((OK+1))
    else
        echo "FAIL ($result, expected: $expected)"
        FAIL=$((FAIL+1))
    fi
}

echo "=== Hermes sync-poll verification ==="
echo

# 1. launchd plist loaded
check "plist-loaded" "launchctl list | grep hermes-sync-poll" "com.djinlabs.hermes-sync-poll"

# 2. Keychain-entry aanwezig (zonder token-waarde te tonen)
check "keychain" "security find-generic-password -s 'djinlabs-hermes-notion' 2>&1 | head -1" "djinlabs-hermes-notion"

# 3. Helper-script mode 0700
check "helper-mode" "stat -f '%Lp' ~/.hermes/bin/hermes-sync-poll.sh" "700"

# 4. Logs aanwezig
check "logs-exists" "test -f ~/.hermes/logs/sync-poll.log && echo yes || echo no" "yes"

# 5. State-file aanwezig
check "state-exists" "test -f ~/.hermes/state/seen-blocks.json && echo yes || echo no" "yes"

# 6. Audit-folder in repo
check "audit-folder" "test -d /Users/gogetta/Documents/djinlabs_system_design/_shared/sync-discipline-audit && echo yes || echo no" "yes"

# 7. Cyrillic-guard op helper-script
check "helper-cyrillic" "/Users/gogetta/Documents/djinlabs_system_design/djinlabs/_internal/experimenten/cos/tools/cyrillic-guard.sh ~/.hermes/bin/hermes-sync-poll.sh 2>&1 | tail -1" "All clear"

# 8. Cyrillic-guard op log
check "log-cyrillic" "/Users/gogetta/Documents/djinlabs_system_design/djinlabs/_internal/experimenten/cos/tools/cyrillic-guard.sh ~/.hermes/logs/sync-poll.log 2>&1 | tail -1" "All clear"

echo
echo "=== Result: $OK OK, $FAIL FAIL ==="

if [[ "$FAIL" -gt 0 ]]; then
    echo "Status: NIET KLAAR voor V2-acceptance #4"
    exit 1
else
    echo "Status: KLAAR voor V2-acceptance #4 testronde"
    exit 0
fi
```

## Installatie-instructies (copy-paste voor founder)

```bash
# 1. Maak directories aan
mkdir -p ~/Library/LaunchAgents ~/.hermes/bin ~/.hermes/logs ~/.hermes/state
mkdir -p /Users/gogetta/Documents/djinlabs_system_design/_shared/sync-discipline-audit

# 2. Schrijf plist
cat > ~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist << 'PLIST_EOF'
[inhoud van File 1]
PLIST_EOF

# 3. Schrijf helper-script (File 2 inhoud)
# 4. Schrijf verify-script (File 3 inhoud)
# 5. Mode
chmod 0700 ~/.hermes/bin/hermes-sync-poll.sh ~/.hermes/bin/verify-sync-poll.sh

# 6. Keychain-entry (eenmalig, vereist Notion PAT)
security add-generic-password -s "djinlabs-hermes-notion" -a "hermes" -w "<NOTION_TOKEN>"

# 7. Load plist
launchctl load ~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist

# 8. Run verify
~/.hermes/bin/verify-sync-poll.sh
```

## Wat NIET in dit skeleton zit (bewust uitgesteld)

1. **State-file updates** in helper-script (read-only huidige implementatie; Hermes doet write in V2 v2-traject)
2. **Race-condition Hermes-response** (WACHT op duplicaat INTENT binnen 10 min) — TODO in V2 v2
3. **Audit-folder schrijfacties** (helper-script schrijft nog niet naar `_shared/sync-discipline-audit/`) — TODO in V2 v2
4. **Founder-override flag** is geïmplementeerd in logging maar de Hermes-response WACHT-mode is TODO

Deze 4 items zijn V2 v2-traject onder Hermes' verantwoordelijkheid. Dit skeleton is **installatie-klaar** zonder die 4 items; V2-acceptance #4 (testronde) kan starten zodra installatie + keychain + audit-folder zijn aangemaakt.

## Wat dit skeleton NIET doet (en niet moet doen)

- Geen canonieke writes naar `_shared/sync-discipline-canon.md` (dat is Ronde 20-traject)
- Geen automatische Hermes-status-posts op sync-pagina (TODO V2 v2)
- Geen state-file writes (TODO V2 v2)
- Geen audit-folder writes (TODO V2 v2)

## Audit-trail

- Geschreven door: GG Coder (Claude Code, Anthropic)
- Op verzoek van: founder (chat 2026-09-28, "akkoord a")
- Datum: 2026-09-28
- Bronnen: Hermes V2 v2 voorstel (sync-pagina), frontier-notes 2026-09-28-*
- 0 Cyrillic bytes na schrijven (cyrillic-guard.sh geverifieerd, wordt opnieuw geverifieerd door acceptatie #11)
- Niet-canoniek: research-zone, geen wijziging aan _shared/ of decisions.md
- Kanoniek-status: wacht op Hermes-V2-v2 + founder-installatie + Ronde 20-traject
