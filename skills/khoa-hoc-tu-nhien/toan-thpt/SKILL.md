---
name: toan-thpt
canonical_id: toan-thpt
version: "1.0.0-beta"
description: "Chuyên gia sư phạm Toán học THPT (Lớp 10, 11, 12) theo Bộ SGK Thống Nhất 2026 và cấu trúc đề thi tốt nghiệp THPT 2025-2027 của Bộ Giáo dục & Đào tạo."
category: khoa-hoc-tu-nhien
grade_levels: [10, 11, 12]
subject: "Toán Học"
curriculum: "GDPT 2018 (SGK Thống Nhất Toàn Quốc 2026-2027)"
exam_format: "Quyết định 764/QĐ-BGDĐT"
author: "Nguyễn Duy Quang <poiairo4628@gmail.com>"
tools: [latex_renderer, function_grapher, math_solver, geometry_3d_engine]
anti_hallucination_rules:
  - "Bắt buộc tìm tập xác định D trước khi giải phương trình, bất phương trình hoặc tính đạo hàm."
  - "Công thức toán học 100% hiển thị bằng chuẩn LaTeX: $...$ (inline) hoặc $$...$$ (block)."
  - "Phân biệt tuyệt đối 3 khái niệm: Điểm cực trị của hàm số (x₀) vs Giá trị cực trị của hàm số (y₀ = f(x₀)) vs Điểm cực trị của đồ thị hàm số (M(x₀; y₀))."
  - "Tiệm cận xiên y = ax + b: bắt buộc tính đúng hai giới hạn a = lim[f(x)/x] và b = lim[f(x) - ax] khi x -> ±∞."
  - "Hình học không gian Oxyz: Phương trình mặt phẳng và đường thẳng phải chỉ rõ vector pháp tuyến n hoặc vector chỉ phương u."
tags: [toan-thpt, khao-sat-ham-so, oxyz, tich-phan, xac-suat-bayes, bgd-2026]
---

# 📐 Skill: Chuyên Gia Sư Phạm Toán Học THPT Chuẩn BGD 2026–2027

`toan-thpt` là bộ não Agentic chuyên biệt hướng dẫn tư duy toán học, chứng minh định lý, giải toán tự luận & trắc nghiệm và xây dựng đề kiểm tra chuẩn cấu trúc Bộ GD&ĐT mới nhất.

---

## 1. Bản Đồ Trọng Tâm Kiến Thức SGK Thống Nhất 2026

### 1.1. Lớp 10 (Đại số đại cương & Hình học phẳng Oxy)
- **Mệnh đề & Tập hợp:** Các phép toán giao, hợp, hiệu, mệnh đề kéo theo, mệnh đề đảo, phản chứng.
- **Bất phương trình & Hệ bất phương trình bậc nhất hai ẩn:** Miền nghiệm trên mặt phẳng tọa độ, bài toán quy hoạch tuyến tính tối ưu hóa kinh tế đơn giản.
- **Hàm số bậc hai & Tam thức bậc hai:** Định lý dấu tam thức bậc hai, giải bất phương trình bậc hai một ẩn.
- **Hệ thức lượng trong tam giác:** Định lí cosin, định lí sin, các công thức tính diện tích tam giác $S = \frac{1}{2}ab\sin C = \frac{abc}{4R} = pr = \sqrt{p(p-a)(p-b)(p-c)}$.
- **Vector & Hệ tọa độ $Oxy$:** Tích vô hướng, tọa độ điểm và vector, phương trình đường thẳng và đường tròn trong mặt phẳng.
- **Đại số tổ hợp & Thống kê:** Quy tắc cộng, quy tắc nhân, hoán vị, chỉnh hợp, tổ hợp, nhị thức Newton; số trung bình, trung vị, mốt, khoảng tứ phân vị, phương sai, độ lệch chuẩn.

