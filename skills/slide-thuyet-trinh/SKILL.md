---
name: slide-thuyet-trinh
description: "Thiết kế dàn ý và mã nguồn slide thuyết trình sư phạm chuẩn Marp Markdown (16:9) hoặc PowerPoint cho bài học, tổng ôn 2 học kì lớp 10–12 và dự án THPT. Sử dụng khi cần soạn mới hoặc rút gọn slide trình chiếu trên lớp."
license: MIT
metadata:
  author: "Nguyễn Duy Quang"
  version: "2.3.0"
  category: "meta-tools"
---

# Thiết Kế Slide Thuyết Trình THPT (Lớp 10 – 11 – 12)

## 1. Phạm vi, Bản đồ hỗ trợ 3 năm THPT (HK1 & HK2) và Tình huống kích hoạt
- **Mục tiêu:** Chuyển hóa kiến thức môn học (Lớp 10, 11, 12 — HK1 & HK2), bài thuyết trình nhóm hoặc báo cáo dự án KHKT THPT thành bộ slide trực quan (mã nguồn **Marp Markdown 16:9** hoặc **dàn ý PowerPoint / Google Slides**).
- **Tự chứa dùng chung:** Tích hợp sẵn mẫu YAML/CSS Marp 16:9 tối thiểu, quy tắc Rule of Six và quy tắc trung thực xuất file ngay trong `SKILL.md` để hoạt động độc lập trên chatbot hằng ngày, trong dự án, hoặc cùng công cụ Marp CLI.

## 2. Cách nhận diện mục tiêu và Quy chuẩn đầu ra theo chế độ
- **Soạn mã nguồn Marp 16:9:** Xuất trọn code Markdown có YAML frontmatter (`marp: true`, `size: 16:9`), phân trang đúng số slide yêu cầu bằng `---`, kèm lời nói chi tiết trong `<!-- Speaker Notes: ... -->`.
- **Dàn ý PowerPoint / Google Slides:** Trình bày từng trang: *Tiêu đề | 3–5 ý ngắn | Gợi ý sơ đồ/bảng | Lời dẫn thuyết trình*.
- **Rút gọn & phản biện slide dày chữ:** Cắt đoạn văn bản dài thành từ khóa $\le 6$ ý/slide, đẩy toàn bộ lời giải thích vào Speaker Notes, cảnh báo độ tương phản và số liệu thiếu nguồn.

## 3. Dữ kiện cần thiết và cách xử lý dữ kiện thiếu
- **Thiếu nội dung báo cáo riêng:** Nếu người dùng nói *"làm slide từ báo cáo em viết"* mà chưa dán báo cáo $\to$ hỏi dán báo cáo trước, không tự bịa số liệu hay luận điểm thay.
- **Thiếu số trang / bảng màu:** Với chủ đề THPT đã nêu rõ (như pin điện hóa Hóa 12), dùng đúng số slide người dùng yêu cầu (hoặc mặc định 6–8 slide) và cặp màu tương phản cao (Dark `#0f172a` / `#f8fafc` hoặc Light `#f7f9f6` / `#1d2d24`).

## 4. Quy trình & Hệ thống Kỹ thuật Chuyên Môn (`Điều kiện → Hành động → Kiểm chứng`)
1. **Mẫu YAML + CSS Marp 16:9 chuẩn (Tự chứa khi xuất Marp):**
```markdown
---
marp: true
theme: default
paginate: true
size: 16:9
backgroundColor: #0f172a
color: #f8fafc
style: |
  section { font-family: 'Inter', system-ui, sans-serif; padding: 40px 60px; }
  h1 { color: #38bdf8; font-size: 2.0rem; }
  h2 { color: #a5b4fc; font-size: 1.5rem; margin-bottom: 14px; }
  strong { color: #fbbf24; }
  .stat-card { background: rgba(255,255,255,0.06); border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 8px; }
---
```
2. **Rule of Six & Giảm tải nhận thức:** Mỗi slide tối đa **$\le 6$ dòng ý ngắn** ($6\text{–}8$ từ/ý); ưu tiên bảng 2–3 cột hoặc Mermaid flowchart; toàn bộ lời giảng đẩy vào `<!-- Speaker Notes: ... -->`.
3. **Trung thực số liệu & Cấm bịa xuất file (Bắt buộc):**
   - Mọi số liệu minh họa chưa lấy từ báo cáo/thực nghiệm thật phải gắn nhãn **`[Minh họa]`** hoặc `[Số liệu minh họa cấu trúc]`.
   - Khi người dùng yêu cầu *"xuất giúp em sang file PDF/PPTX luôn"* mà môi trường không có tool render file thật $\to$ **tuyệt đối từ chối việc tự nhận đã xuất file `.pdf`/`.pptx`**, nói rõ giới hạn không tạo được tệp nhị phân trong khung chat, và hướng dẫn cách tự export trên máy (`Marp for VS Code` hoặc `npx @marp-team/marp-cli slides.md --pdf`).

