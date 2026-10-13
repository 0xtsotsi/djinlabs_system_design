---
name: jev-revenue-streams
description: Drie verkoopbare workflows die draaien op Jev (TypeSafe's System One decision model): instant-quote widget voor lokale trades, B2B quote desk voor sign shops en leveranciers, en een guard skill die approve/deny geeft op agent-acties. Trigger wanneer je praat over "Jev", "TypeSafe", "decision model", "instant quote", "guard skill", of wanneer je een nieuwe Jev-revenue-stream wilt ontwerpen.
---

# Jev — drie revenue-streams

> **Bron.** Dit template is een research-rapport + workflow-canoniek voor "How to make money with Jev (FULL GUIDE)" door `everestchris` (Substack, gedeeld door founder in chat op 2026-09-20). Geen publieke URL beschikbaar — bron is het originele chat-bericht. Provenance onderaan.
>
> **Doel.** Document dat jij (of een agent) morgen opent om een Jev-revenue-stream te **ontwerpen of bouwen** zonder de context opnieuw uit te leggen.
>
> **Audience.** Founder + agent die dit voor het eerst uitvoert.
>
> **Matt Pocock skills toegepast.** `/research` (provenance header, cited source), `/prototype` (elke stream is een throwaway prototype met verdict), `/handoff` (expliciete morgen-section), `writing-for-agents` (frontmatter, leading words, information hierarchy), `/improve-codebase-architecture` (umbrella-plaatsing), `/triage` (state-machine voor guard-skill).

## TL;DR

**Jev is een decision model, geen writer.** Stuur het state + typed questions, krijg decisions met probabilities terug. Drie vragen die het kan beantwoorden: **Choice** (één optie uit een lijst), **Score** (positie op een geordende schaal), **Noul** (true/false probability). Output is gestructureerd, niet prose.

**Prijs.** $0.042 per miljoen input tokens. Output free. Een test van 112 callen kost $0.006 — effectief $0.054 per 1000 decisions. Een writing model doet 50×-200× meer en secondes in plaats van milliseconden.

**Canonieke operating pattern.** Threshold-based actie. Boven de threshold = auto-run. Onder de threshold = ask human. Threshold-hoogte hangt af van actiekosten: harmless = 0.7, geld-staat = 0.9, alles daartussen = 0.8.

**Drie revenue-streams uit de bron.**
1. **Instant quotes voor lokale trades** — text box op de site, Jev pakt de juiste rij uit een price table, range verschijnt in <1 sec.
2. **B2B quote desks voor sign shops en leveranciers** — zelfde widget, andere data. Catalog vervangt service list.
3. **Guard skill voor agents** — één text file die voor élke agent-actie Jev vraagt "mag dit", "is dit een duplicate", "kan dit ongedaan".

**Verkoopbaar advies uit de bron.** Method één is het makkelijkst te verkopen (lokaal, urgent, zichtbaar probleem). Method drie is het makkelijkst te bouwen (één text file). Method twee betaalt het best per klant maar de markt is kleiner.

---

## Vocabulary mapping (umbrella-plaatsing)

Vocabulary-mapping per `improve-codebase-architecture`-skill, om dit document in DjinLabs × Webrnds × Djin × blobbies umbrella te plaatsen.

| Canon-term | Jev-context | Notitie |
|---|---|---|
| agent | agent met guard skill | Elke agent die een Jev-guardskill leest |
| skill (Ronde 11) | guard skill file | Text file die agent leest vóór elke actie |
| routines | dagelijkse of wekelijkse run-cadans | Threshold wordt getuned door historische runs |
| home folder | `research/jev-revenue-streams/` | Canonieke plek voor deze canonieke bron |
| instance | **niet** | Geen venture, geen tenant — drie revenue-streams binnen Webrnds |

**Module-fit.** Dit is **geen nieuwe instance**. Het zijn **drie executable templates** die binnen Webrnds als workflow draaien. De guard skill kan ook orthogonal lopen aan Djin of blobbies — dat is **geen** umbrella-uitbreiding, alleen een skill die elke agent kan lezen.

**Cross-link naar jev-policy-canon.** Dit document is **de praktische toepassing** van `/_shared/jev-policy-canon.md` (Ronde 14). Action-types vocabulary (8 acties), fail-mode matrix, retention classes — ze komen hier samen in drie concrete revenue-streams.

---

## 1. Wat Jev is (canonieke definitie)

**Drie primitives die alles dekken.**

| Primitive | Vraag-vorm | Antwoord-formaat | Voorbeeld |
|---|---|---|---|
| `Choice` | "Welke optie uit deze lijst?" | één optie + per-optie probability + confidence | service: `repair` (0.97) |
| `Score` | "Op welke positie van deze schaal?" | positie + per-level probability + confidence | urgency: `today` (0.91) |
| `Noul` | "Is dit waar of niet waar?" | true/false + probability + confidence | needs_visit: `true` (0.89) |

**Alle antwoorden komen terug met probability.** Dat nummer is de bouwsteen — geen proberen, geen gok, geen "misschien".

**Eén regel door alles.** Wanneer Jev heel zeker is, doet de code 't zelf. Wanneer 't niet zeker is, wordt er gevraagd.

**Threshold-keuze hangt af van actiekosten.**

| Actie-type | Threshold | Reden |
|---|---|---|
| Harmless (read, search, log) | 0.7 | False-positive kan weinig kwaad |
| Normaal (write, send-notification) | 0.8 | Standaard balans |
| Geld-staat (mail, order, pay, delete) | 0.9 | False-positive is catastrofaal |

**Latency.** 70-500 ms end-to-end. Vendor-cijfer: 193.6× sneller dan een LLM. Behandel dat als ceiling.

**Output is free.** Jev's output is één woord en een number, dus bijna niets te meten.

---

## 2. Toegang krijgen

**Direct API** heeft een waitlist. **Vercel AI Gateway** is vandaag open.

**Canonieke setup (uit de bron).**

```bash
npm i -g vercel
vercel login
vercel ai-gateway api-keys create --name jev --budget 5
```

De `--budget 5` zet een harde $5 cap op de key. Kan nooit meer uitgeven.

**`.env` file:**
```
AI_GATEWAY_API_KEY=your_key_here
```

**Model naam.** `typesafe-ai/jev` (Vercel Gateway). Werkt ook via OpenRouter met dezelfde naam.

**Canonieke eerste-call (canoniek script uit de bron).**

Inputs:
- `situation: "my ac is blowing warm air and it's 110 out"`
- `options: [repair, install, maintenance, other]`

Verwachte output:
- `repair`
- `0.97`
- Latency < 1 sec

**Als de call faalt.** Toon de **echte error**, niet silent retry. Een Jev-call die faalt is een debug-melding, geen retry.

---

## 3. Method één — instant quotes voor lokale trades

**Probleem.** HVAC-eigenaar krijgt om 21:00 een site-bezoek van iemand die wil weten of 't een $300 of $3,000 fix is. Ziet "request a quote", sluit tab af. Eigenaar weet niet eens dat die persoon bestond.

**Oplossing uit de bron.** Eén text box op de site. Klant typt wat er mis is, krijgt een range terug in <1 sec.

### 3.1 Price table (canoniek artefact)

**Bouwen éénmaal per trade per stad.** Elke business in die stad gebruikt dezelfde table, eigen service-namen mapped erop.

**Process.**
1. Minimaal 8 publieke price-pagina's van contractors in die stad + trade.
2. Voor elke service: low en high price van elke pagina.
3. Bouw table: service × size-band × urgency-band × low × high.
4. Bands mogen **niet overlappen**. Bij conflict tussen bronnen: wijdste range wint.
5. Citeer de URL per rij.
6. Service met <3 bronnen: drop, vertel welke.

**HVAC Phoenix voorbeeld uit de bron.** Negen contractors gecombineerd. Small flexible repair = $150-450. Dezelfde repair met `today` urgency = hoger.

### 3.2 Widget (canonieke component)

**Functional contract.**
- Tekst-box op de home-page van de business.
- Submit → **één Jev-call** met 5 vragen tegelijk (parallel, single call):
  1. `Choice`: welke service (uit hun eigen lijst)
  2. `Score`: hoe groot (small/medium/large)
  3. `Score`: hoe urgent (flexible/this-week/today)
  4. `Noul`: needs a visit (true/false)
  5. `Noul`: is this real (true/false)
- Kijk de matching row op in de price table.
- Toon de range.

**Edge-case discipline (canoniek).**

| Conditie | Actie |
|---|---|
| Service-confidence < 0.7 | Toon "we'll confirm within the hour" + book button, geen nummer |
| Needs-visit = true | Zelfde hierboven |
| Size-confidence < 0.7 | Vraag één follow-up: "roughly how many square feet?" |
| Real-request = false | Toon niets aan de eigenaar |

**Safety-patroon.** Tabel kiest het bedrag, Jev kiest alleen welke rij. Dat onderscheid is wat deze widget veilig maakt op andermans site. Een model dat getallen genereert kan één foute prijs voor een echte klant zetten; een model dat alleen een rij kiest laat het ergste geval een echte range uit een echte tabel zien.

### 3.3 Run nummers uit de bron

- Range on screen: **801 ms median**
- "Replace my old 4 ton ac unit" → range meteen
- "It's making a weird noise" → book-a-visit (89% sure op needs_visit, correct)
- Spam message → eigenaar krijgt geen text

**Size is zwak.** Jev zit tussen 63-76% op size-bepaling. Mitigatie: follow-up-vraag, deterministic mapping (geen tweede Jev-call nodig — een getal in een box heeft geen model nodig).

### 3.4 Verkoop

- Bouw demo op **kopie** van hun eigen site. Nooit op de live site.
- Postkaart met QR-code naar de demo.
- Maandelijks: turn on voor [placeholder] / maand. Live = elke real request komt met range in de text naar eigenaar.
- Bonus: missed call → caller krijgt text met link naar widget. Vangt de 21:00-beller die voicemail kreeg.

---

## 4. Method twee — B2B quote desks

**Probleem.** Sign shop / printer / wholesaler krijgt email-vraag voor $2,000-$50,000 order. 1-3 dagen voor een antwoord. Ondertussen is de klant al twee andere shops aan het bevragen — wie eerst antwoordt zit in het gesprek.

**Zelfde widget, andere data.** Catalog vervangt service list. Vragen veranderen:

| Vraag | Type | Wat |
|---|---|---|
| 1 | `Choice` | welk item uit catalog |
| 2 | `Score` | hoeveel (quantity band) |
| 3 | `Noul` | rush (true/false) |
| 4 | `Noul` | installation needed (true/false) |
| 5 | `Noul` | design needed (true/false) |
| 6 | `Noul` | needs a call (true/false) |

### 4.1 Bands

- Prijzen uit hun **eigen listed prices** (geen scraped derde partij).
- Bands by quantity of size, niet overlappend.
- Alles boven top-band gaat naar call.
- Anything needing a call toont booking link, geen range.

### 4.2 Run nummers uit de bron (Phoenix sign shops)

- Range on screen: **869 ms median**
- Channel letter sign → $2,000-6,000
- "Signage for all our locations" → call (91% sure, correct — conversatie, geen quote)
- "40 yard signs" → $190-1,526

**Wijd is wijs.** Yard signs variëren enorm. Een wijde eerlijke range verslaat een nauwe verkeerde. De koper leert dat ze in de juiste ballpark zitten; de shop firmt 't op.

### 4.3 Verkoop

Zelfde postcard, zelfde demo als method één. Hogere prijs omdat de quotes meer waard zijn.

---

## 5. Method drie — guard skill voor agents

**Probleem.** Iemand zet een agent op, kan 'm niet met rust laten. Agent geeft geld uit dat 't niet zou moeten, retried iets dat al stuk is. Eigenaar zit elke stap goed te keuren — precies wat de agent weg zou moeten nemen.

**Wat ze willen.** Agent runt zelfstandig, stopt alleen voor de paar dingen die echt een mens nodig hebben. Maar niemand wil de rules schrijven, want de rules moeten situaties dekken die je nog niet bedacht hebt.

**Jev past exact.** "Is dit een duplicate", "is dit off-goal", "kan dit ongedaan" — judgment-calls met een klein aantal mogelijke antwoorden.

### 5.1 Wat je verkoopt

Eén text file. Een skill file is een text file die de agent leest om één ding te doen.

### 5.2 Hoe het werkt

Vóór **elke actie**, agent beschrijft 'm aan Jev:
- Wat de actie is
- Wat het kost
- Wie het raakt
- De laatste tien acties
- Wat het doel van vandaag is

Dan **vijf vragen**:
1. `Noul`: is this a duplicate
2. `Noul`: is this off goal
3. `Score`: may it spend (approve/review/deny)
4. `Noul`: can this be undone
5. `Noul`: did the last step work

Plus een zesde **wanneer er een lead bij betrokken is**:
6. `Noul`: is this lead real

### 5.3 Threshold-rules (canoniek uit de bron)

| Type | Threshold | Reden |
|---|---|---|
| Normal actions | 0.8 over alle vragen | Standaard balans |
| Cheap reversible (read, search, log) | 0.7 | False-positive kan weinig kwaad |
| Mailing, ordering, paying, deleting | 0.9 | Geld-staat + irreversible |
| `Deny` van Jev | stopt, altijd | Ongeacht de threshold |
| Jev antwoordt niet binnen 3 sec | hold voor persoon | Timeout = wait, niet default-pass |

**Budget-discipline.** Dagelijks budget is een getal in code, geteld, niet gevraagd. "Heb ik te veel uitgegeven" is rekenkunde, niet judgment.

### 5.4 Run nummers uit de bron

40-acties fake day, 21 normal / 9 borderline / 10 deliberately bad. Twee runs.

- **20 van 21 normal** actions runnen zonder vraag
- **Alle 10 bad** worden geweigerd, beide runs (inclusief $400 render, $675 mailing naar ongeverifieerde lijst, $950 invoice, leads-database delete)
- **66 Jev-calls** totaal, $0.0037
- 1 normal dat **wel** vastliep: batch van 4 render variants, half gelezen als repeat. **Juiste soort fout** — stopte en vroeg, in plaats van te gokken.

### 5.5 Verkoop

Twee versies:
- **Free** met een paar checks, op skills-site.
- **Paid** met alles + setup voor Hermes en GrokBot.

Prijs: founder-call, kanoniek onbekend.

---

## 6. Stack (canonieke tooling)

| Stap | Tool | Kosten |
|---|---|---|
| Toegang | Vercel AI Gateway | Per-token (Jev = $0.042/1M input) |
| Schema-definitie | handgeschreven JSON of AI SDK | gratis |
| Eerste-call test | node + vercel AI SDK | gratis (binnen budget) |
| Widget hosten | business-eigen site (copy first) | per business |
| Price-table bouwen | scraping + handmatige validatie | per trade × stad |
| Guard skill hosten | skills-platform of agent's eigen repo | per deployment |

**Boundary-discipline.** Output gaat in **workflow-eigen folder** zoals `research/jev-revenue-streams/runs/<method>-<business>-<run-id>/`. Niets in `~/.blobbies/`, niets in `~/Documents/projects/slack/`, niets in `/_shared/`.

**Secrets discipline.** `AI_GATEWAY_API_KEY` alleen in `.env` (gitignored). Per-run copies, niet canon. Past bij `jev-policy-canon.md` §Secret store + U3.

---

## 7. Wat Jev NIET kan bewijzen / niet voor is

Drie zwaktes uit de bron en uit bredere context:

1. **Geen rationale.** Jev geeft alleen een number, nooit uitleg. Audits in regulated workflows zijn moeilijker. Pilot op beslissingen die je goedkoop kunt verifiëren.
2. **Vendor-benchmarks zijn vendor-only.** 193.6× sneller, 444.6× goedkoper zijn TypeSafe's eigen metingen. Geen independent reproduction. Behandel als ceiling, niet als ground truth.
3. **Predictions ≠ classifications.** "Is dit een lead in onze target industry" = Jev. "Gaat deze lead closen" = niet Jev. Future-state voorspellingen zijn een andere markt.

**Discipline-implicatie.** Jev is voor **classification**, niet **prediction**. Alles wat de bron noemt past binnen die grens.

---

## 8. Wat Jev NIET is

- **Geen writer.** Geen prose, geen brainstorm, geen creatieve output. Daar is je gewone writing model voor.
- **Geen vervanger voor je LLM.** Jev **kiest** of de LLM moet draaien. Jev runt niet de hele taak.
- **Geen SaaS-template.** Drie revenue-streams, geen product.
- **Geen AI-cliché.** Geen "transform", geen "revolutionize", geen "next-gen". Specifieke call-shapes, specifieke thresholds, specifieke outputs.

---

## 9. Handoff — wat jij morgen nodig hebt

**Volgorde om dit te starten.**

1. **Maak een Vercel account aan.** Login via terminal. Maak een `AI_GATEWAY_API_KEY` met $5 budget cap.
2. **Schrijf één klein script.** Stuur één Jev-call (situation "my ac blowing warm air", options repair/install/maintenance/other). Verifieer dat het `repair` + ~0.97 + <1 sec teruggeeft.
3. **Kies één revenue-stream.** Method één (instant quotes) als je lokaal iets wilt verkopen. Method drie (guard skill) als je meer agents wilt runnen met minder micromanagement.
4. **Bouw één prototype.** Per method:
   - Method 1: price table voor één trade in één stad. Widget op een placeholder business. Demo via QR-code.
   - Method 2: catalog + bands voor één business. Widget met hun catalog-vragen. Demo via QR-code.
   - Method 3: skill file met de 5 (of 6) vragen. Fake day van 40 acties. Verifieer dat alle bad geweigerd worden, alle normal doorgaan.
5. **Verkoop één ding.** Eén demo, één kaart, één conversatie. Niet tien tegelijk.

**Wat je NIET doet op dag één.**
- Geen product. Drie streams, geen platform.
- Geen productie zonder eigen domein of eigen site-copy.
- Geen multi-trade of multi-stad setup.
- Geen prijs noemen die je niet kunt onderbouwen met vendor-cijfers.

**Tools om klaar te zetten.**
- Vercel account + `AI_GATEWAY_API_KEY` in `.env`.
- Node + npm.
- LLM-account voor de **writing** model (Kimi K3, Claude, of equivalent — Jev doet het schrijven niet).
- Voor method 1: scraping-tool voor price pages (Playwright of Apify).
- Voor method 3: agent waar je de guard skill in laadt (Hermes, GrokBot, of eigen runtime).

**Canonieke vraag die je morgen stelt.** "Welke stream, welke business, welke threshold?" Dat is de input voor de eerste build. De rest volgt.

---

## Provenance

| Veld | Waarde |
|---|---|
| Bron | "How to make money with Jev (FULL GUIDE)" door `everestchris` op Substack, gedeeld door founder in chat op 2026-09-20 |
| URL | Geen publieke URL beschikbaar in deze sessie — bron is het originele chat-bericht |
| Datum | 2026-09-19 (volgens Substack-publicatie-context van andere posts in dezelfde reeks) |
| Confidence | Hoog voor Jev-specs (Choice/Score/Noul, pricing, latency) — bevestigd door 4 externe bronnen in `web_search`-resultaten (apidog.com, flaviocopes.com, juliangoldie.com, thefuturist.co); hoog voor 3-method-structures (direct uit bron); medium voor run-cijfers (één auteur, één niche); laag voor prijzen per stream (placeholder in bron) |
| Externe validatie | TypeSafe's eigen docs (`typesafe.ai`), pricing via Vercel AI Gateway (`$0.042/1M input, output free`), runtime via OpenRouter (`typesafe-ai/jev`). Pricing-numbers zijn vendor-stated — niet onafhankelijk gereproduceerd |
| Wat zou dit onderzoek sluiten | Een tweede onafhankelijke run in een andere niche of andere stad; threshold-tuning op echte klant-data; price-onderzoek per revenue-stream uit een canonieke bron |

## Cross-references

- `/_shared/jev-policy-canon.md` — **primaire cross-reference**. Dit document past action-types vocabulary, fail-mode matrix, en retention classes toe op drie concrete revenue-streams. Ronde 14 canon is de abstracte bron; dit is de eerste concrete toepassing.
- `/_shared/retention-policy-canon.md` — voor opslag van run-output, schema-responses, en audit-trails. Default `operationeel` (30 dagen denkrichting) tenzij anders aangegeven.
- `research/local-ai-agency-workflow.md` — companion-document. Daar zit de **find/score/build/record** loop (websites bouwen); hier zit de **Jev-decision** laag (welke actie mag). Twee documenten samen = de lokale-AI-agency operatie.
- `research/djinlabs-blombies-fit-research.md` — voor blobbies' Jev-hosting: een Blobbies-Skill kan via `~/.blobbies/skills/` gespiegeld worden vanuit `/djinlabs/skills/blobbies/`.
- `decisions.md` — Ronde 16+ is de frontier waar dit zou kunnen landen als canonieke workflow binnen Webrnds.
- `research/matt-pocock-custom-skills-proposal.md` — voorstel voor `webrnds-r-and-d-prototype` skill die qua structuur vergelijkbaar is (throwaway prototype + verdict).

## Wat NIET canon is in dit document

- Concrete code (vercel AI SDK calls, widget-componenten, schema-definities). Implementatie-detail.
- Specifieke API-keys. Secrets per run, niet canon.
- Prijzen per revenue-stream. Founder-call.
- Threshold-waarden voor specifieke niches (kanoniek: 0.7/0.8/0.9 als **ranges**, niet als commitments — afhankelijk van actiekosten in die context).
- Buitenlandse of niet-HVAC niches. Uitbreiding Ronde 16+.
- Vergelijking met TypeSafe-direct-API vs. Vercel Gateway vs. OpenRouter. Bron specifiek noemt Vercel; andere paden zijn canoniek equivalent maar niet in scope hier.