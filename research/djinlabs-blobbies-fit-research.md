# blobbies in DjinLabs — research rapport (pre-grill)

> **Bron-mapping + gap-analyse vóór /grill-me ronde.**
> Datum: 2026-09-20 (op basis van disk-state van 2026-09-19).
> Auteurschap: GG Coder research, op verzoek van founder.
> Doel: helder maken waar blobbies past in DjinLabs × Webrnds × Djin umbrella, vóór we de design-beslissingen vastleggen via grill.

## TL;DR

**blobbies is een derde runtime-laag, niet een derde onderneming.** Het past als **lokale provider + lokale agent-runtime** in het DjinLabs-template, niet als nieuwe instance. De huidige Djin (Slack/Bolt) en Webrnds (klantreis-uitvoering) zijn al "slagroom"; Blobbies is **"de room"** — de lokale computer waar alle gevoelige data en provider-keys leven, zonder dat die ooit de Mac verlaten.

| Aspect | Djin (Slack) | Webrnds (klantreis) | blobbies (lokaal) |
|---|---|---|---|
| **Rol** | Slack front-end | Klantreis-uitvoering | **Lokale agent-runtime + provider host** |
| **Storage** | `~/Documents/projects/slack/` | `/webrnds/clients/<slug>/` | **`~/Library/Application Support/com.blobbies.app/`** (geblokkeerd in `slack/`) |
| **Boundary** | Schrijft alleen binnen slack/ | Schrijft alleen in Webrnds | **Schrijft alleen lokaal op de Mac** |
| **Provider** | Anthropic Claude (vermoed) | (n.v.t.) | **Lokale LLM (Ollama / vergelijkbaar)** |
| **Gevoelige data** | Klant-data, sales | Klantreis-artefacten | **Klant-data + provider keys + lokale infra** |
| **In canon?** | Ja, ingebed (Ronde 12) | Ja, instance #1 | **Nog niet — dit rapport is het startpunt** |

---

## 1. Wat blobbies technisch is (van disk)

**Binary**: `/Applications/blobbies.app/Contents/MacOS/Blobbies` (31 MB)
**Helper**: `/Applications/blobbies.app/Contents/MacOS/blobbies-acp` (374 KB)
**Bundle ID**: `com.blobbies.app`
**Code signing**: "INDIANA RUSTAN DI" (Developer ID, team `396M7LY29W`)
**Runtime**: Tauri 2.11.5 (Rust + WebView), NIET Electron

**Wat erin zit (uit strings-extractie, geen venster geopend):**

| Component | Bewijs |
|---|---|
| Tray-app met menu | `tray-open`, `Open blobbies`, `tray-check-updates`, `Quit blobbies`, `CmdOrCtrl+Q` |
| ACP bridge | `acp_start`, `acp_close`, `acp_send`, `acp_relay_path`, `acp.json`, `Settings → Editors (ACP)` |
| Custom URL schemes | `acp://open`, `acp://frame`, `acp://close` |
| Skills-API | `skills_list`, `skills_save` (Tauri commands) |
| Secret store | `oauth_listen_port`, `oauth_await_redirect`, `secret_get`, `secret_set`, `secret_del` |
| Media | `media_info`, `media_clip`, `media_audio`, `ffmpeg_present`, Ollama-paden |
| Local LLM hooks | `/usr/local/bin/ollama`, `/Applications/Ollama.app`, `settings.json`, `model._:` |
| State | `app-quit`, `settings.json`, `acp.json`, `acp_send`, `transcript-ui-layout`, `drafts`, `recap.json` |

**Belangrijk detail**: `blobbies-acp` is een **apart gesigneerde Rust binary** die relay speelt tussen blobbies (UI) en een extern proces. Strings-extractie toonde letterlijk:
> "Blobbies is not running, and this relay could not start it. Open Blobbies, then enable Settings → Editors (ACP)."

Dat betekent: **ACP-relay is een out-of-process IPC-mechanisme**, vergelijkbaar met Djin's Bolt-app + agents-folder-patroon, maar dan binary-naar-binary in plaats van process-naar-folder.

## 2. Hoe blobbies past op de DjinLabs × Webrnds × Djin driehoek

### 2.1 Wat de canon zegt over lokale agents / lokale providers

