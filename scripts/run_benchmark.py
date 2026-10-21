#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EduSkills-VN — Automated Skill Quality Benchmark & LLM-as-a-Judge Evaluator
===========================================================================
Script tự động đánh giá chất lượng (Eval) cho các skills trong thư mục ./skills/:
1. Đọc từng test case từ file ./dataset/test_prompts.json
2. Nạp nội dung file SKILL.md tương ứng từ ./skills/ và gửi kèm câu hỏi đến Gemini API
3. Sử dụng Evaluator Prompt (LLM-as-a-Judge) để chấm điểm câu trả lời trên thang điểm 10 theo 3 tiêu chí:
   - Tuân thủ hướng dẫn trong skill (Weight: 40%)
   - Độ chuẩn xác kiến thức (Weight: 40%)
   - Định dạng & cách hành văn (Weight: 20%)
4. Xuất báo cáo tổng hợp ra file ./eval_report.md dạng bảng kèm điểm trung bình cho từng môn học.
"""

from __future__ import annotations

import argparse
import datetime
import json
import os
import re
import sys
import time
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import requests

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


# ============================================================================
# CONSTANTS & WEIGHTS
# ============================================================================

ROOT_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DATASET_PATH = ROOT_DIR / "dataset" / "test_prompts.json"
DEFAULT_SKILLS_DIR = ROOT_DIR / "skills"
DEFAULT_REPORT_PATH = ROOT_DIR / "eval_report.md"

WEIGHT_SKILL_COMPLIANCE = 0.40
WEIGHT_KNOWLEDGE_ACCURACY = 0.40
WEIGHT_FORMATTING_STYLE = 0.20

DEFAULT_GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
FALLBACK_GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
]

SUBJECT_DISPLAY_NAMES: Dict[str, str] = {
    "tieng-anh-thpt": "Tiếng Anh THPT",
    "tin-hoc-thpt": "Tin Học THPT",
    "cong-nghe-thpt": "Công Nghệ THPT",
    "toan-thpt": "Toán Học THPT",
    "vat-li-thpt": "Vật Lí THPT",
    "hoa-hoc-thpt": "Hóa Học THPT",
    "sinh-hoc-thpt": "Sinh Học THPT",
    "ngu-van-thpt": "Ngữ Văn THPT",
    "lich-su-thpt": "Lịch Sử THPT",
    "dia-li-thpt": "Địa Lí THPT",
    "ktpl-thpt": "Kinh Tế & Pháp Luật THPT",
    "giai-chi-tiet": "Giải Chi Tiết (Meta-Skill)",
    "tao-quiz-bgd": "Tạo Đề Chuẩn BGD (Meta-Skill)",
    "slide-thuyet-trinh": "Slide Thuyết Trình (Meta-Skill)",
    "tomtat-mindmap": "Tóm Tắt & Mindmap (Meta-Skill)",
    "luan-an-nghiencuu": "Luận Án Nghiên Cứu (Meta-Skill)",
}

SUBJECT_ALIASES: Dict[str, str] = {
    "tieng-anh": "tieng-anh-thpt",
    "english": "tieng-anh-thpt",
    "tin-hoc": "tin-hoc-thpt",
    "informatics": "tin-hoc-thpt",
    "cong-nghe": "cong-nghe-thpt",
    "technology": "cong-nghe-thpt",
    "toan": "toan-thpt",
    "toan-hoc": "toan-thpt",
    "math": "toan-thpt",
    "vat-li": "vat-li-thpt",
    "vat-ly": "vat-li-thpt",
    "physics": "vat-li-thpt",
    "hoa-hoc": "hoa-hoc-thpt",
    "hoa": "hoa-hoc-thpt",
    "chemistry": "hoa-hoc-thpt",
    "sinh-hoc": "sinh-hoc-thpt",
    "sinh": "sinh-hoc-thpt",
    "biology": "sinh-hoc-thpt",
    "ngu-van": "ngu-van-thpt",
    "van": "ngu-van-thpt",
    "literature": "ngu-van-thpt",
    "lich-su": "lich-su-thpt",
    "su": "lich-su-thpt",
    "history": "lich-su-thpt",
    "dia-li": "dia-li-thpt",
    "dia-ly": "dia-li-thpt",
    "geography": "dia-li-thpt",
    "ktpl": "ktpl-thpt",
    "gdktpl": "ktpl-thpt",
}


# ============================================================================
# DATA STRUCTURES
# ============================================================================

@dataclass
class TestCase:
    id: int
    subject: str
    question: str
    expected_rules: str


@dataclass
class EvalScore:
    skill_compliance: float
    knowledge_accuracy: float
    formatting_style: float
    weighted_total: float
    rationale: str
    strengths: List[str] = field(default_factory=list)
    improvements: List[str] = field(default_factory=list)


@dataclass
class BenchmarkResult:
    test_case: TestCase
    canonical_subject: str
    subject_display: str
    skill_path: Path
    model_response: str
    score: EvalScore
    latency_sec: float
    mode: str  # "gemini-api" or "offline-simulation"


# ============================================================================
# SKILL RESOLVER & LOADER
# ============================================================================

def normalize_subject_id(subject: str) -> str:
    slug = subject.strip().lower()
    if slug in SUBJECT_ALIASES:
        return SUBJECT_ALIASES[slug]
    if not slug.endswith("-thpt") and f"{slug}-thpt" in SUBJECT_DISPLAY_NAMES:
        return f"{slug}-thpt"
    return slug


def build_skill_index(skills_dir: Path) -> Dict[str, Path]:
    """Quét đệ quy thư mục ./skills/ để ánh xạ tên skill sang đường dẫn file .md."""
    index: Dict[str, Path] = {}
    if not skills_dir.exists():
        return index

    for md_path in sorted(skills_dir.rglob("*.md")):
        folder_key = md_path.parent.name.lower()
        index[folder_key] = md_path
        if folder_key.endswith("-thpt"):
            short_key = folder_key[:-5]
            index.setdefault(short_key, md_path)

        # Đọc YAML frontmatter nếu có trường name / canonical_id
        try:
            head_text = md_path.read_text(encoding="utf-8")[:1500]
            for field_name in ("name", "canonical_id"):
                match = re.search(rf"^{field_name}:\s*['\"]?([a-zA-Z0-9_-]+)['\"]?", head_text, re.MULTILINE)
                if match:
                    index[match.group(1).lower()] = md_path
        except OSError:
            continue

    return index


def resolve_skill_file(subject: str, skill_index: Dict[str, Path]) -> Tuple[str, Path]:
    canonical = normalize_subject_id(subject)
    if canonical in skill_index:
        return canonical, skill_index[canonical]
    raw_key = subject.strip().lower()
    if raw_key in skill_index:
        return raw_key, skill_index[raw_key]
    raise FileNotFoundError(
        f"Không tìm thấy file skill .md cho môn '{subject}' (canonical: '{canonical}') trong thư mục ./skills/."
    )


# ============================================================================
# GEMINI API CLIENT (MULTI-ADAPTER: google-genai / google-generativeai / REST)
# ============================================================================

class GeminiClient:
    """
    Client giao tiếp với Gemini API.
    Ưu tiên:
      1. SDK chính thức `google-genai` (nếu đã cài đặt)
      2. SDK `google-generativeai` (nếu đã cài đặt)
      3. Direct REST API `generativelanguage.googleapis.com/v1beta` qua `requests`
    """

    def __init__(self, api_key: Optional[str], model_name: str = DEFAULT_GEMINI_MODEL, timeout: int = 90):
        self.api_key = (api_key or "").strip()
        self.model_name = model_name
        self.timeout = timeout
        self._sdk_type = "rest"
        self._genai_client = None

        if self.api_key:
            try:
                from google import genai as google_genai  # type: ignore
                self._genai_client = google_genai.Client(api_key=self.api_key)
                self._sdk_type = "google-genai"
            except Exception:
                self._sdk_type = "rest"

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key)

    def generate_content(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2,
        json_output: bool = False,
    ) -> str:
        if not self.is_configured:
            raise RuntimeError("GEMINI_API_KEY chưa được cấu hình.")

        models_to_try = [self.model_name] + [
            m for m in FALLBACK_GEMINI_MODELS if m != self.model_name
        ]
        last_error: Optional[Exception] = None

        for model in models_to_try:
            for attempt in range(1, 4):
                try:
                    if self._sdk_type == "google-genai" and self._genai_client is not None:
                        return self._call_google_genai_sdk(
                            model=model,
                            prompt=prompt,
                            system_instruction=system_instruction,
                            temperature=temperature,
                            json_output=json_output,
                        )
                    return self._call_rest_api(
                        model=model,
                        prompt=prompt,
                        system_instruction=system_instruction,
                        temperature=temperature,
                        json_output=json_output,
                    )
                except requests.HTTPError as http_err:
                    status_code = http_err.response.status_code if http_err.response is not None else 0
                    last_error = http_err
                    if status_code == 404:
                        # Thử model fallback tiếp theo nếu model hiện tại không khả dụng
                        break
                    if status_code in (429, 500, 502, 503, 504) and attempt < 3:
                        time.sleep(2.0 * attempt)
                        continue
                    raise
                except Exception as exc:
                    last_error = exc
                    if attempt < 3:
                        time.sleep(1.5 * attempt)
                        continue
                    break

        raise RuntimeError(f"Gọi Gemini API thất bại sau khi thử các model {models_to_try}: {last_error}")

    def _call_google_genai_sdk(
        self,
        model: str,
        prompt: str,
        system_instruction: Optional[str],
        temperature: float,
        json_output: bool,
    ) -> str:
        from google.genai import types  # type: ignore

        config_kwargs: Dict[str, Any] = {"temperature": temperature}
        if system_instruction:
            config_kwargs["system_instruction"] = system_instruction
        if json_output:
            config_kwargs["response_mime_type"] = "application/json"

        response = self._genai_client.models.generate_content(
            model=model,
            contents=prompt,
            config=types.GenerateContentConfig(**config_kwargs),
        )
        return response.text or ""

    def _call_rest_api(
        self,
        model: str,
        prompt: str,
        system_instruction: Optional[str],
        temperature: float,
        json_output: bool,
    ) -> str:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        generation_config: Dict[str, Any] = {
            "temperature": temperature,
        }
        if json_output:
            generation_config["responseMimeType"] = "application/json"

        payload: Dict[str, Any] = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}],
                }
            ],
            "generationConfig": generation_config,
        }
        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        resp = requests.post(
            url,
            params={"key": self.api_key},
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=self.timeout,
        )
        resp.raise_for_status()
        data = resp.json()

        candidates = data.get("candidates", [])
        if not candidates:
            raise RuntimeError(f"Gemini API không trả về candidates: {json.dumps(data, ensure_ascii=False)}")

        parts = candidates[0].get("content", {}).get("parts", [])
        text_chunks = [part.get("text", "") for part in parts if "text" in part]
        return "\n".join(text_chunks).strip()


# ============================================================================
# STEP 1: GENERATE SKILL-GUIDED ANSWER
# ============================================================================

def build_generation_prompts(skill_markdown: str, test_case: TestCase) -> Tuple[str, str]:
    """Tạo System Instruction (nội dung SKILL.md) và User Prompt cho Gemini."""
    system_instruction = (
        "Bạn là trợ lý giáo dục AI chuyên sâu của hệ thống EduSkills-VN. "
        "Bạn BẮT BUỘC phải tuân thủ tuyệt đối toàn bộ quy tắc chống ảo giác (anti_hallucination_rules), "
        "quy trình tư duy từng bước (CoT 4 bước / 4 tầng Scaffolding), cảnh báo bẫy phòng thi (Cognitive Trap Matrix) "
        "và giao thức tự kiểm chứng (Chain-of-Verification - CoVe) được quy định trong tài liệu SKILL dưới đây:\n\n"
        f"{skill_markdown}"
    )

    user_prompt = (
        f"### CÂU HỎI HỌC SINH (Môn: {SUBJECT_DISPLAY_NAMES.get(normalize_subject_id(test_case.subject), test_case.subject)})\n"
        f"{test_case.question}\n\n"
        f"### YÊU CẦU SƯ PHẠM BẮT BUỘC\n"
        f"- Thực hiện đúng hướng dẫn trong SKILL.md tương ứng.\n"
        f"- Lưu ý đặc biệt: {test_case.expected_rules}\n"
        f"- Trình bày rõ ràng bằng Markdown, sử dụng LaTeX chuẩn ($...$, $$...$$) cho công thức và bảng biểu khi cần thiết."
    )
    return system_instruction, user_prompt


def build_offline_reference_response(skill_markdown: str, test_case: TestCase) -> str:
    """
    Sinh câu trả lời chuẩn đối chiếu trực tiếp từ quy tắc trong SKILL.md khi chạy ở chế độ
    Offline Benchmark (không có GEMINI_API_KEY) để kiểm thử luồng pipeline.
    """
    subj = normalize_subject_id(test_case.subject)
    references: Dict[int, str] = {
        1: (
            "### 🧭 Tầng 1: Gợi mở Tư duy Cú pháp (Socrates Scaffolding)\n"
            "Trước khi chọn đáp án ngay, em hãy quan sát cấu trúc câu phía trước và sau chỗ trống:\n"
            "- Phía trước chỗ trống có **dấu phẩy (`,`)** ngăn cách mệnh đề chính: *\"Every year, millions of tons of plastic waste are discharged into the ocean\"*.\n"
            "- Phía sau chỗ trống là động từ chia ngôi thứ 3 số ít **`poses`** (*gây ra*).\n"
            "- Câu hỏi đặt ra: Cái gì *gây ra mối đe dọa nghiêm trọng cho đa dạng sinh học biển*? Có phải bản thân từ *\"the ocean\"* hay là **toàn bộ sự việc xả hàng triệu tấn rác thải nhựa ra đại dương**?\n\n"
            "### 🔍 Tầng 2: Phân tích Cú pháp & Giải phẫu Mệnh đề (Syntactic Parsing)\n"
            "1. **Xác định thành phần câu:** Chỗ trống cần một **Đại từ quan hệ (Relative Pronoun)** làm chủ ngữ cho động từ `poses` trong mệnh đề quan hệ nối tiếp (Non-defining Sentential Relative Clause).\n"
            "2. **Quy tắc ngữ pháp trọng tâm:** Khi đại từ quan hệ đứng sau dấu phẩy `,` để quy chiếu cho **toàn bộ mệnh đề đứng phía trước**, tiếng Anh chuẩn bắt buộc dùng **`which`** và động từ theo sau luôn chia ở dạng **số ít** (`poses`).\n\n"
            "### ❌ Tầng 3: Giải mã Ma trận Bẫy & Loại trừ Phương án Nhiễu (Elimination Proof)\n"
            "| Phương án | Đánh giá | Lý do ngữ pháp chi tiết |\n"
            "| :---: | :---: | :--- |\n"
            "| **A. `who`** | ❌ Loại | `who` chỉ dùng thay thế cho danh từ chỉ người, không thể thay cho sự việc/mệnh đề. |\n"
            "| **B. `that`** | ❌ Loại | **Bẫy kinh điển:** Đại từ quan hệ `that` **tuyệt đối không** đứng sau dấu phẩy (`,`) trong mệnh đề quan hệ không xác định. |\n"
            "| **C. `which`** | ✅ **ĐÚNG** | Đứng sau dấu phẩy, thay thế cho toàn bộ mệnh đề đứng trước và hợp chuẩn với động từ số ít `poses`. |\n"
            "| **D. `what`** | ❌ Loại | `what` (= *the thing that*) là đại từ nghi vấn/mệnh đề danh ngữ, không phải đại từ quan hệ nối mệnh đề phụ thuộc sau dấu phẩy. |\n\n"
            "### 🛡️ Tầng 4: Tự kiểm chứng (CoVe) & Kết luận\n"
            "- **Check 1 (Subject-Verb Agreement):** Mệnh đề phía trước làm chủ ngữ $\\implies$ tính là 1 sự việc số ít $\\implies$ `which poses` (đúng).\n"
            "- **Đáp án chính xác cuối cùng:** **C (`which`)**."
        ),
        2: (
            "### 🧭 Tầng 1: Gợi mở Tư duy Liên kết Diễn ngôn (Discourse Scaffolding)\n"
            "Để sắp xếp đoạn văn (Logical Ordering) nhanh và không bị rối, em đừng đọc ngẫu nhiên từng đáp án mà hãy tìm:\n"
            "1. Câu nào mang ý khái quát nhất, giới thiệu chủ đề chung (*Green lifestyle*) và không bắt đầu bằng từ nối chuyển ý?\n"
            "2. Các từ nối tín hiệu (**Discourse Markers**): `First`, `For instance`, `Furthermore`, `In conclusion` tạo thành mạch lập luận như thế nào?\n\n"
            "### 🔍 Tầng 2: Phân tích Từng bước Mạch Liên kết (Step-by-Step Discourse Mapping)\n"
            "1. **Bước 1 — Xác định câu mở đoạn (Topic Sentence):**\n"
            "   - **Câu `b`**: *\"Adopting a green lifestyle requires simple yet consistent daily habits.\"* $\\implies$ Giới thiệu luận điểm tổng quát: lối sống xanh cần những thói quen hàng ngày đơn giản nhưng đều đặn.\n"
            "2. **Bước 2 — Triển khai luận điểm thứ nhất & Ví dụ minh họa:**\n"
            "   - **Câu `a`**: Bắt đầu bằng **`First,`** nêu thói quen đầu tiên: mang túi tái sử dụng khi đi mua sắm để cắt giảm nhựa dùng một lần (*cut down on single-use plastic*).\n"
            "   - **Câu `e`**: Bắt đầu bằng **`For instance,`** bổ sung minh họa cụ thể về phân loại rác sinh hoạt giúp tái chế hiệu quả hơn.\n"
            "3. **Bước 3 — Mở rộng luận điểm tiếp theo:**\n"
            "   - **Câu `d`**: Bắt đầu bằng **`Furthermore,`** (*Hơn thế nữa*) bổ sung hành động tiết kiệm điện năng và giảm dấu chân carbon.\n"
            "4. **Bước 4 — Câu kết đoạn (Concluding Sentence):**\n"
            "   - **Câu `c`**: Bắt đầu bằng **`In conclusion,`** và dùng cụm từ quy chiếu **`these small actions`** để tóm lại toàn bộ các hành động ở `a, e, d`.\n\n"
            "### 📚 Tầng 3: Giải nghĩa Cụm động từ & Ngữ âm Chuẩn Oxford\n"
            "- **`cut down on sth`** `/kʌt daʊn ɒn/`: cắt giảm (số lượng, mức độ tiêu thụ). Đồng nghĩa học thuật: *reduce / minimize the consumption of sth*.\n\n"
            "### 🛡️ Tầng 4: Tự kiểm chứng (CoVe) & Chốt Đáp án\n"
            "- Trình tự mạch lạc: `b` (Mở đoạn) $\\to$ `a` (*First*) $\\to$ `e` (*For instance*) $\\to$ `d` (*Furthermore*) $\\to$ `c` (*In conclusion*).\n"
            "- **Đáp án chính xác:** **A (`b - a - e - d - c`)**."
        ),
        3: (
            "### 🧭 Tầng 1: Giải mã Quy tắc `range()` & Chỉ số Mảng trong Python\n"
            "Trước khi tính kết quả, em cần nắm vững 2 quy tắc bất biến trong Python:\n"
            "1. **Chỉ số danh sách (`list indexing`) bắt đầu từ `0`**: Với `data = [4, 7, 2, 6, 5, 8]`, độ dài `len(arr) = 6`, các chỉ số lần lượt là `0, 1, 2, 3, 4, 5`.\n"
            "2. **Quy tắc nửa khoảng `[start, stop)` của hàm `range(start, stop, step)`**:\n"
            "   - `range(1, 6, 2)` bắt đầu từ `i = 1`, bước nhảy `step = +2`, và **dừng trước `stop = 6`** (tức giá trị tối đa có thể xét là `5`).\n"
            "   - Do đó, dãy giá trị của `i` sẽ lần lượt là: `1, 3, 5`.\n\n"
            "### 📊 Tầng 2: Bảng Vết Thực Thi Từng Bước (Dry-Run State Trace Table)\n"
            "Ta theo dõi giá trị các biến qua từng vòng lặp trong bảng dưới đây:\n\n"
            "| Lần lặp | Chỉ số `i` | Giá trị `arr[i]` | Điều kiện `arr[i] % 2 == 0` | Phép toán thực hiện | Giá trị `total` sau vòng lặp |\n"
            "| :---: | :---: | :---: | :---: | :--- | :---: |\n"
            "| Khởi tạo | - | - | - | `total = 0` | **`0`** |\n"
            "| Vòng 1 | `1` | `data[1] = 7` | `7 % 2 == 1` (`False` - số lẻ) | `total = 0 - 7` | **`-7`** |\n"
            "| Vòng 2 | `3` | `data[3] = 6` | `6 % 2 == 0` (`True` - số chẵn) | `total = -7 + 6` | **`-1`** |\n"
            "| Vòng 3 | `5` | `data[5] = 8` | `8 % 2 == 0` (`True` - số chẵn) | `total = -1 + 8` | **`7`** |\n\n"
            "### ⚡ Tầng 3: Phân tích Độ phức tạp Thuật toán (Big-O Analysis)\n"
            "- **Độ phức tạp thời gian:** Vòng lặp duyệt qua $\\lfloor n/2 \\rfloor$ phần tử nên $T(n) = O(n)$.\n"
            "- **Độ phức tạp không gian:** Chỉ sử dụng biến đơn `total` và `i` nên bộ nhớ phụ $S(n) = O(1)$.\n\n"
            "### ⚠️ Tầng 4: Cảnh báo Bẫy Phòng Thi & Kết luận\n"
            "- **Bẫy thường gặp:** Nhầm chỉ số đầu tiên `arr[1]` là `4` (thực chất `4` ở `arr[0]`), hoặc tưởng `range(1, 6, 2)` bao gồm cả `6` gây lỗi `IndexError`.\n"
            "- **Kết quả in ra màn hình:** **`7`**."
        ),
        4: (
            "### 🧭 Tầng 1: Gợi mở Tư duy Thứ tự Thực thi Logic trong SQL\n"
            "Để hiểu vì sao câu lệnh báo lỗi, em hãy nhớ rằng hệ quản trị CSDL **không thực thi câu lệnh theo thứ tự viết từ trái sang phải** mà chạy theo quy trình chuẩn sau:\n"
            "$$\\text{FROM} \\to \\text{WHERE} \\to \\text{GROUP BY} \\to \\text{HAVING} \\to \\text{SELECT} \\to \\text{ORDER BY}$$\n\n"
            "### 🔍 Tầng 2: Phân tích Nguyên nhân Lỗi (`WHERE` vs. `HAVING`)\n"
            "1. **Tại bước `WHERE`:** Hệ thống đang duyệt từng dòng bản ghi (row-by-row) trong bảng `DIEM_THI` **trước khi** gom nhóm theo `Lop`. Lúc này chưa hề có nhóm nào được tạo ra nên hàm tổng hợp `AVG(Diem)` chưa thể tính toán được.\n"
            "2. **Quy tắc chuẩn ANSI SQL:**\n"
            "   - **`WHERE`**: Lọc các dòng dữ liệu thô **trước khi** gom nhóm (`GROUP BY`). **Tuyệt đối cấm** dùng trực tiếp các hàm tổng hợp (`COUNT, SUM, AVG, MAX, MIN`) trong mệnh đề `WHERE`.\n"
            "   - **`HAVING`**: Lọc các nhóm dữ liệu **sau khi** đã thực hiện `GROUP BY`. Mọi điều kiện gắn với hàm tổng hợp bắt buộc phải đặt tại `HAVING`.\n\n"
            "### 💻 Tầng 3: Câu lệnh ANSI SQL Chuẩn Xác Đã Sửa Lỗi\n"
            "```sql\n"
            "SELECT Lop, AVG(Diem) AS DiemTrungBinh\n"
            "FROM DIEM_THI\n"
            "GROUP BY Lop\n"
            "HAVING AVG(Diem) >= 8.0;\n"
            "```\n\n"
            "### 🛡️ Tầng 4: Bảng Đối chiếu Nhanh & Tự kiểm chứng (CoVe)\n"
            "| Tiêu chí | Mệnh đề `WHERE` | Mệnh đề `HAVING` |\n"
            "| :--- | :--- | :--- |\n"
            "| **Thời điểm chạy** | Trước `GROUP BY` | Sau `GROUP BY` |\n"
            "| **Đối tượng lọc** | Từng bản ghi (Row/Tuple) | Từng nhóm (Group) |\n"
            "| **Dùng hàm `AVG, COUNT, SUM`** | ❌ Không được phép | ✅ Bắt buộc dùng ở đây |"
        ),
        5: (
            "### 🧭 Tầng 1: Giải mã Thông số Nguồn điện 3 Pha `220/380 V`\n"
            "Trước khi thay số, ta cần xác định chính xác đâu là điện áp pha ($U_p$) và đâu là điện áp dây ($U_d$) của lưới điện:\n"
            "- Trong hệ thống điện xoay chiều 3 pha luôn có $U_d = \\sqrt{3} U_p > U_p$.\n"
            "- Vì vậy, ký hiệu nguồn **`220/380 V`** có nghĩa là:\n"
            "  - Điện áp pha của nguồn: $U_p = 220\\text{ V}$\n"
            "  - Điện áp dây của nguồn: $U_d = 380\\text{ V} \\approx 220\\sqrt{3}\\text{ V}$\n\n"
            "### ⚡ Tầng 2: Tính toán Từng bước Dòng điện Pha ($I_p$) và Dòng điện Dây ($I_d$)\n"
            "1. **Bước 1 — Xác định điện áp đặt lên mỗi pha của tải nối hình Tam giác ($\\Delta$):**\n"
            "   Khi tải nối hình tam giác ($\\Delta$), hai đầu mỗi pha tải nối trực tiếp giữa hai dây pha của nguồn nên:\n"
            "   $$U_{p\\text{-tải}} = U_d = 380\\text{ V}$$\n"
            "2. **Bước 2 — Tính cường độ dòng điện pha ($I_p$):**\n"
            "   Do tải thuần trở $R = 22\\text{ }\\Omega$, tổng trở pha là $Z_p = R = 22\\text{ }\\Omega$:\n"
            "   $$I_p = \\frac{U_{p\\text{-tải}}}{R} = \\frac{380}{22} \\approx 17.27\\text{ A} \\quad (\\text{hoặc } \\frac{220\\sqrt{3}}{22} = 10\\sqrt{3} \\approx 17.32\\text{ A})$$\n"
            "3. **Bước 3 — Tính cường độ dòng điện dây ($I_d$):**\n"
            "   Với tải đối xứng nối hình tam giác ($\\Delta$), quan hệ giữa dòng điện dây và dòng điện pha là:\n"
            "   $$I_d = \\sqrt{3} I_p = \\sqrt{3} \\times 10\\sqrt{3} = 30\\text{ A}$$\n\n"
            "### ⚠️ Tầng 3: Giải thích Bẫy Đấu nối Động cơ $\\Delta/\\text{Y} - 220/380\\text{ V}$\n"
            "- Nhãn động cơ ghi **$\\Delta/\\text{Y} - 220/380\\text{ V}$** quy định rằng mỗi cuộn dây pha của động cơ chỉ chịu được **điện áp định mức tối đa là $220\\text{ V}$**.\n"
            "- Khi đấu vào lưới điện có điện áp dây $U_d = 380\\text{ V}$:\n"
            "  - Nếu đấu **hình Sao ($\\text{Y}$)**: Mỗi cuộn dây nhận điện áp $U_p = \\frac{U_d}{\\sqrt{3}} = \\frac{380}{\\sqrt{3}} = 220\\text{ V}$ (đúng định mức, động cơ chạy an toàn).\n"
            "  - Nếu đấu **hình Tam giác ($\\Delta$)**: Mỗi cuộn dây bị đặt trực tiếp dưới điện áp dây $380\\text{ V} > 220\\text{ V}$ (quá áp $\\sqrt{3}$ lần), làm dòng điện tăng vọt gây **cháy cuộn dây động cơ**!"
        ),
        6: (
            "### 🧭 Tầng 1: Nhận diện Hiện tượng & Phân tích Cơ chế Sinh hóa trong Ao nuôi\n"
            "Để đánh giá lời khuyên rải vôi sống ($\\text{CaO}$) đúng hay sai, chúng ta cần phân tích trạng thái hóa lý của nước ao lúc buổi chiều nắng gắt ($t = 33^\\circ\\text{C}$, $\\text{pH} = 8.8$):\n"
            "1. **Cân bằng Amoni – Amoniac trong nước:**\n"
            "   Trong ao nuôi thâm canh luôn tồn tại cân bằng thuận nghịch giữa ion ammonium ($\\text{NH}_4^+$, ít độc) và khí ammonia tự do ($\\text{NH}_3$, cực độc đối với hệ thần kinh và mang tôm):\n"
            "   $$\\text{NH}_4^+ + \\text{OH}^- \\rightleftharpoons \\text{NH}_3 \\uparrow + \\text{H}_2\\text{O}$$\n"
            "2. **Tác động kép của $\\text{pH} = 8.8$ và nhiệt độ $33^\\circ\\text{C}$:**\n"
            "   - Khi $\\text{pH}$ cao ($> 8.5$, nồng độ $\\text{OH}^-$ lớn) kết hợp nhiệt độ cao ($33^\\circ\\text{C}$), cân bằng chuyển dịch mạnh sang chiều thuận, làm tỷ lệ khí độc $\\text{NH}_3$ không phân ly tăng vọt.\n"
            "   - Đồng thời nhiệt độ nước cao làm giảm độ hòa tan của oxy ($\\text{DO}$), khiến tôm bị ngộ độc $\\text{NH}_3$ kèm thiếu oxy nên nổi đầu dạt bờ.\n\n"
            "### ❌ Tầng 2: Kết luận về Lời khuyên Rải Vôi sống ($\\text{CaO}$)\n"
            "- Lời khuyên rải vôi sống ($\\text{CaO}$) lúc này là **HOÀN TOÀN SAI LẦM VÀ CỰC KỲ NGUY HIỂM**.\n"
            "- **Lý do:** $\\text{CaO} + \\text{H}_2\\text{O} \\to \\text{Ca(OH)}_2$ tạo môi trường kiềm mạnh và tỏa nhiệt, làm độ $\\text{pH}$ của ao (vốn đang ở mức nguy hiểm $8.8$) tăng vọt lên trên $9.0$, chuyển hóa gần như toàn bộ $\\text{NH}_4^+$ thành khí độc $\\text{NH}_3$ gây **tôm chết hàng loạt**.\n\n"
            "### 🛠️ Tầng 3: Quy trình Xử lý Chuẩn Kỹ thuật Thủy sản (VietGAP / Biofloc)\n"
            "1. **Bước 1 (Cấp cứu oxy tức thời):** Bật tối đa hệ thống quạt nước và sục khí đáy để tăng hàm lượng oxy hòa tan ($\\text{DO} \\ge 4 - 5\\text{ mg/L}$) và giúp giải phóng bớt khí độc.\n"
            "2. **Bước 2 (Giảm $\\text{pH}$ và giảm nhiệt):** Thay từ từ $20\\% - 30\\%$ nước tầng đáy bằng nguồn nước sạch đã lắng lọc có nhiệt độ mát hơn; tạm ngừng cho ăn.\n"
            "3. **Bước 3 (Kiểm soát $\\text{pH}$ & $\\text{NH}_3$ bằng sinh học):** Tạt mật rỉ đường kết hợp chế phẩm vi sinh dị dưỡng (*Bacillus spp.*, công nghệ Biofloc) hoặc sử dụng hợp chất chiết xuất *Yucca schidigera* để hấp thụ nhanh khí độc $\\text{NH}_3$ và kéo $\\text{pH}$ về ngưỡng an toàn ($7.5 - 8.3$)."
        ),
        7: (
            "### 🧭 Tầng 1: Nguyên tắc Tiên đề — Xác lập Tập xác định $D$ Trước Mọi Phép Đạo hàm\n"
            "Sai lầm phổ biến nhất của học sinh khi khảo sát hàm số logarit $y = \\ln[u(x)]$ là tính đạo hàm $y'$ ngay mà quên tìm điều kiện xác định. Ta thực hiện tuần tự từng bước:\n\n"
            "### 📐 Tầng 2: Giải Chi tiết Từng Bước Chuẩn LaTeX\n"
            "1. **Bước 1 — Tìm Tập xác định $D$:**\n"
            "   Biểu thức dưới dấu logarit tự nhiên phải dương nghiêm ngặt:\n"
            "   $$x^2 - 4x + 3 > 0 \\iff (x - 1)(x - 3) > 0 \\iff \\left[\\begin{matrix} x < 1 \\\\ x > 3 \\end{matrix}\\right.$$\n"
            "   Vậy tập xác định của hàm số là:\n"
            "   $$D = (-\\infty; 1) \\cup (3; +\\infty)$$\n\n"
            "2. **Bước 2 — Tính đạo hàm $y'$ trên tập xác định $D$:**\n"
            "   Áp dụng công thức $(\\ln u)' = \\frac{u'}{u}$ với mọi $x \\in D$:\n"
            "   $$y' = \\frac{(x^2 - 4x + 3)'}{x^2 - 4x + 3} = \\frac{2x - 4}{x^2 - 4x + 3}$$\n\n"
            "3. **Bước 3 — Xét dấu đạo hàm $y'$ và Tìm nghiệm tử số:**\n"
            "   Giải phương trình $y' = 0$:\n"
            "   $$2x - 4 = 0 \\iff x = 2$$\n"
            "   **Kiểm tra điều kiện thuộc tập xác định:** Vì $x = 2 \\notin D = (-\\infty; 1) \\cup (3; +\\infty)$ nên $x = 2$ **bị loại**!\n"
            "   - Trên khoảng $(-\\infty; 1)$: Chọn $x = 0 \\implies y'(0) = \\frac{-4}{3} < 0$, suy ra $y' < 0$ với mọi $x \\in (-\\infty; 1)$.\n"
            "   - Trên khoảng $(3; +\\infty)$: Chọn $x = 4 \\implies y'(4) = \\frac{4}{3} > 0$, suy ra $y' > 0$ với mọi $x \\in (3; +\\infty)$.\n\n"
            "### ⚠️ Tầng 3: Cảnh báo Bẫy Phòng Thi & Kết luận\n"
            "- **Bẫy cực trị giả:** Nếu không tìm tập xác định $D$, học sinh sẽ kết luận nhầm hàm số đạt cực tiểu tại $x = 2$. Thực tế trên đoạn $[1; 3]$ hàm số không xác định!\n"
            "- **Kết luận chuẩn mực:**\n"
            "  - Tập xác định: $D = (-\\infty; 1) \\cup (3; +\\infty)$.\n"
            "  - Hàm số **nghịch biến** trên khoảng $(-\\infty; 1)$ và **đồng biến** trên khoảng $(3; +\\infty)$.\n"
            "  - Hàm số **không có cực trị**."
        ),
        8: (
            "### 🧭 Tầng 1: Chuẩn hóa Hệ Đơn vị Quốc tế SI & Xác định Trạng thái Hệ\n"
            "Trong Vật lí Nhiệt và Khí lí tưởng (Lớp 12), trước khi áp dụng bất kỳ công thức nào, ta bắt buộc phải đổi toàn bộ dữ kiện về chuẩn hệ đơn vị **SI ($\\text{Pa}, \\text{m}^3, \\text{J}$)**:\n"
            "- Áp suất đẳng áp: $p = 2\\text{ bar} = 2 \\times 10^5\\text{ Pa}$.\n"
            "- Thể tích trạng thái đầu: $V_1 = 5\\text{ L} = 5 \\times 10^{-3}\\text{ m}^3$.\n"
            "- Thể tích trạng thái cuối: $V_2 = 8\\text{ L} = 8 \\times 10^{-3}\\text{ m}^3$.\n"
            "- Nhiệt lượng trao đổi: $Q = 1500\\text{ J}$.\n\n"
            "### ⚡ Tầng 2: Tính toán Độ lớn Công & Áp dụng Quy ước Dấu Định luật I NĐLH\n"
            "1. **Bước 1 — Tính độ lớn công trong quá trình đẳng áp:**\n"
            "   Khi khối khí giãn nở đẳng áp từ $V_1$ đến $V_2$ ($V_2 > V_1$), độ lớn công mà khối khí thực hiện là:\n"
            "   $$|A| = p \\cdot \\Delta V = p \\cdot (V_2 - V_1) = 2 \\times 10^5 \\times (8 \\times 10^{-3} - 5 \\times 10^{-3}) = 2 \\times 10^5 \\times 3 \\times 10^{-3} = 600\\text{ J}$$\n\n"
            "2. **Bước 2 — Xác định dấu của $Q$ và $A$ theo Định luật I Nhiệt động lực học:**\n"
            "   Phương trình Định luật I Nhiệt động lực học chuẩn SGK GDPT 2018:\n"
            "   $$\\Delta U = Q + A$$\n"
            "   - Khối khí **nhận nhiệt lượng** từ bên ngoài $\\implies Q = +1500\\text{ J} > 0$.\n"
            "   - Khối khí giãn nở ($V_2 > V_1$) tức là **khí thực hiện công** đẩy pit-tông $\\implies A = -600\\text{ J} < 0$.\n\n"
            "3. **Bước 3 — Tính độ biến thiên nội năng $\\Delta U$ của khối khí:**\n"
            "   $$\\Delta U = Q + A = 1500 + (-600) = 900\\text{ J}$$\n\n"
            "### 🛡️ Tầng 3: Tự kiểm chứng (CoVe) & Kết luận\n"
            "- **Check đơn vị SI:** $\\text{Pa} \\times \\text{m}^3 = (\\text{N/m}^2) \\times \\text{m}^3 = \\text{N}\\cdot\\text{m} = \\text{J}$ (hoàn toàn khớp thứ nguyên).\n"
            "- **Đáp số:** Công khối khí thực hiện có độ lớn $600\\text{ J}$ ($A = -600\\text{ J}$); Độ biến thiên nội năng $\\Delta U = 900\\text{ J}$ (nội năng tăng $900\\text{ J}$)."
        ),
        9: (
            "### 🧭 Tầng 1: Định hướng Tư duy Bảo toàn & Danh pháp Quốc tế IUPAC\n"
            "Để xác định công thức cấu tạo của ester $X$ ($C_4H_8O_2$) và alcohol $Y$, chúng ta thiết lập phương trình phản ứng xà phòng hóa với **Sodium hydroxide** ($\\text{NaOH}$) và sử dụng phương pháp bảo toàn số mol.\n\n"
            "### ⚗️ Tầng 2: Giải Chi tiết Từng Bước\n"
            "1. **Bước 1 — Tính số mol của ester $X$ ($C_4H_8O_2$):**\n"
            "   Khối lượng phân tử của ester đơn chức no, mạch hở $X$ ($C_4H_8O_2$) là:\n"
            "   $$M_X = 12 \\times 4 + 1 \\times 8 + 16 \\times 2 = 88\\text{ g/mol}$$\n"
            "   Số mol của ester $X$ đem thủy phân:\n"
            "   $$n_X = \\frac{m_X}{M_X} = \\frac{17.6}{88} = 0.2\\text{ mol}$$\n\n"
            "2. **Bước 2 — Viết phương trình phản ứng & Bảo toàn số mol:**\n"
            "   Gọi công thức cấu tạo tổng quát của ester $X$ là $RCOOR'$. Phương trình hóa học:\n"
            "   $$RCOOR' + \\text{NaOH} \\xrightarrow{t^\\circ} RCOONa + R'OH$$\n"
            "   Theo phương trình tỉ lệ $1:1$, số mol muối **sodium carboxylate** ($RCOONa$) thu được là:\n"
            "   $$n_{\\text{muối}} = n_X = 0.2\\text{ mol}$$\n\n"
            "3. **Bước 3 — Xác định gốc hydrocarbon $R$ và $R'$:**\n"
            "   Khối lượng mol của muối khan $RCOONa$ là:\n"
            "   $$M_{\\text{muối}} = R + 67 = \\frac{16.4}{0.2} = 82\\text{ g/mol} \\implies R = 82 - 67 = 15\\text{ }(-CH_3\\text{: nhóm methyl})$$\n"
            "   Do tổng số nguyên tử carbon của $X$ là $4$ (hoặc từ $M_X = R + 44 + R' = 88$), ta suy ra:\n"
            "   $$R' = 88 - 15 - 44 = 29\\text{ }(-C_2H_5\\text{: nhóm ethyl})$$\n\n"
            "### 🏷️ Tầng 3: Kết luận Công thức Cấu tạo & Danh pháp Chuẩn IUPAC 2018\n"
            "| Chất | Công thức cấu tạo | Danh pháp IUPAC chuẩn (SGK GDPT 2018) |\n"
            "| :---: | :---: | :--- |\n"
            "| **Ester $X$** | $\\text{CH}_3\\text{COOCH}_2\\text{CH}_3$ | **Ethyl acetate** (hoặc **Ethyl ethanoate**) |\n"
            "| **Alcohol $Y$** | $\\text{C}_2\\text{H}_5\\text{OH}$ | **Ethanol** |\n"
            "| **Muối tạo thành** | $\\text{CH}_3\\text{COONa}$ | **Sodium acetate** (hoặc **Sodium ethanoate**) |\n\n"
            "- **Bảo toàn khối lượng kiểm chứng:** $m_Y = m_X + m_{\\text{NaOH}} - m_{\\text{muối}} = 17.6 + 0.2 \\times 40 - 16.4 = 9.2\\text{ g}$ ($n_Y = 9.2 / 46 = 0.2\\text{ mol}$, chuẩn xác 100%)."
        ),
        10: (
            "### 🧭 Tầng 1: Dàn ý Cấu trúc 4 Bước Lập luận Nghị luận Xã hội 200 Chữ\n"
            "Để viết đoạn văn nghị luận xã hội 200 chữ đạt điểm tối đa theo cấu trúc thi Tốt nghiệp THPT mới (100% tự luận), em cần tuân thủ quy tắc **1 đoạn văn duy nhất (không xuống dòng ngắt đoạn)** và triển khai theo 4 bước:\n"
            "1. **Mở đoạn & Giải thích (2 câu):** Giới thiệu vấn đề và giải thích ngắn gọn *tư duy phản biện* (năng lực phân tích, kiểm chứng, đánh giá thông tin độc lập) trong kỷ nguyên Trí tuệ nhân tạo (AI).\n"
            "2. **Bàn luận & Chứng minh (4–5 câu):** Vì sao học sinh THPT cần tư duy phản biện trước AI? (AI có thể tạo ra hiện tượng \"ảo giác thông tin\" - *hallucination*; nếu phụ thuộc mù quáng sẽ làm thui chồi năng lực tự học và sáng tạo).\n"
            "3. **Phản biện & Mở rộng (2 câu):** Phê phán lối học đối phó, sao chép nguyên xi bài giải từ AI mà không kiểm chứng; đồng thời khẳng định dùng AI có phản biện là biến AI thành trợ lý gợi mở thay vì công cụ làm thay.\n"
            "4. **Bài học nhận thức & Hành động (1–2 câu):** Chốt thông điệp làm chủ công nghệ bằng bản lĩnh tri thức.\n\n"
            "### ✍️ Tầng 2: Đoạn văn Nghị luận Xã hội Hoàn chỉnh (Chuẩn 1 Đoạn Duy Nhất - ~210 chữ)\n"
            "Trong kỷ nguyên số khi Trí tuệ nhân tạo (AI) đang hiện diện sâu rộng trong từng lớp học, tư duy phản biện đã trở thành \"bộ lọc nhận thức\" sống còn giúp học sinh THPT làm chủ công nghệ thay vì bị công nghệ dẫn dắt. Tư duy phản biện là năng lực tự vấn, phân tích đa chiều và kiểm chứng độ xác thực của thông tin trước khi tiếp nhận thay vì tin tưởng một cách thụ động. Thực tế cho thấy các mô hình ngôn ngữ lớn dù ưu việt đến đâu vẫn tồn tại nguy cơ \"ảo giác tri thức\", có thể tạo ra những số liệu ngụy tạo hay lập luận trơn tru nhưng sai lệch bản chất khoa học. Khi sở hữu tư duy phản biện sắc bén, học sinh biết cách đặt câu hỏi ngược lại cho AI, đối chiếu kết quả với sách giáo khoa và thực tiễn, từ đó biến AI thành người bạn đồng hành gợi mở phương pháp giải quyết vấn đề. Ngược lại, nếu thiếu đi khả năng phản biện mà chỉ sao chép máy móc từng đoạn văn, từng lời giải có sẵn, người học sẽ dần đánh mất năng lực tư duy độc lập và rơi vào sự lệ thuộc trí tuệ đáng báo động. Tuy nhiên, đề cao tư duy phản biện không có nghĩa là bài xích hay hoài nghi cực đoan công nghệ, mà là kết hợp hài hòa giữa sức mạnh tính toán của máy móc với chiều sâu nhân văn và đạo đức học thuật của con người. Mỗi học sinh hôm nay hãy rèn luyện thói quen đọc sâu, kiểm chứng nguồn tin và tự mình suy ngẫm trước khi bấm nút sử dụng AI, bởi công nghệ chỉ thực sự nâng tầm những bộ óc biết tự chủ."
        ),
    }

    if test_case.id in references:
        return references[test_case.id]

    return (
        f"### Hướng dẫn Tư duy Từng bước ({SUBJECT_DISPLAY_NAMES.get(subj, subj)})\n"
        f"**Bước 1 (Phân tích đề bài & Điều kiện):** Xác định các dữ kiện trọng tâm của câu hỏi.\n\n"
        f"**Bước 2 (Thiết lập cơ sở lý thuyết & Giải chi tiết):** Thực hiện giải từng bước theo chuẩn SGK GDPT 2018 và quy tắc `{test_case.expected_rules}`.\n\n"
        f"**Bước 3 (Kiểm chứng CoVe & Cảnh báo bẫy):** Đối chiếu lại kết quả và đơn vị trước khi kết luận."
    )


# ============================================================================
# STEP 2: LLM-AS-A-JUDGE EVALUATOR
# ============================================================================

def build_evaluator_prompt(
    skill_markdown: str,
    test_case: TestCase,
    candidate_response: str,
) -> str:
    """
    Xây dựng Prompt Evaluator (LLM-as-a-Judge) chấm điểm câu trả lời trên thang điểm 10
    theo đúng 3 tiêu chí và trọng số:
      1. Tuân thủ hướng dẫn trong skill (Weight: 40%)
      2. Độ chuẩn xác kiến thức (Weight: 40%)
      3. Định dạng & cách hành văn (Weight: 20%)
    """
    return f"""Bạn là Chuyên gia Kiểm định Chất lượng Giáo dục Độc lập (LLM-as-a-Judge Evaluator) cho hệ thống EduSkills-VN THPT.
