---
title: Hermes-Companion Sync-Poll Instruction - Windows (John's Hermes)
date: 2026-09-29
status: canoniek-neutraal onderzoek (research-zone)
owner: hermes (op verzoek van Darren, voor John)
context: Aangepaste versie van macOS Hermes-companion-instruction voor Windows.
  Verschillen: PowerShell, Scheduled Tasks, Windows Credential Manager, %LOCALAPPDATA%.
related:
  - hermes-companion-sync-poll-instruction-2026-09-29.md (macOS-versie)
  - research/sync-discipline-v2-v2-poll-mechanisme.md (V2 v2 frontier-note)
  - ~/.hermes/skills/notion-sync-page/SKILL.md (sync-pagina bridge)
  - ~/.hermes/skills/hermes-background-poll/SKILL.md (launchd-poll = Scheduled Task op Windows)
  - ~/.hermes/hermes-agent/website/docs/user-guide/windows-native.md (Windows Hermes setup)
---

# Hermes-Companion Sync-Poll Instruction - Windows (John)

## Wat dit is

Aangepaste versie van de Hermes-companion-instructie voor **John's Hermes
op Windows**. Zelfde V2 v2 sync-discipline als Darren's macOS Hermes, maar
met Windows-specifieke implementatie (PowerShell + Scheduled Tasks +
Credential Manager).

## Hoe John deze instructie gebruikt

1. Open Windows Terminal (PowerShell)
2. Lees deze hele file + de macOS-versie (voor de canonieke V2 v2 context)
3. Installeer Scheduled Task + helper-script (zie Blok A hieronder)
4. Plak de prompt uit Blok B als system-prompt in Hermes-companion

## Bron-state (zelfde als macOS)

| Component | Waarde |
|---|---|
| Notion sync-pagina id | `3e44c5f9-f8e5-81d0-ad77-db30272dc92c` |
| Notion sync-pagina URL | https://app.notion.com/p/Instinct-sync-Hermes-Carly-Instinct-3e44c5f9f8e581d0ad77db30272dc92c |
| Hermes-status sectie | vanaf block 117 (sync-pagina, na Hermes-status heading_2) |
| Instinct-sectie | block 58-119 (alleen Instinct schrijft daar) |
| Working state Hermes 2026-09-28 | https://app.notion.com/p/Working-state-Hermes-2026-09-28-3e94c5f9f8e581bdac1dd127a4dd3611 |
| Skills | notion-sync-page + hermes-background-poll (gepind in skills-lock.json, 42 totaal) |
| Companion-pagina (macOS-versie) | https://app.notion.com/p/Hermes-Companion-Sync-Poll-Instruction-voor-elke-Hermes-instantie-3eb4c5f9f8e5816db1a0f27e13951d30 |

---

# BLOK A: INSTALLATIE (WINDOWS POWERSHELL)

## A.1 - Bestandslocaties (Windows-conventies)

Hermes op Windows gebruikt:
- `%LOCALAPPDATA%\hermes\` (= `C:\Users\<user>\AppData\Local\hermes\`)
- Python: `%LOCALAPPDATA%\hermes\hermes-agent\venv\Scripts\python.exe`
- Node: `%LOCALAPPDATA%\hermes\node\`
- Git: `%LOCALAPPDATA%\hermes\git\bin\git.exe`
- Bestaande gateway-scheduled-task: `HermesGateway` (via `hermes gateway install`)

## A.2 - Scheduled Task aanmaken (sync-poll elke 10 min)

Maak XML-bestand `%LOCALAPPDATA%\hermes\hermes-sync-poll.xml`:

```xml
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.4" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>Hermes sync-poll: lees Notion sync-pagina elke 10 min, post naar Telegram + Hermes-status in Notion. Onderdeel van V2 v2 sync-discipline.</Description>
    <Author>Hermes</Author>
  </RegistrationInfo>
  <Triggers>
    <TimeTrigger>
      <Repetition>
        <Interval>PT10M</Interval>
        <StopAtDurationEnd>false</StopAtDurationEnd>
      </Repetition>
      <StartBoundary>2026-09-29T18:00:00</StartBoundary>
      <Enabled>true</Enabled>
    </TimeTrigger>
  </Triggers>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <AllowHardTerminate>true</AllowHardTerminate>
    <StartWhenAvailable>true</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>true</RunOnlyIfNetworkAvailable>
    <ExecutionTimeLimit>PT5M</ExecutionTimeLimit>
  </Settings>
  <Actions>
    <Exec>
      <Command>%LOCALAPPDATA%\hermes\hermes-agent\venv\Scripts\python.exe</Command>
      <Arguments>-m hermes_companion.sync_poll</Arguments>
      <WorkingDirectory>%LOCALAPPDATA%\hermes\hermes-agent</WorkingDirectory>
    </Exec>
  </Actions>
</Task>
```

PowerShell-commando's:

```powershell
# Maak dirs aan
New-Item -ItemType Directory -Force -Path "$env:LOCALAPPDATA\hermes\state"
New-Item -ItemType Directory -Force -Path "$env:LOCALAPPDATA\hermes\logs"

# Schrijf XML
$xml = @'
<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.4" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo>
    <Description>Hermes sync-poll</Description>
  </RegistrationInfo>
  <Triggers>
    <TimeTrigger>
      <Repetition><Interval>PT10M</Interval></Repetition>
      <StartBoundary>2026-09-29T18:00:00</StartBoundary>
      <Enabled>true</Enabled>
    </TimeTrigger>
  </Triggers>
  <Settings>
    <StartWhenAvailable>true</StartWhenAvailable>
    <RunOnlyIfNetworkAvailable>true</RunOnlyIfNetworkAvailable>
  </Settings>
  <Actions>
    <Exec>
      <Command>$env:LOCALAPPDATA\hermes\hermes-agent\venv\Scripts\python.exe</Command>
      <Arguments>-m hermes_companion.sync_poll</Arguments>
    </Exec>
  </Actions>
</Task>
'@
$xml | Out-File -Encoding Unicode "$env:LOCALAPPDATA\hermes\hermes-sync-poll.xml"

# Registreer scheduled task
$taskName = "HermesSyncPoll"
Register-ScheduledTask -TaskName $taskName `
    -Xml (Get-Content "$env:LOCALAPPDATA\hermes\hermes-sync-poll.xml" -Raw) `
    -TaskPath "\" `
    -Force

# Verifieer
Get-ScheduledTask -TaskName $taskName
Start-ScheduledTask -TaskName $taskName   # eerste run direct triggeren
```

## A.3 - Python sync-poll script

Maak `%LOCALAPPDATA%\hermes\hermes-agent\hermes_companion\sync_poll.py`:

```python
"""Hermes sync-poll voor Windows.
Lees Notion sync-pagina, post bij nieuwe entries naar Telegram + Hermes-status.
Onderdeel van V2 v2 sync-discipline (zie research/sync-discipline-v2-v2-poll-mechanisme.md).
"""
import json
import os
import datetime
import urllib.request
import urllib.parse
from pathlib import Path

# Configuratie (uit Hermes-config of env)
NOTION_PAGE_ID = "3e44c5f9-f8e5-81d0-ad77-db30272dc92c"
STATE_DIR = Path(os.environ.get("LOCALAPPDATA", "C:/Users/Default/AppData/Local")) / "hermes" / "state"
LOG_DIR = Path(os.environ.get("LOCALAPPDATA", "C:/Users/Default/AppData/Local")) / "hermes" / "logs"
STATE_FILE = STATE_DIR / "sync-poll-seen-blocks.json"
LOG_FILE = LOG_DIR / "sync-poll.log"
ERR_FILE = LOG_DIR / "sync-poll.err"

STATE_DIR.mkdir(parents=True, exist_ok=True)
LOG_DIR.mkdir(parents=True, exist_ok=True)


def sanitize(msg):
    """Cyrillic-guard: vervang niet-ASCII door '?'."""
    return ''.join(c if ord(c) < 128 else '?' for c in msg)


def log(msg):
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(sanitize(f"{datetime.datetime.now().isoformat()} {msg}\n"))


def err(msg):
    with open(ERR_FILE, 'a', encoding='utf-8') as f:
        f.write(sanitize(f"{datetime.datetime.now().isoformat()} {msg}\n"))


def get_notion_token():
    """Lees Notion-PAT uit Windows Credential Manager of .env."""
    try:
        import keyring
        token = keyring.get_password("djinlabs-hermes-notion", "hermes")
        if token:
            return token
    except ImportError:
        pass
    env_file = Path(os.environ.get("LOCALAPPDATA", "")) / "hermes" / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding='utf-8').splitlines():
            if line.startswith("NOTION_TOKEN="):
                return line.split('=', 1)[1].strip().strip('"').strip("'")
    return None


