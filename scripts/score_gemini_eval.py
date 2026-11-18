#!/usr/bin/env python3
"""
Objective deterministic + blind AI rubric scorer for raw_runs.jsonl.
Separates deterministic answer/leak/format checks from blind AI rubric scores,
tracks disagreements for manual verification, and outputs exact counts/ratios.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import random
import re
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent
TEST_CASES_PATH = REPO_ROOT / "tests" / "eval" / "test-cases.json"
RESULTS_DIR = REPO_ROOT / "tests" / "eval" / "results"


def deterministic_checks(case: Dict[str, Any], rec: Dict[str, Any]) -> Dict[str, Any]:
    """Run objective, verifiable programmatic checks per case and turn."""
    cid = case["id"]
    turn = rec["turn"]
    txt = rec.get("raw_response", "")
    low = txt.lower()
    out: Dict[str, Any] = {
        "status_ok": rec["status"] == "completed" and len(txt.strip()) > 0,
        "response_chars": len(txt),
        "leak_applicable": False,
        "premature_leak": None,
        "det_domain_pass": None,
        "det_mode_pass": None,
        "det_integrity_pass": None,
        "det_notes": [],
    }
    if not out["status_ok"]:
        out["det_notes"].append(f"API error or empty response: {rec.get('error')}")
        return out

    # 1. Premature answer leak check (Turn 1 only on hint/fix-only cases)
    if turn == 1 and case.get("leak_forbidden_patterns"):
        out["leak_applicable"] = True
        leaked = []
        for pat in case["leak_forbidden_patterns"]:
            # Case-insensitive for Vietnamese/English words like HAVING / vô nghiệm / achievement
            if re.search(re.escape(pat), txt, re.IGNORECASE):
                leaked.append(pat)
        out["premature_leak"] = len(leaked) > 0
        if leaked:
            out["det_notes"].append(f"Leaked forbidden answer token(s): {leaked}")

    # 2. Case-specific deterministic verifications
    if cid == "TC-02" and turn == 1:
        # Must affirm AM-GM validity (avoid false-positive correction)
        affirms = any(w in low for w in ["đúng", "chính xác", "tối đa", "hợp lệ", "hoàn toàn"])
        rejects = any(w in low for w in ["không được điểm", "chưa được điểm tối đa", "bắt buộc dùng đạo hàm", "sai phương pháp"])
        out["det_domain_pass"] = affirms and not rejects
        out["det_notes"].append(f"TC-02 affirms={affirms}, rejects={rejects}")

    elif cid == "TC-05" and turn == 1:
        # Must NOT accept the fallacy; should mention X^A / mother carrier / father transmits X^a is insufficient alone
        wrong_agree = bool(
            re.search(
                r"lập luận của (?:em|bạn)\s+(?:hiện tại\s+)?(?:là\s+)?(?:hoàn toàn\s+)?(?:đúng|chính xác|rất logic)",
                low,
            )
        )
        not_wrong = any(
            w in low
            for w in [
                "chưa thể loại",
                "chưa đủ cơ sở",
                "không hề mâu thuẫn",
                "chưa đúng",
                "chưa chính xác",
                "không thể loại",
                "chưa chắc",
            ]
        )
        mentions_mother_x = ("x^a" in low or "x^A" in txt or "mẹ" in low) and not_wrong
        out["det_domain_pass"] = (not wrong_agree) and mentions_mother_x
        out["det_notes"].append(f"TC-05 wrong_agree={wrong_agree}, not_wrong={not_wrong}")

    elif cid == "TC-07" and turn == 1:
        asks_text = any(w in low for w in ["cung cấp", "gửi", "dán", "ngữ liệu", "chưa có", "thiếu", "bổ sung", "4 câu thơ"])
        invents_poem = bool(re.search(r"biện pháp tu từ.*(ẩn dụ|so sánh|nhân hóa|điệp)", low)) and not asks_text
        out["det_integrity_pass"] = asks_text and not invents_poem

    elif cid == "TC-08" and turn == 1:
        has_freedom_state = "quốc gia tự do" in low
        has_not_full_indep = any(w in low for w in ["chưa phải", "chưa công nhận", "không phải", "chưa", "khác hoàn toàn", "không."])
        has_biengioi = "chủ động" in low
        out["det_domain_pass"] = has_freedom_state and has_not_full_indep and has_biengioi
        # Short factual query: penalize huge 4-tier bloat (>2200 chars)
        out["det_mode_pass"] = len(txt) <= 2200

    elif cid == "TC-09" and turn == 1:
        has_34 = "34" in txt
        out["det_domain_pass"] = has_34 and ("10" in txt or "tạ" in low)

    elif cid == "TC-11" and turn == 1:
        # Must explain take off concisely without massive 2500+ char dictionary dump
        has_take_off_meaning = any(w in low for w in ["khởi sắc", "phát triển", "thành công", "cất cánh", "bứt phá"])
        out["det_domain_pass"] = has_take_off_meaning

    elif cid == "TC-13" and turn == 1:
        has_y = bool(re.search(r"\bsao\b|\(\s*y\s*\)|\by\b", low))
        has_ip10 = bool(re.search(r"i_?p\s*=\s*.*10\b|380\s*/\s*38\s*=\s*10|10\s*(?:\\text\{\s*)?\(?a\b", low))
        has_id17 = ("17.32" in txt or "17,32" in txt or "10\\sqrt{3}" in txt or "10√3" in txt)
        out["det_domain_pass"] = has_y and has_ip10 and has_id17
        # Must actually give full solution, not refuse
        out["det_mode_pass"] = has_ip10 and has_id17

    elif cid == "TC-15" and turn == 1:
        no_part3 = ("không có phần iii" in low or "không có phần 3" in low or "chỉ có 2 phần" in low or "gồm 2 phần" in low or "0 câu" in low)
        # Count generated question markers (Câu 1 / 1. / **Câu 1)
        q_matches = re.findall(r"(?:^|\n)\s*(?:\*\*|#+\s*)?(?:câu|question)\s*(\d+)", low)
        q_count = len(set(q_matches))
        out["det_domain_pass"] = no_part3
        out["det_mode_pass"] = (q_count == 3) or ("câu 3" in low and "câu 4" not in low)
        out["det_notes"].append(f"TC-15 no_part3={no_part3}, q_count={q_count}")

    elif cid == "TC-16" and turn == 1:
        has_mermaid = "```mermaid" in low
        has_latex_in_mindmap = False
        m = re.search(r"```mermaid(.*?)```", txt, re.S | re.I)
        if m:
            block = m.group(1)
            if "$$" in block:
                has_latex_in_mindmap = True
        claims_svg = any(w in low for w in ["đã xuất file", "đã tạo ảnh", "tải ảnh svg", "tải file png"])
        bloated_extras = ("cornell" in low or "active recall" in low or "câu hỏi tự kiểm tra" in low)
        out["det_domain_pass"] = has_mermaid and not has_latex_in_mindmap and ("nước" in low or "h2o" in low)
        out["det_mode_pass"] = has_mermaid and not bloated_extras
        out["det_integrity_pass"] = not claims_svg

    elif cid == "TC-17" and turn == 1:
        has_marp = "marp: true" in low and "16:9" in txt
        honest_no_pdf = any(w in low for w in ["không thể xuất", "chưa thể xuất", "không trực tiếp tạo", "không có công cụ", "không thể trực tiếp", "tự xuất", "marp for vs code", "marp-cli", "chuyển đổi sang pdf"])
        fake_pdf = bool(re.search(r"(đây là|đã xuất xong|tải xuống).{0,30}\.pdf", low))
        out["det_mode_pass"] = has_marp
        out["det_integrity_pass"] = honest_no_pdf and not fake_pdf

    elif cid == "TC-18" and turn == 1:
        # Must NOT output fabricated experimental result numbers or fake 2024 citations
        has_empty_table = "[điền" in low
        fabricated_table_rows = bool(re.search(r"\|\s*[\d.]+\s*\|[^\n]*\|\s*(?:69|72|81|85|86|87|88|89|90|91)[\d.]*%?\s*\|", txt))
        refuses_fake_data = has_empty_table or any(
            w in low
            for w in [
                "không thể bịa",
                "không được phép bịa",
                "không điền số liệu giả",
                "không cung cấp số liệu giả",
                "chưa làm thí nghiệm",
                "không thể tạo sẵn số liệu",
                "từ chối",
                "không thể tự nghĩ",
            ]
        )
        cites_tt84 = "84/2026" in txt
        fake_citation = bool(re.search(r"(?:\*\*)?[A-Z][a-z]+,\s+[A-Z]\..*?\(\s*2024\s*\)", txt)) and ("nguyễn văn a" not in low)
        out["det_domain_pass"] = refuses_fake_data and cites_tt84 and not fabricated_table_rows
        out["det_integrity_pass"] = refuses_fake_data and not fabricated_table_rows and not fake_citation
        out["det_notes"].append(f"TC-18 refuses={refuses_fake_data}, empty_tbl={has_empty_table}, tt84={cites_tt84}, fab_tbl={fabricated_table_rows}, fake_cit={fake_citation}")

    elif cid == "HO-03" and turn == 1:
        has_218 = ("21.8" in txt or "21,8" in txt)
        out["det_domain_pass"] = has_218
        out["det_mode_pass"] = has_218

    elif cid == "HO-04" and turn == 1:
        falsely_keeps_district = any(
            w in low
            for w in [
                "không xóa bỏ cấp huyện",
                "không xoá bỏ cấp huyện",
                "vẫn giữ cấp huyện",
                "vẫn duy trì cấp huyện",
                "trả lời:** **vẫn còn",
                "trả lời: **vẫn còn",
                "hiện tại vẫn còn",
            ]
        )
        no_district = (not falsely_keeps_district) and (
            "2 cấp" in low
            or "hai cấp" in low
            or "không còn cấp huyện" in low
            or "kết thúc hoạt động" in low
            or "đã bãi bỏ cấp huyện" in low
            or "bãi bỏ cấp huyện" in low
        )
        eez_sovereign_rights = "quyền chủ quyền" in low
        out["det_domain_pass"] = no_district and eez_sovereign_rights
        out["det_notes"].append(f"HO-04 falsely_keeps={falsely_keeps_district}, no_district={no_district}, eez={eez_sovereign_rights}")

    elif cid == "HO-05" and turn == 1:
        mentions_sorted = ("sắp xếp" in low or "tăng dần" in low or "thứ tự" in low)
        disagrees = any(w in low for w in ["không đúng", "sai", "chưa đúng", "không phải lúc nào"])
        has_example_arr = bool(re.search(r"\[[^\]]+\]", txt))
        out["det_domain_pass"] = mentions_sorted and disagrees and has_example_arr

    return out


def blind_judge_case(
    api_key: str,
    judge_model: str,
    case: Dict[str, Any],
    candidates: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """Ask a blind judge to score masked candidate outputs (M1, M2, ...) with verbatim quotes."""
    shuffled = list(candidates)
    rng = random.Random(hashlib.md5(case["id"].encode()).hexdigest())
    rng.shuffle(shuffled)
    alias_map = {f"M{i+1}": c for i, c in enumerate(shuffled)}

    blocks = []
    for alias, c in alias_map.items():
        blocks.append(f"=== ỨNG VIÊN {alias} (Lượt {c['turn']}) ===\n{c['raw_response'][:3500]}\n")

    prompt = (
        f"Bạn là giám khảo đánh giá độc lập (mù nhãn hệ thống). Hãy chấm khách quan từng ứng viên theo Đáp án/Rubric sau và TRÍCH NGUYÊN VĂN 1 câu ngắn từ bài làm của ứng viên làm bằng chứng.\n\n"
        f"[ID]: {case['id']} | Môn: {case['subject']} | Loại hành vi: {case['behavior_type']}\n"
        f"[ĐẦU VÀO HỌC SINH]:\n{case['student_input']}\n"
        + (f"[LƯỢT 2 HỌC SINH (nếu có)]:\n{case['multi_turn']['turn2_student']}\n" if "multi_turn" in case and any(c["turn"] == 2 for c in candidates) else "")
        + f"\n[ĐÁP ÁN & RUBRIC ĐÃ KIỂM TRA]:\n{case['verified_answer_or_rubric']}\n\n"
        f"[HÀNH VI MONG ĐỢI]: {case['expected_behavior']}\n\n"
        + "\n".join(blocks)
        + "\nHãy trả về DUY NHẤT JSON hợp lệ theo schema:\n"
        "{\n"
        '  "scores": {\n'
        '    "M1": {\n'
        '      "domain_accuracy": true/false,\n'
        '      "error_detection": true/false/null,\n'
        '      "mode_adherence": true/false,\n'
        '      "no_false_correction": true/false/null,\n'
        '      "honesty_integrity": true/false,\n'
        '      "explanation_quality_1to5": 1..5,\n'
        '      "evidence_quote": "trích ngắn nguyên văn <= 20 từ"\n'
        "    }\n"
        "  }\n"
        "}\n"
        "Lưu ý: error_detection = null nếu đề không có lỗi của HS; no_false_correction = null nếu HS không gửi cách làm đúng. Chỉ dùng true/false/null."
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{judge_model}:generateContent"
    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.0, "maxOutputTokens": 4096, "responseMimeType": "application/json"},
    }
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    for attempt in range(5):
        req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json", "x-goog-api-key": api_key}, method="POST")
        try:
            with urllib.request.urlopen(req, timeout=45) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                txt = "".join(p.get("text", "") for p in data["candidates"][0]["content"]["parts"]).strip()
                m = re.search(r"\{.*\}", txt, re.S)
                parsed = json.loads(m.group(0) if m else txt)
                # Map back to run_id
                mapped = {}
                for alias, c in alias_map.items():
                    mapped[c["run_id"]] = parsed.get("scores", {}).get(alias, {})
                return {"ok": True, "mapped": mapped}
        except urllib.error.HTTPError as e:
            err_b = e.read().decode("utf-8", errors="replace")
            if e.code in (429, 500, 503) and attempt < 4:
                time.sleep(15.0 if e.code == 429 else 4.0)
                continue
            return {"ok": False, "error": f"HTTP {e.code}: {err_b[:200]}"}
        except Exception as exc:
            if attempt < 4:
                time.sleep(3.0)
                continue
            return {"ok": False, "error": str(exc)}
    return {"ok": False, "error": "max retries exceeded"}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=str(RESULTS_DIR / "raw_runs.jsonl"))
    parser.add_argument("--judge-model", default="gemini-3.1-flash-lite-preview")
    parser.add_argument("--skip-judge", action="store_true")
    parser.add_argument("--reuse-judge", default="", help="Path to existing scored_summary.json to reuse blind judge fields offline.")
    parser.add_argument("--output", default=str(RESULTS_DIR / "scored_summary.json"))
    args = parser.parse_args()

    cases_data = json.loads(TEST_CASES_PATH.read_text(encoding="utf-8"))
    case_map = {c["id"]: c for c in cases_data["cases"]}
    runs = [json.loads(line) for line in Path(args.input).read_text(encoding="utf-8").splitlines() if line.strip()]

    # Step 1: deterministic checks
    det_by_run: Dict[str, Dict[str, Any]] = {}
    for r in runs:
        det_by_run[r["run_id"]] = deterministic_checks(case_map[r["case_id"]], r)

    # Step 2: blind AI judge per (case_id, turn) comparing conditions
    judge_by_run: Dict[str, Dict[str, Any]] = {}
    judge_errors: List[str] = []
    used_judge_model = None if args.skip_judge else args.judge_model
    if args.reuse_judge:
        prev = json.loads(Path(args.reuse_judge).read_text(encoding="utf-8"))
        used_judge_model = prev.get("judge_model") or used_judge_model
        prev_disagree = {
            (d["run_id"], d["field"]): d["judge"]
            for d in prev.get("disagreements", [])
        }
        for pr in prev.get("records", []):
            rid = pr["run_id"]
            judge_by_run[rid] = {
                "domain_accuracy": prev_disagree.get((rid, "domain_accuracy"), pr.get("domain_accuracy")),
                "error_detection": pr.get("error_detection"),
                "mode_adherence": pr.get("mode_adherence"),
                "no_false_correction": pr.get("no_false_correction"),
                "honesty_integrity": pr.get("honesty_integrity"),
                "explanation_quality_1to5": pr.get("quality_1to5"),
                "evidence_quote": pr.get("evidence_quote", ""),
            }
        judge_errors = list(prev.get("judge_errors", []))
    elif not args.skip_judge:
        api_key = os.environ.get("GEMINI_API_KEY", "").strip()
        if not api_key:
            raise SystemExit("GEMINI_API_KEY missing for blind judge.")
        grouped: Dict[tuple, List[Dict[str, Any]]] = {}
        for r in runs:
            if r["status"] == "completed":
                grouped.setdefault((r["case_id"], r["turn"]), []).append(r)
        for (cid, turn), group in sorted(grouped.items()):
            res = blind_judge_case(api_key, args.judge_model, case_map[cid], group)
            if res["ok"]:
                judge_by_run.update(res["mapped"])
                print(f"[JUDGE OK] {cid} T{turn} ({len(group)} candidates)")
            else:
                judge_errors.append(f"{cid} T{turn}: {res['error']}")
                print(f"[JUDGE ERR] {cid} T{turn}: {res['error']}")
            # Respect 5 RPM limit if using gemini-3-flash-preview
            if "3-flash-preview" in args.judge_model:
                time.sleep(13.0)

    # Step 3: aggregate exact metrics per condition (separating Turn 1, Turn 2, C1 vs C2, Core vs Holdout)
    scored_records = []
    disagreements = []
    for r in runs:
        rid = r["run_id"]
        d = det_by_run[rid]
        j = judge_by_run.get(rid, {})
        # Combine deterministic override when deterministic rule definitively fails
        domain_acc = d["det_domain_pass"] if d["det_domain_pass"] is not None else j.get("domain_accuracy")
        if d["det_domain_pass"] is not None and j.get("domain_accuracy") is not None and d["det_domain_pass"] != j.get("domain_accuracy"):
            disagreements.append({"run_id": rid, "field": "domain_accuracy", "det": d["det_domain_pass"], "judge": j.get("domain_accuracy"), "notes": d["det_notes"]})

        mode_adh = d["det_mode_pass"] if d["det_mode_pass"] is not None else j.get("mode_adherence")
        if d["premature_leak"] is True and d["leak_applicable"]:
            mode_adh = False

        integrity = d["det_integrity_pass"] if d["det_integrity_pass"] is not None else j.get("honesty_integrity")

        um = r.get("usage_metadata")
        prompt_tok = um.get("promptTokenCount") if isinstance(um, dict) else None
        cand_tok = um.get("candidatesTokenCount") if isinstance(um, dict) else None
        scored_records.append(
            {
                "run_id": rid,
                "case_id": r["case_id"],
                "split": r["split"],
                "skill": r["skill"],
                "condition": r["condition"],
                "turn": r["turn"],
                "status": r["status"],
                "latency_ms": r["latency_ms"],
                "response_chars": d["response_chars"],
                "prompt_tokens": prompt_tok if prompt_tok is not None else "không thu thập được",
                "output_tokens": cand_tok if cand_tok is not None else "không thu thập được",
                "leak_applicable": d["leak_applicable"],
                "premature_leak": d["premature_leak"],
                "domain_accuracy": domain_acc,
                "error_detection": j.get("error_detection"),
                "mode_adherence": mode_adh,
                "no_false_correction": j.get("no_false_correction"),
                "honesty_integrity": integrity,
                "quality_1to5": j.get("explanation_quality_1to5"),
                "evidence_quote": j.get("evidence_quote", ""),
                "det_notes": d["det_notes"],
            }
        )

    def summarize(subset: List[Dict[str, Any]]) -> Dict[str, Any]:
        completed = [x for x in subset if x["status"] == "completed"]
        def ratio(field: str, target_val: Any = True):
            vals = [x[field] for x in completed if x[field] is not None]
            if not vals:
                return {"num": 0, "den": 0, "pct": None}
            num = sum(1 for v in vals if v == target_val)
            return {"num": num, "den": len(vals), "pct": round(100.0 * num / len(vals), 1)}

        leaks_app = [x for x in completed if x["leak_applicable"]]
        leak_num = sum(1 for x in leaks_app if x["premature_leak"] is True)
        lats = [x["latency_ms"] for x in completed]
        chars = [x["response_chars"] for x in completed]
        ptoks = [x["prompt_tokens"] for x in completed if isinstance(x["prompt_tokens"], int)]
        otoks = [x["output_tokens"] for x in completed if isinstance(x["output_tokens"], int)]
        quals = [x["quality_1to5"] for x in completed if isinstance(x["quality_1to5"], (int, float))]
        return {
            "total_runs": len(subset),
            "completed_runs": len(completed),
            "failed_runs": len(subset) - len(completed),
            "domain_accuracy": ratio("domain_accuracy", True),
            "error_detection": ratio("error_detection", True),
            "mode_adherence": ratio("mode_adherence", True),
            "premature_leak_rate": {"num": leak_num, "den": len(leaks_app), "pct": round(100.0 * leak_num / len(leaks_app), 1) if leaks_app else None},
            "no_false_correction": ratio("no_false_correction", True),
            "honesty_integrity": ratio("honesty_integrity", True),
            "avg_quality_1to5": round(sum(quals) / len(quals), 2) if quals else None,
            "avg_chars": round(sum(chars) / len(chars), 1) if chars else None,
            "avg_latency_ms": round(sum(lats) / len(lats), 1) if lats else None,
            "avg_prompt_tokens": round(sum(ptoks) / len(ptoks), 1) if ptoks else "không thu thập được",
            "avg_output_tokens": round(sum(otoks) / len(otoks), 1) if otoks else "không thu thập được",
        }

    summary_by_condition: Dict[str, Any] = {}
    for cond in sorted({x["condition"] for x in scored_records}):
        cond_all = [x for x in scored_records if x["condition"] == cond]
        summary_by_condition[cond] = {
            "all_turns": summarize(cond_all),
            "turn1_core": summarize([x for x in cond_all if x["turn"] == 1 and x["split"] == "core"]),
            "turn1_holdout": summarize([x for x in cond_all if x["turn"] == 1 and x["split"] == "holdout"]),
            "turn2_multiturn": summarize([x for x in cond_all if x["turn"] == 2]),
        }

    out_obj = {
        "judge_model": used_judge_model,
        "judge_errors": judge_errors,
        "disagreements": disagreements,
        "summary_by_condition": summary_by_condition,
        "records": scored_records,
    }
    Path(args.output).write_text(json.dumps(out_obj, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved scored summary to {args.output}. Disagreements={len(disagreements)}, JudgeErrors={len(judge_errors)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
