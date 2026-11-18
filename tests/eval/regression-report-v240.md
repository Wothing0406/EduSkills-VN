# Báo Cáo Sửa Suy Giảm Chức Năng & Kiểm Thử Hồi Quy (`v2.4.0`)

**Ngày kiểm chứng:** `2026-11-18`  
**Mô hình thực thi đối chứng:** `gemini-3.1-flash-lite` (`temperature = 0.0`, `maxOutputTokens = 8192` cho bộ hồi quy `REG-01..07`)  
**Dữ liệu gốc lưu trữ:**
- Trước khi sửa (`B_v2_0_0_main` @ `ebb7d1a`, `C1_v2_3_0_standalone`, `C2_v2_3_0_tools`): `tests/eval/results/regression_before_v230.jsonl`
- Sau khi sửa (`C1_v2_4_0_standalone`, `C2_v2_4_0_tools`): `tests/eval/results/regression_after_v240.jsonl` và `tests/eval/results/regression_reg01_retest.jsonl`
- Kiểm chứng bảo toàn hành vi Loại B / Core & Holdout (`C1_v2_4_0_standalone`): `tests/eval/results/v240_preservation_runs.jsonl` & `tests/eval/results/v240_preservation_summary.json`

---

## 1. Bảng So Sánh 6 Năng Lực (`v2.0.0` vs `v2.3.0` vs Khôi phục `v2.4.0`)

| Năng lực cốt lõi | Bản cũ `v2.0.0` (`ebb7d1a`) | Bản `v2.3.0` (trước sửa) | Bản khôi phục `v2.4.0` (hiện tại) |
|---|---|---|---|
| **1. Tổng hợp kiến thức theo phạm vi** | Có danh mục chương Lớp 10–12 nhưng chưa có cấu trúc cẩm nang 8 phần; hay phình ngoài phạm vi. | **Suy giảm rõ:** Rút gọn còn bảng 3 dòng HK1/HK2; `REG-01` & `REG-06` thiếu bản đồ/bẫy/đáp án, thậm chí dừng hỏi ngược *"Bạn ưu tiên phần nào nhất?"*. | **Khôi phục & nâng chuẩn:** Thêm bản đồ chi tiết theo **từng chương Lớp 10–12** và quy chuẩn **Loại A (Cẩm nang 8 phần)** đúng phạm vi (không tràn Polymer/Pin điện khi hỏi Ch.1–3). |
| **2. Lập bảng phân biệt & ma trận lỗi/bẫy** | Có bảng đối chiếu IUPAC và ma trận bẫy 4 cột phòng thi. | Chỉ giữ bảng bẫy 3 cột phục vụ hỏi-đáp sửa lỗi (`Bẫy \| Bản chất \| Câu hỏi chẩn đoán`); thiếu cặp phân biệt trong `REG-02`. | Giữ bảng chẩn đoán cho Loại B; bổ sung **Bảng phân biệt dễ nhầm** + **Ma trận bẫy 6 cột** (*Dấu hiệu $\to$ Hiểu sai $\to$ Nguyên nhân $\to$ Quy tắc $\to$ Ví dụ $\to$ Tự kiểm tra*), không quy kết HS mắc lỗi khi chưa có bài làm. |
| **3. Tạo ví dụ, câu hỏi, đáp án & giải thích** | Có đề mẫu 3 phần QĐ 764 đầy đủ hơn, nhưng hay ép cấu trúc tốt nghiệp hoặc tự đẻ hết đáp án sớm. | **Suy giảm ở ôn giữa kỳ:** `REG-03` ép đề **28 câu tốt nghiệp QĐ 764** cho ôn giữa kỳ và bỏ trống phần đáp án (*"gửi đáp án lại đây"*); `REG-05` bỏ giải thích vì sao phương án sai nghe hợp lý. | Phân tách **ôn giữa kỳ ≠ đề tốt nghiệp QĐ 764**; bài tự kiểm tra tách hoàn toàn đáp án xuống cuối (`<details>` / cuối đề), kèm gợi ý mở dần, **giải thích vì sao phương án sai có vẻ hợp lý**, câu phản ví dụ, biến thể & rubric tự đánh giá. |
| **4. Tạo cẩm nang hoặc sản phẩm tương tác (`@canvas`)** | Có HTML/Web Hub ở tầng repo, nhưng trong `SKILL.md` thiếu chuẩn `@canvas`. | **Thiếu hoàn toàn quy chuẩn `@canvas`** trong 16 `SKILL.md`; `REG-01` bỏ qua yêu cầu `@canvas`. | Bổ sung quy chuẩn **Loại D (`@canvas`)**: xuất **Single-File HTML5/JS** đa tab thật có nội dung, nút gợi ý/chấm điểm/làm lại, công thức HTML sạch (`<sub>/<sup>`), không công cụ giả; hoặc khai báo trung thực nếu chat văn bản thuần. |
| **5. Chẩn đoán bài làm & gợi mở (Loại B)** | Hay rò đáp án (`50%`) và viết lan man dài (`1,810` kt ở `REG-04`). | **Rất mạnh** (`872` kt ở `REG-04`, 0% lộ `21.8`), nhưng quy tắc *"1 câu hỏi rồi dừng"* bị tràn sang yêu cầu tổng hợp kiến thức. | **Giữ nguyên 100%** kỷ luật gợi mở, tách lỗi gốc–kéo theo & Zero-Leak, khoanh vùng quy tắc *"1 câu hỏi rồi dừng chờ"* **chỉ cho Loại B**. |
| **6. Phản biện & kiểm chứng (Loại C)** | Đôi khi bịa số liệu/trích dẫn (`TC-18`). | Mạnh về trung thực (`TT 84/2026`, `NQ 202/203`), nhưng `v2.3.0` giảm phân tích bẫy hợp lý ở `REG-05`. | Giữ 100% chống bịa đặt & cập nhật pháp quy mới; khôi phục phân tích vì sao phương án sai dễ đánh lừa kèm phản ví dụ điều kiện. |

