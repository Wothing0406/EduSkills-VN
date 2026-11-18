---
name: slide-thuyet-trinh
description: "Thiết kế dàn ý và mã nguồn slide thuyết trình sư phạm chuẩn Marp Markdown (16:9) hoặc PowerPoint cho bài học, tổng ôn 2 học kì và dự án THPT. Sử dụng khi học sinh hoặc giáo viên cần soạn hoặc rút gọn bài trình chiếu trên lớp."
license: MIT
metadata:
  author: "Nguyễn Duy Quang"
  version: "2.1.0"
  category: "meta-tools"
---

# Thiết kế Slide Thuyết trình THPT

## 1. Phạm vi và cách chọn chế độ
- **Phạm vi:** Chuyển hóa nội dung bài học, chuyên đề tổng ôn HK1–HK2 hoặc dự án học tập THPT (lớp 10–12) thành kịch bản slide trực quan, dễ thuyết trình (mã nguồn Marp Markdown 16:9 hoặc dàn ý từng slide cho PowerPoint/Google Slides). Hoạt động độc lập hoàn toàn.
- **Chế độ hỗ trợ linh hoạt:**
  - *Soạn mã nguồn Marp 16:9:* Khi cần slide markdown sẵn sàng mở bằng VS Code Marp Extension, tách từng trang bằng `---`, kèm lời dẫn nói ở `<!-- Speaker Notes: ... -->`.
  - *Dàn ý thuyết trình (PowerPoint/Google Slides):* Khi người dùng không dùng Marp, liệt kê theo trang: *Tiêu đề | 3–5 ý ngắn | Gợi ý hình/sơ đồ/bảng | Lời dẫn thuyết trình*.
  - *Rút gọn & phản biện slide sẵn có:* Kiểm tra và cắt gọn những slide quá dày chữ (Wall of Text), sửa lỗi độ tương phản kém hoặc thiếu bằng chứng cho số liệu trích trên slide.

## 2. Xử lý dữ kiện thiếu và trung thực số liệu/công cụ
- **Thiếu nội dung nguồn:** Nếu người dùng bảo *"làm slide từ báo cáo em viết"* nhưng chưa dán báo cáo, hỏi dán nội dung trước, không tự bịa số liệu hay luận điểm.
- **Thiếu số lượng slide / màu sắc:** Với chủ đề học tập chuẩn đã nêu rõ, mặc định gợi ý khoảng **6–8 slide** tương phản cao (nền tối `#0f172a` hoặc sáng `#f7f9f6`), ghi chú rõ có thể điều chỉnh số trang.
- **Trung thực số liệu & công cụ:** Mọi số liệu minh họa chưa có đo đạc thực tế phải gắn nhãn `[Số liệu minh họa cấu trúc]`. Tuyệt đối **không** tuyên bố đã xuất hay render file `.pdf`, `.html`, `.pptx` nếu chưa chạy công cụ xuất file thực tế; chỉ xuất mã nguồn Markdown sạch kèm hướng dẫn ngắn để người dùng tự xuất trên máy. Không lộ suy nghĩ nội bộ.

## 3. Quy chuẩn sư phạm thiết kế slide
- **Rule of Six & Tải nhận thức:** Mỗi slide tối đa khoảng 6 ý ngắn (6–8 từ/ý), ưu tiên bảng so sánh đối xứng và sơ đồ Mermaid; đẩy phần diễn giải chi tiết vào Speaker Notes để người nghe tập trung vào từ khóa chính.
- **Kiểm tra trước khi gửi:** Rà xem có slide nào quá tải chữ không, cú pháp phân trang `---` và Mermaid có hợp lệ không, và nội dung trình bày đã có đủ căn cứ học thuật chưa.

## 4. Tài liệu tham chiếu
- Khi cần xem mẫu CSS Marp 16:9, bảng kiểm tra lỗi trình chiếu và hướng dẫn người dùng tự xuất `.pdf`/`.pptx`: đọc [references/marp-templates.md](references/marp-templates.md).

## 5. Ví dụ ngắn
**Ví dụ (Rút gọn slide bị dày chữ):**  
*Học sinh:* "Slide này em lỡ chép cả đoạn 180 chữ từ báo cáo vào nên khó đọc, sửa giúp em thành 1 slide chuẩn."  
*Phản hồi mong đợi:* Tóm thành 3–4 gạch đầu dòng từ khóa (mỗi dòng $\le 8$ từ) trên mặt slide, chuyển phần phân tích đầy đủ 180 chữ vào khối `<!-- Speaker Notes: ... -->`, đồng thời hỏi lại nếu có con số chưa rõ nguồn gốc trong đoạn gốc.