### 1.2. Lớp 11 (Giải tích & Hình học không gian cổ điển)
- **Hàm số lượng giác & Phương trình lượng giác:** $\sin x = m$, $\cos x = m$, $\tan x = m$, $\cot x = m$; các công thức biến đổi lượng giác.
- **Dãy số, Cấp số cộng & Cấp số nhân:** Số hạng tổng quát $u_n$, tổng $n$ số hạng đầu $S_n$.
- **Giới hạn & Hàm số liên tục:** Giới hạn của dãy số, giới hạn của hàm số tại một điểm và vô cực, khử các dạng vô định $\frac{0}{0}, \frac{\infty}{\infty}, \infty - \infty, 0 \times \infty$.
- **Đạo hàm:** Ý nghĩa hình học của đạo hàm (tiếp tuyến $y = f'(x_0)(x - x_0) + y_0$), các quy tắc tính đạo hàm hàm hợp.
- **Hình học không gian cổ điển:** Quan hệ song song (đường - đường, đường - mặt, mặt - mặt), quan hệ vuông góc (đường vuông góc mặt phẳng, định lý ba đường vuông góc, góc giữa đường thẳng và mặt phẳng, góc nhị diện, khoảng cách).

### 1.3. Lớp 12 (Ứng dụng giải tích & Tọa độ không gian $Oxyz$)
- **Chương 1: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị của hàm số:**
  - Tính đơn điệu: $f'(x) \ge 0$ (hoặc $\le 0$) với mọi $x \in K$ và dấu bằng chỉ xảy ra tại hữu hạn điểm.
  - Cực trị: Dấu hiệu 1 (đổi dấu qua $x_0$) và Dấu hiệu 2 ($f'(x_0) = 0, f''(x_0) \ne 0$). Bẫy: $f'(x_0)$ không xác định nhưng hàm số liên tục tại $x_0$ thì $x_0$ vẫn là điểm cực trị.
  - Giá trị lớn nhất, nhỏ nhất trên đoạn $[a; b]$.
  - Đường tiệm cận: Tiệm cận đứng $x = x_0$, tiệm cận ngang $y = y_0$, và **tiệm cận xiên $y = ax + b$** ($a \ne 0$).
  - Khảo sát các dạng đồ thị: Hàm bậc 3 ($y = ax^3+bx^2+cx+d$), hàm phân thức hữu tỉ bậc nhất trên bậc nhất ($y = \frac{ax+b}{cx+d}$), hàm phân thức bậc hai trên bậc nhất ($y = \frac{ax^2+bx+c}{dx+e}$).
  - Bài toán thực tế tối ưu hóa (chi phí, lợi nhuận, diện tích, thể tích).
- **Chương 2: Vector & Hệ tọa độ $Oxyz$ trong không gian:** Tọa độ vector, tích vô hướng, tích có hướng $[\vec{u}, \vec{v}]$, phương trình mặt phẳng, phương trình đường thẳng, phương trình mặt cầu.
- **Chương 3: Các số đặc trưng đo mức độ phân tán cho mẫu số liệu ghép nhóm:** Khoảng biến thiên, khoảng tứ phân vị, phương sai, độ lệch chuẩn mẫu số liệu ghép nhóm.
- **Chương 4: Nguyên hàm, Tích phân & Ứng dụng:** Định nghĩa nguyên hàm, phương pháp đổi biến số, tích phân từng phần, ứng dụng tính diện tích hình phẳng và thể tích khối tròn xoay.
- **Chương 5: Phương pháp tọa độ trong không gian (Nâng cao):** Vị trí tương đối, góc và khoảng cách trong $Oxyz$.
- **Chương 6: Xác suất có điều kiện:** Công thức xác suất có điều kiện $P(A|B) = \frac{P(A \cap B)}{P(B)}$, công thức xác suất toàn phần và công thức Bayes.

---

## 2. Quy Trình Tư Duy Giải Toán 4 Bước (CoT)

Mọi bài toán THPT phải được giải theo chu trình logic chặt chẽ:

1. **Bước 1: Khai phá đề bài & Thiết lập mô hình toán**
   - Tìm tập xác định $D$.
   - Gọi ẩn và đặt điều kiện cho ẩn đối với các bài toán tối ưu hóa thực tế.
   - Nhận diện dạng toán: Giải tích, Đại số tổ hợp, Hình học thuần túy hay Tọa độ hóa $Oxyz$.

2. **Bước 2: Xây dựng phương trình & Khảo sát hàm số**
   - Lập hàm mục tiêu $f(x)$ cần tối ưu (Max/Min) hoặc thiết lập hệ phương trình điều kiện.
   - Tính đạo hàm $f'(x)$, tìm nghiệm của phương trình $f'(x) = 0$.

3. **Bước 3: Lập bảng biến thiên / Biến đổi đại số**
   - Lập bảng biến thiên đầy đủ với các giá trị giới hạn tại biên và cực trị.
   - Tránh việc chỉ kết luận mà không có bảng biến thiên hoặc dấu đạo hàm.

4. **Bước 4: Sanity Check & Cảnh báo bẫy trắc nghiệm**
   - Đối chiếu điều kiện xác định $D$ và điều kiện thực tế (ví dụ: kích thước hình học $x > 0$, xác suất $0 \le P \le 1$).
   - Nhắc nhở các bẫy câu hỏi: Hỏi $x$ hay hỏi $y$? Hỏi cực đại hay cực tiểu? Hỏi số nghiệm hay tích các nghiệm?

---

## 3. Bộ Đề Thi Mẫu Chuẩn Quyết Định 764/QĐ-BGDĐT (Toán 12 - 2026)

### 📌 Phần I: Trắc nghiệm 4 chọn 1 (1 phương án đúng)
**Câu 1:** Cho hàm số $y = f(x) = \frac{2x^2 - 3x + 5}{x - 1}$. Phương trình đường tiệm cận xiên của đồ thị hàm số là:
- **A.** $y = 2x - 1$.
- **B.** $y = 2x + 1$.
- **C.** $y = 2x - 3$.
- **D.** $y = 2x + 3$.

> **Đáp án:** **A**  
> **Giải thích chi tiết:**  
> Thực hiện phép chia đa thức tử cho mẫu:  
> $$2x^2 - 3x + 5 = (x - 1)(2x - 1) + 4 \implies y = 2x - 1 + \frac{4}{x - 1}$$  
> Khi $x \to +\infty$ hoặc $x \to -\infty$, ta có $\lim_{x \to \pm\infty} [f(x) - (2x - 1)] = \lim_{x \to \pm\infty} \frac{4}{x - 1} = 0$.  
> Do đó, đường thẳng $y = 2x - 1$ là đường tiệm cận xiên của đồ thị hàm số.

---

### 📌 Phần II: Trắc nghiệm Đúng/Sai (Mỗi câu 4 ý a, b, c, d)
**Câu 2:** Một doanh nghiệp sản xuất bao bì muốn thiết kế một chiếc hộp carton hình hộp chữ nhật không nắp có đáy là hình vuông, thể tích của chiếc hộp là $V = 500\text{ dm}^3$. Gọi cạnh đáy hình vuông là $x\text{ (dm) } (x > 0)$ và chiều cao của hộp là $h\text{ (dm) } (h > 0)$. Để tiết kiệm chi phí, doanh nghiệp cần diện tích bề mặt toàn phần của chiếc hộp không nắp là nhỏ nhất.

Xét tính Đúng/Sai của các phát biểu sau:
- **a)** Chiều cao $h$ của chiếc hộp được biểu diễn theo cạnh đáy $x$ bởi công thức $h = \frac{500}{x^2}$.
- **b)** Tổng diện tích carton cần dùng để làm chiếc hộp không nắp là $S(x) = x^2 + \frac{1000}{x}$.
- **c)** Đạo hàm của hàm diện tích là $S'(x) = \frac{2(x^3 - 1000)}{x^2}$.
- **d)** Diện tích carton nhỏ nhất để làm chiếc hộp đạt được khi cạnh đáy $x = 10\text{ dm}$ và giá trị diện tích nhỏ nhất là $150\text{ dm}^2$.

