---
name: tomtat-mindmap
canonical_id: tomtat-mindmap
version: "0.1.2-beta"
description: "Meta-skill cô đọng bài học SGK thành sơ đồ tư duy Mermaid.js đa tầng, khung ghi chép Cornell Note và Cheatsheet ghi nhớ cốt lõi trong 60 giây hỗ trợ ôn thi siêu tốc."
category: meta-tools
target_audience: "Học sinh ôn tập trước kỳ thi, Giáo viên tóm tắt bài giảng, Học sinh ghi chép Cornell"
curriculum: "GDPT 2018 (SGK Thống Nhất 2026-2027)"
author: "Nguyễn Duy Quang <poiairo4628@gmail.com>"
tools: [mermaid_generator, cornell_builder, cheatsheet_synthesizer, active_recall_quizzer]
anti_hallucination_rules:
  - "Cú pháp Mermaid bắt buộc 100% hợp lệ (không chứa ký tự ngoặc tròn, ngoặc vuông không thoát trong nhãn, không dùng HTML lạ làm hỏng renderer)."
  - "Bắt buộc có cấu trúc 3 phần hoàn chỉnh: Sơ đồ tư duy trực quan -> Bảng Cheatsheet ghi nhớ 60s -> 3 câu hỏi tự vấn Active Recall."
  - "Tất cả công thức toán, lý, hóa phải dùng ký hiệu LaTeX chuẩn xác."
tags: [tom-tat, mindmap, mermaid, cornell-note, cheatsheet, on-thi-nhanh]
---

# 🧠 Skill: Tóm Tắt Đa Tầng & Sơ Đồ Tư Duy Mermaid (/tomtat-mindmap)

`tomtat-mindmap` là meta-skill cô đọng kiến thức đỉnh cao, chuyển hóa các bài học SGK dài hàng chục trang thành cấu trúc trực quan, dễ nạp vào não bộ theo nguyên lý **Dual Coding Theory** (Mã hóa kép: Hình ảnh kết hợp Ngôn ngữ).

---

## 1. Cấu Trúc Đầu Ra 3 Tầng Ghi Nhớ

Mỗi lần kích hoạt, kỹ năng sẽ xuất ra trọn vẹn 3 tầng tri thức:

1. **Tầng 1: Sơ đồ tư duy Trực quan (Mermaid Mindmap / Flowchart):** Phân nhánh logic từ khái niệm gốc $\to$ Phân nhánh chính $\to$ Thuộc tính & Công thức chi tiết.
2. **Tầng 2: Bảng Cheatsheet Tinh Gọn 60 Giây (Cornell Framework):** Bảng so sánh 3 cột: *Khái niệm then chốt* | *Công thức cốt lõi* | *Cạm bẫy phòng thi cần tránh*.
3. **Tầng 3: Bộ Câu Hỏi Kích Hoạt Trí Nhớ (Active Recall Flashcards):** 3 câu hỏi tự vấn không đáp án ngay để học sinh tự kiểm tra độ hiểu sâu của não bộ.

---

## 2. Cú Pháp Kích Hoạt

```text
/tomtat-mindmap [Tên bài học hoặc nội dung bài khóa] [Lớp] [Định dạng: mindmap / cornell / full]
```

*Ví dụ:*
- `/tomtat-mindmap "Quang hợp ở thực vật" 11 full`
- `/tomtat-mindmap "Nguyên hàm và tích phân" 12 mindmap`

---

## 3. Bản Mẫu Đầu Ra Tiêu Chuẩn

```markdown
# 🌿 TỔNG HỢP KIẾN THỨC SIÊU TỐC: QUANG HỢP Ở THỰC VẬT (SINH HỌC 11)

### TẦNG 1: SƠ ĐỒ TƯ DUY MERMAID (MINDMAP)
```mermaid
mindmap
  root((Quang Hợp Ở Thực Vật))
    Pha Sáng
      Vi tri: Mang Thylakoid cua luc lap
      Dieu kien: Can truc tiep anh sang
      Nguyen lieu: H2O, NADP+, ADP, Pi
      San pham: O2 giai phong, ATP, NADPH
    Pha Toi Chu Trinh Calvin
      Vi tri: Chat nen Stroma cua luc lap
      Dieu kien: Khong can truc tiep anh sang
      Nguyen lieu: CO2, ATP, NADPH tu pha sang
      San pham: Chat huu co C6H12O6
    Cac Nhom Thuc Vat
      Nhom C3: Lua, khoai, dau - Ho hap sang cao
      Nhom C4: Mia, bap, co long vuc - Nang suat cao
      Nhom CAM: Xuong rong, dua - Dong khi khong ban ngay
```

---

### TẦNG 2: CHEATSHEET 60 GIÂY (CHUẨN CORNELL NOTE)
| Khái Niệm Then Chốt | Bản Chất Khoa Học | Bẫy Thi Trắc Nghiệm Cần Tránh |
| :--- | :--- | :--- |
| **Nguồn gốc khí $O_2$** | Do quá trình **quang phân ly nước** ($2H_2O \to 4H^+ + 4e^- + O_2$) tại màng thylakoid | ⚠️ **Bẫy:** Cho rằng khí $O_2$ sinh ra từ sự phân giải khí $CO_2$ (Sai bản chất hoàn toàn). |
| **Pha tối (Chu trình Calvin)** | Xảy ra cả ở thực vật C3, C4 và CAM; tổng hợp glucose từ $CO_2$ nhờ ATP và NADPH | ⚠️ **Bẫy:** Nghĩ pha tối diễn ra vào ban đêm. Pha tối diễn ra vào ban ngày khi có sản phẩm pha sáng. |
| **Thực vật CAM** | Khí khổng **mở ban đêm**, đóng ban ngày để hạn chế thoát hơi nước | ⚠️ **Bẫy:** Nhầm thời điểm cố định $CO_2$ ban đêm là của nhóm C4 (C4 cố định ban ngày). |

---

### TẦNG 3: BỘ CÂU HỎI TỰ VẤN (ACTIVE RECALL)
1. *Tại sao nếu chiếu sáng liên tục nhưng cắt nguồn cung cấp $CO_2$ thì pha sáng cũng sẽ dừng lại sau một thời gian ngắn?*
2. *Chất nhận $CO_2$ đầu tiên ở thực vật C3 và thực vật C4 khác nhau như thế nào?*
3. *Hiện tượng hô hấp sáng (photorespiration) làm lãng phí bao nhiêu phần trăm sản phẩm quang hợp ở thực vật C3?*
```

---

## 4. One-Click System Prompt

```text
Bạn là Chuyên gia Siêu Trí Nhớ & Phương pháp Sư phạm Tinh Gọn hàng đầu THPT.

Khi nhận được nội dung bài học từ học sinh:
1. Chiết xuất kiến thức thành sơ đồ Mermaid chuẩn (cú pháp hợp lệ 100%, rõ ràng phân nhánh).
2. Lập bảng Cornell Cheatsheet 60 giây gồm: Khái niệm | Công thức cốt lõi | Bẫy đề thi cần tránh.
3. Soạn 3 câu hỏi Active Recall kích hoạt tư duy phản biện.
4. Giữ giọng văn khuyến khích, truyền cảm hứng học tập và súc tích.
```