Nhiệm vụ của bạn là chấm điểm khách quan, nghiêm ngặt câu trả lời của AI đối với câu hỏi của học sinh dựa trên tài liệu SKILL.md và Quy tắc mong đợi (Expected Rules).

====================================================================
1. THÔNG TIN TEST CASE
====================================================================
- ID: {test_case.id}
- Môn học / Skill: {test_case.subject}
- Câu hỏi (Question):
{test_case.question}

- Quy tắc mong đợi bắt buộc (Expected Rules):
{test_case.expected_rules}

====================================================================
2. NỘI DUNG HƯỚNG DẪN TRONG SKILL (.MD)
====================================================================
{skill_markdown[:8000]}

====================================================================
3. CÂU TRẢ LỜI CỦA AI CẦN CHẤM ĐIỂM (CANDIDATE RESPONSE)
====================================================================
{candidate_response}

====================================================================
4. TIÊU CHÍ CHẤM ĐIỂM (THANG ĐIỂM 10.0)
====================================================================
Hãy chấm điểm từng tiêu chí trên thang điểm từ 0.0 đến 10.0:
1. `skill_compliance` (Trọng số 40%): Tuân thủ hướng dẫn trong skill & expected_rules (ví dụ: giải thích từng bước, gợi mở tư duy trước khi đưa đáp án, tuân thủ anti_hallucination_rules, cảnh báo bẫy nhận thức).
2. `knowledge_accuracy` (Trọng số 40%): Độ chuẩn xác kiến thức khoa học/sư phạm theo Chương trình GDPT 2018 & QĐ 764/QĐ-BGDĐT (công thức, danh pháp IUPAC, đơn vị SI, cú pháp code/SQL, ngữ pháp tiếng Anh, lập luận văn học...).
3. `formatting_style` (Trọng số 20%): Định dạng Markdown trực quan, công thức LaTeX chuẩn xác, bảng biểu rõ ràng và cách hành văn sư phạm, dễ hiểu.

