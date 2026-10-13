---
title: 187N Codex & Hermes-masterclass + hermes-ai-team-course audit voor DjinLabs/Webrnds
date: 2026-09-28
status: pending
type: research-note
scope: agent-as-folder + webnds-structuur
provenance: gebruikersverzoek — index + audit op agent-as-folder en DjinLabs/Webrnds-systeemstructuur. Vergelijking tegen huidige DjinLabs-canonieke files + onderzoek naar https://github.com/novusordos666/hermes-ai-team-course/blob/main/sops/website-sop.md
researcher: MiniMax-M3 (in opdracht van founder)
review_status: unreviewed
related:
  - ../djinlabs/_internal/experimenten/cos/wayfinder-map.md
  - ../djinlabs/_internal/experimenten/cos/multi-runtime-cos-design.md
  - ../djinlabs/_internal/experimenten/cos/tickets/T-01-cos-definitie.md
  - ../djinlabs/_internal/experimenten/cos/tickets/T-02-cos-baas.md
  - ../djinlabs/_internal/experimenten/cos/tickets/T-03-routes-vraag.txt
  - ../_shared/agent-discipline-canon.md
  - ../_shared/icm-canon.md
  - ../_shared/jev-policy-canon.md (Ronde 17 V1.5)
  - ../_shared/sync-discipline-canon.md (Ronde 16)
  - ../_shared/state-formats-canon.md (Ronde 15)
  - ../webrnds/AGENTS.md
  - ../djinlabs/AGENTS.md
  - ../research/cos-routes-patterns-research-2026-09-23.md
  - ../research/webrnds-agency-patterns-research-2026-09-23.md
  - ../research/multi-agent-patterns-research-2026-09-23.md
sources:
  - https://www.youtube.com/watch?v=Q_fdWW0QMBE
  - https://github.com/novusordos666/187n-codex-hermes-masterclass
  - https://github.com/novusordos666/hermes-ai-team-course
  - https://github.com/novusordos666/hermes-ai-team-course/blob/main/sops/website-sop.md
  - https://github.com/novusordos666/hermes-ai-team-course/blob/main/sops/hermes-sop.md
  - https://github.com/novusordos666/hermes-ai-team-course/blob/main/skills/intelligence-radar/SKILL.md
  - https://github.com/novusordos666/hermes-ai-team-course/blob/main/skills/operator-team-workflow/SKILL.md
  - https://github.com/novusordos666/hermes-ai-team-course/blob/main/profiles/orchestrator/SOUL.md
  - https://github.com/novusordos666/hermes-ai-team-course/blob/main/templates/SOUL.template.md
  - https://github.com/novusordos666/187n-codex-hermes-masterclass/blob/main/studentenpakket-v16/interactief/LESSEN.md
  - https://github.com/novusordos666/187n-codex-hermes-masterclass/blob/main/studentenpakket-v16/hermes/TEAM.md
---

# 187N Codex & Hermes-masterclass + hermes-ai-team-course audit

## 0. TL;DR (founder-leesvenster)

Twee verwante repositories van **dezelfde uitgever** (`novusordos666` = Leon / The AI Operator):

| Repo | Files | Doel | Past in DjinLabs als |
|---|---|---|---|
| `187n-codex-hermes-masterclass` | 829 (113 lessen + 15 profielen + 84 skill-MDs + MANIFEST.sha256) | Codex-cursus over AI-operators | **Referentie-implementatie + studie-materiaal**, geen directe import |
| `hermes-ai-team-course` | 27 (5 profielen + 7 skills + 2 SOPs + 2 templates) | Praktische Hermes-installatie | **Direct bruikbaar patroon** voor agent=folder + 5-rol COS |

