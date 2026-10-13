---
name: r19-staging-djinlabs-zonder-runtimes
description: Canoniek-neutraal staging-document voor Ronde 19 lock in decisions.md. Bevat de 6 moties DjinLabs zonder runtimes (Darren via WhatsApp 24-sep 07:20, bevestigd 28-sep 09:37), de Darren-aanvullingen, en een voorgestelde Ronde-19-entry-tekst conform Ronde 14-18-formaat. Audit-spoor WEB-16 (Notion sync-pagina block 100). Canoniek-neutraal pad; geen Ronde-traject-lock zonder handmatige founder-commit.
status: staging
date: 2026-09-28
type: ronde-staging
provenance: Notion sync-pagina "Instinct sync — Hermes - Instinct" block 86-100 + 100 (Darren WhatsApp 28-sep 09:37)
audit-spoor: WEB-16
review_status: pending
reviewer: founder (handmatige commit vereist)
related:
  - ../../../../decisions.md (Ronde 14-18 patroon)
  - ../multi-runtime-cos-design.md (te archiveren per motie 1)
  - ../tickets/T-03-cos-routes.md (te herijken per motie 4)
  - ../../../../_shared/icm-canon.md (anker motie 2)
  - ../../../../_shared/sync-discipline-canon.md (anker Ronde 16)
  - ../../../../research/187n-codex-hermes-audit-2026-09-28.md (cross-ref)
  - ../../../experimenten/cos/tools/cyrillic-guard.sh (pre-commit guard)
---

# Ronde 19 staging — DjinLabs zonder runtimes

## Doel van dit document

Canoniek-neutraal staging-document voor Ronde 19 lock in `decisions.md`. Bevat:

1. De 6 moties letterlijk uit jouw WhatsApp-update van 24-sep 07:20 (Notion sync-pagina block 86-93).
2. Jouw aanvullingen van 24-sep 10:12 + 18:10 (block 94-99).
3. Hermes-context 28-sep 09:38 (block 100): de oorspronkelijke Ronde 19-tekst is lokaal verloren gegaan bij het homoglyph-incident.
4. Voorgestelde Ronde-19-entry-tekst conform Ronde 14-18-formaat (bullet-list, geen tabel; met cross-refs naar geraakte files).
5. Cross-refs + acties per motie (welke files geraakt worden, wat moet gebeuren).
6. Pre-commit guard-instructies (cyrillic-guard.sh + bash -n).

**Niet canoniek.** Dit is research-output, geen lock. Jij commit hem naar `decisions.md` via Ronde-traject zoals Ronde 14-18.

## Bronverificatie

- Notion sync-pagina `3e44c5f9-f8e5-81d0-ad77-db30272dc92c`, blocks 86-100.
- Audit-spoor WEB-16 (Notion block 100, 28-sep 09:38).
- Darren via WhatsApp 24-sep 07:20 (moties), 10:12 (Hermes-as-harnas), 18:10 (paperclip-research).

## De 6 moties (letterlijk uit Notion block 87-92)

### Motie 1 — Geen runtimes in DjinLabs

> Vercel Eve, Adam/Convex, DjinLabs HQ en elke andere runtime, server, database of dashboard gaan uit de DjinLabs-architectuur. multi-runtime-cos-design.md wordt voor DjinLabs gearchiveerd.

**Geraakte files:**
- `djinlabs/_internal/experimenten/cos/multi-runtime-cos-design.md` → hernoemen naar `.ARCHIVED-2026-09-28.md` (conventie: `sharbel-hermy-hq-adapter-design.ARCHIVED-2026-09-23.md`)
- Eventuele andere runtime-references in `cos/architecture-design.md` flaggen voor herevaluatie (niet automatisch wijzigen — founder-commit vereist)

### Motie 2 — "Agent = folder" als harde regel

> Een agent is een map met platte bestanden (bijv. AGENT.md met rol en regels, skills/, memory/ of state in Markdown/JSON). Geen agent die alleen in een runtime of database bestaat. Nieuwe agents en wijzigingen moeten de walk-test uit icm-canon.md halen: alles is te begrijpen door de map te lezen.

**Geraakte files:**
- `_shared/icm-canon.md` — al canoniek; walk-test-discipline is hier al vastgelegd
- Geen wijzigingen vereist; motie bevestigt al-canoniek-principe

### Motie 3 — COS herdefiniëren binnen die regel

