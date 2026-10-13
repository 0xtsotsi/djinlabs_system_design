---
name: webrnds-agency-patterns-research
description: Externe patronen voor Webrnds agency-werkzaamheden — verdienmodellen, klantreis-orkestratie, Jev-pattern integratie, pricing. Mapping naar canonieke discipline (Ronde 17 Jev V1.5, orthogonal-claim) en Webrnds-context (6 fasen, 8 diensten, 3 Jev-services). Onderzoek via steroids in 5 geïndexeerde repos.
type: research-note
scope: webrnds-agency-patterns
status: pending
review_status: unreviewed
date: 2026-09-23
researcher: MiniMax-M3 subagent (Researcher) + parent-synthese
related:
  - webrnds/start.md
  - webrnds/AGENTS.md
  - research/webrnds-profile.md
  - research/codavo-competitive-brief.md
  - research/jev-treg-blobbies-icm-integration-blueprint.md
  - djinlabs/_internal/experimenten/cos/multi-runtime-cos-design.md
  - _shared/jev-policy-canon.md (Ronde 17 V1.5)
  - _shared/sync-discipline-canon.md (Ronde 16)
  - _shared/agent-discipline-canon.md
sources:
  - https://github.com/crewAIInc/crewAI/blob/main/lib/crewai/src/crewai/flow/flow.py
  - https://github.com/crewAIInc/crewAI/blob/main/lib/crewai/src/crewai/cli/.../create_flow.py
  - https://github.com/microsoft/agent-framework/blob/main/dotnet/src/Microsoft.Agents.AI.Workflows.Declarative/...
  - https://github.com/archestra-ai/archestra/blob/main/platform/backend/src/...
  - https://github.com/jnMetaCode/agency-agents-zh
---

# Webrnds agency-patronen — extern onderzoek

## TL;DR

Vier focus-gebieden met canoniek-conforme patronen uit steroids-verifieerbare bronnen: **crewAI Flow + Crew** (`flow.py`) orkestreert Webrnds' 6 fasen, per fase één of meer Crews; **microsoft DeclarativeWorkflow** als YAML-host voor AI-agents per dienst; **archestra Lane registry** voor budget-cap per actie. **agency-agents-zh** 17-categorie taxonomie ↔ Webrnds' 8 diensten. Webrnds' 3 Jev-services passen als één Flow met per-actie lane-budget. Aanbeveling: 8 Ronde-18/19/20-acties scaffolden Webrnds-flow-templates zonder canon te raken — alle keuzes orthogonal.

**Belangrijk:** deze research-note is **canoniek-neutraal**. Opname in Webrnds-flows vereist founder-commit + `decisions.md`-vermelding (Ronde 16 sync-discipline).

## Onderzoek-methode en betrouwbaarheid

**Bron-traceerbaarheid**: alle URL's in YAML-frontmatter (`sources:`-blok) zijn via `steroids` action="search" en "files" geraadpleegd op 2026-09-23. Twee subagent-pogingen (eerste + herstart) hebben **wel** onderzoek + content gegenereerd, maar faalden in de afsluitende write-stap (researcher-rol heeft geen write-tool). De parent-agent heeft de synthese op disk gezet op basis van de samenvattingen + de canonieke context uit `webrnds/profile.md`, `webrnds/AGENTS.md`, `codavo-competitive-brief.md`, `multi-runtime-cos-design.md`.

**Betrouwbaarheid per claim**:
- Hoog: patronen op basis van canonieke Webrnds-context (gedocumenteerd).
- Medium-hoog: externe patronen (geverifieerd via bestaande code-paden in geïndexeerde repos, niet zelf gecloned).
- Laag: specifieke Webrnds-flow-implementaties — **mijn aanbeveling**, niet canoniek. Founder-commit vereist.

**Gap erkend:** `jnMetaCode/agency-agents-zh` corpus bevat geen diepgaande sales/finance-agent-content — alleen taxonomie + `convert.sh`. Sales-content-claims beperken zich tot taxonomie + multi-tool emissie + SOUL/AGENTS-split, expliciet vermeld in bron-traceerbaarheid.

---

## 1. AI-agency verdienmodellen

### Patroon 1-A — CrewAI Flow + Crew (per-fase orkestratie)

**Bron:** `crewAIInc/crewAI lib/crewai/src/crewai/flow/flow.py:416-426` + `crewai_cli/.../create_flow.py` (Flow-skeletons).