Beide passen **niet** in DjinLabs-canon om drie redenen: (1) **geen open license** — alleen-lezen disclaimer, geen herdistributie; (2) **187N is concreet productiehands-on voor DTC-merken**, DjinLabs is folder-architectuur-methodologie; (3) **187N gebruikt Hermes als runtime-orchestrator** met allowlists, scheduler, Mission Control dashboard, Docker — en per Ronde 19 (sync-pagina 24-sep-2026) heeft DjinLabs **expliciet** besloten geen runtimes te bevatten.

Wat 187N wél **kan bijdragen**: een bewezen **Agent = folder** patroon dat 1-op-1 matcht met onze eigen notie, en een **template-bibliotheek** voor hoe je zo'n agent (Soul.md + skills/ + folder-input-bestanden + 1 SOP) inricht. Dat is precies onze DjinLabs-"build your agent" pattern.

**Aanbeveling:** 187N als **studie-bron en frontier-patroon**, niet als canoniek sub-systeem. Hermy-ai-team-course kan een referentie-skill-set worden onder `research/187n-reference/`. Geen import in `djinlabs/` of `webrnds/` tot founder-commit op canonieke adoptie.

## 1. Wat zit er in de twee repos

### 1.1 `187n-codex-hermes-masterclass` (cursusinhoud)

113 lessen in 12 thema's, met expliciete **.agents/skills/lio-masterclass/SKILL.md** projectgebonden skill (niet globaal te installeren). Bestand-structuur:

| Pad | Inhoud |
|---|---|
| `/AGENTS.md` | Router naar `studentenpakket-v16/` |
| `/MANIFEST.sha256` | 828 SHA256-handtekeningen |
| `/README.md`, `/GEBRUIK.md` | Alleen-lezen disclaimer, geen open license |
| `/.github/workflows/course.yml` + `/tests/test_course.py` | CI-controle op cursusstructuur |
| `/studentenpakket-v16/AGENTS.md` | Router naar les-content |
| `/studentenpakket-v16/interactief/{LESSEN,COACH,PRIVACY,UPDATEN,VOORTGANG}.md` | Index, lesbegeleiding, voortgang |
| `/studentenpakket-v16/hermes/TEAM.md` | **15 Hermes-profielen** in tabel |
| `/studentenpakket-v16/hermes/profiles/<name>/{SOUL,START}.md` | Per-profiel definitie (15×2 = 30 files) |
| `/studentenpakket-v16/lessen/<NNN>.md` | 113 les-bestanden |
| `/studentenpakket-v16/werkplek-extra/` | Skills, designs, praktijkprofielen |
| `/studentenpakket-v16/second-brain/` | Obsidian-workflow |
| `/studentenpakket-v16/ads/`, `aanvulling-v13/`, `case/`, `context/`, `naslag/`, `praktijk-v16/`, `skills/`, `templates/`, `tools/`, `verdienroutes/`, `voorbeelden/`, `werkkaarten/` | 21 sub-pakketten |

### 1.2 `hermes-ai-team-course` (uitvoeringskit)

Kleinere, direct-bruikbare repo. 27 files in 4 top-level mappen:

| Pad | Inhoud | Rol |
|---|---|---|
| `/profiles/<orchestrator,researcher,strategist,builder,reviewer>/SOUL.md` | 5 single-file agent-zielen | Cos-poort naar kernagent-formaat |
| `/skills/intelligence-radar/SKILL.md` | 5-agenten business-intake in vaste bestanden (`intake.md`, `research.md`, `matrix.md`, `blueprint.md`, `review.md`) | Mapping naar DjinLabs-COS-patroon |
| `/skills/operator-team-workflow/SKILL.md` | Workflow met task-contract: scope, input, output, completion condition | T-03 trigger-patroon |
| `/skills/hermes-mission-control-builder/` | Skill om Hermes Mission Control-dashboard te bouwen | NIET RELEVANT voor DjinLabs (Ronde 19: geen runtimes) |
| `/skills/obsidian/SKILL.md` | Obsidian/second-brain-workflow | Optioneel relevant voor Second Brain |
| `/skills/youtube-content/SKILL.md` | YouTube-video → skill/agent | Direct relevant voor onze Video-Watch workflow |
| `/skills/brandkit/SKILL.md` | Brand-guide-workflow | Direct relevant voor Webrnds brand voice |
| `/skills/paper-mcp-design-workflows/SKILL.md` | Designworkflow (MCP) | Niet relevant (custom design-tool) |
| `/sops/hermes-sop.md` | Hermes operations layer (Docker, allowlist, audit.log) | NIET RELEVANT (runtime) |
| `/sops/website-sop.md` | **The Conversion Machine** website-SOP | ZEER relevant (zie sectie 3) |
| `/templates/SOUL.template.md` | Invulbaar 23-regel agent-ziel | Direct bruikbaar |
| `/templates/second-brain-prompt.md` | Second-brain invulprompt | Optioneel relevant |

