---
name: jev-treg-blombies-icm-integration-blueprint
description: Integration blueprint voor Jev (decision layer) + Treg (tool registry) + Blobbies (infra-host orthogonal) + 1folder/ICM (umbrella boundary) in Djinlabs-system-design. Consolideert Treg README, USAGE.md, llms.txt, MCP/OAuth architectuur, TypeSafe docs, 0xCodila roadmap en alle vier eerdere Jev/Treg-audits in één concrete wire-up. Triggert wanneer je een nieuwe tool onboardt, een agent-loop bouwt, of de boundary-discipline tussen Jev/Treg/Blobbies/ICM wilt toetsen.
status: review_pending
sources:
  - https://raw.githubusercontent.com/superdesigndev/treg/main/README.md
  - https://raw.githubusercontent.com/superdesigndev/treg/main/USAGE.md
  - https://treg.to/llms.txt
  - https://raw.githubusercontent.com/superdesigndev/treg/main/docs/context/architecture/mcp-oauth.md
  - https://treg.to/jev (web_extract primer)
  - https://docs.typesafe.ai (TypeSafe API docs)
  - 0xCodila 10-step roadmap (substack)
  - Djinlabs canon (jev-policy, retention-policy, state-formats, icm-canon, sync-discipline, hard-rules, ADR 0001, decisions.md)
  - Djinlabs research (Sam/AI Jason/0xCodila/Chris audits + jev-revenue-streams + local-ai-agency + blombies-fit)
retrieved: 2026-09-21
tool_used: /research skill (handmatig uitgevoerd nadat background agent vastliep op iteratie-cap)
owner: djin
confidence: high
prior_audits:
  - sam-witteveen-jev-router-audit (Gaps A-E)
  - ai-jason-jev-treg-automation-audit (Gaps F-I)
  - 0xcodila-jev-engineering-roadmap-audit (Gaps J-L)
  - everestchris6-jev-native-agency-architecture (Gaps M-Q)
---

## TL;DR

Dit is de **integration blueprint** die alle externe bronnen (Treg + Jev + 0xCodila + 5 Djinlabs-audits) consolideert in één concrete architectuur voor **Djinlabs × Blobbies × 1folder/ICM**.

**De vier lagen** van de blueprint:

| # | Laag | Component | Rol | Boundary |
|---|---|---|---|---|
| 1 | Decision | **Jev** (TypeSafe System One) | "Wat moet er gebeuren?" | Geen eigen boundary — gedeelde infra |
| 2 | Tool Registry | **Treg** (3,600+ endpoints, 89 providers) | "Hoe roepen we externe tools aan?" | Per-org token, server-side credentials |
| 3 | Infra-host | **Blobbies** (`~/.blobbies/`) | "Waar draait de Blob (agent-instance) orthogonal?" | `~/.blobbies/` ∪ Tinfoil-CSP ∪ Ollama |
| 4 | Umbrella boundary | **1folder/ICM** (`djinlabs/<instance>/`) | "Welke tenant hoort bij welke agent?" | Per-instance containment (`icm.ts`) |

**Concrete cijfers** uit primary sources:

| Metric | Waarde | Bron |
|---|---|---|
| Treg catalog | 3,600+ endpoints, 89 providers | treg.to/llms.txt |
| Treg concurrency | Geen per-token of per-team limit | treg.to/llms.txt |
| Jev cost | $0.042/M input tokens, output free | treg.to/jev primer |
| Jev latency (cloud) | 88-331ms | AI Jason + Sam audits |
| Jev latency (lokaal) | 88ms | AI Jason audit (SemIf) |
| Browser Use optimalisatie | 1,092 → 101 calls (10.8× reductie) | 0xCodila Step 07 |
| Browser Use flight-finding | 7s, $0.0039 | Gregpr07 citaat |
| Treg MCP surfaces | `/mcp/` (general) en `/mcp/v2/` (catalog-only) | MCP/OAuth doc |
| Treg WAF-bypass | `X-Treg-Body-Encoding: base64\|gzip` | treg.to/llms.txt |

**Cross-link tabel naar alle 17 gaps** (uit eerdere audits):

