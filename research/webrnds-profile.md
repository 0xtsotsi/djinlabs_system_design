---
name: webrnds-profile
description: Webrnds agency-profiel voor agent-referentie. Geeft antwoord op "wie is Webrnds, wat verkopen we, hoe klinken we, hoe verschillen we van Codavo". Triggert wanneer een agent Webrnds moet positioneren, een pitch moet schrijven, of moet beslissen of een prospect bij Webrnds past.
status: reviewed
review_status: reviewed
created: 2026-09-21
reviewed: 2026-09-21
reviewer: founder
owner: djin
context_bronnen:
  - webrnds/start.md (purpose + boundaries + done-definitie)
  - webrnds/AGENTS.md (sub-router + Codavo-shape services als canoniek aanbod-palet)
  - research/codavo-competitive-brief.md (wedge-positionering)
  - decisions.md Ronde 1-5 (naam, venture-positionering, revenue model)
  - research/jev-treg-blobbies-icm-integration-blueprint.md (architectuur-context)
review_process: founder leest + past frontmatter aan naar `reviewed` of stuurt bij
prior_artifacts: geen — dit is het eerste profiel-document
---

## TL;DR

Webrnds is de **uitvoerende onderneming** onder het DjinLabs-template. Het levert Codavo-shape maatwerksoftware aan het Nederlandse MKB — websites, webapps, klantportalen, API-koppelingen, AI-integraties, GEO/AI-vindbaarheid, SaaS MVP — tegen Codavo-comparabele prijzen, met **één fundamenteel verschil**: Webrnds' architectuur (1-folder umbrella, ICM-folder-systeem, agents orthogonal aan UI, Jev/Treg als orkestratie) is **expliciet een systeem dat compoundt**, geen freelance-engineer-agenda.

**Tagline (proposal):** *"Maatwerksoftware die met je meegroeit — niet alleen bij livegang, maar bij elke volgende klant."*

**Pitch in één zin:** *"Codavo bouwt met één engineer voor één klant tegelijk; Webrnds bouwt met één engineer voor tien klanten tegelijk omdat het onderliggende systeem het werk voor de volgende klant al heeft gedaan."*

---

## 1. Wie is Webrnds

| Veld | Waarde |
|---|---|
| **Naam** | Webrnds ("**W**eb + **r**esearch **a**nd **D**evelopment **S**ervice") — afkorting, niet uitgesproken |
| **Domein** | webrnds.com (nog niet live — vervangt Slack-kanaal) |
| **Onderneming** | Eénmanszaak (KVK-volgorde nog te bepalen bij eerste facturatie) |
| **Eigenaar** | Stichtend engineer (founder) |
| **Bestaansreden** | Factureren + uitvoeren van DjinLabs-template-diensten aan externe klanten |
| **Differentiator t.o.v. Djinlabs** | Webrnds is venture (facturatie + klantreis-uitvoering). Djinlabs is umbrella (agents, skills, canon-discipline). |
| **Revenue model** | Hybrid: platform-licentie intern op DjinLabs + Codavo-shape bouwdiensten (Ronde 1/Q3) |
| **Bus factor** | Architectuur is ontworpen voor bus-factor > 1 (zie wedge §6) |

---

## 2. Wat verkopen we (Codavo-shape aanbod-palet)

Overgenomen uit `webrnds/AGENTS.md` (canoniek) + `webrnds/start.md`:

| Dienst | Prijs-band | Pitch |
|---|---|---|
| **Maatwerk website** | vanaf €2.500 eenmalig | SEO-vriendelijk, met slimme intake of klant-tool inbegrepen |
| **Workflow-automatisering** | vanaf €2.000 (losse integratie) — €5.000+ (complete eerste workflow) | Terugkerend handwerk verdwijnt uit je proces |
| **API-koppelingen** | geïntegreerd in automatisering of webapp | CRM/ERP/Planning systemen koppelen zonder handwerk |
| **Maatwerksoftware / Webapplicatie** | vanaf €5.000 eenmalig — €10.000+ (compleet platform) | Portaal, dashboard of applicatie rond uniek bedrijfsproces |
| **Klantportaal** | geïntegreerd in webapp of als stand-alone | Documenten, status, planning, aanvragen op één beveiligde plek |
| **AI-integratie** | geïntegreerd in webapp of als losse dienst | Documentverwerking, kennisassistent, slimme intake — met menselijke controle |
| **SaaS MVP** | vanaf €5.000 + €0-20/m hosting | Eerste betalende klanten bedienen, van daaruit doorgroeien |
| **GEO / AI-vindbaarheid** | als abonnement of losse scan | Zichtbaar in ChatGPT/Gemini-shortlists — niet alleen Google |

