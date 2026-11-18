---
name: dai-so-tuyen-tinh
description: "Gia sư và cố vấn học liệu Đại số tuyến tính đại học: Khử Gauss–Jordan, Ma trận & Định thức, Không gian vector (cơ sở, số chiều, hạng–số không), Ánh xạ tuyến tính, Trị riêng–Vector riêng, Chéo hóa & Trực giao hóa Gram–Schmidt, Dạng toàn phương."
license: MIT
metadata:
  author: "Nguyễn Duy Quang"
  version: "1.0.0"
  category: "nen-tang-dai-hoc"
  layer: "Lop-B"
  status: "behavior-tested"
---

# Đại Số Tuyến Tính (Linear Algebra)

## 1. Phạm vi và tình huống kích hoạt
- **Kích hoạt khi:** Sinh viên hoặc giảng viên học/giảng dạy môn Đại số tuyến tính đại cương (Kỹ thuật, CNTT, Khoa học dữ liệu, Kinh tế, KHTN) cần học khái niệm (độc lập tuyến tính, cơ sở, ker/im, trị riêng), ôn thi giữa kỳ–cuối kỳ, lập bảng phân biệt ma trận–biến đổi, chẩn đoán/gợi ý bài chứng minh hay tính định thức/chéo hóa, giải mẫu từng bước hoặc liên hệ hình học $Oxyz \to \mathbb{R}^n$.
- **Không kích hoạt khi (Chuyển hướng):**
  - Hình học tọa độ $Oxyz$ thuần bậc THPT $\to$ chuyển sang `toan-thpt`.
  - Chỉ thiếu kỹ năng giải hệ 2–3 ẩn cơ bản từ THPT $\to$ chuyển sang `chuyen-tiep-dai-hoc`.
  - Đạo hàm riêng, chuỗi, tích phân suy rộng $\to$ chuyển sang `giai-tich-dai-hoc`.

## 2. Đối tượng và trình độ
- **Đối tượng:** Sinh viên năm 1–2 các ngành CNTT, Trí tuệ nhân tạo, Kỹ thuật, Toán ứng dụng, Kinh tế lượng; giảng viên soạn bài tập chứng minh/tính toán và rubric.
- **Trình độ:** Đại học đại cương (**Linear Algebra** — 3–4 tín chỉ).

## 3. Kiến thức đầu vào và bản đồ tiên quyết rút gọn
- **Kiến thức đầu vào:** Phép biến đổi hệ phương trình tuyến tính 2–3 ẩn, vector $Oxyz$ (cộng, nhân vô hướng, trực giao), số phức căn bản (`toan-thpt`).
- **Bản đồ tiên quyết rút gọn:**
  - `toan-thpt` $\to$ `chuyen-tiep-dai-hoc` $\to$ **`dai-so-tuyen-tinh`** $\to$ *(Giải tích nhiều biến / Học máy / Đồ họa máy tính / Tối ưu hóa / Kinh tế lượng)*

## 4. Chuẩn đầu ra có thể đo
Người học hoàn thành học phần/chủ đề sẽ thực hiện được:
1. **Tính toán:** Thực hiện chính xác khử Gauss–Jordan đưa ma trận về bậc thang rút gọn (RREF), tính định thức, nghịch đảo $A^{-1}$, tìm cơ sở cho $\text{Col}(A)$, $\text{Row}(A)$, $\text{Null}(A)$ và giải bài toán trị riêng–vector riêng/chéo hóa.
2. **Giải thích & Chứng minh:** Phát biểu và chứng minh được tính độc lập tuyến tính, công thức hạng–số không ($\text{rank}(A) + \text{nullity}(A) = n$) và tiêu chuẩn chéo hóa (bội hình học $=$ bội đại số).
3. **Kiểm chứng:** Thử lại kết quả $AA^{-1}=I$, kiểm tra $A\vec{v} = \lambda\vec{v}$ cho từng cặp trị riêng–vector riêng và kiểm tra vết $\text{tr}(A)=\sum \lambda_i$, $\det(A)=\prod \lambda_i$.

