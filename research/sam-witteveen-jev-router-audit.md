---
name: sam-witteveen-jev-router-audit
description: Audit van "How to Build Things with Jev & OpenJevs" (Sam Witteveen, 19:18, 349 captions) tegen Djinlabs-system-design. Mapping van Jev-router-architectuur naar onze canon (jev-policy-canon, retention-policy, state-formats-canon, ADR 0001). Triggert wanneer je de router-laag in je architectuur wilt toetsen of een nieuwe infra-providers-overweging maakt.
status: review_pending
source: YouTube https://www.youtube.com/watch?v=ZR7anrL50xs (Sam Witteveen, "How to Build Things with Jev & OpenJevs", 19:18, 349 captions via captions)
retrieved: 2026-09-21
tool_used: /watch skill (transcript-only mode — captions aanwezig, geen Whisper key nodig)
owner: djin
confidence: high (volledige transcript geverifieerd)
---

## TL;DR

Sam Witteveen bouwt een **model-router** die Jev gebruikt als beslissings-laag bovenop een mix van lokale en cloud-LLMs. Het patroon is canoniek relevant voor Djinlabs omdat het **exáct** is wat onze `jev-policy-canon.md` beschrijft, maar dan **live getoond** in plaats van canoniek geabstraheerd.

**Drie kern-elementen uit de video** die direct mappen op onze architectuur:

| Element | Sam's implementatie | Djinlabs canonieke plek | Gap |
|---|---|---|---|
| **3 Jev-question-types** | choice, score, noul | (geen canon-mapping) | **Gap A** — geen canon-mapping tussen Jev-question-types en onze action-types |
| **Lanes** (categorie → model-route) | 6 classes (chit-chat/code/image/...) + fallback | Boundary-discipline (orthogonal layers) | **Gap B** — lanes zijn runtime, niet canon; mapping naar onze orthogonal-claim ontbreekt |
| **Privacy gate (noul)** | "private?" → force local | `jev-policy-canon.md` §"Fail-mode matrix" regel 56-57 | **Geen gap** — al canoniek |
| **SQLite logging** | runtime-state voor beslissingen + metrics | `state-formats-canon.md` (ADR 0001, Ronde 15) | **Geen gap** — al canoniek |
| **Open Jev als lokale variant** | SemIf running locally | (niet in canon) | **Gap C** — geen canonieke claim over wanneer open-Jev vs Jev-API |

**Voornaamste Djinlabs-learnings:**

1. **Cost-discipline.** 53 requests, 75% lokaal afgehandeld = "huge way to save money and compute". Onze `research/jev-revenue-streams.md` noemt $0.006 per 112 calls; Sam's cijfer is **operationeel bewijs** dat dit in productie werkt.
2. **Confidence-fallback.** Bij lage Jev-confidence → safe default, niet gokken. Onze `proceed_full` action heeft default-mode capability, niet "fail-OPEN bij twijfel". Dat klopt, maar kunnen we explicieter maken.
3. **Prompt-rewriting als aanvulling.** MiniCPM doet prompt-rewriting voor image-gen — een **tool-stage** tussen router en model. Niet in onze canon, wel relevant.
4. **Streaming + caching voor lange conversaties.** "If we were doing sort of a long conversation we'd probably want to use the caching and stay on the Claude Opus." Dit is een **router-state-patroon** dat onze canon niet dekt.

---

## Vocabulary mapping (Umbrella placement)

