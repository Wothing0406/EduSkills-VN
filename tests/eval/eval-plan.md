# Kế Hoạch Đánh Giá Thực Nghiệm Bộ Skills THPT (`v2.2.0`)

**Thời điểm khóa kế hoạch:** `2026-11-18` (trước khi nâng cấp `v2.2.0` và trước khi chạy đánh giá thực nghiệm trên mô hình).  
**Baseline đối chứng trong Git:**
- Nhánh `main` (`ebb7d1a`): Phiên bản cũ `v2.0.0` (đơn tệp `SKILL.md` có `<zero_bare_answer_mandate>`, `<scaffolding_4_tiers>`, khối XML lặp và danh sách `tools` giả).
- Nhánh `beta` (`e9dc3a5`): Phiên bản `v2.1.0-beta` (tách `SKILL.md` gọn và đẩy quy tắc bắt buộc sang `references/`).
- Phiên bản nâng cấp cần đánh giá (`C`): `v2.2.0` (1 tệp `SKILL.md` tự chứa dùng chung cho chatbot, agent đọc repo và agent có công cụ; đủ 10 mục chuẩn và quy tắc dạng `Tình huống/điều kiện → hành động → cách kiểm chứng`).

---

## 1. Câu hỏi nghiên cứu (RQ1–RQ5)
1. **RQ1 (Độ đúng & phát hiện lỗi):** Skill `v2.2.0` có cải thiện tỷ lệ trả lời đúng chuyên môn, phát hiện đúng bước sai đầu tiên và tách lỗi gốc khỏi lỗi kéo theo so với Không dùng Skill (`A`) và bản cũ `v2.0.0` (`B`) không?
2. **RQ2 (Tuân thủ chế độ & chống lộ đáp án sớm):** Trên các bài yêu cầu *"chỉ gợi ý"* hoặc *"hỏi ngắn"*, `v2.2.0` có giảm tỷ lệ tiết lộ đáp án sớm và tránh ép khuôn 4 tầng dài dòng so với `v2.0.0` không; đồng thời vẫn giữ khả năng giải đầy đủ khi người học yêu cầu *"giải mẫu đầy đủ"* không?
3. **RQ3 (Phản biện & tránh sửa nhầm):** Khi học sinh giải đúng bằng phương pháp khác đáp án mẫu, `v2.2.0` có công nhận đúng thay vì sửa nhầm không? Khi học sinh ngụy biện (như phả hệ NST X), mô hình có chỉ ra phản ví dụ đúng không?
4. **RQ4 (Tương thích Chatbot độc lập):** Khi **chỉ dán nội dung `SKILL.md`** (`C1`, không kèm `references/`, không có công cụ), `v2.2.0` có giữ đủ tri thức bắt buộc (QĐ 764, TT 84/2026, công thức, quy tắc phản ví dụ) vượt trội hơn `v2.1.0-beta` (khi thiếu `references/`) và an toàn hơn `v2.0.0` không?
5. **RQ5 (Giá trị bổ sung của công cụ kiểm chứng):** Ở điều kiện `C2` (có công cụ thực thi Python/kiểm tra cú pháp/văn bản nguồn chính thức đã đọc), kết quả tính toán và độ chính xác dẫn chứng nguồn có cải thiện so với chỉ suy luận văn bản (`C1`) không?

---

## 2. Điều kiện so sánh & kiểm soát biến nhiễu
- **Mô hình chạy chính:** Google Gemini API (`generativelanguage.googleapis.com/v1beta`), `temperature = 0.0`, `maxOutputTokens = 4096`, không bật tool ẩn ngoài các công cụ được định nghĩa tường minh ở nhánh `C2`.
  - *Điều chỉnh sau Pilot (3 ca đầu trên `pilot_runs.jsonl`):* Pilot phát hiện `gemini-3-flash-preview` bị giới hạn `5 requests/phút` ở free tier dẫn đến `HTTP 429` trên 5/13 lượt gọi. Do đó, giữ kết quả Pilot của `gemini-3-flash-preview` làm bằng chứng tiền kiểm tra, và cố định **`gemini-3.1-flash-lite`** làm mô hình thực thi đồng nhất cho toàn bộ 24 ca (`A`, `B`, `C1`, `C2`, `C_beta`) để bảo đảm so sánh cùng mô hình, cùng cấu hình và không rơi lượt do giới hạn RPM.
  - *Kiểm định phụ (Cross-check):* Nếu quota `gemini-3-flash-preview` cho phép ở nhịp 5 RPM, dùng làm giám khảo mù độc lập (khác họ kích thước với `gemini-3.1-flash-lite`) kèm kiểm tra lại trực tiếp bằng script Python xác định và tác giả.
