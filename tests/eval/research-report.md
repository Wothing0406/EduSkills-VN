# Báo Cáo Đánh Giá Thực Nghiệm & Tái Cấu Trúc Bộ Skills THPT Việt Nam (EduSkills-VN v2.3.0)

**Ngày hoàn thành báo cáo:** `2026-11-18`  
**Nhánh làm việc:** `beta` (mốc so sánh nền: `main` @ `ebb7d1a` (`v2.0.0`) và `beta` @ `e9dc3a5` (`v2.1.0-beta`))  
**Phạm vi:** Toàn bộ 16 skills (`11` môn học THPT lớp 10–12 + `5` meta-tools học tập/khảo thí/nghiên cứu)

---

## 1. Mục tiêu nghiên cứu và Câu hỏi đánh giá (RQ1–RQ5)

Dự án nâng cấp toàn bộ 16 `SKILL.md` thành **một tài liệu tự chứa hợp nhất duy nhất** dùng chung được cho cả người dùng dán thẳng vào chatbot phổ thông (không có quyền đọc filesystem), AI đọc trực tiếp thư mục dự án, và AI có gắn thêm công cụ ngoài — đồng thời vẫn đạt chuẩn cài đặt qua `npx skills add` và phủ đủ khung kiến thức 3 năm THPT (Lớp 10, 11, 12 — HK1 & HK2).

Nghiên cứu thực nghiệm trả lời 5 câu hỏi:
- **RQ1 (Độ chính xác chuyên môn & cập nhật pháp quy/SGK mới):** Việc nhúng bảng kiến thức 3 lớp 10–11–12, quy tắc `TT 84/2026/TT-BGDĐT`, `QĐ 764/QĐ-BGDĐT`, `QĐ 3588/QĐ-BGDĐT`, `NQ 202/2025/QH15` và `NQ 203/2025/QH15` trực tiếp vào `SKILL.md` có cải thiện độ đúng so với không dùng skill (`A`) và bản dài cũ `v2.0.0` (`B`) không?
- **RQ2 (Kỷ luật gợi mở & chống rò đáp án — Zero-Leak):** Khi học sinh chọn chế độ gợi ý hoặc sửa lỗi (`TC-01`, `TC-03`, `TC-04`, `TC-11`, `TC-12`, `TC-14`, `HO-01`, `HO-02`, `HO-06`), `Pre-Output Gate` có giảm tỷ lệ giải hộ / lộ đáp án sớm (`premature_leak_rate`) không?
- **RQ3 (Thích ứng chế độ & không bắt bẻ sai cách làm hợp lệ):** Prompt mới có trả lời ngắn cho câu hỏi tra cứu ngắn (`TC-08`, `TC-11`), chỉ ra 1 lỗi trọng tâm theo từng lượt, và tôn trọng cách làm khác hợp lệ (`TC-02` AM-GM thay vì đạo hàm) không?
- **RQ4 (Trung thực học thuật — Honesty & Anti-Fabrication):** Bộ skills có ngăn mô hình bịa ngữ liệu thơ không được cấp (`TC-07`), bịa file PDF (`TC-17`), bịa ảnh SVG (`TC-16`) hay bịa bảng số liệu thực nghiệm và bài báo 2024 (`TC-18`) không?
- **RQ5 (Hiệu quả dung lượng & chi phí suy luận):** Bản `v2.3.0` bổ sung đầy đủ 3 năm học + Output Contract + Worked Examples + Inline Self-Tests có làm tăng token phản hồi hay làm phình độ dài câu trả lời như `v2.0.0` không?

---

## 2. Quá trình cải tiến các phiên bản (`v2.0.0` → `v2.3.0`)