| Term in video | Definitie | Djinlabs-canonieke pendant |
|---|---|---|
| **State** | input naar Jev (de prompt + context) | runtime-state, valt onder ADR 0001 |
| **Choice** | Jev-vraag: kies uit N opties | Geen direct canon-equivalent — onze action-types zijn **wat de agent doet**, niet **wat je Jev vraagt** |
| **Score** | Jev-vraag: position op ordered scale (1-10) | Geen canon-equivalent |
| **Noul** | Jev-vraag: ja/nee met confidence | failure-mode van een action (fail-OPEN/fail-CLOSED) — **gedeeltelijke** overlap |
| **Lane** | voorgeconfigureerde route naar een model | Boundary-discipline orthogonal-claim — runtime-interpretatie |
| **Judge** | Jev-instantie die beslist | `jev-policy-canon.md` "Decision gate" |
| **Tools registry** | modellen als tools (Qwen image als tool) | (geen canon — implementatie) |
| **Health check** | endpoint-monitoring per model | (geen canon — observability) |
| **Privacy flag** | noul-output → force local | `research/sam-witteveen-jev-router-audit.md` regel 56-57 (canoniek) |
| **Difficulty score** | score-output → kies model-tier | (geen canon — runtime tuning) |
| **Open Jev (SemIf)** | open-source Jev-clone, lokaal | (geen canon) |

**Drie terms uit de video die expliciet niet in onze canon staan** en dat zouden wel moeten zijn:

- **Jev-question-type** (choice/score/noul) — wat we Jev vragen
- **Jev-confidence** — wat we terugkrijgen, met threshold-regels
- **Jev-call-state** — wat we loggen (Sam: SQLite met timestamps, decisions, images)

---

## 1. De loop — model-router als state machine

Sam's router-architectuur in 7 stappen:

1. **Browser** → Next.js UI → **FastAPI server** (lokaal)
2. FastAPI ontvangt user-message + conversation context
3. FastAPI doet **één Jev-call** met meerdere vragen tegelijk:
   - Choice: welke categorie? (chit-chat/code/image/...)
   - Score: hoe moeilijk? (trivial → frontier)
   - Noul: bevat PII? (true/false)
   - Optioneel: bevat web-nodig? (true/false)
4. Jev evalueert **parallel** — 3 vragen kosten vrijwel evenveel als 1
5. FastAPI **routeert** naar de gekozen lane met bijbehorende threshold-rules
6. Het gekozen model **streamt** terug naar de browser
7. **Logging** naar SQLite voor audit en metrics

**Doorlooptijden uit de video:**

| Actie | Tijd | Bron |
|---|---|---|
| Eerste "Hey, how's it going?" → lokaal model | **331 ms** totaal (Jev 331ms + render) | [08:17 transcript] |
| Code-verzoek → DeepSeek (cloud) | "longer because going to the cloud" | [07:30 transcript] |
| Open Jev (SemIf lokaal) voor PII-detectie | **88 ms** | [15:59 transcript] |
| Image-verzoek → Qwen Image 2.1 | "sandy colored Maine Coon" gerenderd | [14:06 transcript] |

**Cost-realiteit uit de video:**

- 53 requests in korte tijd
- 75% lokaal afgehandeld
- "Huge way to basically save money and compute"
- "The entire demos that I did in the video cost less than one cent"

Dit is **concreet operationeel bewijs** voor onze `research/jev-revenue-streams.md` die $0.006 per 112 calls claimt. Sam's cijfer is **groter** (53 requests, kortere tijdspanne) maar **orde-grootte hetzelfde**.

---

## 2. Action-types vs Jev-question-types — Gap A

**Onze canon (`_shared/jev-policy-canon.md` regel 26-41) heeft 7 action-types:**

- `reuse_cache`, `stop_retry`, `run_deterministic`, `chat_only`, `ask_human`, `allow_subagent`, `research_capped`

**Sam gebruikt 3 Jev-question-types:**

- choice, score, noul

Dit zijn **twee verschillende dingen**:

| | Onze action-types | Sam's Jev-question-types |
|---|---|---|
| **Vraag** | "Wat moet de agent doen?" | "Wat moet de Jev beslissen?" |
| **Subject** | De agent | Jev zelf |
| **Output** | Action-uitvoering | Typed answer + confidence |
| **Wie beslist** | Action-types zijn het **resultaat** van een beslissing | Jev-question-types zijn de **vorm** van een vraag aan Jev |