---

## 2. Đối chứng Hồi quy Thực nghiệm (`REG-01` .. `REG-07`)

So sánh trên cùng mô hình `gemini-3.1-flash-lite` (`temperature = 0.0`, `maxOutputTokens = 8192`) giữa điều kiện chỉ dán `SKILL.md` (`C1`) và truy cập cả thư mục + `references/` (`C2`):

| Ca test | Yêu cầu | `B_v2_0_0_main` | `C1_v2_3_0` | `C2_v2_3_0` | `C1_v2_4_0` | `C2_v2_4_0` | Ghi chú kiểm chứng |
|---|---|---:|---:|---:|---:|---:|---|
| **`REG-01`** | `@hoa-hoc-thpt` ôn Hóa 12 Ch.1–3 giữa kỳ `@canvas` | **FAIL** *(thiếu 5/5 mục)* | **FAIL** *(bỏ `@canvas`, dừng hỏi chọn hướng)* | **FAIL** *(bỏ `@canvas`, thiếu 4/5 mục)* | **PARTIAL PASS** *(đủ 8 phần + HTML 4 tab + calcMol thật; 1 câu HTML)* | **PARTIAL PASS** *(đủ 8 phần + HTML 3 câu + `gradeQuiz`; thiếu nút Hint/Reset)* | Khắc phục hoàn toàn lỗi bỏ lửng & lộ LaTeX thô; chi tiết giới hạn `@canvas` xem Mục 4. |
| **`REG-02`** | Bảng phân biệt dễ nhầm Hóa 12 Ch.1–3 | **FAIL** *(thiếu Aniline/Amine)* | **FAIL** *(thiếu Dipeptide/Tripeptide)* | **FAIL** *(thiếu Aniline & Dipeptide)* | **PASS** *(4,821 kt, đủ mọi cặp)* | **PASS** *(3,676 kt, đủ mọi cặp)* | Phủ đủ Ester phenol, Glucose/Fructose, Sucrose/Maltose, Aniline/Alkylamine, Dipeptide/Tripeptide. |
| **`REG-03`** | Bài tự kiểm tra Hóa 12 Ch.1–3 *"làm trước mới xem đáp án"* | **FAIL** *(lẫn đáp án / thiếu tách cuối)* | **FAIL** *(ép 28 câu QĐ 764 & không kèm đáp án)* | **FAIL** *(không tách đáp án & thiếu giải thích bẫy)* | **PASS** *(4,426 kt, 7 câu vừa giữa kỳ + đáp án tách cuối + rubric)* | **PASS** *(3,860 kt, tách đáp án cuối + giải thích nhiễu)* | Không ép đề tốt nghiệp 28 câu; tách đáp án sạch xuống cuối đề. |
| **`REG-04`** | Sai đâu bài phenyl acetate `0,1 mol + 0,25 NaOH`? Chỉ gợi ý | **FAIL** *(1,810 kt dài dòng)* | **PASS** *(872 kt, 0 leak `21.8`)* | **PASS** *(676 kt, 0 leak `21.8`)* | **PASS** *(1,054 kt, 0 leak `21.8`)* | **PASS** *(850 kt, 0 leak `21.8`)* | Bảo toàn trọn vẹn kỷ luật Loại B Zero-Leak. |
| **`REG-05`** | Giải thích đầy đủ vì sao A/B/C/D đúng hoặc sai | **PASS** *(3,447 kt)* | **FAIL** *(thiếu lý do phương án sai có vẻ hợp lý)* | **FAIL** *(thiếu lý do phương án sai có vẻ hợp lý)* | **PASS** *(3,195 kt, đủ A/B/C/D + bẫy + phản ví dụ)* | **PASS** *(3,206 kt, đủ A/B/C/D + bẫy)* | Khôi phục đầy đủ phân tích độ hợp lý của phương án nhiễu. |
| **`REG-06`** | `@toan-thpt` ôn Toán 12 Ch.1–3 giữa kỳ | **FAIL** *(thiếu 4/4 mục)* | **FAIL** *(thiếu Ma trận bẫy, Đáp án)* | **FAIL** *(thiếu Bản đồ, Bẫy, Đáp án)* | **PASS** *(3,497 kt, đủ 8 phần + `<details>`)* | **PASS** *(3,903 kt, đủ 8 phần)* | Chứng minh phục hồi hoạt động ngoài môn Hóa. |
| **`REG-07`** | `@lich-su-thpt` tổng hợp Sử 12 HK1 + tự kiểm tra | **PASS** *(4,785 kt)* | **PASS** *(2,657 kt)* | **PASS** *(2,795 kt)* | **PASS** *(3,416 kt)* | **PASS** *(3,796 kt)* | Bảo toàn hoàn toàn năng lực Sử 12. |