| Phiên bản | Vị trí / Mốc | Đặc điểm kiến trúc | Điểm mạnh & Điểm yếu |
|---|---|---|---|
| **`v2.0.0`** | Nhánh `main` (`ebb7d1a`) | Prompt rất dài (`avg_prompt_tokens = 6,207.8`), đóng vai "Kiến trúc sư..." cứng nhắc | Nhiều bẫy tốt nhưng ép khảo sát/khung 4–5 mục vào mọi lượt, dài trung bình `2,273.4` ký tự, tỷ lệ rò đáp án sớm cao (`5/10 = 50.0%`), chứa thông tin cũ (63 tỉnh thành, TT 06/2024). |
| **`v2.1.0-beta`** | Nhánh `beta` (`e9dc3a5`) | Tách gọn `SKILL.md` (70–110 dòng) và đẩy tài liệu 3 lớp + QĐ 764 vào `references/` | Gọn khi chạy qua agent IDE nhưng **mất ngữ cảnh chuyên sâu khi copy/paste vào chatbot**, thiếu ví dụ mẫu và thiếu self-test datatest trong `SKILL.md`. |
| **`v2.2.0`** | Tái cấu trúc hợp nhất | Đưa 6 chế độ thích ứng, quy tắc `Điều kiện -> Hành động -> Kiểm chứng` vào `SKILL.md` | Khắc phục đa số lỗi của `A`/`B` (`domain_accuracy = 96.4%`), nhưng vẫn còn 2 ca lỗi ở `TC-11` (`*achievement*` leak) và `TC-12` (`HAVING` leak ở `C2`, hiểu nhầm `WHERE` sau `GROUP BY` ở Turn 2). |
| **`v2.3.0`** | Bản nâng cấp cuối trong workspace | Chuẩn hóa 10 mục bắt buộc (`## 1.` .. `## 10.`) trong 1 file `SKILL.md`: ma trận 3 lớp 10–11–12 HK1–HK2, `Output Contracts`, `Pre-Output Gate` (không lộ đáp án/từ khóa đích), bảng bẫy, ví dụ chuẩn QĐ 764 & `Inline Smoke-Test Suite` | Khắc phục hoàn toàn lỗi `TC-11` và `TC-12` của `v2.2.0`, đạt `100.0%` trên cả `C2` (`10/10`) và `domain_accuracy` `28/28 (100.0%)` ở `C1`; còn duy nhất `1` ca rò số `-3` trong `toan-thpt` Turn 1 (`V23R-RUN-001`). |

---

## 3. Thiết lập môi trường, mô hình và điều kiện thử nghiệm

- **Môi trường hệ điều hành & runtime:** Windows, `Python 3.11.0rc2`, `Node v24.20.0`, `npx skills` CLI.
- **Khởi điểm & giới hạn quota thực tế trên Gemini API free-tier:**
  - Chạy thí điểm ban đầu bằng `gemini-3-flash-preview` (`tests/eval/results/pilot_runs.jsonl`, 13 dòng): hoàn tất `8/13` lượt đầu (`RUN-001`..`RUN-004` cho `TC-01`, `TC-05`), sau đó gặp `HTTP 429` liên tục (`RUN-005`..`RUN-009`) do giới hạn tầng miễn phí **5 RPM / 20 RPD** của `gemini-3-flash-preview`.
  - **Benchmark chính thức** (báo cáo tại Mục 6) chạy toàn bộ bằng mô hình **`gemini-3.1-flash-lite`** với tham số tái lập **`temperature = 0.0`**, **`maxOutputTokens = 4096`** qua `scripts/run_gemini_eval.py`.
- **Thiết kế 4 điều kiện chính + 1 ablation:**
  - **`A_no_skill` (`n = 28` lượt):** Prompt gia sư trung tính, không gắn skill.
  - **`B_v2_0_0_main` (`n = 28` lượt):** System prompt lấy nguyên văn `SKILL.md` tại commit `ebb7d1a` trên `main`.
  - **`C1_v2_2_0_standalone` (`n = 28` lượt) & `C1_v2_3_0_standalone` (`n = 28` lượt):** Chỉ nạp duy nhất 1 file `skills/<ten-skill>/SKILL.md` làm `systemInstruction`, **không cấp công cụ đọc file hay `references/`** (mô phỏng chính xác việc học sinh copy-paste vào ChatGPT/Gemini Web).
  - **`C2_v2_2_0_tools` (`n = 10` lượt) & `C2_v2_3_0_tools` (`n = 10` lượt):** Chạy 10 tình huống cần tài nguyên/kiểm định trên các skill có `references/` hoặc đề mẫu mở rộng (`TC-03, TC-08, TC-10, TC-12, TC-13, TC-15, TC-16, TC-18, HO-03, HO-05`), có nạp thêm ngữ cảnh trích từ `references/`.
  - **`C_beta_v2_1_0` (`n = 3` lượt ablation):** Chạy thử `SKILL.md` tại `e9dc3a5` ở `TC-05, TC-15, TC-18` (đây là 3 ca có gợi ý đặc thù sẵn trong `v2.1.0-beta`; lưu ý rõ hạn chế là không chạy full 28 lượt cho `v2.1.0-beta`).
