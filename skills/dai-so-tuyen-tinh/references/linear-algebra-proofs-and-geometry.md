# Bốn Không Gian Con Cơ Bản, Chéo Hóa & Bộ Chứng Minh Đại Số Tuyến Tính

Tài liệu tham chiếu mở rộng cho `dai-so-tuyen-tinh` (đối chiếu chuẩn MIT OCW 18.06 — Gilbert Strang).

## 1. Bốn Không Gian Con Cơ Bản (The Four Fundamental Subspaces) của $A_{m \times n}$ có hạng $r$

| Không gian con | Nằm trong | Số chiều ($\dim$) | Cách tìm cơ sở đúng từ RREF & $A$ | Trực giao từng cặp |
|---|---|---|---|---|
| **Không gian hàng $\text{Row}(A) = \text{Col}(A^T)$** | $\mathbb{R}^n$ | $r$ | Lấy $r$ hàng khác $0$ của ma trận bậc thang / RREF | $\text{Row}(A) \perp \text{Null}(A)$ |
| **Không gian hạch $\text{Null}(A) = \ker(A)$** | $\mathbb{R}^n$ | $n - r$ | Gán tham số cho $n - r$ biến tự do trong hệ $Rx=0$ | $\dim + \dim = n$ |
| **Không gian cột $\text{Col}(A) = \text{Im}(A)$** | $\mathbb{R}^m$ | $r$ | Lấy $r$ cột **của ma trận $A$ gốc** tại vị trí cột trụ | $\text{Col}(A) \perp \text{Null}(A^T)$ |
| **Hạch trái $\text{Null}(A^T)$** | $\mathbb{R}^m$ | $m - r$ | Giải $A^T y = 0$ bằng khử Gauss | $\dim + \dim = m$ |

## 2. Điều kiện tương đương cho Ma trận vuông $A_{n\times n}$ khả nghịch (Invertible Matrix Theorem)
Các mệnh đề sau hoàn toàn tương đương nhau:
1. $A$ khả nghịch ($\exists A^{-1}: AA^{-1} = I_n$).
2. $\det(A) \ne 0$.
3. $\text{rank}(A) = n$ và $\text{RREF}(A) = I_n$.
4. $\ker(A) = \{\vec{0}\}$ (hệ $Ax=0$ chỉ có nghiệm tầm thường).
5. Các cột của $A$ độc lập tuyến tính và tạo thành một cơ sở của $\mathbb{R}^n$.
6. $\lambda = 0$ **không** phải trị riêng của $A$.

## 3. Liên hệ sang Học máy & Khoa học dữ liệu (SVD & PCA)
- Với ma trận $A$ bất kỳ (kể cả không vuông $m\times n$), phân rã **SVD** $A = U\Sigma V^T$ luôn tồn tại dù $A$ không chéo hóa được.
- Với ma trận hiệp phương sai đối xứng thực $S = \frac{1}{n-1}X^T X$, $S$ nửa xác định dương ($\lambda_i \ge 0$) và luôn chéo hóa trực giao được $\implies$ nền tảng trực tiếp của **PCA (Phân tích thành phần chính)**.
