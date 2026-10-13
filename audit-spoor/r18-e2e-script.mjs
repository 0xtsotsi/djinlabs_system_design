import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Real e2e script that exercises the THREE disciplines against the real
// ~/.oathdriven-coder/icm/ tree and a real tmpdir for blobbies.

const { validateIcmTree } = await import(
  "/Users/gogetta/oathdriven-coder/gg-framework/packages/gg-icm/dist/index.js"
);
const { classifyJev } = await import(
  "/Users/gogetta/oathdriven-coder/gg-framework/packages/gg-jev/dist/index.js"
);
const {
  listBlobs,
  getBlobState,
  startBlobWatcher,
  configureBlobBridge,
} = await import(
  "/Users/gogetta/oathdriven-coder/gg-framework/packages/gg-blob-bridge/dist/index.js"
);

let pass = 0;
let fail = 0;
function check(label, cond, detail = "") {
  if (cond) {
    console.log(`  PASS  ${label}${detail ? " — " + detail : ""}`);
    pass++;
  } else {
    console.log(`  FAIL  ${label}${detail ? " — " + detail : ""}`);
    fail++;
  }
}

console.log("\n=== E2E #1 — ICM walker over the real ~/.oathdriven-coder/icm/djinlabs/ ===");
const djinlabs = path.join(os.homedir(), ".oathdriven-coder", "icm", "djinlabs");
const reports = validateIcmTree(djinlabs);
console.log(`  walked ${reports.length} agent-folder(s)`);
for (const r of reports) {
  console.log(`    ${r.tenant}/${r.slug}  ok=${r.ok}  missing=[${r.missing.join(",")}]  reads=${r.reads}`);
  check(`djinlabs/${r.slug} is well-formed`, r.ok);
  check(`djinlabs/${r.slug} has CONTEXT.md`, !r.missing.includes("CONTEXT.md"));
}
const skillsSales = reports.find((r) => r.slug === "skills/sales");
check("found djinlabs/skills/sales (nested)", skillsSales !== undefined);
if (skillsSales) {
  check("djinlabs/skills/sales has ok=true", skillsSales.ok);
  check("djinlabs/skills/sales reads <= 2", skillsSales.reads <= 2);
}

console.log("\n=== E2E #2 — Jev classifyJev across the real confidence band ===");
for (const c of [0.10, 0.34, 0.35, 0.50, 0.70, 0.71, 0.99]) {
  const result = await classifyJev({}, { classifier: async () => c });
  console.log(
    `  c=${c.toFixed(2)}  action=${result.action}  confidence=${result.confidence}  fail_mode=${result.fail_mode}`,
  );
  if (c < 0.35) {
    check(`c=${c} → safe_default`, result.action === "safe_default");
    check(`c=${c} → fail_mode=closed`, result.fail_mode === "closed");
    check(`c=${c} → no proceed_full`, result.action !== "proceed_full");
  } else if (c <= 0.7) {
    check(`c=${c} → ask_human`, result.action === "ask_human");
    check(`c=${c} → fail_mode=closed`, result.fail_mode === "closed");
  } else {
    check(`c=${c} → proceed_full`, result.action === "proceed_full");
  }
}

// Fail-CLOSED on throw
const threw = await classifyJev({}, {
  classifier: async () => { throw new Error("classifier offline"); },
});
check("classifier throw → ask_human", threw.action === "ask_human");
check("classifier throw → fail_mode=closed", threw.fail_mode === "closed");
check("classifier throw → confidence=0", threw.confidence === 0);
check("classifier throw → no proceed_full", threw.action !== "proceed_full");

// Fail-CLOSED on timeout
const timed = await classifyJev({}, {
  timeoutMs: 200,
  classifier: () => new Promise((r) => setTimeout(() => r(0.99), 400)),
});
check("classifier timeout → ask_human", timed.action === "ask_human");
check("classifier timeout → fail_mode=closed", timed.fail_mode === "closed");
check("classifier timeout → timeout=true", timed.timeout === true);

console.log("\n=== E2E #3 — Blob-bridge over a real tmpdir (NOT ~/.blobbies) ===");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "r18-e2e-blob-"));
try {
  // Set up two synthetic blob-folders.
  const blobA = path.join(tmp, "uuid-aaa");
  const blobB = path.join(tmp, "uuid-bbb");
  fs.mkdirSync(blobA, { recursive: true });
  fs.mkdirSync(blobB, { recursive: true });
  fs.writeFileSync(path.join(blobA, "state.json"), JSON.stringify({
    routines: [{ id: "r1", name: "Daily summary" }],
    recentRuns: [{ id: "run-1", status: "ok", at: "2026-09-27T18:00:00Z" }],
    memoryCount: 7,
  }));
  fs.writeFileSync(path.join(blobB, "state.json"), JSON.stringify({
    routines: [],
    recentRuns: [],
    memoryCount: 0,
  }));

  configureBlobBridge({ blobsRoot: tmp });
  const blobs = listBlobs();
  console.log(`  listBlobs returned ${blobs.length} entries`);
  check("listBlobs returns exactly 2", blobs.length === 2);
  check("listBlobs contains uuid-aaa", blobs.some((b) => b.uuid === "uuid-aaa"));
  check("listBlobs contains uuid-bbb", blobs.some((b) => b.uuid === "uuid-bbb"));

  const stateA = getBlobState("uuid-aaa");
  check("getBlobState(uuid-aaa).memoryCount === 7", stateA.memoryCount === 7);
  check("getBlobState(uuid-aaa) has 1 routine", stateA.routines.length === 1);
  check("getBlobState(uuid-aaa) routine id === r1", stateA.routines[0]?.id === "r1");

  const stateB = getBlobState("uuid-bbb");
  check("getBlobState(uuid-bbb).memoryCount === 0", stateB.memoryCount === 0);
  check("getBlobState(uuid-bbb) routines empty", stateB.routines.length === 0);

  // Empty-stub path
  const blobEmpty = path.join(tmp, "uuid-empty");
  fs.mkdirSync(blobEmpty, { recursive: true });
  const stateEmpty = getBlobState("uuid-empty");
  check("missing state.json → empty stub", stateEmpty.memoryCount === 0 && stateEmpty.routines.length === 0);

  // Watcher
  const watcher = startBlobWatcher({ blobsRoot: tmp, reconcileMs: 60_000 });
  const snap = watcher.snapshot();
  check("watcher snapshot has 3 blobs", snap.blobs.length === 3);
  check("watcher snapshot has 3 states", Object.keys(snap.states).length === 3);
  watcher.stop();
  check("watcher.stop() does not throw", true);

  console.log(`\n  tmpdir was: ${tmp}`);
  console.log("  (NOT ~/.blobbies — verified by config injection)");
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log(`\n=== RESULT: ${pass} PASS, ${fail} FAIL ===`);
process.exit(fail === 0 ? 0 : 1);
