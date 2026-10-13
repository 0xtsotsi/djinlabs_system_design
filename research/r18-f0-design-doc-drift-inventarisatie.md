# Ronde 18-voorbereiding — design-doc drift inventarisatie

> **Status.** Ronde-prep research, geen canonieke doc. Geschreven 2026-09-21.
> **Doel.** In kaart brengen wat `docs/djinlabs-1-folder-fundamentelen-design.md` (253 regels, sync t/m Ronde 11) mist aan inhoud die sinds Ronde 12 in `decisions.md` is vastgelegd. Ronde 18 (drift inlopen design-doc + AGENTS.md-routers) moet op deze lijst kunnen bouwen.
> **Leidende bron.** `decisions.md` Decision log (regel 68 → Ronde 17-sectie regel 368).
> **Generator-only status.** Per Ronde 16 (Q3=C) wordt design-doc gegenereerd, niet hand-edited. Drift-inhaal in deze Ronde is dus **éénmalig handwerk** dat bij generator-implementatie wordt overgenomen.

---

## 1. Wat de drift veroorzaakte

Design-doc is op 2026-09-19 voor het laatst geschreven (Ronde 11 lock). Sindsdien zes Rondes `decisions.md`-output zonder sync-discipline te hebben (sync-discipline bestond nog niet als canonieke discipline; die kwam in Ronde 16):

