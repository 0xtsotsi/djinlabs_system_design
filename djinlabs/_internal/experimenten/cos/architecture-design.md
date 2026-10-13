---
name: cos-architecture-design
description: Eerste-orde-architectuur-schets voor Chief of Staff (COS) — orthogonal aan Webrnds/Djin. Wat COS is, anti-patterns, latency-budget, frontier-overzicht. Companion van `wayfinder-map.md` met Matt Pocock wayfinder-discipline.
status: draft
version: 0.1
date: 2026-09-21
owner: djin
review_status: pending
reviewer: founder
canonieke-discipline: orthogonal aan canon (geen canonieke files aangeraakt); volgt `_shared/icm-canon.md` folder-structuur
related:
  - cos/wayfinder-map.md
  - cos/CONTEXT.md
  - research/webrnds-profile.md
  - research/jev-treg-blombies-icm-integration-blueprint.md
  - _shared/jev-policy-canon.md (Ronde 17 V1.5)
  - _shared/sync-discipline-canon.md (Ronde 16)
---

# COS Architecture Design — v0.1 (Ronde 18+ candidate)

> **Status:** Draft, niet canoniek
> **Created:** 2026-09-21
> **Owner:** djin (founder-review pending)
> **Doel:** Eerste-orde-architectuur-schets voor Chief of Staff — orthogonal aan Webrnds/Djin, met Matt Pocock wayfinder-discipline als aanpak
> **Plek:** `djinlabs/_internal/experimenten/cos/architecture-design.md` (experimenten-zone, geen canon)

---

## TL;DR

**COS (Chief of Staff)** is een **decision-orkestrator** die alle agenten (Hermes, GG, founders-werk, Webrnds-pipeline) coördineert via **Jev-classification** met **shadow-mode discipline** (zie `decision-model-routing` skill §5). COS is **orthogonal aan ventures** — het orkestreert; het factureert niet. Webrnds factureert. Djinlabs-agenten draaien orthogonal. COS is de "laag erboven".

**Doel van dit document:** Vastleggen **welke beslissingen** nog open zijn voor de eerste live COS-ronde (zie `wayfinder-map.md`). Geen executable code, geen canonieke files aangeraakt (Ronde 14 boundary-discipline).

---

## 1. Wat COS is — eerste-orde definitie

| Aspect | COS | Niet-COS |
|---|---|---|
| **Rol** | Orkestrator | Venture, agent, of tool |
| **Inputs** | Binnenkomende tasks/berichten/requests van meerdere agents | Domein-specifieke inputs |
| **Outputs** | Routing-beslissingen + audit-trail | Uitvoerend werk |
| **State** | Tijdelijke routing-state per sessie + audit-spoor (JSON per ADR 0001) | Venture-state, agent-state, project-state |
| **Canon** | Volgt `_shared/jev-policy-canon.md` (Ronde 17 V1.5) + nieuwe COS-canon (toekomst) | Volgt venture-/agent-canon |
| **Latency** | Accepteert 900-1300ms per Jev-call (decision-model-routing §1 pitfall) | Moet <100ms voor UI-acties |
| **Bus-factor** | Ontworpen voor >1 (audit-trail reproduceerbaar) | n.v.t. |

**Drie kern-properties** (Matt Pocock-style "good architecture"):

1. **orthogonal aan ventures** — COS kan Webrnds orkestreren zonder venture-kennis, en vice versa.
2. **Reproduceerbaar** — Elke COS-beslissing is achteraf reconstrueerbaar uit audit-trail (decision-model-routing §6).
3. **Vervangbaar** — Bij provider-failure of model-pivot kan COS worden uitgewisseld zonder venture-code te wijzigen.

---

## 2. Waarom COS — wat lost het op

**Symptoom (per founder, 2026-09-21):** "Ik denk dat we (jij, GG, ik) alles door mekaar aan het doen zijn."

**Drie diagnoses** die COS adresseert:

1. **Geen gedeelde bron van waarheid** — Meerdere agents bewerken dezelfde research-files zonder synchronisatie (zie `canon-aware-research` Pitfall: "Schrijven vóór diagnosticeren of het werk al bestaat").
2. **Geen shadow-mode-discipline** — Agents publiceren direct naar canon zonder audit-trail.
3. **Geen route-discipline** — Inbox-triage ontbreekt; berichten komen binnen bij de verkeerde agent.

**Wat COS belooft:**

- **Eén ingang** voor nieuwe tasks/berichten → COS routeert
- **Eén audit-stroom** → alle agent-acties traceerbaar
- **Eén frontier-discipline** → open vragen worden expliciet geticket, niet "door mekaar" opgelost

---

