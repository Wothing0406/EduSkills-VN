---
name: tomtat-mindmap
description: "Hệ thống hóa kiến thức THPT lớp 10–11–12 (HK1 & HK2) thành sơ đồ tư duy Mermaid an toàn cú pháp, bảng phân biệt Cornell, cẩm nang tổng ôn 8 phần (Loại A), Active Recall tách đáp án và sơ đồ tương tác @canvas (Loại D)."
license: MIT
metadata:
  author: "Nguyễn Duy Quang"
  version: "2.4.0"
  category: "meta-tools"
---

# Tóm Tắt Hệ Thống & Sơ Đồ Tư duy THPT (Lớp 10 – 11 – 12)

## 1. Phạm vi, Bản đồ hỗ trợ 3 năm THPT (HK1 & HK2)
- **Mục tiêu:** Trực quan hóa và liên kết kiến thức xuyên suốt **Lớp 10, 11, 12 (HK1–HK2)** ở 11 môn THPT theo GDPT 2018 thành sơ đồ Mermaid chuẩn cú pháp, bảng phân biệt đối chiếu, ma trận bẫy 6 cột và câu hỏi tự kiểm tra Active Recall. Hoạt động độc lập khi dán duy nhất `SKILL.md` vào chatbot hoặc dùng cùng `references/`.

## 2. Quy trình phân loại 4 nhóm yêu cầu (A/B/C/D) & Tiêu chí đầu ra
Điều chỉnh chính xác theo yêu cầu (**quy tắc "1 câu hỏi rồi dừng chờ" CHỈ áp dụng cho Loại B**, không áp cho Loại A, C, D):

- **Chỉ xin sơ đồ gọn (`"chỉ xuất 1 sơ đồ Mermaid"`, `"nhìn 30 giây"`, `"chưa cần bảng dài hay bài tập"`):** Xuất **duy nhất 1 khối** ```` ```mermaid ```` (kèm tối đa 1–2 dòng chú thích ngắn nếu cần), **TUYỆT ĐỐI KHÔNG** chèn bảng Cornell hay câu hỏi bài tập.
- **Loại A — Tổng ôn chương/nhiều chương / Cẩm nang & Bảng hệ thống (`"tổng ôn"`, `"hệ thống hóa chương..."`, `"cẩm nang"`):** Xuất đầy đủ **8 phần** (Bản đồ Mermaid $\to$ Kiến thức cốt lõi từng chương $\to$ Công thức/điều kiện $\to$ Bảng phân biệt đối chiếu Cornell $\to$ Ma trận bẫy 6 cột $\to$ 3–6 câu Active Recall / tự kiểm tra kèm gợi ý mở dần $\to$ Đáp án tách cuối giải thích bẫy $\to$ Mối liên hệ liên chương).
- **Loại B — Chẩn đoán & Sửa sơ đồ học sinh gửi (`"sơ đồ của em sai ở đâu"`, `"gợi ý sửa"`):** Khen nhánh đúng $\to$ chỉ 1 lỗi kiến thức hoặc lỗi cú pháp Mermaid đầu tiên $\to$ đặt **1 câu hỏi kiểm chứng rồi DỪNG CHỜ**.
- **Loại C — Giải thích mối liên hệ & Phản biện (`"vì sao"`, `"kiểm chứng sơ đồ"`):** Phân tích đầy đủ cơ chế (như $\text{O}_2$ quang hợp từ quang phân li $\text{H}_2\text{O}$, pha tối Calvin diễn ra ban ngày) kèm câu hỏi phản ví dụ.
- **Loại D — Tạo `@canvas` / Mindmap tương tác HTML:** Tạo Single-File HTML/JS nhiều tab (Sơ đồ cây đóng/mở nhánh hoặc Flowchart tương tác, Bảng phân biệt & Ma trận bẫy, Quiz Active Recall có gợi ý/đáp án/làm lại thật); công thức sạch không lộ `$...$` thô; hoặc khai báo trung thực nếu chat thuần kèm Mermaid Markdown + `<details>` + mã HTML tự chạy. **Tuyệt đối không tự nhận đã xuất file `.svg`/`.png` nếu không chạy công cụ render thật.**

## 3. Dữ kiện cần thiết và cách xử lý dữ kiện thiếu
- Thiếu tài liệu riêng khi HS nói *"tóm tắt bài giảng em gửi"* $\to$ yêu cầu dán nội dung trước, không bịa nội dung. Chủ đề THPT đã nêu rõ $\to$ triển khai ngay theo GDPT 2018.

## 4. Quy trình & Hệ thống Kỹ thuật Chuyên Môn (`Điều kiện → Hành động → Kiểm chứng`)
1. **Cú pháp `mindmap` an toàn:** Tiếng Việt **có dấu**, mỗi nút $\le 6$ chữ ngắn gọn, thụt lề 2 khoảng trắng nhất quán; **tuyệt đối không nhét LaTeX `$$...$$`** hay ký tự ngoặc/hai chấm phức tạp `( ) [ ] :` vào tên nút `mindmap`.
2. **Cú pháp `flowchart` / `graph` an toàn:** ID viết liền không dấu, mọi nhãn chứa ký tự đặc biệt bọc trong ngoặc kép: `PhaToi["Pha tối (Chu trình Calvin)"]`.
3. **Chuẩn chuyên môn trong tóm tắt:** Toán/Lý đẩy LaTeX sang bảng đối chiếu (không nhét vào nút `mindmap`); Hóa dùng IUPAC & `24.79 L/mol`; Sinh dùng `DNA/RNA` và nhớ **$\text{O}_2$ trong quang hợp sinh ra từ quang phân li $\text{H}_2\text{O}$** ở thylakoid, còn pha tối Calvin diễn ra ở stroma vào **ban ngày** nhờ $\text{ATP, NADPH}$ pha sáng.

## 5. Chẩn đoán sơ đồ (Loại B) & Ma trận bẫy tóm tắt 6 cột (Loại A)
- **Khi ở Loại B:** Khen cấu trúc nhánh hợp lý $\to$ chỉ 1 lỗi kiến thức/cú pháp đầu tiên $\to$ hỏi 1 câu kiểm chứng rồi dừng chờ.
- **Ma trận Bẫy Tóm Tắt & Sơ Đồ 6 cột (Loại A):**

| Dấu hiệu đầu vào | Cách hiểu sai thường gặp | Nguyên nhân | Quy tắc đúng | Ví dụ đối chiếu | Câu tự kiểm tra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Yêu cầu *"chỉ xuất 1 sơ đồ Mermaid gọn"* | Kèm thêm bảng Cornell dài và 5 câu bài tập bên dưới | Áp rập khuôn mọi yêu cầu đều xuất đủ 3 tầng | Tôn trọng phạm vi gọn: **duy nhất 1 khối Mermaid**, không bảng dài hay bài tập | Đề xin 30s nhìn nhanh $\implies$ chỉ xuất ```` ```mermaid ```` | *"Người dùng đã yêu cầu 'chưa cần bảng dài hay bài tập' chưa?"* |
| Viết công thức Toán/Hóa trong nút `mindmap` | Nhét `$$2H_2O \to O_2$$` vào nhánh `mindmap` | Trình phân tích Mermaid `mindmap` coi dấu ngoặc/ký tự đặc biệt là cú pháp node | Nút `mindmap` chỉ dùng chữ Việt gọn $\le 6$ từ; chuyển LaTeX sang bảng/flow bọc `""` | `Quang phân li nước tạo O2` thay vì `$$2H_2O \to O_2$$` | *"Mỗi dòng trong khối mindmap có chứa `$$` hay ngoặc phức tạp dễ vỡ parser không?"* |
| Tóm tắt Quang hợp Sinh 11 | Ghi *"$\text{O}_2$ sinh ra từ $\text{CO}_2$"* hoặc *"pha tối chỉ chạy ban đêm"* | Đọc chữ *"pha tối"* theo nghĩa đen thời gian | $\text{O}_2$ tách từ **quang phân li $\text{H}_2\text{O}$**; pha tối chạy **ban ngày** nhờ ATP/NADPH | Ngừng chiếu sáng $\implies$ pha tối nhanh chóng ngừng theo | *"Vì sao khi không có ánh sáng thì pha tối (Calvin) cũng không duy trì được lâu?"* |

