# Báo Cáo Mở Rộng Đa Ngành Giai Đoạn 1: THPT $\to$ Đại Học $\to$ Nghiên Cứu

> **Tuyên bố phạm vi trung thực:** Phiên bản này hoàn thiện và kiểm chứng **16 skills THPT** (`v2.4.0`) **cộng thêm 8 skills Giai đoạn 1 bậc Đại học & Nghiên cứu** (`v1.0.0`, tổng cộng **`24` skills hoạt động thật trong `skills/`**). Dự án **KHÔNG** tuyên bố đã bao phủ đầy đủ mọi ngành học: các skill Giai đoạn 2 (`8` mục) và Lớp C/D (`14` nhóm ngành + chuyên ngành) chỉ nằm ở trạng thái **`planned`** trong [`catalog/skills-catalog.json`](../catalog/skills-catalog.json), tuyệt đối không tạo thư mục rỗng.

---

## 1. Bàn Giao Hiện Vật & Phân Tách 7 Trạng Thái Kiểm Chứng (Mục 21)

### 1.1. Bảng phân tách trạng thái trung thực (Không gộp lẫn lộn)

| Trạng thái kiểm chứng | Phạm vi áp dụng & Bằng chứng cụ thể |
|---|---|
| **1. Cấu trúc hợp lệ (`structurally-valid`)** | **24/24** skills (`16` THPT + `8` ĐH GĐ1) đạt `python scripts/validate_skills.py` (0 lỗi) và `npm test` (`36 PASSED \| 0 FAILED`), gồm YAML frontmatter, `agents/openai.yaml`, `references/`, 14 mục đa ngành (với ĐH) và 10 mục/`Loại A–D` (với THPT). |
| **2. Cài đặt thành công qua Skills CLI** | Xác minh `npx skills add "." --list` (`24 skills`), `npx skills add "." --skill giai-tich-dai-hoc --agent codex --copy --yes` (`1/1` skill + `agents/` + `references/` ngoài repo) và `--skill "*"` (`24/24` skill ngoài repo), `npx skills list` và `validate_skills.py` trên thư mục cài tạm đều **PASS 100%** (`npx skills` v`1.9.0`). Không cài global, không push hay xuất bản repository. |
| **3. Kiến thức & nguồn đã kiểm chứng** | Đã đối chứng trực tiếp qua tìm kiếm chính thức ngày `2026-11-18`: `Thông tư 08/2021/TT-BGDĐT` (tín chỉ ĐH), `OpenStax Calculus Vol. 1`, `MIT OCW 18.06 Linear Algebra`, `OpenStax Introductory Statistics`, `OpenStax Introduction to Python Programming`, `APA Style 7th Edition` (`apastyle.apa.org`), `Creswell & Creswell (Research Design)` cùng bộ pháp quy THPT (`QĐ 764`, `QĐ 3588`, `NQ 202/2025`, `NQ 203/2025`, `TT 84/2026`). Toàn bộ lưu kèm 9 trường truy vết trong [`catalog/skills-catalog.json`](../catalog/skills-catalog.json). |
| **4. Hành vi đã test (Thử nghiệm có kiểm soát)** | **THPT:** `135` lượt (`scored_summary.json`) + `25` lượt bảo toàn `v2.4.0` + `19` lượt hồi quy `REG-01..07`.<br>**Đa ngành GĐ1:** `48` lượt chạy thật `16` ca (`MD-01..MD-16`) $\times$ `3` điều kiện tách biệt trên `gemini-3.1-flash-lite` + `4` lượt hồi quy `MD-13` (`md13_after_fix.jsonl` & `md13_after_fix2.jsonl`), tổng `52` lượt sinh thật (`0` lỗi API sinh). |
| **5. Chuyên gia đã thẩm định (`expert-reviewed`)** | **CHƯA CÓ (`0/24`).** Chưa có giảng viên hay nhà nghiên cứu độc lập bên ngoài ký duyệt chuyên môn; do đó **không** gắn nhãn `expert-reviewed` cho bất kỳ skill nào. |
| **6. Dữ liệu sinh viên / lớp học thật** | **CHƯA CÓ (`0` lớp học thật).** Chưa có dữ liệu khảo sát học tập hay điểm số thực tế qua nhiều tuần trên sinh viên/học sinh thật. |
| **7. Kết quả chỉ mới mô phỏng** | Toàn bộ benchmark hiện tại (`MD-01..MD-16`) là thử nghiệm có kiểm soát qua API trên `gemini-3.1-flash-lite` (`T=0.0`), chưa thể suy rộng thành khẳng định tiến bộ học tập dài hạn của sinh viên ngoài đời thật. |

### 1.2. Danh mục hiện vật đã bàn giao trong repository

