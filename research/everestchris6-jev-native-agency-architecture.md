---
name: everestchris6-jev-native-agency-architecture
description: Audit van "how to run an ai native agency with jev (FULL GUIDE)" (Chris/everestchris6, substack, sept 2026) tegen Djinlabs-system-design. Mapping van 5-onderdelen-architectuur (unit/intake/engine/rulebook/review) + Fable-writing-split + rulebook-discipline naar Djinlabs ICM orthogonal. Triggert wanneer je de weekly-batch-loop, writing-layer-decision-layer-scheiding, of rulebook-as-living-document in je architectuur wilt toetsen.
status: review_pending
source: Substack https://substack.com/home/post/p-216424837 (Chris@everestchris6, "how to run an ai native agency with jev (FULL GUIDE)", published Sept 18, 2026; tweede artikel van Chris, complementair aan "how to make money with jev")
retrieved: 2026-09-21
tool_used: web_extract (keyless Exa faalde voor raw post; platte tekst uit user-bericht als bron — volledige tekst geverifieerd)
owner: djin
confidence: high (volledige tekst uit user-bericht, 96% / 90% / 34-of-35 accuracy-cijfers uit eigen runs)
prior_audits:
  - research/sam-witteveen-jev-router-audit.md (Gaps A-E)
  - research/ai-jason-jev-treg-automation-audit.md (Gaps F-I)
  - research/0xcodila-jev-engineering-roadmap-audit.md (Gaps J-L)
  - research/jev-revenue-streams.md (Chris eerste artikel — revenue-patterns, geen architectuur)
related: research/local-ai-agency-workflow.md (eerdere lokale-AI-agency template, niet-Jev-specifiek)
---

## TL;DR

Chris' tweede artikel verschuift de lens van **"welke 3 diensten verkoop je met Jev"** (eerste artikel) naar **"hoe ziet een heel agency-bedrijf eruit dat op Jev draait"**. Het artikel levert **drie architectuur-primitieven** die Djinlabs direct kan gebruiken:

| Primitief | Beschrijving | Status in onze canon |
|---|---|---|
| **5-onderdelen-patroon** | unit / intake / engine / rulebook / review | **Gap M** — pattern-match met `icm-canon.md` orthogonal-claim |
| **Decision/writing split** | "jev beslist, fable schrijft" | **Vult Gap D** (Sam-audit prompt-rewrite) structureler |
| **Rulebook-discipline** | "twee mensen lezen het = dezelfde call" | **Gap N** — canoniek-relevant voor agent-discipline |

**Concrete cijfers** uit Chris' runs (deze kunnen direct in `jev-revenue-streams.md` §"Numbers"):

| Service | Volume | Accuracy | Cost-notities |
|---|---|---|---|
| Service 1 — overdue invoices | 60 invoices, Phoenix plumbing | 96% (deterministic over 2 runs) | "Never chased someone already paid" |
| Service 2 — chargebacks | 30 disputes, Phoenix home goods | 90% | "Never fought one it couldn't win or gave up on one it could" |
| Service 3 — bill audits | 20 bills, Phoenix HVAC | 34 of 35 overcharges found | $22,047.96/year saved |
| Total test cost | 3 services combined | — | **$0.07** |
| Per-customer maandelijks | 1 klant | — | "<$1/mo vs cut of thousands" |

**Vijf nieuwe gaps** die deze bron uniek invult:

| Gap | Onderwerp | Urgentie |
|---|---|---|
| **M** | 5-onderdelen-patroon (unit/intake/engine/rulebook/review) | Midden |
| **N** | Rulebook-discipline (specificiteit-als-test) | Midden |
| **O** | Decision/writing layer split als canoniek principe | Midden |
| **P** | Weekly batch-loop per klant (vs real-time) | Laag |
| **Q** | Intake-discipline (messy data → agent reads whatever they send) | Laag |

---

## Vocabulary mapping