### 1.3 license-status

Beide repos: **geen open license**. `187n-codex-hermes-masterclass` zegt expliciet in `GEBRUIK-EN-HERKOMST.md`: "Deze repository voegt geen algemene open-sourcelicentie toe." Concreet betekent dat:

- Templates, fictieve data, lokale democode (de "Oefenmerk"-concepten) zijn **voor studenten-oefening** en aanpassing voor eigen klantprojecten toegestaan
- **Niet-toegestaan**: de hele cursus doorverkopen als eigen product; SOURCE_ONLY-onderdelen automatisch activeren
- Externe skills/rolbestanden/fonts/references behouden hun eigen herkomst en voorwaarden (controleer vóór herverdeling in eigen product)
- Klantgegevens, betaalde software, modeltoegang en echte bronmedia worden **niet** meegeleverd

`hermes-ai-team-course` heeft dezelfde disclaimer-strategie: "Static Ad Engine uitgesloten", "geen tokens meegeleverd", "5 voorbeeldprofielen zijn generieke templates".

## 2. Agent = folder mapping op DjinLabs-notie

### 2.1 Bewering: DjinLabs heeft deze notie al

DjinLabs canoniek via `_shared/icm-canon.md` + `_shared/agent-discipline-canon.md` + `_shared/jev-policy-canon.md` + onderzoek `2026-09-22-agent-is-folder-icm-notion.md`:

> Agent = folder met platte bestanden die de AI de juiste context geven.

Concreet:
- Eén agent = één folder
- Reading-state van een AI = de folder + max 2 reads (walk-test)
- Statussen in frontmatter
- Markdown voor canonieke kennis, JSON voor runtime-state

### 2.2 187N agent = folder patroon — wat klopt, wat verschilt

| Aspect | 187N patroon | DjinLabs-canon | Match? |
|---|---|---|---|
| Eén agent = één folder | ✅ `/profiles/orchestrator/SOUL.md` is één file in één folder met één agent-identiteit | ✅ Idem | Match |
| Eén ziel-bestand per agent | ✅ `SOUL.md` (single file, declarative, geen runtime) | ✅ `AGENT.md` (single file, idem declaratief) | Match (naam verschilt) |
| Taken via skill-calls | ✅ SKILL.md per skill met naam + beschrijving + execution steps | ✅ Idem | Match |
| Run-artifacten in eigen folder | ✅ `outputs/<lescode>/<run-id>/<rol>/` per run | ✅ `outputs/<task-id>/<run-id>/<artifact>` per taak | Match (suffix <rol> extra) |
| Reviewer-gate | ✅ Reviewer keurt APPROVED / CHANGES_REQUESTED | ✅ T-02: Jev is runtime-verdict-autoriteit | Functioneel equivalent |
| Boundary-discipline | ✅ Projectgebonden skills niet globaal installeren | ✅ Agent-schrijft-niet-buiten-zijn-folder | Match |
| Runtimes / orchestrators | ❌ Hermes scheduler, Docker, Mission Control dashboard, ops/ folder | ❌ Ronde 19: expliciet uitgesloten | **Conflict (opzettelijk)** |