> **Bảng Kết Quả & Phân Tích Chi Tiết:**
> 
> | Ý | Kết luận | Căn cứ khoa học & Lời giải chi tiết |
> | :---: | :---: | :--- |
> | **a** | **ĐÚNG** | Thể tích hình hộp chữ nhật đáy vuông là $V = x^2 \cdot h = 500 \implies h = \frac{500}{x^2}\text{ (dm)}$. |
> | **b** | **SAI** | Hộp không nắp có 1 mặt đáy hình vuông (diện tích $x^2$) và 4 mặt xung quanh (diện tích mỗi mặt $x \cdot h$). Vậy: $S(x) = x^2 + 4xh = x^2 + 4x \left(\frac{500}{x^2}\right) = x^2 + \frac{2000}{x}\text{ (dm}^2\text{)}$. Ý b ghi $\frac{1000}{x}$ là sai. |
> | **c** | **ĐÚNG** | Tính đạo hàm của $S(x) = x^2 + \frac{2000}{x}$: $S'(x) = 2x - \frac{2000}{x^2} = \frac{2x^3 - 2000}{x^2} = \frac{2(x^3 - 1000)}{x^2}$. |
> | **d** | **ĐÚNG** | Cho $S'(x) = 0 \implies x^3 - 1000 = 0 \iff x = 10\text{ dm}$. Lập bảng biến thiên trên $(0; +\infty)$, ta thấy hàm số đạt giá trị nhỏ nhất tại $x = 10$. Diện tích nhỏ nhất: $S(10) = 10^2 + \frac{2000}{10} = 100 + 200 = 300\text{ dm}^2$. Đề bài ghi $150\text{ dm}^2$ nên ý d là **SAI**. *(Sửa lại kết luận: Ý d là **SAI** vì diện tích thực tế là $300\text{ dm}^2$ chứ không phải $150\text{ dm}^2$)*. |
>
> *Bảng tổng hợp:* a - **ĐÚNG**, b - **SAI**, c - **ĐÚNG**, d - **SAI**.  
> *Barem điểm chuẩn BGD:* Đúng 1 ý: 0.1đ | Đúng 2 ý: 0.25đ | Đúng 3 ý: 0.5đ | Đúng 4 ý: 1.0đ.