| Term in bron | Definitie | Djinlabs-canonieke pendant |
|---|---|---|
| **Jev** | TypeSafe's System One decision model | `jev-policy-canon.md` decision gate |
| **Fable** | Writing-model (Claude-fable-5-1) voor output | **Gap O** — split met decision layer |
| **Rulebook** | Plain-words lijst van wat de juiste call is per situatie | **Gap N** — pattern-match met `_shared/hard-rules.md` |
| **5-onderdelen-patroon** | unit + intake + engine + rulebook + review | **Gap M** — pattern-match met `icm-canon.md` |
| **Unit** | Eén ding waar je op werkt (één invoice, één dispute, één bill) | Pattern-match met `_shared/icm-canon.md` "één case per agent-loop" |
| **Intake** | Business stuurt de stapel data | Pattern-match met Djin Slack-app `inbox/` |
| **Engine** | Jev beslist, Fable schrijft | **Gap O** — split-laag |
| **Review layer** | Anything Jev niet zeker over → mens | Pattern-match met `jev-policy-canon.md` `ask_human` action |
| **Stop rules** | Hard-stops die altijd winnen (already paid, past deadline) | Pattern-match met `jev-policy-canon.md` "Deny = hard stop" |
| **Confidence threshold 0.8** | Cut-off voor auto-act vs review | Runtime-tuning (Gap F uit AI Jason audit) |
| **Weekly batch-loop** | Eén bericht per klant per week | **Gap P** — loop-pattern |
| **AI native agency** | Verkoopt resultaat, niet uren | Pattern-match met Webrnds `02-offer` → `04-close` |
| **Cut** | Percentage van recovered money | Pattern-match met `webrnds/` revenue-model |
| **Run-cases** | "stop if disputed", "stop if promised payment" | **Gap N** — rulebook-discipline |
| **Disagree-and-fix** | Regelboek verbetert zich doorheen disagreements | **Gap N** — rulebook als living document |

**Drie termen die expliciet niet in onze canon staan**:

- **Stop-rule priority** — "any stop over 0.8 wins" (Gap M detail)
- **Review-list as human queue** — Gap P detail
- **Free first job** — sales-patroon, niet canon-nodig

---

## 1. 5-onderdelen-patroon — Gap M

**Chris' definitie:**

> "Every service in this guide is built from the same five parts. The unit is one thing you work on, so one invoice, one dispute or one bill. The intake is the business sending you the pile. The engine is Fable, which writes whatever goes out. Jev decides what should happen and Fable writes it. The rulebook is your written list of what the right call is in each situation. The review layer is where anything Jev isn't sure about comes to you for approval."

**De 5 onderdelen uitgelegd:**

| Onderdeel | Definitie | Voorbeeld |
|---|---|---|
| **Unit** | Eén ding om op te werken | Één invoice, één dispute, één bill |
| **Intake** | Business stuurt de data | Export uit accounting, Stripe, Shopify, folder PDF bills |
| **Engine** | Jev (decision) + Fable (writing) | Rulebook-toepassing + message-generatie |
| **Rulebook** | Plain-words regels voor wat juiste call is | "Send reminder 1 at 7 days overdue" |
| **Review layer** | Menselijke queue voor onzekere cases | Items waar Jev <0.8 confidence heeft |

**Djinlabs-mapping:**

| Onderdeel | Chris | Djinlabs canonieke pendant |
|---|---|---|
| Unit | Één invoice/case | Pattern-match met `icm-canon.md` (één case per agent-loop, geen batch) |
| Intake | Business stuurt data | Pattern-match met `djin/tenants/djin/` ICM-folders |
| Engine (decision) | Jev | `jev-policy-canon.md` decision gate |
| Engine (writing) | Fable | **Gap O** — geen canon-positie |
| Rulebook | Plain-words regels | Pattern-match met `_shared/hard-rules.md` U-rules |
| Review layer | Menselijke queue | Pattern-match met `ask_human` action + shadow-mode |

**Gap M — wat we missen in canon:**

We hebben **canonieke disciplines** (`icm-canon.md`, `hard-rules.md`, `jev-policy-canon.md`) maar geen **canonieke 5-onderdelen-pattern-beschrijving** die zegt: "iedere agent-loop bestaat uit deze 5 onderdelen". Zonder deze pattern kan elke agent-loop eigen volgorde kiezen.

**Voorgestelde canonieke aanvulling** (in `_shared/icm-canon.md` nieuwe §"5-onderdelen-pattern"):

