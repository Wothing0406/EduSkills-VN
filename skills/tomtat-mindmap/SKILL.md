---
name: tomtat-mindmap
description: "Hệ thống hóa kiến thức THPT lớp 10–12 xuyên suốt 2 học kì thành sơ đồ tư duy Mermaid, bảng tổng hợp Cornell và câu hỏi tự kiểm tra (Active Recall). Sử dụng khi học sinh cần tổng ôn chương/cả năm, kết nối HK1–HK2 hoặc tự kiểm tra ghi nhớ."
license: MIT
metadata:
  author: "Nguyễn Duy Quang"
  version: "2.1.0"
  category: "meta-tools"
---

# Tóm tắt Hệ thống & Sơ đồ Tư duy 2 Học kì THPT

## 1. Phạm vi và cách chọn chế độ
- **Phạm vi:** Tổng hợp, kết nối kiến thức giữa Học kì 1 và Học kì 2 (lớp 10, 11, 12) thành cấu trúc trực quan, bảng so sánh cốt lõi và câu hỏi truy hồi chủ động để học sinh tự kiểm tra tiến bộ thực sự. Hoạt động độc lập hoàn toàn.
- **Điều chỉnh đầu ra theo yêu cầu người học** (không ép xuất cả 3 khối dài dòng khi người học chỉ yêu cầu một phần):
  - *Chỉ cần sơ đồ (`mindmap`):* Xuất 1 sơ đồ Mermaid gọn rõ (tối đa 5–7 chữ/nút), liên kết mạch kiến thức HK1 $\leftrightarrow$ HK2.
  - *Chỉ cần bảng ôn / so sánh (`cornell`):* Xuất bảng 3 cột (*Khái niệm/Quy luật* | *Điều kiện & Công thức* | *Lỗi dễ mắc & Cách tự kiểm tra*).
  - *Chế độ tổng ôn đầy đủ (`full`):* Kết hợp Sơ đồ Mermaid + Bảng tổng hợp + 3 câu hỏi tự kiểm tra (Active Recall).
  - *Chế độ tự kiểm tra hiểu bài:* Yêu cầu học sinh **tự giải thích lại bằng lời của mình** hoặc chỉ ra mối liên hệ giữa hai chương thay vì chỉ gật đầu đọc lại.

## 2. Xử lý dữ kiện thiếu và tài liệu riêng
- Nếu người dùng bảo *"tóm tắt giúp em tài liệu vừa học"* mà chưa gửi nội dung: hỏi dán tài liệu vào trước, không tự bịa nội dung không có trong tài liệu đó.
- Nếu nêu tên chuyên đề chuẩn THPT (như *"Tổng ôn cả 2 kì Vật lí 12"*): thực hiện ngay theo chương trình GDPT 2018, làm nổi bật cầu nối từ HK1 sang HK2 và ứng dụng thực tiễn.

## 3. Quy chuẩn kỹ thuật & trung thực
- **Cú pháp Mermaid an toàn:** Trong `flowchart` / `graph`, luôn bọc nhãn có ngoặc hoặc ký tự đặc biệt trong dấu ngoặc kép `id["Nhãn (chi tiết)"]`; trong `mindmap`, viết cụm từ ngắn gọn không nhét khối công thức LaTeX phức tạp vào tên node (để phần công thức ở bảng đối chiếu).
- **Chính xác chuyên môn:** Dùng LaTeX chuẩn (`$...$`), Hóa dùng IUPAC tiếng Anh, Sinh dùng `DNA/RNA` (tránh bẫy loại trừ sai trong phả hệ).
- **Trung thực thực thi:** Không tuyên bố đã xuất file ảnh SVG/PNG khi chỉ cung cấp mã ```mermaid văn bản; không lộ suy nghĩ nội bộ.

## 4. Tài liệu tham chiếu
- Khi cần xem mẫu sơ đồ tư duy an toàn cú pháp, bảng Cornell và mẫu câu hỏi Active Recall kiểm tra mức hiểu: đọc [references/templates-and-mermaid.md](references/templates-and-mermaid.md).

## 5. Ví dụ ngắn
**Ví dụ (Tổng ôn liên thông 2 kì Toán 12):**  
*Yêu cầu:* "Cho em sơ đồ ngắn nối kiến thức HK1 và HK2 của Toán 12 để em tự kiểm tra."  
*Đầu ra phù hợp:* Xuất sơ đồ Mermaid chia 2 nhánh HK1 (*Đạo hàm – Đồ thị; Tọa độ vector $Oxyz$; Độ phân tán mẫu ghép nhóm*) nối sang HK2 (*Nguyên hàm – Tích phân; Phương trình mặt phẳng–đường thẳng–mặt cầu $Oxyz$; Xác suất điều kiện Bayes*) kèm ứng dụng thực tế, và hỏi 1 câu kiểm tra nhanh sự liên kết giữa nguyên hàm và đạo hàm thay vì viết hết bài giảng dài.
