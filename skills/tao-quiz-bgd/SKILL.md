---
name: tao-quiz-bgd
description: "Thiết kế câu hỏi tự kiểm tra, bài luyện tập ôn giữa kỳ và đề thi thử chuẩn Quyết định 764/QĐ-BGDĐT cho cả 11 môn THPT lớp 10–12 (HK1 & HK2). Tạo bài tự kiểm tra tách/ẩn đáp án, giải thích phương án nhiễu có vẻ hợp lý, ma trận bẫy 6 cột và quiz tương tác @canvas."
license: MIT
metadata:
  author: "Nguyễn Duy Quang"
  version: "2.4.0"
  category: "meta-tools"
---

# Tạo Câu Hỏi Tự Kiểm Tra & Đề Thi Chuẩn THPT (11 Môn Lớp 10 – 12)

## 1. Phạm vi, Bản đồ 3 năm THPT (HK1 & HK2)
- **Mục tiêu:** Thiết kế câu hỏi chẩn đoán lỗ hổng, bài tự kiểm tra ôn tập giữa kỳ/cuối kỳ **lớp 10, 11, 12 (HK1–HK2)** và đề thi thử tốt nghiệp chuẩn **Quyết định 764/QĐ-BGDĐT** (08/03/2024) cho toàn bộ **11 môn thi THPT**. Hoạt động độc lập khi dán duy nhất `SKILL.md` vào chatbot hoặc dùng cùng `references/`.

## 2. Quy trình phân loại 4 nhóm yêu cầu (A/B/C/D) & Tiêu chí đầu ra
Phân loại đúng nhiệm vụ (**quy tắc "1 câu hỏi rồi dừng chờ" CHỈ áp dụng cho Loại B**, không áp cho Loại A, C, D):

- **Loại A — Tạo bài tự kiểm tra / Ôn giữa kỳ / Mini-test / Cẩm nang luyện tập (`"tạo bài tự kiểm tra, để tôi làm trước rồi mới xem đáp án"`, `"ôn tập giữa kì"`, `"tạo đúng 3 câu"`):**
  - **KHÔNG ép định dạng đề tốt nghiệp 22/28/40 câu QĐ 764** lên bài ôn tập giữa kỳ hoặc bài luyện ngắn (nếu xin `3 câu` $\implies$ đúng `3 câu`; nếu xin tự kiểm tra giữa kỳ $\implies$ 6–12 câu đa dạng mức độ phủ đúng các chương được hỏi!).
  - Tích hợp rèn tư duy: **gợi ý mở dần**, **đáp án tách hoàn toàn xuống cuối bài hoặc ẩn trong `<details>`**, giải thích rõ **vì sao đáp án đúng chuẩn và vì sao phương án sai nghe có vẻ hợp lý**, kèm **1–2 câu hỏi phản ví dụ / kiểm tra điều kiện**, **1 câu biến thể** và **rubric tự đánh giá**.
- **Đề thi đầy đủ chuẩn QĐ 764 (22 / 28 / 40 câu hoặc tự luận 120 phút):** Chỉ tạo khi người dùng yêu cầu rõ *"đề thi thử tốt nghiệp / chuẩn QĐ 764"*.
- **Hỏi cấu trúc thi QĐ 764 của môn học:** Trả lời ngắn gọn, chính xác thời gian, số câu từng phần I / II / III (nêu rõ môn **không** có Phần III).
- **Loại B — Chẩn đoán & Sửa đề tự soạn / Gợi ý làm lại câu sai (`"gợi ý câu này"`, `"sửa đề"`):** Chỉ lỗi cấu trúc/phương án nhiễu sai đầu tiên, hỏi 1 câu rồi dừng chờ khi HS đang làm thử bài tập.
- **Loại C — Giải thích đầy đủ từng phương án (`"vì sao đúng/sai"`):** Giải thích tường minh đủ cả A/B/C/D, chỉ rõ bẫy tâm lý khiến phương án nhiễu có vẻ đúng kèm phản ví dụ.
- **Loại D — Tạo `@canvas` / Bài kiểm tra tương tác:** Tạo Single-File HTML/CSS/JS hoàn chỉnh (CẤM comment giữ chỗ `// Thêm logic...`, CẤM lộ `$...$`/`\frac` thô) gồm tab lý thuyết/câu hỏi, tối thiểu 3–5 câu với **3 nút JS thật: Gợi ý mở dần, Chấm điểm/Xem đáp án giải thích A–D, Làm lại**; nếu chat thuần thì khai báo trung thực và dùng `<details>` ẩn gợi ý/đáp án hoặc xuất full `.html`.

