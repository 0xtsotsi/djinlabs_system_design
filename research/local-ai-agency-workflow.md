---
name: local-ai-agency-workflow
description: Workflow-template voor het geautomatiseerd vinden, scoren, bouwen en opnemen van gefixte websites voor lokale bedrijven met slechte websites. Trigger wanneer je praat over "local AI agency", "website fixer", "HVAC outreach loop", "find-score-build-record", of wanneer je dit specifieke 4-stappen loop in een nieuwe context wilt hergebruiken.
---

# Local AI Agency — workflow-template

> **Bron.** Dit template is een research-rapport + workflow-canoniek voor de **find / score / build / record** loop uit "How to run a local AI agency (FULL GUIDE)" door `everestchris` (Substack, gedeeld door founder in chat op 2026-09-20). Geen publieke URL beschikbaar — bron is het originele chat-bericht. Provenance onderaan.
>
> **Doel.** Document dat jij (of een agent) morgen opent en waarmee de loop **draait** zonder dat de context opnieuw uitgelegd hoeft te worden. Geen executable code — een **canoniek recipe** dat de volgende stap helder maakt.
>
> **Audience.** Founder + agent die dit voor het eerst uitvoert.
>
> **Matt Pocock skills toegepast.** `/research` (provenance header, cited source), `/triage` (state-machine voor de 4 stappen), `/handoff` (expliciete morgen-section), `writing-for-agents` (frontmatter, leading words, information hierarchy), `/prototype` (de "fixed site" is een prototype), `/improve-codebase-architecture` (umbrella-plaatsing via vocabulary-mapping).

## TL;DR

**Vier commando's, één loop, één business-model.** Vind lokale handwerkens (HVAC, plumbing, electrical, roofing, pest control, garage doors, locksmiths) waarvan de website kapot is. Scoor ze automatisch op twaalf checks. Bouw een gefixte site in 15 minuten voor minder dan een dollar. Neem een video op van oude-naar-nieuwe site. Stuur een kaart met de before/after. Founder keurt elke batch goed vóór verzending.

**Kernvondst uit de bron-run.** Van de kleine HVAC-bedrijven in een metro met een website op Google, stuurt **één op de tien** bezoekers naar een dead, expired, for-sale of gehijackte pagina — soms zelfs een gambling site. Dat is geen lekkende emmer, dat is een open kraan.

**Kill-switches (canoniek).**
- Stop en vraag vóór drie dingen: een flagged site bouwen, een batch versturen, een prijs noemen.
- Eén form-submit per site, ooit. Schrijf de `submitted`-flag vóór je het resultaat leest.
- Drie-minuten-cap per site. Als 't hangt, sla over en log waarom.

---

## Vocabulary mapping (umbrella-plaatsing)

Vocabulary-mapping per `improve-codebase-architecture`-skill, om dit document in DjinLabs × Webrnds × Djin × blobbies umbrella te plaatsen.

| Canon-term | Workflow-term | Notitie |
|---|---|---|
| agent | `find` / `score` / `build` / `record` (vier sub-agents) | Eén per loop-stap, niet één god-agent |
| skill (Ronde 11) | skill-contract (per stap) | Wat de agent moet doen, niet hoe |
| routines | dagelijkse of wekelijkse run-cadans | "weekly: find nieuwe trade+city, dan score alles nieuw" |
| home folder | `research/local-ai-agency-workflow/` | Canonieke plek voor deze canonieke bron |
| instance | **niet** | Dit is geen venture (geen facturatie). Het is een workflow die onder één venture (Webrnds) draait. |