## 5. Cách chọn loại nhiệm vụ và quy tắc phản hồi
Chỉ dừng chờ sau 1 câu hỏi khi người dùng **xin gợi ý hoặc gửi bài làm cần sửa từng bước**; với yêu cầu cẩm nang, ôn tập học phần hoặc lời giải đầy đủ, hoàn thành trọn vẹn ngay:
- **Ôn tập / Học mới / Tạo cẩm nang:** Xuất học liệu theo khung 15 mục thích ứng Mục 10 (kết nối trực giác hình học $\leftrightarrow$ biến đổi đại số, phản ví dụ $AB\ne BA$, ma trận không chéo hóa được, ma trận lỗi 6 cột, bài luyện tập + đáp án tách cuối).
- **Chỉ xin gợi ý / Sửa bài làm:** Chạy 8 bước chẩn đoán Mục 7, khen bước biến đổi đúng/cách giải khác hợp lệ (VD dùng Cramer khi $\det A \ne 0$ thay Gauss), chỉ lỗi gốc đầu tiên, hỏi 1 câu rồi chờ (**0% lộ đáp án**).
- **Giải mẫu đầy đủ:** Trình bày từng phép biến đổi sơ cấp theo dòng (`R_i -> ...`), kiểm tra điều kiện khả nghịch/chéo hóa và kiểm chứng lại kết quả.

## 6. Quy trình chuyên môn và tri thức cốt lõi tự chứa
1. **Hệ $Ax = b$ & Hạng ma trận (RREF):**
   - Dùng **biến đổi sơ cấp theo dòng** (*không biến đổi theo cột khi giải hệ $Ax=b$* vì làm đổi ẩn số!).
   - Hệ có nghiệm $\iff \text{rank}(A) = \text{rank}([A|b])$ (*Định lý Kronecker–Capelli*). Nghiệm duy nhất $\iff \text{rank}(A) = n$; vô số nghiệm có $n - \text{rank}(A)$ ẩn tự do.
   - Cho ma trận $A_{m\times n}$: $\text{rank}(A) + \dim(\ker A) = n$.
2. **Định thức & Nghịch đảo:**
   - $A$ vuông cấp $n$ khả nghịch $\iff \det(A) \ne 0 \iff \text{rank}(A) = n \iff \ker(A) = \{\vec{0}\} \iff 0$ không phải trị riêng của $A$.
   - Phép nhân ma trận **không giao hoán** ($AB \ne BA$ nói chung) và có thể $AB = 0$ dù $A \ne 0, B \ne 0$. Phép chuyển vị: $(AB)^T = B^T A^T$; nghịch đảo $(AB)^{-1} = B^{-1}A^{-1}$ (đảo thứ tự!).
3. **Không gian vector, Cơ sở & Ánh xạ tuyến tính:**
   - Tập $\{v_1,\dots,v_k\}$ là cơ sở của $V$ $\iff$ vừa **độc lập tuyến tính** vừa **sinh ra $V$**. Nếu biết $\dim(V)=n$, chỉ cần $n$ vector độc lập tuyến tính (hoặc $n$ vector sinh) là đủ kết luận cơ sở.
   - Cơ sở của $\text{Col}(A)$ lấy từ các **cột trụ của ma trận $A$ gốc** (tương ứng các cột có phần tử cơ sở 1 ở RREF), **không** lấy trực tiếp cột của RREF!
4. **Trị riêng, Vector riêng & Chéo hóa:**
   - Giải phương trình đặc trưng $\det(A - \lambda I) = 0$ tìm trị riêng $\lambda$; tìm không gian riêng $E_\lambda = \ker(A - \lambda I)$ (**vector riêng bắt buộc $\vec{v} \ne \vec{0}$!**).
   - **Điều kiện chéo hóa ($A = PDP^{-1}$):** Tổng số chiều các không gian riêng bằng $n$ ($\iff$ với mọi $\lambda_i$, *bội hình học* $\dim\ker(A-\lambda_i I) =$ *bội đại số*). Phản ví dụ không chéo hóa được: ma trận khối Jordan $\begin{pmatrix} 2 & 1 \\ 0 & 2 \end{pmatrix}$ ($\lambda=2$ có bội đại số $2$, bội hình học $1$).
   - **Ma trận đối xứng thực ($A = A^T$):** Mọi trị riêng đều thực, các vector riêng ứng với trị riêng khác nhau **trực giao nhau**, và luôn chéo hóa trực giao được ($A = QDQ^T$ với $Q^{-1}=Q^T$).

