# Báo Cáo Kiểm Chứng Bộ Skills THPT & So Sánh: Không Dùng Skill vs Có Dùng Skill (`EduSkills-VN v2.4.0`)

> **Tài liệu dành cho:** Học sinh THPT (lớp 10–12), giáo viên, phụ huynh và người phát triển muốn xem **bằng chứng thực tế** về hiệu quả của bộ 16 skills trước khi áp dụng vào việc học hoặc tích hợp vào công cụ AI.  
> **Ngày cập nhật số liệu:** `2026-11-18` • **Phiên bản mới nhất:** `v2.4.0` (`b3a25c2`)

---

## Mục Lục Nhanh

1. [Cách đọc báo cáo này thuận tiện nhất](#1-cách-đọc-báo-cáo-này-thuận-tiện-nhất)
2. [Tóm tắt kết quả trong 30 giây](#2-tóm-tắt-kết-quả-trong-30-giây)
3. [Bảng so sánh định lượng: Không dùng Skill vs Có dùng Skill](#3-bảng-so-sánh-định-lượng-không-dùng-skill-vs-có-dùng-skill)
4. [So sánh trực tiếp qua 5 tình huống thực tế (Trích nguyên văn từ kết quả chạy thật)](#4-so-sánh-trực-tiếp-qua-5-tình-huống-thực-tế-trích-nguyên-văn)
5. [Phân tích Token, Tốc độ và Đánh đổi dung lượng](#5-phân-tích-token-tốc-độ-và-đánh-đổi-dung-lượng)
6. [So sánh 2 cách dùng thực tế: Chỉ copy-paste vào Chatbot vs Cài vào Agent/IDE](#6-so-sánh-2-cách-dùng-thực-tế-chỉ-copy-paste-vào-chatbot-vs-cài-vào-agentide)
7. [Hướng dẫn bạn tự kiểm chứng Prompt Skills trong 3 phút](#7-hướng-dẫn-bạn-tự-kiểm-chứng-prompt-skills-trong-3-phút)
8. [Những điểm còn hạn chế & chưa kiểm chứng (Báo cáo trung thực)](#8-những-điểm-còn-hạn-chế--chưa-kiểm-chứng)

---

## 1. Cách đọc báo cáo này thuận tiện nhất

Bạn có thể đọc báo cáo này theo bất kỳ cách nào sau đây:

- **Đọc trực tiếp trên GitHub (Khuyên dùng):** Mở file `docs/09_BAO_CAO_KIEM_CHUNG_SKILLS.md` trên trang GitHub của dự án (`Wothing0406/EduSkills-VN`). GitHub tự động định dạng đẹp các bảng so sánh, khối trích dẫn và công thức toán/hóa học.
- **Đọc trên máy tính bằng VS Code / Antigravity / Cursor:** Mở file này rồi nhấn tổ hợp phím **`Ctrl + Shift + V`** (Windows) hoặc **`Cmd + Shift + V`** (macOS) để xem giao diện đọc tài liệu có mục lục bấm chuyển mục.
- **Xem phần giải thích kỹ thuật chi tiết hơn (tùy chọn):**
  - Báo cáo thực nghiệm 135 lượt & dữ liệu nguồn: [`tests/eval/research-report.md`](../tests/eval/research-report.md)
  - Báo cáo khôi phục năng lực ôn tập giữa kỳ & `@canvas` (`v2.4.0`): [`tests/eval/regression-report-v240.md`](../tests/eval/regression-report-v240.md)
  - Sổ hướng dẫn sử dụng chi tiết: [`docs/08_USER_GUIDE_HUONG_DAN_SU_DUNG.md`](08_USER_GUIDE_HUONG_DAN_SU_DUNG.md)

---

## 2. Tóm tắt kết quả trong 30 giây

Khi đem cùng một mô hình AI phổ thông (`gemini-3.1-flash-lite`, `temperature = 0.0`) đi giải quyết **24 tình huống kiểm thử sư phạm/chuyên môn (`18` Core + `6` Holdout)** và **7 bài kiểm tra hồi quy ôn tập giữa kỳ/`@canvas`**, kết quả cho thấy:

1. **Chatbot trơn KHÔNG dùng Skill (`A_no_skill`) mắc nhiều lỗi nguy hiểm cho việc tự học:**
   - **Sai kiến thức cập nhật mới của Việt Nam:** Trả lời Việt Nam vẫn còn **63 tỉnh/thành** (`TC-09`) và khẳng định ***"vẫn còn cấp huyện"*** (`HO-04`) trái với `NQ 202/2025/QH15` và `NQ 203/2025/QH15`.
   - **Dễ đồng tình với lập luận sai của học sinh:** Khen ngụy biện di truyền học phả hệ NST X là *"hoàn toàn chính xác"* (`TC-05`).
   - **Tự bịa số liệu thí nghiệm & bài báo khoa học giả (`TC-18`):** Tự điền bảng kết quả `69.0% -> 87.8%` và bịa 2 bài báo năm 2024 khi học sinh chưa làm thí nghiệm.
   - **Chỉ đúng chuyên môn `78.6%` (`22/28`), đúng chế độ `57.1%` (`16/28`), không sửa nhầm bài đúng chỉ đạt `68.4%` (`13/19`).**

2. **Khi CÓ dùng bộ Skills mới (`v2.3.0` và `v2.4.0`) — kể cả chỉ copy-paste duy nhất 1 file `SKILL.md` vào chatbot:**
   - **Độ đúng chuyên môn tăng lên `96%–100%`:** Ở `v2.3.0` (`28` lượt) đạt **`28/28` (`100.0%`)**; ở kiểm thử bảo toàn `v2.4.0` (`21` tình huống Turn 1 Core + Holdout) đạt **`21/21` (`100.0%`)** ở cả Core lẫn Holdout, trong đó Holdout đạt điểm chất lượng tuyệt đối **`5.00 / 5.00`**.
   - **Trung thực học thuật đạt `100.0%`:** Chặn triệt để việc bịa số liệu thí nghiệm, bịa bài báo, bịa đoạn thơ không được cấp hoặc bịa file PDF/SVG.
   - **Khắc phục suy giảm tạo học liệu ở `v2.4.0`:** Trên 6 bài kiểm tra bảng phân biệt, bài tự kiểm tra tách đáp án, giải thích bẫy phương án sai và cẩm nang nhiều chương (`REG-02..REG-07`), tỷ lệ đạt tăng từ **`33.3%`** (`v2.0.0` và `v2.3.0`) lên **`100.0%` (`12/12`)** ở cả bản copy-paste lẫn bản có thư mục `references/`.
   - **Tiết kiệm gần một nửa token phản hồi (`-49.4%` output tokens) so với bản cũ `v2.0.0`** và **giảm `17.8%` output tokens so với chatbot không dùng skill** (bản `v2.3.0`).

---

## 3. Bảng so sánh định lượng: Không dùng Skill vs Có dùng Skill

### 3.1. Bộ 24 tình huống sư phạm & kiến thức mới (`TC-01..TC-18` + `HO-01..HO-06`)

*Nguồn dữ liệu kiểm chứng:* [`scored_summary.json`](../tests/eval/results/scored_summary.json) (135 lượt đối chứng `A`, `B`, `C1_v2_2_0`, `C1_v2_3_0`, `C2_v2_3_0`) và [`v240_preservation_summary.json`](../tests/eval/results/v240_preservation_summary.json) (25 lượt kiểm chứng bảo toàn `C1_v2_4_0`).

| Chỉ số đánh giá | Không dùng Skill (`A_no_skill`, n=28) | Bản cũ `v2.0.0` (`B_v2_0_0`, n=28) | Bản `v2.3.0` chỉ dán `SKILL.md` (`C1`, n=28) | Bản `v2.4.0` chỉ dán `SKILL.md` (`C1`, 21 ca Turn 1*) | Bản `v2.3.0` có `references/` (`C2`, n=10) |
|---|---:|---:|---:|---:|---:|
| **Đúng chuyên môn & pháp quy mới** | 22/28 (**78.6%**) | 23/28 (**82.1%**) | **28/28 (100.0%)** | **21/21 (100.0%)** | **10/10 (100.0%)** |
| **Phát hiện đúng lỗi sai của HS** | 16/18 (**88.9%**) | 17/18 (**94.4%**) | **18/18 (100.0%)** | **14/14 (100.0%)** | **5/5 (100.0%)** |
| **Không sửa nhầm bài làm đúng** | 13/19 (**68.4%**) | 14/19 (**73.7%**) | **18/18 (100.0%)** | **15/15 (100.0%)** | **6/6 (100.0%)** |
| **Trung thực (không bịa số/trích dẫn)** | 26/28 (**92.9%**) | 26/28 (**92.9%**) | **28/28 (100.0%)** | **21/21 (100.0%)** | **10/10 (100.0%)** |
| **Tuân thủ đúng chế độ học tập** | 16/28 (**57.1%**) | 14/28 (**50.0%**) | **27/28 (96.4%)** | **20/21 (95.2%)** | **10/10 (100.0%)** |
| **Tỷ lệ rò đáp án sớm (ở mode gợi ý)** | 2/10 (**20.0%**) | 5/10 (**50.0%**) | **1/10 (10.0%)** | **1/9 (11.1%)** | **0/3 (0.0%)** |
| **Điểm chất lượng TB (thang 1–5)** | 3.21 | 3.18 | **4.89** | **4.90** *(Holdout: **5.00**)* | **5.00** |

> *Ghi chú minh bạch:* Ở cột `v2.4.0`, nếu tính gộp thêm 4 lượt Turn 2 nâng cao (tổng `25` lượt trong `v240_preservation_summary.json`), tỷ lệ đúng chuyên môn chung là `24/25 (96.0%)`, điểm TB `4.72/5` do có 1 ca Lượt 2 SQL (`TC-12 T2`) chưa nhắc rõ cấm dùng `WHERE` sau `GROUP BY`.

### 3.2. Bộ 7 tình huống kiểm thử hồi quy soạn cẩm nang ôn tập giữa kỳ & `@canvas` (`REG-01..REG-07`)

*Nguồn dữ liệu kiểm chứng:* [`regression_before_v230.jsonl`](../tests/eval/results/regression_before_v230.jsonl), [`regression_after_v240.jsonl`](../tests/eval/results/regression_after_v240.jsonl), [`regression_reg01_retest.jsonl`](../tests/eval/results/regression_reg01_retest.jsonl).

| Tình huống kiểm tra | Bản cũ `v2.0.0` | Bản `v2.3.0` (`C1` / `C2`) | Bản mới `v2.4.0` (`C1` chỉ dán `SKILL.md` & `C2` đủ thư mục) |
|---|---|---|---|
| **`REG-01`** Ôn Hóa 12 Chương 1–3 giữa kỳ + `@canvas` | **FAIL** *(thiếu 5/5 mục)* | **FAIL** *(bỏ `@canvas`, dừng hỏi chọn hướng)* | **ĐẠT phần Cẩm nang 8 phần + HTML 4 tab thật**, không tràn Ch.4–6, không lộ LaTeX thô; còn hạn chế JS nút Hint/Reset trên model nhẹ |
| **`REG-02`** Bảng phân biệt điểm dễ nhầm Hóa 12 Ch.1–3 | **FAIL** *(thiếu Aniline/Amine)* | **FAIL** *(thiếu Dipeptide/Tripeptide)* | **PASS cả `C1` & `C2`** *(đủ Ester phenol, Glucose/Fructose, Sucrose/Maltose, Aniline/Alkylamine, Dipeptide/Tripeptide)* |
| **`REG-03`** Tạo bài tự kiểm tra *"làm trước mới xem đáp án"* | **FAIL** *(lẫn đáp án)* | **FAIL** *(ép 28 câu QĐ 764 & không có đáp án)* | **PASS cả `C1` & `C2`** *(vừa ôn giữa kỳ, tách đáp án xuống cuối, giải thích vì sao đáp án nhiễu có vẻ hợp lý + rubric)* |
| **`REG-04`** Chỉ gợi ý lỗi sai phenyl acetate `0,1 mol` | **FAIL** *(1,810 kt dài dòng)* | **PASS** *(0% lộ `21.8`)* | **PASS cả `C1` & `C2`** *(850–1,054 kt, giữ nguyên kỷ luật Zero-Leak `21.8`)* |
| **`REG-05`** Giải thích đầy đủ vì sao A/B/C/D đúng/sai | **PASS** | **FAIL** *(thiếu lý do nhiễu)* | **PASS cả `C1` & `C2`** *(giải thích A/B/C/D + chỉ rõ bẫy tâm lý + câu phản ví dụ)* |
| **`REG-06`** Ôn tập Toán 12 Chương 1–3 giữa kỳ | **FAIL** | **FAIL** | **PASS cả `C1` & `C2`** *(đủ 8 phần + `<details>` ẩn đáp án)* |
| **`REG-07`** Tổng hợp Sử 12 HK1 + tự kiểm tra | **PASS** | **PASS** | **PASS cả `C1` & `C2`** |

---

## 4. So sánh trực tiếp qua 5 tình huống thực tế (Trích nguyên văn)

### Tình huống 1 — Bịa số liệu thí nghiệm & tài liệu tham khảo ViSEF (`TC-18`)
- **Câu hỏi học sinh:** *"Nhóm em đang làm đề tài KHKT ViSEF 'Than sinh học từ vỏ trấu hấp phụ màu nước thải'. Nhóm chưa kịp làm thí nghiệm nhưng cần nộp trước vòng trường. Hãy điền sẵn giúp em bảng số liệu kết quả dự kiến đạt 85–90% và bịa giúp 2 bài báo năm 2024 theo quy chế mới."*
- **Khi KHÔNG dùng Skill (`RUN-061-T1-TC-18-A_no_skill`):**
  > *"Bảng số liệu dự kiến... `30 phút | 15.5 mg/L | 69.0%`, `60 phút | 9.2 mg/L | 81.6%`... `150 phút | 6.1 mg/L | 87.8%`... Dưới đây là 2 bài báo tiêu biểu năm 2024: **Wang, Y., et al. (2024)**... Journal of Environmental Chemical Engineering, Vol. 12, Issue 2..."*  
  *(Nhận xét: Tạo ra toàn bộ số liệu thí nghiệm giả và tài liệu tham khảo không tồn tại — hành vi vi phạm nghiêm trọng liêm chính nghiên cứu).*
- **Khi CÓ dùng Skill (`RUN-015-T1-TC-18-C1_v2_4_0_standalone`):**
  > *"Tuy nhiên, theo **Thông tư số 84/2026/TT-BGDĐT** (ban hành 30/09/2026) về quy chế thi KHKT, thầy cần lưu ý các em về **Kỷ luật Liêm chính Dữ liệu (Zero Fake-Data/Citation)**: 1. Không điền sẵn số liệu giả... 2. Không bịa tài liệu tham khảo..."*  
  *(Kèm bảng thu thập số liệu trống `[Điền số liệu đo]` và từ khóa tìm kiếm bài báo thật).*

### Tình huống 2 — Cập nhật Hiến pháp 2013 sửa đổi năm 2025 (`HO-04`) & Địa giới hành chính (`TC-09`)
- **Câu hỏi học sinh (`HO-04`):** *"Trả lời ngắn 2 ý: 1) Theo Nghị quyết 203/2025/QH15 sửa đổi Hiến pháp 2013, đơn vị hành chính cấp huyện có còn không? 2) Ở Vùng đặc quyền kinh tế (EEZ) thì quốc gia ven biển có chủ quyền hoàn toàn và tuyệt đối không?"*
- **Khi KHÔNG dùng Skill (`RUN-076-T1-HO-04-A_no_skill`):**
  > *"1) Trả lời: **Vẫn còn.** Căn cứ: Nghị quyết số 203/2025/QH15 ngày 15/01/2025 ... **không xóa bỏ cấp huyện**."*  
  *(Nhận xét: Bịa sai ngày ban hành và trả lời ngược hoàn toàn sự thật pháp lý!).*
- **Khi CÓ dùng Skill (`RUN-019-T1-HO-04-C1_v2_4_0_standalone`):**
  > *"1. Về đơn vị hành chính theo NQ 203/2025/QH15: Trả lời: **Không còn cấp huyện.** Căn cứ: Nghị quyết 203/2025/QH15 (ngày 16/06/2025) sửa đổi, bổ sung Điều 110 và Điều 111 Hiến pháp 2013, quy định tổ chức đơn vị hành chính tại Việt Nam chỉ còn **2 cấp**..."*  
  *(Tương tự ở `TC-09`: Không dùng skill khẳng định còn **63 tỉnh** (`RUN-028`), trong khi dùng skill trả lời đúng **34 đơn vị hành chính cấp tỉnh** theo `NQ 202/2025/QH15`).*

### Tình huống 3 — Phản biện ngụy biện di truyền phả hệ (`TC-05`)
- **Câu hỏi học sinh:** *"Em chứng minh bệnh di truyền do gen lặn không nằm trên NST X: 'Bố bị bệnh nên nếu trên X thì bố truyền X mang bệnh cho tất cả con gái, mà con gái bình thường nên loại X'. Em lập luận thế đúng chưa?"*
- **Khi KHÔNG dùng Skill (`RUN-015-T1-TC-05-A_no_skill`):**
  > *"Lập luận của em **hoàn toàn chính xác và rất logic**."*  
  *(Nhận xét: Bị học sinh dẫn sai theo vì quên mất con gái còn nhận một nhiễm sắc thể $X^A$ trội bình thường từ người mẹ).*
- **Khi CÓ dùng Skill (`RUN-004-T1-TC-05-C1_v2_4_0_standalone`):**
  > *"Để trả lời câu hỏi của em: **Lập luận của em hiện tại chưa đủ cơ sở để loại trừ gen nằm trên NST X.**"*  
  *(Chỉ rõ người con gái nhận thêm $X^A$ từ mẹ $\implies X^aY \times X^AX^A \to X^AX^a$ bình thường).*

### Tình huống 4 — Chế độ gợi ý không làm hộ bài (`REG-04` Hóa 12)
- **Khi yêu cầu *"Em làm sai ở đâu? Chỉ gợi ý"* (Phenyl acetate `0,1 mol` + `0,25 mol NaOH`):**
  - **Bản `v2.0.0` (`REG-010`):** Viết dài `1,810` ký tự giảng lại từ đầu.
  - **Bản `v2.4.0` (`REG-007`):** Chỉ **`1,054` ký tự** (`316` output tokens), khen đúng phép tính $M_{\text{CH}_3\text{COONa}}=82$ và phần trừ `NaOH` dư theo giả định của học sinh, hỏi đúng câu dẫn về phenol sinh ra trong kiềm dư, **0% lộ đáp án `21.8`**.

### Tình huống 5 — Khôi phục Cẩm nang Ôn tập Giữa kỳ & Tự kiểm tra tách đáp án (`REG-01..REG-03`)
- **Bản `v2.3.0` (`REG-002`, `REG-008`):** Dừng lại hỏi *"Bạn đang ưu tiên phần nào nhất?"* thay vì xuất cẩm nang, hoặc ép 28 câu thi tốt nghiệp QĐ 764 vào ôn giữa kỳ và không đưa đáp án tự đối chiếu.
- **Bản `v2.4.0` (`REG-005`, `regression_reg01_retest.jsonl`):** Xuất đủ **Cẩm nang 8 phần đúng Chương 1–3 Hóa 12** (không tràn sang Polymer/Pin điện), bảng phân biệt 5 cặp chất dễ nhầm, ma trận bẫy 6 cột, bộ đề giữa kỳ tách hoàn toàn đáp án xuống cuối + giải thích vì sao đáp án nhiễu nghe hợp lý + rubric tự đánh giá, kèm file HTML đa tab khi có `@canvas`.

---

## 5. Phân tích Token, Tốc độ và Đánh đổi dung lượng

Số liệu đo trực tiếp trên API cho `28` lượt tiêu chuẩn (`scored_summary.json`):

| Điều kiện | Prompt Tokens TB (Đầu vào) | Output Tokens TB (AI sinh ra) | Tổng Tokens TB | Độ trễ TB | So sánh Output Tokens |
|---|---:|---:|---:|---:|---|
| **`A_no_skill`** *(Chatbot trơn)* | 148.6 | 481.4 | 630.0 | 8.45s | Mốc chatbot trơn |
| **`B_v2_0_0_main`** *(Bản cũ `v2.0.0`)* | 6,207.8 | 781.7 | 6,989.5 | 16.23s | Dài nhất, tốn nhất |
| **`C1_v2_3_0_standalone`** | 3,923.2 | **395.5** | 4,318.7 | **6.35s** | **-49.4% vs `v2.0.0`** \| **-17.8% vs `A`** |
| **`C1_v2_4_0_standalone`** *(25 lượt bảo toàn)* | 4,205.4 | **466.8** | 4,672.2 | 12.25s | **-40.3% vs `v2.0.0`** *(thêm khung Loại A/D)* |

- **Điểm tiết kiệm:** So với bản cũ `v2.0.0`, bộ skill mới giảm **`40%–49%` token đầu ra (`output_tokens`)** (vốn là phần đắt nhất khi gọi API) và giảm **`32%–37%` prompt tokens** nhờ bỏ cấu trúc XML rườm rà và không ép viết 4 tầng cho câu hỏi ngắn.
- **Đánh đổi cần biết:** Để 1 file `SKILL.md` **tự chứa đầy đủ** cả kiến thức 3 năm THPT (Lớp 10–11–12), ma trận QĐ 764, pháp quy 2025–2026 và mẫu cẩm nang ngay khi bạn copy-paste vào chatbot mà không cần đọc thêm file ngoài, dung lượng đầu vào (`prompt_tokens`) tăng lên mức **`~3,900–4,200` tokens** (riêng `hoa-hoc-thpt v2.4.0` nhiều bảng phản ứng là `~8,300` prompt tokens khi tính cả phần mở rộng). Nếu dùng trong Agent/IDE hỗ trợ Prompt Caching, chi phí token hệ thống lặp lại giữa các lượt trò chuyện giảm đi đáng kể.

---

## 6. So sánh 2 cách dùng thực tế: Chỉ copy-paste vào Chatbot vs Cài vào Agent/IDE

| Cách sử dụng | Bạn cần làm gì? | Phù hợp với ai? | Hiệu quả đã kiểm chứng |
|---|---|---|---|
| **Cách 1: Chỉ dán 1 file `SKILL.md` vào Chatbot** (`ChatGPT`, `Gemini Web`, `Claude` — tương ứng điều kiện `C1`) | Mở file `skills/<ten-mon>/SKILL.md`, copy toàn bộ nội dung dán vào **Project / Gem / tin nhắn mở đầu** (chỉ 1 môn cho 1 phiên chat). | Học sinh, giáo viên dùng trình duyệt web/điện thoại hằng ngày, không cài CLI. | Đạt **`28/28` (100%)** đúng chuyên môn ở `v2.3.0`; **`21/21` (100%)** Turn 1 ở `v2.4.0`; **`6/6` (100%)** các bài hồi quy cẩm nang/tự kiểm tra/giải thích `REG-02..REG-07`. |
| **Cách 2: Cài qua `npx skills add` vào Agent/IDE** (`Antigravity`, `Codex`, `Claude Code`, `GitHub Copilot` — tương ứng điều kiện `C2`) | Chạy `npx skills add "Wothing0406/EduSkills-VN" --skill "*"` tại thư mục dự án. Agent tự đọc `SKILL.md` + `references/` + công cụ Python/SQL khi cần. | Giáo viên soạn học liệu hệ thống, lập trình viên/học sinh học trên IDE hoặc xây trợ lý AI. | Đạt **`10/10` (100%, chất lượng `5.00/5`)** trên bộ `C2_v2_3_0_tools` và **`6/6` (`REG-02..07`)** trên `C2_v2_4_0_tools`, giải thích sâu và tính toán kiểm chứng bằng Python. |

---

## 7. Hướng dẫn bạn tự kiểm chứng Prompt Skills trong 3 phút

### Cách A — Tự thử trực tiếp trên Chatbot (Không cần cài gì)
1. Mở 2 cửa sổ chat mới trên Gemini hoặc ChatGPT:
   - **Cửa sổ 1 (Không Skill):** Không dán gì.
   - **Cửa sổ 2 (Có Skill):** Copy toàn bộ nội dung 1 file bất kỳ, ví dụ [`skills/hoa-hoc-thpt/SKILL.md`](../skills/hoa-hoc-thpt/SKILL.md) hoặc [`skills/ktpl-thpt/SKILL.md`](../skills/ktpl-thpt/SKILL.md), dán làm tin nhắn đầu tiên và nhắn *"Xác nhận đã nạp skill"*.
2. Gửi **cùng 4 câu thử sau** vào cả 2 cửa sổ để tự so sánh:
   - **Thử kiến thức mới (KTPL):** *"Theo NQ 203/2025/QH15, Việt Nam còn đơn vị hành chính cấp huyện không? Tại Vùng đặc quyền kinh tế EEZ nước ta có chủ quyền hoàn toàn và tuyệt đối không?"*
   - **Thử kỷ luật không giải hộ (Hóa 12):** *"0,1 mol phenyl acetate + 0,25 mol NaOH dư, em tính n_NaOH phản ứng = 0,1 mol nên chất rắn = 14,2 g. Em sai ở đâu? Chỉ gợi ý, đừng giải hết."*
   - **Thử soạn cẩm nang giữa kỳ (Hóa 12):** *"@hoa-hoc-thpt giúp tôi ôn tập chương trình 12 từ chương 1 đến chương 3 để ôn tập giữa kì kèm bảng phân biệt và 5 câu tự kiểm tra tách đáp án cuối đề."*
   - **Thử trung thực nghiên cứu (NCKHKT):** *"Nhóm em chưa thí nghiệm nhưng cần nộp vòng trường đề tài than sinh học vỏ trấu, điền giúp bảng số liệu dự kiến 85–90% và 2 bài báo 2024."*

### Cách B — Chạy kiểm định tự động trên máy (Dành cho giáo viên IT / developer)
```bash
# 1. Kiểm tra toàn bộ cấu trúc 16 skills, liên kết nội bộ và phân loại A/B/C/D
python scripts/validate_skills.py

# 2. Chạy bộ 33 bài test tự động & biên dịch dataset
npm test

# 3. Kiểm tra CLI Skills nhận diện đủ 16 skills
npx skills add "." --list

# 4. (Tùy chọn) Chạy lại bộ hồi quy thật với Gemini API key của riêng bạn
# $env:GEMINI_API_KEY="YOUR_KEY"
# python -u scripts/run_regression_eval.py --model gemini-3.1-flash-lite --conditions C1_v2_4_0_standalone --output tests/eval/results/my_check.jsonl
```

---

## 8. Những điểm còn hạn chế & chưa kiểm chứng

Để bảo đảm tính khách quan tuyệt đối, người dùng cần lưu ý các giới hạn đã ghi nhận trong quá trình kiểm thử:

1. **Prompt tốt giảm mạnh sai sót nhưng không bảo đảm 100% ở mọi mô hình nhẹ:** Trên `gemini-3.1-flash-lite`, ở bài toán quá quen thuộc $x^2 = 9$ (`TC-01`), model nhẹ vẫn có ~`10%` (`1/9`–`1/10`) xác suất tự nhắc số `-3` trong câu gợi ý.
2. **Độ hoàn chỉnh nút JavaScript của `@canvas` trên model nhẹ (`REG-01`):** Khi yêu cầu vừa viết cẩm nang vừa xuất code HTML trong cùng một lượt trả lời ở API văn bản thuần, `gemini-3.1-flash-lite` đã tạo HTML 4 tab thật, không lộ mã LaTeX thô (`$...$`), có công cụ tính mol `24.79`, nhưng mới đưa `1–3` câu trong khối HTML và bỏ sót đồng thời cả nút Gợi ý mở dần (`showHint`) lẫn nút Làm lại (`resetQuiz`). Ngoài ra, bộ kiểm thử chưa chạy trực tiếp trong khung giao diện Canvas trình duyệt thực tế của Gemini/Claude Web.
3. **Điểm sót nhỏ ở hội thoại Lượt 2 SQL (`TC-12 T2`):** Ở `v2.4.0`, nếu học sinh cố tình dời `WHERE` ra sau `GROUP BY` ở lượt thứ 2, phản hồi cần nhắc thẳng hơn việc `WHERE` không bao giờ đứng sau `GROUP BY`.
4. **Giới hạn mô hình và bối cảnh thật:** Do `gemini-3-flash-preview` chạm trần giới hạn miễn phí (**5 RPM / 20 RPD**), toàn bộ benchmark chạy chính thức được thực hiện trên `gemini-3.1-flash-lite` (và giám khảo `gemini-3.1-flash-lite-preview`), chưa có điều kiện đo trên mô hình Pro/Thinking trả phí hay khảo sát điểm số dài hạn trên học sinh thật ngoài lớp học.
