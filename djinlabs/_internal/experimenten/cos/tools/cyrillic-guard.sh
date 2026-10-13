#!/usr/bin/env bash
# cyrillic-guard.sh — detect Cyrillic homoglyph substitution in canonieke files.
# Scans canonieke folders + specific paths for Cyrillic characters that
# are visually identical to Latin characters (the "Cyrillic-homoglyph bug"
# documented in Working state Hermes 2026-09-28 §4).
#
# Usage:
#   ./cyrillic-guard.sh                # scan default canonieke roots
#   ./cyrillic-guard.sh path/to/file   # scan specific file
#   ./cyrillic-guard.sh --fix          # auto-replace homoglyphs with Latin
#   ./cyrillic-guard.sh --allow-research  # also scan research/ (may contain
#                                          legitimate Cyrillic quotes)
#
# Exit codes:
#   0  no Cyrillic homoglyphs found
#   1  Cyrillic homoglyphs found (with --fix: replacement attempted, re-run to verify)
#   2  usage error
#
# Canoniek-neutraal: dit script is geen canonieke tool. Het is een research/
# debugging-tool onder djinlabs/_internal/experimenten/cos/tools/. Ronde-traject
# nodig voor eventuele promotie naar _shared/tools/ of .githooks/pre-commit.

set -euo pipefail

# Cyrillic homoglyph map (only chars that look identical to Latin)
# Conservative: skip ambiguous cases (Cyrillic U+0456 vs Latin i, etc.)
# unless we have strong evidence of bug substitution.

# Cyrillic homoglyphs (Latin-lookalike). Listed as Unicode escapes so the
# script doesn't trigger its own detector.
GLYPHS_LOWER='\u0430 \u0435 \u043E \u0441 \u0440 \u0443 \u0445 \u0456 \u0458 \u0455'
GLYPHS_UPPER='\u0410 \u0412 \u0415 \u041A \u041C \u041D \u041E \u0420 \u0421 \u0422 \u0425'

show_help() {
  sed -n '2,25p' "$0"
  exit 0
}

# Defaults
ROOTS=("_shared" "djinlabs" "webrnds" ".agents" "decisions.md")
SCAN_RESEARCH=0
FIX_MODE=0
SPECIFIC_FILE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --help|-h) show_help ;;
    --fix) FIX_MODE=1; shift ;;
    --allow-research) SCAN_RESEARCH=1; shift ;;
    # Case-insensitive file extension match for specific-file arg.
    # Empty extension (no dot) also accepted.
    *.[Mm][Dd]|*.[Tt][Xx][Tt]|*.[Jj][Ss][Oo][Nn]|*.[Yy][Mm][Ll]|*.[Yy][Aa][Mm][Ll]|*.[Hh][Tt][Mm][Ll]|*.[Cc][Ss][Ss]|*.[Jj][Ss]|*.[Tt][Ss]|*.[Pp][Yy]|*.[Ss][Hh]|*.[Ee][Nn][Vv])
      SPECIFIC_FILE="$1"; shift ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

if [[ -n "$SPECIFIC_FILE" ]]; then
  TARGETS=("$SPECIFIC_FILE")
elif [[ "$SCAN_RESEARCH" -eq 1 ]]; then
  TARGETS=("research")
  for r in "${ROOTS[@]}"; do
    [[ "$r" != "decisions.md" ]] && TARGETS+=("$r")
  done
  TARGETS+=("decisions.md")
else
  TARGETS=("${ROOTS[@]}")
fi

# Python does the actual scan + (optional) fix. Bash wrapper for portability.
# Targets are passed as JSON array to handle spaces/quotes safely.
TARGETS_JSON=$(python3 -c 'import json,sys; print(json.dumps(sys.argv[1:]))' "${TARGETS[@]}")

python3 << PYEOF
import os, re, sys, json

GLYPH_MAP = {
    '\u0430':'a','\u0435':'e','\u043E':'o','\u0441':'c','\u0440':'p',
    '\u0443':'y','\u0445':'x','\u0456':'i','\u0458':'j','\u0455':'s',
    '\u0410':'A','\u0412':'B','\u0415':'E','\u041A':'K','\u041C':'M',
    '\u041D':'H','\u041E':'O','\u0420':'P','\u0421':'C','\u0422':'T',
    '\u0425':'X',
}
CYR_RE = re.compile('[' + ''.join(GLYPH_MAP.keys()) + ']')

EXT_OK = {'.md','.txt','.json','.yml','.yaml','.html','.css','.js','.ts','.py','.sh','.env','.lock',''}
SKIP_DIRS = {'.git','node_modules','__pycache__','.venv','venv','dist','build'}

targets = json.loads('''$TARGETS_JSON''')
fix_mode = ${FIX_MODE}

files = []
for t in targets:
    if not os.path.exists(t):
        print(f'  SKIP (niet gevonden): {t}', file=sys.stderr)
        continue
    if os.path.isfile(t):
        files.append(t)
    else:
        for dp, dn, fn in os.walk(t):
            dn[:] = [d for d in dn if d not in SKIP_DIRS]
            for f in fn:
                if any(f.lower().endswith(e) for e in EXT_OK):
                    files.append(os.path.join(dp, f))

total_hits = 0
files_with_hits = 0
fix_failures = 0

for fp in files:
    try:
        with open(fp, 'rb') as fh:
            raw = fh.read()
        # Probe utf-8 first; fall back to latin-1 (lossless) for non-UTF8
        try:
            text = raw.decode('utf-8')
        except UnicodeDecodeError:
            text = raw.decode('latin-1')
        matches = list(CYR_RE.finditer(text))
        if not matches:
            continue
        files_with_hits += 1
        total_hits += len(matches)
        print(f'\n  ⚠ {fp}: {len(matches)} Cyrillic homoglyph(s)')
        for m in matches[:5]:
            start = max(0, m.start()-40)
            end = min(len(text), m.end()+40)
            ctx = text[start:end].replace('\n', ' ')
            char = m.group()
            print(f'    U+{ord(char):04X}  ...{ctx}...')
        if len(matches) > 5:
            print(f'    ... and {len(matches)-5} more')

        if fix_mode:
            try:
                fixed = CYR_RE.sub(lambda m: GLYPH_MAP[m.group()], text)
                # Only write if file is utf-8 decodable (don't corrupt latin-1)
                if raw.decode('utf-8'):
                    with open(fp, 'wb') as fh:
                        fh.write(fixed.encode('utf-8'))
                    print(f'    → auto-replaced with Latin lookalikes (re-run to verify)')
            except (OSError, PermissionError) as fix_err:
                fix_failures += 1
                print(f'    → FIX FAILED: {fix_err}', file=sys.stderr)
    except Exception as e:
        print(f'  ERR {fp}: {e}', file=sys.stderr)

print(f'\n{"="*60}')
print(f'Files scanned: {len(files)}')
print(f'Files with Cyrillic homoglyphs: {files_with_hits}')
print(f'Total homoglyph chars: {total_hits}')
if fix_failures:
    print(f'Fix failures: {fix_failures}')
if fix_mode and (files_with_hits or fix_failures):
    print(f'\n⚠ Fix mode was active. Re-run without --fix to verify all clean.')
    sys.exit(1)
elif files_with_hits:
    sys.exit(1)
else:
    print(f'✓ All clear.')
    sys.exit(0)
PYEOF