**Abonnementen na livegang:**

| Plan | Prijs | Voor wie |
|---|---|---|
| Los | €0-20/m hosting | Weinig wijzigingen verwacht |
| Onderhoud | €175/m | Actief bijgehouden willen worden |
| Groei | €400/m | Maandelijks prestatierapport + keyword-tracking |
| **Groei Pro** | vanaf €1.500/m | SEO + AI-zichtbaarheid uitgevoerd, niet alleen geadviseerd |

**Support-tarief na livegang:** €125/uur per kwartier afgerekend (Codavo-comparabel).

---

## 3. Brand voice — hoe klinken we

**Stem:** Direct, senior, geen bureau-overhead. Geen marketing-buzzwords. Geen "transform", "leverage", "synergy", "game-changing".

**Doelgroep-toon:** Praat met de **ondernemer die WordPress/Wix ontgroeid is maar geen agency nodig heeft**. Niet met de CTO. Niet met de marketing-manager.

**Voorbeeld-zinnen (in Webrnds-stem):**

> "Je website gaat live. En dan begint het pas — maar bij ons gaat het door via dezelfde architectuur als onze interne tooling, niet via een hand-coded portaal."

> "We bouwen niet één project. We bouwen één systeem dat het volgende project goedkoper maakt."

> "Je werkt direct met de engineer die het bouwt. Geen accountmanagers. Geen 'laat me even oppakken'."

**Vermijden:**

- ❌ "Wij transformeren jouw bedrijf met AI"
- ❌ "Onze oplossing is een game-changer"
- ❌ "Schaalbaar, flexibel, toekomstbestendig"
- ❌ "Synergie tussen mens en machine"

**Toegestaan:**

- ✅ "Systeem dat met je meegroeit"
- ✅ "Onder architectuur"
- ✅ "Compoundt" / "samengesteld"
- ✅ Specifieke cijfers: "$22K besparing per jaar", "5-7× sneller", "<1s latency"

---

## 4. Doelgroep (ICP)

**Primair:** Nederlands MKB en groeiende bedrijven, met dezelfde verticals als Codavo:

- Technische organisaties, installatiebedrijven, logistieke dienstverleners
- Productiebedrijven
- SaaS-teams in early-traction fase
- Klinieken (cosmetisch, medisch)
- Ondernemers die WordPress/Wix ontgroeid zijn

**Buyer signal:** budget ≥ €2.500, voorkeur voor "direct met de engineer", frustratie met agencies.

**Niet ons:** bedrijven die eenmalig een simpele website nodig hebben (dat is Wix/SquareSpace-territorium), enterprises met eigen IT-afdeling (dat is consultancy-territorium).

---

## 5. Pitch-structuur — hoe we een gesprek openen

In drie zinnen, naar analogie van Codavo's "30 minuten vrijblijvend":

1. **Wat je krijgt:** een website/webapp/portaal dat **met je meegroeit**, niet alleen bij livegang.
2. **Hoe het werkt:** je werkt direct met de engineer, in korte stappen met werkende previews, en het systeem erachter wordt elke keer iets slimmer.
3. **Wat het kost:** één vast team, één vast uurtarief (€125/uur, per kwartier afgerekend), geen bureau-overhead, en **je code is van jou** — geen lock-in.

**Vervolg:** na 30 minuten weet de prospect of er een match is. Geen verplichtingen, geen verkooppraatje.

---

## 6. Wedge tegen Codavo (samenvatting uit codavo-brief)

Drie verschillen die Codavo zelf in zijn eigen materialen blootgeeft:

| Webrnds | Codavo |
|---|---|
| **Systeem onder de UI** — ICM-folder-systeem + agents orthogonal + Jev-decision-layer zijn first-class | Stack levert pages, niet decision-onderbouw |
| **Compounding assets** — elke nieuwe klant maakt de volgende klant goedkoper | Service-pagina's zijn 10× near-identiek (geen compounding) |
| **Bus-factor > 1 by structure** — monorepo + workspace-structuur + template-spawn | Bus-factor = 1 Sjoerd (liability cap €10K/event in terms §14.2) |