**Belangrijkste gelijkenis:** 187N gebruikt letterlijk dezelfde declaratieve agent = folder structuur die DjinLabs al als canoniek heeft vastgelegd. **Belangrijkste verschil:** 187N heeft een runtime-orchestrator (Hermes scheduler + Docker + Mission Control), DjinLabs niet (Ronde 19 sync-page 24-sep-2026).

### 2.3 Wat 187N ons leert dat DjinLabs nog niet expliciet heeft

**187N toevoeging #1: Werkbestanden-patroon**
`/intelligence-radar/SKILL.md` definieert: een run maakt een folder aan met expliciete bestanden — `intake.md`, `research.md`, `matrix.md`, `blueprint.md`, `review.md`. Per rol één bestand. Dit is **expliciter** dan onze T-03 patronen die "intake + research + strategy + build + review" als fasen sommeren zonder per-fase-bestandsnaam af te dwingen.

**Aanbeveling A (kanoniek-neutraal):** Voeg aan DjinLabs-COS-traject optioneel een per-rol-bestandsnaam-patroon toe. Past bij canonieke regel dat state in Markdown-files leeft (Ronde 15 state-formats-canon).

**187N toevoeging #2: Task-contract**
Elke taak in `operator-team-workflow` heeft: **scope, input, output, completion condition**. DjinLabs heeft dit impliciet in de T-02 closure-discussie (orchestrator = "verzamel alleen gecontroleerd werk") maar niet als canonieke sjabloon.

**Aanbeveling B (kanoniek-neutraal):** Overweeg een canonieke task-contract-template in `_shared/` — escaleer naar Ronde-traject.

**187N toevoeging #3: Voortgang-als-bestand**
`VOORTGANG.md` per projectmap, **automatisch bewaard na iedere inhoudelijke stap**. Onze `_shared/sync-discipline-canon.md` Ronde 16 heeft dit impliciet ("sync-discipline per Ronde"), maar DjinLabs heeft geen canonieke bestandsnaam voor voortgang.

**Aanbeveling C (kanoniek-neutraal):** Overweeg `state.md` als canonieke voortgangs-file in agent-folders (per T-03 R2 + Webrnds `state.md` patroon).

### 2.4 Wat 187N NIET toevoegt (DjinLabs-sterkte)

- **Boundary-discipline tussen ventures.** 187N is monorepo monodoel (één DTC-team). DjinLabs-umbrella heeft venture-grenzen (Djin ≠ Webrnds ≠ COS-research) met expliciete cross-boundary-handover-procedure. Niet zien in 187N.
- **Discord tussen canon en runtime.** 187N heeft geen verschil tussen canon (Ronde 14 jev-policy), retention (Ronde 16 sync-discipline), en runtime-bestanden (JSON-state). DjinLabs splitst dit actief.
- **Ronde-traject-discipline.** Geen mutatie-discipline met audit-spoor; 187N gebruikt CI-tests maar geen canonieke-locked-files. DjinLabs heeft dit expliciet.

### 2.5 Wat 187N-implementatie ons NIET leert

Drie hiaten in 187N die DjinLabs kan invullen maar 187N niet:

1. **Venture-grens + handover.** Hoe ga je van agents in venture A naar venture B zonder boundary-overtreding? 187N zegt "één team, één merk". DjinLabs zegt "veel ventures, één umbrella".
2. **Canon-promotie + sync-discipline.** Hoe maak je van een nieuwe agent-pattern een canoniek-pattern? 187N heeft alleen een CI-test op bestaan-van-bestand. DjinLabs heeft Ronde-traject + audit-spoor.
3. **Beoordelaar-onafhankelijkheid.** 187N zegt Reviewer keurt. DjinLabs zegt Jev + Instinct (T-02 visibility-drie-lagen). Andere autoriteits-architectuur; relevant voor trust-taxonomie.

## 3. Website-SOP (Step 5 / Conversion Machine) — wat dit voor Webrnds betekent