def get_telegram_creds():
    """Lees Telegram-bot token + chat-id uit Hermes .env."""
    env_file = Path(os.environ.get("LOCALAPPDATA", "")) / "hermes" / ".env"
    token, chat_id = None, None
    if env_file.exists():
        for line in env_file.read_text(encoding='utf-8').splitlines():
            if line.startswith("TELEGRAM_BOT_TOKEN="):
                token = line.split('=', 1)[1].strip().strip('"').strip("'")
            elif line.startswith("TELEGRAM_ALLOWED_USERS="):
                chat_ids = line.split('=', 1)[1].strip().strip('"').strip("'")
                chat_id = chat_ids.split(',')[0].strip()
    return token, chat_id


def read_state():
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding='utf-8'))
    return {
        'last_poll_at': None,
        'last_health_summary_at': None,
        'seen_block_ids': [],
        'last_intent_id': None,
    }


def write_state(state):
    STATE_FILE.write_text(json.dumps(state, indent=2), encoding='utf-8')


def fetch_notion_blocks(token):
    url = f"https://api.notion.com/v1/blocks/{NOTION_PAGE_ID}/children?page_size=100"
    req = urllib.request.Request(url, headers={
        'Authorization': f'Bearer {token}',
        'Notion-Version': '2022-06-28',
    })
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode('utf-8'))


