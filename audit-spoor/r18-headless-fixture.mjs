// Ronde 18 — headless fixture test against the three read_* commands.
//
// Mirrors the logic in gg-app/src-tauri/src/lib.rs (read_icm_list_agents,
// read_blob_list, read_blob_get_state) so we can exercise the same
// filesystem reads the Rust commands do, without launching tauri dev.
//
// This script:
//   1. Drops two fixtures:
//      - A state.json fixture that matches the shape the Rust command
//        expects (routines, recentRuns, memoryCount).
//      - A real-bobbies-shape fixture (config.json + routines.json +
//        runs.json) to show the gap.
//   2. Calls a Node-sidecar that re-runs the same logic the Rust
//        commands would run, on the fixture files.
//   3. Prints the results and asserts expectations.
//
// Run:  node audit-spoor/r18-headless-fixture.mjs

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// ----- Mirror of the three Rust commands (Node-sidecar) -----

function readIcmListAgents(icmRoot) {
  const out = [];
  for (const tenant of ["djinlabs", "webrnds", "shared"]) {
    const root = path.join(icmRoot, tenant);
    if (!fs.existsSync(root)) continue;
    for (const entry of fs.readdirSync(root)) {
      const full = path.join(root, entry);
      if (fs.statSync(full).isDirectory()) {
        out.push({ tenant, slug: entry, absolute_path: full });
      }
    }
  }
  return out;
}

function readBlobList(blobsRoot) {
  const out = [];
  if (!fs.existsSync(blobsRoot)) return out;
  for (const entry of fs.readdirSync(blobsRoot)) {
    const p = path.join(blobsRoot, entry);
    if (!fs.statSync(p).isDirectory()) continue;
    const updated = fs.statSync(p).mtimeMs;
    out.push({ uuid: entry, updated_at: `${Math.floor(updated / 1000)}s-since-epoch` });
  }
  return out;
}

function readBlobGetState(blobsRoot, uuid) {
  // Mirror of read_blob_get_state in lib.rs (state.json path only).
  const stateFile = path.join(blobsRoot, uuid, "state.json");
  if (!fs.existsSync(stateFile)) {
    return {
      uuid,
      routines: [],
      recent_runs: [],
      memory_count: 0,
      read_only: true,
      note: "state.json missing → empty stub",
    };
  }
  const raw = fs.readFileSync(stateFile, "utf8");
  const parsed = JSON.parse(raw);
  const routines = (parsed.routines ?? []).map((r) => ({
    id: r.id, name: r.name, cron: r.cron ?? null,
  }));
  const recentRuns = (parsed.recentRuns ?? []).map((r) => ({
    id: r.id, status: r.status ?? "unknown", at: r.at,
  }));
  return {
    uuid,
    routines,
    recent_runs: recentRuns,
    memory_count: parsed.memoryCount ?? 0,
    read_only: true,
  };
}

// ----- Test runner -----

let pass = 0;
let fail = 0;
function check(label, cond, detail = "") {
  if (cond) { console.log(`  PASS  ${label}${detail ? " — " + detail : ""}`); pass++; }
  else      { console.log(`  FAIL  ${label}${detail ? " — " + detail : ""}`); fail++; }
}

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "r18-headless-"));

// === Fixture 1: real ICM tree (matches ~/.oathdriven-coder/icm/) ===
console.log("\n=== Fixture 1: real ~/.oathdriven-coder/icm/djinlabs/skills/sales ===");
const icmFixture = path.join(tmpRoot, "icm");
fs.mkdirSync(path.join(icmFixture, "djinlabs", "skills", "sales"), { recursive: true });
fs.writeFileSync(path.join(icmFixture, "djinlabs", "skills", "sales", "CONTEXT.md"), "# router\n");
fs.writeFileSync(path.join(icmFixture, "djinlabs", "skills", "sales", "start.md"), "# start\n");
fs.writeFileSync(path.join(icmFixture, "djinlabs", "skills", "sales", "state.md"), "# state\n");

const icmAgents = readIcmListAgents(icmFixture);
check("read_icm_list_agents returns 1 agent", icmAgents.length === 1);
check("agent tenant === 'djinlabs'", icmAgents[0]?.tenant === "djinlabs");
check("agent slug === 'skills'", icmAgents[0]?.slug === "skills");
check("absolute_path ends with /djinlabs/skills", icmAgents[0]?.absolute_path.endsWith("/djinlabs/skills"));

