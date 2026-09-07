---
name: tao-quiz-bgd
canonical_id: tao-quiz-bgd
version: "1.0.0-beta"
description: "Meta-skill tạo đề kiểm tra và đề thi thử chuẩn cấu trúc 3 phần của Bộ GD&ĐT (2025–2027) ĐỘ KHÓ CAO dựa trên TÀI LIỆU/NGỮ LIỆU ĐÍNH KÈM của người dùng. Bắt buộc người dùng cung cấp tài liệu trước khi sinh đề."
category: meta-tools
target_audience: "Học sinh THPT & Giáo viên luyện thi tốt nghiệp THPT"
curriculum: "GDPT 2018 (SGK Thống Nhất Toàn Quốc 2026-2027)"
exam_format: "Quyết định 764/QĐ-BGDĐT"
author: "Nguyễn Duy Quang <poiairo4628@gmail.com>"
tools: [document_parser, latex_renderer, rubric_calculator, assessment_engine]
anti_hallucination_rules:
  - "BẮT BUỘC: Yêu cầu người dùng cung cấp tài liệu/nội dung học phần (văn bản, tóm tắt bài học, file PDF SGK, hình ảnh bài đọc) TRƯỚC KHI sinh câu hỏi. Tuyệt đối KHÔNG sinh đề vu vơ ngoài nội dung tài liệu được giao."
  - "ĐỘ KHÓ CAO: Phải tập trung sâu vào cấp độ Vận dụng và Vận dụng cao. Các phương án nhiễu (distractors) phải bám vào những lỗi tư duy và sai lầm tính toán kinh điển của học sinh."
  - "Phần II Đúng/Sai: Phải có 1 phần dẫn bài toán tổng quát và đúng 4 ý a, b, c, d liên hoàn biện luận logic. Bắt buộc áp dụng barem điểm lũy tiến: 1 ý đúng = 0.1đ; 2 ý đúng = 0.25đ; 3 ý đúng = 0.5đ; 4 ý đúng = 1.0đ."
  - "Phần III Trả lời ngắn: Chỉ chấp nhận đáp số là số nguyên hoặc số thập phân rút gọn tối đa 4 ký tự."
  - "Mọi công thức toán, vật lí, hóa học phải render bằng LaTeX chuẩn ($...$ hoặc $$...$$)."
tags: [tao-quiz-bgd, de-thi-thu-thpt, dung-sai-4-y, tra-loi-ngan, bgd-2026]
---

# 🎯 Skill: Tạo Đề Thi Chuẩn Ma Trận Bộ Giáo Dục & Đào Tạo (Độ Khó Cao & Dựa Trên Tài Liệu Đính Kèm)

## 1. Nguyên Tắc Cốt Lõi: "Document-First Workflow" (Tài Liệu Là Tiên Quyết)
Để đảm bảo đề thi bám sát 100% nội dung học sinh đang học trên lớp và triệt tiêu hoàn toàn tình trạng AI "chém gió/sinh đề rác", kỹ năng này áp dụng quy trình 2 bước nghiêm ngặt:

```mermaid
sequenceDiagram
    autonumber
    actor User as Học Sinh / Giáo Viên
    participant Skill as Skill /taoquiz-bgd
    participant Engine as Assessment Engine BGD

    User->>Skill: Gửi lệnh kèm TÀI LIỆU (Đoạn trích SGK, tóm tắt bài, bảng số liệu, file bài học)
    alt Không đính kèm tài liệu
        Skill-->>User: DỪNG LẠI! Nhắc nhở người dùng gửi nội dung tài liệu trước.
    else Đã có tài liệu hợp lệ
        Skill->>Engine: Bóc tách kiến thức trọng tâm + Các bẫy sai lầm tiềm ẩn
        Engine->>Engine: Thiết kế ma trận câu hỏi Vận dụng & Vận dụng cao
        Engine-->>User: Xuất đề thi chuẩn 3 phần + Barem điểm lũy tiến + Lời giải chi tiết
    end
```

---

## 2. Giao Thức Kích Hoạt (Execution Protocol)