## 3. Hoe COS werkt — eerste-orde architectuur

```
┌──────────────────────────────────────────────────────────────────┐
│  INGANGEN                                                         │
│  ├─ Telegram (founder)                                           │
│  ├─ GG (parallelle sessie)                                       │
│  ├─ Cron-jobs (research monitor, blogwatcher, etc.)             │
│  └─ Externe events (GitHub PR, Jev-call complete, etc.)         │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  COS-CORE                                                         │
│                                                                   │
│  1. INTAKE        — ontvang raw input, parseer, normalizeer      │
│  2. CLASSIFY      — Jev-call: welke agent? welk pad? urgentie?  │
│  3. ROUTE         — stuur naar juiste agent of wachtrij           │
│  4. AUDIT         — schrijf naar audit-spoor (JSON, ADR 0001)    │
│  5. CONFIRM       — bij mid-confidence: vraag founder via Telegram│
│  6. NOTIFY        — bij completion: stuur resultaat terug         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌─────────┐         ┌─────────┐          ┌─────────┐
   │  Webrnds │         │  Djin   │          │   GG    │
   │ venture  │         │ agenten │          │ agenten │
   │ pipeline │         │         │          │         │
   └─────────┘         └─────────┘          └─────────┘
```

**Latency-budget:**

| Stage | Budget | Bron |
|---|---|---|
| Intake + normalize | <50ms | lokaal |
| Jev-call (classify) | 900-1300ms | decision-model-routing §1 |
| Route + audit | <100ms | lokaal |
| **Totaal** | **~1-1.5s per taak** | |

---

## 4. Wat COS niet is — anti-patterns

| Anti-pattern | Reden |
|---|---|
| ❌ **COS als chat-model** | Jev is geen open-ended generator. Voor vrije tekst → chat-model orthogonal. |
| ❌ **COS als UI-renderer** | UI is venture-verantwoordelijkheid. COS stuurt data, geen pixels. |
| ❌ **COS als facturatie-systeem** | Webrnds factureert. COS routeert alleen. |
| ❌ **COS met directe canon-promotie** | COS adviseert; founder commit. Ronde 14 hard rule. |
| ❌ **COS zonder audit-trail** | Elke beslissing moet reconstrueerbaar zijn. |
| ❌ **COS als single-point-of-failure** | Fallback naar directe agent-route bij COS-down. |

---

## 5. Open vragen (frontier)

**Deze vragen zijn de eerste frontier voor `wayfinder-map.md`:**

| # | Vraag | Type | Wie beslist |
|---|---|---|---|
| F1 | Wat is COS in **één zin** — precies? | grilling | Founder |
| F2 | Wie is COS' "baas"? (founder-direct / governance / delegate) | grilling | Founder |
| F3 | Welke **routes** kent COS bij eerste launch? (Webrnds / Djin / GG / cron / extern) | grilling | Founder + Hermes |
| F4 | Hoe **valideer** je COS zonder canonieke files aan te raken? (shadow-mode contract) | grilling | Founder |
| F5 | Wat is het **state-model**? (per-sessie JSON / per-ronde / per-venture) | grilling + domain-modeling | Founder |
| F6 | Welke **Jev-calls** doet COS? (classify_jev per Ronde 17, action-type enum) | research | Hermes (automatisch) |
| F7 | Wat is de **failure-mode** bij Jev-down? | grilling | Founder |
| F8 | Hoe **orkestreert** COS meerdere parallelle sessies? (messaging, locks, conflict-resolution) | grilling | Founder |
| F9 | Wat is de **eerste live use-case** voor COS? | grilling | Founder |
| F10 | Wat doet COS **niet** bij eerste launch? (out-of-scope) | grilling | Founder |

---

## 6. Wat dit document NIET is

- ❌ Geen canonieke file — staat in `_internal/experimenten/`, niet in `_shared/`
- ❌ Geen executable spec — geen code, geen commando's, geen implementatie-detail
- ❌ Geen ticket-resolution — dat doet `wayfinder-map.md`
- ❌ Geen replacement voor Webrnds-profiel — orthogonal

---

## 7. Bron-bewijs (provenance)