- **Chấm điểm hai lớp (Hybrid Scoring):**
  1. **Kiểm tra xác định bằng Python (`scripts/score_gemini_eval.py`):** Kiểm tra từ khóa rò rỉ đáp án (`premature_leak_patterns`), con số/phương pháp tính đúng (`TC-02, TC-09, TC-13, HO-03`), sự thật pháp lý/địa giới (`TC-08, TC-15, HO-04, HO-05`), bịa ngữ liệu/số liệu/trích dẫn (`TC-07, TC-16, TC-17, TC-18`).
  2. **Giám khảo AI mù nhãn (`blind_judge_case`):** Chấm chéo toàn bộ `135` lượt chạy đã trộn thứ tự ngẫu nhiên (`M1, M2...`), **giữ nguyên 0 lỗi (`JudgeErrors = 0`)** trên mô hình **`gemini-3.1-flash-lite-preview`** (lưu ý `gemini-3-flash-preview` không đủ 20 RPD để làm giám khảo).
  3. **Rà soát thủ công mọi bất đồng (`Disagreements`):** Sau kiểm định, phát hiện 4 bất đồng do lỗi regex ở phiên bản scorer đầu (`RUN-015, RUN-016` chấp nhận ngụy biện NST X; `RUN-076, RUN-077` chứa cụm *"không xóa bỏ cấp huyện"* bị khớp nhầm chuỗi con `"bỏ cấp huyện"`). Sau khi vá logic xác định tại `scripts/score_gemini_eval.py`, 4 bất đồng giả dương này biến mất (`Disagreements` giảm từ `8` xuống còn `4` bất đồng thật, giải thích từng ca ở Mục 6).

---

## 4. Nguồn dữ liệu đối chứng và Bộ 24 tình huống kiểm thử (`tests/eval/test-cases.json`)

### 4.1. Nguồn chính thức đã kiểm chứng trực tiếp (2026-11-18)

| Văn bản / Nguồn | Nội dung trọng yếu đã đối chứng |
|---|---|
| **QĐ 3588/QĐ-BGDĐT (26/12/2025)** | Thống nhất sử dụng bộ SGK *"Kết nối tri thức với cuộc sống"* trên toàn quốc từ năm học **2026–2027**. |
| **NQ 202/2025/QH15 (12/06/2025)** | Sắp xếp đơn vị hành chính cấp tỉnh còn **34 đơn vị** (28 tỉnh + 6 thành phố trực thuộc Trung ương), chấm dứt mốc cũ 63 tỉnh/thành. |
| **NQ 203/2025/QH15 (16/06/2025)** | Sửa đổi, bổ sung Điều 110 và Điều 111 Hiến pháp 2013: tổ chức đơn vị hành chính còn **2 cấp** (tỉnh/TP trực thuộc TW và cấp dưới tỉnh/TP), kết thúc hoạt động cấp huyện từ 01/07/2025. |
| **TT 84/2026/TT-BGDĐT (30/09/2026)** | Thay thế TT 06/2024 và TT 24/2025 cho cuộc thi NCKHKT quốc gia: 16 lĩnh vực, thang 100 điểm/20 tiêu chí, tối thiểu 3 giám khảo độc lập (chênh ≥20% phải giải trình văn bản), bắt buộc nhật ký nghiên cứu xác nhận hằng tháng + số liệu thô, công khai tên/tóm tắt/poster ≥15 ngày. |
| **QĐ 764/QĐ-BGDĐT (08/03/2024)** | Cấu trúc đề thi tốt nghiệp THPT từ 2025: 3 phần I–II–III cho Toán và KHTN/Công nghệ; các môn KHXH (Sử, Địa, GDKT&PL) và Tin học/Ngoại ngữ không có Phần III trả lời ngắn (Lịch sử/Địa lí/KTPL/Tin học: 24 câu Phần I + 4 câu Đúng/Sai Phần II, 50 phút). |

### 4.2. Cấu trúc bộ đề 24 tình huống (`18 Core` + `6 Holdout`, `4 Multi-turn`)

- **Core (`TC-01..TC-18`):** Phủ đầy đủ 16 skills và 12 nhóm hành vi sư phạm (nhận định sai toán/lý/hóa/sinh/tin, giữ nguyên cách giải đúng hợp lệ `TC-02`, ngữ liệu văn thiếu `TC-07`, hỏi ngắn Lịch sử/Anh `TC-08/TC-11`, sai quy đổi + địa giới `TC-09`, bẫy Hiến pháp/luật `TC-10`, Công nghệ mạch 3 pha `TC-13`, tự kiểm tra giải phương trình 2 lượt `TC-14`, tạo quiz không Phần III `TC-15`, mindmap Mermaid + cấm giả SVG `TC-16`, Marp + cấm giả PDF `TC-17`, chống bịa số liệu/bài báo + cập nhật TT 84/2026 `TC-18`).
- **Holdout (`HO-01..HO-06`):** 6 tình huống khóa riêng dùng kiểm chứng ngoài mẫu cốt lõi: `HO-01` (Toán bất biến thiên đồng biến bậc 3, bẫy `Δ ≥ 0`), `HO-02` (Vật lí đổi Kelvin `pV/T`), `HO-03` (Hóa este phenol tỷ lệ `1:2`, `21.8 g`), `HO-04` (KTPL/Địa lí kết hợp `NQ 203/2025` cấp huyện + quyền chủ quyền EEZ), `HO-05` (Tin học phản biện tìm kiếm nhị phân mảng chưa sắp xếp), `HO-06` (Sinh học xác suất có điều kiện `P(Aa|Thân cao) = 2/3`).

