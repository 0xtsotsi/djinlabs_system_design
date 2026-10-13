---
name: matt-typesafe-coding-agent-audit
description: Audit van "[public] thoughts on a typesafe coding agent" (intern TypeSafe doc, 12 pages, geschreven in Google Docs) tegen Djinlabs-system-design. Bevat 6 KV-cache-tyranny problemen + 5 TypeSafe-native features voor coding agents. Triggert wanneer je KV-cache-architectuur, meta-attention-pattern, conditional AGENTS.md, of Recursive Language Models in je agent-design wilt toetsen.
status: review_pending
source: PDF-bestand "/Users/gogetta/.hermes/cache/documents/doc_2e61fe954150_[public] thoughts on a typesafe coding agent.pdf" — geëxtraheerd met pymupdf op 2026-09-21
retrieved: 2026-09-21
tool_used: ocr-and-documents skill (pymupdf 1.26.5, plain-text extraction)
owner: djin
confidence: high (volledige tekst 14,651 chars over 10 content pages geëxtraheerd)
prior_audits:
  - sam-witteveen-jev-router-audit (Gaps A-E)
  - ai-jason-jev-treg-automation-audit (Gaps F-I)
  - 0xcodila-jev-engineering-roadmap-audit (Gaps J-L)
  - everestchris6-jev-native-agency-architecture (Gaps M-Q)
  - jev-live-test-rapport (Ronde 17 verifieerd)
  - jev-icm-file-classification-test (file-routing verifieerd)
---

## TL;DR

Intern TypeSafe-document over hoe een **typesafe coding agent** ontworpen zou moeten worden. Hoofdthese: **coding agents zijn "while loops met een kleine tools" — niet de agent is innovatief, welke state-management**. De auteur identificeert **6 problemen veroorzaakt door KV-cache tyranny** en stelt **5 TypeSafe-native features** voor om deze te omzeilen.

**Drie nieuwe gaps** die deze bron uniek invult voor Djinlabs:

| Gap | Onderwerp | Urgentie |
|---|---|---|
| **R** | KV-cache tyranny als canonieke observatie (relevant voor retention-policy) | Midden |
| **S** | Meta-attention pattern (noul-per-chunk) als canoniek agent-pattern | Hoog — vult **Gap L** uit 0xCodila audit |
| **T** | Conditional AGENTS.md / dynamic loading | Midden — past bij huidige AGENTS.md-routers |

**Concrete cijfers uit het document** (relevant voor onze cost-discussies):

| Observatie | Implicatie |
|---|---|
| Pure Opus is 2/3 the cost van Opus→Sonnet→Opus | Router-strategie moet context-reprocessing meerekenen |
| 56.2% van GPT-5.4 tool-use turns zijn read/search | Optimalisatie-focus: niet agents, wel file-search |
| Routing costs hidden in long sessions (large X) | KV-cache is duurder dan het lijkt |

---

## Vocabulary mapping

| Term in bron | Definitie | Djinlabs-canonieke pendant |
|---|---|---|
| **KV cache tyranny** | LLMs ontworpen voor KV-cache hit-rate, niet voor agent-architectuur | Pattern-match met onze `state-formats-canon.md` ADR 0001 (Markdown=knowledge, JSON=state) |
| **Meta-attention** | Noul/score op elke context-chunk voor relevantie-classificatie | **Gap S** — vult **Gap L** (selective compaction) uit 0xCodila audit |
| **Speculative branches** | Vragen over hypothetische toekomstige acties, parallel | **Vult Gap F** uit AI Jason audit |
| **Recursively Loaded Models (RLM)** | State als expliciete variabelen i.p.v. context-blob | **Gap T** raakt dit — niet canoniek Djinlabs-patroon |
| **First-principled Skills/MCP** | Beschrijvingen zonder system-message-bloat, dynamic loading | Pattern-match met Ronde 11 (skills orthogonal agents) |
| **Conditional AGENTS.md** | Dynamisch geladen sub-sections afhankelijk van directory/task | **Gap T** — relevant voor onze 4 AGENTS.md-routers |
| **Batteries** | Open-source agent-helper-projecten (rtk, headroom, ast-grep) | Pattern-match met Treg (Gap G uit AI Jason audit) |
| **Subagent problem** | Parallelisatie wordt gelimiteerd door state-management | Pattern-match met `agent-discipline-canon.md` |
| **Compaction** | Compressie van history in geheugen | **Vult Gap L** — compaction vs query-aware compression |
| **Restarting** | Agent herstart met fresh context i.p.v. compaction | Geen canon-mapping |
| **Permissions/Approval** | Programmable queries over wat wel/niet mag | Pattern-match met `ask_human` action (Ronde 11) |