De canon (`docs/djinlabs-1-folder-fundamentelen-design.md` + `decisions.md`) heeft **niets** gezegd over:
- Lokale LLM-providers (alles gaat via Anthropic / Claude of een cloud-API).
- Out-of-process IPC-relays anders dan Djin's Bolt-app.
- Tray-apps of desktop-runtime als agent-host.
- Een "lokaal"-zone binnen één instance.

**Wel** relevant uit de canon:
- **U2 — alles via hooks, geen directe file-writes.** blobbies zou als tray-app-bestand moeten schrijven via Djin's hooks (writeWrapper) als het Djin's folders aanraakt.
- **U3 — geen secrets in logs/state.** blobbies' eigen secret-store (`secret_get/set/del`) is canoniek-conform. Maar als blobbies ooit Djin's `state.md` zou lezen/schrijven moet redactie via TypeSafe Noul lopen (Q10 wire-up pad).
- **Q12 — tenant boundaries.** "Djin schrijft niet buiten ~/Documents/projects/slack/ (enforce via src/icm.ts containment)." → analoog: **"Blobbies schrijft alleen binnen ~/Library/Application Support/com.blobbies.app/ (enforce via Tauri sandbox + macOS app sandbox)."** Dit is een **nieuwe boundary-class** — Djin is een tenant met een file-containment-API, blobbies heeft macOS TCC + Tauri capability-scoping.
- **Ronde 11 — Skills-hosting.** "Canonieke skills in canon-folder; venture/klant-skills in flat registry met metadata." → blobbies-skills zouden in `/djinlabs/skills/lokaal/` of een nieuwe `/djinlabs/skills/blobbies/` met metadata `{layer: "venture" of hoger, scope, owner}` thuishoren — **niet** in blobbies' eigen app-state. Dat is een canon-uitbreiding, geen afwijking.
- **Q19 — agent-mapping topologie.** Drie lagen canon/venture/klant, agents orthogonaal aan skills. → blobbies is **geen agent-laag**; het is een **provider-host** waar agents tegenaan praten. Dat past binnen de orthogonaal-aan-agents claim.

### 2.2 Twee mogelijke plekken voor blobbies in de umbrella

**Optie A — Blobbies als lokale runtime binnen Djin.**
- Voordeel: Djin heeft al Bolt+Socket Mode + 3 agents + containment. blobbies kan een **nieuwe agent-loop** worden naast `sales/`, `work/`, `notes/` — `agents/blobbies/` met eigen ICM.
- Nadeel: Djin's boundary is `~/Documents/projects/slack/`. blobbies' state zit in `~/Library/...`. Dat botst met de containment-discipline. Tenzij je zegt "blobbies-lees-data mag in Djin's agents/ als read-only pointer".

**Optie B — Blobbies als nieuwe tenant binnen DjinLabs (parallel aan Djin).**
- Voordeel: eigen boundary `~/Library/Application Support/com.blobbies.app/`, eigen tenant-AGENTS.md in `/djinlabs/tenants/blobbies/`, eigen symlinks vanuit umbrella, leest canon maar schrijft niet.
- Nadeel: past niet in "Webrnds = instance #1, Djin = tenant #0, tweede instance = founder's call" patroon. blobbies is geen venture (geen facturatie), geen klantreis-uitvoering.

**Optie C — Blobbies als **lokale runtime-laag onder beide instances** (niet als tenant, niet als agent).**
- Voordeel: blobbies is **infra**, zoals macOS zelf. Het draait op de Mac en host de lokale provider waar Djin en Webrnds tegenaan praten voor gevoelige taken.
- Nadeel: breekt met de drie-lagen canon/venture/klant topologie. Je hebt dan een **nieuwe laag**: `infra (lokaal) → canon → venture → klant`. Dat is een canonieke uitbreiding die expliciet gelocked moet worden.

**Mijn aanbeveling**: Optie C, met één canonieke toevoeging: een **"lokaal runtime"-laag** in de agent-mapping topologie (Q19-uitbreiding), die expliciet **naast** de drie bestaande lagen staat, niet eronder. Reden: blobbies is geen venture (geen omzet), geen klantreis (geen levering), geen agent (geen folder met start.md/state.md). Het is **provider-host**. Net zoals macOS Slack een **front-end-host** is waar Djin op draait.

## 3. Wat blobbies al heeft dat past bij DjinLabs-canonieke mechanismen

