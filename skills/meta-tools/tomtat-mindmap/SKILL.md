---
name: tomtat-mindmap
version: "1.0.0-beta"
description: "Meta-skill tóm tắt nội dung bài học SGK thành sơ đồ tư duy Mermaid.js trực quan và Cheatsheet ghi nhớ nhanh trong 60 giây, hỗ trợ sao chép vào Notion, Obsidian hoặc Markdown viewers."
category: meta-tools
target_audience: "Học sinh ôn tập trước kỳ thi, Giáo viên tóm tắt bài giảng"
tools: [mermaid_generator, cheatsheet_builder]
anti_hallucination_rules:
  - "Cú pháp Mermaid bắt buộc hợp lệ 100% (dùng mindmap hoặc flowchart TD/LR), không dùng các thẻ HTML lạ làm hỏng renderer."
  - "Bắt buộc có bảng Cheatsheet 3 cột: Khái niệm | Công thức cốt lõi | Bẫy cần tránh."
---

# 🧠 Skill: Tóm Tắt Bài Học & Sơ Đồ Tư Duy Mermaid (60s Cheatsheet)

## 1. Mục Đích & Cú Pháp Kích Hoạt
Giúp học sinh cô đọng toàn bộ 10–15 trang sách giáo khoa thành một sơ đồ tư duy trực quan và bảng công thức cốt lõi.

```text
/tomtat-mindmap [Tên bài học hoặc nội dung văn bản]
```
*Ví dụ:* `/tomtat-mindmap "Dao động điều hòa Vật lí 11"`

---

## 2. Bản Mẫu Đầu Ra Chuẩn Mực

### 1. Sơ Đồ Tư Duy Mermaid.js
```mermaid
mindmap
  root((Dao Động Điều Hòa))
    Phương Trình Cốt Lõi
      Li độ: x = A cos(omega t + phi)
      Vận tốc: v = -omega A sin(omega t + phi)
      Gia tốc: a = -omega^2 x
    Đại Lượng Đặc Trưng
      Biên độ A: Độ lệch cực đại
      Tần số góc omega: 2 pi / T = 2 pi f
      Chu kỳ T: Thời gian thực hiện 1 DĐTP
    Năng Lượng
      Động năng: Wd = 1/2 m v^2
      Thế năng: Wt = 1/2 m omega^2 x^2
      Cơ năng: W = Wd + Wt = const
```

### 2. Bảng Cheatsheet Nhớ Nhanh Trong 60 Giây
| Khái Niệm Cốt Lõi | Công Thức Chuẩn | Bẫy Sai Lầm Hay Gặp Trong Đề Thi |
| :--- | :--- | :--- |
| **Pha dao động** | $(\omega t + \varphi)$ | Nhầm giữa pha ban đầu $\varphi$ và pha tại thời điểm $t$. |
| **Vận tốc cực đại** | $v_{\max} = \omega A$ | Vận tốc sớm pha $\pi/2$ so với li độ, vận tốc bằng 0 tại biên. |
| **Gia tốc cực đại** | $a_{\max} = \omega^2 A$ | Gia tốc luôn ngược pha với li độ và luôn hướng về vị trí cân bằng. |
| **Bảo toàn cơ năng** | $W = \frac{1}{2} k A^2$ | Khi động năng tăng thì thế năng giảm, cơ năng không đổi theo thời gian. |
```