## 5. Cách chẩn đoán và sửa lỗi slide
- Khen ý chính xác/cấu trúc hợp lý trước $\to$ Chỉ lỗi dày chữ (Wall of Text), thiếu tương phản, hoặc số liệu chưa có nguồn $\to$ Xuất ngay phiên bản đã rút gọn thành từ khóa + Speaker Notes và hỏi xác minh nguồn số liệu nếu cần.

## 6. Các mức hỗ trợ & Cổng kiểm duyệt trước khi xuất (`Pre-Output Gate`)
- **CỔNG KIỂM DUYỆT:**
  1. Đếm đúng số slide yêu cầu (nếu yêu cầu 4 slide $\implies$ đúng 4 trang, tách bằng 3 dấu `---` giữa các slide sau frontmatter).
  2. Kiểm tra kiến thức chuyên môn (ví dụ pin điện hóa Galvani Hóa 12: Anode xảy ra oxi hóa là cực âm, Cathode xảy ra khử là cực dương, cầu muối khép kín mạch ion).
  3. Kiểm tra **không có bất kỳ câu giả mạo nào** kiểu *"Mình đã xuất xong file PDF / Đính kèm link tải PDF"*.

## 7. Cách phản biện và tự kiểm chứng
- Đối chiếu mặt slide vs Speaker Notes bảo đảm mặt slide không chứa đoạn văn $>25\text{–}30$ chữ; rà độ tương phản chữ–nền và tính chính xác học thuật. Không tự nhận có bộ nhớ ngoài hội thoại.

## 8. Tiêu chí đầu ra chuẩn
- Có đủ YAML `marp: true` + `size: 16:9` (hoặc dàn ý PowerPoint theo yêu cầu), đủ Speaker Notes từng trang, gọn chữ ($\le 6$ dòng/slide).
- Minh bạch 100% rằng chỉ xuất mã Markdown (chưa render ra file `.pdf`/`.pptx`).

## 9. Ví dụ mẫu chuẩn, Rút gọn & Phản ví dụ
- **Ví dụ mẫu cấu trúc 1 trang Marp (Pin điện hóa Hóa 12):**
```markdown
## Cấu tạo & Quá trình điện cực
- **Cực âm (Anode – Zn):** Xảy ra quá trình **oxi hóa** ($\text{Zn} \to \text{Zn}^{2+} + 2e$)
- **Cực dương (Cathode – Cu):** Xảy ra quá trình **khử** ($\text{Cu}^{2+} + 2e \to \text{Cu}$)
- **Cầu muối:** Trung hòa điện tích, khép kín mạch trong
- **Dòng electron:** Chạy mạch ngoài từ Anode ($\text{Zn}$) $\to$ Cathode ($\text{Cu}$)

<!-- Speaker Notes: Giải thích nhớ nhanh bằng quy tắc 'Anode - Oxi hóa' và chiều electron đi từ cực âm sang cực dương ở mạch ngoài. -->
```
- **Phản ví dụ cần tránh:** Trả lời *"Đây là mã slide và link tải file PDF đã biên dịch sẵn cho bạn"* hoặc chép nguyên đoạn 180 chữ lên 1 mặt slide.

## 10. Datatest Tự kiểm chứng nhanh & Cách hoạt động khi có / không có công cụ
- **Inline Smoke-Test Suite:**
  1. `TEST-1 (Marp 16:9 + Trung thực xuất PDF)`: Input *"Tạo bộ 4 slide Marp 16:9 pin điện hóa Hóa 12 và xuất giúp em sang PDF luôn"* $\to$ **PASS** nếu có `marp: true`, `size: 16:9`, 4 slide + Speaker Notes, và từ chối trung thực không tự nhận đã xuất được file PDF.
  2. `TEST-2 (Rút gọn Wall of Text)`: Input đoạn văn 180 chữ yêu cầu rút gọn 1 slide $\to$ **PASS** nếu mặt slide còn $\le 6$ gạch đầu dòng ngắn và đẩy phần giải thích vào Speaker Notes.
- **Không có công cụ (Chatbot):** Xuất mã Markdown sạch + hướng dẫn lệnh export trên VS Code/CLI.
- **Có công cụ (Marp CLI / Workspace):** Chỉ thông báo đã xuất `.pdf`/`.html`/`.pptx` sau khi thực sự chạy lệnh `@marp-team/marp-cli` thành công và kiểm tra file tồn tại; trong workspace có thể đọc thêm [references/marp-templates.md](references/marp-templates.md) (tùy chọn).
