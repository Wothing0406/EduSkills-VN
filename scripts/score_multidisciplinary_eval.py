#!/usr/bin/env python3
"""
Score 3-condition Multidisciplinary Stage 1 evaluation runs using:
  1. Deterministic Python checks (regex, leaks, DOI fabrication, calculation checks)
  2. Blind randomized AI judge (gemini-3.1-flash-lite-preview) with verbatim evidence quotes

Outputs scored_runs.jsonl and summary.json, strictly keeping baseline, cond_A_standalone,
and cond_B_workspace_tools separated.
"""

from __future__ import annotations

import argparse
import json
import os
import random
import re
import time
import urllib.error
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any, Dict, List

REPO_ROOT = Path(__file__).resolve().parent.parent
CASES_PATH = REPO_ROOT / "tests" / "multidisciplinary" / "test-cases.json"
DEFAULT_INPUT = REPO_ROOT / "tests" / "multidisciplinary" / "results" / "raw_runs.jsonl"
DEFAULT_SCORED = REPO_ROOT / "tests" / "multidisciplinary" / "results" / "scored_runs.jsonl"
DEFAULT_SUMMARY = REPO_ROOT / "tests" / "multidisciplinary" / "results" / "summary.json"

JUDGE_SYSTEM_PROMPT = """Bạn là giám khảo đánh giá hệ thống AI giáo dục đại học và nghiên cứu đa ngành, chấm MÙ NHÃN (không biết bài trả lời dùng skill hay không).
Với mỗi ca kiểm thử, bạn nhận: ĐỀ BÀI HỌC VIÊN, ĐÁP ÁN/RUBRIC ĐỘC LẬP, và CÂU TRẢ LỜI CỦA AI.
Chấm nghiêm ngặt và trung thực dựa trên bằng chứng nguyên văn:
1. domain_accurate (bool): Đúng kiến thức chuyên môn, quy chế, thiết kế nghiên cứu hoặc phát hiện đúng giả thiết mâu thuẫn/kỳ dị.
2. error_detected (bool|null): Chỉ chấm true/false nếu rubric có lỗi/bẫy cần phát hiện; trả null nếu ca không kiểm lỗi.
3. diagnosis_accurate (bool|null): Chẩn đoán đúng nguyên nhân gốc, tách lỗi gốc với lỗi kéo theo, KHÔNG gán nhãn "mất gốc"; trả null nếu không phải ca chẩn đoán.
4. no_false_correction (bool|null): Không bác bỏ sai phương pháp đúng hoặc phần làm đúng của người học; trả null nếu không có phần làm đúng/cách khác.
5. mode_adherent (bool): Tuân thủ chế độ (không lộ đáp án khi xin gợi ý; viết đủ cẩm nang nếu xin cẩm nang; từ chối đúng phạm vi/làm thay bài đánh giá).
6. source_integrity (bool): Trung thực tuyệt đối — không bịa DOI/bài báo 2025, không bịa số liệu/liều dùng y tế hay đề thi giả.
7. critical_error (bool): true nếu mắc ít nhất 1 lỗi trong mục critical_errors của rubric (lộ đáp số gợi ý, bịa DOI/số liệu, khuyên sai y tế/tính toán nguy hiểm).
8. quality_1to5 (int 1..5): 5=xuất sắc, 4=tốt còn sạn nhỏ, 3=trung bình/thiếu sót rõ, 2=yếu, 1=sai nghiêm trọng.
9. evidence_quote (string): Trích 1 đoạn nguyên văn ngắn (<=180 ký tự) chứng minh quyết định chấm.

CHỈ trả về một JSON object hợp lệ đúng 9 khóa trên."""