| Ronde | Onderwerp | Was in design-doc? |
|---|---|---|
| 12 | Djin embedden (4 Q's over symlinks, naming, klant-conflict) | Nee |
| 13 | Djin self-locating (3 Q's over `getProjectRoot()`, canoniek principe) | Nee |
| 14 | blobbies + jev-policy canon (9 Q's, orthogonal infra-laag, twee nieuwe `_shared/`) | Nee (Ronde 5 Jev-wire-up wel, maar zonder blobbies) |
| 15 | State-formats canon canoniek-breed + drift-detectie-discipline | Nee (state-format-Q5 wel, maar kanoniek-breed-principe niet) |
| 16 | Sync-discipline (agent verantwoordelijk, elke Ronde, generator-only) | Nee (Sync-ritueel Q12 staat, maar locked answers niet) |
| 17 | Jev-integratie (action-type `classify_jev`, confidence bands, vraag-formulering) | Nee |

---

## 2. Wat er wel in design-doc staat (om drift te voorkomen — niet dubbel melden)

- Ronde 1-11 allemaal aanwezig met Q-numbers (Q1-Q11 = Ronde 1-11 inhoud; Q12-Q20 = latere Ronde 5/6/7/8/9/10/11 details).
- "Wat Ronde 1-11 hebben vastgelegd" tabel.
- 8 universele hard-rules U1-U8.
- 4 lagen rot-prevention + mechanismen (Hook-engine Q4, State-formaat Q5, Hot-path/audit-path Q7, Sunday-audit Q8, TypeSafe/Jev Q10+Q11, Instance-bootstrap Q9, Money-subcats Q15, Audit-grader Q16, Post-HOLD Q17, Agent-mapping Q19, Skills-hosting Q20).
- Cross-references-bron in regel 153-160 (maar wel verouderd — zie §3).

---

## 3. Drift-inventarisatie — wat er in design-doc moet komen

### 3.1 Nieuwe subsecties (de zes volledig ontbrekende Rondes)

Aanbevolen volgorde in design-doc, append-only onder `## Mechanismen`:

1. **Tenants en symlinks (Ronde 12)** — kort: Djin via 15 symlinks vanuit `djinlabs/tenants/djin/` naar `~/Documents/projects/slack/`; boundary-discipline (Djin schrijft niet buiten `~/Documents/projects/slack/`, Webrnds schrijft niet in Djin's folders); umbrella-context zit in parent-folder. Pointer naar `decisions.md` regel 167.
2. **Self-locating discipline (Ronde 13)** — kort: alle agent-runtimes binary-anchor via `getProjectRoot()` (canoniek patroon in `agent/registry.ts`), niet `process.cwd()`. Canoniek principe: **"Djin is vast, app wisselt"**. `resolveClientPrefix()` is een stub, geen abstractie nu.
3. **blobbies infra-laag (Ronde 14)** — kort: blobbies (Tauri tray-app, Tinfoil-CSP + Ollama) is orthogonal infra-laag; boundary = `~/.blobbies/` ∪ Tinfoil-CSP ∪ Ollama-loopback ∪ shell-sandbox; nul-coupling met Djin; cross-boundary handovers via `/_shared/handovers/`. **Wijzig** bestaande §"TypeSafe / Jev wire-up (Q10, Q11)" om de drie blobbies-wire-ups toe te voegen (Q14.3: `secret_set` Noul fail-OPEN, tray-quit effect-Noul fail-OPEN, geld-staat Choice fail-CLOSED).
4. **Jev-policy canon + retention-policy canon (Ronde 14)** — nieuwe cross-references in design-doc §"Cross-references" (zie §3.2). Plus mini-sectie: action-types vocabulary + fail-mode matrix (8 acties / 7 sites) leeft in `_shared/jev-policy-canon.md`; retention-hiërarchie `fiscaal > canoniek > operationeel` in `_shared/retention-policy-canon.md`.
5. **Handovers discipline (Ronde 14)** — folder `/_shared/handovers/`, naam-template `handover-YYYYMMDD-HHMM-<slug>.md`, verplichte frontmatter (`from`, `to`, `actor`, `reason`, `retention`, `crosses_boundary`).
6. **State-formats canoniek-breed (Ronde 15)** — **wijzig** bestaande §"State-formaat (Q5)" om het canoniek-brede principe "Markdown = knowledge, JSON = state" op te nemen met cross-reference naar `_shared/state-formats-canon.md`. Plus: drift-detectie is canonieke trigger (matrix-cellen die ontbreken), niet-uitgevoerd in Ronde 15.
7. **Sync-discipline (Ronde 16)** — **wijzig** bestaande §"Sync-ritueel (Q12)" om de drie locked answers vast te leggen: agent verantwoordelijk, sync bij elke Ronde, generator-only. Cross-reference naar `_shared/sync-discipline-canon.md` + `docs/adr/0002-sync-discipline.md`.
8. **Jev-integratie action-type `classify_jev` (Ronde 17)** — nieuwe subsectie onder §"Mechanismen": 8e action-type in `_shared/jev-policy-canon.md`; orthogonaal aan agents en skills; runtime-tool met 900-1300ms latency (niet hot-path).
9. **Confidence bands (Ronde 17)** — drie-banden-patroon (`>0.7` auto-act, `0.35-0.7` ask_human, `<0.35` safe default); waarden zijn runtime-tuning, **patroon is canon**. Cross-reference naar jev-policy-canon §"Confidence bands".
10. **Vraag-formulering discipline (Ronde 17)** — Jev classificeert op vraag-vorm, niet inhoud; bij twijfel canon-vs-implementation expliciet umbrella-scope/multi-tenant-impact/sync-discipline-implicatie vermelden.

### 3.2 Cross-references drift (regel 153-160)

Huidige cross-references zijn verouderd. Vervanging:

| Huidige regel | Probleem | Vervanging |
|---|---|---|
| "Canon-bron: `decisions.md` (Ronde 1-13 cumulatief log)" | Ronde 1-17 nu | "Canon-bron: `decisions.md` (Ronde 1-17 cumulatief log)" |
| Sessie-state `20260919-133302/state.json` | Ronde 11 lock; nu Ronde 17 lock | "Sessie-state: `~/.grill-with-ui/sessions/Users-gogetta-Documents-djinlabs_system_design/20260921-180257/state.json` (laatste Ronde)" — of een pointer-formulering dat de lei niet elke Ronde verandert |
| `hard-rules-inventory.md` | bestaat nog, prima | ongewijzigd |
| `codavo-competitive-brief.md` | bestaat nog, prima | ongewijzigd |
| `icm-canon.md` | bestaat nog, prima | ongewijzigd |
| `decisions.md` §"Canonical Webrnds tree" | bestaat nog, prima | ongewijzigd |

**Toevoegen** aan cross-references-lijst:

- `_shared/jev-policy-canon.md` (Ronde 14 v1, V1.5 in Ronde 17) — actie-vocabulary, fail-mode matrix, confidence bands, `classify_jev` action-type.
- `_shared/retention-policy-canon.md` (Ronde 14 v1) — abstracte drie-klassen-definitie + hiërarchie.
- `_shared/state-formats-canon.md` (Ronde 15 v1) — Markdown = knowledge, JSON = state canoniek-breed.
- `_shared/sync-discipline-canon.md` (Ronde 16 v1) — agent verantwoordelijk, elke Ronde, generator-only.
- `docs/adr/0001-state-formats-canon.md` (Ronde 15).
- `docs/adr/0002-sync-discipline.md` (Ronde 16).

### 3.3 Open frontier drift (regel 243-253)

Huidige "Open frontier — Ronde 12+" lijst is deels ingehaald. Voorstel:

**Afvoeren** (uitgevoerd in Ronde 12-17):
- "Money-discipline (Ronde 12)" — uitgevoerd in Ronde 5+6 (Q13/14, Q15 in design-doc).
- "Canon-skill-contract" — gedeeltelijk uitgevoerd in Ronde 11/Q20 skills-hosting; metadata-patroon uitgebreid in Ronde 14/Q14.5.

**Behouden** (open):
- Calibratie-pad voor Score — open, wacht op Q16-triggers.
- Failure-replay-mechanisme — open, geïdentificeerd in `research/djinlabs-vs-5-layers-audit.md`.
- Slop-gate in skills-hosting — open, wacht op tweede instance.
- State-machine voor agent-workflows — open.
- Money-meta naast `_internal/` — open, niet-jung.

**Toevoegen** (nieuwe frontier uit Ronde 14-17):
- Generator-implementatie — canonieke eis (Ronde 16/Q3=C) zonder code. Tot die generator bestaat blijft drift-risico binnen deze boom.
- Cross-boom sync-discipline — `system/design/jev-policy-canon.md` zegt nog "skills-only"; aparte cross-boom sync-discipline nodig (niet in Ronde 16-scope).
- Drift-detectie als canonieke discipline — Ronde 15 trigger toegevoegd, oplossing open.
- Calibration-ownership — wie onderhoudt canonieke-bron ↔ runtime-state-spiegels als bestanden bijkomen (Ronde 15 open).
- Handovers discipline canoniek-breed toepassen — v1 beperkt tot handovers (Ronde 14/Q14.7); retentie-hiërarchie toepassing op andere domeinen open.
- Drift inlopen voor design-doc — deze Ronde (zelfreferentie: lost zichzelf op).

### 3.4 AGENTS.md-router drift (apart issue)

Vier routers, één bron (`_shared/AGENTS.md`) — volgens Ronde 16 zijn ze gesynced (timestamp 17:40:47 op Ronde 16):

- `AGENTS.md` (umbrella) — 44 regels, Ronde 16 update.
- `_shared/AGENTS.md` — 24 regels, Ronde 17 update (21:05).
- `djinlabs/AGENTS.md` — 34 regels, Ronde 16 update.
- `webrnds/AGENTS.md` — 44 regels, Ronde 16 update.

**Niet expliciet gemeld** in Ronde 17-status-blok, maar `_shared/AGENTS.md` is de bron — de andere drie verwijzen via cross-ref. Sync-discipline-regime: cross-ref-update via cross-ref-bron volstaat canoniek. Voor zover nu te zien geen actie nodig, **maar** verdient verificatie: alle vier moet expliciet de Ronde 17-`jev-policy-canon`-update noemen (kanonieke regel: state-formats + sync-discipline = canonieke bron).

---

## 4. Ronde 18 — voorgestelde scope

**Frontier-item #9 (sync-discipline herstellen) is locked in Ronde 16,**

**Ronde 18 doel:** de eenmalige drift-inhaal uitvoeren — design-doc append-only bijwerken volgens §3, plus AGENTS.md-routers cross-ref-check, vóór de generator wordt gebouwd. Daarna is generator-implementatie (Ronde 19+) mogelijk zonder dat generator direct met drie Rondes achterstand begint.

**Voorgestelde vragen voor Ronde 18 grill:**

- **Q18.1** — Aanpak: append-only per Ronde (12/13/14/15/16/17 los) vs grondige refactor (chronologisch herschrijven) vs hybride? Voorkeur append-only (A) — bewaart A1-stijl, geen breaking change voor lezers.
- **Q18.2** — Volgorde: chronologisch R12→R17 vs impact-geordend (grootste drift eerst) vs bron-genormaliseerd (per bronsectie in `decisions.md`)? Voorkeur chronologisch (A) — lezer volgt Ronde-evolutie, voorspelbaar.
- **Q18.3** — Cross-references: vervangen in-place (oorspronkelijke regel 153-160 herschrijven) of append-only (nieuwe lijst onder bestaande)? Voorkeur vervangen (A) — anders ontstaat dubbele bron.
- **Q18.4** — Open frontier: in §3.3 voorgestelde structuur accepteren, of grondige herschrijving van het "Open frontier"-blok? Voorkeur accepteren (A) — minimaal, behoudt Ronde 11-lijstgevoel.
- **Q18.5** — Verificatie: na drift-inhaal handmatig lezen (founder) vs een check-script schrijven (drift-detectie) vs beide? Voorkeur beide — handmatige eerste lezing + drift-detectie-script dat de cross-references tussen design-doc en `decisions.md` automatisch kan verifiëren (bouwt voort op Ronde 16-discipline).

**Buiten scope voor Ronde 18:**

- Generator-implementatie — wacht op Ronde 19+ (apart frontier-item).
- Cross-boom sync-discipline — apart frontier-item uit Ronde 16.
- `_shared/AGENTS.md`-routers inhoudelijk herschrijven — alleen cross-ref-check.
- Drift-detectie-script uitbreiden naar alle canon-files — past in Ronde 19 als de generator een canonieke output heeft.

**Risico:**

- Ronde 18 is per definitie **éénmalig handwerk** onder generator-only-regime. Daarna wordt design-doc gegenereerd. Ronde 18-output moet dus **generator-friendly** zijn — leesbaar als bron, niet als eindproduct.

---

## 5. Bron-bewijs

- Design-doc: `docs/djinlabs-1-folder-fundamentelen-design.md` (253 regels, laatst gewijzigd 2026-09-19).
- `decisions.md` Ronde 12-17 (regel 167-405).
- AGENTS.md-routers timestamps: alle vier in Ronde 16-sessie bijgewerkt, alleen `_shared/AGENTS.md` in Ronde 17.
- Frontier-bron: `decisions.md` §"Open frontier — Ronde 18 onwards" (regel 407).
- Cross-references-bron: `_shared/AGENTS.md` (24 regels).