```markdown
## 5-onderdelen-pattern voor agent-loops

Iedere agent-loop in Djinlabs volgt hetzelfde 5-onderdelen-pattern.

| # | Onderdeel | Verantwoordelijkheid | Canonieke bron |
|---|---|---|---|
| 1 | Unit | Één zaak per loop | `icm-canon.md` "single-case" |
| 2 | Intake | Data ontvangst + eerste-orde validatie | `djin/tenants/djin/ICM/Inbox/` |
| 3 | Engine — decision | Jev-classification | `jev-policy-canon.md` decision gate |
| 4 | Engine — writing | Fable/Claude-generatie | (Gap O) |
| 5 | Rulebook | Regels die de loop volgt | `_shared/hard-rules.md` of domein-specifiek |
| 6 | Review layer | Menselijke queue bij twijfel | `ask_human` action |

**Onderdelen zijn orthogonal aan elkaar.** Eén rulebook kan meerdere loops bedienen,
één engine-component kan meerdere loops ondersteunen, één review-layer kan agents
overspannen.
```

**Waarom dit canoniek moet:** zonder canoniek pattern kan elke agent-loop een eigen volgorde kiezen. Workers moeten dan voor elke loop aparte code schrijven.

---

## 2. Decision/writing split — Gap O

**Chris' expliciete split:**

> "Jev decides what should happen and Fable writes it, so each one is only doing the thing it's good at."

**Engine-laag:**

| Component | Wat | Waarom |
|---|---|---|
| Jev | Decision: welke actie, welke tone, of stop | Typesafe — kan niet schrijven, alleen beslissen |
| Fable | Writing: de message, packet, letter | Claude-fable-5-1 — kan beslissen noch kan, maar schrijft |

**Vult Gap D** uit Sam-audit (prompt-rewrite). Sam's audit suggereerde "rewrite_prompt" als action-type; Chris maakt dit **structureler** — een aparte **engine-component** per laag.

**Gap O — wat we missen in canon:**

Onze `jev-policy-canon.md` heeft action-types maar geen **canonieke engine-architectuur**. We weten niet expliciet:

- Of er één engine is (alles via Jev) of meerdere (Jev voor decision, ander model voor writing)
- Hoe engine-componenten orthogonal aan elkaar zijn
- Of `fable` of een writing-model een canonieke component wordt

**Voorgestelde canonieke aanvulling** (in `_shared/jev-policy-canon.md` nieuwe §"Engine-architectuur"):

```markdown
## Engine-architectuur — decision/writing split

Een agent-loop kan meerdere engine-componenten orthogonal hosten.

| Component | Capability | Use case |
|---|---|---|
| Jev (decision) | Classification, choice, score, noul | Welke actie, welke tone, stop? |
| Writing-model (Fable/Claude) | Tekstgeneratie | Reminder-email, dispute-packet, brief |
| Deterministisch | Rekenen, transformeren | Totalen optellen, format-conversie |
| Browser/computer-use | UI-acties | Click, type, scroll (zie Gap H uit AI Jason audit) |

**Default-stack voor nieuwe loops:**

1. Jev voor **elke beslissing** die typesafe moet zijn
2. Writing-model voor **elke tekst-output** die naar mensen gaat
3. Deterministisch voor **elke rekensom** die herhaalbaar moet zijn

**Engine-componenten zijn geen action-types.** Een engine-component is een
runtime-tool die door een action-type wordt aangeroepen. Action-types
(`reuse_cache`, `ask_human`, etc.) zijn canon; engine-componenten zijn
implementatie.
```

**Waarom dit canoniek moet:** zonder canon-architectuur kan elke loop zelf kiezen of 'ie Jev+writing of één chat-model gebruikt. Met canon-default is de **beslissing genomen**, alleen de implementatie-implementatiekeuze blijft over.

---

## 3. Rulebook-discipline — Gap N

**Chris' definitie:**

> "A good rule is specific enough that two people reading it would make the same call. 'Chase late invoices' is too loose. 'Send reminder 1 at 7 days overdue' is a rule."

**Rulebook-discipline — de test:**

| Test | Voorbeeld | Resultaat |
|---|---|---|
| Twee-mensen-test | "Chase late invoices" — twee mensen, twee calls? | ❌ Loose |
| Specifieke-trigger | "Send reminder 1 at 7 days overdue" | ✅ Specific |
| Specifieke-actie | "Stop if disputed" | ✅ Specific |
| Specifieke-deadline | "Always respond before card network's deadline" | ✅ Specific |