## 3. Dữ kiện cần thiết và cách xử lý dữ kiện thiếu
- Yêu cầu bám tài liệu riêng chưa dán $\to$ hỏi dán tài liệu trước. Chủ đề THPT đã nêu rõ $\to$ thực hiện ngay đúng quy mô. Ngữ liệu tự biên soạn $\to$ gắn nhãn `[Ngữ liệu minh họa phục vụ luyện tập]`.

## 4. Hệ thống Ma trận 11 Môn QĐ 764 & Kỹ thuật Phương án nhiễu (`Điều kiện → Hành động → Kiểm chứng`)
1. **Ma trận chính thức 11 môn theo Quyết định 764/QĐ-BGDĐT (08/03/2024):**

| Môn thi | Thời gian | Hình thức | Phần I (4 chọn 1) | Phần II (Đúng/Sai) | Phần III (Trả lời ngắn) | Ghi chú đặc thù |
| :--- | :---: | :--- | :---: | :---: | :---: | :--- |
| **Ngữ văn** | 120p | Tự luận | — | — | — | Đọc hiểu ngoài SGK `4,0đ` + Viết `6,0đ` (`200/600` chữ) |
| **Toán** | 90p | Trắc nghiệm | `12 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | `6 câu` (`0,5đ/câu`) | Tổng **22 câu** |
| **Vật lí** | 50p | Trắc nghiệm | `18 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | `6 câu` (`0,25đ/câu`) | Tổng **28 câu**, hệ SI |
| **Hóa học** | 50p | Trắc nghiệm | `18 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | `6 câu` (`0,25đ/câu`) | Tổng **28 câu**, IUPAC & đkc $24.79$ |
| **Sinh học** | 50p | Trắc nghiệm | `18 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | `6 câu` (`0,25đ/câu`) | Tổng **28 câu**, `DNA/RNA` |
| **Địa lí** | 50p | Trắc nghiệm | `18 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | `6 câu` (`0,25đ/câu`) | Tổng **28 câu**, `34 ĐVHC` |
| **Lịch sử** | 50p | Trắc nghiệm | `24 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | **Không có (0)** | Tổng **28 câu (chỉ 2 phần)** |
| **GDKT&PL** | 50p | Trắc nghiệm | `24 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | **Không có (0)** | Tổng **28 câu (chỉ 2 phần)** |
| **Công nghệ** | 50p | Trắc nghiệm | `24 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | **Không có (0)** | Tách 2 đề Công nghiệp & Nông nghiệp |
| **Tin học** | 50p | Trắc nghiệm | `24 câu chung` (`0,25đ`) | `6 câu (chọn 4)` (`4,0đ`) | **Không có (0)** | In 30 câu, làm **28 câu** (`2 chung + 2 CS/ICT`) |
| **Tiếng Anh** | 50p | Trắc nghiệm | `40 câu` (`0,25đ`) | **Không có (0)** | **Không có (0)** | 100% 4 chọn 1 |

2. **Thang điểm lũy tiến Phần II:** Đúng 1 ý = `0,1đ` | 2 ý = `0,25đ` | 3 ý = `0,5đ` | 4 ý = `1,0đ`. Đáp số Phần III $\le 4$ ký tự (gồm `-`, dấu thập phân) và ghi rõ quy cách làm tròn.
3. **Kỹ thuật phương án nhiễu (Distractor Engineering):** Mỗi phương án sai phải ứng với một bẫy thật có vẻ hợp lý (quên đổi Kelvin, $22.4$ vs $24.79$, ester phenol `1:1`, dipeptide có biuret, Fructose mất màu $\text{Br}_2$, Việt Bắc 1947 vs Biên giới 1950).

## 5. Chẩn đoán lỗi đề tự soạn (Loại B) & Ma trận bẫy thiết kế đề 6 cột (Loại A)
- **Khi rà đề tự soạn:** Kiểm tra số phần QĐ 764, tính duy nhất đáp án đúng, độ sắc của phương án nhiễu và giới hạn $\le 4$ ký tự Phần III.
- **Ma trận Bẫy Thiết Kế Đề 6 cột (Loại A):**

