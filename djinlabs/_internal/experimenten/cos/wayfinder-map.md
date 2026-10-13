---
name: cos-wayfinder-map
description: Matt Pocock wayfinder-map voor COS (Chief of Staff) — destination, 10 frontier-tickets (T-01 t/m T-10), not-yet-specified items, out-of-scope items. Companion van `architecture-design.md`. Frontier-discipline: één ticket per sessie.
status: draft
version: 0.1
date: 2026-09-21
owner: djin
review_status: pending
reviewer: founder
pattern: Matt Pocock wayfinder (zie `.agents/skills/wayfinder/SKILL.md`)
tracker: lokaal markdown (geen GitHub issue-tracker geconfigureerd)
canonieke-discipline: onafhankelijk van canon; volgt `_shared/icm-canon.md` folder-structuur + `_shared/jev-policy-canon.md` (Ronde 17 V1.5) onafhankelijkheid-claim
related:
  - cos/architecture-design.md
  - cos/CONTEXT.md
  - cos/tickets/README.md (wanneer tickets gevuld worden)
  - .agents/skills/wayfinder/SKILL.md
  - .agents/skills/grilling/SKILL.md
  - .agents/skills/domain-modeling/SKILL.md
---

# COS Wayfinder Map — v0.1 (Ronde 18+ candidate)

> **Status:** Draft, niet canoniek
> **Created:** 2026-09-21
> **Owner:** djin (founder-review pending)
> **Pattern:** Matt Pocock wayfinder (zie `.agents/skills/wayfinder/SKILL.md`)
> **Tracker:** Lokaal markdown (geen GitHub issue-tracker geconfigureerd)
> **Companion:** `cos/architecture-design.md` (de design-doc die deze map orkestreert)

---

## Destination

**Wat het eind van deze map bereikt:** een **gedeelde COS-map + grill-flow** die alle agents (Hermes, GG, founders-werk, Webrnds-pipeline) orkestreert via **Jev-classification** met **shadow-mode discipline**, **vóór** de eerste klant live gaat op Webrnds.

**Buiten scope:** de runtime-implementatie van COS. Dat is een apart traject (zie Out-of-scope §4).

---

## Notes

**Domein:** Architectuur + workflow-design voor één onafhankelijke orkestratie-laag in een multi-agent setup.

**Skills elke sessie raadpleegt:**

- `.agents/skills/wayfinder` — deze map-discipline
- `.agents/skills/grilling` — frontier-vragen oplossen
- `.agents/skills/domain-modeling` — termen in `CONTEXT.md` opnemen
- `~/.hermes/skills/canon-aware-research` — bij extern onderzoek
- `~/.hermes/skills/decision-model-routing` — bij Jev-call integratie

**Staande voorkeuren voor deze effort:**

- Geen executable code (Ronde 14 grens)
- Geen canon-promotie zonder founder-commit (Ronde 16 sync-discipline)
- Frontier-discipline: één ticket per sessie, uitzondering research-tickets
- Verwijs naar tickets **bij naam** (wayfinder-regel §16), niet naar nummers
- Markdown = knowledge, JSON = state (Ronde 15 canon-principe)
- Confidence-bands (Ronde 17) bij elke Jev-call

---

## Decisions so far

