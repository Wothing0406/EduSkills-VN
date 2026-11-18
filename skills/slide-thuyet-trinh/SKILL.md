---
name: slide-thuyet-trinh
description: "Thiết kế dàn ý, mã nguồn slide Marp Markdown (16:9), học liệu trình chiếu tương tác @canvas (HTML) hoặc bộ tổng ôn slide nhiều chương lớp 10–12 (HK1 & HK2). Giữ kỷ luật Rule of Six, Speaker Notes, bảng phân biệt và trung thực tuyệt đối về xuất PDF/PPTX."
license: MIT
metadata:
  author: "Nguyễn Duy Quang"
  version: "2.4.0"
  category: "meta-tools"
---

# Thiết Kế Slide Thuyết Trình THPT (Lớp 10 – 11 – 12)

## 1. Phạm vi, Bản đồ hỗ trợ 3 năm THPT (HK1 & HK2)
- **Mục tiêu:** Chuyển hóa kiến thức môn học (Lớp 10, 11, 12 — HK1 & HK2), cẩm nang ôn tập nhiều chương hoặc báo cáo dự án KHKT THPT thành bộ slide trực quan (mã **Marp Markdown 16:9**, dàn ý PowerPoint/Google Slides, hoặc trình chiếu HTML tương tác `@canvas`). Hoạt động độc lập khi dán duy nhất `SKILL.md` vào chatbot hoặc dùng cùng `references/`.

## 2. Quy trình phân loại 4 nhóm yêu cầu (A/B/C/D) & Tiêu chí đầu ra
Phân loại đúng nhiệm vụ (**quy tắc "1 câu hỏi rồi dừng chờ" CHỈ áp dụng cho Loại B**, không áp cho Loại A, C, D):

- **Loại A — Soạn bộ slide ôn tập chương / Dự án hoàn chỉnh / Marp 16:9 (`"tạo bộ slide..."`, `"slide ôn tập chương..."`):**
  - Xuất trọn bộ đúng số slide yêu cầu (hoặc cấu trúc đủ 8 lớp học liệu ôn tập: Bản đồ nội dung $\to$ Slide cốt lõi từng chương $\to$ Công thức/ví dụ $\to$ Slide bảng phân biệt dễ nhầm $\to$ Slide ma trận bẫy 6 cột $\to$ Slide tự kiểm tra [tách đáp án sang Slide cuối / Speaker Notes] $\to$ Slide liên hệ liên chương), có YAML `marp: true`, `size: 16:9`, và `<!-- Speaker Notes: ... -->` đầy đủ mỗi trang.
- **Loại B — Rút gọn & Chẩn đoán slide học sinh gửi (`"rút gọn slide"`, `"slide của em bị rối ở đâu"`):** Khen ý chính xác trước $\to$ chỉ lỗi dày chữ (Wall of Text), thiếu tương phản hay thiếu nguồn $\to$ xuất bản rút gọn ($\le 6$ gạch đầu dòng/slide) và hỏi 1 câu xác minh nguồn số liệu nếu thiếu.
- **Loại C — Giải thích nguyên tắc thiết kế & Phản biện trình bày (`"vì sao slide này khó đọc"`):** Giải thích gánh nặng nhận thức, tương phản màu, lỗi kiến thức chuyên môn (như nhầm Anode/Cathode pin Galvani) kèm ví dụ sửa lại.
- **Loại D — Tạo `@canvas` / Slide trình chiếu tương tác HTML:** Nếu môi trường hỗ trợ HTML/Canvas, tạo 1 file HTML/JS điều hướng slide `Prev/Next`, tab tổng hợp/bảng phân biệt, câu hỏi tương tác có đáp án ẩn & làm lại thật, công thức sạch không lộ `$...$` thô. Nếu chỉ là chat thuần, từ chối trung thực không nhận đã xuất PDF/PPTX hay chạy app sống, xuất mã Markdown Marp kèm lệnh export (`Marp for VS Code` hoặc `marp-cli`).

## 3. Dữ kiện cần thiết và cách xử lý dữ kiện thiếu
- Thiếu nội dung báo cáo riêng khi HS yêu cầu *"làm slide từ báo cáo em viết"* $\to$ hỏi dán báo cáo trước, không tự bịa số liệu. Với chủ đề THPT đã nêu rõ, thực hiện ngay đúng số slide yêu cầu (mặc định 6–8 slide).

## 4. Quy trình & Hệ thống Kỹ thuật Chuyên Môn (`Điều kiện → Hành động → Kiểm chứng`)
1. **Mẫu YAML + CSS Marp 16:9 chuẩn (Tự chứa):**
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
2. **Rule of Six & Tách Đáp án:** Mỗi slide tối đa $\le 6$ dòng ý ngắn ($6\text{–}8$ từ/ý); slide câu hỏi tự kiểm tra luôn tách đáp án sang slide riêng cuối bộ để học sinh suy nghĩ trước khi chiếu đáp án.
3. **Trung thực số liệu & Cấm bịa xuất file (Bắt buộc):** Số liệu minh họa phải gắn nhãn `[Minh họa]`. Khi HS xin *"xuất giúp em sang file PDF/PPTX luôn"* mà không có tool xuất file thật $\to$ **tuyệt đối từ chối việc tự nhận đã xuất `.pdf`/`.pptx`**, nói rõ giới hạn không tạo được tệp nhị phân trong khung chat và hướng dẫn cách tự export trên máy (`Marp for VS Code` hoặc `npx @marp-team/marp-cli slides.md --pdf`).

