#!/usr/bin/env node
// research/r18-design-doc-drift-check.mjs
// Drift-detectie tussen design-doc en decisions.md + canon-vs-decisions audit.
//
// Doel: per Ronde-sectie in decisions.md aantonen welke design-doc-subsecties
// nog ontbreken. Eén Ronde-bron = één check. Geen canonieke tool — research-only.
//
// Uitgebreid 2026-09-24 (audit-spoor/audit-2026-09-24-double-tree.md Drift A.0):
//   - Nieuwe check §B: per `_shared/*-canon.md`, tel of de bestandsnaam-slug in
//     `decisions.md` voorkomt. Een canonieke bron zonder verwijzing in `decisions.md`
//     is potentieel "geclaimde autoriteit zonder audit-trail" — sync-discipline R16
//     eist dat elke lock in decisions.md landt.
//
// Gebruik:  node research/r18-design-doc-drift-check.mjs
//
// Output: een tabel per Ronde-sectie met:
//   - ronde_titel     : de ## header in decisions.md
//   - ronde_regel     : eerste regelnummer
//   - designdoc_match : welke termen uit decisions.md terugkomen in design-doc
//   - ontbrekend      : termen die NIET in design-doc voorkomen (waarschuwing)
//   - vraag_count     : aantal Q's in die Ronde
//
// Drift-criteria:
//   - Een Ronde-sectie zonder ENKELE match in design-doc = potentiële drift.
//     Dit ondervangt "design-doc is 6 Rondes achter" niet rechtstreeks,
//     maar laat per Ronde zien welke onderwerpen nog niet zijn overgenomen.
//
// Dit is GEEN canonieke tool. Het hoort in research/ en wordt niet aangeroepen
// door sync-discipline-canon.md of een hot-path hook.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, "..");

const designDocPath = resolve(projectRoot, "docs/djinlabs-1-folder-fundamentelen-design.md");
const decisionsPath = resolve(projectRoot, "decisions.md");

const designDoc = readFileSync(designDocPath, "utf8");
const decisions = readFileSync(decisionsPath, "utf8");

// Parse Ronde-secties uit decisions.md. Twee patterns:
//   ## Ronde N — ...   (eigen blok, zoals Ronde 17)
//   ### Ronde N — ...  (subsectie onder ## Decision log, zoals Ronde 12-16)
// We stoppen bij expliciete niet-Ronde-## blokken.
const decisionsLines = decisions.split("\n");
const rondeRegex = /^#{2,3} (Ronde \d+ — .+)$/;
const stopRegex = /^## (Architecture review|Open frontier|Done in earlier turns|Process notes|Plan \(uitgevoerd)/;

const rondes = [];
let current = null;

for (let i = 0; i < decisionsLines.length; i++) {
  const line = decisionsLines[i];
  if (stopRegex.test(line)) {
    if (current) rondes.push(current);
    current = null;
    continue;
  }
  const m = line.match(rondeRegex);
  if (m) {
    if (current) rondes.push(current);
    current = { title: m[1], startLine: i + 1, text: "" };
    continue;
  }
  if (current) current.text += line + "\n";
}
if (current) rondes.push(current);

