# Khung Chương Trình 2 Học Kì & Vận Dụng Thực Tiễn — Toán THPT (GDPT 2018)

## Căn cứ chương trình & Sách giáo khoa
- **Chương trình áp dụng:** Chương trình GDPT 2018 (Thông tư 32/2018/TT-BGDĐT).
- **Sách giáo khoa:** Quyết định 3588/QĐ-BGDĐT (26/12/2025) phê duyệt bộ *Kết nối tri thức với cuộc sống* sử dụng thống nhất từ năm học 2026–2027 (nguồn: `https://moet.gov.vn`, kiểm tra `2026-11-18`). Khi hỗ trợ người học dùng bộ *Chân trời sáng tạo* hoặc *Cánh diều*, ưu tiên thứ tự chương bài trong tài liệu người dùng.

---

## 1. Tổng quát liên thông 2 Học kì (HK1 $\leftrightarrow$ HK2)

| Lớp | Trọng tâm Học kì 1 (Nền tảng) | Trọng tâm Học kì 2 (Mở rộng & Tích hợp) | Liên kết & Vận dụng thực tiễn |
| :--- | :--- | :--- | :--- |
| **10** | Mệnh đề – Tập hợp; Hệ BPT bậc nhất 2 ẩn; Hàm số bậc hai & Tam thức bậc hai; Hệ thức lượng tam giác; Vector cơ bản. | Đại số tổ hợp (Hoán vị, Chỉnh hợp, Tổ hợp, Nhị thức Newton $(a+b)^n$ với $n \le 5$); Phương pháp tọa độ $Oxy$ (đường thẳng, đường tròn, ba đường Conic); Thống kê mô tả & Xác suất cổ điển. | Quy hoạch tuyến tính tối ưu lợi nhuận/chi phí; đo đạc khoảng cách gián tiếp (tam giác); đọc số liệu phân tán ($R, \Delta_Q, s$) và quỹ đạo parabol/elip. |
| **11** | Hàm số lượng giác & Phương trình lượng giác; Dãy số, Cấp số cộng, Cấp số nhân; Giới hạn & Liên tục; Quan hệ song song trong không gian; Số đặc trưng mẫu ghép nhóm (trung tâm). | Hàm số Mũ & Logarit; Đạo hàm (tiếp tuyến, $v=s', a=v'$); Quan hệ vuông góc trong không gian (góc nhị diện, khoảng cách, thể tích); Quy tắc tính xác suất ($P(A\cup B)$, độc lập). | Bài toán lãi suất kép & tăng trưởng dân số (CSN, Mũ–Logarit); mô hình sóng tuần hoàn; tốc độ biến thiên tức thời; thiết kế hình khối kiến trúc. |
| **12** | Ứng dụng đạo hàm khảo sát hàm số (đơn điệu, cực trị, GTLN–GTNN, tiệm cận, đồ thị); Vector & Hệ tọa độ $Oxyz$; Số đặc trưng đo phân tán mẫu ghép nhóm ($R, \Delta_Q, s^2, s$). | Nguyên hàm – Tích phân & ứng dụng diện tích/thể tích; Phương trình mặt phẳng, đường thẳng, mặt cầu $Oxyz$; Xác suất có điều kiện, Công thức Xác suất toàn phần & Bayes. | Tối ưu hóa chi phí bao bì/sản xuất (đạo hàm); tính quãng đường/lưu lượng/thể tích vật thể thực tế (tích phân); định vị radar/drone 3D ($Oxyz$); đánh giá độ tin cậy xét nghiệm y khoa/phân loại (Bayes). |

---

## 2. Chi tiết công thức cốt lõi cần đối chiếu nhanh
- **Tam thức & Hàm phân thức:** Đỉnh parabol $I\left(-\frac{b}{2a}; -\frac{\Delta}{4a}\right)$. Hàm $y = \frac{ax+b}{cx+d}$ ($c \ne 0$): đơn điệu trên từng khoảng xác định $\iff ad - bc > 0$ (đồng biến) hoặc $ad - bc < 0$ (nghịch biến). Tiệm cận xiên $y = ax + b$ ($a \ne 0$) tìm bằng chia đa thức hoặc giới hạn $a = \lim_{x\to\pm\infty}\frac{f(x)}{x}, b = \lim_{x\to\pm\infty}[f(x)-ax]$.
- **CSC & CSN:** CSC $u_n = u_1 + (n-1)d, S_n = \frac{n(u_1+u_n)}{2}$; CSN $u_n = u_1 q^{n-1}, S_n = \frac{u_1(1-q^n)}{1-q}$ ($q \ne 1$); CSN lùi vô hạn $S = \frac{u_1}{1-q}$ ($|q| < 1$).
- **Tích phân:** $S = \int_a^b |f(x) - g(x)|\,\mathrm{d}x$; thể tích tròn xoay quanh $Ox$: $V = \pi \int_a^b [f(x)]^2\,\mathrm{d}x$.
- **$Oxyz$:** Mặt cầu $x^2+y^2+z^2-2ax-2by-2cz+d=0$ có điều kiện $a^2+b^2+c^2-d > 0$. Góc đường–đường / mặt–mặt dùng $\cos\varphi$; đường–mặt dùng $\sin\varphi = \frac{|\vec{u}_d\cdot\vec{n}_P|}{|\vec{u}_d||\vec{n}_P|}$.
- **Xác suất Bayes:** $P(A|B) = \frac{P(AB)}{P(B)}$ ($P(B)>0$); Toàn phần $P(A) = P(B)P(A|B) + P(\overline{B})P(A|\overline{B})$; Bayes $P(B|A) = \frac{P(B)P(A|B)}{P(A)}$.
