---
name: tao-quiz-bgd
description: "Thiết kế câu hỏi kiểm tra mức hiểu, bài luyện tập biến thể và đề thi thử THPT cho cả 11 môn lớp 10–12 (HK1 & HK2) theo đúng ma trận Quyết định 764/QĐ-BGDĐT. Sử dụng khi giáo viên hoặc học sinh cần tạo vài câu kiểm chứng, mini-test hoặc đề thi chuẩn kèm phương án nhiễu & đáp án tách riêng."
license: MIT
metadata:
  author: "Nguyễn Duy Quang"
  version: "2.3.0"
  category: "meta-tools"
---

# Tạo Câu Hỏi Luyện Tập & Đề Thi Chuẩn BGD&ĐT (11 Môn Lớp 10 – 12)

## 1. Phạm vi, Bản đồ 3 năm THPT (HK1 & HK2) và Tình huống kích hoạt
- **Mục tiêu:** Thiết kế câu hỏi chẩn đoán lỗ hổng, bài luyện tập biến thể, mini-test ôn tập **lớp 10, 11, 12 (liên thông HK1–HK2)** và đề thi thử chuẩn **Quyết định 764/QĐ-BGDĐT** (08/03/2024) cho toàn bộ **11 môn thi THPT** (Ngữ văn, Toán, Vật lí, Hóa học, Sinh học, Địa lí, Lịch sử, GDKT&PL, Công nghệ Công nghiệp/Nông nghiệp, Tin học CS/ICT, Tiếng Anh).
- **Tự chứa dùng chung:** Toàn bộ **Ma trận 11 môn QĐ 764** và kỹ thuật tạo phương án nhiễu nằm trực tiếp trong tệp `SKILL.md` này, chạy độc lập hoàn toàn khi sao chép vào chatbot hằng ngày, trong dự án, hoặc với công cụ tính toán.

## 2. Cách nhận diện mục tiêu và Quy chuẩn đầu ra theo chế độ
- **Quy mô nhỏ / Kiểm tra mức hiểu (1–3 câu):** Ra **chính xác số câu** người dùng yêu cầu (`"tạo đúng 3 câu"` $\implies$ đúng `3 câu`), tuyệt đối không ép đẻ cả đề 22–28 câu.
- **Mini-test / Ôn tập 2 học kì (5–12 câu):** Tập trung liên thông HK1 $\leftrightarrow$ HK2 và bài toán thực tiễn theo lớp 10/11/12 được hỏi.
- **Đề thi đầy đủ chuẩn QĐ 764 (22 / 28 / 40 câu hoặc tự luận 120 phút):** Chỉ tạo khi người dùng yêu cầu rõ đề thi thử hoàn chỉnh.
- **Hỏi cấu trúc thi QĐ 764 của môn học:** Trả lời ngắn gọn, chính xác thời gian, số câu từng phần I / II / III (đặc biệt chỉ rõ môn nào **không** có Phần III).

## 3. Dữ kiện cần thiết và cách xử lý dữ kiện thiếu
- **Yêu cầu bám tài liệu riêng:** Nếu người dùng nói *"tạo đề từ đoạn văn/bài giảng em gửi"* nhưng chưa dán nội dung $\to$ dừng hỏi dán nội dung trước, không bịa văn bản gốc.
- **Chủ đề chuẩn THPT đã nêu rõ** (như *"3 câu Chiến dịch Biên giới 1950"*): thực hiện ngay đúng quy mô yêu cầu.
- **Ngữ liệu tự biên soạn để luyện tập:** Đánh dấu rõ `[Ngữ liệu minh họa phục vụ luyện tập]`, không bịa tên văn bản/tác giả thật.

## 4. Quy trình & Hệ thống Ma trận 11 Môn QĐ 764 (`Điều kiện → Hành động → Kiểm chứng`)
1. **Ma trận chính thức 11 môn theo Quyết định 764/QĐ-BGDĐT (08/03/2024)** *(đối chiếu SGGP `2026-11-18`: `https://www.sggp.org.vn/bo-gd-dt-ban-hanh-cau-truc-dinh-dang-de-thi-tot-nghiep-thpt-tu-nam-2025-post729940.html`)*:

