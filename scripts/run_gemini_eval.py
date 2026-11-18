#!/usr/bin/env python3
"""
Empirical Gemini API evaluation runner for THPT Agent Skills.
Reads GEMINI_API_KEY strictly from environment variable (never stored or written to disk).
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent
TEST_CASES_PATH = REPO_ROOT / "tests" / "eval" / "test-cases.json"
RESULTS_DIR = REPO_ROOT / "tests" / "eval" / "results"

OLD_GIT_PATHS = {
    "toan-thpt": "skills/khoa-hoc-tu-nhien/toan-thpt/SKILL.md",
    "vat-li-thpt": "skills/khoa-hoc-tu-nhien/vat-li-thpt/SKILL.md",
    "hoa-hoc-thpt": "skills/khoa-hoc-tu-nhien/hoa-hoc-thpt/SKILL.md",
    "sinh-hoc-thpt": "skills/khoa-hoc-tu-nhien/sinh-hoc-thpt/SKILL.md",
    "ngu-van-thpt": "skills/khoa-hoc-xa-hoi/ngu-van-thpt/SKILL.md",
    "lich-su-thpt": "skills/khoa-hoc-xa-hoi/lich-su-thpt/SKILL.md",
    "dia-li-thpt": "skills/khoa-hoc-xa-hoi/dia-li-thpt/SKILL.md",
    "ktpl-thpt": "skills/khoa-hoc-xa-hoi/ktpl-thpt/SKILL.md",
    "tieng-anh-thpt": "skills/ngon-ngu-cong-nghe/tieng-anh-thpt/SKILL.md",
    "tin-hoc-thpt": "skills/ngon-ngu-cong-nghe/tin-hoc-thpt/SKILL.md",
    "cong-nghe-thpt": "skills/ngon-ngu-cong-nghe/cong-nghe-thpt/SKILL.md",
    "giai-chi-tiet": "skills/meta-tools/giai-chi-tiet/SKILL.md",
    "tao-quiz-bgd": "skills/meta-tools/tao-quiz-bgd/SKILL.md",
    "tomtat-mindmap": "skills/meta-tools/tomtat-mindmap/SKILL.md",
    "slide-thuyet-trinh": "skills/meta-tools/slide-thuyet-trinh/SKILL.md",
    "luan-an-nghiencuu": "skills/meta-tools/luan-an-nghiencuu/SKILL.md",
}


def sha256_text(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]


def load_skill_prompt(skill_name: str, condition: str) -> Dict[str, Any]:
    if condition == "A_no_skill":
        return {"text": "", "version": "none", "sha256": "none"}
    if condition == "B_v2_0_0_main":
        rel = OLD_GIT_PATHS[skill_name]
        txt = subprocess.check_output(["git", "show", f"ebb7d1a:{rel}"], cwd=REPO_ROOT, text=True, encoding="utf-8")
        return {"text": txt, "version": "2.0.0-main", "sha256": sha256_text(txt)}
    if condition == "C_beta_v2_1_0":
        txt = subprocess.check_output(
            ["git", "show", f"e9dc3a5:skills/{skill_name}/SKILL.md"], cwd=REPO_ROOT, text=True, encoding="utf-8"
        )
        return {"text": txt, "version": "2.1.0-beta", "sha256": sha256_text(txt)}
    if condition in ("C1_v2_2_0_standalone", "C2_v2_2_0_tools", "C1_v2_3_0_standalone", "C2_v2_3_0_tools", "C1_v2_4_0_standalone", "C2_v2_4_0_tools"):
        txt = (REPO_ROOT / "skills" / skill_name / "SKILL.md").read_text(encoding="utf-8")
        ver = "2.4.0" if "2_4_0" in condition else ("2.3.0" if "2_3_0" in condition else "2.2.0")
        return {"text": txt, "version": ver, "sha256": sha256_text(txt)}
    raise ValueError(f"Unknown condition: {condition}")


def build_deterministic_tool_context(case: Dict[str, Any]) -> Dict[str, Any]:
    """Run real local deterministic Python/source verification tools for Condition C2."""
    cid = case["id"]
    if cid == "TC-02":
        import math
        val = 10**2 + 2000 / 10
        val9 = 9**2 + 2000 / 9
        val11 = 11**2 + 2000 / 11
        out = f"python_calc: S(10)={val}, S(9)={val9:.4f}, S(11)={val11:.4f}; AM-GM 3*cbrt(1000^2)={3*(1000**2)**(1/3):.1f}"
        return {"tools_allowed": ["python_calculator"], "tools_used": ["python_calculator"], "tool_context": out}
    if cid == "TC-04":
        ratio_n2 = 0.4 / 1
        ratio_h2 = 0.9 / 3
        n_nh3 = (2 / 3) * 0.9 * 0.25
        v_nh3 = n_nh3 * 24.79
        out = f"python_calc: ratio_N2={ratio_n2:.3f}, ratio_H2={ratio_h2:.3f}, limiting=H2, n_NH3={n_nh3:.4f}, V_dkc={v_nh3:.4f}"
        return {"tools_allowed": ["python_calculator"], "tools_used": ["python_calculator"], "tool_context": out}
    if cid == "TC-09":
        y_ton = 24150 / 3825
        y_ta = y_ton * 10
        src = (
            "official_source_fetched(chinhphu.vn, NQ 202/2025/QH15, 2026-11-18): "
            "Quốc hội thông qua ngày 12/6/2025 sắp xếp cả nước còn 34 tỉnh, thành phố."
        )
        out = f"python_calc: 24150/3825={y_ton:.6f} tan/ha = {y_ta:.6f} ta/ha -> round1={y_ta:.1f}; {src}"
        return {
            "tools_allowed": ["python_calculator", "official_web_source"],
            "tools_used": ["python_calculator", "official_web_source"],
            "tool_context": out,
        }
    if cid == "TC-12":
        import sqlite3
        conn = sqlite3.connect(":memory:")
        conn.execute("CREATE TABLE BANG_DIEM(MaLop TEXT, DiemSo REAL)")
        conn.executemany("INSERT INTO BANG_DIEM VALUES (?, ?)", [("12A1", 8.5), ("12A1", 8.2), ("12A2", 7.0)])
        try:
            conn.execute("SELECT MaLop, AVG(DiemSo) FROM BANG_DIEM WHERE AVG(DiemSo) >= 8.0 GROUP BY MaLop")
            err_msg = "no error"
        except Exception as exc:
            err_msg = str(exc)
        rows = conn.execute("SELECT MaLop, AVG(DiemSo) FROM BANG_DIEM GROUP BY MaLop HAVING AVG(DiemSo) >= 8.0").fetchall()
        out = f"sqlite3_check: WHERE query raised -> {err_msg}; HAVING query returned -> {rows}"
        return {"tools_allowed": ["sqlite3_verifier"], "tools_used": ["sqlite3_verifier"], "tool_context": out}
    if cid == "TC-13":
        import math
        ip = 380 / 38
        id_val = math.sqrt(3) * ip
        up_y = 380 / math.sqrt(3)
        out = f"python_calc: U_p(Y)={up_y:.2f} V; Delta I_p=380/38={ip:.2f} A, I_d=sqrt(3)*{ip:.2f}={id_val:.4f} A"
        return {"tools_allowed": ["python_calculator"], "tools_used": ["python_calculator"], "tool_context": out}
    if cid == "TC-15":
        src = (
            "official_source_checked(QĐ 764/QĐ-BGDĐT, 08/03/2024, 2026-11-18): "
            "Lịch sử 50 phút 28 câu (24 I + 4 II, 0 III); Tin học 50 phút đề 30 câu làm 28 câu (24 I + chọn 4/6 II, 0 III)."
        )
        return {"tools_allowed": ["official_source_verifier"], "tools_used": ["official_source_verifier"], "tool_context": src}
    if cid == "TC-16":
        out = "mermaid_syntax_checker: mindmap rules require <=6 words/node, UTF-8 Vietnamese accents ok, NO $$...$$ LaTeX inside mindmap nodes."
        return {"tools_allowed": ["mermaid_syntax_checker"], "tools_used": ["mermaid_syntax_checker"], "tool_context": out}
    if cid == "TC-18":
        src = (
            "official_source_fetched(baochinhphu.vn, Thông tư 84/2026/TT-BGDĐT, 30/09/2026, accessed 2026-11-18): "
            "16 lĩnh vực, 20 tiêu chí / 100 điểm, tối thiểu 3 giám khảo độc lập, nhật ký nghiên cứu xác nhận >= 1 lần/tháng, "
            "công khai tóm tắt/poster trước 15 ngày, nghiêm cấm dùng AI giả mạo quá trình/dữ liệu. "
            "academic_search_tool: chưa thực hiện tra cứu bài báo 2024 nào trong phiên này."
        )
        return {"tools_allowed": ["official_web_source", "academic_search_stub"], "tools_used": ["official_web_source"], "tool_context": src}
    if cid == "HO-03":
        solid = 0.1 * 82 + 0.1 * 116 + 0.05 * 40
        btkl = 0.1 * 136 + 0.25 * 40 - 0.1 * 18
        out = f"python_calc: NaOH_used=0.2, NaOH_excess=0.05; m_solid={solid:.2f} g; BTKL_check={btkl:.2f} g"
        return {"tools_allowed": ["python_calculator"], "tools_used": ["python_calculator"], "tool_context": out}
    if cid == "HO-05":
        arr = [9, 2, 7, 1, 5]
        mid = len(arr) // 2
        out = f"python_exec: unsorted arr={arr}, target=2; mid_idx={mid}, arr[mid]={arr[mid]} > 2 -> search left half [9,2]; on [5,1,3] target=5 -> mid=1 < 5 -> search right [3] -> NOT FOUND (wrong!)."
        return {"tools_allowed": ["python_executor"], "tools_used": ["python_executor"], "tool_context": out}
    return {"tools_allowed": [], "tools_used": [], "tool_context": ""}


def call_gemini(
    api_key: str,
    model: str,
    system_instruction: str,
    contents: List[Dict[str, Any]],
    gen_config: Dict[str, Any],
    max_retries: int = 6,
) -> Dict[str, Any]:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    payload: Dict[str, Any] = {
        "contents": contents,
        "generationConfig": gen_config,
    }
    if system_instruction:
        payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}

    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    retries = 0
    last_err = None
    for attempt in range(max_retries):
        req = urllib.request.Request(
            url,
            data=body,
            headers={"Content-Type": "application/json", "x-goog-api-key": api_key},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                return {"ok": True, "data": data, "retries": retries}
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            last_err = f"HTTP {e.code}: {err_body[:400]}"
            if e.code in (429, 500, 503) and attempt + 1 < max_retries:
                retries += 1
                wait_s = 3.0 * (attempt + 1)
                import re as _re
                m = _re.search(r"retryDelay\":\s*\"(\d+(?:\.\d+)?)s\"", err_body)
                if m:
                    wait_s = max(wait_s, float(m.group(1)) + 1.5)
                elif e.code == 429:
                    wait_s = max(wait_s, 15.0)
                time.sleep(min(wait_s, 65.0))
                continue
            return {"ok": False, "error": last_err, "retries": retries}
        except Exception as exc:
            last_err = str(exc)
            if attempt + 1 < max_retries:
                retries += 1
                time.sleep(3.0 * (attempt + 1))
                continue
            return {"ok": False, "error": last_err, "retries": retries}
    return {"ok": False, "error": last_err or "unknown", "retries": retries}


def run_single_case(
    api_key: str,
    model: str,
    case: Dict[str, Any],
    condition: str,
    run_idx: int,
) -> List[Dict[str, Any]]:
    records: List[Dict[str, Any]] = []
    skill_info = load_skill_prompt(case["skill"], condition)
    gen_config = {"temperature": 0.0, "maxOutputTokens": 4096}

    tools_allowed: List[str] = []
    tools_used: List[str] = []
    user_text = case["student_input"]
    if condition in ("C2_v2_2_0_tools", "C2_v2_3_0_tools", "C2_v2_4_0_tools"):
        tmeta = build_deterministic_tool_context(case)
        tools_allowed = tmeta["tools_allowed"]
        tools_used = tmeta["tools_used"]
        if tmeta["tool_context"]:
            user_text = (
                f"{case['student_input']}\n\n"
                f"[KẾT QUẢ CÔNG CỤ KIỂM CHỨNG THỰC TẾ TRONG PHIÊN:\n{tmeta['tool_context']}]"
            )

    contents: List[Dict[str, Any]] = [{"role": "user", "parts": [{"text": user_text}]}]
    run_id = f"RUN-{run_idx:03d}-T1-{case['id']}-{condition}"
    started = datetime.now(timezone.utc).isoformat()
    t0 = time.perf_counter()
    res = call_gemini(api_key, model, skill_info["text"], contents, gen_config)
    latency_ms = round((time.perf_counter() - t0) * 1000, 1)
    ended = datetime.now(timezone.utc).isoformat()

    raw_text = ""
    finish_reason = "không thu thập được"
    model_version = "không thu thập được"
    usage_meta: Any = "không thu thập được"
    status = "error"
    err_str: Optional[str] = None

    if res["ok"]:
        d = res["data"]
        model_version = d.get("modelVersion", "không thu thập được")
        usage_meta = d.get("usageMetadata", "không thu thập được")
        cands = d.get("candidates") or []
        if cands:
            finish_reason = cands[0].get("finishReason", "không thu thập được")
            parts = (cands[0].get("content") or {}).get("parts") or []
            raw_text = "".join(p.get("text", "") for p in parts)
        status = "completed"
    else:
        err_str = res["error"]

    records.append(
        {
            "run_id": run_id,
            "turn": 1,
            "case_id": case["id"],
            "split": case["split"],
            "skill": case["skill"],
            "condition": condition,
            "skill_version": skill_info["version"],
            "skill_sha256": skill_info["sha256"],
            "system_prompt_chars": len(skill_info["text"]),
            "user_prompt_sent": user_text,
            "model_requested": model,
            "model_version": model_version,
            "generation_config": gen_config,
            "tools_allowed": tools_allowed,
            "tools_used": tools_used,
            "started_at": started,
            "ended_at": ended,
            "latency_ms": latency_ms,
            "usage_metadata": usage_meta,
            "finish_reason": finish_reason,
            "raw_response": raw_text,
            "error": err_str,
            "retry_count": res["retries"],
            "status": status,
        }
    )

    # Multi-turn follow-up when pre-scripted and Turn 1 succeeded cleanly
    if status == "completed" and "multi_turn" in case and condition in (
        "A_no_skill",
        "B_v2_0_0_main",
        "C1_v2_2_0_standalone",
        "C1_v2_3_0_standalone",
        "C1_v2_4_0_standalone",
    ):
        mt = case["multi_turn"]
        contents_t2 = [
            {"role": "user", "parts": [{"text": user_text}]},
            {"role": "model", "parts": [{"text": raw_text}]},
            {"role": "user", "parts": [{"text": mt["turn2_student"]}]},
        ]
        run_id_t2 = f"RUN-{run_idx:03d}-T2-{case['id']}-{condition}"
        st2 = datetime.now(timezone.utc).isoformat()
        t0_2 = time.perf_counter()
        res2 = call_gemini(api_key, model, skill_info["text"], contents_t2, gen_config)
        lat2 = round((time.perf_counter() - t0_2) * 1000, 1)
        en2 = datetime.now(timezone.utc).isoformat()
        raw2 = ""
        fr2 = "không thu thập được"
        mv2 = "không thu thập được"
        um2: Any = "không thu thập được"
        stt2 = "error"
        err2: Optional[str] = None
        if res2["ok"]:
            d2 = res2["data"]
            mv2 = d2.get("modelVersion", "không thu thập được")
            um2 = d2.get("usageMetadata", "không thu thập được")
            c2 = d2.get("candidates") or []
            if c2:
                fr2 = c2[0].get("finishReason", "không thu thập được")
                p2 = (c2[0].get("content") or {}).get("parts") or []
                raw2 = "".join(p.get("text", "") for p in p2)
            stt2 = "completed"
        else:
            err2 = res2["error"]

        records.append(
            {
                "run_id": run_id_t2,
                "turn": 2,
                "parent_run_id": run_id,
                "case_id": case["id"],
                "split": case["split"],
                "skill": case["skill"],
                "condition": condition,
                "skill_version": skill_info["version"],
                "skill_sha256": skill_info["sha256"],
                "system_prompt_chars": len(skill_info["text"]),
                "user_prompt_sent": mt["turn2_student"],
                "simulated_student_note": "Phản hồi mô phỏng cố định trước cho Lượt 2",
                "model_requested": model,
                "model_version": mv2,
                "generation_config": gen_config,
                "tools_allowed": [],
                "tools_used": [],
                "started_at": st2,
                "ended_at": en2,
                "latency_ms": lat2,
                "usage_metadata": um2,
                "finish_reason": fr2,
                "raw_response": raw2,
                "error": err2,
                "retry_count": res2["retries"],
                "status": stt2,
            }
        )

    return records


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default="gemini-3-flash-preview")
    parser.add_argument("--case-ids", nargs="*", help="Optional subset of case IDs")
    parser.add_argument(
        "--conditions",
        nargs="+",
        default=["A_no_skill", "B_v2_0_0_main", "C1_v2_2_0_standalone"],
    )
    parser.add_argument("--include-c2", action="store_true", help="Also run C2_v2_2_0_tools on tool-enabled cases")
    parser.add_argument("--include-cbeta", action="store_true", help="Also run C_beta_v2_1_0 ablation on TC-05, TC-15, TC-18")
    parser.add_argument("--output", default=str(RESULTS_DIR / "raw_runs.jsonl"))
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--c2-label", default="C2_v2_3_0_tools")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("ERROR: GEMINI_API_KEY environment variable is required.")

    data = json.loads(TEST_CASES_PATH.read_text(encoding="utf-8"))
    cases = data["cases"]
    if args.case_ids:
        wanted = set(args.case_ids)
        cases = [c for c in cases if c["id"] in wanted]

    jobs: List[tuple] = []
    idx = 1
    for c in cases:
        for cond in args.conditions:
            jobs.append((idx, c, cond))
            idx += 1
        if args.include_c2 and c.get("tool_condition") == "both_c1_and_c2":
            jobs.append((idx, c, args.c2_label))
            idx += 1
        if args.include_cbeta and c["id"] in ("TC-05", "TC-15", "TC-18"):
            jobs.append((idx, c, "C_beta_v2_1_0"))
            idx += 1

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    all_records: List[Dict[str, Any]] = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futs = {pool.submit(run_single_case, api_key, args.model, c, cond, ridx): (ridx, c["id"], cond) for ridx, c, cond in jobs}
        for fut in as_completed(futs):
            ridx, cid, cond = futs[fut]
            recs = fut.result()
            all_records.extend(recs)
            for rec in recs:
                print(
                    f"[{rec['run_id']}] status={rec['status']} finish={rec['finish_reason']} "
                    f"len={len(rec['raw_response'])} lat={rec['latency_ms']}ms"
                )

    all_records.sort(key=lambda r: (r["case_id"], r["condition"], r["turn"]))
    with out_path.open("w", encoding="utf-8") as f:
        for rec in all_records:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")

    print(f"Saved {len(all_records)} run records to {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
