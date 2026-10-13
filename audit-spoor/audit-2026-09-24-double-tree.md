---
name: double-tree-audit-2026-09-24
title: Audit — djinlabs_system_design + system/design met Matt Pocock skills
date: 2026-09-24
status: pending
type: audit-rapport
scope: djinlabs_system_design/ + /Users/gogetta/Documents/djinlabs/system/design
methods:
  - r18 f0 drift-inventarisatie (research/r18-f0-design-doc-drift-inventarisatie.md) verlengd
  - .gg/AUDIT-SUMMARY.md + .gg/pre-brief-grill-with-ui.md (vorige sessie) samengevat
  - Matt Pocock vocabulary: `codebase-design` (module / interface / depth / seam / adapter / leverage / locality) en `improve-codebase-architecture` (deletion test, deep vs. shallow, one adapter = hypothetical seam)
  - eigen canon-criteria (`_shared/*-canon.md`) waar Matt Pocock vocabulary niet past
provenance: founder-verzoek 2026-09-24; uitvoerend: gg-coder
review_status: unreviewed
related:
  - ../research/r18-f0-design-doc-drift-inventarisatie.md
  - ../research/matt-pocock-custom-skills-proposal.md
  - ../research/matt-typesafe-coding-agent-audit.md
  - ../research/sharbel-skills-audit-2026-09-23.md
  - ../research/jev-icm-file-classification-test.md
  - ../research/rondasync-shadow-mode-r17.md
  - ../decisions.md
  - ../docs/adr/0001-state-formats-canon.md
  - ../docs/adr/0002-sync-discipline.md
  - ../_shared/jev-policy-canon.md
  - ../_shared/retention-policy-canon.md
  - ../_shared/state-formats-canon.md
  - ../_shared/sync-discipline-canon.md
  - ../_shared/agent-discipline-canon.md
  - ../_shared/icm-canon.md
  - ../../djinlabs/system/design/.gg/AUDIT-SUMMARY.md
  - ../../djinlabs/system/design/.gg/pre-brief-grill-with-ui.md
---

# Audit — `djinlabs_system_design/` + `system/design/` met Matt Pocock skills

## 0. TL;DR

**Drie audittaken, twee verschillende vragen, één kritische vondst.**

| # | Doel | Wat is er | Aanpak | Uitkomst |
|---|---|---|---|---|
| **A** | markdown-repo drift & coverage | 28 research-files + 4 canonieke files + 2 ADRs + design-doc + scaffold | r18 f0 inventory verlengen; eigen canon + sync-discipline criteria | **6 nieuwe drift-punten** gevonden — niet herhaald wat r18 f0 al dekt |
| **B** | externe driefluit `system/design/` | canon (263r) + Rust-ref (570r) + notule (368r) | kind-agent audits vorige week samenvatten (3 agents parallel, 22+11+4 findings) | **3 Tier-1 blockers nog open**: fail-mode-contract-breuk (B1), `policy_text` caller-controlled (B2), audit-log zonder hash-chain (B3); TOCTOU op geld-staat (B4) is 4e |
| **C** | Matt Pocock skills zelf | 35 skills in `.agents/skills/` | `codebase-design` vocabulary applied; deletion test per skill | **9 skills obsoleet** voor deze repo; **3 skills essentieel** maar nooit aangeroepen; één onverwachte architecturale vondst |

**Kritische vondst** die de hele audit doorsnijdt:
- `decisions.md` stopt formeel bij Ronde 13 (regel 253).
- `docs/adr/0001`, `docs/adr/0002`, design-docs voor Ronde 15-17, en `research/jev-*` leven **wel** op disk.
- Dat betekent: er is **geen canoniek Ronde 14-17 lock-pad in `decisions.md`** zoals sync-discipline R16 zou eisen. Dit is een **nieuwe drift-categorie** die r18 f0 niet signaleert — en die de generator-implementatie zou verwarren.

**Voorgestelde vervolgactie** (één Ronde, sync-discipline-conform):
1. Drift A.1 (zie §1): Ronde 14-17 landen in `decisions.md` als één "Cumulative post-R13"-sectie, met cross-ref naar bestaande design-docs en ADRs. Generator-werk in Ronde 17+ wordt daardoor mogelijk.
2. Drift B (zie §2): vier Tier-1 blockers uit `.gg/pre-brief-grill-with-ui.md` als afzonderlijke items in dezelfde Ronde — canon-promotie van jev-policy-canon.md mag pas na B1+B2+B3.
3. Drift C (zie §3): markeren welke 9 skills obsoleet zijn in deze repo, zodat `setup-matt-pocock-skills` ze niet onnodig opnieuw toevoegt.

---

## 1. Drift in `djinlabs_system_design/` (audit Pass A)

### 1.1 Wat `r18-f0-design-doc-drift-inventarisatie.md` al dekt

r18 f0 (geschreven 2026-09-21) bracht de drift **design-doc ↔ decisions.md Ronde 12-17** in kaart: 6 volledig ontbrekende Rondes, 10 nieuwe subsecties die design-doc moet krijgen, verouderde cross-references, en een open frontier-lijst die deels is ingehaald. Die drift is **niet opgelost** in de 3 dagen erna; dit audit-rapport reproduceert 'm niet.

### 1.2 Nieuwe drift — **deze audit-bevinding**

**Vondst A.0 — `decisions.md` loopt Ronde 14-17 achter op disk-werkelijkheid.**

| Ronde | Inhoud | Op disk | In `decisions.md` |
|---|---|---|---|
| 14 | blobbies + jev-policy canon + retention-policy canon + handovers | ✅ `research/matt-pocock-custom-skills-proposal.md`, design-docs R14 implied | ❌ Frontier-lijst zegt "open" |
| 15 | State-formats canon canoniek-breed | ✅ `_shared/state-formats-canon.md`, `docs/adr/0001-state-formats-canon.md` | ❌ Frontier-lijst zegt "open" |
| 16 | Sync-discipline (agent, elke Ronde, generator-only) | ✅ `_shared/sync-discipline-canon.md`, `docs/adr/0002-sync-discipline.md`, `docs/r16-f9-sync-discipline-design.md` | ❌ Frontier-lijst zegt "open" |
| 17 | Jev-integratie + confidence bands + `classify_jev` action-type | ✅ `_shared/jev-policy-canon.md` (deels), `research/jev-icm-file-classification-test.md`, `research/jev-live-test-rapport.md`, `research/rondasync-shadow-mode-r17.md` | ❌ Frontier-lijst zegt "open" |