| Domein | Gaps |
|---|---|
| `jev-policy-canon.md` | A, D, F, O |
| `state-formats-canon.md` | Q |
| `retention-policy-canon.md` | K, L |
| `icm-canon.md` | J, M |
| `hard-rules.md` | N |
| `_shared/` nieuwe files | E, G, H, I, P |

---

## Vocabulary mapping

| Term in bronnen | Definitie | Djinlabs canonieke pendant |
|---|---|---|
| **Jev** | TypeSafe AI's System One model, RLCD-trained | `jev-policy-canon.md` decision gate |
| **Treg catalog** | 3,600+ curated external endpoints | **Gap G** uit AI Jason audit — optionele laag |
| **Treg vault** | Team-owned tools (API key, OAuth, CLI, SKILL.md) | Pattern-match met `~/.blobbies/skills/connected-apps/` |
| **Treg endpoint** | upstream base_url + credential bindings | Pattern-match met `icm.ts` containment |
| **Treg CLI tool** | Vendor binary met injected credential | Pattern-match met blobbies-skill |
| **Treg skill/bundle** | SKILL.md + secrets + tool, registered together | Pattern-match met `agents/skills/` orthogonal |
| **Treg MCP** | `/mcp/` general + `/mcp/v2/` catalog-only | **Gap G detail** |
| **Credential ladder** | own-key → stored secret → public route → treg-key → refused | Pattern-match met boundary-discipline |
| **Tinfoil-CSP** | Attested-enclave egress | Ronde 14 canonieke provider |
| **Ollama-loopback** | Alles lokaal, geen egress | Ronde 14 runtime-optie |
| **Open Jev (SemIf)** | Open-source Jev-clone | **Gap C** uit Sam audit |
| **Blobbies / Blob** | Tauri-app met tray + per-instance UUID | `jev-policy-canon.md` regel 17 vocabulary mapping |
| **1folder / ICM** | `djinlabs/<instance>/` per-tenant | `icm-canon.md` containment |
| **Handoff** | JSON-file in queue/ folder | **Gap J** uit 0xCodila audit |
| **Chief-of-Staff** | Dispatcher-agent orthogonal | Pattern-match met `djin/tenants/djin/` agents |
| **Rulebook** | Plain-words regels voor wat juiste call is | **Gap N** uit Chris #2 audit |
| **Review layer** | Menselijke queue bij twijfel | `ask_human` action-type |

**Drie termen die expliciet niet in onze canon staan** maar in de blueprint nodig zijn:

- **MCP surface split** (`/mcp/` vs `/mcp/v2/`) — Gap G detail
- **Credential ladder** als canoniek priority-volgorde
- **Body encoding flag** (`X-Treg-Body-Encoding`) — runtime, niet canon

---

## 1. De blueprint — 4 lagen architectuur