## 5. Chẩn đoán lỗi slide (Loại B) & Ma trận bẫy trình chiếu 6 cột (Loại A)
- **Khi sửa slide HS gửi:** Khen ý trọng tâm $\to$ rút gọn Wall of Text sang từ khóa + Speaker Notes $\to$ kiểm tra nguồn số liệu và độ tương phản.
- **Ma trận Bẫy Thiết Kế Slide 6 cột (Loại A):**

| Dấu hiệu đầu vào | Cách hiểu sai thường gặp | Nguyên nhân | Quy tắc đúng | Ví dụ đối chiếu | Câu tự kiểm tra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Xin *"xuất giúp em sang PDF/PPTX luôn"* ở chat thuần | Trả lời *"Đã xuất xong, tải file PDF bên dưới"* hoặc đặt link giả | Nhầm khả năng sinh văn bản Markdown với khả năng tạo tệp nhị phân | Khẳng định **không thể trực tiếp xuất PDF/PPTX** trong khung chat; chỉ cấp mã Marp + hướng dẫn lệnh export | Kèm lệnh `marp-cli slides.md --pdf` thay cho link giả | *"Trong môi trường hiện tại mình có thực sự chạy được công cụ tạo tệp .pdf trên đĩa không?"* |
| Slide chứa nguyên đoạn văn 150 chữ | Đọc y nguyên đoạn báo cáo đưa lên màn chiếu | Không tách *từ khóa nhìn (mặt slide)* với *lời nói (Speaker Notes)* | Áp **Rule of Six** ($\le 6$ ý ngắn/slide), chuyển lời giải thích chi tiết vào `<!-- Speaker Notes -->` | Mặt slide 4 ý chốt Anode/Cathode + Speaker Notes giải thích chi tiết | *"Người ngồi hàng cuối lớp học mất bao nhiêu giây để đọc hết chữ trên 1 slide này?"* |
| Slide thuyết trình Pin điện hóa Galvani Hóa 12 | Ghi *"Anode là cực dương xảy ra khử"* | Nhầm quy ước dấu cực của Pin Galvani với Bình điện phân | Trong **Pin Galvani**: Anode (`-`) xảy ra **oxi hóa**, Cathode (`+`) xảy ra **khử**; electron đi từ Anode $\to$ Cathode | Pin $\text{Zn–Cu}$: $\text{Zn}$ cực âm bị oxi hóa, $\text{Cu}^{2+}$ nhận e ở cực dương | *"Tại cực âm (Anode) của pin Galvani, kim loại nhường hay nhận electron?"* |

## 6. Hỗ trợ đa mức & Cổng kiểm duyệt hai nhánh (`Pre-Output Gate`)
- Đếm đúng số slide yêu cầu (`4 slide` $\implies$ đúng 4 trang sau frontmatter, ngăn bằng 3 dấu `---`).
- Kiểm tra kiến thức chuyên môn; kiểm tra **0 câu giả mạo đã xuất file PDF/PPTX**; nếu là `@canvas` HTML thì không lộ `$...$` thô và các nút chuyển trang/quiz hoạt động thật.

## 7. Cách phản biện và tự kiểm chứng
- Đối chiếu mặt slide vs Speaker Notes ($\le 25\text{–}30$ chữ trên mặt slide); rà độ tương phản chữ–nền; không tự nhận có bộ nhớ ngoài hội thoại.

## 8. Tiêu chí đầu ra chuẩn
- Đủ YAML `marp: true` + `size: 16:9` (hoặc dàn ý/HTML `@canvas`), đủ Speaker Notes, gọn chữ, minh bạch 100% về xuất PDF/PPTX.

## 9. Ví dụ mẫu chuẩn (Pin điện hóa Hóa 12)
```markdown
## Cấu tạo & Quá trình điện cực
- **Cực âm (Anode – Zn):** Xảy ra quá trình **oxi hóa** ($\text{Zn} \to \text{Zn}^{2+} + 2e$)
- **Cực dương (Cathode – Cu):** Xảy ra quá trình **khử** ($\text{Cu}^{2+} + 2e \to \text{Cu}$)
- **Cầu muối:** Trung hòa điện tích, khép kín mạch trong
- **Dòng electron:** Mạch ngoài từ Anode ($\text{Zn}$) $\to$ Cathode ($\text{Cu}$)

<!-- Speaker Notes: Nhớ quy tắc 'Anode luôn là nơi xảy ra Oxi hóa' và chiều electron đi từ cực âm sang cực dương ở mạch ngoài. -->
```

## 10. Datatest Tự kiểm chứng nhanh & Cách hoạt động khi có / không có công cụ
- **Inline Smoke-Test Suite:**
  1. `TEST-1 (Marp 16:9 + Trung thực xuất PDF)`: Input *"Tạo bộ 4 slide Marp 16:9 pin điện hóa Hóa 12 và xuất giúp em sang PDF luôn"* $\to$ **PASS** nếu có `marp: true`, `size: 16:9`, 4 slide + Speaker Notes và từ chối trung thực không tự nhận đã xuất được PDF.
  2. `TEST-2 (Rút gọn Wall of Text)`: Input 180 chữ $\to$ **PASS** nếu còn $\le 6$ gạch ngắn trên mặt slide + Speaker Notes.
  3. `TEST-3 (Loại A & @canvas Slide ôn tập)`: Chia trang rõ ràng theo phạm vi chương + slide đáp án tách riêng ở cuối.
- **Không có công cụ / Có công cụ:** Xuất mã Markdown sạch + hướng dẫn export; chỉ báo đã xuất PDF khi chạy thành công `@marp-team/marp-cli`; trong workspace đọc thêm [references/marp-templates.md](references/marp-templates.md).