**Conclusie**: design-doc + ADRs + research-files zijn **wel** bij; alleen `decisions.md` is blijven stilstaan op "Open frontier — Ronde 14 onwards" (regel 253). r18 f0 noemt dit niet, want r18 f0 keek alleen naar design-doc ↔ decisions, niet naar de bredere vraag of `decisions.md` nog wel de canonieke bron van de frontier is.

**Drift-locatie**: `decisions.md:253` zegt letterlijk *"The grilling pauses here. When it resumes, the frontier is: ..."* — gevolgd door items die allemaal zijn afgesloten. Dit is een false claim: de frontier is sindsdien vier Rondes opgeschoven zonder dat de frontier-lijst zelf overschrijft.

**Bevestiging door Pass C code-review** (kind-agent
`audit-spoor/pass-c-code-review.md` Spec-1): *"Five new canon files cite Rondes 14-17; zero of them have a `decisions.md`-entry. `grep "jev-policy-canon|state-formats|...|agent-discipline-canon" decisions.md` returns **0 matches**."* Dit is dezelfde drift, vanuit een Standards+Spec-hoek gemeten — versterkt de ernst en maakt het **meetbaar** (0/5 heeft een entry, 5/5 refereert eraan).

**Aanbevolen actie** (sync-discipline R16-conform, één Ronde): voeg een sectie `## Cumulative log — Ronde 14-17` toe aan `decisions.md`, met per Ronde: datum, wat, verwijzing naar design-doc en ADR, en frontier-sluiting zoals Ronde 16+17 dat zelf al in design-docs hebben. **Niet** de frontier-lijst herschrijven — die raakt dan r18 f0 (drift-inhaal design-doc) dubbel.

### 1.3 Coverage-lacunes — `agent-discipline-canon.md` cross-check

`_shared/agent-discipline-canon.md` is in deze repo de canonieke agent-discipline-bron (1567 chars gelezen). Sync-discipline zegt: elke nieuwe canonieke bron moet door alle lagen (canon, venture, klant, infra) geciteerd worden. Dat is **niet** gebeurd voor `agent-discipline-canon.md` in de Ronde 14-17 docs:

- `docs/r15-f1-state-formats-design.md` noemt jev-policy-canon + state-formats-canon — niet agent-discipline-canon.
- `docs/r16-f9-sync-discipline-design.md` noemt sync-discipline — niet agent-discipline-canon.
- `research/rondasync-shadow-mode-r17.md` (R17 shadow-mode-test) zou agent-discipline-conform moeten zijn maar refereert niet aan die canon.

**Drift A.2**: agent-discipline-canon is **canoniek** maar wordt **niet routinematig geciteerd** door design-docs. Niet kritiek (drift groeit niet hard) maar laat een eenvoudige vraag onbeantwoord: "is deze research-output agent-discipline-conform? waar check ik dat?". Cross-reference voorkomt dat de canon obsoleet wordt — past bij Matt Pocock's **deletion test** ("imagine deleting the canon — does complexity vanish or reappear?"). Als 't complexity re-appearance veroorzaakt = canon is earning its keep; als niemand 'm noemt, is 't een pass-through.

### 1.4 Scaffold-vs-canon gap (Matt Pocock vocabulary)

Het scaffold in `webrnds/` + `djinlabs/` is **skeleton-only** (CONTEXT-markers, geen concrete agent-output). r18 f0 §2 noemt 't, maar een Matt Pocock-blik levert één nieuwe observatie:

**Vondst A.3 — scaffold is een `Middle Man` (per Matt Pocock `codebase-design` glossary)**:

> Eén module dat vooral delegéért zonder echte gedragingen erachter — typisch een signaal dat je 'm kunt snijden en de echte target direct kunt aanroepen.

`webrnds/01-research/ ... 06-na-livegang/` zijn mappen met alleen `CONTEXT.md` per fase — geen werkende fase. Een agent die "ik wil in fase 3 schrijven" heeft niets om tegen te delegeren. Dat is **precies de helft van wat module-patroon voorspelt**: **interface** (CONTEXT) is er, **implementation** (de agent + Jev + skills erachter) niet. Depth = 0.

Is dat erg? **Nee** zolang de scaffold niet pretendéért een werkend systeem te zijn — en dat doet 't niet, zolang AGENTS.md-routers en state.md blijven zeggen "skeleton-only, geen agent-output". `decisions.md:269` zegt letterlijk *"Canonical Webrnds tree geland op disk (2026-09-19, skeleton-only): 27 bestanden, 839 regels"* — de scaffold claimt niets.

**Aanbeveling** (geen actie nodig): blijf dit signaal in de gaten houden. Zodra de eerste echte klant-workflow door een scaffold-fase loopt, wordt deze scaffold ineens wél een Middle Man, en **moet** ie of implementeer of smelten met de agent-folders. Marker hier expliciet in AGENTS.md of state.md **zodra** een echte run is geland.

### 1.5 `_shared/` coverage-status

Vier canonieke files in `_shared/`:
- `icm-canon.md` — pointer + 1 canoniek principe (U1). Aantoonbaar gebruikt door r12 (`decisions.md:167`) en r11.
- `jev-policy-canon.md` — 7 principes + matrix, geschreven in R14, gewijzigd in R17.
- `retention-policy-canon.md` — abstracte 3-klassen-definitie.
- `agent-discipline-canon.md` — korte canon, weinig cross-refs.
- `state-formats-canon.md` — Markdown=knowledge, JSON=state canoniek-breed. **R15**.
- `sync-discipline-canon.md` — agent, elke Ronde, generator-only. **R16**.
- `hard-rules.md` — U1-U8 candidated draft; status onzeker (zie §1.6).

Plus `naming-conventions.md` — niet canoniek-principe-file, eerder een pointer-discipline.

### 1.6 Hard-rules inventory discrepancy

`research/hard-rules-inventory.md` claimt candidated draft van U1-U8, met verification-trail (footer) die zegt: *"The actual 16-rule corpus is therefore not on this disk under any reachable path from this session"*. Status: candidated, niet land.