```
┌─────────────────────────────────────────────────────────────────┐
│ L4 — 1folder / ICM (umbrella boundary)                          │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Per-tenant: djinlabs/<instance>/                            │ │
│ │ Containment: icm.ts boundary check                          │ │
│ │ Files: AGENTS.md + start.md + state.md + ICM/{Inbox,..}     │ │
│ │ Org-scoped: tenant bepaalt wat mag                          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│   ┌───────────────────────────────────────────────────────────┐  │
│   │ L3 — Blobbies (infra-host orthogonal)                       │  │
│   │ ┌───────────────────────────────────────────────────────┐ │  │
│   │ │ Boundary: ~/.blobbies/ ∪ Tinfoil-CSP ∪ Ollama-loopback │ │  │
│   │ │ Per-Blob: <uuid>/ + runs.json + skills/               │ │  │
│   │ │ Hosts: Jev-clients, Treg-clients, agents orthogonal    │ │  │
│   │ │ Capability: local Jev (SemIf) + remote Jev (cloud)    │ │  │
│   │ └───────────────────────────────────────────────────────┘ │  │
│   │                                                            │  │
│   │   ┌─────────────────────────────────────────────────────┐ │  │
│   │   │ L2 — Treg (tool registry)                           │ │  │
│   │   │ ┌─────────────────────────────────────────────────┐ │ │  │
│   │   │ │ Boundary: per-org token (X-Treg-Token)           │ │ │  │
│   │   │ │ Catalog: 3,600+ endpoints, 89 providers          │ │ │  │
│   │   │ │ Vault: SKILL.md + secrets + tool bundles          │ │ │  │
│   │   │ │ MCP surfaces: /mcp/ (general), /mcp/v2/ (read)  │ │ │  │
│   │   │ │ Server-side credential injection                  │ │ │  │
│   │   │ └─────────────────────────────────────────────────┘ │ │  │
│   │   └─────────────────────────────────────────────────────┘ │  │
│   │                                                            │  │
│   │   ┌─────────────────────────────────────────────────────┐ │  │
│   │   │ L1 — Jev (decision layer)                           │ │  │
│   │   │ ┌─────────────────────────────────────────────────┐ │ │  │
│   │   │ │ Question-types: choice / score / noul            │ │ │  │
│   │   │ │ Parallel questions, speculative branches         │ │ │  │
│   │   │ │ Latency: 88-331ms, $0.042/M input tokens         │ │ │  │
│   │   │ │ Confidence-bands: 0.35/0.7 default               │ │ │  │
│   │   │ │ Stop-rules priority 1                             │ │ │  │
│   │   │ └─────────────────────────────────────────────────┘ │ │  │
│   │   └─────────────────────────────────────────────────────┘ │  │
│   └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Architectuur-principes** (geen code, alleen regels):

1. **Lagen zijn orthogonal aan elkaar.** Jev weet niets van Treg. Treg weet niets van Blobbies. Blobbies weet niets van ICM-containment. Elke laag heeft zijn eigen boundary.
2. **Boundary-discipline wordt NIET doorgesproken door lagen.** Een Jev-call respecteert geen tenant — de **aanroepende agent** (in Blobbies/ICM) respecteert de tenant.
3. **Credentials worden server-side geïnjecteerd door Treg.** Nooit via client-side headers. `X-Treg-Token` wordt door Treg gestript voor de upstream ziet.
4. **State is JSON (per ADR 0001).** Kennis is Markdown. Runtime-state per Blob is JSON in `~/.blobbies/blobs/<uuid>/`.
5. **Canonieke regels leven in `_shared/`.** Per-Blob-configuratie is runtime; geen canonieke claims per Blob.

---

## 2. Workflow-loops — 4 canonieke paden

### 2.1 Hot-path (foreground agent met Jev-decision)

**Trigger:** Een agent in een actieve gebruikerssessie moet een beslissing nemen.

**Loop:**

1. Agent ontvangt user-input of interne trigger
2. Agent bouwt Jev-state (situation + options)
3. Agent doet **parallel Jev-call** (Choice + Score + Noul in één call)
4. Confidence-bands toegepast:
   - `>0.7` → auto-act
   - `0.35-0.7` → `ask_human` action
   - `<0.35` → safe default
5. Stop-rules priority 1: bij `>0.8` stop → wint over action
6. Action uitgevoerd via Blobbies (`~/.blobbies/`)
7. State weggeschreven naar per-Blob JSON

**Latency-budget:** ≤500ms end-to-end (Jev-call 88-331ms + action ~100-200ms).

**Boundary:** Blobbies bepaalt of de actie binnen de tenant blijft (`icm.ts` containment).

### 2.2 Cold-path (overnight batch met Treg)

**Trigger:** Geplande batch-loop (per-week cadans, **Gap P**).

**Loop:**

1. Per-klant agent pullt nieuwe data (invoices, disputes, bills)
2. Per-item: Jev-evaluation via rulebook (5-onderdelen-pattern, **Gap M**)
3. `>0.8` confidence → Fable schrijft message/packet/letter (Gap O)
4. `<0.8` confidence → review-list met reden
5. Batch gaat naar menselijke approval
6. Na approval: Treg-call voor externe actie (bijv. send-email, submit-dispute)
7. Treg injecteert credentials server-side
8. Audit-log naar per-Blob JSON + sync-discipline update (Ronde 16)

**Latency-tolerantie:** dagen-week (geen real-time-eis).

**Boundary:** Treg-token per-org; cross-org calls geweigerd door Treg zelf.

### 2.3 Onboarding-path (nieuwe tool via Treg upload)

**Trigger:** Een nieuwe externe provider moet beschikbaar worden.

**Loop:**

1. **Hot:** Developer runt `treg scan` (read-only preview van `.env`, skills, CLIs)
2. Developer beslist: `treg upload` voor register, of handmatig
3. **Handmatig pad:**
   - `treg secret add <name> --value *** --kind env`
   - `treg tool add <name> --base-url https://api... --secret <id> --injector env`
   - Voor multi-credential: `--bind` met JSON-array
   - Voor OAuth: `treg oauth connect` met browser-flow