**Module-fit.** Dit is **geen nieuwe instance** (Webrnds = instance #1). Het is **geen agent-laag-uitbreiding** — de vier sub-agents zijn binnen één venture. Het is **een executable template** die onder `/djinlabs/skills/` of als Ronde 16+ workflow-spec zou kunnen landen, niet vandaag.

---

## 1. De loop — vier stappen als state-machine

Per `/triage`-skill: de vier stappen zijn een **state-machine**, geen sequentie. Elke staat heeft inputs, process, outputs, en een kill-switch. Auto-promotie naar de volgende staat vereist een **score-drempel** of expliciete founder-call.

```
[untouched] → find → [listed] → score → [scored] → build → [built] → record → [recorded] → outreach → [sent]
                  ↓            ↓                ↓                ↓                    ↓
              rejected     rejected        not-built        not-recorded         not-sent
                            (flagged)        (manual pick)   (manual pick)        (manual pick)
```

**Auto-promotion regels.**
- `untouched → find`: altijd (draait op schedule).
- `find → listed`: alleen als het Google Places-resultaat voldoet aan de keep-filters.
- `listed → scored`: altijd, tenzij site-unreachable.
- `scored → built`: **alleen handmatig** door founder. Auto-build voor `clean score ≥ 5`.
- `built → recorded`: altijd (geen founder-approval nodig voor de opname).
- `recorded → outreach`: **alleen handmatig** door founder. Auto-batch is **niet** canoniek.

### 1.1 `find` — lijst per trade per stad

**Doel.** Elke small-trade-business in een stad vinden, gefilterd op de keepers.

**Inputs.** Stad (string), trade (string uit canonieke niches-lijst — zie §3). Geocode van de stad via Google Geocoding API.

**Process.**
1. Geocode de stad; pad de viewport met 50% aan elke kant; splits in een 3×3 grid.
2. In elke cel: Google Places Text Search met drie phrasings van de trade. Max drie pagina's per cel.
3. Filter keepers:
   - Operational (geen permanently closed)
   - Telefoon aanwezig
   - Straatadres aanwezig
   - Website aanwezig
   - Onder 60 Google reviews
4. Drop websites die een social page, directory entry of site-builder-subdomain zijn.
5. Voor elke keeper: rating, review count, photos, hours, laatste vijf reviews, Google "write a review"-link.

**Outputs.** Tabel per trade per stad. Verplichte velden: `id`, `address`, `phone`, `website`, `rating`, `review_count`, `photo_count`, `hours`, `last_five_reviews`, `review_write_url`.

**Canonieke niches.** HVAC, plumbing, electrical, roofing, pest control, garage doors, locksmiths. Trade-detectie via drie phrasings per niche, canoniek in §3.

**Kill-switches.** Geen — `find` is read-only op Google Places API. Geen outbound acties.

### 1.2 `score` — twaalf checks per site

**Doel.** Elke site opent in een echte browser, twee keer (desktop + phone). Twaalf checks, één punt per failure.

**De twaalf, gegroepeerd per check-zone.**

| Zone | Check | Pass | Fail | Unknown |
|---|---|---|---|---|
| site | contact form op home of contact page | aanwezig | niet aanwezig | niet determineerbaar |
| site | prijs of priced first step | aanwezig | niet aanwezig | — |
| site | book/schedule button of link naar scheduler | aanwezig | niet aanwezig | — |
| site | link om een Google review te plaatsen | aanwezig | niet aanwezig | — |
| site | copyright of last-modified date | ≤ 2 jaar | > 2 jaar | niet zichtbaar |
| site | HTTPS | aanwezig | niet aanwezig | — |
| mobile | telefoonnummer tappable (tel:-link) | aanwezig | niet aanwezig | — |
| mobile | page load op throttled connection | ≤ 4 sec | > 4 sec | timeout |
| google | foto-count op Google listing | ≥ 5 | < 5 | — |
| google | hours op Google listing | aanwezig | niet aanwezig | — |
| google | telefoon op site matcht Google listing | match | mismatch | niet determineerbaar |
| google | owner reply-rate op reviews | ≥ 20% | < 20% | Places API returns 'unknown' altijd |

**Pass/Fail/Unknown discipline.**
- Pass of Fail alleen als **gemeten**. Onbekend = `unknown`, nooit een gok.
- Bij form-check: submit éénmaal met fake data. Server-error of foutmelding = Fail. CAPTCHA of spam-filter die fake data blokkeert = Unknown.
- **Schrijf de `submitted`-flag vóór je het resultaat leest.** Voorkomt dubbele submits.

**Score = aantal Fail.** Rank op score (hoogste eerst), dan op review count (laagste eerst).

**Canonieke fout-categorieën.**
- Score ≥ 5: **clean build candidate**. Auto-build in §1.3, tenzij flagged.
- Score 3-4: **manual pick**. Founder kiest.
- Score 0-2: **drop**, tenzij flagged (dead/hijacked).
- Flagged (dead/hijacked/for-sale): **proof card** in §1.5, geen site build.

**Process.**
1. Open elke site in Playwright (Chromium) op desktop 1440×900 en iPhone-afmetingen.
2. Sla desktop en mobile screenshot op als bewijs.
3. Run de twaalf checks. Noteer `pass` / `fail` / `unknown` per check.
4. Submit form (als aanwezig) met fake data, éénmaal, schrijf `submitted` flag vooraf.
5. Cap op drie minuten per site. Bij timeout: skip en log.

**Outputs.** Score-tabel met 12 check-velden + score + rank. Twee screenshots per site. Bewijs-pad voor elke submit (timestamp, response code).

**Kill-switches.** Drie-minuten-cap. Eén form-submit per site, ooit. Geen retry bij timeout.

### 1.3 `build` — gefixte site per business

**Doel.** Voor elke clean build candidate: een gefixte site die elke leak dicht.

**Inputs per site.** Business record (uit `find` + `score`), oude site-tekst, reviews, hours, lijst van leaks, design-brief (zie §2).

**Design-discipline (canoniek).**
- **Bright pages, big colour blocks, no dark mode.**
- **Generous spacing.** Eén minimum section-padding, vast.
- **One action colour only.** Elke button die er toe doet gebruikt 'm. Niets anders doet dat.
- **One motion language.** Eén easing + één duration, overal.
- **Accessible states voor elk interactief element.** Hover, focus, active, disabled.
- **Photography doet het zware werk.** Specifieer per pagina hoeveel images, waar ze staan.
- **Palette geseed uit business-eigen brand colours.** Sample uit screenshot van huidige site.
- **Tokens, geen raw values.** Kleur, type scale, spacing scale, radius, shadow — alles via token.
- **Functional contract IDs** (canoniek, één voor alle sites):
  - `id="call"` — tel: button in header + sticky mobile bar
  - `id="form"` — werkend formulier
  - `id="submit"` — submit-button
  - `id="confirmation"` — bedankpagina na submit
  - `id="book"` — book button naar calendar
  - `id="review"` — link naar Google write-a-review

**Functional contract is canoniek.** Eén recorder script (§1.4) drijft elke site via deze IDs. De designs mogen verschillen, de IDs niet.

**Content-discipline (canoniek).**
- Alleen feiten uit de listing en de oude site.
- Services alleen als de business ze zelf noemt.
- Reviews character-for-character. Niets onder 4 sterren.
- **Nooit** uitvinden: jaren in business, licenties, awards, garanties, warranty, financing, teamleden.
- Footer zegt: photography is illustrative.

**Leak → fix mapping (canoniek).**

| Leak | Fix |
|---|---|
| Geen tappable phone | tel: button in header + sticky mobile call bar |
| Geen prijs | Priced first step ($89 diagnostic voor HVAC) |
| Geen booking | Book button naar calendar page |
| Geen form | Werkende form die de lead opslaat |
| Geen review link | Pagina naar hun Google write-a-review link |
| Reviews niet getoond | Hun echte reviews, character-for-character, ≥4 sterren |
| Geen hours | Google hours met live open-now status |
| Oude copyright | Current year |

**Process.**
1. Kimi K3 (via OpenRouter) ontwerpt en schrijft de site zelf: eigen HTML, CSS, JavaScript. Geen template.
2. Schrijft art direction voor 7-8 fotos per site, uniek voor die business. Genereer via gpt-image-2 op Replicate.
3. Audit-script controleert voor live-gang: tel:link juist nummer, alle reviews verbatim, alle images present, geen invented-claim-woorden.

**Outputs.** HTML/CSS/JS als één site per business. Audit-pass certificaat. Foto-assets in canoniek pad.

**Kill-switches.**
- Auto-build alleen voor `clean score ≥ 5`. Anders handmatig.
- Stop en vraag vóór een **flagged** site bouwt.
- Audit-script is canoniek verplicht vóór live-gang.

### 1.4 `record` — frame-by-frame video per site

**Doel.** Per built site: een minuut video die de oude site laat falen, dan de nieuwe laat werken.

**Frame-by-frame discipline.**
- 60 fps, 1440×900 (desktop) en iPhone-afmetingen (mobile).
- Per frame: scroll, cursor, animation-clock instellen → screenshot → pipe naar ffmpeg.
- Browser-builtin recorder komt uit op ~25 uneven fps. Frame-by-frame rendering = 60 fps, deterministisch.
- Een minuut video = een paar minuten render.

**Functional-contract-aandrijving.**
- Recorder drijft sites via de IDs uit §1.3 (`call`, `form`, `submit`, `confirmation`, `book`, `review`).
- Eén recorder script werkt voor elke site, ongeacht design.

**Recorder-script structuur (canoniek).**
- Stap-types: scroll to y, move to selector, click, type, wait, caption.
- Captions: overlay met fade-in/out.
- Cursor: overlay-element met click-ripple bij klik.
- Phone mode: zelfde script, iPhone viewport.

**Canonieke scene-volgorde per video.**
1. Oude site desktop. Langzame scroll. Bij elke leak: 2-seconden caption.
2. Oude site mobiel. Tap telefoonnummer. Niets gebeurt (caption: "phone not tappable").
3. Nieuwe site desktop. Scroll, call button, symptom picker, slider.
4. Nieuwe site mobiel. Fill form, submit, confirmation, booking page, review page.
5. Side-by-side still van oud (links) en nieuw (rechts), zelfde breedte.

**Outputs.** MP4-video (~1 minuut per business). Side-by-side still. Caption-script.

**Kill-switches.**
- Nooit de oude site's form submitten tijdens recording.
- Frame-budget cap (60 fps × 60 sec = 3600 frames per scene).

### 1.5 `outreach` — fysieke kaart + email

**Doel.** Voor elke built site: een fysieke kaart sturen met de side-by-side still + video-QR. Voor elke flagged site: een andere kaart met bewijs waar hun domein nu naar wijst.

**Canonieke kaart-templates.**

| Type | Front | Back |
|---|---|---|
| Built-site | Side-by-side still (oud links, nieuw rechts) | Eén regel + QR naar video |
| Flagged (dead/hijacked) | Screenshot van waar Google link landt | Eén regel ("je domein stuurt naar X") + QR naar video |

**Inputs.** Adres uit Google listing. Email uit oude site (als aanwezig).

**Process.**
1. Valideer elk adres vóór het in de batch komt.
2. Print API (Lob, Postgrid, of equivalent) voor fysieke kaarten.
3. Email-alternatief voor builders zonder postadres (minder gebruikelijk).

**Outputs.** Batch-bestand klaar voor print + email-queue. Eén sample van elke kaart-type ter review.

**Kill-switches (canoniek).**
- **Stop en vraag vóór de batch verstuurt.** Geen auto-send.
- Founder keurt elke batch goed.

---

## 2. Het design-skill-bestand (voor Kimi K3)

Het model dat elke site ontwerpt leest **één skill-bestand** voor design-discipline. Dat bestand wordt éénmaal geschreven en door elke build-run gelezen.

**Frontmatter (canoniek).**

```yaml
---
name: local-business-site-design
description: Design-system voor gefixte lokale-business sites. Tokens, motion, photography, functional-contract IDs.
---
```

**Verplichte secties.**

1. **Tokens** — colour, type scale, spacing scale, radius, shadow. Alles via token, niets via raw value.
2. **Action colour** — één kleur, canoniek "the one button colour that matters".
3. **Palette seeding** — sample uit screenshot van huidige site. Geen random palettes.
4. **Bright pages only** — big colour blocks, geen dark mode.
5. **Spacing discipline** — één minimum section-padding, vast.
6. **Motion language** — één easing, één duration, vast.
7. **Accessible states** — hover, focus, active, disabled.
8. **Photography brief** — per pagina: aantal images, locatie, art direction.
9. **Functional contract IDs** — `call`, `form`, `submit`, `confirmation`, `book`, `review`.
10. **Anti-cliché waarschuwing** — "als twee sites op elkaar lijken, is de brief niet specifiek genoeg".

**Anti-cliché-patroon.** Wat twee sites op elkaar laat lijken:
- Identieke hero-layout (altijd centered text + knop).
- Identieke font-keuze (altijd een system-font).
- Identieke palette-zwerven (altijd blauw + wit).
- Identieke motion (altijd fade-in-up).

Mitigatie: brand-seeded palette, brightness-niveau in canonieke range, één token-font maar toegestaan andere families per pagina.

---

## 3. Canonieke niches

**Werkt voor trades waar de klant iemand vandaag nodig heeft en pakt wie 't eerst bereikbaar is.**

| Niche | Phrasings (3) | Eerste stap prijs |
|---|---|---|
| HVAC | "hvac contractor", "air conditioning repair", "heating and furnace repair" | $89 diagnostic |
| Plumbing | "plumber", "plumbing repair", "drain cleaning" | $89 diagnostic |
| Electrical | "electrician", "electrical repair", "panel upgrade" | $89 diagnostic |
| Roofing | "roofer", "roof repair", "roof replacement" | gratis inspectie |
| Pest control | "pest control", "exterminator", "termite treatment" | $99 eerste service |
| Garage doors | "garage door repair", "garage door installer", "spring replacement" | $89 service call |
| Locksmiths | "locksmith", "lockout service", "rekey service" | $59 lockout |

**Buiten scope (nu).** Niches waar de klant **niet** "vandaag" beslist: lawyers, accountants, consultants, dentists (minder urgent). Werkt niet.

---

## 4. Stack (canonieke tooling)

| Stap | Tool | Kosten |
|---|---|---|
| `find` business list | Google Places API of Apify Maps actor | Per-call; Apify token alternatief |
| `score` browser checks | Playwright (Chromium) | Compute only |
| `build` site generation | Kimi K3 via OpenRouter | Per-token (~$0.50-1.00/site) |
| `build` photos | gpt-image-2 op Replicate of equivalent | Per-image |
| `record` video | ffmpeg | Free |
| `outreach` fysieke kaart | Lob, Postgrid, of equivalent | Per-kaart |

**Boundary-discipline.** Geen tool raakt canonieke folders (`/_shared/`, `decisions.md`). Output gaat in **workflow-eigen folder** zoals `research/local-ai-agency-workflow/runs/<trade>-<city>-<run-id>/`. Niets in `~/.blobbies/`, niets in `~/Documents/projects/slack/`.

---

## 5. Wat de loop NIET kan bewijzen

Drie dingen die de bron-run noemt als bekende zwaktes:

1. **Form-submit fakes.** Een sites blokkeren fake data met CAPTCHA of spam-filter en tonen geen server-error. Die tellen als `unknown`, niet als `fail`. Claim "25% heeft geen form" staat; claim "X% heeft een werkende form" staat **niet**.
2. **Owner reply-rate.** Google Places API retourneert dit niet. Altijd `unknown`.
3. **"Top of list is niet beste prospect".** Highest clean score is vaak dood-eind (verkeerde categorie, gehijackt domein, 404, redirected naar directory). Notes-column uit page-text is canoniek; auto-pick van hoogste score is **niet** canoniek.

**Discipline-implicatie.** Alles wat de loop zegt is `gemeten`. Niets wat hij zegt is `geïnterpreteerd`. Dat is canoniek.

---

## 6. Wat de loop NIET is

- **Geen SaaS-template.** Niet bedoeld als product om te verkopen.
- **Geen freelance-pitch.** Niet "ik bouw websites voor HVAC".
- **Geen black-box-loop.** Elke stap is een commando met kill-switch en zichtbaar state.
- **Geen AI-cliché.** Geen "synergy", geen "leverage", geen "transform". Specifieke acties, specifieke tools, specifieke outputs.

---

## 7. Handoff — wat jij morgen nodig hebt

**Volgorde om dit te starten.**

1. **Kies één trade in eigen stad.** §3. HVAC is veiligste keuze.
2. **Run `find` met één trade in één stad.** Kijk naar de funnel: seen / dropped / kept. Als seen < 50, grotere stad of tweede trade.
3. **Run `score` op de keepers.** Open screenshots van de top-10 vóór je de cijfers vertrouwt.
4. **Bouw één site.** Kijk op je telefoon. Als 't lijkt op een template, is de design-brief niet specifiek genoeg.
5. **Record één video.** Kijk kritisch. Eerste versie is meestal te traag of te snel.
6. **Prepareer outreach voor één business.** Review met founder. Stuur nog niet.
7. **Herhaal.** Elke iteratie scherpt de brief aan.

**Wat je NIET doet op dag één.**
- Geen multi-trade setup. Eerst één.
- Geen auto-build voor flagged sites.
- Geen batch versturen zonder founder-approval.
- Geen prijs noemen (kanoniek: pricing is een founder-call, niet in dit document).

**Tools om klaar te zetten.**
- Google Cloud project met Places API key. Of Apify account + token.
- OpenRouter API key.
- Replicate API key (of equivalent image-model).
- Print API key (Lob of Postgrid).
- Playwright in lokale runtime.

**Canonieke vraag die je morgen stelt.** "Welke stad, welke trade?" Dat is de input voor `find`. De rest volgt.

---

## Provenance

| Veld | Waarde |
|---|---|
| Bron | "How to run a local AI agency (FULL GUIDE)" door `everestchris` op Substack, gedeeld door founder in chat op 2026-09-20 |
| URL | Geen publieke URL beschikbaar in deze sessie — bron is het originele chat-bericht |
| Variant-bron | `everestchris` heeft varianten op Reddit (r/MakeMoney, r/passive_income, r/aiagents) die overlappende content tonen — voor context, niet voor citatie |
| Datum | 2026-09-18 (auteur-publicatie, volgens bron-tekst "Sep 18") |
| Confidence | Hoog voor de 4-stappen-loop en de twaalf checks (direct uit bron); medium voor de cijfers (één auteur, één niche-run); laag voor prijzen (placeholder in bron, kanoniek onbekend) |
| Wat zou dit onderzoek sluiten | Een tweede onafhankelijke run in een andere niche of andere stad; review van de twaalf checks door een tester met browser-achtergrond; prijs-onderzoek per niche uit een canonieke bron (Codavo of equivalent) |

## Cross-references

- `research/djinlabs-blombies-fit-research.md` — umbrella-context voor runtime-architectuur van agent-runtimes die deze loop zou kunnen hosten.
- `/_shared/jev-policy-canon.md` — als Jev-gates aan deze loop worden gekoppeld: fail-mode per action-site, retention classes voor run-state.
- `/_shared/retention-policy-canon.md` — kan gebruikt worden voor run-output files. Default `operationeel` (30 dagen denkrichting) tenzij anders aangegeven.
- `decisions.md` — Ronde 16+ is de frontier waar dit zou kunnen landen als canonieke workflow binnen Webrnds.
- `research/matt-pocock-custom-skills-proposal.md` — voorstel voor `webrnds-r-and-d-prototype` skill die qua structuur vergelijkbaar is (throwaway prototype + verdict).
- `/_shared/handovers/` — als een run wordt overgedragen tussen twee agents (bijv. find draait op Hermes, record op blobbies), handovers via dit pad met expliciete frontmatter.

## Wat NIET canon is in dit document

- Concrete code (Playwright-scripts, Kimi-prompts, ffmpeg-commando's). Implementatie-detail.
- Specifieke API-keys. Secrets per run, niet canon.
- Prijzen per niche. Founder-call.
- Buitenlandse niches. Uitbreiding Ronde 16+.
- B2B-services naast websites (bijv. SEO retainers). Niet in scope.