#!/usr/bin/env python3
"""
Validate all 16 THPT Agent Skills in the repository (or an installed directory).

Checks:
- No root SKILL.md that breaks multi-skill discovery
- Exact set of 16 expected skills with no duplicates
- Valid YAML frontmatter, allowed keys, name == folder name, description constraints
- No unfinished scaffold placeholders
- Internal markdown links & local file references (references/, scripts/, assets/) exist and stay inside the skill directory
- No non-existent declared tools, dependencies, icons, or fabricated tool names
- No rigid anti-pedagogical rules removed during refactoring
- No empty directories inside skills
- Valid agents/openai.yaml metadata (display_name, short_description 25-64 chars, default_prompt includes $<name>)
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import List, Tuple

import yaml

EXPECTED_THPT_SKILLS = sorted(
    [
        "cong-nghe-thpt",
        "dia-li-thpt",
        "giai-chi-tiet",
        "hoa-hoc-thpt",
        "ktpl-thpt",
        "lich-su-thpt",
        "luan-an-nghiencuu",
        "ngu-van-thpt",
        "sinh-hoc-thpt",
        "slide-thuyet-trinh",
        "tao-quiz-bgd",
        "tieng-anh-thpt",
        "tin-hoc-thpt",
        "toan-thpt",
        "tomtat-mindmap",
        "vat-li-thpt",
    ]
)

EXPECTED_UNIVERSITY_STAGE1_SKILLS = sorted(
    [
        "chuyen-tiep-dai-hoc",
        "dai-so-tuyen-tinh",
        "giai-tich-dai-hoc",
        "hoc-dai-hoc-hieu-qua",
        "lap-trinh-can-ban",
        "phuong-phap-nghien-cuu",
        "tu-van-huong-nghiep-tuyen-sinh",
        "tu-van-tam-ly-hoc-duong",
        "viet-hoc-thuat",
        "xac-suat-thong-ke",
    ]
)

EXPECTED_SKILLS = sorted(EXPECTED_THPT_SKILLS + EXPECTED_UNIVERSITY_STAGE1_SKILLS)
THPT_SET = set(EXPECTED_THPT_SKILLS)
UNI_STAGE1_SET = set(EXPECTED_UNIVERSITY_STAGE1_SKILLS)

ALLOWED_FRONTMATTER_KEYS = {"name", "description", "license", "allowed-tools", "metadata"}
MAX_NAME_LENGTH = 64
MAX_DESC_LENGTH = 1024

PLACEHOLDER_PATTERNS = [
    re.compile(r"\[TODO\s*:", re.IGNORECASE),
    re.compile(r"\bTBD\b"),
    re.compile(r"\bFIXME\b"),
    re.compile(r"<OWNER>/<REPO>"),
    re.compile(r"<SOURCE_PATH>"),
]

# Legacy fabricated tools & banned rigid phrases
BANNED_FABRICATED_TOOLS = [
    "latex_renderer",
    "function_variation_analyzer",
    "oxyz_vector_engine",
    "bayes_probability_solver",
    "optimization_modeler",
]

BANNED_RIGID_PHRASES = [
    re.compile(r"luôn trả lời theo bốn tầng cho mọi", re.IGNORECASE),
    re.compile(r"tuyệt đối không được chỉ trả lời.*cụt ngủn", re.IGNORECASE),
    re.compile(r"bắt buộc triển khai đầy đủ 4 tầng", re.IGNORECASE),
    re.compile(r"master universal system prompt", re.IGNORECASE),
]

MARKDOWN_LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
LOCAL_RESOURCE_REF_RE = re.compile(r"(?<![A-Za-z0-9_./-])((?:references|scripts|assets)/[A-Za-z0-9_.-]+)")


def extract_frontmatter(text: str) -> Tuple[dict | None, str, str | None]:
    if not text.startswith("---"):
        return None, text, "Thiếu YAML frontmatter ở đầu file"
    match = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n?(.*)$", text, re.DOTALL)
    if not match:
        return None, text, "Định dạng YAML frontmatter không hợp lệ"
    try:
        data = yaml.safe_load(match.group(1))
    except yaml.YAMLError as exc:
        return None, text, f"Lỗi cú pháp YAML: {exc}"
    if not isinstance(data, dict):
        return None, text, "Frontmatter phải là một YAML dictionary"
    return data, match.group(2), None


def strip_code_fences(markdown_text: str) -> str:
    """Remove fenced code blocks so code samples do not trigger markdown checks."""
    out_lines: List[str] = []
    fence_char = None
    fence_len = 0
    for line in markdown_text.splitlines():
        m = re.match(r"^[ \t]*(?:(?:[-+*]|\d+[.)])[ \t]+)?(`{3,}|~{3,})(.*)$", line)
        if m:
            marker = m.group(1)
            if fence_char is None:
                fence_char = marker[0]
                fence_len = len(marker)
                continue
            elif marker[0] == fence_char and len(marker) >= fence_len and not m.group(2).strip():
                fence_char = None
                fence_len = 0
                continue
        if fence_char is None:
            out_lines.append(line)
    return "\n".join(out_lines)


def check_links_and_self_containment(md_file: Path, skill_root: Path) -> List[str]:
    errors: List[str] = []
    raw = md_file.read_text(encoding="utf-8")
    prose = strip_code_fences(raw)

    for match in MARKDOWN_LINK_RE.finditer(prose):
        target = match.group(1).strip()
        if not target or target.startswith("#"):
            continue
        if target.startswith(("http://", "https://", "mailto:")):
            continue
        target_path_str = target.split()[0].split("#")[0].strip("<>")
        if not target_path_str:
            continue

        if Path(target_path_str).is_absolute():
            errors.append(
                f"{md_file}: Liên kết '{target_path_str}' là đường dẫn tuyệt đối (vi phạm tính tự chứa)"
            )
            continue

        resolved = (md_file.parent / target_path_str).resolve()
        try:
            resolved.relative_to(skill_root.resolve())
        except ValueError:
            errors.append(
                f"{md_file}: Liên kết '{target_path_str}' trỏ ra ngoài thư mục skill ({skill_root})"
            )
            continue

        if not resolved.exists():
            errors.append(
                f"{md_file}: Tệp được tham chiếu '{target_path_str}' không tồn tại ({resolved})"
            )

    # Also verify explicit references/scripts/assets path mentions in SKILL.md
    if md_file.name.upper() == "SKILL.MD":
        for ref_match in LOCAL_RESOURCE_REF_RE.finditer(prose):
            rel_res = ref_match.group(1)
            if not (skill_root / rel_res).exists():
                errors.append(
                    f"{md_file}: Nhắc tới tài nguyên '{rel_res}' nhưng không tồn tại trong {skill_root}"
                )

    return errors


def check_placeholders_and_rules(md_file: Path) -> List[str]:
    errors: List[str] = []
    raw = md_file.read_text(encoding="utf-8")
    prose = strip_code_fences(raw)

    for idx, line in enumerate(prose.splitlines(), start=1):
        for pat in PLACEHOLDER_PATTERNS:
            if pat.search(line):
                errors.append(
                    f"{md_file}:{idx}: Chứa placeholder chưa hoàn thiện khớp '{pat.pattern}'"
                )

    for tool_name in BANNED_FABRICATED_TOOLS:
        if tool_name in raw:
            errors.append(f"{md_file}: Còn khai báo tên công cụ không tồn tại '{tool_name}'")

    for pat in BANNED_RIGID_PHRASES:
        if pat.search(prose):
            errors.append(f"{md_file}: Còn quy định cứng nhắc/lặp cần loại bỏ khớp '{pat.pattern}'")

    return errors


def validate_openai_yaml(skill_dir: Path, skill_name: str) -> List[str]:
    errors: List[str] = []
    yaml_path = skill_dir / "agents" / "openai.yaml"
    if not yaml_path.exists():
        return [f"{yaml_path}: Thiếu file metadata giao diện agents/openai.yaml"]

    try:
        data = yaml.safe_load(yaml_path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        return [f"{yaml_path}: Lỗi cú pháp YAML: {exc}"]

    if not isinstance(data, dict) or not isinstance(data.get("interface"), dict):
        return [f"{yaml_path}: Thiếu khối 'interface:' hợp lệ"]

    interface = data["interface"]
    display_name = interface.get("display_name")
    short_desc = interface.get("short_description")
    default_prompt = interface.get("default_prompt")

    if not isinstance(display_name, str) or not display_name.strip():
        errors.append(f"{yaml_path}: Thiếu 'interface.display_name'")

    if not isinstance(short_desc, str) or not short_desc.strip():
        errors.append(f"{yaml_path}: Thiếu 'interface.short_description'")
    elif not (25 <= len(short_desc) <= 64):
        errors.append(
            f"{yaml_path}: 'interface.short_description' phải dài 25–64 ký tự (hiện tại {len(short_desc)}): {short_desc!r}"
        )

    expected_mention = f"${skill_name}"
    if not isinstance(default_prompt, str) or expected_mention not in default_prompt:
        errors.append(
            f"{yaml_path}: 'interface.default_prompt' phải nhắc đúng '{expected_mention}'"
        )

    for icon_key in ("icon_small", "icon_large"):
        icon_val = interface.get(icon_key)
        if icon_val:
            icon_path = (skill_dir / icon_val).resolve()
            if not icon_path.exists():
                errors.append(f"{yaml_path}: Khai báo {icon_key}='{icon_val}' nhưng file không tồn tại")

    if "dependencies" in data and data["dependencies"]:
        errors.append(f"{yaml_path}: Không được khai báo dependencies không có triển khai thật")

    return errors


def validate_single_skill(skill_dir: Path) -> Tuple[str | None, List[str]]:
    errors: List[str] = []
    skill_md = skill_dir / "SKILL.md"
    if not skill_md.exists():
        return None, [f"{skill_dir}: Thiếu tệp bắt buộc SKILL.md"]

    raw = skill_md.read_text(encoding="utf-8")
    meta, body, fm_err = extract_frontmatter(raw)
    if fm_err or meta is None:
        return None, [f"{skill_md}: {fm_err}"]

    unexpected = set(meta.keys()) - ALLOWED_FRONTMATTER_KEYS
    if unexpected:
        errors.append(
            f"{skill_md}: Trường frontmatter không được hỗ trợ: {', '.join(sorted(unexpected))}"
        )

    if meta.get("allowed-tools"):
        errors.append(
            f"{skill_md}: Không khai báo 'allowed-tools' cho các công cụ không có triển khai thực tế trong skill"
        )

    name = meta.get("name")
    if not isinstance(name, str) or not name.strip():
        errors.append(f"{skill_md}: Thiếu trường 'name'")
    else:
        name = name.strip()
        if name != skill_dir.name:
            errors.append(
                f"{skill_md}: 'name' ({name}) không khớp với tên thư mục ({skill_dir.name})"
            )
        if not re.match(r"^[a-z0-9-]+$", name) or name.startswith("-") or name.endswith("-") or "--" in name:
            errors.append(
                f"{skill_md}: 'name' ({name}) phải dùng chữ thường, số và dấu gạch ngang đơn"
            )
        if len(name) > MAX_NAME_LENGTH:
            errors.append(f"{skill_md}: 'name' vượt quá {MAX_NAME_LENGTH} ký tự")

    desc = meta.get("description")
    if not isinstance(desc, str) or not desc.strip():
        errors.append(f"{skill_md}: Thiếu trường 'description'")
    else:
        desc = desc.strip()
        if "<" in desc or ">" in desc:
            errors.append(f"{skill_md}: 'description' không được chứa ký tự '<' hoặc '>'")
        if len(desc) > MAX_DESC_LENGTH:
            errors.append(
                f"{skill_md}: 'description' quá dài ({len(desc)} > {MAX_DESC_LENGTH} ký tự)"
            )

    if not body.strip():
        errors.append(f"{skill_md}: Phần nội dung hướng dẫn đang trống")
    else:
        prose_body = strip_code_fences(body)
        low_body = prose_body.lower()
        effective_name = name if isinstance(name, str) and name else skill_dir.name
        if effective_name in UNI_STAGE1_SET:
            for sec_num in range(1, 15):
                if not re.search(rf"^##\s+{sec_num}\.\s+\S+", prose_body, re.MULTILINE):
                    errors.append(
                        f"{skill_md}: Thiếu mục bắt buộc '## {sec_num}. ...' theo chuẩn 14 phần đa ngành"
                    )
            for req_label, pat in [
                ("bản đồ tiên quyết rút gọn", r"tiên quyết"),
                ("chuẩn đầu ra bằng động từ quan sát được", r"giải thích|phân tích|tính toán|chứng minh|thiết kế|triển khai|kiểm chứng|so sánh|phản biện|tái lập"),
                ("ma trận lỗi 6 cột", r"\|\s*dấu hiệu\s*\|\s*cách hiểu sai\s*\|\s*nguyên nhân\s*\|\s*quy tắc đúng\s*\|"),
                ("chế độ hoạt động không có công cụ (standalone)", r"không có công cụ"),
                ("chế độ tận dụng công cụ khi có (workspace)", r"tận dụng công cụ"),
            ]:
                if not re.search(pat, low_body):
                    errors.append(f"{skill_md}: Thiếu quy chuẩn {req_label}")
        else:
            for sec_num in range(1, 11):
                if not re.search(rf"^##\s+{sec_num}\.\s+\S+", prose_body, re.MULTILINE):
                    errors.append(
                        f"{skill_md}: Thiếu mục bắt buộc '## {sec_num}. ...' theo chuẩn 10 phần dùng chung"
                    )
            for req_label, pat in [
                ("phân loại Loại A (cẩm nang/ôn tập nhiều chương)", r"loại a\b"),
                ("phân loại Loại B (chẩn đoán/gợi mở)", r"loại b\b"),
                ("phân loại Loại C (giải đầy đủ/phản biện)", r"loại c\b"),
                ("phân loại Loại D (@canvas/học liệu tương tác)", r"loại d\b.*canvas|@canvas"),
            ]:
                if not re.search(pat, low_body):
                    errors.append(f"{skill_md}: Thiếu quy chuẩn {req_label}")

    for sub in skill_dir.rglob("*"):
        if sub.is_dir() and not any(sub.iterdir()):
            errors.append(f"{sub}: Thư mục rỗng bên trong skill (chỉ tạo khi có tài nguyên thật)")

    for md_file in skill_dir.rglob("*.md"):
        errors.extend(check_placeholders_and_rules(md_file))
        errors.extend(check_links_and_self_containment(md_file, skill_dir))

    errors.extend(validate_openai_yaml(skill_dir, name or skill_dir.name))

    return (name if isinstance(name, str) else skill_dir.name), errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate THPT Agent Skills repository.")
    parser.add_argument(
        "--root",
        default=str(Path(__file__).resolve().parent.parent),
        help="Repository root containing skills/ directory",
    )
    parser.add_argument(
        "--skills-dir",
        default=None,
        help="Explicit directory containing skill folders (defaults to <root>/skills)",
    )
    parser.add_argument(
        "--allow-subset",
        action="store_true",
        help="Allow validating a subset of skills (useful when testing single-skill install)",
    )
    args = parser.parse_args()

    repo_root = Path(args.root).resolve()
    skills_dir = Path(args.skills_dir).resolve() if args.skills_dir else (repo_root / "skills")

    all_errors: List[str] = []

    if (repo_root / "SKILL.md").exists():
        all_errors.append(
            f"{repo_root / 'SKILL.md'}: Không được đặt SKILL.md tại repository root vì CLI có thể chỉ phát hiện một skill"
        )

    if not skills_dir.exists() or not skills_dir.is_dir():
        print(f"[ERROR] Không tìm thấy thư mục skills tại: {skills_dir}")
        return 1

    skill_dirs = sorted([p for p in skills_dir.iterdir() if p.is_dir()], key=lambda p: p.name)
    found_names: List[str] = []

    for sdir in skill_dirs:
        name, errs = validate_single_skill(sdir)
        if name:
            found_names.append(name)
        all_errors.extend(errs)

    if not args.allow_subset:
        if len(found_names) != len(set(found_names)):
            all_errors.append(f"{skills_dir}: Phát hiện tên skill bị trùng lặp: {found_names}")

        missing = sorted(set(EXPECTED_SKILLS) - set(found_names))
        extra = sorted(set(found_names) - set(EXPECTED_SKILLS))
        if missing:
            all_errors.append(f"{skills_dir}: Thiếu skill bắt buộc: {', '.join(missing)}")
        if extra:
            all_errors.append(f"{skills_dir}: Phát hiện thư mục skill ngoài danh sách chuẩn: {', '.join(extra)}")

    print(f"Scanned directory: {skills_dir}")
    print(f"Found {len(skill_dirs)} skill folders.")

    if all_errors:
        print(f"\n[FAIL] Phát hiện {len(all_errors)} lỗi:")
        for err in all_errors:
            print(f"  - {err}")
        return 1

    print(f"[PASS] Toàn bộ {len(skill_dirs)} skills đều hợp lệ 100%!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