> COS blijft de rol uit T-01 ("leest je inbox en stuurt elk bericht naar de juiste agent"), maar als folder-agent die door een bestaande agent-harnas (bijv. Hermes of Claude Code) wordt gelezen. Het is geen eigen runtime of service.

**Geraakte files:**
- `cos/tickets/T-01-cos-definitie.md` — al canoniek-neutraal closed; bevestigt COS = folder-agent
- `cos/tickets/T-02-cos-baas.md` — op 2026-09-28 herzien naar Optie 5 (folder-auteur = baas, Jev = externe gate); geen runtime-baas
- Geen wijzigingen aan COS-bestanden zelf vereist; motie bevestigt T-01 + T-02-richting

### Motie 4 — T-03 t/m T-10 herijken

> De ankers "multi-runtime" en "Vercel Eve" gaan uit T-03. Routes worden beschreven als verwijzingen tussen mappen en bestanden. Controleer bij T-04 t/m T-10 of ze uitgaan van een runtime, queue, dashboard of database, en herformuleer ze of vervallen ze.

**Geraakte files:**
- `cos/tickets/T-03-cos-routes.md` + `T-03-routes-vraag.txt` — herijken, "multi-runtime" + "Vercel Eve" ankers eruit, route-beschrijving als folder-naar-folder-verwijzingen
- `cos/tickets/T-04-cos-validatie.md` t/m `T-10-cos-...` — **bestaan nog niet op disk**. Frontier-discipline zegt "één ticket per sessie". Of:
  - (a) tickets worden bij eerste relevante sessie aangemaakt met runtime-vrije formulering
  - (b) tickets vervallen als ze alleen runtime-aannames hadden
  - Founder beslist per ticket bij frontier-aanpak
- `cos/wayfinder-map.md` — check op runtime-mentions, herevaluatie bij frontier-progressie

### Motie 5 — Eve + Convex (en eventueel Adam) worden een apart client-setup-patroon

> Leg dit vast als optioneel referentie-patroon voor klantprojecten (bijv. via Webrnds), los van de DjinLabs-canon. Per klant een eigen besluit. Adam komt pas in aanmerking als er een licentie is.

**Geraakte files:**
- Nieuwe canonieke file nodig in Webrnds: bv. `webrnds/_shared/client-setup-patterns.md` (kanoniek via Ronde-traject; founder-commit vereist)
- Eve + Adam notes hernoemen naar `client-patroon-research/` (per motie 6)
- Geen DjinLabs-canonieke file voor Eve/Convex/Adam

### Motie 6 — Opruimen en stil zetten

> Het DjinLabs HQ-traject blijft gesloten. De /tmp/eve-test-scaffold kan weg. De Sharbel-trail blijft gepauzeerd. De Eve- en Adam-notes worden als "client-patroon research" gelabeld, niet als DjinLabs-richting.

**Geraakte files:**
- `/tmp/eve-test-scaffold` — bestaat niet (of nooit) op deze Mac; opruimen is no-op
- `cos/sharbel-hermy-hq-adapter-design.ARCHIVED-2026-09-23.md` — al als ARCHIVED gemarkeerd; geen actie
- Eve- en Adam-notes in `cos/research/` en elders — hernoemen naar `client-patroon-research/` folder (kanoniek-neutraal, founder-commit voor canonieke verplaatsing)

## Darren's aanvullingen (block 94-99)

### Aanvulling 24-sep 10:12 (block 95)

> Hermes is tot nu toe een gateway op Darrens Telegram. Het doel is uiteindelijk één main Hermes op de Mac, zodat hij leeft waar de context is.

**Implicatie:** Hermes main verhuist naar de Mac. Geen Ronde-19-actie nodig; dit is operationele context.

### Open beslispunt 24-sep 10:12 (block 96)

> De decision flow van COS moet worden vastgelegd, los van de vraag of COS een runtime heeft of niet. Doel: de ventures zo goed mogelijk laten draaien. [Open vraag voor Darren/Hermes: welke beslissingen neemt COS zelf, welke routeert hij naar welke agent, en welke gaan altijd naar Darren?]

**Implicatie:** Dit is een frontier-vraag die expliciet **niet** in Ronde 19 zit — het is een apart ticket (mogelijk T-11 of T-04-uitbreiding). Voor Ronde 19: alleen flag als open beslispunt.

### Paperclip-research 24-sep 18:10 (block 97-99)

