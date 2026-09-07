---
name: slide-thuyet-trinh
version: "1.0.0-beta"
description: "Meta-skill tạo mã nguồn slide thuyết trình Marp Markdown và HTML/Tailwind CSS Standalone với visual chuẩn quốc tế, tỷ lệ 16:9, bảng màu sang trọng, tối đa 6 dòng/slide, tích hợp sơ đồ Mermaid."
category: meta-tools
target_audience: "Học sinh thuyết trình dự án, Giáo viên soạn bài giảng điện tử"
tools: [marp_compiler, mermaid_renderer, design_styler]
anti_hallucination_rules:
  - "Quy tắc 6 dòng (Rule of Six): Tuyệt đối không quá 6 gạch đầu dòng trên 1 slide. Không viết văn xuôi đặc quánh."
  - "Chuẩn màu sắc cao cấp: Dùng bảng màu HSL/Hex hiện đại (Slate Dark, Cyber Teal, Deep Indigo, Amber Glow). Nghiêm cấm dùng màu nguyên bản #FF0000 hoặc #00FF00."
  - "Bắt buộc chia slide bằng cú pháp Marp `---` và hỗ trợ tỷ lệ 16:9 (`_class: lead`, `paginate: true`)."
---

# 🎨 Skill: Tạo Slide Thuyết Trình Marp / HTML Chuẩn Visual Sang Trọng

## 1. Phong Cách Thiết Kế (Design Philosophy)
Biến mọi bài học khô khan thành một bài thuyết trình chuẩn chuyên nghiệp:
- **Tối giản & Tinh tế:** Khoảng trắng thở tốt, phân cấp chữ rõ ràng (Tiêu đề to, từ khóa in đậm có nền badge).
- **Trực quan hóa:** Ưu tiên sơ đồ quy trình Mermaid, bảng so sánh 2 cột thay vì liệt kê đơn thuần.
- **Tương thích cao:** Mã nguồn xuất ra có thể chuyển đổi thành PDF/PPTX bằng VS Code Marp Extension hoặc mở trực tiếp trên trình duyệt.

---

## 2. Cú Pháp Kích Hoạt & Ví Dụ
```text
/slide-thuyettrinh [Tên bài học] [Số lượng slide mong muốn] [Phong cách: Dark/Light]
```
*Ví dụ:* `/slide-thuyettrinh "Khảo sát sự biến thiên và vẽ đồ thị hàm số Toán 12" 6 dark`

---

## 3. Bản Mẫu Mã Nguồn Marp Markdown Chuẩn Đầu Ra

```markdown
---
marp: true
theme: default
paginate: true
size: 16:9
backgroundColor: #0f172a
color: #e2e8f0
style: |
  section {
    font-family: 'Inter', sans-serif;
    padding: 40px 60px;
  }
  h1 { color: #38bdf8; font-size: 2.2rem; }
  h2 { color: #818cf8; font-size: 1.8rem; }
  strong { color: #f59e0b; }
  .badge {
    background: rgba(56, 189, 248, 0.2);
    border: 1px solid #38bdf8;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 0.9rem;
  }
---

<!-- _class: lead -->
# 📐 KHẢO SÁT HÀM SỐ & ĐẠO HÀM LỚP 12
### Bản Đồ Tư Duy & Quy Chuẩn BGD 2026-2027
<span class="badge">EduSkills-VN Presentation Suite</span>

---

## 📌 1. Bốn Bước Khảo Sát Chuẩn Mực
- **Bước 1:** Tìm tập xác định $D$ của hàm số
- **Bước 2:** Tính đạo hàm $y'$, tìm nghiệm $y' = 0$ và điểm không xác định
- **Bước 3:** Lập **bảng biến thiên** xét dấu đạo hàm
- **Bước 4:** Xác định các đường **tiệm cận** (đứng, ngang, xiên) và vẽ đồ thị

---

## ⚖️ 2. Bảng Phân Biệt Các Đường Tiệm Cận
| Loại Tiệm Cận | Điều Kiện Giới Hạn ($\lim$) | Ý Nghĩa Hình Học |
| :--- | :--- | :--- |
| **Tiệm cận đứng** | $\lim_{x \to x_0^\pm} y = \pm\infty$ | Đường thẳng $x = x_0$ song song trục tung |
| **Tiệm cận ngang** | $\lim_{x \to \pm\infty} y = y_0$ | Đường thẳng $y = y_0$ song song trục hoành |
| **Tiệm cận xiên** | $y = ax + b$ khi $x \to \pm\infty$ | Phân thức bậc tử hơn bậc mẫu đúng 1 bậc |

---

## 💡 3. Các Bẫy Điểm Liệt Trong Đề Thi Mới
- ⚠️ **Quên tập xác định:** Xét tính đơn điệu ngoài miền xác định
- ⚠️ **Dùng dấu hợp $\cup$:** Phải dùng từ *"và"* hoặc dấu phẩy giữa các khoảng đơn điệu
- ⚠️ **Nhầm cực trị:** Điểm cực trị ($x$) khác Giá trị cực trị ($y$)
```