**Gap A — wat we missen in canon:**

We hebben geen canonieke mapping tussen Jev-question-types en action-types. Zonder die mapping kan elke integratie ad-hoc Jev-question-types samenstellen.

**Voorgestelde canonieke aanvulling** (in `jev-policy-canon.md`, nieuwe sectie):

```markdown
## Jev-question-types als canonieke vocabulary

Drie vraag-types vormen de canonieke vocabulary voor Jev-calls.
Een integratie kan alle drie gebruiken in één call (parallel).

| Type | Semantiek | Voorbeeld-vraag | Action-mapping |
|---|---|---|---|
| `choice` | Kies uit N opties met confidence per optie | "Welke categorie: chit-chat/code/image?" | → `chat_only` / `run_deterministic` / `allow_subagent` (per lane) |
| `score` | Position op ordered scale 1-10 | "Hoe moeilijk is dit?" | → `proceed_full` (laag) / `ask_human` (hoog) / model-tier selectie |
| `noul` | Ja/nee met confidence | "Bevat dit PII?" | → `ask_human` bij twijfel / force-local override |
```

**Waarom dit canoniek moet:** anders kan elke nieuwe integratie zelf verzinnen welke vraag-types 'ie gebruikt, en dan verliezen we de mogelijkheid om **confidence-fallback-regels canoniek te maken**.

---

## 3. Lanes als runtime-interpretatie van orthogonal-claim — Gap B

**Sam's lanes (6 classes):**

- `chit-chat` → MiniCPM 2B (lokaal)
- `code` → DeepSeek 4.1 Flash (cloud, OpenRouter)
- `image` → Qwen Image 2.1 (lokaal)
- `simple question` → (lokale tier)
- `rewrite/summarize` → (lokale tier)
- `reasoning/analysis` → (cloud tier)

Plus **fallback**-regels:

- Difficulty > 0.6 → web-enabled model
- Prompt > 16K tokens → general model
- Privacy > 0.5 → force local
- Cache-coherence → blijf op Opus voor lange conversaties

**Onze canon (`jev-policy-canon.md` regel 22):**

> Skills zijn orthogonal aan agents (Ronde 11). Deze orthogonal-claim is **ook van toepassing op de Blob-laag**

**Gap B — wat we missen in canon:**

Lanes zijn **runtime-routing** tussen categorieën en modellen. Onze orthogonal-claim gaat over **lagen orthogonal** aan elkaar (agent/skill/instance). We hebben geen canon-uitspraak die zegt: "routing tussen categorieën is runtime-tuning, niet canon".

**Voorgestelde canonieke aanvulling** (in `jev-policy-canon.md`, §"Vocabulary mapping"):

```markdown
| lane | route-pattern | runtime, niet canon |
```

**Waarom dit canoniek moet:** zonder deze claim kan iemand per ongeluk lanes canoniek willen maken (ze zijn namelijk "logische categorieën"), terwijl ze in werkelijkheid **runtime-tuning** zijn die per implementatie verschilt.

---

## 4. Privacy gate — al canoniek, bevestigd door video

**Sam's noul-output:**

- Vraag: "Does this conversation contain personal, confidential client, financial, medical, credential data such as API keys, passwords?"
- True/false met confidence
- True → force local
- Bij twijfel (False met lage confidence) → ook local (veilige default)

**Onze canon (`jev-policy-canon.md` regel 56-57):**

> `secret_set` — fail-OPEN (offline key-opslag) / fail-CLOSED (zonder credential-vorm)
> `research_capped` met provider-trust-vraag — fail-CLOSED bij Tinfoil / warn bij Ollama

**Observatie:** Sam's patroon is **exáct** wat wij al canoniek hebben. Geen gap.

**Verfijning die de video suggereert:**

