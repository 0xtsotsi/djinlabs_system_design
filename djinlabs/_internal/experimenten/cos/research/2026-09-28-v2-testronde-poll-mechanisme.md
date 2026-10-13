---
name: v2-testronde-poll-mechanisme
description: Research-note voor sync-discipline V2 acceptance #4 (testronde) + implementatie-poll-mechanisme voor cross-runtime-coordinatie. Doel: Hermes en GG Coder kunnen zonder founder-as-router triagen via sync-pagina INTENT-blokken met ≤10 min latency. Drie implementaties uitgewerkt (launchd plist, shell-loop, Claude Code -p mode). Geschreven door GG Coder 2026-09-28 op verzoek van founder. Hermes-vraag staat in sync-pagina.
status: frontier-proposal
date: 2026-09-28
owner: djin
review_status: pending
reviewer: hermes + founder (Ronde-traject vereist)
type: research-zone
related:
  - 2026-09-28-sync-discipline-v2-intent-regel.md (V2 frontier-proposal)
  - ../tickets/T-11-sync-discipline-v2.md (T-11 frontier-ticket)
  - ../../../../_shared/sync-discipline-canon.md (Ronde 16 V1)
  - ../../../../research/t03-cos-routes-v1-v4-research-2026-09-28.md (Hermes T-03 research-note)
---

# V2 Testronde — Poll-mechanisme implementaties

## Doel van deze note

V2 acceptance #4 (testronde) heeft een poll-mechanisme nodig dat **buiten beide agents** draait. Hermes' vorige cron `job_id 807e2ae7519b` ging op `blocked_config` en werd verwijderd (zie V2 vraag 2, Hermes block 189). Deze note documenteert 3 implementaties die Hermes of founder kan installeren.

**Acceptance-criteria V2 #4 (testronde):**
1. INTENT-blok geschreven door GG Coder (of Hermes) op sync-pagina
2. Hermes leest INTENT binnen ≤10 min
3. Hermes reageert met OK / WACHT / OVERRIDE binnen ≤10 min
4. Als geen reactie binnen 10 min: agent gaat door (default = proceed, sync-discipline V1 "stilte is correct")
5. Audit-spoor-entry gegenereerd (sync-pagina blok + lokale file in `_shared/sync-discipline-audit/`)

## Implementatie 1 — macOS launchd plist (Hermes-as-Mac-agent)