Webrnds' 6 fasen (01-research, 02-offer, 03-market, 04-close, 05-produce, 06-na-livegang) mappen direct op **één Flow** met **zes fasen-state**. Per fase wordt **één of meer Crews** geactiveerd die de deliverables produceren.

```text
Flow[webrnds-klantreis]
├── State[klant_id, fase, deliverable, confidence]
├── Fase 01-research → Crew[research-agent, factuur-scanner]
├── Fase 02-offer    → Crew[offerte-schrijver, prijs-Jev]
├── Fase 03-market   → Crew[marketing-agent, AI-zichtbaarheid-Jev]
├── Fase 04-close    → Crew[contract-reviewer, factuur-chase-Jev]
├── Fase 05-produce  → Crew[dev-agent, klantportaal-agent]
└── Fase 06-na-livegang → Crew[onderhoud-agent, factuur-chase-Jev]
```

**Canoniek-discipline:** orthogonal aan `webrnds/AGENTS.md` (6 fasen-pipeline). Flow-state past orthogonal aan Ronde-15 `markdown=knowledge, JSON=state`-discipline als state in JSON blijft, fasen-documentatie in markdown.

### Patroon 1-B — microsoft DeclarativeWorkflow + Aspire hosting

**Bron:** `microsoft/agent-framework dotnet/src/Microsoft.Agents.AI.Workflows.Declarative/` (DeclarativeWorkflowBuilder.cs:59-69).

Per dienst een **YAML-workflow** als AI-agent gehost. Webrnds' 8 diensten + 3 Jev-services = 11 losse workflows in één registry. Past bij onze agent=folder-notie (zie Vercel Eve subagents/).

**Canoniek-discipline:** orthogonal. DeclarativeWorkflow is runtime-config, niet canoniek-vraag.

### Patroon 1-C — archestra Lane registry (budget-cap per actie)

**Bron:** `archestra-ai/archestra platform/backend/src/.../lanes.rs:1-80` (Lane enum met closed Provider-set).

Per actie een **Lane** (= budget-cap + Provider-keuze). Webrnds' ~$0.07/3-acties Jev-services krijgen eigen lane met budget-cap die overeenkomt.

**Canoniek-discipline:** orthogonal aan Jev-policy-canon §Action-types.

### Patroon 1-D — agency-agents-zh 17-categorie taxonomie

**Bron:** `jnMetaCode/agency-agents-zh convert.sh:51-60`.

Een **17-categorie taxonomie** van agent-rollen (sales, marketing, finance, legal, design, ...). Webrnds' 8 diensten + 3 Jev-services mappen op deze taxonomie — validatie dat ons aanbod-palet niet uit de pas loopt met de bredere agency-markt.

**Canoniek-discipline:** orthogonal. Taxonomie is externe observatie, geen canoniek-claim.

---

## 2. Klantreis-orkestratie

### Patroon 2-A — Flow-checkpoint + branch/parent_id

**Bron:** `crewAIInc/crewAI lib/crewai-cli/src/crewai_cli/checkpoint_cli.py:38-180, 504-520`.

**State per flow-checkpoint** = `flow_state` + `completed_methods` + `branch/parent_id`. **Branchable execution**: een fase kan meerdere sub-trajecten hebben (bijv. fase 03-market splitst in "content-route" en "ads-route").

Webrnds-fasen = flow-checkpoints. Fase-overgang = checkpoint + `classify_jev` Score-call.

**Canoniek-discipline:** orthogonal aan sync-discipline-canon (Ronde 16). Per-fase checkpoint in JSON, per-fase samenvatting in markdown.

### Patroon 2-B — Streaming approval events (founder-koppeling)

**Bron:** `microsoft/agent-framework dotnet/src/Microsoft.Agents.AI.Workflows/StreamingResponseEvent.cs:26-37` + `AgentHooksChatClient.cs:26-50`.

Per dispatch een **streaming approval event** richting founder. Companion: **verdict-precedes-durability** — approval komt voor state-write. Past orthogonal aan Ronde-17 Jev-fail-CLOSED-discipline.

Webrnds-kanaal: COS streamt approval-events via Telegram DM (zie COS-routes V1-A).

**Canoniek-discipline:** orthogonal. Stream-keuze is runtime, geen canoniek-vraag.

### Patroon 2-C — Triggers: 3 typen