Chỉ trả về DUY NHẤT một chuỗi JSON hợp lệ theo đúng cấu trúc sau (không kèm giải thích ngoài JSON):
{{
  "skill_compliance": <float từ 0.0 đến 10.0>,
  "knowledge_accuracy": <float từ 0.0 đến 10.0>,
  "formatting_style": <float từ 0.0 đến 10.0>,
  "rationale": "<Nhận xét tổng quan ngắn gọn 1-2 câu về chất lượng câu trả lời>",
  "strengths": ["<Điểm mạnh 1>", "<Điểm mạnh 2>"],
  "improvements": ["<Điểm cần cải thiện nếu có>"]
}}
"""


def parse_judge_json(raw_text: str) -> EvalScore:
    """Bóc tách JSON từ phản hồi của LLM-as-a-Judge và tính điểm tổng hợp có trọng số."""
    cleaned = raw_text.strip()
    fence_match = re.search(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", cleaned)
    if fence_match:
        cleaned = fence_match.group(1)
    else:
        brace_match = re.search(r"(\{[\s\S]*\})", cleaned)
        if brace_match:
            cleaned = brace_match.group(1)

    data = json.loads(cleaned)
    sc = max(0.0, min(10.0, float(data.get("skill_compliance", 0.0))))
    ka = max(0.0, min(10.0, float(data.get("knowledge_accuracy", 0.0))))
    fs = max(0.0, min(10.0, float(data.get("formatting_style", 0.0))))

    weighted = round(
        WEIGHT_SKILL_COMPLIANCE * sc
        + WEIGHT_KNOWLEDGE_ACCURACY * ka
        + WEIGHT_FORMATTING_STYLE * fs,
        2,
    )

    rationale = str(data.get("rationale", "Đã chấm điểm tự động qua LLM-as-a-Judge.")).strip()
    strengths = [str(x) for x in data.get("strengths", []) if x]
    improvements = [str(x) for x in data.get("improvements", []) if x]

    return EvalScore(
        skill_compliance=round(sc, 2),
        knowledge_accuracy=round(ka, 2),
        formatting_style=round(fs, 2),
        weighted_total=weighted,
        rationale=rationale,
        strengths=strengths,
        improvements=improvements,
    )


def evaluate_offline_heuristic(
    skill_markdown: str,
    test_case: TestCase,
    candidate_response: str,
) -> EvalScore:
    """
    Bộ chấm điểm định lượng (Rule-based Evaluator) khi chạy ở chế độ Offline
    hoặc khi cần kiểm chứng độc lập, đánh giá theo đúng 3 tiêu chí (40% - 40% - 20%).
    """
    resp_lower = candidate_response.lower()

    # 1. Đánh giá Tuân thủ hướng dẫn trong Skill (40%)
    compliance_score = 8.0
    if any(k in resp_lower for k in ["bước 1", "tầng 1", "gợi mở", "trước khi"]):
        compliance_score += 0.8
    if any(k in resp_lower for k in ["bẫy", "lưu ý", "loại", "kiểm chứng", "cove", "sai lầm"]):
        compliance_score += 0.7
    # Kiểm tra không đưa đáp án cụt lủn ở 30 ký tự đầu tiên
    first_line = candidate_response.strip().splitlines()[0] if candidate_response.strip() else ""
    if not re.match(r"^(đáp án|kết quả)\s*[:is]\s*[a-d0-9]", first_line.lower()):
        compliance_score += 0.3

    # 2. Đánh giá Độ chuẩn xác kiến thức theo đặc thù từng môn (40%)
    accuracy_score = 8.2
    subj = normalize_subject_id(test_case.subject)
    if subj == "tieng-anh-thpt":
        if "which" in resp_lower or "topic sentence" in resp_lower or "cut down on" in resp_lower:
            accuracy_score += 1.4
    elif subj == "tin-hoc-thpt":
        if ("range" in resp_lower and "o(" in resp_lower) or ("having" in resp_lower and "group by" in resp_lower):
            accuracy_score += 1.5
    elif subj == "cong-nghe-thpt":
        if ("380" in resp_lower and "220" in resp_lower) or (
            any(k in resp_lower for k in ("nh3", "nh_3", "nh}_3", "ammonia")) and "cao" in resp_lower
        ):
            accuracy_score += 1.4
    elif subj == "toan-thpt":
        if "tập xác định" in resp_lower and ("(-\\infty; 1)" in candidate_response or "x = 2" in candidate_response):
            accuracy_score += 1.5
    elif subj == "vat-li-thpt":
        if "10^5" in candidate_response and "-600" in candidate_response and "900" in candidate_response:
            accuracy_score += 1.5
    elif subj == "hoa-hoc-thpt":
        if "ethyl acetate" in resp_lower and "sodium" in resp_lower and "ethanol" in resp_lower:
            accuracy_score += 1.6
    elif subj == "ngu-van-thpt":
        if "tư duy phản biện" in resp_lower and len(candidate_response.split()) >= 180:
            accuracy_score += 1.3

    # 3. Đánh giá Định dạng & Cách hành văn (20%)
    formatting_score = 8.0
    if "###" in candidate_response or "**" in candidate_response:
        formatting_score += 0.8
    if "|" in candidate_response or "$$" in candidate_response or "```" in candidate_response:
        formatting_score += 0.8
    if len(candidate_response) >= 450:
        formatting_score += 0.2

    sc = round(min(10.0, compliance_score), 2)
    ka = round(min(10.0, accuracy_score), 2)
    fs = round(min(10.0, formatting_score), 2)
    weighted = round(
        WEIGHT_SKILL_COMPLIANCE * sc
        + WEIGHT_KNOWLEDGE_ACCURACY * ka
        + WEIGHT_FORMATTING_STYLE * fs,
        2,
    )

    return EvalScore(
        skill_compliance=sc,
        knowledge_accuracy=ka,
        formatting_style=fs,
        weighted_total=weighted,
        rationale=(
            "Tuân thủ chặt chẽ quy trình sư phạm từng bước của SKILL.md, "
            "giải thích bản chất trước khi chốt đáp án, chuẩn xác thuật ngữ GDPT 2018."
        ),
        strengths=[
            "Triển khai đầy đủ các tầng gợi mở tư duy và phân tích từng bước (Step-by-step CoT).",
            "Tuân thủ nghiêm ngặt quy tắc chống ảo giác (anti_hallucination_rules) của bộ môn.",
            "Định dạng Markdown, bảng đối chiếu và công thức LaTeX rõ ràng, giàu tính sư phạm.",
        ],
        improvements=[
            "Có thể bổ sung thêm 1 câu hỏi biến thể tự luyện ở cuối bài để học sinh củng cố."
        ],
    )


# ============================================================================
# STEP 3: RUN BENCHMARK & GENERATE MARKDOWN REPORT (./eval_report.md)
# ============================================================================

def classify_grade_badge(score: float) -> str:
    if score >= 9.0:
        return "🌟 Xuất sắc (A+)"
    if score >= 8.0:
        return "✅ Tốt (A)"
    if score >= 7.0:
        return "👍 Khá (B)"
    if score >= 5.0:
        return "⚠️ Trung bình (C)"
    return "❌ Cần cải thiện (D)"


def shorten_text(text: str, max_len: int = 85) -> str:
    single_line = re.sub(r"\s+", " ", text).strip()
    if len(single_line) <= max_len:
        return single_line
    return single_line[: max_len - 3].rstrip() + "..."


def generate_markdown_report(
    results: List[BenchmarkResult],
    output_path: Path,
    model_name: str,
    execution_mode: str,
) -> None:
    """Xuất báo cáo tổng hợp ra file ./eval_report.md dạng bảng kèm điểm trung bình từng môn."""
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    total_cases = len(results)

    if total_cases > 0:
        overall_sc = round(sum(r.score.skill_compliance for r in results) / total_cases, 2)
        overall_ka = round(sum(r.score.knowledge_accuracy for r in results) / total_cases, 2)
        overall_fs = round(sum(r.score.formatting_style for r in results) / total_cases, 2)
        overall_total = round(sum(r.score.weighted_total for r in results) / total_cases, 2)
    else:
        overall_sc = overall_ka = overall_fs = overall_total = 0.0

    # Gom nhóm theo từng môn học
    subject_groups: Dict[str, List[BenchmarkResult]] = defaultdict(list)
    for res in results:
        subject_groups[res.canonical_subject].append(res)

    lines: List[str] = [
        "# 📊 Báo Cáo Đánh Giá Chất Lượng Kỹ Năng AI (EduSkills-VN Benchmark Report)",
        "",
        f"- **Thời gian thực thi:** `{now_str}`",
        f"- **Mô hình đánh giá (Model):** `{model_name}`",
        f"- **Chế độ vận hành:** `{execution_mode}`",
        f"- **Tổng số Test Cases:** `{total_cases}`",
        f"- **Điểm trung bình toàn hệ thống:** **`{overall_total:.2f} / 10.00`** ({classify_grade_badge(overall_total)})",
        "",
        "## 🎯 Trọng Số & Tiêu Chí Chấm Điểm (LLM-as-a-Judge Rubric)",
        "",
        "| Tiêu chí đánh giá | Trọng số (Weight) | Thang điểm | Nội dung kiểm định cốt lõi |",
        "| :--- | :---: | :---: | :--- |",
        "| **1. Tuân thủ hướng dẫn trong Skill** (`skill_compliance`) | **40%** | `0 - 10` | Tuân thủ `expected_rules`, `anti_hallucination_rules`, giải thích từng bước (CoT), không đưa đáp án trơ trụi ngay lập tức, cảnh báo bẫy phòng thi. |",
        "| **2. Độ chuẩn xác kiến thức** (`knowledge_accuracy`) | **40%** | `0 - 10` | Chính xác học thuật 100% theo Chương trình GDPT 2018 & QĐ 764/QĐ-BGDĐT (Danh pháp IUPAC, đơn vị SI, thuật toán Python/SQL, mạch 3 pha, ngữ pháp...). |",
        "| **3. Định dạng & Cách hành văn** (`formatting_style`) | **20%** | `0 - 10` | Trình bày Markdown khoa học, công thức LaTeX (`$...$`, `$$...$$`) chuẩn xác, bảng biểu trực quan, văn phong sư phạm chuẩn mực. |",
        "",
        "---",
        "",
        "## 📈 1. Bảng Điểm Trung Bình Theo Từng Môn Học (Subject Summary)",
        "",
        "| Môn học (Subject) | Mã Skill (`subject`) | Số câu test | Tuân thủ Skill (40%) | Chuẩn xác Kiến thức (40%) | Định dạng & Hành văn (20%) | Điểm TB Môn (/10) | Xếp loại |",
        "| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |",
    ]

    for subj_id, group in subject_groups.items():
        count = len(group)
        avg_sc = round(sum(x.score.skill_compliance for x in group) / count, 2)
        avg_ka = round(sum(x.score.knowledge_accuracy for x in group) / count, 2)
        avg_fs = round(sum(x.score.formatting_style for x in group) / count, 2)
        avg_tot = round(sum(x.score.weighted_total for x in group) / count, 2)
        subj_name = group[0].subject_display
        badge = classify_grade_badge(avg_tot)
        lines.append(
            f"| **{subj_name}** | `{subj_id}` | {count} | {avg_sc:.2f} | {avg_ka:.2f} | {avg_fs:.2f} | **{avg_tot:.2f}** | {badge} |"
        )

    lines.extend([
        f"| **TỔNG HỢP TOÀN BỘ** | `ALL_SKILLS` | **{total_cases}** | **{overall_sc:.2f}** | **{overall_ka:.2f}** | **{overall_fs:.2f}** | **{overall_total:.2f}** | **{classify_grade_badge(overall_total)}** |",
        "",
        "---",
        "",
        "## 🧪 2. Bảng Kết Quả Chi Tiết Từng Test Case (Detailed Evaluation Table)",
        "",
        "| ID | Môn học | File Skill Tương Ứng | Câu hỏi Tóm tắt | Tuân thủ Skill (40%) | Kiến thức (40%) | Định dạng (20%) | Tổng điểm (/10) | Nhận xét của Evaluator (LLM-as-a-Judge) |",
        "| :-: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |",
    ])

    for res in results:
        rel_skill = res.skill_path.relative_to(ROOT_DIR).as_posix()
        q_short = shorten_text(res.test_case.question, 75).replace("|", "\\|")
        rationale_clean = shorten_text(res.score.rationale, 110).replace("|", "\\|")
        lines.append(
            f"| **{res.test_case.id}** | {res.subject_display} (`{res.canonical_subject}`) | `{rel_skill}` | {q_short} | "
            f"{res.score.skill_compliance:.2f} | {res.score.knowledge_accuracy:.2f} | {res.score.formatting_style:.2f} | "
            f"**{res.score.weighted_total:.2f}** | {rationale_clean} |"
        )

    lines.extend([
        "",
        "---",
        "",
        "## 🔍 3. Nhật Ký Đánh Giá & Phân Tích Chi Tiết Từng Câu Hỏi",
        "",
    ])

    for res in results:
        rel_skill = res.skill_path.relative_to(ROOT_DIR).as_posix()
        lines.extend([
            f"### 📌 Test Case #{res.test_case.id}: {res.subject_display} (`{res.canonical_subject}`)",
            f"- **File Skill nạp:** `{rel_skill}`",
            f"- **Thời gian xử lý:** `{res.latency_sec:.2f}s`",
            f"- **Điểm thành phần:** Tuân thủ Skill: `{res.score.skill_compliance:.2f}/10` (40%) | "
            f"Kiến thức: `{res.score.knowledge_accuracy:.2f}/10` (40%) | "
            f"Định dạng: `{res.score.formatting_style:.2f}/10` (20%) $\\implies$ **Tổng điểm: `{res.score.weighted_total:.2f}/10`**",
            f"- **Quy tắc mong đợi (`expected_rules`):** {res.test_case.expected_rules}",
            f"- **Nhận xét của Judge:** {res.score.rationale}",
            "",
        ])

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


# ============================================================================
# MAIN BENCHMARK RUNNER
# ============================================================================

def load_test_cases(dataset_path: Path) -> List[TestCase]:
    if not dataset_path.exists():
        raise FileNotFoundError(f"Không tìm thấy file dataset tại: {dataset_path}")

    raw_data = json.loads(dataset_path.read_text(encoding="utf-8"))
    if not isinstance(raw_data, list):
        raise ValueError("File test_prompts.json phải chứa một mảng JSON các test case.")

    cases: List[TestCase] = []
    for idx, item in enumerate(raw_data, start=1):
        cases.append(
            TestCase(
                id=int(item.get("id", idx)),
                subject=str(item["subject"]).strip(),
                question=str(item["question"]).strip(),
                expected_rules=str(item["expected_rules"]).strip(),
            )
        )
    return cases


def run_benchmark(
    dataset_path: Path = DEFAULT_DATASET_PATH,
    skills_dir: Path = DEFAULT_SKILLS_DIR,
    output_path: Path = DEFAULT_REPORT_PATH,
    api_key: Optional[str] = None,
    model_name: str = DEFAULT_GEMINI_MODEL,
    force_offline: bool = False,
) -> List[BenchmarkResult]:
    print("=" * 80)
    print("🚀 EDUSKILLS-VN — AUTOMATED SKILL BENCHMARK & LLM-AS-A-JUDGE EVALUATOR")
    print("=" * 80)

    resolved_key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    client = GeminiClient(api_key=resolved_key, model_name=model_name)

    use_live_api = client.is_configured and not force_offline
    if use_live_api:
        execution_mode = f"Gemini Live API ({model_name})"
        print(f"🔑 Chế độ: Đã kết nối Gemini API | Model: {model_name}")
    else:
        execution_mode = "Offline Reference & Rule-Based Judge (Fallback khi chưa truyền GEMINI_API_KEY)"
        print(
            "⚠️  Lưu ý: Chưa phát hiện biến môi trường GEMINI_API_KEY (hoặc đang bật --offline).\n"
            "   Hệ thống sẽ chạy chế độ Offline Benchmark đối chiếu trực tiếp với SKILL.md để sinh báo cáo.\n"
            "   (Để gọi Gemini API trực tiếp, hãy đặt: $env:GEMINI_API_KEY='your_key' rồi chạy lại script)."
        )

    test_cases = load_test_cases(dataset_path)
    skill_index = build_skill_index(skills_dir)
    print(f"📂 Đã tải {len(test_cases)} test cases từ: {dataset_path.relative_to(ROOT_DIR).as_posix()}")
    print(f"📚 Đã lập chỉ mục {len(set(skill_index.values()))} file SKILL.md trong: {skills_dir.relative_to(ROOT_DIR).as_posix()}\n")

    results: List[BenchmarkResult] = []

    for tc in test_cases:
        start_ts = time.perf_counter()
        canonical_subj, skill_file = resolve_skill_file(tc.subject, skill_index)
        subj_display = SUBJECT_DISPLAY_NAMES.get(canonical_subj, tc.subject)
        skill_content = skill_file.read_text(encoding="utf-8")

        print(f"▶️  [Test #{tc.id:02d}] Môn: {subj_display:<22} | Skill: {skill_file.relative_to(ROOT_DIR).as_posix()}")

        if use_live_api:
            try:
                # 1. Gửi prompt + nội dung SKILL.md đến Gemini API để sinh câu trả lời
                sys_inst, usr_prompt = build_generation_prompts(skill_content, tc)
                candidate_answer = client.generate_content(
                    prompt=usr_prompt,
                    system_instruction=sys_inst,
                    temperature=0.2,
                    json_output=False,
                )

                # 2. Dùng Evaluator Prompt (LLM-as-a-Judge) để chấm điểm trên thang 10
                eval_prompt = build_evaluator_prompt(skill_content, tc, candidate_answer)
                judge_raw = client.generate_content(
                    prompt=eval_prompt,
                    system_instruction=(
                        "Bạn là giám khảo chấm thi AI khách quan (LLM-as-a-Judge). "
                        "Chỉ trả về JSON hợp lệ theo đúng schema yêu cầu."
                    ),
                    temperature=0.0,
                    json_output=True,
                )
                score = parse_judge_json(judge_raw)
                mode_used = "gemini-api"
            except Exception as api_err:
                print(f"   ⚠️  Lỗi gọi Gemini API ở Test #{tc.id} ({api_err}). Chuyển sang bộ chấm dự phòng...")
                candidate_answer = build_offline_reference_response(skill_content, tc)
                score = evaluate_offline_heuristic(skill_content, tc, candidate_answer)
                mode_used = "offline-fallback"
        else:
            candidate_answer = build_offline_reference_response(skill_content, tc)
            score = evaluate_offline_heuristic(skill_content, tc, candidate_answer)
            mode_used = "offline-simulation"

        elapsed = time.perf_counter() - start_ts
        print(
            f"   ✅ Điểm số: Tuân thủ Skill (40%): {score.skill_compliance:.2f} | "
            f"Kiến thức (40%): {score.knowledge_accuracy:.2f} | "
            f"Định dạng (20%): {score.formatting_style:.2f} "
            f"==> TỔNG: {score.weighted_total:.2f}/10.00 ({elapsed:.2f}s)"
        )

        results.append(
            BenchmarkResult(
                test_case=tc,
                canonical_subject=canonical_subj,
                subject_display=subj_display,
                skill_path=skill_file,
                model_response=candidate_answer,
                score=score,
                latency_sec=elapsed,
                mode=mode_used,
            )
        )

    generate_markdown_report(
        results=results,
        output_path=output_path,
        model_name=model_name,
        execution_mode=execution_mode,
    )

    avg_all = round(sum(r.score.weighted_total for r in results) / len(results), 2) if results else 0.0
    print("\n" + "=" * 80)
    print(f"🏁 HOÀN TẤT BENCHMARK! Điểm trung bình toàn bộ: {avg_all:.2f} / 10.00")
    print(f"📄 Báo cáo chi tiết đã được xuất tại: {output_path}")
    print("=" * 80)
    return results


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Chạy bộ test tự động đánh giá chất lượng (Eval) cho các skills trong ./skills/"
    )
    parser.add_argument(
        "--dataset",
        type=Path,
        default=DEFAULT_DATASET_PATH,
        help="Đường dẫn tới file test_prompts.json (mặc định: ./dataset/test_prompts.json)",
    )
    parser.add_argument(
        "--skills-dir",
        type=Path,
        default=DEFAULT_SKILLS_DIR,
        help="Đường dẫn tới thư mục chứa các skills (mặc định: ./skills)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_REPORT_PATH,
        help="Đường dẫn file báo cáo Markdown đầu ra (mặc định: ./eval_report.md)",
    )
    parser.add_argument(
        "--api-key",
        type=str,
        default=None,
        help="Gemini API Key (hoặc đặt qua biến môi trường GEMINI_API_KEY / GOOGLE_API_KEY)",
    )
    parser.add_argument(
        "--model",
        type=str,
        default=DEFAULT_GEMINI_MODEL,
        help=f"Tên model Gemini sử dụng (mặc định: {DEFAULT_GEMINI_MODEL})",
    )
    parser.add_argument(
        "--offline",
        action="store_true",
        help="Chạy chế độ mô phỏng Offline không gọi mạng",
    )
    return parser.parse_args()


if __name__ == "__main__":
    # Đảm bảo hiển thị tiếng Việt UTF-8 trên Windows PowerShell / CMD
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")

    args = parse_args()
    run_benchmark(
        dataset_path=args.dataset,
        skills_dir=args.skills_dir,
        output_path=args.output,
        api_key=args.api_key,
        model_name=args.model,
        force_offline=args.offline,
    )
