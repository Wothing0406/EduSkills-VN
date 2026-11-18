# Định Lý Cốt Lõi, Bảng Taylor & Phản Ví Dụ Giải Tích Đại Học

Tài liệu mở rộng cho `giai-tich-dai-hoc`. Tham chiếu chuẩn học thuật: OpenStax *Calculus Volume 1–3* (Gilbert Strang & Edwin Herman).

## 1. Bảng Khai Triển Maclaurin Chuẩn (Quanh $x = 0$)

| Hàm số | Khai triển đến phần dư Peano $o(\cdot)$ | Bán kính hội tụ | Ghi chú bẫy thường gặp |
|---|---|---|---|
| $e^x$ | $1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \dots + \frac{x^n}{n!} + o(x^n)$ | $R = +\infty$ | Chỉ thay vào khi biểu thức bên trong tiến về $0$ |
| $\sin x$ | $x - \frac{x^3}{3!} + \frac{x^5}{5!} - \dots$ | $R = +\infty$ | Bậc lẻ; dùng tới $x^3$ khi ghép với $x$ trong hiệu |
| $\cos x$ | $1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \dots$ | $R = +\infty$ | Bậc chẵn; chú ý $1 - \cos x \sim \frac{x^2}{2}$ |
| $\ln(1+x)$ | $x - \frac{x^2}{2} + \frac{x^3}{3} - \dots$ | $x \in (-1, 1]$ | Hội tụ tại $x=1$ (chuỗi đan dấu), phân kỳ tại $x=-1$ |
| $(1+x)^\alpha$ | $1 + \alpha x + \frac{\alpha(\alpha-1)}{2!}x^2 + \dots$ | $\|x\| < 1$ | Rất hữu ích cho $\sqrt{1+x}$ và $\frac{1}{1+x}$ |

## 2. Sơ Đồ Ra Quyết Định Chọn Tiêu Chuẩn Hội Tụ Chuỗi $\sum u_n$

1. **Bước 1 (Luôn làm đầu tiên):** Tính $\lim_{n\to\infty} u_n$. Nếu $\ne 0$ hoặc không tồn tại $\implies$ **PHÂN KỲ NGAY**.
2. **Bước 2 (Nhận diện dạng đặc trưng):**
   - Dạng $\sum \frac{1}{n^p}$ ($p$-series): hội tụ khi **$p > 1$**, phân kỳ khi $p \le 1$.
   - Dạng hình học $\sum ar^n$: hội tụ khi $|r| < 1$.
   - Có giai thừa $n!$ hoặc lũy thừa $a^n$: dùng **D'Alembert (Ratio Test)** xét $L = \lim \left|\frac{u_{n+1}}{u_n}\right|$ ($L<1$ hội tụ, $L>1$ phân kỳ, $L=1$ **chưa kết luận**!).
   - Có $(f(n))^n$: dùng **Cauchy (Root Test)** xét $\lim \sqrt[n]{|u_n|}$.
   - Chuỗi đan dấu $\sum (-1)^n b_n$ ($b_n > 0$): **Leibniz** nếu $b_n$ giảm đơn điệu và $\lim b_n = 0$ (chú ý phân biệt *hội tụ tuyệt đối* vs *bán hội tụ*!).

## 3. Kho Phản Ví Dụ Kiểm Chứng Điều Kiện Định Lý

1. **Liên tục nhưng không khả vi:** $f(x) = |x|$ tại $x = 0$ (hoặc hàm Weierstrass liên tục mọi nơi nhưng không khả vi ở đâu).
2. **Tồn tại đạo hàm riêng nhưng không liên tục:**
   $f(x,y) = \frac{xy}{x^2+y^2}$ với $(x,y)\ne (0,0)$ và $f(0,0)=0$: $f_x(0,0)=f_y(0,0)=0$, nhưng dọc theo $y=x$ thì $f(x,x)=\frac{1}{2} \ne 0$ $\implies$ gián đoạn tại $(0,0)$!
3. **Điểm dừng với $f''(x_0)=0$ hoặc Hessian $D=0$:** $f(x)=x^3$ tại $x=0$ (điểm uốn, không cực trị) vs $f(x)=x^4$ tại $x=0$ (cực tiểu).
4. **Chuỗi $\lim u_n = 0$ nhưng phân kỳ:** $\sum \frac{1}{n}$ hoặc $\sum \frac{1}{\sqrt{n}}$.
5. **Tích phân suy rộng ẩn kỳ dị bên trong đoạn:** $\int_0^3 \frac{1}{(x-1)^2}\,dx$ phân kỳ tại $x=1$.