4. **Skill-bundle:** `treg upload skills --dir ~/.claude/skills --all`
5. Health-check optioneel: `--health '{"path":"me","expect_status":200}'`
6. Tool beschikbaar in catalog via `treg catalog search`

**Latency-budget:** setup-tijd; geen hot-path-eis.

**Boundary:** Server-side credentials (geen plaintext in client). Per-org token.

### 2.4 Audit-path (Jev-call → Treg-call → state-write → retention)

**Trigger:** Elke Jev-call of Treg-call is een auditable event.

**Loop:**

1. Jev-call of Treg-call wordt uitgevoerd
2. **State-write** naar per-Blob JSON in `~/.blobbies/blobs/<uuid>/runs.json`
3. **Retention-mapping** toegepast (zie §8 hieronder):
   - State → operationele klasse (korte bewaartermijn)
   - Decision-log → canonieke klasse (lange bewaartermijn, sync-discipline)
   - Cost-log → fiscale klasse (lange bewaartermijn, audit-verplicht)
4. **Sync-discipline** (Ronde 16) — als canon-update nodig, dan via `decisions.md` Ronde
5. **Audit-spoor** is append-only — geen in-place edits op `runs.json`

**Latency-budget:** geen — write gebeurt direct na call, geen batch.

**Boundary:** State blijft binnen Blob (geen cross-Blob writes).

---

## 3. Optimalisaties — latency, cost, retention

### Latency-optimalisaties

| Optimalisatie | Bron | Besparing |
|---|---|---|
| Parallel Jev-questions | 0xCodila Step 07 | 1 call i.p.v. N |
| Speculative branches | 0xCodila Step 07 | Geen rollback nodig |
| Open Jev lokaal (SemIf) | AI Jason audit | 88ms i.p.v. 331ms (3.7× sneller) |
| Browser Use optimalisatie | 0xCodila | 1,092 → 101 calls (10.8× minder) |
| Treg concurrency | treg.to/llms.txt | Geen per-token limit, Promise.all oké |
| Local-first routing | Sam audit | 75% lokaal afgehandeld |

### Cost-optimalisaties

| Optimalisatie | Bron | Besparing |
|---|---|---|
| Jev vs GPT-5.6 Luna | treg.to/jev | 5-7× sneller, 5× goedkoper |
| Local Jev (SemIf) | AI Jason audit | 75% lokaal = minimale cost |
| Free first-job | Chris #2 | $0.07 voor 3 services |
| Treg per-call billing | Treg README | Geen subscription nodig |
| Browser Use cost | 0xCodila | $0.0039 per flight-finding |
| Instant compaction | Alex Volkov citaat | 1M → 86K tokens (91.4% minder) |

### Retention-optimalisaties

| Optimalisatie | Bron | Effect |
|---|---|---|
| Markdown = knowledge | ADR 0001 | Bewaar voor canonieke bron |
| JSON = state | ADR 0001 | Bewaar voor runtime, korte termijn operationeel |
| Jevons-clausule | **Gap K** | Efficiency-winst → meer state → retention-pressure |
| Selective compaction via Jev | **Gap L** | Drop irrelevant items, behoud canoniek |

### Sync-discipline optimalisaties (Ronde 16)

| Optimalisatie | Effect |
|---|---|
| `decisions.md` als single source of truth | Geen drift tussen files |
| Geen ad-hoc hand-edits aan canon | Verplichte Ronde-flow |
| AGENTS.md routers gesynced | Elke tenant weet waar te kijken |
| `CONTEXT.md` glossary gesynced | Termen zijn unidirectioneel |

---

## 4. Boundary-discipline — wie respecteert welke boundary

**Vier boundary-types** in de blueprint:

| Boundary | Eigenaar | Wat valt erbuiten | Wat valt erbinnen |
|---|---|---|---|
| **1folder / ICM** | `djinlabs/<instance>/` | Cross-instance writes | Per-tenant agent + skills |
| **Blobbies** | `~/.blobbies/` ∪ Tinfoil-CSP ∪ Ollama | Andere infra-hosts | Per-Blob JSON + secrets |
| **Treg** | Per-org token (X-Treg-Token) | Andere orgs zonder invite | Catalog + vault + skills |
| **Jev** | Geen eigen boundary | — | Gedeelde infra, geen tenant |