| Ticket | Datum | Resolutie |
|---|---|---|
| **T-01** | 2026-09-21 | **"COS is je Chief of Staff — hij leest je inbox en stuurt elk bericht naar de juiste agent."** (20 woorden, 6/6 tests passing, founder-bevestigd) |
| **T-02** | 2026-09-23 (Optie 4); **2026-09-28 herzien → Optie 5** | **"COS is folder-orthogonal aan agents; zijn 'baas' is de folder-auteur (degene die COS' folder schrijft), met Jev als externe gate-verdict-autoriteit. Geen runtime-baas, geen visibility-laag als autoriteit, geen Notion-kanaal in het systeem."** (32 woorden, 6/6 tests passing, founder-bevestigd; anker G = 187N-audit) |
| **T-03** | 2026-09-23 R1; **2026-09-28 R2 closure** (runtime-vrij) | **"COS kent 6 input-stromen (Notion sync-pagina tijdens ontwerp, _shared/ + research/, directe founder-input, cal.md-events, andere agent-folders via handover/, git-hook events), routeert naar 7 outputs (Hermes-folder, GG-folder, Jev-folder via sync-pagina, research-zone, ticket-updates, audit-spoor, sync-pagina tijdens ontwerp), met 4 triggers (intent-detectie, urgency-flag urgent/soon/later, side-effect-sniffer, canonieke-wijziging) en 3 fallbacks (sync-page-mirror Hermes-bridge, queue-pending, no-op met stilte); 7 items uitgesloten (Vercel Eve, Adam, DjinLabs HQ, Hermes-peer-DM, klant-betalingen, e-mail, venture-code inclusief Webrnds sub-folders)."** (89 woorden, 6/6 tests passing, founder-bevestigd; bron = Hermes research-note t03-cos-routes-v1-v4-research-2026-09-28.md; 6 founder-call-antwoorden A/C/B/B/A/A) |
| **T-04** | **2026-10-08 R1 closure** (founder-call 4×A) | **"In de COS-pilot geldt een shadow-mode-contract met drie actie-types: (1) research-zone writes zijn read-only — COS schrijft niets naar research/, staging-output gaat naar cos/_internal/staging/ of naar chat-rapporten; (2) handover-decisions zijn dry-run — COS doet alsof het routeert naar Hermes/GG/Jev-folders, maar schrijft alleen naar cos/_internal/handover-shadow/<agent>/, Hermes rapporteert wekelijks de match-rate tussen shadow en echte intent; (3) canonieke schrijfacties raken cos/audit-spoor/<YYYY-MM-DD>.jsonl + cos/tickets/T-NN-*.md aan — geen _shared/, geen decisions.md, geen AGENTS.md-routers. Bij incident (canonieke file aangeraakt of uitgesloten item verstuurd): fail-OPEN detectie + audit-spoor-entry in cos/audit-spoor/incident-<ts>.md + directe Hermes-ping + git revert op de canonieke file (fail-CLOSED herstel)."** (91 woorden, 4/4 tests passing, founder-bevestigd; runtime-vrij; anti-canoniek default; T-09 conceptueel deblokkeerd; match-rate-vraag doorgezet naar T-06) |
| **T-09** | **2026-10-08 R1 closure** (founder-call 4×A) | **"Telegram-inbox triage: COS leest chat-input (Telegram/WhatsApp/Notion-chat) als T-03 input-stroom 'directe founder-input', classificeert per T-03 triggers (intent-detectie, urgency-flag urgent/soon/later, side-effect-sniffer), schrijft dispatch-suggesties naar cos/_internal/handover-shadow/<agent>/<ts>.md (Hermes/GG/Jev), en logt elke sessie naar cos/audit-spoor/<YYYY-MM-DD>.jsonl. Hermes/GG beoordelen wekelijks de match-rate; bij false-positive wordt incident aangemaakt conform T-04 incident-escape (audit-entry + Hermes-ping + git revert op audit-spoor indien nodig)."** (78 woorden, 4/4 tests passing, founder-bevestigd; scope = chat-kanaal; success = match-rate ≥ 80% + false-positive ≤ 5%; time-to-first-value = 7 dagen + Go/No-Go-call; T-06 + T-05 volgende stappen) |
| **T-06** | **2026-10-08 R1 closure** (research-mode, AFK) | **"COS doet drie classify_jev-calls tijdens de Telegram-inbox triage pilot: (1) cos_dispatch_classify — keuze tussen Hermes/GG/Jev + score urgency + noul 'raakt dit een canonieke zone?', per chat-bericht, met confidence-band high→auto-dispatch / mid→'twijfel'-annotatie / low→safe default GG (kanoniek-neutraal); (2) cos_false_positive_detect — keuze 'is een canonieke file in _shared/ of AGENTS.md geraakt OF een T-03 V4-uitgesloten item verstuurd?', per dispatch, high→incident + Hermes-ping + git revert (T-04 Q4), mid/low→alleen audit-spoor-entry; (3) cos_hermes_match_rate_score — score 'match tussen COS-dispatch en Hermes' intent' 0-1, wekelijks, ≥ 0.8=match / 0.5-0.8=marginaal / < 0.5=no-match. ask_human expliciet uit voor pilot (alleen T-04 incident-escape pingt founder)."** (109 woorden, 4/4 tests passing, founder-bevestigd; 3 calls + 1 uitsluiting; confidence-band defaults lower=0.35 upper=0.7 uit jev-policy V1.5; T-05 versterkt — per-call JSON-rij in cos/audit-spoor/) |
| **T-05** | **2026-10-08 R1 closure** (founder-call 5-vragen + Q1-Markdown-aanvulling) | **"COS houdt per-call observatie bij als Markdown-tabel in cos/audit-spoor/dispatch-<date>.md met kolommen (date, dispatch_id, intent, urgency, side_effect, match_rate, agent_route, false_positive_flag, incident_id) — sluit aan op state-formats-canon (Markdown = knowledge), is leesbaar voor founder tijdens week-1-evaluatie, en stelt JSONL uit naar T-08+ waar agents state-machines krijgen. Geen sessie-aggregaat door COS (Hermes doet wekelijkse review per T-04 Q2). Tickets (Markdown, kanoniek-neutraal staging) en audit-spoor (Markdown-detail, observatie-logs) volgens canon-discipline. Retention-default operationeel (30 dagen, parameter per retention-policy-canon); incident-files krijgen retention: canoniek via frontmatter-override. _shared/state-formats-canon hint toegevoegd (kanoniek-uitbreiding-light); derde bucket is open canonieke vraag voor latere Ronde."** (96 woorden, 5/5 tests passing, founder-bevestigd; 9-koloms-schema; pilot-start-blokkering opgeheven; canon-extensie-light in _shared/state-formats-canon.md §Observatie-logs) |
| **T-07** | **2026-10-10 R1 closure** (founder-call 4×A) | **"COS bij Jev-call unreachable volgt fail-CLOSED per jev-policy-canon §Fail-mode matrix: in-flight handover-shadows worden bevroren in `cos/_internal/handover-shadow/<agent>/<ts>.md` met freeze-flag, en incident-entry gaat naar `cos/audit-spoor/incident-<ts>.md` (T-04 incident-escape). Recovery: zodra Jev-call bereikbaar is, COS replayt bevroren shadows per shadow-mode-contract (T-04 Q2 dry-run) en doet Jev-call per item voordat definitieve dispatch. Founder wordt gealerteerd via audit-spoor-entry + Hermes-ping + chat-kanaal-ping bij high-urgency of N-failures-threshold; geen queue (Ronde 19: geen runtime), geen auto-fallback Hermes (zou T-02 Optie 5 schenden), geen hard-fail-OPEN (canon-inconsistent)."** (90 woorden, 4/4 tests passing, founder-bevestigd; canon-patroon fail-CLOSED gevolgd; T-08 + T-10 versterkt; canon-promotie naar v0.2 §Jev-failure-mode gepland) |
| **T-08** | **2026-10-10 R1 closure** (founder-call A/A/D/C) | **"COS orkestreert parallelle sessies via vier ankerpunten: (1) per-bericht-filenames in handover-shadow voorkomen race-by-design; (2) per-chat-kanaal sequencer (Telegram-FIFO canoniek, geen DjinLabs-runtime); (3) Hermes/GG beoordelen wekelijks in batch (Ronde 19: peer, geen service); (4) dual-version behoud bij onverwachte race, founder arbitreert. Geen file-locks, geen DjinLabs-sequencer (Ronde 19), geen COS-merge (T-02 Optie 5), geen auto-revert (founder = baas). T-09 canon-implicatie: Hermes-als-writer herijkt naar weekly-batch."** (88 woorden, 4/4 tests passing, founder-bevestigd; Q3=D + Q4=C zijn bewuste afwijking van COS-aanbeveling; canon-promotie naar v0.2 §Parallelle-sessies gepland) |
| **T-10** | **2026-10-10 R1 closure** (COS full-auto mandate, D/D/D/D) | **"COS v0.1 doet expliciet NIET: (1) canon-promotie, agent-roster, klantuitvoer (founder-werk); (2) queue, database, dashboard, eigen runtime (Ronde 19 motie 1); (3) onbekende agent-classes, agents zonder agentId, Hermes-equivalenten (geen onveilige delegatie); (4) bij out-of-scope: defense-in-depth — founder-call voor high-impact, error-response voor low-impact, audit-entry+skip voor spam. Geen auto-promotie, geen eigen runtime, geen agent-zonder-id, geen onveilige escalatie."** (73 woorden, 4/4 tests passing, COS full-auto mandate aangenomen; canon-promotie naar v0.2 §Out-of-scope gepland) |