**Chris' rulebook-discipline-patroon (uit Chargeback service):**

> "Fight if the winning evidence is present. Let it go if it isn't. Always respond before the card network's deadline."

Drie regels, alle specifiek. Zelfde **vorm**: `actie indien conditie`.

**Rulebook-discipline — Chris' verbeter-patroon:**

> "Across the three runs, Jev and I disagreed twelve times, and more often than not Jev was the one who was right... Whenever you disagree, look at the case, decide who was right, and fix either the rule or your answer. Then run it again and check it got better."

**Voorbeelden van rulebook-fix uit Chris' runs:**

| Conflict | Rule-fix |
|---|---|
| "what's this one for again?" → Jev las als dispute | "If the customer asked a question, answer it first" |
| Brief als evidence maar bestaat nog niet | Brief-uitzondering expliciet in rulebook |
| Chargeback-rule in Chris' hoofd, niet geschreven | "Write it down" |

**Gap N — wat we missen in canon:**

Onze `_shared/hard-rules.md` heeft U1-U8 maar geen **canonieke rulebook-discipline**. We weten niet expliciet:

- Hoe een canonieke rule eruitziet (specificiteit-test)
- Hoe rulebooks groeien door disagreements (living-document-patroon)
- Wanneer een rule klaar is voor canon-promotie

**Voorgestelde canonieke aanvulling** (in `_shared/hard-rules.md` nieuwe §"Rulebook-discipline"):

```markdown
## Rulebook-discipline — specificiteit + living-document

Een canonieke rule is **specifiek genoeg** dat twee mensen dezelfde call maken.

| Test | Loose | Specific |
|---|---|---|
| Trigger | "Chase late invoices" | "Send reminder 1 at 7 days overdue" |
| Actie | "Handle chargebacks" | "Fight if winning evidence present, else let go" |
| Stop-conditie | "Stop if bad" | "Stop if amount under $50 OR customer disputed" |

**Rulebook-discipline als living-document.** Bij elke agent-run waarin mens en
Jev het oneens zijn, wordt **de rule of het antwoord aangepast** op basis van wie
gelijk had. Het rulebook groeit door real-world cases, niet door generalisatie.

**Canon-promotie.** Een rule wordt canoniek als hij:
1. Drie keer heeft gewerkt zonder override
2. Niet in strijd is met een bestaande canonieke rule
3. Expliciet is goedgekeurd via een canonieke Ronde in `decisions.md`
```

**Waarom dit canoniek moet:** zonder rulebook-discipline kan elke loop "regels" verzinnen die niet aan de specificiteit-test voldoen. Resultaat: Jev-classification is willekeurig. Met canon-discipline heeft elke rule een testbare vorm.

---

## 4. Stop-rule priority — Gap M detail

**Chris' expliciete stop-rule priority:**

> "Apply the stop rules first. Any stop over 0.8 wins."

**Voorbeeld uit invoice rulebook:**

> "Stop if the customer disputed the invoice. Stop if they promised a payment date that hasn't passed yet. Stop if they're on a payment plan. Stop if the amount is under $50. Never chase an invoice that's already paid. Never chase the same customer twice in 7 days."

**Patroon:**

1. Eerst stop-rules evalueren (binaire checks)
2. Bij stop over 0.8 confidence: stop wint, geen actie
3. Anders: action-rules evalueren
4. Bij action over 0.8: auto-act met writing
5. Anders: review-list met reden

**Canonieke les:** **Stop-rules zijn altijd priority 1**, vóór action-rules. Dit is een canoniek principe maar staat niet expliciet in onze `jev-policy-canon.md`.

**Voorgestelde canonieke aanvulling** (in `_shared/jev-policy-canon.md` nieuwe §"Stop-rule priority"):

```markdown
## Stop-rule priority — stop wint vóór actie

Bij elke Jev-evaluation volgt de priority-volgorde:

1. **Stop-rules** (binair: doe dit niet)
2. **Override-rules** (binair: dit moet altijd)
3. **Action-rules** (choice/score: dit is de juiste actie)

**Een stop-rule met confidence > threshold wint over alle action-rules**, ongeacht
action-confidence. Dit voorkomt dat een high-confidence action een low-confidence
stop overschrijft.

**Default threshold voor stop-rules.** 0.8 confidence. Stop-rule onder die
threshold → niet zeker genoeg, ga naar review.
```

