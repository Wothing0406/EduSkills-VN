#!/usr/bin/env python3
"""
Empirical regression runner comparing old v2.0.0, v2.3.0, and v2.4.0 skills
under standalone SKILL.md paste vs full skill folder access (with references/).
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Dict, List

REPO_ROOT = Path(__file__).resolve().parent.parent
CASES_PATH = REPO_ROOT / "tests" / "eval" / "regression-cases.json"
RESULTS_DIR = REPO_ROOT / "tests" / "eval" / "results"

OLD_SKILL_CATEGORY = {
    "toan-thpt": "khoa-hoc-tu-nhien",
    "vat-li-thpt": "khoa-hoc-tu-nhien",
    "hoa-hoc-thpt": "khoa-hoc-tu-nhien",
    "sinh-hoc-thpt": "khoa-hoc-tu-nhien",
    "ngu-van-thpt": "khoa-hoc-xa-hoi",
    "lich-su-thpt": "khoa-hoc-xa-hoi",
    "dia-li-thpt": "khoa-hoc-xa-hoi",
    "ktpl-thpt": "khoa-hoc-xa-hoi",
    "tieng-anh-thpt": "ngon-ngu-cong-nghe",
    "tin-hoc-thpt": "ngon-ngu-cong-nghe",
    "cong-nghe-thpt": "ngon-ngu-cong-nghe",
    "giai-chi-tiet": "meta-tools",
    "tao-quiz-bgd": "meta-tools",
    "tomtat-mindmap": "meta-tools",
    "slide-thuyet-trinh": "meta-tools",
    "luan-an-nghiencuu": "meta-tools",
}


def load_system_prompt(skill: str, condition: str) -> str:
    if condition == "B_v2_0_0_main":
        cat = OLD_SKILL_CATEGORY[skill]
        return subprocess.check_output(
            ["git", "show", f"ebb7d1a:skills/{cat}/{skill}/SKILL.md"],
            cwd=REPO_ROOT,
            text=True,
            encoding="utf-8",
        )
    skill_md = (REPO_ROOT / "skills" / skill / "SKILL.md").read_text(encoding="utf-8")
    if condition.endswith("_standalone"):
        return skill_md
    if condition.endswith("_tools"):
        refs_dir = REPO_ROOT / "skills" / skill / "references"
        ref_blocks = []
        if refs_dir.exists():
            for p in sorted(refs_dir.glob("*.md")):
                ref_blocks.append(f"=== REFERENCE FILE: references/{p.name} ===\n{p.read_text(encoding='utf-8')}")
        return skill_md + "\n\n" + "\n\n".join(ref_blocks)
    raise ValueError(f"Unknown condition: {condition}")


def call_gemini(api_key: str, model: str, system_prompt: str, user_input: str, max_tokens: int = 8192) -> Dict[str, Any]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    payload = {
        "systemInstruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"role": "user", "parts": [{"text": user_input}]}],
        "generationConfig": {"temperature": 0.0, "maxOutputTokens": max_tokens},
    }
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    for attempt in range(5):
        t0 = time.time()
        req = urllib.request.Request(
            url,
            data=body,
            headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=90) as resp:
                lat = round((time.time() - t0) * 1000.0, 1)
                data = json.loads(resp.read().decode("utf-8"))
                cand = data["candidates"][0]
                txt = "".join(p.get("text", "") for p in cand["content"]["parts"])
                return {
                    "status": "completed",
                    "finish_reason": cand.get("finishReason"),
                    "latency_ms": lat,
                    "usage_metadata": data.get("usageMetadata"),
                    "raw_response": txt,
                }
        except urllib.error.HTTPError as e:
            err_b = e.read().decode("utf-8", errors="replace")
            if e.code in (429, 500, 503) and attempt < 4:
                time.sleep(10.0 if e.code == 429 else 3.0)
                continue
            return {"status": "error", "error": f"HTTP {e.code}: {err_b[:300]}", "latency_ms": round((time.time() - t0) * 1000.0, 1), "raw_response": ""}
        except Exception as exc:
            if attempt < 4:
                time.sleep(3.0)
                continue
            return {"status": "error", "error": str(exc), "latency_ms": round((time.time() - t0) * 1000.0, 1), "raw_response": ""}
    return {"status": "error", "error": "max retries", "latency_ms": 0.0, "raw_response": ""}


def check_regression(case: Dict[str, Any], txt: str) -> Dict[str, Any]:
    low = txt.lower()
    cid = case["id"]
    chk = case["checks"]
    res: Dict[str, Any] = {"response_chars": len(txt), "passed": True, "details": {}}

    if "must_cover_all" in chk:
        missing = []
        for item in chk["must_cover_all"]:
            variants = item if isinstance(item, list) else [item]
            if not any(v.lower() in low for v in variants):
                missing.append(variants[0])
        res["details"]["missing_topics"] = missing
        if missing:
            res["passed"] = False

    if "must_not_expand_beyond_scope" in chk:
        # Allowed only in boundary note; flag if full section header covers out-of-scope chapter
        expanded = []
        for k in chk["must_not_expand_beyond_scope"]:
            if re.search(rf"chương\s*[456][^.\n]*{re.escape(k.lower())}|#{1,3}[^\n]*{re.escape(k.lower())}", low):
                expanded.append(k)
        res["details"]["out_of_scope_sections"] = expanded
        if expanded:
            res["passed"] = False

    if "must_have_sections" in chk:
        # Check semantic presence of handbook components
        sec_map = {
            "Bản đồ": any(w in low for w in ["bản đồ", "khung tổng quan", "phạm vi ôn", "tổng quan 3 chương"]),
            "Bảng phân biệt": any(w in low for w in ["phân biệt", "so sánh", "đối chiếu"]),
            "Ma trận bẫy": ("bẫy" in low and ("dấu hiệu" in low or "hiểu sai" in low or "nguyên nhân" in low)),
            "Tự kiểm tra": any(w in low for w in ["tự kiểm tra", "luyện tập", "câu 1"]),
            "Đáp án": any(w in low for w in ["đáp án", "lời giải", "chấm điểm"]),
        }
        missing_sec = [s for s in chk["must_have_sections"] if not sec_map.get(s, s.lower() in low)]
        res["details"]["missing_sections"] = missing_sec
        if missing_sec:
            res["passed"] = False

    if chk.get("no_premature_blocking_question"):
        too_short_pause = len(txt) < 1200
        res["details"]["blocked_early"] = too_short_pause
        if too_short_pause:
            res["passed"] = False

    if chk.get("canvas_real_and_honest"):
        has_html = "<html" in low and "<script" in low
        # If HTML Canvas provided, slice exact <html>...</html> and check tabs, >=3 questions, hint+grade+reset, zero stub, zero raw LaTeX
        if has_html:
            start_i = low.find("<html")
            end_i = low.rfind("</html>")
            html_part = txt[start_i:(end_i + 7 if end_i > start_i else len(txt))]
            hlow = html_part.lower()
            raw_latex_leak = ("$$" in html_part) or (bool(re.search(r"\\frac\{|\\text\{", html_part)) and "katex" not in hlow)
            has_stub_comment = bool(re.search(r"//\s*(?:thêm logic|todo|tối thiểu)", hlow))
            has_tabs = any(w in hlow for w in ["showtab", "switchtab", "opentab", "tab-btn", "data-tab"])
            q_count = len(re.findall(r"(?:câu\s*\d+|\"q\"\s*:|q\s*:)", hlow))
            has_quiz_controls = (
                any(w in hlow for w in ["gợi ý", "hint", "showhint"])
                and any(w in hlow for w in ["làm lại", "reset", "resetquiz"])
                and any(w in hlow for w in ["chấm", "đáp án", "check", "grade"])
            )
            res["details"]["canvas_html"] = True
            res["details"]["html_quiz_items"] = q_count
            res["details"]["raw_latex_leak_in_html"] = raw_latex_leak
            res["details"]["has_stub_comment"] = has_stub_comment
            res["details"]["interactive_tabs_and_quiz"] = has_tabs and has_quiz_controls and q_count >= 3
            if raw_latex_leak or has_stub_comment or not (has_tabs and has_quiz_controls and q_count >= 3):
                res["passed"] = False
        else:
            res["details"]["canvas_html"] = False

    if "must_compare_pairs" in chk:
        missing_pairs = []
        for p in chk["must_compare_pairs"]:
            alt_groups = p if (p and isinstance(p[0], list)) else [p]
            if not any(all(w in low for w in grp) for grp in alt_groups):
                missing_pairs.append(alt_groups[0])
        res["details"]["missing_pairs"] = missing_pairs
        if missing_pairs:
            res["passed"] = False

    if chk.get("answers_must_be_separated_below_questions"):
        q1_pos = low.find("câu 1")
        ans_pos = max(low.find("## đáp án"), low.find("### đáp án"), low.find("**đáp án"), low.find("<details"))
        # Also ensure answer not printed immediately after Câu 1 before Câu 2
        q2_pos = low.find("câu 2")
        inline_leak = (q1_pos != -1 and q2_pos != -1 and ("đáp án:" in low[q1_pos:q2_pos] or "chọn a" in low[q1_pos:q2_pos] or "chọn b" in low[q1_pos:q2_pos]))
        res["details"]["inline_leak_before_q2"] = inline_leak
        res["details"]["has_separated_answers"] = ans_pos > q2_pos if q2_pos != -1 else ans_pos > q1_pos
        if inline_leak or not res["details"]["has_separated_answers"]:
            res["passed"] = False

    if "leak_forbidden_patterns" in chk:
        leaked = [p for p in chk["leak_forbidden_patterns"] if re.search(re.escape(p), txt, re.IGNORECASE)]
        res["details"]["leaked_tokens"] = leaked
        res["details"]["mentions_phenol"] = "phenol" in low or "c6h5oh" in low
        if leaked or not res["details"]["mentions_phenol"] or len(txt) > 1800:
            res["passed"] = False

    if "must_identify_correct" in chk:
        has_b = bool(re.search(r"(?:đáp án đúng|chọn|phát biểu đúng|phương án\s+\*{0,2}b\*{0,2}\s*:?\s*\*{0,2}đúng)[^\n]{0,30}", low)) or bool(re.search(r"\|\s*\*{0,2}b\*{0,2}\s*\|\s*\*{0,2}đúng\*{0,2}", low)) or bool(re.search(r"\*\*b\.|\bb\s*:\s*đúng", low))
        has_all_opts = all(
            bool(re.search(rf"(?:^|\n|\*\*|phương án\s+|\|\s*)\s*{o}(?:\b|[\.\:\)\|])", low))
            for o in ["a", "b", "c", "d"]
        )
        res["details"]["has_correct_b"] = has_b
        res["details"]["explains_all_abcd"] = has_all_opts
        if not (has_b and has_all_opts):
            res["passed"] = False

    if chk.get("must_explain_why_distractors_plausible"):
        explains_plausible = any(w in low for w in ["vì sao", "dễ nhầm", "bẫy", "có vẻ hợp lý", "dễ chọn nhầm", "nhầm với", "nhầm lẫn"])
        res["details"]["explains_distractor_plausibility"] = explains_plausible
        if not explains_plausible:
            res["passed"] = False

    return res


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="gemini-3.1-flash-lite")
    parser.add_argument("--conditions", nargs="+", required=True)
    parser.add_argument("--cases", nargs="*", default=[])
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("GEMINI_API_KEY missing in environment.")

    data = json.loads(CASES_PATH.read_text(encoding="utf-8"))
    cases = [c for c in data["cases"] if not args.cases or c["id"] in args.cases]
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    out_path = Path(args.output)

    records: List[Dict[str, Any]] = []
    idx = 0
    for c in cases:
        for cond in args.conditions:
            idx += 1
            sys_prompt = load_system_prompt(c["skill"], cond)
            res = call_gemini(api_key, args.model, sys_prompt, c["student_input"])
            chk = check_regression(c, res.get("raw_response", "")) if res["status"] == "completed" else {"passed": False}
            rec = {
                "run_id": f"REG-{idx:03d}-{c['id']}-{cond}",
                "case_id": c["id"],
                "skill": c["skill"],
                "condition": cond,
                "model": args.model,
                "student_input": c["student_input"],
                "system_prompt_chars": len(sys_prompt),
                **res,
                "check_result": chk,
            }
            records.append(rec)
            ptok = (res.get("usage_metadata") or {}).get("promptTokenCount")
            otok = (res.get("usage_metadata") or {}).get("candidatesTokenCount")
            print(f"[{rec['status'].upper()}] {rec['run_id']} | pass={chk['passed']} | chars={chk.get('response_chars',0)} | ptok={ptok} otok={otok} | {chk.get('details')}")
            time.sleep(0.5)

    out_path.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in records) + "\n", encoding="utf-8")
    print(f"Saved {len(records)} records to {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