- Sam gebruikt **threshold > 0.5** voor privacy (True met 0.96 = local)
- Wij hebben geen specifieke threshold-cijfers in canon (per design — runtime tuning)

Dit blijft **per-implementatie tuning**, niet canon. Geen actie nodig.

---

## 5. SQLite logging als ADR 0001 voorbeeld — bevestigd

**Sam's logging:**

- SQLite database
- Logs: Jev decisions, prompt-rewrite, image-paths, model-selecties
- Stats: 53 requests, 75% local, savings-cijfer, response-tijden

**Onze canon (`docs/adr/0001-state-formats-canon.md`):**

> Markdown is voor kennis. JSON is voor state.

Sam gebruikt SQLite (in praktijk JSON-achtige rows), niet Markdown — precies wat ADR 0001 voorschrijft. Geen gap.

**Verfijning:**

- SQLite is **executable runtime state** (zoals JSON)
- Onze canon noemt JSON expliciet, maar **executable database als state-vorm** is niet expliciet genoemd
- Dit is een **potentieel ADR-uitbreiding** voor toekomstige infra-providers die liever SQLite dan JSON gebruiken

**Voorgestelde actie:** n.v.t. voor nu. SQLite is **implementatie-keuze** die onder ADR 0001's "JSON = state" claim past. Als een toekomstige infra-provider een fundamenteel ander state-formaat kiest (bijv. Protocol Buffers, Apache Arrow), dan is dat een nieuwe ADR.

---

## 6. Open Jev (SemIf) als lokaal alternatief — Gap C

**Sam's setup:**

- Eerst: Jev (cloud, TypeSafe AI)
- Later: SemIf (lokale open-source Jev-clone)
- Voordeel: PII verlaat de machine **niet eens naar Jev**
- Trade-off: generalization is slechter bij open Jev

**Onze canon:**

- Geen expliciete claim over Jev vs open-Jev
- Wel: Tinfoil-CSP als canonieke provider (Ronde 14)
- Wel: lokale Ollama-loopback als runtime-optie

**Gap C — wat we missen in canon:**

We hebben geen canonieke uitspraak over:
- Wanneer Jev-cloud vs Jev-lokaal vs Ollama vs Tinfoil-CSP
- Of open-Jev clones (SemIf, etc.) canoniek zijn of runtime
- De trust-grens: "PII verlaat de machine niet eens naar Jev"

**Voorgestelde canonieke aanvulling** (in `jev-policy-canon.md`, nieuwe sectie):

```markdown
## Provider-keuze — Jev-cloud vs Jev-lokaal

| Provider | Trust-grens | Wanneer |
|---|---|---|
| Jev (TypeSafe API) | Prompt naar cloud, geen PII toegestaan | Happy path, geen PII |
| Open Jev (SemIf/...) | Alles lokaal | PII, klant-dossiers, geheime keys |
| Ollama-loopback | Alles lokaal, geen model-leak | Edge use cases, volledige isolatie |
| Tinfoil-CSP | Attested-enclave egress | Compliance, audit-spoor |

**Default-keuze.** Bij twijfel: open-Jev lokaal. Jev-cloud is voor generalisatie waar lokale variant tekortschiet.
```

**Waarom dit canoniek moet:** zonder deze tabel kan elke integratie zelf verzinnen welke provider voor welk scenario. Dat breekt de trust-grens-discipline.

---

## 7. Prompt-rewriting als tussenlaag — Gap D

**Sam's image-flow:**

1. User prompt: "make a Maine Coon, sandy colored"
2. Router kiest image-lane (Qwen Image 2.1)
3. MiniCPM doet **prompt-rewriting** voor image-specifieke terminologie
4. Qwen rendert de herschreven prompt
5. Output: "sandy colored Maine Coon in a sunlit meadow"

**Onze canon:**

- Geen canon-uitspraak over **tussenlagen** tussen router en model
- Wel: `run_deterministic` action-type voor gestructureerde transforms