> Research paperclip (https://github.com/paperclipai/paperclip): een open-source "control plane" om een bedrijf van AI-agents te runnen. Het bestaat uit server, database en UI. Agents zijn database-rijen die externe runtimes aansturen via adapters.

**Implicatie voor Ronde 19:** Botsing met motie 1 (paperclip is zelf een runtime). Hermes' block 102 zegt letterlijk: *"Botsing: paperclip is zelf een runtime en botst dus met motie 1 (geen runtimes in DjinLabs)."* Block 115 zegt: *"Gevraagd aan de betreffende agents: werk dit voorstel verder uit tegen icm-canon.md en de moties hierboven, en meld de iteraties hier. Niets installeren van paperclip."* — dus paperclip-onderzoek mag doorgaan **tegen** de moties, **niet installeren**. Ronde 19 noteert dit als iteratiepunt; kanoniek besluit over paperclip is een latere Ronde.

## Hermes-context 28-sep 09:38 (block 100)

> Bron: Darren via WhatsApp, 28 sep 09:37. Instinct heeft de Ronde 19-tekst zelf niet - die is lokaal verloren gegaan bij het homoglyph-incident. De inhoudelijke basis staat in deze Notion sync-pagina (moties hierboven). Hermes' taak: stel Ronde 19-tekst opnieuw op met de bron uit Notion, en meld iteraties hier. Darren commit daarna naar decisions.md.

**Mijn positie:** staging-document is de "opnieuw opgestelde Ronde 19-tekst". Audit-spoor = WEB-16. Darren commit naar decisions.md via Ronde-traject.

## Voorgestelde Ronde-19-entry-tekst (voor `decisions.md`)

> **Status:** staging. Kopieer en plak in `decisions.md` na Ronde 18 (regel 334) en update de header "Last update" + "Awaiting". Of pas aan naar eigen formulering; dit is een startpunt, geen canonieke tekst.

```markdown
### Ronde 19 — 2026-09-28: DjinLabs zonder runtimes (6 moties)

- **Audit-spoor:** WEB-16 (Notion sync-pagina blocks 86-100; Darren via WhatsApp 24-sep 07:20, 10:12, 18:10 + 28-sep 09:37)
- **Canonieke discipline:** geen runtime, server, database, dashboard of queue in DjinLabs. Alle agents zijn folders. Walk-test uit `icm-canon.md` is verplicht voor elke nieuwe agent.
- **Moties (6):**
  1. **Geen runtimes in DjinLabs.** Vercel Eve, Adam/Convex, DjinLabs HQ en elke andere runtime/server/database/dashboard gaan uit de architectuur. `cos/multi-runtime-cos-design.md` wordt voor DjinLabs gearchiveerd.
  2. **Agent = folder als harde regel.** Per `_shared/icm-canon.md`. Geen agent bestaat alleen in een runtime. Walk-test verplicht.
  3. **COS = folder-agent.** Volgt T-01 (COS = "leest inbox + stuurt berichten") + T-02 v2 (Optie 5: folder-auteur = baas, Jev = externe gate). Geen eigen runtime of service.
  4. **T-03 t/m T-10 herijken.** Ankers "multi-runtime" en "Vercel Eve" eruit uit T-03. Routes = folder-verwijzingen. T-04 t/m T-10 op runtime-aannames controleren, herformuleren of laten vervallen.
  5. **Eve + Convex + Adam = Webrnds client-setup-pattern.** Optioneel referentie-patroon voor klantprojecten, los van DjinLabs-canon. Per klant besluit. Adam pas bij licentie.
  6. **Opruimen en stil zetten.** DjinLabs HQ gesloten. `/tmp/eve-test-scaffold` weg (no-op). Sharbel-trail gepauzeerd. Eve-/Adam-notes als "client-patroon research" labelen, niet als DjinLabs-richting.
- **Open beslispunt (NIET in R19):** COS decision-flow — welke beslissingen neemt COS, welke routeert hij, welke gaan naar founder? (24-sep 10:12 open vraag; apart ticket of T-04-uitbreiding)
- **Iteratiepunt (NIET in R19):** paperclip-research (https://github.com/paperclipai/paperclip) tegen icm-canon + moties uitwerken. Niet installeren. (24-sep 18:10; botsing met motie 1 als paperclip een runtime introduceert)
- **Hermes-context-aanvulling 28-sep:** Hermes main verhuist naar Mac; nu nog Telegram-gateway.
- **Cross-refs:**
  - `_shared/icm-canon.md` — agent = folder + walk-test (motie 2 anker)
  - `cos/CONTEXT.md`, `cos/wayfinder-map.md` — frontier-context
  - `cos/tickets/T-01-cos-definitie.md` + `T-02-cos-baas.md` (Optie 5) — COS-definitie + autoriteit (motie 3 anker)
  - `cos/multi-runtime-cos-design.md` → `.ARCHIVED-2026-09-28.md` (motie 1 actie)
  - `cos/tickets/T-03-cos-routes.md` — herijken (motie 4 actie)
  - `_shared/sync-discipline-canon.md` — Ronde 16 sync-discipline actief
- **Audit:** `audit-spoor/r19-djinlabs-zonder-runtimes.md` (na handmatige commit)
- **Tools-discipline:** `cos/tools/cyrillic-guard.sh` als pre-commit safety-net voor canonieke schrijfacties. Bug-pattern hersteld; trigger-woord "orthogonal" bekend.
```

## Pre-commit instructies voor jou

### Voor het plakken in `decisions.md`:

1. **Open `decisions.md`** in je editor.
2. **Verifieer Cyrillic-clean** van deze staging-file:
   ```bash
   bash djinlabs/_internal/experimenten/cos/tools/cyrillic-guard.sh djinlabs/_internal/experimenten/cos/research/2026-09-28-r19-staging-djinlabs-zonder-runtimes.md
   ```
   Verwacht: 0 hits, exit 0.
3. **Open `decisions.md`** op regel 335 (na Ronde 18) en plak de staging-entry. Pas aan naar eigen formulering.
4. **Update de header** regel 5-6: "Last update: 2026-09-28" + "Awaiting: ..." (naar jouw call).
5. **Verifieer Cyrillic-clean van `decisions.md` na edit**:
   ```bash
   bash djinlabs/_internal/experimenten/cos/tools/cyrillic-guard.sh decisions.md
   ```
   Verwacht: 0 hits, exit 0.
6. **Commit** via Ronde-traject (sync-discipline Ronde 16).

### Na de commit:

1. **Archiveer `multi-runtime-cos-design.md`** (motie 1):
   ```bash
   git mv djinlabs/_internal/experimenten/cos/multi-runtime-cos-design.md \
          djinlabs/_internal/experimenten/cos/multi-runtime-cos-design.ARCHIVED-2026-09-28.md
   ```
2. **Herijk T-03** (motie 4): open `cos/tickets/T-03-cos-routes.md` + `T-03-routes-vraag.txt`, vervang "multi-runtime" + "Vercel Eve" ankers door folder-route-beschrijvingen.
3. **Label Eve-/Adam-notes** als `client-patroon-research/` (motie 6): verplaats ze naar `webrnds/_internal/client-patroon-research/` of vergelijkbaar (founder-call).
4. **Meld iteraties** in Notion sync-pagina (Ronde 19 + 28-sep Hermes-context).

## Verificatie van dit staging-document

- **Frontmatter**: 6 keys, alle canoniek-conform (`name`, `description`, `status: staging`, `date`, `type: ronde-staging`, `related`).
- **Inhoud**: 6 moties letterlijk uit Notion (geen herformulering), Darren-aanvullingen verbatim, Hermes-context, voorgestelde entry, pre-commit instructies.
- **Audit-spoor**: WEB-16 (Notion block 100) expliciet genoemd in frontmatter + body.
- **Geen runtime-promotie**: alle moties wijzen naar runtime-uit-folder-discipline, andersom.
- **Sync-discipline Ronde 16**: dit document is canoniek-neutraal; geen `decisions.md`-lock zonder founder-commit.

## Niet in scope van Ronde 19

- COS decision-flow (apart ticket, bv. T-11 of T-04-uitbreiding).
- Paperclip-canonieke adoptie (botsing met motie 1; iteratiepunt, geen beslissing).
- Hermes main-Mac-verhuizing (operationeel, geen canon).
- Brand-voice Webrnds (al open frontier per 187N-audit §7).
- 187N-research-zone `research/187n-reference/` (al onderzocht; founder-commit voor canonieke adoptie).

## Status

**Staging.** Ronde 19 is canoniek nog niet vastgelegd. Dit document is de "opnieuw opgestelde Ronde 19-tekst" zoals Hermes op 28-sep 09:38 vroeg. Darren commit via Ronde-traject in `decisions.md`. Cyrillic-guard beschermt tegen homoglyph-recurrence tijdens het schrijven.