## 6. Hỗ trợ đa mức & Cổng kiểm duyệt hai nhánh (`Pre-Output Gate`)
- **Nhánh Sơ đồ gọn:** Nếu xin *"chỉ xuất 1 sơ đồ gọn... chưa cần bảng dài hay bài tập"*, kiểm tra **0 bảng Cornell và 0 câu Active Recall** ở cuối; không chứa `$$`; **0% nhận đã xuất file `.svg`/`.png`**.
- **Nhánh Loại A & D (`@canvas`):** Đủ bảng phân biệt + ma trận bẫy 6 cột + Active Recall tách đáp án cuối; HTML sạch không lỗi cú pháp.

## 7. Cách phản biện và tự kiểm chứng
- Đặt câu hỏi phản ví dụ buộc học sinh tự nối cơ chế liên chương HK1 $\leftrightarrow$ HK2. Không tự nhận có bộ nhớ ngoài hội thoại.

## 8. Tiêu chí đầu ra chuẩn
- Đúng chế độ (`mindmap`-only vs `cornell` vs Loại A 8 phần vs Loại D `@canvas`). Mermaid dựng được an toàn, có dấu tiếng Việt, trung thực định dạng.

## 9. Ví dụ mẫu đa nhiệm vụ
- **Ví dụ `mindmap`-only Quang hợp Sinh 11:** 1 khối ```` ```mermaid ```` duy nhất: `Pha sáng` (màng thylakoid, quang phân li nước tạo O2, tạo ATP và NADPH) | `Pha tối Calvin` (stroma, diễn ra ban ngày nhờ pha sáng, cố định CO2) | `Nhóm thực vật` (`C3`, `C4`, `CAM`).

## 10. Datatest Tự kiểm chứng nhanh & Cách hoạt động khi có / không có công cụ
- **Inline Smoke-Test Suite:**
  1. `TEST-1 (Chế độ sơ đồ gọn Sinh 11)`: Input *"Chỉ xuất 1 sơ đồ tư duy Mermaid thật gọn Quang hợp Sinh 11, chưa cần bảng dài hay bài tập"* $\to$ **PASS** nếu có ```` ```mermaid ````, nêu `O2` từ `H2O`/nước, không `$$`, không kèm Cornell/bài tập.
  2. `TEST-2 (Trung thực định dạng)`: Khẳng định chỉ xuất được mã Markdown Mermaid (không giả `.svg`/`.png`).
  3. `TEST-3 (Loại A & @canvas)`: Tổng ôn nhiều chương đủ 8 phần + tách đáp án hoặc tab HTML hoạt động thật.
- **Không có công cụ / Có công cụ:** Tự soát thụt lề 2 dấu cách; trong workspace đọc thêm [references/templates-and-mermaid.md](references/templates-and-mermaid.md).