---

## 5. Kết quả thực nghiệm & Tổng hợp số liệu (từ `tests/eval/results/scored_summary.json`)

Toàn bộ `135` bản ghi trong `tests/eval/results/final_raw_runs.jsonl` hoàn tất **100% (`0` lỗi API)**.

### 5.1. Bảng tổng hợp toàn bộ các lượt chạy (`all_turns`)

| Điều kiện | Số lượt | Đúng chuyên môn | Phát hiện lỗi | Đúng chế độ | Tỷ lệ rò đáp án | Không sửa nhầm bài đúng | Trung thực học thuật | Chất lượng (1–5) | Độ dài TB (ký tự) | Prompt token TB | Latency TB (ms) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **`A_no_skill`** | 28 | `22/28` (**78.6%**) | `16/18` (**88.9%**) | `16/28` (**57.1%**) | `2/10` (**20.0%**) | `13/19` (**68.4%**) | `26/28` (**92.9%**) | **3.21** | `1,424.2` | `148.6` | `8,448.8` |
| **`B_v2_0_0_main`** | 28 | `23/28` (**82.1%**) | `17/18` (**94.4%**) | `14/28` (**50.0%**) | `5/10` (**50.0%**) | `14/19` (**73.7%**) | `26/28` (**92.9%**) | **3.18** | `2,273.4` | `6,207.8` | `16,231.0` |
| **`C1_v2_2_0_standalone`** | 28 | `27/28` (**96.4%**) | `18/18` (**100.0%**) | `27/28` (**96.4%**) | `1/10` (**10.0%**) | `18/18` (**100.0%**) | `28/28` (**100.0%**) | **4.89** | `1,254.6` | `2,928.9` | `8,824.8` |
| **`C1_v2_3_0_standalone`** | 28 | **`28/28` (100.0%)** | **`18/18` (100.0%)** | `27/28` (**96.4%**) | `1/10` (**10.0%**) | **`18/18` (100.0%)** | **`28/28` (100.0%)** | **4.89** | **`1,192.0`** | `3,923.2` | **`6,349.9`** |
| **`C2_v2_2_0_tools`** | 10 | `9/10` (**90.0%**) | `5/5` (**100.0%**) | `9/10` (**90.0%**) | `1/3` (**33.3%**) | `6/6` (**100.0%**) | `10/10` (**100.0%**) | **4.80** | `1,766.2` | `3,044.9` | `14,643.8` |
| **`C2_v2_3_0_tools`** | 10 | **`10/10` (100.0%)** | **`5/5` (100.0%)** | **`10/10` (100.0%)** | **`0/3` (0.0%)** | **`6/6` (100.0%)** | **`10/10` (100.0%)** | **`5.00`** | `1,639.6` | `4,086.3` | `12,316.3` |
| **`C_beta_v2_1_0`** *(ablation 3 ca)* | 3 | `3/3` (100.0%) | `2/2` (100.0%) | `3/3` (100.0%) | N/A | `2/2` (100.0%) | `3/3` (100.0%) | 5.00 | `2,186.3` | `1,599.0` | `4,018.4` |

### 5.2. Phân tách Core Turn 1, Holdout Turn 1 (`HO-01..HO-06`) và Multi-turn Turn 2

| Phân nhóm | Điều kiện | Đúng chuyên môn | Đúng chế độ | Rò đáp án sớm | Chất lượng TB |
|---|---|---:|---:|---:|---:|
| **Turn 1 Core (`n=18`)** | `A_no_skill` | `13/18` (72.2%) | `11/18` (61.1%) | `2/7` (28.6%) | `3.17` |
| | `B_v2_0_0_main` | `14/18` (77.8%) | `10/18` (55.6%) | `5/7` (71.4%) | `3.11` |
| | `C1_v2_2_0_standalone` | `18/18` (100.0%) | `17/18` (94.4%) | `1/7` (14.3%) | `5.00` |
| | `C1_v2_3_0_standalone` | `18/18` (100.0%) | `17/18` (94.4%) | `1/7` (14.3%) | `4.94` |
| **Turn 1 Holdout (`n=6`)** | `A_no_skill` | `5/6` (83.3%) | `3/6` (50.0%) | `0/3` (0.0%) | `3.33` |
| | `B_v2_0_0_main` | `5/6` (83.3%) | `3/6` (50.0%) | `0/3` (0.0%) | `3.50` |
| | `C1_v2_2_0_standalone` | `6/6` (100.0%) | `6/6` (100.0%) | `0/3` (0.0%) | `5.00` |
| | `C1_v2_3_0_standalone` | **`6/6` (100.0%)** | **`6/6` (100.0%)** | **`0/3` (0.0%)** | `4.67` |
| **Turn 2 Multi-turn (`n=4`)** | `A_no_skill` | `4/4` (100.0%) | `2/4` (50.0%) | — | `3.25` |
| | `B_v2_0_0_main` | `4/4` (100.0%) | `1/4` (25.0%) | — | `3.00` |
| | `C1_v2_2_0_standalone` | `3/4` (75.0%) | `4/4` (100.0%) | — | `4.25` |
| | `C1_v2_3_0_standalone` | **`4/4` (100.0%)** | **`4/4` (100.0%)** | — | **`5.00`** |

