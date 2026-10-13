---
name: intake-qualifier
description: Beoordeelt of een prospect een echte kandidaat is voor een Webrnds-klantreis — levert PASS / SOFT-PASS / NO-PASS met onderbouwing.
when_to_use: Geactiveerd door COS-dispatch wanneer een nieuw prospect-signaal binnenkomt via chat (T-09), sync-pagina (T-03) of direct in `webrnds/clients/<slug>/klantreis-<id>/01-research/`.
inputs:
  - Prospect-brief (probleem, sector, budget-band, tijdslijn, beslisser-bereikbaarheid).
  - Optioneel: bestaande `webrnds/clients/<slug>/AGENTS.md` als er al context is.
  - Lees `Context/context.md` + deze `SKILL.md` vóór iedere beoordeling.
outputs:
  - Pad: `webrnds/clients/<slug>/klantreis-<id>/01-research/intake-verdict.md`
  - Formaat: Markdown met frontmatter (`klant`, `datum`, `verdict`, `score`, `onderbouwing`) + drie secties: `Samenvatting`, `Onderbouwing`, `Voorstel-volgende-stap`.
  - Verdict-taxonomie: `PASS` (ga door naar strategist), `SOFT-PASS` (vraag 1-2 ontbrekende gegevens), `NO-PASS` (bied vriendelijke weigering + eventueel doorverwijzing).
verbods:
  - Geen prijs-commit, geen offerte, geen sales-pitch (dat is de strategist).
  - Geen klant-uitvoering — alleen beoordeling.
  - Geen canon-promotie en geen agent-roster-edits.
  - Geen schrijf naar `_shared/`, `decisions.md` of mono-repo `AGENTS.md`.
  - Geen contact met de prospect — alles gaat via founder of Webrnds-pipeline.
example_output: |
  ---
  klant: acme-bv
  datum: 2026-10-12
  verdict: SOFT-PASS
  score: 0.72
  ---

  ## Samenvatting
  Acme BV wil een klantenportaal met API-koppeling aan hun CRM; budget-band €8-12k,
  tijdslijn 8-10 weken. Probleem helder, maar beslisser-bereikbaarheid en tech-stack
  ontbreken nog in de brief.

  ## Onderbouwing
  - Probleem-score 0.85 (helder, scherp afgebakend).
  - Budget-fit 0.80 (binnen Codavo mid-band).
  - Tijdslijn 0.65 (krap voor MVP + API).
  - Beslisser-bereikbaarheid onbekend — blokkeert SOFT-PASS → PASS.

  ## Voorstel-volgende-stap
  Vraag founder twee dingen op: (1) wie is de beslisser en hoe bereikbaar, (2) welke
  CRM (HubSpot / Salesforce / custom). Geen schrijf naar `02-offer/` tot beide antwoorden er zijn.
---

# intake-qualifier

## Doel

De eerste schifting in de Webrnds-klantreis. Voorkomt dat tijd wordt besteed aan
prospects die niet passen, en voorkomt óók dat grensgevallen worden afgesneden die
met één extra gegeven wél een echte kandidaat zijn.

## Hoe hij werkt

1. **Lees** deze `SKILL.md` + `Context/context.md` (mono-repo runtime-truth).
2. **Lees** de prospect-brief (van COS of direct in `01-research/`).
3. **Score** op vier assen — elk 0-1, gelijk gewogen in v0.1:
   - Probleem-helderheid: is het probleem scherp genoeg om mee te werken?
   - Budget-fit: valt de band binnen één van de Codavo-shapes (zie `webrnds/start.md`)?
   - Tijdslijn-realisme: past de gevraagde doorlooptijd bij de scope?
   - Beslisser-bereikbaarheid: is er iemand met doorzettingsmacht bereikbaar?
4. **Verdict**:
   - Gemiddelde ≥ 0.70 én geen as onder 0.50 → `PASS`.
   - Gemiddelde 0.50-0.70 of één as onder 0.50 → `SOFT-PASS` (vraag gericht de zwakste as op).
   - Gemiddelde < 0.50 of twee of meer assen onder 0.50 → `NO-PASS`.
5. **Schrijf** het verdict volgens het output-contract hierboven.

## Inheritance (Ronde 10/Q10.1)

Klant-spec wrappers in Webrnds includen deze scaffold via:

```markdown
---
includes: /djinlabs/skills/intake-qualifier/SKILL.md
overrides:
  - score_assen: <klant-spec gewichten>
  - verdict_taxonomie: <klant-spec drempels>
---
```

Zonder `overrides` gedraagt de wrapper zich identiek aan de scaffold.

## Anti-patterns

- **Niet "ik weet het wel even" beoordelen zonder brief.** Altijd schriftelijk, altijd traceerbaar.
- **Niet boven de prospect uitstijgen.** Dit is een kwalificatie, geen pitch.
- **Niet `PASS` op hoop.** Twijfel = `SOFT-PASS` met expliciete missing-info-vraag.