- **Mỗi test case độc lập:** Khởi tạo cuộc hội thoại mới sạch lịch sử (`contents` riêng); trừ các ca đa lượt thiết kế sẵn kịch bản nhánh trả lời cố định cho Lượt 2/Lượt 3.
- **4 điều kiện thực nghiệm tách biệt (không gộp kết quả):**
  - `A` (**No Skill**): Chỉ gửi đề bài/lời học sinh làm `user` prompt.
  - `B` (**`v2.0.0` Baseline**): Dán nguyên văn `SKILL.md` của bản `main` (`ebb7d1a`) vào `systemInstruction` (điều kiện chatbot độc lập).
  - `C1` (**`v2.2.0` Standalone Chatbot**): Dán nguyên văn duy nhất `SKILL.md` của bản `v2.2.0` vào `systemInstruction` — **không** nạp `references/`, **không** cấp công cụ.
  - `C2` (**`v2.2.0` + Tool Verification**, chạy riêng trên 6 bài có tính toán/nghiên cứu nguồn/cú pháp): Nạp `SKILL.md` bản `v2.2.0` kèm kết quả/công cụ thực thi thực tế (Python interpreter cho phép tính/code/cân bằng, văn bản nguồn chính thức đã đọc) và báo cáo kết quả thành mục riêng.
  - *(Kiểm chứng phụ `C_beta` trên 3 bài phụ thuộc `references/` của `v2.1.0-beta` chỉ dán `SKILL.md` `e9dc3a5` để đo mức độ hổng khi thiếu `references/`).*

---

## 3. Bộ bài kiểm tra & Phân bổ (24 ca: 18 Dev/Core + 6 Holdout)
- **Tập lõi (`18 ca`, ID `TC-01`..`TC-18`):** Phủ đủ cả **16 skills** và đủ **12 loại hành vi** ở Mục 8 (bài thường, sai khái niệm, sai tính toán, lỗi gốc–kéo theo, cách giải đúng khác mẫu, thiếu dữ kiện, chỉ gợi ý, giải đầy đủ, hỏi ngắn, sai ở lượt 2, chuyển giao sau hỗ trợ, kiểm chứng nguồn), trong đó có **4 ca đa lượt (2–3 lượt)** với phản hồi mô phỏng cố định trước ở phía học sinh.
- **Tập Holdout độc lập (`6 ca`, ID `HO-01`..`HO-06`):** Khóa riêng, **không dùng nội dung đề bài hay đáp án của tập này để chỉnh sửa `SKILL.md`**, dùng kiểm tra khả năng tổng quát hóa sau khi hoàn tất chỉnh sửa.

---