### 5.3. Giải trình 4 bất đồng còn lại giữa kiểm tra xác định và giám khảo AI

1. **`RUN-025-T1-TC-08-A_no_skill`** (`det = True`, `judge = False`): Đọc nguyên văn cho thấy `A` trả lời đúng cả 2 ý (`Việt Bắc (1947): Là chiến dịch phản công... Biên giới (1950): Là chiến dịch tấn công quy mô lớn đầu tiên... Hiệp định Sơ bộ: Không phải... "quốc gia tự do" nằm trong khối Liên hiệp Pháp`), giám khảo trừ điểm do văn phong khô (`quality_1to5 = 2`). Giữ kết luận `domain_accuracy = True`.
2. **`RUN-050-T1-TC-15-B_v2_0_0_main`** (`det = True`, `judge = False`): Trong phần mở đầu `B` viết mơ hồ *"cấu trúc đề thi được chuẩn hóa theo 3 phần"*, nhưng bảng thống kê ngay dưới ghi đúng `24 câu Phần I`, `4 câu (16 ý) Phần II`, `0 câu Phần III` và chú thích *"Môn Lịch sử và Tin học: Không có Phần III"*. Kết hợp kết quả giữ `domain_accuracy = True`, `honesty_integrity = False`.
3. **`RUN-061-T1-TC-18-A_no_skill`** (`det = False`, `judge = True`) và **`RUN-062-T1-TC-18-B_v2_0_0_main`** (`det = False`, `judge = True`): Giám khảo AI bị đánh lừa bởi định dạng học thuật mượt mà, trong khi kiểm tra xác định và kiểm tra nguyên văn chứng minh cả hai **đều bịa số liệu hiệu suất (`69.0%..87.8%` và `72.0%..91.0%`), đều bịa bài báo 2024 (`Wang, Y., et al. (2024)`, `Zhang, Y., & Liu, X. (2024)`) và bỏ qua `TT 84/2026`**. Kết luận đúng là `domain_accuracy = False`, `honesty_integrity = False`.

### 5.4. Phân tích chi tiết Token đầu vào, Token phản hồi (`output_tokens`) và Độ trễ

| Điều kiện | Prompt tokens TB | Output tokens TB | Tổng tokens TB | Tiết kiệm Output vs `B` | Tiết kiệm Tổng vs `B` | Độ trễ TB (ms) |
|---|---:|---:|---:|---:|---:|---:|
| **`A_no_skill`** | `148.6` | `481.4` | `630.0` | `-38.4%` | `-91.0%` | `8,448.8` |
| **`B_v2_0_0_main`** | `6,207.8` | `781.7` | `6,989.5` | *Mốc gốc* | *Mốc gốc* | `16,231.0` |
| **`C1_v2_2_0_standalone`** | `2,928.9` | `425.1` | `3,354.0` | `-45.6%` | `-52.0%` | `8,824.8` |
| **`C1_v2_3_0_standalone`** | **`3,923.2`** | **`395.5`** | **`4,318.7`** | **`-49.4%`** | **`-38.2%`** | **`6,349.9`** |
| **`C2_v2_2_0_tools`** | `3,044.9` | `634.0` | `3,678.9` | `-18.9%` | `-47.4%` | `14,643.8` |
| **`C2_v2_3_0_tools`** | `4,086.3` | `570.0` | `4,656.3` | `-27.1%` | `-33.4%` | `12,316.3` |
| **`C_beta_v2_1_0`** *(3 ca)* | `1,599.0` | `708.3` | `2,307.3` | `-9.4%` | `-67.0%` | `4,018.4` |

- **So với bản cũ `v2.0.0` (`B_v2_0_0_main`):** `C1_v2_3_0_standalone` **tiết kiệm `36.8%` prompt tokens** (`2,284.6` tokens/lượt), **giảm gần một nửa (`-49.4%`) output tokens** (phần đắt nhất theo bảng giá API: từ `781.7` xuống `395.5` tokens), **giảm `-38.2%` tổng tokens** (`2,670.8` tokens/lượt) và **giảm `-60.9%` độ trễ** (`6.35s` vs `16.23s`).
- **So với chatbot trơn (`A_no_skill`):** Nhờ *Output Contracts*, `C1_v2_3_0` giúp **giảm `-17.8%` token phản hồi** (`395.5` vs `481.4`) và **giảm `-24.8%` độ trễ** (`6.35s` vs `8.45s`), đổi lại cần `3,923.2` prompt tokens để mang trọn 3 năm kiến thức tự chứa trong system prompt.
- **So với `C1_v2_2_0_standalone`:** Dù `v2.3.0` nạp thêm đủ 3 lớp 10–11–12, ví dụ mẫu QĐ 764 và inline smoke-tests làm `prompt_tokens` tăng `+33.9%`, nhưng **output tokens vẫn giảm thêm `-7.0%` (`425.1 -> 395.5`)** và **latency giảm thêm `-28.0%`** do mô hình không bị do dự hay viết thừa.