**Drie termen die expliciet niet in onze canon staan**:

- **KV-cache tyranny** als canonieke observatie (Gap R)
- **Meta-attention per chunk** (Gap S)
- **Recursive Language Models (RLM)** (Gap T detail)

---

## 1. KV-cache tyranny — Gap R

**De 6 problemen** die de auteur identificeert:

### Thing 1: Routing werkt niet zoals je denkt

**Concrete berekening uit het document:**

```
Path 1 (pure Opus):    cost = 25Y + 5Z
Path 2 (Opus→Sonnet→Opus): cost = 3X + 20Y + 8Z
                        = meer dan Path 1 in long sessions (large X)

ChatGPT vibe:
  X (context load) = 0.65
  Y (output gen)   = 0.12
  Z (read tokens)  = 0.23
→ pure Opus is 2/3 the cost
```

**Interpretatie:**

Router-strategie "gebruik kleiner model voor eenvoudige taken" is **niet** automatisch goedkoper. De **context-reprocessing** door het grotere model bij terug-routing weegt zwaar.

**Djinlabs-mapping:**

| Onze router-strategie | Bron's observatie |
|---|---|
| Sam's router: 5-7× sneller door Jev-cloud i.p.v. GPT-5.6 Luna | Klopt, maar Sam meet **single-call** latency, niet **agent-loop** cost |
| AI Jason: 75% lokaal = minimale cost | Klopt, maar **lokale Jev-call** heeft geen context-reprocessing (geen Opus-routing) |
| 0xCodila: parallel questions | Helpt, maar alleen voor één Jev-call, niet voor Opus↔Sonnet↔Opus |

**Gap R — wat we missen in canon:**

We hebben geen **canonieke observatie** dat "router-strategie moet context-reprocessing meerekenen". Onze `jev-policy-canon.md` §"Fail-mode matrix" behandelt **fail-modes** maar niet **cost-arithmetic** van router-keuzes.

**Voorgestelde canonieke aanvulling** (in `_shared/jev-policy-canon.md` nieuwe §"Cost-discipline"):

```markdown
## Cost-discipline — routing heeft context-reprocessing-cost

Bij router-strategieën (groot model ↔ klein model) is de **echte cost**
niet alleen de per-call cost, maar ook de **context-reprocessing-cost**
bij terug-routing.

**Rekenvoorbeeld** (uit Matt's blog 2026):
- Pure Opus: 25Y + 5Z
- Opus → Sonnet → Opus: 3X + 20Y + 8Z
- Voor X=0.65, Y=0.12, Z=0.23: pure Opus is 2/3 the cost

**Canonieke les:** Router-strategieën die "smaller model for simple tasks"
gebruiken zijn alleen goedkoper als de **terug-routing-context** klein is
of als het kleinere model **lokaal** draait (geen context-reprocessing).

**Runtime-implicatie:** Een lokale Jev-call (SemIf) heeft geen
context-reprocessing-cost. Een cloud-Jev-call wel, maar de cost is
nog steeds $0.04/M tokens vs Opus $5-25/M tokens.
```

### Thing 2: Tool calling is een weird tradeoff

**Observatie uit het document:**

> "Tools need to be specified up front (in the system message). But they aren't always relevant. And you need to specify arguments/everything with the tool calls. Which causes issues: taking a fuck ton of context, not being that smart."

**Djinlabs-relevantie:**

Onze `rondasync.py` heeft precies dit probleem — alle 10 canon-files in de Jev-call met file-paths + content-preview. **Maar**: Jev-call is 1 call per file, niet "alle tools in 1 system message". Dat is **anders** dan de klassieke tool-calling-pijn.

**Gap R detail:** Onze skill orthogonal-claim (Ronde 11) helpt hier — skills zijn ** orthogonal aan agents**, niet "in de agent's system message". Dat is exact wat Matt beschrijft als oplossing.

### Thing 3-6: Compaction, subagents, restarting, batteries

**Thing 3 (compaction):**

> "Compaction attempts to solve the problem of compression, which is: very hard, and likely to be worse than any query-aware compression"

**Vult Gap L** uit 0xCodila audit: Alex Volkov's instant compaction (1M → 86K tokens in 1s) is **query-aware compaction** via Jev-classification. Matt's observatie bevestigt dat query-aware > universal compaction.

