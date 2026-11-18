# Quy Tắc Chuyên Môn, Chẩn Đoán Lỗi & Cấu Trúc Thi — Tin học THPT

## 1. Cấu trúc đề thi Tốt nghiệp THPT môn Tin học (QĐ 764/QĐ-BGDĐT)
- **Văn bản căn cứ:** Quyết định 764/QĐ-BGDĐT ngày 08/03/2024 (áp dụng từ năm 2025). Nguồn: `https://luatvietnam.vn` / `https://thuvienphapluat.vn` (kiểm tra `2026-11-18`).
- **Hình thức & Thời gian:** Trắc nghiệm, **50 phút**, gồm **CHỈ 2 PHẦN** (**không** có Phần III trả lời ngắn), đề gồm 30 câu nhưng thí sinh làm **28 câu tính điểm (10,0đ)**:
  - **Phần I (24 câu chung):** Nhiều lựa chọn (4 chọn 1), $0,25\text{đ/câu}$ ($6,0\text{đ}$).
  - **Phần II (6 câu Đúng/Sai trên đề, thí sinh chọn 4 câu = $4,0\text{đ}$):** 2 câu chung bắt buộc + 2 câu nhánh **CS** + 2 câu nhánh **ICT** (thí sinh làm 2 chung + 2 câu đúng định hướng chọn).

---

## 2. Quy tắc chuyên môn chẩn đoán 7 phần

### Quy tắc 1: Nửa khoảng `range(a, b)` & Slicing `s[a:b]` trong Python
1. **Tình huống áp dụng:** Đọc hiểu vòng lặp `for` hoặc cắt chuỗi/danh sách để tìm kết quả in ra.
2. **Điều kiện / Giả định:** Python 3, chỉ số mảng đánh số từ `0`.
3. **Ví dụ sai & Giải thích lỗi:** Với `for i in range(1, 5): s += i`, học sinh cộng $1 + 2 + 3 + 4 + 5 = 15$ *(Loại lỗi: hiểu sai cận trên nửa khoảng `[a, b)`)*.
4. **Ví dụ đúng:** `range(1, 5)` chạy trên nửa khoảng `[1, 5)` gồm `1, 2, 3, 4` (dừng tại $5 - 1 = 4$), cho tổng $s = 10$. Với `range(1, 6, 2)` cho các chỉ số `1, 3, 5`.
5. **Câu hỏi chẩn đoán:** *"Trong Python, `range(1, 5)` có chạy tới chính giá trị `5` không hay dừng ngay trước `5`?"*
6. **Gợi ý sửa:** Viết liệt kê tường minh danh sách giá trị `i` trước khi chạy vết biến tích lũy `s`.
7. **Cách kiểm tra lại:** Nhớ quy tắc kiểm số phần tử: khi `step = 1` và `b > a`, số lần lặp đúng bằng `b - a`.

### Quy tắc 2: Thứ tự mệnh đề `WHERE` vs `HAVING` trong SQL
1. **Tình huống áp dụng:** Lọc dữ liệu có sử dụng hàm tổng hợp (`COUNT, SUM, AVG, MAX, MIN`) sau `GROUP BY`.
2. **Điều kiện / Giả định:** Truy vấn trên CSDL quan hệ chuẩn ANSI SQL.
3. **Ví dụ sai & Giải thích lỗi:** `SELECT MaLop, AVG(DiemSo) FROM BANG_DIEM WHERE AVG(DiemSo) >= 8.0 GROUP BY MaLop;` *(Loại lỗi: dùng hàm tổng hợp ngoài phạm vi cho phép của `WHERE`)*.
4. **Ví dụ đúng:** `WHERE` chỉ lọc từng bản ghi *trước* khi gom nhóm; điều kiện trên hàm tổng hợp *sau* `GROUP BY` bắt buộc đặt ở `HAVING`:  
   `SELECT MaLop, AVG(DiemSo) FROM BANG_DIEM GROUP BY MaLop HAVING AVG(DiemSo) >= 8.0;`
5. **Câu hỏi chẩn đoán:** *"Theo thứ tự thực thi SQL (`FROM -> WHERE -> GROUP BY -> HAVING -> SELECT`), ở bước `WHERE` đã gom nhóm xong theo `MaLop` để có giá trị `AVG(DiemSo)` của từng lớp chưa?"*
6. **Gợi ý sửa:** Tách điều kiện lọc từng dòng (như `MaMon = 'TOAN'`) để ở `WHERE`, còn điều kiện nhóm (`AVG(DiemSo) >= 8.0`) đưa sang `HAVING` sau `GROUP BY`.
7. **Cách kiểm tra lại:** Đọc từ trên xuống: mọi hàm `AVG/COUNT/SUM` làm điều kiện lọc đều không được nằm trong `WHERE`.

