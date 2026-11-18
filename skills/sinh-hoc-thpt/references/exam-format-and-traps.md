# Quy Tắc Chuyên Môn, Chẩn Đoán Lỗi & Cấu Trúc Thi — Sinh học THPT

## 1. Cấu trúc đề thi Tốt nghiệp THPT môn Sinh học (QĐ 764/QĐ-BGDĐT)
- **Văn bản căn cứ:** Quyết định 764/QĐ-BGDĐT ngày 08/03/2024 (áp dụng từ năm 2025). Nguồn: `https://thuvienphapluat.vn` / `https://chinhphu.vn` (kiểm tra `2026-11-18`).
- **Thời gian & cấu trúc:** **50 phút**, **28 câu / 10,0 điểm**:
  - **Phần I (18 câu):** Nhiều lựa chọn (4 chọn 1), $0,25\text{đ/câu}$ ($4,5\text{đ}$).
  - **Phần II (4 câu):** Đúng/Sai 4 ý a, b, c, d; lũy tiến **0,1 – 0,25 – 0,5 – 1,0đ/câu** ($4,0\text{đ}$).
  - **Phần III (6 câu):** Trả lời ngắn ($\le 4$ ký tự), $0,25\text{đ/câu}$ ($1,5\text{đ}$).

---

## 2. Quy tắc chuyên môn chẩn đoán 7 phần

### Quy tắc 1: Biện luận gen lặn nằm trên NST thường vs NST giới tính X (Chặn lỗi loại trừ sai!)
1. **Tình huống áp dụng:** Xác định vị trí gen quy định bệnh lặn trong sơ đồ phả hệ (NST thường hay vùng không tương đồng của NST X).
2. **Điều kiện / Giả định:** Mô hình di truyền Mendel cơ bản ($A$ trội hoàn toàn so với $a$; độ thâm nhập $100\%$, không xét đột biến mới hay trao đổi chéo giữa X và Y).
3. **Ví dụ sai & Giải thích lỗi:** *"Trong phả hệ thấy bố bị bệnh lặn ($X^a Y$) sinh ra con gái bình thường $\implies$ loại luôn gen lặn trên NST X."* *(Loại lỗi: lỗi suy luận/khái quát hóa sai)*. Phản ví dụ Mendel: nếu bố bị bệnh $X^a Y$ kết hôn với mẹ đồng hợp bình thường $X^A X^A$ (hoặc $X^A X^a$ truyền alen $X^A$), thì $100\%$ con gái mang kiểu gen $X^A X^a$ và **đều bình thường** dù gen vẫn nằm trên NST X!
4. **Ví dụ đúng:** Để **loại** trường hợp gen lặn nằm trên vùng không tương đồng của NST X (từ đó suy ra gen nằm trên NST thường), cần có ít nhất một trong hai bằng chứng phản bác sau:
   - **Bố bình thường ($X^A Y$) sinh con gái bị bệnh ($X^a X^a$)** (vô lý vì con gái phải nhận $X^A$ từ bố).
   - **Mẹ bị bệnh ($X^a X^a$) sinh con trai bình thường ($X^A Y$)** (vô lý vì con trai phải nhận $X^a$ từ mẹ).
5. **Câu hỏi chẩn đoán:** *"Nếu gen lặn thực sự nằm trên NST X, phép lai giữa bố bị bệnh ($X^a Y$) và mẹ bình thường đồng hợp ($X^A X^A$) sinh con gái có kiểu hình thế nào?"*
6. **Gợi ý sửa:** Kiểm tra chiều truyền $X$ của con gái (nhận 1 $X$ từ bố) và con trai (nhận $X$ từ mẹ): muốn loại gen lặn trên X, hãy tìm **con gái bị bệnh có bố bình thường** hoặc **mẹ bị bệnh có con trai bình thường**.
7. **Cách kiểm tra lại:** Viết thử kiểu gen lên phả hệ theo giả thuyết "gen lặn trên NST X"; nếu gán được kiểu gen hợp lệ cho cả bố, mẹ và con thì giả thuyết trên X **không bị bác bỏ**.

### Quy tắc 2: Không gian mẫu xác suất trong Di truyền quần thể ($Aa$ toàn quần thể vs nhóm trội)
1. **Tình huống áp dụng:** Tính tỉ lệ cá thể dị hợp $Aa$ từ quần thể cân bằng Hardy–Weinberg $p^2 AA + 2pq Aa + q^2 aa = 1$.
2. **Điều kiện / Giả định:** Quần thể ngẫu phối đang ở trạng thái cân bằng di truyền; trội hoàn toàn.
3. **Ví dụ sai & Giải thích lỗi:** Đề có $16\%$ hoa trắng ($aa$), hỏi *"tỉ lệ cây dị hợp $Aa$ trong tổng số các cây hoa đỏ"* lại trả lời $2pq = 0.48$ *(Loại lỗi: đọc sai yêu cầu / nhầm không gian mẫu)*.
4. **Ví dụ đúng:** $q^2 = 0.16 \implies q = 0.4, p = 0.6 \implies AA = 0.36, Aa = 0.48$. Trong tổng số cây hoa đỏ ($0.36 + 0.48 = 0.84$), tỉ lệ $Aa$ là $\frac{0.48}{0.84} = \frac{4}{7} \approx 0.57$.
5. **Câu hỏi chẩn đoán:** *"Câu hỏi đang xét xác suất trong tất cả các cây của quần thể ($=1$) hay chỉ giới hạn trong nhóm cây mang kiểu hình trội ($AA + Aa$)?"*
6. **Gợi ý sửa:** Khoanh tròn cụm từ *"trong tổng số..."* ở câu hỏi để xác định mẫu số trước khi chia.
7. **Cách kiểm tra lại:** Kiểm tra $\frac{AA}{AA+Aa} + \frac{Aa}{AA+Aa} = \frac{0.36}{0.84} + \frac{0.48}{0.84} = 1$.

