# Webrnds

> **Uitvoerende onderneming** onder het DjinLabs-template. KVK-
> ingeschreven. Codavo-shape diensten aan Nederlands MKB.
> Instance #1 van het DjinLabs-template (Ronde 1 + Ronde 5).

## Start hier

1. `start.md` — purpose, boundaries, done-definitie.
2. `Context/context.md` — runtime-truth voor deze venture.
3. `Context/map.md` — één-scherm overzicht van mappen + flow.
4. `AGENTS.md` — detail-router voor coding-agents binnen Webrnds.
5. `_rules.local.md` — Webrnds-spec instance-rules (Ronde 8 cap).
6. `0X-<fase>/CONTEXT.md` — canoniek proces voor die specifieke fase
   (begin met `01-research/CONTEXT.md` als referentie-template).

## Wat hier leeft

- **6-fasen pipeline** (`01-research/` → `06-na-livegang/`) — van
  marktonderzoek tot na-livegang-retentie.
- **`clients/<slug>/klantreis-<id>/`** — klant-spec dossiers. Cap van
  3 actieve reizen per klant.
- **`_internal/`** — Webrnds-spec R&D + leer-artefacten.
- **`_templates/`** — fase-template + klantreis-template.
- **`skills/`** — klant-spec wrapper-templates per fase.
- **`_archive/`** — afgeronde klantreizen (regels voor archivering).
- **`_rules.local.md`** — instance rules (cap, services, naming).
- **`Context/`** — venture-level runtime-truth + één-scherm.
- **`<fase>/CONTEXT.md`** — per-fase canoniek proces.

## Wat hier NIET hoort

- Klant-overstijgende experimenten → `/djinlabs/_internal/experimenten/`.
- Universele Djin-agent scaffolds → `/djinlabs/skills/`.
- Canonieke bronnen (ICM, COS, Jev, sync-discipline) → `/_shared/`.
- Runtime / database / dashboard → nergens in DjinLabs
  (Ronde 19 motie 1). Webrnds mag externe tools gebruiken voor
  klant-uitvoering, maar DjinLabs zelf heeft geen runtime.
- Klantdata in `/djinlabs/` → strikt verboden (Q12.1a).

## Quick-links

- [Mono-repo `Context/context.md`](../Context/context.md)
- [Mono-repo `Context/map.md`](../Context/map.md)
- [Webrnds `AGENTS.md`](./AGENTS.md)
- [Webrnds `start.md`](./start.md)
- [Webrnds `state.md`](./state.md)
- [Webrnds `_rules.local.md`](./_rules.local.md)
- [Ronde-besluiten in `decisions.md`](../decisions.md)
- [ICM-canon](../_shared/icm-canon.md)
- [Hard-rules](../_shared/hard-rules.md)
- [Sync-discipline-canon](../_shared/sync-discipline-canon.md)

## Onderhouder

Owner: founder (Djinlabs). Eerste commit door founder; verdere
wijzigingen via Ronde-proces of instance-rule edit.