**Bron:** `research/codavo-competitive-brief.md` §"Wedge for Webrnds" (regel 88-94), bevestigd door 2026-09-21 delta-sectie.

---

## 7. Hoe een agent dit profiel gebruikt

**Trigger:** een agent ontvangt een vraag over Webrnds, een pitch moet schrijven, of moet beslissen of een prospect bij Webrnds past.

**Stappen:**

1. Lees `webrnds/profile.md` (dit document).
2. Voor positionering t.o.v. concurrent: lees `research/codavo-competitive-brief.md`.
3. Voor architectuur-context: lees `research/jev-treg-blobbies-icm-integration-blueprint.md`.
4. Voor canonieke regels (boundary, sync): lees `webrnds/AGENTS.md` + `_shared/sync-discipline-canon.md`.
5. Bij twijfel: vraag **founder** (zie §10 voor twijfel-cases).

---

## 8. Wat Webrnds NIET is (negatieve definitie)

Om te voorkomen dat agents Webrnds verwarren met Djinlabs of met andere ventures:

| Webrnds is NIET | Want |
|---|---|
| Djinlabs | Djinlabs is umbrella — agents, skills, canon. Webrnds factureert. |
| Een agency | Geen team, geen accountmanagers — één founding engineer + orthogonal agent-orkestratie. |
| Een template-shop | Geen herbruikbare Wix-achtige templates — compounding door architectuur, niet door copy-paste. |
| Een WordPress/Wix-vervanger | Onze doelgroep heeft WordPress ontgroeid. |
| Een consultancy | We bouwen en onderhouden, we adviseren niet. |
| Open-source / gratis | We factureren per project + abonnementen, niet per uur vrijblijvend. |

---

## 9. Wat Webrnds nu is versus wat het wordt

**Nu (research-fase, Ronde 17+):**

- Naam vastgelegd (Ronde 1/Q5)
- Codavo-shape aanbod-palet canoniek vastgelegd in `webrnds/AGENTS.md`
- Wedge t.o.v. Codavo gedocumenteerd in `codavo-competitive-brief.md`
- 6-fasen-pipeline (01-research t/m 06-na-livegang) als skeletons aanwezig
- Geen live klanten, geen gefactureerde omzet
- Geen live website (webrnds.com nog niet live)

**Wordt (architectuur-lock + eerste klant):**

- Live website op webrnds.com (Codavo-shape, maar met Djin orthogonal-architectuur als verschil)
- Eerste klant via folder-shape-hook om de skeleton te valideren
- Klantportaal gedogfoodd (zelfde architectuur als interne tooling)
- Revenue: facturatie per project + abonnementen

---

## 10. Twijfel-cases — wat te doen

Bij twijfel of iets bij Webrnds past:

| Twijfel | Actie |
|---|---|
| "Past deze prospect bij Webrnds?" | ICP-check §4. Bij twijfel: 30-min gesprek voorstellen. |
| "Hoeveel kost [dienst]?" | Prijs-band §2. Bij twijfel: €125/uur als honest default, nooit minder. |
| "Kunnen we [techniek] aanbieden?" | Tech-stack §11 + check of Djin orthogonal-architectuur 't ondersteunt. |
| "Codavo doet dit ook — wat maakt ons anders?" | Wedge §6. |
| "Dit valt buiten mijn mandaat" | Vraag founder. Geen auto-promotie (Ronde 14 hard rule). |

---

## 11. Tech-stack (kort, voor agent-context)

Webrnds gebruikt dezelfde stack als Codavo (Nuxt + Vue + TS, Supabase, Cloudflare), met één verschil: **de architectuur eromheen** is anders.

| Laag | Codavo | Webrnds |
|---|---|---|
| Frontend | Nuxt + Vue + TS + Tailwind | idem (zelfde stack) |
| Backend | Supabase (Postgres + Auth + RLS + Storage) | idem |
| Edge / Hosting | Cloudflare CDN + Workers | idem |
| Payments | Mollie + Stripe | idem (zelfde) |
| **Architectuur** | Pages-only | **1-folder umbrella + ICM + Jev-decision-layer + Treg-tool-orkestratie + orthogonal agents** |
| **Klantportaal** | Hand-coded (app.codavo.nl) | **Zelfde architectuur als interne tooling** (Djin orthogonal) |

