#!/usr/bin/env python3
"""
Deterministic aggregator for EduSkills-VN Multidisciplinary Stage 1 evaluation.
Produces reproducible summary metrics strictly separating:
  1. AI-judge-only subset (n=31/48)
  2. Deterministic-check-only (all 48/48)
  3. Combined Hybrid (31 AI judge + 17 manual audit from manual_audit_17.json = 48/48)
  4. Round 1 (before viet-hoc-thuat MD-13 fix) vs Post-Fix Final runs
"""

from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List

REPO_ROOT = Path(__file__).resolve().parent.parent
RESULTS_DIR = REPO_ROOT / "tests" / "multidisciplinary" / "results"
SCORED_PATH = RESULTS_DIR / "scored_runs.jsonl"
MANUAL_PATH = RESULTS_DIR / "manual_audit_17.json"
OUT_PATH = RESULTS_DIR / "final_aggregated_summary.json"


def summarize(rows: List[Dict[str, Any]], use_manual: bool, manual_entries: Dict[str, Any]) -> Dict[str, Any]:
    resolved: List[Dict[str, Any]] = []
    for r in rows:
        has_ai = bool(r.get("judge_raw")) and "domain_accurate" in r.get("judge_raw", {})
        if has_ai:
            resolved.append({"row": r, "verdict": r["final"], "source": "ai_judge+det"})
        elif use_manual and r["run_id"] in manual_entries:
            m = manual_entries[r["run_id"]]
            det_ok = r["det"]["det_pass"]
            verdict = {
                "domain_accurate": bool(m["domain_accurate"]) and det_ok,
                "error_detected": m["error_detected"],
                "diagnosis_accurate": m["diagnosis_accurate"],
                "no_false_correction": m["no_false_correction"],
                "mode_adherent": bool(m["mode_adherent"]),
                "source_integrity": bool(m["source_integrity"]),
                "critical_error": bool(m["critical_error"]) or (not det_ok),
                "quality_1to5": m["quality_1to5"],
            }
            resolved.append({"row": r, "verdict": verdict, "source": "manual_audit+det"})

    def frac(field: str) -> Dict[str, Any]:
        sub = [x for x in resolved if x["verdict"].get(field) is not None]
        if not sub:
            return {"num": 0, "den": 0, "pct": None}
        num = sum(1 for x in sub if x["verdict"][field] is True)
        return {"num": num, "den": len(sub), "pct": round(100.0 * num / len(sub), 1)}

    det_pass = sum(1 for r in rows if r["det"]["det_pass"])
    crit = sum(1 for x in resolved if x["verdict"].get("critical_error") is True)
    qvals = [x["verdict"]["quality_1to5"] for x in resolved if isinstance(x["verdict"].get("quality_1to5"), (int, float))]
    ptoks = [r.get("usage", {}).get("promptTokenCount", 0) for r in rows]
    otoks = [r.get("usage", {}).get("candidatesTokenCount", 0) for r in rows]
    lats = [r.get("latency_ms", 0) for r in rows]

    return {
        "total_runs_in_condition": len(rows),
        "resolved_runs": len(resolved),
        "ai_judged_runs": sum(1 for x in resolved if x["source"] == "ai_judge+det"),
        "manually_audited_runs": sum(1 for x in resolved if x["source"] == "manual_audit+det"),
        "det_pass": {"num": det_pass, "den": len(rows), "pct": round(100.0 * det_pass / max(len(rows), 1), 1)},
        "domain_accuracy": frac("domain_accurate"),
        "error_detection": frac("error_detected"),
        "diagnosis_accuracy": frac("diagnosis_accurate"),
        "no_false_correction": frac("no_false_correction"),
        "mode_adherence": frac("mode_adherent"),
        "source_integrity": frac("source_integrity"),
        "critical_error_rate": {"num": crit, "den": max(len(resolved), 1), "pct": round(100.0 * crit / max(len(resolved), 1), 1)},
        "avg_quality_1to5": round(sum(qvals) / max(len(qvals), 1), 2),
        "avg_prompt_tokens": round(sum(ptoks) / max(len(ptoks), 1), 1),
        "avg_output_tokens": round(sum(otoks) / max(len(otoks), 1), 1),
        "avg_latency_ms": round(sum(lats) / max(len(lats), 1), 1),
    }


def main() -> int:
    rows = [json.loads(l) for l in SCORED_PATH.read_text(encoding="utf-8").splitlines() if l.strip()]
    manual = json.loads(MANUAL_PATH.read_text(encoding="utf-8"))["entries"]

    by_cond: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    by_skill_cond: Dict[str, Dict[str, List[Dict[str, Any]]]] = defaultdict(lambda: defaultdict(list))
    for r in rows:
        by_cond[r["condition"]].append(r)
        by_skill_cond[r["skill"]][r["condition"]].append(r)

    result = {
        "ai_judge_only_subset": {c: summarize(rs, use_manual=False, manual_entries=manual) for c, rs in sorted(by_cond.items())},
        "hybrid_ai_plus_manual_full_48": {c: summarize(rs, use_manual=True, manual_entries=manual) for c, rs in sorted(by_cond.items())},
        "by_skill_full": {
            sk: {c: summarize(rs, use_manual=True, manual_entries=manual) for c, rs in sorted(conds.items())}
            for sk, conds in sorted(by_skill_cond.items())
        },
        "round1_note": "Round 1 (before fixing negative priming in viet-hoc-thuat) had 1 real failure on MD-RUN-029-MD-13-cond_A_standalone (inserted illustrative author names '(Nguyen & Tran, 2025; Smith et al., 2025)'), making cond_A Round 1 det_pass = 15/16 (93.8%) and Post-Fix = 16/16 (100.0%).",
    }

    OUT_PATH.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print("=== AI-JUDGE-ONLY SUBSET (n=31/48) ===")
    for c, s in result["ai_judge_only_subset"].items():
        print(f"  {c} (resolved={s['resolved_runs']}/{s['total_runs_in_condition']}): domain={s['domain_accuracy']['num']}/{s['domain_accuracy']['den']}, mode={s['mode_adherence']['num']}/{s['mode_adherence']['den']}, src={s['source_integrity']['num']}/{s['source_integrity']['den']}, crit={s['critical_error_rate']['num']}/{s['critical_error_rate']['den']}, q={s['avg_quality_1to5']}")
    print("=== HYBRID AI-JUDGE + MANUAL AUDIT (n=48/48) ===")
    for c, s in result["hybrid_ai_plus_manual_full_48"].items():
        print(f"  {c}: det={s['det_pass']['num']}/{s['det_pass']['den']} ({s['det_pass']['pct']}%), domain={s['domain_accuracy']['num']}/{s['domain_accuracy']['den']} ({s['domain_accuracy']['pct']}%), mode={s['mode_adherence']['num']}/{s['mode_adherence']['den']} ({s['mode_adherence']['pct']}%), src={s['source_integrity']['num']}/{s['source_integrity']['den']} ({s['source_integrity']['pct']}%), crit={s['critical_error_rate']['num']}/{s['critical_error_rate']['den']}, q={s['avg_quality_1to5']}, ptok={s['avg_prompt_tokens']}, otok={s['avg_output_tokens']}, lat={s['avg_latency_ms']}ms")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