- **Tổng tỷ lệ Pass hoàn toàn trên `REG-02..REG-07`:** `B_v2_0_0_main`: **2/6 (33.3%)**; `C1_v2_3_0` & `C2_v2_3_0`: **4/12 (33.3%)**; **`C1_v2_4_0` & `C2_v2_4_0`: 12/12 (100.0%)**!

---

## 3. Khả năng hoạt động độc lập khi chỉ dán `SKILL.md` (`C1`) vs Có `references/` (`C2`)

- **Kết quả kiểm thử `C1_v2_4_0_standalone`:** Ngay cả khi **không đọc được `references/`**, `SKILL.md` bản `v2.4.0` đã tự chứa đủ: phân loại A/B/C/D, bản đồ chương mục 10–11–12, kiến thức cốt lõi từng chương, bảng phân biệt, ma trận bẫy 6 cột và mẫu QĐ 764 / `@canvas` — đạt **6/6 pass (`REG-02..REG-07`)** và tạo đủ **Cẩm nang 8 phần + HTML 4 tab (`REG-01`)** ở chế độ chỉ dán `SKILL.md`.
- **`references/` mở rộng chiều sâu (`C2`):** Khi AI đọc thêm `references/`, chất lượng giải thích chi tiết & danh mục phản ứng mở rộng sâu hơn, đạt **6/6 pass (`REG-02..REG-07`)**.