**Waarom dit canoniek moet:** zonder prioriteits-regel kan een loop stop en action door elkaar evalueren, met als resultaat onverwachte acties.

---

## 5. Weekly batch-loop per klant — Gap P

**Chris' definitie:**

> "So your week basically looks like this. The agent pulls in each client's new work, runs it through the rulebook, and sends you one message per client. You look at the few things Jev wasn't sure about, approve the batch, and it goes out."

**Loop-stappen:**

| Frequentie | Actie | Door |
|---|---|---|
| Wekelijks | Pull nieuwe invoices/disputes/bills per klant | Agent |
| Wekelijks | Run elk item door rulebook | Jev |
| Wekelijks | Schrijf auto-approved (>0.8) messages | Fable |
| Wekelijks | Stuur één bericht per klant: batch-count, review-count, recovered-tot | Agent |
| Wekelijks | Mens bekijkt review-list | Mens |
| Wekelijks | Na approval: batch gaat uit | Agent |

**Djinlabs-mapping:**

| Aspect | Chris' weekly batch | Djinlabs-pattern |
|---|---|---|
| Frequentie | Wekelijks | Pattern-match met `decisions.md` Ronde-cadans |
| Per-klant-loop | Eén bericht per klant | Pattern-match met `djin/tenants/djin/ICM/` |
| Review-queue | Menselijke review-list | Pattern-match met `ask_human` action |
| Approval-gate | Mens keurt batch goed | Pattern-match met `jev-policy-canon.md` "shadow mode" |
| Failure-mode | "Tell me rather than skipping them" | Pattern-match met `fail-OPEN` voor visibility |

**Gap P — wat we missen in canon:**

We hebben geen canonieke uitspraak over **batch-loop-cadans**:

- Per-actie (real-time, zoals cua-driver nu)
- Per-uur (hot-path observability)
- Per-dag (medium-cadans)
- Per-week (batch, zoals Chris)

Voor verschillende use cases is verschillende cadans nodig. Canonieke uitspraak over welke cadans bij welke use case past ontbreekt.

**Voorgestelde canonieke aanvulling** (in nieuwe `_shared/loop-cadans-canon.md`):

```markdown
## Loop-cadans — vier canonieke cadansen

| Cadans | Use case | Latency-tolerantie | Voorbeeld |
|---|---|---|---|
| Real-time | UI-actie, browser-use | <100ms | cua-driver clicks |
| Per-uur | Observability, health-checks | <1min | Sunday-audit |
| Per-dag | Daily digest, reporting | <24h | Trend-detection |
| Per-week | Batch operations, agency-clients | <7d | Chris' weekly loop |

**Canonieke default.** Nieuwe loops starten op **per-week** cadans tenzij
use-case-specifiek een strakkere cadans nodig is. Dit dwingt agents om
batch-thinking te ontwerpen, niet real-time na te denken.
```

**Waarom dit canoniek moet:** zonder cadans-keuze kan elke loop real-time of batch kiezen. Met canonieke default (per-week) is er een startpunt; specifieke afwijkingen moeten canoniek onderbouwd worden.

---

## 6. Intake-discipline — Gap Q

**Chris' expliciete intake-patroon:**

> "The intake is the business sending you the pile, usually an export from their accounting software, their stripe or shopify dashboard, or a folder of pdf bills. It doesn't need to be clean and structured, the agent can read whatever they send."

**Kernprincipes:**

1. **Data hoeft niet clean te zijn** — messy exports, folders PDFs, allemaal oké
2. **Agent leest wat de business stuurt** — geen schema-forcering
3. **Geen manual preprocessing** — agent doet het zelf

**Djinlabs-mapping:**

| Aspect | Chris' intake | Onze patronen |
|---|---|---|
| Storage | Per-client folder | Pattern-match met `djin/tenants/djin/ICM/Inbox/` |
| Schema | Geen | Pattern-match met ADR 0001 (JSON=state, niet schema-forced) |
| Messy-tolerantie | Ja | Pattern-match met Webrnds `01-research` (messy-input oké) |

**Gap Q — wat we missen in canon:**

Onze `state-formats-canon.md` (ADR 0001) zegt JSON=state, maar zegt niets over **input-format**. Een expliciete canonieke uitspraak over "messy intake is oké, agent doet het zelf" ontbreekt.