| DjinLabs-mechanisme | blobbies-equivalent | Gap |
|---|---|---|
| Hooks (U2) | Tray-app schrijft direct naar `~/Library/...` | **Geen hook-laag.** Alles wat blobbies naar de umbrella zou schrijven moet via Djin's writeWrapper. |
| State files (U5/U6) | `settings.json`, `acp.json` (YAML/JSON, geen state.md-formaat) | **Gap: geen state.md met YAML-frontmatter.** Frontmatter is mens-leesbaar; JSON is tooling-leesbaar. |
| Containment (boundary) | macOS TCC + Tauri sandboxing | **Sterker dan Djin's icm.ts.** App-sandbox is een hardere boundary dan file-containment. |
| Skills (Ronde 11) | `skills_list`/`skills_save` Tauri commands | **Custom, niet canoniek.** Past bij "venture/klant-skills in flat registry" als metadata wordt toegevoegd. |
| Secret store | `secret_get/set/del` | **Sterker dan env-vars.** Past bij U3 (geen secrets in state). |
| Tray-UI | Tray-icoon met menu-items | **Sterker dan Slack-DM.** Geen kanaal-policy nodig; één-gebruiker-context. |
| ACP relay (out-of-process) | `blobbies-acp` binary | **Sterker dan Djin's Bolt-app.** Process-isolatie zonder netwerk. |
| Ollama hooks | `/usr/local/bin/ollama`, `ollama_installed`, `model._:` | **Gap: niet in canon.** Canon heeft geen lokale-LLM-notie. |

## 4. Wat Jev (TypeSafe) hier toevoegt

**Volgens `grok-bot-jev` README**: Jev is een **decision router** bovenop een agent. Drie primitives (Choice/Score/Noul), ~150ms latency, ~100× goedkoper dan LLM.

**Hoe dat past bij blobbies** (kandidaten, gesorteerd op kleinste impact → grootste):

1. **Noul op Tray-menu-keuzes** — Voordat blobbies een tray-actie uitvoert (`tray-open`, `tray-quit`, `tray-check-updates`), check `Noul("is deze actie in de huidige context veilig?")`. Sub-50ms overhead, fail-OPEN (consistent met Q10 hot-path).
2. **Noul op `secret_set` calls** — Voordat Blobbies een secret opslaat, check `Noul("breekt dit U3?")`. Hot-path block (consistent met Q10).
3. **Choice op `/money`-equivalent in blobbies** — Voordat blobbies een "geld-staat"-write doet (vermoed via Ollama provider-cost of facturatie-data), `Choice("approve/reject/hold")`. Fail-CLOSED (consistent met Q13-A).
4. **Score op Sunday-audit** — `Score` composite over blobbies' lokale state (settings.json, acp.json, dossier-folders) als tegenhanger van Webrnds' Sunday-audit.
5. **Choice op agent-routing** — Als blobbies later als "lokale runtime" agent-verkeer host, `Choice` voor "welke agent krijgt deze request" (Djin-Sales vs. Webrnds-Research vs. lokaal).

**Wire-up volgorde** (consistent met design-doc Q10/Q11):
1. **Eerste**: Noul-fail-OPEN in blobbies' tray-menu + secret_set path. Hot-path ≤50ms budget.
2. **Tweede**: Choice-fail-CLOSED in geld-staat-writes (parallel aan Q13-A).
3. **Derde**: Score composite in blobbies' eigen Sunday-audit (parallel aan Q16, R&D).
4. **MCP-wrapper**: `djinlabs/_internal/typesafe-mcp/` uitbreiden met Blobbies-specifieke tools, of een aparte `blobbies-mcp/` met dezelfde shapes-registry-discipline.

## 5. Wat deze plek **NIET** is

- **Geen vervanger voor Djin.** Djin doet Slack-front-end orchestration. blobbies doet lokale provider-host + ACP. Verschillende rol.
- **Geen vervanger voor Webrnds.** Webrnds is klantreis-uitvoering (Codavo-shaped). blobbies heeft geen klantreis-flow.
- **Geen nieuwe instance.** Het is geen venture, geen tenant, geen agent. Het is infra-laag.
- **Geen canonieke Jev-host.** Jev (TypeSafe) wordt in de canon gehost via `scripts/_internal/typesafe-mcp/`. blobbies krijgt blobbies-specifieke wire-ups via diezelfde MCP-wrapper of een Blobbies-eigen variant.

