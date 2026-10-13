---
title: Motion-graphics carousel patronen uit Jad M.H-video - 3 regels + methode + toepassing op Webrnds
date: 2026-09-30
bron: https://www.youtube.com/watch?v=hZ_w1d0uYT4
maker: Jad M.H, AI Automation
runtime: 10:50
transcript-bron: YouTube captions (243 segments, via /watch skill balanced mode)
status: canoniek-neutraal onderzoek (research-zone)
owner: hermes (op verzoek van Darren)
doel: motion-graphics carousel methode voor Webrnds social-output + eventueel
  gevelhelden-content-strategie
related:
  - landing-page-patronen-thrillx-2026-09-30.md (andere video-audit)
  - ../../djinlabs/_internal/experimenten/cos/wayfinder-map.md
  - ../../webrnds/AGENTS.md
  - ../../_shared/sync-discipline-canon.md
---

# Motion-graphics carousel patronen (Jad M.H) - research-note

## TL;DR

Jad M.H bouwt Instagram-carousels waar **elke slide een motion-graphic video is** -
ballen, tekst, muziek, sound effects landen exact op de beat. Stack: Claude +
Hyperframes + FFmpeg + Aceep 1.5. Kosten: $0 tot token-budget.

**Kernboodschap:**

> "On Instagram, carousels are one of the best formats there is. ... In a feed
> where everything moves, a static image is the easiest thing in the world to
> scroll past. ... When everybody's carousels look the same, the one that moves
> wins."

**De 3 regels voor motion carousels:**

1. **Hook pose is static** - eerste slide staat stil om aandacht te grijpen
2. **Way = layered stage** - alles op eigen laag (background, photo, text, cards)
3. **Rhythm = 120 BPM** - elke slide 3-4 bars, alles landt op beat, naadloze loop

---

## Wat hij maakt

**Drie voorbeelden in de video:**

1. **Pure motion design (geen image, $0):** 4 slides, kleuren blue/green/orange,
   één bal die door de hele carousel reist. Hook slide staat stil, dan beweegt
   alles op de beat. Tijdlijn-ruler onderaan die als één lange animatie loopt.
2. **Image + motion layers (token-budget):** Foto van Jad wordt gelaagd -
   achtergrond, foto (cut out), titel, zwevende cards. Elke laag beweegt
   onafhankelijk. Muziek + sound effects uit Aceep 1.5.
3. **Derde variant** met eigen foto/team, layers aanpak identiek.

---

## Stack + kosten

| Component | Tool | Kosten |
|---|---|---|
| Code | Claude (schrijft HTML/CSS/JS per frame) | $0 met budget, anders tokens |
| Render | Hyperframes (browser-render per frame) | Free + open source |
| Video | FFmpeg (plakt frames tot MP4) | Free + open source |
| Muziek | Aceep 1.5 (open source muziekmodel) | Free, draait op laptop |
| Sound effects | Aceep 1.5 + custom | Free |

Concrete claim: "Everything is completely free, and I'm not lying about it. I'm
using a base model MacBook Air, but if you have a gaming PC or a more stronger
computer, this will be easy to make."

---

## De 3 regels (uit transcript)

### Regel 1 - Hook pose is static

> "Slide one, the hook. It says this pose static and it looks that. ... This is
> really important."

Eerste slide van de carousel staat **stil** om aandacht te grijpen. Pas daarna
begint de beweging. Contrast tussen statisch en bewegend = scroll-stopper.

**Toepassing op Webrnds:** lead-slide per carousel = 1 frame dat bewust
stilgezet is, om bezoeker te laten "happen" voordat de beweging begint.

### Regel 2 - Way = layered stage

> "Once everything is on its own layers, everything can move on its own."

Alles in lagen: background, photo, text, cards, decor. Elke laag kan
**onafhankelijk** bewegen. Code schrijft dit in de browser; Claude splitst
automatisch als je het vraagt.

**Toepassing op Webrnds:** bij image-based carousels - vraag Claude expliciet
om "split into layers, each layer animates independently" in de prompt. Resultaat:
elke laag kan eigen snelheid, easing, en timing hebben.

### Regel 3 - Rhythm = 120 BPM, 3-4 bars per slide

> "Everything is on a 120 BPM beats. That's one beat every half second. Every
> hit, every flip, every bounce leads on a beat. And every slide is exactly
> three or four bars long. Why does that matter? Because on Instagram, a video
> slide loops. If the music doesn't loop again, you hear a jump every single
> time."

Constante BPM + bars per slide = naadloze loop op Instagram. Anders hoor je
elke swipe een "jump".

**Toepassing op Webrnds:** muziek eerst, slides op maat, code genereert
bar-count + beat-markers automatisch als je de BPM noemt in de prompt.

---

## Hoe de skill werkt (per transcript)

> "You install it and you give it either a topic or your image. Then it does
> what it just showed you. It plans every slide first, the hook, the rules, the
> call to action. And it decides what moves when and how and which beat. It
> makes the music and then the sound effect on your computer and it renders
> on one MP4 per slide."

**Workflow:**