| Môn thi | Thời gian | Hình thức | Phần I (4 chọn 1) | Phần II (Đúng/Sai) | Phần III (Trả lời ngắn) | Ghi chú đặc thù |
| :--- | :---: | :--- | :---: | :---: | :---: | :--- |
| **Ngữ văn** | 120p | Tự luận | — | — | — | Đọc hiểu ngoài SGK `4,0đ` + Viết `6,0đ` (200 chữ `2,0đ` & 600 chữ `4,0đ`) |
| **Toán** | 90p | Trắc nghiệm | `12 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | `6 câu` (`0,5đ/câu`) | Tổng **22 câu** |
| **Vật lí** | 50p | Trắc nghiệm | `18 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | `6 câu` (`0,25đ/câu`) | Tổng **28 câu** |
| **Hóa học** | 50p | Trắc nghiệm | `18 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | `6 câu` (`0,25đ/câu`) | Tổng **28 câu**, IUPAC & đkc $24.79$ |
| **Sinh học** | 50p | Trắc nghiệm | `18 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | `6 câu` (`0,25đ/câu`) | Tổng **28 câu**, `DNA/RNA` |
| **Địa lí** | 50p | Trắc nghiệm | `18 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | `6 câu` (`0,25đ/câu`) | Tổng **28 câu** |
| **Lịch sử** | 50p | Trắc nghiệm | `24 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | **Không có (0)** | Tổng **28 câu (chỉ 2 phần)** |
| **GDKT&PL** | 50p | Trắc nghiệm | `24 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | **Không có (0)** | Tổng **28 câu (chỉ 2 phần)** |
| **Công nghệ** | 50p | Trắc nghiệm | `24 câu` (`0,25đ`) | `4 câu` (`4,0đ`) | **Không có (0)** | Tách 2 đề Công nghiệp & Nông nghiệp |
| **Tin học** | 50p | Trắc nghiệm | `24 câu chung` (`0,25đ`) | `6 câu (chọn 4)` (`4,0đ`) | **Không có (0)** | In 30 câu, làm **28 câu** (`2 chung + 2 CS hoặc 2 ICT`) |
| **Tiếng Anh** | 50p | Trắc nghiệm | `40 câu` (`0,25đ`) | **Không có (0)** | **Không có (0)** | 100% 4 chọn 1 |

2. **Thang điểm lũy tiến Phần II (Đúng/Sai 4 ý a, b, c, d):** Đúng 1 ý = `0,1đ` | 2 ý = `0,25đ` | 3 ý = `0,5đ` | 4 ý = `1,0đ`.
3. **Kỹ thuật tạo Phương án nhiễu (Distractor Engineering) & Phần III:** Mỗi đáp án sai Phần I phải gắn với 1 lỗi thực tế (nhầm $^\circ\text{C}$/K, quên nhân $10$, $22.4$ vs $24.79$, nhầm Việt Bắc 1947 vs Biên giới 1950); câu Phần II tăng dần độ khó `a) Biết -> b) Hiểu -> c) Vận dụng -> d) VDC`; đáp số Phần III $\le 4$ ký tự (kể cả `-`, dấu thập phân) và ghi rõ yêu cầu làm tròn.

## 5. Cách chẩn đoán và sửa lỗi đề tự soạn
- Khi giáo viên/học sinh gửi đề tự soạn nhờ rà soát $\to$ kiểm tra: (1) đúng số phần QĐ 764 của môn đó (không gán Phần III vào Sử/KTPL/Tin/Công nghệ/Anh); (2) mỗi câu Phần I chỉ có 1 đáp án đúng duy nhất; (3) phương án nhiễu có sát lỗi thật hay quá ngây ngô; (4) đáp số Phần III có $\le 4$ ký tự không.

## 6. Các mức hỗ trợ người học & Cổng kiểm duyệt trước khi xuất (`Pre-Output Gate`)
- Tách **Đề bài** ở trên và **Đáp án + Giải thích** ở cuối (trừ khi yêu cầu in kèm từng câu); nếu học sinh làm thử và sai 1 câu, hướng dẫn gợi mở theo đúng bẫy của phương án nhiễu đó.
- **CỔNG KIỂM DUYỆT:** Trước khi xuất, tự giải lại 100% câu hỏi, đếm đúng số câu yêu cầu (`3 câu` $\implies$ đúng `3 câu`), và kiểm tra không gán nhầm Phần III vào Sử, GDKT&PL, Công nghệ, Tin học hoặc Tiếng Anh.

## 7. Cách phản biện và tự kiểm chứng
- Tự giải độc lập toàn bộ câu hỏi vừa sinh để xác nhận tính duy nhất của đáp án đúng và không có dữ kiện mâu thuẫn; không tự nhận lưu ngân hàng đề ngoài hội thoại.

## 8. Tiêu chí đầu ra chuẩn
- Đúng số lượng câu và đúng cấu trúc QĐ 764 của từng môn.
- Đáp án tách riêng ở cuối đề, kèm giải thích ngắn lý do đúng và lỗi của phương án nhiễu (không xuất `1A, 2B, 3C` trơ trọi).

## 9. Ví dụ mẫu chuẩn, Tương tác & Phản ví dụ
- **Ví dụ chuẩn (Đúng quy mô & đúng cấu trúc QĐ 764):**
  - *Yêu cầu:* "Cho biết cấu trúc QĐ 764 của Lịch sử và Tin học (có Phần III không?), và tạo đúng 3 câu trắc nghiệm Phần I ôn Chiến dịch Biên giới 1950 tách đáp án ở cuối."
  - *Đầu ra mẫu đạt chuẩn:* Trả lời rõ cả Lịch sử (**28 câu: 24 I + 4 II, 0 Phần III**) và Tin học (**đề 30 câu làm 28 câu: 24 I + chọn 4/6 II theo CS/ICT, 0 Phần III**); dưới đó viết **đúng 3 câu** Phần I (Câu 1: mục tiêu khai thông biên giới Việt–Trung; Câu 2: bước ngoặt *giành quyền chủ động chiến lược Bắc Bộ*; Câu 3: phân biệt với Việt Bắc 1947), cuối bài mới có mục **Đáp án & Giải thích** phân tích từng phương án nhiễu.
- **Phản ví dụ cần tránh:** Xin 3 câu ôn tập nhưng tự đẻ cả đề 28 câu, hoặc bịa thêm *"Phần III: Trả lời ngắn"* cho môn Lịch sử / Tin học / GDKT&PL / Công nghệ.

## 10. Datatest Tự kiểm chứng nhanh & Cách hoạt động khi có / không có công cụ
- **Inline Smoke-Test Suite:**
  1. `TEST-1 (Ma trận Sử & Tin + Đúng 3 câu)`: Input yêu cầu hỏi cấu trúc Sử/Tin + tạo đúng 3 câu Biên giới 1950 $\to$ **PASS** nếu nêu **0 câu Phần III** cho cả 2 môn và sinh **đúng 3 câu** tách đáp án cuối.
  2. `TEST-2 (Phần III <= 4 ký tự)`: Input tạo 1 câu Phần III Địa lí/Toán $\to$ **PASS** nếu đáp số tính gọn $\le 4$ ký tự và ghi rõ quy cách làm tròn.
  3. `TEST-3 (Thiếu tài liệu riêng)`: Input *"Tạo 5 câu từ bài giảng em gửi"* (chưa dán bài) $\to$ **PASS** nếu hỏi dán bài giảng trước.
- **Không có công cụ (Chatbot):** Dùng bảng QĐ 764 tại Mục 4 và tự giải tay toàn bộ câu hỏi tính toán.
- **Có công cụ (Python/tìm kiếm/workspace):** Dùng Python tính lại đáp số các câu định lượng; trong workspace có thể đọc thêm [references/exam-matrix-qd764.md](references/exam-matrix-qd764.md) (tùy chọn).
