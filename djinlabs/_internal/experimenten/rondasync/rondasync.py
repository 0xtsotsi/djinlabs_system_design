"""
rondasync.py — Ronde-flow sync-verificatie assistent (Ronde 17+)

Advisory-only tool dat bij elke Ronde-sluit verifieert of alle _shared/
canon-files gesynced zijn met decisions.md. Gebruikt Jev-classification
(Ronde 17 `classify_jev`) voor drift-detectie.

GEEN AUTO-FIX. Output is advisory.

Volgt sync-discipline-canon.md (Ronde 16) en jev-policy-canon.md
§"Confidence bands" (Ronde 17).

Gebruik:
    python3 rondasync.py                       # default: huidige Ronde
    python3 rondasync.py --ronde N             # specifieke Ronde
    python3 rondasync.py --dry-run             # toon payload zonder Jev-call
    python3 rondasync.py --output PATH         # custom audit-spoor locatie
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime
from pathlib import Path

# Constants
DJR = Path("/Users/gogetta/Documents/djinlabs_system_design")
DECISIONS_MD = DJR / "decisions.md"
SHARED_DIR = DJR / "_shared"
CONTEXT_MD = DJR / "CONTEXT.md"
ENV_FILE = DJR / ".env-test" / "jev-test.env"

TYPESAFE_ENDPOINT = "https://api.typesafe.ai/v1/systemone"
TYPESAFE_MODEL = "jev-1.13.0"
TIMEOUT_SEC = 30

# Ronde 17 confidence-band defaults (canon-patroon, runtime-tuning)
CONFIDENCE_HIGH = 0.7
CONFIDENCE_LOW = 0.35


def load_api_key():
    """Load TYPESAFE_API_KEY from test-env file. NIET CANONIEK."""
    if not ENV_FILE.exists():
        print(f"ERROR: {ENV_FILE} niet gevonden. Run setup eerst.", file=sys.stderr)
        sys.exit(1)
    with open(ENV_FILE) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                if k == "TYPESAFE_API_KEY":
                    return v
    print("ERROR: TYPESAFE_API_KEY niet gevonden in env.", file=sys.stderr)
    sys.exit(1)


def find_latest_ronde():
    """Vind laatste Ronde-nummer en -datum in decisions.md."""
    content = DECISIONS_MD.read_text()
    # Match "## Ronde N — ..." met optionele datum in de metadata
    # Match "## Ronde N — ..." gevolgd door Datum-regel (over lege regels heen)
    pattern = r"## Ronde (\d+)\b.*?\*\*Datum\.\*\*\s*(\d{4}-\d{2}-\d{2})"
    matches = re.findall(pattern, content, re.DOTALL)
    if not matches:
        # Fallback: zoek alleen Ronde-nummer
        pattern_fallback = r"## Ronde (\d+)"
        matches_num = re.findall(pattern_fallback, content)
        if matches_num:
            return int(matches_num[-1]), None
        return None, None
    ronde_num, ronde_datum = matches[-1]
    return int(ronde_num), ronde_datum


def extract_ronde_claims(ronde_num):
    """Extract de claims/decision summary uit een Ronde-sectie."""
    content = DECISIONS_MD.read_text()
    # Vind de Ronde-sectie
    pattern = rf"## Ronde {ronde_num}[^\n]*\n(.*?)(?=\n## Ronde |\n---|\Z)"
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        return []
    section = match.group(1)
    # Extract Q-vragen
    q_pattern = r"-\s+\*\*(Q\d+\.\d+)\s*=\s*([A-Z])[^*]*\*\*"
    claims = re.findall(q_pattern, section)
    return [f"{q}={a}" for q, a in claims]


def list_canon_files():
    """List alle _shared/*.md files + CONTEXT.md."""
    files = []
    for path in sorted(SHARED_DIR.glob("*.md")):
        files.append(path)
    if CONTEXT_MD.exists():
        files.append(CONTEXT_MD)
    return files


def build_jev_payload(file_path, ronde_num, ronde_datum, claims, dry_run=False):
    """Bouw Jev-call payload voor één file."""
    rel_path = file_path.relative_to(DJR)
    try:
        content = file_path.read_text()
    except Exception as e:
        return None, f"Read error: {e}"

    preview = content[:500]

    state = (
        f"File path: {rel_path}\n"
        f"Ronde {ronde_num}"
        + (f" datum: {ronde_datum}" if ronde_datum else "")
        + f"\nRonde {ronde_num} claims: {', '.join(claims) if claims else '(geen Q-vragen gevonden)'}"
        + f"\nFile content preview:\n{preview}"
    )

    questions = {
        "drift_status": {
            "type": "choice",
            "instructions": (
                "Is this canon-file synced with Ronde N decisions? "
                "Synced means: file mentions Ronde N explicitly OR has been updated for Ronde N changes."
            ),
            "criteria": {
                "synced": "File mentions Ronde N explicitly OR has been updated for Ronde N changes",
                "partial-drift": "File is canon-related to Ronde N but missing Ronde N reference",
                "stale": "File predates Ronde N and is no longer accurate",
                "unrelated": "File is canon but has no relationship to Ronde N"
            }
        },
        "needs_update": {
            "type": "noul",
            "instructions": "Does this file need a sync-update to reflect Ronde N?"
        },
        "drift_severity": {
            "type": "score",
            "instructions": "How severe is the drift?",
            "criteria": [
                "Trivial — missing Ronde reference but content unaffected",
                "Moderate — references outdated canon, needs update",
                "Critical — canon claim contradicts Ronde N, must-fix"
            ]
        }
    }

    return {
        "model": TYPESAFE_MODEL,
        "state": state,
        "questions": questions
    }, None


def run_jev_call(api_key, payload):
    """Voer Jev-call uit. Returnt (response_dict, error_str)."""
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        TYPESAFE_ENDPOINT,
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_SEC) as resp:
            return json.loads(resp.read().decode("utf-8")), None
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        return None, f"HTTP {e.code}: {body[:200]}"
    except urllib.error.URLError as e:
        return None, f"URL error: {e}"
    except Exception as e:
        return None, f"Unexpected error: {e}"


def apply_confidence_band(confidence):
    """Pas Ronde 17 confidence-band toe."""
    if confidence > CONFIDENCE_HIGH:
        return "auto-classify"
    elif confidence > CONFIDENCE_LOW:
        return "review-needed"
    else:
        return "default-noop"


def main():
    parser = argparse.ArgumentParser(description="Ronde-flow sync-verificatie (shadow-mode)")
    parser.add_argument("--ronde", type=int, help="Specifieke Ronde (default: laatste)")
    parser.add_argument("--dry-run", action="store_true", help="Toon payloads zonder Jev-call")
    parser.add_argument("--output", type=str, help="Custom audit-spoor output pad")
    args = parser.parse_args()

    # Vind Ronde
    ronde_num, ronde_datum = find_latest_ronde()
    if args.ronde:
        ronde_num = args.ronde
    if not ronde_num:
        print("ERROR: Geen Ronde gevonden in decisions.md", file=sys.stderr)
        sys.exit(1)

    print(f"=== Ronde-flow sync-assistent (Ronde {ronde_num}) ===")
    print(f"Datum: {ronde_datum or 'onbekend'}")
    print(f"Mode: {'dry-run' if args.dry_run else 'shadow-mode (advisory-only)'}")
    print()

    # Extract claims
    claims = extract_ronde_claims(ronde_num)
    print(f"Ronde {ronde_num} claims: {', '.join(claims) if claims else '(geen)'}")
    print()

    # List canon-files
    canon_files = list_canon_files()
    print(f"Canon-files om te checken: {len(canon_files)}")
    for f in canon_files:
        print(f"  - {f.relative_to(DJR)}")
    print()

    # Load API key
    if not args.dry_run:
        api_key = load_api_key()

    # Per-file: build payload + run Jev-call
    results = []
    timestamp = datetime.now().isoformat() + "Z"

    for i, file_path in enumerate(canon_files, 1):
        rel_path = str(file_path.relative_to(DJR))
        print(f"[{i}/{len(canon_files)}] {rel_path}")

        payload, err = build_jev_payload(file_path, ronde_num, ronde_datum, claims)
        if err:
            print(f"  ERROR: {err}")
            continue

        if args.dry_run:
            print(f"  [dry-run] Payload size: {len(json.dumps(payload))} bytes")
            results.append({
                "file": rel_path,
                "status": "dry-run",
                "payload_size": len(json.dumps(payload))
            })
            continue

        start = time.time()
        response, err = run_jev_call(api_key, payload)
        duration = (time.time() - start) * 1000

        if err:
            print(f"  ERROR: {err}")
            results.append({
                "file": rel_path,
                "error": err,
                "duration_ms": round(duration)
            })
            continue

        # Parse response
        answers = response.get("answers", {})
        usage = response.get("usage", {})

        drift_status = answers.get("drift_status", {})
        needs_update = answers.get("needs_update", {})
        drift_severity = answers.get("drift_severity", {})

        status_choice = drift_status.get("choice", "unknown")
        status_conf = drift_status.get("confidence", 0.0)
        status_band = apply_confidence_band(status_conf)

        needs_update_val = needs_update.get("noul", 0.0)
        needs_update_band = apply_confidence_band(1 - needs_update_val)  # noul=0 means update needed

        severity_score = drift_severity.get("score", 0.0)
        severity_band = apply_confidence_band(drift_severity.get("confidence", 0.0))

        cost = usage.get("input_tokens", 0) * 0.042 / 1_000_000

        print(f"  status: {status_choice} (conf={status_conf:.2f}, band={status_band})")
        print(f"  needs_update: {needs_update_val:.2f}")
        print(f"  severity: {severity_score:.2f} (band={severity_band})")
        print(f"  duration: {duration:.0f}ms, cost: ${cost:.6f}")

        results.append({
            "file": rel_path,
            "drift_status": status_choice,
            "drift_confidence": status_conf,
            "action_band": status_band,
            "needs_update": needs_update_val,
            "drift_severity": severity_score,
            "severity_band": severity_band,
            "duration_ms": round(duration),
            "cost_usd": f"${cost:.6f}",
            "input_tokens": usage.get("input_tokens", 0)
        })

    # Schrijf audit-spoor
    audit_dir = DJR / "audit-spoor"
    audit_dir.mkdir(exist_ok=True)
    if args.output:
        audit_path = Path(args.output)
    else:
        safe_timestamp = timestamp.replace(":", "-").replace(".", "-")
        audit_path = audit_dir / f"ronde-{ronde_num}-sync-{safe_timestamp}.json"

    audit_data = {
        "ronde": ronde_num,
        "ronde_datum": ronde_datum,
        "ronde_claims": claims,
        "timestamp": timestamp,
        "tool": "rondasync.py",
        "mode": "dry-run" if args.dry_run else "shadow",
        "results": results
    }
    audit_path.write_text(json.dumps(audit_data, indent=2, ensure_ascii=False))
    print(f"\n=== Audit-spoor geschreven naar {audit_path.relative_to(DJR)} ===")

    # Compileer drift-rapport (Markdown)
    report_path = audit_path.with_suffix(".md")
    report_lines = [
        f"# Ronde {ronde_num} sync-rapport",
        "",
        f"> **Tool:** rondasync.py (advisory-only)",
        f"> **Datum:** {timestamp}",
        f"> **Mode:** {'dry-run' if args.dry_run else 'shadow'}",
        "",
        "## Samenvatting",
        "",
        f"- Canon-files gecheckt: {len(results)}",
        f"- Ronde {ronde_num} claims: {', '.join(claims) if claims else '(geen)'}",
        "",
        "## Per-file resultaat",
        "",
        "| File | Drift-status | Confidence | Action-band | Needs-update | Severity |",
        "|---|---|---|---|---|---|",
    ]
    for r in results:
        if "error" in r:
            report_lines.append(f"| {r['file']} | ERROR | — | — | — | {r.get('error', '')} |")
        else:
            report_lines.append(
                f"| {r['file']} | {r.get('drift_status', '?')} | {r.get('drift_confidence', 0):.2f} | "
                f"{r.get('action_band', '?')} | {r.get('needs_update', 0):.2f} | "
                f"{r.get('drift_severity', 0):.2f} |"
            )

    report_lines.extend([
        "",
        "## Confidence-band (Ronde 17)",
        "",
        f"- High: >{CONFIDENCE_HIGH} → auto-classify",
        f"- Mid: >{CONFIDENCE_LOW} en ≤{CONFIDENCE_HIGH} → review-needed",
        f"- Low: ≤{CONFIDENCE_LOW} → default-noop",
        "",
        "## Actie-advies",
        "",
        "Geen auto-fix (sync-discipline Ronde 16). Founder kan manueel beslissen welke sync-actie nodig is op basis van drift-status.",
        "",
        "## Bron",
        "",
        f"- Tool-design: `djinlabs/_internal/experimenten/rondasync-design.md`",
        f"- Jev-call API: `https://api.typesafe.ai/v1/systemone` (model `jev-1.13.0`)",
        f"- Confidence-bands: `_shared/jev-policy-canon.md` §\"Confidence bands\" (Ronde 17)",
    ])

    report_path.write_text("\n".join(report_lines))
    print(f"=== Drift-rapport geschreven naar {report_path.relative_to(DJR)} ===")


if __name__ == "__main__":
    main()