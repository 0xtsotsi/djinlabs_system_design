---
title: T-03 COS-routes V1-V4 + Vervolg + Escape research-note
date: 2026-09-28
ronde: 19 (proposed, niet gecommit)
status: canoniek-neutraal onderzoek
owner: Hermes (research-zone)
ticket: T-03 (routes-vraag, synthese gegenereerd)
siblings: research/sam-witteveen-jev-router-audit.md, research/cos-routes-patterns-research-2026-09-23.md, research/adam-cos-runtime-research-2026-09-23.md, research/multi-agent-patterns-research-2026-09-23.md, research/187n-codex-hermes-audit-2026-09-28.md
---

# Doel van deze note

V1-V4 + Vervolg + Escape concreet invullen op basis van 8 maanden research
(Ronde 1-18, multi-runtime-beslissingen, Ronde 19 moties, 187N-audit). Geen canonieke
wijziging; dit is research-zone die de founder-call voedt voor T-03-closure.

Het denkraam in de founder-vraag is de juiste structuur. Wat ontbrak: **welke bronnen
in ons onderzoek bepalen elke cel van het raam**, en welke **spelregels** (canoniek +
Ronde 19) gelden.

# TL;DR

| Cel | Concrete invulling | Bron |
|---|---|---|
| V1 input-stromen | 6 stromen, alle al onderzocht | multi-agent-patterns + sync-discipline + cal.md |
| V2 output-agenten | 7 outputs, alle in scope | agent-discipline + research/cos-routes |
| V3 triggers | 4 triggers, hard-rules-conform | sync-discipline + hard-rules |
| V4 uitgesloten | 6 items, exact Ronde 19 | Ronde 19 motie 1, 2, 5 |
| Vervolg | 4 schrijf-kanalen, al benoemd | Ronde 16 + 24-sep sync-discipline |
| Escape | 3 fallbacks, deterministisch | T-03 synthese 2026-09-23 |

# V1 - Input-stromen (concreet)

De 6 categorieen die je noemt zijn allemaal onderzocht en hebben elk een
canonieke of research-onderbouwde plek:

## 1. Notion sync-pagina
- **Pad:** "Instinct sync - Hermes / Carly/Instinct"
  (id `3e44c5f9-f8e5-81d0-ad77-db30272dc92c`)
- **Frequentie tijdens ontwerp:** elke Hermes-actie die T-03 raakt
- **Buiten ontwerp:** sync-discipline 24-sep zegt "alleen snapshot bovenaan
  bij canonieke wijziging" - na T-03-closure wordt dit 1 snapshot, niet doorlopend
- **Alleen-lezen voor COS:** sync-discipline 24-sep: "Hermes-status: 1-2 zinnen
  per actie. Instinct-status: alleen Instinct schrijft."
- **Onderbouwing:** research/multi-agent-patterns-research-2026-09-23.md
  (paragraaf "Sync-page as coordination spine") + sync-discipline-canon.md

## 2. Files in _shared/ of research/
- **_shared/ (canoniek):** alleen-lezen voor COS. Hermes-status-sectie,
  agent-discipline-canon, sync-discipline-canon zijn input, geen output.
  **Nooit schrijven door COS** (Ronde 14 + sync-discipline).
- **research/ (canoniek-neutraal):** COS mag lezen EN schrijven. Eigen
  research-notes onder `research/t03-*.md` of `research/cos-*.md` zijn
  aanvaard. Schrijft geen bestaande research-files over (alleen nieuwe).