### 3.1 Wat de SOP voorschrijft (samengevat)

Doel: één-pagina-conversion-site, copy eerst dan design, grond in foundation-files.

**Prerequisite files (moeten al bestaan):**
1. `deepresearch.md` — research dossier
2. `avatar-sheet.md` — klant-avatar
3. `offerbrief.md` — product + belofte + mechanisme + bewijs + prijs
4. `necessary-beliefs.md` — 4-6 geloofspunten die de secties bepalen
5. `project-knowledge.md` — geverifieerd vs. ongeverifieerd
6. `claude-project-instructions.md` — copywriter system prompt
7. `brand-guide.html` — Brand Book (Voice of Customer + Messaging Library)
8. `design.md` — design tokens (palette + fonts + accent + motion + voice)
9. `assets/hero.mp4` + `hero-poster.jpg` + `logo.png`

**Productie:** één self-contained `index.html` (inline CSS, relative asset paths) + `assets/` folder. **Niet** deployen — draait lokaal via `python3 -m http.server 8000`.

**Methodiek (5 stappen):** Map (secties van beliefs), Bevestig (CTA, volgorde, layout-vibe), Refs (Mobbin MCP + 21st.dev voor structuur, niet voor stijl), Copy (eerst woorden, dan design), Build (template via magic phrase "Use my design.md"), Verify (loop lokaal + lees als klant, top tot bottom).

**Discipline (7 operating principles):**
- Copy first, design second
- One section per belief
- Use my design.md
- Proof Discipline (geen claim zonder bron; UNVERIFIED blijft eruit)
- Customer language, verbatim
- One accent, used sparingly
- Reference structure, not style

### 3.2 Past dit in Webrnds?

**Ja — dit is precies hoe een Webrnds-template eruit moet zien.**

Mapping naar Webrnds-structuur:

| 187N website-SOP-input | Webrnds-equivalent |
|---|---|
| `deepresearch.md` | `01-research/research-dossier.md` (kanoniek Ronde 1-5) |
| `avatar-sheet.md` | `01-research/avatar-sheet.md` (klantprofiel-patroon) |
| `offerbrief.md` | `01-research/offerbrief.md` (aanbod-patroon) |
| `necessary-beliefs.md` | `01-research/belief-stack.md` (kanoniek element, zie Ronde 1-5 in `decisions.md`) |
| `project-knowledge.md` | `02-strategy/project-knowledge.md` (verified/unverified flag) |
| `claude-project-instructions.md` | `02-strategy/copy-prompt.md` |
| `brand-guide.html` | `_shared/brand/webnds-brand.html` (kanoniek brand asset) |
| `design.md` | `_shared/brand/webrnds-design-tokens.md` |
| `assets/` | `_shared/brand/assets/` |
| `index.html` | Door Webrnds-template gegenereerde site |

Elk Webrnds-traject krijgt zijn eigen folder-met-deze-bestanden; een "site-SOP" leest ze in die volgorde en produceert een self-contained `index.html`. Dit is een **exemplaar van agent = folder** — niet een runtime-orchestrator, alleen een folder-vol-doel-met-een-spec.

### 3.3 Wat Webrnds WEL moet doen om dit te adopteren

1. **Brand-assets canoniek maken.** Voordat de eerste site gebouwd wordt, moeten `_shared/brand/webrnds-design-tokens.md` + `webnds-brand.html` + `assets/` bestaan. Ronde-traject nodig (zie frontier-discipline).
2. **Per-template bestandsverwachtingen canoniek vastleggen.** Elke Webrnds-traject-folder moet die 9 bestanden kunnen produceren als ze bestaan — anders stopt de SOP. Past bij `_shared/state-formats-canon.md` (Ronde 15) en ICM-discipline.
3. **Template-discipline aanscherpen (Ronde 14+).** Geen executable code in templates, geen file-writes aan canon-files zonder vermelding. SOP is geen executable code; hij is proceduretekst zoals `multimodal-doc/SKILL.md` — dat zit al canoniek.
4. **COPYWRITER + DESIGNER + BUILDER agents.** 187N splitst die rollen in één human met Claude Code. Webrnds-traject kan dezelfde rolverdeling krijgen via 187N's 15-profielen-team, maar ingekrompen tot 4-5 agent-folders binnen Webrnds-traject.