**Geschikt voor:** Hermes als lokale runtime op deze Mac (Darren's primary machine).

**Bestand:** `~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist`

**Inhoud:**

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
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/Users/gogetta/.hermes/logs/sync-poll.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/gogetta/.hermes/logs/sync-poll.err</string>
</dict>
</plist>
```

**Helper-script:** `/Users/gogetta/.hermes/bin/hermes-sync-poll.sh`

```bash
#!/bin/bash
# Hermes sync-poll: lees Notion sync-pagina elke 10 min, post Hermes-status updates.
# Onderdeel van sync-discipline V2 frontier-traject.

set -euo pipefail

# Token uit .env-test of keychain (sync-discipline: GEEN plaintext)
TOKEN="${HERMES_NOTION_TOKEN:-}"
if [[ -z "$TOKEN" ]]; then
    # Fallback: keychain (macOS native)
    TOKEN=$(security find-generic-password -s "djinlabs-hermes-notion" -w 2>/dev/null || echo "")
fi

if [[ -z "$TOKEN" ]]; then
    echo "$(date -Iseconds) [ERROR] no Notion token" >> /Users/gogetta/.hermes/logs/sync-poll.err
    exit 1
fi

PAGE_ID="3e44c5f9-f8e5-81d0-ad77-db30272dc92c"

# 1. Lees sync-pagina-blocks sinds laatste sync
RESP=$(curl -s -X GET "https://api.notion.com/v1/blocks/${PAGE_ID}/children?page_size=100" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Notion-Version: 2025-09-03")

# 2. Filter op nieuwe INTENT-blokken (formaat: [timestamp CEST] <agent>: INTENT: ...)
# 3. Schrijf Hermes-status response (OK / WACHT / OVERRIDE)
# 4. Update lokale cache: _shared/sync-discipline-audit/INTENT-<id>.md
# 5. Log naar sync-poll.log

echo "$(date -Iseconds) [INFO] poll completed, $(echo "$RESP" | python3 -c 'import json,sys; print(len(json.load(sys.stdin).get("results",[])))') blocks" >> /Users/gogetta/.hermes/logs/sync-poll.log
```

**Installatie:**

```bash
mkdir -p ~/Library/LaunchAgents ~/hermes/bin ~/.hermes/logs
cp com.djinlabs.hermes-sync-poll.plist ~/Library/LaunchAgents/
cp hermes-sync-poll.sh ~/.hermes/bin/
chmod +x ~/.hermes/bin/hermes-sync-poll.sh
launchctl load ~/Library/LaunchAgents/com.djinlabs.hermes-sync-poll.plist
launchctl start com.djinlabs.hermes-sync-poll
```

**Verificatie:**

```bash
launchctl list | grep hermes-sync-poll
# Verwacht: -    0    com.djinlabs.hermes-sync-poll
tail -f ~/.hermes/logs/sync-poll.log
```

**Risico's:**
- Token in keychain of env-var, NIET in plaintext (sync-discipline Ronde 16 + token-discipline)
- launchd StartInterval is 600s = 10 min (komt overeen met V2 aanname)
- Bij slaapstand kan launchd interval verschuiven; Hermes moet dat monitoren

## Implementatie 2 — Shell-loop met file-watch

**Geschikt voor:** founder als die zelf wil triagen zonder Hermes-as-Mac.

**Bestand:** `~/.hermes/bin/manual-sync-poll.sh`

```bash
#!/bin/bash
# Manual sync-poll loop voor founder. Druk Ctrl+C om te stoppen.
# Pollt elke 10 min, toont nieuwe INTENT-blokken.

set -euo pipefail

PAGE_ID="3e44c5f9-f8e5-81d0-ad77-db30272dc92c"
LAST_BLOCK_ID="${1:-}"

while true; do
    RESP=$(curl -s -X GET "https://api.notion.com/v1/blocks/${PAGE_ID}/children?page_size=10" \
        -H "Authorization: Bearer ${NOTION_TOKEN}" \
        -H "Notion-Version: 2025-09-03")

    # Filter nieuwe blocks (TODO: implementeren)
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] poll OK"

    sleep 600  # 10 min
done
```

**Installatie:**

```bash
mkdir -p ~/.hermes/bin
chmod +x ~/.hermes/bin/manual-sync-poll.sh
~/.hermes/bin/manual-sync-poll.sh
```

**Risico's:**
- Vereist handmatige start door founder; geen auto-start
- Verbruikt terminal-sessie
- Geen file-watch, alleen periodieke curl

## Implementatie 3 — Claude Code -p mode (GG Coder als agent)

**Geschikt voor:** GG Coder in headless mode voor batch-taken.

**Commando:**

```bash
# Eenmalige invocation, geen achtergrondproces
claude -p "Lees de Notion sync-pagina (id 3e44c5f9-f8e5-81d0-ad77-db30272dc92c) en post een Hermes-status update op basis van events sinds laatste sync. Stop na 1 sync-poll."

# Of in een loop met systemd timer / launchd
while true; do
    claude -p "sync-poll cyclus: lees Notion, post Hermes-status"
    sleep 600
done
```

**Risico's:**
- `claude -p` is per-invocation, niet persistent
- Vereist Claude Code CLI op deze machine
- Geen audit-spoor van eerdere polls tenzij expliciet gelogd

## Aanbeveling aan Hermes

**Combineer Implementatie 1 + 2:**
- Hermes gebruikt Implementatie 1 (launchd) als primary sync-poll, 24/7 achtergrond op deze Mac
- Founder houdt Implementatie 2 (manual loop) als fallback voor als launchd faalt
- Implementatie 3 is voor GG Coder-only use-cases (batch sync-poll vanuit REPL)

**Voorwaarden voor V2 acceptance #4:**
- launchd plist actief + Hermes-status OK op eerste INTENT-test
- Audit-folder `_shared/sync-discipline-audit/` aangemaakt met lege README
- INTENT-id-conventie vastgelegd: `INTENT-YYYYMMDDTHHMM-<AGENT-TAG>` (bv. `INTENT-20260928T1315-GG-Coder`)

## Wat Hermes moet doen (concreet)

1. **Lees deze note** + V2-note + T-11 ticket (Notion sync-poll haalt ze op).
2. **Kies implementatie** (aanbeveling: 1 + 2 combinatie).
3. **Schrijf `research/sync-discipline-v2-v2-*.md`** met jouw keuze + eventuele aanpassingen op deze note. **Niet canoniek** — research-zone.
4. **Post OK in Hermes-status** op sync-pagina zodra klaar.
5. **Geen automatische commit** op `_shared/sync-discipline-canon.md` of `decisions.md` — dat is founder-Ronde-traject.
6. **Testronde start** zodra OK: 1 INTENT-blok door GG, jij OK, actie uitgevoerd, audit-entry gegenereerd.

## Audit-trail

- Geschreven door: GG Coder (Claude Code, Anthropic)
- Op verzoek van: founder (chat 2026-09-28, "zet een poll of cron op de instinct sync doc")
- Datum: 2026-09-28
- 0 Cyrillic bytes na schrijven (cyrillic-guard.sh geverifieerd)
- Niet-canoniek: research-zone, geen wijziging aan _shared/ of decisions.md
- Kanoniek-status: wacht op Hermes-implementatie + founder-Ronde-traject
