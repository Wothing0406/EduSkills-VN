# Bộ Chẩn Đoán Nhanh (Mini-Probe) & Quy Trình Bù Kiến Thức Chuyển Tiếp

## 1. Quy chuẩn chấm chẩn đoán (Evidence-Based, Zero Stigma)

1. Mỗi mini-probe chỉ kiểm tra **1 mắt xích độc lập** (3–5 câu, không trộn nhiều bẫy cùng lúc).
2. Chỉ đánh dấu thiếu mắt xích $M$ khi bài làm xuất hiện sai sót cụ thể ở đúng bước yêu cầu $M$.
3. **Không** gán nhãn *"mất gốc"*, **không** giao toàn bộ đề ôn thi tốt nghiệp 22–40 câu cho người chỉ vướng 1 mắt xích đại số hay đạo hàm.

## 2. Bộ Mini-Probe mẫu 4 lĩnh vực

### A. Trước Giải tích 1 (`5` câu, 15 phút)
1. *(Điều kiện xác định)* Tìm tập xác định của $f(x) = \ln(x^2 - 4) + \frac{1}{\sqrt{5-x}}$. *(Kiểm tra bất phương trình & hợp điều kiện).*
2. *(Lượng giác)* Biến đổi $\sin^2 x$ về hàm bậc nhất theo $\cos 2x$. *(Kiểm tra công thức hạ bậc cho tích phân).*
3. *(Giới hạn $0/0$)* Tính $\lim_{x\to 1}\frac{x^2 - 1}{x - 1}$ và nêu vì sao không viết $\frac{0}{0}=1$. *(Kiểm tra phân biệt vô định vs giá trị xác định).*
4. *(Đạo hàm hàm hợp)* Tính đạo hàm $g(x) = e^{x^2 + 1}$. *(Kiểm tra quy tắc chuỗi $f(u(x))' = f'(u)u'(x)$).*
5. *(Tích phân đổi biến)* Đặt $u = 1 + x^2$, viết lại $\int_0^1 2x(1+x^2)^3\,dx$ kèm **đổi cận**. *(Kiểm tra lỗi quên đổi cận tích phân xác định).*

### B. Trước Đại số tuyến tính (`3` câu, 10 phút)
1. Giải hệ $\begin{cases} x + 2y = 5 \\ 2x + 4y = 10 \end{cases}$ và mô tả tập nghiệm. *(Kiểm tra nghiệm vô số theo tham số tự do, chuẩn bị cho `nullspace`).*
2. Cho $\vec{u} = (1; 2; -1)$ và $\vec{v} = (2; -1; 0)$ trong $Oxyz$: tính $\vec{u}\cdot\vec{v}$ và kiểm tra trực giao. *(Nối sang tích trong $\mathbb{R}^n$).*
3. Tính $[\vec{u}, \vec{v}]$ hoặc định thức cấp 2 $\det\begin{pmatrix} 3 & 1 \\ 2 & 4 \end{pmatrix}$. *(Kiểm tra tính dấu chéo chính – chéo phụ).*

### C. Trước Xác suất – Thống kê (`3` câu, 10 phút)
1. Lấy ngẫu nhiên 2 thẻ trong 5 thẻ đánh số 1..5 (không hoàn lại): khác nhau giữa *"rút có thứ tự"* và *"không thứ tự"* là gì?
2. Một bệnh hiếm chiếm $1\%$ dân số; test dương tính đúng $95\%$ người bệnh và dương tính giả $5\%$ người khỏe. Hãy viết biểu thức Bayes cho $P(\text{Bệnh} \mid \text{Dương tính})$ (chưa cần bấm số). *(Kiểm tra đảo ngược điều kiện).*
3. Mẫu A: $\{5, 5, 5\}$ và Mẫu B: $\{1, 5, 9\}$ có cùng trung bình $\bar{x}=5$; chỉ số nào đo sự khác biệt về độ phân tán?

### D. Trước Lập trình căn bản (`3` câu, 10 phút)
1. Cho đoạn code `s = 0; for i in range(1, 5): if i % 2 == 0: s += i`. Lập bảng vết giá trị `i` và `s` qua từng bước lặp.
2. Hàm đệ quy cần điều kiện gì để không lặp vô hạn?
3. Nếu đầu vào hàm tìm giá trị lớn nhất là danh sách rỗng `[]`, chương trình nên xử lý thế nào thay vì trả về `0`?

## 3. Tiêu chuẩn hoàn thành bài chuyển giao (Transfer Gate)
- Người học tự giải lại được đúng biến thể đổi số/đổi hàm của đúng mắt xích vừa bù và **giải thích bằng lời ngắn** điều kiện áp dụng quy tắc đó.