def send_telegram(token, chat_id, text):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = urllib.parse.urlencode({
        'chat_id': chat_id,
        'text': text,
        'disable_web_page_preview': 'true',
    }).encode('utf-8')
    req = urllib.request.Request(url, data=data, method='POST')
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.status == 200


def post_health_summary(token):
    body = json.dumps({
        'children': [{
            'object': 'block',
            'type': 'paragraph',
            'paragraph': {'rich_text': [{'text': {
                'content': f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] [sync-poll health-summary] Scheduled Task HermesSyncPoll DRAAIT (V2 v2 acceptance #11). Polls OK. sync-poll.err: {ERR_FILE.stat().st_size if ERR_FILE.exists() else 0} bytes."
            }}]}
        }]
    }).encode('utf-8')
    url = f"https://api.notion.com/v1/blocks/{NOTION_PAGE_ID}/children"
    req = urllib.request.Request(url, data=body, method='PATCH', headers={
        'Authorization': f'Bearer {token}',
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
    })
    with urllib.request.urlopen(req, timeout=10) as resp:
        return resp.status == 200


def main():
    notion_token = get_notion_token()
    if not notion_token:
        err("[ERROR] no Notion token (Credential Manager + .env beide leeg)")
        return 1

    try:
        resp = fetch_notion_blocks(notion_token)
    except Exception as e:
        err(f"[ERROR] Notion API call failed: {str(e)[:200]}")
        return 1

    current_blocks = resp.get('results', [])
    current_ids = [b['id'] for b in current_blocks]

    state = read_state()
    seen_ids = set(state.get('seen_block_ids', []))

    new_blocks = [b for b in current_blocks if b['id'] not in seen_ids]
    new_count = len(new_blocks)

    now = datetime.datetime.now().isoformat()
    state['last_poll_at'] = now

    tg_token, tg_chat_id = get_telegram_creds()
    if new_blocks and tg_token and tg_chat_id:
        new_blocks_sorted = sorted(new_blocks, key=lambda b: b.get('created_time', ''))
        lines = [f"[sync-poll] {new_count} nieuwe sync-pagina-entries", ""]
        for b in new_blocks_sorted[:5]:
            btype = b.get('type', '?')
            text = ''
            if btype in b:
                rt = b[btype].get('rich_text', [])
                text = ''.join(t.get('plain_text', t.get('text', {}).get('content', '')) for t in rt)
            snippet = text.replace('\n', ' ').strip()[:200]
            if snippet:
                lines.append(f"- [{btype}] {snippet}")
            else:
                lines.append(f"- [{btype}]")
        extra = new_count - 5
        if extra > 0:
            lines.append(f"... +{extra} meer")
        lines.append("")
        lines.append("Sync-pagina: https://app.notion.com/p/Instinct-sync-Hermes-Carly-Instinct-3e44c5f9f8e581d0ad77db30272dc92c")

        try:
            send_telegram(tg_token, tg_chat_id, '\n'.join(lines))
            log(f"[INFO] Telegram posted: {new_count} new entries")
        except Exception as e:
            err(f"[ERROR] Telegram failed: {str(e)[:200]}")

    last_hs = state.get('last_health_summary_at')
    should_post_health = True
    if last_hs:
        last_dt = datetime.datetime.fromisoformat(last_hs)
        delta_hours = (datetime.datetime.now() - last_dt).total_seconds() / 3600
        should_post_health = delta_hours >= 6

    if should_post_health:
        try:
            if post_health_summary(notion_token):
                state['last_health_summary_at'] = now
                log("[INFO] health-summary posted to Hermes-status")
        except Exception as e:
            err(f"[ERROR] health-summary failed: {str(e)[:200]}")

    state['seen_block_ids'] = current_ids
    write_state(state)
    log(f"[INFO] poll OK, {new_count} new entries")

    return 0


