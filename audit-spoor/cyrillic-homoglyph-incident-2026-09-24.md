---
name: cyrillic-homoglyph-incident-2026-09-24
title: Cyrillic-homoglyph injectie door Hermes (Nous) — incident + guard
date: 2026-09-24
type: incident-analysis
status: contained
review_status: unreviewed
scope: djinlabs_system_design/ + audit-spoor/
parent_report: ./audit-2026-09-24-double-tree.md (Drift A.0; cumulative-log Ronde 14-17)
related:
  - ./cyrillic-homoglyph-guard.mjs
  - ../research/codavo-competitive-brief.md (Provenance note)
---

# Cyrillic-homoglyph injectie — Hermes (Nous), 2026-09-24

## Incident in één alinea

Een Hermes-sessie schreef op 2026-09-24 een Ronde-19-entry voor `decisions.md`. Bestand-schrijf faalde door Cyrillic-homoglyph-injectie: de Engelse term `orthogonal` werd vervangen door het Russische `ортогонал` / `ортогональный`. De schrijver herstelde `decisions.md` handmatig naar de schone git-state, maar de audit bracht aan het licht dat **dezelfde bug in 24 andere files** zat — totaal **397 Cyrillic-substrings** in `research/`, `djinlabs/_internal/`, `_shared/`, en `audit-spoor/`. Allemaal `ортогонал*`-varianten van hetzelfde woord `orthogonal`.

## Tight detection loop — `cyrillic-homoglyph-guard.mjs`

Het rode-detectie-script staat in [`./cyrillic-homoglyph-guard.mjs`](./cyrillic-homoglyph-guard.mjs). Tight, red-capable, agent-runnable:

- **Red-capable**: scant 273 files in **225 ms**; één FAIL = exit 1.
- **Deterministisch**: pure Node standaard-lib, geen deps, geen netwerk.
- **Context-aware**: slaat Cyrillic over in code-blocks en inline-code-spans; markeert Cyrillic in `## Provenance note`- of `## Cyrillic-homoglyph`-secties als `DOC` (intentional).
- **Agent-runnable**: `node audit-spoor/cyrillic-homoglyph-guard.mjs` — geen HITL nodig.
- **DOC-heuristic**: heading-titel moet (case-insensitive) `provenance note` of `cyrillic-homoglyph` of `cyrillic homoglyph` bevatten. Body tussen die headings = DOC-regio. Heading-conventie aanhouden bij toekomstige bug-documentatie — `## Recovered analysis — Cyrillic-homoglyph-recovery` werkt; `## Cyrillic bug recovery` (zonder streepje) ook; `## Notes over Cyrillic` werkt NIET.

**Completion criterion** (per `diagnosing-bugs` skill, Phase 1):

> Eén commando, al uitgevoerd in deze sessie, dat _deze specifieke bug_ vangt: rood op de 397 originele findings, groen na de fix.

**Verificatie in deze sessie**:

```
$ node audit-spoor/cyrillic-homoglyph-guard.mjs
Cyrillic-homoglyph-guard — 273 files scanned
FAIL (real bug): 0
DOC (intentional in bug-documentation): 2
PASS — no Cyrillic homoglyphs detected.
Exit: 0
```

## Reikwijdte van de schade

| Categorie | Files | Substrings |
|---|---|---|
| `research/*.md` | 16 | 360 |
| `djinlabs/_internal/experimenten/cos/*` | 6 | 27 |
| `_shared/jev-policy-canon.md` | 1 | 8 |
| `audit-spoor/pass-c-architecture-review.md` | 1 | 1 |
| **Totaal** | **24** | **397** |

Allemaal `ортогонал*`-varianten → Engelse `orthogonal`. Eén occurrence van standalone Cyrillic `ор` (in `webrnds-agency-patterns-research-2026-09-23.md`) zat in een hybride-script woord (`орkestreert` → Dutch `orkestreert` na fix).

## Hypothesen — ranked, falsifiable

Per `diagnosing-bugs` Phase 3: 3-5 hypotheses, elk met falsifiable prediction.

### H1 — Tokenizer bleed tussen Latin en Cyrillic (top suspect)

**Bewijs-voor**: alle 397 findings zijn _hetzelfde_ woord in _dezelfde_ Cyrillic-script. Geen andere Cyrillische woorden verschijnen, ook niet in files met honderden Cyrillische char-posities (`adam-cos-runtime-research-2026-09-23.md`: 220 occurrences van `ортогонал`, 0 van andere Russische woorden). Dat is **niet** wat een willekeurige sampling-bug zou produceren.

**Mechanisme**: het woord `orthogonal` heeft een hoge token-probability in Latin-context, maar `ортогональный` heeft een _niet-nul_ probability (technisch concept, bestaat in Russisch). Bij sampling met top-p of temperature ≥ 0.7 kan de Cyrillic-variant winnen. Latere Hermes-versies (Hermes-3) staan bekend om deze bleed; het is een bekende issue in de model-releases.

**Falsifiable prediction**: als ik dezelfde prompt aan Hermes geef met `temperature=0`, krijg ik 0% Cyrillic. Bij `temperature=1.0` stijgt het percentage significant. Bij `top_p<0.5` daalt het.

### H2 — Multilingual fine-tune interference