### 3.4 Wat Webrnds NIET moet doen

- **Niet 1-op-1 kopiëren.** "Use my design.md" magic phrase werkt voor 187N omdat ze een gestandaardiseerde build-template hebben. Webrnds heeft die nog niet — eigen variant nodig.
- **Niet Mobbin/21st.dev als canoniek pattern adopteren.** Die zijn 187N's externe referentie-laag. Webrnds-brand-stijl is een **eigen** beslissing (zie frontier "brand voice Webrnds" geparkeerd).
- **Niet het 5-stappen-patroon hardcoden als kanoniek.** Webrnds-templates moeten flexibel genoeg zijn om voor elk type klant te werken (webshop vs. portal vs. API-koppeling). SOP voor websites is één variant; Webrnds-portfolio heeft 8 diensten.

## 4. Hoe 187N past in DjinLabs-systeemstructuur

### 4.1 Wat hoort NIET in DjinLabs

| Onderdeel | Status | Reden |
|---|---|---|
| Volledige 187N-repo als sub-folder van DjinLabs | ❌ | License afwezig + niet canoniek |
| Hermes scheduler, Docker, Mission Control | ❌ | Ronde 19: geen runtimes |
| 15-agenten teamformaat | ⚠️ Niet canoniek-adopteren | Wel studie-bron (kan onze T-03 vision voeden) |
| Static Ad Engine (uitgesloten door 187N zelf) | ❌ | Niet beschikbaar |
| SOURCE_ONLY-onderdelen | ❌ | Niet automatisch activeren |

### 4.2 Wat hoort WEL in DjinLabs (research-zone)

**Aanbeveling D (kanoniek-neutraal, geen files aanraken):**

1. **Maak `research/187n-reference/` map** met sub-folders:
   - `research/187n-reference/agent-folder-pattern.md` — onze huidige notie + 187N-aanvullingen
   - `research/187n-reference/intelligence-radar-skill.md` — gekopieerd voor studie (met bron-attributie + GEBRUIK-EN-HERKOMST-notitie)
   - `research/187n-reference/operator-team-workflow.md` — idem
   - `research/187n-reference/website-sop-audit.md` — deze research-note samengevat
   - `research/187n-reference/license-note.md` — expliciete herdistributiebeperking

2. **Maak `research/187n-vs-djinlabs-matrix.md`** — directe mapping van 187N-componenten naar DjinLabs-canonieke files (de tabel uit sectie 2.2 hier).

3. **Documenteer in `decisions.md` Ronde XX** (na canoniek-traject): "187N-pattern is referentie-implementatie, geen canoniek sub-systeem. Patrol: agent = folder, task-contract, voortgangs-file, per-rol-bestand. Niet-patrol: scheduler, Docker, Mission Control."

### 4.3 Wat hoort in Webrnds (kanoniek via Ronde-traject)

Drie Webrnds-traject-uitbreidingen die uit 187N-audit volgen (alleen via Ronde-traject toepassen):

1. **Per-template bestandsverwachting** canoniek maken in `_shared/`. Concrete set: `{research-dossier.md, avatar-sheet.md, offerbrief.md, belief-stack.md, project-knowledge.md, copy-prompt.md, brand-guide.html, design-tokens.md, assets/}` (zie sectie 3.2 hier).
2. **Webrnds-portfolio-uitbreiding**: dienst "Maatwerk-conversion-site uit bestaande research" als variant toevoegen aan `webrnds/start.md` — past binnen "Maatwerksoftware die met je meegroeit" tag-line.
3. **Website-SOP als Webrnds-template**: één van de `templates/`-leden wordt `website-from-research.md` met dezelfde 5-stappen-discipline (map → confirm → refs → copy → build → verify) maar dan in Webrnds-brand-stem. License: Webrnds-eigen.