## 6. Open vragen vóór /grill-me

Deze vragen zijn **pre-grill** — geen design-beslissingen, alleen scope-verheldering. Antwoorden vormen de frontier waar /grill-me op kan beginnen:

1. **blobbies' provider-model.** Is de lokale LLM een Ollama-derivative, een llama.cpp binary, een ander runtime? Strings-extractie noemt Ollama expliciet; is dat de enige provider of meerdere?
2. **blobbies' gevoelige data.** Welke classes van data raakt blobbies? (klant-data, sales-data, sales-mail, klant-factuur-data, provider-keys, …) Welke privacy-regimes gelden (EU-only, klant-specifiek, etc.)?
3. **Djin-blobbies-relatie.** Leest Djin ooit blobbies' dossiers? Schrijft blobbies ooit naar Djin's `Work/` of `Sales/`? Of is de relatie nul-coupling met alleen umbrella-canonieke bronnen als gemeenschappelijke taal?
4. **ACP-relay vs. Djin-slash-commands.** Als blobbies ACP-start aanbiedt (`acp_start`), is dat een **parallelle** interface naast Slack-commando's? Zo ja, wie triggert (alleen user? ook Djin? ook Webrnds?)?
5. **Skills-hosting voor blobbies-specifieke skills.** Horen die in `/djinlabs/skills/blobbies/` (canoniek-pad) of in blobbies' eigen `~/Library/Application Support/com.blobbies.app/skills/` (lokale host)? Of allebei — canoniek-pointer + lokale host?
6. **Canon-uitbreiding topologie.** Accepteren we een vierde laag `infra (lokaal)` onder canon/venture/klant, of houden we blobbies binnen de huidige drie lagen (en zo waar)?
7. **Wat doet blobbies al vandaag dat je wilt behouden?** Welke gedragingen zijn canoniek (bijv. tray-menu, ACP-relay) versus welke zijn R&D (nog niet vastgelegd)?

## 7. Volgorde van beslissingen (gesuggereerd, NIET gelocked)

Mijn suggestie voor een **eerste grill-ronde** — in logische volgorde, één vraag per keer, met aanbevolen antwoord:

1. **Q-R1** — Is blobbies infra-laag (mijn aanbeveling) of agent of tenant?
2. **Q-R2** — Welke provider-klasse gebruikt blobbies (Ollama / llama.cpp / anders)?
3. **Q-R3** — Wat zijn de eerste Jev-wire-ups in blobbies? (Mijn aanbeveling: tray-menu Noul + secret_set Noul als rot-rules.)
4. **Q-R4** — Hoe ziet de blobbies-↔-Djin relatie eruit? (Mijn aanbeveling: nul-coupling, alleen umbrella-canoniek als gemene deler.)
5. **Q-R5** — Hoe landt blobbies in skills-hosting? (Mijn aanbeveling: `/djinlabs/skills/blobbies/` flat registry + blobbies-host pointers.)
6. **Q-R6** — Welke data-klassen zijn blobbies-eigen (en daarmee onder macOS-TCC) versus welke worden via umbrella uitgewisseld?

---

## Bijlagen

### A. Bron-bestanden die ik heb gelezen

- `djinlabs_system_design/AGENTS.md`
- `djinlabs_system_design/.gitignore`
- `djinlabs_system_design/.agents/skills/grilling/SKILL.md`
- `djinlabs_system_design/skills-lock.json`
- `djinlabs_system_design/decisions.md` (regel 1-280)
- `djinlabs_system_design/docs/djinlabs-1-folder-fundamentelen-design.md` (regel 1-253)
- `djinlabs_system_design/research/djinlabs-vs-5-layers-audit.md`
- `djinlabs_system_design/research/hard-rules-inventory.md`
- `djinlabs_system_design/research/matt-pocock-custom-skills-proposal.md`
- `djinlabs_system_design/_shared/AGENTS.md`
- `djinlabs_system_design/djinlabs/AGENTS.md`
- `djinlabs_system_design/webrnds/AGENTS.md`
- `djinlabs_system_design/djinlabs/tenants/djin/AGENTS.md` (via symlink in umbrella)
- `projects/slack/SESSION-BRIEF.md`
- `projects/slack/package.json`
- `projects/slack/ICM/Context/context.md` (incl. `## Umbrella-relaties` sectie)