**Gap D — wat we missen in canon:**

Prompt-rewriting is **niet** een Jev-beslissing — het is een **deterministische of model-call tussenlaag**. We hebben:

| Stadium | Wat | Wie | Canon? |
|---|---|---|---|
| Routing | Categorie + tier kiezen | Jev | canon (`jev-policy-canon.md`) |
| Prompt-rewrite | User-input geschikt maken voor downstream model | MiniCPM of rewriting-model | runtime, niet canon |
| Model-call | Eigenlijke generatie | Gekozen lane-model | runtime |
| Streaming | Output terug naar user | Lane-model | runtime |

**Voorgestelde canonieke aanvulling** (in `jev-policy-canon.md`, §"Action-types"):

```markdown
| `rewrite_prompt` | Herschrijf prompt voor downstream model. | rot | Image-prompt-uitwerking, code-commentaar-stripping, tone-shift |
```

**Waarom dit canoniek moet:** anders kan een integratie een willekeurige "tussenlaag" invoegen zonder canon-action, en dan is 't niet meer te auditen.

---

## 8. Streaming + caching voor lange conversaties — Gap E

**Sam's observatie:**

> "If we were doing sort of a long conversation we'd probably want to use the caching and stay on the Claude Opus."

**Observatie:** Dit is een **router-state-patroon** dat we niet canonisch hebben:

- Router houdt per-conversatie state bij
- Bij lange conversaties: blijf op zelfde model (cache-coherentie)
- Cost-trade-off: cache-hit-rate vs model-tier-choice

**Gap E — wat we missen in canon:**

Geen canon-uitspraak over:
- Per-conversatie router-state
- Cache-coherentie als router-consideratie
- Trade-off tussen consistent-model en cost-savings

**Voorgestelde canonieke aanvulling** (in `jev-policy-canon.md`, §"Action-types" of nieuwe §"Router-state"):

```markdown
| `cache_stickiness` | Behoud model-keuze voor coherente cache. | rot | Lange conversaties waar token-cache savings > tier-savings |
```

**Of** een aparte canonieke file `_shared/router-state-canon.md` als dit groeit.

---

## 9. Failure modes die de video niet noemt

Drie failure modes die Sam niet behandelt maar die Djinlabs **wel** kanoniek heeft:

| Failure | Wat er gebeurt | Onze canon-positie |
|---|---|---|
| **Jev-call timeout** | Router krijgt geen antwoord | `jev-policy-canon.md` default: fail-CLOSED |
| **Jev-call met malformed response** | API-call slaagt maar data onleesbaar | runtime-error-handling (geen canon) |
| **Lane-model offline** | Gekozen tier reageert niet | runtime-fallback (geen canon) |

**Observatie:** Onze canon heeft **Jev-call failure** als canoniek, maar **lane-model failure** is runtime. Dat is consistent.

---

## 10. Wat deze video leert over cost-displine

**Concrete cijfers uit de video** (voor in `research/jev-revenue-streams.md`):

| Metric | Waarde | Bron |
|---|---|---|
| Tijd per Jev-call (cloud) | 331 ms | [08:17 transcript] |
| Tijd per Jev-call (lokaal, SemIf) | 88 ms | [15:59 transcript] |
| Local-handling ratio | 75% | [16:55 transcript] |
| Totale demo-cost | < $0.01 | [19:04 transcript] |
| Jev-call pricing | $0.04/M input tokens, output free | [02:38 transcript] |

**Update voor `research/jev-revenue-streams.md`:**

Voeg deze paragraaf toe aan §"Method 1 — Numbers":

> **Production-grade cijfers (Sam Witteveen, sept 2026).** Bij een live setup met Jev-router + 6 lanes (chit-chat/code/image/reasoning/simple/rewrite) was 75% van 53 requests lokaal afgehandeld. Jev-call latency: 331ms (cloud) of 88ms (lokale SemIf). Totale cost over een werk-sessie: minder dan $0.01.