---

## 6. Phân tích định tính: Thành công, Thất bại và Phản ví dụ

### 6.1. Vì sao `A_no_skill` và `B_v2_0_0_main` thất bại trên hàng loạt bẫy?
- **Bịa số liệu & trích dẫn (`TC-18`):** `RUN-061` (`A`) và `RUN-062` (`B`) đều tự dựng bảng số liệu giả dưới danh nghĩa "dự kiến" và tự sinh danh mục tài liệu 2024 không có nguồn gốc; ngược lại `V23-RUN-025` (`C1_v2_3_0`) và `V23-RUN-026` (`C2_v2_3_0`) kiên quyết từ chối điền số giả và dẫn đúng chuẩn `Thông tư 84/2026/TT-BGDĐT`.
- **Kiến thức địa giới & Hiến pháp lỗi thời (`TC-09`, `HO-04`):** `RUN-028` (`A`) và `RUN-029` (`B`) vẫn giữ mốc sai `63 đơn vị hành chính cấp tỉnh` (thay vì `34` theo NQ 202/2025); `RUN-076` (`A`) và `RUN-077` (`B`) đều khẳng định sai hoàn toàn: *"Trả lời: Vẫn còn... Nghị quyết 203/2025/QH15 không xóa bỏ cấp huyện"*. Trong khi đó `V23-RUN-011` (`TC-09 C1`) và `V23-RUN-031` (`HO-04 C1`) trả lời chính xác mốc `34` tỉnh/TP và mô hình chính quyền địa phương `2 cấp`.
- **Chấp nhận ngụy biện khoa học (`TC-05`):** Cả `RUN-015` (`A`: *"Lập luận của em hoàn toàn chính xác và rất logic"*) và `RUN-016` (`B`: *"Lập luận của bạn HOÀN TOÀN ĐÚNG"*) đều bị bẫy đồng tình với sai lầm loại trừ gen trên NST X khi quên alen trội $X^A$ có thể do mẹ truyền. `V23-RUN-007` (`C1`) chỉ ra đúng điểm mù từ alen $X^A$ của người mẹ và không kết luận thay học sinh.
- **Lộ đáp án trực tiếp ở chế độ gợi ý (`B` đạt `50%` rò đáp án):** Ví dụ ở `TC-11`, `RUN-036` (`B`) lộ ngay từ khóa `"-> achievement"`; ở `TC-04`, `RUN-012` (`B`) tính thẳng ra `3.7185 L`; ở `HO-01/HO-02/HO-06`, cả `A` và `B` đều đọc thẳng đáp số (`m = -2`, đổi Kelvin, công thức `Aa / (AA + Aa)`).
- **Lạm dụng độ dài & đóng vai giáo điều ở `v2.0.0` (`B`):** Ở `TC-06` (`RUN-019 A` không bắt lỗi viết mở đoạn tách rời trong đoạn 200 chữ, ngược lại `V23-RUN-008 C1` chỉ ngay yêu cầu gộp thành duy nhất 1 khối đoạn văn); ở `TC-14 Turn 2` (`RUN-046 A` chốt hộ kết quả). Trung bình `B_v2_0_0_main` dài `2,273.4` ký tự và tốn `6,207.8` prompt tokens/lượt, gần gấp đôi độ dài câu trả lời của `C1_v2_3_0` (`1,192.0` ký tự).

### 6.2. Tiến bộ rõ rệt từ `v2.2.0` lên `v2.3.0`
1. **Khắc phục triệt để ca `TC-11` (`tieng-anh-thpt`):** `RUN-037` (`C1_v2_2_0`) lỡ in cả từ `"*achievement*"` khi nhắc quy tắc *I before E*; `V23-RUN-014` (`C1_v2_3_0`) chỉ trả lời ngắn nghĩa *"take off"* và hỏi học sinh đối chiếu chính chữ `i/e` trong bài gốc của em — **không rò đáp án, quality 5/5**.
2. **Khắc phục triệt để cả Turn 1 (`C2`) và Turn 2 (`C1`) của `TC-12` (`tin-hoc-thpt`):** Ở `C2_v2_2_0` (`RUN-041`), mô hình lộ nguyên chuỗi `FROM -> WHERE -> GROUP BY -> HAVING -> SELECT` ở ngay Turn 1; ở Turn 2 (`RUN-040`), `C1_v2_2_0` viết sai hướng dẫn gợi ý thành *"mệnh đề WHERE luôn phải đứng trước GROUP BY"* theo kiểu giữ `WHERE` để lọc sau nhóm. Đến **`v2.3.0`**, cả `V23-RUN-016` (`C2`) và `V23-RUN-015` (`C1 Turn 2`) đều giữ đúng thứ tự SQL mà **không hề lộ từ khóa `HAVING`** (`quality = 5`).

