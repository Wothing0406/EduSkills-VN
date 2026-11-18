# Quy Tắc Chuyên Môn, Chẩn Đoán Lỗi & Cấu Trúc Thi — Toán THPT

## 1. Cấu trúc đề thi Tốt nghiệp THPT môn Toán (QĐ 764/QĐ-BGDĐT)
- **Văn bản căn cứ:** Quyết định 764/QĐ-BGDĐT ngày 08/03/2024 (áp dụng từ năm 2025). Nguồn: `https://thuvienphapluat.vn` / `https://chinhphu.vn` (kiểm tra `2026-11-18`).
- **Thời gian & cấu trúc:** **90 phút**, **22 câu / 10,0 điểm**:
  - **Phần I (12 câu):** Nhiều lựa chọn (4 chọn 1), $0,25\text{đ/câu}$ ($3,0\text{đ}$).
  - **Phần II (4 câu):** Đúng/Sai 4 ý a, b, c, d; điểm lũy tiến: 1 ý $0,1\text{đ}$ | 2 ý $0,25\text{đ}$ | 3 ý $0,5\text{đ}$ | 4 ý $1,0\text{đ}$ ($4,0\text{đ}$).
  - **Phần III (6 câu):** Trả lời ngắn (tối đa 4 ký tự gồm `-` và dấu thập phân), $0,5\text{đ/câu}$ ($3,0\text{đ}$).

---

## 2. Quy tắc chuyên môn chẩn đoán 7 phần

### Quy tắc 1: Tập nghiệm phương trình bậc chẵn & biến đổi hệ quả ($x^2 = a$)
1. **Tình huống áp dụng:** Giải phương trình dạng $x^2 = a$ ($a > 0$), $[f(x)]^2 = [g(x)]^2$, hoặc rút gọn phương trình chứa căn/ẩn dưới mẫu.
2. **Điều kiện / Giả định:** Đang giải phương trình trên tập số thực $\mathbb{R}$ và đề chưa giới hạn $x > 0$ (chẳng hạn bài toán độ dài, thời gian).
3. **Ví dụ sai & Giải thích lỗi:** Học sinh giải $x^2 = 9$ và kết luận $x = 3$ *(Loại lỗi: thiếu kiến thức tiên quyết / suy luận thiếu trường hợp)* — quên rằng bình phương của một số âm cũng dương, chỉ lấy nghiệm dương của $\sqrt{9}$.
4. **Ví dụ đúng:** Trên $\mathbb{R}$, $x^2 = 9 \iff x = 3$ hoặc $x = -3$ (tức $x = \pm 3$). Nếu đề kèm điều kiện cạnh hình vuông $x > 0$, khi đó mới loại $x = -3$ và nhận $x = 3$.
5. **Câu hỏi chẩn đoán:** *"Em kiểm tra lại xem ngoài số $3$, còn số thực nào khi bình phương lên cũng bằng $9$ không?"*
6. **Gợi ý sửa:** Viết tương đương $x^2 - 9 = 0 \iff (x - 3)(x + 3) = 0$ để không bỏ sót nghiệm âm trước khi đối chiếu điều kiện biên.
7. **Cách kiểm tra lại:** Thay từng giá trị tìm được vào vế trái $x^2$ để xem có đều bằng $9$ và thỏa điều kiện của ẩn không.

### Quy tắc 2: Đơn điệu hàm phân thức bậc 1 trên bậc 1 ($y = \frac{ax+b}{cx+d}$, $c \ne 0$)
1. **Tình huống áp dụng:** Tìm tham số $m$ để hàm phân thức đồng biến hoặc nghịch biến trên từng khoảng xác định $(-\infty; -\frac{d}{c})$ và $(-\frac{d}{c}; +\infty)$.
2. **Điều kiện / Giả định:** $c \ne 0$ (nếu $c$ chứa tham số phải xét riêng trường hợp $c = 0$).
3. **Ví dụ sai & Giải thích lỗi:** Cho $y = \frac{x + m}{x + 1}$ đồng biến trên từng khoảng xác định $\implies y' = \frac{1 - m}{(x+1)^2} \ge 0 \implies m \le 1$ *(Loại lỗi: dùng công thức ngoài điều kiện áp dụng)* — áp dụng máy móc dấu `≥` của hàm đa thức sang hàm phân thức bậc 1/bậc 1.
4. **Ví dụ đúng:** Khi $m = 1$, $y = \frac{x+1}{x+1} = 1$ ($\forall x \ne -1$) là hàm hằng, không đồng biến. Điều kiện đúng phải dùng dấu ngặt: $ad - bc = 1 - m > 0 \iff m < 1$.
5. **Câu hỏi chẩn đoán:** *"Nếu em thay thử $m = 1$ vào hàm số $y = \frac{x+m}{x+1}$, đồ thị của nó có đi lên theo $x$ không hay thành đường nằm ngang?"*
6. **Gợi ý sửa:** Kiểm tra bằng phản ví dụ tại giá trị biên $m = 1$, sau đó bỏ dấu bằng khỏi bất phương trình của $ad - bc$.
7. **Cách kiểm tra lại:** Chọn 1 giá trị nằm trong miền đáp án (ví dụ $m = 0$) để tính $y(0) = 0 < y(1) = \frac{1}{2}$ và thử tại biên $m = 1$ để thấy tính hằng.

