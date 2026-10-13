#!/usr/bin/env node
// audit-spoor/cyrillic-homoglyph-guard.mjs
//
// Tight loop voor Cyrillic-homoglyph-injectie (Hermes-bug, 2026-09-24).
// Een Cyrillic character (U+0400–U+04FF) in een markdown-bestand
// dat verder puur Latin is = bug. Dit script maakt die bug _rood_.
//
// Gebruik:
//   node audit-spoor/cyrillic-homoglyph-guard.mjs [--paths=<glob>]
//
// Defaults: scannt research/, _shared/, audit-spoor/, webrnds/, djinlabs/,
// docs/, decisions.md, AGENTS.md.
//
// Output:
//   Per file: PASS (0 cyrillic) of FAIL (cyrillic gevonden, met regelnummer
//   en de exacte char-set). Eén FAIL = exit 1; alles PASS = exit 0.
//
// Context-aware:
//   - Code blocks (```...```) en inline code spans (`...`) worden overgeslagen:
//     Cyrillic in code is _mogelijk_ legitiem (variabelenamen, citaten).
//   - Buiten code: élke Cyrillic char is een _rode_ bevinding — een agent zou
//     in een Latijnse-context geen Cyrillic moeten schrijven.
//   - Bug-documentatie-paragraphs die Cyrillic _citeren_ om de bug te
//     beschrijven krijgen een aparte tag (DOC) i.p.v. FAIL; dat is intentional.
//
// Tight:
//   - Loopt over ~30 files in <100 ms.
//   - Deterministisch (geen I/O naast file-reads).
//   - Geen netwerk.
//   - Geen deps — pure Node standaard-lib.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const CYR_RE = /[Ѐ-ӿ]/g;

// --- path discovery ---

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue;
      out.push(...walk(full));
    } else if (entry.endsWith('.md') || entry.endsWith('.markdown')) {
      out.push(full);
    }
  }
  return out;
}

function defaultPaths() {
  const paths = ['decisions.md', 'AGENTS.md'];
  for (const d of ['research', '_shared', 'audit-spoor', 'webrnds', 'djinlabs', 'docs']) {
    try {
      paths.push(...walk(join(ROOT, d)));
    } catch { /* dir may not exist */ }
  }
  return paths;
}

const argPaths = process.argv.slice(2)
  .filter(a => a.startsWith('--paths='))
  .map(a => a.slice(8))[0];
const paths = argPaths
  ? argPaths.split(',').map(p => resolve(ROOT, p))
  : defaultPaths();

// --- context detection ---

function buildCodeMask(lines) {
  // Returns Set of line-indices that fall inside fenced code blocks OR inline code spans.
  // Inline code spans are tracked per-line (approximate; we only need it to
  // suppress Cyrillic that's clearly inside backticks).
  const inFence = new Set();
  let fence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^```/.test(lines[i].trim())) {
      fence = !fence;
      // Don't flag the fence line itself; we _do_ want to flag content between.
      continue;
    }
    if (fence) inFence.add(i);
  }
  // Inline spans: per line, find backtick-delimited regions.
  const inlineSpans = lines.map(line => {
    const ranges = [];
    const re = /`+/g;
    let m;
    const opens = [];
    while ((m = re.exec(line)) !== null) {
      const len = m[0].length;
      if (opens.length && opens[opens.length - 1].len === len) {
        const open = opens.pop();
        ranges.push([open.start, m.index + len]);
      } else {
        opens.push({ start: m.index, len });
      }
    }
    return ranges;
  });
  return { inFence, inlineSpans };
}

function inInlineSpan(spans, lineIdx, col) {
  for (const [a, b] of spans[lineIdx]) {
    if (col >= a && col < b) return true;
  }
  return false;
}

// --- DOC-section detection ---

// Heuristic: lines starting with `## ` (or `### ` etc.) whose title contains
// "Provenance note" or "Cyrillic-homoglyph" mark the start of a DOC region
// that runs until the next `## ` (or higher) heading. Inside DOC regions,
// Cyrillic is tagged DOC (not FAIL), because it documents the bug.
function buildDocMask(lines) {
  const inDoc = new Set();
  let doc = false;
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^(#{1,6})\s+(.*)/);
    if (h) {
      const title = h[2].toLowerCase();
      doc = title.includes('provenance note')
         || title.includes('cyrillic-homoglyph')
         || title.includes('cyrillic homoglyph');
    } else if (doc) {
      inDoc.add(i);
    }
  }
  return inDoc;
}

// --- scan ---

const findings = [];
let filesScanned = 0;

for (const filePath of paths) {
  let text;
  try {
    text = readFileSync(filePath, 'utf8');
  } catch {
    continue;
  }
  filesScanned++;
  const lines = text.split('\n');
  const { inFence, inlineSpans } = buildCodeMask(lines);
  const inDoc = buildDocMask(lines);

  for (let i = 0; i < lines.length; i++) {
    if (inFence.has(i)) continue;
    const line = lines[i];
    let m;
    CYR_RE.lastIndex = 0;
    const chars = [];
    while ((m = CYR_RE.exec(line)) !== null) {
      if (inInlineSpan(inlineSpans, i, m.index)) continue;
      chars.push({ ch: m[0], col: m.index, code: m[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0') });
    }
    if (chars.length === 0) continue;
    const kind = inDoc.has(i) ? 'DOC' : 'FAIL';
    findings.push({
      file: relative(ROOT, filePath),
      line: i + 1,
      kind,
      chars,
      snippet: line.slice(0, 200),
    });
  }
}

// --- report ---

const fails = findings.filter(f => f.kind === 'FAIL');
const docs  = findings.filter(f => f.kind === 'DOC');

console.log(`Cyrillic-homoglyph-guard — ${filesScanned} files scanned`);
console.log(`FAIL (real bug): ${fails.length}`);
console.log(`DOC (intentional in bug-documentation): ${docs.length}`);
console.log('');
if (fails.length === 0 && docs.length === 0) {
  console.log('PASS — no Cyrillic homoglyphs detected.');
} else {
  if (fails.length) {
    console.log('=== FAIL ===');
    for (const f of fails) {
      const chList = f.chars.map(c => `U+${c.code}`).join(', ');
      console.log(`${f.file}:${f.line}  chars=[${chList}]`);
      console.log(`  ${f.snippet}`);
    }
  }
  if (docs.length) {
    console.log('\n=== DOC (intentional — describes the bug) ===');
    for (const f of docs) {
      console.log(`${f.file}:${f.line}  ${f.snippet.slice(0, 120)}...`);
    }
  }
}

process.exit(fails.length === 0 ? 0 : 1);