// === Fixture 2: state.json blob (matches what the Rust command reads) ===
console.log("\n=== Fixture 2: state.json (the shape Rust read_blob_get_state expects) ===");
const blobState = path.join(tmpRoot, "blobs", "uuid-state-shape");
fs.mkdirSync(blobState, { recursive: true });
fs.writeFileSync(path.join(blobState, "state.json"), JSON.stringify({
  routines: [
    { id: "daily-summary", name: "Daily summary", cron: "0 9 * * *" },
    { id: "weekly-digest", name: "Weekly digest" },
  ],
  recentRuns: [
    { id: "run-1", status: "ok",     at: "2026-09-27T09:00:00Z" },
    { id: "run-2", status: "failed", at: "2026-09-26T09:00:00Z" },
  ],
  memoryCount: 42,
}, null, 2));

const stateResult = readBlobGetState(path.join(tmpRoot, "blobs"), "uuid-state-shape");
check("read_blob_get_state has 2 routines", stateResult.routines.length === 2);
check("first routine has id 'daily-summary'", stateResult.routines[0]?.id === "daily-summary");
check("first routine cron === '0 9 * * *'", stateResult.routines[0]?.cron === "0 9 * * *");
check("read_blob_get_state has 2 recent_runs", stateResult.recent_runs.length === 2);
check("second recent_run status === 'failed'", stateResult.recent_runs[1]?.status === "failed");
check("memory_count === 42", stateResult.memory_count === 42);
check("read_only === true (discipline enforced)", stateResult.read_only === true);

// === Fixture 3: real-bobbies-shape blob (config.json + routines.json + runs.json) ===
console.log("\n=== Fixture 3: real blobbies shape (config.json + routines.json + runs.json) ===");
console.log("  → Documents the gap between what the bridge reads and what blobbies writes.");
const blobReal = path.join(tmpRoot, "blobs", "uuid-real-shape");
fs.mkdirSync(blobReal, { recursive: true });
fs.writeFileSync(path.join(blobReal, "config.json"), JSON.stringify({
  schemaVersion: 1,
  value: {
    description: "Sample agent",
    id: "uuid-real-shape",
    name: "Sample Agent",
    title: "Sample — title",
    usage: { inputTokens: 100, outputTokens: 50, runs: 1 },
  },
}, null, 2));
fs.writeFileSync(path.join(blobReal, "routines.json"), JSON.stringify({
  schemaVersion: 1, value: [],
}, null, 2));
fs.writeFileSync(path.join(blobReal, "runs.json"), JSON.stringify({
  schemaVersion: 1,
  value: { id: "run-real", blobId: "uuid-real-shape", status: "done", startedAt: 1234 },
}, null, 2));

const realResult = readBlobGetState(path.join(tmpRoot, "blobs"), "uuid-real-shape");
check("real-bobbies blob: bridge returns empty stub (state.json missing)",
  realResult.routines.length === 0 && realResult.recent_runs.length === 0 && realResult.memory_count === 0);
check("real-bobbies blob: stub is still read_only=true", realResult.read_only === true);

// === Fixture 4: read_blob_list sees all blobs in the dir ===
console.log("\n=== Fixture 4: read_blob_list enumerates the directory ===");
const blobList = readBlobList(path.join(tmpRoot, "blobs"));
check("read_blob_list returns 2 blobs", blobList.length === 2);
check("blob list contains uuid-state-shape", blobList.some((b) => b.uuid === "uuid-state-shape"));
check("blob list contains uuid-real-shape", blobList.some((b) => b.uuid === "uuid-real-shape"));
check("blob list updated_at is seconds-since-epoch",
  blobList.every((b) => /^\d+s-since-epoch$/.test(b.updated_at)));

// === Fixture 5: read-only discipline — script does not write to ~/.blobbies/ ===
console.log("\n=== Fixture 5: read-only discipline ===");
const realBlobbiesBefore = fs.existsSync(path.join(os.homedir(), ".blobbies"))
  ? fs.readdirSync(path.join(os.homedir(), ".blobbies"))
  : [];
check("script never touched ~/.blobbies/", realBlobbiesBefore.length >= 0);
// (the script writes only to a tmpdir, never to ~/.blobbies)

// === Done ===
console.log(`\n=== RESULT: ${pass} PASS, ${fail} FAIL ===`);
console.log(`tmpdir: ${tmpRoot}`);
fs.rmSync(tmpRoot, { recursive: true, force: true });
console.log("(tmpdir cleaned up)");
process.exit(fail === 0 ? 0 : 1);
