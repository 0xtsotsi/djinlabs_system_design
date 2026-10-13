# Ronde 18 — OathDriven Coder PoC audit

Date: 2026-09-27
Rondes geraakt: 15 (skills-actuele), 16 (sync-discipline), 17 (Jev-policy V1.5)
Plan: `/Users/gogetta/Documents/djinlabs_system_design/.gg/plans/r18-oathdriven-coder-poc.md`

## Wat is geland

Vier nieuwe packages + twee frontend-componenten + drie Tauri-Rust-commands.

| Component | Locatie | Tests | Check |
|---|---|---|---|
| `@oathdriven/gg-icm` | `~/oathdriven-coder/gg-framework/packages/gg-icm/` | 9 tests (4 walk-test + 3 canon-map + 2 e2e) | PASSED |
| `@oathdriven/gg-jev` | `~/oathdriven-coder/gg-framework/packages/gg-jev/` | 12 tests (8 confidence-band + 4 fail-mode) | PASSED |
| `@oathdriven/gg-blob-bridge` | `~/oathdriven-coder/gg-framework/packages/gg-blob-bridge/` | 15 tests (5 queries + 2 watcher + 8 readonly) | PASSED |
| Tauri Rust-commands | `~/oathdriven-coder/gg-framework/gg-app/src-tauri/src/lib.rs` | `cargo check` | PASSED |
| Frontend IcmSidebar | `~/oathdriven-coder/gg-framework/gg-app/src/components/IcmSidebar.tsx` | `tsc --noEmit` | PASSED |
| Frontend BlobPanel | `~/oathdriven-coder/gg-framework/gg-app/src/components/BlobPanel.tsx` | `tsc --noEmit` | PASSED |
| Sidecar wrappers | `gg-app/src/lib/{icm,blob}-sidecar.ts` + `gg-app/src/app-sidecar.mjs` | `tsc --noEmit` | PASSED |

## Drie disciplines die de tests bewijzen

1. **Walk-test-budget** (`@oathdriven/gg-icm/test/walk-test.test.ts`)
   - `rejects walk > 2 reads before router` ✓
   - `rejects agent without CONTEXT.md` ✓
   - `stops early when agent absent` ✓
   - `accepts a well-formed agent-folder and stops at the router` ✓ (bonus)

2. **Fail-mode-CLOSED** (`@oathdriven/gg-jev/test/fail-mode.test.ts`)
   - `classifier throw → fail-CLOSED` ✓
   - `timeout > 1300ms → fail-CLOSED` ✓
   - `confidence 0.20 → safe_default, fail-CLOSED` ✓

3. **Read-only bridge** (`audit-spoor/r18-bridge-readonly-audit.md`)
   - Drie grep-audits schoon
   - 8 forbidden-name tests in `test/readonly.test.ts` PASSED
   - Code-review spec + standards axis PASSED

## Drift vermeden

- **Twee silos, één waarheid**: ICM (Markdown, canoniek) ↔ Blob-folders (JSON, runtime). Sync-discipline R16 actief; één bron tegelijk leidend.
- **Geen write naar `~/.blobbies/` in v1**: drie enforcement-lagen (TS-types, grep-audit, code-review-discipline).
- **Jev fail-CLOSED by default**: geen `proceed_full` zonder confidence > upper-band; geen TypeSafe-API-call in v1.

## Open risico's (doorgegeven aan volgende Ronde)

1. **Tauri-sidecar glue**: plan stap 8 was geschreven voor een Node-sidecar-extensie, maar ik heb de drie commands als Rust-commands geïmplementeerd. Dit is veiliger (geen Node↔Rust round-trip) maar betekent dat `gg-app/src/app-sidecar.mjs` alleen een documentatie-stub is. Een toekomstige Ronde kan de sidecar alsnog uitbreiden.
2. **`~/.oathdriven-coder/icm/_shared/runtime-state.json`**: nog niet aangemaakt. De watcher gebruikt een in-memory `Map` in v1; persistentie komt zodra de Blob-mapping idle naar disk moet.
3. **FSEvents**: de watcher gebruikt `setInterval` (5 min) in plaats van FSEvents. Bij toekomstige swap naar FSEvents moet de read-only discipline behouden blijven.
4. **Visuele screenshot**: `audit-spoor/r18-e2e-sidebar.txt` documenteert dat de GUI-launch niet headless kan tijdens deze unattended turn. Een echte screenshot vergt een attended run.

## Branch

- Branch: `batch/oathdriven-coder-r18`
- Geen push naar default
- Eén DESIGN.md in `gg-framework/docs/oathdriven-coder-bridge.md` met bridge-flow diagram