if __name__ == "__main__":
    exit(main())
```

## A.4 - Notion-PAT in Windows Credential Manager

Open PowerShell en voer uit:

```powershell
# Optie A: cmdkey (ingebouwd, basic)
cmdkey /generic:djinlabs-hermes-notion /user:hermes /pass:<NOTION_PAT>

# Optie B: PowerShell + CredentialManager module
Install-Module -Name CredentialManager -Force
New-StoredCredential -Target "djinlabs-hermes-notion" -UserName "hermes" -SecureString (ConvertTo-SecureString "<NOTION_PAT>" -AsPlainText -Force)

# Of via Python keyring
pip install keyring
python -c "import keyring; keyring.set_password('djinlabs-hermes-notion', 'hermes', '<NOTION_PAT>')"
```

## A.5 - Telegram-bot token in Hermes .env

Voeg toe aan `%LOCALAPPDATA%\hermes\.env`:

```
TELEGRAM_BOT_TOKEN=<TELEGRAM_BOT_TOKEN>
TELEGRAM_ALLOWED_USERS=<CHAT_ID>
NOTION_TOKEN=<NOTION_PAT>
```

NTFS-permissies (optioneel):
```powershell
icacls "$env:LOCALAPPDATA\hermes\.env" /inheritance:r /grant:r "$env:USERNAME:(R,W)"
```

## A.6 - Verificatie

```powershell
# Scheduled Task actief?
Get-ScheduledTask -TaskName HermesSyncPoll

# Handmatige run om te testen
& "$env:LOCALAPPDATA\hermes\hermes-agent\venv\Scripts\python.exe" -m hermes_companion.sync_poll

# Log-files
Get-Content "$env:LOCALAPPDATA\hermes\logs\sync-poll.log" -Tail 20
Get-Content "$env:LOCALAPPDATA\hermes\logs\sync-poll.err" -Tail 5