// Per Ronde: vraag-count (Q1. of Qx.) + keywords (canonieke termen uit die Ronde).
function analyseRonde(ronde) {
  const text = ronde.text;
  // Q-count: Q12.1, Q13.2 etc. — ook Q14.3b etc., dus permissief.
  const qMatches = text.match(/Q\d+\.\d+[a-z']?/g) ?? [];
  const uniqueQs = [...new Set(qMatches)];

  // Keywords: pak de eerste 8 canonieke termen uit de ronde (woorden >=5 letters,
  // niet "Ronde", niet "Canon", niet gewoon "djinlabs", om ruis te beperken).
  // We zoeken alleen naar multi-word-fragmenten die de ronde uniek maken:
  // pak termen tussen backticks in de ronde-tekst.
  const backticks = text.match(/`([^`]{4,40})`/g) ?? [];
  const candidates = [...new Set(backticks.map((s) => s.slice(1, -1).trim()))];
  // Filter: skip pad-achtige (met $/ /), getallen, en erg generieke termen.
  const keywords = candidates
    .filter((k) => !k.includes("/") && !/^\d/.test(k) && !/^[A-Z]\d/.test(k))
    .slice(0, 10);

  const matches = [];
  const missing = [];
  for (const k of keywords) {
    if (designDoc.toLowerCase().includes(k.toLowerCase())) matches.push(k);
    else missing.push(k);
  }
  return { round: ronde, qCount: uniqueQs.length, qs: uniqueQs, keywords, matches, missing };
}

const rapport = rondes.map(analyseRonde);

// §B: check per `_shared/*-canon.md` of de slug in `decisions.md` voorkomt.
// Toegevoegd 2026-09-24 voor Drift A.0 (audit Spec-1): vijf nieuwe canon-files
// claimen Ronde 14-17 autoriteit maar ontbreken in decisions.md.
import { readdirSync } from "node:fs";
const sharedDir = resolve(projectRoot, "_shared");
const canonFiles = readdirSync(sharedDir)
  .filter((f) => f.endsWith("-canon.md"))
  .sort();

const decisionsLower = decisions.toLowerCase();
const canonCheck = canonFiles.map((f) => {
  const slug = f.replace(/\.md$/, "").toLowerCase();      // bv "state-formats-canon"
  const bareName = slug.replace(/-canon$/, "");            // bv "state-formats"
  // Tel alle occurrences van de slug in decisions.md (case-insensitive).
  const slugHits = decisionsLower.split(slug).length - 1;
  // Onderdruks signal van `agent-discipline-canon.md`: die heeft geen Ronde
  // autoriteits-claim en is dus een "geen auteur — hypothetisch" geval.
  return { file: f, slug, bareName, slugHits };
});

// §C: cumulative-log coverage — pakt de ## Cumulative log — Ronde N secties.
// Detecteert of het cumulative-log-blok daadwerkelijk per Ronde-sectie bevat.
const cLogMatch = decisions.match(/## Cumulative log — Ronde (\d+-\d+)/);
const cLogPresent = Boolean(cLogMatch);

// Render tabel.
const W = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s.padEnd(n));
const lines = [];
lines.push("Design-doc drift-detectie (research-only)");
lines.push("=".repeat(78));
// §B-tabel: canons zonder decisions.md-entry.
lines.push("");
lines.push("§B. `_shared/*-canon.md` slug-hits in `decisions.md` (sync-discipline check)");
lines.push("-".repeat(78));
lines.push(W("Canon-file", 36) + W("Slug", 26) + W("Hits", 5) + "Verdict");
let missingCount = 0;
for (const c of canonCheck) {
  const verdict = c.slugHits === 0 ? "MISSING ↯" : `ok (${c.slugHits})`;
  if (c.slugHits === 0) missingCount++;
  lines.push(W(c.file, 36) + W(c.slug, 26) + W(String(c.slugHits), 5) + verdict);
}
lines.push("-".repeat(78));
lines.push(`${missingCount}/${canonCheck.length} canon-files MISSING in decisions.md (sync-discipline violation)`);
if (cLogPresent) {
  lines.push(`§C. Cumulative log ${cLogMatch[1]} — GEDETECTEERD in decisions.md.`);
} else {
  lines.push("§C. Cumulative log — NIET GEDETECTEERD (drift-categorie ongesloten).");
}
lines.push("");
lines.push("=".repeat(78));
lines.push(
  W("Ronde", 36) +
    W("Q's", 4) +
    W("Hits", 5) +
    W("Total", 6) +
    "Coverage"
);
lines.push("-".repeat(78));
let totalQs = 0;
let totalHits = 0;
let totalKeywords = 0;
for (const r of rapport) {
  const cov = r.keywords.length === 0 ? "n/a" : `${(r.matches.length / r.keywords.length * 100) | 0}%`;
  lines.push(W(r.round.title, 36) + W(String(r.qCount), 4) + W(String(r.matches.length), 5) + W(String(r.keywords.length), 6) + cov);
  totalQs += r.qCount;
  totalHits += r.matches.length;
  totalKeywords += r.keywords.length;
}
lines.push("-".repeat(78));
lines.push(
  W("TOTAAL", 36) +
    W(String(totalQs), 4) +
    W(String(totalHits), 5) +
    W(String(totalKeywords), 6) +
    (totalKeywords === 0 ? "n/a" : `${(totalHits / totalKeywords * 100) | 0}%`)
);
lines.push("");

// Detail: ontbrekende keywords per Ronde — de candidaten voor design-doc-secties.
lines.push("Detail: keywords die NIET in design-doc voorkomen (drift-kandidaten)");
lines.push("-".repeat(78));
for (const r of rapport) {
  if (r.missing.length === 0) continue;
  lines.push("");
  lines.push(`## ${r.round.title} (regel ${r.round.startLine})`);
  lines.push("  Ontbrekend in design-doc:");
  for (const m of r.missing) lines.push(`    - \`${m}\``);
}
lines.push("");
lines.push(`Design-doc: ${designDoc.split("\n").length} regels, ${designDoc.length} bytes`);
lines.push(`Decisions: ${decisionsLines.length} regels, ${decisions.length} bytes`);

console.log(lines.join("\n"));