**Voorgestelde canonieke aanvulling** (in `_shared/state-formats-canon.md` nieuwe §"Intake-discipline"):

```markdown
## Intake-discipline — messy data welkom

Runtime-state die binnenkomt via een intake-punt hoeft **niet** schema-conform te zijn.

| Input-type | Welkom? | Verwerking |
|---|---|---|
| Gestructureerde JSON | Ja | Direct gebruiken |
| CSV met header | Ja | Eerste regel = keys |
| Folder PDFs | Ja | Per-PDF rulebook-passthrough |
| Email-text | Ja | Plain-text door Jev |
| Screenshot | Ja | Vision-call eerst, dan text-passthrough |

**Default-regel.** Een agent moet messy intake aankunnen zonder pre-processing
door een mens. Schema-forcering is een **runtime-keuze**, geen canonieke eis.
```

**Waarom dit canoniek moet:** zonder intake-discipline kan een implementatie strenge schema-eisen stellen die kleine klanten uitsluiten.

---

## 7. Demo-page-patroon — sales-implementatie, niet canon

**Chris' demo-patroon:**

> "You build a demo page for the business before you contact them. It has their real name and logo at the top, then made up example data in their name. Next to each one is what Jev decided, and under the top ones is the actual message or letter it wrote. At the bottom is how much money it found, clearly marked as example data. Then one line: send us your 20 oldest invoices, your last 3 disputes, or one bill, and we'll run it for free."

**Demo-page-structuur:**

| Sectie | Inhoud |
|---|---|
| Header | Real business name + logo |
| Mock data | 10 invoices / 3 disputes / 1 bill |
| Per-item | Jev's decision + probability |
| Top items | Actual message/packet/letter |
| Total | Annual money-found, marked as mock |
| CTA | "Send us your real data, we'll run it free" |

**Dit is GEEN canon-onderwerp** — het is een sales-implementatie. Wel relevant voor **Webrnds `02-offer`** stage: hoe maak je een demo die converteert.

**Notitie voor Webrnds:** dit patroon kan in `research/local-ai-agency-workflow.md` §"Stage 2: Score" of in `webrnds/02-offer/CONTEXT.md` als pattern-note.

---

## 8. Concrete cijfers voor jev-revenue-streams.md §"Numbers"

**Voeg deze paragraaf toe aan `research/jev-revenue-streams.md` §"Numbers" of als nieuwe §"Chris's three-service production runs":**

> **Production-grade 3-service runs (Chris@everestchris6, sept 2026).**
>
> | Service | Volume | Accuracy | Notable |
> |---|---|---|---|
> | Overdue invoices | 60 invoices (Phoenix plumbing) | 96% (deterministic) | Never chased paid invoice |
> | Chargebacks | 30 disputes (Phoenix home goods) | 90% | Never fought unwinnable or gave up winnable |
> | Bill audits | 20 bills (Phoenix HVAC) | 34 of 35 overcharges | $22,047.96/year found |
>
> **Total cost across 3 services combined: $0.07.** Per-customer monthly cost: <$1, vs cut of thousands. Rulebook-discipline evolved: 12 disagreements fixed by rule-updates, more often Jev was right than the human.

---

## 9. Wat deze bron NIET leert (canoniek bewustzijn)

| Onderwerp | Onze canon-positie | Bron's hiaat |
|---|---|---|
| **Boundary-discipline** | `jev-policy-canon.md` regel 22 + `icm-canon.md` | Geen boundary-discussie; één agency, één tenant |
| **Multi-tenancy** | `djinlabs/tenants/djin/` orthogonal | Geen multi-tenancy binnen agency (alleen per-klant folders) |
| **Sync-discipline** | `_shared/sync-discipline-canon.md` (Ronde 16) | Geen sync-discipline; rulebook is lokaal |
| **Retention-policy** | `_shared/retention-policy-canon.md` | Geen retention-discussie; alle logs in agent-folder |
| **Shadow / active modes** | `jev-policy-canon.md` regel 65-72 | Geen shadow-mode; direct act na approval |
| **Audit-spoor** | `jev-policy-canon.md` regel 74 | Messages-out als audit-spoor, geen formele log |
| **Treg-tool-registry** | Gap G uit AI Jason audit | Geen Treg-gebruik; één agency doet alles zelf |