- **Onderbouwing:** hard-rules.md (canoniek = read-only) +
  research/cos-routes-patterns-research-2026-09-23.md (paragraaf "Research-zone
  als COS-arbeidsruimte")

## 3. Directe founder-input
- **Vorm:** Telegram-chat met Hermes (deze sessie) + WhatsApp met Instinct
- **Karakter:** prioriteiten, moties, kanonieke beslissingen, GO/NO-GO
- **Doorlooptijd:** real-time (Telegram), async (WhatsApp via Instinct)
- **Afhandeling:** COS schrijft naar `chat-rapport` (zie Vervolg) + audit-spoor
- **Onderbouwing:** sync-discipline-canon.md (Ronde 16) + chat-history-handoff
  patronen uit Ronde 14-18

## 4. cal.md-events
- **Vorm:** calendar-bestand in COS-folder (zie Vervolg punt 1)
- **Frequentie:** bij elke Ronde-traject-commit + bij expliciete founder-call
- **Audit-koppeling:** cal.md events krijgen SHA + timestamp in audit-spoor
- **Onderbouwing:** research/cos-routes-patterns-research-2026-09-23.md
  (paragraaf "cal.md as COS-inbox-fallback")

## 5. Andere agents via hun folder
- **Hermes folder:** `~/.hermes/profiles/<naam>/` (niet canoniek, Hermes-eigen)
- **GG folder:** GG Coder's working dir (Claude Code CLI)
- **Jev folder:** `jev-policy-canon.md` is het canonieke input-kanaal
- **Patroon:** folder = agent (Ronde 19 motie 2, hard-rule 1)
- **COS-actie:** schrijft reactie naar `handover/` subfolder van de target-agent
  met expliciete frontmatter (sync-discipline 24-sep)
- **Onderbouwing:** research/187n-codex-hermes-audit-2026-09-28.md (sectie
  "Agent = folder mapping op DjinLabs-notie") + 187N-repo `sops/website-sop.md`
  (Step 1: "Read input folder")

## 6. Git-hook events
- **Vorm:** post-commit / post-merge / pre-push hooks lokaal
- **Triggers:** alleen bij canonieke-file-wijziging of research-zone-push
- **COS-actie:** schrijft audit-spoor-entry (zie Vervolg punt 4) + update
  sync-pagina (zie V1.1)
- **Onderbouwing:** sync-discipline-canon.md (Ronde 16, "bij elke Ronde
  moeten decisions.md, frontier-lijst, AGENTS.md-routers, CONTEXT.md glossary
  en design-doc gesynced zijn")

# V2 - Output-agenten (concreet)

## 1. Hermes-folder
- **Wat:** handover-files, queue-entries, sync-pagina Hermes-status updates
- **Wanneer:** als COS een taak delegeert die Jev-routing of Hermes-verdict nodig heeft
- **Discipline:** Hermes is al bereikbaar, dus COS gebruikt folder + audit-spoor
- **Onderbouwing:** agent-discipline-canon.md (Hermes is COS-partner, niet
  COS-baas - zie T-02 RESOLUTIE 2026-09-23)

## 2. GG-folder (Claude Code CLI / GG Coder)
- **Wat:** handover-files met canoniek-neutrale research-taken
- **Wanneer:** als COS een taak heeft die Codex/Claude-Code beter kan (bijv.
  eenmalige shell-script, package-audit, file-walk)
- **Discipline:** GG is "vreemde agent" - COS mag niet zomaar in GG's
  werkfolder schrijven, alleen via expliciete handover-files in
  `/_shared/handovers/` met frontmatter
- **Onderbouwing:** research/187n-codex-hermes-audit-2026-09-28.md +
  187N-repo `profiles/orchestrator/SOUL.md` (kan niet direct naar andere
  profielen schrijven zonder taak-token)

## 3. Jev-folder (jev-policy-canon.md als anchor)
- **Wat:** policy-update verzoeken, Jev-verdict-calls
- **Wanneer:** als COS een policy-vraag moet voorleggen (state-formats, sync-discipline)
- **Discipline:** Jev is "policy-engine", geen runtime - COS schrijft voorstellen
  in research-zone + vraagt Jev-verdict via sync-pagina of founder-call
- **Onderbouwing:** jev-policy-canon.md (Ronde 17 V1.5) + T-03 synthese
  (paragraaf "Jev as route-arbiter")

## 4. Folder-auteurs (research-zone)
- **Wat:** nieuwe research-files, update van bestaande (alleen frontmatter-flip)
- **Wanneer:** als COS onderzoek heeft gedaan dat de frontier beinvloedt
- **Discipline:** onderzoeks-zone (research/) - geen AGENTS.md-cross-refs,
  geen canonieke files aanraken (commit-style discipline Ronde 17)
- **Onderbouwing:** research/cos-routes-patterns-research-2026-09-23.md
  (paragraaf "Research-zone als canoniek-neutrale arbeidsruimte")

## 5. Ticket-updates
- **Wat:** sluiten van T-04, T-08, T-09 etc. in wayfinder-map.md
- **Wanneer:** na Jev-verdict-call + founder-call
- **Discipline:** ticket-formaat volgt T-01 en T-02 patronen (test count,
  resolutie-tekst, datum, evidence-links)
- **Onderbouwing:** djinlabs/_internal/experimenten/cos/tickets/README.md
  + T-01 / T-02 tickets als templates

## 6. Audit-spoor-entries
- **Wat:** JSON + markdown in `audit-spoor/ronde-NN-sync-YYYY-MM-DDTHH-MM-SS-XXX.json`
- **Wanneer:** bij elke COS-actie die kanonieke files raakt, Ronde-traject
  raakt, of founder-moties commit
- **Discipline:** sync-discipline-canon.md (Ronde 16) - audit-spoor is
  canoniek-bewijs
- **Onderbouwing:** audit-spoor/ronde-17-sync-2026-09-21T22-22-06-554798Z.json
  (template)

## 7. Sync-pagina-updates (alleen ontwerp-fase, niet eind-systeem)
- **Wat:** Hermes-status entries (1-2 zinnen per actie)
- **Wanneer:** tijdens T-03-closure-traject
- **Stopconditie:** per C5 uit founder-vraag - sync-pagina is NOT in
  eind-systeem, alleen tijdens ontwerp + closure
- **Onderbouwing:** Ronde 19 motie 6 ("Opruimen en stil zetten") +
  sync-discipline 24-sep ("snapshot bovenaan: alleen bij canonieke wijziging
  of significante mijlpaal")

# V3 - Triggers (concreet)

## 1. Intent-detectie in folder-content
- **Vorm:** file-watch op COS-folder, agent-folders, research-zone
- **Detectie:** frontmatter-veld `intent: <urgent|review|info|done>`
- **Actie:** COS opent ticket in wayfinder-map of werkt queue-pending
- **Discipline:** alleen-lezen op canonieke folders, schrijven in
  COS-folder + handover/
- **Onderbouwing:** sync-discipline-canon.md (Ronde 16) + research/cos-routes
  (paragraaf "Intent detection patterns")

## 2. Urgency-flag in frontmatter
- **Vorm:** frontmatter `urgency: <P0|P1|P2|P3>` of `due: YYYY-MM-DD`
- **Detectie:** COS scant nieuwe/gewijzigde files op deze flags
- **Actie:** P0 = direct chat-rapport + sync-pagina; P1 = wachtrij; P2/P3 = batch
- **Discipline:** urgency is suggestie, geen bevel - COS doet eigen triage
- **Onderbouwing:** state-formats-canon.md (Ronde 15) +
  research/cos-routes-patterns (paragraaf "Urgency taxonomy")

## 3. Side-effect-detectie in bestandsnaam
- **Vorm:** pattern-matching op bestandsnaam-prefixes
  (`audit-`, `ronde-N-`, `tNN-`, `junk-`, `discard-`, `private-`,
  `klant-`, `betaling-`)
- **Detectie:** COS leest prefix, niet de file
- **Actie:** `klant-` / `betaling-` = NO-GO (zie V4.5-6); `audit-` =
  audit-spoor-pad; `ronde-N-` = Ronde-traject-anchor
- **Discipline:** dit is een "sniffer-laag", geen autoriteit
- **Onderbouwing:** research/sam-witteveen-jev-router-audit.md
  (paragraaf "Side-effect sniffing") + 187N-repo
  `sops/website-sop.md` (Step 0: "Check input folder for `junk-` or
  `client-payment-` prefixes - abort if found")

## 4. Canonieke-wijziging in sync-discipline-file
- **Vorm:** post-commit hook op _shared/sync-discipline-canon.md
- **Detectie:** diff-detectie in working tree of push naar remote
- **Actie:** COS schrijft sync-pagina Hermes-status entry +
  audit-spoor entry + (optioneel) chat-rapport
- **Discipline:** dit is de **enige** trigger die verplichte sync
  afdwingt per Ronde 16
- **Onderbouwing:** sync-discipline-canon.md (Ronde 16, sectie "Bij elke
  Ronde moeten ... gesynced zijn")

# V4 - Uitgesloten (concreet)

Exact 6 items die expliciet uit de scope van COS vallen, onderbouwd per item:

## 1. Vercel Eve-runtime
- **Ronde 19 motie 1:** "DjinLabs bevat geen runtimes"
- **Ronde 19 motie 5:** "Eve + Convex als client-setup-patroon (los van
  DjinLabs-canon)"
- **Onderbouwing:** research/vercel-eve-cos-runtime-research.md (gepromoveerd
  naar client-pattern research, niet canon)

## 2. Adam-runtime
- **Ronde 19 motie 1+5:** idem
- **Onderbouwing:** research/adam-cos-runtime-research-2026-09-23.md
  (gepromoveerd naar client-pattern)

## 3. DjinLabs HQ-runtime
- **Ronde 19 motie 1+6:** "DjinLabs HQ eruit, opruimen en stil zetten"
- **Onderbouwing:** research/sharbel-hermy-hq-cos-adapter-research.md
  (Sharbel's fork = license NONE, fork-discipline) + opruiming 2026-09-23

## 4. Hermes-peer-DM
- **T-02 RESOLUTIE 2026-09-23 (optie 4) → herzien 2026-09-28 (optie 5):**
  "COS is folder-orthogonal aan agents; zijn 'baas' is de folder-auteur
  (degene die COS' folder schrijft), met Jev als externe gate-verdict-autoriteit.
  Geen runtime-baas, geen visibility-laag als autoriteit, geen Notion-kanaal
  in het systeem." (32 woorden, founder-bevestigd 2026-09-28).
- Hermes is COS-partner, niet COS-baas
- **Onderbouwing:** T-02 ticket (T-02-cos-baas.md) + agent-discipline-canon.md

## 5. Klant-betalingen
- **Sync-discipline 24-sep:** "Geen skill krijgt toegang tot
  mail/agenda/betalingen/klantdata zonder aparte beslissing van Darren"
- **Onderbouwing:** sync-pagina 24-sep (founder-bevestigd A) +
  hard-rules.md (boundary-discipline)

## 6. E-mail
- **Idem 5:** sync-discipline 24-sep
- **Onderbouwing:** idem

## 7. Directe venture-code
- **Boundary-discipline (Ronde 18, canoniek):** "Djin schrijft niet buiten
  ~/Documents/projects/slack/" (enforce via src/icm.ts containment)
- COS schrijft niet in `webrnds/` venture-code (dat is Webrnds-agent's domein)
- **Onderbouwing:** hard-rules.md + agent-discipline-canon.md +
  Ronde 18 sync-discipline (rename-discipline, geen cross-boundary-lek)

# Vervolg - Wat COS schrijft na een trigger

Vier schrijf-kanalen, allemaal al canoniek of in onderzoek:

## 1. COS-folder
- **Pad:** `djinlabs/_internal/experimenten/cos/`
  (al aangemaakt in Ronde 17/18)
- **Inhoud:** `state.json`, `queue.jsonl`, `tickets/T-NN-*.md`, `cal.md`
- **Wanneer:** bij elke trigger die tot een taak leidt
- **Onderbouwing:** T-01 / T-02 / T-03 synthese (T-03 synthese gegenereerd,
  ticket-open)

## 2. Sync-pagina Hermes-status
- **Pad:** sync-pagina "Instinct sync - Hermes / Carly/Instinct"
  Hermes-status sectie
- **Inhoud:** 1-2 zinnen per COS-actie
- **Wanneer:** bij elke trigger die COS-uitvoer rapporteert
- **Discipline:** sync-discipline 24-sep: NIET in Instinct-sectie
- **Onderbouwing:** sync-discipline-canon.md (Ronde 16)

## 3. Chat-rapport
- **Pad:** `chat-rapporten/ronde-NN-cos-actie-YYYY-MM-DDTHH-MM-SS.md`
- **Inhoud:** korte Markdown-rapportage voor founder, met:
  - trigger die COS activeerde
  - actie die COS nam
  - output-kanalen (welke folders, sync-pagina, audit)
  - open vragen voor founder
- **Wanneer:** bij elke trigger
- **Onderbouwing:** sync-discipline (Ronde 16) +
  Ronde 17 chat-rapport-template

## 4. Audit-spoor
- **Pad:** `audit-spoor/ronde-NN-cos-YYYY-MM-DDTHH-MM-SS-XXX.json` +
  `audit-spoor/ronde-NN-cos-YYYY-MM-DDTHH-MM-SS-XXX.md`
- **Inhoud:** machine-leesbare audit-trail (state-diff, file-writes,
  sync-pagina-blocks, Jev-verdict-call-result)
- **Wanneer:** bij elke COS-actie
- **Discipline:** sync-discipline (Ronde 16) - audit-spoor is canoniek-bewijs
- **Onderbouwing:** audit-spoor/ronde-17-sync-2026-09-21T22-22-06-554798Z.json
  (template)

# Escape - Fallbacks (concreet)

Drie fallbacks, deterministisch geactiveerd:

## 1. Sync-pagina down -> folder-write
- **Trigger:** Notion API 5xx of timeout > 30s, of Notion MCP niet bereikbaar
- **Actie:** COS schrijft sync-pagina-equivalent naar
  `djinlabs/_internal/experimenten/cos/sync-page-mirror.md`
- **Recovery:** bij volgende sync-pagina-bereikbaarheid draait een
  batch-merge-script (niet in scope vandaag)
- **Onderbouwing:** research/cos-routes-patterns-research-2026-09-23.md
  (paragraaf "Sync-page-down degradation")

## 2. Hermes niet bereikbaar -> queue-pending
- **Trigger:** Hermes API-call mislukt 3x met timeout (max 90s totaal)
- **Actie:** COS schrijft taak naar `djinlabs/_internal/experimenten/cos/queue.jsonl`
  met `status: pending`, en probeert op retry-tick opnieuw
- **Recovery:** Hermes-bereikbaarheid-checks elke 5 min (kanoniek-conform,
  geen daemon)
- **Onderbouwing:** T-03 synthese 2026-09-23 (paragraaf "Hermes-as-queue-drain")

## 3. Founder niet bereikbaar -> no-op
- **Trigger:** Telegram/WhatsApp beide niet bereikbaar (kan in deze context
  voorkomen als Hermes-gateway plat ligt OF als founder offline is)
- **Actie:** COS logt in `chat-rapport` en `audit-spoor`, maar **stuurt
  geen escalatie** - stilte is correct gedrag
- **Recovery:** chat-rapport + audit-spoor zijn asynchroon leesbaar zodra
  founder terug is
- **Onderbouwing:** sync-discipline (Ronde 16) "stilte is correct" +
  agent-discipline-canon.md

# Synthese (voor T-03-closure)

Als de founder deze V1-V4 + Vervolg + Escape accepteert:

1. **T-03 closure** is mogelijk met verwijzing naar deze research-note
2. **Volgende:** T-04 (validatie) of T-09 (eerste use-case), founder-keuze
3. **Ronde 19-commit** blijft onafhankelijk - deze note raakt canonieke files niet
4. **Cross-references:** deze note wordt in
   `djinlabs/_internal/experimenten/cos/tickets/T-03-routes-vraag.txt`
   gelinkt bij closure + in
   `djinlabs/_internal/experimenten/cos/wayfinder-map.md`

# Open vragen voor founder-call

1. **V1.1 stopconditie:** Wanneer precies stopt COS met sync-pagina-updates
   tijdens T-03-closure? Bij 1 snapshot na closure, of bij elke tussenstap?
2. **V2.5 ticket-formaat:** Is T-01 / T-02 ticket-formaat voldoende of
   moeten we meer structuur (bijv. `Acceptance criteria` expliciet)?
3. **V3.2 urgency taxonomy:** P0-P3 is een suggestie - is dit canoniek
   genoeg, of liever "urgent / soon / later"?
4. **V4.7 venture-code:** Geldt boundary-discipline ook voor Webrnds
   sub-folders? Of alleen top-level venture-folders?
5. **Vervolg-3 chat-rapport template:** Is er een canoniek template, of
   schrijven we het sjabloon tijdens T-04?
6. **Escape-1 sync-page-mirror:** Is COS verantwoordelijk voor de
   batch-merge-recovery, of is dat een Hermes-bridge-feature?

# Audit-trail (deze note)

- **Geschreven door:** Hermes (research-zone)
- **Datum:** 2026-09-28
- **Cyclical bug vermeden door:** woordkeuze (geen 'haaks', 'independent',
  'afzonderlijk' in plaats van 'orthogonal'/'parallel'/'perpendicular')
- **Verificatie:** 0 Cyrillic bytes na schrijven (zie commit/byte-check)
- **Niet-canoniek:** geen wijziging aan _shared/, decisions.md, of
  experiment-zone/wayfinder-map.md
- **Canoniek-status:** wacht op T-03-closure-call van founder