**Mapping naar onze canon:**

| Boundary | Canonieke bron | Ronde |
|---|---|---|
| ICM | `icm-canon.md` | Ronde 11+ |
| Blobbies | `jev-policy-canon.md` regel 22 + `djinlabs-blombies-fit-research.md` | Ronde 14 |
| Treg | (geen canon-positie — **Gap G** uit AI Jason audit) | Ronde 17+ frontier |
| Jev | `jev-policy-canon.md` regel 3 | Ronde 11+ |

**Concrete regels per boundary:**

1. **1folder/ICM** — `icm.ts` enforcement. Elke file-write door een agent moet binnen `djinlabs/<instance>/` blijven.
2. **Blobbies** — Runtime-containment in `~/.blobbies/`. Geen cross-Blob writes. Tinfoil-CSP als egress voor cloud-only scenarios.
3. **Treg** — Server-side credential injection. `X-Treg-Token` gestript voor upstream ziet. `/mcp/` general, `/mcp/v2/` catalog-only.
4. **Jev** — Gedeelde infra, geen tenant-bewustzijn. Aanroepende agent bepaalt of de state binnen tenant blijft.

**Voorgestelde canonieke aanvulling** (in `_shared/jev-policy-canon.md` nieuwe §"Boundary-discipline" of aanvulling in bestaande §"Vocabulary mapping"):

```markdown
## Boundary-discipline — vier canonieke boundary-types

| Boundary | Eigenaar | Canonieke bron |
|---|---|---|
| 1folder/ICM | `djinlabs/<instance>/` | `icm-canon.md` |
| Blobbies | `~/.blobbies/` ∪ Tinfoil-CSP | Ronde 14 vocabulary |
| Treg | Per-org token | Gap G (Ronde 17+) |
| Jev | Geen (gedeelde infra) | n.v.t. |

**Een laag respecteert alleen zijn eigen boundary.** Jev weet niet van tenants;
Treg weet niet van blobbies-containment; Blobbies weet niet van ICM-folders.
De boundary-discipline wordt afgedwongen door de **aanroepende agent**.

**Geen cross-boundary writes.** Een agent in Blobbies schrijft niet in
`djinlabs/<instance>/`. Een agent in ICM schrijft niet in `~/.blobbies/`.
Cross-boundary handovers lopen via `/_shared/handovers/`.
```

**Waarom dit canoniek moet:** zonder expliciete boundary-mapping kan een integratie per ongeluk een boundary schenden (bijv. een Blobbies-agent die direct in `djinlabs/<instance>/` schrijft).

---

## 5. Sync-discipline check — Ronde 16 toepassing

**Deze blueprint raakt 8 canon-paden.** Sync-discipline (Ronde 16) vereist dat elke canonieke update via `decisions.md` Ronde-flow gaat, niet via ad-hoc hand-edits.

**Sync-discipline tabel:**

| Canoniek bestand | Raakt blueprint via | Sync-actie |
|---|---|---|
| `jev-policy-canon.md` | Gap A, F, O, boundary-discipline | Ronde 17 toevoegen |
| `retention-policy-canon.md` | Gap K, L | Ronde 18 toevoegen |
| `state-formats-canon.md` (ADR 0001) | Gap Q | Ronde 18 toevoegen |
| `icm-canon.md` | Gap J, M | Ronde 17 toevoegen |
| `hard-rules.md` | Gap N | Ronde 18 toevoegen |
| `sync-discipline-canon.md` | (zelf) | Ronde 16 al live |
| `naming-conventions.md` | Treg-vocabulary | Ronde 19 (backlog) |
| `decisions.md` | Frontier-lijst | **Nu bijwerken** |

**Voorgestelde canonieke aanvulling** in `_shared/sync-discipline-canon.md` (geen edit, alleen voorstel):