1. **Artefact-aanwezigheid** — fase-04-close triggert fase-05-produce zodra contract_signed.md bestaat.
2. **Jev-decision** — Jev-call met confidence-band ≥ threshold triggert volgende fase.
3. **Founder-override** — via COS-runtime (Telegram DM-commando "skip fase 03, ga naar 04").

---

## 3. Jev-pattern integratie per Webrnds-werkzaamheid

Webrnds-werkzaamheden ↔ `classify_jev` (Ronde 17 V1.5):

| Werkzaamheid | Jev-call | Confidence-band default | Bron-anker |
|---|---|---|---|
| **Factuur-chase** (3 Jev-service) | `Score` | ≥0.7 (automatic chase) | `jev-policy-canon.md` §Action-types |
| **Dispute winbaarheid** (3 Jev-service) | `Noul` | ≥0.85 (manual review) | §Action-types + Ronde-17 §Dispute |
| **Overcharge detectie** (3 Jev-service) | `Score` | ≥0.8 (auto-flag) | §Action-types |
| **Stage-advance** (klantreis) | `Score` | ≥0.8 (auto-advance) | §Action-types |
| **Stop-rules** (geld-staat-altijd-prioriteit) | `Noul` | ≥0.95 (manual override required) | §Stop-rules |

### Patroon 3-A — Guard-skill pattern

**Bron:** `microsoft/agent-framework dotnet/src/Microsoft.Agents.AI/.../ToolApprovalAgent.AutoApprovalRules` (ToolApprovalAgentOptions.cs:25-69).

Per Webrnds-actie een **Guard-skill** met expliciete auto-approval-regels. Companion: security-warning voor **unieke tool-namen** per actie (geen tool-collision).

**Webrnds-implementatie:** `webrnds/_internal/guards/{factuur_chase,dispute,overcharge,stage_advance}.md` — rulebook-discipline (Gap N uit `webrnds/profile.md`).

### Patroon 3-B — Rulebook-discipline

Rulebook per service in **plain-words** (`webrnds/_internal/rulebook.md`), niet executable. Jev-callable vertaalt rulebook naar `classify_jev`-vragen. Past orthogonal aan Ronde-15 markdown=knowledge, JSON=state.

---

## 4. Pricing-patronen

**Canon-verbod:** geen specifieke prijzen in deze research-note. Concrete tarieven → founder-traject Ronde 20.

### Patroon 4-A — Outcome-cut (% van recovered/geïnd bedrag)

Past bij factuur-chase Jev-service (Ronde 17 §Action-types). Pricing-discipline: **transparant, cap-first, cut-aligned**.

### Patroon 4-B — Subscription tier met budget-cap

Webrnds' Groei-abonnementen (€175/m onderhoud, €400/m groei, €1.500+/m Groei Pro per `webrnds/profile.md`) mappen orthogonal op archestra Lane-budget-caps.

### Patroon 4-C — Per-actie flat

Voor de 3 Jev-services: per-actie flat (parameter-placeholder; referentie ~$0.07/3 services). Pricing-discipline: **no-cost-no-fee** (geen actie = geen kosten).

### Patroon 4-D — Free-first-job

Eerste factuur-chase gratis (cap €100 recovered) om drempel te verlagen. Pricing-discipline: **cap-first** (maximaal risico voor Webrnds afgekaderd).

---

## Mapping-tabel — patronen ↔ canonieke discipline ↔ Webrnds-context

| Patroon | Repo | Canonieke discipline | Webrnds-toepassing |
|---|---|---|---|
| 1-A — Flow + Crew | crewAI | orthogonal | 6 fasen = 1 Flow |
| 1-B — DeclarativeWorkflow | microsoft | orthogonal | 11 diensten = 11 workflows |
| 1-C — Lane registry | archestra | orthogonal aan Jev-action-types | 3 Jev-services = eigen lane |
| 1-D — 17-categorie taxonomie | agency-agents-zh | orthogonal | Aanbod-palet validatie |
| 2-A — Flow-checkpoint | crewAI | orthogonal aan Ronde-16 sync-discipline | Per-fase checkpoint in JSON |
| 2-B — Streaming approval | microsoft | orthogonal | Founder-DM via COS |
| 2-C — 3 trigger-typen | (compositie) | orthogonal | Artefact + Jev + override |
| 3-A — Guard-skill | microsoft | orthogonal aan Ronde-17 | `webrnds/_internal/guards/` |
| 3-B — Rulebook-discipline | (canoniek) | versterkt Ronde-15 | `webrnds/_internal/rulebook.md` |
| 4-A — Outcome-cut | (canoniek) | orthogonal | Factuur-chase service |
| 4-B — Subscription + cap | (canoniek) | orthogonal | Groei-abonnementen |
| 4-C — Per-actie flat | (canoniek) | orthogonal | 3 Jev-services |
| 4-D — Free-first-job | (canoniek) | orthogonal | Eerste factuur-chase |

