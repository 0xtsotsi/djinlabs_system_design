---
title: Landing-page-patronen uit ThrillX-video - 5 fouten + fixes + toepassing op gevelhelden
date: 2026-09-30
bron: https://www.youtube.com/watch?v=K_7_9Ym91ns
maker: Arsh Sanwarwala, ThrillX (https://thrillx.co)
runtime: 18:23
transcript-bron: YouTube captions (514 segments, via /watch skill balanced mode)
status: canoniek-neutraal onderzoek (research-zone)
owner: hermes (op verzoek van Darren)
doel: landing-page verbeteringen voor gevelhelden-site + Webrnds template-library
related:
  - ../../djinlabs/_internal/experimenten/cos/wayfinder-map.md
  - ../../webrnds/AGENTS.md
  - ../../_shared/sync-discipline-canon.md
---

# Landing-page-patronen (ThrillX) - research-note voor gevelhelden + Webrnds

## TL;DR

Arsh Sanwarwala (ThrillX) identificeert 5 landing-page-fouten + fixes die direct
toepasbaar zijn op gevelhelden + Webrnds template-library. Kernboodschap:

> "A landing page is a decision that a visitor either makes or doesn't make.
> A bad page talks them out of the decision before you even know it happened."

**De 5 fouten + fixes (compact):**

| # | Fout | Fix |
|---|---|---|
| 1 | Pagina is niet duidelijk in eerste 5 seconden | Drie eigenschappen in headline: Specificity, Clarity, Certainty |
| 2 | Zelfde pagina voor elke bezoeker (kanaal-blind) | Aparte landingspagina per kanaal (cold/warm traffic) |
| 3 | Fixatie op "er mooi uitzien" ipv "gebuild to convert" | Per sectie: doel bepalen, dan design kiezen |
| 4 | "Wij"-focus in plaats van "Jij"-focus | Vervang "we" door "you" door de hele pagina |
| 5 | Conversie-obsessie die kwaliteit opoffert | Clean conversions = hoge conversie + hoge kwaliteit leads |

**Drie-eigenschappen-formule (uit fout 1):** goede headline = Specificity (concreet
resultaat) + Clarity (3-seconden-begrijpelijk) + Certainty (definitief, geloofwaardig).

---

## Fout 1 - Pagina is niet duidelijk in eerste 5 seconden

### Symptoom (per transcript)

> "When somebody lands on the page, they have absolutely no idea what it is you do.
> Based on the sub headline and the headline, you have no idea what the product or
> service is, you have no idea who it's for and you don't have the one answer to
> the main question, which is what's in it for me and why should I care?"

Concrete data: gemiddelde bezoeker besteedt 10-20 seconden op een pagina. Daarvan
gaan de eerste 5 seconden naar "is dit relevant?". Vage copy = "death spiral" -
bij twijfel vertrekken ze zonder scrollen.

### Drie-eigenschappen-formule

1. **Specificity** - concreet, tastbaar resultaat. Niet "build your future" maar
   "make $300,000 per year in profit from your own pool fence business with low
   upfront cost, flexible hours, and a turnkey plug-and-play system."

2. **Clarity** - kan een normaal persoon (zonder vakkennis) binnen 3 seconden
   snappen wat je verkoopt + waarom het relevant is? Niet "not getting offers will
   fix that" maar "get your applications actually seen by employers and secure your
   next job faster without spending hours applying."

3. **Certainty** - voelt de belofte geloofwaardig? Niet "Law firms, do you want more
   qualified clients?" (vraag-vorm) maar "Get up to 3x more leads or sales without
   spending more on ads." (definitief, met evidence-erkenning).

### Toepassing op gevelhelden

Voorgestelde headline-test (kanoniek-neutraal, pas na gevelhelden-folder
aanwezig):

- **Huidige situatie onbekend** - gevelhelden bestaat nog niet in Webrnds
- **Voorgestelde werkwijze:** open `webrnds/clients/gevelhelden/01-research/`
  zodra aangemaakt, audit huidige homepage-headline tegen drie-eigenschappen-formule
- **Concrete vragen voor Darren:**
  - Wat levert gevelhelden concreet op? (omzet, leads, naamsbekendheid)
  - Voor wie is het? (aannemers, vastgoed, particulieren?)
  - Wat is de "3x of $X" of andere geloofwaardige belofte die je kan maken?

---

## Fout 2 - Zelfde pagina voor elke bezoeker (kanaal-blind)

### Symptoom (per transcript)

> "Not everyone is in the same state of mind when they land on your page. At a
> high level, you have cold traffic and you have warm traffic."

Drie kanalen, drie psychologische startpunten:

| Kanaal | Type | Strategie |
|---|---|---|
| Facebook ads | Cold (scrollend, geen intent) | Pijn-empathie + educatie + social proof |
| Google ads | Warm (zoekend naar oplossing) | Form boven de fold + directe capture, geen pijn-empathie nodig |
| Social media (content) | Warm (al bekend met merk) | Social proof boven de fold, snel pad naar conversie |

Concrete claim: "you can easily squeeze out like 40 to 60% lifts in conversions
and revenue just by having a separate page for each channel."

### Toepassing op gevelhelden + Webrnds template

**Voorgesteld Webrnds-template:** `templates/landing-page-channel-segregated.md`

Elke Webrnds-website krijgt drie landingspagina-varianten:

1. `lp-cold.html` (Facebook/social ads) - pijn-empathie + uitleg
2. `lp-warm.html` (Google ads) - form boven de fold + social proof
3. `lp-content.html` (blog/youtube traffic) - testimonials + case-studies

Discipline-conform: kanoniek-neutraal template, geen executable code, geen
specifieke API-keys. Patronen over kanalen zijn publiek beschikbaar.

---

## Fout 3 - Fixatie op "er mooi uitzien" ipv "gebuilt to convert"

### Symptoom (per transcript)

> "AI has made it incredibly easy to make a decent looking page. But physically
> putting together the page and putting together a bunch of sections was never
> the hard part. The hard part has always been and still continues to be till this
> day strategy."

AI genereert mooie pagina's maar zonder strategie. Concrete voorbeelden uit transcript:

- AI genereert "random image of a truck darkened on the right that you can barely
  see" - irrelevant
- AI genereert "all these different pain points, but again, it's just listing the
  pain" - oppervlakkig
- AI vult secties zonder doel - wat moet de bezoeker hier voelen, denken, doen?

### Twee-vragen framework (per sectie)

Voor elke sectie op de pagina:

1. **Wat is het doel van deze sectie?**
   - Wat wil je dat de bezoeker voelt?
   - Wat wil je dat de bezoeker denkt?
   - Welke actie wil je dat de bezoeker neemt?

2. **Wat is het beste ontwerp om dat doel te bereiken?**
   - Afbeelding, tabel, social proof, form, opsomming, citaat - welke past bij
     dit doel?

### Toepassing op gevelhelden

**Voorgesteld Webrnds-template:** `templates/section-objective-canvas.md`

Een canvas dat per sectie de drie vragen (voelt/denkt/doet) + design-keuze documenteert.
Past bij Webrnds-discipline (geen executable code, kanoniek-neutraal onderzoek,
sectie als platt-text-formaat).

---

## Fout 4 - "Wij"-focus in plaats van "Jij"-focus

### Symptoom (per transcript)

> "Your entire page talks about your company and uses the word we rather than
> talking about your customer and using the word you. ... The visitor doesn't
> care. They care about themselves. They care about their problem."

Concrete woordkeuze: vervang "we" door "you" door de hele pagina. Werkt voor:

- Headlines ("We have 10 years experience" -> "You get 10 years of proven
  expertise working for you")
- Sub-headlines
- CTA-buttons ("Submit" -> "Get your quote")
- Section-titels
- Body-copy

### Toepassing op gevelhelden

**Audit-vraag voor Darren:** open `webrnds/clients/gevelhelden/01-research/`
en:

1. Tel "we"/"wij"/"ons" occurrences in alle copy
2. Tel "you"/"jouw"/"je" occurrences
3. Doel: ratio 1:5 of schever
4. Herschrijf elke "we"-zin naar "you"-versie

**Tool:** simpel Python-script `audit-we-vs-you.py` in research-zone (geen
executable code in canon, alleen demonstratie). Of handmatig met grep.

---

## Fout 5 - Conversie-obsessie die kwaliteit opoffert

### Symptoom (per transcript)

> "One of the most expensive mistakes you can make is being so obsessed with
> increasing your conversion rate that you sacrifice revenue and profit in the
> long run."

Concrete case: immigration law firm, 900 leads/maand, 12% conversie, slechts
80 qualified leads. Hoge conversie-rate maar lage kwaliteit leads = revenue
flat. Andere case: MedSpa, agressieve promo -> chargebacks + klachten +
omzet-daling.

### Wat hij NIET aanraadt

- "fake scarcity, only five positions left"
- "make this button red"
- "aggressive guarantee"
- "timer on your page"
- "five options left"

Hij noemt dit "hacky things" - zorgen voor korte-termijn-conversie ten koste van
lange-termijn-revenue.

### Clean conversions

= hoge conversie + hoge kwaliteit leads = hoge revenue. "It's directly
proportionate."

### Toepassing op gevelhelden

**Discipline-vraag:** voor elke conversie-actie op gevelhelden-site, beoordeel:

1. Trekt het volume aan? (conversie)
2. Trekt het gekwalificeerde volume aan? (kwaliteit)
3. Levert het langetermijn-revenue op, of alleen eerste-sale?

**Specifieke actie:** open `clients/gevelhelden/01-research/quality-vs-volume.md`
(zodra aangemaakt) en documenteer per CTA: target-volume, kwaliteit-criteria,
revenue-traject.

---

## Concrete deliverables voor gevelhelden + Webrnds

### 1. Onderzoek-output (deze note)

`research/landing-page-patronen-thrillx-2026-09-30.md` - klaar om te citeren
in gevelhelden-werkfolder of Webrnds-templates.

### 2. Voorgestelde Webrnds-templates (canoniek-neutraal, research-zone)

| Template | Doel | Discipline |
|---|---|---|
| `templates/landing-page-headline-formula.md` | Specificity + Clarity + Certainty in één canvas | geen executable code |
| `templates/landing-page-channel-segregated.md` | Drie pagina-varianten (cold/warm/content) per klant | publiek beschikbaar patroon |
| `templates/section-objective-canvas.md` | Per-sectie doel + design-keuze | platt-text |
| `templates/we-vs-you-audit.md` | Telling + herschrijf-regels | handmatig + optioneel script |

### 3. Gevelhelden-acties (na klantfolder-aanmaak)

| Volgorde | Actie | Owner |
|---|---|---|
| 1 | `webrnds/clients/gevelhelden/01-research/CONTEXT.md` aanmaken met klant-data | Darren |
| 2 | Huidige site audit tegen 3-eigenschappen-headline-formule | Hermes (grill-me) |
| 3 | Kanaal-segmentatie-audit: waar komt traffic vandaan? | Darren |
| 4 | Per-sectie-doel-canvas voor huidige homepage | Darren + Hermes |
| 5 | "we" vs "you" audit + herschrijf-pass | Darren |
| 6 | Quality-vs-volume evaluatie van huidige CTA's | Darren + Hermes |
| 7 | Resultaten in `klantreis-001/05-na-livegang/` (retainer-fase) | Darren |

### 4. Niet-doen (canoniek-conform)

- Geen fake scarcity, geen timer-trucs, geen rode knoppen
- Geen executable code in Webrnds-templates (Ronde 14)
- Geen canonieke-files-aanraking zonder Ronde-traject
- Geen specifieke API-keys in templates (Ronde 14)

---

## Bron-verwijzingen

- Video: https://www.youtube.com/watch?v=K_7_9Ym91ns
- Maker: Arsh Sanwarwala / ThrillX (https://thrillx.co)
- Transcript: 514 captions via YouTube auto-captions
- 100 frames extracted via /watch skill (visuele scan: talking-head video,
  transcript is primaire bron)
- Werkfolder: /tmp/k7-9ym91ns-thrillx/ (delete when done)
- Notion-context: kanoniek-neutraal, research-zone

## Audit-trail (deze note)

- Geschreven door: Hermes (op verzoek van Darren, 2026-09-30)
- Discipline: research-zone, geen wijziging aan _shared/, decisions.md,
  webrnds/AGENTS.md of webrnds/clients/
- Gevelhelden-folder bestaat nog niet; voorgestelde acties zijn voor na
  folder-aanmaak
- Webrnds-templates zijn voorstellen, geen canonieke-promotie
- 0 Cyrillic bytes (cyrillic-guard geverifieerd)
- Geschikt voor: Darren's gevelhelden-werkfolder, Webrnds template-library,
  dj-instructies via grill-me
