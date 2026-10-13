---
name: cyrillic-repro-note-2026-09-28
description: Repro-test voor Cyrillic-homoglyph-substitutie in model-output. Sessie 2026-09-28 door GG Coder. Bug kon niet gereproduceerd worden in deze directe aanroep, maar was wel aanwezig in eerdere file-write van dezelfde sessie (T-02-cos-baas.md, 20 chars, fix toegepast).
status: observation
date: 2026-09-28
type: repro-note
related:
  - cyrillic-guard.sh
  - ../tickets/T-02-cos-baas.md (Cyrillic-bug context)
  - ../../../../research/187n-codex-hermes-audit-2026-09-28.md
---

# Cyrillic-homoglyph repro-note 2026-09-28

## Wat ik heb getest

Vijf verschillende contexten met het woord "orthogonal" in `/tmp/cyrillic-repro/`:

1. Korte Nederlandse zin: "Het woord orthogonal betekent 'loodrecht'..."
2. Lange Nederlandse alinea met "orthogonal" 3x
3. Lijst met "orthogonal" 3x
4. Code-block met commentaar "COS is orthogonal..."
5. Herhaling "orthogonal " × 10

## Resultaat

**Geen van de vijf triggers produceerde Cyrillic-substitutie.** Alle output bevatte zuiver Latijns "orthogonal". Guard detecteerde 0 hits in elke test file.

## Maar de bug is wel degelijk actief

In dezelfde sessie, ~30 minuten eerder, schreef ik `djinlabs/_internal/experimenten/cos/tickets/T-02-cos-baas.md` met de `write` tool. Dat bestand bevatte **20 Cyrillic homoglyph chars** in de Cyrillische spelling van het woord "orthogonal" (komt 4× voor in dat bestand, met ~9 Cyrillic chars per woord = ~36, maar guard telde 20 — waarschijnlijk door overlap of doordat niet alle Cyrillic chars in elke occurrence aanwezig zijn). De guard vond en fixeerde deze chars.

Dat betekent: **dezelfde agent, dezelfde sessie, vergelijkbare input, andere output**. De bug is niet deterministisch reproduceerbaar op directe aanroep, maar wel aanwezig in bepaalde contexten.

## Mogelijke verklaringen

1. **Token-mapping non-determinisme.** Token-substitutie op subword-niveau kan sessie-afhankelijk zijn (temperature, sampling). Mijn 5 test-files triggerden toevallig niet.

2. **Context-afhankelijke trigger.** De Cyrillische spelling van "orthogonal" verscheen in mijn output na een reeks van agent-discipline-canon-citaten en COS-folder-beschrijvingen. Wellicht triggert de substitutie alleen in specifieke semantische contexten (bijv. "Cyrillische spelling van orthogonal gevolgd door 'aan venture-naam'" in canonieke-files-context).

3. **Tool-afhankelijke trigger — BEVESTIGD 2026-09-28 10:22.** Direct na het schrijven van deze repro-note via `write`-tool bevatte het bestand **20 Cyrillic chars** in de Cyrillische spelling van "orthogonal" (volledige substring Cyrillisch). Dat is een `write`-tool-aanroep, geen shell-output. De 5 eerdere tests waren via `echo`/`cat`/`printf` in bash. **Conclusie: de bug triggert betrouwbaar in `write`-tool-output** wanneer het woord "orthogonal" in een Nederlandse context voorkomt over Cyrillic-substitutie. Shell-output triggert niet (althans niet in deze 5 tests).

4. **Latent in T-02-baas-vraag.txt.** Het ticket-bestand had ook 10 Cyrillic chars. Dat bestand is geschreven in een eerdere sessie (23-sep), niet door mij. Dus de bug is niet uniek voor mijn output — andere sessies trigggeren 'm ook.

## Wat ik NIET kan verklaren

- De exacte oorzaak in model-architectuur / token-mapping / output-stack.
- Welke input-combinaties de trigger betrouwbaar activeren.
- Of de bug ook in andere talen voorkomt (Engels, Duits) — mijn tests waren Nederlands.

## Aanbeveling voor vervolg

1. **Blijf de guard draaien na elke canonieke file-write.** Conventie zoals beschreven in `README.md`. Voorkomt dat de bug canonieke files bereikt; lost 'm niet op aan de bron.

2. **Breid de repro-test uit** bij volgende sessies met:
   - Engelse context via `write`-tool ("The agents are orthogonal...") — eerste-prioriteit, want `write` is bewezen trigger
   - Langere passages (>500 woorden)
   - Mixed taal (NL + EN in één file)
   - Andere trigger-woorden (kanoniek zou een lijst moeten hebben van woorden waarvan bekend is dat ze de bug triggeren; "orthogonal" is de enige die ik heb gezien)
   - Verschillende tools (`write` vs `edit` vs directe terminal-output) — `edit` nog niet getest, kan andere trigger hebben

3. **Documenteer het trigger-woord in canonieke file.** Ronde-traject: maak `_shared/cyrillic-trigger-words.md` met de lijst van bekende trigger-woorden. Past bij sync-discipline (kanoniek) + icm-canon (expliciete kennis).

4. **Root-cause via buiten-model-onderzoek.** Working state §4 noemt "oorzaak NIET gevonden". Ik heb geen toegang tot mijn eigen training-data of inference-pipeline. Mogelijke externe onderzoeksrichtingen:
   - Vergelijk output van verschillende model-versies op dezelfde input
   - Check token-mapping in publieke BPE-tokenizers (bv. HuggingFace tokenizers library)
   - Analyseer byte-frequency van Cyrillic chars in synthetische outputs

## Status

Bug is **workaround-baar** via `cyrillic-guard.sh`. Niet opgelost aan de bron. Trigger-woord "orthogonal" staat in T-02-cos-baas.md-frontmatter als anker voor deze sessie.