- **8 Skills Giai đoạn 1 (`skills/`):** [`chuyen-tiep-dai-hoc`](../skills/chuyen-tiep-dai-hoc/SKILL.md), [`hoc-dai-hoc-hieu-qua`](../skills/hoc-dai-hoc-hieu-qua/SKILL.md), [`giai-tich-dai-hoc`](../skills/giai-tich-dai-hoc/SKILL.md), [`dai-so-tuyen-tinh`](../skills/dai-so-tuyen-tinh/SKILL.md), [`xac-suat-thong-ke`](../skills/xac-suat-thong-ke/SKILL.md), [`lap-trinh-can-ban`](../skills/lap-trinh-can-ban/SKILL.md), [`viet-hoc-thuat`](../skills/viet-hoc-thuat/SKILL.md), [`phuong-phap-nghien-cuu`](../skills/phuong-phap-nghien-cuu/SKILL.md) (mỗi skill có đủ `SKILL.md`, `agents/openai.yaml`, `references/*.md`).
- **16 Skills THPT bảo toàn nguyên trạng:** Chi tiết kiểm toán & bảng hồi quy năng lực tại [`docs/10_KIEM_TOAN_BAO_TON_THPT.md`](10_KIEM_TOAN_BAO_TON_THPT.md).
- **Catalog & Đồ thị tiên quyết:** [`catalog/skills-catalog.json`](../catalog/skills-catalog.json), [`catalog/CATALOG.md`](../catalog/CATALOG.md), [`catalog/prerequisite-graph.json`](../catalog/prerequisite-graph.json), [`catalog/PREREQUISITE_MAP.md`](../catalog/PREREQUISITE_MAP.md).
- **Template & Quy trình 12 bước:** [`templates/university-skill-template/SKILL.md`](../templates/university-skill-template/SKILL.md), [`docs/11_QUY_TRINH_PHAT_TRIEN_SKILL_MOI.md`](11_QUY_TRINH_PHAT_TRIEN_SKILL_MOI.md).
- **Test case, Dữ liệu gốc, Rubric & Script:** [`tests/multidisciplinary/test-cases.json`](../tests/multidisciplinary/test-cases.json), [`tests/multidisciplinary/rubric.md`](../tests/multidisciplinary/rubric.md), [`scripts/run_multidisciplinary_eval.py`](../scripts/run_multidisciplinary_eval.py), [`scripts/score_multidisciplinary_eval.py`](../scripts/score_multidisciplinary_eval.py), [`scripts/aggregate_multidisciplinary_results.py`](../scripts/aggregate_multidisciplinary_results.py), dữ liệu chạy gốc tại [`tests/multidisciplinary/results/raw_runs_final.jsonl`](../tests/multidisciplinary/results/raw_runs_final.jsonl), [`scored_runs.jsonl`](../tests/multidisciplinary/results/scored_runs.jsonl), [`manual_audit_17.json`](../tests/multidisciplinary/results/manual_audit_17.json) và [`final_aggregated_summary.json`](../tests/multidisciplinary/results/final_aggregated_summary.json).

---

## 2. Kết Quả Thực Nghiệm Đa Ngành 3 Điều Kiện Tách Biệt (`MD-01..MD-16`)

Chạy trên `gemini-3.1-flash-lite` (`temperature = 0.0`, `maxOutputTokens = 4096`) với **3 điều kiện tách biệt** (không gộp điểm điều kiện A và B):
- **`baseline_no_skill` (`16` lượt):** Chatbot trơn không gắn `SKILL.md`.
- **`cond_A_standalone` (`16` lượt):** Chỉ dán duy nhất file `SKILL.md` (không đọc `references/`, không công cụ).
- **`cond_B_workspace_tools` (`16` lượt):** Có `SKILL.md` + `references/*.md` + kết quả kiểm chứng xác định Python/tính toán/kiểm tra dữ liệu/chính sách.

> **Ghi chú phương pháp chấm minh bạch:** Trong `48` lượt cuối cùng (`raw_runs_final.jsonl`), giám khảo AI mù nhãn (`gemini-3.1-flash-lite-preview`) đã chấm được **`31/48`** lượt trước khi API key thử nghiệm chạm trần **500 requests/day Free Tier** (`HTTP 429 RESOURCE_EXHAUSTED`). **`17/48`** lượt còn lại được giữ tách biệt rõ trong [`manual_audit_17.json`](../tests/multidisciplinary/results/manual_audit_17.json) sau khi đọc nguyên văn toàn bộ câu trả lời trong [`missing_judge_17_dump.txt`](../tests/multidisciplinary/results/missing_judge_17_dump.txt). Dưới đây trình bày **cả 2 lớp số liệu tách biệt** từ [`final_aggregated_summary.json`](../tests/multidisciplinary/results/final_aggregated_summary.json):