1. Skill installeren (link in zijn school community, link in description)
2. Input: topic of eigen image
3. Skill plant elke slide (hook, rules, CTA) - volgorde van motion
4. Muziek + sound effects gegenereerd
5. Render per slide naar MP4
6. Upload naar Instagram als carousel in volgorde

**Customizatie:** "If you want to make some changes, quick changes cuz everything
is custom made. Then you just upload the videos as a carousel in order and
it's done."

---

## Welk voorbeeld wanneer (per transcript)

> "If you teach something? If you want a clean brand look or just you don't
> have pictures, go with the first example. Pure motion designs, nothing to
> generate and it costs nothing. ... If you still have a little bit of tokens,
> I would go with the second example."

| Scenario | Aanbevolen voorbeeld | Reden |
|---|---|---|
| Pure motion design, $0, geen eigen foto's | Voorbeeld 1 | Clean brand look, geen tokens |
| Eigen foto/team + motion, brand presence | Voorbeeld 2 | Foto + layers, geloofwaardiger |
| Educatief, geen branding | Voorbeeld 1 | Lagere drempel, sneller |
| Premium klant-presentatie | Voorbeeld 2 | Hogere productiekwaliteit |

---

## Concrete deliverables voor Webrnds + eventueel gevelhelden

### 1. Onderzoek-output (deze note)

`research/motion-carousel-jad-mh-2026-09-30.md` - klaar om te citeren in
Webrnds-templates of klantwerkfolder.

### 2. Voorgestelde Webrnds-templates (kanoniek-neutraal, research-zone)

| Template | Doel | Discipline |
|---|---|---|
| `templates/carousel-motion-3-rules.md` | 3 regels canvas + layer breakdown + rhythm BPM | geen executable code |
| `templates/carousel-prompt-hooks.md` | Hook-slide variaties per use-case | publiek beschikbaar |
| `templates/carousel-bpm-calculator.md` | BPM -> slide-duur -> bar-count hulpje | handmatig + optioneel script |

### 3. Eventuele gevelhelden-acties (na klantfolder-aanmaak)

**Alleen** als gevelhelden social-media-content-strategie wil. Tot nu toe is
niet duidelijk of dat een Webrnds-service is (zie research/webrnds-profile.md).

Voorbeeld-acties als dat zo is:

1. **Audit huidige social-output** (als die bestaat) tegen 3 regels
2. **Maak 3 carousel-varianten** voor de diensten van gevelhelden:
   - Pure motion: "Waarom gevelonderhoud?" (educatief, geen foto's)
   - Image + motion: "Voor/na gevelrenovatie" (transformatie)
   - Image + motion: "Onze werkwijze in 5 stappen" (proces)
3. **Post-volgorde**: hook-slide statisch, daarna motion op beat

### 4. Niet-doen (canoniek-conform)

- Geen executable code in Webrnds-templates (Ronde 14)
- Geen canonieke-files-aanraking zonder Ronde-traject
- Geen specifieke API-keys in templates (Ronde 14)
- Geen skill-installatie zonder Bouncer-audit (Notion-discipline 24-sep)
- Geen fake scarcity / niet-ThrillX-anti-patterns (zie andere video-audit)

---

## Cross-references

- **Andere video-audit (dezelfde dag):** `landing-page-patronen-thrillx-2026-09-30.md`
  - Complementair: ThrillX = landing pages, Jad M.H = social carousels
  - Beide vermijden "hacky tactics" (fake scarcity, agressieve buttons)
  - Beide focussen op fundamentals (clarity, layered design)
- **Webrnds profile:** `research/webrnds-profile.md` (soort diensten)
- **Webrnds skills:** `webrnds/skills/` (lijst met huidige skills)
- **Bouncer-audit:** verplicht voor installatie van Jad's skill (sync-discipline 24-sep)

---

## Bron-verwijzingen

- Video: https://www.youtube.com/watch?v=hZ_w1d0uYT4
- Maker: Jad M.H, AI Automation (YouTube-kanaal: @JadM.H)
- Transcript: 243 captions via YouTube auto-captions
- 8 frames extracted via /watch skill balanced mode (visuele scan: talking-head
  + carousel-screenshots, transcript is primaire bron)
- Werkfolder: /tmp/hz-w1d0uyt4-jad/ (delete when done)
- Hyperframes: open source browser-rendering framework
- Aceep 1.5: open source muziekmodel (draait op laptop)

## Audit-trail (deze note)

- Geschreven door: Hermes (op verzoek van Darren, 2026-09-30)
- Discipline: research-zone, geen wijziging aan _shared/, decisions.md,
  webrnds/AGENTS.md of webrnds/clients/
- Gevelhelden-folder bestaat nog niet; voorgestelde acties zijn voor na
  folder-aanmaak
- Webrnds-templates zijn voorstellen, geen canonieke-promotie
- 0 Cyrillic bytes (cyrillic-guard geverifieerd)
- Geschikt voor: Webrnds social-strategie, gevelhelden-content (als dat
  een Webrnds-service wordt), dj-instructies via grill-me