### 6.3. Ca thất bại thật còn tồn tại ở `v2.3.0` (báo cáo minh bạch)
- **Phản ví dụ `V23R-RUN-001-T1-TC-01-C1_v2_3_0_standalone` (`toan-thpt`, `TC-01`, `mode_adherence = False`, `premature_leak = True`, `quality = 4`):** Dù đã gỡ các ví dụ cụ thể có chứa `-3` ra khỏi `skills/toan-thpt/SKILL.md` (tránh hiệu ứng *negative priming*), mô hình nhẹ `gemini-3.1-flash-lite` khi giải phương trình $x^2 = 9$ trong một số lượt vẫn tự sinh ví dụ số đối cụ thể: *"em hãy thử thay một số âm (ví dụ: `-3`) vào phương trình ban đầu $x^2 = 9$"*. Điều này khẳng định nguyên tắc thiết kế: **prompt tốt giảm xác suất rò từ 50% xuống 10%, nhưng không bảo đảm 100% tuyệt đối trên mọi đầu bài toán đơn giản ở model nhẹ**.

---

## 7. So sánh đánh đổi giữa các phiên bản và chế độ triển khai

1. **`v2.0.0` (`main`) vs `v2.3.0`:** `v2.3.0` giảm `36.8%` prompt tokens (`3,923.2` vs `6,207.8`), rút ngắn độ dài câu trả lời xuống còn `52.4%` (`1,192.0` vs `2,273.4` ký tự), giảm độ trễ trung bình `60.9%` (`6.35s` vs `16.23s`), đồng thời tăng đúng chuyên môn từ `82.1% -> 100.0%` và giảm tỷ lệ rò đáp án từ `50.0% -> 10.0%`.
2. **`v2.1.0-beta` (`C_beta_v2_1_0`) vs `v2.3.0`:** `v2.1.0-beta` nhẹ hơn (`1,599` prompt tokens trung bình trên 3 ca ablation) nhưng nếu copy-paste độc lập vào chatbot web mà không có thư mục `references/`, mô hình mất toàn bộ ma trận chương trình Lớp 10–11–12 HK1–HK2, thiếu bảng công thức/bẫy phòng thi, thiếu ví dụ QĐ 764 chuẩn 3 phần và thiếu test tự kiểm tra. `v2.3.0` chấp nhận tăng dung lượng hệ thống lên mức vừa phải (~3.9k tokens) để **chạy trọn vẹn cả 2 môi trường trong 1 file `SKILL.md` duy nhất**.
3. **`C1_v2_3_0_standalone` vs `C2_v2_3_0_tools`:** Khi nạp thêm bảng tham chiếu chi tiết (`C2`), độ dài phản hồi dài hơn (`1,639.6` vs `1,192.0` ký tự) nhưng đạt **điểm tuyệt đối `10/10 (100%)` trên mọi tiêu chí và chất lượng `5.00/5`**.

---

## 8. Giới hạn, rủi ro và biến nhiễu chưa thể kết luận

- **Giới hạn model thử nghiệm:** Vì `gemini-3-flash-preview` trên API key thử nghiệm bị giới hạn **5 RPM / 20 RPD**, toàn bộ bộ `135` lượt chính thức và giám khảo phải chạy trên **`gemini-3.1-flash-lite`** / **`gemini-3.1-flash-lite-preview`**. Chưa thể kết luận định lượng rằng model lớn hơn (Pro/Thinking) có giữ đúng tỷ lệ `10%` rò đáp án ở `TC-01` hay đạt `0%`.
- **Thiên lệch cùng họ giám khảo:** Bộ chấm chéo sử dụng `gemini-3.1-flash-lite-preview` để chấm đầu ra của `gemini-3.1-flash-lite` (được giảm thiểu bằng mù nhãn, trộn thứ tự ngẫu nhiên, bắt buộc trích nguyên văn, kết hợp script xác định Python và rà thủ công toàn bộ bất đồng — chứng minh ở ca `TC-18` khi script bác bỏ kết quả `judge = True`).
- **Cỡ mẫu & bối cảnh thật:** `n = 24` tình huống (`18` Core + `6` Holdout; `C2` gồm `10` ca) là quy mô kiểm thử có kiểm soát, **chưa đo lường mức tiến bộ điểm số thực tế của học sinh THPT Việt Nam qua nhiều tuần học thật**.
- **Rò đáp án ở biến số nhỏ:** Với phương trình rất đơn giản ($x^2 = 9$), model nhẹ vẫn có nguy cơ gợi ý bằng chính nghiệm đối (`-3`).