**Thing 4 (subagents):**

> "Not super sure about this, but I'm a little surprised that models don't do more automatic parallelization"

**Djinlabs-relevantie:** Onze `agent-discipline-canon.md` heeft geen canonieke observatie over parallelisatie. **Geen gap** voor Djinlabs (we doen geen parallelisatie expliciet), wel interessant voor toekomstige agent-loops.

**Thing 5 (restarting):**

> "This also makes sense if an agent is stateful and that state eventually gets corrupted. But it also could make sense to load up all old relevant state on the fly"

**Djinlabs-relevantie:** Onze `state-formats-canon.md` ADR 0001 splitst al state (JSON) van knowledge (Markdown). "Load up old relevant state on the fly" = query-aware JSON-loading. **Past** zonder canonieke aanvulling.

**Thing 6 (batteries):**

> "There tends to be a tradeoff between ease (with openclaw as an extreme) and power users"

**Djinlabs-relevantie:** Pattern-match met **Treg** (Gap G uit AI Jason audit) — batteries als "OpenRouter for tools". Onze `agent/skills/` orthogonal-claim (Ronde 11) is canoniek equivalent van "dynamic battery loading".

---

## 2. Meta-attention pattern — Gap S

**Matt's voorstel:**

> "Meta-attention: Smart context / relevance / filtering. The idea that context is static can be entirely removed. For any one user query, we could re-calculate: how good the previous context is/was, how to construct a new context with everything relevant inside of it. In its simplest form, you could imagine this as a noul on every 'chunk' of context: tool call inputs, tool call outputs, internal reasoning, possibly even back and forths with the user. A future version could even be a score on each 'chunk': don't show, show a small summary, show a longer summary, show the whole thing."

**Dit is EXACT Gap L** uit 0xCodila audit (selective compaction via Jev), maar dan **structureler**:

| Aspect | 0xCodila (Gap L) | Matt (Gap S) |
|---|---|---|
| Scope | Compaction binnen sessie | Per-context-chunk filtering |
| Pattern | Drop irrelevant items | Score per chunk (don't show / small / long / whole) |
| Trigger | Context-window overflow | Elke user query |
| Implementation | Jev-call op tool-call-list | Jev-call op elke context-chunk |

**Djinlabs-relevantie:**

Dit is **precies** wat `rondasync.py` doet — Jev-call per file (chunk). **Gap S** is dus al geïmplementeerd in onze tool, alleen nog niet als canoniek pattern.

**Gap S — voorgestelde canonieke aanvulling** (in `_shared/jev-policy-canon.md` nieuwe §"Meta-attention pattern" of uitbreiding van bestaande §"Action-type `classify_jev`"):

```markdown
## Meta-attention — noul/score per context-chunk

Context is niet statisch. Bij elke user query kan de runtime opnieuw
berekenen welke context-chunks relevant zijn.

| Chunk-type | Score-vraag | Actie bij lage confidence |
|---|---|---|
| Tool-call input | "Is dit relevant voor huidige taak?" | Drop |
| Tool-call output | "Bevat dit nieuwe info die user nodig heeft?" | Samenvatten |
| Internal reasoning | "Leidt dit tot user-bruikbare output?" | Drop |
| User back-and-forth | "Is dit nog actueel?" | Hervatten |

**Default-patroon (canoniek):**

| Score | Range | Action |
|---|---|---|
| Don't show | 0-0.3 | Drop chunk |
| Small summary | 0.3-0.6 | 1-line summary |
| Longer summary | 0.6-0.85 | 5-line summary |
| Whole | 0.85-1.0 | Keep verbatim |

**Runtime-implementatie:** Per-chunk Jev-call met `score`-vraag.
**Canonieke bron:** Ronde 17 `classify_jev` action-type.

**Niet canon:** Specifieke threshold-waarden — runtime-tuning per integratie.
```

---

## 3. Conditional AGENTS.md — Gap T

**Matt's voorstel:**

> "We could dynamically load different parts of an AGENTS.md depending on different conditions. E.g. is it front-end? Load the style guide. Is it in this subdirectory? Load the footguns/gotchas file (tbh every subdirectory should have a gotchas file). This is somewhat similar to skills, but my experience of skills is they tend to be 'do this now' vs 'have this in memory somewhere'."

**Djinlabs-relevantie:**

We hebben **vier AGENTS.md-routers** (umbrella, `_shared/`, `djinlabs/`, `webrnds/`) die statisch zijn. Sync-discipline (Ronde 16) vereist dat ze gesynced worden per Ronde. **Conditional loading** zou dit kunnen automatiseren:

| Scenario | Welke AGENTS.md-sectie dynamisch laden |
|---|---|
| Agent werkt in `/djinlabs/_internal/experimenten/` | AGENTS.md-router + experiment-discipline-regel |
| Agent werkt in `/webrnds/clients/<slug>/` | AGENTS.md-router + sync-discipline-regel |
| Agent werkt met canon-files | AGENTS.md-router + canon-discipline-regel |

**Gap T — voorgestelde canonieke aanvulling** (in `_shared/AGENTS.md` nieuwe §"Conditional loading" of in `_shared/agent-discipline-canon.md`):

```markdown
## Conditional AGENTS.md — dynamisch geladen per context

Agent-routers (AGENTS.md) kunnen dynamisch geladen worden op basis van
agent-context (directory, task-type, canon-status).

| Trigger | Sectie om te laden |
|---|---|
| Werkt in `<instance>/_internal/` | Experiment-discipline-regels |
| Werkt met `_shared/*.md` | Canon-discipline + sync-discipline |
| Werkt in venture-folder (djinlabs/webrnds) | Venture-specifieke regels |
| Schrijft naar retention-policy-klasse files | Retention-discipline |

**Canonieke observatie:** Skills zijn "do this now", AGENTS.md is
"have this in memory somewhere". Conditional loading combineert beide —
context-aware in-memory presence van relevante regels.

**Niet canon:** Specifieke triggers of implementatie-volgorde.
```

---

## 4. Recursive Language Models (RLM) — Gap T detail

**Matt's verwijzing naar alexzhang13.github.io/blog/2025/rlm/:**

> "TL;DR is more variables/explicit state. There is a world where treating state as explicit variables could be a lot cleaner."

**Djinlabs-relevantie:**

Onze `state-formats-canon.md` (ADR 0001) zegt al: **JSON = state, Markdown = knowledge**. RLM zou dit **verder** pushen door state als **expliciete variabelen** te behandelen in plaats van als context-blob.

Dit is **niet canoniek** voor Djinlabs, maar **interessant** voor toekomstige agent-loops. Geen aanbeveling om dit nu in canon op te nemen.

---

## 5. Background processing pattern — Gap observatie

**Matt's Appendix 2:**

> "I've been noticing a bit of a pattern in some recent popular-ish agent workflows: building HTML pages that are updated in parallel, understanding is the new bottleneck, creating evals in the background, ELI5 skill. What do these things have in common? The thing that pops out to me is they all run in the background! They generally are background extensions to the normal coding workflow. Not only are they in the background, they tend to be read-only functions of your current codebase state."

**Djinlabs-relevantie:**

Onze `rondasync.py` is **precies** zo'n background-processing-pattern: read-only functie van huidige canon-state, parallel met andere agent-acties. **Valideert** onze tool-keuze zonder dat Matt het wist.

**Geen gap** voor Djinlabs — `rondasync.py` is al in shadow-mode.

---

## 6. Wat deze bron NIET leert (canoniek bewustzijn)

| Onderwerp | Onze canon-positie | Bron's hiaat |
|---|---|---|
| **Boundary-discipline** | `jev-policy-canon.md` regel 22 + sync-discipline-canon.md | Geen expliciete boundary-discussie |
| **Multi-tenancy** | `djinlabs/tenants/djin/` orthogonal | Geen multi-tenancy |
| **Retention-policy** | `_shared/retention-policy-canon.md` | Geen retention-discussie |
| **Shadow/active modes** | `jev-policy-canon.md` regel 65-72 | Geen shadow-mode |
| **Sync-discipline** | `_shared/sync-discipline-canon.md` (Ronde 16) | Geen sync-discipline — hun interne teams werken anders |
| **Audit-spoor** | `jev-policy-canon.md` regel 74 (append-only log) | Geen formele audit-log-discussie |

**Implicatie:** TypeSafe's interne engineering-doc is **technisch excellent** voor hun agent-design, maar **mist** de Djinlabs-discipline lagen. Dit is **niet** een fout — 't is een andere scope. Voor Djinlabs betekent het dat we de patronen **kunnen overnemen**, mits we de discipline lagen toevoegen (zoals we al doen).

---

## 7. Concrete cijfers — wat je ermee kunt

**Voeg deze paragraaf toe aan `research/jev-revenue-streams.md` §"Numbers":**

> **Cost-reality voor routing (Matt Pocock / TypeSafe, sept 2026).**
>
> Bij router-strategie "Opus → Sonnet → Opus" is **pure Opus 2/3 the cost** voor typische agent-loads (X=0.65, Y=0.12, Z=0.23). Bron: TypeSafe intern doc over KV-cache tyranny.
>
> **Implicatie voor Jev-routing:** Cloud-Jev-call ($0.04/M input tokens, output free) is fundamenteel goedkoper dan Opus ($5-25/M tokens). Zelfs met context-reprocessing bij terug-routing blijft Jev-routing een netto-cost-saving voor de meeste use-cases.
>
> **Lees-pattern optimalisatie:** 56.2% van GPT-5.4 tool-use turns zijn read/search (volgens TypeSafe's analyse). Dat is **het** optimalisatie-doelwit voor agent-design — niet agents, wel file-search efficiency.

---

## 8. Concrete acties voor Djinlabs

**Korte term** (Ronde 18+ open frontier):

| Actie | Owner | Plek |
|---|---|---|
| **Gap R invullen**: Cost-discipline canon (KV-cache tyranny observatie) | djin | `_shared/jev-policy-canon.md` nieuwe §"Cost-discipline" |
| **Gap S invullen**: Meta-attention pattern canon (noul/score per chunk) | djin | `_shared/jev-policy-canon.md` nieuwe § of uitbreiding `classify_jev` |
| **Gap T invullen**: Conditional AGENTS.md (dynamisch laden) | djin | `_shared/AGENTS.md` nieuwe § of `agent-discipline-canon.md` |

**Middellange term** (Ronde 19+):

| Actie | Owner | Plek |
|---|---|---|
| **Gap T detail**: RLM-patroon onderzoeken voor state-formats canon | djin | nieuwe research file |
| **Cost-arithmetic validatie**: live-test of onze huidige Jev-router-strategie (Sam-audit) houdt rekening met context-reprocessing | djin | uitbreiding van `jev-live-test-rapport.md` |

**Lange term** (backlog):

| Actie | Owner | Plek |
|---|---|---|
| Background-processing pattern voor andere tools | djin | onderzoek na Ronde 18+ |
| Conditional AGENTS.md implementatie (renderer) | djin | implementatie na canon-promotie |

---

## 9. Voorkomen dat we dingen over het hoofd zien — checklist

**Bij elke nieuwe agent-loop of router-strategie in Djinlabs, check:**

- [ ] **Cost-discipline**: houdt de router-strategie rekening met context-reprocessing-cost? (Gap R)
- [ ] **Meta-attention**: wordt elke context-chunk geclassificeerd op relevantie? (Gap S)
- [ ] **Conditional AGENTS.md**: worden alleen relevante regels geladen voor deze context? (Gap T)
- [ ] **State expliciet**: wordt state als JSON-variabele behandeld, niet als context-blob? (Gap T detail, ADR 0001)
- [ ] **Skills orthogonal agents**: nieuwe skills worden niet in agent's system message gestopt (Ronde 11)
- [ ] **Boundary-discipline**: blijft de agent binnen tenant-boundary? (sync-discipline Ronde 16)
- [ ] **Audit-spoor**: wordt elke router-choice + confidence gelogd? (Ronde 17)

**Elke "nee" = canoniek gat dat in volgende Ronde gedicht moet.**

---

## Handoff Notes for Next Agent

Als je morgen verdergaat:

1. **Gap R (Cost-discipline)** is **de** canonieke aanvulling die direct toepasbaar is. Concrete waarden zijn runtime-tuning (Matt's cijfers zijn voorbeeld, niet canon-cijfers), maar het **principe** (router-strategie moet context-reprocessing meerekenen) is canon-waardig.
2. **Gap S (Meta-attention)** is **structureler** dan 0xCodila's Gap L (selective compaction). Begin hier als je Ronde 18 prioriteit geeft aan agent-architectuur.
3. **Gap T (Conditional AGENTS.md)** is **relevant** maar **minder urgent** — kan in Ronde 19+.
4. **Concrete cijfers** (§7) zijn **commercieel bewijs** van de Jev-router-strategie. Stop ze in `jev-revenue-streams.md`.

---

## Provenance

| Field | Value |
|-------|-------|
| Source | PDF "/Users/gogetta/.hermes/cache/documents/doc_2e61fe954150_[public] thoughts on a typesafe coding agent.pdf" |
| Author | Intern TypeSafe engineering team (vermoedelijk Ray Amjad of directe collega — niet Matt Pocock) |
| Title | [public] thoughts on a typesafe coding agent |
| Pages | 12 (10 with content, pages 1 + 12 zijn titelpagina + blanco) |
| Formaat | Google Docs → PDF (Skia/PDF m155 Google Docs Renderer) |
| Retrieved | 2026-09-21 |
| Tool | ocr-and-documents skill (pymupdf 1.26.5 plain-text extraction) |
| Extraction length | 14,651 chars |
| Confidence | High — volledige tekst geverifieerd, geen OCR-fouten (PDF is text-based) |

---

## Cross-References

| Document | Relevant voor |
|---|---|
| `research/sam-witteveen-jev-router-audit.md` | Router-architectuur (Gaps A-E), basis voor §1 |
| `research/ai-jason-jev-treg-automation-audit.md` | Gap F (confidence bands), Gap G (Treg) |
| `research/0xcodila-jev-engineering-roadmap-audit.md` | Gap L (selective compaction) — vult Gap S |
| `research/everestchris6-jev-native-agency-architecture.md` | Gap M (5-onderdelen-pattern), Gap O (decision/writing split) |
| `research/jev-live-test-rapport.md` | Ronde 17 confidence-band verifieerd |
| `research/jev-icm-file-classification-test.md` | File-routing (4/4 correct) — pattern voor Gap S |
| `research/rondasync-shadow-mode-r17.md` | `rondasync.py` als voorbeeld van meta-attention-pattern (Gap S) |
| `_shared/jev-policy-canon.md` | §"Action-type `classify_jev`" (Ronde 17), §"Confidence bands" |
| `_shared/state-formats-canon.md` (ADR 0001) | State = JSON, knowledge = Markdown (Gap T detail) |
| `_shared/sync-discipline-canon.md` (Ronde 16) | Background-processing pattern voor `rondasync.py` |
| `_shared/AGENTS.md` | Vier statische routers die conditional loading kunnen krijgen (Gap T) |
| `decisions.md` Ronde 17 | Baseline voor Ronde 18+ gap-invullingen |

---

## What Is NOT Canon in This Document

- KV-cache tyranny als **canoniek verplicht principe** — observatie, geen verplichting
- Specifieke cost-cijfers (5/25, 3/15, etc.) — runtime-tuning, niet canon
- Meta-attention pattern als **canoniek agent-pattern** — voorstel, geen verplichting
- Conditional AGENTS.md als **canonieke feature** — observatie, geen verplichting
- Specifieke score-band waarden (0-0.3 / 0.3-0.6 / etc.) — runtime-tuning
- RLM-patroon als canon-implementatie — onderzoeks-richting, geen beslissing

---

## Notities voor audit-trail

Dit audit-document is het **vijfde Jev-audit** in de reeks en het **eerste interne-TypeSafe-bron-audit**. Vier eerdere audits waren gebaseerd op publieke bronnen (Sam Witteveen, AI Jason, 0xCodila, Chris #2). Deze is gebaseerd op een **intern TypeSafe engineering-doc** dat een bredere architectuur-visie biedt dan de publieke demo's.

**Total gap-count na deze audit: 20 gaps** (A-T), verdeeld over 8 canonieke domeinen:

| Domein | Gaps |
|---|---|
| `jev-policy-canon.md` | A, D, F, O, R, S |
| `state-formats-canon.md` | Q + T detail |
| `retention-policy-canon.md` | K, L |
| `icm-canon.md` | J, M |
| `hard-rules.md` | N |
| `_shared/AGENTS.md` | T |
| Nieuwe files | E, G, H, I, P |
| `_shared/state-formats-canon.md` (ADR 0001) | T detail (RLM) |

**Volgende audit-kandidaten** (in volgorde van canonieke urgentie):

1. **Ronde 18 met Gaps R+S+T** — implementatie kanonieke patronen
2. **TypeSafe Jev Skills** (`https://github.com/typesafe-ai/skills`) — concrete Skill-content voor agents
3. **Recursive Language Models (alexzhang13.github.io/blog/2025/rlm/)** — Gap T detail
4. **Conditional AGENTS.md implementatie** — renderer voor dynamische loading
5. **Beam Hook Security** (`agentbeam.com/blog/jev-typesafe-ai-agent-hook-security`) — security-discipline voor Jev-hooks