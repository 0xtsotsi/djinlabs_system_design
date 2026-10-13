---
name: pass-c-code-review
title: Code-review (Standards + Spec) — _shared/*-canon.md + design-doc
date: 2026-09-24
generated_by: owl child-agent 81e6147d
mission: "Apply Matt Pocock `code-review` skill to diff between commit 4aad90d (fixed point) and HEAD on `docs/djinlabs-1-folder-fundamentelen-design.md` + `_shared/`"
note: |
  This file was written by gg-coder from the inline turn-completion output of
  child-agent 81e6147d — that agent had no `write`/`edit`/`bash` tools in its
  environment, so it returned the full report inline. The agent self-corrected
  its first draft (claimed research/djinlabs-blombies-fit-research.md and
  jev-live-test-rapport.md didn't exist; both do exist). The corrected version
  is preserved here verbatim.
provenance: founder verzoek audit 2026-09-24
related:
  - ../../docs/djinlabs-1-folder-fundamentelen-design.md
  - ../../_shared/jev-policy-canon.md
  - ../../_shared/sync-discipline-canon.md
  - ../../_shared/state-formats-canon.md
  - ../../_shared/retention-policy-canon.md
  - ../../_shared/agent-discipline-canon.md
  - ../../_shared/icm-canon.md
  - ../../_shared/AGENTS.md
  - ../../CONTEXT.md
  - ../../decisions.md
---

# Pass-C code-review — Standards + Spec

## Standards

### Repeated Switches / Shotgun Surgery
All 5 new `*-canon.md` cross-reference each other densely. Every concept lives in 2-3 files.
- **retention classes**: `retention-policy-canon.md:9-14` ↔ `jev-policy-canon.md:134-146` ↔ `state-formats-canon.md:71-78`.
- **confidence-band / classify_jev / question-formulation**: `jev-policy-canon.md:64-117` ↔ `CONTEXT.md:81-97` ↔ `sync-discipline-canon.md:96-103`.
Adding any new concept requires touching ≥ 4 files (jev-policy + retention + state-formats + sync) — exactly the smell baseline.

### Duplicated Code (vocabulary re-defined in `_shared/` AND in `CONTEXT.md`)
- `canonieke bron` + `runtime-state` — `state-formats-canon.md:11-27` AND `CONTEXT.md:7-22`.
- `drift` + `sync-discipline` + `lei` — `sync-discipline-canon.md:10-37` AND `CONTEXT.md:55-79`.
- `confidence-band` + `classify_jev` + `question-formulation` — `jev-policy-canon.md:64-117` AND `CONTEXT.md:81-97`.

### Message Chains
- `state-formats-canon.md:71-78` → `jev-policy-canon.md:5` → `retention-policy-canon.md:5` → `/_shared/handovers/`.
- `sync-discipline-canon.md:96-103` triggers reference `state-formats-canon.md` + `decisions.md` + `CONTEXT.md` + a phantom "Capability 9".

### Speculative Generality
- `agent-discipline-canon.md:5-12` — three rules about splitsen van samengestelde verzoeken, UI-verzoeken op externe skills, flow-positie van bridges. None of these are required by the design-doc or `decisions.md` (Ronde 1-13). The file's own "Wanneer niet van toepassing" sectie (line 14) implicitly admits the rules are advisory.
- `sync-discipline-canon.md:101` — "Capability 9-nazending is alleen toegestaan als de agent Capability 9 niet tijdens het interview kon draaien". "Capability 9" is undefined anywhere in the repo.
- `jev-policy-canon.md:186-189` lists kill switch / interfaces / wire-up as "niet in scope voor v1" but v1 is never dated.

### Primitive Obsession / Mysterious Name
- `retention-policy-canon.md` — "policy" suffix is the smell baseline's named example.
- `agent-discipline-canon.md` — name doesn't reveal the rules (messaging? lifecycle? error-handling?).

### Divergent Change
- `_shared/AGENTS.md:7-9` enumerates only `hard-rules.md`, `naming-conventions.md`, `icm-canon.md`. Five new canon files exist in `_shared/` but are absent from the router that governs them.
- `_shared/icm-canon.md` makes no cross-reference to the new canon files, even though they're sibling files claiming the same authority level.

### Refused Bequest
- `jev-policy-canon.md:19-25` references concrete runtime paths (`~/.blobbies/blobs/<uuid>/`). `icm-canon.md:24-25` states: "ICM levert geen runtime queues… Dat is engineering, niet folder-design." The new canon files import runtime-implementation into canon-level rules.
- `agent-discipline-canon.md:20` self-cites `_shared/AGENTS.md §Onderhoud` to claim maintenance authority, but `_shared/AGENTS.md:20` reads "Alleen wijzigen via `decisions.md`" — and no `decisions.md` entry exists for this file.

### Middle Man
- `jev-policy-canon.md:5` cites `naming-conventions.md` for slug-format. `naming-conventions.md` is itself a router (the smell baseline calls this out explicitly) — canon lookups now hop through a non-canon file.

## Spec

### 1. CRITICAL — Sync-discipline violation; canonical audit-trail bypassed
- All five new canon files cite Rondes 14-17 as authority source: `jev-policy-canon.md:7` (Ronde 17 sync), `sync-discipline-canon.md:3` (Ronde 16), `state-formats-canon.md:3` (Ronde 15), `retention-policy-canon.md:5` (implicit Ronde 14+ via handovers), `agent-discipline-canon.md` (no Ronde at all).
- `decisions.md` stops at Ronde 13 (line 6: "Ronde 13 opent"). **Verified via grep**: zero matches for `jev-policy-canon|state-formats-canon|sync-discipline-canon|retention-policy-canon|agent-discipline-canon` anywhere in `decisions.md`.
- But these Rondes DID happen — they live in `research/`: `djinlabs-blombies-fit-research.md` (Ronde 14+), `jev-live-test-rapport.md` (2026-09-21 Ronde 17), `rondasync-shadow-mode-r17.md` (Ronde 17 shadow-sync), `r18-f0-design-doc-drift-inventarisatie.md` (Ronde 18 prep). They were not appended to `decisions.md`.
- `research/r18-f0-design-doc-drift-inventarisatie.md:12` itself acknowledges: "zes Rondes `decisions.md`-output zonder sync-discipline te hebben (sync-discipline bestond nog niet als canonieke discipline; die kwam in Ronde 16)". Ronde 18 is the planned catch-up.
- This violates `_shared/AGENTS.md:20`: "Een file in `_shared/` wordt alleen bijgewerkt als een beslissing in `decisions.md` daarom vraagt." A canon file *literally named* `sync-discipline-canon.md` exists alongside 4 sibling canon files that themselves violate the sync discipline — the deepest conflict in the diff.

### 2. Design-doc ignores all 5 new canon files
- The only `_shared/` reference in `docs/djinlabs-1-folder-fundamentelen-design.md` is `icm-canon.md` (lines 99, 132, 158). **Verified via grep**: zero matches for `state-formats|sync-discipline|retention-policy|agent-discipline|jev-policy-canon` in the design-doc.
- Cross-references section (lines 153-160) does not list any of the new canon files.
- "Open frontier — Ronde 12+" (lines 243-253) lists Money-discipline, Score-calibratie, failure-replay, slop-gate, state-machine, canon-skill-contract — none mention the new canon files.

### 3. Routers not updated
- `_shared/AGENTS.md:7-9` enumerates only `hard-rules.md`, `naming-conventions.md`, `icm-canon.md`. Five new canon files are absent.
- `decisions.md:227-231` "Canonical Webrnds tree" lists the same three files.
- `decisions.md` "Done in earlier turns" (lines 264-274) does not mention any of the new canon files.

### 4. "Markdown = knowledge, JSON = state" canon vs design-doc
- `state-formats-canon.md:31`: "Markdown is voor kennis. JSON is voor state."
- Design-doc line 3: "Dit document is de leesbare vertaling van `state.json`… de grill-session is de bron." `sync-discipline-canon.md:30-37` defines `lei` as the vertaling van een canonieke bron — but here the bron is JSON, contradicting the canon principle that canonical sources are Markdown.

### 5. "Sync at every Ronde" claim not used by design-doc
`sync-discipline-canon.md:64` — "Bij elke Ronde, automatisch." Design-doc sync-ritueel (lines 162-167) is a manual founder-review step. No design-doc step implements "sync per Ronde"; the canon describes an ideal that the spec doesn't operationalise. `audit-spoor/ronde-17-sync-2026-09-21T22-22-06-554798Z.{json,md}` shows the discipline has only run in shadow-mode so far.

---

## 200-word summary

**Findings per axis:** Standards = 8 smells; Spec = 5 conflicts.

**Worst Standards issue — Repeated Switches / Duplicated Code combined (vocabulary churn):** Every new canon file re-defines vocabulary already in `CONTEXT.md`. `state-formats-canon.md:11-27` and `CONTEXT.md:7-22` both define `canonieke bron` + `runtime-state`; `sync-discipline-canon.md:10-37` and `CONTEXT.md:55-79` both define `drift` / `sync-discipline` / `lei`. Adding a single new concept (retention, confidence-band, drift) now requires editing ≥ 4 files.

**Worst Spec issue — Sync-discipline violation (5 files, all of `_shared/`):** `jev-policy-canon.md:7` (Ronde 17), `sync-discipline-canon.md:3` (Ronde 16), `state-formats-canon.md:3` (Ronde 15), `retention-policy-canon.md:5` (Ronde 14+), `agent-discipline-canon.md` (no Ronde). All five cite Rondes that exist in `research/` artifacts but were never appended to `decisions.md` (which stops at Ronde 13). Ronde 18 (`research/r18-f0-design-doc-drift-inventarisatie.md`) is the planned catch-up.

**ADR-canon conflict found:** `_shared/AGENTS.md:20` states "Alleen wijzigen via `decisions.md`" — yet all five new canon files were added without any `decisions.md` entry. `_shared/AGENTS.md` and `decisions.md:227-231` "Canonical Webrnds tree" likewise weren't updated. `agent-discipline-canon.md:20` self-cites the maintenance contract it itself violates. A canon file named `sync-discipline-canon.md` exists alongside 4 sibling files that violate the sync discipline it prescribes.

**Earlier report errors corrected:** `research/djinlabs-blombies-fit-research.md` and `research/jev-live-test-rapport.md` both exist; Rondes 14-17 happened (not fabricated) — they're just absent from `decisions.md`. The file `audit-spoor/pass-c-code-review.md` was not written by the child-agent — no write/edit/bash tool available in that session — and is preserved here as a verbatim mirror.

---

## Provenance

| Field | Value |
|---|---|
| child-agent-id | `81e6147d` |
| snapshot jsonl | `~/.gg/subagent-sessions/Users_gogetta_Documents_djinlabs_system_design/2026-09-24T08-32-34-084Z_79df3661.jsonl` (218 302 B) |
| turn snapshot | `2026-09-24T08-32-34-084Z_79df3661.jsonl.turn.json` (17 840 B) |
| model | MiniMax-M3 |
| tools available to child | read, find, grep, code_search, source_path, ls |
| tools NOT available | write, edit, bash, spawn_agent |
| file written to disk by child | none (returned inline as `output` field in turn snapshot) |
| file written to disk by gg-coder | this file (`audit-spoor/pass-c-code-review.md`) — verbatim mirror of child's corrected output |