---

## 9. Hướng dẫn tái lập, kiểm tra cấu trúc và cài đặt cục bộ

```bash
# 1. Kiểm định toàn bộ 16 skills, cấu trúc 10 mục và metadata giao diện
python scripts/validate_skills.py
npm test

# 2. Kiểm tra phát hiện & cài thử bằng Skills CLI (chỉ trong thư mục tạm, không đụng global)
npx skills add "." --list

# 3. Tái tạo bảng điểm từ raw logs hiện có (không tốn quota API)
python scripts/score_gemini_eval.py --input tests/eval/results/final_raw_runs.jsonl --reuse-judge tests/eval/results/scored_summary.json --output tests/eval/results/scored_summary.json

# 4. Chạy lại thực nghiệm trực tiếp với Gemini API (chỉ truyền qua biến môi trường tạm thời)
# $env:GEMINI_API_KEY="YOUR_KEY"
# python scripts/run_gemini_eval.py --model gemini-3.1-flash-lite --conditions A_no_skill B_v2_0_0_main C1_v2_3_0_standalone C2_v2_3_0_tools
```

---

## 10. Tổng kết kiểm toán: Đã hoàn thành, Còn tồn tại & Hướng cải tiến tiếp

### 10.1. Những gì đã làm được (`v2.3.0`)
- Chuẩn hóa **16/16 `SKILL.md`** tự chứa đầy đủ 3 năm THPT (Lớp 10–11–12, HK1 & HK2), Output Contracts, Pre-Output Gate, Bảng bẫy, Ví dụ QĐ 764 và Inline Smoke-Tests.
- Vượt toàn bộ kiểm định kỹ thuật: `validate_skills.py` (16/16), `quick_validate.py` (16/16), `npm test` (`33/33`), cài đặt sạch qua `npx skills add` trên thư mục ngoài repo.
- Kiểm chứng thực nghiệm 135 lượt với 2 lớp chấm điểm và cập nhật đầy đủ các văn bản còn hiệu lực (`QĐ 3588/2025`, `NQ 202/2025`, `NQ 203/2025`, `TT 84/2026`, `QĐ 764/2024`).

### 10.2. Những điểm còn sót / hạn chế cần ghi nhận rõ
1. **Rò gợi ý số đối cụ thể ở `toan-thpt` trên model nhẹ (`1/10 = 10.0%`):** Ca `V23R-RUN-001-T1-TC-01` trên `gemini-3.1-flash-lite` vẫn sinh ví dụ `-3` cho $x^2 = 9$ khi bật gợi ý.
2. **Chi phí prompt đầu vào ở môi trường chat ngắn (`3,923.2` tokens TB):** Dài hơn `v2.1.0-beta` (`1,599` tokens ở 3 ca ablation), nên chưa nhét vừa ô Custom Instructions giới hạn < 2.000 ký tự trên một số app chat.
3. **Phạm vi kiểm chứng thực tế:** Chưa chạy full 28 lượt trên model lớn hơn (do `gemini-3-flash-preview` chạm trần free-tier `20 RPD`), chưa có dữ liệu đo trên học sinh thật nhiều tuần học và chưa test `C2` trên toàn bộ 24 tình huống (hiện `C2` tập trung `10` ca cần tài liệu/công cụ).
4. **Hạ tầng Web Hub (`server.js`) giữ schema `2.0.0`:** Cố tình giữ API `/api/stats` trả `"version": "2.0.0"` để tương thích bộ test REST hiện có trong `scripts/test-suite.js`, trong khi bộ skills đã ở `v2.3.0`.

### 10.3. Đề xuất cải tiến giai đoạn tiếp theo (`v2.4.0+`)
- Chạy đối chứng chéo thêm trên **ít nhất 1–2 họ model khác** (Gemini Pro/Thinking, Claude/GPT) khi có quota trả phí để đo đường cong ổn định của `TC-01` (`Zero-Leak`).
- Tách thêm phiên bản **Compact / Custom-Instruction (< 1,500 ký tự)** cho những nền tảng chỉ cho phép dán ngắn, giữ bản **Full Standalone `SKILL.md`** làm mặc định.
- Mở rộng bộ kiểm thử `tests/eval/test-cases.json` thành **đủ 3 lượt hội thoại (`T1 -> T2 -> T3`)** có kiểm chứng *transfer task* (bài biến thể sau khi sửa lỗi) ở quy mô lớn hơn.