### Quy tắc 3: Chiều mạch khuôn `DNA` và chiều tổng hợp `mRNA`
1. **Tình huống áp dụng:** Phiên mã từ một mạch đơn `DNA` cho trước sang trình tự `mRNA` hoặc giải mã chuỗi amino acid.
2. **Điều kiện / Giả định:** Không có đột biến cắt nối; đọc mã di truyền chuẩn trên `mRNA` theo chiều $5' \to 3'$.
3. **Ví dụ sai & Giải thích lỗi:** Đề cho đoạn mạch $5'\text{-ATG GGC-}3'$, học sinh đổi thẳng $T \to U$ mà không kiểm tra xem đó là mạch khuôn ($3'\to 5'$) hay mạch mã hóa ($5'\to 3'$) *(Loại lỗi: thiếu kiểm tra điều kiện chiều phân tử)*.
4. **Ví dụ đúng:** Enzyme RNA polymerase tổng hợp `mRNA` theo chiều $5' \to 3'$ dựa trên **mạch khuôn $3' \to 5'$**. Do đó:
   - Nếu mạch đã cho là **mạch khuôn $3' \to 5'$**: viết bổ sung $A-U, T-A, G-C, C-G$ để ra `mRNA` ($5' \to 3'$).
   - Nếu mạch đã cho là **mạch mã hóa $5' \to 3'$**: trình tự `mRNA` ($5' \to 3'$) giống mạch đó, chỉ thay $T$ bằng $U$.
5. **Câu hỏi chẩn đoán:** *"Mạch DNA đề cho đang ghi đầu $3'$ hay $5'$ ở bên trái, và nó là mạch khuôn hay mạch bổ sung (mã hóa)?"*
6. **Gợi ý sửa:** Ghi luôn cặp ký hiệu $3'/5'$ ở hai đầu mạch trước khi ghép từng nucleotide.
7. **Cách kiểm tra lại:** Đảm bảo hai mạch đối song (một đầu $3'$ khớp với một đầu $5'$ của mạch bổ sung) và bộ ba mở đầu trên `mRNA` phải đọc đúng chiều $5'\text{-AUG-}3'$.

### Quy tắc 4: Số loại giao tử của 1 tế bào vs 1 cơ thể
1. **Tình huống áp dụng:** Đếm số loại tinh trùng/trứng tối đa tạo ra từ một cơ thể hay một tế bào có kiểu gen dị hợp nhiều cặp (ví dụ $AaBb$).
2. **Điều kiện / Giả định:** Giảm phân bình thường, không đột biến.
3. **Ví dụ sai & Giải thích lỗi:** Đề hỏi **1 tế bào sinh tinh** $AaBb$ giảm phân không hoán vị tạo mấy loại tinh trùng, học sinh tính $2^2 = 4$ *(Loại lỗi: dùng công thức của cơ thể cho 1 tế bào)*.
4. **Ví dụ đúng:** 1 cơ thể $AaBb$ tạo tối đa $2^2 = 4$ loại giao tử; nhưng **1 tế bào sinh tinh** $AaBb$ (không hoán vị) chỉ tạo **2 loại** tinh trùng (tỉ lệ 1:1), còn **1 tế bào sinh trứng** luôn chỉ tạo **1 loại** trứng duy nhất!
5. **Câu hỏi chẩn đoán:** *"Một tế bào sinh tinh sau giảm phân tạo ra tất cả 4 tinh trùng từ 2 kiểu sắp xếp hay 1 kiểu sắp xếp ở kì giữa I? Còn 1 tế bào sinh trứng tạo ra mấy trứng có chức năng?"*
6. **Gợi ý sửa:** Gạch chân đối tượng *"1 tế bào sinh tinh / 1 tế bào sinh trứng"* vs *"1 cơ thể"* trước khi áp công thức $2^n$.
7. **Cách kiểm tra lại:** Nhớ 1 tế bào giảm phân II mỗi cặp NST kép tách ra chỉ có thể đi theo 1 cách phân li duy nhất nếu không có trao đổi chéo.

---

## 3. Ví dụ mẫu chuẩn 3 phần (Đã kiểm chứng)
- **Phần I:** Bộ ba mở đầu dịch mã trên `mRNA` ở sinh vật nhân thực: **$5'\text{-AUG-}3'$**.
- **Phần II (Phả hệ):** Bệnh P do alen lặn $a$ trên NST thường; bệnh M do alen lặn $b$ trên vùng không tương đồng của NST X. Bố (1) và mẹ (2) bình thường sinh con trai (3) mắc cả hai bệnh ($aaX^bY$): **a)** Kiểu gen mẹ (2) là $AaX^BX^b$ (**ĐÚNG**); **b)** Con trai (3) là $aaX^bY$ (**ĐÚNG**); **c)** Bố mẹ này không thể sinh con gái bệnh M (**ĐÚNG**, vì bố là $X^BY$ luôn truyền $X^B$ cho mọi con gái); **d)** Xác suất sinh con gái bình thường cả 2 bệnh là $\frac{3}{16}$ (**SAI**, $\frac{3}{4}(A-) \times \frac{1}{2}(\text{con gái } X^BX^-) = \frac{3}{8}$).
- **Phần III:** Quần thể cân bằng Hardy–Weinberg có $16\%$ hoa trắng ($aa$). Tỉ lệ hoa đỏ dị hợp ($Aa$) trong tổng số các cây hoa đỏ (làm tròn 2 chữ số thập phân) là $\frac{0.48}{0.36 + 0.48} = \frac{4}{7} \approx \mathbf{0.57}$.