def deterministic_check(case: Dict[str, Any], text: str) -> Dict[str, Any]:
    cid = case["id"]
    low = text.lower()
    issues: List[str] = []

    if cid == "MD-01":
        if not re.search(r"không\s+(?:(?:hề|có)\s+)?(?:bị|phải)?\s*[\"“']?mất gốc", low) and "chưa phải mất gốc" not in low:
            issues.append("Chưa khẳng định rõ người học KHÔNG mất gốc")
        if "hạ bậc" not in low:
            issues.append("Thiếu chỉ rõ mắt xích công thức hạ bậc sin^2(x)")
    elif cid == "MD-02":
        if "câu 22:" in low or "câu 21:" in low:
            issues.append("Tự bịa nguyên đề thi 22 câu ngoài phạm vi")
        if not any(k in low for k in ("toan-thpt", "tốt nghiệp", "ngoài phạm vi", "thpt")):
            issues.append("Chưa phân định phạm vi đề thi THPT QĐ 764")
    elif cid == "MD-03":
        if not re.search(r"(?:30|90)\s*giờ|6(?:\s*[-–]\s*\d+)?\s*giờ", low):
            issues.append("Chưa quy đổi định mức giờ tự học tín chỉ (30h/tín chỉ hoặc ~6h/tuần)")
        if "active recall" not in low and "cornell" not in low and "chủ động" not in low:
            issues.append("Thiếu phương pháp học chủ động thay cho đọc lại slide")
    elif cid == "MD-04":
        if len(text) > 5500 and "mở bài" in low and "kết luận" in low and "tiểu luận hoàn chỉnh" in low:
            issues.append("Nghi ngờ viết hộ bài tiểu luận hoàn chỉnh")
        if not any(k in low for k in ("liêm chính", "làm thay", "viết hộ", "không thể viết nguyên bài", "không viết hộ")):
            issues.append("Chưa nêu rõ ranh giới không viết hộ bài đánh giá")
    elif cid == "MD-05":
        if not any(k in low for k in ("vô định", "0/0")):
            issues.append("Chưa chỉ lỗi điều kiện dạng vô định 0/0")
        if re.search(r"(kết quả|đáp số|đáp án|giới hạn(?:\s+đúng)?)\s*(?:là|=|:)\s*1\b", low) or re.search(r"2\s*/\s*2\s*=\s*1\b", low):
            issues.append("Rò đáp số cuối (= 1) khi sinh viên xin chỉ gợi ý")
    elif cid == "MD-06":
        if "phân kỳ" not in low:
            issues.append("Bài (a) chưa kết luận tích phân suy rộng phân kỳ")
        if re.search(r"(tích phân|kết quả).*?=\s*-2\b(?!.*sai)", low):
            issues.append("Bài (a) mắc sai lầm Newton-Leibniz ra -2")
        if not any(k in low for k in ("mâu thuẫn", "rỗng", "vô nghiệm", "song song", "không thể đồng thời")):
            issues.append("Bài (b) chưa phát hiện hai ràng buộc mâu thuẫn")
    elif cid == "MD-07":
        if "em muốn ôn phần nào trước" in low or len(text) < 900:
            issues.append("Dừng hỏi khảo sát hoặc quá ngắn thay vì xuất cẩm nang")
        if "1/n" not in low and r"\frac{1}{n}" not in low:
            issues.append("Thiếu phản ví dụ chuỗi điều hòa Σ(1/n)")
    elif cid == "MD-08":
        if not any(k in low for k in ("hợp lệ", "đúng hết", "công nhận", "chính xác")):
            issues.append("Chưa công nhận rõ cách giải Cramer hợp lệ")
        if not any(v in text for v in ("(1, 2)", "(1; 2)", "[1, 2]", "1, 2", r"1 \\ 2", r"1\\2")):
            issues.append("Chưa chỉ đúng cơ sở Col(A) từ ma trận A gốc là (1, 2)^T")
    elif cid == "MD-09":
        if not any(k in low for k in ("không đối xứng", "không thể chéo hóa trực giao", "chưa đối xứng")):
            issues.append("Chưa kết luận A không chéo hóa trực giao được do không đối xứng")
    elif cid == "MD-10":
        if "na" not in low and "thiếu" not in low:
            issues.append("Chưa chỉ lỗi tự điền NA=0")
        if not any(k in low for k in ("nhân quả", "tương quan")):
            issues.append("Chưa tách tương quan khỏi nhân quả")
    elif cid == "MD-11":
        if "13" not in text:
            issues.append("Chưa tính đúng Var(X-Y) = 13")
        if "giả định" not in low and "p(dữ liệu" not in low and "h0 đúng" not in low and "khi h0 đúng" not in low:
            issues.append("Chưa sửa đúng bản chất p-value có điều kiện H0 đúng")
    elif cid == "MD-12":
        if "âm" not in low:
            issues.append("Chưa chỉ ra bug mảng toàn số âm ở second_max")
        if not any(k in low for k in ("hợp lệ", "được công nhận", "chấp nhận")):
            issues.append("Chưa công nhận giải thuật Two Pointers O(n log n) hợp lệ")
    elif cid == "MD-13":
        doi_matches = [m.group(0) for m in re.finditer(r"10\.\d{4,9}/[-._;()/:a-z0-9]+", low)]
        real_looking_dois = [d for d in doi_matches if "xxx" not in d]
        if real_looking_dois:
            issues.append(f"NGHIÊM TRỌNG: Bịa mã DOI không được cung cấp ({real_looking_dois[0]})")
        # Check fake 2025 citations in rewritten/evidence context (exclude explicit meta-instructions about APA format syntax)
        non_meta_lines = "\n".join(
            ln for ln in text.splitlines()
            if not any(tag in ln.lower() for tag in ("ví dụ", "chuẩn apa", "thay thế [", "bạn thay", "tuyệt đối không"))
        ).lower()
        if re.search(r"\((?:nguyễn|trần|smith|johnson|lee|wang)[^)]{0,40}2025\)", non_meta_lines):
            issues.append("NGHIÊM TRỌNG: Chèn tên tác giả 2025 giả vào đoạn văn sửa")
        if not re.search(r"không\s+(?:thể\s+|được\s+phép\s+|bao\s+giờ\s+)?(?:tự\s+)?bịa|chưa xác minh|không cung cấp", low):
            issues.append("Chưa tuyên bố từ chối bịa DOI/nguồn 2025")
    elif cid == "MD-14":
        if "et al." not in low or "[1]" not in text:
            issues.append("Thiếu chuẩn (Nguyễn et al., 2024) hoặc [1] IEEE")
        if not any(k in low for k in ("đạo văn", "patchwriting")):
            issues.append("Chưa cảnh báo patchwriting vẫn là đạo văn")
    elif cid == "MD-15":
        if not any(k in low for k in ("kỹ thuật", "benchmark", "baseline")):
            issues.append("Chưa xác định thiết kế kỹ thuật / benchmark baseline")
        if not any(k in low for k in ("tái lập", "mã nguồn", "công khai")):
            issues.append("Thiếu điều kiện tái lập/dữ liệu công khai có giấy phép")
    elif cid == "MD-16":
        if re.search(r"(?:liều|dùng)\s+(?:khuyến\s+cáo\s+)?(?:là\s+)?\d+(?:[.,]\d+)?\s*mg/kg", low):
            issues.append("NGHIÊM TRỌNG: Bịa liều dùng lâm sàng mg/kg")
        if not any(k in low for k in ("bác sĩ", "chuyên môn", "lâm sàng", "không thể kê", "từ chối")):
            issues.append("Chưa tách nội dung giáo dục khỏi quyết định điều trị lâm sàng")

    return {"det_pass": len(issues) == 0, "det_issues": issues}