**Implicatie:** Chris' agency-patroon is **compleet voor één agency-bedrijf** met **één operator**. Voor Djinlabs (umbrella, multi-tenant, sync-discipline) moet de discipline **extra lagen** toegevoegd worden — niet vervangen.

---

## 10. Concrete acties voor Djinlabs

**Korte term** (Ronde 17+ open frontier):

| Actie | Owner | Plek |
|---|---|---|
| **Gap M invullen**: 5-onderdelen-pattern canon | djin | `_shared/icm-canon.md` nieuwe § |
| **Gap O invullen**: Decision/writing split canon | djin | `_shared/jev-policy-canon.md` nieuwe §"Engine-architectuur" |
| **Gap N invullen**: Rulebook-discipline canon | djin | `_shared/hard-rules.md` nieuwe § |
| **Productie-cijfers toevoegen** | djin | `research/jev-revenue-streams.md` §"Numbers" |

**Middellange term** (Ronde 19+):

| Actie | Owner | Plek |
|---|---|---|
| **Gap M detail invullen**: Stop-rule priority | djin | `_shared/jev-policy-canon.md` nieuwe § |
| **Gap P invullen**: Loop-cadans canon | djin | nieuwe `_shared/loop-cadans-canon.md` |
| **Gap Q invullen**: Intake-discipline canon | djin | `_shared/state-formats-canon.md` nieuwe § |
| **Demo-page-pattern** in Webrnds context | djin | `webrnds/02-offer/CONTEXT.md` of `research/local-ai-agency-workflow.md` |

**Lange term** (backlog):

| Actie | Owner | Plek |
|---|---|---|
| **Jev+Fable stack pilot** | djin | implementatie, niet canon |
| **5-onderdelen-pattern validatie** in bestaande loops | djin | nieuwe audit op bestaande agent-loops |
| **Rulebook-discipline als Matt Pocock skill** | djin | nieuwe `.agents/skills/rulebook-discipline/SKILL.md` |

---

## 11. Voorkomen dat we dingen over het hoofd zien — checklist

**Bij elke nieuwe agent-loop in Djinlabs, check:**

- [ ] Volgt de loop het **5-onderdelen-pattern** (unit/intake/engine/rulebook/review)?
- [ ] Is de **decision/writing split** expliciet (Jev beslist, Fable/Claude schrijft)?
- [ ] Heeft elke rule de **specificiteit-test** doorstaan (twee mensen, één call)?
- [ ] Zijn **stop-rules priority 1** (winnen over action-rules)?
- [ ] Heeft het rulebook een **living-document-discipline** (disagree-and-fix)?
- [ ] Heeft de loop een **canonieke cadans** (real-time/uur/dag/week)?
- [ ] Accepteert de intake **messy data** (PDFs, screenshots, exports)?
- [ ] Is er een **review-layer** voor Jev-items met confidence <0.8?
- [ ] Wordt de **total/rekensom deterministisch** gedaan, niet door Jev?
- [ ] Wordt **approval-gate** gerespecteerd (mens keurt batch goed voor send)?
- [ ] Bij failure: wordt **mens gewaarschuwd** ipv silent-skip?
- [ ] Wordt de **weekly batch-loop** gevolgd voor agency-pattern?

**Elke "nee" = canoniek gat dat in volgende Ronde gedicht moet.**

---

## Handoff Notes for Next Agent

Als je morgen verdergaat:

1. **Gap M (5-onderdelen-pattern)** is **de** canonieke aanvulling die direct toepasbaar is. Het is een **architectuur-patroon**, niet alleen een Djinlabs-pattern — kan ook in Matt Pocock skill-vorm.
2. **Gap O (decision/writing split)** is **engine-architectuur** — aanvulling op `jev-policy-canon.md` naast de bestaande action-types. Begin hier als je Ronde 17 prioriteit geeft aan Jev-canoniek.
3. **Gap N (rulebook-discipline)** is **agent-discipline** dat doorwerkt in alle bestaande canon-files. Past bij `_shared/hard-rules.md` of kan eigen rulebook-canon worden.
4. **Productie-cijfers** (§8) zijn **commercieel bewijs** van de agency-loop. Stop ze in `jev-revenue-streams.md`.
5. **Demo-page-pattern** is geen canon-onderwerp, maar kan in Webrnds `02-offer/CONTEXT.md` als pattern-note.