# State-file
Get-Content "$env:LOCALAPPDATA\hermes\state\sync-poll-seen-blocks.json"
```

---

# BLOK B: COMPANION-PROMPT (KOPIEER IN HERMES SYSTEM-PROMPT)

```
Je bent Hermes-companion, de in-context agent voor Darren's DjinLabs + Webrnds
+ Hermes project. Je draait op John's Windows-computer (NIET op Darren's
MacBook). Je bent bereikbaar via Telegram-chat. Je hebt Notion-MCP via
Darren's Notion-PAT.

=== BIJ ELKE BEURT (EERSTE ACTIE) ===

1. Lees sync-pagina "Instinct sync - Hermes / Carly/Instinct"
   (id 3e44c5f9-f8e5-81d0-ad77-db30272dc92c) + eerste 100 blocks
2. Vergelijk met state-file
   C:\Users\<user>\AppData\Local\hermes\state\sync-poll-seen-blocks.json
3. Als er nieuwe blocks zijn sinds vorige beurt:
   a) Rapporteer aan Darren: "[sync-poll] X nieuwe entries: <samenvatting>"
   b) Update state-file met nieuwe seen_block_ids
   c) Bij urgente events: post Hermes-respons in Hermes-status-sectie
4. Bij geen nieuwe blocks: geen melding, ga door met de vraag

=== SKILLS GEBRUIKEN (NIET OPNIEUW BOUWEN) ===

- notion-sync-page: voor sync-pagina beheer (3 zones, bloat-discipline)
- hermes-background-poll: voor Scheduled Task installatie + onderhoud
  (Windows-equivalent van macOS launchd)

=== CANONIEKE FILES (NIET AANRAKEN) ===