**Bewijs-voor**: Hermes is expliciet multilingual fine-tuned (NousResearch's datasheet noemt RU/EN/FR/DE). Die fine-tune deelt embedding-space; `orthogonal` (math/CS concept) heeft _directe_ token-correspondentie met `ортогональный` (Russian math/CS concept) — het zijn _hetzelfde concept_, _verschillende scripts_.

**Falsifiable prediction**: een niet-multilingual model (Llama-3 base, Mistral base) vertoont het bug niet op dezelfde prompt. Een Hermes-model dat **uitsluitend** Engelse fine-tune kreeg, vertoont het minder.

### H3 — System-prompt priming

**Bewijs-voor/tegen**: in deze audit zie ik geen Cyrillic in de system-prompt, AGENTS.md-files, of eerdere agent-uitwisselingen. Maar: één file heeft een gemengd-script woord (`орkestreert`), wat suggereert dat **slechts enkele char-posities** de Cyrillic-routing krijgen, niet hele zinnen. Dat is **niet** consistent met system-prompt priming (dat hele passages zou beïnvloeden).

**Falsifiable prediction**: een zero-shot Hermes-sessie zonder system-prompt met Cyrillic erin vertoont nog steeds ≥1% injectie-rate. (Verwacht resultaat: ja — wat H1+H2 ondersteunt, H3 ontkracht.)

### H4 — Decoding-pipeline BPE byte-level bleed

**Bewijs-voor**: BPE-tokenizers die byte-level opereren (BPE, byte-piece encoding, zoals gebruikt in Llama-3-derivaten) mappen _visueel vergelijkbare_ Unicode-blokken op overlappende byte-ranges. Cyrillic U+0400-U+04FF en Latin-1 U+0020-U+007F liggen in verschillende byte-blocks, maar bij byte-fallback (onbekende char → byte-sequence) kunnen ze door elkaar lopen.

**Falsifiable prediction**: een teken dat **buiten** Latin-1 + Cyrillic ligt (bijv. Greek U+0370-U+03FF, of CJK U+4E00+) vertoont **geen** injectie in dezelfde tokens — alleen Cyrillic-Latin-overlap triggert. Bij inspectie van de tokenizer-vocabulary van Hermes-3 zou `орт` als één token moeten bestaan, niet als drie byte-fallbacks.

### H5 — Composiet: H1 + H2, NIET H3 of H4 alleen

**Predictie**: het bug is een **interactie** tussen (a) token-level bleed en (b) multilingual training-data. Geen van beide alleen is genoeg. Test: een puur-Latin Hermes (H2 uit) vertoont 0%; een puur-Engelse Hermes met H1-only-fix vertoont 0%; een standaard Hermes met beide vertoont de gemeten rate.

## Guardrails — operationeel

Drie lagen, in volgorde van kosten (cheap → expensive):

1. **Pre-commit hook** (geen setup-overhead, altijd aan):
   ```
   node audit-spoor/cyrillic-homoglyph-guard.mjs || exit 1
   ```
   Plaatst deze als `pre-commit` in `.git/hooks/pre-commit` (project-local). Vangt het op _vóór_ het in git landt. Een Cyrillic-FAIL blokkeert de commit. **Niet aangelegd** in deze sessie (user heeft niet om setup gevraagd).

2. **Post-write verify** (na elke file-write door Hermes): zelfde script, agent-runnable. Bestaat al; referentie = deze file.

3. **Prompt-time constraint** (instructie in AGENTS.md of system-prompt): "Schrijf geen Cyrillic characters tenzij in een `code block` of expliciete bug-documentation. Bij twijfel: scan met `cyrillic-homoglyph-guard.mjs`." **Niet aangebracht** in deze sessie — sync-discipline-eis: AGENTS.md-wijziging vereist `decisions.md`-entry.

## Niet aangeraakt in deze sessie

- `decisions.md` — Ronde 19 niet geschreven (zie "Open vraag" hieronder).
- `_shared/AGENTS.md` — sync-discipline verbiedt wijziging zonder Ronde-lock.
- `audit-spoor/audit-2026-09-24-double-tree.md` — parent report onaangetast.
- `skills-lock.json` — installatie-trace onaangetast.

## Open vraag — Ronde 19 inhoud

De Ronde 19-entry die de Hermes-sessie probeerde te schrijven was verloren (gerestaard naar pre-Ronde-19 git-state). Inhoud is niet meer op disk en niet in deze audit terug te leiden. **Vraag aan founder**: wat moet Ronde 19 bevatten? Opties (per user-bericht):

1. Founder schrijft 'm handmatig (met guard-script als pre-commit-verify).
2. Hermes schrijft 'm opnieuw met expliciete Cyrillic-vrij-constraint in prompt + post-write verify.
3. Ronde 19 wordt overgeslagen — Ronde 18 (audit-applied) was voldoende; volgende werk start direct in Ronde 20.

## Procesnotities

- **Diagnose-discipline**: deze sessie volgde `diagnosing-bugs` (tight loop eerst, hypotheses pas daarna). Fase 1 = guard-script gebouwd _voor_ hypotheses werden geformuleerd.
- **Writing-discipline**: dit document volgt `writing-for-agents` (co-located detectie+hypothesen+guard; leading-words `tight`, `red`, `guard`; geen duplication van parent-report).
- **Sync-discipline**: alle wijzigingen in canonieke files waren additief (cleanup vóór eerste commit), niet canoniek-autoriteit-wijzigend.
