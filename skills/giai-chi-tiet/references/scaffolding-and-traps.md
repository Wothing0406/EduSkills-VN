# Khung Chẩn Đoán 8 Bước, 8 Nhóm Lỗi & Hỗ Trợ 5 Mức

Sử dụng tài liệu này khi cần mẫu phân tích 8 nhóm lỗi chi tiết hoặc khung giải mẫu phân tầng đầy đủ cho bài tập THPT khó.

---

## 1. Bảng 8 nhóm lỗi cần phân biệt khi chẩn đoán bài làm

| Nhóm lỗi | Dấu hiệu nhận biết trong bài làm | Gợi ý hướng xử lý thích ứng |
| :--- | :--- | :--- |
| **1. Hiểu sai khái niệm** | Đánh đồng 2 khái niệm gần nhau (*điểm cực trị* vs *giá trị cực trị*; *thân thể* vs *chỗ ở*; *tỉ trọng* vs *giá trị*). | Dùng 1 câu hỏi đối chiếu khái niệm hoặc phản ví dụ để học sinh tự tách 2 ý. |
| **2. Thiếu kiến thức tiên quyết** | Hổng quy tắc nền từ lớp dưới (như giải $x^2 = 9$ thiếu $x = -3$, quên $T = t + 273$, nhầm `range` nửa khoảng). | Kiểm tra nhanh bằng 1 câu hỏi/bài nhỏ ở bước nền; nhắc lại ngắn gọn nếu hổng. |
| **3. Dùng công thức ngoài điều kiện** | Dùng dấu `≥` cho đơn điệu $\frac{ax+b}{cx+d}$; dùng Binary Search trên dãy chưa xếp; dùng $\Delta_f H^\circ$ kiểu $E_b$. | Hỏi ngay về tiền điều kiện áp dụng trước khi tính (*"Điều kiện nào cần có để..."*). |
| **4. Lỗi suy luận / chứng minh / khái quát** | Từ *"bố bị bệnh lặn sinh con gái bình thường"* suy ra loại gen lặn trên NST X; từ tỉ trọng giảm suy ra sản lượng giảm. | Đưa ngay **1 phản ví dụ cụ thể** ($X^aY \times X^AX^A$) để học sinh tự bác bỏ kết luận quá rộng. |
| **5. Tính toán, ký hiệu hoặc đơn vị** | Nhầm dấu `+`/`-`, quên nhân $10$ đổi `tấn/ha` $\to$ `tạ/ha`, chưa đổi lít sang $\text{m}^3$, viết sai chính tả `*acheivement`. | Khen phần lập mô hình đúng, chỉ rõ đúng dòng tính/đơn vị cần kiểm tra lại. |
| **6. Đọc sai yêu cầu** | Đề hỏi `tạ/ha` lại điền `tấn/ha`; hỏi *"phương thức chính"* lại kể 2 phương thức; đoạn 200 chữ lại tách 3 đoạn. | Yêu cầu học sinh đọc lại từ khóa ở câu hỏi cuối cùng của đề. |
| **7. Chưa đủ bằng chứng kết luận** | Chọn đáp án Reading bằng cảm tính hoặc trùng 1–2 từ lẻ (word-matching) không khớp nghĩa cả câu. | Hỏi *"Câu nào trong đoạn văn chứng minh trực tiếp cho ý này?"*. |
| **8. Chưa biết kiểm tra kết quả** | Ra nghiệm ngoài tập xác định ($x=1$ khi mẫu $x-1=0$), công suất hoặc năng suất vô lý so với thực tế. | Hướng dẫn tập thói quen thay nghiệm vào đề gốc và ước lượng độ lớn trước/sau tính. |

---

## 2. Cơ chế tăng – giảm mức hỗ trợ (5 Mức)
1. **Mức 1 – Nhắc mục tiêu:** Hỏi đại lượng hoặc yêu cầu cần đạt của câu hỏi.
2. **Mức 2 – Gợi nhớ kiến thức:** Nhắc điều kiện/định lý/quy phạm pháp lý liên quan.
3. **Mức 3 – Gợi ý thao tác:** Đề xuất tách trường hợp, vẽ sơ đồ, lập bảng vết hoặc kiểm tra 1 giá trị biên.
4. **Mức 4 – Làm mẫu một bước:** Thực hiện trọn vẹn bước đang kẹt nhất rồi giao bước kế tiếp cho học sinh.
5. **Mức 5 – Giải mẫu đầy đủ:** Chỉ dùng khi học sinh yêu cầu rõ, vẫn kẹt sau hỗ trợ, hoặc chưa đủ nền tảng tự làm.

*(Khi học sinh tự sửa được hoặc giải đúng bài biến thể, giảm mức hỗ trợ ngay ở lượt sau để khuyến khích tính độc lập).*

---

## 3. Ví dụ giải mẫu có hướng dẫn (Toán 12 – Khi học sinh yêu cầu lời giải chi tiết)
**Đề bài:** Tìm tọa độ giao điểm $I$ của hai đường tiệm cận của đồ thị $y = f(x) = \frac{x^2 - 3x + 6}{x - 1}$.

1. **Điều kiện & Nhận dạng:** Tập xác định $D = \mathbb{R} \setminus \{1\}$. Tại $x = 1$, mẫu bằng $0$ và tử bằng $4 \ne 0$. Bậc tử (2) lớn hơn bậc mẫu (1) đúng 1 bậc nên đồ thị có tiệm cận đứng và tiệm cận xiên.
2. **Tìm tiệm cận đứng:** $\lim_{x \to 1^+} f(x) = +\infty$ và $\lim_{x \to 1^-} f(x) = -\infty \implies$ Tiệm cận đứng: $x = 1$.
3. **Tìm tiệm cận xiên:** Chia đa thức: $x^2 - 3x + 6 = (x - 1)(x - 2) + 4 \implies f(x) = x - 2 + \frac{4}{x - 1}$.  
   Vì $\lim_{x \to \pm\infty}[f(x) - (x - 2)] = \lim_{x \to \pm\infty}\frac{4}{x-1} = 0 \implies$ Tiệm cận xiên: $y = x - 2$.
4. **Kết luận & Kiểm tra:** Giao điểm $I$ thỏa $x = 1, y = 1 - 2 = -1 \implies \mathbf{I(1; -1)}$. *(Lưu ý kiểm tra lại: đừng nhầm lấy tiệm cận ngang $y = a/c$ cho hàm bậc 2/bậc 1).*
