# Phân Phối Chuẩn, Bảng Chọn Kiểm Định & Kỷ Luật Dữ Liệu Tái Lập

Tài liệu tham chiếu mở rộng cho `xac-suat-thong-ke` (tham chiếu OpenStax *Introductory Statistics*).

## 1. Bảng Tóm Tắt Phân Phối Trọng Tâm

| Phân phối | Miền giá trị & Tham số | $E[X]$ | $\text{Var}(X)$ | Điều kiện sử dụng / Lưu ý |
|---|---|---|---|---|
| **Bernoulli($p$)** | $\{0, 1\}$, $0\le p\le 1$ | $p$ | $p(1-p)$ | Một phép thử thành công/thất bại |
| **Binomial($n, p$)** | $\{0,\dots,n\}$ | $np$ | $np(1-p)$ | $n$ phép thử **độc lập**, xác suất $p$ **không đổi** |
| **Poisson($\lambda$)** | $\{0, 1, 2, \dots\}$, $\lambda>0$ | $\lambda$ | $\lambda$ | Đếm sự kiện hiếm độc lập theo khoảng thời gian/không gian |
| **Normal($\mu, \sigma^2$)** | $\mathbb{R}$, $\sigma>0$ | $\mu$ | $\sigma^2$ | 68%–95%–99.7% trong $\pm 1, 2, 3\sigma$; $z_{0.025}\approx 1.96$ |
| **Student $t(\nu)$** | $\mathbb{R}$, bậc tự do $\nu=n-1$ | $0$ ($\nu>1$) | $\frac{\nu}{\nu-2}$ ($\nu>2$) | Dùng khi **chưa biết $\sigma$ tổng thể**; đuôi dày hơn Chuẩn |

## 2. Sơ Đồ Chọn Kiểm Định Thống Kê Nhanh

| Mục tiêu | Số nhóm & Kiểu ghép | Giả định đáp ứng | Kiểm định chuẩn | Thay thế khi vi phạm giả định |
|---|---|---|---|---|
| Trung bình 1 mẫu vs $\mu_0$ | 1 nhóm | Chuẩn / $n\ge 30$, chưa biết $\sigma$ | One-sample $t$-test | Wilcoxon signed-rank |
| So sánh 2 trung bình | 2 nhóm độc lập | Phân phối gần chuẩn, $n$ vừa/lớn | Welch's $t$-test (không giả định $\sigma_1=\sigma_2$) | Mann–Whitney U |
| So sánh trước–sau trên cùng mẫu | 2 lần đo ghép cặp | Hiệu số $d_i$ gần chuẩn | Paired $t$-test | Wilcoxon signed-rank |
| So sánh $\ge 3$ trung bình | $\ge 3$ nhóm độc lập | Chuẩn + phương sai đồng nhất | One-way ANOVA | Kruskal–Wallis |
| Liên hệ 2 biến định tính | Bảng tần số $r\times c$ | Tần số kỳ vọng $E_{ij} \ge 5$ (đa số ô) | Chi-square $\chi^2$ | Fisher's exact test |

## 3. Checklist Dữ Liệu Tái Lập (Mục 13)
1. Nguồn dữ liệu & giấy phép sử dụng (hoặc ghi rõ *dữ liệu người dùng* / *dữ liệu mô phỏng minh họa*).
2. Tách `raw` bất biến khỏi `processed` đã làm sạch.
3. Ghi rõ số lượng và cách xử lý giá trị thiếu (`missing`) & ngoại lệ (`outliers`).
4. Lưu tên script, phiên bản ngôn ngữ/thư viện (`python`, `scipy`, `pandas`) và không để lộ thông tin cá nhân (PII).