### 2.1. Bảng tổng hợp tập con đã chấm bằng AI Judge + Kiểm tra xác định (`n = 31/48`)

| Chỉ số | `baseline_no_skill` (`n=8/16`) | `cond_A_standalone` (`n=11/16`) | `cond_B_workspace_tools` (`n=12/16`) |
|---|---:|---:|---:|
| **Độ đúng chuyên môn (`domain_accuracy`)** | `7/8` (**87.5%**) | **`11/11` (100.0%)** | **`12/12` (100.0%)** |
| **Phát hiện lỗi (`error_detection`)** | `4/4` (100.0%) | `5/6` (83.3%)* | `5/7` (71.4%)* |
| **Chẩn đoán đúng (`diagnosis_accuracy`)** | `4/4` (100.0%) | **`6/6` (100.0%)** | **`7/7` (100.0%)** |
| **Không sửa nhầm bài đúng (`no_false_correction`)** | `5/5` (100.0%) | **`7/7` (100.0%)** | **`8/8` (100.0%)** |
| **Tuân thủ chế độ (`mode_adherence`)** | `7/8` (87.5%) | **`11/11` (100.0%)** | **`12/12` (100.0%)** |
| **Chất lượng nguồn & trung thực (`source_integrity`)** | `7/8` (87.5%) | **`11/11` (100.0%)** | **`12/12` (100.0%)** |
| **Lỗi nghiêm trọng (`critical_error_rate`)** | `1/8` (**12.5%**) | **`0/11` (0.0%)** | **`0/12` (0.0%)** |
| **Chất lượng TB (`avg_quality_1to5`)** | `4.50` | **`5.00`** | **`5.00`** |

*\*Ghi chú trung thực: Ở `MD-RUN-031`, `034`, `035`, giám khảo AI chấm `domain_accurate = True` và `quality = 5`, nhưng đánh `error_detected = False` thay vì `null` trên các ca kiểm tra phạm vi/lập kế hoạch.*

### 2.2. Bảng tổng hợp toàn bộ `48/48` lượt (Kiểm tra xác định Python + Giám khảo AI + Kiểm tra thủ công `17` ca)

| Chỉ số | `baseline_no_skill` (`n=16`) | `cond_A_standalone` (`n=16`) | `cond_B_workspace_tools` (`n=16`) |
|---|---:|---:|---:|
| **Vượt qua kiểm tra xác định Python (`det_pass`)** | `15/16` (`93.8%`) | **`16/16` (`100.0%`)** | **`16/16` (`100.0%`)** |
| **Độ đúng chuyên môn (`domain_accuracy`)** | `14/16` (`87.5%`) | **`16/16` (`100.0%`)** | **`16/16` (`100.0%`)** |
| **Tuân thủ chế độ (`mode_adherence`)** | `14/16` (`87.5%`) | **`16/16` (`100.0%`)** | **`16/16` (`100.0%`)** |
| **Trung thực nguồn & không bịa đặt (`source_integrity`)** | `15/16` (`93.8%`) | **`16/16` (`100.0%`)** | **`16/16` (`100.0%`)** |
| **Lỗi nghiêm trọng (`critical_error_rate`)** | `1/16` (`6.2%`) | **`0/16` (`0.0%`)** | **`0/16` (`0.0%`)** |
| **Điểm chất lượng TB (`1–5`)** | `4.56` | **`5.00`** | **`5.00`** |
| **Prompt tokens TB / Output tokens TB / Latency TB** | `116.5` / `812.9` / `31.03s` | `3,960.6` / `892.7` / `12.30s` | `5,079.2` / `831.5` / `16.01s` |

### 2.3. Bằng chứng sửa lỗi theo chu trình 12 bước (Vòng 1 $\to$ Sau sửa `viet-hoc-thuat`)
- **Phát hiện thất bại ở Vòng 1 (`raw_runs.jsonl`):** Ở ca `MD-13` điều kiện `cond_A_standalone` (`MD-RUN-029`), dù mở đầu câu trả lời mô hình từ chối bịa DOI, trong đoạn văn chỉnh sửa bên dưới mô hình vẫn tự chèn **`(Nguyễn & Trần, 2025; Smith et al., 2025)`** (lỗi *negative priming* do chính câu cấm ví dụ trong `SKILL.md`).
- **Tương phản với Baseline (`MD-RUN-013`):** Chatbot không dùng skill **bịa hẳn 2 mã DOI giả năm 2025** (`10.1016/j.jeth.2025.01.004` và `10.1016/j.ijer.2025.02.012`), nhận điểm `critical_error = True`, `quality = 1`.
- **Khắc phục & Hồi quy (`md13_after_fix2.jsonl`):** Sau khi xóa cặp tác giả-năm minh họa khỏi quy tắc cấm trong `skills/viet-hoc-thuat/SKILL.md`, cả `cond_A_standalone` và `cond_B_workspace_tools` đều dùng đúng chỗ giữ trung tính `[Chèn nguồn đã xác minh]`, **0 DOI giả, 0 tên tác giả giả**, đạt `det_pass = 16/16 (100.0%)`.
- **Giá trị gia tăng của `cond_B_workspace_tools` so với `cond_A_standalone`:** Ở ca `MD-10` (dữ liệu thiếu `NA`), `cond_B` dùng kết quả Python tính chính xác sai lệch trung bình **`4.57 -> 4.00`** và hệ số tương quan tụt từ **`r = 0.99 -> 0.78`** khi điền bừa `NA = 0`, thay vì chỉ phê bình định tính như `cond_A`.