| Dấu hiệu câu hỏi | Cách hiểu sai thường gặp | Nguyên nhân | Quy tắc đúng | Ví dụ đối chiếu | Câu tự kiểm tra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Yêu cầu *"ôn tập giữa kì"* | Tự ép ra đúng 28 câu chuẩn đề thi tốt nghiệp QĐ 764 | Đồng nhất mọi bài luyện tập với kỳ thi tốt nghiệp THPT | Chọn độ dài và tỉ lệ câu phù hợp ôn giữa kỳ đúng số chương được hỏi | 6–12 câu chia đều Ch.1–Ch.3 kèm đáp án tách | *"Bài ôn giữa kỳ 1–3 chương nên chia đều câu trọng tâm hay ép thi đủ chương trình cả năm?"* |
| Lịch sử / Tin học / KTPL / Công nghệ | Thêm *"Phần III trả lời ngắn"* | Áp nhầm mẫu môn KHTN/Địa cho toàn bộ 11 môn | Sử, KTPL, Công nghệ, Tin học **CHỈ CÓ 2 PHẦN (0 Phần III)** | Sử/KTPL: `24 I + 4 II` | *"Trong bảng 11 môn QĐ 764, những môn nào có 0 câu Phần III?"* |
| *"Để tôi làm trước rồi mới xem đáp án"* | In đáp án ngay dưới mỗi câu hoặc không xuất đáp án luôn | Bỏ sót yêu cầu tự kiểm tra có đối chiếu | Đặt trọn **Đề bài + Gợi ý mở dần** ở trên, tách **Đáp án & Giải thích** ở cuối/trong `<details>` | Mục Đáp án nằm sau đường kẻ `---` cuối cùng | *"Học sinh nhìn Câu 1 ở trên có vô tình thấy ngay đáp án Câu 1 bên dưới không?"* |

## 6. Hỗ trợ đa mức & Cổng kiểm duyệt (`Pre-Output Gate`)
- Tự giải lại 100% câu hỏi vừa sinh; kiểm tra đúng số lượng câu yêu cầu (`3 câu` $\implies$ `3 câu`); đảm bảo đáp án tách riêng/ẩn hoàn toàn nếu HS muốn làm trước; kiểm tra **0 câu Phần III** với Sử/KTPL/Tin/Công nghệ/Anh.

## 7. Cách phản biện và tự kiểm chứng
- Giải thích tường minh tại sao từng phương án nhiễu lại trông hấp dẫn với học sinh; kèm 1 câu hỏi kiểm tra điều kiện/biến thể; không tự nhận lưu ngân hàng đề ngoài phiên trò chuyện.

## 8. Tiêu chí đầu ra chuẩn
- Đúng quy mô và đúng mục tiêu kỳ thi (giữa kỳ vs QĐ 764 tốt nghiệp). Đáp án tách riêng kèm giải thích lý do đúng, lý do nhiễu hợp lý và rubric tự đánh giá.

## 9. Ví dụ mẫu đa nhiệm vụ
- **Mẫu đúng QĐ 764 (Sử & Tin):** Nêu rõ cả hai môn **0 câu Phần III** + sinh đúng `3` câu Biên giới 1950 + Đáp án tách cuối phân tích từng phương án nhiễu.
- **Mẫu Loại A (Tự kiểm tra giữa kỳ Hóa 12 Ch.1–3):** Gồm 6 câu chia đều Ch.1 Ester–Lipid, Ch.2 Carbohydrate, Ch.3 Amine–Peptide + Gợi ý mở dần ẩn + Đáp án tách cuối có phân tích phương án sai + câu biến thể + tự đánh giá.

## 10. Datatest Tự kiểm chứng nhanh & Cách hoạt động khi có / không có công cụ
- **Inline Smoke-Test Suite:**
  1. `TEST-1 (Ma trận Sử & Tin + Đúng 3 câu)`: Nêu **0 câu Phần III** cho cả 2 môn và đúng `3 câu` tách đáp án cuối.
  2. `TEST-2 (Bài tự kiểm tra giữa kỳ tách đáp án)`: Input *"Tạo bài tự kiểm tra Hóa 12 Ch.1–3 để tôi làm trước rồi mới xem đáp án"* $\to$ **PASS** nếu không ép 28 câu QĐ 764, tách đáp án xuống cuối, giải thích vì sao đáp án sai có vẻ hợp lý.
  3. `TEST-3 (Thiếu tài liệu riêng)`: Dừng hỏi dán bài giảng trước khi ra đề.
- **Không có công cụ / Có công cụ:** Tự giải lại mọi câu tính toán; trong workspace đọc thêm [references/exam-matrix-qd764.md](references/exam-matrix-qd764.md).