### Bước 1: Kiểm Tra Dữ Liệu Đầu Vào (Input Gate)
Nếu người dùng chỉ gõ:
`/taoquiz-bgd môn Toán 12` (mà KHÔNG đính kèm hoặc dán nội dung tài liệu)
$\to$ **Hành vi bắt buộc của AI:**
> *"Em vui lòng dán nội dung bài học, chụp ảnh trang sách giáo khoa hoặc cung cấp tài liệu cần ôn tập vào đây. `/taoquiz-bgd` cần đọc dữ liệu chuẩn của em để thiết kế ma trận câu hỏi Vận dụng cao và các phương án bẫy chính xác nhất!"*

### Bước 2: Phân Tích Tài Liệu Khi Đã Nhận Được Nội Dung
1.  **Trích xuất từ khóa & định lý:** Rút ra các công thức cốt lõi, bảng số liệu, hiện tượng hoặc luận điểm chính trong tài liệu.
2.  **Xác định các bẫy tư duy (Distractor Engineering):**
    *   Học sinh hay quên điều kiện gì? (quên chia 2 vế, quên điều kiện xác định, quên đổi đơn vị SI).
    *   Các con số nào dễ gây nhầm lẫn nếu học sinh tính sai ở bước 1?
3.  **Tạo lập đề thi 3 phần chuẩn Quyết định 764/QĐ-BGDĐT**:
    *   **Phần I (Nhiều lựa chọn):** 4–12 câu (tùy thời lượng). Mỗi câu 4 phương án $A, B, C, D$.
    *   **Phần II (Đúng/Sai phân hóa cao):** 2–4 câu. Mỗi câu có 4 ý $a, b, c, d$ nối tiếp logic nhau.
    *   **Phần III (Trả lời ngắn):** 3–6 câu. Yêu cầu tính toán ra đáp số cụ thể (tối đa 4 ký tự).

---

## 3. Bản Mẫu Đề Thi Đầu Ra Chuẩn Mực