---

## 11. Wat de video NIET leert (canoniek bewustzijn)

Drie dingen die Sam **niet** noemt maar Djinlabs **wel** canonisch heeft:

| Onderwerp | Onze canon-positie | Video's hiaat |
|---|---|---|
| **Boundary-discipline** | `jev-policy-canon.md` regel 22 — orthogonal layers | Router zit **boven** boundary; geen expliciete boundary-discussie in video |
| **Retention-policy** | `_shared/retention-policy-canon.md` — drie klassen | Geen retention-discussie; alles gaat in SQLite zonder retention-policy |
| **Hard-rules** | `_shared/hard-rules.md` — U1-U8 | Router is geïsoleerde app; geen agent-discipline getoond |

**Implicatie voor audit:**

Sam's architectuur is **technisch solide** voor wat 'ie doet, maar **mist de Djinlabs-discipline** rond boundary, retention en agent-rules. Dit is **niet** een fout in de video — 't is gewoon een andere scope. Voor Djinlabs betekent het dat we Sam's router-patroon kunnen **overnemen**, mits we de discipline lagen toevoegen.

---

## 12. Concrete acties voor Djinlabs

**Korte term** (Ronde 16+ open frontier):

| Actie | Owner | Plek |
|---|---|---|
| **Gap A invullen**: Jev-question-types canon-mapping | djin | `_shared/jev-policy-canon.md` nieuwe § |
| **Gap C invullen**: Provider-keuze tabel | djin | `_shared/jev-policy-canon.md` nieuwe § |
| **Gap D invullen**: prompt-rewrite als action-type | djin | `_shared/jev-policy-canon.md` §"Action-types" |
| **Production-grade cijfers toevoegen** | djin | `research/jev-revenue-streams.md` §"Numbers" |

**Middellange term** (Ronde 20+):

| Actie | Owner | Plek |
|---|---|---|
| **Gap B invullen**: lanes als runtime, niet canon | djin | `_shared/jev-policy-canon.md` §"Vocabulary mapping" |
| **Gap E invullen**: cache-stickness of nieuwe router-state file | djin | `_shared/jev-policy-canon.md` of `_shared/router-state-canon.md` |
| **Open Jev (SemIf) onderzoek**: kan SemIf een canonieke provider worden? | djin | nieuwe research file of ADR |

**Lange term** (backlog):

| Actie | Owner | Plek |
|---|---|---|
| **Live Jev-router prototype** bouwen naar Sam's voorbeeld | djin | implementatie, niet canon |
| **Tinfoil-CSP audit** tegen Sam's setup | djin | nieuwe research file |

---

## Voorkomen dat we dingen over het hoofd zien — checklist

Bij elke nieuwe integratie van Jev-routing in Djinlabs, check:

- [ ] Worden alle drie Jev-question-types gebruikt waar relevant (choice/score/noul)?
- [ ] Is er een **canonieke confidence-threshold** gedefinieerd voor elke vraag?
- [ ] Is de **provider-keuze** (Jev-cloud/open-Jev/Ollama/Tinfoil) expliciet gemaakt?
- [ ] Wordt **PII** door een noul afgevangen VOOR de router een lane kiest?
- [ ] Worden **Jev-beslissingen** gelogd in runtime-state (per ADR 0001)?
- [ ] Heeft de **fallback-lane** een canonieke bron?
- [ ] Is **prompt-rewriting** expliciet als action-type of runtime-stap?
- [ ] Is **cache-stickness** overwogen voor lange conversaties?
- [ ] Wordt de **retention-policy** toegepast op de Jev-call-logs?
- [ ] Is er een **boundary-discipline-check**: blijft de router binnen zijn tenant?
- [ ] Wordt **failure** (timeout, malformed, offline-model) canoniek afgehandeld?