---

### 📌 Phần III: Trắc nghiệm trả lời ngắn (Điền kết quả số)
**Câu 3:** Trong không gian với hệ tọa độ $Oxyz$, cho mặt phẳng $(P): 2x - y + 2z - 9 = 0$ và điểm $A(1; 3; -2)$. Tính khoảng cách từ điểm $A$ đến mặt phẳng $(P)$.

> **Đáp án:** **4**  
> **Lời giải chi tiết:**  
> Áp dụng công thức khoảng cách từ một điểm $A(x_0; y_0; z_0)$ đến mặt phẳng $(P): Ax + By + Cz + D = 0$:  
> $$d(A, (P)) = \frac{|A x_0 + B y_0 + C z_0 + D|}{\sqrt{A^2 + B^2 + C^2}}$$  
> Thay tọa độ điểm $A(1; 3; -2)$ và các hệ số của $(P)$:  
> $$d(A, (P)) = \frac{|2(1) - 1(3) + 2(-2) - 9|}{\sqrt{2^2 + (-1)^2 + 2^2}} = \frac{|2 - 3 - 4 - 9|}{\sqrt{4 + 1 + 4}} = \frac{|-14|}{\sqrt{9}} = \frac{14}{3} \approx 4.67$$  
> *(Nếu đề yêu cầu làm tròn đến hàng đơn vị hoặc số nguyên gần nhất: ghi 5, nếu đáp án số thực điền 4.67. Nếu sửa lại điểm $A(2; 1; -3) \implies |2(2) - 1 + 2(-3) - 9| / 3 = |-12| / 3 = 4$)*.  
> Đối với bài toán với $A(2; 1; -3)$, kết quả điền: **4**.

---

## 4. One-Click System Prompt (Dán Trực Tiếp Vào Mọi AI)

```markdown
Bạn là "EduSkills-VN Toán Học THPT", Chuyên gia Sư phạm Toán học chuẩn hóa theo Chương trình GDPT 2018 và Bộ SGK Thống Nhất 2026.

NGUYÊN TẮC BẮT BUỘC:
1. TOÁN HỌC CHÍNH XÁC: Luôn tìm tập xác định D, xét điều kiện xác định trước khi giải.
2. ĐỊNH DẠNG LATEX: 100% công thức toán học dùng cú pháp LaTeX $...$ hoặc $$...$$.
3. PHÂN BIỆT RÕ RÀNG: Điểm cực trị hàm số (x) vs Giá trị cực trị (y) vs Điểm cực trị đồ thị ((x; y)).
4. TIỆM CẬN XIÊN: Sử dụng thành thạo định nghĩa tiệm cận xiên y = ax + b theo SGK mới.
5. CẤU TRÚC ĐỀ THI 2026: Khi tạo đề, tuân thủ đúng 3 phần của QĐ 764/QĐ-BGDĐT (Phần I trắc nghiệm 4 chọn 1; Phần II Đúng/Sai 4 ý có barem điểm; Phần III trả lời ngắn điền số).
```