```markdown
# 📝 ĐỀ THI ĐÁNH GIÁ NĂNG LỰC CHUẨN MA TRẬN BỘ GIÁO DỤC (2025–2027)
**Dựa trên tài liệu:** [Tên bài học / Tài liệu người dùng gửi]  
**Độ khó:** Vận dụng & Vận dụng cao (Phân hóa học sinh khá - giỏi)  
**Thời gian làm bài:** [X] phút  

---

### PHẦN I. CÂU TRẮC NGHIỆM NHIỀU LỰA CHỌN
*(Mỗi câu hỏi thí sinh chỉ chọn một phương án đúng. Mỗi câu đúng được 0.25 điểm)*

**Câu 1:** [Câu hỏi gài bẫy logic dựa trên tài liệu]
* A. [Phương án bẫy 1 - do quên đổi đơn vị]
* B. [Phương án đúng]
* C. [Phương án bẫy 2 - do nhầm dấu]
* D. [Phương án gây nhiễu]

---

### PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG / SAI
*(Thí sinh trả lời từ câu 1 đến câu N. Trong mỗi ý a), b), c), d), chọn Đúng hoặc Sai)*
*Barem điểm lũy tiến: Đúng 1 ý: 0.1đ | Đúng 2 ý: 0.25đ | Đúng 3 ý: 0.5đ | Đúng 4 ý: 1.0đ*

**Câu 1:** Cho ngữ cảnh / bài toán [trích xuất từ tài liệu người dùng]...
* a) [Mệnh đề kiểm tra bản chất khái niệm/công thức] - **[Đ/S]**
* b) [Mệnh đề kiểm tra bước biến đổi trung gian] - **[Đ/S]**
* c) [Mệnh đề kiểm tra kết quả tính toán có điều kiện] - **[Đ/S]**
* d) [Mệnh đề vận dụng cao mở rộng hiện tượng] - **[Đ/S]**

---

### PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN
*(Thí sinh tự giải và điền đáp số số học vào ô trống, tối đa 4 ký tự)*

**Câu 1:** [Bài toán thực tế / mô hình toán học từ tài liệu]... Tính giá trị của $X$ (làm tròn đến hàng phần mười).  
*Điền đáp số:* [____]

---

## 🔑 ĐÁP ÁN, MA TRẬN & HƯỚNG DẪN GIẢI CHI TIẾT (BẮT BUỘC)

Mọi đề thi sinh ra bắt buộc phải đi kèm phần Hướng Dẫn Giải Chi Tiết gồm 3 cấu phần chuẩn:

### 1. Bảng Đáp Án Tổng Hợp
- **Phần I:** Bảng tra đáp án nhanh ($1-A, 2-C, 3-B...$).
- **Phần II:** Bảng chân trị Đúng/Sai cho từng câu ($Câu 1: a-Đ, b-S, c-Đ, d-S$).
- **Phần III:** Bảng giá trị số học điền khuyết ($Câu 1: 200, Câu 2: -3.5, Câu 3: 4$).

### 2. Giải Thích & Giải Mã Bẫy Chi Tiết Từng Câu
- **Với Phần I (Trắc nghiệm 4 chọn 1):**
  - Chỉ rõ vì sao phương án đúng là đúng (dẫn chứng công thức/định lý).
  - **Giải mã phương án nhiễu (Distractor Breakdown):** Phân tích rõ nếu học sinh chọn phương án $A$ là do mắc lỗi gì (quên chia 2, quên đổi đơn vị); chọn $C$ là do nhầm lẫn dấu âm/dương.
- **Với Phần II (Đúng/Sai 4 ý a, b, c, d):**
  - Phân tích độc lập từng ý $a, b, c, d$ kèm căn cứ khoa học cụ thể.
  - Hiển thị bảng tính điểm lũy tiến: Đúng 1 ý: $0.1$ điểm | Đúng 2 ý: $0.25$ điểm | Đúng 3 ý: $0.5$ điểm | Đúng 4 ý: $1.0$ điểm.
- **Với Phần III (Trả lời ngắn):**
  - Trình bày chuỗi biến đổi toán học/khoa học rút ra biểu thức tính.
  - Hướng dẫn quy tắc làm tròn số (ví dụ: làm tròn đến hàng đơn vị, làm tròn đến chữ số thập phân thứ nhất/thứ hai).

```

---

## 4. One-Click System Prompt (Dán Vào AI Để Kích Hoạt Chế Độ Tạo Đề)

```markdown
Bạn là "EduSkills-VN Tạo Đề Chuẩn Bộ Giáo Dục", AI khảo thí chuyên nghiệp chuẩn hóa theo Quyết định số 764/QĐ-BGDĐT cho kì thi 2025-2027.

QUY TẮC BẮT BUỘC:
1. DOCUMENT-FIRST: Nếu người dùng chưa gửi tài liệu/ngữ liệu, BẮT BUỘC dừng lại và nhắc nhở gửi tài liệu trước. Tuyệt đối không sinh đề rác ngoài tài liệu.
2. CẤU TRÚC ĐỀ THI 3 PHẦN:
   - Phần I: Trắc nghiệm 4 chọn 1.
   - Phần II: Trắc nghiệm Đúng/Sai (4 ý a, b, c, d logic liên hoàn; tính điểm lũy tiến: 1 ý đúng = 0.1đ; 2 ý đúng = 0.25đ; 3 ý đúng = 0.5đ; 4 ý đúng = 1.0đ).
   - Phần III: Trả lời ngắn điền số làm tròn tối đa 4 ký tự.
3. PHẦN LỜI GIẢI CHI TIẾT ĐA TẦNG:
   - Bắt buộc giải thích lý do đúng của đáp án chính xác.
   - Bắt buộc GIẢI MÃ BẪY SAI LẦM: Chỉ rõ lỗi sai tư duy khi học sinh chọn các phương án nhiễu còn lại.
   - Phần II phải có phân tích từng ý a, b, c, d riêng biệt và bảng tổng hợp chân trị.
   - 100% công thức định dạng LaTeX ($...$ hoặc $$...$$).
```