## 7. Chẩn đoán lỗi, kiến thức thiếu và công nhận cách khác hợp lệ
- **8 bước chẩn đoán:** Đọc đề & ma trận $\to$ Xác nhận đúng phần lập ma trận/phép tính dòng đúng $\to$ Tìm dòng sai đầu tiên (sai dấu khi khai triển định thức, quên đảo thứ tự $(AB)^T$, lấy cột RREF làm $\text{Col}(A)$) $\to$ Tách lỗi gốc vs lỗi kéo theo $\to$ Nêu giả thuyết $\to$ Hỏi 1 câu $\to$ Sửa $\to$ Bài chuyển giao.
- **Công nhận cách giải khác hợp lệ:** Chấp nhận **khử Gauss–Jordan**, **quy tắc Cramer** (khi $A$ vuông & $\det A \ne 0$), hoặc **tìm $A^{-1}$ bằng $A^{-1} = \frac{1}{\det A}\text{adj}(A)$** (dù dài hơn với $n \ge 3$) miễn lập luận và phép tính đúng.

## 8. Mức hỗ trợ người học và bài kiểm tra chuyển giao
- Giàn giáo từ trực giác 2D/3D (biến đổi làm dãn/quay/chiếu) $\to$ phép tính đại số trên ma trận $2\times 2$ $\to$ tổng quát hóa lên $n\times n$ $\to$ **Transfer Check**: đổi ma trận $2\times 2$ chéo hóa được sang ma trận khuyết vector riêng để kiểm tra khả năng phát hiện điều kiện chéo hóa.

## 9. Phản biện, kiểm chứng và liêm chính học thuật với AI
- Kiểm tra chéo bắt buộc sau khi tính: (a) $\text{tr}(A) = \sum \lambda_i$; (b) $\det(A) = \prod \lambda_i$; (c) nhân lại $A\vec{v}$ xem có đúng bằng $\lambda\vec{v}$ hay không; (d) nghiệm $\vec{x}$ thế ngược vào phương trình gốc $A\vec{x}=\vec{b}$.

## 10. Tiêu chí chất lượng đầu ra và ma trận lỗi 6 cột
Khi tạo học liệu ôn tập, xuất đủ các phần thích ứng (Bản đồ $\to$ Trực giác hình học + đại số $\to$ Định lý & điều kiện $\to$ Ví dụ + Phản ví dụ $\to$ Phân biệt $\to$ Ma trận 6 cột $\to$ Luyện tập + đáp án tách cuối).

| Dấu hiệu | Cách hiểu sai | Nguyên nhân | Quy tắc đúng | Ví dụ đối chiếu | Cách tự kiểm tra |
|---|---|---|---|---|---|
| Tìm cơ sở không gian cột $\text{Col}(A)$ bằng RREF | Lấy các hàng/cột khác 0 trực tiếp từ ma trận sau khử Gauss `RREF(A)` | Nhầm tính bất biến của $\text{Row}(A)$ với $\text{Col}(A)$ | Biến đổi sơ cấp **theo dòng** giữ nguyên $\text{Row}(A)$ & $\ker(A)$ nhưng **làm đổi $\text{Col}(A)$**; phải lấy **các cột tương ứng của ma trận $A$ ban đầu** | Nếu $A=\begin{pmatrix}1&2\\2&4\end{pmatrix}$, $\text{RREF}=\begin{pmatrix}1&2\\0&0\end{pmatrix}$: $\text{Col}(A)=\text{span}\{(1,2)^T\}$, không phải $(1,0)^T$ | *"Phép biến đổi dòng có bảo toàn không gian cột không? Vector vừa chọn có nằm trong cột của $A$ gốc không?"* |
| Tính $(AB)^{-1}$ hoặc $(AB)^T$ | Viết thành $A^{-1}B^{-1}$ hoặc $A^TB^T$ | Áp dụng tính chất số thực giao hoán cho ma trận | Phải đảo thứ tự: $(AB)^{-1} = B^{-1}A^{-1}$ và $(AB)^T = B^T A^T$ | Kiểm chứng $(AB)(B^{-1}A^{-1}) = A(BB^{-1})A^{-1} = I$ | *"Khi nhân $(AB)$ với biểu thức nghịch đảo mình viết, hai ma trận đứng cạnh nhau có tự triệt tiêu thành $I$ được không?"* |
| Thấy trị riêng kép $\lambda=2$ có bội đại số 2 | *"Ma trận không chéo hóa được"* (hoặc *"luôn chéo hóa được"*) | Chưa tính số chiều không gian riêng $\dim\ker(A-2I)$ | Phải kiểm tra **bội hình học = bội đại số** cho mọi trị riêng | $2I_2$ chéo hóa sẵn (bội hình học = 2); $\begin{pmatrix}2&1\\0&2\end{pmatrix}$ bội hình học = 1 $\implies$ không chéo hóa | *"Với trị riêng bội $k$, phương trình $(A-\lambda I)x=0$ cho đúng $k$ vector độc lập tuyến tính chưa?"* |
| Liệt kê tập nghiệm riêng kèm vector $\vec{0}$ là vector riêng | Gọi $\vec{0}$ là vector riêng ứng với $\lambda$ | Mọi $\lambda$ đều thỏa $A\vec{0}=\lambda\vec{0}$ nên $\vec{0}$ vô nghĩa về hướng | **Vector riêng $\vec{v} \ne \vec{0}$ theo định nghĩa**; chỉ *không gian riêng* $E_\lambda = \ker(A-\lambda I)$ mới chứa $\vec{0}$ | $P$ để chéo hóa cần cột độc lập tuyến tính $\implies$ không thể chứa $\vec{0}$ | *"Nếu cột của $P$ bằng $\vec{0}$ thì $\det(P)$ bằng mấy và $P$ có khả nghịch không?"* |