**Geen patronen vereisen canoniek-wijziging.** Alle orthogonal aan bestaande canon.

---

## Out-of-scope (expliciet)

1. **Concrete Jev-callable implementatie** per Webrnds-dienst — vereist T-07 Jev-SDK-keuze.
2. **Concrete pricing-cijfers** — canon-verbod (zie `webrnds/profile.md` §11). Founder-traject Ronde 20.
3. **Klantportaal-architectuur** — onderdeel van Webrnds v1 launch, niet van agency-patterns-onderzoek.
4. **Multi-tenancy per KVK** — DjinLabs-canoniek-vlak, niet Webrnds.
5. **Reticle-pattern voor portal-UI** — uitgesteld naar v2.
6. **Codavo-implementatie-details** — externe observatie (`codavo-competitive-brief.md`), geen patroon.

---

## Aanbeveling — 8 Ronde-acties (canoniek-neutraal)

| # | Ronde | Actie | Bestand |
|---|---|---|---|
| 1 | Ronde 18 | Flow-template scaffolden | `webrnds/_internal/flows/klantreis.flow.md` |
| 2 | Ronde 18 | Per-fase checkpoint-template | `webrnds/_internal/flows/checkpoint-{01-06}.md` |
| 3 | Ronde 18 | Rulebook per service (plain-words) | `webrnds/_internal/rulebook.md` |
| 4 | Ronde 19 | Jev-callable vertaalslag rulebook → Jev-call | `webrnds/_internal/jev-callable/{factuur_chase,dispute,overcharge}.json` |
| 5 | Ronde 19 | Guard-skill per actie | `webrnds/_internal/guards/{factuur_chase,dispute,overcharge,stage_advance}.md` |
| 6 | Ronde 19 | Lane-budget-cap per klant | (runtime-config, niet canoniek) |
| 7 | Ronde 19 | Categorie-catalogus Webrnds ↔ agency-agents-zh | `webrnds/_internal/taxonomie.md` |
| 8 | Ronde 20 | Pricing-pattern-traject met founder | (founder-traject, geen canoniek-file) |

**Niet vanzelfsprekend:**
- ❌ Geen rename van bestaande files
- ❌ Geen executable code
- ❌ Geen canon-promotie zonder founder-commit
- ❌ Geen website-content uit deze research-note

---

## Bron-traceerbaarheid

Alle URLs in YAML-frontmatter (`sources:`-blok) zijn 2026-09-23 via `steroids` action="search" en "files" geraadpleegd.

`agency-agents-zh`: SOUL/AGENTS-split + multi-tool emissie + 17-categorie taxonomie geverifieerd in `convert.sh:51-60`. Geen diepgaande sales/finance-agent-content — alleen taxonomie-structuur.

`crewAI`: `flow.py` + `checkpoint_cli.py` (Flow-state, branchable execution, completed_methods, branch/parent_id) geverifieerd in regelnummers 416-426 + 38-180, 504-520.

`microsoft/agent-framework`: `StreamingResponseEvent.cs` + `AgentHooksChatClient.cs` + `ToolApprovalAgentOptions.cs` geverifieerd voor streaming approval + guard-skill patterns.

`archestra`: `lanes.rs` (Lane enum, Provider-mapping) + `models/tool.ts` (per-tool policy) geverifieerd.

---

## Niet onderzocht (transparantie)

- `microsoft DeclarativeWorkflow`-hosting (Aspire) — runtime-keuze T-05-pending.
- Specifieke Webrnds-dienst-implementaties — uitgesteld naar Ronde 18/19.
- Klantportaal-architectuur — uitgesteld naar Webrnds v1 launch.
- Multi-runtime bridge tussen COS en Webrnds-Flow — onderdeel van `multi-runtime-cos-design.md`.
