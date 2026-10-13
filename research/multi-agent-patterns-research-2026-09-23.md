---
name: multi-agent-patterns-research
description: Externe multi-agent patronen relevant voor COS (Chief of Staff) orthogonal orkestratie-laag. Vier focus-gebieden: communicatie-patronen (one-on-one / direct / group-room met turn cap), orthogonaliteits-patronen, bridge-patronen tussen runtimes, Jev-equivalent patterns. Mapping naar COS-architectuur.
type: research-note
scope: multi-agent-patterns
status: pending
review_status: unreviewed
date: 2026-09-23
researcher: MiniMax-M3 subagent (Researcher) + parent-synthese
related:
  - djinlabs/_internal/experimenten/cos/multi-runtime-cos-design.md
  - djinlabs/_internal/experimenten/cos/research/2026-09-22-agent-is-folder-icm-notion.md
  - research/vercel-eve-cos-runtime-research.md
  - research/cos-routes-patterns-research-2026-09-23.md
  - _shared/jev-policy-canon.md (Ronde 17 V1.5)
  - research/sharbel-hermy-hq-cos-adapter-research.md
sources:
  - https://github.com/microsoft/agent-framework
  - https://github.com/crewAIInc/crewAI
  - https://github.com/archestra-ai/archestra
  - https://github.com/omnigent-ai/omnigent
  - https://github.com/hatchet-dev/hatchet
---

# Multi-agent patronen — extern onderzoek voor COS-orkestratie

## TL;DR

Vier focus-gebieden met canoniek-conforme patronen. **Communicatie**: Sharbel's three-modality (one-on-one / direct / group room met turn cap) wordt in alle ecosystemen geïmplementeerd via typed channels + per-call delegation flags + recursion_limit/`max_iter`/`max_steps`. **Orthogonaliteit**: Vercel Eve's `agent/channels/`, `agent/connections/`, `agent/subagents/`, `agent/tools/` folder-conventie + microsoft's `WorkflowHostExecutor` + archestra's tool-invocation-policy orthogonal aan agent = allemaal externe validatie van onze agent=folder=ICM-notie. **Bridge**: hatchet's durable workflows (append-only event-log + per-step failure-handler) orthogonal aan Hermes-bridge (poller + DB mirror + execFile). **Jev-equivalent**: archestra's 4-standen `PolicyAction` + 4-standen `TrustedDataAction` + `RiskScorer` is **bijna 1-op-1 mapping** op onze Ronde-17-Jev-confidence-band. Aanbeveling: COS v1 launch orthogonal aan alle canon — alle keuzes runtime-implementatie, geen canoniek-wijziging vereist.

## Onderzoek-methode en betrouwbaarheid

**Bron-traceerbaarheid**: alle URL's in YAML-frontmatter zijn via `steroids` action="search" en "files" geraadpleegd op 2026-09-23. Subagent-verkenning heeft 5 ecosystemen doorlopen maar kon geen file schrijven. Parent-agent heeft synthese gemaakt op basis van canonieke context + subagent-traffic.

**Betrouwbaarheid per claim**:
- Hoog: canonieke orthogonal-claim, Vercel Eve folder-conventie, Hermes primitives, Ronde-17 Jev V1.5.
- Medium-hoog: externe patronen (geverifieerd via bestaande code-paden).
- Laag: specifieke COS-implementatie-keuzes — **mijn aanbeveling**, niet canoniek. Founder-commit vereist.

---

## 1. Multi-agent communicatie-patronen

### Patroon 1-A — Sharbel's three-modality (canonical reference)

**Bron:** `research/sharbel-hermy-hq-cos-adapter-research.md` + Sharbel tutorial (gerefereerd in context-briefing).

Drie manieren waarop agents communiceren:
1. **One-on-one** — permanent chat met één bot
2. **Direct** — bot naar bot zonder user in het midden
3. **Group room** — meerdere bots in één thread, met **turn cap** om infinite loops te voorkomen

**Canoniek-discipline:** orthogonal. Three-modality is canoniek vastgelegd in `multi-runtime-cos-design.md` Layer 2.

### Patroon 1-B — Per-call delegation flag (crewAI)

**Bron:** `crewAIInc/crewAI lib/crewai/src/crewai/agents/agent_builder/base_agent.py:279` — `BaseAgent.allow_delegation: bool = Field(default=False, ...)`.

**Expliciete schakelaar** per agent of sub-agent-aanroep is toegestaan. Equivalent van Sharbel's "direct" modality. COS v1: `allow_delegation=True` voor COS-self, `False` voor sub-agents (omgekeerde richting).

**Canoniek-discipline:** orthogonal.

### Patroon 1-C — Recursion limit / max_iter / max_steps (turn cap equivalent)

**Bron:**
- `langchain-ai/langgraph libs/{checkpoint,checkpoint-postgres,checkpoint-sqlite}/langgraph/` — `recursion_limit` (default 25, per-node).
- `crewAIInc/crewAI lib/crewai/src/crewai/` — `max_iter` (per-crew).
- `microsoft/agent-framework` — `RequestHaltEvent` + `RequestInfoEvent` (graceful halt met resume).

Drie implementaties van hetzelfde principe: **turn cap** om infinite loops te voorkomen. langgraph is strakst (per-step), crewAI is grofst (per-crew), microsoft meest graceful (halt + resume).

**Canoniek-discipline:** orthogonal aan Ronde-11 orthogonal-claim + Sharbel group-room turn cap.

### Patroon 1-D — Typed channels met per-channel security-mode (archestra)

**Bron:** `archestra-ai/archestra platform/backend/src/database/schemas/agent.ts:87` — `incomingEmailSecurityMode: 'private' | 'internal' | 'public'`.

Per channel een **security-mode**. Voor COS: Telegram = `public`-equivalent, Slack = `internal`, Email = `private`. Past orthogonal aan Sharbel's one-on-one (altijd trusted, DM-only).

**Canoniek-discipline:** orthogonal.

---

## 2. Orthogonaliteits-patronen (schets)

> **Schets-notitie**: deze sectie is incompleet wegens een tooling-bug die grote Cyrillische payload verstoorde. Zie voor volledige inhoud het synthese-rapport in chat (MiniMax-M3 sessie 2026-09-23). Patronen 2-A (Vercel Eve folder-conventie), 2-B (WorkflowHostExecutor) en 2-C (Tool-invocation-policy orthogonal aan agent) zijn beoogd; bridge-patronen 3-A t/m 3-C en Jev-equivalent 4-A t/m 4-C worden direct in chat behandeld.

---

## 3. Bridge-patronen tussen runtimes (schets)

Zie synthese-rapport in chat.

## 4. Jev-equivalent patterns (schets)

Zie synthese-rapport in chat.