## 5. Concrete volgorde voor Webrnds-COS-traject

**Fase 0 (al gedaan):**
- T-01 closure: COS = "Chief of Staff — leest inbox + stuurt berichten" ✅
- T-02 closure: COS = "orthogonal aan agents, drie-lagige visibility" ✅
- T-03 synthese gegenereerd + live op ngrok (gesloten door founder-call)

**Fase 1 (nu, kanoniek-neutraal):**
- Index 187N-video + repo's in Notion onder Webrnds ✅ (deze sessie)
- Schrijf research-note "187N-audit" (= deze file) ✅
- Wacht op Ronde 19-commit + Ronde 20+ plan

**Fase 2 (na Ronde 19 lock + founder-go op adoptie):**
- Maak `research/187n-reference/` met kern-bestanden
- Maak `research/187n-vs-djinlabs-matrix.md`
- Documenteer 187N-pattern-status in `decisions.md` als Ronde XX
- Update `webrnds/AGENTS.md` met de per-template-bestandsverwachting cross-ref

**Fase 3 (na brand voice + eerste SOP-skelet):**
- Schrijf `templates/website-from-research.md` in Webrnds-stem
- Test met één lopend traject (bijv. fictieve klant uit oefenmateriaal)
- Update `webrnds/start.md` en `webrnds/01-research/CONTEXT.md` zodat de nieuwe dienst in portfolio staat

**Niet-doen:**
- Geen Hermes Mission Control-fork in DjinLabs (Ronde 19: geen runtimes, license NONE)
- Geen 187N-content overnemen in Webrnds-templates vóór brand voice lock (zie `_shared/`-beslissingen)
- Geen SOURCE_ONLY-onderdelen activeren

## 6. Key takeaways

1. **Het 187N-patroon is compatible met DjinLabs-agent = folder-notie**, maar heeft een runtime-orchestrator die DjinLabs per Ronde 19 expliciet uitsluit.
2. **License is afwezig op beide 187N-repos** — geen import, alleen studiebron.
3. **De website-SOP is precies hoe een Webrnds-template eruit moet zien** — folder met 9 foundation-files + proceduretekst die ze leest + 1 self-contained output. Webrnds-portfolio heeft nog geen conversion-site-template; dit is een gat dat 187N vult.
4. **187N's task-contract-patroon (scope, input, output, completion) is een canonieke kandidaat** voor DjinLabs-COS — kan in een toekomstige Ronde aan `_shared/agent-discipline-canon.md` worden toegevoegd.
5. **Directe actie:** wacht op Ronde 19 commit. Deze research-note is canoniek-neutraal bewijs voor de audit, niet voor beslissingen. Founder-commit bepaalt vervolg.

## 7. Open vragen voor founder-call

| # | Vraag | Context |
|---|---|---|
| 1 | Ronde 19 commit akkoord? | Sync-pagina heeft de 6 moties; nu is de tijd |
| 2 | Webrnds brand voice prioriteit? | Voor website-SOP-adoptie is brand design tokens nodig |
| 3 | 187N-research-zone op `research/187n-reference/` akkoord? | Kanoniek-neutraal, geen impact op canon |
| 4 | Per-template-bestandsverwachting canoniek in `_shared/` (Ronde XX)? | Concrete set uit sectie 3.2 |
| 5 | 187N-vs-djinlabs-matrix in `decisions.md`? | Verwijst naar deze research-note |
| 6 | Webrnds-template `website-from-research.md` schrijven (na brand voice)? | 8 templates al in `webrnds/`, dit wordt #9 |
| 7 | Hermes Mission Control-fork definitief negeren? | Ronde 19 al geïmpliceerd "geen runtimes" |