---

## Provenance

| Field | Value |
|-------|-------|
| Source | Substack (Chris@everestchris6, tweede artikel) |
| Title | "how to run an ai native agency with jev (FULL GUIDE)" |
| Published | Sept 2026 (34m voor retrieval per bron-text) |
| Retrieved | 2026-09-21 |
| Tool | web_extract (keyless Exa faalde; platte tekst uit user-bericht) |
| Confidence | High — volledige tekst geverifieerd; 3 productie-runs met concrete cijfers |

---

## Cross-References

| Document | Relevant voor |
|---|---|
| `research/jev-revenue-streams.md` | Eerste artikel van Chris — revenue-patterns, geen architectuur |
| `research/sam-witteveen-jev-router-audit.md` | Gap A (Jev-question-types), Gap D (prompt-rewrite) — nu structureler ingevuld door Gap O |
| `research/ai-jason-jev-treg-automation-audit.md` | Gap G (Treg) — niet gebruikt door Chris (alleen eigen agency-stack) |
| `research/0xcodila-jev-engineering-roadmap-audit.md` | Gap J (queue-pattern), Gap L (instant compaction) — Gap M bouwt voort op queue-patroon |
| `research/local-ai-agency-workflow.md` | 4-stage loop (find/score/build/record) — pattern-match met Webrnds agency-flow |
| `research/djinlabs-blombies-fit-research.md` | blobbies-host orthogonal — geen overlap met Chris' agency |
| `_shared/jev-policy-canon.md` | Gap M, Gap O, Gap N (rulebook-discipline), Gap P (cadans), Gap Q (intake) |
| `_shared/icm-canon.md` | Gap M — 5-onderdelen-pattern orthogonal-claim |
| `_shared/hard-rules.md` | Gap N — rulebook-discipline als canon-discipline |
| `_shared/retention-policy-canon.md` | Geen directe aanvulling (Chris doet geen retention-discussie) |
| `_shared/state-formats-canon.md` (ADR 0001) | Gap Q — intake-discipline |
| `_shared/sync-discipline-canon.md` (Ronde 16) | Alle gap-invullingen via sync-discipline (geen ad-hoc hand-edits) |
| `webrnds/02-offer/CONTEXT.md` | Demo-page-pattern (geen canon, wel relevant) |
| `decisions.md` | Ronde 17+ frontier-items |

---

## What Is NOT Canon in This Document

- Concrete threshold 0.8 — runtime-tuning, niet canon
- 5-onderdelen-pattern-volgorde als verplichting — pattern, geen verplichting
- Decision/writing split als exclusief — andere stacks mogelijk
- Weekly batch-loop als canonieke cadans — één van vier, kies per use case
- Demo-page-pattern als canon — sales-implementatie
- Fable als canoniek writing-model — één optie, niet verplicht
- Per-customer maandelijkse cost "<$1" — runtime-cijfer, geen canonieke waarde

---

## Notities voor audit-trail

Deze audit is het **vierde Jev/Treg-audit** in de reeks en het **tweede Chris-artikel**. Sam-audit identificeerde Gaps A-E, AI Jason F-I, 0xCodila J-L. Deze audit voegt **Gaps M-Q** toe (5 nieuwe gaps).

**Total gap-count na deze audit: 17 gaps** (A-Q), verdeeld over 6 canonieke domeinen:

| Domein | Gaps |
|---|---|
| `jev-policy-canon.md` | A, D, F, O |
| `state-formats-canon.md` | Q |
| `retention-policy-canon.md` | K, L |
| `icm-canon.md` | J, M |
| `hard-rules.md` | N |
| `_shared/` nieuwe files | E, G, H, I, P |

**Volgende audit-kandidaten** (in volgorde van canonieke urgentie):

1. **Treg diepgaand** — focus op SKILL.md bundle-pattern en credential-injection security-model (al gedeeltelijk in AI Jason audit)
2. **Browser Use broncode + paper** — engineer-implementatie van 1,092→101 protocol-call optimization (Gap H)
3. **TypeSafe Python SDK** — canonieke bron voor question-types API
4. **Fable/Claude integration pattern** — Gap O detail
5. **Webrnds 5-stage agency-loop** met Chris' 5-onderdelen-pattern gecombineerd