---

## Tickets

> **Status:** T-01 + T-02 + T-03 + **T-04** + **T-09** + **T-06** + **T-05** + **T-07** + **T-08** + **T-10** zijn **closed** (10/10 frontier-tickets gesloten 2026-10-10). Frontier-volgorde afgerond; klaar voor Ronde 20+ canon-promotie-traject.
> **Notatie:** `T-<nummer> — <naam>` is de ticket-naam waarnaar verwezen wordt.

### T-01 — Wat is COS in één zin?

- **Type:** grilling
- **Status:** closed (resolved 2026-09-21)
- **Resolution-file:** `tickets/T-01-cos-definitie.md`
- **Resolution:** "COS is je Chief of Staff — hij leest je inbox en stuurt elk bericht naar de juiste agent." (20 woorden)
- **Blocking:** ~~F2 (wie is COS' baas)~~ **deblokkeerd** — T-02 kan nu starten; ~~F4 (validatie)~~ **deblokkeerd** — definitie is nu bekend.
- **Acceptance:** Één zin, ≤30 woorden, onafhankelijk van venture-naam, testbaar door vreemde. **Alle 6 tests passing.**

### T-02 — Wie is COS' "baas"?

- **Type:** grilling
- **Status:** **closed** (resolved 2026-09-23 optie 4; **herzien 2026-09-28 → Optie 5**)
- **Ticket-file:** `tickets/T-02-cos-baas.md` (resolution-artifact, 6/6 tests passing, Optie 5)
- **Vraag-file:** `tickets/T-02-baas-vraag.txt` (R1 multiple choice + R2 open; Cyrillic-hits gefixt 2026-09-28)
- **Deblokkeert:** T-04 (valideren), T-08 (parallelle sessies), T-09 (eerste live use-case)
- **Vraag:** Wie heeft autoriteit over COS' gedrag?
- **Resolutie (Optie 5, 2026-09-28):** "COS is folder-orthogonal aan agents; zijn 'baas' is de folder-auteur (degene die COS' folder schrijft), met Jev als externe gate-verdict-autoriteit. Geen runtime-baas, geen visibility-laag als autoriteit, geen Notion-kanaal in het systeem." (32 woorden)
- **Ankers:** 187N-audit (`research/187n-codex-hermes-audit-2026-09-28.md`, §2.2); agent-discipline-canon; sync-discipline R16 met C5-verscherping (Notion = communicatiemiddel tijdens ontwerp, geen onderdeel van systeem).
- **Acceptance:** Eén mechanisme gekozen + escape-route gedocumenteerd + 187N-aanpak gevolgd. ✅

### T-03 — Welke routes kent COS bij eerste launch?

- **Type:** grilling
- **Status:** **closed** (R2 closure 2026-09-28, runtime-vrij, founder-bevestigd)
- **Ticket-file:** `tickets/T-03-cos-routes.md` (resolution-artifact, closed, 11772 bytes, 0 Cyrillic)
- **Vraag-file:** `tickets/T-03-routes-vraag.txt` (6.5K, runtime-vrij, gesloten)
- **Deblokkeert:** T-04 (validatie-mechanisme hangt af van route-triggers), T-08 (parallelle sessies), T-09 (eerste live use-case)
- **Vraag:** Welke input-stromen (folders, files, sync-pagina) en output-agenten (folder-auteurs, andere agents) gebruikt COS bij eerste launch?
- **Herijking per motie 4 (Ronde 19):** runtime-ankers C (multi-runtime-architectuur) en D (Vercel Eve authoring) eruit; route-beschrijving werd folder-verwijzingen. R1 (2026-09-23) was runtime-input/output; R2 (2026-09-28) was folder-verwijzingen + Hermes-research-input.
- **Resolutie:** 89 woorden, 6/6 tests passing. Zie "Decisions so far" tabel boven.
- **Founder-call op 6 open vragen:** V1.1=A (1 snapshot), V2.5=C (expliciete acceptance-criteria), V3.2=B (urgent/soon/later), V4.7=B (boundary incl. Webrnds sub-folders), Vervolg-3=A (sjabloon in T-04), Escape-1=A (Hermes-bridge).
- **Acceptance:** 6/6 criteria passing (expliciet gespecificeerd per V2.5). ✅

### T-04 — Hoe valideer je COS zonder canonieke files aan te raken?

- **Type:** grilling
- **Status:** **closed** (resolved 2026-10-08 R1, founder-call 4×A)
- **Resolution-file:** `tickets/T-04-validatie.md` (91-woord contract, 4/4 tests passing, runtime-vrij)
- **Resolution:** zie "Decisions so far" tabel boven.
- **Blocking:** ~~F9 (eerste live use-case)~~ **conceptueel deblokkeerd** — T-09 kan nu binnen T-04 contract-bandwidth.
- **Vraag (afgesloten):** Wat is het **shadow-mode-contract** voor COS' eerste pilot?
- **Acceptance:** Contract beschreven + risico-analyse per actie-type. ✅ 4/4 criteria passing.

### T-05 — Wat is COS' state-model?

- **Type:** grilling + domain-modeling
- **Status:** **closed** (resolved 2026-10-08 R1, founder-call 5-vragen + Q1-Markdown-aanvulling)
- **Resolution-file:** `tickets/T-05-state-model.md` (96-woord state-schema, 5/5 tests passing, 9-koloms Markdown-tabel in `cos/audit-spoor/dispatch-<date>.md`)
- **Resolution:** zie "Decisions so far" tabel boven.
- **Blocking:** ~~F4 (validatie)~~ **opgeheven** — T-05 schema in T-04 contract-bandwidth; ~~F8 (parallelle sessies)~~ **deblokkeerd** — lock-discipline + JSONL-pas mogelijk in T-08.
- **Vraag (afgesloten):** Welke **state** houdt COS bij?
- **Acceptance:** State-schema met expliciet canon-vs-runtime onderscheid, conform state-formats-canon.md. ✅ 5/5 criteria passing.
- **Acceptance:** State-schema met expliciet canon-vs-runtime onderscheid, conform `state-formats-canon.md`.

### T-06 — Welke Jev-calls doet COS?

- **Type:** research
- **Status:** **closed** (resolved 2026-10-08 R1, AFK per frontier-discipline)
- **Resolution-file:** `tickets/T-06-jev-calls.md` (109-woord 3-call-lijst + ask_human-uitsluiting, 4/4 tests passing, runtime-vrij, jev-policy V1.5 gevolgd)
- **Resolution:** zie "Decisions so far" tabel boven.
- **Vraag (afgesloten):** Welke **Jev-classifications** heeft COS nodig?
- **Acceptance:** Lijst van Jev-calls met action-type, question-shape, en confidence-band defaults. ✅ 4/4 criteria passing (3 calls + 1 uitsluiting).

### T-07 — Wat is de failure-mode bij Jev-down?

- **Type:** grilling
- **Status:** **closed** (resolved 2026-10-10 R1, founder-call 4×A)
- **Resolution-file:** `tickets/T-07-jev-failure.md` (90-woord fail-CLOSED-contract, 4/4 tests passing, runtime-vrij)
- **Resolution:** zie "Decisions so far" tabel boven.
- **Vraag (afgesloten):** Wat is het **fail-CLOSED-regime** voor COS' Jev-call-onbereikbaarheid?
- **Acceptance:** Failure-mode + in-flight shadow-regime + recovery-strategie + founder-alert. ✅ 4/4 criteria passing.

### T-08 — Hoe orkestreert COS meerdere parallelle sessies?

- **Type:** grilling
- **Status:** **closed** (resolved 2026-10-10 R1, founder-call A/A/D/C)
- **Resolution-file:** `tickets/T-08-parallelle-sessies.md` (88-woord orchestratie-contract, 4/4 tests passing, runtime-vrij)
- **Resolution:** zie "Decisions so far" tabel boven.
- **Vraag (afgesloten):** Hoe voorkomt COS dat twee parallelle sessies (Hermes + GG) dezelfde research-file bewerken?
- **Acceptance:** Conflict-resolution-strategie + sequencer-keuze + Hermes/GG-interactie-model + recovery-strategie. ✅ 4/4 criteria passing.

### T-09 — Wat is de eerste live use-case voor COS?

- **Type:** grilling
- **Status:** **closed** (resolved 2026-10-08 R1, founder-call 4×A)
- **Resolution-file:** `tickets/T-09-eerste-use-case.md` (78-woord Telegram-inbox triage scenario, 4/4 tests passing, runtime-vrij)
- **Resolution:** zie "Decisions so far" tabel boven.
- **Blocking:** ~~F10 (out-of-scope)~~ **volgende stappen na Go-call**: T-06 + T-05.
- **Vraag (afgesloten):** Welk **concreet scenario** is COS' eerste pilot?
- **Acceptance:** Scenario met inputs, expected outputs, success-criteria, time-to-first-value. ✅ 4/4 criteria passing.

### T-10 — Wat doet COS NIET bij eerste launch?

- **Type:** grilling
- **Status:** **closed** (resolved 2026-10-10 R1, COS full-auto mandate D/D/D/D)
- **Resolution-file:** `tickets/T-10-niet-doen.md` (73-woord out-of-scope-contract, 4/4 tests passing, runtime-vrij)
- **Resolution:** zie "Decisions so far" tabel boven.
- **Vraag (afgesloten):** Wat is expliciet **out-of-scope** voor COS v0.1?
- **Acceptance:** Expliciete out-of-scope-lijst (bewerkingen + runtime + agent-typen + escalatie-paden). ✅ 4/4 criteria passing.

---

## Not yet specified

*Dim view van beslissingen die nu nog niet scherp genoeg zijn om te ticketen. Graduateert naar tickets naarmate de frontier vordert.*

- **COS runtime-stack** — Welke programmeertaal, welke runtime, welke deployment? Wordt relevant na T-04 (validatie) is opgelost.
- **COS governance-update-mechanisme** — Hoe veranderen COS' regels over tijd? Via Ronde-flow of via directe-update?
- **COS audit-retentie** — Hoe lang blijven audit-sporen bewaard? Volgt retention-policy of COS-specifiek?
- **COS multi-tenant-scheiding** — Als Webrnds, Djin, en toekomstige ventures COS delen, hoe wordt data gescheiden?
- **COS messaging-formaat** — Hermes↔COS, COS↔GG, COS↔founder: welk protocol, welke envelopes?
- **COS rate-limiting** — Wat als er 1000 berichten per minuut binnenstromen?
- **COS prompt-injection-verdediging** — Hoe voorkomt COS dat instructies via input-stroom de routering wijzigen?
- **Sharbel's Hermy HQ als COS runtime-substraat** — Onderzoek gestart 2026-09-23. **Pauzeren per Vercel Eve-ontdekking 2026-09-23.** Vercel Eve's "agent = directory" is een betere match voor onze agent=folder=ICM notie dan Sharbel's Hermy HQ (NONE license, bus factor 1, adapter nodig). Sharbel-trail blijft als research-verkenning in `../research/sharbel-hermy-hq-cos-adapter-research.md` maar wordt niet actief opgepakt.
- **Vercel Eve als COS runtime-substraat** — Research gestart 2026-09-23. Zie `../../../research/vercel-eve-cos-runtime-research.md`. Conclusie: Eve is de te volgen richting (open source, agent=directory native, Vercel-ondersteuning). Herschreven design-doc: `multi-runtime-cos-design.md` (vervangt `sharbel-hermy-hq-adapter-design.md` → nu `sharbel-hermy-hq-adapter-design.ARCHIVED-2026-09-23.md`). Twee-systemen-aanpak: Vercel Eve = COS-runtime, DjinLabs HQ (fork Hermy HQ) = lokaal mission-control dashboard. **Gearchiveerd 2026-10-10 per Ronde 19 motie 1** (DjinLabs zonder runtimes, Eve vervalt als canon-patroon voor DjinLabs; Eve blijft optie voor Webrnds-kant).
- **T-11 sync-discipline V2** — Aangemaakt 2026-09-28 door GG Coder, **pending Hermes-akkoord + founder-Ronde-traject** (zie `tickets/T-11-sync-discipline-v2.md`). Doel: Hermes + GG Coder werken samen via sync-pagina INTENT-blokken zonder founder-as-router. Niet-blokkerend voor huidige frontier-closure; wacht op Hermes-revisie + Ronde-lock om als T-11 R1 te openen.

---

## Out of scope

*Werk dat bewust buiten deze map valt. Graduateert niet — alleen als de destination wordt hertekend.*

- **COS runtime-implementatie** — Code schrijven, deployment, CI/CD. Dit is design-fase. Implementatie komt na T-04 + T-09.
- **Canonieke COS-file** — `_shared/cos-architecture-canon.md` schrijven. Komt pas na voldoende frontier-resolution, met founder-commit.
- **Webrnds-profiel wijzigen** — Het profiel is zojuist gecommit (`research/webrnds-profile.md`, status `reviewed`). COS-werk past onafhankelijk, geen wijziging aan profiel behalve cross-references.
- **Codavo-onderzoek uitbreiden** — `research/codavo-competitive-brief.md` is gecommit met 2026-09-21 delta. Geen verdere updates in deze map.
- **Ronde 17 canonieke files wijzigen** — `jev-policy-canon.md`, `sync-discipline-canon.md`, `decisions.md` blijven onveranderd tijdens deze map. Alleen-shadow-read.

---

## Verwijzingen

- **Design-doc:** `architecture-design.md` (zelfde folder)
- **Webrnds-profiel:** `../../research/webrnds-profile.md` (gecommit 2026-09-21)
- **Codavo-brief:** `../../research/codavo-competitive-brief.md` (gecommit 2026-09-21)
- **Skills:**
  - `.agents/skills/wayfinder/SKILL.md` (deze map-discipline)
  - `.agents/skills/grilling/SKILL.md`
  - `.agents/skills/domain-modeling/SKILL.md`
  - `.agents/skills/research/SKILL.md`
  - `~/.hermes/skills/canon-aware-research/SKILL.md`
  - `~/.hermes/skills/decision-model-routing/SKILL.md`

---

## Audit-trail

- **Map gecharted door:** Hermes MiniMax-M3 sessie 2026-09-21
- **Pattern-bron:** Matt Pocock wayfinder via `.agents/skills/wayfinder/SKILL.md`
- **Grill-me-discipline:** Toegepast voor alle T-01 t/m T-05, T-07 t/m T-10 tickets
- **Research-ticket:** T-06 is research-type (mag AFK worden opgelost)
- **Verwachte doorlooptijd:** 5-10 grill-sessies om alle tickets te resolven, daarna canon-promotie-traject

---

## Handoff Notes for Next Agent

- **Begin met T-01** ("Wat is COS in één zin?"). Dat is de eerste-grill-vraag en de basis voor alle andere tickets.
- **Verwijs naar tickets bij naam** (T-01, T-02, etc.), niet naar nummers.
- **Bij twijfel of een vraag canon-niveau is:** gebruik de placeholder-test uit `canon-aware-research` §7. Zou de zin nog kloppen als je COS vervangt door "[orkestrator]"? Dan is 't canon. Zo niet, dan implementation.
- **Bij domein-term die canon-niveau wordt:** update `CONTEXT.md` meteen (domain-modeling §"Update CONTEXT.md inline"), in een aparte commit.
- **Niet alle tickets in één sessie oplossen.** Eén ticket per sessie, uitzondering research.
- **Bij elke ticket-resolution:** post het antwoord als comment op deze map (in markdown), sluit de ticket, append aan "Decisions so far".