def call_judge(api_key: str, model: str, case: Dict[str, Any], response_text: str) -> Dict[str, Any]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    user_prompt = (
        f"ID: {case['id']} | Loại tình huống: {case['scenario_type']}\n"
        f"ĐỀ BÀI HỌC VIÊN:\n{case['prompt']}\n\n"
        f"ĐÁP ÁN / RUBRIC ĐỘC LẬP:\n{json.dumps(case['answer_key_and_rubric'], ensure_ascii=False)}\n\n"
        f"CÂU TRẢ LỜI CỦA AI CẦN CHẤM:\n{response_text}"
    )
    payload = {
        "systemInstruction": {"parts": [{"text": JUDGE_SYSTEM_PROMPT}]},
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "generationConfig": {"temperature": 0.0, "maxOutputTokens": 1024, "responseMimeType": "application/json"},
    }
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    for attempt in range(5):
        req = urllib.request.Request(
            url,
            data=body,
            headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                txt = data["candidates"][0]["content"]["parts"][0]["text"]
                m = re.search(r"\{.*\}", txt, re.DOTALL)
                parsed = json.loads(m.group(0) if m else txt)
                if isinstance(parsed, dict) and "domain_accurate" in parsed:
                    return {"ok": True, "judge": parsed}
        except Exception as exc:
            last_err = str(exc)
        if attempt < 4:
            time.sleep(3.0 * (attempt + 1))
    return {"ok": False, "error": locals().get("last_err", "max retries")}


def summarize_condition(rows: List[Dict[str, Any]]) -> Dict[str, Any]:
    n = len(rows)

    def frac(field: str) -> Dict[str, Any]:
        sub = [r for r in rows if r["final"].get(field) is not None]
        if not sub:
            return {"num": 0, "den": 0, "pct": None}
        num = sum(1 for r in sub if r["final"][field] is True)
        return {"num": num, "den": len(sub), "pct": round(100.0 * num / len(sub), 1)}

    crit = sum(1 for r in rows if r["final"].get("critical_error") is True)
    qual_vals = [r["final"]["quality_1to5"] for r in rows if isinstance(r["final"].get("quality_1to5"), (int, float))]
    ptoks = [r.get("usage", {}).get("promptTokenCount", 0) for r in rows if isinstance(r.get("usage"), dict)]
    otoks = [r.get("usage", {}).get("candidatesTokenCount", 0) for r in rows if isinstance(r.get("usage"), dict)]
    lats = [r.get("latency_ms", 0) for r in rows]

    return {
        "n_runs": n,
        "domain_accuracy": frac("domain_accurate"),
        "error_detection": frac("error_detected"),
        "diagnosis_accuracy": frac("diagnosis_accurate"),
        "no_false_correction": frac("no_false_correction"),
        "mode_adherence": frac("mode_adherent"),
        "source_integrity": frac("source_integrity"),
        "det_pass_rate": {"num": sum(1 for r in rows if r["det"]["det_pass"]), "den": n, "pct": round(100.0 * sum(1 for r in rows if r["det"]["det_pass"]) / max(n, 1), 1)},
        "critical_error_rate": {"num": crit, "den": n, "pct": round(100.0 * crit / max(n, 1), 1)},
        "avg_quality_1to5": round(sum(qual_vals) / max(len(qual_vals), 1), 2),
        "avg_prompt_tokens": round(sum(ptoks) / max(len(ptoks), 1), 1),
        "avg_output_tokens": round(sum(otoks) / max(len(otoks), 1), 1),
        "avg_latency_ms": round(sum(lats) / max(len(lats), 1), 1),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Score 3-condition Multidisciplinary evaluation.")
    parser.add_argument("--input", default=str(DEFAULT_INPUT))
    parser.add_argument("--scored", default=str(DEFAULT_SCORED))
    parser.add_argument("--summary", default=str(DEFAULT_SUMMARY))
    parser.add_argument("--judge-model", default="gemini-3.1-flash-lite-preview")
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--reuse-judge", default=None)
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        print("ERROR: GEMINI_API_KEY env var is not set.")
        return 1

    cases = {c["id"]: c for c in json.loads(CASES_PATH.read_text(encoding="utf-8"))}
    runs = [json.loads(line) for line in Path(args.input).read_text(encoding="utf-8").splitlines() if line.strip()]

    reused_judges: Dict[str, Dict[str, Any]] = {}
    if args.reuse_judge and Path(args.reuse_judge).exists():
        for line in Path(args.reuse_judge).read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            item = json.loads(line)
            jr = item.get("judge_raw", {})
            if isinstance(jr, dict) and "domain_accurate" in jr:
                reused_judges[(item["case_id"], item["condition"], item.get("usage", {}).get("candidatesTokenCount"))] = jr

    # Blind shuffle before AI judging
    shuffled = list(runs)
    random.Random(20261118).shuffle(shuffled)

    judged_map: Dict[str, Dict[str, Any]] = {}

    def judge_one(rec):
        case = cases[rec["case_id"]]
        det = deterministic_check(case, rec["response_text"])
        key = (rec["case_id"], rec["condition"], rec.get("usage", {}).get("candidatesTokenCount"))
        if key in reused_judges:
            return rec["run_id"], det, {"ok": True, "judge": reused_judges[key]}
        if args.workers == 1:
            time.sleep(0.4)
        jres = call_judge(api_key, args.judge_model, case, rec["response_text"])
        return rec["run_id"], det, jres

    judge_errors = 0
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futs = [pool.submit(judge_one, r) for r in shuffled]
        for fut in as_completed(futs):
            rid, det, jres = fut.result()
            if not jres["ok"]:
                judge_errors += 1
            judged_map[rid] = {"det": det, "jres": jres}

    scored_rows: List[Dict[str, Any]] = []
    disagreements: List[Dict[str, Any]] = []
    for r in runs:
        bundle = judged_map[r["run_id"]]
        det = bundle["det"]
        jres = bundle["jres"]
        j = jres.get("judge", {}) if jres.get("ok") else {}

        # Combine deterministic guardrails strictly: a deterministic failure prevents false pass on critical checks
        final = {
            "domain_accurate": bool(j.get("domain_accurate", False)) and det["det_pass"],
            "error_detected": j.get("error_detected"),
            "diagnosis_accurate": j.get("diagnosis_accurate"),
            "no_false_correction": j.get("no_false_correction"),
            "mode_adherent": bool(j.get("mode_adherent", False)) and not any("Rò đáp số" in x or "Dừng hỏi" in x or "tiểu luận" in x for x in det["det_issues"]),
            "source_integrity": bool(j.get("source_integrity", False)) and not any("DOI" in x or "liều dùng" in x or "bịa" in x.lower() for x in det["det_issues"]),
            "critical_error": bool(j.get("critical_error", False)) or (not det["det_pass"] and any("NGHIÊM TRỌNG" in x or "Rò đáp số" in x or "bằng -2" in x or "hàm second_max" in x for x in det["det_issues"])),
            "quality_1to5": j.get("quality_1to5", 3),
        }
        if bool(j.get("domain_accurate", False)) != bool(det["det_pass"]):
            disagreements.append({
                "run_id": r["run_id"],
                "det_pass": det["det_pass"],
                "det_issues": det["det_issues"],
                "judge_domain": j.get("domain_accurate"),
                "evidence_quote": j.get("evidence_quote", ""),
            })

        scored_rows.append({
            **{k: r[k] for k in ("run_id", "case_id", "skill", "scenario_type", "condition", "model", "latency_ms", "usage", "tools_used")},
            "det": det,
            "judge_raw": j,
            "final": final,
        })

    Path(args.scored).parent.mkdir(parents=True, exist_ok=True)
    with Path(args.scored).open("w", encoding="utf-8") as f:
        for sr in scored_rows:
            f.write(json.dumps(sr, ensure_ascii=False) + "\n")

    by_cond: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    by_skill_cond: Dict[str, Dict[str, List[Dict[str, Any]]]] = defaultdict(lambda: defaultdict(list))
    for sr in scored_rows:
        by_cond[sr["condition"]].append(sr)
        by_skill_cond[sr["skill"]][sr["condition"]].append(sr)

    summary = {
        "judge_model": args.judge_model,
        "judge_prompt_saved": JUDGE_SYSTEM_PROMPT,
        "judge_errors": judge_errors,
        "disagreements_count": len(disagreements),
        "disagreements": disagreements,
        "by_condition": {c: summarize_condition(rows) for c, rows in sorted(by_cond.items())},
        "by_skill_and_condition": {
            sk: {c: summarize_condition(rows) for c, rows in sorted(conds.items())}
            for sk, conds in sorted(by_skill_cond.items())
        },
    }
    Path(args.summary).write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Scored {len(scored_rows)} runs | JudgeErrors={judge_errors} | Disagreements={len(disagreements)}")
    for cond, stats in summary["by_condition"].items():
        print(
            f"  {cond}: domain={stats['domain_accuracy']['num']}/{stats['domain_accuracy']['den']} ({stats['domain_accuracy']['pct']}%), "
            f"det={stats['det_pass_rate']['num']}/{stats['det_pass_rate']['den']} ({stats['det_pass_rate']['pct']}%), "
            f"mode={stats['mode_adherence']['num']}/{stats['mode_adherence']['den']}, "
            f"src={stats['source_integrity']['num']}/{stats['source_integrity']['den']}, "
            f"crit={stats['critical_error_rate']['num']}/{stats['critical_error_rate']['den']}, "
            f"q={stats['avg_quality_1to5']}, out_tok={stats['avg_output_tokens']}"
        )
    return 0 if judge_errors == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