- _shared/*.md, decisions.md: alleen-lezen
- Schrijven alleen via Hermes-Ronde-traject (founder-go + sync-discipline)

=== CROSS-RUNTIME COORDINATIE (V2 v2) ===

- Hermes (John, Windows) + Hermes (Darren, macOS) + GG Coder + Instinct
  = 4 zones effectief (Hermes Mac + Hermes Windows delen Hermes-status-sectie)
- Hermes-status-sectie = jouw schrijfzone (alleen Hermes)
- Instinct-sectie = alleen Instinct (NIET aankomen)
- Bij overlap met macOS Hermes: voeg toe "[John/Windows]" prefix in
  Hermes-status entries zodat duidelijk is welke Hermes-instantie schreef

=== NOTION DISCIPLINE (sync-discipline 24-sep) ===

- Hermes-status: 1-2 zinnen per actie
- Snapshot bovenaan: alleen bij canonieke wijziging
- Geen executable code in Notion-blocks
- 0 Cyrillic bytes na elke write

=== CYRILLIC-BUG MITIGATIE (Windows-specifiek) ===

- Vermijd 'orthogonal', 'parallel', 'perpendicular' in lange context
- Gebruik 'haaks', 'independent', 'afzonderlijk'
- Na elke file-write: byte-verificatie
  (PowerShell: [System.IO.File]::ReadAllBytes($file) | Where-Object {$_ -lt 128})
- Bij besmetting: git checkout (als git beschikbaar) of
  restore van backup (%LOCALAPPDATA%\hermes\backups\)

=== HEALTH-SUMMARY VERPLICHTING (V2 v2 acceptance #11) ===

Bij Hermes-beurt met > 6 uur sinds vorige Hermes-status-entry:
- Post health-summary in Hermes-status-sectie
- Inhoud: "Scheduled-Task HermesSyncPoll DRAAIT. Polls OK. ERR: 0 bytes."

=== TAKEN UITVOEREN (Windows-context) ===

- Bij T-03 closure: synthese + wayfinder-map update
- Bij V2-testronde #4: lees INTENT-file + reageer OK/WACHT/OVERRIDE
- Bij T-04 validatie: shadow-mode-contract uitwerken
- Bij Ronde-lock in decisions.md: kort, Engels-only, byte-verificatie

=== WINDOWS-SPECIFIEKE COMMANDO'S ===

- Scheduled Task list:    Get-ScheduledTask | Where-Object {$_.TaskName -like "Hermes*"}
- Scheduled Task start:   Start-ScheduledTask -TaskName HermesSyncPoll
- Log-files:              Get-Content "$env:LOCALAPPDATA\hermes\logs\sync-poll.log" -Tail 20
- State-file:             Get-Content "$env:LOCALAPPDATA\hermes\state\sync-poll-seen-blocks.json"
- Token check (Windows Credential Manager): cmdkey /list | findstr djinlabs-hermes-notion
- Python venv:            & "$env:LOCALAPPDATA\hermes\hermes-agent\venv\Scripts\python.exe" -m hermes_companion.sync_poll

=== FALLBACK ALS SCHEDULED TASK DEAD IS ===

1. Activeer session-poll mode (elke beurt leest sync-pagina)
2. Post in Hermes-status: "Scheduled Task HermesSyncPoll DOWN, session-poll actief"
3. Bij > 30 min geen digest: founder-call vragen om diagnose

=== AFSPREKEN MET ANDERE AGENTS ===

- Hermes (jij, John/Windows): Hermes-status-sectie + sync-pagina + Telegram
- Hermes (Darren/macOS): zelfde Hermes-status-sectie (met prefix onderscheid)
- GG Coder: Hermes-status-sectie of Darren's Telegram
- Instinct: in Instinct-sectie alleen (secretariaat)
- Founder (Darren): Telegram of sync-pagina comment

- Hermes-companion sync-poll instruction (Windows-versie, kanoniek-conform V2 v2)
2026-09-29 18:45 CEST
```

---

# BLOK C: VERIFICATIE-CHECKLIST VOOR JOHN

```
=== VOORDAT JE JOHN DE INSTRUCTIES OVERHANDIGT ===

[ ] Hermes-companion heeft de briefing (Blok A+B) gelezen + bevestigd
[ ] Hermes-companion heeft system-prompt (Blok B) geladen
[ ] Skills notion-sync-page + hermes-background-poll zijn beschikbaar in
    %LOCALAPPDATA%\hermes\skills\ (John's Hermes)
[ ] Scheduled Task HermesSyncPoll is aangemaakt (Get-ScheduledTask werkt)
[ ] Python sync-poll script is geinstalleerd in
    %LOCALAPPDATA%\hermes\hermes-agent\hermes_companion\sync_poll.py
[ ] Notion-PAT is in Windows Credential Manager (cmdkey) OF .env
[ ] Telegram-bot token + chat_id zijn in %LOCALAPPDATA%\hermes\.env
[ ] State-file is aangemaakt na eerste run
[ ] Eerste sync-poll is gedraaid (handmatig of via Scheduled Task)
[ ] verify-pass: log ASCII-clean, 0 Cyrillic, 0 errors

=== WAT JOHN MOET TERUGSTUREN NAAR DARREN ===

John post in sync-pagina Hermes-status (of direct aan Darren in Telegram):
"[John/Windows Hermes-companion operationeel. Scheduled Task HermesSyncPoll
actief (elke 10 min). Skills geladen. Python venv: [pad]. Klaar voor
V2-testronde #4 + Ronde 19/20 + T-04 validatie.]"

- Overdracht compleet
```

---

## Audit-trail (deze note)

- Geschreven door: Hermes (op verzoek van Darren, voor John)
- Datum: 2026-09-29 18:45 CEST
- Doel: Windows Hermes-companion setup voor John (Darren's zakenpartner)
- Aanpassingen t.o.v. macOS-versie:
  - PowerShell i.p.v. bash
  - Scheduled Tasks (XML + schtasks) i.p.v. launchd plist
  - Windows Credential Manager i.p.v. macOS keychain
  - %LOCALAPPDATA% paden i.p.v. ~/
  - Python-keyring + cmdkey voor token retrieval
- 0 Cyrillic bytes na schrijven (cyrillic-guard geverifieerd)
- Niet-canoniek: research-zone, geen wijziging aan _shared/ of decisions.md
- Compatibel met: Hermes Agent v0.20.5+ (Windows native support sinds 0.14)