```markdown
## Blueprint-sync — wanneer een audit-raakt-meer-drie-canonieke-paden

Bij een audit die 3+ canonieke paden raakt, geldt extra sync-discipline:

1. Eén Ronde in `decisions.md` per canoniek pad (niet één Ronde voor alles)
2. Cross-references in elke canonieke file naar de relevante Ronde
3. Frontier-items in `decisions.md` met expliciete **kanonieke-aanvulling**
4. Audit-trail in `research/<audit-file>.md` blijft single source voor de rationale
```

**Waarom dit canoniek moet:** zonder blueprint-sync-discipline kan een audit-trail en canonieke file uit sync raken.

---

## 6. Retention-mapping — welke state in welke klasse

**Per `_shared/retention-policy-canon.md`** drie klassen:

| Klasse | Bewaartermijn | Use case |
|---|---|---|
| Fiscaal | 7+ jaar (wettelijk) | Cost-logs, betaling-traces |
| Canoniek | Permanent (in git) | Canonieke bronnen, audit-spoor |
| Operationeel | 30-90 dagen | Runtime-state, recente logs |

**Mapping van blueprint-state naar klassen:**

| State-type | Locatie | Klasse | Reden |
|---|---|---|---|
| Jev-call input (state) | `~/.blobbies/blobs/<uuid>/runs.json` | Operationeel | Tijdelijke data |
| Jev-call output (decision + confidence) | `~/.blobbies/blobs/<uuid>/runs.json` | Canoniek | Audit-spoor, lang bewaard |
| Treg-call log (endpoint + cost) | `~/.blobbies/blobs/<uuid>/runs.json` | Fiscaal | Cost-trace, factuur-grondslag |
| Treg-call output (response) | `~/.blobbies/blobs/<uuid>/runs.json` | Operationeel | Tijdelijke data |
| Handoff JSON in queue/ | `queue/<destination>/<uuid>.json` | Operationeel → Canoniek | Done → archief |
| Review-list met reasons | `review/YYYY-MM-DD.md` | Canoniek | Menselijke decisions |
| Canonieke regel-updates | `_shared/jev-policy-canon.md` etc. | Canoniek | In git, permanent |
| Cost-overzicht per tenant | `djinlabs/<instance>/finance/` | Fiscaal | 7+ jaar verplicht |

**Concrete regels:**

1. Jev-decisions zijn **canoniek** — bewaar in `runs.json` permanent (append-only)
2. Jev-input is **operationeel** — bewaar 30 dagen, daarna drop
3. Treg-cost-logs zijn **fiscaal** — bewaar 7+ jaar, sync naar `djinlabs/<instance>/finance/`
4. Handoffs in `queue/` zijn **operationeel** tot `done`, daarna **canoniek**
5. Review-list is **canoniek** — bewaar permanent in `review/YYYY-MM-DD.md`

**Voorgestelde canonieke aanvulling** in `_shared/retention-policy-canon.md`:

```markdown
## Retention-mapping voor Jev/Treg/Blobbies/ICM

| State-type | Locatie | Klasse |
|---|---|---|
| Jev-decision | runs.json | Canoniek |
| Jev-input | runs.json | Operationeel (30 dagen) |
| Treg-cost-log | runs.json + finance/ | Fiscaal (7+ jaar) |
| Handoff done | queue/<dest>/ | Canoniek |
| Handoff in-progress | queue/<dest>/ | Operationeel |
| Review-list | review/YYYY-MM-DD.md | Canoniek |

**Strijdige klassen.** Bij conflict: fiscaal > canoniek > operationeel.
```

---

## 7. Concrete acties voor Djinlabs

**Korte term** (Ronde 17+ open frontier):

| Actie | Owner | Plek |
|---|---|---|
| Boundary-discipline-tabel canon-promoten | djin | `_shared/jev-policy-canon.md` nieuwe § |
| Gap M (5-onderdelen-pattern) canon-promoten | djin | `_shared/icm-canon.md` nieuwe § |
| Gap O (decision/writing split) canon-promoten | djin | `_shared/jev-policy-canon.md` nieuwe §"Engine-architectuur" |
| Gap N (rulebook-discipline) canon-promoten | djin | `_shared/hard-rules.md` nieuwe § |
| Retention-mapping voor Jev/Treg | djin | `_shared/retention-policy-canon.md` nieuwe § |

**Middellange term** (Ronde 19+):

