# Mẫu Marp 16:9 & Quy Chuẩn Thiết Kế Slide Sư Phạm

## 1. Bảng lỗi thiết kế cần tránh

| Lỗi thường gặp | Tác hại khi trình chiếu | Cách xử lý |
| :--- | :--- | :--- |
| **Bức tường chữ (Wall of text)** | Chép cả đoạn SGK lên slide khiến người nghe đọc không kịp. | Giới hạn $\le 6$ dòng ý ngắn/slide (6–8 từ/dòng); đẩy phần giải thích sang Speaker Notes. |
| **Độ tương phản kém** | Chữ nhạt trên nền sáng hoặc chữ tối trên nền sẫm bị mờ trên máy chiếu. | Dùng cặp màu tương phản cao: Dark (`#0f172a` / `#f8fafc`) hoặc Light (`#f7f9f6` / `#1d2d24`). |
| **Diễn giải quy trình bằng chữ** | Khó hình dung trình tự bước hoặc so sánh chỉ tiêu. | Chuyển quy trình sang `mermaid` flowchart và chỉ tiêu đối chiếu sang bảng 2–3 cột. |

---

## 2. Mẫu Frontmatter & Bố cục Marp Markdown (16:9)

```markdown
---
marp: true
theme: default
paginate: true
size: 16:9
backgroundColor: #0f172a
color: #f8fafc
style: |
  section {
    font-family: 'Inter', system-ui, sans-serif;
    padding: 40px 60px;
  }
  h1 { color: #38bdf8; font-size: 2.1rem; }
  h2 { color: #a5b4fc; font-size: 1.6rem; margin-bottom: 16px; }
  strong { color: #fbbf24; }
  .stat-card {
    background: rgba(255, 255, 255, 0.06);
    border-left: 4px solid #10b981;
    padding: 14px 18px;
    border-radius: 8px;
    margin-top: 14px;
  }
---

<!-- _class: lead -->
# TIÊU ĐỀ BÀI THUYẾT TRÌNH
### Phụ đề ngắn gọn nêu thông điệp chính
Lớp / Nhóm thực hiện — Môn học THPT

<!--
Speaker Notes:
Lời chào mở đầu và nêu câu hỏi dẫn nhập thu hút sự chú ý của cả lớp trong 30 giây đầu.
-->

---

## 1. Bối cảnh & Vấn đề trọng tâm
- **Điểm chính 1:** Từ khóa cốt lõi ngắn gọn
- **Điểm chính 2:** Tác động trực tiếp cần giải quyết
- **Điểm chính 3:** Mục tiêu đề xuất của nhóm

<div class="stat-card">
  <strong>Trọng tâm:</strong> Tóm gọn 1 câu thông điệp hoặc giả thuyết chính của slide.
</div>

<!--
Speaker Notes:
Giải thích chi tiết bối cảnh từ tài liệu thực tế đã chuẩn bị, không đọc nguyên văn chữ trên màn chiếu.
-->

---

## 2. Quy trình / Mô hình đề xuất

```mermaid
graph LR
  A["Bước 1: Khảo sát"] --> B["Bước 2: Thiết kế"]
  B --> C["Bước 3: Thử nghiệm"]
  C --> D["Bước 4: Đánh giá"]
```

<!--
Speaker Notes:
Trình bày từng giai đoạn và phân công vai trò thực hiện của nhóm.
-->
```

## 3. Hướng dẫn người dùng tự xuất file (khi cần)
Nếu người dùng muốn xuất file từ mã Markdown đã tạo:
1. Mở file `.md` bằng **VS Code** có cài tiện ích **Marp for VS Code**, chọn *Export Slide Deck...* để xuất `.pdf`, `.html` hoặc `.pptx`.
2. Hoặc chạy cục bộ bằng Marp CLI trên máy của người dùng (nếu đã cài `@marp-team/marp-cli`):
   `npx @marp-team/marp-cli slides.md --pdf`