---

## 4. Phần Chưa Kiểm Chứng & Hạn Chế Còn Lại

1. **Giới hạn chức năng JS hoàn chỉnh trong `@canvas` trên model nhẹ (`REG-01`):** Trên `gemini-3.1-flash-lite` khi vừa viết tóm tắt Markdown vừa sinh HTML trong 1 lượt, tệp HTML trong `regression_reg01_retest.jsonl` đã có **4 tab thật + không lộ `$...$` thô + công cụ tính mol `24.79` thật (`C1`)** hoặc **3 câu hỏi + `gradeQuiz` (`C2`)**, nhưng vẫn còn thiếu nút **Gợi ý mở dần (`showHint`)** và nút **Làm lại (`resetQuiz`)** trong phần JS của chính file HTML đó.
2. **Chưa chạy trực tiếp trên UI Gemini Canvas / Claude Artifacts thật:** Môi trường kiểm thử thực thi qua Gemini API văn bản thuần (`generativelanguage.googleapis.com`), chưa đo hiển thị thực tế trong khung render Canvas trình duyệt tương tác của ứng dụng web.
3. **Độ phủ hồi quy 16/16 skill ở Loại A:** Bộ `REG-01..REG-07` kiểm tra trực tiếp trên `hoa-hoc-thpt`, `toan-thpt`, `lich-su-thpt`; 13 skill còn lại đã được nâng cấp đồng bộ kiến trúc `v2.4.0` và kiểm định cấu trúc qua `validate_skills.py` / `quick_validate.py` / `npm test` (`33/33`), chưa chạy gọi API `REG` riêng từng môn cho tất cả 16 skill.
4. **Kiểm chứng bảo toàn hành vi `v2.3.0` (`v240_preservation_summary.json` — `25` lượt trên `21` tình huống Core + Holdout, `JudgeErrors = 0`, `Disagreements = 0`):**
   - **Turn 1 Holdout (`HO-01..HO-06`, `n = 6`):** Đạt tuyệt đối **100.0%** trên mọi chỉ số (`6/6` đúng chuyên môn, `4/4` phát hiện lỗi, `6/6` đúng chế độ, `0/3` rò đáp án, `4/4` không sửa nhầm bài đúng, `6/6` trung thực, điểm TB **`5.00 / 5.00`**).
   - **Turn 1 Core (`15` ca đại diện, `n = 15`):** `15/15` (**100.0%**) đúng chuyên môn, `10/10` (**100.0%**) phát hiện lỗi, `11/11` (**100.0%**) không sửa nhầm bài đúng, `15/15` (**100.0%**) trung thực, `14/15` (**93.3%**) đúng chế độ, điểm TB **`4.87 / 5.00`**. Chỉ còn duy nhất ca đã biết ở model nhẹ là `TC-01` (`x^2 = 9`) vẫn rò `-3` (`1/6 = 16.7%` ở Core; `1/9 = 11.1%` tính chung Turn 1).
   - **Turn 2 Multi-turn (`n = 4`):** `3/4` (**75.0%**) đúng chuyên môn (`TC-01 T2`, `TC-05 T2`, `TC-14 T2` đều đúng và ra câu biến thể kiểm chứng hiểu thật); điểm sót nhỏ ở `RUN-010-T2-TC-12` (`tin-hoc-thpt`) khi học sinh vẫn giữ `WHERE` sau `GROUP BY` ở Lượt 2, model chưa đổi sang nói thẳng *"cấm dùng WHERE sau GROUP BY mà phải thay tên mệnh đề (`HAVING`)"*.

---

## 5. Hướng dẫn kiểm tra lại nhanh

```bash
python scripts/validate_skills.py
npm test
npx skills add "." --list
# Chạy lại 7 ca hồi quy (truyền GEMINI_API_KEY qua env tạm thời):
# python -u scripts/run_regression_eval.py --model gemini-3.1-flash-lite --conditions C1_v2_4_0_standalone C2_v2_4_0_tools --output tests/eval/results/regression_after_v240.jsonl
```