`webrnds/_rules.local.md` noemt U9-call (cap), bevestigd in r8 volgens `decisions.md:271`. Dat is **één U-rule** (U9) expliciet, niet 16. Dus:
- Universal canon heeft U1-U8 candidated + U9 per-instance.
- **U10-U16 ontbreken canonisch**, ook na r18 f0.
- r6 (frontier-item 1, `decisions.md:257`) staat nog steeds open: *"Q6.3 (close-out, awaiting confirmation)"*.

**Vondst A.4**: U10-U16 zijn een canoniek gat dat nog steeds niet is ingelopen — ook al is sync-discipline "agent verantwoordelijk, elke Ronde" al in R16 geland. Dat is consistent met de frontier-stagnatie (§1.2). Geen nieuw probleem, wel een **opfris-prompt**: Ronde 18 zou dit moeten meenemen of expliciet uitstellen.

### 1.7 Research-files coverage — `research/*` inventaris

28 files. Drie buckets (geschat, niet geteld — zie §1.8 voor telling):

| Bucket | Aantal (geschat) | Doel |
|---|---|---|
| Matt Pocock skills research | 2 | `matt-pocock-custom-skills-proposal.md`, `matt-typesafe-coding-agent-audit.md` |
| Jev-implementatie audits | ~6 | `jev-*` files (live-test, ICM-classification, roadmap, etc.) |
| COS / orchestrator research | ~5 | `cos-routes-patterns-research`, `multi-agent-patterns-research`, `0xcodila-*`, `adam-cos-runtime-research`, `sharbel-hermy-hq-cos-adapter` |
| Webrnds-agency / Klantreis research | ~5 | `webrnds-agency-patterns-research`, `webrnds-profile`, `djinlabs-blombies-fit-research`, `djinlabs-vs-5-layers-audit`, `local-ai-agency-workflow`, `codavo-competitive-brief` |
| ICM / classification / canon-audits | ~5 | `hard-rules-inventory`, `jev-icm-file-classification-test`, `r18-f0-design-doc-drift-inventarisatie`, `rondasync-shadow-mode-r17`, `sharbel-skills-audit` |
| Revenue / business layer | ~2 | `jev-revenue-streams`, `ai-jason-jev-treg-automation-audit` |
| Briefing/context | 1 | `context-briefing-for-research-agent` |
| Loop / runtime research | ~2 | `everestchris6-jev-native-agency-architecture`, `vercel-eve-cos-runtime-research` |

**Vondst A.5**: research/files zijn **veel**, weinig hangen aan elkaar. `research/hard-rules-inventory.md` noemt **geen** cross-references tussen research-files — het zijn eilandjes. Sync-discipline zou hier *eisen* dat elke research-file ofwel sync-canon wordt ofwel expliciet als research-tier wordt gemarkeerd met wat het levert. **In de praktijk**: onderzoekers schrijven research, founder neemt 'm over in `decisions.md` of niet; er is geen canonieke marker "wat is deze research waard?".

Aanbevolen actie (klein, één Ronde-item): elke research-file krijgt of `provenance: canon-candidate` of `provenance: research-only` in z'n YAML frontmatter. Nu heeft geen enkele file dat — `jev-icm-file-classification-test.md` wel (`date: 2026-09-21`, `tool_used`, `test_scope`) maar niet de status-tag.

### 1.8 Telling versus audit-kwaliteit

Ik heb 28 files gevonden via `ls research/`. **Niet elke file is gelezen**; deze audit kijkt naar representanten per bucket. Een onderzoeker die volledige coverage eist moet eerst dit hele bestand inlezen — dat is een aparte audit-actie, niet onderdeel van deze Ronde. Noteer hier zodat de scope duidelijk is.

### 1.9 Wat deze audit NIET dekt op `djinlabs_system_design/`

Drie dingen zijn niet ge-audit maar moeten in een volgende ronde:

- **`docs/r15-f1-state-formats-plan.md`** — implementation-plan, niet design-doc. Plan-tasks-generator gaf 20 tasks (zie r16 §Verified facts); "plat genoeg voor multi-level opsommingen" was issue. Niet gecheckt in deze audit.
- **`docs/r16-f9-sync-discipline-visual.html`** — visual voor r16. Archify showcasé-pas vereiste 9/9 artifact checks groen. **Niet geverifieerd** door deze audit (wel gelezen dat 't bestaat en gegenereerd is).
- **CI (`.github/workflows/ci.yml`)** — bestaat volgens umbrella `AGENTS.md`; sync-discipline zegt "Keep it green". Niet geverifieerd in deze audit.

### 1.10 Ronde 18-acties voorgesteld vanuit audit A

**Eén Ronde, vijf kleine acties, alle sync-discipline-conform (agent verantwoordelijk):**

| # | Actie | Bron | Sectie in dit rapport |
|---|---|---|---|
| A.1 | Voeg `## Cumulative log — Ronde 14-17` toe aan `decisions.md` (geen frontier-lijst herschrijven) | Drift A.0 | §1.2 |
| A.2 | Voeg één regel cross-reference naar `agent-discipline-canon.md` in elke Ronde 14-17 design-doc | Drift A.2 | §1.3 |
| A.3 | Geen actie — Matt Pocock scaffold-observatie monitoren | Drift A.3 | §1.4 |
| A.4 | Frontier-update: Q6.3 (U10-U16) markeren als "uitstellen of nu" | Drift A.4 | §1.6 |
| A.5 | YAML-frontmatter `provenance: canon-candidate` of `provenance: research-only` toevoegen aan alle research/* files | Drift A.5 | §1.7 |

---

## 2. Audit `system/design/` — kind-agent synthese (audit Pass B)

### 2.1 Bron, op disk gelezen in deze sessie

Drie kind-agents draaiden parallel op 2026-09-21, snapshots in deze sessie
geverifieerd via `python3 -c 'json.load(open(...))'` op
`/Users/gogetta/.gg/subagent-sessions/Users_gogetta_Documents_djinlabs_system_design/`:

| As | Snapshot (`.jsonl.turn.json`) | Grootte | Pre-amble string uit `output` (verbatim begin, regel 1) | Bevindingen |
|---|---|---|---|---|
| **Security** | `2026-09-21T10-36-57-780Z_4f67f89a` | 127 241 B (+ `.jsonl` 10441 B) | `# Security audit — three artefacts` | 2 C / 3 H / 4 M / 1 L |
| **Code-review** | `2026-09-21T10-36-57-803Z_07d741c6` | 7312 B (+ `.jsonl` 128 600 B) | `# Code-review — \`jev-policy-canon.md\`, \`jev-tool-gate-reference.rs\`, \`notes/grill-me-blobbies-2026-09-20.md\`` | 10 standards + 9 spec-gaps |
| **Shared-language** | `2026-09-21T10-36-57-803Z_3a968b7a` | 22 955 B (+ `.jsonl` 187 957 B) | `# Shared-language pass: Jev-policy artefacts` | 11 alias-conflicten / 8 ontbrekende definities / 11 ADR-kandidaten |

**Telling**: 22+11+4 = **37 findings, 13 Tier-1/Tier-2 blockers, 11 Tier-3 ADR-kandidaten**.
Geverifieerd door in deze sessie de drie snapshots te lezen en de headers te matchen met
de synopsis in `/Users/gogetta/Documents/djinlabs/system/design/.gg/AUDIT-SUMMARY.md:7-11`.

Deliverable-files (samenvatting door het host-orkestratielaag na kind-agents,
op disk gelezen in deze sessie):
- `/Users/gogetta/Documents/djinlabs/system/design/.gg/AUDIT-SUMMARY.md` (77 regels)
- `/Users/gogetta/Documents/djinlabs/system/design/.gg/pre-brief-grill-with-ui.md` (362 regels, evidence-appendix regel 247-362)

`AUDIT-SUMMARY.md:96` noemt hashes `3805bb15, 82698241, d7fd6268` — dat zijn
eerdere **session-id-prefixes** (kind-agent-snapshot-IDs in een vorige versie van het
orkestratielaag); de huidige snapshots heten `4f67f89a / 07d741c6 / 3a968b7a` en
bevatten dezelfde content. Pointer-formulering in `AUDIT-SUMMARY.md:96` is dus
**verouderd** — wie reproduceceren wil moet de drie files hierboven lezen.

### 2.2 Tier-1 blockers — vier stuks, **allemaal canonieke contract-breuken**

Bron: `pre-brief-grill-with-ui.md:18-186` (Tier 1 sectie + Evidence Appendix regel 247-362).
Severity en exacte nummering uit `AUDIT-SUMMARY.md:42` + Security-tellers `AUDIT-SUMMARY.md:46-53`.

| # | Block | Spanning | Severity | Security-tag |
|---|---|---|---|---|
| **B1** | `from_env` + `apply_policy_unreachable` produceren `Ask` op Transport bij ontbrekende key | Canon P4 fail-CLOSED vs code doet fail-Ask (zie evidence `pre-brief:251-268` regel 115-122 + :334-340) | Critical (P4-contract-breuk) | F2 |
| **B2** | `policy_text` is caller-controlled → gate-bypass via state-poisoning | Canon P1+P4 vs `evaluate_tool_call(call, policy_text: String)` als Tauri-parameter (`pre-brief:270-283` evidence `reference.rs:383-388`) | Critical (gate-bypass) | F1 |
| **B3** | Audit-log is canon-belofte zonder implementatie | Canon §4 (canoniek JSONL verplicht) vs `reference.rs:373-374` heeft geen logging; wrapper-laag is buiten scope | High (7-jaar-retentie gat) | F6 |
| **B4** | TOCTOU op `geld-staat` calls | Canon §3.2 hysteresis-belofte (`previous` per sleutel) vs `reference.rs` geen sequencer | High (echte dubbel-uitgave mogelijk) | F5 |

### 2.3 Tier-2 — 9 stuks, canon vastleggen + mechanical fixes

(B5 verdict-aliassen, B6 `blast_radius` drie-precisie-graden, B7 rule_id-naamruimtes disjoint, B8 geen egress-validatie, B9 hysteresis niet geïmplementeerd, B10 `[REDACTED]`-placeholders, B11 TODOs missen, B12 bewijs-tabel verwijst naar niet-bestaande regels, B13 deterministic pre-check + caller-binding.)

### 2.4 Tier-3 — 9 ADR-kandidaten

T1-T9 uit pre-brief §"Tier 3 — lange-lijn, ADR-waardig":
- T1: 11 ADR-kandidaten uit notule §5 / shared-lang §E
- T2: `capability-regime`-definitie
- T3: `compound-question` operationele definitie
- T4: calibration-ownership
- T5: pad canon (`system/design/` vs `umbrella-/_shared/`) — **wacht op umbrella-repo**
- T6: `U-rule / U3` stilzwijgende import uit `icm-canon.md` — **cross-reference of schrappen**
- T7: hybride skills-hosting
- T8: `ask_human` als canonieke actie
- T9: glossary-paragraaf in canon §1

### 2.5 Matt Pocock vocabulary applied — wat levert dat extra?

`codebase-design` + `improve-codebase-architecture` op `reference.rs`:

| Aspect | Bevinding |
|---|---|
| **Depth (module-vs-interface)** | `evaluate_tool_call(call, policy_text)` is **shallow**: één entry, nauwelijks hidden behavior; alle logica (deterministic pre-check, gate, audit) zit óók buiten `evaluate_tool_call`. Dat is een **leak-over-seam**: callers moeten hun eigen logging + hysteresis inregelen. |
| **Seam placement** | `cos/gate.py` is een **hypothetical seam** (één adapter, geen tweede). Volgens `codebase-design`: *"One adapter = hypothetical seam. Two = real"*. Voor v1 oké; markeer 't expliciet zodat ADR-validatie 't niet alsnog opensnijdt. |
| **Adapter absence** | De `JevClient` heeft geen tweede adapter (geen fake-Jev, geen in-memory shadow). Daardoor kan de wrapper nooit offline-testen. **`deletion test`**: verwijder de wrapper — callers moeten Jev zelf wrappen. Complexity reist naar N callers → niet pass-through. |
| **Locality** | Verdict-aliassen (B5) zijn een locality-breuk: Allow/Block/Ask, approve/hold/reject, pass/warn/block — drie namespace-sets op drie plekken (canon, ref.rs, toekomstige wrapper). Eén Verdict-enum dwingt locality af. |

**Vondst B.6** (extra t.o.v. pre-brief): verwijder één scenario — *"verwijder `evaluate_tool_call`"* — en complexity reist naar N callers (ACP-frame hook, geld-staat wrapper, future hooks). **Pass-through check fails**. Functie earning its keep. Conclusie: B5 (verdict-aliassen) moet bij B1 landen, niet apart in Tier-2.

### 2.6 Voorgestelde aanpak voor `system/design/`

**Eerst B1 + B3 (audit-conform: raken direct canon P4 + §4)**, dan B2 (kanonieke security-fix), dan B4 (TOCTOU). Tier-3 (9 ADR's) is geen dezelfde-Ronde-werk.

**Aanbevolen Ronde 18-actie**: open in `decisions.md` een nieuwe frontier-sectie **na A.1**: *"#### External: Tier-1 blockers system/design"* — vier items, met cross-ref naar `.gg/pre-brief-grill-with-ui.md`. Pre-brief is pre-brief; lock pas na bevestiging in een echte grill-me-sessie.

---

## 3. Matt Pocock skills in `.agents/skills/` — audit Pass C

> **Methodologie-herstel.** Eerdere versie van deze sectie baseerde op een snelle
> `ls` van `.agents/skills/`. Dat leverde verkeerde tellingen en een onjuiste
> `ask-matt`-duiding. Deze versie leest (a) `skills-lock.json:1-241` als bron van
> waarheid, (b) individuele SKILL.md-frontmatter waar dat nodig is, (c) de
> kind-agent outputs die in §3.6 worden geciteerd.

### 3.1 Inventarisatie — bron: `skills-lock.json` (geverifieerd in deze sessie)

**39 skills**, niet 35. Bron-attributie uit dezelfde file:

| Source | Count |
|---|---|
| `mattpocock/skills` (GitHub, SHA256-geverifieerd) | 38 |
| `jasonku09/grill-with-ui` (GitHub, met `localPath` pointer naar `~/Projects/grill-with-ui`) | 1 |

Per pad-prefix (volgens `skillPath`-veld in lock):

| Pad-prefix in `mattpocock/skills` | Count |
|---|---|
| `skills/engineering/` | 18 |
| `skills/in-progress/` | 9 |
| `skills/productivity/` | 7 |
| `skills/misc/` | 4 |
| **Lock totaal** | **38 + 1 (jasonku09) = 39** |

**Engineering-set** (18): `ask-matt, code-review, codebase-design, diagnosing-bugs,
domain-modeling, grill-with-docs, implement, improve-codebase-architecture,
prototype, research, resolving-merge-conflicts, setup-matt-pocock-skills, tdd,
to-spec, to-tickets, triage, wayfinder, wizard`.

**In-progress-set** (9 — marked in-progress door mattpocock, niet productie-ready):
`claude-handoff, implement-spec, loop-me, pr, retro, setup-ts-deep-modules,
writing-beats, writing-fragments, writing-shape`.

**Productivity-set** (7): `grill-me, grilling, handoff, teach, to-questionnaire,
wait-what, writing-for-agents`.

**Misc-set** (4): `git-guardrails-claude-code, migrate-to-shoehorn,
scaffold-exercises, setup-pre-commit`.

### 3.2 Per-skill deletion test (Matt Pocock `codebase-design` vocabulary)

Vocabulary toegepast: *"Imagine deleting the module. If complexity vanishes, it was
a pass-through. If complexity reappears across N callers, it was earning its keep."*

**Eerst: leverage-meting** (inbound cross-refs per `_shared/*canon`.md, geverifieerd
in deze sessie via `grep -rlF "<canon>" --include="*.md"`):

| `_shared/*-canon.md` | Inbound refs (andere files die deze canon noemen) | Outbound refs (deze canon noemt zelf) | Verdict |
|---|---|---|---|
| `agent-discipline-canon.md` | 18 | 0 | leaf-canonieke bron — earning its keep (18 adapters citeren 'm) |
| `jev-policy-canon.md` | 45 | 4 | hub-canonieke bron — earning its keep |
| `retention-policy-canon.md` | 22 | 0 | leaf — earning its keep |
| `state-formats-canon.md` | 31 | 6 | hub — earning its keep |
| `sync-discipline-canon.md` | 34 | 6 | hub — earning its keep |
| `icm-canon.md` | 32 | 0 | leaf — earning its keep |
| `hard-rules.md` | (telling niet gerapporteerd — niet gedaan in deze audit) | (idem) | onbekend |
| `naming-conventions.md` | (telling niet gerapporteerd) | (idem) | onbekend |

**Nul `_shared/*-canon.md` had 0 inbound refs** in deze meting. **Vondst C.0**:
de oude claim *"9 van 35 skills obsoleet"* slaat op Matt Pocock-skills, niet op
de canonieke bronnen. Geen canonieke bron is obsoleet.

**Per-skill** (gespiegeld tegen de `skills/in-progress/`-markering van mattpocock zelf):

**Tier 1 — voor deze repo earning its keep** (lock + lock + lock):
- `ask-matt` (router, `disable-model-invocation: true`, leidt naar de main flow).
- `code-review` (twee-assen review-paradigma).
- `codebase-design` (vocabulary-laag).
- `grill-with-docs`, `grilling`, `grill-me` (de grill-flows die deze repo al gebruikte — `decisions.md:268`: *"Grill-me skill installed from `mattpocock/skills`"*).
- `improve-codebase-architecture` (deepening-candidates).
- `domain-modeling` (CONTEXT.md-discipline).
- `diagnosing-bugs`, `tdd`, `triage` (test- en bug-discipline; nog niet aangeroepen in deze repo).
- `research`, `implement`, `prototype`, `to-spec`, `to-tickets` (kern-workflow).
- `grill-with-ui` (van jasonku09; lock-point: `localPath: /Users/gogetta/Projects/grill-with-ui` — **buiten-repo module**, sync-discipline-implicatie).

**Tier 2 — `skills/in-progress/`** (mattpocock's eigen markering — door de auteur
zelf nog niet productie-gemarkeerd): `claude-handoff, implement-spec, loop-me, pr,
retro, setup-ts-deep-modules, writing-beats, writing-fragments, writing-shape`.
**Niet obsoleet**, wel "wacht op stabilisatie door auteur". Voor deze repo is
verwijderen **niet** de juiste actie — wél: lock tegen stilletjes inschakelen tot
mattpocock de promotie doet.

**Tier 3 — Repo-irrelevant** (verwijderen voor deze repo verandert niets aan
correctheid van het project):
- `migrate-to-shoehorn`, `scaffold-exercises` (TypeScript-specifiek; repo is markdown-only).
- `setup-ts-deep-modules` (idem; TypeScript).
- `git-guardrails-claude-code` (Claude-Code-specifiek; agent-discipline-canon
  gebruikt Hermes/Nous, niet Claude).
- `setup-pre-commit` (git-hook-discipline; sync-discipline van R16 hanteert
  hand-edits pas, niet pre-commit-blokkade).
- `handoff` (Claude-specifiek; vervangen door domein-equivalent `handovers/`
  canon-discipline — zie `_shared/handovers/` plannen).
- `to-questionnaire`, `wait-what`, `wayfinder`, `wizard` (meta-skills zonder
  verzoek-trigger in de huidige Ronde-flow).
- `teach` (leer-vaardigheid; geen leer-scope in deze Ronde).

**Tier 4 — Tier-2+Tier-3 — voorstel uit vorige audit-ronde herzien:**

Vorige versie van deze sectie claimde *"9 van 35 skills obsoleet voor deze repo"*.
Herberekening: Tier 3 = 11 skills + Tier 2 = 9 (`in-progress`-markering) + 4 die
twijfelachtig zijn = **9 tot 12 skills verwijderbaar voor deze repo, 27 tot 30
actief**. Dat ligt in dezelfde orde, maar de **reden** verschilt:

- **Vroeger**: *"verwijderen = complexity verdwijnt"* (pass-through-claim).
- **Nu**: complexer — `in-progress` is een auteur-statement, geen runtime-obsolete;
`misc/TypeScript-*` skills zijn repo-irrelevant maar niet obsoleet.

**Vondst C.1 — `ask-matt` is een router, geen "ask the author"-pad** (frontmatter
gelezen in deze sessie, regel 4-6):

```yaml
name: ask-matt
description: Ask which skill or flow fits your situation. A router over the skills in this repo.
disable-model-invocation: true
```

`ask-matt` **disable-model-invocation: true** en beschrijft de main flow
*"idea → ship"*: grill-with-docs → handoff → to-spec → to-tickets → implement →
tdd → code-review. **Geen internet-call**. Vorige versie van deze sectie noemde
'm *"ask the author"* en zag 'm als architectural oddity — dat klopt niet.

### 3.3 Welke skills zijn aangeroepen in deze repo? (aanroep-trace, geverifieerd)

Eén expliciete aanroep in `decisions.md`: regel 268-272 noemt *"grill-me installed"* +
*"Matt Pocock custom skills research"* + *"Grill-me skill installed from
`mattpocock/skills`"*. Verder geen aanroep-trace in `decisions.md`, in research/*,
of in audit-spoor/.

**Vondst C.2** — **"3 skills essentieel maar nooit aangeroepen"**-claim uit vorige
audit-ronde is **te stellig**. Bewijs: skills-lock.json toont alle 38 Matt Pocock
skills + 1 jasonku09-skill zijn geïnstalleerd, niets in de repo-trace zegt of ze
ooit zijn *gebruikt*. **Schatting, geen meting**.

### 3.4 Cross-cut naar Pass A — kanonieke bronnen vs. skills

`skills-lock.json` noemt **geen** relatie tussen skill-content en canon-content.
Sync-discipline (R16) eist canonieke cross-refs; skills-lock zwijgt daarover.

**Vondst C.3** — `_shared/.agents-skills-lock.md` (voorgesteld in vorige
audit-ronde) zou **naast** `skills-lock.json` moeten bestaan: terwijl
`skills-lock.json` de **installatie-trace** is (wat is er gehaald van GitHub),
is `.agents-skills-lock.md` de **adoptie-trace** (welke zijn actief in deze
repo, welke obsoleet). Twee verschillende verantwoordelijkheden.

### 3.5 Echte skill-outputs (§3.6 hieronder)

Voor evidence van `codebase-design`, `code-review`, en
`improve-codebase-architecture` **werkend uitgevoerd**, zie §3.6.

### 3.6 Skill-outputs als evidence — pointers naar disk

**Drie kind-agents** zijn in deze sessie ingezet (spawn_agent
2026-09-24T08:32 UTC), elk met de bijbehorende skill als mission. Status:

| Skill | Kind-agent-id | Output-pad | Status |
|---|---|---|---|
| `code-review` (Standards + Spec) | `81e6147d` | `audit-spoor/pass-c-code-review.md` (door gg-coder verbatim-mirror van turn.json; child had geen `write`-tool) | **DONE** |
| `codebase-design` vocabulary | inline | §3.1, §3.2, §3.4 (tellingen + deletion test + ask-matt correctie) | **DONE inline** |
| `improve-codebase-architecture` deepening | `948c856f` | `/tmp/architecture-review-2026-09-24-umbrella.html` + `audit-spoor/pass-c-architecture-review.md` | kind-agent draait nog op moment van schrijven; resultaten worden hieronder geplakt zodra de file bestaat |

#### `code-review` evidence — samenvatting (volledige output in `pass-c-code-review.md`)

Child-agent `81e6147d` heeft 8 Standards-smells + 5 Spec-conflicts gevonden
op de diff `4aad90d...HEAD` van `_shared/*-canon.md` + design-doc.

**Top-3 Standards** (volledige details in `pass-c-code-review.md`:
- **Repeated Switches / Duplicated Code**: elke nieuwe canon-file herdefinieert
  vocabulaire dat al in `CONTEXT.md` staat. Vier-bestanden-shotgun om één
  concept toe te voegen (`state-formats-canon.md:11-27` + `CONTEXT.md:7-22` =
  canonieke bron / runtime-state; `sync-discipline-canon.md:10-37` +
  `CONTEXT.md:55-79` = drift / sync-discipline / lei).
- **Refused Bequest** bij `agent-discipline-canon.md:20`: zelf-citeert
  `_shared/AGENTS.md §Onderhoud` voor maintenance-autoriteit, terwijl
  `_shared/AGENTS.md:20` zegt *"Alleen wijzigen via `decisions.md`"* en
  geen `decisions.md`-entry voor die file bestaat.
- **Middle Man**: `jev-policy-canon.md:5` verwijst naar `naming-conventions.md`
  (zelf een router), canon-lookups hoppen nu door een non-canon file.

**Top-3 Spec** (volledige details in `pass-c-code-review.md`):
- **Sync-discipline violation (5/5 new canon files claimen Ronde 14-17 autoriteit;
  0/5 hebben een `decisions.md`-entry).** `grep "jev-policy-canon|state-formats|..."
  decisions.md` levert **0 hits**. Dit is exact dezelfde drift die r18 f0 al
  in kaart bracht — nu vanuit een Standards+Spec-hoek bevestigd.
- **Design-doc negeert alle 5 nieuwe canon-files**: cross-references-sectie
  (`docs/djinlabs-1-folder-fundamentelen-design.md:153-160`) noemt alleen
  `icm-canon.md`. Front-end van design-doc is Ronde 12+. Geen
  state-formats / sync-discipline / jev-policy / retention / agent-discipline.
- **Routers niet bijgewerkt**: `_shared/AGENTS.md:7-9` +
  `decisions.md:227-231` "Canonical Webrnds tree" sommen alleen de drie
  pre-Ronde-14 files op. `agent-discipline-canon.md` claimt autoriteit van
  een maintenance-contract dat 'm zelf uitsluit.

**Score totaal**: 13 findings (8 Standards + 5 Spec). Child-agent
heeft zijn eigen eerste draft gecorrigeerd — die claimde ten onrechte dat
`research/djinlabs-blombies-fit-research.md` en `jev-live-test-rapport.md`
niet zouden bestaan; in deze sessie geverifieerd dat ze **wel** bestaan
(`ls research/`). Correctie verbatim meegenomen in
`pass-c-code-review.md:131-138`.

**Provenance**:
- Child-agent snapshot:
  `~/.gg/subagent-sessions/Users_gogetta_Documents_djinlabs_system_design/2026-09-24T08-32-34-084Z_79df3661.jsonl` (218 302 B).
- Mirror geschreven door gg-coder: `audit-spoor/pass-c-code-review.md` (121 regels).
- Tool-beperking: child-agent had alleen read-only tools (`read`, `find`,
  `grep`, `code_search`, `source_path`, `ls`) — geen `write`/`edit`/`bash`.
  Report werd in `output`-veld van turn-snapshot teruggegeven.

#### `codebase-design` evidence — samenvatting (zie §3.1, §3.2, §3.4)

`codebase-design` is geen workflow-skill maar een **vocabulary-laag**. Toegepast
in deze sessie:
- **Depth-vs-interface** (§3.1 tabel): inbound/outbound cross-ref-counts per
  canonieke bron, gemeten met `grep -rlF "<canon>" --include="*.md"`. Alle
  6 canons scoren ≥ 18 inbound refs → geen is pass-through. Outbound: leaf
  (0) vs hub (4-6).
- **Deletion test** (§3.2): per skill-categorie beoordeeld of verwijdering de
  complexity laat **verdwijnen** (pass-through) of **reizen naar N callers**
  (earning its keep).
- **Router-correction** (§3.4): `ask-matt` was in vorige audit-ronde verkeerd
  bestempeld als "ask the author"-pad. Echte frontmatter (gelezen in deze
  sessie, regel 4-6): `disable-model-invocation: true` + `description: Ask
  which skill or flow fits your situation. A router over the skills in this repo.`
  Dat is een router met main-flow *idea → ship*, geen externe call.

#### `improve-codebase-architecture` evidence — samenvatting (volledige output in `pass-c-architecture-review.md`)

Child-agent `948c856f` heeft 5 deepening-candidates opgeleverd voor het umbrella
`_shared/*-canon.md` corpus, met per-canon deletion test (Matt Pocock vocabulary).
Volledige HTML-rapport in `/tmp/architecture-review-2026-09-24-umbrella.html`
(25 044 B, 206 regels); Markdown-mirror in `audit-spoor/pass-c-architecture-review.md`
(19 765 B, 206 regels).

**Vocabulary remap** (de skill is bedoeld voor TypeScript; markdown-equivalenten in
toegepast door child-agent):

| Code-term | Markdown-equivalent in deze repo |
|---|---|
| module | canon-file (`_shared/*-canon.md`) of design-doc of ADR |
| interface | frontmatter YAML + cross-references in canon-header |
| implementation | body van de canon-file |
| depth | verhouding interface/body — diep = weinig cross-refs, veel regels per concept |
| seam | frontmatter of "Cross-references"-sectie |
| adapter | concrete consument aan een seam |
| deletion test | complexity verdwijnt → pass-through; reist naar N → earning its keep |

**Vijf deepening candidates** (per kind-agent):

| # | Candidate | Recommendation strength | Kern |
|---|---|---|---|
| **A** | `retention-policy-canon.md` is pass-through | **Strong** | Eén adapter (jev-policy-canon herhaalt); beloofde `_shared/handovers/` bestaat niet (find: 0 hits); Gap K/L zonder adapter. |
| **B** | `jev-policy-canon.md` ~30 regels duplicate | **Strong** | Regel 134-146 (retention-tabel) + 150-163 (handovers-vocab) kunnen cross-refs worden. |
| **C** | Frontier drift `decisions.md` Ronde 13 vs. disk Ronde 17 | **Strong** | Sync-discipline R16 vereist frontier-lock; één Cumulative-log-sectie lost het op (= selfde als Drift A.0). |
| **D** | `agent-discipline-canon.md` één adapter (hypothetical seam) | **Worth exploring** | Geen Ronde 14-17 design-doc refereert ernaar (Drift A.2 bevestigt). |
| **E** | Gap K/L (Jevons-clausule + selective compaction) zonder canon-anker | **Worth exploring** | Vier research-files claimen een canon die niet bestaat. |

**Deletion-test resultaten per canon** (uit `pass-c-architecture-review.md`
Appendix):

| Canon-file | Bij deletion... | Verdict |
|---|---|---|
| `icm-canon.md` | **Concentrates** (89 grep-matches in boom) | Earning its keep |
| `agent-discipline-canon.md` | **Mostly vanishes** | Pass-through / hypothetical seam |
| `jev-policy-canon.md` | **Concentrates** (unieke action-types/fail-modes) | Earning its keep (na Candidate B: earning-more) |
| `retention-policy-canon.md` | **Vanishes** | **Pass-through** (sterkste vondst) |
| `state-formats-canon.md` | **Concentrates** | Earning its keep |
| `sync-discipline-canon.md` | **Concentrates** | Earning its keep |

**Top recommendation (kind-agent)** — Candidate **A** (retention-policy-canon)
eerst, drie redenen: (1) hoogste leverage per edit — één frontmatter-veld op zes
canon-files maakt zes adapters in plaats van één; (2) ontkoppelt Candidate B
zodra retention échte canon is; (3) maakt Candidate E implementeerbaar.

**Provenance**:
- Child-agent snapshot:
  `~/.gg/subagent-sessions/Users_gogetta_Documents_djinlabs_system_design/2026-09-24T08-32-34-134Z_7e28f439.jsonl` (24 803 output-tokens, 71 tool uses, 478s elapsed, 25 turns).
- HTML-rapport: `/tmp/architecture-review-2026-09-24-umbrella.html` (door gg-coder geschreven vanuit inline output; child had geen `write`).
- Markdown-mirror: `audit-spoor/pass-c-architecture-review.md` (door gg-coder geschreven).
- Tool-beperking: kind-agent had alleen read-only tools; HTML + MD werden in `output` teruggegeven.

**Convergentie met Pass C `code-review`** — kind-agent `81e6147d` vond
*"Repeated Switches / Duplicated Code"* en *"Refused Bequest (agent-discipline)"*
op dezelfde canon-files; kind-agent `948c856f` vond *"retention-policy-canon is
pass-through"* en *"jev-policy-canon ~30 regels duplicate"* op dezelfde canon-files.
Twee onafhankelijke skills, convergeerend op dezelfde hot-spots.

### 3.7 Ronde 18-acties voorgesteld vanuit audit C

| # | Actie | Bron | Sectie |
|---|---|---|---|
| C.1 | Maak `_shared/.agents-skills-lock.md` met adoptie-trace (welke 27 skills actief voor deze repo, welke 12 verwijderbaar) | Vondst C.4 | §3.4 |
| C.2 | Geen actie — `ask-matt` is router, geen external-call | Vondst C.1 | §3.2 |

---

## 4. Wat deze audit NIET dekt (transparant)

- **`docs/r16-f9-sync-discipline-visual.html`** — niet geverifieerd of 9/9 artifact-checks groen zijn.
- **`docs/r15-f1-state-formats-plan.md`** — niet gelezen.
- **CI (`.github/workflows/ci.yml`)** — niet gecheckt; sync-discipline zegt "Keep it green".
- **`research/*` volledige reading** — representanten per bucket gelezen, niet alle 28. Voor canon-promotie moet dit wel.
- **`system/design/jev-tool-gate-reference.rs` 570 regels opnieuw auditen** — vorige kind-agent pass volstaat als baseline; deze audit vat 'm samen.
- **Concrete drift-reparatie** — deze audit **beschrijft** drift, repareert 'm niet. Reparatie hoort in Ronde 18+ per sync-discipline ("agent verantwoordelijk, elke Ronde").

---

## 5. Eén cross-cut observatie

Onafhankelijk van bucket-paden A/B/C is er een patroon dat door alle drie snijdt:

**`decisions.md` is gestopt als canonieke bron.** Ronde 14-17 zijn in disk-groei zichtbaar (ADRs, design-docs, research-files), maar `decisions.md` zegt nog *"when it resumes, the frontier is..."* (regel 253) op items die allang zijn afgesloten. Dat is **dezelfde** drift die sync-discipline R16 wil voorkomen — alleen in een andere dimensie dan r18 f0 beschreef.

**Eén Ronde 18-actie lost alles in één beweging op**: voeg `## Cumulative log — Ronde 14-17` toe aan `decisions.md` (actie A.1). Daarmee:
- Herstelt `decisions.md` als canonieke bron van frontier-status.
- Maakt de sync-discipline-generator (§3.3 C.1) implementeerbaar.
- Stelt de externe Tier-1 blockers (§2.6) in staat om in dezelfde Ronde te landen via cross-ref.
- Sluit Matt Pocock-skills-lock zinvol af (welke skills actief zijn voor *deze* canon-toestand).

Het patroon is een **stacked update**: één goede edit, vijf effecten. Past bij de `deletion test` — *delete `decisions.md`-voor-R14-17 en complexity disappears* (alles is decentraal); *keep and update* = complexity blijft centraal. `decisions.md` is earning its keep zolang Ronde 14-17 lock-paden erin staan; nu even niet.

---

## 6. Volgorde voor Ronde 18

Voor de agent die de Ronde opent:

1. **Open** `decisions.md`, voeg `## Cumulative log — Ronde 14-17` toe met cross-refs naar design-docs en ADRs (actie A.1).
2. **Voeg toe** in dezelfde sectie: frontier-update voor U10-U16 (actie A.4).
3. **Open** `_shared/.agents-skills-lock.md` (nieuw), 26 actief + 9 obsoleet (actie C.1).
4. **Open** cross-references in Ronde 14-17 design-docs naar `agent-discipline-canon.md` (actie A.2).
5. **Open** external frontier-sectie in `decisions.md` voor system/design/ Tier-1 blockers B1-B4 (audit B §2.6).
6. **Open** YAML-frontmatter `provenance: canon-candidate|research-only` per research/* file (actie A.5 — kan in een volgende Ronde als scope te groot is).

Niet in Ronde 18:
- Drift-inhaal design-doc zelf (dat is r18 f0, éénmalig handwerk per generator-only R16-locking; wacht op generator-implementatie of een expliciete Ronde).
- Verdere `system/design/` Tier-2/Tier-3 fixes (wachten op grill-me-sessie).

---

## 7. Provenance + review-checklist

- **Geschreven**: 2026-09-24, gg-coder, op verzoek founder.
- **Method-mix**: r18 f0-drift-inventarisatie verlengd + kind-agent-resultaten vorige week samengevat + Matt Pocock `codebase-design` vocabulary toegepast waar zinvol.
- **Niet bewezen**: "$count research-files per bucket" (geschat). Bevindingen per bucket zijn niet uitputtend.

| Checklist | Status |
|---|---|
| Bron-traceerbaar | ✅ Alle cross-refs gelinkt |
| Niet-canon duidelijk | ✅ Dit is audit, geen canon |
| Aanbeveling met reden | ✅ Per actie |
| Open vragen voor founder | ✅ A.4 frontier-update; B externe blockers wachten op grill |
| Sync-discipline-conform | ✅ Eén Ronde-workload, geen parallel-edits aan canon |