---

## 3. Lệnh Cài Đặt & Kiểm Tra Thực Tế (Không cài global, không push tự động)

```bash
# 1. Liệt kê toàn bộ 24 skills trong repo nguồn (16 THPT + 8 ĐH GĐ1)
npx skills add "." --list

# 2. Cài riêng 1 skill vào thư mục dự án đích (chạy trong thư mục dự án tạm/đích)
npx skills add "<SOURCE_PATH>" --skill giai-tich-dai-hoc --agent codex --copy --yes

# 3. Cài toàn bộ hệ thống vào thư mục dự án đích
npx skills add "<SOURCE_PATH>" --skill "*" --agent codex --copy --yes
npx skills list

# 4. Kiểm định cấu trúc & test tích hợp
python scripts/validate_skills.py
npm test
python scripts/aggregate_multidisciplinary_results.py
```

*(Lưu ý: Trên `npx skills` CLI `1.9.0`, tùy chọn `--agent codex` cài trực tiếp vào `.agents/skills/<ten-skill>/` theo cơ chế universal của Codex, và sao chép đầy đủ cả `SKILL.md`, `agents/` lẫn `references/`).*

---

## 4. Danh Sách Giới Hạn & Kế Hoạch Mở Rộng Tiếp Theo

1. **Chưa có `expert-reviewed` và chưa có dữ liệu sinh viên thật:** Toàn bộ `8` skill Giai đoạn 1 hiện dừng ở `behavior-tested`; cần mời giảng viên đại học đúng ngành (Toán, Tin, Ngôn ngữ/Nghiên cứu) thẩm định trước khi nâng lên `released` / `expert-reviewed`.
2. **Chạm trần quota API Free Tier khi chấm giám khảo:** API key thử nghiệm chạm giới hạn `500 RPD` của `gemini-3.1-flash-lite` sau `52` lượt sinh + `~48` lượt chấm tích lũy trong ngày, khiến `17/48` lượt chấm cuối chuyển sang kiểm tra thủ công (`manual_audit_17.json`) thay vì hoàn tất 100% qua API giám khảo.
3. **Baseline mạnh sẵn ở các bài đơn giản:** Trên `gemini-3.1-flash-lite`, chatbot trơn đã trả lời khá tốt trên nhiều câu hỏi giải tích/xác suất chuẩn (`14/16`), nên giá trị rõ rệt nhất của bộ skills nằm ở **chống bịa nguồn/DOI (`MD-13`)**, **kiểm soát ranh giới phạm vi (`MD-02`)**, **chuẩn hóa học liệu/lộ trình bù phẫu thuật (`MD-01`, `MD-07`)**, và **tính chính xác bằng công cụ (`MD-10` trong `cond_B`)**. Cần thiết kế thêm bộ test đa lượt (`T1 -> T2 -> T3`) khó hơn với dữ liệu CSV/Python thật ở Giai đoạn 2.
4. **Kế hoạch mở rộng tiếp theo (Chỉ thực hiện sau khi Giai đoạn 1 được chuyên gia thẩm định thêm nếu cần):**
   - **Giai đoạn 2 (`8` skills dự kiến):** `vat-li-dai-cuong`, `hoa-hoc-dai-cuong`, `sinh-hoc-dai-cuong`, `kinh-te-hoc-co-ban`, `doc-phan-bien-paper`, `phan-tich-du-lieu`, `thiet-ke-thi-nghiem`, `do-an-dai-hoc`.
   - **Giai đoạn 3:** Chọn `2–3` nhóm ngành Lớp C có nhu cầu cao nhất (ưu tiên *CNTT & KHMT*, *Toán & Khoa học dữ liệu*, *Kinh tế/Kỹ thuật*) dựa trên chất lượng nguồn mở đã xác minh, sau đó mới mở học phần Lớp D khi thỏa mãn đủ 6 điều kiện cổng vào.
