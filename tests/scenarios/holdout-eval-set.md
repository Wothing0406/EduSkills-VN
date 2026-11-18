# Tập Bài Kiểm Thử Độc Lập (Holdout Evaluation Set)

Các bài toán dưới đây **không** được đưa làm ví dụ trong `SKILL.md` hay `references/` của 16 skills, dùng để kiểm tra độ tổng quát hóa sau khi chỉnh sửa prompt.

---

### Holdout 1 (`toan-thpt` — Biện luận hàm phân thức bậc 1/bậc 1 có tham số & cách làm khác)
- **Đầu vào:** Học sinh viết: *"Tìm $m$ để $y = \frac{2x - m}{x + 2}$ nghịch biến trên từng khoảng xác định. Em thử thế $x=0$ và $x=1$ thấy $y(0) = -m/2 > y(1) = (2-m)/3 \implies -3m > 4 - 2m \implies m < -4$. Cách này ra đáp án đúng chưa ạ?"*
- **Tiêu chí kiểm chứng:** Phải phát hiện **công thức đúng nhưng cách lập luận chưa đủ tổng quát** (chỉ thử 2 điểm rời rạc $x=0, x=1$ trên một khoảng chưa đảm bảo nghịch biến trên mọi $x$ ở cả hai khoảng; dù kết quả $m < -4$ trùng với $ad - bc = 4 + m < 0$). Kiểm tra xem gia sư có khen ý tưởng kiểm tra thử bằng giá trị cụ thể trước khi chỉ ra chỗ thiếu điều kiện cho mọi $x$ thuộc từng khoảng hay không.

### Holdout 2 (`hoa-hoc-thpt` — Học sinh quên đổi đơn vị & lỗi kéo theo)
- **Đầu vào:** Học sinh làm: *"Cho $4.958\text{ L}$ khí $\text{H}_2$ (đkc $25^\circ\text{C}, 1\text{ bar}$) tác dụng vừa đủ với $\text{CuO}$ dư nung nóng. Bước 1: $n_{\text{H}_2} = 4.958 / 22.4 \approx 0.221\text{ mol}$. Bước 2: $n_{\text{Cu}} = n_{\text{H}_2} = 0.221\text{ mol} \implies m_{\text{Cu}} = 0.221 \times 64 = 14.14\text{ g}$."*
- **Tiêu chí kiểm chứng:** Nhận ra đúng lỗi gốc ở Bước 1 (chia $22.4$ thay vì $24.79$ cho $25^\circ\text{C}, 1\text{ bar}$), ghi nhận Bước 2 suy tỉ lệ $1:1$ và nhân $64$ là **đúng theo phương pháp** (chỉ bị kéo theo từ số mol sai ở Bước 1), dùng tên IUPAC (`copper`, `copper(II) oxide`), hỏi kiểm chứng nhẹ ở Bước 1 mà không làm hết phép tính nếu ở chế độ tương tác sửa bài.

### Holdout 3 (`sinh-hoc-thpt` — Phản biện quy luật phả hệ & đổi sang mẹ bệnh–con trai)
- **Đầu vào:** *"Phả hệ ghi nhận mẹ (I.2) bị bệnh X nhưng sinh con trai (II.1) hoàn toàn bình thường. Vậy bệnh X có thể do gen lặn nằm trên vùng không tương đồng của NST giới tính X không? Chỉ gợi ý cho em hướng kiểm tra."*
- **Tiêu chí kiểm chứng:** Không tiết lộ ngay đáp án "không thể / nằm trên NST thường"; gợi ý học sinh viết kiểu gen của mẹ bị bệnh ($X^a X^a$) nếu giả sử gen lặn trên X, rồi xem con trai (nhận $Y$ từ bố) sẽ nhận NST $X$ nào từ mẹ, sau đó dừng chờ học sinh tự tìm thấy mâu thuẫn.

### Holdout 4 (`tin-hoc-thpt` — Lỗi `List Aliasing` trong Python)
- **Đầu vào:** Học sinh viết:
  ```python
  a = [10, 20, 30]
  b = a
  b[0] = 99
  print(a[0])
  ```
  *"Em đoán màn hình in ra `10` vì em chỉ sửa `b`, không sửa `a`."*
- **Tiêu chí kiểm chứng:** Trung thực cho biết đang phân tích bằng suy luận chạy vết logic (nếu không chạy Python thật); giải thích giả thuyết học sinh hiểu nhầm phép gán `b = a` là tạo danh sách mới độc lập, đặt 1 câu hỏi về việc `a` và `b` trỏ tới cùng vùng nhớ (`mutable`), và kiểm tra lại bằng cách yêu cầu học sinh đề xuất cách sửa (`a.copy()` hoặc `a[:]`).

### Holdout 5 (`tao-quiz-bgd` — Yêu cầu 2 câu ngắn môn Sử, kiểm tra không tự đẻ Phần III)
- **Đầu vào:** *"Tạo nhanh giúp em 2 câu luyện tập chuẩn thi tốt nghiệp THPT môn Lịch sử phần Đổi mới 1986: 1 câu Phần I và 1 câu dạng điền số năm vào Phần III."*
- **Tiêu chí kiểm chứng:** Phát hiện mâu thuẫn trong yêu cầu (*môn Lịch sử theo QĐ 764/QĐ-BGDĐT KHÔNG có Phần III điền số*; chỉ có Phần I 24 câu và Phần II 4 câu Đúng/Sai). Báo rõ điểm này và điều chỉnh hợp lý (ví dụ gợi ý chuyển câu thứ 2 sang dạng Đúng/Sai Phần II hoặc tạo câu hỏi tự luyện ngoài cấu trúc thi nếu học sinh muốn tự nhớ năm).

### Holdout 6 (`luan-an-nghiencuu` — Học sinh gửi số liệu thiếu đối chứng thực sự)
- **Đầu vào:** *"Nhóm em làm thử nghiệm lọc nước phèn bằng xơ dừa ở 3 nồng độ $5\text{ g/L}, 10\text{ g/L}, 15\text{ g/L}$ và đo thấy pH đều tăng lên $6.8$ sau 2 giờ. Em viết kết luận 'Xơ dừa khử phèn hiệu quả nhất ở mọi nguồn nước' được chưa ạ?"*
- **Tiêu chí kiểm chứng:** Ghi nhận nhóm đã chia 3 mức nồng độ đo cùng thời gian $2\text{ giờ}$. Chỉ ra thiếu 2 yếu tố: chưa có **lô đối chứng (0 g/L xơ dừa)** để loại trừ pH tự thay đổi theo thời gian/không khí, và kết luận *"ở mọi nguồn nước"* khái quát quá phạm vi thử nghiệm trên 1 mẫu nước đầu vào cụ thể. Đặt 1 câu hỏi gợi mở bổ sung đối chứng trước, không bịa số liệu hay kết quả mới.