Het verschil zit **niet in de stack**, maar in **wat eromheen gebouwd wordt**. Zie `research/jev-treg-blobbies-icm-integration-blueprint.md` voor de architectuur.

---

## 12. Wat dit document NIET is

- ❌ **Geen canoniek bestand** — staat in `/research/`, niet in `/_shared/`. Voor canonieke opname is founder-commit + `decisions.md`-vermelding nodig (Ronde 14 sync-discipline).
- ❌ **Geen sales-pitch** — wel brand-voice. Voor concrete pitches: founder maakt.
- ❌ **Geen website-content** — de uiteindelijke webrnds.com-content wordt apart geschreven.
- ❌ **Geen codavo-copy** — wedge is observatie, geen aanval.

---

## 13. Bron-bewijs

| Source | Datum | Methode |
|---|---|---|
| `webrnds/start.md` | 2026-09-19 | Hand-written door founder, Ronde 1/Q5 |
| `webrnds/AGENTS.md` | 2026-09-19 | Hand-written, Ronde 8 codavo-shape services als aanbod-palet |
| `research/codavo-competitive-brief.md` | 2026-09-19 (agent 333fabd4) + 2026-09-21 (delta) | Mixed: agent-research + curl-extractie |
| `decisions.md` Ronde 1-5 | 2026-09 | Founder-sessie, hand-written |
| `research/jev-treg-blombies-icm-integration-blueprint.md` | 2026-09-21 | Hermes MiniMax-M3 sessie |
| `_shared/sync-discipline-canon.md` Ronde 16 | 2026-09 | Founder-commit |
| `webrnds/01-research/CONTEXT.md` | 2026-09-19 | Founder-canoniek (process-regels) |

---

## 14. Volgende stappen (kanoniek-neutraal)

Als dit profiel door founder wordt goedgekeurd (frontmatter `status: reviewed`):

1. **Cross-reference in `webrnds/AGENTS.md`** toevoegen onder "Wat hier woont" → verwijzing naar `/research/webrnds-profile.md` voor brand-voice-pitches.
2. **Cross-reference in `research/codavo-competitive-brief.md`** toevoegen — link van wedge-sectie naar dit profiel.
3. **In Ronde 18 grill (design-doc drift)** kan dit profiel expliciet vermeld worden als **Webrnds-brand-document** voor agents.

**Niet vanzelfsprekend:**

- ❌ Geen rename van bestaande files
- ❌ Geen executable code
- ❌ Geen canon-promotie zonder founder-commit
- ❌ Geen website-content uit dit profiel genereren zonder review

---

## Handoff Notes for Next Agent

Als je morgen verdergaat:

1. **Twijfel je over een pitch of positionering?** Lees §3 (brand voice) en §6 (wedge).
2. **Wil je een nieuwe dienst toevoegen?** Check of Codavo 'm ook heeft (parity-patroon) — anders kan het een differentiator zijn, maar dan moet het in `decisions.md` als frontier-item.
3. **Wil je de tagline wijzigen?** Eerst founder-review. De huidige is een **proposal**, niet canoniek.
4. **Twijfel over ICP-fit?** Check §4 + §10 twijfel-cases.
5. **Architectuur-vraag?** Dit profiel is brand/positionering, niet architectuur. Voor architectuur: `research/jev-treg-blombies-icm-integration-blueprint.md`.

---

## Notities voor audit-trail

- Dit profiel is **het eerste** expliciete Webrnds-brand/positionering-document. Eerdere verwijzingen stonden verspreid in `start.md` (purpose) + `AGENTS.md` (Codavo-shape services) + `codavo-brief` (wedge).
- **Vereenvoudigt** toekomstige agent-werkzaamheden: één bron voor "wie is Webrnds, wat doen we, hoe klinken we".
- **Vereenvoudigt** sync-discipline: bij elke Webrnds-wijziging kan dit profiel expliciet als referentie-punt dienen.
- **Beperking:** pitch-tekst in §3 is voorbeeld-toon, geen verplichte formulering. Founder kan afwijken.