### Quy tắc 3: Điều kiện chạy Tìm kiếm nhị phân (Binary Search) & Phản ví dụ đầu vào
1. **Tình huống áp dụng:** Thiết kế hoặc phân tích độ phức tạp tìm kiếm $O(\log n)$ vs $O(n)$.
2. **Điều kiện / Giả định:** Dãy đầu vào `A` có $n$ phần tử có thể so sánh thứ tự.
3. **Ví dụ sai & Giải thích lỗi:** Áp dụng Tìm kiếm nhị phân cho `A = [9, 2, 7, 1, 5]` để tìm `x = 2` mà không sắp xếp trước *(Loại lỗi: dùng thuật toán ngoài điều kiện áp dụng)*.
4. **Ví dụ đúng:** Khi tìm `2` trong `[9, 2, 7, 1, 5]`, phần tử giữa là `7 > 2` $\implies$ thuật toán loại nửa phải và sang nửa trái; nếu dãy chưa sắp xếp mà `2` nằm ở nửa bị bỏ qua thì thuật toán kết luận sai `Không tìm thấy`. Phải sắp xếp đơn điệu trước (hoặc dùng Tìm kiếm tuần tự $O(n)$).
5. **Câu hỏi chẩn đoán:** *"Nếu phần tử `x = 2` nằm bên phải phần tử giữa `7` trong một dãy lộn xộn, Tìm kiếm nhị phân nhảy sang trái có bao giờ chạm được tới `2` không?"*
6. **Gợi ý sửa:** Luôn kiểm tra tiền điều kiện *"dãy đã sắp xếp tăng dần/giảm dần"* trước khi dùng `O(log n)`.
7. **Cách kiểm tra lại:** Chạy thử phản ví dụ nhỏ `A = [5, 1, 3]` tìm `x = 5` với quy ước dãy tăng dần: `mid = 1 < 5` $\to$ tìm nửa phải `[3]` $\to$ báo không có `5` (SAI).

### Quy tắc 4: Độ ưu tiên CSS (Specificity) & Tham chiếu `list` trong Python
1. **Tình huống áp dụng:** Xác định màu sắc cuối cùng của phần tử HTML khi nhiều bộ chọn CSS cùng trỏ vào; hoặc sửa phần tử sau phép gán `B = A` trên `list`.
2. **Điều kiện / Giả định:** Không có `!important` ngoại lệ khác; `list` trong Python là kiểu khả biến (mutable).
3. **Ví dụ sai & Giải thích lỗi:** Thấy `.dong-chan td { color: green; }` viết dưới dòng `#bang-diem td { color: blue; }` nên chọn màu `green` *(Loại lỗi: hiểu sai thứ tự ưu tiên)*; hoặc sửa `B[0] = 99` mà nghĩ `A[0]` giữ nguyên sau `B = A`.
4. **Ví dụ đúng:** Bộ chọn viết sau chỉ thắng khi **cùng độ ưu tiên**. Ngược lại: `Inline (1,0,0,0) > #id (0,1,0,0) > .class (0,0,1,0) > tag (0,0,0,1)` nên `#bang-diem td` (`0,1,0,1`) thắng `.dong-chan td` (`0,0,1,1`) $\implies$ chữ màu `blue`. Với Python, dùng `B = A.copy()` hoặc `A[:]` để không đổi `A`.
5. **Câu hỏi chẩn đoán:** *"Khi hai quy tắc CSS khác cấp độ (`#id` và `.class`) xung đột nhau, thứ tự dòng trên–dưới hay trọng số Specificity quyết định?"*
6. **Gợi ý sửa:** Tính bộ 4 số `(Inline, ID, Class/Pseudo-class, Tag)` cho từng bộ chọn trước khi so sánh.
7. **Cách kiểm tra lại:** So sánh từng vị trí từ trái sang phải của bộ 4 số Specificity.

---

## 3. Ví dụ mẫu chuẩn 2 phần (Đã kiểm chứng bằng chạy vết tay)
- **Phần I (Python):** `data = [4, 7, 2, 6, 5, 8]`, `for i in range(1, len(data), 2): res = res + data[i] if data[i]%2==0 else res - data[i]`. Chạy vết: `i=1 (7 -> -7)`, `i=3 (6 -> -1)`, `i=5 (8 -> 7)`. Output: **`7`**.
- **Phần II (Đúng/Sai - ICT):** `HOC_SINH(MaHS [PK], HoTen, MaLop)` và `BANG_DIEM(MaHS, MaMon [PK ghép], DiemSo)`: **a)** `MaHS` có thể xuất hiện nhiều lần trong `BANG_DIEM` (**ĐÚNG**, khóa ghép); **b)** Dùng `WHERE MaMon='TOAN' AND AVG(DiemSo)>=8.0` (**SAI**, phải chuyển `AVG(DiemSo)>=8.0` sang `HAVING` sau `GROUP BY`); **c)** Xóa học sinh ở `HOC_SINH` khi còn điểm ở `BANG_DIEM` (không `ON DELETE CASCADE`) bị từ chối (**ĐÚNG**); **d)** `#bang-diem td` (blue) vs `.dong-chan td` (green) trên `<tr id="bang-diem" class="dong-chan">` cho màu `green` (**SAI**, ID thắng Class nên ra `blue`).