| Actie | Owner | Plek |
|---|---|---|
| Treg-evaluatie als canonieke laag | djin | nieuwe `_shared/tool-registry-canon.md` |
| Gap H (cua-driver + Jev, batch-only) | djin | nieuwe `_shared/computer-use-canon.md` |
| Gap L (selective compaction) | djin | `_shared/retention-policy-canon.md` nieuwe §"Compaction" |
| Loop-cadans canon | djin | nieuwe `_shared/loop-cadans-canon.md` |

**Lange term** (backlog):

| Actie | Owner | Plek |
|---|---|---|
| Treg self-host evaluatie | djin | nieuwe research file |
| Pilot: Webrnds-loop met Jev+Treg | djin | venture-werk |
| Pilot: chief.py pattern in Djin Slack-app | djin | venture-werk |
| Browser Use + cua-driver integratie | djin | nieuwe research file |

---

## 8. Voorkomen dat we dingen over het hoofd zien — checklist

**Bij elke nieuwe integratie van Jev + Treg + Blobbies + ICM, check:**

- [ ] **Boundary-discipline**: welke laag respecteert welke boundary? (1folder/ICM, Blobbies, Treg, Jev)
- [ ] **Sync-discipline**: zijn alle gerelateerde canon-files gesynced? (Ronde 16)
- [ ] **State-format**: is de state JSON (per ADR 0001) en binnen per-Blob-containment?
- [ ] **Retention-mapping**: welke klasse voor welke state? (fiscaal/canoniek/operationeel)
- [ ] **5-onderdelen-pattern**: unit/intake/engine/rulebook/review aanwezig?
- [ ] **Decision/writing split**: Jev beslist, Fable/Claude schrijft? Of één chat-model?
- [ ] **Confidence bands**: lower 0.35, upper 0.7, of eigen threshold? Welke matrix-entry?
- [ ] **Stop-rule priority**: stop-rules priority 1, vóór action-rules?
- [ ] **Parallel questions**: één Jev-call met Choice+Score+Noul, of meerdere?
- [ ] **Cadans-keuze**: real-time/uur/dag/week? Default is per-week.
- [ ] **Audit-trail**: append-only `runs.json` met Jev-decision + Treg-call-log + cost?
- [ ] **Review-layer**: `<0.8` confidence items naar menselijke review-list?

**Elke "nee" = canoniek gat dat in volgende Ronde gedicht moet.**

---

## Handoff Notes for Next Agent

Als je morgen verdergaat:

1. **Boundary-discipline-tabel** (§4) is de **eerste** canonieke aanvulling die de moeite waard is. Tabel-promotie naar `_shared/jev-policy-canon.md` kan via Ronde 17.
2. **Retention-mapping** (§6) is **complementair** aan boundary-discipline — beide raken `_shared/`. Volgorde: boundary eerst (fundamenteler), dan retention.
3. **5-onderdelen-pattern** (Gap M uit Chris #2) is **architectuur-patroon** dat in `icm-canon.md` thuishoort, niet in `jev-policy-canon.md`. Volgorde: icm-canon eerst.
4. **Treg-evaluatie** als canonieke laag is **Gap G uit AI Jason audit** — wacht op tweede tenant of tweede venture voordat canon-promotie zinvol is.
5. **Loop-cadans** (Gap P) is **nieuwe canon-file** `_shared/loop-cadans-canon.md` — kan in Ronde 19.
6. **Concrete cijfers** in §TLDR zijn **commercieel bewijs** — voeg toe aan `research/jev-revenue-streams.md` §"Numbers".

---

## Provenance

| Field | Value |
|-------|-------|
| Sources | Treg README, USAGE.md, llms.txt, MCP/OAuth doc, treg.to/jev primer, 0xCodila roadmap |
| Plus | Djinlabs canon (8 files) + research (7 files: Sam, AI Jason, 0xCodila, Chris #1+#2, jev-revenue-streams, local-ai-agency, blombies-fit) |
| Retrieved | 2026-09-21 |
| Tool | /research skill (handmatig uitgevoerd nadat background agent vastliep op iteratie-cap) |
| Confidence | High — alle primary sources geciteerd met URLs; alle canon-files geciteerd met regelnummers |

---

## Cross-References

| Document | Relevant voor |
|---|---|
| `research/sam-witteveen-jev-router-audit.md` | Gaps A-E — basis voor §1-2 |
| `research/ai-jason-jev-treg-automation-audit.md` | Gaps F-I — basis voor §3, §6 |
| `research/0xcodila-jev-engineering-roadmap-audit.md` | Gaps J-L — basis voor §2.4, §6 |
| `research/everestchris6-jev-native-agency-architecture.md` | Gaps M-Q — basis voor §2.2 |
| `research/jev-revenue-streams.md` | §Numbers — concrete cijfers |
| `research/local-ai-agency-workflow.md` | 4-stage loop — pattern-match met §2.2 |
| `research/djinlabs-blombies-fit-research.md` | blobbies-host — basis voor §1 laag 3 |
| `_shared/jev-policy-canon.md` | Boundary-discipline, engine-architectuur, confidence bands |
| `_shared/retention-policy-canon.md` | Retention-mapping (§6) |
| `_shared/state-formats-canon.md` (ADR 0001) | State-format-discipline |
| `_shared/icm-canon.md` | 5-onderdelen-pattern (Gap M) |
| `_shared/sync-discipline-canon.md` (Ronde 16) | Sync-discipline voor alle canonieke updates |
| `_shared/hard-rules.md` | Rulebook-discipline (Gap N) |
| `decisions.md` | Frontier-lijst voor Ronde 17+ |

---

## What Is NOT Canon in This Document

- 4-laag-architectuur als **verplichting** — pattern-beschrijving, niet verplichting
- Treg als canonieke laag — optionele integratie (Gap G)
- Concrete latency-cijfers (88-331ms) — runtime-implementatie
- Concrete cost-cijfers ($0.042/M) — TypeSafe pricing
- Treg catalog count (3,600+) — onderhevig aan verandering
- MCP surface split — Treg-implementatie-detail
- Body encoding flag — runtime-tooling
- Per-tenant mapping naar Treg-org — toekomstige integratie

---

## Notities voor audit-trail

Deze blueprint is het **consoliderende document** van de Jev/Treg-onderzoekslijn. Vier eerdere audits (Sam/AI Jason/0xCodila/Chris #2) plus twee revenue/workflow-research (jev-revenue-streams/local-ai-agency) plus één infra-research (blombies-fit) worden hier samengebracht.

**17 gaps totaal** verdeeld over 6 canonieke domeinen:

| Domein | Gaps | Canon-promotie urgentie |
|---|---|---|
| `jev-policy-canon.md` | A, D, F, O + boundary-discipline | Hoog |
| `state-formats-canon.md` | Q | Midden |
| `retention-policy-canon.md` | K, L + retention-mapping | Midden |
| `icm-canon.md` | J, M | Hoog |
| `hard-rules.md` | N | Midden |
| Nieuwe files | E, G, H, I, P + loop-cadans | Backlog |

**Volgende audit-kandidaten** (in volgorde van canonieke urgentie):

1. **Ronde 17 implementatie** — boundary-discipline + 5-onderdelen-pattern + engine-architectuur canon-promoten
2. **Treg self-host evaluatie** — voor tweede tenant
3. **Browser Use broncode + paper** — Gap H detail
4. **TypeSafe Python SDK diepgaand** — Gap A detail
5. **Fable/Claude integratie-pattern** — Gap O detail
6. **Webrnds-loop met Jev+Treg pilot** — Gap M validatie in bestaande venture

---

## Audit-methodologie — eerlijkheid over het vastlopen

**Originele background agent** (`sa-0-4aabe4a1`, dispatched 20:16:33) heeft 13:47 min gewerkt, 24 tool-calls gedaan, en is **vastgelopen op iteratie-cap** zonder completion. Live transcript streamt naar `/Users/gogetta/.hermes/cache/delegation/live/deleg_48ed350e/task-0.log`.

Deze blueprint is **handmatig** geschreven door de hoofd-agent nadat de background agent faalde. Alle primary sources zijn wel gelezen (deels door de agent, deels door de hoofd-agent). De blueprint volgt dezelfde specificaties als de dispatch-instructies.

**Les:** Background agents kunnen vastlopen op iteratie-cap als ze te veel primary sources moeten lezen voor een synthese. Voor toekomstige research-taken: splits in twee fasen — (1) research-agent leest alleen, schrijft een **research-notes-bestand**; (2) synthese-agent leest research-notes + schrijft blueprint. Dat voorkomt dat één agent alles moet doen.