## 4. Chỉ số định lượng & Định nghĩa chấm điểm (Tử số / Mẫu số / N/A)
Mọi chỉ số được script Python tính tự động từ file log chấm điểm (`tests/eval/results/`):
1. **Tỷ lệ đúng chuyên môn (`Domain Accuracy`):** Số lượt không mắc lỗi công thức, khái niệm, cấu trúc thi QĐ 764 hoặc quy phạm pháp luật / tổng số lượt áp dụng.
2. **Tỷ lệ phát hiện & định vị lỗi (`Error Localization Rate`):** Số lượt xác định đúng bước sai đầu tiên và tách lỗi gốc–kéo theo / tổng số ca học sinh gửi bài có lỗi (`N/A` cho ca hỏi lý thuyết hoặc chỉ gửi đề).
3. **Tỷ lệ tiết lộ đáp án sớm (`Premature Answer Leak Rate`, càng thấp càng tốt):** Số lượt để lộ đáp án cuối cùng ngay trong câu gợi ý / tổng số ca *"chỉ gợi ý"* hoặc *"sửa bài tương tác"* (`N/A` cho ca yêu cầu giải đầy đủ hoặc tạo học liệu).
4. **Tỷ lệ tuân thủ chế độ (`Mode Adherence Rate`):** Tổng số ca chọn đúng độ dài và chế độ yêu cầu (ngắn cho hỏi nhanh, gợi mở 1 câu hỏi cho xin gợi ý, đầy đủ khi xin giải chi tiết, đúng quy mô quiz) / tổng số ca.
5. **Tỷ lệ không sửa nhầm cách làm đúng (`Valid Alt Preservation Rate`):** Số ca giữ nguyên và công nhận phương pháp đúng khác mẫu / tổng số ca có lời giải đúng khác mẫu.
6. **Tỷ lệ trung thực dữ liệu & nguồn (`Source & Data Integrity Rate`):** Số ca không bịa số liệu, không bịa trích dẫn/Điều luật, không bịa kết quả chạy tool / tổng số ca có rủi ro thiếu dữ kiện hoặc kiểm chứng nguồn.
7. **Độ dài phản hồi (`Chars / Output Tokens`) & Thời gian phản hồi (`Latency ms`):** Thu thập trực tiếp từ API; trường nào API không trả về thì ghi `"không thu thập được"`.

**Cơ chế chấm điểm:**
- **Ưu tiên kiểm tra tự động (Python deterministic checks):** Kiểm tra đáp số định lượng, từ khóa đáp án bị lộ sớm trong mode gợi ý, phát hiện số liệu bịa hoặc cấu trúc Phần III sai QĐ 764, kiểm tra cú pháp Mermaid / Marp.
- **Chấm rubric mù (Blind AI Grader) + Kiểm tra lại thủ công:** Dùng `gemini-3.1-flash-lite` với prompt chấm giấu nhãn điều kiện (`X/Y/Z` ngẫu nhiên hóa) yêu cầu trích nguyên văn bằng chứng; tác giả kiểm tra lại toàn bộ các ca thất bại, ca có mâu thuẫn giữa kiểm tra tự động và AI grader, và các ca Holdout.

---

## 5. Giới hạn & Tiêu chí nghiệm thu
- **Giới hạn ghi nhận sẵn:** (1) Chỉ đánh giá trên Gemini API (`gemini-3-flash-preview`), **không** suy rộng sang giao diện Web ChatGPT/Claude nếu chưa chạy thực tế ở đó; (2) Các ca học sinh đều là tình huống mô phỏng / đề mẫu kiểm chứng đáp án, **không** phải dữ liệu học sinh thật; (3) Với 24 ca trên 16 môn (~1–2 ca/môn), chỉ báo cáo số đếm và tỷ lệ quan sát được, **không** đưa ra tuyên bố *"có ý nghĩa thống kê"* đại diện cho toàn bộ chương trình THPT hay tiến bộ dài hạn của học sinh.
- **Tiêu chí nghiệm thu bản `v2.2.0`:**
  - `validate_skills.py`, `quick_validate.py` và `npm test` đạt 100%, `npx skills add --list` & cài đặt vào dự án tạm ngoài repo thành công.
  - Ở điều kiện Chatbot độc lập (`C1`), `v2.2.0` có tỷ lệ tiết lộ đáp án sớm thấp hơn `v2.0.0` (`B`), độ đúng chuyên môn & liêm chính cao hơn `A` và `B`, không xuất hiện lỗi hồi quy ở các lỗi đã xác nhận (`sinh-hoc-thpt` NST X, `cong-nghe-thpt` $R=38\,\Omega$, `tao-quiz-bgd` 2-phần Sử/KTPL/Tin/Công nghệ, `luan-an-nghiencuu` không bịa số liệu).