### Quy tắc 3: Tam giác khái niệm cực trị (Hàm số vs Đồ thị)
1. **Tình huống áp dụng:** Đọc bảng biến thiên, đồ thị hoặc trả lời trắc nghiệm cực trị.
2. **Điều kiện / Giả định:** Hàm liên tục tại $x_0$ và $f'(x)$ đổi dấu khi qua $x_0$.
3. **Ví dụ sai & Giải thích lỗi:** Đề hỏi *"Điểm cực đại của hàm số"* lại chọn tọa độ $M(1; 4)$ hoặc giá trị $y = 4$ *(Loại lỗi: đọc sai yêu cầu / hiểu sai khái niệm)*.
4. **Ví dụ đúng:** *Điểm cực trị của hàm số*: $x = x_0$; *Giá trị cực trị*: $y_0 = f(x_0)$; *Điểm cực trị của đồ thị hàm số*: $M(x_0; y_0)$.
5. **Câu hỏi chẩn đoán:** *"Trong câu hỏi, cụm danh từ đứng sau là 'của hàm số' hay 'của đồ thị hàm số'?"*
6. **Gợi ý sửa:** Gạch chân 3 chữ cuối của câu hỏi trước khi chọn đáp án $x_0$, $y_0$ hay $(x_0; y_0)$.
7. **Cách kiểm tra lại:** Đối chiếu lại câu hỏi: hỏi "điểm của đồ thị" phải có đủ 2 hoành–tung độ; hỏi "giá trị" phải là $y$.

### Quy tắc 4: Góc trong không gian $Oxyz$ & Thể tích tròn xoay
1. **Tình huống áp dụng:** Tính góc đường–mặt và tính thể tích khối tròn xoay quanh $Ox$.
2. **Điều kiện / Giả định:** Vector chỉ phương/pháp tuyến khác $\vec{0}$; hàm $f(x)$ liên tục trên $[a; b]$.
3. **Ví dụ sai & Giải thích lỗi:** Dùng $\cos\varphi = \frac{|\vec{u}_d \cdot \vec{n}_P|}{|\vec{u}_d||\vec{n}_P|}$ cho góc giữa đường và mặt, hoặc quên $\pi$ khi tính $V = \int_a^b [f(x)]^2\,\mathrm{d}x$ *(Loại lỗi: hiểu sai công thức hình học/tích phân)*.
4. **Ví dụ đúng:** Đường–mặt (khác loại) dùng **$\sin\varphi = \frac{|\vec{u}_d \cdot \vec{n}_P|}{|\vec{u}_d||\vec{n}_P|}$** ($0^\circ \le \varphi \le 90^\circ$). Thể tích tròn xoay quanh $Ox$ có $\pi$ và bình phương: $V = \pi \int_a^b [f(x)]^2\,\mathrm{d}x$.
5. **Câu hỏi chẩn đoán:** *"Vector $\vec{n}_P$ vuông góc với mặt phẳng $(P)$ chứ không nằm trong $(P)$, vậy góc giữa $\vec{u}_d$ và $\vec{n}_P$ là góc $\varphi$ cần tìm hay góc phụ $90^\circ - \varphi$?"*
6. **Gợi ý sửa:** Vẽ phác đoạn thẳng vuông góc $\vec{n}_P$ với $(P)$ để thấy $\sin\varphi = \cos(90^\circ - \varphi)$, và kiểm tra hệ số $\pi$ trong mặt cắt hình tròn bán kính $f(x)$.
7. **Cách kiểm tra lại:** Thử với trường hợp đặc biệt đường thẳng song song mặt phẳng ($\vec{u}_d \perp \vec{n}_P \implies \vec{u}_d\cdot\vec{n}_P = 0 \implies \sin\varphi = 0 \implies \varphi = 0^\circ$); kiểm tra mặt cắt trụ $f(x)=R \implies V = \pi R^2(b-a)$.

---

## 3. Ví dụ mẫu chuẩn 3 phần (Đã kiểm chứng)
- **Phần I:** Tiệm cận xiên của $y = \frac{2x^2 - 3x + 5}{x - 1}$ ($x \ne 1$) $\to$ $y = 2x - 1 + \frac{4}{x-1} \implies$ Tiệm cận xiên $y = 2x - 1$.
- **Phần II:** Hộp carton không nắp đáy vuông cạnh $x>0$, cao $h>0$, $V = 500\text{ dm}^3$: **a)** $h = \frac{500}{x^2}$ (**ĐÚNG**); **b)** $S(x) = x^2 + \frac{1000}{x}$ (**SAI**, 1 đáy + 4 bên là $x^2 + \frac{2000}{x}$); **c)** $S'(x) = \frac{2(x^3-1000)}{x^2}$ (**ĐÚNG**); **d)** $\min S = 150\text{ dm}^2$ (**SAI**, tại $x=10$, $\min S = 300\text{ dm}^2$).
- **Phần III:** Khoảng cách từ $A(2; 1; -3)$ đến $(P): 2x - y + 2z - 9 = 0$ bằng $\frac{|4 - 1 - 6 - 9|}{\sqrt{4+1+4}} = \frac{12}{3} = \mathbf{4}$.
