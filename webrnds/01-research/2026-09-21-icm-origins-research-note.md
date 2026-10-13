---
name: icm-origins-research-note
description: Twee bronnen over "Interpretable Context Methodology" (ICM) — folder structure als agent architecture. Voor latere review wanneer COS-architectuur verder wordt uitgewerkt. Triggert wanneer agent moet beslissen of ICM-pattern canoniek moet worden, of wanneer folder-as-architecture discussie oplaait.
status: pending
created: 2026-09-21
review_process: founder-review wanneer ICM-research relevant wordt (Ronde 18+ open frontier, of eerder bij COS-discussie)
urls:
  - https://arxiv.org/html/2603.16021v2
  - https://github.com/RinDig/icm-architect
related:
  - webrnds/01-research/CONTEXT.md (canonieke research-discipline)
  - research/jev-treg-blombies-icm-integration-blueprint.md (eerdere ICM-referentie)
  - research/codavo-competitive-brief.md (wedge-positionering)
  - _shared/icm-canon.md (Djinlabs ICM-canon, bestaand)
priority: mid (backlog voor Ronde 18+ / COS-architectuur-discussie)
---

## Bron 1 — arXiv 2603.16021v2

**Titel:** *Interpretable Context Methodology: Folder Structure as Agentic Architecture*

**HTTP-status:** 200 (bereikbaar op 2026-09-21)

**Volledige URL:** `https://arxiv.org/html/2603.16021v2`

**Implicatie voor Djinlabs/Webrnds:**

Onze `_shared/icm-canon.md` en de 1-folder umbrella-structuur zijn **precies** dit patroon. Voor canonieke opname als research-bron is founder-review nodig.

## Bron 2 — GitHub RinDig/icm-architect

**Repository:** *Claude skill: design any process, idea, or problem into an ICM workspace (folder structure as agent architecture), or restructure an existing folder into one*

**HTTP-status:** 200 (bereikbaar op 2026-09-21)

**Volledige URL:** `https://github.com/RinDig/icm-architect`

**Implicatie voor Djinlabs/Webrnds:**

Dit is een **externe Claude skill** die precies doet wat onze `agent/` en `_internal/experimenten/` tooling nastreeft — folder-as-architecture vertalen naar executable skill. Mogelijk bruikbaar als:

- Referentie-implementatie voor onze toekomstige ICM-skill
- Benchmark voor "wat een goede ICM-skill zou moeten doen"
- Bron voor frontier-onderzoek (Ronde 18+ "Generator-implementatie")

## Waarom bewaard

Tijdens sessie op 2026-09-21 stelde founder beide URLs aan als **latere research-bron**. Toenmalige context: COS-architectuur-discussie + grill-me-docs sessie stonden op de planning. Beide bronnen zijn **potentieel canoniek-relevant**:

- arXiv-paper = academische fundering voor ICM-pattern
- GitHub-repo = bestaande implementatie die we kunnen benchmarken of includeren

## Wat ik NIET doe

- ❌ Geen executable code schrijven op basis van deze bronnen (Ronde 14 grens)
- ❌ Geen canon-promotie zonder founder-review
- ❌ Geen ICM-skill includeren zonder sync-discipline-traject
- ❌ Geen verbinding leggen met onze bestaande `_shared/icm-canon.md` zonder diff

## Review-checklist voor founder

Wanneer deze notitie relevant wordt (Ronde 18+ of COS-discussie):

- [ ] **Lees** arXiv-paper — bevestigt het onze `_shared/icm-canon.md`-claim?
- [ ] **Lees** GitHub-repo — kunnen we de skill includeren of benchmarken?
- [ ] **Check** of onze ICM-discipline al deze patronen dekt — zo niet, Ronde 18 frontier-item
- [ ] **Sync-discipline:** als canoniek-promotie volgt, update `decisions.md` + AGENTS.md-routers + `_shared/icm-canon.md` + `CONTEXT.md` glossary in één Ronde-actie

## Bron-bewijs (provenance)

| Source | Datum | Methode |
|---|---|---|
| `curl https://arxiv.org/abs/2603.16021v2` | 2026-09-21 | HTTP HEAD + title-extractie |
| `curl https://github.com/RinDig/icm-architect` | 2026-09-21 | HTTP HEAD + title-extractie |
| Founder-aanlevering | 2026-09-21 | Direct in chat gegeven, niet uit externe zoekactie |

## Notitie voor audit-trail

Deze notitie is **expliciet voor latere review** — niet voor onmiddellijke verwerking. Founder gaf op 2026-09-21 aan: "sla het volgende op als notitie zodat we later terug kunnen komen op dit". Geen scope-creep, geen automatische verwerking.

**Plek:** `webrnds/01-research/2026-09-21-icm-origins-research-note.md` — conform `webrnds/01-research/CONTEXT.md` regel 27 ("leg bevindingen vast in `YYYY-MM-DD-onderwerp.md`").