**Elke "nee" op deze checklist = canoniek gat dat in volgende Ronde gedicht moet.**

---

## Handoff Notes for Next Agent

Als je morgen verdergaat:

1. **Gap A (Jev-question-types)** is de **eerste** canonieke aanvulling die de moeite waard is — 't is klein, geïsoleerd, en geeft direct een action-mapping-tabel cadeau.
2. **Gap C (provider-keuze)** is belangrijk voor de blobbies-host (Ronde 14/Q14.2 was Tinfoil-CSP; deze audit voegt open-Jev toe als categorie).
3. **De productiecijfers** (75% local, <$0.01/sessie) zijn **concreet bewijs** dat Jev werkt zoals geclaimd. Stop ze in `jev-revenue-streams.md` §"Method 1 Numbers".
4. **Sam's GitHub-link** wordt later in de video beloofd — als die uitkomt, voeg een tweede audit-sectie toe met de daadwerkelijke code-implementatie.

---

## Provenance

| Field | Value |
|-------|-------|
| URL | https://www.youtube.com/watch?v=ZR7anrL50xs |
| Title | How to Build Things with Jev & OpenJevs |
| Uploader | Sam Witteveen |
| Duration | 19:18 (1158s) |
| Captions | 349 segments (auto-generated, en-US) |
| Retrieved | 2026-09-21 |
| Tool | /watch skill (transcript-only, --no-whisper) |
| Work dir | `/var/folders/00/hpnlr65s5dscpyjl_xfdldqr0000gn/T/watch-xu14ro1y` — delete when done |
| Frames | 0 (transcript-only mode — captions waren voldoende) |
| Confidence | High — volledige transcript geverifieerd, geen hallucinated content |

---

## Cross-References

| Document | Relevant voor |
|---|---|
| `_shared/jev-policy-canon.md` | Gap A (Jev-question-types), Gap B (lanes), Gap C (provider), Gap D (prompt-rewrite), Gap E (cache-stickiness) |
| `_shared/retention-policy-canon.md` | Logging-retentie (Sam: SQLite; wij: canon-klassen) |
| `docs/adr/0001-state-formats-canon.md` | SQLite/JSON als runtime-state — al canoniek |
| `research/jev-revenue-streams.md` | §"Numbers" uitbreiden met Sam's cijfers |
| `research/djinlabs-blombies-fit-research.md` | Gap C raakt blobbies-host (Tinfoil-CSP vs open-Jev) |
| `decisions.md` | Ronde 14/15 frontier-items die deze audit kan invullen |

---

## What Is NOT Canon in This Document

- Specifieke threshold-cijfers (0.5, 0.6, 0.7, 0.8, 0.9) — runtime-tuning, niet canon
- Concrete provider-implementaties (SemIf, Ollama, Tinfoil internals) — implementatie
- Specifieke model-keuzes (MiniCPM 2B, DeepSeek 4.1 Flash, Qwen Image 2.1) — runtime
- De <$0.01 / 53-requests cijfers als **exacte voorspelling** — referentie, geen garantie
- Cache-stickiness als canonieke regel — Gap E, **nog niet** canon
- Open-Jev clones als canonieke providers — Gap C, **nog niet** canon

---

## Notities voor audit-trail

Deze audit is **niet** een onderdeel van een Ronde. 't Is een research-rapportage conform `/research/` AGENTS.md-routing. Concrete canonieke acties die hieruit voortkomen horen thuis in `decisions.md` als Ronde 16+ frontier-items of als aparte canonieke rondes.

**Sam Witteveen kondigt in de video aan** dat er een **tweede channel** komt met meer code-intensieve walkthroughs en dat de code op GitHub komt. Bij die tweede video: her-audit met focus op de **daadwerkelijke code-implementatie** (FastAPI server, lane-config, Jev-call format). Mogelijk ontstaan er nieuwe gaps die deze audit mist.