| Source | Datum | Methode |
|---|---|---|
| `~/.hermes/skills/decision-model-routing/SKILL.md` | 2026-09-21 | skill_view |
| `~/.hermes/skills/canon-aware-research/SKILL.md` | 2026-09-21 | skill_view |
| `/Users/gogetta/Documents/djinlabs_system_design/.agents/skills/grill-with-docs/SKILL.md` | 2026-09-21 | read_file |
| `/Users/gogetta/Documents/djinlabs_system_design/.agents/skills/grilling/SKILL.md` | 2026-09-21 | read_file (eerder in sessie) |
| `/Users/gogetta/Documents/djinlabs_system_design/.agents/skills/domain-modeling/SKILL.md` | 2026-09-21 | read_file |
| `/Users/gogetta/Documents/djinlabs_system_design/.agents/skills/wayfinder/SKILL.md` | 2026-09-21 | read_file |
| `/Users/gogetta/Documents/djinlabs_system_design/.agents/skills/research/SKILL.md` | 2026-09-21 | read_file (eerder in sessie) |
| `research/webrnds-profile.md` | 2026-09-21 | Eerder in sessie gecommit |
| `research/jev-treg-blombies-icm-integration-blueprint.md` | 2026-09-21 | Eerder in sessie gelezen |
| `_shared/jev-policy-canon.md` V1.5 | Ronde 17 | Ongewijzigd |
| `_shared/sync-discipline-canon.md` Ronde 16 | Ronde 16 | Ongewijzigd |

---

## 8. Volgende stappen

1. **Vandaag:** `wayfinder-map.md` schrijven met destination + eerste frontier-tickets (F1-F10).
2. **Vandaag:** Eerste grill-me vraag in deze chat — F1 (definitie in één zin).
3. **Volgende sessie:** Frontier één voor één doorlopen via grill-me-discipline.
4. **Ronde 18+:** Bij voldoende frontier-resolution, COS-canon schrijven (`_shared/cos-architecture-canon.md`) als canon-promotie-traject.
5. **Later:** Eerste shadow-mode COS-pilot — alleen-lezen op bestaande research-flow, geen venture-impact.

---

## 9. Gerelateerd werk — pointers

Dit is design-only. Anderen hebben parallel aan deze map aan COS gewerkt. Hun werk is **niet canoniek** (geen canoniek-promotie in deze scope) maar bevat relevante **disclosed reference**.

| Pointer | Pointer-target | Status | Leading-word |
|---|---|---|---|
| `djinlabs/system/design/notes/cos-architecture-2026-09-22.md` | Andere agent's COS-architectuur (0.1 research-grade, 7-repo steroids index) | niet canoniek — onze frontier | "orchestrator that owns no agent" |
| `djinlabs/system/design/CONTEXT.md` | Andere agent's glossary (16 termen, COS↔Jev coupling §1a) | niet canoniek — pointer voor definitions | "COS↔Jev coupling" |
| `djinlabs/system/design/jev-policy-canon.md` | Andere agent's jev-policy-canon (P1-P7, 5 call-sites) | niet canoniek — onze jev-policy-canon Ronde 17 V1.5 is canon | "policy oracle" |
| `cos/research/2026-09-22-agent-is-folder-icm-notion.md` | Eigen research-note: agent = folder = ICM-discipline | canoniek-neutraal, Ronde-traject nodig | "agent is folder" |

**Waarom pointers, geen integratie:** Boundary-discipline Ronde 14. Onze scope is `djinlabs_system_design/djinlabs/_internal/experimenten/cos/`; hun scope is `djinlabs/system/design/`. Geen cross-boundary writes. Cross-boundary **reads via pointers** zijn oké; cross-boundary **promotie naar canoniek** vereist Ronde-traject in `decisions.md`.

**Lees-volgorde voor review:** als je de andere agent's werk wilt reviewen tegen het onze, lees hun 3 hoofd-files (CONTEXT.md + jev-policy-canon.md + cos-architecture-2026-09-22.md), dan hun glossary-pointer (CONTEXT.md §1a C1-C3), dan deze §9 als index.

---

## Handoff Notes for Next Agent

- **Twijfel je over COS-definitie?** Lees §1 + §4 (anti-patterns).
- **Wil je een ticket toevoegen?** Check of 't een decision-ticket is (geen task-slice).
- **Wil je een COS-implementatie bouwen?** Niet vandaag. Dit document is design-only.
- **Wil je COS koppelen aan venture-specifieke code?** Dat is COS-runtime, orthogonal aan design-doc.
- **Twijfel of een frontier-vraag canoniek of implementation is?** Gebruik `decision-model-routing` skill §1 + canon-vs-implementation regel (placeholder-test).

---

## Notities voor audit-trail

- Dit is **design-only**, geen executable code, geen canon-promotie.
- Past bij Ronde 17 `classify_jev` action-type (canon-niveau classificatie, niet runtime-trade-off).
- Volgt `decision-model-routing` skill-discipline: shadow-mode-first, founder-review, confidence-band (default 0.35/0.7).
- COS is **orthogonal** aan ventures en aan agenten — bewaakt door boundary-discipline (Ronde 14).