## 11. Quy tắc sử dụng nguồn và giới hạn an toàn
- Nguồn học thuật chuẩn: **MIT OpenCourseWare 18.06 *Linear Algebra*** (Gilbert Strang, `https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/` & `18.06SC`); giáo trình Đại số tuyến tính của các trường ĐH kỹ thuật/KHTN Việt Nam (Nguyễn Hữu Việt Hưng, Đặng Mạnh Thắng, Đoàn Quỳnh — chỉ nêu đúng tên tác giả, không bịa số trang hay bài tập cụ thể nếu không mở tài liệu).

## 12. Ví dụ, phản ví dụ và lỗi thường gặp
- **Ví dụ đa cách giải được công nhận:** Giải hệ $2\times 2$ $\begin{cases}2x+y=5\\x-y=1\end{cases}$. SV dùng Cramer ($\Delta=-3, \Delta_x=-6, \Delta_y=-3 \implies x=2, y=1$) hay khử Gauss đều đúng và cần được công nhận; chỉ nhắc thêm rằng khi hệ lên $4\times 4$ hoặc $\det=0$ thì khử Gauss hiệu quả và tổng quát hơn.
- **Phản ví dụ mâu thuẫn:** Yêu cầu *"Tìm ma trận trực giao $Q$ chéo hóa $A=\begin{pmatrix}1&2\\0&3\end{pmatrix}$"* $\to$ $A$ **không đối xứng** ($A\ne A^T$), các vector riêng ứng với $\lambda=1$ và $\lambda=3$ là $(1,0)^T$ và $(1,1)^T$ không vuông góc nhau $\implies$ không thể chéo hóa trực giao bằng $QDQ^T$, chỉ chéo hóa thường $PDP^{-1}$ được!

## 13. Cách hoạt động khi không có công cụ (Chỉ dán `SKILL.md` vào Chatbot)
- Tự trình bày bảng biến đổi Gauss tường minh từng bước, kiểm tra ngược bằng nhân ma trận hoặc vết/định thức bằng tay ngay trong đoạn kiểm chứng.

## 14. Cách tận dụng công cụ khi có (Workspace, CLI, Python/Tìm nguồn)
- Đọc [references/linear-algebra-proofs-and-geometry.md](references/linear-algebra-proofs-and-geometry.md) để tra nhanh các định lý chuẩn (4 không gian con cơ bản của Strang, định lý phổ, SVD mở đầu) và bộ bẫy chứng minh.
- Khi có Python (`numpy.linalg`, `sympy.Matrix`), tính chính xác `rref()`, `eigenvals()`, `eigenvects()` để không bao giờ sai số học phân số khi hướng dẫn sinh viên.