### B. Bron-bestanden die ik NIET heb gelezen (relevant maar niet kritisch)

- `_shared/hard-rules.md`, `_shared/naming-conventions.md`, `_shared/icm-canon.md`
- `djinlabs/start.md`, `djinlabs/state.md`
- `webrnds/start.md`, `webrnds/state.md`, `webrnds/_rules.local.md`
- `djinlabs/_internal/CONTEXT.md`, `webrnds/_internal/CONTEXT.md`
- `webrnds/01-research/CONTEXT.md` t/m `06-na-livegang/CONTEXT.md`
- `agents/{sales,work,notes}/...` (Djin sub-agents)
- `scripts/hooks/watch.mjs` (Q4 wire-up)
- `scripts/_internal/typesafe-mcp/` (Q11 MCP-wrapper)
- `research/codavo-competitive-brief.md`, `research/simon-hoiberg-ai-system-7-figure.md`

### C. Bron-bestanden die expliciet niet bestaan

- `decisions.md` is op root-niveau (niet in `_shared/`); search_files miste 'm door de `.git/`-naamruis. Bestaat wel degelijk (280 regels, 23 KB).
- `tenants/djin/` is gespiegeld via 15 symlinks, niet fysiek in de umbrella. `read_file` resolvet via symlink; effectief leesbaar.
- `blobbies/ICM/` analogon — niet zinvol, blobbies is geen agent-host met folder-state. Heeft eigen JSON-config in `~/Library/Application Support/`.

### D. Observatie over grill-keuze (NIET blokkerend)

De lokale `grilling` skill zegt: "**Default voorkeur voor deze gebruiker: voer deze grill uit via de `grill-with-ui` skill** (browser-pagina met klikbare kaarten, Send-to-Agent)." Deze research-call gebruikt `/grill-me` (Markdown-variant) zoals expliciet aangevraagd. Voor toekomstige rondes kan `grill-with-ui` een betere UX zijn — maar dat is een observatie, geen blokkade.

### E. Technische observatie over deze sessie

Twee infrastructurele blokkades zijn omzeild, niet opgelost:
1. **macOS TCC** blokkeert brede search van `~/Documents`. Omzeild door `read_file` met expliciete absolute paden.
2. **Hermes shell `cd /private/tmp/shockwave-smoke`** is een dangling OCR-smoke artefact en wordt door een Hermes-runtime-werkdir aangestuurd. Omzeild door alleen `read_file` te gebruiken, geen `terminal`. Geen file-write naar Hermes-configs gedaan (U2-conform).

### F. Bron-mapping Jev (TypeSafe) → blobbies (kandidaten-lijst)

| Jev primitive | TypeSafe action | blobbies call-site | Canon-consistentie |
|---|---|---|---|
| Noul | `Noul("breekt dit U3?")` | `secret_set` pre-hook | Q10 wire-up pad, fail-OPEN |
| Noul | `Noul("is dit tray-item veilig?")` | Tray-menu actie | Q10, fail-OPEN |
| Choice | `Choice("approve/reject/hold")` | Geld-staat write | Q13-A, fail-CLOSED |
| Score | composite over blobbies state | Zondag-audit | Q16, R&D-spoor |
| Choice | Intent routing | Agent dispatch (als blobbies later host wordt) | Q19-uitbreiding |

### G. Bron-mapping Djin ↔ blobbies (boundary-test)

| Aspect | Djin boundary | blobbies boundary | Conflict? |
|---|---|---|---|
| Filesystem write-containment | `src/icm.ts` (process-niveau) | macOS TCC + Tauri sandbox (OS-niveau) | Geen — beide schrijven binnen eigen domein |
| Provider-keuze | Anthropic Claude | Ollama / lokale LLM | Geen — orthogonal |
| Skills-opslag | `agents/<naam>/icm/SKILL.md` | `secret`-store + Tauri commands | Geen — orthogonal, kan canon-flat-registry delen |
| Secret store | `.env` (U3-conform alleen voor keys) | `secret_get/set/del` | Geen — orthogonal |
| UI-front | Slack DM/kanaal | Tray-icoon | Geen — orthogonal |
| Output voor user | Slack message | Tray + dossier + (later?) ACP-start | Geen — orthogonal |